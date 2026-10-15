"""Run the same source-linked normative seed through the Python research engine.

Korean surface forms are reconstructed from the *post-rule* onset/nucleus/coda,
not from the preserved source spelling. This intentionally catches stale Unicode
indices when a rule mutates a syllable's phonological fields.
"""
from __future__ import annotations

import json
from pathlib import Path

from korean_ukrainian.pipeline import phoneticize_korean
from korean_ukrainian.phonology import L_JAMO, V_JAMO, T_JAMO

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "tests" / "fixtures" / "normative-gold-seed-2026-10-15.json"
DATA = json.loads(FIXTURE.read_text(encoding="utf-8"))


def _compose_surface(result: dict) -> str:
    """Compose Hangul from the mutated phonological fields, preserving no stale indices."""
    l_index = {value: index for index, value in enumerate(L_JAMO)}
    v_index = {value: index for index, value in enumerate(V_JAMO)}
    t_index = {value: index for index, value in enumerate(T_JAMO)}
    chars = []
    for syllable in result["surface_syllables"]:
        l = l_index[syllable["onset"]]
        v = v_index[syllable["nucleus"]]
        t = t_index[syllable["coda"]]
        chars.append(chr(0xAC00 + (l * 21 + v) * 28 + t))
    return "".join(chars)


def test_shared_normative_seed_matches_python_surface_and_ipa():
    assert DATA["schemaVersion"] == 1
    for case in DATA["cases"]:
        result = phoneticize_korean(case["input"])
        surface = _compose_surface(result)
        assert surface in case["expectedSurfaceForms"], (
            f'{case["id"]}: expected surface in {case["expectedSurfaceForms"]}, got {surface}'
        )
        # The browser renders syllables with spaces; the Python research layer
        # uses dots for within-word syllable boundaries. Both must encode the
        # same declared broad IPA segments.
        expected_ipa_source = case.get("expectedPythonIpa", case["expectedProjectIpa"])
        expected_ipa = {value.replace(" ", ".") for value in expected_ipa_source}
        actual_ipa = result["ipa"]["ipa"]
        assert actual_ipa in expected_ipa, (
            f'{case["id"]}: expected IPA in {sorted(expected_ipa)}, got {actual_ipa}'
        )
        assert not any(
            rule.get("status") == "invalid-entry" for rule in result.get("rules", [])
        ), f'{case["id"]}: malformed lexical pronunciation entry'
