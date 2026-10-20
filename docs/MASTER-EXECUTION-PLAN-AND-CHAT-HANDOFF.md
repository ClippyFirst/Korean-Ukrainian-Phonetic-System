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
