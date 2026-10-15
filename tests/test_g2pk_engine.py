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


def test_nikl_surface_override_corrects_an_unlicensed_external_mismatch(monkeypatch):
    class IncorrectG2p:
        def __call__(self, text, descriptive=False):
            return text

    monkeypatch.setattr(g2pk_engine, "_ENGINE", IncorrectG2p())
    result = g2pk_engine.phoneticize_with_g2pk("넋이")

    assert result["surface_hangul"] == "넉씨"
    assert any(
        rule["name"] == "sourced-lexical-surface-override"
        and rule["source"]
        for rule in result["rules"]
    )
    assert result["ipa"]["ipa"] == "nʌk̚.ɕ͈i"


def test_g2pk_descriptive_mode_is_explicit_and_passed_through(monkeypatch):
    monkeypatch.setattr(g2pk_engine, "_ENGINE", FakeG2p())
    assert g2pk_engine.pronounce_surface("나의 친구", descriptive=True) == "나에 친구"


def test_g2pk_mode_fails_closed_when_optional_dependency_is_missing(monkeypatch):
    monkeypatch.setattr(g2pk_engine, "_ENGINE", None)
    monkeypatch.setitem(sys.modules, "g2pk", None)
    with pytest.raises(RuntimeError, match="optional.*Install it"):
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


def test_g2pk_live_engine_smoke_and_normative_controls():
    pytest.importorskip("g2pk")
    expected = {
        "학교": "학꾜",
        "넋이": "넉씨",
        "값어치": "가버치",
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
