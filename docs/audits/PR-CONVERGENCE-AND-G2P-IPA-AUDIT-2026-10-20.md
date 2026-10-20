# PR convergence and independent G2P/IPA audit — 2026-10-20

**Baseline:** `main` at `8641dac4002f951d391682062ba134894e4198d7` (the merge base returned by GitHub compare for current PR branches).
**Scope:** PRs #148, #154, #155, #156, #157, #158; no merge or release performed by this audit.
**Evidence rule:** CI evidence applies only to the exact SHA stated below. A successful test suite is not independent phonetic validation.

## 1. PR convergence matrix

| PR | Current work / changed paths | Branch relation to main | Exact-head CI evidence | Recommendation |
|---|---|---|---|---|
| [#148](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/148) | Mixed-script residue, bare compatibility jamo; `engine_convert.js`, `engine_shared.js`, JS and Python tests | Its branch is the ancestor of #158; compared with main it is 11 commits ahead and 9 behind | SHA `27341b49921452a0d84fd8e16ddc3ef017e8a9e5`: tests, system verification, master-table/corpus workflows succeeded | **Do not merge separately.** #158 supersedes its explanatory-jamo heuristic and contains its changes; preserve #148 as historical parent/reference. |
| [#154](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/154) | Research programme, source register, roadmap, rule coverage, literature/target-layer review; README + `research/` | Branch diverged: 33 commits ahead and 2 behind main; changes are documentation/CSV only | PR description says no runtime tests; no current exact-head workflow result established in this audit | Reconcile base against current main, inspect README overlap, validate CSV schemas/links/licensing claims, then integrate as documentation foundation. |
| [#155](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/155) | Surface/IPA/Ukrainian trace, longest-match IPA token trace, UI and regression tests; overlaps `engine_convert.js` with #148/#158 | 15 commits ahead, 0 behind main before the new strict-IPA fix | Previous SHA `199f25363f92964930e027aefddfc8d1b75bbdb1`: all four listed workflows succeeded. **That evidence is invalidated by the latest change**; new head `95a1966b931ec5d065f671e7e04994f8ff2285db` needs fresh CI | Keep the trace feature; review it after #158 is reconciled because both modify `engine_convert.js`. Do not claim IPA correctness from mapping-consistency tests alone. |
| [#156](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/156) | Browser g2pK integration boundary and exact surface-form regression gate; docs + one test file | 4 commits ahead, 0 behind main; no runtime code change | SHA `6bf9db0c8ebbea97b010c1df99fcb78481571298`: tests, system verification, master-table/corpus workflows succeeded | Best early guardrail candidate after confirming current exact head. Its name/body must not be read as a JS-vs-Python parity proof: it tests 18 expected surface forms and downstream consistency, not cross-runtime equivalence. |
| [#157](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/157) | Completion audit and handoff; two new docs | 10 commits ahead, 0 behind main | SHA `908ac87cc725e7e20d4ee11aacc6fc993b727027`: all three listed workflows succeeded | Documentation-only and current against main. Integrate after reviewing this matrix/handoff update; does not validate runtime behavior. |
| [#158](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/158) | Tightens #148 jamo policy; extends tokenizer context and adds explanatory-label tests; same two source/test paths | Descends from #148; 20 commits ahead and 9 behind main. It is stacked on #148, not a clean main-based PR | SHA `48e91f7d0ca7e6153824fbb69d4c5e0ef4352f8e`: system verification passed; previous PR body is stale and still says CI pending | **Preferred single mixed-input integration path**, but retarget/reconcile with main and rerun exact-head CI before merge. Do not merge #148 and #158 independently. |

### Integration order (recommended, not executed)

1. **#156** — add the current browser surface-form guardrail (after checking the exact current head and required checks).
2. **#154 and #157** — reconcile documentation branches against main; keep the source/literature programme and operational handoff distinct but linked. Neither is evidence of runtime completion.
3. **#158 as the sole mixed-script PR** — bring the stacked #148+#158 branch onto current main, resolve any conflicts, review combined diff, run full CI. Close #148 as superseded only after #158 has been accepted; do not merge both.
4. **#155** — rebase/reconcile the trace UI and `engine_convert.js` changes on top of the accepted mixed-script path, then run full CI. Verify that surface alignment remains correct for literals, lexical entries, variants and unresolved syllables.
5. Re-run all regression suites on the final integrated head. Treat #156's current tests as a baseline, not as independent phonetic gold.

This order is conditional on actual GitHub mergeability and exact-head CI. No branch was merged by this audit.

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
