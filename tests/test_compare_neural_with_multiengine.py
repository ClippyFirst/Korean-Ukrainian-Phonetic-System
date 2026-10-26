from __future__ import annotations

import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

from compare_neural_with_multiengine import compare_reports  # noqa: E402


def _scored(occurrence_id, row_id, exact, distance, gold="ipa"):
    return {
        "occurrence_id": str(occurrence_id),
        "row_id": row_id,
        "exact": exact,
        "distance": distance,
        "reference_length": len(gold),
        "predicted": "raw",
        "normalized_predicted": "ipa" if exact else "bad",
    }


def test_pairing_uses_identical_occurrences_and_separates_coverage():
    neural = {
        "model_id": "test/model",
        "model_revision": "a" * 40,
        "tokenizer_id": "test/tokenizer",
        "tokenizer_revision": "b" * 40,
        "model_weights_license_status": "UNRESOLVED",
        "eligible_occurrences": 3,
        "scored_occurrences": 2,
        "coverage": 2 / 3,
        "exact_matches": 1,
        "exact_match_rate": 0.5,
        "character_error_rate": 1 / 6,
        "missing_predictions": 1,
        "prediction_failure_counts_by_unique_word": {"empty_output": 1, "invalid_output": 0, "model_error": 0},
        "predictions": [
            {**_scored(0, "r1", True, 0), "word": "가", "gold": "ipa"},
            {**_scored(1, "r1", False, 1), "word": "나", "gold": "ipa"},
        ],
        "prediction_failures_by_word": {"다": {"status": "empty_output", "reason": "empty"}},
        "comparison": {"per_occurrence": [
            {"occurrence_id": 0, "row_id": "r1", "word": "가", "gold": "ipa", "charsiu_byt5": {"status": "scored", "ipa": "ipa"}},
            {"occurrence_id": 1, "row_id": "r1", "word": "나", "gold": "ipa", "charsiu_byt5": {"status": "scored", "ipa": "bad"}},
            {"occurrence_id": 2, "row_id": "r2", "word": "다", "gold": "ipa", "charsiu_byt5": {"status": "missing"}},
        ]},
    }
    baseline = {
        "eligible_token_occurrences": 3,
        "engines": {"g2pk_0_9_4": {"coverage": 1.0}},
        "per_engine_occurrences": {
            "clippyfirst_native": [
                {**_scored(0, "r1", True, 0), "token": "가", "gold": "ipa", "status": "scored", "ipa": "ipa"},
                {"occurrence_id": "1", "row_id": "r1", "token": "나", "gold": "ipa", "status": "abstained", "reason": "unresolved"},
                {**_scored(2, "r2", True, 0), "token": "다", "gold": "ipa", "status": "scored", "ipa": "ipa"},
            ],
            "g2pk_0_9_4": [
                {**_scored(0, "r1", False, 1), "token": "가", "gold": "ipa", "status": "scored", "ipa": "bad"},
                {**_scored(1, "r1", True, 0), "token": "나", "gold": "ipa", "status": "scored", "ipa": "ipa"},
                {**_scored(2, "r2", True, 0), "token": "다", "gold": "ipa", "status": "scored", "ipa": "ipa"},
            ],
        },
    }
    report = compare_reports(neural, baseline, "synthetic")
    g2pk = report["paired_comparisons"]["g2pk_0_9_4"]
    assert report["eligible_occurrences"] == 3
    assert report["normalization_profile"].startswith("benchmark_ugtphon_ko.normalize_ipa")
    assert any("overlap" in x for x in report["limitations"])
    assert g2pk["charsiu_scored_occurrences"] == 2
    assert g2pk["baseline_scored_occurrences"] == 3
    assert g2pk["common_scored_occurrences"] == 2
    assert g2pk["charsiu_only_exact"] == 1
    assert g2pk["baseline_only_exact"] == 1
    assert report["per_occurrence"][2]["charsiu_byt5"]["status"] == "empty_output"
    assert report["per_occurrence"][1]["baselines"]["clippyfirst_native"]["status"] == "abstained"


def test_pairing_rejects_different_gold_or_occurrence_identity():
    neural = {
        "eligible_occurrences": 1,
        "predictions": [],
        "comparison": {"per_occurrence": [
            {"occurrence_id": 0, "row_id": "r1", "word": "가", "gold": "ipa", "charsiu_byt5": {"status": "missing"}},
        ]},
    }
    baseline = {
        "eligible_token_occurrences": 1,
        "per_engine_occurrences": {"engine": [
            {"occurrence_id": "0", "row_id": "r1", "token": "가", "gold": "different", "status": "scored", "ipa": "x", "exact": False, "distance": 1, "reference_length": 3},
        ]},
    }
    try:
        compare_reports(neural, baseline, "synthetic")
    except ValueError as exc:
        assert "identity mismatch" in str(exc)
    else:
        raise AssertionError("mismatched gold must be rejected")
