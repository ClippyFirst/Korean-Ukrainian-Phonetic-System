from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "export_kozak_kim_mismatch_fragments",
    ROOT / "scripts/export_kozak_kim_mismatch_fragments.py",
)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


def test_alignment_keeps_combining_marks_attached_to_base():
    edits = MODULE.align("sʰa̠", "sa")
    assert edits == [
        {"op": "S", "reference_fragment": "sʰ", "kozak_fragment": "s"},
        {"op": "S", "reference_fragment": "a̠", "kozak_fragment": "a"},
    ]


def test_build_rows_exports_only_actual_reported_mismatches():
    report = {
        "benchmark": "fixture",
        "eligible_token_occurrences": 2,
        "native_ipa_profile": {"ipa_profile": "broad-v1"},
        "broad_candidate_profile": {"profile_id": "broad-candidate-v1"},
        "per_engine_occurrences": {
            "clippyfirst_native": [
                {
                    "occurrence_id": "1", "row_id": "r1", "token": "가",
                    "surface_hangul": "가", "gold": "ka", "ipa": "ka",
                    "status": "scored", "distance": 0,
                    "broad_candidate": {"closest_gold": "ka", "predicted": "ka", "distance": 0},
                },
                {
                    "occurrence_id": "2", "row_id": "r2", "token": "사",
                    "surface_hangul": "사", "gold": "sʰa", "ipa": "sa",
                    "status": "scored", "distance": 1,
                    "broad_candidate": {"closest_gold": "sa", "predicted": "sa", "distance": 0},
                },
            ],
            "g2pk_0_9_4": [
                {"occurrence_id": "2", "ipa": "sʰa", "distance": 0},
            ],
        },
    }
    rows = MODULE.build_rows(report)
    assert len(rows) == 1
    assert rows[0]["occurrence_id"] == "2"
    assert rows[0]["candidate_clusters"] == "C04_aspiration_affricate_notation"
    assert rows[0]["review_status"] == "UNADJUDICATED_DIAGNOSTIC"
    assert rows[0]["production_action"] == "NO_CHANGE_PENDING_SOURCE_AND_IPA_REVIEW"


def test_build_rows_fails_when_required_engine_ledgers_are_missing():
    import pytest

    with pytest.raises(ValueError, match="occurrence ledgers"):
        MODULE.build_rows({"per_engine_occurrences": {}})


def test_candidate_clusters_keep_sibilant_place_separate():
    fragments = [
        {"op": "S", "reference_fragment": "ɕ", "kozak_fragment": "s"},
    ]
    assert MODULE.candidate_clusters(fragments) == [
        "C11_sibilant_place_profile_boundary"
    ]
