# Visual design system

Current visual identity for the Korean-to-Ukrainian transcription service and methodology page.

- Service: **Operate** — enter Korean text and inspect/copy Ukrainian pronunciation.
- Methodology: **Read** — understand the phonological pipeline, evidence and limits.
- Replacement direction: **Seoul Type / Hangul as an editorial system**.
- The previous jogakbo/cool-paper identity is superseded by the 2026-11-11 redesign.

## Concept

The product's distinctive mechanism is a linguistic sequence: Korean orthography is analysed, supported pronunciation is resolved, the result crosses an inspectable IPA boundary, and only then is it adapted to Ukrainian practical orthography. The interface makes that sequence visible through typography, not decorative diagrams or national symbols.

The visual world draws from contemporary Korean typographic publishing, independent poster design and screen-native editorial systems. Hangul is treated as a constructed writing system with its own spatial logic; IPA and Ukrainian receive equally deliberate typographic roles. The result should feel like a carefully art-directed Korean language publication that happens to be a fast, dependable tool.

This is a project-specific interpretation, not a claim that one palette, studio or motif represents all Korean design.

## Visual grammar

- Real Hangul syllable blocks carry the visual identity; no random Jamo or pseudo-writing.
- Strong editorial type scale, generous measure, asymmetric composition and modular columns.
- A small number of assertive colour planes; no gradients, faux print distress or simulated paper texture.
- Three scripts, three roles: Hangul is the source, IPA is the analytical bridge, Ukrainian is the user-facing answer.
- One strong workbench: Korean input first, answer second, always vertically stacked.
- Methodology is a long-form reading environment, not a dashboard.
- No repeated eyebrow labels, object-level title/footer bands, fake metrics or decorative badge rows.

## Seven cultural and visual anchors considered

1. Contemporary Hangul type specimen sheets — modular consonant/vowel construction and script-aware typography.
2. Seoul independent-culture posters — typographic scale, asymmetry and a restrained number of strong colour planes.
3. Korean book and newspaper layout — reading measure, spacing and the shift from vertical to horizontal Hangul composition.
4. Korean transit and wayfinding graphics — high-contrast navigation and immediate information hierarchy.
5. Contemporary exhibition identities — one flexible system across service and methodology surfaces.
6. Screen-native Hangul experiments — responsive letterforms and digital typography that remains language-first.
7. Phototypesetting and print-production artefacts — alignment, spacing and grid discipline without simulated paper effects.

The selected combination spans type, editorial publishing, public information graphics, exhibition identity and digital practice. It avoids treating the writing tool itself as a costume for the UI.

## Tokens

| Token | Value | Role |
|---|---|---|
| Paper | `#EF EDE6` | Warm neutral page ground |
| Surface | `#FAF9F4` | Reading and result surfaces |
| Ink | `#17202C` | Main text and input workbench |
| Signal orange | `#ED593D` | Brand mark, primary action and Ukrainian specimen |
| Cobalt | `#254BD8` | Links and keyboard focus |
| Acid yellow | `#E6E84D` | IPA specimen and selected research state |
| Muted | `#5B6570` | Secondary text on light surfaces |

The action colour is reserved for primary action and brand emphasis; cobalt is reserved for links and focus; yellow and orange distinguish the IPA and Ukrainian stages in the specimen.

## Typography

- Prefer local Noto Sans KR / Noto Sans, then platform Korean and Ukrainian sans-serif fallbacks.
- No third-party font CDN; the service retains its local-only CSP and works offline.
- Use real Hangul, IPA and Ukrainian text, not Latin placeholders or random decorative glyphs.
- Build hierarchy with scale, weight, line-height and measure. Avoid all-caps tracking and excessive negative letter spacing.
- Keep long-form methodology text to a readable measure (82ch maximum).

## Layout

- Quiet masthead with a compact Hangul mark and two clear navigation destinations.
- Hero pairs the Ukrainian product description with an asymmetric three-stage typographic specimen on desktop.
- **Only** the Korean input window and answer window are stacked vertically; input always precedes output.
- Ukrainian answer leads; supporting IPA, romanization, Hanja and analysis remain grouped.
- Provenance and confidence stay inside the primary Ukrainian result.
- The text area has no placeholder or text inside it; its label and guidance remain outside.
- Methodology uses a dark contents panel, generous measure, editorial section rhythm, grouped rule/evidence grids and compact tables.
- At narrow widths the hero, specimen and methodology grids reflow; input and answer remain in input-then-output order.

## Interaction and accessibility

- Motion is limited to short hover/press feedback and direct state feedback. No scroll choreography, parallax, autoplay or decorative reveal.
- Hover movement is enabled only for fine pointers; touch targets remain at least 44px where possible.
- `prefers-reduced-motion` removes movement and reduces transition duration.
- Keyboard focus is visible with a 2px outline and offset; the workbench uses acid yellow for focus.
- Preserve labels, live-region announcements, clipboard recovery, candidate selection, trace disclosure, keyboard order and accessible names.
- Tables may scroll horizontally on narrow screens; input, answer and controls must never be hidden.

## Implementation boundaries

- The visual system lives in `src/styles/editorial.css`, loaded after the shared base stylesheet.
- Existing markup IDs and JavaScript hooks are product interfaces: do not rename or remove them.
- No conversion-engine, linguistic, benchmark, data or runtime-dependency changes.
- Keep the two-page GitHub Pages architecture and local-only CSP.
- Avoid generic SaaS card grids, gradients, glass effects, faux grain, random Korean glyphs, excessive rounding and culturally loaded emblems.

## Research references

- [Letterform Archive — Contemporary Design of South Korea](https://letterformarchive.org/news/contemporary-design-of-south-korea/) documents growth in Hangul type design and independent typographic experimentation.
- [Letterform Archive — Localization: 15 Years of LetterSeed](https://letterformarchive.org/news/now-on-view-localization-15-years-of-letterseed/) follows contemporary Korean typography through a dedicated publication.
- [Korea.net — art+language: Contemporary Korean Graphic Design](https://www.korea.net/Events/Overseas/view?articleId=15894) describes an exhibition spanning posters, type, books, publishing, animation and web design.
- [MMCA Korea — Ways of Reading](https://www.mmca.go.kr/eng/exhibitions/exhibitionsDetail.do?exhId=202601160002038) examines the relationship between Hangul, graphic design, publishing and screen reading from the 1970s to mobile interfaces.
- [Seoul Museum of Art — Ahn Sang-soo's salm.letters](https://sema.seoul.go.kr/en/whatson/exhibition/detail?exNo=589) presents Hangul as both readable text and visual structure across type, books, posters and education.
- [It's Nice That — Ore-Oh on simplicity and Hangul](https://www.itsnicethat.com/articles/ore-oh-work-graphic-design-240120) discusses a Seoul studio's use of Hangul and varied visual languages while retaining focus.
- [STA 100 — Dong Dong, ISEA 2025 Seoul](https://100.typographicarts.org/winners/2026/dong-dong-isea-2025-seoul) documents a flexible identity moving between print, space and media.

These references are inspiration and context, not assets to copy or a claim about a universal Korean style.

## Applied skills

The supplied taste-skill, Anthropic frontend-design, Impeccable, Emil Kowalski, Superpowers, mattpocock, unlazy and ponytail guidance was reviewed and applied selectively. Superdesign CLI preflight timed out in the connector-only runtime; no canvas mockup is claimed. No external skill runtime, code or dependency is copied into the product.
