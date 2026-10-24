import csv
from pathlib import Path

from korean_ukrainian.ipa_target_renderer import render_ipa_sequence_to_ukrainian


def test_ipa_renderer_uses_longest_match_and_keeps_trace():
    result = render_ipa_sequence_to_ukrainian("k.a")
    assert result["ukrainian_orthography"] == "ка"
    assert result["status"] == "model-selected"
    assert [item["source_ipa"] for item in result["segments"]] == ["k", "a"]
    assert [item["target_grapheme"] for item in result["segments"]] == ["к", "а"]
    assert all(item["mapping_id"] for item in result["segments"])
    assert result["renderer"] == "korean_ipa_correspondence"
    assert result["score_type"] == "explicit_correspondence_not_probability"


def test_ipa_renderer_applies_specific_surface_and_sequence_correspondences():
    cases = {
        "ka": ("ка", "model-selected"),
        "ɡa": ("ґа", "model-selected"),
        "dʑi": ("джі", "model-selected"),
        "ɕ͈i": ("ші", "model-selected"),
        "tɕʰi": ("чі", "model-selected"),
        "ɲju": ("нью", "model-selected"),
        "njʌ": ("ньо", "model-selected"),
        "ljʌ": ("льо", "model-selected"),
        "hjʌ": ("гьо", "model-selected"),
        "hje": ("гє", "model-selected"),
        "wi": ("ві", "model-selected"),
        "ɰi": ("ий", "provisional"),
        "kʰjʌ": ("кхьо", "provisional"),
    }
    for ipa, (expected, status) in cases.items():
        result = render_ipa_sequence_to_ukrainian(ipa)
        assert result["ukrainian_orthography"] == expected, ipa
        assert result["status"] == status, ipa


def test_length_is_retained_in_ipa_trace_but_not_written_as_a_target_character():
    result = render_ipa_sequence_to_ukrainian("kaː")
    assert result["ipa"] == "kaː"
    assert result["ukrainian_orthography"] == "ка"
    assert result["ignored_source_markers"] == ["ː"]
    assert result["length_adaptation_status"] == "preserved-in-IPA-not-rendered-in-practical-orthography"


def test_unknown_or_ambiguous_ipa_fails_closed_without_partial_orthography():
    for ipa in ("ɰi~i~e", "💥", "k.a!"):
        result = render_ipa_sequence_to_ukrainian(ipa)
        assert result["status"] == "unavailable", ipa
        assert result["ukrainian_orthography"] is None, ipa
        assert result["reason"] == "unmapped_ipa_sequence", ipa
        assert result["unmapped_fragment"], ipa


def test_all_canonical_lexical_pronunciations_are_reproducible_from_ipa():
    root = Path(__file__).resolve().parents[1]
    path = root / "data" / "korean" / "lexical_pronunciations.csv"
    with path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))

    checked = 0
    alternate_checked = 0
    for row in rows:
        if not row.get("ipa_syllables") or not row.get("target_syllables"):
            continue
        ipa_syllables = row["ipa_syllables"].split("|")
        target_syllables = row["target_syllables"].split("|")
        assert len(ipa_syllables) == len(target_syllables), row["input"]
        rendered = []
        for ipa_syllable in ipa_syllables:
            result = render_ipa_sequence_to_ukrainian(ipa_syllable)
            assert result["ukrainian_orthography"] is not None, (
                row["input"], ipa_syllable, result.get("unmapped_fragment")
            )
            rendered.append(result["ukrainian_orthography"])
        assert rendered == target_syllables, (
            row["input"], row["ipa_syllables"], target_syllables, rendered
        )
        checked += 1

        if row.get("alternate_ipa_syllables") and row.get("alternate_target_syllables"):
            alternate_ipa = row["alternate_ipa_syllables"].split("|")
            alternate_target = row["alternate_target_syllables"].split("|")
            assert len(alternate_ipa) == len(alternate_target), row["input"]
            alternate_rendered = []
            for ipa_syllable in alternate_ipa:
                result = render_ipa_sequence_to_ukrainian(ipa_syllable)
                assert result["ukrainian_orthography"] is not None, (
                    row["input"], ipa_syllable, result.get("unmapped_fragment")
                )
                alternate_rendered.append(result["ukrainian_orthography"])
            assert alternate_rendered == alternate_target, (
                row["input"], row["alternate_ipa_syllables"],
                alternate_target, alternate_rendered
            )
            alternate_checked += 1

    assert checked == len(rows) == 643
    assert alternate_checked == 45
