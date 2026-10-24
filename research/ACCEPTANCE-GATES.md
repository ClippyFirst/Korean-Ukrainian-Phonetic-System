# Release Acceptance Gates

A release is not accepted merely because the build succeeds or documentation describes intended behavior. Each gate requires recorded evidence. Mark each gate not_assessed, pass, fail, or blocked; link the relevant commit, report, CI run, corpus version, or deployment check.

## Gate 0 — Repository integrity
- [ ] Default branch and commit SHA recorded.
- [ ] Branches, PRs, and relevant issues inventoried; pagination limitations noted.
- [ ] Valuable unmerged work reviewed and assigned a disposition.
- [ ] No destructive cleanup without preserving useful history.

## Gate 1 — Source and licensing
- [ ] Normative claims point to exact official source passages and article identifiers.
- [ ] Source conflicts are recorded and resolved with rationale or left explicitly unresolved.
- [ ] Third-party code/data versions and licenses are recorded.
- [ ] Attribution, redistribution, and derivative-work obligations are satisfied.
- [ ] No unsupported source-completeness claim is made.

## Gate 2 — Rule and data integrity
- [ ] Every in-scope rule has a stable identifier.
- [ ] Conditions, exclusions, ordering dependencies, and exceptions are documented.
- [ ] Canonical data is identified; generated artifacts are reproducible.
- [ ] Duplicate/conflicting rules are detected and dispositioned.
- [ ] Uncertain cases remain explicitly uncertain.

## Gate 3 — Independent evaluation corpus
- [ ] Gold examples have source/provenance metadata.
- [ ] Expected values are independently reviewed or directly sourced.
- [ ] Positive, negative, boundary, interaction, and regression cases exist.
- [ ] Holdout separation and leakage risks are documented where relevant.
- [ ] Corpus coverage and blind spots are reported.

## Gate 4 — Runtime correctness
- [ ] Relevant automated tests pass with exact commands and environment recorded.
- [ ] Korean surface pronunciation and IPA are evaluated separately from Ukrainian rendering.
- [ ] Browser, Python, CLI, and API are tested independently where supported.
- [ ] Cross-runtime differences are measured and documented.
- [ ] Error handling, unsupported input, and fallback behavior are tested.
- [ ] No silent engine substitution or confidence-status loss occurs.

## Gate 5 — Product quality
- [ ] Public interface reflects the reviewed source revision.
- [ ] IPA and Ukrainian output match the documented contract.
- [ ] User-facing uncertainty and limitations are visible.
- [ ] Accessibility, responsive layout, performance, and failure states are checked.
- [ ] Documentation and examples match released behavior.

## Gate 6 — Release and independent review
- [ ] CI/build evidence is tied to the release commit.
- [ ] Deployment is verified from the public URL or equivalent evidence.
- [ ] Relevant branch changes are integrated or explicitly deferred with reasons.
- [ ] Independent review challenges source coverage, corpus quality, architecture, and completion claims.
- [ ] Remaining defects and risks are published.
- [ ] Release decision and reviewer evidence are recorded.

## Release report template
- Release/version:
- Commit SHA:
- Date:
- Gate statuses:
- Test commands and results:
- Evaluation corpus/version and metrics:
- Cross-runtime differences:
- Deployment evidence:
- Known limitations:
- Deferred issues and rationale:
- Reviewer:
- Decision: accepted / rejected / conditional

## Current evidence snapshot — 2026-10-21

This status snapshot supersedes the untouched template checkboxes above for the current mainline and the follow-up branch. It is not a release acceptance decision.

