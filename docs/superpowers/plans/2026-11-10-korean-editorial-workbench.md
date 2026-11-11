# Implementation plan — Korean editorial workbench

Spec: `docs/superpowers/specs/2026-11-10-korean-editorial-workbench-design.md`
Base: `37c922935b30ca5f46a4f5d37bd5e435f3c28cb6`
Branch: `design/korean-editorial-workbench-2026-11-10`

## Task 1 — protect the intended visual contract
- Extend `tests/web-ui-contract.test.mjs` with source assertions for the new masthead/specimen/workbench structure, Korean editorial tokens, semantic typography, no gradients, no motion-heavy scroll effects, and preserved accessibility.
- Run the focused test on the branch and confirm it fails because the new identity is not yet present.

## Task 2 — redesign the service surface
- Update `index.html` masthead, hero copy/specimen and structural landmarks without changing IDs consumed by `src/main.js` or any controls.
- Replace the current generic hero/card palette with a compact, asymmetric jogakbo-inspired workbench system in the dedicated `src/styles/editorial.css` theme.
- Preserve the source input, all buttons, mode radios/toggles, output panel IDs, copy buttons, candidate switch, trace details and footer links.

## Task 3 — redesign the methodology surface
- Apply the same masthead and hero system to `system.html`.
- Restyle methodology contents, long-form sections, tables, callouts, code, source links and status labels for a comfortable reading rhythm.

## Task 4 — verify and document
- Run `npm test`, `npm run audit:source-rights`, and `npm run build` through exact-head GitHub Actions because the current environment cannot resolve github.com for a local clone.
- Inspect the rendered Pages deployment and browser smoke evidence; do not claim visual QA without screenshots or equivalent browser evidence.
- Update the existing master handoff / audit in place with branch, base/head, scope, exact CI evidence and any remaining visual QA limitation.
- Merge only after exact-head CI and rendered desktop/mobile review; verify the public Pages deployment and smoke test. Do not publish a release.

## Review focus
- Does the design look Korean-modern without relying on clichés or random Hangul decoration?
- Are all current UI IDs, input behaviors, modes, candidate states, trace controls and links preserved?
- Is the methodology readable at mobile widths?
- Are focus, reduced motion, contrast and long Korean passages handled?


## Execution record — 2026-11-11

- **Task 1 — DONE_VERIFIED.** The visual contract was written before implementation. The localization contract was observed failing on [run 42972079016](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972079016), then the visible terms were localized and the old methodology assertion updated.
- **Task 2 — DONE_VERIFIED.** The service page now has the shared masthead, real Hangul → IPA → Ukrainian specimen and asymmetric workbench. Existing conversion controls and IDs remain intact.
- **Task 3 — DONE_VERIFIED.** The methodology page uses the same visual system with a long-form reading measure, contents index, numbered sections, readable tables and responsive behavior.
- **Task 4 — DONE_VERIFIED.** Exact pre-merge head `03d01929c69d7a1f33b61bd73cce8399827f42d7`: Tests [42973176920](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176920) pass 1,440/1,440; Verify [42973176929](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176929), Browser G2P [42973176957](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176957), master/research artifacts [42973177011](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973177011), exhaustive register [42973176965](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176965), and rendered visual review [42973177099](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973177099) all pass.
- **Task 5 — DONE_VERIFIED.** PR #467 merged as `a8049db0a26dbe5db5dd599e2b7cff7e8b0ab3fc`. Pages deployment and public smoke [42973501632](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973501632) pass, including a live browser exercise of the 1,443-character adversarial Korean passage.

### Final status

- Branch: `design/korean-editorial-workbench-2026-11-10`
- Pre-merge verified head: `03d01929c69d7a1f33b61bd73cce8399827f42d7`
- Merge commit: `a8049db0a26dbe5db5dd599e2b7cff7e8b0ab3fc`
- PR: [#467](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/467), merged.
- Public site: https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- Browser tests: 1,440/1,440 PASS; Python 3.11 / 3.12 / 3.13, wheel install and teacher-corpus audit PASS.
- Browser G2P, master/research artifacts, exhaustive register and responsive visual review: PASS.
- Pages deployment, public-page smoke and live practical-mode browser smoke: PASS.
- NIKL metadata-only inventory: SKIPPED by configured policy; not represented as a pass.
- Local clone and local npm execution were unavailable. No local test run is claimed; CI is the test oracle.
- **Next genuine blocker for the broader product, not this design:** independently adjudicated Korean IPA and Ukrainian target gold data; the redesign itself is complete and published.
