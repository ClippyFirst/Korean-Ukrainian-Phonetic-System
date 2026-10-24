# Korean engine benchmark suite register — 2026-10-24

## Purpose and rules

This register separates pronunciation quality, output coverage, software parity, and the Ukrainian adaptation layer. A suite is not considered complete merely because a script or fixture exists. Report the dataset/version, licensing/provenance, denominator, abstentions, runtime errors, exact match, CER, confidence intervals where sampling supports them, and known limitations. Do not turn diagnostic corpora into normative acceptance gates.

## Eight complementary benchmark suites

| # | Suite | Primary question and metrics | Current state | Acceptance evidence still required |
|---:|---|---|---|---|
| 1 | External broad-IPA comparison (UGTPHON) | Compare native strict/soft and pinned external G2P systems; coverage, abstention, exact match, CER, paired deltas and row-cluster CIs | **PARTIAL — diagnostic run exists** (40087193952; pinned UGTPHON ko/test.json, 2,703 occurrences). Noisy user-generated text, not NIKL gold. | Re-run the revised v2 script; archive full native-abstention occurrence audit; keep external engine and adapter versions pinned. |
| 2 | Official NIKL rule examples (items 1–30) | Rule-environment correctness against official Korean orthography/pronunciation standards; per-item pass/fail and cited rule provenance | **PARTIAL — DONE_VERIFIED for the existing native-engine finite normative regression suite; not yet a multi-engine score benchmark.** The repository contains 한국어 어문 규범.htm and a 30-article coverage ledger (29 verified, Article 1 correctly marked not-applicable as a standalone rewrite). The current CI verification passed 1,213 browser tests and the Python regression job. | Preserve this source-backed native regression gate. For external-engine comparison, create an independently reviewed per-example IPA gold file with precise article/subparagraph provenance; do not treat native output as independent gold. |
| 3 | Rule-phenomenon challenge set | Isolate liaison, nasalization, lateralization, aspiration, fortition, ㄴ-insertion, palatalization, coda neutralization, irregulars, and interactions; per phenomenon and interaction-level accuracy | **PARTIAL** — existing article-specific and adversarial regression tests cover many phenomena, but they are not yet one stratified, cross-engine scoring dataset with independent IPA gold. | Consolidate source-backed minimal/near-minimal examples into a balanced benchmark, preserve rule/subparagraph provenance, and split by lexical item to avoid leakage. |
| 4 | Morphology and boundary sensitivity | Compare strict/soft and analyzer hypotheses only where the relevant rule environment is licensed; report segmentation agreement separately from pronunciation accuracy | **PARTIAL — research ablation exists** (40087193870). Existing boundary gates are naive and do not establish rule licensing. | Gold morpheme boundaries plus rule-specific morphosyntactic labels reviewed by a Korean-language expert; evaluate held-out words and interactions. |
| 5 | Python ↔ browser parity | Ensure runtimes return the same structured result, IPA, status, and target rendering for identical inputs; exact parity and categorized divergence count | **PARTIAL** — current differential: 18/20 equal, two known divergences (넓죽하다, 읽고). | Resolve each against the exact official rule environment, then expand fixtures across all supported rules and malformed/unresolved states. |
| 6 | IPA → Ukrainian target rendering | Score only the target adapter: independently approved Ukrainian practical forms from a fixed source IPA sequence; character/word accuracy and uncertainty handling | **TODO** — no independently adjudicated full-system Ukrainian gold corpus is established in the reviewed benchmark report. | Build a separate IPA-to-Ukrainian corpus reviewed by Ukrainian transcription specialists; include contrasts, syllable boundaries, punctuation, length/tone policy, and unsupported IPA. |
| 7 | Robustness, abstention, and fail-closed behavior | Ensure unsupported/ambiguous input never silently becomes a confident guess; report abstention precision/recall, malformed-input handling, and runtime errors | **PARTIAL** — fail-closed renderer regression tests exist; benchmark-wide abstention audit was missing. The multi-engine script now emits occurrence-level native abstentions in report schema v2. | Run v2 workflow; assert every unresolved occurrence has reason/context; test empty, mixed-script, punctuation, unknown symbols, malformed IPA, and missing word-level analyses. |
| 8 | Regression, contamination, and release reproducibility | Detect regressions by commit; verify deterministic outputs, data/source pins, clean-install behavior, artifact drift, and no train/test overlap | **PARTIAL** — Python/browser CI and build passed on the reviewed executable source, but benchmark workflows were not rerun on the merge commit. | Re-run on current main; archive commit SHA and dependency/source pins; validate deterministic report schema and clean install; separate development examples from holdout. |

