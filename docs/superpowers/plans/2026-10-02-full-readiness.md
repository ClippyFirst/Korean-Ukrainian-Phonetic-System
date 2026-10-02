# Korean → Ukrainian Full-Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Close the remaining implementation gaps between the original research-system specification and the v0.4.1 repository without inventing linguistic evidence or pretending corpus/acoustic validation exists.

**Architecture:** Preserve the existing layered pipeline. Extend rule metadata and licensing rather than collapsing morphology into generic adjacency; make the Ukrainian adapter consume the UPI target contract including mapping penalties; add explicit scope/coverage metadata for Standard Pronunciation Rules; strengthen API strictness and end-to-end traceability.

**Tech Stack:** Python 3.11+, pytest, jsonschema, CSV/JSON machine-readable data, GitHub Actions, external Ukrainian-Phonetic-Inventory 0.8.0.

**Spec:** Original project MASTER PROMPT and docs/methodology.md.

## Global Constraints

- Correctness > evidence > formal model > complete data > reproducibility > validation > tests > docs > API.
- Never invent sources, rules, IPA or corpus results.
- Heuristic costs are not probabilities.
- Morphological/contextual rules require explicit licensing.
- Korean repository must not duplicate the Ukrainian target inventory.
- Narrow IPA remains unavailable without a defensible acoustic/allophonic model.
- Generated Hangul inventory remains exactly 11,172 modern precomposed syllable blocks.
- All new production behavior must have a regression test written and observed failing before implementation.

## Review Focus

1. Mixed-script input must fail consistently instead of silently dropping characters.
2. UPI candidate ranking must include target mapping context/penalty metadata rather than ignoring it.
3. §24–§30 fortition/insertion/saisiot rules must not fire from adjacency alone.
4. Alternative/conditional outputs must remain explicit rather than being collapsed into false certainty.
5. Initial-vs-final dataset parity must be mechanically auditable through a coverage matrix and generated-artifact checks.

### Task 1: API strictness and trace contract

**Files:**
- Modify: src/korean_ukrainian/pipeline.py
- Modify: tests/test_pipeline.py
- Test: tests/test_pipeline.py

- [ ] Write failing tests for strict mixed-script rejection and explicit selection-status semantics.
- [ ] Run the targeted tests and confirm failure.
- [ ] Make analyze_korean validate the entire input instead of filtering unsupported characters.
- [ ] Expose rule/target provenance consistently in end-to-end output.
- [ ] Run the targeted tests and full suite.

### Task 2: UPI target scoring integration

**Files:**
- Modify: src/korean_ukrainian/ukrainian_adapter.py
- Modify: src/korean_ukrainian/correspondence.py
- Modify: tests/test_pipeline.py

- [ ] Write failing tests proving UPI mapping penalties/context are represented in ranked candidates.
- [ ] Run and confirm failure.
- [ ] Load UPI transliteration mappings when available and combine feature cost with explicit context/phonotactic/orthographic penalties.
- [ ] Preserve score_type=heuristic_cost and expose component costs.
- [ ] Run targeted and full suite.

### Task 3: Explicit Standard Pronunciation Rule coverage layer

**Files:**
- Create: data/korean/rule_scope.csv
- Modify: data/korean/rules.csv
- Modify: data/korean/rule_ordering.csv
- Modify: src/korean_ukrainian/rules.py
- Create/Modify: tests/test_rule_scope.py
- Create: docs/standard-pronunciation-coverage.md

- [ ] Write failing tests for explicit coverage of §§9–30 relevant computational processes and conditional licensing.
- [ ] Run and confirm failure.
- [ ] Add machine-readable scope records for implemented, conditional, and out-of-scope rules.
- [ ] Add separately licensed R010–R014 for §24–§28 fortition contexts and R015 for §30 saisiot handling; do not enable them without explicit context.
- [ ] Keep R009 as §29 n-insertion and preserve alternative/no-insertion statuses.
- [ ] Add rule traces with domain/license metadata.
- [ ] Run targeted and full suite.

### Task 4: Validation corpus expansion and scientific status

**Files:**
- Modify: data/validation/cases.csv
- Modify: data/korean/evidence.csv
- Modify: data/korean/analyses.csv
- Create: docs/coverage-matrix.md
- Modify: docs/final-audit.md

- [ ] Add representative cases for R010–R015, explicit negative licenses, phrase boundaries, complex-coda chains, and alternative analyses.
- [ ] Add actual counts by status/domain; no synthetic “100% coverage”.
- [ ] Distinguish generated, rule-demonstrated, lexically attested, and corpus-observed coverage.
- [ ] Record remaining evidence gaps explicitly.

### Task 5: Reproducibility and repository consistency

**Files:**
- Modify/Create: CI workflow as actually present in repository.
- Modify: docs/reproducibility.md
- Modify: README.md
- Create: docs/superpowers/plans/2026-10-02-full-readiness.md

- [ ] Validate all generated artifacts against generators.
- [ ] Validate all CSV foreign keys and schema instances.
- [ ] Ensure rule IDs, ordering, scope and runtime registry agree exactly.
- [ ] Run fresh GitHub Actions verification on the merge candidate.
- [ ] Only after fresh verification update release status and final audit.

## Final gate

- [ ] Fresh complete test suite.
- [ ] Fresh CI status for the exact final commit.
- [ ] Adversarial probe matrix reviewed.
- [ ] Initial requirements vs final implementation coverage checked line-by-line.
- [ ] Final audit reports what is implemented, conditional, empirically unvalidated, and still requires external linguistic review.
