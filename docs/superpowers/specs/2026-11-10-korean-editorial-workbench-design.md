# Korean editorial workbench — design brief

Date: 2026-11-10
Surface: GitHub Pages browser service and methodology page
Mode: Operate (service), Read (methodology)

## Intent
Replace the current generic dark-hero / outlined-card visual language with a contemporary Korean editorial interface that makes the Korean → pronunciation → IPA → Ukrainian workflow feel authored, legible and trustworthy. The primary job remains entering Korean text and reading/copying Ukrainian output; the secondary job is inspecting IPA, Romanization, Hanja and trace evidence.

## Audience and scene
Ukrainian-speaking users studying, reading or researching Korean. The service is a practical tool used repeatedly, often with long passages; the interface must prioritize direct access, scanability, clear uncertainty and mobile use.

## Product truths to preserve
- Existing g2pK practical mode and Kozak Kim research mode remain unchanged.
- Strict, Soft and Super-soft controls and their confidence semantics remain discoverable.
- Output fields, clipboard behavior, spelling suggestions, stress-test passage, trace disclosure, accessibility announcements and methodology links remain functional.
- IPA remains the actual intermediate boundary; no UI work may change linguistic behavior or present unvalidated candidates as confirmed.
- The two-page GitHub Pages structure and local-only CSP remain intact.

## Visual direction
A contemporary editorial workbench informed by Korean graphic culture rather than literal national-symbol decoration:
- Jogakbo / bojagi: modular composition, visible seams, asymmetrical patchwork rhythm, deliberate negative space. Use this as layout logic, not a background pattern.
- Hangul as graphic architecture: use actual script blocks and Jamo as large typographic specimens, never random decorative glyphs.
- Hanji and contemporary craft: tactile, quiet surfaces suggested through warm mineral paper tones and restrained material contrast, not fake noise textures.
- Contemporary Seoul graphic identities: confident Hangul/Latin/Ukrainian typography, precise grid, a single vivid color interruption and strong editorial hierarchy.

## Proposed palette
- Ink navy: #172A3A
- Hanji: #F3F0E8
- Warm white: #FCFBF7
- Deep vermilion: #B64036
- Muted celadon: #789184
- Graphite: #343B3F
- Pale seam: #D8D4C9

These are design tokens, not cultural claims. Preserve contrast and use color semantically.

## Typography
Use a robust system stack already available locally, preferring Noto Sans KR / Noto Sans for Korean and Ukrainian coverage. Build character through scale, weight, line-height and script pairing; do not add remote font dependencies or make the page network-dependent.

## Layout and interaction
- Header becomes a quiet masthead with compact navigation.
- Hero becomes a restrained editorial introduction with one typographic Hangul specimen; remove the generic oversized dark panel.
- The workbench becomes the main visual anchor: input and output are one continuous modular composition, with Ukrainian output visually dominant and diagnostics secondary.
- Research controls stay progressive-disclosure, not a wall of technical options.
- Methodology becomes a readable long-form editorial document with a clear contents index, strong heading rhythm and responsive tables.
- Motion is limited to direct interaction feedback (field focus, disclosure, copy confirmation); no scroll choreography, parallax, autoplay or gratuitous reveal.
- Desktop, tablet and narrow mobile layouts must remain usable without hiding controls or output.

## Anti-goals
No AI-template gradients, generic SaaS card grid, decorative pseudo-data, random Hangul ornaments, flag/Taegeuk repetition, glassmorphism, excessive rounded pills, gratuitous motion, remote dependencies, or changes to the conversion engine.

## Acceptance
- Existing web UI contract and behavior tests continue to pass.
- New source-level assertions protect the editorial identity and ensure the old generic hero treatment is absent.
- Build succeeds; GitHub Pages deployment and public smoke test pass on the exact final PR head.
- Responsive, keyboard-focus and reduced-motion behavior remain explicit.
