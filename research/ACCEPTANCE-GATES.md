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
| Extend exact-form NIKL surface/IPA regression | DONE_VERIFIED — PR #288 merged | Cross-rule engine test covers 24 source-backed Korean surface/project-IPA pairs, including five added lexical forms: 늙고[늘꼬], 않았다[아낟따], 얇은[얄븐], 읽어[일거], 헛웃음[허두슴]. A sixth case, 긁고[글꼬], is stored in `tests/fixtures/nikl-surface-only-complex-coda.json` and guarded by `tests/nikl-surface-only-complex-coda.test.mjs`; its source is NIKL Online Q&A qna_seq=328946, https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=328946. The surface is attested, but the source supplies no IPA, so the Python pipeline's existing unresolved-status guard remains in force and the form is not added to the lexical IPA/target table. |
| IPA provenance | PARTIAL / project analysis | The cited NIKL pages attest Hangul pronunciation spellings, not IPA. Broad IPA values are explicit project analysis and must remain independently adjudicated. |
| Ukrainian target | BLOCKED_SPECIALIST_REVIEW | Target syllables remain provisional and are not normative gold labels. |
| Generalization to productive morphology / unseen compounds | BLOCKED_INPUT_ANALYSIS | Exact-form examples must not be generalized to all ㄼ/ㄺ stems or unknown compounds without evidence and morphology. |
| Release readiness | BLOCKED | Research preview / partial prototype. The independent IPA queue, Ukrainian target review, source rights and permitted live-source retrieval remain open. |

Merged PR: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/288  
Merge commit: `94b59752ebcd9b38f0e7a537dd662e3fea1f3ac4`. Exact-head CI at PR head `57365db812f7d428ccfc6434121c2233d1f0d8db` passed: 1,213 Node tests (0 failures), Python 3.11/3.12/3.13, browser tests/build, Python regression/data integrity, and corpus artifact generation. Run links: [tests 40075912255](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912255), [system verification 40075912274](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912274), [corpus artifacts 40075912368](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912368). [Paired native-vs-g2pk diagnostic 40075912232](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912232) and [UGTPHON diagnostic 40075912262](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912262) passed. The multi-engine diagnostic benchmark [40075912330](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912330) was still running at the last check; its result is not claimed here.


The first exact-head CI run for PR #288 exposed an important acceptance failure: adding `긁고` to the lexical table changed its Python status from `unresolved` to `provisional`, even though the source only attests Hangul surface spelling and does not provide IPA. That promotion was reverted. The source is now preserved in a separate surface-only fixture with `ipa_candidate: null`, `ukrainian_target: null`, and an explicit unresolved expectation. The five other new exact-form regressions use already-existing project IPA candidates and do not claim independent IPA gold.


## Post-merge verification — complex-coda review follow-up, 2026-10-24

| Task | Status | Evidence |
|---|---|---|
| Exact-form regression expansion and surface-only guard | DONE_VERIFIED | PR #288 merged to main as `94b59752ebcd9b38f0e7a537dd662e3fea1f3ac4`; source-backed IPA candidates are regression-pinned separately from the `긁고` surface-only evidence. |
| JavaScript regression suite and production build | PASS | [Workflow 40075912255](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912255): 1,213 tests, 1,213 passed, 0 failed; build passed. |
| Python matrix | PASS | Python 3.11, 3.12 and 3.13 jobs passed in workflow 40075912255. |
| Browser/system verification | PASS | [Workflow 40075912274](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912274): browser tests/build and Python regression/data integrity passed. The metadata-only NIKL job's success is not a claim that the live crawl succeeded. |
| Generated corpus / research artifacts | PASS | [Workflow 40075912368](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912368). |
| Paired native-vs-g2pk and UGTPHON diagnostics | PASS | [Workflow 40075912232](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912232); [workflow 40075912262](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912262). These are diagnostics, not independent phonetic gold. |
| Multi-engine IPA benchmark | PASS as diagnostic execution | [Workflow 40075912330](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912330) completed and emitted artifact [12552947424](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912330/artifacts/12552947424). Metrics and limitations are recorded below; this is not normative gold evaluation. |
| Scientific release acceptance | BLOCKED | Independent IPA gold, Ukrainian target-layer review, full subparagraph/table adjudication, source-rights review and permitted live NIKL retrieval remain open. |


### Multi-engine benchmark outcome (2026-10-24)

Artifact: [multi-engine-korean-ipa-diagnostic.zip](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912330/artifacts/12552947424), benchmark `multi-engine-ipa-diagnostic-v1`. Dataset: 275 rows, 2,703 eligible Hangul token occurrences, 1,907 unique words. The reference set is the noisy user-generated UGTPHON Korean test split, not a balanced official pronunciation standard. Scores are diagnostic only; normalization preserves fortis, aspiration and length, while stripping a defined set of narrow diacritics and separators.

| Engine | Exact match | Character error rate | Coverage | Abstentions / unresolved |
|---|---:|---:|---:|---:|
| ClippyFirst native | 24.41% (95% CI 22.12–26.97%) | 17.06% | 98.22% | 48 |
| g2pk 0.9.4 | 24.97% (95% CI 22.80–27.38%) | 16.69% | 100% | 0 |
| phonemize 2.0.1 | 20.05% | 21.36% | 100% | 0 |
| hangul_to_ipa | 14.95% | 30.99% | 100% | 0 |
| KoG2P | 14.87% | 26.08% | 100% | 0 |
| eSpeak NG Korean | 8.14% | 39.05% | 100% | 0 |

