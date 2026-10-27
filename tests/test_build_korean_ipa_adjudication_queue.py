from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from build_korean_ipa_adjudication_queue import (  # noqa: E402
    build_queue,
    load_rows,
)


def row(dataset, split, case_id, source, target):
    if dataset == "sigmorphon":
        return {
            "case_id": case_id,
            "dataset_id": "sigmorphon-2021-task1-medium-korean",
            "dataset_revision": "821bcdece5a47820872215969f275004b0abe80c",
            "split": split,
            "source_text": source,
            "target_raw": target,
            "target_representation": "tokenized_ipa_from_sigmorphon_tsv",
        }
    return {
        "case_id": case_id,
        "dataset_id": "ugtphon-korean",
        "dataset_revision": "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54",
        "split": split,
        "source_text": source,
        "target_raw": target,
        "target_representation": "ugtphon_token_phoneme_ipa",
    }


def test_queue_keeps_only_train_train_target_conflicts_and_preserves_raw_evidence():
    sig = [
        row("sigmorphon", "train", "s1", "국밥", "k u k̚ . p͈ a p̚"),
        row("sigmorphon", "train", "s2", "밥", "p a p̚"),
    ]
    ugt = [
        row("ugtphon", "train", "u1", "국밥", "kuk̚.p͈ap̚"),
        row("ugtphon", "train", "u2", "밥", "paːp̚"),
    ]
    queue = build_queue(sig, ugt)
    assert queue["summary"]["shared_train_forms"] == 2
    assert queue["summary"]["exact_after_serialization_only"] == 1
    assert queue["summary"]["queued_conflicts"] == 1
    item = queue["items"][0]
    assert item["source_text"] == "밥"
    assert item["sigmorphon_candidates"][0]["target_raw"] == "p a p̚"
    assert item["ugtphon_candidates"][0]["target_raw"] == "paːp̚"
    assert item["proposed_mapping"] is None
    assert item["review_status"] == "UNADJUDICATED"
    assert any(entry["codepoint"] == "U+02D0" for entry in item["ugtphon_candidates"][0]["unicode_codepoint_inventory"])


def test_queue_retains_partial_annotation_overlap_when_one_variant_matches():
    sig = [
        row("sigmorphon", "train", "s1", "말", "mal"),
        row("sigmorphon", "train", "s2", "말", "maːl"),
    ]
    ugt = [row("ugtphon", "train", "u1", "말", "mal")]
    queue = build_queue(sig, ugt)
    assert queue["summary"]["shared_train_forms"] == 1
    assert queue["summary"]["exact_after_serialization_only"] == 0
    assert queue["summary"]["queued_conflicts"] == 1
    item = queue["items"][0]
    assert item["difference_category"] == "partial_annotation_overlap_requires_review"
    assert {candidate["target_raw"] for candidate in item["sigmorphon_candidates"]} == {"mal", "maːl"}


def test_queue_does_not_call_codepoints_phonemes_or_strip_length():
    sig = [row("sigmorphon", "train", "s1", "말", "m a l")]
    ugt = [row("ugtphon", "train", "u1", "말", "maːl")]
    item = build_queue(sig, ugt)["items"][0]
    assert item["difference_category"] == "length_mark_only_diagnostic"
    assert item["ugtphon_candidates"][0]["target_raw"] == "maːl"
    assert item["normalization_performed"] == ["NFC source-form key", "SIGMORPHON whitespace-token separator removal for comparison only"]
    assert "not a phoneme segmentation" in item["interpretation_limits"][0]


def test_queue_excludes_exact_matches_after_serialization_only():
    sig = [row("sigmorphon", "train", "s1", "국밥", "k u k̚ . p͈ a p̚")]
    ugt = [row("ugtphon", "train", "u1", "국밥", "kuk̚.p͈ap̚")]
    queue = build_queue(sig, ugt)
    assert queue["items"] == []
    assert queue["summary"]["exact_after_serialization_only"] == 1


def test_loader_rejects_dev_and_test_rows(tmp_path):
    path = tmp_path / "train.jsonl"
    path.write_text(json.dumps(row("sigmorphon", "dev", "s1", "말", "m a l")) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="only train rows"):
        load_rows(path, "sigmorphon", "train")


def test_loader_rejects_wrong_source_revision_and_duplicate_ids(tmp_path):
    path = tmp_path / "train.jsonl"
    bad = row("sigmorphon", "train", "s1", "말", "m a l")
    bad["dataset_revision"] = "main"
    path.write_text(json.dumps(bad) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="source pin mismatch"):
        load_rows(path, "sigmorphon", "train")
    good = row("sigmorphon", "train", "s1", "말", "m a l")
    path.write_text(json.dumps(good) + "\n" + json.dumps(good) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="duplicate case_id"):
        load_rows(path, "sigmorphon", "train")
