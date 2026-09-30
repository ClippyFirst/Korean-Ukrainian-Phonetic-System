import csv
from pathlib import Path
p=Path(__file__).parents[1]/"data/korean/syllables.csv"
with p.open(encoding="utf-8",newline="") as f: rows=list(csv.DictReader(f))
assert len(rows)==11172 and rows[0]["syllable"]=="가" and rows[-1]["syllable"]=="힣" and len({r["codepoint"] for r in rows})==11172
print("VALID: 11172 unique modern Hangul syllable blocks")
