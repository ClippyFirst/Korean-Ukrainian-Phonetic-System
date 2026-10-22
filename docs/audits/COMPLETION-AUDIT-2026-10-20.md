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


## Final practical-mode merge and deployment result — 2026-10-21

- **DONE_VERIFIED:** PR #167 merged as `fde3113fe97a34582228abcd870e64a690cf9d09`. Practical browser mode no longer applies project lexical surface/IPA overrides after the vendored JavaScript g2pK port; research lexical data remains isolated to Research mode.
- **DONE_VERIFIED:** all four exact-head CI groups passed on `761668a591230f138baeb452a3bbf9e9d362d664`: Browser G2P integration [39597726122](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726122), general tests [39597726175](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726175), system verification [39597726128](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726128), and master-table/corpus artifacts [39597726141](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726141).
- **DONE_VERIFIED:** main deployment run [39598199808](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39598199808) succeeded on the merge commit; browser tests/static build, Python 3.11/3.12/3.13 checks, Pages artifact upload and deployment passed.
- **BLOCKED:** direct interactive smoke test of the public URL could not be performed: the available web reader could not retrieve the Pages URL and the connected browser/scrape service was out of credits. This is not represented as a passing browser test; only CI and deployment evidence are verified.
- **PARTIAL / evidence-limited:** known port outputs intentionally preserve JS behavior even where upstream differs from NIKL: `값어치` `갑써치` vs normative `가버치`; `넓죽하다` `널쭈카다`; `읽고` `익꼬`. These are contract regression values, not independent pronunciation gold.
- **Remaining blockers:** source adjudication for surface fixtures; independent IPA gold and Ukrainian target-policy review; soft-morphology JS/Python parity; root license/citation owner decisions; direct live-site smoke test. Final classification: **technically deployed research preview; not scientifically validated or release-ready**.


## One-pass continuation findings — 2026-10-21 (branch pending CI)

- **Repository state:** main at continuation start was `a50ce37cb6052d74ea8ad34c0baf74a91bac7378`; 173 branches enumerated across two API pages, no open PRs/issues, 16 relevant branches compared. Historical divergent branches remain untouched because they are far behind and overlap current integrated code; no blind cherry-picks or branch deletion.
- **Rule coverage register:** the previously placeholder-only `research/RULE-COVERAGE.csv` is now populated for R001–R016 plus NIKL article inventory and IPA→Ukrainian mapping. Statuses explicitly distinguish implemented rule paths from incomplete CLI/API per-rule parity and independent review.
- **Surface evidence:** `docs/audits/SURFACE-REGRESSION-SOURCE-ADJUDICATION-2026-10-21.md` records the 18-case fixture. Eleven normative comparators have direct NIKL example/Q&A support; seven remain rule-derived candidates. All 18 IPA values remain unadjudicated. The port's expected outputs remain unchanged, including the known divergences for 값어치, 넓죽하다, and 읽고.
- **Code defect addressed on follow-up branch:** Python soft morphology previously generated an R002 formal license for ambiguous 어/아 and some §15-sensitive contexts, unlike the browser guard. The guard now fails closed; shared Python/browser parity fixture/tests and a source metadata gate were added.
- **Product/docs:** public UI warns that practical mode reproduces the JS port and may differ from NIKL; README status no longer calls the research layer research-ready; stale MANIFEST upload instructions are marked historical; source register and acceptance gates reflect actual current evidence; root project-wide license is explicitly left to the owner.
- **DONE_VERIFIED — exact-head CI:** branch head `14bca46c7431bc8ed273f0cb1d6f693f17838abc` passed tests/build/Python 3.11–3.13 [39601258671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258671), browser G2P [39601258672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258672), system verification [39601258670](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258670), and corpus artifacts [39601258668](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258668). Local tests are not claimed because no local checkout/runtime was available.
- **Remaining blockers:** independent IPA gold; independent Ukrainian target review/reader evaluation; direct live-site interactive smoke test; owner decision on root LICENSE/CITATION.cff; adjudication of seven rule-derived surface cases. Final classification remains **technically deployed research preview, not scientifically validated or release-ready**.


## Final post-deploy verification — 2026-10-21

- Code/deployment commit verified by live HTTP smoke: `778070fd81afc21e170ded6d8b5c0b8af8bab19c`; this PR only updates the final handoff/audit evidence.
- PR #169 and #170 merged; no open PRs remained at the last status check.
- Tests/build/Python 3.11–3.13 passed: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39602020543
- System verification passed: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39602020407
- Corpus artifacts passed: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39602020437
- Pages deployment and live HTTP smoke passed: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39602020436. The runner fetched index.html, system.html, the practical-mode warning/control, and the generated JavaScript asset.
- A headless Chromium smoke passed against the deployed page using the repository's 1,443-character adversarial Korean fixture, producing 2,782 Ukrainian characters and 3,731 IPA characters with no page errors. The exact earlier user-pasted passage remains unverified if it differs from this fixture; this smoke does not validate pronunciation accuracy.
- Still release-blocking: independent IPA gold, independent Ukrainian target validation, seven rule-derived surface comparators, and owner decisions for the root project license/citation metadata. Final status: technically deployed research preview, not scientifically validated or release-ready.


