import pytest

from korean_ukrainian.pipeline import phoneticize_korean
from korean_ukrainian.ipa_profiles import validate_extended_ipa_result


def test_phoneticize_exposes_all_three_extended_ipa_layers_without_changing_legacy_ipa():
    result = phoneticize_korean("시")
    extended = result["extended_ipa"]
    assert validate_extended_ipa_result(extended) == []
    assert extended["mode"] == "extended-ipa"
    assert extended["layers"]["phonemic"]["level"] == "phonemic"
    assert extended["layers"]["broad"]["ipa"] == result["ipa"]["ipa"] == "si"
    assert any(variant["ipa"] == "ɕi" and "Kang 2010" in variant["note"] for variant in extended["variants"])
    assert extended["layers"]["narrow"]["ipa"] == "ɕʰi"
    assert extended["layers"]["narrow"]["status"] == "partial-narrow-research-profile"
    assert extended["layers"]["narrow"]["target_compatible"] is False
    assert extended["target_adapter"]["input_layer"] == "none"
    assert result["ipa"]["ipa"] == "si"


def test_extended_ipa_retains_existing_narrow_contextual_realizations():
    assert phoneticize_korean("사")["extended_ipa"]["layers"]["narrow"]["ipa"] == "sʰa"
    assert phoneticize_korean("쇼")["extended_ipa"]["layers"]["narrow"]["ipa"] == "sʰjo"
    assert phoneticize_korean("녀")["extended_ipa"]["layers"]["narrow"]["ipa"] == "ɲjʌ"
    assert phoneticize_korean("니")["extended_ipa"]["layers"]["narrow"]["ipa"] == "ni"
    assert phoneticize_korean("아하")["extended_ipa"]["layers"]["narrow"]["ipa"] == "a.ɸa"
    assert phoneticize_korean("나라")["extended_ipa"]["layers"]["narrow"]["ipa"] == "na.ɭa"


def test_extended_ipa_keeps_variants_and_unicode_source_alignment():
    result = phoneticize_korean("괴물 귀")
    extended = result["extended_ipa"]
    assert extended["variants"]
    assert any(item["kind"] == "word" for item in extended["boundaries"])
    assert all(
        span is None or (0 <= span["start"] < span["end"] <= len("괴물 귀"))
        for span in [item["source_span"] for item in extended["trace"]]
    )


def test_non_compatible_narrow_layer_cannot_be_marked_as_adapted():
    result = phoneticize_korean("사")["extended_ipa"]
    result["target_adapter"] = {
        "status": "model-selected",
        "input_layer": "narrow",
        "profile_id": result["layers"]["narrow"]["profile_id"],
    }
    assert "non-compatible narrow IPA must not be marked as adapted" in validate_extended_ipa_result(result)


def test_text_only_extended_result_keeps_speaker_and_acoustic_context_unknown():
    result = phoneticize_korean("시")["extended_ipa"]
    assert result["context"] == {
        "speaker_id": None,
        "dialect": None,
        "age_group": None,
        "speech_style": None,
        "speech_rate_syllables_per_second": None,
        "focus": None,
        "prosodic_position": None,
        "recording_conditions": None,
    }
    assert result["acoustic_annotations"] == []


def test_acoustic_annotation_requires_measurement_provenance():
    result = phoneticize_korean("시")["extended_ipa"]
    result["acoustic_annotations"] = [{
        "feature": "post_stop_f0",
        "value": 185.0,
        "unit": "Hz",
        "source_span": {"start": 0, "end": 1},
        "measurement_method": None,
        "evidence_refs": [],
        "status": "measured",
    }]
    assert "measured acoustic annotations require a method and evidence reference" in validate_extended_ipa_result(result)

def test_measured_acoustic_annotation_is_accepted_with_full_provenance():
    result = phoneticize_korean("시")["extended_ipa"]
    result["acoustic_annotations"] = [{
        "feature": "post_stop_f0",
        "value": 185.0,
        "unit": "Hz",
        "source_span": {"start": 0, "end": 1},
        "measurement_method": "Praat autocorrelation; 50 ms window; 10 ms step",
        "evidence_refs": ["https://doi.org/10.1371/journal.pone.0240682"],
        "status": "measured",
    }]
    assert validate_extended_ipa_result(result) == []

def test_json_schema_requires_research_context_and_separate_acoustic_annotations():
    import json
    from pathlib import Path
    schema_path = Path(__file__).resolve().parents[1] / "schemas" / "ipa-profile-result.schema.json"
    schema = json.loads(schema_path.read_text(encoding="utf-8"))
    required = set(schema["required"])
    assert {"layers", "variants", "boundaries", "trace", "context", "acoustic_annotations"} <= required
    assert "speaker_id" in schema["properties"]["context"]["required"]
    measured = schema["properties"]["acoustic_annotations"]["items"]["allOf"][0]
    assert measured["if"]["properties"]["status"]["const"] == "measured"
    assert {"measurement_method", "evidence_refs", "source_span"} <= set(measured["then"]["required"])

def test_extended_ipa_trace_marks_post_sonorant_h_as_unresolved_variation():
    result = phoneticize_korean("안하")["extended_ipa"]
    item = next(
        trace for trace in result["trace"]
        if "narrow-h-sonorant-variation-unresolved" in trace["rule_ids"]
    )
    assert item["status"] == "unresolved-variation"
    assert len(item["evidence_refs"]) == 2
    assert "speaker-/dialect-conditioned" in item["environment"]

def test_extended_ipa_matches_python_side_of_runtime_comparison_fixtures():
    import json
    from pathlib import Path
    fixture = json.loads(
        (Path(__file__).resolve().parent / "fixtures" / "extended_ipa_parity.json").read_text(encoding="utf-8")
    )
    for case in fixture["cases"]:
        result = phoneticize_korean(case["source"])["extended_ipa"]["layers"]
        assert result["phonemic"]["ipa"] == case["python"]["phonemic"], case["source"]
        assert result["broad"]["ipa"] == case["python"]["broad"], case["source"]
        assert result["narrow"]["ipa"] == case["python"]["narrow"], case["source"]

def test_extended_ipa_source_spans_use_unicode_code_points():
    result = phoneticize_korean("시 나")["extended_ipa"]
    span = next(item["source_span"] for item in result["trace"] if item["source"] == "나" and item.get("layer") == "broad")
    assert span == {"start": 2, "end": 3}

def test_extended_phonemic_trace_is_distinct_from_surface_and_narrow_layers():
    result = phoneticize_korean("시")["extended_ipa"]
    phonemic = [item for item in result["trace"] if item.get("layer") == "phonemic"]
    assert len(phonemic) == 1
    assert phonemic[0]["ipa"] == "si"
    assert phonemic[0]["status"] == "underlying-phonemic-grapheme-derived"

def test_extended_phonemic_layer_preserves_complex_coda_components():
    result = phoneticize_korean("값")["extended_ipa"]
    assert result["layers"]["phonemic"]["ipa"] == "kaps"
    item = next(
        item for item in result["trace"]
        if item.get("layer") == "phonemic" and item["source"] == "값"
    )
    assert item["ipa"] == "kaps"

def test_extended_phonemic_layer_keeps_source_attested_vowel_length():
    result = phoneticize_korean("유사성")["extended_ipa"]
    assert result["layers"]["phonemic"]["ipa"] == "juː.sa.sʌŋ"
