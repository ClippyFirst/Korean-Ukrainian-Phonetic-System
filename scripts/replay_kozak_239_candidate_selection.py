#!/usr/bin/env python3
"""Reproduce the pre-C11/C12 Broad-only 239-candidate replay.

This is a historical aggregate triage selector, not a phonological rule or IPA
adjudicator. It deliberately reproduces the old C01-C10 aggregate classifier
and aligns Broad fragments only; it must not be replaced with per-fragment
classification or the later C11/C12-aware exporter. The historical label
function emits C01-C07, C09 and C10 labels; C08 was not encoded in it.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import unicodedata
from pathlib import Path
from typing import Any

EXPECTED_REPORT_SHA256 = "8c25e630ca828719b269aeb84c8037d9c40f881a0f15c2e4ddf9d427edffa0f9"
EXPECTED_ARTIFACT_ZIP_SHA256 = "075ceff080decbb142492448c9344816bfb53f1e87fe563826668d037c053b89"
EXPECTED_REPLAY_INPUT_GIT_BLOB_SHA = "4335d6488a647f0e240dcc9f8aa24edc5f076a40"
EXPECTED_BROAD_MISMATCH_COUNT = 370
EXPECTED_SELECTED_COUNT = 239


def graphemes(value: str) -> list[str]:
    """Exact historical 2026-11-02 alignment: NFC plus combining marks only."""
    result: list[str] = []
    for char in unicodedata.normalize("NFC", value):
        if unicodedata.combining(char) and result:
            result[-1] += char
        else:
            result.append(char)
    return result


def align(reference: str, prediction: str) -> list[dict[str, str]]:
    """Exact historical Levenshtein tie-breaking over Unicode grapheme clusters."""
    a, b = graphemes(reference), graphemes(prediction)
    n, m = len(a), len(b)
    costs = [[0] * (m + 1) for _ in range(n + 1)]
    back: list[list[str | None]] = [[None] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        costs[i][0], back[i][0] = i, "D"
    for j in range(1, m + 1):
        costs[0][j], back[0][j] = j, "I"
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            options = [
                (costs[i - 1][j - 1] + (a[i - 1] != b[j - 1]), "M" if a[i - 1] == b[j - 1] else "S"),
                (costs[i - 1][j] + 1, "D"),
                (costs[i][j - 1] + 1, "I"),
            ]
            costs[i][j], back[i][j] = min(options, key=lambda item: item[0])
    edits: list[dict[str, str]] = []
    i, j = n, m
    while i or j:
        op = back[i][j]
        if op in ("M", "S"):
            left, right = a[i - 1], b[j - 1]
            i, j = i - 1, j - 1
        elif op == "D":
            left, right = a[i - 1], ""
            i -= 1
        else:
            left, right = "", b[j - 1]
            j -= 1
        if op != "M":
            edits.append({"op": op, "reference_fragment": left, "kozak_fragment": right})
    return list(reversed(edits))


def candidate_clusters(fragments: list[dict[str, str]]) -> list[str]:
    """Exact pre-C11/C12 aggregate C01-C10 classifier at historical commit 8c335dd."""
    text = "".join(item["reference_fragment"] + item["kozak_fragment"] for item in fragments)
    labels: list[str] = []
    if any(char in text for char in "ɭɾʎ"):
        labels.append("C01_C07_liquid_realization")
    if any(char in text for char in "hɦçβʝɸxɣ"):
        labels.append("C02_h_realization")
    if "ɲ" in text:
        labels.append("C03_nasal_palatalization")
    if any(char in text for char in "ʰ͡"):
        labels.append("C04_aspiration_affricate_notation")
    if any(char in text for char in "yɥø"):
        labels.append("C05_front_rounded_vowel")
    if "̚" in text:
        labels.append("C06_unreleased_coda")
    if any(char in text for char in "ːˑ"):
        labels.append("C09_vowel_length")
    if any(char in text for char in "ˈˌ"):
        labels.append("C10_stress")
    if not labels:
        labels.append("UNMAPPED_REQUIRES_REVIEW")
    return labels


def load_replay_rows(path: Path, verify_git_blob: bool = True) -> list[dict[str, str]]:
    raw = path.read_bytes()
    if verify_git_blob:
        header = f"blob {len(raw)}\0".encode("ascii")
        actual = hashlib.sha1(header + raw).hexdigest()
        if actual != EXPECTED_REPLAY_INPUT_GIT_BLOB_SHA:
            raise ValueError(
                f"replay input Git blob mismatch: expected {EXPECTED_REPLAY_INPUT_GIT_BLOB_SHA}, got {actual}"
            )
    rows = list(csv.DictReader(raw.decode("utf-8-sig").splitlines()))
    required = {
        "occurrence_id", "source_row_id", "token", "broad_reference_ipa",
        "broad_kozak_ipa", "broad_edit_distance",
    }
    if not rows or not required.issubset(rows[0]):
        raise ValueError("replay input is empty or missing required Broad fields")
    if len(rows) != EXPECTED_BROAD_MISMATCH_COUNT:
        raise ValueError(f"expected {EXPECTED_BROAD_MISMATCH_COUNT} Broad mismatch rows, got {len(rows)}")
    return rows


def select_broad_only_candidates_from_rows(rows: list[dict[str, Any]]) -> tuple[list[int], list[dict[str, Any]]]:
    selected: list[int] = []
    audit: list[dict[str, Any]] = []
    seen: set[int] = set()
    for row in rows:
        distance = int(row["broad_edit_distance"] or 0)
        if distance <= 0:
            raise ValueError("replay input must contain only Broad mismatches")
        occurrence_id = int(row["occurrence_id"])
        if occurrence_id in seen:
            raise ValueError(f"duplicate occurrence_id {occurrence_id}")
        seen.add(occurrence_id)
        fragments = align(str(row["broad_reference_ipa"]), str(row["broad_kozak_ipa"]))
        labels = candidate_clusters(fragments)
        audit.append({
            "occurrence_id": occurrence_id,
            "source_row_id": str(row["source_row_id"]),
            "token": str(row["token"]),
            "broad_edit_distance": distance,
            "aggregate_labels": labels,
        })
        if labels == ["UNMAPPED_REQUIRES_REVIEW"]:
            selected.append(occurrence_id)
    return sorted(selected), audit


def load_candidate_ids(path: Path) -> list[int]:
    lines = [line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    index = next((i for i, line in enumerate(lines) if line.startswith("Candidate occurrence IDs")), None)
    if index is None or index + 1 >= len(lines):
        raise ValueError("candidate ID file must contain the documented header and one comma-separated ID row")
    return [int(value) for value in lines[index + 1].split(",") if value]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--replay-input-csv", type=Path, required=True)
    parser.add_argument("--candidate-ids", type=Path, required=True)
    parser.add_argument("--output-json", type=Path)
    parser.add_argument("--skip-input-hash-check", action="store_true",
                        help="only for fixtures; never use for the historical replay")
    args = parser.parse_args(argv)
    try:
        rows = load_replay_rows(args.replay_input_csv, verify_git_blob=not args.skip_input_hash_check)
        selected, audit = select_broad_only_candidates_from_rows(rows)
        candidate_ids = load_candidate_ids(args.candidate_ids)
        if len(candidate_ids) != EXPECTED_SELECTED_COUNT or len(set(candidate_ids)) != EXPECTED_SELECTED_COUNT:
            raise ValueError("candidate snapshot must contain 239 unique IDs")
        if selected != sorted(candidate_ids):
            missing = sorted(set(candidate_ids) - set(selected))
            extra = sorted(set(selected) - set(candidate_ids))
            raise ValueError(f"replay does not match candidate snapshot; missing={missing}; extra={extra}")
    except (OSError, ValueError, KeyError) as exc:
        parser.error(str(exc))
    selected_set = set(selected)
    summary = {
        "status": "EXACT_REPLAY_MATCH",
        "report_sha256": EXPECTED_REPORT_SHA256,
        "artifact_zip_sha256": EXPECTED_ARTIFACT_ZIP_SHA256,
        "replay_input_git_blob_sha": EXPECTED_REPLAY_INPUT_GIT_BLOB_SHA,
        "broad_mismatch_occurrences": len(audit),
        "selected_occurrences": len(selected),
        "unique_source_rows": len({row["source_row_id"] for row in audit if row["occurrence_id"] in selected_set}),
        "unique_tokens": len({row["token"] for row in audit if row["occurrence_id"] in selected_set}),
        "selection_rule": "Broad mismatch; historical NFC/combining-mark alignment; Broad fragments only; pre-C11/C12 aggregate C01-C10 classifier; select only UNMAPPED_REQUIRES_REVIEW",
        "historical_classifier_commit": "8c335dd7031bdae59b3ef7db715b54f0fdc9bcd5",
        "selected_ids_sha256": hashlib.sha256(",".join(map(str, selected)).encode("ascii")).hexdigest(),
    }
    if args.output_json:
        args.output_json.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
