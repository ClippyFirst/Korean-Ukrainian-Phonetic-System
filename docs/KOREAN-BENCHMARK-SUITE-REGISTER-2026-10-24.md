# Korean engine benchmark suite register — 2026-10-24

## Purpose and rules

This register separates pronunciation quality, output coverage, software parity, and the Ukrainian adaptation layer. A suite is not considered complete merely because a script or fixture exists. Report the dataset/version, licensing/provenance, denominator, abstentions, runtime errors, exact match, CER, confidence intervals where sampling supports them, and known limitations. Do not turn diagnostic corpora into normative acceptance gates.

### Latest engine-error finding (2026-10-24)

PR #298 is merged at 468ac8a690812e455eef1437ecf4b91ea67bdc75 and fixes R002 dropping coda ㅇ (/ŋ/) during liaison. PR #299 is merged at f1267f700b2a7ff726765fc17b6d2fa093561dfb and fixes broad-IPA /j/ retention after ㅈ/ㅉ/ㅊ + ㅕ under NIKL Standard Pronunciation Rule 5, exception 1. PR #297 is merged at 2f7b58f0b7d976b9d660f21a739145ce19c533ab; it added source-backed exact-form R010 (§24) licenses for 닮다 and 넘게, with native Python and browser-engine regressions.

Latest complete six-engine run: [40092929978](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978), artifact [12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692). On revised broad-IPA normalization, native UGTPHON exact match is 1,412/2,655 (53.1827%), CER 9.1883%; paired g2pk is 1,416/2,655 exact (53.3333%), CER 9.2414%. The remaining four g2pk-only exact occurrences are repeated instances of 없는, where the NIKL-attested long vowel is absent from the corpus reference. The two morphology-rule gaps 닮다 and 넘게 were fixed with exact-form R010 licenses, not a blanket heuristic.

On SIGMORPHON, native is 357/997 exact (35.8074%) versus g2pk 353/997 on the same scored subset (35.4062%); g2pk's paired exact delta is −0.4012 pp (95% CI −0.8024 to −0.1003). The two datasets do not support a universal g2pk advantage. All 48 UGTPHON abstention occurrences and both SIGMORPHON abstentions are present in the complete schema-v4 pairwise artifact.

## Eight complementary benchmark suites

