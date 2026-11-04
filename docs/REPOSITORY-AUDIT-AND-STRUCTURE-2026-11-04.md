# Repository audit and structure — 2026-11-04

## 1. Scope and method

Audited the public repository `ClippyFirst/Korean-Ukrainian-Phonetic-System` at the current `main` head. The review covered repository metadata, the recursive Git tree, README and package metadata, architecture/methodology entry points, research directive/roadmap/checkpoint, master handoff, audit records, open PRs, branch inventory and recent GitHub Actions runs.

This is a repository-state and documentation audit. It is not an independent linguistic re-adjudication, source-rights opinion, or local clean-room test run.

## 2. Repository snapshot

| Item | Observed state |
|---|---|
| Default branch | `main` |
| Starting HEAD | `c4c3fdf59ebeae18ede0c7429964239b1eb2570d` |
| Branches returned by repository branch search | `main` only |
| Open pull requests | None |
| Recent consolidation | Kozak Kim PR stack #415, #416, #417, #419, #422, #423, #426 and #433 recorded as merged in the current handoff/audit |
| Recursive Git tree | 792 entries |
| Main directory inventory | 18 workflow files; 61 scripts; 49 `src/` entries; 13 schemas; 34 `data/` entries; 391 `tests/` entries; 139 `docs/` entries; 46 `research/` entries |
| Current-head Actions | Verify #41888565129, tests #41888564983, master artifacts #41888565027 and Pages deployment #41888564645 all completed successfully on `c4c3fdf` |
| Project type | Python research package + browser application + GitHub Pages service + evidence/research corpus |

The repository is already substantially separated by responsibility. The main structural problem is not a lack of directories; it is discoverability: a large flat `docs/` directory, dated reports mixed with stable references, and a very large append-only master handoff make it difficult to identify current authoritative guidance.

## 3. Architecture observed

The documented and tested project contract is an IPA-first Korean-to-Ukrainian phonetic rendering system:

`Korean orthography → structural/Hangul analysis → Korean phonology and contextual realization → typed/project IPA → Ukrainian phonetic target adaptation → Ukrainian practical orthography`.

Key implementation boundaries observed in the tree and README:

- Python domain/runtime package: `src/korean_ukrainian/`.
- Browser runtime/application: `src/app/`, `src/main.js`, `src/styles/`.
- Pinned browser-side third-party g2pK-derived implementation: `src/vendor/g2pk/`.
- Target rendering and correspondence data: `src/korean_ukrainian/ipa_target_renderer.py`, `data/correspondence/`, and generated browser projection.
- Korean evidence and phonology: `data/korean/`.
- Typed data contracts: `schemas/`.
- Tests and regression material: `tests/`.
- Research-only tooling and workflows: `scripts/`, `research/`, `.agents/skills/`.

The README explicitly distinguishes the browser practical G2P path from the native Python research engine, and states that stored Ukrainian lexical forms are audit references rather than a bypass around the IPA boundary. The g2pK baseline isolation work also keeps Kozak-only research overlays out of the independent g2pK comparison adapter. Preserve these distinctions during future cleanup.

## 4. Task ledger

| Workstream | Status | Evidence / acceptance |
|---|---|---|
| Mainline consolidation | DONE_VERIFIED | Current `main` contains the Kozak Kim stack; no open PRs were returned; newest commits include the consolidation and follow-up documentation commit. |
| Single-branch state | DONE_VERIFIED | Branch search returned `main` only. No branch deletion was performed. |
| Current-head CI | DONE_VERIFIED | Four latest `main` push workflows on `c4c3fdf` completed successfully: system verification, tests, master-table/research artifacts and Pages deployment. |
| Existing architecture separation | DONE_VERIFIED (preserve) | Separate Python, browser, vendor, data, schema, research and target-rendering boundaries exist. |
| IPA-first contract | DONE_VERIFIED (software contract) | README, architecture docs and regression tests describe/enforce the boundary; this does not prove every pronunciation or Ukrainian choice is linguistically correct. |
| Documentation discoverability | DONE_VERIFIED on PR branch | Added the documentation map and repository audit; all referenced index targets were fetched successfully; PR checks passed. |
| README navigation | DONE_VERIFIED on PR branch | Root README links to the documentation map and dated audit; both targets were fetched successfully. |
| Root-level project license | BLOCKED | No root `LICENSE` file appears in the repository tree. Historical `MANIFEST.txt` explicitly says a root project license requires an owner decision. Do not choose a license on the owner's behalf. Third-party notices/licenses do not license the project itself. |
| Package versioning | DONE_VERIFIED (policy documented; values unchanged) | `package.json` 1.0.0 is a private browser-app version; `pyproject.toml` 0.6.0 is the independently installable Python distribution version. Separate version streams are now the explicit prospective policy; see [versioning policy](VERSIONING-POLICY.md). Historical intent cannot be proven from current evidence. |
| Research evidence acceptance | BLOCKED / PARTIAL | Independent Korean IPA review, Ukrainian target review and item-level source-rights review remain outstanding; the historical 239-case mismatch population is only partially traceable. |
| Independent Korean IPA gold | BLOCKED | Requires two qualified independent reviewers and adjudication of the frozen holdout; no independent gold may be inferred from model agreement or benchmark corpus labels. |
| NIKL item-level reuse rights | BLOCKED | Official metadata inventory was skipped in the latest relevant workflow evidence; item-level KOGL/reuse clearance is not established. |
| Ukrainian target validation | BLOCKED | Requires independent phonetic/orthographic review and acceptance tests. |
| C12 / unresolved mismatch cases | BLOCKED / TODO | Exact-environment primary evidence and context/source adjudication remain outstanding; no speculative rule should be added. |
| Neural inference/training expansion | DEFERRED | CharsiuG2P/ByT5 jobs were skipped by policy; the handoff says supervised IPA training is not ready without independently adjudicated labels. |
| Local clean-install reproduction in this audit | BLOCKED | This review used GitHub's repository/Actions surfaces; no local checkout or local shell test execution was available in this session. GitHub Actions evidence is reported separately and is not relabelled as a local run. |

