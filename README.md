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

## Complex-coda liaison audit (2026-10-10)

A follow-up NIKL source sweep added twelve exact regression cases for complex-coda liaison, fortis [ㅆ], and the conjugation patterns of `넓다` / `짧다`, including `넓어[널버]`, `넓으니[널브니]`, and `짧아[짤바]`. The new entries are narrow lexical controls, not general morphology guesses.

- [Read the audit report](docs/complex-coda-liaison-followup-2026-10-10.md)
- [Regression test](tests/adversarial-complex-coda-liaison-2026-10-10.test.mjs)

## NIKL audit: exceptions to automatic ㄴ insertion (2026-10-10)

A test-first audit exposed a missing standard surface form for `값있다[가빋따]`. Three lexical controls are now included: `값있다[가빋따]`, `곧이어[고디어]`, and `음용[으묭]`. They encode NIKL's caution that ㄴ insertion is not automatic in every similar phonological environment.

- [Audit report](docs/n-insertion-exceptions-audit-2026-10-10.md)
- [Regression test](tests/adversarial-n-insertion-exceptions-2026-10-10.test.mjs)

## NIKL Rule 29: liquid assimilation

Added eight official examples from the attached note to Rule 29, including `들일[들ː릴]`, `솔잎[솔립]`, `설익다[설릭따]`, `물약[물략]`, `불여우[불려우]`, `물엿[물렫]`, `휘발유[휘발류]`, and `유들유들[유들류들]`. The exact surface-form controls are source-backed; Ukrainian targets remain provisional.

- [Audit report](docs/rule29-liquid-assimilation-audit-2026-10-10.md)
- [Regression test](tests/adversarial-rule29-liquid-assimilation-2026-10-10.test.mjs)

## Pronunciation engines: browser and Python

### Browser service — JavaScript G2P (default practical mode)

The public GitHub Pages service now uses a browser-only, vendored subset adapted from `ntdgo/korean-pronunciation` 1.0.1, a JavaScript port of g2pK. It retains Korean rule tables and heuristic annotation while excluding the unused CMU English pronunciation dictionary, English transliteration, and numeral conversion. This avoids shipping a multi-megabyte dictionary to the browser. It runs locally without a server, Python, MeCab, network calls, or native binaries. Attribution and the Apache 2.0 license are bundled in `public/THIRD_PARTY_NOTICES.txt` and `public/LICENSES/Apache-2.0.txt`. The path is:

`Hangul input → JS G2P surface spelling → project IPA conversion → IPA-to-Ukrainian mapping`.

The browser preserves Latin text, digits, punctuation, and whitespace. The practical mode passes Korean-bearing spans through the pinned JavaScript port with `descriptive: false`, `groupVowels: false`, and `toSyl: true`; it does not apply project lexical surface or IPA overrides after G2P. Consequently, upstream port behavior—including known divergences from NIKL or Python g2pK—is preserved and tested as such. The separate **Research mode** continues to use the project's native evidence-gated engine and its research lexicon; those overrides do not leak into practical mode.

**Important limitation:** the JavaScript port implements rule-based G2P and idiom handling, but does not reproduce the original Python g2pK's MeCab-based morphological analysis. It is therefore a browser-compatible reference engine, not a claim of exact parity with Python g2pK on morphology-dependent homographs. Those cases must be covered by source-backed lexical controls and adversarial regression tests.

### Python / CLI / API

The Python package, CLI, and optional FastAPI backend can still use the original pinned g2pK engine. Its MeCab binding is tested on Python 3.11/3.12; on Python 3.13/3.14, use the native engine or a separate 3.11/3.12 environment. Install with `python -m pip install -e ".[g2pk]"`, then run `korean-ua analyze "넋이 굳이" --pronunciation-engine g2pk`. The native Python engine remains the default unless g2pK is explicitly selected; missing dependencies never trigger a silent fallback.

Both runtimes preserve the same methodological boundary: the Ukrainian target is generated from IPA, never by a parallel Hangul-to-Ukrainian substitution. See [the Python integration and validation boundary](docs/G2PK-INTEGRATION-2026-10-15.md).

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

The browser practical adapter uses the reduced browser-only G2P core; the native research adapter implements:

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


- Optional `morphology_mode=soft` (UI checkbox **М’яка морфологія**) may propose
  high-frequency formal-ending readings (이 / 을 / 어 / 았 / 고 / …) with status
  `heuristic-low-confidence`. Default remains **strict** (exact evidence only).
  Soft never selects §15 substantive neutralization and never licenses
  R009 / R010–R016. Full contract:
  [docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md](docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md).

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

**Research layer:** a tested research prototype with source-backed rule coverage, but incomplete independent IPA and target-language validation.

