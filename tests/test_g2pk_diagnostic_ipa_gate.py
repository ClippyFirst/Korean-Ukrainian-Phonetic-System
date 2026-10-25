"""Regression: unresolved lexical IPA must never be accepted as Ukrainian output."""
from korean_ukrainian import g2pk_engine


def test_g2pk_cannot_promote_diagnostic_only_lexical_ipa_to_ukrainian_output(monkeypatch):
    class IncorrectG2p:
        def __call__(self, text, descriptive=False):
            return text

    monkeypatch.setattr(g2pk_engine, "_ENGINE", IncorrectG2p())
    input_text = "삶의"
    pronunciation = g2pk_engine.phoneticize_with_g2pk(input_text)
    assert pronunciation["ipa_is_diagnostic_only"] is True
    assert pronunciation["ipa"]["status"] == "diagnostic_only_unresolved_pronunciation"
    assert pronunciation["ipa"]["word_analyses"][0]["is_diagnostic_only"] is True

    rendered = g2pk_engine.transliterate_with_g2pk(input_text)
    assert rendered["ukrainian_orthography"] is None
    assert rendered["target_status"] == "unavailable"
    assert rendered["unavailable_reasons"] == ["diagnostic_ipa_not_accepted"]
