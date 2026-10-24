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
    """One analyzer token; offsets are Python string indices into source text."""

    form: str
    tag: str
    start: int
    end: int
    lemma: str | None = None
    analyzer: str = ""
    confidence: str = "unscored"

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
                lemma=None, analyzer=self.name,
            ))
        return MorphologyResult(text, self.name, tuple(result))


class MecabKoMorphologyAnalyzer:
    """Adapter for the MeCab Python API when built with a Korean dictionary.

    The adapter expects the conventional `MeCab.Tagger.parseToNode` API.
    Installation and dictionary configuration vary by platform; failures are
    surfaced explicitly and never trigger a silent fallback to another engine.
    """

    name = "mecab-ko"

    def __init__(self, tagger: Any | None = None) -> None:
        if tagger is None:
            try:
                mecab_module = import_module("MeCab")
                tagger = mecab_module.Tagger()
            except (ImportError, AttributeError, RuntimeError) as exc:
                raise RuntimeError(
                    "MeCab-Ko adapter needs the optional MeCab Python binding "
                    "and a configured Korean dictionary. Install/configure it "
                    "for this OS, then retry; no fallback was attempted."
                ) from exc
        self._tagger = tagger

    def analyze(self, text: str) -> MorphologyResult:
        _validate_text(text)
        node = self._tagger.parseToNode(text)
        cursor = 0
        result: list[Morpheme] = []
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
            tag = ",".join(features[:2]) if features else "unknown"
            lemma = features[6] if len(features) > 6 and features[6] not in {"*", ""} else None
            result.append(Morpheme(
                form=surface, tag=tag, start=start, end=end,
                lemma=lemma, analyzer=self.name,
            ))
        return MorphologyResult(text, self.name, tuple(result))


def analyzer_by_name(name: str) -> MorphologicalAnalyzer:
    """Construct an explicitly requested analyzer; never silently substitute."""
    if name == "kiwi":
        return KiwiMorphologyAnalyzer()
    if name in {"mecab-ko", "mecab"}:
        return MecabKoMorphologyAnalyzer()
    raise ValueError(f"unsupported morphology analyzer: {name!r}")
