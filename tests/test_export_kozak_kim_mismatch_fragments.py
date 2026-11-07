from __future__ import annotations

import csv
import json
import pytest
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "export_kozak_kim_mismatch_fragments",
    ROOT / "scripts/export_kozak_kim_mismatch_fragments.py",
)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


def test_alignment_keeps_combining_marks_attached_to_base():
    edits = MODULE.align("sʰa̠", "sa")
    assert edits == [
        {"op": "S", "reference_fragment": "sʰ", "kozak_fragment": "s"},
        {"op": "S", "reference_fragment": "a̠", "kozak_fragment": "a"},
    ]


def test_build_rows_exports_only_actual_reported_mismatches():
    report = {
        "benchmark": "fixture",
        "eligible_token_occurrences": 2,
        "native_ipa_profile": {"ipa_profile": "broad-v1"},
        "broad_candidate_profile": {"profile_id": "broad-candidate-v1"},
        "per_engine_occurrences": {
            "clippyfirst_native": [
                {
                    "occurrence_id": "1", "row_id": "r1", "token": "가",
                    "surface_hangul": "가", "gold": "ka", "ipa": "ka",
                    "status": "scored", "distance": 0,
                    "broad_candidate": {"closest_gold": "ka", "predicted": "ka", "distance": 0},
                },
                {
                    "occurrence_id": "2", "row_id": "r2", "token": "사",
                    "surface_hangul": "사", "gold": "sʰa", "ipa": "sa",
                    "status": "scored", "distance": 1,
                    "broad_candidate": {"closest_gold": "sa", "predicted": "sa", "distance": 0},
                },
            ],
            "g2pk_0_9_4": [
                {"occurrence_id": "2", "ipa": "sʰa", "distance": 0},
            ],
        },
    }
    rows = MODULE.build_rows(report)
    assert len(rows) == 1
    assert rows[0]["occurrence_id"] == "2"
    assert rows[0]["candidate_clusters"] == "C04_aspiration_affricate_notation"
    assert rows[0]["review_status"] == "UNADJUDICATED_DIAGNOSTIC"
    assert rows[0]["production_action"] == "NO_CHANGE_PENDING_SOURCE_AND_IPA_REVIEW"


def test_build_rows_fails_when_required_engine_ledgers_are_missing():
    import pytest

    with pytest.raises(ValueError, match="occurrence ledgers"):
        MODULE.build_rows({"per_engine_occurrences": {}})


def test_candidate_clusters_keep_sibilant_place_separate():
    fragments = [
        {"op": "S", "reference_fragment": "ɕ", "kozak_fragment": "s"},
    ]
    assert MODULE.candidate_clusters(fragments) == [
        "C11_sibilant_place_profile_boundary"
    ]


def test_genitive_ui_particle_classification_is_exact_form_scoped():
    fragments = [
        {"op": "I", "reference_fragment": "", "kozak_fragment": "ɰ"},
    ]
    for token in ("그놈의", "자신의", "대황본의", "염전의", "대한민국의", "삶의"):
        assert MODULE.candidate_clusters(fragments, source_token=token) == [
            "C14_NIKL_GENITIVE_UI_PARTICLE"
        ]

    # 협의 is lexical: its ㅢ behavior comes from liaison provenance, not
    # the genitive-particle exception. Do not infer particle morphology from
    # the mere orthographic sequence coda+의.
    assert MODULE.candidate_clusters(fragments, source_token="협의") == [
        "UNMAPPED_REQUIRES_REVIEW"
    ]
    assert MODULE.candidate_clusters(fragments, source_token="주의") == [
        "UNMAPPED_REQUIRES_REVIEW"
    ]


def test_genitive_ui_particle_label_does_not_hide_an_unrelated_unmapped_edit():
    fragments = [
        {"op": "I", "reference_fragment": "", "kozak_fragment": "ɰ"},
        {"op": "S", "reference_fragment": "e", "kozak_fragment": "i"},
    ]
    assert MODULE.candidate_clusters(fragments, source_token="그놈의") == [
        "C14_NIKL_GENITIVE_UI_PARTICLE",
        "UNMAPPED_REQUIRES_REVIEW",
    ]