**Interpretation:** the native engine's point exact-match score is slightly below g2pk on this dataset, with overlapping bootstrap intervals; it abstains on 48 token occurrences rather than forcing output. These scores do not establish which IPA is correct because UGTPHON annotations are not a fully adjudicated independent gold set, and the g2pk adapter shares parts of the project's representation layer. The benchmark does not evaluate Ukrainian adaptation. It is evidence that the diagnostic pipeline executes reproducibly, not a release-acceptance pass for linguistic correctness.


## Exact-head verification update — 2026-10-26 (research continuation)

This update supplements the older snapshot above; it does not turn historical checkboxes into a release approval.

| Gate | Current status | Evidence / remaining acceptance criterion |
|---|---|---|
| 0 — Repository integrity | PARTIAL | Default `main` remains `a452054a669de28426404d1110731715083423bb`. Research branch `research/strict-teacher-guided-rule-mining-2026-10-26` carries a large, long-lived research delta and PR #339 remains open/Draft; do not merge it wholesale merely because individual workflows pass. Isolated fixes #342 and #343 were merged into the research branch only. |
| 1 — Source and licensing | BLOCKED/PARTIAL | NIKL live source inventory remains skipped in metadata-only CI due to access restrictions; root project license is still an owner decision; IPA symbol conventions and Ukrainian target policy need independent review. Do not infer rights from third-party license notices. |
| 2 — Rule and data integrity | PARTIAL | Fail-closed, loss-preserving register generator is verified. Exact-head artifact on merged research commit `19832224daab7d17b56df75485bb5461ea3c9ef9`: 644 lexical records, 359 test files, 387 source files, 6,801 lexical-to-test text links, 34,573 source lines, 5,241 assertion/test-declaration candidates; artifact ZIP SHA-256 `28271fcbf18402e8046399721e6c6be1db42d4998e94d6f2dee7c9ca9d0b223e`. Candidate links/lines are not a semantically adjudicated case register. |
| 3 — Independent evaluation corpus | BLOCKED/PARTIAL | Scratch teacher and pinned corpus workflows are research-only. Cross-source IPA convention mapping remains unadjudicated; the 24-form holdout and native strict cases must not be used to fit rules. Acceptance requires independent source-specific IPA mapping and a truly held-out evaluation set. |
| 4 — Runtime correctness | PASS for the isolated merged research head; overall branch still under current-head verification | On merged research commit `19832224daab7d17b56df75485bb5461ea3c9ef9`, [system verification run 40408709236](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709236) passed browser regression/build and Python regression/data integrity; [register run 40408709171](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709171) passed inventory generation and stable-ID checks. The exact current research head `256b27a454c992218ca87a0fdf58ea6135071560` has a new full workflow batch in progress; do not extrapolate the prior green run to that head. |
| 5 — Product quality | PARTIAL | Passing CI does not independently verify the complete long-text UX, accessibility, mobile behavior, or public Pages deployment for the latest code. |
| 6 — Release and independent review | BLOCKED | Still a research-ready partial prototype. Release acceptance requires independent Korean phonetic adjudication, Ukrainian adaptation review, source/license resolution, current-head full CI, and public deployment confirmation. |

### Exact-head CI batch currently running

On research head `256b27a454c992218ca87a0fdf58ea6135071560`, workflow runs were observed in progress: tests `40410859903`, system verification `40410859949`, case-register extraction `40410859892`, browser G2P integration `40410859840`, UGTPHON diagnostic `40410859897`, paired native-vs-g2pk diagnostic `40410859885`, morphology consensus `40410860218`, morphology adapter smoke `40410859942`, multi-engine IPA diagnostic `40410860080`, optional g2pK integration `40410859938`, scratch teacher training `40410859771`, Charsiu comparisons `40410860096`, and corpus split audit `40410860054`. Their existence/status is not a pass; refresh exact conclusions before any promotion or merge decision.


### Latest PR #339 merge-ref CI outcome (2026-10-27)

The code/test snapshot was research head `256b27a454c992218ca87a0fdf58ea6135071560`, tested as synthetic merge commit `348a3dc18764191f68339333ce24bc0f54e2c523` into main `a452054a669de28426404d1110731715083423bb`. Subsequent continuation commits updated only the handoff, case register, and acceptance-gate documentation; they did not change the runtime/test code represented by those runs.

- PASS: test matrix [40410859903](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859903), including Python 3.11/3.12/3.13, wheel, web and teacher corpus audit.
- PASS: system verification [40410859949](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859949); browser regression/build and Python integrity passed. Official NIKL inventory was skipped, not passed.
- PASS: case-register extraction [40410859892](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859892); browser G2P [40410859840](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859840); paired native-vs-g2pk [40410859885](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859885); UGTPHON diagnostic [40410859897](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859897); morphology consensus [40410860218](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860218); morphology adapter smoke [40410859942](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859942); g2pK integration [40410859938](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859938); teacher split audit [40410860054](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860054); scratch teacher training [40410859771](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859771).
- PASS: multi-engine IPA comparison [40410860080](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860080).
- STILL RUNNING at last poll: Charsiu train/dev [40410860096](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860096); the log endpoint returned `BlobNotFound`, so its final result remains unknown.

