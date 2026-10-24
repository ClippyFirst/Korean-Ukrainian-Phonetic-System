#!/usr/bin/env python3
"""Compare Kiwi and MeCab-Ko segmentation diagnostics on the same words.

This computes pairwise agreement, not accuracy. Character-offset boundaries
cannot represent a morpheme split inside one Hangul syllable; overlapping
source spans and analyzer forms that differ from their source substring are
therefore surfaced explicitly rather than silently treated as ordinary spans.
"""
from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path
from typing import Any


def _load(path: Path, expected_analyzer: str) -> dict[str, dict[str, Any]]:
    report = json.loads(path.read_text(encoding="utf-8"))
    morphology = report.get("morphology", {})
    if morphology.get("analyzer") != expected_analyzer:
        raise ValueError(
            f"{path} expected analyzer {expected_analyzer!r}, "
            f"got {morphology.get('analyzer')!r}"
        )
    if morphology.get("status") != "completed_diagnostic":
        raise ValueError(f"{path} morphology status is not completed_diagnostic")
    results = morphology.get("results")
    if not isinstance(results, list):
        raise ValueError(f"{path} has no morphology.results list")
    indexed = {str(item["word"]): item for item in results}
    if len(indexed) != len(results):
        raise ValueError(f"{path} contains duplicate word results")
    return indexed


def _boundaries(item: dict[str, Any]) -> set[int]:
    """Return shared end/start offsets between adjacent source spans.

    Using end offsets alone can mistake an overlapping token span for a
    sequential morpheme boundary. Requiring an end and a start at the same
    orthographic offset is still only a surface-character approximation.
    """
    word = str(item["word"])
    starts: set[int] = set()
    ends: set[int] = set()
    for morpheme in item.get("morphemes", []):
        start = int(morpheme.get("start", -1))
        end = int(morpheme.get("end", -1))
        if 0 <= start < end <= len(word):
            starts.add(start)
            ends.add(end)
    return {offset for offset in starts & ends if 0 < offset < len(word)}


def _shape_diagnostics(indexed: dict[str, dict[str, Any]]) -> dict[str, Any]:
    repeated_span_words = 0
    repeated_span_groups = 0
    overlapping_span_pairs = 0
    forms_different_from_surface = 0
    invalid_spans = 0
    zero_width_morphemes = 0
    words_with_zero_width_morphemes = 0
    total_morphemes = 0
    for word, item in indexed.items():
        spans: list[tuple[int, int]] = []
        for morpheme in item.get("morphemes", []):
            total_morphemes += 1
            start = int(morpheme.get("start", -1))
            end = int(morpheme.get("end", -1))
            form = str(morpheme.get("form", ""))
            if not (0 <= start <= end <= len(word)):
                invalid_spans += 1
                continue
            if start == end:
                zero_width_morphemes += 1
                continue
            spans.append((start, end))
            if form != word[start:end]:
                forms_different_from_surface += 1
        if any(
            int(morpheme.get("start", -1)) == int(morpheme.get("end", -2))
            and 0 <= int(morpheme.get("start", -1)) <= len(word)
            for morpheme in item.get("morphemes", [])
        ):
            words_with_zero_width_morphemes += 1
        counts = Counter(spans)
        groups = sum(count > 1 for count in counts.values())
        if groups:
            repeated_span_words += 1
            repeated_span_groups += groups
        for i, (left_start, left_end) in enumerate(spans):
            for right_start, right_end in spans[i + 1:]:
                if max(left_start, right_start) < min(left_end, right_end):
                    overlapping_span_pairs += 1
    return {
        "words": len(indexed),
        "total_morphemes": total_morphemes,
        "words_with_repeated_source_spans": repeated_span_words,
        "repeated_source_span_groups": repeated_span_groups,
        "overlapping_source_span_pairs": overlapping_span_pairs,
        "forms_not_equal_to_source_substring": forms_different_from_surface,
        "zero_width_morphemes": zero_width_morphemes,
        "words_with_zero_width_morphemes": words_with_zero_width_morphemes,
        "invalid_source_spans": invalid_spans,
        "interpretation": (
            "diagnostic representation counts, not errors by themselves: analyzer forms may be "
            "normalized morphemes while offsets identify the source surface; zero-width morphemes "
            "are kept separate from invalid spans and are not counted as surface boundaries"
        ),
    }


def _rule_events(indexed: dict[str, dict[str, Any]]) -> dict[tuple[str, str, str, int], bool]:
    events: dict[tuple[str, str, str, int], bool] = {}
    for word, item in indexed.items():
        for event in item.get("native_soft_rule_boundary_events", []):
            key = (
                word,
                str(event.get("rule_id", "")),
                str(event.get("pair", "")),
                int(event.get("orthographic_offset", -1)),
            )
            events[key] = bool(event.get("morphological_boundary_observed"))
    return events


