# Implementation plan — unified paper surfaces and Cyrillic typography

**Design:** [2026-11-11 unified paper surfaces and Cyrillic type](../specs/2026-11-11-unified-paper-surfaces-cyrillic-type-design.md)
**Base:** d49a93544c4b49d4f3046fee5e9280c65356a0b5
**Branch:** fix/unified-paper-surfaces-cyrillic-font-2026-11-11

## Task 1 — Add failing interface contracts
- Extend tests/korean-editorial-design-contract.test.mjs to require light palette aliases and light/ink treatments for the workbench, input, main Ukrainian result and methodology index.
- Require a bundled src/fonts/NotoSans-Regular.woff2, an @font-face declaration and a dedicated regular-weight Ukrainian family.
- Run the exact-head Node test workflow and confirm the new contract fails for the missing aliases/font, not setup errors.

## Task 2 — Bundle the Cyrillic font with its license
- Convert the system-provided Noto Sans Regular TTF to WOFF2 without altering glyph outlines.
- Add the font under src/fonts/, add the SIL OFL 1.1 text and a scoped third-party notice.
- Verify the font cmap covers Ukrainian І/Ї/Є/Ґ and lower-case counterparts.

## Task 3 — Unify the interface surfaces
- Change panel roles to aliases of the existing paper/surface palette.
- Correct all text, controls, helper notes, focus states and primary answer styling that previously assumed dark backgrounds.
- Preserve jade/blue/ochre/clay as accents and preserve the approved header collage.
- Keep layout and all linguistic runtime files unchanged.

## Task 4 — Verify real browser rendering
- Extend the editorial Playwright capture to check the bundled font loads, Ukrainian output computes to weight 400, main panels use light palette colors and contrast remains accessible.
- Run desktop, laptop, tablet, mobile and narrow-mobile captures for both pages; inspect the uploaded screenshots and resolve any regressions.

## Task 5 — Reconcile records and finish
- Update the existing master handoff in place with exact start/head SHA, branch/PR, files changed, commands and CI run IDs.
- Correct the premature 2026-11-11 palette/font completion claims with the actual verified outcome.
- Run the relevant exact-head checks and review the final diff; create a PR but do not merge until all required checks are green.

## Scope exclusions
No changes to the Korean pronunciation pipeline, IPA, Ukrainian target correspondence, corpus, benchmark data, external settings, releases or unrelated research gates.