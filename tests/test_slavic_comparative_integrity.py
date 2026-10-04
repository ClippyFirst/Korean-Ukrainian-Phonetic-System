from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read_csv(name: str) -> list[dict[str, str]]:
    with (ROOT / "data" / "korean" / name).open(encoding="utf-8-sig", newline="") as fh:
        return list(csv.DictReader(fh))


def test_comparative_master_has_complete_jamo_inventory_and_provenance():
    rows = read_csv("slavic_comparative_master.csv")
    assert len(rows) == 40
    assert {row["layer"] for row in rows} == {"consonant", "vowel"}

    required = {
        "source_ids",
        "evidence_class",
        "verification_note",
        "cell_provenance",
    }
    assert required.issubset(rows[0])

    for row in rows:
        assert row["source_ids"]
        assert row["cell_provenance"]
        assert "czech:system_level_not_cellwise_verified" in row["cell_provenance"]
        assert "polish:system_level_not_Jamo_table" in row["cell_provenance"]
        assert "slovenian:reverse_adaptation_comparator" in row["cell_provenance"]


def test_sequence_corpus_has_explicit_evidence_statuses():
    rows = read_csv("slavic_comparative_sequences.csv")
    ids = {row["id"] for row in rows}
    assert {
        "SEQ001", "SEQ002", "SEQ003", "SEQ004",
        "SEQ005", "SEQ006", "SEQ007", "SEQ008",
    } <= ids

    allowed = {"documented_target", "conditional", "hypothesis", "model_validated"}
    assert all(row["evidence_status"] in allowed for row in rows)
    assert all(row["source_ids"] for row in rows)


def test_primary_aspiration_policy_is_explicit():
    rows = read_csv("slavic_comparative_master.csv")
    by_korean = {row["korean"]: row for row in rows}
    assert by_korean["ㅋ"]["ukrainian_practical_primary"] == "к"
    assert by_korean["ㅌ"]["ukrainian_practical_primary"] == "т"
    assert by_korean["ㅍ"]["ukrainian_practical_primary"] == "п"
    assert by_korean["ㅊ"]["ukrainian_practical_primary"] == "ч"


def test_context_sensitive_eui_has_no_universal_output():
    rows = read_csv("slavic_comparative_master.csv")
    row = next(row for row in rows if row["korean"] == "ㅢ")
    assert row["ukrainian_practical_primary"] == "context-dependent"
    assert "No unconditional target" in row["notes"] or "context" in row["verification_note"].lower()
