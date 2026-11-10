# Gates: Korean editorial workbench redesign

OWNS: index.html, system.html, DESIGN.md, src/styles/editorial.css, tests/korean-editorial-design-contract.test.mjs, docs/superpowers/**

Scope: replace the site's generic visual system with a Korean editorial workbench while preserving the current transcription product interfaces and evidence semantics.

- [x] G1: exact final branch tests and verification pass
  EVIDENCE: head `95879b0de79092c25c43d8382fed8bdb072121de`; Tests [42892418808](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418808) (1,439/1,439); Verify [42892418528](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418528); Browser G2P [42892418716](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418716); master artifacts [42892418801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418801); exhaustive register [42892418475](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418475).

- [ ] G2: public Pages deployment and live smoke pass on the merged main commit
  EVIDENCE: pending

- [x] G3: desktop and mobile rendered pages are reviewed for clipping, hierarchy, focus and reading measure
  EVIDENCE: [Editorial visual review 42892418633](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418633), artifact `13798249164`: 10 screenshots across both pages at 1440, 1024, 768, 390 and 320 px; no horizontal overflow; keyboard focus, reduced motion and touch-target checks passed.

- [x] G4: all existing conversion modes, controls, outputs, copy, trace and methodology navigation remain intact
  EVIDENCE: 1,439-test suite and browser regression pass on exact head `95879b0de79092c25c43d8382fed8bdb072121de`; no JS/engine files changed.

- [x] G5: visual research sources, design tokens and implementation constraints are documented
  EVIDENCE: DESIGN.md, design brief and six linked research references committed on the branch.

## Environment note

The current execution environment cannot resolve github.com for a local clone, so local npm/Playwright and the unlazy gate-check binary cannot be run here. Use exact-head GitHub Actions as the executable test oracle and the rendered production-preview screenshots captured in CI as the visual-review oracle. Do not record local test execution.
