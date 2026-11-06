import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research"

def read_rows(path):
    with path.open(encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))

def test_236_rule_confirmed_occurrences_have_explicit_runtime_dispositions():
    candidates = read_rows(RESEARCH / "kozak-kim-236-candidate-review-2026-11-05.csv")
    integrated = read_rows(RESEARCH / "kozak-kim-236-engine-integration-2026-11-06.csv")
    confirmed = {
        row["occurrence_id"]
        for row in candidates
        if row["candidate_disposition"] == "RULE_CONFIRMED_STANDARD_VARIANT"
    }
    mapped = {row["occurrence_id"] for row in integrated}
    assert len(confirmed) == 15
    assert mapped == confirmed
    assert len(integrated) == 15
    assert sum(row["engine_integration_status"] == "IMPLEMENTED_2026-11-06" for row in integrated) == 9
    assert sum(row["engine_integration_status"] == "ALREADY_IMPLEMENTED_ON_BASELINE" for row in integrated) == 5
    assert sum(row["engine_integration_status"].startswith("BLOCKED") for row in integrated) == 1

def test_repeated_yeonjeonyeonpa_occurrences_share_one_exact_runtime_license():
    rows = read_rows(RESEARCH / "kozak-kim-236-engine-integration-2026-11-06.csv")
    repeated = [row for row in rows if row["token"] == "연전연패"]
    assert {row["occurrence_id"] for row in repeated} == {"1816", "1843", "1870"}
    assert {row["runtime_rule"] for row in repeated} == {"R009"}
    assert len({row["scope"] for row in repeated}) == 1

def test_orthographic_normalization_blocker_is_not_misrepresented_as_a_rule():
    rows = read_rows(RESEARCH / "kozak-kim-236-engine-integration-2026-11-06.csv")
    row = next(item for item in rows if item["occurrence_id"] == "2490")
    assert row["engine_integration_status"] == "BLOCKED_ORTHOGRAPHIC_NORMALIZATION"
    assert row["runtime_rule"] == "BLOCKED"
    assert "머릿속" in row["implementation_note"]
