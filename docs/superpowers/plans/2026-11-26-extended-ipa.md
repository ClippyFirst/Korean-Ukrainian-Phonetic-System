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

- [x] Define schema version 1.1 with phonemic/broad/narrow layers, variants, source spans, boundaries, rule traces, evidence, nullable speaker/prosody context, acoustic annotations and target-adapter state.
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