## Exact-head mainline verification after live-browser smoke integration — 2026-10-21

Code/deployment commit: `dae8ebdabb396d1be51afbe891d80c9c48a29f1c`. Mainline code-equivalent docs/evidence commit tested: `a8996112a01ec43f90b7c297b975906e4b44ab83`.

- Tests/build/Python 3.11–3.13: PASS [39604039126](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039126).
- System verification: PASS [39604039157](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039157).
- Corpus artifacts: PASS [39604039164](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039164).
- Pages deployment + HTTP + headless Chromium smoke: PASS [39604039154](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039154). 1,443 Korean input characters produced 2,782 Ukrainian output characters and 3,731 IPA characters with no page errors.
- This is a live interaction check with the repository fixture, not the exact prior user-pasted passage if different, and not evidence of normative pronunciation accuracy.


## NIKL collector follow-up — 2026-10-21

- Added the executable metadata-first collector `scripts/nikl-norm-crawler.mjs`, manifest schema `schemas/nikl-source-manifest.schema.json`, Node fixture tests, Python schema-instance tests, `npm run crawl:nikl`, and a live source diagnostic for `research/nikl-*` branches.
- Fixture tests cover the 30-article inventory, section boundaries, exclusions, missing/duplicate/incomplete headings, script-contained fake markup, official URL allowlisting (including the allowlisted www host), robots decisions, provenance hashes, metadata-only defaults, explicit text-retention acknowledgement, and HTTP 403 classification. Exact implementation head `62432e384d8bd1c289d2910217aca17b82701981` passed Node tests 1,068/1,068, Vite build, Python 3.11–3.13, system verification, browser G2P, and master-table/corpus artifact checks: Node/Python matrix [39662932041](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39662932041), system verification [39662925804](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39662925804), browser G2P [39662932007](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39662932007), and corpus artifacts [39662932029](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39662932029). Final documentation-only commits still require exact-head rerun.
- Live source attempt from GitHub Actions: robots.txt returned 404; official article request returned HTTP 403. The workflow records this as BLOCKED and does not bypass the denial. No live inventory was generated. Source reuse terms remain unassessed.
- Coverage status is therefore PARTIAL/BLOCKED, not DONE_VERIFIED for the live official inventory. Next acceptance criteria: run from an environment where access is permitted; verify all 30 article headings and article structure; reconcile the official inventory against existing rule IDs, implementations, IPA path, and regressions; only then update coverage status.
- No production engine or public UI behavior was changed. The research layer remains a technically deployed prototype with independent IPA and Ukrainian target validation still outstanding.


## 2026-10-21 follow-up — NIKL surface evidence refresh

A fresh official-source review found exact NIKL Online Q&A attestations for six previously rule-derived cases: `넋이[넉씨]`, `몫이[목씨]`, `값이[갑씨]`, `국립[궁닙]`, `협력[혐녁]`, and `독립문[동님문]`. Exact question URLs, dates, scope, and integration state are registered individually in `research/SOURCE-REGISTER.csv`; the fixture and `docs/audits/SURFACE-REGRESSION-SOURCE-ADJUDICATION-2026-10-21.md` now point to those attestations.

The surface fixture has 17/18 directly attested Korean surface comparators; `숲이[수피]` remains rule-derived because it is not listed among the official §13 examples. Pinned JS-port `expectedSurface` values remain unchanged, and independently adjudicated IPA gold remains 0/18. Korean surface attestations do not validate IPA or Ukrainian target rendering.


### Source-reuse policy check — 2026-10-21

