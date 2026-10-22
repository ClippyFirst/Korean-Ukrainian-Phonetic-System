# Master execution plan and chat handoff

> **Current-state precedence (2026-10-21):** This document retains dated historical snapshots for auditability. Do not execute the old PR #148/#154/#155/#156 integration instructions or use the historical baseline below as current state. The authoritative latest status, merged commit evidence, live HTTP smoke result, and remaining blockers are in the final dated section at the end of this file and the current acceptance-gate snapshot.
**Updated:** 2026-10-21  
**Working branch:** `audit/completion-plan-handoff-2026-10-20`  
**Historical baseline:** `main` at `8641dac4002f951d391682062ba134894e4198d7`; this predates the 2026-10-21 continuation below.  
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
| KUA-002 | P0 | IN_PROGRESS | Browser JS G2P and Python g2pK are not algorithmically equivalent; Python g2pK uses MeCab morphology, browser port does not. | Public docs accurately scope modes; shared corpus reports exact surface-form disagreements and classifies each; no unqualified parity claim. | Run the 18-row fixture comparison in Python 3.11/3.12; first result is 17/18 equal with one known divergence (`값어치`: browser/NIKL `가버치`, Python g2pK `갑써치`). NIKL official guidance adjudicates `가버치`; the other 17 expected forms still need per-row source review. |
| KUA-003 | P0 | IN_PROGRESS | Trace invariant: Korean input → surface/phonological analysis → IPA → Ukrainian target. PR #155 exposes trace; consolidated PR #159 guards mixed-script IPA leakage. | Every emitted Korean-derived target unit is traceable to IPA; no silent Hangul→Ukrainian shortcut; mixed-script input preserves literals without leaking non-IPA text into IPA. | Review #159 and #155 together after current-base/mergeability recheck; independently adjudicate IPA and target-policy decisions. |
| KUA-004 | P0 | TODO | Lexical evidence audit reports a large corpus and provisional Ukrainian targets; structural consistency is not independent linguistic validation. | Every lexical record has a resolvable source locator, claim-level provenance, explicit target status and independent schema/consistency checks; unresolved evidence remains flagged. | Audit current lexical CSV and additions/merge precedence; retain row-level source attribution. |
| KUA-005 | P0 | TODO | Ukrainian target audit identifies unresolved system-level decisions: vowel length, aspiration/fortisness, vowels without Ukrainian equivalents, /ŋ/, liquids and separator policy. | Policy is explicit and consistent; targets are independently reviewed or explicitly remain provisional; no Korean NIKL source is misrepresented as authority for Ukrainian spelling. | Research literature and run Ukrainian-reader review; do not invent consensus. |
| KUA-006 | P1 | TODO | R001–R016 and NIKL sections 9–30 have rule and scope registers; some are morphology/lexicon-conditioned and correctly fail closed. | Rule matrix links rule ID → NIKL clause/source → environment → order → positive and negative cases → runtime implementation → test. R016 exception and rule 16 scope are explicitly reconciled. | Audit `data/korean/rules.csv`, `rule_scope.csv`, `rule_ordering.csv`, and rule-specific tests. |
| KUA-007 | P1 | TODO | Hangul has finite modern syllable-block inventory (11,172); generated master table exists, but does not represent every context or word. | Exhaustive generated-property tests cover all 11,172 blocks and distinguish isolated canonical IPA from contextual output. | Check generator/artifact freshness and CI workflow. |
| KUA-008 | P1 | TODO | Soft morphology is opt-in, low-confidence and intended to fail closed. | Tests demonstrate it never silently promotes a heuristic to normative, never applies across whitespace, and never resolves substantive liaison or lexical n-insertion without evidence. | Review JS and Python parity for the soft layer and docs. |
| KUA-009 | P1 | TODO | Main CI and branch CI are different evidence; browser accessibility and mobile behavior need independent checks. | Build and all tests pass on the release candidate; UI tested for keyboard, screen reader labels, narrow viewport, error/unknown input, and long text. | Run PR checks and browser QA; do not infer accessibility from build success. |
| KUA-010 | P1 | IN_PROGRESS | Root `LICENSE` and `CITATION.cff` are absent on main; third-party Apache-2.0 license text and g2pK notices are present under `public/`. | Valid CFF metadata, explicit author/contributor roles, data/dependency licenses, versioned release notes and reproducible test protocol. | Confirm project-wide license/authorship choices; do not invent a license or publish a release until resolved. |
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

Next: review the exact current-base diffs for #159 and #155 together; then execute `scripts/compare-g2pk-engines.py` in Python 3.11/3.12 and inspect the mismatch report. The browser fixture/exporter and Python differential test are implemented; surface comparison found one documented Python g2pK divergence. Independent IPA gold and Ukrainian target-policy review remain outstanding. Update KUA-001–KUA-003 only with exact-head evidence.


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
- **Next action:** treat PR #159 as the consolidated mixed-input candidate, review it alongside #155, recheck current-base mergeability, and run the Python/browser surface comparison. Do not close #148/#158 until #159 is accepted. KUA-003 remains IN_PROGRESS because independent IPA and Ukrainian target-policy review are outstanding.
## PR convergence and independent G2P/IPA review — 2026-10-20

- Added [PR convergence and independent G2P/IPA audit](audits/PR-CONVERGENCE-AND-G2P-IPA-AUDIT-2026-10-20.md) in commit `aa9e40b4590d1c1edf491e32725b857229e2b692`.
- Main baseline used for branch comparisons: `8641dac4002f951d391682062ba134894e4198d7`.
- #158 descends from #148 and includes its changes; both are 9 commits behind main. Do not merge #148 separately. Preferred path is to reconcile #158 as the sole mixed-input PR, then reconcile #155 because both change `engine_convert.js`.
- #156 is a tests/docs-only branch, 4 commits ahead and 0 behind main. Its 18 exact surface-form fixtures and long-passage consistency check are useful regressions but do not constitute Python-vs-browser parity or independently verified IPA gold.
- #154 research programme branch is 33 commits ahead and 2 behind main; its files are documentation/CSV, but its base and source/license claims need reconciliation and review. #157 documentation branch is 10 ahead and 0 behind main; its exact head `908ac87cc725e7e20d4ee11aacc6fc993b727027` has successful listed CI.
- Independent mapper review found ASCII `g` accepted as if IPA `ɡ`. Removed that fallback and added a regression on the #155 branch: `ɡ` maps to `ґ`, while ASCII `g` must fail closed. Commits: `b743b325d02de2e3ce5b1703ac1581209fb7f355`, test `95a1966b931ec5d065f671e7e04994f8ff2285db`. No CI run for that exact latest SHA was visible at audit time; do not mark verified yet.
- Legal metadata: upstream `THIRD_PARTY_NOTICES.txt` and `public/LICENSES/Apache-2.0.txt` are present. Root `LICENSE` and `CITATION.cff` are absent on main; do not invent a project-wide license without an owner decision.
- Next action: poll CI for #155 exact head `95a1966b931ec5d065f671e7e04994f8ff2285db`; then reconcile #158 against main without merging, verify current diff/mergeability and rerun all checks. Add independent Python/browser differential rows only with sourced surface expectations and separately adjudicated IPA; do not use either G2P engine as its own gold.
## Latest exact-head CI — 2026-10-20

- **PR #159** `de4565de7e43187831ad44f03c35ff515b25c4fc`: all four workflow groups passed (`39488133606`, `39488133971`, `39488133871`, `39488133584`); browser tests 1039/1039; Python 3.11/3.12/3.13 pass; corpus diagnostics 165 files, 164 `lexical-review`, one intentional unresolved control, zero placeholders. This verifies the mixed-input regression on this exact head only. PR remains draft/unmerged.
- **PR #155** `3bd2446a1d8d33233a097c28e448ea1cbd1fd78d`: all four workflow groups passed (`39488270264`, `39488270290`, `39488270387`, `39488270279`); browser tests 1037/1037; Python matrix pass. The strict-IPA fix rejects ASCII `g` and accepts IPA `ɡ`. It still overlaps #159 in `engine_convert.js` and must be reconciled before merge.
- **PR #156** `07c18d247f5033188236a6684fdc783f4d63b665`: existing tests, system verification and corpus workflows passed (`39488581780`, `39488581776`, `39488581740`). The 18-row fixture and Python differential harness exist, but the comparison script has not been run; no parity claim.
- **Main history note:** an attempted branch-specific workflow-file creation landed on `main` as `1f96917317c922debab964217d2d96e264056cf3`; it was immediately deleted in `98697b71e442afcad802930896a7a5dcb94a02ef`. The workflow file is absent from main's current tree, but those commits remain in history. Current main is 2 commits beyond baseline `8641dac...`; re-check exact base/mergeability for all open PRs.
- **Next:** run `scripts/compare-g2pk-engines.py` in Python 3.11/3.12 with `.[g2pk]`, review mismatch report, and only then mark the surface comparison verified. Separately review IPA gold and Ukrainian target policy; successful CI is necessary, not sufficient.
## Final update — 2026-10-20

- PR #156 latest head `deff3e70218612a5328782729b74cfecd47f6c37`: all listed CI passed (`39489076412`, `39489076709`, `39489076863`); browser tests 1035/1035, Python 3.11/3.12/3.13 pass. The new exporter test confirms all 18 fixed surface cases are emitted as expected, and pytest syntax-checks the Python differential script.
- **Still not run:** `python scripts/compare-g2pk-engines.py --output g2pk-differential-report.json` with optional g2pK installed in Python 3.11/3.12. No Python/browser mismatch report exists yet; do not claim parity.
- PR #155 exact head `3bd2446a1d8d33233a097c28e448ea1cbd1fd78d` passed all listed CI groups and browser tests 1037/1037. ASCII `g` is now rejected while IPA `ɡ` is accepted. It overlaps #159 in `engine_convert.js` and remains draft.
- PR #159 exact head `de4565de7e43187831ad44f03c35ff515b25c4fc` passed all listed CI groups and browser tests 1039/1039; 165 corpus files: 164 `lexical-review`, one intentional unresolved negative control, zero placeholders. It remains draft and unmerged.
- Updated audit report: `docs/audits/PR-CONVERGENCE-AND-G2P-IPA-AUDIT-2026-10-20.md` (latest audit document commit `c4b71351d9afb027ae2768da8bfb87e905912441`).
- Main history contains the workflow add/delete pair `1f96917317c922debab964217d2d96e264056cf3` and `98697b71e442afcad802930896a7a5dcb94a02ef`; the workflow file is absent from current main tree. Current main is two commits past the prior baseline, so recheck mergeability/base before any integration.
## Python/browser surface comparison — 2026-10-20

