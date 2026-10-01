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
