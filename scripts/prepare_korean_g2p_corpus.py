#!/usr/bin/env python3
"""Prepare a reproducible, train/dev-only Korean G2P corpus from pinned SIGMORPHON TSVs.

This exports source examples for research/training; it never reads or emits test rows.
Raw tokenized IPA is preserved verbatim apart from removing the TSV line ending.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import unicodedata
from pathlib import Path
from urllib.request import urlopen

DATASET_ID = "sigmorphon-2021-task1-medium-korean"
REVISION = "821bcdece5a47820872215969f275004b0abe80c"
BASE_URL = (
    "https://raw.githubusercontent.com/sigmorphon/2021-task1/"
    f"{REVISION}/data/medium/kor_{{split}}.tsv"
)
EXPECTED_GIT_BLOB_SHA1 = {
    "train": "6bafb36d312625353e805506b349e18acd2dff84",
    "dev": "5c5d725339b660db3ce86339dc3103354de1bfd1",
    "test": "ea0a329a6c958a67817558411fe6c059f40ff588",
}
EXPECTED_ROWS = {"train": 8000, "dev": 1000, "test": 1000}


def git_blob_sha1(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def parse_tsv(data: bytes, split: str, *, expected_rows: int | None = None) -> list[dict[str, str | int]]:
    if split not in EXPECTED_ROWS:
        raise ValueError(f"unsupported split: {split!r}")
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise ValueError(f"{split}: source is not valid UTF-8") from exc
    records: list[dict[str, str | int]] = []
    for line_number, line in enumerate(text.splitlines(), start=1):
        if not line:
            continue
        fields = line.split("\t")
        if len(fields) != 2 or not fields[0].strip() or not fields[1].strip():
            raise ValueError(f"{split}:{line_number}: expected non-empty grapheme<TAB>tokenized-IPA")
        source_raw, target_raw = fields
        source_nfc = unicodedata.normalize("NFC", source_raw)
        if not source_nfc.strip():
            raise ValueError(f"{split}:{line_number}: source is empty after NFC")
        records.append({
            "case_id": f"{DATASET_ID}:{split}:{line_number:05d}",
            "dataset_id": DATASET_ID,
            "dataset_revision": REVISION,
            "split": split,
            "source_text": source_nfc,
            "source_text_raw": source_raw,
            "target_raw": target_raw,
            "target_representation": "tokenized_ipa_from_sigmorphon_tsv",
            "target_normalization": "none; raw target preserved exactly",
            "source_line": line_number,
        })
    required_rows = EXPECTED_ROWS[split] if expected_rows is None else expected_rows
    if len(records) != required_rows:
        raise ValueError(f"{split}: expected {required_rows} rows, got {len(records)}")
    forms = [str(record["source_text"]) for record in records]
    if len(set(forms)) != len(forms):
        raise ValueError(f"{split}: duplicate NFC-normalized source forms; refusing implicit deduplication")
    return records


def fetch_split(split: str) -> tuple[bytes, dict[str, str | int]]:
    url = BASE_URL.format(split=split)
    with urlopen(url, timeout=60) as response:
        data = response.read()
    actual = git_blob_sha1(data)
    expected = EXPECTED_GIT_BLOB_SHA1[split]
    if actual != expected:
        raise ValueError(f"{split}: pinned Git blob mismatch: expected {expected}, got {actual}")
    return data, {
        "url": url,
        "git_blob_sha1": actual,
        "sha256": sha256(data),
        "bytes": len(data),
    }


def prepare(output_dir: Path) -> dict:
    output_dir.mkdir(parents=True, exist_ok=True)
    loaded: dict[str, list[dict[str, str | int]]] = {}
    source_meta: dict[str, dict[str, str | int]] = {}
    source_forms: dict[str, set[str]] = {}
    for split in ("train", "dev", "test"):
        data, meta = fetch_split(split)
        records = parse_tsv(data, split)
        source_meta[split] = meta
        loaded[split] = records
        source_forms[split] = {str(row["source_text"]) for row in records}

    train_dev_overlap = source_forms["train"] & source_forms["dev"]
    train_test_overlap = source_forms["train"] & source_forms["test"]
    dev_test_overlap = source_forms["dev"] & source_forms["test"]
    if train_dev_overlap:
        raise ValueError(f"train/dev source-form leakage: {len(train_dev_overlap)} forms overlap")
    if train_test_overlap := (source_forms["train"] & source_forms["test"]):
        raise ValueError(f"train/test source-form leakage: {len(train_test_overlap)} forms overlap")
    if dev_test_overlap := (source_forms["dev"] & source_forms["test"]):
        raise ValueError(f"dev/test source-form leakage: {len(dev_test_overlap)} forms overlap")
    # Test is inspected only for split-overlap diagnostics and is never serialized.
    overlap = {
        "train_dev": len(train_dev_overlap),
        "train_test": len(train_test_overlap),
        "dev_test": len(dev_test_overlap),
    }
    for split in ("train", "dev"):
        payload = "".join(
            json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n"
            for row in loaded[split]
        )
        (output_dir / f"{split}.jsonl").write_text(payload, encoding="utf-8", newline="\n")
    manifest = {
        "schema_version": "1.0",
        "purpose": "research corpus preparation; raw tokenized IPA target preserved",
        "dataset_id": DATASET_ID,
        "dataset_revision": REVISION,
        "source_terms_note": "Review SIGMORPHON/WikiPron attribution and task-specific terms before external distribution.",
        "source_representation": "Hangul grapheme",
        "target_representation": "tokenized IPA as stored in source TSV; not asserted equivalent to ClippyFirst broad IPA",
        "target_normalization": "none",
        "splits": {
            split: {
                **source_meta[split],
                "source_rows": len(loaded[split]),
                "output_row_count": len(loaded[split]) if split in {"train", "dev"} else 0,
                "unique_nfc_source_forms": len(source_forms[split]),
                "exported": split in {"train", "dev"},
                "output_file_sha256": sha256((output_dir / f"{split}.jsonl").read_bytes())
                if split in {"train", "dev"} else None,
            }
            for split in ("train", "dev", "test")
        },
        "source_form_overlap_counts": overlap,
        "test_policy": "test source was fetched only to verify pin, count, and overlap; no test records are exported",
        "cross_corpus_deduplication": "not performed; run a separate audited cross-corpus overlap report before combining datasets",
        "test_data_used_for_training_or_tuning": False,
    }
    manifest_path = output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        manifest = prepare(args.output_dir)
    except (OSError, ValueError) as exc:
        parser.error(str(exc))
    print(json.dumps({
        "dataset_id": manifest["dataset_id"],
        "rows_exported": {split: manifest["splits"][split]["source_rows"] for split in ("train", "dev")},
        "source_form_overlap_counts": manifest["source_form_overlap_counts"],
        "test_records_exported": False,
        "output_dir": str(args.output_dir),
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
