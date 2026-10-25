#!/usr/bin/env python3
"""Paired native IPA strict/soft and optional morphology diagnostics on UGTPHON.

Default native strict/soft IPA results are always measured unchanged. A separate
counterfactual mode retains a native soft-rule license only when the selected
analyzer exposes the corresponding orthographic boundary. This deliberately
naive boundary-only gate is diagnostic, not a valid rule-licensing adapter:
boundary evidence is not sufficient to decide morphophonological class.
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


def _score_paired_primary_reference(prediction: str, gold_raw: str) -> dict[str, Any]:
    """Score a paired comparison against one fixed primary reference variant.

    Exact match accepts any explicitly listed gold variant. CER uses the first
    variant for every strategy, keeping the denominator identical within a
    paired subset instead of allowing each engine to choose a different-length
    closest reference.
    """
    predicted = normalize_ipa(prediction)
    variants = _gold_variants(gold_raw)
    if not variants:
        raise ValueError("no usable IPA gold variants")
    primary = variants[0]
    return {
        "normalized_predicted": predicted,
        "closest_normalized_gold": primary,
        "distance": edit_distance(predicted, primary),
        "exact": predicted in variants,
        "reference_length": len(primary),
    }


def _paired_comparison(
    scores_by_strategy: dict[str, list[dict[str, Any]]],
    attempted: int,
    baseline: str,
    candidate: str,
) -> dict[str, Any]:
    """Summarize strategies on the same occurrences and fixed CER references."""
    baseline_rows = scores_by_strategy[baseline]
    candidate_rows = scores_by_strategy[candidate]
    if len(baseline_rows) != len(candidate_rows):
        raise ValueError("paired strategy scores must have identical occurrence counts")
    count = len(baseline_rows)
    base_metrics = _metrics(baseline_rows, attempted)
    candidate_metrics = _metrics(candidate_rows, attempted)
    exact_wins = exact_losses = distance_wins = distance_losses = ties = 0
    for base, cand in zip(baseline_rows, candidate_rows):
        if bool(cand["exact"]) and not bool(base["exact"]):
            exact_wins += 1
        elif bool(base["exact"]) and not bool(cand["exact"]):
            exact_losses += 1
        if int(cand["distance"]) < int(base["distance"]):
            distance_wins += 1
        elif int(cand["distance"]) > int(base["distance"]):
            distance_losses += 1
        else:
            ties += 1
    exact_delta = (
        candidate_metrics["exact_match_rate"] - base_metrics["exact_match_rate"]
        if candidate_metrics["exact_match_rate"] is not None and base_metrics["exact_match_rate"] is not None
        else None
    )
    cer_delta = (
        candidate_metrics["character_error_rate"] - base_metrics["character_error_rate"]
        if candidate_metrics["character_error_rate"] is not None and base_metrics["character_error_rate"] is not None
        else None
    )
    return {
        "baseline": baseline,
        "candidate": candidate,
        "paired_occurrences_scored_by_both": count,
        "baseline_metrics": base_metrics,
        "candidate_metrics": candidate_metrics,
        "exact_rate_delta_candidate_minus_baseline": round(exact_delta, 6) if exact_delta is not None else None,
        "cer_delta_candidate_minus_baseline": round(cer_delta, 6) if cer_delta is not None else None,
        "occurrence_outcomes": {
            "candidate_exact_wins": exact_wins,
            "candidate_exact_losses": exact_losses,
            "candidate_lower_edit_distance": distance_wins,
            "candidate_higher_edit_distance": distance_losses,
            "equal_edit_distance": ties,
        },
        "cer_contract": "fixed first listed gold IPA variant per occurrence; identical denominator across paired strategies",
        "interpretation": "positive exact delta favors candidate; negative CER delta favors candidate",
    }


def _native_prediction(
    fn: Callable[..., dict[str, Any]], word: str, mode: str,
    rule_licenses: list[str] | None = None,
) -> dict[str, Any]:
    if rule_licenses is None:
        result = fn(word, morphology_mode=mode)
    else:
        result = fn(word, morphology_mode=mode, rule_licenses=rule_licenses)
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
    soft_rule_candidates: list[dict[str, Any]],
    morphology_rows: list[dict[str, Any]],
    soft_licenses_by_word: dict[str, list[str]],
) -> dict[str, Any]:
    """Compare every actually changed soft-rule pair with analyzer source offsets.

    RuleTrace exposes only one license_context even when a rule can change
    several pairs. Reconstruct the full set of candidate soft licenses, then
    keep only pairs whose syllable state changed in that rule trace. This avoids
    treating the trace's single context string as a complete event inventory.
    """
    by_word = {str(item["word"]): item for item in morphology_rows}
    events: list[dict[str, Any]] = []
    for candidate in soft_rule_candidates:
        word = str(candidate["word"])
        morphology = by_word.get(word)
        if morphology is None:
            continue
        morphemes = morphology.get("morphemes", [])
        valid_spans = [
            (int(morpheme.get("start", -1)), int(morpheme.get("end", -1)))
            for morpheme in morphemes
            if 0 <= int(morpheme.get("start", -1)) < int(morpheme.get("end", -1)) <= len(word)
        ]
        starts = {start for start, _ in valid_spans}
        ends = {end for _, end in valid_spans}
        boundaries = {offset for offset in starts & ends if 0 < offset < len(word)}
        for trace in candidate.get("soft_heuristic_rules", []):
            rule_id = str(trace.get("rule_id", ""))
            before = trace.get("before", [])
            after = trace.get("after", [])
            if len(before) != len(after):
                continue
            for license_context in soft_licenses_by_word.get(word, []):
                parts = str(license_context).split(":", 3)
                if len(parts) != 4 or parts[0] != rule_id or ">" not in parts[3]:
                    continue
                pair = parts[3]
                left, right = pair.split(">", 1)
                for index in range(len(before) - 1):
                    if (str(before[index].get("text", "")) != left
                            or str(before[index + 1].get("text", "")) != right):
                        continue
                    left_changed = any(
                        before[index].get(field) != after[index].get(field)
                        for field in ("onset", "nucleus", "coda")
                    )
                    right_changed = any(
                        before[index + 1].get(field) != after[index + 1].get(field)
                        for field in ("onset", "nucleus", "coda")
                    )
                    if not (left_changed or right_changed):
                        continue
                    offset = sum(len(str(item.get("text", ""))) for item in before[:index + 1])
                    if not 0 < offset < len(word):
                        continue
                    events.append({
                        "word": word,
                        "rule_id": rule_id,
                        "rule_name": trace.get("name"),
                        "pair": pair,
                        "license_context": license_context,
                        "orthographic_offset": offset,
                        "morphological_boundary_observed": offset in boundaries,
                        "interpretation": (
                            "boundary observed at this orthographic character offset"
                            if offset in boundaries else
                            "no boundary observed at this orthographic character offset"
                        ),
                        "morpheme_forms": [item.get("form") for item in morphemes],
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
    from korean_ukrainian.phonology import parse_syllables
    from korean_ukrainian.research_morphology import analyzer_by_name
    from korean_ukrainian.rules import _source_backed_rule_licenses
    from korean_ukrainian.soft_morphology import soft_formal_licenses

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
    soft_rule_candidates = [
        {"word": word, "soft_heuristic_rules": pred.get("heuristic_rules", [])}
        for word, pred in native["soft"].items()
        if pred.get("heuristic_rules")
    ]
    soft_licenses_by_word: dict[str, list[str]] = {}
    for word in unique_words:
        syllables = parse_syllables(word)
        exact_licenses = set(_source_backed_rule_licenses(syllables, "same_word"))
        soft_licenses_by_word[word] = [
            license for license in soft_formal_licenses(syllables)
            if license not in exact_licenses
        ]
    rule_boundary_alignment = _rule_boundary_alignment(
        soft_rule_candidates, morphology_rows, soft_licenses_by_word
    )
    events_by_word: dict[str, list[dict[str, Any]]] = {}
    for event in rule_boundary_alignment["events_detail"]:
        events_by_word.setdefault(str(event["word"]), []).append(event)
    for item in morphology_rows:
        item["native_soft_rule_boundary_events"] = events_by_word.get(str(item["word"]), [])

    # Counterfactual only: keep the native soft engine's proposed exact rule
    # contexts only when the selected analyzer exposes a boundary at that
    # orthographic offset. This does NOT establish that the rule is licensed;
    # it measures the effect of a boundary-only gate without changing runtime.
    boundary_gated_predictions: dict[str, dict[str, Any]] = {}
    boundary_gated_errors: dict[str, str] = {}
    selected_licenses = 0
    suppressed_licenses = 0
    for word in unique_words:
        events = events_by_word.get(word, [])
        licenses = sorted({
            str(event["license_context"])
            for event in events
            if event.get("morphological_boundary_observed") and event.get("license_context")
        })
        selected_licenses += len(licenses)
        suppressed_licenses += sum(
            1 for event in events
            if not event.get("morphological_boundary_observed") and event.get("license_context")
        )
        try:
            boundary_gated_predictions[word] = _native_prediction(
                phoneticize_korean, word, "strict", rule_licenses=licenses
            )
        except Exception as exc:
            boundary_gated_errors[word] = f"{type(exc).__name__}: {exc}"
    boundary_gated_scored: list[dict[str, Any]] = []
    for occurrence in occurrences:
        word = occurrence["word"]
        pred = boundary_gated_predictions.get(word)
        if not pred or pred["unresolved"] or not pred["ipa"]:
            continue
        score = _score(pred["ipa"], occurrence["gold"])
        score.update({"row_id": occurrence["row_id"], "word": word, "gold": occurrence["gold"]})
        boundary_gated_scored.append(score)
    boundary_gated_metrics = _metrics(boundary_gated_scored, len(occurrences))

    # Fair three-way ablation: compare strict, soft and boundary-gated outputs
    # only where all three strategies return a scorable IPA prediction. For
    # CER, use the same primary reference variant for each strategy/occurrence.
    triad_scores: dict[str, list[dict[str, Any]]] = {
        "strict": [], "soft": [], "boundary_gated": [],
    }
    triad_occurrences = 0
    for occurrence in occurrences:
        word = occurrence["word"]
        predictions = {
            "strict": native["strict"].get(word),
            "soft": native["soft"].get(word),
            "boundary_gated": boundary_gated_predictions.get(word),
        }
        if any(not pred or pred.get("unresolved") or not pred.get("ipa") for pred in predictions.values()):
            continue
        triad_occurrences += 1
        for strategy, pred in predictions.items():
            score = _score_paired_primary_reference(pred["ipa"], occurrence["gold"])
            score.update({"row_id": occurrence["row_id"], "word": word, "gold": occurrence["gold"]})
            triad_scores[strategy].append(score)
    triad_comparison = {
        "scored_occurrences_by_all_three": triad_occurrences,
        "boundary_gated_vs_strict": _paired_comparison(
            triad_scores, triad_occurrences, "strict", "boundary_gated"
        ),
        "boundary_gated_vs_soft": _paired_comparison(
            triad_scores, triad_occurrences, "soft", "boundary_gated"
        ),
        "soft_vs_strict": _paired_comparison(
            triad_scores, triad_occurrences, "strict", "soft"
        ),
        "interpretation": (
            "paired diagnostic only; strict, soft and boundary-gated are scored on the same "
            "occurrences; exact accepts any listed variant while CER uses the first listed variant"
        ),
    }
    boundary_gated_changed_vs_strict = [
        word for word in unique_words
        if (
            boundary_gated_predictions.get(word, {}).get("normalized_ipa")
            != native["strict"].get(word, {}).get("normalized_ipa")
            or boundary_gated_predictions.get(word, {}).get("unresolved")
            != native["strict"].get(word, {}).get("unresolved")
        )
    ]
    boundary_gated_changed_vs_soft = [
        word for word in unique_words
        if (
            boundary_gated_predictions.get(word, {}).get("normalized_ipa")
            != native["soft"].get(word, {}).get("normalized_ipa")
            or boundary_gated_predictions.get(word, {}).get("unresolved")
            != native["soft"].get(word, {}).get("unresolved")
        )
    ]
    boundary_gated_changed_examples = [
        {
            "word": word,
            "strict_ipa": native["strict"].get(word, {}).get("ipa"),
            "soft_ipa": native["soft"].get(word, {}).get("ipa"),
            "boundary_gated_ipa": boundary_gated_predictions.get(word, {}).get("ipa"),
            "strict_unresolved": native["strict"].get(word, {}).get("unresolved"),
            "soft_unresolved": native["soft"].get(word, {}).get("unresolved"),
            "boundary_gated_unresolved": boundary_gated_predictions.get(word, {}).get("unresolved"),
            "observed_licenses": [
                event.get("license_context") for event in events_by_word.get(word, [])
                if event.get("morphological_boundary_observed") and event.get("license_context")
            ],
            "suppressed_licenses": [
                event.get("license_context") for event in events_by_word.get(word, [])
                if not event.get("morphological_boundary_observed") and event.get("license_context")
            ],
        }
        for word in boundary_gated_changed_vs_strict
    ][:100]
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
        "benchmark_type": "native strict/soft IPA, counterfactual boundary-gated IPA, and morphology diagnostics",
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
            "boundary_gated_by_analyzer": {
                **boundary_gated_metrics,
                "status": "counterfactual_research_only",
                "unique_words_with_output_or_status_change_vs_strict": len(boundary_gated_changed_vs_strict),
                "unique_words_with_output_or_status_change_vs_soft": len(boundary_gated_changed_vs_soft),
                "changed_examples_vs_strict": boundary_gated_changed_examples,
                "selected_native_soft_rule_licenses": selected_licenses,
                "suppressed_native_soft_rule_licenses": suppressed_licenses,
                "paired_comparison": triad_comparison,
                "runtime_errors_unique_words": len(boundary_gated_errors),
                "runtime_error_examples": dict(list(boundary_gated_errors.items())[:20]),
                "interpretation": (
                    "counterfactual: only native soft-rule licenses whose exact orthographic boundary "
                    "was observed by this analyzer were retained; boundary evidence is not sufficient "
                    "to license phonology, so this must not be used in production"
                ),
            },
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
                "segmentation and tags only; no gold morphology labels or morphology accuracy score; "
                "the default native strict/soft paths are unchanged, and a separate boundary-gated "
                "counterfactual is scored only as a research ablation"
            ),
        },
        "limitations": [
            "UGTPHON is noisy user-generated text, not normative NIKL gold.",
            "The reference IPA convention may differ from this project's broad IPA conventions.",
            "Strict/soft compares an existing native heuristic mode; soft is not the Kiwi or MeCab output.",
            "Kiwi/MeCab are measured on the exact same unique Hangul word inventory; the default native strict/soft paths do not consume their output.",
            "The boundary-gated path is an intentionally naive counterfactual ablation, not a linguistically valid rule-licensing adapter.",
            "A production morphology-to-IPA integration requires an independently adjudicated morphology gold set and a reviewed rule-licensing adapter.",
            "This report evaluates Korean IPA only, not Ukrainian target adaptation.",
        ],
    }


def evaluate_consensus(rows: list[dict[str, Any]]) -> dict[str, Any]:
    """Compare an optional two-analyzer formal-boundary consensus against strict/soft.

    Reuses the existing analyzer reports and score contract. The consensus path
    is a research candidate only: it does not provide IPA gold and cannot
    authorize Ukrainian output.
    """
    from korean_ukrainian.pipeline import phoneticize_korean
    from korean_ukrainian.morphology_rule_licenses import phoneticize_korean_with_analyzer_consensus

    mecab_report = evaluate(rows, "mecab-ko")
    kiwi_report = evaluate(rows, "kiwi")
    for report in (mecab_report, kiwi_report):
        if report["morphology"]["status"] != "completed_diagnostic":
            raise RuntimeError("both morphology analyzers must complete before consensus evaluation")

    mecab_by_word = {item["word"]: item for item in mecab_report["morphology"]["results"]}
    kiwi_by_word = {item["word"]: item for item in kiwi_report["morphology"]["results"]}
    unique_words = list(mecab_by_word)
    occurrences: list[dict[str, str]] = []
    for row in rows:
        for token in row["tokens"]:
            word = token.get("canonical", "")
            gold = token.get("phoneme", "")
            if isinstance(word, str) and _HANGUL_TOKEN.fullmatch(word) and isinstance(gold, str) and _gold_variants(gold):
                occurrences.append({"row_id": str(row["id"]), "word": word, "gold": gold})

    consensus_by_word: dict[str, dict[str, Any]] = {}
    strict_by_word: dict[str, dict[str, Any]] = {}
    errors: dict[str, str] = {}
    for word in unique_words:
        try:
            analyses = [
                {"text": word, "analyzer": "mecab-ko", "morphemes": mecab_by_word[word]["morphemes"]},
                {"text": word, "analyzer": "kiwi", "morphemes": kiwi_by_word[word]["morphemes"]},
            ]
            result = phoneticize_korean_with_analyzer_consensus(word, analyses)
            ipa = result.get("ipa", {}).get("ipa")
            consensus_by_word[word] = {
                "ipa": ipa,
                "normalized_ipa": normalize_ipa(ipa) if isinstance(ipa, str) and ipa else None,
                "unresolved": result.get("pronunciation_status") == "unresolved",
                "ipa_status": result.get("ipa_status"),
                "morphology_analysis": result.get("morphology_analysis", {}),
                "unresolved_contexts": result.get("unresolved_contexts", []),
            }
            strict_by_word[word] = _native_prediction(phoneticize_korean, word, "strict")
        except Exception as exc:
            errors[word] = f"{type(exc).__name__}: {exc}"

    consensus_scored: list[dict[str, Any]] = []
    paired_scores: dict[str, list[dict[str, Any]]] = {"strict": [], "analyzer_consensus": []}
    resolved_words: list[dict[str, Any]] = []
    changed_words: list[dict[str, Any]] = []
    for occurrence in occurrences:
        word = occurrence["word"]
        candidate = consensus_by_word.get(word)
        strict = strict_by_word.get(word)
        if not candidate or not strict:
            continue
        if strict.get("unresolved") and not candidate.get("unresolved") and candidate.get("ipa"):
            resolved_words.append({
                "word": word,
                "ipa": candidate["ipa"],
                "ipa_status": candidate.get("ipa_status"),
                "applied_licenses": candidate.get("morphology_analysis", {}).get("applied_licenses", []),
            })
        if (
            strict.get("unresolved") != candidate.get("unresolved")
            or strict.get("normalized_ipa") != candidate.get("normalized_ipa")
        ) and not any(item["word"] == word for item in changed_words):
            changed_words.append({
                "word": word,
                "strict_ipa": strict.get("ipa"),
                "consensus_ipa": candidate.get("ipa"),
                "strict_unresolved": strict.get("unresolved"),
                "consensus_unresolved": candidate.get("unresolved"),
                "ipa_status": candidate.get("ipa_status"),
                "applied_licenses": candidate.get("morphology_analysis", {}).get("applied_licenses", []),
            })
        if candidate.get("unresolved") or not candidate.get("ipa"):
            continue
        score = _score(candidate["ipa"], occurrence["gold"])
        score.update({"row_id": occurrence["row_id"], "word": word, "gold": occurrence["gold"]})
        consensus_scored.append(score)
        if not strict.get("unresolved") and strict.get("ipa"):
            paired_scores["strict"].append(_score_paired_primary_reference(strict["ipa"], occurrence["gold"]))
            paired_scores["analyzer_consensus"].append(_score_paired_primary_reference(candidate["ipa"], occurrence["gold"]))

    consensus_metrics = _metrics(consensus_scored, len(occurrences))
    paired = _paired_comparison(paired_scores, len(occurrences), "strict", "analyzer_consensus")
    unresolved_unique = sum(
        bool(item.get("unresolved")) for item in consensus_by_word.values()
    )
    return {
        "benchmark": "UGTPHON Korean test split",
        "benchmark_type": "strict/soft plus two-analyzer formal-boundary consensus candidate",
        "dataset_rows": len(rows),
        "eligible_token_occurrences": len(occurrences),
        "unique_hangul_words": len(unique_words),
        "native_ipa": {
            "strict": mecab_report["native_ipa"]["strict"],
            "soft": mecab_report["native_ipa"]["soft"],
            "paired_subset": mecab_report["native_ipa"]["paired_subset"],
            "unique_words_with_changed_ipa_or_status": len(changed_words),
            "changed_words_with_multi_morpheme_segmentation": len(changed_words),
            "analyzer_consensus": {
                **consensus_metrics,
                "unresolved_occurrences": len(occurrences) - len(consensus_scored),
                "unresolved_unique_words": unresolved_unique,
                "runtime_errors_unique_words": len(errors),
                "runtime_error_examples": dict(list(errors.items())[:50]),
                "newly_resolved_unique_words_vs_strict": len({item["word"] for item in resolved_words}),
                "newly_resolved_examples": resolved_words[:100],
                "changed_unique_words_vs_strict": len(changed_words),
                "changed_examples": changed_words[:100],
                "paired_vs_strict": paired,
                "status": "diagnostic_only_analyzer_consensus",
            },
        },
        "morphology": {
            "status": "completed_diagnostic",
            "analyzers": ["kiwi", "mecab-ko"],
            "analysis_count_per_word": 2,
            "rule_licensing": "only shared orthographic boundaries with formal POS tags; exact forms only",
            "interpretation": "candidate morphology support, not gold segmentation or pronunciation",
        },
        "limitations": [
            "UGTPHON is noisy user-generated text, not normative NIKL gold.",
            "The reference IPA convention may differ from this project's broad IPA conventions.",
            "Morphological analyzer consensus supports a boundary/tag hypothesis; it does not prove the phonological reading.",
            "Candidate IPA is explicitly diagnostic-only and must not bypass the IPA-to-Ukrainian acceptance gate.",
            "Unspaced multiword inputs may still have cross-word phonology errors even when a local ending is recognized.",
            "This report evaluates Korean IPA only, not Ukrainian target adaptation.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=os.environ.get("UGTPHON_KO_TEST_PATH"))
    parser.add_argument("--analyzer", required=True, choices=["kiwi", "mecab-ko", "consensus"])
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if args.corpus is None:
        parser.error("provide --corpus or set UGTPHON_KO_TEST_PATH")
    try:
        rows = load_corpus(Path(args.corpus))
        report = evaluate_consensus(rows) if args.analyzer == "consensus" else evaluate(rows, args.analyzer)
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
        "analyzer_consensus": report["native_ipa"].get("analyzer_consensus"),
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
    if args.analyzer == "consensus" and report["native_ipa"]["analyzer_consensus"]["runtime_errors_unique_words"]:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
