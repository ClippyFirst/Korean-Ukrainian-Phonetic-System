# Neural Korean G2P / ClippyFirst V3 research gate — 2026-10-26

## Decision

**Recommendation: pursue a research-only V3 prototype, not a replacement release.** A neural component is worth testing because Korean G2P ambiguity is not limited to letter-to-sound rules: lexical identity, morphology, boundary/prosodic context, non-canonical spelling, and pronunciation variants can matter. The existing ClippyFirst strict/soft engines and IPA-to-Ukrainian renderer should remain the reference architecture and safety boundary.

Before this branch, the six-engine harness had no integrated neural G2P baseline. This branch now contains a pinned CharsiuG2P adapter, unit tests, a complete per-engine occurrence ledger, and a pairing utility. **Actual CPU inference has completed on both pinned benchmark splits** (run [40285484220](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40285484220), neural artifact [12633674500](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40285484220/artifacts/12633674500)). The first raw inference artifact's embedded g2pk comparison was blocked by an adapter import mismatch; that import has been corrected, and a separate paired-report job is generating the authoritative comparison from the full baseline occurrence ledger. These are actual model predictions, not upstream paper scores, but remain diagnostic because upstream training-data overlap is unresolved.

## External model candidate

### CharsiuG2P / multilingual ByT5

- Source: https://github.com/lingjzhu/CharsiuG2P (MIT-licensed repository, as declared by upstream).
- Paper: Jian Zhu, Cong Zhang, David Jurgens, “ByT5 model for massively multilingual grapheme-to-phoneme conversion” (2022), https://arxiv.org/abs/2204.03067, DOI https://doi.org/10.48550/arXiv.2204.03067.
- Upstream README explicitly says Korean was accidentally omitted from the original model and later uploaded corrected models that include Korean.
- Upstream reports for its multilingual Korean-capable model family:
  - `charsiu/g2p_multilingual_byT5_tiny_8_layers_100`: PER 0.107, WER 0.314
  - `charsiu/g2p_multilingual_byT5_tiny_12_layers_100`: PER 0.098, WER 0.287
  - `charsiu/g2p_multilingual_byT5_tiny_16_layers_100`: PER 0.096, WER 0.281
  - `charsiu/g2p_multilingual_byT5_small_100`: PER 0.089, WER 0.261
- These are **upstream-reported results**, not directly comparable to this repository's UGTPHON/SIGMORPHON scores until dataset, split, normalization, tokenization, and evaluation protocol are matched. They are not proof that the model is more accurate on this repository's inputs.
- The upstream usage contract assumes words have already been tokenized. For Korean, external segmentation is required because word boundaries are not reliably represented by spaces alone. This is a significant confound for a sentence/noisy-text benchmark.
- Upstream also warns that output should be sanity-checked and source dictionaries have mixed licensing/redistribution status. Do not vendor model weights or training corpora into this repository; fetch a pinned model at benchmark runtime and record its revision, hashes, and terms.

## V3 architecture hypothesis

V3 should be an **evidence-gated hybrid**, not “neural output replaces rules”:

1. Preserve raw input and record script, spacing, punctuation, and normalization candidates without silently rewriting the source.
2. Run the existing deterministic ClippyFirst structural and phonological analysis.
3. Expose a typed intermediate representation: source spans; morpheme/boundary hypotheses and provenance; phonological rule events; broad IPA candidate; variant/uncertainty status.
4. Add a neural candidate provider behind a narrow adapter. It may propose pronunciation candidates and confidence/alternatives, but it must not write directly to Ukrainian output.
5. Compare neural candidates with ClippyFirst rules, dictionary evidence, and licensed morphology. Agreement is evidence for triage, not independent proof if systems share training data or rules.
6. Route the selected/accepted IPA through the existing IPA-to-Ukrainian adapter. Unsupported IPA symbols must fail visibly rather than be silently dropped.
7. Expose result provenance and certainty classes, e.g. `RULE_CONFIRMED`, `LEXICON_SUPPORTED`, `NEURAL_CANDIDATE`, `DISAGREEMENT`, `ABSTAINED`. Do not present model confidence as calibrated probability until calibration is tested.

