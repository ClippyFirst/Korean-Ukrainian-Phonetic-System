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
| 6 — Release and independent review | BLOCKED for a scientifically validated release | Mainline is a technically deployed research preview. The public HTTP smoke is verified, but interactive long-passage behavior, independent IPA gold, independent Ukrainian target-policy validation, and the project-wide license decision remain unresolved. Do not label this a validated transcription standard. |

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
