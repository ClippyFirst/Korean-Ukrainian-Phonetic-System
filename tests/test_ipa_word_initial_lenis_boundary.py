"""Lenis stops are phrase-initial, hence voiceless in broad IPA, after a word boundary.

docs/korean-phonology.md: lenis stops voice in intervocalic contexts while
phrase-initial realizations retain [k t p] in the broad layer. The browser runtime
already treats a whitespace-separated word start as phrase-initial, and every
sibling Python onset rule (ㅎ, ɭ) stops at a word boundary. The broad lenis voicing
rule did not, so `가다 가다` gave `ka.da ɡa.da` although each word alone is `ka.da`
(non-compositional). Negative controls pin the documented word-internal voicing.
"""
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from korean_ukrainian.pipeline import phoneticize_korean


def ipa(text, **kw):
    return phoneticize_korean(text, **kw)["ipa"]["ipa"]


@pytest.mark.parametrize("mode", ["same_word", "phrase"])
@pytest.mark.parametrize("text,expected", [
    ("가다 가다", "ka.da ka.da"),
    ("나무 가다", "na.mu ka.da"),
    ("나무 바다", "na.mu pa.da"),
    ("마을 자리", "ma.ɯl tɕa.ɾi"),
])
def test_word_initial_lenis_after_a_boundary_is_voiceless(text, expected, mode):
    assert ipa(text, boundary_mode=mode) == expected


@pytest.mark.parametrize("text", ["가다", "바다", "자리"])
def test_multiword_is_compositional_with_isolated_words(text):
    assert ipa(f"나무 {text}") == f"na.mu {ipa(text)}"


@pytest.mark.parametrize("text,expected", [
    ("아가", "a.ɡa"),          # word-internal intervocalic voicing stays
    ("한국어", "han.ɡu.ɡʌ"),
    ("아자", "a.dʑa"),
    ("현대 한국어", "hjʌn.dɛ han.ɡu.ɡʌ"),  # existing pinned expectation
])
def test_word_internal_voicing_is_unchanged(text, expected):
    assert ipa(text) == expected
