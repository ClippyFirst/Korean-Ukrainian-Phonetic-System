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

Main is `df733c7f7afdf1262bea6c46d07876d6f315ccaf`. Exact-head PR #271 CI passed 1,195 Node tests (0 failures), Python 3.11–3.13, system verification, browser G2P and corpus artifacts. Post-merge main tests, system verification, browser G2P and corpus artifacts passed. Pages run [40012736801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40012736801) had passed deploy and public HTTP smoke; live Playwright Chromium installation was still in progress at this note and must be checked before marking the entire deployment workflow complete.

Source rights triage: 100 rows; 96 review required, 2 manual classification required, 1 item-level license recorded, 1 not applicable recorded. This is not a permission decision. IPA review tooling is ready, but independent submissions remain 0/20 in each slot. The live NIKL inventory is skipped/blocked, not passed.
