#!/usr/bin/env python3
"""Stratify the full native-vs-g2pk UGTPHON diagnostic artifact.

This is an analysis-only utility. It consumes the JSON artifact emitted by
scripts/benchmark_multi_engine_ko.py; it does not download data, infer gold
phonology, or alter production rules. All rates remain relative to the
artifact's selected IPA references and declared normalization profile.
"""
from __future__ import annotations

import argparse
import collections
import json
import random
import statistics
import unicodedata
from pathlib import Path
from typing import Any

IGNORABLE_DIACRITICS = {"\u031d", "\u0339", "\u031e", "\u0320"}
TIE_BAR = "\u0361"
NATIVE = "native"
G2PK = "g2pk_0_9_4"


def normalize_ipa(value: str) -> str:
    value = unicodedata.normalize("NFD", value).replace("g", "ɡ").replace(TIE_BAR, "")
    value = "".join(
        char for char in value
        if not char.isspace() and char != "." and char not in IGNORABLE_DIACRITICS
    )
    return unicodedata.normalize("NFC", value)


def _source(row_id: str) -> str:
    if row_id.startswith("multilexnorm2026"):
        return "MultiLexNorm++"
    if row_id.startswith("dc_inside"):
        return "DC Inside"
    return "other/unknown"


def _length_group(length: int) -> str:
    if length <= 2:
        return "1-2 Hangul blocks"
    if length == 3:
        return "3 Hangul blocks"
    return "4+ Hangul blocks"


def _frequency_group(count: int) -> str:
    if count == 1:
        return "1 occurrence in test"
    if count <= 3:
        return "2-3 occurrences in test"
    return "4+ occurrences in test"


def _ipa_length_group(length: int) -> str:
    if length <= 5:
        return "<=5 normalized IPA characters"
    if length <= 7:
        return "6-7 normalized IPA characters"
    return "8+ normalized IPA characters"


def _rate(count: int, denominator: int) -> float | None:
    return round(count / denominator, 6) if denominator else None


def _summarize_group(rows: list[dict[str, Any]]) -> dict[str, Any]:
    paired = [row for row in rows if row[NATIVE]["status"] == "scored"]
    result: dict[str, Any] = {
        "occurrences_in_stratum": len(rows),
        "unique_types_in_stratum": len({row["token"] for row in rows}),
        "native_abstentions": len(rows) - len(paired),
        "paired_scored_occurrences": len(paired),
    }
    for key in (NATIVE, G2PK):
        scored = [row for row in paired if row[key]["status"] == "scored"]
        exact = sum(bool(row[key]["exact"]) for row in scored)
        edits = sum(int(row[key]["distance"]) for row in scored)
        reference_chars = sum(len(normalize_ipa(row["gold"])) for row in scored)
        distances = [int(row[key]["distance"]) for row in scored]
        wrong_distances = [distance for distance in distances if distance > 0]
        result[key] = {
            "exact_matches": exact,
            "exact_match_rate": _rate(exact, len(scored)),
            "total_edit_distance": edits,
            "cer": round(edits / reference_chars, 6) if reference_chars else None,
            "mean_edits_per_token": round(edits / len(scored), 6) if scored else None,
            "median_edit_distance_on_nonexact": (
                statistics.median(wrong_distances)
                if wrong_distances else 0
            ),
        }
    native_exact = sum(bool(row[NATIVE]["exact"]) for row in paired)
    g2pk_exact = sum(bool(row[G2PK]["exact"]) for row in paired)
    result["paired_exact_comparison"] = {
        "g2pk_exact_wins": sum(
            bool(row[G2PK]["exact"]) and not bool(row[NATIVE]["exact"]) for row in paired
        ),
        "native_exact_wins": sum(
            bool(row[NATIVE]["exact"]) and not bool(row[G2PK]["exact"]) for row in paired
        ),
        "ties": sum(bool(row[NATIVE]["exact"]) == bool(row[G2PK]["exact"]) for row in paired),
        "delta_pp_g2pk_minus_native": (
            round(100 * (g2pk_exact - native_exact) / len(paired), 6) if paired else None
        ),
    }
    return result


