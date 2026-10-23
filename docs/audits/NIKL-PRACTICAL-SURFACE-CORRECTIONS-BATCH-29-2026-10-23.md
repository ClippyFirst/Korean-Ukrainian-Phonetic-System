# NIKL-backed practical surface correction and source review — batch 29 (2026-10-23)

## Completed implementation

The practical browser adapter now corrects five exact surface forms where the pinned JavaScript g2pK output conflicts with an explicit official NIKL reading:

- 값어치 → 가버치 (NIKL FAQ mcfaq_seq=5949; §15 붙임)
- 넓죽하다 → 넙쭈카다 (NIKL §10 exception and §23; official Q&A qna_seq=307508)
- 넓둥글다 → 넙뚱글다 (NIKL §10 exception)
- 넓적하다 → 넙쩌카다 (official Q&A qna_seq=322805)
- 읽고 → 일꼬 (NIKL §§1 commentary, 11 and 23; official Q&A qna_seq=315279)

Implementation is an exact-form allowlist in `src/app/g2pk_web.js`. It corrects the Korean surface before `engine.convertSurface()`; the Ukrainian target is still generated from IPA. The vendored g2pK implementation itself is not edited, and the raw-port differential fixture continues to preserve its output.

## Source-register reconciliation

- Reclassified `SRC-NIKL-QNA-307508` as direct attestation for `넓죽하다[넙쭈카다]` only. The indexed second example's spelling differs from the repository's `넓둥글다`; that orthographic discrepancy is not erased.
- Added `SRC-NIKL-QNA-322805` for the exact official `넓적하다[넙쩌카다]` surface.
- Corrected the lexical `읽고` citation from a contextual rule-discussion to `SRC-NIKL-QNA-315279`, which directly lists `읽고[일꼬]`.
- The fixed intake queue remains 43/60 content-checked and 17 unreviewed (14 HTML + 3 PDFs). The new Q&A is registered as additional direct evidence, not counted as one of the fixed 60. Within the existing 43 checked items, one previous partial review is reclassified as direct for its exact first form only.

## Guardrails and tests

- The raw g2pK parity fixture still checks the upstream output, so the vendored dependency is not silently changed.
- The new `tests/g2pk-nikl-surface-corrections.test.mjs` checks the five exact surfaces, evidence registry presence, punctuation/offset preservation, no generalized correction for nearby forms, and IPA-to-Ukrainian recomputation.
- If the raw port ever changes string length, the correction layer skips offset-sensitive corrections instead of guessing.
- This exact allowlist is not a general solution for all Korean pronunciation. Other mismatches require their own direct evidence and regression.

## Evidence boundary and remaining work

Korean bracketed readings are not IPA. These sources establish the Korean surface strings, not the correctness of the project's broad IPA or Ukrainian approximation. The output is therefore more faithful to the cited normative readings for these exact words, but an independent IPA gold set and independent Ukrainian-target adjudication remain open. Item-level KOGL marks remain unverified. Direct live NIKL requests have returned HTTP 403 in CI; this report uses official indexed material and registered source provenance, and does not claim a successful live crawl.

## Status

- Implementation and tests: committed to the continuation branch; exact-head CI pending.
- Full normative coverage of *표준 발음법* articles, subparagraphs, exceptions and variants: PARTIAL.
- Independent IPA and Ukrainian gold sets: TODO / specialist adjudication required.
- Release status: research preview / partial prototype, not a fully validated normative transcriber.
