import csv
import importlib.util
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("candidate_review", ROOT / "scripts/build_kozak_236_candidate_review.py")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
OUTPUT = ROOT / "research/kozak-kim-236-candidate-review-2026-11-05.csv"

def test_reconstructed_236_review_ledger_has_exact_membership_and_statuses():
    rows = MODULE.build_rows(ROOT)
    assert len(rows) == 236
    assert len({row["occurrence_id"] for row in rows}) == 236
    assert Counter(row["candidate_disposition"] for row in rows) == {
        "NOT_INDIVIDUALLY_ADJUDICATED": 213,
        "ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW": 22,
        "RETAIN_PENDING_INDEPENDENT_IPA_REVIEW": 1,
    }
    assert all(row["historical_membership_confidence"] ==
        "RECONSTRUCTED_CANDIDATE_NOT_ORIGINAL_MEMBERSHIP_PROOF" for row in rows)
    assert all(row["source_context_text"] and row["source_context_canonical"] and
        row["source_context_phonemes"] for row in rows)
    assert all("historical_export_cluster_labels_descriptive_only" in row for row in rows)
    assert all(row["candidate_selection_method"] ==
        "PRE_C11_C12_BROAD_ONLY_AGGREGATE_C01_C10_REPLAY" for row in rows)

def test_checked_in_ledger_matches_reproducible_generator():
    expected = MODULE.build_rows(ROOT)
    with OUTPUT.open(encoding="utf-8", newline="") as handle:
        actual = list(csv.DictReader(handle))
    assert actual == expected

def test_236_broad_edit_signature_inventory_and_historical_tags_are_stable():
    rows = MODULE.build_rows(ROOT)
    operations = Counter()
    for row in rows:
        for item in json.loads(row["broad_mismatch_fragments"]):
            signature = f'{item["op"]}|{item.get("reference_fragment") or "∅"}→{item.get("kozak_fragment") or "∅"}'
            operations[signature] += 1
    assert sum(operations.values()) == 254
    assert len(operations) == 24
    assert operations["S|ɕ→s"] == 184
    assert operations["S|ɕ͈→s͈"] == 24

    historical = [row["historical_export_cluster_labels_descriptive_only"].split(";") for row in rows]
    assert sum(any(label.startswith("C11") for label in labels) for labels in historical) == 207
    assert sum(any(label.startswith("C04") for label in labels) for labels in historical) == 206
