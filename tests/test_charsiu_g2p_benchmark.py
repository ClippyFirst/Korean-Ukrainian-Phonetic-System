from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "benchmark_charsiu_g2p.py"
sys.path.insert(0, str(SCRIPT.parent))
SPEC = importlib.util.spec_from_file_location("benchmark_charsiu_g2p", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def test_neural_score_uses_existing_broad_ipa_normalization():
    score = MODULE.score_prediction("kʰa", "kʰa")
    assert score["exact"] is True
    assert score["distance"] == 0


def test_evaluate_keeps_occurrences_and_reports_coverage_separately():
    rows = [{
        "id": "row-1",
        "lang": "ko",
        "split": "test",
        "text": "가 나",
        "canonical": "가 나",
        "phonemes": "ka na",
        "tokens": [
            {"canonical": "가", "phoneme": "ka"},
            {"canonical": "나", "phoneme": "na"},
            {"canonical": "가", "phoneme": "ka"},
        ],
    }]
    report = MODULE.evaluate(rows, {"가": "ka"})
    assert report["eligible_occurrences"] == 3
    assert report["unique_words"] == 2
    assert report["scored_occurrences"] == 2
    assert report["coverage"] == 0.666667
    assert report["exact_matches"] == 2
    assert report["missing_predictions"] == 1
    assert [x["occurrence_id"] for x in report["predictions"]] == [0, 2]


def test_empty_or_unusable_gold_is_rejected():
    try:
        MODULE.score_prediction("ka", " , ")
    except ValueError as exc:
        assert "no non-empty variants" in str(exc)
    else:
        raise AssertionError("empty gold must not score as a success")


def test_word_only_contract_filters_non_hangul_and_multitoken():
    rows = [{
        "id": "row-1", "lang": "ko", "split": "test", "text": "가 ABC 가 나",
        "canonical": "가 ABC 가 나", "phonemes": "", "tokens": [
            {"canonical": "가", "phoneme": "ka"},
            {"canonical": "ABC", "phoneme": "eɪ bi si"},
            {"canonical": "가 나", "phoneme": "ka na"},
        ],
    }]
    occurrences, words = MODULE.eligible_occurrences(rows)
    assert len(occurrences) == 1
    assert words == ["가"]


def test_paired_comparison_uses_same_occurrence_denominator_and_reports_abstentions():
    rows = [{
        "id": "row-1", "lang": "ko", "split": "test", "text": "가 나 가",
        "canonical": "가 나 가", "phonemes": "ka na ka", "tokens": [
            {"canonical": "가", "phoneme": "ka"},
            {"canonical": "나", "phoneme": "na"},
            {"canonical": "가", "phoneme": "ka"},
        ],
    }]
    neural = {"가": "ka", "나": "na"}
    baselines = {
        "clippyfirst_native": {
            "가": {"status": "scored", "ipa": "ka"},
            "나": {"status": "abstained", "reason": "unresolved context"},
        },
        "g2pk_0_9_4": {
            "가": {"status": "scored", "ipa": "ka"},
            "나": {"status": "scored", "ipa": "na"},
        },
    }
    report = MODULE.compare_baselines(rows, neural, baselines)
    assert report["charsiu_byt5"]["eligible_occurrences"] == 3
    assert report["charsiu_byt5"]["scored_occurrences"] == 3
    assert report["clippyfirst_native"]["scored_occurrences"] == 2
    assert report["clippyfirst_native"]["coverage"] == 0.666667
    assert report["paired_comparisons"]["clippyfirst_native"]["common_scored_occurrences"] == 2
    assert report["paired_comparisons"]["g2pk_0_9_4"]["common_scored_occurrences"] == 3
    assert len(report["per_occurrence"]) == 3
    assert report["per_occurrence"][1]["clippyfirst_native"]["status"] == "abstained"


def test_report_discloses_weights_license_uncertainty(monkeypatch):
    monkeypatch.setenv("CHARSIU_MODEL_REVISION_REQUESTED", "ed5cf99")
    monkeypatch.setenv("CHARSIU_RESOLVED_MODEL_REVISION", "a" * 40)
    monkeypatch.setenv("CHARSIU_TOKENIZER_REVISION_REQUESTED", "68377bd")
    monkeypatch.setenv("CHARSIU_RESOLVED_TOKENIZER_REVISION", "b" * 40)
    rows = [{
        "id": "row-1", "lang": "ko", "split": "test", "text": "가",
        "canonical": "가", "phonemes": "ka", "tokens": [{"canonical": "가", "phoneme": "ka"}],
    }]
    report = MODULE.evaluate(rows, {"가": "ka"})
    assert report["model_revision"] == "a" * 40
    assert report["tokenizer_revision"] == "b" * 40
    assert report["model_weights_license_status"].startswith("UNRESOLVED")
