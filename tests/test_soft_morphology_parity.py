"""Shared soft-morphology parity fixture mirrored by the browser regression."""
from __future__ import annotations

import json
from pathlib import Path

from korean_ukrainian.phonology import parse_syllables
from korean_ukrainian.rules import apply_ordered_rules
from korean_ukrainian.soft_morphology import soft_formal_licenses


def test_shared_soft_morphology_parity_fixture():
    fixture_path = Path(__file__).parent / "fixtures" / "soft-morphology-parity.json"
    fixture = json.loads(fixture_path.read_text(encoding="utf-8"))
    assert "not normative gold" in fixture["description"]

    for case in fixture["cases"]:
        items = parse_syllables(case["input"])
        licenses = soft_formal_licenses(items)
        families = sorted({license.split(":", 1)[0] for license in licenses})
        assert families == sorted(case["expectedSoftRuleFamily"]), case["input"]

        result_items, traces = apply_ordered_rules(
            parse_syllables(case["input"]),
            morphology_mode="soft",
        )
        soft_traces = [
            trace for trace in traces
            if trace.source == "soft-heuristic-morphology"
        ]
        assert bool(soft_traces) is case["expectedSoftTrace"], case["input"]
        if case["expectedSurface"] is not None:
            actual_surface = "".join(item.text for item in result_items)
            assert actual_surface == case["expectedSurface"], case["input"]
        if case["expectedSoftTrace"]:
            assert all(trace.status == "heuristic-low-confidence" for trace in soft_traces)
            assert all(trace.confidence == "low" for trace in soft_traces)
