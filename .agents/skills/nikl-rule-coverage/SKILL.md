---
name: nikl-rule-coverage
description: Use when mapping official NIKL pronunciation articles to the research engine, finding missing rule environments, generating source-backed regressions, or updating rule coverage and handoff registers.
---

# NIKL Rule Coverage and Regression

## Mission

Turn the official NIKL Standard Pronunciation Rules (표준 발음법) into an inspectable acceptance matrix and regression tests.

Primary source: https://korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002

## Workflow

1. Read the existing NIKL audit, coverage matrix, research/RULE-COVERAGE.csv, tests/fixtures/standard-pronunciation-rule-coverage.json, current schemas, and latest completion audit before editing.
2. Reuse existing matrices, registries, evidence tables, tests, and handoff documents. Do not create a duplicate master plan or parallel rule engine.
3. Build the expected article inventory from the official table of contents, then reconcile every expected article/subarticle with a row in the existing matrix.
4. For every rule, distinguish the normative statement, environment, listed examples, explicit exceptions, morphological/lexical prerequisites, implementation location, exact tests, and status: DONE_VERIFIED, PARTIAL, TODO, BLOCKED, or DEFERRED.
5. Trace every test to an exact official article and source URL. Keep official Hangul and official Korean surface pronunciation separate from project IPA and Ukrainian target.
6. Cover interactions and boundaries, not only canonical examples: 받침 and 겹받침, liaison, neutralization, nasal/liquid assimilation, fortition, palatalization, ㅎ aspiration/deletion, ㄴ insertion, 사이시옷, phrase boundaries, and morphology-dependent alternations where relevant.
7. Test negative conditions as well as positive ones. Near-matches that must not trigger a rule are important regression cases.
8. Update existing tests and matrices in place. Regenerate derived artifacts and check for drift.

## Mandatory IPA-first architecture

Required path:

Hangul → structural/morphological analysis → source-language phonology → IPA or explicitly typed unresolved result → Ukrainian target adaptation → Ukrainian practical orthography

Ukrainian output must consume the IPA/typed phonetic result. Never add parallel Hangul-to-Ukrainian conversion. Preserve provenance, rule order, uncertainty, syllable boundaries, and other features required by the project contract.

If lexical or morphological evidence is insufficient, preserve the unresolved marker/status instead of guessing. Soft heuristics must remain visibly low-confidence and must not license rules the repository keeps evidence-gated.

## Acceptance and reporting

- Inventory reconciles with the current official contents.
- Every rule/subrule has an explicit status and linked evidence.
- Tests assert source-backed Korean surface forms separately from Ukrainian target choices.
- Coverage checks detect missing article IDs/examples, duplicates, and untraceable forms.
- Relevant Node tests, Python tests, generators, schema/coverage gates, and release build are run and reported with exact commands and outcomes.
- Update the existing audit/handoff in place with evidence, limitations, and the next blocker.

Passing a coverage test proves fixture/inventory consistency, not independent linguistic adjudication or acoustic validation.