The repository remains a research-ready partial prototype, not release-ready. PR #339 is still Draft/open and 566 commits ahead of main; green individual CI does not independently establish pronunciation gold, Ukrainian target correctness, licensing completeness, or semantic case-register completeness.


## IPA profile / teacher-triage continuation — 2026-10-27

- Seed portfolio failure on 4379463aab4f5a829c61ed666deb28cafffa1a6e was a hard-coded 994-pair expectation; same-seed checkpoint and prediction hashes were identical. Triage logic now validates subset membership and identical pair-ID sets across seeds without assuming a fixed number of resolved Strict cases.
- Python and browser IPA output now include versioned profile metadata fields; the shared fixture records separate runtime outputs as UNADJUDICATED and target-adapter eligibility UNVERIFIED.
- The current sibilant evidence does not justify selecting s͈ vs ɕ͈ categorically for tense ㅆ. See the updated source register and KOREAN-IPA-RUNTIME-PROFILE-CONTRACT-2026-10-27.md.
- Exact-head workflows for the updated code/tests remain QUEUED at this update; the local clone attempt is BLOCKED by DNS resolution. No test pass is claimed for the latest changes.
- Gate statuses: seed triage PARTIAL pending exact-head CI; typed IPA metadata PARTIAL pending CI and adapter eligibility enforcement; cross-runtime phonetic parity BLOCKED / UNADJUDICATED; Ukrainian target changes DEFERRED. Keep PR #339 Draft.

## Opt-in strict IPA gate implementation — 2026-10-27

- Browser API: createEngine().convert(text, {requireAdjudicatedIpaProfile:true}) and convertSurface() use the fail-closed profile adapter. Strict mode suppresses accepted Ukrainian output and removes Ukrainian target text from trace/variant fields. Regression coverage includes simple, surface-mode, and mixed-script lexical early-return input.
- Python API: transliterate_korean(..., require_adjudicated_ipa_profile=True) uses render_profiled_ipa_to_ukrainian() after unresolved-phonology and diagnostic-only guards. Broad unadjudicated and narrow partial profiles remain unavailable.
- These are opt-in migration paths only. The default browser and Python compatibility routes remain, so exclusive production routing is still TODO and the default runtime must not be described as IPA-profile-approved.
- Latest code head at gate update: 4456d47393313090cb17115494a6ce85347fa121; tests 40517742289, system verification 40517742426, and browser integration 40517742266 were QUEUED. No exact-head pass is claimed. Official NIKL live inventory remains SKIPPED; local tests remain blocked by DNS.
- Gate statuses: strict opt-in code/tests PARTIAL pending exact-head CI; exclusive production gate TODO; broad/narrow and ㅅ/ㅆ adjudication BLOCKED; target-inventory review DEFERRED; source-rights clearance PARTIAL. Keep PR #339 Draft and do not release.



## Verification refresh — unresolved strict-gate regression — 2026-10-27

- Added a Python regression for 앉어라 to assert the opt-in profile gate cannot override unresolved Korean phonology. Commit: e12746255f576dd416587ff17cb20f59fc07ecc1.
- Browser G2P integration run 40517742266 completed SUCCESS on earlier code head 4456d47393313090cb17115494a6ce85347fa121. This is valid evidence for that browser snapshot only, not for the later Python test or latest branch head.
- Python/web/wheel/teacher-corpus test matrix 40517742289 remains QUEUED; system verification 40517742426 remains QUEUED for Python regression/data integrity and browser regression/build. NIKL source inventory remains SKIPPED. Latest branch-head lookup returned no associated PR-triggered runs and no combined status entries.
- Status remains PARTIAL: exact-head verification is not complete. Do not mark the suite green or treat this as release-ready.


## Exact-head gate status refresh — 2026-10-27

Current branch state at the preceding handoff update: `ff7841d3f49ffbe910ba031647828a34e7ad5baa`; audit and handoff ledger updates have since been committed. These statuses are conservative and do not imply the current documentation-only head has been tested.

| Gate | Status | Acceptance condition |
|---|---|---|
| Browser/Python opt-in profile gate | PARTIAL | Shared negative fixture and runtime consumers exist; exact-head CI must pass. |
| Unresolved Korean phonology must abstain | PARTIAL | Regression for `앉어라` is committed; exact-head Python/system workflow must pass. |
| Exclusive default target path | TODO | Eliminate raw-IPA bypass only after approved profile and migration tests; preserve compatibility until safe. |
| Compatible IPA profile allowlist | BLOCKED | Independent broad/narrow adjudication, source-backed versioning, and cross-runtime agreement required. |
| Ukrainian target inventory | BLOCKED | Review follows accepted IPA; current mapping tests are not linguistic approval. |
| Official NIKL source inventory | BLOCKED | Current CI metadata-only job skips it; supply verifiable official local/source evidence. |
| Teacher/checkpoint and source rights | BLOCKED | Exact weights/data licensing and provenance need verification; no model use or redistribution. |
| Exact-head automated checks | PARTIAL / WAITING | Latest observed runs on prior head `650465730888a1c852f242c41d1c60b1baac3371`: tests `40520590812`, system `40520590789`, browser integration `40520590788`, and Charsiu queue `40520590865` were all QUEUED; NIKL inventory was SKIPPED. Empty combined status is not success. |
| Release gate | DEFERRED | Research-ready partial prototype only; not release-ready. |

