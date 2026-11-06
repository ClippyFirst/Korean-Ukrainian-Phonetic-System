# Repository audit and structure — 2026-11-06

## Scope and exact snapshot

Repository: [ClippyFirst/Korean-Ukrainian-Phonetic-System](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System).

- Default branch at start: `main`, commit `043754498f3ad8a17aa6c13b5f643b197536da8a`.
- Working branch: `research/236-candidate-review-2026-11-05`.
- Working-branch snapshot for this audit: `9fa7b589ae881c497ea0800b3ae0886ce1990bfd` (before this final audit/handoff commit).
- PR #436 is the single active integration PR. PR #437 was closed as superseded after all 13 of its changed paths were confirmed present and reconciled on #436; its source branch is preserved.
- Recursive tree at the working-branch snapshot: 831 entries (789 files, 42 directories), 177 Markdown files, 394 files under `tests/`, 64 scripts, 18 GitHub Actions workflows and 13 schemas; `docs/` contains 146 files and `research/` 55. Seven repository-local skills are present.

This is a repository-state, 236-case implementation and documentation-structure audit. It is not an independent Korean IPA adjudication, Ukrainian reader study, source-rights opinion, or local clean-room test run.

## 236-case evidence and runtime decision

The reconstructed cohort contains 236 occurrence rows, not 236 independent phonological rules or independent speakers.

| Disposition | Rows | Runtime decision |
|---|---:|---|
| `RULE_CONFIRMED_STANDARD_VARIANT` | 15 | 15 occurrences covered by exact runtime licenses (ten new exact occurrence licenses plus five pre-existing licenses); no input spelling rewrite |
| `PROFILE_CONVENTION_MISMATCH_CONFIRMED` | 181 | Keep broad/narrow profile distinctions; do not create categorical Korean sound-change rules |
| `ABSTAIN` | 12 | No runtime change; insufficient token-specific evidence |
| `UNADJUDICATED` | 28 | No runtime change; individual evidence incomplete |
| **Total** | **236** | All rows retained |

196 rows have a disposition; 40 remain unresolved. None has independent speaker-level acoustic IPA gold. The 181 profile rows are not a license to rewrite the candidate speaker's phone or to change canonical phonemic output.

Exact integrations are documented in [the 236-case engine integration record](KOZAK-KIM-236-ENGINE-INTEGRATION-2026-11-06.md) and machine-readable [occurrence-to-runtime register](../research/kozak-kim-236-engine-integration-2026-11-06.csv):
- NIKL Rule 5: exact genitive-particle eojeols `그놈의` and `자신의`.
- R008: exact eojeol/pair licenses for `정권`, `유사성`, `혐오증`; no productive `-권/-성/-증` rules.
- NIKL Rule 29: exact compound `연전연패`; three rows are repetitions of one source/token family.
- NIKL Rule 26: exact `출시미정에`.
- Five pre-existing exact licenses (`출산`, `팔자걸음`, `보일거라`, `물가로`, `안할듯`) are preserved.

`머리속에` now has an exact pronunciation-only R008 alias for `리>속`; the original spelling is preserved and no orthographic normalization or productive `머리+속` rule is introduced. No guessed IPA or Ukrainian target is added for abstained or unadjudicated cases.

## Architecture and ownership boundaries

Preserve the established transformation pipeline:

`Korean orthography → structural and supported morphological analysis → Korean phonology → IPA or typed uncertainty → Ukrainian target adaptation → Ukrainian practical orthography`.

The Python native engine, browser runtime, independent g2pK baseline, Kozak Kim/NIKL research rules, source data, generated browser projection and IPA-to-Ukrainian renderer remain distinct. No new 236-case path writes Ukrainian output directly from Hangul.

## Documentation and agent workflow

The repository remains intentionally organized by responsibility rather than by bulk-moving its large historical documentation tree. Current navigation is:
- `README.md`: product entry point and links.
- `AGENTS.md`: repository-wide agent router and non-negotiable contracts.
- `docs/AGENT-WORKFLOWS.md`: task lifecycle, skill routing and evidence discipline.
- `.agents/skills/`: four domain-specific linguistic/NIKL skills plus three general engineering, audit and review skills.
- `docs/README.md`: documentation map and authority rules.
- `docs/REPOSITORY-STRUCTURE.md`: ownership, runtime entry points and development commands.
- `research/SOURCE-REGISTER.csv`, `research/RULE-COVERAGE.csv`, `research/ACCEPTANCE-GATES.md`, `research/DECISION-LOG.md`, and `research/ROADMAP.md`: canonical research evidence and status.
- `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`: append-only session history; newest dated section wins.

