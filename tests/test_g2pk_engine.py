from __future__ import annotations

import sys

import pytest

from korean_ukrainian import g2pk_engine


class FakeG2p:
    def __call__(self, text, descriptive=False):
        value = text.replace("넋이", "넉씨").replace("굳이", "구지")
        if descriptive:
            value = value.replace("나의", "나에")
        return value


def test_g2pk_adapter_derives_ipa_from_surface_hangul(monkeypatch):
    monkeypatch.setattr(g2pk_engine, "_ENGINE", FakeG2p())
    result = g2pk_engine.phoneticize_with_g2pk("넋이, 굳이!")

    assert result["pronunciation_engine"] == "g2pK"
    assert result["surface_hangul"] == "넉씨, 구지!"
    assert result["ipa"]["ipa"] == "nʌk̚.ɕ͈i ku.dʑi"
    assert result["ipa"]["rendered_text"] == "nʌk̚.ɕ͈i, ku.dʑi!"
    assert result["rules"][0]["status"] == "external-engine-output"
    assert "NIKL" not in result["rules"][0]["source"]


def test_g2pk_adapter_does_not_apply_nikl_surface_or_ipa_overlays(monkeypatch):
    class PassThroughG2p:
        def __call__(self, text, descriptive=False):
            return text

    monkeypatch.setattr(g2pk_engine, "_ENGINE", PassThroughG2p())
    result = g2pk_engine.phoneticize_with_g2pk("넋이")

    assert result["surface_hangul"] == "넋이"
    assert result["ipa"]["lexical_overrides"] == []
    assert result["ipa"]["status"] == "ipa-derived-from-g2pk-surface-form"
    assert [rule["name"] for rule in result["rules"]] == ["external-g2pK-pronunciation"]



def test_g2pk_baseline_does_not_apply_kozak_research_overlay_to_kkeulda(monkeypatch):
    class PassThroughG2p:
        def __call__(self, text, descriptive=False):
            return text

    monkeypatch.setattr(g2pk_engine, "_ENGINE", PassThroughG2p())
    result = g2pk_engine.phoneticize_with_g2pk("끌다")
    assert result["surface_hangul"] == "끌다"
    assert result["ipa"]["ipa"] == "k͈ɯl.da"
    assert result["ipa"]["lexical_overrides"] == []

def test_g2pk_descriptive_mode_is_explicit_and_passed_through(monkeypatch):
    monkeypatch.setattr(g2pk_engine, "_ENGINE", FakeG2p())
    assert g2pk_engine.pronounce_surface("나의 친구", descriptive=True) == "나에 친구"


def test_g2pk_mode_fails_closed_when_optional_dependency_is_missing(monkeypatch):
    monkeypatch.setattr(g2pk_engine, "_ENGINE", None)
    monkeypatch.setitem(sys.modules, "g2pk", None)
    with pytest.raises(RuntimeError, match="optional|not installed"):
        g2pk_engine.pronounce_surface("국밥")


def test_g2pk_mode_rejects_unsupported_ipa_levels(monkeypatch):
    monkeypatch.setattr(g2pk_engine, "_ENGINE", FakeG2p())
    with pytest.raises(ValueError, match="broad surface IPA only"):
        g2pk_engine.phoneticize_with_g2pk("국밥", ipa_level="phonemic")


def test_g2pk_surface_keeps_latin_digits_and_compatibility_jamo_out_of_engine(monkeypatch):
    calls = []

    class RecordingG2p:
        def __call__(self, text, descriptive=False):
            calls.append(text)
            return text.replace("국밥", "국빱")

    monkeypatch.setattr(g2pk_engine, "_ENGINE", RecordingG2p())
    surface = g2pk_engine.pronounce_surface("국밥, API 3.1; ㄴ 첨가")

    assert surface == "국빱, API 3.1; ㄴ 첨가"
    assert all("API" not in call and "3.1" not in call and "ㄴ" not in call for call in calls)


def test_g2pk_handles_adversarial_sentence_with_punctuation_and_protected_material():
    pytest.importorskip("g2pk")
    text = (
        "국립국어원 표준 발음 규정을 확인하던 연구원은 "
        "넋이 나갔다, 몫을 나누다, 값이 올랐다, 값어치가 없다, 숲이 우거졌다. "
        "밟고 밟는 읽습니다 맑게 굳이 신라 칼날 꽃잎 서울역. "
        "API 3.1, ㄴ 첨가."
    )
    result = g2pk_engine.phoneticize_with_g2pk(text)
    assert result["surface_hangul"]
    assert result["ipa"]["ipa"]
    assert "API 3.1" in result["surface_hangul"]
    assert "ㄴ 첨가" in result["surface_hangul"]
    assert result["surface_hangul"] == g2pk_engine.pronounce_surface(text)
    assert result["ipa"]["lexical_overrides"] == []
    assert [rule["name"] for rule in result["rules"]] == ["external-g2pK-pronunciation"]