| Gate | Status | Evidence / reason |
|---|---|---|
| 0 — Repository integrity | PARTIAL | Main at `a50ce37cb6052d74ea8ad34c0baf74a91bac7378` at session start; 173 branches inventoried across two API pages; zero open PRs and zero open issues at inspection. Sixteen relevant branches were compared with main. Most are heavily behind/diverged; no blind merges/cherry-picks were made. The branch inventory is a snapshot, not a deletion or cleanup pass. |
| 1 — Source and licensing | PARTIAL / BLOCKED | NIKL Standard Pronunciation Rules page and selected rule examples checked; upstream g2pK 0.9.4 and ntdgo package 1.0.1 metadata/licenses checked. Vendored Apache-2.0 notice and license exist. Repository-wide root LICENSE remains an owner decision; target-source reuse and Kovalchuk institutional-copy verification remain open. |
| 2 — Rule and data integrity | PARTIAL | The rule-coverage matrix is now populated for R001–R016 plus article inventory and IPA→Ukrainian mapping. Exact morphology licenses and generated-corpus gates exist. Productive morphology, full lexical coverage, and independent source adjudication remain incomplete. |
| 3 — Independent evaluation corpus | PARTIAL | The 18-case surface fixture now separates pinned-port outputs from normative comparators: 11 directly attested NIKL examples/Q&A and 7 rule-derived candidates. All 18 still have `ipaGoldStatus=not_independently_adjudicated`; there is no holdout accuracy estimate. See `docs/audits/SURFACE-REGRESSION-SOURCE-ADJUDICATION-2026-10-21.md`. |
| 4 — Runtime correctness | PASS for recorded mainline CI; follow-up branch pending CI | Mainline exact-head CI passed browser tests/build, Python 3.11/3.12/3.13, system verification, corpus artifacts, and Pages deployment. The follow-up branch exact-head CI passed: tests/build/Python 3.11–3.13 [39601258671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258671), browser G2P integration [39601258672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258672), system verification [39601258670](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258670), and corpus artifacts [39601258668](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258668). The changes are eligible for merge; scientific and owner-dependent release gates remain open. Local tests are unavailable in this API-only execution environment. |
| 5 — Product quality | PARTIAL | Public UI now states that practical mode reproduces the JS port and may differ from NIKL. A direct interactive live-site test of the full long passage, mobile/responsive behavior, and assistive-technology flow was not completed in this session. |
| 6 — Release and independent review | BLOCKED for a scientifically validated release | Mainline is a technically deployed research preview. The public HTTP and repository-fixture headless browser smokes are verified. The exact prior user-pasted passage (if different), independent IPA gold, independent Ukrainian target-policy validation, and the project-wide license decision remain unresolved. Do not label this a validated transcription standard. |

### Exact workflow evidence on the previously merged practical-mode commit

- Browser G2P integration: [39597726122](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726122)
- General tests / build / Python 3.11–3.13: [39597726175](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726175)
- System verification: [39597726128](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726128)
- Master table / corpus artifacts: [39597726141](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726141)
- Pages deployment for code merge commit: [39598199808](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39598199808)

### Follow-up branch acceptance

Branch: `fix/soft-morphology-parity-and-release-gates-2026-10-21`.

Added:
- fail-closed Python soft-liaison guard aligned with browser semantics for 어/아, ㅎ clusters, and §15-sensitive environments;
- shared cross-runtime fixture and Python/JavaScript tests;
- a source-status gate separating normative surface candidates from port expectations;
- public UI disclaimer and correction of stale manifest/status claims;
- source register and rule coverage matrix updates.

**Do not merge until CI verifies the shared parity tests and static build.** Remaining scientific and owner-dependent blockers are not merge blockers for this bounded code/docs follow-up, but they remain release blockers.


### Final exact-head CI and live browser result — 2026-10-21

