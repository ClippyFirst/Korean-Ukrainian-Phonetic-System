## Final follow-up — 2026-11-27 — explicit rule-sequence semantics

**Latest code head:** `a4aa821b1cc16b1fa755a34f3d2c89e624538401` on `feat/kozak-kim-extended-ipa-2026-11-26`; PR #509 remains Draft/Open/Unmerged.

- Fixed a subtle API bug: `rule_ids=[]` previously fell through to the default canonical rule list because the implementation used truthiness. The runtime now defaults only when `rule_ids is None`; any explicit iterable is preserved as a tuple, including an empty sequence.
- Added regression: `apply_ordered_rules(parse_syllables("낫"), [])` leaves the written coda unchanged and returns no rule traces.
- Exact-head verification on documentation head `4d990e53adc0d3064d917885de626860a804bed5`: [Tests 45905500937](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45905500937) PASS (full Python suite on 3.11/3.12/3.13, wheel install, web tests); [System Verify 45905500843](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45905500843) PASS (Python regression/data integrity and browser regression/build); [Master/research artifacts 45905501058](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45905501058) PASS. Additional exact-head diagnostics: Browser G2P 45905500860 PASS; external UGTPHON 45905500854 PASS; morphology consensus 45905500841 PASS; test-register extraction 45905500831 PASS; teacher split audit 45905500993 PASS; optional g2pK 45905500952 PASS; research morphology smoke 45905500851 PASS; editorial review 45905500835 PASS. NIKL metadata-only inventory was SKIPPED by policy.
- NIKL metadata-only inventory was SKIPPED by policy. This is not a source-validation pass.
- Multi-engine benchmark [45905265901](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45905265901) was still executing on code head `a4aa821b`; the corresponding run on the documentation head was queued as [45905500866](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45905500866) at the time of this record. No multi-engine result is claimed until that workflow completes.
- Python regression emits a diagnostic warning documenting two pre-existing Python/browser-port divergences: `넓죽하다` and `읽고`. The Python native engine agrees with g2pk and the recorded NIKL practical adapter on these cases; the raw browser JS port differs. IPA gold is not independently adjudicated. This remains a browser/Python parity TODO, not silently fixed here.
- Paired native-vs-g2pk diagnostic [45905500815](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45905500815), run on code head `a4aa821b` (the same runtime code as the current docs head), used 275 UGTPHON Korean test sentences and 2,702 paired tokens: native 1,425/2,702 exact (52.7387%), CER 0.090130; g2pk 1,435/2,703 exact (53.0892%), CER 0.092328. On the paired subset, g2pk exact rate is +0.003701 but CER is +0.002207 (worse). Diagnostic only; no rule selection or accuracy claim follows.
- Charsiu inference remained SKIPPED by the workflow condition: the workflow runs only on manual dispatch or when the PR has the `enhancement` label. No label was added and no model inference was claimed. Existing teacher candidate records remain hypotheses; no teacher-derived production rule was added.
- No local pytest/npm/build was run: local clone had previously failed because this runtime could not resolve github.com. GitHub Actions provides the exact-head verification evidence.
- No PR was merged, no branch deleted, no force-push, release or deployment occurred.

**Disposition:** deterministic rule-plan and API semantics are software-verified; overall Korean phonology remains a research prototype. Open work: typed segment-level IPA IR; full browser/Python shared analysis/parity; independent layer-matched phonetic gold; independently reviewed Ukrainian target correspondences; source-adjudicated new rule candidates. The core runtime remains neural-free.



**Benchmark status update — 2026-11-27 22:27Z:** the earlier pending multi-engine run 45904119230 was superseded/cancelled by the workflow's PR concurrency queue. The latest run for the docs checkpoint, [45904848908](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904848908), is still PENDING with no jobs started. It is not a pass and no new benchmark score is claimed.
## Execution continuation — 2026-11-27 — deterministic model-free rule engine

