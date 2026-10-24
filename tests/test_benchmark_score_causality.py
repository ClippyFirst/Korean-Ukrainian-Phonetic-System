from __future__ import annotations

import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

from analyze_korean_benchmark_correlations import summarize_report  # noqa: E402


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
            "ipa": "x" if native_exact else "y",
        },
        "g2pk_0_9_4": {
            "status": "scored",
            "exact": g2pk_exact,
            "distance": g2pk_distance,
            "ipa": "x" if g2pk_exact else "y",
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
    assert strata["hangul_length"]["1-2 Hangul blocks"]["paired_scored_occurrences"] == 2
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
