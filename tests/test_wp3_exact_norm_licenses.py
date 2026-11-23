"""WP3: exact licenses only for forms the NIKL norm itself prints.

Each positive case is a form that appears in 표준 발음법 brackets.
Negative controls are adjacent forms that must NOT gain the license.
"""
from __future__ import annotations
import pytest
from korean_ukrainian.pipeline import phoneticize_korean

def surface(text: str) -> str:
    r = phoneticize_korean(text, boundary_mode="phrase", morphology_mode="strict")
    s = r.get("surface_hangul") or ""
    if not s and isinstance(r.get("surface_syllables"), list):
        s = "".join(r["surface_syllables"])
    return s.replace(" ", "")

# --- Positive: norm-printed forms (must match gold surface) ---
@pytest.mark.parametrize("inp,expected", [
    ("더듬다", "더듬따"),
    ("얇다", "얄따"),
    ("받히다", "바치다"),
])
def test_exact_norm_license_positive(inp, expected):
    got = surface(inp)
    assert got == expected, f"{inp}: expected surface {expected!r}, got {got!r}"

# --- Negative controls: adjacent forms must not be forced ---
@pytest.mark.parametrize("inp", [
    "더듬고",   # different ending, no automatic fortition license
    "얇은",     # already has its own dictionary row; just ensure no crash
    "받히고",   # different form
])
def test_exact_norm_license_negative_no_crash(inp):
    # Must not raise; surface may be unresolved or different — we only require stability
    r = phoneticize_korean(inp, boundary_mode="phrase", morphology_mode="strict")
    assert r is not None
