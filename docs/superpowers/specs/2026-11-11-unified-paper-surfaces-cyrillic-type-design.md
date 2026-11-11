# Unified paper surfaces and Cyrillic typography — design

## Intent
Make the Korean–Ukrainian service and methodology pages read as one coherent Korean editorial system. The approved asymmetrical jogakbo masthead remains the visual signature; the working interface must no longer split into unrelated dark and light slabs. Ukrainian glyphs must use a locally bundled, known Cyrillic-capable font so І/Ї do not depend on platform fallback.

## Observable goals
- Main input, mode controls, action buttons, Ukrainian answer, supporting results and methodology index use one warm-paper surface family.
- Jade, blue, ochre and clay remain restrained accents for status, focus and textile identity, not unrelated component themes.
- All primary text on light surfaces uses ink/muted text tokens with WCAG AA contrast where text is normal-sized.
- Ukrainian output and Ukrainian hero specimen use a bundled Noto Sans Regular face at weight 400 with font synthesis disabled.
- Both pages load the font same-origin; no external CDN or runtime network dependency is introduced.
- Existing Korean display typography, the asymmetrical header collage, vertical flow, semantic HTML and all conversion behavior remain unchanged.

## Existing gap and root cause
The current shared palette defines dark panel tokens (#263548, #314257, #3b4b60). The workbench, input shell, mode controls, first Ukrainian result card and methodology contents index use those dark tokens while neighboring objects use cream/white. The result is a mixed-material interface even though accent colors are centralized. Ukrainian text has a font-family declaration but no bundled font asset or @font-face; the browser is free to use different local fallback fonts for Cyrillic glyphs.

## Approaches considered
1. Keep dark panels and only adjust accents. Lowest code change, but it preserves the exact split-material problem and is rejected.
2. Move all major working/reading surfaces to the existing light paper family and retain colored accents. Reuses the existing palette and component structure, improves consistency without changing layout or behavior. **Selected.**
3. Introduce a full theme framework or external design-system dependency. Adds runtime and maintenance complexity without a demonstrated need; rejected.

## Decisions and constraints
- Use the existing --palette-surface, --palette-surface-bright, --palette-surface-soft, --palette-ink, --palette-muted, and semantic accent tokens.
- Make legacy --palette-panel* aliases point to the same light surface roles, then update all text and controls that previously assumed inverse/dark text.
- Bundle the installed Noto Sans Regular font as WOFF2 under src/fonts/, include the SIL Open Font License 1.1 and third-party attribution, and load it with a same-origin @font-face.
- Keep the font family scoped to Ukrainian result/specimen text; Korean display text remains on the existing Korean-capable stack.
- Preserve the current asymmetrical jogakbo header exactly; do not introduce patchwork backgrounds into the workbench.
- No changes to Korean phonology, IPA, Ukrainian mappings, data, or engine behavior.

## Acceptance evidence
- Node design-contract tests require light aliases, light backgrounds and readable ink text for the workbench, input, main answer and methodology index.
- Tests require the bundled font asset, same-origin @font-face, and regular/synthesis-disabled Ukrainian selectors.
- Playwright review checks the font is actually loaded, computed Ukrainian weight is 400, major surfaces render in the intended palette, and desktop/tablet/mobile/narrow-mobile layouts have no overflow.
- Exact-head GitHub Actions test, build, visual-review and deployment/live-smoke results are recorded separately; no local pass is claimed when the connector runtime cannot clone the repository.