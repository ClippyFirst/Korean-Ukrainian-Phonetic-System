import csv
import json
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
        assert row["source_context_text"]
        assert row["source_context_canonical"]
        assert row["source_context_phonemes"]
        assert int(row["source_token_index"]) in json.loads(row["source_token_index_candidates"])
        assert row["source_corpus"] == "UGTPHON/ko/test.json"
        assert row["corpus_commit"] == "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54"
        assert row["queue_blob_sha"] == "fc331b42bbfd31700892d1f7df04dcb8578461f5"
        assert row["kozak_engine_commit"] == "c0cbe3740e734c87d3202cca496b83d9603ea218"
        assert row["kozak_profile"] == (
            "clippyfirst-korean-broad-v1@1 (benchmark run 41797143671; "
            "engine commit c0cbe3740e734c87d3202cca496b83d9603ea218)"
        )
        assert row["normalizer_version"] == (
            "normalizeIpa+normalizeIpaBroadCandidateWithLoss@"
            "5a1ea3c2e99ba20303122bb124a6aaec22e56ad2; "
            "profile=korean-broad-candidate-sensitivity-v1@1"
        )
        assert row["benchmark_run_id"] == "41797143671"
        assert row["benchmark_head_sha"] == "c0cbe3740e734c87d3202cca496b83d9603ea218"
        assert row["benchmark_artifact_id"] == "13305479036"
        assert row["benchmark_artifact_zip_sha256"] == (
            "37a4b15ade1a1422a62b47eb634c032badef1412e217d7c57979cf418264a7fa"
        )
        assert row["benchmark_report_sha256"] == (
            "f489139efbd00cab293e14c437bdab992de95477194fb1f2b5164aafacf16560"
        )
        assert row["normalizer_script_blob_sha"] == "5a1ea3c2e99ba20303122bb124a6aaec22e56ad2"
        assert row["broad_profile_blob_sha"] == "e13086f0fd98ce9564326ff50b0458c27392932f"
        assert row["source_dataset_git_blob_sha"] == "59380491d5a797308c475f7d0007dcf6c4be00af"
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

def test_repeated_source_tokens_keep_occurrence_specific_token_positions():
    ledger = _rows(ROOT / "research/kozak-kim-31-row-individual-abstentions-2026-11-05.csv")
    expected = {"1805": 16, "1816": 28, "1832": 45, "1843": 57, "1859": 74, "1870": 86}
    by_id = {row["occurrence_id"]: row for row in ledger}
    for occurrence_id, token_index in expected.items():
        row = by_id[occurrence_id]
        assert int(row["source_token_index"]) == token_index
        assert token_index in json.loads(row["source_token_index_candidates"])


def test_reconstructed_239_candidate_snapshot_and_current_disposition_crosswalk():
    snapshot = ROOT / "research/kozak-kim-historical-239-candidate-ids-2026-11-05.txt"
    lines = [line.strip() for line in snapshot.read_text(encoding="utf-8").splitlines() if line.strip()]
    header_index = next(i for i, line in enumerate(lines) if line.startswith("Candidate occurrence IDs"))
    candidate_ids = lines[header_index + 1].split(",")
    assert len(candidate_ids) == 239
    assert len(set(candidate_ids)) == 239

    # Three verified exact-form FIX decisions overlap the reconstructed candidate set.
    fixed_ids = {"37", "704", "2031"}
    assert fixed_ids.issubset(set(candidate_ids))
    # The fourth exact-form fix is outside the candidate set; RETAIN is not a FIX.
    assert "2018" not in set(candidate_ids)
    assert "1140" in set(candidate_ids)

    abstentions = _rows(ROOT / "research/kozak-kim-31-row-individual-abstentions-2026-11-05.csv")
    abstention_ids = {row["occurrence_id"] for row in abstentions}
    assert len(abstention_ids & set(candidate_ids)) == 22

    # Count only verified FIX overlaps as resolved; RETAIN and ABSTAIN remain open.
    assert len(set(candidate_ids) - fixed_ids) == 236


def test_current_2026_11_05_unmapped_queue_is_versioned_separately_from_historical_ledger():
    historical = _rows(ROOT / "research/kozak-kim-unmapped-mismatch-review-queue-2026-11-03.csv")
    current = _rows(ROOT / "research/kozak-kim-unmapped-mismatch-review-queue-2026-11-05.csv")
    historical_by_id = {row["occurrence_id"]: row for row in historical}
    current_by_id = {row["occurrence_id"]: row for row in current}
    assert len(historical) == 36
    assert len(current) == 25
    assert set(historical_by_id) - set(current_by_id) == {
        "37", "704", "2018", "2031", "545", "826", "1610", "1816", "1843", "1870", "2490"
    }
    assert set(current_by_id).issubset(historical_by_id)
    assert '2490' not in current_by_id
    # Ten exact engine integrations remove ten previously unmapped rows;
    # the exact alias for 머리속에 removes occurrence 2490. The genitive-
    # particle Rule 5 form remains diagnostic: its primary /ɰi/ is valid,
    # while the comparator's [e] is an allowed alternate and the corpus
    # supplies no speaker-level adjudication.
    for occurrence_id, row in current_by_id.items():
        if occurrence_id == "341":
            assert row["strict_kozak_ipa"] == "kɯ.no.mɰi"
            assert row["broad_kozak_ipa"] == "kɯnomɰi"
            assert row["unmapped_broad_fragment_count"] == "1"
        else:
            assert row == historical_by_id[occurrence_id]
