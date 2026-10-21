"""Soft-heuristic morphology layer (opt-in, fail-closed by default).

See docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md for the full contract.

This module does NOT replace exact NIKL pair licenses. It only proposes
ephemeral formal-ending licenses for a closed inventory when
morphology_mode == "soft".
"""

from __future__ import annotations

from typing import Iterable

# Closed inventory of high-frequency formal / particle / ending orthographies.
# Only these right-hand syllables may trigger soft licenses (same eojeol only).
SOFT_FORMAL_ENDINGS: dict[str, str] = {
    "이": "formal_i",
    "을": "formal_ul_lul",
    "를": "formal_ul_lul",
    "에": "formal_e",
    "어": "vowel_ending",
    "아": "vowel_ending",
    "았": "past_extension",
    "었": "past_extension",
    "였": "past_extension",
    "고": "go",
    "다": "da",
    "은": "topic",
    "는": "topic",
    "인": "in",
    "히": "hi_suffix",
}

# Rules that soft mode is allowed to unlock (v1).
SOFT_ALLOWED_RULES = frozenset({"R002", "R003", "R007"})


def _full_form(items: Iterable) -> str:
    """Reconstruct the orthographic full form used by exact-license keys."""
    parts: list[str] = []
    for item in items:
        parts.append(item.text)
        if getattr(item, "boundary_after", None) == "word":
            parts.append(" ")
    return "".join(parts).strip()


def soft_formal_licenses(items: list, *, full_form: str | None = None) -> list[str]:
    """Return ephemeral soft licenses for morphology-gated rules.

    Only same-eojeol pairs are considered. Cross-word (whitespace) pairs are
    never soft-licensed. R016 / R009 / R010–R015 are never soft-licensed.
    """
    if not items:
        return []
    form = full_form if full_form is not None else _full_form(items)
    licenses: list[str] = []
    seen: set[str] = set()

    for i in range(len(items) - 1):
        a, b = items[i], items[i + 1]
        # No cross-word soft hypotheses.
        if getattr(a, "boundary_after", None) == "word":
            continue
        if not a.coda:
            continue

        ending = b.text
        pattern = SOFT_FORMAL_ENDINGS.get(ending)
        if pattern is None:
            continue

        pair = f"{a.text}>{b.text}"

        # R002 formal liaison (never substantive / §15).
        # Do not infer liaison from the orthographic sequence 어/아: these
        # are especially ambiguous between formal endings and substantive
        # morphemes (e.g. 값어치). Mirror the browser adapter's fail-closed
        # guard, including simple-coda §15-sensitive vowel environments.
        if b.onset == "ㅇ" and ending not in {"어", "아"}:
            complex_codas = {"ㄳ", "ㄵ", "ㄶ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅄ"}
            representative = {
                "ㄳ": "ㄱ", "ㄵ": "ㄴ", "ㄶ": "ㄴ", "ㄺ": "ㄱ",
                "ㄻ": "ㅁ", "ㄼ": "ㄹ", "ㄽ": "ㄹ", "ㄾ": "ㄹ",
                "ㄿ": "ㅂ", "ㅀ": "ㄹ", "ㅄ": "ㅂ", "ㅅ": "ㄷ",
                "ㅆ": "ㄷ", "ㅈ": "ㄷ", "ㅊ": "ㄷ", "ㅌ": "ㄷ",
                "ㅎ": "ㄷ", "ㄲ": "ㄱ", "ㅋ": "ㄱ", "ㅍ": "ㅂ",
            }.get(a.coda, a.coda)
            substantive_risk = (
                a.coda not in complex_codas
                and representative != a.coda
                and b.nucleus in {"ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅟ"}
            )
            if a.coda not in {"ㅎ", "ㄶ", "ㅀ", "ㅇ"} and not substantive_risk:
                lic = f"R002:formal:{form}:{pair}"
                if lic not in seen:
                    licenses.append(lic)
                    seen.add(lic)

        # R003 ㅎ / ㄶ / ㅀ deletion before vowel-initial ending.
        if a.coda in {"ㅎ", "ㄶ", "ㅀ"} and b.onset == "ㅇ":
            lic = f"R003:ending_or_suffix_h_deletion:{form}:{pair}"
            if lic not in seen:
                licenses.append(lic)
                seen.add(lic)

        # R007 palatalization: ㄷ/ㅌ/ㄾ + 이
        if a.coda in {"ㄷ", "ㅌ", "ㄾ"} and ending == "이":
            lic = f"R007:formal_morpheme_i:{form}:{pair}"
            if lic not in seen:
                licenses.append(lic)
                seen.add(lic)

        # R007 ㄷ + 히 chain (after aspiration intermediate in the pipeline).
        if ending == "히" and a.coda == "ㄷ":
            lic = f"R007:dh_suffix_hi:{form}:{pair}"
            if lic not in seen:
                licenses.append(lic)
                seen.add(lic)

    return licenses


def merge_licenses(
    exact: Iterable[str] | None,
    soft: Iterable[str] | None,
    *,
    morphology_mode: str = "strict",
) -> list[str]:
    """Merge exact and soft licenses according to morphology_mode.

    morphology_mode:
      - "strict" (default): only exact licenses.
      - "soft": exact ∪ soft (soft never overrides exact identity).
    """
    if morphology_mode not in {"strict", "soft"}:
        raise ValueError('morphology_mode must be "strict" or "soft"')
    base = list(exact or ())
    if morphology_mode == "strict":
        return base
    soft_list = list(soft or ())
    # Keep exact first; append soft only if not already present.
    seen = set(base)
    for lic in soft_list:
        if lic not in seen:
            base.append(lic)
            seen.add(lic)
    return base


def is_soft_license(license_context: str | None) -> bool:
    """True if the applied license was injected by the soft layer."""
    if not license_context:
        return False
    # Soft licenses use the same shape as exact ones; callers should also
    # check that the license was not present in the exact set. For trace
    # status we rely on the caller marking heuristic when soft contributed.
    return False  # status is set by the rule engine when soft mode is on


def mark_heuristic_trace(trace, *, soft_contributed: bool) -> None:
    """Downgrade status/source when a soft license was the enabler."""
    if not soft_contributed:
        return
    # Only downgrade morphology-gated rules that soft is allowed to unlock.
    if getattr(trace, "rule_id", None) not in SOFT_ALLOWED_RULES:
        return
    if not getattr(trace, "changed", False):
        return
    trace.status = "heuristic-low-confidence"
    trace.confidence = "low"
    trace.source = "soft-heuristic-morphology"
