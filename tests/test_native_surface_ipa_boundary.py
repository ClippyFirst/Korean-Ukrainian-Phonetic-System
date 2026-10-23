"""Native research-engine surface boundary regressions.

These tests check the observable Korean surface layer separately from IPA and
Ukrainian target adaptation. IPA strings in the lexical table are not promoted
to independent phonetic gold merely because the runtime reproduces them.
"""
from korean_ukrainian.pipeline import phoneticize_korean


def test_native_engine_exposes_nikl_attested_surface_before_ipa():
    # Korean surface forms are directly attested in the lexical evidence
    # register; this is a surface-form regression, not an IPA gold set.
    expected = {
        "값어치": "가버치",
        "넓죽하다": "넙쭈카다",
        "넓둥글다": "넙뚱글다",
        "읽고": "일꼬",
        "넋이": "넉씨",
    }
    for orthography, surface_hangul in expected.items():
        result = phoneticize_korean(orthography)
        assert result["surface_hangul"] == surface_hangul, orthography
        assert result["surface_status"] == "rule-and-lexicon-derived-research-analysis"
        assert len(result["surface_syllables"]) == len(surface_hangul)
        assert len(result["ipa"]["syllables"]) == len(surface_hangul)


def test_native_engine_surface_composition_exposes_rule_only_ㄼ_exception():
    # 넓적하다 exercises the narrow ㄼ exception plus fortition and ㅎ
    # aspiration without relying on a direct lexical pronunciation row.
    result = phoneticize_korean("넓적하다")
    assert result["surface_hangul"] == "넙쩌카다"
    assert result["surface_syllables"][0]["text"] == "넓"
    assert result["surface_syllables"][0]["coda"] == "ㅂ"


def test_native_surface_renderer_preserves_word_boundaries():
    result = phoneticize_korean("국물 사람")
    assert result["surface_hangul"] == "궁물 사람"
    assert " " in result["ipa"]["ipa"]
