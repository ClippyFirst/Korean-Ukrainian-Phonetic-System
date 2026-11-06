---
name: engineering-change
description: Use for implementing or changing repository behavior, fixing bugs, refactoring, CI, documentation, schemas, or project structure outside the specialized Korean evidence workflows.
---

# Engineering Change Workflow

## Purpose

Deliver the smallest complete change that satisfies the existing request and repository contract. This skill is the general engineering path; use the phonetic-engineering and NIKL skills as additional authority whenever linguistic behavior or evidence is involved.

## 1. Establish the actual task

- Read the request and the relevant existing specification, issue, plan, code, tests and handoff.
- Inspect the default branch, recent commits, relevant branches/PRs and current CI. Compare proposed work with existing changes before creating a parallel implementation.
- State the observable problem or requested outcome. If no behavioral defect is alleged, do not invent one.
- Identify the files, callers, data, generated artifacts, workflows and documentation that the change can affect.
- Record assumptions and exclusions. Ask only when an essential decision cannot be recovered from existing context.

## 2. Specify before implementation

For a feature or material behavior change, write down:
- desired behavior and observable acceptance criteria;
- existing behavior and the exact gap;
- compatibility constraints and affected interfaces;
- failure, boundary and negative cases;
- the command or manual evidence that can decide each criterion.

For documentation-only work, define the intended reader, authoritative source, navigation destination and link/consistency checks. Do not create a second source of truth.

## 3. Test-first and root-cause discipline

For bug fixes and behavior changes:

1. Reproduce the defect with the smallest relevant case.
2. Add a focused test for the intended behavior.
3. Run it and observe the expected failure. A setup error or unrelated failure is not a valid RED result.
4. Implement the smallest change that passes.
5. Run the focused test and relevant neighboring tests.
6. Refactor only while tests remain green.

For unexpected behavior or test/build failures, do not patch the symptom. Read the complete error, reproduce it, inspect recent changes and trace inputs/outputs across each relevant boundary until the failing component is identified.

Configuration, generated files and purely editorial changes may not admit a meaningful RED test. State that exception and use structural checks, link checks, schema checks or exact-head CI as appropriate.

## 4. Keep the change lean and complete

- Prefer existing project modules, conventions, standard-library features and browser/platform capabilities.
- Search all callers before changing a shared interface, return value, schema or data contract.
- Do not add a dependency, wrapper, abstraction, flag, configuration option or future-proofing layer without a concrete requirement.
- Do not cut validation, error handling, security, privacy, accessibility or explicit user requirements.
- A minimal diff must still update every affected caller, test, fixture, generated artifact, documentation page and workflow.
- Keep third-party code, datasets and license notices within their existing ownership boundaries.

## 5. Documentation and records

- Update the existing canonical document or index for the subject.
- Keep one current entry point per subject; link detailed evidence rather than duplicating it.
- Keep dated audits and historical handoffs intact. Add a dated superseding entry where state changes.
- Update source, rule, decision, benchmark or acceptance registers only when the task changes their underlying evidence/status.
- Distinguish implemented, tested, runtime-verified and independently reviewed. Do not collapse them into a single “done”.

## 6. Verification before completion

Choose commands from the current repository scripts and run the relevant full checks, not only a hand-picked unit test. Typical commands include:

- `npm test`
- `npm run build`
- `npm run check:release`
- `python -m pytest -q`
- `npm run check:ipa-target-data`
- `npm run audit:source-register`

Do not assume every command applies to every change. Inspect the package scripts and CI workflow definitions first. For each check, record the exact commit, command/workflow, result, counts, skips and artifact. Re-run after the final edit. If a local runtime is unavailable, use exact-head CI where possible and say that no local run occurred.

## 7. Finish and hand off

- Review the complete diff against the request and the repository standards.
- Verify no unrelated files or generated-artifact drift were introduced.
- Update the relevant canonical handoff with branch, start/head SHA, changed areas, verification and unresolved items.
- Commit coherent changes on a dedicated branch. Do not merge or release unless explicitly requested and the required gates are met.
- Report concrete outcomes and remaining blockers. Never say “all done” when a relevant gate was skipped or blocked.