The official [NIKL copyright policy](https://www.korean.go.kr/front/nuri/pageView.do?mkn=3&page_id=P000189) states that materials provided on the NIKL website may be used under Korean Copyright Act Article 24-2 without separate permission unless a specific KOGL type is marked for an item. This resolves the previous absence of a site-wide policy source, but not the per-item condition: this pass did not establish the KOGL marking, if any, on the Standard Pronunciation Rules page or each cited Q&A page. The source register now records the policy and this caveat. Keep raw text retention disabled until item-level markings are checked; metadata/hash-only output remains the safe default.


## Completion audit refresh — NIKL source and surface evidence — 2026-10-21

- The official NIKL desktop full-text route is now canonical in the crawler, article-coverage fixture, audit references, and surface-regression fixture. A regression test rejects legacy mobile-route citations in the surface fixture.
- The surface fixture's direct-evidence inventory is 17/18. Fourteen directly matching surface rows now explicitly say that only the Hangul surface string matches the cited NIKL comparator. The three known practical-port/normative divergences remain unchanged. Independent IPA gold remains 0/18.
- Exact-head CI passed for PR #182: 1,071 Node tests, Vite build, and Python regression/data-integrity tests. PR #183 then passed 1,072 Node tests, Vite build, and Python regression/data-integrity tests. These tests establish repository regression integrity, not independent phonetic or Ukrainian target correctness.
- The NIKL copyright policy is located and cited, but item-level KOGL conditions remain unverified. Raw source-text retention remains disabled by default.
- Current disposition: DONE_VERIFIED for canonical citation integrity, the evidence-fixture provenance gate, collector argument/path safety, and listed CI runs. BLOCKED for direct official-page access (HTTP 403) and a fresh 30-article inventory. BLOCKED / specialist evidence for independent IPA gold and Ukrainian target adjudication. Do not mark the research system release-ready.


### Surface-only IPA boundary regression — 2026-10-21

The model-wide IPA-first regression now covers all seven `surface-only` lexical entries rather than excluding that path. Exact-head CI passed 1,073 Node tests, Vite build, and Python regression/data-integrity tests. This is an implementation/data-consistency check, not independent IPA or Ukrainian linguistic validation. See `docs/IPA-FIRST-TARGET-CONSISTENCY-AUDIT-2026-10-11.md` and the canonical handoff for exact evidence.


### Final surface comparator source reconciliation — 2026-10-21

A prior edit marked `숲이[수피]` as a direct §13 example, but a primary-source recheck showed that the official §13 enumerated examples do not include this word. That overclaim has been corrected: direct Korean surface evidence is **17/18**, and `숲이` remains rule-derived pending exact lexical attestation. Independently adjudicated IPA remains **0/18**, and this update does not validate Ukrainian target choices.


### Evidence correction — 2026-10-21

The current official NIKL page was re-opened and its §13 examples inspected directly. The list does not include `숲이[수피]`; the earlier claim of a direct example was too strong. The machine-readable fixture and evidence gate are corrected to 17 direct cases and one rule-derived case. This is a provenance correction only; practical output remains unchanged.


### Final direct-attestation gate and post-merge verification — 2026-10-21

PR #187 merged as `171a1ac013fd09bb04c5f25d705a80706f3d4b89`. Its exact PR head passed 1,074 Node tests, Vite build, and Python regression/data-integrity tests. The post-merge mainline system verification, Node/Python matrix, and corpus artifact workflows also passed; links are in the canonical master handoff.

The evidence audit was deliberately corrected after reopening the official NIKL §13 page: its enumerated examples do not include `숲이[수피]`. This case remains rule-derived, not directly attested. The evidence gate is **17/18 direct Korean surface comparators**, while independently adjudicated IPA gold remains **0/18**. The public practical output was not changed by the evidence correction.

The skills now require exact source-span inspection before any direct-attestation label and reject rule-derived inference or secondary snippets as direct evidence. Live automated article collection remains blocked by HTTP 403; the local HTML import path preserves honest provenance but has not yet produced a real 30-article manifest. Item-level reuse conditions, independent IPA, and Ukrainian target validation remain unresolved.


### Post-merge deployment smoke after evidence-gate update — 2026-10-21

Main commit `171a1ac013fd09bb04c5f25d705a80706f3d4b89` passed Pages deployment, public HTTP smoke for `index.html`, `system.html`, and the first JavaScript asset, and live Chromium practical-mode smoke. The adversarial fixture contained 1,443 Korean input characters and produced 2,782 Ukrainian output characters plus 3,731 IPA characters with no page errors. Evidence: [deployment and live browser smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39673643136). This verifies deployment and interaction plumbing, not pronunciation accuracy or IPA gold.


### NIKL formal-morpheme boundary evidence extension — 2026-10-21

A primary-source search found two additional official NIKL Q&A attestations: `숲을[수플]` (qna_seq=332248) and `숲에[수페]` (qna_seq=331304; `[숩페]` explicitly rejected). Added both to `tests/fixtures/g2pk-surface-regression.json`, source register, port parity gate, and normative evidence test. The fixed surface fixture now contains 20 cases: **19 direct Korean surface comparators + 1 rule-derived case** (`숲이`). IPA gold remains **0/20 independently adjudicated**. Exact-head CI at `0e0b96080335fec8fe04e7bd9d302d7b1e8a2183` verified the two new JavaScript-port outputs; **1,074/1,074 Node tests**, Vite build, Python regression/data-integrity checks, and corpus artifact checks passed. This batch is `DONE_VERIFIED` for fixture/source consistency and runtime parity only, not IPA or Ukrainian linguistic correctness. No production output was intentionally changed.


### Independent IPA adjudication queue — 2026-10-21

Added `research/ipa-adjudication-queue.json` and `tests/ipa-adjudication-queue.test.mjs`. The queue mirrors the 20-case NIKL surface fixture and preserves exact source provenance, but intentionally supplies no candidate/final IPA and no reviewer identities. Its gate ensures unresolved cases cannot be mislabeled as adjudicated and that Ukrainian target review stays separate. This makes the next specialist task explicit and auditable; it does not create IPA gold. The exact implementation head `9b8eb59caad60afc7637a8feb95b60112f78d170` passed **1,077/1,077 Node tests**, Vite build, Python 3.11/3.12/3.13 regression/data-integrity checks, and corpus artifact validation. Status is `DONE_VERIFIED` for queue/fixture/provenance integrity and `BLOCKED_SPECIALIST_ADJUDICATION` for the actual IPA judgments: **0/20 independently adjudicated IPA cases**.


### Post-merge state — IPA queue and morphology controls — 2026-10-21

PR #189 merged as `f6a6f29aed2a07e42116044d26d4745e1d7fcf01`; PR #190 merged as `b4ed747417bbc19c797c08fad7592818b8b61649`. Post-merge mainline system verification, Python/Node matrix, and master-table/corpus validation passed for the latter commit (runs 39675451462, 39675451429, 39675451417). The 20-case surface fixture has 19 direct NIKL surface attestations and one rule-derived case (`숲이`). The IPA adjudication queue is mechanically verified, but **IPA gold remains 0/20** because no independent specialist judgments have been supplied. Live 30-article NIKL collection remains blocked by HTTP 403; item-level KOGL markings and independent Ukrainian target review remain unresolved. Pages deployment and live browser smoke subsequently passed in run 39675451395: `index.html`, `system.html`, and the first JavaScript asset passed HTTP checks; live practical mode processed the 1,443-character adversarial Korean fixture and produced 2,782 Ukrainian output characters plus 3,731 IPA characters with no reported page errors. This confirms deployed interaction plumbing only, not scientific transcription accuracy.


## IPA queue resolution gate — 2026-10-22

- Branch: `research/ipa-queue-adjudication-gate-2026-10-22`, based on main `aedfa30707fa00038a20b60c16d523cc01be6166`.
- Updated `research/ipa-adjudication-queue.json` to schema version 2. Reviewer records now reserve explicit qualification, review timestamp, and method/reference fields rather than only an ID/IPA/notes tuple.
- Updated `tests/ipa-adjudication-queue.test.mjs` so the gate remains fail-closed for all 20 current unresolved cases, but also defines the acceptance contract for future real resolutions: two distinct traceable reviewers, parseable timestamps, method references, explicit syllable boundaries, a non-unresolved vowel-length decision, final IPA, and reconciliation notes. The test also rejects duplicate IDs, partial reviewer records on blocked cases, and attempts to attach a candidate IPA while status remains blocked.
- A synthetic sentinel record exercises the future-resolved branch of the validator; it is explicitly test-only and is not Korean IPA data. The actual 20 queue entries remain unchanged scientifically: candidate IPA is null, both reviewer records are empty, final IPA is null, and every case remains `BLOCKED_SPECIALIST_ADJUDICATION`.
- Acceptance status: `DONE_VERIFIED` when the PR-head Node/Python/build and artifact CI completes. Scientific status remains `BLOCKED_SPECIALIST_ADJUDICATION`: 0/20 independent IPA-gold judgments; Ukrainian target-layer review is separate. This change makes a future expert batch easier to record without weakening evidence requirements or pretending that the missing expert work has been done.


## Consolidated continuation closeout — 2026-10-22

- Verified mainline implementation baseline before this handoff refresh: `32ad31aba0a539db788ff6fb57377fec48819490` (`Test lexical IPA length-feature coverage`). No open PRs remained at the time of inspection.
- **PR #192** merged as `aba741c33283f24a91f5eef63900762a6108afa5`: IPA queue schema v2 adds reviewer qualification, timestamp, and method-reference fields; the gate supports a future adjudicated state only when two distinct, traceable reviews, explicit syllabification/length decision, final IPA, and reconciliation notes exist. The real 20 cases remain blocked and blank. Exact-head CI passed 1,078 Node tests, Vite build, and Python 3.11/3.12/3.13 checks.
- **PR #193** merged as `41ff6ee861090530ce1ee81d745115fa8042abf2`: corrected the public README's stale 18-case/0-of-18 count to 20 cases, 19 direct official surface attestations, one rule-derived case (`숲이`), and 0/20 independent IPA gold. Added a regression to prevent this documentation drift. Exact-head CI passed 1,079 Node tests, Vite build, and Python regression/data-integrity checks.
- **PR #194** merged as `533af9ec531d5bcdf1a1b3eb0eb2ff7e1b52ec1c`: IPA trace now records each `ː` as an explicit feature omitted from Ukrainian practical spelling, with source offset and a user-facing explanation. Original IPA and Ukrainian output remain unchanged. Exact-head CI passed 1,081 Node tests, Vite build, and Python regression/data-integrity checks.
- **PR #195** merged as `32ad31aba0a539db788ff6fb57377fec48819490`: added inventory-wide coverage asserting every `ː` marker in the current lexical IPA dataset receives explicit trace handling. Exact-head CI passed 1,082/1,082 Node tests, Vite build, Python regression/data-integrity checks, and master-table/corpus artifact validation.
- Post-merge mainline verification for `32ad31aba0a539db788ff6fb57377fec48819490`: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39677731622), [test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39677731647), [master-table/corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39677731653), and [GitHub Pages deploy + live browser smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39677731676) all passed. Public `index.html`, `system.html`, and the first JavaScript asset returned successfully; live browser smoke processed the 1,443-character adversarial Korean fixture and produced 2,782 Ukrainian output characters and 3,731 IPA characters without reported page errors. This verifies deployment and interaction, not scientific accuracy.
- **Task ledger:** `DONE_VERIFIED` — queue state-transition acceptance gate; README count synchronization; explicit IPA length-feature trace; inventory-wide length-mark trace coverage; 1,082 Node tests; Vite build; Python 3.11/3.12/3.13; corpus/master-table validation; Pages deployment and browser smoke. `BLOCKED` — direct NIKL collector fetch returns HTTP 403 in GitHub Actions; the local HTML import path exists, but no authorized local HTML snapshot has been supplied and no live manifest is claimed. `BLOCKED / specialist evidence` — independent IPA gold remains **0/20** and independent Ukrainian target-layer review remains outstanding. `BLOCKED / rights evidence` — exact item-level KOGL markings for the rules page and Q&A sources remain unverified. `BLOCKED / lexical evidence` — `숲이` remains rule-derived, not a direct lexical attestation. Root project license metadata remains an owner decision.
- **Release disposition:** deployed research preview, not scientifically validated or release-ready. Do not promote the queue or trace improvements as evidence of pronunciation correctness. Next genuine acceptance work requires (1) authorized acquisition/reconciliation of the 30-article NIKL page and item-level reuse checks, (2) two independent qualified broad-IPA reviews per queue case with source/method records, and (3) independent Ukrainian target review. Preserve the practical g2pK port contract and do not change public output merely to match the normative research comparator.


