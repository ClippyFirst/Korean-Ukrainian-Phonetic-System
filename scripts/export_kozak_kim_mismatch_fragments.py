#!/usr/bin/env python3
"""Export occurrence-level Kozak Kim IPA mismatch fragments for human triage.

The alignment is grapheme-cluster string alignment, not phoneme alignment.
It is diagnostic only: it does not select gold, adjudicate pronunciation, or
change production rules.
"""
from __future__ import annotations

import argparse
import csv
import json
import unicodedata
from pathlib import Path

FIELDS = [
    "occurrence_id", "source_row_id", "token", "surface_hangul",
    "strict_reference_ipa", "strict_kozak_ipa", "strict_edit_distance",
    "g2pk_ipa", "g2pk_edit_distance",
    "broad_reference_ipa", "broad_kozak_ipa", "broad_edit_distance",
    "strict_mismatch_fragments", "broad_mismatch_fragments",
    "strict_fragment_cluster_labels", "broad_fragment_cluster_labels",
    "unmapped_strict_fragment_count", "unmapped_broad_fragment_count",
    "unmapped_broad_fragments", "has_unmapped_broad_fragments",
    "context_corpus", "context_corpus_revision", "context_corpus_license",
    "context_lookup_status",
    "candidate_clusters", "review_status", "production_action",
]


def graphemes(value: str) -> list[str]:
    """Keep each base code point with following combining marks."""
    result: list[str] = []
    for char in unicodedata.normalize("NFC", value):
        codepoint = ord(char)
        ipa_modifier = 0x02B0 <= codepoint <= 0x02FF and char not in {"ˈ", "ˌ"}
        if (unicodedata.combining(char) or ipa_modifier) and result:
            result[-1] += char
        else:
            result.append(char)
    return result


