#!/usr/bin/env python3
"""Inventory Seoul Corpus Praat TextGrids and optionally extract ephemeral word pairs."""
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
INTERVAL_ITEM_RE = re.compile(
    r'intervals\s*\[\s*\d+\s*\]\s*:\s*'
    r'xmin\s*=\s*([^\r\n]+)\s*'
    r'xmax\s*=\s*([^\r\n]+)\s*'
    r'text\s*=\s*"((?:[^"\\]|\\.)*)"',
    re.MULTILINE,
)
HANGUL_WORD_RE = re.compile(r'^[\uac00-\ud7a3]+$')
BOUNDARY_TOLERANCE = 1e-4
ARCHIVE_SHA256 = "63c3f8ffa6976307a732689d6c5be7b2db4ec20f14bf276faf98c886add0d24b"

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
        intervals = []
        for item in INTERVAL_ITEM_RE.finditer(block):
            try:
                start, end = float(item.group(1).strip()), float(item.group(2).strip())
            except ValueError as exc:
                raise ValueError("non-numeric interval boundary") from exc
            label = item.group(3).replace('\\\"', '"').replace('\\\\', '\\')
            intervals.append({"start": start, "end": end, "label": label})
        declared_intervals = int(interval.group(1)) if interval else 0
        if interval and len(intervals) != declared_intervals:
            raise ValueError("parsed interval count does not match declared count")
        tiers.append({
            "class": match.group(1),
            "name": match.group(2),
            "interval_count": declared_intervals,
            "point_count": int(point.group(1)) if point else 0,
            "intervals": intervals,
        })
    return {"tiers": tiers}

def build_inventory(root: Path, pairs_output: Path | None = None) -> dict:
    files = sorted(p for p in root.rglob("*") if p.is_file() and p.suffix.lower() == ".textgrid" and not p.name.startswith("._"))
    tier_counts: Counter[str] = Counter()
    class_counts: Counter[str] = Counter()
    interval_total = point_total = parsed = 0
    failures = []
    paired_tier_pairs = paired_interval_slots = aligned_boundaries = 0
    nonempty_orthography = nonempty_pronunciation = hangul_pairs = aligned_hangul_pairs = 0
    tier_pair_count_mismatches = interval_count_mismatches = 0
    word_pairs = []
    for path in files:
        try:
            result = inspect_textgrid(path)
        except (OSError, UnicodeError, ValueError) as exc:
            failures.append({"file": path.name, "reason": str(exc)})
            continue
        parsed += 1
        ortho_tiers = []
        prono_tiers = []
        for tier in result["tiers"]:
            tier_counts[f'{tier["class"]}:{tier["name"]}'] += 1
            class_counts[tier["class"]] += 1
            interval_total += tier["interval_count"]
            point_total += tier["point_count"]
            if tier["name"] == "pWord.ortho.":
                ortho_tiers.append(tier)
            elif tier["name"] == "pWord.prono.":
                prono_tiers.append(tier)
        if len(ortho_tiers) != len(prono_tiers):
            tier_pair_count_mismatches += 1
        for ortho, prono in zip(ortho_tiers, prono_tiers):
            paired_tier_pairs += 1
            if len(ortho["intervals"]) != len(prono["intervals"]):
                interval_count_mismatches += 1
            for left, right in zip(ortho["intervals"], prono["intervals"]):
                paired_interval_slots += 1
                aligned = abs(left["start"] - right["start"]) <= BOUNDARY_TOLERANCE and abs(left["end"] - right["end"]) <= BOUNDARY_TOLERANCE
                if aligned:
                    aligned_boundaries += 1
                source = left["label"].strip()
                target = right["label"].strip()
                if source:
                    nonempty_orthography += 1
                if target:
                    nonempty_pronunciation += 1
                if HANGUL_WORD_RE.fullmatch(source) and HANGUL_WORD_RE.fullmatch(target):
                    hangul_pairs += 1
                    if aligned:
                        aligned_hangul_pairs += 1
                        word_pairs.append({"source": source, "gold": target})
    if pairs_output is not None:
        pairs_output.parent.mkdir(parents=True, exist_ok=True)
        pairs_output.write_text(json.dumps(word_pairs, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    return {
        "schema_version": 1,
        "dataset": "Seoul Corpus / OpenSLR SLR113",
        "scope": "metadata-only inventory; pair data is optionally written to an ephemeral CI file and is not committed or uploaded",
        "license": "CC BY-NC 2.0",
        "archive_sha256": ARCHIVE_SHA256,
        "files_found": len(files),
        "files_parsed": parsed,
        "files_failed": len(failures),
        "tier_instances": sum(tier_counts.values()),
        "tier_class_counts": dict(sorted(class_counts.items())),
        "tier_name_counts": dict(sorted(tier_counts.items())),
        "interval_annotations_total": interval_total,
        "point_annotations_total": point_total,
        "word_tier_alignment": {
            "orthography_tiers": tier_counts.get("IntervalTier:pWord.ortho.", 0),
            "pronunciation_tiers": tier_counts.get("IntervalTier:pWord.prono.", 0),
            "paired_tier_pairs": paired_tier_pairs,
            "tier_pair_count_mismatches": tier_pair_count_mismatches,
            "paired_interval_slots": paired_interval_slots,
            "interval_count_mismatches": interval_count_mismatches,
            "same_time_boundaries": aligned_boundaries,
            "nonempty_orthography_intervals": nonempty_orthography,
            "nonempty_pronunciation_intervals": nonempty_pronunciation,
            "both_hangul_word_pairs": hangul_pairs,
            "aligned_hangul_word_pairs": aligned_hangul_pairs,
        },
        "parse_failures_sample": failures[:50],
    }

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--pairs-output", type=Path, help="optional ephemeral JSON array of aligned Hangul word pairs")
    args = parser.parse_args()
    report = build_inventory(args.root, args.pairs_output)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "parse_failures_sample"}, ensure_ascii=False, indent=2))
    return 0 if report["files_found"] and report["files_parsed"] == report["files_found"] else 2

if __name__ == "__main__":
    raise SystemExit(main())
