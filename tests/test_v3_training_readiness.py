from __future__ import annotations
import csv
import json
import sys
from pathlib import Path
SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))
from audit_v3_training_readiness import audit_training_readiness  # noqa: E402

def _write_csv(path: Path, header: list[str], rows: list[list[str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.writer(stream)
        writer.writerow(header)
        writer.writerows(rows)

def test_readiness_audit_detects_holdout_overlap_and_refuses_unverified_ipa(tmp_path: Path) -> None:
    _write_csv(tmp_path / "data/korean/lexical_pronunciations.csv",
        ["input", "surface_hangul", "ipa_syllables", "source_url", "target_status"],
        [["학교", "학꾜", "hak|k͈jo", "https://example.test/source", "provisional"],
         ["학교", "학꾜", "hak|k͈jo", "https://example.test/source", "provisional"]])
    _write_csv(tmp_path / "data/korean/lexical_additions_2026-10-15.csv",
        ["input", "surface_hangul", "ipa_syllables", "source_url", "target_status"],
        [["닭은", "달근", "tal|ɡɯn", "https://example.test/source", "provisional"]])
    manifest = tmp_path / "data/korean/benchmarks/ipa-holdout-24-manifest.json"
    manifest.parent.mkdir(parents=True, exist_ok=True)
    manifest.write_text(json.dumps({"cases": [
        {"caseId": "HO-1", "input": "학교", "ipaGold": None, "ipaGoldStatus": "PENDING_TWO_INDEPENDENT_REVIEWERS"},
        {"caseId": "HO-2", "input": "닭은", "ipaGold": None, "ipaGoldStatus": "PENDING_TWO_INDEPENDENT_REVIEWERS"},
    ]}), encoding="utf-8")
    report = audit_training_readiness(tmp_path)
    assert report["counts"]["lexical_rows"] == 2
    assert report["counts"]["duplicate_lexical_input_forms"] == 1
    assert report["leakage_checks"]["holdout_overlaps_lexical_inputs"] == ["학교"]
    assert report["leakage_checks"]["holdout_overlaps_addition_inputs"] == ["닭은"]
    assert report["training_decision"]["supervised_ipa_training_ready"] is False
    assert report["counts"]["frozen_holdout_cases_with_ipa_gold"] == 0


def test_repository_training_audit_keeps_frozen_holdout_out_of_training() -> None:
    root = Path(__file__).resolve().parents[1]
    report = audit_training_readiness(root)
    assert report["counts"]["lexical_rows"] > 0
    assert report["counts"]["frozen_holdout_cases"] == 24
    assert report["leakage_checks"]["holdout_is_evaluation_only"] is True
    assert report["training_decision"]["supervised_ipa_training_ready"] is False