## External benchmark and corpus candidates found during research

These are candidates for ingestion or derived, provenance-preserving fixtures, not automatically approved gold data. Validate exact files, pronunciation convention, split, license, and source version before use.

| Candidate | What it adds | Decision |
|---|---|---|
| SIGMORPHON 2021 Korean G2P / WikiPron (`kor`) | Published word-level G2P dataset; the pinned public kor_test.tsv has 1,000 word/IPA pairs and complements noisy UGTPHON with a lexical test. Note: the upstream README describes test input as word-only, whereas the pinned file actually contains labels. | **IMPLEMENTED — awaiting workflow results** in scripts/convert_sigmorphon_ko.py + the multi-engine workflow. Uses pinned source commit 821bcdece5a47820872215969f275004b0abe80c; verifies the upstream README’s CC BY-SA 3.0 data terms; does not vendor corpus data. Scores the same native and external engine portfolio as UGTPHON in a separate report. Source: https://github.com/sigmorphon/2021-task1 |
| Mun, Kim & Ko (2022), “A proposal to improve on existing Grapheme-to-Phoneme conversion models informed by linguistics” | Reports a manually phonetic-transcribed golden corpus and per-phenomenon comparison of g2pk and KoG2P; highlights /h/ deletion, 의 variation, place assimilation, rule ordering, and prosodic boundaries. | **HIGH PRIORITY for rule-stratified evaluation**. First verify whether item-level corpus and annotations are publicly available and reusable; do not recreate unseen gold labels from paper summaries. DOI: https://doi.org/10.29403/LI.26.2.2 ; full text: https://seongmin-mun.github.io/MyWebsite/Seongmin/Resources/2.Publicated%20Papers/KCI/The%20Korean%20Society%20for%20Language%20and%20Information/A%20proposal%20to%20improve%20on%20existing%20Grapheme-to-Phoneme%20conversion%20models%20informed%20by%20linguistics/KCI_FI002922160.pdf |
| NIKL dictionaries (한국어기초사전 / 표준국어대사전 / 우리말샘) | Potential lexical headwords and pronunciation fields, depending on which downloadable dataset exposes the needed fields. Third-party mirrored XML is not proof of NIKL endorsement. | **HIGH PRIORITY to inspect primary NIKL downloads and applicable license/terms**. Preserve pronunciation records and source identifiers; do not assume every entry is an IPA transcription. Dataset mirror: https://github.com/spellcheck-ko/korean-dict-nikl |
| CJKI Korean Phonetic Database (KPD) | Vendor describes 120,000+ Korean entries with IPA, POS, and phonological attributes. | **BLOCKED pending commercial access and written reuse terms**; do not copy/vendor its data absent permission. https://www.cjk.org/data/korean/nlp/korean-phonetic-database/ |
| Nexdata Korean Pronunciation Dictionary | Public GitHub landing page describes 444,202 linguist-produced word/pronunciation entries, but explicitly labels the dataset commercial. | **BLOCKED pending license/access**; the GitHub README is not an open data license. https://github.com/Nexdata-AI/444202-Korean-Pronunciation-Dictionary |
| KoBALT-700 | Expert-authored linguistic questions, including phonetics/phonology and morphology. | Use as a **source for designing challenge categories**, not as direct G2P gold; its multiple-choice tasks are not word-to-IPA pairs. https://knlp.snu.ac.kr/research/benchmarks |
| Seoul Corpus / Zeroth-Korean / KsponSpeech | Acoustic speech corpora; some include phonetic labels or orthographic/pronunciation transcription, with varying access and license conditions. | **Optional audio-backed validation track**, not an immediate replacement for lexical G2P gold. Verify alignment, transcription convention, and license per corpus. Seoul Corpus: https://openslr.org/113/ ; Zeroth: https://openslr.org/40/ |

### Recommended benchmark portfolio

1. Keep UGTPHON for noisy user-generated text.
2. Run SIGMORPHON/WikiPron as a separate 1,000-item lexical benchmark; the adapter and workflow are implemented, but results are not accepted until CI finishes and the generated report is inspected.
3. Reconstruct NIKL items 1–30 as a normative rule suite directly from the repository's official source file; this remains a distinct acceptance gate.
4. Obtain and verify the 2022 paper's manual gold corpus if the authors' release is available.
5. Keep morphology, Python/browser parity, IPA-to-Ukrainian rendering, abstention robustness, and regression/reproducibility as separate suites.

