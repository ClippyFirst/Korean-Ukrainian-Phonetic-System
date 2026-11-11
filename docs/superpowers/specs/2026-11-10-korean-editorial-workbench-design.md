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
- Jogakbo / bojagi: visible seams, asymmetry, negative space and a measured rhythm between modular parts. Use a compact three-part specimen with distinct colour planes; do not flatten the whole page into one column.
- Hangul as graphic architecture: use actual script blocks and Jamo as large typographic specimens, never random decorative glyphs.
- Paper as a material cue: a cool neutral ground with no simulated grain or faux texture.
- Contemporary Seoul graphic identities: confident Hangul typography, simple geometry, compact type systems and selective high-chroma colour planes.
- A three-stage Hangul / IPA / Ukrainian specimen uses typographic scale and the project palette (ink / yellow / pink), without visible object-level labels or top/bottom strips. Cobalt is reserved for interactive action and focus.

## Current palette
- Cool paper: #F2F3EF
- Warm white: #FCFCFA
- Ink: #16191F
- Cobalt: #2448D8
- Signal pink: #FF5AA5
- Signal yellow: #D9E64B
- Graphite: #30363D
- Seam: #D5D9D5

The first cream / vermilion / celadon pass was replaced after screenshot review because it read too close to a common generated editorial template. The current interface keeps the surface neutral, uses cobalt for action and focus, and reserves pink and yellow for the sequential typographic specimen.

## Typography
Use a robust system stack already available locally, preferring Noto Sans KR / Noto Sans for Korean and Ukrainian coverage. Build character through scale, weight, line-height and script pairing; do not add remote font dependencies or make the page network-dependent.

## Layout and interaction
- Header becomes a quiet masthead with compact navigation.
- Hero pairs the editorial introduction with an asymmetric Hangul → IPA → Ukrainian specimen on desktop; it adapts to a single column only at narrow responsive breakpoints.
- Only the two workbench windows are stacked: Korean text input first, answer window second. Within the answer window, the Ukrainian result remains dominant while IPA, romanization, Hanja and diagnostics keep their grouped desktop composition.
- The active engine/mode provenance line belongs to the Ukrainian result panel, not to the supporting-result grid. The supporting grid contains only IPA, romanization, Hanja and analysis panels.
- Research controls stay progressive-disclosure, not a wall of technical options.
- Methodology remains a long-form editorial page with a clear contents index, strong heading rhythm, grouped rule/evidence layouts and responsive tables.
- Motion is limited to direct interaction feedback (field focus, disclosure, copy confirmation); no scroll choreography, parallax, autoplay or gratuitous reveal.
- Desktop, tablet and narrow mobile layouts must remain usable without hiding controls or output.

## Anti-goals
No AI-template gradients, generic SaaS card grid, decorative pseudo-data, random Hangul ornaments, flag/Taegeuk repetition, glassmorphism, excessive rounded pills, gratuitous motion, remote dependencies, or changes to the conversion engine.

## Acceptance
- Existing web UI contract and behavior tests continue to pass.
- New source-level assertions protect the editorial identity and ensure the old generic hero treatment is absent.
- Build succeeds; the merged main commit is deployed to GitHub Pages and passes the public smoke test.
- Responsive, keyboard-focus and reduced-motion behavior remain explicit.

## Design research sources

