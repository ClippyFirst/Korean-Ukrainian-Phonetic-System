#!/usr/bin/env python3
"""Research-only runner for pinned multilingual ByT5 Korean G2P checkpoints.

CharsiuG2P remains the default candidate; CLI metadata allows separately licensed
checkpoints to be evaluated without mislabelling their model, tokenizer, or IPA convention.
The adapter evaluates corpus-tokenized Hangul words only, not sentence context.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from benchmark_ugtphon_ko import edit_distance, load_corpus, normalize_ipa
from benchmark_multi_engine_ko import _ipa_segments, _segment_edit_distance, _segment_features

HANGUL = re.compile(r"^[\uac00-\ud7a3]+$")


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
    predicted_segments = _ipa_segments(predicted)
    reference_segments = _ipa_segments(reference)
    phoneme_distance = _segment_edit_distance(predicted_segments, reference_segments)
    feature_distance = _segment_edit_distance(predicted_segments, reference_segments, weighted=True)
    unsupported_segments = sum(_segment_features(segment).get("kind") == "unknown" for segment in predicted_segments)
    return {
        "predicted": prediction,
        "normalized_predicted": predicted,
        "closest_normalized_gold": reference,
        "distance": distance,
        "exact": distance == 0,
        "reference_length": len(reference),
        "phoneme_distance": phoneme_distance,
        "phoneme_reference_length": len(reference_segments),
        "phoneme_error_rate": phoneme_distance / len(reference_segments) if reference_segments else None,
        "feature_error_distance_proxy": feature_distance,
        "feature_error_rate_proxy": feature_distance / len(reference_segments) if reference_segments else None,
        "unsupported_feature_segments": unsupported_segments,
    }


def load_model(model_id: str, revision: str, tokenizer_id: str, tokenizer_revision: str):
    try:
        import torch
        from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    except ImportError as exc:
        raise RuntimeError(
            "Neural benchmark dependencies are optional; install pinned torch and transformers"
        ) from exc
    tokenizer = AutoTokenizer.from_pretrained(tokenizer_id, revision=tokenizer_revision)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_id, revision=revision)
    # Hugging Face resolves short immutable commit prefixes to full commit SHAs.
    os.environ["CHARSIU_RESOLVED_MODEL_REVISION"] = (
        getattr(model.config, "_commit_hash", None) or revision
    )
    tokenizer_init = getattr(tokenizer, "init_kwargs", {})
    os.environ["CHARSIU_RESOLVED_TOKENIZER_REVISION"] = (
        tokenizer_init.get("_commit_hash") or tokenizer_revision
    )
    torch.set_num_threads(max(1, min(4, os.cpu_count() or 1)))
    try:
        torch.set_num_interop_threads(1)
    except RuntimeError:
        pass
    model.eval()
    return torch, tokenizer, model


def predict(words: list[str], *, model_id: str, revision: str,
            tokenizer_id: str, tokenizer_revision: str, batch_size: int = 16,
            language_prefix: str = "<kor>:"
            ) -> tuple[dict[str, str], dict[str, dict[str, str]]]:
    """Return valid predictions and explicit per-word failures without hiding partial coverage."""
    if batch_size < 1:
        raise ValueError("batch_size must be positive")
    torch, tokenizer, model = load_model(model_id, revision, tokenizer_id, tokenizer_revision)
    result: dict[str, str] = {}
    failures: dict[str, dict[str, str]] = {}
    # The input prefix is checkpoint-specific and is recorded in the run manifest.
    for start in range(0, len(words), batch_size):
        batch = words[start:start + batch_size]
        try:
            encoded = tokenizer(
                [f"{language_prefix} {word}" for word in batch],
                padding=True, add_special_tokens=False, return_tensors="pt",
            )
            with torch.no_grad():
                output = model.generate(**encoded, num_beams=1, max_length=80)
            decoded = tokenizer.batch_decode(output.tolist(), skip_special_tokens=True)
            if len(decoded) != len(batch):
                raise RuntimeError(f"model returned {len(decoded)} predictions for {len(batch)} inputs")
        except Exception as exc:
            reason = f"{type(exc).__name__}: {exc}"
            for word in batch:
                failures[word] = {"status": "model_error", "reason": reason}
            continue
        for word, value in zip(batch, decoded):
            if not isinstance(value, str) or not value.strip():
                failures[word] = {"status": "empty_output", "reason": "model returned an empty/non-string prediction"}
                continue
            value = value.strip()
            if any("\uac00" <= ch <= "\ud7a3" for ch in value):
                failures[word] = {
                    "status": "invalid_output",
                    "reason": f"unexpected Hangul in declared IPA output: {value!r}",
                }
                continue
            result[word] = value
    return result, failures


def collect_existing_baselines(words: list[str]) -> dict[str, dict[str, dict[str, Any]]]:
    """Run existing native and g2pk baselines with the repository's IPA boundary."""
    from korean_ukrainian.pipeline import phoneticize_korean

    outputs: dict[str, dict[str, dict[str, Any]]] = {"clippyfirst_native": {}, "g2pk_0_9_4": {}}
    for word in words:
        try:
            result = phoneticize_korean(word)
            if result.get("pronunciation_status") == "unresolved":
                outputs["clippyfirst_native"][word] = {
                    "status": "abstained", "reason": result.get("ipa_status_reason")
                }
            else:
                ipa = result.get("ipa", {}).get("ipa")
                outputs["clippyfirst_native"][word] = (
                    {"status": "scored", "ipa": ipa} if isinstance(ipa, str) and ipa.strip()
                    else {"status": "error", "reason": "native engine returned no IPA"}
                )
        except Exception as exc:
            outputs["clippyfirst_native"][word] = {
                "status": "error", "reason": f"{type(exc).__name__}: {exc}"
            }

    try:
        from g2pk import G2p
        from benchmark_multi_engine_ko import _g2pk_surface_to_ipa
        g2p = G2p()
        for word in words:
            try:
                ipa = _g2pk_surface_to_ipa(g2p, word)
                outputs["g2pk_0_9_4"][word] = {"status": "scored", "ipa": ipa}
            except Exception as exc:
                outputs["g2pk_0_9_4"][word] = {
                    "status": "error", "reason": f"{type(exc).__name__}: {exc}"
                }
    except Exception as exc:
        for word in words:
            outputs["g2pk_0_9_4"][word] = {
                "status": "blocked", "reason": f"{type(exc).__name__}: {exc}"
            }
    return outputs


