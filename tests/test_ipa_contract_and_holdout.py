from __future__ import annotations

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
