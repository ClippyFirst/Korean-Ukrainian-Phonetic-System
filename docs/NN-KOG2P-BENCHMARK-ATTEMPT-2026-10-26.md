# NN-KoG2P benchmark attempt — 2026-10-26

## Outcome: BLOCKED, not scored

I investigated whether the published NN-KoG2P system can be run against the repository's existing UGTPHON and SIGMORPHON benchmarks. **No NN-KoG2P inference run or score is claimed.** The public materials found during this attempt establish the paper and describe its architecture, but did not provide a verifiable public inference implementation, released checkpoint/weights, or a reproducible installation/inference recipe that could be run from this repository.

Primary paper: Kim, Hwa-Yeon, Jong-Hwan Kim, and Jae-Min Kim, “NN-KoG2P: A Novel Grapheme-to-Phoneme Model for Korean Language,” ICASSP 2021, [IEEE Xplore](https://ieeexplore.ieee.org/document/9414653), DOI: [10.1109/ICASSP39728.2021.9414653](https://doi.org/10.1109/ICASSP39728.2021.9414653).

A secondary technical review describes the system as a feed-forward neural network (FFNN) that builds syllable-level features from surrounding eojeol context and adds phonological-phrasing information. This matters for benchmark design: a token-only runner would remove model inputs that the paper says are material to prediction. Review: [NN-KOG2P architecture summary](https://github.com/changjinhan/ChangjinHan.github.io/blob/43052bb97df0da5383e2cf8cc5232a25a39afe17/_posts/2022-01-12-NN-KOG2P.md). This secondary source is used to understand the reported architecture, not as evidence of model accuracy.

## Compatibility with our benchmark suites

- **UGTPHON Korean test:** the corpus includes sentence text and token-level annotations, so a future adapter may be possible only if the released model accepts the available inputs and its output can be aligned to the annotated tokens without losing sentence context. The existing native/G2P harness scores canonical isolated tokens; that path is not a faithful NN-KoG2P invocation.
- **SIGMORPHON:** the current lexical/word-level benchmark is not, by itself, sufficient to reproduce NN-KoG2P's context and phonological-phrasing features. It can be used only if the official benchmark's input representation and model contract are compatible, or if a separate, explicitly labelled context-free ablation is designed.
- **Gold conventions:** NN-KoG2P output must be normalized using the existing documented IPA profile and evaluated against the exact same rows and denominator as comparison systems. Do not report paper metrics as our results.
- **No training on test data:** if the original weights cannot be obtained, reproducing the architecture would require a lawful, provenance-documented training corpus and a separate training/validation split. UGTPHON test, SIGMORPHON test, and the project's 24-form holdout must not be used for training, tuning, or model selection.

## Task ledger

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Locate primary publication | DONE_VERIFIED | IEEE record and DOI linked above |
| Verify a runnable public implementation and checkpoint | BLOCKED | No verifiable inference code/checkpoint found in the public materials checked during this attempt. Reopen when the authors' implementation or weights and terms are identified. |
| Build a faithful adapter | PARTIAL | Generic context-preserving sentence-level evaluator and tests added at `scripts/benchmark_contextual_g2p_ko.py`; authentic NN-KoG2P runtime adapter remains blocked on the actual model artifact, input contract, and phone-to-IPA mapping |
| Run UGTPHON | BLOCKED | No NN-KoG2P inference run: requires verified model artifact, documented sentence-level inference, and a source-backed phone-to-IPA mapping. The evaluator is infrastructure only. |
| Run SIGMORPHON | BLOCKED / compatibility-limited | The existing set is lexical/word-level and cannot validate sentence-context behavior. Only a clearly labelled context-free ablation is acceptable if the authentic model's word-level interface is documented. |
| Compare paired cases and publish scores | TODO | Same rows, normalization, denominators, coverage, abstentions/errors, per-case predictions, and uncertainty estimates where appropriate |
| Licensing and provenance review | BLOCKED | Model/code/data license cannot be inferred from the paper alone; verify before use or redistribution. No model artifact or license was found in the public materials checked. |

## Next concrete action

Search for an author-maintained release, checkpoint, or an explicitly supported research implementation; record exact repository/commit, model artifact hash, license, and inference instructions. If none is available, ask the authors for the artifact or leave NN-KoG2P as a documented unavailable baseline. Do not substitute CharsiuG2P scores, train a lookalike and label it NN-KoG2P, or invent benchmark results.

## Architectural constraint

Even if NN-KoG2P becomes runnable, it is an IPA candidate provider only. It must not bypass ClippyFirst's typed IPA boundary or generate Ukrainian output independently from Hangul.


## Additional source and release search — 2026-10-26

A further search checked the public Korean G2P comparison repository [kr-MATAGI/IPA_G2P-Testing](https://github.com/kr-MATAGI/IPA_G2P-Testing). Its README lists several neural baselines and runnable scripts for Charsiu T5 and KoGPT, but does not list NN-KoG2P as an available implementation; its literature table names the NN-KoG2P paper without an open-source code link. This is corroborating evidence for the current blocker, not proof that no private or unindexed artifact exists.

The same authors later published [Fast Bilingual Grapheme-To-Phoneme Conversion (NAACL 2022)](https://aclanthology.org/2022.naacl-industry.32/). That is a **different model** (a bilingual non-autoregressive Transformer/CRF), not NN-KoG2P itself. Its paper reports in-domain Korean PER figures, but neither those figures nor the paper's internal test set are results on our UGTPHON/SIGMORPHON inputs. The publication page does not expose a verified runnable implementation/checkpoint in the sources checked. Do not substitute it under the NN-KoG2P name.

## Context-preserving evaluation boundary added

Added `scripts/benchmark_contextual_g2p_ko.py` and `tests/test_contextual_g2p_benchmark.py`. The evaluator accepts sentence-level outputs only when the runner declares `input_granularity=sentence`, `output_kind=ipa`, and the exact canonical sentence input. It checks IDs, rejects Hangul output that has not passed through a verified phone-to-IPA adapter, reports missing predictions as reduced coverage, and emits per-sentence predictions plus exact match/CER. The existing multi-engine workflow now runs its unit tests.

This is **benchmark infrastructure only**; it is not the NN-KoG2P model adapter, does not generate model predictions, and has not produced NN-KoG2P scores. It makes the sentence-level acceptance contract executable while the actual model and verified phone-to-IPA mapping remain unavailable. SIGMORPHON remains word-level and cannot test the model's sentence-context behavior without a separately labelled context-free experiment.



## Broader neural candidate triage — 2026-10-26

A runnable alternative was executed in CI: CharsiuG2P multilingual ByT5 small. It is a separate model and is **not** labelled NN-KoG2P. Its actual per-case artifact is [run 40285484220](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40285484220), artifact [12633674500](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40285484220/artifacts/12633674500). UGTPHON scored 2,393/2,703 exact (88.5313%), CER 3.6239%, 100% coverage; SIGMORPHON scored 709/999 exact (70.9710%), CER 5.4081%, 100% coverage. These scores are diagnostic, not NN-KoG2P scores and not leakage-free generalization evidence.

- Official model page: https://huggingface.co/charsiu/g2p_multilingual_byT5_small_100. The CharsiuG2P code repository declares MIT, but the Hugging Face model page does not state a weights license. Rights for weights are **UNRESOLVED**; inference is research-only and weights are never uploaded.
- Tokenizer page: https://huggingface.co/google/byt5-small (Apache-2.0). The workflow resolves model prefix ed5cf99 and tokenizer prefix 68377bd to full immutable SHAs and records hashes.
- The public kr-MATAGI/IPA_G2P-Testing repository lists both a Charsiu T5 script and a KoGPT script. The latter is training/fine-tuning oriented; KakaoBrain's own model card declares pretrained KoGPT weights CC-BY-NC-ND 4.0 and recommends 32 GB GPU RAM for the 6B model. It is not a suitable, clearly licensed CPU G2P baseline for this run.
- SMART-G2P handles code-mixed transliteration and uses g2pk/KoG2P for pronunciation; it is not an independent neural G2P model.
- The current Charsiu adapter explicitly records empty outputs, invalid Hangul outputs and model errors; per-case outputs and paired ClippyFirst/g2pk comparisons are included in the artifact. No metric is claimed before real inference completes.


## Executed alternative neural benchmark — explicitly not NN-KoG2P

### Provenance and acceptance limits

- Model: `charsiu/g2p_multilingual_byT5_small_100`, immutable revision `ed5cf99707fb39f5f3ccc461530d56b6fb531fd3`; tokenizer: `google/byt5-small`, immutable revision `68377bdc18a2ffec8a0533fef03b1c513a4dd49d`.
- Neural inference run: [40285484220](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40285484220), raw per-case artifact [12633674500](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40285484220/artifacts/12633674500). Model weights SHA-256: `1ef4032409d33944e4249f959d028f78436f968e26b81cb6b0d508a6cf12ce6c`; 1,198,608,045 bytes. The artifact contains predictions/provenance only, not weights.
- Model code repository declares MIT, but the individual checkpoint page does not state a weights license. **Weights rights remain UNRESOLVED**; do not redistribute or vendor them. Tokenizer license is Apache-2.0.
- UGTPHON is scored as a word/token-level ablation; sentence context is not passed into CharsiuG2P. SIGMORPHON is a lexical benchmark. Neither validates sentence-context behavior, normative IPA correctness, or IPA-to-Ukrainian rendering.
- No fine-tuning or test-set selection was performed. The upstream checkpoint's training-data overlap with these public benchmark sources could not be ruled out, so the scores must not be described as leakage-free generalization.
- A post-run defect was found in the optional in-job g2pk adapter: it imported the segment parser/renderer from the wrong module. The import was corrected and regression-tested. The full paired comparison is recomputed from the six-engine occurrence ledger by workflow [40286994417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40286994417); do not use the failed embedded g2pk pair counts from the first raw artifact.

### Same-split baseline context

| System | UGTPHON exact / CER | SIGMORPHON exact / CER |
|---|---:|---:|
| CharsiuG2P multilingual ByT5 small | 88.5313% / 3.6239% | 70.9710% / 5.4081% |
| ClippyFirst native | 53.0022% / 9.1697% | 35.8074% / 14.7037% |
| g2pk 0.9.4 | 53.0892% / 9.2285% | 35.3353% / 14.8222% |
| KoG2P | 27.3030% / 19.5122% | 18.7187% / 21.8327% |
| hangul_to_ipa | 16.2412% / 24.8054% | 8.9089% / 29.8448% |
| eSpeak NG | 8.1391% / 33.6101% | 4.3043% / 40.7236% |
| phonemize 2.0.1 | 42.5453% / 14.3531% | 28.9289% / 17.4387% |

The complete paired per-occurrence report is generated by [workflow 40286994417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40286994417). It compares on the same scored occurrence IDs, separates coverage from accuracy, records per-case raw outputs/statuses, and includes paired row-cluster bootstrap intervals. This alternative model's result does not change the NN-KoG2P status: NN-KoG2P remains **BLOCKED / not scored** until authentic weights, a faithful context-preserving inference contract, license terms, and a verified phone-to-IPA map are found.
