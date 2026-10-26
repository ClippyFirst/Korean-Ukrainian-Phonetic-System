#!/usr/bin/env python3
"""Mine reviewable deterministic-rule candidates from teacher/strict disagreements.

This is an offline research utility, not a runtime model and not an automatic
rule generator. It refuses known benchmark/holdout splits, preserves raw outputs,
and only reports associations between Hangul contexts and disagreements. A
human must independently verify each proposed rule against primary phonology
sources and held-out evidence before any production code/data is changed.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path
from typing import Any

FORBIDDEN_DATASET_MARKERS = (
    "ugtphon", "sigmorphon", "24-form", "24_form", "holdout", "test-set",
    "test_set", "benchmark-test", "benchmark_test",
)
ALLOWED_SPLITS = {"train", "dev"}
HANGUL_SYLLABLE = re.compile(r"^[\uac00-\ud7a3]$")
HANGUL_WORD = re.compile(r"[\uac00-\ud7a3]+")


def conservative_normalize(value: str) -> str:
    """Normalize Unicode composition and whitespace only; preserve IPA contrasts."""
    return " ".join(unicodedata.normalize("NFC", value).split())


def edit_distance(left: str, right: str) -> int:
    """Memory-bounded Levenshtein distance."""
    if len(left) < len(right):
        left, right = right, left
    previous = list(range(len(right) + 1))
    for i, char_left in enumerate(left, 1):
        current = [i]
        for j, char_right in enumerate(right, 1):
            current.append(min(
                current[-1] + 1,
                previous[j] + 1,
                previous[j - 1] + (char_left != char_right),
            ))
        previous = current
    return previous[-1]


def _hangul_parts(char: str) -> tuple[str, str, str] | None:
    if not HANGUL_SYLLABLE.fullmatch(char):
        return None
    offset = ord(char) - 0xAC00
    onset_index = offset // 588
    vowel_index = (offset % 588) // 28
    coda_index = offset % 28
    decomposed = unicodedata.normalize("NFD", char)
    onset, vowel = decomposed[0], decomposed[1]
    coda = decomposed[2] if coda_index else ""
    return onset, vowel, coda


def _onset_class(onset: str) -> str:
    if onset in {"ᄀ", "ᄁ", "ᄏ"}:
        return "velar"
    if onset in {"ᄃ", "ᄄ", "ᄐ"}:
        return "coronal-stop"
    if onset in {"ᄇ", "ᄈ", "ᄑ"}:
        return "bilabial"
    if onset in {"ᄉ", "ᄊ", "ᄌ", "ᄍ", "ᄎ"}:
        return "sibilant-or-affricate"
    if onset == "ᄂ":
        return "nasal-n"
    if onset == "ᄅ":
        return "liquid-r"
    if onset == "ᄆ":
        return "nasal-m"
    if onset == "ᄋ":
        return "silent-onset"
    if onset == "ᄒ":
        return "h"
    return "other"


def _coda_class(coda: str) -> str:
    if not coda:
        return "open"
    if coda in {"ᆨ", "ᆩ", "ᆪ", "ᆿ"}:
        return "velar-family"
    if coda in {"ᆮ", "ᆺ", "ᆻ", "ᆽ", "ᆾ", "ᆿ", "ᇂ"}:
        return "coronal-neutralizing-family"
    if coda in {"ᆸ", "ᆹ", "ᇁ"}:
        return "bilabial-family"
    if coda in {"ᆫ", "ᆬ", "ᆭ"}:
        return "n-family"
    if coda in {"ᆯ", "ᆰ", "ᆱ", "ᆲ", "ᆳ", "ᆴ", "ᆵ", "ᆶ"}:
        return "l-family"
    if coda == "ᆷ":
        return "m"
    if coda == "ᆼ":
        return "ng"
    return "other"


def context_buckets(source_text: str) -> list[str]:
    """Return coarse, interpretable adjacent-syllable contexts, never inferred morphemes."""
    contexts: list[str] = []
    for word in HANGUL_WORD.findall(unicodedata.normalize("NFC", source_text)):
        parts = [_hangul_parts(char) for char in word]
        for left, right in zip(parts, parts[1:]):
            if left is None or right is None:
                continue
            contexts.append(
                f"within-eojeol:coda={_coda_class(left[2])}:next-onset={_onset_class(right[0])}"
            )
    # Word-boundary pairs are a separate context type; no punctuation/space
    # is silently treated as a morpheme boundary.
    tokens = re.findall(r"[\uac00-\ud7a3]+|[^\uac00-\ud7a3]+", source_text)
    for left, right in zip(tokens, tokens[1:]):
        if not HANGUL_WORD.fullmatch(left) or not HANGUL_WORD.fullmatch(right):
            continue
        a, b = _hangul_parts(left[-1]), _hangul_parts(right[0])
        if a and b:
            contexts.append(
                f"across-space:coda={_coda_class(a[2])}:next-onset={_onset_class(b[0])}"
            )
    return contexts


def _require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def load_provenance(path: Path) -> dict[str, Any]:
    provenance = json.loads(path.read_text(encoding="utf-8"))
    for field in ("model_id", "model_revision", "dataset_id", "dataset_revision",
                  "split", "source_url", "dataset_license_status"):
        _require(bool(provenance.get(field)), f"provenance field {field!r} is required")
    split = str(provenance["split"]).lower()
    _require(split in ALLOWED_SPLITS,
             f"refusing split {split!r}; only train/dev are allowed, never test/holdout")
    dataset_id = str(provenance["dataset_id"]).lower()
    _require(not any(marker in dataset_id for marker in FORBIDDEN_DATASET_MARKERS),
             f"refusing known benchmark/holdout dataset identifier {provenance['dataset_id']!r}")
    _require(provenance.get("test_data_used_for_tuning") is False,
             "provenance must explicitly set test_data_used_for_tuning=false")
    return provenance


def build_report(input_path: Path, provenance_path: Path, min_context_support: int = 3) -> dict[str, Any]:
    provenance = load_provenance(provenance_path)
    rows: list[dict[str, Any]] = []
    context_stats: dict[str, dict[str, Any]] = defaultdict(
        lambda: {"occurrences": 0, "disagreements": 0, "case_ids": []}
    )
    seen_ids: set[str] = set()

    for line_no, line in enumerate(input_path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSONL at line {line_no}: {exc}") from exc
        case_id = str(item.get("case_id", "")).strip()
        _require(bool(case_id), f"line {line_no}: case_id is required")
        _require(case_id not in seen_ids, f"line {line_no}: duplicate case_id {case_id!r}")
        seen_ids.add(case_id)
        row_split = str(item.get("split", provenance["split"])).lower()
        _require(row_split in ALLOWED_SPLITS,
                 f"line {line_no}: refusing split {row_split!r}; only train/dev allowed")
        _require(row_split == str(provenance["split"]).lower(),
                 f"line {line_no}: row split differs from provenance split")
        source = item.get("source_text")
        teacher_raw = item.get("teacher_ipa")
        strict_raw = item.get("strict_ipa")
        _require(isinstance(source, str) and bool(source.strip()),
                 f"line {line_no}: non-empty source_text is required")
        _require(isinstance(teacher_raw, str) and bool(teacher_raw.strip()),
                 f"line {line_no}: non-empty teacher_ipa is required")
        _require(isinstance(strict_raw, str) and bool(strict_raw.strip()),
                 f"line {line_no}: non-empty strict_ipa is required")
        _require(bool(HANGUL_WORD.search(source)),
                 f"line {line_no}: source_text must contain Hangul")

        teacher_norm = conservative_normalize(teacher_raw)
        strict_norm = conservative_normalize(strict_raw)
        distance = edit_distance(teacher_norm, strict_norm)
        max_len = max(len(teacher_norm), len(strict_norm), 1)
        contexts = context_buckets(source)
        for context in contexts:
            bucket = context_stats[context]
            bucket["occurrences"] += 1
            bucket["disagreements"] += distance > 0
            bucket["case_ids"].append(case_id)

        rows.append({
            "case_id": case_id,
            "split": row_split,
            "source_text": source,
            "teacher_raw": teacher_raw,
            "teacher_normalized": teacher_norm,
            "strict_raw": strict_raw,
            "strict_normalized": strict_norm,
            "exact_match_after_conservative_normalization": distance == 0,
            "character_edit_distance": distance,
            "cer_teacher_vs_strict": distance / max_len,
            "context_associations": contexts,
            "source_provenance": item.get("source_provenance", ""),
            "human_review_status": "not-reviewed",
        })

    _require(bool(rows), "input JSONL has no data rows")
    n = len(rows)
    disagreements = sum(not row["exact_match_after_conservative_normalization"] for row in rows)
    candidates = []
    for context, stats in sorted(context_stats.items()):
        count = stats["occurrences"]
        if count < min_context_support:
            continue
        candidates.append({
            "context": context,
            "occurrences": count,
            "disagreements": stats["disagreements"],
            "disagreement_rate": stats["disagreements"] / count,
            "case_ids": sorted(set(stats["case_ids"])),
            "interpretation": "association only; not causal evidence and not an executable rule",
            "human_review_status": "needs-independent-source-review",
        })
    candidates.sort(key=lambda item: (-item["disagreement_rate"], -item["occurrences"], item["context"]))
    return {
        "schema_version": "1.0",
        "purpose": "teacher-guided deterministic-rule discovery; diagnostic only",
        "provenance": provenance,
        "protocol": {
            "allowed_splits": sorted(ALLOWED_SPLITS),
            "forbidden_dataset_markers": list(FORBIDDEN_DATASET_MARKERS),
            "normalization": "Unicode NFC + whitespace collapse only; preserves length, tone, stress, syllable boundaries, and IPA segments",
            "context_features": "coarse adjacent Hangul coda/onset classes; not morphological analysis",
            "automatic_rule_generation": False,
            "test_data_used_for_tuning": False,
            "checkpoint_training_data_overlap": "not inferred by this tool; must be audited separately",
        },
        "summary": {
            "case_count": n,
            "teacher_strict_disagreements": disagreements,
            "teacher_strict_disagreement_rate": disagreements / n,
            "mean_character_error_rate": sum(row["cer_teacher_vs_strict"] for row in rows) / n,
            "context_candidate_count": len(candidates),
        },
        "cases": rows,
        "context_associations": candidates,
        "acceptance_gate": [
            "independently verify the teacher output against a source-backed Korean pronunciation reference",
            "identify the exact phonological and morphological environment; do not infer morphology from Hangul adjacency",
            "write positive and negative-control regression cases",
            "test on a separate dev set before touching held-out data",
            "keep the production engine deterministic and neural-free",
            "preserve IPA-to-Ukrainian adaptation as a separate stage",
        ],
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-jsonl", type=Path, required=True)
    parser.add_argument("--provenance-json", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--min-context-support", type=int, default=3)
    args = parser.parse_args(argv)
    if args.min_context_support < 1:
        parser.error("--min-context-support must be >= 1")
    try:
        report = build_report(args.input_jsonl, args.provenance_json, args.min_context_support)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(report["summary"], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
