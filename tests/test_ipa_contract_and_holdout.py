from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from validate_ipa_holdout import load_manifest, validate  # noqa: E402


def test_holdout_is_source_backed_frozen_and_contains_no_ipa_gold():
    path = ROOT / "data/korean/ipa_holdout_2026-10-24.json"
    manifest = load_manifest(path)
    assert manifest["caseCount"] == 24
    assert len(manifest["cases"]) == 24
    assert all(case["ipaGold"] is None for case in manifest["cases"])
    assert all(case["engineOutputsStored"] is False for case in manifest["cases"])
    assert all(case["tuningUseProhibited"] is True for case in manifest["cases"])
    assert {case["sourceRule"] for case in manifest["cases"]} == {"§5", "§9"}


def test_holdout_validation_discloses_external_overlap_blocker():
    path = ROOT / "data/korean/ipa_holdout_2026-10-24.json"
    result = validate(ROOT, path, None)
    assert result["case_count"] == 24
    assert result["ipa_gold_count"] == 0
    assert result["local_runtime_or_fixture_overlap_count"] == 0
    assert result["excluded_source_only_fixtures"] == ["tests/fixtures/nikl-article-review-1-30.json"]
    assert result["external_benchmark_overlap_check"] == "NOT_CHECKED"
    assert result["holdout_certification"] == "FROZEN_INPUTS_EXTERNAL_OVERLAP_CHECK_PENDING"


def test_holdout_validator_detects_external_benchmark_overlap(tmp_path):
    root = tmp_path / "repo"
    (root / "data/korean").mkdir(parents=True)
    (root / "tests/fixtures").mkdir(parents=True)
    source_manifest = ROOT / "data/korean/ipa_holdout_2026-10-24.json"
    target_manifest = root / "data/korean/ipa_holdout_2026-10-24.json"
    target_manifest.write_text(source_manifest.read_text(encoding="utf-8"), encoding="utf-8")
    benchmark = tmp_path / "benchmark.json"
    benchmark.write_text(json.dumps({
        "native_g2pk_pairwise_audit": {
            "occurrences": [{"token": "주의"}]
        }
    }, ensure_ascii=False), encoding="utf-8")
    result = validate(root, target_manifest, benchmark)
    assert result["external_benchmark_overlap_check"] == "CHECKED"
    assert result["external_benchmark_overlap_count"] == 1
    assert result["holdout_certification"] == "BLOCKED_OVERLAP_FOUND"


def test_holdout_validator_rejects_populated_ipa_gold(tmp_path):
    path = ROOT / "data/korean/ipa_holdout_2026-10-24.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    data["cases"][0]["ipaGold"] = "ɯi"
    bad = tmp_path / "bad.json"
    bad.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    try:
        load_manifest(bad)
    except ValueError as exc:
        assert "IPA gold must remain unfilled" in str(exc)
    else:
        raise AssertionError("holdout must reject unadjudicated IPA gold")



def test_symbol_discrepancy_ledger_never_promotes_alignment_to_gold():
    ledger_path = ROOT / "research/ipa-discrepancy-adjudication-2026-10-24.json"
    ledger = json.loads(ledger_path.read_text(encoding="utf-8"))
    assert len(ledger["symbolClasses"]) == 8
    assert all(item["reviewStatus"] in {"NOT_INDEPENDENTLY_ADJUDICATED", "NO_NORMALIZATION_APPLIED"} for item in ledger["symbolClasses"])
    assert ledger["summary"]["independentlyAdjudicatedIpaGold"] == 0
    assert len(ledger["selectedR002R003Cases"]) == 14
    assert all(case["ipaGold"] is None for case in ledger["selectedR002R003Cases"])
    assert sum(case["surfaceEvidence"].startswith("EXACT_FORM_SOURCE") for case in ledger["selectedR002R003Cases"]) == 3



def test_holdout_overlap_record_is_bound_to_exact_manifest_blob():
    manifest_path = ROOT / "data/korean/ipa_holdout_2026-10-24.json"
    record_path = ROOT / "research/ipa-holdout-overlap-validation-2026-10-24.json"
    record = json.loads(record_path.read_text(encoding="utf-8"))
    raw = manifest_path.read_bytes()
    git_blob_sha = hashlib.sha1(b"blob " + str(len(raw)).encode("ascii") + b"\0" + raw).hexdigest()
    assert git_blob_sha == record["holdout"]["manifestGitBlobSha"]
    assert record["externalExactTokenOverlap"]["overlapCount"] == 0
    assert record["externalExactTokenOverlap"]["result"] == "PASS_NO_EXACT_TOKEN_OVERLAP"
    assert record["ipaAnnotation"]["goldCount"] == 0
