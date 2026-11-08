#!/usr/bin/env python3
"""Inventory Seoul Corpus Praat TextGrids and optionally extract ephemeral word pairs."""
from __future__ import annotations
import argparse
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHONE_MAP_PATH = ROOT / "data/korean/ipa/seoul-corpus-phonemic-ipa-v1.json"
PHONE_TO_IPA = json.loads(PHONE_MAP_PATH.read_text(encoding="utf-8"))["mapping"]
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
NON_SPEECH_TAGS = {"<IVER>", "<LAUGH>", "<NOISE>", "<PRIVATE.INFO>", "<SIL>", "<UNKNOWN>", "<VOCNOISE>"}

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

def _is_hangul(label: str) -> bool:
    return bool(HANGUL_WORD_RE.fullmatch(label.strip()))

def _marker_category(label: str) -> str:
    if label in NON_SPEECH_TAGS:
        return label
    if label.startswith("<LAUGH-"):
        return "LAUGH_WITH_TEXT"
    return "OTHER_NON_PHONE_LABEL"

def _extract_phone_pairs(source_tier: dict | None, phone_tier: dict | None, counters: Counter, pairs: list) -> None:
    if source_tier is None or phone_tier is None:
        return
    phones = sorted(phone_tier["intervals"], key=lambda item: (item["start"], item["end"]))
    pointer = 0
    for word in source_tier["intervals"]:
        source = word["label"].strip()
        if not _is_hangul(source):
            continue
        counters["hangul_word_intervals"] += 1
        while pointer < len(phones) and phones[pointer]["end"] <= word["start"] + BOUNDARY_TOLERANCE:
            pointer += 1
        overlapping = []
        index = pointer
        while index < len(phones) and phones[index]["start"] < word["end"] - BOUNDARY_TOLERANCE:
            phone = phones[index]
            if phone["end"] > word["start"] + BOUNDARY_TOLERANCE:
                overlapping.append(phone)
            index += 1
        while pointer < len(phones) and phones[pointer]["end"] <= word["end"] + BOUNDARY_TOLERANCE:
            pointer += 1
        if not overlapping:
            counters["words_without_phone_intervals"] += 1
            continue
        if any(phone["start"] < word["start"] - BOUNDARY_TOLERANCE or phone["end"] > word["end"] + BOUNDARY_TOLERANCE for phone in overlapping):
            counters["words_with_cross_boundary_phone"] += 1
            continue
        labels = [phone["label"].strip() for phone in overlapping]
        if any(label not in PHONE_TO_IPA for label in labels):
            counters["words_with_non_phone_or_unmapped_labels"] += 1
            for label in labels:
                if label not in PHONE_TO_IPA:
                    counters["non_phone_labels"][ _marker_category(label) ] += 1
            continue
        ipa = "".join(PHONE_TO_IPA[label] for label in labels)
        if not ipa:
            counters["words_with_empty_ipa"] += 1
            continue
        counters["words_with_mapped_phones"] += 1
        counters["mapped_phone_intervals_assigned"] += len(labels)
        pairs.append({"source": source, "gold": ipa})