Neural inference must remain optional and must not make the browser runtime depend on a large Python/Torch stack. Start with an offline/research CLI adapter; decide on deployment only after latency, model size, licensing, and accuracy have been measured.

## Benchmark execution plan and acceptance gates

### Stage A — reproducible external baseline (DONE_VERIFIED for inference; paired report in CI)

- **Implemented:** `scripts/benchmark_charsiu_g2p.py` uses the existing `benchmark_ugtphon_ko.normalize_ipa` profile and emits per-occurrence raw/normalized predictions, coverage, exact match, CER, and explicit missing/error states. It is research-only and does not alter production or Ukrainian-target logic.
- **Actual inference:** [run 40285484220](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40285484220), artifact [12633674500](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40285484220/artifacts/12633674500). The checkpoint returned a usable result for every eligible occurrence: UGTPHON 2,393/2,703 exact (88.5313%), CER 3.6239%, coverage 100%; SIGMORPHON 709/999 exact (70.9710%), CER 5.4081%, coverage 100%.
- **Model provenance:** `charsiu/g2p_multilingual_byT5_small_100` revision `ed5cf99707fb39f5f3ccc461530d56b6fb531fd3`; tokenizer `google/byt5-small` revision `68377bdc18a2ffec8a0533fef03b1c513a4dd49d`. Python 3.12, CPU PyTorch 2.4.1, Transformers 4.44.2, SentencePiece 0.2.0, huggingface_hub 0.24.6. Model file SHA-256: `1ef4032409d33944e4249f959d028f78436f968e26b81cb6b0d508a6cf12ce6c` (1,198,608,045 bytes). Tokenizer/config hashes are retained in the run's `model-provenance.json`.
- **Rights gate:** the upstream code repository declares MIT, but the Hugging Face checkpoint page does not state a separate weights license. **Weights license remains UNRESOLVED**; research inference only, no weight redistribution. The tokenizer is Apache-2.0. Do not treat the code license as automatically covering the checkpoint.
- **Pinned data:** UGTPHON `naver-ai/UGTPHON@ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`, `ko/test.json`, Apache-2.0; SIGMORPHON `sigmorphon/2021-task1@821bcdece5a47820872215969f275004b0abe80c`, `data/medium/kor_test.tsv`, CC BY-SA 3.0. No test data were used for training or tuning.
- **Baseline comparison:** six deterministic/external baselines were run on the same eligible occurrences. The combined per-case report is being produced by [workflow run 40286994417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40286994417); it downloads the neural artifact above and pairs it with the complete six-engine occurrence ledger. The paired comparison uses the same normalization profile and reports coverage separately, per-case raw outputs/statuses, wins/losses, and deterministic row-cluster bootstrap intervals. A local audit copy is available as a downloadable JSON from this chat; it is not committed because it is a generated 7.6-MB case-level artifact.
- **Overall metrics (exact match / CER):**

| System | UGTPHON (2,703 eligible) | SIGMORPHON (999 eligible) |
|---|---:|---:|
| CharsiuG2P multilingual ByT5 small | 2,393/2,703 (88.5313%) / 3.6239%; coverage 100% | 709/999 (70.9710%) / 5.4081%; coverage 100% |
| ClippyFirst native | 1,430/2,698 (53.0022%) / 9.1697%; coverage 99.815% | 357/997 (35.8074%) / 14.7037%; coverage 99.800% |
| g2pk 0.9.4 | 1,435/2,703 (53.0892%) / 9.2285%; coverage 100% | 353/999 (35.3353%) / 14.8222%; coverage 100% |
| KoG2P | 738/2,703 (27.3030%) / 19.5122% | 187/999 (18.7187%) / 21.8327% |
| hangul_to_ipa | 439/2,703 (16.2412%) / 24.8054% | 89/999 (8.9089%) / 29.8448% |
| eSpeak NG | 220/2,703 (8.1391%) / 33.6101% | 43/999 (4.3043%) / 40.7236% |
| phonemize 2.0.1 | 1,150/2,703 (42.5453%) / 14.3531% | 289/999 (28.9289%) / 17.4387% |