def compare(kiwi: dict[str, dict[str, Any]], mecab: dict[str, dict[str, Any]]) -> dict[str, Any]:
    common = sorted(set(kiwi) & set(mecab))
    if not common:
        raise ValueError("the analyzers have no words in common")
    exact = 0
    true_positive = false_positive = false_negative = 0
    disagreements: list[dict[str, Any]] = []
    for word in common:
        kiwi_boundaries = _boundaries(kiwi[word])
        mecab_boundaries = _boundaries(mecab[word])
        if kiwi_boundaries == mecab_boundaries:
            exact += 1
        true_positive += len(kiwi_boundaries & mecab_boundaries)
        false_positive += len(kiwi_boundaries - mecab_boundaries)
        false_negative += len(mecab_boundaries - kiwi_boundaries)
        if kiwi_boundaries != mecab_boundaries and len(disagreements) < 100:
            disagreements.append({
                "word": word,
                "kiwi_morphemes": [x.get("form") for x in kiwi[word].get("morphemes", [])],
                "mecab_morphemes": [x.get("form") for x in mecab[word].get("morphemes", [])],
                "kiwi_boundaries": sorted(kiwi_boundaries),
                "mecab_boundaries": sorted(mecab_boundaries),
            })
    precision = true_positive / (true_positive + false_positive) if true_positive + false_positive else None
    recall = true_positive / (true_positive + false_negative) if true_positive + false_negative else None
    f1 = 2 * precision * recall / (precision + recall) if precision is not None and recall is not None and precision + recall else None

    kiwi_events = _rule_events(kiwi)
    mecab_events = _rule_events(mecab)
    common_events = sorted(set(kiwi_events) & set(mecab_events))
    both_observed = sum(kiwi_events[key] and mecab_events[key] for key in common_events)
    neither_observed = sum(not kiwi_events[key] and not mecab_events[key] for key in common_events)
    kiwi_only = sum(kiwi_events[key] and not mecab_events[key] for key in common_events)
    mecab_only = sum(not kiwi_events[key] and mecab_events[key] for key in common_events)
    event_disagreements = [
        {
            "word": key[0], "rule_id": key[1], "pair": key[2],
            "orthographic_offset": key[3],
            "kiwi_boundary_observed": kiwi_events[key],
            "mecab_boundary_observed": mecab_events[key],
        }
        for key in common_events if kiwi_events[key] != mecab_events[key]
    ]

    return {
        "comparison": "Kiwi vs MeCab-Ko pairwise segmentation agreement",
        "status": "diagnostic_pairwise_not_gold_accuracy",
        "words_kiwi": len(kiwi),
        "words_mecab_ko": len(mecab),
        "common_words": len(common),
        "exact_boundary_set_agreement_words": exact,
        "exact_boundary_set_agreement_rate": round(exact / len(common), 6),
        "boundary_metric_scope": (
            "orthographic character offsets only; cannot represent a morpheme split inside a Hangul syllable"
        ),
        "boundary_micro": {
            "shared_boundaries": true_positive,
            "kiwi_only_boundaries": false_positive,
            "mecab_only_boundaries": false_negative,
            "precision_kiwi_boundaries_against_mecab": round(precision, 6) if precision is not None else None,
            "recall_kiwi_boundaries_against_mecab": round(recall, 6) if recall is not None else None,
            "f1_pairwise_boundary_overlap": round(f1, 6) if f1 is not None else None,
        },
        "analyzer_output_shape": {
            "kiwi": _shape_diagnostics(kiwi),
            "mecab_ko": _shape_diagnostics(mecab),
        },
        "native_soft_rule_boundary_alignment": {
            "common_rule_events": len(common_events),
            "both_observed": both_observed,
            "neither_observed": neither_observed,
            "kiwi_only_observed": kiwi_only,
            "mecab_only_observed": mecab_only,
            "agreement_rate": round((both_observed + neither_observed) / len(common_events), 6) if common_events else None,
            "disagreement_examples": event_disagreements[:100],
            "interpretation": (
                "descriptive only: observed analyzer boundaries do not prove a rule is licensed, "
                "and missing boundaries do not prove a rule is invalid"
            ),
        },
        "disagreement_examples": disagreements,
        "limitations": [
            "Neither analyzer is gold; agreement is not correctness.",
            "Boundary agreement is computed on source-character offsets and under-represents within-syllable morpheme splits.",
            "Analyzer forms can be normalized morpheme forms rather than literal source substrings; offsets refer to source text.",
            "Native soft-rule boundary alignment is correlation only, not a phonological license or accuracy score.",
            "Raw POS tags are not compared because the tag schemes are not guaranteed to be equivalent.",
            "The underlying corpus is noisy user-generated text; tokenization and context can affect analyzer output.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--kiwi", type=Path, required=True)
    parser.add_argument("--mecab-ko", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        report = compare(_load(args.kiwi, "kiwi"), _load(args.mecab_ko, "mecab-ko"))
    except Exception as exc:
        parser.error(f"{type(exc).__name__}: {exc}")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "disagreement_examples"}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