def build_inventory(root: Path, pairs_output: Path | None = None, ipa_pairs_output: Path | None = None) -> dict:
    files = sorted(p for p in root.rglob("*") if p.is_file() and p.suffix.lower() == ".textgrid" and not p.name.startswith("._"))
    tier_counts: Counter[str] = Counter()
    class_counts: Counter[str] = Counter()
    interval_total = point_total = parsed = 0
    failures = []
    paired_tier_pairs = paired_interval_slots = aligned_boundaries = 0
    nonempty_orthography = nonempty_pronunciation = hangul_pairs = aligned_hangul_pairs = 0
    tier_pair_count_mismatches = interval_count_mismatches = 0
    phoneme_label_counts: Counter[str] = Counter()
    ortho_tier_formats = [Counter(), Counter()]
    prono_tier_formats = [Counter(), Counter()]
    surface_pairs = []
    ipa_pairs = []
    phone_alignment: Counter = Counter()
    for path in files:
        try:
            result = inspect_textgrid(path)
        except (OSError, UnicodeError, ValueError) as exc:
            failures.append({"file": path.name, "reason": str(exc)})
            continue
        parsed += 1
        ortho_tiers = []
        prono_tiers = []
        phone_tier = None
        for tier in result["tiers"]:
            tier_counts[f'{tier["class"]}:{tier["name"]}'] += 1
            class_counts[tier["class"]] += 1
            interval_total += tier["interval_count"]
            point_total += tier["point_count"]
            if tier["name"] == "pWord.ortho.":
                ortho_tiers.append(tier)
            elif tier["name"] == "pWord.prono.":
                prono_tiers.append(tier)
            elif tier["name"] == "phoneme":
                phone_tier = tier
                phoneme_label_counts.update(interval["label"].strip() for interval in tier["intervals"] if interval["label"].strip())
        for tier_index, tier in enumerate(ortho_tiers[:2]):
            for interval in tier["intervals"]:
                label = interval["label"].strip()
                if not label: ortho_tier_formats[tier_index]["empty"] += 1
                elif _is_hangul(label): ortho_tier_formats[tier_index]["hangul_only"] += 1
                else: ortho_tier_formats[tier_index]["other_nonempty"] += 1
        for tier_index, tier in enumerate(prono_tiers[:2]):
            for interval in tier["intervals"]:
                label = interval["label"].strip()
                if not label: prono_tier_formats[tier_index]["empty"] += 1
                elif _is_hangul(label): prono_tier_formats[tier_index]["hangul_only"] += 1
                else: prono_tier_formats[tier_index]["other_nonempty"] += 1
        if len(ortho_tiers) != len(prono_tiers):
            tier_pair_count_mismatches += 1
        for ortho, prono in zip(ortho_tiers, prono_tiers):
            paired_tier_pairs += 1
            if len(ortho["intervals"]) != len(prono["intervals"]):
                interval_count_mismatches += 1
            for left, right in zip(ortho["intervals"], prono["intervals"]):
                paired_interval_slots += 1
                aligned = abs(left["start"] - right["start"]) <= BOUNDARY_TOLERANCE and abs(left["end"] - right["end"]) <= BOUNDARY_TOLERANCE
                if aligned: aligned_boundaries += 1
                source, target = left["label"].strip(), right["label"].strip()
                if source: nonempty_orthography += 1
                if target: nonempty_pronunciation += 1
                if _is_hangul(source) and _is_hangul(target):
                    hangul_pairs += 1
                    if aligned:
                        aligned_hangul_pairs += 1
                        surface_pairs.append({"source": source, "gold": target})
        hangul_ortho_tier = next((tier for tier in ortho_tiers if any(_is_hangul(i["label"]) for i in tier["intervals"])), None)
        _extract_phone_pairs(hangul_ortho_tier, phone_tier, phone_alignment, ipa_pairs)
    if pairs_output is not None:
        pairs_output.parent.mkdir(parents=True, exist_ok=True)
        pairs_output.write_text(json.dumps(surface_pairs, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    if ipa_pairs_output is not None:
        ipa_pairs_output.parent.mkdir(parents=True, exist_ok=True)
        ipa_pairs_output.write_text(json.dumps(ipa_pairs, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    mapped_symbol_counts = {symbol: phoneme_label_counts[symbol] for symbol in sorted(PHONE_TO_IPA) if phoneme_label_counts[symbol]}
    non_phone_label_counts: Counter[str] = Counter()
    unmapped_label_types = 0
    unmapped_label_tokens = 0
    for label, count in phoneme_label_counts.items():
        if label in PHONE_TO_IPA:
            continue
        non_phone_label_counts[_marker_category(label)] += count
        unmapped_label_types += 1
        unmapped_label_tokens += count
    return {
        "schema_version": 1,
        "dataset": "Seoul Corpus / OpenSLR SLR113",
        "scope": "metadata-only inventory; aligned word/phone pairs are generated in ephemeral CI files and are not committed or uploaded",
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
        "phoneme_adapter": {
            "profile_id": "seoul-corpus-phonemic-ipa-v1",
            "mapped_symbol_count": len(mapped_symbol_counts),
            "mapped_phone_token_count": sum(mapped_symbol_counts.values()),
            "mapped_symbol_counts": mapped_symbol_counts,
            "non_phone_or_unmapped_label_type_count": unmapped_label_types,
            "non_phone_or_unmapped_interval_count": unmapped_label_tokens,
            "non_phone_label_category_counts": dict(sorted(non_phone_label_counts.items())),
        },
        "word_tier_duplicate_name_format_counts": {
            "pWord.ortho.": [dict(sorted(counter.items())) for counter in ortho_tier_formats],
            "pWord.prono.": [dict(sorted(counter.items())) for counter in prono_tier_formats],
        },
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
        "phone_word_alignment": {
            "hangul_word_intervals": phone_alignment["hangul_word_intervals"],
            "words_with_mapped_phones": phone_alignment["words_with_mapped_phones"],
            "words_without_phone_intervals": phone_alignment["words_without_phone_intervals"],
            "words_with_cross_boundary_phone": phone_alignment["words_with_cross_boundary_phone"],
            "words_with_non_phone_or_unmapped_labels": phone_alignment["words_with_non_phone_or_unmapped_labels"],
            "words_with_empty_ipa": phone_alignment["words_with_empty_ipa"],
            "mapped_phone_intervals_assigned": phone_alignment["mapped_phone_intervals_assigned"],
            "ipa_word_pairs_written": len(ipa_pairs),
        },
        "parse_failures_sample": failures[:50],
    }

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--pairs-output", type=Path, help="optional ephemeral Hangul surface pair JSON")
    parser.add_argument("--ipa-pairs-output", type=Path, help="optional ephemeral IPA pair JSON")
    args = parser.parse_args()
    report = build_inventory(args.root, args.pairs_output, args.ipa_pairs_output)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "parse_failures_sample"}, ensure_ascii=False, indent=2))
    return 0 if report["files_found"] and report["files_parsed"] == report["files_found"] else 2

if __name__ == "__main__":
    raise SystemExit(main())
