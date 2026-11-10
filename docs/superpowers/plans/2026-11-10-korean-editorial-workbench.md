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
