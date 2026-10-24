from __future__ import annotations

import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

from compare_morphology_analyzers import compare  # noqa: E402


def test_pairwise_boundary_agreement_is_not_labeled_accuracy():
    kiwi = {
        "학교": {"word": "학교", "morphemes": [
            {"form": "학", "start": 0, "end": 1},
            {"form": "교", "start": 1, "end": 2},
        ]},
        "한국어": {"word": "한국어", "morphemes": [
            {"form": "한국어", "start": 0, "end": 3},
        ]},
    }
    mecab = {
        "학교": {"word": "학교", "morphemes": [
            {"form": "학", "start": 0, "end": 1},
            {"form": "교", "start": 1, "end": 2},
        ]},
        "한국어": {"word": "한국어", "morphemes": [
            {"form": "한국", "start": 0, "end": 2},
            {"form": "어", "start": 2, "end": 3},
        ]},
    }
    report = compare(kiwi, mecab)
    assert report["common_words"] == 2
    assert report["exact_boundary_set_agreement_words"] == 1
    assert report["exact_boundary_set_agreement_rate"] == 0.5
    assert report["boundary_micro"]["shared_boundaries"] == 1
    assert report["boundary_micro"]["kiwi_only_boundaries"] == 0
    assert report["boundary_micro"]["mecab_only_boundaries"] == 1
    assert report["status"] == "diagnostic_pairwise_not_gold_accuracy"
