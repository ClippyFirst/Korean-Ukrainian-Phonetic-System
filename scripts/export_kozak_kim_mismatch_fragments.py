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


def candidate_clusters(fragments: list[dict[str, str]]) -> list[str]:
    text = "".join(item["reference_fragment"] + item["kozak_fragment"] for item in fragments)
    labels = []
    if any(char in text for char in "ɭɾʎ"):
        labels.append("C01_C07_liquid_realization")
    if any(char in text for char in "hɦçβʝɸxɣ"):
        labels.append("C02_h_realization")
    if "ɲ" in text:
        labels.append("C03_nasal_palatalization")
    if any(char in text for char in "ʰ͡"):
        labels.append("C04_aspiration_affricate_notation")
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
    return labels


def build_rows(report: dict) -> list[dict[str, str]]:
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
        labels = sorted(set(candidate_clusters(strict_fragments + broad_fragments)))
        rows.append({
            "occurrence_id": str(item["occurrence_id"]),
            "source_row_id": str(item.get("row_id", "")),
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
            "candidate_clusters": ";".join(labels),
            "review_status": "UNADJUDICATED_DIAGNOSTIC",
            "production_action": "NO_CHANGE_PENDING_SOURCE_AND_IPA_REVIEW",
        })
    return rows


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report-json", type=Path, required=True)
    parser.add_argument("--output-csv", type=Path, required=True)
    args = parser.parse_args()
    report = json.loads(args.report_json.read_text(encoding="utf-8"))
    rows = build_rows(report)
    args.output_csv.parent.mkdir(parents=True, exist_ok=True)
    with args.output_csv.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    print(json.dumps({
        "status": "DIAGNOSTIC_ONLY",
        "benchmark": report.get("benchmark"),
        "eligible_occurrences": report.get("eligible_token_occurrences"),
        "annotated_mismatch_occurrences": len(rows),
        "strict_profile": report.get("native_ipa_profile"),
        "broad_profile": report.get("broad_candidate_profile", {}).get("profile_id"),
        "alignment": "NFC Unicode grapheme-cluster Levenshtein; not phoneme alignment",
        "production_rules_changed": False,
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
