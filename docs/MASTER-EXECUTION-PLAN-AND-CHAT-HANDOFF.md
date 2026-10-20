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
- Patch-reviewed the trace-token changes in PR #155 and the mixed-script/jamo safeguards in PR #148. PR #155's tests assert longest-match token trace and fail-closed unknown IPA; PR #148's tests cover bare compatibility jamo, attached Latin residue, non-Korean-only input, Korean explanatory prose, and a mixed-script lexical form. This is patch-level review only; complete PR checks/diffs still need reconciliation.
- Created branch `audit/completion-plan-handoff-2026-10-20` from main for this plan and evidence report.
- No local checkout was available in this session; no local test command was run. No changes to runtime code or test expectations have yet been claimed as verified.
- Full detailed findings: `docs/audits/COMPLETION-AUDIT-2026-10-20.md`.

## Handoff: next concrete action

Next: inspect the complete PR #155 and #148 diffs plus their latest CI status, especially the interaction between mixed-script segmentation and trace alignment. Then build a same-input JS-vs-Python comparison fixture for the highest-risk morphology cases, generating outputs from both engines in a supported Python 3.11/3.12 environment. Do not infer parity from the browser-only PR #156 tests. Update KUA-001–KUA-003 with exact test evidence and the relevant commit SHAs.


## Follow-up review — 2026-10-20 (PR checks and edge-case finding)

- PR #157 handoff branch CI completed successfully on HEAD `9c73a817928497b66813ec22b9c26aa824ef3300`: [Verify workflow run 39482745797](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39482745797). This validates the branch's configured checks only; it is not a linguistic validation.
- PR #155 remains open at head `199f25363f92964930e027aefddfc8d1b75bbdb1`; its 2026-10-15 verification run [38808586098](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/38808586098) completed successfully for Python regression/data-integrity and browser tests/build/page verification. The PR body itself states its tests had not yet been run in the author's environment; remote CI is the relevant evidence.
- PR #148 remains open at head `27341b49921452a0d84fd8e16ddc3ef017e8a9e5`; its 2026-10-15 verification run [38727833203](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/38727833203) completed successfully for Python regression/data-integrity and browser tests/build/page verification. Its broader workflow run [38808586098](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/38808586098) belongs to PR #155, not PR #148; keep run-to-commit attribution exact.
- Patch review identified a specific untested edge in PR #148: the classification of a compatibility jamo as explanatory literal currently depends on whether *any* Hangul syllable occurs anywhere in the full input and whether Latin/digits occur in a nearby window. That can classify a malformed mixed input such as `가 ㄷ` as literal rather than unresolved. Existing tests cover bare jamo and Korean explanatory prose, but do not establish this boundary behavior. Add a focused regression before merge and decide the intended policy for jamo in otherwise valid Korean text.
- PR #155 improves observability but is not independent verification: token-level trace tests establish the mechanics of the existing IPA-to-Ukrainian mapping, not whether the Korean IPA or the target mapping is linguistically correct. Its long one-line render implementation also merits maintainability review separately from functional tests.

### Updated immediate next steps

1. Add focused mixed-input jamo boundary tests to a review branch or PR, including `가 ㄷ`, `ㄷ 가`, `ㅎ과 뒤따르는 자음을 비교한다.`, and bare `ㄷ`; avoid changing the policy until tests define intended outcomes.
2. Inspect and test the combined behavior of PR #148 and #155 on the same inputs (trace alignment, literals/punctuation, lexical mixed-script entries, unresolved IPA).
3. Build a versioned same-input JS-vs-Python fixture only after documenting input/output schemas and dependency/runtime versions; compare surface Hangul, IPA, Ukrainian output, status, and trace separately.
4. Keep PRs unmerged until overlap and edge behavior are reconciled; no local tests were run in this session.


## Follow-up implementation — PR #158 (2026-10-20)

