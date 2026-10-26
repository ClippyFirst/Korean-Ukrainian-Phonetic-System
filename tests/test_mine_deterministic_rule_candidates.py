from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from mine_deterministic_rule_candidates import (  # noqa: E402
    build_report,
    conservative_normalize,
    context_buckets,
    load_provenance,
)


def write_inputs(tmp_path: Path, *, split: str = "dev", dataset_id: str = "internal-korean-dev"):
    provenance = {
        "model_id": "example/teacher",
        "model_revision": "0123456789abcdef",
        "dataset_id": dataset_id,
        "dataset_revision": "abcdef0123456789",
        "split": split,
        "source_url": "https://example.org/corpus",
        "dataset_license_status": "reviewed-for-local-research",
        "model_license_status": "unresolved-local-research-only",
        "teacher_output_type": "IPA",
        "teacher_model_training_overlap_status": "unknown",
        "test_data_used_for_tuning": False,
    }
    provenance_path = tmp_path / "provenance.json"
    provenance_path.write_text(json.dumps(provenance), encoding="utf-8")
    input_path = tmp_path / "predictions.jsonl"
    rows = [
        {"case_id": "dev-001", "split": split, "source_text": "국밥", "teacher_ipa": "kuk̚.p͈ap̚", "strict_ipa": "kuk̚.p͈ap̚"},
        {"case_id": "dev-002", "split": split, "source_text": "국물", "teacher_ipa": "kuŋ.mul", "strict_ipa": "kuk.mul"},
        {"case_id": "dev-003", "split": split, "source_text": "국내", "teacher_ipa": "kuŋ.dɛ", "strict_ipa": "kuk.tɛ"},
    ]
    input_path.write_text(
        "\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n",
        encoding="utf-8",
    )
    return input_path, provenance_path


def test_normalization_is_conservative_and_preserves_ipa_contrasts():
    assert conservative_normalize("  a\u0303   b ") == "ã b"
    assert conservative_normalize("aː") != conservative_normalize("a")
    assert conservative_normalize("t͈") != conservative_normalize("t")
    assert conservative_normalize("a.b") != conservative_normalize("ab")


def test_report_preserves_raw_outputs_and_only_marks_context_associations(tmp_path):
    input_path, provenance_path = write_inputs(tmp_path)
    report = build_report(input_path, provenance_path, min_context_support=1)

    assert report["summary"]["case_count"] == 3
    assert report["summary"]["teacher_strict_disagreements"] == 2
    assert report["cases"][1]["teacher_raw"] == "kuŋ.mul"
    assert report["cases"][1]["strict_raw"] == "kuk.mul"
    assert report["cases"][1]["human_review_status"] == "not-reviewed"
    assert report["protocol"]["automatic_rule_generation"] is False
    assert "association only" in report["context_associations"][0]["interpretation"]
    assert report["provenance"]["model_revision"] == "0123456789abcdef"


@pytest.mark.parametrize("split", ["test", "holdout", "test-dev"])
def test_provenance_rejects_non_train_dev_splits(tmp_path, split):
    _, provenance_path = write_inputs(tmp_path, split=split)
    with pytest.raises(ValueError, match="only train/dev"):
        load_provenance(provenance_path)


@pytest.mark.parametrize("dataset_id", [
    "naver-ai/UGTPHON",
    "sigmorphon/2021-task1",
    "project-24-form-holdout",
])
def test_provenance_rejects_known_benchmark_and_holdout_ids(tmp_path, dataset_id):
    _, provenance_path = write_inputs(tmp_path, dataset_id=dataset_id)
    with pytest.raises(ValueError, match="known benchmark/holdout"):
        load_provenance(provenance_path)


def test_row_split_cannot_override_train_dev_provenance(tmp_path):
    input_path, provenance_path = write_inputs(tmp_path)
    rows = [json.loads(line) for line in input_path.read_text(encoding="utf-8").splitlines()]
    rows[1]["split"] = "test"
    input_path.write_text(
        "\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n",
        encoding="utf-8",
    )
    with pytest.raises(ValueError, match="refusing split"):
        build_report(input_path, provenance_path)


def test_duplicate_case_ids_are_rejected(tmp_path):
    input_path, provenance_path = write_inputs(tmp_path)
    rows = [json.loads(line) for line in input_path.read_text(encoding="utf-8").splitlines()]
    rows[1]["case_id"] = rows[0]["case_id"]
    input_path.write_text(
        "\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n",
        encoding="utf-8",
    )
    with pytest.raises(ValueError, match="duplicate case_id"):
        build_report(input_path, provenance_path)


def test_context_buckets_distinguish_eojeol_space_from_within_word():
    contexts = context_buckets("국밥 국 물")
    assert "within-eojeol:coda=velar-family:next-onset=bilabial" in contexts
    assert "across-space:coda=velar-family:next-onset=nasal-m" in contexts
    assert "across-space:coda=bilabial-family:next-onset=velar" in contexts


def test_cer_uses_teacher_as_reference_denominator(tmp_path):
    input_path, provenance_path = write_inputs(tmp_path)
    rows = [json.loads(line) for line in input_path.read_text(encoding="utf-8").splitlines()]
    rows[0]["teacher_ipa"] = "a"
    rows[0]["strict_ipa"] = "ab"
    input_path.write_text(
        "\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n",
        encoding="utf-8",
    )
    report = build_report(input_path, provenance_path, min_context_support=1)
    first = next(row for row in report["cases"] if row["case_id"] == "dev-001")
    assert first["character_edit_distance"] == 1
    assert first["cer_teacher_vs_strict"] == 1.0
