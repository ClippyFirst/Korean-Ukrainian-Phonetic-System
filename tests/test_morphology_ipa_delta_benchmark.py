from __future__ import annotations

import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

from benchmark_morphology_ipa_delta import _metrics, _score, evaluate  # noqa: E402


def test_score_uses_best_gold_variant_and_reference_length():
    result = _score("kʰa", "ka,kʰa")
    assert result["exact"] is True
    assert result["distance"] == 0
    assert result["reference_length"] == 3


def test_metrics_keep_coverage_separate_from_accuracy():
    metrics = _metrics([
        {"exact": True, "distance": 0, "reference_length": 2},
        {"exact": False, "distance": 1, "reference_length": 2},
    ], attempted=4)
    assert metrics["attempted_occurrences"] == 4
    assert metrics["scored_occurrences"] == 2
    assert metrics["coverage"] == 0.5
    assert metrics["exact_match_rate"] == 0.5
    assert metrics["character_error_rate"] == 0.25


def test_paired_benchmark_compares_strict_soft_and_keeps_morphology_separate(monkeypatch):
    import korean_ukrainian.pipeline as pipeline
    import korean_ukrainian.research_morphology as morphology

    def fake_phoneticize(word, morphology_mode="strict"):
        if word == "한국어":
            ipa = "han.gu.ɡʌ" if morphology_mode == "strict" else "han.ɡu.ʌ"
        else:
            ipa = "hak.kjo"
        return {
            "ipa": {"ipa": ipa},
            "pronunciation_status": "provisional",
            "ipa_status": "provisional",
            "unresolved_contexts": [],
            "rules": ([{"rule_id": "R002", "name": "liaison", "confidence": "low", "status": "heuristic",
                       "license_context": "R002:formal:한국어:국>어",
                       "before": [{"text": "한"}, {"text": "국"}, {"text": "어"}]}]
                      if morphology_mode == "soft" and word == "한국어" else []),
        }

    class FakeResult:
        def __init__(self, text):
            self.text = text

        def to_dict(self):
            parts = [self.text[:1], self.text[1:]] if self.text == "학교" else [self.text]
            return {
                "text": self.text, "analyzer": "kiwi", "status": "analyzed_not_adjudicated",
                "morphemes": [
                    {"form": part, "tag": "NNG", "start": self.text.index(part), "end": self.text.index(part) + len(part)}
                    for part in parts
                ],
            }

    class FakeAnalyzer:
        binding = "fake"

        def analyze(self, text):
            return FakeResult(text)

    monkeypatch.setattr(pipeline, "phoneticize_korean", fake_phoneticize)
    monkeypatch.setattr(morphology, "analyzer_by_name", lambda name: FakeAnalyzer())
    rows = [{
        "id": "r1", "lang": "ko", "split": "test",
        "tokens": [
            {"canonical": "학교", "phoneme": "hak.kjo"},
            {"canonical": "한국어", "phoneme": "han.gu.ɡʌ"},
        ],
    }]
    report = evaluate(rows, "kiwi")
    assert report["native_ipa"]["strict"]["exact_match_rate"] == 1.0
    assert report["native_ipa"]["soft"]["exact_match_rate"] == 0.5
    assert report["native_ipa"]["paired_subset"]["exact_rate_delta_soft_minus_strict"] == -0.5
    assert report["morphology"]["status"] == "completed_diagnostic"
    assert report["morphology"]["unique_words_analyzed"] == 2
    assert report["morphology"]["multi_morpheme_words"] == 1
    assert "no gold morphology labels" in report["morphology"]["interpretation"]
    assert "no analyzer output was injected into the IPA engine" in report["morphology"]["interpretation"]
    alignment = report["morphology"]["native_soft_rule_boundary_alignment"]
    assert alignment["events"] == 1
    assert alignment["boundary_observed"] == 0
    assert alignment["boundary_not_observed"] == 1
    assert report["morphology"]["results"][1]["native_soft_rule_boundary_events"][0]["pair"] == "国>어"
