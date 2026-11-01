from __future__ import annotations

import sys
from types import SimpleNamespace


def test_sentence_comparison_uses_full_sentence_for_native_and_g2pk(monkeypatch):
    from scripts.benchmark_native_vs_g2pk_ko import evaluate_sentences

    native_calls = []
    g2pk_calls = []

    def fake_phoneticize(text, *, boundary_mode="same_word"):
        native_calls.append((text, boundary_mode))
        return {
            "pronunciation_status": "resolved",
            "ipa": {"ipa": "ka.na"},
        }

    class FakeG2p:
        def __call__(self, text):
            g2pk_calls.append(text)
            return "가 나"

    monkeypatch.setattr("korean_ukrainian.pipeline.phoneticize_korean", fake_phoneticize)
    monkeypatch.setitem(sys.modules, "g2pk", SimpleNamespace(G2p=FakeG2p))

    rows = [{
        "id": "sentence_1",
        "lang": "ko",
        "split": "test",
        "canonical": "가, 나!",
        "phonemes": "ka na",
        "tokens": [],
    }]

    report = evaluate_sentences(rows, boundary_mode="phrase")

    assert native_calls == [("가 나", "phrase")]
    assert g2pk_calls == ["가 나"]
    assert report["native_engine"]["scored_sentences"] == 1
    assert report["g2pk"]["scored_sentences"] == 1
    assert report["paired_subset"]["sentences_scored_by_both"] == 1
    assert report["paired_subset"]["exact_match_rate_delta_g2pk_minus_native"] == 0.0
    assert report["paired_subset"]["cer_delta_g2pk_minus_native"] == 0.0