| # | Suite | Primary question and metrics | Current state | Acceptance evidence still required |
|---:|---|---|---|---|
| 1 | External broad-IPA comparison (UGTPHON) and public paired lexical file (SIGMORPHON) | Multi-engine exact match, CER, coverage, abstention, engine errors, paired differences and uncertainty intervals | **DONE_VERIFIED for post-fix diagnostic execution and full pairwise error ledger** — run 40092929978 and artifact 12559692692 contain six engines on both pinned datasets, all 48 UGTPHON abstentions, both SIGMORPHON abstentions, and complete native-vs-g2pk occurrence categories. The report is post-R002, post-yod, and post-R010 fixes. | Keep datasets separate; rerun when engine/rules or normalization changes. Do not promote these scores to normative accuracy or Ukrainian-rendering claims. |
| 2 | Official NIKL rule examples (items 1–30) | Rule-environment correctness against official Korean orthography/pronunciation standards; per-item pass/fail and cited rule provenance | **PARTIAL — DONE_VERIFIED for the existing native-engine finite normative regression suite; not yet a multi-engine score benchmark.** The repository contains 한국어 어문 규범.htm and a 30-article coverage ledger (29 verified, Article 1 correctly marked not-applicable as a standalone rewrite). The current CI verification passed 1,213 browser tests and the Python regression job. | Preserve this source-backed native regression gate. For external-engine comparison, create an independently reviewed per-example IPA gold file with precise article/subparagraph provenance; do not treat native output as independent gold. |
| 3 | Rule-phenomenon challenge set | Isolate liaison, nasalization, lateralization, aspiration, fortition, ㄴ-insertion, palatalization, coda neutralization, irregulars, and interactions; per phenomenon and interaction-level accuracy | **PARTIAL** — existing article-specific and adversarial regression tests cover many phenomena, but they are not yet one stratified, cross-engine scoring dataset with independent IPA gold. | Consolidate source-backed minimal/near-minimal examples into a balanced benchmark, preserve rule/subparagraph provenance, and split by lexical item to avoid leakage. |
| 4 | Morphology and boundary sensitivity | Compare strict/soft and analyzer hypotheses only where the relevant rule environment is licensed; report segmentation agreement separately from pronunciation accuracy | **PARTIAL — research ablation exists** (40087193870). Existing boundary gates are naive and do not establish rule licensing. | Gold morpheme boundaries plus rule-specific morphosyntactic labels reviewed by a Korean-language expert; evaluate held-out words and interactions. |
| 5 | Python ↔ browser parity | Ensure runtimes return the same structured result, IPA, status, and target rendering for identical inputs; exact parity and categorized divergence count | **PARTIAL** — the prior differential was 18/20 equal (넓죽하다, 읽고). This branch adds source-backed R010 parity for 닮다 and 넘게; the latest cross-runtime rerun is pending. | Resolve each against the exact official rule environment, then expand fixtures across all supported rules and malformed/unresolved states. |
| 6 | IPA → Ukrainian target rendering | Score only the target adapter: independently approved Ukrainian practical forms from a fixed source IPA sequence; character/word accuracy and uncertainty handling | **TODO** — no independently adjudicated full-system Ukrainian gold corpus is established in the reviewed benchmark report. | Build a separate IPA-to-Ukrainian corpus reviewed by Ukrainian transcription specialists; include contrasts, syllable boundaries, punctuation, length/tone policy, and unsupported IPA. |
| 7 | Robustness, abstention, and fail-closed behavior | Ensure unsupported/ambiguous input never silently becomes a confident guess; report abstention precision/recall, malformed-input handling, and runtime errors | **DONE_VERIFIED for audit emission; PARTIAL for resolution of abstentions** — schema v4 records every native abstention and the complete native-vs-g2pk ledger. 19 abstentions coincide with g2pk exact matches and 29 do not; each remaining case still requires source-backed morphology/IPA adjudication. | Run v2 workflow; assert every unresolved occurrence has reason/context; test empty, mixed-script, punctuation, unknown symbols, malformed IPA, and missing word-level analyses. |
| 8 | Regression, contamination, and release reproducibility | Detect regressions by commit; verify deterministic outputs, data/source pins, clean-install behavior, artifact drift, and no train/test overlap | **PARTIAL** — Python/browser CI and build passed on the reviewed executable source, but benchmark workflows were not rerun on the merge commit. | Re-run on current main; archive commit SHA and dependency/source pins; validate deterministic report schema and clean install; separate development examples from holdout. |

## External benchmark and corpus candidates found during research

These are candidates for ingestion or derived, provenance-preserving fixtures, not automatically approved gold data. Validate exact files, pronunciation convention, split, license, and source version before use.

| Candidate | What it adds | Decision |
|---|---|---|
| SIGMORPHON 2021 Korean G2P / WikiPron (`kor`) | Published word-level G2P dataset; the pinned public kor_test.tsv has 1,000 word/IPA pairs and complements noisy UGTPHON with a lexical test. Note: the upstream README describes test input as word-only, whereas the pinned file actually contains labels. | **IMPLEMENTED — awaiting workflow results** in scripts/convert_sigmorphon_ko.py + the multi-engine workflow. Uses pinned source commit 821bcdece5a47820872215969f275004b0abe80c; verifies the upstream README’s CC BY-SA 3.0 data terms; does not vendor corpus data. Scores the same native and external engine portfolio as UGTPHON in a separate report. Source: https://github.com/sigmorphon/2021-task1 |
| Mun, Kim & Ko (2022), “A proposal to improve on existing Grapheme-to-Phoneme conversion models informed by linguistics” | Reports a manually phonetic-transcribed golden corpus and per-phenomenon comparison of g2pk and KoG2P; highlights /h/ deletion, 의 variation, place assimilation, rule ordering, and prosodic boundaries. | **FOUND — 130 annotated rows across 14 phenomenon labels in `seongmin-mun/KoG2Padvanced/Test set/G2P_golden_standard.txt` (10 rows each for most labels; h-neutralization and th-neutralization have 5 each).** This matches the paper-associated repository and includes rule, source ID, underlying text, surface form, target underlying and target surface. **BLOCKED for formal benchmark execution pending explicit dataset reuse license/permission**: the repository tree and README expose no data license. Do not vendor it or publish derived result artifacts until terms are confirmed. Do not recreate unseen gold labels from paper summaries. DOI: https://doi.org/10.29403/LI.26.2.2 ; full text: https://seongmin-mun.github.io/MyWebsite/Seongmin/Resources/2.Publicated%20Papers/KCI/The%20Korean%20Society%20for%20Language%20and%20Information/A%20proposal%20to%20improve%20on%20existing%20Grapheme-to-Phoneme%20conversion%20models%20informed%20by%20linguistics/KCI_FI002922160.pdf |
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

