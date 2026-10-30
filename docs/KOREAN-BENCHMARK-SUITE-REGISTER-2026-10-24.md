## Integration checkpoint — occurrence ledger merged, extended metrics still under review (2026-10-31)

PR [#399](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/399) was squash-merged to main as `cb1ceafd0d9a01c60cf68dd279e0858e732eb780`. The benchmark producer now emits a schema-v1 `per_engine_occurrences` ledger for every engine, preserving repeated token occurrences by occurrence ID and recording scored, abstained, error, and missing outcomes. The exact PR-head multi-engine benchmark, comparator contract tests, general tests, system verification, and artifact workflows passed. The merged workflow validated 2,703 UGTPHON plus 999 SIGMORPHON eligible occurrences across six engines (22,212 ledger rows).

**Scope limit:** the neural inference and joined pairing jobs were skipped on the #399 head by the research-only opt-in condition. The merge repairs the missing baseline producer and verifies the ledger contract; it does not verify a fresh CharsiuG2P/ByT5 joined comparison.

PR #371 remains open and divergent (117 commits ahead / 26 behind at review). Before its PER/PFER and latency figures are treated as accepted:
- define and test a standard p95 percentile convention (the current floor-index implementation reports 3 ms for [1, 2, 3, 100], hiding the 100 ms tail);
- score alternative IPA gold variants independently per metric or document a defensible joint-selection rule (the current implementation selects by CER and reuses that variant for PER/PFER);
- replace branch-name-specific neural job conditions with an explicit, default-off workflow opt-in;
- retain the merged schema-v1 occurrence ledger and rerun the exact-head benchmark plus full neural pairing.

PR #398's public methodology figures depend on #371's PER/PFER calculations. Its exact-head CI passed before #399 merged, but the PR branch is now one commit behind/diverged and requires selective reconciliation plus metric refresh. No PER/PFER update should be presented as a corrected result until the above scoring fixes have been rerun on both pinned datasets.

# Korean engine benchmark suite register — 2026-10-24

## Purpose and rules

This register separates pronunciation quality, output coverage, software parity, and the Ukrainian adaptation layer. A suite is not considered complete merely because a script or fixture exists. Report the dataset/version, licensing/provenance, denominator, abstentions, runtime errors, exact match, CER, confidence intervals where sampling supports them, and known limitations. Do not turn diagnostic corpora into normative acceptance gates.

### Latest engine-error finding (2026-10-24)

PR #298 is merged at 468ac8a690812e455eef1437ecf4b91ea67bdc75 and fixes R002 dropping coda ㅇ (/ŋ/) during liaison. PR #299 is merged at f1267f700b2a7ff726765fc17b6d2fa093561dfb and fixes broad-IPA /j/ retention after ㅈ/ㅉ/ㅊ + ㅕ under NIKL Standard Pronunciation Rule 5, exception 1. PR #297 is merged at 2f7b58f0b7d976b9d660f21a739145ce19c533ab; it added source-backed exact-form R010 (§24) licenses for 닮다 and 넘게, with native Python and browser-engine regressions.

Latest complete six-engine run: [40092929978](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978), artifact [12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692). On revised broad-IPA normalization, native UGTPHON exact match is 1,412/2,655 (53.1827%), CER 9.1883%; paired g2pk is 1,416/2,655 exact (53.3333%), CER 9.2414%. The remaining four g2pk-only exact occurrences are repeated instances of 없는, where the NIKL-attested long vowel is absent from the corpus reference. The two morphology-rule gaps 닮다 and 넘게 were fixed with exact-form R010 licenses, not a blanket heuristic.

On SIGMORPHON, native is 357/997 exact (35.8074%) versus g2pk 353/997 on the same scored subset (35.4062%); g2pk's paired exact delta is −0.4012 pp (95% CI −0.8024 to −0.1003). The two datasets do not support a universal g2pk advantage. All 48 UGTPHON abstention occurrences and both SIGMORPHON abstentions are present in the complete schema-v4 pairwise artifact.

## Teacher corpus split and leakage audit — 2026-10-26

Automated exact-head audit passed in [run 40290981510](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290981510); metadata-only report [12635583549](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290981510/artifacts/12635583549). The pinned files verified and row counts were UGTPHON 1,976/246/275, SIGMORPHON 8,000/1,000/1,000, and Charsiu repository Korean data 62,126 train (61,900 unique forms; 226 duplicate-form rows), 50 dev, 500 test.

Critical overlap warnings: 508 unique UGTPHON test token forms intersect Charsiu repository train; 237 UGTPHON test forms intersect SIGMORPHON train; 729 SIGMORPHON test forms intersect Charsiu repository train. These counts do not prove the exact Hugging Face checkpoint saw each item, but its training manifest is unavailable, so neither public test set can be claimed as guaranteed independent evaluation for this teacher. Keep both test splits sealed for tuning. The 24-form NIKL set is also sealed and has no IPA gold pending independent annotation.

**Training decision:** train/dev partitions are source-available candidates, not permission to fine-tune. The selected Charsiu checkpoint still has no verified explicit weight license/model card, and its original training overlap is unknown. No teacher inference, fine-tuning, or production rule changes were performed. Use disagreements only as a review queue; require primary-source phonology evidence, positive/negative controls, and a separate eligible dev improvement before implementing a Strict rule.

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


### Final-head CI triage for native IPA target renderer — 2026-10-24

- Run [40131875165](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40131875165) on `94631cc169d74146d12cb0c70b004288523775ab` failed: browser tests found stale assertions for the newly detailed vowel-length trace and a deep-equality snapshot that rejected added provenance/status fields; Python tests found a `ROOT`/ `root` NameError in the new cross-runtime parity test.
- Browser assertions were updated to the explicit feature/status schema; the invariant test now verifies the legacy output fields plus the detailed status contract; Python subprocess cwd now uses the defined lowercase `root` path. Browser suite passed on intermediate run [40132583499](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132583499), but Python remained red there because the root-variable correction had not yet reached that run.
- Final known code correction: `317f0f106d230b10bbc42219ca1f9c3e5a369aa2`. Exact-head workflows were triggered; do not count any intermediate success as final verification.
- The diagnostic-only Python/G2P report continues to show two known JS-port differences against recorded normative surface expectations: `넓죽하다` and `읽고`. The report explicitly says IPA comparison was not performed and gold was not independently adjudicated. These are linguistic regression-review items, not failures to be hidden by changing the benchmark labels.
- The official NIKL metadata-only inventory remains blocked by HTTP 403, and the original 24-form source manifest remains unverified. Neither is a successful benchmark or a gold set.


### Verification closeout after IPA target regression fixes — 2026-10-24

- System verification [40132735568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132735568) passed Python regression/data integrity and browser regression/build on `e462d15d9d31d4889ad562095ecb93f39247e8fe`. The official NIKL metadata job was skipped and is not a pass.
- Focused tests [40132671600](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132671600) passed on code head `317f0f106d230b10bbc42219ca1f9c3e5a369aa2`; the later `e462d15` change was documentation-only.
- Generated master table/corpus [40132738836](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132738836), paired native-vs-g2pK [40132738928](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132738928), external UGTPHON [40132738858](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132738858), and browser G2P [40132738885](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132738885) passed on `e462d15`.
- Optional g2pK integration, morphology adapter smoke, and multi-engine diagnostic were still in progress at the last poll. Their outcomes must be refreshed.
- Known differential warnings remain: `넓죽하다` and `읽고` differ between browser native surface and Python/g2pK recorded expectations. This is reported as a source/engine discrepancy with IPA gold not independently adjudicated; do not silently rewrite expected outputs to remove it.
- The reconstructed 24-form fixture remains unverified; no target accuracy score can be inferred from these checks.


### Final exact-head workflow outcomes — 2026-10-24

All relevant workflow families passed on implementation head `a80cacf0f2c36c40a172ea24aad5a67bb9ba5756`: system verification [40132976136](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976136), focused tests [40132976087](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976087), generated artifacts [40132976175](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976175), optional g2pK [40132976258](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976258), browser G2P [40132976122](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976122), paired native/g2pK [40132976161](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976161), UGTPHON [40132976197](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976197), multi-engine benchmark [40132976215](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976215), and morphology adapter smoke [40132976263](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976263). The last four are diagnostic/adapter validation, not independent Korean IPA or Ukrainian target gold. NIKL live inventory was skipped; original 24-form source remains unverified. PR #307/#310 stay open pending owner-level convergence; their shared Python renderer/pipeline blobs match, but #307 additionally carries the quarantined candidate fixture and provenance audit.

### Target correctness gate added — 2026-10-25

The strict IPA→Ukrainian renderer and direct browser target adapter abstain by default whenever any mapping is `provisional`; the research pipeline/UI explicitly opt in to show a candidate with provisional status and trace. Tests verify strict abstention, candidate traceability, explicit research opt-in, and Python/browser parity. Do not score candidate-only outputs as successful exact matches in a production accuracy benchmark.


### Final exact-head verification — 2026-10-25

Verified on code head `4f65943b514992b89ce31df5db2d4e971dc0b6a9`. System verification, focused tests/wheel install, browser G2P, optional g2pK, generated master table/research corpus, paired native-vs-g2pK, UGTPHON, morphology adapter smoke, and multi-engine IPA comparison all passed (runs 40135565733, 40135565670, 40135565682, 40135565680, 40135565706, 40135565751, 40135565684, 40135565675, 40135565671). NIKL live inventory was skipped, not passed.

Strict IPA→Ukrainian adapters abstain on `provisional` mappings by default and return a separate candidate with trace. Research UI/pipeline explicitly opts in to display candidate output with provisional status. Candidate-only matches must not count as verified accuracy. The original 24-form source, independent Korean IPA gold, and independent Ukrainian target gold remain blockers; release status remains `PARTIAL / NOT RELEASE-READY`.


### Benchmark outcome and interpretation — exact code head `4f65943` (verified 2026-10-25)

The multi-engine workflow passed and produced these **Korean IPA** diagnostic results; they are not Ukrainian-target accuracy scores:

| Dataset | ClippyFirst native | g2pK 0.9.4 | Interpretation |
|---|---|---|---|
| UGTPHON Korean test, 275 rows / 2,703 token occurrences | 2,655 scored; 98.22% coverage; 1,412 exact; exact rate 53.18% (bootstrap 95% CI 48.49–58.20%); CER 9.19%; 48 abstentions; 0 runtime errors | 2,703 scored; 100% coverage; 1,435 exact; exact rate 53.09%; CER 9.23%; 0 runtime errors | Near parity on paired examples; native is more conservative. |
| SIGMORPHON 2021 Korean lexical test, 1,000 rows / 999 token occurrences | 997 scored; 99.80% coverage; 357 exact; exact rate 35.81%; CER 14.70%; 2 abstentions; 0 runtime errors | 999 scored; 100% coverage; 353 exact; exact rate 35.34%; CER 14.82%; 0 runtime errors | Small paired advantage to native on this pinned lexical split. |

These exact-match rates are **not 90–95%**. The reference sets use IPA conventions that are not identical to the project's broad IPA (including phonetic diacritics and segment/annotation differences); normalization removes only selected convention differences. The corpora also have scope/annotation limitations. The 9.19% and 14.70% character error rates show substantially closer sequences than exact-match rates alone suggest, but neither metric proves normative correctness. Some differences may be real phonological errors; do not attribute all to notation. The next benchmark improvement must come from categorized mismatch review against independently adjudicated IPA, not from relaxing normalization until the score rises.

Most native abstentions on UGTPHON are deliberate unresolved morphophonological contexts: 25 R002 liaison/neutralization cases, 20 R003 ㅎ deletion cases, 2 R007 palatalization cases, and 1 each for R004 aspiration and IPA adjudication. These are coverage limitations, not runtime exceptions. This benchmark does not measure IPA→Ukrainian mapping accuracy.


### Verification update — 2026-10-25

Provisional IPA→Ukrainian candidates are now visibly labelled in the browser research workbench, including the primary result label and copy action; the Python renderer and public pipeline remain strict by default and expose provisional spellings only as separate candidates. The system verification and browser integration passed at code head `5ccb880d0c0611efa1f7ef8ffd00a0d303778410`: browser suite 1,220/1,220 passed; Python regression/data-integrity passed; dedicated test workflow passed. See runs 40177877602, 40177877624, 40177877599. NIKL live inventory was skipped. The g2pK differential diagnostic reports 18/20 surface matches and two unresolved disagreements (`넓죽하다`, `읽고`); this is not an IPA accuracy score. Original 24-form provenance and independent IPA/target adjudication remain blocked. Do not interpret these software passes as linguistic gold validation.


### PR #307/#310 convergence status correction — 2026-10-25

The earlier note that the Python renderer/pipeline blobs matched was true only for an earlier snapshot. PR #310 now has the strict provisional target gate and Python pipeline abstention behavior; those blobs diverge from PR #307. PR #307 remains valuable for the quarantined unverified 24-form fixture/provenance audit. Both PRs remain open and mergeable; no blind merge or closure. Reconcile current diffs before any integration.


### Exact-head verification — 2026-10-25

Implementation head `b41da53614f660d7f4b71fc9613730661715262b` passed system verification (40178373051), browser G2P with 1,220/1,220 tests (40178373030), dedicated web/Python 3.11–3.13/wheel tests (40178373064), generated artifacts (40178373059), optional g2pK (40178373090), paired native/g2pK diagnostic (40178373033), UGTPHON diagnostic (40178373035), multi-engine benchmark (40178373027), and morphology adapter smoke (40178373061). NIKL live inventory was skipped. Python G2P surface differential is 18/20 with unresolved disagreements `넓죽하다` and `읽고`; no independently adjudicated IPA gold was used. Original holdout provenance and independent target review remain blocked.


### Exact-head correctness hardening — 2026-10-25

**Code under verification:** `b55df50cbc806497055c81cd29d309dc849ff9b2` on `fix/clippyfirst-core-ipa-target-2026-10-24`.

This pass closes a user-facing correctness gap: a `provisional` IPA→Ukrainian correspondence is no longer exposed as accepted `ukrainian` output. The Python renderer returns `ukrainian_orthography: null` plus a separate `candidate_orthography`; the browser native engine and practical g2pK adapter now withhold the complete accepted result if a provisional target occurs, retain a full `candidate_ukrainian`, label the candidate in the UI, and copy the candidate rather than an empty result. This applies to multiword input as well as single tokens. Korean phonology status remains separate from target-layer status; a target-layer uncertainty does not falsely relabel resolved IPA as unresolved Korean phonology.

Regression updates explicitly distinguish accepted orthography from candidate text and verify the IPA adapter reproduces candidate mappings in research opt-in mode. Verification on code head `b55df50cbc806497055c81cd29d309dc849ff9b2`:
- System verification: pass — [40183597497](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183597497); Python regression/data integrity and browser regression/build passed.
- Browser G2P: pass — [40183601946](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601946).
- Dedicated tests: pass — [40183601969](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601969): 1,220/1,220 web tests; Python 3.11, 3.12, 3.13 and wheel installation passed.
- Master table/research artifacts [40183601984](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601984), optional g2pK [40183601959](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601959), paired native/g2pK diagnostic [40183601967](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601967), UGTPHON diagnostic [40183601986](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601986), multi-engine diagnostic benchmark [40183601966](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601966), and morphology adapters [40183601968](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601968): all passed.
- Official live NIKL inventory remains **skipped**, not passed. This is an external-access/source-verification blocker.
- No independent Korean IPA gold or independent Ukrainian target gold was used. These software tests establish deterministic implementation behavior and parity, not linguistic accuracy.
- The original ordered source manifest for the 24-form holdout is still unverified; the reconstructed fixture remains quarantined and must not be described as restored from the original source.

Readiness: **software-verified research prototype; not release-ready** until source provenance and independent linguistic/target adjudication gates are closed.


### Final source-head acceptance update — 2026-10-25

The phrase-level fail-closed regression was added and verified on source/test commit `4686fd7119fe85043c4e6b32199188bd23487a1c`. The dedicated suite passed **1,221/1,221 browser tests**, Python 3.11/3.12/3.13, and clean wheel installation ([tests 40183919607](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919607)). System verification passed ([40183915965](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183915965)); browser G2P ([40183919654](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919654)), optional g2pK ([40183919624](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919624)), generated master table/research artifacts ([40183919655](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919655)), paired native/g2pK ([40183919614](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919614)), external UGTPHON ([40183919696](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919696)), multi-engine IPA diagnostic benchmark ([40183919643](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919643)), and morphology adapter smoke ([40183919637](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919637)) also passed. Official live NIKL inventory was skipped, so source-level acceptance remains open.

A subsequent documentation-only commit records this status; it does not change the implementation tested above. The repository remains a software-verified **partial research prototype**, not release-ready. Original 24-form manifest provenance, independent Korean IPA adjudication, independent Ukrainian target gold, and authorized live NIKL access remain acceptance blockers.


## Final pinned benchmark results — 2026-10-25

Exact-head run: [40189298339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40189298339), success. Source snapshots are pinned in workflow configuration; UGTPHON Korean split is 275 rows (Apache-2.0), and SIGMORPHON 2021 Korean lexical test split is 1,000 unique word/IPA pairs (CC BY-SA 3.0). These evaluate Korean pronunciation/IPA engines, not Ukrainian target adaptation.

| Dataset | Engine | Eligible occurrences | Coverage | Exact match | CER | Abstentions | Engine errors |
|---|---|---:|---:|---:|---:|---:|---:|
| UGTPHON Korean test | ClippyFirst native | 2,703 | 98.22% | 53.18% | 9.19% | 48 | 0 |
| UGTPHON Korean test | g2pk 0.9.4 | 2,703 | 100% | 53.09% | 9.23% | 0 | 0 |
| SIGMORPHON 2021 Korean test | ClippyFirst native | 999 | 99.80% | 35.81% | 14.70% | 2 | 0 |
| SIGMORPHON 2021 Korean test | g2pk 0.9.4 | 999 | 100% | 35.34% | 14.82% | 0 | 0 |

Interpretation: native ClippyFirst slightly exceeds g2pk on exact match in these pinned splits while abstaining on unresolved cases. The exact-match rate and CER still show substantial pronunciation errors; zero engine errors means no runtime exceptions, not zero linguistic errors. These metrics must not be reused as Ukrainian transcription accuracy.


### Current renderer branch: 24-form candidate audit and exact-head verification — 2026-10-25

The candidate fixture, provenance audit, regression guard and report runner from PR #307 are now present on `fix/clippyfirst-core-ipa-target-2026-10-24` (code/evidence head `aca93752c5d059300baf33bd576a5a0fea8fa4fa`). The fixture is intentionally still `reconstructed_unverified`; its IPA and Ukrainian gold statuses remain `not_available`.

The g2pK integration report was generated successfully on Python 3.11 and 3.12: **18/24 accepted native outputs + 1 candidate** and **23/24 accepted g2pK outputs + 1 candidate**. Five native forms abstained; these are coverage counts, not an accuracy result. No target accuracy is computable without independently adjudicated Ukrainian labels.

Exact-head evidence:
- [Tests and browser build — 40191515088](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515088): success; **1,231 browser tests passed**.
- [System verification — 40191515073](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515073): success; official NIKL live inventory skipped.
- [g2pK + 24-form diagnostic report — 40191515065](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515065): success, Python 3.11/3.12; **20 targeted tests passed per runtime**, report artifacts uploaded.
- [Browser G2P — 40191515045](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515045), [UGTPHON — 40191515110](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515110), [native/g2pK — 40191515125](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515125), [multi-engine benchmark — 40191515023](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515023), [morphology smoke — 40191515056](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515056), and [master/research artifacts — 40191515019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515019): all success.

The external Korean IPA benchmark remains diagnostic rather than a Ukrainian target evaluation. Independent IPA and target gold, verified holdout provenance, and live NIKL evidence remain blockers; disposition: **not release-ready**.

### Additional licensed G2P candidate — Montreal Forced Aligner Korean (Jamo) v3.0.0

The official MFA model documentation lists a Korean (Jamo) Phonetisaurus G2P model, model version v3.0.0, compatible with MFA v3.0.0, with the MFA phone set and a **CC BY 4.0** license; it reports 49,655 training words and a 5,518-word evaluation set. Sources: [official model card](https://mfa-models.readthedocs.io/en/latest/g2p/Korean/Korean%20(Jamo)%20MFA%20G2P%20model%20v3_0_0.html) and [official Korean model index](https://mfa-models.readthedocs.io/en/latest/g2p/Korean/index.html).

**Status: CANDIDATE / NOT YET SCORED.** This is a promising alternative to the unresolved Charsiu checkpoint rights, but it is not yet a verified IPA teacher. The declared MFA phone set is not automatically IPA, so it needs a pinned, explicit phone-set-to-IPA adapter that preserves distinctions and documents unmapped phones. Also, the published model page reports WER 100.00% and PER 100.00% on 5,518 words; this result is suspicious and must be independently explained or reproduced before treating the model as useful. No MFA model was downloaded or run in this continuation, and no performance claim is made. Next acceptance gate: pin the release artifact and checksum, inspect the complete phone inventory and upstream dictionary/data terms, explain the reported metrics, validate a reversible/explicit phone mapping, then benchmark only on eligible train/dev material while leaving all project test/holdout sets sealed.



## Train/dev corpus preparation and scratch teacher continuation — 2026-10-26

- **Pinned source preparation:** SIGMORPHON 2021 medium Korean produces 8,000 train / 1,000 dev rows with zero source-form overlap across its three pinned splits; test rows are never exported.
- **UGTPHON token-level subset:** 13,271 train and 1,897 dev eligible token occurrences; 8,753 / 1,629 unique forms. Eligibility is conservative: canonical exact-surface tokens only, no multiword expansions, missing phonemes, comma variants, or placeholders. Test examples are never exported. Token forms recur across sentence splits (538 train/dev, 510 train/test, 228 dev/test), so these are not novel-word-only partitions.
- **Cross-corpus audit:** CI [40296047955](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296047955) passed source verification, both builders, overlap audit, mismatch categorization, and artifact upload. Artifact includes separate train/dev JSONL, manifests, and metadata-only compatibility report.
- **Source-form intersections:** SIGMORPHON train vs UGTPHON train 1,084; train vs dev 257; dev vs train 140; dev vs dev 33. After removing only SIGMORPHON whitespace token separators, 718/1,084 train/train shared forms have matching target strings; among the 366 remaining mismatches, 151 differ only under a length-mark-removal diagnostic and 215 differ in other symbols/features. No target normalization was applied to the data.
- **Representation status:** SIGMORPHON tokenized IPA and UGTPHON token-level IPA remain distinct target types. These comparisons do not establish ClippyFirst broad-IPA equivalence. Do not merge corpora or compare their outputs directly until an explicit, reviewed adapter is implemented.
- **Scratch teacher:** added a CPU-only, from-scratch GRU/attention research model using SIGMORPHON train and dev-only model selection. It does not load pretrained weights, use test data, or enter runtime. The first scratch-training run passed in CI [40296516593](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296516593), artifact [12638806286](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296516593/artifacts/12638806286): best epoch 11; dev exact match 60.2%, token error rate 12.72%, compact-character error rate 12.18%. An initial independent check found 107/398 non-exact dev examples differing only by length marks (80 underpredicted, 27 overpredicted). Training is DONE_VERIFIED as a research experiment; automated dev error analysis remains pending exact-head CI.
- **Status:** corpus builders and cross-corpus audit are DONE_VERIFIED on successful workflow evidence; scratch teacher training is PARTIAL pending its own CI run and dev metrics. No production rule change or accuracy gain is claimed.


### Scratch-teacher error analysis — 2026-10-26

CI [40296965071](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296965071) passed training and automated dev error analysis; artifact [12638313059](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296965071/artifacts/12638313059). Dev results: exact token sequence 60.2%; token error rate 12.72%; compact-character error rate 12.18%. Error categories: 602 exact, 107 length-mark-only, 291 other; among length-only errors, 80 underpredicted and 27 overpredicted length marks.

The analyzer's source-shape table shows lower exact match for three-/four-Hangul-character words with final codas than for corresponding no-coda groups, but the groups are not balanced and larger-word buckets are small. Treat this as a diagnostic lead only. No test examples were read, no IPA symbols were normalized for scoring, and no production rule was added. Corpus preparation, cross-source audit, scratch training, and automated dev error analysis are now DONE_VERIFIED; common IPA representation mapping and independent rule adjudication remain TODO.


## 2026-10-26 — source convention review and adjudication queue

- Primary source review: [KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md](KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md). SIGMORPHON 2021 target format and preprocessing are not equivalent by default to UGTPHON's IPA-Dict-derived Korean token annotations.
- Executable queue: `scripts/build_korean_ipa_adjudication_queue.py`, tested by `tests/test_build_korean_ipa_adjudication_queue.py` and run in the existing teacher-corpus workflow. It queues only train/train conflicts and preserves raw candidates, provenance, and Unicode code-point inventories. It does not claim phoneme segmentation.
- Acceptance status: queue implementation is separate from annotation adjudication. The 366 target conflicts are still unadjudicated; no broad-IPA adapter, neural-versus-Strict comparison, or production-rule promotion is claimed until a reviewed source-specific mapping is available.
## 2026-10-26: controlled teacher profile comparison and verified rule parity additions

The first completed train/dev Charsiu artifact is available at [run 40334001997](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40334001997). Its initial broad/narrow comparison is not a valid controlled profile delta because the broad baseline included lexical IPA overrides while the narrow path bypassed them and did not preserve the production unresolved-pronunciation gate. The apparent narrow-profile improvement in that artifact is superseded and must not be used as evidence of a rule gain.

The runner now produces a separate controlled profile-sensitivity report: broad and narrow are rendered from the same post-rule syllable analysis, lexical IPA overrides are excluded from both, and unresolved pronunciation contexts abstain in both. The full production baseline remains separate. Raw per-occurrence output is preserved; no rule is promoted automatically. Corrected run [40338691112](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40338691112) was queued at this update and has no final result yet.

The source-backed rule parity batch also added/mirrored:
- R011 / NIKL §25: exact 넓다, 넓고, 넓지, 훑다, 훑고, 훑지.
- R012 / NIKL §26: exact 갈등, 발동, 절도, 말살, 일시, 갈증, 물질, 발전, 몰상식, 불세출; sense-dependent 불소 is excluded.
- R013 / NIKL §27: attached -ㄹ게 fortition, with a same-word boundary guard.
- R014 / NIKL §28: full exact-compound table mirrored into browser runtime, plus official Q&A forms 물가[물까], 봄비[봄삐].
- R015 / NIKL §30: exact saisiot forms mirrored from the Python inventory, with unadjudicated compounds still withheld.

All results remain diagnostic because the corpus IPA convention has not been independently mapped to ClippyFirst broad IPA. This benchmark register records workflow state, not a claim of model-to-rule accuracy improvement.
## 2026-10-26 rule inventory parity addendum

A direct Python/browser comparison found additional exact-form gaps beyond R011/R012/R014/R015:
- R002 formal-liaison table now includes the Python exact forms 앉아라 and 없어도.
- R009 / §29 now has the same 29 exact word-internal n-insertion licenses in the browser as in Python. Python phrase-boundary mode also has the same nine R013 phrase licenses as browser JavaScript.
- An automated parity test compares source-backed Python/JS map values and phrase-license sets.

Audited map counts match for R002 formal (33), R002 substantive (5), R003 (18), R004 (1), R007 (2), R009 word (29), R010 (2), R011 (6), R012 (10), R014 (20), R015 (15), R016 (3), R013 phrases (9), and R009 phrases (6).

The corrected Charsiu workflow [40340319150](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40340319150) and full tests [40340319366](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40340319366) were queued. The earlier uncontrolled narrow-score delta remains superseded. No model-to-rule accuracy gain is claimed.

## Evaluation-integrity correction: UGTPHON test case used to prioritize R014 (2026-10-26)

The historical UGTPHON test artifact [40328909490](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40328909490), artifact [12654815334](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40328909490/artifacts/12654815334), contains token `물가로` at row `dc_inside_2261`, occurrence `2001`. The model/native mismatch on this test token was explicitly used to prioritize review of compound fortition; official NIKL Q&A 316282 was then checked and confirms `물가[물까]` and `봄비[봄삐]`.

The resulting R014 rule is source-backed, but the specific `물가로` test case is **not an untouched holdout**. Keep the historical report intact, but do not use that occurrence as independent final-evaluation evidence. The aggregate UGTPHON test metrics are still useful as historical diagnostics; they must not be described as fully independent after this test-informed rule selection. A replacement holdout or a separately reported exclusion is required before making a final accuracy claim.

## Productive morphology-consensus licensing (implementation pending exact-head CI)

The research-only morphology license adapter now supports:
- R002/R003/R007 formal morpheme boundaries when two analyzer results agree on exact source-aligned spans;
- R010/R011/R016 verb/adjective stem + ending contexts when both analyses agree on the boundary and tag families;
- extension of already registered R012/R014/R015 lexical roots across an attached particle/ending when the root and grammatical boundary are both verified.

The rules remain exact-form licensed after expansion, carry low-confidence morphology provenance, and force IPA to diagnostic-only. No default strict/browser output changes. New tests include `읽고`, `넓고`, `많다`, `물가로`, `봄비가`, `냇가에`, `갈등이`, and negative controls `닭고기` and `물가공`. These tests are authored but are **not yet marked verified**; exact-head Actions evidence is pending.

## Final status of this continuation batch

- Latest executable code/test head: `e14b4b026738755dbee1c819da8635aec4f6c0f7`.
- Latest visible test matrix [40343059002](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40343059002), system verification [40343058844](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40343058844), and corrected Charsiu train/dev [40343058866](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40343058866) remain queued on the preceding code/test head; no exact-head pass is claimed.
- The new morphology-consensus tests and fail-closed source-alignment test are authored but not verified. Do not interpret their existence as a pass.
- The UGTPHON test token `물가로` is test-informed and must be excluded from any independent final accuracy claim or replaced by a fresh holdout.

## Superseding executable-head status — 2026-10-26

The latest executable code/test head is `36b8e909d65ebf0e69af22f6183155853f34ae14`. The additional guard requires agreement on particle-versus-ending family before extending R012/R014/R015 lexical roots, with a negative regression case. Exact-head test matrix [40344662542](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40344662542), system verification [40344662684](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40344662684), real morphology smoke [40344662799](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40344662799), and Charsiu train/dev [40344662592](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40344662592) are queued. They are not passes.

## Latest code/test delta — provenance trace

Latest executable code/test head: `d09a739b2269298ffc2ef8941d0cf564a91f642d`. The morphology audit now records each lexical-root extension's registered root, internal source-backed pair, and full-form license as separate fields. The added provenance regression is pending exact-head CI; no pass is claimed.



## Mainline consolidation checkpoint — 2026-10-27

The current mainline first received the exact-form R002/R016 source-backed rules through PR #341 (`1def51dd9f88364891ff0051e9aadb5900f2e42c`). The consolidation snapshot carries the research branch's benchmark tools and pinned comparison portfolio forward. This is an implementation/reproducibility consolidation, not a benchmark score claim: noisy/public reference corpora remain diagnostic, broad/narrow dev profile selection is contaminated for independent evaluation, and no independent Ukrainian target gold is available. Exact-head workflows on the consolidation PR determine software verification status.


## Final mainline consolidation — 2026-10-27

The best verified implementation/research tree is now on `main` via PR #348 merge commit `72d2a785160382ffbfdce4f5654afb9671d957f9`, after source-backed R002/R016 integration in `1def51dd9f88364891ff0051e9aadb5900f2e42c`. Multi-engine UGTPHON and SIGMORPHON diagnostics both passed on the consolidated code head (run 40585528130); current benchmark values are UGTPHON native 53.0022% exact / 9.1697% CER (2,698 scored, five abstentions) and SIGMORPHON native 35.8074% exact / 14.7037% CER (997 scored, two abstentions). g2pK 0.9.4 remains near-native on these diagnostics. These are not normative IPA gold scores and do not score Ukrainian adaptation. The standalone cross-version test/wheel matrix and some post-merge main workflows were still queued at the last poll; do not record them as passed until completed. Charsiu and ByT5 inference remain skipped research opt-ins; NIKL live inventory is skipped/blocked, not passed.


## Corrected per-metric scoring + occurrence-ledger run (2026-10-30; PR #401)

**DONE_VERIFIED — executable baseline benchmark.** Exact benchmark job [41138727409](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41138727409) passed for both pinned corpora and uploaded artifact `13018218724` (`multi-engine-korean-ipa-diagnostic`). The workflow validates schema-v1 ordered occurrence ledgers for all 10 engines: 2,703 UGTPHON occurrences and 999 SIGMORPHON occurrences.

Correctness deltas in this port:
- Nearest-rank p95 preserves the upper tail (regression fixture `[1, 2, 3, 100]` yields 100 at p95).
- Exact/CER, segment PER, and feature-weighted proxy each choose their own best IPA gold alternative; their reference denominators are metric-specific.
- CharsiuG2P scoring follows the same metric-specific gold selection.
- Ledger records retain occurrence identity, engine result/status, IPA and scoring fields for reproducible paired comparisons.

Corrected diagnostic snapshot (exact rate / CER / PER / feature proxy):
| Engine | UGTPHON (2,703) | SIGMORPHON (999) |
|---|---:|---:|
| ClippyFirst native | 53.0022% / 9.1697% / 9.6139% / 4.8765% | 35.7716% / 14.6978% / 16.2343% / 7.5491% |
| g2pk 0.9.4 | 53.0892% / 9.2285% / 9.6472% / 4.8952% | 35.3353% / 14.8222% / 16.3126% / 7.5990% |
| g2p-ko 1.0.0 | 52.4602% / 9.3885% / 9.8446% / 4.9779% | 35.6356% / 14.6970% / 16.2351% / 7.5524% |
| KoG2Padvanced 2022 | 47.3178% / 10.6772% / 11.3378% / 6.1562% | 32.6326% / 15.8237% / 17.5531% / 9.0979% |
| phonemize 2.0.1 | 42.5453% / 14.3531% / 14.2582% / 7.7056% | 28.9289% / 17.4387% / 18.2664% / 8.4616% |

Rates are proportions ×100; table values rounded to four decimals for exact rate and four decimals for error rates. The workflow log/artifact is authoritative for all 10 engines and unrounded values. Native coverage is 99.8150% (5 abstentions) on UGTPHON and 99.8999% (1 abstention) on SIGMORPHON; other rows above had full coverage.

**Evidence limitations:** These remain diagnostic results, not independent adjudicated Korean IPA gold; UGTPHON includes test-informed material. The SIGMORPHON set is a public paired lexical test file, not a validated Ukrainian target set. Tiny rank differences among native/g2pk/g2p-ko must not be presented as decisive without paired uncertainty analysis. The workflow's CharsiuG2P, ByT5, and paired neural jobs were **SKIPPED** under the default-off manual opt-in. KoG2Padvanced's upstream license is undeclared; Charsiu checkpoint license and training overlap remain unresolved. No weights/source were vendored.

**Next:** inspect artifact `13018218724` and use its paired occurrence ledger for per-item deltas; only then refresh public PER/PFER claims. Independent Korean IPA gold and Ukrainian target gold remain BLOCKED on specialist adjudication/data acquisition.


### Artifact-level integrity verification — 2026-10-31

Downloaded and inspected GitHub artifact `13018218724` (10 files; ZIP archive). Independently parsed both report JSON files:
- UGTPHON: all 10 engine ledgers have exactly 2,703 ordered occurrence IDs; source identity triples (row_id, token, gold) are identical across engines; each engine's recomputed scored/exact counts match the aggregate report.
- SIGMORPHON: all 10 engine ledgers have exactly 999 ordered occurrence IDs; source identity triples align across engines; recomputed scored/exact counts match aggregates.
- The native-vs-g2pk occurrence audit is complete: UGTPHON counts 1,429 both-exact, 1,264 both-not-exact, 4 g2pk-only exact, 1 native-only exact, and 5 native abstentions (2 where g2pk is exact); SIGMORPHON counts 353 both-exact, 641 both-not-exact, 4 native-only exact, and 1 native abstention where g2pk is not exact. These are comparisons to the corpus annotation, explicitly not normative gold.
- Report supplemental status confirms rule accuracy and Ukrainian target metrics are NOT_MEASURED; output determinism is not asserted; comparable peak RSS is not measured. PER is a broad-IPA segment metric; feature-weighted error is a project-defined proxy, not a standardized universal PFER.
- Artifact integrity assertions executed in the analysis runtime: **PASS** (ledger ordering/count, cross-engine source identity alignment, recomputed scored/exact totals for both datasets).

This validates internal report consistency, not corpus validity or linguistic correctness. Public methodology score publication still requires review of the exact artifact-derived tables and caveats; no new accuracy claim is authorized by this consistency check.


## Mainline integration and public metric refresh — 2026-10-31

PR [#401](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/401) merged to `main` as `eb8e1f100e8aca377aef05a2aa896756c909ec5c`. Benchmark run [41138727409](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41138727409) passed on benchmark code commit `e27725c62ee02b00fda6d6e76f178d0479609bf9`; the four subsequent commits to the merged PR head were documentation-only, verified by GitHub compare. The redundant documentation-head benchmark run [41141286672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286672) was still in progress at merge time and is not counted as passed.

Post-merge mainline checks:
- Browser tests/build + Python regression/data integrity: **PASS**, run [41142749793](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41142749793).
- Python 3.11/3.12/3.13, web tests/build, clean wheel install, teacher-corpus audit: **PASS**, run [41142749808](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41142749808).
- Master/research artifact generation: **PASS**, run [41142749796](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41142749796).
- Pages deployment run [41142749819](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41142749819): **PASS**; Python regression/corpus checks, browser tests, static build, Pages deploy, HTTP smoke, and live Playwright practical-mode smoke all passed. NIKL metadata-only inventory was **SKIPPED**.

The public methodology and technical methodology are being updated to the corrected values from artifact `13018218724`. Reported rates use each engine's own scored denominator; coverage and abstentions remain separate. These are diagnostic Korean IPA metrics, not independent adjudicated gold and not Ukrainian-target accuracy. The feature-weighted metric remains a project-defined proxy.


## PR #402 mainline integration and current CI — 2026-10-31

PR [#402](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/402) merged to `main` as `17ed09fd96ea5883172c4a5f908177535ef4ed29`. The public and technical methodology now use the corrected artifact-inspected PR #401 metrics, with per-engine scored denominators, coverage, and abstentions separated.

Post-merge exact-main verification:
- [41143243310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143243310): **PASS**, 1,340/1,340 browser tests, Python regression/data integrity, Vite build.
- [41143243218](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143243218): **PASS**, Python 3.11/3.12/3.13, web tests/build, clean wheel install, teacher-corpus audit.
- [41143243251](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143243251): **PASS**, master table and strict corpus artifact generation.
- [41143243225](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143243225): **PASS**, Pages deployment, HTTP smoke, and live Playwright practical-mode smoke on an adversarial Korean passage.
- NIKL metadata-only inventory: **SKIPPED**.

The current follow-up branch `docs/refresh-methodology-ci-evidence-2026-10-31` updates the public methodology's CI section to this exact mainline evidence and adjusts the methodology contract test. Its latest exact-head run remains pending.
