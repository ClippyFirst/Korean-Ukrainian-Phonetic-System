"""Tests for optional morphology adapters; no third-party runtime is required."""
from types import SimpleNamespace

import pytest

from korean_ukrainian.research_morphology import (
    KiwiMorphologyAnalyzer,
    MecabKoMorphologyAnalyzer,
    analyzer_by_name,
)


class FakeKiwi:
    def tokenize(self, text):
        return [
            SimpleNamespace(form="있", tag="VV", start=0, len=1),
            SimpleNamespace(form="었", tag="EP", start=1, len=1),
            SimpleNamespace(form="고", tag="EC", start=2, len=1),
        ]


def test_kiwi_adapter_returns_structured_offsets_and_never_pronunciation():
    result = KiwiMorphologyAnalyzer(FakeKiwi()).analyze("있었고")
    payload = result.to_dict()
    assert [(m.form, m.tag, m.start, m.end) for m in result.morphemes] == [
        ("있", "VV", 0, 1), ("었", "EP", 1, 2), ("고", "EC", 2, 3)
    ]
    assert payload["contract"] == "morphology_only_no_pronunciation_or_rule_license"
    assert "ipa" not in payload
    assert all(m.confidence == "unscored" for m in result.morphemes)


class FakeNode:
    def __init__(self, surface="", feature="", next_node=None):
        self.surface = surface
        self.feature = feature
        self.next = next_node


class FakeTagger:
    def parseToNode(self, text):
        return FakeNode("", "BOS") if False else FakeNode(
            "있", "VV,*,*,*,*,*,있다,*,*", FakeNode(
                "었", "EP,*,*,*,*,*,*,*,*", FakeNode(
                    "고", "EC,*,*,*,*,*,*,*,*", FakeNode("", "EOS")
                )
            )
        )



class FakeMecabKo:
    def pos(self, text):
        return [("있", "VV"), ("었", "EP"), ("고", "EC")]


def test_mecab_ko_python_pos_api():
    result = MecabKoMorphologyAnalyzer(FakeMecabKo()).analyze("있었고")
    assert [(m.form, m.tag, m.start, m.end) for m in result.morphemes] == [
        ("있", "VV", 0, 1), ("었", "EP", 1, 2), ("고", "EC", 2, 3)
    ]

def test_mecab_adapter_extracts_tokens_and_aligns_offsets():
    result = MecabKoMorphologyAnalyzer(FakeTagger()).analyze("있었고")
    assert [m.form for m in result.morphemes] == ["있", "었", "고"]
    assert [m.start for m in result.morphemes] == [0, 1, 2]
    assert result.morphemes[0].lemma == "있다"


@pytest.mark.parametrize("text", ["", "hello", "   "])
def test_rejects_empty_or_non_hangul_input(text):
    with pytest.raises(ValueError):
        KiwiMorphologyAnalyzer(FakeKiwi()).analyze(text)


def test_bad_spans_fail_closed():
    broken = SimpleNamespace(tokenize=lambda text: [
        SimpleNamespace(form="있", tag="VV", start=9, len=1)
    ])
    with pytest.raises(RuntimeError, match="invalid token span"):
        KiwiMorphologyAnalyzer(broken).analyze("있었고")


def test_unknown_analyzer_does_not_fallback():
    with pytest.raises(ValueError, match="unsupported morphology analyzer"):
        analyzer_by_name("guess")