Do not mark any gate green until evidence meets the stated acceptance condition. Do not switch the strict profile gate on by default while its allowlist is empty.


## Exact-head CI verification refresh — 2026-10-27

Current research branch head at verification: `17faadd59c3457ab7bf53ce26a86bba940403235`. All 16 discovered workflow runs on this exact SHA completed with successful workflow conclusions. Core evidence: [tests matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287118) passed wheel-install, Python 3.11/3.12/3.13, web tests/build, and teacher corpus audit; [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287327) passed browser regression/build and Python regression/data integrity. The official NIKL source inventory sub-job was skipped by workflow condition, not passed. Other successful exact-head workflows covered browser G2P, optional g2pK, Charsiu train/dev research comparison, multi-engine IPA diagnostics, morphology adapter smoke, corpus split audit, master/corpus generation, teacher training/seed portfolio, case-register extraction, morphology consensus, paired native-vs-g2pk, and UGTPHON diagnostics.

| Gate | Updated status | Evidence / remaining acceptance condition |
|---|---|---|
| Opt-in browser/Python adjudicated-profile gate and negative-fixture regressions | **DONE_VERIFIED** | Exact-head test matrix and system/browser regressions passed; this verifies fail-closed behavior, not a linguistic profile approval. |
| Preserve unresolved Korean phonology before target adaptation | **DONE_VERIFIED** | Python regression for `앉어라` passed in exact-head Python/system suite. |
| Exclusive default target path; remove raw-IPA bypasses | **TODO** | Requires independently approved profile and migration tests; compatibility defaults remain intentionally unchanged. |
| Compatible IPA profile allowlist | **BLOCKED** | Independent broad/narrow adjudication, source-backed profile version, cross-runtime agreement and explicit review required; allowlist remains empty. |
| Ukrainian target inventory | **BLOCKED** | Must be reviewed only after source IPA profile acceptance; mapping tests alone do not constitute linguistic approval. |
| Official NIKL source inventory | **BLOCKED / SKIPPED** | CI job was skipped by workflow condition; verifiable official source evidence still required. |
| Teacher/checkpoint and source rights | **BLOCKED** | Checkpoint license, training-data provenance and applicable redistribution permissions remain unverified. |
| Exact-head automated verification | **DONE_VERIFIED** | Relevant workflow runs for `17faadd59c3457ab7bf53ce26a86bba940403235` completed successfully; local tests were not run due DNS. |
| Release readiness | **DEFERRED** | Research-ready partial prototype only; not release-ready. |

PR #339 remains open/Draft/unmerged. Do not enable strict mode globally while the allowlist is empty, do not infer IPA or Ukrainian gold from teacher outputs, and do not treat a skipped NIKL job or successful software tests as resolution of the evidence/licensing gates.

## Addendum — Revised Romanization feature gate (2026-10-28)

