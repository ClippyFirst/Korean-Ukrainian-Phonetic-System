# Kozak Kim discrepancy follow-through — implementation plan

> **For agentic workers:** Execute task-by-task with test-first RED → GREEN verification. Keep the original g2pK baseline untouched.

**Goal:** Fix the evidence-backed Browser surface reconstruction gaps and restore the NIKL-attested long vowel in 대한민국 without changing general Korean phonology or the legacy Browser profile.

**Architecture:** Preserve the current Native/Browser pipeline and its shared Broad IPA profile. Repair only the Browser trace/surface contract where evidence shows a missing reconstruction, and update one exact lexical entry whose source is already registered as S017. No new adapter, abstraction, or general rule is introduced.

**Tech Stack:** Python 3.12, JavaScript/Node 22, existing pytest and node:test suites, GitHub Actions benchmark workflows.

**Spec:** `docs/KOZAK-KIM-DISCREPANCY-DRIVEN-IMPROVEMENT-2026-11-01.md`, `docs/superpowers/ledger.md`, and the current UGTPHON artifact `13143313187`.

## Global Constraints

- Scope is Kozak Kim only; original g2pK 0.9.4 source and vendor files remain unchanged.
- Do not add or generalize Korean phonological rules from benchmark-only observations.
- Keep strict IPA and Broad sensitivity metrics separate; Broad remains research-only and unadjudicated.
- Preserve uncertainty and abstention; unresolved morphology must remain unresolved and must not emit IPA/Ukrainian output.
- The default Browser legacy profile must remain behaviorally unchanged.
- Do not infer IPA quality or Ukrainian orthography from a Hangul-only dictionary transcription.
- Do not claim independent IPA gold, source reuse clearance, or Ukrainian target validation where those reviews have not occurred.

## Review Focus

- A partial or mixed Browser trace must not silently lose a Hangul surface syllable.
- An unresolved morphological token may expose only the deterministic coda neutralization already shared with Native; it must not become a resolved IPA result.
- Legacy Browser callers must retain their current surface contract.
- The 대한민국 lexical entry must preserve the exact dictionary length mark while keeping the project's /e/ vowel rendering explicitly project-derived, not source-supplied IPA.
- Benchmark occurrence identity, coverage, raw IPA and Broad normalization contracts must remain unchanged.

---

### Task 1: Reconstruct complete Browser surface from mixed trace entries

**Files:**
- Modify: `scripts/benchmark_kozak_kim_browser.mjs` — `fullSurfaceHangul()`
- Test: `tests/kozak-kim-ipa-first-benchmark.test.mjs`

**Hypothesis:** The six missing Browser surfaces in artifact 13143313187 arise when the trace contains a mixture of per-syllable surface values and unchanged source entries. Current reconstruction accepts either all per-syllable surfaces or no surfaces, and returns null for the mixed case.

- [ ] Add a regression test using the six recorded occurrences and their Native surface values:
  - `쌓아서 → 싸아서`
  - `쳐넣어야 → 쳐너어야`
  - `애새끼낳으면 → 애새끼나으면`
  - `좋아보인다고 → 조아보인다고`
  - `좋아해주는 → 조아해주는`
  - `좋은데 → 조은데`
- [ ] Run the focused Node test and inspect the expected RED failure, including the trace evidence for the first failing item.
- [ ] Make the smallest trace reconstruction change that preserves explicit surface values and uses the source syllable only where the trace deliberately has no surface override.
- [ ] Re-run the focused Node test and the full Browser suite.

### Task 2: Align deterministic coda surface in shared Broad profile for unresolved morphology

**Files:**
- Modify: `src/app/engine_convert.js` — final `surfaceParts` construction
- Test: `tests/kozak-kim-ipa-first-benchmark.test.mjs`

**Hypothesis:** Four Native/Browser surface differences in artifact 13143313187 occur because the Browser early unresolved-morphology branch copies the raw source syllable, bypassing the shared Broad profile's final-coda representative. Native already emits the deterministic coda representative while withholding IPA.

- [ ] Add regression cases:
  - `칡칡이 → 칙칙이`
  - `쫒아내면 → 쫃아내면`
  - `많앗구나유유유 → 만앋꾸나유유유`
  - `무서웟어 → 무서웓어`
- [ ] Assert that each shared-profile result remains pronunciation-unresolved with empty IPA and Ukrainian output.
- [ ] Assert the legacy Browser default remains unchanged.
- [ ] Run focused tests and inspect RED.
- [ ] In the shared Broad profile only, apply the existing coda representative when constructing the surface for unresolved units; do not clear the unresolved morphology flags or produce IPA.
- [ ] Re-run focused tests, full Browser suite, and exact occurrence-level Native/Browser parity audit.

### Task 3: Restore NIKL-attested length in 대한민국

**Files:**
- Modify: `data/korean/lexical_pronunciations.csv` — existing exact 대한민국 row
- Test: `tests/test_rules.py`
- Test: `tests/kozak-kim-ipa-first-benchmark.test.mjs`

**Evidence:** Registered source S017, NIKL Korean Basic Dictionary entry 70041, explicitly gives `대한민국[대ː한민국]`. The source supplies Hangul pronunciation and length, not IPA. The current project entry incorrectly omits length.

- [ ] Add Native and Browser regression tests requiring the first syllable's length to be preserved.
- [ ] Run focused tests and inspect RED.
- [ ] Update only the existing exact lexical row to project-derived `teː|han|min|ɡuk̚`, preserving the existing target status and making the source/provenance note explicit: NIKL attests Hangul length; IPA vowel quality and Ukrainian target remain project-level/unreviewed.
- [ ] Re-run focused Python and Node tests, lexical CSV integrity, source-register checks, and paired benchmark.

### Task 4: Verify, reconcile evidence, and update the canonical handoff

**Files:**
- Modify: `docs/superpowers/ledger.md`
- Modify: `docs/KOZAK-KIM-DISCREPANCY-DRIVEN-IMPROVEMENT-2026-11-01.md`
- Modify: `docs/coverage-matrix.md`
- Modify: `docs/final-audit.md`
- Modify: `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`
- Modify: `research/ACCEPTANCE-GATES.md`
- Modify: `docs/MASTER-TEST-CASE-AND-RULE-REGISTER-2026-10-26.md`

- [ ] Run all repository-defined Python tests, Browser tests, production build, generated-page checks, source/data integrity checks, Native/g2pK paired diagnostic, UGTPHON, Native/Browser parity, and multi-engine UGTPHON + SIGMORPHON benchmark where the workflow is available.
- [ ] Download and inspect the exact-head artifacts; report strict and Broad metrics separately, plus surface parity and coverage.
- [ ] Reconcile all statuses against actual code and CI evidence; preserve external reviewer, rights, and Ukrainian-target blockers.
- [ ] Run a final review of the complete branch diff and ensure no g2pK/vendor paths changed.
- [ ] Commit coherent implementation and evidence updates. Do not merge, publish, deploy, delete branches, or close existing PRs.
