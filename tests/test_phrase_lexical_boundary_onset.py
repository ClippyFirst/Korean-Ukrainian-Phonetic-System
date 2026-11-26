"""Cross-word onset changes must survive an exact lexical row for the next word.

NIKL Standard Pronunciation §27 lists `만날 사람[만날싸람]`. The Python phrase
license for the pair fires, but the exact lexical row for `사람` used to rewrite
every syllable of that word afterwards and silently discarded the fortis onset.
These tests pin the official example plus negative controls that must not change.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from korean_ukrainian.pipeline import phoneticize_korean, LEXICAL_PRONUNCIATIONS


def _surface(text, **kw):
    return phoneticize_korean(text, **kw)["surface_hangul"]


def test_official_27_example_survives_lexical_row_for_second_word():
    # Precondition for this test to mean anything: 사람 has a lexical row.
    assert "사람" in LEXICAL_PRONUNCIATIONS
    result = phoneticize_korean("만날 사람", boundary_mode="phrase")
    assert result["surface_hangul"] == "만날 싸람"
    # The IPA must carry the same fortis onset, not the lexical lenis one.
    assert result["ipa"]["syllables"][2].startswith("s͈")
    assert result["ipa"]["ipa"].split(" ")[1].startswith("s͈")


def test_lexical_row_keeps_its_own_vowel_detail_when_onset_is_preserved():
    # Only the onset segment is replaced; the sourced remainder of the lexical
    # IPA syllable (here the length mark) must not be discarded.
    result = phoneticize_korean("만날 사람", boundary_mode="phrase")
    assert result["ipa"]["syllables"][2] == "s͈aː"


def test_same_word_mode_and_unlicensed_phrases_are_unchanged():
    # Negative controls: no phrase license => no cross-word fortition.
    assert _surface("만날 사람") == "만날 사람"
    assert _surface("할 사람", boundary_mode="phrase") == "할 사람"
    assert _surface("갈 사람", boundary_mode="phrase") == "갈 사람"
    assert phoneticize_korean("만날 사람")["ipa"]["syllables"][2] == "saː"


def test_compact_input_is_not_split_or_rewritten():
    assert _surface("만날사람", boundary_mode="phrase") == "만날사람"


def test_isolated_lexical_word_still_uses_its_sourced_ipa():
    result = phoneticize_korean("사람")
    assert result["surface_hangul"] == "사람"
    assert result["ipa"]["ipa"] == "saː.ɾam"
