from pathlib import Path
import csv
from korean_ukrainian.hangul import generate_syllables
p=Path(__file__).parents[1]/"data/korean/syllables.csv"
with p.open("w",encoding="utf-8",newline="") as f:
 w=csv.DictWriter(f,fieldnames=["syllable","codepoint","L","V","T"]); w.writeheader(); w.writerows(generate_syllables())
