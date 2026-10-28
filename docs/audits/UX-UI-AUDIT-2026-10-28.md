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
