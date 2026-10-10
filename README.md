# Korean–Ukrainian Phonetic System

Research-grade, machine-readable framework for Korean → Ukrainian phonetic-graphemic correspondence, now with a two-page browser service.

## Public web service

The project has two public-facing pages:

- **Service** — Korean text → practical Ukrainian reading.
- **System** — explanation of the author's Ukrainian system, methodology, evidence and limitations.

- [Open the live service](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/index.html)
- [Read the methodology and edge-case registry](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#lexical-edge-cases)

The service is intentionally modelled on the functional architecture of the Chinese-for-Ukrainians project: the tool is the centre of the page, typography carries hierarchy, results are inspectable and there is no marketing/AI decoration.

The Korean visual identity uses South Korean national colours: Taegeuk red #CD2E3A and Taegeuk blue #0047A0.

## Sentence-level adversarial corpus

The system page now publishes a five-line running-text test corpus that stresses complex-coda liaison, coda neutralization, fortition, palatalization, the particle `의`, and the contracted form `설명했어요`. The regression fixture and tests keep the normative Korean surface form separate from the provisional Ukrainian target.

- [View the corpus on the live methodology page](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#sentence-adversarial-corpus)
- [Corpus fixture](tests/fixtures/adversarial-sentence-corpus.txt)
- [Regression tests](tests/adversarial-sentence-corpus.test.mjs)

A third adversarial window adds a longer text stressing `흙을`, `밟으며`, `낡은`, `놓인`, `맑은`, `햇빛이`, `젊은`, `신라`, `설날`, `독립문`, and `종로`. It records Korean surface-form controls separately from Ukrainian target choices.

- [Third corpus on the live methodology page](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#third-adversarial-corpus)
- [Third corpus fixture](tests/fixtures/adversarial-sentence-corpus-3.txt)
- [Third corpus tests](tests/adversarial-sentence-corpus-3.test.mjs)

Passing tests demonstrates reproducibility of declared model outputs and absence of unresolved placeholders in this fixture; it does not validate the Ukrainian approximations through an independent reader study.

## Scientific pipeline

Korean orthography → Korean phonology → contextual rules → Korean surface representation / IPA → Ukrainian phonetic target → Ukrainian orthography

The web service is a practical runtime projection of this research model. It is **not** an official Ukrainian national standard and it does not translate Korean meaning. Ukrainian correspondences are model decisions: for example, ㅎ → г is a documented approximation with a stated phonetic trade-off, not a claim of exact equivalence.

## Research layers

- Unicode Hangul decomposition/composition.
- Exact 19 × 21 × 28 = 11,172 modern precomposed Hangul blocks.
- Modern Jamo inventory and structured onset/nucleus/coda representation.
- 11 complex codas as explicit component sequences.
- Rule registry R001–R016 with evidence/provenance.
- Context-sensitive sequence corpus.
- Ukrainian target layer separated from Ukrainian graphemic realization.
- Comparative Slavic evidence with provenance controls.
- Adversarial regression tests and reproducible generated artifacts.
- Shared, provenance-carrying lexical pronunciation overrides for high-risk exceptions (see [lexical coverage audit](docs/LEXICAL-PRONUNCIATION-COVERAGE-2026-10-09.md)).

## Web runtime boundary

The browser adapter implements:

- Unicode-safe Hangul decomposition;
- canonical onset/vowel/coda mappings from data/korean/canonical_correspondence.csv, including the explicitly model-selected onset target ㅎ [h] → Ukrainian г [ɦ] (glottal place retained, voicelessness not retained);
- ㅅ/ㅆ → ш in the relevant i/j-like environments;
- simple-coda liaison where the outcome is unambiguous, and exact sourced complex-coda pronunciations; codas whose representative changes under §15 are withheld before ㅏ/ㅓ/ㅗ/ㅜ/ㅟ when morphology is unknown; unknown non-ㅎ complex-coda + vowel sequences are also marked unresolved; ㄶ/ㅀ retain their special ㅎ behavior;
- ㅎ deletion and ㅎ-driven aspiration; §12(4) ㅎ/ㄶ/ㅀ deletion before vowels is resolved through exact sourced lexical entries, and unknown morphology-dependent forms are marked unresolved; the direct complex-coda + ㅎ suffix pattern is also lexical-evidence gated;
- nasal assimilation, liquid assimilation and palatalization in the documented environments; §§18–20 assimilation can cross plain whitespace as connected phrase speech, but punctuation blocks cross-boundary rules;
- selected lexical coda exceptions such as 밟- and 넓죽-/넓둥글-/넓적- where standard pronunciation cannot be inferred from the coda inventory alone;
- selected contextual voicing;
- practical tensification neutralization;
- normative [ɰi] default for ㅇ+ㅢ, [i] for consonant-onset ㅢ, and documented optional readings;
- preservation of non-Hangul text;
- an inspectable rule/status trace.

It deliberately does **not** claim to be a complete lexical, morphological or acoustic Korean pronunciation engine. Research-layer rules that require lexical or morphological licensing remain outside the browser's automatic scope. For §17 palatalization, the browser accepts exact sourced lexical entries; an unlisted ㄷ/ㅌ/ㄾ + 이-looking sequence is marked unresolved instead of inferring a formal-morpheme boundary from spelling alone. The Python §29 n-insertion rule requires a full-form and pair-specific license rather than a global boolean. The Python research layer and browser both require exact full-form/pair evidence for morphologically ambiguous complex-coda liaison and for simple-coda cases where §15 neutralization could change the result; sourced lexical entries cover known examples.

## Exhaustive Hangul inventory

19 × 21 × 28 = **11,172 modern Hangul syllable blocks** are generated deterministically.

This is a Unicode combinatorial inventory, not a lexical dictionary and not 11,172 unique pronunciations.

Generate the research artifacts with:

    python scripts/generate_korean_corpus.py --strict

## Development

Requirements: Node.js 22+ and Python 3.11+ for the research layer.

Web service:

    npm install
    npm test
    npm run build
    npm run dev

The GitHub Pages workflow in `.github/workflows/deploy-pages.yml` runs browser tests, Python pipeline/data-integrity tests, builds the static site, and deploys the `dist/` artifact on pushes to `main`.
Research layer:

    python scripts/generate_korean_corpus.py --strict
    pytest

## Documentation

### Research
- docs/NIKL-STANDARD-PRONUNCIATION-AUDIT-2026-10-09.md — article-by-article audit of all 30 official Standard Pronunciation Rules, implementation boundary, and regression cases
- docs/USER-CORPUS-REGRESSION-AUDIT-2026-10-10.md — regression audit for the user-supplied Korean corpus, with high-priority normative surface readings and release acceptance criteria
- The web interface now shows a separate **Нормативна корейська вимова** line for exact source-backed lexical entries; it is kept distinct from the provisional Ukrainian transcription. The user corpus has new §9–§23 regression fixtures and explicit surface-reading assertions.
- docs/methodology.md
- docs/slavic-comparative-master-table.md
- docs/comparative-evidence-methodology.md
- docs/multilevel-corpus.md
- docs/superpowers/specs/2026-10-04-korean-ukrainian-target-design.md
- docs/superpowers/plans/2026-10-04-korean-ukrainian-target-implementation.md

### Web service
- docs/WEB-SERVICE-REQUIREMENTS.md
- docs/WEB-SERVICE.md
- docs/WEB-SERVICE-ARCHITECTURE.md
- docs/WEB-SERVICE-QA.md
- docs/WEB-SERVICE-USER-GUIDE.md

## Research integrity

The repository explicitly distinguishes:

- source-language fact;
- documented external system;
- project model decision;
- conditional rule;
- hypothesis;
- unresolved analysis.

Missing evidence is not converted into a fabricated one-to-one correspondence.

## Status

**Research layer:** computationally research-ready within its documented evidence boundary.

**Web layer:** public-service implementation with a deliberately documented runtime boundary.

Neither layer claims official Ukrainian standardisation, exhaustive lexical attestation, acoustic narrow-IPA validation or independent expert adjudication without the corresponding evidence.

## License / attribution

See repository metadata and source files for the current licensing and attribution terms.


### Model-wide target consistency audit

The lexical layer has a dedicated regression suite for Ukrainian target segmentation, non-duplication of fortisness, word-initial onset choices, and IPA/target consistency in high-risk forms.

- [Audit summary on the methodology page](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#model-wide-target-consistency)
- [Regression tests](tests/model-wide-target-consistency.test.mjs)
