# Implementation and verification — unified paper surfaces and Cyrillic typography

**Design:** [2026-11-11 unified paper surfaces and Cyrillic type](../specs/2026-11-11-unified-paper-surfaces-cyrillic-type-design.md)  
**Starting main:** `d49a93544c4b49d4f3046fee5e9280c65356a0b5`  
**Implementation head:** `e5633cb04bc7e3d757527806acc0721a8a4a0fd9`  
**Branch:** `fix/unified-paper-surfaces-cyrillic-font-2026-11-11`  
**PR:** [#485](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/485)

## Task ledger

| Task | Status | Evidence |
|---|---|---|
| Diagnose the real mixed-material and font-fallback causes | DONE_VERIFIED | Baseline palette panel aliases were dark; no bundled Cyrillic font or @font-face existed. |
| Add interface regression contracts | DONE_VERIFIED | Node suite passes 1,458/1,458 at implementation head. |
| Bundle Noto Sans Regular WOFF2 with licensing/attribution | DONE_VERIFIED | `src/fonts/NotoSans-Regular.woff2` (7,292 bytes), OFL 1.1 text and public third-party notice. |
| Verify actual Ukrainian cmap coverage | DONE_VERIFIED | `scripts/audit_ukrainian_font_cmap.py` passes for І/Ї/Є/Ґ and і/ї/є/ґ. |
| Unify working and methodology surfaces | DONE_VERIFIED | Palette panel aliases now resolve to paper/surface roles; primary text uses ink/muted roles; semantic accents remain jade/blue/ochre/clay. |
| Browser rendering and responsive review | DONE_VERIFIED | Both pages at 1440, 1024, 768, 390 and 320px; font loaded with computed weight 400 and synthesis none; intended surface colors and AA contrast confirmed; no page overflow or JS errors. Screenshots inspected. |
| Handoff and audit reconciliation | DONE_VERIFIED | Existing master handoff, ledger and UX/UI audit updated in place. |

## Exact verification commands and evidence

Executed by GitHub Actions on implementation head `e5633cb04bc7e3d757527806acc0721a8a4a0fd9`:

- `npm test` — PASS, 1,458 tests, 0 failures.
- `npm run build` — PASS.
- `python -m pip install --disable-pip-version-check fonttools brotli`
- `python scripts/audit_ukrainian_font_cmap.py` — PASS, all eight required Ukrainian codepoints present.
- `node scripts/capture-editorial-review.mjs` — PASS, 10 page/viewport combinations.
- Browser regression tests, generated-page verification, redistribution-rights gate, Python regression/data integrity, wheel-install, teacher-corpus audit, browser G2P integration, master/research artifacts and exhaustive test-case register — PASS.

Workflow evidence:
- Tests: [43105710769](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710769)
- Verify: [43105710859](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710859)
- Editorial visual review: [43105710901](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710901)
- Browser G2P integration: [43105710936](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710936)
- Master table/research artifacts: [43105710890](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710890)
- Exhaustive register: [43105710680](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/43105710680)

Official NIKL metadata-only inventory was skipped by its credential gate and is unrelated to this task. Local shell tests/build were not run because no verified local checkout was available.

## Scope and preservation

- Preserved the approved asymmetrical jogakbo header exactly.
- Kept all Korean pronunciation, IPA, Ukrainian adaptation, corpus and engine code unchanged.
- No CDN or runtime network dependency; the Ukrainian font is served same-origin.
- No release or external settings changed.

**Next action:** mark PR #485 ready, merge after exact-head checks, then verify GitHub Pages deployment and public live smoke.