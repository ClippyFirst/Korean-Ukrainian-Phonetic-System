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
    with pytest.raises(ValueError, match="no supported vowel in its syllable"):
        tokenize_ipa_with_modifiers("kːa")


def test_post_coda_length_mark_is_attached_to_the_vowel_nucleus():
    for ipa, vowel in (("anː", "a"), ("toŋː", "o"), ("ɰiː", "i")):
        parsed = tokenize_ipa_with_modifiers(ipa)
        long = [item["segment"] for item in parsed if item["long"]]
        assert long == [vowel]


def test_unknown_modifier_is_not_silently_discarded():
    with pytest.raises(ValueError, match="unsupported IPA segment or modifier"):
        tokenize_ipa_with_modifiers("ã")


def test_adapter_analysis_exposes_length_loss_boundary_explicitly():
    result = map_ipa_to_ukrainian("ɰiː")
    long_segments = [segment for segment in result["segments"] if segment["source_length"] == "long"]
    assert len(long_segments) == 1
    assert long_segments[0]["source_ipa"] == "i"
    assert long_segments[0]["length_adaptation_status"] == "preserved-in-analysis-not-rendered"



def test_every_raw_lexical_ipa_form_is_supported_and_syllable_aligned():
    """Audit every base/overlay CSV row, including alternatives hidden by overrides."""
    import csv
    from pathlib import Path

    data_dir = Path(__file__).resolve().parents[1] / "data" / "korean"
    registry_files = [data_dir / "lexical_pronunciations.csv"]
    registry_files.extend(sorted(data_dir.glob("lexical_additions_*.csv")))
    problems = []
    rows_checked = 0

    for path in registry_files:
        if not path.is_file():
            problems.append(f"{path.name}: registry file is missing")
            continue
        with path.open(encoding="utf-8-sig", newline="") as stream:
            for line_number, entry in enumerate(csv.DictReader(stream), start=2):
                orthography = entry.get("input", f"{path.name}:{line_number}")
                rows_checked += 1
                for ipa_field, surface_field in (
                    ("ipa_syllables", "surface_hangul"),
                    ("alternate_ipa_syllables", "alternate_surface_hangul"),
                ):
                    raw_ipa = (entry.get(ipa_field) or "").strip()
                    if not raw_ipa:
                        if ipa_field == "ipa_syllables":
                            problems.append(f"{path.name}:{line_number} {orthography}: missing primary IPA")
                        continue
                    ipa_syllables = raw_ipa.split("|")
                    if any(not part.strip() for part in ipa_syllables):
                        problems.append(f"{path.name}:{line_number} {orthography}: empty syllable in {ipa_field}")
                        continue
                    surface = entry.get(surface_field) or ""
                    surface_count = len([char for char in surface if "가" <= char <= "힣"])
                    if surface_count != len(ipa_syllables):
                        problems.append(
                            f"{path.name}:{line_number} {orthography}: {ipa_field} has "
                            f"{len(ipa_syllables)} syllables but {surface_field} has {surface_count}"
                        )
                    for index, ipa_syllable in enumerate(ipa_syllables, start=1):
                        try:
                            tokenize_ipa_with_modifiers(ipa_syllable)
                        except ValueError as exc:
                            problems.append(
                                f"{path.name}:{line_number} {orthography} {ipa_field} "
                                f"syllable {index} {ipa_syllable!r}: {exc}"
                            )

    assert rows_checked > 0, "no raw lexical rows were inspected"
    assert not problems, "\\n".join(problems)


def test_unreleased_stop_modifier_requires_a_stop_in_the_same_syllable():
    assert tokenize_ipa_with_modifiers("k̚")[0]["unreleased"] is True
    for ipa in ("a̚", "m̚", "a.̚", "a ̚"):
        with pytest.raises(ValueError, match="unreleased-stop diacritic"):
            tokenize_ipa_with_modifiers(ipa)


def test_duplicate_ipa_modifiers_fail_closed():
    with pytest.raises(ValueError, match="duplicate IPA length mark"):
        tokenize_ipa_with_modifiers("aːː")
    with pytest.raises(ValueError, match="duplicate IPA unreleased-stop diacritic"):
        tokenize_ipa_with_modifiers("k̚̚")
