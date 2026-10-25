from __future__ import annotations

import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

from benchmark_multi_engine_ko import (  # noqa: E402
    _bootstrap_ci,
    _classify_native_discrepancy,
    _g2pk_surface_to_ipa,
    _load_rows_and_words,
    _metrics,
    _normalize_broad_fricative_aspiration,
    _normalize_ignore_aspiration,
    _normalize_ignore_length,
    _normalize_ignore_stress,
    _profile_change_audit,
    _paired_bootstrap_delta_ci,
    _score,
    kog2p_phones_to_ipa,
)


def test_kog2p_documented_phone_labels_map_to_ipa():
    assert kog2p_phones_to_ipa("p0 aa ng mm uu ll k0 wa nf") == "paŋmulk wan".replace(" ", "")
    assert kog2p_phones_to_ipa("pp aa") == "p͈a"


def test_kog2p_adapter_fails_closed_on_unknown_phone_label():
    try:
        kog2p_phones_to_ipa("mystery")
    except ValueError as exc:
        assert "lack an explicit IPA mapping" in str(exc)
    else:
        raise AssertionError("unknown KoG2P labels must not be silently guessed")


def test_scoring_uses_best_reference_variant_and_reference_length():
    exact = _score("kʰa", "kʰa,ka")
    assert exact["exact"] is True
    assert exact["distance"] == 0
    assert exact["reference_length"] == 3


def test_metrics_report_coverage_denominator_independently():
    items = [
        {"exact": True, "distance": 0, "reference_length": 2},
        {"exact": False, "distance": 1, "reference_length": 2},
    ]
    metrics = _metrics(items)
    assert metrics["scored_tokens"] == 2
    assert metrics["exact_matches"] == 1
    assert metrics["exact_match_rate"] == 0.5
    assert metrics["character_error_rate"] == 0.25


def test_corpus_loader_keeps_repeated_occurrences_for_paired_scoring():
    rows = [{
        "id": "row-1",
        "lang": "ko",
        "split": "test",
        "tokens": [
            {"canonical": "학교", "phoneme": "hak.kjo"},
            {"canonical": "학교", "phoneme": "hak.kjo"},
        ],
    }]
    items, words = _load_rows_and_words(rows)
    assert len(items) == 2
    assert items[0]["occurrence_id"] != items[1]["occurrence_id"]
    assert words == ["학교"]


def test_bootstrap_is_deterministic_and_reports_interval_contract():
    items = [
        {"row_id": "a", "exact": True, "distance": 0, "reference_length": 2},
        {"row_id": "b", "exact": False, "distance": 1, "reference_length": 2},
    ]
    first = _bootstrap_ci(items, replicates=100)
    second = _bootstrap_ci(items, replicates=100)
    assert first == second
    assert first["replicates"] == 100
    assert first["exact_match_rate_95pct_ci"] is not None


def test_paired_bootstrap_delta_is_deterministic_and_paired():
    candidate = [
        {"occurrence_id": "1", "row_id": "a", "exact": True, "distance": 0, "reference_length": 2},
        {"occurrence_id": "2", "row_id": "b", "exact": False, "distance": 1, "reference_length": 2},
    ]
    native = [
        {"occurrence_id": "1", "row_id": "a", "exact": False, "distance": 1, "reference_length": 2},
        {"occurrence_id": "2", "row_id": "b", "exact": False, "distance": 2, "reference_length": 2},
    ]
    first = _paired_bootstrap_delta_ci(candidate, native, replicates=100)
    second = _paired_bootstrap_delta_ci(candidate, native, replicates=100)
    assert first == second
    assert first["replicates"] == 100
    assert first["exact_rate_delta_candidate_minus_native_95pct_ci"] is not None
    assert first["cer_delta_candidate_minus_native_95pct_ci"] is not None

def test_broad_fricative_aspiration_sensitivity_is_narrowly_scoped():
    assert _normalize_broad_fricative_aspiration("sʰɕʰa̠") == "sɕa"
    assert _normalize_broad_fricative_aspiration("kʰaːt̚") == "kʰaːt̚"
    strict = _score("kasɯm", "ka̠sʰɯm")
    broad = _score(
        "kasɯm", "ka̠sʰɯm",
        normalizer=_normalize_broad_fricative_aspiration,
    )
    assert strict["exact"] is False
    assert broad["exact"] is True
    assert broad["reference_length"] == strict["reference_length"] - 1