### Official-source evidence and reuse-policy check — 2026-10-22

The official Standard Pronunciation Rules page was reviewed in the public web source view. The extracted page includes the full second part; §§13–15 were checked directly. The page lists representative liaison examples including `넋이[넉씨]`, `곬이[골씨]`, `값을[갑쓸]`, and §15 `값어치[가버치]`, but does not explicitly list `숲이[수피]` in §13. Therefore `숲이` remains rule-derived, not direct lexical evidence. See [official page](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002).

The official [copyright policy](https://www.korean.go.kr/front/nuri/pageView.do?mkn=3&page_id=P000189) says NIKL-owned website materials are reusable under Korean Copyright Act Article 24-2 unless an item-specific KOGL type is displayed; any such type's conditions must be followed. The source register now contains `SRC-NIKL-COPYRIGHT-POLICY`. This general policy does not prove the page-specific mark for the rules page or each Q&A. No visual page-specific mark was verified, so the individual-source rights blocker remains.

This web source view is not a locally acquired HTML snapshot and does not satisfy the crawler's provenance manifest gate. The CI direct HTTP 403 remains a blocker; no live manifest is claimed. At the latest observed mainline `5c6875bb4b3d540ccb8bf085047bb71c0bb14121`, Node passed 1,082/1,082, the Python matrix and Vite build passed, master-table/corpus checks passed, and the Pages browser smoke passed. Those checks establish software/deployment integrity, not independent IPA or Ukrainian target correctness. Current scientific blockers remain 0/20 independent IPA-gold judgments and outstanding Ukrainian target review.


The policy URL was normalized to the exact registered official route on 2026-10-22: https://www.korean.go.kr/front/nuri/pageView.do?mkn=3&page_id=P000189. The page's policy statement and KOGL type descriptions were directly checked; item-level clearance of the pronunciation rules page and Q&A sources remains unverified.


### Current mainline verification — 2026-10-22

Main at `858ea7ad2e08babed2ce4cf441d22f46de94f34b` passes system verification, the Node/Python matrix, generated master-table/corpus validation, and GitHub Pages deployment with live Chromium smoke. Evidence: [system](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39679386102), [test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39679386107), [artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39679386124), and [deployment/browser smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39679386111). The Node suite reports 1,082/1,082; Python 3.11/3.12/3.13 pass; the 11,172-row modern Hangul validation reports zero failures/warnings; live browser smoke processes the adversarial 1,443-character fixture without page errors. These checks do not validate broad IPA or Ukrainian target decisions.

New Python tests validate source-register column integrity, unique IDs, the canonical NIKL source URL, explicit live-access blocking, and the distinction between general reuse policy and page-level KOGL clearance. The Python differential diagnostic remains 18/20 matching and 2/20 divergent (`넓죽하다`, `읽고`); it is diagnostic only and does not adjudicate IPA. Preserve the practical JS port contract until evidence-backed reconciliation is approved.

The actual scientific blockers remain unchanged: no live NIKL manifest because CI direct fetch receives HTTP 403; no authorized local HTML snapshot yet supplied; page-level reuse marks remain unverified; independent IPA gold is 0/20; Ukrainian target review remains outstanding. Status is still **deployed research preview, not release-ready**.


### Direct primary-rule attestation for 읽고 — 2026-10-22

The official NIKL Standard Pronunciation Rules §1 commentary explicitly gives `읽고[일꼬]` while discussing the verbal-stem ㄺ + ㄱ environment. The surface fixture and IPA queue now cite that canonical rules page as `direct-NIKL-example`, rather than relying only on the NIKL Q&A URL. The browser practical-port output `익꼬` is intentionally unchanged and remains a known normative divergence. This upgrades the evidence locator for the Korean surface only; it does not supply broad IPA, resolve the 0/20 independent IPA-gold queue, or validate Ukrainian target choices.


### Official ㄺ exception contrast and port divergence — 2026-10-22

The official NIKL Q&A `qna_seq=321743` contrasts `칡과[칙꽈]` with `읽고[일꼬]`, confirming that the verbal-stem ㄺ + ㄱ exception must not be generalized to every ㄺ-final word. The fixed fixture now explicitly labels the pinned JavaScript-port divergences `넓죽하다: 널쭈카다 ≠ 넙쭈카다` and `읽고: 익꼬 ≠ 일꼬`. The new regression verifies the source register and evidence labels without changing production output.

Status: `DONE_VERIFIED` for provenance/differential bookkeeping after CI; `BLOCKED_SPECIALIST_ADJUDICATION` for all 20 IPA cases; `BLOCKED / rights` for Q&A item-level KOGL marking. Korean Hangul surface evidence is not IPA gold or Ukrainian-target validation.


### NIKL manifest provenance and media-type schema hardening — 2026-10-22

PR #200 added conditional schema invariants and negative tests so a manifest cannot misrepresent a local HTML import as a live HTTP fetch or vice versa; exact-head CI passed. Follow-up PR #202 merged as `55fede8fbeccbc5ada13daea19166bf2f897cc98`, correcting the over-escaped, unanchored content-type regex and adding positive XHTML/local-file cases plus a negative near-miss. Exact-head CI passed **1,084/1,084 Node tests**, Vite build, Python 3.11/3.12/3.13, corpus/master-table checks, and system verification.

Status: `DONE_VERIFIED` for PR #200's provenance invariants and PR #202's media-type correction. Neither change claims that NIKL direct crawling succeeded; the live source blocker remains HTTP 403 and the item-level reuse-mark blocker remains open.


### Robots parser policy matching — 2026-10-22

The NIKL collector now honors the most-specific matching user-agent group, treats wildcard groups as fallback, supports wildcard path segments and terminal anchors, and resolves equal-specificity rules with Allow precedence. Focused regression tests and corresponding guide/skill updates were added. This is policy-correctness hardening only; it does not bypass HTTP 403 or imply a successful crawl.

PR #203 merged as `beba8449fb4aea2e3c6b7398f75d21702e602133`. Exact-head CI at `b5db9f70f6a1fded765bc2407b366b4920722a67` passed **1,087/1,087 Node tests**, Vite build, Python regression/data-integrity, corpus/master-table validation, and system verification. The parser hardening is `DONE_VERIFIED`; live NIKL access remains blocked by HTTP 403.


### Live NIKL access recheck after crawler hardening — 2026-10-22

Exact-head workflow [39761906127](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39761906127) on `f477363b321b5f9d1cb5727d0f01fa41f61bc4b1` again received HTTP 403 from the canonical official rules page. The workflow correctly classified source access as `BLOCKED`, retained a small log artifact, and did not generate an accepted 30-article manifest. Regression/build/Python/system checks passed (Node **1,087/1,087**). No bypass was attempted. The collector's local HTML import remains the safe path if an authorized human can save the official page through ordinary browser access.


## NIKL source-scope and evidence-registry completion — 2026-10-22

- **PR #205** merged as `0bbedc7e6f9d7a712504983ef2e582a10d13a64f`: normalized the stale copyright-policy URL in `SRC-NIKL-PRON` to the verified official policy route `https://www.korean.go.kr/front/nuri/pageView.do?mkn=3&page_id=P000189` and pinned that exact URL in the source-register integrity test. This does not establish item-level KOGL clearance.
- **PR #206** merged as `e81a18878d6c80365e1f0bf615bfd910c65931ed`: the crawler now accepts only the official desktop Standard Pronunciation Rules endpoint or its legacy mobile counterpart, and requires exactly one `regltn_code=0002` query parameter. Unrelated norms pages, wrong regulation IDs, and duplicate rule-code parameters are rejected. The guide and crawler skill match the implemented scope. Exact-head CI passed Node/Python/build, system verification, and master-table/corpus validation.
- **PR #207** merged as `e33cba1cc8bfb143b320bcc4cfd4e3ff7937a7a6`: registered the two official sources previously missing from the 20-case IPA queue/surface fixture (`qna_seq=306000` for the explanatory `읽는 → 잉는` example, and FAQ `mcfaq_seq=5949` for `값어치[가버치]`). A regression now requires every unique normative URL in both machine-readable artifacts to exist in `research/SOURCE-REGISTER.csv`. The `읽는` locator explicitly says its Q&A is about spelling, not a direct pronunciation question; no broader rule inference was added.
- Exact PR-head verification: **1,087/1,087 Node tests**, Vite build, Python regression/data-integrity tests, system verification, and master-table/corpus artifact checks passed. Evidence for PR #207: [system](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39765619176), [test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39765619134), [artifact checks](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39765619138). Post-merge CI on `e33cba1cc8bfb143b320bcc4cfd4e3ff7937a7a6` is running separately.
- **Task ledger:** `DONE_VERIFIED` — exact NIKL copyright-policy URL synchronization; crawler source-scope guard and negative tests; documentation/skill alignment; complete registration of all 11 unique normative URLs referenced by the 20-case queue and surface fixture; source-specific scope note for `읽는`. `BLOCKED` — direct live fetch of the official rules page returns HTTP 403 from GitHub Actions, so no valid 30-article manifest exists; no authorized local HTML snapshot has been supplied. `BLOCKED / rights` — item-level KOGL marking for the rules page and individual Q&A/FAQ sources remains unverified. `BLOCKED_SPECIALIST_ADJUDICATION` — independent IPA gold remains **0/20** and independent Ukrainian target review remains outstanding.
- **Release disposition unchanged:** deployed research preview, not scientifically validated/release-ready. No production transcription logic or public UI changed in these three PRs.


## Lexical citation inventory and source-claim scope correction — 2026-10-22

- **PR #208** inventories the external citation identities used by `data/korean/lexical_pronunciations.csv`. The file has **642 lexical rows and 63 stable cited source identities**; only three identities were previously represented in `research/SOURCE-REGISTER.csv`. Added **60 individual records** for the missing NIKL Q&A/FAQ, Korean Basic Dictionary, and NIKL-hosted document citations.
- These 60 records are deliberately marked `unverified_lexical_citation_inventory_2026-10-22` / `lexical_csv_citation_only`. They record traceable URLs and linked lexical forms; they do **not** claim that page titles, dates, content, claim support, or reuse rights have been independently verified. A stable-identity regression covers the lexical CSV and source register, normalizing Q&A/FAQ IDs, dictionary IDs by language, NIKL download identities, and the Standard Pronunciation Rules ID.
- Corrected the lexical notes for `읽는` and `읽지`: NIKL Q&A `qna_seq=306000` is about orthography, not a direct pronunciation question. Its explanatory discussion uses `읽는 → 잉는` and `읽지 → 익찌` as illustrative pronunciation sequences. The source-register record now captures both examples and limits the evidence claim accordingly.
- Structural inventory check: **63/63** lexical source identities registered, **0 missing**, **0 duplicate source IDs**; the new 60 rows remain explicitly unverified until page-by-page review.
- Exact PR-head verification at `f16b77282928235e6309bb734284b1e4945bdca5`: **1,087/1,087 Node tests**, Vite build, Python 3.11/3.12/3.13 regression/data-integrity suites, master-table/corpus validation, and system verification passed. Evidence: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39766141574), [test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39766141389), [artifact checks](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39766141263).
- **Task ledger:** `DONE_VERIFIED` — citation identity coverage and regression, unverified-status guard, and narrower claim language for `읽는/읽지`. `TODO / evidence-limited` — inspect the 60 newly inventoried pages and verify exact source spans, dates, claim support, and item-level rights before upgrading any entry from citation-only. `BLOCKED` — live 30-article rules crawl still returns HTTP 403 in GitHub Actions and no authorized local HTML snapshot is available. `BLOCKED_SPECIALIST_ADJUDICATION` — broad IPA gold remains 0/20 and independent Ukrainian target review remains outstanding.
- **Release disposition unchanged:** deployed research preview, not scientifically validated/release-ready. This batch changes evidence bookkeeping and lexical source-note accuracy, not the transcription engine or public UI.


