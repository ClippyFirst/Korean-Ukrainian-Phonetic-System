from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from evaluate_deterministic_rule_candidate import (  # noqa: E402
    evaluate,
    load_cases,
    load_manifest,
    normalize,
)


def manifest(**updates):
    value = {
        "rule_id": "R_TEST",
        "primary_source_url": "https://example.org/official-rule",
        "primary_source_clause": "§ test",
        "source_evidence_summary": "An explicit source-backed rule environment.",
        "ipa_gold_convention": "clippyfirst-broad-v1",
        "ipa_mapping_review_status": "independently-reviewed",
        "reviewer_ids": ["reviewer-a", "reviewer-b"],
        "dataset_id": "internal-korean-corpus",
        "dataset_revision": "0123456789abcdef",
        "dataset_license_status": "reviewed-for-local-research",
        "split": "dev",
        "rule_selected_using_split": "train",
        "test_data_used_for_tuning": False,
    }
    value.update(updates)
    return value


def cases():
    return [
        {"case_id": "dev-positive-1", "source_text": "국물", "gold_ipa": "kuŋ.mul",
         "baseline_ipa": "kuk.mul", "candidate_ipa": "kuŋ.mul", "role": "positive_control", "split": "dev"},
        {"case_id": "dev-positive-2", "source_text": "국내", "gold_ipa": "kuŋ.dɛ",
         "baseline_ipa": "kuk.tɛ", "candidate_ipa": "kuŋ.dɛ", "role": "positive_control", "split": "dev"},
        {"case_id": "dev-negative-1", "source_text": "국밥", "gold_ipa": "kuk̚.p͈ap̚",
         "baseline_ipa": "kuk̚.p͈ap̚", "candidate_ipa": "kuk̚.p͈ap̚", "role": "negative_control", "split": "dev"},
        {"case_id": "dev-negative-2", "source_text": "가방", "gold_ipa": "ka.baŋ",
         "baseline_ipa": "ka.baŋ", "candidate_ipa": "ka.baŋ", "role": "negative_control", "split": "dev"},
        {"case_id": "dev-eval-1", "source_text": "국내", "gold_ipa": "kuŋ.dɛ",
         "baseline_ipa": "kuk.tɛ", "candidate_ipa": "kuŋ.dɛ", "role": "evaluation", "split": "dev"},
        {"case_id": "dev-eval-2", "source_text": "국밥", "gold_ipa": "kuk̚.p͈ap̚",
         "baseline_ipa": "kuk̚.p͈ap̚", "candidate_ipa": "kuk̚.p͈ap̚", "role": "evaluation", "split": "dev"},
    ]


def write_json(path: Path, value):
    path.write_text(json.dumps(value, ensure_ascii=False), encoding="utf-8")


def test_only_whitespace_and_nfc_are_normalized():
    assert normalize("  a\u0303   b ") == "ã b"
    assert normalize("aː") != normalize("a")
    assert normalize("t͈") != normalize("t")
    assert normalize("a.b") != normalize("ab")


def test_candidate_passes_only_for_review_not_production():
    report = evaluate(manifest(), cases())
    assert report["status"] == "PASS_CANDIDATE_FOR_HUMAN_REVIEW"
    assert report["production_promotion"] is False
    assert report["checks"]["positive_controls_corrected"]
    assert report["checks"]["negative_controls_unchanged"]
    assert report["checks"]["held_out_dev_improves"]
    assert report["evaluation"]["candidate"]["exact_rate"] > report["evaluation"]["baseline"]["exact_rate"]


def test_candidate_rejected_if_negative_control_changes():
    rows = cases()
    rows[2]["candidate_ipa"] = "wrong"
    report = evaluate(manifest(), rows)
    assert report["status"] == "REJECT_OR_MORE_EVIDENCE_REQUIRED"
    assert not report["checks"]["negative_controls_unchanged"]


@pytest.mark.parametrize("updates,match", [
    ({"split": "test"}, "held-out dev"),
    ({"rule_selected_using_split": "dev"}, "selection must use train"),
    ({"test_data_used_for_tuning": True}, "must not be used"),
    ({"ipa_mapping_review_status": "unreviewed"}, "independently reviewed"),
    ({"reviewer_ids": ["same", "same"]}, "two distinct reviewer"),
    ({"dataset_id": "project-24-form-holdout"}, "sealed test/holdout"),
])
def test_manifest_fails_closed(updates, match, tmp_path):
    path = tmp_path / "manifest.json"
    write_json(path, manifest(**updates))
    with pytest.raises(ValueError, match=match):
        load_manifest(path)


def test_case_loader_rejects_holdout_ids_and_duplicate_ids(tmp_path):
    path = tmp_path / "cases.jsonl"
    rows = cases()
    rows[0]["case_id"] = "holdout-24-form-001"
    path.write_text("\n".join(json.dumps(row, ensure_ascii=False) for row in rows), encoding="utf-8")
    with pytest.raises(ValueError, match="sealed test/holdout"):
        load_cases(path)

    rows = cases()
    rows[1]["case_id"] = rows[0]["case_id"]
    path.write_text("\n".join(json.dumps(row, ensure_ascii=False) for row in rows), encoding="utf-8")
    with pytest.raises(ValueError, match="duplicate"):
        load_cases(path)


def test_no_improvement_is_not_a_pass():
    rows = cases()
    rows[4]["candidate_ipa"] = rows[4]["baseline_ipa"]
    report = evaluate(manifest(), rows)
    assert report["status"] == "REJECT_OR_MORE_EVIDENCE_REQUIRED"
    assert not report["checks"]["held_out_dev_improves"]
