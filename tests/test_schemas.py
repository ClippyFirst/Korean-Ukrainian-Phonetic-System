import json
from pathlib import Path
from jsonschema import Draft202012Validator
R=Path(__file__).parents[1]
def test_schemas_are_valid():
    for p in (R/"schemas").glob("*.json"): Draft202012Validator.check_schema(json.loads(p.read_text(encoding="utf-8")))