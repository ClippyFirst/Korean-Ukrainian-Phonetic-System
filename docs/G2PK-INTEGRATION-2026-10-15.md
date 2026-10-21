# g2pK integration boundary (2026-10-16)

## Decision

The public browser service's practical mode uses the vendored browser-only JavaScript port adapted from `ntdgo/korean-pronunciation` 1.0.1, itself a JavaScript port of Kyubyong Park's g2pK. The original Python package `g2pK==0.9.4` remains an optional backend for the Python library, CLI, and FastAPI API.

These are related implementations, not identical runtimes. In particular, the browser port does **not** reproduce the original Python package's MeCab-based morphological analysis. A successful conversion is therefore not proof that every morphology-sensitive homograph or connected-speech case has been resolved normatively.

- Original Python upstream: https://github.com/kyubyong/g2pK
- Browser-port upstream: https://github.com/ntdgo/korean-pronunciation
- Python package: https://pypi.org/project/g2pK/0.9.4/
- Browser source: `src/vendor/g2pk/`
- Browser adapter: `src/app/g2pk_web.js`
- Public app selection: `src/main.js`
- License: Apache-2.0; notices are shipped in `public/THIRD_PARTY_NOTICES.txt` and `public/LICENSES/Apache-2.0.txt`.

## Public browser data flow

    Korean text
      → browser JavaScript g2pK port (prescriptive mode)
      → Korean surface spelling
      → this project's IPA renderer
      → exact, source-backed lexical surface/IPA controls when licensed
      → this project's IPA-to-Ukrainian target inventory

The browser's practical mode calls `webEngine.convert(text)`; the research mode intentionally calls the project's separate evidence-gated native engine. The Ukrainian target is generated from IPA, never through a parallel Hangul-to-Ukrainian conversion.

The browser port preserves punctuation, whitespace, Latin text, and digits through the surrounding adapter. It does not use Python, MeCab, a server, or network calls at runtime.

## Python data flow

    Korean text
      → optional Python g2pK 0.9.4 (prescriptive by default)
      → Korean surface spelling
      → project IPA renderer
      → exact source-backed corrections when licensed
      → project Ukrainian target inventory

Install the optional dependency on a compatible Python environment with:

    python -m pip install -e ".[g2pk]"

The optional MeCab binding is documented as supported on Python 3.11/3.12 in this repository. On Python 3.13/3.14, use a separate 3.11/3.12 environment or the native engine. A missing or uninitializable backend must remain an explicit error; it must never silently fall back to another engine.

## Validation policy

The upstream G2P implementation is a useful, established rule-based foundation, but is not an infallible standard oracle. Validate it against the National Institute of Korean Language (NIKL) Standard Pronunciation Rules and source-backed exact-form fixtures.

- Keep Korean surface realization separate from IPA rendering and Ukrainian target mapping.
- Test exact outputs for difficult codas, liaison, tensification, aspiration, palatalization, nasal/liquid assimilation, ㄴ insertion, and negative controls.
- Keep the user's adversarial long passage as an end-to-end regression fixture; a test that merely checks for non-empty output or absence of placeholders is a smoke test, not a pronunciation-accuracy test.
- Apply a lexical surface correction only when the exact source form, alignment, and syllable count are licensed.
- Apply sourced IPA only when its form/alignment matches the licensed lexical entry.
- Do not invent per-rule NIKL trace entries: the upstream JS port does not expose an auditable NIKL rule-by-rule derivation. Label the G2P surface realization honestly.
- If a case depends on morphology the browser port cannot determine, add a sourced exact-form control or expose the uncertainty; do not silently claim Python g2pK parity.

## Known boundary

The browser port has heuristic annotation rather than the original Python g2pK's MeCab morphological analysis. Therefore the practical mode prioritizes usable coverage, while the research mode retains the project's stricter evidence gates. The two modes are complementary: practical output should not be presented as proof that every output is normatively verified.

Related validation documents:
- `docs/WEB-SERVICE-QA.md`
- `docs/IPA-FIRST-TARGET-CONSISTENCY-AUDIT-2026-10-11.md`
- `tests/g2pk-web-engine.test.mjs`
