import csv
from pathlib import Path


def test_target_renderer_holdout_has_24_unique_inputs_and_no_fabricated_gold():
    root = Path(__file__).resolve().parents[1]
    path = root / "data" / "korean" / "benchmarks" / "target-renderer-holdout-24.csv"
    with path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))

    assert len(rows) == 24
    assert len({row["form"] for row in rows}) == 24
    assert len({row["holdout_id"] for row in rows}) == 24
    assert all(row["ipa_gold_status"] == "not_available" for row in rows)
    assert all(row["ukrainian_gold_status"] == "not_available" for row in rows)
    assert all(row["source_manifest_status"] == "restored_from_prior_handoff" for row in rows)
    assert all("gold labels were not found" in row["provenance_note"] for row in rows)