No second source register, rule matrix, acceptance ledger or master plan has been created. Historical file paths remain stable.

## Upstream workflow reference decisions

Four supplied repositories were reviewed and are process references only:
- Unlazy: adopt explicit acceptance gates, evidence freshness, re-verification and honest handoff; do not import its checker, approval store, Stop hook, leases or Depth Tree orchestration.
- Superpowers: adopt test-first behavior changes, root-cause debugging and verification; do not force a synthetic RED test for editorial-only changes.
- Matt Pocock skills: adopt small composable procedures, clear routing and codebase-aware review; do not duplicate the skill catalogue or external tracker assumptions.
- Ponytail: adopt risk-first audits and measured benchmarks; do not import author-reported savings/quality claims as evidence about this project.

Pinned source revisions and detailed boundaries are recorded in [the 2026-11-06 workflow reference audit](ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md). No upstream code, skill text, hooks, plugins, artwork or benchmark data is copied.

## Task ledger

| Workstream | Status | Acceptance / blocker |
|---|---|---|
| Reconstructed 236-row ledger | DONE_VERIFIED as a preserved/reproducible cohort | All 236 rows retained; generator, provenance and row-integrity tests are included in PR #436. This is not independent IPA gold. |
| 15 exact occurrence runtime integrations | PARTIAL pending exact final-head CI | Ten new exact licenses plus five baseline licenses; new alias and profile variants have Python/browser regressions; verify exact final head. |
| 181 profile-convention reconciliations | DONE_VERIFIED as non-integration decisions | No categorical phonology changes; token-acoustic IPA remains unresolved. |
| 12 abstentions + 28 unadjudicated | BLOCKED | Need exact token audio or independent Korean IPA evidence with source/profile/prosodic context. |
| `머리속에` pronunciation alias | PARTIAL pending exact final-head CI | Exact full-eojeol alias is implemented without rewriting spelling; a general orthographic-normalization layer remains out of scope. |
| Agent routing and workflow documentation | PARTIAL pending final exact-head CI | Root guide, three general skills, workflow guide, navigation and structural test are ported into PR #436 branch. |
| Upstream reference audit (four repositories) | DONE_VERIFIED as a documented comparison | Pinned revisions and adoption/rejection boundaries documented; no upstream code copied. |
| Independent Korean IPA gold | BLOCKED | Requires qualified independent reviewers and adjudication; corpus labels/model agreement are insufficient. |
| NIKL item-level reuse rights | BLOCKED | Item-level rights classification/permission evidence remains incomplete. |
| Independent Ukrainian target validation | BLOCKED | Requires Ukrainian phonetic/orthographic reader review and acceptance tests. |
| Full local clean-install run in this session | BLOCKED | GitHub connector environment does not provide a local checkout/shell; use exact-head GitHub Actions and report no local run. |
| Release readiness | DEFERRED | Research prototype only; external linguistic and rights gates remain open. |

## Branch and PR reconciliation

- PR #436 remains the working integration branch, based on the inspected main commit `043754498f3ad8a17aa6c13b5f643b197536da8a`.
- PR #437's root `AGENTS.md`, three general skills, agent workflow guide, structural contract test and navigation changes were ported to the #436 branch and reconciled with the 236-case documentation.
- All 13 changed paths from PR #437 are present on #436; PR #437 is closed as superseded, with its branch preserved. No PR was blindly merged.
- No user branch was deleted, no force-push was used, and `main` was not modified.

## Verification snapshot

