from __future__ import annotations

import csv
from pathlib import Path

from korean_ukrainian.hangul import generate_syllables
from korean_ukrainian.phonology import L_JAMO, V_JAMO, T_JAMO, VOWEL_IPA

ROOT = Path(__file__).resolve().parents[1]
MAPPING = ROOT / "data/korean/canonical_correspondence.csv"
MASTER = ROOT / "data/derived/korean_ukrainian_master.csv"
AUDIT = ROOT / "data/derived/korean_ukrainian_master_audit.csv"

def load_mapping() -> dict[tuple[str, str], dict[str, str]]:
    result = {}
    with MAPPING.open("r", encoding="utf-8", newline="") as fh:
        for row in csv.DictReader(fh):
            layer = row["layer"].strip()
            if layer == "coda" and not row["input"].strip():
                continue
            result[(layer, row["input"].strip())] = row
    return result

def build_rows():
    mapping = load_mapping()
    rows = []
    for item in generate_syllables():
        l = L_JAMO[item["L"]]
        v = V_JAMO[item["V"]]
        t = T_JAMO[item["T"]]

        onset = mapping[("onset", l)]
        vowel = mapping[("vowel", v)]
        coda = mapping[("coda", t)] if t else {"ukrainian": "", "ipa": ""}

        ipa = f"{onset['ipa']}{vowel['ipa']}{coda['ipa']}"
        ukrainian = f"{onset['ukrainian']}{vowel['ukrainian']}{coda['ukrainian']}"
        rows.append({
            "korean": item["syllable"],
            "ukrainian": ukrainian,
            "ipa": ipa,
            "L": l,
            "V": v,
            "T": t,
            "codepoint": item["codepoint"],
            "status": "canonical_isolated_syllable",
            "scope": "all_11172_modern_hangul_blocks",
            "lexical_status": "combinatorial_not_lexical_attestation",
            "mapping_basis": "data/korean/canonical_correspondence.csv",
            "target_version": "ukrainian-phonetic-inventory@0.8.0",
        })
    return rows

def write_csv(path: Path, fieldnames, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

def main():
    rows = build_rows()
    if len(rows) != 11172:
        raise SystemExit(f"expected 11172 rows, got {len(rows)}")
    write_csv(MASTER, ["korean", "ukrainian"], rows)
    write_csv(AUDIT, list(rows[0]), rows)
    print(f"generated {len(rows)} modern Hangul syllable rows")
    print(f"master: {MASTER}")
    print(f"audit: {AUDIT}")

if __name__ == "__main__":
    main()
