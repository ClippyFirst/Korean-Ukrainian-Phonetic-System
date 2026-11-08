from __future__ import annotations

import sys
import types
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

import pytest

from scripts.benchmark_mfa_g2p import (
    MFA_KOREAN_V2_PHONES,
    build_report,
    parse_mfa_dictionary_output,
    prepare_model_input,
)


def test_pinned_mfa_v2_korean_inventory_contains_exactly_56_phones():
    assert len(MFA_KOREAN_V2_PHONES) == 56
    assert {"tɕ", "tɕʰ", "tɕ͈", "k̚", "k͈", "ɰ", "ɭ"} <= MFA_KOREAN_V2_PHONES


def test_hangul_model_receives_nfc_precomposed_hangul():
    assert prepare_model_input("한국", "hangul") == "한국"


def test_jamo_model_uses_explicit_hangul_to_jamo_adapter(monkeypatch):
    fake = types.ModuleType("jamo")
    fake.h2j = lambda value: "한국"
    fake.j2hcj = lambda value: "ㅎㅏㄴㄱㅜㄱ"
    monkeypatch.setitem(sys.modules, "jamo", fake)
    assert prepare_model_input("한국", "jamo") == "ㅎㅏㄴㄱㅜㄱ"


def test_model_input_rejects_mixed_or_non_hangul_tokens():
    with pytest.raises(ValueError, match="precomposed Hangul"):
        prepare_model_input("한국abc", "hangul")


def test_mfa_output_parser_preserves_documented_ipa_phone_sequence():
    parsed = parse_mfa_dictionary_output(
        "학교 0.7 h ɐ k̚ k j o\n",
        {"학교"},
    )
    assert parsed["학교"]["ipa"] == "hɐk̚kjo"
    assert parsed["학교"]["mfa_phones"] == ["h", "ɐ", "k̚", "k", "j", "o"]


def test_mfa_output_parser_rejects_phones_without_an_explicit_ipa_mapping():
    with pytest.raises(ValueError, match="unmapped MFA phone"):
        parse_mfa_dictionary_output("학교 h a UNKNOWN\n", {"학교"})


def test_mfa_output_parser_rejects_duplicate_and_unexpected_words():
    with pytest.raises(ValueError, match="duplicate pronunciation"):
        parse_mfa_dictionary_output("학교 h ɐ\n학교 h a\n", {"학교"})
    with pytest.raises(ValueError, match="unexpected output word"):
        parse_mfa_dictionary_output("없는 h ɐ\n", {"학교"})


def test_report_separates_candidate_availability_from_accuracy_coverage():
    rows = [
        {"id": "row-1", "tokens": [
            {"canonical": "학교", "phoneme": "hɐk"},
            {"canonical": "학교", "phoneme": "hɐk"},
        ]},
        {"id": "row-2", "tokens": [
            {"canonical": "물가", "phoneme": "mul"},
        ]},
    ]
    predictions = {"학교": {"ipa": "hɐk", "mfa_phones": ["h", "ɐ", "k"]}}
    report = build_report(
        rows, predictions, model_kind="hangul", model_sha256="a" * 64,
        dataset_source="synthetic regression fixture", runtime={"runtime_ms": 1.0},
    )
    assert report["eligible_occurrences"] == 3
    assert report["candidate_output_occurrences"] == 2
    assert report["candidate_output_availability_rate"] == pytest.approx(2 / 3)
    assert report["source_resolved_scored_occurrences"] == 2
    assert report["coverage_rate"] == pytest.approx(2 / 3)
    assert report["exact_matches"] == 2
    assert report["phoneme_error_rate"] == 0
    assert report["feature_weighted_error_rate"] == 0
    assert report["coverage_adjusted_exact_match_rate"] == pytest.approx(2 / 3)
    assert [item["status"] for item in report["occurrences"]] == ["scored", "scored", "missing"]
    assert report["engine_errors"] == 0
    assert report["inference_policy"]["strict_graphemes"] is True
    assert report["inference_policy"]["num_pronunciations"] == 1
