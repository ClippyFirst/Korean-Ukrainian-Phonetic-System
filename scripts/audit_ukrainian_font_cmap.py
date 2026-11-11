#!/usr/bin/env python3
"""Verify that the bundled Ukrainian webfont contains every required Ukrainian letter."""

from pathlib import Path
import json
import sys

from fontTools.ttLib import TTFont

FONT_PATH = Path(__file__).resolve().parents[1] / "src" / "fonts" / "NotoSans-Regular.woff2"
REQUIRED = {
    "І": 0x0406, "Ї": 0x0407, "Є": 0x0404, "Ґ": 0x0490,
    "і": 0x0456, "ї": 0x0457, "є": 0x0454, "ґ": 0x0491,
}


def main() -> int:
    if not FONT_PATH.is_file():
        raise SystemExit(f"Missing bundled font: {FONT_PATH}")
    font = TTFont(FONT_PATH, lazy=True)
    cmap = set()
    for table in font["cmap"].tables:
        if table.isUnicode():
            cmap.update(table.cmap)
    missing = {letter: f"U+{codepoint:04X}" for letter, codepoint in REQUIRED.items() if codepoint not in cmap}
    if missing:
        print(json.dumps({"font": str(FONT_PATH), "missing": missing}, ensure_ascii=False, indent=2))
        return 1
    print(json.dumps({
        "font": FONT_PATH.as_posix(),
        "format": "WOFF2",
        "required_ukrainian_codepoints": {letter: f"U+{codepoint:04X}" for letter, codepoint in REQUIRED.items()},
        "coverage": "PASS",
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
