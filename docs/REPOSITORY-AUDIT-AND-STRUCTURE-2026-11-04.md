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
| Root-level project license | DONE_VERIFIED (owner-selected custom terms on continuation branch) | Root `LICENSE` and `docs/LICENSING-AND-PERMISSIONS.md` now define ClippyFirst's 2026 purpose-limited permissions. Scientific use of public-service results and the Korean→Ukrainian table is permitted with attribution; technical reuse requires prior written permission. This custom licence is not OSI-approved/open source. Third-party materials retain their own terms. |
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


## 2026-11-05 licensing decision update

The earlier owner-blocked licensing finding above is superseded by the owner-approved policy implemented on the continuation branch. The author is Vitalii Volodymyrovych Tkachuk, publishing as **ClippyFirst**; the project began in 2026. See the root `LICENSE` and [licensing guide](LICENSING-AND-PERMISSIONS.md). The policy grants attributed scientific use of public-service results and the Korean-to-Ukrainian correspondence table, while technical reuse (copying/reusing code, self-hosting, integration, modification, porting and redistribution) requires prior written permission. This is a custom, purpose-limited licence, not an open-source licence. Existing third-party licences remain untouched. This update records the owner's intended terms; no independent legal opinion or cross-jurisdiction enforceability review has been performed.


## 13. Post-merge state — 2026-11-05 (supersedes branch-era statements)

