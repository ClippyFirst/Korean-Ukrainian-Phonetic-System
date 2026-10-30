"""Regression tests for the extended multi-engine benchmark metrics."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

import benchmark_multi_engine_ko as benchmark

from benchmark_multi_engine_ko import (  # noqa: E402
    _ipa_segments,
    _latency_summary,
    _metrics,
    _score,
    _segment_edit_distance,
)


def test_ipa_segment_tokenizer_keeps_affricates_and_diacritics_together() -> None:
    assert _ipa_segments("t͡ɕʰaː") == ["tɕʰ", "aː"]


def test_phoneme_error_rate_uses_segments_not_unicode_codepoints() -> None:
    scored = _score("t͡ɕʰaː", "tɕʰaː")
    assert scored["exact"] is True
    assert scored["phoneme_distance"] == 0
    assert scored["reference_phoneme_count"] == 2


def test_feature_weighted_distance_distinguishes_voicing_from_full_substitution() -> None:
    assert _segment_edit_distance(["p"], ["b"]) == 1
    weighted = _segment_edit_distance(["p"], ["b"], weighted=True)
    assert 0 < weighted < 1


def test_metrics_include_character_phoneme_and_coverage_adjusted_scores() -> None:
    exact = _score("pʰaː", "pʰaː")
    mismatch = _score("ba", "pʰaː")
    metrics = _metrics([exact, mismatch])
    assert metrics["scored_tokens"] == 2
    assert metrics["exact_matches"] == 1
    assert metrics["phoneme_error_rate"] is not None
    assert metrics["phonological_feature_error_rate_proxy"] is not None
    assert metrics["unsupported_feature_segments"] == 0


def test_latency_summary_reports_total_mean_and_tail_latency() -> None:
    summary = _latency_summary([1.0, 2.0, 3.0, 100.0])
    assert summary["sample_count"] == 4
    assert summary["total_ms"] == 106.0
    assert summary["mean_ms"] == 26.5
    assert summary["p50_ms"] == 2.0
    assert summary["p95_ms"] == 100.0


def test_empty_metrics_explicitly_mark_rate_metrics_unavailable() -> None:
    metrics = _metrics([])
    assert metrics["phoneme_error_rate"] is None
    assert metrics["phonological_feature_error_rate_proxy"] is None
    assert metrics["scored_tokens"] == 0


def test_latency_percentiles_use_nearest_rank_and_preserve_the_tail() -> None:
    assert _latency_summary([7.0])["p95_ms"] == 7.0
    assert _latency_summary([1.0, 100.0])["p95_ms"] == 100.0
    summary = _latency_summary([1.0, 2.0, 3.0, 100.0])
    assert summary["p50_ms"] == 2.0
    assert summary["p95_ms"] == 100.0
    assert summary["percentile_method"].startswith("nearest-rank")


def test_segment_metrics_choose_gold_variants_independently(monkeypatch) -> None:
    def synthetic_distance(left, right, weighted=False):
        reference = "".join(right)
        if weighted:
            return 0.0 if reference == "pa" else 0.5
        return 0.0 if reference == "ba" else 1.0
    monkeypatch.setattr(benchmark, "_segment_edit_distance", synthetic_distance)
    score = benchmark._score("pa", "pa,ba")
    assert score["closest_normalized_gold"] == "pa"
    assert score["closest_phoneme_gold"] == "ba"
    assert score["closest_feature_gold"] == "pa"
    assert score["reference_phoneme_count"] == 2
    assert score["feature_reference_phoneme_count"] == 2


def test_feature_proxy_uses_its_own_reference_denominator() -> None:
    metrics = _metrics([{
        "exact": False, "distance": 1, "reference_length": 2,
        "reference_phoneme_count": 4, "phoneme_distance": 2,
        "feature_reference_phoneme_count": 2, "feature_weighted_distance": 1.0,
    }])
    assert metrics["phoneme_error_rate"] == 0.5
    assert metrics["phonological_feature_error_rate_proxy"] == 0.5
