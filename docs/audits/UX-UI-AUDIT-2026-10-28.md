# UX/UI audit — 2026-10-28

## 2026-11-12 — result/mode metadata visual cleanup

**Status: IN PROGRESS pending exact-head browser and rendered visual verification.**

- **Finding:** the IPA provenance and Ukrainian target-status messages were attached to the correct result cards, but their visual treatment was inconsistent: the IPA note retained a top divider while the target note inherited right alignment. The IPA line also concatenated mode, engine, status and coverage into one dense string, and did not explicitly name the active practical mode.
- **Change:** present provenance as aligned, borderless metadata rows: active mode + engine + pronunciation state, followed by a separate coverage row only when research-mode coverage exists. Label the Ukrainian target note as its own status row. Both remain attached to their corresponding result cards; no floating notice or new result card is introduced.
- **Mode clarity:** practical mode is named explicitly as “Звичайний режим”; research mode includes the selected “Строгий / М’який / Суперм’який” level. Engine identity and pronunciation state remain visible.
- **Responsive treatment:** metadata labels and values use a compact two-column layout with wrapping, no border, background, pill shape or right alignment.
- **Scope:** HTML structure, status rendering text, CSS and contract tests only. No engine, phonology, IPA, Ukrainian mapping, candidate selection or linguistic data changed.
- **Acceptance:** exact-head Node/browser tests and rendered editorial review at 1440, 1024, 768, 390 and 320 CSS px; verify long coverage text wraps without overflow and both status rows stay with the correct result cards.
- **Rendered-review enhancement:** the Playwright editorial capture now checks the visible practical-mode label and the three research-level labels against the selected slider state, confirms the Kozak Kim engine identity, and verifies the metadata row is grid-aligned, left-aligned, borderless and background-free at all five widths.



## Status and scope

**Status: PARTIAL — source/contract audit completed; visual and assistive-technology verification blocked.**

Target: public service at https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/ and its methodology page. Audited the current `main` source at commit `7f727a9330ba584bd06f423bacd42013ea8cdda5`: `index.html`, `system.html`, `src/main.js`, `src/styles/main.css`, `src/styles/spelling-suggestions.css`, `tests/web-ui-contract.test.mjs`, `tests/deploy-pages-smoke-contract.test.mjs`, and `docs/WEB-SERVICE-QA.md`.

The Product Design audit workflow calls for current desktop/mobile screenshots and visual inspection. Attempted to capture the public page through the connected Firecrawl service, but it returned an explicit insufficient-credits error. Direct page retrieval through the web viewer returned cache-miss errors. No screenshot was obtained, so this report does **not** claim visual, browser-based, WCAG conformance, or assistive-technology testing. Findings below are source-grounded hypotheses or verified structural observations and should be confirmed in a live browser.

## Overall assessment

The service has a coherent editorial identity and a clear functional hierarchy: input → Ukrainian output → supporting IPA/RR/analysis → optional syllable trace. The prior provisional-candidate fix is sound in intent and represented by a source-level contract. The strongest remaining UX risks are that the interface exposes too much implementation terminology to first-time users, dynamic result updates are not announced meaningfully to screen readers, and the methodology page is a very long document without an evident in-page contents navigation.

## Findings

### UX-01 — Dynamic output has weak screen-reader feedback

- **Priority:** P1 for accessibility; verify before release.
- **Evidence:** `index.html` gives the empty state `aria-live="polite"`, but the actual results container and result cards are not live regions. `src/main.js` rewrites result text on each input event and the separate `#live-region` only announces generic messages such as “Обробку завершено.” / “Обробку завершено з попередженнями.”
- **User impact:** A screen-reader user may hear that processing finished without being told the new Ukrainian output or whether the target is unconfirmed. A live announcement of the entire result grid would also be too verbose, so simply adding `aria-live` to the whole results section is not a safe fix.
- **Recommendation:** Design a concise status announcement that communicates the output state (confirmed / candidate / unavailable) and, when appropriate, the short Ukrainian output. Avoid announcing on every keystroke: debounce announcements or announce after a deliberate pause, while keeping visible results responsive. Preserve the distinct candidate warning.
- **Acceptance:** Test keyboard-only and at least one screen reader on empty → short input → candidate/unavailable output → copy success/failure. Verify announcements are useful and not repetitive.

### UX-02 — Mode choices foreground implementation detail over user intent

- **Priority:** P2.
- **Evidence:** `index.html` explains the default mode using “JavaScript-порт g2pK”, “точкові виправлення за NIKL”, “поверхнева форма” and a long caveat; research mode refers to “нативний дослідницький рушій”, “словникові ліцензії”, “heuristic-low-confidence” and exact NIKL/lexical licenses.
- **User impact:** A new user must understand internal implementation names before choosing a mode. The practical mode's caveat is valuable for trust, but its current location and density compete with the primary task.
- **Recommendation:** Keep a short, user-oriented explanation next to each choice (e.g. “Для швидкого читання” vs “Для дослідження правил і невизначеностей”). Put engine names, source limitations and confidence semantics in a clearly labelled “Як це працює / Обмеження” disclosure or link to methodology. Do not hide the fact that the output is not guaranteed normative.
- **Acceptance:** A first-time user can choose a mode and explain the difference without knowing g2pK, NIKL or lexical licensing; researchers can still find full technical provenance.

### UX-03 — Methodology page has high navigation cost

- **Priority:** P2.
- **Evidence:** `system.html` is a long single document (about 54 KB in source) with many numbered sections and research appendices. The page has top-level navigation between “Сервіс” and “Методологія”, but no in-page table of contents was found in the inspected markup.
- **User impact:** Readers arriving for a specific topic (IPA pipeline, limitations, source evidence, benchmarks) must scroll/search through a dense technical document. This is especially costly on mobile.
- **Recommendation:** Add a compact, accessible contents list with links to the major sections and an obvious return-to-service action. Keep the existing hero design unchanged. Consider grouping deep research appendices under native `details/summary` only if doing so does not hide essential limitations or evidence.
- **Acceptance:** Users can reach the major methodology topics in one interaction; fragment links work, heading hierarchy is valid, and the contents list wraps cleanly on mobile.

### UX-04 — Live conversion may do too much synchronous work on every keystroke

- **Priority:** P2 — performance hypothesis, not yet measured.
- **Evidence:** `src/main.js` calls the full `render()` function on every `input` event. Each render converts the complete input, rebuilds the alternatives and syllable trace, and calculates IPA-to-Ukrainian trace mappings. The UI also exposes a 5,198-character stress-test example.
- **User impact:** On slower devices or long pasted text, synchronous work could delay typing and make the interface feel frozen. The warning that the stress test can take longer is useful but does not quantify normal long-text behavior.
- **Recommendation:** Measure before changing architecture. Add browser performance checks at representative lengths (short phrase, ~1,000 chars, 5,198 chars). If latency is material, separate immediate character-count updates from conversion, debounce conversion modestly, or provide an explicit “Обробити” action for long inputs. Do not weaken determinism or change phonological rules.
- **Acceptance:** Record conversion duration and main-thread responsiveness at agreed input sizes on desktop and mobile; no arbitrary threshold should be claimed before measurements.

### UX-05 — Clipboard failure has no direct recovery action

