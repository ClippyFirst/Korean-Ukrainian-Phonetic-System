#!/usr/bin/env python3
"""Pair scratch-teacher and native Strict IPA outputs on identical dev inputs.

This is a provenance/alignment artifact only. Source IPA conventions have not
been reconciled, so this script deliberately computes no accuracy or edit metrics.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from korean_ukrainian.pipeline import phoneticize_korean  # noqa: E402

DATASET_ID = "sigmorphon-2021-task1-medium-korean"
DATASET_REVISION = "821bcdece5a47820872215969f275004b0abe80c"
TARGET_REPRESENTATION = "tokenized_ipa_from_sigmorphon_tsv"
SEALED_ID = re.compile(r"(^|[-/:])(test|holdout)([-/:]|$)|(^|[-/:])24[-/]?form([-/:]|$)|(^|[-/:])KUA-HO-\\d+([-/:]|$)", re.I)


def _load_jsonl(path: Path, label: str) -> list[dict[str, Any]]:
    if not path.is_file():
        raise ValueError(f"missing {label} JSONL: {path}")
    rows = []
    seen: set[str] = set()
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"{path}:{line_number}: invalid JSONL") from exc
        if not isinstance(row, dict):
            raise ValueError(f"{path}:{line_number}: expected object")
        case_id = row.get("case_id")
        if not isinstance(case_id, str) or not case_id.strip() or case_id in seen:
            raise ValueError(f"{path}:{line_number}: missing or duplicate case_id")
        if SEALED_ID.search(case_id):
            raise ValueError(f"{path}:{line_number}: sealed holdout/test case_id refused")
        if row.get("split") != "dev":
            raise ValueError(f"{path}:{line_number}: dev only; got {row.get('split')!r}")
        source = row.get("source_text", row.get("input"))
        if not isinstance(source, str) or not source.strip():
            raise ValueError(f"{path}:{line_number}: non-empty source text required")
        row["_source_nfc"] = unicodedata.normalize("NFC", source.strip())
        seen.add(case_id)
        rows.append(row)
    if not rows:
        raise ValueError(f"{path}: no rows")
    return rows


def _validate_corpus_rows(rows: list[dict[str, Any]]) -> None:
    for row in rows:
        if row.get("dataset_id") != DATASET_ID or row.get("dataset_revision") != DATASET_REVISION:
            raise ValueError(f"source pin mismatch for case {row.get('case_id')!r}")
        if row.get("target_representation") != TARGET_REPRESENTATION:
            raise ValueError(f"target representation mismatch for case {row.get('case_id')!r}")
        if row.get("split") != "dev":
            raise ValueError("dev only; sealed train/test rows are not accepted")


def _prepare_pair_rows(rows: list[dict[str, Any]], label: str) -> list[dict[str, Any]]:
    prepared = []
    seen: set[str] = set()
    for row in rows:
        case_id = row.get("case_id")
        if not isinstance(case_id, str) or not case_id.strip() or case_id in seen:
            raise ValueError(f"missing or duplicate case_id in {label}")
        if SEALED_ID.search(case_id):
            raise ValueError(f"sealed holdout/test case_id refused: {case_id!r}")
        if row.get("split") != "dev":
            raise ValueError(f"dev only; non-dev row in {label}")
        source = row.get("source_text", row.get("input"))
        if not isinstance(source, str) or not source.strip():
            raise ValueError(f"missing source text in {label} for {case_id!r}")
        item = dict(row)
        item["_source_nfc"] = unicodedata.normalize("NFC", source.strip())
        seen.add(case_id)
        prepared.append(item)
    return prepared


def build_pairs(
    corpus_rows: list[dict[str, Any]],
    teacher_rows: list[dict[str, Any]],
    strict_rows: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Validate exact alignment; optionally consume precomputed strict rows for tests."""
    _validate_corpus_rows(corpus_rows)
    corpus_rows = _prepare_pair_rows(corpus_rows, "corpus")
    teacher_rows = _prepare_pair_rows(teacher_rows, "teacher predictions")
    corpus_by_id = {row["case_id"]: row for row in corpus_rows}
    teacher_by_id = {row["case_id"]: row for row in teacher_rows}
    if set(corpus_by_id) != set(teacher_by_id):
        raise ValueError("case_id sets differ between corpus and teacher predictions")

    strict_by_id: dict[str, dict[str, Any]] = {}
    if strict_rows is not None:
        strict_rows = _prepare_pair_rows(strict_rows, "Strict predictions")
        strict_by_id = {row["case_id"]: row for row in strict_rows}
        if set(corpus_by_id) != set(strict_by_id):
            raise ValueError("case_id sets differ between corpus and Strict predictions")

    pairs = []
    excluded = []
    for case_id in sorted(corpus_by_id):
        source_row = corpus_by_id[case_id]
        teacher = teacher_by_id[case_id]
        source = source_row["_source_nfc"]
        teacher_source = teacher["_source_nfc"]
        if teacher_source != source:
            raise ValueError(f"source text mismatch for case {case_id!r}")
        ref_tokens = teacher.get("reference_target_tokens")
        pred_tokens = teacher.get("predicted_target_tokens")
        if not isinstance(ref_tokens, list) or not all(isinstance(token, str) for token in ref_tokens):
            raise ValueError(f"invalid reference_target_tokens for case {case_id!r}")
        if not isinstance(pred_tokens, list) or not all(isinstance(token, str) for token in pred_tokens):
            raise ValueError(f"invalid predicted_target_tokens for case {case_id!r}")

        if strict_rows is None:
            strict = phoneticize_korean(source, morphology_mode="strict", ipa_level="broad")
            strict_row = {
                "case_id": case_id,
                "input": source,
                "_source_nfc": source,
                "ipa": strict.get("ipa", {}),
                "ipa_status": strict.get("ipa_status"),
                "ipa_is_diagnostic_only": strict.get("ipa_is_diagnostic_only"),
                "unresolved_contexts": strict.get("unresolved_contexts", []),
            }
        else:
            strict_row = strict_by_id[case_id]
            strict_source = strict_row["_source_nfc"]
            if strict_source != source:
                raise ValueError(f"source text mismatch between corpus and Strict for case {case_id!r}")

        strict_ipa_obj = strict_row.get("ipa")
        strict_ipa = strict_ipa_obj.get("ipa") if isinstance(strict_ipa_obj, dict) else None
        if not isinstance(strict_ipa, str) or not strict_ipa.strip():
            excluded.append({"case_id": case_id, "source_text": source, "reason": "native IPA unavailable"})
            continue
        strict_status = strict_row.get("ipa_status") or strict_ipa_obj.get("status") or "unknown"
        diagnostic_only = strict_row.get("ipa_is_diagnostic_only")
        if diagnostic_only is None:
            diagnostic_only = strict_ipa_obj.get("is_diagnostic_only", False)
        if diagnostic_only:
            excluded.append({
                "case_id": case_id,
                "source_text": source,
                "reason": "native IPA is diagnostic-only because pronunciation remains unresolved",
                "strict_ipa_status": strict_status,
                "unresolved_contexts": strict_row.get("unresolved_contexts", []),
            })
            continue

        pairs.append({
            "case_id": case_id,
            "split": "dev",
            "source_text": source,
            "source_dataset_id": DATASET_ID,
            "source_dataset_revision": DATASET_REVISION,
            "teacher_target_representation": TARGET_REPRESENTATION,
            "teacher_reference_tokens": ref_tokens,
            "teacher_prediction_tokens": pred_tokens,
            "teacher_ipa_raw": " ".join(pred_tokens),
            "strict_ipa_raw": strict_ipa,
            "strict_ipa_level": strict_ipa_obj.get("level", "broad"),
            "strict_ipa_status": strict_status,
            "strict_unresolved_contexts": strict_row.get("unresolved_contexts", []),
            "teacher_strict_exact_match": None,
            "teacher_strict_edit_distance": None,
            "ukrainian_orthography": None,
            "comparison_status": "BLOCKED_INCOMPATIBLE_OR_UNREVIEWED_IPA_CONVENTIONS",
            "comparison_metrics_computed": False,
            "source_provenance": "Pinned SIGMORPHON 2021 medium Korean dev input; scratch teacher selected on this same dev split",
        })

    return {
        "schema_version": "1.0",
        "purpose": "same-input teacher/native-Strict IPA pairing for review; no accuracy score",
        "summary": {
            "corpus_dev_rows": len(corpus_rows),
            "teacher_dev_rows": len(teacher_rows),
            "paired_cases": len(pairs),
            "excluded_cases": len(excluded),
            "comparison_status": "BLOCKED_INCOMPATIBLE_OR_UNREVIEWED_IPA_CONVENTIONS",
            "comparison_metrics_computed": False,
            "reason": "SIGMORPHON roughly-phonemic tokenized IPA has not been mapped through an independently reviewed adapter to ClippyFirst broad IPA; the teacher checkpoint was also selected using this dev split.",
        },
        "pairs": pairs,
        "excluded_cases": excluded,
        "interpretation_limits": [
            "Pairing confirms identical input case IDs and source forms only; it does not make output conventions comparable.",
            "No exact-match, CER, WER, or ranking metric is computed across the two IPA representations.",
            "Teacher dev data was used for checkpoint selection, so this artifact is not an independent generalization evaluation.",
            "Diagnostic-only native IPA is excluded rather than treated as a valid target.",
            "No Ukrainian output is derived from the teacher or Strict output in this script.",
            "No production rule or runtime behavior is changed.",
        ],
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus-jsonl", type=Path, required=True)
    parser.add_argument("--teacher-predictions-jsonl", type=Path, required=True)
    parser.add_argument("--output-jsonl", type=Path, required=True)
    parser.add_argument("--summary-json", type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        corpus_rows = _load_jsonl(args.corpus_jsonl, "corpus")
        teacher_rows = _load_jsonl(args.teacher_predictions_jsonl, "teacher predictions")
        _validate_corpus_rows(corpus_rows)
        result = build_pairs(corpus_rows, teacher_rows)
    except (OSError, ValueError, KeyError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    args.output_jsonl.parent.mkdir(parents=True, exist_ok=True)
    args.output_jsonl.write_text(
        "".join(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n" for row in result["pairs"]),
        encoding="utf-8",
        newline="\n",
    )
    args.summary_json.parent.mkdir(parents=True, exist_ok=True)
    args.summary_json.write_text(json.dumps({k: v for k, v in result.items() if k != "pairs"}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result["summary"], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
