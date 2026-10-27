#!/usr/bin/env python3
"""Build a provenance-preserving queue for train/train IPA annotation conflicts.

This tool does not normalize IPA, select a gold source, or create ClippyFirst rules.
It only removes SIGMORPHON serialization whitespace for a diagnostic comparison.
"""
from __future__ import annotations

import argparse
import json
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

PINS = {
    "sigmorphon": {
        "dataset_id": "sigmorphon-2021-task1-medium-korean",
        "dataset_revision": "821bcdece5a47820872215969f275004b0abe80c",
        "target_representation": "tokenized_ipa_from_sigmorphon_tsv",
    },
    "ugtphon": {
        "dataset_id": "ugtphon-korean",
        "dataset_revision": "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54",
        "target_representation": "ugtphon_token_phoneme_ipa",
    },
}


def load_rows(path: Path, dataset: str, expected_split: str = "train") -> list[dict]:
    if dataset not in PINS:
        raise ValueError(f"unsupported dataset key: {dataset!r}")
    if expected_split != "train":
        raise ValueError("only train rows may enter the rule-candidate adjudication queue")
    if not path.is_file():
        raise ValueError(f"missing input JSONL: {path}")
    rows = []
    seen_ids: set[str] = set()
    pin = PINS[dataset]
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"{path}:{line_number}: invalid JSONL") from exc
        if not isinstance(row, dict):
            raise ValueError(f"{path}:{line_number}: expected object")
        if row.get("dataset_id") != pin["dataset_id"] or row.get("dataset_revision") != pin["dataset_revision"]:
            raise ValueError(f"{path}:{line_number}: source pin mismatch for {dataset}")
        if row.get("target_representation") != pin["target_representation"]:
            raise ValueError(f"{path}:{line_number}: target representation mismatch for {dataset}")
        if row.get("split") != expected_split:
            raise ValueError(f"{path}:{line_number}: only train rows are accepted; got {row.get('split')!r}")
        case_id = row.get("case_id")
        source = row.get("source_text")
        target = row.get("target_raw")
        if not isinstance(case_id, str) or not case_id:
            raise ValueError(f"{path}:{line_number}: missing case_id")
        if case_id in seen_ids:
            raise ValueError(f"{path}:{line_number}: duplicate case_id {case_id!r}")
        if not isinstance(source, str) or not source.strip():
            raise ValueError(f"{path}:{line_number}: missing source_text")
        if not isinstance(target, str) or not target.strip():
            raise ValueError(f"{path}:{line_number}: missing target_raw")
        seen_ids.add(case_id)
        row["_normalized_source"] = unicodedata.normalize("NFC", source.strip())
        row["_comparison_target"] = comparison_target(row, dataset)
        rows.append(row)
    if not rows:
        raise ValueError(f"{path}: no eligible train rows")
    return rows


def comparison_target(row: dict, dataset: str) -> str:
    target = row["target_raw"]
    if dataset == "sigmorphon":
        # The SIGMORPHON task describes whitespace-delimited segments. Joining them
        # is serialization-only; no phone mapping or boundary inference is performed.
        target = "".join(target.split())
    return unicodedata.normalize("NFC", target.strip())


def codepoint_inventory(raw: str) -> list[dict]:
    """List literal code points, not inferred IPA segments or phonemes."""
    chars = sorted(set(raw), key=ord)
    return [
        {"character": char, "codepoint": f"U+{ord(char):04X}"}
        for char in chars
    ]


def _group(rows: list[dict]) -> dict[str, list[dict]]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        grouped[row["_normalized_source"]].append(row)
    return grouped


def _difference_category(left: list[dict], right: list[dict]) -> str:
    left_targets = {row["_comparison_target"] for row in left}
    right_targets = {row["_comparison_target"] for row in right}
    if left_targets == right_targets:
        return "exact_after_serialization_only"
    if left_targets & right_targets:
        # A partial overlap can hide genuine variation when either corpus has
        # multiple annotations for the same source form. Never discard it as
        # an exact match; retain every candidate for human review.
        return "partial_annotation_overlap_requires_review"
    left_without_dots = {target.replace(".", "") for target in left_targets}
    right_without_dots = {target.replace(".", "") for target in right_targets}
    if left_without_dots == right_without_dots:
        return "syllable_dot_only_diagnostic"
    left_without_length = {
        target.replace("ː", "").replace("ˑ", "") for target in left_targets
    }
    right_without_length = {
        target.replace("ː", "").replace("ˑ", "") for target in right_targets
    }
    if left_without_length == right_without_length:
        return "length_mark_only_diagnostic"
    return "other_symbol_or_feature_difference"


