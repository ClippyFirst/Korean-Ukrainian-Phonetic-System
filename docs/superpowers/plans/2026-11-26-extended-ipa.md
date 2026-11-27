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
