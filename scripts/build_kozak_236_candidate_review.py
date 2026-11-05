#!/usr/bin/env python3
"""Build the evidence-preserving 236-occurrence review inventory."""
from __future__ import annotations
import argparse
import csv
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IDS_PATH = ROOT / "research/kozak-kim-historical-239-candidate-ids-2026-11-05.txt"
SUPERSET_PATH = ROOT / "research/kozak-kim-broad-mismatch-context-ledger-2026-11-05.csv"
ABSTENTION_PATH = ROOT / "research/kozak-kim-31-row-individual-abstentions-2026-11-05.csv"
ADJUDICATION_PATH = ROOT / "research/kozak-kim-context-adjudication-2026-11-05.csv"
OUTPUT_PATH = ROOT / "research/kozak-kim-236-candidate-review-2026-11-05.csv"
FIXES = {
    37: ("multilexnorm2026_1916", "해줄것"),
    704: ("multilexnorm2026_2011", "많을거같이"),
    2031: ("dc_inside_2266", "내릴수있는"),
}
RETAIN_ID = 1140

def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))

def build_rows(root: Path = ROOT) -> list[dict[str, str]]:
    def p(path: Path) -> Path:
        return root / path.relative_to(ROOT)
    ids_lines = IDS_PATH.read_text(encoding="utf-8").splitlines()
    candidate_ids = [int(value) for value in ids_lines[1].split(",") if value]
    if len(candidate_ids) != 239 or len(set(candidate_ids)) != 239:
        raise ValueError("Expected 239 unique reconstructed candidate IDs")
    source = read_csv(p(SUPERSET_PATH))
    source_by_id = {int(row["occurrence_id"]): row for row in source}
    if len(source_by_id) != 370 or len(source) != 370:
        raise ValueError("Expected the pinned 370-row Broad-mismatch superset")
    if any(value not in source_by_id for value in candidate_ids):
        raise ValueError("Candidate ID missing from the 370-row context superset")
    for candidate_id, expected in FIXES.items():
        row = source_by_id[candidate_id]
        if (row["source_row_id"], row["token"]) != expected:
            raise ValueError(f"FIX crosswalk mismatch for occurrence {candidate_id}")
    retain = source_by_id[RETAIN_ID]
    if (retain["source_row_id"], retain["token"]) != ("dc_inside_2107", "출산"):
        raise ValueError("RETAIN crosswalk mismatch for occurrence 1140")
    abstentions = read_csv(p(ABSTENTION_PATH))
    abstention_by_id = {int(row["occurrence_id"]): row for row in abstentions}
    adjudications = read_csv(p(ADJUDICATION_PATH))
    retain_adjudication = next((row for row in adjudications
        if row["source_row_id"] == retain["source_row_id"] and row["token"] == retain["token"]), None)
    if retain_adjudication is None:
        raise ValueError("Missing source-backed RETAIN record for occurrence 1140")
    remaining = [value for value in candidate_ids if value not in FIXES]
    if len(remaining) != 236:
        raise ValueError("Expected 236 candidates after three FIX overlaps")
    overlap = set(remaining) & set(abstention_by_id)
    if len(overlap) != 22:
        raise ValueError(f"Expected 22 abstention overlaps, got {len(overlap)}")
    if RETAIN_ID not in remaining:
        raise ValueError("RETAIN occurrence is not in the candidate cohort")
    token_counts = Counter(source_by_id[value]["token"] for value in remaining)
    source_counts = Counter(source_by_id[value]["source_row_id"] for value in remaining)
    pair_counts = Counter((source_by_id[value]["source_row_id"], source_by_id[value]["token"]) for value in remaining)
    excluded = {"candidate_clusters", "historical_239_membership", "decision", "decision_status", "decision_rationale"}
    source_fields = [field for field in source[0] if field not in excluded]
    output = []
    for candidate_id in remaining:
        row = source_by_id[candidate_id]
        abstention = abstention_by_id.get(candidate_id)
        if abstention:
            disposition = "ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW"
            basis = "Existing 31-row individual-abstention ledger; one of 22 cohort overlaps."
            reason = abstention["reason_code"]
            rationale = abstention["individual_rationale"]
            ipa_status = abstention["independent_ipa_review_status"]
        elif candidate_id == RETAIN_ID:
            disposition = "RETAIN_PENDING_INDEPENDENT_IPA_REVIEW"
            basis = "Existing source-backed R012 context record; independent review pending."
            reason = "SOURCE_BACKED_R012_RETAIN_PENDING_INDEPENDENT_REVIEW"
            rationale = retain_adjudication["notes"]
            ipa_status = retain_adjudication["independent_review_status"]
        else:
            disposition = "NOT_INDIVIDUALLY_ADJUDICATED"
            basis = "No occurrence-level disposition found in current narrow review registers."
            reason = ""
            rationale = ""
            ipa_status = "NOT_PERFORMED"
        item = {field: row.get(field, "") for field in source_fields}
        item.update({
            "historical_export_cluster_labels_descriptive_only": row["candidate_clusters"],
            "source_ledger_default_decision": row["decision"],
            "source_ledger_default_status": row["decision_status"],
            "source_ledger_default_rationale": row["decision_rationale"],
            "candidate_disposition": disposition,
            "candidate_disposition_basis": basis,
            "prior_individual_reason_code": reason,
            "prior_individual_rationale": rationale,
            "prior_independent_ipa_review_status": ipa_status,
            "token_occurrences_in_review": str(token_counts[row["token"]]),
            "source_row_occurrences_in_review": str(source_counts[row["source_row_id"]]),
            "source_row_token_occurrences_in_review": str(pair_counts[(row["source_row_id"], row["token"])]),
            "candidate_selection_method": "PRE_C11_C12_BROAD_ONLY_AGGREGATE_C01_C10_REPLAY",
            "historical_membership_confidence": "RECONSTRUCTED_CANDIDATE_NOT_ORIGINAL_MEMBERSHIP_PROOF",
        })
        output.append(item)
    return output

def write_output(path: Path = OUTPUT_PATH, root: Path = ROOT) -> dict[str, int]:
    rows = build_rows(root)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    counts = Counter(row["candidate_disposition"] for row in rows)
    return {"rows": len(rows), **dict(counts)}

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=OUTPUT_PATH)
    args = parser.parse_args()
    print(json.dumps(write_output(args.output), ensure_ascii=False, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
