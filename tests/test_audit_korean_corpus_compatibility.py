from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from audit_korean_corpus_compatibility import (  # noqa: E402
    build_report,
    compare_rows,
)


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def row(case_id, split, source, target, target_type):
    return {
        "case_id": case_id,
        "split": split,
        "source_text": source,
        "target_raw": target,
        "target_representation": target_type,
    }


def write_corpus(directory: Path, dataset_id: str, target_type: str, split_rows: dict[str, list[dict]]):
    directory.mkdir(parents=True)
    split_meta = {}
    for split, rows in split_rows.items():
        payload = "".join(json.dumps(item, ensure_ascii=False, sort_keys=True) + "\n" for item in rows).encode()
        (directory / f"{split}.jsonl").write_bytes(payload)
        split_meta[split] = {"source_rows": len(rows), "output_row_count": len(rows), "output_file_sha256": sha256(payload)}
    manifest = {
        "dataset_id": dataset_id,
        "dataset_revision": "0123456789abcdef",
        "splits": split_meta,
    }
    (directory / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")


def test_compare_rows_reports_overlap_and_raw_target_relation_without_claiming_ipa_equivalence():
    left = [
        {"_normalized_source": "국물", "target_raw": "k u ŋ . m u l", "target_representation": "tokenized_ipa_from_sigmorphon_tsv"},
        {"_normalized_source": "국밥", "target_raw": "k u k̚ . p͈ a p̚", "target_representation": "tokenized_ipa_from_sigmorphon_tsv"},
        {"_normalized_source": "국내", "target_raw": "k u ŋ . d ɛ", "target_representation": "tokenized_ipa_from_sigmorphon_tsv"},
    ]
    right = [
        {"_normalized_source": "국물", "target_raw": "kuŋ.mul", "target_representation": "ugtphon_token_phoneme_ipa"},
        {"_normalized_source": "국밥", "target_raw": "kʌk̚.p͈ap̚", "target_representation": "ugtphon_token_phoneme_ipa"},
        {"_normalized_source": "국내", "target_raw": "kuŋdɛ", "target_representation": "ugtphon_token_phoneme_ipa"},
    ]
    result = compare_rows(left, right)
    assert result["unique_source_form_intersection"] == 3
    assert result["shared_forms_with_any_exact_raw_target_match"] == 0
    assert result["shared_forms_with_any_match_after_token_separator_removal"] == 2
    assert result["shared_forms_with_only_different_targets_after_token_separator_removal"] == 1
    assert result["mismatch_category_counts"]["syllable_dot_only_difference"] == 1
    assert result["mismatch_category_counts"]["other_symbol_or_feature_difference"] == 1
    assert "no syllable boundaries are inferred" in result["target_comparison_interpretation"]


def test_build_report_verifies_manifests_and_never_merges(tmp_path):
    sig = tmp_path / "sig"
    ugt = tmp_path / "ugt"
    write_corpus(sig, "sigmorphon-2021-task1-medium-korean", "tokenized_ipa", {
        "train": [row("s-train-1", "train", "국물", "k u ŋ . m u l", "tokenized_ipa")],
        "dev": [row("s-dev-1", "dev", "국밥", "k u k̚ . p͈ a p̚", "tokenized_ipa")],
    })
    write_corpus(ugt, "ugtphon-korean", "ugtphon_token_phoneme_ipa", {
        "train": [row("u-train-1", "train", "국물", "kuŋ.mul", "ugtphon_token_phoneme_ipa")],
        "dev": [row("u-dev-1", "dev", "국밥", "k u k̚ . p͈ a p̚", "ugtphon_token_phoneme_ipa")],
    })
    report = build_report(sig, ugt)
    assert report["cross_corpus_overlap"]["sigmorphon_train__vs__ugtphon_train"]["unique_source_form_intersection"] == 1
    assert report["cross_corpus_overlap"]["sigmorphon_train__vs__ugtphon_dev"]["unique_source_form_intersection"] == 0
    assert report["decision"]["merge_performed"] is False
    assert report["decision"]["training_performed"] is False
    assert report["decision"]["target_compatibility"] == "UNVERIFIED"


def test_build_report_fails_closed_when_output_hash_does_not_match_manifest(tmp_path):
    sig = tmp_path / "sig"
    ugt = tmp_path / "ugt"
    write_corpus(sig, "sigmorphon-2021-task1-medium-korean", "tokenized_ipa", {
        "train": [row("s-train-1", "train", "국물", "k u ŋ . m u l", "tokenized_ipa")],
        "dev": [row("s-dev-1", "dev", "국밥", "k u k̚ . p͈ a p̚", "tokenized_ipa")],
    })
    write_corpus(ugt, "ugtphon-korean", "ugtphon_token_phoneme_ipa", {
        "train": [row("u-train-1", "train", "국물", "kuŋ.mul", "ugtphon_token_phoneme_ipa")],
        "dev": [row("u-dev-1", "dev", "국밥", "k u k̚ . p͈ a p̚", "ugtphon_token_phoneme_ipa")],
    })
    (sig / "train.jsonl").write_text("tampered", encoding="utf-8")
    with pytest.raises(ValueError, match="SHA-256"):
        build_report(sig, ugt)
