# Extended Korean G2P benchmark metrics and runtime — 2026-10-29

## Scope

This change extends the existing `scripts/benchmark_multi_engine_ko.py` harness; it does not create a competing benchmark pipeline. It applies to the harness's existing pinned corpus runs and all configured engines: ClippyFirst native, g2pk 0.9.4, KoG2P (pinned commit), hangul_to_ipa (pinned commit), eSpeak NG through phonemizer, and phonemize 2.0.1. A run records each engine's availability/errors separately so missing optional dependencies do not become fabricated scores.

## Newly recorded metrics

- **Execution time:** total wall time and words/second for per-word engines; per-call p50/p95 and mean latency; batch engines record total wall time and throughput with an explicit scope note. Batch startup-inclusive timings are not directly comparable with per-word call timings.
- **PER-style phoneme error rate:** edit distance over broad-IPA segment-like units, divided by reference segment count. Common Korean affricates and attached diacritics are kept together rather than counted as separate Unicode characters.
- **Feature-weighted phonological error rate proxy:** weighted edit distance based on declared place, manner, voicing, vowel height/backness/rounding, aspiration, length, and fortis features. This is a project-defined diagnostic proxy, not a claim to implement one universally standardized PFER definition.
- **Coverage-adjusted exact-match rate:** exact matches divided by all eligible token occurrences. Abstentions and failed predictions therefore count as non-matches in this measure.
- Existing metrics remain: exact-match rate, CER, coverage, abstentions/errors, paired comparisons, row-cluster bootstrap intervals, and mismatch/audit ledgers.

The report counts unsupported feature-inventory segments. A low feature-weighted error score should not be interpreted without checking this count. IPA normalization is still a benchmark-specific broad transcription policy, not a universal equivalence relation.

## Metrics deliberately not claimed

The current external benchmark is an IPA comparison, not an independently adjudicated Korean-to-Ukrainian gold corpus. It therefore cannot validly measure the following yet:

| Metric | Status | Evidence needed to make it measurable |
|---|---|---|
| Per-rule accuracy | BLOCKED_GOLD_REQUIRED | Expert/source-adjudicated labels for each applicable rule environment, including negative controls |
| Ukrainian target CER / exact match | BLOCKED_GOLD_REQUIRED | Independent approved Ukrainian target forms aligned to resolved IPA |
| IPA → Ukrainian pipeline consistency | BLOCKED_GOLD_REQUIRED | Per-case trace proving the target came from the exact IPA result, plus adapter-level gold/contract checks |
| Determinism / repeatability | NOT_RUN | Multiple controlled repetitions per engine and identical-input output comparisons |
| Comparable memory usage | NOT_RUN | Process-level peak memory samples collected under the same runner/runtime policy |
| Independent normative accuracy | BLOCKED_GOLD_REQUIRED | A separate, source-grounded, adjudicated NIKL-style holdout with declared variant policy |

These fields are explicitly reported as not measured rather than imputed. Existing NIKL-backed regression tests are useful evidence for particular rule cases, but their pass count is not a substitute for per-rule accuracy on a representative adjudicated holdout.

## Interpretation requirements

1. Report results per engine and dataset; do not declare a universal winner from a noisy external corpus.
2. Consider PER, feature-weighted error, CER, exact match, coverage-adjusted exact match, coverage, abstentions, and errors together.
3. Use p50/p95 latency only within matching timing scopes and the same runner; run multiple repetitions before making stable speed claims.
4. Keep Ukrainian target quality separate from Korean IPA quality.
5. Do not promote external engine outputs into production rules without independent source adjudication and positive/negative controls.

## Verification

- Unit coverage: `tests/test_benchmark_extended_metrics.py`.
- Full multi-engine runs still require the pinned UGTPHON/SIGMORPHON corpus and optional external engine checkouts/dependencies as specified by the existing benchmark workflows.
- This authoring session could not clone the repository or run its local test suite because the execution container could not resolve `github.com`. The branch must pass GitHub Actions before these changes are considered verified. No fresh benchmark scores are claimed in this document.

## Preliminary measured results (2026-10-29)

