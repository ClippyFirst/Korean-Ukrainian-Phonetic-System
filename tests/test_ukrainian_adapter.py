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
    assert out["ukrainian_orthography"] == "ка"
    assert out["target_status"] == "model-selected"
    assert out["target_unavailable_reason"] is None
    assert out["target_inventory_diagnostic"]["reason"] == "target_inventory_unavailable"
    assert out["selected_candidate_is_output_source"] is False


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
    assert out["ukrainian_orthography"] == "ка"
    assert out["target_analysis"][0]["status"] == "model-selected"
    assert out["target_inventory_status"]["available"] is False
    assert out["target_analysis"][0]["target_inventory_unavailable_reason"] == "target_inventory_unavailable"
    assert out["unavailable_reasons"] == []


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
    assert out["ukrainian_orthography"] == "а"
    assert out["target_analysis"][0]["status"] == "model-selected"
    assert out["target_analysis"][0]["target_inventory_unavailable_reason"] == "grapheme_without_licensed_mapping"
    assert out["target_inventory_analysis"][0]["summary"]["segment_reasons"] == [
        {"source_ipa": "a", "reason": "grapheme_without_licensed_mapping"}
    ]
    assert out["unavailable_reasons"] == []


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
    assert out["ukrainian_orthography"] == "а"
    assert out["target_analysis"][0]["status"] == "model-selected"
    assert out["target_analysis"][0]["target_inventory_unavailable_reason"] == "target_mapping_export_unavailable"
    assert out["target_inventory_analysis"][0]["summary"]["adapter_status"]["error"].startswith(
        "mapping export unavailable:"
    )
    assert out["unavailable_reasons"] == []


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
    assert out["ukrainian_orthography"] == "аб"
    row=out["target_analysis"][0]
    assert row["status"] == "model-selected"
    assert row["target_inventory_unavailable_reason"] == "grapheme_without_licensed_mapping"
    assert out["target_inventory_analysis"][0]["summary"]["segment_reasons"] == [
        {"source_ipa":"b","reason":"grapheme_without_licensed_mapping"}
    ]
    assert out["unavailable_reasons"] == []


def test_shared_renderer_never_promotes_diagnostic_only_ipa_to_orthography():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian
    out=render_ipa_analysis_to_ukrainian(
        "가", [{"input":"가", "ipa":"k.a"}],
        pronunciation_surface="가", phonetics={"ipa_is_diagnostic_only": True},
        ipa={"ipa":"k.a", "is_diagnostic_only": True},
        pronunciation_engine="test",
    )
    assert out["ukrainian_orthography"] is None
    assert out["target_status"] == "unavailable"
    assert out["target_analysis"][0]["reason"] == "diagnostic_ipa_not_accepted"
    assert out["unavailable_reasons"] == ["diagnostic_ipa_not_accepted"]


def test_shared_renderer_honors_per_word_diagnostic_status_without_top_level_flag():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian
    out=render_ipa_analysis_to_ukrainian(
        "가", [{
            "input":"가",
            "ipa":"k.a",
            "status":"diagnostic_only_unresolved_pronunciation",
        }],
        pronunciation_surface="가", phonetics={},
        ipa={"ipa":"k.a", "is_diagnostic_only": False},
        pronunciation_engine="test",
    )
    assert out["ukrainian_orthography"] is None
    assert out["target_analysis"][0]["reason"] == "diagnostic_ipa_not_accepted"
    assert out["unavailable_reasons"] == ["diagnostic_ipa_not_accepted"]


def test_shared_renderer_propagates_source_ipa_status_fields():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian
    out=render_ipa_analysis_to_ukrainian(
        "가", [{"input":"가", "ipa":"k.a"}],
        pronunciation_surface="가",
        phonetics={"ipa_status_reason":"surface IPA reason"},
        ipa={
            "ipa":"k.a",
            "status":"ipa-derived-from-g2pk-surface-form",
            "is_diagnostic_only":False,
            "status_reason":None,
        },
        pronunciation_engine="test",
    )
    assert out["ipa_status"] == "ipa-derived-from-g2pk-surface-form"
    assert out["ipa_is_diagnostic_only"] is False
    assert out["ipa_status_reason"] == "surface IPA reason"


