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


def test_kiwi_zero_width_morpheme_is_explicitly_preserved():
    engine = SimpleNamespace(tokenize=lambda text: [
        SimpleNamespace(form="가", tag="NNG", start=0, len=1),
        SimpleNamespace(form="이", tag="VCP", start=1, len=0),
        SimpleNamespace(form="다", tag="EF", start=1, len=1),
    ])
    result = KiwiMorphologyAnalyzer(engine).analyze("가다")
    zero_width = result.morphemes[1]
    assert (zero_width.start, zero_width.end) == (1, 1)
    assert zero_width.form == "이"
    assert zero_width.surface == ""
    assert zero_width.span_status == "zero_width_morph"
    assert result.morphemes[2].surface == "다"
    assert result.morphemes[2].span_status == "surface_aligned"


def test_bad_spans_fail_closed():
    broken = SimpleNamespace(tokenize=lambda text: [
        SimpleNamespace(form="있", tag="VV", start=9, len=1)
    ])
    with pytest.raises(RuntimeError, match="invalid token span"):
        KiwiMorphologyAnalyzer(broken).analyze("있었고")


def test_unknown_analyzer_does_not_fallback():
    with pytest.raises(ValueError, match="unsupported morphology analyzer"):
        analyzer_by_name("guess")



def _analysis(name, text, morphemes):
    return {
        "text": text,
        "analyzer": name,
        "morphemes": [
            {
                "form": form, "tag": tag, "start": start, "end": end,
                "surface": text[start:end], "span_status": "surface_aligned",
            }
            for form, tag, start, end in morphemes
        ],
    }


def test_analyzer_consensus_licenses_formal_ending_not_just_adjacent_vowels():
    from korean_ukrainian.morphology_rule_licenses import analyzer_consensus_rule_licenses

    analyses = [
        _analysis("mecab-ko", "같아서", [("같", "VA", 0, 1), ("아서", "EC", 1, 3)]),
        _analysis("kiwi", "같아서", [("같", "VA", 0, 1), ("어서", "EC", 1, 3)]),
    ]
    report = analyzer_consensus_rule_licenses("같아서", analyses)
    assert "R002:formal:같아서:같>아" in report["candidate_licenses"]
    assert report["analyzers"] == ["kiwi", "mecab-ko"]
    assert report["status"] == "analyzed_not_adjudicated"


def test_analyzer_consensus_does_not_license_lexicalized_many_i():
    from korean_ukrainian.morphology_rule_licenses import analyzer_consensus_rule_licenses

    analyses = [
        _analysis("mecab-ko", "많이", [("많이", "MAG", 0, 2)]),
        _analysis("kiwi", "많이", [("많이", "MAG", 0, 2)]),
    ]
    report = analyzer_consensus_rule_licenses("많이", analyses)
    assert report["candidate_licenses"] == []
    assert report["consensus_boundaries"] == []


def test_analyzer_consensus_rejects_one_analyzer_boundary_disagreement():
    from korean_ukrainian.morphology_rule_licenses import analyzer_consensus_rule_licenses

    analyses = [
        _analysis("mecab-ko", "같이", [("같", "VA", 0, 1), ("이", "JKS", 1, 2)]),
        _analysis("kiwi", "같이", [("같이", "MAG", 0, 2)]),
    ]
    report = analyzer_consensus_rule_licenses("같이", analyses)
    assert report["candidate_licenses"] == []


def test_analyzer_consensus_candidate_is_never_promoted_to_accepted_ipa():
    from korean_ukrainian.morphology_rule_licenses import phoneticize_korean_with_analyzer_consensus

    analyses = [
        _analysis("mecab-ko", "좋아", [("좋", "VA", 0, 1), ("아", "EC", 1, 2)]),
        _analysis("kiwi", "좋아", [("좋", "VA", 0, 1), ("아", "EC", 1, 2)]),
    ]
    result = phoneticize_korean_with_analyzer_consensus("좋아", analyses)
    assert result["morphology_mode"] == "analyzer-consensus"
    assert result["ipa_is_diagnostic_only"] is True
    assert result["ipa_status"] == "diagnostic_only_analyzer_morphology"
    assert "R003:ending_or_suffix_h_deletion:좋아:좋>아" in result["morphology_analysis"]["applied_licenses"]
    assert any(
        trace.get("status") == "analyzer-supported-low-confidence"
        for trace in result["rules"]
    )


def test_analyzer_consensus_rejects_zero_width_boundary_evidence():
    from korean_ukrainian.morphology_rule_licenses import analyzer_consensus_rule_licenses

    analyses = [
        _analysis("mecab-ko", "좋아", [("좋", "VA", 0, 1), ("아", "EC", 1, 2)]),
        {
            "text": "좋아", "analyzer": "kiwi",
            "morphemes": [
                {"form": "좋", "tag": "VA", "start": 0, "end": 1, "surface": "좋"},
                {"form": "zero", "tag": "EF", "start": 1, "end": 1, "surface": "", "span_status": "zero_width_morph"},
                {"form": "아", "tag": "EC", "start": 1, "end": 2, "surface": "아"},
            ],
        },
    ]
    report = analyzer_consensus_rule_licenses("좋아", analyses)
    assert report["candidate_licenses"] == []
