# Korean Phonology Engine Implementation Plan

> For agentic workers: use the executing-plans workflow to implement this plan task-by-task. Steps use checkbox syntax for tracking.

Goal: Replace the structural Korean prototype with an evidence-backed, testable phonology → IPA pipeline and a real external Ukrainian target adapter.
Architecture: Keep the existing Hangul generator and machine-readable CSV source of truth, then add a layered phonology/rule/IPA engine. The target side remains external and is consumed through a narrow adapter that can use the installed Ukrainian inventory package without copying its data.
Tech Stack: Python 3.11+, standard library, pytest, CSV, JSON Schema, GitHub Actions.
Spec: docs/superpowers/specs/2026-09-30-korean-phonology-engine-design.md

## Global Constraints
- Never treat 11,172 Hangul blocks as 11,172 phonemes.
- Never represent heuristic candidate cost as probability.
- Preserve competing analyses and uncertainty.
- Never invent narrow IPA.
- Korean normative claims must retain NIKL provenance.
- Ukrainian data remain external.
- Generated artifacts must be reproducible.

## Review Focus
- Rule ordering can change outcomes; tests must pin representative chains.
- Orthographic liaison must not be confused with universal word-boundary resyllabification.
- /ø, y/ and contemporary Seoul stop realizations are analysis-dependent.
- Missing Ukrainian package must produce an explicit adapter status, not silently fake candidates.
- Invalid/non-NFC Hangul and unsupported Jamo must fail explicitly.

## Tasks
1. Data contract: add source locators, vowel/variation data and JSON Schemas.
2. Korean representation/rules: add structured syllables and ordered final-neutralization, liaison, nasalization, liquidization, palatalization, tensification and aspiration.
3. Surface IPA: implement broad/contextual IPA and explicit alternatives.
4. Ukrainian adapter: load UPI when available and expose stable candidate/ranking contract.
5. Public pipeline: expose every layer independently and retain trace/provenance.
6. Documentation/reproducibility: update README, methodology, evidence, uncertainty, audit and ledger.
7. Verification: run tests/validators, inspect GitHub Actions, perform review, fix critical/important findings and re-verify.