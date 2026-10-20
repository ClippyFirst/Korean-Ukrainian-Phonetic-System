# Master execution plan and chat handoff

**Updated:** 2026-10-20  
**Working branch:** `audit/completion-plan-handoff-2026-10-20`  
**Baseline inspected:** `main` at `8641dac4002f951d391682062ba134894e4198d7`  
**Status policy:** `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE_VERIFIED`, `DEFERRED`, `NOT_APPLICABLE`. Use `DONE_VERIFIED` only with a reproducible test or inspectable evidence.

## Mandatory start-of-session procedure

1. Read this file, then `research/MASTER-DIRECTIVE.md` and the latest audit/handoff documents on the current branch.
2. Inspect the current default branch, working branch, recent commits, open PRs, and latest CI for the exact head SHA. Do not assume the prior chat's state still exists.
3. Keep work on a named branch and preserve existing PR work. Do not push research changes to `main` directly.
4. Before edits, record the exact files and behavior to be changed. After edits, run relevant tests and report what was actually executed; remote CI is not a local test.
5. Update this handoff with commit SHA, changed files, evidence, remaining risks, and one concrete next action. If a context window ends, the next chat starts here.

## Current verified baseline

- `main` HEAD: `8641dac4002f951d391682062ba134894e4198d7` (2026-10-15; revert of an accidental default-branch literature memo).
- Open PR #154: research-programme foundation, head `b4c101b4cc8d4b27903aca92b8e1a691a5cbe7c7`. It explicitly says source review and literature work are first-pass, not a completed scientific audit.
- Open PR #155: full Korean → IPA → Ukrainian trace, head `199f25363f92964930e027aefddfc8d1b75bbdb1`.
- Open PR #156: browser g2pK regression/parity gates, head `6bf9db0c8ebbea97b010c1df99fcb78481571298`.
- Open PR #148: mixed-script IPA leakage guard, head `27341b49921452a0d84fd8e16ddc3ef017e8a9e5`.
- On 2026-10-15, CI for PR #156 at the stated SHA completed successfully: browser `npm test` and `npm run build`, Python `pytest` on 3.11, 3.12 and 3.13, and the research/master-table workflow. This is remote CI evidence for that PR head, not proof for current `main`, later commits, all linguistic cases, or Ukrainian target validity.
- No GitHub Release was found in the releases endpoint. `CITATION.cff` was not present at the inspected main HEAD.
- The tree has 461 entries and includes 16 declared rules R001–R016, a large lexical pronunciation CSV, source/evidence tables, Python and browser engines, and extensive adversarial tests.
- The current main README already discloses that browser JS G2P does not reproduce Python g2pK's MeCab-based morphological analysis. Do not claim complete JS/Python parity.

## Evidence-gated task register