## 5. Current CI evidence and limits

At the inspected `main` head `c4c3fdf`, the following push workflows completed with `success`:

- [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41888565129)
- [Tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41888564983)
- [Master table and research corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41888565027)
- [GitHub Pages deployment](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41888564645)

These are software/automation results only. They do not close the independent IPA, Ukrainian target, NIKL rights or research adjudication gates. The latest historical handoff also explicitly marks official live NIKL metadata inventory and optional CharsiuG2P/ByT5 jobs as skipped, not passed.

## 6. Structural and documentation findings

### Strengths to preserve

- Clear top-level separation of `src/`, `data/`, `schemas/`, `scripts/`, `tests/`, `research/`, `docs/` and CI workflows.
- Extensive source-backed regression corpus and machine-readable schemas.
- Separate normative/source-backed, research-only, provisional and unresolved evidence paths.
- IPA-first target rendering boundary and generated browser data checks.
- Explicit distinction between browser practical mode, Python native research mode, optional g2pK and research-only morphology/neural workflows.
- Dated research records and append-only decision/handoff history.

### Findings to address incrementally

1. **Documentation discoverability — addressed on PR #434.** A single entry point now exists at `docs/README.md`; the historical flat namespace remains intentionally unmoved to protect existing links.
2. **Flat documentation namespace.** Keep existing paths stable for now; classify documents through the new index. Move files only in a later mechanical migration with link checking and no content changes.
3. **Master handoff is very large and append-only.** Retain it as historical evidence; link its latest dated section from the index and avoid adding another competing handoff.
4. **Version policy — addressed prospectively on PR #434.** `docs/VERSIONING-POLICY.md` defines independent browser and Python version streams; historical intent behind the original numbers remains unprovable.
5. **No root project license.** Owner decision required; do not infer permission from vendored Apache notices or data-source licenses.
6. **Some dated audit files are historical snapshots.** The newest exact-head CI and newest handoff/audit entries must take precedence; stale statements should be superseded, not silently rewritten.
7. **Large script/test surface.** Existing files include both browser and Python suites plus many one-off evidence/benchmark scripts. Add ownership/readme pointers before reorganizing filenames or extracting modules.

## 7. Recommended documentation ownership

- `README.md`: public-facing overview, quick start, primary service link, top-level limitations and links only.
- `docs/README.md`: documentation navigation and authority map.
- `docs/architecture.md`: stable software component map and runtime boundaries.
- `docs/methodology.md`: stable linguistic/methodological principles.
- `docs/ukrainian-target-layer.md`: target adaptation contract.
- `research/README.md`: active research entry point.
- `research/MASTER-DIRECTIVE.md`: non-negotiable implementation/evidence policy.
- `research/ACCEPTANCE-GATES.md`: live acceptance status and release blockers.
- `research/DECISION-LOG.md`: append-only decisions.
- `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`: append-only detailed execution history; newest section wins.
- `docs/audits/`: dated point-in-time audits and completion evidence.
- `docs/superpowers/`: design specs, plans and implementation ledger.

## 8. Safe next actions

1. Keep `main` as the sole integration branch unless a real parallel task requires a short-lived branch.
2. Use this documentation map as the entry point; do not bulk-move historical evidence files during a documentation pass.
3. Version policy is now documented; keep future version bumps artifact-specific.
4. Obtain an owner-selected root project license before describing the repository as openly licensed.
5. Complete independent Korean IPA review, Ukrainian target review and source-item rights clearance before making research-certified or release-ready claims.
6. Re-run exact-head CI after any implementation/data changes; preserve the benchmark split/profile metadata and do not treat skipped jobs as passes.

