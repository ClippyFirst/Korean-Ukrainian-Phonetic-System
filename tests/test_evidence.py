import csv
from pathlib import Path
R=Path(__file__).parents[1]
def test_evidence_sources_exist():
    src={r["source_id"] for r in csv.DictReader((R/"data/korean/sources.csv").open(encoding="utf-8"))}
    for r in csv.DictReader((R/"data/korean/evidence.csv").open(encoding="utf-8")): assert r["source_id"] in src and r["claim"]