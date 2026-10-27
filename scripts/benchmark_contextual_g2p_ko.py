#!/usr/bin/env python3
"""Score sentence-context G2P predictions against a pinned UGTPHON Korean split.

This is a strict evaluator/adapter boundary, not a NN-KoG2P implementation.
The model-specific runner must consume each complete canonical sentence with
its context intact and emit a sentence-level IPA string. Do not feed it the
raw noisy sentence when scoring against the canonical-form IPA gold.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from benchmark_ugtphon_ko import edit_distance, load_corpus, normalize_ipa


def load_predictions(path: Path) -> dict[str, dict[str, Any]]:
    """Load one JSON object per line, preserving sentence IDs and input provenance."""
    predictions: dict[str, dict[str, Any]] = {}
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"prediction line {line_number} is not valid JSON: {exc}") from exc
        if not isinstance(item, dict):
            raise ValueError(f"prediction line {line_number} must be a JSON object")
        for field in ("id", "input_canonical", "predicted_ipa"):
            if not isinstance(item.get(field), str) or not item[field].strip():
                raise ValueError(f"prediction line {line_number} needs non-empty string {field!r}")
        if item.get("output_kind") != "ipa":
            raise ValueError(f"prediction line {line_number}: output_kind must be 'ipa'")
        if item.get("input_granularity") != "sentence":
            raise ValueError(f"prediction line {line_number}: input_granularity must be 'sentence'")
        if item["id"] in predictions:
            raise ValueError(f"duplicate prediction id {item['id']!r}")
        predictions[item["id"]] = item
    return predictions


def evaluate(rows: list[dict[str, Any]], predictions: dict[str, dict[str, Any]]) -> dict[str, Any]:
    """Score identical sentence IDs; missing outputs reduce coverage, never the denominator silently."""
    gold_by_id = {str(row["id"]): row for row in rows}
    extra_ids = sorted(set(predictions) - set(gold_by_id))
    scored: list[dict[str, Any]] = []
    missing_ids: list[str] = []
    input_mismatches: list[dict[str, str]] = []
    for row in rows:
        row_id = str(row["id"])
        item = predictions.get(row_id)
        if item is None:
            missing_ids.append(row_id)
            continue
        expected_input = str(row["canonical"])
        if item["input_canonical"] != expected_input:
            input_mismatches.append({
                "id": row_id,
                "expected_input_canonical": expected_input,
                "reported_input_canonical": item["input_canonical"],
            })
            continue
        predicted_raw = item["predicted_ipa"]
        if any("\uac00" <= char <= "\ud7a3" for char in predicted_raw):
            raise ValueError(f"prediction {row_id!r} contains Hangul; provide a documented IPA adapter first")
        gold_raw = row["phonemes"]
        predicted = normalize_ipa(predicted_raw)
        gold = normalize_ipa(gold_raw)
        if not gold:
            # Empty gold is not silently scored as an exact match.
            missing_ids.append(row_id)
            continue
        distance = edit_distance(predicted, gold)
        scored.append({
            "id": row_id,
            "input_canonical": expected_input,
            "gold_ipa": gold_raw,
            "predicted_ipa": predicted_raw,
            "normalized_gold_ipa": gold,
            "normalized_predicted_ipa": predicted,
            "distance": distance,
            "reference_length": len(gold),
            "exact": distance == 0,
            "engine": item.get("engine", "unspecified"),
            "model_revision": item.get("model_revision", "unspecified"),
        })
    total_ref = sum(item["reference_length"] for item in scored)
    total_distance = sum(item["distance"] for item in scored)
    exact = sum(item["exact"] for item in scored)
    return {
        "schema_version": 1,
        "benchmark": "UGTPHON Korean test split; sentence-context evaluation",
        "scoring_unit": "sentence",
        "input_contract": "complete canonical sentence; context and token order preserved",
        "output_contract": "sentence-level IPA after a documented, explicit phone-to-IPA adapter",
        "rows": len(rows),
        "scored_sentences": len(scored),
        "coverage": round(len(scored) / len(rows), 6) if rows else None,
        "exact_matches": exact,
        "exact_match_rate": round(exact / len(scored), 6) if scored else None,
        "character_error_rate": round(total_distance / total_ref, 6) if total_ref else None,
        "reference_characters": total_ref,
        "missing_prediction_ids": missing_ids,
        "input_mismatch_ids": input_mismatches,
        "extra_prediction_ids": extra_ids,
        "predictions": scored,
        "limitations": [
            "This evaluator does not implement or emulate NN-KoG2P and does not establish that a particular engine is NN-KoG2P.",
            "The model-specific adapter must preserve the original sentence context and record its exact code/model revisions.",
            "NN-KoG2P's reported phone inventory must be mapped to IPA only using a verified source-backed mapping; raw custom phones are not IPA.",
            "Sentence-level metrics are not directly comparable with the existing token-level reports unless every comparison engine is evaluated on the same sentence IDs and output contract.",
            "Do not train, tune, or select checkpoints against this test split or the project's 24-form holdout.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, required=True, help="pinned UGTPHON Korean test JSON")
    parser.add_argument("--predictions", type=Path, required=True, help="JSONL model outputs; see docs/NN-KOG2P-BENCHMARK-ATTEMPT-2026-10-26.md")
    parser.add_argument("--output", type=Path, required=True, help="destination JSON report")
    args = parser.parse_args()
    try:
        rows = load_corpus(args.corpus)
        predictions = load_predictions(args.predictions)
        report = evaluate(rows, predictions)
    except Exception as exc:
        print(f"benchmark failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(rendered, encoding="utf-8")
    print(json.dumps({
        key: report[key] for key in (
            "benchmark", "rows", "scored_sentences", "coverage",
            "exact_matches", "exact_match_rate", "character_error_rate",
            "missing_prediction_ids", "input_mismatch_ids", "extra_prediction_ids",
        )
    }, ensure_ascii=False, indent=2))
    # Mismatched inputs/extra outputs indicate an invalid run, not a valid score.
    return 1 if report["input_mismatch_ids"] or report["extra_prediction_ids"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
