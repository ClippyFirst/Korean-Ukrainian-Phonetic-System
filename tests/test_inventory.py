import csv
from pathlib import Path
R=Path(__file__).parents[1]
def test_jamo_counts():
    rows=list(csv.DictReader((R/"data/korean/jamo.csv").open(encoding="utf-8"))); assert len(rows)==67; assert sum(r["position"]=="L" for r in rows)==19; assert sum(r["position"]=="V" for r in rows)==21; assert sum(r["position"]=="T" for r in rows)==27