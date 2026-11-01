# Programme Roadmap

Last updated: 2026-11-02  
Current phase: Phase 7 — verification and Phase 9 — release acceptance. Mainline implementation is tested/deployed as a research preview; independent linguistic and owner-dependent release gates remain open.  
Planned phases are not evidence of completion.
## Current continuation status — 2026-11-02

Current focused work is Phase 7 verification plus Phase 10 independent-review preparation; Phase 9 release acceptance remains blocked.

- C01–C07 blind packet preparation is DONE_VERIFIED: seven neutral packets, 42 entries, 39 unique UGTPHON source rows with source contexts. Two independent reviewer submissions are still required.
- C08 is PARTIAL / EVIDENCE-LIMITED: all eight source contexts are now mapped. Five formerly missing memberships were reconstructed from the pinned fortis-mismatch signature because the original extraction table is absent. Seven forms have conditional -(으)ㄹ + dependent-noun evidence from official NIKL Q&A; 유사성 remains unresolved. No new production rules were added. Kiwi/MeCab-Ko disagreement for 했을시 remains diagnostic only.
- Python R013 exact same-eojeol licensing now applies within full sentences, matching the browser engine. Full-context positive and negative tests pass.
- Current paired browser benchmark (run 41358068900; artifact 13103478172): 2,699 shared occurrences; CER 8.1097% vs g2pK 8.2138% (−0.1040 pp; 95% cluster-bootstrap CI −0.1951 to −0.0261 pp); exact match tied at 53.4272%. Diagnostic only.
- Remaining acceptance work: two independent IPA reviews, independent C08/prosody adjudication and recovery of the original cluster extraction provenance, C09/C10 convention adjudication, NIKL item-level rights, and Ukrainian target review.



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

Initial rights-triage result: 96 of 100 records need review, 2 need manual classification, 1 explicitly records a verified license, and 1 is marked not applicable. Treat this as a review queue, not a legal decision. Do not close source-rights acceptance based on this report alone.

### Next executable batch — independent IPA review handoff

The 20-case queue remains the canonical source of truth. A new branch prepares blinded reviewer packets for slot A/B from that queue, preserving source-backed Hangul surface evidence while excluding any candidate IPA, other reviewer record, reconciliation and target-layer data. This is a preparation tool only; merge after exact-head CI and then recruit qualified reviewers. Do not fabricate independent IPA or count packet generation as adjudication.

### Latest integration checkpoint — 2026-10-23

PR #270 and PR #271 are merged. Main is `df733c7f7afdf1262bea6c46d07876d6f315ccaf`. The source-register audit and blinded IPA packet generator are now in the canonical branch. Exact-head CI for the packet branch passed 1,195 Node tests with zero failures, Python 3.11–3.13, system verification, browser G2P, and corpus artifact checks. Mainline equivalents passed after merge. Public Pages deployment, HTTP smoke, and live Playwright practical-mode smoke all passed in run [40012736801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40012736801).

Current source-rights triage flags 96 of 100 rows for review and 2 for manual classification. IPA remains 0/20 independent submissions per reviewer slot. This improves the audit/review workflow but does not close scientific acceptance.

### Reviewer workflow hardening — 2026-10-23

The next branch adds a fail-closed validator for returned blinded IPA packets. Acceptance is structural only: packet must match the exact canonical queue hash; contain each expected case once; preserve source-backed evidence unchanged; avoid candidate/other-reviewer fields; and provide reviewer ID, qualification, timezone-bearing timestamp, method reference, broad IPA, syllable-boundary record, and explicit length assessment. This reduces handoff errors but does not replace specialist adjudication.

### NIKL coverage visibility — 2026-10-23

Add a deterministic index of explicit NIKL article references in tests, with one row per article 1–30 and no range extrapolation. Use it to navigate existing evidence and identify absent references, not to claim exhaustive coverage. The remaining acceptance unit is each source-grounded paragraph/subparagraph/exception/variant and its implementation/test/review evidence.

### Current implementation and acceptance status — 2026-10-23

Verified code snapshot: `3a2052c9c27d7af6b5efa7c744d9e2ef14a70d41`. CI: 1205 Node tests pass; Python 3.11/3.12/3.13, browser G2P integration, system verification, and research artifact generation pass. Pages run [40015664039](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40015664039) subsequently passed deployment, public HTTP smoke, and live Playwright practical-mode smoke; official NIKL crawl remains blocked by HTTP 403.

The workstream is now stronger in reproducibility and reviewer handoff, but not scientifically release-ready. Outstanding acceptance depends on independent IPA and Ukrainian-target review, atomic rule/variant coverage from permitted primary-source evidence, item-level rights resolution, and permitted source access. The article-reference index must not be mistaken for complete rule coverage.

## Architecture correction: shared Ukrainian target renderer (2026-10-24)

