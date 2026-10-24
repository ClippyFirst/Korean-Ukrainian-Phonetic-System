#!/usr/bin/env python3
"""Compare Kiwi and MeCab-Ko segmentation outputs on the same benchmark words.

This computes pairwise boundary agreement only. Neither analyzer is treated as
gold, and their raw POS tag inventories are intentionally not compared because
the tag schemes are not guaranteed to be equivalent.
"""
from __future__ import annotations

import argparse
import json
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
    word = str(item["word"])
    morphemes = item.get("morphemes", [])
    boundaries: set[int] = set()
    for morpheme in morphemes:
        end = int(morpheme["end"])
        if 0 < end < len(word):
            boundaries.add(end)
    return boundaries


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
    return {
        "comparison": "Kiwi vs MeCab-Ko pairwise segmentation agreement",
        "status": "diagnostic_pairwise_not_gold_accuracy",
        "words_kiwi": len(kiwi),
        "words_mecab_ko": len(mecab),
        "common_words": len(common),
        "exact_boundary_set_agreement_words": exact,
        "exact_boundary_set_agreement_rate": round(exact / len(common), 6),
        "boundary_micro": {
            "shared_boundaries": true_positive,
            "kiwi_only_boundaries": false_positive,
            "mecab_only_boundaries": false_negative,
            "precision_kiwi_boundaries_against_mecab": round(precision, 6) if precision is not None else None,
            "recall_kiwi_boundaries_against_mecab": round(recall, 6) if recall is not None else None,
            "f1_pairwise_boundary_overlap": round(f1, 6) if f1 is not None else None,
        },
        "disagreement_examples": disagreements,
        "limitations": [
            "Neither analyzer is gold; agreement is not correctness.",
            "Only morpheme boundary offsets are compared. Raw POS tags are not comparable without an explicit tagset mapping.",
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
