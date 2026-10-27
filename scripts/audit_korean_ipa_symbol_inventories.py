#!/usr/bin/env python3
"""Audit literal target-symbol inventories without inferring IPA segments.

SIGMORPHON targets retain their upstream whitespace-token representation.
UGTPHON targets are counted as raw Unicode code points only because this tool
does not apply a reviewed segmentation or convention-mapping adapter.
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
IPA_MARKERS = {
    "ː": "length_mark",
    "ˑ": "half_length_mark",
    "ˈ": "primary_stress_mark",
    "ˌ": "secondary_stress_mark",
    ".": "explicit_dot_boundary_or_source_token",
    "‿": "liaison_mark",
    "|": "literal_vertical_bar",
}


def _validate_row(row: dict, dataset: str, split: str, where: str) -> None:
    pin = PINS[dataset]
    if row.get("dataset_id") != pin["dataset_id"] or row.get("dataset_revision") != pin["dataset_revision"]:
        raise ValueError(f"{where}: source pin mismatch for {dataset}")
    if row.get("target_representation") != pin["target_representation"]:
        raise ValueError(f"{where}: target representation mismatch for {dataset}")
    if split not in {"train", "dev"} or row.get("split") != split:
        raise ValueError(f"{where}: only train/dev rows are accepted")
    if not isinstance(row.get("case_id"), str) or not row["case_id"]:
        raise ValueError(f"{where}: missing case_id")
    if not isinstance(row.get("source_text"), str) or not row["source_text"].strip():
        raise ValueError(f"{where}: missing source_text")
    if not isinstance(row.get("target_raw"), str) or not row["target_raw"].strip():
        raise ValueError(f"{where}: missing target_raw")


def load_rows(path: Path, dataset: str, split: str) -> list[dict]:
    if dataset not in PINS:
        raise ValueError(f"unsupported dataset: {dataset!r}")
    if split not in {"train", "dev"}:
        raise ValueError("only train/dev rows are accepted")
    if not path.is_file():
        raise ValueError(f"missing JSONL: {path}")
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
        _validate_row(row, dataset, split, f"{path}:{line_number}")
        if row["case_id"] in seen:
            raise ValueError(f"{path}:{line_number}: duplicate case_id {row['case_id']!r}")
        seen.add(row["case_id"])
        rows.append(row)
    if not rows:
        raise ValueError(f"{path}: no rows for {dataset}/{split}")
    return rows


def _inventory_for_split(rows: list[dict], dataset: str, split: str) -> dict:
    pin = PINS[dataset]
    unit_counts: Counter[str] = Counter()
    unit_examples: dict[str, set[str]] = defaultdict(set)
    codepoint_counts: Counter[str] = Counter()
    codepoint_examples: dict[str, set[str]] = defaultdict(set)
    sources: set[str] = set()
    seen: set[str] = set()
    marker_counts: Counter[str] = Counter()
    combining_counts: Counter[str] = Counter()
    target_characters = 0
    for index, row in enumerate(rows, 1):
        _validate_row(row, dataset, split, f"{dataset}/{split} row {index}")
        case_id = row["case_id"]
        if case_id in seen:
            raise ValueError(f"duplicate case_id in {dataset}/{split}: {case_id!r}")
        seen.add(case_id)
        raw = row["target_raw"]
        sources.add(unicodedata.normalize("NFC", row["source_text"].strip()))
        target_characters += len(raw)
        for char in raw:
            codepoint_counts[char] += 1
            codepoint_examples[char].add(raw)
            if unicodedata.category(char).startswith("M"):
                combining_counts[char] += 1
            if char in IPA_MARKERS:
                marker_counts[IPA_MARKERS[char]] += 1
        if dataset == "sigmorphon":
            # Preserve source whitespace tokenization as given. These are source
            # tokens, not asserted phonemes; a standalone "." is counted as a token.
            for token in raw.split():
                unit_counts[token] += 1
                unit_examples[token].add(raw)
    unit_kind = "source_whitespace_tokens" if dataset == "sigmorphon" else "raw_unicode_codepoints_only"
    return {
        "dataset_id": pin["dataset_id"],
        "dataset_revision": pin["dataset_revision"],
        "target_representation": pin["target_representation"],
        "split": split,
        "row_count": len(rows),
        "unique_source_forms": len(sources),
        "raw_target_character_count": target_characters,
        "target_unit_inventory_kind": unit_kind,
        "target_unit_counts": dict(sorted(unit_counts.items())),
        "target_unit_examples": {
            token: sorted(examples)[:3] for token, examples in sorted(unit_examples.items())
        },
        "unicode_codepoint_inventory": [
            {
                "character": char,
                "codepoint": f"U+{ord(char):04X}",
                "unicode_name": unicodedata.name(char, "UNNAMED"),
                "unicode_category": unicodedata.category(char),
                "count": codepoint_counts[char],
                "example_targets": sorted(codepoint_examples[char])[:3],
            }
            for char in sorted(codepoint_counts, key=ord)
        ],
        "unicode_codepoint_counts": {char: codepoint_counts[char] for char in sorted(codepoint_counts, key=ord)},
        "combining_codepoint_counts": {char: combining_counts[char] for char in sorted(combining_counts, key=ord)},
        "marker_counts": dict(sorted(marker_counts.items())),
        "interpretation_limits": [
            "Unicode code points and combining marks are literal character inventory, not a phoneme segmentation.",
            "SIGMORPHON whitespace-delimited target tokens preserve the source serialization and are not independently adjudicated as ClippyFirst segments.",
            "UGTPHON compact targets are not tokenized by this audit; only raw Unicode code points are counted.",
            "Marker counts indicate literal occurrence only and do not authorize deleting, inserting, or remapping the marker.",
        ],
    }


def build_inventory(rows_by_dataset: dict[str, list[dict]]) -> dict:
    if set(rows_by_dataset) != set(PINS):
        raise ValueError("provide exactly the sigmorphon and ugtphon datasets")
    corpora = {}
    for dataset in ("sigmorphon", "ugtphon"):
        rows = rows_by_dataset[dataset]
        if not rows:
            raise ValueError(f"no rows provided for {dataset}")
        split_rows = {"train": [], "dev": []}
        for index, row in enumerate(rows, 1):
            split = row.get("split")
            if split not in {"train", "dev"}:
                raise ValueError(f"{dataset} row {index}: only train/dev rows are accepted")
            _validate_row(row, dataset, split, f"{dataset} row {index}")
            split_rows[split].append(row)
        corpora[dataset] = {
            "dataset_id": PINS[dataset]["dataset_id"],
            "dataset_revision": PINS[dataset]["dataset_revision"],
            "splits": {
                split: _inventory_for_split(split_rows[split], dataset, split)
                for split in ("train", "dev") if split_rows[split]
            },
        }
    return {
        "schema_version": "1.0",
        "purpose": "source-specific IPA target inventory to support adapter review; no IPA conversion",
        "corpora": corpora,
        "decision": {
            "ipa_mapping_applied": False,
            "phoneme_segmentation_inferred": False,
            "corpora_merged": False,
            "test_rows_used": False,
            "target_compatibility": "UNVERIFIED",
        },
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sigmorphon-dir", type=Path, required=True)
    parser.add_argument("--ugtphon-dir", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        rows = {
            "sigmorphon": [
                *load_rows(args.sigmorphon_dir / "train.jsonl", "sigmorphon", "train"),
                *load_rows(args.sigmorphon_dir / "dev.jsonl", "sigmorphon", "dev"),
            ],
            "ugtphon": [
                *load_rows(args.ugtphon_dir / "train.jsonl", "ugtphon", "train"),
                *load_rows(args.ugtphon_dir / "dev.jsonl", "ugtphon", "dev"),
            ],
        }
        report = build_inventory(rows)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        dataset: {
            split: {
                "row_count": values["row_count"],
                "unique_source_forms": values["unique_source_forms"],
                "unique_unicode_codepoints": len(values["unicode_codepoint_inventory"]),
                "target_unit_inventory_kind": values["target_unit_inventory_kind"],
            }
            for split, values in data["splits"].items()
        }
        for dataset, data in report["corpora"].items()
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
