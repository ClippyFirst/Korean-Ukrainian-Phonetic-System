from korean_ukrainian.pipeline import phoneticize_korean, transliterate_korean
from korean_ukrainian.ipa import realize_syllables
from korean_ukrainian.phonology import parse_syllables


def _ipa(word: str, level: str) -> dict:
    return phoneticize_korean(word, ipa_level=level)["ipa"]


def test_broad_ipa_contract_is_unchanged():
    assert _ipa("사", "broad")["ipa"] == "sa"
    assert _ipa("시", "broad")["ipa"] == "si"


def test_narrow_profile_aspirates_lenis_sibilant_without_changing_broad():
    narrow = _ipa("사", "narrow")
    assert narrow["ipa"] == "sʰa"
    assert narrow["level"] == "narrow"
    assert narrow["transcription_profile"]["name"] == "korean-narrow-contextual-allophones-v16"
    assert narrow["ipa_profile_version"] == 15
    assert narrow["transcription_profile"]["target_compatible"] is False
    assert narrow["transcription_profile"]["limitations"]


def test_narrow_profile_palatalizes_sibilants_only_in_reviewed_contexts():
    assert _ipa("시", "narrow")["ipa"] == "ɕʰi"
    assert _ipa("샤", "narrow")["ipa"] == "ɕʰja"
    assert _ipa("셰", "narrow")["ipa"] == "ɕʰje"
    # Kang (2010) reports a distinct spectral pattern for /yu, yo/ and
    # does not license a generalization to other /j/-initial nuclei.
    assert _ipa("쇼", "narrow")["ipa"] == "sʰjo"
    assert _ipa("슈", "narrow")["ipa"] == "sʰju"
    assert _ipa("섀", "narrow")["ipa"] == "sʰjɛ"


def test_narrow_profile_palatalizes_n_before_glide_nuclei_but_not_before_i():
    assert _ipa("녀", "narrow")["ipa"] == "ɲjʌ"
    assert _ipa("냐", "narrow")["ipa"] == "ɲja"
    assert _ipa("뉴", "narrow")["ipa"] == "ɲju"
    # The rule is scoped to glide-initial nuclei, not generalized to /i/.
    assert _ipa("니", "narrow")["ipa"] == "ni"
    assert _ipa("난", "narrow")["ipa"] == "nan"
    # Broad IPA and the production-default profile remain unchanged.
    assert _ipa("녀", "broad")["ipa"] == "njʌ"



def test_rounded_front_vowel_exposes_position_conditioned_glides_and_sibilant_interaction():
    initial = _ipa("위", "narrow")
    assert initial["ipa"] == "y"
    initial_variant = next(item for item in initial["variants"] if item["ipa"] == "wi")
    assert initial_variant["selected"] is False
    assert initial_variant["evidence_status"] == "source-scoped-position-conditioned-variant-only"

    postconsonantal = _ipa("귀", "narrow")
    assert postconsonantal["ipa"] == "ky"
    glide_variant = next(item for item in postconsonantal["variants"] if item["ipa"] == "kɥi")
    assert glide_variant["selected"] is False
    assert "postconsonantal" in glide_variant["environment"]

    interaction = _ipa("쉽다", "narrow")
    assert interaction["ipa"] == "sʰyp̚.t͈a"
    combined = next(item for item in interaction["variants"] if item["ipa"] == "ɕʰɥip̚.t͈a")
    assert combined["selected"] is False
    assert combined["evidence_status"] == "source-scoped-iterative-palatalization-candidate-only"
    assert "iterative s-palatalization" in combined["environment"]
    assert any("10.1017/9781108292351" in ref for ref in combined["evidence_refs"])

def test_tense_sibilant_is_not_aspirated_and_palatalization_is_not_assumed():
    assert _ipa("싸", "narrow")["ipa"] == "s͈a"
    # Evidence for tense /s͈/ palatalization is mixed; do not infer it from
    # the teacher's outputs or generalize the lenis /s/ rule.
    assert _ipa("쌰", "narrow")["ipa"] == "s͈ja"


