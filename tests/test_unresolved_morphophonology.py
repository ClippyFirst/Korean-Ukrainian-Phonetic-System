"""Evidence-gated regression tests for previously unresolved Korean forms."""
from korean_ukrainian.pipeline import phoneticize_korean


def test_nikl_attested_particle_readings_for_salmui_are_explicit_variants():
    word = "\uc0b6\uc758"
    result = phoneticize_korean(word)
    assert result["surface_hangul"] == "\uc0b4\ubbe0"
    assert result["ipa"]["ipa"] == "sal.m\u0270i"
    assert result["pronunciation_status"] == "provisional"
    assert result["unresolved_contexts"] == []
    assert any(
        trace.get("rule_id") == "LEXICON"
        and trace.get("status") == "lexical-override"
        and "mcfaq_seq=5716" in trace.get("source", "")
        for trace in result["rules"]
    )


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
        assert compact_result["pronunciation_status"] == "unresolved", compact
        assert compact_result["ipa_is_diagnostic_only"] is True, compact
        assert spaced_result["pronunciation_status"] != "unresolved", spaced
        assert spaced_result["ipa_is_diagnostic_only"] is False, spaced
