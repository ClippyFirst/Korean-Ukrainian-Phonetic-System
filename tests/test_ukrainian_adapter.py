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


def test_shared_renderer_explains_target_inventory_abstention():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian
    a=UkrainianTargetAdapter("definitely_missing_upi_package")
    out=render_ipa_analysis_to_ukrainian(
        "가", [{"input":"가", "ipa":"k.a"}],
        pronunciation_surface="가", phonetics={},
        ipa={"ipa":"k.a"}, pronunciation_engine="test",
        target_adapter=a,
    )
    assert out["ukrainian_orthography"] is None
    assert out["target_analysis"][0]["reason"]=="target_inventory_unavailable"
    assert out["unavailable_reasons"]==["target_inventory_unavailable"]


def test_shared_renderer_distinguishes_unlicensed_mapping_from_inventory_failure():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian
    a=UkrainianTargetAdapter.__new__(UkrainianTargetAdapter)
    a.package_name="fake"
    a.available=True
    a.version="0.8.0"
    a.error=None
    a.inventory={"phonemes":[
        {"id":"UA-A","ipa":"a","features":{"consonantal":"0"}},
    ]}
    a.grapheme_map={"a":"а"}
    a.mapping_index={}
    out=render_ipa_analysis_to_ukrainian(
        "가", [{"input":"가", "ipa":"a"}],
        pronunciation_surface="가", phonetics={},
        ipa={"ipa":"a"}, pronunciation_engine="test",
        target_adapter=a,
    )
    assert out["ukrainian_orthography"] is None
    assert out["target_analysis"][0]["reason"]=="no_licensed_ipa_to_ukrainian_mapping"
    assert out["unavailable_reasons"]==["no_licensed_ipa_to_ukrainian_mapping"]
