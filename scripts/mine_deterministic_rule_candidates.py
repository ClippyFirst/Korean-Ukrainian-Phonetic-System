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

FORBIDDEN_HOLDOUT_MARKERS = (
    "24-form", "24_form", "holdout", "test-set", "test_set",
    "benchmark-test", "benchmark_test",
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
    if coda in {"ᆮ", "ᆺ", "ᆻ", "ᆽ", "ᆾ", "ᇂ"}:
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


def _context_records(source_text: str) -> list[dict[str, Any]]:
    """Return coarse adjacent-syllable contexts with source syllable indices."""
    normalized_source = unicodedata.normalize("NFC", source_text)
    word_matches = list(HANGUL_WORD.finditer(normalized_source))
    records: list[dict[str, Any]] = []

    for word_index, match in enumerate(word_matches):
        word = match.group(0)
        parts = [_hangul_parts(char) for char in word]
        for pair_index, (left, right) in enumerate(zip(parts, parts[1:])):
            if left is None or right is None:
                continue
            records.append({
                "context": (
                    f"within-eojeol:coda={_coda_class(left[2])}:"
                    f"next-onset={_onset_class(right[0])}"
                ),
                "scope": "within-eojeol",
                "syllable_refs": [(word_index, pair_index), (word_index, pair_index + 1)],
            })

    # Whitespace-separated eojeols are a distinct context. Punctuation and
    # adjacency are never silently reinterpreted as a word/morpheme boundary.
    for word_index, (left_match, right_match) in enumerate(zip(word_matches, word_matches[1:])):
        separator = normalized_source[left_match.end():right_match.start()]
        if not separator or not separator.isspace():
            continue
        left, right = left_match.group(0), right_match.group(0)
        a, b = _hangul_parts(left[-1]), _hangul_parts(right[0])
        if a and b:
            records.append({
                "context": (
                    f"across-space:coda={_coda_class(a[2])}:"
                    f"next-onset={_onset_class(b[0])}"
                ),
                "scope": "across-space",
                "syllable_refs": [(word_index, len(left) - 1), (word_index + 1, 0)],
            })
    return records


def context_buckets(source_text: str) -> list[str]:
    """Return coarse, interpretable adjacent-syllable contexts, never inferred morphemes."""
    return [record["context"] for record in _context_records(source_text)]


def align_ipa_syllables(source_text: str, ipa_text: str) -> list[list[str]] | None:
    """Align IPA to Hangul syllables only when explicit dot/space boundaries agree.

    This deliberately abstains on strings without a safe one-to-one syllable
    map; it never guesses an alignment from character lengths or edit distance.
    """
    source_words = HANGUL_WORD.findall(unicodedata.normalize("NFC", source_text))
    ipa_words = conservative_normalize(ipa_text).split()
    if not source_words or len(source_words) != len(ipa_words):
        return None

    aligned: list[list[str]] = []
    for source_word, ipa_word in zip(source_words, ipa_words):
        ipa_syllables = ipa_word.split(".")
        if len(source_word) != len(ipa_syllables) or any(not syllable for syllable in ipa_syllables):
            return None
        aligned.append(ipa_syllables)
    return aligned


def _require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def _looks_like_sealed_case_id(case_id: str) -> bool:
    """Fail closed on obvious test/holdout identifiers, even if mislabeled."""
    normalized = unicodedata.normalize("NFC", case_id).strip().lower()
    normalized = re.sub(r"[\s_]+", "-", normalized)
    if re.search(r"(^|[-/])(test|holdout)([-/]|$)", normalized):
        return True
    if re.search(r"(^|[-/])24[-/]?form([-/]|$)", normalized):
        return True
    return False


def load_provenance(path: Path) -> dict[str, Any]:
    provenance = json.loads(path.read_text(encoding="utf-8"))
    for field in ("model_id", "model_revision", "dataset_id", "dataset_revision",
                  "split", "source_url", "dataset_license_status",
                  "model_license_status", "teacher_output_type",
                  "teacher_model_training_overlap_status",
                  "teacher_ipa_convention", "strict_ipa_convention",
                  "ipa_convention_review_id"):
        _require(bool(provenance.get(field)), f"provenance field {field!r} is required")
    _require(str(provenance["teacher_output_type"]).upper() == "IPA",
             "teacher_output_type must be IPA; do not mislabel custom phone alphabets")
    _require(provenance.get("ipa_conventions_comparable") is True,
             "IPA conventions must be explicitly reviewed as comparable before mining disagreements")
    _require(bool(str(provenance.get("ipa_convention_review_id", "")).strip()),
             "ipa_convention_review_id must identify the reviewed mapping decision")
    split = str(provenance["split"]).lower()
    _require(split in ALLOWED_SPLITS,
             f"refusing split {split!r}; only train/dev are allowed, never test/holdout")
    dataset_id = str(provenance["dataset_id"]).lower()
    _require(not any(marker in dataset_id for marker in FORBIDDEN_HOLDOUT_MARKERS),
             f"refusing sealed holdout/test dataset identifier {provenance['dataset_id']!r}")
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
        _require(
            not _looks_like_sealed_case_id(case_id),
            f"line {line_no}: refusing case_id {case_id!r}; identifiers marked test/holdout are forbidden",
        )
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
        # Treat the teacher string as the explicit reference for this
        # pairwise diagnostic, so CER uses the reference length denominator.
        reference_length = max(len(teacher_norm), 1)
        context_records = _context_records(source)
        contexts = [record["context"] for record in context_records]
        teacher_alignment = align_ipa_syllables(source, teacher_norm)
        strict_alignment = align_ipa_syllables(source, strict_norm)
        aligned = (
            teacher_alignment is not None
            and strict_alignment is not None
            and [len(word) for word in teacher_alignment] == [len(word) for word in strict_alignment]
        )
        context_disagreements: list[dict[str, Any]] = []
        if aligned:
            source_words = HANGUL_WORD.findall(unicodedata.normalize("NFC", source))
            word_offsets: list[int] = []
            offset = 0
            for source_word in source_words:
                word_offsets.append(offset)
                offset += len(source_word)

            for record in context_records:
                changed_indices = sorted({
                    word_offsets[word_index] + syllable_index
                    for word_index, syllable_index in record["syllable_refs"]
                    if teacher_alignment[word_index][syllable_index]
                    != strict_alignment[word_index][syllable_index]
                })
                bucket = context_stats[record["context"]]
                bucket["occurrences"] += 1
                bucket["disagreements"] += bool(changed_indices)
                bucket["case_ids"].append(case_id)
                if changed_indices:
                    context_disagreements.append({
                        "context": record["context"],
                        "scope": record["scope"],
                        "changed_syllable_indices": changed_indices,
                    })

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
            "cer_teacher_vs_strict": distance / reference_length,
            "context_associations": contexts,
            "context_alignment_status": (
                "aligned-by-syllable-boundaries"
                if aligned else "unaligned-no-safe-syllable-boundary-map"
            ),
            "context_disagreements": context_disagreements,
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
        "schema_version": "1.1",
        "purpose": "teacher-guided deterministic-rule discovery; diagnostic only",
        "provenance": provenance,
        "protocol": {
            "allowed_splits": sorted(ALLOWED_SPLITS),
            "forbidden_holdout_markers": list(FORBIDDEN_HOLDOUT_MARKERS),
            "benchmark_train_dev_policy": "benchmark datasets are permitted only when provenance pins an actual train/dev partition; test/holdout rows remain forbidden",
            "normalization": "Unicode NFC + whitespace collapse only; preserves length, tone, stress, syllable boundaries, and IPA segments",
            "context_features": (
                "coarse adjacent Hangul coda/onset classes; not morphological analysis; "
                "context disagreement rates use only rows whose explicit dot-delimited IPA "
                "syllables align one-to-one with source Hangul syllables"
            ),
            "automatic_rule_generation": False,
            "test_data_used_for_tuning": False,
            "checkpoint_training_data_overlap": provenance["teacher_model_training_overlap_status"],
            "model_license_status": provenance["model_license_status"],
            "weight_redistribution": "not performed by this tool",
        },
        "summary": {
            "case_count": n,
            "teacher_strict_disagreements": disagreements,
            "teacher_strict_disagreement_rate": disagreements / n,
            "mean_character_error_rate_teacher_reference": sum(row["cer_teacher_vs_strict"] for row in rows) / n,
            "aligned_case_count": sum(
                row["context_alignment_status"] == "aligned-by-syllable-boundaries" for row in rows
            ),
            "unaligned_case_count": sum(
                row["context_alignment_status"] != "aligned-by-syllable-boundaries" for row in rows
            ),
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
