#!/usr/bin/env python3
"""Verify full Ukrainian alphabet coverage and true regular weight of the bundled webfont."""

from pathlib import Path
import json
import sys

from fontTools.ttLib import TTFont

FONT_PATH = Path(__file__).resolve().parents[1] / "src" / "fonts" / "NotoSans-Regular.woff2"
UKRAINIAN_ALPHABET = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюя"
REQUIRED = {letter: ord(letter) for letter in UKRAINIAN_ALPHABET}


def main() -> int:
    if not FONT_PATH.is_file():
        raise SystemExit(f"Missing bundled font: {FONT_PATH}")
    font = TTFont(FONT_PATH, lazy=True)
    cmap = set()
    for table in font["cmap"].tables:
        if table.isUnicode():
            cmap.update(table.cmap)

    missing = {
        letter: f"U+{codepoint:04X}"
        for letter, codepoint in REQUIRED.items()
        if codepoint not in cmap
    }
    weight_class = font["OS/2"].usWeightClass if "OS/2" in font else None
    errors = []
    if missing:
        errors.append("missing Ukrainian glyphs")
    if weight_class != 400:
        errors.append("font metadata is not regular weight 400")

    report = {
        "font": FONT_PATH.as_posix(),
        "format": "WOFF2",
        "required_ukrainian_alphabet": UKRAINIAN_ALPHABET,
        "missing": missing,
        "os2_weight_class": weight_class,
        "coverage": "FAIL" if errors else "PASS",
        "errors": errors,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
