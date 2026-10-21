# Completion audit — Korean-to-Ukrainian Phonetic System

**Date:** 2026-10-20  
**Audited baseline:** `main` at `8641dac4002f951d391682062ba134894e4198d7`  
**Type:** repository and evidence audit from GitHub API/source files; not a local execution or independent phonetic validation.

## Executive conclusion

The repository is substantially developed: it contains a browser service, native Python pipeline, optional Python g2pK integration, lexical pronunciation data, rule/evidence tables, a generated 11,172-row modern Hangul master table, adversarial fixtures, and rule-specific tests. However, the project is **not yet demonstrated as fully publication-ready as a scientifically validated Korean → IPA → Ukrainian conversion system**.

The highest-risk gap is clearly scoped in the existing README and G2P integration note: the browser JS port uses rule tables and idiom handling but does not reproduce Python g2pK's MeCab-based morphological analysis. Existing browser tests cover selected difficult forms, but those checks are not a general parity proof. Separately, Ukrainian targets are project-level choices and remain provisional in many lexical rows; mechanical IPA/target consistency is useful but not a substitute for independent evaluation.

No source rows or phonological rules were deleted or changed during this audit.

## Current architecture reconstructed

### Intended path

`Korean orthography → Korean surface pronunciation / phonological analysis → IPA → Ukrainian target → Ukrainian orthography`

### Browser practical mode

`src/app/g2pk_web.js` uses the vendored `src/vendor/g2pk/g2p-browser.ts` JS engine to obtain a Hangul pronunciation spelling, then calls the project's IPA engine and IPA-to-Ukrainian mapper. Exact lexical controls can replace surface readings and IPA only when word alignment and syllable-count constraints permit. This is practical mode, not full Python g2pK parity.

### Native/research engine

`src/app/engine.js`, `engine_rules_ctx.js`, `engine_rules_phrase.js`, `engine_ipa.js`, `engine_lexical.js`, and `src/korean_ukrainian/` implement the project's rule/evidence-gated model. The soft morphology layer is documented as opt-in, low-confidence, and fail-closed; it must remain distinct from sourced licenses.

### Python g2pK integration

`src/korean_ukrainian/g2pk_engine.py` uses external g2pK/MeCab when explicitly selected. It preserves literals in protected chunks and does not silently fall back to the native engine. Its IPA output is project-derived from the Hangul surface output, with sourced lexical IPA controls applied under exact matching constraints.

## Findings by audit dimension

### 1. Hangul normalization and syllable parsing

**Status: IN_PROGRESS**

Evidence: the project contains Hangul/Jamo/canonical correspondence inventories, exhaustive Hangul property tests, and a master-table generator. The documented 11,172-row table is exhaustive for modern precomposed Hangul syllable blocks only; it is not exhaustive for words, contexts, loanwords, names, or morphology.

Required checks: validate all 11,172 blocks through the actual runtime decomposition and IPA/target functions, test compatibility jamo and decomposed Unicode input, and ensure normalization is explicit and traceable. Do not equate generator row count with full Korean coverage.

### 2. Korean phonological and morphophonological processes

**Status: IN_PROGRESS**

Evidence: `data/korean/rules.csv` defines R001–R016; `rule_scope.csv` maps NIKL sections 9–30 to implementation scope. Several rules are explicitly conditional on morphology, lexical identity, compound status, or saisiot. The soft morphology design correctly states that it must not infer substantive liaison or optional n-insertion from adjacency alone.

Important audit requirement: reconcile R016 (verbal-stem ㄺ + ㄱ-initial ending exception) with the scope table and ordered-rule implementation. Check each rule's order, boundaries, positive examples, and negative controls against official NIKL examples. A general rule being present in code does not establish that every conditioning environment is implemented correctly.

### 3. Lexical pronunciation and unknown words

**Status: IN_PROGRESS**

Evidence: `data/korean/lexical_pronunciations.csv`, `lexical_additions_2026-10-15.csv`, and `lexical_additions_2026-10-15-g2pk.csv` coexist. Existing docs describe precedence/overlap and exact lexical controls; prior audits include large-scale source and structure reviews.

Risk: multiple data files and merge order can shadow records or produce disagreement between the main corpus and additions. The audit must validate duplicate keys, conflicting values, source URLs, surface form, IPA syllable alignment, target alignment, confidence dimensions, and runtime merge precedence. A record marked `high` for Korean-source confidence must not be interpreted as high confidence in a provisional Ukrainian target.

