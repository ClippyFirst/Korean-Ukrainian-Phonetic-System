# Jogakbo Header and Vertical Modules Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Introduce a restrained jogakbo-inspired header and strengthen the vertical object-plus-explanation module structure on the service and methodology pages without changing product behavior.

**Architecture:** Keep the existing two-page static/Vite architecture and `src/styles/editorial.css` visual layer. Add a small semantic patchwork band to both page headers, add explanatory module copy around the existing functional objects, and express the vertical module rhythm through focused CSS. Preserve every existing DOM/JS contract.

**Tech Stack:** HTML, CSS, Node.js built-in test runner, Vite, existing Playwright editorial review.

**Spec:** `docs/superpowers/specs/2026-11-11-jogakbo-header-vertical-modules-design.md`

## Global Constraints

- Korean input window first, answer window second at every viewport.
- The textarea remains placeholder-free.
- No existing DOM IDs, form names, JS hooks, result semantics, or accessibility contracts are removed or renamed.
- No pronunciation, IPA, conversion, corpus, runtime-dependency, or CSP changes.
- Header-only jogakbo; content modules remain vertical and editorial.
- No remote fonts, image CDNs, or new runtime dependencies.
- Preserve WCAG AA text contrast, visible focus, reduced motion and touch targets.

## Review Focus

- 320px width with long Korean strings and Ukrainian guidance: no horizontal overflow and no focus-order mismatch.
- Empty and populated result states: guidance does not obscure or displace the Ukrainian result.
- Long methodology tables and code-like IPA: module flow remains vertical while the table may scroll internally.
- Keyboard focus on dark input controls and light methodology content remains visible.
- Header patchwork does not become unreadable or dominate the hero on narrow screens.

---

### Task 1: Record the approved visual contract

**Files:**
- Create: `docs/superpowers/specs/2026-11-11-jogakbo-header-vertical-modules-design.md`
- Create: `docs/superpowers/plans/2026-11-11-jogakbo-header-vertical-modules.md`

- [x] Commit the design contract and implementation plan on the dedicated branch.

### Task 2: Add test-first design contracts

**Files:**
- Modify: `tests/korean-editorial-design-contract.test.mjs`

- [x] Assert both pages declare the new visual-system identity and contain a semantic `.jogakbo-band` inside `.site-header`.
- [x] Assert the band contains multiple patch elements and is not inserted into the workbench or methodology body.
- [x] Assert the service input module includes a concise guidance object and precedes the output module.
- [x] Assert the output module includes concise interpretation guidance while the textarea has no placeholder.
- [x] Assert the methodology page's main content modules remain in source order and major sections retain their existing object types (layers/tables/rule grids).
- [x] Assert the legacy visual identity text no longer claims jogakbo is retired.
- [x] Run the focused Node test and confirm the new assertions fail before production changes.

### Task 3: Implement the service page and shared header

**Files:**
- Modify: `index.html`
- Modify: `system.html`
- Modify: `src/styles/editorial.css`

- [x] Add the same accessible-hidden decorative jogakbo band to both headers, composed of unequal rectangular fragments with no text or image dependencies.
- [x] Add an explanatory note to the input module and a separate explanation for the output object.
- [x] Preserve all existing input/result IDs and ensure the output remains after the input in DOM order.
- [x] Style the band with a limited Korean textile-inspired palette and visible page-ground seams.
- [x] Style service modules as one vertical sequence; preserve the distinct input and output surfaces.
- [x] Ensure the motif is absent from the body modules and methodology content.

### Task 4: Shape the methodology reading modules

**Files:**
- Modify: `system.html`
- Modify: `src/styles/editorial.css`

- [x] Add a concise introduction that explains how to use the methodology page and its examples.
- [x] Keep the table of contents, 24 existing section anchors and research prose in their current order.
- [x] Make each major methodology section a full-width vertical module with explanatory copy followed by its existing table, diagram, rule grid, or example where present.
- [x] On narrow screens, stack module internals that would otherwise place explanatory text and the main object side-by-side; allow only genuinely wide tables to scroll.

### Task 5: Reconcile docs and verify exact branch head

**Files:**
- Modify: `DESIGN.md`
- Modify: `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`
- Modify: `docs/audits/UX-UI-AUDIT-2026-10-28.md` (only if its current findings are directly superseded)

- [x] Update the visual system in place and explicitly supersede the Seoul Type-only visual brief without deleting its historical record.
- [x] Record the task ledger, branch/base/head and implementation commits in the existing master handoff; append final CI and rendered-review evidence after the exact-head runs complete.
- [x] Run focused and full Node tests, source-rights audit, production build, and rendered review on the final PR head.
- [x] Check exact-head GitHub Actions results and complete the main-only Pages deployment and live-site smoke after merge.

## Commit strategy

- Commit the approved design and plan together.
- Commit tests separately before production HTML/CSS changes.
- Commit service/header implementation and methodology module changes coherently.
- Commit design-system and handoff reconciliation after verification evidence is known.


## Final execution record — 2026-11-11

- Starting main: 004173e11dc92b292ea2d67000844119096e1679
- Implementation branch: design/jogakbo-header-vertical-modules-2026-11-11
- PR #480 merged at 2026-11-11T12:24:22Z; merge commit: 505bc4ffa448a66f6bf5a9c1c4f812ad8754edec
- Public site: https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- Node suite: 1,446 passed, 0 failed. Python 3.11/3.12/3.13: passed. Browser G2P: passed. Source-rights gate: passed. Vite build: passed. Master artifacts and exhaustive test register: passed.
- Playwright editorial review: passed on both pages at 1440, 1024, 768, 390 and 320 CSS px. Computed mode-label contrast gate passed. Artifact: 13853728176.
- GitHub Pages deployment and live browser smoke: passed (run 43020048051). HTTP smoke checked index.html, system.html and the built JS asset. Live browser smoke checked a 1,443-character Korean passage, Hanja chunk/output, live result announcement, mode disclosure, clipboard fallback, 390px trace labels and methodology navigation.
- No linguistic/runtime/data changes were made. The broader repository remains a research prototype for independent research gates.