PR [#434](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/434) was merged into `main` on 2026-11-05. Merge commit: `56318e8a293d6f92dc307256430279d386a77d33`. The merged PR head was `fbfe7f481fa0ac35264bf060fc8170d7310f3176`; its three principal workflow runs completed successfully before merge (tests, System Verify, and master table/research artifacts). PR #434 is closed/merged. A post-merge search returned no open pull requests.

The owner-approved custom ClippyFirst Project License is now present on `main` at `LICENSE`; the explanatory guide is `docs/LICENSING-AND-PERMISSIONS.md`. Author identity: Vitalii Volodymyrovych Tkachuk, publishing as **ClippyFirst**; project start year 2026. Scientific use of public-service results and the Korean→Ukrainian correspondence table is permitted with attribution; technical reuse requires prior written permission. This is a custom, purpose-limited licence, not an OSI-approved open-source licence. Third-party materials retain their own terms. See DEC-2026-007.

**Current readiness remains partial research prototype, not research-certified and not release-ready.** The merge closes repository navigation/version-policy/licensing documentation work only. It does not close scientific, source-rights or historical evidence gates.

Current outstanding acceptance work:
- independent Korean IPA review by qualified reviewers, with adjudication and frozen holdout evidence;
- independent Ukrainian phonetic/orthographic target-layer review on frozen IPA inputs;
- NIKL item-level KOGL/source-rights checks; official metadata inventory remains skipped/blocked in automation and the Standard Pronunciation Rules page previously returned HTTP 403;
- C12 audio, speaker, dialect and prosodic crosswalk before any production rule change;
- recovery/reconciliation and evidence-based adjudication of the historical 239 mismatch occurrences; the current 36-row Broad queue and other diagnostic ledgers are not substitutes;
- remaining names, loanwords, Hanja and regional-style coverage gaps;
- complete cross-runtime parity beyond the pinned UGTPHON subset, where the rule coverage matrix still identifies gaps;
- supervised neural training remains deferred until independently adjudicated IPA gold exists.

**Verification boundary:** exact-head GitHub Actions on PR head `fbfe7f481fa0ac35264bf060fc8170d7310f3176` passed: Python 3.11/3.12/3.13 tests, teacher-corpus audit, browser tests/build, wheel-install check, System Verify, and generated master-table/research-corpus checks. The official NIKL metadata-only inventory job was skipped, not passed. These runs validate software automation and artifacts, not independent linguistic correctness or item-level reuse rights. The connector did not return workflow runs associated with the merge commit itself; no post-merge Actions result is claimed here.

No source/runtime code, linguistic production data, generated artifacts, third-party notices, or external branches were changed as part of the merge.


### Post-merge branch and navigation check

- Documentation map local links: **12/12 targets fetched successfully** from `main` on 2026-11-05.
- Branch search returns `main` plus the merged PR head branch `docs/repository-audit-and-navigation-2026-11-04`. The latter is **behind main, with no unique commits**; it is a stale merged branch, not an open PR. It was deliberately left untouched; no branch deletion was performed.
- Main has since advanced through post-merge audit, handoff and research-status maintenance commits. Inspect the live default-branch HEAD before starting the next task.


## 14. Whole-repository audit refresh — 2026-11-05 (supersedes stale snapshot fields above)

### Scope and method

This refresh re-inspected the live default-branch metadata, recursive Git tree, README, documentation index, architecture, package metadata, primary runtime entry points, NIKL collector/parser/workflow, source register, acceptance gates, roadmap, local HTML capture and manifest, local agent skills, recent PR/branch/issue state, and exact-head Actions runs. The whole tree was inventoried, but this was not a line-by-line review of all 797 entries; deep inspection concentrated on runtime boundaries, data/source provenance, build/test configuration, NIKL capture and documentation ownership. No phonological production code or linguistic data was changed.

### Current repository snapshot

| Item | Verified state |
|---|---|
| Default branch / starting HEAD | `main` / `c1feae5fcc9e743ac7fba660221ad229b4ccf2ff` |
| Recursive Git tree | 797 entries (files + directories); 162 Markdown files |
| Major inventories | 391 test files; 61 scripts; 18 workflows; 13 schemas; 178 source-register rows (134 NIKL-related rows) |
| Branches returned | `main` plus `docs/repository-audit-and-navigation-2026-11-04`; the latter is 14 commits behind and 0 ahead (no unique commits) |
| Open PRs | 0 |
| Open issues | #337 — recruit two independent Korean phonetics reviewers for the 삶의 broad-IPA gate |
| Main branch protection | GitHub repository metadata reports `protected=false`; no protection/ruleset settings were changed |
| Runtime versions | Browser package `1.0.0` (private; Node >=22.12); Python distribution `0.6.0` (Python >=3.11) |
| Project classification | Python research package + browser app + GitHub Pages service + evidence corpus/tooling |

The old 2026-11-04 inventory and branch claims earlier in this document are historical snapshots. The current counts and refs in this section supersede them. The stale merged docs branch was left untouched; the connected GitHub actions available in this session did not expose branch deletion. No additional branch was created for this documentation pass, in order to avoid making the requested single-mainline situation worse.

### Architecture and ownership confirmed

The system has separate browser and Python runtimes, a pinned third-party browser G2P implementation, canonical Korean/IPA/target data, schemas, research tooling, and a dedicated evidence workflow. The intended data path remains Korean orthography → structure/morphology → Korean phonology → surface/typed IPA → Ukrainian target adaptation → Ukrainian orthography. RR and Hanja remain side layers. The browser practical G2P path is not claimed to be morphology-identical to Python g2pK; the Python native pipeline and optional g2pK backend remain explicit choices. See the new [repository structure guide](REPOSITORY-STRUCTURE.md) and expanded [architecture](architecture.md).

### NIKL local HTML: new evidence and remaining caveats

The user-supplied root file `한국어 어문 규범.htm` is present at Git blob `c6b5aedf7774a0238ff58cfe51457f6975ca1b36` (212,730 Unicode characters). It contains the `제2부 표준 발음법` section and headings for all 30 articles. The existing metadata-only manifest records local import time `2026-10-24T07:25:44.993Z`, source byte count 322,678 and SHA-256 `11dccd3c6eafb5167a6f448c2ccb5fc45fd698c5b2d1570ed3d1e5c177fa7a1e`; inventory is 30/30, with zero missing, duplicate, unexpected or incomplete articles. The local inventory workflow passed in [run 40072018648](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072018648), and schema/reproducibility passed in [run 40072283788](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283788).

Important distinctions:
- This is a local HTML import, not a live HTTP retrieval: HTTP status and retrieval time are null, and robots policy is explicitly `not_checked_local_import`.
- The manifest says `termsReview=not_assessed`. The NIKL site-wide Article 24-2 policy is recorded in the source register, but the page-specific KOGL mark and item-level reuse terms remain unverified.
- The saved HTML ends with a `deepl-input-controller` element after `</body>` (two DeepL marker occurrences were found). This appears to be an injected browser-extension element. The file also references 17 relative CSS/JS/image assets that are not present in the repository. The text parser can still inventory the article content, but this is not a pristine, self-contained visual archive. Preserve this artifact and arrange a clean recapture with translation extensions disabled before making stronger authenticity claims.
- The parser's scope is only Part 2, Standard Pronunciation Rules, articles 1–30. It must not be described as a complete inventory of every section of the broader page.

Technical inventory is `DONE_VERIFIED`; capture authenticity is `PARTIAL`; page-level rights are `BLOCKED/PENDING`; independent article/subparagraph/example adjudication remains open. See [NIKL capture report](NIKL-LOCAL-CAPTURE-AND-INVENTORY-2026-10-24.md).

### Current-head CI and deployment

On exact main head `c1feae5fcc9e743ac7fba660221ad229b4ccf2ff`:
- [Tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41924144853) — PASS.
- [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41924144998) — PASS.
- [Master table and research corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41924144992) — PASS.
- [GitHub Pages deployment](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41924144861) — FAIL at the deploy step. The Python 3.11/3.12/3.13 matrix and browser tests/build jobs in that workflow passed. The deployment log remained at `updating_pages` for approximately eight minutes, then timed out and cancelled deployment ID `c1feae5fcc9e743ac7fba660221ad229b4ccf2ff`. The observed failure is in the Pages deployment wait, not in the build/test jobs; the precise platform-side cause is not established. No public-site smoke test ran after a successful deployment in that run.

No local npm/pytest commands were executed in this connector-only audit. Do not report local clean-install reproduction as passed.

### Upstream agent workflow review

The supplied repositories were inspected as process references at the revisions already recorded in [agent-skill integration](AGENT-SKILL-INTEGRATION-2026-11-01.md): unlazy (`16671491...`), Superpowers (`2ce8aa1...`), Matt Pocock skills (`4ae2317...`) and Ponytail (`96608e0...`). Their useful patterns are already represented by the existing repository-local skills and acceptance process: observable gates; red/green tests; root-cause debugging; fresh verification; specification-vs-standards review; and concrete, risk-first whole-repository audits. No upstream source code or skill text was copied, and no overlapping generic skill or second gate ledger was added.

### Task ledger

| Workstream | Status | Evidence / remaining acceptance |
|---|---|---|
| Mainline integration / open PRs | DONE_VERIFIED | No open PRs; recent merged PRs #434, #433, #431, #428, #426, #423 and #422 integrated. |
| Literal one-branch state | PARTIAL | Main is the only active integration line, but one stale merged docs branch remains (14 behind, 0 ahead); branch deletion was not available through the connected action surface. |
| Documentation discoverability / ownership | DONE_VERIFIED after this update | Root README, docs index, repository structure guide and architecture now identify canonical locations and runtime ownership. |
| Runtime and data architecture | DONE_VERIFIED as documented contract | Python/browser entry points and canonical data boundaries inspected; this is not a claim that every code path is independently linguistically correct. |
| NIKL local article inventory | DONE_VERIFIED | Existing local HTML parser and manifest: 30/30, reproducible workflow pass. |
| NIKL capture authenticity | PARTIAL | DeepL extension marker present; 17 referenced local assets absent. Clean recapture and byte/hash comparison required. |
| NIKL item-level rights | BLOCKED/PENDING | Page-specific KOGL mark and Q&A item-level terms not verified. |
| Python/browser/system tests | DONE_VERIFIED on exact head | Current main test, verify and artifact workflows pass. |
| GitHub Pages deployment | BLOCKED / PLATFORM-OBSERVED | Latest deploy job timed out while Pages remained `updating_pages`; retry and successful public smoke test required. |
| Main branch protection | TODO / OWNER-SETTING | Metadata reports unprotected main. Decide and configure branch protection/rulesets outside this code/documentation change. |
| Independent Korean IPA gold | BLOCKED | Two qualified reviewers and adjudication of frozen holdout required; issue #337 is open. |
| Independent Ukrainian target review | BLOCKED | Separate expert review on frozen IPA inputs required. |
| C12 audio/speaker/prosody and historical 239 mismatch reconciliation | BLOCKED / PARTIAL | Recover source context and occurrence-level identity before production rule changes. |
| Cross-runtime parity and coverage gaps | PARTIAL | Continue rule-by-rule parity and names/loans/Hanja/regional coverage with evidence-backed regressions. |
| Supervised neural G2P training | DEFERRED | Wait for independently adjudicated IPA gold and corpus-rights clearance. |

### Files changed by this audit refresh

The accompanying commit updates navigation, repository structure/architecture guidance, current audit/handoff, NIKL capture notes and source-register status. It does not change production phonology, IPA mappings, lexical data, generated artifacts, vendor code, package versions, license terms or external GitHub settings.


## 15. Final verification after documentation/source-register correction — 2026-11-05

**Verified code/data head:** `d7c4c539ae751ee9feda2aba9c5806cc6968ce55` on `main`.

### Intermediate validation failures and correction (recorded transparently)
The first documentation commit `ff45e426420c85c6ae4d66237bee8e59280d0b50` appended a comma-containing note to an unquoted final CSV field in `research/SOURCE-REGISTER.csv`. CI caught the resulting 14-column row (the register contract is 12 columns); both browser and Python suites failed at the source-register/template checks. Commit `29a11e85247c9ca848fe23c5faaf447676753236` correctly quoted the field, but temporarily changed the tested `integration_status` enum, so the exact source-register contract still failed. Commit `d7c4c539ae751ee9feda2aba9c5806cc6968ce55` restored the established `blocked-live-source-access` enum while retaining the local-capture evidence in review/limitations fields. The final CSV was parsed and all 178 data rows were confirmed to have exactly 12 columns.

### Exact-head verification at d7c4c539
- [Tests workflow 41985911802](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41985911802) — PASS: browser suite 1,396/1,396; Python 3.11, 3.12 and 3.13 jobs PASS; wheel-install PASS; teacher-corpus audit PASS.
- [System Verify 41985911475](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41985911475) — PASS: browser regression/build and Python regression/data integrity PASS. The live NIKL source-inventory job was SKIPPED by workflow configuration; it is not counted as a pass.
- [Master table and research artifacts 41985911482](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41985911482) — PASS.
- [GitHub Pages deployment 41985911844](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41985911844) — PASS: Python matrix and browser build passed; Pages deployment succeeded; HTTP smoke verified `index.html`, `system.html` and the first JS asset; live Playwright smoke passed for the practical UI, accessibility/UX behaviors and a 1,443-character Korean passage. The live smoke is a deployment/UX check, not linguistic expert validation.
- Documentation links: root README 77/77 local targets exist; documentation index 13/13 local targets exist; repository structure guide 2/2 local targets exist.
- NIKL local HTML inventory and schema/reproducibility remain separately verified by runs 40072018648 and 40072283788 (30/30 articles).
- No local npm/pytest command was run in this connector-only session; all reported test results above are GitHub Actions results.

### Final branch and project status

The default branch now includes the structure/architecture documentation, README/index navigation, NIKL capture-quality notes, corrected source-register provenance, and updated research acceptance/handoff. No production phonology, IPA mapping, lexical data, generated browser projection, vendor code, package version, licence terms or external repository settings were changed.

The branch search still returns `main` and the stale merged `docs/repository-audit-and-navigation-2026-11-04` ref; comparison at the verified head showed the stale ref 17 commits behind and 0 ahead. No open PRs remain; issue #337 is still open for independent Korean IPA reviewer recruitment. Main is reported unprotected. No new branch was created; the connected GitHub actions did not expose a branch-delete operation, so exact one-ref branch hygiene remains incomplete.

**Readiness:** deployment pipeline is green at d7c4, but the project remains a partial research prototype, not research-certified or release-ready. Independent Korean IPA gold, Ukrainian target review, NIKL page/item rights, clean NIKL capture authenticity, C12 context, historical 239-case reconciliation and remaining coverage/parity gates remain open.


## 16. 2026-11-05 — full repository continuation, NIKL isolation and 239-case status

### Starting point and repository inventory

- Starting main head: `b573fec6fe6761f54a6cc02e02169db477c34455` (2026-11-05 07:19:50 UTC).
- Verified implementation/test head: `1869b8936c17077ac4fde308644d8588c132404c`.
- Documentation commits: `0c6fb7f0148fae8daa597b368a442a71481fb1b3` and `f26601b0206c209f231396d630dbd69b039ee029`; this audit/handoff refresh follows them.
- Branch inventory: `main` only; open PRs: 0. No new branch was created, preserving the requested single-branch repository state.
- Recursive tree: 798 entries (files plus directories); `docs/` 144 entries; `tests/` 388 files; `scripts/` 61 files; `schemas/` 13 files; 18 GitHub Actions workflows.
- Recent merged work was reconciled against main, including PR #434 (documentation/licensing/navigation) and PR #433 (g2pK/Kozak separation). No open PR was left unreviewed.
- The audit reviewed the recursive path inventory, existing architecture and structure guides, master handoff, acceptance gates, roadmap, source/rule matrices, NIKL and Kozak Kim discrepancy registers, g2pK integration boundary, core rule/phonology/IPA adapters, key test suites, CI workflows, recent PRs and recent commits. This is an evidence-based whole-tree audit, not a claim of manual line-by-line review of all 798 tree entries.

### NIKL scope correction — DONE_VERIFIED

The owner instruction is now enforced: NIKL R001–R016 and exact-form/morphological licenses belong exclusively to Kozak Kim. Earlier g2pK adapters had inherited a narrow NIKL overlay (browser exact-form surface corrections, lexical length/variant handling, and Python sourced surface/IPA/diagnostic lexical overrides). Those overlays made the ordinary g2pK path dependent on Kozak Kim evidence.

- `src/app/g2pk_web.js`: removed NIKL surface correction map, lexical-length overlay and variant overlay. The browser adapter now passes the raw pinned g2pK surface to the IPA/target adapter.
- `src/korean_ukrainian/g2pk_engine.py`: removed sourced lexical surface and IPA overrides. IPA is derived only from g2pK's returned surface; no Kozak Kim diagnostic lexical status is imported.
- `src/vendor/g2pk/`: unchanged; upstream attribution and Apache-2.0 notices remain intact.
- Kozak Kim NIKL rule implementations and canonical evidence data remain in `src/app/engine_rules_ctx.js`, `src/korean_ukrainian/rules.py`, `data/korean/rules.csv`, and existing rule/lexical evidence registers. No second NIKL capture was created and the supplied `한국어 어문 규범.htm` was not overwritten.
- Regression tests enforce raw g2pK parity and demonstrate that a source-backed exception is applied by Kozak Kim but not by g2pK.

### Exact-head verification at implementation/test head 1869b893

- Tests workflow [41988633305](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41988633305) — PASS: browser suite 1,393/1,393; Python 3.11, 3.12 and 3.13; wheel install; teacher-corpus audit.
- System Verify [41988633224](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41988633224) — PASS: browser regression/build and Python regression/data integrity. Live NIKL metadata-only inventory — SKIPPED, not counted as a pass.
- Master table and research artifacts [41988633308](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41988633308) — PASS.
- Browser G2P integration [41988508104](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41988508104) — PASS on the immediately preceding implementation head; the subsequent commit only corrected a Python test expectation for broad IPA rendering.
- Pages deployment [41988633299](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41988633299) — PASS, including deploy and live Playwright smoke. The live smoke exercised the 1,443-character Korean passage and reported g2pK status; it verifies deployed interaction, not normative pronunciation accuracy.
- Local npm/pytest were not run: the connector environment could not clone the repository, so code verification was performed through GitHub Actions.

### Historical 239 mismatch occurrences — PARTIAL / EVIDENCE-LIMITED

The historical 239 Broad-v2 mismatches are not 239 confirmed production defects. The archived `research/kozak-kim-mismatch-fragments-2026-11-02.csv` has 1,267 data rows (verified physical line count minus header); the later `research/kozak-kim-unmapped-mismatch-review-queue-2026-11-03.csv` has 36 data rows. The 13 cluster rows and 38 paired-discrepancy rows are other grains. These artifacts must not be merged by row count or treated as interchangeable.

The 36-row queue has source row identifiers and context lookup status, but it is not the full historical 239-case adjudication ledger. The recovered 2026-11-02 multi-engine artifact is hash-pinned and contains stable occurrence IDs, ten engine ledgers, the UGTPHON revision, Native/Broad profiles and the historical code snapshot. The repository still lacks the exact 239-member ID set or reproducible historical per-fragment C01–C10 assignment predicate, so it cannot yet materialize the correct 239 rows for source-context joins and individual decisions. A mismatch can be caused by IPA convention, length, morphology, dialect, corpus annotation, or an engine defect. No mass rewrite of outputs or expected tests was made. Acceptance requires exactly 239 reproducible unique IDs and one evidence-linked fix/retain/abstain disposition per selected occurrence.

### Task ledger

| Task | Status | Evidence / remaining criterion |
|---|---|---|
| Repository tree, architecture, recent PRs/commits, branch and CI inventory | DONE_VERIFIED | 798-entry tree; main-only branch inventory; no open PRs; merged PRs #434/#433 and related historical changes reconciled. |
| NIKL rules R001–R016 in Kozak Kim | DONE_VERIFIED / PARTIAL COVERAGE | Implementations and finite example tests exist in Python/browser Kozak Kim. Rule coverage matrix still records JS/Python divergences and incomplete CLI/API per-rule parity; independent phonologist review is partial. |
| No NIKL overlays in g2pK adapters | DONE_VERIFIED | Both adapters changed; browser/Python regression tests and exact-head CI pass. Vendored upstream code unchanged. |
| Reuse existing local NIKL HTML, no new snapshot | DONE_VERIFIED | Existing file and 30-article inventory retained. Live crawl skipped/HTTP 403; page/item reuse rights and pristine capture authenticity remain BLOCKED. |
| Historical 239-case reconciliation | PARTIAL / EVIDENCE-LIMITED | Historical count and separate artifacts documented; complete hash-pinned occurrence/context ledger and adjudication still TODO/BLOCKED. |
| Documentation/navigation/handoff | DONE_VERIFIED | Architecture, g2pK boundary, README, repository structure, index, audit, roadmap, acceptance gates, decision log, agent skill and master handoff updated in place. |
| Independent Korean IPA gold | BLOCKED | Two qualified independent reviewers and adjudication required. |
| Ukrainian target validation | BLOCKED | Independent Ukrainian phonetic/orthographic review required. |
| C12 source/speaker/context/acoustic crosswalk | BLOCKED | Missing validated evidence/crosswalk. |
| Neural training | DEFERRED | Wait for adjudicated IPA gold and corpus rights. |

**Readiness:** partial research prototype, not research-certified or release-ready. Software and engine-isolation gates pass; historical mismatch adjudication, independent Korean IPA gold, Ukrainian target review, C12 evidence and NIKL rights/authenticity remain open.


## 17. 2026-11-05 — context-recovered R013 corrections and 239-case clarification

### Implementation/test head and verification

- Latest verified implementation/test head: `be65ee71b9d3f224876875830b30be856f96126f`.
- Follow-up research status and acceptance documentation commit: `774e5ca8fca4bf4ad788c47aedaf09668259c2da`; repository navigation/handoff refresh committed in `eba384fba0a201837cdb3b657ced4f376ae84fdd`.
- Tests workflow [41991611882](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41991611882) — PASS: browser suite 1,394/1,394; Python 3.11/3.12/3.13; wheel install; teacher-corpus audit.
- System Verify [41991611839](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41991611839) — PASS: browser regression/build and Python regression/data integrity. Live NIKL metadata-only inventory — SKIPPED.
- Master table/research artifacts [41991611903](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41991611903) — PASS.
- Pages deployment [41991611809](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41991611809) — Python matrices and browser/static build PASS; deploy step was still in progress at the time of this record.
- Local npm/pytest were not run because this connector session could not clone the repository. All stated code checks are remote GitHub Actions results.

### Final repository inventory at the documentation snapshot

- Recursive tree: **799 entries**; `docs/` 144 entries; `tests/` 388 files; `scripts/` 61 files; `schemas/` 13 files; 18 workflows; 163 Markdown files.
- Branches: `main` only. Open PRs: 0.

### Four source-context-backed R013 fixes — DONE_VERIFIED

The pinned UGTPHON Korean test split at `naver-ai/UGTPHON@ef0d5a09c2ea1874c7206020f875cbd9cfea2f54` provides the original sentence contexts. Four exact same-eojeol licenses were added to both Kozak Kim Python and browser rule inventories under NIKL §27:

| Form | Exact licensed syllable pair | Context row |
|---|---|---|
| `해줄것` | `줄>것` | `multilexnorm2026_1916` |
| `많을거같이` | `을>거` | `multilexnorm2026_2011` |
| `내릴수있는` | `릴>수` | `dc_inside_2266` |
| `존중시킬수도있지만` | `킬>수` | `dc_inside_2266` |

The source/decision register is `research/kozak-kim-context-adjudication-2026-11-05.csv`. Python and browser tests verify exact-form behavior, full source-sentence output, negative controls, and g2pK isolation. No NIKL license was added to the g2pK adapters or vendored g2pK.

### Historical 239 and current 36-row queue

The 239 figure is the 2026-11-02 historical population of Broad-v2 mismatch occurrences not assigned to C01–C10 at that snapshot. Subsequent C11/C12 and related cluster work reclassified substantial portions; it is not a current count of 239 proven defects. The later 36-row queue is a narrower extraction. Of those 36 rows, four exact R013 forms are now fixed, one `출산` row is provisionally retained under the existing R012 / NIKL §26 license pending independent review, and 31 rows remain without an individual fix/retain/abstain decision.

The complete hash-pinned 239-occurrence ledger with full context, engine/profile/normalizer provenance and reviewer decisions is still missing. The 2,703-record multi-engine report has been recovered as artifact `13156351613` and pinned by SHA-256 `749ac9a2b9db96c1e27828919afe05ef4320e35ca6a91ab2038c1ff3e9d04c69`; its exact 239-member selection predicate/fragment-assignment snapshot is not. The mismatch export has 1,267 data rows (not 1,266). No full post-fix UGTPHON benchmark was rerun. Do not report historical metrics as post-fix results.

### Remaining evidence and provenance limits

- Independent Korean IPA review, Ukrainian target review, C12 source/speaker/context/acoustic crosswalk, and NIKL item-level reuse rights/authenticity remain BLOCKED.
- RESOLVED in the 2026-11-05 follow-up: Python `RuleTrace` retains the legacy scalar `license_context` for compatibility and adds `license_contexts` plus `applied_occurrences`. Each changed adjacent pair records its application ID, syllable index, source span, word form, pair, matched exact licenses, source citation, confidence, status and before/after state.
- The external workflow/skill references `obra/superpowers`, `mattpocock/skills`, and `DietrichGebert/ponytail` were retained as design references. The existing `.agents/skills/phonetic-engineering/SKILL.md` was extended; no third-party repository was copied wholesale.

**Readiness:** partial research prototype; software tests pass, but research certification and release readiness are not established.


## 2026-11-05 follow-up — per-occurrence provenance and 31 row dispositions

- The 31 previously undecided rows in the current 36-row queue now have individual `ABSTAIN` records in `research/kozak-kim-31-row-individual-abstentions-2026-11-05.csv`. Together with the four exact R013 fixes and provisional `출산` retain, this closes the *disposition-recording* gap for the narrow 36-row queue. It does not supply independent IPA gold or imply phonetic correctness.
- The new register pins the 36-row queue blob and UGTPHON source commit. It explicitly records the historical Kozak engine commit and normalizer version as unrecovered. Source row IDs are locators into the pinned dataset; full source utterances are not copied into this register.
- Python `RuleTrace` now includes `applied_occurrences` and `license_contexts`, preserving each changed pair's word form, syllable index, matched license, source citation, confidence, status and before/after state. The legacy scalar `license_context` is retained for compatibility.
- The historical 239 population remains BLOCKED: the recovered benchmark artifact is pinned, but the tracked 1,267 fragment export and 36-row queue have different grains and do not establish the exact 239 membership. The original per-fragment C01–C10 assignment snapshot or an exact reproducible selection predicate is still required. No fabricated ledger was added.

## 19. 2026-11-05 — exact-head verification and reconciled dispositions

**Current `main`:** `d68cb09e12eb8b71b264775f2cf7ac6e9c2a51c5`. Branch inventory: `main` only. Open PRs: none. The repository's current mainline is consolidated; no historical branch or PR needed to be ported in this continuation.

**Exact-head Actions:** tests `42000327552` PASS (Python 3.11/3.12/3.13, wheel installation, teacher-corpus audit, browser tests); System Verify `42000327509` PASS (Python regression/data integrity and browser regression/build; live NIKL metadata-only inventory SKIPPED); master/research artifacts `42000327383` PASS; GitHub Pages deployment `42000327385` PASS. The skipped live NIKL inventory is not a pass and does not establish item-level reuse rights.

**Reconciled requested work:**
- Current 36-row queue: 4 exact R013 FIX records, 1 provisional R012 RETAIN (`출산`), and 31 individually reasoned ABSTAIN records. The 31-row register has 31 unique occurrence IDs and 31 unique rationales; all 31 deliberately leave production unchanged pending primary-source and independent IPA review. Their engine run-head, benchmark run/artifact/report hashes, normalizer script blob, Broad profile blob, and UGTPHON dataset blob are now pinned per row.
- Context adjudication: 5 source-row records are present (4 exact-form FIX contexts and 1 provisional RETAIN context). The 31 ABSTAIN records carry pinned source-row locators and source revision; their complete contexts remain retrievable by those locators rather than copied into the decision CSV.
- Python `RuleTrace`: per-occurrence `applied_occurrences` and plural `license_contexts` are implemented; the scalar `license_context` remains for compatibility. Exact-head Python and Browser CI passed.
- Historical 239: benchmark artifact recovered and SHA-256 verified; exact 239-member selection predicate / per-fragment C01–C10 assignment snapshot remains BLOCKED. The 1,267-row mismatch-fragment export, 36-row current queue, 13 cluster rows and 38 paired rows are different grains and cannot be substituted. No synthetic 239-row ledger or unsupported linguistic decisions were created.

**Readiness:** partial research prototype. Software CI and Pages deployment are green on this head, but research certification and release readiness remain blocked by the exact historical 239 reconstruction, independent Korean IPA adjudication, independent Ukrainian target review, item-level NIKL rights/authenticity, C12 audio/speaker/prosody evidence, and a post-fix full UGTPHON benchmark.


## 2026-11-05 continuation — historical 239 evidence refinement

Recovered the exact pre-C11/C12 snapshot: benchmark run `41453407662`, artifact `13148075070`, code head `e7933ae4a67c94f0f69b4747d8e388aa082fc347`, report SHA-256 `8c25e630ca828719b269aeb84c8037d9c40f881a0f15c2e4ddf9d427edffa0f9`, and C01–C10 aggregate table blob `275e5d162f3357e94fccd5024ec693fcf223cecd`. This corrects the blocker description: the historical baseline is recovered, but the 239-member occurrence set is not. The cluster table has no per-occurrence/per-fragment assignments; the later export stores only an occurrence-level cluster union across strict and Broad fragments. The historical predicate cannot be replayed exactly, so no 239 IDs or decisions were fabricated. See the updated [239 recovery manifest](../research/kozak-kim-historical-239-recovery-manifest-2026-11-05.md).

**Status:** historical 239 membership `BLOCKED`; 370-row Broad context superset `DONE_VERIFIED`; overall readiness remains partial research prototype.



## 2026-11-05 continuation — 31-row provenance hash correction

Integrity review found a 39-character truncated `broad_profile_blob_sha` repeated across the 31-row individual-abstention CSV. All 31 rows now carry the full 40-character Git blob SHA-1 `e13086f0fd98ce9564326ff50b0458c27392932f`; the regression expectation was corrected to the same full value. This was a metadata/test correction only. No pronunciation or decision changed. The latest connector-created commit returned no GitHub status checks; exact-head test verification remains pending.


## Reconstructed 239-case candidate replay — 2026-11-05

A replay of the pinned pre-C11/C12 benchmark now yields a **239-ID candidate set**. This is a material narrowing of the earlier recovery blocker, but it is deliberately not labelled the original historical membership snapshot: the original selector/list was not preserved, and the recovered replay is a candidate interpretation of the triage note.

### Exact replay inputs

- Baseline code head: `e7933ae4a67c94f0f69b4747d8e388aa082fc347`.
- Workflow run / artifact: [41453407662](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41453407662) / [13148075070](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41453407662/artifacts/13148075070).
- Artifact ZIP SHA-256: `075ceff080decbb142492448c9344816bfb53f1e87fe563826668d037c053b89`.
- Report SHA-256: `8c25e630ca828719b269aeb84c8037d9c40f881a0f15c2e4ddf9d427edffa0f9`.
- Historical classifier source: `scripts/export_kozak_kim_mismatch_fragments.py` at commit `8c335dd7031bdae59b3ef7db715b54f0fdc9bcd5`, blob `e0bb7f32d5b320d468e0bdcab0ed134c7a3278ec`.
- Candidate ID snapshot: [`kozak-kim-historical-239-candidate-ids-2026-11-05.txt`](kozak-kim-historical-239-candidate-ids-2026-11-05.txt).

### Replayed rule and result

For each Native scored occurrence with Broad edit distance greater than zero, the Broad reference/prediction pair was aligned using the historical NFC-plus-combining-mark grapheme aligner. The **Broad fragments only** were concatenated and passed to the pre-C11/C12 aggregate C01-C10 classifier. An occurrence was selected only when that aggregate classifier returned `UNMAPPED_REQUIRES_REVIEW` and no C01-C10 label.

- Broad mismatch superset: **370** occurrences.
- Reconstructed candidate set: **239** unique occurrence IDs, **111** source rows, **154** unique tokens.
- The replay exactly reproduces the historical aggregate count of 239.
- This is an occurrence-level aggregate selector, not a per-fragment selector. The later per-fragment classifier returns **269** occurrences with at least one individually unmapped Broad edit. These populations must not be conflated.
- Therefore the earlier prose saying that the historical 239 necessarily meant “at least one individual fragment was unmapped” was too strong. The replay supports the narrower aggregate interpretation above; the original selection implementation remains unproven.

### Crosswalk to decisions already recorded

| Current disposition | Candidate IDs | Interpretation |
|---|---:|---|
| `FIX` | **3** | IDs `37`, `704`, `2031` overlap the four exact R013 fixes in the 36-row queue. Their exact source-context licenses are implemented in Kozak Kim and covered by the merged PR #426 verification. |
| `RETAIN` | **1** | ID `1140` (`출산`) is a provisional R012 retain, still awaiting independent Korean IPA review; it is not counted as solved. |
| `ABSTAIN` | **22** | These IDs overlap the individually reasoned 31-row abstention ledger; they remain unresolved pending evidence/review. |
| No individual disposition | **213** | Candidate rows without a row-specific fix/retain/abstain decision in the current narrow queue. |

The fourth exact R013 fix, occurrence `2018` (`존중시킬수도있지만`), is outside this reconstructed candidate set because its historical Broad fragments already receive C02/C04 aggregate labels. Thus **3 of the 239 candidates have verified exact-form fixes**, leaving **236 candidate cases not yet resolved** (213 undecided + 22 abstentions + 1 provisional retain). This is a crosswalk against the old benchmark, not a claim that a post-fix full benchmark now has exactly 236 mismatches.

### Status and acceptance boundary

- Historical 239 membership: **PARTIAL** — a hash-pinned replay yields exactly 239 stable candidate IDs, but the original saved ID list/predicate is absent, so historical identity is not yet independently proven.
- Candidate remaining count: **236**, after subtracting only the three verified FIX overlaps. RETAIN and ABSTAIN do not decrement the unresolved count.
- Next acceptance: confirm that the original 239 triage used this aggregate Broad-only pre-C11/C12 selector, or recover the original selector/member list; then preserve the 239-row candidate crosswalk and adjudicate the remaining 236 individually.
- No runtime phonological rule was changed in this recovery pass. The full post-fix benchmark has not been rerun. No independent IPA decision is inferred from the benchmark label.



## Exact-head CI and merge record — 2026-11-05

The reconstructed candidate snapshot and its regression crosswalk were merged to `main` through PR [#435](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/435), merge commit `98e450f1fb90e920d2b372ab3098b000d34de2e2`. PR head before merge: `f4064bb998343f587ee769259059db7202dc121f`.

Exact-head checks on the PR head:
- System Verify [42009815364](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009815364): **PASS** — Python regression/data integrity and Browser regression/build. Official NIKL metadata inventory: **SKIPPED**.
- Tests [42009822625](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009822625): **PASS** — Python 3.11, 3.12, 3.13; web tests; teacher-corpus audit; clean wheel installation.
- Master/research corpus artifacts [42009822802](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009822802): **PASS**.
- Exhaustive test-case register extraction [42009822726](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009822726): **PASS**.
- The first test run on pre-correction PR head `6037ed553b199b5091542064eba4121aff99ceff` exposed a test-parser defect (the test read the header line instead of the following comma-separated ID line). The parser was corrected in `f4064bb998343f587ee769259059db7202dc121f`; the exact-head rerun above passed.
- Local pytest/npm were not run in this connector-only session. GitHub Actions supplied the verification evidence.
- No post-fix multi-engine benchmark was run; the recovery PR changes only research metadata/tests and does not claim updated phonetic benchmark scores.

Current research disposition remains: **239 reconstructed candidate IDs; 3 verified FIX overlaps; 236 candidate cases still unresolved**. RETAIN and ABSTAIN do not decrement the remaining count. Historical membership is still PARTIAL pending confirmation of the original aggregate selector; no independent IPA or Ukrainian-target gold is claimed.


## 20. 2026-11-05 — 236-candidate review and whole-repository continuation

### Starting state and repository inventory

- Starting default-branch commit: `043754498f3ad8a17aa6c13b5f643b197536da8a` (`main`).
- Recursive tree: 806 entries (767 files), 164 Markdown files, 390 test files, 62 scripts, 18 workflows and 13 schemas; `docs/` contains 140 files and `research/` 49.
- PR #435 (239-ID replay) and PR #434 (documentation/navigation) were merged. The retained PR #435 source branch was not deleted. This continuation created `research/236-candidate-review-2026-11-05` and draft PR #436; no existing branch or PR was force-pushed, deleted, or modified.
- The architecture, IPA-first target boundary, independent g2pK baseline, vendored-code boundary, canonical data ownership, schema/test contracts and existing research registers were inspected. No phonological production rule or Ukrainian target mapping was changed.

### 236-case review outcome

The pinned pre-C11/C12 Broad-only aggregate replay yields 239 unique candidate IDs and joins all 239 to the 370-row context superset. Three existing exact-form FIX overlaps (37, 704, 2031) are excluded, leaving 236 candidate occurrences. The new CSV and deterministic generator are proposed in PR #436.

| Review disposition | Count | Meaning |
|---|---:|---|
| No individual disposition in current narrow registers | 213 | Not individually adjudicated; no decision inferred |
| Existing ABSTAIN overlap | 22 | Evidence-limited and unresolved |
| Provisional RETAIN | 1 | Occurrence 1140 (`출산`), independent review pending |
| **Total** | **236** | Candidate occurrences, not confirmed pronunciation defects |

The rows represent 151 distinct token strings, 110 source rows/contexts and 168 source-row/token pairs. They contain 254 Broad edit operations across 24 signatures. The two largest signatures are 184 lenis `ɕ → s` operations and 24 fortis `ɕ͈ → s͈` operations. The latter are not covered by the lenis-only C11 optional variant and require separate review. The inherited C04 label on 206 rows is stale: the current cluster register has zero C04 residuals after the former aspirated-velar group was reclassified to C12. The new ledger explicitly labels inherited cluster values as historical-only.

The replay's 239 membership remains PARTIAL: the original historical selector/member list was not preserved. The 236 inventory is a reproducible review queue, not linguistic confirmation. Two independent Korean IPA reviews, exact source convention/context, and separate Ukrainian target review are still required. The full post-fix multi-engine benchmark has not been rerun.

### Source-register correction

The Cambridge primary record identifies S018 as Hyun Bok Lee, *Korean*, Journal of the International Phonetic Association 23(1), June 1993, pp. 28–31, DOI 10.1017/S0025100300004758. The prior data catalog entry had year 1999 and the research source-register entry incorrectly attributed the Cambridge article to Sohn (2008). PR #436 corrects the catalog, source register, C11/C02/C01/C07 research references, and Python profile comment, with a bibliographic regression. This is a metadata correction only; it does not adjudicate individual pronunciations or clear reuse rights.

### Verification and intermediate failures

- Initial PR #436 head `51b7bce8dcf8fd7bac1bf87193e220dd48233ead`: Python 3.11/3.12/3.13, browser regression/build, wheel install, teacher-corpus audit, web and generated artifacts **PASS**.
- Intermediate head `c7d95e64082a45e13c062c78c977e347d72fcbfc`: Python tests **FAIL** on three issues (field rename not propagated, source-register coverage assertions removed, S018 catalog year not yet corrected); Browser passed. All three were corrected and the signature regression was added.
- Implementation/test head `e253de40d97135ad5e61ba7e49546e2d4641b0a1`: Python 3.11/3.12/3.13, Browser regression/build, wheel install, teacher-corpus audit, paired UGTPHON, research artifacts, external UGTPHON, exhaustive test-case extraction, system verification and morphology consensus **PASS**. The multi-engine diagnostic was **CANCELLED** after a subsequent branch update, not passed. NIKL metadata-only and Charsiu inference were **SKIPPED**.
- Latest documentation-only head `2877027d557d4ee725ac63f6a4d990c7e9e6702b`: system verification **PASS** for Python and Browser; NIKL inventory **SKIPPED**. Local pytest/npm were not executed.

### Task ledger

| Work item | Status | Acceptance / blocker |
|---|---|---|
| Repository structure, source ownership, runtime boundaries, tests/workflows inventory | DONE_VERIFIED as a focused structural audit | 806-entry tree and canonical guides inspected; not every source file was read line by line |
| 236-row review inventory and generator | DONE_VERIFIED as a derived inventory | Generator/CSV parity, 236/213/22/1 dispositions, 254/24 signature counts and historical C11/C04 label counts passed on implementation/test head e253de4; latest docs-only head system verification passed |
| Historical 239 identity | PARTIAL / EVIDENCE-LIMITED | Recover original selector/member list or prove replay matches historical triage |
| Individual IPA adjudication | BLOCKED | Two independent qualified Korean IPA reviewers, source convention and exact context needed |
| Fortis sibilant sub-stratum | BLOCKED | 24 `ɕ͈ → s͈` operations need evidence separate from lenis C11 |
| C12 audio/speaker/prosody crosswalk | BLOCKED | Current source ledger lacks audio and speaker metadata |
| Ukrainian target validation | BLOCKED | Independent Ukrainian phonetic/orthographic review on adjudicated IPA inputs |
| NIKL item-level rights / clean capture authenticity | BLOCKED / PARTIAL | Page/item KOGL terms and pristine capture remain unverified |
| Full post-fix benchmark and remaining parity/coverage | TODO / PARTIAL | Run after evidence-backed changes; do not compare historical scores as post-fix metrics |
| Neural teacher training | DEFERRED | Requires independent IPA gold and corpus-rights clearance |

**Readiness:** partial research prototype; not research-certified and not release-ready. No release, deployment, branch protection, external setting, branch deletion, or merge was performed.


## 21. 2026-11-05 — workflow references and comparator evidence

A pinned comparison of [Superpowers](https://github.com/obra/superpowers), [Matt Pocock skills](https://github.com/mattpocock/skills) and [Ponytail](https://github.com/DietrichGebert/ponytail) is recorded in [ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-05.md](ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-05.md). All inspected snapshots have MIT licences; no code, skill text, artwork or benchmark data were copied. Adopted practices: requirements clarification, TDD, systematic debugging, exact-head verification, small composable procedures and benchmark transparency. Existing linguistic matrices remain canonical.

### Exact-head comparator evidence (PR #436, 44c9b08f20d3099ce57a2ba9b7a478c4ed0388d3)

- UGTPHON: 2,698 scored, 1,431 exact (53.0393%), CER 8.966%, five unresolved, zero engine errors; non-normative and convention-sensitive.
- Native vs g2pk paired: 2,698 shared; exact 53.0393% vs 53.1134%, but CER 8.966% vs 9.2304%. Near-tie; no production engine decision.
- Kiwi/MeCab consensus: 2,703 occurrences, 1,907 unique words; three words changed IPA/status, one newly resolved, four unresolved, 24 phrase-boundary cases withheld.
- Raw-surface retrieval: 3,140 attempted, 2,639 scored; 22/722 noncanonical hits, no canonical hits or potential canonical false rewrites.
- Python versions, browser, wheel, corpus, paired UGTPHON, morphology, external IPA and artifact jobs passed. Multi-engine IPA comparison was still in progress. CharsiuG2P, ByT5 and NIKL metadata checks were skipped, not passed.

### Task ledger

| Item | Status | Remaining acceptance |
|---|---|---|
| 236-row inventory | DONE_VERIFIED as reproducible inventory | Not linguistic confirmation |
| External comparator diagnostics | PARTIAL | Multi-engine run still pending; skipped engines remain unavailable |
| Historical 239 membership | PARTIAL / EVIDENCE-LIMITED | Original selector/member list absent |
| 213 unadjudicated rows | TODO / BLOCKED | Independent IPA decisions with exact context/provenance |
| 22 ABSTAIN + 1 RETAIN | BLOCKED | Independent IPA review; neither closes a case |
| 24 fortis sibilant operations | BLOCKED | Separate review; not covered by lenis-only C11 |
| Ukrainian target | BLOCKED | Separate review after Korean IPA adjudication |
| NIKL item rights/capture | BLOCKED / PARTIAL | Item-level terms and clean capture provenance |

No production-default phonological rule, canonical broad IPA reading, or Ukrainian target mapping was promoted. This branch does narrow the research-only optional [ɕ] variant and selectable partial narrow profile to the /i, ye, ya/ contexts supported by the reviewed Kang (2010) abstract; this is a deliberate research-profile scope correction with regression coverage, not a categorical pronunciation claim. No release, deployment or branch deletion was performed.


## 22. 2026-11-05 — primary-source scope correction, queue versioning and exact-head revalidation

### S018/S019 evidence correction

Direct inspection of Cambridge's Lee (1993) PDF, p.31, found a substantive interpretation error in the earlier C11 note: Lee's own inventory explicitly lists /s/ among /p,t,k,c,s/ fortis sounds. The page does describe [ɕ] before /i/ and /j/-initial diphthongs, but this cannot be transferred directly to modern lenis /s/ or modern /s͈/ without reconciling notation and category. S018 remains a source for its Seoul /h/, /l/, stop-release and source-specific sibilant description; it is **not** the direct lenis C11 authority.

S019 (Kang 2010) is the relevant lenis /s/ acoustic source. Its KCI abstract reports coarticulation/palatalization before /i, ye, ya/ and a distinct spectral pattern before /yu, yo/. The abstract does not establish a categorical [ɕ] phone for every /j/-initial diphthong. The Python broad optional variant and narrow partial profile are now limited to the explicit /i, ye, ya/ Hangul contexts (ㅣ, ㅖ, ㅑ); ㅒ, ㅕ, ㅛ and ㅠ are not generalized. The canonical broad [s] and all Ukrainian outputs remain unchanged. This is a conservative research-profile scope correction, not a production-default phonological change.

The 236-row crosswalk was corrected accordingly: 157/184 lenis `ɕ→s` operations (156 occurrences) fit the /i, ye, ya/ contexts; 27 operations across 27 occurrences, six token strings and five source rows are outside those contexts. The 24 fortis `ɕ͈→s͈` operations remain separate and unresolved. The mixed `실시간` row has one lenis context and one separate fortis context. The 27 out-of-scope occurrence IDs are locked in the regression test.

### Historical vs current unmapped queue

The 36-row `kozak-kim-unmapped-mismatch-review-queue-2026-11-03.csv` is a historical, hash-pinned input to the 31-row abstention register and must remain immutable. The current pinned multi-engine rerun emits 32 rows after four cases no longer appear in the new export (37, 704, 2018, 2031). It is now stored separately as `kozak-kim-unmapped-mismatch-review-queue-2026-11-05.csv`. A regression verifies that the 32 rows are an exact subset of the historical file and that the historical 36-row/31-abstention crosswalk remains intact. The multi-engine workflow now compares against the date-specific 2026-11-05 artifact, not the historical file.

### Current external diagnostic snapshot

Run 42019876519, artifact 13411253960 (SHA-256 `bd5d4bc605a692858477984ba44539612270b8f90fc3d9c1a8e737f86557d5ca`) completed all ten engine comparisons over 2,703 eligible occurrences (2,698 common scored tokens for paired comparisons). This run's benchmark comparison step succeeded; the job was marked failed only because it compared the newly generated 32-row queue to the stale 36-row historical CSV. The queue has since been versioned and the exact-head workflow rerun is pending.

| Engine | Exact / 2,703 | Exact rate | CER |
|---|---:|---:|---:|
| ClippyFirst native | 1,431 / 2,698 scored | 53.0393% | 8.9660% |
| g2pk 0.9.4 | 1,435 / 2,703 | 53.0892% | 9.2285% |
| g2p-ko 1.0.0 | 1,418 / 2,703 | 52.4602% | 9.3885% |
| KoG2P 2019 | 738 / 2,703 | 27.3030% | 19.5122% |
| HAMA 1.7.0 | 457 / 2,703 | 16.9071% | 25.1081% |
| kokorog2p 0.9.15 | 495 / 2,703 | 18.3130% | 26.5352% |
| KoG2Padvanced 2022 | 1,279 / 2,703 | 47.3178% | 10.6772% |
| hangul_to_ipa | 439 / 2,703 | 16.2412% | 24.8054% |
| eSpeak NG | 220 / 2,703 | 8.1391% | 33.6101% |
| phonemize 2.0.1 | 1,150 / 2,703 | 42.5453% | 14.3531% |

Native/g2pk paired difference on 2,698 shared tokens: native exact 1,431/2,698 (53.0393%), g2pk exact 1,433/2,698 (53.1134%); paired CER 8.9660% vs 9.2285%. The exact-match delta is +0.0741 percentage points, while CER worsens by +0.2644 percentage points. The report documents shared renderer/normalization and other comparability limitations; it is diagnostic, not gold. The dataset is user-generated, the Broad profile is non-normative, and no engine score licenses a production rule or Ukrainian target.

### Training-readiness gate

The same artifact's training-readiness audit reports 644 lexical rows, zero duplicate lexical forms, 46 additions and a 24-case frozen holdout. It explicitly marks **zero independently adjudicated IPA gold rows** in additions and **zero holdout IPA gold labels**. Consequently `supervised_ipa_training_ready=false`. The holdout packets are blinded to engine outputs, contain 24 cases each for reviewers A/B, and prohibit tuning use. The two packets have identical SHA-256 because their blank schema and source cases are intentionally the same; no reviewer annotation has been supplied. Training or benchmark tuning on UGTPHON/SIGMORPHON test rows or the frozen holdout remains prohibited.

### Status

- Source identity and scope correction: DONE_VERIFIED by direct Cambridge PDF p.31 and KCI abstract inspection; software regression updated.
- 236 inventory: DONE_VERIFIED as a deterministic inventory only.
- Historical 239 membership: PARTIAL / EVIDENCE-LIMITED; original selector/member list still absent.
- 157 context-compatible lenis edit operations: source-environment compatible only; pronunciation adjudication TODO.
- 27 out-of-scope lenis operations and all 24 fortis operations: BLOCKED on independent Korean IPA evidence.
- 22 ABSTAIN + 1 RETAIN: remain unresolved; no reviewer adjudication.
- Ukrainian target and item-level source rights: BLOCKED.
- Current multi-engine export parity: rerun pending after versioned queue correction; prior benchmark comparison itself succeeded, but workflow job failed on stale artifact comparison.
- Supervised IPA training: BLOCKED; no independently adjudicated IPA gold and frozen holdout annotations absent.

No production-default IPA, Ukrainian target, release, deployment or branch merge was performed.


### Additional separate S027 context

A second Kang (2010) KCI paper is now registered as S027: *Korean Sibilant /s/ before a High Front and a Round Segment* (Phonetics and Speech Sciences 2(4):59–65; [KCI](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001509195)). Its abstract describes a distinct labio-palatalized spectral pattern when a high-front and a round segment occur within the same syllable. The KCI article page states CC BY-NC 3.0 Unported; the repository records attribution/noncommercial terms and does not redistribute the PDF. Of the 27 lenis edits outside S019's /i, ye, ya/ set, occurrence 606 (`쇼`, /yo/) is a possible S027-context case. The abstract does not specify a canonical segmental IPA symbol, so this does not authorize [ɕ] or [ɕʷ] as a deterministic output. The other 26 edits remain outside the two reviewed abstract scopes. S027 is citation-only; full text, acoustic measurements and item-level pronunciation adjudication remain outstanding.


## 2026-11-05 exact-head CI repair and current verification — f2b30e3e64b42fed4ce9a857f76399df87559a12

The first exact-head run exposed three stale browser-suite assertions, not production-code failures:

1. The NIKL Q&A register test expected a quoted CSV first field, while the canonical source register serializes this row with an unquoted first field. The test now matches the actual canonical CSV row prefix and continues to assert the exact URL, contrast, and rights caveats.
2. The source-register rights audit expected 178 rows and 9 manual-classification cases. The current source register contains 179 rows and 10 manual-classification cases after adding the separately reviewed Korean IPA source. Expected counts were updated; rights remain open, not cleared.
3. The CLI row-count assertion was updated from 178 to 179.

Failed browser/web jobs were rerun rather than ignored. At exact head above, these workflows passed: **tests** (Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, web suite), **Verify Korean–Ukrainian system** (browser regression/build and Python regression/data integrity), and **Master table and research corpus artifacts** (corpus generation). The PR's Python/data integrity checks also pass.

The multi-engine diagnostic, external UGTPHON diagnostic, paired native/g2pk comparison and Kiwi/MeCab morphology consensus were still running at the last check. CharsiuG2P, ByT5 and official NIKL metadata inventory remain skipped by explicit workflow policy; they are not passes. No local shell execution was performed in this connector-only session. The PR remains open and unmerged pending the diagnostic run completion and final exact-head review.

## 2026-11-05 — source refinement, repetition analysis and exact-head verification

- **Sibilant evidence refinement:** the source register now includes and rechecks Kong & Kang (2020), a preliminary Seoul Korean study of 32 young adults (17 women, 15 men), seven monophthong contexts, word-initial/medial tokens, and speaker-conditioned spectral differences with palatalized variants before /i/. It also adds Sung & Cho (2010), a Korean lax/tense vs English sibilant comparison across /i, a, u/. Both are abstract-level reviews; neither provides item-level audio or confirms any of the 236 UGTPHON occurrences. Their full texts/raw data were not inspected. See the 236 review note and source register.
- **Repetition weighting:** the 236 occurrences contain 151 unique token spellings and 110 source rows; 135 token spellings occur once. Repeated forms include 아끼셔 (22), 스시녀들은 (15), 시중도 (14), and 신안 (10). Group repeated observations before counting evidence; do not treat 236 occurrences as 236 independent speakers or utterances.
- **Source registry:** 180 records. Rights checks remain open (the current browser rights-audit test expects 166 REVIEW_REQUIRED and 10 MANUAL_CLASSIFICATION_REQUIRED); this is not a rights clearance.
- **Exact code/evidence head:** 52586302f305dfd2b81184cef81f0c68def0c4f2. Python 3.11/3.12/3.13, wheel install, teacher audit, web, Python regression/data integrity, browser regression/build, corpus generation and exhaustive extraction passed. External UGTPHON IPA, paired native/g2pk and morphology consensus diagnostics passed. Multi-engine IPA comparison run 42029149673 remains in progress; do not claim a result until its artifact is published. CharsiuG2P, ByT5, Charsiu train/dev and NIKL metadata-only jobs were skipped by workflow policy.
- **No linguistic promotion:** the research-only optional [ɕ] variant and partial narrow-profile candidate scope are limited to /i, ye, ya/ contexts; canonical broad [s], phonemic output and Ukrainian target mapping are unchanged. The 24 fortis ɕ͈→s͈ operations remain a separate unresolved stratum.


## 2026-11-05 continuation — 236-candidate evidence gate

The 2026-11-04 main-branch audit snapshot above remains historical and unchanged. Subsequent work continued on the single branch `research/236-candidate-review-2026-11-05`, Draft PR #436, without merging or creating a parallel branch.

- The reconstructed 236-occurrence candidate baseline remains intact.
- Current disposition: 15 exact standard-form/rule confirmations; 181 bounded profile/variation reconciliations; 12 ABSTAIN pending independent IPA review; 28 not individually adjudicated. Thus 196 are dispositioned and 40 remain unresolved.
- None of the 236 has independent speaker-level acoustic IPA gold. No production IPA, Ukrainian target, or benchmark gold was changed.
- Source register now contains 207 entries; 3 item-level licenses, 1 not applicable, 180 rights-review required, 23 manual-classification required; 203 remain open.
- NIKL Q&A 332662 is negative evidence for `쇼`: no standardized foreign-word pronunciation entry and no IPA gold. NIKL Q&A 328785 is a Rule 29 negative control: phonological shape alone does not guarantee n-insertion.
- Kim & Hong (2025) full-text scope was corrected in the case adjudication: /iə~ijə/ and /oa~owa/ within-word pairs do not test /o.ʌ/ or numeral compounds.
- The preceding malformed-CSV defect is fixed; all 207 source-register records parse as exactly 12 columns. Exact-head `785ee15473f83de3583c1d470a4ce477bd8575ab` verification: tests (Python 3.11/3.12/3.13, web, wheel, teacher audit) passed; system Python regression/data integrity and browser regression/build passed; corpus generation, extraction, pinned UGTPHON, paired native/g2pk and morphology consensus passed. Multi-engine IPA diagnostic remains in progress. Charsiu train-dev, ByT5/Charsiu inference and NIKL metadata-only jobs were skipped by policy. Local pytest/npm were not run.
- The previous failed run's wheel-install and teacher-corpus-audit jobs passed; web and Python 3.13 failed due to the malformed CSV; Python 3.11/3.12 were cancelled. Local pytest/npm were not run.