Latest post-fix run 40092929978 scored 2,655/2,703 native occurrences (98.2242% coverage) and 2,703/2,703 g2pk occurrences (100%). Native exact match is 53.1827% with CER 9.1883%; g2pk is 53.0892% over its full denominator with CER 9.2285%. On the fairer 2,655 shared scored occurrences, g2pk has four more exact matches (+0.1506 percentage points; 95% paired row-cluster interval +0.0351 to +0.3243 pp), but its CER difference crosses zero. The four remaining exact-match disagreements are all repeated instances of 없는 where the source-backed long vowel is missing from the UGTPHON reference.

The SIGMORPHON public paired file points the other way: native exact match is 357/997 (35.8074%) versus g2pk 353/997 (35.4062%) on the shared scored set. Native abstains on 48 UGTPHON occurrences across 47 unique words; the full artifact shows 19 of those are g2pk-exact and 29 are not. This is a noisy-corpus diagnostic, not a normative rule-quality ranking.

The g2pk comparison is not fully independent at the representation layer: the benchmark takes g2pk's Hangul surface output and sends it through ClippyFirst's IPA segment renderer. The native phonological rules are not rerun on g2pk output, but the renderer is shared.

## Current task ledger

- **PARTIAL on PR #310** — a core-owned IPA-to-Ukrainian renderer is proposed on `fix/clippyfirst-core-ipa-target-2026-10-24`; it is not yet merged or accepted. Latest-head Python/browser/wheel and integration checks must pass before marking implementation `DONE_VERIFIED`. Independent target accuracy remains `TODO` regardless of CI.
- **DONE_VERIFIED** — post-fix multi-engine benchmark on two pinned diagnostic datasets; complete native-abstention and native-vs-g2pk occurrence-level ledgers emitted and inspected in artifact 12559692692.
- **DONE_VERIFIED** — coda-ㅇ loss fixed in PR #298; broad-IPA glide absorption after palatal affricates fixed in PR #299. Both have regression tests and post-fix benchmark evidence.
- **DONE_VERIFIED** — Python/browser exact-form R010 (§24) licenses for 닮다 and 넘게 passed code-equivalent PR #300 checks (40092757353, 40092757419, 40092757409), and post-merge mainline tests 40093211039, system verification 40093211139, and master-table/research-artifact validation 40093211099 all passed on merge commit 2f7b58f0b7d976b9d660f21a739145ce19c533ab. The rule remains closed-world and does not become a productive morphology guess; Pages deployment 40093211042 subsequently completed successfully.
- **PARTIAL** — 48 native abstentions remain; 19 coincide with g2pk exact matches and 29 do not. Review each against NIKL and the actual morphology context before licensing it.
- **TODO** — complete suites 2, 3, and 6 with source-grounded, independently reviewed expected outcomes.
- **PARTIAL** — expand suites 5, 7, and 8; retain suite 4 as research-only until morphology labels and licensing are independently reviewed.
- **BLOCKED** — normative accuracy claims remain blocked until a source-grounded, adjudicated NIKL holdout and a separately reviewed Ukrainian rendering gold set exist.
- **DEFERRED** — treating any one external engine as production authority solely because it has 100% output coverage.

## Reproduction and source links

