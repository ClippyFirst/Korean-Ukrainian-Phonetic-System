#!/usr/bin/env python3
"""Verify recovered frozen holdout membership, ordering, provenance, and byte hashes."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data/korean/benchmarks/ipa-holdout-24-manifest.json"
FIXTURE = ROOT / "data/korean/benchmarks/target-renderer-holdout-24.csv"
EXPECTED_GIT_BLOB_SHA1 = "f30c5fa8a59753df3d7c06bbbe7d4e43d0b8fb26"


def audit() -> dict:
    manifest_bytes = MANIFEST.read_bytes()
    manifest = json.loads(manifest_bytes)
    with FIXTURE.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))

    cases = manifest.get("cases", [])
    original_forms = [case.get("input") for case in cases]
    fixture_forms = [row.get("form") for row in rows]
    original_ids = [case.get("caseId") for case in cases]
    fixture_original_ids = [row.get("original_case_id") for row in rows]
    git_blob_sha1 = hashlib.sha1(
        b"blob " + str(len(manifest_bytes)).encode("ascii") + b"\0" + manifest_bytes
    ).hexdigest()
    sha256 = hashlib.sha256(manifest_bytes).hexdigest()

    report = {
        "status": "PASS" if (
            manifest.get("caseCount") == 24
            and len(cases) == 24
            and len(rows) == 24
            and len(set(original_forms)) == 24
            and original_forms == fixture_forms
            and original_ids == fixture_original_ids
            and git_blob_sha1 == EXPECTED_GIT_BLOB_SHA1
            and manifest.get("status") == "FROZEN_INPUT_OVERLAP_CHECKED_IPA_ANNOTATION_PENDING"
            and all(case.get("ipaGold") is None for case in cases)
            and all(case.get("reviewerA", {}).get("ipa") is None for case in cases)
            and all(case.get("reviewerB", {}).get("ipa") is None for case in cases)
            and all(row.get("ipa_gold_status") == "not_available" for row in rows)
            and all(row.get("ukrainian_gold_status") == "not_available" for row in rows)
            and all(row.get("source_manifest_status") == "original_manifest_blob_recovered" for row in rows)
        ) else "FAIL",
        "manifest_path": str(MANIFEST.relative_to(ROOT)),
        "fixture_path": str(FIXTURE.relative_to(ROOT)),
        "original_blob_sha1": git_blob_sha1,
        "expected_original_blob_sha1": EXPECTED_GIT_BLOB_SHA1,
        "sha256": sha256,
        "manifest_status": manifest.get("status"),
        "manifest_case_count": manifest.get("caseCount"),
        "fixture_row_count": len(rows),
        "unique_original_forms": len(set(original_forms)),
        "same_membership_and_order": original_forms == fixture_forms,
        "case_ids_match": original_ids == fixture_original_ids,
        "ipa_gold_absent": all(case.get("ipaGold") is None for case in cases),
        "ukrainian_gold_absent": all(row.get("ukrainian_gold_status") == "not_available" for row in rows),
        "cases": [
            {"case_id": case.get("caseId"), "form": case.get("input"),
             "source_rule": case.get("sourceRule"), "source_locator": case.get("sourceLocator"),
             "source_excerpt": case.get("sourceExcerpt")}
            for case in cases
        ],
        "limitations": [
            "A recovered immutable Git blob and exact ordered match verify fixture membership and content identity.",
            "The original blob's historical commit/tree/PR reference has not yet been recovered.",
            "The manifest contains official Hangul surface readings, not independently adjudicated IPA gold.",
            "Ukrainian practical-transcription gold is still unavailable."
        ],
    }
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = audit()
    text = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")
    return 0 if report["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
