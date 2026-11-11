# Gates: Korean editorial workbench redesign

OWNS: index.html, system.html, DESIGN.md, src/styles/editorial.css, tests/korean-editorial-design-contract.test.mjs, tests/kozak-kim-methodology-contract.test.mjs, docs/superpowers/**

Scope: replace the site's generic visual system with a Korean editorial workbench while preserving the current transcription product interfaces and evidence semantics.

- [x] G1: exact final branch tests and verification pass
  EVIDENCE: final head `d05532de309f0f2b05b4070f78d9fb208d31d849`; Tests [42972715679](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715679) (1,440/1,440); Verify [42972715622](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715622); Browser G2P [42972715624](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715624); master/research artifacts [42972715743](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715743); exhaustive register [42972715683](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715683).

- [ ] G2: public Pages deployment and live smoke pass on the merged main commit
  EVIDENCE: pending merge and deployment.

- [x] G3: desktop, tablet and mobile rendered pages are reviewed for clipping, hierarchy, focus and reading measure
  EVIDENCE: [Editorial visual review 42972715626](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715626), artifact `13833967108`: ten screenshots across both pages at 1440, 1024, 768, 390 and 320 px; no horizontal overflow; keyboard focus, reduced motion and touch-target checks passed.

- [x] G4: all existing conversion modes, controls, outputs, copy, trace and methodology navigation remain intact
  EVIDENCE: 1,440-test browser suite on exact head; no JavaScript or engine files changed. User-facing terminology localization has its own regression contract.

- [x] G5: visual research sources, design tokens, skill methodology and implementation constraints are documented
  EVIDENCE: `DESIGN.md`, design brief, implementation plan and eight linked skill repositories; six linked research references and documented cultural interpretation boundaries.

## Environment note

Local clone, local npm/Playwright and the unlazy gate-check binary were unavailable in this connector-only runtime. Exact-head GitHub Actions are the executable test oracle and the rendered production-preview screenshots captured in CI are the visual-review oracle. No local test execution is claimed.
