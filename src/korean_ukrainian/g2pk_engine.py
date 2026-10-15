"""Optional g2pK-backed Korean surface-pronunciation adapter.

g2pK returns a pronunciation spelling in Hangul, not IPA. This adapter derives
IPA from that surface form and restores a sourced lexical IPA entry only when
the input word and g2pK's output exactly match the NIKL-backed record.
"""
from __future__ import annotations

import re
from typing import Any

from .ipa import realize_syllables
from .phonology import parse_syllables

# Protect Latin text, digits, and explanatory compatibility jamo from being
# interpreted as Korean pronunciation input. Punctuation/spacing remains with
# the surrounding Korean chunk so g2pK can use sentence context.
_PROTECTED = re.compile(r"([A-Za-z0-9ㄱ-ㅎㅏ-ㅣ]+)")
_SURFACE_TOKENS = re.compile(r"[가-힣]+|[^가-힣]+")
_ENGINE = None


def _get_engine():
    global _ENGINE
    if _ENGINE is None:
        try:
            from g2pk import G2p
        except ImportError as exc:
            raise RuntimeError(
                "The g2pK pronunciation engine is optional. Install it with "
                "python -m pip install -e '.[g2pk]'."
            ) from exc
        try:
            _ENGINE = G2p()
        except Exception as exc:
            raise RuntimeError(
                "g2pK is installed but could not initialize its Korean "
                "morphological/pronunciation backend. Check the g2pK and "
                "MeCab dependencies; no native-engine fallback was attempted."
            ) from exc
    return _ENGINE


def pronounce_surface(text: str, *, descriptive: bool = False) -> str:
    """Return g2pK's Hangul pronunciation spelling, preserving protected text."""
    if not isinstance(text, str):
        raise TypeError("text must be a string")
    if not text.strip():
        raise ValueError("text must not be empty")

    engine = _get_engine()
    chunks = _PROTECTED.split(text)
    output = []
    for chunk in chunks:
        if not chunk:
            continue
        if _PROTECTED.fullmatch(chunk) or not re.search(r"[가-힣]", chunk):
            output.append(chunk)
            continue
        try:
            spoken = engine(chunk, descriptive=descriptive)
        except Exception as exc:
            raise RuntimeError(
                f"g2pK failed while processing a Korean text chunk: {chunk!r}"
            ) from exc
        if not isinstance(spoken, str) or not spoken:
            raise RuntimeError("g2pK returned an empty or non-string pronunciation")
        output.append(spoken)
    surface = "".join(output)
    if not surface:
        raise RuntimeError("g2pK returned no surface pronunciation")
    return surface


def _surface_ipa(surface: str, source_text: str) -> dict[str, Any]:
    """Derive broad surface IPA and apply only exact, source-backed IPA controls."""
    from .pipeline import LEXICAL_PRONUNCIATIONS

    display_parts: list[str] = []
    ipa_words: list[str] = []
    syllables: list[str] = []
    syllable_records: list[dict[str, Any]] = []
    word_analyses: list[dict[str, Any]] = []
    lexical_overrides: list[dict[str, str]] = []
    source_words = re.findall(r"[가-힣]+", source_text)
    source_index = 0

    for token in _SURFACE_TOKENS.findall(surface):
        if re.fullmatch(r"[가-힣]+", token):
            items = parse_syllables(token)
            source_word = source_words[source_index] if source_index < len(source_words) else ""
            source_index += 1
            entry = LEXICAL_PRONUNCIATIONS.get(source_word)
            values = entry.get("ipa_syllables", "").split("|") if entry else []
            exact_override = bool(
                entry
                and entry.get("surface_hangul") == token
                and len(values) == len(items)
                and all(values)
            )
            if exact_override:
                word_ipa = ".".join(values)
                syllables.extend(values)
                lexical_overrides.append({
                    "input": source_word,
                    "surface_hangul": token,
                    "ipa": word_ipa,
                    "source": entry.get("source_url", ""),
                    "notes": entry.get("rule_notes", ""),
                })
            else:
                rendered = realize_syllables(items, level="broad")
                word_ipa = rendered["ipa"]
                syllables.extend(rendered["syllables"])
            display_parts.append(word_ipa)
            ipa_words.append(word_ipa)
            syllable_records.extend(item.to_dict() for item in items)
            word_analyses.append({
                "input": source_word,
                "surface_hangul": token,
                "ipa": word_ipa,
                "ipa_syllables": word_ipa.split("."),
                "status": "sourced-lexical-ipa-override" if exact_override else "derived-from-surface",
            })
        else:
            # Keep punctuation and non-Korean material in a display-aligned
            # string, but never pretend it is part of the IPA-only field.
            display_parts.append(token)

    return {
        "level": "broad",
        "ipa": " ".join(ipa_words),
        "rendered_text": "".join(display_parts),
        "syllables": syllables,
        "surface_syllables": syllable_records,
        "word_analyses": word_analyses,
        "lexical_overrides": lexical_overrides,
        "variants": [],
        "status": "ipa-derived-from-g2pk-surface-form",
        "surface_hangul": surface,
        "note": (
            "IPA is derived from g2pK's Hangul pronunciation spelling. "
            "Sourced lexical IPA is restored only on an exact surface-form match. "
            "Punctuation and non-Korean text are preserved only in rendered_text."
        ),
    }


