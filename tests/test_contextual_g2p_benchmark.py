from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "benchmark_contextual_g2p_ko.py"
sys.path.insert(0, str(SCRIPT.parent))
SPEC = importlib.util.spec_from_file_location("benchmark_contextual_g2p_ko", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def _row():
    return {
        "id": "ko-row-1", "lang": "ko", "split": "test",
        "text": "raw sentence", "canonical": "가 나", "phonemes": "ka na",
        "tokens": [{"canonical": "가", "phoneme": "ka"}, {"canonical": "나", "phoneme": "na"}],
    }


def _prediction(predicted="ka na", input_canonical="가 나", **extra):
    return {
        "id": "ko-row-1", "input_canonical": input_canonical,
        "predicted_ipa": predicted, "output_kind": "ipa",
        "input_granularity": "sentence", **extra,
    }


def test_sentence_evaluator_scores_context_preserving_predictions():
    report = MODULE.evaluate([_row()], {"ko-row-1": _prediction(engine="fixture", model_revision="abc123")})
    assert report["scored_sentences"] == 1
    assert report["coverage"] == 1.0
    assert report["exact_matches"] == 1
    assert report["exact_match_rate"] == 1.0
    assert report["character_error_rate"] == 0.0
    assert report["predictions"][0]["engine"] == "fixture"


def test_missing_prediction_reduces_coverage_and_is_not_exact():
    report = MODULE.evaluate([_row()], {})
    assert report["scored_sentences"] == 0
    assert report["coverage"] == 0.0
    assert report["exact_match_rate"] is None
    assert report["missing_prediction_ids"] == ["ko-row-1"]


def test_input_mismatch_is_not_scored_as_a_model_error():
    report = MODULE.evaluate([_row()], {"ko-row-1": _prediction(input_canonical="가")})
    assert report["scored_sentences"] == 0
    assert report["coverage"] == 0.0
    assert report["input_mismatch_ids"][0]["id"] == "ko-row-1"


def test_hangul_output_is_rejected_until_a_phone_to_ipa_adapter_exists():
    try:
        MODULE.evaluate([_row()], {"ko-row-1": _prediction(predicted="가 나")})
    except ValueError as exc:
        assert "contains Hangul" in str(exc)
    else:
        raise AssertionError("raw Hangul output must not be scored as IPA")


def test_duplicate_prediction_ids_are_rejected(tmp_path):
    path = tmp_path / "predictions.jsonl"
    item = _prediction()
    import json
    path.write_text(json.dumps(item, ensure_ascii=False) + "\n" + json.dumps(item, ensure_ascii=False) + "\n", encoding="utf-8")
    try:
        MODULE.load_predictions(path)
    except ValueError as exc:
        assert "duplicate prediction id" in str(exc)
    else:
        raise AssertionError("duplicate prediction IDs must fail closed")