def test_narrow_profile_is_explicitly_partial_and_does_not_change_target_default():
    narrow = _ipa("사", "narrow")
    broad = _ipa("사", "broad")
    assert narrow["realization_status"] == "partial-narrow-research-profile"
    assert broad["ipa"] == "sa"
    assert broad.get("transcription_profile") is None



def test_partial_narrow_profile_is_not_accepted_as_ukrainian_target_input():
    result = transliterate_korean("사", ipa_level="narrow")
    assert result["target_status"] == "unavailable"
    assert result["target_unavailable_reason"] == "narrow_ipa_profile_not_target_compatible"
    assert result["ukrainian_orthography"] is None


def test_python_broad_fortis_sibilant_baseline_is_not_browser_profile_gold():
    # Python's broad profile currently emits s͈ before ㅣ; the browser's legacy
    # contextual profile emits ɕ͈. This records the Python side only and does
    # not adjudicate which profile is correct or enable target adaptation.
    assert _ipa("씨", "broad")["ipa"] == "s͈i"
    assert _ipa("싸", "broad")["ipa"] == "s͈a"

def test_narrow_seoul_h_and_intervocalic_liquid_tap_are_contextual():
    assert _ipa("아하", "narrow")["ipa"] == "a.ɦa"
    assert _ipa("아히", "narrow")["ipa"] == "a.ʝi"
    assert _ipa("으흐", "narrow")["ipa"] == "ɯ.ɣɯ"
    assert _ipa("오호", "narrow")["ipa"] == "o.βo"
    assert _ipa("하", "narrow")["ipa"] == "ha"
    assert _ipa("히", "narrow")["ipa"] == "çi"
    assert _ipa("후", "narrow")["ipa"] == "ɸʷu"
    assert _ipa("호", "narrow")["ipa"] == "ɸʷo"
    assert _ipa("흐", "narrow")["ipa"] == "xɯ"
    assert _ipa("아후", "narrow")["ipa"] == "a.βu"
    assert _ipa("아 후", "narrow")["ipa"] == "a ɸʷu"
    # Crosby & Dalola (2021): 99.3% of intervocalic liquids in their
    # 12-speaker Standard Korean sample were taps; do not emit [ɭ] here.
    assert _ipa("나라", "narrow")["ipa"] == "na.ɾa"
    assert _ipa("다리", "narrow")["ipa"] == "ta.ɾi"
    assert _ipa("물론", "narrow")["ipa"] == "mul.lon"
    variant = next(item for item in _ipa("나라", "narrow")["variants"] if item["ipa"] == "na.ɭa")
    assert variant["layer"] == "narrow"
    assert variant["selected"] is False
    assert variant["evidence_status"] == "conflicting-source-descriptions-variant-only"
    assert len(variant["evidence_refs"]) == 2
    assert _ipa("하", "narrow")["ipa"] == "ha"
    assert _ipa("가을", "narrow")["ipa"] == "ka.ɯl"

def test_post_sonorant_h_is_not_forced_to_voiced_allophone_without_token_evidence():
    result = _ipa("안하", "narrow")
    assert result["ipa"] == "an.ha"
    assert "ɦ" not in result["ipa"]
    assert any("unresolved" in item.lower()
               for item in result["transcription_profile"]["limitations"])


def test_coda_retroflexion_is_exposed_only_as_a_speaker_conditioned_variant():
    final = _ipa("팔", "narrow")
    assert final["ipa"] == "pʰal"
    variant = next(item for item in final["variants"] if item["ipa"] == "pʰaɭ")
    assert variant["layer"] == "narrow"
    assert variant["selected"] is False
    assert variant["evidence_status"] == "speaker-conditioned-sociophonetic-variant-only"
    assert "https://doi.org/10.20405/kl.2024.02.102.63" in variant["evidence_refs"]
    assert "word-final" in variant["environment"]

    pre_h = realize_syllables(parse_syllables("말하"), level="narrow")
    assert pre_h["ipa"] == "mal.ha"
    pre_h_variant = next(item for item in pre_h["variants"] if item["ipa"] == "maɭ.ha")
    assert pre_h_variant["selected"] is False
    assert "before /h/" in pre_h_variant["note"]


