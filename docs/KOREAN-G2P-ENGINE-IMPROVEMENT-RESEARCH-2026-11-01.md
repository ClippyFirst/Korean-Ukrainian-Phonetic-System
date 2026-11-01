# Korean G2P engine improvement research — 2026-11-01

## Scope and terminology

This review concerns the repository's **native ClippyFirst Korean pronunciation engine** and its optional **g2pK adapter**. These are distinct implementations:

- Native engine: deterministic NIKL-oriented rules, exact lexical licenses, a structured syllable representation, and a research-only morphology/analyzer path.
- g2pK adapter: calls the external Kyubyong Park g2pK package, receives Hangul surface spelling, then derives ClippyFirst broad IPA. It does not expose a complete per-rule trace.

Do not conflate g2pK with the native engine or describe the third-party library as ClippyFirst-authored. The upstream g2pK README notes that the library is not perfect and documents MeCab-based contextual analysis, prescriptive/descriptive modes, and a verbose rule trace.

## Current measurable baseline

The latest completed paired native/g2pK diagnostic on the current research branch is Actions run [41248014239](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014239), artifact [13060260820](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014239/artifacts/13060260820). The separate UGTPHON profile run is [41248014136](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014136), artifact [13059792615](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014136/artifacts/13059792615).

| Engine/profile | Scored tokens | Exact | CER | Interpretation |
|---|---:|---:|---:|---|
| Native broad IPA | 2,698 | 53.0022% | 9.1697% | 5 unresolved; 0 engine errors |
| g2pK-derived IPA | 2,703 | 53.0892% | 9.2285% | 0 unresolved; 0 engine errors |
| g2pK, same 2,698-token paired subset | 2,698 | 53.1134% | 9.2304% | +0.1112 percentage points exact vs native, but +0.0607 pp worse CER |
| Native partial-narrow IPA profile v3 | 2,698 | 70.4225% | 4.8992% | Partial research-only profile; not independently adjudicated or target-compatible |

The paired native/g2pK difference is tiny and metric-dependent: g2pK has a 3-token exact-match advantage on the paired subset, while native has lower CER. The comparison also shares the repository IPA renderer for g2pK surface Hangul and is therefore not fully independent. UGTPHON is noisy user-generated text, not a normative standard-pronunciation corpus.

The broad-vs-partial-narrow result uses the same 2,698 tokens, but the narrow profile adds research-only allophonic detail to better match the UGTPHON annotation convention. Its higher exact match is **not proof of improved standard-Korean G2P** and must not be fed into the Ukrainian target adapter.

The broader multi-engine run [41248014178](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014178) was **CANCELLED** during its multi-engine comparison step; its uploaded artifact contains training-readiness/leakage information, not a completed multi-engine score. Do not cite that cancelled run as a benchmark pass.

Exact match alone is not an adequate objective: report CER, PER, coverage, unresolved cases and per-case errors together. IPA source conventions can create apparent errors that are not yet adjudicated phonological errors.

The neural-teacher register currently reports 0 teacher-vs-Strict disagreements established as true phonological errors because the source IPA conventions have not yet been reconciled. It also records 107 length-mark-only diagnostics and 291 other teacher mismatches in one saved dev artifact; these are triage categories, not counts of missing rules.

## Research findings relevant to improvement

### 1. Morphology must be represented as structure, not guessed from adjacent letters

The 2022 study by Mun, Kim and Ko evaluated g2pK and KoG2P rule-by-rule and reports improvements from:
- adding h-deletion;
- handling ㅢ variation;
- consonant-place assimilation;
- revising the ordering of rules such as h/ㅎ neutralization;
- accounting for prosodic boundaries.

It identifies two general limitations in common rule-based engines: binary application of phonological rules and lack of prosodic-boundary information. It proposes modelling gradient rule application with factors such as lexical frequency and speech register.

