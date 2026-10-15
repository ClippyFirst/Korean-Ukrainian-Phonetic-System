# g2pK integration boundary (2026-10-15)

## Decision

The optional Python/API pronunciation backend is Kyubyong's **g2pK 0.9.4** (the Python package imports as g2pk), using its default prescriptive mode. It was selected over the direct Hangul-to-IPA demo because g2pK performs context-sensitive grapheme-to-phoneme conversion and uses morphological analysis. It is not treated as an infallible standard oracle: its own documentation explicitly acknowledges limitations.

- Upstream: https://github.com/kyubyong/g2pK
- PyPI: https://pypi.org/project/g2pK/0.9.4/
- License: Apache-2.0
- Installation: python -m pip install -e ".[g2pk]"

The dependency is optional and pinned. A missing or uninitializable backend produces an explicit error; the system never silently substitutes its native rules.

## Data flow

    Korean text
      → g2pK prescriptive surface spelling in Hangul
      → this project's IPA renderer
      → sourced lexical IPA override only when the original word's NIKL-backed surface form exactly matches g2pK
      → this project's Ukrainian target inventory

The Ukrainian layer is still the project's own model. It receives IPA, never Hangul directly. g2pK does not emit IPA or a rule-by-rule audit trace. Therefore the result labels its trace as external-engine output rather than fabricating individual NIKL rule applications.

## Runtime selection

The native engine remains the default for backward compatibility. The Python API and CLI allow explicit selection:

- CLI: korean-ua analyze "넋이 굳이" --pronunciation-engine g2pk
- Descriptive option: --pronunciation-engine g2pk --descriptive-pronunciation
- API request: {"text":"넋이 굳이","mode":"transliterate","pronunciation_engine":"g2pk"}

The API's pronunciation_engine field accepts native or g2pk. The descriptive mode is opt-in; the default is prescriptive.

## Important scope boundary

GitHub Pages is a static browser application and cannot import a Python package or initialize MeCab. This integration wires g2pK into the Python library, CLI, and optional FastAPI backend; it does not silently claim that the existing browser-only engine has been replaced. A later browser rollout must either call a deployed API or port and independently test equivalent behavior in JavaScript. The static website continues using its existing browser engine until that parity work is complete.

## Validation policy

Before considering g2pK the only production engine, compare its output with NIKL-backed surface-form fixtures and the existing adversarial corpus. Known source-backed surface forms may correct a g2pK output only for an exact input-word entry, with unambiguous one-to-one word alignment and matching syllable count. Sourced IPA, including distinctions not encoded in Hangul pronunciation spelling (for example vowel length), is restored only when the final surface form matches that entry exactly. A mismatch without an exact license remains visible as an audit finding; no broad spelling heuristic is used.