- **Status:** DONE_VERIFIED on the PR branch for implementation and automated verification; integration remains pending because PR #296 is open and unmerged.
- **Problem:** the optional `g2pk_engine.transliterate_with_g2pk()` contained its own IPA-to-Ukrainian mapping / selection / orthographic rendering loop, which blurred the ownership boundary between an external pronunciation provider and the ClippyFirst engine.
- **Change:** `pipeline.render_ipa_analysis_to_ukrainian()` is now the shared core renderer; the g2pK adapter delegates to it. The core preserves punctuation and spacing and fails closed when IPA word analyses are missing, empty, or misaligned.
- **Tests added:** shared renderer ownership and punctuation preservation; missing-word-analysis fail-closed regression.
- **Verification evidence:** exact-head CI on the PR branch passed `pytest -q` on Python 3.11, 3.12, and 3.13, `tests/test_g2pk_engine.py` on Python 3.11 and 3.12, `npm test`, `npm run build`, and the Python regression/data-integrity job. Runs: [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087128047), [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087127940), [optional g2pK integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087128014). The official NIKL metadata inventory job was skipped, not passed. No local test run is claimed because this session used the GitHub API rather than a local checkout.
- **Remaining integration task:** PR #296 is still unmerged. Confirm its latest-head checks remain green after the final documentation update, review output compatibility for `transliterate_with_g2pk`, and merge only through the normal repository process. Scientific IPA/target validation remains separate and is not closed by these software tests.

## Benchmark review after shared IPA target-renderer integration — 2026-10-24

- **Status:** PARTIAL — exact-code CI and benchmark artifacts reviewed; a consolidated report is now available at `docs/BENCHMARK-REVIEW-2026-10-24.md`.
- **Merged code:** `b87e78c702e9278c8a84592b8d054113f74f18b9`. Multi-engine/native-vs-g2pK/morphology benchmarks ran successfully on the PR head `9f9509b6617de7d0e4cfaef40f31b6bd74c28885`, whose executable source/tests are identical to the merged commit; benchmark workflows were not rerun on the merge commit itself.
- **Multi-engine IPA:** on pinned UGTPHON (2,703 eligible occurrences), native strict scored 2,655, coverage 98.2242%, exact 24.4068%, CER 17.0648%; g2pK scored all 2,703, exact 24.9723%, CER 16.6931%. Other pinned baselines are detailed in the report. Corpus is noisy user-generated text, not normative NIKL gold.
- **Native strict/soft:** soft raised coverage to 99.0381% but exact rate fell to 24.2809% and CER worsened to 17.0906%; paired strict/soft common subset was identical. No accuracy improvement claimed.
- **Morphology:** Kiwi and MeCab-Ko each processed 1,907/1,907 unique words; naive boundary-gated counterfactuals did not improve paired IPA scores. This is not production rule licensing.
- **Regression gates:** main-commit CI passed Python 3.11/3.12/3.13, browser tests/build (1,213 tests passed), and system verification. Python/browser surface differential remains 18/20 equal with known discrepancies at `넓죽하다` and `읽고`; NIKL live inventory job was skipped.
- **Remaining TODO:** rerun manual-dispatch multi-engine/morphology benchmarks against main commit; build an independently adjudicated IPA-to-Ukrainian target corpus; resolve two surface mismatches with exact NIKL source evidence. Production morphology licensing remains BLOCKED on reviewed gold segmentation and rule-specific licenses.


## Korean Revised Romanization audit view — 2026-10-28

