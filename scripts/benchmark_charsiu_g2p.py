#!/usr/bin/env python3
"""Optional, research-only CharsiuG2P multilingual ByT5 benchmark runner.

This adapter is intentionally outside production dependencies. It scores the
same already-tokenized Hangul tokens and IPA references as the existing
UGTPHON benchmark; it does not segment Korean text or render Ukrainian output.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from benchmark_ugtphon_ko import edit_distance, load_corpus, normalize_ipa

HANGUL = __import__("re").compile(r"^[\uac00-\ud7a3]+$")


def eligible_occurrences(rows: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[str]]:
    occurrences: list[dict[str, Any]] = []
    words: list[str] = []
    seen: set[str] = set()
    for row in rows:
        for token in row["tokens"]:
            word, gold = token.get("canonical", ""), token.get("phoneme", "")
            if not isinstance(word, str) or not HANGUL.fullmatch(word):
                continue
            if not isinstance(gold, str) or not gold.strip():
                continue
            occurrences.append({"row_id": str(row["id"]), "word": word, "gold": gold})
            if word not in seen:
                words.append(word)
                seen.add(word)
    return occurrences, words


def score_prediction(prediction: str, gold_raw: str) -> dict[str, Any]:
    predicted = normalize_ipa(prediction)
    variants = [normalize_ipa(x) for x in gold_raw.split(",") if x.strip()]
    if not variants:
        raise ValueError("gold IPA has no non-empty variants")
    distance, reference = min(
        ((edit_distance(predicted, gold), gold) for gold in variants),
        key=lambda item: item[0],
    )
    return {
        "predicted": prediction,
        "normalized_predicted": predicted,
        "closest_normalized_gold": reference,
        "distance": distance,
        "exact": distance == 0,
        "reference_length": len(reference),
    }


def load_model(model_id: str, revision: str, tokenizer_id: str, tokenizer_revision: str):
    try:
        import torch
        from transformers import AutoTokenizer, T5ForConditionalGeneration
    except ImportError as exc:
        raise RuntimeError(
            "Neural benchmark dependencies are optional; install pinned torch and transformers"
        ) from exc
    tokenizer = AutoTokenizer.from_pretrained(tokenizer_id, revision=tokenizer_revision)
    model = T5ForConditionalGeneration.from_pretrained(model_id, revision=revision)
    model.eval()
    return torch, tokenizer, model


def predict(words: list[str], *, model_id: str, revision: str,
            tokenizer_id: str, tokenizer_revision: str, batch_size: int = 16) -> dict[str, str]:
    if batch_size < 1:
        raise ValueError("batch_size must be positive")
    torch, tokenizer, model = load_model(model_id, revision, tokenizer_id, tokenizer_revision)
    result: dict[str, str] = {}
    # CharsiuG2P upstream documents the <kor>: language prefix and requires
    # pre-tokenized words. This benchmark passes corpus token canonical forms.
    for start in range(0, len(words), batch_size):
        batch = words[start:start + batch_size]
        encoded = tokenizer(
            [f"<kor>: {word}" for word in batch],
            padding=True, add_special_tokens=False, return_tensors="pt",
        )
        with torch.no_grad():
            output = model.generate(**encoded, num_beams=1, max_length=80)
        decoded = tokenizer.batch_decode(output.tolist(), skip_special_tokens=True)
        if len(decoded) != len(batch):
            raise RuntimeError(f"model returned {len(decoded)} predictions for {len(batch)} inputs")
        for word, value in zip(batch, decoded):
            value = value.strip()
            if not value:
                raise ValueError(f"empty neural prediction for {word!r}")
            if any("\uac00" <= ch <= "\ud7a3" for ch in value):
                raise ValueError(f"unexpected Hangul in IPA output for {word!r}: {value!r}")
            result[word] = value
    return result


def evaluate(rows: list[dict[str, Any]], predictions: dict[str, str]) -> dict[str, Any]:
    occurrences, words = eligible_occurrences(rows)
    scored = []
    missing = []
    for index, item in enumerate(occurrences):
        prediction = predictions.get(item["word"])
        if prediction is None:
            missing.append(item["word"])
            continue
        scored.append({
            "occurrence_id": index,
            "row_id": item["row_id"],
            "word": item["word"],
            "gold": item["gold"],
            **score_prediction(prediction, item["gold"]),
        })
    total_ref = sum(x["reference_length"] for x in scored)
    total_distance = sum(x["distance"] for x in scored)
    exact = sum(x["exact"] for x in scored)
    return {
        "schema_version": 1,
        "engine": "CharsiuG2P multilingual ByT5",
        "model_id": os.environ.get("CHARSIU_MODEL_ID", "charsiu/g2p_multilingual_byT5_small_100"),
        "model_revision": os.environ.get("CHARSIU_MODEL_REVISION", "UNPINNED"),
        "tokenizer_id": os.environ.get("CHARSIU_TOKENIZER_ID", "google/byt5-small"),
        "tokenizer_revision": os.environ.get("CHARSIU_TOKENIZER_REVISION", "UNPINNED"),
        "dataset": "pinned input supplied by caller; score is diagnostic only",
        "eligible_occurrences": len(occurrences),
        "unique_words": len(words),
        "scored_occurrences": len(scored),
        "coverage": round(len(scored) / len(occurrences), 6) if occurrences else None,
        "exact_matches": exact,
        "exact_match_rate": round(exact / len(scored), 6) if scored else None,
        "character_error_rate": round(total_distance / total_ref, 6) if total_ref else None,
        "missing_predictions": len(missing),
        "missing_word_examples": missing[:50],
        "predictions": scored,
        "limitations": [
            "Upstream model results are not comparable unless dataset and normalization match.",
            "Korean segmentation is inherited from corpus tokenization; this is not a sentence-level segmentation evaluation.",
            "IPA exact/CER scores are diagnostic and do not validate Ukrainian target rendering.",
            "Model and tokenizer revisions must be pinned before a run is accepted as reproducible.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--corpus", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--model", default=os.environ.get("CHARSIU_MODEL_ID", "charsiu/g2p_multilingual_byT5_small_100"))
    parser.add_argument("--model-revision", default=os.environ.get("CHARSIU_MODEL_REVISION"))
    parser.add_argument("--tokenizer", default=os.environ.get("CHARSIU_TOKENIZER_ID", "google/byt5-small"))
    parser.add_argument("--tokenizer-revision", default=os.environ.get("CHARSIU_TOKENIZER_REVISION"))
    parser.add_argument("--batch-size", type=int, default=16)
    args = parser.parse_args()
    if not args.model_revision or not args.tokenizer_revision:
        parser.error("--model-revision and --tokenizer-revision are required; floating model revisions are not reproducible")
    rows = load_corpus(args.corpus)
    _, words = eligible_occurrences(rows)
    predictions = predict(words, model_id=args.model, revision=args.model_revision,
                          tokenizer_id=args.tokenizer, tokenizer_revision=args.tokenizer_revision,
                          batch_size=args.batch_size)
    os.environ["CHARSIU_MODEL_ID"] = args.model
    os.environ["CHARSIU_MODEL_REVISION"] = args.model_revision
    os.environ["CHARSIU_TOKENIZER_ID"] = args.tokenizer
    os.environ["CHARSIU_TOKENIZER_REVISION"] = args.tokenizer_revision
    report = evaluate(rows, predictions)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in (
        "engine", "model_id", "model_revision", "tokenizer_revision",
        "eligible_occurrences", "scored_occurrences", "coverage", "exact_matches",
        "exact_match_rate", "character_error_rate", "missing_predictions",
    )}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
