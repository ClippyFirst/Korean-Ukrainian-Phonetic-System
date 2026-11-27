"""Unicode-safe, inspectable segment IR for Korean Extended IPA output."""
from __future__ import annotations

import unicodedata

# Longest-match inventory. Affricates are single segments, with or without tie bars.
_AFFRICATES = {"t͡ɕ": "tɕ", "d͡ʑ": "dʑ", "t͡s": "ts", "d͡z": "dz"}
_BASES = (
    "tɕ", "dʑ", "ts", "dz", "p", "b", "t", "d", "k", "ɡ", "m", "n", "ɲ", "ŋ",
    "l", "ɾ", "ɭ", "s", "z", "ɕ", "ʑ", "ʃ", "ʒ", "h", "ɦ", "ç", "x", "ɸ",
    "β", "ɣ", "ʝ", "j", "w", "ɥ", "i", "y", "ɨ", "ɯ", "u", "e", "ɛ", "ø",
    "ɤ", "o", "ʌ", "ə", "ɐ", "a", "ɑ", "ɔ", "æ", "ɪ", "ʊ", "ʏ", "œ",
)
_MODIFIERS = set("ʰʱʲʷːˑ͈͉̥̬̩̯̝̞̹̜̟̠̃̚͡")

_CONSONANTS = {
    "p": ("bilabial", "plosive", "voiceless"), "b": ("bilabial", "plosive", "voiced"),
    "t": ("alveolar", "plosive", "voiceless"), "d": ("alveolar", "plosive", "voiced"),
    "k": ("velar", "plosive", "voiceless"), "ɡ": ("velar", "plosive", "voiced"),
    "tɕ": ("alveolo-palatal", "affricate", "voiceless"), "dʑ": ("alveolo-palatal", "affricate", "voiced"),
    "ts": ("alveolar", "affricate", "voiceless"), "dz": ("alveolar", "affricate", "voiced"),
    "s": ("alveolar", "fricative", "voiceless"), "z": ("alveolar", "fricative", "voiced"),
    "ɕ": ("alveolo-palatal", "fricative", "voiceless"), "ʑ": ("alveolo-palatal", "fricative", "voiced"),
    "ʃ": ("postalveolar", "fricative", "voiceless"), "ʒ": ("postalveolar", "fricative", "voiced"),
    "m": ("bilabial", "nasal", "voiced"), "n": ("alveolar", "nasal", "voiced"),
    "ɲ": ("palatal", "nasal", "voiced"), "ŋ": ("velar", "nasal", "voiced"),
    "l": ("alveolar", "lateral-approximant", "voiced"), "ɭ": ("retroflex", "lateral-approximant", "voiced"),
    "ɾ": ("alveolar", "tap", "voiced"), "h": ("glottal", "fricative", "voiceless"),
    "ɦ": ("glottal", "fricative", "voiced"), "ç": ("palatal", "fricative", "voiceless"),
    "x": ("velar", "fricative", "voiceless"), "ɸ": ("bilabial", "fricative", "voiceless"),
    "β": ("bilabial", "fricative", "voiced"), "ɣ": ("velar", "fricative", "voiced"),
    "ʝ": ("palatal", "fricative", "voiced"), "j": ("palatal", "approximant", "voiced"),
    "w": ("labio-velar", "approximant", "voiced"), "ɥ": ("labio-palatal", "approximant", "voiced"),
}
_VOWELS = {
    "i": ("close", "front", "unrounded"), "y": ("close", "front", "rounded"),
    "ɨ": ("close", "central", "unrounded"), "ɯ": ("close", "back", "unrounded"),
    "u": ("close", "back", "rounded"), "e": ("close-mid", "front", "unrounded"),
    "ɛ": ("open-mid", "front", "unrounded"), "ø": ("close-mid", "front", "rounded"),
    "ɤ": ("close-mid", "back", "unrounded"), "o": ("close-mid", "back", "rounded"),
    "ʌ": ("open-mid", "back", "unrounded"), "ə": ("mid", "central", "unrounded"),
    "ɐ": ("near-open", "central", "unrounded"), "a": ("open", "front", "unrounded"),
    "ɑ": ("open", "back", "unrounded"), "ɔ": ("open-mid", "back", "rounded"),
    "æ": ("near-open", "front", "unrounded"), "ɪ": ("near-close", "near-front", "unrounded"),
    "ʊ": ("near-close", "near-back", "rounded"), "ʏ": ("near-close", "near-front", "rounded"),
    "œ": ("open-mid", "front", "rounded"),
}


def _features(base: str, modifiers: list[str]) -> dict:
    if base in _CONSONANTS:
        place, manner, voicing = _CONSONANTS[base]
        features = {"major_class": "consonant", "place": place, "manner": manner, "voicing": voicing}
    elif base in _VOWELS:
        height, backness, roundedness = _VOWELS[base]
        features = {"major_class": "vowel", "height": height, "backness": backness, "roundedness": roundedness}
    else:
        features = {"major_class": "unknown"}
    if features["major_class"] == "consonant":
        features["aspiration"] = "aspirated" if "ʰ" in modifiers else "unaspirated"
        features["fortisness"] = "fortis" if "͈" in modifiers else "unspecified"
        features["release"] = "unreleased" if "̚" in modifiers else "unspecified"
    else:
        features["aspiration"] = "not-applicable"
        features["fortisness"] = "not-applicable"
        features["release"] = "not-applicable"
    features["length"] = "long" if "ː" in modifiers else "half-long" if "ˑ" in modifiers else "unspecified"
    features["secondary_articulation"] = [name for mark, name in (("ʲ", "palatalized"), ("ʷ", "labialized")) if mark in modifiers]
    features["nasalization"] = "nasalized" if "̃" in modifiers else "unspecified"
    return features


