# Programme Roadmap

Last updated: 2026-10-21  
Current phase: Phase 7 — verification and Phase 9 — release acceptance. Mainline implementation is tested/deployed as a research preview; independent linguistic and owner-dependent release gates remain open.  
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
- [x] Inspect repository tree and record default branch commit (main at a50ce37cb6052d74ea8ad34c0baf74a91bac7378 at follow-up start).
- [x] Enumerate branches across both API pages (173 branch refs at inspection); note that historical branches are not all individually diff-reviewed.
- [x] Check open PRs and issues (none at inspection); relevant historical PR/branch history is summarized in the handoff.
- [x] Compare 16 relevant branches against main; highly divergent/old branches were left untouched rather than merged blindly.
- [x] Inventory test suites, scripts, CI workflows, runtime entry points, generated data, and core research/docs registries.
- [x] Obtain exact-head GitHub Actions test/build/corpus/system/deployment results; local checkout is unavailable in this API-only environment.
- [ ] Verify deployed site against expected source revision.
- [x] Create a first-pass source-by-source assessment and expand the source register/discovery queue; this is triage only, not full-text verification.
- [x] Populate research/RULE-COVERAGE.csv for R001–R016, the article inventory, and IPA-to-Ukrainian target mapping with observed implementation/test status.
- [x] Publish the prioritized remaining gaps in the completion audit, acceptance gates, and surface source-adjudication report.

## Source review work recorded on 2026-10-15

- Added research/SOURCE-ASSESSMENT-2026-10-15.md with row-by-row dispositions for S001–S011 and all rows in the existing Slavic comparative source table, plus assessments of dictionaries, G2P engines, corpora, phonetic studies, Ukrainian target evidence, UPI, and official romanization.
- Added research/SOURCE-DISCOVERY-QUEUE.csv with priorities, expected value, access/license risks, decisions, statuses, and next actions.
- Expanded research/SOURCE-REGISTER.csv with additional official APIs, G2P/corpus candidates, Ukrainian precedent, target dependency, and comparators.
- These are evidence-based triage decisions, not claims that every source has been read in full, every license verified, or every candidate implemented.

These checkboxes remain open until evidence is recorded.

## One-pass execution update — 2026-10-21

### DONE_VERIFIED on mainline
- Strict practical-mode JS-port behavior merged as `fde3113fe97a34582228abcd870e64a690cf9d09`; exact-head CI and Pages deployment succeeded.
- Follow-up documentation handoff merged as `a50ce37cb6052d74ea8ad34c0baf74a91bac7378`; its mainline test/build/system/corpus workflows passed. The subsequent Pages deployment was running at the last API poll and must not be reported as complete until its workflow concludes.
- Branches enumerated across two API pages (173 refs), open PRs/issues checked (none at the snapshot), and 16 relevant historical branches compared with main. Old divergent branches were left untouched where current main already carries newer integrated implementations; no destructive cleanup performed.
- The rule coverage matrix is populated for R001–R016 plus NIKL article inventory and IPA→Ukrainian mapping.
- The 18-case surface fixture now separates JS-port output from normative comparators: 11 directly attested NIKL cases/Q&A and 7 rule-derived candidates. This does not create an IPA gold set.

### DONE_VERIFIED / exact-head CI
Branch `fix/soft-morphology-parity-and-release-gates-2026-10-21`, head `14bca46c7431bc8ed273f0cb1d6f693f17838abc`, passed tests/build/Python 3.11–3.13 [39601258671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258671), browser G2P integration [39601258672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258672), system verification [39601258670](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258670), and corpus artifacts [39601258668](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258668). These are remote CI results; no local tests are claimed.

### BLOCKED / evidence-limited
- Independent IPA gold and Ukrainian target-policy review; exact phonetic judgments require qualified independent review.
- Direct public-site interactive smoke test of the user's long passage; current browser/web access path could not complete it.
- Root project-wide LICENSE and CITATION.cff require owner decisions; no project-wide license is inferred from vendored Apache-2.0 notices.
- Seven surface cases remain rule-derived rather than direct lexical gold; all 18 IPA rows remain not independently adjudicated.
- Full branch-level archaeology of every old branch is out of scope for this continuation; no open PR was left unreviewed, and no historical branch was deleted.

### Release disposition
**Technically deployed research preview; not a scientifically validated or release-ready transcription standard.** A headless Chromium test passed against the live page using the repository's 1,443-character adversarial Korean fixture; it produced 2,782 Ukrainian characters and 3,731 IPA characters with `g2pK JS` status and no browser errors. The exact earlier passage pasted by the user, if different from this repository fixture, remains unverified. Independent IPA gold and Ukrainian target review remain the next scientific acceptance work.


### Final exact-head CI evidence — 2026-10-21

The code/deployment commit `dae8ebdabb396d1be51afbe891d80c9c48a29f1c` and code-equivalent mainline commit `a8996112a01ec43f90b7c297b975906e4b44ab83` passed tests/build/Python 3.11–3.13 [39604039126](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039126), system verification [39604039157](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039157), corpus artifacts [39604039164](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039164), and Pages deployment plus HTTP/headless-browser smoke [39604039154](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039154). The repository's 1,443-character adversarial fixture yielded 2,782 Ukrainian and 3,731 IPA characters with no page errors. Independent IPA and target-policy validation remain open.


## Native research-engine continuation — 2026-10-23
The current bounded task is native Python surface-boundary observability, not the practical JS port. Branch `research/native-engine-surface-boundary-2026-10-23` adds a composer that exposes the rule/lexicon-derived Korean surface string before IPA in `phoneticize_korean`, plus source-attested surface regressions and word-boundary checks. Evidence report: `research/NATIVE-ENGINE-SURFACE-IPA-BOUNDARY-2026-10-23.md`. Status: DONE_VERIFIED on exact PR head `92c7526d07c8fc53d06cb53eeb1884222c52bc23`; remote tests/build/Python 3.11–3.13, system verification, and corpus artifacts passed. No local tests are claimed because this session has API-only repository access. Next: review exact diff and CI, fix failures, then continue independent IPA gold and target-adaptation evaluation. This change does not validate the provisional IPA or Ukrainian target values.