- Multi-engine diagnostic run: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087193952
- Morphology research ablation: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087193870
- Main-commit tests/build: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087346890
- Main-commit system verification: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087346894
- Benchmark driver: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/blob/main/scripts/benchmark_multi_engine_ko.py


## Execution update — paper-associated gold corpus discovery (2026-10-24)

- Inspected the paper-associated `seongmin-mun/KoG2Padvanced` repository and found `Test set/G2P_golden_standard.txt`: 130 six-column TSV rows, 14 phenomenon labels, no malformed rows in the pinned current file. The row distribution is coda neutralization 10, coda cluster simplification 10, h-deletion 10, aspiration 10, palatalization 10, h-neutralization 5, th-neutralization 5, n-insertion 10, nasalization 10, lateralization 10, post-obstruent tensing 10, ui 10, liaison 10, place assimilation 10.
- **BLOCKED from being run as a formal/reproducible benchmark** because no license or reuse terms were found in the repository README/tree. Public visibility is not a reuse license. Next acceptance criterion: obtain explicit compatible terms from the authors or locate a separately licensed release; then pin the commit, inspect all six fields, and evaluate underlying→surface as an orthographic-surface task separately from IPA metrics.

## Execution update — SIGMORPHON lexical suite (2026-10-24)

- **IMPLEMENTED / CI PENDING** — added a converter for the pinned SIGMORPHON 2021 Korean kor_test.tsv file and extended the multi-engine workflow to run the same engine portfolio separately on this lexical gold split.
- Upstream source pin: sigmorphon/2021-task1@821bcdece5a47820872215969f275004b0abe80c; test file data/medium/kor_test.tsv; expected 1,000 unique word/IPA pairs. The upstream README declares the dataset under CC BY-SA 3.0 inherited from Wiktionary. The benchmark downloads the test data in CI and does not commit a copy.
- The converter rejects malformed TSV, missing phones, duplicate words, and row-count drift. The shared driver records the dataset name/source in the JSON report and keeps abstention and engine errors separate from scored outputs. Because the upstream README format description conflicts with the actual pinned file schema, this is explicitly a public paired-file diagnostic, not a reproduction of the hidden-label shared-task evaluation or a directly comparable leaderboard score. The report is still valid as an independently labelled lexical comparison, subject to external-model contamination risks.
- The official test TSV includes some non-standard Hangul code points outside the engine's current syllable-token contract; those are intentionally excluded by the shared engine scorer rather than guessed or silently normalized. The report's eligible denominator must be read alongside the 1,000 source rows.
- **Not yet verified** — benchmark results are pending the new GitHub Actions run. Do not treat converter tests or workflow definition alone as successful engine execution.
- **PARTIAL** — NIKL rules 1–30 already have a passing native-engine regression gate and a 30-article evidence ledger (29 verified, Article 1 not applicable as a standalone rewrite); a cross-engine score still needs independent IPA gold. The 2022 paper's item-level golden corpus needs author/source verification; commercial CJKI and Nexdata data remain excluded without explicit reuse permission.


## Verified multi-engine results (2026-10-24)

Successful post-fix run: [40092929978](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978); artifact [12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692). Values use the revised broad-IPA normalization profile. These are diagnostics, not normative NIKL accuracy.

| Dataset | Engine | Coverage | Exact match | CER |
|---|---|---:|---:|---:|
| UGTPHON (2,703 eligible occurrences) | ClippyFirst native, post-fix | 98.2242% | 53.1827% | 9.1883% |
| UGTPHON | g2pk 0.9.4 + ClippyFirst renderer | 100% | 53.0892% | 9.2285% |
| UGTPHON | phonemize 2.0.1 | 100% | 42.5453% | 14.3531% |
| UGTPHON | KoG2P 2019 | 100% | 27.3030% | 19.5122% |
| UGTPHON | hangul_to_ipa | 100% | 16.2412% | 24.8054% |
| UGTPHON | eSpeak NG | 100% | 8.1391% | 33.6101% |
| SIGMORPHON public paired file (999 eligible words) | ClippyFirst native | 99.7998% | 35.8074% | 14.7037% |
| SIGMORPHON public paired file | g2pk 0.9.4 + ClippyFirst renderer | 100% | 35.3353% | 14.8222% |
| SIGMORPHON public paired file | phonemize 2.0.1 | 100% | 28.9289% | 17.4387% |
| SIGMORPHON public paired file | KoG2P 2019 | 100% | 18.7187% | 21.8327% |
| SIGMORPHON public paired file | hangul_to_ipa | 100% | 8.9089% | 29.8448% |
| SIGMORPHON public paired file | eSpeak NG | 100% | 4.3043% | 40.7236% |

