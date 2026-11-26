"""Unlicensed cross-word `coda + vowel-initial word` contexts are withheld, not guessed.

NIKL §13/§15: liaison across a boundary depends on whether the next element is a
formal or a substantive morpheme, and the norm's own phrase examples show liaison
for substantive words (밭 아래[바다래], 꽃 위[꼬뒤], 닭 앞에[다가페]). Python phrase
mode returned a confident `provisional` non-liaison reading for unlisted pairs
(`밭 위` -> `pat̚ y`) that those official examples contradict. The browser already
withholds these (`cross-word vowel-initial liaison may depend on a substantive-
morpheme boundary (§15)`). Python now returns the same typed refusal: diagnostic
IPA stays inspectable but is flagged and not promoted to a target.
"""
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from korean_ukrainian.pipeline import phoneticize_korean, transliterate_korean

UNRESOLVED = "diagnostic_only_unresolved_pronunciation"


def _run(text, **kw):
    return phoneticize_korean(text, boundary_mode="phrase", **kw)


@pytest.mark.parametrize("text", ["먼 옛날", "슬픈 얘기", "밭 위", "꽃 아래", "밥 이다", "넋 없이", "곳 여기"])
def test_unlicensed_cross_word_vowel_initial_is_withheld(text):
    result = _run(text)
    assert result["ipa"]["status"] == UNRESOLVED
    contexts = result["unresolved_contexts"]
    assert contexts and contexts[0]["rule_id"] == "R002"
    assert "cross-word" in contexts[0]["reason"]
    assert contexts[0]["status"] == "unresolved-no-exact-license"


def test_withheld_context_does_not_reach_a_ukrainian_target():
    out = transliterate_korean("먼 옛날", boundary_mode="phrase")
    assert out["ukrainian_orthography"] is None
    assert out["candidate_orthography"] is None
    assert out["target_status"] == "unresolved"
    assert out["target_unavailable_reason"] == "unresolved_korean_phonology"


@pytest.mark.parametrize("text", ["밭 아래", "꽃 위", "늪 앞", "닭 앞에", "넋 없다", "옷 입다",
                                  "한 일", "먹은 엿", "잘 입다", "먹을 엿"])
def test_exactly_licensed_phrases_stay_resolved(text):
    assert _run(text)["ipa"]["status"] == "provisional"


def test_license_covers_only_its_own_pair_in_a_longer_phrase():
    assert _run("다시 밭 아래 집")["ipa"]["status"] == "provisional"
    # A second, unlicensed vowel-initial boundary in the same phrase is still withheld.
    result = _run("밭 아래 먼 옛날")
    assert result["ipa"]["status"] == UNRESOLVED
    assert [c["pair"] for c in result["unresolved_contexts"]] == ["먼>옛"]


@pytest.mark.parametrize("text", ["먼 옛날", "밭 위", "한 아이"])
def test_same_word_mode_is_unchanged(text):
    # Words are independent tokens outside phrase mode.
    assert phoneticize_korean(text)["ipa"]["status"] == "provisional"


@pytest.mark.parametrize("text", ["아이 옛날", "먼 날", "강 아지", "먼 가다", "한 아이", "나는 할 수는 없다", "한국 음식", "만날 사람 없다"])
def test_other_boundaries_are_not_a_trigger(text):
    # open syllable / consonant-initial next word / ㅇ coda (never resyllabifies) /
    # sonorant coda before a non-§29 vowel / obstruent coda before a vowel the norm does not list
    assert _run(text)["ipa"]["status"] == "provisional"
