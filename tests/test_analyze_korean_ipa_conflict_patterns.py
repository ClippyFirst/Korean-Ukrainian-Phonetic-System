from __future__ import annotations

import importlib.util
import json
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "analyze_korean_ipa_conflict_patterns.py"
SPEC = importlib.util.spec_from_file_location("ipa_conflict_patterns", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MODULE)


def _candidate(target: str) -> dict:
    return {"comparison_target": target}


def _queue(count: int = 366) -> dict:
    return {
        "source_pins": {
            "sigmorphon": {"dataset_id": "pinned-sigmorphon", "dataset_revision": "a" * 40},
            "ugtphon": {"dataset_id": "pinned-ugtphon", "dataset_revision": "b" * 40},
        },
        "summary": {"queued_conflicts": count},
        "items": [
            {
                "queue_id": f"KIPA-TRAIN-{i:04d}",
                "source_text": f"형태{i}",
                "difference_category": "other_symbol_or_feature_difference",
                "sigmorphon_candidates": [_candidate("kaːn")],
                "ugtphon_candidates": [_candidate("kan"), _candidate("kʌn")],
            }
            for i in range(1, count + 1)
        ],
    }


def test_build_report_preserves_variants_and_labels_diagnostic_only() -> None:
    report = MODULE.build_report(_queue())
    assert report["status"] == "DIAGNOSTIC_TRIAGE_ONLY"
    assert report["summary"]["conflict_forms"] == 366
    assert report["summary"]["all_cross_corpus_candidate_pairs"] == 732
    assert report["summary"]["exact_raw_target_pairs_across_all_candidates"] == 0
    assert report["summary"]["forms_with_multiple_unique_ugtphon_targets"] == 366
    assert report["form_level_diagnostics"][0]["ugtphon_candidate_occurrence_count"] == 2
    assert report["form_level_diagnostics"][0]["ugtphon_unique_target_count"] == 2
    assert report["summary"]["forms_with_five_or_more_ugtphon_candidate_occurrences"] == 0
    assert "No ClippyFirst IPA mapping" in report["interpretation_limits"][-1]
    assert all("clippyfirst_broad_ipa" not in row for row in report["form_level_diagnostics"])


def test_report_rejects_unexpected_queue_size() -> None:
    with pytest.raises(ValueError, match="expected 366"):
        MODULE.build_report(_queue(2))


def test_report_rejects_duplicate_queue_ids() -> None:
    queue = _queue()
    queue["items"][1]["queue_id"] = queue["items"][0]["queue_id"]
    with pytest.raises(ValueError, match="duplicate queue_id"):
        MODULE.build_report(queue)


def test_report_rejects_empty_target_candidate() -> None:
    queue = _queue()
    queue["items"][0]["ugtphon_candidates"] = [_candidate("")]
    with pytest.raises(ValueError, match="empty comparison_target"):
        MODULE.build_report(queue)


def test_read_queue_rejects_missing_pinned_source_records(tmp_path: Path) -> None:
    path = tmp_path / "queue.json"
    path.write_text(json.dumps({"items": []}), encoding="utf-8")
    with pytest.raises(ValueError, match="pinned source records"):
        MODULE._read_queue(path)


def test_repeated_occurrences_are_not_counted_as_distinct_target_variants() -> None:
    queue = _queue()
    queue["items"][0]["ugtphon_candidates"] = [_candidate("kan"), _candidate("kan"), _candidate("kan")]
    report = MODULE.build_report(queue)
    row = next(item for item in report["form_level_diagnostics"] if item["queue_id"] == "KIPA-TRAIN-0001")
    assert row["ugtphon_candidate_occurrence_count"] == 3
    assert row["ugtphon_unique_target_count"] == 1
    assert row["ugtphon_target_occurrence_counts"] == [{"target": "kan", "occurrences": 3}]
