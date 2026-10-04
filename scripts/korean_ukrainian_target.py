#!/usr/bin/env python3
"""Ukrainian-phonetics-first target projection for Korean segments.

This module is a target-layer component, not a Korean pronunciation engine.
It consumes an already-resolved Korean surface IPA value and produces:
1. a Ukrainian phonetic target (IPA-like target value);
2. a Ukrainian practical graphemic realization;
3. explicit decision metadata.

Primary practical mode intentionally neutralizes Korean aspiration and fortisness
when Ukrainian has no corresponding phonological contrast. The Korean
distinction remains recoverable from the source IPA and feature metadata.
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


def _decision(
    grapheme: str,
    ipa: str,
    target: str,
    graphemic: str,
    mode: str,
    features: tuple[str, ...],
    reason: str,
) -> TargetDecision:
    return TargetDecision(grapheme, ipa, target, graphemic, mode, features, reason)


def project_segment(
    grapheme: str,
    ipa: str,
    *,
    following: str = "",
    onset: bool = False,
    mode: str = "primary_practical",
) -> TargetDecision:
    """Project one Korean surface segment into Ukrainian target space.

    IPA is authoritative for surface realization. Grapheme supplies Korean
    identity for target-specific contextual rules. Connected-speech IPA is
    never inferred by this function.
    """
    if mode != "primary_practical":
        raise ValueError("only primary_practical is implemented")

    features = _features(ipa)

    if grapheme == "ㅇ" and onset:
        return _decision(grapheme, ipa, "", "", mode, features, "structural_null_onset")

    # Aspiration is retained analytically but neutralized in primary Ukrainian.
    aspirated = {
        "ㅋ": ("k", "к"),
        "ㅌ": ("t", "т"),
        "ㅍ": ("p", "п"),
        "ㅊ": ("tɕ", "ч"),
    }
    if grapheme in aspirated:
        target, graphemic = aspirated[grapheme]
        return _decision(
            grapheme, ipa, target, graphemic, mode, features,
            "aspiration_preserved_in_source_IPA_but_neutralized_in_primary_Ukrainian_target",
        )

    voiced = {"ㄱ": ("ɡ", "ґ"), "ㄷ": ("d", "д"), "ㅂ": ("b", "б")}
    voiceless = {"ㄱ": ("k", "к"), "ㄷ": ("t", "т"), "ㅂ": ("p", "п")}
    if grapheme in voiced:
        target, graphemic = voiced[grapheme] if ipa in {"ɡ", "d", "b"} else voiceless[grapheme]
        return _decision(
            grapheme, ipa, target, graphemic, mode, features,
            "surface_voicing_selects_Ukrainian_target",
        )

    fortis = {
        "ㄲ": ("k", "к"),
        "ㄸ": ("t", "т"),
        "ㅃ": ("p", "п"),
        "ㅆ": ("s", "с"),
        "ㅉ": ("tɕ", "ч"),
    }
    if grapheme in fortis:
        target, graphemic = fortis[grapheme]
        return _decision(
            grapheme, ipa, target, graphemic, mode, features,
            "fortis_preserved_analytically_but_neutralized_in_primary_target",
        )

    if grapheme == "ㅅ":
        if following in {"ㅣ", "ㅑ", "ㅒ", "ㅕ", "ㅖ", "ㅛ", "ㅠ", "ㅢ"} or ipa.startswith("ɕ"):
            return _decision(
                grapheme, ipa, "ʃ", "ш", mode, features,
                "palatalized_sibilant_target_before_i_or_j_environment",
            )
        return _decision(grapheme, ipa, "s", "с", mode, features, "plain_sibilant_target")

    if grapheme == "ㅆ":
        if following in {"ㅣ", "ㅑ", "ㅒ", "ㅕ", "ㅖ", "ㅛ", "ㅠ", "ㅢ"} or ipa.startswith("ɕ"):
            return _decision(grapheme, ipa, "ʃ", "ш", mode, features, "palatalized_fortis_sibilant_target")
        return _decision(grapheme, ipa, "s", "с", mode, features, "fortis_sibilant_target")

    if grapheme == "ㅈ":
        if ipa in {"dʑ", "ʑ"}:
            return _decision(grapheme, ipa, "dʒ", "дж", mode, features, "voiced_affricate_target")
        return _decision(grapheme, ipa, "tɕ", "ч", mode, features, "affricate_target")

    if grapheme == "ㄹ":
        if ipa.startswith("l"):
            return _decision(grapheme, ipa, "l", "л", mode, features, "lateral_surface_target")
        return _decision(grapheme, ipa, "ɾ", "р", mode, features, "tap_surface_target")

    if grapheme == "ㅇ":
        return _decision(grapheme, ipa, "n", "н", mode, features, "practical_target_for_velar_nasal")

    direct = {
        "ㄴ": ("n", "н"),
        "ㅁ": ("m", "м"),
        "ㅎ": ("h", "х"),
        "ㅏ": ("a", "а"),
        "ㅐ": ("ɛ", "е"),
        "ㅑ": ("ja", "я"),
        "ㅒ": ("jɛ", "є"),
        "ㅓ": ("ɔ", "о"),
        "ㅔ": ("e", "е"),
        "ㅕ": ("jo", "йо"),
        "ㅖ": ("je", "є"),
        "ㅗ": ("o", "о"),
        "ㅘ": ("wa", "ва"),
        "ㅙ": ("wɛ", "ве"),
        "ㅚ": ("we", "ве"),
        "ㅛ": ("jo", "йо"),
        "ㅜ": ("u", "у"),
        "ㅝ": ("wo", "во"),
        "ㅞ": ("we", "ве"),
        "ㅟ": ("wi", "ві"),
        "ㅠ": ("ju", "ю"),
        "ㅡ": ("ɪ", "и"),
        "ㅣ": ("i", "і"),
    }
    if grapheme in direct:
        target, graphemic = direct[grapheme]
        return _decision(grapheme, ipa, target, graphemic, mode, features, "canonical_direct_target")

    if grapheme == "ㅢ":
        return _decision(
            grapheme, ipa, "", "", mode, features,
            "context_dependent_target_requires_environment",
        )

    return _decision(grapheme, ipa, "", "", mode, features, "no_canonical_target_defined")


__all__ = ["TargetDecision", "project_segment"]
