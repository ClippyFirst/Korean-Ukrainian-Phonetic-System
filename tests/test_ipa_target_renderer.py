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


def test_ipa_target_override_registry_is_traceable_and_unambiguous():
    root = Path(__file__).resolve().parents[1]
    path = root / "data" / "korean" / "ipa_target_overrides.csv"
    with path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))

    assert len(rows) == 28
    assert len({row["mapping_id"] for row in rows}) == len(rows)
    assert len({row["source_ipa"] for row in rows}) == len(rows)
    for row in rows:
        assert row["mapping_id"].startswith("KUA-IPA-")
        assert row["source_ipa"]
        assert row["target_grapheme"]
        assert row["status"] in {"model-selected", "provisional"}
        assert row["scope"]
        assert row["source_ref"]
        assert row["notes"]


def test_rounded_vowel_target_mappings_are_explicitly_provisional():
    from korean_ukrainian.ipa_target_renderer import render_ipa_sequence_to_ukrainian

    for source_ipa, expected_target in [("y", "ві"), ("ø", "ве")]:
        result = render_ipa_sequence_to_ukrainian(source_ipa)
        assert result["ukrainian_orthography"] == expected_target
        assert result["status"] == "provisional"
        assert result["segments"][0]["mapping_source"] == "ipa_target_overrides"

    for source_ipa, expected_target in [("wi", "ві"), ("we", "ве")]:
        result = render_ipa_sequence_to_ukrainian(source_ipa)
        assert result["ukrainian_orthography"] == expected_target


def test_browser_and_python_renderers_match_on_shared_ipa_sequences():
    import json
    import subprocess

    from korean_ukrainian.ipa_target_renderer import render_ipa_sequence_to_ukrainian

    samples = [
        ("kʰjʌ", "가"),
        ("ɰi", "가"),
        ("ø", "가"),
        ("y", "가"),
        ("hje", "가"),
        ("nja", "가"),
        ("nje", "가"),
        ("lja", "가"),
        ("ɲju", "가"),
        ("sʌ.ul.ljʌk̚", "가가가"),
        ("tɕʰi", "가"),
        ("k͈a", "가"),
        ("p̚", "가"),
    ]
    script = (
        "import { ipaTargetForSource } from './src/app/engine_ipa.js';\n"
        f"const samples = {json.dumps(samples, ensure_ascii=False)};\n"
        "console.log(JSON.stringify(samples.map(([ipa, source]) => "
        "({ipa, ...ipaTargetForSource(source, ipa)}))));"
    )
    completed = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    assert completed.returncode == 0, completed.stdout + completed.stderr
    browser_rows = json.loads(completed.stdout)

    for (ipa, _source), browser in zip(samples, browser_rows, strict=True):
        python = render_ipa_sequence_to_ukrainian(ipa)
        assert browser["text"] == python["ukrainian_orthography"], ipa
        assert browser["status"] == python["status"], ipa
        browser_trace = [
            (item["ipa"], item["ukrainian"], item["status"], item["mapping_id"])
            for item in browser["mappingTrace"]
        ]
        python_trace = [
            (
                item["source_ipa"],
                item["target_grapheme"],
                item["mapping_status"],
                item["mapping_id"],
            )
            for item in python["segments"]
        ]
        assert browser_trace == python_trace, ipa

