import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT / "research/kozak-kim-broad-mismatch-context-ledger-2026-11-05.csv"


def _rows():
    with LEDGER.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def test_all_370_broad_mismatch_occurrences_have_pinned_context_and_provenance():
    rows = _rows()
    assert len(rows) == 370
    assert len({row["occurrence_id"] for row in rows}) == 370
    assert all(int(row["broad_edit_distance"]) > 0 for row in rows)

    for row in rows:
        assert row["source_row_id"]
        assert row["token"]
        assert row["source_context_text"]
        assert row["source_context_canonical"]
        assert row["source_context_phonemes"]
        assert 0 <= int(row["source_token_index"]) < int(row["source_context_token_count"])
        assert row["historical_239_membership"] == "UNRESOLVED_NO_HISTORICAL_ASSIGNMENT_SNAPSHOT"
        assert row["decision"] == "ABSTAIN"
        assert row["decision_status"] == "EVIDENCE_LIMITED_DIAGNOSTIC_ONLY"
        assert "not proof" in row["decision_rationale"]
        assert row["benchmark_run_id"] == "41471244424"
        assert row["benchmark_head_commit"] == "4f3f307c5bb056bce3b0aedc8ab07e0010eaa695"
        assert row["benchmark_artifact_id"] == "13156351613"
        assert row["benchmark_artifact_sha256"] == (
            "749ac9a2b9db96c1e27828919afe05ef4320e35ca6a91ab2038c1ff3e9d04c69"
        )
        assert row["benchmark_report_sha256"] == (
            "26ab5f77011cf83f649918bf1f5794133a97e42e1155d34cca33fd552d564b93"
        )
        assert row["engine_source_commit"] == "4f3f307c5bb056bce3b0aedc8ab07e0010eaa695"
        assert row["engine_source_blob"] == "c4df6e5805db297bfb345b638279625c199bf166"
        assert row["ipa_profile"] == "clippyfirst-korean-broad-v1"
        assert row["ipa_profile_version"] == "1"
        assert row["broad_profile_id"] == "korean-broad-candidate-sensitivity-v1"
        assert row["broad_profile_version"] == "1"
        assert row["broad_profile_blob"] == "e13086f0fd98ce9564326ff50b0458c27392932"
        assert row["normalizer_source_blob"] == "d3e3c1a2c5e6dd76bacee1b8ae9864d204fa9e1a"
        assert row["browser_normalizer_source_blob"] == "5a1ea3c2e99ba20303122bb124a6aaec22e56ad2"
        assert row["source_corpus"] == "naver-ai/UGTPHON/ko/test.json"
        assert row["source_corpus_commit"] == "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54"
        assert row["source_corpus_blob"] == "59380491d5a797308c475f7d0007dcf6c4be00af"
        assert row["source_corpus_license"] == "Apache-2.0"


def test_context_ledger_is_not_misrepresented_as_the_historical_239_member_set():
    rows = _rows()
    assert len(rows) == 370
    assert all(
        row["historical_239_membership"] == "UNRESOLVED_NO_HISTORICAL_ASSIGNMENT_SNAPSHOT"
        for row in rows
    )