- Python g2pK 0.9.4 ran on Python 3.11 and 3.12 against the same 18-row fixture as the browser regression. Both versions reported 17 equal / 1 different.
- Mismatch: `값어치` → browser expectation `가버치`; Python g2pK → `갑써치`. NIKL's official guidance confirms standard pronunciation `[가버치]` (표준 발음법 제15항 붙임): https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5949&mn_id=217. The fixture now records both outputs and the authoritative source; do not rewrite the expected form to match Python.
- Latest fixture head `c2b63e577f5d6a610e32eb661f8abcde5a721633` has fresh CI queued. The prior comparison run on `e6bb11a1858d281ad171802217a34e2ce19feea3` completed successfully and emitted the 17/18 report in both Python versions.
- Remaining: verify all other fixture rows against authoritative sources and create an independently adjudicated IPA gold set.
## Differential verification complete for the fixed surface fixture — 2026-10-20

- PR #156 exact head `c2b63e577f5d6a610e32eb661f8abcde5a721633` passed tests (`39490017242`), system verification (`39490017260`), corpus artifacts (`39490017442`), and optional g2pK integration (`39490017642`). Browser tests: 1035/1035; Python 3.11/3.12/3.13 matrix pass; optional g2pK 3.11/3.12 pass.
- Fixed corpus comparison: **17/18 surface forms equal** in both Python 3.11 and 3.12. One mismatch: `값어치` expected/browser `가버치`, Python g2pK 0.9.4 `갑써치`.
- This mismatch is adjudicated by NIKL official guidance, which explicitly gives standard pronunciation `[가버치]` under standard pronunciation rule 15's supplement: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5949&mn_id=217. Keep `가버치`; record `갑써치` as a known Python-engine divergence, not the gold output.
- The fixture now records both surfaces, exact Python version/package scope, differential status and source URL. The other 17 rows still need independent source review. IPA comparison is not performed; all IPA gold statuses remain `not_independently_adjudicated`.
- Latest audit report commit: `ee0bea180d689b2a45815e7b496bbdaaec9b481c`. KUA-002 remains IN_PROGRESS until remaining surface rows are source-checked and mismatch categories documented; KUA-003 remains IN_PROGRESS pending independent IPA/target-policy validation.
## Integration ordering correction

- PR #156 now modifies `pyproject.toml` and `tests/test_pipeline.py` as well as the fixture/exporter. PR #159 also changes `tests/test_pipeline.py`; integrate #156 before #159 and resolve the additive test overlap during rebase.
- Recommended order is #154 → #157 (documentation/source register), #156 (surface fixture and actual Python comparison), #159 (sole mixed-input integration), then #155 (trace UI/strict IPA glyph guard). This is a review order, not permission to merge without current-base checks.
- #156 exact head `c2b63e577f5d6a610e32eb661f8abcde5a721633` passed all workflows; comparison result is 17/18 matches, with the sole mismatch adjudicated by NIKL. The latest audit report now records the #156/#159 overlap and revised order.
## Current branch counts (rechecked against main)

- #148: 11 ahead / 11 behind; #158: 20 ahead / 11 behind; #154: 33 ahead / 4 behind; #155: 19 ahead / 2 behind; #156: 17 ahead / 2 behind; #157: 27 ahead / 2 behind; #159: 7 ahead / 2 behind.
- #155, #156 and #159 report mergeable true in the latest PR metadata refresh; #158 reports mergeable false; #148 reports mergeable true but is superseded. All are still unmerged. PR #157 is ready for review and reports mergeable true; latest documentation-only head has no observed exact-head CI.
- Integration order after the real surface comparison: #154 → #157 for docs/source-register alignment, #156 for fixture + Python differential, #159 for mixed-input guards (rebase and resolve `tests/test_pipeline.py` overlap), then #155 (rebase and resolve `engine_convert.js` overlap). Do not merge #148/#158 separately.

## Final handoff refresh — 2026-10-20

The earlier counts in this file are historical snapshots. A fresh GitHub compare reports current `main` at `98697b71e442afcad802930896a7a5dcb94a02ef`, with merge base `8641dac4002f951d391682062ba134894e4198d7` for the active branches. Current ahead/behind counts: #154 33/4, #155 19/2, #156 17/2, #157 30/2, #159 7/2, #148 11/11, #158 20/11.

**Actual completed:** Python/browser surface comparison on the 18-row fixture, 17/18 equal in Python 3.11 and 3.12; the `값어치` mismatch is adjudicated by NIKL as `[가버치]`, while Python g2pK gives `갑써치`. This is a surface-form result only.

**Still open:** independent source review for the other 17 surface rows; an independently adjudicated IPA gold set; Ukrainian target-policy evaluation; current-base integration/retest of #156 → #159 → #155; reconciliation of #154/#157; root project license and citation metadata decision. Do not set KUA-002/KUA-003/KUA-010 to DONE on the basis of CI or self-consistency tests.

**Integration guardrail:** do not merge #148 or #158 separately. #156 and #159 overlap in `tests/test_pipeline.py`; #159 and #155 overlap in `src/app/engine_convert.js`. Each final combined head must get its own CI run. No PR has been merged by this refresh.


## CI recheck — 2026-10-20

Correction to the prior note: GitHub Actions has now confirmed successful exact-head workflows for docs/handoff head `ac099059340bb07d820082093135f7760f7016f2`: tests run 39494387952, system verification run 39494387991, and master-table/research-corpus artifacts run 39494387956. The branch is 32 commits ahead / 2 behind current main. These are documentation-branch checks, not integrated runtime checks. The four workflow groups also report success for the recorded current PR heads of #155, #156, and #159; #154's three workflow groups report success. All claims remain scoped to the exact SHAs checked.


Latest exact-head check is complete: `3ac3886f2edec05afb5294fb1e3ba6f9729b4b62` passed all three documentation/handoff workflow groups — tests (39494957629), system verification including browser build and Python regression/data integrity (39494957623), and master-table/research-corpus artifacts (39494957627). This is not a combined runtime integration test.


## Recheck against live GitHub state — 2026-10-21

This section supersedes older PR-head/base counts above where they conflict. Rechecked against live PR metadata and recent commits; no runtime code was changed in this pass.

- **Current `main`:** `98697b71e442afcad802930896a7a5dcb94a02ef` (revert removing the accidental differential workflow). Recent history includes `1f969173` (browser/Python surface comparison workflow), then its revert `98697b71`; the workflow is not present on current main.
- **Open PRs confirmed:** #154 research programme (`b4c101b...`, 33 commits; behind main by 4 according to its PR description); #155 trace/strict IPA glyph guard (`3bd2446...`, 19 ahead / 2 behind per its description); #156 browser/Python fixture (`c2b63e5...`, 17 ahead / 2 behind); #157 this documentation handoff (`3272b6a...` in PR metadata); #159 consolidated mixed-script guard (`de4565d...`, 7 ahead / 2 behind). #148 and #158 are still open drafts but explicitly superseded by #159; do not merge them separately.
- **Dependency order remains:** reconcile #154/#157 documentation and source register; integrate/rebase #156 first (shared `tests/test_pipeline.py`); then #159 (same file); then #155 (overlap in `src/app/engine_convert.js`). Do not infer integrated correctness from each PR's separately green historical CI.
- **Surface-form comparison:** documented result remains 17/18 matches on Python 3.11 and 3.12. `값어치` is a confirmed divergence: browser/NIKL `가버치`, Python g2pK 0.9.4 `갑써치`; the NIKL source supports `[가버치]`. The other 17 expected rows still need individual source adjudication.
- **IPA-first invariant:** README and engine documentation specify Korean surface analysis → IPA → Ukrainian target. Trace UI and strict IPA glyph changes exist on #155, but #155 and #159 have not been validated together on a common final head. Trace-consistency tests are not independent IPA gold and do not establish the Ukrainian target's linguistic adequacy.
- **Soft morphology:** documented as opt-in `heuristic-low-confidence`; contract explicitly excludes substantive §15 neutralization and R009/R010–R016 licensing. This pass did not execute a fresh runtime test of the JS/Python soft-mode parity, so that remains unverified at current combined head.
- **Attribution/licensing:** browser vendored subset notices and Apache-2.0 text are present under `public/`; Python `g2pK==0.9.4` is an optional extra constrained to Python <3.13 because of the MeCab build issue. Root project-wide `LICENSE` and `CITATION.cff` remain absent/owner decisions; do not infer the project's overall license from dependency notices.
- **Verification actually performed in this pass:** fetched current README, package metadata, handoff, NIKL audit, G2P integration note, soft-morphology contract, and third-party notices via GitHub; queried current PR metadata and recent commit history. Attempted local `git clone`, which failed because this execution environment could not resolve `github.com`. No local JS, browser, Python, generator, or public-service smoke tests were run in this pass. Historical CI results above remain tied to their recorded exact SHAs and are not re-labelled as fresh.
- **Current disposition:** KUA-001–KUA-003 remain `IN_PROGRESS`; KUA-004–KUA-009 remain `TODO`/evidence-limited as previously recorded; KUA-010 remains unresolved pending owner license/citation decisions; KUA-011 remains deferred until scientific and release gates pass. No release-readiness claim is justified.
- **Next concrete action:** on a network-enabled checkout, fetch latest `main`, rebase #156 → #159 → #155 in that order, resolve only the documented overlapping files, run `npm run check:release`, `python scripts/generate_korean_corpus.py --strict`, `pytest`, and the Python 3.11/3.12 g2pK comparison; then verify the deployed Pages artifact against the exact integrated SHA. Keep all three runtime PRs unmerged until that combined-head evidence exists.


## Integrated runtime state — 2026-10-21 (supersedes prior branch-order instructions)

### Verified integration on current main
- Research programme and evidence registers were ported onto current main in PR #160, merge commit [e8ea0d4](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/e8ea0d4ce0d9ed1611a55a1c4c444a933db3cc9a). Exact-head CI passed: tests [39570272992](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39570272992), system verification [39570273434](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39570273434), corpus artifacts [39570273030](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39570273030).
- Browser/Python G2P surface regression gate was ported onto current main in PR #161, merge commit [0326d24](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/0326d24844dabdcba31b49cebd5eaefa58b070d1). Exact-head CI passed: tests [39570386637](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39570386637), system verification [39570386733](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39570386733), corpus artifacts [39570386612](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39570386612), optional g2pK [39570386640](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39570386640).
- The combined IPA trace + mixed-input safeguards were ported to a clean current-main branch and merged as PR #163, commit [16ac736](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/16ac7363c04121a4b58c4e09a42000a33cc4e1cb). Exact-head CI passed: tests / Python 3.11–3.13 [39570810092](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39570810092), system verification [39570810327](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39570810327), browser G2P [39570810280](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39570810280), corpus artifacts [39570810140](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39570810140).
- Runtime now exposes the source Hangul → realized surface → IPA → IPA-token/Ukrainian-grapheme mapping → Ukrainian output trace. IPA rendering uses the same longest-match token mapping displayed by the trace; ASCII Latin `g` is not accepted as IPA `ɡ`. Standalone compatibility jamo and attached Latin/digit residue are withheld from IPA/analysis, malformed mixed input remains unresolved, and locally contextualized explanatory jamo labels have focused regressions.
- The original stale/overlapping PRs #154, #155, #156, #159, #162, #148 and #158 were closed with comments pointing to the current-main replacement PRs. No source history was deleted. PR #157 was merged earlier as [598247a](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/598247a723743b6207837aecbca96d87fec64d7b).