def _metrics(scored: list[dict[str, Any]]) -> dict[str, Any]:
    reference_length = sum(item["reference_length"] for item in scored)
    distance = sum(item["distance"] for item in scored)
    exact = sum(item["exact"] for item in scored)
    phoneme_ref_length = sum(item.get("phoneme_reference_length", 0) for item in scored)
    phoneme_distance = sum(item.get("phoneme_distance", 0) for item in scored)
    feature_distance = sum(item.get("feature_error_distance_proxy", 0) for item in scored)
    return {
        "scored_occurrences": len(scored),
        "exact_matches": exact,
        "exact_match_rate": round(exact / len(scored), 6) if scored else None,
        "character_error_rate": round(distance / reference_length, 6) if reference_length else None,
        "phoneme_error_rate": round(phoneme_distance / phoneme_ref_length, 6) if phoneme_ref_length else None,
        "phonological_feature_error_rate_proxy": round(feature_distance / phoneme_ref_length, 6) if phoneme_ref_length else None,
        "unsupported_feature_segments": sum(item.get("unsupported_feature_segments", 0) for item in scored),
        "reference_characters": reference_length,
        "reference_phoneme_segments": phoneme_ref_length,
    }


def compare_baselines(rows: list[dict[str, Any]], neural: dict[str, str],
                      baselines: dict[str, dict[str, dict[str, Any]]], *, engine_key: str = "charsiu_byt5") -> dict[str, Any]:
    occurrences, _ = eligible_occurrences(rows)
    report: dict[str, Any] = {}
    scored_by_engine: dict[str, list[dict[str, Any]]] = {engine_key: [], **{
        name: [] for name in baselines
    }}
    pair_rows: list[dict[str, Any]] = []
    for index, item in enumerate(occurrences):
        word, gold = item["word"], item["gold"]
        entry: dict[str, Any] = {
            "occurrence_id": index, "row_id": item["row_id"], "word": word, "gold": gold
        }
        if word in neural:
            scored = score_prediction(neural[word], gold)
            scored_by_engine[engine_key].append({**scored, **entry})
            entry[engine_key] = {
                "status": "scored", "ipa": neural[word], "exact": scored["exact"],
                "distance": scored["distance"]
            }
        else:
            entry[engine_key] = {"status": "missing"}
        for name, word_outputs in baselines.items():
            baseline = word_outputs.get(word, {"status": "missing"})
            if baseline.get("status") == "scored" and isinstance(baseline.get("ipa"), str):
                scored = score_prediction(baseline["ipa"], gold)
                scored_by_engine[name].append({**scored, **entry})
                entry[name] = {
                    "status": "scored", "ipa": baseline["ipa"], "exact": scored["exact"],
                    "distance": scored["distance"]
                }
            else:
                entry[name] = {
                    "status": baseline.get("status", "missing"),
                    "reason": baseline.get("reason")
                }
        pair_rows.append(entry)

    total = len(occurrences)
    for name, scored in scored_by_engine.items():
        report[name] = {
            **_metrics(scored),
            "eligible_occurrences": total,
            "coverage": round(len(scored) / total, 6) if total else None,
            "missing_or_unresolved_occurrences": total - len(scored),
        }
    paired: dict[str, Any] = {}
    neural_by_id = {x["occurrence_id"]: x for x in scored_by_engine[engine_key]}
    for name, scored in scored_by_engine.items():
        if name == engine_key:
            continue
        baseline_by_id = {x["occurrence_id"]: x for x in scored}
        common_ids = sorted(set(neural_by_id) & set(baseline_by_id))
        neural_common = [neural_by_id[i] for i in common_ids]
        baseline_common = [baseline_by_id[i] for i in common_ids]
        neural_metrics, baseline_metrics = _metrics(neural_common), _metrics(baseline_common)
        wins = sum(a["exact"] and not b["exact"] for a, b in zip(neural_common, baseline_common))
        losses = sum(not a["exact"] and b["exact"] for a, b in zip(neural_common, baseline_common))
        paired[name] = {
            "common_scored_occurrences": len(common_ids),
            "model_metrics_on_common_subset": neural_metrics,
            "baseline_metrics_on_common_subset": baseline_metrics,
            "exact_match_delta_model_minus_baseline": (
                round(neural_metrics["exact_match_rate"] - baseline_metrics["exact_match_rate"], 6)
                if neural_metrics["exact_match_rate"] is not None and baseline_metrics["exact_match_rate"] is not None
                else None
            ),
            "cer_delta_model_minus_baseline": (
                round(neural_metrics["character_error_rate"] - baseline_metrics["character_error_rate"], 6)
                if neural_metrics["character_error_rate"] is not None and baseline_metrics["character_error_rate"] is not None
                else None
            ),
            "model_only_exact": wins,
            "baseline_only_exact": losses,
            "both_exact": sum(a["exact"] and b["exact"] for a, b in zip(neural_common, baseline_common)),
            "both_not_exact": sum(not a["exact"] and not b["exact"] for a, b in zip(neural_common, baseline_common)),
        }
    report["paired_comparisons"] = paired
    report["per_occurrence"] = pair_rows
    return report


