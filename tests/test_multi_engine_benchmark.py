from __future__ import annotations

import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

from benchmark_multi_engine_ko import (  # noqa: E402
    _bootstrap_ci,
    _broad_candidate_metrics,
    _native_competitor_error_analysis,
    _build_per_engine_occurrences,
    _g2pk_surface_to_ipa,
    _g2p_ko_result_to_ipa,
    _compose_kog2padvanced_surface,
    _load_hama_batch,
    _load_kog2padvanced_batch,
    _load_kokorog2p,
    _load_rows_and_words,
    _metrics,
    _paired_bootstrap_delta_ci,
    _score,
    normalize_ipa_broad_candidate,
    normalize_ipa_broad_candidate_with_loss,
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


def test_broad_candidate_normalizer_uses_shared_profile_and_reports_feature_losses():
    value = "ˈsʰɭɲɦçxɣɸβʝʷ̠ːt̚k͈"
    normalized, losses = normalize_ipa_broad_candidate_with_loss(value)
    assert normalized == "slnhhhhhhhːt̚k͈"
    assert losses["feature_loss_counts"] == {
        "fricative_aspiration": 1,
        "h_labialization": 1,
        "h_place": 2,
        "h_place_and_manner": 2,
        "h_place_and_voicing": 1,
        "h_place_voicing_and_manner": 1,
        "h_voicing": 1,
        "lateral_retroflexion": 1,
        "nasal_palatalization": 1,
        "selected_segmental_quality_diacritics": 1,
    }
    assert normalize_ipa_broad_candidate("s͈i") == "s͈i"
    assert normalize_ipa_broad_candidate("ɕʰi") == "ɕi"
    assert normalize_ipa_broad_candidate("pʰtʰkʰk͈aːt̚") == "pʰtʰkʰk͈aːt̚"


def test_scoring_keeps_strict_and_broad_candidate_metrics_separate():
    scored = _score("ˈsʰa̠ːk͈ʌn", "sʰa̠ːk͈ʌn")
    assert scored["exact"] is False
    assert scored["broad_candidate"]["exact"] is True
    assert scored["broad_candidate"]["predicted"] == "saːk͈ʌn"
    assert scored["broad_candidate"]["reference_length"] == len("saːk͈ʌn")


def test_native_competitor_error_analysis_finds_losses_to_both_baselines():
    def item(key, distance, broad_distance):
        return {
            "occurrence_id": key, "row_id": "row-" + key, "token": "가" + key,
            "gold": "ka", "predicted": "prediction-" + key,
            "distance": distance, "exact": distance == 0, "reference_length": 2,
            "broad_candidate": {
                "distance": broad_distance, "exact": broad_distance == 0,
                "reference_length": 2,
            },
        }

    scored = {
        "clippyfirst_native": [item("1", 2, 2), item("2", 1, 1), item("3", 2, 2)],
        "g2pk_0_9_4": [item("1", 0, 0), item("2", 2, 2), item("3", 0, 0)],
        "g2p_ko_1_0_0": [item("1", 1, 0), item("2", 0, 0), item("3", 0, 0)],
    }
    report = _native_competitor_error_analysis(scored)
    assert report["three_way_common_scored_occurrences"] == 3
    assert report["native_loses_to_both"]["strict_native_not_exact_both_competitors_exact"]["count"] == 1
    assert report["native_loses_to_both"]["strict_native_distance_worse_than_both"]["count"] == 2
    assert report["native_loses_to_both"]["broad_native_not_exact_both_competitors_exact"]["count"] == 1
    assert report["native_loses_to_both"]["broad_native_distance_worse_than_both"]["count"] == 2
    assert report["comparisons"]["g2pk_0_9_4"]["strict"]["paired_scored_occurrences"] == 3
    assert report["comparisons"]["g2p_ko_1_0_0"]["broad_candidate"]["paired_scored_occurrences"] == 3


def test_broad_candidate_metrics_use_their_own_denominator_and_loss_counts():
    items = [
        {"broad_candidate": {"exact": True, "distance": 0, "reference_length": 2,
                             "prediction_feature_loss_counts": {"stress": 1}}},
        {"broad_candidate": {"exact": False, "distance": 1, "reference_length": 2,
                             "prediction_feature_loss_counts": {"h_place": 2}}},
    ]
    metrics = _broad_candidate_metrics(items)
    assert metrics["scored_tokens"] == 2
    assert metrics["exact_matches"] == 1
    assert metrics["exact_match_rate"] == 0.5
    assert metrics["character_error_rate"] == 0.25
    assert metrics["prediction_feature_loss_counts"] == {"h_place": 2, "stress": 1}


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
    assert first["paired_occurrences"] == 2
    assert first["candidate_only_occurrences"] == 0
    assert first["native_only_occurrences"] == 0
    assert first["paired_rows"] == 2
    assert first["exact_rate_delta_candidate_minus_native_95pct_ci"] is not None
    assert first["cer_delta_candidate_minus_native_95pct_ci"] is not None



def test_g2pk_surface_adapter_is_importable_and_does_not_reapply_rules():
    assert _g2pk_surface_to_ipa(lambda _word: "물까", "물가") == "mul.k͈a"
    try:
        _g2pk_surface_to_ipa(lambda _word: "not-hangul", "물가")
    except ValueError as exc:
        assert "not a single Hangul surface form" in str(exc)
    else:
        raise AssertionError("non-Hangul surface output must be rejected")

def test_g2p_ko_surface_adapter_maps_complete_result_to_ipa():
    from types import SimpleNamespace

    result = SimpleNamespace(complete=True, surface_pronunciation="물까")
    assert _g2p_ko_result_to_ipa(result, "물가") == "mul.k͈a"


def test_g2p_ko_surface_adapter_fails_closed_on_incomplete_or_non_hangul_result():
    from types import SimpleNamespace

    try:
        _g2p_ko_result_to_ipa(
            SimpleNamespace(complete=False, surface_pronunciation="물까"), "물가"
        )
    except ValueError as exc:
        assert "did not complete" in str(exc)
    else:
        raise AssertionError("incomplete g2p-ko result must not be scored")

    try:
        _g2p_ko_result_to_ipa(
            SimpleNamespace(complete=True, surface_pronunciation="not-hangul"), "물가"
        )
    except ValueError as exc:
        assert "non-Hangul surface form" in str(exc)
    else:
        raise AssertionError("non-Hangul surface output must be rejected")


def test_paired_bootstrap_rejects_duplicate_occurrence_ids():
    duplicate = [
        {"occurrence_id": "same", "row_id": "a", "exact": True, "distance": 0, "reference_length": 2},
        {"occurrence_id": "same", "row_id": "b", "exact": False, "distance": 1, "reference_length": 2},
    ]
    try:
        _paired_bootstrap_delta_ci(duplicate, duplicate, replicates=10)
    except ValueError as exc:
        assert "duplicate occurrence_id" in str(exc)
    else:
        raise AssertionError("duplicate occurrence IDs must not be silently collapsed")


def test_paired_bootstrap_rejects_occurrence_row_mismatch():
    candidate = [
        {"occurrence_id": "same", "row_id": "row-a", "exact": True, "distance": 0, "reference_length": 2},
        {"occurrence_id": "other", "row_id": "row-b", "exact": False, "distance": 1, "reference_length": 2},
    ]
    native = [
        {"occurrence_id": "same", "row_id": "wrong-row", "exact": False, "distance": 1, "reference_length": 2},
        {"occurrence_id": "other", "row_id": "row-b", "exact": False, "distance": 2, "reference_length": 2},
    ]
    try:
        _paired_bootstrap_delta_ci(candidate, native, replicates=10)
    except ValueError as exc:
        assert "row_id mismatch" in str(exc)
    else:
        raise AssertionError("paired occurrences must belong to the same source row")


def test_paired_bootstrap_labels_interval_direction_without_overclaiming_significance():
    candidate = [
        {"occurrence_id": "1", "row_id": "a", "exact": True, "distance": 0, "reference_length": 3},
        {"occurrence_id": "2", "row_id": "b", "exact": True, "distance": 0, "reference_length": 3},
    ]
    native = [
        {"occurrence_id": "1", "row_id": "a", "exact": False, "distance": 1, "reference_length": 3},
        {"occurrence_id": "2", "row_id": "b", "exact": False, "distance": 1, "reference_length": 3},
    ]
    result = _paired_bootstrap_delta_ci(candidate, native, replicates=100)
    assert result["exact_delta_interval_direction"] == "POSITIVE_INTERVAL"
    assert result["cer_delta_interval_direction"] == "NEGATIVE_INTERVAL"
    assert "independent gold validation" in result["interpretation"]



def test_kokorog2p_uses_direct_ipa_and_disables_lexicon(monkeypatch):
    import types

    captured = {}

    class FakeKoreanG2P:
        def __init__(self, **kwargs):
            captured.update(kwargs)

        def lookup(self, word):
            return "kʰa"

    package = types.ModuleType("kokorog2p")
    ko_package = types.ModuleType("kokorog2p.ko")
    g2p_module = types.ModuleType("kokorog2p.ko.g2p")
    g2p_module.KoreanG2P = FakeKoreanG2P
    monkeypatch.setitem(sys.modules, "kokorog2p", package)
    monkeypatch.setitem(sys.modules, "kokorog2p.ko", ko_package)
    monkeypatch.setitem(sys.modules, "kokorog2p.ko.g2p", g2p_module)

    fn, adapter = _load_kokorog2p()
    assert fn("카") == "kʰa"
    assert captured["output"] == "ipa"
    assert captured["lexicons"] == ()
    assert captured["morphology"] == "off"
    assert captured["use_dict"] is False
    assert "kokorog2p==0.9.15" in adapter



def test_kog2padvanced_loader_fails_closed_for_incomplete_external_checkout(tmp_path):
    try:
        _load_kog2padvanced_batch(tmp_path, ["학교"])
    except FileNotFoundError as exc:
        assert "checkout incomplete" in str(exc)
    else:
        raise AssertionError("incomplete KoG2Padvanced checkout must not be scored")



def test_hama_adapter_uses_documented_batch_ipa_field(monkeypatch):
    import types

    class FakeResult:
        ipa = "tɕʰa kʰa"

    class FakeModel:
        def predict(self, text, **kwargs):
            assert text == "차 카"
            assert kwargs["split_delimiter"] == r"\s+"
            assert kwargs["output_delimiter"] == " "
            return FakeResult()

    hama_module = types.ModuleType("hama")
    hama_module.G2PModel = FakeModel
    monkeypatch.setitem(sys.modules, "hama", hama_module)

    run_batch, adapter = _load_hama_batch(["차", "카"])
    result = run_batch()
    assert result == {"차": {"ipa": "tɕʰa"}, "카": {"ipa": "kʰa"}}
    assert "sentence-level batch" in adapter



def test_kog2padvanced_adapter_composes_isolated_compatibility_vowel():
    def fake_join_jamos(value):
        return value.replace("ㅇㅣ", "이")

    assert _compose_kog2padvanced_surface("유ㅣ칸", fake_join_jamos) == "유이칸"


def test_occurrence_ledger_preserves_repeated_tokens_and_explicit_non_scored_states():
    items = [
        {"occurrence_id": "0", "row_id": "r1", "word": "학교", "gold": "hak.kjo"},
        {"occurrence_id": "1", "row_id": "r2", "word": "학교", "gold": "hak.kjo"},
        {"occurrence_id": "2", "row_id": "r3", "word": "물가", "gold": "mul.ka"},
    ]
    scored = {
        "clippyfirst_native": [
            {"occurrence_id": "0", "row_id": "r1", "token": "학교", "gold": "hak.kjo",
             "predicted": "hak.kjo", "normalized_predicted": "hak.kjo", "exact": True,
             "distance": 0, "reference_length": 6},
        ],
        "g2pk_0_9_4": [
            {"occurrence_id": "0", "row_id": "r1", "token": "학교", "gold": "hak.kjo",
             "predicted": "hak.kjo", "normalized_predicted": "hak.kjo", "exact": True,
             "distance": 0, "reference_length": 6},
            {"occurrence_id": "1", "row_id": "r2", "token": "학교", "gold": "hak.kjo",
             "predicted": "hak.kjo", "normalized_predicted": "hak.kjo", "exact": True,
             "distance": 0, "reference_length": 6},
        ],
    }
    ledgers = _build_per_engine_occurrences(
        items, scored,
        {"g2pk_0_9_4": {"학교": {"ipa": "hak.kjo"}, "물가": {"error": "adapter failed"}}},
        {"학교": {"unresolved": False}, "물가": {"unresolved": True, "reason": "R002"}},
    )
    assert [x["occurrence_id"] for x in ledgers["clippyfirst_native"]] == ["0", "1", "2"]
    assert ledgers["clippyfirst_native"][1]["status"] == "missing"
    assert ledgers["clippyfirst_native"][2]["status"] == "abstained"
    assert ledgers["clippyfirst_native"][2]["reason"] == "R002"
    assert ledgers["g2pk_0_9_4"][2]["status"] == "error"
    assert ledgers["g2pk_0_9_4"][2]["reason"] == "adapter failed"
    assert ledgers["g2pk_0_9_4"][1]["row_id"] == "r2"
