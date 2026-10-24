#!/usr/bin/env python3
"""Paired native IPA strict/soft and optional morphology diagnostics on UGTPHON.

Important: Kiwi/MeCab output is never injected into phonological rules. This
benchmark measures (1) the existing native strict-vs-soft IPA delta against
the same IPA references and (2) how each morphology engine segments those same
unique Hangul words. It cannot attribute an IPA change to Kiwi/MeCab until a
separately reviewed, gold-validated morphology-to-rule adapter exists.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from collections import Counter
from pathlib import Path
from typing import Any, Callable

from benchmark_ugtphon_ko import edit_distance, load_corpus, normalize_ipa

_HANGUL_TOKEN = re.compile(r"^[\uac00-\ud7a3]+$")


def _gold_variants(raw: str) -> list[str]:
    return [normalize_ipa(part) for part in raw.split(",") if part.strip()]


def _score(prediction: str, gold_raw: str) -> dict[str, Any]:
    predicted = normalize_ipa(prediction)
    variants = _gold_variants(gold_raw)
    if not variants:
        raise ValueError("no usable IPA gold variants")
    distance, closest = min(
        ((edit_distance(predicted, gold), gold) for gold in variants),
        key=lambda item: item[0],
    )
    return {
        "normalized_predicted": predicted,
        "closest_normalized_gold": closest,
        "distance": distance,
        "exact": distance == 0,
        "reference_length": len(closest),
    }


def _metrics(rows: list[dict[str, Any]], attempted: int) -> dict[str, Any]:
    denominator = sum(int(row["reference_length"]) for row in rows)
    distance = sum(int(row["distance"]) for row in rows)
    exact = sum(bool(row["exact"]) for row in rows)
    return {
        "attempted_occurrences": attempted,
        "scored_occurrences": len(rows),
        "coverage": round(len(rows) / attempted, 6) if attempted else None,
        "exact_matches": exact,
        "exact_match_rate": round(exact / len(rows), 6) if rows else None,
        "character_error_rate": round(distance / denominator, 6) if denominator else None,
        "reference_characters": denominator,
    }


def _native_prediction(fn: Callable[..., dict[str, Any]], word: str, mode: str) -> dict[str, Any]:
    result = fn(word, morphology_mode=mode)
    ipa = result.get("ipa", {}).get("ipa")
    unresolved = result.get("pronunciation_status") == "unresolved"
    return {
        "ipa": ipa,
        "normalized_ipa": normalize_ipa(ipa) if isinstance(ipa, str) and ipa else None,
        "unresolved": unresolved,
        "ipa_status": result.get("ipa_status"),
        "unresolved_contexts": result.get("unresolved_contexts", []),
        "heuristic_rules": [
            trace for trace in result.get("rules", [])
            if trace.get("confidence") in {"low", "heuristic-low-confidence"}
            or "heuristic" in str(trace.get("status", "")).lower()
        ],
    }


def _rule_boundary_alignment(
    changed_words: list[dict[str, Any]], morphology_rows: list[dict[str, Any]]
) -> dict[str, Any]:
    """Compare soft-mode heuristic rule contexts with analyzer surface offsets.

    This asks only whether an analyzer emits a boundary at the orthographic
    character offset between the two syllables named by a heuristic trace. It
    does not decide whether the phonological rule is licensed or correct.
    """
    by_word = {str(item["word"]): item for item in morphology_rows}
    events: list[dict[str, Any]] = []
    for changed in changed_words:
        word = str(changed["word"])
        morphology = by_word.get(word)
        if morphology is None:
            continue
        boundaries = {
            int(morpheme["end"])
            for morpheme in morphology.get("morphemes", [])
            if 0 < int(morpheme.get("end", 0)) < len(word)
            and int(morpheme.get("start", 0)) < int(morpheme.get("end", 0))
        }
        for trace in changed.get("soft_heuristic_rules", []):
            context = str(trace.get("license_context", ""))
            pair = context.rsplit(":", 1)[-1]
            if ">" not in pair:
                continue
            left, right = pair.split(">", 1)
            before = trace.get("before", [])
            for index in range(len(before) - 1):
                if (str(before[index].get("text", "")) != left
                        or str(before[index + 1].get("text", "")) != right):
                    continue
                offset = sum(len(str(item.get("text", ""))) for item in before[:index + 1])
                if not 0 < offset < len(word):
                    continue
                events.append({
                    "word": word,
                    "rule_id": trace.get("rule_id"),
                    "rule_name": trace.get("name"),
                    "pair": pair,
                    "orthographic_offset": offset,
                    "morphological_boundary_observed": offset in boundaries,
                    "interpretation": (
                        "boundary observed at this orthographic character offset"
                        if offset in boundaries else
                        "no boundary observed at this orthographic character offset"
                    ),
                    "morpheme_forms": [item.get("form") for item in morphology.get("morphemes", [])],
                })
    observed = sum(bool(event["morphological_boundary_observed"]) for event in events)
    return {
        "events": len(events),
        "boundary_observed": observed,
        "boundary_not_observed": len(events) - observed,
        "boundary_observation_rate": round(observed / len(events), 6) if events else None,
        "events_detail": events,
        "interpretation": (
            "descriptive boundary alignment only, not rule licensing or accuracy; "
            "absence of a boundary is not proof that a phonological rule is invalid"
        ),
    }


def evaluate(rows: list[dict[str, Any]], analyzer_name: str) -> dict[str, Any]:
    from korean_ukrainian.pipeline import phoneticize_korean
    from korean_ukrainian.research_morphology import analyzer_by_name

    occurrences: list[dict[str, str]] = []
    unique_words: list[str] = []
    seen: set[str] = set()
    for row in rows:
        for token in row["tokens"]:
            word = token.get("canonical", "")
            gold = token.get("phoneme", "")
            if not isinstance(word, str) or not _HANGUL_TOKEN.fullmatch(word):
                continue
            if not isinstance(gold, str) or not _gold_variants(gold):
                continue
            occurrences.append({"row_id": str(row["id"]), "word": word, "gold": gold})
            if word not in seen:
                seen.add(word)
                unique_words.append(word)

    native: dict[str, dict[str, dict[str, Any]]] = {"strict": {}, "soft": {}}
    native_errors: dict[str, dict[str, str]] = {"strict": {}, "soft": {}}
    for mode in ("strict", "soft"):
        for word in unique_words:
            try:
                native[mode][word] = _native_prediction(phoneticize_korean, word, mode)
            except Exception as exc:
                native_errors[mode][word] = f"{type(exc).__name__}: {exc}"

    per_mode_scored: dict[str, list[dict[str, Any]]] = {"strict": [], "soft": []}
    paired: list[dict[str, Any]] = []
    for occurrence in occurrences:
        word = occurrence["word"]
        gold = occurrence["gold"]
        scores: dict[str, dict[str, Any] | None] = {}
        for mode in ("strict", "soft"):
            pred = native[mode].get(word)
            if not pred or pred["unresolved"] or not pred["ipa"]:
                scores[mode] = None
                continue
            score = _score(pred["ipa"], gold)
            score.update({"row_id": occurrence["row_id"], "word": word, "gold": gold})
            per_mode_scored[mode].append(score)
            scores[mode] = score
        if scores["strict"] is not None and scores["soft"] is not None:
            paired.append({
                "row_id": occurrence["row_id"], "word": word,
                "strict": scores["strict"], "soft": scores["soft"],
            })

    # Instantiate only the requested analyzer; each analyzer runs independently
    # against the same unique word inventory. Do not turn its output into licenses.
    analyzer_started = time.perf_counter()
    analyzer = None
    analyzer_init_error = None
    try:
        analyzer = analyzer_by_name(analyzer_name)
    except Exception as exc:
        analyzer_init_error = f"{type(exc).__name__}: {exc}"
    morphology_rows: list[dict[str, Any]] = []
    morphology_errors: list[dict[str, str]] = []
    if analyzer is not None:
        for word in unique_words:
            try:
                result = analyzer.analyze(word).to_dict()
                morphemes = result.get("morphemes", [])
                morphology_rows.append({
                    "word": word,
                    "status": result.get("status"),
                    "morphemes": morphemes,
                    "morpheme_count": len(morphemes),
                    "split_into_multiple_morphemes": len(morphemes) > 1,
                })
            except Exception as exc:
                morphology_errors.append({
                    "word": word, "error": f"{type(exc).__name__}: {exc}",
                })
    morphology_elapsed = time.perf_counter() - analyzer_started

    strict_metrics = _metrics(per_mode_scored["strict"], len(occurrences))
    soft_metrics = _metrics(per_mode_scored["soft"], len(occurrences))
    paired_strict = [item["strict"] for item in paired]
    paired_soft = [item["soft"] for item in paired]
    paired_metrics_strict = _metrics(paired_strict, len(paired))
    paired_metrics_soft = _metrics(paired_soft, len(paired))
    exact_delta = (
        paired_metrics_soft["exact_match_rate"] - paired_metrics_strict["exact_match_rate"]
        if paired_metrics_soft["exact_match_rate"] is not None and paired_metrics_strict["exact_match_rate"] is not None
        else None
    )
    cer_delta = (
        paired_metrics_soft["character_error_rate"] - paired_metrics_strict["character_error_rate"]
        if paired_metrics_soft["character_error_rate"] is not None and paired_metrics_strict["character_error_rate"] is not None
        else None
    )

    changed_words = []
    for word in unique_words:
        strict_pred = native["strict"].get(word, {})
        soft_pred = native["soft"].get(word, {})
        ipa_changed = strict_pred.get("normalized_ipa") != soft_pred.get("normalized_ipa")
        status_changed = strict_pred.get("unresolved") != soft_pred.get("unresolved")
        if ipa_changed or status_changed:
            changed_words.append({
                "word": word,
                "ipa_changed": ipa_changed,
                "status_changed": status_changed,
                "strict_ipa": strict_pred.get("ipa"),
                "soft_ipa": soft_pred.get("ipa"),
                "strict_unresolved": strict_pred.get("unresolved"),
                "soft_unresolved": soft_pred.get("unresolved"),
                "strict_ipa_status": strict_pred.get("ipa_status"),
                "soft_ipa_status": soft_pred.get("ipa_status"),
                "soft_heuristic_rules": soft_pred.get("heuristic_rules", []),
                "strict_error": native_errors["strict"].get(word),
                "soft_error": native_errors["soft"].get(word),
            })

    morph_by_word = {item["word"]: item for item in morphology_rows}
    rule_boundary_alignment = _rule_boundary_alignment(changed_words, morphology_rows)
    events_by_word: dict[str, list[dict[str, Any]]] = {}
    for event in rule_boundary_alignment["events_detail"]:
        events_by_word.setdefault(str(event["word"]), []).append(event)
    for item in morphology_rows:
        item["native_soft_rule_boundary_events"] = events_by_word.get(str(item["word"]), [])
    split_changed = [
        item for item in changed_words
        if morph_by_word.get(item["word"], {}).get("split_into_multiple_morphemes")
    ]
    tag_counts: Counter[str] = Counter()
    for item in morphology_rows:
        for morph in item["morphemes"]:
            tag_counts[str(morph.get("tag", ""))] += 1

    return {
        "benchmark": "UGTPHON Korean test split",
        "benchmark_type": "paired native IPA strict-vs-soft plus morphology diagnostic",
        "dataset_rows": len(rows),
        "eligible_token_occurrences": len(occurrences),
        "unique_hangul_words": len(unique_words),
        "native_ipa": {
            "strict": {
                **strict_metrics,
                "unresolved_unique_words": sum(bool(x.get("unresolved")) for x in native["strict"].values()),
                "runtime_errors_unique_words": len(native_errors["strict"]),
            },
            "soft": {
                **soft_metrics,
                "unresolved_unique_words": sum(bool(x.get("unresolved")) for x in native["soft"].values()),
                "runtime_errors_unique_words": len(native_errors["soft"]),
            },
            "paired_subset": {
                "occurrences_scored_by_both": len(paired),
                "strict": paired_metrics_strict,
                "soft": paired_metrics_soft,
                "exact_rate_delta_soft_minus_strict": round(exact_delta, 6) if exact_delta is not None else None,
                "cer_delta_soft_minus_strict": round(cer_delta, 6) if cer_delta is not None else None,
                "interpretation": "positive exact delta favors soft; negative CER delta favors soft",
            },
            "unique_words_with_changed_ipa_or_status": len(changed_words),
            "changed_words_with_multi_morpheme_segmentation": len(split_changed),
            "changed_word_examples": changed_words[:200],
            "changed_words_also_split_by_analyzer": split_changed[:100],
            "morphology_rule_boundary_alignment": {
                key: value for key, value in rule_boundary_alignment.items()
                if key != "events_detail"
            },
        },
        "morphology": {
            "native_soft_rule_boundary_alignment": rule_boundary_alignment,
            "analyzer": analyzer_name,
            "status": "completed_diagnostic" if analyzer is not None and not morphology_errors else (
                "blocked_dependency" if analyzer is None else "partial_errors"
            ),
            "binding": getattr(analyzer, "binding", "kiwipiepy") if analyzer is not None else None,
            "unique_words_attempted": len(unique_words),
            "unique_words_analyzed": len(morphology_rows),
            "word_coverage": round(len(morphology_rows) / len(unique_words), 6) if unique_words else None,
            "multi_morpheme_words": sum(item["split_into_multiple_morphemes"] for item in morphology_rows),
            "max_morphemes_per_word": max((item["morpheme_count"] for item in morphology_rows), default=0),
            "words_with_10_or_more_morphemes": sum(item["morpheme_count"] >= 10 for item in morphology_rows),
            "high_segmentation_examples": [
                {
                    "word": item["word"],
                    "hangul_length": len(item["word"]),
                    "morpheme_count": item["morpheme_count"],
                    "morpheme_forms": [m.get("form") for m in item["morphemes"][:30]],
                    "truncated": len(item["morphemes"]) > 30,
                }
                for item in sorted(morphology_rows, key=lambda row: (-row["morpheme_count"], row["word"]))
                if item["morpheme_count"] >= 10
            ][:25],
            "morpheme_count_distribution": dict(sorted(Counter(str(item["morpheme_count"]) for item in morphology_rows).items())),
            "tag_counts_top_50": tag_counts.most_common(50),
            "elapsed_seconds": round(morphology_elapsed, 6),
            "initialization_error": analyzer_init_error,
            "errors": morphology_errors[:100],
            "results": morphology_rows,
            "interpretation": (
                "segmentation and tags only; no gold morphology labels, no accuracy score, "
                "and no analyzer output was injected into the IPA engine"
            ),
        },
        "limitations": [
            "UGTPHON is noisy user-generated text, not normative NIKL gold.",
            "The reference IPA convention may differ from this project's broad IPA conventions.",
            "Strict/soft compares an existing native heuristic mode; soft is not the Kiwi or MeCab output.",
            "Kiwi/MeCab are measured on the exact same unique Hangul word inventory, but their segmentation is not fed into phonology.",
            "A causal morphology-to-IPA comparison requires an independently adjudicated morphology gold set and a reviewed rule-licensing adapter.",
            "This report evaluates Korean IPA only, not Ukrainian target adaptation.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=os.environ.get("UGTPHON_KO_TEST_PATH"))
    parser.add_argument("--analyzer", required=True, choices=["kiwi", "mecab-ko"])
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if args.corpus is None:
        parser.error("provide --corpus or set UGTPHON_KO_TEST_PATH")
    try:
        rows = load_corpus(Path(args.corpus))
        report = evaluate(rows, args.analyzer)
    except Exception as exc:
        print(f"benchmark failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "analyzer": args.analyzer,
        "status": report["morphology"]["status"],
        "dataset_rows": report["dataset_rows"],
        "eligible_token_occurrences": report["eligible_token_occurrences"],
        "unique_hangul_words": report["unique_hangul_words"],
        "strict": report["native_ipa"]["strict"],
        "soft": report["native_ipa"]["soft"],
        "paired_delta": report["native_ipa"]["paired_subset"],
        "morphology": {key: value for key, value in report["morphology"].items()
                       if key not in {"results", "errors", "tag_counts_top_50"}},
        "changed_words": report["native_ipa"]["unique_words_with_changed_ipa_or_status"],
        "changed_and_multi_morpheme": report["native_ipa"]["changed_words_with_multi_morpheme_segmentation"],
        "output": str(args.output),
    }, ensure_ascii=False, indent=2))
    if report["morphology"]["status"] != "completed_diagnostic":
        return 1
    if report["native_ipa"]["strict"]["runtime_errors_unique_words"] or report["native_ipa"]["soft"]["runtime_errors_unique_words"]:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
