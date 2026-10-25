# The original frozen manifest is recovered by its immutable Git blob SHA.
import csv
import json
from pathlib import Path


def test_target_renderer_holdout_matches_recovered_original_manifest():
    root = Path(__file__).resolve().parents[1]
    fixture_path = root / "data" / "korean" / "benchmarks" / "target-renderer-holdout-24.csv"
    manifest_path = root / "data" / "korean" / "benchmarks" / "ipa-holdout-24-manifest.json"
    with fixture_path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    cases = manifest["cases"]
    assert manifest["caseCount"] == 24
    assert manifest["status"] == "FROZEN_INPUT_OVERLAP_CHECKED_IPA_ANNOTATION_PENDING"
    assert len(rows) == len(cases) == 24
    assert [row["form"] for row in rows] == [case["input"] for case in cases]
    assert [row["original_case_id"] for row in rows] == [case["caseId"] for case in cases]
    assert len({row["form"] for row in rows}) == 24
    assert len({row["holdout_id"] for row in rows}) == 24
    assert all(row["ipa_gold_status"] == "not_available" for row in rows)
    assert all(row["ukrainian_gold_status"] == "not_available" for row in rows)
    assert all(row["source_manifest_status"] == "original_manifest_blob_recovered" for row in rows)
    assert all("f30c5fa8a59753df3d7c06bbbe7d4e43d0b8fb26" in row["provenance_note"] for row in rows)
    assert all(case["ipaGold"] is None for case in cases)
    assert all(case["reviewerA"]["ipa"] is None and case["reviewerB"]["ipa"] is None for case in cases)
    assert all(case["sourceLocator"].startswith("https://www.korean.go.kr/") for case in cases)


def test_recovered_manifest_audit_reports_hash_and_keeps_gold_pending():
    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
    from audit_holdout_manifest_recovery import audit

    report = audit()
    assert report["status"] == "PASS"
    assert report["original_blob_sha1"] == "f30c5fa8a59753df3d7c06bbbe7d4e43d0b8fb26"
    assert len(report["sha256"]) == 64
    assert report["same_membership_and_order"] is True
    assert report["case_ids_match"] is True
    assert report["ipa_gold_absent"] is True
    assert report["ukrainian_gold_absent"] is True
