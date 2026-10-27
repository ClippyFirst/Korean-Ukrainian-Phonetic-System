from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from audit_teacher_corpus_splits import (  # noqa: E402
    git_blob_sha1,
    pairwise_overlaps,
    parse_sigmorphon,
    parse_ugtphon,
)


def test_git_blob_sha1_uses_git_blob_header():
    assert git_blob_sha1(b"test") == "30d74d258442c7c65512eafab474568dd706c430"


def test_ugtphon_split_parser_checks_split_and_summarizes_tokens():
    data = json.dumps([
        {"id": "a", "split": "train", "text": "국 물", "tokens": [{"text": "국"}, {"text": "물"}]},
        {"id": "b", "split": "train", "text": "국 물", "tokens": [{"text": "국"}]},
    ], ensure_ascii=False).encode()
    summary, texts, tokens = parse_ugtphon(data, "train")
    assert summary == {"rows": 2, "unique_ids": 2, "unique_texts": 1, "unique_token_forms": 2}
    assert texts == {"국 물"}
    assert tokens == {"국", "물"}


def test_ugtphon_parser_rejects_mislabeled_split():
    data = json.dumps([{"id": "a", "split": "test", "text": "국", "tokens": []}], ensure_ascii=False).encode()
    with pytest.raises(ValueError, match="split field"):
        parse_ugtphon(data, "train")


def test_sigmorphon_parser_preserves_two_column_tokenized_ipa_contract():
    summary, forms = parse_sigmorphon("국물\tk u ŋ . m u l\n국밥\tk u k̚ . p͈ a p̚\n".encode(), "train")
    assert summary == {"rows": 2, "unique_graphemes": 2, "duplicate_grapheme_rows": 0}
    assert forms == {"국물", "국밥"}


def test_sigmorphon_parser_rejects_malformed_rows():
    with pytest.raises(ValueError, match="expected grapheme"):
        parse_sigmorphon("국물\n".encode(), "train")


def test_pairwise_overlap_reports_counts_without_leaking_forms():
    report = pairwise_overlaps({"train": {"a", "b"}, "dev": {"b", "c"}, "test": {"z"}})
    assert report["train__vs__dev"]["unique_form_intersection"] == 1
    assert report["train__vs__test"]["unique_form_intersection"] == 0
    serialized = json.dumps(report)
    assert '"a"' not in serialized
    assert '"b"' not in serialized
    assert '"c"' not in serialized
    assert '"z"' not in serialized
