#!/usr/bin/env python3
"""Join a neural CharsiuG2P report with a complete multi-engine occurrence ledger."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from benchmark_multi_engine_ko import _metrics, _paired_bootstrap_delta_ci


def _load(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"{path}: expected a JSON object")
    return value


def _normalized_case(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "occurrence_id": str(item["occurrence_id"]),
        "row_id": str(item["row_id"]),
        "token": item["token"],
        "gold": item["gold"],
        "exact": bool(item["exact"]),
        "distance": int(item["distance"]),
        "reference_length": int(item["reference_length"]),
        "predicted": item.get("predicted", item.get("ipa")),
        "normalized_predicted": item.get("normalized_predicted"),
        "closest_normalized_gold": item.get("closest_normalized_gold"),
    }


def compare_reports(neural: dict[str, Any], baseline: dict[str, Any], dataset_name: str) -> dict[str, Any]:
    neural_cases = neural.get("comparison", {}).get("per_occurrence")
    neural_scored = neural.get("predictions")
    baseline_ledgers = baseline.get("per_engine_occurrences")
    if not isinstance(neural_cases, list) or not isinstance(neural_scored, list):
        raise ValueError("neural report lacks comparison.per_occurrence or predictions")
    if not isinstance(baseline_ledgers, dict) or not baseline_ledgers:
        raise ValueError("baseline report lacks per_engine_occurrences; rerun the updated multi-engine runner")
    expected_count = baseline.get("eligible_token_occurrences")
    if expected_count != neural.get("eligible_occurrences") or expected_count != len(neural_cases):
        raise ValueError(
            f"eligible occurrence mismatch: baseline={expected_count}, "
            f"neural={neural.get('eligible_occurrences')}, neural_cases={len(neural_cases)}"
        )

    neural_all = {str(x["occurrence_id"]): x for x in neural_cases}
    if len(neural_all) != len(neural_cases):
        raise ValueError("duplicate occurrence IDs in neural report")
    neural_scored_by_id = {str(x["occurrence_id"]): x for x in neural_scored}
    failures = neural.get("prediction_failures_by_word", {})
    first_ledger = next(iter(baseline_ledgers.values()))
    if not isinstance(first_ledger, list) or len(first_ledger) != expected_count:
        raise ValueError("baseline occurrence ledger has an unexpected length")
    base_ids = [str(x["occurrence_id"]) for x in first_ledger]
    if len(set(base_ids)) != len(base_ids):
        raise ValueError("duplicate occurrence IDs in baseline ledger")
    base_identity_by_id = {
        str(x["occurrence_id"]): (str(x["row_id"]), x["token"], x["gold"])
        for x in first_ledger
    }

    baseline_by_engine: dict[str, dict[str, dict[str, Any]]] = {}
    for engine, records in baseline_ledgers.items():
        if not isinstance(records, list) or len(records) != expected_count:
            raise ValueError(f"{engine}: expected {expected_count} occurrence records")
        mapped = {str(x["occurrence_id"]): x for x in records}
        if set(mapped) != set(base_ids):
            raise ValueError(f"{engine}: occurrence ID set differs from other baseline engines")
        for occurrence_id, record in mapped.items():
            identity = (str(record["row_id"]), record["token"], record["gold"])
            if identity != base_identity_by_id[occurrence_id]:
                raise ValueError(f"{engine}: occurrence identity mismatch for {occurrence_id}")
        baseline_by_engine[engine] = mapped

    cases: list[dict[str, Any]] = []
    for occurrence_id in base_ids:
        base_record = baseline_by_engine[next(iter(baseline_by_engine))][occurrence_id]
        neural_case = neural_all.get(occurrence_id)
        if neural_case is None:
            raise ValueError(f"neural report is missing occurrence {occurrence_id}")
        identity = (str(base_record["row_id"]), base_record["token"], base_record["gold"])
        neural_identity = (str(neural_case["row_id"]), neural_case["word"], neural_case["gold"])
        if identity != neural_identity:
            raise ValueError(f"occurrence identity mismatch for {occurrence_id}: {identity!r} != {neural_identity!r}")

        neural_prediction = neural_scored_by_id.get(occurrence_id)
        if neural_prediction:
            neural_entry = {
                "status": "scored",
                "ipa": neural_prediction.get("predicted"),
                "normalized_predicted": neural_prediction.get("normalized_predicted"),
                "exact": neural_prediction.get("exact"),
                "distance": neural_prediction.get("distance"),
                "reference_length": neural_prediction.get("reference_length"),
            }
        else:
            failure = failures.get(neural_case.get("word"), {})
            neural_entry = {
                "status": failure.get("status", "missing"),
                "reason": failure.get("reason", "no prediction recorded"),
            }

        engine_entries: dict[str, Any] = {}
        for engine, mapped in baseline_by_engine.items():
            record = mapped[occurrence_id]
            if record.get("status") == "scored":
                engine_entries[engine] = {
                    "status": "scored",
                    "ipa": record.get("ipa"),
                    "normalized_predicted": record.get("normalized_predicted"),
                    "exact": record.get("exact"),
                    "distance": record.get("distance"),
                    "reference_length": record.get("reference_length"),
                }
            else:
                engine_entries[engine] = {
                    "status": record.get("status", "no_output"),
                    "reason": record.get("reason"),
                }
        cases.append({
            "occurrence_id": occurrence_id,
            "row_id": identity[0],
            "token": identity[1],
            "gold": identity[2],
            "charsiu_byt5": neural_entry,
            "baselines": engine_entries,
        })

    paired: dict[str, Any] = {}
    neural_all_scored = [
        {"occurrence_id": str(x["occurrence_id"]), "row_id": str(x["row_id"]),
         "exact": bool(x["exact"]), "distance": int(x["distance"]),
         "reference_length": int(x["reference_length"])}
        for x in neural_scored
    ]
    for engine, mapped in baseline_by_engine.items():
        baseline_scored = [
            {"occurrence_id": str(x["occurrence_id"]), "row_id": str(x["row_id"]),
             "exact": bool(x["exact"]), "distance": int(x["distance"]),
             "reference_length": int(x["reference_length"])}
            for x in mapped.values() if x.get("status") == "scored"
        ]
        neural_map = {x["occurrence_id"]: x for x in neural_all_scored}
        baseline_map = {x["occurrence_id"]: x for x in baseline_scored}
        common_ids = sorted(set(neural_map) & set(baseline_map))
        neural_common = [neural_map[k] for k in common_ids]
        baseline_common = [baseline_map[k] for k in common_ids]
        neural_metrics = _metrics(neural_common)
        baseline_metrics = _metrics(baseline_common)
        wins = sum(a["exact"] and not b["exact"] for a, b in zip(neural_common, baseline_common))
        losses = sum(not a["exact"] and b["exact"] for a, b in zip(neural_common, baseline_common))
        paired[engine] = {
            "eligible_occurrences": expected_count,
            "charsiu_scored_occurrences": len(neural_all_scored),
            "baseline_scored_occurrences": len(baseline_scored),
            "common_scored_occurrences": len(common_ids),
            "charsiu_metrics_on_common_subset": neural_metrics,
            "baseline_metrics_on_common_subset": baseline_metrics,
            "exact_match_delta_charsiu_minus_baseline": (
                round(neural_metrics["exact_match_rate"] - baseline_metrics["exact_match_rate"], 6)
                if neural_metrics["exact_match_rate"] is not None and baseline_metrics["exact_match_rate"] is not None
                else None
            ),
            "cer_delta_charsiu_minus_baseline": (
                round(neural_metrics["character_error_rate"] - baseline_metrics["character_error_rate"], 6)
                if neural_metrics["character_error_rate"] is not None and baseline_metrics["character_error_rate"] is not None
                else None
            ),
            "charsiu_only_exact": wins,
            "baseline_only_exact": losses,
            "both_exact": sum(a["exact"] and b["exact"] for a, b in zip(neural_common, baseline_common)),
            "both_not_exact": sum(not a["exact"] and not b["exact"] for a, b in zip(neural_common, baseline_common)),
            "paired_row_cluster_bootstrap_95pct_delta_ci": _paired_bootstrap_delta_ci(neural_common, baseline_common),
        }

    return {
        "schema_version": 1,
        "dataset": dataset_name,
        "comparison_contract": "same ordered eligible occurrences, same benchmark_ugtphon_ko.normalize_ipa normalizer and gold variants; model/engine outputs are predictions, not normative gold",
        "eligible_occurrences": expected_count,
        "normalization_profile": (
            baseline.get("normalization_profile")
            or baseline.get("normalization")
            or "benchmark_ugtphon_ko.normalize_ipa; shared scoring profile for neural and baseline runners"
        ),
        "neural_model": {
            "id": neural.get("model_id"),
            "revision": neural.get("model_revision"),
            "tokenizer_id": neural.get("tokenizer_id"),
            "tokenizer_revision": neural.get("tokenizer_revision"),
            "code_license": neural.get("model_code_license"),
            "tokenizer_license": neural.get("tokenizer_license"),
            "weights_license_status": neural.get("model_weights_license_status"),
            "metrics": {key: neural.get(key) for key in (
                "scored_occurrences", "coverage", "exact_matches", "exact_match_rate",
                "character_error_rate", "missing_predictions", "prediction_failure_counts_by_unique_word",
            )},
        },
        "baseline_engines": baseline.get("engines"),
        "paired_comparisons": paired,
        "per_occurrence": cases,
        "limitations": [
            "UGTPHON is a token-level ablation for CharsiuG2P, not sentence-context inference.",
            "SIGMORPHON is lexical word-level, not a sentence-context benchmark.",
            "Scores are diagnostic comparisons to the supplied corpus annotations, not normative IPA gold or Ukrainian-target accuracy.",
            "A shared segment renderer can affect the native/g2pk comparison; see the baseline report's engine adapter notes.",
            "No local fine-tuning or test-set selection was performed, but overlap between the public checkpoint's training sources and these public benchmark sources cannot be excluded; these are diagnostic scores, not leakage-free generalization estimates.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--neural-report", type=Path, required=True)
    parser.add_argument("--baseline-report", type=Path, required=True)
    parser.add_argument("--dataset-name", required=True)
    parser.add_argument("--neural-run-id", default=None)
    parser.add_argument("--baseline-run-id", default=None)
    parser.add_argument("--provenance-json", type=Path, default=None,
                        help="optional model-provenance.json from the same neural run")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        result = compare_reports(_load(args.neural_report), _load(args.baseline_report), args.dataset_name)
        result["source_runs"] = {"neural": args.neural_run_id, "baseline": args.baseline_run_id}
        if args.provenance_json:
            result["model_provenance"] = _load(args.provenance_json)
    except Exception as exc:
        print(f"comparison failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "dataset": result["dataset"],
        "eligible_occurrences": result["eligible_occurrences"],
        "neural_model": result["neural_model"],
        "paired_comparisons": result["paired_comparisons"],
        "output": str(args.output),
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