- **Paired exact-rate / CER deltas (Charsiu minus baseline; negative CER delta favors Charsiu):**

| Baseline | UGTPHON common cases; Δ exact / Δ CER | SIGMORPHON common cases; Δ exact / Δ CER |
|---|---:|---:|
| ClippyFirst native | 2,698; +35.656 pp / −5.567 pp | 997; +35.105 pp / −9.279 pp |
| g2pk 0.9.4 | 2,703; +35.442 pp / −5.605 pp | 999; +35.636 pp / −9.414 pp |
| KoG2P | 2,703; +61.228 pp / −15.889 pp | 999; +52.252 pp / −16.425 pp |
| hangul_to_ipa | 2,703; +72.290 pp / −21.182 pp | 999; +62.062 pp / −24.437 pp |
| eSpeak NG | 2,703; +80.392 pp / −29.986 pp | 999; +66.667 pp / −35.316 pp |
| phonemize 2.0.1 | 2,703; +45.986 pp / −10.727 pp | 999; +42.042 pp / −12.031 pp |

- The row-cluster bootstrap uses 1,000 replicates and a fixed seed. The full report includes 95% intervals and paired wins/losses. These large deltas are **not** a clean leakage-free generalization claim: the public checkpoint's training data may overlap public benchmark sources, and that overlap could not be verified from an official model card.
- **Input condition:** UGTPHON is a token-level ablation using the corpus's existing tokenization; sentence context is not passed to CharsiuG2P. SIGMORPHON is lexical/word-level. These scores do not measure sentence-context performance, normative IPA correctness, or Ukrainian-target rendering.
- **Adapter correction:** the first inference run's optional in-job g2pk comparator attempted to import the segment parser/renderer from the wrong module. The raw neural predictions are unaffected; the import was fixed in `scripts/benchmark_charsiu_g2p.py`, a regression test was added, and the authoritative paired report uses the six-engine ledger from the existing benchmark runner instead of the failed embedded g2pk comparison.
- Keep the model artifact (predictions and provenance only), not weights. The inference stack is pinned; the pairing utility is `scripts/compare_neural_with_multiengine.py`. CI run [40286994417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40286994417) is the next acceptance check for the combined artifact.

### Stage B — architecture ablation

Compare, on identical held-out examples:
A. ClippyFirst strict;
B. ClippyFirst soft;
C. neural model alone;
D. ClippyFirst rules + neural candidate fallback;
E. rules/neural disagreement with abstention or multiple candidates.

Measure coverage and accuracy separately. A higher coverage rate is not an accuracy improvement. Include OOV/proper names, morphology, rule interactions, spacing/boundaries, non-canonical UGT, and the 24-form holdout, but do not use holdout references for training, prompt tuning, or model selection.

### Stage C — data and deployment gate

- No training or fine-tuning until source license, permitted use, split leakage, and data provenance are reviewed.
- Do not use the 24-form holdout or test portions of UGTPHON/SIGMORPHON for training, pseudo-labeling, threshold tuning, or early stopping.
- Any new supervised set needs source IDs, license/permission, native spelling, segmentation/morphology labels where relevant, broad IPA conventions, annotator provenance, adjudication, and a locked split.
- Require a statistically defensible paired improvement on a held-out set, no material regression on NIKL rule cases, auditable abstention behavior, Python/browser contract preservation, and a separate IPA-to-Ukrainian evaluation before considering V3 production use.
- A neural model must not be called “better” based only on upstream PER/WER or a different corpus.

## Current task ledger

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Identify candidate neural G2P | DONE_VERIFIED | CharsiuG2P upstream documentation explicitly includes Korean-capable multilingual ByT5 models and reports PER/WER. |
| Check whether neural baseline is already in repo | DONE_VERIFIED | Main-branch tree and code search found no CharsiuG2P/ByT5/neural adapter; existing harness is six non-neural baselines. |
| Compare upstream reported metrics with repo metrics | PARTIAL | External metrics recorded but are not comparable without same dataset/protocol. |
| Build optional neural benchmark runner | DONE_VERIFIED for code presence; test/CI pending | `scripts/benchmark_charsiu_g2p.py` and `tests/test_charsiu_g2p_benchmark.py`; no scored model run claimed. |
| Run neural baseline on repository benchmark | TODO | Pin model/tokenizer revisions, install optional dependencies, execute on exact existing corpus splits, inspect artifact and paired outcomes. |
| Verify model license/data provenance | PARTIAL | Upstream code repo declares MIT; individual model artifact revision and underlying training data terms still require review. |
| Train/fine-tune ClippyFirst V3 | DEFERRED | Do not train before Stage A establishes a measured gap and data rights are clear. |
| Validate IPA-to-Ukrainian path with neural candidates | BLOCKED | No independent, adjudicated full-system Ukrainian-output gold corpus exists yet. |