### Evidence still limited / release gates still open
- Surface differential remains 17/18 matching. `값어치` remains an intentional documented engine divergence: browser/NIKL `가버치`, Python g2pK 0.9.4 `갑써치`. The other 17 rows still need individual source adjudication.
- The trace demonstrates adapter consistency, not independent IPA gold or the scientific adequacy of the Ukrainian target policy. Independent sourced IPA evaluation and target-policy review remain open.
- Soft morphology remains opt-in and low-confidence; a fresh dedicated JS/Python soft-mode parity adjudication was not run in this session.
- Root project-wide `LICENSE` and `CITATION.cff` remain owner decisions; third-party notices do not grant an inferred project-wide license.
- A public live-site smoke check could not be established through the available web retrieval path. GitHub Actions checks verify the tested branch build, not that Pages serves this exact commit.
- Local checkout and direct local commands remain unavailable in this execution environment because `git clone` could not resolve `github.com`. CI was run remotely on the exact PR heads described above; do not describe those as locally executed commands.

### Updated disposition
- Implementation and integration for mixed-input guards, browser/Python surface comparison, and the visible IPA adapter trace: DONE_VERIFIED for the merged code and the listed exact-head CI groups.
- Full scientific validation, independent IPA gold, remaining surface-fixture source adjudication, soft-mode parity, project-level licensing/citation decisions, and live deployment verification: PARTIAL / BLOCKED / OWNER-DECISION as appropriate.
- Release status: **not release-ready**. Keep the project a research preview until independent phonetic/target-policy review and public deployment verification are complete.
- Next actions: (1) source-adjudicate the 18-row fixture and create an independently reviewed IPA gold subset; (2) run dedicated JS/Python soft-morphology parity tests; (3) obtain owner decisions for root licensing/citation metadata; (4) verify the public Pages site against the merged SHA; (5) run the repository's release gate on a network-enabled checkout and update this handoff with exact evidence.


## Final execution update — 2026-10-21

### Strict corpus validation and deployment gate
- The first strict corpus run correctly exposed the absence of a dedicated `data/korean/sequences.csv` (0 validation FAIL, 1 WARN). Instead of fabricating rows or weakening strict mode, PR #164 adapted the existing **642** source-backed rows in `lexical_pronunciations.csv` into whole-word sequence records when no dedicated sequence table is supplied.
- Adapted rows preserve the source surface form, IPA string, target string/status, exact per-row source URL, and a registry source ID only when the URL exactly matches an existing source row. They leave segment-level context windows, applied rule IDs, and Ukrainian graphemic targets empty where no evidence supports them.
- Controlled statuses `provisional` and `surface-only` are now explicit. Regression test `test_sourced_lexical_records_adapt_to_sequence_rows_without_inventing_targets` checks the 642-row count, unique IDs, exact IPA/target carry-through, source URL preservation, S007 matching for `값없다`, and the empty graphemic target.
- PR #164 merged as [`10bb886`](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/10bb886b27776321d33b1a9358a441c370c1b04c). On its exact head, strict corpus generation, Python 3.11/3.12/3.13, browser tests/build, and Python data-integrity tests passed.
- PR #165 merged as [`3bb3dfe`](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/3bb3dfe177e2e426ff1260349e199920b1a220ef), adding `python scripts/generate_korean_corpus.py --strict` as a prerequisite in the Pages deployment workflow. The deployment workflow can no longer deploy if strict corpus validation fails.

### Exact-main CI and Pages deployment evidence
For main commit `3bb3dfe177e2e426ff1260349e199920b1a220ef`, all push-triggered workflows completed successfully:
- Pages deployment (including strict validation on Python 3.11/3.12/3.13, Python tests, browser tests/build, both generated pages): [run 39571926662](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39571926662) — **success**.
- System verification: [run 39571926526](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39571926526) — **success**.
- Python 3.11/3.12/3.13 and web tests: [run 39571926415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39571926415) — **success**.
- Master-table/research-corpus artifacts: [run 39571926475](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39571926475) — **success**.
- The Pages deploy log reports `Reported success!` for build version `3bb3dfe177e2e426ff1260349e199920b1a220ef` and evaluates the environment URL as https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/. Direct web retrieval of the URL was unavailable to the web tool, so this is verified through GitHub Pages deployment status rather than an independent HTTP/browser smoke test.

### Final disposition and remaining acceptance gaps
- **DONE_VERIFIED:** current-main IPA adapter trace + Ukrainian target mapping consistency; mixed-script and explanatory-jamo safeguards; 18-row browser/Python surface comparison; strict corpus generation; 642-row source-backed sequence adaptation; Python 3.11/3.12/3.13 tests; browser regression/build; generated corpus; Pages deployment for the exact code/workflow commit above.
- **PARTIAL / evidence-limited:** the browser/Python surface fixture remains 17/18 matching. `값어치` remains browser/NIKL `가버치` versus Python g2pK 0.9.4 `갑써치`; the other 17 expected rows still need individual source adjudication. Adapted lexical rows do not create full segment-level context coverage.
- **BLOCKED / owner decision:** independent IPA gold and Ukrainian target-policy review; dedicated JS/Python soft-morphology parity adjudication; root project-level `LICENSE` and `CITATION.cff`; independent direct HTTP smoke check of Pages. Local checkout remains unavailable in this execution environment because `git clone` could not resolve `github.com`; remote exact-head CI evidence is recorded above.
- **Release classification:** the repository is now a technically deployed, tested **research preview**, but it is **not a scientifically validated/release-ready transcription standard**. Do not claim universal narrow-phonetic accuracy or complete contextual coverage.
- **Next genuine work:** source-adjudicate the 18-row surface fixture; build an independently reviewed IPA gold subset; review target-policy evidence; add explicit soft-mode parity tests; obtain license/citation owner decisions; perform direct public-site smoke testing when a suitable browser/network path is available.

A documentation-only continuation update follows this section; the code/workflow deployment evidence above remains tied to the exact SHA and run IDs stated here.



## Practical-mode strict-port follow-up — 2026-10-21

**Scope is practical mode only.** User clarified that practical mode must follow the pinned JavaScript g2pK port strictly; the native research engine and its lexical evidence are not an alternate pronunciation source for this mode.

- Created branch `fix/practical-mode-strict-g2pk-port-2026-10-21` from `2fca8db67ebc7239f9d2d63837d74ef5b3d57be1`.
- Removed post-G2P lexical surface and IPA overrides from `src/app/g2pk_web.js`; kept the research lexicon wired only to `engine` in `src/main.js`.
- Added a regression asserting practical `값어치` surface equals the direct `G2pBrowser.convert` result; changed the 18-row surface gate to compare the adapter against direct port output and document the known normative divergence separately.
- Updated README and G2P integration notes to distinguish strict-port behavior from normative pronunciation. No claim is made that upstream port output is always normatively correct.
- Commits so far: `95688881eaa6e8b109bb2bc7295da5d5fb912a3a` (adapter), `944d34c2581613bcec1cc5c79ab80d3c200be17f` (entrypoint), `198e0fdbf4c97e3b68cc1bb761ad334abc79f40e` (tests), `53089db27081e4df1a953462fe44291d4c48d98a` (parity gate), `462df0e7e68254f57d3da827657612d52ea0bb60` (fixture), `a68dfac6147fd22e7659fee6c6be6c8c3187b56e` (README), `2c20f3313355e3b90ba8e993a0a7d370843a60e5` (integration contract).
- **Not yet verified:** exact-head browser/Python CI and a direct check of the deployed app. The GitHub API-only editing workflow means local `npm test` / `npm run build` have not been executed. Before accepting this change, run CI and fix any fixture expectation or integration regression it exposes.
- Next: update the regression fixture test if direct JS port outputs differ from the previous expected rows; run the exact-head workflows; only then mark the practical-mode contract `DONE_VERIFIED`.



## Strict practical-mode port CI result — 2026-10-21

The first exact-head CI correctly exposed two cases where the old project lexical overrides had changed the pinned JavaScript port's result. The regression fixture was corrected to represent the port output and to preserve the former project value separately:

- `넓죽하다`: strict port `널쭈카다`; previous project override `넙쭈카다`.
- `읽고`: strict port `익꼬`; previous project override `일꼬`.
- `값어치`: strict port `갑써치`; NIKL normative pronunciation `가버치` remains separately recorded as a known upstream divergence.

No lexical override is applied in practical mode. This is a deliberate behavior change to meet the requested contract, not a claim that the port is always normatively correct. Research mode retains its own lexical evidence.

For exact head `1b4e337e8d4f48df1fa950f7bbeb44ed06009fe7`, all four current-head workflow groups succeeded:
- Browser G2P integration `39597566751`: `npm test` and `npm run build` passed.
- General tests `39597566834`: browser tests/build and Python 3.11, 3.12, 3.13 passed.
- System verification `39597566591`: Python regression/data integrity and browser regression/build passed.
- Master table/research corpus artifacts `39597566745`: passed.

This evidence is exact-head CI, not local execution; this environment still has no local checkout. The updated branch is in PR #167: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/167. This patch's practical-mode contract is now **DONE_VERIFIED for port-output parity and build/test execution** on the stated head. Scientific accuracy of the port, IPA quality, and Ukrainian target adequacy remain separate and unresolved.


## Final practical-mode port integration and deployment — 2026-10-21

- **DONE_VERIFIED — implementation/CI:** PR #167 merged to `main` as `fde3113fe97a34582228abcd870e64a690cf9d09`. Practical mode now uses the pinned JavaScript `G2pBrowser` output with production options and applies no research lexical surface/IPA overrides. Research mode remains separate.
- **DONE_VERIFIED — exact-head CI before merge:** head `761668a591230f138baeb452a3bbf9e9d362d664`; Browser G2P integration run [39597726122](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726122), general tests [39597726175](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726175), system verification [39597726128](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726128), and master-table/corpus artifacts [39597726141](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726141) all succeeded.
- **DONE_VERIFIED — main deployment pipeline:** push deployment run [39598199808](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39598199808) for merge commit `fde3113fe97a34582228abcd870e64a690cf9d09` completed successfully. Python 3.11/3.12/3.13 regression/data checks, browser tests/static build, artifact upload, and Pages deployment all passed. Public service URL: https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/index.html.
- **BLOCKED — independent live UI smoke test:** the available web reader cannot open the Pages URL, and the connected live-browser/scrape service had no remaining credits. Therefore the deployment action and built artifact are verified, but a direct interactive HTTP/browser test using the full adversarial passage is **not** claimed as completed.
- **Scientific acceptance remains PARTIAL / evidence-limited:** this change proves practical output parity with the selected JS port, not normative Korean accuracy, independent IPA correctness, or adequacy of Ukrainian target choices. Known examples: `값어치` → port `갑써치` while NIKL normative output is `가버치`; `넓죽하다` → port `널쭈카다`; `읽고` → port `익꼬`.
- **Next genuine blockers:** independently adjudicate the surface regression set and IPA gold subset; validate Ukrainian target policy; test soft-morphology parity; obtain owner decisions for root `LICENSE` and `CITATION.cff`; perform the direct live-site smoke test when browser/network access is available. Classification remains **technically deployed research preview, not a scientifically validated/release-ready standard**.


