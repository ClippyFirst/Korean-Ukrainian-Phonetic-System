import csv
from pathlib import Path
from korean_ukrainian.hangul import generate_syllables
R=Path(__file__).parents[1]
def test_generated_artifact_contains_11172_rows():
    with (R/"data/korean/syllables.csv").open(encoding="utf-8",newline="") as f: rows=list(csv.DictReader(f))
    assert len(rows)==11172; assert rows[0]["syllable"]=="가"; assert rows[-1]["syllable"]=="힣"
def test_generated_artifact_is_exact_generator_output():
    with (R/"data/korean/syllables.csv").open(encoding="utf-8",newline="") as f: actual=list(csv.DictReader(f))
    assert actual==[{k:str(v) for k,v in row.items()} for row in generate_syllables()]
