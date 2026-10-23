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
The current bounded task is native Python surface-boundary observability, not the practical JS port. PR #255, branch `research/native-engine-surface-boundary-2026-10-23`, was squash-merged to `main` as `6df6a5d2e5d8a472ce7b8ceee7365b57451ccfcd`. It adds a composer that exposes the rule/lexicon-derived Korean surface string before IPA in `phoneticize_korean`, plus source-attested surface regressions and word-boundary checks. Evidence report: `research/NATIVE-ENGINE-SURFACE-IPA-BOUNDARY-2026-10-23.md`. DONE_VERIFIED: final PR head `6ed03a0f5c5b26c0afb8764a6dfc94eaf8eadc36` passed tests/build/Python 3.11–3.13, system verification, and corpus artifacts. No local tests are claimed because this session has API-only repository access. Next: review exact diff and CI, fix failures, then continue independent IPA gold and target-adaptation evaluation. This change does not validate the provisional IPA or Ukrainian target values.


## 2026-10-23 native research-engine verification update

- **DONE_VERIFIED:** PR #258 merged as `f2cfda570d424c23425fdf948edc91cea65a6d7b`. Exact PR-head Python 3.11–3.13/web tests, Python data integrity, browser/build, generated artifacts, and optional g2pK integration passed. Evidence is recorded in `research/NATIVE-ENGINE-SURFACE-IPA-BOUNDARY-2026-10-23.md`.
- The native IPA adapter now fails closed on duplicate length marks, misplaced/duplicate unreleased-stop diacritics, and unsupported modifiers. The test suite inspects the raw base lexicon and every `lexical_additions_*.csv` file, including alternate IPA rows that were previously hidden by the merged dictionary.
- CI exposed and enabled correction of one alternate IPA ASCII-`r` typo in `발음의` and a stale regression assertion. The final exact-head CI passed.
- **Still BLOCKED:** independent IPA gold (20-case queue unadjudicated), independent Ukrainian adaptation review, full article/subparagraph/exception coverage, item-level KOGL checks, and live NIKL crawl (HTTP 403/optional step skipped).
- Status remains **research preview / partial prototype**, not a fully validated transcription standard.


## 2026-10-23 follow-up — IPA feature and boundary propagation

- **DONE_VERIFIED:** PR #259 (`25c098ce46a355b810a60550ea77f1a026bc1c7d`) adds a raw-registry gate requiring every primary/alternate IPA segment to have a source feature vector.
- **DONE_VERIFIED:** PR #260 (`a378cb28068fe645b4a68bcc587dd94c39514501`) carries syllable/word boundary metadata through native IPA→target analysis and preserves word spaces in Ukrainian rendering. Exact code/test commit passed Python 3.11–3.13, web, system/browser, corpus artifact, and optional g2pK CI; links and exact SHAs are in the native-engine report.
- **CI surfaced and fixed:** hidden alternate IPA typo, stale regression fixture, and missing import in the new boundary E2E test. The corrected exact code/test heads passed.
- **Still BLOCKED:** independent broad IPA adjudication (20 queued cases), independent Ukrainian target review, full article/subparagraph/exception review, item-level KOGL verification, and live NIKL crawl. Optional source inventory is skipped, not passed.
- **Readiness remains:** research preview / partial prototype, not a fully scientifically validated transcriber.


## Follow-up completed — native empty-input fail-closed contract (2026-10-23)

PR #261 adds consistent non-empty Hangul input validation across the native public analysis stages and prevents an empty IPA segment list from being treated as a successful Ukrainian target selection. Tests cover empty strings, whitespace-only strings including a non-breaking space, non-Hangul input, and empty target selection.

The implementation/test head `052f8ef0155be23ad86b8f58f94b8c7a5ffa3af6` passed the Python 3.11–3.13/web, system/browser, corpus-artifact, and optional g2pK CI runs linked in the canonical handoff. CI failures caught a validation-order issue and a malformed whitespace fixture; both were fixed before the recorded passing head. Live NIKL inventory was skipped. PR #261 then merged as `1860616a15a664ef189ffdaff50fe559aa1339a5` after exact final-head CI passed.

