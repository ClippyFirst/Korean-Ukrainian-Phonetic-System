from korean_ukrainian.ukrainian_adapter import UkrainianTargetAdapter
def test_missing_external_inventory_is_explicit():
    a=UkrainianTargetAdapter("definitely_missing_upi_package"); assert not a.status()["available"]; assert a.candidates({}, {})["status"]=="unavailable"
