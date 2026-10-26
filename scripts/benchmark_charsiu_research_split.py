#!/usr/bin/env python3
"""Run Charsiu only on declared train/dev corpus rows for teacher-guided review.

This emits raw per-occurrence model/native comparisons and never promotes rules.
The source IPA conventions are not assumed equivalent to ClippyFirst broad IPA.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from benchmark_charsiu_g2p import (
    collect_existing_baselines,
    compare_baselines,
    eligible_occurrences,
    predict,
)
from korean_ukrainian.pipeline import phoneticize_korean

HANGUL = re.compile(r"^[\uac00-\ud7a3]+$")


def load_prepared_jsonl(path: Path, expected_split: str) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    if expected_split not in {"train", "dev"}:
        raise ValueError("only train/dev are allowed; test/holdout is forbidden")
    rows: list[dict[str, Any]] = []
    seen: set[str] = set()
    metadata: tuple[str, str, str] | None = None
    non_hangul_rows = 0
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {line_no}: invalid JSON") from exc
        for field in ("case_id", "dataset_id", "dataset_revision", "split", "source_text",
                      "target_raw", "target_representation"):
            if field not in item:
                raise ValueError(f"line {line_no}: missing {field}")
        case_id = str(item["case_id"])
        if not case_id or case_id in seen:
            raise ValueError(f"line {line_no}: empty or duplicate case_id")
        if item["split"] != expected_split:
            raise ValueError(f"line {line_no}: expected split {expected_split!r}, got {item['split']!r}")
        if re.search(r"(^|[-:/])(?:test|holdout)(?:[-:/]|$)", case_id.lower()):
            raise ValueError(f"line {line_no}: sealed test/holdout case id refused")
        source = item["source_text"]
        target = item["target_raw"]
        if not isinstance(source, str) or not source.strip():
            raise ValueError(f"line {line_no}: source_text must be non-empty")
        if not HANGUL.fullmatch(source):
            non_hangul_rows += 1
        if not isinstance(target, str) or not target.strip():
            raise ValueError(f"line {line_no}: target_raw must be non-empty")
        current_metadata = (str(item["dataset_id"]), str(item["dataset_revision"]),
                            str(item["target_representation"]))
        if metadata is None:
            metadata = current_metadata
        elif metadata != current_metadata:
            raise ValueError("input mixes dataset revisions or target representations")
        seen.add(case_id)
        rows.append({
            "id": case_id,
            "lang": "ko",
            "split": expected_split,
            "text": item.get("source_sentence_text", source),
            "canonical": source,
            "phonemes": target,
            "tokens": [{"canonical": source, "phoneme": target}],
            "_provenance": item,
        })
    if not rows or metadata is None:
        raise ValueError("prepared corpus contains no rows")
    return rows, {
        "dataset_id": metadata[0],
        "dataset_revision": metadata[1],
        "target_representation": metadata[2],
        "split": expected_split,
        "input_rows": len(rows),
        "unique_source_forms": len({row["canonical"] for row in rows}),
        "non_hangul_rows_excluded_by_benchmark_adapter": non_hangul_rows,
    }


def build_pair_ledger(
    report: dict[str, Any],
    metadata: dict[str, Any],
    narrow_report: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    output = []
    narrow_rows = {
        (row.get("row_id"), row.get("occurrence_id")): row
        for row in (narrow_report or {}).get("per_occurrence", [])
    }
    for row in report.get("per_occurrence", []):
        teacher = row.get("charsiu_byt5", {})
        native = row.get("clippyfirst_native", row.get("baselines", {}).get("clippyfirst_native", {}))
        narrow_row = narrow_rows.get((row.get("row_id"), row.get("occurrence_id")), {})
        narrow_native = narrow_row.get("clippyfirst_native", {})
        output.append({
            "case_id": f"{metadata['dataset_id']}:{metadata['split']}:{row['row_id']}:{row['occurrence_id']}",
            "split": metadata["split"],
            "dataset_id": metadata["dataset_id"],
            "dataset_revision": metadata["dataset_revision"],
            "target_representation": metadata["target_representation"],
            "source_text": row["token"],
            "gold_raw": row["gold"],
            "teacher_ipa_raw": teacher.get("ipa"),
            "teacher_status": teacher.get("status", "missing"),
            "teacher_exact_under_declared_diagnostic_normalizer": teacher.get("exact"),
            "teacher_edit_distance": teacher.get("distance"),
            "strict_ipa_raw": native.get("ipa"),
            "strict_status": native.get("status", "missing"),
            "strict_exact_under_declared_diagnostic_normalizer": native.get("exact"),
            "strict_edit_distance": native.get("distance"),
            "strict_narrow_ipa_raw": narrow_native.get("ipa"),
            "strict_narrow_status": narrow_native.get("status", "missing"),
            "strict_narrow_exact_under_declared_diagnostic_normalizer": narrow_native.get("exact"),
            "strict_narrow_edit_distance": narrow_native.get("distance"),
            "comparison_status": "DIAGNOSTIC_ONLY_IPA_CONVENTION_UNREVIEWED",
            "production_rule_promotion": False,
        })
    return output


def run(args: argparse.Namespace) -> dict[str, Any]:
    rows, metadata = load_prepared_jsonl(args.corpus_jsonl, args.split)
    _, words = eligible_occurrences(rows)
    predictions, failures = predict(
        words,
        model_id=args.model,
        revision=args.model_revision,
        tokenizer_id=args.tokenizer,
        tokenizer_revision=args.tokenizer_revision,
        batch_size=args.batch_size,
        language_prefix=args.language_prefix,
    )
    baselines = collect_existing_baselines(words)
    report = compare_baselines(rows, predictions, baselines, engine_key="charsiu_byt5")

    # Run the same deterministic engine's explicitly partial narrow profile
    # against the same teacher predictions. This is a diagnostic comparison
    # only; it must not become accepted Ukrainian target input.
    narrow_baselines = dict(baselines)
    narrow_outputs: dict[str, dict[str, Any]] = {}
    for word in words:
        try:
            narrow_result = phoneticize_korean(word, ipa_level="narrow")
            narrow_outputs[word] = {
                "status": "scored",
                "ipa": narrow_result["ipa"]["ipa"],
                "transcription_profile": narrow_result["ipa"].get("transcription_profile"),
            }
        except (TypeError, ValueError, RuntimeError) as exc:
            narrow_outputs[word] = {"status": "abstained", "reason": str(exc)}
    narrow_baselines["clippyfirst_native"] = narrow_outputs
    narrow_report = compare_baselines(rows, predictions, narrow_baselines, engine_key="charsiu_byt5")
    report["narrow_comparison"] = {
        "clippyfirst_native": narrow_report.get("clippyfirst_native"),
        "paired_comparisons": narrow_report.get("paired_comparisons", {}).get("clippyfirst_native"),
        "per_occurrence": narrow_report.get("per_occurrence", []),
        "profile": "korean-narrow-partial-sibilant-v1",
        "target_compatible": False,
    }
    report["dataset_metadata"] = metadata
    report["model_provenance"] = {
        "model_id": args.model,
        "model_revision_requested": args.model_revision,
        "tokenizer_id": args.tokenizer,
        "tokenizer_revision_requested": args.tokenizer_revision,
        "weights_license_status": "UNRESOLVED; research inference only; weights not redistributed",
        "training_overlap_status": "UNKNOWN; do not treat this split as guaranteed independent of teacher training",
        "output_convention_status": "UNREVIEWED relative to ClippyFirst broad IPA",
        "test_data_used_for_rule_selection": False,
    }
    report["prediction_failures_by_word"] = failures
    report["interpretation"] = (
        "Teacher-guided hypothesis generation only. Raw IPA is preserved; the source convention "
        "is not assumed equivalent to ClippyFirst broad IPA. No rules are automatically promoted."
    )
    report["paired_rule_review_cases"] = build_pair_ledger(report, metadata, narrow_report=narrow_report)
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus-jsonl", required=True, type=Path)
    parser.add_argument("--split", choices=("train", "dev"), required=True)
    parser.add_argument("--output-json", required=True, type=Path)
    parser.add_argument("--pairs-jsonl", required=True, type=Path)
    parser.add_argument("--model", required=True)
    parser.add_argument("--model-revision", required=True)
    parser.add_argument("--tokenizer", required=True)
    parser.add_argument("--tokenizer-revision", required=True)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--language-prefix", default="<kor>:")
    args = parser.parse_args()
    try:
        report = run(args)
    except (OSError, ValueError, RuntimeError) as exc:
        parser.error(str(exc))
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.pairs_jsonl.parent.mkdir(parents=True, exist_ok=True)
    args.pairs_jsonl.write_text(
        "".join(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n"
                for row in report["paired_rule_review_cases"]),
        encoding="utf-8",
    )
    print(json.dumps({
        "dataset_id": report["dataset_metadata"]["dataset_id"],
        "split": report["dataset_metadata"]["split"],
        "input_rows": report["dataset_metadata"]["input_rows"],
        "unique_source_forms": report["dataset_metadata"]["unique_source_forms"],
        "teacher_metrics": report.get("charsiu_byt5"),
        "native_metrics": report.get("clippyfirst_native"),
        "rule_promotion": False,
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
