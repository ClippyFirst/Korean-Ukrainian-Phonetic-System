# NIKL master passage engine run — 2026-10-22

## Scope

Added an integrated Korean stress passage for the National Institute of Korean Language (국립국어원) *표준 발음법* articles 1–30 and a browser-engine harness at:

- `tests/fixtures/nikl-all-articles-master-passage-2026-10-22.txt`
- `tests/nikl-master-passage-engine-regression.test.mjs`

The harness runs both the unique Hangul tokens and the full passage through `createEngine`, in strict and practical modes. It verifies every token that already has a lexical record against the stored surface form, IPA, and IPA-derived Ukrainian target. It logs a reproducible JSON coverage report rather than inventing pronunciations for unknown morphology.

## Latest observed CI result

Commit: `5597815cb3e35c99eb8b27e564ab4e1a007caa06`  
Branch: `research/nikl-corpus-engine-regression-2026-10-22`  
Pull request: #247 (draft)

From GitHub Actions run for the browser job:

- Corpus length: 5,230 Unicode characters.
- Unique Hangul tokens: 855.
- Exact lexical rows exercised: 329.
- Generic-engine tokens resolved without an issue: 526.
- Unresolved unique tokens: 0.
- Per-token engine issues: 0.
- Full-text strict mode: 9,547 Ukrainian output characters, 12,140 IPA characters, 0 unresolved placeholders.
- Full-text practical mode: 9,547 Ukrainian output characters, 12,140 IPA characters, 0 unresolved placeholders.
- Full-text diagnostics: 23 expected warnings for standalone compatibility Jamo listed as inventory items; 0 other actionable issues.
- Browser test suite: 1,165 passed, 0 failed.
- Vite production build: passed.
- Python regression/data-integrity jobs (Python 3.11, 3.12, 3.13): passed.
- Master-table and research-corpus generation workflow: passed.

The standalone-Jamo warnings are expected because isolated compatibility Jamo are not syllables and do not independently determine a word-level IPA sequence. They are retained in the passage to exercise the inventory coverage; the engine withholds IPA rather than pretending each isolated Jamo is a complete syllable.

## Corrections made after the first engine pass

The first report had 13 unresolved token forms. Inspection showed that several were malformed grammatical joins created by the prose, not evidence that a rule should be guessed:

- `짧은소리의` was changed to a correctly spaced phrase using `단음`.
- The list ending `없으니를` was separated from the following instruction.
- `없애다에서는`, `값에서는`, `밟으니와`, and `싫어도에서는` were rewritten to avoid accidental unlicensed morphology.
- `값있는` was spaced as `값 있는`.
- `히읗을의` was separated into a standalone Jamo-name example.
- `벼훑이를` and `밭이와` were changed to punctuation-separated examples so the corpus tests the forms rather than requiring an unprovided object-particle parse.
- `외곬에를` (an invalid particle sequence) was corrected to standalone `외곬`.
- The misleading wording that labelled several examples as “non-standard consonant assimilation” was corrected to ask for a distinction among nasal assimilation, liquid assimilation, and fortition.
- The corpus now distinguishes expected standalone-Jamo diagnostics from actionable full-text engine issues.

These edits deliberately avoid adding unsupported lexical pronunciations. The engine already has a fail-closed policy for morphology-sensitive forms: without exact evidence, a surface form must not be guessed.

## What this result proves — and does not prove

**Proved by this run:** the corpus can be processed end-to-end by the browser engine in both modes without unresolved placeholders; all 329 lexical hits in the corpus remain consistent with their stored records; the regression suite and build pass.

**Not proved by this run:** that every subparagraph, exception, and permitted variant in articles 1–30 is independently represented in this single passage; that every generic result among the 526 tokens is normatively correct; or that Ukrainian target spellings are official. Those claims require article/subparagraph-to-example mapping and independent NIKL evidence for each expected Korean surface form.

## Remaining acceptance work

1. Expand the coverage report from unique-token/lexicon accounting to a rule-by-rule list of the corpus spans for every article, subparagraph, exception, and permitted variant.
2. For generic tokens not covered by an exact lexical row, compare the actual engine surface and IPA with official NIKL examples and record only evidence-backed mismatches as regressions.
3. Keep morphology-ambiguous cases unresolved unless the morphology is explicitly licensed or a source-backed lexical entry is added.
4. Re-run `npm test`, `npm run build`, Python tests, data-integrity checks, and generated-page checks after each corrective batch.

## Status

The passage is now an executable regression fixture, and its current end-to-end engine run is clean under the above criteria. Full exhaustive normative coverage remains **PARTIAL** until the article/subparagraph matrix and generic-output adjudication are completed.
