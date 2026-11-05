import csv
import importlib.util
import json
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "build_kozak_236_ipa_review_packets",
    ROOT / "scripts/build_kozak_236_ipa_review_packets.py",
)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


def test_builds_two_blind_reference_withheld_packets_and_private_coordinator_map(tmp_path):
    result = MODULE.build_packets()
    packet_a = result["reviewer_a"]
    packet_b = result["reviewer_b"]
    mapping = result["coordinator_map"]

    assert result["case_count"] == 236
    assert packet_a["caseCount"] == packet_b["caseCount"] == 236
    assert packet_a["sourceCsvSha256"] == packet_b["sourceCsvSha256"] == result["source_csv_sha256"]
    assert packet_a["reviewerSlot"] == "A"
    assert packet_b["reviewerSlot"] == "B"
    assert packet_a["blindnessMode"] == "SYSTEM_BLIND_REFERENCE_WITHHELD_SOURCE_IDENTIFIABLE"
    assert [x["caseId"] for x in packet_a["cases"]] == [x["caseId"] for x in packet_b["cases"]]
    assert [x["inputHangul"] for x in packet_a["cases"]] == [x["inputHangul"] for x in packet_b["cases"]]
    assert len(mapping["cases"]) == 236
    assert len({x["occurrenceId"] for x in mapping["cases"]}) == 236

    serialized = json.dumps(packet_a, ensure_ascii=False)
    for forbidden in (
        "sourceRowId", "occurrenceId", "sourceCorpusCommit", "sourceContextCanonical",
        "sourceContextPhonemes", "strictReferenceIpa", "broadReferenceIpa",
        "broadKozakIpa", "g2pkIpa", "broadMismatchFragments",
        "historicalExportClusterLabels", "candidateDisposition",
        "candidateDispositionBasis", "priorIndividualRationale",
        "reference_ipa", "kozak_broad_ipa", "source_context_phonemes",
    ):
        assert forbidden not in serialized

    assert all(x["reviewForm"]["reviewerSlot"] == "A" for x in packet_a["cases"])
    assert all(x["reviewForm"]["reviewerSlot"] == "B" for x in packet_b["cases"])
    assert all(x["reviewForm"]["rawSurfaceBroadIpa"] is None for x in packet_a["cases"])
    assert all(x["reviewForm"]["canonicalInputBroadIpa"] is None for x in packet_a["cases"])
    assert all(x["reviewForm"]["rawSurfaceNarrowIpa"] is None for x in packet_a["cases"])

    # The raw token is located by the pinned source token index; canonicalization
    # differences are preserved explicitly instead of being silently collapsed.
    source_rows = {r["occurrence_id"]: r for r in csv.DictReader(
        (ROOT / "research/kozak-kim-236-candidate-review-2026-11-05.csv").open(encoding="utf-8-sig", newline="")
    )}
    for blind, coord in zip(packet_a["cases"], mapping["cases"]):
        source = source_rows[coord["occurrenceId"]]
        raw_tokens = source["source_context_text"].split()
        assert raw_tokens[blind["rawSourceTokenIndex"]] == blind["rawSourceToken"]
        assert blind["inputHangul"] == source["token"]
        assert blind["normalizationRelation"] == (
            "IDENTICAL" if source["token"] == blind["rawSourceToken"] else "DIFFERS"
        )

    summary = MODULE.write_packets(result, tmp_path)
    assert summary["case_count"] == 236
    assert sorted(p.name for p in tmp_path.iterdir()) == [
        "coordinator-map.json", "reviewer-a.json", "reviewer-b.json"
    ]
    with pytest.raises(FileExistsError):
        MODULE.write_packets(result, tmp_path)


def test_refuses_wrong_case_count_duplicate_occurrences_and_bad_context_index(tmp_path):
    source = ROOT / "research/kozak-kim-236-candidate-review-2026-11-05.csv"
    rows = list(csv.DictReader(source.open(encoding="utf-8-sig", newline="")))
    header = list(rows[0])
    wrong_count = tmp_path / "wrong-count.csv"
    with wrong_count.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=header)
        writer.writeheader()
        writer.writerows(rows[:-1])
    with pytest.raises(ValueError, match="Expected exactly 236"):
        MODULE.build_packets(wrong_count)

    duplicate = [dict(x) for x in rows]
    duplicate[1]["occurrence_id"] = duplicate[0]["occurrence_id"]
    duplicate_path = tmp_path / "duplicate.csv"
    with duplicate_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=header)
        writer.writeheader()
        writer.writerows(duplicate)
    with pytest.raises(ValueError, match="duplicate occurrence_id"):
        MODULE.build_packets(duplicate_path)

    bad_index = [dict(x) for x in rows]
    bad_index[0]["source_token_index"] = "99999"
    bad_path = tmp_path / "bad-index.csv"
    with bad_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=header)
        writer.writeheader()
        writer.writerows(bad_index)
    with pytest.raises(ValueError, match="outside the"):
        MODULE.build_packets(bad_path)
