"""Regression: unresolved lexical IPA must never be accepted as Ukrainian output."""
from korean_ukrainian import g2pk_engine, pipeline


def test_g2pk_cannot_promote_diagnostic_only_lexical_ipa_to_ukrainian_output(monkeypatch):
    class G2pSurfaceMatch:
        def __call__(self, text, descriptive=False):
            # Deliberately match the sourced Hangul surface so the test proves
            # the diagnostic-only status, not a surface mismatch, blocks override.
            return "살믜" if text == "삶의" else text

    # The base lexical row is target-provisional; the dated IPA-adjudication
    # overlay explicitly marks its project-derived IPA as diagnostic-only.
    assert pipeline.LEXICAL_PRONUNCIATIONS["삶의"]["ipa_adjudication_status"] == (
        "diagnostic_only_unresolved_pronunciation"
    )
    monkeypatch.setattr(g2pk_engine, "_ENGINE", G2pSurfaceMatch())

    pronunciation = g2pk_engine.phoneticize_with_g2pk("삶의")
    assert pronunciation["ipa_is_diagnostic_only"] is True
    assert pronunciation["ipa"]["status"] == "diagnostic_only_unresolved_pronunciation"
    assert pronunciation["ipa"]["surface_hangul"] == "살믜"
    assert pronunciation["ipa"]["word_analyses"][0]["is_diagnostic_only"] is True

    rendered = g2pk_engine.transliterate_with_g2pk("삶의")
    assert rendered["ukrainian_orthography"] is None
    assert rendered["target_status"] == "unavailable"
    assert rendered["unavailable_reasons"] == ["diagnostic_ipa_not_accepted"]
