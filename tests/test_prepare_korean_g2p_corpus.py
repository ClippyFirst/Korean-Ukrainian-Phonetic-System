from __future__ import annotations

import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from prepare_korean_g2p_corpus import (  # noqa: E402
    DATASET_ID,
    REVISION,
    git_blob_sha1,
    parse_tsv,
)


def test_git_blob_sha1_uses_git_blob_header():
    assert git_blob_sha1(b"test") == "30d74d258442c7c65512eafab474568dd706c430"


def test_parser_preserves_raw_tokenized_ipa_and_only_normalizes_hangul_nfc():
    data = "국물\\tk u ŋ . m u l\\n국밥\\tk u k̚ . p͈ a p̚\\n".encode("utf-8")
    records = parse_tsv(data, "train", expected_rows=2)
    assert records[0]["source_text"] == "국물"
    assert records[0]["source_text_raw"] == "국물"
    assert records[0]["target_raw"] == "k u ŋ . m u l"
    assert records[0]["target_representation"] == "tokenized_ipa_from_sigmorphon_tsv"
    assert records[0]["target_normalization"] == "none; raw target preserved exactly"
    assert records[0]["dataset_id"] == DATASET_ID
    assert records[0]["dataset_revision"] == REVISION


@pytest.mark.parametrize("data", [
    b"\\n",
    "국물\\n".encode("utf-8"),
    "국물\\t\\n".encode("utf-8"),
    b"\\xff\\tk u k\\n",
])
def test_parser_rejects_malformed_tsv(data):
    with pytest.raises(ValueError):
        parse_tsv(data, "train", expected_rows=1)


def test_parser_rejects_duplicate_normalized_source_forms():
    data = "국물\\tk u ŋ . m u l\\n국물\\tk u ŋ . m u l\\n".encode("utf-8")
    with pytest.raises(ValueError, match="duplicate NFC-normalized"):
        parse_tsv(data, "train", expected_rows=2)


def test_parser_rejects_wrong_row_count():
    with pytest.raises(ValueError, match="expected 2 rows, got 1"):
        parse_tsv("국물\\tk u ŋ . m u l\\n".encode("utf-8"), "train", expected_rows=2)