- [Dong Dong — ISEA 2025 Seoul identity](https://100.typographicarts.org/winners/2026/dong-dong-isea-2025-seoul): documents a flexible identity using Hangul and elements of the Korean national flag. The implementation takes the idea of script-as-structure, not the emblem as a logo.
- [Shin & Westland — Digitizing Traditional Cultural Designs](https://eprints.whiterose.ac.uk/id/eprint/117161/): analyses Korean bojagi patchwork rules and translates them into computational design. This informs the interface's modular seams, asymmetry and reusable layout grammar rather than a literal textile texture.
- [Hong Yoon-jung — Korean Bojagi color classification (2026)](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003320140): analyses 2,741 colour samples from seven bojagi types; warm hues and low-chroma combinations predominate in the sampled historical objects. This is context, not a palette prescription. The study remains cultural context, not the source of the current high-chroma accent palette.
- [Koreana — Artists Add New Pages to Hanji's Rich History (2026)](https://www.koreana.or.kr/koreana/na/ntt/selectNttInfo.do?bbsId=1114&nttSn=136840): shows contemporary reinterpretations of hanji in craft and graphic design. This supports a material cue only; the interface uses a cool neutral ground and no simulated grain.
- [Letterform Archive — Localization: 15 Years of LetterSeed (2025)](https://letterformarchive.org/news/now-on-view-localization-15-years-of-letterseed/): situates contemporary Hangul typography as an active editorial/design practice.

These references support design inspiration only. They do not establish a single canonical Korean visual style; the final system is a project-specific interpretation.

## Contemporary Korean graphic-design references

- [Studio Hooyounghoo](https://hooyounghoo.com/studio-hooyounghoo-1): a Seoul practice founded in 2024, spanning album packaging, identity and exhibition graphics. Used to think of identity as a system across formats rather than a decorative logo.
- [fabric](https://studiofabric.kr/): a Seoul studio whose work connects colour, typography and materiality across print, web, exhibitions, signage and objects. Supports the two-page design system.
- [YMG Type Foundry](https://yoonmingoo.tf/about): contemporary multiscript type design across Hangul and Latin, informing script-aware typography.
- [studio fnt](https://studiofnt.com/About): a Seoul graphic-design studio working across branding, exhibitions and cultural graphics; a reference for system-building across media, not a visual template.

These examples are evidence of several distinct practices, not a single Korean style.

## Contemporary visual direction update

The first rendered pass used warm paper, vermilion and celadon. Screenshot review showed that this combination, paired with zero-radius hairlines, landed too close to a common generated editorial template. The palette was therefore revised before publication.

The current system uses a cool paper ground (`#F2F3EF)), ink (`#16191F`), cobalt (`#2448D8`), signal pink (`#FF5AA5`) and signal yellow (`#D9E64B`). Cobalt is the only interface action/focus accent. Pink and yellow appear only in the asymmetric Hangul / IPA / Ukrainian specimen. Interactive controls receive small, consistent corner radii; the modular specimen and workbench retain square seams.

Additional references:
- [Hanyul Hangul Collection (2024)](https://design.amorepacific.com/en/work/2024/hanyul/hangul-collection/) — Hangul's geometric balance as a graphic construction system.
- [The Preview Seoul 2025](https://www.behance.net/gallery/231827241/The-Preview-Seoul-2025) — bold type and directional composition in a contemporary Korean visual identity.
- [The View From Seoul](https://www.itsnicethat.com/articles/the-view-from-seoul-korean-poster-archive-graphic-design-170924) — screen-native form and motion in current Korean poster practice.
- [studio fnt](https://www.commarts.com/features/studio-fnt) — geometric forms, simple palettes and confident Hangul typography.

These references inform a project-specific combination. They are not presented as a universal Korean style.

## Applied design and implementation skills

The redesign was reviewed against the following public skill guidance supplied for this task:

- [taste-skill](https://github.com/Leonxlnx/taste-skill/tree/main/skills/taste-skill): keep the page grounded in the actual tool, avoid template copy and invented product claims, and make every visual carry real interface or linguistic content. Its copy-tells reference informed the Ukrainian terminology pass.
- [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design): choose a product-specific visual identity, let typography carry the subject, avoid default hero/card/eyebrow patterns, and spend visual emphasis in one memorable place.
- [Impeccable](https://github.com/pbakaus/impeccable): treat the service as Operate and methodology as Read; preserve familiar task affordances, give the reading page a calm measure, and verify responsive, focus, contrast, reduced-motion and real control states.
- [Emil Kowalski's skills](https://github.com/emilkowalski/skills): motion must explain state or confirm an action; frequent controls remain immediate, transitions stay short and use explicit properties, and hover movement is limited to fine pointers.
- [Superpowers](https://github.com/obra/superpowers): use test-first acceptance contracts and verify the actual branch head before calling work complete.

The local skill command-line tools were not available in this connector-only runtime. The public skill documents were read directly from their repositories; project-native tests and GitHub Actions supplied implementation verification. No external skill code, runtime or dependencies were copied into the product.
