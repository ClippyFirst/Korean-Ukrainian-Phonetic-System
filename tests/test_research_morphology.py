"""Tests for optional morphology adapters; no third-party runtime is required."""
from types import SimpleNamespace

import pytest

from korean_ukrainian.research_morphology import (
    KiwiMorphologyAnalyzer,
    MecabKoMorphologyAnalyzer,
    MorphologyResult,
    Morpheme,
    align_morphemes_to_syllables,
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



def test_morpheme_alignment_links_syllables_and_marks_morpheme_boundary():
    from korean_ukrainian.phonology import parse_syllables

    text = "우리의"
    result = MorphologyResult(text, "kiwi", (
        Morpheme("우리", "NNG", 0, 2, analyzer="kiwi", surface="우리"),
        Morpheme("의", "JKG", 2, 3, analyzer="kiwi", surface="의"),
    ))
    aligned = align_morphemes_to_syllables(text, parse_syllables(text), result)

    assert aligned.status == "fully_aligned"
    assert [link.morpheme_index for link in aligned.links] == [0, 0, 1]
    assert [boundary.kind for boundary in aligned.boundaries] == ["same_morpheme", "morpheme"]
    assert aligned.to_dict()["contract"] == "alignment_only_no_pronunciation_or_rule_licenses"


def test_morpheme_alignment_preserves_zero_width_morph_and_abstains_at_boundary():
    from korean_ukrainian.phonology import parse_syllables

    text = "가다"
    result = MorphologyResult(text, "kiwi", (
        Morpheme("가", "NNG", 0, 1, analyzer="kiwi", surface="가"),
        Morpheme("이", "VCP", 1, 1, analyzer="kiwi", surface="", span_status="zero_width_morph"),
        Morpheme("다", "EF", 1, 2, analyzer="kiwi", surface="다"),
    ))
    aligned = align_morphemes_to_syllables(text, parse_syllables(text), result)

    assert aligned.status == "partial_zero_width_morphs"
    assert [link.morpheme_index for link in aligned.links] == [0, 2]
    assert [boundary.kind for boundary in aligned.boundaries] == ["unknown_zero_width_morph"]


def test_morpheme_alignment_preserves_word_boundaries():
    from korean_ukrainian.phonology import parse_syllables

    text = "가 나"
    result = MorphologyResult(text, "mecab-ko", (
        Morpheme("가", "NNG", 0, 1, analyzer="mecab-ko", surface="가"),
        Morpheme("나", "NNG", 2, 3, analyzer="mecab-ko", surface="나"),
    ))
    aligned = align_morphemes_to_syllables(text, parse_syllables(text), result)

    assert aligned.status == "fully_aligned"
    assert [boundary.kind for boundary in aligned.boundaries] == ["word"]


def test_morpheme_alignment_marks_missing_coverage_unaligned():
    from korean_ukrainian.phonology import parse_syllables

    text = "가나다"
    result = MorphologyResult(text, "kiwi", (
        Morpheme("가", "NNG", 0, 1, analyzer="kiwi", surface="가"),
        Morpheme("다", "NNG", 2, 3, analyzer="kiwi", surface="다"),
    ))
    aligned = align_morphemes_to_syllables(text, parse_syllables(text), result)

    assert aligned.status == "partial_unaligned"
    assert [link.status for link in aligned.links] == ["aligned", "unaligned", "aligned"]
    assert [boundary.kind for boundary in aligned.boundaries] == ["unknown_unaligned", "unknown_unaligned"]


def test_morpheme_alignment_rejects_text_mismatch_overlaps_and_bad_surface():
    from korean_ukrainian.phonology import parse_syllables

    with pytest.raises(ValueError, match="does not match source text"):
        align_morphemes_to_syllables(
            "가", parse_syllables("가"), MorphologyResult("나", "kiwi", ())
        )

    overlapping = MorphologyResult("가나", "kiwi", (
        Morpheme("가", "NNG", 0, 1, analyzer="kiwi", surface="가"),
        Morpheme("가나", "NNG", 0, 2, analyzer="kiwi", surface="가나"),
    ))
    with pytest.raises(ValueError, match="not ordered|overlap"):
        align_morphemes_to_syllables("가나", parse_syllables("가나"), overlapping)

    bad_surface = MorphologyResult("가", "kiwi", (
        Morpheme("나", "NNG", 0, 1, analyzer="kiwi", surface="나"),
    ))
    with pytest.raises(ValueError, match="does not match its source span"):
        align_morphemes_to_syllables("가", parse_syllables("가"), bad_surface)
