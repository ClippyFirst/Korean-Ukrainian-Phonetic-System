#!/usr/bin/env python3
"""Ukrainian-phonetics-first target projection for Korean segments.

This module is intentionally small and dependency-free. It is a target-layer
component, not a Korean pronunciation engine.

Contract:
    Korean grapheme/phonology/surface IPA -> Ukrainian phonetic target ->
    Ukrainian graphemic realization.

The primary practical mode does not encode Korean aspiration or fortisness as
mandatory Ukrainian digraphs/double letters. Those distinctions remain
available through the returned IPA/features metadata.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class TargetDecision:
    grapheme: str
    ipa: str
    phonetic_target: str
    graphemic: str
    mode: str
    features: tuple[str, ...]
    reason: str


def _features(ipa: str) -> tuple[str, ...]:
    values: list[str] = []
    if "ʰ" in ipa:
        values.append("aspiration")
    if "͈" in ipa or "͉" in ipa:
        values.append("fortis")
    if ipa in {"ɡ", "d", "b", "dʑ"}:
        values.append("contextual_voicing")
    return tuple(values)


def project_segment(
    grapheme: str,
    ipa: str,
    *,
    following: str = "",
    onset: bool = False,
    mode: str = "primary_practical",
) -> TargetDecision:
    """Project one Korean surface segment into the Ukrainian target layer.

    IPA is authoritative for surface realization. Grapheme supplies the
    Korean identity needed for target-specific rules. The function does not
    infer a connected-speech IPA form from orthography.
    """

    if mode != "primary_practical":
        raise ValueError("only primary_practical is implemented")

    features = _features(ipa)

    # Structural null: Korean ㅇ has no onset consonant.
    if grapheme == "ㅇ" and onset:
        return TargetDecision(
            grapheme, ipa, "", "", mode, features, "structural_null_onset"
        )

    # Primary Ukrainian target neutralizes Korean aspiration.
    aspirated = {
        "ㅋ": "к",
        "ㅌ": "т",
        "ㅍ": "п",
        "ㅊ": "ч",
    }
    if grapheme in aspirated:
        target = aspirated[grapheme]
        return TargetDecision(
            grapheme, ipa, target, target, mode, features,
            "aspiration_preserved_in_ipa_but_neutralized_in_primary_ukrainian_target",
        )

    # Korean lenis stops can have voiceless or voiced surface realizations.
    voiced = {"ㄱ": "ґ", "ㄷ": "д", "ㅂ": "б"}
    voiceless = {"ㄱ": "к", "ㄷ": "т", "ㅂ": "п"}
    if grapheme in voiced:
        target = voiced[grapheme] if ipa in {"ɡ", "d", "b"} else voiceless[grapheme]
        return TargetDecision(
            grapheme, ipa, target, target, mode, features,
            "surface_voicing_selects_ukrainian_target",
        )

    # Fortis remains explicit in Korean/IPA but is not encoded by default
    # with Ukrainian double graphemes.
    fortis = {"ㄲ": "к", "ㄸ": "т", "ㅃ": "п", "ㅆ": "с", "ㅉ": "ч"}
    if grapheme in fortis:
        target = fortis[grapheme]
        return TargetDecision(
            grapheme, ipa, target, target, mode, features,
            "fortis_preserved_analytically_but_neutralized_in_primary_target",
        )

    # ㅅ has a Ukrainian phonetic-context candidate before /i,j/-like vowels.
    if grapheme == "ㅅ":
        if following in {"ㅣ", "ㅑ", "ㅒ", "ㅕ", "ㅖ", "ㅛ", "ㅠ", "ㅢ"} or ipa.startswith("ɕ"):
            return TargetDecision(
                grapheme, ipa, "ш", "ш", mode, features,
                "palatalized_sibilant_candidate_before_i_or_j_environment",
            )
        return TargetDecision(
            grapheme, ipa, "с", "с", mode, features, "plain_sibilant_target"
        )

    if grapheme == "ㅈ":
        target = "дж" if ipa in {"dʑ", "ʑ"} else "ч"
        return TargetDecision(
            grapheme, ipa, target, target, mode, features,
            "surface_affricate_voicing_selects_ukrainian_target",
        )

    if grapheme == "ㄹ":
        target = "л" if ipa.startswith("l") else "р"
        return TargetDecision(
            grapheme, ipa, target, target, mode, features,
            "surface_liquid_position_selects_r_or_l_target",
        )

    if grapheme == "ㅇ":
        return TargetDecision(
            grapheme, ipa, "н", "н", mode, features,
            "velar_nasal_has_no_direct_ukrainian_phoneme",
        )

    direct = {
        "ㄴ": "н",
        "ㅁ": "м",
        "ㅎ": "х",
        "ㅏ": "а",
        "ㅐ": "е",
        "ㅑ": "я",
        "ㅒ": "є",
        "ㅓ": "о",
        "ㅔ": "е",
        "ㅕ": "йо",
        "ㅖ": "є",
        "ㅗ": "о",
        "ㅘ": "ва",
        "ㅙ": "ве",
        "ㅚ": "ве",
        "ㅛ": "йо",
        "ㅜ": "у",
        "ㅝ": "во",
        "ㅞ": "ве",
        "ㅟ": "ві",
        "ㅠ": "ю",
        "ㅡ": "и",
        "ㅣ": "і",
    }
    target = direct.get(grapheme, "")
    if target:
        return TargetDecision(
            grapheme, ipa, target, target, mode, features, "canonical_direct_target"
        )

    # ㅢ is deliberately not given a universal orthographic target here.
    if grapheme == "ㅢ":
        return TargetDecision(
            grapheme, ipa, "", "", mode, features,
            "context_dependent_target_requires_environment",
        )

    return TargetDecision(
        grapheme, ipa, "", "", mode, features, "no_canonical_target_defined"
    )


__all__ = ["TargetDecision", "project_segment"]
