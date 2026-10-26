from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from train_korean_g2p_teacher import (  # noqa: E402
    BOS,
    EOS,
    PAD,
    UNK,
    build_vocab,
    edit_distance,
    encode_source,
    encode_target,
    load_examples,
    score_predictions,
    verify_corpus_manifest,
)


def make_row(case_id="sigmorphon:train:00001", split="train", source="국물", target="k u ŋ . m u l"):
    return {
        "case_id": case_id,
        "dataset_id": "sigmorphon-2021-task1-medium-korean",
        "dataset_revision": "821bcdece5a47820872215969f275004b0abe80c",
        "split": split,
        "source_text": source,
        "source_text_raw": source,
        "target_raw": target,
        "target_representation": "tokenized_ipa_from_sigmorphon_tsv",
    }


def test_edit_distance_supports_token_sequences_and_strings():
    assert edit_distance(["k", "a", "ŋ"], ["k", "o", "ŋ"]) == 1
    assert edit_distance("kuŋ", "kʌŋ") == 1


def test_load_examples_preserves_target_tokens_and_rejects_wrong_split(tmp_path):
    path = tmp_path / "train.jsonl"
    path.write_text(json.dumps(make_row(), ensure_ascii=False) + "\n", encoding="utf-8")
    rows = load_examples(path, "train")
    assert rows[0]["source_text"] == "국물"
    assert rows[0]["target_tokens"] == ["k", "u", "ŋ", ".", "m", "u", "l"]
    bad = tmp_path / "dev.jsonl"
    bad.write_text(json.dumps(make_row(split="train"), ensure_ascii=False) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="unexpected dataset or split"):
        load_examples(bad, "dev")


def test_load_examples_rejects_duplicate_ids_and_wrong_target_type(tmp_path):
    path = tmp_path / "train.jsonl"
    row = make_row()
    path.write_text("\n".join(json.dumps(row, ensure_ascii=False) for _ in range(2)) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="duplicate case_id"):
        load_examples(path, "train")
    row["target_representation"] = "unknown"
    path.write_text(json.dumps(row, ensure_ascii=False) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="unexpected target representation"):
        load_examples(path, "train")


def test_vocab_and_encoding_keep_explicit_sequence_boundaries():
    rows = [{"source_chars": list("국물"), "target_tokens": ["k", "u", "ŋ"]}]
    source_vocab = build_vocab(rows, target=False)
    target_vocab = build_vocab(rows, target=True)
    source = encode_source({"source_chars": list("국물")}, source_vocab)
    target = encode_target({"target_tokens": ["k", "u", "ŋ"]}, target_vocab)
    assert source[-1] == source_vocab[EOS]
    assert target[0] == target_vocab[BOS]
    assert target[-1] == target_vocab[EOS]
    assert source_vocab[PAD] == 0 and source_vocab[UNK] == 1
    assert target_vocab[PAD] == 0 and target_vocab[UNK] == 1


def test_score_predictions_reports_token_and_compact_character_metrics():
    result = score_predictions(
        references=[["k", "u", "ŋ"], ["k", "a"]],
        predictions=[["k", "u", "ŋ"], ["k", "ʌ"]],
    )
    assert result["example_count"] == 2
    assert result["exact_matches"] == 1
    assert result["exact_match_rate"] == 0.5
    assert result["token_edit_distance"] == 1
    assert result["token_error_rate"] == 1 / 5
    assert result["compact_character_error_rate"] == 1 / 5
    assert "dev-only" in result["metric_note"]


def test_verify_corpus_manifest_rejects_tampered_jsonl(tmp_path):
    input_dir = tmp_path / "corpus"
    input_dir.mkdir()
    train_path, dev_path = input_dir / "train.jsonl", input_dir / "dev.jsonl"
    train_bytes = b'{"source_text":"\uad6d\ubb3c"}\n'
    dev_bytes = b'{"source_text":"\uad6d\ubc25"}\n'
    train_path.write_bytes(train_bytes)
    dev_path.write_bytes(dev_bytes)
    manifest = {
        "dataset_id": "sigmorphon-2021-task1-medium-korean",
        "dataset_revision": "821bcdece5a47820872215969f275004b0abe80c",
        "splits": {
            "train": {"output_file_sha256": hashlib.sha256(train_bytes).hexdigest()},
            "dev": {"output_file_sha256": hashlib.sha256(dev_bytes).hexdigest()},
        },
    }
    (input_dir / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
    assert verify_corpus_manifest(input_dir, train_path, dev_path)["dataset_id"] == manifest["dataset_id"]
    train_path.write_text("tampered", encoding="utf-8")
    with pytest.raises(ValueError, match="hash does not match"):
        verify_corpus_manifest(input_dir, train_path, dev_path)
