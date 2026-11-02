from __future__ import annotations

import csv
import importlib.util
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "build_ipa_holdout_review_packets",
    ROOT / "scripts/build_ipa_holdout_review_packets.py",
)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


def test_builds_two_separate_blind_annotation_templates_without_engine_outputs(tmp_path):
    manifest = ROOT / "data/korean/benchmarks/ipa-holdout-24-manifest.json"
    result = MODULE.build_packets(manifest, tmp_path)
    assert result["case_count"] == 24
    assert result["engine_outputs_included"] is False
    assert result["ipa_gold_included"] is False
    assert len(result["reviewer_packets"]) == 2

    packets = []
    for entry in result["reviewer_packets"]:
        with (tmp_path / entry["file"]).open(encoding="utf-8-sig", newline="") as handle:
            rows = list(csv.DictReader(handle))
        assert len(rows) == 24
        assert all(row["ipa_primary"] == "" and row["ipa_alternatives"] == "" for row in rows)
        assert all(row["ipa_convention_or_profile"] == "" for row in rows)
        assert all(row["reviewer_id"] == "" and row["reviewed_at"] == "" for row in rows)
        packets.append([row["case_id"] for row in rows])
    assert packets[0] == packets[1] == result["holdout_case_ids"]


def test_refuses_to_overwrite_or_promote_existing_gold(tmp_path):
    manifest = ROOT / "data/korean/benchmarks/ipa-holdout-24-manifest.json"
    data = __import__("json").loads(manifest.read_text(encoding="utf-8"))
    data["cases"][0]["ipaGold"] = "invented"
    broken = tmp_path / "manifest.json"
    broken.write_text(__import__("json").dumps(data), encoding="utf-8")
    with pytest.raises(ValueError, match="gold or engine outputs"):
        MODULE.build_packets(broken, tmp_path / "packets")