## Priority lexical-source content review — 2026-10-22

- Opened and checked three of the 60 newly inventoried lexical source pages against their exact listed examples; their records are no longer marked citation-only:
  - `SRC-NIKL-QNA-313851`, **구개음화** (question 2025-04-25; answer 2025-04-28): the official answer reproduces §17 and directly lists `곧이듣다[고지듣따]`, `미닫이[미ː다지]`, `땀받이[땀바지]`, `벼훑이[벼훌치]`, `굳히다[구치다]`, `닫히다[다치다]`, and `묻히다[무치다]`. This is direct Korean surface attestation for those examples only.
  - `SRC-NIKL-QNA-323289`, **너르다/넓다** (question 2025-11-05; answer 2025-11-06): the answer embeds the dictionary pronunciation list `넓어[널버]`, `넓으니[널브니]`, `넓고[널꼬]`, `넓지[널찌]`. This is **partial** evidence for the lexical CSV: `넓은`, `넓어져`, and `넓어서` are not directly listed as bracketed pronunciations and must remain rule-derived pending their own evidence.
  - `SRC-NIKL-QNA-309950`, **품삯의 표준 발음** (question 2025-02-08; answer 2025-02-11): the official answer directly gives `품삯을[품싹쓸]`, `품삯으로[품싹쓰로]`, and `품삯이[품싹씨]`, and cites §14.
