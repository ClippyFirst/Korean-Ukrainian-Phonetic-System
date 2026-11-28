# Narrow /h/-lenition and liquid interaction v18 Implementation Plan

> **For agentic workers:** Execute inline with Superpowers TDD and verify every step. This plan extends the existing Narrow v17 profile; it does not replace the master execution plan.

**Goal:** Expose a source-grounded, unselected interaction candidate for same-word coda ㄹ + onset ㅎ when /h/ is elided and the preceding liquid is realized as a tap [ɾ].

**Architecture:** Preserve the current Narrow primary output and all Broad/Standard behavior. Add the same whole-word IPA alternative in the Python and browser candidate generators, with source provenance and explicit uncertainty. Do not infer speaker identity, dialect, acoustic timing, or select the candidate automatically.

**Tech Stack:** Python standard library, browser JavaScript ES modules, Node test runner, existing GitHub Actions verification and paired IPA benchmark workflows.

**Spec:** Existing Narrow v17 evidence-gated profile and benchmark interaction findings recorded in `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`, `docs/coverage-matrix.md`, and `docs/final-audit.md`.

## Global Constraints

- Keep Standard/Broad outputs and Ukrainian target adaptation unchanged.
- Keep the runtime deterministic and model-free.
- A text-only input must not select speaker-, dialect-, style-, or audio-dependent variants.
- Candidate variants must be explicitly unselected and carry source/evidence provenance.
- Do not treat corpus reference agreement as independently adjudicated Narrow IPA accuracy.
- Preserve Python/browser parity for the new candidate.
- Do not add runtime dependencies or change source datasets/licensing.

## Review Focus

- Coda ㄹ + onset ㅎ across a same-word boundary: candidate must jointly change [l]→[ɾ] and remove the following /h/, not make independent incompatible edits.
- Word boundary or punctuation between ㄹ and ㅎ: no interaction candidate.
- Coda other than ㄹ before ㅎ: no liquid-tap interaction candidate.
- The /h/ onset may be [h] or [ç] in the current primary profile; candidate generation must remove the complete onset realization without damaging the following vowel.
- Candidate must not alter the primary IPA, Broad IPA, target adapter, or selected-variant count.

---

### Task 1: Add a failing Python and browser regression

**Files:**
- Modify: `tests/test_narrow_ipa.py`
- Modify: `tests/extended-ipa-profile.test.mjs`

**Interfaces:**
- Consumes: existing `realize_syllables(..., level="narrow")` and `buildExtendedIpaResult(...)` result contracts.
- Produces: an assertion that same-word ㄹㅎ yields an unselected [ɾ] + /h/-deletion candidate while primary IPA stays unchanged.

- [ ] Add Python test for `말하` → primary `mal.ha`, candidate `maɾ.a`; assert evidence status, refs, and selected=false.
- [ ] Add browser test with the same primary and candidate outputs.
- [ ] Add negative controls for word-separated `말 하` and non-liquid sonorant coda + ㅎ.

### Task 2: Implement the joint candidate in both runtimes

**Files:**
- Modify: `src/korean_ukrainian/ipa.py`
- Modify: `src/app/extended_ipa.js`
- Modify: `src/korean_ukrainian/ipa_profiles.py`

**Interfaces:**
- Consumes: existing IPA sequence renderers, candidate variant schema, and Narrow profile registry.
- Produces: Narrow profile v18, retaining v17 primary strings and adding one candidate with status `source-scoped-h-lenition-liquid-interaction-candidate-only`.

- [ ] In Python, generate a combined candidate only when coda ㄹ is followed by same-word onset ㅎ; replace coda [l] with [ɾ] and remove the following onset realization while retaining the syllable boundary and vowel.
- [ ] In browser JavaScript, add the equivalent source-span-aware candidate site.
- [ ] Cite Crosby & Dalola (2021), DOI `10.3765/plsa.v6i1.5002`, for the reported [ɾ]/[l] split conditioned by /h/-lenition; explicitly note the small 12-speaker sample and that the candidate is not selected for unknown speakers.
- [ ] Increment the Narrow profile version to 18 in both runtime contracts; do not alter primary realization rules.

### Task 3: Verify and update evidence records

- [ ] Run the focused Python and Node tests, then the complete repository suites and production build through available CI.
- [ ] Run the paired Standard-vs-Extended IPA benchmark on the exact implementation head; compare primary IPA and candidate diagnostics against v17.
- [ ] Update the existing master handoff, coverage matrix, and final audit with exact CI/benchmark evidence and blockers.
- [ ] Self-review the full diff; leave the PR draft and unmerged.

## Acceptance

- The new candidate exists in Python and browser for same-word ㄹㅎ contexts and is byte-for-byte equivalent after normalization.
- No candidate appears across a word boundary or for non-ㄹ sonorants.
- Primary Narrow, Broad/Standard, and Ukrainian target outputs remain unchanged.
- All applicable regression/build/rights checks pass; benchmark artifacts are inspected before any uplift claim.
