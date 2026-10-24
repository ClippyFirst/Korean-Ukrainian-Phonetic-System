#!/usr/bin/env python3
"""Convert the pinned SIGMORPHON 2021 Korean test TSV to benchmark-driver JSON.

The pinned repository copy of kor_test.tsv contains paired word/IPA rows, even
though the SIGMORPHON README describes the shared-task test input as word-only.
This provenance/schema discrepancy is retained as a benchmark limitation: use
only this exact pinned public file, do not call the score a shared-task leaderboard
reproduction, and do not merge train/dev. The data is CC BY-SA 3.0 (Wiktionary).
"""
from __future__ import annotations

import argparse
import json
import unicodedata
from pathlib import Path

EXPECTED_ROWS = 1000


def convert(path: Path, expected_rows: int = EXPECTED_ROWS) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    seen: set[str] = set()
    for line_no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not raw.strip():
            continue
        fields = raw.split("\t")
        if len(fields) != 2:
            raise ValueError(f"line {line_no}: expected exactly 2 TSV fields, got {len(fields)}")
        word = unicodedata.normalize("NFC", fields[0].strip())
        phones = fields[1].split()
        if not word or not phones:
            raise ValueError(f"line {line_no}: empty word or phone sequence")
        if word in seen:
            raise ValueError(f"line {line_no}: duplicate word in official test split: {word!r}")
        seen.add(word)
        # Keep the source's tokenized phone sequence and use a no-space IPA
        # representation only because the shared scorer compares normalized
        # strings and removes whitespace. Never infer IPA from the word.
        gold = "".join(phones)
        rows.append({
            "id": f"sigmorphon-kor-test-{line_no:04d}",
            "lang": "ko",
            "split": "test",
            "text": word,
            "canonical": word,
            "phonemes": gold,
            "tokens": [{"canonical": word, "phoneme": gold}],
        })
    if expected_rows and len(rows) != expected_rows:
        raise ValueError(f"row-count drift: expected {expected_rows}, found {len(rows)}")
    if len({row["id"] for row in rows}) != len(rows):
        raise ValueError("duplicate synthetic row IDs")
    return rows


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path, help="pinned SIGMORPHON kor_test.tsv")
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--expected-rows", type=int, default=EXPECTED_ROWS)
    args = parser.parse_args()
    rows = convert(args.input, args.expected_rows)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Converted SIGMORPHON Korean test TSV: {len(rows)} rows; no training/dev data read")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