def test_build_rows_keeps_other_unmapped_fragment_after_genitive_ui_adjudication():
    report = {
        "per_engine_occurrences": {
            "clippyfirst_native": [{
                "occurrence_id": "341", "row_id": "r341", "token": "그놈의",
                "surface_hangul": "그노믜", "gold": "kɯ.no.me", "ipa": "kɯ.no.mɰi",
                "status": "scored", "distance": 2,
                "broad_candidate": {
                    "closest_gold": "kɯ.no.me", "predicted": "kɯ.no.mɰi", "distance": 2
                },
            }],
            "g2pk_0_9_4": [{"occurrence_id": "341", "ipa": "kɯ.no.me", "distance": 0}],
        },
    }
    row = MODULE.build_rows(report)[0]
    assert "C14_NIKL_GENITIVE_UI_PARTICLE" in row["candidate_clusters"]
    assert "UNMAPPED_REQUIRES_REVIEW" in row["candidate_clusters"]
    assert row["has_unmapped_broad_fragments"] == "true"
    assert MODULE.filter_unmapped_broad([row]) == [row]


def test_mismatch_cluster_registry_ids_are_unique_and_c14_is_registered():
    path = ROOT / "research/KOZAK-KIM-MASS-MISMATCH-CLUSTERS-2026-11-01.csv"
    with path.open(encoding="utf-8", newline="") as stream:
        rows = list(csv.DictReader(stream))
    ids = [row["cluster_id"] for row in rows]
    assert len(ids) == len(set(ids))
    assert "C13" in ids
    c14 = next(row for row in rows if row["cluster_id"] == "C14")
    assert c14["unique_occurrences"] == "16"
    assert c14["edit_operations"] == "16"


def test_aspirated_velar_coarticulation_is_not_misclassified_as_h_aspiration():
    fragments = [
        {"op": "S", "reference_fragment": "k", "kozak_fragment": "kʰ"},
        {"op": "S", "reference_fragment": "x", "kozak_fragment": "ɯ"},
    ]
    assert MODULE.candidate_clusters(
        fragments,
        strict_reference="kxɯ",
        strict_prediction="kʰɯ",
    ) == ["C12_aspirated_velar_coarticulation_profile"]



def test_candidate_clusters_expose_unmapped_fragments_even_when_another_fragment_is_mapped():
    fragments = [
        {"op": "S", "reference_fragment": "ɕ", "kozak_fragment": "s"},
        {"op": "S", "reference_fragment": "k͈", "kozak_fragment": "ɡ"},
    ]
    assert MODULE.candidate_clusters(fragments) == [
        "C11_sibilant_place_profile_boundary",
        "UNMAPPED_REQUIRES_REVIEW",
    ]


def test_build_rows_reports_unmapped_broad_fragments_inside_mixed_cluster_occurrence():
    report = {
        "benchmark": "fixture",
        "eligible_token_occurrences": 1,
        "native_ipa_profile": {"ipa_profile": "broad-v1"},
        "broad_candidate_profile": {"profile_id": "broad-candidate-v1"},
        "per_engine_occurrences": {
            "clippyfirst_native": [
                {
                    "occurrence_id": "1", "row_id": "r1", "token": "시험",
                    "surface_hangul": "시험", "gold": "ɕk͈", "ipa": "sɡ",
                    "status": "scored", "distance": 2,
                    "broad_candidate": {"closest_gold": "ɕk͈", "predicted": "sɡ", "distance": 2},
                },
            ],
            "g2pk_0_9_4": [{"occurrence_id": "1", "ipa": "ɕk͈", "distance": 0}],
        },
    }
    row = MODULE.build_rows(report)[0]
    assert row["unmapped_broad_fragment_count"] == "1"
    assert json.loads(row["unmapped_broad_fragments"]) == [
        {"op": "S", "reference_fragment": "k͈", "kozak_fragment": "ɡ"},
    ]



def test_build_rows_records_pinned_context_pointer_without_copying_sentence_text():
    report = {
        "benchmark": "fixture",
        "eligible_token_occurrences": 1,
        "native_ipa_profile": {"ipa_profile": "broad-v1"},
        "broad_candidate_profile": {"profile_id": "broad-candidate-v1"},
        "per_engine_occurrences": {
            "clippyfirst_native": [{
                "occurrence_id": "1", "row_id": "r1", "token": "시험",
                "surface_hangul": "시험", "gold": "ɕk͈", "ipa": "sɡ",
                "status": "scored", "distance": 2,
                "broad_candidate": {"closest_gold": "ɕk͈", "predicted": "sɡ", "distance": 2},
            }],
            "g2pk_0_9_4": [{"occurrence_id": "1", "ipa": "ɕk͈", "distance": 0}],
        },
    }
    corpus_rows = [{
        "id": "r1", "lang": "ko", "split": "test",
        "text": "SENTENCE_CONTEXT_MUST_NOT_BE_COPIED",
        "canonical": "시험",
    }]
    row = MODULE.build_rows(
        report, corpus_rows, "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54", "Apache-2.0"
    )[0]
    assert row["context_corpus"] == "UGTPHON/ko/test.json"
    assert row["context_corpus_revision"] == "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54"
    assert row["context_corpus_license"] == "Apache-2.0"
    assert row["context_lookup_status"] == "FOUND"
    assert "SENTENCE_CONTEXT_MUST_NOT_BE_COPIED" not in json.dumps(row, ensure_ascii=False)


