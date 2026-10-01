import csv, json
from pathlib import Path
from jsonschema import validate

ROOT=Path(__file__).parents[1]

def rows(path):
    with path.open(encoding="utf-8",newline="") as f:
        return list(csv.DictReader(f))

def test_rule_registry_matches_runtime_ids():
    csv_ids={r["rule_id"] for r in rows(ROOT/"data/korean/rules.csv")}
    from korean_ukrainian.rules import RULE_META
    assert csv_ids==set(RULE_META)
    ordering={r["rule_id"] for r in rows(ROOT/"data/korean/rule_ordering.csv")}
    assert ordering==csv_ids

def test_rule_instances_validate_against_schema():
    schema=json.loads((ROOT/"schemas/rule.schema.json").read_text(encoding="utf-8"))
    for row in rows(ROOT/"data/korean/rules.csv"):
        row["ordering"]=int(row["ordering"])
        validate(row,schema)

def test_validation_instances_validate_against_schema():
    schema=json.loads((ROOT/"schemas/validation-case.schema.json").read_text(encoding="utf-8"))
    for row in rows(ROOT/"data/validation/cases.csv"):
        validate(row,schema)

def test_source_foreign_keys():
    source_ids={r["source_id"] for r in rows(ROOT/"data/korean/sources.csv")}
    for path in [ROOT/"data/korean/rules.csv",ROOT/"data/validation/cases.csv"]:
        for row in rows(path):
            assert row["source_id"] in source_ids
