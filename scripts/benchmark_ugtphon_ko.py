#!/usr/bin/env python3
"""Run an opt-in, diagnostic IPA comparison against the UGTPHON Korean test split.

UGTPHON is an external, licensed dataset; it is deliberately not downloaded at
runtime or copied into this repository. Supply the path to ko/test.json via
--corpus or UGTPHON_KO_TEST_PATH. This benchmark is diagnostic, not a normative
pass/fail gate: UGTPHON targets noisy user-generated text and its IPA convention
differs in places from this project's broad-IPA representation.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any

_HANGUL_TOKEN = re.compile(r"^[\uac00-\ud7a3]+$")
# These narrow transcription diacritics are normalized away for a broad-level
# diagnostic comparison. Fortis (U+0348), aspiration (ʰ), length (ː), and
# unreleased-stop (̚) are intentionally retained.
_IGNORABLE_DIACRITICS = {"\u031d", "\u0339", "\u031e", "\u0320"}
_TIE_BAR = "\u0361"


def normalize_ipa(value: str) -> str:
    value = unicodedata.normalize("NFD", value).replace("g", "ɡ")
    value = value.replace(_TIE_BAR, "")
    value = "".join(
        char for char in value
        if not char.isspace() and char != "." and char not in _IGNORABLE_DIACRITICS
    )
    return unicodedata.normalize("NFC", value)


def edit_distance(left: str, right: str) -> int:
    if len(left) < len(right):
        left, right = right, left
    previous = list(range(len(right) + 1))
    for i, a in enumerate(left, 1):
        current = [i]
        for j, b in enumerate(right, 1):
            current.append(min(current[-1] + 1, previous[j] + 1, previous[j - 1] + (a != b)))
        previous = current
    return previous[-1]


def load_corpus(path: Path) -> list[dict[str, Any]]:
    rows = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(rows, list):
        raise ValueError("UGTPHON corpus root must be a JSON array")
    seen: set[str] = set()
    for index, row in enumerate(rows):
        if not isinstance(row, dict):
            raise ValueError(f"row {index} is not an object")
        for field in ("id", "lang", "split", "text", "canonical", "phonemes", "tokens"):
            if field not in row:
                raise ValueError(f"row {index} is missing required field {field!r}")
        if row["lang"] != "ko" or row["split"] != "test":
            raise ValueError(f"row {index} is not from the Korean test split")
        if row["id"] in seen:
            raise ValueError(f"duplicate id: {row['id']}")
        seen.add(row["id"])
        if not isinstance(row["tokens"], list):
            raise ValueError(f"row {index} tokens must be a list")
    return rows


def evaluate(rows: list[dict[str, Any]], *, morphology_mode: str = "strict") -> dict[str, Any]:
    # Import lazily so the schema/unit tests can run without the package installed.
    from korean_ukrainian.pipeline import phoneticize_korean
    if morphology_mode not in {"strict", "soft"}:
        raise ValueError("morphology_mode must be \"strict\" or \"soft\"")

    scored: list[dict[str, Any]] = []
    unresolved_examples: list[dict[str, str]] = []
    unresolved_tokens = 0
    skipped_non_hangul_or_multitoken = 0
    skipped_missing_gold = 0
    skipped_empty_variants = 0
    errors = 0
    heuristic_token_occurrences = 0
    heuristic_examples: list[dict[str, Any]] = []
    for row in rows:
        for token in row["tokens"]:
            canonical = token.get("canonical", "")
            gold_raw = token.get("phoneme", "")
            if not isinstance(canonical, str) or not _HANGUL_TOKEN.fullmatch(canonical):
                skipped_non_hangul_or_multitoken += 1
                continue
            if not isinstance(gold_raw, str) or not gold_raw.strip():
                skipped_missing_gold += 1
                continue
            try:
                engine_result = phoneticize_korean(canonical, morphology_mode=morphology_mode)
                if engine_result.get("pronunciation_status") == "unresolved":
                    unresolved_tokens += 1
                    if len(unresolved_examples) < 100:
                        unresolved_examples.append({
                            "id": row["id"], "token": canonical,
                            "contexts": "; ".join(
                                f"{item.get('rule_id')} {item.get('pair')}: {item.get('reason')}"
                                for item in engine_result.get("unresolved_contexts", [])
                            ),
                        })
                    continue
                predicted_raw = engine_result["ipa"]["ipa"]
            except Exception as exc:  # diagnostic must record, not conceal, engine failures
                errors += 1
                scored.append({
                    "id": row["id"], "token": canonical, "gold": gold_raw,
                    "predicted": None, "distance": None, "error": f"{type(exc).__name__}: {exc}",
                })
                continue
            predicted = normalize_ipa(predicted_raw)
            gold_variants = [normalize_ipa(x) for x in gold_raw.split(",") if x.strip()]
            if not gold_variants:
                skipped_empty_variants += 1
                continue
            distances = [(edit_distance(predicted, gold), gold) for gold in gold_variants]
            distance, closest_gold = min(distances, key=lambda item: item[0])
            scored.append({
                "id": row["id"], "token": canonical, "gold": gold_raw,
                "predicted": predicted_raw, "normalized_predicted": predicted,
                "closest_normalized_gold": closest_gold, "distance": distance,
                "exact": distance == 0,
            })

    comparable = [item for item in scored if item["distance"] is not None]
    # Standard CER denominator is the total reference length, not max(pred, ref).
    total_chars = sum(len(item["closest_normalized_gold"]) for item in comparable)
    total_distance = sum(item["distance"] for item in comparable)
    exact = sum(item["exact"] for item in comparable)
    return {
        "benchmark": "UGTPHON Korean test split",
        "purpose": "diagnostic external IPA comparison; not a normative acceptance gate",
        "rows": len(rows),
        "scored_tokens": len(comparable),
        "exact_matches": exact,
        "exact_match_rate": round(exact / len(comparable), 6) if comparable else None,
        "character_error_rate": round(total_distance / total_chars, 6) if total_chars else None,
        "unresolved_tokens": unresolved_tokens,
        "unresolved_examples": unresolved_examples,
        "skipped_tokens": skipped_non_hangul_or_multitoken + skipped_missing_gold + skipped_empty_variants,
        "skipped_non_hangul_or_multitoken": skipped_non_hangul_or_multitoken,
        "skipped_missing_gold": skipped_missing_gold,
        "skipped_empty_variants": skipped_empty_variants,
        "engine_errors": errors,
        "worst_mismatches": sorted(
            (item for item in comparable if not item["exact"]),
            key=lambda item: (-(item["distance"] / max(len(item["normalized_predicted"]), len(item["closest_normalized_gold"]), 1)), -item["distance"], item["token"]),
        )[:50],
        "notes": [
            "Gold IPA follows UGTPHON/IPA-Dict annotation conventions and may not match this project's broad-IPA convention exactly.",
            "Token-level evaluation loses sentence prosody and cross-token context; it is a diagnostic, not a complete sentence-level score.",
            "Do not interpret this result as validation of Ukrainian orthographic rendering.",
            "Tokens explicitly marked unresolved by the native engine are excluded from IPA scores and reported separately.",
            "Review mismatches by phonological class and source before changing any engine rule.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=os.environ.get("UGTPHON_KO_TEST_PATH"),
                        help="path to external UGTPHON ko/test.json (or set UGTPHON_KO_TEST_PATH)")
    parser.add_argument("--output", type=Path, help="optional JSON report destination")
    args = parser.parse_args()
    if args.corpus is None:
        parser.error("provide --corpus or set UGTPHON_KO_TEST_PATH; no network download is performed")
    try:
        rows = load_corpus(Path(args.corpus))
        report = evaluate(rows)
    except Exception as exc:
        print(f"benchmark failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 1 if report["engine_errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
