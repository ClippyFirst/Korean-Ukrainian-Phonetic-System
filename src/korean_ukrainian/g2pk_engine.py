"""Isolated g2pK surface-pronunciation adapter.

The adapter returns the pinned g2pK surface spelling and derives project IPA
from that spelling. It deliberately does not consume Kozak Kim's NIKL rule
licenses, lexical surface corrections, IPA overrides, or unresolved lexical
statuses. Those belong exclusively to the Kozak Kim research engine.
"""
from __future__ import annotations

import re
import sys
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
            if sys.version_info >= (3, 13):
                message = (
                    f"g2pK is not installed for Python {sys.version_info.major}."
                    f"{sys.version_info.minor}. The optional extra is restricted "
                    "to Python 3.11/3.12 because python-mecab-ko could not build "
                    "without mecab-config on Python 3.13/3.14. Use a Python "
                    "3.11/3.12 environment or select the native engine."
                )
            else:
                message = (
                    "The g2pK pronunciation engine is optional. Install it with "
                    "python -m pip install -e '.[g2pk]'."
                )
            raise RuntimeError(message) from exc
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
    """Return the pinned g2pK Hangul surface spelling without project overlays."""
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
    """Derive broad IPA only from g2pK's Hangul surface spelling."""
    display_parts: list[str] = []
    ipa_words: list[str] = []
    syllables: list[str] = []
    syllable_records: list[dict[str, Any]] = []
    word_analyses: list[dict[str, Any]] = []
    source_words = re.findall(r"[가-힣]+", source_text)
    source_index = 0

    for token in _SURFACE_TOKENS.findall(surface):
        if re.fullmatch(r"[가-힣]+", token):
            items = parse_syllables(token)
            source_word = source_words[source_index] if source_index < len(source_words) else ""
            source_index += 1
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
                "status": "derived-from-surface",
                "is_diagnostic_only": False,
                "status_reason": None,
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
        "lexical_overrides": [],
        "variants": [],
        "status": "ipa-derived-from-g2pk-surface-form",
        "is_diagnostic_only": False,
        "status_reason": None,
        "surface_hangul": surface,
        "note": (
            "IPA is derived only from g2pK's Hangul pronunciation spelling. "
            "Kozak Kim NIKL rules and lexical/IPA overlays are not applied. "
            "Punctuation and non-Korean text are preserved only in rendered_text."
        ),
    }


def phoneticize_with_g2pk(text: str, *, descriptive: bool = False,
                          ipa_level: str = "broad") -> dict[str, Any]:
    """Run isolated g2pK, then derive IPA; no silent fallback or project overlay."""
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
            "g2pK supplied the pronunciation spelling. No Kozak Kim NIKL "
            "rule or lexical overlay is applied, and g2pK does not expose "
            "a trace for every applied rule."
        ),
    }]
    return {
        "input": text,
        "surface_hangul": surface,
        "surface_syllables": ipa["surface_syllables"],
        "rules": rules,
        "ipa": ipa,
        "ipa_status": ipa["status"],
        "ipa_is_diagnostic_only": ipa["is_diagnostic_only"],
        "ipa_status_reason": ipa["status_reason"],
        "pronunciation_engine": "g2pK",
        "morphology_mode": "external-g2pK",
    }


def transliterate_with_g2pk(text: str, *, descriptive: bool = False,
                            target_adapter=None) -> dict[str, Any]:
    """Run external g2pK pronunciation, then delegate target rendering to ClippyFirst core.

    This adapter owns Korean surface pronunciation and IPA derivation only.
    Ukrainian mapping, candidate selection, and orthographic rendering are
    centralized in pipeline.render_ipa_analysis_to_ukrainian.
    """
    from .pipeline import render_ipa_analysis_to_ukrainian

    pronunciation = phoneticize_with_g2pk(text, descriptive=descriptive)
    return render_ipa_analysis_to_ukrainian(
        text,
        pronunciation["ipa"]["word_analyses"],
        pronunciation_surface=pronunciation["surface_hangul"],
        phonetics=pronunciation,
        ipa=pronunciation["ipa"],
        pronunciation_engine="g2pK",
        target_adapter=target_adapter,
        morphology_mode="external-g2pK",
    )
