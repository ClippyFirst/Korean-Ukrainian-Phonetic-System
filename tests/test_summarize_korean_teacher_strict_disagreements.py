from __future__ import annotations
import json, sys
from pathlib import Path
import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from summarize_korean_teacher_strict_disagreements import analyze, load  # noqa: E402

SEEDS = (20261026, 20261027, 20261028)

def write_rows(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows), encoding="utf-8")

def make_portfolio(root):
    for seed in SEEDS:
        predictions, pairs = [], []
        for i in range(1000):
            cid = f"sigmorphon-2021-task1-medium-korean:dev:{i:05d}"
            source = f"가{i}"
            ref = ["k", "a"]
            if i < 455: pred = ref
            elif i < 730: pred = ["x"]
            elif i < 873: pred = ref if seed != SEEDS[2] else ["x"]
            elif i < 1000: pred = ref if seed == SEEDS[0] else ["x"]
            predictions.append({"case_id": cid, "split": "dev", "source_text": source,
                                "reference_target_tokens": ref, "predicted_target_tokens": pred})
            if i < 994:
                pairs.append({"case_id": cid, "split": "dev", "source_text": source,
                              "source_dataset_id": "sigmorphon-2021-task1-medium-korean",
                              "source_dataset_revision": "821bcdece5a47820872215969f275004b0abe80c",
                              "teacher_target_representation": "tokenized_ipa_from_sigmorphon_tsv",
                              "comparison_metrics_computed": False,
                              "strict_ipa_raw": "ka", "comparison_status": "BLOCKED"})
        folder = root / f"seed-{seed}"
        write_rows(folder / "dev-predictions.jsonl", predictions)
        write_rows(folder / "dev-teacher-strict-pairs.jsonl", pairs)

def test_seed_consensus_is_preserved_without_cross_ipa_scoring(tmp_path):
    make_portfolio(tmp_path)
    result = analyze(tmp_path)
    assert result["teacher_consensus_counts"] == {
        "all_three_match_reference": 455,
        "mixed_seed_correctness": 270,
        "none_match_reference": 275,
    }
    assert result["strict_paired_case_count"] == 994
    assert result["strict_unresolved_or_diagnostic_only_count"] == 6
    assert result["test_partition_used"] is False
    assert result["records"][0]["strict_comparison_status"] == "RAW_TRIAGE_ONLY_NO_REVIEWED_ADAPTER"

def test_variable_strict_pair_count_is_reported_without_assuming_994(tmp_path):
    make_portfolio(tmp_path)
    for seed in SEEDS:
        path = tmp_path / f"seed-{seed}" / "dev-teacher-strict-pairs.jsonl"
        rows = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines()]
        write_rows(path, rows[:990])
    result = analyze(tmp_path)
    assert result["case_count"] == 1000
    assert result["strict_paired_case_count"] == 990
    assert result["strict_unresolved_or_diagnostic_only_count"] == 10
    assert all(row["strict_ipa_raw"] is None for row in result["records"][-10:])


def test_different_strict_pair_id_sets_across_seeds_fail_closed(tmp_path):
    make_portfolio(tmp_path)
    seed = SEEDS[-1]
    path = tmp_path / f"seed-{seed}" / "dev-teacher-strict-pairs.jsonl"
    rows = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines()]
    write_rows(path, rows[:-1])
    with pytest.raises(ValueError, match="Strict pair ID sets differ"):
        analyze(tmp_path)


def test_loader_rejects_non_dev_and_duplicate_ids(tmp_path):
    p = tmp_path / "bad.jsonl"
    p.write_text(json.dumps({"case_id":"x","split":"test"}) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="dev-only"):
        load(p)
    row = {"case_id":"x","split":"dev"}
    p.write_text(json.dumps(row) + "\n" + json.dumps(row) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="duplicate"):
        load(p)
