# Visual design system

Current visual identity for the GitHub Pages service and its methodology page.

- Service surface: **Operate** — help users enter Korean text and inspect a trustworthy Ukrainian transcription.
- Methodology surface: **Read** — explain the pipeline and evidence without competing with the content.
- Design rationale and cultural references: [Korean editorial workbench brief](docs/superpowers/specs/2026-11-10-korean-editorial-workbench-design.md).

## Visual grammar

The system borrows compositional principles, not decorative motifs:

- **Jogakbo / bojagi:** asymmetric modular panels, visible seams and measured negative space. The three-panel Hangul → IPA → Ukrainian specimen is the clearest expression of this grammar.
- **Hangul as structure:** real syllable blocks are used as typography. No random Jamo, fake pseudo-writing or decorative script textures.
- **Paper as material cue:** a cool neutral ground with no simulated grain or fake paper noise; the surface stays subordinate to the live text.
- **Contemporary Seoul graphic language:** confident Hangul forms, simple geometry, compact type systems and selective high-chroma color planes. The palette belongs to this project, not to a claim about one Korean tradition.
- **Script as structure:** Korean, IPA and Ukrainian have distinct typographic roles but equal legibility.

This is a project-specific interpretation, not a claim that one palette or motif represents all Korean design.

## Tokens

| Token | Value | Role |
|---|---|---|
| Paper | `#F2F3EF` | Cool neutral page ground |
| Warm white | `#FCFCFA` | Work surface and reading panels |
| Ink | `#16191F` | Primary text and Hangul panel |
| Cobalt | `#2448D8` | Action, focus, links and selected state |
| Signal pink | `#FF5AA5` | Ukrainian specimen panel |
| Signal yellow | `#D9E64B` | IPA specimen panel |
| Graphite | `#30363D` | Long-form body copy |
| Seam | `#D5D9D5` | Divisions between modular areas |

The interface stays mostly neutral. Pink and yellow are confined to the three-panel typographic specimen; cobalt carries interactive state. The key text combinations are checked against WCAG AA: ink on paper, ink on pink, ink on yellow, cobalt on paper, and white on cobalt.

## Typography

- Use the local system stack: Noto Sans / Noto Sans KR, then platform sans-serif fallbacks.
- Do not load fonts from third-party CDNs; the site must work offline and retain its local-only CSP.
- Use size, weight, line-height and script pairing for hierarchy rather than decorative italics or tracked-out labels.
- Interface labels, metadata and helper copy never fall below 13px; dense UI may be compact, but not tiny.
- Keep long-form methodology text to a readable measure (75ch maximum).

## Layout

- Quiet masthead with typographic Hangul mark; no flag or Taegeuk badge.
- Editorial hero: introduction followed by a vertical Hangul → IPA → Ukrainian specimen.
- Service flow: input → mode → primary action → Ukrainian result → supporting IPA/romanization/Hanja → alternatives → detailed trace, always one column.
- The Ukrainian result is the primary output; IPA, romanization, Hanja and trace data remain secondary but discoverable.
- The Korean text area has no placeholder or text inside it; its visible label and instructions sit outside the editing surface.
- Methodology uses a contents list and one readable text column; section numbers are part of headings, not a side rail. Tables and evidence lists have no decorative header/footer bands. The short design rationale is plain secondary copy, not a bordered callout card.
- Breakpoints: 980px (tablet adjustments), 760px (single-column workbench), 480px (compact navigation and input).

## Interaction and accessibility

- Motion is limited to short hover/press feedback on controls and direct state feedback. No scroll choreography, parallax, autoplay or decorative reveal.
- `prefers-reduced-motion` suppresses transitions and animations.
- Keyboard focus is visible with a 2px cobalt outline and offset.
- Keep labels, status announcements, copy feedback, candidate selection, trace disclosure and all existing accessible names intact.
- Tables may scroll horizontally on narrow screens; controls and output must never be hidden.

## Implementation boundaries

- The theme lives in `src/styles/editorial.css`, loaded after the existing shared styles.
- Existing markup IDs and JavaScript hooks are product interfaces: do not rename or remove them during visual work.
- No conversion-engine, linguistic, benchmark, data, or runtime-dependency changes are part of this visual system.
- Avoid generic SaaS card grids, gradient washes, glass effects, excessive rounding, arbitrary illustration, random Korean glyphs and culturally loaded emblems.

## Contemporary practice references

The project-specific visual grammar also responds to current Seoul-based design practice:

- [Studio Hooyounghoo](https://hooyounghoo.com/studio-hooyounghoo-1) works across album packaging, identity and exhibition graphics, treating a visual identity as a system that can extend beyond a single logo.
- [fabric](https://studiofabric.kr/) describes its work through colour, typography and materiality across print, web, exhibitions, signage and objects. This supports designing the service and methodology as one coherent system rather than two separately themed pages.
- [YMG Type Foundry](https://yoonmingoo.tf/about) develops multiscript type design across Hangul and Latin. This informs the decision to let Hangul, IPA and Ukrainian text keep distinct but balanced typographic roles.
- [studio fnt](https://studiofnt.com/About) is a Seoul graphic-design studio working across branding, exhibitions and cultural graphics. Its practice is a reference for turning a coherent idea into a visual system across media, not a template to imitate.

These are references to working practices and visual systems, not claims about a universal contemporary Korean aesthetic.

## Contemporary colour and typographic direction

The current palette deliberately moves away from the familiar cream-and-terracotta editorial template. It uses a cool paper ground, ink, cobalt, signal pink and signal yellow. The bright colours appear only in the sequential Hangul → IPA → Ukrainian specimen; the tool's controls remain mostly neutral with cobalt for action and focus.

This decision is informed by:
- [Hanyul Hangul Collection (2024)](https://design.amorepacific.com/en/work/2024/hanyul/hangul-collection/), which treats Hangul's horizontal/vertical balance and the combination of consonants and vowels as a graphic construction system.
- [The Preview Seoul 2025](https://www.behance.net/gallery/231827241/The-Preview-Seoul-2025), whose identity uses bold typography and directional composition.
- [The View From Seoul](https://www.itsnicethat.com/articles/the-view-from-seoul-korean-poster-archive-graphic-design-170924), discussing Korean poster design's move toward screen-native form and motion.
- [studio fnt](https://www.commarts.com/features/studio-fnt), a Seoul practice known for geometric form, restrained colour and confident Hangul typography.

The result borrows the design methods, not any studio's artwork or identity.

The methodology page also explains the visual idea in Ukrainian: jogakbo's visible seams are mapped to the distinct Hangul, IPA and Ukrainian stages, while the paper-like ground stays quiet so the linguistic content remains primary.
