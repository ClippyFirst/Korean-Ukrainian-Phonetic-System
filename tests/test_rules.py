from korean_ukrainian.phonology import parse_syllables
from korean_ukrainian.rules import apply_ordered_rules

def test_final_neutralization():
    items,traces=apply_ordered_rules(parse_syllables("낫"),["R001"]); assert items[0].coda=="ㄷ" and traces[0].changed

def test_nasal_assimilation():
    items,_=apply_ordered_rules(parse_syllables("국민"),["R005"]); assert items[0].coda=="ㅇ"

def test_liquidization():
    items,_=apply_ordered_rules(parse_syllables("신라"),["R006"]); assert items[0].coda=="ㄹ" and items[1].onset=="ㄹ"

def test_palatalization_requires_nikl_formal_morpheme_license_and_ㅣ():
    items,traces=apply_ordered_rules(parse_syllables("굳이"),["R007"])
    assert items[0].coda=="ㄷ" and items[1].onset=="ㅇ"
    assert traces[0].status=="conditional-disabled"

    items,traces=apply_ordered_rules(
        parse_syllables("굳이"),["R007"],
        rule_licenses={"R007:formal_morpheme_i"},
    )
    assert items[0].coda=="" and items[1].onset=="ㅈ"
    assert traces[0].changed

def test_palatalization_does_not_fire_before_vowels_other_than_ㅣ():
    items,traces=apply_ordered_rules(
        parse_syllables("밭에"),["R007"],
        rule_licenses={"R007:formal_morpheme_i"},
    )
    assert items[0].coda=="ㅌ" and items[1].onset=="ㅇ"
    assert not traces[0].changed

def test_dh_suffix_palatalization_is_sequential_r004_then_r007():
    for word, expected_onset in {"굳히다":"ㅊ","닫히다":"ㅊ","묻히다":"ㅊ"}.items():
        items,traces=apply_ordered_rules(
            parse_syllables(word),["R004","R007"],
            rule_licenses={"R007:dh_suffix_hi"},
        )
        assert items[0].coda==""
        assert items[1].onset==expected_onset
        assert traces[0].changed and traces[1].changed

def test_tensification():
    items,_=apply_ordered_rules(parse_syllables("국밥"),["R008"]); assert items[1].onset=="ㅃ"

def test_aspiration():
    items,_=apply_ordered_rules(parse_syllables("각하"),["R004"]); assert items[1].onset=="ㅋ"

def test_n_insertion_requires_exact_word_pair_license_not_a_global_boolean():
    items,traces=apply_ordered_rules(
        parse_syllables("한여름"),["R009"],n_insertion_licensed=True
    )
    assert items[1].onset=="ㅇ"
    assert traces[0].status=="conditional-disabled"

    items,traces=apply_ordered_rules(
        parse_syllables("한여름"),["R009"],
        rule_licenses={"R009:word:한여름:한>여"},
    )
    assert items[1].onset=="ㄴ"
    assert traces[0].changed

def test_n_insertion_license_cannot_be_reused_for_a_different_word():
    items,traces=apply_ordered_rules(
        parse_syllables("먹이"),["R009"],
        n_insertion_licensed=True,
        rule_licenses={"R009:word:한여름:한>여"},
    )
    assert items[1].onset=="ㅇ"
    assert not traces[0].changed

def test_n_insertion_disabled_by_default():
    items,_=apply_ordered_rules(parse_syllables("한여름"),["R009"]); assert items[1].onset=="ㅇ"

def test_complex_coda_liaison():
    expected={"넋이":("ㄱ","ㅆ"),"값이":("ㅂ","ㅆ"),"앉아":("ㄴ","ㅈ"),"닭을":("ㄹ","ㄱ"),"젊어":("ㄹ","ㅁ")}
    for word,(coda,onset) in expected.items():
        items,_=apply_ordered_rules(parse_syllables(word),["R002"])
        assert items[0].coda==coda and items[1].onset==onset

def test_h_complex_coda_before_vowel():
    for word,expected in {"많아":"ㄴ","싫어":"ㄹ"}.items():
        items,_=apply_ordered_rules(parse_syllables(word),["R002","R003"])
        assert items[0].coda==expected


def test_liquid_assimilation_requires_surface_lateral_context():
    items,_=apply_ordered_rules(parse_syllables("신라"),["R006"])
    assert items[0].coda=="ㄹ" and items[1].onset=="ㄹ"

