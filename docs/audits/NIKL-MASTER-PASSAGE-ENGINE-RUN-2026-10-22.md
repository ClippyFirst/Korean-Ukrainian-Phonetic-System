# NIKL master passage engine run — 2026-10-22

## Scope

Added an integrated Korean stress passage for the National Institute of Korean Language (국립국어원) *표준 발음법* articles 1–30 and a browser-engine harness at:

- `tests/fixtures/nikl-all-articles-master-passage-2026-10-22.txt`
- `tests/nikl-master-passage-engine-regression.test.mjs`

The harness runs both the unique Hangul tokens and the full passage through `createEngine`, in strict and practical modes. It verifies every token that already has a lexical record against the stored surface form, IPA, and IPA-derived Ukrainian target. It logs a reproducible JSON coverage report rather than inventing pronunciations for unknown morphology.

## Latest observed CI result

Commit: `c86a550e38bb5b959825cf222329d95486f7d588`  
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
- Browser test suite: 1,166 passed, 0 failed.
- Additional generic §19 regression oracles passed without lexical overrides: 침략 → 침냑, 강릉 → 강능, 막론 → 망논, 석류 → 성뉴, 협력 → 혐녁, 법리 → 범니, 국립 → 궁닙.
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

The passage is now an executable regression fixture, and its current end-to-end engine run is clean under the above criteria. The generic §19 examples are additionally checked against explicit expected Korean surface forms, so those seven outcomes are no longer counted as merely “generic resolved” cases. Full exhaustive normative coverage remains **PARTIAL** until the article/subparagraph matrix and generic-output adjudication are completed.

## Runtime IPA-first invariant audit — 2026-10-22

After the original corpus smoke run, added `tests/ipa-first-runtime-invariant.test.mjs` to test the actual runtime boundary rather than relying only on the stored CSV target columns.

### Exact-head evidence

- Tested commit: `b980dc498c57bc0502325b4cf5fd71318664b9dc`.
- [Browser/Python test workflow](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39839292113): **1,170 tests passed, 0 failed**; production build passed; Python 3.11, 3.12, and 3.13 passed.
- [System verification workflow](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39839292102): passed.
- [Master-table/research-corpus artifact workflow](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39839292149): passed.

### What the new runtime tests actually check

- All **855 unique Hangul tokens** in the integrated NIKL passage: recompute the Ukrainian target from the engine's *returned runtime IPA* using the exported IPA adapter, then compare exact output. **0 divergences**.
- All **630 Hangul-only lexical rows** in the curated inventory, including any runtime-exposed licensed alternate readings: adapt the runtime IPA independently and compare the exact target. **0 divergences**.
- Direct IPA contrast controls ensure the adapter reacts to IPA differences (e.g. `ka → ка`, `ɡa → ґа`, `tɕʰi → чі`) and refuses an unmapped symbol instead of guessing.
- Multiword alignment/whitespace and fail-closed behavior for unknown IPA are checked explicitly.
- The earlier stored-data audit still covers the full lexical CSV and alternate IPA/target rows; the new tests add a runtime-level check rather than replacing that audit.

### Interpretation

For the tested corpus and the entire Hangul-only lexical inventory, the runtime Ukrainian output is mechanically reproducible from the runtime IPA. This is direct evidence that those results use the IPA → Ukrainian boundary, not an independent Hangul-to-Ukrainian result path.

This result **does not prove that every generated Korean IPA form is normatively correct**. In particular, generic phonology still requires independent source-backed adjudication for every relevant article/subparagraph, exception, and permitted variant. Ukrainian spellings remain project adaptations, not prescriptions from NIKL. Full linguistic correctness and exhaustive normative coverage remain **PARTIAL**.


## Exact-user-text rerun and gap-register correction — 2026-10-22

The earlier section above describes the first, edited version of the stress passage and must not be used as evidence that the user's original passage was fully tested. The fixture was restored to the user's original intentionally awkward/ambiguous forms and rerun at commit `0fa20f2790f66b8b3e3b06a70b67bdc97e999ce4`. That exact-head CI run exposed 13 unresolved tokens, and the previous tests failed because they incorrectly required all 853 tokens to resolve. No pronunciation has been invented to silence these failures.

The corpus gate has now been changed to an explicit, finite gap register for these exact tokens: `짧은소리의`, `수많이는`, `없으니를`, `없애다에서는`, `값에서는`, `밟으니와`, `싫어도에서는`, `외곬에를`, `값있는에서는`, `히읗을의`, `벼훑이를`, `밭이와`, and `붙임`. The regression must fail if any new unresolved token appears, if any registered item unexpectedly resolves without review, or if any token-level diagnostic appears outside this list. The IPA-first invariant checks that all resolved tokens/variants reproduce exactly from their runtime IPA and reports the unresolved list separately.

The 13 items are not claimed to be correct Korean lexical forms or normatively licensed pronunciations. They are ambiguous/structurally malformed contexts embedded in a stress-test instruction. The engine must not fabricate a morphology parse merely to achieve a green test. The current whole-text strict mode also surfaces these diagnostics; practical mode's heuristic output is not promoted to normative status. Any target emitted alongside an `unresolved` status is not considered an accepted transcription for that item.

### Corrected acceptance status

- **PASS only when CI confirms:** full suite, runtime IPA parity for resolved items, exact expected unresolved-token set, production build, Python matrix, system verification, and generated-artifact workflow.
- **Known gaps:** the 13 registered contexts require the corpus to be split into grammatical minimal examples or supplied with explicit, evidence-backed morphological analyses before they can be used as normative pronunciation tests.
- **Not established:** byte-for-byte identity between this reconstructed repository fixture and the original chat message, exhaustive rule/subparagraph coverage, or normative correctness of all generic IPA outputs. Those require independent source-to-fixture comparison and NIKL evidence.
- **Release status:** research preview / partial prototype; not release-ready as a fully normative standard-pronunciation transcriber.


## Final-head verification after fixture wording restoration — 2026-10-22

Final code/test/fixture head: `34dc21fb521cc03933f091c89da14473bbd02a66` on `research/nikl-corpus-engine-regression-2026-10-22`, PR #247 (draft).

- [Browser tests/build/Python matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842388316): **1,170 tests passed, 0 failed**; Vite production build passed; Python 3.11, 3.12, and 3.13 passed.
- [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842380731): passed, including Python regression/data integrity, browser tests/build, and metadata-only NIKL source inventory.
- [Generated master-table/research-corpus artifact job](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842388501): `generate-corpus` job passed. The workflow run's final overall conclusion had not yet updated at the time of this note.
- Restored two additional wording details identified during comparison: `별도의 규정을 확인하시오` and `꽃밭을 검증하시오`.
- Runtime gate expects exactly 13 unresolved contexts and fails on any additional or missing unresolved token; all resolved-token IPA→Ukrainian parity checks pass. This does not mean the 13 contexts are linguistically solved.
- Source-text byte-for-byte equivalence is still not proven. Remaining acceptance work: exact source comparison; split/annotate the 13 contexts without guessing; complete article/subparagraph/exception/variant mapping and source-backed generic-IPA adjudication.

**Final classification:** implementation/test harness = DONE_VERIFIED for the declared contract; 13 contexts = PARTIAL/evidence-limited; exhaustive standard coverage = PARTIAL; release readiness = NO.
