# Gates: Korean editorial workbench redesign

OWNS: index.html, system.html, DESIGN.md, src/styles/editorial.css, tests/korean-editorial-design-contract.test.mjs, docs/superpowers/**

Scope: replace the site's generic visual system with a Korean editorial workbench while preserving the current transcription product interfaces and evidence semantics.

- [ ] G1: exact final branch tests and verification pass
  EVIDENCE: pending

- [ ] G2: public Pages deployment and live smoke pass on the merged main commit
  EVIDENCE: pending

- [ ] G3: desktop and mobile rendered pages are reviewed for clipping, hierarchy, focus and reading measure
  EVIDENCE: pending

- [ ] G4: all existing conversion modes, controls, outputs, copy, trace and methodology navigation remain intact
  EVIDENCE: pending

- [ ] G5: visual research sources, design tokens and implementation constraints are documented
  EVIDENCE: pending

## Environment note

The current execution environment cannot resolve github.com for a local clone, so local npm/Playwright and the unlazy gate-check binary cannot be run here. Use exact-head GitHub Actions as the executable test oracle and the live rendered Pages screenshots as the visual-review oracle. Do not record local test execution.
