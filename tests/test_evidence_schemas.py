import json
from pathlib import Path
def test_new_schemas_are_valid_json():
    for name in ["evidence.schema.json","correspondence.schema.json","analysis.schema.json","validation-case.schema.json"]:
        obj=json.loads((Path(__file__).parents[1]/"schemas"/name).read_text(encoding="utf-8")); assert obj["$schema"].startswith("https://json-schema.org/")
