import pytest
from korean_ukrainian.pipeline import phoneticize_korean

def test_basic_broad_ipa(): assert phoneticize_korean("가")["ipa"]["ipa"]=="ka"
def test_intervocalic_lenis_voicing(): assert "ɡ" in phoneticize_korean("아가")["ipa"]["ipa"]
def test_ipa_level_is_explicit(): assert phoneticize_korean("가",ipa_level="phonemic")["ipa"]["level"]=="phonemic"
def test_narrow_ipa_is_explicitly_unavailable():
    with pytest.raises(ValueError,match="narrow IPA is unavailable"):
        phoneticize_korean("가",ipa_level="narrow")


def test_broad_ipa_voicing_after_sonorant():
    result = phoneticize_korean("현대")["ipa"]["ipa"]
    assert "d" in result

def test_broad_ipa_voicing_of_jieut_after_vowel():
    result = phoneticize_korean("표준")["ipa"]["ipa"]
    assert "dʑ" in result


def test_complex_coda_components_are_explicit_in_phonemic_ipa():
    from korean_ukrainian.phonology import split_coda, parse_syllables
    from korean_ukrainian.ipa import realize_syllables
    assert split_coda("ㄳ") == ("ㄱ", "ㅅ")
    assert split_coda("ㄶ") == ("ㄴ", "ㅎ")
    result = realize_syllables(parse_syllables("넋"), level="phonemic")["ipa"]
    assert "ks" in result



def test_consonant_onset_ui_is_surface_i_but_preserves_phonemic_form():
    from korean_ukrainian.phonology import parse_syllables
    from korean_ukrainian.ipa import realize_syllables
    items = parse_syllables("희망")
    assert realize_syllables(items, level="broad")["ipa"] == "hi.maŋ"
    assert realize_syllables(items, level="phonemic")["ipa"].startswith("hɰi")



def test_broad_ipa_for_complex_coda_aspiration():
    assert phoneticize_korean("읽히다")["ipa"]["ipa"] == "il.kʰi.da"
    assert phoneticize_korean("앉히다")["ipa"]["ipa"] == "an.tɕʰi.da"
    assert phoneticize_korean("넓히다")["ipa"]["ipa"] == "nʌl.pʰi.da"



def test_ipa_renderer_preserves_word_boundaries():
    assert phoneticize_korean("현대 한국어")["ipa"]["ipa"] == "hjʌn.dɛ han.ɡu.ɡʌ"


def test_section4_generic_oe_and_wi_diphthong_variants():
    oe = phoneticize_korean("괴물")["ipa"]
    assert oe["ipa"] == "kø.mul"
    assert [variant["ipa"] for variant in oe["variants"]] == ["kwe.mul"]
    assert oe["variants"][0]["syllable_indices"] == [0]

    wi = phoneticize_korean("귀")["ipa"]
    assert wi["ipa"] == "ky"
    assert [variant["ipa"] for variant in wi["variants"]] == ["kwi"]

def test_section4_combines_up_to_three_optional_vowels():
    result = phoneticize_korean("괴물귀")["ipa"]
    assert result["ipa"] == "kø.mul.ɡy"
    assert [variant["ipa"] for variant in result["variants"]] == [
        "kwe.mul.ɡy",
        "kø.mul.ɡwi",
        "kwe.mul.ɡwi",
    ]

def test_section4_keeps_sourced_lexical_length_and_spelling_in_variants():
    result = phoneticize_korean("회")["ipa"]
    assert result["ipa"] == "hø"
    assert [variant["ipa"] for variant in result["variants"]] == ["hwe"]
    assert result["variants"][0]["syllable_indices"] == [0]

def test_phonemic_ipa_does_not_add_surface_diphthong_variants():
    result = phoneticize_korean("괴물", ipa_level="phonemic")["ipa"]
    assert result["variants"] == []


def test_section5_non_initial_ui_has_a_generic_i_variant():
    result = phoneticize_korean("민주주의")["ipa"]
    assert result["ipa"] == "min.dʑu.dʑu.ɰi"
    assert [variant["ipa"] for variant in result["variants"]] == ["min.dʑu.dʑu.i"]
    assert result["variants"][0]["syllable_indices"] == [3]

def test_section5_does_not_generalize_non_initial_ui_across_word_boundaries():
    result = phoneticize_korean("민주주의 의의")["ipa"]
    assert result["ipa"] == "min.dʑu.dʑu.ɰi ɰi.ɰi"
    assert len(result["variants"]) == 3
    assert "min.dʑu.dʑu.i ɰi.ɰi" in [variant["ipa"] for variant in result["variants"]]
    assert "min.dʑu.dʑu.ɰi ɰi.i" in [variant["ipa"] for variant in result["variants"]]