def _alignment_operations(reference: str, prediction: str) -> list[tuple[str, str, str]]:
    """Return one minimum-edit alignment; tied optimal alignments can differ."""
    n, m = len(reference), len(prediction)
    costs = [[0] * (m + 1) for _ in range(n + 1)]
    back: list[list[str | None]] = [[None] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        costs[i][0] = i
        back[i][0] = "reference_only"
    for j in range(1, m + 1):
        costs[0][j] = j
        back[0][j] = "prediction_only"
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            diagonal = costs[i - 1][j - 1] + (reference[i - 1] != prediction[j - 1])
            options = [
                (diagonal, "match" if reference[i - 1] == prediction[j - 1] else "substitution"),
                (costs[i - 1][j] + 1, "reference_only"),
                (costs[i][j - 1] + 1, "prediction_only"),
            ]
            costs[i][j], back[i][j] = min(
                options,
                key=lambda item: (
                    item[0],
                    {"match": 0, "substitution": 0, "reference_only": 1, "prediction_only": 2}[item[1]],
                ),
            )
    operations: list[tuple[str, str, str]] = []
    i, j = n, m
    while i or j:
        operation = back[i][j]
        if operation in ("match", "substitution"):
            if operation == "substitution":
                operations.append((operation, reference[i - 1], prediction[j - 1]))
            i -= 1
            j -= 1
        elif operation == "reference_only":
            operations.append((operation, reference[i - 1], ""))
            i -= 1
        else:
            operations.append(("prediction_only", "", prediction[j - 1]))
            j -= 1
    return list(reversed(operations))


def _symbol_error_profile(
    rows: list[dict[str, Any]], engine: str, limit: int = 20
) -> dict[str, Any]:
    substitutions: collections.Counter[tuple[str, str]] = collections.Counter()
    reference_only: collections.Counter[str] = collections.Counter()
    prediction_only: collections.Counter[str] = collections.Counter()
    reference_symbols_edited: collections.Counter[str] = collections.Counter()
    nonexact = 0
    for row in rows:
        if row[NATIVE]["status"] != "scored":
            continue
        reference = normalize_ipa(str(row["gold"]))
        prediction = normalize_ipa(str(row[engine]["ipa"]))
        if reference == prediction:
            continue
        nonexact += 1
        for operation, ref_char, pred_char in _alignment_operations(reference, prediction):
            if operation == "substitution":
                substitutions[(ref_char, pred_char)] += 1
                reference_symbols_edited[ref_char] += 1
            elif operation == "reference_only":
                reference_only[ref_char] += 1
                reference_symbols_edited[ref_char] += 1
            elif operation == "prediction_only":
                prediction_only[pred_char] += 1
    return {
        "nonexact_occurrences_aligned": nonexact,
        "top_substitutions": [
            {"reference": ref_char, "prediction": pred_char, "count": count}
            for (ref_char, pred_char), count in substitutions.most_common(limit)
        ],
        "top_reference_only_symbols": [
            {"symbol": symbol, "count": count}
            for symbol, count in reference_only.most_common(limit)
        ],
        "top_prediction_only_symbols": [
            {"symbol": symbol, "count": count}
            for symbol, count in prediction_only.most_common(limit)
        ],
        "top_reference_symbols_in_edit_operations": [
            {"symbol": symbol, "count": count}
            for symbol, count in reference_symbols_edited.most_common(limit)
        ],
        "warning": "One optimal character alignment is not a phonological error label; tied alignments may assign edits differently.",
    }


def _type_cluster_delta_ci(
    paired: list[dict[str, Any]], replicates: int = 10_000, seed: int = 20261025
) -> dict[str, Any]:
    """Sensitivity interval resampling lexical types, keeping all their occurrences together."""
    by_type: dict[str, list[dict[str, Any]]] = collections.defaultdict(list)
    for row in paired:
        by_type[row["token"]].append(row)
    types = list(by_type.values())
    if len(types) < 2:
        return {"replicates": 0, "ci_95": None, "unique_types": len(types)}
    rng = random.Random(seed)
    deltas: list[float] = []
    for _ in range(replicates):
        sample = [rng.choice(types) for _ in range(len(types))]
        total = sum(len(group) for group in sample)
        if not total:
            continue
        native_exact = sum(
            bool(row[NATIVE]["exact"]) for group in sample for row in group
        )
        g2pk_exact = sum(
            bool(row[G2PK]["exact"]) for group in sample for row in group
        )
        deltas.append(100 * (g2pk_exact - native_exact) / total)
    deltas.sort()
    return {
        "method": "lexical-type cluster bootstrap; occurrence-weighted rate within sampled types",
        "seed": seed,
        "replicates": len(deltas),
        "unique_types": len(types),
        "ci_95": [
            round(deltas[int((len(deltas) - 1) * 0.025)], 6),
            round(deltas[int((len(deltas) - 1) * 0.975)], 6),
        ] if deltas else None,
        "warning": "Sensitivity analysis only; does not jointly cluster by sentence row and lexical type.",
    }


def summarize_report(report: dict[str, Any], type_bootstrap_replicates: int = 10_000) -> dict[str, Any]:
    audit = report.get("native_g2pk_pairwise_audit")
    if not isinstance(audit, dict) or not isinstance(audit.get("occurrences"), list):
        raise ValueError("artifact lacks native_g2pk_pairwise_audit.occurrences")
    rows = audit["occurrences"]
    required = {"row_id", "token", "gold", "category", NATIVE, G2PK}
    for index, row in enumerate(rows):
        if not isinstance(row, dict) or not required.issubset(row):
            raise ValueError(f"pairwise occurrence {index} lacks required fields")
        for engine in (NATIVE, G2PK):
            if not isinstance(row[engine], dict) or "status" not in row[engine]:
                raise ValueError(f"pairwise occurrence {index} has invalid {engine} result")

    frequency = collections.Counter(row["token"] for row in rows)
    strata: dict[str, dict[str, dict[str, Any]]] = {}
    dimensions = {
        "source": lambda row: _source(str(row["row_id"])),
        "hangul_length": lambda row: _length_group(len(str(row["token"]))),
        "test_set_frequency": lambda row: _frequency_group(frequency[str(row["token"])]),
        "normalized_ipa_reference_length": lambda row: _ipa_length_group(
            len(normalize_ipa(str(row["gold"])))
        ),
    }
    for dimension, classifier in dimensions.items():
        grouped: dict[str, list[dict[str, Any]]] = collections.defaultdict(list)
        for row in rows:
            grouped[classifier(row)].append(row)
        strata[dimension] = {
            label: _summarize_group(group) for label, group in sorted(grouped.items())
        }

    paired = [row for row in rows if row[NATIVE]["status"] == "scored"]
    edit_histograms = {}
    for engine in (NATIVE, G2PK):
        hist = collections.Counter(int(row[engine]["distance"]) for row in paired)
        wrong = [row for row in paired if int(row[engine]["distance"]) > 0]
        edit_histograms[engine] = {
            "distance_histogram": {str(k): hist[k] for k in sorted(hist)},
            "nonexact_occurrences": len(wrong),
            "one_edit_share_of_nonexact": _rate(
                sum(int(row[engine]["distance"]) == 1 for row in wrong), len(wrong)
            ),
            "two_or_fewer_edits_share_of_nonexact": _rate(
                sum(int(row[engine]["distance"]) <= 2 for row in wrong), len(wrong)
            ),
        }

    by_type: dict[str, list[dict[str, Any]]] = collections.defaultdict(list)
    for row in paired:
        by_type[str(row["token"])].append(row)
    type_deltas: list[float] = []
    type_wins = type_losses = type_ties = 0
    native_type_rates: list[float] = []
    g2pk_type_rates: list[float] = []
    for group in by_type.values():
        n_rate = sum(bool(row[NATIVE]["exact"]) for row in group) / len(group)
        g_rate = sum(bool(row[G2PK]["exact"]) for row in group) / len(group)
        native_type_rates.append(n_rate)
        g2pk_type_rates.append(g_rate)
        type_deltas.append(g_rate - n_rate)
        if g_rate > n_rate:
            type_wins += 1
        elif n_rate > g_rate:
            type_losses += 1
        else:
            type_ties += 1

    no_length_word = [row for row in paired if row["token"] != "없는"]
    native_edits_without_word = sum(int(row[NATIVE]["distance"]) for row in no_length_word)
    g2pk_edits_without_word = sum(int(row[G2PK]["distance"]) for row in no_length_word)
    g2pk_wins = sum(
        bool(row[G2PK]["exact"]) and not bool(row[NATIVE]["exact"]) for row in paired
    )
    native_wins = sum(
        bool(row[NATIVE]["exact"]) and not bool(row[G2PK]["exact"]) for row in paired
    )

    return {
        "analysis": "descriptive stratification of the pinned diagnostic artifact; not normative accuracy",
        "benchmark_version": report.get("benchmark_version"),
        "dataset_rows": report.get("dataset_rows"),
        "eligible_token_occurrences": report.get("eligible_token_occurrences"),
        "unique_hangul_words": report.get("unique_hangul_words"),
        "normalization": report.get("normalization"),
        "occurrence_level": {
            "total_occurrences": len(rows),
            "paired_scored_occurrences": len(paired),
            "unique_types_in_paired_set": len(by_type),
            "native_exact": sum(bool(row[NATIVE]["exact"]) for row in paired),
            "g2pk_exact": sum(bool(row[G2PK]["exact"]) for row in paired),
            "g2pk_exact_wins": g2pk_wins,
            "native_exact_wins": native_wins,
            "exact_ties": len(paired) - g2pk_wins - native_wins,
            "type_cluster_bootstrap_delta_ci": _type_cluster_delta_ci(
                paired, replicates=type_bootstrap_replicates
            ),
        },
        "edit_distance": edit_histograms,
        "symbol_error_profile": {
            NATIVE: _symbol_error_profile(paired, NATIVE),
            G2PK: _symbol_error_profile(paired, G2PK),
        },
        "strata": strata,
        "lexical_type_macro": {
            "unique_types": len(by_type),
            "native_exact_rate": round(sum(native_type_rates) / len(native_type_rates), 6),
            "g2pk_exact_rate": round(sum(g2pk_type_rates) / len(g2pk_type_rates), 6),
            "delta_pp_g2pk_minus_native": round(
                100 * (sum(type_deltas) / len(type_deltas)), 6
            ),
            "g2pk_type_wins": type_wins,
            "native_type_wins": type_losses,
            "type_ties": type_ties,
        },
        "excluding_known_length_reference_mismatch_word": {
            "token": "없는",
            "paired_occurrences_remaining": len(no_length_word),
            "native_exact": sum(bool(row[NATIVE]["exact"]) for row in no_length_word),
            "g2pk_exact": sum(bool(row[G2PK]["exact"]) for row in no_length_word),
            "native_total_edit_distance": native_edits_without_word,
            "g2pk_total_edit_distance": g2pk_edits_without_word,
            "interpretation": "diagnostic sensitivity check only; do not alter production output to chase the reference",
        },
        "limitations": [
            "Gold IPA references are not independently adjudicated normative gold.",
            "Rule and morphology labels are available for abstentions, not for every scored mismatch.",
            "Test-set repetition frequency is not a proxy for population lexical frequency.",
            "Subgroup rates are descriptive; they are not causal estimates.",
            "Lexical-type bootstrap is a sensitivity interval and does not jointly cluster by row and type.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path, help="multi-engine-ipa-report.json from the benchmark artifact")
    parser.add_argument("--output", type=Path, help="optional JSON output path; defaults to stdout")
    parser.add_argument("--bootstrap-replicates", type=int, default=10_000)
    args = parser.parse_args()
    if args.bootstrap_replicates < 100:
        parser.error("--bootstrap-replicates must be at least 100")
    report = json.loads(args.input.read_text(encoding="utf-8"))
    result = summarize_report(report, type_bootstrap_replicates=args.bootstrap_replicates)
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
