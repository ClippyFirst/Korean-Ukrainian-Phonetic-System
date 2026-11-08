#!/usr/bin/env python3
"""Inventory Seoul Corpus Praat TextGrid structure without exporting labels."""
from __future__ import annotations
import argparse
import json
import re
from collections import Counter
from pathlib import Path

TIER_RE = re.compile(
    r'item\s*\[\s*\d+\s*\]\s*:\s*'
    r'class\s*=\s*"([^"]+)"\s*'
    r'name\s*=\s*"((?:[^"\\]|\\.)*)"',
    re.MULTILINE,
)
INTERVAL_RE = re.compile(r'intervals\s*:\s*size\s*=\s*(\d+)', re.MULTILINE)
POINT_RE = re.compile(r'points\s*:\s*size\s*=\s*(\d+)', re.MULTILINE)

def decode_text(path: Path) -> str:
    raw = path.read_bytes()
    for encoding in ("utf-8-sig", "utf-16", "utf-16-le", "utf-16-be", "cp949", "euc-kr"):
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            pass
    raise UnicodeError("unsupported TextGrid encoding")

def inspect_textgrid(path: Path) -> dict:
    text = decode_text(path)
    matches = list(TIER_RE.finditer(text))
    if not matches:
        raise ValueError("no Praat long-format tier declarations found")
    tiers = []
    for index, match in enumerate(matches):
        block = text[match.end():matches[index + 1].start() if index + 1 < len(matches) else len(text)]
        interval = INTERVAL_RE.search(block)
        point = POINT_RE.search(block)
        tiers.append({
            "class": match.group(1),
            "name": match.group(2),
            "interval_count": int(interval.group(1)) if interval else 0,
            "point_count": int(point.group(1)) if point else 0,
        })
    return {"tiers": tiers}

def build_inventory(root: Path) -> dict:
    files = sorted(p for p in root.rglob("*") if p.is_file() and p.suffix.lower() == ".textgrid" and not p.name.startswith("._"))
    tier_counts: Counter[str] = Counter()
    class_counts: Counter[str] = Counter()
    interval_total = point_total = parsed = 0
    failures = []
    for path in files:
        try:
            result = inspect_textgrid(path)
        except (OSError, UnicodeError, ValueError) as exc:
            failures.append({"file": path.name, "reason": str(exc)})
            continue
        parsed += 1
        for tier in result["tiers"]:
            tier_counts[f'{tier["class"]}:{tier["name"]}'] += 1
            class_counts[tier["class"]] += 1
            interval_total += tier["interval_count"]
            point_total += tier["point_count"]
    return {
        "schema_version": 1,
        "dataset": "Seoul Corpus / OpenSLR SLR113",
        "scope": "metadata-only inventory; no labels or audio exported",
        "license": "CC BY-NC 2.0",
        "files_found": len(files),
        "files_parsed": parsed,
        "files_failed": len(failures),
        "tier_instances": sum(tier_counts.values()),
        "tier_class_counts": dict(sorted(class_counts.items())),
        "tier_name_counts": dict(sorted(tier_counts.items())),
        "interval_annotations_total": interval_total,
        "point_annotations_total": point_total,
        "parse_failures_sample": failures[:50],
    }

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    report = build_inventory(args.root)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "parse_failures_sample"}, ensure_ascii=False, indent=2))
    return 0 if report["files_found"] and report["files_parsed"] == report["files_found"] else 2

if __name__ == "__main__":
    raise SystemExit(main())
