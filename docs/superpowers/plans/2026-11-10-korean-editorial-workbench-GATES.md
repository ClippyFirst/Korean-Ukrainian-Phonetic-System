# Gates: Korean editorial workbench redesign

OWNS: index.html, system.html, DESIGN.md, src/styles/editorial.css, tests/korean-editorial-design-contract.test.mjs, tests/kozak-kim-methodology-contract.test.mjs, docs/superpowers/**

Scope: replace the site's generic visual system with a Korean editorial workbench while preserving the current transcription product interfaces and evidence semantics.

- [x] G1: exact branch tests and verification pass
  EVIDENCE: pre-merge head `03d01929c69d7a1f33b61bd73cce8399827f42d7`; Tests [42973176920](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176920) (1,440/1,440); Verify [42973176929](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176929); Browser G2P [42973176957](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176957); master/research artifacts [42973177011](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973177011); exhaustive register [42973176965](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176965).

- [x] G2: public Pages deployment and live smoke pass on the merged main commit
  EVIDENCE: merge commit `a8049db0a26dbe5db5dd599e2b7cff7e8b0ab3fc`; Pages run [42973501632](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973501632) **PASS**, including deploy, public-page smoke and adversarial live browser smoke.

- [x] G3: desktop, tablet and mobile rendered pages are reviewed for clipping, hierarchy, focus and reading measure
  EVIDENCE: [Editorial visual review 42973177099](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973177099), artifact `13834655772`: ten screenshots across both pages at 1440, 1024, 768, 390 and 320 px; no horizontal overflow; keyboard focus, reduced motion and touch-target checks passed.

- [x] G4: all existing conversion modes, controls, outputs, copy, trace and methodology navigation remain intact
  EVIDENCE: 1,440-test browser suite; live adversarial smoke passed with 1,443 Korean input characters and expected candidate/IPA output. No JavaScript or engine files changed.

- [x] G5: visual research sources, design tokens, skill methodology and implementation constraints are documented
  EVIDENCE: `DESIGN.md`, design brief, implementation plan and eight linked skill repositories; six linked research references and documented cultural interpretation boundaries.

## Environment note

Local clone, local npm/Playwright and the unlazy gate-check binary were unavailable in this connector-only runtime. Exact-head GitHub Actions are the executable test oracle and the rendered production-preview screenshots captured in CI are the visual-review oracle. No local test execution is claimed.

**All design gates met.** The remaining linguistic gold-data and independent reviewer requirements are outside this design task.

- [x] G6: methodology page explains the Korean visual concept in Ukrainian without generic callout chrome
  EVIDENCE: PR #468 merged as 2d56d5a5d4ccdabc53b503bea5891c4f14c3ac47; visual review [42976476724](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476724) PASS; screenshot artifact 13835153662.

- [x] G7: input remains visually empty and fixed-size editorial text is at least 13px
  EVIDENCE: contract tests 213 and 214 in [42976476837](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476837) PASS; mainline rerun [42976784058](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976784058) PASS, 1,444/1,444.

- [x] G8: merged main is deployed and live smoke-tested
  EVIDENCE: main commit 2d56d5a5d4ccdabc53b503bea5891c4f14c3ac47; Pages run [42976783914](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976783914) PASS, including deploy, public-page smoke and live practical-mode adversarial browser smoke.

**Follow-up status: DONE_VERIFIED.** NIKL metadata-only inventory remains SKIPPED by configured policy; linguistic gold-data review remains outside the design gate.
