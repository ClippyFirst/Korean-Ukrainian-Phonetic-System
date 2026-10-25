#!/usr/bin/env python3
"""Paired diagnostic comparison: native Korean engine vs g2pk on pinned UGTPHON.

The g2pk result is Hangul, not IPA. We convert that surface Hangul through the
repository's segment-to-IPA renderer WITHOUT running the native phonological
rule engine on g2pk output. Thus both outputs are evaluated against the same
IPA references, while the IPA rendering conventions are shared and explicitly
reported as a limitation. This is not a normative benchmark.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

from benchmark_ugtphon_ko import edit_distance, load_corpus, normalize_ipa

_HANGUL_TOKEN = re.compile(r"^[\uac00-\ud7a3]+$")


def _gold_variants(raw: str) -> list[str]:
    return [normalize_ipa(part) for part in raw.split(",") if part.strip()]


def _score_prediction(predicted_raw: str, gold_raw: str) -> dict[str, Any]:
    predicted = normalize_ipa(predicted_raw)
    variants = _gold_variants(gold_raw)
    if not variants:
        return {"predicted": predicted_raw, "distance": None, "exact": None}
    distance, closest = min(
        ((edit_distance(predicted, gold), gold) for gold in variants),
        key=lambda pair: pair[0],
    )
    return {
        "predicted": predicted_raw,
        "normalized_predicted": predicted,
        "closest_normalized_gold": closest,
        "distance": distance,
        "exact": distance == 0,
    }


def _metrics(scored: list[dict[str, Any]]) -> dict[str, Any]:
    valid = [x for x in scored if x.get("distance") is not None]
    ref_chars = sum(len(x["closest_normalized_gold"]) for x in valid)
    distance = sum(x["distance"] for x in valid)
    exact = sum(x["exact"] for x in valid)
    return {
        "scored_tokens": len(valid),
        "exact_matches": exact,
        "exact_match_rate": round(exact / len(valid), 6) if valid else None,
        "character_error_rate": round(distance / ref_chars, 6) if ref_chars else None,
    }


def evaluate(rows: list[dict[str, Any]], *, morphology_mode: str = "strict") -> dict[str, Any]:
    # Deliberately imported here so the native engine is exercised at its public API.
    from collections import Counter
    from korean_ukrainian.pipeline import phoneticize_korean
    if morphology_mode not in {"strict", "soft"}:
        raise ValueError('morphology_mode must be "strict" or "soft"')
    from korean_ukrainian.phonology import parse_syllables
    from korean_ukrainian.ipa import realize_syllables
    from g2pk import G2p

    g2p = G2p()
    native_scored: list[dict[str, Any]] = []
    g2pk_scored: list[dict[str, Any]] = []
    paired: list[dict[str, Any]] = []
    unresolved_native = 0
    errors_native = 0
    errors_g2pk = 0
    skipped = 0
    details: list[dict[str, Any]] = []
    unresolved_audit: list[dict[str, Any]] = []
    unresolved_context_counts: Counter[str] = Counter()
    unresolved_words: set[str] = set()

    for row in rows:
        for token in row["tokens"]:
            word = token.get("canonical", "")
            gold = token.get("phoneme", "")
            if not isinstance(word, str) or not _HANGUL_TOKEN.fullmatch(word):
                skipped += 1
                continue
            if not isinstance(gold, str) or not gold.strip() or not _gold_variants(gold):
                skipped += 1
                continue

            native_item = None
            g2pk_item = None
            native_error = None
            g2pk_error = None

            try:
                result = phoneticize_korean(word, morphology_mode=morphology_mode)
                if result.get("pronunciation_status") == "unresolved":
                    unresolved_native += 1
                    unresolved_words.add(word)
                    contexts = result.get("unresolved_contexts", [])
                    for context in contexts:
                        key = f"{context.get('rule_id', 'UNKNOWN')}:{context.get('reason', 'unspecified')}"
                        unresolved_context_counts[key] += 1
                    unresolved_audit.append({
                        "id": row["id"], "token": word, "gold": gold,
                        "native_status": result.get("pronunciation_status"),
                        "native_reason": result.get("ipa_status_reason"),
                        "unresolved_contexts": contexts,
                    })
                else:
                    native_item = _score_prediction(result["ipa"]["ipa"], gold)
                    native_item.update({"id": row["id"], "token": word, "gold": gold})
                    native_scored.append(native_item)
            except Exception as exc:
                errors_native += 1
                native_error = f"{type(exc).__name__}: {exc}"

            try:
                surface = g2p(word)
                if not isinstance(surface, str):
                    raise TypeError(f"g2pk returned {type(surface).__name__}, expected str")
                surface = "".join(surface.split())
                if not _HANGUL_TOKEN.fullmatch(surface):
                    raise ValueError(f"g2pk output is not a single Hangul token: {surface!r}")
                # Convert g2pk's own surface-Hangul result to IPA; do not re-run
                # the native phonological rules over it.
                ipa = realize_syllables(parse_syllables(surface), level="broad")["ipa"]
                g2pk_item = _score_prediction(ipa, gold)
                g2pk_item.update({
                    "id": row["id"], "token": word, "gold": gold,
                    "surface_hangul": surface,
                })
                g2pk_scored.append(g2pk_item)
            except Exception as exc:
                errors_g2pk += 1
                g2pk_error = f"{type(exc).__name__}: {exc}"

            if native_item is not None and g2pk_item is not None:
                paired.append({
                    "id": row["id"], "token": word, "gold": gold,
                    "native": native_item, "g2pk": g2pk_item,
                })
            if (native_error or g2pk_error or
                (native_item and not native_item["exact"]) or
                (g2pk_item and not g2pk_item["exact"])):
                if len(details) < 150:
                    details.append({
                        "id": row["id"], "token": word, "gold": gold,
                        "native": native_item, "native_error": native_error,
                        "g2pk": g2pk_item, "g2pk_error": g2pk_error,
                    })

    native_metrics = _metrics(native_scored)
    g2pk_metrics = _metrics(g2pk_scored)
    paired_native = _metrics([x["native"] for x in paired])
    paired_g2pk = _metrics([x["g2pk"] for x in paired])
    return {
        "benchmark": "UGTPHON Korean test split",
        "morphology_mode": morphology_mode,
        "purpose": "paired diagnostic comparison; not normative accuracy or release gate",
        "dataset_rows": len(rows),
        "scorable_hangul_tokens_attempted": len(native_scored) + unresolved_native + errors_native,
        "skipped_tokens": skipped,
        "native_engine": {
            **native_metrics, "unresolved_tokens": unresolved_native, "unique_unresolved_words": len(unresolved_words),
            "engine_errors": errors_native,
            "coverage": round(len(native_scored) / (len(native_scored) + unresolved_native + errors_native), 6)
                if (len(native_scored) + unresolved_native + errors_native) else None,
            "coverage_adjusted_exact_match_rate": round(native_metrics["exact_matches"] / (len(native_scored) + unresolved_native + errors_native), 6)
                if (len(native_scored) + unresolved_native + errors_native) else None,
        },
        "native_abstention_audit": {
            "occurrence_count": unresolved_native,
            "unique_words": len(unresolved_words),
            "context_counts": dict(sorted(unresolved_context_counts.items())),
            "occurrences": unresolved_audit,
        },
        "g2pk": {
            **g2pk_metrics, "unresolved_tokens": 0, "engine_errors": errors_g2pk,
            "output_to_ipa": "g2pk surface Hangul -> repository segment IPA renderer; no native phonological rules reapplied",
        },
        "paired_subset": {
            "tokens_scored_by_both": len(paired),
            "native_engine": paired_native,
            "g2pk": paired_g2pk,
            "exact_match_rate_delta_g2pk_minus_native": (
                round(paired_g2pk["exact_match_rate"] - paired_native["exact_match_rate"], 6)
                if paired_g2pk["exact_match_rate"] is not None and paired_native["exact_match_rate"] is not None
                else None
            ),
            "cer_delta_g2pk_minus_native": (
                round(paired_g2pk["character_error_rate"] - paired_native["character_error_rate"], 6)
                if paired_g2pk["character_error_rate"] is not None and paired_native["character_error_rate"] is not None
                else None
            ),
        },
        "details_sample": details,
        "limitations": [
            "UGTPHON is noisy user-generated text and is not a normative Korean standard-pronunciation corpus.",
            "Both systems are compared on the same tokenized rows and gold IPA; tokens unresolved by the native engine are excluded from its own and the paired scores.",
            "g2pk emits Hangul surface forms, not IPA. Its output is converted using the repository's IPA segment renderer without running native phonological rules; this shares the IPA rendering layer and can bias segment-level comparisons.",
            "Gold IPA conventions may differ from the project's broad IPA conventions; scores are diagnostic.",
            "This benchmark evaluates Korean IPA only, not Ukrainian orthographic adaptation.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=os.environ.get("UGTPHON_KO_TEST_PATH"))
    parser.add_argument("--output", type=Path)
    parser.add_argument("--morphology-mode", choices=["strict", "soft"], default="strict",
                        help="strict abstains without exact morphology licenses; soft permits explicitly low-confidence heuristic licenses")
    args = parser.parse_args()
    if args.corpus is None:
        parser.error("provide --corpus or set UGTPHON_KO_TEST_PATH")
    try:
        report = evaluate(load_corpus(Path(args.corpus)), morphology_mode=args.morphology_mode)
    except Exception as exc:
        print(f"comparison failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 1 if report["native_engine"]["engine_errors"] or report["g2pk"]["engine_errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
