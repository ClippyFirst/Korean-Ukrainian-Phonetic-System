import csv
from pathlib import Path
R=Path(__file__).parents[1]
def test_generated_artifact_contains_11172_rows():
    with (R/"data/korean/syllables.csv").open(encoding="utf-8",newline="") as f: rows=list(csv.DictReader(f))
    assert len(rows)==11172; assert rows[0]["syllable"]=="가"; assert rows[-1]["syllable"]=="힣"