Unknown words should not be presented as independently verified. They need a transparent fallback/uncertainty label and no fabricated lexical provenance.

### 4. IPA as intermediate representation

**Status: IN_PROGRESS**

Evidence: `engine_ipa.js`, Python `ipa.py`, the IPA-first consistency audit, and a model-wide IPA-to-target test. The consistency audit reported zero mechanical mismatches for its then-current snapshot of 637 primary rows and 44 alternate readings; it also explicitly says that this does not validate the Korean pronunciation or prove that the Ukrainian target is ideal. These counts are historical audit values, not a newly recomputed current-corpus count.

Risk: broad IPA, narrow phonetic realization, and Hangul pronunciation spelling are different representations. The browser trace must not fabricate rule-level explanations for external g2pK output. Mixed-script input must not leak literal Latin text or digits into IPA. Every output path should expose whether IPA is canonical, context-derived, lexical override, heuristic, or unresolved.

### 5. IPA → Ukrainian adaptation

**Status: IN_PROGRESS**

Evidence: `docs/ukrainian-target.md`, `docs/ukrainian-target-review-2026-10-10.md`, `canonical_correspondence.csv`, and the model-wide target consistency test. Existing documentation flags unresolved policy decisions: Korean vowel length, aspiration/fortisness, vowels without direct Ukrainian equivalents, coda /ŋ/, liquid representation, and the role of separators.

Required decision: preserve a compact practical mode if desired, but define it explicitly as a project convention. Keep IPA visible and label the target provisional until independent Ukrainian-reader evaluation exists. Korean NIKL rules govern Korean pronunciation, not Ukrainian orthographic conventions. Do not silently “correct” isolated target rows without reviewing the system-wide mapping policy.

### 6. Source traceability and reproducibility

**Status: IN_PROGRESS**

Evidence: source/evidence CSVs, NIKL audits, lexical batch reviews, source traceability audit, and research-programme PR #154. The PR description itself says the literature/source triage is first-pass and not all full-text, page-level, licensing, or branch-reconciliation tasks are complete.

Required check: ensure every normative Korean claim cites an authoritative NIKL provision or suitable primary evidence; distinguish authority, comparative model, corpus, and differential-test engine. Check all source locators and licensing constraints. Upstream g2pK outputs may be useful differential evidence but are not normative gold labels.

### 7. JS/Python parity

**Status: IN_PROGRESS — highest priority**

Evidence: README explicitly states that the browser JS port does not reproduce Python g2pK's MeCab-based morphological analysis. PR #156 adds browser regressions for selected difficult cases and reports successful CI on its exact head SHA. Its own description says this is not full equivalence or a claim that smoke tests prove all Korean morphology.

Required acceptance: run both engines on the same versioned independent corpus; record exact outputs, compare surface Hangul first, then IPA, then Ukrainian target; classify each mismatch as expected architecture limitation, data/override mismatch, or defect. Cover long strings, inflection, homographs, compounds, loanwords, proper names, whitespace, punctuation, protected Latin/digits, and low-confidence/unknown inputs. Until this is complete, keep browser practical mode's scope explicitly narrower.

### 8. UI, tests, CI, release and deployment

**Status: IN_PROGRESS**

Evidence: `package.json` defines `npm test`, `npm run build`, and `check:release`; multiple GitHub workflows exist. PR #156's 2026-10-15 run reports success for browser tests/build and Python tests on 3.11, 3.12 and 3.13. This is real remote CI evidence for that PR head, not a local run or proof for current main.

Remaining checks: inspect trace usability, keyboard navigation, labels, error handling, long text, narrow viewport, and unknown input. Verify deployed Pages corresponds to an accepted commit. No GitHub Release was found in the inspected release endpoint, and `CITATION.cff` was absent from the inspected main tree.

## Repository/branch state observed

- Default branch: `main`, HEAD `8641dac4002f951d391682062ba134894e4198d7`.
- Open PR #154 — persistent research programme and completion roadmap.
- Open PR #155 — full Korean → IPA → Ukrainian trace.
- Open PR #156 — browser g2pK difficult-form regression gates; CI successful at `6bf9db0c8ebbea97b010c1df99fcb78481571298`.
- Open PR #148 — mixed-script IPA leakage guard.
- No releases returned by the GitHub releases endpoint at audit time.
- `CITATION.cff` not found on main.
- No local checkout or local test execution was available in this session.

## Prioritized acceptance plan