Paired g2pk-minus-native exact delta is +0.1506 pp (95% CI +0.0351 to +0.3243) on UGTPHON, with CER delta +0.0531 pp (95% CI −0.0139 to +0.1302; crosses zero). On SIGMORPHON the paired exact delta is −0.4012 pp (95% CI −0.8024 to −0.1003), favoring native, while CER delta +0.1130 pp (95% CI −0.0250 to +0.2732) crosses zero. The SIGMORPHON README/file-schema mismatch means this is a public paired-file diagnostic, not a leaderboard reproduction. g2pk uses the project's segment renderer, so it is not a fully independent IPA stack.

## Execution update — target abstention diagnostics (2026-10-24)

PR [#306](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/306) was merged as `d12b41b1440de27f54a7ff63340e164d7759b024`; the tested code head was `2f12ec34daa7a595d7bd411ab3d268294fbb71fb`.

- **DONE_VERIFIED:** shared renderer per-word and per-segment abstention reasons; native target failure diagnostics; aggregate reason list; fail-closed whole-output contract.
- **DONE_VERIFIED:** all eight PR-triggered workflows passed on the tested code head: Python tests, browser tests/build and system regression/data integrity, generated corpus artifacts, optional g2pK integration, external UGTPHON diagnostic, paired native-vs-g2pK diagnostic, morphology adapter smoke, and multi-engine IPA diagnostic. Evidence run IDs: 40126739786, 40126739821, 40126739758, 40126739753, 40126739791, 40126739773, 40126739772, 40126739752. NIKL live metadata is a separate known skipped step and is not represented as passed by this statement.
- **TODO:** commit and reconcile the exact frozen 24-form fixture. The exact form list was not found in the reviewed tracked fixtures; no inputs have been guessed or reconstructed. Acceptance: fixture provenance + stable input membership + deterministic per-form status/reason report.
- **BLOCKED_SPECIALIST_ADJUDICATION:** 7 unresolved native strict phonology cases need source-grounded Korean rule-environment adjudication and independent pronunciation review where sources do not decide them.
- **PARTIAL_TARGET_COVERAGE / BLOCKED_SPECIALIST_REVIEW:** the historical 17 target-layer cases must be re-run against the verified original 24-form fixture and the local ClippyFirst renderer. UPI 0.8.0 is now diagnostic-only for practical output; its absence is not itself an output blocker. Missing IPA correspondence, mapping conflict, unknown IPA and independent Ukrainian-review gaps remain distinct blockers; do not collapse them into one “phonology error”.
- **Scope:** this PR improves observability only. It does not repair phonological coverage, certify Ukrainian orthography, or justify guessed mappings. The multi-engine IPA benchmark is diagnostic and is not a Korean→Ukrainian target-accuracy score.
- **Release status:** research preview / partial prototype; not release-ready until the target layer is independently evaluated and unresolved source/target evidence gates are closed.


### Core-owned Python IPA target renderer — PR #310 (2026-10-24)

- Branch: `fix/clippyfirst-core-ipa-target-2026-10-24`; current PR: [#310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/310).
- Implementation routes native and G2P-derived Python output through `src/korean_ukrainian/ipa_target_renderer.py`, consuming IPA only and using local canonical correspondences plus explicit overrides. UPI candidate ranking is diagnostic-only, not output authority.
- Regression scope includes 643 canonical lexical rows, 45 declared alternates, length-marker traces, unknown IPA fail-closed behavior, mapping provenance, and explicit provisional status.
- **Status remains PARTIAL until latest-head CI passes.** The original 24-form list remains unverified and is not included as gold. A passing internal corpus reproduction test is not independent target accuracy.
