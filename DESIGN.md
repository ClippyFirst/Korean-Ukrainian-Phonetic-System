# Visual design system

Current visual identity for the GitHub Pages service and its methodology page.

- Service surface: **Operate** — help users enter Korean text and inspect a trustworthy Ukrainian transcription.
- Methodology surface: **Read** — explain the pipeline and evidence without competing with the content.
- Design rationale and cultural references: [Korean editorial workbench brief](docs/superpowers/specs/2026-11-10-korean-editorial-workbench-design.md).

## Visual grammar

The system borrows compositional principles, not decorative motifs:

- **Jogakbo / bojagi:** asymmetric modular panels, visible seams and measured negative space. The three-panel Hangul → IPA → Ukrainian specimen is the clearest expression of this grammar.
- **Hangul as structure:** real syllable blocks are used as typography. No random Jamo, fake pseudo-writing or decorative script textures.
- **Hanji as material cue:** warm, quiet paper-like surfaces and restrained contrast. No simulated paper noise or faux grain.
- **Contemporary Korean typography:** script-aware scale and spacing, with Korean, IPA and Ukrainian content treated as equal typographic citizens.

This is a project-specific interpretation, not a claim that one palette or motif represents all Korean design.

## Tokens

| Token | Value | Role |
|---|---|---|
| Hanji | `#F3F0E8` | Main page surface |
| Warm white | `#FCFBF7` | Work surface and reading panels |
| Ink navy | `#172A3A` | Primary text and strong anchors |
| Vermilion | `#B64036` | Action, focus and selected emphasis |
| Celadon | `#789184` | Secondary specimen panel |
| Celadon ink | `#526E5D` | Accessible small text on light surfaces |
| Graphite | `#343B3F` | Long-form body copy |
| Seam | `#D8D4C9` | Divisions between modular areas |

Key text combinations are checked against WCAG AA contrast for normal text: navy on hanji, vermilion on hanji, celadon-ink on warm white, and deep green on celadon.

## Typography

- Use the local system stack: Noto Sans / Noto Sans KR, then platform sans-serif fallbacks.
- Do not load fonts from third-party CDNs; the site must work offline and retain its local-only CSP.
- Use size, weight, line-height and script pairing for hierarchy rather than decorative italics or tracked-out labels.
- Keep long-form methodology text to a readable measure (75ch maximum).

## Layout

- Quiet masthead with typographic Hangul mark; no flag or Taegeuk badge.
- Editorial hero: copy on the left, asymmetric three-panel specimen on the right.
- Service workbench: input and output form one continuous surface, split approximately 44/56 on wide screens and stacked on narrow screens.
- The Ukrainian result is the primary output; IPA, romanization, Hanja and trace data remain secondary but discoverable.
- Methodology uses a contents index, numbered section rail, readable text column and seam-based tables.
- Breakpoints: 980px (tablet adjustments), 760px (single-column workbench), 480px (compact navigation and input).

## Interaction and accessibility

- Motion is limited to short hover/press feedback on controls and direct state feedback. No scroll choreography, parallax, autoplay or decorative reveal.
- `prefers-reduced-motion` suppresses transitions and animations.
- Keyboard focus is visible with a 2px vermilion outline and offset.
- Keep labels, status announcements, copy feedback, candidate selection, trace disclosure and all existing accessible names intact.
- Tables may scroll horizontally on narrow screens; controls and output must never be hidden.

## Implementation boundaries

- The theme lives in `src/styles/editorial.css`, loaded after the existing shared styles.
- Existing markup IDs and JavaScript hooks are product interfaces: do not rename or remove them during visual work.
- No conversion-engine, linguistic, benchmark, data, or runtime-dependency changes are part of this visual system.
- Avoid generic SaaS card grids, gradient washes, glass effects, excessive rounding, arbitrary illustration, random Korean glyphs and culturally loaded emblems.
