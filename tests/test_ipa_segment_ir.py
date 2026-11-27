from korean_ukrainian.ipa_segments import parse_ipa_segments


def test_segment_ir_preserves_extended_korean_ipa_symbols_and_features():
    result = parse_ipa_segments("sʰ.kʰ ɦ ɲ ɭ ɸ ç x")
    segments = [item for item in result if item["kind"] == "segment"]
    assert [item["ipa"] for item in segments] == ["sʰ", "kʰ", "ɦ", "ɲ", "ɭ", "ɸ", "ç", "x"]
    assert segments[0]["features"]["aspiration"] == "aspirated"
    assert segments[1]["features"]["place"] == "velar"
    assert segments[2]["features"]["voicing"] == "voiced"
    assert segments[3]["features"]["place"] == "palatal"
    assert segments[4]["features"]["place"] == "retroflex"
    assert segments[5]["features"]["manner"] == "fricative"


def test_segment_ir_keeps_affricates_as_single_segments_and_length_as_feature():
    result = parse_ipa_segments("tɕʰiː")
    segments = [item for item in result if item["kind"] == "segment"]
    assert [item["ipa"] for item in segments] == ["tɕʰ", "iː"]
    assert segments[0]["base"] == "tɕ"
    assert segments[0]["features"]["manner"] == "affricate"
    assert segments[0]["features"]["aspiration"] == "aspirated"
    assert segments[1]["features"]["length"] == "long"


def test_segment_ir_preserves_boundaries_unknowns_and_provenance_without_guessing_spans():
    result = parse_ipa_segments(
        "ɲ.a ?",
        source_span={"start": 4, "end": 5},
        provenance={"rule_ids": ["narrow-nasal-palatalization"], "evidence_refs": ["SRC-1"]},
    )
    nasal = result[0]
    assert nasal["source_span"] == {"start": 4, "end": 5}
    assert nasal["source_alignment"] == "syllable-span"
    assert nasal["provenance"]["rule_ids"] == ["narrow-nasal-palatalization"]
    assert result[1]["kind"] == "boundary"
    assert result[-1]["kind"] == "unknown"
    assert result[-1]["ipa"] == "?"


def test_extended_ipa_result_exposes_segment_ir_with_source_and_rule_provenance():
    from korean_ukrainian.pipeline import phoneticize_korean
    result = phoneticize_korean("녀")["extended_ipa"]
    segments = result["layers"]["narrow"]["segments"]
    assert [item["ipa"] for item in segments if item["kind"] == "segment"] == ["ɲ", "j", "ʌ"]
    assert all(item["source_span"] == {"start": 0, "end": 1} for item in segments if item["kind"] == "segment")
    assert all(item["source_alignment"] == "syllable-span" for item in segments if item["kind"] == "segment")
    assert segments[0]["provenance"]["rule_ids"] == ["narrow-nasal-palatalization"]


def test_engine_generates_existing_expanded_korean_ipa_realizations_by_layer():
    from korean_ukrainian.pipeline import phoneticize_korean
    def layer(source, level):
        return phoneticize_korean(source)["extended_ipa"]["layers"][level]["ipa"]
    assert layer("코", "broad") == "kʰo"
    assert layer("사", "narrow") == "sʰa"
    assert layer("녀", "narrow") == "ɲjʌ"
    assert layer("나라", "narrow") == "na.ɭa"
    assert layer("아하", "narrow") == "a.ɸa"
    assert layer("히", "narrow") == "çi"
    assert layer("후", "narrow") == "xu"
    assert "ɦ" not in layer("안하", "narrow")


def test_segment_ir_handles_tie_bar_affricates_and_combining_vowel_diacritics():
    segments = [item for item in parse_ipa_segments("t͡ɕʰ ãː") if item["kind"] == "segment"]
    assert [item["ipa"] for item in segments] == ["t͡ɕʰ", "ãː"]
    assert segments[0]["base"] == "tɕ"
    assert segments[0]["features"]["aspiration"] == "aspirated"
    assert segments[1]["features"]["nasalization"] == "nasalized"
    assert segments[1]["features"]["length"] == "long"


def test_segment_ir_schema_is_versioned_and_requires_typed_layer_tokens():
    import json
    from pathlib import Path
    schema = json.loads((Path(__file__).resolve().parents[1] / "schemas" / "ipa-profile-result.schema.json").read_text(encoding="utf-8"))
    assert schema["properties"]["schema_version"]["const"] == "1.2"
    assert "segments" in schema["$defs"]["layer"]["required"]
    token = schema["$defs"]["segment_token"]
    assert len(token["allOf"]) == 3
    assert "features" in token["allOf"][0]["then"]["required"]
    assert "boundary" in token["allOf"][1]["then"]["required"]
    assert "reason" in token["allOf"][2]["then"]["required"]


def test_vowel_segment_does_not_receive_consonant_only_features():
    vowel = next(item for item in parse_ipa_segments("iː") if item["kind"] == "segment")
    assert vowel["features"]["major_class"] == "vowel"
    assert vowel["features"]["aspiration"] == "not-applicable"
    assert vowel["features"]["fortisness"] == "not-applicable"
    assert vowel["features"]["release"] == "not-applicable"


def test_layer_segment_ids_are_unique_across_syllables():
    from korean_ukrainian.pipeline import phoneticize_korean
    tokens = phoneticize_korean("나라")["extended_ipa"]["layers"]["narrow"]["segments"]
    ids = [item["id"] for item in tokens]
    assert len(ids) == len(set(ids))
