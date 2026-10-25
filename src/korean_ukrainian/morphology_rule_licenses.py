"""Low-confidence, analyzer-consensus rule licensing for Korean research mode.

Two independent morphology analyses can support a *candidate* morpheme boundary.
They are not pronunciation gold. This adapter only licenses rules when both
analyses align a formal morpheme to the same orthographic syllable boundary;
the resulting IPA remains diagnostic-only and must not bypass the IPA→target
acceptance gate.
"""
from __future__ import annotations

from collections.abc import Mapping, Sequence
from typing import Any

from .phonology import parse_syllables

_FORMAL_TAGS = {
    "EC", "EF", "EP", "ETM", "ETN",
    "JC", "JKS", "JKC", "JKG", "JKO", "JKB", "JKV", "JKQ", "JX",
    "XSN", "XSV", "XSA",
}
_H_CODAS = {"ㅎ", "ㄶ", "ㅀ"}
_R002_EXCLUDED_CODAS = _H_CODAS


def _tag_parts(value: Any) -> set[str]:
    if not isinstance(value, str):
        return set()
    return {part.strip() for part in value.split("+") if part.strip()}


def _formal_boundary_offsets(text: str, analysis: Mapping[str, Any]) -> set[int]:
    """Return source offsets where a non-zero morpheme boundary has a formal right tag.

    Only exact adjacent source spans are trusted. Overlapping, zero-width, or
    malformed spans at a boundary make that boundary unusable; normalized
    morpheme forms are not mistaken for literal source substrings.
    """
    if analysis.get("text") != text:
        return set()
    morphemes = analysis.get("morphemes")
    if not isinstance(morphemes, list):
        return set()

    spans: list[dict[str, Any]] = []
    zero_width_offsets: set[int] = set()
    for item in morphemes:
        if not isinstance(item, Mapping):
            continue
        start, end = item.get("start"), item.get("end")
        if isinstance(start, bool) or isinstance(end, bool):
            continue
        if not isinstance(start, int) or not isinstance(end, int):
            continue
        if start < 0 or end < start or end > len(text):
            continue
        if start == end:
            zero_width_offsets.add(start)
            continue
        surface = item.get("surface")
        if isinstance(surface, str) and surface and surface != text[start:end]:
            continue
        spans.append({"start": start, "end": end, "tag": item.get("tag")})

    result: set[int] = set()
    for offset in range(1, len(text)):
        if not ("\uac00" <= text[offset - 1] <= "\ud7a3" and "\uac00" <= text[offset] <= "\ud7a3"):
            continue
        if offset in zero_width_offsets:
            continue
        left = [item for item in spans if item["end"] == offset and item["start"] < offset]
        right = [item for item in spans if item["start"] == offset and item["end"] > offset]
        crosses = any(item["start"] < offset < item["end"] for item in spans)
        if crosses or len(left) != 1 or len(right) != 1:
            continue
        if _tag_parts(right[0]["tag"]) & _FORMAL_TAGS:
            result.add(offset)
    return result



def _unspaced_adverb_verb_offsets(text: str, analysis: Mapping[str, Any]) -> set[int]:
    """Find likely missing eojeol spaces between an adverb and a lexical verb.

    The native IPA rules operate on a single token. If both analyzers identify
    an unspaced MAG→VV/VA/VX boundary, phrase-level phonology may differ from
    within-word phonology; this adapter therefore withholds all licenses for
    that token rather than pretending it has reconstructed orthographic spaces.
    """
    morphemes = analysis.get("morphemes")
    if not isinstance(morphemes, list):
        return set()
    spans: list[dict[str, Any]] = []
    zero_width: set[int] = set()
    for item in morphemes:
        if not isinstance(item, Mapping):
            continue
        start, end = item.get("start"), item.get("end")
        if isinstance(start, bool) or isinstance(end, bool):
            continue
        if not isinstance(start, int) or not isinstance(end, int):
            continue
        if start < 0 or end < start or end > len(text):
            continue
        if start == end:
            zero_width.add(start)
            continue
        surface = item.get("surface")
        if isinstance(surface, str) and surface and surface != text[start:end]:
            continue
        spans.append({"start": start, "end": end, "tag": item.get("tag")})

    result: set[int] = set()
    for offset in range(1, len(text)):
        if offset in zero_width:
            continue
        left = [item for item in spans if item["end"] == offset and item["start"] < offset]
        right = [item for item in spans if item["start"] == offset and item["end"] > offset]
        crosses = any(item["start"] < offset < item["end"] for item in spans)
        if crosses or len(left) != 1 or len(right) != 1:
            continue
        if "MAG" in _tag_parts(left[0]["tag"]) and _tag_parts(right[0]["tag"]) & {"VV", "VA", "VX"}:
            result.add(offset)
    return result