- Added regression assertions for direct versus partial coverage. Item-level KOGL marking remains unverified; this review does not adjudicate IPA or Ukrainian target forms.
- Current source-record state: **63/63 citation identities registered; 3 of the 60 newly inventoried pages reviewed (2 direct, 1 partial); 57 remain explicitly unverified**.
- **Task ledger:** `DONE_VERIFIED` — exact examples and source dates above; direct/partial scope tests. `TODO / evidence-limited` — audit the remaining 57 citation-only records, starting with the pages supporting the most lexical forms. `BLOCKED` — live rules crawl still returns HTTP 403 from GitHub Actions; no authorized local HTML snapshot supplied. `BLOCKED_SPECIALIST_ADJUDICATION` — independent broad IPA gold remains 0/20 and Ukrainian target review remains outstanding.


## End-to-end checkpoint after lexical-source review — 2026-10-22

- Verified implementation baseline before this handoff checkpoint: `main` at `2581247e4ee3d8b3578b643bce32089e8eacc204`, following merged PRs #205–#209.
- Post-merge CI on that baseline passed: **1,087/1,087 Node tests**, Vite build, Python 3.11/3.12/3.13 regression/data-integrity suites, master-table/research-corpus validation, and system verification. GitHub Pages deployment, public-page smoke tests, and the adversarial Korean practical-mode browser smoke test also passed. Evidence: [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39766775058), [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39766775109), [corpus/master table](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39766775131), [deployment and live browser smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39766775106).
- The live source-inventory job is not marked passed by those general workflows; it was skipped because this was not a `research/nikl-*` branch. The dedicated exact-head crawl remains the authoritative access result: [run 39761906127](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39761906127) returned HTTP 403, recorded `BLOCKED`, and emitted no valid 30-article manifest.
- Evidence inventory state: **98 source-register records**, **63/63 stable identities** cited by the 642-row lexical dataset registered, **3 of 60** new lexical citations content-checked (2 direct, 1 partial), **57 still citation-only/unverified**. The 20-case IPA queue remains **0/20 independently adjudicated**.
- Final task ledger:
  - `DONE_VERIFIED`: NIKL collector URL scope and robots semantics; metadata/local-import provenance schema and tests; citation identity coverage for lexical data, IPA queue, and surface fixture; source-scope correction for the `읽는/읽지` orthography Q&A; three priority source reviews; full regression/build/corpus checks; successful deployment smoke test.
  - `TODO / evidence-limited`: review the remaining 57 cited pages against exact lexical forms, titles/dates, source spans, rule context, and item-level reuse notices; then update each source row and its lexical claims only when directly supported.
  - `BLOCKED`: live full-text crawl of the official 30-article rules page returns HTTP 403 in GitHub Actions. Acceptance criterion: direct authorized access succeeds, or a human supplies an HTML file saved through normal browser use; then the collector must reconcile all 30 articles with non-empty content. No bypass is permitted.
  - `BLOCKED / rights`: item-level KOGL status for the rules page and each source page has not been fully verified. Acceptance criterion: inspect the actual page-specific mark and record conditions before retaining/redistributing text.
  - `BLOCKED_SPECIALIST_ADJUDICATION`: independent broad IPA remains 0/20; Ukrainian target review remains outstanding. Acceptance criterion: qualified independent reviewers provide inspectable IPA with syllable/tone/length/uncertainty metadata, reconcile disagreements, and review Ukrainian adaptation from that IPA.