| ID | Priority | Status | Evidence / scope | Acceptance criterion | Dependencies / next check |
|---|---|---|---|---|---|
| KUA-001 | P0 | IN_PROGRESS | Reconcile PRs #154, #155, #156, #148 and the research/audit branches before treating main as complete. | Each PR has a documented disposition; no useful branch work is lost; canonical handoff points to accepted commits. | Review PR diffs, CI, conflicts and overlap; do not merge without checking. |
| KUA-002 | P0 | IN_PROGRESS | Browser JS G2P and Python g2pK are not algorithmically equivalent; Python g2pK uses MeCab morphology, browser port does not. | Public docs accurately scope modes; shared corpus reports exact surface-form disagreements and classifies each; no unqualified parity claim. | Expand PR #156 corpus and capture JS output plus Python output in a supported Python 3.11/3.12 environment. |
| KUA-003 | P0 | TODO | Trace invariant: Korean input → surface/phonological analysis → IPA → Ukrainian target. PR #155 exposes trace; PR #148 addresses mixed-script IPA leakage. | Every emitted Korean-derived target unit is traceable to IPA; no silent Hangul→Ukrainian shortcut; mixed-script input preserves literals without leaking non-IPA text into IPA. | Inspect PR #155 and #148 code/tests, then add end-to-end adversarial tests. |
| KUA-004 | P0 | TODO | Lexical evidence audit reports a large corpus and provisional Ukrainian targets; structural consistency is not independent linguistic validation. | Every lexical record has a resolvable source locator, claim-level provenance, explicit target status and independent schema/consistency checks; unresolved evidence remains flagged. | Audit current lexical CSV and additions/merge precedence; retain row-level source attribution. |
| KUA-005 | P0 | TODO | Ukrainian target audit identifies unresolved system-level decisions: vowel length, aspiration/fortisness, vowels without Ukrainian equivalents, /ŋ/, liquids and separator policy. | Policy is explicit and consistent; targets are independently reviewed or explicitly remain provisional; no Korean NIKL source is misrepresented as authority for Ukrainian spelling. | Research literature and run Ukrainian-reader review; do not invent consensus. |
| KUA-006 | P1 | TODO | R001–R016 and NIKL sections 9–30 have rule and scope registers; some are morphology/lexicon-conditioned and correctly fail closed. | Rule matrix links rule ID → NIKL clause/source → environment → order → positive and negative cases → runtime implementation → test. R016 exception and rule 16 scope are explicitly reconciled. | Audit `data/korean/rules.csv`, `rule_scope.csv`, `rule_ordering.csv`, and rule-specific tests. |
| KUA-007 | P1 | TODO | Hangul has finite modern syllable-block inventory (11,172); generated master table exists, but does not represent every context or word. | Exhaustive generated-property tests cover all 11,172 blocks and distinguish isolated canonical IPA from contextual output. | Check generator/artifact freshness and CI workflow. |
| KUA-008 | P1 | TODO | Soft morphology is opt-in, low-confidence and intended to fail closed. | Tests demonstrate it never silently promotes a heuristic to normative, never applies across whitespace, and never resolves substantive liaison or lexical n-insertion without evidence. | Review JS and Python parity for the soft layer and docs. |
| KUA-009 | P1 | TODO | Main CI and branch CI are different evidence; browser accessibility and mobile behavior need independent checks. | Build and all tests pass on the release candidate; UI tested for keyboard, screen reader labels, narrow viewport, error/unknown input, and long text. | Run PR checks and browser QA; do not infer accessibility from build success. |
| KUA-010 | P1 | TODO | No `CITATION.cff` or GitHub Release was found on inspected main. | Valid CFF metadata, explicit author/contributor roles, data/dependency licenses, versioned release notes and reproducible test protocol. | Confirm authorship/license choices before release; preserve third-party notices. |
| KUA-011 | P2 | TODO | Zenodo archival and methods paper are requested but not yet verified. | Archive is created by authorized account, DOI resolves, release matches archived source, paper separates findings from limitations. | Do only after scientific/release gates and rights review. |

## Audit separation: never conflate these dimensions

1. Hangul normalization and syllable decomposition.
2. Korean phonological surface form and morphology.
3. IPA derivation and IPA convention (broad vs narrow; vowel length).
4. IPA → Ukrainian target policy.
5. Lexical coverage and provenance.
6. Runtime engineering, UI, tests, CI and deployment.
7. Publication, citation, licensing and archiving.

A successful unit test proves only the asserted property. Mechanical IPA-to-target consistency does not prove IPA accuracy; NIKL pronunciation does not prescribe Ukrainian graphemes; large corpus size does not establish coverage of all words or contexts.

## Latest work cycle — 2026-10-20

- Reconstructed repository tree and recent main commit from GitHub.
- Inspected README, G2P integration note, IPA-first consistency audit, IPA normalization note, soft-morphology design, rules and rule-scope tables, browser G2P tests, Ukrainian target review, and the prior audit report.
- Inspected open PR metadata and CI job steps for PR #156.
- Created branch `audit/completion-plan-handoff-2026-10-20` from main for this plan and evidence report.
- No local checkout was available in this session; no local test command was run. No changes to runtime code or test expectations have yet been claimed as verified.
- Full detailed findings: `docs/audits/COMPLETION-AUDIT-2026-10-20.md`.

## Handoff: next concrete action

Review the full diffs and current checks for PR #155 and PR #148, then reconcile their trace/mixed-script behavior with PR #156's browser G2P corpus. Do not merge them blindly or repeat the earlier general audit. Add a same-input JS-vs-Python comparison fixture for the highest-risk morphology cases, with output generated by both engines in a compatible environment. Update KUA-002 and this handoff with actual test evidence after that comparison.
