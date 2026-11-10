# Gates: Korean editorial workbench redesign

OWNS: index.html, system.html, DESIGN.md, src/styles/editorial.css, tests/korean-editorial-design-contract.test.mjs, docs/superpowers/**

Scope: replace the site's generic visual system with a Korean editorial workbench while preserving the current transcription product interfaces and evidence semantics.

- [x] G1: exact final branch tests and verification pass
  EVIDENCE: head `3fc2ee41b7f982797d26c762920f52e08206f5a2`; Tests [42889644345](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42889644345) (1,438/1,438); Verify [42889644180](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42889644180); Browser G2P [42889644391](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42889644391); master artifacts [42889644182](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42889644182); exhaustive register [42889644340](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42889644340).

- [ ] G2: public Pages deployment and live smoke pass on the merged main commit
  EVIDENCE: pending

- [x] G3: desktop and mobile rendered pages are reviewed for clipping, hierarchy, focus and reading measure
  EVIDENCE: [Editorial visual review 42889644373](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42889644373), artifact `13798006977`: 10 screenshots across both pages at 1440, 1024, 768, 390 and 320 px; no horizontal overflow; keyboard focus, reduced motion and touch-target checks passed.

- [x] G4: all existing conversion modes, controls, outputs, copy, trace and methodology navigation remain intact
  EVIDENCE: 1,438-test suite and browser regression pass on exact head `3fc2ee41b7f982797d26c762920f52e08206f5a2`; no JS/engine files changed.

- [x] G5: visual research sources, design tokens and implementation constraints are documented
  EVIDENCE: DESIGN.md, design brief and six linked research references committed on the branch.

## Environment note

The current execution environment cannot resolve github.com for a local clone, so local npm/Playwright and the unlazy gate-check binary cannot be run here. Use exact-head GitHub Actions as the executable test oracle and the live rendered Pages screenshots as the visual-review oracle. Do not record local test execution.
