# Programme Roadmap

Last updated: 2026-10-15  
Current phase: Phase 0 — repository and implementation baseline (not yet completed).  
Planned phases are not evidence of completion.

## Operating model
Work in bounded phases. Each phase must produce durable artifacts and satisfy exit criteria before closure. Parallel research is acceptable, but shared runtime changes should wait until source and behavior contracts are sufficiently clear. Use focused branches; avoid creating many branches without an integration plan.

| Phase | Objective | Main outputs | Exit criteria |
|---|---|---|---|
| 0. Baseline reconstruction | Establish what exists and works | repository inventory, branch ledger, baseline report, runtime map | branches, PRs, tests, build and deployment checked with evidence |
| 1. Source discovery | Find and assess standards, dictionaries, papers, corpora, engines | source register, license review, source coverage map | source classes searched systematically; candidates dispositioned with reasons |
| 2. Evidence normalization | Turn materials into atomic traceable claims | claim ledger, exact citations, conflict log | in-scope claims have evidence or explicit project-policy status |
| 3. Linguistic specification | Formalize conditions, boundaries, rule order, counterexamples | rule specification, interaction graph, open questions | scope is clear; conflicting evidence recorded |
| 4. Architecture audit | Identify duplicated logic, divergent data, runtime mismatches | architecture map, data-flow diagram, API contract, parity matrix | runtimes and data paths documented; canonical sources designated |
| 5. Implementation | Fix defects and add high-value missing capabilities | code/data changes, migration notes | every change has rationale, provenance, tests, reviewable diff |
| 6. Independent corpus | Build source-grounded evaluation data | normative, lexical, context, negative, adversarial, holdout suites | provenance and expected-value review recorded; leakage risks assessed |
| 7. Verification | Measure accuracy and regressions | evaluation, differential, regression reports | required suites run; failures triaged; metrics and corpus limits disclosed |
| 8. Integration | Reconcile useful branch work | branch disposition ledger, PRs/merge records | no valuable branch work left unreviewed; conflicts resolved or deferred |
| 9. Product and release | Verify UX, browser bundle, API/CLI, accessibility, deployment | acceptance checklist, deployment evidence, docs | public artifact corresponds to reviewed commit; limitations documented |
| 10. Independent review | Challenge completeness and claims | final audit, residual risk register, next backlog | critical claims trace source → code → test and checks are reproducible |

## Priority order
1. Preserve and inventory existing work before changing it.
2. Identify unmerged high-value changes and baseline failures.
3. Establish source/rule/runtime traceability.
4. Fix correctness defects and architectural divergence.
5. Expand independently verified coverage.
6. Improve user-facing explanations and product quality.
7. Perform final release and deployment verification.

Do not prioritize rule quantity over correctness. Do not bulk-import third-party rules without verifying semantics, licensing, compatibility, and interactions.

## Task definition template
Every task should state: ID/title; observed problem or gap; evidence/source; scope/non-goals; affected files/modules; acceptance criteria; tests to add/run; affected runtimes; risk/dependency; status; result and commit/PR.

## Session protocol
Before work: read this roadmap and README; inspect current branch and repository state; select the earliest unresolved high-priority task whose dependencies are satisfied.
After work: record actual changes, exact commands and outcomes, update affected registers, set next action, and do not label planned work as done.

## Initial Phase 0 tasks
- [ ] Inspect repository tree and default branch commit.
- [ ] Enumerate branches and paginate until complete; note search limitations.
- [ ] Enumerate open/closed PRs and relevant issues.
- [ ] Compare relevant branches against default branch; record ahead/behind and changed files.
- [ ] Inventory tests, scripts, CI workflows, runtime entry points, generated data, and documentation.
- [ ] Run or obtain reproducible baseline test/build results where tooling permits.
- [ ] Verify deployed site against expected source revision.
- [ ] Populate source and rule registers with observed, not assumed, statuses.
- [ ] Publish a prioritized gap report and branch integration order.

These checkboxes remain open until evidence is recorded.