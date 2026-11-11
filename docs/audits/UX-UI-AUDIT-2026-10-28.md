# UX/UI audit — 2026-10-28

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


**Contrast and focus contract follow-up — 2026-11-11:** darkened the small signal-red index colour to `#AD3426` (5.44:1 against `#EF EDE6`); updated the rendered-review focus assertion to match the new cobalt token `#254BD8`. Exact-head visual review must pass before this redesign is marked DONE_VERIFIED.


**Exact-head correction note — 2026-11-11:** the initial visual review exposed a stale global focus-colour expectation; the dark workbench correctly uses high-contrast acid-yellow focus while light reading surfaces use cobalt. The review now checks the active element's context. The initial Verify run exposed six stale assertions for the retired jogakbo design; `tests/korean-editorial-design-contract.test.mjs` now tests the replacement identity and contrast ratios. Rerun both gates before acceptance.


**Rendered focus assertion implementation:** the first edit did not replace the old check in `capture-editorial-review.mjs`; this was identified by reading the committed file and the second failed run log. The script is now rewritten by exact source-block boundaries, and a test asserts both context detection and expected token selection. Do not mark this gate complete until a fresh rendered review passes.