These are **observed results from the first successful GitHub Actions run**, not yet the final exact-head verification. Workflow run: [40781561729](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40781561729). That run used an earlier branch commit (`aa5718034bc37dbacb65979c85df1eec77fc8ee5)); the exact-head rerun for `365280e93a3b4a5ada0ff807c880cacf9236b6e7` was still in progress when this note was written. The later affricate feature-map refinement may alter the feature-weighted proxy slightly. Treat all runtime figures as a single-run diagnostic, not a stable performance ranking.

### UGTPHON Korean test split

Eligible token occurrences: 2,703; unique words: 1,907.

| Engine | Coverage | Exact match | CER | PER | Feature-weighted proxy | Coverage-adjusted exact | Total runtime (ms) | Words/s | p50 ms/call | p95 ms/call | Unsupported feature segments |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native | 99.815% | 53.002% | 9.170% | 9.614% | 4.917% | 52.904% | 375.245 | 5,082.014 | 0.1775 | 0.3381 | 1,004 |
| g2pk 0.9.4 | 100% | 53.089% | 9.229% | 9.647% | 4.936% | 53.089% | 18,540.395 | 102.856 | 9.6831 | 10.0770 | 1,008 |
| KoG2P 2019 | 100% | 27.303% | 19.512% | 19.644% | 7.059% | 27.303% | 371.656 | 5,131.086 | 0.1886 | 0.2337 | 1,098 |
| hangul_to_ipa 2026 | 100% | 16.241% | 24.805% | 30.809% | 11.818% | 16.241% | 953.344 | 2,000.328 | 0.4770 | 0.6685 | 1,741 |
| eSpeak NG ko | 100% | 8.139% | 33.610% | 38.316% | 13.279% | 8.139% | 424.954 | 4,487.544 | N/A (batch) | N/A (batch) | 1,555 |
| phonemize 2.0.1 | 100% | 42.545% | 14.353% | 14.258% | 7.742% | 42.545% | 224.135 | 8,508.260 | N/A (batch) | N/A (batch) | 1,098 |

### SIGMORPHON 2021 Korean paired lexical test

Eligible/unique words: 999.

| Engine | Coverage | Exact match | CER | PER | Feature-weighted proxy | Coverage-adjusted exact | Total runtime (ms) | Words/s | p50 ms/call | p95 ms/call | Unsupported feature segments |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native | 99.900% | 35.772% | 14.698% | 16.234% | 7.606% | 35.736% | 160.963 | 6,206.382 | 0.1353 | 0.2345 | 476 |
| g2pk 0.9.4 | 100% | 35.335% | 14.822% | 16.313% | 7.656% | 35.335% | 9,874.482 | 101.170 | 9.7424 | 10.1706 | 477 |
| KoG2P 2019 | 100% | 18.719% | 21.833% | 23.663% | 8.665% | 18.719% | 192.411 | 5,192.019 | 0.1843 | 0.2130 | 523 |
| hangul_to_ipa 2026 | 100% | 8.909% | 29.845% | 36.347% | 12.871% | 8.909% | 486.818 | 2,052.102 | 0.4647 | 0.6437 | 667 |
| eSpeak NG ko | 100% | 4.304% | 40.724% | 48.705% | 17.524% | 4.304% | 249.353 | 4,006.362 | N/A (batch) | N/A (batch) | 689 |
| phonemize 2.0.1 | 100% | 28.929% | 17.439% | 18.266% | 8.516% | 28.929% | 202.371 | 4,936.472 | N/A (batch) | N/A (batch) | 523 |

### Reading the preliminary results

- Native and g2pk are close in exact match on both corpora. Native has slightly lower CER on both in this run; native coverage is just below 100%, so coverage-adjusted exact match is also reported.
- The first-run native total time is much lower than g2pk's (roughly 49× on UGTPHON and 61× on SIGMORPHON), but this is one run only. Timing is diagnostic and needs repeated controlled runs before making a robust speed claim.
- Per-call p50/p95 are intentionally N/A for batch-mode engines; comparing those with per-word call latency would be misleading.
- The feature-weighted score is a project-defined proxy. High unsupported-feature counts mean it must be interpreted cautiously and not as a standalone ranking.
- These are Korean-to-IPA benchmark results, **not** Ukrainian target transcription accuracy. They do not validate normative Ukrainian spellings or IPA-to-Ukrainian pipeline consistency.



## Expanded engine portfolio and Ukrainian-output checks (2026-10-29)

### Existing IPA comparison: verified

The exact-head multi-engine GitHub Actions run [40781704988](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40781704988) completed successfully at commit `365280e93a3b4a5ada0ff807c880cacf9236b6e7`. The job completed the pinned UGTPHON and SIGMORPHON comparisons, adapter tests, training-readiness/holdout audit, and uploaded the diagnostic artifact. This confirms the workflow ran successfully; it does not make the corpus normative gold or establish Ukrainian output accuracy.

### Additional Korean-to-IPA engines and evidence gates

| Candidate | Type and relevance to Korean IPA | Status | Acceptance criterion |
|---|---|---|---|
| ClippyFirst native (“Kozak Kim”) | Native Korean G2P/IPA output | DONE_VERIFIED for existing diagnostic runs | Keep exact match, CER, PER, coverage and confidence intervals together; add independent standard-pronunciation gold before claiming normative superiority |
| g2pk 0.9.4 | Established Korean G2P with morphological context and prescriptive/descriptive options | DONE_VERIFIED | Already included on both pinned test sets; use identical mode/options in future reruns |
| KoG2P (2019 baseline) | Korean G2P with documented custom phone labels; current IPA adapter is explicitly lossy | DONE_VERIFIED | Keep adapter caveat attached; improve only with a source-verified mapping |
| hangul_to_ipa | Direct Korean IPA implementation; documented limitations for some morphology-sensitive rules | DONE_VERIFIED | Already included; interpret scope limitations rather than treating all misses as implementation defects |
| eSpeak NG Korean | TTS-oriented phonemizer baseline | DONE_VERIFIED | Already included; not a narrow-IPA or normative authority |
| phonemize 2.0.1 | General phonemizer package's Korean backend | DONE_VERIFIED | Already included; distinguish batch timing and its upstream evaluation protocol |
| **kokorog2p (PyPI 0.9.15)** | Current package supports Korean via a language-specific frontend, but its public API emits the Kokoro target phoneme vocabulary; Korean dictionary evidence requires separately provisioned Lexphon assets. It also references g2pK among its generic providers, so independence is limited | NOT_YET_COMPARABLE | Do not score its target-model phonemes as IPA. First establish a documented Korean phoneme-to-IPA mapping, provision the required licensed data explicitly, pin the package and data versions, and add adapter fixtures. A tentative 1.0.0 install was rejected by CI because that version does not exist on PyPI; the invalid dependency was removed before rerun |
| KoG2Padvanced (2022) | Separate extension of KoG2P with additional phonological rules, including /h/-deletion contexts | BLOCKED_LICENSE | Public repository [seongmin-mun/KoG2Padvanced](https://github.com/seongmin-mun/KoG2Padvanced) has no verified license file. Obtain author permission or a clear license; then pin the commit, inspect dependencies/dictionary provenance and benchmark both splits |
| Novel morphological engine in Interspeech 2026 | Paper describes syllable–morpheme connectivity and recursive re-evaluation of sequential rules; reports sentence-level results on its own evaluation | BLOCKED_IMPLEMENTATION | [Zenodo paper](https://zenodo.org/records/22167288) currently exposes a PDF, not an identified author-published executable package/repository. Find source/code and license, verify setup, then reproduce on both pinned splits. The reported 85.7% vs 27.2% is not comparable with this benchmark until evaluation protocol and gold are aligned |
| SMART-G2P | Korean code-mixed text normalization/transliteration helper for English/Hanja/numbers/symbols; delegates pronunciation conversion to another engine such as KoG2P or g2pK | SUPPLEMENTARY_NOT_INDEPENDENT | Could be added to a separate mixed-script/normalization benchmark. Do not count it as an independent Korean phonology engine or mix it into Hangul-only IPA rankings |
| HAMA | Repository describes Hangul/morphological tooling and exposes a learned G2P IPA API, but the public README's quick demo is English and does not establish a Korean-trained/evaluated G2P model | NOT_YET_ELIGIBLE | Verify model training language and Korean support on an upstream Korean test example before considering inclusion; do not infer Korean competence from Hangul utilities or repository naming |
| CharSIU G2P | Neural G2P candidate is already represented by dedicated repository scripts/tests, but it is not yet part of the same pinned portfolio report described above | SEPARATE_BENCHMARK_PATH | Inspect its model/language configuration and data provenance, then add it to the same report only if the Korean model can be run reproducibly and its output converted to IPA without undocumented guessing |
| UGTPHON paper's retrieval-augmented compositional G2P | Research method aimed at recovering canonical forms in user-generated text before phonemization; the paper reports strong improvements on its own UGT benchmark | BLOCKED_IMPLEMENTATION | The public UGTPHON repository is a benchmark/data release; no verified downloadable model checkpoint or reproducible Korean inference package for the paper's proposed method has yet been established in this audit. Locate official code/checkpoint, verify license and training overlap, then benchmark on held-out canonicalized UGT data |

The `kokorog2p` candidate was investigated but is not included in the scored IPA portfolio yet. PyPI's current release is 0.9.15, not 1.0.0, and the current documented API returns the Kokoro target phoneme vocabulary rather than a guaranteed IPA string. A CI attempt using the nonexistent 1.0.0 pin failed at dependency installation; that invalid dependency and unverified adapter were removed. It is safer to keep the benchmark green and classify this candidate as NOT_YET_COMPARABLE than to score a guessed conversion. The next acceptance gate is a version-pinned, source-backed IPA mapping and explicitly provisioned Korean lexical assets.

### New same-input external transcription smoke workflow

Added `.github/workflows/korean-ukrainian-external-translit-smoke.yml`. It installs the native package, calls the documented public API for Hikka and Shchegel using the same 20 Hangul inputs, checks HTTP/API success, verifies output count and input order, records native target status/selection status, prints each output and difference counts, and uploads a JSON artifact.

This is a **same-input output-difference smoke test only**. It deliberately does not treat any system's output as gold. The first Hikka/Shchegel-only run passed at [workflow 40782746527](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40782746527). The extended native-versus-external run passed at [workflow 40782926181](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40782926181), commit `2c9bba0a69c52e304c313cb3365e6fc70fce0619`; report artifact: [korean-ukrainian-external-transcription-smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40782926181/artifacts/12858425422). Both external systems returned 20/20 rows and preserved source order. Hikka and Shchegel differ on 13/20 inputs. Native-vs-Hikka and native-vs-Shchegel raw exact-string comparisons each differ on 20/20 inputs. These exact-string differences include capitalization/convention differences and provisional native candidates, so they are not accuracy rates. This is DONE_VERIFIED as an API/integration smoke test, not as an accuracy benchmark.

### Next evidence-gated steps

1. Complete the API smoke workflow and inspect the saved outputs for errors, unchanged unresolved strings, and Hikka/Shchegel differences.
2. Add a traceable sample of the native system's Ukrainian output for exactly the same inputs; confirm the public browser path and Python research path implement the same contract before treating them as equivalent.
3. Commission independent Korean-pronunciation and Ukrainian-transcription adjudication for a balanced target set, including word names, ordinary words, sentence context, morphology, and adversarial sound changes.
4. Revisit KoG2Padvanced only after licensing is clarified. Do not vendor, redistribute, or claim a license for its code based on public visibility alone.
5. Do not claim to have run the 2026 morphological engine until an author-published executable implementation is located and reproduced.


### Observed Hikka vs. Shchegel outputs (20-item smoke test)

The two documented systems were queried through the same endpoint and identical inputs. Selected output differences from the successful smoke run:

| Korean input | Hikka | Shchegel |
|---|---|---|
| 독립문 | Токріпмун | Докріпмун |
| 국립 | Кукріп | Ґукріп |
| 같이 | Каті | Ґаті |
| 민주주의의 의의 | Мінджуджуіі Иіі | Мінджуджуийий Ийий |
| 김치 | Кімчі | Ґімчхі |
| 흙을 | Хильґиль | Хикиль |
| 낡은 | Нальґин | Накин |
| 햇빛이 | Хетпічі | Хетбіті |
| 젊은 | Чольмин | Джьомин |
| 종로 | Чонро | Джонро |

Both external systems produced 20 results and preserved source order. The first API requests took 512.496 ms (Hikka) and 226.906 ms (Shchegel); the extended run measured 692.624 ms and 578.540 ms respectively. These are two single-request wall-clock observations, not comparable per-item engine latency or a stable performance result. Hikka and Shchegel outputs differed on 13 of 20 inputs. The native pipeline produced a target or candidate string for all 20 inputs, but only 10/20 were marked `model-selected`; the other 10 were unavailable/diagnostic candidates. Its raw output strings differed from each external system on 20/20 inputs. Because these comparisons are exact-string only, case-sensitive, and include candidate-only/unavailable native targets, they are not accuracy rates. Agreement on some external outputs does not establish correctness, and disagreement alone does not identify which output is better.

The sampled outputs reveal concrete adjudication targets: initial velar consonant choices (e.g. 국립, 같이, 김치), complex codas and liaison (흙을, 낡은, 맑은), palatalization/fortition contexts (햇빛이), and morphological/lexical context. Some outputs are visibly not directly comparable because the systems implement different Ukrainian conventions. Do not turn these raw observations into an accuracy score until each source item has an independently approved Ukrainian target and an explicit accepted-variant policy.


### Literature note: new morphological G2P (2026)

The Interspeech 2026 paper by Heejo You and Sung-woo Moon proposes a rule engine with syllable–morpheme links and recursive rule re-evaluation. Its Zenodo record lists the paper PDF and does not identify source code or an installable implementation. The abstract reports 85.7% sentence-level accuracy vs 27.2% for g2pk under the authors' own KSS evaluation; this is an external claim, not a result reproduced by this repository. The next step is source-code discovery/contact with the authors, followed by a same-split reproduction. No score is imputed into the benchmark table.


## Exact-head multi-engine results (2026-10-29)

Verified GitHub Actions run on branch head `3fa8a13e4eaf334e3fce1b37d70cfe84dfea6222`: [run 40783623954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40783623954). The multi-engine comparison job completed successfully and uploaded artifact `multi-engine-korean-ipa-diagnostic`. This is an observed single-run diagnostic, not a stable speed ranking.

### UGTPHON Korean test split

2,703 eligible token occurrences; 1,907 unique words. Exact match is against the dataset's paired IPA reference after benchmark normalization.

| Engine | Exact match | CER | PER | Feature-error proxy | Coverage | Unique-word runtime | Throughput |
|---|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native (“Kozak Kim”) | 53.002% | 9.170% | 9.614% | 4.877% | 99.815% | 703.866 ms | 2,709 words/s |
| g2pk 0.9.4 | **53.089%** | **9.229%** | **9.647%** | **4.895%** | 100% | 42,728.719 ms | 44.630 words/s |
| phonemize 2.0.1 | 42.545% | 14.353% | 14.258% | 7.706% | 100% | 308.645 ms (batch) | 6,179 words/s (batch) |
| KoG2P (2019) | 27.303% | 19.512% | 19.644% | 7.018% | 100% | 665.795 ms | 2,864 words/s |
| hangul_to_ipa | 16.241% | 24.805% | 30.809% | 11.778% | 100% | 2,109.833 ms | 904 words/s |
| eSpeak NG Korean | 8.139% | 33.610% | 38.316% | 13.410% | 100% | 514.117 ms (batch) | 3,709 words/s (batch) |

ClippyFirst native's per-word p50/p95 latency was 0.331/0.635 ms; g2pk's was 22.354/22.808 ms; KoG2P's 0.338/0.414 ms; hangul_to_ipa's 1.050/1.475 ms. The observed native/g2pk total-runtime ratio is about 60.7× on this run. Batch timings for phonemize/eSpeak include different startup and batching scopes and must not be ranked directly against per-word-call timings.

### SIGMORPHON 2021 Korean paired lexical test file

999 eligible token occurrences and 999 unique words. The file's pinned content is used as found; the repository notes its README's format description differs from the pinned file contents.

| Engine | Exact match | CER | PER | Feature-error proxy | Coverage | Unique-word runtime | Throughput |
|---|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native (“Kozak Kim”) | **35.772%** | **14.698%** | **16.234%** | **7.549%** | 99.900% | 328.223 ms | 3,044 words/s |
| g2pk 0.9.4 | 35.335% | 14.822% | 16.313% | 7.599% | 100% | 22,171.959 ms | 45.057 words/s |
| phonemize 2.0.1 | 28.929% | 17.439% | 18.266% | 8.462% | 100% | 264.691 ms (batch) | 3,774 words/s (batch) |
| KoG2P (2019) | 18.719% | 21.833% | 23.663% | 8.608% | 100% | 342.093 ms | 2,920 words/s |
| hangul_to_ipa | 8.909% | 29.845% | 36.347% | 12.814% | 100% | 1,095.604 ms | 912 words/s |
| eSpeak NG Korean | 4.304% | 40.724% | 48.705% | 17.787% | 100% | 302.378 ms (batch) | 3,304 words/s (batch) |

ClippyFirst native's per-word p50/p95 latency was 0.306/0.506 ms; g2pk's was 22.167/22.687 ms; KoG2P's 0.328/0.376 ms; hangul_to_ipa's 1.046/1.454 ms. The observed native/g2pk total-runtime ratio is about 67.5× on this run.

### What these measurements do and do not establish

- **Accuracy:** native and g2pk are effectively close on these two external sets: g2pk has a +0.087 percentage-point exact-match lead on UGTPHON, while native has a +0.437-point lead on SIGMORPHON. Paired bootstrap intervals are reported in the workflow log; on SIGMORPHON, the g2pk-minus-native exact-rate interval was [-0.802, -0.100] percentage points (equivalently native-minus-g2pk [+0.100, +0.802] pp), while the g2pk-minus-native CER difference interval was [-0.013, +0.277] percentage points. This cautions against collapsing all metrics into one winner.
- **Speed:** the run shows native is dramatically faster than g2pk under the current per-word adapter timing, but this is one CI run, not a repeated-run distribution. Runtime includes Python adapter overhead and excludes corpus loading/scoring. Warm-up effects and runner variance have not yet been quantified.
- **PER and feature proxy:** the broad-IPA segmentation and project-defined feature inventory have limitations; unsupported-segment counts remain substantial (native: 1,004 on UGTPHON and 476 on SIGMORPHON). Interpret feature-error proxy only alongside these counts.
- **Coverage:** native abstained on 5 UGTPHON token occurrences and 1 SIGMORPHON word, while other scored engines returned predictions for all rows. Coverage-adjusted exact match is therefore also retained.
- **Not scored:** the 2026 morphological G2P paper's engine, KoG2Padvanced, kokorog2p, SMART-G2P as an independent engine, HAMA Korean support, and retrieval-augmented UGTPHON research are not assigned scores because a reproducible, licensed, comparable IPA implementation has not been established.
- **Repeatability and memory:** repeat-run stability and comparable peak memory remain NOT_RUN. A future speed leaderboard should use warm-up plus at least 5 measured repetitions per dataset/engine, fixed runner/software versions, and report median/IQR as well as p50/p95 per-call latency. Do not describe this single-run speed result as a final stable ranking.

Artifact: [multi-engine diagnostic outputs](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40783623954/artifacts/12858177529).


## Expanded candidate run and repeated timing protocol

The benchmark harness has now been expanded for the next exact-head run:

- Added `kokorog2p==0.9.15` as a scored candidate using its documented Korean `output="ipa"` mode. Its Lexphon lookup and morphology are disabled for this run, so the benchmark measures the rule-based path on isolated Hangul words. This implementation is g2pK-derived, so it is a related implementation/configuration rather than a fully independent algorithm lineage.
- Added `KoG2Padvanced` at upstream commit `491b2d7269a4666b0d7556efb26755219f861163` as an external batch-only comparison. Its output is Hangul, so the shared project broad-IPA renderer is explicitly part of the adapter. The upstream repository has no declared license; the source is cloned only into the ephemeral Actions runner, is not vendored or redistributed, and this status must not be interpreted as a license grant.
- Added one warm-up call (excluded from measured repetitions) and five repeated full-dataset timings for per-word engines. Batch eSpeak, phonemize, and KoG2Padvanced calls also record five repeated full-batch timings. Each candidate records the individual runtime samples, median, minimum, maximum, and timing-scope caveat.
- IPA normalization now canonicalizes the single-codepoint affricate symbols `ʨ` and `ʥ` to `tɕ` and `dʑ`, respectively, before scoring. This is a representation-equivalence correction for outputs such as kokorog2p; all engines and both datasets must be rerun under this normalization. Previous percentages in the historical section above belong to the prior normalization and must not be mixed with new results.
- The current harness still does not claim comparable peak memory: the candidates run in one process and several native/runtime dependencies remain resident. A separate-process RSS harness is required before memory comparisons can be considered valid.

The exact-head GitHub Actions rerun is the acceptance gate for the new candidate adapters and metrics. Until that run completes successfully, the new candidates are `PENDING_CI`, not scored, and the earlier result tables remain historical only.


The pinned `willwade/byt5-g2p-multilingual-tiny` checkpoint (CC BY-SA 4.0 per its model card) is now enabled for this comparison branch. Its workflow uploads predictions/provenance only, not model weights or caches. The Charsiu checkpoint is now enabled for comparison-only evaluation at the user's request; its weights license remains unresolved, and neither weights nor caches are uploaded.


### HAMA candidate added for empirical check

HAMA is now included in the expanded candidate harness at pinned commit `fb81fe97e54c00b3f73192b9351f96fcd4427b03`, using its direct `G2PModel.predict().ipa` field. Its encoder vocabulary contains Korean jamo, but that fact alone does not establish Korean phonological competence; eligibility depends on actual output coverage and measured errors on both pinned datasets. The upstream root `LICENSE` says MIT while `python/pyproject.toml` declares Apache-2.0, so the license metadata discrepancy remains explicitly unresolved. HAMA source is cloned/installed only on the ephemeral comparison runner, not vendored into this repository. Its results are pending the exact-head CI run.


The latest full candidate run including HAMA, licensed ByT5 tiny, comparison-only CharSIU, the repaired KoG2Padvanced adapter, and neural PER/feature/runtime metrics is [GitHub Actions run 40833849437](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40833849437), queued at last check. Earlier runs are intermediate evidence only.


The latest workflow update enables the pinned CharsiuG2P checkpoint as a comparison-only neural candidate and joins its output with the baseline and licensed ByT5 results in the same run. No model weights or caches are uploaded; the checkpoint's weights-license status remains explicitly unresolved.


### KoG2Padvanced adapter correction
The first completed expanded run (40831542856) returned `BLOCKED_OR_ERROR` for KoG2Padvanced because its output contains mixed precomposed Hangul and compatibility jamo (first example: `유ㅣ칸`). This is classified as an adapter failure, not as a zero-accuracy engine result. The adapter now deterministically inserts an onset for isolated compatibility vowels, composes the jamo, and records invalid tokens individually instead of aborting the full batch. A focused regression test covers the observed form. The corrected adapter is pending the next exact-head CI run.


## First completed expanded benchmark subset (run 40831542856)

This run completed successfully with the corrected IPA affricate normalization and five timing repetitions. It predates HAMA, neural candidates, and the KoG2Padvanced adapter repair. The tables below are valid for the candidates that produced output; KoG2Padvanced is deliberately unscored in this run.

### UGTPHON (2,703 occurrences; 1,907 unique words)

| Candidate | Exact match ↑ | CER ↓ | PER ↓ | Feature proxy ↓ | Coverage | Repeated median total time | p50 / p95 per-word |
|---|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native | 53.002% | 9.170% | 9.614% | 4.877% | 99.815% | 716.5 ms | 0.339 / 0.623 ms |
| g2pk 0.9.4 | 53.089% | 9.229% | 9.647% | 4.895% | 100% | 43,203.6 ms | 22.826 / 23.499 ms |
| phonemize 2.0.1 | 42.545% | 14.353% | 14.258% | 7.706% | 100% | 328.8 ms (batch) | N/A (batch) |
| KoG2P (2019) | 27.303% | 19.512% | 19.644% | 7.018% | 100% | 667.0 ms | 0.346 / 0.422 ms |
| kokorog2p 0.9.15 | 23.714% | 21.182% | 21.633% | 6.948% | 100% | 1,437.6 ms | 0.748 / 0.777 ms |
| hangul_to_ipa | 16.241% | 24.805% | 30.809% | 11.778% | 100% | 2,149.7 ms | 1.078 / 1.502 ms |
| eSpeak NG Korean | 8.139% | 33.610% | 38.316% | 13.410% | 100% | 68.1 ms (batch) | N/A (batch) |
| KoG2Padvanced | **Not scored** | — | — | — | 0% usable IPA | — | — |

### SIGMORPHON 2021 (999 occurrences; 999 unique words)

| Candidate | Exact match ↑ | CER ↓ | PER ↓ | Feature proxy ↓ | Coverage | Repeated median total time | p50 / p95 per-word |
|---|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native | 35.772% | 14.698% | 16.234% | 7.549% | 99.900% | 302.4 ms | 0.266 / 0.441 ms |
| g2pk 0.9.4 | 35.335% | 14.822% | 16.313% | 7.599% | 100% | 22,814.2 ms | 22.779 / 23.216 ms |
| phonemize 2.0.1 | 28.929% | 17.439% | 18.266% | 8.462% | 100% | 279.6 ms (batch) | N/A (batch) |
| KoG2P (2019) | 18.719% | 21.833% | 23.663% | 8.608% | 100% | 344.5 ms | 0.342 / 0.392 ms |
| kokorog2p 0.9.15 | 14.114% | 24.449% | 26.888% | 9.302% | 100% | 750.9 ms | 0.745 / 0.778 ms |
| hangul_to_ipa | 8.909% | 29.845% | 36.347% | 12.814% | 100% | 1,114.3 ms | 1.074 / 1.503 ms |
| eSpeak NG Korean | 4.304% | 40.724% | 48.705% | 17.787% | 100% | 42.8 ms (batch) | N/A (batch) |
| KoG2Padvanced | **Not scored** | — | — | — | 0% usable IPA | — | — |

The timing samples are repeated full-dataset calls after the initial scored call has warmed the engine. Batch timing is not directly comparable to per-word calls. The original cold/first-pass runtime remains in the JSON artifact, and repeated sample ranges are available in the same report JSON. The run's exact logs and JSON artifact are at [run 40831542856](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40831542856), artifact [12879665317](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40831542856/artifacts/12879665317).

These are preliminary subset results only. The current exact-head run must still validate HAMA, both neural candidates, the repaired KoG2Padvanced adapter, and the updated batch warm-up metadata before the final all-candidate table is frozen.


### Licensed ByT5 tiny — first scored diagnostic
The completed ByT5 run [40831855862](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40831855862), artifact [12879510859](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40831855862/artifacts/12879510859), scored all occurrences but produced **0 exact matches** on both sets: UGTPHON CER 164.574% and SIGMORPHON CER 159.827%. Inspecting sample outputs shows repetitive/misaligned phoneme sequences (for example, input `가는돌고기` produced `a i k u tʰ u a k o k o m u` against reference `kanɯndoɭɡoɡi`). Treat this as a failed practical candidate under the pinned `kor:` input prefix and declared output contract, not as a contender; verify model-prefix/convention semantics before any further tuning. This run predates the new neural PER/feature-proxy/runtime instrumentation, which is being rerun in the current full candidate workflow. We retain the result rather than silently excluding it.


HAMA timing is now measured through its documented sentence-level batch API (one full-corpus call plus five repeated batch calls) rather than invoking the model once per token. This reflects the engine's supported usage and avoids an artificially slow per-word wrapper. The latest full candidate run is [40833631186](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40833631186), queued at last check.


### Neural metric report fix
A ByT5 rerun at [40832456382](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40832456382) failed after inference because the new PER/feature metrics were present in paired scoring but absent from the neural report's top-level summary (`KeyError: 'phoneme_error_rate'`). The aggregation now emits PER, the feature-error proxy, unsupported-feature counts, and reference-segment counts at the report level; regression tests assert these fields. The current full run [40833849437](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40833849437) is the acceptance gate for this fix.


## Expanded comparison run after explicit user authorization (2026-10-29)

The user authorized comparative-only evaluation of the broader candidate set. The harness now attempts the runnable candidates HAMA, kokorog2p, and KoG2Padvanced in addition to the previously scored six; it also enables the comparison-only CharsiuG2P checkpoint and the separately licensed multilingual ByT5 tiny checkpoint in the dedicated neural jobs. These are independent experiment results only; no candidate source or weights are integrated into the production phonology pipeline.

- Current code head for the timing/workflow fix: `86af8e9c472c12a32face705f3593830d1b8fecb`; follow-up handoff documentation commit: `62b50ceea58b74f85b8d55c751b918c192dd97d9`.
- Current full candidate run: [40837034742](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40837034742). At report update time its three jobs (baseline multi-engine, CharsiuG2P, and licensed ByT5 tiny) were queued; therefore no expanded-candidate score is asserted here yet.
- The workflow now explicitly requests five measured timing repetitions after a warm-up for both UGTPHON and SIGMORPHON and passes the pinned KoG2Padvanced checkout to both dataset runs. The generated JSON retains timing samples and median/min/max; per-engine comparable peak RSS is still not measured.
- Previous six-engine tables above are verified historical results from their recorded run, not scores for the expanded portfolio or the updated normalization/code head. Replace/extend them only after inspecting the current run artifact.
- The 2026 Interspeech morphology-aware engine remains unscored: the official Zenodo record exposes the paper PDF but no verified runnable source/package/checkpoint was found. Its published 85.7% versus 27.2% result uses the paper's own sentence-level evaluation and cannot be compared directly with these word/token-level IPA tests. See [the official paper record](https://zenodo.org/records/22167288).
- License boundaries remain explicit: KoG2Padvanced has no declared upstream license and is external-checkout-only, not vendored; Charsiu model weights remain unresolved and are not uploaded; ByT5 tiny's checkpoint is separately labeled CC BY-SA 4.0 and outputs/provenance only are uploaded. User authorization is for comparison in this project, not a substitute for third-party licensing rights.


## Expanded baseline result: Kokoro and repeated timings (run 40831542856)

Artifact: [multi-engine-korean-ipa-diagnostic, run 40831542856](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40831542856/artifacts/12879665317). This run uses the corrected affricate normalization and the expanded baseline harness, but predates the HAMA and neural-candidate jobs. It scored Kokoro; KoG2Padvanced failed closed and is not assigned accuracy or speed values. These results are distinct from the earlier six-engine historical run.

### UGTPHON (2,703 eligible occurrences; 1,907 unique words)

| Engine | Exact match ↑ | CER ↓ | PER ↓ | Feature-error proxy ↓ | Coverage | First-pass ms | Warm repeat median ms |
|---|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native | 53.002% | **9.170%** | **9.614%** | **4.877%** | 99.815% | 715.208 | 716.498 |
| g2pk 0.9.4 | **53.089%** | 9.229% | 9.647% | 4.895% | 100% | 43,740.823 | 43,203.636 |
| phonemize 2.0.1 | 42.545% | 14.353% | 14.258% | 7.706% | 100% | 324.331 | 328.763 |
| KoG2P (2019) | 27.303% | 19.512% | 19.644% | 7.018% | 100% | 672.361 | 667.032 |
| **kokorog2p 0.9.15** | 23.714% | 21.182% | 21.633% | 6.948% | 100% | 1,431.215 | 1,437.605 |
| hangul_to_ipa | 16.241% | 24.805% | 30.809% | 11.778% | 100% | 2,160.522 | 2,149.687 |
| eSpeak NG Korean | 8.139% | 33.610% | 38.316% | 13.410% | 100% | 600.410 | 68.059 |
| KoG2Padvanced | NOT SCORED | — | — | — | 0% | — | — |

### SIGMORPHON 2021 (999 eligible occurrences; 999 unique words)

| Engine | Exact match ↑ | CER ↓ | PER ↓ | Feature-error proxy ↓ | Coverage | First-pass ms | Warm repeat median ms |
|---|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native | **35.772%** | **14.698%** | **16.234%** | **7.549%** | 99.900% | 308.238 | 302.421 |
| g2pk 0.9.4 | 35.335% | 14.822% | 16.313% | 7.599% | 100% | 22,775.136 | 22,814.169 |
| phonemize 2.0.1 | 28.929% | 17.439% | 18.266% | 8.462% | 100% | 275.908 | 279.625 |
| KoG2P (2019) | 18.719% | 21.833% | 23.663% | 8.608% | 100% | 346.806 | 344.542 |
| **kokorog2p 0.9.15** | 14.114% | 24.449% | 26.888% | 9.302% | 100% | 754.037 | 750.938 |
| hangul_to_ipa | 8.909% | 29.845% | 36.347% | 12.814% | 100% | 1,138.866 | 1,114.332 |
| eSpeak NG Korean | 4.304% | 40.724% | 48.705% | 17.787% | 100% | 305.256 | 42.782 |
| KoG2Padvanced | NOT SCORED | — | — | — | 0% | — | — |

**Timing interpretation:** each engine has five repeated measurements after a warm-up; the table shows the first scored pass and median of the five later samples. eSpeak's first pass includes backend startup, while later calls reuse a warm backend, so its first-pass and warm median differ substantially. Kokoro's measured output is lower-scoring than the native/g2pk pair on both sets and its implementation is g2pK-derived, so it is a useful configuration baseline but not an independent algorithm family. KoG2Padvanced returned mixed Hangul/jamo output and was rejected by the initial adapter; a follow-up adapter fix composes isolated compatibility vowels, but its re-score must be taken from a later exact-head artifact.

### Remaining portfolio run

The next exact-head run [40837034742](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40837034742) includes HAMA, the repaired KoG2Padvanced adapter, CharsiuG2P and licensed ByT5 tiny. It was queued when this section was written. Its artifact is the acceptance source for those candidates; do not treat these preceding tables as final scores for HAMA or neural systems.


## Comparison-only authorization and new morphology-aware candidate (2026-10-29)

The user explicitly authorized broad candidate evaluation for comparison only. This does not mean integrating any external engine into the production pipeline, and it does not supersede third-party license terms. The benchmark remains an IPA-output leaderboard; every candidate is run externally or through a research adapter, with its output and provenance recorded.

### Added: g2p-ko 1.0.0 (smbslt3/g2p-korean)

- Upstream repository: https://github.com/smbslt3/g2p-korean
- Pinned commit: `fc382a3f17e70b605b271cad8c87dd571284e5b3`; package declares MIT. Its runtime uses Kiwi morphology analysis; the dependency and any bundled model/data notices remain separate license/provenance considerations.
- This is a distinct, public morphology-aware Korean surface-pronunciation implementation, **not the same engine** as the Interspeech 2026 paper. The latter's official executable source remains undiscovered.
- The benchmark calls `G2P.convert(word, normalize=False)` on Hangul-only eligible tokens to avoid testing number/Latin text normalization. Its Korean surface pronunciation is then mapped to broad IPA through the project's shared renderer. This adapter dependency is explicit; it is not counted as an independently implemented IPA encoder.
- Adapter tests now cover complete output, incomplete-result rejection, non-Hangul rejection, and IPA rendering. The pinned package and `kiwipiepy==0.23.2` are installed only in the benchmark CI environment.
- Status: `PENDING_CI`; no accuracy, latency, or throughput score is asserted until the new exact-head run succeeds and the artifact is inspected.

### Latest verification after adding g2p-ko

- Benchmark run [40839007805](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40839007805) was queued after the adapter, dependency pin, and regression tests were committed. General test, generated-artifact, and master-table workflows were also queued at that head; inspect their conclusions before claiming a pass.
- The previous expanded portfolio run [40837034742](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40837034742) predates g2p-ko and must not be treated as its score.
- Five repeated timing samples are now collected after a warm-up for per-word and supported batch engines. The report schema was corrected to describe repeatability as partially measured; output determinism and comparable per-engine peak RSS remain unmeasured.
- The novel Interspeech 2026 engine remains `BLOCKED_IMPLEMENTATION`: public sources found the paper and author's description of a new library, but no official runnable source, package, or checkpoint. Acceptance requires official implementation discovery, source/license verification, and same-protocol results on both pinned datasets. Do not substitute g2p-ko or a speculative reimplementation and label it as the paper's engine.


### ByT5 tiny metrics from the expanded run (job completed; parent workflow still in progress)

In run [40837034742](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40837034742), the licensed ByT5 tiny job completed successfully and uploaded its predictions/provenance artifact [12882112177](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40837034742/artifacts/12882112177). The baseline and CharsiuG2P jobs were still in progress when these results were captured.

| Dataset | Exact match | CER | PER | Feature-error proxy | First-pass runtime | Throughput |
|---|---:|---:|---:|---:|---:|---:|
| UGTPHON (2,703 occurrences; 1,907 unique words) | 0% | 164.574% | 172.425% | 118.953% | 86,316.439 ms | 22.093 words/s |
| SIGMORPHON 2021 (999 occurrences) | 0% | 159.827% | 177.376% | 126.426% | 41,150.220 ms | 24.277 words/s |

CER/PER above 100% are possible when edit distance exceeds reference length. These outputs are badly misaligned with the IPA references under the current pinned model/input/output contract, so this is a failed practical candidate in this configuration, not a general verdict on all ByT5 G2P models. It should not be ranked as a contender until the model prefix/token convention and output mapping are corrected and a new same-protocol run succeeds. The run's paired comparisons show no model-only exact matches on either dataset.


## Expanded candidate run 40833849437 — superseded baseline note

Run [40833849437](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40833849437) established that HAMA, kokorog2p, and KoG2Padvanced were runnable, and that CharsiuG2P produced strong diagnostic scores while licensed ByT5 tiny failed the output contract. The complete expanded baseline table below is the authoritative replacement for its rule/batch scores. The 408338 KoG2Padvanced SIGMORPHON omission was a workflow argument issue and was corrected in run 40837034742. The neural result from 408338 is retained here only as a historical comparison; the refreshed 408370 neural result is recorded at the end of this report.

### Neural results from run 408338 (historical, superseded by refreshed cold timings)

| Candidate | Dataset | Exact match | CER | PER | Feature proxy | Coverage | Cold time | Throughput |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| CharsiuG2P multilingual ByT5 | UGTPHON | 88.531% | 3.624% | 3.356% | 2.399% | 100% | 275.556 s | 6.921 tokens/s |
| CharsiuG2P multilingual ByT5 | SIGMORPHON | 70.971% | 5.408% | 5.582% | 2.136% | 100% | 108.710 s | 9.190 tokens/s |
| Licensed multilingual ByT5 tiny | UGTPHON | 0% | 164.574% | 172.425% | 118.953% | 100% | see artifact | 24.277 tokens/s |
| Licensed multilingual ByT5 tiny | SIGMORPHON | 0% | 159.827% | 177.376% | 126.426% | 100% | see artifact | 22.089 tokens/s |

CharsiuG2P weights have no explicit license on the resolved model page; training overlap with public benchmark sources is not ruled out. ByT5 tiny produced repetitive/misaligned phoneme sequences under the pinned input prefix and is not a viable candidate under this configuration. Artifacts: [CharsiuG2P 12881174231](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40833849437/artifacts/12881174231), [ByT5 tiny 12881342670](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40833849437/artifacts/12881342670).

## Exact-head expanded baseline refresh (run 40837034742)

The pinned multi-engine job completed successfully on code head `62b50ceea58b74f85b8d55c751b918c192dd97d9`. It includes the corrected KoG2Padvanced checkout argument for both datasets. Artifact: [12882152990](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40837034742/artifacts/12882152990). These scores supersede the earlier expanded baseline rows above for the nine engines in this job. Timing is the median of five post-warm-up samples; exact match, CER, PER, and feature proxy are percentages.

### UGTPHON — 2,703 occurrences / 1,907 unique words

| Engine | Exact ↑ | CER ↓ | PER ↓ | Feature proxy ↓ | Coverage | Warm median ms | p50 / p95 ms |
|---|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native | 53.002% | 9.170% | 9.614% | 4.877% | 99.815% | 358.119 | 0.170 / 0.318 |
| g2pk 0.9.4 | 53.089% | 9.229% | 9.647% | 4.895% | 100% | 16,989.863 | 8.822 / 9.351 |
| KoG2Padvanced (2022) | 47.318% | 10.677% | 11.338% | 6.156% | 100% | 881.155 | batch |
| phonemize 2.0.1 | 42.545% | 14.353% | 14.258% | 7.706% | 100% | 205.245 | batch |
| KoG2P (2019) | 27.303% | 19.512% | 19.644% | 7.018% | 100% | 342.252 | 0.176 / 0.219 |
| kokorog2p 0.9.15 | 23.714% | 21.182% | 21.633% | 6.948% | 100% | 758.203 | 0.399 / 0.422 |
| HAMA 1.7.0 | 16.907% | 25.108% | 23.911% | 8.428% | 100% | 40,463.723 | batch |
| hangul_to_ipa | 16.241% | 24.805% | 30.809% | 11.778% | 100% | 881.647 | 0.442 / 0.616 |
| eSpeak NG Korean | 8.139% | 33.610% | 38.316% | 13.410% | 100% | 37.421 | batch |

### SIGMORPHON 2021 — 999 occurrences / 999 unique words

| Engine | Exact ↑ | CER ↓ | PER ↓ | Feature proxy ↓ | Coverage | Warm median ms | p50 / p95 ms |
|---|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native | 35.772% | 14.698% | 16.234% | 7.549% | 99.900% | 152.441 | 0.131 / 0.229 |
| g2pk 0.9.4 | 35.335% | 14.822% | 16.313% | 7.599% | 100% | 8,899.493 | 8.890 / 9.359 |
| KoG2Padvanced (2022) | 32.633% | 15.824% | 17.553% | 9.098% | 100% | 429.461 | batch |
| phonemize 2.0.1 | 28.929% | 17.439% | 18.266% | 8.462% | 100% | 176.476 | batch |
| KoG2P (2019) | 18.719% | 21.833% | 23.663% | 8.608% | 100% | 171.823 | 0.170 / 0.196 |
| kokorog2p 0.9.15 | 14.114% | 24.449% | 26.888% | 9.302% | 100% | 389.692 | 0.388 / 0.412 |
| HAMA 1.7.0 | 12.713% | 27.616% | 27.090% | 9.324% | 100% | 17,977.491 | batch |
| hangul_to_ipa | 8.909% | 29.845% | 36.347% | 12.814% | 100% | 461.121 | 0.444 / 0.616 |
| eSpeak NG Korean | 4.304% | 40.724% | 48.705% | 17.787% | 100% | 24.059 | batch |

Throughput at the repeated median is approximately 5,325 / 6,553 words/s for native and 112 / 112 words/s for g2pk on UGTPHON / SIGMORPHON. HAMA and KoG2Padvanced use sentence-level batch calls; eSpeak and phonemize use warm batch calls. Do not compare their batch latency directly with per-word p50/p95. Peak memory remains `NOT_MEASURED`.

The CharsiuG2P job in run 40837034742 completed successfully. Its refreshed metrics and cold-start timing are recorded below; the separate all-engine pairing job remains queued.


### Refreshed CharsiuG2P cold-run result — run 40837034742

Artifact: [12882472032](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40837034742/artifacts/12882472032).

| Dataset | Exact match | CER | PER | Feature proxy | Coverage | Cold load + inference | Throughput |
|---|---:|---:|---:|---:|---:|---:|---:|
| UGTPHON | 88.531% (2,393/2,703) | 3.624% | 3.356% | 2.399% | 100% | 391.791 s | 4.867 tokens/s |
| SIGMORPHON | 70.971% (709/999) | 5.408% | 5.582% | 2.136% | 100% | 156.986 s | 6.364 tokens/s |

This is one cold model-load plus batched-inference measurement; neural repeatability remains `NOT_MEASURED`. The weights license is unresolved and training overlap is not ruled out. The all-engine neural pairing job is queued, so no completed combined paired comparison is claimed.


## Why CharsiuG2P currently scores higher, and how to close the gap (2026-10-29)

### Observed gap on the paired benchmark

The successful comparative-only Charsiu run in [40837034742](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40837034742) used the same eligible token occurrences and references as the native baseline. On the common scored subset:

| Dataset | Metric | ClippyFirst native | CharsiuG2P | Difference |
|---|---|---:|---:|---:|
| UGTPHON | Exact match | 53.002% | 88.531% | Charsiu +35.529 pp |
| UGTPHON | CER | 9.170% | 3.624% | Charsiu error 60.5% lower |
| UGTPHON | PER | 9.614% | 3.356% | Charsiu error 65.1% lower |
| SIGMORPHON | Exact match | 35.772% | 70.971% | Charsiu +35.199 pp |
| SIGMORPHON | CER | 14.698% | 5.408% | Charsiu error 63.2% lower |
| SIGMORPHON | PER | 16.234% | 5.582% | Charsiu error 65.6% lower |

These are real observed score differences under the current harness, not proof that the neural model is intrinsically more linguistically correct. The test sets are not yet established as leakage-free for this checkpoint.

### Most likely causes (separate evidence from hypotheses)

1. **Data coverage and generalization — strong architectural explanation.** CharsiuG2P is a supervised multilingual ByT5 sequence model trained on many grapheme-to-pronunciation pairs. It can learn frequent and overlapping phonological patterns, orthographic exceptions, and distributional regularities without every pattern being manually encoded. The native engine is a transparent ordered-rule pipeline plus a sourced exact-form lexicon. Its rule inventory, morphological class evidence, and lexical coverage are necessarily more limited until those are added and verified.
2. **Morphology and lexical context — confirmed native design limitation.** The native pipeline intentionally withholds some results when a process depends on exact morpheme evidence: liaison/neutralization, complex-coda + ㅎ aspiration, palatalization with formal morphemes, ㄺ-before-ㄱ fortition, and the -ㄹ게 ending. A learned model can predict a likely form from training regularities even without explicit segmentation; the deterministic engine must instead obtain a morphological analysis, a licensed rule environment, or a sourced lexical exception.
3. **Reference-convention alignment — plausible contributor, not yet quantified as the cause of the 35 pp gap.** The neural model's output convention is not independently documented. It may emit symbols, segment boundaries, or phonetic variants closer to the reference corpus than the native broad-IPA renderer. The benchmark currently applies conservative Unicode/format normalization, not a fully adjudicated phonological equivalence relation. Do not weaken normalization simply to improve one model's score; define and independently validate the accepted IPA convention first.
4. **Potential train/test overlap — material validity risk.** The repository's data audit found 508 unique UGTPHON test forms overlapping the public Charsiu repository's Korean training file, and 729 SIGMORPHON test forms overlapping that file. The Hugging Face checkpoint's full training manifest is unavailable, so these intersections do **not prove** the checkpoint trained on every overlapping item; they do mean independent evaluation cannot currently be claimed. SIGMORPHON overlap is particularly large (729/999 lexical forms). Scores on a decontaminated holdout are required before treating the full gap as generalization performance.
5. **Abstention is not the main explanation.** Native coverage is 99.815% on UGTPHON and 99.900% on SIGMORPHON; the small number of abstentions cannot account for a roughly 35 percentage-point exact-match gap.

### Recommended repair path for the deterministic engine

Do not try to mimic the neural model by adding broad, guessed substitutions. Close the gap through evidence-backed rule coverage and morphology, in this order:

1. **Protect a genuinely independent evaluation.** Audit all candidate training sources against benchmark forms; keep the existing test sets sealed. Create a decontaminated evaluation slice excluding any form known to occur in available Charsiu/SIGMORPHON training inventories, and add an independently sourced/annotated holdout. Publish both contaminated-risk and decontaminated scores rather than silently replacing the existing result.
2. **Generate a paired error ledger.** For every occurrence, retain native IPA, Charsiu IPA, gold variants, CER/PER deltas, source form, morphology, and error class. Prioritize cases where Charsiu matches the gold but native does not. The existing paired-report workflow is designed to join the complete occurrence ledger; the most recent completed run's pairing job was still queued, so this artifact must be completed before claiming a fully categorized neural gap.
3. **Mine candidates on train/dev only.** Use the existing `benchmark_charsiu_research_split.py`, `analyze_korean_g2p_teacher_errors.py`, and `mine_deterministic_rule_candidates.py` workflow only on permitted train/dev data. Group disagreements by coda/onset environment, liaison, nasalization, liquidization, tensification, ㅎ deletion/aspiration, palatalization, ㄴ insertion, compound boundaries, lexical exceptions, and IPA convention. These groups are hypotheses for review, not automatic production rules.
4. **Add morphological evidence before broadening rules.** Evaluate the pinned morphology-aware `g2p-ko`/Kiwi adapter and the distinct 2026 Interspeech engine if its official runnable source becomes available. Feed explicit morpheme boundaries/classes into the existing ordered rule engine; recursively re-evaluate later rules only where the rule's formal environment and source evidence license it. A boundary alone is not enough to license a rule.
5. **Require a primary-source-backed regression for every new rule.** Each change needs a source citation, positive and negative controls, explicit rule order, native/browser parity where applicable, and held-out dev improvement. Keep unresolved contexts unresolved rather than guessing. Exact-form lexical fixes require independently sourced pronunciation evidence and must not be generalized by spelling alone.
6. **Normalize only verified IPA equivalences.** Establish a documented broad-IPA target profile with expert review and measure profile sensitivity separately. Keep raw model outputs and raw exact-match scores. Never remove aspiration, length, or segment contrasts globally just because that makes a candidate score better.
7. **Re-run the same paired evaluation after each coherent batch.** Acceptance means lower error on an independent dev set without regressions in rule controls, stable browser/Python parity, and no increase in unsupported guesses. Only after the implementation is frozen should the sealed holdout be evaluated once.

### Runtime trade-off

The Charsiu measurements include cold model load and batched inference: about 391.8 s on UGTPHON and 157.0 s on SIGMORPHON in the refreshed run. Native warm median runtime was about 358 ms and 152 ms respectively in its five-sample measurement. These timing scopes differ (cold model startup plus batch inference versus in-process deterministic calls), so they are not a fair per-token speed ratio. Measure warmed neural inference separately before comparing steady-state throughput. The practical trade-off is clear even without that ratio: Charsiu currently has much higher reference match, while the deterministic engine is far lighter, transparent, and easier to execute at low latency.

### Decision

Treat CharsiuG2P as a strong **research teacher/baseline**, not as an automatically correct gold oracle or production dependency. The immediate corrective work is leakage-aware paired error analysis, IPA-convention adjudication, and morphology-aware deterministic rules backed by primary sources. Do not claim parity with Charsiu until the gap closes on an independent evaluation; do not claim the current Charsiu scores are unbiased until training overlap and weights provenance are resolved.
