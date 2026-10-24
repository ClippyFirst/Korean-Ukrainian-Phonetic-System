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
    # The final ㅢ in 민주주의 has a §5 alternate, but the next word starts
    # independently. The exact lexical entry for 의의 preserves [ɰi.i];
    # word-internal [i] must not be applied to the initial syllable of 의의.
    assert result["ipa"] == "min.dʑu.dʑu.ɰi ɰi.i"
    assert [variant["ipa"] for variant in result["variants"]] == [
        "min.dʑu.dʑu.i ɰi.i"
    ]


def test_section5_generic_ye_has_optional_e_except_in_ye_and_rye():
    result = phoneticize_korean("폐기")["ipa"]
    assert result["ipa"] == "pʰje.ɡi"
    assert [variant["ipa"] for variant in result["variants"]] == ["pʰe.ɡi"]
    assert result["variants"][0]["syllable_indices"] == [0]

    assert phoneticize_korean("예")["ipa"]["variants"] == []
    assert phoneticize_korean("례")["ipa"]["variants"] == []

def test_section5_combines_generic_ye_variants():
    result = phoneticize_korean("폐기계")["ipa"]
    assert result["ipa"] == "pʰje.ɡi.ɡje"
    assert [variant["ipa"] for variant in result["variants"]] == [
        "pʰe.ɡi.ɡje",
        "pʰje.ɡi.ɡe",
        "pʰe.ɡi.ɡe",
    ]


def test_broad_ipa_preserves_final_ng_before_vowel_initial_syllable():
    expected = {
        "공인": "koŋ.in",
        "양아치": "jaŋ.a.tɕʰi",
        "동요": "toŋ.jo",
        "동이": "toŋ.i",
    }
    for word, ipa in expected.items():
        assert phoneticize_korean(word)["ipa"]["ipa"] == ipa, word


def test_broad_ipa_absorbs_yod_after_palatal_affricates():
    from korean_ukrainian.ipa import realize_syllables
    from korean_ukrainian.phonology import parse_syllables

    expected = {"져": "tɕʌ", "쪄": "tɕ͈ʌ", "쳐": "tɕʰʌ"}
    for word, ipa in expected.items():
        assert realize_syllables(parse_syllables(word), level="broad")["ipa"] == ipa
        # The phonemic layer preserves the underlying glide; only broad
        # surface IPA applies NIKL Standard Pronunciation Rule 5's exception.
        assert realize_syllables(parse_syllables(word), level="phonemic")["ipa"] == ipa[0:0] + {
            "져": "tɕjʌ", "쪄": "tɕ͈jʌ", "쳐": "tɕʰjʌ"
        }[word]


def test_yod_absorption_fixes_benchmark_mismatches():
    expected = {
        "던져주다": "tʌn.dʑʌ.dʑu.da",
        "쳐먹고": "tɕʰʌ.mʌk̚.k͈o",
        "빠져": "p͈a.dʑʌ",
    }
    for word, ipa in expected.items():
        assert phoneticize_korean(word)["ipa"]["ipa"] == ipa, word
