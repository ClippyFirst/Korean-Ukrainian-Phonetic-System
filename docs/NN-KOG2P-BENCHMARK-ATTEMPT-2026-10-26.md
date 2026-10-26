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
| Build a faithful adapter | TODO | Must consume required context/phrasing inputs and preserve source-to-output alignment; must not pretend isolated-token inference is equivalent |
| Run UGTPHON | TODO / dependency-blocked | Requires verified model artifact, documented inference, exact test inputs, and token alignment |
| Run SIGMORPHON | TODO / compatibility-blocked | Requires a documented input contract or a clearly labelled context-free ablation |
| Compare paired cases and publish scores | TODO | Same rows, normalization, denominators, coverage, abstentions/errors, per-case predictions, and uncertainty estimates where appropriate |
| Licensing and provenance review | BLOCKED | Model/code/data license cannot be inferred from the paper alone; verify before use or redistribution |

## Next concrete action

Search for an author-maintained release, checkpoint, or an explicitly supported research implementation; record exact repository/commit, model artifact hash, license, and inference instructions. If none is available, ask the authors for the artifact or leave NN-KoG2P as a documented unavailable baseline. Do not substitute CharsiuG2P scores, train a lookalike and label it NN-KoG2P, or invent benchmark results.

## Architectural constraint

Even if NN-KoG2P becomes runnable, it is an IPA candidate provider only. It must not bypass ClippyFirst's typed IPA boundary or generate Ukrainian output independently from Hangul.
