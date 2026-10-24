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
    assert "cannot represent a morpheme split inside a Hangul syllable" in report["boundary_metric_scope"]
    assert report["native_soft_rule_boundary_alignment"]["common_rule_events"] == 0


def test_repeated_surface_spans_are_reported_not_hidden_by_character_boundaries():
    kiwi = {
        "가한걸": {"word": "가한걸", "morphemes": [
            {"form": "가", "start": 0, "end": 1},
            {"form": "하", "start": 1, "end": 2},
            {"form": "ᆫ", "start": 1, "end": 2},
            {"form": "걸", "start": 2, "end": 3},
        ]},
    }
    mecab = {
        "가한걸": {"word": "가한걸", "morphemes": [
            {"form": "가", "start": 0, "end": 1},
            {"form": "한", "start": 1, "end": 2},
            {"form": "걸", "start": 2, "end": 3},
        ]},
    }
    report = compare(kiwi, mecab)
    assert report["exact_boundary_set_agreement_words"] == 1
    shape = report["analyzer_output_shape"]["kiwi"]
    assert shape["words_with_repeated_source_spans"] == 1
    assert shape["repeated_source_span_groups"] == 1
    assert shape["overlapping_source_span_pairs"] == 1
    assert shape["forms_not_equal_to_source_substring"] == 1


def test_native_soft_rule_boundary_alignment_is_compared_separately():
    event = {
        "rule_id": "R003",
        "pair": "좋>아",
        "orthographic_offset": 1,
        "morphological_boundary_observed": True,
    }
    kiwi = {
        "좋아": {"word": "좋아", "morphemes": [
            {"form": "좋", "start": 0, "end": 1},
            {"form": "어", "start": 1, "end": 2},
        ], "native_soft_rule_boundary_events": [event]},
    }
    mecab = {
        "좋아": {"word": "좋아", "morphemes": [
            {"form": "좋아", "start": 0, "end": 2},
        ], "native_soft_rule_boundary_events": [
            {**event, "morphological_boundary_observed": False},
        ]},
    }
    report = compare(kiwi, mecab)
    alignment = report["native_soft_rule_boundary_alignment"]
    assert alignment["common_rule_events"] == 1
    assert alignment["kiwi_only_observed"] == 1
    assert alignment["mecab_only_observed"] == 0
    assert alignment["agreement_rate"] == 0.0
    assert "correlation only" in alignment["interpretation"]
