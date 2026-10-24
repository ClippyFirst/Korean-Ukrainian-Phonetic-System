from __future__ import annotations

import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

from analyze_korean_benchmark_correlations import (  # noqa: E402
    BROAD_PROFILE,
    LEGACY_PROFILE,
    _symbol_error_profile,
    normalize_ipa_profile,
    summarize_report,
)


def _occurrence(row_id, token, gold, native_status, native_exact, native_distance, g2pk_exact, g2pk_distance):
    return {
        "row_id": row_id,
        "token": token,
        "gold": gold,
        "category": "both_exact" if native_exact and g2pk_exact else "both_not_exact",
        "native": {
            "status": native_status,
            "exact": native_exact,
            "distance": native_distance,
            "ipa": gold if native_exact else "y",
        },
        "g2pk_0_9_4": {
            "status": "scored",
            "exact": g2pk_exact,
            "distance": g2pk_distance,
            "ipa": gold if g2pk_exact else "y",
        },
    }


def _report():
    rows = [
        _occurrence("multilexnorm2026_1", "가", "ka", "scored", True, 0, True, 0),
        _occurrence("dc_inside_2", "나", "na", "scored", False, 1, True, 0),
        _occurrence("dc_inside_3", "학교", "hak.kjo", "scored", False, 1, False, 1),
        _occurrence("dc_inside_4", "긴단어", "kin.ta.nʌ", "unresolved", False, 0, False, 2),
    ]
    return {
        "benchmark_version": "fixture",
        "dataset_rows": 3,
        "eligible_token_occurrences": 4,
        "unique_hangul_words": 4,
        "normalization": {"rules": "fixture"},
        "native_g2pk_pairwise_audit": {"occurrences": rows},
    }


def test_summary_counts_pairs_abstentions_and_exact_wins():
    result = summarize_report(_report(), type_bootstrap_replicates=100)
    assert result["occurrence_level"]["total_occurrences"] == 4
    assert result["occurrence_level"]["paired_scored_occurrences"] == 3
    assert result["occurrence_level"]["native_exact"] == 1
    assert result["occurrence_level"]["g2pk_exact"] == 2
    assert result["occurrence_level"]["g2pk_exact_wins"] == 1
    assert result["occurrence_level"]["native_exact_wins"] == 0
    assert result["occurrence_level"]["exact_ties"] == 2
    assert result["occurrence_level"]["type_cluster_bootstrap_delta_ci"]["replicates"] == 100


def test_summary_stratifies_source_length_frequency_and_ipa_length():
    result = summarize_report(_report(), type_bootstrap_replicates=100)
    strata = result["strata"]
    assert strata["source"]["MultiLexNorm++"]["paired_scored_occurrences"] == 1
    assert strata["source"]["DC Inside"]["native_abstentions"] == 1
    assert strata["hangul_length"]["1-2 Hangul blocks"]["paired_scored_occurrences"] == 3
    assert strata["test_set_frequency"]["1 occurrence in test"]["occurrences_in_stratum"] == 4
    assert strata["normalized_ipa_reference_length"]["<=5 normalized IPA characters"]["occurrences_in_stratum"] == 2


def test_type_macro_and_edit_distance_histograms_are_reproducible():
    first = summarize_report(_report(), type_bootstrap_replicates=100)
    second = summarize_report(_report(), type_bootstrap_replicates=100)
    assert first == second
    assert first["lexical_type_macro"]["unique_types"] == 3
    assert first["edit_distance"]["native"]["one_edit_share_of_nonexact"] == 1.0


def test_summary_fails_closed_on_malformed_pairwise_rows():
    report = _report()
    report["native_g2pk_pairwise_audit"]["occurrences"][0].pop("gold")
    try:
        summarize_report(report, type_bootstrap_replicates=100)
    except ValueError as exc:
        assert "lacks required fields" in str(exc)
    else:
        raise AssertionError("malformed occurrence rows must be rejected")


def test_symbol_profile_detects_reference_only_narrow_mark():
    row = _occurrence("dc_inside_9", "수", "sʰu", "scored", False, 1, False, 1)
    row["native"]["ipa"] = "su"
    profile = _symbol_error_profile([row], "native")
    assert profile["nonexact_occurrences_aligned"] == 1
    assert profile["top_reference_only_symbols"] == [{"symbol": "ʰ", "count": 1}]
    assert profile["top_substitutions"] == []



def test_versioned_broad_profile_collapses_only_declared_allophone_candidates():
    assert normalize_ipa_profile("ɭ ʎ ɲ ɦ ç ɕʰ", BROAD_PROFILE) == "llnhhs"
    assert normalize_ipa_profile("kʰ tɕʰ k͈ aː k̚", BROAD_PROFILE) == "kʰtɕʰk͈aːk̚"
    assert normalize_ipa_profile("ɭ", LEGACY_PROFILE) == "ɭ"
    assert normalize_ipa_profile("ɭ", BROAD_PROFILE) == "l"


def test_summary_reports_legacy_and_broad_profile_sensitivity_separately():
    result = summarize_report(_report(), type_bootstrap_replicates=100)
    profiles = result["profile_sensitivity"]
    assert set(profiles) == {LEGACY_PROFILE, BROAD_PROFILE}
    assert profiles[LEGACY_PROFILE]["native"]["eligible_occurrences"] == 3
    assert profiles[BROAD_PROFILE]["native"]["status"] == "SENSITIVITY_ONLY_UNTIL_INDEPENDENT_IPA_REVIEW"
    assert profiles[LEGACY_PROFILE]["native"]["exact_matches"] == 1



def test_broad_profile_can_separate_symbol_convention_from_raw_exact_match():
    row = _occurrence("dc_inside_10", "낱말", "ɭa", "scored", False, 1, False, 1)
    row["native"]["ipa"] = "la"
    row["g2pk_0_9_4"]["ipa"] = "la"
    legacy = normalize_ipa_profile(row["gold"], LEGACY_PROFILE)
    broad = normalize_ipa_profile(row["gold"], BROAD_PROFILE)
    assert legacy != normalize_ipa_profile(row["native"]["ipa"], LEGACY_PROFILE)
    assert broad == normalize_ipa_profile(row["native"]["ipa"], BROAD_PROFILE)



def test_symbol_profile_uses_selected_ipa_comparison_profile():
    row = _occurrence("dc_inside_11", "꽃", "ɭa", "scored", False, 1, False, 1)
    row["native"]["ipa"] = "la"
    legacy = _symbol_error_profile([row], "native", profile=LEGACY_PROFILE)
    broad = _symbol_error_profile([row], "native", profile=BROAD_PROFILE)
    assert legacy["nonexact_occurrences_aligned"] == 1
    assert broad["nonexact_occurrences_aligned"] == 0