def _reason_test_adapter(*, phonemes, grapheme_map, mapping_index, error=None):
    adapter = UkrainianTargetAdapter.__new__(UkrainianTargetAdapter)
    adapter.package_name = "fake"
    adapter.available = True
    adapter.version = "0.8.0"
    adapter.error = error
    adapter.inventory = {"phonemes": phonemes}
    adapter.grapheme_map = grapheme_map
    adapter.mapping_index = mapping_index
    return adapter


def test_native_strict_reports_unresolved_korean_phonology_separately():
    from korean_ukrainian.pipeline import transliterate_korean

    adapter = UkrainianTargetAdapter("definitely_missing_upi_package")
    result = transliterate_korean("앉어라", target_adapter=adapter)

    assert result["ukrainian_orthography"] is None
    assert result["target_unavailable_reason"] == "unresolved_korean_phonology"
    assert result["target_unavailable_segments"] == []


def test_target_inventory_diagnostic_reports_missing_grapheme_without_blocking_local_output():
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

    assert result["ukrainian_orthography"] == "а"
    summary = result["target_inventory_analysis"][0]["summary"]
    assert summary["reason"] == "licensed_mapping_missing_grapheme"
    assert summary["segment_reasons"] == [
        {"source_ipa": "a", "reason": "licensed_mapping_missing_grapheme"}
    ]
    assert result["unavailable_reasons"] == []


def test_target_inventory_diagnostic_reports_empty_inventory_without_blocking_local_output():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian

    adapter = _reason_test_adapter(phonemes=[], grapheme_map={}, mapping_index={})
    result = render_ipa_analysis_to_ukrainian(
        "가", [{"input": "가", "ipa": "a"}],
        pronunciation_surface="가", phonetics={}, ipa={"ipa": "a"},
        pronunciation_engine="test", target_adapter=adapter,
    )

    assert result["ukrainian_orthography"] == "а"
    assert result["target_inventory_analysis"][0]["summary"]["reason"] == "no_target_candidates"
    assert result["unavailable_reasons"] == []


def test_target_inventory_diagnostic_summarizes_multiple_blockers_without_hiding_them():
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

    assert result["ukrainian_orthography"] == "аб"
    summary = result["target_inventory_analysis"][0]["summary"]
    assert summary["reason"] == "multiple_target_blockers"
    assert summary["segment_reasons"] == [
        {"source_ipa": "a", "reason": "licensed_mapping_missing_grapheme"},
        {"source_ipa": "b", "reason": "grapheme_without_licensed_mapping"},
    ]
    assert result["unavailable_reasons"] == []


def test_shared_renderer_withholds_whole_output_for_one_unmapped_word():
    from korean_ukrainian.pipeline import render_ipa_analysis_to_ukrainian

    adapter = _reason_test_adapter(
        phonemes=[{"id": "UA-A", "ipa": "a", "features": {"consonantal": "0"}}],
        grapheme_map={"a": "а"},
        mapping_index={("a", "a"): [{
            "mapping_id": "M-A", "input_ipa": "a", "target_ipa": "a",
            "target_grapheme": "а", "context": "default", "status": "established",
        }]},
    )
    result = render_ipa_analysis_to_ukrainian(
        "가 나", [{"input": "가", "ipa": "a"}, {"input": "나", "ipa": "q"}],
        pronunciation_surface="가 나", phonetics={}, ipa={"ipa": "a q"},
        pronunciation_engine="test", target_adapter=adapter,
    )

    assert result["ukrainian_orthography"] is None
    assert result["target_status"] == "unavailable"
    assert result["target_analysis"][1]["reason"] == "unmapped_ipa_sequence"
    assert result["target_analysis"][1]["unmapped_fragment"] == "q"
    assert result["target_unavailable_segments"][0]["unmapped_fragment"] == "q"
