import pytest
from korean_ukrainian.pipeline import phoneticize_korean

def test_basic_broad_ipa(): assert phoneticize_korean("가")["ipa"]["ipa"]=="ka"
def test_intervocalic_lenis_voicing(): assert "ɡ" in phoneticize_korean("아가")["ipa"]["ipa"]
def test_ipa_level_is_explicit(): assert phoneticize_korean("가",ipa_level="phonemic")["ipa"]["level"]=="phonemic"
def test_narrow_ipa_is_explicitly_partial_and_source_scoped():
    narrow = phoneticize_korean("사", ipa_level="narrow")["ipa"]
    assert narrow["ipa"] == "sʰa"
    assert narrow["level"] == "narrow"
    assert narrow["realization_status"] == "partial-narrow-sibilant-profile"
    assert narrow["transcription_profile"]["target_compatible"] is False

    # Default broad IPA remains stable; narrow is opt-in only.
    assert phoneticize_korean("사")["ipa"]["ipa"] == "sa"
    assert phoneticize_korean("시", ipa_level="narrow")["ipa"]["ipa"] == "ɕʰi"
    assert phoneticize_korean("쇼", ipa_level="narrow")["ipa"]["ipa"] == "sʰjo"


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


def test_nikl_section_24_source_backed_fortition_examples():
    expected = {"닮다": "tam.t͈a", "넘게": "nʌm.k͈e"}
    for word, ipa in expected.items():
        result = phoneticize_korean(word)
        assert result["ipa"]["ipa"] == ipa, word
        assert any(
            trace.get("rule_id") == "R010"
            and trace.get("license_context") == f"R010:stem_n_m+suffix:{word}:{word[0]}>" + word[1]
            for trace in result["rules"]
        ), word


def test_broad_ipa_absorbs_yod_after_palatal_affricates():
    from korean_ukrainian.ipa import realize_syllables
    from korean_ukrainian.phonology import parse_syllables

    expected = {"져": "tɕʌ", "쪄": "tɕ͈ʌ", "쳐": "tɕʰʌ"}
    phonemic_expected = {"져": "tɕjʌ", "쪄": "tɕ͈jʌ", "쳐": "tɕʰjʌ"}
    for word, ipa in expected.items():
        assert realize_syllables(parse_syllables(word), level="broad")["ipa"] == ipa
        # The phonemic layer preserves the underlying glide; only broad
        # surface IPA applies NIKL Standard Pronunciation Rule 5's exception.
        assert realize_syllables(parse_syllables(word), level="phonemic")["ipa"] == phonemic_expected[word]


def test_yod_absorption_fixes_benchmark_mismatches():
    expected = {
        "던져주다": "tʌn.dʑʌ.dʑu.da",
        "쳐먹고": "tɕʰʌ.mʌk̚.k͈o",
        "빠져": "p͈a.dʑʌ",
    }
    for word, ipa in expected.items():
        assert phoneticize_korean(word)["ipa"]["ipa"] == ipa, word


def test_python_ipa_results_expose_a_versioned_profile_contract():
    expected = {
        "phonemic": ("clippyfirst-korean-phonemic-v1", "phonemic"),
        "broad": ("clippyfirst-korean-broad-v1", "broad"),
        "narrow": ("clippyfirst-korean-narrow-partial-sibilant-nasal-h-v3", "narrow"),
    }
    for level, (profile_id, profile_level) in expected.items():
        result = phoneticize_korean("씨", ipa_level=level)["ipa"]
        assert result["ipa_profile"] == profile_id
        assert result["ipa_profile_version"] == (3 if level == "narrow" else 1)
        assert result["ipa_profile_level"] == profile_level
        assert result["ipa_profile_status"] == (
            "partial-research-only" if level == "narrow"
            else "unadjudicated-cross-runtime"
        )


def test_python_broad_profile_uses_the_shared_unadjudicated_fixture():
    import json
    from pathlib import Path

    fixture = json.loads(
        (Path(__file__).parent / "fixtures" / "korean-ipa-profile-pairs-2026-10-27.json")
        .read_text(encoding="utf-8")
    )
    assert fixture["adjudication_status"] == "UNADJUDICATED"
    assert fixture["target_adapter_eligibility"] == "UNVERIFIED"
    for item in fixture["cases"]:
        result = phoneticize_korean(item["source"], ipa_level="broad")["ipa"]
        assert result["ipa"] == item["python_broad_ipa"], item["source"]

def test_narrow_nasal_glide_rule_is_scoped_and_does_not_leak_to_broad_ipa():
    # Teacher-guided candidate is narrow/research-only: [ɲ] before selected
    # glide nuclei, not a general replacement for Korean onset /n/.
    narrow_expected = {
        "냐": "ɲja",
        "얘": "jɛ",  # no onset ㄴ: must not synthesize a nasal
        "녀": "ɲjʌ",
        "녜": "ɲje",
        "뇨": "ɲjo",
        "뉴": "ɲju",
    }
    for word, expected in narrow_expected.items():
        assert phoneticize_korean(word, ipa_level="narrow")["ipa"]["ipa"] == expected

    # Negative controls: /n/ before ㅣ and a non-glide context stays [n].
    assert phoneticize_korean("니", ipa_level="narrow")["ipa"]["ipa"] == "ni"
    assert phoneticize_korean("난", ipa_level="narrow")["ipa"]["ipa"] == "nan"

    # The research allophone must not leak into broad or phonemic output.
    assert phoneticize_korean("냐", ipa_level="broad")["ipa"]["ipa"] == "nja"
    assert phoneticize_korean("냐", ipa_level="phonemic")["ipa"]["ipa"] == "nja"

def test_narrow_h_voicing_after_sonorant_coda_is_scoped_and_not_target_approved():
    # Peer-reviewed work reports optional voicing/weakening/deletion after
    # sonorants. This profile selects [ɦ] as one research realization; it does
    # not claim that all speakers obligatorily voice /h/ in these contexts.
    expected = {
        "감히": "kam.ɦi",
        "간호원": "kan.ɦo.wʌn",
        "영화": "jʌŋ.ɦwa",
    }
    for word, ipa in expected.items():
        result = phoneticize_korean(word, ipa_level="narrow")["ipa"]
        assert result["ipa"] == ipa, word
        assert result["transcription_profile"]["target_compatible"] is False

    # Negative controls: no preceding sonorant coda, or a word boundary.
    assert phoneticize_korean("아하", ipa_level="narrow")["ipa"]["ipa"] == "a.ha"
    assert phoneticize_korean("감 하", ipa_level="narrow")["ipa"]["ipa"] == "kam ha"

    # The default broad and underlying phonemic representations remain stable.
    assert phoneticize_korean("감히", ipa_level="broad")["ipa"]["ipa"] == "kam.hi"
    assert phoneticize_korean("감히", ipa_level="phonemic")["ipa"]["ipa"] == "kam.hi"