def parse_ipa_segments(ipa: str, *, source_span: dict | None = None,
                       provenance: dict | None = None, ipa_offset: int = 0) -> list[dict]:
    """Parse an IPA string into segment/boundary/unknown tokens without dropping code points.

    source_span is deliberately syllable-aligned, not claimed as a phone-level alignment.
    """
    if not isinstance(ipa, str):
        raise TypeError("IPA input must be a string")
    if not isinstance(ipa_offset, int) or isinstance(ipa_offset, bool) or ipa_offset < 0:
        raise ValueError("ipa_offset must be a non-negative code-point offset")
    if source_span is not None:
        if (not isinstance(source_span, dict) or set(source_span) != {"start", "end"}
                or not isinstance(source_span["start"], int) or isinstance(source_span["start"], bool)
                or not isinstance(source_span["end"], int) or isinstance(source_span["end"], bool)
                or source_span["start"] < 0 or source_span["end"] <= source_span["start"]):
            raise ValueError("source_span must be a non-empty code-point span or None")
    if provenance is None:
        provenance = {}
    if not isinstance(provenance, dict):
        raise TypeError("provenance must be an object")
    rule_ids = provenance.get("rule_ids", [])
    evidence_refs = provenance.get("evidence_refs", [])
    if (not isinstance(rule_ids, list) or not all(isinstance(value, str) for value in rule_ids)
            or not isinstance(evidence_refs, list) or not all(isinstance(value, str) for value in evidence_refs)):
        raise ValueError("provenance rule_ids and evidence_refs must be arrays of strings")
    evidence_status = provenance.get("evidence_status", "not-attributed")
    environment = provenance.get("environment")
    if not isinstance(evidence_status, str) or (environment is not None and not isinstance(environment, str)):
        raise ValueError("provenance evidence_status must be a string and environment a string or None")
    points = list(ipa)
    tokens: list[dict] = []
    i = 0
    segment_number = boundary_number = unknown_number = 0
    bases = sorted(_BASES, key=len, reverse=True)
    while i < len(points):
        char = points[i]
        if char.isspace() or char in ".#/|" or unicodedata.category(char).startswith("P"):
            boundary_number += 1
            kind = "word" if char.isspace() else "syllable" if char == "." else "separator"
            tokens.append({"id": f"boundary-{boundary_number:04d}", "kind": "boundary",
                           "boundary": kind, "ipa": char, "ipa_span": {"start": ipa_offset+i, "end": ipa_offset+i+1}})
            i += 1
            continue
        affricate = next((raw for raw in sorted(_AFFRICATES, key=len, reverse=True)
                          if points[i:i+len(raw)] == list(raw)), None)
        base = _AFFRICATES[affricate] if affricate else next(
            (candidate for candidate in bases if points[i:i+len(candidate)] == list(candidate)), None
        )
        if base is None:
            if char in _MODIFIERS and tokens and tokens[-1]["kind"] == "segment":
                token = tokens[-1]
                token["modifiers"].append(char)
                token["ipa"] += char
                token["ipa_span"]["end"] = ipa_offset+i+1
                token["features"] = _features(token["base"], token["modifiers"])
                i += 1
                continue
            unknown_number += 1
            tokens.append({"id": f"unknown-{unknown_number:04d}", "kind": "unknown", "ipa": char,
                           "ipa_span": {"start": ipa_offset+i, "end": ipa_offset+i+1},
                           "source_span": dict(source_span) if source_span is not None else None,
                           "source_alignment": "syllable-span" if source_span is not None else "unavailable",
                           "reason": "unrecognized_ipa_code_point",
                           "provenance": {"rule_ids": list(rule_ids), "evidence_refs": list(evidence_refs),
                                          "evidence_status": evidence_status, "environment": environment}})
            i += 1
            continue
        start = i
        i += len(affricate) if affricate else len(base)
        modifiers = []
        while i < len(points) and points[i] in _MODIFIERS:
            modifiers.append(points[i])
            i += 1
        segment_number += 1
        tokens.append({
            "id": f"segment-{segment_number:04d}", "kind": "segment",
            "ipa": "".join(points[start:i]), "base": base, "modifiers": modifiers,
            "features": _features(base, modifiers),
            "ipa_span": {"start": ipa_offset+start, "end": ipa_offset+i},
            "source_span": dict(source_span) if source_span is not None else None,
            "source_alignment": "syllable-span" if source_span is not None else "unavailable",
            "provenance": {
                "rule_ids": list(rule_ids), "evidence_refs": list(evidence_refs),
                "evidence_status": evidence_status,
                "environment": environment,
            },
        })
    return tokens
