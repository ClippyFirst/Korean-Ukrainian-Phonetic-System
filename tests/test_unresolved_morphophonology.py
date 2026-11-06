"""Evidence-gated regression tests for previously unresolved Korean forms."""
from korean_ukrainian.pipeline import phoneticize_korean


def test_nikl_attested_particle_readings_for_salmui_are_explicit_variants():
    word = "\uc0b6\uc758"
    result = phoneticize_korean(word)
    assert result["surface_hangul"] == "\uc0b4\ubbdc"
    assert result["ipa"]["ipa"] == "sal.mi"
    assert result["ipa"]["lexical_alternatives"] == [{
        "input": word,
        "surface_hangul": "\uc0b4\uba54",
        "ipa": "sal.me",
        "status": "diagnostic_only_unresolved_pronunciation",
        "source": "https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5716&mn_id=217&pageIndex=225",
    }]
    assert result["pronunciation_status"] == "unresolved"
    assert result["ipa_is_diagnostic_only"] is True
    assert result["ipa_status"] == "diagnostic_only_unresolved_pronunciation"
    assert result["ipa_status_reason"] == "independent_ipa_adjudication_required"
    assert any(
        item["rule_id"] == "IPA_ADJUDICATION"
        and item["status"] == "unresolved-ipa-adjudication"
        for item in result["unresolved_contexts"]
    )
    assert any(
        trace.get("rule_id") == "LEXICON"
        and trace.get("status") == "lexical-override"
        and "mcfaq_seq=5716" in trace.get("source", "")
        for trace in result["rules"]
    )
    from korean_ukrainian.pipeline import transliterate_korean
    target = transliterate_korean(word)
    assert target["ukrainian_orthography"] is None
    assert target["target_status"] == "unresolved"
    assert target["ipa_is_diagnostic_only"] is True
    assert target["lexical_target_reference"] == "салмі"
    assert target["lexical_target_comparison"] == "unavailable_without_ipa_target"


def test_nikl_rule_14_formal_liaison_licenses_attested_inflectional_forms_only():
    expected = {
        "\uc549\uc544\ub77c": ("\uc548\uc790\ub77c", "an.d\u0291a.\u027ea"),
        "\uc5c6\uc5b4\ub3c4": ("\uc5c5\uc368\ub3c4", "\u028cp\u031a.s\u0348\u028c.do"),
    }
    for word, (surface, ipa) in expected.items():
        result = phoneticize_korean(word)
        assert result["surface_hangul"] == surface, word
        assert result["ipa"]["ipa"] == ipa, word
        assert result["pronunciation_status"] == "provisional", word
        assert result["unresolved_contexts"] == [], word
        assert any(
            trace.get("rule_id") == "R002"
            and trace.get("changed")
            and trace.get("license_context", "").startswith("R002:formal:")
            for trace in result["rules"]
        ), word


def test_exact_form_licenses_do_not_spread_to_unattested_lookalikes():
    for word in ("\uc549\uc5b4\ub77c", "\uc5c6\uc5b4\ub450"):
        result = phoneticize_korean(word)
        assert result["pronunciation_status"] == "unresolved", word
        assert result["ipa_is_diagnostic_only"] is True, word
        assert result["unresolved_contexts"], word


def test_compact_user_text_does_not_silently_invent_word_boundaries():
    for compact, spaced in (
        ("\ub9ce\uc774\ubcf8", "\ub9ce\uc774 \ubcf8"),
        ("\uc88b\uc544\ubcf4\uc778\ub2e4\uace0", "\uc88b\uc544 \ubcf4\uc778\ub2e4\uace0"),
    ):
        compact_result = phoneticize_korean(compact)
        spaced_result = phoneticize_korean(spaced)
        # Exact local morphology licenses the internal pair, but the engine
        # must not invent an eojeol space in the compact source orthography.
        assert compact_result["pronunciation_status"] != "unresolved", compact
        assert compact_result["ipa_is_diagnostic_only"] is False, compact
        assert " " not in compact_result["surface_hangul"], compact
        assert spaced_result["pronunciation_status"] != "unresolved", spaced
        assert spaced_result["ipa_is_diagnostic_only"] is False, spaced
        assert " " in spaced_result["surface_hangul"], spaced



def test_broad_seoul_korean_ipa_does_not_add_english_style_lexical_stress():
    # Seoul Korean prominence is organized at prosodic-phrase level, not as
    # English-style lexical stress. Phrase tones/boundaries are a separate layer.
    for word in ("사람", "많이", "괴성", "모르다", "대한민국"):
        result = phoneticize_korean(word)
        assert result["ipa"]["ipa_profile_level"] == "broad"
        assert "ˈ" not in result["ipa"]["ipa"], word



def test_c09_source_backed_people_and_moreuda_keep_lexical_length_in_broad_ipa():
    expected = {
        "사람": ("사람", "saː.ɾam"),
        "모르다": ("모르다", "moː.ɾɯ.da"),
        "괴성": ("괴성", "køː.sʌŋ"),
    }
    for word, (surface, ipa) in expected.items():
        result = phoneticize_korean(word)
        assert result["surface_hangul"] == surface
        assert result["ipa"]["ipa"] == ipa
        assert result["ipa"]["level"] == "broad"
        assert result["ipa_status"] == "provisional"
        assert result["pronunciation_status"] == "provisional"
        assert result["unresolved_contexts"] == []
    gweseong = phoneticize_korean("괴성")
    assert gweseong["ipa"]["lexical_alternatives"][0]["ipa"] == "kweː.sʌŋ"

def test_actual_native_abstentions_are_recovered_or_remain_ipa_gated():
    # Four exact corpus forms now have morphology licenses. Their IPA is
    # inspectable and provisional; it is not independent gold. 삶의 remains
    # blocked because official Hangul variants do not adjudicate IPA.
    cases = ("칡칡이", "쫒아내면", "많앗구나유유유", "무서웟어")
    for word in cases:
        result = phoneticize_korean(word)
        assert result["pronunciation_status"] == "provisional", word
        assert result["ipa"]["ipa"], word
        assert result["ipa_is_diagnostic_only"] is False, word
        assert result["unresolved_contexts"] == [], word

    life = phoneticize_korean("삶의")
    assert life["pronunciation_status"] == "unresolved"
    assert life["ipa_is_diagnostic_only"] is True
    assert life["ipa_status"] == "diagnostic_only_unresolved_pronunciation"
    assert any(item["rule_id"] == "IPA_ADJUDICATION" for item in life["unresolved_contexts"])
