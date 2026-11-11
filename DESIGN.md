# Visual design system — Jogakbo masthead and vertical editorial modules

Current visual identity for the Korean-to-Ukrainian transcription service and methodology page.

- Service: **Operate** — enter Korean text, choose a mode, inspect and copy Ukrainian pronunciation.
- Methodology: **Read** — understand the phonological pipeline, evidence, examples and limits.
- Current direction: **Jogakbo header / vertical editorial modules**.
- Approved by the user: 2026-11-11.
- The Seoul Type brief remains in history but is superseded where it conflicts with this system.

## Concept

The service's distinctive mechanism is a linguistic sequence: Korean orthography is analysed, supported pronunciation is resolved, the result crosses an inspectable IPA boundary, and only then is it adapted to Ukrainian practical orthography. The interface should make that sequence understandable without disguising a working tool as a marketing page.

The visual identity has two deliberately separate parts:

1. **Header signature — jogakbo (조각보):** an abstracted patchwork band made from unequal rectangular colour fields with clear seams. It appears once, in the header of each page.
2. **Content structure — vertical editorial modules:** each module contains a real object (input, result, diagram, table, example or control) and concise explanation that tells the reader what it does and how to use or interpret it.

Jogakbo is not a page-wide layout system. Do not turn the workbench, result surfaces or methodology sections into patchwork cards. The header motif provides recognition; vertical modules provide clarity.

This is a project-specific interpretation, not a claim that one textile, palette or graphic system represents all Korean design.

## Cultural grounding

The Victoria and Albert Museum describes jogakbo as Korean patchwork wrapping cloth assembled from leftover fabric pieces into larger squares and rectangles, joined with flat seams and extended in irregular compositions. The Asian Art Museum's collection records likewise describe bojagi as functional wrapping cloths and identify patchwork examples as jogakbo.

The interface borrows only the qualities relevant to a header signature: rectangular fragments, unequal proportions, visible joins, and the balance of a composed whole made from distinct pieces. It does not imitate fabric texture, stitching, historical objects or a specific museum artefact.

## Visual grammar

- The jogakbo band sits inside the site header, below the navigation and above the hero. It uses eight unequal rectangles and narrow page-ground seams.
- No patchwork pattern repeats in content modules, result cards, tables or the methodology body.
- No literal textile photography, faux weave, grain, hanji texture, flags, Taegeuk, random Jamo or decorative Korean text.
- The hero's three-stage specimen remains a separate editorial object: Hangul → IPA → Ukrainian.
- Service modules follow the task order: Korean input → mode and action → Ukrainian answer → supporting IPA/RR/Hanja/analysis/trace.
- Input and answer are separate full-width windows, always stacked in that order.
- The methodology page follows a single reading path: introduction → reading guide → contents → method sections.
- Each major method section pairs explanatory prose with a real example, table, diagram, comparison or evidence object where relevant.
- No repeated same-size icon/heading/text card scaffolds, object-level caption strips, fake metrics, decorative badge rows, gradients or glassmorphism.

## Tokens

| Token | Value | Role |
|---|---|---|
| Paper | #EFEDE6 | Main page ground |
| Surface | #FAF9F4 | Reading and result surfaces |
| Ink | #17202C | Main text and input workbench |
| Signal orange | #ED593D | Primary action and brand emphasis |
| Signal deep | #AD3426 | Small red indices with AA contrast |
| Cobalt | #254BD8 | Links and light-surface keyboard focus |
| Acid yellow | #E6E84D | IPA specimen and dark-workbench focus |
| Jogakbo ink | #24354B | Header patch |
| Jogakbo jade | #9DB7A7 | Header patch |
| Jogakbo blue | #A9BAC6 | Header patch |
| Jogakbo ochre | #C9A66B | Header patch |
| Jogakbo clay | #B9857A | Header patch |
| Jogakbo ground | #F1EEE5 | Patchwork seams |

Patchwork colours are decorative fields without text. Body text and controls use the established accessible semantic palette, not the textile colours.

## Typography

- Retain the local Noto Sans KR / Noto Sans / platform fallback stack.
- No third-party font CDN; the service retains its local-only CSP and works offline.
- Use real Hangul, IPA and Ukrainian text, not Latin placeholders or random decorative glyphs.
- Build hierarchy with scale, weight, line-height and measure. Keep long-form prose readable and let wide data tables scroll inside their own bounds.
- No display font in controls, buttons or dense data labels.