At final pre-handoff head `9fa7b589ae881c497ea0800b3ae0886ce1990bfd`, GitHub Actions had 1 successful sub-job, 5 skipped, 2 in progress and 18 queued. Multi-engine diagnostic run [42193072679](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072679) was in progress; research morphology smoke [42193072667](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072667) had one Kiwi smoke sub-job pass and MeCab still in progress. Tests matrix [42193072530](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072530), Verify [42193072622](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072622), browser G2P [42193072634](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072634), morphology consensus [42193072645](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072645), exhaustive extraction [42193072676](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072676), master artifacts [42193072796](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072796), paired native/g2pk [42193072643](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072643), and external UGTPHON [42193072568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072568) were queued. Charsiu train/dev, official NIKL metadata inventory, CharsiuG2P and ByT5 were skipped by workflow policy, not passed. Earlier code/data head `37ccbd17ac764ee83e592c8434372a00195ddd68` had successful Python regression/data integrity, browser regression/build (1,398/1,398), Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, browser G2P, artifact generation, exhaustive extraction, UGTPHON, paired native/g2pk and morphology diagnostics; its multi-engine diagnostic was cancelled and is not counted as passed.

No local `npm`, `pytest`, build or clean-install command was run: a container-side `git ls-remote` attempt failed because `github.com` could not be resolved. A connector-side Markdown link audit checked nine primary navigation/research documents and found zero broken relative links. CSV consistency checks confirmed 236 unique candidate rows, all 15 integration-register IDs present in that cohort, integration dispositions of 9 new / 5 baseline / 1 blocked, and 212 source-register rows. The exact-head CI queue remains the outstanding software-verification gate.

## Readiness

The repository remains a **partial research prototype**, not research-certified and not release-ready. Software integration can be verified independently; it cannot substitute for independent IPA gold, Ukrainian target review or item-level rights clearance.


## Superseding verification update — 2026-11-06 (after PR #436 merge)

