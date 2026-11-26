# Deterministic Korean rule execution plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Make the Korean phonological runtime execute the single canonical, validated rule ordering from repository data while remaining fully deterministic and model-free at runtime.

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
- apply_ordered_rules(..., rule_ids=None) uses default_rule_ids() only when no explicit non-empty sequence is supplied.

- [ ] Step 1: Write failing tests for canonical preferred-order sorting, deterministic repeated loads, duplicate/missing/unknown rule IDs, duplicate/invalid order positions, runtime default execution order, and explicit override preservation.
- [ ] Step 2: Run python -m pytest -q tests/test_rule_execution_plan.py; expected initial failure is import/API absence, not fixture or syntax failure.
- [ ] Step 3: Implement an immutable plan loader using only the standard library. Resolve source-checkout data first and installed sysconfig.get_path('data')/share/korean-ukrainian-phonetic-system second. Validate one-to-one rule/order coverage and sort by integer preferred_order.
- [ ] Step 4: Wire the default apply_ordered_rules sequence to the plan; preserve caller-provided ordering and all existing rule handler behavior.
- [ ] Step 5: Extend wheel smoke to import the installed plan and assert the complete canonical sequence is available without repository files.
- [ ] Step 6: Run python -m pytest -q tests/test_rule_execution_plan.py tests/test_rules.py tests/test_pipeline.py, then the complete Python suite and repository CI on the exact branch head.
- [ ] Step 7: Commit as refactor(korean): load deterministic rule order from canonical data.

## Deferred architecture increments

These are genuine next tasks, not acceptance claims for Task 1:
- Typed segment-level IPA IR with base symbol, features, diacritics, length, syllable/morpheme association, source span and rule provenance.
- Ensure the Ukrainian adapter consumes typed IPA segments rather than independently reparsing an untyped IPA string.
- Replace browser-side divergent phonemic adapters with the same serialized deterministic analysis contract.
- Expand morphology-aware rules only when supported by primary sources, independent examples, negative controls and held-out development evaluation.
- Keep neural-teacher pattern mining offline and diagnostic; manual review is required before a rule enters canonical data.