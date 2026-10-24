from __future__ import annotations

import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

from benchmark_multi_engine_ko import (  # noqa: E402
    _bootstrap_ci,
    _load_rows_and_words,
    _metrics,
    _score,
    kog2p_phones_to_ipa,
)


def test_kog2p_documented_phone_labels_map_to_ipa():
    assert kog2p_phones_to_ipa("p0 aa ng mm uu ll k0 wa nf") == "paŋmulk wan".replace(" ", "")
    assert kog2p_phones_to_ipa("pp aa") == "p͈a"


def test_kog2p_adapter_fails_closed_on_unknown_phone_label():
    try:
        kog2p_phones_to_ipa("mystery")
    except ValueError as exc:
        assert "lack an explicit IPA mapping" in str(exc)
    else:
        raise AssertionError("unknown KoG2P labels must not be silently guessed")


def test_scoring_uses_best_reference_variant_and_reference_length():
    exact = _score("kʰa", "kʰa,ka")
    assert exact["exact"] is True
    assert exact["distance"] == 0
    assert exact["reference_length"] == 3


def test_metrics_report_coverage_denominator_independently():
    items = [
        {"exact": True, "distance": 0, "reference_length": 2},
        {"exact": False, "distance": 1, "reference_length": 2},
    ]
    metrics = _metrics(items)
    assert metrics["scored_tokens"] == 2
    assert metrics["exact_matches"] == 1
    assert metrics["exact_match_rate"] == 0.5
    assert metrics["character_error_rate"] == 0.25


def test_corpus_loader_keeps_repeated_occurrences_for_paired_scoring():
    rows = [{
        "id": "row-1",
        "lang": "ko",
        "split": "test",
        "tokens": [
            {"canonical": "학교", "phoneme": "hak.kjo"},
            {"canonical": "학교", "phoneme": "hak.kjo"},
        ],
    }]
    items, words = _load_rows_and_words(rows)
    assert len(items) == 2
    assert items[0]["occurrence_id"] != items[1]["occurrence_id"]
    assert words == ["학교"]


def test_bootstrap_is_deterministic_and_reports_interval_contract():
    items = [
        {"row_id": "a", "exact": True, "distance": 0, "reference_length": 2},
        {"row_id": "b", "exact": False, "distance": 1, "reference_length": 2},
    ]
    first = _bootstrap_ci(items, replicates=100)
    second = _bootstrap_ci(items, replicates=100)
    assert first == second
    assert first["replicates"] == 100
    assert first["exact_match_rate_95pct_ci"] is not None
