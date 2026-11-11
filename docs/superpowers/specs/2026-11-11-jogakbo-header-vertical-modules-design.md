# Jogakbo Header & Vertical Modules — design brief

Date: 2026-11-11
Supersedes the visual direction in `2026-11-11-seoul-type-system-redesign.md` only where the two conflict.
Surface modes: Service — Operate; Methodology — Read.

## Product and audience

The service takes Korean text, resolves supported pronunciation, exposes an inspectable IPA boundary, and adapts the result to Ukrainian practical orthography. Its audience is Ukrainian-speaking readers and learners who paste words or longer passages, compare the pronunciation path, and copy the Ukrainian result. The service is a working tool, not a promotional landing page.

## User-approved visual direction

Use Korean jogakbo (조각보) as a restrained visual reference for the site header only. Translate its patchwork logic into a small composition of unequal rectangular colour fields separated by visible, precise seams. Do not turn the entire page, input/result surfaces, or methodology content into a patchwork collage. Avoid literal fabric textures, faux hanji grain, flags, Taegeuk, random Jamo, or decorative Korean text.

Below the header, use a calm, vertical editorial structure. Modules stack from top to bottom. Each module contains at least one real product/content object (input field, output, diagram, table, example, control) and adjacent or following explanation that tells the reader what it is and how to use or interpret it. Explanatory content must not compete with the primary object.

## Service page structure

1. Header: brand, navigation and the jogakbo patchwork band. Keep it compact and responsive.
2. Hero: explain the service plainly; keep the three-stage Hangul → IPA → Ukrainian specimen as a distinct editorial object, not patchwork.
3. Input module: the existing Korean textarea and its examples/mode controls remain intact. Add a short, plain-language explanation of what to enter and what the selected mode changes. No placeholder or text inside the textarea.
4. Output module: the result window remains below the input at every viewport. Add concise guidance explaining the Ukrainian result and the supporting IPA/RR/Hanja/trace objects. Keep the Ukrainian result visually primary.
5. Existing result controls, uncertainty/provenance, trace, clipboard recovery, spelling suggestions and keyboard behavior remain unchanged.

## Methodology page structure

1. Reuse the same header identity and navigation.
2. Keep the page in a single top-to-bottom reading flow: introduction, contents, then method modules in the existing logical order.
3. Each major module pairs an explanatory passage with at least one relevant object already present or added where genuinely useful: pipeline/layers, source-rule example, IPA mapping, comparison, evidence table, or limitations example.
4. Use existing IDs and anchors. Preserve the detailed research content and its evidence boundaries; do not rewrite technical claims as marketing copy or simplify away caveats.
5. Tables and dense comparison objects may scroll horizontally on small screens, but modules themselves must not become side-by-side columns.

## Visual system

- Header patchwork palette: ink-indigo `#24354B`, muted jade `#9DB7A7`, dusty mineral blue `#A9BAC6`, warm ochre `#C9A66B`, clay rose `#B9857A`, and warm ivory `#F1EEE5`. Seams use the page ground, not shadows.
- Main surfaces: restrained warm neutral background, dark ink text, quiet rules, and clear action contrast. Existing accent tokens may remain where needed for controls and semantic result states.
- Typography: retain the current locally available Noto Sans KR / Noto Sans stack and deliberate Hangul, IPA and Ukrainian roles. No remote font or asset dependency.
- Composition: vertical modules, readable prose measure, varied spacing by hierarchy, no repeated identical card scaffolds, no decorative eyebrow labels, no object caption strips, no fake metrics, no gradients or glassmorphism.
- Motion: only short action feedback; no decorative entrance sequence or scroll choreography. Use explicit animated properties and honour reduced motion.

## Non-goals and invariants

- No conversion, pronunciation, phonology, IPA adapter, target mapping, corpus, benchmark, or runtime-dependency changes.
- No renaming/removal of existing DOM IDs, form names, data hooks, accessibility labels, or JS entry points.
- Preserve the textarea without placeholder and keep the input above the output.
- Preserve the local-only Content Security Policy and two-page GitHub Pages architecture.
- Preserve existing language-specific result semantics, uncertainty and provenance.

## Acceptance

- The jogakbo visual appears in the header only, with unequal rectangular patches and clear seams; it does not appear as a repeating motif in content modules.
- Service and methodology pages use the same header treatment.
- Service modules read top-to-bottom; the Korean input object precedes the answer object at 1440, 1024, 768, 390 and 320px.
- Each service module has a real object and concise usage/interpretation guidance.
- Methodology content remains a single vertical sequence; major modules expose a relevant object and explanation without altering evidence claims.
- Existing DOM hooks and functional contracts remain intact.
- Text contrast meets WCAG AA for normal text; keyboard focus, touch targets, reduced motion, 320px overflow and long-content wrapping remain correct.
- Node tests, production build, source-rights gate, and rendered browser review run on the exact final branch head. Pages deployment/live smoke is checked if CI permissions and workflow triggers allow it.

## Approaches considered

1. Patchwork throughout the site — rejected because it competes with the tool's task flow and makes dense methodology harder to read.
2. Pure Seoul Type with no textile reference — superseded by the user's clarified preference for jogakbo in the header.
3. Header-only jogakbo plus vertical editorial modules — selected. It gives the project a distinctive Korean cultural reference while keeping the actual work and methodology linear, legible and task-first.

## Skill guidance applied

Anthropic frontend-design: subject-specific identity, deliberate typography, real copy, no generic template scaffolding.
Taste-skill: coherent visual system, one strong signature, useful real objects, restrained motion and browser verification. Its local checker cannot be run in this connector-only workspace.
Impeccable: Operate/Read modes, vertical reading/task path, contrast, typography, responsive states and progressive disclosure.
Emil Kowalski: motion only for feedback/state, short durations, explicit properties, no `transition: all`.
Superpowers: approved brief, implementation plan, test-first changes and verification before claims.
mattpocock: shared project vocabulary and small, inspectable engineering steps. Other named optional tools were not available in this environment and are not represented as executed.
