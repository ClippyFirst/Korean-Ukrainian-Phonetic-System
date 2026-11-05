#!/usr/bin/env python3
"""Rebuild the pinned 370-row Broad mismatch context ledger.

The source corpus is intentionally supplied by the caller rather than fetched
at runtime. It must be UGTPHON ko/test.json at the pinned commit and its Git
blob SHA-1 is verified before any join is performed.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MISMATCH_CSV = ROOT / "research/kozak-kim-mismatch-fragments-2026-11-02.csv"
DEFAULT_OUTPUT = ROOT / "research/kozak-kim-broad-mismatch-context-ledger-2026-11-05.csv"
SOURCE_COMMIT = "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54"
SOURCE_BLOB_SHA1 = "59380491d5a797308c475f7d0007dcf6c4be00af"
HISTORICAL_HEAD = "4f3f307c5bb056bce3b0aedc8ab07e0010eaa695"
HANGUL_TOKEN = re.compile(r"^[\uac00-\ud7a3]+$")

PINNED = {
    "benchmark_run_id": "41471244424",
    "benchmark_head_commit": HISTORICAL_HEAD,
    "benchmark_artifact_id": "13156351613",
    "benchmark_artifact_sha256": "749ac9a2b9db96c1e27828919afe05ef4320e35ca6a91ab2038c1ff3e9d04c69",
    "benchmark_report_sha256": "26ab5f77011cf83f649918bf1f5794133a97e42e1155d34cca33fd552d564b93",
    "engine_source_commit": HISTORICAL_HEAD,
    "engine_source_blob": "c4df6e5805db297bfb345b638279625c199bf166",
    "ipa_profile": "clippyfirst-korean-broad-v1",
    "ipa_profile_version": "1",
    "ipa_profile_status": "unadjudicated-cross-runtime",
    "broad_profile_id": "korean-broad-candidate-sensitivity-v1",
    "broad_profile_version": "1",
    "broad_profile_status": "research-only-unadjudicated",
    "broad_profile_blob": "e13086f0fd98ce9564326ff50b0458c27392932f",
    "normalizer_source_path": "scripts/benchmark_ugtphon_ko.py",
    "normalizer_source_blob": "d3e3c1a2c5e6dd76bacee1b8ae9864d204fa9e1a",
    "browser_normalizer_source_blob": "5a1ea3c2e99ba20303122bb124a6aaec22e56ad2",
    "source_corpus": "naver-ai/UGTPHON/ko/test.json",
    "source_corpus_commit": SOURCE_COMMIT,
    "source_corpus_blob": SOURCE_BLOB_SHA1,
    "source_corpus_license": "Apache-2.0",
}

FIELDS = [
    "occurrence_id", "source_row_id", "source_token_index", "token", "surface_hangul",
    "source_context_text", "source_context_canonical", "source_context_phonemes",
    "source_context_token_count", "strict_reference_ipa", "strict_kozak_ipa",
    "strict_edit_distance", "g2pk_ipa", "g2pk_edit_distance", "broad_reference_ipa",
    "broad_kozak_ipa", "broad_edit_distance", "strict_mismatch_fragments",
    "broad_mismatch_fragments", "candidate_clusters", "historical_239_membership",
    "decision", "decision_status", "decision_rationale", *PINNED.keys(),
]


def git_blob_sha1(payload: bytes) -> str:
    header = b"blob " + str(len(payload)).encode("ascii") + b"\0"
    return hashlib.sha1(header + payload).hexdigest()


def eligible_occurrences(source_rows: list[dict]) -> dict[str, tuple[dict, dict, int]]:
    indexed = {}
    occurrence_id = 0
    for source_row in source_rows:
        for token_index, token in enumerate(source_row.get("tokens", [])):
            canonical = token.get("canonical")
            gold = token.get("phoneme")
            if not isinstance(canonical, str) or not HANGUL_TOKEN.fullmatch(canonical):
                continue
            if not isinstance(gold, str) or not gold.strip():
                continue
            if not any(part.strip() for part in gold.split(",")):
                continue
            indexed[str(occurrence_id)] = (source_row, token, token_index)
            occurrence_id += 1
    return indexed


def build_rows(mismatch_rows: list[dict], source_rows: list[dict]) -> list[dict[str, str]]:
    source_by_occurrence = eligible_occurrences(source_rows)
    selected = [row for row in mismatch_rows if int(row.get("broad_edit_distance") or 0) > 0]
    if len(selected) != 370:
        raise ValueError(f"Expected 370 Broad mismatches, found {len(selected)}")
    output = []
    seen = set()
    for row in selected:
        occurrence_id = str(row["occurrence_id"])
        if occurrence_id in seen:
            raise ValueError(f"Duplicate occurrence ID: {occurrence_id}")
        seen.add(occurrence_id)
        joined = source_by_occurrence.get(occurrence_id)
        if joined is None:
            raise ValueError(f"No source token for occurrence {occurrence_id}")
        source_row, token, token_index = joined
        if source_row.get("id") != row.get("source_row_id"):
            raise ValueError(f"Source row mismatch for occurrence {occurrence_id}")
        if token.get("canonical") != row.get("token"):
            raise ValueError(f"Canonical token mismatch for occurrence {occurrence_id}")
        item = {
            "occurrence_id": occurrence_id,
            "source_row_id": row["source_row_id"],
            "source_token_index": str(token_index),
            "token": row["token"],
            "surface_hangul": row.get("surface_hangul", ""),
            "source_context_text": source_row.get("text", ""),
            "source_context_canonical": source_row.get("canonical", ""),
            "source_context_phonemes": source_row.get("phonemes", ""),
            "source_context_token_count": str(len(source_row.get("tokens", []))),
            "strict_reference_ipa": row.get("strict_reference_ipa", ""),
            "strict_kozak_ipa": row.get("strict_kozak_ipa", ""),
            "strict_edit_distance": row.get("strict_edit_distance", ""),
            "g2pk_ipa": row.get("g2pk_ipa", ""),
            "g2pk_edit_distance": row.get("g2pk_edit_distance", ""),
            "broad_reference_ipa": row.get("broad_reference_ipa", ""),
            "broad_kozak_ipa": row.get("broad_kozak_ipa", ""),
            "broad_edit_distance": row.get("broad_edit_distance", ""),
            "strict_mismatch_fragments": row.get("strict_mismatch_fragments", ""),
            "broad_mismatch_fragments": row.get("broad_mismatch_fragments", ""),
            "candidate_clusters": row.get("candidate_clusters", ""),
            "historical_239_membership": "UNRESOLVED_NO_HISTORICAL_ASSIGNMENT_SNAPSHOT",
            "decision": "ABSTAIN",
            "decision_status": "EVIDENCE_LIMITED_DIAGNOSTIC_ONLY",
            "decision_rationale": (
                "A benchmark mismatch is not proof of a Korean pronunciation error. "
                "No independent occurrence-level IPA adjudication, source audio/speaker "
                "crosswalk, or reproducible historical 239-member assignment is attached; "
                "do not change production from this diagnostic alone."
            ),
            **PINNED,
        }
        output.append(item)
    return output


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-json", type=Path, required=True)
    parser.add_argument("--mismatch-csv", type=Path, default=DEFAULT_MISMATCH_CSV)
    parser.add_argument("--output-csv", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    source_bytes = args.source_json.read_bytes()
    actual_blob = git_blob_sha1(source_bytes)
    if actual_blob != SOURCE_BLOB_SHA1:
        raise SystemExit(
            f"UGTPHON source blob mismatch: expected {SOURCE_BLOB_SHA1}, got {actual_blob}"
        )
    source_rows = json.loads(source_bytes)
    with args.mismatch_csv.open(encoding="utf-8-sig", newline="") as handle:
        mismatch_rows = list(csv.DictReader(handle))
    rows = build_rows(mismatch_rows, source_rows)

    args.output_csv.parent.mkdir(parents=True, exist_ok=True)
    with args.output_csv.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    print(json.dumps({
        "status": "CONTEXT_LEDGER_REBUILT",
        "rows": len(rows),
        "unique_occurrences": len({row["occurrence_id"] for row in rows}),
        "all_contexts_joined": all(row["source_context_text"] for row in rows),
        "historical_239_membership": "UNRESOLVED",
        "source_corpus_blob": actual_blob,
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
