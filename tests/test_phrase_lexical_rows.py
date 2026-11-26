"""Exact multi-word lexical rows must be usable in Python phrase mode.

The shared lexicon already carries the official NIKL §12 [붙임 2] and §15 phrase
examples as space-containing rows (the browser runtime resolves them). The Python
matcher only looked at single eojeol, so those rows never matched. Phrase rows
are applied only when the caller selects boundary_mode="phrase", only for exact
adjacent-eojeol matches, and only when the ordered rules have not already
produced the attested surface (so rule-derived output and IPA are unchanged).
"""
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from korean_ukrainian.pipeline import phoneticize_korean, LEXICAL_PRONUNCIATIONS

# (input, official surface) — verified in 한국어 어문 규범.htm §12 붙임2, §15, §15 붙임.
OFFICIAL = [
    ("옷 한 벌", "오탄벌"), ("낮 한때", "나탄때"), ("꽃 한 송이", "꼬탄송이"),
    ("밭 아래", "바다래"), ("늪 앞", "느밥"), ("꽃 위", "꼬뒤"),
    ("닭 앞에", "다가페"), ("넋 없다", "너겁따"),
]


def _run(text, **kw):
    return phoneticize_korean(text, boundary_mode="phrase", **kw)


@pytest.mark.parametrize("text,expected", OFFICIAL)
def test_official_phrase_examples_in_phrase_mode(text, expected):
    result = _run(text)
    assert result["surface_hangul"].replace(" ", "") == expected
    row = LEXICAL_PRONUNCIATIONS[text]
    assert result["ipa"]["syllables"] == row["ipa_syllables"].split("|")


def test_phrase_row_wins_over_single_word_rows_inside_it():
    # 없다 has its own row [업따]; inside the phrase row 넋 없다 the phrase governs.
    assert "없다" in LEXICAL_PRONUNCIATIONS
    assert _run("넋 없다")["surface_hangul"].replace(" ", "") == "너겁따"


def test_phrase_row_inside_a_longer_sentence():
    result = _run("밭 아래 집")
    assert result["surface_hangul"].replace(" ", "").startswith("바다래")
    assert result["surface_hangul"].split(" ")[-1] == "집"


@pytest.mark.parametrize("text", [o[0] for o in OFFICIAL])
def test_same_word_mode_is_unchanged(text):
    result = phoneticize_korean(text)
    assert result["surface_hangul"].replace(" ", "") != dict(OFFICIAL)[text]


def test_unlisted_lookalikes_and_compact_forms_are_not_rewritten():
    assert _run("밭 위")["surface_hangul"] == "받 위"
    assert _run("꽃 아래")["surface_hangul"] == "꼳 아래"
    # compact input: no hidden space is inferred, so no phrase row can match
    assert _run("밭아래")["surface_hangul"] != "바다래"


def test_rule_derived_phrases_keep_their_existing_output():
    # Rules already reach the attested surface; the row must not replace IPA.
    result = _run("옷 입다")
    assert result["surface_hangul"].replace(" ", "") == "온닙따"
    assert result["ipa"]["ipa"] == "on nip̚.t͈a"