def test_balm_lexical_exception_before_consonant():
    items,_=apply_ordered_rules(parse_syllables("밟는"),["R009","R002","R003","R004","R005","R006","R007","R008","R001"])
    assert items[0].coda=="ㅁ"

def test_neolp_compound_lexical_exception():
    items,_=apply_ordered_rules(parse_syllables("넓죽하다"),["R009","R002","R003","R004","R005","R006","R007","R010","R011","R012","R013","R014","R015","R008","R001"])
    assert items[0].coda=="ㅂ" and items[1].onset=="ㅉ"


def test_complex_h_coda_aspiration_retains_nasal_or_liquid():
    for word, (expected_coda, expected_onset) in {"많다": ("ㄴ", "ㅌ"), "싫다": ("ㄹ", "ㅌ")}.items():
        items, traces = apply_ordered_rules(parse_syllables(word), ["R004"])
        assert (items[0].coda, items[1].onset) == (expected_coda, expected_onset)
        assert traces[0].changed


def test_neoldunggeul_lexical_exception_matches_stem_prefix():
    items, _ = apply_ordered_rules(parse_syllables("넓둥글다"))
    assert items[0].coda == "ㅂ"
    assert items[1].onset == "ㄸ"


def test_coda_plus_h_uses_final_representative_for_aspiration():
    items, traces = apply_ordered_rules(parse_syllables("옷하고"), ["R004"])
    assert (items[0].coda, items[1].onset) == ("", "ㅌ")
    assert traces[0].changed


def test_complex_coda_plus_h_retains_first_component_and_aspirates_second():
    cases = {
        "읽히다": ("ㄹ", "ㅋ"),
        "앉히다": ("ㄴ", "ㅊ"),
        "넓히다": ("ㄹ", "ㅍ"),
    }
    for word, expected in cases.items():
        items, traces = apply_ordered_rules(parse_syllables(word), ["R004"])
        assert (items[0].coda, items[1].onset) == expected
        assert traces[0].changed


def test_n_insertion_does_not_apply_after_open_syllable_even_when_enabled():
    items, traces = apply_ordered_rules(
        parse_syllables("가여름"), ["R009"], n_insertion_licensed=True,
        rule_licenses={"R009:word:가여름:가>여"}
    )
    assert items[1].onset == "ㅇ"
    assert not traces[0].changed


def test_n_insertion_still_applies_after_coda_when_licensed():
    items, traces = apply_ordered_rules(
        parse_syllables("한여름"), ["R009"], n_insertion_licensed=True,\n        rule_licenses={"R009:word:한여름:한>여"}
    )
    assert items[1].onset == "ㄴ"
    assert traces[0].changed



def test_final_consonant_plus_h_uses_correct_aspiration():
    cases = {
        "옷하고": ("", "ㅌ"),
        "맞히다": ("", "ㅊ"),
    }
    for word, expected in cases.items():
        items, traces = apply_ordered_rules(parse_syllables(word), ["R004"])
        assert (items[0].coda, items[1].onset) == expected
        assert traces[0].changed



def test_complex_coda_plus_h_preserves_the_unaspirated_component():
    cases = {
        "읽히다": ("ㄹ", "ㅋ"),
        "앉히다": ("ㄴ", "ㅊ"),
        "넓히다": ("ㄹ", "ㅍ"),
    }
    for word, expected in cases.items():
        items, traces = apply_ordered_rules(parse_syllables(word), ["R004"])
        assert (items[0].coda, items[1].onset) == expected
        assert traces[0].changed



def test_verbal_stem_rieul_giyeok_exception_requires_morphological_license():
    items, traces = apply_ordered_rules(
        parse_syllables("읽고"),
        ["R016", "R008", "R001"],
        boundary_mode="same_word",
        rule_licenses={"R016:verb_stem_rieul_giyeok_suffix"},
    )
    assert traces[0].status == "conditional-disabled"

    items, traces = apply_ordered_rules(
        parse_syllables("읽고"),
        ["R016", "R008", "R001"],
        boundary_mode="morpheme",
    )
    assert (items[0].coda, items[1].onset) == ("ㄱ", "ㄲ")
    assert traces[0].status == "conditional-disabled"

    items, traces = apply_ordered_rules(
        parse_syllables("읽고"),
        ["R016", "R008", "R001"],
        boundary_mode="morpheme",
        rule_licenses={"R016:verb_stem_rieul_giyeok_suffix"},
    )
    assert (items[0].coda, items[1].onset) == ("ㄹ", "ㄲ")
    assert traces[0].changed
