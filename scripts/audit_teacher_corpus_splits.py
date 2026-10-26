#!/usr/bin/env python3
"""Audit pinned Korean train/dev/test partitions without emitting corpus rows."""
from __future__ import annotations

import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path
from urllib.request import urlopen

SOURCES = {
    "ugtphon": {
        "revision": "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54",
        "license": "Apache-2.0 (Korean subset LICENSE)",
        "splits": {
            "train": ("https://raw.githubusercontent.com/naver-ai/UGTPHON/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/ko/train.json", "771ef17ceed8127980f0be5103674cfa53627e55"),
            "dev": ("https://raw.githubusercontent.com/naver-ai/UGTPHON/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/ko/dev.json", "71127176c1487741ed9a6492cdaabba78222461d"),
            "test": ("https://raw.githubusercontent.com/naver-ai/UGTPHON/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/ko/test.json", "59380491d5a797308c475f7d0007dcf6c4be00af"),
        },
    },
    "sigmorphon_2021_medium_korean": {
        "revision": "821bcdece5a47820872215969f275004b0abe80c",
        "license": "CC BY-SA 3.0 per repository benchmark register; preserve attribution and re-check task terms",
        "splits": {
            "train": ("https://raw.githubusercontent.com/sigmorphon/2021-task1/821bcdece5a47820872215969f275004b0abe80c/data/medium/kor_train.tsv", "6bafb36d312625353e805506b349e18acd2dff84"),
            "dev": ("https://raw.githubusercontent.com/sigmorphon/2021-task1/821bcdece5a47820872215969f275004b0abe80c/data/medium/kor_dev.tsv", "5c5d725339b660db3ce86339dc3103354de1bfd1"),
            "test": ("https://raw.githubusercontent.com/sigmorphon/2021-task1/821bcdece5a47820872215969f275004b0abe80c/data/medium/kor_test.tsv", "ea0a329a6c958a67817558411fe6c059f40ff588"),
        },
    },
}


def git_blob_sha1(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()


def fetch_pinned(url: str, expected_blob_sha: str) -> tuple[bytes, dict[str, str | int]]:
    with urlopen(url, timeout=60) as response:
        data = response.read()
    actual_blob_sha = git_blob_sha1(data)
    if actual_blob_sha != expected_blob_sha:
        raise ValueError(f"source drift at {url}: expected Git blob {expected_blob_sha}, got {actual_blob_sha}")
    return data, {
        "url": url,
        "git_blob_sha1": actual_blob_sha,
        "sha256": hashlib.sha256(data).hexdigest(),
        "bytes": len(data),
    }


def parse_ugtphon(data: bytes, expected_split: str) -> tuple[dict, set[str], set[str]]:
    rows = json.loads(data.decode("utf-8"))
    if not isinstance(rows, list) or not rows:
        raise ValueError(f"UGTPHON {expected_split}: expected a non-empty JSON array")
    ids, raw_texts, token_forms = set(), set(), set()
    for i, row in enumerate(rows):
        if not isinstance(row, dict):
            raise ValueError(f"UGTPHON {expected_split} row {i}: not an object")
        case_id, text, split = row.get("id"), row.get("text"), row.get("split")
        if not isinstance(case_id, str) or not case_id:
            raise ValueError(f"UGTPHON {expected_split} row {i}: missing id")
        if case_id in ids:
            raise ValueError(f"UGTPHON {expected_split}: duplicate id {case_id}")
        ids.add(case_id)
        if split != expected_split:
            raise ValueError(f"UGTPHON row {case_id}: split field {split!r} != {expected_split!r}")
        if not isinstance(text, str) or not text.strip():
            raise ValueError(f"UGTPHON row {case_id}: missing text")
        raw_texts.add(" ".join(text.split()))
        tokens = row.get("tokens", [])
        if not isinstance(tokens, list):
            raise ValueError(f"UGTPHON row {case_id}: tokens is not a list")
        for token in tokens:
            if isinstance(token, dict) and isinstance(token.get("text"), str) and token["text"].strip():
                token_forms.add(" ".join(token["text"].split()))
    return {"rows": len(rows), "unique_ids": len(ids), "unique_texts": len(raw_texts), "unique_token_forms": len(token_forms)}, raw_texts, token_forms


def parse_sigmorphon(data: bytes, split: str) -> tuple[dict, set[str]]:
    rows = [line.split("\t") for line in data.decode("utf-8").splitlines() if line.strip()]
    if not rows:
        raise ValueError(f"SIGMORPHON {split}: empty TSV")
    for i, row in enumerate(rows, 1):
        if len(row) != 2 or not row[0].strip() or not row[1].strip():
            raise ValueError(f"SIGMORPHON {split} line {i}: expected grapheme<TAB>tokenized-IPA")
    forms = {row[0] for row in rows}
    return {"rows": len(rows), "unique_graphemes": len(forms), "duplicate_grapheme_rows": len(rows) - len(forms)}, forms


def pairwise_overlaps(sets: dict[str, set[str]]) -> dict[str, dict[str, int]]:
    names = list(sets)
    result = {}
    for i, left in enumerate(names):
        for right in names[i + 1:]:
            result[f"{left}__vs__{right}"] = {
                "unique_form_intersection": len(sets[left] & sets[right]),
                "left_unique_forms": len(sets[left]),
                "right_unique_forms": len(sets[right]),
            }
    return result


def build_report() -> dict:
    report = {"schema_version": "1.0", "purpose": "pinned source/split integrity and lexical-overlap audit; no model inference", "datasets": {}, "cross_corpus_token_overlap": {}, "test_data_used_for_tuning": False}
    ugt_text, ugt_tokens, sig_forms = {}, {}, {}
    for dataset, meta in SOURCES.items():
        split_reports, forms_by_split, token_by_split, source_files = {}, {}, {}, {}
        for split, (url, expected_sha) in meta["splits"].items():
            data, file_meta = fetch_pinned(url, expected_sha)
            source_files[split] = file_meta
            if dataset == "ugtphon":
                summary, texts, tokens = parse_ugtphon(data, split)
                split_reports[split] = summary
                forms_by_split[split] = texts
                token_by_split[split] = tokens
            else:
                summary, forms = parse_sigmorphon(data, split)
                split_reports[split] = summary
                forms_by_split[split] = forms
                token_by_split[split] = forms
        report["datasets"][dataset] = {
            "revision": meta["revision"], "license_note": meta["license"],
            "files": source_files, "splits": split_reports,
            "raw_form_overlap": pairwise_overlaps(forms_by_split),
            "policy": "train may be used for fitting; dev for selection; test is sealed evaluation only",
        }
        if dataset == "ugtphon":
            ugt_text, ugt_tokens = forms_by_split, token_by_split
        else:
            sig_forms = forms_by_split
    report["cross_corpus_token_overlap"] = {
        f"ugtphon_{a}__vs__sigmorphon_{b}": len(ugt_tokens[a] & sig_forms[b])
        for a in ugt_tokens for b in sig_forms
    }
    report["acceptance"] = {
        "all_pinned_blobs_verified": True,
        "all_declared_splits_verified": True,
        "test_partition_in_training_input": False,
        "model_training_or_inference_performed": False,
        "note": "Overlap counts are audit evidence only. Exclude or adjudicate overlaps before fitting; never tune against test outputs."
    }
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-json", type=Path, required=True)
    args = parser.parse_args(argv)
    report = build_report()
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"datasets": {k: v["splits"] for k, v in report["datasets"].items()}, "cross_corpus_token_overlap": report["cross_corpus_token_overlap"]}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