Do not combine scores from these sets into one headline number: they test different input domains and pronunciation conventions. Report per-suite results and a separately labelled macro-summary only if the metric and normalization are defensible.

## Current evidence snapshot

The latest recorded multi-engine diagnostic scored 2,655/2,703 occurrences for native strict (98.2242% coverage) and 2,703/2,703 for g2pK (100%). Native strict had 48 unresolved token occurrences but 47 unique unresolved words; repeated occurrences explain the difference. g2pK's complete output coverage is not equivalent to complete correctness. On the 2,655 shared occurrences, the recorded g2pK-minus-native exact-match delta is +0.7909 percentage points and CER delta is −0.3819 percentage points. This is a small, corpus-specific comparison against noisy UGTPHON annotations, not evidence of normative superiority.

The g2pK comparison is not fully independent at the representation layer: the benchmark takes g2pK's Hangul surface output and sends it through ClippyFirst's IPA segment renderer. This shares a realization component with the native engine, even though the native phonological rules are not rerun on g2pK's output.

## Current task ledger

- **DONE_VERIFIED** — core-owned IPA-to-Ukrainian renderer is merged; regression tests route through the ClippyFirst core and verify fail-closed behavior.
- **DONE_VERIFIED** — previous pinned external-engine benchmark artifact exists and is linked in docs/BENCHMARK-REVIEW-2026-10-24.md.
- **PARTIAL** — current UGTPHON run quantified the coverage/accuracy tradeoff but its artifact only contains a truncated diagnostic mismatch sample and does not preserve all unresolved occurrences.
- **TODO** — run the updated scripts/benchmark_multi_engine_ko.py on the benchmark workflow and inspect every row of native_abstention_audit.occurrences. Classify each case as a specific rule environment, missing/unsupported morphology context, input/corpus anomaly, or engine error. Do not infer rule changes from another engine's output alone.
- **TODO** — complete suites 2, 3, and 6 with source-grounded, independently reviewed expected outcomes.
- **TODO** — expand suites 5, 7, and 8; retain suite 4 as research-only until morphology labels and licensing are independently reviewed.
- **BLOCKED** — normative accuracy claims remain blocked until a source-grounded, adjudicated NIKL holdout and a separately reviewed Ukrainian rendering gold set exist.
- **DEFERRED** — treating any one external engine as production authority solely because it has 100% output coverage.

## Reproduction and source links

- Multi-engine diagnostic run: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087193952
- Morphology research ablation: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087193870
- Main-commit tests/build: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087346890
- Main-commit system verification: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087346894
- Benchmark driver: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/blob/main/scripts/benchmark_multi_engine_ko.py


## Execution update — SIGMORPHON lexical suite (2026-10-24)

- **IMPLEMENTED / CI PENDING** — added a converter for the pinned SIGMORPHON 2021 Korean kor_test.tsv file and extended the multi-engine workflow to run the same engine portfolio separately on this lexical gold split.
- Upstream source pin: sigmorphon/2021-task1@821bcdece5a47820872215969f275004b0abe80c; test file data/medium/kor_test.tsv; expected 1,000 unique word/IPA pairs. The upstream README declares the dataset under CC BY-SA 3.0 inherited from Wiktionary. The benchmark downloads the test data in CI and does not commit a copy.
- The converter rejects malformed TSV, missing phones, duplicate words, and row-count drift. The shared driver records the dataset name/source in the JSON report and keeps abstention and engine errors separate from scored outputs. Because the upstream README format description conflicts with the actual pinned file schema, this is explicitly a public paired-file diagnostic, not a reproduction of the hidden-label shared-task evaluation or a directly comparable leaderboard score. The report is still valid as an independently labelled lexical comparison, subject to external-model contamination risks.
- The official test TSV includes some non-standard Hangul code points outside the engine's current syllable-token contract; those are intentionally excluded by the shared engine scorer rather than guessed or silently normalized. The report's eligible denominator must be read alongside the 1,000 source rows.
- **Not yet verified** — benchmark results are pending the new GitHub Actions run. Do not treat converter tests or workflow definition alone as successful engine execution.
- **PARTIAL** — NIKL rules 1–30 already have a passing native-engine regression gate and a 30-article evidence ledger (29 verified, Article 1 not applicable as a standalone rewrite); a cross-engine score still needs independent IPA gold. The 2022 paper's item-level golden corpus needs author/source verification; commercial CJKI and Nexdata data remain excluded without explicit reuse permission.