def test_build_rows_marks_missing_context_row_and_requires_provenance():
    report = {
        "per_engine_occurrences": {
            "clippyfirst_native": [{
                "occurrence_id": "1", "row_id": "missing", "token": "시험",
                "surface_hangul": "시험", "gold": "ɕk͈", "ipa": "sɡ",
                "status": "scored", "distance": 2,
                "broad_candidate": {"closest_gold": "ɕk͈", "predicted": "sɡ", "distance": 2},
            }],
            "g2pk_0_9_4": [{"occurrence_id": "1", "ipa": "ɕk͈", "distance": 0}],
        },
    }
    assert MODULE.build_rows(report, [{"id": "other"}], "revision", "Apache-2.0")[0]["context_lookup_status"] == "MISSING"
    import pytest
    with pytest.raises(ValueError, match="corpus_revision and corpus_license"):
        MODULE.build_rows(report, [{"id": "missing"}])


def test_filter_unmapped_broad_keeps_only_occurrences_with_unmapped_edits():
    rows = [
        {"occurrence_id": "1", "has_unmapped_broad_fragments": "true"},
        {"occurrence_id": "2", "has_unmapped_broad_fragments": "false"},
        {"occurrence_id": "3", "has_unmapped_broad_fragments": "true"},
    ]
    assert [row["occurrence_id"] for row in MODULE.filter_unmapped_broad(rows)] == ["1", "3"]



def _minimal_mismatch_report(native_occurrences, g2pk_occurrences):
    return {
        "per_engine_occurrences": {
            "clippyfirst_native": native_occurrences,
            "g2pk_0_9_4": g2pk_occurrences,
        },
    }


def _native_occurrence(occurrence_id="1", row_id="r1"):
    return {
        "occurrence_id": occurrence_id,
        "row_id": row_id,
        "token": "사",
        "surface_hangul": "사",
        "gold": "sʰa",
        "ipa": "sa",
        "status": "scored",
        "distance": 1,
        "broad_candidate": {"closest_gold": "sʰa", "predicted": "sa", "distance": 1},
    }


def _g2pk_occurrence(occurrence_id="1"):
    return {"occurrence_id": occurrence_id, "ipa": "sʰa", "distance": 0}


@pytest.mark.parametrize("duplicate_ledger", ["native", "g2pk"])
def test_build_rows_rejects_duplicate_occurrence_ids_in_engine_ledgers(duplicate_ledger):
    native = [_native_occurrence()]
    g2pk = [_g2pk_occurrence()]
    if duplicate_ledger == "native":
        native.append(_native_occurrence())
    else:
        g2pk.append(_g2pk_occurrence())

    with pytest.raises(ValueError, match="duplicate occurrence_id"):
        MODULE.build_rows(_minimal_mismatch_report(native, g2pk))


def test_build_rows_rejects_duplicate_context_corpus_row_ids():
    report = _minimal_mismatch_report(
        [_native_occurrence()],
        [_g2pk_occurrence()],
    )

    with pytest.raises(ValueError, match="duplicate corpus row id"):
        MODULE.build_rows(
            report,
            [{"id": "r1", "canonical": "사"}, {"id": "r1", "canonical": "다"}],
            "pinned-revision",
            "Apache-2.0",
        )



def test_write_csv_uses_canonical_crlf_without_trailing_record_separator(tmp_path):
    output = tmp_path / "queue.csv"
    MODULE.write_csv(output, [{
        field: ("x" if field == "occurrence_id" else "")
        for field in MODULE.FIELDS
    }])
    payload = output.read_bytes()
    assert b"\r\n" in payload
    assert payload.count(b"\\n") == payload.count(b"\r\n")
    assert not payload.endswith(b"\r\n")
    assert payload.decode("utf-8").splitlines()[0].split(",") == MODULE.FIELDS