Next genuine priority remains evidence-limited: secure permitted primary-source intake and independent specialist review for the 20-case IPA adjudication queue; do not generate guessed IPA gold to unblock it.


## Follow-up completed — native IPA fortis feature preservation (2026-10-23)

PR #262 adds an explicit `fortis` feature to supported source IPA vectors, distinguishes fortis from aspiration, requires this field across every raw base/overlay IPA entry, and preserves source feature vectors through target candidate selection. It intentionally does not add a target weight or alter candidate order because the reviewed Ukrainian target inventory has no explicit fortis feature.

The implementation/test head `a7b159baccba147837d979e3428a6cca486662b1` passed Python 3.11–3.13/web, system/browser, corpus artifact, and optional g2pK CI. Live NIKL inventory was skipped; local tests were not run. Final exact PR-head CI is required after documentation updates.

The target-language treatment of Korean fortisness remains an explicit open research question; preserving the source feature is not equivalent to claiming it can or should be rendered as Ukrainian consonant doubling.


## Follow-up completed at code/test head — direct IPA adapter empty input (2026-10-23)

PR #264 ports the direct-adapter empty-input guard from the non-mergeable, one-commit-behind PR #263 onto current mainline. `map_ipa_to_ukrainian` now rejects non-string input before loading the optional target inventory and rejects empty/whitespace/boundary-only tokenization results. Regression coverage includes a valid segment as a positive control.

The implementation/test head passed Python 3.11–3.13/web, system/browser, corpus-artifact, and optional g2pK CI. The live NIKL inventory job was skipped. PR #264 merged as `5bb9178243604d169c2209671a953f8683b48408` after final exact-head CI passed. PR #263 was closed as superseded after its code/test change was ported; its branch was retained. The remaining priority is independent source access and specialist adjudication, not inventing IPA gold.

## Scientific release blocker ledger and Pages smoke assertion — 2026-10-23

The current blocker ledger is in research/SCIENTIFIC-RELEASE-BLOCKERS-2026-10-23.md. The existing IPA adjudication queue has 20 cases and 0/20 independent reviewer submissions from each of two reviewer slots. The current source register has 100 data rows with item-level KOGL review incomplete. The dedicated standard-pronunciation-rule-coverage.json fixture maps articles 1–30 (29 finite-example statuses verified, Article 1 not applicable); research/RULE-COVERAGE.csv has 18 data rows (NIKL-INDEX, R001–R016, IPA-UKR-MAPPING) as a separate cross-runtime phenomenon matrix. Neither proves exhaustive atomic coverage of every NIKL subparagraph, exception, variant, productive environment, or morphology interaction.

PR #265 was inspected rather than merged blindly because its branch was one commit behind and overlapped the updated handoff. Its useful .github/workflows/deploy-pages.yml smoke assertion fix and blocker ledger were ported into PR #266, which also reconciles PR #264's merged status. The baseline deployment did reach the deploy step; the job failed on a stale grep for wording the current UI no longer uses. Post-merge Pages run [40009408019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40009408019) then passed the Python 3.11/3.12/3.13 matrix, browser tests/build, public HTTP smoke, and live Playwright practical-mode interaction on main commit `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e`.

The project remains a research preview / partial prototype. Next acceptance blockers are qualified independent IPA review, separate Ukrainian target review, atomic normative-rule coverage, item-level KOGL evidence, authorized source intake, and verified live deployment.

### Deployment gate update — 2026-10-23

Pages deployment smoke is `DONE_VERIFIED` for main commit `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e` based on [run 40009408019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40009408019). The separate NIKL live inventory job was skipped/blocked. Independent IPA and Ukrainian-target review and item-level rights evidence remain release blockers.

### Next executable batch — source register audit

The current main/deployment gates passed on `b795575c0d8b122123561c682e510ed5c171b5cc`. A dedicated branch now implements a no-dependency source-register auditor and regression tests. It should be merged only after exact-head CI passes and the reported row count / rights triage is inspected. This tool improves auditability; it does not resolve the underlying item-level licensing blocker. Next independent blockers remain IPA adjudication, Ukrainian target review, exhaustive atomic NIKL coverage, and permitted live-source access.