**Status: DONE_VERIFIED for the implemented software increments; overall engine remains a research prototype.**  
**Main baseline:** `97bb411df8b998b22cd58adda015fb941201950c`.  
**Working branch:** `feat/kozak-kim-extended-ipa-2026-11-26`, based on main and reused from the existing dedicated PR workstream.  
**Starting branch head:** `0c1cd8ef2a36f4654a7722058254964e00a49303`.  
**Verified code head:** `53a13c43954d700e3676c9c651bf0d6a7032d084`.  
**PR:** [#509](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/509), still Draft/Open/Unmerged.

### Owner-approved runtime contract

- The shipped pronunciation engine contains no neural network, inference, weights, embeddings, model API, sampling, or probability-based runtime ranking.
- The core package has no required runtime dependencies; an AST regression guard checks the main runtime modules for ML-inference imports.
- Neural teacher outputs may be studied offline as research evidence only. Candidate patterns are not production rules until manually reviewed against primary linguistic evidence and independent controls.
- No rule or IPA/UA mapping was promoted from neural-teacher outputs in this continuation.

### Implemented work

1. Added an immutable, standard-library-only rule execution plan that validates `rules.csv` against `rule_ordering.csv`. It rejects missing/unknown/duplicate IDs, duplicate or invalid preferred positions, and malformed required columns; blank CSV rows are ignored. There is no hard-coded fallback order.
2. Replaced the duplicate Python default rule list with the validated canonical CSV order. Explicit diagnostic rule sequences retain caller-supplied order.
3. Added wheel-install smoke coverage proving the canonical plan and runtime trace are available after package installation, not only from a source checkout.
4. Added model-free runtime dependency/import regression tests.
5. Improved the offline teacher-pattern miner: it attributes teacher/strict disagreements to context pairs only when explicit dot-delimited IPA syllables align one-to-one with Hangul syllables and word boundaries. Unaligned rows remain visible but are excluded from context-level candidate rates. The report schema is now 1.1. Candidate mining remains association-only and never auto-generates or promotes runtime rules.

### Task ledger

| Work item | Status | Evidence / acceptance |
|---|---|---|
| Canonical rule catalogue/order validation | DONE_VERIFIED | Full Python suite; invalid, missing, unknown, duplicate and order cases tested |
| Runtime default order sourced from canonical CSV | DONE_VERIFIED | Runtime trace order test; explicit override order test |
| Installed wheel carries and resolves rule data | DONE_VERIFIED | Wheel-install smoke PASS |
| Core runtime has no ML inference dependency/import | DONE_VERIFIED | pyproject dependency guard and runtime AST import guard PASS |
| Offline teacher pattern alignment | DONE_VERIFIED | RED test observed before implementation; aligned/unaligned/multi-eojeol tests PASS |
| New teacher-derived production rules | DEFERRED | Charsiu workflow skipped by policy; no model outputs were available; source adjudication still required |
| Typed segment-level IPA IR and Python/browser shared contract | TODO | Implement shared segment records and remove divergent browser-side phonemic adapter; preserve IPA-first target consumption |
| Independent Narrow IPA gold and Ukrainian target validation | BLOCKED | Requires qualified independent adjudication and compatible licensed evidence |

### Exact-head verification

- Tests / Python 3.11, 3.12, 3.13 / wheel install / web tests and build: PASS — [run 45904119310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119310).
- System Verify: PASS — [run 45904119391](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119391).
- Browser G2P integration: PASS — [run 45904119145](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119145).
- Master/research artifacts: PASS — [run 45904119237](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119237).
- Exhaustive test-case register: PASS — [run 45904119295](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119295).
- External UGTPHON diagnostic: PASS — [run 45904119312](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119312).
- Optional g2pK integration: PASS — [run 45904119357](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119357).
- Paired native/g2pk diagnostic: PASS — [run 45904119438](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119438).
- Korean morphology-consensus diagnostic: PASS — [run 45904119286](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119286).
- Research morphology adapter smoke: PASS — [run 45904119195](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119195).
- Teacher corpus split audit: PASS — [run 45904119233](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119233).
- Editorial visual review (no UI files changed): PASS — [run 45904119692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119692).
- Charsiu train/dev model-inference rule-review workflow: SKIPPED by its existing policy gate — [run 45904119457](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119457); no teacher outputs were available or used.
- Multi-engine IPA benchmark: PENDING with no jobs started at audit time — [run 45904119230](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/45904119230). No benchmark improvement is claimed.
- Local clone and local pytest/npm were unavailable: git clone failed because this runtime could not resolve github.com. GitHub Actions supplied the executable verification evidence.

### Debugging record and scope

- The first TDD run failed because the new module/API did not yet exist; this was the expected RED state.
- An intermediate run exposed two test-contract issues: an empty ordering file was rejected before the missing-rule diagnostic, and an unknown-ID fixture simultaneously contained a missing rule. The loader was corrected to validate the intended incomplete-order case, and the fixture was isolated so each invariant is tested independently.
- The pattern-miner tests then failed before implementation because syllable-alignment metadata did not exist; the implementation added conservative alignment and fail-closed exclusion.
- No phonological rewrite semantics, rule contents, Ukrainian target correspondences, practical g2pK baseline, vendor files, UI or deployment settings were changed.
- No PR was merged, no branch deleted, no force-push and no release/deployment were performed.
- Other previously reviewed PRs #505, #506 and #507 remain untouched because their scopes overlap or are independent of this continuation.

**Readiness:** software-verified deterministic rule-execution increment; not release-ready or independently research-certified. The next real blocker is the absence of reviewed teacher-pattern outputs and typed shared IPA analysis—not a need to embed a neural model in the runtime.

---

## Execution continuation — 2026-11-12 — result/mode metadata visual cleanup

**Status: DONE_VERIFIED on PR head; merge pending. Branch `design/result-mode-status-typography-2026-11-12`.**

- **Starting main:** `6767d6e163b9eda32ac8cac41511dcd88d12b38c`; no open PRs existed at inspection.
- **Finding:** the IPA provenance line was a dense concatenation and had a top divider; the Ukrainian target-status line inherited right alignment. Practical mode was not named explicitly in the pronunciation provenance. Both therefore looked like disconnected technical notices rather than a coordinated explanation of which mode ran and what kind of result is shown.
- **Implementation:** split pronunciation metadata into labelled mode/engine/status and optional coverage rows; explicitly name “Звичайний режим” or “Дослідницький режим · [рівень]”; give the Ukrainian target note its own labelled status value. Use borderless, background-free, left-aligned metadata rows with wrapping. Keep each note beside its corresponding output.
- **Files:** `index.html`, `src/main.js`, `src/styles/main.css`, `src/styles/editorial.css`, `tests/web-ui-contract.test.mjs`, `scripts/capture-editorial-review.mjs`, this handoff and `docs/audits/UX-UI-AUDIT-2026-10-28.md`.
- **Result-state accuracy:** if Super-soft fallback confidence is low but there is no Ukrainian candidate text, the note says the record is unavailable and fallback readings are low-confidence; it only says “candidate” when candidate text exists.
- **Scope boundary:** presentation and status copy only; no phonology, IPA, engine, candidate selection, Ukrainian mapping or linguistic data changes.
- **Verification:** see the final exact-head evidence below. Public Pages live smoke remains pending until the PR is merged and deployment finishes.
- **Remaining accessibility gates:** NVDA/VoiceOver and true 200% browser zoom remain unverified; do not mark broad accessibility audit complete.

### Final verification — DONE_VERIFIED on PR head `2d07161d7b2fa29012a75d8b46aa408d8f1e48b2`

- PR [#494](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/494) is open, cleanly mergeable, and has no conflicts; merge is pending.
- Node/web tests: **1,465 passed, 0 failed** — [run 43278716006](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43278716006).
- System Verify: browser regression/build and Python data integrity **SUCCESS** — [run 43278716054](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43278716054).
- Editorial rendered review **SUCCESS** at 1440, 1024, 768, 390 and 320 CSS px — [run 43278716012](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43278716012). The generated desktop, mobile and narrow-mobile screenshots were inspected; practical and all three research levels were captured. Mode labels match the selected level, the metadata is borderless and left-aligned, mobile labels stack above values at 390/320 px, and the result ownership checks pass.
- Browser G2P integration **SUCCESS** — [run 43278716026](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43278716026).
- Master table/research corpus artifacts **SUCCESS** — [run 43278716291](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43278716291).
- Exhaustive test-case register extraction **SUCCESS** — [run 43278716197](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43278716197).
- Python 3.11/3.12/3.13, wheel installation and teacher-corpus audit **SUCCESS** in the Tests workflow. NIKL metadata-only inventory was **SKIPPED by policy**, not counted as a pass.
- The initial CI attempts exposed stale source-contract expectations for the old status string/capitalization and a test assertion that expected uppercase coverage text. Those contracts were corrected; the final exact-head suite is green.
- Candidate selection now updates only the labelled status value (never replacing the label container); the live browser smoke explicitly verifies label persistence and provisional-status updates after selecting a candidate.
- No engine, phonology, IPA, target mapping, candidate-selection logic or linguistic data changed. The UI now states whether the ordinary g2pK mode or research/Kozak Kim mode ran, names the research level, separates pronunciation provenance from Ukrainian target status, and does not claim a candidate exists when no candidate text exists.
- The broad UX audit remains **PARTIAL** for separate manual NVDA/VoiceOver, true 200% browser zoom, comprehension and performance gates.

## Execution continuation — 2026-11-12 — visual review of all interface modes

**Status: IN PROGRESS on PR #487.** This continuation inspects the existing rendered screenshots, removes a confirmed source-level copy-density issue, and expands the existing Playwright review to cover every mode state.

- **Starting main commit:** c9d10b8e9c6d4d5d22d00ee2036709002bd13ac1.
- **Branch:** fix/visual-mode-review-matrix-2026-11-12.
- **PR:** [#487](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/487).
- **Implementation commits so far:** c7f7a57d5285666dd777a09419c3bec1eb02b638 (visual capture matrix), 3ca9a8eec00fc70c76306b62d470843fdde4baba (capture contract), e738b552c5a2f6261cf6d6eae4290a9ff218bbd4 (concise mode copy), 9c6ebe169cc014ff4337b649d6d95fb5f73ccb14 (copy contract), followed by audit/handoff updates.
- **Open PRs at start:** none. No existing branch or PR changes were reused or overwritten.
- **Visual evidence inspected:** current-main artifact from Editorial visual review run [43182787204](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43182787204). Desktop 1440, mobile 390 and narrow mobile 320 screenshots were opened; the captured state was research / Soft.
- **Confirmed issue and fix:** the research choice duplicated technical detail already in its disclosure, and the static slider paragraph duplicated the live level-specific guidance. The choice is now concise and user-goal-led; provenance remains in the disclosure; one short methodology link replaces the redundant paragraph.
- **Visual matrix:** Playwright now captures practical mode and Strict / Soft / Super-soft research states at all five existing widths (1440, 1024, 768, 390, 320). It asserts default practical-mode selection, hidden research controls in practical mode, and visible slider controls in research mode.
- **Scope:** UI copy and QA only. No engine, IPA, phonology, target mapping or corpus changes.

### Task ledger

| Work item | Status | Evidence / next acceptance |
|---|---|---|
| Inspect existing desktop/mobile screenshots | DONE_VERIFIED | Artifact run 43182787204 visually inspected at 1440 / 390 / 320 |
| Simplify redundant research-mode copy | DONE_VERIFIED (source) | index.html change plus design-contract test |
| Capture practical mode at five widths | PARTIAL | New PR-head Playwright run must pass and artifact must be inspected |
| Capture all three research levels at five widths | PARTIAL | New PR-head Playwright run must pass and artifact must be inspected |
| Assert mode-switch visibility and default state | PARTIAL | New browser assertions await CI |
| Screen-reader and manual keyboard evaluation | BLOCKED | Requires actual assistive technology/manual test |
| Measure short / 1,000 / 5,198-character conversion latency | TODO | Needs measured desktop/mobile browser timings |

### Verification snapshot

- Main HEAD baseline: c9d10b8e9c6d4d5d22d00ee2036709002bd13ac1; latest mainline tests, Verify, Editorial visual review and Pages deployment all passed (runs 43182787226, 43182787221, 43182787204, 43182787198).
- PR-head runs are pending at the time of this update. Do not mark the new visual matrix DONE_VERIFIED until exact latest-head checks pass and the screenshot artifact is opened.
- The earlier typography and Jogakbo design work remains preserved and already merged/deployed.

# Master execution plan and handoff — 2026-11-08

## Execution continuation — 2026-11-12 — Ukrainian glyph weight consistency

**Status: DONE_VERIFIED, squash-merged and publicly deployed.**

- **Starting default-branch commit:** `4690d7d05baccb645df4d1f66caee4c38b55f80c`.
- **Implementation branch:** `fix/consistent-ukrainian-glyph-weight-2026-11-12`.
- **Pull request:** [#486](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/486).
- **Verified implementation head:** `422806d0ef4801ef22237f6227f1c3361d747b25`.
- **Final PR head including documentation:** `835826ecff41806d3fa9664165fc68d2253cab5c`.
- **Main squash-merge commit:** `f9c862319765d0c0265f2c31a9d3e12312397d57`.
- **Root cause:** the bundled Noto Sans Ukrainian face covered the alphabet and was genuinely weight 400, but it was applied only to the answer/specimen. The page-wide stack preferred Noto Sans KR before the Ukrainian face, and a later duplicate textarea rule overrode the earlier corrected stack. Ukrainian glyphs outside the result could therefore be rendered by a platform/Korean-first fallback.
- **Implementation:** put the bundled Ukrainian face first in the page-wide and input font stacks, retain Noto Sans KR immediately after it for Hangul, fix the later textarea override, and bump the editorial stylesheet query version on both pages.
- **Font evidence:** `audit_ukrainian_font_cmap.py` now checks every uppercase and lowercase Ukrainian alphabet glyph and the font's OS/2 weight class (400). The browser review checks the computed body/input stacks, the full alphabet, regular output weight, disabled synthesis, and captures a rendered Ukrainian-vowel specimen.
- **Exact-head CI at `422806d0ef4801ef22237f6227f1c3361d747b25`:** tests [43181728153](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728153), Browser G2P [43181728264](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728264), editorial visual review [43181728148](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728148), Verify [43181728180](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728180), master table/corpus artifacts [43181728386](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728386), exhaustive test register [43181728399](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728399), and push Verify [43181718918](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181718918) — all SUCCESS.
- **Test results:** `npm test` 1,461/1,461 passed; `npm run build` passed; Python 3.11/3.12/3.13 passed; wheel-install and teacher-corpus audit passed; browser visual review passed for desktop, laptop, tablet, mobile and narrow mobile on both pages, including the all-vowel specimen.
- **Scope:** no Korean phonology, IPA, Ukrainian mapping, corpus or engine behavior changed.
- **GitHub Pages deployment:** [43182394417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43182394417) — SUCCESS. Python 3.11/3.12/3.13, browser regression, static build, both public pages and JS asset HTTP smoke, and live Playwright smoke all passed.
- **Published service:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/.
- **Final state:** the font fallback fix is live. No remaining task for this typography defect.


## Execution continuation — 2026-11-11 — Jogakbo header / vertical modules

**Workstream status: DONE_VERIFIED, merged and publicly deployed.**

- **Starting main commit:** 004173e11dc92b292ea2d67000844119096e1679.
- **Implementation branch:** design/jogakbo-header-vertical-modules-2026-11-11 (preserved; not deleted).
- **Verified PR head:** 7ed9c7fa1c780ec7366341e733bd3aa42433721d.
- **PR:** #480 — https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/480 (merged 2026-11-11T12:24:22Z).
- **Merge commit:** 505bc4ffa448a66f6bf5a9c1c4f812ad8754edec.
- **Public site:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- **Deployment and live smoke:** passed, run 43020048051.
- **Previous merged design work:** #479 and #473 are already represented in main. The older vertical-flow branch is behind main; restore-editorial-character retains its already-merged #473 history and is stale relative to main. Other inspected design/rationale/vertical-flow branches have no commits ahead of main. None were rewritten or deleted.
- **No open PRs existed before #480.** No competing open change was reused.

### Task ledger

| Work item | Status | Evidence / acceptance |
|---|---|---|
| User-approved jogakbo header direction | DONE_VERIFIED | DESIGN.md and dated spec; museum references recorded |
| Test-first visual contract | DONE_VERIFIED | Expected RED on new contracts; final Node suite 1,446/1,446 |
| Shared header and service modules | DONE_VERIFIED | Eight header fragments; input above result; explanatory guidance; empty textarea |
| Methodology modules | DONE_VERIFIED | Reading guide; 25 content modules each with a real object; 24 existing section anchors preserved |
| Contrast and responsive behavior | DONE_VERIFIED | Computed mode-label contrast check, visible focus, 320–1440 px review |
| Existing linguistic pipeline and data | DONE_VERIFIED unchanged | No engine, IPA, target, corpus, benchmark or runtime files modified |
| Final branch CI | DONE_VERIFIED | Verify 43019283132 / 43019293643; Tests 43019293505; G2P 43019293495; register 43019293652; master artifacts 43019293509 |
| Main exact-head CI | DONE_VERIFIED | Verify 43020048190; Tests 43020048030; Editorial review 43020048115; master artifacts 43020048102 |
| GitHub Pages deployment/live smoke | DONE_VERIFIED | Deploy run 43020048051; HTTP and live browser smoke passed |
| Local checkout/local shell tests | BLOCKED | git clone timed out in this connector-only runtime; equivalent repository-defined checks ran on GitHub Actions |

### Commands and verification actually executed

- GitHub Actions Node suite: **1,446 passed, 0 failed**.
- Python regression/data-integrity jobs passed on 3.11, 3.12 and 3.13.
- Browser G2P integration passed.
- Source redistribution rights audit passed.
- Vite production build passed; deterministic Hanja artifact preparation completed.
- Master table/research corpus artifacts and exhaustive test-case register extraction passed.
- Playwright editorial review passed at 1440, 1024, 768, 390 and 320 CSS px on both pages. The first visual review exposed mode-label contrast; the fix and computed contrast gate passed on the final head.
- Pages deployment passed. Public HTTP smoke verified both HTML pages and the first built JS asset. Live browser smoke passed: deterministic Hanja output, result announcement, mode disclosure, clipboard-denial fallback, mobile trace labels at 390px and methodology navigation.
- Live adversarial input was 1,443 Korean characters; browser output included a 2,982-character provisional candidate and 3,731-character IPA trace. The status explicitly remained a contextual/provisional candidate, not a confirmed linguistic result.
- Local clone and local shell tests were not available; no local pass is claimed.

### Release assessment

The visual redesign is now merged and deployed at the public Pages URL. The repository as a whole remains a research prototype; this presentation-only change does not close independent Korean pronunciation evidence, IPA review, Ukrainian target-form validation, corpus provenance/licensing or other research gates recorded in the handoffs below.


## Execution continuation — 2026-11-10

The current PR #465 head (`840cb3f177e147dfe1ae53e7bdd26d524b699b64`) is 66 commits ahead of `main` and 0 behind. It is based on the latest main baseline; no merge-base conflict is indicated. The full six-track ten-engine / fifteen-report Browser matrix was previously completed in run 42785083152, with Seoul full-corpus Browser runs in 42496539257. The K-SPAN 63,836-row NIKL WordNum join is complete, but key/WorldBet consistency remains WARN at 22,843 discrepancies (Modern 13,078; Conservative 9,765).

Latest exact-head CI on 840cb3f is not green:
- Verify 42799422710: FAIL — source-register CSV shape plus Browser link/checkpoint assertions.
- Tests 42799422543: FAIL — same malformed CSV; Python 3.11/3.13 cancelled by fail-fast.
- Multi-engine 42799422846: FAIL — aggregate builder cannot import the sibling summarizer when run as a script.
- Master/research artifacts 42799423026: PASS.
- Exhaustive register extraction 42799422733: PASS.
- UGTPHON diagnostic 42799422696: PASS.

The repair batch quotes comma-bearing fields in three source-register rows, corrects the docs-index relative link and structure-guide checkpoint heading, and makes the summary builder import its sibling module in package and direct-script execution contexts. After those repairs, rerun Python 3.11/3.12/3.13, Browser, Verify and the full matrix on the final exact head. Inspect the aggregate-only ZIP and verify it contains only the schema-validated aggregate JSON and source checksums before marking artifact policy DONE_VERIFIED.

K-SPAN's 22,843 key/WorldBet differences are not waived: score from the source WorldBet fields, report the parallel key-field differences independently, and preserve all rows. Optional neural inference and metadata-only NIKL inventory remain skipped. Independent Korean IPA gold, independent Ukrainian target review, historical audio/speaker provenance and restricted corpus terms remain separate research blockers.

The repository remains a software-verified, evidence-scoped research prototype, not independently research-certified or release-ready. PR #465 must not be merged until required exact-head CI is green and the artifact is inspected. PR #463 and #462 are superseded in intended scope but should be closed only after #465 is accepted; preserve their historical branches.



## Previous execution handoff — 2026-11-10 (superseded) (exact PR #465 checkpoint)

**Main base:** `920b6365539058b658348855c5daddc066558b15`.  
**Active PR:** [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), `benchmark/five-dataset-matrix-reconciled-2026-11-09`.  
**Verification snapshot PR head:** `de841219a3ecc50db874ebde90d250edce7cdf9f` (33 commits ahead, 0 behind; 20 changed files; GitHub mergeability: clean).  
**Matrix runtime snapshot:** `dfbaf4d122dd48377c56f79227c65617aa9eed6d`; the newer PR-head commits after this snapshot are documentation/test-workflow coordination only, not benchmark-runtime changes.

### Exact latest-head checks

- Tests [42777829552](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829552): **PASS**.
- System Verify [42777829403](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829403): **PASS**.
- Master/research artifacts [42777829668](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829668): **PASS**.
- External UGTPHON diagnostic [42777829606](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829606): **PASS**.
- Exhaustive test-case register extraction [42777829427](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829427): **PASS**.
- NIKL metadata-only inventory remains **SKIPPED** by policy.

### Full matrix status — not yet complete

- The pinned multi-engine/open-dataset run [42776987807](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42776987807) is running on runtime snapshot `dfbaf4d1`.
- Completed successfully in that run: source/input validation; benchmark adapter tests; training-readiness/holdout-overlap audit; independent IPA review-packet generation; 10-engine UGTPHON comparison; mismatch-ledger export; UGTPHON Browser modes; mode-availability check; Native/Browser parity.
- The SIGMORPHON 10-engine comparison is currently running. Seoul, K-SPAN Modern/Conservative, IPA-Dict, Browser follow-ups and final aggregate/schema gates must still complete.
- A fresh full-matrix run [42777829497](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829497) is queued for exact latest PR head `de841219`. Do not claim full-matrix PASS or schema PASS until this exact-head run completes and its aggregate artifact is inspected.

### K-SPAN evidence boundary

The official K-SPAN 2.1 Table 1 mapping is used (`o → e → e`, `p → E → ɛ`, `x → th → tʰ`, `m → ix → ɯ`, `j → ˆ → ʌ`, `u → jˆ → jʌ`, `7 → ixi → ɯi`). The 63,836-row join retains all rows. Scoring converts source `ModernPhon` / `ConservativePhon` WorldBet fields directly to IPA; parallel key fields are independently audited. Their 22,843 discrepancies (Modern 13,078; Conservative 9,765) remain explicit **WARN**, not PASS. Aggregate-only summaries retain warning status/counts and omit row-level examples.

### CI cancellation policy

The benchmark workflow now uses `cancel-in-progress: false`: an already-running pinned matrix is allowed to finish; newer PR revisions queue behind it, with only the latest pending revision retained. This addresses repeated cancellation by documentation-only PR commits.

### Readiness and disposition

PR #465 remains OPEN and unmerged pending the exact-head matrix and schema. PRs [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463) and [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462) remain open and untouched; their changed-file scopes overlap with #465, but close them only after #465 passes and unique scope is reconciled. No historical branch was deleted or force-updated.

The repository remains a software-verified, evidence-scoped research prototype, not release-ready or independently research-certified. Independent Korean IPA review, separate Ukrainian target review, historical membership/raw-offset evidence and restricted-dataset access remain separate acceptance gates.




**PR #463 divergence refresh:** compared against main HEAD `80c0361c0b91b6747fd262c5b729bcb8ed0bbf17`, the benchmark branch is 91 commits ahead / 27 behind from merge base `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`. The main-only side touches 13 paths. This comparison snapshot predates the final status-only commit that records it.



### Post-merge closure — PR #464

PR [#464](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/464) was squash-merged into `main` as `d2699911dbc70ef9978e5af06643b1281725a71a`. The documentation branch head was `db61448373dd179ced0c61332a9bdf0ca53f96a3`; the PR was five commits ahead of its base and zero behind.

Exact PR-head checks all passed:
- Tests [42678483929](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678483929): Python 3.11/3.12/3.13, web, wheel-install and teacher-corpus audit PASS.
- System Verify [42678483721](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678483721): Python and Browser PASS; NIKL metadata-only SKIPPED.
- Exhaustive test-case register extraction [42678483928](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678483928): PASS.
- Master/research artifact generation [42678483855](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678483855): PASS.
- Exact-head push Verify [42678302945](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678302945): PASS.

The post-merge main workflows are separate runs and must be checked independently: Tests [42678644963](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678644963), Verify [42678644939](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678644939), master/research artifacts [42678645435](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678645435), and Pages [42678645363](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678645363). **Post-merge main verification passed on `5c12f92c36ecae455dc4281dd7a8c0217f5dc4dc`:** Tests [42679091769](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091769), System Verify [42679091895](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091895), master/research artifacts [42679091976](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091976), and Pages deployment/live smoke [42679091977](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091977) all **PASS**. NIKL metadata-only remained **SKIPPED** by policy.

**Documentation/navigation reconciliation: DONE_VERIFIED on PR #464 head and merged into main.** The benchmark and independent linguistic acceptance blockers remain unchanged.


## Execution checkpoint

This continuation executed the existing benchmark and corpus-access work rather than replacing the repository plan. The user explicitly authorized repository improvements, imports and internet research. Work remained on `main`, consistent with the existing owner preference; no branch or PR was created.

- Starting main commit: `893619785c8fc7c8417cc8da0690d84fcb8d8dbb`.
- Benchmark code snapshot: `668dbad14568e8472594937558500500102b3f95`.
- Main before final audit closure: `06eec3c62670dae76aad3b2fecd6aecd1d3173e2` (the final audit commit follows this revision).
- Full 10-engine benchmark: [run 42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896), artifact `13621335293`.
- Seoul corpus ingestion and two additional three-mode benchmarks: [run 42492152654](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492152654), artifact `13621892753`.

## Completed work

### Benchmark execution

Five executable evaluation tracks now exist across three datasets:

1. UGTPHON — 10-engine Strict IPA and Broad sensitivity.
2. SIGMORPHON 2021 Korean — 10-engine Strict IPA and Broad sensitivity.
3. UGTPHON — Kozak Kim Browser Strict, Soft and Super-soft.
4. Seoul Corpus SLR113 — Kozak Kim three-mode Hangul surface pronunciation.
5. Seoul Corpus SLR113 — Kozak Kim three-mode phonemic IPA via a versioned 36-symbol adapter.

The five-track count is not five independent corpora. KsponSpeech and NIKL 2022 remain access/terms-gated candidates and are not scored.

### Seoul Corpus label import

- Retrieved only the 57 MB OpenSLR SLR113 label archive in CI; audio was not downloaded.
- Archive SHA-256: `63c3f8ffa6976307a732689d6c5be7b2db4ec20f14bf276faf98c886add0d24b`.
- 240/240 TextGrid files parsed; 1,680 tiers; 2,671,221 interval annotations.
- 231,626 aligned Hangul word pairs; 231,625 aligned phonemic IPA pairs.
- 36 observed phone symbols mapped using Table 3 of Yun et al. (2015), DOI `10.13064/KSSS.2015.7.2.103`.
- 1,134,781 phone intervals mapped; 70,660 non-phone/unmapped intervals excluded. Seven word intervals were excluded from phone-to-word IPA scoring (six boundary conflicts, one non-phone/unmapped label).
- Raw TextGrid files, audio and word/IPA pair JSON files remain temporary CI data and are not committed or uploaded. Disclosure: an intermediate diagnostic artifact 13621412269 contains a distinct phoneme-tier label inventory, including some short laughter-tag text; it does not contain TextGrid/audio/word-pair data and expires 2026-12-08. The final clean artifact 13621892753 from rerun 42492152654 has 7-day retention and was verified to contain aggregate symbol/category counts only, with no raw label-value map. Earlier intermediate artifact 13621412269 contains a distinct phoneme-tier label inventory with some short laughter-tag text, not TextGrid/audio/word-pair data; it expires 2026-12-08.

### Mode results and interpretation

- On Seoul Hangul surface: Strict 97.0375% coverage, 57.1537% scored-only Exact, 55.4605% coverage-adjusted Exact, 24.5421% CER. Soft 87.0006% coverage / 48.8991% adjusted Exact / 26.3641% CER; Super-soft 83.4924% / 47.4662% / 26.3118%.
- On Seoul phonemic IPA: Strict 97.0375% coverage, 14.1166% scored-only Exact, 13.6984% coverage-adjusted Exact, 39.9210% CER. Soft 87.0005% / 12.8734% adjusted Exact / 40.8696% CER; Super-soft 83.4923% / 12.8402% / 40.4053%. Soft/Super-soft scored-only Exact is higher only because they score fewer source-resolved cases; strict wins every exact comparison on common scored subsets.
- The phonemic reference is not narrow phonetic gold. The mapping adapter explicitly serializes `ʨ` as `tɕ` and asterisk fortis markers as `͈`; independent Korean phonetics review remains required.
- Native/Browser Strict parity on UGTPHON: 2,703/2,703 surface outputs and 2,702/2,702 resolved raw IPA/Broad IPA outputs.
- No production pronunciation rules or lexical exceptions were promoted from Seoul Corpus.

## Existing implementation preserved

- Existing IPA-first pipeline and the Native/Browser Kozak Kim implementations.
- Original g2pK 0.9.4 vendor baseline; external engines remain comparison-only.
- Existing 236-case review queue and source-backed lexical controls; no reinterpretation of the 213 unadjudicated, 22 ABSTAIN and 1 provisional RETAIN dispositions.
- Existing five-dataset portfolio and benchmark suite register; extended in place rather than duplicated.

## Verification actually executed

On benchmark code snapshot `668dbad14568e8472594937558500500102b3f95`:

| Check | Result | Evidence |
|---|---|---|
| Seoul label inventory + surface + phonemic IPA benchmark | **PASS** | [42492152654](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492152654) |
| Python 3.11/3.12/3.13, Browser, Web, wheel-install, teacher corpus audit | **PASS** | [42491208107](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42491208107) |
| System Verify: Python regression/data integrity, Browser regression/build | **PASS** | [42491208109](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42491208109) |
| Master table and research corpus artifacts | **PASS** | [42491208162](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42491208162); latest source-register generation [42492418499](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492418499) |
| 10-engine UGTPHON + SIGMORPHON + three browser modes + Native/Browser parity | **PASS** | [42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896) |
| Seoul metadata-only corpus preflight tests | **PASS** | Included in run 42492152654 |

Latest source-register/docs snapshot before this handoff refresh on `06eec3c62670dae76aad3b2fecd6aecd1d3173e2`: tests [42492418635](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492418635) **PASS** (Python 3.11/3.12/3.13, Web/npm tests/build, wheel install, teacher-corpus audit); System Verify [42492418484](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492418484) **PASS**; master artifacts [42492418499](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492418499) **PASS**. Source register has 230 rows and all rows parse as 12 CSV fields.\n\nNo claim is made that GitHub Pages deployment completed; it was queued at the time of the benchmark snapshot. Neural ByT5 and CharsiuG2P remained skipped under existing default-off policy. The container's direct network download attempt was unavailable; GitHub Actions successfully retrieved the public archive. No local full repository test run is claimed; CI is the verification source.

## PRs, branches and merge decisions

- Work continued directly on `main`, not on a new branch, following the established owner preference.
- No open PR was present in the repository's GitHub REST open-PR listing at inspection time.
- PR #457 had already been merged and its historical artifact was retained only as historical comparison; the exact-main run 42487350896 supersedes it for current benchmark code.
- No user branches were deleted, no PR was merged blindly, no force-push occurred, and no release was published.

## Remaining task ledger

| Task | State | Exact blocker / acceptance criterion |
|---|---|---|
| Independent review of Seoul phoneme-to-IPA adapter | **TODO** | Korean phonetics reviewer to approve Table 3 serialization choices and the phonemic-vs-phonetic comparison boundary. |
| Ukrainian target rendering validation on Seoul | **DEFERRED** | Seoul supplies Hangul and phonemic IPA references, not Ukrainian target gold. Requires separately adjudicated Ukrainian target references. |
| KsponSpeech benchmark | **BLOCKED** | AIHub account/access and original corpus terms; the Hugging Face mirror's empty license field is not permission. |
| NIKL 2022 Daily Conversation benchmark | **BLOCKED** | NIKL portal application and exact license/terms; no access token/data obtained. |
| SIGMORPHON sealed-holdout status | **PARTIAL** | Verify source split and training overlap before describing it as a sealed holdout. |
| 236-case independent linguistic adjudication | **PARTIAL** | 213 cases not individually adjudicated, 22 ABSTAIN, 1 provisional RETAIN; no promotion to gold/production. |
| Neural ByT5 / CharsiuG2P | **DEFERRED** | Existing default-off policy; requires model/runtime and data provenance review. |
| Release readiness | **NOT READY** | Independent phonetics review, Ukrainian target validation, corpus-rights review and complete holdout adjudication remain incomplete. |

## Repository status

**Software-verified research prototype; not independently research-certified and not release-ready.** The five evaluation tracks are reproducible, but the corpus references have distinct conventions, the Seoul IPA adapter is phonemic, and production acceptance still requires independent review. The final repository HEAD is the commit containing this handoff plus the subsequent audit update; see the final execution report for the exact SHA.


## 2026-11-08 continuation — corrected Seoul fallback accounting and release-check refresh

**Current verified benchmark code head:** `536cd44460bbd225fcd76f592bfe6e3077a245a4`. The Seoul workflow [42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257), artifact `13623457737`, passed archive download, 240/240 TextGrid parsing, Hangul surface benchmark and phonemic-IPA benchmark. It supersedes the initial Seoul artifact's overlapping fallback counters.

The 29 Super-soft typed orthographic-fallback rows were already excluded from source-resolved Exact/CER by the earlier heuristic status branch, so scores did not change. The correction makes the strata mutually exclusive: 38,207 heuristic + 29 typed fallback. Both benchmark scripts now explicitly skip typed fallback before Exact/CER and paired comparisons. Two Node regression tests cover both scorer paths.

- Full tests [42495903258](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903258): **PASS** — Python 3.11/3.12/3.13, Web/npm tests and build, wheel installation, teacher-corpus audit.
- System Verify [42495903331](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903331): **PASS** — Browser regression/build and Python regression/data integrity. Official NIKL metadata inventory: **SKIPPED**, not passed.
- GitHub Pages deployment [42495903310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903310): **PASS**.
- Final documentation/source-accounting commits now bring `main` to `09efa609368df914b38020b8a74ec7c4a1fb4cd6`; exact-head tests/system/artifact workflows were queued after this docs-only update (runs 42496173562, 42496173554, 42496173617). Do not mark those newest-head checks complete until they finish.

**Remaining gates are unchanged:** independent Korean phonetics review of the Seoul adapter; no Ukrainian target gold for Seoul; KsponSpeech and NIKL 2022 access/terms; independent review of the 236-case cohort; and broader external IPA/target validation. The repository remains a software-verified research prototype, not release-ready.


## Final exact-main checkpoint after documentation reconciliation — 2026-11-08

**Main SHA at checkpoint:** `84f2fbd9a90cf6e6d8a8f5e634f7c8989bab7ecc` (branch `main`). The exact-head CI after the final audit/handoff/coverage updates completed:

- Tests [42496221194](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496221194): **PASS** — Python 3.11/3.12/3.13, Web/npm tests and build, wheel installation, teacher-corpus audit.
- System Verify [42496221320](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496221320): **PASS** — Browser regression/build and Python regression/data integrity; official NIKL metadata-only inventory **SKIPPED**.
- Master/research artifact generation [42496221352](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496221352): **PASS**.
- The last code-bearing Pages deployment [42495903310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903310) passed on `e1e393b3518b6c69685ad00a179ab8996d18ef71`. Commits after that point are documentation-only; their redundant Pages runs were cancelled by newer commits, and no runtime assets changed.

No open PRs were present at the latest inspection. No user branches were deleted, no force-push occurred, and no release was published. The five executable evaluation tracks remain diagnostics across three datasets; KsponSpeech and NIKL 2022 remain access/terms-gated. Readiness remains **software-verified research prototype; not independently research-certified or release-ready**.


## 2026-11-08 — separate candidate availability from source-resolved accuracy

The Seoul benchmark scripts now emit both `output_available_occurrences` / `output_availability_rate` and source-resolved `scored_occurrences` / `coverage`. The former includes heuristic and typed-fallback candidates, but excludes unresolved identity passthrough; it is explicitly not an accuracy metric.

- Hangul surface availability: Strict 97.0375%, Soft 98.2502%, Super-soft 100%.
- Phonemic IPA availability: Strict 97.0375%, Soft 98.2502%, Super-soft 100%.
- Source-resolved coverage remains surface 97.0375% / 87.0006% / 83.4924%, IPA 97.0375% / 87.0005% / 83.4923% (Strict / Soft / Super-soft).
- Benchmark artifact [13623457737](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257) is aggregate-only; raw label and pair files remain temporary CI data.
- The new tests [42496551366](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496551366) passed; System Verify [42496551350](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496551350) passed with the optional NIKL inventory skipped.


## 2026-11-08 continuation — three-mode coverage across all compatible benchmark inputs

Owner instruction is to work directly on main; this continuation preserves that path and does not create, delete or rewrite user branches.

**Starting main before this batch:** f79b6cadf3da93701cdf95985a9f71de80cc8bca.  
**Current code/test head before this documentation append:** 7032d3a4abf0e7c97caec1d7ae91de08c0a18c6a.

### Completed implementation (CI pending)

- Generalized the Kozak Kim Browser benchmark runner so it can identify SIGMORPHON separately from UGTPHON and attach the pinned dataset source to the report.
- Added candidate-output availability as a separate metric from source-resolved IPA scoring coverage.
- Added the SIGMORPHON Browser Strict/Soft/Super-soft benchmark calls to the existing multi-engine workflow; all three reports are uploaded as artifacts.
- Added exact-denominator, zero-engine-error, monotonic availability and 100% Super-soft availability checks for UGTPHON and SIGMORPHON.
- Added monotonic and 100% Super-soft candidate-availability gates to both Seoul Hangul surface and Seoul phonemic-IPA benchmark scripts.
- Added Node regression coverage for candidate availability vs source-resolved scoring and explicit metric aliases.

### Metric interpretation

Super-soft 100% means that every eligible occurrence has a non-empty, typed candidate output. It does not mean every output is correct. Exact/CER only score source-resolved IPA outputs; heuristic and typed fallback candidates remain outside that accuracy denominator. Strict/Soft/Super-soft availability must be monotonic. The ten external engines remain Strict-compatible comparators, not modes of Kozak Kim; the morphology-consensus diagnostic remains a separate research harness. The reconstructed 236-case cohort is not an accuracy gold set.

### Task ledger

| Task | Status | Acceptance |
|---|---|---|
| Browser runner dataset labels/source metadata and metric aliases | PARTIAL | Exact-head browser tests and benchmark workflow pass. |
| UGTPHON three-mode candidate-availability gate | PARTIAL | All eligible occurrences retained; monotonic availability; Super-soft 100%; no engine errors. |
| SIGMORPHON three-mode run | PARTIAL | 1,000 eligible rows in each mode, same occurrence IDs, all artifact reports present, Super-soft 100%. |
| Seoul surface three-mode gate | PARTIAL | Monotonic availability and Super-soft 100% across 231,626 occurrences. |
| Seoul phonemic-IPA three-mode gate | PARTIAL | Monotonic availability and Super-soft 100% across 231,625 occurrences. |
| Full exact-head verification | TODO | GitHub Actions test matrix, system verification, master/research artifact checks and multi-engine benchmark pass on the final docs commit. |

### Commands and evidence

- The intended CI runner executes node --test tests/kozak-kim-ipa-first-benchmark.test.mjs, npm test, npm run build, Python 3.11/3.12/3.13 tests, wheel install, teacher-corpus audit, system verification, and the multi-engine benchmark. These are configured checks, not commands run locally in this connector-only session.
- Prior Seoul artifact [42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257) had measured 100% Super-soft candidate availability on both Hangul surface and phonemic IPA. New runtime gates still require an exact-head rerun.
- No local test result is claimed. No new SIGMORPHON three-mode score is claimed until its exact-head artifact is inspected.

### Stop condition

Do not mark the new mode matrix DONE_VERIFIED until all four compatible benchmark inputs have passed all three modes on the same eligible occurrence sets, Super-soft is 100% candidate-available, and all relevant CI/artifact checks pass. External-engine Strict comparisons remain separate and preserved.


## 2026-11-08 execution continuation — exact-main verification and branch audit

**Current main:** `5814de6a77745feca7cc7683e6594d67289c2b23`.

PR state is reconciled: PR #461 is merged; the current GitHub open-PR query returned zero. The stale "PR remains open pending merge" sentence in the repository-structure guide has been corrected. The 40 source-policy adjudications are already integrated into main as metadata/provenance annotations (40 occurrences, 17 families); they do not independently rewrite IPA or Ukrainian output.

### Verification

On parent code/docs head `1912ea24e78ca03fe8483292efb31960d11c1c1e`:

- Tests [42506324942](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506324942): PASS — npm tests/build, Python 3.11/3.12/3.13, wheel install, teacher-corpus audit.
- System Verify [42506324960](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506324960): PASS — Python/browser regressions, source redistribution rights gate; NIKL metadata-only inventory SKIPPED.
- Master/research artifacts [42506325185](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506325185): PASS.
- Pages deployment/live browser smoke [42506324909](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506324909): PASS.

Latest documentation correction commit `5814de6a77745feca7cc7683e6594d67289c2b23` has exact-head runs queued: tests 42506815536, verify 42506815808, master artifacts 42506815555, Pages 42506815519.

Multi-engine benchmark [42506225213](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506225213) is running against code head `c757cd02fee87e7313e52352602ec4ef879a7def`. Pinned dataset fetches, external license checks, adapter tests, training-readiness audit and holdout packet generation passed; the main comparison step and all downstream Browser three-mode/artifact steps remain in progress/pending. Do not claim new SIGMORPHON results or final mode-gate completion until the workflow succeeds and artifacts are inspected. ByT5 and Charsiu optional inference were skipped by policy.

### Branch disposition

All 27 non-main branches were compared against main. The high-risk 40-case adjudication, 236-case, source-rights, abstention-fix and agent-workflow branches were additionally tree-inspected; sampled trees had no branch-only files and main contains newer/superseding content. No branches were deleted, force-updated or blindly merged. Historical branches remain untouched. No open PRs remain.

### Next acceptance gates

1. Inspect run 42506225213 through completion; verify UGTPHON and SIGMORPHON Strict/Soft/Super-soft reports use identical occurrence denominators, zero engine errors, monotonic candidate availability and 100% Super-soft candidate availability. Inspect uploaded artifacts; do not confuse availability with source-resolved scoring coverage or accuracy.
2. Confirm runs 42506815536, 42506815808, 42506815555 and 42506815519 on current main.
3. Keep optional NIKL/Charsiu/ByT5 jobs classified as skipped, not passed.
4. Retain the research-prototype status until independent Korean phonetics and Ukrainian target-layer acceptance is complete; no speaker-specific narrow IPA gold is claimed.

**Readiness at this checkpoint:** software-verified research prototype, not release-ready. No local shell test result is claimed; verification evidence is GitHub Actions.


## 2026-11-08 — Multi-engine benchmark failure diagnosis and correction

- The first completed multi-engine run (Actions run 42506225213) failed at the Native/Browser runtime parity audit, not during engine inference. The browser runner emitted its default benchmark identity, while the audit requires the explicit `UGTPHON Korean canonical-token diagnostic` identity. This caused the guard to reject the report before the parity comparison and before the later SIGMORPHON stage.
- The UGTPHON browser Strict/Soft/Super-soft runs themselves completed with zero engine errors and 2,703 eligible occurrences each. Strict: 2,702/2,703 source-resolved scored (99.963%), 2,702/2,703 candidate availability, 52.739% exact among scored, CER 9.013%. Soft: 2,423/2,703 source-resolved scored (89.641%), 2,703/2,703 candidate availability, 54.767% exact among scored, CER 7.879%. Super-soft: 2,239/2,703 source-resolved scored (82.834%), 2,703/2,703 candidate availability, 56.186% exact among scored, CER 7.819%.
- Interpretation: Super-soft achieved complete candidate availability, not complete source-resolved coverage or accuracy. The lower source-resolved denominator reflects heuristic outputs that are deliberately excluded from source-resolved scoring. These metrics must remain separate.
- Corrective commit `b7b4afca93a8d218c0f99eb5a11a52e6a5a05712` adds the explicit benchmark name and pinned dataset-source label to all three Browser UGTPHON invocations. This is a harness identity fix; it does not change engine behavior or scoring rules.
- Acceptance remains pending until the new main-branch Actions run completes the parity audit, SIGMORPHON Strict/Soft/Super-soft comparisons, and artifact review. Do not mark the multi-engine benchmark DONE_VERIFIED based on run 42506225213. Its failure is recorded as a harness failure with the specific cause above; the corrected rerun is pending.
- GitHub Pages run 42506852765 completed successfully, including browser build and deployment. Latest ordinary Tests, System Verify, and research artifact generation runs at commit 2d55eeec5fb2e6f72ada8b316bd5c4df1caab2b8 passed; these do not substitute for the pending multi-engine gate.


## 2026-11-08 — external benchmark inventory reconciliation

The benchmark portfolio must not be limited to the eight internal suites or the five selected datasets. The canonical external-resource inventory is now extended in docs/KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md and research/SOURCE-REGISTER.csv.

Newly reconciled resources:
- **MFA Korean G2P v2.0.0 (Hangul):** model card reports 48,665 training words, 5,407 held-out words, WER 10.25%, PER 2.26%; CC BY 4.0. Candidate external baseline; still requires pinned model/dictionary, MFA-phone→IPA adapter and leakage checks.
- **MFA Korean (Jamo) G2P v2.0.0:** model card reports 48,682 training words, 5,409 held-out words, WER 3.90%, PER 0.64%; CC BY 4.0. Secondary variant from the same MFA family, not an independent dataset. Requires Hangul→Jamo and phone→IPA adapters.
- **kr-MATAGI/IPA_G2P-Testing:** indexed as a secondary benchmark catalogue. Its README reports g2pk WER 4.7 / PER 0.74 on SIGMORPHON 2021, but exact test split, normalization, scoring code and licence are not established. These values are not comparable to our current reports without protocol reconciliation.
- **SIGMORPHON 2024 G2P Shared Task:** its published task definition uses Latin, Cyrillic and abjad orthography groupings; no Hangul Korean test set was established. It is not added as a Korean dataset.
- **Mun, Kim & Ko (2022) 130-row hand-transcribed golden corpus:** remains the strongest rule-phenomenon candidate, but formal use is blocked by missing explicit data reuse permission/licence.

No external model or dataset was silently imported, vendored, or scored in this documentation pass. The next executable external-baseline task is MFA v2.0.0, subject to exact model/dictionary pinning and a lossless phone-to-IPA adapter. The IPA_G2P-Testing discrepancy is an investigation task, not an accuracy result.


Additional resources reconciled in this pass:
- **Korean Word-IPA Dictionary / IPA-Dict Korean:** Wiktionary-derived CC BY-SA lexical IPA resource; IPA_G2P-Testing reports 62,676 entries. It is a candidate supplementary lexicon, but not independent from SIGMORPHON/WikiPron; exact snapshot and overlap audit are mandatory.
- **Zeroth-Korean / OpenSLR SLR40:** CC BY 4.0 speech corpus; OpenSLR reports 51.6h training (22,263 utterances, 105 speakers) and 1.2h test (457 utterances, 10 speakers), with a lexicon. It is registered as an adjacent speech/lexicon resource, not G2P gold until the pronunciation symbols and lexicon schema are audited. Audio is not mandatory for this registration.


## 2026-11-08 — MFA v2 G2P execution checkpoint

The two MFA Korean v2.0.0 models have now been integrated as isolated, comparison-only CI baselines. Workflow [42512114864](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42512114864) ran both official model archives against the pinned UGTPHON test split and the pinned SIGMORPHON 2021 Korean test file. The Hangul model archive SHA-256 is `b7b19314b141e20b9714bed8d6eb80d3c291ae3f4d282ffdb643468fedce18d8`; Jamo archive SHA-256 is `8068b669bf39fa11b9e606e8961d434c7811e9437e71eb1840f841ed4cb63398`. Model weights are fetched in CI and not committed. The environment pins MFA 2.0.0 and `jamo==0.4.1`.

Results were produced for all four combinations: UGTPHON Hangul/Jamo (2,703 eligible each) and SIGMORPHON Hangul/Jamo (999 eligible each). See the benchmark suite register for the complete Exact/CER/PER/feature-weighted table. The first run's final gate failed because it expected 1,000 eligible SIGMORPHON rows although the shared scorer admits 999 from the 1,000-row raw file. This was corrected; rerun [42513951588](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588) completed successfully, including the denominator/schema gate and artifact upload. Aggregate artifact [13630946780](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588/artifacts/13630946780), SHA-256 `469ffb31f9721afa2272454e9854fb6453de9e213e19def78549db2a7ba16b32`. The MFA v2 diagnostic benchmark is **DONE_VERIFIED**.

Remaining MFA acceptance gates:
- **DONE_VERIFIED:** four report schemas, eligible denominators, model checksums and aggregate artifact upload passed in run 42513951588.
- **TODO:** inspect and audit model dictionary/training lineage overlap with SIGMORPHON/WikiPron/UGTPHON; do not treat the two MFA variants as independent.
- **BLOCKED / expert review:** independently validate the complete 56-symbol MFA phone inventory and identity-to-IPA mapping; unknown symbols currently fail closed, but that alone does not prove the published phone symbols are phonetic IPA.
- **DEFERRED:** do not add MFA to production, runtime dependencies or Ukrainian target rendering. The current integration is a research comparison only.


## 2026-11-09 — documentation, repository structure and mainline reconciliation

### Scope and starting state

- Repository: `ClippyFirst/Korean-Ukrainian-Phonetic-System`.
- Starting `main`: `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`.
- Owner instruction: keep one active integration branch and work on `main`; do not create a task branch.
- Push/admin access was available.
- Main already contained a substantial documentation system, seven repository-local skills, canonical research registers, schemas, tests and dedicated CI workflows. This pass preserves those systems rather than creating a replacement architecture.

### Repository map and structural decision

The existing top-level boundaries are coherent and are retained:

- `.agents/skills/` — seven focused engineering, audit, review and phonetic-evidence skills.
- `.github/workflows/` — CI, release verification, Pages deployment, benchmark and research workflows.
- `src/` — browser and Python runtime implementation.
- `data/` — canonical structured phonological and Ukrainian target data.
- `research/` — source register, rule coverage, acceptance gates, decision log, corpora and review packets.
- `schemas/` — machine-readable contracts.
- `scripts/` — generators, imports, audits and benchmark runners.
- `tests/` — browser, Python, parity, data, rights and benchmark contract tests.
- `docs/` — human documentation, methodology, historical audits and append-only handoff.
- `reports/` — generated summaries; `licenses/` — third-party licence texts and notices.

No bulk move or rename is justified. The large, dated `docs/` collection is intentional evidence history; discoverability is handled through the documentation index and ownership guide. Do not delete or rewrite historical reports to make the tree appear smaller.

### Upstream practice reconciliation

The maintained [agent workflow guide](AGENT-WORKFLOWS.md) lists all four requested upstreams in one comparison table and records their reviewed revisions:

- [unlazy](https://github.com/Leonxlnx/unlazy) — explicit acceptance gates, command oracles, evidence freshness and re-verification; adopted through existing registers and exact-head verification, not by importing its second state machine or shell-execution tooling.
- [superpowers](https://github.com/obra/superpowers) — red/green TDD and root-cause debugging; applied through the existing engineering and phonetic skills.
- [mattpocock/skills](https://github.com/mattpocock/skills) — composable skills, separate specification/engineering review and source-grounded research; adapted to the repository's current skill router and evidence registers.
- [ponytail](https://github.com/DietrichGebert/ponytail) — risk-first audits, real data-flow tracing and smallest complete fixes; adopted without importing unrelated benchmark claims or a line-count objective.

No upstream skill text, hooks, scripts, plugins or code was copied. The repository already had the right local skill boundaries; this pass clarifies provenance and adoption.

### GitHub PR and CI reconciliation

- PR [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463): OPEN, not merged. Head `2adf6fb46b7773278d8abc29b863228b8d655e67`, base `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`.
- PR [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462): OPEN, not merged; narrower SIGMORPHON Browser verification change whose scope is superseded by #463. Leave untouched until #463 is resolved; do not merge both redundantly.
- Multi-engine run [42526972593](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42526972593): **FAIL** at step 19. The 10-engine UGTPHON/SIGMORPHON comparisons and all three SIGMORPHON Browser report generations completed. The inline Python gate computed `expected_tokens = 0` because the Hangul regex was double-escaped (`r"[\\uac00-\\ud7a3]+"` in the workflow source); the assertion then failed on Strict with `('strict', 999, 0)`. The SIGMORPHON reports showed eligible=999; Strict scored/output=998 with one unresolved; Soft scored=987, output=998, heuristic=11; Super-soft scored=942, output=999, heuristic=57. Candidate availability is monotonic 998 ≤ 998 ≤ 999, with Super-soft at 100%; source-resolved scoring coverage remains a separate metric.
- Because step 19 failed, step 20 Browser regression and step 21 Seoul/K-SPAN/IPA-Dict open benchmark matrix were **SKIPPED**. CharsiuG2P and ByT5 research inference jobs were also **SKIPPED** under their default-off configuration. The artifact was uploaded, but its existence does not turn the workflow into PASS.
- External UGTPHON diagnostic [42526976103](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42526976103): **PASS**.
- Exact-main push workflows on starting commit `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`: Tests [42519315077](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315077), System Verify [42519315152](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315152), Master/research artifacts [42519315001](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315001), Pages deployment [42519315003](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315003): all **PASS**.

### Documentation changes made in this continuation

- Refreshed `docs/README.md` with the actual main SHA, exact-main CI run IDs, the two open PRs and the failed benchmark gate; removed the stale claim that there were zero open PRs.
- Refreshed the current checkpoint in `docs/REPOSITORY-STRUCTURE.md` and documented the PR/benchmark boundary without claiming the open matrix passed.
- Added the four requested upstream repositories to one maintained comparison table in `docs/AGENT-WORKFLOWS.md`.
- Added `CONTRIBUTING.md` and `.github/PULL_REQUEST_TEMPLATE.md` to make setup, evidence, data-rights, benchmark and verification expectations explicit for human contributors.
- Linked the contribution guide from the root README and documentation index.
- This handoff records the actual starting state, decisions and blockers; it does not replace the canonical research acceptance gates, source register or benchmark suite register.

### Task ledger

| Task | State | Evidence / acceptance |
|---|---|---|
| Mainline and PR reconnaissance | DONE_VERIFIED | Current main, open PR metadata, branch refs, current tree and workflow runs inspected. |
| Existing structure preservation | DONE_VERIFIED | Existing directories and seven local skills retained; no bulk moves or branch deletion. |
| Upstream workflow comparison | DONE_VERIFIED | Four requested repositories/revisions documented in `docs/AGENT-WORKFLOWS.md`. |
| Human contribution and PR guidance | DONE_VERIFIED | `CONTRIBUTING.md` and PR template added; links added to navigation. |
| Documentation freshness | DONE_VERIFIED | Main SHA, workflow IDs and PR states reconciled in canonical navigation/structure docs. |
| PR #463 five-dataset matrix | PARTIAL | Gate fails on double-escaped Hangul regex; acceptance requires fix, rerun of steps 19–21, uploaded aggregate-only artifact and all required jobs PASS. |
| PR #462 | DEFERRED pending #463 | Superseded scope; do not merge redundantly. Reconcile/close after #463 is resolved. |
| Neural CharsiuG2P / ByT5 inference | DEFERRED | Default-off jobs were skipped; separate model/license/data-provenance approval and actual inference remain required. |
| Research/release certification | BLOCKED / PARTIAL | Independent phonetics review, phone-inventory validation, holdout/training overlap, Ukrainian target gold and restricted-corpus rights remain open in canonical registers. |

### Commands and verification

No local shell, npm, pytest, build or repository checkout was available through the connected GitHub interface; no local test execution is claimed. Repository reads, PR diffs, exact-head Actions metadata, job-step summaries and failed job logs were inspected through GitHub. The documentation commit created by this continuation must be checked by the four push-triggered main workflows; update this handoff with their exact run IDs and result after they finish.

### Final state and next blocker

The repository remains on the single active integration branch `main`; historical/supporting refs and open PRs are not deleted or blindly merged. No release was published. Readiness remains **software-verified, evidence-scoped research prototype; not independently research-certified or release-ready**.

The next genuine implementation blocker is the PR #463 workflow's Hangul token-count regex. Correct the regex using a literal Hangul range or explicit code-point comparisons, rerun the exact benchmark job, and require the Browser regression plus Seoul/K-SPAN/IPA-Dict matrix to execute before considering any merge. Preserve the distinction between candidate availability and source-resolved accuracy throughout.


## 2026-11-09 continuation — GitHub documentation and five-dataset matrix reconciliation

### Updated mainline state

- Main before this handoff update: `00304f9ee8f2cb219d83c04e5179aa16eae71e99`.
- The sole active integration branch remains `main`; no new task branch was created.
- The four push-triggered workflows on that main commit all passed:
  - tests [42577427196](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42577427196) — PASS; 1,428/1,428 browser tests, Python 3.11/3.12/3.13, teacher-corpus audit and wheel install.
  - system verify [42577426985](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42577426985) — PASS; Python tests, browser tests/build and source redistribution rights gate.
  - master/research artifacts [42577427050](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42577427050) — PASS.
  - Pages deployment [42577426908](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42577426908) — PASS.

### Documentation and GitHub structure

This continuation adds or reconciles:

- `CONTRIBUTING.md` — reproducible setup, canonical ownership, phonetic/IPA evidence discipline, source rights, benchmark reporting, tests and generated artifacts.
- `.github/PULL_REQUEST_TEMPLATE.md` — evidence, licence, denominator, IPA profile, regression and exact-head CI checklist.
- `docs/REPOSITORY-STRUCTURE.md` — a 20-workflow GitHub Actions responsibility map, alongside the existing component/data ownership map.
- `docs/AGENT-WORKFLOWS.md` — all four requested upstream systems are compared in one table; no upstream code or skill text is copied.
- `docs/README.md` and root `README.md` — contributor navigation and a corrected distinction between the long-term corpus acquisition list and the current executable matrix.
- `docs/KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md` and `docs/BENCHMARK-RESULTS-2026-11-08.md` — the current five-dataset target is explicitly UGTPHON, SIGMORPHON, Seoul, K-SPAN 2.1 and IPA-Dict. The earlier KsponSpeech/NIKL list is retained as a long-term access/terms-gated acquisition portfolio, not the executable matrix.
- `tests/kozak-kim-methodology-contract.test.mjs` — its assertions now verify the distinction and the new matrix instead of depending on the old heading.

The current matrix has five datasets and seven reference tracks: UGTPHON (1), SIGMORPHON (1), Seoul surface/phonemic-IPA (2), K-SPAN Modern/Conservative (2), and IPA-Dict (1). K-SPAN's two tracks are one dataset. IPA-Dict is Wiktionary-derived and is not an independent gold lineage from SIGMORPHON even after exact-overlap exclusion. The NIKL MKUFS2 word index used for K-SPAN joins is not a scored NIKL speech dataset.

### Benchmark PR reconciliation

- PR [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463) remains OPEN, head `b348b0f92daab610448312aea26cb99fcc27b036`, base `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`.
- Initial run [42526972593](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42526972593) failed at the Hangul expected-token assertion. A first intermediate fix corrected only one of two identical regex sites; the subsequent push cancelled that intermediate run. The current PR head corrects both regex sites and adds a zero-row diagnostic guard.
- On current head, tests [42576636915](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636915), system verify [42576636817](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636817), master artifacts [42576636900](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636900), exhaustive test-case register [42576636656](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636656), and external UGTPHON [42576636664](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636664) all passed.
- Corrected multi-engine workflow [42576636761](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636761) remains **IN_PROGRESS** in its ten-engine comparison step. The Browser-mode and open Korean matrix (Seoul/K-SPAN/IPA-Dict) steps have not yet run. CharsiuG2P and ByT5 inference jobs are SKIPPED by default.
- PR [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462) remains OPEN but is superseded in scope by #463. Do not merge it redundantly. After #463 is accepted, close #462 as superseded.

### Verification correction on main

Main commit `92ed43866aad08aaa1d5a81134d9935456e98bd5` exposed one stale documentation-contract test: it expected the old phrase `Five-dataset execution policy` after the benchmark register had correctly distinguished the long-term corpus portfolio from the executable matrix. The test was updated to assert the new headings and dataset scope. On `00304f9ee8f2cb219d83c04e5179aa16eae71e99`, the full test matrix passed with 1,428/1,428 browser tests and all four push workflows passed. This is a test-contract update, not a runtime behavior change.

### Remaining acceptance and stop condition

| Task | State | Required acceptance |
|---|---|---|
| Documentation navigation, contribution guidance and workflow map | DONE_VERIFIED on pre-handoff main | Exact-main test, system verify, master artifacts and Pages all PASS. |
| Five-dataset benchmark PR #463 | PARTIAL / IN_PROGRESS | Corrected multi-engine job must finish; steps 19–21 must run; all five dataset reports and mode-availability assertions must pass; aggregate-only artifact and schema checks must be present. |
| PR #462 | DEFERRED pending #463 | Close as superseded only after #463 is merged. |
| KsponSpeech and NIKL Daily Conversation speech data | BLOCKED / ACCESS-TERMS GATED | Authorized acquisition and exact redistribution/reuse terms. NIKL MKUFS2 index use for K-SPAN joins does not clear speech-corpus access. |
| Neural CharsiuG2P / ByT5 inference | DEFERRED | Explicit research run, model/data licence review, overlap audit and actual inference. |
| Research/release certification | BLOCKED / PARTIAL | Independent Korean phonetics review, phone-inventory adjudication, holdout/training overlap review, Ukrainian target gold and outstanding source-rights decisions. |

No merge, release publication or branch deletion has been performed in this continuation. The next action is to wait for the corrected run [42576636761](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636761), inspect its exact artifacts and gate results, then merge #463 only if every required step passes. The repository remains an evidence-scoped research prototype, not independently research-certified or release-ready.

## 2026-11-09 continuation — K-SPAN checksum correction and benchmark rerun

### Exact source correction

- The previous K-SPAN CI attempt successfully downloaded the version 2.1 Dataverse bundle and verified `kspan_base.csv`, but rejected `kspan_doc.pdf`.
- The rejection was caused by an incorrect expected checksum in the benchmark script, not by a corrupt archive or a reason to weaken integrity validation. The script expected `2bf63cc0704a2fe3b4c40445192af77a`; the official DataverseNO file page for `kspan_doc.pdf` (file ID 1009, dataset version 2.1) publishes `2bf63cc0704a2fe3b4c40445192af77f`. The downloaded PDF's actual MD5 is the latter, with a PDF signature and 738,354 bytes.
- Corrected `scripts/run_open_korean_benchmark_ci.py` to the repository-published MD5 `2bf63cc0704a2fe3b4c40445192af77f`. CSV and PDF are still extracted from the same pinned Dataverse v2.1 bundle and both checksums remain enforced.
- Added earlier in the same PR branch: a bundle-extraction helper and tests for exact file selection and ambiguous duplicate filenames.

### Exact-head verification

- Benchmark PR #463 head: `72bcb727d7c8ddf2ddd359f0d3abc4f3056d4ef6`.
- Tests [42584666555](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666555) — PASS.
- System verification [42584666728](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666728) — PASS.
- Exhaustive test-case register [42584666813](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666813) — PASS.
- External UGTPHON diagnostic [42584666591](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666591) — PASS.
- Master/research artifacts [42584666655](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666655) — PASS.
- Multi-engine diagnostic [42584666543](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666543) is still IN_PROGRESS in step 13, “Run multi-engine comparison”; no failure is recorded. The remaining UGTPHON/SIGMORPHON Browser steps and the open Seoul/K-SPAN/IPA-Dict matrix are downstream and have not yet run on this exact head.
- The prior run [42582634269](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42582634269) completed the ten-engine UGTPHON and SIGMORPHON runs, Browser three-mode audits and parity checks, but its open-matrix step failed solely on the erroneous PDF checksum above. Do not treat its open-matrix dataset reports as completed.

### Current disposition

- Main remains at `4778ac435a4be54c4e7e7b73605369ff5f85677a`; this continuation record does not change runtime code.
- PR #463 remains OPEN and mergeable, but is not ready to merge until the exact-head multi-engine job, all downstream open-matrix steps, artifact upload and schema validation pass.
- PR #462 remains OPEN and superseded in scope; leave it untouched until #463 passes and is merged.
- No benchmark metric, dataset accuracy result or release certification is inferred from the checksum correction.


## 2026-11-09 continuation — NIKL word-index encoding failure and correction

### Failure evidence

- Exact-head full-matrix run [42584666543](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666543) completed the UGTPHON and SIGMORPHON ten-engine comparisons, UGTPHON Browser modes and Native/Browser parity, and SIGMORPHON Browser modes and regression suite.
- Its open Korean matrix step failed in `scripts/prepare_korean_open_benchmarks.py::_read_nikl_word_index`: the official `MKUFS2/일반어휘통계.txt` payload could not be decoded as CP949/EUC-KR/UTF-8. K-SPAN's CSV/PDF download and checksums had already passed; the failure occurred before NIKL WordNum joins and the supplemental track benchmarks.
- This was a decoder coverage defect. The script had no UTF-16/UTF-32 support and did not distinguish a successful byte decode from a valid numbered NIKL word index.

### Implemented correction on PR #463

- Added a dedicated decoder that detects UTF-32, UTF-8 BOM, UTF-16 BOM and BOM-less UTF-16 byte patterns, then tries CP949/EUC-KR/UTF-8 fallback encodings.
- A candidate encoding is accepted only if it yields numbered word records; lossy replacement decoding is not used. If all candidates fail, the exception reports the attempted encodings and why each candidate was rejected.
- Added regression coverage for UTF-16LE, UTF-16BE, BOM-marked UTF-16 and invalid binary input. Existing CP949 fixture and full K-SPAN WordNum/Worldbet mapping tests remain.
- PR #463 head after correction: `cded13adb593b510ffa63c05c0a0822d56c0e7ba`. The PR description records the incident and exact fix.

### Exact-head verification

- Tests [42591114502](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114502) — PASS, including Python 3.11/3.12/3.13, browser suite, wheel install and teacher-corpus audit.
- System verification [42591114507](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114507) — PASS, Python regression/data integrity and browser regression/build.
- Test-case register [42591114602](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114602) — PASS.
- External UGTPHON [42591114484](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114484) — PASS.
- Master/research artifacts [42591114301](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114301) — PASS.
- Full multi-engine workflow [42591114417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114417) is currently IN_PROGRESS at step 13, “Run multi-engine comparison”. The NIKL decoder and supplemental Seoul/K-SPAN/IPA-Dict matrix have not yet been exercised on this corrected head. Do not claim the open matrix passed until steps 21 and 22 complete and the uploaded summary passes schema validation.

### Current disposition

- Main at the time of this update: `fc153c295689f57027320263c1a84b12bcb9e7a4`; this handoff update is documentation-only.
- PR #463 remains OPEN and mergeable; do not merge before the exact-head full matrix and artifact checks pass.
- PR #462 remains OPEN and superseded in scope; close it only after #463 is successfully merged.
- The decoder now covers the observed class of encoding failure, but no implementation can guarantee zero failures for every future upstream change or network/runtime condition. CI remains the acceptance gate; a decode that cannot be validated must fail with a diagnostic rather than silently corrupt source words.


---

## 2026-11-09 — documentation/navigation reconciliation and benchmark handoff

**Audited base:** `45a02a62ce955c3db10eb0faaaa1ce8d9f2c9cdb` on `main`.  
**Working branch:** `docs/repository-navigation-reconciliation-2026-11-09`, created from that exact base for this documentation continuation.  
**Scope:** update existing documentation and navigation in place; do not change runtime rules, benchmark data, source labels or dataset contents.

### Work completed in this continuation

- Reconciled the root README, documentation map, repository structure guide, repository audit and this handoff with the live GitHub state.
- Rechecked all four supplied workflow-reference repositories. Their current default-branch HEADs still match the pinned revisions in the existing comparison audit; no upstream material was copied.
- Retrieved exact PR #463 and #462 metadata, compared the benchmark branch against main, and inspected failing workflow logs rather than relying on stale status prose.
- Recorded the actual current-main workflow results and distinguished them from PR benchmark checks and skipped jobs.

### Current verified evidence

- Main Tests [42591577770](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577770): PASS.
- Main System Verify [42591577711](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577711): PASS.
- Main master/research artifacts [42591577812](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577812): PASS.
- Main Pages deployment/live smoke [42591577865](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577865): PASS.
- PR #463 head is `167c12a7e9945dc757a57ea734e9745aa69032f3`; the branch comparison is 91 ahead / 24 behind main from merge base `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`. GitHub branch search returned 31 refs total (main plus 30 non-main); historical refs were not deleted or force-updated.
- Documentation-branch Verify [42677866941](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42677866941) initially failed one browser contract because the structure guide had not yet been updated; the structure-guide correction is in commit `f9da74a5e29c517324170f4616f1c097873ad701`.
- Follow-up Verify [42677948776](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42677948776) passed Python but failed the same documentation contract because the handoff did not yet include the exact #463 head. This update adds that missing reference; the next exact-head run is pending.
- PR #463 Verify [42665749636](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42665749636): Python FAILED; Browser PASS; NIKL metadata-only SKIPPED.
- PR #463 full matrix [42665749678](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42665749678): adapter tests FAILED; later engine/browser/open-matrix stages SKIPPED.
- Local npm/pytest/build commands were not run because this continuation used GitHub connector operations and did not have a local checkout. Do not report local verification.

### Exact blockers

1. Correct the literal two-character CSV delimiter in `tests/test_korean_open_benchmarks.py::test_kspan_key_worldbet_mismatch_is_rejected` to a one-character tab delimiter; acceptance: focused test passes and the intended key/WorldBet mismatch is rejected.
2. Align the `test_nikl_word_index_and_kspan_worldbet_integrity` fixture with the corrected IPA mapping (`kijɐk`); acceptance: fixture agrees with the documented adapter mapping and the full 63,836-row source integrity check remains strict.
3. Rerun the complete adapter tests and exact-head Verify.
4. Rerun the full five-dataset benchmark; require all intended UGTPHON, SIGMORPHON, Seoul, K-SPAN Modern/Conservative and IPA-Dict stages, complete joins, source integrity, Browser modes where applicable, aggregate-only artifact and JSON Schema validation.
5. Reconcile the 24 main-only commits / 13 changed paths with the benchmark branch after its tests pass. The current PR branch is 91 ahead / 24 behind and GitHub reports it dirty; no blind merge is acceptable.
6. Leave PR #462 open until #463 is accepted; then close it as superseded if its only remaining scope is duplicated.

### Task ledger

| Area | State | Next acceptance |
|---|---|---|
| Mainline software CI | DONE_VERIFIED | Already green on audited main SHA. |
| Documentation/navigation update | DONE_VERIFIED | Exact-head CI on this documentation branch must pass. |
| Four workflow-reference snapshots | DONE_VERIFIED | Current upstream HEADs match pinned commits; process-only adoption. |
| Five-dataset benchmark | PARTIAL | Repair two tests and pass the complete exact-head matrix. |
| Main/PR branch reconciliation | TODO | Resolve all 10 main-only paths after benchmark code is green; rerun checks. |
| Independent Korean IPA review | BLOCKED | Qualified independent review required. |
| Independent Ukrainian target review | BLOCKED | Frozen IPA and separate receiving-language review required. |
| Historical 236/239 membership proof | PARTIAL | Original contemporaneous selector evidence is still absent. |
| Raw `ㅠ` span validation | BLOCKED | Raw offsets must be verified. |
| KsponSpeech / NIKL 2022 | BLOCKED | Access and licensing terms unresolved. |
| Optional neural inference | DEFERRED | Default-off policy remains in force. |

### Stop condition and readiness

This documentation pass is not a benchmark completion and does not authorize merging PR #463. The repository remains a software-verified, evidence-scoped research prototype, not release-ready or independently research-certified. Documentation branch head `db61448373dd179ced0c61332a9bdf0ca53f96a3` passed its PR-head checks and was merged into `main` as `d2699911dbc70ef9978e5af06643b1281725a71a` (PR #464). Post-merge main workflows are tracked separately in the closure record above.



## 2026-11-09 continuation — PR #465 controlled five-dataset benchmark port

### Execution checkpoint

- Current default branch: `main` at `920b6365539058b658348855c5daddc066558b15`.
- Working branch: `benchmark/five-dataset-matrix-reconciled-2026-11-09`.
- Current exact head: `253b0757f2043d9acf2ccaf191ce676e1161ee2d`.
- PR [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465): OPEN, mergeable, 9 commits ahead / 0 behind main.
- The branch ports the selected five-dataset benchmark work onto current main; it does not rewrite main directly. PR #463 remains open as the older divergent implementation; #462 remains open and untouched.

### Completed and verified

- K-SPAN 2.1 mapping aligned against the official PDF Table 1; `o → e`, `p → E`, `x → th`, `m → ix`, `j → ˆ`, `u → jˆ`, and the additional `wi` WorldBet sequence is versioned in `kspan-worldbet-to-ipa-v2`.
- CSV delimiter and adapter fixture defects repaired; tests now pass on the exact PR head.
- Exact-head Tests [42692169587](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169587): PASS.
- Exact-head System Verify [42692169687](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169687): Python and Browser PASS; NIKL metadata-only SKIPPED.
- Master/research artifacts [42692169326](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169326): PASS.
- Exhaustive test-case register extraction [42692169308](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169308): PASS.
- External UGTPHON diagnostic [42692169248](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169248): PASS.
- Full matrix [42692169459](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169459): UGTPHON multi-engine, Native/Browser parity, SIGMORPHON multi-engine, Browser Strict/Soft/Super-soft and Browser regression stages PASS. Seoul + K-SPAN + IPA-Dict stage remains IN_PROGRESS; final artifact/schema validation is not yet evidenced.

### K-SPAN data quality warning

The 63,836-row K-SPAN source join reports 22,843 key/WorldBet discrepancies (Modern 13,078; Conservative 9,765). The adapter scores the source `ModernPhon` / `ConservativePhon` WorldBet references directly and audits `ModernKey` / `ConservativeKey` separately. These rows are retained and the discrepancy is surfaced as WARN; do not claim key/WorldBet integrity PASS or semantic equivalence. Unknown symbols, invalid WorldBet sequences, missing joins and row-count drift remain hard failures. Aggregate-only artifacts retain warning status and counts while omitting row-level examples.

### Remaining acceptance

1. Complete run 42692169459. Require successful Seoul surface and phonemic tracks, K-SPAN Modern and Conservative, IPA-Dict, full joins and expected row counts.
2. Inspect aggregate-only JSON artifact; verify no token-level labels/examples leak and the summary JSON Schema validates.
3. Confirm warning counts/status in manifest and summary (22,843 total; Modern 13,078; Conservative 9,765).
4. Run/review all exact-head checks after any final fix.
5. Only then merge PR #465. After successful merge, close #463 as superseded if it contains no unique required scope; decide #462 on its remaining unique scope rather than merging duplicate changes.
6. Keep independent Korean IPA review, Ukrainian target review, 236/239 historical membership proof, raw `ㅠ` span validation and access/terms-gated speech corpora as separate research blockers.

### Readiness

The repository remains a software-verified, evidence-scoped research prototype, not independently research-certified or release-ready. No local shell/npm/pytest execution is claimed in this connector-only session; the named GitHub Actions runs are the verification evidence.



---

## Historical continuation — 2026-11-10 (c42/d71 snapshots, superseded)

**Default branch:** `main` at `920b6365539058b658348855c5daddc066558b15`.  
**Active integration:** PR [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), branch `benchmark/five-dataset-matrix-reconciled-2026-11-09`, current documentation head `f8aacff3087eb5a06d6195bd99171545f647cfe9`; runtime/test head `c42b7f9fee820d83fcbf8fdd75481cab6bc1dfcb`. The branch is based directly on current main; no merge to main has been made.

### Verification on the previous exact head

- Tests [42775398078](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775398078): PASS — Python 3.11/3.12/3.13, Browser, wheel install and teacher-corpus audit.
- System Verify [42775398457](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775398457): Python and Browser PASS; NIKL metadata-only SKIPPED.
- Master/research artifacts [42775398092](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775398092): PASS.
- The b96 multi-engine run [42775398355](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775398355) was cancelled after a newer c42 exact-head run was started; it is not counted as a pass.

### Exact-head CI on c42b7f9 (runtime/test commit)

- Tests [42775643077](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775643077): **PASS** — Python 3.11/3.12/3.13, Browser tests/build, wheel installation and teacher-corpus audit.
- System Verify [42775643096](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775643096): Python and Browser **PASS**; NIKL metadata-only inventory **SKIPPED** by policy.
- Master/research artifacts [42775643066](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775643066): **PASS**.
- Documentation-anchor follow-up Verify [42775637799](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775637799): **PASS**.
- External UGTPHON diagnostic [42775643307](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775643307) and exhaustive test-case extraction [42775643206](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775643206): **IN_PROGRESS** at last inspection.
- Full multi-engine/open-dataset matrix [42775642949](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775642949): **IN_PROGRESS** in the pinned multi-engine comparison. No final matrix score or summary-schema PASS is claimed.
- The prior run [42697496037](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42697496037) reached aggregate JSON Schema validation after producing K-SPAN Modern/Conservative and IPA-Dict Browser reports, then failed because numeric `ipa_profile_version: 1` did not satisfy the schema's string/null type. The summarizer now normalizes non-null versions to strings and a regression test exercises the numeric case.
- Current documentation-only head: `f8aacff3087eb5a06d6195bd99171545f647cfe9`. Its Verify run [42775760233](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775760233) is queued; the c42 runtime/test head has passed the exact checks above.


### K-SPAN data-quality status

The official K-SPAN 2.1 Table 1 remains the source for keystroke/WorldBet/IPA/jamo mapping. Scoring uses source `ModernPhon` / `ConservativePhon` WorldBet references. Parallel key fields are audited independently: 22,843 discrepancies (Modern 13,078; Conservative 9,765) remain a visible `WARN`, not a pass. Rows are not silently discarded or rewritten.

### User-approved fallback policy

For genuinely unresolved morphology, the Browser Super-soft research mode may use the repository's per-grapheme `data/korean/canonical_correspondence.csv` table to construct approximate IPA and then pass that IPA through the ordinary IPA→Ukrainian renderer. The result is typed `orthographic-phonemic-fallback`, marked low confidence, and exposed only as a candidate. It is excluded from source-resolved IPA accuracy scoring. Strict/Soft remain unchanged. The table is project-defined (`model-selected`), not represented as an official Ukrainian national standard. The Python API does not yet expose this fallback; cross-runtime parity is a separate TODO.

### Current ledger and readiness

| Workstream | State | Acceptance / blocker |
|---|---|---|
| Mainline software and documentation baseline | DONE_VERIFIED | Mainline checks passed on the recorded main snapshot. |
| Benchmark preparation, K-SPAN source adapter and integrity diagnostics | PARTIAL | Source mapping grounded; exact full-matrix/schema result still required; 22,843 cross-field discrepancies remain WARN. |
| Summary schema normalization and regression | DONE_VERIFIED on b96 | Exact-head tests passed; rerun on c42 pending. |
| Grapheme-table Browser Super-soft fallback | DONE_VERIFIED in Browser test suite | 11,172 modern Hangul syllable candidate-availability test exists; new trace-to-table assertion is awaiting c42 CI. |
| Python fallback parity | TODO | Implement only with matching provenance/status and Python/browser trace parity tests. |
| Independent Korean IPA and Ukrainian target review | BLOCKED | Qualified independent review and frozen evidence sets are still required. |
| PR #463 / #462 reconciliation | TODO | Leave #463/#462 untouched until #465 passes; then inspect unique scope before closing superseded PRs. |

**Readiness:** software-verified, evidence-scoped research prototype; not release-ready or independently research-certified. No local shell/npm/pytest run is claimed in this connector-only session.


---

# Execution continuation — 2026-11-10 (PR #465 current state)

## Starting point and branch

- Main base: `920b6365539058b658348855c5daddc066558b15`.
- Working branch: `benchmark/five-dataset-matrix-reconciled-2026-11-09`.
- Starting branch HEAD for this continuation: `d71ef50fdef34c86ad864adc10a50ba45d722ecf`.
- PR #465 remains OPEN and mergeable; no changes have been merged into `main`.
- PR #463 and #462 remain open and untouched pending acceptance and unique-scope review.

## Verified implementation and evidence

- K-SPAN 2.1 mapping is implemented as `kspan-worldbet-to-ipa-v2`. The formerly failing WorldBet sequence `wi` is mapped to `wi`; tests cover `wi` and `kanixnkwi`.
- The pinned K-SPAN join has 63,836 rows and 22,843 parallel key/WorldBet discrepancies (Modern 13,078; Conservative 9,765). Source WorldBet fields drive scoring; key fields remain a separate audit. Status is WARN, not PASS.
- The prior matrix failure on `baa77f9` was WordNum 98 / ModernPhon `kanixnkwi`, failing at offset 7 on `wi`. The correction is present on runtime/test head `c42b7f9`.
- On PR head `d71ef50f`: Tests [42775887452](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887452) PASS; System Verify [42775887811](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887811) PASS (NIKL metadata-only SKIPPED); master/research artifacts [42775887930](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887930) PASS; exhaustive register extraction [42775887402](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887402) PASS; external UGTPHON [42775887380](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887380) PASS.
- The d71 multi-engine run [42775887397](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887397) was CANCELLED, not passed. The c42 multi-engine run [42775642949](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775642949) was IN_PROGRESS at the last inspection. Its final result, artifact and schema must be checked before merge.

## Task ledger

| Workstream | State | Next acceptance |
|---|---|---|
| Documentation/navigation foundation from PR #464 | DONE_VERIFIED | Preserved; no duplicate navigation framework added |
| Five-dataset benchmark adapters and preparation | PARTIAL | Complete full open-dataset matrix |
| K-SPAN source consistency | PARTIAL / WARN | Preserve all source rows; independently interpret key/WorldBet discrepancies |
| Aggregate summary/schema | TODO / PENDING | Inspect final artifact and validate schema |
| Python Super-soft fallback parity | TODO | Implement and test provenance-preserving parity |
| Independent Korean IPA and Ukrainian target review | BLOCKED | Qualified independent reviewers and frozen review packets |
| Historical membership and raw offset questions | PARTIAL / BLOCKED | Recover contemporaneous source evidence and verify offsets |
| Restricted speech datasets | BLOCKED | Obtain explicit access/licence terms |
| Neural inference | DEFERRED | Remains opt-in and outside default gate |

## Branch/PR disposition

PR #465 is the controlled port based on current main and remains the only active integration path for this benchmark. PR #463 is an older divergent implementation; do not merge it blindly. PR #462 is a narrower overlapping Browser change; preserve it until its unique scope is reviewed. Do not close or delete branches as cleanup without confirming all unique changes are represented.

## Commands and verification actually executed

No local shell, npm or pytest command was run in this connector-only session. Verification evidence consists of the named GitHub Actions workflows. Cancelled/skipped jobs are not counted as passes; NIKL metadata-only is intentionally skipped by workflow policy.

## Readiness and next blocker

The repository remains a software-verified, evidence-scoped research prototype, not release-ready or independently research-certified. The immediate engineering blocker is a successful completed full matrix and aggregate JSON Schema validation on the final runtime/test head. Independent linguistic review and separate source/access blockers remain after that gate.



## Execution continuation — 2026-11-10 (five-dataset matrix and artifact policy)

### Verified baseline and exact checks

- Starting default branch: `main` at `920b6365539058b658348855c5daddc066558b15`.
- Working branch: `benchmark/five-dataset-matrix-reconciled-2026-11-09`; active PR [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465).
- Full scoring matrix completed in [run 42785083152](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42785083152): UGTPHON, SIGMORPHON, Seoul phonemic IPA, K-SPAN Modern, K-SPAN Conservative and IPA-Dict were compared by ten engines; fifteen Browser reports cover five datasets. Seoul's six full-corpus Browser reports are separately evidenced by run 42496539257.
- Exact-head standard checks: Python 3.11/3.12/3.13 + Browser + wheel + teacher audit PASS (42796414347); System Verify PASS (42796413910); master/research artifacts PASS (42796414305); exhaustive register extraction PASS (42796414508); UGTPHON diagnostic PASS (42796413990).
- Exact-head aggregate-only workflow integration is still running in 42796414336 at the time of this handoff. It must complete, and its artifact must be inspected, before marking the artifact policy DONE_VERIFIED.

### Source and score interpretation

- K-SPAN source join: 63,836/63,836 WordNum rows; 41,174 Hangul, 22,662 non-Hangul, zero unmatched.
- K-SPAN cross-representation integrity remains WARN: 22,843 mismatches (Modern 13,078; Conservative 9,765). Score from source WorldBet fields; audit parallel key fields; never rewrite or drop rows.
- Highest open-track Exact: Seoul IPA 21.2% KoG2P; K-SPAN Modern 25.0% KoG2P; K-SPAN Conservative 18.8% KoG2P; IPA-Dict 41.265% Native (411/996). These are separate diagnostic references, not a shared leaderboard.
- Super-soft candidate availability is 100% across the five Browser-tested datasets; heuristic/fallback outputs do not count as source-resolved IPA accuracy.
- SIGMORPHON and IPA-Dict share Wiktionary lineage; IPA-Dict is not an independent holdout.
- Optional ByT5/CharsiuG2P inference and NIKL metadata-only inventory were skipped, not passed.

### Artifact policy correction

Inspection found three legacy consolidated-workflow artifacts with row-level reports and/or source TSV/reviewer material: 13621335293 (expires 2026-12-08), 13749341395 (expires 2026-12-10; also contains the raw K-SPAN preparation manifest with ten examples), and 13750158865 (expires 2026-12-10). The current GitHub integration can list/download but cannot delete artifacts. The workflow now builds a combined aggregate-only summary and restricts the new artifact to that JSON plus source checksums. Manual deletion or automatic expiry is required for legacy artifacts; see `docs/BENCHMARK-ARTIFACT-POLICY.md`.

### Task ledger

| Task | Status | Evidence / blocker |
|---|---|---|
| Six-track ten-engine scoring | DONE_VERIFIED | Run 42785083152 |
| Fifteen Browser reports across five datasets | DONE_VERIFIED | Run 42785083152 |
| Seoul full-corpus Browser surface/phonemic modes | DONE_VERIFIED | Run 42496539257 |
| K-SPAN complete source join | DONE_VERIFIED | Run 42785083152; zero unmatched WordNums |
| K-SPAN key/WorldBet consistency | WARN | 22,843 source cross-representation differences remain |
| Aggregate-only workflow integration | PARTIAL | Run 42796414336 must finish and artifact ZIP must contain exactly two allowed files |
| SIGMORPHON source registry + license parser extension | PARTIAL | New 239-row register and rights tests await exact-head CI |
| Independent Korean IPA gold | BLOCKED | No independent adjudicated source gold |
| Independent Ukrainian target gold | BLOCKED | No separately reviewed target layer |
| Historical 236/239 selector and raw ㅠ offsets | BLOCKED | Original audio/speaker crosswalk and raw offset evidence absent |
| KsponSpeech / NIKL Daily Conversation | BLOCKED | Access/terms evidence unavailable |
| Optional neural inference | DEFERRED | Explicitly skipped; not needed for deterministic matrix |

### Branch reconciliation

- PR #465 is the controlled port onto current main; it includes the implementation and tests from the older matrix work.
- PR #463's twelve changed paths are represented in PR #465; its older branch is not merged blindly.
- PR #462's SIGMORPHON three-mode workflow behavior is represented in PR #465 with the corrected 999 eligible-occurrence denominator; its stale denominator/trigger differences are not reused.
- Preserve both old branches until PR #465 is merged; then close the superseded PRs without deleting their branches.

**Readiness:** the deterministic benchmark suite is software-verified research infrastructure, not a release-ready phonetic product. Independent linguistic validation and the artifact-policy integration gate remain separate acceptance conditions.


## Execution handoff — 2026-11-10 final integration on main

### Starting state and integration

- Starting default branch: `main` at `920b6365539058b658348855c5daddc066558b15`.
- User-selected integration policy: one active branch, `main`; no new task branch was created by this continuation.
- PR #465 was reviewed and merged into main from exact tested head `18bafbe9d998f7fe818c9b65ec84d3b5098d6dfa`.
- Merge commit: `e8ebed5b9ccb67255209ccb20efa45ae0236bcbe`.
- The older PR #463 branch was divergent and stale; its intended implementation was ported onto current main in #465. PR #462's narrower Browser three-mode verification is included in #465. Close #463 and #462 as superseded; preserve their branches.

### Exact commands and results

The full matrix workflow [42810042908](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042908) completed successfully. Its job steps report PASS for source/engine pin and licence checks, adapter tests, training-readiness audit, reviewer packet generation, ten-engine comparisons, UGTPHON and SIGMORPHON Browser modes, Native/Browser parity, Seoul/K-SPAN/IPA-Dict matrix, aggregate summary and upload.

Other exact PR-head runs:
- Tests / Python 3.11, 3.12, 3.13 / Browser / wheel install / teacher corpus: [42810042726](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042726) — PASS.
- System Verify: [42810042823](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042823) — PASS.
- Master/research artifacts: [42810042775](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042775) — PASS.
- Exhaustive test-case register: [42810043038](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810043038) — PASS.
- External UGTPHON diagnostic: [42810042906](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042906) — PASS.

These are GitHub Actions checks on PR head, not local shell/npm/pytest runs and not post-merge-main evidence. The connector-only environment did not provide a local repository checkout; no local test command is claimed. Post-merge/final-documentation exact-main CI remains the next software verification gate.

### Benchmark evidence

- Six ten-engine tracks: UGTPHON, SIGMORPHON 2021, Seoul phonemic IPA, K-SPAN Modern, K-SPAN Conservative, IPA-Dict Korean.
- Fifteen Browser reports: Strict/Soft/Super-soft on UGTPHON, SIGMORPHON, K-SPAN Modern, K-SPAN Conservative and IPA-Dict.
- Seoul full-corpus Browser Hangul surface and phonemic-IPA reports remain separately evidenced by run 42496539257.
- K-SPAN 63,836 rows; 41,174 Hangul and 22,662 non-Hangul; zero unmatched WordNums.
- K-SPAN key/WorldBet differences remain WARN: 22,843 total (Modern 13,078; Conservative 9,765).
- One external g2p-ko error on IPA-Dict (999/1,000 scored); Browser errors zero.
- Super-soft candidate availability 100% on five Browser-tested dataset tracks; not an accuracy or source-resolved coverage claim.
- IPA-Dict shares Wiktionary lineage with SIGMORPHON; Seoul labels are phonemic, not narrow phonetic IPA.

### Artifact verification

Artifact 13766007256 was downloaded and inspected. It contains exactly two files: aggregate JSON (293,134 bytes) and source checksum list (410 bytes). It contains no token-level source text, IPA labels, mismatch examples or occurrence ledgers. Schema validation passed during summary generation. ZIP SHA-256: `fa3281b337b60fccbf3ebc03796498325619138e2393ba54ddc9513c8d9598a3`.

Legacy artifacts 13621335293, 13749341395 and 13750158865 still contain older row-level materials and remain until expiry/manual cleanup. The connector has no delete-artifact action; do not claim they were deleted. See `docs/BENCHMARK-ARTIFACT-POLICY.md`.

### Final task ledger

| Task | Status | Acceptance / blocker |
|---|---|---|
| Four upstream methodology review | DONE_VERIFIED | Current upstream HEADs rechecked; unchanged from reviewed pins. |
| Existing documentation/skills/navigation reconciliation | DONE_VERIFIED | Root README, docs index, structure guide, audit, handoff, benchmark dashboard and acceptance/roadmap updated in place. |
| Five-dataset scoring matrix | DONE_VERIFIED | PR #465 merged; full exact-head run 42810042908. |
| Aggregate-only artifact policy | DONE_VERIFIED | Artifact 13766007256 inspected; exactly two allowed files. |
| Final post-merge main CI | TODO / PENDING | Exact-main checks must pass after final documentation commit. |
| K-SPAN representation mismatch | WARN | 22,843 differences remain; independent linguistic interpretation needed. |
| Independent Korean IPA review | BLOCKED | Independent qualified annotations/adjudication absent. |
| Ukrainian target gold/review | BLOCKED | Separate target-language review absent. |
| 236/239 historical membership and raw ㅠ offsets | BLOCKED / PARTIAL | Original historical selector/run and raw offsets absent. |
| KsponSpeech/NIKL speech corpus | BLOCKED | Authorized access and corpus-specific reuse terms absent. |
| Neural inference | DEFERRED | Optional, skipped by policy; not needed for deterministic benchmark completion. |
| Legacy artifact cleanup | BLOCKED | Manual GitHub owner action or expiry; integration cannot delete. |

**Next action:** close PR #463 and #462 as superseded while retaining branches, then verify post-merge and final documentation commits on main. If those checks pass, the software benchmark integration is complete; the product remains a research prototype pending independent linguistic and rights acceptance.

## Final mainline verification update — 2026-11-10

The final documentation/contract-test main commit at this checkpoint is `b75d36387b089e3e72a54bdc92f28b12f0fbac4c`. Post-merge GitHub Actions on this exact main SHA:

- Tests [42829722954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42829722954): **PASS** — Python 3.11/3.12/3.13, Browser/web, wheel installation and teacher-corpus audit.
- System Verify [42829722907](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42829722907): **PASS** — Python regression/data integrity and Browser regression/build. Official NIKL metadata-only inventory: **SKIPPED**.
- Master/research artifacts [42829723048](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42829723048): **PASS**.
- GitHub Pages deployment [42829722877](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42829722877): **PENDING**, not PASS. An earlier Pages run [42829130839](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42829130839) remains in progress on an older documentation commit and the latest deployment has not started. No deployment failure is recorded; do not claim live deployment on the final docs SHA until this run completes.

These are GitHub Actions results; no local npm/pytest execution is claimed. The next documentation commit will itself receive a new exact-head CI run. The final repository state is software-verified for tests, system verification and research artifact generation; Pages deployment remains the only observed post-merge workflow still pending.


## Three-tier research-mode refactor — 2026-11-10 (PR #466)

The browser research engine now distinguishes three levels by confidence/coverage:

- **Strict:** unchanged evidence-gated path; unresolved morphology still fails closed.
- **Soft:** inherits the former Super-soft maximum-coverage heuristic path (formal morphology, broader practical heuristics and typed IPA fallback). Candidate spans remain explicitly low-confidence.
- **Super-soft:** new grapheme-only IPA fallback. It decomposes modern Hangul syllable blocks into onset/vowel/coda Jamo, constructs an underlying IPA candidate without inferring contextual assimilation, liaison, fortition, palatalization or morphology, then uses the existing IPA → Ukrainian adapter. Exact source-backed lexical readings remain available.

**Exact-head verification:** PR #466 head 7ee23c8ab1984e7ae156c4a25360a0d167ea6ef7; Verify workflow [42843823095](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42843823095) **PASS** — Python regression/data integrity, full browser regression suite, source redistribution rights gate, Vite build and generated-page checks. The new Super-soft regression exercises all 11,172 modern Hangul syllable blocks through IPA → Ukrainian mapping; existing Soft coverage/adversarial tests preserve the former broad heuristic behavior. NIKL metadata-only inventory remains **SKIPPED**.

**Evidence boundary:** 100% Super-soft coverage is availability of a typed grapheme-derived candidate, not 100% correct Korean pronunciation. Earlier benchmark reports predate this mode reassignment and must not be relabelled as measurements of the new Soft/Super-soft definitions. Rerun the full benchmark matrix against the merged exact main commit before publishing updated comparative scores. GitHub Pages deployment is also pending until the PR is merged and the main-branch Pages workflow completes.


## PR #466 merged and Pages publication — 2026-11-10

- **Default branch:** `main`; merge commit `fa2998acaa0fdd154c9b4d3c1927778f77bac199`.
- **Modes deployed:** Strict unchanged; Soft inherits the former broad heuristic/maximum-coverage path; Super-soft is the new grapheme-only Jamo → underlying IPA → Ukrainian fallback.
- **Coverage contract:** exhaustive technical test across all 11,172 modern precomposed Hangul syllable blocks. This is candidate availability, not pronunciation accuracy.
- **PR #466 exact-head checks:** Verify, tests, Browser G2P, UGTPHON diagnostic, exhaustive test register and master/research artifacts all **PASS**. Optional neural inference and NIKL metadata-only inventory were **SKIPPED** by policy.
- **Mainline Pages run [42858765455](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42858765455):** Python 3.11/3.12/3.13, browser regression/build, deployment and public-page smoke test **PASS**. The final live adversarial practical-mode browser smoke passed on deployed code commit `fa2998acaa0fdd154c9b4d3c1927778f77bac199` (job `129980268421`). The redesigned pages still require a post-merge deployment and smoke.
- **Fresh three-mode benchmark [42858765799](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42858765799):** completed **PASS**; aggregate-only artifact `13785753702` contains the summary JSON and source-hash manifest. All 15 browser reports have zero engine errors; Super-soft candidate availability is 100% across five datasets, while source-resolved scoring coverage is only 0.30–2.03%. Strict has the highest coverage-adjusted exact match on all five datasets. Optional neural inference jobs were SKIPPED.
- **Source/documentation note:** the benchmark artifact is verified; no raw corpus text or IPA examples are redistributed. No local npm/pytest execution is claimed; results above are GitHub Actions evidence.


## PR #467 — Korean editorial workbench merged and published — 2026-11-11

- **PR:** [#467](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/467), merged.
- **Pre-merge branch head:** `03d01929c69d7a1f33b61bd73cce8399827f42d7`.
- **Merge commit on main:** `a8049db0a26dbe5db5dd599e2b7cff7e8b0ab3fc`; base before merge `37c922935b30ca5f46a4f5d37bd5e435f3c28cb6`.
- **Public site:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- **Deployment and live verification:** mainline Pages run [42973501632](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973501632) **PASS**. Python 3.11/3.12/3.13 checks, browser regression/build, Pages deployment, public page smoke and adversarial live browser smoke all passed.
- **Live browser smoke evidence:** 1,443 Korean input characters; inline candidate 2,982 characters; IPA output 3,731 characters. The smoke also verified deterministic Hanja dictionary loading/output, live result announcement, mode disclosure, clipboard-denial fallback, mobile trace labels at 390 px and methodology navigation. Final status was explicitly a preliminary candidate, not a confirmed result.
- **Exact pre-merge verification:** [Tests 42973176920](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176920) **PASS** (1,440/1,440); [Verify 42973176929](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176929) **PASS**; [Browser G2P 42973176957](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176957) **PASS**; [master/research artifacts 42973177011](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973177011) **PASS**; [exhaustive register 42973176965](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176965) **PASS**; [visual review 42973177099](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973177099) **PASS**, artifact `13834655772`.
- **Visual QA:** both pages captured at 1440, 1024, 768, 390 and 320 px; no horizontal overflow; keyboard focus, reduced motion and touch-target checks passed. Desktop and mobile captures were inspected.
- **Design and copy:** dedicated editorial stylesheet, jogakbo/bojagi modular composition, real Hangul → IPA → Ukrainian specimen, paper/ink/cobalt palette, restrained signal colors, long-form methodology reading surface and Ukrainian technical labels. No runtime dependency, JS engine or mode change.
- **Skills applied:** taste-skill, Anthropic frontend-design, Impeccable, Emil Kowalski skills, unlazy, Superpowers, Matt Pocock skills and Ponytail. Skill guidance, source references and execution limitations are documented in the design brief.
- **Skipped, not passed:** NIKL metadata-only inventory remains skipped by configured policy; optional neural inference was not required for this visual task.
- **Environment note:** no local npm/Playwright run is claimed. GitHub Actions and inspected browser artifacts are the verification evidence.

**Design task status: DONE_VERIFIED.** There is no remaining design-specific blocker. Independent Korean pronunciation and Ukrainian transcription validation remain separate research requirements; this visual redesign does not claim linguistic certification.


## PR #468 — Korean editorial rationale and final usability pass — 2026-11-11

- **PR:** [#468](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/468), merged.
- **Pre-merge exact head:** ef7333ecd6ae7bd1e6289b018f75647f9c74f04b; **merge commit:** 2d56d5a5d4ccdabc53b503bea5891c4f14c3ac47; previous main 70ce6a57e87d87b3a75cc417df296dd19054a8e7.
- **Public site:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- **User-facing refinements:** methodology page explains the jogakbo-inspired composition in Ukrainian as plain editorial copy; the Korean textarea has no placeholder; all fixed-size editorial type is at least 13px. The explanation has no callout-card background or coloured side rail.
- **Design contract:** tests cover the no-placeholder input, 13px minimum and non-card rationale treatment. No conversion engine, modes, linguistic data, CSP or runtime dependencies changed.
- **Exact pre-merge checks:** Tests [42976476837](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476837) **PASS** (1,444/1,444; Python 3.11/3.12/3.13, teacher-corpus audit, clean wheel); Verify [42976476750](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476750) **PASS**; Browser G2P [42976476744](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476744) **PASS**; master/research artifacts [42976476728](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476728) **PASS**; exhaustive register [42976476794](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476794) **PASS**; rendered visual review [42976476724](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476724) **PASS**, artifact 13835153662.
- **Mainline exact-merge verification:** Tests [42976784058](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976784058) **PASS** (1,444/1,444; Python 3.11/3.12/3.13, teacher-corpus audit, wheel install); Verify [42976783959](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976783959) **PASS**; master/research artifacts [42976784010](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976784010) **PASS**.
- **Pages deployment:** [42976783914](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976783914) **PASS** — Python 3.11/3.12/3.13, browser regression/build, public Pages deployment and public-page smoke all passed. Live practical-mode adversarial browser smoke also **PASS**: 1,443 Korean input characters; candidate 2,982 characters; IPA 3,731 characters; final status explicitly identifies a preliminary candidate, not a confirmed result.
- **Visual QA:** service and methodology captures at 1440, 1024, 768, 390 and 320 px; no horizontal overflow. Desktop, mobile and methodology hero were inspected. Focus, reduced-motion and touch-target checks are covered by the visual workflow.
- **Evidence limits:** NIKL metadata-only inventory remains **SKIPPED** by configured policy, not passed. No local npm/pytest execution is claimed; GitHub Actions and captured browser artifacts are the verification evidence.
- **Skills applied:** taste-skill, Anthropic frontend-design, Impeccable (Operate/Read modes and craft floor), Emil Kowalski's animation guidance, Superpowers TDD/systematic debugging, plus the previously applied unlazy, Matt Pocock and Ponytail workflows. No decorative animation was added because it would not improve this frequently used tool. Impeccable's local launcher was unavailable in the connector-only runtime; its references were read directly and the rendered captures were inspected.

**Design task status: DONE_VERIFIED and published.** No design-specific blocker remains. Independent Korean pronunciation and Ukrainian target gold-data review remain separate research acceptance requirements.


## 2026-11-11 — approved vertical-flow correction (PR #470)

**Task ledger**

| Requirement | State | Evidence |
|---|---|---|
| One-column hero and Hangul → IPA → Ukrainian specimen | DONE_VERIFIED | Rendered review [42985071214](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42985071214) on desktop, laptop, tablet, mobile and 320 px narrow mobile; post-merge Pages live smoke [42985384175](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42985384175) also passed. |
| Service order: input → mode → action → Ukrainian → IPA → RR → Hanja → analysis → alternatives → trace | DONE_VERIFIED | DOM-order regression and exact-head browser test; the primary action calls the existing renderer while live conversion remains active. |
| Remove object-level header/footer strips throughout both pages | DONE_VERIFIED | Specimen strips, result metadata bars, trace-column band, table header bands, numbered side rails, status chips and disclosure badges removed; zero matching chrome elements in rendered review. |
| Methodology contents and all sections in one vertical reading flow | DONE_VERIFIED | Heading anchors retained inline with headings; contents, sections, evidence lists, vowel inventory and decision rows render top-to-bottom. |
| Responsive layout and focus/reduced-motion behavior | DONE_VERIFIED | Editorial visual review run 42985071214; 10 page/viewport combinations at 1440, 1024, 768, 390 and 320 px. Post-merge live Pages UX smoke also passed at 390 px. No horizontal overflow; focus and reduced-motion checks passed. |
| Full web test suite and production build | DONE_VERIFIED | Post-merge exact-main System Verify run 42985384183: 1,442/1,442 Node tests, Python regression/data integrity, source-rights audit, Vite build and generated-page checks passed. |
| Python, corpus, benchmark-register and browser G2P regressions | DONE_VERIFIED | Post-merge Tests run 42985384248: Python 3.11/3.12/3.13, 1,442/1,442 web tests, wheel install and teacher-corpus audit passed; Browser G2P 42985384335 passed; test-register extraction 42985071471 passed; master/research artifacts 42985384171 passed. |
| Public GitHub Pages deployment and live UX smoke | DONE_VERIFIED | Post-merge deployment run 42985384175 passed HTTP checks for both pages and JS asset, plus live browser smoke for result announcement, mode disclosure, clipboard fallback, mobile trace labels and methodology navigation. |
| Official NIKL live source inventory | DEFERRED / SKIPPED BY POLICY | The workflow's metadata-only inventory job was skipped by its configured branch policy; it is not counted as a pass and is unrelated to this UI correction. |
| Manual screen-reader speech, mode-comprehension study and conversion-latency study | PARTIAL / OUT OF THIS UI CHANGE | Automated semantic labels, focus and responsive checks pass; real assistive-technology speech, participant comprehension and latency measurements remain separate evidence tasks. |

**Repository state:** implementation branch `design/vertical-flow-no-object-chrome-2026-11-11`, based on `main` at `b5f9de943e1d578da33d6fcb7ba7ef7301472d6a`; implementation snapshot `1689da6b0e03130e0f8a38a36498d5755ed8f981`; final PR head `5e6d6dfe77ecde48309b27f3fa50f730815d3b6d`. PR [#470](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/470) was merged as `5cf22096dee9caae74cb9be7643184ec8c8b32d8`. The post-merge Pages deployment and live UX smoke passed. No pronunciation rules, IPA adapter, lexical data or runtime dependencies were changed. No local npm/pytest run is claimed; verification evidence is from GitHub Actions.

**Readiness:** the vertical-flow UI correction is DONE_VERIFIED and published on GitHub Pages. This does not change the repository's broader status as a partial research prototype; independent phonetic/target review and source-rights gates remain separate.


## 2026-11-11 — restore visual character after vertical-flow correction (PR #473)

The first vertical-flow correction met the reading-order and object-chrome requirements but over-flattened the visual system. It removed much of the colour and typographic hierarchy that made the Korean editorial workbench recognisable. PR #473 restores those design cues without reverting the approved layout.

| Requirement | State | Evidence |
|---|---|---|
| Keep all service and methodology content in one vertical reading flow | DONE_VERIFIED | Exact-head rendered review [42988127319](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127319) passed desktop, tablet, mobile and narrow-mobile viewports. |
| Keep specimen free of visible object-level labels and top/bottom strips | DONE_VERIFIED | The specimen communicates through Hangul, IPA and Ukrainian typographic hierarchy; visible label strips remain absent. |
| Restore Korean editorial identity and visual hierarchy | DONE_VERIFIED | Cobalt and restrained pink typography, hanji-like surfaces, clear control grouping, methodology accents and stronger section typography restored. |
| Preserve high-contrast actions and accessible touch targets | DONE_VERIFIED | Primary action uses white-on-cobalt; copy controls are at least 44 px high. Rendered review passed. |
| Regression suite and production build | DONE_VERIFIED | Tests [42988127248](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127248): 1,443/1,443 web tests, Python 3.11/3.12/3.13, wheel install and teacher-corpus audit passed. System Verify [42988127245](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127245) passed browser regression/build and Python regression/data integrity. |
| Master/research artifacts and test-register extraction | DONE_VERIFIED | Runs [42988127246](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127246) and [42988127239](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127239) passed. |
| Linguistic pipeline, rules and data | UNCHANGED | This is a CSS and UI-contract test correction only; no pronunciation, IPA adapter, lexical data or runtime logic changed. |

**Repository state:** PR [#473](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/473) merged into `main` as `4dd7b600583fbb6f271664087e513d9fb1ce2fd6`. Final tested branch head: `f20f4d25a9a550dc278284f603a8df42fc571835`. No local test execution is claimed; verification is from the exact-head GitHub Actions runs above.

**Readiness:** this specific visual correction is DONE_VERIFIED. The repository remains a partial research prototype overall; this UI fix does not close independent linguistic evidence, source-rights or human-evaluation gates.


## 2026-11-11 — scope correction: only the input and answer windows stack

**User clarification:** the vertical instruction applied only to the Korean text-entry window and the answer window. It did not apply to the hero, the Hangul/IPA/Ukrainian specimen, the methodology contents, tables, evidence grids or other editorial compositions. The previous PRs #470/#473 overgeneralised the request and flattened those unrelated parts of the design. That interpretation was incorrect.

**Corrected implementation**
- PR [#475](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/475) restores the pre-#470 editorial layout baseline and sets only `.workspace-layout` to one column: input/workbench first, answer/results second.
- The hero returns to its side-by-side desktop composition; the three-stage specimen is again a horizontal, asymmetric colour composition without visible object-level labels or top/bottom strips.
- The result detail cards retain their two-column desktop grid. Methodology contents, rule grids, comparison tables, evidence and vowel inventories retain their grouped layouts; methodology section anchors remain inline with headings.
- Responsive breakpoints adapt the hero/specimen and internal grids. The input and answer windows remain sequential at every width.
- PR [#477](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/477) aligns specimen colours with their semantic roles: IPA = signal yellow; Ukrainian = signal pink.
- No conversion, pronunciation, IPA adapter or data logic changed.

**Verification**
- Rendered browser review [42990218241](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42990218241) passed all 10 page/viewport combinations (1440, 1024, 768, 390, 320 px), including overflow, focus, reduced motion, touch targets, no object chrome and the restored desktop compositions.
- Exact-head System Verify [42990597830](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42990597830) passed browser regression/build and Python regression/data integrity.
- Exact-head Tests [42991034581](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42991034581) passed web tests, Python 3.11/3.12/3.13, wheel installation and teacher-corpus audit.
- Exact-head rendered review after the semantic colour correction [42991034345](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42991034345) passed.

**Repository state:** PR #475 merged as `12984dcf30ea414b45e6d5ff5e5e07623a047312`; PR #477 merged as `f786f6cee3882e2c495680b856041be678526b4a`. Final implementation branch head before squash merge: `103add651399205e6ff3a032db9e1412f03b1400`. Main now contains the scoped layout and corrected semantic palette.

**Readiness:** the scoped visual correction is DONE_VERIFIED. The broader repository remains a partial research prototype; this UI correction does not close independent linguistic evidence or human-evaluation gates.


## 2026-11-11 — result provenance belongs to the Ukrainian output

**Scope:** a narrow visual-layout correction within the already-verified Korean editorial workbench. The earlier rendered desktop screenshot showed the live engine/mode provenance as an independent `.result-grid` child. This created an orphaned gray cell and displaced the IPA card. The provenance now lives inside `#panel-ukrainian`; CSS presents it as quiet text without a badge surface. The five supporting result cards remain in their two-column desktop grid. Conversion, phonology, IPA, Ukrainian mapping and data logic are unchanged.

**Task ledger**
- Regression contract for provenance ownership: **DONE_VERIFIED** — `tests/korean-editorial-design-contract.test.mjs`; valid RED run [42995360086](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42995360086).
- Markup and CSS correction: **DONE_VERIFIED** — commit `ba2ef860c515851f22618e8f33e1e1fa51aba71c`.
- Exact-head Verify: **DONE_VERIFIED** — [42995616576](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42995616576): 1,444/1,444 Node tests, source-rights gate, build and generated-page checks passed; Python regression/data-integrity job passed.
- Browser-rendered ownership assertion and five-viewport captures: **DONE_VERIFIED** — Editorial visual review [42996069104](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069104) passed 10 page/viewport combinations (1440, 1024, 768, 390, 320 px); artifact [13843693958](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069104) inspected at desktop and mobile. Playwright asserts provenance ownership and five result cards.
- Manual screen-reader speech, mode comprehension and conversion-latency studies: **PARTIAL**; not claimed by this layout fix.

**Additional PR-head gates:** Verify [42996069023](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069023) passed; Tests [42996069075](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069075) passed 1,444/1,444 Node tests, Python 3.11/3.12/3.13, wheel installation and teacher-corpus audit; Browser G2P [42996069046](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069046), test-register extraction [42996069171](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069171) and master/research artifacts [42996069076](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069076) passed. PR [#479](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/479) is clean and mergeable; public deployment is pending merge.

**Execution environment:** the connector can read and write GitHub branches, but a local `git clone` could not resolve `github.com` (DNS/network unavailable). Tests and builds are therefore verified through GitHub Actions, not claimed as locally executed. The dedicated branch is `design/fix-result-provenance-layout-2026-11-11`, based on main `d0cd901a482e9fbcaa299de2274b9ba58f72ae35`. PR #479 merged as `da33e2279bfe7218c1ad4c4632dfb44d18f3f3bf`. Mainline Tests [42997176514](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176514), Verify [42997176635](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176635) and master/research artifacts [42997176540](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176540) passed. Pages deployment [42997176343](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176343) and public HTTP/live browser smoke passed; the correction is published.


## 2026-11-11 — full site redesign: Seoul Type

**Starting main:** `04214ecdce34b6efb76823060012d8481e3bbeb2`  
**Integration branch:** `main` (repository operating guide designates main for ordinary continuation work).  
**Design:** replace the previous jogakbo-inspired look with contemporary Korean typographic publishing, independent poster composition and practical wayfinding. Service remains Operate; methodology remains Read.

**Files changed**
- `src/styles/editorial.css` — complete visual-system replacement; no runtime behavior or linguistic logic changes.
- `index.html`, `system.html` — refreshed cache keys/theme color and updated design concept copy.
- `DESIGN.md` — canonical design system replaced.
- `docs/superpowers/specs/2026-11-11-seoul-type-system-redesign.md` — design brief, cultural anchors, sources and acceptance.
- `tests/web-ui-contract.test.mjs` — source-level design contract assertions.
- `.github/workflows/editorial-visual-review.yml` — rendered review now runs on pushes to main as well as PRs/manual dispatch.
- This handoff and `docs/audits/UX-UI-AUDIT-2026-10-28.md` — dated outcome and verification register.

**Non-negotiable layout:** only the Korean input and answer windows are stacked, input first. Hero, specimen, supporting result grid, methodology contents, evidence grids and tables retain their own editorial compositions. No decorative object-level title/footer strips or visible captions were added.

**Skills and tooling:** taste-skill, Anthropic frontend-design, Impeccable, Emil Kowalski, Superpowers, mattpocock, unlazy and ponytail guidance was reviewed. Superdesign CLI preflight timed out; no canvas/mockup is claimed. The project-local impeccable launcher and Superdesign canvas were unavailable through this connector-only runtime. The repository's rendered visual-review workflow is enabled for push verification.

**Verification ledger**
- Source-contract assertions, Node tests, production build: pending exact-head CI.
- Python/data/research gates: pending existing Verify/Tests workflows; no claim until observed.
- Rendered review at 1440, 1024, 768, 390 and 320 px: pending.
- Pages deployment and live smoke: pending.
- Local shell test/build: not run; no verified local repository checkout in this session.

**Scope exclusions:** no phonology, IPA, Ukrainian mapping, data, corpus, benchmark, security policy or runtime dependency changes.


**Rendered-review contract follow-up:** the focus-colour assertion now matches the replacement cobalt token (`#254BD8`); the small signal-red text token is darkened to `#AD3426` for contrast on the paper ground. Re-run the full exact-head visual review after this correction.


**CI reconciliation:** first visual-review run `42999975019` rendered all 10 combinations with no overflow, correct input/result order, preserved editorial compositions and zero object chrome; its only failure was a stale assertion requiring cobalt focus inside the dark workbench. First Verify run `42999975013` exposed six stale assertions in `tests/korean-editorial-design-contract.test.mjs` that still required the superseded jogakbo palette, markup and copy. Those tests and the focus contract were updated to the new system; exact-head reruns remain pending.


**Final focus-review correction:** the previous attempt to update the focus assertion did not match the script's exact source block. The current source now determines whether the focused control is inside the dark workbench and expects acid-yellow there, cobalt on light surfaces. A source-contract assertion covers this branch. The exact-head rendered review must confirm it.


## Final verification — 2026-11-11

**Verified implementation commit:** `0cb829d2d44077eba9296a1c8759cc8216a3859d`  
**Final integration branch:** `main`  
**Starting commit:** `04214ecdce34b6efb76823060012d8481e3bbeb2`

### Completed outcomes

- **DONE_VERIFIED — design research and direction:** seven visual anchors documented; primary sources and studio case studies linked in `DESIGN.md` and the dated spec.
- **DONE_VERIFIED — two-page visual redesign:** service and methodology use the Seoul Type system; no runtime, IPA, phonology, data or conversion code changed.
- **DONE_VERIFIED — layout scope:** only the input and answer windows are vertically stacked; hero/specimen, result support grid, methodology index, evidence grids and tables retain their independent editorial layouts.
- **DONE_VERIFIED — accessibility/responsive checks:** focus is context-sensitive (acid yellow on the dark workbench, cobalt on light surfaces); reduced motion, touch targets, 320px layout and no horizontal overflow are checked.
- **DONE_VERIFIED — deployment:** both public pages return HTTP 200 and the live practical-mode browser smoke passed.

### Exact-head verification evidence

- **Tests:** [run 43000524061](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43000524061) — success. Node web suite: 1,445 tests passed, 0 failed. Python 3.11, 3.12 and 3.13 passed; wheel install and teacher-corpus audit passed.
- **Verify:** [run 43000523976](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43000523976) — success. Browser regression/build and Python regression/data integrity passed. Official NIKL metadata-only inventory was skipped by its configured condition.
- **Rendered visual review:** [run 43000524213](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43000524213) — success. Ten rendered combinations (both pages at 1440, 1024, 768, 390 and 320 px); no horizontal overflow; input/output order, editorial compositions, zero object-level chrome, visible focus, reduced motion and touch targets passed. Screenshots uploaded as workflow artifact.
- **Pages deployment and live smoke:** [run 43000523955](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43000523955) — success. Python 3.11/3.12/3.13 data checks, browser tests, production build, Pages deployment, public-page smoke and live practical-mode adversarial Korean passage all passed.
- **Research/corpus artifacts:** [run 43000381085](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43000381085) — success.

### Failed attempts and resolution

- Initial design commit `fd6af056be15c634ebf2771e9d9c93676b6954a5` exposed six stale assertions tied to the retired jogakbo palette and copy, and the old visual review expected cobalt focus even inside the dark workbench.
- The design-contract tests were rewritten for Seoul Type; the rendered review now validates acid focus inside the workbench and cobalt elsewhere. The exact-head runs listed above pass.
- No local shell test/build is claimed; implementation and verification were performed through GitHub and its CI runners.
- Superdesign CLI preflight timed out in the connector-only environment. No Superdesign canvas or mockup is claimed; the actual repository implementation was verified through the project's rendered-review workflow.

### Repository state

- No pull request was created; the repository's operating guide designates direct continuation on `main`.
- No linguistic, phonological, IPA, corpus, benchmark or runtime-dependency changes were made.
- The redesign is deployed and visually verified. This is a UI delivery, not a claim that unresolved linguistic research items elsewhere in the repository have been completed.


## 2026-11-11 — follow-up visual refinements (PR #481)

Starting main: `339b281b6135edee751b2c99a1f53b78bf041a03`. Work branch: `design/palette-specimen-research-slider-syllable-layout-2026-11-11`.

Requested refinements:
- Remove isolated inline bold emphasis from prose.
- Give the Hangul / IPA / Ukrainian hero specimen a stitched jogakbo treatment.
- Use one shared colour-token palette across the site and header.
- Replace visible research-mode checkboxes with one strict → soft → super-soft slider and mode explanations.
- Compact the syllable trace into a responsive information grid.

Implementation:
- `index.html`: specimen patch classes; range control with three named stops, accessible live description, and hidden legacy checkbox hooks retained for compatibility.
- `src/main.js`: slider is the source of truth for the existing `strict`, `soft`, and `super-soft` engine modes; mode descriptions and aria-valuetext update with selection.
- `src/styles/editorial.css`: shared palette aliases, diagonal specimen patchwork and inset seams, prose emphasis normalization, slider styling, and 4/2/1-column trace cards.
- `tests/korean-editorial-design-contract.test.mjs`: added contract checks for slider mapping hooks, palette, specimen, responsive trace and paragraph weights.
- `DESIGN.md` and the dated jogakbo spec updated.

No linguistic engine, IPA adapter, Ukrainian mapping, corpus, benchmark, source-rights or dependency changes.

Verification constraints: the local container cannot resolve github.com, so no local checkout or local npm test/build was possible. Exact-head GitHub Actions verification and the rendered visual review are required before merge/deployment. Do not claim visual acceptance or Pages deployment until those runs pass.

PR: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/481


## 2026-11-11 — palette, specimen, research slider and compact syllable trace (PR #481)

**Status: DONE_VERIFIED — merged and deployed.** Starting main: `339b281b6135edee751b2c99a1f53b78bf041a03`. Work branch: `design/palette-specimen-research-slider-syllable-layout-2026-11-11`. PR #481 merged by squash as `88a53d23e0a350abd22b7e663ca1679266902130`.

### Delivered changes

- Normal prose no longer uses isolated inline bold emphasis for single letters; emphasis is normalized at the prose level.
- The Hangul / IPA / Ukrainian hero triad now uses the stitched jogakbo specimen treatment rather than three plain colour cells.
- Shared palette tokens are consolidated and applied consistently across the pages and specimen.
- Research-mode choice is one accessible three-position range control: **Строгий → М’який → Суперм’який**, with live explanatory copy and accessible value text. Existing hidden checkbox IDs remain only as compatibility state; the slider is the source of truth.
- Syllable trace uses a compact responsive information grid rather than a narrow left-aligned column with unused space.
- No linguistic engine, IPA adapter, Ukrainian mapping, corpus, benchmark, source-rights or runtime dependency changes.

### Exact-head PR evidence

- Tests [43077903580](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43077903580) — success.
- Verify [43077903464](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43077903464) — success; browser regression/build, Python/data integrity and source redistribution rights gate passed.
- Browser G2P [43077903407](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43077903407) — success.
- Rendered desktop/tablet/mobile review [43077903505](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43077903505) — success.
- Master table/research corpus artifacts [43077903475](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43077903475) — success.
- Exhaustive test-case register extraction [43077903399](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43077903399) — success.
- The configured Official NIKL metadata-only inventory was skipped; it is not counted as a pass.

### Post-merge live-smoke correction (PR #482)

The first post-merge Pages run [43079823403](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43079823403) successfully deployed both pages and passed the public HTTP smoke, but its live Playwright smoke still clicked the intentionally hidden legacy `#super-soft-morphology` checkbox. The resulting timeout was a stale test interaction, not a UI/runtime failure.

The smoke script was corrected to set the visible `#morphology-level` range to `2`, dispatch its input event, and assert both the selected value and accessible label. PR [#482](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/482) merged by squash as `446d07405358f2b706e0bc0249ffa802f1516ce1`. Its exact-head checks all passed:
- Tests [43080376963](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080376963) — success.
- Verify [43080376742](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080376742) and push Verify [43080346971](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080346971) — success.
- Rendered review [43080376861](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080376861) — success.
- Master/research artifacts [43080377048](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080377048) — success.

### Final mainline verification and deployment

Final main commit: `446d07405358f2b706e0bc0249ffa802f1516ce1`.

- Main Tests [43080701766](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080701766) — success (Python 3.11/3.12/3.13, wheel installation, teacher-corpus audit, web tests/build).
- Main Verify [43080701846](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080701846) — success (browser regression/build and Python/data integrity).
- Rendered desktop/tablet/mobile review [43080701777](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080701777) — success.
- Master table/research artifacts [43080701827](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080701827) — success.
- GitHub Pages deployment [43080701733](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080701733) — success. Both public pages passed HTTP smoke. The corrected live Playwright smoke also passed: deterministic Hanja output, live result announcement, mode disclosure, clipboard-denial recovery, 390px mobile trace labels, methodology navigation, and a 1,443-character adversarial Korean input producing a 2,982-character inline candidate and 3,731-character IPA result. Output remained explicitly provisional/unconfirmed.

### Repository and evidence boundaries

- Both PRs are merged; no open PRs remained at final inspection. Their branches were retained; no user branches were deleted.
- No local shell test/build is claimed: this connector-only session did not have a verified local checkout. Verification is from the linked GitHub Actions runs.
- The public UI refinement is complete and deployed. The broader system remains a **research prototype**, not a validated or release-ready Korean pronunciation/transcription product. Independent linguistic evidence, IPA review, target-form validation, corpus provenance/licensing and benchmark gates remain separate work.


## 2026-11-11 — regular-weight reading typography and rebuilt page heroes (PR #483)

**Status: DONE_VERIFIED — merged and deployed.** PR [#483](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/483) merged by squash as `970fc828be500c2811108bde478241de0e791c16`.

### Delivered

- Corrected the actual cascade source of heavy glyphs: the main Ukrainian result had explicit `font-weight:780`, and specimen Hangul / IPA / Ukrainian values had weights 850 / 720 / 850. The prior paragraph-level inheritance rule did not override these more specific selectors.
- The Ukrainian reading result now uses regular weight in both practical and research modes, including the unconfirmed result state.
- Both public-page heroes now use one full-width typographic hierarchy followed by a single continuous three-stage specimen strip. Stage labels are visible; desktop/tablet retain the horizontal sequence, mobile stacks it vertically.
- Reduced and rebalanced the textile masthead strip, removing the oversized dark block while retaining the shared jogakbo palette.
- Tightened both page titles and introductory copy. No pronunciation engine, phonology, IPA mapping, Ukrainian adaptation logic, corpus, licensing data or runtime dependency changed.

### Verification

- Exact-head PR checks at `b6c76cdf2de914f81ab76d97f7f2dab0222371e5`: Tests [43086326226](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086326226), Verify [43086326448](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086326448), Browser G2P [43086326247](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086326247), rendered desktop/tablet/mobile review [43086326494](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086326494), master/research artifacts [43086326331](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086326331), exhaustive register [43086326284](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086326284) — all success.
- One intermediate Verify attempt failed because an existing copy assertion still required the old methodology hero sentence; the assertion was updated to the revised copy and the exact final PR head passed.
- Mainline Tests [43086918427](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086918427), Verify [43086918406](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086918406), rendered review [43086918658](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086918658), master/research artifacts [43086918684](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086918684), and Pages deployment plus public HTTP/live-browser smoke [43086918490](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086918490) — all success.
- Official NIKL metadata-only inventory was skipped by its configured credential condition; it is not counted as a pass.

The public pages are deployed. This is a typography and header correction only; the broader product remains a research prototype with the independent linguistic validation limits already recorded above.


## Execution continuation — 2026-11-11 — asymmetrical jogakbo hero collage

**Implementation snapshot:** `ffc77abe33ab65eebbf1c08b7fb20147225381a0` (main; visual/tested source snapshot).  
**Starting main commit:** `bb3101cf87fc0cf90fb26995977f307893129d0e`.

The user asked to restore the Korean textile-patch visual identity, explicitly rejecting three equal table-like cells. The hero specimen is now a deliberately irregular, overlapping composition: three differently sized and angled pieces, polygon-cut edges, visible dashed stitch lines and layered textile colour fields. The small header selvage is also assembled from staggered fragments of different widths and heights. The specimen remains semantic HTML with the existing labels and Hangul / IPA / Ukrainian values; no linguistic or conversion behavior changed.

### Task ledger

| Work item | Status | Evidence |
|---|---|---|
| Replace equal specimen columns with irregular patchwork | DONE_VERIFIED | CSS uses 12-column asymmetric overlap, distinct row/column spans, individual rotations and polygon cuts |
| Restore visible textile seams and layered patch colours | DONE_VERIFIED | Dashed inset stitch line and multi-layer gradients on each specimen patch |
| Make the narrow header selvage irregular | DONE_VERIFIED | 24-column / 2-row staggered patch placement |
| Responsive composition | DONE_VERIFIED | Editorial visual review passed desktop, laptop, tablet, mobile and narrow-mobile for both pages |
| Regression contract | DONE_VERIFIED | Added test asserting unequal placements, overlap, rotation, polygon edges, stitches and mobile reflow |
| Existing content and linguistic pipeline | DONE_VERIFIED unchanged | Only `src/styles/editorial.css`, cache versions in `index.html` / `system.html`, and design-contract test changed before this handoff update |
| Exact-source CI | DONE_VERIFIED | Tests run 43090011990; Verify 43090011905; Editorial visual review 43090011855 — all passed |
| Pages deployment | PARTIAL at this handoff edit | Deployment run 43090011820 was still running its browser/static-build stage; verify final status before claiming publication |

### Visual review

Artifact `editorial-visual-review-43090011855` contains rendered captures for both pages at desktop, laptop, tablet, mobile and narrow-mobile. Desktop and mobile service captures were manually inspected: the three samples read as overlapping textile pieces rather than a table; the narrow layout keeps them distinct and in reading order. The automated review passed all configured viewport, overflow, focus, reduced-motion and touch-target checks.

### Commands / checks

- Tests workflow 43090011990: PASS (web and Python 3.11 / 3.12 / 3.13, wheel-install and teacher-corpus audit).
- Verify workflow 43090011905: PASS (Python regression/data integrity and browser regression/build). Official NIKL metadata-only inventory was SKIPPED by its credentials/policy gate; it is not counted as a pass.
- Editorial visual review 43090011855: PASS (both pages, five viewport classes).
- Local shell execution was not available in this connector-only session; no local test pass is claimed.

**Scope:** presentation-only. The earlier regular-weight specimen/output typography and the existing semantic specimen values are preserved. No phonology, IPA, Ukrainian target mapping, datasets or engine behavior changed.


## 2026-11-11 visual consistency follow-up

Owner feedback: the jogakbo header is approved, but site windows and controls still feel like unrelated palettes; Ukrainian І/Ї also appear heavier than surrounding glyphs.

Implementation branch: `design/unified-jogakbo-palette-ukrainian-glyph-weight-2026-11-11`.

Scope:
- Centralize content-object colors under the jogakbo palette roles: warm paper/surfaces, ink/panel, jade, blue, ochre, clay, muted signal and accessible semantic statuses.
- Apply those roles consistently to workbench, input, controls, output cards, empty states, traces, methodology callouts, tables and footer.
- Use a Cyrillic-capable sans family for Ukrainian result glyphs, with explicit regular weight and synthetic font styling disabled, so І/Ї cannot be visually emboldened by a Korean display-font fallback.
- Preserve the approved irregular jogakbo collage in the header; do not turn content modules into textile patchwork.
- No phonological or IPA runtime changes.

Status at handoff: implementation and contract-test changes prepared on the branch; exact-head CI, rendered visual review and merge are pending.


## 2026-11-11 palette and Ukrainian glyph follow-up — completed

- Branch: `design/unified-jogakbo-palette-ukrainian-glyph-weight-2026-11-11`.
- PR #484: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/484 — merged.
- Final merge commit on `main`: `8d4a1d84888811e27bf0f0ac547173ca59588d9f`.
- Final PR head: `5b12bce2f4dbe18fef9b02fbb938ab3c9412d924`.
- **DONE_VERIFIED:** palette roles now govern all interface object colors; component styles contain no one-off hex color values outside the root palette definitions. The approved asymmetrical jogakbo header remains the signature visual and content modules remain restrained.
- **DONE_VERIFIED:** Ukrainian result text and Ukrainian header specimen use a Cyrillic-capable sans family, explicit regular weight and `font-synthesis:none`, avoiding dependence on Korean display-font fallback for І/Ї.
- **DONE_VERIFIED:** exact-head browser regression, source redistribution rights gate, public build, generated-page verification and Python regression/data-integrity checks passed.
- **DONE_VERIFIED:** rendered desktop/laptop/tablet/mobile/narrow-mobile review passed at the last UI-code revision; the only subsequent commit adjusted a test assertion to use the new palette token.
- **BLOCKED / skipped:** official NIKL metadata-only inventory skipped because credentials were unavailable; it is unrelated to this task.
- No linguistic runtime behavior, IPA, data or source evidence changed.


## 2026-11-11 — corrective follow-up: actual palette unification and bundled Ukrainian font (PR #485)

**Starting main:** `d49a93544c4b49d4f3046fee5e9280c65356a0b5`  
**Implementation head:** `e5633cb04bc7e3d757527806acc0721a8a4a0fd9`  
**Branch:** `fix/unified-paper-surfaces-cyrillic-font-2026-11-11`  
**PR:** [#485 — Fix unified paper surfaces and Ukrainian glyph rendering](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/485)

This entry supersedes the premature 2026-11-11 PR #484 completion claims below. The follow-up audit found that the earlier CSS still used dark panel roles for major windows and did not bundle a Cyrillic font; explicit regular-weight CSS alone could not guarantee consistent І/Ї rendering.

### Delivered

- Workbench, input, mode controls, primary Ukrainian answer and methodology index now use a shared warm paper/surface/ink system. Jade, blue, ochre and clay remain accents rather than competing panel themes.
- Added same-origin `src/fonts/NotoSans-Regular.woff2` (7,292 bytes), with SIL Open Font License 1.1 and public third-party attribution.
- Added a real font cmap audit for uppercase and lowercase І/Ї/Є/Ґ; all eight required codepoints passed.
- Ukrainian result and Ukrainian hero specimen use the bundled family at computed weight 400 with `font-synthesis:none`.
- The approved asymmetrical jogakbo masthead is preserved. No linguistic/runtime files changed.

### Verification on implementation head

- Tests [43105710769](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710769): PASS — 1,458/1,458 Node tests; Python 3.11/3.12/3.13, wheel-install and teacher-corpus audit passed.
- Verify [43105710859](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710859): PASS — browser regression tests, source redistribution-rights gate, build and generated-page verification; Python regression/data integrity passed.
- Editorial review [43105710901](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710901): PASS — cmap audit plus both pages at desktop 1440, laptop 1024, tablet 768, mobile 390 and narrow mobile 320px. Computed Ukrainian font was loaded, weight 400 and synthesis none; the workbench/input/mode/answer/methodology surfaces resolved to the expected paper colors. Mode text contrast exceeded WCAG AA. Focus, reduced motion, touch target and horizontal overflow checks passed. All 10 screenshots were captured and desktop/mobile views manually inspected.
- Browser G2P [43105710936](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710936), master/research artifacts [43105710890](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710890), exhaustive register [43105710680](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710680): PASS.
- Official NIKL metadata-only source inventory: SKIPPED by credential gate; unrelated to UI work and not counted as a pass.

### Scope / next step

No Korean pronunciation, IPA, Ukrainian target mapping, source corpus or engine code changed. Local shell tests/build were not claimed because this session used the GitHub connector without a verified local checkout. PR #485 is ready for merge; after merge, verify the Pages deployment and public live smoke before claiming the fix is published.


## Post-merge publication record — PR #485 (2026-11-11)

- **Merged PR:** [#485](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/485), squash merge.
- **Main merge commit:** `e3fd592f373597dfbbabee7bddf12c11e88458da`.
- **GitHub Pages deployment:** [43106616657](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43106616657) — SUCCESS.
- **Live URL:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- **Publication checks:** Python 3.11/3.12/3.13 tests passed; browser regression tests and static build passed; both public pages and the first JS asset passed HTTP smoke.
- **Live Playwright smoke:** PASS — deterministic Hanja dictionary chunk/output, live result announcement, mode disclosure, clipboard-denial fallback, mobile trace labels at 390px, methodology navigation; 1,443-character Korean input yielded a 2,982-character inline candidate and 3,731-character IPA result. The application explicitly reported `g2pK` and “Контекстну вимову застосовано · Показано попередній кандидат, не підтверджений результат”; this is a functional smoke, not a linguistic accuracy claim.
- **Final state:** visual correction is merged and published. The broader Korean pronunciation/transcription system remains a research prototype with its separate linguistic evidence, corpus and benchmark gates. No source/engine/IPA mapping was changed in this UI task.


## Final verification update — PR #487 — 2026-11-12

**Implementation branch:** fix/visual-mode-review-matrix-2026-11-12  
**PR head:** af3559ea5004818440a8db4d08ef104ff075cd85  
**Starting main:** c9d10b8e9c6d4d5d22d00ee2036709002bd13ac1  
**PR:** [#487](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/487)

### Completed and verified

- The practical mode and all three research slider levels are now captured independently at 1440, 1024, 768, 390 and 320 CSS px.
- Exact-head Editorial visual review [43185725842](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725842) passed. Its artifact contains 31 images: 20 service mode-state screenshots, 5 methodology screenshots, and the Ukrainian vowel specimen. The artifact was downloaded; representative desktop, mobile and 320px screenshots were opened and inspected.
- The research-mode option now describes the user's goal rather than repeating technical implementation details. The existing disclosure still identifies the g2pK vs. Kozak Kim engine distinction and links to methodology. The static paragraph beneath the slider no longer repeats the live Strict / Soft / Super-soft guidance.
- Browser assertions verify practical mode defaults with research controls hidden, research selection reveals its controls, and the slider's visible name, accessible value and dynamic explanation stay synchronized.
- The final test run [43185725590](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725590) passed **1,463 / 1,463** Node tests; npm production build passed.
- System Verify [43185725646](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725646) passed, including Python 3.11/3.12/3.13, wheel-install, teacher-corpus audit, browser regression and build. NIKL metadata-only inventory remained SKIPPED by policy.
- Browser G2P integration [43185725859](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725859), master/research artifacts [43185725742](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725742), and exhaustive test-case register [43185725675](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725675) all passed.
- Intermediate stale test assertions were reconciled with the retained disclosure copy; no production engine or phonology code was changed.

### Final status ledger

| Work item | Status |
|---|---|
| Practical mode screenshot coverage at five widths | DONE_VERIFIED |
| Strict / Soft / Super-soft screenshot coverage at five widths | DONE_VERIFIED |
| Mode switch visibility and slider accessibility-value synchronization | DONE_VERIFIED |
| Simplified redundant research-mode copy | DONE_VERIFIED |
| Manual screen-reader and keyboard-only evaluation | BLOCKED — requires assistive technology/manual test |
| Human comprehension test of mode descriptions | TODO |
| Short / 1,000 / 5,198-character latency measurement on desktop/mobile | TODO |

The visual-mode task is software-verified and ready for merge. The broader product remains a research prototype; independent linguistic gold data, target review and other research acceptance gates are unchanged. The PR is still open at this checkpoint; merge and Pages publication are not yet claimed.


## Post-merge publication record — PR #487 (2026-11-12)

- **Merged PR:** [#487](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/487), squash merge.
- **Main merge commit:** 6a301a54b3d8cf7a32f2b79397a1ed28cecfe0ae.
- **Final visual implementation branch head before merge:** c5e8999bc25258515bd327356be98cde8fa3fcd2.
- **GitHub Pages deployment:** [43186479309](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43186479309) — SUCCESS.
- **Published URL:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/.
- **Public HTTP smoke:** PASS — index.html, system.html and first JavaScript asset.
- **Live Playwright smoke:** PASS — deterministic Hanja dictionary chunk/output, live result announcement, mode disclosure, clipboard-denial fallback, mobile trace labels at 390 px and methodology navigation. The 1,443-character Korean adversarial input produced a 2,982-character inline candidate and 3,731-character IPA result; the status explicitly identified it as a preliminary candidate, not a confirmed result.
- **Main-commit CI:** tests [43186479233](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43186479233), Verify [43186479239](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43186479239), Editorial review [43186479363](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43186479363), and Pages deployment [43186479309](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43186479309) all passed.
- The earlier statement that PR #487 was still open was a checkpoint before merge and is superseded by this record.
- **Final classification:** the visual mode workstream is implemented, tested and published. The wider Korean pronunciation/transcription system remains a research prototype with independent linguistic evidence and accuracy gates. Manual screen-reader/keyboard review, human comprehension testing and conversion-latency measurements remain open; they are not silently treated as complete.



## 2026-11-12 — accessibility follow-up: hero specimen named group

- **Merged:** PR [#488](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/488), squash commit cde68ce0a0184e81683cb93257816b0b2c8baf84.
- **Change:** the hero's Hangul → IPA → Ukrainian specimen now exposes role=group for its existing aria-label; added a UI contract test. No CSS, typography, engine, phonology, IPA or Ukrainian mapping changes.
- **Exact implementation-head evidence:** Tests [43217403313](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43217403313), Verify [43217404060](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43217404060), Browser G2P [43217404155](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43217404155), rendered review [43217403277](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43217403277): **PASS**. Python 3.11/3.12/3.13, wheel install, teacher corpus and browser build/regression passed. Metadata-only NIKL inventory was skipped by configured policy.
- **Contrast:** calculated from CSS foreground #17202c and each gradient stop; minimum 5.24:1 (clay), maximum 14.01:1 (paper). The five stops meet WCAG AA for normal text; no colour adjustment made.
- **BLOCKED:** fresh live axe rerun and screenshot inspection could not be performed because the connected browser-audit service ran out of credits. Do not describe the earlier incomplete axe checks as resolved by a new axe run.
- **Still PARTIAL:** real screen-reader output; manual keyboard-only/200% browser zoom; user comprehension of mode labels; short/1,000/5,198-character conversion latency. These require separate human/browser evidence.
- **Next step:** when browser-audit access is available, rerun axe on the deployed main page and manually inspect the three-stage specimen at 1440px and 390px. Continue with outstanding assistive-technology and latency acceptance gates; do not change the visual palette absent a reproduced contrast failure.


## 2026-11-12 — PR #489: readable hero specimen composition

- **Starting main:** `6d5ba39e1d5c3e2c506df7e3fd1091d4426364da`.
- **Implementation branch:** `fix/jogakbo-specimen-readable-layout-2026-11-12`.
- **Final exact-head implementation:** `e52f50747c28a3cab9f7c094104e47d1215828af`.
- **Merged PR:** [#489](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/489), squash merge.
- **Merge commit:** `a76ad09b29f5607e6ee6a504bacc9aabb98c7d57`.

### Changes
- Replaced overlapping hero specimen card placement with three separate asymmetric grid patches: Hangul, IPA, Ukrainian output. Tablet and mobile receive responsive reflow; mobile stacks the three patches.
- Ensured labels and values wrap inside their own patch. Added browser geometry assertions for three cards, no overlap, and text containment.
- Corrected base body font preference to the bundled Noto Sans Ukrainian and aligned the global focus token with the editorial palette; refreshed both page stylesheet cache keys.
- Preserved the jogakbo palette and texture. No linguistic/engine/IPA changes.

### Exact-head evidence (implementation SHA e52f507)
- Editorial visual review [43223002702](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002702): **PASS**.
- Node tests [43223002480](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002480): **PASS**, including production build.
- System Verify [43223002239](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002239): **PASS**.
- Browser G2P [43223002388](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002388): **PASS**.
- Master/research artifacts [43223002455](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002455): **PASS**.
- Exhaustive test-case register [43223002368](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002368): **PASS**.
- Python 3.11/3.12/3.13, wheel-install, teacher-corpus audit, browser regression/build all passed. NIKL metadata-only inventory skipped by policy.
- The visual workflow exercised all five established viewport widths and passed the added no-overlap/text-containment assertions.

### Remaining work / release state
- Main-branch deployment and public HTTP/live smoke: verify after merge; do not infer publication from PR CI alone.
- Wider accessibility audit remains PARTIAL: actual screen-reader evaluation, manual keyboard-only and 200% browser zoom/reflow, human comprehension testing and measured conversion latency are still outstanding.
- This UI repair does not change the linguistic research prototype's independent evidence and accuracy status.


## Post-merge publication record — PR #489 — 2026-11-12

- **Published main implementation:** `a76ad09b29f5607e6ee6a504bacc9aabb98c7d57`.
- **GitHub Pages deployment:** [43223340126](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223340126) — SUCCESS, including public-page smoke and live Playwright practical-mode smoke with an adversarial Korean passage.
- The subsequent documentation-only commits updated the audit and handoff; latest main at this record is `1b54e973fe025ba63739085bfee5e001e0d174ff`.
- Latest-main checks [43223797803](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223797803) (tests), [43223797839](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223797839) (System Verify), [43223797955](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223797955) (Editorial visual review), [43223798308](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223798308) (master/research artifacts), and [43223797804](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223797804) (Pages deployment) all completed successfully. Python 3.11/3.12/3.13, browser regression/build, responsive visual review, and deployed live smoke passed; NIKL metadata-only inventory remains skipped by policy.
- **Live URL:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- A separate connected-browser screenshot fetch was not run because the Firecrawl connected-app allowance was exhausted. This does not negate the successful GitHub Actions rendered-review and deployed Playwright checks; no claim is made that an independent manual screenshot review was performed after deployment.
- **Outcome:** the screenshot-reported overlapping specimen layout is repaired, regression-guarded, merged and published. The broader UX/UI audit remains PARTIAL only for the independent human/assistive-technology and performance gates listed above.


## 2026-11-12 — PR #490: circular radio controls no longer touch row edge

- Starting main: `fd34b2b8e542c85105f171b8552371e045f54178`.
- Branch: `fix/radio-control-inset-spacing-2026-11-12`.
- Implementation head: `d8461f9a16448759576b4a00a73ab940a79ec76f`.
- PR [#490](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/490) merged as `f710557a1b4465cc29dc9f5bb5eb5ec9b36f7e05`.
- Changed selected and unselected processing-mode row padding from 2px horizontal to 18px left / 14px right. The radio buttons are now visually inset from the selected-row accent stripe. Added CSS contract regression assertion.
- Exact-head checks: tests [43226503874] SUCCESS; exhaustive test register [43226503778] SUCCESS; System Verify [43226503757] SUCCESS; Editorial visual review [43226503704] SUCCESS; master/research artifacts [43226504092] SUCCESS. Python 3.11/3.12/3.13, wheel install, browser tests/build and responsive visual review passed; NIKL metadata-only inventory skipped by policy.
- No changes to mode behavior, linguistic processing, palette or type system.
- Main-branch checks and Pages publication after merge must be verified separately; this entry does not presume deployment success.


## 2026-11-12 — follow-up: mode radio controls redesigned as inset cards (PR pending)

- **Finding:** PR #490 increased label padding, but the mode choices still used a shared fieldset surface, top-only row separators, and a selected-state inset left stripe. The native circular radio remained visually crowded against those row boundaries; padding alone did not remove the visual collision.
- **Change in progress:** each mode choice is now a distinct rounded card with a complete outline and a dedicated 32px control gutter. The radio is centered in that gutter and uses a clearly bounded circular control with a separate selected dot. The selected card uses a full ochre outline and warm tint; the old left-edge stripe and shared top-border treatment are removed. Native radio semantics, labels, keyboard selection, and mode logic are retained.
- **Regression guard:** web UI contract now asserts the card boundary, dedicated radio gutter, custom checked state, and absence of the previous stripe treatment.
- **Status:** implementation branch `fix/mode-radio-card-layout-2026-11-12`; pending exact-head CI, rendered screenshots and deployed Pages verification. Do not claim publication until those gates pass.
- No linguistic, engine, IPA, Ukrainian mapping, or mode-selection behavior changed.


## 2026-11-12 — provenance/status placement follow-up (PR pending)

- Starting main: `e28e9149171312d232d6de335177af564dc94b1e`.
- Branch: `fix/provenance-status-placement-2026-11-12`.
- Reconciled the long status line into two semantically correct locations: engine + contextual/lexical pronunciation provenance directly below IPA; Ukrainian target-status note directly below the Ukrainian output, with wording that distinguishes an available candidate from a selected candidate.
- Styled the IPA provenance as a compact editorial footnote, not a separate card. Coverage detail remains with the pronunciation engine.
- Added web UI contract regression coverage for panel placement and candidate-status separation.
- Pending exact-head CI, rendered responsive review, merge and deployed Pages verification. Do not claim publication until the Pages workflow and public smoke succeed.
- No linguistic engine, rules, IPA, target mapping or candidate-selection behavior changed.


## PR #492 verification update — 2026-11-12

- Final implementation commit at verification: `4e85bf434cf06dfb19f92ce0be218f354edf9dce`.
- Exact-head checks all passed: tests (1,465 passed, 0 failed), Python regression/data integrity, wheel installation, Python 3.11/3.12/3.13, browser regression and production build, browser G2P, master table/research corpus artifacts, exhaustive test-case register extraction, and editorial visual review.
- Visual review passed 10 page/viewport combinations; the service UI was checked at 1440, 1024, 768, 390 and 320 CSS px. Geometry assertions confirm pronunciation provenance is inside the IPA panel and target status is inside the Ukrainian panel.
- NIKL metadata-only inventory was skipped per repository policy.
- PR #492 remains open and unmerged pending explicit merge instruction. No Pages deployment/publication is claimed.


## 2026-11-26 — Kozak Kim Extended IPA implementation continuation

**Starting main:** 97bb411df8b998b22cd58adda015fb941201950c  
**Branch:** feat/kozak-kim-extended-ipa-2026-11-26  
**Current branch head at this checkpoint:** a5a42b38520d57f9814cd047f769083b811c7ecf  
**Draft PR:** #509 — feat(korean): add Extended IPA research preview to Kozak Kim  
**Tracking issue:** #508  
**Status:** PARTIAL; exact-head CI still running; no merge or deployment.

### Completed implementation work (verification pending)

- Added schemas/ipa-profile-result.schema.json and typed Python/browser contract validators.
- Python phoneticize_korean now returns an additional extended_ipa object with phonemic output from untouched underlying syllables, broad and narrow outputs from the shared post-rule analysis, variants, code-point source spans, boundaries and rule trace. The legacy ipa field is retained.
- Added a browser research adapter and a Kozak Kim opt-in Extended IPA panel. It displays phonemic (explicitly unavailable in browser), broad and partial narrow layers, variants and trace. The target output is unchanged; narrow profile is not target-compatible.
- Bumped the narrow contextual profile to v6 and removed categorical [ɦ] after sonorants; weakening/deletion is retained as unresolved speaker-/dialect-conditioned variation.
- Added first-pass literature synthesis and source-register records S028–S035 plus corpus-rights records for Seoul Corpus and NIKL Modu Spoken. No audio or corpus labels were downloaded or committed.
- Added Python and browser regression tests, including unresolved-output abstention and word-boundary guards.

### Verification and debugging record

- First PR-head CI exposed two browser-test problems: an incorrect expectation for whitespace-separated IPA rendering and narrow output leaking from partially resolved syllables in an unresolved whole token. The expected space rendering was corrected; the browser adapter now withholds the complete narrow IPA string when the engine reports unresolved pronunciation.
- A subsequent evidence review identified that the old narrow profile treated post-sonorant /h/ as categorical [ɦ]. The source evidence does not support that invariant, so v6 removes the [ɦ] substitution and records the unresolved optionality. This is a research correction with a regression test.
- GitHub Actions for the latest head are running. No exact-head pass is claimed until the complete Python, browser, wheel, build, source-rights and rendered-review workflows conclude.
- Local test execution is unavailable in this environment because a local repository/worktree runtime is not mounted. GitHub Actions is the available executable verification path.
- The optional Charsiu review workflow and NIKL metadata-only inventory are conditionally skipped; a skip is not a pass.

### Preserved work

- Default broad IPA and browser-legacy IPA paths remain unchanged.
- Practical g2pK mode remains unchanged.
- Strict / Soft / Super-soft morphology coverage modes remain independent.
- Existing IPA→Ukrainian adapter allowlists remain unchanged; no narrow profile is authorized as target input.
- Open PRs #505, #506 and #507 remain untouched; their branches are diverged or cover separate lexical/benchmark/coverage tasks and were not mechanically ported.

### Remaining task ledger

| Work item | Status | Acceptance criterion / blocker |
|---|---|---|
| Typed result schema and validators | PARTIAL | Exact-head schema/contract tests and JSON Schema validation pass in CI |
| Python three-layer result | PARTIAL | Python 3.11/3.12/3.13, wheel install and pipeline tests pass; verify all three layer semantics |
| Browser Extended IPA preview | PARTIAL | Browser tests/build pass; responsive UI and accessibility review pass |
| Python/browser parity | TODO | Same pinned fixtures, exact layer and trace parity or documented intentional differences |
| Browser phonemic layer | TODO | Browser underlying representation matches Python phonemic output on pinned fixtures |
| Narrow IPA evidence adjudication | BLOCKED | Independent Korean phonetic reviewer and source-aligned token evidence |
| Prosodic/acoustic annotation | TODO | Typed speaker/prosody/acoustic annotation schema and annotation guide, with nullable unknown fields |
| Corpus integration | BLOCKED | Authorized NIKL/AI Hub agreement; Seoul Corpus derivative redistribution scope reviewed |
| Ukrainian target compatibility | BLOCKED | Independent IPA adjudication plus separate Ukrainian target-layer review |
| Benchmark evaluation | TODO | Speaker/source-separated pinned split, independent gold, paired error analysis, coverage/abstention and latency |
| Release/deployment | DEFERRED | All scientific, rights, parity, CI and target gates complete; explicit release decision |

### Research findings that change implementation

- Stop-category acoustic cues differ across IP/AP-initial and word-medial positions; keep prosody and acoustic cues separate from categorical segmental IPA.
- Focus, age and gender condition VOT/F0/closure-voicing patterns; do not infer a universal voiced-stop output.
- Sibilant palatalization is context- and speaker-sensitive; /yo/ and /yu/ differ from /i, ye, ya/ contexts.
- Ultrasound evidence for lexical/post-lexical palatalization is nonuniform across four speakers and consonants.
- Seoul/Gwangju /h/ realization differs in optionality; post-sonorant weakening/deletion must not be forced into [ɦ].
- The current [ɲ] generalization is still a research hypothesis, not independent gold.
- Seoul Corpus is listed by OpenSLR under CC BY-NC 2.0; NIKL Modu corpus use is agreement-limited and non-transferable. No corpus integration is authorized by this review.

### Superpowers workflow

Used the relevant brainstorming, planning, TDD, systematic-debugging and verification guidance. Work is inline on a dedicated GitHub branch because no local Git worktree is available; a fresh independent reviewer is still required before merge.


## 2026-11-26 — Extended IPA implementation checkpoint 2

**Current branch head:** dbe608cdfb3dd42d279e3d410dcfa981561a58a8  
**Draft PR:** #509  
**State:** PARTIAL; exact-head CI queued.

### Additional work

- Added explicit nullable speaker/prosody context and a separate acoustic annotation array to the typed contract. Text-only inputs do not invent dialect, age, speech rate, focus, prosodic position or measured F0/VOT/voice-quality values.
- Measured acoustic annotations require a source span, method and source reference.
- Added browser UI wiring and static regression tests for opt-in visibility, separate layers, context note and responsive layout.
- Extended browser trace to retain engine rule IDs as well as narrow-profile rule IDs; variants retain source spans where the engine supplies syllable indices.
- Withholds the entire narrow string if a whole input or any source trace is unresolved, avoiding a misleading partial string.
- Reordered the ㅎ narrow conditions so [ç]/[x] before the relevant vowels are preserved while post-sonorant weakening/deletion remains unresolved; the profile still does not emit categorical [ɦ].
- Tightened [ɲ] source attribution: Ahn (2009) is recorded as related initial /n/-deletion evidence, not direct proof of generalized [ɲ].

### Verification state

The earlier CI attempt on an older head failed on stale v5 profile assertions, expected post-sonorant [ɦ], source-register row counts, and the newly added missing acoustic-context contract. Those failures were traced to outdated expectations and missing contract fields. Corrections and tests are now committed. Current exact-head workflows for dbe608cdfb3dd42d279e3d410dcfa981561a58a8 are queued; no pass is claimed until completion.


### AI Hub rights clarification — 2026-11-26

The official AI Hub FAQ [S036] clarifies that raw/original dataset files cannot be externally redistributed, while derived models/services/research outputs may be used commercially with attribution, subject to dataset-specific rights-holder terms. Download requires applicant verification, purpose disclosure and application; the platform policy is not a dataset-specific grant. KsponSpeech remains BLOCKED until its own dataset agreement and authorized access are documented.


## 2026-11-26 — Extended IPA implementation checkpoint 3

**Current head:** 918fc349c5c5fb997d7dff3929d2e23e652f3c7f  
**PR:** #509 (Draft; open)  
**Base:** main at 97bb411df8b998b22cd58adda015fb941201950c

### Additional browser layer work

- The browser panel now exposes the existing super-soft underlying-grapheme IPA fallback as a phonemic candidate. It is explicitly labelled as a grapheme-derived fallback, not adjudicated phonemic gold and not a full morphophonological analysis.
- The UI shows the candidate profile and limitation status; the default broad result and Ukrainian adapter remain unchanged.
- Tests cover a simple Hangul input and the distinct fallback profile identifier.

### Current verification status

- Exact-head Verify workflow 45860593460 for 918fc349c5c5fb997d7dff3929d2e23e652f3c7f is queued; Python and browser regression jobs have not started.
- Earlier CI on an older head exposed stale v5/[ɦ]/source-count expectations and missing acoustic-context fields. Those were corrected, but the current head still needs a completed exact-head run.
- The branch has no local worktree in this environment. No local tests are claimed.

### Remaining blockers

- Full browser phonemic analysis and Python/browser parity.
- Independent phonetic adjudication of the narrow profile and speaker-/prosody-conditioned variants.
- Rights-cleared acoustic corpus access and annotation pilot.
- Separate Ukrainian target-layer review.
- Completed exact-head CI, generated-artifact and rendered-review checks.

## 2026-11-26 — Extended IPA implementation checkpoint 4

**Branch:** `feat/kozak-kim-extended-ipa-2026-11-26`  
**PR:** [#509](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/509) — draft, open  
**Base:** `main` at `97bb411df8b998b22cd58adda015fb941201950c`  
**Head at this checkpoint:** `58419e61d6d3e4783355b66f00fec3fdd487ff8f`

### Implemented in this continuation

- Replaced the browser's super-soft grapheme fallback in the phonemic panel with a dedicated deterministic underlying Hangul onset–nucleus–coda adapter.
- The browser adapter preserves the project's phonemic inventory, complex coda components, syllable/word/phrase boundaries, Unicode code-point spans, unsupported-character abstention and the exact source-attested long vowel in 유사성.
- Python's existing IPA-first three-layer generation is retained. Its Extended IPA trace now separates phonemic, broad and narrow records and includes the underlying phonemic syllable values.
- Extended IPA schema advanced to v1.1. Every trace row is typed as phonemic, broad or narrow; Python and browser validators enforce that layer tag.
- Browser UI now displays the dedicated phonemic result and labels its limits. Extended IPA remains opt-in under Kozak Kim research mode; the normal IPA and Ukrainian output paths are not redirected through this panel.
- Runtime comparison fixtures now state the known Python/browser difference for 시 explicitly: Python broad si vs browser broad ɕi. The fixture is a smoke comparison, not independent phonetic gold.
- Added browser/Python tests for complex coda decomposition, source-attested vowel length, unsupported characters, layer-specific trace and source spans.

### Status ledger

- **PARTIAL:** browser phonemic adapter and cross-runtime trace contract are implemented, but latest-head CI has not yet verified them.
- **PARTIAL:** broad IPA runtime parity; known difference for 시 remains explicit and must be reconciled using the project's IPA convention evidence, not by changing one runtime to fit a benchmark.
- **PARTIAL:** narrow IPA remains a research-only profile with unresolved speaker-/dialect-conditioned cases and no independent phonetic adjudication.
- **TODO:** execute the complete test suite, schema validation, source-rights audit, build, wheel/install checks and rendered browser review against the exact current head.
- **BLOCKED:** no latest-head workflow run was returned for commit `58419e61d6d3e4783355b66f00fec3fdd487ff8f`. The workflow runs visible at commit `6143004ff525be29dc7d15d79590e988d1cfdf91` were still queued and are stale relative to this checkpoint.
- **BLOCKED:** independent Korean phonetic review, rights-cleared acoustic corpus access and separate Ukrainian target-layer review remain external evidence gates.

### Commands and verification

- GitHub branch comparison: `main...feat/kozak-kim-extended-ipa-2026-11-26` — 52 commits ahead, 0 behind at the time of this checkpoint.
- GitHub workflow lookup for current head `58419e61d6d3e4783355b66f00fec3fdd487ff8f` — no associated PR-triggered runs returned.
- GitHub Actions jobs previously listed for `6143004ff525be29dc7d15d79590e988d1cfdf91` — queued; not evidence of passing tests on the current head.
- No local worktree/runtime was available through this GitHub-only session; no local test command is claimed as executed.

### Release assessment

**Research preview / partial prototype; not release-ready.** The UI and typed IPA layers exist, and the browser phonemic layer is no longer the super-soft grapheme fallback. Do not claim benchmark uplift, full phonetic coverage, cross-runtime parity or independent linguistic validation until the outstanding gates above pass.

### Follow-up after checkpoint 4 — documentation reconciliation

- Reconciled README, acceptance gates and the Superpowers execution plan with the implemented browser phonemic adapter; removed the stale statement that the panel still uses the super-soft grapheme fallback.
- The implementation code head for this work is `58419e61d6d3e4783355b66f00fec3fdd487ff8f`. Subsequent commits `59b422136a6feddffd478c0f88096998342b0258`, `6d96efecf4a39ce9934207af416ecc6a34b9e2be`, `5f0c0142229554bf10cbacff4eb0b131b8d91637` and `0343bf463baa206901b851f54a33a17486186bf4` reconcile the handoff, acceptance gates, plan and README.
- Latest branch comparison before this addendum: 56 commits ahead of main, 0 behind.
- Exact-head Verify run `45864970104` and pinned UGTPHON diagnostic `45864970001` were created for the handoff commit but remained queued when checked; no passing test result is claimed.
- Remaining status is unchanged: research preview only, not release-ready; broad-runtime difference, independent phonetic adjudication, acoustic-corpus rights, target review and CI completion remain open.

### Exact-head CI failure triage — 2026-11-26

The workflows associated with the preceding branch checkpoint completed. Their results were not all green:

- Verify `45865436205`: Python and browser test jobs failed; build and later steps were skipped.
- Browser G2P `45865436196`: browser tests failed; build was skipped.
- Test suite `45865436293`: web tests failed; Python 3.13 failed; Python 3.11/3.12 were cancelled after the matrix failure; wheel build/install passed; teacher-corpus audit passed.
- Research/diagnostic workflows `45865436523` (master/research artifacts), `45865436478` (UGTPHON diagnostic), `45865436465` (optional g2pK integration), `45865436440` (morphology adapter smoke), `45865436301` (morphology-consensus diagnostic), `45865436141` (native-vs-g2pk diagnostic), `45865436367` (multi-engine diagnostic), `45865436446` (test-register extraction), and `45865436555` (editorial review) completed successfully. Charsiu rule-review queue `45865436297` was skipped by policy.

**Failure causes inspected from job logs:**

1. Python and browser Extended IPA tests incorrectly expected `값` to begin with `p`. The actual underlying onset is ㄱ, mapped to /k/; the complex coda ㅄ is decomposed as /ps/. Therefore the deterministic underlying inventory result is `kaps`, not `paps`. The implementation was correct; both assertions were corrected to `kaps`.
2. The Extended IPA responsive-layout test assumed `grid-template-columns` was the first declaration in `.extended-ipa-layers`; the real CSS correctly places `display:grid` first. The test now allows preceding declarations while still requiring the three-column desktop grid.
3. The source-register test expected 247 rows while the checked-in CSV and its other assertion contain 248. The stale CLI assertion was corrected to 248; no source record was removed or changed to silence the test.
4. These were test-oracle drift/errors, not evidence that the runtime implementation itself failed. They do not establish full linguistic correctness.

**Corrective test-only commits:** `b38a11dca4204dbfc5f22162be8d46c9212d4150`, `c4bae1fc64ebc6c5bdd4f8f0dbdb17525f3d8e5c`, `a64c9da07b8d0657a5fdbec341aaab32d403e76b`, `94de598c9e36a657b3ea20da0d678eafc4b3263d`.

**Verification after corrections:** exact-head CI for the corrected branch tip is still pending; the failed workflow results above belong to the earlier tip and must not be presented as the outcome of the corrected tests. No local worktree/runtime was available, so no local test command is claimed. Continue with exact-head Verify, browser G2P, tests, schema/build and rendered review. Preserve the known Python/browser broad `시` difference (`si` vs `ɕi`) until reviewed; do not normalize it by assertion alone.

**Status:** failure causes identified and test expectations corrected; verification of the corrected exact head remains **TODO/PENDING**. Extended IPA remains a research preview, not release-ready.

### Shared broad-IPA reconciliation — 2026-11-26

A source-backed runtime discrepancy was resolved in the Extended IPA path. The Python broad profile preserves canonical /s/ and exposes [ɕ] as an optional, unselected research variant before the narrowly specified high-front nuclei /i, ye, ya/. The browser's default legacy contextual renderer had instead promoted [ɕ] to its broad output for `시`, producing a misleading Python `si` versus browser `ɕi` difference.

Evidence review: Kang (2010), *Coarticulation effects of Korean sibilant /s/ before a high front segment*, reports early spectral differences before /i, ye, ya/ and interprets them as palatalization/coarticulation, not a categorical requirement to replace canonical /s/. A later Seoul Korean sibilant study summarizes the conventional analysis as phonemic /s/ with palatalized [ɕ] before /i/. This supports keeping /s/ canonical and [ɕ] as a scoped variant; it does not establish one universal speaker realization. Sources: https://doi.org/10.17959/sppm.2010.16.1.3 and https://www.eksss.org/archive/view_article?pid=pss-13-1-37.

**Implementation:** the Extended IPA panel now obtains its broad layer from the existing shared strict profile `clippyfirst-korean-broad-v1`, independently of the selected Soft/Super-soft coverage mode. That profile preserves broad `si` and exposes the source-scoped `[ɕi]` candidate as an unselected variant. Narrow v6 remains a separate partial research layer and can render `ɕʰi` under its selected environment. The legacy main IPA/Ukrainian output path is not changed. The browser Extended IPA helper and parity fixture now use the shared profile; the known `시` broad difference is removed from that fixture, while the fixture remains a smoke test rather than independent phonetic gold.

The new code/test checkpoint is `2cbbe23597e5b9e9825c6cee2079ebd18635a144`. Exact-head CI for this new checkpoint is required before marking the reconciliation DONE_VERIFIED. This does not establish exhaustive runtime parity, independent phonetic gold, or benchmark uplift.

### Shared broad-profile test correction — 2026-11-26

The first CI run after switching the Extended IPA browser panel to the shared strict broad profile failed in Python 3.13 at `tests/test_ipa_profile_contract.py::test_phoneticize_exposes_all_three_extended_ipa_layers_without_changing_legacy_ipa`. The new assertion looked for `variant["note"]`, but the typed Extended IPA schema intentionally exposes that text as `variant["environment"]`. This was a test-field mismatch; the Python variant builder already emits the evidence note in `environment`. Corrected the assertion to read the schema field `environment` in commit `7a56963d7a2996066a15aa9baf594d13beaf0d09`.

The failed run was tests matrix `45880894598`, Python 3.13 job `140119675948`; Python 3.11/3.12 were cancelled after the matrix failure. The browser, Verify and remaining matrix jobs were queued at last inspection. Exact-head CI must rerun on the corrected branch tip; do not claim the broad-profile change passed yet. This failure does not indicate a runtime IPA mismatch.

### Source-aligned sibilant variant trace — 2026-11-26

The shared browser broad profile already generated the optional [ɕ] variant, but its generic variant object did not carry `syllable_indices`, so the Extended IPA adapter could not attach a source span. Added the affected syllable index to the sibilant candidate and a browser regression asserting `{start: 0, end: 1}` for `시`. Python already emitted the corresponding index. The new source-span commits are `0ca374140606cd8fead7398ca957c5871aa57102` and `bd7fc7acfd4a9d17b8cc98da70e7a1bed49f2489`.

The Python 3.13 failure from the prior checkpoint was separately corrected: Extended IPA variant provenance is stored in `environment`, not `note`, and the regression now reads the schema-defined `environment` field. That fix is commit `7a56963d7a2996066a15aa9baf594d13beaf0d09`. Exact-head verification of the combined source-span and schema-field corrections remains pending.

### CI status reconciliation — 2026-11-26

The earlier test-oracle corrections (`kaps`, CSS declaration order, source-register row count) are now **DONE_VERIFIED** on code checkpoint `b2f18a9c6f8f35dc24c4c7d5d1c4d5f01b5fa461`: Verify run `45880257988` passed Python regression/data integrity and browser regression/build; tests run `45880257939` passed Python 3.11, 3.12, 3.13, web, wheel install and teacher-corpus audit; Browser G2P run `45880258014` passed. The official NIKL metadata-only job was skipped by workflow condition, not passed.

The subsequent shared broad-profile change exposed a test-schema assertion error (`note` vs schema field `environment`). Python 3.13 passed after that correction on code checkpoint `7a56963d7a2996066a15aa9baf594d13beaf0d09` (tests run `45881102718`); Browser G2P passed on that checkpoint (`45881102801`). Other jobs in those runs remained queued/in progress at last check. A further source-span correction was then added in code checkpoint `bd7fc7acfd4a9d17b8cc98da70e7a1bed49f2489`.

**Latest code checkpoint verification is still pending:** tests `45881234764`, Verify `45881234504`, Browser G2P `45881234519`, rendered review `45881234502`; at last poll these primary jobs were queued. Test-register extraction `45881234564`, UGTPHON diagnostic `45881234545`, and paired Native/g2pK diagnostic `45881234749` were in progress. The documentation-only branch head after this checkpoint is `0bb220d159852654f425cfadeef8267190128145`. No pass is claimed for the final source-span change until the latest code checkpoint's tests complete.

### Variant source-span safety for multiword inputs — 2026-11-26

A further review found that generic browser variant indices are token-local. Mapping them directly against the whole phrase's Hangul-only span array could assign a later-word variant to the first word. The Extended IPA adapter now maps these indices only when the complete input is one Hangul eojeol; for multiword/mixed input it leaves the variant span null rather than fabricate a location. Tests cover both the single-word positive span and the multiword null/abstention case. Commits: `28fc58aa21a07cfbc8e8b03a0d468695e6c433c8`, `47e8162ca8557e269b6a337416a802a5048ba39a`. Exact-head CI is required.

### Final handoff checkpoint — 2026-11-26

- Latest code/test checkpoint before this handoff refresh: `47e8162ca8557e269b6a337416a802a5048ba39a`.
- Branch head before this handoff refresh: `bc548c7e58d1d5eadf1a393cce4ed4e13078a3f9`; branch comparison against `main` is 81 commits ahead, 0 behind at the last comparison.
- Latest exact-code-head runs: tests `45881751726`, Verify `45881752147`, Browser G2P `45881751645`, rendered review `45881751769`, master artifacts `45881751741`, test-register extraction `45881752107`, UGTPHON `45881751663`, morphology consensus `45881751961`, paired Native/g2pK `45881752091`, g2pK integration `45881751857`, morphology adapter smoke `45881751817`. At last poll all primary checks were queued; no final-code pass is claimed.
- Intermediate verification evidence: the `kaps`/CSS/source-count corrections passed Verify/tests/Browser G2P on `b2f18a9c6f8f35dc24c4c7d5d1c4d5f01b5fa461`; the Python variant-field correction passed Python 3.13, Verify and Browser G2P on `7a56963d7a2996066a15aa9baf594d13beaf0d09`. Those runs predate the final source-span mapping guard and are not substituted for latest-head CI.
- Test-oracle failures encountered and corrected: expected `paps` instead of `kaps`; CSS test assumed grid declaration order; source register expected 247 rather than 248; Python variant assertion used `note` instead of schema field `environment`. The latest source-span guard deliberately leaves multiword variant spans null rather than misattribute token-local indices.
- Local verification: attempted public `git clone`, blocked by DNS/network resolution failure (`Could not resolve host: github.com`). No local test/build command is claimed.
- External evidence blockers: independent Korean phonetic adjudication, rights-cleared audio annotation pilot/dataset terms, and independent Ukrainian target-layer review. Extended IPA remains a research preview and PR #509 remains draft/open.
- Next genuine blocker: complete the latest exact-code-head CI runs above; fix any newly exposed failures and rerun. Do not merge or call this release-ready before those checks and the independent linguistic/rights gates.

### Exact-head CI result — 2026-11-26 21:33 EET

**Verified code head:** `a3fb2ec8a962ffd37d202eab95c99387d0d83638`  
**Branch:** `feat/kozak-kim-extended-ipa-2026-11-26`

The previously failing test-oracle issues were corrected on the branch. The next exact-head workflow matrix now reports:

- **PASS** Verify Korean–Ukrainian system — run `45882049688`.
- **PASS** Browser G2P integration — run `45882049461`.
- **PASS** full tests — run `45882049481`: Node web suite 1,483/1,483 passed; Python 3.11, 3.12 and 3.13 passed; wheel-install passed; teacher-corpus audit passed.
- **PASS** rendered desktop/tablet/mobile review — run `45882049653`.
- **PASS** external UGTPHON diagnostic — run `45882049445`.
- **PASS** master research artifacts — run `45882049697`.
- **PASS** exhaustive test-register extraction — run `45882049680`.
- **PASS** paired native Korean vs g2pk diagnostic — run `45882049571`.
- **PASS** morphology consensus diagnostic — run `45882049560`.
- **PASS** optional g2pK integration — run `45882049460`.
- **PASS** research morphology adapter smoke — run `45882049520`.
- **IN PROGRESS** multi-engine IPA comparison benchmark — run `45882049729`, Python 3.12 job `140131796752`.
- **SKIPPED by workflow policy** Charsiu train/dev queue and optional ByT5/Charsiu inference jobs. These are not pass results and no third-party weights were redistributed.

Historical failures on earlier commit `19e4d95bacb8f3f62e4344828bb7ed70c08cbf02` were test-oracle failures: the coda expectation used `paps` instead of `kaps`; the CSS assertion assumed a minified declaration order; the source-register assertion expected 247 rows instead of 248. The latest head's successful tests cover the corrected state. The source count is 248. Do not infer phonetic gold from the grapheme-derived `kaps` output.

### Updated status ledger

- **DONE_VERIFIED:** exact-head Node/browser regression, Python 3.11–3.13 regression, wheel install, Verify, Browser G2P, rendered review, source/teacher corpus audit, test-register extraction and the named diagnostic workflows above, all on `a3fb2ec8a962ffd37d202eab95c99387d0d83638`.
- **PARTIAL:** broad IPA Python/browser reconciliation and exhaustive inventory parity. The known profile decision for `시` is represented as shared broad `si` with optional `ɕ` variant; independent phonetic adjudication remains necessary.
- **PARTIAL:** narrow IPA and typed acoustic schema; actual rights-cleared acoustic annotation pipeline is not implemented/validated.
- **BLOCKED:** independent Korean phonetic adjudication, rights-cleared audio/corpus access and independent Ukrainian target-layer review.
- **TODO:** finish the running multi-engine benchmark and inspect its pinned splits, metrics and artifacts before interpreting any score.
- **NOT RELEASE-READY:** despite green software CI, independent linguistic/rights/target gates remain open. PR #509 stays draft/open.

No local test command is claimed; verification above is GitHub Actions evidence.


### Multi-engine benchmark results — 2026-11-26

**Completed run:** Multi-engine Korean IPA diagnostic, run `45882049729`, code head `a3fb2ec8a962ffd37d202eab95c99387d0d83638`. Main job `140131796752` completed successfully. Aggregate-only artifact `multi-engine-korean-ipa-diagnostic` (artifact ID `15150473046`, SHA-256 `92d1e2f48df10b4ab03d0efe31fa36f9c1d0dbc5e4451983cbccd948e61b1032`) contains aggregate metrics only; token-level text/IPA/mismatch rows are deliberately omitted. The run covered UGTPHON, SIGMORPHON, Seoul Corpus, K-SPAN modern/conservative, and IPA-Dict Korean.

#### Strict scoring (selected native broad profile; exact match / character error rate)

| Track | Kozak Kim Native | Best external in this run | Interpretation |
|---|---:|---:|---|
| UGTPHON (2,703 occurrences) | 52.74% / 9.01% | g2pk 53.09% / 9.23% | Essentially tied; g2pk has a 0.35 pp exact-match lead, Native slightly lower CER |
| SIGMORPHON (999 lexical items) | 35.97% / 14.53% | g2pk 35.34% / 14.82% | Native leads by 0.63 pp exact match and has slightly lower CER |
| IPA-Dict Korean (1,000 sampled lexical items) | 41.27% / 9.93% | g2pk 41.10% / 10.04% | Essentially tied; Native leads by 0.17 pp |
| Seoul Corpus (1,000 occurrences) | 14.80% / 39.84% | KoG2P 21.20% / 32.02% | Native trails; reference is phonemic word-level IPA, not narrow phonetic gold |
| K-SPAN Modern (1,000 sampled occurrences) | 10.87% / 27.78% | KoG2P 25.00% / 15.65% | Native trails substantially; see severe sample eligibility limitation below |
| K-SPAN Conservative (1,000 sampled occurrences) | 7.55% / 27.45% | KoG2P 18.80% / 16.15% | Native trails substantially; see severe sample eligibility limitation below |

The top-three systems' bootstrap 95% intervals overlap on UGTPHON, SIGMORPHON and IPA-Dict; these are diagnostic intervals, not a paired significance test. The native exact-match intervals are respectively 47.88–57.98%, 33.07–38.98%, and 38.15–44.28%. Therefore the small rank differences must not be described as a statistically established win.

#### Research-only broad-candidate sensitivity scoring

A separate `korean-broad-candidate-sensitivity-v1` normalization was run to estimate how much exact-match disagreement comes from predictable IPA/allophone convention differences. It is explicitly **research-only and unadjudicated**, not the production score and not a gold standard. It removes stress and syllable separators, selected quality diacritics, fricative aspiration after sibilants and several allophonic distinctions (including retroflex/palatal laterals, palatal nasal and multiple h-like realizations). It preserves stop aspiration, fortisness, vowel length, unreleased-coda marking and sibilant place contrasts.

| Track | Kozak Kim Native after candidate normalization | g2pk after candidate normalization |
|---|---:|---:|
| UGTPHON | 86.23% exact, 2.14% CER | 85.72% exact, 2.37% CER |
| SIGMORPHON | 69.84% exact, 6.15% CER | 68.67% exact, 6.46% CER |
| IPA-Dict Korean | 86.14% exact, 1.61% CER | 85.70% exact, 1.69% CER |

This is a useful indication that a large share of strict string mismatch is convention/realization normalization, and Native is marginally ahead under this particular candidate profile. It is **not** evidence that narrow IPA is 86% accurate: the normalization intentionally collapses several phonetic distinctions, and its policy has not been independently adjudicated. The profile's feature-loss counters are material (e.g. 5,206 selected segmental-quality diacritic losses, 858 fricative-aspiration losses, 549 retroflex-lateral collapses in the relevant reference sample).

#### Browser Strict / Soft / Super-soft coverage trade-off

- UGTPHON: Strict 52.74% exact at 99.96% coverage (2,702/2,703); Soft 56.19% at 82.83% coverage (2,239/2,703; 464 heuristic tokens); Super-soft 50.91% on only 55 scored tokens, with **2.03% coverage** and 2,648 heuristic tokens.
- SIGMORPHON: Strict 35.87% at 99.90% coverage; Soft 35.77% at 94.29% coverage; Super-soft 46.67% on only 15 tokens, with **1.50% coverage** and 984 heuristic tokens.
- K-SPAN Modern: Strict 10.87% at 99.4% coverage; Soft 10.49% at 91.5%; Super-soft scored 4/1,000 (0.4%).
- K-SPAN Conservative: Strict 7.55% at 99.3%; Soft 6.31% at 91.9%; Super-soft scored 3/1,000 (0.3%).
- IPA-Dict: Strict 41.27% at 99.6%; Soft 40.74% at 92.3%; Super-soft scored 4/1,000 (0.4%).

Do not rank Super-soft by its conditional exact-match percentage: its coverage is so low that the percentage is not representative. Soft sometimes improves conditional exact match on noisy UGTPHON but does so by declining many inputs and introducing heuristic results; it is not an overall replacement for Strict.

#### Critical dataset and interpretation caveats

- **K-SPAN is not a representative result in this run.** After exact overlap exclusion against the baseline lexical sets, the manifest reports only **4 eligible word types** for each K-SPAN track, despite 1,000 sampled occurrences. The source's `key_worldbet` integrity cross-check also warns of 22,843 mismatches in 63,836 rows. The source phonetic fields were used directly, but these results are highly concentrated and cannot support generalization. Rebuild a valid, sufficiently broad K-SPAN holdout before drawing conclusions.
- Seoul Corpus is phonemic word-level gold; it is not narrow phonetic gold. The current comparison output is broad surface IPA, so its low exact-match values mix model differences with a reference-layer mismatch.
- IPA-Dict Korean is Wiktionary-derived and shares lineage with SIGMORPHON; exact orthographic overlap was excluded, but the sources are not fully independent.
- UGTPHON is noisy user-generated text, not a balanced normative pronunciation test.
- Several competitors (including g2pk and KoG2Padvanced) are converted through the project's IPA segment renderer, so their scores are not fully independent IPA encoders. Some engines share algorithmic lineage.
- This benchmark evaluates Korean IPA only; it does not score Ukrainian orthographic adaptation.
- Optional ByT5 and Charsiu inference jobs were skipped by workflow policy. They are not benchmark results.

#### What this says about Extended IPA

The benchmark provides a positive but limited signal for the current shared **broad** IPA profile: Native Kozak Kim is competitive with g2pk/g2p-ko on UGTPHON, SIGMORPHON and IPA-Dict, and marginally ahead on the candidate-normalized comparison. It does **not** yet demonstrate the accuracy of the full Extended IPA phonemic+broad+narrow research output. The aggregate artifact has no independently adjudicated narrow-IPA gold and does not separately score narrow segmental features, acoustic measurements, speaker-conditioned variants or Ukrainian target adaptation. No narrow-IPA uplift claim is permitted.

**Updated ledger:**
- **DONE_VERIFIED:** multi-engine benchmark workflow and aggregate artifact generated successfully; six tracks, ten engine outputs, three browser morphology modes reported.
- **PARTIAL:** broad-profile competitive performance demonstrated on three lexical/noisy tracks, but close external comparisons, non-independent adapters and reference-convention uncertainty remain.
- **PARTIAL:** browser Soft improves conditional UGTPHON exact match but reduces coverage; Super-soft is extremely low coverage and unsuitable for headline accuracy claims.
- **BLOCKED / TODO:** valid K-SPAN holdout; layer-aligned Seoul evaluation; independently adjudicated broad/narrow IPA gold; speaker-/dialect-conditioned narrow IPA and acoustic validation; Ukrainian target-layer review.
- **Release status:** research preview / partial prototype, **not release-ready**.

No benchmark score is a scientific endorsement of the current profile. Treat these numbers as diagnostic evidence for prioritizing the next independent review and dataset work.


### Paired standard-versus-Extended IPA benchmark — 2026-11-26

Added a reproducible A/B-style layer diagnostic on the existing benchmark branch:
- `scripts/benchmark_extended_ipa_ab.mjs` runs standard strict IPA and Extended phonemic/broad/narrow through the same Kozak Kim browser engine and identical corpus occurrences.
- `tests/benchmark-extended-ipa-ab.test.mjs` asserts the paired standard-vs-Extended-broad output is identical by design and that phonemic/narrow layers are independently surfaced.
- `.github/workflows/multi-engine-ipa-benchmark.yml` now runs the paired diagnostic on the pinned UGTPHON and SIGMORPHON inputs and uploads a per-occurrence artifact.

**Interpretation guardrails:** Extended broad wraps the same strict broad renderer as standard IPA; therefore any identical scores are expected and are not a model improvement. Phonemic and narrow scores are cross-layer reference agreement unless the corpus gold layer is verified as compatible. Neither corpus is independently adjudicated narrow-IPA gold. This run does not score Ukrainian output and does not touch the second Korean engine.

**Run status at handoff update:** workflow run `45893331177` was pending. No A/B scores or successful test claim are made until the run and artifact are inspected.


#### Final paired-benchmark execution checkpoint

- Code checkpoint: `f377f16048035918f0bd50a50d5394ac1737e408`.
- Workflow run `45893480948`: pending at the last poll; no job records/artifact yet. Earlier attempts on intermediate commits were cancelled before jobs started.
- The paired regression and A/B scores therefore remain **PENDING**, not passed. Inspect the run and the `standard-vs-extended-ipa-ab` artifact before reporting any numbers.
- The code branch and docs are committed; the benchmark scope is still limited to Kozak Kim, and the second Korean engine remains untouched.
### 2026-11-26 — final Extended IPA exact-head verification and paired diagnostic

**Repository checkpoint**
- Default branch: main; starting/base commit: 97bb411df8b998b22cd58adda015fb941201950c.
- Reused the existing dedicated branch feat/kozak-kim-extended-ipa-2026-11-26 and open PR #509; no duplicate branch or implementation was created.
- Exact implementation head inspected: d19c5686ef8031cdcbfc2be10e1a0fe0c30ee33e. PR base is the starting main commit; PR remains open and unmerged.
- PR #509 contains 32 changed files (+2,736 / -30). The feature remains a research preview.

**Exact-head software verification on d19c5686ef8031cdcbfc2be10e1a0fe0c30ee33e**
- PASS Tests workflow 45893570996: wheel-install, Python 3.11, Python 3.12, Python 3.13, web suite and teacher-corpus audit.
- PASS Verify workflow 45893570785: browser regression/build and Python regression/data integrity. NIKL metadata-only inventory was SKIPPED by policy, not passed.
- PASS Browser G2P integration 45893570769.
- PASS Editorial rendered review 45893570937.
- PASS Master table/research artifacts 45893570751 and 45893567090.
- PASS Exhaustive test-register extraction 45893570926.
- PASS External UGTPHON diagnostic 45893570755.
- PASS Paired native-vs-g2pk diagnostic 45893570887.
- PASS Korean morphology-consensus diagnostic 45893570790 and research morphology adapter smoke 45893570788.
- PASS Multi-engine Korean IPA diagnostic 45893570737. Its Python 3.12 job completed the pinned engine portfolio, Native/Browser diagnostics and paired standard-vs-Extended IPA step. Neural ByT5, CharsiuG2P and neural-pairing jobs were SKIPPED by workflow policy.
- PASS Optional g2pK integration 45893571029.
- Earlier paired run 45893480948 on intermediate head f377f16048035918f0bd50a50d5394ac1737e408 was cancelled; it is superseded by the successful exact-head run.

**Paired standard-vs-Extended diagnostic artifact inspected**
- Artifact 15153601014, standard-vs-extended-ipa-ab-45893570737, was downloaded and its JSON inspected.
- UGTPHON: 2,703 eligible / 2,702 scored; standard IPA and Extended broad are identical on all 2,703 paired occurrences (0 prediction differences, 0 status differences); exact match 52.7387%, CER 9.013%.
- SIGMORPHON: 999 eligible / 998 scored; standard IPA and Extended broad are identical on all 999 paired occurrences; exact match 35.8717%, CER 14.5598%.
- Extended phonemic reference agreement: UGTPHON 20.2073% exact / 23.4737% CER; SIGMORPHON 12.9259% / 26.6742%.
- Extended narrow reference agreement: UGTPHON 55.8845% exact / 7.2217% CER; SIGMORPHON 39.6794% / 12.6912%.
- Interpretation: benchmark references are not independently adjudicated phonemic or narrow IPA gold. Phonemic/narrow values are cross-layer string-agreement diagnostics, not accuracy estimates. Extended broad is intentionally the same renderer as Standard IPA, so identical results are expected and are not an uplift. The benchmark does not score Ukrainian target adaptation.

**Architecture findings**
- Python exposes a typed schema-v1.1 extended_ipa object with phonemic, broad and narrow layers, source/boundary/trace/variant data, nullable speaker/prosody context and separate acoustic annotations. Text-only requests leave speaker/prosody fields null and acoustic annotations empty.
- Python phonemic output is built from the underlying syllable parse; broad/narrow are built from shared surface analysis. Narrow profile v6 removed the unsupported categorical post-sonorant [ɦ] substitution and leaves weakening/deletion unresolved.
- Browser output has a dedicated deterministic Hangul onset–nucleus–coda inventory adapter, not the old Super-soft fallback. It is not equivalent to Python underlying phonological analysis; exhaustive phonemic parity remains open. For 시, canonical broad /s/ and optional source-scoped [ɕ] are distinguished rather than forcing a universal categorical assertion.
- IPA-to-Ukrainian boundary: the existing ordinary pipeline uses IPA as the source for Korean-specific IPA-to-Ukrainian correspondences. Extended IPA is deliberately not yet fed to that target adapter: all Extended profiles remain target_compatible=false, the compatibility allowlist is empty, and the Extended panel says Ukrainian output is unchanged. This is correct fail-closed behavior while independent Korean IPA adjudication and Ukrainian target review are absent. Do not claim that Extended IPA already produces a newly adapted Ukrainian result.
- No independent Korean phonetic gold, speaker-conditioned acoustic measurements or approved Ukrainian target mapping was found.

**Task ledger**
- DONE_VERIFIED: exact-head Python 3.11/3.12/3.13, wheel install, web tests, Verify, Browser G2P, rendered review, research artifact generation, test-register extraction and named diagnostics.
- DONE_VERIFIED: paired A/B benchmark executed and artifact inspected; results and limitations are recorded above.
- PARTIAL: Python/browser Extended IPA contract exists, but browser phonemic analysis is inventory-derived and not parity-equivalent to Python; broad convention reconciliation remains source-/profile-scoped.
- PARTIAL: narrow IPA v6 is an evidence-scoped research profile, not a validated narrow transcription model or independently adjudicated output.
- PARTIAL: UI is wired and rendered review passed; manual assistive-technology/keyboard acceptance and broader accessibility/performance evidence are not established by rendered CI.
- BLOCKED: independent Korean phonetic adjudication and layer-aligned speaker-/dialect-conditioned gold. Acceptance requires qualified reviewers, frozen annotation guidelines, two independent labels and adjudication with agreement reported by process/context.
- BLOCKED: rights-cleared audio/label pilot. Acceptance requires dataset-specific terms or written agreement, approved purpose, and explicit permission for any redistributed derived annotations.
- BLOCKED: Extended IPA Ukrainian target compatibility. Acceptance requires independent Korean IPA adjudication, frozen IPA test set, independent Ukrainian target review, reviewed correspondence inventory and parity/regression checks before allowlisting a profile.
- TODO: exhaustive Python/browser phonemic parity over the frozen Hangul inventory and adversarial mixed-input/source-span fixtures; resolve mismatches with documented linguistic conventions, not relaxed tests.
- TODO: benchmark split by source lineage and speaker, with layer-aligned independently adjudicated gold for phonemic, broad, narrow and Ukrainian adaptation.
- DEFERRED / SKIPPED: optional neural inference jobs and NIKL metadata-only inventory; skips are not passes and no neural model is required for deterministic inference.

**Local execution limitation**
- Attempted git clone of the public repository; it failed before checkout because this environment could not resolve github.com (Could not resolve host: github.com). No local shell, pytest, npm, build or browser command is claimed. GitHub Actions is the executable verification evidence for the exact code SHA.
- The Superpowers connector/tool was not available as an executable tool in this session; the repository's existing Superpowers spec and plan were inspected and updated in place.

**Readiness:** research-preview software implementation with green exact-head CI and an inspected paired diagnostic. It is not beta-ready or production-ready and is not independently research-certified. The next genuine blockers are independent phonetic adjudication, rights-cleared acoustic data, full Python/browser parity, and independent Ukrainian target review.
**Additional model-data gap identified during final schema inspection**
- **PARTIAL:** schema v1.1 stores layer-level IPA strings, syllable/boundary records, variants and layer-typed rule traces, but it does not yet expose a complete per-segment typed IPA inventory with segment feature bundles, segment-local source spans, diacritics/length as structured fields and per-segment provenance. The present trace is not a substitute for this segment-level representation.
- **TODO:** design and validate segment objects only after defining a Unicode-safe IPA tokenizer/segment contract for tie bars, combining diacritics, affricates and length marks; preserve raw IPA strings and backwards compatibility. Acceptance requires round-trip serialization and Python/Browser parity fixtures for each IPA segment/diacritic class.
### Open PR / branch reconciliation

- **PR #509 — reused and continued:** the active Extended IPA branch is based directly on the inspected current main checkpoint 97bb411df8b998b22cd58adda015fb941201950c. It remains open, Draft and unmerged. No competing Extended IPA branch was created.
- **PR #507 — left untouched:** separate Strict/Soft/Super-soft coverage contract. Its base is older commit 0018e3ed292aab21bbac24d2eb702d362de5af90; compare with current main reports 19 commits ahead and 1 behind. It touches engine.js, main.js, the browser benchmark runner and coverage tests. It was not merged or ported because its branch is divergent and its scope is the separate three-mode coverage contract.
- **PR #505 — left untouched:** its feature branch is 30 commits ahead and 8 behind current main and changes overlapping core runtime files including pipeline.py and ipa.py, as well as engine conversion/rule modules and lexical data. It is a divergent benchmark/phonetic-advancement branch, not a safe drop-in dependency for PR #509. No commits were cherry-picked and no conflicting core implementation was silently combined.
- **PR #506 — left untouched:** baseline-only branch based on the pre-change benchmark anchor; its stated delta is a trailing comment in the benchmark runner. It is retained as historical baseline evidence and was not merged.
- Recently merged PRs and current mainline implementation were preserved. No PR was merged, closed, rebased, force-pushed or deleted during this run.



## Execution continuation — 2026-11-27 — typed segment-level Extended IPA

**Status: PARTIAL pending exact-head CI.** Branch: `feat/korean-extended-ipa-segment-ir-2026-11-27`; draft PR #510; base `main` at `97bb411df8b998b22cd58adda015fb941201950c`. The branch fast-forward-reuses PR #509's 131 commits without modifying PR #509.

- Added parallel standard-library Python and browser JavaScript segment parsers. They use Unicode code-point offsets, longest-match affricate inventory, base-segment feature bundles, attached aspiration/length/fortis/release/secondary-articulation/nasalization modifiers, and explicit boundary/unknown tokens. Unknown IPA code points are retained, never silently discarded.
- Each segment stores its IPA span, a source syllable span when a safe alignment exists, explicit `source_alignment: syllable-span` (not falsely precise phone alignment), and rule/evidence provenance from its layer trace.
- Python and browser Extended IPA layer payloads now include `segments` arrays while retaining the existing phonemic/broad/narrow IPA strings. Python pipeline now emits syllable-level broad and narrow trace entries so the segment parser can preserve provenance.
- Schema updated to require segment arrays and define segment, boundary and unknown token shapes.
- Narrow IPA symbols remain evidence-gated. In particular, `ɦ` is recognized by the segment inventory but is not emitted as a universal post-sonorant /h/ realization: Um (2014) reports shortening effects on the preceding sonorant even when /h/ is not acoustically manifested; this does not establish a categorical [ɦ] output.
- New Python/browser parser tests cover `sʰ`, `kʰ`, `ɦ`, `ɲ`, `ɭ`, `ɸ`, `ç`, `x`, atomic affricates, length, boundaries, unknown preservation, source alignment and provenance. Integration tests exercise the actual Extended IPA result builders.
- Verification is queued on exact head `d616be9ac2f4e016b386ca892d6a1e09b543a70d` (Tests run 45969848230; Verify run 45969848131; Browser G2P run 45969848170). These runs had not completed at the time of this entry. The test-only pre-implementation workflow attempt was superseded by PR concurrency before execution, so a local RED run was not observed; this environment has no local Git worktree/runtime.

### Task ledger

| Item | Status | Acceptance evidence |
|---|---|---|
| Python Unicode-safe IPA segment parser | PARTIAL | Source added; exact-head pytest pending |
| Browser Unicode-safe IPA segment parser | PARTIAL | Source added; exact-head node tests pending |
| Three-layer result integration and syllable spans | PARTIAL | Integration tests authored; Python/browser CI pending |
| Schema and runtime validation | PARTIAL | Schema v1.1 extended; schema/contract CI pending |
| Independent narrow IPA adjudication | BLOCKED | Requires independent Korean phonetic review and layer-aligned gold |
| Speaker/acoustic-conditioned [ɦ] selection | BLOCKED | Available Um (2014) abstract supports residual /h/ effects but not categorical [ɦ]; exact token-level evidence required |
| Ukrainian adapter changes | DEFERRED | Explicitly outside this phase; existing fail-closed profile boundary preserved |

Do not mark this increment DONE_VERIFIED until all exact-head Python, browser, schema, wheel and build checks have completed and their output has been inspected.


## Final continuation checkpoint — 2026-11-27

**Code checkpoint:** `d4b180209846d516a4aa402af0173e7ed1b9b55c` on `feat/korean-extended-ipa-segment-ir-2026-11-27`. Draft stacked implementation PR: #510. PR #509 remains open and unmodified; PR #510 reuses its exact head as an ancestor. Starting default-branch SHA: `97bb411df8b998b22cd58adda015fb941201950c`.

### Current task ledger

| Work item | Status | Evidence / acceptance |
|---|---|---|
| Existing three-layer phonemic/broad/narrow implementation | DONE_VERIFIED (prior PR #509) | Prior exact-head checks and diagnostics recorded above; do not infer phonetic accuracy from benchmark agreement |
| Python segment IR and feature inventory | PARTIAL | Implemented; exact-head tests queued |
| Browser segment IR and feature inventory | PARTIAL | Implemented; exact-head tests queued |
| Three-layer integration, source syllable alignment, provenance and separators | PARTIAL | Implemented; integration tests queued |
| Schema v1.2 and validators | PARTIAL | Python, JS and JSON Schema updated; exact-head contract checks queued |
| Full modern Hangul phonemic parity | PARTIAL | New 11,172-syllable cross-runtime test and Python exporter added; exact-head browser CI queued |
| Broad/narrow layer parity and independent narrow accuracy | BLOCKED | Requires layer-aligned independent Korean phonetic gold and expert adjudication; engine agreement is not gold |
| Manual keyboard/screen-reader/zoom acceptance | BLOCKED | Requires a human accessibility review; rendered layout review is not equivalent |
| Rights-cleared audio/acoustic annotation pilot | BLOCKED | No approved rights path and no licensed acoustic annotation dataset established |
| Ukrainian target adapter for Extended IPA | DEFERRED | Explicitly outside this implementation phase; fail-closed behavior remains |

### Exact-head verification state

At code checkpoint `d4b180209846d516a4aa402af0173e7ed1b9b55c`, GitHub Actions runs are queued: Tests `45971760971`, Verify `45971760717`, Browser G2P `45971760736`, Master/research artifacts `45971760731`. None is recorded as passed here. Earlier queued runs on superseded commits are not acceptance evidence.

A local clone was attempted and failed with DNS resolution for `github.com`; therefore no local pytest, Node, schema, wheel or build command was executed. The test-first files were committed before the implementation files, but the pre-implementation GitHub run was superseded while queued, so a RED failure was not observed. Do not describe this as a verified RED→GREEN cycle.

### Implementation detail / rulings

- Segment source alignment is deliberately marked `syllable-span`, not phone-level. We do not invent phone-to-grapheme alignment without a separately adjudicated alignment.
- Unknown IPA code points are retained as typed unknown tokens, with source/provenance when available; incomplete trace coverage falls back to parsing the complete IPA string rather than silently dropping phones.
- Segment identifiers are unique within each layer. Word/syllable separators are retained as boundary tokens and in the existing source-boundary list.
- `ɦ` is supported by the feature inventory but is not emitted as a universal post-sonorant /h/ realization. Current evidence does not establish a categorical [ɦ] mapping; keep that context unresolved.
- Schema version is 1.2 because required segment arrays change the result contract. Phonetic profile versions are unchanged.
- No Ukrainian adapter changes were made.


## 2026-11-27 implementation checkpoint (updated)

**Code checkpoint:** `a65c2857496051b077dc09b0427c479b31a11f09` on `feat/korean-extended-ipa-segment-ir-2026-11-27`; draft PR #510 currently targets `main` to run the repository's pull-request CI. PR #509 remains open and untouched; its head is an ancestor of this branch. PRs #505, #506 and #507 remain untouched. Starting default-branch SHA: `97bb411df8b998b22cd58adda015fb941201950c`.

### Implemented in this continuation

- Python and browser segment parsers now share a Unicode-code-point contract: longest-match affricates (with/without tie bar), consonant/vowel core feature bundles, aspiration, length, fortisness, unreleased release, secondary articulation and nasalization.
- Consonant-only features are explicitly `not-applicable` on vowels.
- Each segment carries a base, modifiers, feature bundle, IPA span, honest syllable-level source span/alignment, and rule/evidence provenance. Phone-level source alignment is not claimed.
- Word/syllable/punctuation boundaries are retained as tokens. Unrecognized code points are retained as `unknown` with source/provenance when available.
- Layer token IDs are unique. Segment trace coverage is checked against the complete layer string; if trace coverage is incomplete, the implementation falls back to full-string parsing rather than dropping tokens or misattributing spans.
- Python and browser builders expose segment arrays for phonemic, broad and narrow layers; existing IPA strings remain unchanged. Schema and dependency-free validators are version 1.2 and check token structure, offsets, source spans, ordering and unique IDs.
- Narrow output tests exercise actual generated `kʰ`, `sʰ`, `ɲ`, `ɭ`, `ɸ`, `ç`, and `x`. `ɦ` is represented in the segment inventory but is not emitted categorically after sonorants; the cited Korean evidence does not justify a universal [ɦ] output.
- Added exhaustive cross-runtime phonemic parity test across all 11,172 modern precomposed Hangul syllables. This compares implementation parity only, not phonetic accuracy.

### Task ledger

| Work item | Status | Acceptance criterion |
|---|---|---|
| Existing phonemic/broad/narrow result contract and narrow v6 profile | DONE_VERIFIED (PR #509) | Prior exact-head checks/diagnostics recorded above; benchmark agreement is not phonetic gold |
| Python segment IR/parser and validator | PARTIAL | Exact-head pytest and schema tests pass |
| Browser segment IR/parser and validator | PARTIAL | Exact-head Node tests and build pass |
| Segment arrays for all three layers, boundaries, spans and provenance | PARTIAL | Python/browser integration tests and parity checks pass |
| Schema v1.2 contract | PARTIAL | JSON Schema and dependency-free validators pass |
| 11,172-syllable Python/browser phonemic parity | PARTIAL | New full-inventory Node test passes without mismatches |
| Broad/narrow phonetic accuracy and independent adjudication | BLOCKED | Requires independent Korean phonetic gold and qualified review |
| Manual keyboard/screen-reader/zoom acceptance | BLOCKED | Human accessibility review required |
| Rights-cleared audio/acoustic annotation pilot | BLOCKED | No approved rights path or licensed acoustic labels |
| Extended IPA → Ukrainian adapter | DEFERRED | Explicitly out of scope; existing fail-closed behavior preserved |

### Verification state

For exact code head `a65c2857496051b077dc09b0427c479b31a11f09`, GitHub Actions are queued: Tests `45972473238`, Verify `45972473054`, Browser G2P `45972473135`, Master/research artifacts `45972472985`. The workflow jobs have not started; none is recorded as passed. Earlier runs on superseded commits are not acceptance evidence.

A local clone was attempted and failed because this environment could not resolve `github.com`. No local pytest, Node, JSON Schema, wheel or build command was executed. Test-first files were committed before their implementation, but the pre-implementation workflow was superseded while queued; a RED failure was not observed. Do not claim a completed RED→GREEN cycle.

### Next genuine blocker

Read the exact-head CI results, fix any failures and rerun. After checks pass, retarget PR #510 to PR #509's branch for a clean stacked diff. Independent narrow adjudication, licensed acoustic data and human accessibility review remain external/evidence-limited gates; do not manufacture phonetic rules or benchmark gold to clear them.


## Extended IPA segment IR follow-up — 2026-11-27 (current status)

Current branch: `feat/korean-extended-ipa-segment-ir-2026-11-27`; PR #510 stacked on PR #509; head `ca00add3aee5ffa46bf2eff9201b94c996aaef11`. PR #510's base is `feat/kozak-kim-extended-ipa-2026-11-26`, and the branch comparison is 65 commits ahead / 0 behind / 16 changed files.

### Implementation ledger

| Item | Status | Evidence / next acceptance |
|---|---|---|
| Python Unicode-aware segment parser | PARTIAL | Implemented; exact-head Python suite pending |
| Browser JavaScript segment parser | PARTIAL | Implemented; exact-head Node/browser suite pending |
| Phonemic, broad and narrow layer segment arrays | PARTIAL | Integrated; Verify and Browser G2P pending |
| IPA code-point offsets, syllable source spans, provenance, boundaries, unknown retention | PARTIAL | Regression fixtures authored; exact-head execution pending |
| Result schema v1.2 and runtime validators | PARTIAL | Schema and validators updated; schema/contract CI pending |
| Exhaustive 11,172-Hangul Python/browser phonemic parity | PARTIAL | Exporter and parity test added; not yet executed on exact head |
| Independent narrow/broad phonetic adjudication | BLOCKED | Requires qualified independent reviewers and layer-aligned gold |
| Rights-cleared acoustic annotation pilot | BLOCKED | Requires approved corpus/audio rights and measurement/redistribution terms |
| Human accessibility acceptance | TODO | Keyboard-only, screen-reader and zoom review still required |
| Extended IPA → Ukrainian target adapter | DEFERRED | Explicitly outside this phase; remains fail-closed |

### Exact-head verification

The following exact-head runs are queued, not passed: Tests `45972689269`; Verify `45972689301`; Browser G2P `45972689642`; master/research artifacts `45972689334`. Teacher split audit, editorial review, morphology smoke/consensus, external UGTPHON, native-vs-g2pk, optional g2pK, and test-register extraction are also queued. Charsiu review queue was skipped by workflow policy; this is not a pass. No new benchmark score is claimed.

A local clone was unavailable because DNS resolution for github.com failed. Therefore no local pytest, Node, schema, wheel, build or benchmark command was run. The GitHub Actions runs above are the only executable verification path currently available; do not mark implementation gates DONE_VERIFIED until exact-head jobs finish and logs/artifacts are inspected.

### Evidence boundaries

- Extended IPA means structured segmental representations and their phonetic distinctions, not lossy candidate normalization.
- The segment inventory can represent `sʰ`, `kʰ`, `ɲ`, `ɦ`, `ɭ`, `ɸ`, `ç`, `x`, etc.; representability does not mean every symbol is a justified categorical Korean output.
- `ɦ` remains an inventory symbol only. No universal post-sonorant /h/ → [ɦ] rule is asserted.
- Source alignment is syllable-level where available; the implementation does not claim phone-level Hangul-to-IPA alignment.
- PR #509 remains open and unmodified. PR #510 is a stacked draft. No merge, release or Ukrainian adapter change has occurred.


### Test-oracle correction — 2026-11-27

A source-level review found two new parser tests treating ASCII `?` as an unknown phone even though both runtimes intentionally classify Unicode punctuation as boundary tokens. Corrected the fixtures to use the non-punctuation unknown code point `😀`, preserving the separate punctuation-boundary tests. This is a test-only correction; no production parser behavior changed. The corrected tests have not yet been executed locally (GitHub DNS failure) or confirmed by CI; keep the gate PARTIAL until exact-head workflows pass.


A second test-oracle defect was found during review: the browser test destructured the third token as the unknown token even though the fixture contains a later segment and word boundary before the unknown emoji. It now selects tokens by their explicit `kind`. This correction is test-only and awaits exact-head CI.


### PR/CI topology update — 2026-11-27

PR #510 currently targets `main` temporarily so the repository's mainline pull-request verification workflows can run. The incremental implementation itself remains a clean stack on PR #509: comparing #509's head `6b473a18e3f4e7f971398272ff0ef0e7f1be6abe` to this branch gives 73 commits ahead, 0 behind, and 16 changed files. Once exact-head CI has completed and its logs/artifacts have been inspected, retarget PR #510 to PR #509's branch to restore the compact stacked diff. Current branch head at this note: `a0498f51a0d185be6a9d4271e352b187712ecba9`.


## Exact-head verification update — 2026-11-27 10:12 UTC

Current PR #510 head: `a7116388d9c6ed592f4a1a94ea77436b16994737` on `feat/korean-extended-ipa-segment-ir-2026-11-27`. The preceding head `08feed20a54187ebc1c35f211801e9c7e5c85632` had one failing browser fixture: ASCII `?` was expected to be `unknown`, but punctuation is correctly tokenized as `boundary`. Replaced that fixture with `😀`; production code was not changed.

### Exact-head results

| Gate | Status | Evidence |
|---|---|---|
| Python tests, Python 3.11 / 3.12 / 3.13 | DONE_VERIFIED | Tests workflow `45979820107`, all three matrix jobs successful |
| Python regression and data integrity | DONE_VERIFIED | Verify workflow `45979820187`, Python job successful |
| JavaScript suite | DONE_VERIFIED | Tests workflow web job: 1,497 passed, 0 failed |
| Browser G2P suite | DONE_VERIFIED | Browser G2P workflow `45979819931`: 1,497 passed, 0 failed |
| Browser regression and production build | DONE_VERIFIED | Verify workflow `45979820187`: 1,497 passed, 0 failed; Vite build completed |
| Python/browser phonemic parity over 11,172 modern Hangul syllables | DONE_VERIFIED | Node test #135 passed; exporter and browser adapter matched every item |
| Segment IR fixtures, provenance, offsets and layer integration | DONE_VERIFIED | Node tests #150–158 passed, including the corrected unknown-codepoint fixture |
| Clean wheel install | DONE_VERIFIED | Tests workflow wheel-install job successful |
| Teacher corpus split audit | DONE_VERIFIED | Tests workflow and dedicated audit successful |
| Browser visual review | DONE_VERIFIED | Desktop/tablet/mobile editorial review successful |
| Morphology adapter smoke (Kiwi and MeCab-Ko) | DONE_VERIFIED | All real-engine and native strict/soft jobs successful |
| Rule-license consensus, external UGTPHON comparison, corpus artifacts and test-register extraction | DONE_VERIFIED | Runs `45979819855`, `45979819908`, `45979820161`, `45979819995`, `45979820101` successful |
| Multi-engine IPA benchmark | PARTIAL | Current-head run `45979819893` pending behind earlier run `45973857624`; do not infer a current-head benchmark result |
| CharsiuG2P and ByT5 inference | DEFERRED / SKIPPED | Optional jobs skipped by workflow policy; not a pass |
| Independent narrow/broad phonetic adjudication and rights-cleared audio review | BLOCKED | Requires qualified independent reviewers and approved audio/data rights |
| Human keyboard/screen-reader/zoom acceptance | TODO | Automated viewport review is not a substitute for human accessibility acceptance |
| Extended IPA → Ukrainian adapter | DEFERRED | Outside this implementation increment; existing fail-closed adapter preserved |

### Diagnostic findings (not normative accuracy)

- Previous pinned diagnostic on superseded code head `08feed20`: native engine scored 2,702/2,703 UGTPHON occurrences, exact match 52.7387%, CER 9.0130%; g2pk scored 2,703, exact match 53.0892%, CER 9.2328%. On paired cases, g2pk exact-match delta was +0.3701 percentage points but CER worsened by 0.2207 percentage points. This is a trade-off, not a winner or a release accuracy claim.
- Morphology-consensus diagnostic on the same superseded head: exact-match remained 52.7192%; CER worsened from 9.0130% to 9.0303%. It did not demonstrate a gain.
- UGTPHON normalization diagnostic: 2,627 paired tokens; exact match 51.2752% vs raw baseline 51.0468%, CER 9.8637% vs 9.9689%; 15 tokens rescued, 0 lost. Small diagnostic improvement only.
- Python g2pk differential warning: 18/20 surface forms equal. Two JS-port mismatches remain: `넓죽하다` (raw JS `널쭈카다` vs Python/practical adapter `넙쭈카다`) and `읽고` (raw JS `익꼬` vs Python/practical adapter `일꼬`). IPA gold is not independently adjudicated; track these as a separate browser-port discrepancy, not as evidence of IPA accuracy.
- The full adversarial NIKL passage audit still reports 13 morphology-sensitive unresolved forms. Strict whole-text rendering remains fail-closed; do not fill these gaps with guessed outputs.

### Next actions

1. Let the current-head multi-engine benchmark finish and inspect its artifacts, especially the paired standard-vs-Extended IPA report.
2. Update the task ledger again with exact benchmark outcome and any genuine failure.
3. Once all exact-head evidence is inspected, retarget PR #510 from `main` to PR #509's branch to restore the intended stack. Do not merge or release.
4. Keep scientific adjudication, audio rights, and human accessibility as explicit external blockers.


## UGTPHON paired comparison update — 2026-11-27 10:16 UTC

The exact-branch external UGTPHON comparison job `45980290133` completed successfully. It compares the deterministic browser Kozak-Kim engine with the untouched vendored g2pK JavaScript port on 2,702 paired Hangul tokens (275 rows; 264 sentence/utterance clusters; 2,000 cluster-bootstrap resamples).

- Kozak-Kim: 1,436 exact matches; exact-match rate 53.1458%; CER 8.0222%.
- g2pK: 1,444 exact matches; exact-match rate 53.4419%; CER 8.2125%.
- Paired exact-match delta (Kozak-Kim minus g2pK): −0.2961 percentage points; 95% cluster-bootstrap CI [−1.1473, +0.2369] pp, which crosses zero.
- Paired CER delta (Kozak-Kim minus g2pK): −0.1904 percentage points; 95% cluster-bootstrap CI [−0.3320, −0.0430] pp, favoring Kozak-Kim on this metric.
- 2,487/2,702 surfaces were identical; 215 differed. Both paths had zero engine errors.

Interpretation: exact-match rate slightly favors g2pK but the confidence interval includes no difference; CER favors Kozak-Kim on this particular test split. This is a diagnostic comparison against UGTPHON's references, not independent phonetic adjudication, not a Ukrainian target benchmark, and not proof of universal superiority. Do not collapse the two metrics into a single winner.

The paired native-engine/g2pK job `45980290331` also passed. It reports native exact-match 52.7387%, CER 9.0130%; g2pK exact-match 53.0892%, CER 9.2328%; paired exact delta +0.3701 pp for g2pK and CER delta +0.2207 pp against g2pK. This is a different native-vs-vendored comparison from the browser Kozak-Kim comparison above; keep the two protocols separate.

Current-head full multi-engine benchmark `45980290275` remains pending behind an earlier long-running benchmark `45973857624`. The current-head benchmark has not produced the paired standard-versus-Extended IPA report yet. The Charsiu inference queue remains skipped by workflow policy.


## Task-ledger reconciliation after exact code CI — 2026-11-27 10:18 UTC

Current PR #510 head is `61b8161fc5535eeab5d0bdd282be2e752e946874`. The implementation code and test fixture were verified on `a7116388d9c6ed592f4a1a94ea77436b16994737`; subsequent commits changed only the three status/handoff documents and PR metadata.

The previous PARTIAL labels for the technical segment-IR acceptance gates are superseded by this reconciliation:

| Work item | Reconciled status | Evidence |
|---|---|---|
| Python Unicode-aware segment parser and validator | DONE_VERIFIED | Python 3.11/3.12/3.13 test jobs passed; Verify Python regression/data-integrity passed |
| Browser JavaScript segment parser and validator | DONE_VERIFIED | Node 1,497/1,497 passed; Browser G2P 1,497/1,497 passed |
| Phonemic/broad/narrow segment arrays, spans, provenance, boundaries and unknown retention | DONE_VERIFIED | Node tests #150–158 and Python segment-IR tests passed |
| Schema v1.2 and runtime contract checks | DONE_VERIFIED | Python regression/data-integrity, browser regression and schema tests passed |
| Exhaustive 11,172-Hangul Python/browser phonemic parity | DONE_VERIFIED | Node test #135 passed; zero mismatches |
| Clean wheel install and production build | DONE_VERIFIED | wheel-install job and Vite production build successful |
| Current multi-engine benchmark and paired standard-vs-Extended IPA comparison | PARTIAL | Latest benchmark workflows pending/queued behind an older long-running job; no uplift claim |
| Independent broad/narrow phonetic validation | BLOCKED | No independent layer-aligned Korean phonetic gold/adjudication |
| Rights-cleared acoustic review | BLOCKED | No approved audio/data rights path |
| Human accessibility acceptance | TODO | Automated viewport checks passed; keyboard/screen-reader/zoom review remains |
| IPA-to-Ukrainian adapter changes | DEFERRED | Out of scope; current fail-closed adapter unchanged |

Core implementation acceptance is therefore technically verified, but the overall Extended IPA research workstream is not release-ready. The benchmark comparison is still pending, and linguistic/audio/accessibility evidence remains open. Do not infer accuracy improvement from parser coverage or cross-runtime parity.


## Paired Extended IPA artifact inspection and liquid-rule correction — 2026-11-27

Artifact `standard-vs-extended-ipa-ab-45973857624` (artifact 15188603961; code head `08feed20`) was downloaded and inspected directly. It is a pre-correction browser-engine diagnostic, and its dataset metadata explicitly says the references are not independently adjudicated for phonemic/narrow IPA.

- UGTPHON: standard/broad 52.7387% exact, CER 9.0130%; narrow 55.8845% exact, CER 7.2217%; phonemic 20.2073% exact, CER 23.4737%.
- SIGMORPHON: standard/broad 35.8717% exact, CER 14.5598%; narrow 39.6794% exact, CER 12.6912%; phonemic 12.9259% exact, CER 26.6742%.
- Standard IPA and Extended broad were identical by contract for all 2,703 UGTPHON and 999 SIGMORPHON occurrences. No broad-layer uplift exists.
- Narrow is a different layer, so its higher cross-layer string agreement is not a narrow-IPA accuracy result. The corpora do not provide independently adjudicated narrow-IPA gold.

The artifact exposed a concentrated error: [ɭ] occurred in 489 UGTPHON and 152 SIGMORPHON narrow predictions; it co-occurred with 284/288 UGTPHON exact-match losses and all 67 SIGMORPHON exact-match losses. Crosby & Dalola (2021), a 12-speaker Standard Korean study (CC BY 4.0; DOI 10.3765/plsa.v6i1.5002), found 99.3% intervocalic taps [ɾ] and associated retroflex lateral realizations primarily with pre-pausal and preconsonantal contexts. The old text-only onset rule was therefore overgeneralized and misattributed to Lee (1993).

**Correction committed in this increment:** narrow profile v7 removes automatic [ɭ] from intervocalic and front-vowel onset ㄹ; [ɾ] is retained in those contexts. The parser still represents [ɭ]. Normative ㄹ-coda + ㄹ-onset assimilation is preserved and now cites the NIKL standard rule separately. Source/evidence registries and narrow-profile version IDs are updated. Re-run the A/B benchmark on the corrected code before interpreting narrow metrics.

The artifact's narrow/phonemic figures are retained only as historical pre-correction cross-layer diagnostics. They are not current-head metrics and do not establish accuracy. The exact-head multi-engine workflow remains the next executable benchmark gate; independent layer-matched phonetic gold and audio review remain blocked by missing adjudication/rights.


## Evidence reconciliation — Korean liquid [ɾ] / [ɭ] — 2026-11-27

A primary-source recheck corrects the previous note that Lee (1993) did not support intervocalic [ɭ]. Lee (1993, p.31; DOI 10.1017/S0025100300004758) explicitly describes Seoul /l/ as [ɭ] intervocalically and before /i,j/. Crosby & Dalola (2021; DOI 10.3765/plsa.v6i1.5002), in a 12-speaker Standard Korean sample, found 422/425 intervocalic liquids were taps (99.3%) and retroflex laterals were strongly associated with pre-pausal and preconsonantal contexts. These are conflicting source descriptions, not grounds for a universal rule.

Narrow profile v7 now keeps [ɾ] as the primary intervocalic onset ㄹ result and exposes [ɭ] only as a separate unselected narrow-layer variant, with both citations and evidence status conflicting-source-descriptions-variant-only. The segment parser continues to recognize [ɭ]. The variant is not selected for a speaker without speaker/dialect/prosodic/audio context and is not passed to Ukrainian adaptation.

The pre-correction A/B artifact measured [ɭ] as primary; its [ɭ]-associated losses motivated this correction but its narrow metrics are not v7 metrics. A fresh v7 benchmark is required. Do not report the historical narrow score as a current uplift.


## Multi-engine benchmark results inspected — 2026-11-27

The prior multi-engine run 45973857624 completed successfully and its aggregate artifact 15190546061 was downloaded and inspected. It ran 1,000-item samples per track (eligible counts vary after exclusions). The broad engine code is unchanged by narrow-profile v7, so these are historical broad-profile diagnostics, not v7 narrow results.

Raw strict IPA comparison (exact match / CER):
- UGTPHON, 2,702 scored: ClippyFirst 52.7387% / 9.0130%; g2pk 53.0892% / 9.2328%; g2p-ko 52.4602% / 9.3928%. Native CER is lower than g2pk, while exact match is 0.35 pp lower; cluster-bootstrap intervals overlap.
- SIGMORPHON, 998 scored: ClippyFirst 35.9719% / 14.5347%; g2pk 35.3353% / 14.8222%; g2p-ko 35.6356% / 14.6970%. Native is modestly ahead on both metrics; intervals overlap.
- IPA-Dict Korean, 996 scored: ClippyFirst 41.2651% / 9.9335%; g2pk 41.1000% / 10.0412%; g2p-ko 40.9409% / 10.0154%. Small differences; this source is Wiktionary-derived and not independent of SIGMORPHON lineage.
- Seoul Corpus phonemic gold: ClippyFirst 14.8033% / 39.8430%; g2pk 15.7000% / 39.5789%. This is an underlying phonemic reference, not broad surface gold, so do not use it as a direct surface-G2P ranking.
- K-SPAN modern: ClippyFirst 10.8652% / 27.7790%; g2pk 10.9000% / 27.7325%. K-SPAN conservative: ClippyFirst 7.5529% / 27.4537%; g2pk 7.5000% / 27.4913%. These are effectively tied and the K-SPAN mapping carries a substantial independent-key/WorldBet integrity warning.

A lossy broad-candidate sensitivity normalization yields higher agreement (ClippyFirst vs g2pk: UGTPHON 86.23% vs 85.72%, SIGMORPHON 69.84% vs 68.67%, IPA-Dict 86.14% vs 85.70%). It collapses or removes meaningful contrasts (including [ɭ]→[l], [ɲ]→[n], h-like allophones, separators, selected diacritics and stress). These are sensitivity scores, not the engine's actual output or evidence of narrow accuracy.

Browser strict/soft policy: strict mode has 100% UGTPHON coverage, 99.9% SIGMORPHON, 99.4% K-SPAN modern, 99.3% K-SPAN conservative, and 99.6% IPA-Dict; it has zero engine errors and no heuristic or typed-fallback tokens. Soft mode raises conditional exact match on UGTPHON to 56.19% but drops coverage to 82.8%, reducing coverage-adjusted exact match to 46.54% (below strict 52.72%). Soft also lowers coverage-adjusted exact match on SIGMORPHON, K-SPAN and IPA-Dict. Super-soft coverage is only 0.3–2.0%, with negligible coverage-adjusted scores. Strict remains the preferred deterministic default; soft is not a net gain when abstentions are counted.

Data/evaluation caveats: UGTPHON is user-generated/noisy; SIGMORPHON and IPA-Dict conventions are not identical; IPA-Dict shares Wiktionary lineage; Seoul Corpus labels are phonemic; K-SPAN key-vs-WorldBet integrity reports 22,843 mismatches across 41,174 matched rows, chiefly systematic vowel-symbol differences, and its source WorldBet fields are used without overriding them from the key. No result measures Ukrainian adaptation quality.

The current v7 benchmark run 45983709835 is in progress. Its paired standard-vs-Extended IPA artifact is still required to evaluate the corrected primary [ɾ] plus optional [ɭ] variant. Do not carry forward the pre-correction v6 narrow metrics as v7 evidence.


### Feature-level comparison from the pre-correction A/B artifact

On the same reference split, the narrow layer's exact-match gains were concentrated in aspirated /s/ [sʰ] (243 UGTPHON and 67 SIGMORPHON gains), palatalized [ɕ] (82 and 14), palatal nasal [ɲ] (44 and 13), and [ç] (28 and 0). Examples include 가슴 (broad ka.sɯm → narrow ka.sʰɯm against gold ka̠sʰɯm), 그냥 (kɯ.njaŋ → kɯ.ɲjaŋ against kɯɲja̠ŋ), and 고시엔 (ko.si.en → ko.ɕʰi.en against ko̞ɕʰie̞n). These are useful signs that the allophonic rules can move outputs toward the corpus conventions, but they remain corpus-string diagnostics, not independently adjudicated narrow-IPA accuracy.

The dominant losses were not spread evenly across the profile: [ɭ] co-occurred with 284/288 UGTPHON and 67/67 SIGMORPHON exact losses, and with 382/388 and 116/117 distance-worsening cases. Example: 다리 had gold ta̠ɾi, standard ta.ɾi, but pre-correction narrow ta.ɭi. This motivated v7's [ɾ] primary + optional [ɭ] variant policy. The hypothesis is that v7 preserves the aspiration/palatalization gains while avoiding the overgeneralized [ɭ] losses; only the new v7 A/B artifact can confirm or reject that hypothesis.


## Standard vs Extended IPA paired benchmark — artifact inspection, 2026-11-27

Inspected the uploaded `standard-vs-extended-ipa-ab` artifact (workflow run `45973857624`, artifact `15188603961`; benchmark script `scripts/benchmark_extended_ipa_ab.mjs`; engine `Kozak Kim deterministic browser engine`; strict morphology). The benchmark uses the same source rows, token order, eligibility and gold strings for standard and Extended IPA passes. Reference layers are explicitly `reference-layer-not-independently-adjudicated-here`.

| Dataset | Layer | Exact match | CER | Coverage |
|---|---|---:|---:|---:|
| UGTPHON (2,703 occurrences; 2,702 scored) | Standard strict broad | 52.7387% | 9.0130% | 99.963% |
| UGTPHON | Extended broad | 52.7387% | 9.0130% | 99.963% |
| UGTPHON | Extended phonemic | 20.2073% | 23.4737% | 99.963% |
| UGTPHON | Extended narrow | 55.8845% | 7.2217% | 99.963% |
| SIGMORPHON (999 occurrences; 998 scored) | Standard strict broad | 35.8717% | 14.5598% | 99.900% |
| SIGMORPHON | Extended broad | 35.8717% | 14.5598% | 99.900% |
| SIGMORPHON | Extended phonemic | 12.9259% | 26.6742% | 99.900% |
| SIGMORPHON | Extended narrow | 39.6794% | 12.6912% | 99.900% |

### Interpretation and limits

- Standard broad and Extended broad are identical by contract: zero prediction differences and zero status differences on all 2,703 UGTPHON and 999 SIGMORPHON occurrences. This is expected because Extended broad wraps the existing strict broad output; the segment IR is a structured representation boundary, not a new G2P predictor. There is no measured broad accuracy uplift.
- Extended narrow has numerically higher exact match and lower CER against these stored references (+3.1458 pp exact / -1.7913 pp CER on UGTPHON; +3.8077 pp / -1.8686 pp on SIGMORPHON). However, neither corpus reference layer was independently adjudicated as narrow IPA in this benchmark. The report explicitly says narrow scores are cross-layer string agreement only, not narrow-IPA accuracy. Do not present these deltas as verified phonetic improvement.
- Extended phonemic scores poorly against these same broad/mixed references (UGTPHON 20.2073% exact, 23.4737% CER; SIGMORPHON 12.9259%, 26.6742%). The report says this comparison is meaningful only if the gold is phonemic and uses compatible inventory/segmentation. It is not a fair phonemic accuracy score.
- No benchmark here measures Ukrainian target transcription accuracy, rule accuracy, or the quality of an IPA-to-Ukrainian adapter.
- Therefore: technical Extended IPA IR is implemented and verified; standard-vs-Extended broad prediction accuracy is unchanged; narrow accuracy remains unproven pending layer-aligned independent gold.

The separate multi-engine artifact from the same run is aggregate-only and is not an A/B of Extended IPA. Its strict native results are UGTPHON 52.7387% exact / 9.0130% CER (2,702 scored of 2,703), SIGMORPHON 35.9719% / 14.5347% (998/999), and Seoul phoneme-tier 14.8033% / 39.8430% (966/1,000). The separate paired UGTPHON engine comparison reports native 52.7387% / 9.0130% vs g2pk 53.0892% / 9.2328% on 2,702 paired occurrences; g2pk gains +0.3701 pp exact but worsens CER by +0.2207 pp. These are diagnostic comparisons across engines, not Extended-IPA gains or adjudicated gold accuracy.

The A/B artifact was produced on implementation commit `08feed20a54187ebc1c35f211801e9c7e5c85632`; the subsequent `a7116388` change only corrected a test fixture (no production parser/IPA output change), and documentation-only commits followed. The current-head benchmark workflow was cancelled before producing its own artifact; this prior artifact remains the inspected diagnostic evidence, not an exact-current-head rerun.


## Extended Narrow coverage continuation — 2026-11-27 — profile v9

**Branch:** `feat/korean-narrow-phonetics-coverage-2026-11-27` (stacked on PR #510). **Base:** PR #510 head `e5d70f373c3603a9c573080eee0df7e19199f067`. **Scope:** research-grounded Narrow allophony; Standard/Broad and Ukrainian adaptation remain unchanged.

### Literature-to-runtime coverage map

| Phenomenon | Existing implementation | Narrow status / boundary |
|---|---|---|
| Three-way lenis/aspirated/fortis stop contrast | Underlying inventory and broad IPA; broad inter-sonorant voicing | No invented VOT/F0/voice-quality diacritics. 2020/2026 studies show prosodic-position, focus, age and vowel-conditioned cue reweighting; acoustic values require audio. |
| Lenis /s/ and sibilant coarticulation | Narrow [sʰ], restricted [ɕʰ] before ㅣ/ㅖ/ㅑ | Partial, context-scoped; no blanket palatalization of all /j/ vowels or fortis /s͈/. |
| Nasal palatalization | [ɲ] before selected /j/-initial nuclei | Research-only generalization; /i/ excluded; primary-source review still required. |
| /h/ allophony | [ç] before selected high-front/glide nuclei, [x] before ㅜ, [ɸ] in same-word intervocalic position | Source-scoped descriptions; post-sonorant weakening/deletion remains unresolved, not forced to [ɦ]. |
| Lenis stop voicing | Broad [b d ɡ dʑ] in the supported inter-sonorant contexts | Already represented; further phonetic gradience is not inferred without measurements. |
| Liquid tap/lateral and assimilation | [ɾ] singleton onset; [l] coda/geminate; normative ㄹ+ㄹ assimilation | Intervocalic [ɾ] remains primary; conflicting onset [ɭ] is unselected. |
| Coda lateral retroflexion | **New v8:** optional [ɭ] variants for word-final coda ㄹ and coda ㄹ before same-word ㅎ | Unselected sociophonetic alternatives based on Crosby (2024), with dialect/gender/age/style caveats; canonical [l] is unchanged. |
| Geminate liquid before high-front vocoids | **New v10:** optional unselected [lʲ] candidate, primary [l] unchanged; Crosby & Dalola (2021) measured F2 elevation (~254.49 Hz) | Gradient coarticulation only; categorical [ʎ] is not inferred. Nasalized/intermediate laterals and speaker-conditioned tap/lateral probabilities remain TODO. |
| Coda neutralization/release, nasalization, palatalization, aspiration, fortition, n-insertion, liaison, morphology and boundary interactions | Existing Standard/NIKL rule engine and adversarial cases | Broad phonological rules remain separate from Narrow phonetic detail; gradient rates are not collapsed into categorical outputs. |
| Vowel quality, ㅢ, diphthongs/glides and hiatus | Existing broad realizations and optional ㅢ/ㅚ/ㅟ/ㅖ/ㅐ variants | Narrow formant/coarticulation/reduction is incomplete; no speaker-specific vowel quality inferred from text. |
| Prosody, focus, phrase boundaries, speech rate | Nullable context fields and separate acoustic annotation contract | Text-only context stays null. F0, VOT, closure voicing, H1*-H2*, H1*-A1*, CPP and formants require measured audio and method provenance. |

### v8 implementation

- Added a source-backed, **unselected** coda [ɭ] variant when ㄹ is word-final or precedes same-word ㅎ. Evidence: Crosby (2024), 23 speakers across Central, Gyeongsangdo and Jeollado; word-final position OR 2.516 and pre-/h/ OR 3.056 versus geminate reference; substantial dialect/gender/age/style effects. The article only analyzes tokens classified as lateral, so it does not imply that every written coda ㄹ is realized as a lateral.
- Kept primary coda [l] and all Broad/Standard outputs unchanged. No speakerless probability or dialect guessing was added.
- Added source S038 to `data/korean/sources.csv` and `SRC-KOREAN-LIQUID-RETROFLEX-2024` to `research/SOURCE-REGISTER.csv`; no audio or corpus annotations were imported.
- Python and browser Extended IPA now use narrow profile v9; added tests for word-final and pre-/h/ candidates and a negative control for a non-triggering vowel-following context.

### Benchmark interpretation and open gates

- Historical paired A/B artifact run 45973857624: Standard Broad = Extended Broad by contract; Narrow cross-layer string agreement was 55.8845% exact / 7.2217% CER on UGTPHON and 39.6794% / 12.6912% on SIGMORPHON. These are **not narrow accuracy scores**: the stored references were not independently adjudicated as narrow IPA, and the artifact predates the v7 [ɾ]-primary correction and v8 coda variants.
- The 2024 coda [ɭ] variants do not alter primary IPA and are not expected to change Exact Match/CER. Their acceptance criterion is correct variant eligibility, provenance, and cross-runtime parity, not score uplift.
- TODO: exact-head CI and rerun paired v8 A/B; inspect per-feature additions/omissions and paired wins/losses. BLOCKED: independent layer-matched narrow IPA gold, rights-cleared audio, and qualified phonetic adjudication. A high score against Broad or mixed references cannot clear this gate.
- No F0/VOT/voice-quality realization, dialect choice, speaker choice, or phrase structure is guessed from text. No Ukrainian target adapter change.

**Readiness:** research prototype. Software verification is pending on this branch; no linguistic certification or narrow accuracy gain is claimed.


### Additional literature synthesis — 2026-11-27

The completed Undermind review returned 177 relevant papers (summary is abstract/metadata-level unless individually opened). Its central implementation recommendation is to separate normative categorical phonology from narrow phonetic realization and only emit narrow detail when supported by audio or a declared, validated speaker/prosody profile. Research workspace: [Korean phonetic phenomena review](https://app.undermind.ai/projects/de353992-202a-4b09-bf19-47932f80e426?path=%2Frepository-continuation%2FKorean%20phonetic%20phenomena%20implementation%20coverage%20and%20benchmark%20design%202026-11-27).

Newly registered sources:
- Schweizer, Ahn & Kwon (2026), DOI 10.1017/S002510032510087X: Seoul lenis/aspirated/fortis stop cues differ between IP-initial, AP-initial and word-medial positions. IP/AP-initial distinction uses burst duration and post-stop F0, with H1*-H2* also separating tense from non-tense; word-medial cues include closure duration and voicing during closure. This supports a prosody-aware acoustic annotation layer, not deterministic IPA changes from orthography.
- Jun (2021), DOI 10.5334/GJGL.1401: n-insertion is gradient, with morphology, etymology, component length, segmental environment and dialect interacting. Do not make a binary rule universal or select it from spelling alone.
- Lee (2023), DOI 10.17959/sppm.2023.29.2.193, and Chung (2022), DOI 10.18855/lisoko.2022.47.4.009: the /e–ɛ/ merger is age-, gender- and position-sensitive; phonemic identity and measured vowel target are not the same thing.
- Kang & Kong (2016), DOI 10.13064/KSSS.2016.8.4.039: /o/-raising and /u, ɨ/ fronting vary across speaker cohorts; do not substitute one assumed narrow vowel target for all Seoul speakers.

The review also flags: variable /h/-deletion with residual effects on the preceding sonorant; optional/gradient aspiration merger; lenition and inter-sonorant voicing; compound tensification; coronal place assimilation; liquid assimilation and non-categorical nasal–liquid outcomes; initial denasalization; vowel nasalization/coarticulation; /ɨi/ monophthongization and glide/hiatus behavior; reduction and speech-rate effects; focus and prosodic-boundary strengthening. These require separate rule/variant/acoustic evidence rather than a single global narrow transcription rule.

### Benchmark and corpus design corrections

- Seoul Corpus contains phrasal-word/utterance boundaries and phonemic labels; it is useful for prosody-aware segmentation and phonemic G2P checks, **not** a narrow-phone gold set. OpenSLR SLR113 declares CC BY-NC 2.0, but original upstream rights and derived-label redistribution still require review.
- KsponSpeech pronunciation transcripts are not equivalent to time-aligned narrow IPA. Do not relabel orthographic or pronunciation text as acoustic IPA gold.
- Separate four acceptance dimensions: (1) categorical standard-rule correctness on NIKL cases, (2) optional-variant coverage/provenance and abstention, (3) narrow acoustic accuracy on rights-cleared, independently annotated audio with inter-annotator agreement, and (4) runtime determinism/parity. Keep exact match, CER/PER, feature-weighted distance, coverage-adjusted score, and per-rule false-addition/omission counts separate.
- For stop contrast, evaluate IP/AP/word-medial separately and retain F0/VOT/closure/voice-quality measurements with Praat method, time window, source span and speaker metadata. For vowel and liquid allophones, stratify by dialect, age, gender, style, prosodic position and relevant preceding/following segments. A broad reference cannot certify a narrow output.


## Narrow profile v9 — preconsonantal liquid detail — 2026-11-27

- Expanded the v8 coda [ɭ] candidate eligibility to include same-word preconsonantal coda ㄹ, not only pre-/h/ and word-final contexts. Crosby & Dalola (2021) found retroflex laterals 3.204 times more likely preconsonantally and 6.972 times more likely before /h/ than in their word-initial reference; their 12-speaker sample also found 99.3% intervocalic taps. These are relative effects, not universal categorical rules.
- Python and browser profile identifiers are now `clippyfirst-korean-narrow-contextual-allophones-v9`. Primary IPA remains unchanged; [ɭ] is an unselected alternative with evidence and uncertainty attached.
- The same study found coarticulatory palatalization before high-front vocoids (mean F2 about 255 Hz higher), but this is a gradient acoustic effect; no categorical [ʎ] substitution is added without a more precise validated environment/profile. This remains an evidence-gated TODO.
- Explicit pre-pausal selection remains unimplemented in the Python text-only path because orthographic punctuation/word boundaries are not reliable measurements of actual pause or prosodic boundary. A future audio/prosody input may support it; text-only output must not assume it.
- Tests added for preconsonantal `물론` → primary `mul.lon` plus unselected `muɭ.lon`; browser/Python parity required. v9 remains research-only and not target-compatible.


## Narrow profile v10 — geminate liquid coarticulation — 2026-11-27

- Added an unselected [lʲ] candidate for a geminate ㄹㄹ lateral before high-front vocoids /i,j/ (e.g. the /ll/ sequence in `빨리`). Crosby & Dalola (2021) measured mean F2 approximately 254.49 Hz higher for laterals before high-front vocoids and interpret this as coarticulatory palatalization; they also cite Kang (2017) for a palatal-lateral description before /i,j/.
- The runtime does **not** replace the primary [l] and does not emit categorical [ʎ]. [lʲ] is a project-level candidate notation for gradient coarticulation, not a phone directly labeled in the study.
- Python/browser implementations and tests are aligned; Narrow profile id/version is now `clippyfirst-korean-narrow-contextual-allophones-v10` / 10.
- Remaining liquid TODOs: independent evidence for [ʎ] versus [lʲ] in specific lexical/morphological environments; nasalized/intermediate laterals; speaker-conditioned tap/lateral probability; actual pause/prosodic-boundary detection. The current text-only path must not infer these from spaces or spelling.


## Verification ledger — code head 3f903696e64ea3f07fc9cfc280a86be2aa035030 — 2026-11-27

| Task | Status | Evidence / acceptance boundary |
|---|---|---|
| Literature inventory and phenomenon coverage matrix | DONE_VERIFIED | Undermind review returned 177 relevant papers; primary source records and DOI evidence added/linked; scope and uncertainty are explicit. Review depth is mixed: several sources were inspected at article-text level, the broad inventory includes abstract/metadata synthesis. |
| Narrow v10 deterministic variant layer | DONE_VERIFIED | Python and browser code aligned; coda [ɭ] variants and geminate [lʲ] candidate are optional/unselected; primary Broad/Narrow IPA strings unchanged by candidate generation. |
| Python regression/data integrity | DONE_VERIFIED | Verify run 45993974610: Python regression and data integrity job success. |
| Browser regression and production build | DONE_VERIFIED | Verify run 45993974610: 1,501 tests passed, 0 failed; Vite production build succeeded. |
| Source register and test-case register extraction | DONE_VERIFIED | Exhaustive test-case register extraction run 45993974642 succeeded; source-register count/rights audit is covered by Python/JS regression job. |
| Broad native-vs-g2pk diagnostic | DONE_VERIFIED (diagnostic only) | Run 45993974826, UGTPHON test split: 275 sentences / 2,702 paired tokens; native exact 52.7387%, CER 9.0130%; g2pk exact 53.0892%, CER 9.2328%. g2pk gains 0.3701 pp exact but CER worsens 0.2207 pp. This is broad/native-vs-g2pk, not Standard-vs-Narrow. |
| External UGTPHON normalization diagnostic | DONE_VERIFIED (diagnostic only) | Run 45993974603: 2,627 paired tokens; exact 51.0468% → 51.2752%, CER 9.9689% → 9.8637%; 15 rescued, 0 lost. This is normalization retrieval, not Narrow IPA accuracy. |
| Exact-head Standard vs Extended IPA A/B report | TODO / RUN_PENDING | Multi-engine workflow run 45995864350 is pending in GitHub Actions queue. No v10 A/B scores claimed yet. When available, interpret narrow exact/CER only as cross-layer agreement because the corpora are not narrow-IPA adjudicated. |
| Morphology-consensus diagnostic | TODO / RUN_PENDING | Run 45993974781 still in progress; no result claimed. |
| Independent narrow gold, rights-cleared audio, expert phonetic adjudication | BLOCKED | User cannot provide audio/expert labels; no independently adjudicated layer-matched narrow IPA gold or rights-cleared aligned audio in the current project. Acceptance requires speaker/dialect metadata, inter-annotator agreement, and separate broad/narrow labels. |
| Prosody-conditioned F0/VOT/voice-quality and gradient vowel targets | BLOCKED / EVIDENCE_LIMITED | Text-only input cannot infer acoustic measurements or phrase boundaries. Keep these as audio/context-conditioned annotations; do not hallucinate deterministic IPA symbols. |
| Ukrainian adapter changes | DEFERRED | Explicitly outside this Narrow IPA task; no adapter behavior changed. |
| CharsiuG2P and NIKL metadata inventory optional jobs | DEFERRED / SKIPPED_BY_POLICY | Workflows skipped these jobs by policy; they were not passed. |

**Verification scope:** Python/browser jobs above validate code integrity and parity, not phonetic truth. The [ɭ]/[lʲ] candidates are research-only and unselected. Standard/Broad IPA and Ukrainian adaptation remain unchanged. PR #511 is draft and stacked on PR #510; neither is merged. **Readiness: research prototype, not release-ready and not independently phonetic-certified.**


## Benchmark variant-coverage instrumentation — 2026-11-27

- Updated `scripts/benchmark_extended_ipa_ab.mjs` to emit `narrow_variant_diagnostics` separately from the layer's exact-match/CER report: eligible tokens, tokens with candidates, candidate coverage, total and mean candidate count, selected-candidate count, primary-IPA-difference count, counts by environment/evidence status, and inspectable examples.
- This is explicitly **coverage/provenance telemetry, not an accuracy metric**. It prevents new unselected candidates [ɭ]/[lʲ] from being invisible to the benchmark while avoiding false claims that more variants mean more correct IPA.
- Added `tests/benchmark_extended_ipa_ab.test.mjs` for candidate coverage, environment counts and zero selected candidates.
- Current code verification: Python regression/data integrity passed; browser suite **1,501 passed / 0 failed**; Vite build passed. Verify run 45995863825 (and duplicate PR event run 45995851384) succeeded. Test-case register extraction 45995864170, external UGTPHON diagnostic 45995863818, paired native-vs-g2pk 45995864068, morphology-consensus 45995863822 and master artifacts 45995851438 succeeded.
- Exact-head Standard-vs-Extended A/B workflow run **45995864350** remains pending with no jobs assigned as of 2026-11-27 12:07 UTC. Earlier queued A/B runs were cancelled by newer PR revisions. No v10 A/B scores are claimed. The latest code head tested is `a352dc1c64b60e245de0efe9e5cf7e50cc1e20a0`; subsequent handoff-only edits do not alter runtime code.

## Narrow v11 — benchmark-driven /h/ correction — 2026-11-27

**Code head at implementation:** `65e29f65574f4d8aaf09f9e7998f7c46831047fb`. **Profile:** `clippyfirst-korean-narrow-contextual-allophones-v11`. **Scope:** Narrow only; Broad/Standard and Ukrainian target adaptation remain unchanged.

### Error analysis and correction

- Inspected the paired Standard/Extended IPA artifact from run `45996355780` rather than treating the overall score as an opaque number. On the prior v10 output, UGTPHON Narrow was 69.5781% exact / 5.0063% CER (2,702 scored of 2,703); SIGMORPHON was 48.6974% exact / 10.7349% CER (998/999). These are cross-layer agreement diagnostics, not adjudicated Narrow accuracy.
- Mismatch analysis exposed a high-impact systematic error: same-word intervocalic onset ㅎ was emitted as [ɸ] nearly regardless of the following vowel; medial ㅎ before /i,j/ was also left voiceless [ç]. The implementation conflated word-initial and word-medial allophones.
- Corrected both Python and browser implementations: after a same-word open syllable, medial /h/ now uses [ʝ] before /i,j/, [ɣ] before /ɯ/, [β] before /o,u/, and [ɦ] before other vowels, following the page-77 contextual description in Shin, Kiaer & Cha (2012). Word-initial [ç]/[x] remains a separate branch. Post-sonorant weakening/deletion remains variable and is not collapsed to a single selected phone.
- Added source-register row `SRC-SHIN-KIAER-CHA-2012`, Python and browser positive/negative tests, and bumped the Narrow profile to v11. Broad/Standard code paths are untouched.

### Counterfactual replay (not yet CI acceptance evidence)

Replayed the v11 contextual mapping against the saved v10 paired artifact, preserving all other predictions and corpus rows. This is a deterministic counterfactual over the existing report, not a fresh run and not independent gold adjudication:

| Dataset | v10 exact (coverage-adjusted) | Simulated v11 exact (coverage-adjusted) | v10 CER | Simulated v11 CER |
|---|---:|---:|---:|---:|
| UGTPHON | 69.5523% | 71.8831% | 5.0063% | 4.6471% |
| SIGMORPHON | 48.6486% | 50.2503% | 10.7349% | 10.2207% |

The replay changes 94 scored UGTPHON tokens and 50 scored SIGMORPHON tokens. The exact-head v11 benchmark must reproduce the direction and actual metrics before this uplift is accepted. Corpus IPA conventions differ, so the result remains cross-layer agreement rather than proof of narrow phonetic truth.

### Verification and blockers

- v11 multi-engine benchmark run `46002146555` is pending/queued; no v11 CI scores claimed yet.
- v11 verification run `46002146570` is queued; Python/browser tests and build remain pending.
- Prior open Korean benchmark matrix run `45996355780` failed only when downloading K-SPAN v2.1 from Dataverse: both versioned bundle and pinned file endpoints returned HTTP 403 after retries. Earlier UGTPHON and SIGMORPHON benchmark tracks completed successfully. This is an external data-host access blocker, not an engine test failure.
- Independent layer-matched Narrow IPA gold, rights-cleared audio and qualified speaker/dialect annotation remain BLOCKED. Do not tune on the held-out test references or claim linguistic certification.
- PR #511 remains draft/open/stacked; no merge or release.

**Next acceptance:** v11 Python/browser parity and regression pass; exact-head paired A/B artifact confirms actual scores; Broad unchanged; no regressions on existing negative controls. Then continue by ranking per-rule errors and validating candidate fixes on non-test/dev evidence before changing primary outputs.

## Benchmark diagnostics and CI trigger correction — 2026-11-27

- Added `summarizeNarrowErrorPatterns` to `scripts/benchmark_extended_ipa_ab.mjs`. The report now emits top normalized Unicode-codepoint substitutions, insertions and deletions, with token-level examples, separately from exact/CER and candidate-coverage summaries.
- This is intentionally codepoint Levenshtein attribution, **not** a phonological-feature classifier. Combining marks and source-specific IPA conventions can create multiple codepoint edits; use the output to locate hypotheses for review, not as linguistic adjudication.
- Added regression coverage for recurrent lateral [l]→[ɭ], medial [ɸ]→[ɦ], and length-mark insertion patterns.
- Corrected the multi-engine workflow path filters so PR changes to `src/app/extended_ipa.js`, `scripts/benchmark_extended_ipa_ab.mjs`, and their dedicated Narrow tests trigger the paired A/B benchmark. Previously these browser-only Narrow and report changes could be missed by the PR path filter.
- The first v11 run `46002146555` was cancelled before jobs were assigned; it is superseded by exact-head run `46002598778` (pending as of 2026-11-27 12:55 UTC). Verification run `46002598827` is queued. No v11 CI scores are claimed yet.
- Current PR head: `da56c8c928cdcd40f1cddd3cf3e0c5e7c2ba8132`.

## Current verification checkpoint — Narrow v11 — 2026-11-27

**Latest code head:** `a6e9f3a8feace70566688a08ab3f14ba26095b0d`. **PR:** [#511](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/511), draft/open, stacked on #510.

- Narrow profile v11 is implemented in both Python and browser runtime. The medial /h/ mapping derives the word-medial voiced counterparts in Shin, Kiaer & Cha (2012, Table 4.6, p.77) by pairing them with the word-initial vowel contexts in that table; this is an evidence-scoped deterministic mapping, not token-level acoustic measurement. Word-initial [ç]/[x] remains distinct; post-sonorant weakening remains unresolved.
- Benchmark runner now emits top codepoint-level Levenshtein substitutions/insertions/deletions with examples. These are symbol-confusion diagnostics, not phonological-feature judgments.
- Workflow path filters now include the browser Narrow runtime and paired Narrow A/B script/tests, so changes to those paths trigger the benchmark.
- **Exact-head verification run 46003794829: Python regression/data integrity PASS; browser regression 1,503 passed / 0 failed; Vite production build PASS.** The NIKL metadata-only job was skipped by policy, not passed.
- Exact-head v11 A/B run **46003794854** is still pending with no jobs assigned. Do not promote the counterfactual preview to a measured benchmark result.
- Counterfactual replay over the saved v10 paired artifact estimates UGTPHON coverage-adjusted exact 69.5523% → 71.8831%, CER 5.0063% → 4.6471%; SIGMORPHON coverage-adjusted exact 48.6486% → 50.2503%, CER 10.7349% → 10.2207%. This is a saved-artifact simulation, not a fresh A/B run.
- The open K-SPAN matrix remains BLOCKED: Dataverse v2.1 bundle and pinned file endpoints both returned HTTP 403 after retries. Other independent UGTPHON/SIGMORPHON diagnostics completed; no K-SPAN result is claimed.
- Independent layer-matched Narrow IPA gold, rights-cleared audio and expert speaker/dialect adjudication remain BLOCKED. **Readiness remains research prototype, not release-ready or phonetic-certified.**

## Current-head verification refresh — 2026-11-27 13:13 UTC

**Current head:** `c068aa338b24fe338f1f8c2ae34c1a849bfd7161`.

- Python regression/data-integrity job `140525476954`: **success**.
- Browser test/build job `140525477259`: **success**, 1,503 tests passed, 0 failed; Vite production build completed and generated `dist/index.html` and `dist/system.html`.
- UGTPHON pinned test split job `140525477215`: **success**, pinned 275-row test split and 1,976-row train split validated.
- Paired native-vs-g2pk job `140525476998`: **success**; UGTPHON test 2,702 paired tokens: native exact 52.7387%, CER 9.0130%; g2pk exact 53.0892%, CER 9.2328%. Diagnostic only, not Narrow score.
- Morphology-consensus job `140525476956`: **success**; strict exact 52.7387%, CER 9.0130%; consensus coverage 100%, exact 52.7192%, CER 9.0296%. One unique unresolved word resolved, three unique words changed; paired exact delta 0.0000, CER delta +0.000173 (worse). Keep consensus diagnostic-only; do not promote it into production.
- Test-case register extraction job `140525482452`: **success**.
- External UGTPHON Narrow A/B workflow `46004893594`: still pending with no job assigned as of 13:13 UTC. No v11 Narrow A/B result is available yet.
- K-SPAN v2.1 Dataverse 403 blocker and absence of layer-matched independently adjudicated Narrow IPA/audio gold remain unchanged.

The earlier verification attempt `46003159398` failed on stale test expectations and test-loader errors; the current-head verification supersedes it and is green. The source-register test now reflects 252 actual rows. Do not count the skipped official NIKL metadata inventory or Charsiu train-dev review as passes.

## Current benchmark/verification refresh — 2026-11-27 18:55 UTC

**Runtime + benchmark code head:** `9c03fd3b37834f5b347b4ff9f4ec4403548b32fd`. **Workflow path-filter follow-up:** `a5b0834ce709f9a8545c1bed9333dbea7387ca59`. PR #511 remains draft/open.

- Exact-head verification run `46052641603`: Python regression/data integrity **PASS**; browser **1,505 passed / 0 failed**; Vite production build **PASS**; generated `dist/index.html` and `dist/system.html` checked. Official NIKL metadata-only job skipped by policy.
- UGTPHON test split run `46052641446`: **PASS**, 275 test rows and 1,976 train rows validated.
- Native-vs-g2pk paired diagnostic `46052641464`: **PASS**, 2,702 paired tokens. Native exact 52.7387%, CER 9.0130%; g2pk exact 53.0892%, CER 9.2328%. Exact +0.3701 pp for g2pk, but CER worsens +0.2207 pp. This is broad/native diagnostic, not Narrow accuracy.
- Morphology-consensus diagnostic `46052641488`: **PASS**, strict and analyzer consensus coverage-adjusted exact both 52.7192%; strict CER 9.0130%, consensus CER 9.0303% on paired rows (delta +0.0173 pp, worse). One unresolved word resolved, three changed; zero exact wins, two higher-edit-distance outcomes. Keep diagnostic-only; do not promote.
- Test-case register extraction `46052641452`: **PASS**.
- The paired v11 Narrow A/B workflow `46052642003` was cancelled when a new branch revision arrived before jobs were assigned; it produced no score. The replacement exact-head run `46052932943` is pending, with no job assigned yet. No v11 score uplift is claimed.
- A/B workflow filter review found that Narrow runtime/report/test paths had been added to the push filter but were missing from the pull-request filter. Added them to the PR filter and deduplicated the push list. Latest workflow-only head is `a5b0834ce709f9a8545c1bed9333dbea7387ca59`; new verification run `46052926139` is in progress and replacement benchmark `46052932943` is pending.
- Prior head `fa43efed0fd7e822d2616fc3b5cd189f55fd3a28` failed verification due to an unmatched brace/syntax error in the browser Narrow /h/ branch and a brittle source-register row-count constant. The browser branch was rebuilt to match the Python context logic; the row-count test now derives the count from the canonical CSV rather than hard-coding it. Do not cite the failed run `46007932275` as an engine failure or successful verification.
- K-SPAN v2.1 Dataverse HTTP 403 and absence of independent layer-matched Narrow IPA gold/audio/expert speaker annotation remain BLOCKED. Research-prototype status unchanged.

## V10 artifact error review and candidate-oracle diagnostic — 2026-11-27 19:00 UTC

Inspected the saved v10 A/B JSON artifact `standard-vs-extended-ipa-ab-45996355780` directly (2,703 UGTPHON occurrences; 999 SIGMORPHON occurrences). A Unicode-codepoint Levenshtein replay over the scored records surfaced the following largest symbol mismatches:

- **UGTPHON:** `l → ɭ` 543 edits; `h → ɦ` 96; `ɸ → ɦ` 71; `s → ɕ` 62; then `l → ʎ` 33, `ʰ → x` 24, `ʰ → ç` 21, `ç → ʝ` 19.
- **SIGMORPHON:** `l → ɭ` 189; length-mark insertion `∅ → ː` 131; `l → ʎ` 53; `n → ɲ` 41; `h → ɦ` 33; `ʌ → ː` 39 and `∅ → ɘ` 39; `ɸ → ɦ` 31.

These are cross-layer string mismatches, **not** adjudicated phonetic errors. They show the biggest areas for investigation: coda lateral realization/IPA convention, word-medial /h/ voicing, vowel length/transcription conventions, and high-front lateral/nasal symbols. Do not select [ɭ], lengthen vowels, or alter /n,s/ based only on these held-out labels.

V10 candidate diagnostics already had unselected [ɭ]/[lʲ] candidates on 901/2,703 UGTPHON tokens (33.33%; 1,073 candidates) and 332/999 SIGMORPHON tokens (33.23%; 390 candidates); zero candidates were selected. The high `l → ɭ` counts therefore motivate measuring candidate coverage rather than automatically promoting a speaker-/dialect-conditioned variant.

Added `candidate_oracle_*` fields to the Narrow variant diagnostic. It counts how many scored tokens have an unselected candidate that exactly matches one corpus IPA variant, and reports the rescue count by environment. This is an **offline oracle upper bound only**, not accuracy or a runtime selection mechanism. A regression fixture verifies the oracle stays diagnostic-only. The current active multi-engine job predates this report extension; exact-head A/B run `46053424508` is queued to include it after the prior long benchmark finishes.

Also aligned word-initial ㅎ rounded-vowel mapping with Shin, Kiaer & Cha (2012), Table 4.6: [ɸʷ] before /o,u/ (e.g. 후, 호), [x] before /ɯ/, [ç] before /i,j/, and [h] elsewhere; word-medial voiced counterparts remain separately mapped. These initial/medial branches have positive and negative Python/browser regression tests.

## Candidate-oracle implementation verification and queued A/B correction — 2026-11-27 19:01 UTC

- The new candidate-oracle diagnostic and regression test are present on code head `4acbec41a527f119eff9c9d19bd851504b0f52a2`.
- Verification run `46053432498`: Python regression/data integrity **PASS**; browser **1,505 passed / 0 failed**; Vite production build **PASS**; `dist/index.html` and `dist/system.html` verified. NIKL metadata-only job skipped by policy.
- The earlier replacement benchmark `46053424508` was cancelled before job assignment as a newer revision arrived. The currently active long multi-engine comparison `46052610441` runs the v11 runtime but predates the candidate-oracle report extension. Exact-head benchmark `46053548883` is pending and will include the candidate-oracle report once the active run releases the workflow concurrency slot.
- Do not infer an A/B uplift from the v10 error replay or candidate-oracle metric. Wait for a completed paired v11 A/B artifact and inspect both datasets and per-symbol errors.

## Version label correction and measured Narrow v12 benchmark — 2026-11-27 19:05 UTC

Correction to earlier handoff/PR wording: the runtime code exercised by paired A/B run `46052610441` is **Narrow profile v12**, not v11. The Python registry and browser result both declare `clippyfirst-korean-narrow-contextual-allophones-v12`, `profile_version: 12`. Earlier messages called it v11 because the /h/ correction was first discussed under that working label; use the repository's actual v12 registry as canonical.

Measured v12 paired result (same frozen rows as v10):
- UGTPHON: 2,702 scored; Standard/Broad exact 52.7387%; Extended Narrow exact 72.2058%; Narrow CER 4.5519%. Relative to v10 Narrow exact 69.5781%: **+2.6277 pp**; CER 5.0063% → 4.5519% (**−0.4544 pp**).
- SIGMORPHON: 998 scored; Standard/Broad exact 35.8717%; Extended Narrow exact 51.3026%; Narrow CER 9.9824%. Relative to v10 Narrow exact 48.6974%: **+2.6052 pp**; CER 10.7349% → 9.9824% (**−0.7525 pp**).
- Paired exact outcomes: UGTPHON 71 improved / 0 regressed; SIGMORPHON 26 improved / 0 regressed. Per-token edit distance improved on 96 and 51 tokens respectively; no edit-distance regressions.
- Standard/Broad vs Extended/Broad had zero prediction/status differences by contract. These metrics remain cross-layer corpus agreement, not independently adjudicated narrow phonetic accuracy.

The paired A/B step and artifact upload succeeded in run `46052610441`; the overall long multi-engine workflow was still completing SIGMORPHON/open-matrix tracks at last check. Exact-head candidate-oracle A/B run `46053826131` is pending; it includes the new candidate-oracle diagnostic. Do not claim its output until it completes.

## Narrow v13 candidate expansion and current-head verification — 2026-11-27 19:22 UTC

**Current PR head:** `58fd71223ed311d50a49f7d18fd352c20339ca4c`. **Runtime profile:** `clippyfirst-korean-narrow-contextual-allophones-v13` in both Python and browser. PR #511 remains draft/open.

- v13 adds only **unselected** same-word coda ㄴ candidates [ɲ] and [nj] before ㅈ/ㅉ/ㅊ, grounded as a secondary-description hypothesis from Lee (1996) as summarized by Kim (2011, p.23). The primary IPA string is unchanged; no coda-nasal candidate is selected at runtime. This remains evidence-limited because the cited passage is secondary and does not directly measure the exact coda-before-affricate environment.
- The Python regression initially exposed a test typo: implementation and source describe [ɲ]/[nj], while one assertion attempted to retrieve [nʲ]. The test now checks the actually emitted [nj] candidate; runtime behavior was not weakened or changed.
- A CSV integrity check found an unquoted comma-separated clause in the UCL thesis source-register row (14 fields instead of 12). The row was re-quoted; Python's source-register integrity test now passes.
- Browser regression/build verification run `46055990603`: **1,506 passed, 0 failed**; Vite 8.3.1 production build **PASS**; generated `dist/index.html` and `dist/system.html` verified. Python regression/data-integrity job **PASS**. Official NIKL metadata-only job was skipped by policy, not passed.
- UGTPHON split validation run `46055990649`: **PASS** (275 test rows, 1,976 train rows). Test-case register extraction run `46055990698`: **PASS**.
- Native-vs-g2pk diagnostic run `46055990615`: 2,702 paired UGTPHON tokens; native exact 52.7387%, CER 9.0130%; g2pk exact 53.0892%, CER 9.2328%. This is the broad/native comparison, not a Narrow score.
- Morphology-consensus diagnostic run `46055990654`: coverage-adjusted exact unchanged at 52.7192%; CER worsened from 9.0130% to 9.0303%; one unique word resolved, three changed, zero exact wins and two higher-edit-distance outcomes. Keep analyzer consensus diagnostic-only.
- Exact v13 paired multi-engine/A-B workflow `46055641802` is active at the multi-engine comparison stage (UGTPHON/SIGMORPHON engine portfolio, then paired Standard-vs-Extended IPA, then open matrix and aggregate report). It runs Narrow v13 code at head `61bfaee9443b4639ceceb525354f1f8087ea50b8`; later commits up to `58fd712` changed only the CSV quoting and tests, not runtime or benchmark logic. **No v13 A/B scores are available yet.** Candidate-oracle metrics, when produced, are an offline upper bound against corpus labels, not accuracy and not a runtime selection mechanism.
- The earlier v12 paired result remains the latest measured primary Narrow result until v13 A/B completes: UGTPHON 72.2058% exact / 4.5519% CER (2,702 scored); SIGMORPHON 51.3026% exact / 9.9824% CER (998 scored). v13's candidate-only change should not alter those primary scores.
- K-SPAN v2.1 Dataverse 403 access blocker and lack of independent layer-matched Narrow IPA/audio gold and expert speaker/dialect adjudication remain BLOCKED. Status remains research prototype; not release-ready or phonetic-certified.

## v13 paired benchmark completed; v14 release-variation candidate — 2026-11-27

### v13 exact-head paired A/B evidence

Run `46055641802` completed the paired Standard-vs-Extended IPA report and uploaded artifact `standard-vs-extended-ipa-ab-46055641802` (artifact ID `15226349068`). The overall workflow concluded **failure** only at the later open Korean benchmark matrix (K-SPAN Dataverse HTTP 403); do not label the entire workflow successful.

| Dataset | Standard/Broad exact | Extended Narrow exact | Narrow CER | Coverage |
|---|---:|---:|---:|---:|
| UGTPHON | 52.7387% | 72.2058% | 4.5519% | 2,702 / 2,703 |
| SIGMORPHON | 35.8717% | 51.3026% | 9.9824% | 998 / 999 |

Extended Broad equals Standard by design and was asserted. Extended Narrow is still **cross-layer agreement**, not measured narrow-IPA accuracy: neither corpus supplies independent layer-matched narrow gold.

Unselected candidate diagnostics:
- UGTPHON: 996/2,703 tokens (36.85%) with candidates; 1,309 candidates; candidate-oracle exact 84.715% versus primary 72.2058%, 338 tokens rescued.
- SIGMORPHON: 362/999 (36.24%) with candidates; 476 candidates; candidate-oracle exact 63.0261% versus primary 51.3026%, 117 rescued.
- Zero candidates were selected. The oracle is only an offline upper bound against corpus IPA labels, not accuracy and not a runtime selection policy.
- UGTPHON oracle rescues were coda ㄹ before same-word consonants (130) and word-final coda ㄹ (208). SIGMORPHON rescues were coda ㄹ before consonants (45), word-final coda ㄹ (47), and coda ㄴ before alveopalatal affricates (25). The latter candidate had no UGTPHON oracle rescues, reinforcing corpus/convention dependence.
- Top normalized codepoint mismatches included `l → ɭ` (543 UGTPHON; 189 SIGMORPHON), `h → ɦ` (96; 33), `s → ɕ` (62; 12), and SIGMORPHON `n → ɲ` (41). These are edit diagnostics, not phonological-feature adjudications. The source-backed coda [ɭ] alternatives remain unselected because speaker/dialect/style are unknown.

### v13 workflow acceptance and blocker

- Multi-engine comparison, per-fragment mismatch ledger, Browser Kozak Kim UGTPHON, paired Standard-vs-Extended IPA report, mode availability, native/browser parity, SIGMORPHON engine portfolio, SIGMORPHON Browser three-mode benchmark and regression suite: **PASS**.
- Open matrix step `Run open Korean benchmark matrix (Seoul, K-SPAN, IPA-Dict)` failed before processing the matrix because Dataverse returned HTTP 403 for K-SPAN metadata after retries. Seoul/K-SPAN/IPA-Dict scores were therefore not produced; aggregate summary was skipped. Artifact upload of the already-completed A/B report succeeded.
- No external engine was promoted into runtime; comparisons remain diagnostics.

### Narrow v14 implementation — optional coda release alternatives

- v13 mismatch attribution showed recurring deletion of the unreleased diacritic `̚`, but inspected examples were mainly preconsonantal. We deliberately did **not** generalize release alternatives to those contexts.
- v14 adds optional, unselected released [p,t,k] alternatives only for word-final codas whose primary broad-derived output is [p̚,t̚,k̚]. This preserves the existing primary output and does not claim every token is released.
- Evidence: Lee (1993, p.31) illustrates unreleased coda stops; Kim & Jongman (1996) found a brief burst after 83% of word-final stops in a four-speaker sample; Cha (2026) reports task/place-dependent production traces but no burst frequency. Thus the candidate is deliberately limited and never selected from spelling alone.
- The source register now includes Kim & Jongman (1996) and Cha (2026), and tests cover ㄱ/ㄲ/ㅋ, ㄷ/ㅅ and ㅂ codas plus complex ㄺ/ㅄ codas, with a nonfinal negative control.
- Current runtime profile is `clippyfirst-korean-narrow-contextual-allophones-v14`. Current code head when this note was prepared: `53ae4a48a2893f944e320bb08a1d3e625cfb1ca6`. v14 verification run `46058419570` completed: Python regression/data integrity **PASS**, browser suite **1,507/1,507 PASS**, source redistribution-rights gate **PASS**, production build and generated-page verification **PASS**. Source register has 255 structurally valid rows. Exact v14 paired multi-engine/A-B run `46058419641` remains pending; no v14 score is claimed yet.


## Benchmark-led interaction correction — 2026-11-27

**Scope:** exact, evidence-backed Korean phonological interaction discovered in the v14 UGTPHON/SIGMORPHON mismatch review. This is a core surface-phonology correction; it does not select any speaker-conditioned Narrow variant.

- The paired mismatch ledger contains the token 물고기 with the current output lacking both the corpus-labelled coda-lateral detail and the fortis onset: the reference form includes [ɭ] and [k͈]. The codepoint edits are diagnostic, not a declaration that the corpus label is Narrow IPA gold.
- NIKL Online Q&A qna_seq=335858 (answer 2026-09-16) explicitly explains 물고기[물꼬기] as a §28 compound-fortition case. Added only the exact 물>고 license to Python R014 and browser NIKL_28_COMPOUND_FORTITION_FORMS; no productive ㄹ+ㄱ rule was added.
- Added cross-engine interaction regressions: §28 changes 물고기 to 물꼬기 / mul.k͈o.ɡi; the separate [ɭ] coda remains an unselected speaker-conditioned Narrow candidate (muɭ.k͈o.ɡi). The lookalike/verb-form control 물고 remains untensed.
- Registered the exact NIKL Q&A in data/korean/sources.csv and research/SOURCE-REGISTER.csv. It is citation-only; item-level KOGL marking is not verified and no source text/data was copied.
- **Verification status at commit creation:** tests and paired A/B are queued for exact-head GitHub Actions. No benchmark uplift is claimed until the same pinned UGTPHON/SIGMORPHON occurrences complete and the artifact is inspected. The independent Narrow-gold limitation remains unchanged.

**Acceptance:** Python/browser rule parity; positive and negative exact-form controls; Narrow candidate remains unselected; source-register integrity; full Python/browser/build checks; same-split paired A/B with per-occurrence changes and no regressions outside the licensed context.


## Narrow v15: position-conditioned ㅟ and /swi/ interaction — 2026-11-27

- The exact-head v14 mismatch ledger shows repeated `ㅟ` disagreements (`y` vs `ɥi`) across UGTPHON and SIGMORPHON, including 귀엽냐, 분위기, 뒤로, 취조, 위도, and 따위. The compound example 아쉽네유 also changes both the onset sibilant and the ㅟ nucleus: corpus label [ɕʰɥi] vs primary [sʰy]. These are diagnostic corpus labels, not adjudicated Narrow gold.
- Kim-Renaud (2022), *The Cambridge Handbook of Korean Linguistics*, chapter 2, describes position-conditioned [wi]/[ɥi] realizations for ㅟ and iterative palatalization in /swi/ before /i/. Added source S045 / SRC-KIM-RENAUD-2022-ROUNDED-GLIDE-INTERACTION as citation-only; no chapter text or data copied.
- Python and browser Narrow v15 now retain [y] as the primary output and expose only unselected variants: [wi] for word-initial onsetless ㅟ, [ɥi] for non-initial/postconsonantal ㅟ, and a combined [ɕʰɥi] candidate for onset ㅅ+ㅟ. The [ʰ] portion is inherited from the existing partial profile; the new source supports the palatalization/glide interaction, not aspiration.
- Browser variant replacement now supports multi-code-point edits, so the combined `sʰy` → `ɕʰɥi` candidate is represented as one inspectable interaction rather than two unrelated single-character edits. Python and browser regressions cover 위, 귀 and 쉽다.
- Narrow primary IPA is unchanged by these candidate-only additions. Therefore no primary Exact/CER uplift is claimed; the next pinned A/B artifact must report candidate diagnostics separately from selected-output accuracy.
- First exact-head verification surfaced two test-only defects: the browser negative control assumed an unsupported input would return `surfaceHangul`, and the Python source assertion was case-sensitive. The browser control now checks that 물고 remains untensed in IPA/trace; the source assertion normalizes case. Rerun is pending on the updated head.

**Acceptance:** profile v15 identity matches in Python/browser; identical primary Narrow strings; identical candidate IPA/evidence/source spans; all candidates remain unselected; positive/negative compound fortition interaction; source-register count and rights gate; full Python/browser/build checks; same-split benchmark with candidate-only diagnostics.


## Narrow v16: lateral interaction and exact Rule 26 licenses — 2026-11-27

- Benchmark occurrence review shows a recurring interaction in forms such as `올린`, `달린`, and `관리자`: the reference can encode coda retroflexion and a palatal lateral in the following geminate sequence. Existing independent candidates were not enough for the candidate oracle to represent the combined form.
- Narrow v16 retains the primary lateral output and adds an optional cited [ʎ] candidate for geminate /l/ before /i,j/, plus a combined `[ɭ.ʎ]` candidate when same-word coda ㄹ + onset ㄹ precedes /i,j/. The combined form is explicitly `source-scoped-interaction-hypothesis-only`: Crosby & Dalola (2021) and Crosby (2024) describe the component tendencies, but do not directly adjudicate this exact combined sequence. It is not selected.
- The source-backed Rule 26 exact-form map now includes `솔직 → 솔찍` (NIKL Q&A 327592, which infers the bare form from `솔직하다[솔찍하다]`) and `일제 → 일쩨` (NIKL Basic Dictionary entry ParaWordNo=72394). Both are exact lexical licenses only; no productive ㄹ+ㅈ generalization was introduced.
- Added source IDs S046/S047 and registry records SRC-NIKL-QNA-327592 / SRC-NIKL-KRDICT-72394. Rights remain citation-only; no source text or data copied and item-level KOGL markings remain unverified.
- Profile identity is now `clippyfirst-korean-narrow-contextual-allophones-v16` in Python and browser. Existing [y], [wi]/[ɥi], [ɕʰɥi], [lʲ], [ɭ], and [ʎ] alternatives remain unselected; no speaker/audio adjudication is implied.
- The exact A/B run for v15 is still queued behind the previous open-corpus matrix run. v16 system verification and A/B are pending; no v16 benchmark uplift is claimed.

**Acceptance:** Python/browser profile identity v16; parity for primary and candidate variants including combined source spans; exact R012 forms and negative control; 259-row source-register/rights gate; Python regression, browser regression, production build, generated pages; same-split A/B with candidate-oracle reported separately from selected-output accuracy.



## Cross-dataset and morphology findings — verified snapshot 2026-11-28

**Important version boundary:** the six-track multi-engine aggregate below was produced by run `46073769132` at code SHA `743b61243149b866359dd6598d4e347c3d03488c`, before Narrow v15/v16. It is an engine-family baseline, not a v16 benchmark.

| Dataset / reference layer | Native exact | g2pk exact | Native CER | g2pk CER |
|---|---:|---:|---:|---:|
| UGTPHON, noisy user-generated | 52.74% | 53.11% | 9.01% | 9.23% |
| SIGMORPHON 2021, lexical | 35.97% | 35.34% | 14.51% | 14.82% |
| Seoul Corpus, phonemic | 14.80% | 15.70% | 39.84% | 39.58% |
| K-SPAN Modern, surface phonetic | 10.87% | 10.90% | 27.78% | 27.73% |
| K-SPAN Conservative, surface phonetic | 7.55% | 7.50% | 27.45% | 27.49% |
| IPA-Dict residual lexical | 41.27% | 41.10% | 9.93% | 10.04% |

The native engine is close to g2pk on the two lexical/noisy tracks: on UGTPHON it has slightly lower CER but slightly lower exact match; on SIGMORPHON it is slightly ahead on both. These deltas are small and require paired confidence intervals before calling one engine superior. The low Seoul/K-SPAN exact scores are cross-layer comparisons, not evidence of poor Narrow IPA: Seoul is phonemic; K-SPAN is surface-phonetic and its annotation conventions differ substantially from the engine's broad output.

K-SPAN integrity audit: 22,843 rows differ between the independent key field and WorldBet field (Modern 13,078; Conservative 9,765). Scoring uses the source-designated ModernPhon/ConservativePhon WorldBet fields; key fields are retained only as a warning/cross-check and never override source labels. This integrity warning must accompany any use of K-SPAN scores.

### Morphology ablation (same UGTPHON occurrences)

Kiwi + MeCab-Ko consensus changed only 3 unique words among 1,907 and did not improve exact match; CER worsened by 0.000173 on the paired subset. Soft mode also yielded no exact uplift. Therefore analyzer consensus remains diagnostic-only. Do not enable analyzer-driven rules globally; a morphology adapter must require shared analyzer boundaries, formal POS evidence, exact licensed forms, and per-rule positive/negative tests. The tiny sample of changes is insufficient to support broad productive morphology claims.

### Narrow A/B baseline (same earlier code snapshot, no independent Narrow gold)

| Dataset | Standard / Extended Broad exact | Extended Narrow exact | Narrow CER | Candidate-oracle exact |
|---|---:|---:|---:|---:|
| UGTPHON (2,702 scored) | 52.74% | 72.21% | 4.55% | 84.72% |
| SIGMORPHON (998 scored) | 35.87% | 51.30% | 9.96% | 63.13% |

Standard and Extended Broad are identical by contract (zero paired prediction differences). The Narrow column is cross-layer agreement against corpus IPA labels, not validated Narrow accuracy. Candidate-oracle is an offline upper bound using unselected candidates and corpus labels that are not layer-matched Narrow gold; it is neither an engine prediction nor a target to optimize blindly. Selected optional variants remained zero. Earlier candidate coverage was 1,094/2,703 UGTPHON and 451/999 SIGMORPHON tokens.

### Error-pattern implications and priorities

- The earlier mismatch attribution repeatedly found `l→ɭ`, then `h→ɦ`, `s→ɕ`, `y→i`, `l→ʎ`; SIGMORPHON also showed many length/quality differences (`ʌ→ː`, `ø→e`, insertions of `ː` and `ɘ`). These are transcription-style/cross-layer signals as well as possible phonetic differences; they must not be blindly converted into deterministic rules.
- Geminate lateral interactions are now represented in v16 by optional [ʎ] and composed [ɭ.ʎ] candidates, but their exact-head A/B has not completed. No uplift is claimed.
- The next high-value work is an error ledger stratified by process and reference layer: (1) lexical Rule 26/28 and exact morphology; (2) ㅟ glide/sibilant interactions; (3) coda lateral and geminate-lateral interactions; (4) nasal palatalization before affricates; (5) /h/ allophony and labialization; (6) vowel quality/length. For each, report primary-output change, candidate-only oracle rescue, paired CER/exact deltas, confidence intervals, and negative controls separately.
- Do not optimize length, stress, [β]/[ɸ]/[ʝ], or other corpus-specific narrow symbols until an independent, layer-matched reference or acoustic/speaker metadata establishes their target scope. Keep source-backed alternatives unselected where speaker/dialect/style are unknown.

### Exact-head v16 verification status

- Head `371c6225d4b1ab71c4db5c42dc4ce0395bf61ef0`: Python regression/data integrity **PASS**; browser regression/build **PASS**; source-register/rights tests are included in Python PASS. NIKL metadata-only inventory **SKIPPED by policy**, not passed.
- The one initial Python failure was an assertion wording mismatch (test expected “unrelated homographs”; source record said “unrelated readings”); corrected in commit `371c6225d4b1ab71c4db5c42dc4ce0395bf61ef0`, then full Python/browser verification passed.
- Exact-head v16 A/B run `46076643385` is queued behind multi-engine run `46076417414`. The latter has completed external fetches and is currently at the multi-engine comparison step; no exact-head v16 Narrow uplift is available yet.
- CharsiuG2P and ByT5 inference were skipped by workflow conditions. No neural inference results exist and they must not be reported as passing.



## Narrow v17: liquid-assimilation × geminate-palatalization interaction — 2026-11-28

- The SIGMORPHON mismatch ledger contains `관리자` with reference `[kwa̠ʎʎid͡ʑa̠]` versus primary `kwal.li.dʑa`. This is not a single isolated /l/ allophone: NIKL R006 (§§19–20) first maps coda ㄴ + onset ㄹ to a geminate lateral; the second lateral then precedes high-front /i/.
- v16's geminate candidate logic was limited to an orthographic preceding coda ㄹ and did not explicitly model the interaction for an /n+l/ sequence after R006. v17 adds an optional `[ʎ.ʎ]` candidate for the resulting same-word geminate before /i,j/. It composes the normative R006 surface step with the source-described palatal-lateral tendency. No source directly establishes categorical [ʎʎ] for every geminate or speaker, so this is explicitly `source-scoped-geminate-palatalization-interaction-hypothesis-only`, never selected.
- The candidate preserves both syllables and their combined source span in the browser output. Python and browser tests assert primary output remains `kwal.li.dʑa`, candidate is `kwaʎ.ʎi.dʑa`, evidence provenance includes NIKL R006 and Crosby & Dalola (2021), and `selected=false`.
- Narrow profile identity is now `clippyfirst-korean-narrow-contextual-allophones-v17` in Python and browser. No Broad/Standard output or default Ukrainian target behavior changes.
- Exact-head verification run `46078277421` for head `1fb6aefd3d9e7af92c210ac027591aeee71405ce`: Python regression/data integrity **PASS**; browser regression **PASS**; source redistribution-rights gate **PASS**; production build **PASS**; generated-page verification **PASS**. Official NIKL metadata-only inventory **SKIPPED by policy** (not passed). The v17-specific positive interaction tests pass.
- Earlier intermediate v17 attempts caught and corrected two implementation/test defects before the passing head: the Python coda replacement initially overwrote the preceding syllable's onset+nucleus; the browser candidate initially used only the current syllable's source span. The final implementation preserves the preceding syllable's onset+nucleus and unions both syllable spans. A further test caught missing explicit NIKL URL provenance in the Python candidate; that reference is now attached.
- The earlier exact-head v17 multi-engine run was delayed behind older jobs; it was superseded by the completed final-head run 46081938091 on 9ea66677e1a70ddf87d7dbcc43a770e1e18d0622. See the 2026-11-28 final verification record below.

**Acceptance:** Python/browser profile identity v17; same primary Broad/Narrow strings as before; [ʎ.ʎ] candidate only for same-word R006 liquid-assimilated geminate before /i,j/; combined source span; NIKL and acoustic-literature provenance; no default selection; Python/browser/build/generated-page/rights gates; exact-head paired A/B and candidate-oracle separately reported.


## Narrow v17 exact-head benchmark result and supplemental CI blocker handling — 2026-11-28

### Paired A/B result (run 46078477552; artifact 15237510607; head eac0cca48dad06ee0971d6c7972c7be2670bb1fd)

| Dataset | Standard / Extended Broad exact | Extended Narrow exact | Narrow CER | Candidate-oracle exact | Candidate rescues |
|---|---:|---:|---:|---:|---:|
| UGTPHON (2,702 scored) | 52.7387% | 72.2058% | 4.5519% | 86.7135% | 392 |
| SIGMORPHON (998 scored) | 35.8717% | 51.3026% | 9.8821% | 66.3327% | 150 |

- Primary Narrow metrics are unchanged from v16: this v17 change adds only an unselected candidate for the R006 liquid-assimilation × geminate-palatalization interaction. No primary-score uplift is claimed.
- Compared with the v16 artifact (run 46076417414), v17 increases candidate count by 33 on UGTPHON (1,532→1,565) and 22 on SIGMORPHON (665→687). The candidate oracle is unchanged on UGTPHON (86.7135%, 392 rescues) and improves on SIGMORPHON from 64.3287% / 130 rescues to 66.3327% / 150 rescues (+20 corpus-label rescues). This is an offline candidate-coverage diagnostic, not accuracy and not a runtime selection rule.
- Standard and Extended Broad remain identical by contract. Candidate selection remains zero. These exact rates are corpus-label agreement only; neither corpus is independently adjudicated narrow-IPA gold.

### Why the v17 workflow showed failure, and correction

- Run 46078477552 completed all preceding steps successfully: engine comparison, mismatch ledger, Browser UGTPHON, paired Standard/Extended A/B, mode-availability checks, Native/Browser parity, SIGMORPHON engine portfolio, Browser three-mode suite (33/33 tests). The only failed step was the supplemental open Korean matrix, before corpus processing, because Dataverse returned HTTP 403 for its K-SPAN metadata landing page after three attempts. Consequently Seoul/K-SPAN/IPA-Dict scores were not produced; no result should be inferred for those tracks.
- The 403 is an external host-access restriction, not a code/test or IPA-engine failure. The previous script treated this optional supplemental matrix outage as fatal to the entire workflow despite the already-uploaded core A/B artifact.
- Follow-up commits b63967aec77d70a4efefcdd83b58b1fa50381334, b29d0269be58d4e18f223f1ebdf351fa31f93b29, c690b308830ab9ebb7957e02b0b565de2e8b7b8a, and 874f3353c944cc91197673a28113b0fde2066ceb classify public-source HTTP 403/429/5xx as ExternalSourceUnavailable, write an explicit open-korean-benchmark-status.json with BLOCKED_EXTERNAL_SOURCE, and allow the core workflow to complete without fabricating supplemental scores. The workflow prints and uploads the blocker status; it does not call the optional matrix passed.
- A focused regression test covers HTTP 403 classification and confirms no destination file is written. Exact-head CI for the final correction is pending; do not mark the correction DONE_VERIFIED until the new workflow run and Python test pass.

**Current classification:** v17 implementation and paired A/B evidence = DONE_VERIFIED for the candidate-only behavior; optional Seoul/K-SPAN/IPA-Dict matrix = BLOCKED_EXTERNAL_SOURCE (no scores); final blocker-handling patch = PARTIAL pending exact-head CI. Project remains a research prototype, not Narrow-IPA-certified or release-ready.



## Final-head verification after supplemental-source failure repair — 2026-11-28

**Final branch HEAD:** `9ea66677e1a70ddf87d7dbcc43a770e1e18d0622`  
**PR:** #511, still draft/open, stacked on #510. No merge or release performed.

### Exact-head CI: PASS

- [Multi-engine Korean IPA diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/46081938091): **SUCCESS**. Every step passed, including paired Standard/Extended A/B, Native/Browser parity, SIGMORPHON, Browser three-mode regression, the open Korean benchmark matrix (Seoul, K-SPAN, IPA-Dict), aggregate summary generation and artifact upload.
- [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/46081938068): **SUCCESS**. Python regression/data integrity and Browser regression/build passed. Official NIKL metadata-only inventory was **SKIPPED by policy**, not passed.
- [Exhaustive test-case register extraction](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/46081938034): **SUCCESS**.
- [Master table and research corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/46081930726): **SUCCESS**.
- Native-vs-g2pk diagnostic, morphology-consensus diagnostic, research morphology adapter smoke and external UGTPHON diagnostic: **SUCCESS**.
- Optional neural inference and Charsiu rule-review jobs: **SKIPPED** by workflow conditions; no neural results are claimed.

The earlier Dataverse HTTP 403 was transient/source-host access failure. The repaired workflow's final-head rerun subsequently fetched and validated the supplemental sources and completed all matrix and aggregate steps. Thus Seoul/K-SPAN/IPA-Dict are no longer blocked for this run. The fallback remains important: if a public host again returns HTTP 403/429/5xx, it is explicitly recorded as `BLOCKED_EXTERNAL_SOURCE` and must not be misreported as a successful score.

### Paired Standard / Extended IPA A/B (artifact 15238494535)

| Dataset | Standard / Extended Broad exact | Extended Narrow exact | Narrow CER | Candidate-oracle exact | Candidate rescues |
|---|---:|---:|---:|---:|---:|
| UGTPHON (2,702 scored) | 52.7387% | 72.2058% | 4.5519% | 86.7135% | 392 |
| SIGMORPHON (998 scored) | 35.8717% | 51.3026% | 9.8821% | 66.3327% | 150 |

- v17's primary Narrow values are unchanged from v16: the new [ʎ.ʎ] candidate is optional and unselected. No primary exact/CER uplift is claimed.
- Candidate count increases by 33 on UGTPHON (1,532→1,565) and 22 on SIGMORPHON (665→687). SIGMORPHON candidate-oracle rescues increase 130→150. This oracle is corpus-label candidate coverage only, not accuracy, a runtime prediction, or independent narrow-IPA gold.
- Standard and Extended Broad are identical by contract; zero optional candidates are selected at runtime.

### Supplemental multi-engine tracks (artifact 15240140302)

Ten pinned engines were compared on the supplemental samples. The table below reports ClippyFirst native strict output; corpus conventions and scopes differ, so these are not directly comparable as a single leaderboard.

| Track | Scored | Native exact | Native CER | Coverage |
|---|---:|---:|---:|---:|
| Seoul Corpus phonemic sample | 1,000 | 14.80% | 39.84% | 96.60% |
| K-SPAN Modern | 1,000 | 10.87% | 27.78% | 99.40% |
| K-SPAN Conservative | 1,000 | 7.55% | 27.45% | 99.30% |
| IPA-Dict Korean residual sample | 1,000 | 41.27% | 9.93% | 99.60% |

Interpretation limits:
- Seoul labels are phonemic and word-aligned, not narrow phonetic gold; its low exact score cannot be read as a narrow-acoustic accuracy result.
- K-SPAN Modern and Conservative are separate reference tracks from one lexical surface-phonetic database, not independent datasets. The source-field-to-IPA conversion is the scoring input. An independent key/WorldBet cross-check produced **WARN: 22,843 mismatches** (13,078 Modern; 9,765 Conservative), mainly symbol differences such as `e→E`, `we→wE`, and `y→wi`. This warning is preserved; key fields do not override the documented source reference fields. The mapping and mismatch list require further audit before treating K-SPAN as clean gold.
- IPA-Dict is Wiktionary-derived and not independent of SIGMORPHON; orthographic overlap was excluded. It is supplementary lexical evidence, not an independent holdout.
- None of these tracks measures Ukrainian target orthography or IPA-to-Ukrainian adapter consistency.

### Other diagnostic findings

- On UGTPHON, paired native-vs-g2pk comparison (2,702 shared occurrences): native 52.7387% exact / 9.0130% CER; g2pk 53.1088% / 9.2337%. g2pk has a +0.3701 percentage-point exact advantage but worse CER by 0.2207 points. Neither dominates both metrics.
- Kiwi + MeCab-Ko consensus changed only 3 of 1,907 unique words; exact rate did not improve and paired CER worsened by 0.000173. Morphology remains diagnostic-only and must not be used as a blanket IPA override.
- Kiwi/MeCab-Ko exact boundary-set agreement is 80.65%; native soft-rule boundary agreement is 94.01% on 217 shared rule events. These are analyzer-agreement diagnostics, not segmentation gold or proof of phonological rule licensing.

### Final classification

- v17 candidate-only implementation and Python/browser parity: **DONE_VERIFIED**.
- Final-head CI and generated artifacts listed above: **DONE_VERIFIED**.
- Supplemental corpus preparation and matrix: **DONE_VERIFIED for this run**, with K-SPAN key-field cross-check warning retained as an evidence-quality issue.
- K-SPAN WorldBet key-field mapping audit: **PARTIAL**; acceptance requires resolving/documenting all 22,843 cross-check mismatches or establishing a source-backed explanation per symbol mapping.
- Independent, layer-matched Narrow IPA/audio gold and expert speaker/dialect adjudication: **BLOCKED**; acceptance requires licensed audio or independently reviewed speaker-labelled narrow IPA annotations.
- Neural comparison: **DEFERRED/SKIPPED** by workflow conditions; no model outputs were used.
- Release readiness: **not release-ready / research prototype**. Passing software CI does not certify phonetic correctness, narrow IPA accuracy, or Ukrainian target quality.



### Supplemental blocker fallback regression added and verified — 2026-11-28

- Added an end-to-end unit test for `run_open_korean_benchmark_ci.main()`: when the optional supplemental matrix raises `ExternalSourceUnavailable(HTTP 403)`, the runner writes a machine-readable `BLOCKED_EXTERNAL_SOURCE` status, records that no supplemental scores were produced, and exits successfully so already-completed core benchmarks remain valid.
- Exact code/test head `cf1d7a1e8e34401b452c0a58146b1db06265d35e`, system verification run [46127584454](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/46127584454): Python regression/data integrity **PASS** (including the new end-to-end test); Browser regression, source redistribution-rights gate, production build and generated-page verification **PASS**. Official NIKL metadata-only inventory **SKIPPED by policy**.
- The multi-engine benchmark rerun on this test-only head was queued behind the prior long-running comparison. The benchmark itself already completed successfully on source-identical head `9ea66677e1a70ddf87d7dbcc43a770e1e18d0622` (run 46081938091). No engine source changed in `cf1d7a1`; it adds test coverage only.
- Current branch status: implementation/tests verified; supplemental K-SPAN key-vs-WorldBet audit remains evidence-limited as described above; audio-backed Narrow IPA adjudication remains blocked.


## 2026-11-28 — Narrow benchmark interaction analysis (artifact-backed)

**Scope:** diagnostic-only improvement to the paired Standard/Extended IPA benchmark. No runtime phonological rule, primary Narrow output, profile version, target adapter, or corpus label was changed.

**Evidence anchor:** workflow run [46081938091](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/46081938091), source engine head `9ea66677e1a70ddf87d7dbcc43a770e1e18d0622`; paired artifact `15238494535` (SHA-256 `110e436093b28b4fc8794871093ba70c02851756e6dab2d0e0705cab0beee9d1`). Follow-up test-only head `cf1d7a1e8e34401b452c0a58146b1db06265d35e` passed the system checks in run [46127584454](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/46127584454); it did not change engine behavior.

### Paired primary scores (cross-layer agreement, not Narrow gold accuracy)

| Dataset | Scored | Narrow exact | Narrow CER | Candidate-oracle rescues |
|---|---:|---:|---:|---:|
| UGTPHON | 2,702 | 72.2058% | 4.5519% | 392 |
| SIGMORPHON | 998 | 51.3026% | 9.8821% | 150 |

The references are not independently adjudicated Narrow IPA gold. Candidate-oracle values are offline corpus-label coverage upper bounds, never a runtime selection rule. Standard and Extended Broad are identical by contract.

### Error and interaction findings

Occurrence-weighted normalized-symbol diagnostics:

| Edit pattern | UGTPHON | SIGMORPHON |
|---|---:|---:|
| `l → ɭ` | 543 | 190 |
| `h → ɦ` | 96 | 33 |
| `s → ɕ` | 62 | 12 |
| `y → i` | 37 | 20 |
| `l → ʎ` | 33 | 55 |
| `ʰ → x` | 24 | 11 |
| `ʰ → ç` | 21 | 11 |

These are Unicode-codepoint edit pairs, not phonological diagnoses. Within-token co-occurrence exposes several coupled patterns that aggregate exact/CER conceal:

- `y → i` + insertion `∅ → ɥ`: 37 UGTPHON and 19 SIGMORPHON occurrences. This is consistent with a two-part [ɥi] versus [y] mismatch, not two independent rule failures.
- `l → ɭ` + `l → ʎ`: 33 UGTPHON occurrences. This is the geminate-liquid sequence behind the source-scoped [ʎ.ʎ] interaction hypothesis; it does not prove that [ʎʎ] is the speaker's categorical realization.
- `h → ɦ` + `l → ɾ`: 11 UGTPHON and 4 SIGMORPHON occurrences. The pair warrants focused review of liquid+/h/ contexts and rule ordering, but does not justify selecting either phone from text alone.

UGTPHON's 751 mismatching occurrences represent 578 distinct Hangul types (173 repeated occurrences beyond one per type). Across 1,906 scored types, type-weighted exact is 69.6747%, versus occurrence-weighted 72.2058% (+2.5311 percentage points because frequent types are easier on average). SIGMORPHON has 486 mismatching occurrences among 998 scored types, so type- and occurrence-weighted exact are both 51.3026%. The one unscored type in each dataset is excluded from these rates. Occurrence-weighted and type-weighted diagnostics must remain separate.

### Candidate interaction results

- Unselected Narrow candidates occur on 1,124/2,703 UGTPHON tokens (41.58%) and 472/999 SIGMORPHON tokens (47.25%); selected candidates remain zero.
- Candidate-oracle rescues cluster around word-final coda ㄹ (208/47), coda ㄹ before a same-word consonant (130/46), the composed [ʎ.ʎ] geminate hypothesis (27/20), and position-conditioned ㅟ → [ɥi] (26/12), UGTPHON/SIGMORPHON respectively. SIGMORPHON also has 25 rescues from coda ㄴ before an alveopalatal affricate.
- The intervocalic [ɭ] candidate is frequent (516/157 candidate occurrences) but produced no candidate-oracle rescue in this paired artifact. Keep it unselected; this is not proof against the variant because the reference convention is not Narrow-adjudicated.
- Candidate counts, candidate rescues and primary scores are distinct quantities. Do not add candidate rescues to exact match or tune a primary profile to maximize oracle coverage.

### Evidence-led interpretation and next work

1. Prioritize per-context investigation of coda ㄹ before consonants/word boundaries, ㅟ realization, geminate ㄹㄹ, and liquid+/h/ interactions.
2. Keep source-conditioned [ɭ], [ʎ], [ɥi], [ɦ] and release variants unselected unless an exact environment and independent evidence support a deterministic choice.
3. Separate lexical occurrence weighting from unique-type weighting and report error-pair co-occurrence in future benchmark artifacts.
4. Do not infer that a low score on Seoul/K-SPAN is a direct Narrow failure: Seoul is phonemic, K-SPAN is lexical surface-phonetic, and their conventions differ. K-SPAN's 22,843 key/WorldBet mismatches remain a separate source-integrity warning.
5. The 95% target cannot be validated until there is a frozen, independently adjudicated, layer-matched Narrow test set with speaker/dialect/prosody scope.

### Task ledger

- `DONE_VERIFIED`: artifact downloaded and inspected; paired score, per-edit counts, candidate rescues, occurrence/type imbalance and within-token edit co-occurrences calculated.
- `DONE_VERIFIED`: benchmark runner and regression tests add occurrence/type weighting, within-token edit pairs/signatures, and candidate-rescue × primary-error interactions. Exact code/test-head System Verify run `46129060336` passed Python regression/data integrity, browser regression, rights gate, production build and generated-page checks; test-register extraction run `46129060371` passed. The isolated Node smoke test also passed.
- `PARTIAL`: refreshed multi-engine run `46129060373` was cancelled by PR-workflow concurrency after documentation-only commits. Prior run `46128961225` remains in progress on superseded commit `274d4abef145a9ab0bf78ac27957d8ef51adc2ff`; its benchmark-runner blob SHA `700ecad6a1fd6dcad6420d6528b758676d66750d` is identical to the final runner, and its benchmark-adapter tests passed. Await its paired artifact; do not claim a refreshed aggregate until it uploads. Code/test head is `1fbc06f15c775b33e5b351e9c19f6d58839b7b1d`; subsequent commits on this branch are documentation-only.
- `BLOCKED`: independent layer-matched Narrow IPA gold/audio and speaker/dialect adjudication remain unavailable.
- `BLOCKED`: K-SPAN WorldBet key-field reconciliation remains open (22,843 mismatches).
- `DEFERRED`: no new deterministic primary IPA rules promoted from benchmark-label matching.

**Disposition:** a better diagnostic instrument, not an accuracy uplift. The deterministic engine remains a research prototype and the Narrow profile remains partial/research-only and target-incompatible.


### External literature cross-check — interpretation guardrails (2026-11-28)

- **Korean liquids:** Crosby & Dalola (2021), DOI [10.3765/plsa.v6i1.5002](https://doi.org/10.3765/plsa.v6i1.5002), studied 12 Standard Korean speakers. They report 422/425 intervocalic liquids as taps (99.3%); before /h/, 153 taps and 103 laterals (59.8%/40.2%); among those 103 laterals, only 12 were retroflex. Pre-pausal retroflexion was 263/509 laterals (51.7%), while preconsonantal retroflexion excluding /h/ was 15/222. The paper attributes much of the tap/lateral split before /h/ to /h/-lenition: [ɾ] when /h/ is elided, [l] when it remains. Thus the benchmark co-occurrence `l → ɾ` + `h → ɦ` is **not** a source-backed categorical interaction; it is in tension with that reported conditioning and should be treated as convention/dialect/token uncertainty pending adjudication, not encoded as a new rule.
- **/h/ after sonorants:** Kang & Lee (2019), DOI [10.17290/jlsk.2019..84.175](https://doi.org/10.17290/jlsk.2019..84.175), compare three Seoul and three Gwangju speakers reading five stories. They report more weakening/deletion after sonorants in Gwangju, while the durations of voiceless and voiced /h/ were not significantly longer in Seoul. This supports dialect-conditioned optionality, not a universal [ɦ] rule. Um (2014), DOI [10.17959/sppm.2014.20.3.357](https://doi.org/10.17959/sppm.2014.20.3.357), finds that the preceding sonorant is shorter even when /h/ is not acoustically manifested; a plain segment-deletion candidate would therefore lose relevant phonetic information.
- **N-insertion and morphology:** Jun (2021), DOI [10.5334/GJGL.1401](https://doi.org/10.5334/GJGL.1401), finds gradient effects and interactions among morphological category, etymology, component length, preceding consonant sonorancy/place, following-vowel height and dialect. These factors are not absolute conditions. Do not turn one benchmark correlation into a blanket categorical n-insertion rule.
- **Stop narrowness and prosody:** Schweizer, Ahn & Kwon (2026), DOI [10.1017/S002510032510087X](https://doi.org/10.1017/S002510032510087X), compare IP-initial, AP-initial/inter-sonorant and word-medial stops. Cue weighting changes by prosodic position and vowel height; word-medial f0 effects are comparatively small and context-dependent, while closure duration/voicing and burst duration matter. These cues require audio and prosodic context, neither of which Hangul spelling supplies.

**Engine decision:** preserve current deterministic primary outputs; keep uncertain allophones unselected; represent speaker/dialect/prosodic context and uncertainty in the typed IPA boundary; focus subsequent runtime changes on source-backed, testable rule interactions rather than maximizing cross-convention exact match.


### Final review and rulings (2026-11-28)

- **Ruling — no primary Narrow rule promotion:** the largest benchmark mismatches are not independent Narrow gold; the source literature shows positional, dialectal and prosodic variation. Promoting [ɭ], [ɦ], [ɾ] or [ɥi] to deterministic primary output from corpus exact-match alone would overfit conventions. Cost if wrong: a valid context-specific variant may be deferred; mitigation is to retain source-backed unselected candidates and prioritize an independently adjudicated, context-tagged holdout.
- **Self-review:** reviewed the changed benchmark functions, output schema, test fixtures, five-file diff and exact code/test-head CI evidence. No Critical or Important code defect found. The diagnostics are occurrence-weighted and deterministic; token-type counts are separate; candidate rescue is never fed back into runtime selection.
- **Deferred minor/process limitation:** the first implementation/test commits were made before an observed RED run; the strict Superpowers RED→GREEN chronology is therefore not evidenced, even though the final exact code/test-head System Verify passed. A local clone was unavailable, so repository tests were verified through GitHub Actions rather than a local full-suite command.
- **Final review mode:** self-review (no subagent tool available). The PR remains draft and unmerged; no release or default-branch changes were made.


## Narrow v18 — /h/-lenition × coda-liquid interaction (2026-11-28)

**Implementation:** Added a source-scoped, unselected whole-word Narrow alternative for a same-word coda ㄹ + onset ㅎ sequence: primary `[l.h]` / `[l.ç]` remains unchanged; the candidate jointly realizes the liquid as `[ɾ]` and deletes the following /h/ (e.g. `말하`: `mal.ha` → candidate `maɾ.a`; `말히`: `mal.çi` → candidate `maɾ.i`). The condition is restricted to the same word and coda ㄹ; word boundaries and other sonorants do not trigger it.

**Evidence and interpretation:** Crosby & Dalola (2021), DOI https://doi.org/10.3765/plsa.v6i1.5002, report 59.8% taps and 40.2% laterals before /h/ in their 12-speaker Standard Korean sample; their discussion relates the tap/lateral alternation to /h/-lenition, with [ɾ] when /h/ is elided and [l] when it remains. This is encoded as an unselected candidate only. The text-only engine has no speaker, dialect, speech-style, or audio evidence to select it. The benchmark co-occurrence of liquid and /h/ edits is therefore not treated as evidence for a universal [ɾɦ] sequence or as permission to change primary output.

**Runtime/version:** Python and browser candidate generators now agree; Narrow profile metadata is v18 in both runtimes. Standard/Broad IPA and Ukrainian target adapter are unchanged.

**TDD and verification:** Test-first RED was observed on test-only commit `207dfcfaa2e26f5dd3cdeb2f2791b879093cf98a`: Python raised `StopIteration` because the candidate was absent; browser assertion `assert.ok(candidate)` failed. The implementation then passed the complete Python suite and all 1,514 browser tests on code/test head `cd5ff602d8640794626ebaa9c0381a7b7f503e2e`. System Verify run `46130487280`: Python regression/data integrity PASS; browser tests PASS (1,514/1,514); redistribution-rights gate PASS; public build PASS; generated-page checks PASS; official NIKL metadata-only inventory SKIPPED BY POLICY. Intermediate profile-contract failures exposed stale v17 metadata in `ipa.py` and `tests/test_ipa.py`; both were corrected and the final exact-head run passed.

**Benchmark status:** External UGTPHON broad diagnostic run `46130487284` completed successfully, but it evaluates the Broad profile and does not validate Narrow candidate rescue. The refreshed multi-engine/Narrow benchmark `46130487292` remains pending because prior multi-engine run `46128961225` is still processing its open Seoul/K-SPAN/IPA-Dict matrix. No Narrow accuracy uplift or candidate-rescue count is claimed until the exact v18 artifact is available and inspected.

**Branch/PR:** `feat/narrow-h-lenition-liquid-interaction-v18-2026-11-28`; draft PR #513 against the diagnostic branch; deliberately unmerged. Independent audio-backed Narrow adjudication remains unavailable.
