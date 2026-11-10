# Implementation plan — Korean editorial workbench

Spec: `docs/superpowers/specs/2026-11-10-korean-editorial-workbench-design.md`
Base: `37c922935b30ca5f46a4f5d37bd5e435f3c28cb6`
Branch: `design/korean-editorial-workbench-2026-11-10`

## Task 1 — protect the intended visual contract
- Extend `tests/web-ui-contract.test.mjs` with source assertions for the new masthead/specimen/workbench structure, Korean editorial tokens, semantic typography, no gradients, no motion-heavy scroll effects, and preserved accessibility.
- Run the focused test on the branch and confirm it fails because the new identity is not yet present.

## Task 2 — redesign the service surface
- Update `index.html` masthead, hero copy/specimen and structural landmarks without changing IDs consumed by `src/main.js` or any controls.
- Replace the current generic hero/card palette with a compact, asymmetric jogakbo-inspired workbench system in `src/styles/main.css`.
- Preserve the source input, all buttons, mode radios/toggles, output panel IDs, copy buttons, candidate switch, trace details and footer links.

## Task 3 — redesign the methodology surface
- Apply the same masthead and hero system to `system.html`.
- Restyle methodology contents, long-form sections, tables, callouts, code, source links and status labels for a comfortable reading rhythm.

## Task 4 — verify and document
- Run `npm test`, `npm run audit:source-rights`, and `npm run build` through exact-head GitHub Actions because the current environment cannot resolve github.com for a local clone.
- Inspect the rendered Pages deployment and browser smoke evidence; do not claim visual QA without screenshots or equivalent browser evidence.
- Update the existing master handoff / audit in place with branch, base/head, scope, exact CI evidence and any remaining visual QA limitation.
- Open a PR; do not merge or publish independently.

## Review focus
- Does the design look Korean-modern without relying on clichés or random Hangul decoration?
- Are all current UI IDs, input behaviors, modes, candidate states, trace controls and links preserved?
- Is the methodology readable at mobile widths?
- Are focus, reduced motion, contrast and long Korean passages handled?


## Execution record — 2026-11-10

- **Task 1 — DONE_VERIFIED.** Visual contract was added first. The initial exact-head run failed on the three expected absent-identity assertions: [RED run 42870990512](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42870990512). The final branch run is green: [Tests 42873328171](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42873328171), 1,438 passed / 0 failed.
- **Task 2 — DONE_VERIFIED.** Service page hero/specimen and continuous input/output workbench implemented; no JavaScript, conversion-engine or mode semantics changed.
- **Task 3 — DONE_VERIFIED.** Methodology page shares the new identity and has a dedicated long-form reading treatment.
- **Task 4 — PARTIAL.** Exact-head browser regression, source-rights gate, generated-page validation and production build pass in [Verify 42873315438](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42873315438). Browser G2P [42873327814](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42873327814), master/research artifacts [42873327922](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42873327922), and exhaustive test-case register [42873327845](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42873327845) also pass. Public Pages deployment and rendered desktop/mobile review remain pending until merge.

### Exact-head status

- Branch: `design/korean-editorial-workbench-2026-11-10`
- Tested head: `906b813090387698308a6c4f1b124134481cff92`
- Base: `37c922935b30ca5f46a4f5d37bd5e435f3c28cb6`
- PR: [#467](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/467)
- Python 3.11 / 3.12 / 3.13, wheel install and teacher corpus audit: PASS.
- NIKL metadata-only inventory: SKIPPED by configured policy; not represented as a pass.
- Local clone and local npm execution were unavailable because this runtime could not resolve github.com. No local test run is claimed; CI is the test oracle.