- **Status:** PARTIAL / in review. PR [#354](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/354), branch `feat/korean-revised-romanization-2026-10-28`, head `1cbbf4300b09d5faadeed46ac448ccb473622338` at the time of this entry.
- **Implemented:** isolated RR rendering adapter; service result card and methodology explanation; copy support; fail-closed display when the G2P path supplies no resolved surface form; official NIKL examples in unit tests; all 11,172 modern Hangul syllables swept for empty/undefined mappings.
- **Source:** [NIKL Romanization of Korean](https://www.korean.go.kr/front_eng/roman/roman_01.do) and [official sound-change examples](https://www.korean.go.kr/front/page/pageView.do?mn_id=97&page_id=P000150).
- **Local verification:** isolated Node.js harness passed 6/6 tests, including the exhaustive syllable sweep. The harness copied the adapter into a temporary directory; it is not the repository's full test suite.
- **CI:** the code/test snapshot `0dcde24374f1a67c38f00f44687c7a1e4a024a51` passed GitHub Actions browser regression/build, Python regression/data integrity, `npm test`, `npm run build`, Python 3.11/3.12/3.13, corpus artifact and teacher-corpus audit jobs ([system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40680654498), [browser G2P](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40680654450), [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40680654400), [corpus generation](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40680654469), [test-case register](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40680654475)). Official NIKL source inventory was skipped. Subsequent commits updated documentation only; exact latest-head checks have not been rerun.
- **Critical scope boundary:** RR is rendered from the pronunciation path's surface Hangul. This checks the romanization adapter conditional on the upstream surface form; it does not validate G2P, IPA, or Ukrainian targets. The current code is basic RR coverage, not a standards-certified implementation of every NIKL convention.
- **Remaining acceptance:** exact-head CI must pass; manually inspect the live/browser card and copy action; complete an official-rule matrix for coda allophones, liquid handling, sound changes, word boundaries, capitalization and mixed scripts; independently compare a broader official NIKL example set; keep Latin-to-Hangul reverse conversion deferred until ambiguity/status handling has a separate specification.
- **Disposition:** do not merge or describe as fully NIKL-conformant until these gates are met.


## UX refresh: Korean service workbench (2026-10-28)

- **Status: PARTIAL — implementation on branch; exact-head CI and rendered-browser review pending.**
- **Baseline:** `main` at `88f9bcc581d51756f6344961ef3ebc9951aaf3eb`; Thai reference repository inspected at `d39fc9e2c40db4a9f760069099c1f45973d592c8`.
- **Preserved:** the current editorial hero and Korean/Ukraine identity; all engine modes, examples, live conversion, copy controls, IPA and RR outputs, research warnings, trace data contract, two-page navigation and local-only CSP.
- **Implemented:** single-column input-to-output flow; larger, calmer input; clearer usage guidance; mode choices rendered as selectable cards; Ukrainian output promoted above supporting IPA/RR/analysis cards; detailed syllable trace moved into a native collapsed disclosure; mobile result cards collapse to one column.
- **Evidence added:** `tests/web-ui-contract.test.mjs` checks the accessible input hint, disclosure structure, output hierarchy and responsive CSS; `docs/WEB-SERVICE-QA.md` records acceptance criteria.
- **Acceptance still required:** exact-head CI (all existing tests and static build), deployment smoke check after merge, and visual inspection at desktop/mobile widths. The connector-only environment does not provide a local checkout or actual browser screenshot capture in this pass; CSS-source tests do not prove rendered visual quality.
- **Next action:** run PR CI, repair any regression, then review the deployed result before marking UX work DONE_VERIFIED.


## Provisional UA candidate UX correction (2026-10-28)

- **Status: PARTIAL — code and UI contract tests committed on branch; CI and rendered-page verification pending.**
- **Problem:** a candidate was surfaced as the primary UA result with a "copy candidate" action while a second warning block repeated the same candidate and said not to use it. This created two competing result locations and made the copy action appear endorsed.
- **Decision:** when the UA target is provisional/unavailable, show a neutral status in the primary result slot and suppress its copy action. Show the candidate once in a distinct research panel with explicit "not confirmed" wording and a separate "Копіювати кандидата" control. Copy feedback also names it as an unconfirmed research candidate.
- **Preserved:** engine behavior, IPA-first mapping, candidate value, IPA/RR/analysis/trace, status reporting, confirmed-target copy path.
- **Evidence:** new source-level assertions in `tests/web-ui-contract.test.mjs`; acceptance criteria in `docs/WEB-SERVICE-QA.md`.
- **Remaining gate:** PR CI, browser/static build, and actual visual review of candidate and confirmed states. No linguistic status is upgraded by this UI change.

## Live deployment follow-up — 2026-10-28

- UX correction for provisional Ukrainian output was merged in `c4fbe4f223f0017aeda2e3bae414a39e889f65b4` (PR #356). Mainline tests, system verification, corpus/artifact workflow, and browser G2P integration passed on that exact commit.
- GitHub Pages deployment and public-page smoke checks succeeded, but the final live Playwright adversarial-passage step failed because `scripts/smoke-live-pages-browser.mjs` still expected the pre-redesign label `Попередній український кандидат` in the primary result slot. The deployed page correctly showed `Немає підтвердженого запису`; this is a stale acceptance assertion, not evidence that deployment failed.
- Follow-up task: update live smoke assertions to recognize the neutral primary status, ensure the primary copy control is hidden, and verify the candidate has its own visible copy action. Re-run deployment workflow and verify the exact published revision before marking this gate DONE_VERIFIED.
- Current status: `PARTIAL` until the updated live browser smoke passes on the deployed revision.

## Live smoke finding — 2026-10-28 follow-up

- The revised live smoke reached the newly deployed UI and exposed a real render defect: when a candidate existed, the primary result text was blank because `hasCandidate` took precedence over the neutral unconfirmed status. The earlier source-level UI contract had encoded that same defect.
- Corrected the render precedence so any unconfirmed/unavailable target shows `Немає підтвердженого запису` in the primary slot while the candidate remains isolated in its research panel. Updated the UI contract test to guard this exact behavior.
- Acceptance was `PARTIAL` pending final verification; the closure record below supersedes this interim status.


## Final verification — 2026-10-28

- Status: `DONE_VERIFIED` for the provisional-result UX and live deployment gate.
- PR #356 separated the unconfirmed candidate from the primary result. PR #357 aligned the live smoke contract. PR #358 fixed a render-precedence defect found by the live smoke.
- Final main commit: `4a7b5fdf7bf1de3ec0aca775696bfa0506dd040d`.
- All exact-head main checks passed: tests `40690480342`; system verification `40690480409`; browser G2P integration `40690480626`; research corpus/artifacts `40690480597`; Pages deploy and live browser smoke `40690480644`.
- The live adversarial-passage smoke verified the neutral unconfirmed status, separate candidate panel/copy action, IPA output, practical JS G2P mode, and no browser runtime errors.
- Scope note: this closes only the UX/deployment gate; broader linguistic evidence and independent IPA review remain open.

## UX/UI audit — 2026-10-28

- Status: `PARTIAL` — source/contract audit recorded in `docs/audits/UX-UI-AUDIT-2026-10-28.md`; the live screenshot-first phase is blocked by exhausted Firecrawl credits and the public-page viewer returning cache misses.
- Findings are prioritized and include evidence, user impact, proposed remediation, and acceptance criteria. No runtime change was made on the strength of unverified visual hypotheses.
- Do not mark this audit `DONE_VERIFIED` until current desktop/mobile screenshots, keyboard/accessibility checks, and representative long-input performance observations have been recorded.

## UX/UI remediation — 2026-10-28

- Implementation PR: #362 (`fix/ux-ui-accessibility-rebased-2026-10-28`).
- Source-level changes: concise debounced result announcements; user-oriented mode descriptions with progressive technical disclosure; responsive in-page methodology navigation; visible clipboard recovery; labelled mobile trace fields; regression contracts.
- Status: implementation present; acceptance remains `PARTIAL` until real desktop/mobile and assistive-technology verification. Performance optimization remains pending representative measurements (short, ~1,000 characters, 5,198 characters); do not change synchronous behavior without evidence.
- Evidence and detailed acceptance gates: `docs/audits/UX-UI-AUDIT-2026-10-28.md`.

## Live UX smoke evidence — 2026-10-28

- Post-deployment Playwright smoke passed on commit `49160487f25e6c9569cecf24bbb234155932ba2c` (run #40703251527): meaningful live result announcement, technical disclosure, simulated clipboard denial and exact selection fallback, trace labels/no horizontal overflow at 390×844, and methodology anchor navigation.
- Remaining: actual screen-reader and manual keyboard evaluation, screenshots/visual review, 320 px layout, human comprehension check, and measured latency for short, ~1,000-character, and 5,198-character inputs. Do not close the audit until these acceptance criteria are met.


## Output hierarchy and Hanja abstention — 2026-10-30

- **Implementation status: PARTIAL pending exact-head CI and deployed smoke.**
- Ukrainian practical output is now the first result card. Romanization and IPA stay as supporting cards, and Hanja occupies the prior Ukrainian-card position after them.
- Hanja remains a deterministic dictionary annotation, not a complete Korean-to-Hanja conversion. Native Korean vocabulary and grammatical particles are intentionally preserved in Hangul when no supported lexical Hanja mapping exists; the regression fixture `현대 한국어의 표준 발음 값이` checks that known terms can be annotated while `값이` stays Hangul.
- **Acceptance:** run `npm test`, `npm run build`, inspect exact-head GitHub Actions, then verify the deployed Pages output order and the mixed-script example. Do not mark the UX gate DONE_VERIFIED before those checks pass.
- **Preserved limits:** no neural models or runtime API calls; contextual homograph disambiguation and measured dictionary accuracy remain deferred/TODO as documented in `docs/HANJA-RESEARCH-LAYER-2026-10-29.md`.


## UI follow-up: Hanja before wide IPA — 2026-10-30

- **Status:** PARTIAL pending exact-head CI and deployed smoke.
- **Requested output order:** Ukrainian → Romanization → 漢字 (Hanja · dictionary annotation) → IPA (wide IPA) → Analysis.
- **Change:** swapped the Hanja and IPA result-card positions only; output IDs, labels, rendering, and copy controls are unchanged.
- **Regression:** `tests/hanja-ui-contract.test.mjs` asserts the new DOM order.
- **Acceptance:** exact-head `npm test` and `npm run build` must pass; Pages deployment and live smoke must verify Hanja appears immediately before wide IPA.


## 2026-10-30 — Super-soft 100% technical coverage mode

- **DONE_VERIFIED (browser runtime, PR head c57f34c52e15e5a55fc5943e4069c019bfb12a07):** implementation added on `feat/super-soft-100-percent-coverage-2026-10-30`: deterministic opt-in mode, existing Soft/Practical rule reuse, typed orthographic-phonemic fallback for unresolved morphology, IPA-first target adaptation, literal/Jamo preservation, source-span coverage counters, and research-only UI toggle.
- **DONE_VERIFIED:** exact-head CI passed exhaustive 11,172-syllable IPA + Ukrainian candidate coverage, 13 strict morphology gaps, full NIKL master passage coverage, trace accounting, provisional lexical target candidate-only behavior, unresolved-morphology provenance, mutually exclusive UI controls, methodology documentation, regression suite (1326/1326), and static build. Coverage is not pronunciation accuracy. Deployment smoke remains pending merge.
- **BLOCKED / EVIDENCE-LIMITED:** independent accuracy evaluation needs adjudicated held-out Korean pronunciation gold. No neural runtime or remote service is introduced.

- **DEFERRED:** Python CLI/API do not expose Super-soft and remain strict/soft; no cross-runtime parity claim.

## Kozak Kim browser G2P and benchmark improvement — 2026-11-01

- **DONE_VERIFIED (PR #415, code head `d66d02889ffcf405dc9f927a61d3da69fbfe8697`):** separate Korean pronunciation resolution from IPA→Ukrainian target status; preserve resolved IPA when only the target mapping is provisional/unavailable; preserve literal/Jamo content in explicit Super-soft mode.
- **DONE_VERIFIED:** add two exact NIKL-backed lexical surface entries: 사건[사ː껀] and 인기[인끼], retaining the optional non-fortis 인기[인기] alternative. IPA is project-derived from the attested Hangul surfaces; Ukrainian target remains provisional.
- **DONE_VERIFIED (diagnostic only):** direct browser UGTPHON test-split run: 1,428/2,699 exact (52.9085%), CER 8.2571%, coverage 99.852%, 4 unresolved, 0 engine errors. Paired Python comparison on 2,698 common tokens: native 53.0393% exact / 9.1351% CER; g2pK 53.1134% / 9.2304%. No clear engine winner.
- **PARTIAL / RESEARCH-ONLY:** broad IPA sensitivity profile yields 2,495/2,699 exact (92.4416%) and CER 1.3562% after collapsing selected narrow allophones and sibilant aspiration. This is a comparison convention analysis, not a change to engine output or a new accuracy claim; independent phonetics adjudication remains blocked.
- **Research result:** UGTPHON's Korean task requires canonical-form inference from raw user-generated text. The EMNLP 2026 paper's Korean ablation shows sentence context is the dominant factor (word-to-word PERnc 47.5 vs sentence-to-word 28.1); retrieval adds only a small improvement (27.7), while staged decoding worsens the Korean result (33.1 / 32.0). If pursued, build a separate sentence-context lexical-normalization stage with train-only evidence and abstention, not a generic phonological rule.
- **BLOCKED:** independent Korean IPA profile review; independent Ukrainian target review; NIKL item-level reuse verification and IPA-Dict/UGTPHON source-license compatibility review.
- **IN_PROGRESS:** multi-engine comparison workflow 41309605046; CharsiuG2P and ByT5 remain skipped under default-off gates.
- **Release status:** research prototype / diagnostic engine; not research-certified or release-ready. Full ledger and exact run evidence: `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md` and `research/ACCEPTANCE-GATES.md`.



## 2026-11-01 — Kozak Kim exact-form G2P corrections (PR #415)

- **PARTIAL pending exact-head CI:** add NIKL Q&A-backed exact §26 form `실수[실쑤]` to both browser and Python rule inventories; no productive rule expansion.
- **PARTIAL pending exact-head CI:** add dictionary-backed `한자[한ː짜]` with long-vowel length preserved, IPA derived by the project, and Ukrainian target marked provisional.
- **PARTIAL pending exact-head CI:** Python target adapter now withholds any candidate orthography for provisional lexical targets even when no target-reference string exists.
- **Source register:** 139 records, 12 columns; rights counts 1 recorded, 1 not applicable, 130 review-required, 7 manual-classification-required.
- **Projected only:** prior artifact recalculation estimates strict CER 8.2571% → 8.2441% (exact match unchanged) and broad-candidate exact 92.4416% → 92.4787%. No updated score may be published until current-head browser benchmark completes.
- **BLOCKED:** connector commits have not triggered new CI runs; exact-head tests/build/system/benchmark require manual Actions dispatch or an event-triggering push. Korean phonetics adjudication, Ukrainian target review and item-level rights verification remain open.
- **Release status:** research prototype; not research-certified or release-ready. See the latest continuation in `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`.


## 2026-11-01 — Canonical IPA benchmark error taxonomy (PR #415)

- Direct browser run 41309605083: 2,699 tokens; strict exact 52.9085%, CER 8.2571%.
- Research-only broad-candidate sensitivity: 92.4416% exact, CER 1.3562%; 1,067/1,271 strict mismatches (83.95%) normalize to exact; 204 remain.
- Broad normalization is unadjudicated and must not be promoted as the official score. Review remaining cases with Korean sources and preserve length/allophone detail unless an adjudicated standard permits normalization.
- New 실수 and 한자 corrections have projected, not measured, deltas pending exact-head CI and benchmark rerun.


## 2026-11-01 — Measured source-backed G2P corrections (PR #415)

- **DONE_VERIFIED diagnostic:** direct browser run 41311996175 on 2,699 tokens (99.852% coverage): strict exact 52.9085% unchanged; strict CER improved 8.2571% → 8.2441%; broad-candidate exact 92.4416% → 92.4787%, CER 1.3562% → 1.3427%.
- \`실수\` now produces \`ɕil.s͈u\` and is broad-candidate exact; strict mismatch is annotation allophone. \`한자\` now produces \`haːn.tɕ͈a\`, preserving dictionary length; benchmark gold omits length, so distance 1 remains.
- Paired native/g2pK: native 53.0393% exact / 9.1220% CER vs g2pK 53.1134% / 9.2304%; keep native as default.
- Exact-head unit/system CI remains required before these changes can be promoted from benchmark-verified to fully verified.


## 2026-11-01 — measured raw-surface and morphology follow-up (PR #415)

- **DONE_VERIFIED:** restored the existing raw-surface benchmark implementation and corrected its Python regression contract; Python 3.11/3.12/3.13, wheel, web, teacher-corpus, browser regression/build and system verification passed in runs 41325015110 / 41325014981 / 41325014980.
- **DONE_VERIFIED diagnostic:** exact pinned UGTPHON train/test split integrity and Apache-2.0 declaration checked in run 41325015010. Train 1,976 rows; test 275 rows; both Git blob hashes match the repository's pinned manifest.
- **DONE_VERIFIED research result:** train-only raw-surface retrieval improves the paired 2,624-token subset from 51.3720% to 51.6006% exact (+0.2287 pp) and CER 10.0783% to 9.9730% (−0.1054 pp); 6 exact improvements, 0 regressions, 15 rescued, 0 lost. Only 22/722 noncanonical tokens hit; exact-context retrieval produced 0 hits. Do not promote to standard runtime.
- **DONE_VERIFIED diagnostic / no adoption:** Kiwi + MeCab consensus changed 4 unique words, gave no exact-match gain and worsened paired CER by 0.000087. Preserve strict engine.
- **Research direction:** EMNLP 2026's Korean ablation identifies sentence context as the main UGT lever; retrieval adds little after context and staged decoding worsens Korean. If continuing UGT, prototype a context-conditioned train-only candidate stage with canonical controls and calibrated abstention, not broad phonological rules.
- **Benchmark interpretation:** direct browser canonical test remains 52.9085% exact / 8.2441% CER at 99.852% coverage. Broad-candidate sensitivity (92.4787% exact / 1.3427% CER) is not normative engine accuracy. Paired native/g2pK still favours native CER; no reason to replace Kozak Kim.
- **BLOCKED:** independent Korean IPA adjudication, independent Ukrainian target review, NIKL item-level rights and IPA-Dict/UGTPHON license compatibility.
- **IN_PROGRESS at last check:** latest post-test-only head workflows were still running; verify the current tip before merge. Multi-engine Charsiu/ByT5 jobs remain skipped by default.
- **Release status:** research prototype; not research-certified or release-ready. Canonical handoff and exact artifact details remain in `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`.


## 2026-11-01 — Kozak Kim browser parity and direct original-g2pK comparison

- **DONE_VERIFIED implementation:** browser IPA now mirrors the existing Python broad-profile handling of NIKL Standard Pronunciation Rule 5, exception 1. The correction removes the prohibited [j] glide in the covered ㅈ/ㅉ/ㅊ + ㅕ forms and adds an inspectable trace entry. The g2pK vendor source is unchanged.
- **DONE_VERIFIED measured browser regression:** strict exact 1,428→1,442 (+14), strict CER 8.2441%→8.1358%; broad-candidate exact 2,496→2,521 (+25), broad-candidate CER 1.3427%→1.2301%. Broad-candidate results remain sensitivity analysis only.
- **DONE_VERIFIED paired diagnostic:** on 2,699 shared UGTPHON occurrences, Kozak Kim and original g2pK both score 53.4272% exact. Kozak Kim CER is 8.1358%, g2pK CER 8.2138%. Four exact discordances favour each engine. A 264-row-cluster, 2,000-resample bootstrap gives exact-delta 95% CI [−0.207,+0.201] pp and CER-delta CI [−0.166,0.000] pp. Do not claim statistically robust overall superiority.
- **Source adjudication:** all four apparent g2pK-only exacts are 없는; the NIKL §18 quoted example preserves vowel length [엄ː는], which UGTPHON gold omits. 못잃어 has two survey-attested readings; 인기 has optional fortition. 닮다 and 넘게 are supported §24 Kozak Kim wins. Existing 넓죽하다 and 읽고 source-backed regressions remain.
- **Residual rule work:** keep R010/R012/R013/R028 conservative until a morphology-boundary model can distinguish verb stems, bound nouns, Sino-Korean compounds and lexicalized compounds. Do not add test-specific exact entries. Remaining IPA notation groups (ㅟ, aspiration notation, coda release marks, liquids) need convention adjudication, not blind normalization.
- **Exact-head verification at implementation commit c7e2ce435960856a9382e79e71a8d49dc51c4e09:** system, JavaScript tests (1,364/1,364), Python 3.11/3.12/3.13, wheel/clean install, teacher corpus audit, browser build/integration, external UGTPHON benchmark, paired browser g2pK benchmark, morphology smoke/consensus, exhaustive register extraction and master-table artifacts passed.
- **Status:** research prototype; not release-ready. Independent Korean IPA review, Ukrainian target review and item-level licensing remain blockers. PR #415 remains draft and unmerged.


## 2026-11-01 — Kozak Kim discrepancy-driven exact-form corrections

- **DONE_VERIFIED:** complete `-ㄹ게` ending boundary in native Kozak Kim; positive controls (`할게`, `할게요`, `다를게`, `안타까울게`) and substring-only negative control (`올게이`).
- **DONE_VERIFIED (bounded R012 original set):** source-backed §26 fortition licenses for `출산`, `출산율`, `출산하다`, and `비출산`; Python/browser tests and negative lookalike `비출고` passed on run 41336800458.
- **PARTIAL follow-up:** add dictionary-attested `저출산` and negative `저출고` controls in Python/browser; exact-head CI and benchmark runs 41339399132/41339399053/41339399044 were queued/in progress at handoff.
- **DONE_VERIFIED diagnostic:** on 2,699 shared UGTPHON occurrences, exact match remains tied at 1,442/2,699; Kozak Kim CER improves 8.1271%→8.1228%, original g2pK CER 8.2138%; `비출산` improves one IPA edit and `출산` gains the NIKL-attested fortis surface despite an IPA convention mismatch in gold.
- **PARTIAL / TODO:** remaining §26 candidates (`실시간`, `유사성`, `이중성`) and §27 phrase candidates (`했을 시`, `일 수`) require lexical/morpheme-boundary evidence; no blanket generalization.
- **BLOCKED:** broad IPA mismatch classes need independent Korean phonetic/IPA adjudication; item-level NIKL/KOGL rights, Ukrainian target review and independent holdout remain open.
- **Release status:** research prototype; not research-certified or release-ready. Detailed paired ledger, artifact IDs and acceptance status are in `docs/KOZAK-KIM-DISCREPANCY-DRIVEN-IMPROVEMENT-2026-11-01.md` and the master handoff.



## 2026-11-01 — Kozak Kim source-backed discrepancy follow-up

- **DONE_VERIFIED §26:** exact Sino-Korean 실>시 license for 실시간, based on NIKL lexical source 實時間 plus Standard Pronunciation Rule §26. Browser/Python regression controls pass; paired browser IPA distance improves 3→2.
- **DONE_VERIFIED lexical IPA:** NIKL Basic Dictionary directly attests 이중성[이ː중썽]. Added as an exact IPA-first lexical reading in the dated additions file; long vowel and fortisness are preserved. Ukrainian target remains provisional and cannot be accepted as confirmed.
- **PARTIAL C08:** 3 of the initial 11 fortition mismatches now have source-backed repairs (비출산, 실시간, 이중성); 8 residual occurrences remain. Do not infer 했을 시 or 일 수 from unspaced corpus strings. 유사성 lacks direct exact-word attestation; no generic -성 rule.
- **DONE_VERIFIED paired diagnostic:** exact 1,442/2,699 for both; Kozak Kim CER 8.1184%, g2pK 8.2138%; paired CER delta −0.09536 pp; exact CI still crosses zero. Only two native Kozak Kim output changes vs previous post-§26 snapshot: 실시간 3→2 edit distance and source-backed 이중성 surface/IPA (distance remains 1 because gold omits length). Original g2pK unchanged.
- **DONE_VERIFIED software checks:** system 41342127230, browser g2pK integration 41342127246, native-vs-g2pK 41342127228, morphology consensus 41342127218, morphology adapter 41342127131, test-case extraction 41342127140 all PASS. Browser tests 1,368/1,368; build/generated-page checks and Python regression/data integrity PASS.
- **IN_PROGRESS:** multi-engine Charsiu/ByT5 diagnostic 41342127137 at last check; do not claim a result until completed.
- **BLOCKED:** item-level NIKL/KOGL rights (source register 147 rows; 138 review-required; metadata-only job skipped), independent Korean IPA review, Ukrainian target review, and specialist-adjudicated holdout.
- **Release status:** research prototype, not release-ready. PR #416 remains draft and unmerged.


## Kozak Kim discrepancy review continuation — 2026-11-01

- Continuation branch: `research/kozak-kim-independent-ipa-packets-2026-11-01`; final branch head: `17647b219aa4310e37d77a8dd457c73c0871ace0`.
- Stacked Draft PR #417 targets the PR #416 branch, is mergeable, and contains only the incremental review-packet, evidence-register, test, and handoff changes. PR #416 and PR #415 remain open; neither was merged or modified.
- C01–C07: seven separate source-blind pilot JSON packets (six pilot forms each), separate reviewer instructions, and an internal-only cluster/provenance index. Browser regression test verifies no system/baseline names, candidate/reference IPA, or internal artifact identifiers leak into packet JSON. Packets remain PARTIAL/BLOCKED for scoring until exact source utterances and item-level reviewer-sharing rights are restored and verified.
- C08: NIKL Q&A 327466 supports the morphology of `일 수도`; NIKL 2021 guideline p.106 confirms dependent noun `시` after `-을`; Standard Pronunciation Rule §27 supplies conditional fortition. These are conditional morphology/rule-environment leads, not exact pronunciation attestations. No production phonology change; no generalized `-성` rule.
- C08 traceability correction: cluster summary reports eight cases, but the 27-row occurrence ledger contains no C08 entries. Three source-row IDs recovered (`multilexnorm2026_1953`, `multilexnorm2026_1979`, `dc_inside_2024`); five remain unidentified. Stale “remaining cases in paired ledger” wording was corrected.
- Exact-head GitHub Actions run `41346666445`: browser regression/build PASS; Python regression/data integrity PASS; 1,369 browser tests, 0 failures; NIKL metadata-only inventory SKIPPED. Extractor run `41346594433`: PASS. Multi-engine comparison run `41344981358` completed PASS; artifact `13099523369` inspected. ByT5 and Charsiu jobs were SKIPPED.
- Current main workflow `41334227038` has a Python collection failure because `scripts.benchmark_ugtphon_ko_surface` is absent from main; the inherited PR #416 branch contains it and passes Python regression/data integrity.
- No local shell/npm/pytest/build commands were executed; all test evidence is from GitHub Actions. No original g2pK implementation file was changed.

**Disposition:** research prototype. Independent linguistic adjudication, source context, item-level rights, five missing C08 occurrence IDs, and Ukrainian target review remain open. Not release-ready.


## Supplementary paired benchmark — SIGMORPHON 2021 Korean lexical test (run 41344981358)

The completed multi-engine diagnostic artifact `13099523369` was downloaded and inspected. It pins g2pK 0.9.4 and compares the native Kozak Kim path with the same 998 paired word-level inputs:

| Metric | Kozak Kim (clippyfirst_native) | Original g2pK 0.9.4 | Paired delta (g2pK − Kozak) |
|---|---:|---:|---:|
| Exact match | 358/998 = 35.8717% | 353/998 = 35.3707% | −0.5010 pp |
| CER | 14.6225% | 14.8106% | +0.1881 pp |

Paired row-cluster bootstrap (1,000 replicates): exact-match delta 95% interval `[-1.0020, -0.1002]` pp; CER delta interval `[+0.0250, +0.3859]` pp. Pairwise audit: 5 native-only exact cases, 0 g2pK-only exact cases, 353 both exact, 640 both non-exact, and 1 native abstention while g2pK returned a non-exact output. This is a **small diagnostic advantage**, not proof of universal superiority.

**Mandatory limitations:** SIGMORPHON is a lexical word-level set, not a sentence-context or normative NIKL set; IPA conventions differ from the reference; g2pK outputs pass through the project's shared segment renderer, which may bias comparison; the benchmark does not score Ukrainian output. The bootstrap intervals are diagnostic uncertainty intervals, not a substitute for independent gold adjudication or a preregistered statistical claim. ByT5 and CharsiuG2P inference jobs were SKIPPED. g2pK source/version remained unchanged.


## C01–C07 source-context restoration — 2026-11-01

The earlier blocker “source utterance context unavailable” is superseded. All **39 unique source-row IDs** across the seven six-item pilot packets were matched to the official `naver-ai/UGTPHON/ko/test.json` (275-row Korean test split); every target token is present in its included raw sentence. UGTPHON's `ko/LICENSE` explicitly states Apache-2.0 for the Korean subset. Packets now include raw sentence context only, plus source-row provenance and attribution to UGTPHON, KoMultiText, and MultiLexNorm++; they exclude canonical text, phoneme annotations, IPA-Dict data, system outputs, and reference IPA.

**Updated status:** packet preparation is `DONE_VERIFIED`; the packets are `READY_FOR_INDEPENDENT_REVIEW_PILOT`. Independent reviewer assignment and first-pass submissions remain `TODO`. These six-item-per-cluster samples are not full cluster censuses. Preserve the Apache-2.0 notice and attribution; no raw gated MultiLexNorm++ files are redistributed. Upstream provenance/terms remain a documented limitation for broader reuse.


Training gate: the latest readiness audit finds 644 unique lexical rows but zero explicitly independently adjudicated IPA gold rows and 24 frozen holdout cases without IPA gold. Supervised IPA training remains blocked until provenance review, independent annotation/adjudication and frozen train/dev/test splits are complete.

- Exact-head Python/data integrity and browser regression/build passed on code/test head `8b22f778112442024f876061bd0e576af762e761` (push run 41357675602; PR run 41357680448). Latest native pair: run 41358068788, artifact 13104072941; native CER 9.1047% vs g2pK 9.2304%, exact match 53.0393% vs 53.1134%.