def analyzer_consensus_rule_licenses(
    text: str,
    analyses: Sequence[Mapping[str, Any]],
) -> dict[str, Any]:
    """Build exact-form rule licenses only where two distinct analyzers agree.

    The first version intentionally supports a single precomposed-Hangul token
    with character-aligned spans. It does not infer spaces, decompose syllables,
    or license substantive-morpheme rules.
    """
    if not isinstance(text, str) or not text or any(not ("\uac00" <= char <= "\ud7a3") for char in text):
        raise ValueError("analyzer consensus currently requires one precomposed-Hangul token without spaces")
    if not isinstance(analyses, Sequence) or isinstance(analyses, (str, bytes)) or len(analyses) < 2:
        raise ValueError("at least two morphology analyses are required for consensus")
    names = {
        str(item.get("analyzer", "")) for item in analyses
        if isinstance(item, Mapping) and item.get("analyzer")
    }
    if len(names) < 2:
        raise ValueError("morphology consensus requires two distinct analyzer names")
    if any(not isinstance(item, Mapping) or item.get("text") != text for item in analyses):
        raise ValueError("every morphology analysis must refer to the exact input text")

    boundary_sets = [_formal_boundary_offsets(text, item) for item in analyses]
    common_boundaries = set.intersection(*boundary_sets) if boundary_sets else set()
    adverb_verb_sets = [_unspaced_adverb_verb_offsets(text, item) for item in analyses]
    unspaced_multiword_boundaries = set.intersection(*adverb_verb_sets) if adverb_verb_sets else set()
    if unspaced_multiword_boundaries:
        common_boundaries = set()
    syllables = parse_syllables(text)
    if len(syllables) != len(text):
        raise ValueError("source text did not map one-to-one to Hangul syllables")

    licenses: set[str] = set()
    details: list[dict[str, Any]] = []
    for offset in sorted(common_boundaries):
        left, right = syllables[offset - 1], syllables[offset]
        pair = f"{left.text}>{right.text}"
        applied: list[str] = []
        if left.coda and left.coda not in _R002_EXCLUDED_CODAS and right.onset == "ㅇ":
            license = f"R002:formal:{text}:{pair}"
            licenses.add(license)
            applied.append("R002")
        if left.coda in _H_CODAS and right.onset == "ㅇ":
            license = f"R003:ending_or_suffix_h_deletion:{text}:{pair}"
            licenses.add(license)
            applied.append("R003")
        if left.coda in {"ㄷ", "ㅌ", "ㄾ"} and right.onset == "ㅇ" and right.nucleus == "ㅣ":
            license = f"R007:formal_morpheme_i:{text}:{pair}"
            licenses.add(license)
            applied.append("R007")
        if applied:
            details.append({
                "offset": offset,
                "pair": pair,
                "right_tags": [
                    sorted(_tag_parts(next(
                        m.get("tag", "") for m in item.get("morphemes", [])
                        if isinstance(m, Mapping) and m.get("start") == offset and m.get("end", offset) > offset
                    )))
                    for item in analyses
                ],
                "candidate_rules": applied,
            })

    return {
        "status": "analyzed_not_adjudicated",
        "analyzers": sorted(names),
        "candidate_licenses": sorted(licenses),
        "consensus_boundaries": sorted(common_boundaries),
        "blocked_unspaced_multiword_boundaries": sorted(unspaced_multiword_boundaries),
        "licensed_boundaries": details,
        "limitations": [
            "morphology agreement is not independent pronunciation gold",
            "only formal-morpheme contexts are licensed; substantive contexts remain unresolved",
            "unspaced multiword inputs may still have incorrect cross-word phonology",
            "all outputs derived from these licenses remain diagnostic-only",
        ],
    }


def phoneticize_korean_with_analyzer_consensus(
    text: str,
    analyses: Sequence[Mapping[str, Any]],
) -> dict[str, Any]:
    """Return an IPA candidate with analyzer provenance, never accepted gold."""
    from .pipeline import phoneticize_korean

    audit = analyzer_consensus_rule_licenses(text, analyses)
    result = phoneticize_korean(text, rule_licenses=audit["candidate_licenses"], morphology_mode="strict")
    applied: list[str] = []
    for trace in result.get("rules", []):
        license_context = trace.get("license_context")
        if license_context in audit["candidate_licenses"] and trace.get("changed"):
            trace.update({
                "status": "analyzer-supported-low-confidence",
                "confidence": "low",
                "source": "two-analyzer-morphology-consensus; NIKL rule environment still requires review",
            })
            applied.append(license_context)

    result["morphology_mode"] = "analyzer-consensus"
    result["morphology_analysis"] = {
        **audit,
        "applied_licenses": sorted(set(applied)),
        "acceptance": "diagnostic-only; not independent IPA adjudication",
    }
    if applied:
        status = "diagnostic_only_analyzer_morphology"
        reason = "Morphology-assisted rule licensing is low-confidence and requires independent pronunciation review."
        result["ipa_status"] = status
        result["ipa_is_diagnostic_only"] = True
        result["ipa_status_reason"] = reason
        result["ipa"].update({
            "status": status,
            "is_diagnostic_only": True,
            "status_reason": reason,
        })
    return result
