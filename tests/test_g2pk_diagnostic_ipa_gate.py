"""Regression: unresolved lexical IPA must never be accepted as Ukrainian output."""
from korean_ukrainian import g2pk_engine, pipeline


def test_g2pk_cannot_promote_diagnostic_only_lexical_ipa_to_ukrainian_output(monkeypatch):
    class IncorrectG2p:
        def __call__(self, text, descriptive=False):
            return text

    # Inject the status contract explicitly: the live lexical row for 삶의 is
    # provisional, not diagnostic-only, so it must not be used as a fake gold
    # fixture for this guard.
    monkeypatch.setattr(g2pk_engine, "_ENGINE", IncorrectG2p())
    monkeypatch.setattr(
        pipeline,
        "LEXICAL_PRONUNCIATIONS",
        {
            "삶의": {
                "input": "삶의",
                "surface_hangul": "삶의",
                "ipa_syllables": "sal|mi",
                "ipa_adjudication_status": "diagnostic_only_unresolved_pronunciation",
                "rule_notes": "test fixture: unresolved IPA context",
            }
        },
    )

    pronunciation = g2pk_engine.phoneticize_with_g2pk("삶의")
    assert pronunciation["ipa_is_diagnostic_only"] is True
    assert pronunciation["ipa"]["status"] == "diagnostic_only_unresolved_pronunciation"
    assert pronunciation["ipa"]["word_analyses"][0]["is_diagnostic_only"] is True

    rendered = g2pk_engine.transliterate_with_g2pk("삶의")
    assert rendered["ukrainian_orthography"] is None
    assert rendered["target_status"] == "unavailable"
    assert rendered["unavailable_reasons"] == ["diagnostic_ipa_not_accepted"]