## Sources

- CharsiuG2P repository and model results: https://github.com/lingjzhu/CharsiuG2P
- ByT5 multilingual G2P paper: https://arxiv.org/abs/2204.03067
- UGTPHON benchmark and Korean noisy-text annotations: https://github.com/naver-ai/UGTPHON
- Repository benchmark report: docs/MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md
- Korean G2P linguistic error analysis, Mun, Kim & Ko (2022), KCI: https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereSearchArticleBean.artiId=ART002922160

## Bottom line

**Research-ready for a diagnostic neural baseline; not release-ready and not evidence that ClippyFirst V3 should be replaced.** The public checkpoint scores substantially better on these corpus annotations, but its weights license is unresolved, training-data overlap is unknown, and its UGTPHON condition is word-level. Preserve the authorial rule engine and typed IPA-to-Ukrainian adapter as the production system of record. A hybrid ablation is deferred until licensing and independent IPA adjudication are resolved.


## Additional candidate checked: NN-KoG2P (2026-10-26)

The NN-KoG2P paper was investigated as a separate candidate: Kim et al., ICASSP 2021 ([IEEE](https://ieeexplore.ieee.org/document/9414653), [DOI](https://doi.org/10.1109/ICASSP39728.2021.9414653)). This attempt did **not** find a verifiable public inference implementation/checkpoint with runnable instructions and licensing terms. The candidate is therefore **BLOCKED and unscored**; no NN-KoG2P results are claimed. The described FFNN uses surrounding eojeol context and phonological-phrasing features, so our existing isolated-token benchmark adapter would not be a faithful invocation. Details and acceptance criteria: [NN-KoG2P benchmark attempt](NN-KOG2P-BENCHMARK-ATTEMPT-2026-10-26.md).

Next action is to locate an author-maintained release or obtain the artifact and terms, then implement a context-preserving adapter and score identical test rows. If unavailable, keep it explicitly blocked rather than train a lookalike or substitute another neural model under its name.


## Context-level evaluation infrastructure (2026-10-26)

Added a strict sentence-level scoring boundary in `scripts/benchmark_contextual_g2p_ko.py` with unit tests. It validates row IDs and canonical input, requires an explicit IPA output declaration, reports coverage and per-sentence exact/CER, and refuses unadapted Hangul outputs. This is infrastructure, **not** a runnable NN-KoG2P adapter or evidence of model scores. See [NN-KoG2P benchmark attempt](NN-KOG2P-BENCHMARK-ATTEMPT-2026-10-26.md).



## Executable inference continuation — 2026-10-26

### Runnable candidate and rights gate

- The selected first inference candidate is the upstream charsiu/g2p_multilingual_byT5_small_100 checkpoint (https://huggingface.co/charsiu/g2p_multilingual_byT5_small_100). The upstream CharsiuG2P code repository declares MIT, but the Hugging Face weights page has no explicit weights license metadata. **Weights status: UNRESOLVED**. The workflow may perform research inference, but it must not redistribute model weights or treat the code license as automatically licensing the weights.
- Tokenizer: google/byt5-small, whose model card declares Apache-2.0: https://huggingface.co/google/byt5-small.
- The workflow resolves the immutable commit prefixes ed5cf99 (model) and 68377bd (tokenizer) to full 40-character revisions before inference. It records resolved revisions and SHA-256 hashes for available model/tokenizer files.
- Inference stack is pinned to Python 3.12, CPU PyTorch 2.4.1, Transformers 4.44.2, SentencePiece 0.2.0, and huggingface_hub 0.24.6. The 1.2-GB checkpoint is not vendored or uploaded; only reports and per-case predictions are retained as a 30-day Actions artifact.

### Evaluation contract

- The optional adapter now records empty_output, invalid_output (including unexpected Hangul in declared IPA), and per-batch model_error separately. Partial failures reduce coverage rather than being silently dropped or mislabeled as accuracy errors.
- The report retains raw and normalized predictions, gold, occurrence IDs, and paired comparison with ClippyFirst native and g2pk on the exact same eligible occurrences. Coverage and accuracy denominators remain separate.
- UGTPHON remains a token-level ablation using the corpus's existing tokenization; it does not preserve sentence context for CharsiuG2P. SIGMORPHON remains a separate lexical benchmark, not a sentence-context test. Neither result validates Ukrainian target rendering.
- The expensive model inference job is opt-in via the `enhancement` label on this research PR; the paired-report job can reuse the pinned model artifact without redownloading or rerunning the checkpoint. This avoids downloading a 1.2-GB model on ordinary CI updates.

### Other candidate triage

- kr-MATAGI/IPA_G2P-Testing contains a Charsiu T5 runner and a KoGPT runner, but the KoGPT path is a fine-tuning/training script rather than a clearly documented, standalone Korean G2P checkpoint adapter. KakaoBrain states that KoGPT source is Apache-2.0 while pretrained weights are CC-BY-NC-ND 4.0; the cited 6B model guidance requires at least 32 GB GPU RAM. It is not selected for this CPU benchmark and is not assumed commercially redistributable.
- SMART-TTS/SMART-G2P is a code-mixed transliteration component and delegates pronunciation conversion to g2pK/KoG2P; it is not an independent neural Korean G2P baseline.
- NN-KoG2P remains BLOCKED / not scored because no authentic runnable implementation, weights, license terms, and verified phone-to-IPA map were found. The later Fast Bilingual G2P publication is a different model, not a substitute.
- **Current score status:** no new CharsiuG2P score is claimed until the labelled workflow finishes and its artifact is inspected. A successful CI unit-test run is not evidence of neural inference quality.


## External linguistic audit — KoG2Padvanced and the 2022 rule study (2026-11-01)

The study by Mun, Kim & Ko (2022), *A proposal to improve on existing Grapheme-to-Phoneme conversion models informed by linguistics*, DOI [10.29403/LI.26.2.2](https://doi.org/10.29403/LI.26.2.2), is a useful independent checklist. Its manually reviewed challenge set has 130 examples across 13 rule families; the authors report initial inter-annotator agreement of 0.842 and a post-change aggregate of 0.938 for their revised KoG2P-based system. These are the paper's own curated-set results, not comparable to this repository's UGTPHON/SIGMORPHON diagnostics or a general Korean accuracy claim.

### Feature-by-feature reconciliation

| Study finding / candidate | Current ClippyFirst coverage | Decision |
|---|---|---|
| ㅎ deletion | R003 exact-form licenses and lexical entries already cover source-attested forms; narrow /h/ realization remains a separate research profile | Do not add a categorical across-the-board deletion rule. The study itself describes POS-, frequency-, and context-sensitive variation |
| ㅢ variation | §5 vowel alternatives plus exact lexical entries preserve cases such as 우리의, 강의의, 학생의, 발음의, 지식의, 값의, 삶의 | Existing coverage is preserved; broader productive application needs a POS/morphology boundary, not Hangul adjacency |
| ㅖ → [e] variation | Existing §5 variant generator covers consonant-initial ㅖ while excluding 예/례 | No duplicate rule needed |
| ㄴ insertion | R009 uses exact source-backed lexical/phrase licenses | Keep fail-closed lexical treatment; do not make it productive solely from the paper's aggregate score |
| Coda place assimilation | Not part of the default standard-pronunciation profile | Keep out of default output: the paper explicitly treats it as optional/variable. A future descriptive profile needs independent speaker/register evidence and a distinct output ID |
| Rule ordering | Existing ordered rule engine and NIKL-backed interaction tests | Use the paper as a targeted audit checklist; change order only when a source-backed counterexample demonstrates a defect |

The paper also highlights the role of morphological analysis for particles and verb forms. This repository already has optional Kiwi and MeCab-Ko adapters with source offsets, but those adapters currently expose morphology only; they do not automatically license pronunciation rules. A high-value next experiment is a **research-only morphology-aware candidate layer** for ambiguous particle/ending cases, with exact span alignment, analyzer provenance, multiple candidates where analyses disagree, and abstention on zero-width or unaligned spans. It must not silently promote analyzer output to normative pronunciation.

### KoG2Padvanced reuse and rights gate

The authors' [KoG2Padvanced repository](https://github.com/seongmin-mun/KoG2Padvanced) was inspected at main tree `491b2d7269a4666b0d7556efb26755219f861163`. GitHub reports no repository license; the inspected tree contains a README and a test-set file, but no LICENSE or executable Python module. Therefore its README and the paper are used as bibliographic research evidence only. No code, corpus rows, or derived test fixtures were copied. The source is recorded as rights-unverified in `research/SOURCE-REGISTER.csv`.

### Benchmark implications

The 130-item paper challenge is useful for designing rule strata, but its curated examples, Hangul-output comparison, and selected rules are not a replacement for an independently adjudicated broad-IPA holdout. The current project should report (1) source-backed rule challenge performance, (2) canonical lexical G2P, and (3) noisy-text normalization plus G2P as separate tracks. Do not tune a single engine against the paper's challenge and then present that score as generalization.

A separate 2026 Findings paper on UGTPHON proposes retrieval-augmented, staged canonicalization for user-generated text and reports a large reduction in the canonical-to-noncanonical gap. That supports investigating a distinct raw-text normalization stage; it does not justify changing the standard Korean phonology rules or treating noisy-text normalization as ordinary G2P. See [Jeon et al. (2026)](https://aclanthology.org/2026.findings-emnlp.1020/).

**Status:** literature audit DONE; no new normative phonological rule promoted. Morphology-aware candidate layer TODO / research-only pending independently adjudicated cases, POS/span validation, and paired benchmark evaluation.


## Deep morphology bridge — 2026-11-01 implementation update

A recent Interspeech 2026 paper by You & Moon describes an object-oriented G2P engine with syllable–morpheme connectivity and recursive rule re-evaluation. The Zenodo record reports 3.14 ms versus 14.98 ms average latency and 85.7% versus 27.2% sentence-level accuracy against g2pk in that study. These are the authors' results on their own standard-reading evaluation, not a score for this repository or a directly comparable UGTPHON result. The public Zenodo record provides the paper PDF but no executable engine or benchmark corpus; no implementation or data was copied. See [You & Moon (2026), DOI 10.5281/zenodo.22167288](https://doi.org/10.5281/zenodo.22167288).

### Repository design reconciliation

- Existing `research_morphology.py` adapters already preserve Kiwi/MeCab source offsets, analyzer identity, and zero-width morphology.
- Existing `Syllable` objects carry source Hangul and word boundaries, but previously had no validated link to analyzer morphemes.
- Existing `apply_ordered_rules` performs one ordered pass; rule-specific exact-form license dictionaries are already isolated by rule.
- **Implemented (research-only):** `align_morphemes_to_syllables` now validates analyzer text/spans and returns explicit syllable→morpheme links plus same-morpheme, morpheme, word, or unknown boundary labels. Zero-width morphs and missing coverage are preserved as uncertainty. This helper grants no pronunciation-rule licenses and is not called by the production G2P path.

### Next controlled experiment

The next step is a research-only rule-licensing adapter that consumes these links for a small, source-backed subset of morphology-conditioned rules. It must retain analyzer provenance, reject unaligned/zero-width spans, preserve alternative analyses, and abstain on disagreement. Only after paired challenge tests demonstrate a real cascading case should the engine trial bounded rule re-evaluation with cycle detection. The production single-pass rule order remains unchanged.

**Acceptance:** source offsets round-trip exactly; no overlap or normalized-span guesses; zero-width and missing spans remain unknown; word boundaries remain distinct; no rule is licensed by alignment alone; production output is byte-for-byte unchanged.