Code/deployment commit `dae8ebdabb396d1be51afbe891d80c9c48a29f1c`; code-equivalent mainline docs/evidence commit `a8996112a01ec43f90b7c297b975906e4b44ab83).

- Tests/build/Python 3.11–3.13: PASS [39604039126](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039126).
- System verification: PASS [39604039157](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039157).
- Corpus generation/artifacts: PASS [39604039164](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039164).
- Pages deploy, public HTTP smoke and headless Chromium interaction: PASS [39604039154](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039154).
- The browser smoke exercised the 1,443-character repository fixture and verified non-empty Ukrainian/IPA output, the practical JS-port mode, and absence of page errors. It does not establish scientific accuracy or prove identity with the earlier user-pasted passage.


## Current native research-engine evidence snapshot — 2026-10-23

This addendum supersedes technical-gate observations from the older snapshot above; it does not change scientific/rights blockers into passes.

| Gate | Current status | Evidence / remaining acceptance criterion |
|---|---|---|
| 0 — Repository integrity | PARTIAL | PRs #257–#260 merged; exact merge commits and CI evidence are in the native-engine report and canonical handoff. Post-merge Pages deployment was not independently verified for these native-only changes. |
| 1 — Source and licensing | PARTIAL / BLOCKED | Live NIKL inventory workflow remains skipped because the source crawl is blocked (HTTP 403). Item-level KOGL markings remain unchecked for many records; project root license remains owner-dependent. |
| 2 — Rule and data integrity | PARTIAL | Raw base and every dated lexical overlay are audited for primary/alternate IPA syntax and syllable alignment. Every token must map to a core source feature vector. This does not adjudicate phonetic truth or exhaust all article subparagraphs/exceptions. |
| 3 — Independent evaluation corpus | BLOCKED_SPECIALIST_ADJUDICATION | The 20-case broad-IPA queue remains unadjudicated. Acceptance requires two distinct qualified reviewers, independent transcription/review, explicit length/boundary decisions, and documented reconciliation. Ukrainian target review is separate. |
| 4 — Runtime correctness | PARTIAL | Exact PR-head CI passed Python 3.11–3.13, web tests, system/data integrity, browser/build, generated artifacts, and optional g2pK integration. Local tests were not run in the API-only session. |
| 5 — Product / deployment | PARTIAL | Native API now retains source word/syllable boundaries and renderer preserves word spaces. Live public deployment/smoke for these specific merge commits was not checked. |
| 6 — Release / independent review | BLOCKED | Independent IPA and Ukrainian target evaluation, full rule/exception coverage, item-level rights, and source-access closure remain acceptance blockers. |

Readiness: **research preview / partial prototype**, not release-ready as a scientifically validated transcription standard. The skipped NIKL job is not a pass.


## Native empty-input fail-closed gate — 2026-10-23

| Gate | Status | Evidence / reason |
|---|---|---|
| Empty-input contract | DONE_VERIFIED at code/test head | PR #261 branch `research/native-empty-input-fail-closed-2026-10-23`; shared validation rejects empty/whitespace-only input and unsupported characters before native analysis; empty target segment lists remain unresolved. |
| Regression verification | PASS at implementation/test head `052f8ef0155be23ad86b8f58f94b8c7a5ffa3af6` | Tests/Python 3.11–3.13/web build [40006290986](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006290986); system/browser/Python integrity [40006290971](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006290971); corpus artifacts [40006290630](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006290630); optional g2pK [40006292252](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006292252). |
| Live official-source inventory | BLOCKED / skipped | The workflow's live NIKL inventory job was skipped; no pass is claimed. |
| Scientific release acceptance | BLOCKED | Independent IPA gold, Ukrainian target review, complete normative rule coverage, item-level licensing evidence, and source access remain outstanding. |
| Final PR acceptance | DONE_VERIFIED for PR #261 | PR #261 merged as `1860616a15a664ef189ffdaff50fe559aa1339a5` after final-head tests/Python 3.11–3.13/web [40006505307](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006505307), system verification [40006505329](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006505329), corpus artifacts [40006505319](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006505319), and optional g2pK [40006505314](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006505314) passed. Scientific release gates remain blocked. |


## Native IPA fortis-feature gate — 2026-10-23

| Gate | Status | Evidence / reason |
|---|---|---|
| Source fortis distinction | DONE_VERIFIED at implementation/test head | PR #262 adds `fortis` to supported source vectors and tests plain/fortis/aspirated stops and fortis affricates. |
| Registry-wide feature coverage | PASS at head `a7b159baccba147837d979e3428a6cca486662b1` | Raw base and overlay IPA audit now requires `consonantal`, `syllabic`, and `fortis`; candidate selection preserves source feature provenance. |
| Regression CI | PASS at implementation/test head | Tests/Python 3.11–3.13/web [40006952606](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952606); system/browser/Python integrity [40006952310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952310); corpus [40006952531](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952531); optional g2pK [40006952377](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952377). |
| Ukrainian target fortis policy | PARTIAL / evidence-limited | No target-side fortis feature is defined in the reviewed Ukrainian feature schema; no ranking weight or target mapping was invented. |
| Live source inventory | BLOCKED / skipped | NIKL inventory job skipped. |
| Final PR acceptance | PENDING | Re-run exact-head CI after the documentation commits. |


## Direct IPA adapter empty-input gate — 2026-10-23

| Gate | Status | Evidence / reason |
|---|---|---|
| IPA input contract | DONE_VERIFIED at implementation/test head | PR #264 validates string input before target-inventory initialization and rejects an empty supported-token sequence. |
| Regression CI | PASS at head `4c7bda56c6feda4b82b1ffa9c9028c7fb02d8ce3` | Python 3.11–3.13/web [40007944889](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007944889); system/browser/Python integrity [40007944954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007944954); corpus [40007945023](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007945023); optional g2pK [40007945019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007945019). |
| Live official-source inventory | BLOCKED / skipped | NIKL inventory job skipped, not passed. |
| Scientific release acceptance | BLOCKED | Independent IPA gold, Ukrainian target review, complete normative coverage, item-level rights evidence, and permitted source access remain outstanding. |
| Final PR acceptance | DONE_VERIFIED for PR #264 | PR #264 merged as `5bb9178243604d169c2209671a953f8683b48408` after final-head tests/Python 3.11–3.13/web [40008141619](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141619), system verification [40008141681](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141681), corpus artifacts [40008141709](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141709), and optional g2pK [40008141856](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141856) passed. Scientific release gates remain blocked. |

## Current scientific release blocker snapshot — 2026-10-23

| Gate | Status | Evidence / acceptance criterion |
|---|---|---|
| Independent IPA evaluation | BLOCKED_SPECIALIST_ADJUDICATION | Existing queue: 20 cases; reviewer A 0/20, reviewer B 0/20. Requires two distinct qualified reviewers, independent transcription, and documented reconciliation. |
| Ukrainian target evaluation | BLOCKED_SPECIALIST_REVIEW | Requires separate independent review of IPA→Ukrainian mappings, ambiguity, and orthographic readability; source IPA adjudication does not close this gate. |
| Normative rule coverage | PARTIAL, finite-example coverage mapped | The dedicated article fixture maps all 30 articles: 29 `verified`, Article 1 `not-applicable`; the separate phenomenon matrix does not prove atomic exhaustive coverage of every subparagraph, exception, variant or productive environment. |
| Source rights | BLOCKED_RIGHTS_REVIEW | Current source register has 100 data rows; item-level KOGL marking and reuse scope remain unchecked for multiple records. |
| Official-source access | BLOCKED_EXTERNAL_ACCESS | Live NIKL inventory remains skipped/blocked; do not count a skipped job as a pass. |
| Pages deployment smoke | DONE_VERIFIED for main commit `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e` | Post-merge Pages workflow [40009408019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40009408019) passed Python 3.11/3.12/3.13, browser tests/build, public HTTP smoke, and live Playwright practical-mode interaction. The new regression test on PR #268 still needs exact-head CI. |
| Release readiness | BLOCKED | Research preview / partial prototype only; no scientific release claim until independent review, atomic coverage, rights, source access and deployment gates have evidence. |

## Corrected normative-coverage and rights snapshot — 2026-10-23

The dedicated `tests/fixtures/standard-pronunciation-rule-coverage.json` maps articles 1–30 in order (29 `verified`, Article 1 `not-applicable`). The CI gate verifies evidence-index integrity, including exact test-title references. This is finite normative-example coverage, not a claim of exhaustive productive or lexical/morphological coverage. `research/RULE-COVERAGE.csv` is a separate cross-runtime phenomenon matrix.

Current main `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e` has 100 data rows in `research/SOURCE-REGISTER.csv`; multiple records still lack item-level KOGL marking review. The 20-case IPA queue has 0/20 independent submissions in each reviewer slot. The Pages smoke assertion fix is merged and post-merge public HTTP + Playwright smoke passed in run 40009408019. The live NIKL inventory step was skipped/blocked, not passed.

Readiness remains research preview / partial prototype, not a scientifically validated release.

## Post-merge Pages verification — 2026-10-23

Deployment verification is `DONE_VERIFIED` for main commit `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e`: [run 40009408019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40009408019) passed Python 3.11–3.13, browser tests/build, public HTTP smoke and live Playwright practical-mode interaction. This verifies the deployment workflow and tested UI path for that commit only. The live NIKL source inventory was skipped/blocked, not passed. The added smoke-contract regression test remains pending exact-head CI on PR #268.

## Follow-up branch — source-register rights audit, 2026-10-23

Main `b795575c0d8b122123561c682e510ed5c171b5cc` has passed tests, system verification, corpus artifact generation, and deployed Pages public HTTP + live Playwright smoke. These checks verify the current software/deployment path, not scientific correctness.

The new branch `research/source-rights-ledger-validator-2026-10-23` adds a read-only CSV parser/auditor and a conservative rights-review queue generated from `research/SOURCE-REGISTER.csv`. The report separates explicit unresolved status from ambiguous free-text status; it does not modify the register or infer legal permission. Exact-head CI is pending. Source-rights acceptance remains blocked until item-level evidence is reviewed.

The read-only rights triage on the current 100-row register yields 96 `REVIEW_REQUIRED`, 2 `MANUAL_CLASSIFICATION_REQUIRED`, 1 `ITEM_LEVEL_LICENSE_RECORDED`, and 1 `NOT_APPLICABLE_RECORDED`. These counts describe register wording only and do not grant reuse permission or replace item-level human review.

## Follow-up branch — blinded IPA review packet, 2026-10-23

Main `1f91d0c3817153d8a07004778ed916fda39d4ec5` passed tests, Python 3.11–3.13, browser G2P, system verification, corpus artifacts, and Pages live smoke ([run 40012122568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40012122568)).

The new branch `research/blinded-ipa-review-packets-2026-10-23` provides a one-way, read-only projection of the canonical 20-case IPA queue for reviewer A or B. It hashes the exact queue revision and omits candidate IPA, the other reviewer’s record, reconciliation, target review, and source notes. Exact-head CI remains required; reviewer submissions themselves are external evidence and are not simulated by code.

## Current mainline status after PR #270 / #271 — 2026-10-23

Main is `df733c7f7afdf1262bea6c46d07876d6f315ccaf`. Exact-head PR #271 CI passed 1,195 Node tests (0 failures), Python 3.11–3.13, system verification, browser G2P and corpus artifacts. Post-merge main tests, system verification, browser G2P and corpus artifacts passed. Pages run [40012736801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40012736801) completed successfully: deploy, public HTTP smoke, and live Playwright practical-mode interaction passed.

Source rights triage: 100 rows; 96 review required, 2 manual classification required, 1 item-level license recorded, 1 not applicable recorded. This is not a permission decision. IPA review tooling is ready, but independent submissions remain 0/20 in each slot. The live NIKL inventory is skipped/blocked, not passed.

## Follow-up branch — validating reviewer submissions

The branch `research/validate-ipa-review-submissions-2026-10-23` pairs the blinded packet generator with a strict returned-packet validator. The validator checks exact queue revision hash, all case IDs, unchanged source evidence, no forbidden extra fields, reviewer slot, and required review metadata/values. It does not grade IPA or assert that a reviewer is qualified. The test fixtures are synthetic only and must never be treated as linguistic evidence. Merge only after exact-head CI passes.

## Follow-up branch — NIKL article reference index

A repeatable test-reference index is proposed in `research/nikl-article-test-index-2026-10-23`. It records explicit filename and text references for articles 1–30, including missing references, without inferring unlisted range members. It is not an exhaustive coverage report. Acceptance still requires source-backed atomic rule inventory and linked positive, negative, interaction, runtime-parity, and independent-review evidence.

## Exact-main evidence checkpoint — 2026-10-23

At main snapshot `3a2052c9c27d7af6b5efa7c744d9e2ef14a70d41`, CI recorded 1205 Node tests passing with zero failures, Python 3.11/3.12/3.13 passing, browser G2P integration passing, system browser regression/build and Python integrity passing, and master table/research artifact generation passing. Pages run [40015664039](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40015664039) subsequently completed successfully, including public HTTP and live Playwright practical-mode smoke.

The official-source inventory job explicitly logged HTTP 403; its workflow handling as a nonfatal blocked dependency is not evidence that source crawling succeeded. The release gate remains blocked by independent IPA review (0/20 submissions in each slot), Ukrainian target-layer review, unproven atomic article coverage, and unresolved item-level rights (96 review-required, 2 manual classification, 1 license-recorded, 1 not applicable out of 100). The reference index is not coverage proof.


## Follow-up exact-form IPA adjudication guard — 2026-10-24

Branch: `research/native-engine-unresolved-cases-2026-10-24`; PR #281.

| Gate | Status | Evidence / acceptance criterion |
|---|---|---|
| Exact surface-Hangul evidence for 삶의 | DONE_VERIFIED | NIKL MCFAQ 5716 attests [살믜] and [살메]. These are Korean pronunciation spellings, not IPA. |
| Form-specific IPA acceptance | DONE_VERIFIED for guard behavior | The dated overlay `data/korean/lexical_additions_ipa-adjudication-2026-10-24.csv` marks the project-rendered `sal.mɰi` candidate as `diagnostic_only_unresolved_pronunciation` pending review. Native API keeps IPA inspectable, adds an `IPA_ADJUDICATION` unresolved context, and blocks Ukrainian output for this form. Regression tests cover the status and target block. |
| Runtime / data integrity | PASS at code/test state `ea14a6d9b7f332a3b88a181d841bb34841eb893d` | Tests + Python 3.11–3.13 + web build [40027594483](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594483); system verification [40027594485](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594485); corpus artifacts [40027594415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594415); optional g2pK [40027594547](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594547); UGTPHON diagnostic [40027594361](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594361). |
| Live official-source inventory | BLOCKED / skipped | The official NIKL metadata-only job was skipped; do not count as pass. |
| Independent IPA gold | BLOCKED_SPECIALIST_ADJUDICATION | Two qualified reviewers must independently adjudicate IPA convention, ㅢ realization, syllable boundaries, and accepted alternatives. |
| Ukrainian target quality | BLOCKED_SPECIALIST_REVIEW | Separate review on frozen, adjudicated IPA inputs; evaluate phonetic preservation and Ukrainian reader usability separately. |
| Compact morphology | BLOCKED_INPUT_ANALYSIS | `많이본` and `좋아보인다고` remain unresolved without explicit segmentation or validated morphology/spacing analysis. |
| Scientific release | BLOCKED | Current status remains research preview / partial prototype. CI verifies implementation, not phonetic truth or target-layer quality. |

The later commits `0348043653e7489e98e0f68dc2bb9a820e9cb99a` and `baff6c24c996fc0d92a34ef808d24a4d031d06a8` are documentation-only additions after the green code/test state; the Python/CSV/test implementation did not change after the verified code/test state. Local execution was unavailable because GitHub DNS resolution failed in this environment.


### 2026-10-24 correction after completed ㅢ literature search

- **Primary candidate updated:** 삶의 [살믜] → candidate broad IPA `sal.mi`; official alternative [살메] → `sal.me`. This follows the reported general surface pattern in Park, Cho & Han (2016), DOI 10.17959/SPPM.2016.22.1.35, but the paper does not directly measure 삶의. Both remain diagnostic-only and require independent adjudication.
- **Variation representation:** the native IPA result now exposes `ipa.lexical_alternatives`; it does not silently select the alternate as a Ukrainian target.
- **Target-layer guard:** lexical target reference is provisionally aligned to `салмі`, but the transliteration API returns no Ukrainian output while the IPA adjudication gate is unresolved.
- **Independent reviewer queue:** expanded from 20 to 21 cases, adding IPA-021 for 삶의. The extra case has an official NIKL source URL and no candidate IPA; the queue remains blinded and reviewer fields remain empty. The 20-case fixed-count assumptions in packet/validator tests were replaced with canonical queue-size assertions.
- **Source registry:** added SRC-PARK-CHO-HAN-2016-UI as limited corpus/acoustic evidence; exact-form coverage and item-level reuse rights are still unverified.
- **Verification:** system verification run 40028573329 and tests run 40028573395 passed after the IPA/queue changes; the official NIKL metadata-only job was skipped. The source-register row and corresponding expected row-count/rights-triage test were updated afterward; verify the newest CI runs before marking the full current branch green.


### Final closeout — 2026-10-24

Latest executable/test changes passed all available CI at code/test commit `30f1eab3043148193a74fb5d977033b74937726c`: [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810510), [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810736), [corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810589), [g2pK integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810621), and [UGTPHON diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810616). The official NIKL inventory was skipped. A subsequent source-register wording-only commit updated the queue count to 21; CSV structure remains valid (102 rows, 12 columns, no width errors).

The engine now uses `sal.mi` as the better-supported broad-surface candidate for [살믜], exposes `sal.me` as a separate alternative for [살메], marks both diagnostic-only, and blocks Ukrainian target output. The 21-case blinded reviewer queue includes IPA-021 삶의 with no candidate IPA and no reviewer data. Full scientific acceptance remains **BLOCKED_SPECIALIST_ADJUDICATION** and **BLOCKED_SPECIALIST_REVIEW**; release readiness remains research preview / partial prototype.

### NIKL inventory follow-up — actual execution evidence (2026-10-24)

The earlier status “skipped” described the ordinary PR run only. The gate was then explicitly executed on diagnostic branch `research/nikl-metadata-inventory-2026-10-24` using the existing metadata-only crawler and three official URL variants:

| Workflow run | Endpoint variant | Crawl outcome |
|---|---|---|
| [40029487614](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029487614) | `www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002` | BLOCKED: HTTP 403 |
| [40029571329](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029571329) | `www.korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002` | BLOCKED: HTTP 403 |
| [40029630066](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029630066) | `korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002` | BLOCKED: HTTP 403 |

The collector's exact block reason is “Official source denied or rate-limited this request (HTTP 403); do not bypass access controls.” The workflow job can conclude success because `continue-on-error` and the classifier intentionally treat this specific block as an evidence-bearing warning. This is **not** an accepted inventory: no complete manifest was emitted. The official page is visible in public search-index results, but direct open also returns 403; indexed snippets cannot prove complete 1–30 coverage or source/article hashes. The first run's log artifact is [available here](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029487614/artifacts/12533748777).

| Gate | Current status | Acceptance criterion |
|---|---|---|
| Official NIKL source inventory | **BLOCKED_EXTERNAL_ACCESS** | Obtain permitted direct retrieval or an official export; validate all 30 articles with zero missing/duplicate/incomplete records; emit and audit metadata-only source/article hashes and manifest. Do not bypass access controls or retain full text before terms review. |

This replaces “skipped” as the overall task status: the collector has now been attempted three times against approved official endpoints, with the access block evidenced and classified. The blocker remains external source access, not an unrun job or an untested parser.


## NIKL local HTML inventory update — 2026-10-24

This entry supersedes earlier descriptions of the technical inventory as merely skipped. The exact repository-held `한국어 어문 규범.htm` was parsed by the existing local-import route on dedicated branch `research/nikl-local-html-import-2026-10-24`.

| Gate | Status | Evidence / remaining acceptance |
|---|---|---|
| Article inventory from the committed HTML | DONE_VERIFIED | [Import run 40072018648](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072018648), [PR-head parity tests 40072260312](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072260312), [main schema/reproducibility run 40072283788](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283788), and [main tests run 40072283801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283801); 30/30 articles; zero missing, duplicate, unexpected, or incomplete records; metadata-only manifest at `reports/nikl/standard-pronunciation-manifest.json`; source SHA-256 `11dccd3c6eafb5167a6f448c2ccb5fc45fd698c5b2d1570ed3d1e5c177fa7a1e`. |
| Authenticity of the local capture as a complete, unmodified official response | BLOCKED_EXTERNAL_ACCESS | Direct NIKL HTTP endpoints previously returned 403; local import records no HTTP status, retrieval timestamp, or robots decision. Acceptance requires an authorized official export/capture provenance or permitted direct retrieval. |
| Rights / terms for article text and derived redistribution | BLOCKED / not_assessed | No permission is inferred from the presence of the HTML in the repository. Review applicable source terms and item-level rights before retaining or redistributing article text. |
| Human source adjudication | PARTIAL / DONE_VERIFIED for article lead-ins | All 30 article lead-ins and their first separately labelled `해설` paragraphs are recorded independently against the committed HTML snapshot; Git blob identity is checked in CI. A 19-case native-engine regression now pins source-backed Korean surface/IPA pairs and optional-reading metadata. Full subparagraph/table/example-level independent adjudication remains open; do not promote explanatory illustrations to normative gold without source classification. See `docs/NIKL-HUMAN-REVIEW-2026-10-24.md`. |
| Scientific release acceptance | BLOCKED | Independent broad-IPA adjudication and Ukrainian target-layer review remain outstanding; source inventory completion alone is not a release gate pass. |

The importer manifest is metadata-only: per-article title, anchor, normalized character count, extraction status, and SHA-256 are retained; raw HTML and article text are not. The workflow validates the schema and requires re-generated metadata to match the committed manifest except for the naturally changing `importedAt` timestamp.


### NIKL manifest schema v2 metadata boundary — 2026-10-24

The repository-held HTML inventory and schema v2 metadata-boundary correction are `DONE_VERIFIED` for technical completeness (30/30 source blocks; source SHA-256 `11dccd3c6eafb5167a6f448c2ccb5fc45fd698c5b2d1570ed3d1e5c177fa7a1e`). PR #284 changes the article `title` to the label only, records `normativeTextSha256`/`normativeCharCount`, and explicitly labels the larger block hash as including official commentary and examples. Exact-head tests [40074199214](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199214), system verification [40074199217](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199217), NIKL schema/reproducibility [40074199284](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199284), and corpus artifacts [40074199207](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199207) all passed on the tested code snapshot. Capture authenticity, source reuse terms and human rule/example spot-check remain `BLOCKED` / evidence-limited. This is not linguistic or product-release acceptance.


## Human review of saved official NIKL HTML — 2026-10-24 (PR #286)

| Task | Status | Evidence / remaining acceptance criterion |
|---|---|---|
| Article lead-in inventory and normative/explanatory separation | DONE_VERIFIED | `tests/fixtures/nikl-article-review-1-30.json` records all 30 article lead-ins and first `해설` paragraphs separately. `tests/nikl-article-review-1-30.test.mjs` verifies ordering, anchors, exact normalized text and the saved HTML Git blob SHA. |
| Cross-rule Korean surface and broad-IPA regressions | DONE_VERIFIED at tested PR head | `tests/nikl-human-review-surface-regression.test.mjs` checks 19 source-backed cases against the native engine and lexical evidence; optional readings remain explicit. CI tests run 40075240569 passed. |
| Browser/system and Python regression verification | DONE_VERIFIED at tested PR head | System verification run 40075240571 passed browser tests/build, Python regression/data integrity, and the metadata-only NIKL inventory workflow's expected blocked-dependency classification. Corpus/artifact run 40075240593 passed. Python 3.11, 3.12 and 3.13 matrix jobs passed in run 40075240569. |
| Live NIKL retrieval | BLOCKED_EXTERNAL_ACCESS | Direct official endpoints return HTTP 403. The committed HTML was used as a reproducible snapshot; no access-control bypass was attempted and the live crawl is not marked as passed. |
| Full rule/subparagraph adjudication, independent IPA gold and Ukrainian target review | PARTIAL / BLOCKED_SPECIALIST_REVIEW | The new review does not claim exhaustive human adjudication of every table, exception, cross-reference or productive environment. IPA and Ukrainian adaptation remain separate layers; release readiness remains research preview / partial prototype. |

Merged PR: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/286  
Merge commit: `c4efa90e1b24b33a8692c383f58b6bf966506871`.


## Follow-up branch — source-backed complex-coda regression expansion, 2026-10-24

| Task | Status | Evidence / acceptance boundary |
|---|---|---|
| Extend exact-form NIKL surface/IPA regression | DONE_VERIFIED pending exact-head CI | Cross-rule engine test now covers 24 source-backed Korean surface/project-IPA pairs, including five added lexical forms: 늙고[늘꼬], 않았다[아낟따], 얇은[얄븐], 읽어[일거], 헛웃음[허두슴]. A sixth case, 긁고[글꼬], is stored in `tests/fixtures/nikl-surface-only-complex-coda.json` and guarded by `tests/nikl-surface-only-complex-coda.test.mjs`; its source is NIKL Online Q&A qna_seq=328946, https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=328946. The surface is attested, but the source supplies no IPA, so the engine remains unresolved and the form is not added to the lexical IPA/target table. |
| IPA provenance | PARTIAL / project analysis | The cited NIKL pages attest Hangul pronunciation spellings, not IPA. Broad IPA values are explicit project analysis and must remain independently adjudicated. |
| Ukrainian target | BLOCKED_SPECIALIST_REVIEW | Target syllables remain provisional and are not normative gold labels. |
| Generalization to productive morphology / unseen compounds | BLOCKED_INPUT_ANALYSIS | Exact-form examples must not be generalized to all ㄼ/ㄺ stems or unknown compounds without evidence and morphology. |
| Release readiness | BLOCKED | Research preview / partial prototype. The independent IPA queue, Ukrainian target review, source rights and permitted live-source retrieval remain open. |

Current branch: `research/nikl-cross-rule-complex-coda-regressions-2026-10-24`. Exact-head CI is required before merge.


The first exact-head CI run for PR #288 exposed an important acceptance failure: adding `긁고` to the lexical table changed its Python status from `unresolved` to `provisional`, even though the source only attests Hangul surface spelling and does not provide IPA. That promotion was reverted. The source is now preserved in a separate surface-only fixture with `ipa_candidate: null`, `ukrainian_target: null`, and an explicit unresolved expectation. The five other new exact-form regressions use already-existing project IPA candidates and do not claim independent IPA gold.
