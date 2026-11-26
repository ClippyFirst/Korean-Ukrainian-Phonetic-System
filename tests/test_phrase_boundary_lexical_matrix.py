"""Boundary matrix: a lexical row may only restate the word's own segments.

Left coda x boundary rule x right onset, with a lexical word on either side and in
the middle of a three-word phrase. The oracle for the boundary-affected edge
segments (right word's first onset, left word's last coda) is the ordered rule
pipeline itself, i.e. an INTERNAL consistency check: it proves a lexical row did
not undo a rule that had already applied, not that the rule is linguistically
correct. Concrete examples below also appear identically in the browser runtime
(tests/phrase-pass-ukrainian-follows-ipa.test.mjs and the parity audit).
"""
import re
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from korean_ukrainian.phonology import parse_syllables
from korean_ukrainian.pipeline import LEXICAL_PRONUNCIATIONS, phoneticize_korean
from korean_ukrainian.rules import apply_ordered_rules

HANGUL = re.compile(r"^[가-힣]+$")
LEXICAL_WORDS = sorted(k for k in LEXICAL_PRONUNCIATIONS if HANGUL.match(k))
# One left word per coda class that a boundary rule can change.
LEFTS = ["밥", "책", "꽃", "발", "한", "종", "옷"]


def _rules_only(text):
    items = parse_syllables(text)
    items, _ = apply_ordered_rules(items, None, boundary_mode="phrase", n_insertion_licensed=False,
                                   rule_licenses=None, morphology_mode="strict")
    return items


def _phrase(text):
    return phoneticize_korean(text, boundary_mode="phrase")


SAMPLE = LEXICAL_WORDS[::5]  # deterministic subset; the full probe ran all rows


@pytest.mark.parametrize("left", LEFTS)
def test_right_word_first_onset_is_not_undone(left):
    # The row for the right word restates its own onset; a boundary rule's change
    # to that onset (ㄴ -> ㄹ after ㄹ, nasal/liquid cases) must survive.
    start = len(left)
    for word in SAMPLE:
        pre = _rules_only(f"{left} {word}")
        final = _phrase(f"{left} {word}")["surface_syllables"]
        if f"{left} {word}" in LEXICAL_PRONUNCIATIONS:
            continue  # an exact phrase row governs the whole phrase by design
        assert final[start]["onset"] == pre[start].onset, f"{left} {word}"


@pytest.mark.parametrize("right", ["나무", "마을", "리본"])
def test_middle_word_last_coda_is_not_undone(right):
    for word in SAMPLE:
        text = f"밥 {word} {right}"
        pre = _rules_only(text)
        final = _phrase(text)["surface_syllables"]
        end = len("밥") + len(word) - 1
        assert final[end]["coda"] == pre[end].coda, text


@pytest.mark.parametrize("text,ipa", [
    ("발 내복약", "pal lɛː.boŋ.ɲak̚"),         # right lexical onset ㄴ -> ㄹ, vowel length kept
    ("할 나뭇잎", "hal la.mun.nip̚"),           # right lexical onset ㄴ -> ㄹ
    ("밥 꽃잎 나무", "pap̚ k͈on.nim na.mu"),    # middle lexical coda ㅂ -> ㅁ before ㄴ
    ("밥 문법 마을", "pam mun.p͈ʌm ma.ɯl"),     # left ㅂ -> ㅁ and middle ㅂ -> ㅁ
    ("밥 읽는 리본", "pap̚ iŋ.nɯl li.bon"),     # middle ㄴ -> ㄹ before ㄹ, onset lateral
])
def test_three_word_and_lexical_edges(text, ipa):
    assert _phrase(text)["ipa"]["ipa"] == ipa


@pytest.mark.parametrize("text,ipa", [
    ("아이 내복약", "a.i nɛː.boŋ.ɲak̚"),     # open-syllable left: nothing to assimilate
    ("아이 꽃잎 나무", "a.i k͈on.nim na.mu"),  # only the middle/right boundary applies
])
def test_negative_controls(text, ipa):
    assert _phrase(text)["ipa"]["ipa"] == ipa


@pytest.mark.parametrize("text,ipa", [
    ("발 내복약", "pal nɛː.boŋ.ɲak̚"),
    ("밥 꽃잎 나무", "pap̚ k͈on.nip̚ na.mu"),
])
def test_same_word_mode_applies_no_boundary_rule(text, ipa):
    assert phoneticize_korean(text)["ipa"]["ipa"] == ipa


def test_isolated_lexical_words_keep_their_sourced_ipa():
    assert phoneticize_korean("내복약")["ipa"]["ipa"] == "nɛː.boŋ.ɲak̚"
    assert phoneticize_korean("꽃잎")["ipa"]["ipa"] == "k͈on.nip̚"