def test_coda_retroflex_variant_does_not_leak_into_non_triggering_contexts():
    result = realize_syllables(parse_syllables("팔이"), level="narrow")
    assert result["ipa"] == "pʰal.i"
    assert not any("coda ㄹ" in item.get("vowels", [""])[0] for item in result["variants"])


def test_preconsonantal_coda_lateral_has_a_separate_unselected_retroflex_candidate():
    result = realize_syllables(parse_syllables("물론"), level="narrow")
    assert result["ipa"] == "mul.lon"
    variant = next(item for item in result["variants"] if item["ipa"] == "muɭ.lon")
    assert variant["selected"] is False
    assert variant["evidence_status"] == "speaker-conditioned-sociophonetic-variant-only"
    assert "preconsonantal" in variant["note"]
    assert any("10.3765/plsa.v6i1.5002" in ref for ref in variant["evidence_refs"])


def test_geminate_lateral_before_high_front_vocoid_exposes_optional_palatalization():
    result = realize_syllables(parse_syllables("빨리"), level="narrow")
    assert result["ipa"] == "p͈al.li"
    variant = next(item for item in result["variants"] if item["ipa"] == "p͈al.lʲi")
    assert variant["selected"] is False
    assert variant["evidence_status"] == "gradient-coarticulation-candidate-variant-only"
    assert any("10.3765/plsa.v6i1.5002" in ref for ref in variant["evidence_refs"])



def test_geminate_lateral_exposes_cited_palatal_and_combined_coda_onset_variants():
    result = _ipa("올린", "narrow")
    assert result["ipa"] == "ol.lin"
    palatal = next(item for item in result["variants"] if item["ipa"] == "ol.ʎin")
    assert palatal["selected"] is False
    assert palatal["evidence_status"] == "source-cited-palatal-lateral-variant-only"
    combined = next(item for item in result["variants"] if item["ipa"] == "oɭ.ʎin")
    assert combined["selected"] is False
    assert combined["evidence_status"] == "source-scoped-interaction-hypothesis-only"
    assert combined["syllable_indices"] == [0, 1]
    assert any("10.3765/plsa.v6i1.5002" in ref for ref in combined["evidence_refs"])
    assert any("10.20405/kl.2024.02.102.63" in ref for ref in combined["evidence_refs"])

def test_coda_nasal_palatalization_before_affricates_is_optional_only():
    result = realize_syllables(parse_syllables("군주"), level="narrow")
    assert result["ipa"] == "kun.dʑu"
    by_ipa = {item["ipa"]: item for item in result["variants"]}
    assert "kuɲ.dʑu" in by_ipa
    assert "kunj.dʑu" in by_ipa
    for variant in (by_ipa["kuɲ.dʑu"], by_ipa["kunj.dʑu"]):
        assert variant["selected"] is False
        assert variant["evidence_status"] == "secondary-description-candidate-only"
        assert "same-word coda ㄴ before alveopalatal affricate" in variant["environment"]
        assert any("1324541" in ref for ref in variant["evidence_refs"])


def test_word_final_coda_stops_expose_unreleased_candidates_without_selecting_them():
    for word, primary, candidate in (("낫", "nat̚", "nat"), ("밖", "pak̚", "pak"), ("밥", "pap̚", "pap"), ("닭", "tak̚", "tak"), ("값", "kap̚", "kap")):
        parsed = parse_syllables(word)
        result = realize_syllables(parsed, level="narrow")
        broad = realize_syllables(parsed, level="broad")
        assert result["ipa"] == primary
        assert broad["ipa"] == primary
        variant = next(item for item in result["variants"] if item["ipa"] == candidate)
        assert variant["selected"] is False
        assert variant["evidence_status"] == "source-scoped-release-variation-candidate-only"
        assert "optional released" in variant["environment"]
        assert any("10.1006/JPHO.1996.0016" in ref for ref in variant["evidence_refs"])
        assert any("10.13064/ksss.2026.18.1.021" in ref for ref in variant["evidence_refs"])

    nonfinal = realize_syllables(parse_syllables("낫다"), level="narrow")
    assert not any(item["evidence_status"] == "source-scoped-release-variation-candidate-only"
                   for item in nonfinal["variants"])
