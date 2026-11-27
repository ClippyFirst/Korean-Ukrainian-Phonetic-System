#!/usr/bin/env python3
"""Emit the Python phonemic profile for every precomposed modern Hangul syllable."""
from __future__ import annotations

import json

from korean_ukrainian.ipa import realize_syllables
from korean_ukrainian.phonology import parse_syllables


def main() -> None:
    inventory = []
    for codepoint in range(0xAC00, 0xAC00 + 11172):
        source = chr(codepoint)
        result = realize_syllables(parse_syllables(source), level="phonemic")
        inventory.append(result["ipa"])
    print(json.dumps(inventory, ensure_ascii=False, separators=(",", ":")))


if __name__ == "__main__":
    main()