def test_discrepancy_classifier_only_assigns_evidence_supported_categories():
    convention = _classify_native_discrepancy("kasɯm", "ka̠sʰɯm", False, True)
    assert convention["category"] == "UNCLASSIFIED"
    assert convention["strict_profile_exact"] is False
    assert convention["broad_fricative_aspiration_exact"] is True
    assert convention["profile_sensitivity_detected"] is True
    assert convention["profile_sensitivity_name"] == "broad_fricative_aspiration"
    assert "gold transcription policy is not independently established" in convention["rationale"]

    unicode_only = _classify_native_discrepancy("ã", "ã", False, False)
    assert unicode_only["category"] == "UNICODE_OR_FORMAT"

    unresolved = _classify_native_discrepancy("kʰa", "ka", False, False)
    assert unresolved["category"] == "UNCLASSIFIED"
    assert "does not distinguish" in unresolved["rationale"]



def test_g2pk_adapter_uses_shared_segment_renderer_without_silent_fallback():
    from korean_ukrainian.phonology import parse_syllables
    from korean_ukrainian.ipa import realize_syllables

    expected = realize_syllables(parse_syllables("한국"), level="broad")["ipa"]
    assert _g2pk_surface_to_ipa(lambda _: "한국", "입력") == expected


def test_g2pk_adapter_rejects_non_hangul_surface():
    try:
        _g2pk_surface_to_ipa(lambda _: "한국!", "한국")
    except ValueError as exc:
        assert "not a single Hangul surface form" in str(exc)
    else:
        raise AssertionError("g2pK adapter must reject unsupported surface strings")


def test_g2pk_adapter_rejects_non_string_surface():
    try:
        _g2pk_surface_to_ipa(lambda _: None, "한국")
    except TypeError as exc:
        assert "g2pk returned NoneType" in str(exc)
    else:
        raise AssertionError("g2pK adapter must reject non-string outputs")




def test_diagnostic_normalization_profiles_are_explicit_and_separate():
    # These are deliberately permissive sensitivity profiles, not canonical scores.
    assert _normalize_ignore_aspiration("kʰa sʰɯm ɕʰi") == "kasɯmɕi"
    assert _normalize_ignore_length("kaː kɯˑ") == "kakɯ"
    assert _normalize_ignore_stress("ˈka ˌsɯm") == "kasɯm"

    # Primary scoring must continue to preserve length and aspiration.
    assert _score("kaː", "ka")["exact"] is False
    assert _score("kʰa", "ka")["exact"] is False
    assert _score("ˈka", "ka")["exact"] is False



def test_profile_change_audit_reports_case_transitions_without_relabeling_gold():
    primary = [
        {"occurrence_id": "a", "token": "값", "gold": "kap", "predicted": "kab",
         "distance": 1, "exact": False},
        {"occurrence_id": "b", "token": "가", "gold": "ka", "predicted": "ka",
         "distance": 0, "exact": True},
        {"occurrence_id": "c", "token": "꽃", "gold": "k͈ot", "predicted": "kot",
         "distance": 1, "exact": False},
    ]
    profile = [
        {"occurrence_id": "a", "token": "값", "gold": "kap", "predicted": "kab",
         "distance": 0, "exact": True},
        {"occurrence_id": "b", "token": "가", "gold": "ka", "predicted": "ka",
         "distance": 0, "exact": True},
        {"occurrence_id": "c", "token": "꽃", "gold": "k͈ot", "predicted": "kot",
         "distance": 1, "exact": False},
    ]
    audit = _profile_change_audit(primary, profile)
    assert audit["paired_occurrences"] == 3
    assert audit["primary_mismatch_became_exact"] == 1
    assert audit["primary_exact_became_mismatch"] == 0
    assert audit["unchanged_exact"] == 1
    assert audit["unchanged_mismatch"] == 1
    assert audit["rescued_case_examples"][0]["occurrence_id"] == "a"
    assert "do not establish" in audit["warning"]