1. **P0 — Reconcile open PRs and handoff state.** Inspect each diff and current CI, identify overlap, preserve research branches, and record disposition.
2. **P0 — Verify trace and IPA-first invariant.** Combine PR #155 and #148 behavior with end-to-end tests for every output mode, including mixed scripts and lexical overrides.
3. **P0 — Quantify browser/Python differences.** Generate same-input results from both engines in supported Python 3.11/3.12; publish a mismatch ledger and explicitly limit the browser claims.
4. **P0 — Revalidate lexical evidence and merge precedence.** Check additions, duplicate keys, source links, alignment, and confidence semantics; do not remove data without dependency analysis.
5. **P0 — Freeze the Ukrainian target policy as policy, not fact.** Document the current trade-offs and independent evaluation still required.
6. **P1 — Finish rule matrix R001–R016.** Link every rule to source, ordering, scope, positive and negative cases, implementation, and test; explicitly reconcile R016 and Rule 16 scope.
7. **P1 — Verify exhaustive Hangul properties and soft-mode fail-closed behavior.**
8. **P1 — Run full UI/accessibility/deployment QA and the complete release gate on the candidate commit.**
9. **P1 — Add and validate `CITATION.cff`, author/contributor roles, dependency/data licensing, and versioned release protocol.**
10. **P2 — Zenodo archive and methods paper only after gates 1–9; verify DOI and archive contents rather than assuming publication.**

## What this audit does not claim

- It does not claim full scientific validation or complete IPA verification.
- It does not claim full JS/Python parity.
- It does not claim that all lexical source URLs were freshly opened or independently validated.
- It does not claim a local test/build passed.
- It does not claim a release, Zenodo archive, DOI, or article has been published.

## Next action

Review PR #155 and PR #148 diffs and checks, then build the same-input browser-vs-Python comparison corpus around the difficult cases in PR #156. Update the master handoff with the resulting exact commit and evidence before moving to release metadata.


## Follow-up verification — 2026-10-20

### Remote CI evidence

- PR #157 documentation/handoff branch: workflow [39482745797](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39482745797) completed with conclusion `success` on `9c73a817928497b66813ec22b9c26aa824ef3300`.
- PR #155 trace UI, head `199f25363f92964930e027aefddfc8d1b75bbdb1`: [verification run 38808586098](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/38808586098) completed successfully. Jobs cover Python regression/data integrity and browser regression/build/generated-page verification.
- PR #148 mixed-script/jamo guard, head `27341b49921452a0d84fd8e16ddc3ef017e8a9e5`: [verification run 38727833203](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/38727833203) completed successfully for Python regression/data integrity and browser regression/build/generated-page verification.

These are historical remote CI results on the listed PR heads. They do not mean the PRs are merged, deployed, or scientifically validated, and they do not substitute for combined regression testing after integration.

### Review finding: compatibility-jamo boundary policy

PR #148's implementation treats a compatibility jamo as explanatory literal when the full input contains at least one Hangul syllable and the local context contains no Latin/digit. This may misclassify malformed mixed input (for example, `가 ㄷ`) as ordinary literal text rather than an unresolved unsupported jamo. Existing tests cover bare jamo, attached Latin residue, non-Korean-only input, explanatory prose, and `3·1절`, but do not establish this boundary case. This is a **candidate defect requiring a focused test**, not yet a reproduced runtime result; no local execution was available.

Suggested cases for a dedicated regression: bare `ㄷ`; `가 ㄷ`; `ㄷ 가`; explanatory `ㅎ과 뒤따르는 자음을 비교한다.`; and sourced lexical `3·1절`. Define expected classification explicitly, and ensure the fix does not regress explanatory notation or sourced lexical overrides.

### Scope and limitations of the trace PR

PR #155 makes the existing IPA-to-Ukrainian longest-match mapping inspectable and adds surface syllable information. That improves auditability, but a trace that mechanically shows `IPA token → grapheme` is not an independent validation of the IPA tokenization, the Korean pronunciation, or the suitability of the Ukrainian target convention. Review the combined behavior with PR #148 before merge, especially literals, punctuation, lexical entries and unresolved segments.

## Next action (updated)

First add/execute focused mixed-input jamo boundary regressions and inspect combined PR #148/#155 behavior. Then implement a versioned same-input JS/Python comparison fixture, preserving the distinction between expected architecture differences and true regressions. No local tests were run in this session.


## Follow-up execution results — 2026-10-21

The prior section's instruction to integrate #156 → #159 → #155 is superseded by the clean current-main ports completed on 2026-10-21:

