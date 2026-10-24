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
    assert out["target_unavailable_reason"] == "target_inventory_unavailable"


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
    assert out["target_analysis"][0]["reason"]=="grapheme_without_licensed_mapping"
    assert out["unavailable_reasons"]==["grapheme_without_licensed_mapping"]
    assert out["target_analysis"][0]["segment_reasons"] == [
        {"source_ipa": "a", "reason": "grapheme_without_licensed_mapping"}
    ]


def test_shared_renderer_reports_mapping_export_failure_separately():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian
    a=UkrainianTargetAdapter.__new__(UkrainianTargetAdapter)
    a.package_name="fake"
    a.available=True
    a.version="0.8.0"
    a.error="mapping export unavailable: FileNotFoundError"
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
    assert out["target_analysis"][0]["reason"] == "target_mapping_export_unavailable"
    assert out["target_analysis"][0]["target_adapter_status"]["error"].startswith(
        "mapping export unavailable:"
    )


def test_shared_renderer_identifies_the_unmapped_ipa_segment_in_a_word():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian
    a=UkrainianTargetAdapter.__new__(UkrainianTargetAdapter)
    a.package_name="fake"
    a.available=True
    a.version="0.8.0"
    a.error=None
    a.inventory={"phonemes":[
        {"id":"UA-A","ipa":"a","features":{"consonantal":"0"}},
        {"id":"UA-B","ipa":"b","features":{"consonantal":"1"}},
    ]}
    a.grapheme_map={"a":"а","b":"б"}
    a.mapping_index={("a","a"):[{
        "mapping_id":"M-A","input_ipa":"a","target_ipa":"a",
        "target_grapheme":"а","context":"default","status":"established",
    }]}
    out=render_ipa_analysis_to_ukrainian(
        "가", [{"input":"가", "ipa":"a.b"}],
        pronunciation_surface="가", phonetics={},
        ipa={"ipa":"a.b"}, pronunciation_engine="test",
        target_adapter=a,
    )
    assert out["ukrainian_orthography"] is None
    row=out["target_analysis"][0]
    assert row["reason"] == "grapheme_without_licensed_mapping"
    assert row["segment_reasons"] == [
        {"source_ipa":"b","reason":"grapheme_without_licensed_mapping"}
    ]

def _reason_test_adapter(*, phonemes, grapheme_map, mapping_index, error=None):
    a = UkrainianTargetAdapter.__new__(UkrainianTargetAdapter)
    a.package_name = "fake"
    a.available = True
    a.version = "0.8.0"
    a.error = error
    a.inventory = {"phonemes": phonemes}
    a.grapheme_map = grapheme_map
    a.mapping_index = mapping_index
    return a


def test_native_strict_reports_unresolved_korean_phonology_separately():
    from korean_ukrainian.pipeline import transliterate_korean

    adapter = UkrainianTargetAdapter("definitely_missing_upi_package")
    result = transliterate_korean("앉어라", target_adapter=adapter)

    assert result["ukrainian_orthography"] is None
    assert result["target_unavailable_reason"] == "unresolved_korean_phonology"
    assert result["target_unavailable_segments"] == []


def test_shared_renderer_reports_licensed_mapping_without_renderable_grapheme():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian

    adapter = _reason_test_adapter(
        phonemes=[{"id": "UA-A", "ipa": "a", "features": {"consonantal": "0"}}],
        grapheme_map={},
        mapping_index={("a", "a"): [{
            "mapping_id": "M-A", "input_ipa": "a", "target_ipa": "a",
            "target_grapheme": "", "context": "default", "status": "established",
        }]},
    )
    result = render_ipa_analysis_to_ukrainian(
        "가", [{"input": "가", "ipa": "a"}],
        pronunciation_surface="가", phonetics={}, ipa={"ipa": "a"},
        pronunciation_engine="test", target_adapter=adapter,
    )

    assert result["ukrainian_orthography"] is None
    assert result["target_analysis"][0]["reason"] == "licensed_mapping_missing_grapheme"
    assert result["target_analysis"][0]["segment_reasons"] == [
        {"source_ipa": "a", "reason": "licensed_mapping_missing_grapheme"}
    ]


def test_shared_renderer_reports_empty_candidate_inventory():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian

    adapter = _reason_test_adapter(phonemes=[], grapheme_map={}, mapping_index={})
    result = render_ipa_analysis_to_ukrainian(
        "가", [{"input": "가", "ipa": "a"}],
        pronunciation_surface="가", phonetics={}, ipa={"ipa": "a"},
        pronunciation_engine="test", target_adapter=adapter,
    )

    assert result["ukrainian_orthography"] is None
    assert result["target_analysis"][0]["reason"] == "no_target_candidates"
    assert result["unavailable_reasons"] == ["no_target_candidates"]


def test_shared_renderer_summarizes_multiple_segment_blockers_without_hiding_them():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian

    adapter = _reason_test_adapter(
        phonemes=[
            {"id": "UA-A", "ipa": "a", "features": {"consonantal": "0"}},
            {"id": "UA-B", "ipa": "b", "features": {"consonantal": "1"}},
        ],
        grapheme_map={"b": "б"},
        mapping_index={("a", "a"): [{
            "mapping_id": "M-A", "input_ipa": "a", "target_ipa": "a",
            "target_grapheme": "", "context": "default", "status": "established",
        }]},
    )
    result = render_ipa_analysis_to_ukrainian(
        "가", [{"input": "가", "ipa": "a.b"}],
        pronunciation_surface="가", phonetics={}, ipa={"ipa": "a.b"},
        pronunciation_engine="test", target_adapter=adapter,
    )

    row = result["target_analysis"][0]
    assert result["ukrainian_orthography"] is None
    assert row["reason"] == "multiple_target_blockers"
    assert row["segment_reasons"] == [
        {"source_ipa": "a", "reason": "licensed_mapping_missing_grapheme"},
        {"source_ipa": "b", "reason": "grapheme_without_licensed_mapping"},
    ]
    assert result["unavailable_reasons"] == ["multiple_target_blockers"]


def test_shared_renderer_keeps_whole_output_unavailable_when_one_word_fails():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian

    adapter = _reason_test_adapter(
        phonemes=[
            {"id": "UA-A", "ipa": "a", "features": {"consonantal": "0"}},
            {"id": "UA-B", "ipa": "b", "features": {"consonantal": "1"}},
        ],
        grapheme_map={"a": "а", "b": "б"},
        mapping_index={("a", "a"): [{
            "mapping_id": "M-A", "input_ipa": "a", "target_ipa": "a",
            "target_grapheme": "а", "context": "default", "status": "established",
        }]},
    )
    result = render_ipa_analysis_to_ukrainian(
        "가 나", [{"input": "가", "ipa": "a"}, {"input": "나", "ipa": "b"}],
        pronunciation_surface="가 나", phonetics={}, ipa={"ipa": "a b"},
        pronunciation_engine="test", target_adapter=adapter,
    )

    assert result["target_analysis"][0]["status"] == "model-selected"
    assert result["target_analysis"][1]["reason"] == "grapheme_without_licensed_mapping"
    assert result["ukrainian_orthography"] is None
    assert result["target_status"] == "unavailable"

