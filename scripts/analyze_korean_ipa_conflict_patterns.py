#!/usr/bin/env python3
"""Produce a cautious, reproducible triage report for cross-corpus IPA conflicts.

This is character-string diagnostics only. It does not align IPA phones, infer
phonemes, adjudicate a gold target, or generate runtime rules.
"""
from __future__ import annotations

import argparse
import json
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

SCHEMA_VERSION = "1.0"
EXPECTED_QUEUE_COUNT = 366


def _read_queue(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read queue JSON: {path}") from exc
    if not isinstance(data, dict) or not isinstance(data.get("items"), list):
        raise ValueError("queue must be an object with an items array")
    pins = data.get("source_pins")
    if not isinstance(pins, dict) or not {"sigmorphon", "ugtphon"}.issubset(pins):
        raise ValueError("queue is missing both pinned source records")
    return data


def _candidate_targets(item: dict, key: str) -> list[str]:
    candidates = item.get(key)
    if not isinstance(candidates, list) or not candidates:
        raise ValueError(f"{item.get('queue_id')}: missing {key}")
    targets = []
    for candidate in candidates:
        if not isinstance(candidate, dict):
            raise ValueError(f"{item.get('queue_id')}: malformed candidate")
        raw = candidate.get("comparison_target")
        if not isinstance(raw, str) or not raw:
            raise ValueError(f"{item.get('queue_id')}: empty comparison_target")
        targets.append(unicodedata.normalize("NFC", raw))
    return targets


def _codepoints(text: str) -> list[str]:
    return [f"U+{ord(char):04X}" for char in sorted(set(text), key=ord)]


def _form_summary(item: dict) -> dict:
    sig = _candidate_targets(item, "sigmorphon_candidates")
    ugt = _candidate_targets(item, "ugtphon_candidates")
    sig_set, ugt_set = set(sig), set(ugt)
    shared = sorted(sig_set & ugt_set)
    return {
        "queue_id": item.get("queue_id"),
        "source_text": item.get("source_text"),
        "difference_category": item.get("difference_category"),
        "sigmorphon_candidate_count": len(sig),
        "ugtphon_candidate_occurrence_count": len(ugt),
        "ugtphon_unique_target_count": len(ugt_set),
        "ugtphon_target_occurrence_counts": [
            {"target": target, "occurrences": ugt.count(target)}
            for target in sorted(ugt_set)
        ],
        "cross_corpus_target_pairs": len(sig) * len(ugt),
        "exact_target_pair_count": sum(1 for a in sig for b in ugt if a == b),
        "length_only_pair_count_diagnostic": sum(
            1 for a in sig for b in ugt
            if a != b and a.replace("ː", "").replace("ˑ", "") == b.replace("ː", "").replace("ˑ", "")
        ),
        "shared_target_strings": shared,
        "sigmorphon_codepoints": _codepoints("".join(sig)),
        "ugtphon_codepoints": _codepoints("".join(ugt)),
    }


def build_report(queue: dict) -> dict:
    items = queue["items"]
    if not items:
        raise ValueError("queue has no conflict items")
    seen = set()
    summaries = []
    category_counts = Counter()
    candidate_pairs = 0
    exact_pairs = 0
    length_only_pairs = 0
    ugt_variant_forms = 0
    ugt_unique_targets = 0
    high_occurrence_count = 0
    glyph_counts = {"sigmorphon": Counter(), "ugtphon": Counter()}
    glyph_form_counts = {"sigmorphon": Counter(), "ugtphon": Counter()}
    glyph_examples = {"sigmorphon": defaultdict(list), "ugtphon": defaultdict(list)}

    for item in items:
        source = item.get("source_text")
        queue_id = item.get("queue_id")
        if not isinstance(source, str) or not source:
            raise ValueError("each queue item needs a source_text")
        if not isinstance(queue_id, str) or not queue_id or queue_id in seen:
            raise ValueError(f"missing or duplicate queue_id: {queue_id!r}")
        seen.add(queue_id)
        summary = _form_summary(item)
        summaries.append(summary)
        category_counts[str(summary["difference_category"])] += 1
        candidate_pairs += summary["cross_corpus_target_pairs"]
        exact_pairs += summary["exact_target_pair_count"]
        length_only_pairs += summary["length_only_pair_count_diagnostic"]
        ugt_variant_forms += summary["ugtphon_unique_target_count"] > 1
        ugt_unique_targets += summary["ugtphon_unique_target_count"]
        high_occurrence_count += summary["ugtphon_candidate_occurrence_count"] >= 5

        for corpus, key in (("sigmorphon", "sigmorphon_candidates"), ("ugtphon", "ugtphon_candidates")):
            targets = _candidate_targets(item, key)
            unique_chars = set("".join(targets))
            for char in unique_chars:
                glyph_counts[corpus][char] += sum(t.count(char) for t in targets)
                glyph_form_counts[corpus][char] += 1
                if len(glyph_examples[corpus][char]) < 5:
                    glyph_examples[corpus][char].append(source)

    if len(items) != EXPECTED_QUEUE_COUNT:
        raise ValueError(f"expected {EXPECTED_QUEUE_COUNT} queue items, got {len(items)}")
    summaries.sort(key=lambda row: row["queue_id"])
    top_glyphs = {}
    for corpus in ("sigmorphon", "ugtphon"):
        top_glyphs[corpus] = [
            {
                "character": char,
                "codepoint": f"U+{ord(char):04X}",
                "candidate_occurrences": count,
                "conflict_forms_containing_character": glyph_form_counts[corpus][char],
                "example_forms": glyph_examples[corpus][char],
            }
            for char, count in glyph_counts[corpus].most_common(40)
        ]

    high_occurrence_rows = sorted(
        (row for row in summaries if row["ugtphon_candidate_occurrence_count"] >= 5),
        key=lambda row: (-row["ugtphon_candidate_occurrence_count"], row["source_text"]),
    )
    return {
        "schema_version": SCHEMA_VERSION,
        "status": "DIAGNOSTIC_TRIAGE_ONLY",
        "source_pins": queue["source_pins"],
        "input_queue_summary": queue.get("summary", {}),
        "summary": {
            "conflict_forms": len(items),
            "difference_categories_by_form": dict(sorted(category_counts.items())),
            "all_cross_corpus_candidate_pairs": candidate_pairs,
            "exact_raw_target_pairs_across_all_candidates": exact_pairs,
            "length_only_pairs_after_diagnostic_mark_removal": length_only_pairs,
            "forms_with_multiple_unique_ugtphon_targets": ugt_variant_forms,
            "sum_of_per_form_unique_ugtphon_target_strings": ugt_unique_targets,
            "forms_with_five_or_more_ugtphon_candidate_occurrences": high_occurrence_count,
        },
        "top_literal_codepoints": top_glyphs,
        "highest_occurrence_forms": high_occurrence_rows[:40],
        "form_level_diagnostics": summaries,
        "interpretation_limits": [
            "Unicode character counts and difflib-like string comparisons are not phoneme alignment.",
            "A target string may contain combining marks; literal code points are counted without segmenting them into IPA phones.",
            "Multiple UGTPHON candidates are retained; no variant is selected as canonical or gold.",
            "The length-only counter is diagnostic and does not license removing length marks.",
            "No ClippyFirst IPA mapping, Ukrainian target, phonological rule, or accuracy claim is emitted.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--queue-json", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    args = parser.parse_args()
    report = build_report(_read_queue(args.queue_json))
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(
        json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    print(json.dumps(report["summary"], ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
