# Korean–Ukrainian Phonetic System

Research-grade, machine-readable framework for Korean → Ukrainian phonetic-graphemic correspondence, now with a two-page browser service.

## Public web service

The project has two public-facing pages:

- **Service** — Korean text → two Ukrainian transliteration results, shown together: one via IPA and one via Revised Romanization (RR).
- **System** — full researcher-facing methodology: the g2pK ordinary path, the three Kozak Kim modes, IPA-first Ukrainian adaptation, RR/Hanja side layers, benchmarks, tests, evidence and limitations.

- [Open the live service](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/index.html)
- [Read the methodology and edge-case registry](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#methodology-02c-kozak-kim)

The service is intentionally modelled on the functional architecture of the Chinese-for-Ukrainians project: the tool is the centre of the page, typography carries hierarchy, results are inspectable and there is no marketing/AI decoration.

The Korean visual identity uses South Korean national colours: Taegeuk red #CD2E3A and Taegeuk blue #0047A0.

## Output and engine contract

The primary Ukrainian result is the project's existing author-developed Ukrainian transliteration / practical rendering system. In this project, *Ukrainian transliteration* means a practical Ukrainian-letter rendering guided by Korean pronunciation and the project's research rules; it is not literal character-by-character Hangul substitution, a translation, or the IPA representation itself. The IPA-mediated Ukrainian route and the separate Revised Romanization (RR)-mediated route remain distinct, are displayed simultaneously, and expose their separate provenance and uncertainty. Ordinary browser mode uses the pinned JavaScript g2pK port; detailed research mode uses the project-owned deterministic Kozak Kim engine. The browser now exposes two separately labelled IPA fields: surface phonetic IPA from the selected engine, and an orthography-derived phonemic baseline. The latter mirrors the Python phonemic inventory but does not resolve morphology or prosody; it is not a second G2P engine or a fully adjudicated phonemic analysis.

The default linguistic scope is standard South Korean. Hanja is available in both directions: Hangul→Hanja lexical annotation and a separate Hanja→Hangul reading workbench. The reverse workbench loads the pinned local dictionary on demand, preserves unknown spans, exposes multiple readings instead of guessing, and lets the user edit a reading before transferring it to the main Korean input. This remains dictionary lookup, not contextual word-sense disambiguation; coverage and ambiguity rates still need evaluation.

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

## Benchmark review after renderer integration (2026-10-24)

- [Consolidated benchmark review, exact metrics, interpretation and remaining gates](docs/BENCHMARK-REVIEW-2026-10-24.md)
- [Current Korean benchmark suite register](docs/KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md)
- [Methodology claims-and-evidence register](docs/METHODOLOGY-CLAIMS-AND-EVIDENCE-REGISTER-2026-10-30.md)
- [Methodology review and adjudication record](docs/METHODOLOGY-DEBATE-REVIEW-2026-10-30.md)

## Teacher-guided improvement of the neural-free Strict engine (2026-10-26)

CharsiuG2P can be used as a research teacher to identify contexts where a deterministic engine disagrees with a neural model; it is not added to the Strict runtime. The new offline tool `scripts/mine_deterministic_rule_candidates.py` preserves raw outputs, records model/data provenance, rejects known benchmark/holdout splits, and produces review-only context associations. It does not generate or activate rules automatically. A rule can enter production only after independent NIKL/source review, positive and negative-control tests, and a separate development-set improvement.

- [Teacher-guided rule-discovery protocol and acceptance gates](docs/TEACHER-GUIDED-STRICT-RULE-MINING-2026-10-26.md)
- [Rule candidate mining script](scripts/mine_deterministic_rule_candidates.py)
- [Regression tests](tests/test_mine_deterministic_rule_candidates.py)
- [Pinned train/dev corpus builder](scripts/prepare_korean_g2p_corpus.py) — emits provenance-bearing SIGMORPHON JSONL while preserving raw tokenized IPA; test records are never exported.
- [Corpus preparation tests](tests/test_prepare_korean_g2p_corpus.py)
- [Conservative UGTPHON Korean token corpus builder](scripts/prepare_ugtphon_korean_corpus.py) — uses aligned token-level fields and excludes ambiguous/noisy targets rather than guessing.
- [UGTPHON preparation tests](tests/test_prepare_ugtphon_korean_corpus.py)
- [Research-only UGTPHON raw-surface normalization + G2P benchmark](scripts/benchmark_ugtphon_ko_surface.py) — train-only exact-match lookup, raw token.text input, A/B/C breakdown, canonical false-rewrite risk; separate from canonical G2P scoring.
- [UGTPHON surface benchmark tests](tests/test_ugtphon_surface_benchmark.py)
- [Cross-corpus overlap and target-compatibility audit](scripts/audit_korean_corpus_compatibility.py) — reports source-form intersections and raw target-string relations without merging incompatible IPA conventions.
- [Compatibility audit tests](tests/test_audit_korean_corpus_compatibility.py)
- [Scratch G2P teacher training](scripts/train_korean_g2p_teacher.py) — trains from random initialization on SIGMORPHON train, selects on dev, and never loads test or pretrained weights.
- [Scratch teacher tests](tests/test_train_korean_g2p_teacher.py)
- [Dev-only teacher error analyzer](scripts/analyze_korean_g2p_teacher_errors.py) — groups errors by token sequence, length-mark differences, and source shape without producing rules.
- [Teacher error-analysis tests](tests/test_analyze_korean_g2p_teacher_errors.py)
- [CPU training workflow](.github/workflows/train-korean-g2p-teacher.yml) — uploads a short-lived research checkpoint and dev-only predictions.

**Metric interpretation:** the latest saved checkpoint is 59.6% (596/1,000) exact token-sequence match of the separate, randomly initialized research-only GRU teacher on the SIGMORPHON dev convention. A distinct earlier checkpoint trained on the same pinned 8,000-row train / 1,000-row dev data scored 60.2% (602/1,000); the checkpoint hashes differ, so these are run-to-run training variation, not conflicting dataset versions. Neither score is an accuracy measure for the deterministic ClippyFirst Strict engine, the browser G2P path, the IPA-to-Ukrainian adapter, or Ukrainian transliteration. The dev split selected the checkpoint, so neither score is an independent final evaluation. A valid Strict-versus-teacher score remains blocked until the source IPA conventions are independently mapped and a separate eligible evaluation set is established.

The current CharsiuG2P checkpoint's weights-license status and training-data overlap remain unresolved. Do not redistribute its weights or use test/holdout predictions to tune Strict.

## Research-only morphological analyzers (2026-10-24)

The Python research package has optional adapters for [Kiwi](https://github.com/bab2min/kiwi) and MeCab-Ko. The adapters return inspectable morpheme forms, tags and source offsets; the separate `morphology_rule_licenses.py` layer can consume two analyzer results and emit **low-confidence, exact-form licenses** for source-backed R002/R003/R007 and stem rules R010/R011/R016. It can also extend a registered R012/R014/R015 lexical root across a particle/ending only when both analyzers agree on that attached grammatical boundary. This is not pronunciation gold, not a default runtime path, and does not automatically certify IPA or Ukrainian output. The public browser practical mode does not load or call these adapters.

- [Research morphology integration contract and acceptance gates](docs/RESEARCH-MORPHOLOGY-ADAPTERS-2026-10-24.md)
- Adapter: `src/korean_ukrainian/research_morphology.py`
- Tests with fake engines: `tests/test_research_morphology.py`
- Diagnostic inputs (unlabelled, not gold): `data/korean/morphology-review-corpus.txt`
- Diagnostic runner on the 16-item review list: `scripts/benchmark_research_morphology.py`
- [Paired full-corpus IPA/morphology benchmark and measured results](docs/RESEARCH-MORPHOLOGY-ADAPTERS-2026-10-24.md#same-corpus-benchmark-results--2026-10-24): `scripts/benchmark_morphology_ipa_delta.py`
- Pairwise Kiwi-vs-MeCab boundary comparison (agreement is not accuracy): `scripts/compare_morphology_analyzers.py`
- [Consensus morphology rule-license adapter](src/korean_ukrainian/morphology_rule_licenses.py) and [regression tests](tests/test_morphology_rule_licenses.py).

The pinned UGTPHON benchmark found that the existing native soft mode raised coverage from 98.22% to 99.04% but lowered exact-match rate from 24.41% to 24.28% and slightly worsened CER. Kiwi and MeCab-Ko each analyzed all 1,907 unique words, but their outputs are not yet used by the IPA engine. See the report for detailed limits and pairwise boundary agreement.

Install Kiwi with `uv pip install -e '.[research-kiwi]'`; install MeCab-Ko bindings with `uv pip install -e '.[research-mecab-ko]'`. A real-engine CI smoke run successfully installed and ran both adapters against the 16-input diagnostic list (Kiwi: 40 tokens; MeCab-Ko: 37 tokens). These counts and runtime are diagnostic only, not accuracy metrics: no independently adjudicated gold segmentation/POS set exists. The MeCab adapter records its selected binding and never substitutes a different analyzer family; see the research document for the evidence gates.

## Pronunciation engines: browser and Python

### Browser service — JavaScript G2P (default practical mode)

The public GitHub Pages service now uses a browser-only, vendored subset adapted from `ntdgo/korean-pronunciation` 1.0.1, a JavaScript port of g2pK. It retains Korean rule tables and heuristic annotation while excluding the unused CMU English pronunciation dictionary, English transliteration, and numeral conversion. This avoids shipping a multi-megabyte dictionary to the browser. It runs locally without a server, Python, MeCab, network calls, or native binaries. Attribution and the Apache 2.0 license are bundled in `public/THIRD_PARTY_NOTICES.txt` and `public/LICENSES/Apache-2.0.txt`. The path is:

`Hangul input → JS G2P surface spelling → project IPA conversion → IPA-to-Ukrainian mapping`.

The browser preserves Latin text, digits, punctuation, and whitespace. The practical mode passes Korean-bearing spans through the pinned JavaScript port with `descriptive: false`, `groupVowels: false`, and `toSyl: true`, then applies exact-form NIKL-backed Korean-surface corrections before IPA for `값어치`, `넓죽하다`, `넓둥글다`, `넓적하다`, `읽고`, and `싫어서`; the dictionary reading for the exact form `수많은` is also preserved as `수마는` with lexical length `ː` retained in inspectable IPA and explicitly reported in the per-syllable target feature-loss trace. For `멋있어`, the adapter may expose the other official surface variant only when the current surface is one of NIKL's two attested readings and the alternative IPA-to-target mapping is fully supported; generated alternatives are marked `lexical-review`, not gold. The vendored port and its raw-output regression fixture remain unchanged so upstream divergences stay inspectable. No general phonological override is inferred from these forms, and the Ukrainian target is still generated from IPA rather than directly from Hangul. The separate **Research mode** continues to use the project's native evidence-gated engine and research lexicon.

**Important limitation:** the JavaScript port implements rule-based G2P and idiom handling, but does not reproduce the original Python g2pK's MeCab-based morphological analysis. It is therefore a browser-compatible reference engine, not a claim of exact parity with Python g2pK on morphology-dependent homographs. Those cases must be covered by source-backed lexical controls and adversarial regression tests.

### Python / CLI / API

The native Python research pipeline uses the **author-owned ClippyFirst IPA-to-Ukrainian renderer** in `src/korean_ukrainian/ipa_target_renderer.py` for practical output. It consumes source IPA only and applies this repository's canonical correspondence table plus explicit, traceable sequence overrides. The separate `ClippyFirst/Ukrainian-Phonetic-Inventory` package (expected version `0.8.0`) remains optional and is used only for Ukrainian feature/candidate diagnostics, never to choose the practical output. See [the target-layer contract](docs/ukrainian-target-layer.md).

The browser renderer uses a generated projection of the same two CSV sources; it carries mapping IDs/statuses into the trace and reports provisional target mappings separately from Korean pronunciation status. Regenerate with `npm run generate:ipa-target-data` and verify no drift with `npm run check:ipa-target-data` (also enforced by Python tests).

A clean installation can therefore render IPA sequences covered by local correspondence data without UPI. If UPI is unavailable, its candidate-analysis diagnostics are marked unavailable separately; this does not make unmapped IPA renderable or validate the Ukrainian mapping linguistically. Stored lexical Ukrainian forms remain audit references only and never bypass the IPA boundary.

**Native IPA status contract:** `phoneticize_korean()` and `transliterate_korean()` expose `ipa_status`, `ipa_is_diagnostic_only`, and `ipa_status_reason` at the analysis root and mirror equivalent `status`, `is_diagnostic_only`, and `status_reason` fields inside the IPA object. When a source/morphology-dependent context cannot be resolved, the IPA string remains available for inspection but is explicitly marked `diagnostic_only_unresolved_pronunciation`; Ukrainian target selection is blocked and the rendered target is `null`. Otherwise the result is `provisional`, not expert-adjudicated gold. Consumers must check the status fields rather than treating the presence of an IPA string as proof of a resolved pronunciation.

The Python package, CLI, and optional FastAPI backend can still use the original pinned g2pK engine. Its MeCab binding is tested on Python 3.11/3.12; on Python 3.13/3.14, use the native engine or a separate 3.11/3.12 environment. Install with `python -m pip install -e ".[g2pk]"`, then run `korean-ua analyze "넋이 굳이" --pronunciation-engine g2pk`. The native Python engine remains the default unless g2pK is explicitly selected; missing dependencies never trigger a silent fallback.

Both IPA-first runtimes preserve the same methodological boundary: the phonetic Ukrainian target is generated from IPA, never by a parallel Hangul-to-Ukrainian substitution. The browser-only RR mode below is an explicitly separate orthographic-intermediary route; it is not part of the Python CLI/API. See [the Python integration and validation boundary](docs/G2PK-INTEGRATION-2026-10-15.md).

## RR-mediated Ukrainian output (2026-10-31)

The browser service adds a distinct **Revised Romanization → Ukrainian** route alongside the existing IPA-mediated Ukrainian route. Both Ukrainian results are computed and displayed simultaneously; selecting RR as the primary route does not hide the IPA result or either trace. The RR route uses both the original Hangul spelling and the resolved Korean surface form: surface changes drive the NIKL-based pronunciation-sensitive rules, while source spelling is retained for NIKL's explicit orthographic exceptions. It then maps typed onset/nucleus/coda units through `data/korean/rr_ukrainian_correspondence.csv` and `data/korean/rr_ukrainian_context_rules.csv`. The trace records sentence index, sentence-local word order, syllable position, left/right context, preceding coda class, onset origin, source-to-surface alignment and selected rule. Right context is currently audit-only; selection uses the left coda class and word/sentence position. Sixteen voiced-medial lenis cases expose an unvoiced alternative; eight sentence-medial word-initial cases expose a voiced alternative because punctuation and spaces do not identify the accentual-phrase boundary. The base lenis correspondences are unvoiced; context rules select voiced Ukrainian candidates after vowels/sonorants. Phonemic aspirates ㅋ/ㅌ/ㅍ/ㅊ use the apostrophe marker (к&#39;/т&#39;/п&#39;/ч&#39;), while fortis doubling is explicitly a project marker for tenseness, not gemination. The RR `ui` unit for ㅢ remains unchanged: [i] is selected for consonantal onset, while [ɰi] remains the default for null-onset contexts and [i] is exposed as an allowed noninitial variant. Alignment distinguishes lexical onset from unambiguous simple-coda resyllabification (협의 [혀븨/혀비]); complex codas and ㅎ-conditioned changes remain explicitly ambiguous until separately verified. Five vowel collision groups are declared in the correspondence table and surfaced in the trace (ㅓ/ㅗ, ㅕ/ㅛ, ㅐ/ㅔ, ㅒ/ㅖ, ㅙ/ㅚ/ㅞ); the RR layer preserves the distinct units even where practical Ukrainian output merges them. Unknown alignment exposes alternatives rather than guessing. Sentence position informs word-initial alternatives but does not replace accentual-phrase analysis. The RR path remains separate from Kozak Kim IPA-first output. Ukrainian mappings remain project proposals, not an official standard or independently validated gold.

- [RR methodology and full correspondence tables](system.html#methodology-02b-ukrainian-rr)
- Implementation: `src/app/romanization.js`, `src/app/romanization_target.js`
- Regression tests: `tests/romanization-target.test.mjs`

## Scientific pipeline

**Phonetic mode:** Korean orthography → Korean phonology → contextual rules → Korean surface representation / IPA → Ukrainian phonetic target → Ukrainian orthography

**Browser-only RR mode:** source Hangul spelling + resolved surface form → NIKL-based RR units (including explicit source-spelling exceptions) → Ukrainian RR correspondence table → Ukrainian orthography

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

The Python CLI and FastAPI expose this choice explicitly; strict remains the default, and soft-mode rule traces remain low-confidence. Examples:

```sh
korean-ua analyze "좋아" --morphology-mode strict
korean-ua analyze "좋아" --morphology-mode soft
```

For the API, send `"morphology_mode": "soft"` with `"pronunciation_engine": "native"` to `/v1/transliterate`. The `g2pk` engine does not accept this native morphology setting. Compare modes with the pinned diagnostic workflow and inspect both coverage and coverage-adjusted exact match; do not judge the soft mode by abstention count alone. See [the native abstention audit](docs/NATIVE-ABSTENTION-AUDIT-2026-10-25.md).

The native Python R009 implementation additionally applies a finite, exact-form license list for examples explicitly enumerated in NIKL §29 (including 한여름, 솜이불, 꽃잎, 색연필, 서울역); listed cross-word examples require explicit `boundary_mode="phrase"`. This is not a productive n-insertion heuristic: unlisted forms still require exact licensing. See [the native Rule 29 license audit](docs/NATIVE-ENGINE-NIKL-RULE-29-EXACT-LICENSES-2026-10-23.md).

The native Python engine also has exact, source-backed Rule 28 compound-fortition and Rule 30 saisiot licenses for listed examples; each license is full-form and pair-specific, and ambiguous homographs are not automatically guessed. See [the Rule 28/30 license audit](docs/NATIVE-ENGINE-NIKL-RULE-28-30-EXACT-LICENSES-2026-10-23.md).

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
- The web interface now shows a separate **Нормативна корейська вимова** line for exact source-backed lexical entries; it is kept distinct from the provisional Ukrainian transliteration. The user corpus has new §9–§23 regression fixtures and explicit surface-reading assertions.
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

**Web layer:** a technically deployed research preview. Practical mode uses the pinned JavaScript g2pK port plus seven exact-form NIKL-backed Korean-surface corrections applied before IPA, a dictionary length overlay for `수많은`, and a conditional `멋있어` variant candidate; the raw port remains independently regression-tested. Other outputs may still diverge from the standard, and neither IPA nor Ukrainian adaptation has an independent full gold set. The public UI states these limitations. The main deployment workflow now HTTP-smoke-tests the public index, methodology page, and JavaScript asset, then runs headless Chromium against the repository's 1,443-character adversarial Korean passage. This verifies live interaction and output presence, not normative pronunciation accuracy; a different user-supplied passage remains a separate acceptance input.

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
- [Korean G2P engine improvement research (2026-11-01)](docs/KOREAN-G2P-ENGINE-IMPROVEMENT-RESEARCH-2026-11-01.md)

The initial Phase 0 reconstruction is substantially complete for the current mainline: current CI covers browser tests/build, Python 3.11/3.12/3.13, corpus artifacts and system verification. Remaining acceptance gaps and their evidence are tracked in the handoff, completion audit, and research/ACCEPTANCE-GATES.md.


## Official NIKL Standard Pronunciation Rules collector

The metadata-first collector for the official Korean-language norms portal is implemented in [scripts/nikl-norm-crawler.mjs](scripts/nikl-norm-crawler.mjs). It scopes extraction to the 30 articles in 제2부 표준 발음법, checks robots.txt, records source/HTTP and per-article hashes, and fails closed on incomplete inventories. By default it stores metadata only; source terms remain explicitly unassessed and article text is not retained. See the [collector guide](docs/NIKL-NORM-CRAWLER.md) and run `npm run crawl:nikl` locally when network/policy checks are available. If automated access is denied but the official page opens normally in a browser, the collector also supports an auditable `--input-html` import that does not claim a live fetch. The live crawl remains subject to source availability; the collector uses the canonical official desktop full-text route, and HTTP 403 remains a documented BLOCKED state rather than a reason to bypass access controls. For the remaining cited Q&A/FAQ pages, [the metadata-only batch importer](scripts/nikl-evidence-import.mjs) can inventory ordinary browser-saved official pages without retaining page text or marking citations reviewed; see [the batch-import guide](docs/NIKL-EVIDENCE-BATCH-IMPORT.md). The three cited NIKL-hosted PDFs have a separate local binary-metadata intake ([guide](docs/NIKL-PDF-IMPORT.md), `npm run template:nikl-pdf`, `npm run import:nikl-pdf`) that never extracts document text or asserts claim support.

## Repository-local agent skills

Specialized agent workflows for official NIKL scraping, article-by-article rule coverage, and evidence-gated pronunciation adjudication are documented in [docs/AGENT-SKILLS-NIKL.md](docs/AGENT-SKILLS-NIKL.md) and installed under `.agents/skills/`. These are workflow instructions; they do not claim that a live crawl or new linguistic validation has already run.


## Human review of official Standard Pronunciation Rules (2026-10-24)

The committed official-source HTML is now paired with a machine-readable review of all 30 article lead-ins and their separately labelled `해설` paragraphs. The regression checks preserve the boundary between normative Korean text, explanatory commentary, broad IPA, and provisional Ukrainian adaptation.

- [Human-review record](docs/NIKL-HUMAN-REVIEW-2026-10-24.md)
- [Machine-readable review fixture](tests/fixtures/nikl-article-review-1-30.json)
- [Source-boundary regression test](tests/nikl-article-review-1-30.test.mjs)
- [Cross-rule engine surface/IPA regression (24 source-backed project-IPA cases)](tests/nikl-human-review-surface-regression.test.mjs)

- [Surface-only evidence for unresolved 긁고](tests/fixtures/nikl-surface-only-complex-coda.json)
- [Guard test keeping that case out of IPA/target gold](tests/nikl-surface-only-complex-coda.test.mjs)


## Research: neural teacher and IPA corpus reconciliation

The research-only scratch G2P teacher, source-pinned SIGMORPHON/UGTPHON train/dev builders, and lossless typed IPA packets are available through [PR #339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/339). The [neural-teacher candidate rule register](docs/NEURAL-TEACHER-CANDIDATE-RULE-REGISTER-2026-10-26.md) is the separate ledger for measured teacher findings, candidate families, evidence gates, and the unresolved total of genuinely missing rules. The [source-convention review](docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md) and [train-only adjudication queue](scripts/build_korean_ipa_adjudication_queue.py) preserve disagreements for review instead of treating either corpus as automatic IPA gold. The neural model is not in runtime; no production rules are changed by this research path.

The teacher workflow also emits same-input raw IPA pairs for the scratch model and native Strict engine on the SIGMORPHON dev forms using [`scripts/compare_korean_teacher_strict_dev.py`](scripts/compare_korean_teacher_strict_dev.py). It intentionally computes no cross-engine accuracy metric: source IPA conventions are not yet reconciled, and the teacher was selected on this dev split. See the [IPA convention review](docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md).

The corpus workflow now also emits a source-specific [IPA symbol inventory audit](scripts/audit_korean_ipa_symbol_inventories.py). It counts literal Unicode code points and preserves SIGMORPHON's source whitespace tokens without inventing phoneme segmentation; see the [convention review](docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md) for the measured inventory differences and remaining adapter gate.

The source inventory review also checked the pinned upstream UGTPHON README, which itself shows `kçikçi` and `kçik̚kçik̚` for Korean examples. This confirms `ç` is part of the upstream annotation notation; it must be preserved until its ClippyFirst mapping is reviewed, not dropped as a suspected typo.

A second-stage conflict triage report is generated by [`scripts/analyze_korean_ipa_conflict_patterns.py`](scripts/analyze_korean_ipa_conflict_patterns.py). It preserves multiple UGTPHON candidate annotations per form and reports literal-symbol/variant counts without pretending to align phones or adjudicate either source as gold; see the [source-convention review](docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md).


The 2026 Findings of EMNLP paper [Phonemizing User-Generated Text](https://aclanthology.org/2026.findings-emnlp.1020/) reports that Korean UGTPHON is pass-through dominated and that retrieval/context help non-canonical tokens, while staged canonical decoding adds no further Korean gain in its ablation. Our canonical benchmark currently scores token.canonical, so it does not evaluate raw-surface normalization. The new raw-surface benchmark is a conservative train-only lookup baseline, not a reproduction of the paper's ByT5/Qwen model; see [the G2P improvement research note](docs/KOREAN-G2P-ENGINE-IMPROVEMENT-RESEARCH-2026-11-01.md).

### Productive morphology licensing (research-only, 2026-10-26)

The analyzer-consensus adapter now goes beyond exact word-list coverage without broadening the default strict engine. When Kiwi and MeCab-Ko agree on an exact surface-aligned grammatical boundary, it may create a full-form license for source-backed R002/R003/R007 and for VV/VA stem + ending environments in R010/R011/R016. It may also carry a registered R012/R014/R015 lexical root's internal rule across an analyzer-confirmed attached particle/ending (for example, a licensed compound root followed by a particle). Noun-to-noun lookalikes, analyzer boundary disagreements, zero-width morphemes, spaces, and unregistered roots remain fail-closed.

Every such application is marked `analyzer-supported-low-confidence` and the IPA remains diagnostic-only. This is a controlled way to use morphology to make existing sourced rules productive; it is **not** evidence that the analyzers are gold, and it does not change the default browser or strict runtime.


## Korean Revised Romanization as a parallel audit view (2026-10-28)

The service now displays a **NIKL-based Revised Romanization (RR) rendering** beside IPA and Ukrainian output. It uses the resolved Hangul surface for pronunciation-sensitive rules and the original Hangul spelling for explicit NIKL exceptions (including eight listed compound-fortis examples and the noun examples 묵호/집현전). It is not English phonetic spelling, and it is not an input to the IPA-first Ukrainian adapter.

The pipeline remains:

`Hangul → Korean surface pronunciation → IPA → Ukrainian target`

The RR-mediated Ukrainian route is separate from the IPA-first route:

`source Hangul spelling + resolved surface → NIKL-based RR → RR→Ukrainian correspondence → Ukrainian orthography`

**Scope limitation:** the adapter covers standard Hangul syllable decomposition, core RR onset/vowel/coda values, adjacent ㄹ handling, pronunciation-sensitive surface rules, and a conservative source-orthography allowlist for ten explicit NIKL §3(1) examples. It is still not a complete implementation of every NIKL rule: proper-name capitalization, administrative-unit hyphenation, and unlisted lexical/morphological exceptions are not inferred. It does not reverse-convert Latin text to Hangul. Do not use it as pronunciation gold or infer IPA from the Latin output. See [the implementation contract and validation gaps](docs/KOREAN-ROMANIZATION-RR-2026-10-28.md).

Normative reference: [National Institute of Korean Language — Romanization of Korean](https://www.korean.go.kr/front_eng/roman/roman_01.do).

## Optional Hanja output (deterministic preview)

The browser presents the primary Ukrainian transliteration, Revised Romanization, Hanja annotation and IPA as separate results. The IPA panel now distinguishes surface phonetic IPA from an orthography-derived phonemic baseline. Hanja works in both directions: Hangul→Hanja annotation and a separate Hanja→Hangul workbench that exposes ambiguous/unknown readings and requires manual correction before transfer into the main input. Reverse lookup is dictionary-based, not contextual word-sense disambiguation. See [the implementation and evidence ledger](docs/HANJA-RESEARCH-LAYER-2026-10-29.md).

## Additional synthetic adversarial passage (2026-10-31)

A generated mixed-phonology passage adds dense combinations of complex codas, liaison, fortition, palatalization, ㅢ, morphology, names, loans, numbers, punctuation and long prose. It is a stress-test input fixture, **not pronunciation gold**.

- [Synthetic passage fixture](tests/fixtures/adversarial-corpora/31-generated-mixed-phonology-prose-2026-10-31.txt)