## Layout

### Service

- Compact navigation and a header-only jogakbo band.
- Hero explains the service and retains the Hangul/IPA/Ukrainian specimen.
- Input module: the Korean textarea and existing mode/example controls remain the primary object; the following note explains what to enter and how examples help.
- Output module: the result window remains below the input. A visible heading and guidance explain the Ukrainian answer and supporting objects.
- Ukrainian output leads; supporting IPA, romanization, Hanja and trace remain grouped and progressively disclosed.
- The textarea has no placeholder or text inside it; its label and guidance remain outside.
- Preserve candidate/provenance and confidence states.

### Methodology

- Reuse the same header identity.
- Stack the introductory statement, reading guide, contents and all 24 existing method sections in source order.
- Keep the six-level phonological pipeline as a vertical sequence.
- Each major section leads with explanation and presents its existing evidence object, example or table without changing claims or evidence scope.
- Long tables may scroll horizontally on narrow screens; the method modules themselves remain vertical.

## Interaction and accessibility

- Motion is limited to short hover/press feedback and direct state feedback. No scroll choreography, parallax, autoplay or decorative reveal.
- prefers-reduced-motion removes movement and reduces transition duration.
- Hover movement is enabled only for fine pointers; touch targets remain at least 44px where possible.
- Keyboard focus is visible with a 2px outline and offset; the dark workbench uses acid yellow and light reading surfaces use cobalt.
- Preserve labels, live-region announcements, clipboard recovery, candidate selection, trace disclosure, keyboard order and accessible names.
- Keep normal text contrast at WCAG AA; decorative patchwork fields carry no text.

## Implementation boundaries

- Visual system lives in src/styles/editorial.css, loaded after the shared base stylesheet.
- Existing markup IDs and JavaScript hooks are product interfaces: do not rename or remove them.
- No conversion-engine, linguistic, benchmark, data, source-rights or runtime-dependency changes.
- Keep the two-page GitHub Pages architecture and local-only CSP.
- The current page remains a software-verified research prototype; the visual redesign does not certify the linguistic research.

## Research references

- Victoria and Albert Museum, [Jogakbo — traditional Korean patchwork](https://www.vam.ac.uk/articles/jogakbo-traditional-korean-patchwork) (updated 17 April 2024): construction from fabric remnants, rectangular pieces, flat seams and irregular composition.
- Asian Art Museum, [Wrapping cloth (bojagi), object 2005.71](https://searchcollection.asianart.org/objects/16968/wrapping-cloth-bojagi): functional use of bojagi and the distinction between general wrapping cloths and patchwork jogakbo.
- The Metropolitan Museum of Art, [Jogakbo (Patchwork wrapping cloth)](https://www.metmuseum.org/art/collection/search/853905): a contemporary example continuing the patchwork tradition.

These references ground the motif's material and compositional qualities. They are not assets to copy and do not imply a universal Korean visual style.

## Applied workflow guidance

- Superpowers: approved brief, written implementation plan, dedicated branch, red/green tests, exact-head verification and review.
- Anthropic frontend-design: subject-specific identity, real content, purposeful composition and rejection of generic template scaffolding.
- Impeccable: Operate/Read modes, stable vertical reading/task paths, typography, contrast, responsive states and progressive disclosure.
- Emil Kowalski: motion only for feedback/state, short transitions and no transition: all.
- Matt Pocock: test-first implementation, public-contract assertions and small inspectable changes.
- Taste-skill principles were used for coherence and restraint. Its local checker was not run because this session had no local repository checkout. Unlazy/Ponytail-specific runtimes were not available and are not claimed as executed.
- Superdesign CLI preflight timed out twice before the user authorized proceeding without it. No Superdesign mockup is claimed.


## Follow-up refinement — 2026-11-11

The visual system now uses one palette-token source for page surfaces, ink and accents; legacy CSS variables are aliases rather than independent colour choices. The Hangul/IPA/Ukrainian specimen uses a stitched, irregular patch composition. Research analysis is selected with a three-stop strict/soft/super-soft slider and a live confidence explanation. Syllable traces are grouped into responsive data cards rather than a long left-aligned column. Prose paragraphs use a single text weight; hierarchy is carried by headings and controls.

The slider changes only the existing research-engine mode selection. No phonological rules, IPA values, Ukrainian correspondences, corpus data or linguistic claims changed.
