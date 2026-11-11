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

- **Task 1 — DONE_VERIFIED.** The visual contract was written before implementation. The new localization contract was observed failing on exact head `4054d7eba883d8245ff3651965245d534b77cbc1` in [run 42972079016](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972079016), then the visible terms were localized and the stale English assertion in the methodology contract was updated.
- **Task 2 — DONE_VERIFIED.** The service page now has the shared masthead, real Hangul → IPA → Ukrainian specimen and asymmetric workbench. Existing conversion controls and IDs remain intact.
- **Task 3 — DONE_VERIFIED.** The methodology page uses the same visual system with a long-form reading measure, contents index, numbered sections, readable tables and responsive behavior.
- **Task 4 — DONE_VERIFIED for branch gates; PARTIAL for publication.** Exact final head `d05532de309f0f2b05b4070f78d9fb208d31d849`: Tests [42972715679](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715679) pass 1,440/1,440; Verify [42972715622](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715622), Browser G2P [42972715624](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715624), master/research artifacts [42972715743](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715743), exhaustive register [42972715683](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715683), and rendered visual review [42972715626](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42972715626) all pass. Public Pages deployment and live smoke on the merged redesign commit remain pending.

### Exact-head status

- Branch: `design/korean-editorial-workbench-2026-11-10`
- Verified final head: `d05532de309f0f2b05b4070f78d9fb208d31d849`
- Base: `37c922935b30ca5f46a4f5d37bd5e435f3c28cb6`
- PR: [#467](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/467)
- Python 3.11 / 3.12 / 3.13, wheel install and teacher-corpus audit: PASS.
- Browser regression and production build: PASS, 1,440/1,440.
- Desktop/tablet/mobile visual review: 10/10 viewport captures; no horizontal overflow; focus, reduced motion and touch targets PASS.
- Browser G2P, master/research artifacts and exhaustive register: PASS.
- NIKL metadata-only inventory: SKIPPED by configured policy; not represented as a pass.
- Local clone and local npm execution were unavailable. No local test run is claimed; CI is the test oracle.
- Next and only design-specific blocker: merge PR #467, deploy via Pages, and verify the public live smoke before marking G2 complete.