- **Priority:** P3.
- **Evidence:** The copy handler catches Clipboard API errors and announces “Автоматичне копіювання недоступне; виділіть результат вручну.” It does not select the output, move focus, or provide a dedicated fallback control.
- **User impact:** The user is told to manually select text but must figure out how, especially for long analysis or candidate output.
- **Recommendation:** On failure, expose a visible inline message and a simple recovery affordance (select/focus the relevant output or offer a selectable text field). Do not silently report success. Keep the candidate-specific copy wording.
- **Acceptance:** Simulate clipboard permission denial and verify a keyboard user can select and copy the intended field with clear feedback.

### UX-06 — Deep trace is intentionally detailed but mobile density needs visual validation

- **Priority:** P3 — visual verification required.
- **Evidence:** Trace rows expose seven information groups (source, surface form, IPA, IPA-token mapping, Ukrainian output, rules, status). At widths ≤720px, CSS changes the row to two columns and hides the column headings.
- **User impact:** Without column headings, users may have to infer which of many values each cell represents. This may be acceptable for a specialist trace but needs a real narrow-screen check.
- **Recommendation:** Inspect at 320, 375/390 and 720 CSS pixels. If labels are not unmistakable, render each trace field with its own compact label on mobile rather than relying on positional inference. Keep the trace collapsed by default.
- **Acceptance:** A user can identify every trace value without referring to desktop column headers; no horizontal overflow at tested widths.

## Positive evidence to preserve

- The Korean/Ukrainian editorial hero is distinctive and should remain unchanged absent evidence of a real problem.
- The input has an explicit label and linked guidance.
- Practical/research choices use native radio inputs inside a fieldset.
- Navigation marks the current page and provides a skip link.
- Focus-visible styling and reduced-motion rules exist.
- Result hierarchy prioritizes Ukrainian output, with IPA, Revised Romanization and analysis as supporting cards.
- Syllable trace uses native keyboard-operable `details/summary` and is collapsed by default.
- Unconfirmed candidates are separated from the accepted-result slot; the primary copy action is hidden when the target is unconfirmed.
- Sampled text/background palette pairs pass WCAG AA contrast for normal text by calculated contrast ratio: muted #5e6872 on #f2efe8 = 4.94:1; blue #0047a0 on #f2efe8 = 7.59:1; warning #8a4b13 on #fffaf0 = 6.52:1; red #cd2e3a on #fffdf8 = 5.10:1. This is only a palette sample, not a full contrast audit of all states and elements.

## Priority order

1. UX-01 screen-reader result feedback.
2. UX-02 mode-choice comprehension.
3. UX-03 methodology navigation.
4. UX-04 measure performance before deciding on implementation.
5. UX-05 clipboard recovery.
6. UX-06 verify trace labels on narrow screens.

## Required next verification

- Capture current public screenshots at desktop 1440×1000 and mobile 390×844, plus a narrow 320 CSS-pixel check.
- Run the live service with empty input, a short canonical example, a known candidate/unavailable example, the research mode, copy success/failure, and the 5,198-character stress case.
- Inspect keyboard order, focus visibility, browser zoom/reflow, reduced-motion, and screen-reader announcements.
- Update this report with screenshot-linked evidence and mark each finding confirmed, rejected, or revised. Until this is done, overall UX/UI audit status remains **PARTIAL**, not DONE_VERIFIED.


## Implementation follow-up — branch `fix/ux-ui-accessibility-rebased-2026-10-28`

The source-backed remediation is implemented in PR #362. This does not close the visual audit; runtime and deployed-site verification remain required.

- **UX-01 — implemented, browser verification pending:** the polite live region now announces completion plus a concise Ukrainian-output state/value, debounced by 300 ms to avoid announcements on every keystroke. Candidate/unavailable states are described separately.
- **UX-02 — implemented, comprehension check pending:** mode descriptions now lead with user goals; engine/provenance caveats remain accessible in a native disclosure and are not removed.
- **UX-03 — implemented, visual verification pending:** methodology page has a responsive in-page contents list, stable fragment targets for all 21 topics, and a return-to-service link. A source check found no missing fragment targets or duplicate IDs.
- **UX-04 — deliberately not changed pending measurement:** full conversion remains synchronous on input. No debounce/explicit-submit change is justified without measured responsiveness, because it could change the existing immediate-conversion interaction. Measure short, 1,000-character, and 5,198-character inputs before deciding.
- **UX-05 — implemented, browser verification pending:** copy feedback is visible; if Clipboard API access fails, the intended output is selected and focused with a direct Ctrl+C recovery instruction.
- **UX-06 — implemented in source, visual verification pending:** every trace field, including alternative-reading rows, now has a semantic `data-label`; narrow layouts display those labels with each value.

### Code-level checks

- Added three UI contract tests for result announcements/copy recovery, mode disclosure, and mobile trace labels/methodology navigation.
- Updated the Pages smoke assertion to check that technical engine details remain available in the progressive disclosure rather than requiring them in the primary mode description.
- Source integrity check: 22 methodology anchor IDs; 22 local fragment links; zero missing local targets; zero duplicate IDs (computed from the current branch source).
- No changes to phonological rules, IPA, target mapping, or the hero block.

### Remaining acceptance gates

The audit remains **PARTIAL** until a real browser verifies: desktop/mobile visual rendering; 320 px trace reflow; keyboard/focus behavior; screen-reader output announcements; clipboard denial fallback; comprehension of the mode labels; and conversion latency for the three representative input lengths. CI test success alone does not establish those outcomes.


## Live browser verification — 2026-10-28

