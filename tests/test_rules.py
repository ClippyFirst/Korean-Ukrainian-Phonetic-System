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
        rule_licenses={"R007:formal_morpheme_i:굳이:굳>이"},
    )
    assert items[0].coda=="" and items[1].onset=="ㅈ"
    assert traces[0].changed

def test_palatalization_does_not_fire_before_vowels_other_than_ㅣ():
    items,traces=apply_ordered_rules(
        parse_syllables("밭에"),["R007"],
        rule_licenses={"R007:formal_morpheme_i:밭에:밭>에"},
    )
    assert items[0].coda=="ㅌ" and items[1].onset=="ㅇ"
    assert not traces[0].changed

def test_dh_suffix_palatalization_is_sequential_r004_then_r007():
    for word, expected_onset in {"굳히다":"ㅊ","닫히다":"ㅊ","묻히다":"ㅊ"}.items():
        items,traces=apply_ordered_rules(
            parse_syllables(word),["R004","R007"],
            rule_licenses={f"R007:dh_suffix_hi:{word}:{word[:1]}>{word[1:2]}"},
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

def test_complex_coda_liaison_requires_exact_formal_morpheme_license():
    expected={"넋이":(("ㄱ","ㅆ"),"넋>이"),"값이":(("ㅂ","ㅆ"),"값>이"),"앉아":(("ㄴ","ㅈ"),"앉>아"),"닭을":(("ㄹ","ㄱ"),"닭>을"),"젊어":(("ㄹ","ㅁ"),"젊>어")}
    for word,((coda,onset),pair) in expected.items():
        items,traces=apply_ordered_rules(parse_syllables(word),["R002"])
        assert traces[0].status=="conditional-disabled"
        assert items[0].coda in {"ㄳ","ㅄ","ㄵ","ㄺ","ㄻ"}
        items,traces=apply_ordered_rules(
            parse_syllables(word),["R002"],
            rule_licenses={f"R002:formal:{word}:{pair}"},
        )
        assert items[0].coda==coda and items[1].onset==onset
        assert traces[0].changed

def test_substantive_morpheme_uses_representative_of_complex_coda():
    # 값어치 [가버치] follows §15, not §14's 값이 [갑씨] pattern.
    items,traces=apply_ordered_rules(parse_syllables("값어치"),["R002"])
    assert items[0].coda=="ㅄ" and items[1].onset=="ㅇ"
    assert traces[0].status=="conditional-disabled"

    items,traces=apply_ordered_rules(
        parse_syllables("값어치"),["R002"],
        rule_licenses={"R002:substantive:값어치:값>어"},
    )
    assert items[0].coda==""
    assert items[1].onset=="ㅂ"
    assert traces[0].changed

def test_complex_coda_license_cannot_be_reused_for_another_word():
    items,traces=apply_ordered_rules(
        parse_syllables("값어치"),["R002"],
        rule_licenses={"R002:formal:넋이:넋>이"},
    )
    assert items[0].coda=="ㅄ" and items[1].onset=="ㅇ"
    assert traces[0].status=="conditional-disabled"

def test_h_deletion_before_vowel_requires_exact_ending_or_suffix_evidence():
    cases={"많아":("많>아","ㄴ"),"싫어":("싫>어","ㄹ")}
    for word,(pair,expected) in cases.items():
        items,traces=apply_ordered_rules(parse_syllables(word),["R003","R002"])
        assert items[0].coda in {"ㄶ","ㅀ"}
        assert traces[0].status=="conditional-disabled"

        items,traces=apply_ordered_rules(
            parse_syllables(word),["R003","R002"],
            rule_licenses={f"R003:ending_or_suffix_h_deletion:{word}:{pair}"},
        )
        assert items[0].coda==""
        assert items[1].onset==expected
        assert traces[0].changed

def test_h_deletion_license_cannot_be_reused_for_another_form():
    items,traces=apply_ordered_rules(
        parse_syllables("싫어"),["R003"],
        rule_licenses={"R003:ending_or_suffix_h_deletion:많아:많>아"},
    )
    assert items[0].coda=="ㅀ"
    assert traces[0].status=="conditional-disabled"


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


def test_complex_coda_plus_h_requires_exact_morphophonemic_license():
    cases = {
        "읽히다": (("ㄹ", "ㅋ"), "읽>히"),
        "앉히다": (("ㄴ", "ㅊ"), "앉>히"),
        "넓히다": (("ㄹ", "ㅍ"), "넓>히"),
    }
    for word, (expected, pair) in cases.items():
        items, traces = apply_ordered_rules(parse_syllables(word), ["R004"])
        assert (items[0].coda, items[1].onset) == ({"읽히다":"ㄺ","앉히다":"ㄵ","넓히다":"ㄼ"}[word], "ㅎ")
        assert traces[0].status == "conditional-disabled"

        items, traces = apply_ordered_rules(
            parse_syllables(word), ["R004"],
            rule_licenses={f"R004:complex_h_suffix:{word}:{pair}"},
        )
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
        parse_syllables("한여름"), ["R009"], n_insertion_licensed=True,
        rule_licenses={"R009:word:한여름:한>여"}
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



def test_complex_coda_h_license_cannot_be_reused_for_another_form():
    items, traces = apply_ordered_rules(
        parse_syllables("앉히다"), ["R004"],
        rule_licenses={"R004:complex_h_suffix:읽히다:읽>히"},
    )
    assert (items[0].coda, items[1].onset) == ("ㄵ", "ㅎ")
    assert traces[0].status == "conditional-disabled"

def test_unknown_complex_coda_before_h_is_not_guessed_as_a_suffix_pattern():
    items, traces = apply_ordered_rules(parse_syllables("넋하고"), ["R004"])
    assert (items[0].coda, items[1].onset) == ("ㄳ", "ㅎ")
    assert traces[0].status == "conditional-disabled"



def test_verbal_stem_rieul_giyeok_exception_requires_exact_morphological_license():
    generic = {"R016:verb_stem_rieul_giyeok_suffix"}
    items, traces = apply_ordered_rules(
        parse_syllables("읽고"),
        ["R016", "R008", "R001"],
        boundary_mode="morpheme",
        rule_licenses=generic,
    )
    assert (items[0].coda, items[1].onset) == ("ㄱ", "ㄱ")
    assert traces[0].status == "conditional-disabled"
    assert traces[1].status == "conditional-disabled"

    items, traces = apply_ordered_rules(
        parse_syllables("읽고"),
        ["R016", "R008", "R001"],
        boundary_mode="morpheme",
        rule_licenses={"R016:verb_stem_rieul_giyeok_suffix:읽고:읽>고"},
    )
    assert (items[0].coda, items[1].onset) == ("ㄹ", "ㄲ")
    assert traces[0].changed

def test_r016_license_cannot_be_reused_for_noun_dakgogi():
    items, traces = apply_ordered_rules(
        parse_syllables("닭고기"),
        ["R016", "R008", "R001"],
        boundary_mode="morpheme",
        rule_licenses={"R016:verb_stem_rieul_giyeok_suffix:읽고:읽>고"},
    )
    assert (items[0].coda, items[1].onset) == ("ㄱ", "ㄱ")
    assert traces[0].status == "conditional-disabled"
    assert traces[1].status == "conditional-disabled"


def test_nikl_section_19_precedes_section_18_in_python_pipeline():
    for word, expected_coda in {"국립":"ㅇ", "협력":"ㅁ"}.items():
        items,traces=apply_ordered_rules(parse_syllables(word),["R006","R005"])
        assert items[0].coda==expected_coda
        assert items[1].onset=="ㄴ"
        assert traces[0].changed
        assert traces[1].changed

def test_default_rule_order_produces_dongnimmun_surface():
    items,traces=apply_ordered_rules(parse_syllables("독립문"))
    assert [(x.onset,x.coda) for x in items]==[("ㄷ","ㅇ"),("ㄴ","ㅁ"),("ㅁ","ㄴ")]
    assert any(t.rule_id=="R006" and t.changed for t in traces)
    assert any(t.rule_id=="R005" and t.changed for t in traces)

def test_simple_coda_liaison_requires_morphology_when_section_15_changes_the_representative():
    items,traces=apply_ordered_rules(parse_syllables("깎아"),["R002"])
    assert items[0].coda=="ㄲ" and items[1].onset=="ㅇ"
    assert traces[0].status=="conditional-disabled"

    items,traces=apply_ordered_rules(
        parse_syllables("깎아"),["R002"],
        rule_licenses={"R002:formal:깎아:깎>아"},
    )
    assert items[0].coda==""
    assert items[1].onset=="ㄲ"
    assert traces[0].changed

def test_substantive_simple_coda_uses_representative_and_exact_pair_license():
    items,traces=apply_ordered_rules(parse_syllables("겉옷"),["R002"])
    assert items[0].coda=="ㅌ" and items[1].onset=="ㅇ"
    assert traces[0].status=="conditional-disabled"

    items,traces=apply_ordered_rules(
        parse_syllables("겉옷"),["R002"],
        rule_licenses={"R002:substantive:겉옷:겉>옷"},
    )
    assert items[0].coda==""
    assert items[1].onset=="ㄷ"
    assert traces[0].changed

def test_simple_coda_license_cannot_be_reused_for_another_full_form():
    items,traces=apply_ordered_rules(
        parse_syllables("겉옷"),["R002"],
        rule_licenses={"R002:formal:깎아:깎>아"},
    )
    assert items[0].coda=="ㅌ" and items[1].onset=="ㅇ"
    assert traces[0].status=="conditional-disabled"

def test_section_15_sensitive_guard_does_not_block_unambiguous_vowel_ㅔ():
    items,traces=apply_ordered_rules(parse_syllables("밭에"),["R002"])
    assert items[0].coda==""
    assert items[1].onset=="ㅌ"
    assert traces[0].changed

def test_generic_liaison_does_not_preempt_section_17_palatalization():
    # Default pipeline runs R002 before R007. R002 must preserve the
    # context so a licensed formal-morpheme ㅣ can be palatalized later.
    for word, expected in {"같이": ("", "ㅊ"), "굳이": ("", "ㅈ")}.items():
        items,traces=apply_ordered_rules(
            parse_syllables(word),
            rule_licenses={f"R007:formal_morpheme_i:{word}:{word[:-1]}>{word[-1:]}"},
        )
        assert (items[0].coda,items[1].onset)==expected
        assert any(t.rule_id=="R007" and t.changed for t in traces)

    # Without morphology evidence, neither rule may guess the result.
    items,traces=apply_ordered_rules(parse_syllables("갇이"))
    assert items[0].coda=="ㄷ" and items[1].onset=="ㅇ"
    assert any(t.rule_id=="R002" and t.status=="conditional-disabled" for t in traces)
    assert any(t.rule_id=="R007" and t.status=="conditional-disabled" for t in traces)

def test_section_17_license_survives_default_rule_order_after_h_sequence():
    for word in ("굳히다","닫히다","묻히다"):
        items,traces=apply_ordered_rules(
            parse_syllables(word),
            rule_licenses={f"R007:dh_suffix_hi:{word}:{word[:1]}>{word[1:2]}"},
        )
        assert items[1].onset=="ㅊ", word
        assert any(t.rule_id=="R004" and t.changed for t in traces)
        assert any(t.rule_id=="R007" and t.changed for t in traces)

def test_section_17_license_is_exact_to_full_form_and_pair():
    # The old category-only token must no longer license an arbitrary form.
    items,traces=apply_ordered_rules(
        parse_syllables("갇이"),["R007"],
        rule_licenses={"R007:formal_morpheme_i"},
    )
    assert items[0].coda=="ㄷ" and items[1].onset=="ㅇ"
    assert traces[0].status=="conditional-disabled"

    # A license for 굳이 cannot be reused for 같이.
    items,traces=apply_ordered_rules(
        parse_syllables("같이"),["R007"],
        rule_licenses={"R007:formal_morpheme_i:굳이:굳>이"},
    )
    assert items[0].coda=="ㅌ" and items[1].onset=="ㅇ"
    assert traces[0].status=="conditional-disabled"

def test_sections_24_to_28_require_exact_full_form_and_pair_licenses():
    cases = [
        ("R010", "안고", "stem_n_m+suffix", "안>고", "ㄲ"),
        ("R011", "넓게", "stem_lb_lt+suffix", "넓>게", "ㄲ"),
        ("R012", "갈등", "sino_ryeon", "갈>등", "ㄸ"),
        ("R014", "문고리", "compound", "문>고", "ㄲ"),
    ]
    for rule, word, scope, pair, expected_onset in cases:
        items,traces=apply_ordered_rules(
            parse_syllables(word),[rule],
            rule_licenses={f"{rule}:{scope}"},
        )
        assert items[1].onset in {"ㄱ","ㄷ"}
        assert traces[0].status=="conditional-disabled"

        items,traces=apply_ordered_rules(
            parse_syllables(word),[rule],
            rule_licenses={f"{rule}:{scope}:{word}:{pair}"},
        )
        assert items[1].onset==expected_onset
        assert traces[0].changed

def test_section_27_adnominal_l_fortition_can_cross_a_word_boundary_only_with_phrase_evidence():
    items,traces=apply_ordered_rules(
        parse_syllables("할 것"),["R013"],boundary_mode="phrase",
        rule_licenses={"R013:adnominal_l:할 것:할>것"},
    )
    assert items[1].onset=="ㄲ"
    assert traces[0].changed

    items,traces=apply_ordered_rules(
        parse_syllables("할 것"),["R013"],boundary_mode="phrase",
        rule_licenses={"R013:adnominal_l:갈 데:갈>데"},
    )
    assert items[1].onset=="ㄱ"
    assert traces[0].status=="conditional-disabled"

def test_compound_fortition_license_cannot_be_reused_for_another_word():
    items,traces=apply_ordered_rules(
        parse_syllables("눈동자"),["R014"],
        rule_licenses={"R014:compound:문고리:문>고"},
    )
    assert items[1].onset=="ㄷ"
    assert traces[0].status=="conditional-disabled"

def test_default_pipeline_runs_licensed_h_deletion_before_liaison():
    items,traces=apply_ordered_rules(
        parse_syllables("많아"),
        rule_licenses={"R003:ending_or_suffix_h_deletion:많아:많>아"},
    )
    assert items[0].coda==""
    assert items[1].onset=="ㄴ"
    assert any(t.rule_id=="R003" and t.changed for t in traces)
    assert any(t.rule_id=="R002" and t.changed for t in traces)

def test_section_18_nasal_assimilation_applies_across_words_in_phrase_mode():
    items,traces=apply_ordered_rules(
        parse_syllables("밥 먹는다"),["R005"],boundary_mode="same_word",
    )
    assert items[0].coda=="ㅂ"
    # R005 may still change the coda inside 먹는다; the first word must remain untouched.
    assert items[0].coda=="ㅂ"

    items,traces=apply_ordered_rules(
        parse_syllables("밥 먹는다"),["R005"],boundary_mode="phrase",
    )
    assert items[0].coda=="ㅁ"
    assert traces[0].changed

def test_section_19_then_section_18_can_apply_across_phrase_boundary():
    items,traces=apply_ordered_rules(
        parse_syllables("협 력"),["R006","R005"],boundary_mode="phrase",
    )
    assert items[0].coda=="ㅁ"
    assert items[1].onset=="ㄴ"
    assert traces[0].changed and traces[1].changed

def test_section_10_general_complex_coda_and_balm_exception():
    # General ㄼ behavior retains ㄹ; the listed 밟- exception retains ㅂ.
    items, traces = apply_ordered_rules(parse_syllables("넓다"), ["R001"])
    assert items[0].coda == "ㄹ"
    assert traces[0].changed

    items, traces = apply_ordered_rules(parse_syllables("밟다"), ["R001"])
    assert items[0].coda == "ㅂ"
    assert traces[0].changed

def test_section_10_neolp_exception_is_narrowly_lexical():
    for word in ("넓죽하다", "넓둥글다"):
        items, _ = apply_ordered_rules(parse_syllables(word), ["R001"])
        assert items[0].coda == "ㅂ"
    items, _ = apply_ordered_rules(parse_syllables("넓다"), ["R001"])
    assert items[0].coda == "ㄹ"

def test_section_9_final_neutralization_covers_each_obstruent_class():
    cases = {
        "닦다": ("ㄲ", "ㄱ"),
        "키읔": ("ㅋ", "ㄱ"),
        "옷": ("ㅅ", "ㄷ"),
        "있다": ("ㅆ", "ㄷ"),
        "젖": ("ㅈ", "ㄷ"),
        "꽃": ("ㅊ", "ㄷ"),
        "솥": ("ㅌ", "ㄷ"),
        "앞": ("ㅍ", "ㅂ"),
    }
    for word, (written, expected) in cases.items():
        items, traces = apply_ordered_rules(parse_syllables(word), ["R001"])
        coda_items = [item for item in items if item.coda]
        assert coda_items[-1].coda == expected, word
        assert any(trace.changed for trace in traces), word

def test_section_18_nasal_assimilation_applies_across_phrase_boundaries():
    for phrase, expected in {
        "밥 먹는다": ("ㅁ", "ㅇ"),
        "값 매기다": ("ㅁ", "ㅁ"),
    }.items():
        items, traces = apply_ordered_rules(
            parse_syllables(phrase), ["R001", "R005"], boundary_mode="phrase"
        )
        assert items[0].coda == expected[0], phrase
        assert any(trace.changed for trace in traces), phrase

def test_section_11_complex_coda_neutralization_and_fortition_examples():
    cases = {
        "닭": ("ㄺ", "ㄱ", None),
        "흙과": ("ㄺ", "ㄱ", "ㄲ"),
        "늙지": ("ㄺ", "ㄱ", "ㅉ"),
        "읊고": ("ㄿ", "ㅂ", "ㄲ"),
        "읊다": ("ㄿ", "ㅂ", "ㄸ"),
    }
    for word, (written_coda, expected_coda, expected_onset) in cases.items():
        items, _ = apply_ordered_rules(parse_syllables(word), ["R001", "R008"])
        coda_items = [item for item in items if item.coda]
        assert coda_items[0].coda == expected_coda, word
        if expected_onset:
            assert items[-1].onset == expected_onset, word

def test_section_19_official_examples_feed_section_18_in_order():
    expected = {
        "막론": ("ㅇ", "ㄴ", True),
        "석류": ("ㅇ", "ㄴ", True),
        "협력": ("ㅁ", "ㄴ", True),
        "법리": ("ㅁ", "ㄴ", True),
        "침략": ("ㅁ", "ㄴ", False),
        "강릉": ("ㅇ", "ㄴ", False),
    }
    for word, (expected_coda, expected_onset, nasalizes_coda) in expected.items():
        items, traces = apply_ordered_rules(parse_syllables(word), ["R006", "R005"])
        assert items[0].coda == expected_coda, word
        assert items[1].onset == expected_onset, word
        assert traces[0].changed, word
        assert traces[1].changed is nasalizes_coda, word

def test_section_20_general_liquid_assimilation_examples():
    cases = {
        "천리": (("ㄹ", "ㄹ"),),
        "물난리": (("ㄹ", "ㄹ"), ("ㄹ", "ㄹ")),
        "줄넘기": (("ㄹ", "ㄹ"),),
        "할는지": (("ㄹ", "ㄹ"),),
        "닳는": (("ㄹ", "ㄹ"),),
        "뚫는": (("ㄹ", "ㄹ"),),
        "핥네": (("ㄹ", "ㄹ"),),
    }
    for word, expected_pairs in cases.items():
        items, traces = apply_ordered_rules(parse_syllables(word), ["R001", "R003", "R006"])
        for i, (expected_coda, expected_onset) in enumerate(expected_pairs):
            assert items[i].coda == expected_coda, word
            assert items[i + 1].onset == expected_onset, word
        assert any(trace.changed for trace in traces), word
