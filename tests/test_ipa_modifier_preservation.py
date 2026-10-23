"""IPA modifier preservation at the native engine adapter boundary."""
import pytest

from korean_ukrainian.pipeline import (
    map_ipa_to_ukrainian,
    tokenize_ipa,
    tokenize_ipa_with_modifiers,
)


def test_long_vowel_is_retained_as_metadata_not_a_phantom_segment():
    parsed = tokenize_ipa_with_modifiers("ɰiː.nan")
    assert [item["segment"] for item in parsed] == ["ɰ", "i", "n", "a", "n"]
    assert [item["long"] for item in parsed] == [False, True, False, False, False]
    assert tokenize_ipa("ɰiː.nan") == ["ɰ", "i", "n", "a", "n"]


def test_length_marker_without_supported_vowel_fails_closed():
    with pytest.raises(ValueError, match="does not follow a supported vowel"):
        tokenize_ipa_with_modifiers("kːa")


def test_unknown_modifier_is_not_silently_discarded():
    with pytest.raises(ValueError, match="unsupported IPA segment or modifier"):
        tokenize_ipa_with_modifiers("ã")


def test_adapter_analysis_exposes_length_loss_boundary_explicitly():
    result = map_ipa_to_ukrainian("ɰiː")
    long_segments = [segment for segment in result["segments"] if segment["source_length"] == "long"]
    assert len(long_segments) == 1
    assert long_segments[0]["source_ipa"] == "i"
    assert long_segments[0]["length_adaptation_status"] == "preserved-in-analysis-not-rendered"



def test_every_lexical_ipa_syllable_is_supported_by_the_adapter():
    from korean_ukrainian.pipeline import LEXICAL_PRONUNCIATIONS

    problems = []
    for orthography, entry in LEXICAL_PRONUNCIATIONS.items():
        ipa_syllables = entry.get("ipa_syllables", "").split("|")
        if not ipa_syllables or not all(ipa_syllables):
            problems.append(f"{orthography}: missing IPA syllable(s)")
            continue
        for index, ipa_syllable in enumerate(ipa_syllables):
            try:
                tokenize_ipa_with_modifiers(ipa_syllable)
            except ValueError as exc:
                problems.append(f"{orthography} syllable {index + 1} {ipa_syllable!r}: {exc}")
    assert not problems, "\\n".join(problems)