def align(reference: str, prediction: str) -> list[dict[str, str]]:
    """Deterministic Levenshtein alignment over Unicode grapheme clusters."""
    a, b = graphemes(reference), graphemes(prediction)
    n, m = len(a), len(b)
    costs = [[0] * (m + 1) for _ in range(n + 1)]
    back = [[None] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        costs[i][0], back[i][0] = i, "D"
    for j in range(1, m + 1):
        costs[0][j], back[0][j] = j, "I"
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            options = [
                (costs[i - 1][j - 1] + (a[i - 1] != b[j - 1]), "M" if a[i - 1] == b[j - 1] else "S"),
                (costs[i - 1][j] + 1, "D"),
                (costs[i][j - 1] + 1, "I"),
            ]
            costs[i][j], back[i][j] = min(options, key=lambda item: item[0])
    edits = []
    i, j = n, m
    while i or j:
        op = back[i][j]
        if op in ("M", "S"):
            left, right = a[i - 1], b[j - 1]
            i, j = i - 1, j - 1
        elif op == "D":
            left, right = a[i - 1], ""
            i -= 1
        else:
            left, right = "", b[j - 1]
            j -= 1
        if op != "M":
            edits.append({"op": op, "reference_fragment": left, "kozak_fragment": right})
    return list(reversed(edits))


def classify_fragments(
    fragments: list[dict[str, str]],
    strict_reference: str = "",
    strict_prediction: str = "",
) -> list[dict[str, object]]:
    """Attach conservative candidate labels to each edit, not just its token.

    A token can contain both a familiar difference and an unrelated edit.
    Keeping the latter explicitly unmapped prevents a known cluster from
    masking work that still needs review. Labels remain diagnostic hypotheses.
    """
    c12_context = (
        ("kx" in strict_reference or "kç" in strict_reference)
        and "kʰ" in strict_prediction
    )
    classified: list[dict[str, object]] = []
    for index, fragment in enumerate(fragments):
        reference = fragment["reference_fragment"]
        prediction = fragment["kozak_fragment"]
        text = reference + prediction
        labels: list[str] = []

        c12_fragment = False
        if c12_context:
            c12_fragment = (
                "x" in reference
                or "ç" in reference
                or "kʰ" in prediction
                or (
                    reference == "k"
                    and not prediction
                    and index + 1 < len(fragments)
                    and fragments[index + 1]["reference_fragment"] == "h"
                    and fragments[index + 1]["kozak_fragment"] == "kʰ"
                )
            )

        if c12_fragment:
            labels.append("C12_aspirated_velar_coarticulation_profile")
        if any(char in text for char in "ɭɾʎ"):
            labels.append("C01_C07_liquid_realization")
        if not c12_fragment and (
            any(char in text for char in "ɦçβʝɸxɣ")
            or ("h" in text and "ʰ" not in text)
        ):
            labels.append("C02_h_realization")
        if "ɲ" in text:
            labels.append("C03_nasal_palatalization")
        if not c12_fragment and any(char in text for char in "ʰ͡"):
            labels.append("C04_aspiration_affricate_notation")
        if (
            ("ɕ" in reference and "s" in prediction)
            or ("s" in reference and "ɕ" in prediction)
        ):
            labels.append("C11_sibilant_place_profile_boundary")
        if any(char in text for char in "yɥø"):
            labels.append("C05_front_rounded_vowel")
        if "̚" in text:
            labels.append("C06_unreleased_coda")
        if any(char in text for char in "ːˑ"):
            labels.append("C09_vowel_length")
        if any(char in text for char in "ˈˌ"):
            labels.append("C10_stress")
        if not labels:
            labels.append("UNMAPPED_REQUIRES_REVIEW")

        classified.append({
            **fragment,
            "candidate_clusters": sorted(set(labels)),
        })
    return classified


def candidate_clusters(
    fragments: list[dict[str, str]],
    strict_reference: str = "",
    strict_prediction: str = "",
) -> list[str]:
    """Return the union of candidate labels and expose any unmapped edit."""
    classified = classify_fragments(fragments, strict_reference, strict_prediction)
    labels = {
        label
        for fragment in classified
        for label in fragment["candidate_clusters"]
    }
    return sorted(labels)


def build_rows(
    report: dict,
    corpus_rows: list[dict] | None = None,
    corpus_revision: str = "",
    corpus_license: str = "",
) -> list[dict[str, str]]:
    if corpus_rows is not None and (not corpus_revision or not corpus_license):
        raise ValueError("corpus_revision and corpus_license are required when corpus_rows are supplied")
    corpus_by_id = {
        str(row["id"]): row
        for row in (corpus_rows or [])
        if isinstance(row, dict) and row.get("id") is not None
    }
    engines = report.get("per_engine_occurrences", {})
    native = engines.get("clippyfirst_native")
    g2pk = engines.get("g2pk_0_9_4")
    if not isinstance(native, list) or not isinstance(g2pk, list):
        raise ValueError("report must contain Native and g2pK occurrence ledgers")
    g2pk_by_id = {str(item["occurrence_id"]): item for item in g2pk}
    rows = []
    for item in native:
        if item.get("status") != "scored":
            continue
        other = g2pk_by_id.get(str(item["occurrence_id"]), {})
        strict_distance = int(item.get("distance") or 0)
        broad = item.get("broad_candidate") or {}
        broad_distance = int(broad.get("distance") or 0)
        strict_fragments = align(item["gold"], item["ipa"]) if strict_distance else []
        broad_reference = broad.get("closest_gold", "")
        broad_prediction = broad.get("predicted", "")
        broad_fragments = align(broad_reference, broad_prediction) if broad_distance else []
        if not strict_fragments and not broad_fragments:
            continue
        strict_classified = classify_fragments(strict_fragments, item["gold"], item["ipa"])
        broad_classified = classify_fragments(broad_fragments, item["gold"], item["ipa"])
        labels = sorted({
            label
            for fragment in strict_classified + broad_classified
            for label in fragment["candidate_clusters"]
        })
        unmapped_strict = [
            {key: fragment[key] for key in ("op", "reference_fragment", "kozak_fragment")}
            for fragment in strict_classified
            if "UNMAPPED_REQUIRES_REVIEW" in fragment["candidate_clusters"]
        ]
        unmapped_broad = [
            {key: fragment[key] for key in ("op", "reference_fragment", "kozak_fragment")}
            for fragment in broad_classified
            if "UNMAPPED_REQUIRES_REVIEW" in fragment["candidate_clusters"]
        ]
        source_row_id = str(item.get("row_id", ""))
        context_requested = corpus_rows is not None
        context_found = source_row_id in corpus_by_id
        rows.append({
            "occurrence_id": str(item["occurrence_id"]),
            "source_row_id": source_row_id,
            "token": str(item.get("token", "")),
            "surface_hangul": str(item.get("surface_hangul", "")),
            "strict_reference_ipa": str(item["gold"]),
            "strict_kozak_ipa": str(item["ipa"]),
            "strict_edit_distance": str(strict_distance),
            "g2pk_ipa": str(other.get("ipa", "")),
            "g2pk_edit_distance": str(other.get("distance", "")),
            "broad_reference_ipa": str(broad_reference),
            "broad_kozak_ipa": str(broad_prediction),
            "broad_edit_distance": str(broad_distance),
            "strict_mismatch_fragments": json.dumps(strict_fragments, ensure_ascii=False, separators=(",", ":")),
            "broad_mismatch_fragments": json.dumps(broad_fragments, ensure_ascii=False, separators=(",", ":")),
            "strict_fragment_cluster_labels": json.dumps(strict_classified, ensure_ascii=False, separators=(",", ":")),
            "broad_fragment_cluster_labels": json.dumps(broad_classified, ensure_ascii=False, separators=(",", ":")),
            "unmapped_strict_fragment_count": str(len(unmapped_strict)),
            "unmapped_broad_fragment_count": str(len(unmapped_broad)),
            "unmapped_broad_fragments": json.dumps(unmapped_broad, ensure_ascii=False, separators=(",", ":")),
            "has_unmapped_broad_fragments": "true" if unmapped_broad else "false",
            "context_corpus": "UGTPHON/ko/test.json" if context_requested else "",
            "context_corpus_revision": corpus_revision if context_requested else "",
            "context_corpus_license": corpus_license if context_requested else "",
            "context_lookup_status": (
                "FOUND" if context_found else "MISSING"
            ) if context_requested else "NOT_REQUESTED",
            "candidate_clusters": ";".join(labels),
            "review_status": "UNADJUDICATED_DIAGNOSTIC",
            "production_action": "NO_CHANGE_PENDING_SOURCE_AND_IPA_REVIEW",
        })
    return rows


def filter_unmapped_broad(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    """Select only occurrences with at least one unmapped Broad-profile edit."""
    return [row for row in rows if row.get("has_unmapped_broad_fragments") == "true"]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report-json", type=Path, required=True)
    parser.add_argument("--output-csv", type=Path, required=True)
    parser.add_argument("--corpus-json", type=Path)
    parser.add_argument("--corpus-revision")
    parser.add_argument("--corpus-license")
    parser.add_argument("--only-unmapped-broad", action="store_true")
    args = parser.parse_args()
    corpus_args_supplied = bool(args.corpus_json)
    if corpus_args_supplied != bool(args.corpus_revision) or corpus_args_supplied != bool(args.corpus_license):
        parser.error("--corpus-json, --corpus-revision, and --corpus-license must be supplied together")
    report = json.loads(args.report_json.read_text(encoding="utf-8"))
    corpus_rows = (
        json.loads(args.corpus_json.read_text(encoding="utf-8"))
        if args.corpus_json else None
    )
    all_rows = build_rows(
        report, corpus_rows, args.corpus_revision or "", args.corpus_license or ""
    )
    rows = filter_unmapped_broad(all_rows) if args.only_unmapped_broad else all_rows
    args.output_csv.parent.mkdir(parents=True, exist_ok=True)
    with args.output_csv.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=FIELDS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    print(json.dumps({
        "status": "DIAGNOSTIC_ONLY",
        "benchmark": report.get("benchmark"),
        "eligible_occurrences": report.get("eligible_token_occurrences"),
        "annotated_mismatch_occurrences": len(all_rows),
        "output_rows": len(rows),
        "only_unmapped_broad": args.only_unmapped_broad,
        "unmapped_broad_occurrences": sum(
            row["has_unmapped_broad_fragments"] == "true" for row in all_rows
        ),
        "unmapped_broad_fragments": sum(
            int(row["unmapped_broad_fragment_count"]) for row in all_rows
        ),
        "context_lookup_missing": sum(
            row["context_lookup_status"] == "MISSING" for row in all_rows
        ),
        "strict_profile": report.get("native_ipa_profile"),
        "broad_profile": report.get("broad_candidate_profile", {}).get("profile_id"),
        "alignment": "NFC Unicode grapheme-cluster Levenshtein; not phoneme alignment",
        "production_rules_changed": False,
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
