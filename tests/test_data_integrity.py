import csv, json
from pathlib import Path
from jsonschema import validate
from korean_ukrainian.hangul import generate_syllables

ROOT=Path(__file__).parents[1]

def rows(path):
    with path.open(encoding="utf-8",newline="") as f: return list(csv.DictReader(f))

def test_rule_registry_matches_runtime_ids():
    csv_ids={r["rule_id"] for r in rows(ROOT/"data/korean/rules.csv")}
    from korean_ukrainian.rules import RULE_META
    assert csv_ids==set(RULE_META)
    ordering={r["rule_id"] for r in rows(ROOT/"data/korean/rule_ordering.csv")}
    assert ordering==csv_ids

def test_rule_instances_validate_against_schema():
    schema=json.loads((ROOT/"schemas/rule.schema.json").read_text(encoding="utf-8"))
    for row in rows(ROOT/"data/korean/rules.csv"):
        row["ordering"]=int(row["ordering"]); validate(row,schema)

def test_validation_instances_validate_against_schema():
    schema=json.loads((ROOT/"schemas/validation-case.schema.json").read_text(encoding="utf-8"))
    for row in rows(ROOT/"data/validation/cases.csv"): validate(row,schema)

def test_jamo_instances_validate_against_schema():
    schema=json.loads((ROOT/"schemas/hangul-jamo.schema.json").read_text(encoding="utf-8"))
    for row in rows(ROOT/"data/korean/jamo.csv"): validate(row,schema)

def test_source_foreign_keys():
    source_ids={r["source_id"] for r in rows(ROOT/"data/korean/sources.csv")}
    for path in [ROOT/"data/korean/rules.csv",ROOT/"data/validation/cases.csv"]:
        for row in rows(path): assert row["source_id"] in source_ids

def test_generated_csv_matches_generator():
    actual=rows(ROOT/"data/korean/syllables.csv")
    assert actual==[{k:str(v) for k,v in row.items()} for row in generate_syllables()]

def test_rule_scope_instances_validate_against_schema():
    schema=json.loads((ROOT/"schemas/rule-scope.schema.json").read_text(encoding="utf-8"))
    scope=list(csv.DictReader((ROOT/"data/korean/rule_scope.csv").open(encoding="utf-8")))
    for row in scope: validate(row,schema)
    assert {int(r["section"]) for r in scope} == set(range(9,31))

def test_evidence_source_foreign_keys():
    source_ids={r["source_id"] for r in rows(ROOT/"data/korean/sources.csv")}
    for row in rows(ROOT/"data/korean/evidence.csv"):
        assert row["source_id"] in source_ids



def test_lexical_pronunciation_entries_are_complete_and_provenanced():
    entries=rows(ROOT/"data/korean/lexical_pronunciations.csv")
    assert entries
    for row in entries:
        assert row["input"] and row["surface_hangul"]
        assert row["source_url"].startswith("https://")
        assert row["confidence"] in {"high","medium","low"}
        assert row["target_status"] in {"model-selected","provisional","surface-only"}
        if row["target_status"] == "surface-only":
            # Surface-only records document standard Korean readings without
            # claiming the row as a Ukrainian-target override.
            assert row["rule_notes"] and row["confidence"] == "high"
        assert len(row["surface_hangul"]) == len(row["target_syllables"].split("|"))
        assert len(row["surface_hangul"]) == len(row["ipa_syllables"].split("|"))

def test_documented_rule_order_matches_runtime_pipeline():
    from korean_ukrainian.phonology import parse_syllables
    from korean_ukrainian.rules import apply_ordered_rules
    documented = sorted(rows(ROOT/"data/korean/rule_ordering.csv"), key=lambda r: int(r["preferred_order"]))
    _, traces = apply_ordered_rules(parse_syllables("가"))
    assert [r["rule_id"] for r in documented] == [trace.rule_id for trace in traces]
