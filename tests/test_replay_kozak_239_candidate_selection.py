from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from replay_kozak_239_candidate_selection import (  # noqa: E402
    align,
    candidate_clusters,
    load_candidate_ids,
    load_replay_rows,
    select_broad_only_candidates_from_rows,
)


def test_historical_aggregate_label_function_preserves_known_mapped_and_unmapped_controls():
    assert candidate_clusters(align("s", "ɕ")) == ["UNMAPPED_REQUIRES_REVIEW"]
    assert candidate_clusters(align("ɭ", "l")) == ["C01_C07_liquid_realization"]
    assert candidate_clusters(align("p̚", "p")) == ["C06_unreleased_coda"]
    assert candidate_clusters(align("kʰ", "k")) == ["C04_aspiration_affricate_notation"]


def test_replay_selects_broad_only_and_ignores_strict_mismatch_fragments():
    rows = [
        {
            "occurrence_id": "1", "source_row_id": "source-a", "token": "가",
            "broad_reference_ipa": "s", "broad_kozak_ipa": "ɕ", "broad_edit_distance": "1",
        },
        {
            "occurrence_id": "2", "source_row_id": "source-b", "token": "나",
            "broad_reference_ipa": "ɭ", "broad_kozak_ipa": "l", "broad_edit_distance": "1",
        },
    ]
    selected, audit = select_broad_only_candidates_from_rows(rows)
    assert selected == [1]
    assert [row["occurrence_id"] for row in audit] == [1, 2]


def test_full_historical_239_replay_matches_all_candidate_ids():
    rows = load_replay_rows(ROOT / "research/kozak-kim-370-broad-only-replay-input-2026-11-07.csv")
    selected, audit = select_broad_only_candidates_from_rows(rows)
    candidate_ids = load_candidate_ids(ROOT / "research/kozak-kim-historical-239-candidate-ids-2026-11-05.txt")
    assert len(audit) == 370
    assert len(selected) == 239
    assert selected == sorted(candidate_ids)
    selected_set = set(selected)
    assert len({row["source_row_id"] for row in audit if row["occurrence_id"] in selected_set}) == 111
    assert len({row["token"] for row in audit if row["occurrence_id"] in selected_set}) == 154
