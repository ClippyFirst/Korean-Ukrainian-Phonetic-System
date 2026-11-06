# Repository audit and structure — 2026-11-06

## Scope and exact snapshot

Repository: [ClippyFirst/Korean-Ukrainian-Phonetic-System](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System).

- Default branch at start: `main`, commit `043754498f3ad8a17aa6c13b5f643b197536da8a`.
- Working branch: `research/236-candidate-review-2026-11-05`.
- Working-branch snapshot for this audit: `facc75ee887e2ee7a38a8ff83a2ff5277a277b75`.
- Open PR #436 carries the 236-case research/runtime integration; open PR #437 carries the agent-workflow documentation changes being reconciled into #436.
- Recursive tree at the working-branch snapshot: 830 entries (788 files, 42 directories), 176 Markdown files, 394 files under `tests/`, and seven repository-local skills.

This is a repository-state, 236-case implementation and documentation-structure audit. It is not an independent Korean IPA adjudication, Ukrainian reader study, source-rights opinion, or local clean-room test run.

## 236-case evidence and runtime decision

The reconstructed cohort contains 236 occurrence rows, not 236 independent phonological rules or independent speakers.

| Disposition | Rows | Runtime decision |
|---|---:|---|
| `RULE_CONFIRMED_STANDARD_VARIANT` | 15 | 14 occurrences covered by exact runtime licenses (nine new exact occurrence licenses plus five pre-existing licenses); one spelling-normalization case blocked |
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

`머리속에` remains blocked because changing it to `머릿속에` would introduce spelling/semantic normalization, not phonology. No guessed IPA or Ukrainian target is added for abstained or unadjudicated cases.

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
| 14 exact occurrence runtime integrations | PARTIAL pending exact final-head CI | Code, tests, negative controls and Python/browser parity are present on the PR branch; verify exact final head. |
| 181 profile-convention reconciliations | DONE_VERIFIED as non-integration decisions | No categorical phonology changes; token-acoustic IPA remains unresolved. |
| 12 abstentions + 28 unadjudicated | BLOCKED | Need exact token audio or independent Korean IPA evidence with source/profile/prosodic context. |
| `머리속에` spelling normalization | DEFERRED / BLOCKED | Requires a separately specified orthographic/semantic layer and disambiguation policy. |
| Agent routing and workflow documentation | PARTIAL pending final exact-head CI | Root guide, three general skills, workflow guide, navigation and structural test are ported into PR #436 branch. |
| Upstream reference audit (four repositories) | DONE_VERIFIED as a documented comparison | Pinned revisions and adoption/rejection boundaries documented; no upstream code copied. |
| Independent Korean IPA gold | BLOCKED | Requires qualified independent reviewers and adjudication; corpus labels/model agreement are insufficient. |
| NIKL item-level reuse rights | BLOCKED | Item-level rights classification/permission evidence remains incomplete. |
| Independent Ukrainian target validation | BLOCKED | Requires Ukrainian phonetic/orthographic reader review and acceptance tests. |
| Full local clean-install run in this session | BLOCKED | GitHub connector environment does not provide a local checkout/shell; use exact-head GitHub Actions and report no local run. |
| Release readiness | DEFERRED | Research prototype only; external linguistic and rights gates remain open. |

## Branch and PR reconciliation

- PR #436 remains the working integration branch, based on the inspected main commit `043754498f3ad8a17aa6c13b5f643b197536da8a`.
- PR #437's root `AGENTS.md`, three general skills, agent workflow guide, structural contract test and navigation changes have been ported to the #436 branch and reconciled with the 236-case documentation.
- PR #437 itself is left open and untouched; it is not silently merged or closed. Its overlap should be resolved after the combined #436 branch's exact-head checks.
- No user branch was deleted, no force-push was used, and `main` was not modified.

## Verification snapshot

At the recorded working head `facc75ee887e2ee7a38a8ff83a2ff5277a277b75`, GitHub Actions had queued exact-head browser, Python/system, test, artifact, morphology, UGTPHON and multi-engine workflows. The Charsiu train/dev job was skipped by workflow policy. The preceding code/data head `37ccbd17ac764ee83e592c8434372a00195ddd68` had successful Python regression/data integrity, browser regression/build (1,398/1,398), Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, browser G2P, artifact generation, exhaustive extraction, UGTPHON, paired native/g2pk and morphology diagnostics; the multi-engine diagnostic was cancelled and must not be called passed. Official NIKL metadata inventory and Charsiu/ByT5 jobs were skipped, not passed.

No local `npm`, `pytest`, build or clean-install command was run in this connector-only session. A final verification addendum must record the exact final commit and final workflow outcomes before this work is described as fully verified.

## Readiness

The repository remains a **partial research prototype**, not research-certified and not release-ready. Software integration can be verified independently; it cannot substitute for independent IPA gold, Ukrainian target review or item-level rights clearance.
