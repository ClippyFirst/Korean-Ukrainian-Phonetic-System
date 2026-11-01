#!/usr/bin/env python3
"""Research-only exact/contextual retrieval normalization + G2P benchmark for Korean UGT.

This is deliberately separate from benchmark_ugtphon_ko.py, which evaluates
canonical Hangul tokens. It takes raw token surfaces as input, builds a
train-only exact-match normalization store, and then phonemizes the retrieved
canonical form or (on a miss) the untouched surface. It is a transparent
lookup baseline, not the paper's trained retrieval-augmented ByT5/Qwen model.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True, slots=True)
class NormalizationStore:
    mapping: dict[str, str]
    ambiguous_keys: tuple[str, ...]
    blocked_canonical_collisions: tuple[str, ...]
    context_mapping: dict[tuple[str, str, str], str]
    ambiguous_context_keys: tuple[tuple[str, str, str], ...]
    blocked_canonical_contexts: tuple[tuple[str, str, str], ...]


def _validate_rows(rows: list[dict[str, Any]], expected_split: str) -> None:
    if not isinstance(rows, list):
        raise ValueError("UGTPHON corpus root must be a JSON array")
    seen: set[str] = set()
    for index, row in enumerate(rows):
        if not isinstance(row, dict):
            raise ValueError(f"row {index} is not an object")
        for field in ("id", "lang", "split", "text", "tokens"):
            if field not in row:
                raise ValueError(f"row {index} is missing required field {field!r}")
        if row["lang"] != "ko" or row["split"] != expected_split:
            raise ValueError(f"row {index} is not from the Korean {expected_split} split")
        if row["id"] in seen:
            raise ValueError(f"duplicate id: {row['id']}")
        seen.add(row["id"])
        if not isinstance(row["tokens"], list):
            raise ValueError(f"row {index} tokens must be a list")
        for token_index, token in enumerate(row["tokens"]):
            if not isinstance(token, dict) or not isinstance(token.get("text"), str) or not token["text"]:
                raise ValueError(f"row {index} token {token_index} must contain non-empty string text")


def load_corpus(path: Path, *, expected_split: str) -> list[dict[str, Any]]:
    rows = json.loads(path.read_text(encoding="utf-8"))
    _validate_rows(rows, expected_split)
    return rows


def _single_canonical_form(value: Any) -> str | None:
    """Return a single accepted Korean canonical form; abstain on alternatives."""
    if not isinstance(value, str) or not value.strip():
        return None
    forms = [part.strip() for part in value.split(",") if part.strip()]
    if len(forms) != 1:
        return None
    return forms[0]


def _context_key(tokens: list[dict[str, Any]], index: int) -> tuple[str, str, str]:
    """Return an exact local context key using explicit sentence-edge markers."""
    previous = tokens[index - 1]["text"] if index > 0 else "<BOS>"
    following = tokens[index + 1]["text"] if index + 1 < len(tokens) else "<EOS>"
    return (previous, tokens[index]["text"], following)


def build_normalization_datastore(
    train_rows: list[dict[str, Any]],
) -> NormalizationStore:
    """Build conservative train-only surface and exact-context mappings.

    Surface mappings require a unique target and block any surface observed as
    canonical. Context mappings use (previous surface, current surface, next
    surface) and can disambiguate a surface only when that exact context has a
    single non-canonical target and no canonical/ambiguous observation. This is
    exact contextual retrieval, not fuzzy matching or a trained language model.
    """
    _validate_rows(train_rows, "train")
    candidates: dict[str, set[str]] = defaultdict(set)
    ambiguous: set[str] = set()
    canonical_surfaces: set[str] = set()
    context_candidates: dict[tuple[str, str, str], set[str]] = defaultdict(set)
    ambiguous_contexts: set[tuple[str, str, str]] = set()
    canonical_contexts: set[tuple[str, str, str]] = set()

    for row in train_rows:
        tokens = row["tokens"]
        for index, token in enumerate(tokens):
            if not isinstance(token, dict):
                continue
            surface = token.get("text")
            if not isinstance(surface, str) or not surface:
                continue
            context = _context_key(tokens, index)
            is_nc = token.get("is_nc")
            if is_nc is False:
                canonical_surfaces.add(surface)
                canonical_contexts.add(context)
                canonical_value = token.get("canonical")
                if isinstance(canonical_value, str):
                    canonical_surfaces.update(
                        part.strip() for part in canonical_value.split(",") if part.strip()
                    )
                continue
            if is_nc is not True:
                continue
            canonical = _single_canonical_form(token.get("canonical"))
            if canonical is None:
                ambiguous.add(surface)
                ambiguous_contexts.add(context)
            else:
                candidates[surface].add(canonical)
                context_candidates[context].add(canonical)

    mapping: dict[str, str] = {}
    blocked: set[str] = set()
    for surface, forms in candidates.items():
        if surface in canonical_surfaces:
            blocked.add(surface)
        elif surface in ambiguous or len(forms) != 1:
            ambiguous.add(surface)
        else:
            canonical = next(iter(forms))
            if canonical != surface:
                mapping[surface] = canonical

    context_mapping: dict[tuple[str, str, str], str] = {}
    blocked_contexts: set[tuple[str, str, str]] = set()
    for context, forms in context_candidates.items():
        if context in canonical_contexts:
            blocked_contexts.add(context)
        elif context in ambiguous_contexts or len(forms) != 1:
            ambiguous_contexts.add(context)
        else:
            canonical = next(iter(forms))
            if canonical != context[1]:
                context_mapping[context] = canonical

    return NormalizationStore(
        mapping=mapping,
        ambiguous_keys=tuple(sorted(ambiguous - blocked)),
        blocked_canonical_collisions=tuple(sorted(blocked)),
        context_mapping=context_mapping,
        ambiguous_context_keys=tuple(sorted(ambiguous_contexts - blocked_contexts)),
        blocked_canonical_contexts=tuple(sorted(blocked_contexts)),
    )


def _category(token: dict[str, Any]) -> str:
    if token.get("is_nc") is False:
        return "canonical"
    return str(token.get("nc_type") or "noncanonical_unknown")


def _aggregate(records: list[dict[str, Any]]) -> dict[str, Any]:
    scored = [item for item in records if item["distance"] is not None]

    total_chars = sum(len(item["gold"]) for item in scored)
    total_distance = sum(item["distance"] for item in scored)
    exact = sum(item["exact"] for item in scored)
    attempted = len(records)
    return {
        "attempted_tokens": attempted,
        "scored_tokens": len(scored),
        "coverage_rate": round(len(scored) / attempted, 6) if attempted else None,
        "exact_matches": exact,
        "exact_match_rate": round(exact / len(scored), 6) if scored else None,
        "coverage_adjusted_exact_match_rate": round(exact / attempted, 6) if attempted else None,
        "character_error_rate": round(total_distance / total_chars, 6) if total_chars else None,
        "unresolved_tokens": sum(item["status"] == "unresolved" for item in records),
        "engine_errors": sum(item["status"] == "engine_error" for item in records),
        "missing_gold": sum(item["status"] == "missing_gold" for item in records),
        "unsupported_input_tokens": sum(item["status"] == "unsupported_input" for item in records),
        "normalization_hits": sum(item.get("normalization_hit") is True for item in records),
        "normalization_misses": sum(item.get("normalization_hit") is False for item in records),
    }


def evaluate_surface(
    test_rows: list[dict[str, Any]],
    store: NormalizationStore,
    *,
    ipa_level: str = "broad",
) -> dict[str, Any]:
    """Evaluate raw token surfaces; token canonical fields are never read."""
    if ipa_level not in {"phonemic", "broad", "narrow"}:
        raise ValueError("ipa_level must be phonemic, broad, or narrow")
    _validate_rows(test_rows, "test")
    try:
        from scripts.benchmark_ugtphon_ko import edit_distance, normalize_ipa
    except ModuleNotFoundError as exc:
        # Direct "python scripts/..." execution puts scripts/ on sys.path,
        # not the repository root; support both CLI and package-test imports.
        if exc.name not in {"scripts", "scripts.benchmark_ugtphon_ko"}:
            raise
        from benchmark_ugtphon_ko import edit_distance, normalize_ipa
    from korean_ukrainian.pipeline import phoneticize_korean

    records: list[dict[str, Any]] = []
    category_records: dict[str, list[dict[str, Any]]] = defaultdict(list)
    normalization_hits = 0
    context_hits = 0
    surface_hits = 0
    hits_noncanonical = 0
    hits_canonical = 0
    misses_noncanonical = 0
    noncanonical_tokens = 0
    canonical_tokens = 0
    profile_metadata: dict[str, Any] = {}
    for row in test_rows:
        for token in row["tokens"]:
            if not isinstance(token, dict):
                continue
            surface = token.get("text")
            gold_raw = token.get("phoneme", "")
            if not isinstance(surface, str) or not surface:
                continue
            category = _category(token)
            is_nc = token.get("is_nc") is True
            if is_nc:
                noncanonical_tokens += 1
            else:
                canonical_tokens += 1
            context = _context_key(row["tokens"], row["tokens"].index(token))
            context_hint = store.context_mapping.get(context)
            surface_hint = store.mapping.get(surface)
            canonical_hint = context_hint if context_hint is not None else surface_hint
            retrieval_method = (
                "exact_context" if context_hint is not None
                else "exact_surface" if surface_hint is not None
                else "none"
            )
            g2p_input = canonical_hint if canonical_hint is not None else surface
            if canonical_hint is not None:
                normalization_hits += 1
                if retrieval_method == "exact_context":
                    context_hits += 1
                else:
                    surface_hits += 1
                if is_nc:
                    hits_noncanonical += 1
                else:
                    hits_canonical += 1
            elif is_nc:
                misses_noncanonical += 1
            # The native pronunciation API accepts precomposed Hangul and
            # whitespace only. Keep unsupported raw UGT (Latin, emoji,
            # compatibility jamo, mixed-script tokens) out of the engine-error
            # bucket. A successful train-only canonical retrieval is checked
            # first, so forms such as ㅋㅋ can still reach G2P as 크크.
            has_hangul = any("\uac00" <= char <= "\ud7a3" for char in g2p_input)
            supported_surface = has_hangul and all(
                char.isspace() or "\uac00" <= char <= "\ud7a3"
                for char in g2p_input
            )
            if not supported_surface:
                item = {
                    "status": "unsupported_input", "distance": None, "category": category,
                    "surface": surface, "g2p_input": g2p_input,
                    "normalization_hit": canonical_hint is not None,
                    "retrieval_method": retrieval_method,
                }
                records.append(item)
                category_records[category].append(item)
                continue

            if not isinstance(gold_raw, str) or not gold_raw.strip():
                item = {
                    "status": "missing_gold", "distance": None, "category": category,
                    "surface": surface, "g2p_input": g2p_input,
                    "normalization_hit": canonical_hint is not None,
                }
                records.append(item)
                category_records[category].append(item)
                continue

            try:
                result = phoneticize_korean(g2p_input, ipa_level=ipa_level)
                if result.get("pronunciation_status") == "unresolved":
                    item = {
                        "status": "unresolved", "distance": None, "category": category,
                        "surface": surface, "g2p_input": g2p_input,
                        "normalization_hit": canonical_hint is not None,
                    }
                else:
                    ipa = result.get("ipa", {})
                    if isinstance(ipa, dict) and not profile_metadata:
                        profile_metadata.update({
                            "ipa_profile": ipa.get("ipa_profile"),
                            "ipa_profile_status": ipa.get("ipa_profile_status") or "unavailable",
                            "ipa_profile_version": ipa.get("ipa_profile_version"),
                        })
                    predicted_raw = ipa.get("ipa", "") if isinstance(ipa, dict) else ""
                    if not isinstance(predicted_raw, str) or not predicted_raw:
                        raise RuntimeError("engine returned no IPA for a resolved token")
                    predicted = normalize_ipa(predicted_raw)
                    gold_variants = [
                        normalize_ipa(part) for part in gold_raw.split(",") if part.strip()
                    ]
                    if not gold_variants:
                        item = {"status": "missing_gold", "distance": None, "category": category}
                    else:
                        distance, closest_gold = min(
                            ((edit_distance(predicted, gold), gold) for gold in gold_variants),
                            key=lambda pair: pair[0],
                        )
                        item = {
                            "status": "scored", "distance": distance,
                            "exact": distance == 0, "gold": closest_gold,
                            "predicted": predicted, "surface": surface,
                            "g2p_input": g2p_input, "category": category,
                            "normalization_hit": canonical_hint is not None,
                        }
            except Exception as exc:
                item = {
                    "status": "engine_error", "distance": None, "category": category,
                    "surface": surface, "g2p_input": g2p_input,
                    "error": f"{type(exc).__name__}: {exc}",
                    "normalization_hit": canonical_hint is not None,
                }
            records.append(item)
            category_records[category].append(item)

    aggregate = _aggregate(records)
    by_category = {
        category: _aggregate(items)
        for category, items in sorted(category_records.items())
    }
    worst_mismatches = sorted(
        (item for item in records if item["status"] == "scored" and not item["exact"]),
        key=lambda item: (-item["distance"], item["surface"]),
    )[:30]
    engine_error_examples = [
        {key: item.get(key) for key in ("surface", "g2p_input", "category", "error", "normalization_hit")}
        for item in records if item["status"] == "engine_error"
    ][:30]
    unresolved_examples = [
        {key: item.get(key) for key in ("surface", "g2p_input", "category", "normalization_hit")}
        for item in records if item["status"] == "unresolved"
    ][:30]
    normalization_hit_examples = [
        {
            key: item.get(key)
            for key in ("surface", "g2p_input", "category", "status", "gold", "predicted", "distance", "error")
        }
        for item in records if item.get("normalization_hit") is True
    ][:100]
    return {
        "benchmark": "UGTPHON Korean test split — raw-surface retrieval + G2P",
        "purpose": "research-only exact-match normalization baseline; separate from canonical lexical G2P",
        "input_field": "token.text",
        "normalization": {
            "policy": "train-only exact local-context lookup first, then exact surface lookup; unique canonical target; canonical-context/surface collision guards; abstain on ambiguity",
            "store_size": len(store.mapping),
            "ambiguous_keys": len(store.ambiguous_keys),
            "blocked_canonical_collisions": len(store.blocked_canonical_collisions),
            "context_store_size": len(store.context_mapping),
            "ambiguous_context_keys": len(store.ambiguous_context_keys),
            "blocked_canonical_contexts": len(store.blocked_canonical_contexts),
            "context_hits": context_hits,
            "surface_hits": surface_hits,
            "hits": normalization_hits,
            "hits_noncanonical": hits_noncanonical,
            "hits_canonical": hits_canonical,
            "potential_canonical_false_rewrites": hits_canonical,
            "noncanonical_tokens": noncanonical_tokens,
            "canonical_tokens": canonical_tokens,
            "retrieval_hit_rate_noncanonical": (
                round(hits_noncanonical / noncanonical_tokens, 6) if noncanonical_tokens else None
            ),
            "misses_noncanonical": misses_noncanonical,
        },
        "ipa_level": ipa_level,
        **(profile_metadata or {"ipa_profile": None, "ipa_profile_status": "unavailable", "ipa_profile_version": None}),
        **aggregate,
        "by_category": by_category,
        "worst_mismatches": [
            {
                key: item.get(key)
                for key in ("surface", "g2p_input", "gold", "predicted", "category", "distance", "normalization_hit")
            }
            for item in worst_mismatches
        ],
        "engine_error_examples": engine_error_examples,
        "unsupported_input_examples": [
            {key: item.get(key) for key in ("surface", "g2p_input", "category", "normalization_hit")}
            for item in records if item["status"] == "unsupported_input"
        ][:30],
        "unresolved_examples": unresolved_examples,
        "normalization_hit_examples": normalization_hit_examples,
        "notes": [
            "The test token's canonical field is not read; only train-split surface/context observations can rewrite raw surfaces.",
            "Context retrieval requires an exact previous/current/next surface triple; surface retrieval is the fallback. Both abstain on ambiguous mappings and canonical collisions.",
            "Inputs outside the native Hangul+whitespace contract are counted as unsupported, not engine errors; train-only retrieval is attempted before this check.",
            "Potential canonical false rewrites are reported, not hidden; a production normalizer needs context-aware detection.",
            "This is not the paper's trained retrieval-augmented ByT5/Qwen model or its staged decoder.",
            "UGTPHON is noisy user-generated text; results must remain separate from canonical G2P and standard-pronunciation evaluation.",
            "The Korean UGTPHON subset is Apache-2.0; the dataset is supplied externally and is not bundled or downloaded at runtime.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--train-corpus", type=Path, default=os.environ.get("UGTPHON_KO_TRAIN_PATH"))
    parser.add_argument("--test-corpus", type=Path, default=os.environ.get("UGTPHON_KO_TEST_PATH"))
    parser.add_argument("--output", type=Path)
    parser.add_argument("--ipa-level", choices=("phonemic", "broad", "narrow"), default="broad")
    args = parser.parse_args()
    if args.train_corpus is None or args.test_corpus is None:
        parser.error("provide --train-corpus and --test-corpus or set UGTPHON_KO_TRAIN_PATH / UGTPHON_KO_TEST_PATH")
    try:
        train_rows = load_corpus(args.train_corpus, expected_split="train")
        test_rows = load_corpus(args.test_corpus, expected_split="test")
        store = build_normalization_datastore(train_rows)
        report = evaluate_surface(test_rows, store, ipa_level=args.ipa_level)
    except Exception as exc:
        print(f"surface benchmark failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    # Unsupported raw UGT forms are an expected diagnostic outcome, not a CI failure.
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
