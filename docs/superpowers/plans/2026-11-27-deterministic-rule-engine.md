# Deterministic Korean rule execution plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Make the Korean phonological runtime execute the single canonical, validated rule ordering from repository data, and make offline teacher-pattern mining conservative without introducing model inference into runtime.

**Architecture:** Add a small standard-library-only rule-plan loader that validates rules.csv against rule_ordering.csv. The existing rule handlers remain authoritative for transformation semantics; the default pipeline obtains their execution sequence from the validated data plan.

**Tech Stack:** Python 3.11+, csv, pathlib, dataclasses, functools, pytest; GitHub Actions Python/wheel jobs.

**Spec:** docs/superpowers/specs/2026-11-27-deterministic-rule-engine-design.md

## Global Constraints

- No runtime ML models, inference dependencies, model weights, network calls or probability-based selection.
- No new runtime dependencies.
- Preserve the existing rule handlers, morphology licenses, rule traces and IPA-first target adapter.
- Missing/invalid canonical rule data must fail closed; do not restore a hard-coded fallback order.
- Preserve explicitly supplied rule_ids order for diagnostic callers.
- Do not promote teacher/model disagreements into rules automatically.

## Review Focus

- A rule is present in rules.csv but missing from rule_ordering.csv.
- rule_ordering.csv contains duplicate order values or unknown rule IDs.
- The CSV rows are shuffled but runtime order must remain preferred_order order.
- A wheel install cannot locate packaged rule data.
- Explicit caller-supplied rule sequences must continue to override the default plan without being reordered.

---

### Task 1: Compile the canonical deterministic rule execution plan

**Files:**
- Create: src/korean_ukrainian/rule_plan.py
- Create: tests/test_rule_execution_plan.py
- Modify: src/korean_ukrainian/rules.py
- Modify: .github/workflows/test.yml (wheel-install smoke)
- Test: tests/test_rule_execution_plan.py, tests/test_rules.py, tests/test_pipeline.py

**Interfaces:**
- load_rule_execution_plan(data_dir: Path | None = None) -> RuleExecutionPlan
- default_rule_ids() -> tuple[str, ...]
- RuleExecutionPlan.rule_ids -> tuple[str, ...]
- apply_ordered_rules(..., rule_ids=None) uses default_rule_ids() only when rule_ids is None; explicit empty sequences apply no rules.

- [x] Step 1: Write failing tests for canonical preferred-order sorting, deterministic repeated loads, duplicate/missing/unknown rule IDs, duplicate/invalid order positions, runtime default execution order, and explicit override preservation.
- [x] Step 2: Observed the expected initial import/API RED state in PR-head GitHub Actions before implementation. Local targeted pytest could not run because the local clone failed DNS resolution.
- [x] Step 3: Implement an immutable plan loader using only the standard library. Resolve source-checkout data first and installed sysconfig.get_path('data')/share/korean-ukrainian-phonetic-system second. Validate one-to-one rule/order coverage and sort by integer preferred_order.
- [x] Step 4: Wire the default apply_ordered_rules sequence to the plan; preserve caller-provided ordering and all existing rule handler behavior.
- [x] Step 5: Extend wheel smoke to import the installed plan and assert the complete canonical sequence is available without repository files.
- [x] Step 6: Full repository Python suite in GitHub Actions exercised the targeted rule-plan, rule and pipeline tests on Python 3.11/3.12/3.13; wheel and web jobs also passed. Local pytest/npm were not run because the clone failed DNS resolution.
- [x] Step 7: Commit coherent implementation changes on the existing dedicated PR branch; no force-push or merge.

### Task 2: Attribute offline teacher disagreements only to syllable-aligned contexts

**Files:**
- Modify: scripts/mine_deterministic_rule_candidates.py
- Modify: tests/test_mine_deterministic_rule_candidates.py

- [x] Step 1: Add failing tests for aligned same-word cases, unaligned IPA, and multiple eojeols; observed RED on PR-head CI before implementation.
- [x] Step 2: Align only when each Hangul eojeol has the same number of explicit dot-delimited IPA syllables and the word counts match.
- [x] Step 3: Record changed source-syllable indices for each adjacent context pair; unaligned rows remain in case output but are excluded from context candidate denominators.
- [x] Step 4: Keep candidate interpretation association-only, retain no automatic rule promotion, and bump the report schema to 1.1.
- [x] Step 5: Run complete Python 3.11/3.12/3.13, web, wheel and repository diagnostics on the exact code head.

**Evidence:** tests, Python matrix, web and wheel PASS in run 45904119310; teacher corpus audit PASS in the same run. The Charsiu inference workflow was SKIPPED by policy, so no new teacher output corpus was consumed.

## Deferred architecture increments

These are genuine next tasks, not acceptance claims for Tasks 1–2:
- Typed segment-level IPA IR with base symbol, features, diacritics, length, syllable/morpheme association, source span and rule provenance.
- Ensure the Ukrainian adapter consumes typed IPA segments rather than independently reparsing an untyped IPA string.
- Replace browser-side divergent phonemic adapters with the same serialized deterministic analysis contract.
- Expand morphology-aware rules only when supported by primary sources, independent examples, negative controls and held-out development evaluation.
- Keep neural-teacher pattern mining offline and diagnostic; manual review is required before a rule enters canonical data.

### Task 3: Preserve explicit empty rule sequences

**Files:**
- Modify: src/korean_ukrainian/rules.py
- Modify: tests/test_rule_execution_plan.py

- [x] Step 1: Identify that truthiness fallback made an explicit empty list activate all default rules.
- [x] Step 2: Use the canonical plan only for `None`; tuple-ize any explicit iterable without truthiness fallback.
- [x] Step 3: Add a regression proving `rule_ids=[]` leaves `낫` unchanged and emits no traces.
- [x] Step 4: Run exact-head full Python matrix, wheel, web, System Verify and browser build.

**Evidence:** code commit `a4aa821b1cc16b1fa755a34f3d2c89e624538401`; Tests [45905259115](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45905259115) PASS; System Verify [45905259144](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45905259144) PASS.
