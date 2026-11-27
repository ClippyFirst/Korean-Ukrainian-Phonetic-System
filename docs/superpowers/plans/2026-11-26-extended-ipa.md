# Kozak Kim Extended IPA Implementation Plan

> **For agentic workers:** use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** deliver an evidence-grounded Extended IPA research mode for Kozak Kim, separate from morphology coverage and benchmark optimization.

**Architecture:** a versioned typed result contract connects Python and browser runtimes. Python reuses the existing narrow profile; browser support is an explicitly partial research adapter until parity is verified. Ukrainian target adaptation remains a separate fail-closed stage.

**Tech Stack:** Python, browser JavaScript ES modules, JSON Schema, pytest, Node test runner, GitHub Actions.

**Spec:** docs/superpowers/specs/2026-11-26-extended-ipa-design.md and Issue #508.

## Global Constraints

- Preserve the existing broad default, g2pK practical path and Strict / Soft / Super-soft coverage modes.
- IPA remains the only input to Ukrainian target adaptation.
- Unadjudicated or unmapped IPA must not be silently flattened into Ukrainian text.
- No network inference, model downloads or telemetry in the browser runtime.
- Do not add corpus audio or restricted labels to the repository.
- Benchmark labels are not gold unless independently adjudicated.
- Profile and schema versions must change whenever output semantics change.

## Review Focus

- Mixed text with spaces, punctuation, emoji and repeated Hangul spans must retain code-point source alignment.
- Unresolved morphology must not leak partial IPA from resolved syllables.
- A word boundary or punctuation must block same-word narrow allophones.
- A variant must not be presented as a universal speaker-independent result.
- A valid narrow IPA result must not bypass the target-adapter allowlist.

---

### Task 1: Typed result contract

**Files:** schemas/ipa-profile-result.schema.json; src/korean_ukrainian/ipa_profiles.py; src/app/extended_ipa.js; tests/test_ipa_profile_contract.py; tests/extended-ipa-profile.test.mjs.

- [x] Define schema version 1.2 with phonemic/broad/narrow layers, variants, source spans, boundaries, rule traces, evidence, nullable speaker/prosody context, acoustic annotations and target-adapter state.
- [x] Add dependency-free Python and browser validators.
- [x] Run JSON Schema validation and Python/browser contract fixtures on exact head d19c5686ef8031cdcbfc2be10e1a0fe0c30ee33e (Tests 45893570996; Verify 45893570785).

### Task 2: Python three-layer result

**Files:** src/korean_ukrainian/pipeline.py; src/korean_ukrainian/ipa.py; src/korean_ukrainian/ipa_profiles.py; tests/test_ipa_profile_contract.py; tests/test_narrow_ipa.py.

- [x] Preserve untouched underlying syllables before ordered surface rules.
- [x] Add phonemic, broad and narrow layer payloads without changing the legacy ipa field.
- [x] Version the narrow profile as v6 and remove unsupported categorical post-sonorant [ɦ].
- [x] Verify Python 3.11/3.12/3.13, wheel install, web tests and pipeline/data integrity on exact head d19c5686ef8031cdcbfc2be10e1a0fe0c30ee33e (Tests 45893570996; Verify 45893570785).

### Task 3: Browser research adapter

**Files:** src/app/extended_ipa.js; tests/extended-ipa-profile.test.mjs.

- [x] Build typed browser result from the current engine trace.
- [x] Preserve source spans, boundaries, narrow rule IDs, environments and evidence refs.
- [x] Withhold the whole narrow IPA string when the engine marks the source unresolved.
- [x] Replace the super-soft fallback with a dedicated browser underlying phonemic adapter for onset, nucleus and coda inventory; preserve complex codas, exact lexical length and unsupported-input abstention.
- [x] Connect the adapter to the Extended IPA panel and expose layer-specific trace provenance.
- [ ] Exhaustively verify Python/browser phonemic parity over the frozen Hangul inventory and source fixtures; reconcile the known broad-layer discrepancy without benchmark-driven overfitting.

### Task 4: Kozak Kim UI

**Files:** index.html; src/main.js; src/styles/main.css; browser regression tests.

- [x] Add an opt-in Extended IPA toggle within Kozak Kim research mode.
- [x] Display separate phonemic, broad and narrow panels, variants and trace details.
- [x] State that the current Ukrainian output is unchanged and narrow IPA is not target-compatible.
- [x] Verify opt-in UI rendering and responsive desktop/tablet/mobile review (Editorial review 45893570937).\n- [ ] Complete manual keyboard-only, screen-reader and zoom accessibility review.

### Task 5: Evidence and source rights

**Files:** docs/EXTENDED-IPA-EVIDENCE-REVIEW-2026-11-26.md; data/korean/sources.csv; research/SOURCE-REGISTER.csv; src/korean_ukrainian/ipa.py; tests/test_narrow_ipa.py.

- [x] Register new peer-reviewed sources and corpus rights metadata.
- [x] Review four full-text phonetics studies and additional source abstracts/metadata.
- [x] Correct the unsupported deterministic [ɦ] mapping.
- [ ] Obtain independent Korean phonetic adjudication for [ɲ], sibilant coarticulation, /h/, [ɸ], [ɭ], ㅢ and prosodic conditioning.
- [ ] Obtain an approved rights path for any corpus audio/label use.

### Task 6: Benchmark and release gates

**Files:** benchmark scripts, pinned fixtures, docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md, research/ACCEPTANCE-GATES.md.

- [x] Add and execute same-occurrence Standard-vs-Extended diagnostic for UGTPHON and SIGMORPHON; inspect artifact 15153601014.\n- [ ] Add source-separated and speaker-separated evaluation against independently adjudicated, layer-aligned gold.
- [x] Report coverage, abstention, exact match, CER and paired Standard-vs-Extended equality in the diagnostic artifact.\n- [ ] Report phonemic/narrow accuracy and per-condition errors only after independent layer-aligned gold exists.
- [ ] Keep independent adjudicated gold separate from engine agreement and teacher outputs.
- [x] Run exact-head CI, build, generated-artifact checks and rendered review on d19c5686ef8031cdcbfc2be10e1a0fe0c30ee33e; see runs 45893570996, 45893570785, 45893570769, 45893570937, 45893570751 and 45893570737.
- [ ] Keep the feature marked research preview until independent phonetic and target review gates pass.

## Execution notes

The implementation is being carried out inline on a dedicated GitHub branch because this environment has no local Git worktree/runtime. GitHub Actions is the available executable verification environment. This limits local red/green iteration; CI output must be read in full and no test pass is claimed before exact-head workflows finish.


### Task 1 extension: speaker/prosody and acoustic annotation

