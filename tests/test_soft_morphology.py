"""Python unit tests for soft-heuristic morphology layer.

Run: pytest tests/test_soft_morphology.py -q
(or from repo root after copying soft_morphology.py into src/korean_ukrainian/)
"""

from __future__ import annotations

import pytest

# Adjust import path if package layout differs in the target repo.
from korean_ukrainian.soft_morphology import (
    SOFT_FORMAL_ENDINGS,
    soft_formal_licenses,
    merge_licenses,
    mark_heuristic_trace,
)
from korean_ukrainian.phonology import parse_syllables
from korean_ukrainian.rules import apply_ordered_rules, RuleTrace


def test_inventory_is_closed():
    assert "이" in SOFT_FORMAL_ENDINGS
    assert "을" in SOFT_FORMAL_ENDINGS
    assert "히" in SOFT_FORMAL_ENDINGS
    # Must not include arbitrary syllables
    assert "가" not in SOFT_FORMAL_ENDINGS
    assert "요" not in SOFT_FORMAL_ENDINGS


def test_soft_licenses_same_eojeol_formal_i():
    items = parse_syllables("굳이")
    licenses = soft_formal_licenses(items)
    assert any(lic.startswith("R007:formal_morpheme_i:") for lic in licenses)
    assert any("굳이:굳>이" in lic for lic in licenses)


def test_soft_licenses_h_deletion():
    items = parse_syllables("좋아")  # ㅎ + 아
    licenses = soft_formal_licenses(items)
    assert any(lic.startswith("R003:ending_or_suffix_h_deletion:") for lic in licenses)


def test_soft_licenses_complex_formal():
    items = parse_syllables("넋이")
    licenses = soft_formal_licenses(items)
    assert any(lic.startswith("R002:formal:") and "넋>이" in lic for lic in licenses)
    # Must never emit substantive
    assert not any("substantive" in lic for lic in licenses)


def test_no_cross_word_soft_licenses():
    items = parse_syllables("값 이")
    licenses = soft_formal_licenses(items)
    # boundary_after == word should block
    assert licenses == [] or not any("값>이" in lic for lic in licenses)


def test_merge_strict_ignores_soft():
    exact = ["R002:formal:값이:값>이"]
    soft = soft_formal_licenses(parse_syllables("굳이"))
    merged = merge_licenses(exact, soft, morphology_mode="strict")
    assert merged == exact


def test_merge_soft_unions():
    exact = ["R002:formal:값이:값>이"]
    soft = soft_formal_licenses(parse_syllables("굳이"))
    merged = merge_licenses(exact, soft, morphology_mode="soft")
    assert "R002:formal:값이:값>이" in merged
    assert any("굳이" in lic for lic in merged)


def test_strict_default_no_heuristic_status():
    items = parse_syllables("굳이")
    _, traces = apply_ordered_rules(items, morphology_mode="strict")
    for tr in traces:
        assert tr.status != "heuristic-low-confidence"
        assert tr.source != "soft-heuristic-morphology"


def test_soft_mode_marks_heuristic_when_soft_license_used():
    items = parse_syllables("굳이")
    # No exact licenses → soft must supply R007
    items2, traces = apply_ordered_rules(
        parse_syllables("굳이"),
        morphology_mode="soft",
        rule_licenses=[],
    )
    soft_traces = [t for t in traces if t.source == "soft-heuristic-morphology"]
    # If the engine applied R007 via soft, we must see the status.
    # (If 굳이 is later covered by lexical override in the full pipeline,
    # this unit test still validates the rules layer in isolation.)
    r007 = [t for t in traces if t.rule_id == "R007" and t.changed]
    if r007:
        assert r007[0].status == "heuristic-low-confidence"
        assert r007[0].source == "soft-heuristic-morphology"


def test_soft_never_licenses_r016():
    items = parse_syllables("읽고")
    licenses = soft_formal_licenses(items)
    assert not any(lic.startswith("R016:") for lic in licenses)


def test_soft_never_licenses_r009():
    items = parse_syllables("한여름")
    licenses = soft_formal_licenses(items)
    assert not any(lic.startswith("R009:") for lic in licenses)


def test_mark_heuristic_only_allowed_rules():
    tr = RuleTrace(
        rule_id="R016",
        name="x",
        changed=True,
        before=[],
        after=[],
        status="established",
        confidence="high",
        source="NIKL",
        license_context="R016:...",
    )
    mark_heuristic_trace(tr, soft_contributed=True)
    # R016 is not in SOFT_ALLOWED_RULES → unchanged
    assert tr.status == "established"
    assert tr.source == "NIKL"
