from __future__ import annotations

import csv
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POLICY = ROOT / "research/kozak-kim-40-no-audio-engine-policy-2026-11-06.csv"
ABSTENTIONS = ROOT / "research/kozak-kim-31-row-individual-abstentions-2026-11-05.csv"
RESIDUAL = ROOT / "research/kozak-kim-236-residual-review-2026-11-06.csv"
SOURCE_REGISTER = ROOT / "research/SOURCE-REGISTER.csv"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def test_all_40_residual_occurrences_have_explicit_no_audio_engine_policy():
    policy = read_csv(POLICY)
    abstentions = {
        row["occurrence_id"]: row
        for row in read_csv(ABSTENTIONS)
        if row["occurrence_id"] in {
            "78", "257", "643", "813", "853", "899",
            "1219", "1288", "1805", "1832", "1859", "2215",
        }
    }
    residual = {row["occurrence_id"]: row for row in read_csv(RESIDUAL)}
    expected = {**abstentions, **residual}
    actual = {row["occurrence_id"]: row for row in policy}

    assert len(policy) == 40
    assert len(actual) == 40
    assert set(actual) == set(expected)
    assert len({row["token"] for row in policy}) == 17
    assert len({row["case_family"] for row in policy}) == 12
    assert Counter(row["token"] for row in policy)["아끼셔"] == 22

    for occurrence_id, row in actual.items():
        source = expected[occurrence_id]
        assert row["source_row_id"] == source["source_row_id"]
        assert row["token"] == source["token"]
        assert row["engine_policy_status"] == "ENGINE_POLICY_RESOLVED_NO_AUDIO"
        assert row["speaker_ipa_gold_status"] == "UNRESOLVED_NO_AUDIO"
        assert row["case_family"]
        assert row["engine_action"]
        assert row["policy_basis"]
        assert row["remaining_claim_limit"]


def test_emoticon_occurrences_preserve_the_raw_compatibility_jamo_evidence():
    source = {
        row["occurrence_id"]: row
        for row in read_csv(ABSTENTIONS)
        if row["occurrence_id"] in {"1219", "1288"}
    }
    policy = {
        row["occurrence_id"]: row
        for row in read_csv(POLICY)
        if row["occurrence_id"] in {"1219", "1288"}
    }
    assert set(source) == {"1219", "1288"}
    for occurrence_id, row in source.items():
        assert "ㅠ" in row["source_context_text"]
        assert "유" in row["source_context_canonical"]
        assert policy[occurrence_id]["engine_action"] == "PRESERVE_RAW_EMOTICON_EXCLUDE_FROM_G2P"
        assert policy[occurrence_id]["speaker_ipa_gold_status"] == "UNRESOLVED_NO_AUDIO"


def test_policy_evidence_ids_exist_in_the_canonical_source_register():
    source_ids = {row["source_id"] for row in read_csv(SOURCE_REGISTER)}
    referenced = {
        item
        for row in read_csv(POLICY)
        for item in row["evidence_ids"].split(";")
        if item
    }
    assert referenced
    assert referenced <= source_ids
