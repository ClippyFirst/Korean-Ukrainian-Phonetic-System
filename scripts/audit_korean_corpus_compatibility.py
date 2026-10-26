#!/usr/bin/env python3
"""Audit source-form overlap and target representation compatibility without merging corpora."""
from __future__ import annotations

import argparse
import hashlib
import json
import unicodedata
from collections import defaultdict
from pathlib import Path


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_jsonl(path: Path, expected_split: str) -> list[dict]:
    if not path.is_file():
        raise ValueError(f"missing corpus file: {path}")
    rows: list[dict] = []
    seen_ids: set[str] = set()
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"{path}:{line_number}: invalid JSONL") from exc
        if not isinstance(row, dict):
            raise ValueError(f"{path}:{line_number}: expected object")
        if row.get("split") != expected_split:
            raise ValueError(f"{path}:{line_number}: split does not match file {expected_split!r}")
        case_id = row.get("case_id")
        source = row.get("source_text")
        target = row.get("target_raw")
        target_type = row.get("target_representation")
        if not isinstance(case_id, str) or not case_id:
            raise ValueError(f"{path}:{line_number}: missing case_id")
        if case_id in seen_ids:
            raise ValueError(f"{path}:{line_number}: duplicate case_id {case_id!r}")
        seen_ids.add(case_id)
        if not isinstance(source, str) or not source.strip():
            raise ValueError(f"{path}:{line_number}: missing source_text")
        if not isinstance(target, str) or not target.strip():
            raise ValueError(f"{path}:{line_number}: missing target_raw")
        if not isinstance(target_type, str) or not target_type:
            raise ValueError(f"{path}:{line_number}: missing target_representation")
        row["_normalized_source"] = unicodedata.normalize("NFC", source.strip())
        rows.append(row)
    return rows


def load_corpus(directory: Path, expected_dataset_id: str) -> tuple[dict, dict]:
    manifest_path = directory / "manifest.json"
    if not manifest_path.is_file():
        raise ValueError(f"missing manifest: {manifest_path}")
    manifest_bytes = manifest_path.read_bytes()
    manifest = json.loads(manifest_bytes.decode("utf-8"))
    if manifest.get("dataset_id") != expected_dataset_id:
        raise ValueError(f"{directory}: unexpected dataset_id {manifest.get('dataset_id')!r}")
    rows_by_split: dict[str, list[dict]] = {}
    summary: dict[str, dict] = {}
    for split in ("train", "dev"):
        path = directory / f"{split}.jsonl"
        data = path.read_bytes()
        expected_hash = manifest.get("splits", {}).get(split, {}).get("output_file_sha256")
        if not expected_hash or sha256(data) != expected_hash:
            raise ValueError(f"{path}: output SHA-256 does not match manifest")
        rows = read_jsonl(path, split)
        expected_rows = manifest["splits"][split].get("source_rows")
        if len(rows) != expected_rows:
            raise ValueError(f"{path}: expected {expected_rows} rows, got {len(rows)}")
        rows_by_split[split] = rows
        source_forms = {row["_normalized_source"] for row in rows}
        targets_by_source: dict[str, set[str]] = defaultdict(set)
        for row in rows:
            targets_by_source[row["_normalized_source"]].add(row["target_raw"])
        summary[split] = {
            "row_count": len(rows),
            "unique_source_forms": len(source_forms),
            "source_forms_with_multiple_raw_targets": sum(len(v) > 1 for v in targets_by_source.values()),
            "target_representations": sorted({row["target_representation"] for row in rows}),
            "jsonl_sha256": sha256(data),
        }
    return rows_by_split, {
        "dataset_id": expected_dataset_id,
        "dataset_revision": manifest.get("dataset_revision"),
        "manifest_sha256": sha256(manifest_bytes),
        "splits": summary,
    }


def compare_rows(left: list[dict], right: list[dict]) -> dict:
    left_by_form: dict[str, set[str]] = defaultdict(set)
    right_by_form: dict[str, set[str]] = defaultdict(set)
    for row in left:
        left_by_form[row["_normalized_source"]].add(row["target_raw"])
    for row in right:
        right_by_form[row["_normalized_source"]].add(row["target_raw"])
    shared = set(left_by_form) & set(right_by_form)
    exact_raw_target_match = sum(
        bool(left_by_form[form] & right_by_form[form]) for form in shared
    )
    raw_target_string_difference = sum(
        not bool(left_by_form[form] & right_by_form[form]) for form in shared
    )
    return {
        "unique_source_form_intersection": len(shared),
        "shared_forms_with_any_exact_raw_target_match": exact_raw_target_match,
        "shared_forms_with_only_different_raw_target_strings": raw_target_string_difference,
        "target_comparison_interpretation": (
            "raw string comparison only; target conventions differ by source and are not "
            "linguistically comparable until a reviewed adapter is applied"
        ),
    }


def build_report(sigmorphon_dir: Path, ugtphon_dir: Path) -> dict:
    sig_rows, sig_meta = load_corpus(sigmorphon_dir, "sigmorphon-2021-task1-medium-korean")
    ugt_rows, ugt_meta = load_corpus(ugtphon_dir, "ugtphon-korean")
    intersections = {}
    for left_split in ("train", "dev"):
        for right_split in ("train", "dev"):
            intersections[f"sigmorphon_{left_split}__vs__ugtphon_{right_split}"] = compare_rows(
                sig_rows[left_split], ugt_rows[right_split]
            )
    return {
        "schema_version": "1.0",
        "purpose": "metadata-only cross-corpus compatibility and overlap audit",
        "corpora": {"sigmorphon": sig_meta, "ugtphon": ugt_meta},
        "cross_corpus_overlap": intersections,
        "decision": {
            "merge_performed": False,
            "training_performed": False,
            "test_data_exported": False,
            "target_compatibility": "UNVERIFIED",
            "reason": (
                "SIGMORPHON tokenized IPA and UGTPHON token-level IPA use distinct source "
                "representations; exact raw string comparisons are diagnostic only"
            ),
            "next_gate": (
                "review IPA conventions, map both targets to a common typed representation, "
                "then adjudicate source-form overlaps and conflicting targets before merging"
            ),
        },
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sigmorphon-dir", type=Path, required=True)
    parser.add_argument("--ugtphon-dir", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        report = build_report(args.sigmorphon_dir, args.ugtphon_dir)
    except (OSError, ValueError, KeyError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "cross_corpus_overlap": report["cross_corpus_overlap"],
        "merge_performed": False,
        "target_compatibility": report["decision"]["target_compatibility"],
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