def phoneticize_with_g2pk(text: str, *, descriptive: bool = False,
                          ipa_level: str = "broad") -> dict[str, Any]:
    """Run g2pK, then derive IPA; no silent fallback or invented rule trace."""
    if ipa_level != "broad":
        raise ValueError(
            "g2pK mode currently supports broad surface IPA only; "
            "phonemic and narrow modes are not inferred from its output."
        )
    surface = pronounce_surface(text, descriptive=descriptive)
    ipa = _surface_ipa(surface, text)
    rules = [{
        "rule_id": "G2PK",
        "name": "external-g2pK-pronunciation",
        "changed": surface != text,
        "status": "external-engine-output",
        "confidence": "engine-defined",
        "source": "https://github.com/kyubyong/g2pK",
        "notes": (
            "g2pK supplied the pronunciation spelling. The project does "
            "not claim that g2pK exposes a trace for every applied rule."
        ),
    }]
    rules.extend({
        "rule_id": "LEXICON",
        "name": "sourced-lexical-ipa-override",
        "changed": True,
        "status": "sourced-lexical-ipa-override",
        "confidence": "high",
        "source": entry["source"],
        "license_context": entry["notes"],
    } for entry in ipa["lexical_overrides"])
    return {
        "input": text,
        "surface_hangul": surface,
        "surface_syllables": ipa["surface_syllables"],
        "rules": rules,
        "ipa": ipa,
        "pronunciation_engine": "g2pK",
        "morphology_mode": "external-g2pK",
    }


def transliterate_with_g2pk(text: str, *, descriptive: bool = False,
                            target_adapter=None) -> dict[str, Any]:
    """Map g2pK-derived IPA to Ukrainian while preserving punctuation.

    The Ukrainian mapping remains the project's own provisional target layer;
    it is never generated directly from Hangul.
    """
    from .pipeline import _select_target, map_ipa_to_ukrainian
    from .orthography import render_sequence

    pronunciation = phoneticize_with_g2pk(text, descriptive=descriptive)
    surface = pronunciation["surface_hangul"]
    output_parts: list[str] = []
    targets: list[dict[str, Any]] = []
    all_mapped = True
    word_index = 0
    analyses = pronunciation["ipa"]["word_analyses"]

    for token in _SURFACE_TOKENS.findall(surface):
        if not re.fullmatch(r"[가-힣]+", token):
            output_parts.append(token)
            continue

        word_ipa = analyses[word_index]["ipa"]
        word_index += 1
        target = map_ipa_to_ukrainian(word_ipa, target_adapter)
        selected = _select_target(target)
        if not selected:
            all_mapped = False
            targets.append({"surface_hangul": token, "ipa": word_ipa,
                            "status": "unavailable"})
            continue
        output_parts.append(render_sequence(selected["segments"]))
        targets.append({"surface_hangul": token, "ipa": word_ipa,
                        "status": "model-selected", "selection": selected})

    return {
        "input": text,
        "pronunciation_engine": "g2pK",
        "pronunciation_surface": surface,
        "phonetics": pronunciation,
        "ipa": pronunciation["ipa"],
        "target_analysis": targets,
        "ukrainian_orthography": "".join(output_parts) if all_mapped else None,
        "target_status": "model-selected" if all_mapped else "unavailable",
        "score_type": "heuristic_cost",
        "confidence": None,
        "selection_status": (
            "g2pK surface pronunciation → IPA → project Ukrainian target mapping"
            if all_mapped else
            "Ukrainian target unavailable for at least one IPA segment; failed closed"
        ),
        "analysis_status": "research-prototype",
        "morphology_mode": "external-g2pK",
    }
