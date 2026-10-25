# Neural Korean G2P / ClippyFirst V3 research gate — 2026-10-26

## Decision

**Recommendation: pursue a research-only V3 prototype, not a replacement release.** A neural component is worth testing because Korean G2P ambiguity is not limited to letter-to-sound rules: lexical identity, morphology, boundary/prosodic context, non-canonical spelling, and pronunciation variants can matter. The existing ClippyFirst strict/soft engines and IPA-to-Ukrainian renderer should remain the reference architecture and safety boundary.

The repository currently has no integrated neural G2P baseline: the multi-engine harness lists ClippyFirst native, g2pk, KoG2P, hangul_to_ipa, eSpeak NG, and phonemize. A GitHub code search on 2026-10-26 found no CharsiuG2P, ByT5, or neural-model references in this repository. This means there are **no neural-model benchmark scores in the repository yet**; external model claims below are candidate evidence, not results obtained by ClippyFirst.

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

### Stage A — reproducible external baseline (next executable step)

- Add CharsiuG2P multilingual ByT5 as a separately named neural candidate to the existing multi-engine benchmark; do not change production engine behavior.
- Pin the upstream repository commit, Hugging Face model revision, tokenizer revision, Python/Transformers/Torch versions, and hashes of downloaded model files. Never use floating `main`/latest for scored runs.
- Smoke-test Korean language code, output shape, empty/malformed input, batch ordering, and deterministic decoding. Validate outputs are non-empty and contain no unhandled Hangul or control tokens.
- Run the same pinned UGTPHON Korean test split and the same pinned SIGMORPHON file as current engines. Report per-dataset coverage, abstentions/errors, exact match, CER/PER, row-cluster intervals, paired deltas, and case-level wins/losses. Preserve original gold and current normalization profile.
- Report both word-only and context-aware conditions if sentence-level model usage is introduced. Do not compare a sentence-context model against word-only competitors without marking the condition.
- Keep a model output artifact (predictions and run metadata) for audit, not weights. Model download/CI cost may justify a separate manual workflow rather than the fast test suite.

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
| Run neural baseline on repository benchmark | TODO | Add pinned adapter + optional workflow; requires model download and runtime. |
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

**Research-ready for an isolated neural baseline experiment; not ready to replace ClippyFirst or to claim V3 superiority.** The next concrete deliverable is a pinned, reproducible CharsiuG2P benchmark adapter, then a case-level hybrid ablation. Preserve the author's rule engine and IPA adapter as the system of record until independently measured results justify any production routing change.
