from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from replay_kozak_239_candidate_selection import (  # noqa: E402
    align,
    candidate_clusters,
    select_broad_only_candidates,
)


def test_historical_classifier_uses_only_pre_c11_c12_c01_c10_aggregate_labels():
    assert candidate_clusters(align("s", "ɕ")) == ["UNMAPPED_REQUIRES_REVIEW"]
    assert candidate_clusters(align("ɭ", "l")) == ["C01_C07_liquid_realization"]
    assert candidate_clusters(align("p̚", "p")) == ["C06_unreleased_coda"]
    assert candidate_clusters(align("kʰ", "k")) == ["C04_aspiration_affricate_notation"]


def test_replay_selects_broad_only_and_ignores_strict_mismatch_fragments():
    report = {
        "per_engine_occurrences": {
            "clippyfirst_native": [
                {
                    "status": "scored",
                    "occurrence_id": 1,
                    "row_id": "source-a",
                    "token": "가",
                    "gold": "ɭ",
                    "ipa": "l",
                    "broad_candidate": {
                        "distance": 1,
                        "closest_gold": "s",
                        "predicted": "ɕ",
                    },
                },
                {
                    "status": "scored",
                    "occurrence_id": 2,
                    "row_id": "source-b",
                    "token": "나",
                    "gold": "s",
                    "ipa": "ɕ",
                    "broad_candidate": {
                        "distance": 1,
                        "closest_gold": "ɭ",
                        "predicted": "l",
                    },
                },
                {
                    "status": "scored",
                    "occurrence_id": 3,
                    "row_id": "source-c",
                    "token": "다",
                    "gold": "s",
                    "ipa": "s",
                    "broad_candidate": {
                        "distance": 0,
                        "closest_gold": "s",
                        "predicted": "s",
                    },
                },
            ]
        }
    }
    selected, audit = select_broad_only_candidates(report)
    assert selected == [1]
    assert [row["occurrence_id"] for row in audit] == [1, 2]
