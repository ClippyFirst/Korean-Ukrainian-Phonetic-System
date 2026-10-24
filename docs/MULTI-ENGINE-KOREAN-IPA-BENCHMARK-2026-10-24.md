# Multi-engine Korean-to-IPA diagnostic benchmark (2026-10-24)

## Status

**DONE_VERIFIED for two diagnostic datasets, six engines, and complete occurrence-level native-vs-g2pk audits** on the post-fix benchmark head. Latest run: [40092929978](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978); artifact: [12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692). This head includes the merged coda-ㅇ and broad-IPA palatal-yod fixes plus the branch's source-backed exact-form R010 licenses for 닮다 and 넘게. All 48 UGTPHON abstention occurrences and both SIGMORPHON abstentions were retained; the full pairwise ledger replaces the old capped mismatch sample.

- Repository: ClippyFirst/Korean-Ukrainian-Phonetic-System
- Benchmark branch: bench/ko-eight-suite-and-abstention-audit-2026-10-24
- Active benchmark and error-analysis PR: [#297](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/297); earlier benchmark PR [#280](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/280) is merged
- Pinned dataset: [UGTPHON](https://github.com/naver-ai/UGTPHON), commit ef0d5a09c2ea1874c7206020f875cbd9cfea2f54, Korean ko/test.json, 275 rows, Apache-2.0 verified by CI.
- Harness: scripts/benchmark_multi_engine_ko.py
- JavaScript adapter: scripts/benchmark_phonemize_adapter.cjs
- Adapter tests: tests/test_multi_engine_benchmark.py
- Workflow: [Multi-engine Korean IPA diagnostic benchmark](../.github/workflows/multi-engine-ipa-benchmark.yml)

## Why this corpus, and what it cannot prove

UGTPHON is a pinned, reproducible, noisy user-generated Korean text set with IPA annotations. It is useful for a first common-set comparison; it is **not** a normative gold set for all 30 NIKL Standard Pronunciation Rules. The dataset's annotation conventions can differ from the broad IPA conventions of any engine. Therefore exact match and character error rate (CER) are diagnostic measurements, not adjudicated phonetic truth.

This benchmark scores Korean IPA only. It does **not** measure IPA-to-Ukrainian adaptation, readability for Ukrainian users, the correctness of Ukrainian graphemes, or whether the native engine's abstentions are preferable in a safety/research workflow.

## Candidate register

| Candidate | Pinned source / version | Native output | Evaluation adapter | Independence and caveats |
|---|---|---|---|---|
| ClippyFirst native | PR branch's native Python pipeline | IPA plus explicit unresolved status | Public phoneticize_korean() API | System under test. Abstentions remain separate from runtime failures and are not silently scored as guesses. |
| g2pk | g2pk==0.9.4 | Korean surface Hangul | Repository segment IPA renderer only; native phonological rules are not rerun | Already present in PR #280. Shared rendering layer can bias comparison. |
| [KoG2P](https://github.com/scarletcho/KoG2P) | scarletcho/KoG2P commit cbc69bbe1439862364d4ffd1552f59b930f655c7 | Custom romanized phone labels | Explicit project-side label-to-broad-IPA map derived from upstream's documented symbol table | GPL-3.0; checked out only for the CI run, not copied or vendored. The label mapping is lossy and separately disclosed. Upstream last commit is from 2020. |
| [hangul_to_ipa](https://github.com/stannam/hangul_to_ipa) | stannam/hangul_to_ipa commit 942abf132ea969a7e3476a1487c06710fb8db74b | IPA | Direct upstream IPA output, default rule preset pastcnhovr | MIT. Its documented scope excludes several morphology-/extra-phonology-sensitive processes, including N-insertion and liquid tensification. |
| [eSpeak NG](https://github.com/espeak-ng/espeak-ng) | Ubuntu 24.04 system package, via phonemizer==3.3.0 | IPA-like output from Korean voice | Direct phonemizer output, stress disabled | TTS-oriented phonemizer baseline, not a claim of narrow-IPA or NIKL authority. CI records the installed eSpeak version and checks for Korean voice availability. |
| [phonemize](https://github.com/hans00/phonemize) | hans00/phonemize npm 2.0.1 | IPA | Direct phonemize/all output with stripStress=true | MIT. Its published Korean score is based on a small LLM-judged sample, not independent human-gold IPA. |
| [Korean Phonetic Database (KPD)](https://www.cjk.org/data/korean/nlp/korean-phonetic-database/) | Commercial database; access/license not verified | Large lexical IPA inventory | Not executed | **BLOCKED_ACCESS_AND_TERMS**. No paid data or credentials available in this run; do not scrape, redistribute, or infer its accuracy from the catalogue description. |
| [ntdgo/korean-pronunciation](https://github.com/ntdgo/korean-pronunciation) | Public Node.js port of g2pK; no license declared in repository metadata | Korean surface Hangul | Not executed as a separate score | Not counted as an independent baseline because it is a g2pK-derived port, overlapping an existing family, and the repository metadata did not declare a license at inspection. |
| [korean-eval-jck](https://github.com/icig-korean-eval/korean-eval-jck) | Evaluation repository using a modified hangul_to_ipa path | IPA and audio-to-IPA diagnostic | Not executed as a separate score | Not counted as an independent engine because its text converter is based on the already included hangul_to_ipa family; avoid double-counting related implementations. |
| [2022 KoG2P/g2pk research modifications](https://doi.org/10.29403/LI.26.2.2) | Published research; executable pinned implementation not verified | Rule-based G2P | Not executed as a distinct binary | **BLOCKED_REPRODUCIBLE_IMPLEMENTATION** until the exact code, version, dependencies, and license can be tied to the paper. Literature claims are not substituted for a run. |

## Scoring contract

- Corpus validation requires 275 unique row IDs, Korean language, test split, and required fields.
- Only single-token Hangul entries with at least one gold IPA variant are scored; eligible token occurrences and unique words are both reported.
- IPA normalization reuses benchmark_ugtphon_ko.normalize_ipa: Unicode canonicalization, g → ɡ, tie bars and selected narrow diacritics (including retraction U+0320) removed, spaces and periods removed. Stress, length, aspiration, fortis and unreleased-stop markers remain. This profile revision materially changes exact-match/CER values.
- Exact match accepts the closest comma-separated gold IPA variant.
- CER is total Levenshtein distance divided by total length of the selected reference variants.
- Coverage is scored token occurrences divided by eligible token occurrences. Native unresolved cases are abstentions, not engine exceptions.
- Paired comparison uses the same occurrence IDs so repeated words in a row do not collapse into a single observation.
- Deterministic 1,000-replicate row-cluster percentile bootstrap intervals are emitted for exact-match rate and CER; paired row-cluster intervals estimate candidate-minus-native deltas. They describe sampling variability on this dataset; they do not correct reference-label errors or annotation-convention mismatch.
- The report includes per-engine status, error samples, paired deltas, confidence intervals, and a capped mismatch sample. The raw external corpus is not committed.


## Current verified results — revised broad-IPA profile (2026-10-24)

Machine-readable reports and the complete occurrence-level native-vs-g2pk audit: [latest successful run 40092929978](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978), [artifact 12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692). Values are percentages; exact-match 95% CIs are deterministic 1,000-replicate row-cluster percentile bootstrap intervals. CER is lower-is-better. These are diagnostics, not normative NIKL accuracy.

### UGTPHON noisy user-generated text

275 rows, 2,703 eligible token occurrences, 1,907 unique Hangul words.

| Engine | Scored / eligible | Coverage | Exact match (95% CI) | CER |
|---|---:|---:|---:|---:|
| ClippyFirst native (post-R002, yod, and R010 fixes) | 2,655 / 2,703 | 98.2242% | 53.1827% (48.4860–58.1989%) | 9.1883% |
| g2pk 0.9.4 + ClippyFirst IPA renderer | 2,703 / 2,703 | 100% | 53.0892% (48.5190–58.0085%) | 9.2285% |
| phonemize 2.0.1 | 2,703 / 2,703 | 100% | 42.5453% (37.2093–48.6478%) | 14.3531% |
| KoG2P 2019 | 2,703 / 2,703 | 100% | 27.3030% (25.1766–29.4688%) | 19.5122% |
| hangul_to_ipa | 2,703 / 2,703 | 100% | 16.2412% (14.0375–18.5143%) | 24.8054% |
| eSpeak NG | 2,703 / 2,703 | 100% | 8.1391% (6.3679–10.1852%) | 33.6101% |

Paired candidate-minus-native deltas on the 2,655 shared scored occurrences:

| Candidate | Exact-rate delta (95% CI) | CER delta (95% CI) |
|---|---:|---:|
| g2pk + project renderer | +0.1506 pp (+0.0351 to +0.3243 pp) | +0.0531 pp (−0.0139 to +0.1302 pp) |
| phonemize 2.0.1 | −10.1319 pp (−11.9038 to −8.3370 pp) | +5.0146 pp (+4.2801 to +5.8326 pp) |
| KoG2P 2019 | −25.6497 pp (−30.3777 to −21.2985 pp) | +10.4054 pp (+9.4870 to +11.4157 pp) |
| hangul_to_ipa | −36.7232 pp (−40.6274 to −33.0227 pp) | +15.5793 pp (+14.5573 to +16.6784 pp) |
| eSpeak NG | −44.9718 pp (−50.3340 to −39.9636 pp) | +24.3826 pp (+23.2720 to +25.5759 pp) |

The native engine's scored-set exact rate is marginally higher than g2pk's full-set rate, but the denominators differ because native abstains on 48 occurrences. The paired comparison is the fairer comparison: g2pk has four more exact matches among 2,655 shared scored occurrences, a small +0.1506 pp difference. The paired CER interval crosses zero; native's measured CER is slightly lower.

### SIGMORPHON 2021 public paired lexical file

1,000 source rows; 999 eligible syllable-token occurrences and 999 unique eligible words. One source row, ᆸ니다, uses a standalone archaic Hangul jamo outside the current engine's syllable-token contract and is excluded rather than guessed. The pinned public file contains word/IPA pairs, despite the upstream README describing the shared-task test input as word-only. This is therefore a public paired-file diagnostic, not a leaderboard reproduction.

| Engine | Scored / eligible | Coverage | Exact match (95% CI) | CER |
|---|---:|---:|---:|---:|
| ClippyFirst native | 997 / 999 | 99.7998% | 35.8074% (32.7984–38.7161%) | 14.7037% |
| g2pk 0.9.4 + ClippyFirst IPA renderer | 999 / 999 | 100% | 35.3353% (32.5325–38.2382%) | 14.8222% |
| phonemize 2.0.1 | 999 / 999 | 100% | 28.9289% (26.2262–31.6316%) | 17.4387% |
| KoG2P 2019 | 999 / 999 | 100% | 18.7187% (16.3163–21.2212%) | 21.8327% |
| hangul_to_ipa | 999 / 999 | 100% | 8.9089% (7.2072–10.6106%) | 29.8448% |
| eSpeak NG | 999 / 999 | 100% | 4.3043% (3.1031–5.7057%) | 40.7236% |

Paired deltas on the 997 shared scored occurrences:

| Candidate | Exact-rate delta (95% CI) | CER delta (95% CI) |
|---|---:|---:|
| g2pk + project renderer | −0.4012 pp (−0.8024 to −0.1003 pp) | +0.1130 pp (−0.0250 to +0.2732 pp) |
| phonemize 2.0.1 | −6.8204 pp (−8.6259 to −5.0150 pp) | +2.6871 pp (+2.0350 to +3.3528 pp) |
| KoG2P 2019 | −17.0511 pp (−19.4584 to −14.5436 pp) | +7.0944 pp (+6.3877 to +7.9047 pp) |
| hangul_to_ipa | −26.8806 pp (−29.5888 to −23.9719 pp) | +15.1180 pp (+14.2910 to +15.9478 pp) |
| eSpeak NG | −31.4945 pp (−34.5035 to −28.4855 pp) | +26.0170 pp (+24.8802 to +27.1048 pp) |

On this dataset ClippyFirst has four native-only exact matches and no g2pk-only exact matches among the shared scored occurrences. The exact-match interval favors native; the CER interval crosses zero. The two datasets therefore do not support a universal g2pk advantage.

### Complete paired error ledger and abstentions

- **UGTPHON pairwise categories (2,703 occurrences):** both exact 1,412; both not exact 1,239; g2pk-only exact 4; native abstained while g2pk was exact 19; native abstained and g2pk was not exact 29. There were no native-only exact occurrences in this dataset.
- The four g2pk-only exact occurrences are all the same word, **없는**, repeated in four corpus rows. ClippyFirst's source-backed lexical entry preserves the NIKL-attested long vowel [엄ː는] (ʌːm.nɯn); the UGTPHON reference omits the length mark. Do not delete length from production IPA merely to fit this annotation convention. This is an evidence-backed reference/normalization mismatch, not a proven native phonology error.
- The two prior g2pk-only exact cases **닮다** and **넘게** were resolved on this branch with exact-form R010 (§24 stem-n/m + ending) licenses. Their outputs now match the reference. The rule remains scoped to these full forms; no unrestricted morphology guess was added.
- **SIGMORPHON pairwise categories (999 occurrences):** both exact 353; both not exact 640; native-only exact 4; native abstained while g2pk was not exact 2.
- UGTPHON native abstentions remain 48 occurrences across 47 unique words, with 49 context labels: R002 liaison/neutralization 25; R003 ㅎ-coda deletion 20; R007 palatalization 2; R004 complex-coda plus ㅎ aspiration 1; one IPA-adjudication gap. Among the 48, g2pk matches the reference in 19 cases and does not in 29 (diagnostic comparison only).
- The official broad-IPA renderer fix for ㅈ/ㅉ/ㅊ + ㅕ removed 13 g2pk-only exact mismatches from the prior paired audit. The R010 licenses resolved two further cases. Full occurrence-level evidence is preserved in the linked JSON artifact.

### Current conclusions

- The old claim that g2pk led UGTPHON by +2.4482 pp is superseded. After the coda-ㅇ fix, broad-IPA glide absorption, and two exact-form R010 licenses, its paired exact-match lead is only +0.1506 pp. All four remaining g2pk-only exact occurrences are a repeated vowel-length annotation mismatch for 없는; paired CER does not show a clear g2pk advantage.
- On SIGMORPHON, native has a small but statistically detectable exact-match advantage on the shared scored set; CER does not clearly distinguish the engines.
- g2pk plus the project renderer is not a fully independent IPA stack because both systems share the renderer. These are noisy/public paired-file diagnostics, not normative NIKL accuracy and not IPA-to-Ukrainian quality measurements.
- A NIKL-grounded, independently adjudicated holdout and a separately reviewed Korean-IPA-to-Ukrainian gold set remain required for any release-quality accuracy claim.

## Error analysis: what the pairwise results actually diagnose

This section inspects the full occurrence-level JSON in artifact [12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692), rather than inferring causes from aggregate scores.

### 1. The two engines almost always emit the same IPA string

On UGTPHON, native and g2pk emitted an identical IPA string for **2,634 of 2,655 shared scored occurrences (99.21%)**. Of the 1,239 occurrences where both failed exact match, **1,222 (98.63%) have identical native and g2pk strings**. Only 21 shared occurrences differ, representing 14 unique Hangul forms (repeated corpus occurrences account for the rest).

This is a key result: the small aggregate score difference is not evidence that g2pk has a broadly superior phonological model. Most scored cases cannot distinguish the phonological engines because their emitted strings are identical; many remaining mismatches are shared by both engines. The two engines also share the project's broad-IPA segment renderer, so they are not independent at the output-phonetics layer.

### 2. Four apparent g2pk wins on UGTPHON are a reference-convention conflict

All four g2pk-only exact occurrences are repetitions of **없는**. The corpus reference normalizes to `ʌmnɯn` (no length mark), while the native output is `ʌːm.nɯn`. The National Institute of Korean Language's official answer explicitly gives **없는 [업ː는 → 엄ː는]**, confirming the long vowel: [NIKL, “알 수 없는” pronunciation (2026-05-28)](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=331601).

Therefore these four occurrences should be treated as a **probable gold-annotation/convention mismatch**, not accepted as proof that native pronunciation is wrong. If the reference is independently corrected to retain the NIKL-attested length, these four exact-match outcomes reverse: on the same 2,655 shared occurrences native would have 1,416 exact and g2pk 1,412. This is a clearly labelled counterfactual, not a replacement benchmark score; the pinned upstream reference remains unchanged.

### 3. SIGMORPHON supplies concrete cases where native is better

There are four native-only exact occurrences and no g2pk-only exact occurrences on the 997 shared scored SIGMORPHON items. At least two of these are supported by the official NIKL rule explanation:

- **값어치**: native `ka.bʌ.tɕʰi` matches the expected [가버치], whereas g2pk emits `kap̚.s͈ʌ.tɕʰi`. NIKL's official Standard Pronunciation Rule 15 explicitly lists 값어치 [가버치] and explains the special treatment of this form: [official rule and commentary](https://www.korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002).
- **맛없다**: native `ma.dʌp̚.t͈a` matches [마덥따], while g2pk emits `ma.sʌp̚.t͈a`. The same official Rule 15 explicitly lists 맛없다 [마덥따].
- **많다**: native preserves the long-vowel mark present in the paired reference; g2pk does not. This is a lexical-length distinction, not evidence of a better general coda rule.
- **놓치다**: this is a native-only exact match under the pinned IPA reference, but its annotation should be independently adjudicated before treating it as a normative phonological win. Exact-match status alone is not sufficient authority.

These examples refute a universal “g2pk is better” conclusion. They also show why a source-backed rule set and an independently reviewed reference are necessary to interpret exact match.

### 4. What the 21 differing UGTPHON outputs suggest

The full audit's 21 native-vs-g2pk string differences are concentrated in a small number of forms, not distributed across the whole corpus. They include:

- **Morphology-sensitive fortition**: `다를게`, `안타까울게`, and `할게` differ in whether ㄱ is realized as fortis `k͈` or lenis `ɡ`. The native output agrees with this corpus's reference on these forms; the rule must remain tied to an evidenced ending/morphological environment rather than generalized from spelling alone.
- **Coda-to-onset realization**: `무릎을` differs as native `mu.ɾɯ.pʰɯl` vs g2pk `mu.ɾɯ.bɯl`. This is a high-value source-backed regression candidate because the coda ㅍ should not be silently converted to a lenis ㅂ when linked to the particle; verify the exact official lexical/rule environment before adding a broad rule.
- **Lexical length**: `많이`, `없다`, `없는`, and `없어` differ in preservation of long-vowel marking. Each item needs dictionary/rule evidence; never remove length globally to increase benchmark exact match.
- **Other lexical/morphological contrasts**: `삼기는`, `살아남다`, `올게이`, and `대한민국` also differ, but these isolated strings do not establish which engine is correct. The user-generated corpus may contain nonstandard forms and its broad/narrow IPA convention is not a normative gold standard.

The benchmark's normalization removes selected narrow diacritics, tie bars, spaces, and syllable separators, but deliberately retains length, aspiration, fortis, and unreleased-stop marks. Thus differences in those retained features can dominate exact match even when the underlying phonological rule is shared. Conversely, normalizing them away would hide real distinctions. Keep this profile explicit and do not tune it merely to maximize a preferred engine's score.

### 5. Abstentions are a separate, actionable workstream

The native engine abstains on 48 UGTPHON occurrences: 19 have a g2pk output that matches the corpus reference, while 29 do not. The contexts are 25 R002 liaison/neutralization cases, 20 R003 ㅎ-coda deletion cases, one R004 complex-coda-plus-ㅎ case, two R007 palatalization cases, and one IPA-adjudication gap (49 context labels because one occurrence has two contexts). The SIGMORPHON abstentions are 닭갈비 (R008 morphology-sensitive ㄺ-before-ㄱ fortition) and 중심닮음 (R002 morpheme-sensitive liaison/neutralization).

These are candidates for adjudication, not 19 proven misses: g2pk's match to a noisy reference does not establish correctness. The next implementation batch should be driven by exact NIKL source context and regression tests, prioritizing R002/R003 because they account for 45 of the 48 UGTPHON abstentions. Do not replace explicit abstention with a guessed output.

### Findings and implementation decision

- **Established:** the residual UGTPHON paired difference is only four exact-match occurrences, all repetitions of 없는; the two engines' outputs are identical on 99.21% of their shared scored occurrences.
- **Established:** the official NIKL examples support native over g2pk for 값어치 and 맛없다; SIGMORPHON also exposes a native advantage for lexical length in 많다.
- **Not established:** that every common mismatch is a reference error, that every native-only exact is normatively correct, or that g2pk's other outputs are generally better.
- **Decision:** do not copy g2pk rules wholesale or weaken native length/phonetic distinctions to improve this noisy score. Adjudicate the small set of differing forms against exact NIKL rule environments, then expand a held-out, source-cited challenge set. Keep UGTPHON as a diagnostic set and preserve all unresolved cases until individually licensed.

## Historical results — earlier normalization profile (superseded)

The latest exact-head scoring run is [40085814704](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40085814704), with report artifact [12557450401](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40085814704/artifacts/12557450401). The invalid first-run phonemize result (0 exact, CER 100%) is excluded: its adapter returned unchanged Hangul because `anyAscii` was disabled. The corrected adapter enables `anyAscii=true`; this current report confirms non-Hangul IPA outputs. These are adapter smoke examples, not proof that individual predictions are phonetically correct.

### Full eligible set

UGTPHON Korean test split: 275 rows, 2,703 eligible token occurrences, 1,907 unique Hangul words. Exact-match and CER confidence intervals are deterministic 1,000-replicate row-cluster percentile bootstrap intervals. CER is lower-is-better.

| Engine | Status / scored tokens | Coverage | Exact match (95% CI) | CER (95% CI) |
|---|---:|---:|---:|---:|
| ClippyFirst native strict | PARTIAL; 2,655/2,703 | 98.2242% | 24.4068% (22.12–26.97%) | 17.0648% (16.34–17.77%) |
| g2pk 0.9.4 | AVAILABLE; 2,703/2,703 | 100% | **24.9723% (22.80–27.38%)** | **16.6931% (15.94–17.44%)** |
| KoG2P 2019 | AVAILABLE; 2,703/2,703 | 100% | 14.8724% (12.77–17.10%) | 26.0795% (25.05–27.13%) |
| hangul_to_ipa 2026 | AVAILABLE; 2,703/2,703 | 100% | 14.9464% (12.59–17.18%) | 30.9851% (29.70–32.24%) |
| eSpeak NG / phonemizer | AVAILABLE; 2,703/2,703 | 100% | 8.1391% (6.37–10.19%) | 39.0498% (37.82–40.28%) |
| phonemize 2.0.1 (corrected adapter) | AVAILABLE; 2,703/2,703 | 100% | 20.0518% (17.68–22.58%) | 21.3645% (20.43–22.23%) |

The native score in this exact-head report is 2,655 scored occurrences and 48 abstentions (47 unique unresolved words; 48 occurrence-level abstentions because one unresolved word appears twice). Earlier report snapshots with 2,653 native-scored occurrences are superseded by this exact-head artifact.

### Paired comparison against native

The paired analysis uses the same **2,655 occurrences** for which the native engine returned a scored IPA result. Deltas are candidate minus native. Positive exact-match delta favours the candidate; negative CER delta favours the candidate. Intervals are paired 1,000-replicate row-cluster bootstrap intervals; they do not correct for multiple comparisons or gold-label noise.

| Candidate | Paired exact rate | Exact-rate delta (95% CI) | CER delta (95% CI) | Interpretation on this corpus |
|---|---:|---:|---:|---|
| g2pk 0.9.4 | 25.1977% vs native 24.4068% | **+0.7909 pp (+0.45 to +1.19 pp)** | **−0.3819 pp (−0.61 to −0.21 pp)** | Small positive paired difference; not proof of universal superiority |
| KoG2P 2019 | 15.0282% | −9.3786 pp (−11.53 to −7.37 pp) | +9.0688 pp (+8.16 to +10.04 pp) | Worse under this lossy custom-phone IPA adapter and this reference convention |
| hangul_to_ipa 2026 | 15.1789% | −9.2279 pp (−10.75 to −7.81 pp) | +13.8673 pp (+12.93 to +14.82 pp) | Worse on this corpus; documented process omissions are relevant |
| eSpeak NG / phonemizer | 8.2109% | −16.1959 pp (−18.50 to −14.05 pp) | +21.9324 pp (+20.92 to +22.98 pp) | TTS-oriented output is a weak match to these IPA annotations |
| phonemize 2.0.1 | 20.3013% | −4.1055 pp (−5.20 to −3.09 pp) | +4.1484 pp (+3.40 to +4.89 pp) | Strongest of the other new candidates here, but behind native/g2pk |

“pp” means percentage points. Full-set exact rates use each engine's own coverage. Paired scores compare the same 2,655 occurrences, and paired CER deltas use the same selected reference characters.

### What can and cannot be concluded

- On this particular UGTPHON diagnostic, g2pk 0.9.4 ranks first on exact match and CER, with full coverage. Its paired advantage over native is small; the paired row-cluster interval excludes zero for both metrics.
- ClippyFirst abstains on 48 occurrences rather than silently guessing. Coverage and abstention behaviour are part of the result, not a defect to erase.
- phonemize 2.0.1 is the strongest of the other new external candidates on this set after fixing its adapter, but its 20.0518% exact score and 21.3645% CER do not establish quality on NIKL's normative rules.
- KoG2P's score depends on a documented but lossy custom-phone-to-IPA mapping. A different mapping or reference convention could change its score; this adapter is not claimed to be a canonical conversion.
- The native engine and g2pk comparison share the repository's segment renderer. This is a limitation and could advantage g2pk relative to a fully independent IPA renderer.
- These results do **not** show that ClippyFirst is the best Korean-to-IPA engine, nor that any competitor is best overall. They show that g2pk is modestly ahead under this evaluation contract on this corpus.
- No result here evaluates IPA-to-Ukrainian adaptation. A separate NIKL-grounded, independently adjudicated IPA test set and a separate Ukrainian target-layer review remain necessary.

## Interpretation gates

A higher score on UGTPHON does not establish that an engine is best for NIKL standard pronunciation. Before making that claim, the project still needs:

1. A source-grounded NIKL example set with verified article/example provenance.
2. Independent broad-IPA adjudication for the scored items and explicit accepted variants.
3. Per-rule error strata, especially liaison, coda neutralization, aspiration, fortition, nasal/liquid assimilation, palatalization, 의 variants, N-insertion, morphology-sensitive cases, and lexical exceptions.
4. A second evaluation on held-out examples not used to develop rules or choose exceptions.
5. Separate expert review of IPA-to-Ukrainian adaptation and user-facing readability.
6. Review of the current PR against the independent native-engine case PR #281 before merging; both currently touch the canonical handoff, so do not blindly merge either branch.

## Reproduction

The workflow checks out the exact upstream revisions into the ephemeral runner, checks their declared licenses, installs the pinned packages, downloads the pinned UGTPHON test split, runs adapter tests, emits a JSON report, and uploads the report artifact. External engine code and the raw corpus are not added to the project tree.