## One-pass continuation — 2026-10-21 (follow-up branch pending CI)

- **Starting main:** `a50ce37cb6052d74ea8ad34c0baf74a91bac7378`. Working branch: `fix/soft-morphology-parity-and-release-gates-2026-10-21`.
- **Repository inventory:** 173 branches across two GitHub API pages; no open PRs or issues at inspection. Sixteen relevant historical branches were compared against main. Old divergent branches were not merged blindly; main already contains the integrated architecture and newer corpus/test work. No user branches were deleted.
- **DONE in this branch:** populated `research/RULE-COVERAGE.csv` for R001–R016, the NIKL article inventory and IPA→Ukrainian layer; updated source register and acceptance/roadmap status; replaced stale `MANIFEST.txt` upload instructions; clarified that no root project-wide license exists; added a user-facing practical-mode warning; documented a source-adjudication report for all 18 port fixture cases.
- **Source evidence:** 11 of 18 normative comparators are directly attested in NIKL examples or official Q&A; 7 are rule-derived candidates, not lexical gold. All 18 IPA values remain marked not independently adjudicated. Known port/NIKL divergences remain intentionally separate: 값어치 (갑써치 vs 가버치), 넓죽하다 (널쭈카다 vs 넙쭈카다), 읽고 (익꼬 vs 일꼬).
- **Implementation defect fixed in this branch:** Python soft morphology could emit generic R002 formal liaison for ambiguous 어/아 cases and §15-sensitive simple-coda environments that the browser layer deliberately fails closed on. Python now mirrors the browser guard for 어/아, ㅎ clusters handled by R003, and simple-coda representative-sensitive contexts.
- **Cross-runtime tests added:** shared fixture `tests/fixtures/soft-morphology-parity.json`; JS helper test `tests/soft-morphology-parity.test.mjs`; Python test `tests/test_soft_morphology_parity.py`; normative source metadata gate `tests/normative-surface-evidence-fixture.test.mjs`.
- **Documentation:** `research/DECISION-LOG.md`, `research/ACCEPTANCE-GATES.md`, `research/ROADMAP.md`, `research/SOURCE-REGISTER.csv`, `research/RULE-COVERAGE.csv`, `docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md`, `docs/G2PK-INTEGRATION-2026-10-15.md`, `docs/WEB-SERVICE-QA.md`, README, and this handoff updated.
- **Verification status:** no local tests were run because this execution path provides GitHub API editing but no local checkout/runtime. Exact-head CI passed on `14bca46c7431bc8ed273f0cb1d6f693f17838abc`: tests/build/Python 3.11–3.13 [39601258671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258671), browser G2P [39601258672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258672), system verification [39601258670](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258670), corpus artifacts [39601258668](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258668). These remote results, not local execution, verify the branch.
- **BLOCKED / owner-dependent:** root project-wide `LICENSE` and `CITATION.cff) cannot be finalized without owner identity/licensing decisions; no license is inferred from third-party Apache notices. The UPI package locator was not verified and is no longer described as a confirmed runtime dependency.
- **BLOCKED / specialist evidence:** independent IPA gold and Ukrainian target-policy validation require qualified review; no IPA is fabricated from orthography. Direct interactive smoke test of the deployed long-passage input was not completed due unavailable browser/network path.
- **Release status:** technically deployed research preview, not a scientifically validated/release-ready standard. Merge of this bounded follow-up depends on CI; scientific acceptance remains blocked independently.


## Final mainline verification after one-pass follow-up — 2026-10-21

- **Code/deployment commit verified by live HTTP smoke:** `778070fd81afc21e170ded6d8b5c0b8af8bab19c`. This PR is a documentation-only follow-up on top of that code/deployment commit.
- **PR #169 merged:** `a2f534aba610bb3d5b17e7cbae1815972259a178`; cross-runtime soft-morphology parity guard/tests, source-evidence gates, populated coverage matrix, stale manifest cleanup, and user-facing practical-mode warning are on main.
- **PR #170 merged:** `778070fd81afc21e170ded6d8b5c0b8af8bab19c`; the existing Pages deployment workflow now performs a live HTTP smoke check after deployment.
- **Final mainline CI passed:** tests/build/Python 3.11–3.13 [39602020543](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39602020543); system verification [39602020407](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39602020407); master table/corpus artifacts [39602020437](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39602020437); Pages deploy and post-deploy HTTP smoke [39602020436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39602020436).
- **Live HTTP smoke result:** PASS. GitHub-hosted runner retrieved the public index and system page, verified the practical-mode warning and mode control, and retrieved a non-empty generated JavaScript asset from https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/.
- **Live browser smoke:** PASS on code/deployment commit `dae8ebdabb396d1be51afbe891d80c9c48a29f1c`. The deployed page accepted the repository's 1,443-character adversarial Korean fixture and produced 2,782 Ukrainian output characters and 3,731 IPA characters; status was `g2pK JS · Контекстну вимову застосовано`, with no page errors. **Still not verified:** the exact earlier user-pasted passage if it differs from the repository fixture, responsive/mobile/assistive-technology behavior, independent IPA gold, and independent Ukrainian target-policy quality. HTTP/browser smoke is not linguistic-accuracy evidence.
- **Owner/specialist blockers:** root project-wide LICENSE and CITATION.cff identity/attribution decision; qualified independent IPA and Ukrainian target review; seven rule-derived surface cases remain unadjudicated. Do not fabricate these to make the release gate green.
- **Final disposition:** technically deployed, CI-tested **research preview**, not a scientifically validated or release-ready standard.


## Final exact-head rerun after live-browser smoke integration — 2026-10-21

- **Code/deployment commit:** `dae8ebdabb396d1be51afbe891d80c9c48a29f1c` (includes the live headless-browser workflow and smoke script).
- **Mainline docs/evidence commit tested after the code change:** `a8996112a01ec43f90b7c297b975906e4b44ab83`; code was unchanged from the verified deployment commit.
- **Exact-head mainline tests/build/Python 3.11–3.13:** PASS [39604039126](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039126).
- **Exact-head system verification:** PASS [39604039157](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039157).
- **Exact-head corpus artifacts:** PASS [39604039164](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039164).
- **Exact-head Pages deployment, HTTP smoke and headless browser smoke:** PASS [39604039154](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039154). The live page accepted the repository's 1,443-character adversarial Korean fixture and produced 2,782 Ukrainian characters and 3,731 IPA characters; the mode status was `g2pK JS · Контекстну вимову застосовано`; no page errors occurred.
- The exact earlier passage pasted by the user was not present in the current conversation context, so this is a representative repository fixture test, not a claim to have reproduced the user's exact text.
- Scientific/owner blockers remain: independent IPA gold, Ukrainian target review, seven rule-derived surface cases, root project license/citation decisions. Release classification remains **technically deployed research preview, not scientifically validated/release-ready**.


## Official NIKL collector implementation and source-access blocker — 2026-10-21

### Starting state and branch

- Starting default-branch commit: `1f8b37fd524c39bf0f2ecb6991ebdaf4ae677c7e` (`main`). Its existing CI had passed browser tests/build, Python 3.11–3.13, corpus artifacts, system verification, and deployment smoke checks; this follow-up preserves that mainline and does not change the production transcription pipeline.
- Working branch: `research/nikl-agent-skills-2026-10-21`; PR #176 remains open against `main`. No branch was merged or force-pushed.
- Implementation head with full exact-head checks passed before this final documentation refresh: `62432e384d8bd1c289d2910217aca17b82701981`. The completion-audit refresh commit is `33a7931c32e198ec74d4a1da8b035cd1129d919f`; this handoff was updated afterward. Verify CI on the final PR head after this update.


- Mainline hygiene note: a `.gitignore` creation briefly landed on `main` due to a missing branch argument, then was immediately reverted. The current `main` tree SHA `d0dd8abd6f6b4c74a177a02b409d35ac76f483e2` is identical to the starting tree SHA; the incident leaves two net-zero add/delete commits in main history but no remaining file-content change.

### Executable work completed

- Added `scripts/nikl-norm-crawler.mjs`, a metadata-first collector scoped to the 30 articles in `제2부 표준 발음법`. It allowlists HTTPS NIKL norms URLs, checks robots.txt, bounds time and response size, records HTTP provenance and SHA-256 hashes, detects missing/duplicate/incomplete article extraction, writes the manifest atomically, and fails closed on structural drift.
- Default output retains metadata and per-article hashes only. Full article-text retention requires the explicit `--include-text --terms-reviewed` acknowledgement; the manifest still states that licensing has not been independently verified. Raw HTML is not saved.
- Added `schemas/nikl-source-manifest.schema.json`, Python schema validation tests, fixture-based Node tests for all 30 article numbers, section exclusions, missing/duplicate/incomplete headings, script-contained fake markup, both allowlisted official hostnames, robots rules, provenance, and explicit retention acknowledgement.
- Added `npm run crawl:nikl`, documented usage, ignored local crawl outputs, and added a live source-access diagnostic to `.github/workflows/verify.yml` for `research/nikl-*` branches. The workflow uploads a short-lived log/manifest artifact where available.
- Updated the existing source register, rule-coverage row, research README, skill guide, and collector documentation in place. No duplicate coverage matrix or parallel engine was introduced.

### Verification and external blocker

- Exact implementation head `62432e384d8bd1c289d2910217aca17b82701981` passed **1,068/1,068 Node tests**, Vite build, Python regression/data-integrity suites on Python 3.11, 3.12, and 3.13, system verification, browser G2P integration, and master-table/corpus artifact checks. Evidence: [Node/Python matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39662932041), [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39662925804), [browser G2P](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39662932007), [corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39662932029). These checks are for that exact SHA; this documentation refresh requires a fresh exact-head rerun.
- A live crawl was attempted from GitHub Actions. `robots.txt` returned 404 (treated as no published robots file), but the official article page returned **HTTP 403**. The collector classified this as `BLOCKED`, logged the denial, and did not try alternate hosts, disguise the client, or bypass access controls. No live article inventory or manifest was produced. The diagnostic workflow remains green only because it treats this specific external access block as a warning; parser/inventory defects still fail the job.
- The source reuse/redistribution terms remain `not_assessed`. The 403 is an access limitation, not proof that the normative content is inaccurate or that every form of access is prohibited.

### Task ledger

- **DONE_VERIFIED** — three repository-local NIKL skills and integration guide; metadata-first collector implementation; fixture tests; manifest schema; CLI entry point; documented CI diagnostic; updates to existing source and coverage registers.
- **PARTIAL** — article inventory parser is fixture-tested and integrated, but the official live page's actual current HTML has not been parsed in this environment because the page request was denied.
- **BLOCKED** — fresh official source inventory: GitHub Actions received HTTP 403. Acceptance criterion: run from an environment where the official site permits access, retain the request/response provenance, and reconcile all 30 numbered articles with no missing, duplicate, or incomplete records. Do not bypass the denial.
- **BLOCKED / evidence-limited** — source reuse terms and any bulk retention of official article text. Acceptance criterion: inspect the current official terms/notice and record a source-specific decision before retaining or redistributing text.
- **TODO** — once access is available, compare the live inventory and exact article/subparagraph/example structure against the existing NIKL audit, rule matrix, data files, and tests; add only evidence-backed missing cases and negative controls. Then run exact-head tests/build and verify IPA is the actual input to the Ukrainian adapter.
- **DEFERRED** — independent narrow-IPA adjudication and Ukrainian target-layer validation remain outside what a scraper can establish; they still require qualified reviewers and must not be fabricated by automation.

### Architecture and release disposition

The required pipeline remains Hangul → structural/morphological analysis → Korean phonology → IPA or typed unresolved result → Ukrainian adaptation → Ukrainian practical orthography. This change does not make the public site claim that every NIKL rule is newly crawled or that Ukrainian outputs are normatively validated. Repository disposition remains a technically deployed research preview, not a scientifically validated/release-ready standard.


## Post-merge verification and final implementation commit — 2026-10-21

- NIKL collector/skills implementation was squash-merged by PR #176 as commit `23f3690a6b5c4e6f0d637bd35a83e991273d1b65`.
- Post-merge exact-main checks passed: Node `npm test` **1,068/1,068**, Vite build, Python regression/data-integrity checks on Python 3.11/3.12/3.13, system verification, browser G2P integration, and master-table/corpus artifacts. Evidence: [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39663296685), [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39663296228), [browser G2P](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39663296627), [corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39663296337).
- GitHub Pages deployment succeeded: [public site](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/). HTTP smoke for `index.html`, `system.html`, and the first JS asset passed. Live browser practical-mode smoke also passed with a 1,443-character Korean passage, yielding 2,782 Ukrainian-output characters and 3,731 IPA characters. This confirms the existing practical UI, not a fresh NIKL crawl or scientific validity of the research engine. Deployment evidence: [run](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39663296506).
- The official NIKL source collector was attempted from GitHub Actions and received HTTP 403 after the robots endpoint returned 404. Status remains `BLOCKED`; no article inventory was produced, no bypass was attempted, and source reuse terms remain unassessed. Acceptance criteria are unchanged: permitted access, reconciliation of all 30 articles, source-specific terms review, article-to-rule/test mapping, and independent IPA/Ukrainian target review.
- Repository status: implementation is merged and technically verified as a research tooling addition; the public transcription engine/UI was not changed. The live official inventory and scientific validation remain open blockers.


## Canonical NIKL route and local-import continuation — 2026-10-21

- Starting `main`: `34fd45348d311678445eb26c2280ea70d6c84bb7`.
- Working branch: `research/nikl-canonical-source-finalize-2026-10-21`.
- The source URL was corrected from the mobile route to the official desktop full-text route, `https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002`, which is the official portal route indexed with the complete Part 2. This is a canonical-source correction, not an attempt to bypass access controls.
- The exact-head run at `68097dbf31e8d557e9470c29f1129828c5b01a78` passed **1,069/1,069 Node tests**, Vite build, and Python regression/data-integrity tests; CI run: [39665353116](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39665353116). The live source job again received HTTP 403 and correctly recorded `BLOCKED`; it did not produce a live manifest.
- Added an auditable `--input-html` path for a human-saved copy of the official page. The caller must supply the exact official `--url`; local-import manifests record `retrievalMode=local-html-import`, the local file hash/import time, null HTTP status/retrieval time, and `not_checked_local_import` for robots. The HTML itself is not retained in the manifest by default, and the full 30-article inventory gate still applies. This creates a permitted offline path when a human can open the official page normally; it does not claim that a local import is a live fetch or that reuse terms are settled.
- Task ledger: `DONE_VERIFIED` — canonical route change and regression, local HTML import/provenance/schema/tests, docs and source-register updates. `BLOCKED` — direct live fetch in GitHub Actions returns 403. Acceptance criterion: run from an environment where NIKL allows direct access, or have an authorized human save the official page normally and use `--input-html`; in either case all 30 articles must parse once with non-empty content. `BLOCKED / evidence-limited` — reuse terms not yet reviewed. `TODO` — use the resulting metadata manifest to reconcile current source inventory against the already existing article-by-article audit and coverage matrix, and independently review any linguistic claims. `DEFERRED` — independent narrow-IPA and Ukrainian-target adjudication remains human specialist work.
- The production transcription engine and public UI were not changed. Status remains a technically deployed research preview, not a scientifically validated release.


## Post-merge CLI safety and final mainline verification — 2026-10-21

- PR #179 was squash-merged as `25f71d56b9f154c0d5574440caf21e137c1f2a09` after adding fail-closed validation for missing `--url`, `--input-html`, and `--output` values and preventing `--output` from overwriting the local HTML source. The regression asserts the source file remains unchanged on a path collision.
- PR #179 exact-head checks passed: **1,069/1,069 Node tests**, Vite build, Python regression/data-integrity suite, and corpus artifact checks. Evidence: [system and Node/Python](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39665756790), [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39665756659), [corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39665756613).
- Post-merge mainline verification on `25f71d56b9f154c0d5574440caf21e137c1f2a09` also passed: [system + Node/Python](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39665901294), [test workflow](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39665901290), [master-table/corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39665901492). GitHub Pages deployment run was queued at handoff time: [run](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39665901371); no production UI/source-engine changes were included in these PRs.
- Current task ledger: `DONE_VERIFIED` — NIKL collector, canonical source URL, local HTML import provenance, schema, safe CLI argument/path checks, tests, source register and handoff updates. `BLOCKED` — direct HTTP request from GitHub Actions to the official NIKL source still returns 403, so no live 30-article manifest exists. The local-import route is available only when an authorized human can access/save the official page normally; it records the actual provenance and still requires all 30 article blocks to reconcile. `BLOCKED / evidence-limited` — official text reuse/redistribution terms remain unassessed. `TODO` — after a real manifest is obtained, compare exact current article headings and source structure to the already existing audit/matrix and add only source-evidenced changes. `DEFERRED` — independent IPA gold adjudication and Ukrainian target-layer review require specialist review and must not be invented.
- Release disposition remains **technically deployed research preview, not scientifically validated/release-ready**. The transcription engine and public UI have not been modified by this NIKL tooling work.


## Surface evidence follow-up — 2026-10-21

- Working branch: `research/nikl-surface-evidence-2026-10-21`, based on `main` `0eda7561b3e43d4646c21feb647bc3ac2f777755`.
- Official NIKL Online Q&A pages now directly attest six previously rule-derived regression surfaces: `넋이[넉씨]`, `몫이[목씨]`, `값이[갑씨]`, `국립[궁닙]`, `협력[혐녁]`, and `독립문[동님문]`. Their exact URLs and dates are registered individually in `research/SOURCE-REGISTER.csv`; the machine-readable fixture, evidence test, and surface-adjudication audit were updated.
- The fixture now has **17/18** directly attested Korean surface comparators; only `숲이` remains rule-derived. The practical JS-port `expectedSurface` values and public UI remain unchanged. `IPA gold = 0/18 independently adjudicated`; this source pass does not validate IPA or Ukrainian target rendering.
- Task ledger: `DONE_VERIFIED` after CI passes — exact Q&A source registration, fixture provenance upgrade, audit count reconciliation, and test gate. `TODO` — obtain an exact lexical attestation for `숲이` if available; otherwise preserve its rule-derived status. `BLOCKED / specialist review` — independent IPA and Ukrainian target adjudication. `BLOCKED / source access` — live 30-article NIKL scrape remains HTTP 403 from GitHub Actions; use the previously added local HTML import only if a human can access the official page normally. Reuse terms remain unassessed.


## NIKL reuse-policy check — 2026-10-21

- Located the official [NIKL copyright policy](https://www.korean.go.kr/front/nuri/pageView.do?mkn=3&page_id=P000189). It states that NIKL website materials may be used under Korean Copyright Act Article 24-2 without separate permission unless a specific KOGL type is marked for the item.
- The source register now includes `SRC-NIKL-COPYRIGHT-POLICY`. This improves the evidence state from “no policy located” to “site-wide policy reviewed; item-level condition unresolved.” The exact KOGL marking for the Standard Pronunciation Rules page and each cited Q&A page was not established in this pass, so text retention/redistribution remains gated. Default manifest remains metadata-only.


## Final NIKL source and surface-evidence continuation — 2026-10-21

- Starting main for this documentation refresh: `d74ada3ebab82dcc729f79b00f6b3d252b0521fb`. This session's latest implementation mainline is tracked by the merged PRs below; do not infer a local checkout or local test execution.
- **PR #178** merged as `177fa0bdcaaedc80b94101ef168d07a7b58e2a5f`: canonical NIKL desktop source route, auditable `--input-html` path, provenance schema, fixture coverage and source/handoff documentation.
- **PR #179** merged as `25f71d56b9f154c0d5574440caf21e137c1f2a09`: CLI missing-argument validation and protection against overwriting imported HTML with the output manifest.
- **PR #180** records final collector verification; **PR #181** merged as `c5d71f8644b08998c38b70e91f7d626d779bddba`: six direct official NIKL Q&A attestations and a source-policy update. The surface fixture now has 17/18 directly attested Korean comparators; `숲이` remains rule-derived. Independently adjudicated IPA gold remains 0/18.
- **PR #182** merged as `875a793593641a2a21a59f6edbdb8ae87cc9fb7a`: all nine stale mobile-route citations in the surface fixture were changed to the canonical desktop full-text route. Exact-head CI passed **1,071 Node tests, 0 failures**, Vite build, and Python regression/data-integrity tests: [CI run](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39670066161).
- **PR #183** merged as `d74ada3ebab82dcc729f79b00f6b3d252b0521fb`: corrected provenance wording for 14 directly matching surface cases without conflating Hangul surface evidence with IPA gold. Exact-head CI passed **1,072 Node tests, 0 failures**, Vite build, and Python regression/data-integrity tests: [CI run](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39670315184).
- The post-merge workflow for PR #182's intermediate mainline commit `875a793593641a2a21a59f6edbdb8ae87cc9fb7a` passed system verification and corpus artifact checks, but its Pages deployment was cancelled by the subsequent mainline push. The deployment for current implementation commit `d74ada3ebab82dcc729f79b00f6b3d252b0521fb` is running at [run 39670439291](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39670439291); verify its final state before claiming deployment completion.
- Source-policy evidence: the official [NIKL copyright policy](https://www.korean.go.kr/front/nuri/pageView.do?mkn=3&page_id=P000189) says website materials may be used under Korean Copyright Act Article 24-2 unless an item-specific KOGL type is marked. The current review did not verify item-level markings on the rules page or each Q&A page. The collector therefore remains metadata-only by default.
- DONE_VERIFIED: canonical source URLs in rule and surface fixtures; regression gate against the legacy mobile route; direct-source provenance for six new Q&A cases; 14 accurate surface-provenance notes; collector CLI safety and local-import provenance; exact-head test/build checks listed above.
- BLOCKED: automated live NIKL article fetch returns HTTP 403 from GitHub Actions. No live 30-article manifest was generated and no bypass was attempted. Acceptance: direct access permitted by NIKL, or a human saves the official page through normal browser access and the local import parses exactly 30 complete articles.
- BLOCKED / evidence-limited: item-level KOGL marking/reuse conditions; `숲이` exact lexical attestation; independent IPA gold (0/18); independent Ukrainian target-layer review; direct interactive Pages smoke test. Preserve current statuses until evidence is supplied.
- Release disposition: technically deployed research preview, not a scientifically validated or release-ready transcription standard. No practical-mode output or public UI behavior changed in this source-evidence follow-up.


## Surface-only IPA boundary regression — 2026-10-21

- Branch: `test/surface-only-ipa-boundary-2026-10-21`, based on main `9ae745249fdee16f5853be10d902044258ccaa86`.
- Added a test covering all seven `target_status=surface-only` lexical rows: `신라`, `밟는`, `읊다`, `읊고`, `앞문`, `희망`, and `독립문`. It asserts syllable alignment across source, source-backed surface, IPA and target; exact runtime surface/IPA; IPA-derived Ukrainian target; and no unresolved issues.
- Exact test head `008f44c1f348926b767ce92a7cc5c70b12e685ad`: **1,073/1,073 Node tests**, Vite build, Python regression/data-integrity suite passed. CI: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39672160451).
- Status: `DONE_VERIFIED` for the previously excluded surface-only path's IPA-first consistency gate. This is a mechanical pipeline test, not independent phonetic or target-language validation. No runtime code, practical output, or public UI changed.
- Remaining scientific blockers are unchanged: IPA gold is independently adjudicated for 0/18 surface-regression cases; Ukrainian target-layer review remains outstanding; the exact lexical attestation for `숲이` is unresolved; the live 30-article NIKL inventory remains blocked by HTTP 403; per-item KOGL markings remain unverified.


## Evidence correction: `숲이` remains rule-derived — 2026-10-21

- PR #185 temporarily marked `숲이[수피]` as a direct §13 example. A primary-source recheck found that the official §13 enumerated example list does not include this word. The claim was too strong and has been corrected in the fixture, test, source register, and audit.
- Direct NIKL surface evidence is therefore **17/18**, not 18/18; `숲이` remains `derived-from-NIKL-rule` pending an exact lexical attestation. The official rule supports the general liaison pattern but is not itself a direct lexical citation for this form.
- This correction does not change pinned practical output. IPA gold remains **0/18**, Ukrainian target-layer review remains outstanding, and the live 30-article inventory remains blocked by HTTP 403.


## Final NIKL evidence-gate and skill correction — 2026-10-21

- Main baseline for this continuation: `154284febf08ef33c7483511fc65934441f7cfb2`; latest implementation/evidence main before this handoff refresh: `171a1ac013fd09bb04c5f25d705a80706f3d4b89`.
- **PR #185** merged the complete seven-row `surface-only` IPA-first consistency test and source-evidence fixture work as `55500f0eeecce657ce7914a4f199b0d8de198d3c`. It temporarily overclassified `숲이[수피]` as a direct §13 example. That was corrected transparently in **PR #186**, merged as `154284febf08ef33c7483511fc65934441f7cfb2`: the official §13 enumerated example list does not include this word. The fixture is now **17/18 directly attested surface cases + 1 rule-derived case**, and practical output is unchanged.
- **PR #187** merged as `171a1ac013fd09bb04c5f25d705a80706f3d4b89`. It updates all NIKL skills to the canonical desktop route, requires exact source-span evidence before a direct-attestation status, adds the `숲이` counterexample lesson, refreshes the skills catalog's stale status, and tests the canonical URLs across all three skills.
- Exact-head CI for PR #187 (`341ac3933da51ecc4f6a106d9bdd1d79fd333bdb`) passed **1,074/1,074 Node tests**, Vite build, and Python regression/data-integrity tests: [run](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39673486309). Post-merge mainline checks for `171a1ac013fd09bb04c5f25d705a80706f3d4b89` also passed: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39673643137), [Node/Python matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39673643108), and [master-table/corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39673643056).
- Previous mainline deployment and live smoke passed on code-equivalent main commit `154284febf08ef33c7483511fc65934441f7cfb2`: [Pages + browser smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39673050995). It verified `index.html`, `system.html`, the JavaScript asset, and live practical-mode execution on the 1,443-character adversarial Korean fixture (2,782 Ukrainian output characters and 3,731 IPA characters; no page errors). The post-merge deployment workflow for `171a1ac013fd09bb04c5f25d705a80706f3d4b89` also passed: [Pages deployment + live browser smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39673643136), with the same 1,443-character fixture, 2,782 Ukrainian output characters, 3,731 IPA characters, and no page errors.
- Current ledger: `DONE_VERIFIED` — canonical URL regression across skills, exact-source-span evidence rules, 17 direct source comparators, all seven surface-only IPA-first consistency cases, 1,074 Node tests/build/Python matrix on PR #187. `PARTIAL` — the 18-case surface fixture still has one rule-derived case and **IPA gold = 0/18**. `BLOCKED` — live 30-article NIKL collector receives HTTP 403 in GitHub Actions; no bypass or fabricated manifest. `BLOCKED / evidence-limited` — item-level KOGL marking, independent IPA adjudication, independent Ukrainian target-layer review, and exact lexical attestation for `숲이`. Root project license/citation metadata remains an owner decision.
- Release disposition remains **technically deployed research preview, not scientifically validated/release-ready**. The new work changes evidence and test quality, not practical-mode output or the public UI.


## Next NIKL morphology-boundary batch — 2026-10-21

- Branch: `research/nikl-morphology-boundary-controls-2026-10-21`, based on `main` `b681132ffa8a719e96be62f345f940008665967a`.
- Added two primary-source NIKL Q&A controls to `tests/fixtures/g2pk-surface-regression.json`: `숲을 → [수플]` (qna_seq=332248, §13) and `숲에 → [수페]` (qna_seq=331304; explicitly rejects `[숩페]`). Added source-register rows, increased the browser-port fixture inventory from 18 to 20, and extended direct-evidence assertions.
- Current evidence ledger for this candidate batch: 19/20 surface comparators directly attested; `숲이` remains rule-derived. IPA gold is still 0/20; neither Korean surface citation establishes IPA or Ukrainian target correctness.
- Status: `DONE_VERIFIED` for the 20-case fixture/source consistency and browser-port parity at exact head `0e0b96080335fec8fe04e7bd9d302d7b1e8a2183`. CI passed **1,074/1,074 Node tests**, Vite build, Python regression/data-integrity checks, and master-table/corpus artifact checks: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39674707274), [test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39674707281), [corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39674707413). The browser and Python g2pK both emitted `수플` and `수페`; existing known divergences remain unchanged. This status is limited to surface parity and evidence bookkeeping, not IPA or Ukrainian correctness.
- External constraints remain: GitHub Actions direct fetch of NIKL is HTTP 403; no live 30-article manifest exists. Local HTML import remains available without bypassing access controls. Per-item KOGL marking, independent IPA adjudication, and Ukrainian target-layer review remain open.


## Independent IPA gold adjudication queue — 2026-10-21

- Branch: `research/ipa-gold-adjudication-queue-2026-10-21`, based on main `f6a6f29aed2a07e42116044d26d4745e1d7fcf01`.
- Added `research/ipa-adjudication-queue.json` with all 20 surface-regression cases, exact source/evidence references, and explicit nulls for IPA candidate, syllabification, vowel-length decision, reviewer records, and final IPA. Every item is `BLOCKED_SPECIALIST_ADJUDICATION`; target-layer review remains separate.
- Added `tests/ipa-adjudication-queue.test.mjs` to ensure queue/fixture parity, provenance integrity, no fabricated IPA, no accidental resolution of `숲이`, and explicit length review for `밟는[밤ː는]`.
- Acceptance for a future specialist batch: two independent qualified broad-IPA reviews per case; explicit syllable alignment and length/segmental-feature decisions; exact source or transcription-method citations; recorded disagreement resolution; only then populate final IPA and change the adjudication status. Never infer IPA solely from Hangul notation in NIKL.
- Exact implementation head `9b8eb59caad60afc7637a8feb95b60112f78d170` passed **1,077/1,077 Node tests**, Vite build, Python regression/data-integrity checks on Python 3.11/3.12/3.13, and master-table/corpus artifact checks: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39675149008), [test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39675148519), [corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39675148503). The queue's integrity gate is `DONE_VERIFIED`; the underlying research gap remains **0/20 independently adjudicated IPA gold**, and Ukrainian target review remains separately blocked. This queue improves traceability but does not claim a scientific validation result.


## Post-merge verification and current continuation state — 2026-10-21

- Latest implementation baseline: PR #189 merged as `f6a6f29aed2a07e42116044d26d4745e1d7fcf01`, adding direct NIKL morphology controls `숲을[수플]` and `숲에[수페]`; the 20-case surface fixture is **19 direct Korean surface attestations + 1 rule-derived case** (`숲이`).
- PR #190 merged as `b4ed747417bbc19c797c08fad7592818b8b61649`, adding `research/ipa-adjudication-queue.json` and its fail-closed test. The exact PR head `82d1447e76b758809274901cc94467019fbb0c33` passed **1,077/1,077 Node tests**, Vite build, Python regression/data-integrity checks on Python 3.11/3.12/3.13, and corpus artifact validation.
- Post-merge mainline verification for `b4ed747417bbc19c797c08fad7592818b8b61649` passed: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39675451462), [Python/Node test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39675451429), and [master-table/corpus artifact validation](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39675451417). Post-merge Pages deployment and live browser smoke passed in run `39675451395`: public `index.html`, `system.html`, and first JavaScript asset returned successfully; live practical mode processed the 1,443-character adversarial Korean fixture and produced 2,782 Ukrainian characters plus 3,731 IPA characters with no reported page errors. This verifies deployment and interaction plumbing, not pronunciation or IPA-gold accuracy.
- Current ledger: `DONE_VERIFIED` — source evidence bookkeeping for 19/20 surface cases; browser/Python g2pK parity for the 20-case fixture; fail-closed IPA adjudication queue integrity; exact-head test/build/corpus checks above. `BLOCKED_SPECIALIST_ADJUDICATION` — independently adjudicated IPA gold remains **0/20**; all candidate/final IPA fields intentionally remain null. `BLOCKED` — live NIKL 30-article crawl receives HTTP 403 in GitHub Actions; no live manifest has been generated and no access-control bypass attempted. `BLOCKED / evidence-limited` — item-level KOGL marking, exact lexical attestation for `숲이`, and independent Ukrainian target-layer review.
- Release disposition remains **technically deployed research preview, not scientifically validated or release-ready**. The public practical-mode output and runtime architecture were not changed by these evidence/queue updates.


## IPA queue resolution gate — 2026-10-22

- Branch: `research/ipa-queue-adjudication-gate-2026-10-22`, based on main `aedfa30707fa00038a20b60c16d523cc01be6166`.
- Updated `research/ipa-adjudication-queue.json` to schema version 2. Reviewer records now reserve explicit qualification, review timestamp, and method/reference fields rather than only an ID/IPA/notes tuple.
- Updated `tests/ipa-adjudication-queue.test.mjs` so the gate remains fail-closed for all 20 current unresolved cases, but also defines the acceptance contract for future real resolutions: two distinct traceable reviewers, parseable timestamps, method references, explicit syllable boundaries, a non-unresolved vowel-length decision, final IPA, and reconciliation notes. The test also rejects duplicate IDs, partial reviewer records on blocked cases, and attempts to attach a candidate IPA while status remains blocked.
- A synthetic sentinel record exercises the future-resolved branch of the validator; it is explicitly test-only and is not Korean IPA data. The actual 20 queue entries remain unchanged scientifically: candidate IPA is null, both reviewer records are empty, final IPA is null, and every case remains `BLOCKED_SPECIALIST_ADJUDICATION`.
- Acceptance status: `DONE_VERIFIED` when the PR-head Node/Python/build and artifact CI completes. Scientific status remains `BLOCKED_SPECIALIST_ADJUDICATION`: 0/20 independent IPA-gold judgments; Ukrainian target-layer review is separate. This change makes a future expert batch easier to record without weakening evidence requirements or pretending that the missing expert work has been done.


## IPA feature trace: vowel-length handling — 2026-10-22

- The IPA-to-Ukrainian adapter intentionally does not add a length mark to Ukrainian practical spelling, but the previous trace implementation removed `ː` before tokenization and did not expose that target-layer decision in the token trace.
- Updated `src/app/engine_ipa.js` so `traceIpaMapping` retains a structured feature record for every `ː` marker (`handling=omitted-from-ukrainian-target`, source offset, and an explicit Ukrainian explanation). The original IPA string remains unchanged and visible; Ukrainian output remains unchanged. The browser trace now renders the explanation alongside token mappings.
- Added regression tests proving the length marker is accounted for, target output is unchanged, and the UI displays the feature handling. The test uses a clearly labelled generic IPA sentinel; it does not add or claim any Korean IPA gold.
- Acceptance: verify the PR-head Node suite/build and Python regression suite. This is a transparency/traceability improvement, not a linguistic validation of Korean vowel length or of the target mapping. The independent 0/20 IPA-gold and Ukrainian-target review blockers remain unchanged.


## Consolidated continuation closeout — 2026-10-22

- Verified mainline implementation baseline before this handoff refresh: `32ad31aba0a539db788ff6fb57377fec48819490` (`Test lexical IPA length-feature coverage`). No open PRs remained at the time of inspection.
- **PR #192** merged as `aba741c33283f24a91f5eef63900762a6108afa5`: IPA queue schema v2 adds reviewer qualification, timestamp, and method-reference fields; the gate supports a future adjudicated state only when two distinct, traceable reviews, explicit syllabification/length decision, final IPA, and reconciliation notes exist. The real 20 cases remain blocked and blank. Exact-head CI passed 1,078 Node tests, Vite build, and Python 3.11/3.12/3.13 checks.
- **PR #193** merged as `41ff6ee861090530ce1ee81d745115fa8042abf2`: corrected the public README's stale 18-case/0-of-18 count to 20 cases, 19 direct official surface attestations, one rule-derived case (`숲이`), and 0/20 independent IPA gold. Added a regression to prevent this documentation drift. Exact-head CI passed 1,079 Node tests, Vite build, and Python regression/data-integrity checks.
- **PR #194** merged as `533af9ec531d5bcdf1a1b3eb0eb2ff7e1b52ec1c`: IPA trace now records each `ː` as an explicit feature omitted from Ukrainian practical spelling, with source offset and a user-facing explanation. Original IPA and Ukrainian output remain unchanged. Exact-head CI passed 1,081 Node tests, Vite build, and Python regression/data-integrity checks.
- **PR #195** merged as `32ad31aba0a539db788ff6fb57377fec48819490`: added inventory-wide coverage asserting every `ː` marker in the current lexical IPA dataset receives explicit trace handling. Exact-head CI passed 1,082/1,082 Node tests, Vite build, Python regression/data-integrity checks, and master-table/corpus artifact validation.
- Post-merge mainline verification for `32ad31aba0a539db788ff6fb57377fec48819490`: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39677731622), [test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39677731647), [master-table/corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39677731653), and [GitHub Pages deploy + live browser smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39677731676) all passed. Public `index.html`, `system.html`, and the first JavaScript asset returned successfully; live browser smoke processed the 1,443-character adversarial Korean fixture and produced 2,782 Ukrainian output characters and 3,731 IPA characters without reported page errors. This verifies deployment and interaction, not scientific accuracy.
- **Task ledger:** `DONE_VERIFIED` — queue state-transition acceptance gate; README count synchronization; explicit IPA length-feature trace; inventory-wide length-mark trace coverage; 1,082 Node tests; Vite build; Python 3.11/3.12/3.13; corpus/master-table validation; Pages deployment and browser smoke. `BLOCKED` — direct NIKL collector fetch returns HTTP 403 in GitHub Actions; the local HTML import path exists, but no authorized local HTML snapshot has been supplied and no live manifest is claimed. `BLOCKED / specialist evidence` — independent IPA gold remains **0/20** and independent Ukrainian target-layer review remains outstanding. `BLOCKED / rights evidence` — exact item-level KOGL markings for the rules page and Q&A sources remain unverified. `BLOCKED / lexical evidence` — `숲이` remains rule-derived, not a direct lexical attestation. Root project license metadata remains an owner decision.
- **Release disposition:** deployed research preview, not scientifically validated or release-ready. Do not promote the queue or trace improvements as evidence of pronunciation correctness. Next genuine acceptance work requires (1) authorized acquisition/reconciliation of the 30-article NIKL page and item-level reuse checks, (2) two independent qualified broad-IPA reviews per queue case with source/method records, and (3) independent Ukrainian target review. Preserve the practical g2pK port contract and do not change public output merely to match the normative research comparator.


## Official-source and reuse-policy evidence refresh — 2026-10-22

- Reviewed the official full-text page through the public web source view: [NIKL Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002). The extracted view contains 2,349 lines and exposes the complete 제2부 표준 발음법. This is useful primary-source evidence for targeted rule checks, but **it is not** a local saved HTML snapshot, a successful run of `scripts/nikl-norm-crawler.mjs`, or a generated manifest. The CI direct-fetch blocker therefore remains `BLOCKED`.
- Rechecked §13–15 in the official page view. §13 explicitly lists `옷이[오시]`, `낮이[나지]`, `밭에[바테]`, and other liaison examples; §14 explicitly lists `넋이[넉씨]`, `곬이[골씨]`, `값을[갑쓸]`, etc.; §15 includes `값어치[가버치]`. The official §13 list does **not** explicitly list `숲이[수피]`; keep that case classified as rule-derived unless a direct lexical/official attestation is found. Do not upgrade it to direct evidence based on analogy alone.
- Reviewed the official [NIKL copyright policy](https://www.korean.go.kr/front/nuri/pageView.do?mkn=3&page_id=P000189). It states that NIKL website materials may be used under Korean Copyright Act Article 24-2 unless a specific KOGL type is separately displayed, in which case that type's conditions apply. Added `SRC-NIKL-COPYRIGHT-POLICY` to `research/SOURCE-REGISTER.csv`. This establishes the **general policy**, not the individual license/marking of the Standard Pronunciation Rules page or each online Q&A answer. No visual page-specific KOGL mark was verified; retain the rights blocker for source-text redistribution.
- Latest observed mainline at review start: `5c6875bb4b3d540ccb8bf085047bb71c0bb14121` (`Fix Korean lexical form in consolidated handoff`). Its CI passed 1,082/1,082 Node tests, Python 3.11/3.12/3.13 suites, Vite build, master-table/corpus artifact checks, system verification, and Pages deployment/browser smoke. The successful Node summary is in [run 39678070984](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39678070984); [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39678070997), [artifact validation](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39678071138), and [Pages deployment](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39678070941) succeeded.
- Task ledger update: `DONE_VERIFIED` — general NIKL copyright-policy source registered; primary-page checks for §§13–15 recorded without inflating evidence. `BLOCKED` — no authorized local HTML snapshot and no successful direct crawl/manifest; page-specific KOGL marking and individual Q&A reuse status remain unverified. `BLOCKED_SPECIALIST_ADJUDICATION` — 0/20 independently adjudicated IPA gold and separate Ukrainian target review outstanding. `TODO` — locate a direct official attestation for `숲이` or preserve its rule-derived status; obtain two qualified independent IPA reviews per queue case; complete independent Ukrainian target review.
- No production transcription logic or public UI was changed in this evidence-only batch. Release disposition remains **deployed research preview, not scientifically validated/release-ready**.


- **Rights-policy URL normalization (2026-10-22):** re-opened the exact registered [NIKL copyright-policy URL](https://www.korean.go.kr/front/nuri/pageView.do?mkn=3&page_id=P000189). The page directly states that eligible NIKL-owned works may be used under Article 24-2 unless a separate KOGL type is displayed, and enumerates KOGL types 0–4 and AI. The source register's checked date and the policy links in this handoff/audit now match that exact URL. This still does not prove the rules page's item-level marking.


## Mainline verification and source-register integrity — 2026-10-22

- Current baseline inspected: `main` at `858ea7ad2e08babed2ce4cf441d22f46de94f34b` (`Add source-register integrity and rights-evidence tests`), based on the previously merged NIKL crawler/local-import and IPA feature-trace work.
- Mainline CI on this exact SHA passed: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39679386102), [Python/Node test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39679386107), [master-table/corpus validation](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39679386124), and [Pages deployment with live Chromium smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39679386111). Browser tests reported **1,082 passed, 0 failed**; Vite build passed; Python regression/data-integrity tests passed on 3.11, 3.12, and 3.13; generated Hangul inventory reported 11,172 rows with 0 validation failures and 0 warnings. Live Pages smoke processed 1,443 Korean input characters and produced 2,782 Ukrainian output characters and 3,731 IPA characters without page errors. This is deployment/contract evidence, not pronunciation or IPA-gold validation.
- New source-register integrity tests now enforce exact CSV column shape, nonblank unique IDs, canonical NIKL full-text URL, explicit HTTP 403 state, and separation of site-wide Article 24-2 policy from item-level KOGL clearance. These tests are included in the passing Python suite.
- Python-vs-browser differential diagnostics still report **18/20 equal, 2/20 different** for `넓죽하다` and `읽고`. The test intentionally emits a diagnostic warning rather than treating either engine as gold; IPA comparison is not performed. Do not alter practical-mode output merely to silence this report. The two divergences require a documented contract decision and/or evidence-backed fixture reconciliation, not a blind code change.
- Current ledger: `DONE_VERIFIED` — mainline source-register integrity/rights-evidence tests; exact-head browser/Python/build/artifact/deployment checks above. `BLOCKED` — NIKL automated fetch remains HTTP 403; no live 30-article manifest exists. Local HTML import and output-collision/CLI guards are implemented and tested, but no authorized local snapshot has been supplied. `BLOCKED / rights` — page-level KOGL marks for the rules page and individual Q&A pages remain unverified. `BLOCKED_SPECIALIST_ADJUDICATION` — independent IPA gold remains 0/20; Ukrainian target review is separate and outstanding. `TODO` — reconcile the two differential mismatches against the declared practical-runtime contract and source-backed evidence; do not label the Python output or browser output normative gold by default.
- No production transcription code or public UI changed in this verification/documentation batch. Release disposition remains **deployed research preview, not scientifically validated or release-ready**.


## Direct primary-rule attestation for 읽고 — 2026-10-22

- The official NIKL Standard Pronunciation Rules page's §1 commentary explicitly describes verbal-stem ㄺ before ㄱ and gives `읽고[일꼬]` (official page source view: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002, around lines 1247–1249 in the extracted view).
- Updated the surface fixture's `읽고` comparator from a Q&A-only citation to `direct-NIKL-example` with the canonical rules URL and a specific §1 commentary locator. The separate Q&A source remains registered as corroborating source material.
- Synchronized `research/ipa-adjudication-queue.json` to that stronger surface-evidence pointer. All candidate/final IPA and reviewer fields remain null; no IPA-gold claim was made.
- The practical browser port's expected `익꼬` remains unchanged and is still explicitly different from the direct normative surface `일꼬`. This is evidence classification, not a production behavior change. The existing differential diagnostic and new fixture assertion guard this divergence.
- Acceptance: fixture/queue parity, Node/Python/build/corpus checks pass on the exact PR head. The scientific blockers remain 0/20 independent IPA gold and outstanding Ukrainian target review; the NIKL live crawler remains blocked by HTTP 403 and item-level reuse marks remain unverified.


## ㄺ exception differential evidence — 2026-10-22

- Added official NIKL Online Q&A `qna_seq=321743` to `research/SOURCE-REGISTER.csv`. It directly contrasts `칡과[칙꽈]` (general ㄺ before ㄱ) with `읽고[일꼬]` (the verbal-stem ㄺ exception). The exact URL is `https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=321743`.
- Updated the fixed browser-port surface fixture to label the two known normative divergences explicitly: `넓죽하다` browser port `널쭈카다` vs NIKL `넙쭈카다`; `읽고` browser port `익꼬` vs NIKL `일꼬`. No production runtime output was changed. The distinction is preserved rather than hiding it by replacing the pinned g2pK port contract with the normative comparator.
- Added `tests/nikl-r11-exception-contrast-evidence.test.mjs` to guard the exact NIKL locators, source registry entry, mismatch status, and the prohibition against treating Hangul surface evidence as IPA/Ukrainian gold.
- Evidence scope: official NIKL establishes the Korean surface comparator, not broad IPA, Ukrainian target, or page-level reuse permission. Q&A item-level KOGL marking remains unverified.
- Task ledger: `DONE_VERIFIED` after exact-head CI for source registration and explicit differential classification. `BLOCKED_SPECIALIST_ADJUDICATION`: 0/20 independent IPA-gold judgments remain. `BLOCKED / rights`: Q&A page-level reuse mark remains unverified. Practical JS port remains unchanged; do not promote this evidence-only batch as linguistic release validation.


## Manifest provenance-schema invariants — 2026-10-22

- **PR #200** merged as `421ffa07b303bd9543fd0e3afe0524f9c49f06f8`. The JSON Schema now conditionally enforces coherent provenance: direct HTTP requires a real retrieval timestamp, successful HTTP status, user-agent, and a checked robots result; local import requires a separate import timestamp, null HTTP status/retrieval timestamp/user-agent, and `not_checked_local_import`. Negative tests reject contradictory manifests in both directions.
- The exact PR-head CI passed **1,082/1,082 Node tests**, Vite build, Python 3.11/3.12/3.13 regression/data-integrity suites, and corpus/master-table checks. The schema-only change does not resolve the external HTTP 403 or establish source reuse rights.
- A follow-up inspection found that the media-type schema regex over-escaped the literal plus in `application/xhtml+xml` and was not anchored. **PR #202** merged as `55fede8fbeccbc5ada13daea19166bf2f897cc98`; it corrects the regex and adds positive XHTML/local-file tests plus a negative near-miss. Exact-head CI passed on `e250c70f0ca71e868a73b838f1729db63667ac23`: **1,084/1,084 Node tests**, Vite build, Python 3.11/3.12/3.13, corpus/master-table checks, and system verification. The final mainline commit triggers a fresh post-merge verification.
- Task ledger: `DONE_VERIFIED` — provenance conditional schema and negative cases (PR #200). `DONE_VERIFIED` — content-type schema validation after PR #202 exact-head CI. `BLOCKED` — live NIKL direct fetch remains HTTP 403; no live manifest exists. `BLOCKED / rights` — page-specific KOGL marking remains unverified.


## Post-merge verification index — 2026-10-22

- PR #201 (official ㄺ exception contrast) merged as `8fd25638ef3cd7cded15b36a5d1e1e536220bdc4`. Its exact-head test/build verification passed **1,084/1,084 Node tests**, Python 3.11/3.12/3.13, and corpus/master-table checks. The official surface contrast is documented separately from IPA and Ukrainian-target validation.
- PR #202 (NIKL manifest content-type schema) merged as `55fede8fbeccbc5ada13daea19166bf2f897cc98`. Exact PR-head verification passed **1,084/1,084 Node tests**, Vite build, Python 3.11/3.12/3.13, corpus/master-table checks, and system verification. Post-merge mainline CI is running against the squash commit.
- Remaining true blockers are unchanged: direct NIKL HTTP fetch returns 403 in GitHub Actions; no live 30-article manifest exists; page-specific KOGL marks are unverified; independent IPA adjudication is 0/20; Ukrainian target-layer review is outstanding. The project remains a deployed research preview, not a scientifically validated release.


## Robots policy parser hardening — 2026-10-22

- The metadata-first NIKL collector's robots parser now selects the most-specific matching product-token group and uses `User-agent: *` only when no specific group matches. Groups are combined only at the same specificity.
- Rule matching now supports `*` wildcard segments and terminal `$` anchors, chooses the longest matching rule, and deterministically prefers `Allow` for equal-specificity ties. Added regression tests for specific-agent precedence, wildcard fallback, wildcard/end-anchor behavior, and Allow-on-tie.
- Updated the crawler guide and skill so the operational policy matches the tested implementation. No fetch retries, alternate-host switching, proxy/stealth mode, or access-control bypass was added.
- PR #203 merged as `beba8449fb4aea2e3c6b7398f75d21702e602133`. Exact-head CI passed at `b5db9f70f6a1fded765bc2407b366b4920722a67`: **1,087/1,087 Node tests**, Vite build, Python regression/data-integrity, corpus/master-table checks, and system verification ([run](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39761663410)). The live source remains blocked by HTTP 403; this work improves policy interpretation but does not make a live crawl available.


## Post-merge robots parser verification — 2026-10-22

- PR #203 merged as `beba8449fb4aea2e3c6b7398f75d21702e602133`. Exact-head validation at `b5db9f70f6a1fded765bc2407b366b4920722a67` passed **1,087/1,087 Node tests**, Vite build, Python regression/data-integrity, corpus/master-table validation, and system verification.
- Task ledger: `DONE_VERIFIED` — robots group precedence, wildcard and terminal-anchor matching, Allow-on-tie semantics, tests, and matching docs/skill guidance. `BLOCKED` — live NIKL fetch still receives HTTP 403. No policy bypass or live manifest claim.


## Live NIKL access recheck after collector hardening — 2026-10-22

- Re-run the official metadata-only crawl on the exact current collector after robots-policy parsing and manifest-schema fixes. This research branch intentionally triggers the repository's live NIKL source-inventory job.
- Acceptance: if the official endpoint responds, verify all 30 article headings and non-empty extracts reconcile before treating the manifest as usable; otherwise preserve the exact BLOCKED response and do not bypass the access control.
- Result on exact head `f477363b321b5f9d1cb5727d0f01fa41f61bc4b1`, workflow run [39761906127](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39761906127): the canonical official page request again returned HTTP 403. The workflow classified it as `BLOCKED`, uploaded a 347-byte evidence artifact containing the crawl log, and did not emit a valid 30-article manifest. Node (1,087/1,087), Vite build, Python regression/data-integrity, and system verification all passed. No bypass was attempted.


## NIKL source-scope and evidence-registry completion — 2026-10-22

- **PR #205** merged as `0bbedc7e6f9d7a712504983ef2e582a10d13a64f`: normalized the stale copyright-policy URL in `SRC-NIKL-PRON` to the verified official policy route `https://www.korean.go.kr/front/nuri/pageView.do?mkn=3&page_id=P000189` and pinned that exact URL in the source-register integrity test. This does not establish item-level KOGL clearance.
- **PR #206** merged as `e81a18878d6c80365e1f0bf615bfd910c65931ed`: the crawler now accepts only the official desktop Standard Pronunciation Rules endpoint or its legacy mobile counterpart, and requires exactly one `regltn_code=0002` query parameter. Unrelated norms pages, wrong regulation IDs, and duplicate rule-code parameters are rejected. The guide and crawler skill match the implemented scope. Exact-head CI passed Node/Python/build, system verification, and master-table/corpus validation.
- **PR #207** merged as `e33cba1cc8bfb143b320bcc4cfd4e3ff7937a7a6`: registered the two official sources previously missing from the 20-case IPA queue/surface fixture (`qna_seq=306000` for the explanatory `읽는 → 잉는` example, and FAQ `mcfaq_seq=5949` for `값어치[가버치]`). A regression now requires every unique normative URL in both machine-readable artifacts to exist in `research/SOURCE-REGISTER.csv`. The `읽는` locator explicitly says its Q&A is about spelling, not a direct pronunciation question; no broader rule inference was added.
- Exact PR-head verification: **1,087/1,087 Node tests**, Vite build, Python regression/data-integrity tests, system verification, and master-table/corpus artifact checks passed. Evidence for PR #207: [system](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39765619176), [test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39765619134), [artifact checks](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39765619138). Post-merge CI on `e33cba1cc8bfb143b320bcc4cfd4e3ff7937a7a6` is running separately.
- **Task ledger:** `DONE_VERIFIED` — exact NIKL copyright-policy URL synchronization; crawler source-scope guard and negative tests; documentation/skill alignment; complete registration of all 11 unique normative URLs referenced by the 20-case queue and surface fixture; source-specific scope note for `읽는`. `BLOCKED` — direct live fetch of the official rules page returns HTTP 403 from GitHub Actions, so no valid 30-article manifest exists; no authorized local HTML snapshot has been supplied. `BLOCKED / rights` — item-level KOGL marking for the rules page and individual Q&A/FAQ sources remains unverified. `BLOCKED_SPECIALIST_ADJUDICATION` — independent IPA gold remains **0/20** and independent Ukrainian target review remains outstanding.
- **Release disposition unchanged:** deployed research preview, not scientifically validated/release-ready. No production transcription logic or public UI changed in these three PRs.