def evaluate(
    rows: list[dict[str, Any]],
    predictions: dict[str, str],
    prediction_failures: dict[str, dict[str, str]] | None = None,
    *,
    engine_key: str | None = None,
    model_label: str | None = None,
    model_code_license: str | None = None,
    model_weights_license_status: str | None = None,
    tokenizer_license: str | None = None,
    output_convention: str | None = None,
    input_prefix: str | None = None,
    additional_limitations: list[str] | None = None,
) -> dict[str, Any]:
    occurrences, words = eligible_occurrences(rows)
    engine_key = engine_key or os.environ.get("G2P_ENGINE_KEY", "charsiu_byt5")
    model_label = model_label or os.environ.get("G2P_MODEL_LABEL", "CharsiuG2P multilingual ByT5")
    model_code_license = model_code_license or os.environ.get("G2P_MODEL_CODE_LICENSE", "MIT (CharsiuG2P upstream repository)")
    model_weights_license_status = model_weights_license_status or os.environ.get("G2P_MODEL_WEIGHTS_LICENSE_STATUS", "UNRESOLVED: Hugging Face model page has no explicit weights license; research-only, no redistribution")
    tokenizer_license = tokenizer_license or os.environ.get("G2P_TOKENIZER_LICENSE", "Apache-2.0 (google/byt5-small model card)")
    output_convention = output_convention or os.environ.get("G2P_OUTPUT_CONVENTION", "model IPA convention not independently specified")
    input_prefix = input_prefix or os.environ.get("G2P_LANGUAGE_PREFIX", "<kor>:")
    additional_limitations = additional_limitations or []
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
    prediction_failures = prediction_failures or {}
    failure_counts = {status: sum(1 for item in prediction_failures.values() if item.get("status") == status)
                      for status in ("empty_output", "invalid_output", "model_error")}
    return {
        "schema_version": 3,
        "engine": model_label,
        "engine_key": engine_key,
        "model_id": os.environ.get("CHARSIU_MODEL_ID", "charsiu/g2p_multilingual_byT5_small_100"),
        "model_revision_requested": os.environ.get("CHARSIU_MODEL_REVISION_REQUESTED", "UNPINNED"),
        "model_revision": os.environ.get("CHARSIU_RESOLVED_MODEL_REVISION", os.environ.get("CHARSIU_MODEL_REVISION", "UNPINNED")),
        "model_code_license": model_code_license,
        "model_weights_license_status": model_weights_license_status,
        "tokenizer_id": os.environ.get("CHARSIU_TOKENIZER_ID", "google/byt5-small"),
        "tokenizer_revision_requested": os.environ.get("CHARSIU_TOKENIZER_REVISION_REQUESTED", "UNPINNED"),
        "tokenizer_revision": os.environ.get("CHARSIU_RESOLVED_TOKENIZER_REVISION", os.environ.get("CHARSIU_TOKENIZER_REVISION", "UNPINNED")),
        "tokenizer_license": tokenizer_license,
        "output_convention": output_convention,
        "input_prefix": input_prefix,
        "dataset": "pinned input supplied by caller; diagnostic score only",
        "eligible_occurrences": len(occurrences),
        "unique_words": len(words),
        "scored_occurrences": len(scored),
        "coverage": round(len(scored) / len(occurrences), 6) if occurrences else None,
        "exact_matches": exact,
        "exact_match_rate": round(exact / len(scored), 6) if scored else None,
        "character_error_rate": round(total_distance / total_ref, 6) if total_ref else None,
        "missing_predictions": len(missing),
        "missing_word_examples": missing[:50],
        "prediction_failures_by_word": prediction_failures,
        "prediction_failure_counts_by_unique_word": failure_counts,
        "predictions": scored,
        "limitations": [
            "This is a word/token-level ablation; it does not preserve sentence context or perform Korean morphological segmentation.",
            "The model expects pre-tokenized words; the repository's tokenization is inherited from each benchmark.",
            "Upstream PER/WER are not scores measured on this repository's data.",
            "IPA exact/CER scores are diagnostic and do not validate Ukrainian target rendering.",
            "The model output convention may differ from the benchmark's reference convention; raw output is retained and normalized output is diagnostic.",
            "Weights are not redistributed by this runner; respect the checkpoint's declared license and attribution requirements.",
            *additional_limitations,
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
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--engine-key", default=os.environ.get("G2P_ENGINE_KEY", "charsiu_byt5"))
    parser.add_argument("--model-label", default=os.environ.get("G2P_MODEL_LABEL", "CharsiuG2P multilingual ByT5"))
    parser.add_argument("--model-code-license", default=os.environ.get("G2P_MODEL_CODE_LICENSE", "MIT (CharsiuG2P upstream repository)"))
    parser.add_argument("--model-weights-license-status", default=os.environ.get("G2P_MODEL_WEIGHTS_LICENSE_STATUS", "UNRESOLVED: Hugging Face model page has no explicit weights license; research-only, no redistribution"))
    parser.add_argument("--tokenizer-license", default=os.environ.get("G2P_TOKENIZER_LICENSE", "Apache-2.0 (google/byt5-small model card)"))
    parser.add_argument("--output-convention", default=os.environ.get("G2P_OUTPUT_CONVENTION", "model IPA convention not independently specified"))
    parser.add_argument("--language-prefix", default=os.environ.get("G2P_LANGUAGE_PREFIX", "<kor>:"))
    parser.add_argument("--model-limitation", action="append", default=[])
    parser.add_argument("--compare-existing-engines", action="store_true")
    args = parser.parse_args()
    if not args.model_revision or not args.tokenizer_revision:
        parser.error("--model-revision and --tokenizer-revision are required; floating model revisions are not reproducible")
    rows = load_corpus(args.corpus)
    _, words = eligible_occurrences(rows)
    inference_started = time.perf_counter()
    predictions, prediction_failures = predict(
        words, model_id=args.model, revision=args.model_revision,
        tokenizer_id=args.tokenizer, tokenizer_revision=args.tokenizer_revision,
        batch_size=args.batch_size, language_prefix=args.language_prefix,
    )
    inference_elapsed_ms = (time.perf_counter() - inference_started) * 1000
    os.environ["CHARSIU_MODEL_ID"] = args.model
    os.environ["CHARSIU_MODEL_REVISION_REQUESTED"] = args.model_revision
    os.environ["CHARSIU_TOKENIZER_ID"] = args.tokenizer
    os.environ["CHARSIU_TOKENIZER_REVISION_REQUESTED"] = args.tokenizer_revision
    report = evaluate(
        rows, predictions, prediction_failures,
        engine_key=args.engine_key, model_label=args.model_label,
        model_code_license=args.model_code_license,
        model_weights_license_status=args.model_weights_license_status,
        tokenizer_license=args.tokenizer_license,
        output_convention=args.output_convention,
        input_prefix=args.language_prefix,
        additional_limitations=args.model_limitation,
    )
    report["runtime"] = {
        "total_ms": round(inference_elapsed_ms, 3),
        "throughput_words_per_second": round(len(words) / (inference_elapsed_ms / 1000), 3) if inference_elapsed_ms > 0 else None,
        "successful_outputs_per_second": round(len(predictions) / (inference_elapsed_ms / 1000), 3) if inference_elapsed_ms > 0 else None,
        "timing_scope": "single full model-load plus batched inference run; includes tokenizer/model loading and batch decoding; not directly comparable with in-process per-word engine timings",
        "measured_repetitions": 1,
        "repeatability_status": "NOT_MEASURED for neural candidate; repeated model reloads would confound cold-start and inference time",
    }
    if args.compare_existing_engines:
        baselines = collect_existing_baselines(words)
        report["comparison"] = compare_baselines(rows, predictions, baselines, engine_key=args.engine_key)
        report["comparison"]["method"] = (
            "paired occurrence-level scoring with the same benchmark normalizer and gold variants; "
            "native abstentions and engine errors reduce coverage, not accuracy denominators"
        )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = {k: report[k] for k in (
        "engine", "engine_key", "model_id", "model_revision_requested", "model_revision",
        "tokenizer_revision_requested", "tokenizer_revision", "eligible_occurrences",
        "scored_occurrences", "coverage", "exact_matches", "exact_match_rate",
        "character_error_rate", "phoneme_error_rate", "phonological_feature_error_rate_proxy",
        "unsupported_feature_segments", "runtime", "missing_predictions", "prediction_failure_counts_by_unique_word",
        "model_code_license", "model_weights_license_status", "tokenizer_license", "output_convention", "input_prefix",
    )}
    if "comparison" in report:
        summary["paired_comparisons"] = report["comparison"]["paired_comparisons"]
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if predictions else 1


if __name__ == "__main__":
    raise SystemExit(main())
