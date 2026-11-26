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
