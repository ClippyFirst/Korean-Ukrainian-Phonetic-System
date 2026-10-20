# PR convergence and independent G2P/IPA audit — 2026-10-20

**Baseline:** `main` at `8641dac4002f951d391682062ba134894e4198d7` (the merge base returned by GitHub compare for current PR branches).
**Scope:** PRs #148, #154, #155, #156, #157, #158; no merge or release performed by this audit.
**Evidence rule:** CI evidence applies only to the exact SHA stated below. A successful test suite is not independent phonetic validation.

## 1. PR convergence matrix

| PR | Current work / changed paths | Branch relation to main | Exact-head CI evidence | Recommendation |
|---|---|---|---|---|
| [#148](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/148) | Mixed-script residue, bare compatibility jamo; `engine_convert.js`, `engine_shared.js`, JS and Python tests | Its branch is the ancestor of #158; compared with current main it is 11 commits ahead and 11 behind | SHA `27341b49921452a0d84fd8e16ddc3ef017e8a9e5`: tests, system verification, master-table/corpus workflows succeeded | **Do not merge separately.** #158 supersedes its explanatory-jamo heuristic and contains its changes; preserve #148 as historical parent/reference. |
| [#154](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/154) | Research programme, source register, roadmap, rule coverage, literature/target-layer review; README + `research/` | Branch diverged: 33 commits ahead and 4 behind current main; changes are documentation/CSV only | PR description says no runtime tests; no current exact-head workflow result established in this audit | Reconcile base against current main, inspect README overlap, validate CSV schemas/links/licensing claims, then integrate as documentation foundation. |
| [#155](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/155) | Surface/IPA/Ukrainian trace, longest-match IPA token trace, UI and strict IPA glyph guard; overlaps `engine_convert.js` with #159 | 19 commits ahead and 2 behind current main | Latest head `3bd2446a1d8d33233a097c28e448ea1cbd1fd78d`: all four workflow groups passed; browser tests 1037/1037; Python 3.11/3.12/3.13 passed | Keep the trace feature; rebase after #159 and review trace alignment for literals, lexical overrides, variants and unresolved units. Do not claim IPA correctness from mapping-consistency tests alone. |
| [#156](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/156) | Browser G2P regression fixture, export/comparison harness, Python differential test and dev extra; no new runtime engine | 17 commits ahead and 2 behind current main | Latest head `c2b63e577f5d6a610e32eb661f8abcde5a721633`: all four workflow groups passed; browser tests 1035/1035; Python matrix and optional g2pK 3.11/3.12 passed. Surface differential 17/18; NIKL adjudicates the one mismatch. | Best first runtime/test integration candidate; then rebase #159 and resolve the additive `tests/test_pipeline.py` overlap. This still does not establish IPA parity. |
| [#157](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/157) | Completion audit, handoff and PR convergence report | 27 commits ahead and 2 behind current main | Latest head `575af05a8217ca4cdc89351668d495f4f8dee416`; prior head `908ac87...` passed workflows; no exact-head run observed for latest documentation-only edits | Documentation-only; review the source/license claims and links. Does not validate runtime behavior. |
| [#158](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/158) | Tightens #148 jamo policy; extends tokenizer context and adds explanatory-label tests; same source/test paths | Descends from #148; 20 commits ahead and 11 behind current main. It is stacked on #148, not a clean main-based PR | Previous stacked head `48e91f7d0ca7e6153824fbb69d4c5e0ef4352f8e` passed its then-current system verification; it is now superseded by #159 | Do not merge #148/#158 independently. #159 is the consolidated main-based candidate, with exact-head CI green. |

| [#159](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/159) | Consolidates #148/#158 mixed-input guards on a clean main-based branch; strict handling for standalone jamo and explanatory labels | 7 commits ahead and 2 behind current main | Latest head `de4565de7e43187831ad44f03c35ff515b25c4fc`: all four workflow groups passed; browser tests 1039/1039; Python matrix passed; corpus 165 files with one intentional unresolved control and zero placeholders | Preferred mixed-input candidate; rebase after #156 and resolve overlap in `tests/test_pipeline.py`; then reconcile #155. |

### Integration order (recommended, not executed)

1. **#154 then #157** — reconcile documentation branches against current main; review source/license claims in #154, then update the handoff/audit links in #157. Neither is evidence of runtime completion.
2. **#156** — integrate the fixed surface fixture and Python 3.11/3.12 differential test. Exact head `c2b63e5...` is green and reports 17/18 matching surfaces, with `값어치` adjudicated against NIKL.
3. **#159 as the sole mixed-input PR** — it consolidates #148+#158 on a clean branch. Rebase it after #156 and resolve the additive overlap in `tests/test_pipeline.py`; review the combined diff and run full CI. Close #148/#158 as superseded only after #159 is accepted; do not merge them separately.
4. **#155** — rebase/reconcile the trace UI, strict IPA glyph guard and `engine_convert.js` changes on top of accepted #159, then run full CI. Verify alignment for literals, lexical entries, variants and unresolved units.
5. Re-run all regression suites on the final integrated head. Treat #156's current tests as a baseline, not as independent phonetic gold.

This order is conditional on actual GitHub mergeability and exact-head CI. No branch was merged by this audit. Both #156 and #159 append tests to `tests/test_pipeline.py`, so resolve that overlap explicitly during rebase rather than assuming a clean cherry-pick.

## 2. G2P: what is and is not verified

The practical public path uses the vendored browser JavaScript port of `ntdgo/korean-pronunciation 1.0.1`, itself a port of g2pK. It preserves the surface spelling from the JS port and does **not** reproduce the Python g2pK/MeCab morphological analysis. The native/research engine is a separate implementation. Therefore these are three distinct things:

- **Surface-form regression:** covered for 18 selected forms in #156 (`넋이`, `몫이`, `값이`, `값어치`, `숲이`, `같이`, `굳이`, `닭이`, `밟는`, `넓죽하다`, `읽고`, `읽는`, `국립`, `협력`, `독립문`, `칼날`, `물난리`, `서울역`) plus a long adversarial passage.
- **IPA-to-target reproducibility:** #155 adds a longest-match token trace and checks that the Ukrainian segment matches the mapping applied to the displayed IPA.
- **Independent phonetic accuracy / JS-vs-Python parity:** **not established**. No independently adjudicated IPA gold labels or exact differential run against Python g2pK/MeCab were found in the reviewed PR descriptions/tests. A non-empty IPA string and a self-consistent target mapping do not prove that the IPA itself is correct.

Missing/under-covered cases to add to a separately labelled, source-backed benchmark: `의` in lexical/particle contexts; contractions and colloquial reductions; more formal-vs-substantive-morpheme boundaries; fortition and aspiration minimal contrasts; names and foreign names; multi-clause/long sentences; ambiguity cases where morphology changes the output. Each row must distinguish NIKL normative surface, observed browser surface, optional Python surface, IPA source/status, and Ukrainian target policy. Do not fill IPA gold labels by copying either G2P engine's output.

## 3. IPA-first and target-layer findings

- The canonical correspondence CSV explicitly labels several target mappings as project/model choices: fortisness and aspiration are not separately encoded in Ukrainian; Korean `[h]` is approximated with Ukrainian `г` despite the voicing mismatch; coda `ŋ` maps to `н`; `ø` maps to `ве`; `y` maps to `ві`. These are documented choices, **not independent proof that the choices are optimal**.
- Vowel `ㅢ` is explicitly recorded as context-dependent (`ɰi~i~e`) with no universal Ukrainian output. Tests should preserve unresolved/conditional behavior rather than force one blanket mapping.
- The IPA mapper previously accepted both IPA `ɡ` (U+0261) and ASCII `g` (U+0067) as `ґ`. That lets a Latin transliteration residue masquerade as IPA. The 642-row lexical corpus's `ipa_syllables` column contains 73 rows with `ɡ` and zero rows with standalone ASCII `g` in the IPA field; canonical source data uses the IPA glyph. A fail-closed fix has been committed on the #155 branch: remove ASCII `g` and test that `ɡ` maps while `g` is returned as unknown. Commit `95a1966b931ec5d065f671e7e04994f8ff2285db`. Fresh CI for that exact SHA has not yet appeared in the checked workflow list.
- Existing trace consistency checks are useful but partly self-referential: they confirm output matches the project's own mapping table. They do not independently certify the IPA segmentation, phonetic transcription, or Ukrainian adaptation policy.

## 4. Legal and citation metadata

- Present: `public/THIRD_PARTY_NOTICES.txt` identifies `ntdgo/korean-pronunciation 1.0.1`, the upstream URL, Apache-2.0, local browser-only changes, and the distinction from Python MeCab; `public/LICENSES/Apache-2.0.txt` contains the license text.
- Not found at repository root on main: `LICENSE` and `CITATION.cff`. This is a publication/redistribution metadata gap; it does not by itself establish that the project lacks all rights, nor should a project-wide license be invented without an explicit owner decision.
- Continue to verify each dataset/source's own license and usage conditions. In particular, the Seoul Corpus CC BY-NC constraint recorded by the research programme means it cannot be treated as an unrestricted commercial benchmark or bundled dataset.

## 5. Status after this audit

- **Verified:** exact historical CI runs for #148, #155, #156 and #157 listed above; #158's previous exact-head system verification; presence of upstream notices/license text; absence of root `LICENSE` and `CITATION.cff`; 642 primary lexical rows; #158's ancestry on #148; #148/#158 are 9 commits behind main.
- **Pending:** fresh CI after strict ASCII-`g` rejection on #155; current mergeability and exact head metadata for each PR; rebase/retarget of #154 and #158; independent Python-vs-browser differential benchmark; independent IPA adjudication; broader `의`, reduction, names and long-sentence corpus.
- **Not claimed:** full G2P parity, complete normative IPA coverage, final Ukrainian target-policy approval, release readiness, or completed scientific validation.


## Follow-up update — clean-base mixed-input PR #159

- Retargeting the stacked #158 directly to `main` did not give a reliable clean integration path; a new branch was created from `main` at `8641dac4002f951d391682062ba134894e4198d7` and the reviewed #148/#158 functional delta was ported as [PR #159](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/159).
- PR #159 head `de4565de7e43187831ad44f03c35ff515b25c4fc`. Exact-head workflow [39488133606](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39488133606) completed successfully: browser regression/build and Python regression/data-integrity both passed. Other workflow checks (including browser-G2P and multi-version test workflow) were still queued/in progress at the last read; do not treat the PR as fully green yet.
- The initial clean-base run on `eecccf6e7c8af232b5eef6de5e064d4bd4d5f0bd` failed because a local context variable was removed while the classifier still referenced it. Restored it in `de4565d...`; the exact-head browser/build and Python regression jobs then passed.
- The new regression suite also covers the edge case where malformed standalone jamo occurs in the same input as a sourced lexical item (`가 ㄷ 3·1절)); this ensures lexical tokenization cannot silently drop the jamo.
- PR #159 remains draft. Do not close #148/#158 until all #159 checks are green and the combined diff is reviewed.

## Follow-up update — strict IPA glyph

- The ASCII-`g` rejection on #155 correctly exposed a stale test that explicitly required both ASCII `g` and IPA `ɡ` to map to `ґ`. That expectation contradicted the IPA-first requirement.
- Updated `tests/web-engine.test.mjs` to require `ɡa` → `ґа` and `ga` → unresolved. A first run showed the unknown segment is reported as the full `ga` string (because failure occurs at index zero), so the assertion was corrected accordingly.
- Latest #155 head is `3bd2446a1d8d33233a097c28e448ea1cbd1fd78d`; exact-head CI is queued/not yet visible at the last check. The previous failing run is evidence of a stale test, not a passing validation of the new fix.


## Final verification snapshot — 2026-10-20

- **Consolidated mixed-input PR #159:** exact head `de4565de7e43187831ad44f03c35ff515b25c4fc`. All four workflow groups passed:
  - system verification `39488133606`;
  - tests `39488133971`;
  - browser G2P integration `39488133871`;
  - master table/corpus artifacts `39488133584`.
  Browser test suite: **1039 passed, 0 failed**. Whole-corpus diagnostic: 165 files, 164 `lexical-review`, one intentionally unresolved negative control, zero placeholders. The Python 3.11/3.12/3.13 matrix passed. PR #159 remains draft and unmerged.
- **Strict IPA mapper fix on #155:** latest head `3bd2446a1d8d33233a097c28e448ea1cbd1fd78d`; all four workflow groups passed (`39488270264`, `39488270290`, `39488270387`, `39488270279`). Browser tests: **1037 passed, 0 failed**. This closes the stale-test regression for the ASCII `g` rejection, but #155 still needs convergence with #159 because of overlapping `engine_convert.js` changes.
- **Surface regression fixture/harness on #156:** head `07c18d247f5033188236a6684fdc783f4d63b665); existing test, verification, and corpus workflows passed (`39488581780`, `39488581776`, `39488581740`). The 18-row fixture is now externalized and the Python differential script exists, but **the script has not been run** and no differential JSON report exists yet. It must not be described as proven parity.
- **Base branch history:** a workflow-file add was accidentally committed to `main` as `1f96917317c922debab964217d2d96e264056cf3` while attempting to create a branch-specific workflow, then immediately removed in `98697b71e442afcad802930896a7a5dcb94a02ef`. The workflow file is absent from current `main`; its tree is restored, but the two commits remain in main history. This means the current main tip is two commits after the previously used baseline, and open PR branches may report themselves behind even where their changed files do not overlap. Recheck mergeability before integration.
- **Integration remains pending:** do not merge #159/#155/#156 solely because their listed tests pass. Review the exact diffs, confirm GitHub's current mergeability/base SHA, run the Python-vs-browser surface comparison, and separately adjudicate IPA against authoritative/source-backed evidence.


## Latest PR #156 verification — fixed corpus/export harness

- Latest head: `deff3e70218612a5328782729b74cfecd47f6c37`.
- CI passed: system verification `39489076412`, tests `39489076709`, master-table/corpus artifacts `39489076863`.
- Browser suite: **1035 passed, 0 failed**. The new test runs `scripts/export-browser-g2pk-surfaces.mjs` and confirms all 18 exported browser surfaces match the fixed fixture; Python pytest also syntax-checks `scripts/compare-g2pk-engines.py`.
- The actual comparison against Python `g2pK` has **not** been executed. The JSON report has not been generated. The fixture is a surface regression set with expected values from existing project tests, not an independently adjudicated gold set.
- Current PR #156 is draft and the metadata response reports it mergeable against `main`; the branch was behind two history-only main commits from the workflow add/delete noted above, so recheck exact base SHA immediately before merge.

## Revised immediate sequence

1. Keep #159 draft; exact-head CI is green, but review the combined diff and recheck mergeability against current main.
2. Reconcile #155 after #159's disposition; its strict IPA glyph fix is green at exact head `3bd2446a1d8d33233a097c28e448ea1cbd1fd78d`, but overlapping `engine_convert.js` changes mean it should not be merged independently before that review.
3. #156's browser fixture/exporter checks are green at `deff3e70218612a5328782729b74cfecd47f6c37`; execute the Python differential script separately before claiming runtime comparison.
4. Reconcile #154 and #157 documentation branches; neither substitutes for runtime or IPA validation.

## Partial presence in main and PR-specific risks

| PR | What main already has | What remains branch-only / risk |
|---|---|---|
| #148 / #158 / #159 | Core IPA-first renderer, literal handling, native contextual rules, lexical source controls | Main lacks the new standalone-jamo classification, strict IPA-safe literal filtering and local explanatory-label boundary. #159 is the consolidated candidate. Risk: tokenizer changes can drop or misclassify jamo when lexical tokenization is active; the 18-row/long-passage tests do not substitute for the whole 165-corpus gate. |
| #155 | `engine_ipa.js`, longest-match output mapping, IPA-to-Ukrainian rendering already exist | The visible per-token trace, realized-surface trace field, UI headings and strict ASCII-`g` rejection are branch-only. Risk: `engine_convert.js` overlap with #159 and target trace can misalign on literals, lexical overrides, variants or unresolved units. |
| #156 | Browser app already uses the vendored JS g2pK adapter in practical mode; Python backend is optional | Adds `pyproject.toml` dev dependency, fixed fixture, browser export/comparison scripts, `tests/g2pk-browser-parity-gate.test.mjs`, and Python differential test in `tests/test_pipeline.py`; no new runtime engine. Its 18 expected surfaces are not all independently source-reviewed; one Python mismatch is now adjudicated against NIKL; IPA gold is absent. It overlaps #159 in `tests/test_pipeline.py`. |
| #154 | Core engine, source/lexical CSVs and current README already exist | Research programme, source registers, literature review, target-layer comparison and acceptance gates are branch-only. Risk: 2 commits behind main; source locator/license claims need review; documentation-only PR has no runtime test coverage. |
| #157 | Runtime and existing audit docs | Completion audit, handoff and this convergence report are branch-only. Risk: latest docs commit has no exact-head workflow result observed; it does not alter runtime. |

No PR among these has been merged. The existence of a module on main (for example the IPA renderer) must not be confused with the additional trace or validation gates proposed by its PR.
## Independent surface comparison result — `값어치`

- The shared 18-row fixture was run through browser JS (existing regression) and Python `g2pK==0.9.4` on Python 3.11 and 3.12. Both versions report **17 equal / 1 different**.
- The sole mismatch is `값어치`: browser fixture `가버치`; Python g2pK `갑써치`.
- This mismatch is now adjudicated against the [National Institute of Korean Language's official pronunciation guidance](https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5949&mn_id=217), which explicitly gives standard pronunciation `[가버치]` under 표준 발음법 제15항 붙임. The browser expectation is therefore retained; Python g2pK's output is recorded as a known lexical/morphological divergence.
- Fixture metadata records the source URL and the exact Python output. The remaining 17 rows match existing project expectations, but those matches are not all independently sourced yet.
- This comparison is **surface spelling only**. It does not validate IPA. Every row still has `ipaGoldStatus: not_independently_adjudicated`.

## Latest exact-head comparison CI — PR #156

- Head `c2b63e577f5d6a610e32eb661f8abcde5a721633` passed all four workflow groups: tests `39490017242`, system verification `39490017260`, master-table/corpus artifacts `39490017442`, and optional g2pK integration `39490017642`.
- Browser suite: **1035 passed, 0 failed**; corpus diagnostic remains 165 files / 164 `lexical-review` / one intentionally unresolved negative control / zero placeholders. Python matrix 3.11, 3.12 and 3.13 passed; optional g2pK integration passed on 3.11 and 3.12.
- The Python differential report emitted by both 3.11 and 3.12 is 17 equal / 1 different. The mismatch is stable and recorded: `값어치` expected `가버치`, Python g2pK `갑써치`.
- Official source: NIKL standard-pronunciation guidance explicitly gives `값어치 [가버치]` under 표준 발음법 제15항 붙임: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5949&mn_id=217. The fixture records the URL and classifies this as a known Python-engine divergence.
- This is a real cross-runtime surface comparison, not IPA verification. No independently adjudicated IPA gold set has been produced.


## Rechecked repository state — 2026-10-20 (latest branch comparison)

This section supersedes earlier branch-count snapshots above. GitHub compare was rerun against the current `main` head `98697b71e442afcad802930896a7a5dcb94a02ef`; the common merge base for the active runtime branches remains `8641dac4002f951d391682062ba134894e4198d7`.

| PR | Branch | Ahead / behind current main | Decision |
|---|---|---:|---|
| #154 | `docs/research-programme-foundation-2026-10-15` | 33 / 4 | Reconcile/rebase before merge; inspect README overlap and validate source/license claims. |
| #155 | `feat/ipa-to-ukrainian-visible-trace-2026-10-16` | 19 / 2 | Keep; reconcile `engine_convert.js` with #159 before integration. |
| #156 | `fix/g2pk-browser-parity-gate-2026-10-16` | 17 / 2 | Keep; first runtime/test candidate, but rebase and rerun CI on current base. |
| #157 | `audit/completion-plan-handoff-2026-10-20` | 30 / 2 | Documentation branch; this addendum itself has not yet been validated by an exact-head workflow run. |
| #159 | `fix/mixed-input-main-convergence-2026-10-20` | 7 / 2 | Preferred consolidated mixed-input candidate; rebase after #156 and resolve `tests/test_pipeline.py` overlap. |
| #148 | `fix/mixed-input-ipa-leak-2026-10-15` | 11 / 11 | Superseded; do not merge separately. |
| #158 | `fix/jamo-explanatory-boundary-2026-10-20` | 20 / 11 | Superseded; do not merge separately. |

### Completion state

- **Surface differential:** completed for the fixed 18-row fixture only. Python g2pK 0.9.4 on Python 3.11 and 3.12 matches the browser expectation on 17/18 rows. The one mismatch, `값어치`, is resolved in favor of NIKL's normative `[가버치]`; Python g2pK returns `갑써치`. This does not mean the other 17 rows have independent source adjudication.
- **IPA gold:** not complete. `expectedIpa` remains null for the fixture rows and `ipaGoldStatus` remains `not_independently_adjudicated`. Do not populate gold from either engine's output.
- **Mixed-input policy:** the consolidated #159 exact-head CI was green, but that run predates rebasing onto current `main`; it must be rerun after #156 is integrated/reconciled.
- **Trace / strict IPA glyph:** #155 exact-head CI was green, but the branch overlaps #159 and is two commits behind current main. The integrated trace must be tested after the mixed-input branch.
- **Research docs and legal metadata:** #154/#157 need current-base reconciliation. Root project-wide `LICENSE` and `CITATION.cff` still require an owner decision; do not infer a project license from third-party notices.
- **No PR is merged by this audit.** Existing exact-head CI is evidence for the recorded SHAs only, not for a hypothetical combined head. The two workflow-file history commits on main remain documented above; the file itself is absent from the current tree.

### Required finish sequence

1. Reconcile #154 and #157 against current `main`; validate source-register CSVs, URLs and licensing statements, then run the docs/artifact workflow.
2. Rebase #156 onto current `main`, rerun all workflows, and retain the fixed 18-row comparison report.
3. Rebase #159 onto the accepted #156 result; merge test changes additively and preserve all mixed-input regressions; rerun full CI and the 165-corpus gate.
4. Rebase #155 on the accepted #159 result; resolve trace/render overlap, inspect literal/lexical/unresolved segments, and rerun full CI.
5. Build a separately sourced IPA gold set and adjudicate Ukrainian target policy before claiming scientific/release readiness.
6. Only after the integrated diff and checks pass, close #148/#158 as superseded and decide on root license/citation metadata and release criteria.


## CI recheck correction — 2026-10-20

A subsequent query of GitHub Actions confirmed that the latest documentation head `ac099059340bb07d820082093135f7760f7016f2` **does have successful exact-head runs** (the earlier statement that no run was visible is superseded):
- tests: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39494387952 — success
- system verification: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39494387991 — success
- master-table/research-corpus artifacts: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39494387956 — success

The PR #157 branch comparison now reports **32 commits ahead / 2 behind** current main at `98697b71e442afcad802930896a7a5dcb94a02ef`. The successful documentation-branch workflows verify the documented gates for this exact SHA, but do not test a combined runtime integration. The latest exact-head CI queries for #154, #155, #156 and #159 also returned success for all four recorded workflow groups for their stated SHAs. Those runtime branches remain two or more commits behind main and still require current-base reconciliation plus combined-head CI.
