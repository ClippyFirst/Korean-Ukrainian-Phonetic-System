from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from packetize_korean_ipa_annotations import (  # noqa: E402
    SIGMORPHON,
    UGTPHON,
    packetize_file,
    packetize_row,
)


def row(target, representation=SIGMORPHON, split="train"):
    return {
        "case_id": "example:001",
        "dataset_id": "example-dataset",
        "dataset_revision": "abc123",
        "split": split,
        "source_text": "국밥",
        "target_raw": target,
        "target_representation": representation,
    }


def test_tokenized_target_preserves_raw_tokens_and_explicit_boundaries():
    raw = "k u k̚ . p͈ a p̚"
    packet = packetize_row(row(raw))
    assert packet["target_raw"] == raw
    assert [unit["raw"] for unit in packet["units"]] == ["k", "u", "k̚", ".", "p͈", "a", "p̚"]
    assert packet["units"][3]["kind"] == "explicit_boundary"
    assert packet["markers"]["explicit_boundary_markers"] == [
        {"codepoint_offset": 7, "symbol": ".", "kind": "explicit_boundary"}
    ]
    assert packet["clippyfirst_broad_ipa"] is None
    assert packet["ukrainian_orthography"] is None


def test_length_and_stress_markers_are_observed_not_removed():
    raw = "ˈkʰaː"
    packet = packetize_row(row(raw))
    assert packet["target_raw"] == raw
    assert packet["markers"]["stress_markers"][0]["symbol"] == "ˈ"
    assert packet["markers"]["length_markers"][0]["symbol"] == "ː"
    assert packet["units"][0]["raw"] == "ˈkʰaː"


def test_compact_annotation_uses_opaque_unicode_clusters_not_phoneme_claims():
    raw = "kʌk̚.p͈ap̚"
    packet = packetize_row(row(raw, UGTPHON))
    assert packet["target_raw"] == raw
    assert packet["unit_policy"].startswith("Unicode clusters")
    assert all("not asserted to be phonemes" in packet["unit_policy"] for _ in [0])
    assert any(unit["kind"] == "explicit_boundary" and unit["raw"] == "." for unit in packet["units"])
    assert any(unit["raw"] == "k̚" for unit in packet["units"])
    assert packet["adapter_status"] == "SOURCE_TYPED_NOT_MAPPED"


def test_does_not_normalize_unicode_or_rewrite_unknown_symbols():
    raw = "t͡ɕø̃ˑ"
    packet = packetize_row(row(raw, UGTPHON))
    assert packet["target_raw"] == raw
    assert "".join(unit["raw"] for unit in packet["units"]) == raw
    assert packet["markers"]["length_markers"][0]["symbol"] == "ˑ"


@pytest.mark.parametrize("split", ["test", "holdout", "sealed"])
def test_refuses_sealed_partitions(split):
    with pytest.raises(ValueError, match="only train/dev"):
        packetize_row(row("k a", split=split))


def test_refuses_unknown_target_conventions():
    with pytest.raises(ValueError, match="unsupported target representation"):
        packetize_row(row("k a", "clippyfirst_broad_ipa"))


def test_refuses_missing_target_and_duplicate_case_ids(tmp_path):
    bad = row(" ")
    with pytest.raises(ValueError, match="target_raw"):
        packetize_row(bad)
    source = tmp_path / "input.jsonl"
    output = tmp_path / "output.jsonl"
    item = row("k a")
    source.write_text(json.dumps(item) + "\n" + json.dumps(item) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="duplicate case_id"):
        packetize_file(source, output)