## 9. Scope of this change

This documentation pass adds navigation and a verified snapshot. It intentionally does not modify phonological rules, lexical data, generated artifacts, third-party vendor code, benchmark outputs, licenses or historical audit contents.


## 10. Documentation branch verification — 2026-11-04

- Branch: `docs/repository-audit-and-navigation-2026-11-04`
- PR: [#434](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/434)
- Initial documentation-only commit: `17b57c4388b01ad4d0aabea745a6088c89ada87c`; verification-status follow-up: `8111e62e98c7537d272e4a863151742567cb4649`.
- Latest inspected branch commit after the five-finding follow-up: `d14a02044d7be68580a79025a25a490203b97fc2`.
- Base: `c4c3fdf59ebeae18ede0c7429964239b1eb2570d`; compare: 9 commits ahead, 0 behind; 5 files changed (README, docs index, audit, version policy, decision log).
- All navigation targets in `docs/README.md` and the new version policy were fetched from the branch. README/index formatting was rechecked after correcting literal newline artifacts.
- Exact-head PR checks on `8111e62e98c7537d272e4a863151742567cb4649`: tests #41918810327 — PASS; master artifacts #41918810355 — PASS; System Verify #41918810404 — PASS. These runs precede the subsequent documentation-only commits; no Actions runs were returned for latest commit `d14a020...` at this check.
- PR #434 remains OPEN and unmerged; `main` remains unchanged.
- No local test commands were run in this environment. Verification is remote GitHub file/commit inspection and the stated Actions runs.

This PR is documentation-only. The green software checks validate repository automation on this commit; they do not close the independent linguistic or licensing blockers listed above.


## 11. Focused resolution of the five requested findings — 2026-11-04

### 11.1 Root project license — BLOCKED, correctly left unchanged

- No root `LICENSE` is present in the inspected repository.
- The Apache-2.0 notice under `public/LICENSES/` applies to the identified vendored browser dependency, not automatically to project-authored code, research data, documentation or the repository as a whole.
- A project-wide license changes redistribution, modification and contribution permissions. No license was created or inferred. Acceptance requires the owner to choose the license and confirm its intended scope (code, data, documentation and any exclusions), then add the corresponding canonical license text and any required notices.

### 11.2 Package versions — policy clarified, metadata unchanged

- `package.json`: `1.0.0`, `private: true`, Vite/browser app.
- `pyproject.toml`: `0.6.0`, installable Python distribution with a CLI entry point.
- These are different artifacts with different distribution/runtime boundaries. They are now documented as independent version streams; no forced synchronization or metadata bump was made.
- The files establish the distinct packaging roles, not the historical intention behind the original numbers. See [VERSIONING-POLICY.md](VERSIONING-POLICY.md).

### 11.3 Independent scientific validation — BLOCKED

- Korean source IPA and Ukrainian target adaptation are separate review questions.
- Existing reviewer packet generation/validation and regression tests establish process integrity, not expert correctness.
- Acceptance still requires two qualified independent Korean IPA reviewers, an explicit convention and adjudication record, followed by independent Ukrainian phonetic/orthographic review on frozen IPA inputs and suitable reader-evaluation evidence. Existing C01–C07 blind packets contain token/source-row IDs but lack licensed source utterance context and reviewer-sharing rights, so they are not ready for scoring or external dispatch. Issue #337 remains open without qualified submissions. No reviewer identities, credentials, submissions or approvals were fabricated.

### 11.4 NIKL source rights — PARTIAL / BLOCKED at item level

- The official [NIKL copyright policy](https://www.korean.go.kr/front/nuri/pageView.do?mkn=3&page_id=P000189) says (lines 166–170) that materials provided on its website may be used without separate permission under Copyright Act Article 24-2 unless a separate KOGL type is displayed. The same page describes KOGL types 0–4 and AI-use conditions (lines 171–231).
- The current [Korean Copyright Act, Article 24-2](https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1030281869), effective 2026-10-29, is not a blanket license for every item found on a government website: its scope and statutory exceptions still matter. The NIKL site policy is the operative site-level statement, subject to item-specific markings.
- The Standard Pronunciation Rules page remains HTTP 403 to the automated retrieval environment, so its page-specific KOGL designation could not be checked. Q&A pages are individually retrievable, but no reliable item-level KOGL badge determination has been recorded. The local HTML import also has unknown original HTTP/robots provenance.
- Status remains PARTIAL / BLOCKED at item level. Do not describe every NIKL-derived item or embedded third-party content as fully rights-cleared. Acceptance requires a per-item check for a separate KOGL mark (or written confirmation), a mapping of retained/redistributed excerpts to source and terms, and a source-register update. A surface-form citation and permission to reproduce source text are distinct.

### 11.5 Historical 239 mismatch occurrences — PARTIAL / EVIDENCE-LIMITED

- The append-only handoff records a historical population of 239 unmapped mismatch occurrences.
- Later records explicitly state that the 36-row unmapped-Broad queue is **not** a resolution or substitute for the historical 239-case population. Some cluster/source memberships were not fully reconstructed; e.g. C08 records note missing source-row identities.
- Current tracked diagnostic artifacts are different units and filters, not substitutes for the legacy 239-case population: the mass-cluster register has 13 cluster rows (blob `25dd0b871b53716f72b79269beb8df1fc1cffb80`); the mismatch-fragment ledger has 1,267 rows, all `UNADJUDICATED_DIAGNOSTIC` (blob `552139f72e3b0cbd32bf3dd83ad4bf5bc59238a7`); the current unmapped-Broad review queue has 36 rows, all `UNADJUDICATED_DIAGNOSTIC` (blob `fc331b42bbfd31700892d1f7df04dcb8578461f5`); the paired-discrepancy ledger has 38 selected comparison rows (blob `8c2cbd7903287b8efa33e22aa1dfa0eae326f6a4`). These counts cannot be added or compared as if they share a grain.
- Keep the 239 population open. Do not treat the number as a fully materialized, current, one-row-per-occurrence canonical queue until the original benchmark artifact, source identity triples, profile and extraction version are reconciled.
- Acceptance: recover or explicitly mark unrecoverable every historical occurrence ID; produce a hash-pinned occurrence ledger with source form, context, reference convention, engine/profile versions, mismatch category and provenance; adjudicate each item against admissible source evidence or retain it as unresolved. Only independently supported corrections may enter production, with positive and negative controls. No guessed repairs were made.

## 12. External workflow/design references reviewed

The four supplied repositories were reviewed as workflow and documentation references, not as code or license sources:

- [unlazy](https://github.com/Leonxlnx/unlazy): useful pattern — acceptance ledger first, executable gates with exact evidence, parent re-verification and explicit abandonment rather than false completion.
- [obra/superpowers](https://github.com/obra/superpowers): useful pattern — composable skills for specification, TDD, systematic debugging, verification-before-completion and branch finishing.
- [mattpocock/skills](https://github.com/mattpocock/skills): useful pattern — small composable workflows, domain-model documentation, explicit specs/tickets and review before closing implementation.
- [ponytail](https://github.com/DietrichGebert/ponytail): useful pattern — YAGNI/minimal-diff discipline while preserving tests, trust-boundary validation, data-loss handling and security.

Applied selectively: retain the repository's existing research/acceptance registers and documentation structure; do not install or wholesale copy external agent frameworks. The project-specific evidence gates and linguistic architecture remain authoritative. These external repositories' own licenses do not grant rights over this repository.

## 13. Current disposition

Software/documentation work can be reviewed through PR #434. The five findings are not all technically closable in code: versioning policy is documented; root licensing, expert review, item-level rights and historical occurrence adjudication remain owner-/evidence-dependent. The repository remains a partial research prototype, not a research-certified or release-ready transcription standard.


## 14. Final audit continuation and exact-head verification — 2026-11-04

Audited snapshot: `0a19df3870d2ac6a027072997469227505486b2b` on `docs/repository-audit-and-navigation-2026-11-04`.

- Compare against `main` `c4c3fdf59ebeae18ede0c7429964239b1eb2570d`: 18 commits ahead, 0 behind; 7 changed files (root README, docs index, this audit, version policy, acceptance gates, decision log and NIKL source register).
- The 11 links in the documentation index were fetched successfully from the branch.
- Exact-head GitHub Actions:
  - [tests #41920075080](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41920075080) — PASS.
  - [System Verify #41920074881](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41920074881) — PASS.
  - [Master table and research corpus artifacts #41920074823](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41920074823) — PASS.
  - Tests include Python 3.11/3.12/3.13, browser regression/build, wheel installation, teacher-corpus audit and generated corpus. All returned successful on this head.
  - Official NIKL metadata-only inventory — SKIPPED by workflow configuration; this is not a rights review and not a pass.
- A preceding run caught two documentation-to-test contract issues in the NIKL source-register note: the expected explicit `not established` wording and the expected rights-review classification. Both were corrected without changing the unresolved item-level rights conclusion; the exact-head rerun above passed.
- PR [#434](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/434) is OPEN and mergeable; it is not merged. `main` remains unchanged.
- No local shell/npm/pytest commands were available or executed. Verification here is remote GitHub Actions and file/commit inspection.

The green checks establish software and artifact consistency for the audited snapshot. They do not close expert IPA/target review, page-level rights verification or the historical 239-occurrence crosswalk.
