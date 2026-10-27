from __future__ import annotations

import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from audit_korean_ipa_symbol_inventories import build_inventory  # noqa: E402


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


def test_inventory_keeps_source_specific_unit_contracts_and_unicode_counts():
    sig = [row("sigmorphon", "train", "s1", "국밥", "k u k̚ . p͈ a p̚")]
    ugt = [row("ugtphon", "train", "u1", "국밥", "kuk̚.p͈ap̚")]
    result = build_inventory({"sigmorphon": sig, "ugtphon": ugt})
    assert result["decision"]["ipa_mapping_applied"] is False
    sig_inv = result["corpora"]["sigmorphon"]["splits"]["train"]
    ugt_inv = result["corpora"]["ugtphon"]["splits"]["train"]
    assert sig_inv["target_unit_inventory_kind"] == "source_whitespace_tokens"
    assert sig_inv["target_unit_counts"]["k"] == 1
    assert sig_inv["target_unit_counts"]["k̚"] == 1
    assert ugt_inv["target_unit_inventory_kind"] == "raw_unicode_codepoints_only"
    assert ugt_inv["target_unit_counts"] == {}
    assert ugt_inv["unicode_codepoint_counts"].get("ː", 0) == 0
    assert any(x["codepoint"] == "U+031A" for x in sig_inv["unicode_codepoint_inventory"])


def test_inventory_preserves_combining_marks_and_does_not_call_them_segments():
    sig = [row("sigmorphon", "train", "s1", "말", "m a l")]
    ugt = [row("ugtphon", "train", "u1", "말", "maːl")]
    result = build_inventory({"sigmorphon": sig, "ugtphon": ugt})
    ugt_inv = result["corpora"]["ugtphon"]["splits"]["train"]
    assert ugt_inv["unicode_codepoint_counts"]["ː"] == 1
    assert "not a phoneme segmentation" in ugt_inv["interpretation_limits"][0]


def test_inventory_rejects_unpinned_or_non_train_dev_rows():
    sig = [row("sigmorphon", "test", "s1", "말", "m a l")]
    ugt = [row("ugtphon", "train", "u1", "말", "mal")]
    with pytest.raises(ValueError, match="only train/dev rows"):
        build_inventory({"sigmorphon": sig, "ugtphon": ugt})
    bad = row("sigmorphon", "train", "s1", "말", "m a l")
    bad["dataset_revision"] = "main"
    with pytest.raises(ValueError, match="source pin mismatch"):
        build_inventory({"sigmorphon": [bad], "ugtphon": ugt})
