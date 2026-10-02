from korean_ukrainian.ukrainian_adapter import UkrainianTargetAdapter

def test_missing_external_inventory_is_explicit():
    a=UkrainianTargetAdapter("definitely_missing_upi_package")
    assert not a.status()["available"]
    assert a.candidates({}, {})["status"]=="needs_source_features"

def test_selection_is_explicit_when_target_inventory_is_unavailable():
    a=UkrainianTargetAdapter("definitely_missing_upi_package")
    from korean_ukrainian.pipeline import transliterate_korean
    out=transliterate_korean("가",target_adapter=a)
    assert out["selected_candidate"] is None
    assert out["ukrainian_orthography"] is None


def test_upi_mapping_penalties_are_consumed():
    a=UkrainianTargetAdapter.__new__(UkrainianTargetAdapter)
    a.package_name="fake"
    a.available=True
    a.version="0.8.0"
    a.error=None
    a.inventory={"phonemes":[
        {"id":"UA-A","ipa":"a","features":{"consonantal":"0"}},
        {"id":"UA-B","ipa":"i","features":{"consonantal":"0"}},
    ]}
    a.grapheme_map={"a":"а","i":"і"}
    a.mapping_index={("a","a"):[{"mapping_id":"M1","input_ipa":"a","target_ipa":"a","target_grapheme":"а","context":"default","context_penalty":"0","phonotactic_penalty":"3","orthographic_penalty":"0","status":"established"}]}
    result=a.candidates({"consonantal":"0"},{"consonantal":1.0},source_ipa="a")
    aa=next(x for x in result["candidates"] if x["candidate_id"]=="UA-A")
    assert aa["phonotactic_penalty"]==3.0
    assert aa["mapping_id"]=="M1"
