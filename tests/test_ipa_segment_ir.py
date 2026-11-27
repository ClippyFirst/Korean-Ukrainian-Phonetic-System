from korean_ukrainian.ipa_segments import parse_ipa_segments


def test_segment_ir_preserves_extended_korean_ipa_symbols_and_features():
    result = parse_ipa_segments("sʰ.kʰ ɦ ɲ ɭ ɸ ç x")
    segments = [item for item in result if item["kind"] == "segment"]
    assert [item["ipa"] for item in segments] == ["sʰ", "kʰ", "ɦ", "ɲ", "ɭ", "ɸ", "ç", "x"]
    assert segments[0]["features"]["aspiration"] == "aspirated"
    assert segments[1]["features"]["place"] == "velar"
    assert segments[2]["features"]["voicing"] == "voiced"
    assert segments[3]["features"]["place"] == "palatal"
    assert segments[4]["features"]["place"] == "alveolar"
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
