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


## Neural integration decision — 2026-10-26

**Keep the neural model outside the production runtime for now.** The current scratch teacher has 60.2% exact token-sequence match on the SIGMORPHON dev convention, was selected on that dev split, and has no independently normalized comparison against ClippyFirst broad IPA. That is insufficient evidence for a production fallback or ensemble. The owner-approved direction is to improve ClippyFirst's own engine with traceable data; therefore use the model offline as a hypothesis generator only. A candidate becomes a production rule only after primary-source phonological analysis, exact environment/exception definition, independent review, positive and negative regression controls, and improvement on a separate eligible evaluation set.

Revisit direct neural runtime integration only if a separately evaluated model has materially better independently adjudicated IPA performance, acceptable latency/resource behavior, reproducible packaging, and a justified operational benefit over the deterministic engine. No such evidence currently exists.


## Exact source-symbol inventory — 2026-10-26

Added `scripts/audit_korean_ipa_symbol_inventories.py`, tests, and an artifact-producing step in the pinned-corpus workflow. Exact-head run [40305565459](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305565459) passed and uploaded artifact [12641804746](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305565459/artifacts/12641804746).

Observed inventory (raw data counts, not adjudicated phone inventory):

- SIGMORPHON: 8,000 train rows / 1,000 dev rows; 47 / 46 distinct Unicode code points; 60 / 59 distinct source-whitespace target tokens. The audit preserves those source tokens but does not claim that every token is a ClippyFirst segment.
- UGTPHON: 13,271 train / 1,897 dev token occurrences; 8,753 / 1,629 unique source forms; 51 / 50 distinct Unicode code points. The tool deliberately does not segment compact target strings into phones.
- Both sources contain numerous combining phonetic marks; their frequencies differ. For example, the length mark `ː` occurs 1,630 times in SIGMORPHON train targets versus 105 times in UGTPHON train targets; primary stress `ˈ` occurs 105 times in UGTPHON train and is absent from the SIGMORPHON train inventory. This is a measurable convention difference, not a rule to erase either feature.
- UGTPHON's raw inventory includes `ç` (211 occurrences in train) and `ø` (300 occurrences in train), neither present in SIGMORPHON train. Example raw rows include `비키니 → pikçini` and `사인회 → sʰa̠inɦø̞`. These may reflect source-specific notation, a variant, or a data issue; the inventory alone cannot decide which. They are explicit review targets, not automatically mapped or discarded.

This inventory narrows the work required for the adapter, but it is not the adapter. All source symbols and diacritics remain preserved, and all 366 shared-form conflicts remain unadjudicated.
