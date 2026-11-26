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

- [x] Define schema version 1.0 with phonemic/broad/narrow layers, variants, source spans, boundaries, rule traces, evidence and target-adapter state.
- [x] Add dependency-free Python and browser validators.
- [ ] Run JSON Schema validation and cross-runtime fixture tests on the exact PR head.

### Task 2: Python three-layer result

**Files:** src/korean_ukrainian/pipeline.py; src/korean_ukrainian/ipa.py; src/korean_ukrainian/ipa_profiles.py; tests/test_ipa_profile_contract.py; tests/test_narrow_ipa.py.

- [x] Preserve untouched underlying syllables before ordered surface rules.
- [x] Add phonemic, broad and narrow layer payloads without changing the legacy ipa field.
- [x] Version the narrow profile as v6 and remove unsupported categorical post-sonorant [ɦ].
- [ ] Verify Python 3.11/3.12/3.13, wheel install and all pipeline/data tests on exact head.

### Task 3: Browser research adapter

**Files:** src/app/extended_ipa.js; tests/extended-ipa-profile.test.mjs.

- [x] Build typed browser result from the current engine trace.
- [x] Preserve source spans, boundaries, narrow rule IDs, environments and evidence refs.
- [x] Withhold the whole narrow IPA string when the engine marks the source unresolved.
- [x] Mark the phonemic browser layer unavailable rather than inventing an underlying form.
- [ ] Establish exact Python/browser parity and document intentional gaps.

### Task 4: Kozak Kim UI

**Files:** index.html; src/main.js; src/styles/main.css; browser regression tests.

- [x] Add an opt-in Extended IPA toggle within Kozak Kim research mode.
- [x] Display separate phonemic, broad and narrow panels, variants and trace details.
- [x] State that the current Ukrainian output is unchanged and narrow IPA is not target-compatible.
- [ ] Verify responsive browser rendering, accessibility, keyboard operation and toggle re-rendering.

### Task 5: Evidence and source rights

**Files:** docs/EXTENDED-IPA-EVIDENCE-REVIEW-2026-11-26.md; data/korean/sources.csv; research/SOURCE-REGISTER.csv; src/korean_ukrainian/ipa.py; tests/test_narrow_ipa.py.

- [x] Register new peer-reviewed sources and corpus rights metadata.
- [x] Review four full-text phonetics studies and additional source abstracts/metadata.
- [x] Correct the unsupported deterministic [ɦ] mapping.
- [ ] Obtain independent Korean phonetic adjudication for [ɲ], sibilant coarticulation, /h/, [ɸ], [ɭ], ㅢ and prosodic conditioning.
- [ ] Obtain an approved rights path for any corpus audio/label use.

### Task 6: Benchmark and release gates

**Files:** benchmark scripts, pinned fixtures, docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md, research/ACCEPTANCE-GATES.md.

- [ ] Add same-occurrence, source-separated and speaker-separated evaluation for the Extended IPA profile.
- [ ] Report profile-level coverage, abstention, exact match, CER/PER, per-condition errors and paired deltas.
- [ ] Keep independent adjudicated gold separate from engine agreement and teacher outputs.
- [ ] Run full exact-head CI, build, generated-artifact checks and rendered review.
- [ ] Keep the feature marked research preview until independent phonetic and target review gates pass.

## Execution notes

The implementation is being carried out inline on a dedicated GitHub branch because this environment has no local Git worktree/runtime. GitHub Actions is the available executable verification environment. This limits local red/green iteration; CI output must be read in full and no test pass is claimed before exact-head workflows finish.
