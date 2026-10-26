import json
from pathlib import Path

import pytest

from scripts.benchmark_charsiu_research_split import build_pair_ledger, load_prepared_jsonl


def _row(**overrides):
    row = {
        "case_id": "sigmorphon-2021-task1-medium-korean:dev:00001",
        "dataset_id": "sigmorphon-2021-task1-medium-korean",
        "dataset_revision": "821bcdece5a47820872215969f275004b0abe80c",
        "source_text": "가곡",
        "target_raw": "k a̠ ɡ o̞ k̚",
        "target_representation": "tokenized_ipa_from_sigmorphon_tsv",
        "split": "dev",
    }
    row.update(overrides)
    return row


def _write(path: Path, rows):
    path.write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in rows), encoding="utf-8")


def test_load_prepared_dev_preserves_raw_target_and_provenance(tmp_path):
    path = tmp_path / "dev.jsonl"
    _write(path, [_row()])
    rows, metadata = load_prepared_jsonl(path, "dev")
    assert rows[0]["tokens"][0]["phoneme"] == "k a̠ ɡ o̞ k̚"
    assert rows[0]["tokens"][0]["canonical"] == "가곡"
    assert metadata["dataset_revision"] == "821bcdece5a47820872215969f275004b0abe80c"
    assert metadata["target_representation"] == "tokenized_ipa_from_sigmorphon_tsv"


def test_loader_rejects_test_split_even_if_requested(tmp_path):
    path = tmp_path / "test.jsonl"
    _write(path, [_row(case_id="sigmorphon:dev:looks-test-labelled", split="test")])
    with pytest.raises(ValueError, match="expected split"):
        load_prepared_jsonl(path, "dev")
    with pytest.raises(ValueError, match="only train/dev"):
        load_prepared_jsonl(path, "test")


def test_loader_rejects_sealed_case_id_and_duplicate_ids(tmp_path):
    path = tmp_path / "dev.jsonl"
    _write(path, [_row(case_id="sigmorphon:dev:test-0001")])
    with pytest.raises(ValueError, match="sealed test/holdout"):
        load_prepared_jsonl(path, "dev")
    _write(path, [_row(), _row()])
    with pytest.raises(ValueError, match="duplicate case_id"):
        load_prepared_jsonl(path, "dev")


def test_loader_rejects_mixed_revisions_and_non_hangul_source(tmp_path):
    path = tmp_path / "dev.jsonl"
    _write(path, [_row(), _row(case_id="sigmorphon:dev:00002", dataset_revision="other")])
    with pytest.raises(ValueError, match="mixes dataset revisions"):
        load_prepared_jsonl(path, "dev")
    _write(path, [_row(source_text="ABC")])
    with pytest.raises(ValueError, match="one Hangul token"):
        load_prepared_jsonl(path, "dev")


def test_pair_ledger_never_promotes_a_rule():
    report = {
        "per_occurrence": [{
            "occurrence_id": "0",
            "row_id": "row-1",
            "token": "가곡",
            "gold": "ka̠ɡo̞k̚",
            "charsiu_byt5": {"status": "scored", "ipa": "kaɡok̚", "exact": True, "distance": 0},
            "baselines": {"clippyfirst_native": {"status": "scored", "ipa": "ka.ɡo.k̚", "exact": False, "distance": 2}},
        }]
    }
    metadata = {
        "dataset_id": "sigmorphon-2021-task1-medium-korean",
        "dataset_revision": "821bcdece5a47820872215969f275004b0abe80c",
        "target_representation": "tokenized_ipa_from_sigmorphon_tsv",
        "split": "dev",
    }
    row = build_pair_ledger(report, metadata)[0]
    assert row["teacher_ipa_raw"] == "kaɡok̚"
    assert row["strict_ipa_raw"] == "ka.ɡo.k̚"
    assert row["comparison_status"] == "DIAGNOSTIC_ONLY_IPA_CONVENTION_UNREVIEWED"
    assert row["production_rule_promotion"] is False