- [x] Add nullable speaker, dialect, age, style, speech-rate, focus, prosodic-position and recording-condition fields.
- [x] Add separate acoustic annotation records for VOT, burst/closure duration, closure voicing, F0, voice quality, spectral centroid and formants.
- [x] Require source span, measurement method and evidence reference for measurements marked measured.
- [x] Add schema and Python/browser validator tests for text-only unknown context and measured provenance.
## Exact-head execution closeout — 2026-11-26

Verified branch head: d19c5686ef8031cdcbfc2be10e1a0fe0c30ee33e (PR #509; base main 97bb411df8b998b22cd58adda015fb941201950c).

- [x] Run exact-head JSON/schema and Python/browser contract tests through the full Tests and Verify workflows.
- [x] Verify Python 3.11/3.12/3.13, wheel installation, web tests, browser regression/build and Python data integrity.
- [x] Verify Browser G2P and responsive rendered review.
- [x] Run the multi-engine diagnostic and paired Standard-vs-Extended benchmark on identical UGTPHON/SIGMORPHON occurrences.
- [x] Download and inspect paired diagnostic artifact 15153601014.
- [ ] Exhaustively verify Python/browser phonemic parity over the frozen Hangul inventory and adversarial mixed-input/source-span fixtures.
- [ ] Obtain independent Korean phonetic adjudication for phonemic/broad/narrow layer conventions and context-conditioned variants.
- [ ] Establish rights-cleared acoustic annotation data and independent validation.
- [ ] Complete independent Ukrainian target-layer review and approve a profile-specific adapter mapping before any Extended profile is allowlisted.
- [ ] Complete manual keyboard, screen-reader and zoom acceptance.

### Final status

The implementation and exact-head software checks are verified, but the mode remains a research preview. The paired benchmark confirms that Extended broad is identical to Standard IPA by contract; phonemic and narrow scores are cross-layer agreement only, not accuracy. The Extended target adapter remains intentionally fail-closed because no profile is adjudicated target-compatible. No independent narrow gold, rights-cleared acoustic corpus pilot or Ukrainian target approval is present.
- [ ] Add a segment-level typed IPA model with Unicode-safe tokenization, feature bundles, segment-local source spans, structured length/diacritics and per-segment provenance; preserve raw layer strings and verify Python/Browser round-trip parity.



## Execution continuation — 2026-11-27 — typed segment-level Extended IPA

**Status: PARTIAL pending exact-head CI.** Branch: `feat/korean-extended-ipa-segment-ir-2026-11-27`; draft PR #510; base `main` at `97bb411df8b998b22cd58adda015fb941201950c`. The branch fast-forward-reuses PR #509's 131 commits without modifying PR #509.

- Added parallel standard-library Python and browser JavaScript segment parsers. They use Unicode code-point offsets, longest-match affricate inventory, base-segment feature bundles, attached aspiration/length/fortis/release/secondary-articulation/nasalization modifiers, and explicit boundary/unknown tokens. Unknown IPA code points are retained, never silently discarded.
- Each segment stores its IPA span, a source syllable span when a safe alignment exists, explicit `source_alignment: syllable-span` (not falsely precise phone alignment), and rule/evidence provenance from its layer trace.
- Python and browser Extended IPA layer payloads now include `segments` arrays while retaining the existing phonemic/broad/narrow IPA strings. Python pipeline now emits syllable-level broad and narrow trace entries so the segment parser can preserve provenance.
- Schema updated to require segment arrays and define segment, boundary and unknown token shapes.
- Narrow IPA symbols remain evidence-gated. In particular, `ɦ` is recognized by the segment inventory but is not emitted as a universal post-sonorant /h/ realization: Um (2014) reports shortening effects on the preceding sonorant even when /h/ is not acoustically manifested; this does not establish a categorical [ɦ] output.
- New Python/browser parser tests cover `sʰ`, `kʰ`, `ɦ`, `ɲ`, `ɭ`, `ɸ`, `ç`, `x`, atomic affricates, length, boundaries, unknown preservation, source alignment and provenance. Integration tests exercise the actual Extended IPA result builders.
- Verification is queued on exact head `d616be9ac2f4e016b386ca892d6a1e09b543a70d` (Tests run 45969848230; Verify run 45969848131; Browser G2P run 45969848170). These runs had not completed at the time of this entry. The test-only pre-implementation workflow attempt was superseded by PR concurrency before execution, so a local RED run was not observed; this environment has no local Git worktree/runtime.

### Task ledger

| Item | Status | Acceptance evidence |
|---|---|---|
| Python Unicode-safe IPA segment parser | PARTIAL | Source added; exact-head pytest pending |
| Browser Unicode-safe IPA segment parser | PARTIAL | Source added; exact-head node tests pending |
| Three-layer result integration and syllable spans | PARTIAL | Integration tests authored; Python/browser CI pending |
| Schema and runtime validation | PARTIAL | Schema v1.2 extended; schema/contract CI pending |
| Independent narrow IPA adjudication | BLOCKED | Requires independent Korean phonetic review and layer-aligned gold |
| Speaker/acoustic-conditioned [ɦ] selection | BLOCKED | Available Um (2014) abstract supports residual /h/ effects but not categorical [ɦ]; exact token-level evidence required |
| Ukrainian adapter changes | DEFERRED | Explicitly outside this phase; existing fail-closed profile boundary preserved |

Do not mark this increment DONE_VERIFIED until all exact-head Python, browser, schema, wheel and build checks have completed and their output has been inspected.


**Schema compatibility note — 2026-11-27:** the new required per-layer segment arrays change the public result contract, so the Extended IPA schema is versioned to 1.2 in Python, browser JS and JSON Schema. This is not a phonetic profile-version bump; phonetic output semantics remain governed by the existing layer profile versions.


## Final continuation checkpoint — 2026-11-27

**Code checkpoint:** `d4b180209846d516a4aa402af0173e7ed1b9b55c` on `feat/korean-extended-ipa-segment-ir-2026-11-27`. Draft stacked implementation PR: #510. PR #509 remains open and unmodified; PR #510 reuses its exact head as an ancestor. Starting default-branch SHA: `97bb411df8b998b22cd58adda015fb941201950c`.

### Current task ledger

| Work item | Status | Evidence / acceptance |
|---|---|---|
| Existing three-layer phonemic/broad/narrow implementation | DONE_VERIFIED (prior PR #509) | Prior exact-head checks and diagnostics recorded above; do not infer phonetic accuracy from benchmark agreement |
| Python segment IR and feature inventory | PARTIAL | Implemented; exact-head tests queued |
| Browser segment IR and feature inventory | PARTIAL | Implemented; exact-head tests queued |
| Three-layer integration, source syllable alignment, provenance and separators | PARTIAL | Implemented; integration tests queued |
| Schema v1.2 and validators | PARTIAL | Python, JS and JSON Schema updated; exact-head contract checks queued |
| Full modern Hangul phonemic parity | PARTIAL | New 11,172-syllable cross-runtime test and Python exporter added; exact-head browser CI queued |
| Broad/narrow layer parity and independent narrow accuracy | BLOCKED | Requires layer-aligned independent Korean phonetic gold and expert adjudication; engine agreement is not gold |
| Manual keyboard/screen-reader/zoom acceptance | BLOCKED | Requires a human accessibility review; rendered layout review is not equivalent |
| Rights-cleared audio/acoustic annotation pilot | BLOCKED | No approved rights path and no licensed acoustic annotation dataset established |
| Ukrainian target adapter for Extended IPA | DEFERRED | Explicitly outside this implementation phase; fail-closed behavior remains |

### Exact-head verification state

At code checkpoint `d4b180209846d516a4aa402af0173e7ed1b9b55c`, GitHub Actions runs are queued: Tests `45971760971`, Verify `45971760717`, Browser G2P `45971760736`, Master/research artifacts `45971760731`. None is recorded as passed here. Earlier queued runs on superseded commits are not acceptance evidence.

A local clone was attempted and failed with DNS resolution for `github.com`; therefore no local pytest, Node, schema, wheel or build command was executed. The test-first files were committed before the implementation files, but the pre-implementation GitHub run was superseded while queued, so a RED failure was not observed. Do not describe this as a verified RED→GREEN cycle.

### Implementation detail / rulings

- Segment source alignment is deliberately marked `syllable-span`, not phone-level. We do not invent phone-to-grapheme alignment without a separately adjudicated alignment.
- Unknown IPA code points are retained as typed unknown tokens, with source/provenance when available; incomplete trace coverage falls back to parsing the complete IPA string rather than silently dropping phones.
- Segment identifiers are unique within each layer. Word/syllable separators are retained as boundary tokens and in the existing source-boundary list.
- `ɦ` is supported by the feature inventory but is not emitted as a universal post-sonorant /h/ realization. Current evidence does not establish a categorical [ɦ] mapping; keep that context unresolved.
- Schema version is 1.2 because required segment arrays change the result contract. Phonetic profile versions are unchanged.
- No Ukrainian adapter changes were made.


## 2026-11-27 implementation checkpoint (updated)

**Code checkpoint:** `a65c2857496051b077dc09b0427c479b31a11f09` on `feat/korean-extended-ipa-segment-ir-2026-11-27`; draft PR #510 currently targets `main` to run the repository's pull-request CI. PR #509 remains open and untouched; its head is an ancestor of this branch. PRs #505, #506 and #507 remain untouched. Starting default-branch SHA: `97bb411df8b998b22cd58adda015fb941201950c`.

### Implemented in this continuation

- Python and browser segment parsers now share a Unicode-code-point contract: longest-match affricates (with/without tie bar), consonant/vowel core feature bundles, aspiration, length, fortisness, unreleased release, secondary articulation and nasalization.
- Consonant-only features are explicitly `not-applicable` on vowels.
- Each segment carries a base, modifiers, feature bundle, IPA span, honest syllable-level source span/alignment, and rule/evidence provenance. Phone-level source alignment is not claimed.
- Word/syllable/punctuation boundaries are retained as tokens. Unrecognized code points are retained as `unknown` with source/provenance when available.
- Layer token IDs are unique. Segment trace coverage is checked against the complete layer string; if trace coverage is incomplete, the implementation falls back to full-string parsing rather than dropping tokens or misattributing spans.
- Python and browser builders expose segment arrays for phonemic, broad and narrow layers; existing IPA strings remain unchanged. Schema and dependency-free validators are version 1.2 and check token structure, offsets, source spans, ordering and unique IDs.
- Narrow output tests exercise actual generated `kʰ`, `sʰ`, `ɲ`, `ɭ`, `ɸ`, `ç`, and `x`. `ɦ` is represented in the segment inventory but is not emitted categorically after sonorants; the cited Korean evidence does not justify a universal [ɦ] output.
- Added exhaustive cross-runtime phonemic parity test across all 11,172 modern precomposed Hangul syllables. This compares implementation parity only, not phonetic accuracy.

### Task ledger

| Work item | Status | Acceptance criterion |
|---|---|---|
| Existing phonemic/broad/narrow result contract and narrow v6 profile | DONE_VERIFIED (PR #509) | Prior exact-head checks/diagnostics recorded above; benchmark agreement is not phonetic gold |
| Python segment IR/parser and validator | PARTIAL | Exact-head pytest and schema tests pass |
| Browser segment IR/parser and validator | PARTIAL | Exact-head Node tests and build pass |
| Segment arrays for all three layers, boundaries, spans and provenance | PARTIAL | Python/browser integration tests and parity checks pass |
| Schema v1.2 contract | PARTIAL | JSON Schema and dependency-free validators pass |
| 11,172-syllable Python/browser phonemic parity | PARTIAL | New full-inventory Node test passes without mismatches |
| Broad/narrow phonetic accuracy and independent adjudication | BLOCKED | Requires independent Korean phonetic gold and qualified review |
| Manual keyboard/screen-reader/zoom acceptance | BLOCKED | Human accessibility review required |
| Rights-cleared audio/acoustic annotation pilot | BLOCKED | No approved rights path or licensed acoustic labels |
| Extended IPA → Ukrainian adapter | DEFERRED | Explicitly out of scope; existing fail-closed behavior preserved |

### Verification state

For exact code head `a65c2857496051b077dc09b0427c479b31a11f09`, GitHub Actions are queued: Tests `45972473238`, Verify `45972473054`, Browser G2P `45972473135`, Master/research artifacts `45972472985`. The workflow jobs have not started; none is recorded as passed. Earlier runs on superseded commits are not acceptance evidence.

A local clone was attempted and failed because this environment could not resolve `github.com`. No local pytest, Node, JSON Schema, wheel or build command was executed. Test-first files were committed before their implementation, but the pre-implementation workflow was superseded while queued; a RED failure was not observed. Do not claim a completed RED→GREEN cycle.

### Next genuine blocker

Read the exact-head CI results, fix any failures and rerun. After checks pass, retarget PR #510 to PR #509's branch for a clean stacked diff. Independent narrow adjudication, licensed acoustic data and human accessibility review remain external/evidence-limited gates; do not manufacture phonetic rules or benchmark gold to clear them.


## Current continuation status — 2026-11-27 — PR #510

This section supersedes earlier segment-IR TODO statements below it. Historical notes above remain as an audit trail.

- **PARTIAL — implementation committed, exact-head verification pending:** Python and browser segment parsers, three-layer segment integration, schema v1.2, runtime validators, parser/integration tests, and exhaustive 11,172-Hangul phonemic parity test are present on `ca00add3aee5ffa46bf2eff9201b94c996aaef11`.
- **PARTIAL — CI not yet executed:** exact-head Tests run `45972689269`, Verify `45972689301`, Browser G2P `45972689642`, and master/research artifacts `45972689334` remain queued. A queued job is not a pass. Local clone/test execution remains unavailable because the runtime could not resolve github.com.
- **DONE implementation / pending verification:** schema contract is v1.2 on this branch. Earlier references to v1.1 describe PR #509's prior contract and are not the current schema version.
- **DONE implementation / evidence boundary:** IPA offsets are Unicode code-point offsets; source alignment is explicitly syllable-level, not phone-level. Unknown code points are retained. [ɦ] is representable in the inventory but is not a categorical Korean post-sonorant /h/ output.
- **PR topology:** PR #510 is now correctly stacked on PR #509's branch. Compare reports 65 commits ahead, 0 behind, 16 changed files. PR #509 remains open and untouched.
- **Still BLOCKED:** independent Korean phonetic adjudication and layer-aligned narrow gold; rights-cleared acoustic corpus/labels; human keyboard/screen-reader/zoom acceptance; independent Ukrainian target review. Ukrainian adapter remains deferred and fail-closed.

Acceptance before marking segment IR DONE_VERIFIED: all exact-head Tests, Verify, Browser G2P and artifact-generation workflows pass; inspect their logs/artifacts; confirm all 11,172 phonemic parity cases and parser/integration fixtures pass. Do not infer linguistic validity from software CI.


### Test-oracle correction — 2026-11-27

A source-level review found two new parser tests treating ASCII `?` as an unknown phone even though both runtimes intentionally classify Unicode punctuation as boundary tokens. Corrected the fixtures to use the non-punctuation unknown code point `😀`, preserving the separate punctuation-boundary tests. This is a test-only correction; no production parser behavior changed. The corrected tests have not yet been executed locally (GitHub DNS failure) or confirmed by CI; keep the gate PARTIAL until exact-head workflows pass.


A second test-oracle defect was found during review: the browser test destructured the third token as the unknown token even though the fixture contains a later segment and word boundary before the unknown emoji. It now selects tokens by their explicit `kind`. This correction is test-only and awaits exact-head CI.


### PR/CI topology update — 2026-11-27

PR #510 currently targets `main` temporarily so the repository's mainline pull-request verification workflows can run. The incremental implementation itself remains a clean stack on PR #509: comparing #509's head `6b473a18e3f4e7f971398272ff0ef0e7f1be6abe` to this branch gives 73 commits ahead, 0 behind, and 16 changed files. Once exact-head CI has completed and its logs/artifacts have been inspected, retarget PR #510 to PR #509's branch to restore the compact stacked diff. Current branch head at this note: `a0498f51a0d185be6a9d4271e352b187712ecba9`.


## Exact-head verification update — 2026-11-27 10:12 UTC

Current PR #510 head: `a7116388d9c6ed592f4a1a94ea77436b16994737` on `feat/korean-extended-ipa-segment-ir-2026-11-27`. The preceding head `08feed20a54187ebc1c35f211801e9c7e5c85632` had one failing browser fixture: ASCII `?` was expected to be `unknown`, but punctuation is correctly tokenized as `boundary`. Replaced that fixture with `😀`; production code was not changed.

### Exact-head results

| Gate | Status | Evidence |
|---|---|---|
| Python tests, Python 3.11 / 3.12 / 3.13 | DONE_VERIFIED | Tests workflow `45979820107`, all three matrix jobs successful |
| Python regression and data integrity | DONE_VERIFIED | Verify workflow `45979820187`, Python job successful |
| JavaScript suite | DONE_VERIFIED | Tests workflow web job: 1,497 passed, 0 failed |
| Browser G2P suite | DONE_VERIFIED | Browser G2P workflow `45979819931`: 1,497 passed, 0 failed |
| Browser regression and production build | DONE_VERIFIED | Verify workflow `45979820187`: 1,497 passed, 0 failed; Vite build completed |
| Python/browser phonemic parity over 11,172 modern Hangul syllables | DONE_VERIFIED | Node test #135 passed; exporter and browser adapter matched every item |
| Segment IR fixtures, provenance, offsets and layer integration | DONE_VERIFIED | Node tests #150–158 passed, including the corrected unknown-codepoint fixture |
| Clean wheel install | DONE_VERIFIED | Tests workflow wheel-install job successful |
| Teacher corpus split audit | DONE_VERIFIED | Tests workflow and dedicated audit successful |
| Browser visual review | DONE_VERIFIED | Desktop/tablet/mobile editorial review successful |
| Morphology adapter smoke (Kiwi and MeCab-Ko) | DONE_VERIFIED | All real-engine and native strict/soft jobs successful |
| Rule-license consensus, external UGTPHON comparison, corpus artifacts and test-register extraction | DONE_VERIFIED | Runs `45979819855`, `45979819908`, `45979820161`, `45979819995`, `45979820101` successful |
| Multi-engine IPA benchmark | PARTIAL | Current-head run `45979819893` pending behind earlier run `45973857624`; do not infer a current-head benchmark result |
| CharsiuG2P and ByT5 inference | DEFERRED / SKIPPED | Optional jobs skipped by workflow policy; not a pass |
| Independent narrow/broad phonetic adjudication and rights-cleared audio review | BLOCKED | Requires qualified independent reviewers and approved audio/data rights |
| Human keyboard/screen-reader/zoom acceptance | TODO | Automated viewport review is not a substitute for human accessibility acceptance |
| Extended IPA → Ukrainian adapter | DEFERRED | Outside this implementation increment; existing fail-closed adapter preserved |

### Diagnostic findings (not normative accuracy)

- Previous pinned diagnostic on superseded code head `08feed20`: native engine scored 2,702/2,703 UGTPHON occurrences, exact match 52.7387%, CER 9.0130%; g2pk scored 2,703, exact match 53.0892%, CER 9.2328%. On paired cases, g2pk exact-match delta was +0.3701 percentage points but CER worsened by 0.2207 percentage points. This is a trade-off, not a winner or a release accuracy claim.
- Morphology-consensus diagnostic on the same superseded head: exact-match remained 52.7192%; CER worsened from 9.0130% to 9.0303%. It did not demonstrate a gain.
- UGTPHON normalization diagnostic: 2,627 paired tokens; exact match 51.2752% vs raw baseline 51.0468%, CER 9.8637% vs 9.9689%; 15 tokens rescued, 0 lost. Small diagnostic improvement only.
- Python g2pk differential warning: 18/20 surface forms equal. Two JS-port mismatches remain: `넓죽하다` (raw JS `널쭈카다` vs Python/practical adapter `넙쭈카다`) and `읽고` (raw JS `익꼬` vs Python/practical adapter `일꼬`). IPA gold is not independently adjudicated; track these as a separate browser-port discrepancy, not as evidence of IPA accuracy.
- The full adversarial NIKL passage audit still reports 13 morphology-sensitive unresolved forms. Strict whole-text rendering remains fail-closed; do not fill these gaps with guessed outputs.

### Next actions

1. Let the current-head multi-engine benchmark finish and inspect its artifacts, especially the paired standard-vs-Extended IPA report.
2. Update the task ledger again with exact benchmark outcome and any genuine failure.
3. Once all exact-head evidence is inspected, retarget PR #510 from `main` to PR #509's branch to restore the intended stack. Do not merge or release.
4. Keep scientific adjudication, audio rights, and human accessibility as explicit external blockers.


## UGTPHON paired comparison update — 2026-11-27 10:16 UTC

The exact-branch external UGTPHON comparison job `45980290133` completed successfully. It compares the deterministic browser Kozak-Kim engine with the untouched vendored g2pK JavaScript port on 2,702 paired Hangul tokens (275 rows; 264 sentence/utterance clusters; 2,000 cluster-bootstrap resamples).

- Kozak-Kim: 1,436 exact matches; exact-match rate 53.1458%; CER 8.0222%.
- g2pK: 1,444 exact matches; exact-match rate 53.4419%; CER 8.2125%.
- Paired exact-match delta (Kozak-Kim minus g2pK): −0.2961 percentage points; 95% cluster-bootstrap CI [−1.1473, +0.2369] pp, which crosses zero.
- Paired CER delta (Kozak-Kim minus g2pK): −0.1904 percentage points; 95% cluster-bootstrap CI [−0.3320, −0.0430] pp, favoring Kozak-Kim on this metric.
- 2,487/2,702 surfaces were identical; 215 differed. Both paths had zero engine errors.

Interpretation: exact-match rate slightly favors g2pK but the confidence interval includes no difference; CER favors Kozak-Kim on this particular test split. This is a diagnostic comparison against UGTPHON's references, not independent phonetic adjudication, not a Ukrainian target benchmark, and not proof of universal superiority. Do not collapse the two metrics into a single winner.

The paired native-engine/g2pK job `45980290331` also passed. It reports native exact-match 52.7387%, CER 9.0130%; g2pK exact-match 53.0892%, CER 9.2328%; paired exact delta +0.3701 pp for g2pK and CER delta +0.2207 pp against g2pK. This is a different native-vs-vendored comparison from the browser Kozak-Kim comparison above; keep the two protocols separate.

Current-head full multi-engine benchmark `45980290275` remains pending behind an earlier long-running benchmark `45973857624`. The current-head benchmark has not produced the paired standard-versus-Extended IPA report yet. The Charsiu inference queue remains skipped by workflow policy.


## Task-ledger reconciliation after exact code CI — 2026-11-27 10:18 UTC

Current PR #510 head is `61b8161fc5535eeab5d0bdd282be2e752e946874`. The implementation code and test fixture were verified on `a7116388d9c6ed592f4a1a94ea77436b16994737`; subsequent commits changed only the three status/handoff documents and PR metadata.

The previous PARTIAL labels for the technical segment-IR acceptance gates are superseded by this reconciliation:

| Work item | Reconciled status | Evidence |
|---|---|---|
| Python Unicode-aware segment parser and validator | DONE_VERIFIED | Python 3.11/3.12/3.13 test jobs passed; Verify Python regression/data-integrity passed |
| Browser JavaScript segment parser and validator | DONE_VERIFIED | Node 1,497/1,497 passed; Browser G2P 1,497/1,497 passed |
| Phonemic/broad/narrow segment arrays, spans, provenance, boundaries and unknown retention | DONE_VERIFIED | Node tests #150–158 and Python segment-IR tests passed |
| Schema v1.2 and runtime contract checks | DONE_VERIFIED | Python regression/data-integrity, browser regression and schema tests passed |
| Exhaustive 11,172-Hangul Python/browser phonemic parity | DONE_VERIFIED | Node test #135 passed; zero mismatches |
| Clean wheel install and production build | DONE_VERIFIED | wheel-install job and Vite production build successful |
| Current multi-engine benchmark and paired standard-vs-Extended IPA comparison | PARTIAL | Latest benchmark workflows pending/queued behind an older long-running job; no uplift claim |
| Independent broad/narrow phonetic validation | BLOCKED | No independent layer-aligned Korean phonetic gold/adjudication |
| Rights-cleared acoustic review | BLOCKED | No approved audio/data rights path |
| Human accessibility acceptance | TODO | Automated viewport checks passed; keyboard/screen-reader/zoom review remains |
| IPA-to-Ukrainian adapter changes | DEFERRED | Out of scope; current fail-closed adapter unchanged |

Core implementation acceptance is therefore technically verified, but the overall Extended IPA research workstream is not release-ready. The benchmark comparison is still pending, and linguistic/audio/accessibility evidence remains open. Do not infer accuracy improvement from parser coverage or cross-runtime parity.


## Paired Extended IPA artifact inspection and liquid-rule correction — 2026-11-27

Artifact `standard-vs-extended-ipa-ab-45973857624` (artifact 15188603961; code head `08feed20`) was downloaded and inspected directly. It is a pre-correction browser-engine diagnostic, and its dataset metadata explicitly says the references are not independently adjudicated for phonemic/narrow IPA.

- UGTPHON: standard/broad 52.7387% exact, CER 9.0130%; narrow 55.8845% exact, CER 7.2217%; phonemic 20.2073% exact, CER 23.4737%.
- SIGMORPHON: standard/broad 35.8717% exact, CER 14.5598%; narrow 39.6794% exact, CER 12.6912%; phonemic 12.9259% exact, CER 26.6742%.
- Standard IPA and Extended broad were identical by contract for all 2,703 UGTPHON and 999 SIGMORPHON occurrences. No broad-layer uplift exists.
- Narrow is a different layer, so its higher cross-layer string agreement is not a narrow-IPA accuracy result. The corpora do not provide independently adjudicated narrow-IPA gold.

The artifact exposed a concentrated error: [ɭ] occurred in 489 UGTPHON and 152 SIGMORPHON narrow predictions; it co-occurred with 284/288 UGTPHON exact-match losses and all 67 SIGMORPHON exact-match losses. Crosby & Dalola (2021), a 12-speaker Standard Korean study (CC BY 4.0; DOI 10.3765/plsa.v6i1.5002), found 99.3% intervocalic taps [ɾ] and associated retroflex lateral realizations primarily with pre-pausal and preconsonantal contexts. The old text-only onset rule was therefore overgeneralized and misattributed to Lee (1993).

**Correction committed in this increment:** narrow profile v7 removes automatic [ɭ] from intervocalic and front-vowel onset ㄹ; [ɾ] is retained in those contexts. The parser still represents [ɭ]. Normative ㄹ-coda + ㄹ-onset assimilation is preserved and now cites the NIKL standard rule separately. Source/evidence registries and narrow-profile version IDs are updated. Re-run the A/B benchmark on the corrected code before interpreting narrow metrics.

The artifact's narrow/phonemic figures are retained only as historical pre-correction cross-layer diagnostics. They are not current-head metrics and do not establish accuracy. The exact-head multi-engine workflow remains the next executable benchmark gate; independent layer-matched phonetic gold and audio review remain blocked by missing adjudication/rights.


## Evidence reconciliation — Korean liquid [ɾ] / [ɭ] — 2026-11-27

A primary-source recheck corrects the previous note that Lee (1993) did not support intervocalic [ɭ]. Lee (1993, p.31; DOI 10.1017/S0025100300004758) explicitly describes Seoul /l/ as [ɭ] intervocalically and before /i,j/. Crosby & Dalola (2021; DOI 10.3765/plsa.v6i1.5002), in a 12-speaker Standard Korean sample, found 422/425 intervocalic liquids were taps (99.3%) and retroflex laterals were strongly associated with pre-pausal and preconsonantal contexts. These are conflicting source descriptions, not grounds for a universal rule.

Narrow profile v7 now keeps [ɾ] as the primary intervocalic onset ㄹ result and exposes [ɭ] only as a separate unselected narrow-layer variant, with both citations and evidence status conflicting-source-descriptions-variant-only. The segment parser continues to recognize [ɭ]. The variant is not selected for a speaker without speaker/dialect/prosodic/audio context and is not passed to Ukrainian adaptation.

The pre-correction A/B artifact measured [ɭ] as primary; its [ɭ]-associated losses motivated this correction but its narrow metrics are not v7 metrics. A fresh v7 benchmark is required. Do not report the historical narrow score as a current uplift.


## Multi-engine benchmark results inspected — 2026-11-27

The prior multi-engine run 45973857624 completed successfully and its aggregate artifact 15190546061 was downloaded and inspected. It ran 1,000-item samples per track (eligible counts vary after exclusions). The broad engine code is unchanged by narrow-profile v7, so these are historical broad-profile diagnostics, not v7 narrow results.

Raw strict IPA comparison (exact match / CER):
- UGTPHON, 2,702 scored: ClippyFirst 52.7387% / 9.0130%; g2pk 53.0892% / 9.2328%; g2p-ko 52.4602% / 9.3928%. Native CER is lower than g2pk, while exact match is 0.35 pp lower; cluster-bootstrap intervals overlap.
- SIGMORPHON, 998 scored: ClippyFirst 35.9719% / 14.5347%; g2pk 35.3353% / 14.8222%; g2p-ko 35.6356% / 14.6970%. Native is modestly ahead on both metrics; intervals overlap.
- IPA-Dict Korean, 996 scored: ClippyFirst 41.2651% / 9.9335%; g2pk 41.1000% / 10.0412%; g2p-ko 40.9409% / 10.0154%. Small differences; this source is Wiktionary-derived and not independent of SIGMORPHON lineage.
- Seoul Corpus phonemic gold: ClippyFirst 14.8033% / 39.8430%; g2pk 15.7000% / 39.5789%. This is an underlying phonemic reference, not broad surface gold, so do not use it as a direct surface-G2P ranking.
- K-SPAN modern: ClippyFirst 10.8652% / 27.7790%; g2pk 10.9000% / 27.7325%. K-SPAN conservative: ClippyFirst 7.5529% / 27.4537%; g2pk 7.5000% / 27.4913%. These are effectively tied and the K-SPAN mapping carries a substantial independent-key/WorldBet integrity warning.

A lossy broad-candidate sensitivity normalization yields higher agreement (ClippyFirst vs g2pk: UGTPHON 86.23% vs 85.72%, SIGMORPHON 69.84% vs 68.67%, IPA-Dict 86.14% vs 85.70%). It collapses or removes meaningful contrasts (including [ɭ]→[l], [ɲ]→[n], h-like allophones, separators, selected diacritics and stress). These are sensitivity scores, not the engine's actual output or evidence of narrow accuracy.

Browser strict/soft policy: strict mode has 100% UGTPHON coverage, 99.9% SIGMORPHON, 99.4% K-SPAN modern, 99.3% K-SPAN conservative, and 99.6% IPA-Dict; it has zero engine errors and no heuristic or typed-fallback tokens. Soft mode raises conditional exact match on UGTPHON to 56.19% but drops coverage to 82.8%, reducing coverage-adjusted exact match to 46.54% (below strict 52.72%). Soft also lowers coverage-adjusted exact match on SIGMORPHON, K-SPAN and IPA-Dict. Super-soft coverage is only 0.3–2.0%, with negligible coverage-adjusted scores. Strict remains the preferred deterministic default; soft is not a net gain when abstentions are counted.

Data/evaluation caveats: UGTPHON is user-generated/noisy; SIGMORPHON and IPA-Dict conventions are not identical; IPA-Dict shares Wiktionary lineage; Seoul Corpus labels are phonemic; K-SPAN key-vs-WorldBet integrity reports 22,843 mismatches across 41,174 matched rows, chiefly systematic vowel-symbol differences, and its source WorldBet fields are used without overriding them from the key. No result measures Ukrainian adaptation quality.

The current v7 benchmark run 45983709835 is in progress. Its paired standard-vs-Extended IPA artifact is still required to evaluate the corrected primary [ɾ] plus optional [ɭ] variant. Do not carry forward the pre-correction v6 narrow metrics as v7 evidence.


### Feature-level comparison from the pre-correction A/B artifact

On the same reference split, the narrow layer's exact-match gains were concentrated in aspirated /s/ [sʰ] (243 UGTPHON and 67 SIGMORPHON gains), palatalized [ɕ] (82 and 14), palatal nasal [ɲ] (44 and 13), and [ç] (28 and 0). Examples include 가슴 (broad ka.sɯm → narrow ka.sʰɯm against gold ka̠sʰɯm), 그냥 (kɯ.njaŋ → kɯ.ɲjaŋ against kɯɲja̠ŋ), and 고시엔 (ko.si.en → ko.ɕʰi.en against ko̞ɕʰie̞n). These are useful signs that the allophonic rules can move outputs toward the corpus conventions, but they remain corpus-string diagnostics, not independently adjudicated narrow-IPA accuracy.

The dominant losses were not spread evenly across the profile: [ɭ] co-occurred with 284/288 UGTPHON and 67/67 SIGMORPHON exact losses, and with 382/388 and 116/117 distance-worsening cases. Example: 다리 had gold ta̠ɾi, standard ta.ɾi, but pre-correction narrow ta.ɭi. This motivated v7's [ɾ] primary + optional [ɭ] variant policy. The hypothesis is that v7 preserves the aspiration/palatalization gains while avoiding the overgeneralized [ɭ] losses; only the new v7 A/B artifact can confirm or reject that hypothesis.


## Standard vs Extended IPA paired benchmark — artifact inspection, 2026-11-27

Inspected the uploaded `standard-vs-extended-ipa-ab` artifact (workflow run `45973857624`, artifact `15188603961`; benchmark script `scripts/benchmark_extended_ipa_ab.mjs`; engine `Kozak Kim deterministic browser engine`; strict morphology). The benchmark uses the same source rows, token order, eligibility and gold strings for standard and Extended IPA passes. Reference layers are explicitly `reference-layer-not-independently-adjudicated-here`.

| Dataset | Layer | Exact match | CER | Coverage |
|---|---|---:|---:|---:|
| UGTPHON (2,703 occurrences; 2,702 scored) | Standard strict broad | 52.7387% | 9.0130% | 99.963% |
| UGTPHON | Extended broad | 52.7387% | 9.0130% | 99.963% |
| UGTPHON | Extended phonemic | 20.2073% | 23.4737% | 99.963% |
| UGTPHON | Extended narrow | 55.8845% | 7.2217% | 99.963% |
| SIGMORPHON (999 occurrences; 998 scored) | Standard strict broad | 35.8717% | 14.5598% | 99.900% |
| SIGMORPHON | Extended broad | 35.8717% | 14.5598% | 99.900% |
| SIGMORPHON | Extended phonemic | 12.9259% | 26.6742% | 99.900% |
| SIGMORPHON | Extended narrow | 39.6794% | 12.6912% | 99.900% |

### Interpretation and limits

- Standard broad and Extended broad are identical by contract: zero prediction differences and zero status differences on all 2,703 UGTPHON and 999 SIGMORPHON occurrences. This is expected because Extended broad wraps the existing strict broad output; the segment IR is a structured representation boundary, not a new G2P predictor. There is no measured broad accuracy uplift.
- Extended narrow has numerically higher exact match and lower CER against these stored references (+3.1458 pp exact / -1.7913 pp CER on UGTPHON; +3.8077 pp / -1.8686 pp on SIGMORPHON). However, neither corpus reference layer was independently adjudicated as narrow IPA in this benchmark. The report explicitly says narrow scores are cross-layer string agreement only, not narrow-IPA accuracy. Do not present these deltas as verified phonetic improvement.
- Extended phonemic scores poorly against these same broad/mixed references (UGTPHON 20.2073% exact, 23.4737% CER; SIGMORPHON 12.9259%, 26.6742%). The report says this comparison is meaningful only if the gold is phonemic and uses compatible inventory/segmentation. It is not a fair phonemic accuracy score.
- No benchmark here measures Ukrainian target transcription accuracy, rule accuracy, or the quality of an IPA-to-Ukrainian adapter.
- Therefore: technical Extended IPA IR is implemented and verified; standard-vs-Extended broad prediction accuracy is unchanged; narrow accuracy remains unproven pending layer-aligned independent gold.

The separate multi-engine artifact from the same run is aggregate-only and is not an A/B of Extended IPA. Its strict native results are UGTPHON 52.7387% exact / 9.0130% CER (2,702 scored of 2,703), SIGMORPHON 35.9719% / 14.5347% (998/999), and Seoul phoneme-tier 14.8033% / 39.8430% (966/1,000). The separate paired UGTPHON engine comparison reports native 52.7387% / 9.0130% vs g2pk 53.0892% / 9.2328% on 2,702 paired occurrences; g2pk gains +0.3701 pp exact but worsens CER by +0.2207 pp. These are diagnostic comparisons across engines, not Extended-IPA gains or adjudicated gold accuracy.

The A/B artifact was produced on implementation commit `08feed20a54187ebc1c35f211801e9c7e5c85632`; the subsequent `a7116388` change only corrected a test fixture (no production parser/IPA output change), and documentation-only commits followed. The current-head benchmark workflow was cancelled before producing its own artifact; this prior artifact remains the inspected diagnostic evidence, not an exact-current-head rerun.


## Extended Narrow coverage continuation — 2026-11-27 — profile v8

**Branch:** `feat/korean-narrow-phonetics-coverage-2026-11-27` (stacked on PR #510). **Base:** PR #510 head `e5d70f373c3603a9c573080eee0df7e19199f067`. **Scope:** research-grounded Narrow allophony; Standard/Broad and Ukrainian adaptation remain unchanged.

### Literature-to-runtime coverage map

| Phenomenon | Existing implementation | Narrow status / boundary |
|---|---|---|
| Three-way lenis/aspirated/fortis stop contrast | Underlying inventory and broad IPA; broad inter-sonorant voicing | No invented VOT/F0/voice-quality diacritics. 2020/2026 studies show prosodic-position, focus, age and vowel-conditioned cue reweighting; acoustic values require audio. |
| Lenis /s/ and sibilant coarticulation | Narrow [sʰ], restricted [ɕʰ] before ㅣ/ㅖ/ㅑ | Partial, context-scoped; no blanket palatalization of all /j/ vowels or fortis /s͈/. |
| Nasal palatalization | [ɲ] before selected /j/-initial nuclei | Research-only generalization; /i/ excluded; primary-source review still required. |
| /h/ allophony | [ç] before selected high-front/glide nuclei, [x] before ㅜ, [ɸ] in same-word intervocalic position | Source-scoped descriptions; post-sonorant weakening/deletion remains unresolved, not forced to [ɦ]. |
| Lenis stop voicing | Broad [b d ɡ dʑ] in the supported inter-sonorant contexts | Already represented; further phonetic gradience is not inferred without measurements. |
| Liquid tap/lateral and assimilation | [ɾ] singleton onset; [l] coda/geminate; normative ㄹ+ㄹ assimilation | Intervocalic [ɾ] remains primary; conflicting onset [ɭ] is unselected. |
| Coda lateral retroflexion | **New v8:** optional [ɭ] variants for word-final coda ㄹ and coda ㄹ before same-word ㅎ | Unselected sociophonetic alternatives based on Crosby (2024), with dialect/gender/age/style caveats; canonical [l] is unchanged. |
| Palatal lateral [ʎ], nasalized lateral, gradient liquid assimilation | Literature signals variation | TODO: primary-source and speaker-conditioned evidence review; no deterministic rule added. |
| Coda neutralization/release, nasalization, palatalization, aspiration, fortition, n-insertion, liaison, morphology and boundary interactions | Existing Standard/NIKL rule engine and adversarial cases | Broad phonological rules remain separate from Narrow phonetic detail; gradient rates are not collapsed into categorical outputs. |
| Vowel quality, ㅢ, diphthongs/glides and hiatus | Existing broad realizations and optional ㅢ/ㅚ/ㅟ/ㅖ/ㅐ variants | Narrow formant/coarticulation/reduction is incomplete; no speaker-specific vowel quality inferred from text. |
| Prosody, focus, phrase boundaries, speech rate | Nullable context fields and separate acoustic annotation contract | Text-only context stays null. F0, VOT, closure voicing, H1*-H2*, H1*-A1*, CPP and formants require measured audio and method provenance. |

### v8 implementation

- Added a source-backed, **unselected** coda [ɭ] variant when ㄹ is word-final or precedes same-word ㅎ. Evidence: Crosby (2024), 23 speakers across Central, Gyeongsangdo and Jeollado; word-final position OR 2.516 and pre-/h/ OR 3.056 versus geminate reference; substantial dialect/gender/age/style effects. The article only analyzes tokens classified as lateral, so it does not imply that every written coda ㄹ is realized as a lateral.
- Kept primary coda [l] and all Broad/Standard outputs unchanged. No speakerless probability or dialect guessing was added.
- Added source S038 to `data/korean/sources.csv` and `SRC-KOREAN-LIQUID-RETROFLEX-2024` to `research/SOURCE-REGISTER.csv`; no audio or corpus annotations were imported.
- Python and browser Extended IPA now use narrow profile v8; added tests for word-final and pre-/h/ candidates and a negative control for a non-triggering vowel-following context.

### Benchmark interpretation and open gates

- Historical paired A/B artifact run 45973857624: Standard Broad = Extended Broad by contract; Narrow cross-layer string agreement was 55.8845% exact / 7.2217% CER on UGTPHON and 39.6794% / 12.6912% on SIGMORPHON. These are **not narrow accuracy scores**: the stored references were not independently adjudicated as narrow IPA, and the artifact predates the v7 [ɾ]-primary correction and v8 coda variants.
- The 2024 coda [ɭ] variants do not alter primary IPA and are not expected to change Exact Match/CER. Their acceptance criterion is correct variant eligibility, provenance, and cross-runtime parity, not score uplift.
- TODO: exact-head CI and rerun paired v8 A/B; inspect per-feature additions/omissions and paired wins/losses. BLOCKED: independent layer-matched narrow IPA gold, rights-cleared audio, and qualified phonetic adjudication. A high score against Broad or mixed references cannot clear this gate.
- No F0/VOT/voice-quality realization, dialect choice, speaker choice, or phrase structure is guessed from text. No Ukrainian target adapter change.

**Readiness:** research prototype. Software verification is pending on this branch; no linguistic certification or narrow accuracy gain is claimed.


### Additional literature synthesis — 2026-11-27

The completed Undermind review returned 177 relevant papers (summary is abstract/metadata-level unless individually opened). Its central implementation recommendation is to separate normative categorical phonology from narrow phonetic realization and only emit narrow detail when supported by audio or a declared, validated speaker/prosody profile. Research workspace: [Korean phonetic phenomena review](https://app.undermind.ai/projects/de353992-202a-4b09-bf19-47932f80e426?path=%2Frepository-continuation%2FKorean%20phonetic%20phenomena%20implementation%20coverage%20and%20benchmark%20design%202026-11-27).

Newly registered sources:
- Schweizer, Ahn & Kwon (2026), DOI 10.1017/S002510032510087X: Seoul lenis/aspirated/fortis stop cues differ between IP-initial, AP-initial and word-medial positions. IP/AP-initial distinction uses burst duration and post-stop F0, with H1*-H2* also separating tense from non-tense; word-medial cues include closure duration and voicing during closure. This supports a prosody-aware acoustic annotation layer, not deterministic IPA changes from orthography.
- Jun (2021), DOI 10.5334/GJGL.1401: n-insertion is gradient, with morphology, etymology, component length, segmental environment and dialect interacting. Do not make a binary rule universal or select it from spelling alone.
- Lee (2023), DOI 10.17959/sppm.2023.29.2.193, and Chung (2022), DOI 10.18855/lisoko.2022.47.4.009: the /e–ɛ/ merger is age-, gender- and position-sensitive; phonemic identity and measured vowel target are not the same thing.
- Kang & Kong (2016), DOI 10.13064/KSSS.2016.8.4.039: /o/-raising and /u, ɨ/ fronting vary across speaker cohorts; do not substitute one assumed narrow vowel target for all Seoul speakers.

The review also flags: variable /h/-deletion with residual effects on the preceding sonorant; optional/gradient aspiration merger; lenition and inter-sonorant voicing; compound tensification; coronal place assimilation; liquid assimilation and non-categorical nasal–liquid outcomes; initial denasalization; vowel nasalization/coarticulation; /ɨi/ monophthongization and glide/hiatus behavior; reduction and speech-rate effects; focus and prosodic-boundary strengthening. These require separate rule/variant/acoustic evidence rather than a single global narrow transcription rule.

### Benchmark and corpus design corrections

- Seoul Corpus contains phrasal-word/utterance boundaries and phonemic labels; it is useful for prosody-aware segmentation and phonemic G2P checks, **not** a narrow-phone gold set. OpenSLR SLR113 declares CC BY-NC 2.0, but original upstream rights and derived-label redistribution still require review.
- KsponSpeech pronunciation transcripts are not equivalent to time-aligned narrow IPA. Do not relabel orthographic or pronunciation text as acoustic IPA gold.
- Separate four acceptance dimensions: (1) categorical standard-rule correctness on NIKL cases, (2) optional-variant coverage/provenance and abstention, (3) narrow acoustic accuracy on rights-cleared, independently annotated audio with inter-annotator agreement, and (4) runtime determinism/parity. Keep exact match, CER/PER, feature-weighted distance, coverage-adjusted score, and per-rule false-addition/omission counts separate.
- For stop contrast, evaluate IP/AP/word-medial separately and retain F0/VOT/closure/voice-quality measurements with Praat method, time window, source span and speaker metadata. For vowel and liquid allophones, stratify by dialect, age, gender, style, prosodic position and relevant preceding/following segments. A broad reference cannot certify a narrow output.