**Web layer:** a technically deployed research preview. Practical mode reproduces the pinned JavaScript g2pK port; it does not claim that every port result is normatively correct. The public UI warns users about known upstream divergences. The main deployment workflow now HTTP-smoke-tests the public index, methodology page, and JavaScript asset, then runs headless Chromium against the repository's 1,443-character adversarial Korean passage. This verifies live interaction and output presence, not normative pronunciation accuracy; a different user-supplied passage remains a separate acceptance input.

Neither layer claims official Ukrainian standardisation, exhaustive lexical attestation, acoustic narrow-IPA validation or independent expert adjudication without the corresponding evidence.

## License / attribution

The repository currently has **no root-level project-wide LICENSE file**. Do not infer a license for project-authored code or data from third-party notices. The vendored browser g2pK-derived code is attributed and its Apache-2.0 license is bundled in public/THIRD_PARTY_NOTICES.txt and public/LICENSES/Apache-2.0.txt. A project-wide license remains an owner decision.


### Surface regression source adjudication (2026-10-21)

The 20-case practical-port fixture separates the pinned JavaScript output from NIKL normative comparators. Nineteen comparators are directly attested official examples/Q&A; one (`숲이`) remains rule-derived and is not treated as a direct lexical attestation. Independently adjudicated IPA gold remains 0/20, and Ukrainian target review is separate. See the [source-adjudication report](docs/audits/SURFACE-REGRESSION-SOURCE-ADJUDICATION-2026-10-21.md) and [metadata regression test](tests/normative-surface-evidence-fixture.test.mjs).

### Model-wide target consistency audit

The lexical layer has a dedicated regression suite for Ukrainian target segmentation, non-duplication of fortisness, word-initial onset choices, and IPA/target consistency in high-risk forms.

- [Audit summary on the methodology page](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#model-wide-target-consistency)
- [Regression tests](tests/model-wide-target-consistency.test.mjs)

## Research programme and completion roadmap

The durable project plan, evidence registers, rule-coverage matrix, architecture decisions, and release acceptance criteria are maintained in the repository so that work can continue consistently across sessions.

- [Research programme index](research/README.md)
- [Master directive](research/MASTER-DIRECTIVE.md)
- [Staged roadmap and current work queue](research/ROADMAP.md)
- [External source register](research/SOURCE-REGISTER.csv)
- [Rule-to-implementation coverage matrix](research/RULE-COVERAGE.csv)
- [Architecture decision log](research/DECISION-LOG.md)
- [Release acceptance gates](research/ACCEPTANCE-GATES.md)

The initial Phase 0 reconstruction is substantially complete for the current mainline: current CI covers browser tests/build, Python 3.11/3.12/3.13, corpus artifacts and system verification. Remaining acceptance gaps and their evidence are tracked in the handoff, completion audit, and research/ACCEPTANCE-GATES.md.


## Official NIKL Standard Pronunciation Rules collector

The metadata-first collector for the official Korean-language norms portal is implemented in [scripts/nikl-norm-crawler.mjs](scripts/nikl-norm-crawler.mjs). It scopes extraction to the 30 articles in 제2부 표준 발음법, checks robots.txt, records source/HTTP and per-article hashes, and fails closed on incomplete inventories. By default it stores metadata only; source terms remain explicitly unassessed and article text is not retained. See the [collector guide](docs/NIKL-NORM-CRAWLER.md) and run `npm run crawl:nikl` locally when network/policy checks are available. If automated access is denied but the official page opens normally in a browser, the collector also supports an auditable `--input-html` import that does not claim a live fetch. The live crawl remains subject to source availability; the collector uses the canonical official desktop full-text route, and HTTP 403 remains a documented BLOCKED state rather than a reason to bypass access controls. For the remaining cited Q&A/FAQ pages, [the metadata-only batch importer](scripts/nikl-evidence-import.mjs) can inventory ordinary browser-saved official pages without retaining page text or marking citations reviewed; see [the batch-import guide](docs/NIKL-EVIDENCE-BATCH-IMPORT.md). The three cited NIKL-hosted PDFs have a separate local binary-metadata intake ([guide](docs/NIKL-PDF-IMPORT.md), `npm run template:nikl-pdf`, `npm run import:nikl-pdf`) that never extracts document text or asserts claim support.

## Repository-local agent skills

Specialized agent workflows for official NIKL scraping, article-by-article rule coverage, and evidence-gated pronunciation adjudication are documented in [docs/AGENT-SKILLS-NIKL.md](docs/AGENT-SKILLS-NIKL.md) and installed under `.agents/skills/`. These are workflow instructions; they do not claim that a live crawl or new linguistic validation has already run.
