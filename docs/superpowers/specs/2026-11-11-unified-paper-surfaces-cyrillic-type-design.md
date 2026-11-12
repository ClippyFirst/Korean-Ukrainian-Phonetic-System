# Unified paper surfaces and Cyrillic typography — design

## Intent
Make the Korean–Ukrainian service and methodology pages read as one coherent Korean editorial system. The approved asymmetrical jogakbo masthead remains the visual signature; the working interface must no longer split into unrelated dark and light slabs. Ukrainian glyphs must use a locally bundled, known Cyrillic-capable font so І/Ї do not depend on platform fallback.

## Observable goals
- Main input, mode controls, action buttons, Ukrainian answer, supporting results and methodology index use one warm-paper surface family.
- Jade, blue, ochre and clay remain restrained accents for status, focus and textile identity, not unrelated component themes.
- All primary text on light surfaces uses ink/muted text tokens with WCAG AA contrast where text is normal-sized.
- All Ukrainian UI text (including body copy, headings, input, result and specimen) prefers a bundled Noto Sans Regular face with complete Ukrainian alphabet coverage; Korean glyphs fall through to the Korean-capable stack.
- Ukrainian result and specimen remain explicitly regular at weight 400 with font synthesis disabled.
- Both pages load the font same-origin; no external CDN or runtime network dependency is introduced.
- Existing Korean display typography, the asymmetrical header collage, vertical flow, semantic HTML and all conversion behavior remain unchanged.

## Existing gap and root cause
The current shared palette defines dark panel tokens (#263548, #314257, #3b4b60). The workbench, input shell, mode controls, first Ukrainian result card and methodology contents index use those dark tokens while neighboring objects use cream/white. The result is a mixed-material interface even though accent colors are centralized. The first correction bundled a Cyrillic-capable font and applied it only to the Ukrainian result/specimen. The page-wide stack still preferred Noto Sans KR before the bundled Ukrainian face, so Ukrainian glyphs in ordinary site copy and the input could still come from a platform fallback. A glyph-weight mismatch could therefore persist outside the narrowly scoped result selector.

## Approaches considered
1. Keep dark panels and only adjust accents. Lowest code change, but it preserves the exact split-material problem and is rejected.
2. Move all major working/reading surfaces to the existing light paper family and retain colored accents. Reuses the existing palette and component structure, improves consistency without changing layout or behavior. **Selected.**
3. Introduce a full theme framework or external design-system dependency. Adds runtime and maintenance complexity without a demonstrated need; rejected.

## Decisions and constraints
- Use the existing --palette-surface, --palette-surface-bright, --palette-surface-soft, --palette-ink, --palette-muted, and semantic accent tokens.
- Make legacy --palette-panel* aliases point to the same light surface roles, then update all text and controls that previously assumed inverse/dark text.
- Bundle the installed Noto Sans Regular font as WOFF2 under src/fonts/, include the SIL Open Font License 1.1 and third-party attribution, and load it with a same-origin @font-face.
- Put the bundled Ukrainian face first in the site-wide and input font stacks; keep Noto Sans KR immediately after it so Hangul continues to use a Korean-capable face.
- Preserve the current asymmetrical jogakbo header exactly; do not introduce patchwork backgrounds into the workbench.
- No changes to Korean phonology, IPA, Ukrainian mappings, data, or engine behavior.

## Acceptance evidence
- Node design-contract tests require light aliases, light backgrounds and readable ink text for the workbench, input, main answer and methodology index.
- Tests require the bundled font asset, same-origin @font-face, and regular/synthesis-disabled Ukrainian selectors.
- The font cmap audit verifies every uppercase/lowercase Ukrainian alphabet glyph and OS/2 weight class 400.
- Playwright checks the body and input actually prefer the bundled face, checks the full alphabet loads, captures a rendered vowel specimen, verifies result/specimen weight 400 and synthesis disabled, and reviews desktop/tablet/mobile/narrow-mobile layouts for overflow.
- Exact-head GitHub Actions test, build, visual-review and deployment/live-smoke results are recorded separately; no local pass is claimed when the connector runtime cannot clone the repository.