def test_g2pk_live_engine_smoke_and_normative_controls():
    pytest.importorskip("g2pk")
    expected = {
        "학교": "학꾜",
        "넋이": "넉씨",
        "밟고": "밥꼬",
        "밟는": "밤는",
        "읽습니다": "익씀니다",
        "굳이": "구지",
        "신라": "실라",
        "칼날": "칼랄",
        "꽃잎": "꼰닙",
        "서울역": "서울력",
    }
    for word, surface in expected.items():
        result = g2pk_engine.phoneticize_with_g2pk(word)
        assert result["surface_hangul"] == surface, word
        assert result["ipa"]["ipa"], word
        assert result["pronunciation_engine"] == "g2pK"

def test_g2pk_baseline_does_not_consume_variant_aware_research_lexical_candidates(monkeypatch):
    class PassThroughG2p:
        def __call__(self, text, descriptive=False):
            return text

    monkeypatch.setattr(g2pk_engine, "_ENGINE", PassThroughG2p())
    result = g2pk_engine.phoneticize_with_g2pk("못잃어")
    assert result["surface_hangul"] == "못잃어"
    assert result["ipa"]["lexical_overrides"] == []
    assert not any(rule["name"] == "sourced-lexical-surface-override" for rule in result["rules"])


def test_g2pk_baseline_does_not_consume_variant_aware_research_lexical_candidates(monkeypatch):
    class PassThroughG2p:
        def __call__(self, text, descriptive=False):
            return text

    monkeypatch.setattr(g2pk_engine, "_ENGINE", PassThroughG2p())
    result = g2pk_engine.phoneticize_with_g2pk("못잃어")

    assert result["surface_hangul"] == "못잃어"
    assert result["ipa"]["lexical_overrides"] == []
    assert not any(
        rule["name"] == "sourced-lexical-surface-override"
        for rule in result["rules"]
    )


def test_g2pk_baseline_does_not_consume_kozak_only_research_lexical_candidates(monkeypatch):
    from korean_ukrainian import pipeline

    class PassThroughG2p:
        def __call__(self, text, descriptive=False):
            return text

    monkeypatch.setitem(
        pipeline.LEXICAL_PRONUNCIATIONS,
        "가나다",
        {
            "input": "가나다",
            "surface_hangul": "가나따",
            "ipa_syllables": "x|y|z",
            "source_url": "https://example.invalid/research-only-fixture",
            "rule_notes": "Synthetic isolation fixture; not linguistic evidence.",
            "confidence": "test-only",
            "input_kind": "kozak-research-only",
        },
    )
    monkeypatch.setattr(g2pk_engine, "_ENGINE", PassThroughG2p())
    result = g2pk_engine.phoneticize_with_g2pk("가나다")

    assert result["surface_hangul"] == "가나다"
    assert result["ipa"]["lexical_overrides"] == []

    # A research-only row whose Hangul surface already matches the external
    # engine output must still not inject Kozak's project-derived IPA.
    monkeypatch.setitem(
        pipeline.LEXICAL_PRONUNCIATIONS,
        "바나나",
        {
            "input": "바나나",
            "surface_hangul": "바나나",
            "ipa_syllables": "x|y|z",
            "source_url": "https://example.invalid/research-only-ipa-fixture",
            "rule_notes": "Synthetic isolation fixture; not linguistic evidence.",
            "confidence": "test-only",
            "input_kind": "kozak-research-only",
            "ipa_adjudication_status": "diagnostic_only_unresolved_pronunciation",
        },
    )
    ipa_only_result = g2pk_engine.phoneticize_with_g2pk("바나나")
    assert ipa_only_result["surface_hangul"] == "바나나"
    assert ipa_only_result["ipa"]["lexical_overrides"] == []
    assert ipa_only_result["ipa"]["ipa"] != "x.y.z"
    assert ipa_only_result["ipa"]["status"] != "diagnostic_only_unresolved_pronunciation"
    assert ipa_only_result["ipa"]["word_analyses"][0]["status"] == "derived-from-surface"

def test_g2pk_does_not_import_nikl_lexical_readings_or_unresolved_status(monkeypatch):
    class PassThroughG2p:
        def __call__(self, text, descriptive=False):
            return text

    monkeypatch.setattr(g2pk_engine, "_ENGINE", PassThroughG2p())
    result = g2pk_engine.phoneticize_with_g2pk("삶의")

    assert result["surface_hangul"] == "삶의"
    assert result["ipa"]["is_diagnostic_only"] is False
    assert result["ipa"]["status"] == "ipa-derived-from-g2pk-surface-form"
    assert result["ipa"]["lexical_overrides"] == []
    assert result["ipa"]["word_analyses"][0]["status"] == "derived-from-surface"
