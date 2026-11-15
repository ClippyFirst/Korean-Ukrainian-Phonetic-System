"""A lexical row for the LEFT word must not undo a cross-word coda change.

NIKL §18 (official: 밥 먹는다[밤멍는다]) and §20 apply across a connected phrase.
Python phrase mode applies them for ordinary words, but for a left word that has
an exact lexical row (꽃잎, 문법, 읽는 ...) the row used to reset the final coda
after the phrase rules had changed it, so `꽃잎 나무` ignored §18 while
`밥 먹는다` obeyed it. The browser runtime applies the phrase pass after lexical
lookup and already yields the assimilated forms below.

Evidence class: rule-derived (the official phrase examples establish the rule
and the connected-phrase scope); the lexical rows attest each word's own
pronunciation only. No direct attestation of these exact phrases is claimed.
"""
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from korean_ukrainian.pipeline import phoneticize_korean, LEXICAL_PRONUNCIATIONS

# input, surface (spaces ignored), broad IPA — identical to the browser runtime.
CASES = [
    ("꽃잎 나무", "꼰님나무", "k͈on.nim na.mu"),
    ("문법 마을", "문뻠마을", "mun.p͈ʌm ma.ɯl"),
    ("읽는 리본", "잉늘리본", "iŋ.nɯl li.bon"),
]


def _run(text, **kw):
    return phoneticize_korean(text, boundary_mode="phrase", **kw)


@pytest.mark.parametrize("text,surface,ipa", CASES)
def test_left_word_lexical_row_keeps_cross_word_coda(text, surface, ipa):
    left = text.split(" ")[0]
    assert left in LEXICAL_PRONUNCIATIONS  # precondition: the row exists
    result = _run(text)
    assert result["surface_hangul"].replace(" ", "") == surface
    assert result["ipa"]["ipa"] == ipa


def test_ordinary_word_control_already_assimilates():
    assert _run("밥 먹는다")["surface_hangul"].replace(" ", "") == "밤멍는다"


@pytest.mark.parametrize("text,ipa", [
    ("꽃잎 나무", "k͈on.nip̚ na.mu"),
    ("문법 마을", "mun.p͈ʌp̚ ma.ɯl"),
    ("읽는 리본", "iŋ.nɯn ɾi.bon"),
])
def test_same_word_mode_keeps_unassimilated_lexical_form(text, ipa):
    # No cross-word rule runs outside phrase mode.
    assert phoneticize_korean(text)["ipa"]["ipa"] == ipa


@pytest.mark.parametrize("text,ipa", [
    ("꽃잎 가다", "k͈on.nip̚ ka.da"),   # no nasal/liquid onset: nothing to assimilate to
    ("문법 가다", "mun.p͈ʌp̚ ka.da"),
])
def test_no_cross_word_trigger_means_lexical_coda_applies(text, ipa):
    assert _run(text)["ipa"]["ipa"] == ipa


def test_isolated_lexical_word_unchanged():
    assert phoneticize_korean("꽃잎")["ipa"]["ipa"] == "k͈on.nip̚"
    assert _run("꽃잎")["ipa"]["ipa"] == "k͈on.nip̚"


def test_trace_records_the_preserved_coda():
    result = _run("꽃잎 나무")
    traces = [t for t in result["rules"] if t.get("cross_word_coda_preserved")]
    assert traces and traces[0]["cross_word_coda_preserved"] == "ㅁ"