**Evidence source:** post-deployment Playwright run [#40703251527](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40703251527), deployed commit `49160487f25e6c9569cecf24bbb234155932ba2c`. The script ran against the published GitHub Pages URL, not a local mock.

**Passed in the live browser:**
- A 1,443-character adversarial Korean passage produced a 2,774-character provisional candidate and 3,725 IPA characters; the UI retained the separate candidate panel and explicit unconfirmed status.
- The live region announced a meaningful result state/value.
- The practical-mode technical disclosure opened and retained the g2pK provenance.
- Simulated Clipboard API permission denial displayed recovery guidance and selected the exact IPA field.
- At a 390×844 viewport, trace fields exposed visible labels and the document had no horizontal overflow.
- The methodology contents were visible on mobile and the `#methodology-00a` link navigated to a real target.
- No browser runtime errors were reported by the smoke.

**Not established by this smoke:** actual screen-reader speech/verbosity, manual keyboard-only evaluation, visual screenshots and design review, 320 px reflow, human comprehension testing of mode labels, and measured conversion latency for short / ~1,000 / 5,198-character input. The audit therefore remains **PARTIAL**, despite the live smoke passing.

The updated smoke is in [PR #363](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/363); the application remediation is in [PR #362](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/362).


## 2026-11-11 — visual correction: single-column flow and no object chrome

**Scoped outcome: DONE_VERIFIED for the approved layout correction.** The prior editorial redesign still placed the hero specimen and workbench beside their text/input at desktop widths. PR #470 was merged as `5cf22096dee9caae74cb9be7643184ec8c8b32d8` and published those changes to GitHub Pages.

- The service now reads input → mode → «Перетворити» → Ukrainian result → IPA → romanization → Hanja → analysis → alternatives → syllable trace. Example chips and their explanatory hint sit before the mode control; the primary action follows the mode and its optional advanced settings directly, and the result follows the action.
- The methodology page is one column from its introductory specimen through the contents and every section. Section numbers remain plain text in the actual headings, not a separate number rail.
- Removed object-level specimen top/bottom strips, result metadata bars, trace-column header band, dark table header bands, section-label rail, status badges and disclosure number/plus badges. Table/evidence rows and diagnostic fields are individually labelled in ordinary vertical flow; the trace list keeps an accessible label without a visible header band.
- The primary action calls the existing renderer; automatic conversion remains enabled. No phonological, IPA or Ukrainian adaptation behavior changed.
- Browser visual review [42985071214](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42985071214) passed on the exact implementation head across both pages at 1440, 1024, 768, 390 and 320 px. Post-merge System Verify [42985384183](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42985384183) passed with 1,442/1,442 tests, Python regression/data integrity, source-rights audit, production build and generated-page checks. Full Python-version/wheel/teacher-corpus matrix [42985384248](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42985384248) and Browser G2P [42985384335](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42985384335) passed. GitHub Pages deployment and public HTTP/live-browser smoke [42985384175](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42985384175) passed.
- The earlier test run with six stale UI assertions was not accepted as evidence; the assertions were reconciled to the new accessible labels and IPA-first output order. The corrected complete suite passed 1,442/1,442. An intermediate test-only syntax error in the contract update was corrected before the exact-main runs; no production/runtime defect remained.

**Remaining scope:** this closes the layout and rendered-responsive findings addressed here, not the entire historical UX audit. Real screen-reader speech/verbosity, participant comprehension of mode labels and measured conversion latency remain unverified. Overall historical UX/UI audit therefore remains PARTIAL.


## 2026-11-11 — visual hierarchy restored without undoing the vertical-flow requirement

The previous vertical-flow patch removed too much of the design language. Although it correctly removed object-level title/footer strips and split layouts, it flattened the service and methodology into an undifferentiated monochrome document. This was a design regression, not a reason to restore the old side-by-side composition.

PR [#473](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/473) restores the visual identity through Hangul typography, cobalt and restrained pink accents, hanji-like surfaces, stronger type hierarchy, clear mode grouping and high-contrast controls. The specimen keeps no visible object-level label strips. Both pages remain strictly vertical at all breakpoints.

**Verification:** rendered review [42988127319](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127319) passed desktop, tablet, mobile and narrow-mobile viewports, including overflow, focus, reduced-motion and touch-target checks. Test matrix [42988127248](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127248) passed 1,443/1,443 web tests and Python 3.11/3.12/3.13, wheel-install and teacher-corpus checks. System Verify [42988127245](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127245) passed browser build/regression and Python/data-integrity checks.

**Outcome:** the visual regression is corrected and merged. The broader historical UX/UI audit remains PARTIAL because real screen-reader speech/verbosity, mode comprehension and measured conversion latency still need human evaluation.


## 2026-11-11 — corrected scope of vertical layout

The previous remediation over-applied the vertical-flow request to the entire site. The user's intended scope is only the two service workbench windows: Korean text entry first, answer window second. The hero, specimen, methodology contents, rule/evidence grids and tables must retain their editorial compositions.

PR #475 restores those compositions and stacks only `.workspace-layout`. The hero and three-stage specimen return to a side-by-side desktop arrangement; result details retain their two-column grid; methodology contents and evidence layouts retain grouped grids. Object-level decorative label/header/footer strips remain absent. PR #477 restores the documented semantic accent mapping (IPA yellow, Ukrainian pink).

**Verification:** rendered review [42990218241](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42990218241) passed all 10 page/viewport combinations. Exact-head tests [42991034581](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42991034581), System Verify [42990597830](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42990597830), and post-colour rendered review [42991034345](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42991034345) passed.

**Outcome:** the layout-scope regression is corrected and merged. Human screen-reader, mode-comprehension and conversion-latency studies remain separate uncompleted UX evidence tasks.


## 2026-11-11 — attach provenance to the primary Ukrainian result

A rendered desktop capture from the existing visual-review artifact [13841806466](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42991034345) showed the dynamic engine/mode status as a separate child of `.result-grid`. Because that grid is two columns, the status occupied a result cell and displaced the IPA card into the opposite column. The provenance was visually detached from the Ukrainian output it qualifies.

**Correction:** move the existing `#status-note` element inside `#panel-ukrainian`, preserving its ID and all runtime updates. Style it as quiet, left-aligned provenance text without a badge background, border or padded object strip. The remaining five result cards retain their two-column desktop grid and responsive collapse. No conversion or phonology code changes.

**Task ledger**
- Provenance belongs to the Ukrainian output: **DONE_VERIFIED** — source-contract regression added; the test-only Verify run [42995360086](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42995360086) failed at the intended assertion before the markup/CSS correction.
- Markup and visual treatment: **DONE_VERIFIED** — implementation commit `ba2ef860c515851f22618e8f33e1e1fa51aba71c`; Verify [42995616576](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42995616576) passed 1,444/1,444 Node tests, source-rights audit, build/generated-page checks and Python regression/data integrity.
- Rendered five-viewport review after the correction: **DONE_VERIFIED** — [42996069104](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069104) passed all 10 page/viewport combinations at 1440, 1024, 768, 390 and 320 px; artifact [13843693958](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069104) was inspected at desktop and mobile widths. The Playwright run also asserts that provenance is inside the Ukrainian panel and the supporting grid contains exactly five result cards.
- Human screen-reader speech, mode-comprehension and conversion-latency studies: **PARTIAL** — remain separate human-evaluation tasks; screenshots and automated tests do not establish them.

**Exact PR-head verification:** [42996069023](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069023) passed Node tests, source-rights gate, production build/generated-page checks and Python regression/data integrity; [42996069075](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069075) passed 1,444/1,444 web tests, Python 3.11/3.12/3.13, wheel installation and teacher-corpus audit; Browser G2P [42996069046](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069046), test-register extraction [42996069171](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069171) and master/research artifacts [42996069076](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42996069076) passed. PR [#479](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/479) merged as `da33e2279bfe7218c1ad4c4632dfb44d18f3f3bf`. Pages deployment [42997176343](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176343) passed; public HTTP smoke confirmed `index.html`, `system.html` and the first JavaScript asset. Live browser smoke passed mode disclosure, clipboard-denial recovery, mobile trace labels and methodology navigation; adversarial smoke processed 1,443 Korean input characters and explicitly labelled the Ukrainian output as a preliminary candidate.

**Post-merge main verification:** Tests [42997176514](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176514) and Verify [42997176635](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176635) passed; master/research artifacts [42997176540](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176540) passed. The visual fix is now deployed on the public Pages site.

**Evidence limit:** the earlier malformed test-regex attempt [42995077792](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42995077792) failed at test-module parsing and is not counted as a RED test. The corrected test-only run above is the valid RED evidence.


## 2026-11-11 — replacement visual system: Seoul Type

**Scope:** complete visual redesign of the two-page public site. Product behavior, conversion logic, linguistic data, IPA adapter and browser-only security boundary remain unchanged.

**Research basis:** contemporary Hangul type design and Korean editorial practice, not national-symbol decoration. References reviewed include Letterform Archive's overview of contemporary South Korean typography; the LetterSeed exhibition; Korea.net's *art+language* exhibition; MMCA Korea's *Ways of Reading* on the shift from Hangul print to mobile reading; Seoul Museum of Art's Ahn Sang-soo typography exhibition; and the Seoul studio Ore-Oh profile. These references support typographic structure, reading rhythm, print/screen continuity and flexible identity systems; they do not imply a single canonical Korean aesthetic.

**Design decisions:** replace the previous jogakbo/cool-paper identity with warm neutral paper, deep ink, signal orange, acid yellow and cobalt focus. Hangul is used as real type, not pseudo-ornament. The service becomes a dark input workbench followed by a light answer surface; the Ukrainian output is the dominant result, with supporting cards grouped below. The methodology is a long-form reading surface with a strong contents panel, readable measure and grouped evidence layouts. No gradients, faux paper texture, glass effects, stock imagery, random Jamo, decorative badges or object-level title/footer strips.

**Task ledger**
- Research and design brief: **DONE_VERIFIED** — `DESIGN.md` and `docs/superpowers/specs/2026-11-11-seoul-type-system-redesign.md`.
- Service and methodology CSS: **DONE_VERIFIED** — replacement tokens and layouts in `src/styles/editorial.css`; semantic content and behavior preserved.
- Input/result order: **DONE_VERIFIED** — `.workspace-layout` is a single-column grid; DOM order remains input then output.
- Accessibility and responsive behavior: **PARTIAL** until rendered review and exact-head browser checks complete.
- Conversion/IPA/data behavior: **DONE_VERIFIED unchanged by scope** — no runtime or linguistic files changed.
- Superdesign canvas output: **BLOCKED** — CLI preflight timed out in the connector-only runtime; no mockup is claimed.

**Required exact-head evidence:** Node web tests, production build, Verify, Tests, rendered visual review at 1440/1024/768/390/320 px, public Pages deployment and live browser smoke. No local test run is claimed in this connector-only session.


**Contrast and focus contract follow-up — 2026-11-11:** darkened the small signal-red index colour to `#AD3426` (5.44:1 against `#EFEDE6`); updated the rendered-review focus assertion to match the new cobalt token `#254BD8`. Exact-head visual review must pass before this redesign is marked DONE_VERIFIED.


**Exact-head correction note — 2026-11-11:** the initial visual review exposed a stale global focus-colour expectation; the dark workbench correctly uses high-contrast acid-yellow focus while light reading surfaces use cobalt. The review now checks the active element's context. The initial Verify run exposed six stale assertions for the retired jogakbo design; `tests/korean-editorial-design-contract.test.mjs` now tests the replacement identity and contrast ratios. Rerun both gates before acceptance.


**Rendered focus assertion implementation:** the first edit did not replace the old check in `capture-editorial-review.mjs`; this was identified by reading the committed file and the second failed run log. The script is now rewritten by exact source-block boundaries, and a test asserts both context detection and expected token selection. Do not mark this gate complete until a fresh rendered review passes.


## Final verification — 2026-11-11

**Implementation SHA:** `0cb829d2d44077eba9296a1c8759cc8216a3859d` on `main`.

The Seoul Type redesign is **DONE_VERIFIED**:
- Research direction, seven visual anchors and cited primary sources are recorded in `DESIGN.md` and the dated spec.
- Both public pages use the replacement visual system; no linguistic or runtime code changed.
- The input and answer windows alone are stacked vertically; other editorial compositions remain grouped.
- Rendered review passed 10 page/viewport combinations (1440, 1024, 768, 390, 320 px), with no overflow and zero object-level chrome.
- Node web tests: 1,445 passed, 0 failed; Python 3.11/3.12/3.13, wheel install and teacher corpus audit passed.
- Verify passed browser regression/build and Python regression/data integrity.
- GitHub Pages deployment and live practical-mode adversarial Korean smoke passed; both public pages returned HTTP 200.

Evidence:
- [Tests 43000524061](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43000524061)
- [Verify 43000523976](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43000523976)
- [Rendered visual review 43000524213](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43000524213)
- [Pages deployment and live smoke 43000523955](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43000523955)

The first design attempt revealed stale legacy test expectations and a global focus-colour assumption; both were corrected and all final exact-head gates passed. Superdesign CLI preflight timed out, so no canvas artifact is claimed. Local shell tests were not run because this session used the GitHub connector and CI runners rather than a verified local checkout.


## 2026-11-11 follow-up — Jogakbo header and vertical editorial modules

**Status: DONE_VERIFIED — merged and deployed.** PR #480 merged on 2026-11-11; merge commit 505bc4ffa448a66f6bf5a9c1c4f812ad8754edec. GitHub Pages deployment and live browser smoke both passed (run 43020048051).

### Design outcome

- The jogakbo-inspired composition is limited to the shared header: eight unequal rectangular fields, visible page-ground seams, no fabric texture or decorative text.
- The service is a vertical task path: Korean input window first, Ukrainian result below it. Each module has plain-language usage or interpretation guidance; the textarea remains empty and placeholder-free.
- The methodology page uses one top-to-bottom reading flow. Its introductory module contains the reading guide; all 25 doc-section modules have at least one real content object (table, list, callout, diagram, example or evidence object). The six-level pipeline is vertical.
- Supporting result objects remain subordinate to the Ukrainian result. Existing DOM IDs, JS hooks, accessibility names, result/provenance states and copy behavior are preserved.
- Replaced the stale Seoul-specific visual explanation with user-facing methodology copy; the earlier Seoul Type brief is marked historical and superseded.

### Review findings and repairs

1. The first screenshot review exposed low-contrast mode descriptions on pale cards inside the dark workbench. The labels now inherit the dark surface, selected state is dark slate with acid accent, and the rendered-review script calculates contrast from computed foreground/background colours and enforces WCAG AA (4.5:1).
2. Removed the inherited red side border from the methodology introduction; the reading guide is now part of that vertical module rather than a detached text-only section.
3. Removed repeated input instructions and corrected the action copy to say that the user must press «Перетворити».
4. Added a vertical research-reference list so the sources section also has a visible content object.

### Verification evidence

- Node suite: 1,446 passed, 0 failed (PR Tests run 43019293505).
- Python regression/data-integrity suite: Python 3.11, 3.12 and 3.13 passed (run 43019293505).
- Browser G2P integration: passed (run 43019293495).
- Verify: Node tests, source-rights audit and production Vite build passed; Python regression/data integrity passed (push run 43019283132; PR run 43019293643).
- Exhaustive test-case register extraction: passed (run 43019293652).
- Master table and research corpus artifacts: passed (run 43019293509).
- Editorial visual review: passed at 1440, 1024, 768, 390 and 320 CSS px on both pages (run 43019293592; artifact 13853728176). The desktop and narrow-mobile renders were inspected manually; the dark mode labels are readable, input precedes output, and no horizontal overflow is reported.
- No linguistic/runtime/corpus/benchmark files were changed.

### Deployment and live verification

- Public URL: https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- GitHub Pages deployment: passed (run 43020048051).
- Public HTTP smoke: passed for index.html, system.html and the first built JavaScript asset.
- Live Playwright smoke: passed. It verified the deterministic Hanja dictionary chunk/output, result announcement, mode disclosure, clipboard-denial fallback, mobile trace labels at 390px and methodology navigation.
- Adversarial live input: 1,443 Korean characters; candidate output 2,982 characters; IPA 3,731 characters. The expected status remained a contextual/provisional candidate, not a confirmed linguistic result.
- Main-branch Verify, Tests, Editorial visual review and master/research artifact workflows passed (runs 43020048190, 43020048030, 43020048115 and 43020048102).

The visual redesign is now publicly deployed. The broader repository remains a research prototype; visual and browser verification do not close independent linguistic evidence, IPA review, target-form validation, corpus provenance/licensing or other research gates.


## 2026-11-11 — final acceptance: palette, specimen, research slider and syllable trace

**Status: DONE_VERIFIED — merged and deployed.** PR [#481](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/481) merged as `88a53d23e0a350abd22b7e663ca1679266902130`; follow-up smoke-test correction PR [#482](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/482) merged as final main commit `446d07405358f2b706e0bc0249ffa802f1516ce1`.

### UX acceptance ledger

- **DONE_VERIFIED — prose emphasis:** isolated inline bold single-letter emphasis removed/normalized.
- **DONE_VERIFIED — header specimen:** Hangul, IPA and Ukrainian triad integrated into the stitched jogakbo treatment.
- **DONE_VERIFIED — colour system:** shared palette tokens applied consistently across the public pages and specimen.
- **DONE_VERIFIED — research control:** accessible three-position slider (Строгий / М’який / Суперм’який), synchronized legacy compatibility state, live explanation and accessible value text.
- **DONE_VERIFIED — syllable trace:** compact responsive information grid replaces the previous space-inefficient left column.
- **DONE_VERIFIED — responsive/rendered review:** mainline rendered desktop/tablet/mobile workflow passed [43080701777](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080701777).
- **DONE_VERIFIED — regression/build:** main Tests [43080701766](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080701766) and Verify [43080701846](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080701846) passed.
- **DONE_VERIFIED — publication/live browser:** Pages [43080701733](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080701733) passed deployment, public HTTP smoke and live Playwright smoke. The live test selected Super-soft through the visible slider, verified the 100% grapheme fallback/candidate disclosure, checked Hanja conversion, result announcement, clipboard recovery, mobile trace labels and methodology navigation. Long adversarial passage: 1,443 Korean input characters, 2,982-character provisional inline candidate, 3,731-character IPA output.

### Failed smoke attempt and verified repair

The first post-#481 deployment passed HTTP checks but the live Playwright script timed out trying to click hidden compatibility checkbox `#super-soft-morphology`. The control had correctly been replaced by `#morphology-level`; only the smoke script was stale. The script was updated to set the visible range to level 2 and assert the accessible mode label. PR #482 checks passed (Tests [43080376963](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080376963), Verify [43080376742](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080376742), rendered review [43080376861](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080376861), master artifacts [43080377048](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43080377048)); the subsequent mainline live smoke passed as recorded above.

### Scope boundary

No linguistic engine, phonology, IPA adapter, Ukrainian mapping, research corpus, benchmark, licensing data or runtime dependency was changed. The interface is publicly deployed and visually/browser verified. The overall repository remains a research prototype; this UX acceptance does not close independent linguistic or research acceptance criteria.


## 2026-11-11 — follow-up acceptance: normal reading weight and editorial hero rebuild (PR #483)

**Status: DONE_VERIFIED — merged and deployed.** PR [#483](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/483) merged as `970fc828be500c2811108bde478241de0e791c16`.

### Findings closed

- **DONE_VERIFIED — Ukrainian output weight:** removed the explicit heavy font weight from the primary result field. Practical and research output now render at regular weight, including unconfirmed output.
- **DONE_VERIFIED — specimen glyph weight:** Hangul, IPA and Ukrainian header samples all render at regular weight; no semantic `strong` wrapper remains around the sample values.
- **DONE_VERIFIED — hero hierarchy:** both pages use full-width headline/copy above one continuous, visibly labelled specimen sequence; the desktop/tablet sequence is horizontal and the mobile sequence is vertical.
- **DONE_VERIFIED — textile restraint:** the oversized dark patchwork block is replaced by a compact, balanced shared-palette strip.
- **DONE_VERIFIED — copy:** service and methodology headings/intros now state the task and the transcription-not-translation distinction more directly.
- **DONE_VERIFIED — responsive review:** rendered review [43086326494](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086326494) passed.
- **DONE_VERIFIED — regression/build:** Tests [43086326226](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086326226), Verify [43086326448](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086326448), and Browser G2P [43086326247](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086326247) passed.
- **DONE_VERIFIED — publication/live smoke:** mainline deployment [43086918490](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43086918490) passed both public-page HTTP smoke and the live browser passage exercise.

### Regression note

An initial test run exposed one stale copy assertion that expected the old methodology introduction. The test was updated alongside the new copy. The final exact-head PR and mainline workflows passed. An intermediate failed run is not represented as a passing result.

No linguistic behavior changed. This closes the reported typography and header defects, not the repository's separate linguistic research acceptance gates.


## 2026-11-11 — restore the hero as an asymmetrical jogakbo textile collage

**Outcome: DONE_VERIFIED for the requested visual direction.** The previous specimen had regressed into three equal, contiguous columns. That read as one table with coloured cells, not Korean patchwork.

The correction replaces that layout with three overlapping, differently sized pieces. Each has its own polygon-cut silhouette, slight rotation, layered textile colour fields and inset dashed seam. The narrow decorative selvage is now staggered across two rows with unequal patch widths. On narrow screens, the pieces rearrange into an offset vertical sequence rather than becoming uniform cards. Existing semantic labels and the Hangul → IPA → Ukrainian example values remain intact.

**Evidence:** implementation snapshot `ffc77abe33ab65eebbf1c08b7fb20147225381a0`; test contract covers asymmetric spans, overlap, rotation, polygon cuts, stitches, and mobile reflow. Editorial visual review [43090011855](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43090011855) passed desktop, laptop, tablet, mobile and narrow-mobile on both pages. Rendered artifacts were manually inspected at desktop and mobile. Tests [43090011990](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43090011990) and Verify [43090011905](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43090011905) passed. The NIKL metadata-only inventory was skipped and is not counted as a pass.

**Scope:** CSS, stylesheet cache versions and the visual contract test only. No linguistic runtime, phonology, IPA or target mapping changed. Pages deployment [43090011820](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43090011820) was still running when this note was authored; publication must not be claimed until it completes.


## 2026-11-11 follow-up — palette unification and Ukrainian glyph rendering

- **PARTIAL → implementation prepared:** the original palette tokens were shared, but many interface surfaces still used unrelated hard-coded navy, electric indigo, acid yellow, pure white, and independent status fills. This made cards, controls, tables, callouts and trace objects feel like separate systems.
- The follow-up maps workbench, input, controls, results, empty states, trace rows, methodology callouts, tables and footer to shared surface, panel, jade, blue, ochre and clay roles. Semantic success/warning/error states remain distinct only where their meaning requires it.
- The signal, indigo and acid accents are muted to fit the jogakbo palette; the header collage remains the distinctive cultural signature rather than spreading patchwork across content.
- **Ukrainian glyph weight:** the output now explicitly uses a Cyrillic-capable text font stack, regular weight and disabled synthetic font styling. This avoids relying on Korean display-font fallback for Ukrainian-specific І/Ї.
- No engine, IPA, mapping, corpus or linguistic result logic changed.
- Acceptance: design-contract tests assert palette roles across all object families and explicit regular Cyrillic output styling. Exact-head CI and rendered visual review remain required before merge.


### Final verification — 2026-11-11

- **DONE_VERIFIED:** PR #484 merged by squash as `8d4a1d84888811e27bf0f0ac547173ca59588d9f`.
- Exact final PR-head `5b12bce2f4dbe18fef9b02fbb938ab3c9412d924`: browser regression tests, source redistribution rights gate, public-page build and generated-page verification all passed; Python regression/data-integrity job passed.
- Rendered desktop, laptop, tablet, mobile and narrow-mobile review passed at UI-code revision `701b5891feebfcbcf77e75f4d962ee5edb29b15f`. The only later change before merge was a test assertion update; no UI/CSS/HTML changed after the visual pass.
- **BLOCKED / skipped:** official NIKL metadata-only source inventory was skipped because credentials were not configured; unrelated to the visual change.
- No phonology, IPA, target mapping, corpus or engine behavior changed.


## 2026-11-11 corrective follow-up — unified paper surfaces and Ukrainian glyph rendering

**Status: DONE_VERIFIED on PR #485 implementation head `e5633cb04bc7e3d757527806acc0721a8a4a0fd9`; merge and live deployment follow separately.**

A fresh review of the actual main-branch CSS and browser output showed that the previous PR #484 completion statement was too broad: dark panel roles still governed major workbench/control/answer surfaces, and Ukrainian glyphs still depended on platform font fallback because no font asset was bundled. The earlier statement is superseded by the evidence below.

- Unified the workbench, input, controls, primary Ukrainian answer and methodology index on the existing warm paper palette; primary text uses ink/muted roles and semantic accent colours remain restrained.
- Bundled same-origin Noto Sans Regular WOFF2 with SIL OFL 1.1 and third-party notice.
- Added a fontTools cmap audit. All eight Ukrainian uppercase/lowercase letters І/Ї/Є/Ґ passed.
- Browser-computed Ukrainian font family is `Noto Sans Ukrainian`, weight `400`, `font-synthesis:none`; font face reports loaded.
- Playwright reviewed service and methodology pages at 1440/1024/768/390/320px. Surface colors, AA mode contrast, focus visibility, reduced motion, touch targets, and absence of page-level horizontal overflow passed; screenshots were manually inspected.
- Exact-head CI: Tests [43105710769](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710769), Verify [43105710859](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710859), visual review [43105710901](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710901), Browser G2P [43105710936](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710936), master artifacts [43105710890](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710890), exhaustive register [43105710680](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710680) — all PASS. The official NIKL metadata-only inventory was skipped by its credential gate and is not counted as a pass.
- No phonology, IPA, Ukrainian mapping, data or engine behavior changed.

**Next:** merge PR #485, then verify the public GitHub Pages deployment and live browser smoke.


### Post-merge publication verification

PR #485 was squash-merged to `main` as `e3fd592f373597dfbbabee7bddf12c11e88458da`. GitHub Pages deployment [43106616657](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43106616657) passed Python 3.11/3.12/3.13 tests, browser tests, static build, public HTTP smoke for both pages and JS asset, and live Playwright UX smoke. The published site is https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/. Live smoke included a 1,443-character Korean passage; the app correctly labelled the generated candidate as provisional/unconfirmed. The UI correction is published; overall linguistic release readiness remains outside this visual audit.


## Follow-up verification — 2026-11-12 — Ukrainian glyph weight

**Status: DONE_VERIFIED, merged and published in PR #486.**

A follow-up investigation addressed the user's report that individual Ukrainian vowels (especially І/Ї) still looked heavier than neighboring letters.

### Confirmed cause

The earlier typography correction bundled a Noto Sans Regular WOFF2 and applied it to the Ukrainian result and hero specimen only. The body stack still prioritized Noto Sans KR, and a later duplicate textarea rule restored the Korean-first stack after an earlier override. This left other Ukrainian interface text dependent on browser/platform fallback even though the result selector itself declared weight 400.

### Corrective implementation

- Prioritize the bundled `Noto Sans Ukrainian` face for body and input text; retain `Noto Sans KR` as the next fallback for Hangul.
- Correct the later textarea rule so it cannot undo the font-stack change.
- Preserve explicit regular weight 400 and `font-synthesis:none` for the Ukrainian result/specimen.
- Bump the editorial stylesheet query version on both public pages.
- Expand the font cmap audit from eight special letters to the complete uppercase/lowercase Ukrainian alphabet and assert OS/2 weight class 400.
- Extend the browser review to inspect computed body/input font stacks and capture a dedicated specimen containing all Ukrainian vowels.

### Verification evidence

- Exact-head CI at `422806d0ef4801ef22237f6227f1c3361d747b25`: tests [43181728153](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728153), Browser G2P [43181728264](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728264), editorial visual review [43181728148](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728148), Verify [43181728180](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728180), master artifacts [43181728386](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728386), exhaustive register [43181728399](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181728399), and push Verify [43181718918](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43181718918) all passed.
- `npm test`: 1,461 passed, 0 failed. `npm run build`: passed.
- Python 3.11/3.12/3.13, wheel-install, teacher-corpus audit, font cmap audit and Playwright desktop/laptop/tablet/mobile/narrow-mobile review all passed.
- The visual artifact includes a rendered all-vowel specimen; the browser's computed body and input font stacks both begin with the bundled Ukrainian face.

No phonology, IPA, Ukrainian mapping, data or engine behavior changed.

### Post-merge publication verification

- **PR:** [#486](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/486), squash-merged.
- **Main commit:** `f9c862319765d0c0265f2c31a9d3e12312397d57`.
- **GitHub Pages deployment:** [43182394417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43182394417) — SUCCESS.
- **Deployment checks:** Python 3.11/3.12/3.13, browser tests, static build, both public pages and JS asset HTTP smoke, and live Playwright smoke all passed.
- **Published URL:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/.

The typography correction is published; no outstanding action remains for this issue.


## Visual mode review continuation — 2026-11-12

**Status: PARTIAL — existing research-mode screenshots visually inspected; complete mode-state matrix added and awaiting exact-head CI evidence.**

### Evidence inspected

- Downloaded the latest main Editorial visual review artifact from run [43182787204](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43182787204), generated from commit c9d10b8e9c6d4d5d22d00ee2036709002bd13ac1.
- Opened and visually inspected the service screenshots at 1440 px, 390 px and 320 px. They showed the research mode selected at the Soft level.
- The input and result workspaces remain vertically ordered; the Jogakbo header remains a collage rather than a three-cell table; the result hierarchy is preserved; the visible slider and selected research option remain within the page at narrow widths.
- No obvious clipping or horizontal layout break was visible in those three screenshots. This is a visual inspection of the captured Soft research state, not proof that all mode states or all accessibility criteria pass.
- **Confirmed design issue:** the research-mode option repeated implementation detail already available in its disclosure, while the static paragraph beneath the slider repeated information that the live level-specific guidance already communicates. This made the mode panel unnecessarily dense, particularly at 320–390 px.

### Implemented on branch fix/visual-mode-review-matrix-2026-11-12

- Shortened the research-mode choice to its user goal: checking rules, uncertainty and alternative readings.
- Kept the detailed engine distinction and provenance in the existing disclosure.
- Replaced the redundant static slider paragraph with one short methodology link. The dynamic Strict / Soft / Super-soft guidance remains the single level-specific explanation.
- Expanded scripts/capture-editorial-review.mjs to capture the practical mode and all three research slider levels at each of the five existing viewports (1440, 1024, 768, 390 and 320 px).
- Added runtime assertions that practical mode is selected by default with research controls hidden, and that selecting research reveals the slider.
- Added design-contract tests for the new visual coverage and concise research-mode copy.

### Task ledger

| Work item | Status | Acceptance |
|---|---|---|
| Inspect existing 1440 / 390 / 320 px research Soft screenshots | DONE_VERIFIED | Artifact from run 43182787204 opened and visually reviewed |
| Simplify duplicated research-mode copy | DONE_VERIFIED (source change) | Concise mode choice; engine detail remains in disclosure; live slider guidance retained |
| Capture practical mode at five widths | PARTIAL | New Playwright screenshot capture awaits exact-head CI |
| Capture Strict / Soft / Super-soft at five widths | PARTIAL | New Playwright screenshot capture awaits exact-head CI |
| Verify mode switching and hidden/visible controls | PARTIAL | Runtime assertions added; awaiting CI |
| Screen-reader speech, manual keyboard-only review and human comprehension | BLOCKED | Requires assistive-technology/manual evaluation; source tests cannot establish this |
| Measure conversion latency at short / 1,000 / 5,198 characters | TODO | Requires measured browser timing on representative desktop and mobile devices |

No phonological rules, IPA behavior, target mapping, corpus, or engine code changed. The overall audit remains PARTIAL until exact-head visual CI and the independent accessibility/performance checks are addressed.


## Final verification — 2026-11-12 — PR #487

**Visual mode matrix: DONE_VERIFIED on exact PR head af3559ea5004818440a8db4d08ef104ff075cd85. Overall UX/UI audit remains PARTIAL for the separate manual accessibility and performance gates below.**

- Exact-head Editorial visual review [43185725842](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725842): **SUCCESS**. Artifact [13928367250](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725842) contains 31 images: 5 practical-mode screenshots, 15 research-level screenshots (Strict / Soft / Super-soft × five widths), 5 methodology screenshots and the Ukrainian vowel specimen.
- The final artifact was downloaded and checked. The narrow-mobile Super-soft screenshot was opened; desktop practical, Strict and Soft, mobile Super-soft, and narrow-mobile practical/Soft states were also visually inspected in the preceding identical-code artifact. The selected state is visually distinguishable; the slider and dynamic explanation remain legible within the stacked mobile layout; no horizontal overflow/clipping was observed in the inspected screenshots.
- Browser runtime assertions passed: practical mode is the default and hides research controls; selecting research reveals the slider; all three level labels, aria-valuetext values and dynamic guidance remain synchronized.
- Tests [43185725590](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725590): **SUCCESS — 1,463 passed, 0 failed**; npm production build passed.
- System Verify [43185725646](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725646): **SUCCESS** — Python regression/data-integrity and browser regression/build passed. Python 3.11 / 3.12 / 3.13, clean wheel-install and teacher-corpus audit passed. NIKL metadata-only inventory was **SKIPPED** by configured policy, not counted as a pass.
- Browser G2P integration [43185725859](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725859): **SUCCESS**.
- Master/research artifacts [43185725742](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725742): **SUCCESS**. Exhaustive test-case register [43185725675](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43185725675): **SUCCESS**.
- Two intermediate exact-head test runs exposed stale copy assertions in tests/kozak-kim-methodology-contract.test.mjs and tests/web-ui-contract.test.mjs. Those assertions were updated to match the retained engine disclosure and its grammatical wording; the final exact-head test run above is fully green.

### Final task ledger

| Work item | Status | Evidence / remaining acceptance |
|---|---|---|
| Inspect practical mode at five responsive widths | DONE_VERIFIED | 5 screenshots; runtime default/hidden-control assertion |
| Inspect Strict / Soft / Super-soft at five widths | DONE_VERIFIED | 15 screenshots; synchronized visible and accessible slider labels |
| Responsive layout, selected states, no clipping in inspected states | DONE_VERIFIED | Editorial Playwright checks + manual screenshot inspection |
| Simplify duplicate research-mode explanation | DONE_VERIFIED | Short user-goal description; provenance retained in disclosure; one methodology link replaces repeated paragraph |
| Screen-reader speech / verbosity | BLOCKED | Requires manual evaluation with an actual screen reader |
| Manual keyboard-only and browser-zoom evaluation | TODO | Requires a human/manual browser pass |
| First-time user comprehension of mode labels | TODO | Requires short usability check with representative users |
| Conversion latency at short / 1,000 / 5,198 characters on desktop/mobile | TODO | Requires measured browser timing; no performance threshold inferred |

No phonology, IPA, Ukrainian mapping, engine behavior or linguistic data changed. This verifies the visual mode workstream, not the system's independent linguistic research gates.


## Publication record — PR #487 — 2026-11-12

- **Merged:** PR [#487](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/487), squash merge.
- **Merge commit:** 6a301a54b3d8cf7a32f2b79397a1ed28cecfe0ae.
- **GitHub Pages deployment:** [43186479309](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43186479309) — SUCCESS.
- **Public URL:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- **HTTP smoke:** PASS for index.html, system.html and the first JavaScript asset.
- **Live Playwright smoke:** PASS — deterministic Hanja dictionary chunk/output, live result announcement, mode disclosure, clipboard-denial fallback, mobile trace labels at 390 px and methodology navigation. The adversarial passage exercised 1,443 Korean input characters, a 2,982-character inline candidate and 3,731-character IPA result; the service correctly labeled it as a preliminary candidate, not an independently validated result.
- **Scope:** this publication contains the mode-copy simplification and visual QA coverage only; no phonology, IPA or Ukrainian mapping behavior changed.

The visual mode matrix remains DONE_VERIFIED. The broader UX/UI audit remains PARTIAL for manual assistive-technology/keyboard evaluation, user comprehension testing and measured conversion latency.


## 2026-11-12 — hero specimen accessibility semantics and contrast review

**Scoped outcome: DONE_VERIFIED for the specimen's named-group semantics; PARTIAL for the wider accessibility audit.**

The live automated audit had reported an incomplete aria-prohibited-attr result for .specimen-flow, which carried aria-label on a plain div. The element represents one coherent three-stage example (Hangul → IPA → Ukrainian adaptation), so the repair is a named group, not removal of the useful label.

- PR [#488](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/488) merged as cde68ce0a0184e81683cb93257816b0b2c8baf84.
- .specimen-flow now has role=group alongside its existing Ukrainian aria-label; visible layout and content are unchanged.
- A UI contract test requires the named group so the semantic repair cannot silently regress.
- Exact-head tests [43217403313](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43217403313), System Verify [43217404060](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43217404060), Browser G2P [43217404155](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43217404155), and rendered desktop/tablet/mobile review [43217403277](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43217403277) all passed on implementation head bb124fa0720e50c526850d7e886d7c9cc8288c28. Python 3.11/3.12/3.13, wheel-install and teacher-corpus jobs passed. Metadata-only NIKL inventory was skipped by workflow policy, not counted as passed.
- The three decorative card gradients were checked from actual CSS token colours against foreground #17202c: jade #9db7a7 7.63:1; paper #efede6 14.01:1; blue #a9bac6 8.23:1; ochre #c9a66b 7.15:1; clay #b9857a 5.24:1. All sampled stops exceed WCAG AA's 4.5:1 normal-text threshold. No palette change was warranted by the earlier incomplete automated result.
- A fresh live axe rerun was not completed because the connected browser-audit service exhausted its available credits. This static contrast calculation is not represented as a replacement axe run, and the prior incomplete axe result is not retroactively called passed.

**Remaining gates:** actual NVDA/VoiceOver speech and verbosity; manual keyboard-only and browser-zoom/reflow review; mode-label comprehension with representative users; and measured conversion latency. Overall UX/UI audit remains **PARTIAL**.


## 2026-11-12 — hero specimen layout and shared typography/focus repair — PR #489

**Scoped implementation: DONE_VERIFIED. Wider UX/UI audit remains PARTIAL.**

The user-provided screenshots showed the three Hangul / IPA / Ukrainian specimen patches physically colliding and hiding the third label and parts of the content. The cause was an absolutely/overlapping collage composition with content laid over the same visual area. Rebuilt only the specimen composition as three asymmetrical, separately tracked jogakbo patches with responsive desktop/tablet/mobile layouts; retained the existing palette and textile character.

- PR [#489](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/489) merged by squash as `a76ad09b29f5607e6ee6a504bacc9aabb98c7d57`.
- The three patches now occupy independent grid tracks at desktop/tablet and a vertical three-patch sequence on narrow mobile. Text wraps inside each patch instead of being positioned across overlapping areas.
- Updated the shared base stylesheet to prefer the bundled Noto Sans Ukrainian font on all page surfaces and align the base keyboard-focus token with the editorial indigo token. Refreshed both pages' stylesheet cache keys.
- Added a rendered geometry regression assertion: exactly three specimen patches, no pairwise patch overlap, and every specimen label/value remains inside its own patch.
- Exact-head CI on implementation head `e52f50747c28a3cab9f7c094104e47d1215828af`: Editorial visual review [43223002702](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002702) **SUCCESS**; tests [43223002480](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002480) **SUCCESS**; System Verify [43223002239](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002239) **SUCCESS**; Browser G2P [43223002388](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002388) **SUCCESS**; master/research artifacts [43223002455](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002455) **SUCCESS**; exhaustive test register [43223002368](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43223002368) **SUCCESS**. Python 3.11/3.12/3.13, wheel installation, teacher-corpus audit, browser regression/build all passed. Metadata-only NIKL inventory was skipped by policy, not counted as a pass.
- The additional geometry assertion passed in the rendered review across the existing desktop, laptop, tablet, mobile and narrow-mobile viewports. No horizontal overflow or text escaping the patch rectangles was reported by the final run.
- No pronunciation, phonology, IPA, Ukrainian mapping, engine or linguistic dataset was changed.

**Remaining independent UX gates:** actual NVDA/VoiceOver speech and verbosity; manual keyboard-only and browser-zoom/reflow review; user comprehension testing; and measured conversion latency. The broad UX/UI audit therefore remains **PARTIAL**. Main-branch deployment and public live smoke are tracked separately in the handoff.


## 2026-11-12 — radio-control inset spacing — PR #490

**Scoped visual defect: DONE_VERIFIED.**

The user's follow-up screenshot review identified that circular processing-mode radio controls visually touched the selected row's left inset accent stripe. The previous horizontal padding was only 2px, placing the radio almost on top of the stripe.

- Changed `.editorial-site .mode-option` horizontal padding from `2px` to `18px` on the left and `14px` on the right (vertical padding remains 14px). Radio controls now sit clearly inside the row rather than on its boundary.
- Added a web UI contract regression assertion for the exact inset.
- [PR #490](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/490) merged; merge commit `f710557a1b4465cc29dc9f5bb5eb5ec9b36f7e05`.
- Implementation head `d8461f9a16448759576b4a00a73ab940a79ec76f`: [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43226503874) SUCCESS; [exhaustive test register](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43226503778) SUCCESS; [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43226503757) SUCCESS; [editorial visual review](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43226503704) SUCCESS; [master/research artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43226504092) SUCCESS. Python 3.11/3.12/3.13, wheel install, browser tests, build and rendered responsive review passed. NIKL metadata inventory was skipped per policy.
- No mode logic, semantics, palette, typography, or linguistic pipeline was changed.
- Main-branch deployment after merge is tracked separately; do not claim publication until the main Pages workflow and public smoke finish.

The wider UX/UI audit remains PARTIAL for the unrelated manual screen-reader, keyboard/zoom, user-comprehension and performance gates.


## 2026-11-12 — follow-up: mode radio controls redesigned as inset cards (PR pending)

- **Finding:** PR #490 increased label padding, but the mode choices still used a shared fieldset surface, top-only row separators, and a selected-state inset left stripe. The native circular radio remained visually crowded against those row boundaries; padding alone did not remove the visual collision.
- **Change in progress:** each mode choice is now a distinct rounded card with a complete outline and a dedicated 32px control gutter. The radio is centered in that gutter and uses a clearly bounded circular control with a separate selected dot. The selected card uses a full ochre outline and warm tint; the old left-edge stripe and shared top-border treatment are removed. Native radio semantics, labels, keyboard selection, and mode logic are retained.
- **Regression guard:** web UI contract now asserts the card boundary, dedicated radio gutter, custom checked state, and absence of the previous stripe treatment.
- **Status:** implementation branch `fix/mode-radio-card-layout-2026-11-12`; pending exact-head CI, rendered screenshots and deployed Pages verification. Do not claim publication until those gates pass.
- No linguistic, engine, IPA, Ukrainian mapping, or mode-selection behavior changed.


## 2026-11-12 — provenance/status placement — PR pending

- **Finding:** the single long status line combined two different stages: source-language pronunciation provenance (engine + contextual/lexical status) and the confidence status of the Ukrainian target candidate. It was rendered under the Ukrainian result, visually reading as an unrelated extra panel and assigning source-pronunciation metadata to the wrong result.
- **Change:** moved the compact engine/pronunciation provenance line into the IPA card, directly below the IPA value. The Ukrainian target-status note remains attached immediately below the Ukrainian result. It distinguishes an available provisional candidate from a selected one, and separately identifies model-selected/unavailable target states. The IPA provenance line retains low-confidence fallback coverage detail. Coverage detail remains with the engine provenance. The status is a restrained inline note, not a new card or floating notice.
- **Regression guard:** added a web UI contract test asserting that pronunciation provenance is inside the IPA panel, absent from the Ukrainian panel, and that the provisional-candidate warning remains attached to candidate output.
- **Status:** implementation branch `fix/provenance-status-placement-2026-11-12`; pending exact-head CI, responsive rendered review, merge and Pages publication.
- No engine, phonological rule, IPA, Ukrainian mapping, candidate selection or linguistic data changed.


### Verification update — PR #492 head 4e85bf434cf06dfb19f92ce0be218f354edf9dce

- Exact-head CI passed: 1,465 Node tests (0 failures); Python regression/data integrity and wheel-install jobs passed on Python 3.11, 3.12 and 3.13; browser regression/build passed; browser G2P integration passed; corpus artifact generation and exhaustive register extraction passed.
- Editorial visual review passed 10 page/viewport combinations, including service and methodology pages at desktop, laptop, tablet, mobile (390 px), and narrow mobile (320 px). The main service checks confirm the target-status note is inside the Ukrainian result card and pronunciation provenance is inside the IPA card; result grid remains five result cards.
- NIKL metadata-only inventory was skipped by repository policy; no claim is made that it ran.
- **Current disposition:** implementation is verified and PR #492 is ready for review; not merged. Public Pages deployment has not been triggered by this PR.
