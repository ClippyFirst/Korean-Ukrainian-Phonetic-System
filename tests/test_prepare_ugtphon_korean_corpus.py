from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from prepare_ugtphon_korean_corpus import (  # noqa: E402
    DATASET_ID,
    REVISION,
    git_blob_sha1,
    parse_split,
)


def row(*, split="train", tokens=None, case_id="sentence-1"):
    return {
        "id": case_id,
        "lang": "ko",
        "source": "fixture",
        "split": split,
        "text": "국물 ㅋㅋ",
        "canonical": "국물 크크",
        "phonemes": "kuŋ.mul kxɯkxɯ",
        "tokens": tokens if tokens is not None else [
            {"text": "국물", "canonical": "국물", "phoneme": "kuŋ.mul", "is_nc": False, "nc_type": None},
            {"text": "ㅋㅋ", "canonical": "크크,키키", "phoneme": "kxɯkxɯ,kçikçi", "is_nc": True, "nc_type": "C3"},
        ],
    }


def test_git_blob_sha1_uses_git_blob_header():
    assert git_blob_sha1(b"test") == "30d74d258442c7c65512eafab474568dd706c430"


def test_parser_exports_only_exact_canonical_single_token_with_unambiguous_ipa():
    data = json.dumps([row()], ensure_ascii=False).encode("utf-8")
    records, summary = parse_split(data, "train", expected_rows=1)
    assert len(records) == 1
    assert records[0]["source_text"] == "국물"
    assert records[0]["target_raw"] == "kuŋ.mul"
    assert records[0]["target_representation"] == "ugtphon_token_phoneme_ipa"
    assert records[0]["target_normalization"] == "none; target string preserved apart from surrounding whitespace"
    assert records[0]["source_sentence_id"] == "sentence-1"
    assert records[0]["dataset_id"] == DATASET_ID
    assert records[0]["dataset_revision"] == REVISION
    assert summary["eligible_token_occurrences"] == 1
    assert summary["excluded_token_counts_by_reason"]["noncanonical_or_surface_mismatch"] == 1


def test_parser_excludes_ambiguous_multiword_missing_and_placeholder_targets():
    tokens = [
        {"text": "국물", "canonical": "국물", "phoneme": "kuŋ.mul", "is_nc": False},
        {"text": "국 물", "canonical": "국 물", "phoneme": "kuŋ mul", "is_nc": False},
        {"text": "없음", "canonical": "없음", "phoneme": "", "is_nc": False},
        {"text": "표기", "canonical": "표기", "phoneme": "<unk>", "is_nc": False},
        {"text": "variant", "canonical": "variant", "phoneme": "a,b", "is_nc": False},
    ]
    records, summary = parse_split(json.dumps([row(tokens=tokens)], ensure_ascii=False).encode(), "train", expected_rows=1)
    assert [record["source_text"] for record in records] == ["국물"]
    assert summary["excluded_token_counts_by_reason"]["multiword_token"] == 1
    assert summary["excluded_token_counts_by_reason"]["missing_phoneme"] == 1
    assert summary["excluded_token_counts_by_reason"]["placeholder_phoneme"] == 1
    assert summary["excluded_token_counts_by_reason"]["ambiguous_comma_variant"] == 1


def test_parser_reports_conflicting_targets_instead_of_silently_choosing_one():
    rows = [
        row(tokens=[{"text": "국물", "canonical": "국물", "phoneme": "kuŋ.mul", "is_nc": False}], case_id="a"),
        row(tokens=[{"text": "국물", "canonical": "국물", "phoneme": "kuŋ.mɯl", "is_nc": False}], case_id="b"),
    ]
    records, summary = parse_split(json.dumps(rows, ensure_ascii=False).encode(), "train", expected_rows=2)
    assert len(records) == 2
    assert summary["eligible_source_forms_with_multiple_target_strings"] == 1


@pytest.mark.parametrize("data", [b"not-json", b"\\xff"])
def test_parser_rejects_invalid_json_or_utf8(data):
    with pytest.raises(ValueError, match="invalid UTF-8 JSON"):
        parse_split(data, "train", expected_rows=1)


def test_parser_rejects_wrong_split_metadata_and_duplicate_sentence_ids():
    wrong_split = json.dumps([row(split="test")], ensure_ascii=False).encode()
    with pytest.raises(ValueError, match="mismatched lang/split"):
        parse_split(wrong_split, "train", expected_rows=1)
    duplicate_ids = json.dumps([row(case_id="same"), row(case_id="same")], ensure_ascii=False).encode()
    with pytest.raises(ValueError, match="duplicate sentence id"):
        parse_split(duplicate_ids, "train", expected_rows=2)