def _candidate(row: dict, dataset: str) -> dict:
    return {
        "case_id": row["case_id"],
        "dataset_id": row["dataset_id"],
        "dataset_revision": row["dataset_revision"],
        "source_line": row.get("source_line"),
        "source_sentence_id": row.get("source_sentence_id"),
        "token_index": row.get("token_index"),
        "target_representation": row["target_representation"],
        "target_raw": row["target_raw"],
        "comparison_target": row["_comparison_target"],
        "unicode_codepoint_inventory": codepoint_inventory(row["target_raw"]),
        "codepoint_inventory_policy": "literal Unicode inventory only; not phoneme segmentation",
    }


def _prepare_in_memory_rows(rows: list[dict], dataset: str) -> list[dict]:
    pin = PINS[dataset]
    prepared = []
    for row in rows:
        if row.get("dataset_id") != pin["dataset_id"] or row.get("dataset_revision") != pin["dataset_revision"]:
            raise ValueError(f"source pin mismatch for {dataset}")
        if row.get("target_representation") != pin["target_representation"]:
            raise ValueError(f"target representation mismatch for {dataset}")
        if row.get("split") != "train":
            raise ValueError("only train rows are accepted")
        source = row.get("source_text")
        target = row.get("target_raw")
        if not isinstance(source, str) or not source.strip() or not isinstance(target, str) or not target.strip():
            raise ValueError("source_text and target_raw must be non-empty strings")
        prepared_row = dict(row)
        prepared_row["_normalized_source"] = unicodedata.normalize("NFC", source.strip())
        prepared_row["_comparison_target"] = comparison_target(prepared_row, dataset)
        prepared.append(prepared_row)
    return prepared


def build_queue(sigmorphon_rows: list[dict], ugtphon_rows: list[dict]) -> dict:
    sigmorphon_rows = _prepare_in_memory_rows(sigmorphon_rows, "sigmorphon")
    ugtphon_rows = _prepare_in_memory_rows(ugtphon_rows, "ugtphon")
    left, right = _group(sigmorphon_rows), _group(ugtphon_rows)
    shared = sorted(set(left) & set(right))
    categories: Counter[str] = Counter()
    items = []
    exact = 0
    for source in shared:
        category = _difference_category(left[source], right[source])
        if category == "exact_after_serialization_only":
            exact += 1
            continue
        categories[category] += 1
        items.append({
            "queue_id": f"KIPA-TRAIN-{len(items) + 1:04d}",
            "source_text": source,
            "source_normalization": "NFC and trim for source-form join only; raw source remains in source corpus",
            "difference_category": category,
            "normalization_performed": [
                "NFC source-form key",
                "SIGMORPHON whitespace-token separator removal for comparison only",
            ],
            "sigmorphon_candidates": [_candidate(row, "sigmorphon") for row in sorted(left[source], key=lambda x: x["case_id"])],
            "ugtphon_candidates": [_candidate(row, "ugtphon") for row in sorted(right[source], key=lambda x: x["case_id"])],
            "review_status": "UNADJUDICATED",
            "proposed_mapping": None,
            "selected_gold_source": None,
            "phonological_rule_candidate": None,
            "review_checklist": [
                "Inspect the pinned source documentation and annotation conventions.",
                "Compare all candidate annotations for this source form; do not assume either corpus is gold.",
                "Preserve contrastive segment features, length marks, and explicit boundary information.",
                "Record source-backed explanation and independent reviewer decision before any mapping or rule promotion.",
            ],
            "interpretation_limits": [
                "Unicode code points are not a phoneme segmentation.",
                "Removing SIGMORPHON whitespace is serialization-only; no source IPA symbols are mapped.",
                "Length-mark and dot categories are counterfactual diagnostics, not normalization instructions.",
                "This queue is train/train only and is not an evaluation set or gold annotation.",
            ],
        })
    return {
        "schema_version": "1.0",
        "purpose": "train/train conflict queue for independent IPA convention review; not a converter or rule generator",
        "source_pins": PINS,
        "summary": {
            "sigmorphon_train_rows": len(sigmorphon_rows),
            "ugtphon_train_token_occurrences": len(ugtphon_rows),
            "shared_train_forms": len(shared),
            "exact_after_serialization_only": exact,
            "queued_conflicts": len(items),
            "difference_category_counts": dict(sorted(categories.items())),
        },
        "items": items,
        "decision": {
            "corpora_merged": False,
            "ipa_mapping_applied": False,
            "production_rules_changed": False,
            "test_or_dev_rows_used": False,
            "target_compatibility": "UNVERIFIED",
        },
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sigmorphon-train", type=Path, required=True)
    parser.add_argument("--ugtphon-train", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        sig = load_rows(args.sigmorphon_train, "sigmorphon", "train")
        ugt = load_rows(args.ugtphon_train, "ugtphon", "train")
        queue = build_queue(sig, ugt)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(queue, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"summary": queue["summary"], "decision": queue["decision"]}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
