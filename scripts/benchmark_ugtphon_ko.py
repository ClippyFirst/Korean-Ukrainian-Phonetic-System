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
_HANGUL_SENTENCE = re.compile(r"^[\uac00-\ud7a3\s]+$")
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


def load_corpus(path: Path, *, expected_split: str = "test") -> list[dict[str, Any]]:
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
        if row["lang"] != "ko" or row["split"] != expected_split:
            raise ValueError(f"row {index} is not from the Korean {expected_split} split")
        if row["id"] in seen:
            raise ValueError(f"duplicate id: {row['id']}")
        seen.add(row["id"])
        if not isinstance(row["tokens"], list):
            raise ValueError(f"row {index} tokens must be a list")
    return rows


def evaluate(rows: list[dict[str, Any]], *, ipa_level: str = "broad") -> dict[str, Any]:
    if ipa_level not in {"phonemic", "broad", "narrow"}:
        raise ValueError("ipa_level must be phonemic, broad, or narrow")
    # Import lazily so the schema/unit tests can run without the package installed.
    from korean_ukrainian.pipeline import phoneticize_korean

    scored: list[dict[str, Any]] = []
    unresolved_examples: list[dict[str, str]] = []
    unresolved_tokens = 0
    skipped_non_hangul_or_multitoken = 0
    skipped_missing_gold = 0
    skipped_empty_variants = 0
    errors = 0
    profile_metadata: dict[str, Any] | None = None
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
                engine_result = phoneticize_korean(canonical, ipa_level=ipa_level)
                ipa_metadata = engine_result.get("ipa", {})
                if profile_metadata is None and isinstance(ipa_metadata, dict):
                    profile_metadata = {
                        "ipa_profile": ipa_metadata.get("ipa_profile"),
                        "ipa_profile_status": ipa_metadata.get("ipa_profile_status"),
                        "ipa_profile_version": ipa_metadata.get("ipa_profile_version"),
                    }
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
        "ipa_level": ipa_level,
        **(profile_metadata or {"ipa_profile": None, "ipa_profile_status": "unavailable", "ipa_profile_version": None}),
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
            f"Gold IPA follows UGTPHON/IPA-Dict annotation conventions; this run uses the project's {ipa_level} IPA profile.",
            "The narrow profile is partial and research-only; its score is a diagnostic and does not establish full narrow-transcription correctness or target compatibility." if ipa_level == "narrow" else "Broad and phonemic runs are separate from the partial narrow research profile.",
            "Token-level evaluation loses sentence prosody and cross-token context; it is a diagnostic, not a complete sentence-level score.",
            "Do not interpret this result as validation of Ukrainian orthographic rendering.",
            "Tokens explicitly marked unresolved by the native engine are excluded from IPA scores and reported separately.",
            "Review mismatches by phonological class and source before changing any engine rule.",
        ],
    }



