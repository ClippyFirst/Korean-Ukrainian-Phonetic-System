from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from analyze_korean_g2p_teacher_errors import analyze, load_predictions, source_shape  # noqa: E402


def prediction(case_id, source, reference, predicted, split="dev"):
    return {
        "case_id": case_id,
        "split": split,
        "source_text": source,
        "reference_target_tokens": reference,
        "predicted_target_tokens": predicted,
    }


def test_source_shape_reports_hangul_length_and_final_coda():
    assert source_shape("국물") == (2, "has_coda")
    assert source_shape("가게") == (2, "no_coda")
    assert source_shape("abc") == (0, "non_hangul_or_jamo")


def test_analyze_separates_exact_length_only_and_other_errors():
    rows = [
        prediction("1", "가게", ["k", "a̠ː", "ɡ", "e̞"], ["k", "a̠ː", "ɡ", "e̞"]),
        prediction("2", "국물", ["k", "uː", "ŋ"], ["k", "u", "ŋ"]),
        prediction("3", "국밥", ["k", "u", "k̚", "p͈", "a", "p̚"], ["k", "ʌ", "k̚", "p͈", "a", "p̚"]),
    ]
    report = analyze(rows, sample_limit=5)
    assert report["metrics"]["example_count"] == 3
    assert report["mismatch_categories"] == {
        "exact_match": 1,
        "length_mark_only": 1,
        "other_token_or_feature_difference": 1,
    }
    assert report["length_mark_direction"] == {"underpredict_length_marks": 1}
    assert report["sampled_dev_errors"][0]["error_category"] == "length_mark_only"
    assert "not permission to remove length marks" in report["interpretation_limits"][1]


def test_load_predictions_rejects_non_dev_data_and_duplicate_ids(tmp_path):
    path = tmp_path / "predictions.jsonl"
    path.write_text(json.dumps(prediction("x", "국물", ["k"], ["k"], split="train"), ensure_ascii=False) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="only dev predictions"):
        load_predictions(path)
    row = prediction("x", "국물", ["k"], ["k"])
    path.write_text("\n".join(json.dumps(row, ensure_ascii=False) for _ in range(2)) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="duplicate case_id"):
        load_predictions(path)