The prior verification snapshot above is historical. PR [#436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/436) is now merged. Merge commit on `main`: `da931f1fa4d95b000bfaa9a0fd54f36cebb1703c`; merged PR head: `e525a15f15eebbd472c7d81033ff2991025e5525`.

### Updated task ledger

| Workstream | Status | Current evidence / remaining acceptance |
|---|---|---|
| 236-row reconstructed cohort and provenance | DONE_VERIFIED as a reproducible cohort | 236 unique rows and reproducible register/generator checks; not independent IPA gold. |
| 14 exact occurrence runtime integrations | DONE_VERIFIED as bounded software implementation | Merged in #436; exact-head Python/browser parity and negative controls; does not imply independent pronunciation adjudication. |
| 181 profile-convention differences | DONE_VERIFIED as explicit non-integration decisions | No categorical phonology rules added. |
| 12 abstentions + 28 unadjudicated | BLOCKED | Need token audio or independent Korean IPA evidence with source/profile/prosodic context. |
| `머리속에` spelling normalization | DEFERRED / BLOCKED | Requires separately specified orthographic/semantic layer and disambiguation policy. |
| Agent routing, workflow docs and structural tests | DONE_VERIFIED as merged documentation/tooling | Included in #436; PR #437 closed as superseded, its branch preserved. |
| Four upstream workflow reference audit | DONE_VERIFIED as documented process comparison | Pinned revisions and adoption/rejection boundaries; no upstream code copied. |
| Exact-head CI for merged change | DONE_VERIFIED | All applicable completed jobs on PR head `e525a15f15eebbd472c7d81033ff2991025e5525` passed; optional NIKL/Charsiu/ByT5 jobs skipped. See run IDs below. |
| Independent Korean IPA gold | BLOCKED | Requires qualified independent reviewers and adjudication; corpus labels/model agreement are insufficient. |
| NIKL/source item-level reuse rights | BLOCKED | 208 open source-register items remain in review/manual-classification categories; permissions not inferred. |
| Independent Ukrainian target validation | BLOCKED | Requires Ukrainian reader/phonetic review and acceptance tests. |
| Full local clean-install in this session | BLOCKED | Connector-only environment has no local checkout/shell; GitHub Actions performed the available clean wheel install and build checks. |
| Release readiness | DEFERRED | Research prototype only; external linguistic and rights gates remain open. |

### Exact-head verification (PR head immediately before merge)

- Tests matrix [42193471625](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471625): PASS — Python 3.11/3.12/3.13, web tests/build, teacher-corpus audit, clean wheel-install IPA data verification.
- System verification [42193471270](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471270): PASS — Python regression/data integrity and browser regression/build/generated pages.
- Multi-engine IPA [42193471280](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471280): PASS — engine comparisons, overlap audit, reviewer packets, Browser same-occurrence run, runtime parity, SIGMORPHON, mismatch export.
- Browser G2P [42193471380](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471380), UGTPHON [42193471364](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471364), exhaustive extraction [42193471134](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471134), morphology consensus [42193471411](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471411), morphology smoke [42193471149](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471149), corpus artifacts [42193471212](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471212), and paired native/g2pk [42193471116](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471116): PASS.
- Charsiu train/dev [42193471275](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471275), official NIKL metadata inventory and optional ByT5/Charsiu inference: SKIPPED, not passes.

The merged commit `da931f1fa4d95b000bfaa9a0fd54f36cebb1703c` was confirmed as the merge commit for PR #436. The commit-runs endpoint returned no PR-triggered runs for the merge commit itself; all listed checks are explicitly tied to the exact PR head before merge. No local npm/pytest command was executed in this session.

**Verdict:** software integration is merged and CI-verified. The repository remains a **partial research prototype**, not research-certified and not release-ready.


## 2026-11-06 — second-pass review of the 40 unresolved 236-cohort occurrences

The canonical candidate review now contains a focused evidence pass over all 12 abstentions and 28 previously unadjudicated occurrences. It corrects several scope errors (notably 아끼셔 is lenis /s/ before /jʌ/, 체험 contains /e.hʌ/, and Rule 29 phrase-level applicability requires connected-speech evidence) and records why the remaining comparator mismatches cannot yet be promoted to IPA gold.

The unresolved count remains 40 (12 abstentions + 28 unadjudicated). No runtime rule, benchmark gold, IPA target, or Ukrainian target changed. This is an evidence-gated decision, not an assertion that the cases are unimportant: source audio/speaker mapping and two independent Korean IPA annotations remain the acceptance blockers. See [the canonical candidate review](../research/kozak-kim-236-candidate-review-2026-11-05.md#2026-11-06--focused-second-pass-review-of-the-remaining-40-occurrences).


## 2026-11-06 — PR #441 follow-up: 236-case runtime coverage and parity correction

- PR #441 remains the active implementation branch, based on main `07c0233fa7aaee18cbfde82f764ac9061a0fb24d`. The 236-row ledger remains 15 `RULE_CONFIRMED_STANDARD_VARIANT`, 181 `PROFILE_CONVENTION_MISMATCH_CONFIRMED`, 12 `ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW`, and 28 `NOT_INDIVIDUALLY_ADJUDICATED`.
- All 15 standard-form/rule occurrences have explicit runtime dispositions (10 newly integrated on this branch, five preserved from baseline). The 181 profile rows are not promoted to productive phonological rules. The 24 fortis `ɕ͈→s͈` operations occur in 24 occurrence IDs across 19 source rows; 23 are before /i/ and one is before /jo/. Kong & Kang (2021) show context- and gender-specific fronting of /s͈i/ closer to [s] than [ɕ], so no generic [ɕ͈] variant is accepted.
- Code correction commit `dcf1726212e16719b0fdc03311e5903448151e8b` aligns Browser optional lenis [ɕ] variants with Python's evidence-scoped /i, ye, ya/ set, removes unsupported `/jʌ, jo, ju/` candidates, and handles post-rule coda-ㅅ resyllabification for IDs 143 (`멋있노`), 538 (`멋있어`), and Rule 13 context cases 475, 2392 and 2667. Regression tests cover six resyllabified forms, supported contexts, out-of-scope negative controls, and fortis negative controls.
- The current profile disposition for IDs 143 and 538 is confirmed in `research/kozak-kim-context-adjudication-2026-11-05.csv`; older prose saying they remain open is superseded. ID 538 has direct NIKL Q&A 306166 support for the [머시써] surface variant. This is a broad-vs-narrow profile reconciliation, not speaker-specific acoustic IPA gold.
- No canonical IPA, phonemic output, Ukrainian target, or benchmark gold changed. The 12 abstentions and 28 unadjudicated occurrences remain blocked on source audio, speaker crosswalk, and independent Korean IPA annotation. No local pytest/npm run is claimed in this connector-only environment. The master handoff section was updated in PR #441, but it still contains stale snapshot metadata (implementation head 0d158a..., fortis count 22, and CI pending). A later full-file correction was rejected by the available content action; the final merge SHA, exact verified code/test head, and current CI statuses are recorded here and in the PR description. Do not treat those stale master-handoff fields as current.
- Exact-head CI for the final PR #441 head is the remaining software acceptance gate. Optional NIKL metadata, Charsiu and ByT5 jobs are skipped by policy, not passed. PR #439 remains separate and open with its previously recorded rights-audit test failures.


## 2026-11-06 — post-merge verification of the 236-case completion

- PR #441 was merged into main with merge commit `f89c475c56796119e87130367fc15926b2428220`; the verified implementation/test head was `847cdb240aadc2c9343127fbb7de6dafad0441d4`.
- Exact-head core checks on `847cdb2`: Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, web checks, Python regression/data integrity, browser regression/build, Browser G2P, UGTPHON Korean split, paired native/G2PK comparison, Kiwi+MeCab-Ko consensus, research morphology adapter smoke, exhaustive test-case extraction, and master corpus artifact generation all **PASS**.
- Official NIKL metadata inventory, Charsiu and ByT5 optional jobs were **SKIPPED**, not passed. Pinned multi-engine workflow `42215019081` remained **IN_PROGRESS** at the multi-engine comparison step; its later browser parity and SIGMORPHON steps had not yet run. Do not claim this benchmark passed.
- The candidate ledger remains 236 rows: 15 standard-rule cases implemented/preserved, 181 profile-convention rows handled without new categorical phonology, 12 abstentions and 28 unadjudicated rows remain evidence-limited. The 24 fortis `[ɕ͈]→/s͈/` operations occur in 24 occurrence IDs across 19 source rows; 23 are before /i/ and one is before /jo/. Direct 2021 acoustic evidence is speaker- and context-specific and does not support [ɕ͈] as a generic IPA value; exact cohort speaker/audio evidence remains required.
- No local pytest/npm command is claimed; all verification above is from GitHub Actions. No release was published.


## Superseding continuation snapshot — 2026-11-06 after PR #441/#442 merge

**Current default-branch baseline:** `main` at `2e9647540e1be47571579f71b7466393172a2a6d`. **Continuation branch:** `research/236-residual-review-2026-11-06`. PR #441 (runtime) and #442 (post-merge documentation) are merged. The 236-case status is unchanged: 15 exact standard-form occurrences with runtime dispositions; 181 bounded profile-convention decisions; 12 abstentions; 28 unadjudicated occurrences. All 236 source rows remain retained and 40 remain evidence-limited.

### Corrected current task ledger

| Workstream | Status | Current acceptance / evidence |
|---|---|---|
| 236-row candidate ledger and provenance | DONE_VERIFIED | Reconstructed cohort retained; repeated tokens are not independent speakers; no independent IPA gold implied. |
| 15 standard-form runtime dispositions | DONE_VERIFIED | Ten new exact licenses plus five baseline licenses; PR #441 merged. Current-main tests and system verification pass. |
| 181 profile-convention reconciliations | DONE_VERIFIED as bounded non-integration decisions | Optional variants are narrowly scoped; no categorical rule promotion or speaker-specific claim. |
| 24 fortis [ɕ͈]→/s͈/ edit operations in 24 occurrence IDs across 19 source rows | BLOCKED | 23 are before /i/, one before /jo/ (ID 96); 22 forms contain ㅆ and two are coda-triggered fortition. No generic [ɕ͈] variant is accepted; token-level IPA requires exact speaker/audio evidence. |
| 12 abstentions + 28 unadjudicated occurrences | BLOCKED | Original token audio, speaker crosswalk, two independent Korean IPA annotations, blind reconciliation; then separate Ukrainian target review. |
| Multi-engine unmapped-Broad generated artifact | PARTIAL | Exact PR #441 head run 42215019081 failed at `cmp`: generator emitted 25 rows, tracked CSV has 26 including now-integrated ID 2490. Downstream Browser parity and SIGMORPHON jobs were skipped. Regenerate artifact from pinned inputs, inspect full row-level diff, rerun workflow. Do not weaken byte comparison. |
| Current-main tests/build/data/deploy workflows | DONE_VERIFIED for main `2e9647540e1be47571579f71b7466393172a2a6d` | Tests 42216016963, Verify 42216016988, master artifacts 42216016940, Pages 42216016937 all success. These do not supersede the separate multi-engine failure. |
| Four upstream workflow references | DONE_VERIFIED | Existing pinned audit; adopt process practices only; no code/skills/hooks copied. |
| Independent Korean IPA gold | BLOCKED | Qualified reviewers and blind adjudication absent. |
| Independent Ukrainian target validation | BLOCKED | Independent reader/phonetic review and acceptance tests absent. |
| Source-rights PR #439 | PARTIAL / leave untouched | Open PR is 56 commits behind current main; exact-head tests and verify failed (runs 42200300941, 42200300947). Reconcile selectively on a current branch; do not merge stale branch blindly. Citation-only evidence is not the same as copied/redistributed material. |
| Release readiness | DEFERRED | Partial research prototype; not research-certified or release-ready. |

### Runtime and evidence boundary

No further 236-case runtime rule is justified by the reviewed residual evidence. In particular, the 24 fortis sibilant operations are not closed by the lenis /i, ye, ya/ coarticulation result; the two /ɘː/ vs /ʌː/ cases are profile-symbol questions; and phrase-level Rule 29 candidates require token-level prosodic evidence. The 12 + 28 evidence-limited rows must not receive guessed IPA or Ukrainian outputs. The next linguistic acceptance step is independent annotation, not another heuristic.

### Current verification facts

- Main `2e9647540e1be47571579f71b7466393172a2a6d`: tests, system verification, generated master/research artifacts and Pages deployment all succeeded (run IDs above).
- Multi-engine exact-head run [42215019081](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42215019081): engine comparison and reviewer packet steps succeeded; mismatch-queue export `cmp` failed at byte 86966 / line 26. Later Browser parity, native/browser parity and SIGMORPHON jobs were skipped. ByT5/Charsiu optional inference jobs were skipped by policy.
- No local pytest/npm/build was run: container-side GitHub clone failed because github.com DNS could not resolve. Connector-reported Actions results are not represented as local tests.

The master handoff remains preserved as the historical append-only record. The current superseding continuation is recorded in this audit and the 236-case integration record; direct full-file append to the oversized handoff is blocked by the available content-write limit.

## Superseding continuation snapshot — 2026-11-06

Current main is `2e9647540e1be47571579f71b7466393172a2a6d`; PR #441 (runtime) and #442 (post-merge docs) are merged. The 236-row cohort remains 15 exact standard-form occurrences with runtime dispositions, 181 bounded profile-convention decisions, 12 abstentions and 28 unadjudicated rows. All rows remain retained; 40 remain evidence-limited.

The 24 fortis [ɕ͈]→/s͈/ edit operations occur in 24 occurrence IDs across 19 source rows; 23 are before /i/ and one is before /jo/ (ID 96). Kong & Kang (2021) show age- and gender-conditioned fronting of word-initial /s͈i/ in young women, but explicitly describe it as closer to alveolar [s] than post-alveolar [ɕ]. This does not support an optional [ɕ͈] IPA variant for unknown speakers; the /jo/ case also remains unresolved. The two /ɘː/ vs /ʌː/ differences remain profile-symbol questions. The 12+28 residual rows require original audio, speaker crosswalk and two independent Korean IPA annotations; phrase-level Rule 29 candidates also require prosodic-boundary evidence. No further production rule is justified by current evidence.

Multi-engine run [42215019081](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42215019081) on exact PR #441 head `847cdb240aadc2c9343127fbb7de6dafad0441d4` **FAILED** at generated-artifact `cmp`: generator output had 25 unmapped-Broad rows, tracked CSV had 26, including occurrence 2490 (`머리속에`) now covered by the exact alias. Failure: byte 86966 / line 26. Downstream Browser same-occurrence parity, Native/Browser parity and SIGMORPHON jobs were skipped; optional ByT5/Charsiu jobs were skipped by policy. Regenerate the tracked CSV from the pinned generator/corpus, inspect the full row-level diff, and rerun the entire workflow. Do not weaken the byte comparison.

Current-main checks for `2e9647540e1be47571579f71b7466393172a2a6d`: tests 42216016963, system verification 42216016988, master/research artifacts 42216016940 and Pages deployment 42216016937 all succeeded. These do not supersede the separate multi-engine failure. No local pytest/npm/build ran; GitHub DNS resolution failed in the container.

PR #439 remains open and was left untouched: its branch is 56 commits behind current main; its exact-head tests and verification failed (42200300941, 42200300947). Do not merge blindly. The four upstream workflow references are already documented as process-only adoption; no upstream code or duplicate orchestration is needed.

**Current status:** cohort and 15 runtime dispositions DONE_VERIFIED; 181 profile reconciliations DONE_VERIFIED as non-integration decisions; 24 fortis operations BLOCKED for token-level IPA adjudication (2021 acoustic evidence does not support generic [ɕ͈]; exact speaker/audio needed); 40 abstained/unadjudicated rows BLOCKED; multi-engine artifact PARTIAL pending regeneration/reverification; current-main ordinary CI DONE_VERIFIED; independent Korean IPA and Ukrainian target review BLOCKED; release readiness DEFERRED (partial research prototype).

### Generated diagnostic queue reconciliation — 2026-11-06

The tracked unmapped-Broad CSV has now been regenerated from artifact 13501009061 of exact-head run 42215019081, using the workflow's pinned generator output. A row-by-row comparison found exactly one stale row: occurrence 2490 (`머리속에`), already covered by the exact pronunciation alias merged in PR #441. No other occurrence rows changed. The refreshed CSV now contains 25 rows and preserves the generator artifact's exact 89,638-byte content (Git blob SHA `15655fa35b74251c8c0fdd6e2b6dc973d3bba631`). This repairs the known stale snapshot; acceptance remains PARTIAL until the full multi-engine workflow reruns and the downstream Browser parity/SIGMORPHON jobs complete.

### Master handoff preservation note

The original master handoff blob `b49170395fa7f67ee50f29e32def5349fe92fef3` has been restored unchanged on this branch. A content-write attempt returned a truncated replacement because the handoff exceeds the available safe write path; the branch was corrected by restoring the exact original blob through the Git data tree API. No master-history content is changed in the final branch tree. This audit and the 236-case integration record are the current superseding continuation. Appending directly to the oversized master handoff remains BLOCKED by the connector write limit.

## 2026-11-06 — superseding fortis sibilant evidence review: no runtime change

The previous audit treated the 24 `ɕ͈→s͈` operations as unresolved and misstated their row count. Reconstructed from the 236-row ledger, these are **24 occurrence IDs in 19 source rows**; 23 reference forms contain [ɕ͈i], and only ID 96 (`똥꼬쑈`) is [ɕ͈jo]. Twenty-two forms contain orthographic ㅆ; two coda-triggered fortition cases are IDs 481 (`했을시`) and 551 (`실시간`).

Evidence reviewed:
- Holliday 2014 JASA describes both lenis-aspirated /sh/ and fortis /s*/ as typically palatalized before /i/ or /j/, but this is background in a perception study (SRC-HOLLIDAY-2014-JASA).
- Holliday 2016 Phonetica notes that fortis /s*/ may palatalize less consistently; its experiment is perceptual (SRC-HOLLIDAY-2016-PHONETICA).
- Holliday & Reidy 2016 places the /s*/ palatalization statement in poster background; it does not report speaker-level or token-level fortis-palatalization results from its six-speaker production sample (SRC-HOLLIDAY-REIDY-2016-PRODUCTION).
- Kong & Kang 2020 report palatalized variants before /i/ in an abstract covering /s/ and /s'/ but do not disaggregate the category (SRC-KONG-KANG-2020-SEOUL-SIBILANTS).
- **Kong & Kang 2021 provide direct acoustic constraints.** They analyze 39 adult Seoul Korean speakers and 1,832 sibilant tokens. Young female word-initial /s͈i/ shows age-related spectral fronting, but the authors explicitly describe the variant as closer to alveolar [s] than post-alveolar [ɕ], and the effect is context- and gender-specific (SRC-KONG-KANG-2021-SEOUL-SIBILANT-AGE-GENDER).

**Implementation decision: no [ɕ͈] runtime variant is accepted.** Keep canonical broad [s͈] unchanged in Python and Browser; do not add [ɕ͈] to broad or narrow output and do not map an unobserved speaker-conditioned fronting variant into Ukrainian. The 23 /i/ cases are not resolved by the 2021 finding because it does not support [ɕ͈]; ID 96 /jo/ remains separately unsupported. The 24 mismatches remain part of the 181 profile-convention cases, not the 40 abstained/unadjudicated rows. Exact speaker identity and token audio are required for any individual alternate IPA decision.

The data-inventory test `test_fortis_sibilant_candidate_inventory_has_exact_context_distribution` now records the 24 operations, 24 occurrence IDs, 19 source rows, 23 /i/ contexts and the single /jo/ case. Existing negative controls keep `씨` as a no-variant case in the broad research profile. No runtime code change is accepted from this evidence review.


## 2026-11-06 — source redistribution rights gate

The source-rights PR #439 was reviewed and its useful scope distinction is being ported with corrected tests and a negation-aware usage classifier. The current source register contains **213 rows, 12 columns and zero structural errors**. The read-only audit classifies citation-only references separately from actual retained material; the strict gate only blocks a positive copied/included/redistributed artifact whose item-level license remains unresolved. Phrases such as `no IPA-Dict corpus file copied` are not positive redistribution claims.

### Current item-level disposition

- `SRC-UGTPHON-EMNLP-2026`: the official UGTPHON Korean subset `ko/LICENSE` explicitly declares Apache-2.0. The repository retains 39 selected context excerpts under that subset-level grant, with attribution and the license notice preserved; it does not include the full dataset or separate IPA-Dict targets. This is an actual reuse, but an item-level license is recorded. The UGTPHON provenance note about MultiLexNorm++ remains documented separately; it is not a reason to misclassify the explicit Korean-subset license as unknown.
- `SRC-IPA-DICT-KO`: the source is used indirectly as provenance for UGTPHON gold; no IPA-Dict corpus file or target annotation is copied into this repository. The audit's negation-aware matcher must not flag the words `no ... copied` as redistribution.
- Citation-only academic papers and official references remain citation-only; research use does not itself waive copyright, but citation without copied source material is not a redistribution blocker.

The strict source-rights audit currently yields **zero unresolved positive-redistribution blockers**. The informational triage counts are 4 item-level licenses recorded, 1 not-applicable, 37 citation-only/no-reuse, 162 review-required and 9 manual-classification-required; the last two categories include references that are not redistributed and therefore do not block the strict gate. The exact counts are generated by `npm run audit:source-register`; `npm run audit:source-rights` is the release gate and must exit 0.

Acceptance requires the CSV parser/rights tests, a passing `npm run audit:source-rights`, and the same command in the GitHub Actions verification workflow. The audit is a triage tool, not legal advice; it never grants permission or infers rights from academic purpose alone.


### Artifact reconciliation follow-up — 2026-11-06

Recovered the original multi-engine ZIP from run 42215019081 and compared its generated queue to the tracked CSV. The 25 generated rows are unchanged; the sole extra tracked row is occurrence 2490 (`머리속에`), now licensed by the exact pronunciation alias. The tracked CSV has been replaced on continuation branch `research/236-residual-review-2026-11-06` with the exact generator-produced file, commit `8b87cd63bb145ccd8611144331dad20f1ad6663a`. No expected counts were changed and no rows were manually rewritten. Status improves from stale artifact identified to **artifact reconciled / CI rerun pending**; multi-engine acceptance remains PARTIAL until downstream parity and SIGMORPHON jobs pass on the corrected branch.


### Ledger correction and current CI state — 2026-11-06

The exact fortis inventory is **24 occurrence IDs across 19 source rows**, not 23 occurrence rows: 23 are /i/ contexts and one is /jo/ (ID 96). The table above has been corrected to this exact inventory. The unmapped-Broad CSV is no longer awaiting regeneration: it has been replaced with the exact 25-row output from the recovered CI artifact. Its remaining status is **CI rerun pending**, not artifact-generation pending. On the final branch head `2e4a76cc33fd55400f9de08ae9467ef1c2f45002`, multi-engine workflow run 42225608310 is pending with no jobs reported yet; ordinary tests 42225608150, system verification 42225608125, Browser integration 42225608073 and exhaustive extraction 42225608074 are queued/in progress. Master/research artifact workflow 42225608146 succeeded. Do not claim these in-progress workflows passed.
