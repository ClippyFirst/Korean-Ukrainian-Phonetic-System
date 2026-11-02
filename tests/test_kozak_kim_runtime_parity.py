from __future__ import annotations

import importlib.util
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "audit_kozak_kim_runtime_parity",
    ROOT / "scripts/audit_kozak_kim_runtime_parity.py",
)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


def _native(occurrence_id, row, token, gold, ipa, surface, distance, broad):
    return {
        "occurrence_id": str(occurrence_id), "row_id": row, "token": token, "gold": gold,
        "status": "scored" if ipa is not None else "abstained", "ipa": ipa,
        "surface_hangul": surface, "distance": distance,
        "exact": distance == 0 if distance is not None else None, "reference_length": len(gold),
        "broad_candidate": None if ipa is None else {
            "predicted": broad, "distance": 0 if broad == "ka" else 1,
            "exact": broad == "ka", "reference_length": 2,
            "prediction_feature_loss_counts": {"fricative_aspiration": 1},
        },
    }


def _browser(occurrence_id, row, token, gold, ipa, surface, distance, broad):
    return {
        "occurrence_id": str(occurrence_id), "id": row, "token": token, "gold": gold,
        "pronunciation_status": "resolved" if ipa is not None else "unresolved",
        "predicted": ipa, "surface_hangul": surface or token, "distance": distance,
        "exact": distance == 0 if distance is not None else None,
        "closest_normalized_gold": gold, "broad_candidate_predicted": broad,
        "broad_candidate_distance": 0 if broad == "ka" else 1,
        "broad_candidate_exact": broad == "ka", "broad_candidate_gold": "ka",
        "broad_candidate_prediction_feature_loss_counts": {"fricative_aspiration": 1},
    }


def _reports():
    native_records = [
        _native(0, "r1", "가", "ka", "ka", "가", 0, "ka"),
        _native(1, "r2", "사", "ka", "sa", "사", 1, "sa"),
        _native(2, "r3", "아", "ka", None, "아", None, None),
    ]
    browser_records = [
        _browser(0, "r1", "가", "ka", "ka", "", 0, "ka"),
        _browser(1, "r2", "사", "ka", "ɕa", "", 1, "ɕa"),
        _browser(2, "r3", "아", "ka", "ka", "", 0, "ka"),
    ]
    native_report = {
        "occurrence_ledger_schema_version": 2,
        "broad_candidate_benchmark": "broad-candidate-ipa-v2",
        "broad_candidate_benchmark_version": 2,
        "benchmark": "UGTPHON Korean test split",
        "dataset_rows": 3,
        "dataset_source": "pinned",
        "native_ipa_profile": {"ipa_profile": "native-broad-v1", "ipa_profile_version": 1},
        "broad_candidate_profile": {"profile_id": "broad-v1", "profile_version": 1, "status": "research-only"},
        "per_engine_occurrences": {"clippyfirst_native": native_records},
    }
    browser_report = {
        "benchmark": "UGTPHON Korean canonical-token diagnostic",
        "broad_candidate_benchmark": "broad-candidate-ipa-v2",
        "broad_candidate_benchmark_version": 2,
        "eligible_tokens": 3,
        "ipa_profile": "browser-legacy-v1",
        "ipa_profile_version": 1,
        "ipa_profile_status": "unadjudicated",
        "broad_candidate_profile": {"profile_id": "broad-v1", "profile_version": 1, "status": "research-only"},
        "records": browser_records,
    }
    return native_report, browser_report


def test_runtime_audit_pairs_occurrences_and_separates_surface_from_ipa():
    native, browser = _reports()
    report = MODULE.compare_reports(native, browser)
    assert report["occurrence_identity"]["matched_occurrences"] == 3
    assert report["ipa_profiles"]["parity_status"] == "DIFFERENT_PROFILE_CONTRACTS"
    assert report["coverage"]["both_scored"] == 2
    assert report["coverage"]["browser_only_scored"] == 1
    assert report["surface_parity"]["equal"] == 3
    assert report["ipa_parity"]["different_raw_ipa"] == 1
    assert report["ipa_parity"]["different_ipa_cases_only_s_vs_ɕ"] == 1
    assert report["paired_gold_diagnostic"]["broad_candidate"]["paired_scored_occurrences"] == 2


def test_runtime_audit_reports_true_parity_only_under_matching_profile_contract():
    native, browser = _reports()
    profile = {
        "ipa_profile": "clippyfirst-korean-broad-v1",
        "ipa_profile_version": 1,
        "ipa_profile_level": "broad",
        "ipa_profile_status": "unadjudicated-cross-runtime",
    }
    native["native_ipa_profile"] = dict(profile)
    browser["ipa_profile"] = profile["ipa_profile"]
    browser["ipa_profile_version"] = profile["ipa_profile_version"]
    browser["ipa_profile_level"] = profile["ipa_profile_level"]
    browser["ipa_profile_status"] = profile["ipa_profile_status"]

    native_second = native["per_engine_occurrences"]["clippyfirst_native"][1]
    browser_second = browser["records"][1]
    browser_second["predicted"] = native_second["ipa"]
    browser_second["distance"] = native_second["distance"]
    browser_second["exact"] = native_second["exact"]
    browser_second["broad_candidate_predicted"] = native_second["broad_candidate"]["predicted"]
    browser_second["broad_candidate_distance"] = native_second["broad_candidate"]["distance"]
    browser_second["broad_candidate_exact"] = native_second["broad_candidate"]["exact"]

    report = MODULE.compare_reports(native, browser)
    assert report["ipa_profiles"]["same_profile_contract"] is True
    assert report["ipa_profiles"]["parity_status"] == "SAME_PROFILE_CONTRACT"
    assert report["ipa_parity"]["raw_ipa_exact_rate"] == 1.0
    assert report["ipa_parity"]["broad_ipa_exact_rate"] == 1.0
    assert report["surface_parity"]["exact_rate"] == 1.0


def test_runtime_audit_fails_closed_on_occurrence_identity_drift():
    native, browser = _reports()
    browser["records"][1]["id"] = "wrong-row"
    with pytest.raises(ValueError, match="identity mismatch"):
        MODULE.compare_reports(native, browser)


def test_runtime_audit_requires_shared_broad_profile():
    native, browser = _reports()
    browser["broad_candidate_profile"]["profile_id"] = "different-profile"
    with pytest.raises(ValueError, match="same broad-candidate profile"):
        MODULE.compare_reports(native, browser)
