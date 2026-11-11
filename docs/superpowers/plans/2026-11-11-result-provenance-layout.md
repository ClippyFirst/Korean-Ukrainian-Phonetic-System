# Result provenance layout implementation plan

> **For agentic workers:** Use the existing repository workflow and verify the final branch head before handoff.

**Goal:** Keep engine/mode provenance attached to the primary Ukrainian result instead of letting it distort the supporting-result grid.

**Architecture:** Preserve the existing static HTML and CSS architecture. Nest the existing live-updated `#status-note` inside `#panel-ukrainian`, style it as quiet inline provenance, and extend the existing source-contract and Playwright visual-review checks. Do not change conversion logic.

**Tech Stack:** HTML, CSS, Node.js test runner, Playwright, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-10-korean-editorial-workbench-design.md`

## Global Constraints

- Only the Korean input and answer windows stack vertically.
- The hero, three-part specimen, supporting result grid and methodology retain their editorial compositions.
- No object-level heading/footer strips, visible textarea placeholder, remote font dependency or runtime dependency.
- The Ukrainian result remains primary; IPA, Romanization, Hanja and analysis remain supporting outputs.
- No pronunciation, IPA, target-adaptation or corpus behavior changes.

## Review Focus

- Long provenance text wraps without creating horizontal overflow.
- Strict, Soft and Super-soft mode/status updates remain visible in the primary result.
- The supporting result grid contains only its five result cards.
- Mobile layout keeps provenance with the Ukrainian result and does not reorder input/output.
- Keyboard focus, reduced motion and 44px touch targets remain unchanged.

## Tasks

### Task 1: Pin the result ownership contract

- [x] Add `the result provenance note belongs to the Ukrainian output, not the result grid` to `tests/korean-editorial-design-contract.test.mjs`.
- [x] Observe the expected failure against the original sibling placement (Verify run 42995360086).

### Task 2: Correct markup and presentation

- [x] Move `#status-note` inside `#panel-ukrainian`.
- [x] Add a neutral `.result-provenance` treatment with no background, border or padded badge surface.
- [x] Preserve the existing DOM id so `src/main.js` continues updating the same live status element.

### Task 3: Verify rendered layout and reconcile documentation

- [x] Extend the Playwright visual review to assert provenance ownership and exactly five supporting result cards.
- [x] Run exact-branch Verify, Tests, Browser G2P, test-register extraction, master/research artifacts and rendered review at 1440, 1024, 768, 390 and 320 px.
- [x] Update the UX audit and master handoff with exact run IDs and remaining evidence limits; PR #479 is ready to merge.


## Final outcome

- [x] PR [#479](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/479) merged to main as `da33e2279bfe7218c1ad4c4632dfb44d18f3f3bf`.
- [x] Post-merge main Tests [42997176514](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176514), Verify [42997176635](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176635), master/research artifacts [42997176540](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176540) passed.
- [x] GitHub Pages deployment and public HTTP/live browser smoke [42997176343](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42997176343) passed.
- [x] The public service is updated; no pronunciation or target-adaptation code was changed.
