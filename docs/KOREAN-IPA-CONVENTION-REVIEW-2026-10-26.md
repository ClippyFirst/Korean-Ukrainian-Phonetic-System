# Korean IPA source-convention review — 2026-10-26

## Evidence-backed findings

### SIGMORPHON 2021 medium Korean

Pinned source: [SIGMORPHON 2021 task repository at `821bcdece5a47820872215969f275004b0abe80c`](https://github.com/sigmorphon/2021-task1/tree/821bcdece5a47820872215969f275004b0abe80c).

The upstream task README defines each target as a roughly-phonemic IPA phone sequence tokenized with the `segments` library. The source describes the data as WikiPron/Wiktionary-derived. The 2021 SIGMORPHON proceedings paper states that post-processing removes stress and syllable markers and handles IPA segmentation for combining/modifier diacritics and contour information. Therefore:
- source whitespace separates phone tokens; joining tokens is serialization-only;
- absence of stress or syllable markers is not evidence that stress or syllable boundaries are absent in the spoken form;
- the target is not guaranteed to match ClippyFirst's broad-IPA contract merely because both use IPA symbols.

Primary references:
- https://github.com/sigmorphon/2021-task1/blob/821bcdece5a47820872215969f275004b0abe80c/README.md
- https://sigmorphon.github.io/workshops/2021/2021_SIGMORPHON_Proceedings.pdf

### UGTPHON Korean

Pinned source: [UGTPHON at `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`](https://github.com/naver-ai/UGTPHON/tree/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54).

The upstream README describes Korean token `phoneme` annotations as IPA lookups from the Korean IPA-Dict lexicon checked by native-speaker annotators; uncovered forms are transcribed manually. The schema permits comma-separated accepted pronunciations, and the corpus's token-level phoneme field is not interchangeable with its sentence-level `phonemes` field. The current builder conservatively excludes comma variants/placeholders and preserves the chosen token annotation. The source's IPA may contain diacritics and narrow phonetic detail, so it cannot be assumed to match the SIGMORPHON convention or ClippyFirst broad IPA.

Primary references:
- https://github.com/naver-ai/UGTPHON/blob/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/README.md
- https://github.com/naver-ai/UGTPHON/blob/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/ko/LICENSE

## Executable conflict queue

`scripts/build_korean_ipa_adjudication_queue.py` builds a deterministic queue from the pinned **train/train** overlap only. It preserves every source candidate and provenance ID, records literal Unicode code points without calling them phonemes, classifies serialization-exact / dot-only / length-only / other differences diagnostically, and leaves all review and mapping fields unset. It rejects dev/test inputs and mismatched source pins.

The queue is not a converter, does not select a gold corpus, does not merge datasets, and does not generate production rules. The prior compatibility audit found 1,084 shared train forms: 718 match after only removing SIGMORPHON token-separator whitespace; 366 require review (151 length-mark-only diagnostics, 215 other symbol/feature diagnostics, zero dot-only). These categories are not normalization instructions.

## Adapter decision

**Decision: do not yet map source symbols into ClippyFirst broad IPA.** The upstream evidence establishes different annotation pipelines, but it does not by itself establish the symbol-by-symbol correspondence for the exact shared Korean forms. In particular, deleting length marks would hide a documented discrepancy rather than adjudicate it, and converting every Unicode code point into a “phone” would be an unsupported segmentation assumption.

The next acceptable adapter must be a versioned, source-specific mapping table with:
- source symbol or typed feature, exact source convention, and pinned evidence;
- output segment/feature in the ClippyFirst IPA contract;
- explicit one-to-one, one-to-many, many-to-one, or unmapped status;
- an information-loss record for each lossy mapping;
- independent reviewer status and source examples;
- regression tests for mapped, ambiguous, and unmapped inputs.

Until that gate is met, neural-versus-Strict accuracy comparisons across these targets would be invalid. The scratch teacher's 60.2% dev exact match remains only a SIGMORPHON-source-token-sequence metric, not ClippyFirst broad-IPA accuracy. No production phonological rule or runtime output is changed by this work.