- #160 ported the research programme/registers to current main and merged as `e8ea0d4`; tests, system verification, and corpus artifact CI all passed on its exact head.
- #161 ported the browser/Python g2pK differential fixture and merged as `0326d24`; tests, system verification, corpus artifacts, and optional g2pK integration all passed on its exact head.
- #163 integrated the IPA trace with the mixed-input/explanatory-jamo guards and merged as `16ac736`; browser/build, Python 3.11/3.12/3.13, browser G2P, and corpus artifact CI all passed on its exact head.
- Focused regressions now cover `ㄷ`, `가 ㄷ`, `ㄷ 가`, explanatory jamo labels, `3·1절`, strict IPA glyph handling, trace mapping consistency, and the 18-row browser/Python surface differential.

This closes the implementation/integration gap for these changes, but not the independent-science or release gates. The surface differential is still 17/18; `값어치` remains a documented browser/NIKL versus Python g2pK divergence. The other 17 expected surface rows require individual source adjudication. Trace consistency is not independent IPA gold, and the Ukrainian target convention is not independently validated.

Still open: dedicated soft-morphology JS/Python parity review; root project-wide license and citation decisions; independent IPA/target-policy review; and a live Pages smoke check tied to the merged commit. Direct public-site retrieval was inaccessible through the available web path, so deployment is not marked verified. No local tests were run; all stated test results are remote GitHub Actions results on the exact PR heads linked in the master handoff.

Current release disposition: **not release-ready; research preview / partial prototype**.


## Final gate update — 2026-10-21

- PR #164 merged as `10bb886`: strict corpus validation now adapts 642 existing source-backed lexical pronunciation records into whole-word sequence rows when no dedicated sequence table exists. Exact source URLs and target status are preserved; no segment-level context, rule IDs, or established Ukrainian graphemic forms are inferred. The strict generator and regression suite passed.
- PR #165 merged as `3bb3dfe`: Pages deployment now depends on strict corpus validation.
- On `3bb3dfe177e2e426ff1260349e199920b1a220ef`, main push workflows passed: deployment [39571926662](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39571926662), system verification [39571926526](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39571926526), test matrix [39571926415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39571926415), corpus artifacts [39571926475](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39571926475). The Pages deploy log reported success and resolved the project URL to https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/.
- Direct web retrieval of the live URL was unavailable, so deployment is verified through the Pages action status and build artifact checks, not an independent HTTP/browser smoke test.
- Remaining: 17/18 fixture rows need source-by-source adjudication; independent IPA gold and Ukrainian target-policy review; dedicated soft-morphology JS/Python parity; root license/citation owner decisions. The 642 derived rows are not a claim of complete segment-level contextual coverage.
- Classification: **technically deployed research preview; not scientifically validated or release-ready**.



### Follow-up correction: practical mode must be strict to the JS port (2026-10-21)

The previous description above is historical and has been superseded by branch `fix/practical-mode-strict-g2pk-port-2026-10-21`. The practical browser adapter no longer applies project lexical surface/IPA overrides after `G2pBrowser`; only the research engine receives the merged research lexicon. Regression tests now compare practical surface output directly with the pinned JS port's output using the production options. This deliberately preserves upstream mismatches such as `값어치` rather than replacing the port output with NIKL's normative form. NIKL's `가버치` remains evidence for normative Korean pronunciation, not an override in this mode. Exact-head CI is still required before this change is verified.


### Exact-head result for practical-mode strict-port change — 2026-10-21

PR #167, head `1b4e337e8d4f48df1fa950f7bbeb44ed06009fe7`, passed all four workflow groups: Browser G2P integration (`39597566751`), general tests (`39597566834`), system verification (`39597566591`), and master-table/research-corpus artifacts (`39597566745`). Browser G2P integration ran `npm test` and `npm run build`; the general test workflow passed web tests and Python 3.11/3.12/3.13; system verification passed browser regression/build and Python regression/data integrity. This was CI, not a local run.

The CI exposed and the fixture now records the strict port's outputs instead of research overrides for `넓죽하다` → `널쭈카다` (previous project override `넙쭈카다`) and `읽고` → `익꼬` (previous override `일꼬`). For `값어치`, the port output `갑써치` is retained, while NIKL's normative `가버치` is documented separately. These results establish port reproducibility only, not normative accuracy. PR #167 remains the review vehicle; exact-head CI must be refreshed for any later code or documentation commit.