- Created draft PR [#158](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/158), branch `fix/jamo-explanatory-boundary-2026-10-20`, based on PR #148's branch to keep the dependency explicit. Latest head: `b82752c1085f3fd3717546e1dcb5019a246207ac`; source change commit: `a8a0415bebe47fa3d20ca005d7da00e21d962bb6`.
- Changed the explanatory-jamo classifier to require local evidence (immediate Korean syllable adjacency, or the named label `ㄴ 첨가`) instead of any Hangul syllable anywhere in the input. Added tests for `가 ㄷ`, `ㄷ 가`, `ㅎ과 뒤따르는 자음을 비교한다.`, and `ㄴ 첨가를 설명한다.`.
- PR #158 CI run [39483943245](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39483943245) completed with overall `failure`: the `web` job failed at `npm test`, while Python 3.11/3.12/3.13 jobs succeeded. No local tests were run. Inspect/fix the web failure before treating this PR as verified.
- PR #158 is a draft and is not merged. It depends on PR #148's branch; do not merge it directly to main without first reconciling/merging its base dependency and re-running the integrated checks.
- Update KUA-001 and KUA-003 only after the PR dependency and CI state are confirmed. JS/Python parity remains IN_PROGRESS and no differential corpus has yet been executed.


### CI failure follow-up — 2026-10-20

- Inspected run `39483943245` on head `b82752c1085f3fd3717546e1dcb5019a246207ac`: web job `118839393503` failed at `npm test`; Python jobs `118839393069`, `118839393564`, and `118839393712` succeeded. The failing web step skipped the build.
- Source inspection found the `namedNInsertion` regular expression in `src/app/engine_convert.js` used an over-escaped whitespace token (`/^\\s+첨가/u` in the JS source), so the intended `ㄴ 첨가` label may not be recognized. Corrected the source line on the PR #158 branch in commit `7097100932648f7f3abe190aef33fa27a47db214` to use the whitespace matcher `/^\s+첨가/u`.
- This is a source-level diagnosis, not a confirmed explanation of every failure: the original job log was not inspected in detail. Await the CI run for the new head `7097100932648f7f3abe190aef33fa27a47db214` and review its exact failing/passing test output before changing status. No local tests were run. Main remains unchanged; PR #158 remains draft/open and dependent on PR #148's branch.
- PR #157's documentation workflow completed successfully on HEAD `ca3b1ee18c4a4060229393c37a91350144c2873a`: [run 39483998549](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39483998549). This only validates the configured docs/artifact workflow, not linguistic correctness.


### Detailed browser CI diagnosis — 2026-10-20

- Retrieved job logs for failed run `39484324387` (head `7097100932648f7f3abe190aef33fa27a47db214`). The run has two failing browser tests, not just the suspected whitespace-regex issue: (1) `whole-corpus unresolved output is limited to the explicitly invalid spacing control` now finds multiple additional corpus files unresolved; (2) the new jamo boundary test's assertion rejects the legitimate decomposed Hangul analysis `가[ㄱ+ㅏ]` because it forbids all compatibility jamo in analysis, not only leakage of the standalone source token. The explanatory-prose test passes. Python regression/data-integrity job passes.
- Corrected the second test's analysis assertion to reject a standalone `ㄷ` token, rather than the engine's legitimate jamo-based decomposition notation. Commit `180d2e5b4d1a7f3ad1bca250656cd133ba1a3620`; CI run `39484617273` was queued at observation time.
- Important: the whitespace-regex change in `7097100…` did not resolve the overall browser CI failure. The broad corpus failures require inspection of exact inputs and policy. Do not weaken the corpus gate or mark PR #158 successful until the cause is isolated and the full browser suite passes. Main remains unchanged; PR #158 is open/draft and dependent on PR #148.

## Session continuation — 2026-10-20: PR #158 jamo-label regression

- **PR:** [#158](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/158), draft, base `fix/mixed-input-ipa-leak-2026-10-15`; no merge.
- **Evidence:** CI run [39484625651](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39484625651) for `180d2e5b4d1a7f3ad1bca250656cd133ba1a3620` failed one browser test: 1030 passed, 1 failed; Python regression/data-integrity job passed. The only failing test was the 165-corpus whole-file unresolved-output gate.
- **Diagnosis:** 16 corpus files used explicit Korean phonology labels (`ㅚ·ㅟ의`, `ㄺ과 ㄱ 앞`, `받침과 ㄹ`) that were split by lexical tokenization before the new local-context classifier could inspect their surrounding notation. The deliberately malformed `옷안` negative control remains the only intended unresolved whole-file case.
- **Changes on PR #158 branch:** `d3a8be0230f307a442e3ac1733f9d29c95f5ff06` added narrowly bounded label patterns; `99d7a560b1152a6bd3f2d289ac6a6d0cd23758ce` updated lexical tokenization to preserve local jamo-label context across conjunction-led labels; `a875e17d82e0cb0e8bb688fbc31e1b122b247348` added explicit regressions for `주제: ㅚ·ㅟ의 발음`, `주제: ㄺ과 ㄱ 앞 환경`, and `받침과 ㄹ`. Existing `가 ㄷ` / `ㄷ 가` unresolved regressions remain.
- **Validation state:** Do not mark the fix `DONE_VERIFIED` until GitHub Actions completes successfully for the exact latest branch head. The last completed run visible in this session, [39485051357](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39485051357), was on `d3a8be0...` and still failed the corpus gate (1030 passed, 1 failed). The tokenization and new explicit tests were committed after that run; latest CI had not yet appeared at the time of this update.
- **Important scope:** This is a regression fix for explanatory jamo notation and mixed-input handling, not evidence of full JS/Python parity or independent IPA/Ukrainian target validation.
- **Next action:** Poll CI for exact head `a875e17d82e0cb0e8bb688fbc31e1b122b247348`; inspect failures if any. Keep PR #158 draft until browser, Python, build, and corpus gates pass.
## Verification update — PR #158 latest head

- **Latest PR #158 head checked:** `48e91f7d0ca7e6153824fbb69d4c5e0ef4352f8e`.
- **CI:** [run 39485426549](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39485426549) completed with `success`. Browser regression/build job passed; Python regression/data-integrity job passed.
- **Browser tests:** 1032 passed, 0 failed. The whole-file adversarial corpus diagnostic now reports 165 corpora, 164 `lexical-review`, and exactly one `unresolved` corpus: `12-minimal-contrasts-and-negative-controls.txt`, the deliberately malformed `옷안` control. It has no output placeholders and one expected §15 issue.
- **Explicit notation regressions:** `주제: ㅚ·ㅟ의 발음`, `주제: ㄺ과 ㄱ 앞 환경`, and `받침과 ㄹ` pass. Existing standalone/malformed `가 ㄷ` and `ㄷ 가` controls remain in the test suite.
- **Status:** the jamo-label regression is `DONE_VERIFIED` for this exact PR #158 head and this CI suite only. PR #158 remains draft and based on PR #148; do not merge either PR without reviewing dependency/order and checking the current main/base state.
- **Next action:** reconcile PR #148 + #158 as one dependency chain (or retarget after #148 disposition), inspect the combined diff for tokenizer scope and malformed-input behavior, then decide whether to mark PR #158 ready. This does not complete KUA-003 globally and does not prove IPA/Ukrainian policy validity or JS/Python parity.