"""Regression: g2pK must not import Kozak Kim's NIKL lexical/IPA overlays."""
from korean_ukrainian import g2pk_engine, pipeline


def test_g2pk_does_not_import_kozak_nikl_surface_or_diagnostic_ipa_overlays(monkeypatch):
    class G2pSurfaceMatch:
        def __call__(self, text, descriptive=False):
            # The fake external engine deliberately returns the same surface
            # stored in the NIKL-backed Kozak Kim row. Matching must not cause
            # the optional g2pK adapter to import that row's IPA or status.
            return "살믜" if text == "삶의" else text

    assert pipeline.LEXICAL_PRONUNCIATIONS["삶의"]["ipa_adjudication_status"] == (
        "diagnostic_only_unresolved_pronunciation"
    )
    monkeypatch.setattr(g2pk_engine, "_ENGINE", G2pSurfaceMatch())

    pronunciation = g2pk_engine.phoneticize_with_g2pk("삶의")
    assert pronunciation["surface_hangul"] == "살믜"
    assert pronunciation["ipa_is_diagnostic_only"] is False
    assert pronunciation["ipa"]["status"] == "ipa-derived-from-g2pk-surface-form"
    assert pronunciation["ipa"]["lexical_overrides"] == []
    assert pronunciation["ipa"]["word_analyses"][0]["status"] == "derived-from-surface"
    assert [rule["name"] for rule in pronunciation["rules"]] == ["external-g2pK-pronunciation"]