Feature status: **PARTIAL / in review**, tracked by [PR #354](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/354).

- [ ] Verify exact-head CI for `npm test`, `npm run build`, browser interaction/copy behavior, and Python/data-integrity regressions.
- [x] Keep RR as a separate diagnostic branch from resolved Hangul surface; do not route RR through IPA or Ukrainian target generation.
- [x] Add official NIKL surface-example regression cases and a structural sweep across all 11,172 modern Hangul syllables.
- [x] Fail closed in the UI when no resolved surface form is supplied.
- [ ] Build and review a full source-backed RR matrix covering consonant position/allophones, liquid conventions, phonological changes, word boundaries, capitalization, and mixed scripts.
- [ ] Compare outputs against a trusted, independently verified RR implementation or complete official examples, documenting disagreements rather than tuning against the same fixture alone.
- [ ] Confirm rendered page, mobile layout, accessibility text, and copy action in browser tests.
- [ ] Do not implement reverse romanization until a separate spec defines ambiguity, candidate enumeration, confidence/status, and unsupported input behavior.

**Evidence currently available:** isolated Node.js harness, 6/6 tests passed including the 11,172-syllable structural sweep. In addition, CI passed on code/test snapshot `0dcde24374f1a67c38f00f44687c7a1e4a024a51`: browser regression/build, Python regression/data integrity, `npm test`, `npm run build`, Python 3.11/3.12/3.13, and corpus audit jobs. See [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40680654498), [browser G2P](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40680654450), and [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40680654400). Official NIKL source inventory was skipped. Later commits were documentation-only; latest-head CI is not yet confirmed. See `docs/KOREAN-ROMANIZATION-RR-2026-10-28.md` and the corresponding entry in `research/ROADMAP.md`.

**Release rule:** the feature must not be described as fully NIKL-conformant or merged solely on the basis of structural syllable coverage or the current example tests.

## Kozak Kim browser G2P / IPA-first acceptance refresh — 2026-11-01

Code-bearing head verified: `d66d02889ffcf405dc9f927a61d3da69fbfe8697`. PR #415 remains open and separate from PR #411.

| Gate | Status | Evidence / remaining acceptance |
|---|---|---|
| Pronunciation status independent from Ukrainian target availability | DONE_VERIFIED | Browser engine returns resolved IPA when only IPA→Ukrainian mapping is provisional/unavailable; composed lexical paths carry an aggregate pronunciation status. Exact-head browser/system CI passed. |
| Strict abstention for genuinely unresolved Korean morphology | DONE_VERIFIED | `읽게` regression confirms unresolved IPA is withheld. A previously used fixture `밭이` is source-backed in the lexical inventory and therefore is not a valid unresolved-morphology fixture. |
| Super-soft literal/Jamo preservation | DONE_VERIFIED | Explicit Super-soft mode preserves standalone compatibility/decomposed jamo and non-Korean literals; strict mode remains fail-closed. |
| NIKL lexical fortition exceptions | DONE_VERIFIED for two exact entries | 사건[사ː껀] and 인기[인끼] are source-backed; 인기 retains the non-fortis alternative. IPA is project-derived; Ukrainian target is provisional. No generic Sino-Korean fortition rule is introduced. |
| Browser strict UGTPHON diagnostic | DONE_VERIFIED as diagnostic | Exact head: 1,428/2,699 exact (52.9085%), CER 8.2571%, coverage 99.852%, 4 unresolved, 0 engine errors. This is not normative accuracy or an untouched holdout. |
| Broad IPA sensitivity profile | PARTIAL / RESEARCH-ONLY | 2,495/2,699 exact (92.4416%), CER 1.3562%. This profile collapses selected narrow allophones and sibilant aspiration for comparison only; it is not independently adjudicated and does not replace strict metrics. |
| Native vs g2pK comparison | DONE_VERIFIED as paired diagnostic | Common 2,698 tokens: native 53.0393% exact / 9.1351% CER; g2pK 53.1134% / 9.2304%. Small exact-match edge to g2pK, lower CER for native; no winner established. |
| Multi-engine comparison | PARTIAL / IN_PROGRESS | Workflow 41309605046 still running at this update; CharsiuG2P and ByT5 sub-jobs skipped by default-off gates. Do not claim a result for them. |
| Independent Korean IPA profile adjudication | BLOCKED | Qualified Korean phonetics reviewer and independent broad/narrow IPA gold required. |
| Ukrainian target mapping review | BLOCKED | Independent Ukrainian target gold/reviewer required; software mapping tests do not establish linguistic approval. |
| NIKL and upstream dataset licensing | BLOCKED | NIKL item-level reuse mark not checked. UGTPHON README states Korean subset Apache-2.0; IPA-Dict credits Korean data CC BY-SA. Verify provenance/compatibility before redistribution or release. |
| Sentence-context normalization of raw UGT | DEFERRED to separate stage | UGTPHON paper shows Korean benefits primarily from sentence context; do not fold canonical-form inference into phonological rules. Requires a separate specification, train-only retrieval, ambiguity/abstention policy and per-category evaluation. |
| Release readiness | DEFERRED | Research prototype / diagnostic engine only; not research-certified or release-ready. |

**Evidence:** tests [41309605110](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605110); browser integration [41309605037](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605037); system verification [41309605032](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605032); browser UGTPHON diagnostic [41309605083](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605083); paired native/g2pK diagnostic [41309605065](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605065). NIKL metadata-only job was skipped, not passed.



## Follow-up — source-backed G2P benchmark corrections (2026-11-01)

PR #415 continues to add exact-form evidence, but the new code is **PARTIAL pending exact-head CI**.

- Added NIKL Q&A-backed `실수[실쑤]` as one exact §26 full-form license in both browser and Python rule inventories. No productive generalization was introduced.
- Added Korean Basic Dictionary `한자[한ː짜]` as a variant-aware lexical entry, preserving the dictionary long vowel. IPA is project-derived; Ukrainian target remains provisional.
- Tightened Python's provisional lexical-target gate so no non-null Ukrainian orthography is accepted while the lexical target status is provisional, even without a reference target string.
- Source register: 139 CSV records, 12 columns each; rights classification 1 item-level license recorded, 1 not applicable, 130 review-required, 7 manual-classification-required.

**Projected benchmark effect only:** recalculation of the prior browser artifact projects strict CER 8.2571% → 8.2441%, with strict exact unchanged at 52.9085%; broad-candidate exact 92.4416% → 92.4787%. These are not new measurements. Current branch needs a new exact-head browser run.

**CI blocker:** connector-created commits have not emitted new workflow runs after the last verified d66 code head; no workflow-dispatch action is available in the connected GitHub toolset. Local GitHub access is unavailable. Require an event-capable push or manual Actions dispatch before promotion to DONE_VERIFIED.

| Gate | Status | Evidence / remaining acceptance |
|---|---|---|
| Exact NIKL §26 form 실수[실쑤] | PARTIAL | Source verified and mirrored in JS/Python; new regression tests not run at exact head. |
| Dictionary-backed 한자[한ː짜] | PARTIAL | Official dictionary form verified; long vowel preserved; JS/Python tests not run at exact head. |
| Provisional lexical target fail-closed behavior without target-reference string | PARTIAL | Python guard and regression added; needs exact-head Python suite and wheel test. |
| Updated source-register structure and rights totals | PARTIAL | CSV parsed as 139 × 12; exact-head Node/Python register gates still required. |
| New direct browser UGTPHON score | BLOCKED | Previous artifact is pre-change; projected deltas are not a benchmark run. |
| Release readiness | BLOCKED / DEFERRED | Korean IPA adjudication, Ukrainian target review, item-level source-rights checks and exact-head CI remain open. |


## Canonical IPA benchmark convention sensitivity — 2026-11-01

Direct browser artifact [41309605083](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605083): 2,699 tokens; strict exact 52.9085%, CER 8.2571%. Research-only broad-candidate sensitivity: exact 92.4416%, CER 1.3562%. Of 1,271 strict mismatches, 1,067 (83.95%) become exact under the broad candidate profile; 204 remain.

**Interpretation:** strict exact match is highly sensitive to IPA annotation conventions (allophones, ㅟ, vowel length, unreleased codas, sibilant aspiration). The broad profile is unadjudicated and is not a gold metric. The remaining mismatches require source-backed review, not heuristic tuning. The two new lexical corrections have only projected, not measured, deltas.


## Measured source-backed G2P correction benchmark — 2026-11-01

**DONE_VERIFIED for the direct browser diagnostic:** workflow [41311996175](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41311996175), code-bearing head \`00ac99a93c6ba8c64d66588e8a7e86aec3cfff7c\`.

- 2,703 eligible / 2,699 scored; coverage 99.852%; 4 unresolved; 0 engine errors.
- Strict exact 52.9085% unchanged; strict CER 8.2571% → **8.2441%**.
- Broad-candidate exact 92.4416% → **92.4787%**; broad-candidate CER 1.3562% → **1.3427%**.
- \`실수\` output \`ɕil.s͈u\`, broad-candidate exact; strict mismatch remains due allophone conventions. \`한자\` output \`haːn.tɕ͈a\`, strict distance 1 because gold omits the dictionary long vowel. The long vowel remains preserved and Ukrainian target is provisional.

This confirms a modest edit-distance improvement, not an exact-match increase. Broad-candidate results remain unadjudicated sensitivity analysis.

**DONE_VERIFIED as a comparison, not as a replacement decision:** paired native/g2pK run on 2,698 tokens: native 53.0393% exact / 9.1220% CER; g2pK 53.1134% / 9.2304%. The tiny exact advantage does not compensate for worse CER; keep native as default.


## Latest 한자 lexical-row regression repair (2026-11-01)

Browser regression run 41311996128 failed two new checks: target-syllable alignment (empty target field) and provisional candidate suppression (the 12-field row placed `variant-aware-research` in the wrong column). The row is corrected to 13 columns, target candidate `ган|чча`, and `input_kind=variant-aware-research`. The candidate is explicitly project-generated and provisional; it is not dictionary-sourced Ukrainian. CSV alignment is statically verified. Exact-head browser/Python tests for commit `eba968b383e1ae4ca8ebb52094c3f2d32439e315` are pending.


## Python raw-surface benchmark import repair — 2026-11-01

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Diagnose Python suite failure | DONE_VERIFIED | Actions 41313216461 and 41313216444 logs show test collection failed because `tests/test_ugtphon_surface_benchmark.py` imported missing `scripts.benchmark_ugtphon_ko_surface`. Browser build/regression passed in system run; Python job failed. |
| Restore existing benchmark implementation | PARTIAL | Restored the existing PR #411 implementation on PR #415 in commit `c069031a6cea830ad4d5f00fcf5314b5dd1e8e12`; no new prediction logic or runtime pronunciation rule added. |
| Exact-head Python/browser/system CI | TODO | Re-run on the repair commit; require Python 3.11/3.12/3.13, Node suite/build, wheel install, data-integrity and system verification. |
| Exact-head UGTPHON raw-surface and paired benchmark | TODO | Re-run against pinned train/test splits; report raw baseline, train-only retrieval, paired deltas, abstentions and false rewrites separately. |

The previous failed tests are not to be counted as passing, and the restored file is not DONE_VERIFIED until exact-head CI confirms the import and all tests. The repair changes test/benchmark availability only; it does not claim a G2P accuracy improvement.


### Follow-up: paired-metric test contract synchronized (2026-11-01)

The current-main commit `7bbbd7e7ce888a9c995bb70959e17858263c07a8` added a multi-reference regression to `tests/test_ugtphon_surface_benchmark.py`. PR #415 now carries that exact test module alongside the restored implementation. Latest PR branch code/test tip before this documentation-only update: `85facdd7d2a882da58d3b27eeab9a65c046be461`. GitHub reports the PR mergeable, but it remains one commit behind current main. Exact-head Python/browser/system CI and a fresh benchmark are still TODO; local execution remains blocked by GitHub DNS resolution.


## Latest direct browser / paired native-vs-g2pK evidence — 2026-11-01

- Direct browser benchmark [41313216356](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41313216356): 2,703 eligible / 2,699 scored; coverage 99.852%; 1,428 exact (52.9085%); coverage-adjusted exact 52.8302%; CER 8.2441%; 4 unresolved; 0 engine errors. IPA profile remains unadjudicated cross-runtime.
- Paired native/g2pK benchmark [41313216411](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41313216411): native 53.0393% exact / 9.1220% CER / 5 abstentions; g2pK 53.0892% exact / 9.2285% CER / 0 abstentions. On 2,698 common tokens, g2pK's exact delta is +0.0741 pp with 95% CI [-0.0824, +0.2840] pp (not significant); CER is worse by +0.1084 pp with 95% CI [+0.0234, +0.2038] pp. Recorded unique-word runtime: native 363 ms vs g2pK 16,733 ms, including Python adapter overhead.
- Multi-engine run [41313216374](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41313216374) confirms this pattern. Keep native Kozak Kim as default; g2pK is not a statistically convincing exact-match improvement and has worse CER/runtime. CharsiuG2P and ByT5 were skipped by default-off gates.
- Browser integration [41313216398](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41313216398) passed. Node tests passed 1,356/1,356 and browser build passed in 41313216461. Python test collection failed because the raw-surface benchmark module was missing; system verification 41313216444 failed its Python job for the same reason, while browser regression/build passed.

The benchmark results are valid for the engine code present in the run, but do not verify the later restored raw-surface benchmark module. Exact-head Python 3.11–3.13 suite, wheel test, system verification and rerun of the raw-surface benchmark remain TODO after repair commit `c069031a6cea830ad4d5f00fcf5314b5dd1e8e12`.


## 2026-11-01 — exact-head raw-surface and Python CI verification

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Restore raw-surface benchmark module and current tests | DONE_VERIFIED | PR #415 contains `scripts/benchmark_ugtphon_ko_surface.py` and its tests; exact-head Python test matrix [41325015110](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325015110) passed on Python 3.11/3.12/3.13. |
| Fix three Python regression assertions without weakening the engine | DONE_VERIFIED | Broad IPA test now matches broad profile for `실수`; source-register word check is case-insensitive; paired raw/normalized evaluator test expects both G2P calls and asserts false-rewrite reporting. |
| Synchronize PR branch with current main | DONE_VERIFIED | Merge commit `20fec483165ea170c9944df0704f04414c5590ec` includes current main `7bbbd7e7ce888a9c995bb70959e17858263c07a8`; comparison at sync: 79 ahead / 0 behind. |
| Python regression and data-integrity suite | DONE_VERIFIED | System run [41325014981](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325014981) PASS. |
| Python 3.11/3.12/3.13, web, wheel, teacher-corpus audit | DONE_VERIFIED | Test matrix [41325015110](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325015110) PASS. |
| Browser tests and build | DONE_VERIFIED | System [41325014981](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325014981) PASS; browser suite 1,356/1,356. Browser G2P integration [41325014980](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325014980) PASS. |
| Verify pinned UGTPHON train/test inputs and Apache-2.0 declaration | DONE_VERIFIED | External benchmark run [41325015010](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325015010) validates train 1,976 rows and test 275 rows with expected Git blob SHA-1 values. |
| Run paired raw-surface baseline and train-only retrieval | DONE_VERIFIED as research diagnostic | Artifact `13090704109`: 2,624 shared tokens; exact 51.3720% → 51.6006 (+0.2287 pp); CER 10.0783% → 9.9730 (−0.1054 pp); 6 exact improvements, 0 regressions, 15 rescued, 0 lost. |
| Promote raw-surface retriever to standard runtime | DEFERRED | Only 22/722 noncanonical tokens hit (3.0471%); exact-context hits 0. Keep separate until sentence-context model/candidate evidence and false-rewrite controls demonstrate broader utility. |
| Promote Kiwi/MeCab consensus rules | DEFERRED | Artifact `13090938199`: no exact-match gain and paired CER worsened by 0.000087; candidate morphology is not gold. |
| Independent Korean IPA adjudication | BLOCKED | Requires independent specialist review; current broad-candidate score is only sensitivity analysis. |
| Ukrainian target-layer review | BLOCKED | Requires independent Ukrainian phonetics/orthography adjudication. |
| NIKL item-level rights and IPA-Dict/UGTPHON license compatibility | BLOCKED | NIKL metadata-only inventory remains SKIPPED; verify item-level marks and all source terms before redistribution. |
| Neural Charsiu/ByT5 inference | DEFERRED / SKIPPED | Default-off gates remain; no inference result is claimed. |

**Measured canonical browser baseline:** 2,703 eligible / 2,699 scored, 99.852% coverage, 52.9085% exact, 8.2441% CER, 4 unresolved, 0 engine errors. The research-only broad-candidate profile is 92.4787% exact / 1.3427% CER and must not be represented as normative accuracy.

**Research interpretation:** the 2026 EMNLP UGTPHON Korean ablation shows a large sentence-context effect, only a small additional exact-retrieval effect, and a regression from staged decoding. Any further UGT work should use sentence-context-conditioned candidate normalization with train-only evidence, canonical controls, paired scoring and abstention; it must remain separate from canonical G2P.


## 2026-11-01 — Kozak Kim browser parity / paired g2pK gates

| Gate | Status | Evidence / acceptance condition |
|---|---|---|
| Browser broad-IPA parity for NIKL §5 exception 1 | DONE_VERIFIED | engine_convert.js mirrors the existing Python IPA behavior for ㅕ after ㅈ/ㅉ/ㅊ; explicit browser regression tests; exact-head system and test matrix pass. |
| Direct paired browser Kozak Kim vs untouched g2pK | DONE_VERIFIED as diagnostic | Run 41331679243, artifact 13093672281; 2,699 shared occurrences, shared references, 264 sentence clusters and deterministic bootstrap. g2pK source unchanged. |
| Source adjudication of paired discordant outcomes | DONE_VERIFIED for the inspected discordant cases | NIKL source records distinguish long-vowel omission (없는), optional fortition (인기), attested variants (못잃어), and clear §24 readings (닮다, 넘게). The four g2pK-only exact corpus hits are not valid source-backed wins. |
| Demonstrate a statistically robust overall Kozak Kim exact-match advantage | PARTIAL | Paired exact rates tie at 53.4272%; cluster-bootstrap exact-delta CI crosses zero. CER point estimate favours Kozak Kim by 0.078 pp, but its interval touches zero. Requires a larger independently adjudicated holdout. |
| Generalize R010/R012/R013/R028 beyond explicit source-backed forms | BLOCKED | No reliable browser morphology-boundary analyzer/lexical-class model currently establishes the required stem, adnominal and compound boundaries. Acceptance requires source-backed boundary evidence, positive/negative controls, cross-runtime parity, and held-out gains without regressions. |
| Resolve remaining four strict browser abstentions | PARTIAL | Current examples: 칡칡이, 쫒아내면, 많앗구나유유유, 무서웟어. Each needs a source-backed lexical or morphological analysis; no guessing. |
| Independent Korean IPA adjudication | BLOCKED | Requires qualified independent phonetic review of gold alternatives, allophone conventions and broad/narrow IPA distinctions. |
| Ukrainian target-layer review | BLOCKED | Requires independent Ukrainian phonetics/orthography adjudication. |
| NIKL item-level rights and dataset-license compatibility | BLOCKED | Verify item-level NIKL reuse marks and source terms before redistribution or release. |

**Exact-head verification:** system run 41331679290 PASS; test matrix 41331679310 PASS (JavaScript 1,364/1,364; Python 3.11/3.12/3.13; wheel/clean install; teacher-corpus audit); browser G2P integration 41331679270 PASS; external UGTPHON diagnostic 41331679243 PASS.

## Kozak Kim discrepancy-driven improvement snapshot — 2026-11-01

Scope: improve native Kozak Kim only; preserve original g2pK as an unchanged comparison baseline.

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Paired baseline and occurrence-level discrepancy extraction | DONE_VERIFIED as diagnostic | Run [41331679243](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41331679243), artifact 13093672281; 2,699 shared occurrences; 23 output-different occurrences; 15 lower-distance Kozak Kim / 8 lower-distance g2pK |
| Post-§27 paired browser diagnostic | DONE_VERIFIED as a diagnostic | Run 41335549779, artifact 13094763897; 2,699 shared tokens, exact tie, Kozak CER 8.1271% vs g2pK 8.2138%; only changed Kozak output is `올게이`, distance 3→1; no paired regressions. |
| Demonstrate statistically established overall Kozak Kim superiority | BLOCKED | Exact rates tie at 53.4272%; sentence-cluster bootstrap exact-delta 95% CI [-0.20697, +0.20056] pp crosses zero; independent adjudicated holdout required |
| §27 complete `-ㄹ게` boundary repair | DONE_VERIFIED | Browser test 1114 passed; paired run [41335549779](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549779) confirms `올게이` distance 3→1 and no other Kozak Kim output changes in 2,699 shared occurrences. |
| Source provenance for §27 ending analysis | DONE_VERIFIED for source discovery/registration | NIKL Q&A 330963 and 308180 registered as SRC-NIKL-QNA-330963 and SRC-NIKL-QNA-308180; item-level reuse mark remains unverified |
| Long-vowel and IPA annotation differences | BLOCKED / EVIDENCE-LIMITED | Reference omits length in several forms where NIKL source records length; independent IPA convention adjudication required before changing engine |
| Morphology/fortition clusters | PARTIAL | Existing §§11, 24–28 source-backed rules retained; add rule-specific contrasts and holdout validation |
| Variable phrase reading `못잃어` | PARTIAL | NIKL usage survey source records both insertion and non-insertion; variant ranking not established |
| Exact-head software verification | DONE_VERIFIED | Run [41335266673](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335266673) and follow-up [41335549717](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549717) PASS: 1,365/1,365 browser tests, public-page build, generated-page verification, Python regression/data-integrity; extraction runs 41335266701 and 41335549794 PASS. Paired diagnostic [41335549779](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549779) PASS. |
| Release readiness | BLOCKED / DEFERRED | Exact-head verification, independent Korean IPA review, and independent Ukrainian target review remain outstanding |

The detailed methodology and occurrence ledger are:
- `docs/KOZAK-KIM-DISCREPANCY-DRIVEN-IMPROVEMENT-2026-11-01.md`
- `research/KOZAK-KIM-PAIRED-DISCREPANCY-LEDGER-2026-11-01.csv`

Do not count an authored test as passing. Do not treat g2pK as normative gold. Do not remove length or collapse allophones solely to match UGTPHON.
