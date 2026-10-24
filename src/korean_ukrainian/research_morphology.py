"""Optional structured Korean morphology adapters for research mode only.

These adapters expose segmentation, lemma/POS-like tags and offsets. They do
not perform pronunciation, IPA conversion, rule licensing, or Ukrainian
adaptation. Nothing in the practical browser service imports this module.
"""
from __future__ import annotations

from dataclasses import asdict, dataclass
from importlib import import_module
from typing import Any, Protocol


@dataclass(frozen=True, slots=True)
class Morpheme:
    """Analyzer morpheme with source offsets and explicit surface alignment.

    "form" is the analyzer's morpheme form and may be normalized or
    decomposed; "surface" is the literal source substring at [start:end].
    Some Korean analyzers emit zero-width morphemes, which are preserved and
    labeled rather than mistaken for ordinary source-aligned spans.
    """

    form: str
    tag: str
    start: int
    end: int
    lemma: str | None = None
    analyzer: str = ""
    confidence: str = "unscored"
    surface: str = ""
    span_status: str = "surface_aligned"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True, slots=True)
class MorphologyResult:
    text: str
    analyzer: str
    morphemes: tuple[Morpheme, ...]
    status: str = "analyzed_not_adjudicated"

    def to_dict(self) -> dict[str, Any]:
        return {
            "text": self.text,
            "analyzer": self.analyzer,
            "status": self.status,
            "morphemes": [item.to_dict() for item in self.morphemes],
            "contract": "morphology_only_no_pronunciation_or_rule_license",
        }


class MorphologicalAnalyzer(Protocol):
    name: str

    def analyze(self, text: str) -> MorphologyResult: ...


def _validate_text(text: str) -> None:
    if not isinstance(text, str):
        raise TypeError("text must be a string")
    if not text.strip():
        raise ValueError("text must not be empty")
    if not any("\uac00" <= char <= "\ud7a3" for char in text):
        raise ValueError("text must contain at least one precomposed Hangul syllable")


class KiwiMorphologyAnalyzer:
    """Adapter for Kiwi (kiwipiepy); optional and research-only."""

    name = "kiwi"

    def __init__(self, engine: Any | None = None) -> None:
        if engine is None:
            try:
                engine_type = getattr(import_module("kiwipiepy"), "Kiwi")
            except (ImportError, AttributeError) as exc:
                raise RuntimeError(
                    "Kiwi morphology is optional. Install the research extra: "
                    "python -m pip install -e '.[research-kiwi]'."
                ) from exc
            engine = engine_type()
        self._engine = engine

    def analyze(self, text: str) -> MorphologyResult:
        _validate_text(text)
        result = []
        for token in self._engine.tokenize(text):
            form = str(token.form)
            start = int(token.start)
            length = int(token.len)
            if not form or start < 0 or length < 0 or start + length > len(text):
                raise RuntimeError("Kiwi returned an invalid token span")
            # Kiwi does not expose a universally valid lemma for every token.
            # Keep lemma null rather than infer it from surface spelling.
            result.append(Morpheme(
                form=form, tag=str(token.tag), start=start, end=start + length,
                lemma=None, analyzer=self.name, surface=text[start:start + length],
                span_status="zero_width_morph" if length == 0 else "surface_aligned",
            ))
        return MorphologyResult(text, self.name, tuple(result))


class MecabKoMorphologyAnalyzer:
    """Adapter for MeCab-Ko Python bindings with a Korean dictionary.

    Supported APIs, tried in order: Rust `mecab-ko-python` (`mecab_ko.Mecab`),
    `python-mecab-ko` (`mecab.MeCab`), and compatible legacy
    `MeCab.Tagger().parseToNode()`. These are binding-level compatibility
    attempts for the same analyzer family, not fallbacks to another engine.
    The selected binding is recorded for diagnostics; initialization errors are
    retained if no supported API can be initialized.
    """

    name = "mecab-ko"

    def __init__(self, tagger: Any | None = None) -> None:
        self.binding = "injected" if tagger is not None else ""
        if tagger is None:
            errors: list[str] = []
            candidates = (
                ("mecab_ko", "Mecab", "rust-mecab-ko-python"),
                ("mecab", "MeCab", "python-mecab-ko"),
            )
            for module_name, class_name, binding_name in candidates:
                try:
                    module = import_module(module_name)
                    tagger_type = getattr(module, class_name)
                    tagger = tagger_type()
                    self.binding = binding_name
                    break
                except (ImportError, AttributeError, RuntimeError, OSError) as exc:
                    errors.append(f"{module_name}.{class_name}: {type(exc).__name__}: {exc}")
            if tagger is None:
                try:
                    module = import_module("MeCab")
                    tagger = module.Tagger()
                    self.binding = "legacy-MeCab"
                except (ImportError, AttributeError, RuntimeError, OSError) as exc:
                    errors.append(f"MeCab.Tagger: {type(exc).__name__}: {exc}")
                    raise RuntimeError(
                        "No supported MeCab-Ko binding initialized. Tried mecab-ko-python, "
                        "python-mecab-ko, and legacy MeCab API. " + " | ".join(errors)
                    ) from exc
        self._tagger = tagger

    def analyze(self, text: str) -> MorphologyResult:
        _validate_text(text)
        # The Rust mecab-ko-python package exposes .pos(); older MeCab
        # bindings expose .parseToNode(). Support both documented API shapes.
        if callable(getattr(self._tagger, "pos", None)):
            result: list[Morpheme] = []
            cursor = 0
            for surface, tag in self._tagger.pos(text):
                surface = str(surface)
                start = text.find(surface, cursor)
                if not surface or start < 0:
                    raise RuntimeError("MeCab-Ko token cannot be aligned to source text")
                end = start + len(surface)
                cursor = end
                result.append(Morpheme(
                    form=surface, tag=str(tag), start=start, end=end,
                    lemma=None, analyzer=self.name, surface=text[start:end],
                    span_status="surface_aligned",
                ))
            return MorphologyResult(text, self.name, tuple(result))

        node = self._tagger.parseToNode(text)
        cursor = 0
        result = []
        while node is not None:
            surface = str(getattr(node, "surface", "") or "")
            feature = str(getattr(node, "feature", "") or "")
            node = getattr(node, "next", None)
            if not surface:
                continue
            # MeCab surfaces are searched in order so whitespace omitted by
            # the tokenizer remains represented by the original source offsets.
            start = text.find(surface, cursor)
            if start < 0:
                raise RuntimeError("MeCab-Ko token cannot be aligned to source text")
            end = start + len(surface)
            cursor = end
            features = feature.split(",")
            tag = features[0] if features and features[0] else "unknown"
            lemma = features[6] if len(features) > 6 and features[6] not in {"*", ""} else None
            result.append(Morpheme(
                form=surface, tag=tag, start=start, end=end,
                lemma=lemma, analyzer=self.name, surface=text[start:end],
                span_status="surface_aligned",
            ))
        return MorphologyResult(text, self.name, tuple(result))


def analyzer_by_name(name: str) -> MorphologicalAnalyzer:
    """Construct an explicitly requested analyzer; never silently substitute."""
    if name == "kiwi":
        return KiwiMorphologyAnalyzer()
    if name in {"mecab-ko", "mecab"}:
        return MecabKoMorphologyAnalyzer()
    raise ValueError(f"unsupported morphology analyzer: {name!r}")