- **Release status:** the public site is deployed and its practical-mode browser smoke test passes, but the repository remains a research preview/prototype, not scientifically validated or release-ready. These recent changes did not alter practical-mode output; CI success is software verification, not linguistic gold.


## Batch 14: exact official dictionary evidence — 2026-10-22

- Reviewed official Korean-English Learners' Dictionary entries `ParaWordNo=66031` (맑다), `89859` (얇다), and `64509` (넣다).
- Exact attestation: `맑은[말근]` and `얇은[얄븐]` appear in their cited dictionary paradigms. The `맑은` lexical row now points to the exact dictionary entry.
- Partial attestation: the `넣다` entry gives the lemma and selected application forms but does not list `넣었다`; `넣었다` remains explicitly rule-derived. Likewise, `맑을` is not listed in the `맑다` page and remains rule-derived.
- Added a dedicated review note and test file asserting exact URLs, source identity uniqueness, direct-vs-partial classification, and the rule that dictionary Hangul notation is not IPA.
- Source-review inventory now stands at **6/60** newly inventoried pages content-checked: **4 direct, 2 partial, 54 still citation-only/unverified**. Item-level KOGL marking remains unverified for all three pages.
- `DONE_VERIFIED`: exact content check, source-register scope correction, `맑은` citation correction, regression assertions. `PARTIAL`: rule-derived `맑을` and `넣었다`. `BLOCKED / rights`: page-level reuse marking. `BLOCKED_SPECIALIST_ADJUDICATION`: independent broad IPA and Ukrainian target review.
- No production engine or UI changes. Release status remains research preview/prototype, not scientifically validated.