def evaluate_sentences(
    rows: list[dict[str, Any]],
    *,
    ipa_level: str = "broad",
    boundary_mode: str = "same_word",
) -> dict[str, Any]:
    """Score full canonical sentences against UGTPHON's sentence-level IPA.

    This is distinct from token-level lexical G2P. The corpus's sentence
    phonemes are independently selected sentence annotations, not necessarily
    a literal concatenation of token phonemes. Phrase mode permits only those
    rule implementations that explicitly allow crossing eojeol boundaries;
    UGTPHON does not annotate prosodic phrase breaks, so this remains diagnostic.
    """
    if ipa_level not in {"phonemic", "broad", "narrow"}:
        raise ValueError("ipa_level must be phonemic, broad, or narrow")
    if boundary_mode not in {"same_word", "phrase"}:
        raise ValueError("boundary_mode must be same_word or phrase")
    from korean_ukrainian.pipeline import phoneticize_korean

    records: list[dict[str, Any]] = []
    unresolved_examples: list[dict[str, str]] = []
    engine_error_examples: list[dict[str, str]] = []
    skipped_unsupported = 0
    skipped_missing_gold = 0
    skipped_empty_gold = 0
    unresolved = 0
    errors = 0
    eligible = 0
    profile_metadata: dict[str, Any] | None = None

    for row in rows:
        canonical = row.get("canonical", "")
        gold_raw = row.get("phonemes", "")
        canonical_text = canonical.strip() if isinstance(canonical, str) else ""
        if not canonical_text or not _HANGUL_SENTENCE.fullmatch(canonical_text):
            skipped_unsupported += 1
            continue
        if not isinstance(gold_raw, str) or not gold_raw.strip():
            skipped_missing_gold += 1
            continue
        eligible += 1

        try:
            result = phoneticize_korean(
                canonical_text,
                ipa_level=ipa_level,
                boundary_mode=boundary_mode,
            )
            ipa_data = result.get("ipa", {})
            if profile_metadata is None and isinstance(ipa_data, dict):
                profile_metadata = {
                    "ipa_profile": ipa_data.get("ipa_profile"),
                    "ipa_profile_status": ipa_data.get("ipa_profile_status"),
                    "ipa_profile_version": ipa_data.get("ipa_profile_version"),
                }
            if result.get("pronunciation_status") == "unresolved":
                unresolved += 1
                if len(unresolved_examples) < 50:
                    unresolved_examples.append({
                        "id": str(row.get("id", "")),
                        "canonical": canonical_text,
                        "contexts": "; ".join(
                            f"{item.get('rule_id')} {item.get('pair')}: {item.get('reason')}"
                            for item in result.get("unresolved_contexts", [])
                        ),
                    })
                records.append({
                    "id": row.get("id"), "canonical": canonical_text,
                    "gold": gold_raw, "status": "unresolved",
                })
                continue
            predicted_raw = ipa_data.get("ipa", "") if isinstance(ipa_data, dict) else ""
            if not isinstance(predicted_raw, str) or not predicted_raw:
                raise RuntimeError("engine returned no sentence IPA for a resolved sentence")
        except Exception as exc:
            errors += 1
            engine_error_examples.append({
                "id": str(row.get("id", "")),
                "canonical": canonical_text,
                "error": f"{type(exc).__name__}: {exc}",
            })
            records.append({
                "id": row.get("id"), "canonical": canonical_text,
                "gold": gold_raw, "status": "engine_error",
            })
            continue

        predicted = normalize_ipa(predicted_raw)
        gold = normalize_ipa(gold_raw)
        if not gold:
            skipped_empty_gold += 1
            continue
        distance = edit_distance(predicted, gold)
        records.append({
            "id": row.get("id"),
            "canonical": canonical_text,
            "gold": gold,
            "predicted": predicted,
            "distance": distance,
            "exact": distance == 0,
            "status": "scored",
        })

    comparable = [item for item in records if item.get("status") == "scored"]
    total_chars = sum(len(item["gold"]) for item in comparable)
    total_distance = sum(item["distance"] for item in comparable)
    exact = sum(item["exact"] for item in comparable)
    total_rows = len(rows)
    return {
        "benchmark": "UGTPHON Korean test/dev split — sentence-level canonical G2P",
        "purpose": "diagnostic sentence-level IPA comparison; not a normative acceptance gate",
        "granularity": "sentence",
        "split": rows[0].get("split") if rows else None,
        "ipa_level": ipa_level,
        "boundary_mode": boundary_mode,
        **(profile_metadata or {
            "ipa_profile": None,
            "ipa_profile_status": "unavailable",
            "ipa_profile_version": None,
        }),
        "rows": total_rows,
        "eligible_sentences": eligible,
        "scored_sentences": len(comparable),
        "coverage_rate": round(len(comparable) / eligible, 6) if eligible else None,
        "overall_coverage_rate": round(len(comparable) / total_rows, 6) if total_rows else None,
        "exact_matches": exact,
        "exact_match_rate": round(exact / len(comparable), 6) if comparable else None,
        "coverage_adjusted_exact_match_rate": round(exact / eligible, 6) if eligible else None,
        "overall_coverage_adjusted_exact_match_rate": round(exact / total_rows, 6) if total_rows else None,
        "character_error_rate": round(total_distance / total_chars, 6) if total_chars else None,
        "unresolved_sentences": unresolved,
        "unresolved_examples": unresolved_examples,
        "engine_errors": errors,
        "engine_error_examples": engine_error_examples[:50],
        "skipped_unsupported_sentences": skipped_unsupported,
        "skipped_missing_gold": skipped_missing_gold,
        "skipped_empty_gold": skipped_empty_gold,
        "worst_mismatches": sorted(
            (item for item in comparable if not item["exact"]),
            key=lambda item: (
                -(item["distance"] / max(len(item["predicted"]), len(item["gold"]), 1)),
                -item["distance"],
                str(item["id"]),
            ),
        )[:30],
        "notes": [
            "Prediction uses row.canonical and is scored against row.phonemes; token-level canonical/phoneme fields are not read.",
            "UGTPHON sentence-level phonemes are independently selected annotations and are not necessarily a literal concatenation of token-level phonemes.",
            "same_word blocks rules across eojeol boundaries; phrase allows only rules explicitly implemented to cross word boundaries.",
            "The dataset does not provide prosodic phrase-break labels; phrase-mode scores are diagnostic and must not be promoted as a default without review.",
            "This evaluates Korean sentence IPA only, not Ukrainian orthographic adaptation.",
            "Broad/narrow IPA convention differences remain; the narrow profile is partial and research-only.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=os.environ.get("UGTPHON_KO_TEST_PATH"),
                        help="path to external UGTPHON ko/test.json (or set UGTPHON_KO_TEST_PATH)")
    parser.add_argument("--output", type=Path, help="optional JSON report destination")
    parser.add_argument("--ipa-level", choices=("phonemic", "broad", "narrow"), default="broad",
                        help="IPA realization profile to evaluate; narrow is partial research-only")
    parser.add_argument("--granularity", choices=("token", "sentence"), default="token",
                        help="token-level lexical diagnostic or full-sentence canonical G2P")
    parser.add_argument("--boundary-mode", choices=("same_word", "phrase"), default="same_word",
                        help="sentence mode only: allow explicitly phrase-scoped rules across word boundaries")
    parser.add_argument("--split", choices=("dev", "test"), default="test",
                        help="UGTPHON split to evaluate; keep test for final held-out reporting")
    args = parser.parse_args()
    if args.corpus is None:
        parser.error("provide --corpus or set UGTPHON_KO_TEST_PATH; no network download is performed")
    try:
        rows = load_corpus(Path(args.corpus), expected_split=args.split)
        if args.granularity == "sentence":
            report = evaluate_sentences(rows, ipa_level=args.ipa_level, boundary_mode=args.boundary_mode)
        else:
            if args.boundary_mode != "same_word":
                parser.error("--boundary-mode phrase requires --granularity sentence")
            report = evaluate(rows, ipa_level=args.ipa_level)
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