Source: Mun, Seongmin, Su-Han Kim and Eon-Suk Ko (2022), *A proposal to improve on existing Grapheme-to-Phoneme conversion models informed by linguistics*, 언어와 정보 26(2), 27–46, DOI [10.29403/LI.26.2.2](https://doi.org/10.29403/LI.26.2.2). The KCI abstract is available at https://www.kci.go.kr/kciportal/mobile/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002922160.

The repository already has many of these rule families and explicit full-form licenses. The remaining opportunity is not to add a generic rule for each phenomenon; it is to make the evidence for **morpheme, word and phrase boundaries** explicit and reusable across rules.

### 2. Syllable–morpheme connectivity and rule re-evaluation are promising architecture patterns

You and Moon's Interspeech 2026 paper proposes an object-oriented representation with syllable–morpheme connectivity and recursive re-evaluation of sequential phonological rules. Its abstract reports 85.7% sentence-level accuracy and 3.14 ms latency versus 27.2% and 14.98 ms for g2pK in the authors' own evaluation.

Source: You, Heejo and Sung-woo Moon (2026), *Uncovering the Impact of G2P Precision on Korean TTS: A Large-Scale Statistical Validation via a Novel Morphological Engine*, Interspeech 2026, Zenodo record [22167288](https://zenodo.org/records/22167288), DOI [10.5281/zenodo.22167288](https://doi.org/10.5281/zenodo.22167288).

These numbers are **not comparable** to this repository's token-level IPA exact match, CER, PER or feature proxy. The paper record provides a paper, not a verified runnable engine or reusable benchmark implementation. Its reported architecture is a research lead, not permission to copy code and not proof that the same gains will transfer.

### 3. The repository already has useful foundations to preserve

- Syllable stores onset, nucleus, coda, source character and word-boundary metadata.
- The deterministic engine applies an explicitly ordered NIKL rule sequence and returns rule traces.
- Morphology-sensitive rules fail closed without exact full-form/pair licenses.
- The research-only morphology module already adapts Kiwi and MeCab-Ko, validates source offsets, preserves zero-width and unaligned morphemes, and builds syllable↔morpheme links and boundary classes. It explicitly grants no pronunciation-rule licenses.
- The analyzer agreement diagnostic found exact boundary-set agreement for 1,537/1,907 words (80.5978%); this is pairwise analyzer agreement, **not** segmentation accuracy. The two analyzers are not gold.
- A Kiwi+MeCab-Ko consensus diagnostic changed four words and newly resolved one previously unresolved form, but added no exact matches and slightly worsened CER (strict: 53.0022% exact / 9.1697% CER; consensus: 52.9826% exact / 9.1776% CER). It also withheld 24 unspaced phrase-boundary cases. No rule is promoted.
- The neural-teacher workflow is hypothesis generation only; source IPA differences remain unadjudicated.
- Exact lexical pronunciation entries preserve source URLs, confidence and rule notes.

Do not duplicate the existing morphology alignment helper, replace these safeguards with broad heuristics, or train on the synthetic adversarial corpus.

## Implemented correctness hardening in this continuation

The optional g2pK adapter previously aligned source and surface words by positional zip after checking only that their token counts matched. A changed separator or punctuation boundary could therefore associate a source lexical IPA entry with the wrong surface token.

The adapter now uses _aligned_source_words:
- requires equal Korean word-token counts and equal per-word syllable counts;
- compares every exact inter-word separator between source and surface (including whitespace and punctuation);
- returns no source-word mapping when alignment is uncertain;
- withholds both source-specific surface overrides and lexical IPA overrides when alignment is not verified;
- exposes word_alignment_status as either verified-source-surface-word-boundaries or unknown-source-surface-word-boundaries.

Regression tests cover a normal aligned sentence, punctuation shifted across the boundary, a merged-word output, and a same-token-count boundary shift with syllables moved between words. This is a correctness/provenance fix, **not a claimed benchmark-accuracy gain**. Exact-head CI is required before marking it verified.

## Recommended implementation sequence

| Priority | Work item | Why | Acceptance gate |
|---|---|---|---|
| P0 | Reconcile IPA conventions and adjudicate benchmark disagreement cases | Prevents optimizing annotation differences as if they were Korean errors | Source-blind reviewed mapping for each relevant IPA feature; preserve raw source strings |
| P1 | Introduce an inspectable syllable–morpheme boundary layer in the research engine | Makes formal endings, lexical compounds, eojeol boundaries and phrase boundaries explicit | Boundary provenance, analyzer agreement/disagreement, unknown state; no default runtime behavior change |
| P1 | Add bounded local rule re-evaluation for rules whose output changes a neighboring rule's input | Avoids relying on a fragile one-pass order where a prior change enables a later rule | Explicit dependency order, deterministic termination, cycle detection, trace of each pass, positive/negative tests |
| P2 | Expand exact source-backed cases for h-deletion, ㅢ variation and place assimilation | These are specifically identified by the 2022 rule-by-rule study | NIKL/primary evidence per environment; no spelling-only generalization |
| P2 | Represent optional/descriptive variants as typed alternatives, not silent replacements | Korean variation depends on lexical frequency, register and prosodic context | Separate standard-prescriptive and descriptive profiles; no unsupported probability claims |
| P3 | Benchmark speed and memory independently from accuracy | g2pK's MeCab path can have substantial startup and per-call costs | Warm/cold and per-word/batch scopes separated; repeated runs; no timing comparisons across unlike scopes |

### Proposed morphology representation

Add this only in a research branch first. Each syllable should be linked to:
- its source Hangul span and syllable index;
- a morpheme ID (or explicit unknown);
- boundary kind: within-morpheme, morpheme, eojeol, phrase, or unknown;
- analyzer source(s), agreement state and confidence;
- candidate lexical class where a rule requires it.

A rule should declare which boundary kinds it can cross, its source-backed environment, its dependencies, and whether it is categorical or variable. The engine should preserve all competing analyses where Kiwi and MeCab disagree. It must not collapse analyzer output into a false certainty.

### Bounded rule re-evaluation

Do not introduce unrestricted recursion. A safe experiment should:
1. apply a deterministic, explicit rule dependency schedule;
2. after a rule changes a segment, re-evaluate only affected neighboring rules;
3. stop when the representation is unchanged;
4. enforce a small documented pass bound and detect repeated states/cycles;
5. retain a full trace showing which rule caused each re-evaluation;
6. fail closed if the pass bound is reached without convergence.

This is a proposal for a research-only prototype, not a production change in this commit.

## Benchmark protocol before promoting any change

1. Freeze source revisions, preprocessing and the IPA convention mapping before comparing engines.
2. Keep train/dev/test and synthetic adversarial fixtures strictly separate. Never tune on the held-out test set.
3. Report exact match, CER, PER, coverage, coverage-adjusted accuracy, abstentions and per-case errors together.
4. Stratify errors by rule family, morphology boundary, word/phrase boundary, length, vowel variant, coda, and IPA feature.
5. Use paired case-level comparisons and confidence intervals; do not infer an improvement from a single aggregate score.
6. Require no unacceptable regressions on independently adjudicated standard Korean controls.
7. Keep Korean surface accuracy, IPA accuracy and Ukrainian target accuracy as separate acceptance layers.

## Latest morphology diagnostic — 2026-10-31

Actions run [41248014188](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014188) verified real Kiwi and MeCab-Ko smoke jobs and pairwise boundary diagnostics. Artifact [13060536030](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014188/artifacts/13060536030) reports 80.5978% exact boundary-set agreement over 1,907 words. This measures how often two analyzers agree, not whether either is correct. A separate soft-rule alignment diagnostic found 217 common rule events, with 186 observed by both analyzers, 18 by neither, 8 Kiwi-only and 5 MeCab-only.

The consensus evaluation artifact [13060490661](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014274/artifacts/13060490661) reports 2,703 token occurrences and 1,907 unique Hangul words. It changed four unique words; one additional word (칡칡이) became resolved, but overall exact match did not improve and CER became slightly worse. All changed IPA remains diagnostic-only. This confirms the correct next step is reviewed rule-specific licensing, not blanket promotion of analyzer consensus.

## Decisions and blockers

- **No third-party implementation copied or vendored.** KoG2Padvanced was recorded as research-only because its repository had no declared license; the Interspeech 2026 paper's runnable source/checkpoint has not been verified.
- **No new phonological rule promoted** from raw teacher disagreement or benchmark-only gains.
- **No new benchmark score claimed** for the current branch head.
- **Next genuine blocker:** a reviewed, source-convention-compatible case-level IPA adjudication set. Without it, the team cannot reliably tell whether a proposed rule improves Korean phonology or merely matches one corpus's annotation style.

## References

- Park, Kyubyong. [g2pK repository](https://github.com/kyubyong/g2pK) (Apache-2.0; third-party implementation).
- Mun, Kim and Ko (2022). [DOI 10.29403/LI.26.2.2](https://doi.org/10.29403/LI.26.2.2).
- You and Moon (2026). [Zenodo 22167288](https://zenodo.org/records/22167288).
- Repository's source and convention review: research/SOURCE-REGISTER.csv, docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md, and docs/NEURAL-TEACHER-CANDIDATE-RULE-REGISTER-2026-10-26.md.


## New UGT-specific finding — retrieval helps, but do not confuse it with canonical G2P

A second directly relevant 2026 study is Jeon et al., *Phonemizing User-Generated Text: A Benchmark, Taxonomy, and Compositional Approach*, Findings of EMNLP 2026, pp. 21564–21581, [ACL Anthology](https://aclanthology.org/2026.findings-emnlp.1020/), [PDF](https://aclanthology.org/2026.findings-emnlp.1020.pdf), [arXiv:2609.27205](https://arxiv.org/abs/2609.27205).

The paper's central distinction is raw non-canonical surface → intended canonical form → phonemes. It groups non-canonical UGT into:
- Reconstruct: recover omitted characters or expansions (Korean has A1 shortening; A2/A3 are absent in the released Korean set);
- Repetition: collapse character/unit repetition (B1/B2);
- Pass-through: surface already encodes intended pronunciation (C1–C4).

The Korean split contains 1,976 train, 246 dev and 275 test sentences. Its data repository states that the Korean subset is Apache-2.0; the other language subsets have different restrictions. The dataset is external and is not bundled by this project.

In Table 3, the paper reports Korean non-canonical PER of 47.5 for ByT5 further-trained on UGTPHON versus 32.0 for its retrieval-augmented compositional ByT5; Qwen2.5-0.5B improves from 77.3 to 32.4. However, Table 4's Korean ablation is especially important: Sent→Word plus retrieval alone reaches 27.7 PERnc, while adding staged decoding gives 32.0; staged decoding without retrieval gives 33.1. For Korean, the immediate benefit is sentence context and canonical-form evidence, not blindly forcing a staged canonical intermediate. The paper also notes that Korean is pass-through-dominated and that the bottleneck shifts toward phonemization.

### Repository benchmark scope correction

The existing canonical benchmark script, scripts/benchmark_ugtphon_ko.py, reads each test token's canonical field before calling the pronunciation engine. It therefore measures **canonical lexical G2P**, not raw-surface UGT normalization. It intentionally cannot tell us how the engine handles a raw surface such as ㅋㅋ or an initial-consonant abbreviation.

This continuation adds scripts/benchmark_ugtphon_ko_surface.py and tests/test_ugtphon_surface_benchmark.py as a separate, research-only diagnostic:
- input is token.text from the raw surface;
- a surface→canonical exact-match store is built from the training split only;
- mappings with multiple targets, multiple canonical variants, or a collision with a canonical training token are withheld;
- test token canonical fields are never read for prediction;
- unmatched surfaces are passed through unchanged to the G2P engine;
- results report overall and A/B/C-category metrics, retrieval coverage, ambiguous keys, unresolved forms, engine errors and potential canonical-token false rewrites.

This is deliberately a transparent retrieval-only baseline. It is **not** a reproduction of the paper's trained ByT5/Qwen model, does not use contextual disambiguation, and does not implement staged decoding. Its purpose is to quantify whether a separate normalization stage helps on the actual raw UGT surface, without contaminating the strict standard-Korean pronunciation engine or the canonical benchmark.

### Recommended next experiment

1. Run the new script with externally supplied UGTPHON Korean train/test files; keep the official test split untouched.
2. Report canonical tokens and non-canonical categories separately. Include retrieval-hit rate, PER/CER, false rewrites of canonical test tokens and abstentions.
3. Compare raw-surface direct G2P, train-only retrieval→native G2P, and the existing canonical-oracle benchmark. These answer different questions and must never be collapsed into one score.
4. If lookup helps, add contextual retrieval/detection as a separate optional UGT normalizer. Do not insert this behavior into the default standard-Korean engine.
5. Only after a clean retrieval baseline, consider a small research-only neural normalizer. The paper's public repository currently provides the dataset and license, not a verified released training implementation/checkpoint; no model code or weights were copied.


**Verification status (superseded 2026-11-01):** exact-head GitHub Actions now ran the benchmark and tests against the pinned Korean train/dev/test files. The current branch's native engine code was not changed by this benchmark work; the results below are diagnostic and do not authorize new phonological rules.

## Measured continuation — 2026-11-01

### Native engine versus external engines

Completed multi-engine run [41291822746](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41291822746), artifact [13077179199](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41291822746/artifacts/13077179199), used the pinned SIGMORPHON and UGTPHON sets. The native engine remained the strongest or statistically indistinguishable option among the compared licensed alternatives.

| Dataset / engine | Scored | Exact match | CER | Notes |
|---|---:|---:|---:|---|
| SIGMORPHON — native | 998/999 | 35.7715% | 14.6978% | 1 abstention |
| SIGMORPHON — g2pK 0.9.4 | 999/999 | 35.3353% | 14.8222% | Native paired exact advantage: 0.4008 pp; 95% CI excludes zero |
| SIGMORPHON — g2p_ko 1.0.0 | 999/999 | 35.6356% | 14.6970% | Essentially tied CER; lower exact match |
| UGTPHON — native | 2,698/2,703 | 53.0022% | 9.1697% | 5 abstentions |
| UGTPHON — g2pK 0.9.4 | 2,703/2,703 | 53.0892% | 9.2285% | Tiny exact advantage; worse CER |
| UGTPHON — KoG2Padvanced 2022 | 2,703/2,703 | 47.3178% | 10.6772% | Worse than native; upstream declares no license, comparison-only |

On the paired SIGMORPHON subset, g2pK-minus-native exact delta is -0.004008 (95% CI [-0.008016, -0.001002]); CER delta is +0.001128 (95% CI [-0.000126, 0.002771]). On paired UGTPHON, exact delta is +0.001112 (95% CI [-0.000371, 0.002988]) and CER delta is +0.000607 (95% CI [-0.000084, 0.001383]); both intervals include zero. Therefore replacing the native engine with g2pK is not justified by these benchmarks.

### Sentence-level context benchmark

The pinned UGTPHON workflow now evaluates the sentence-level canonical field against the independent sentence-level phonemes field, not a concatenation of token labels. Punctuation is converted to whitespace in accordance with the corpus annotation contract; digits, Latin, URLs and symbols are not guessed or silently removed. The run [41302329828](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41302329828) uploaded sentence IPA artifact [13081168898](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41302329828/artifacts/13081168898) and paired full-sentence native/g2pK artifact [13081873194](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41302329828/artifacts/13081873194).

| Split / mode | Eligible | Scored native | Exact | CER | Unresolved |
|---|---:|---:|---:|---:|---:|
| Dev, same_word | 208 | 176 | 5.6818% | 15.5184% | 32 |
| Dev, phrase | 208 | 176 | 5.6818% | 15.6803% | 32 |
| Test, same_word | 200 | 163 | 7.9755% | 14.8323% | 37 |
| Test, phrase | 200 | 163 | 7.9755% | 15.0149% | 37 |

Phrase mode produced no additional exact sentence matches and worsened CER on both dev and test. Keep same_word as the conservative default; do not treat every eojeol boundary as a prosodic phrase boundary.

The paired full-sentence comparison gives g2pK its MeCab context, unlike the token-level comparison. On the test paired subset (163 sentences), g2pK-minus-native exact delta is -0.006135 and CER delta is +0.006474; on dev (176 sentences), exact delta is 0 and CER delta is +0.009611. g2pK therefore did not outperform the native engine in this sentence-context diagnostic. Its Hangul output is converted through the repository's IPA segment renderer, so the comparison shares that renderer and remains diagnostic rather than fully independent.

Sentence exact match is a harsh whole-sequence metric and must not be compared numerically with token exact match. The corpus is noisy user-generated text, not a normative standard-pronunciation corpus.

### Raw-surface UGT normalization experiment

The raw-surface test [41302329828](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41302329828), artifact [13081623927](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41302329828/artifacts/13081623927), attempted 3,140 tokens: 2,636 scored, 83.949% coverage, 51.4416% exact among scored, 43.1847% coverage-adjusted exact, 10.1151% CER, 4 unresolved, and **0 engine errors**. The 487 tokens previously reported as engine errors are now classified separately as unsupported raw input outside the native Hangul+whitespace contract; train-only retrieval is attempted before this check.

The train-only datastore contains 192 exact surface mappings (89 ambiguous keys; 47 canonical collisions blocked) and 297 exact local-context mappings (483 ambiguous context keys; 1 canonical-context collision blocked). Exact context retrieval produced **0 test hits**; exact surface retrieval produced 15 hits among 722 non-canonical tokens (2.0776%), with 0 potential canonical false rewrites. This exact-trigram experiment does not generalize to the held-out test set and is not promoted to runtime. A learned/fuzzy contextual normalizer would need dev-only threshold selection, explicit false-rewrite controls and a separate acceptance gate.

### Existing phonological coverage — avoid duplicating rules

The 2022 paper's major rule families are already represented in the native engine: R003 h-deletion, R005 nasal/place assimilation, R006 liquid assimilation, R007 palatalization and R009 n-insertion. data/korean/rule_ordering.csv explicitly orders n-insertion before licensed h-deletion and liaison, and liquid assimilation before nasal assimilation. The IPA adapter already represents ㅢ as context-dependent (ɰi/ɯi at the phonemic boundary and [i] in the licensed broad context). The study's broader concern about gradient application and prosodic boundaries remains relevant, but no new general rule or probability model is justified without adjudicated source evidence.

The current morphology-consensus diagnostic [41302329863](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41302329863) is diagnostic only: the strict/soft/analyzer-consensus strategies remain near-identical, with no exact-match gain from analyzer consensus and a slight CER regression. Do not promote Kiwi/MeCab analyzer outputs into rule licenses.

### Exact-head verification and status

Code-bearing head: eeb25fbd4f5bc4bd05baa491eb0118116fb7e107 on feat/korean-rr-contextual-phonetics-final, PR [#411](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/411).

- Node/browser suite: 1,393/1,393 passed.
- Python 3.11, 3.12 and 3.13: passed; wheel install and teacher-corpus audit passed.
- System verification, browser regression/build, browser G2P integration, optional g2pK integration, paired native/g2pK, external UGTPHON, morphology consensus, research morphology smoke, master artifacts and exhaustive test-register extraction: passed on this head.
- CharsiuG2P, ByT5 and NIKL metadata-only inventory: skipped by default-off/metadata-only gates; no weights were downloaded and no unlicensed code was vendored.
- The repeated multi-engine run [41302329825](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41302329825) was still in progress at this documentation update; the completed run 41291822746 above remains the available multi-engine evidence.

**Decision:** do not change the native pronunciation rules or default boundary mode based on the current evidence. The engine is already competitive with g2pK; phrase mode and exact-context UGT retrieval did not improve the held-out results. Continue with independent IPA-convention adjudication, a source-backed sentence/prosody boundary dataset, and a dev-tuned contextual UGT normalizer as separate research work. The repository remains a research prototype, not release-ready.



## Follow-up real-data raw-surface run and paired baseline — 2026-11-01

A later raw-surface diagnostic completed on pinned UGTPHON train/test data in workflow [41306501056](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41306501056), artifact [13083344197](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41306501056/artifacts/13083344197), branch head `f24cb32a0e2ab09e880a61d6d3f71cc7f1a90b52`.

- 3,140 raw tokens attempted; 2,639 scored; coverage 84.0446%.
- 1,362 exact (51.6105% of scored); coverage-adjusted exact 43.3758%; CER 10.0256%.
- 4 unresolved; 0 engine errors; 496 unsupported raw inputs.
- Train-only retrieval: 22 hits among 722 noncanonical tokens (3.0471%); 15 exact-surface hits, 7 B1 lengthening-signature hits, **0 exact-context hits**, 0 canonical hits. The store blocked 47 canonical collisions and 483 ambiguous context keys.

This is a sparse, conservative retrieval baseline, not evidence of quality improvement. The old report did not include the raw-input baseline, so it could not establish whether normalization helped. The current continuation adds a paired raw-vs-normalized baseline to `scripts/benchmark_ugtphon_ko_surface.py`, with same-token exact/CER deltas, rescued/lost coverage and paired exact improvements/regressions. It reuses the raw G2P result when no retrieval changes the input.

The paired implementation at branch head `e9c0f912f90c00a0f8274a65edac030ac5b82473` is **PARTIAL** until exact-head CI and a new real-data artifact complete. Do not claim that retrieval improves accuracy before that paired report is available.

The same prior workflow's sentence-level same-word-boundary diagnostic (not comparable with token-level scores) reported native 13/163 exact (7.9755%), CER 14.8323%, 37 unresolved; g2pK 12/200 exact (6.0%), CER 15.5691%. On the 163 sentences scored by both, native exact 7.9755% / CER 14.8323% versus g2pK exact 7.3620% / CER 15.4797%. This does not support replacing the native engine with g2pK for the sentence-level test.


## Clarification of the EMNLP 2026 Korean ablation

Table 4 of Jeon et al. ([ACL Anthology PDF, p. 6](https://aclanthology.org/2026.findings-emnlp.1020.pdf)) distinguishes four relevant Korean settings:

- Word→Word baseline: Korean PERnc 47.5.
- Sentence context, target-word output (Sent→Word), no retrieval and no staged decoding: 28.1.
- Sentence context + retrieval, target-word output, no staged decoding: 27.7.
- Sentence context + retrieval + staged decoding: 32.0.

Full sentence generation (Sent→Sent) reports Korean PERnc 31.3 but canonical PERc 41.6, showing that the sentence should provide context, not be the generation target. For Korean, staged decoding after retrieval regresses from 27.7 to 32.0. The practical design implication is therefore: **encode sentence context, predict only the selected token's canonical Hangul form, optionally provide train-only retrieval hints, then pass the canonical token to the existing G2P engine.** Do not transplant the paper's staged decoder blindly.

The paper's model is trained and evaluated as a separate UGT canonicalization/phonemization component. It is not evidence that the existing deterministic Kozak Kim phonology rules should be broadened.
