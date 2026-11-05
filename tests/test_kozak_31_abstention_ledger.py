import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def _rows(path):
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def test_all_31_unresolved_broad_queue_rows_have_individual_abstentions():
    queue = _rows(ROOT / "research/kozak-kim-unmapped-mismatch-review-queue-2026-11-03.csv")
    ledger = _rows(ROOT / "research/kozak-kim-31-row-individual-abstentions-2026-11-05.csv")
    excluded = {"37", "704", "2018", "2031", "1140"}

    assert len(queue) == 36
    assert len(ledger) == 31
    assert {row["occurrence_id"] for row in ledger} == {
        row["occurrence_id"] for row in queue
    } - excluded
    assert len({row["occurrence_id"] for row in ledger}) == 31

    for row in ledger:
        assert row["decision"] == "ABSTAIN"
        assert row["production_action"] == "NO_CHANGE_PENDING_PRIMARY_SOURCE_AND_INDEPENDENT_IPA_REVIEW"
        assert row["independent_ipa_review_status"] == "NOT_PERFORMED"
        assert row["context_lookup_status"] == "FOUND"
        assert row["source_corpus"] == "UGTPHON/ko/test.json"
        assert row["corpus_commit"] == "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54"
        assert row["queue_blob_sha"] == "fc331b42bbfd31700892d1f7df04dcb8578461f5"
        assert row["kozak_engine_commit"] == "NOT_RECOVERED_FROM_HISTORICAL_QUEUE"
        assert row["normalizer_version"] == "NOT_RECOVERED_FROM_HISTORICAL_QUEUE"
        assert row["individual_rationale"]
        assert row["reason_code"]
        assert row["occurrence_id"] in row["individual_rationale"]
        assert row["source_row_id"] in row["individual_rationale"]

    # Each disposition explains the concrete unmatched fragment(s) for its row;
    # the common reason code does not substitute for occurrence-specific rationale.
    assert len({row["individual_rationale"] for row in ledger}) == 31


def test_31_row_abstentions_do_not_claim_to_be_the_historical_239_population():
    ledger = _rows(ROOT / "research/kozak-kim-31-row-individual-abstentions-2026-11-05.csv")
    ids = {row["occurrence_id"] for row in ledger}
    assert "37" not in ids and "704" not in ids and "2018" not in ids and "2031" not in ids
    assert "1140" not in ids
    assert all(row["decision"] == "ABSTAIN" for row in ledger)
