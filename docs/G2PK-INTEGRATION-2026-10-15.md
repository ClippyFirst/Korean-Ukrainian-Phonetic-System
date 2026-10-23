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
      → this project's IPA renderer (adapter only; no new phonological rules)
      → this project's IPA-to-Ukrainian target inventory

The browser's practical mode calls `webEngine.convert(text)`; the research mode intentionally calls the project's separate evidence-gated native engine. The Ukrainian target is generated from IPA, never through a parallel Hangul-to-Ukrainian conversion.

The browser port preserves punctuation, whitespace, Latin text, and digits through the surrounding adapter. As of 2026-10-23, the practical adapter applies a finite, exact-form allowlist of official NIKL Korean-surface corrections before IPA for 값어치, 넓죽하다, 넓둥글다, 넓적하다, and 읽고. The vendored port itself and raw-output parity fixture remain unchanged; no general phonological rule is inferred from these forms. It does not use Python, MeCab, a server, or network calls at runtime.

## Python data flow

    Korean text
      → optional Python g2pK 0.9.4 (prescriptive by default)
      → Korean surface spelling
      → project IPA renderer
      → exact source-backed corrections when licensed
      → project Ukrainian target inventory

The native Python target adapter depends on the separate `ClippyFirst/Ukrainian-Phonetic-Inventory` repository, expected version `0.8.0`. It is deliberately not vendored here or added as a private VCS dependency. In a development checkout where both repositories are sibling directories, install it into the same environment:

    python -m pip install -e ../Ukrainian-Phonetic-Inventory

If the shared inventory is unavailable, native Korean surface/IPA analysis still runs, but Ukrainian orthography is returned as unresolved/unavailable. A stored `target_syllables` value is retained only as a comparison reference; it must not override the IPA-derived adapter result.

Install the optional g2pK dependency on a compatible Python environment with:

    python -m pip install -e ".[g2pk]"

The optional MeCab binding is documented as supported on Python 3.11/3.12 in this repository. On Python 3.13/3.14, use a separate 3.11/3.12 environment or the native engine. A missing or uninitializable backend must remain an explicit error; it must never silently fall back to another engine.

## Validation policy

The upstream G2P implementation is a useful, established rule-based foundation, but is not an infallible standard oracle. Validate it against the National Institute of Korean Language (NIKL) Standard Pronunciation Rules and source-backed exact-form fixtures.

- Keep Korean surface realization separate from IPA rendering and Ukrainian target mapping.
- Test exact outputs for difficult codas, liaison, tensification, aspiration, palatalization, nasal/liquid assimilation, ㄴ insertion, and negative controls.
- Keep the user's adversarial long passage as an end-to-end regression fixture; a test that merely checks for non-empty output or absence of placeholders is a smoke test, not a pronunciation-accuracy test.
- In **practical browser mode**, preserve raw vendored-port behavior as a separate diagnostic, but permit only exact, official-source-backed Korean surface corrections before IPA when NIKL directly contradicts the port. Every Ukrainian target must still be derived from IPA; do not add direct Hangul-to-Ukrainian overrides or generalize exact-form exceptions.
- Research-only and Python integrations may have their own evidence-backed lexical controls, but these must not leak into the practical browser path.
- Do not invent per-rule NIKL trace entries: the upstream JS port does not expose an auditable NIKL rule-by-rule derivation. Label the G2P surface realization honestly.
- If the port cannot determine morphology, preserve the port's own output; document the limitation rather than silently substituting another pronunciation engine.

## Known boundary

The browser port has heuristic annotation rather than the original Python g2pK's MeCab morphological analysis. Therefore the practical mode prioritizes usable coverage, while the research mode retains the project's stricter evidence gates. The two modes are complementary: practical output should not be presented as proof that every output is normatively verified.

Related validation documents:
- `docs/WEB-SERVICE-QA.md`
- `docs/IPA-FIRST-TARGET-CONSISTENCY-AUDIT-2026-10-11.md`
- `tests/g2pk-web-engine.test.mjs`


## Practical-mode contract correction — 2026-10-21

The practical browser mode is intentionally strict about the selected JavaScript port, not about matching normative NIKL output in every word. Its Korean surface form must equal `G2pBrowser.convert` with `descriptive: false`, `verbose: false`, `groupVowels: false`, and `toSyl: true`, after the documented literal-preservation boundary for Latin/digits/jamo. The adapter then derives IPA and Ukrainian target from that surface. It must not patch the surface or IPA using the research lexicon. For example, the port's `값어치` output is kept as a known upstream divergence from NIKL's `가버치`; this is not a claim that the port is normatively correct.


## Source-adjudicated surface regression — 2026-10-21

See [surface regression source adjudication](audits/SURFACE-REGRESSION-SOURCE-ADJUDICATION-2026-10-21.md). The 18-case fixture now keeps the pinned JS-port expected output separate from the NIKL normative comparator. Eleven cases have direct NIKL example/Q&A support; seven are rule-derived candidates and remain explicitly unadjudicated. All 18 IPA gold values remain pending independent review.

The public UI now identifies exact NIKL-backed surface corrections and still warns that other practical-mode outputs may differ from NIKL. These corrections cover only five listed lexical forms; they are not proof that the entire port is normatively correct.
