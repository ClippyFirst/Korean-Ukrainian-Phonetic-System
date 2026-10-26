from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from compare_korean_teacher_strict_dev import build_pairs  # noqa: E402


def source_row(case_id="sig:dev:00001", source="국밥"):
    return {
        "case_id": case_id,
        "dataset_id": "sigmorphon-2021-task1-medium-korean",
        "dataset_revision": "821bcdece5a47820872215969f275004b0abe80c",
        "split": "dev",
        "source_text": source,
        "target_raw": "k u k̚ . p͈ a p̚",
        "target_representation": "tokenized_ipa_from_sigmorphon_tsv",
    }


def teacher_row(case_id="sig:dev:00001", source="국밥"):
    return {
        "case_id": case_id,
        "split": "dev",
        "source_text": source,
        "reference_target_tokens": ["k", "u", "k̚", ".", "p͈", "a", "p̚"],
        "predicted_target_tokens": ["k", "u", "k̚", ".", "p͈", "a", "p̚"],
    }


def strict_row(case_id="sig:dev:00001", source="국밥"):
    return {
        "case_id": case_id,
        "input": source,
        "ipa": {
            "ipa": "kuk̚.p͈ap̚",
            "level": "broad",
            "status": "provisional",
            "is_diagnostic_only": False,
        },
        "ipa_status": "provisional",
        "ipa_is_diagnostic_only": False,
        "unresolved_contexts": [],
    }


def test_pairs_same_source_rows_without_claiming_comparable_accuracy():
    result = build_pairs([source_row()], [teacher_row()], [strict_row()])
    assert result["summary"]["paired_cases"] == 1
    assert result["summary"]["comparison_metrics_computed"] is False
    assert result["summary"]["comparison_status"] == "BLOCKED_INCOMPATIBLE_OR_UNREVIEWED_IPA_CONVENTIONS"
    pair = result["pairs"][0]
    assert pair["teacher_ipa_raw"] == "k u k̚ . p͈ a p̚"
    assert pair["strict_ipa_raw"] == "kuk̚.p͈ap̚"
    assert pair["strict_ipa_status"] == "provisional"
    assert pair["teacher_strict_exact_match"] is None
    assert pair["ukrainian_orthography"] is None


def test_rejects_case_id_or_source_misalignment():
    with pytest.raises(ValueError, match="case_id sets differ"):
        build_pairs([source_row()], [teacher_row("other")], [strict_row()])
    with pytest.raises(ValueError, match="source text mismatch"):
        build_pairs([source_row()], [teacher_row(source="말")], [strict_row()])


def test_rejects_non_dev_or_sealed_rows():
    bad_source = source_row()
    bad_source["split"] = "test"
    with pytest.raises(ValueError, match="dev only"):
        build_pairs([bad_source], [teacher_row()], [strict_row()])
    bad_teacher = teacher_row()
    bad_teacher["case_id"] = "KUA-HO-001"
    with pytest.raises(ValueError, match="sealed holdout"):
        build_pairs([source_row()], [bad_teacher], [strict_row()])


def test_excludes_diagnostic_only_native_ipa_instead_of_scoring_it():
    strict = strict_row()
    strict["ipa_is_diagnostic_only"] = True
    result = build_pairs([source_row()], [teacher_row()], [strict])
    assert result["pairs"] == []
    assert result["summary"]["excluded_cases"] == 1
    assert "diagnostic-only" in result["excluded_cases"][0]["reason"]
