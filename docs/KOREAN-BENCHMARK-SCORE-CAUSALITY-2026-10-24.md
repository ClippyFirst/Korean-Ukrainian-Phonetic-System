# Why Korean G2P benchmark scores look low — evidence review (2026-10-24)

## Status and scope

**DONE_VERIFIED for descriptive occurrence/type, length, source, repetition, edit-distance and symbol-alignment analysis; PARTIAL for independent phonetic adjudication and holdout certification.** This report reconciles the repository's actual scoring contract and pinned results with external research. It does not claim that the engines are 90–95% accurate, nor that the low scores are all measurement artefacts. It separates measured findings, well-supported explanations, and hypotheses requiring a new stratified run.

- Baseline commit: `8144675c6b5496c8b1f3c05b15b085f6b78b4b2b` (`main`, 2026-10-24).
- Benchmark implementation and full paired ledger: [run 40092929978](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978), [artifact 12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692).
- Canonical metrics and scoring contract: [multi-engine benchmark report](MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md).
- The 14 R002/R003 cases remain in [the source-adjudication register](../research/r002-r003-source-adjudication-2026-10-24.json). They are diagnostic cases, not 14 confirmed engine errors or IPA gold.

## Executive finding

The score is a product of at least four things:

1. **The phonological engine:** actual rule coverage, rule ordering, morphology/lexical licensing, and interaction bugs.
2. **The reference:** whether the benchmark's IPA string represents the same accepted pronunciation variant and transcription convention as the engine.
3. **The metric:** exact whole-string match is unforgiving; character error rate (CER) answers a different question.
4. **The domain and adapter:** noisy/social text versus clean lexical words, plus representation conversions and engine-specific scope.

The repository's latest results do not support a universal ranking between ClippyFirst and g2pk. On UGTPHON, their paired exact-match rates differ by only 0.1506 percentage points and the paired CER interval crosses zero; on the SIGMORPHON public paired file, ClippyFirst leads exact match by 0.4012 percentage points. The headline scores should therefore be read as **diagnostic performance against these particular references**, not as a direct estimate of normative Korean pronunciation accuracy.

## 1. First reconcile the numbers: 24% and 53% are not a clean before/after accuracy gain

The earlier normalization profile reported native UGTPHON exact match of 24.4068% and CER 17.0648%; the revised broad-IPA profile reports 53.1827% exact match and CER 9.1883%. The benchmark report explicitly says the profile revision materially changes the scores. The revised normalization canonicalizes Unicode, maps `g` to IPA `ɡ`, removes tie bars, spaces/periods and selected narrow diacritics (including retraction U+0320), while retaining distinctions such as vowel length, aspiration, fortis and unreleased stops.

**Interpretation:** the 24% and 53% figures are not comparable as if the engine simply doubled its accuracy. The evaluation contract changed. The correct historical comparisons are within the same normalization profile and pinned dataset. The newer profile is more forgiving of selected transcription differences, but deliberately still penalizes other phonetic distinctions.

Acceptance requirement: every published comparison must print the normalization-profile identifier/version; score changes after a normalization change must be reported as a metric-definition change, not as an engine improvement.

## 2. What the current numbers actually say

### UGTPHON Korean test split

- 275 sentence rows; 2,703 eligible token occurrences; 1,907 unique Hangul canonical forms.
- Native: 2,655/2,703 scored (98.2242% coverage), 1,412 exact (53.1827%), CER 9.1883%; 48 occurrences abstained.
- g2pk 0.9.4 + the project IPA renderer: 2,703/2,703 scored; 1,416 exact on the shared 2,655-item subset (53.3333%), CER 9.2414% on that subset.
- Paired exact delta, g2pk minus native: +0.1506 percentage points (95% row-cluster CI +0.0351 to +0.3243 pp).
- Paired CER delta: +0.0531 pp (95% CI −0.0139 to +0.1302 pp), which crosses zero.

The difference between the engines is tiny on the paired exact metric. It is not evidence that g2pk is broadly superior. The four g2pk-only exact occurrences are all repeated instances of `없는`: the native output preserves a source-backed long vowel, while the corpus reference omits the length mark. Do not remove a documented contrast just to increase a benchmark score.

### SIGMORPHON 2021 public paired lexical file

- 999 eligible word/IPA pairs after one standalone archaic-jamo row is excluded by the engine's input contract.
- Native: 357/997 exact on the common scored subset (35.8074%), CER 14.7037%.
- g2pk + project renderer: 353/997 exact on the same subset (35.4062%), CER 14.8222%.
- Paired exact delta for g2pk: −0.4012 pp (95% CI −0.8024 to −0.1003 pp); paired CER difference crosses zero.

This is a public paired-file diagnostic, not a reproduction of the hidden-label SIGMORPHON shared-task leaderboard: the pinned public file contains labels despite the upstream README describing the shared-task test inputs as word-only.

### The low coverage hypothesis does not explain the low exact rate

Native abstentions account for 48/2,703 UGTPHON occurrences (1.78%). They matter for coverage and must remain visible, but cannot by themselves explain why only 53.18% of the 2,655 scored items are exact. Most of the exact-match gap is among outputs that the engine did produce. The next audit must classify those scored mismatches instead of focusing exclusively on abstentions.

## 3. Why published 90–99% figures do not contradict our 35–53%

A Korean rule-based G2P paper by Yoon and Brew (2006) reports that three native Korean judges considered 91.17% of sampled word types to have acceptable pronunciations, corresponding to 99.63% grapheme-token correctness. That is not the same metric as exact equality of every IPA character in a word. Their evaluation used a large clean Korean Newswire word list and human acceptability judgments.

A later dynamic-context rule-extraction paper reports 99.22% and 99.11% **phoneme-level accuracy** for its own speech-database evaluation. Again, phoneme-level accuracy does not mean 99% exact whole-word IPA strings, and the dataset, transcription convention, system and scoring unit differ.

The current repository uses whole-token exact string match and CER against IPA references. One differing phone, a retained length mark, an aspiration/fortis symbol, a syllable/segment convention, or a reference variant can make an entire token non-exact. A system can therefore have a moderate exact-match rate and a much lower CER simultaneously.

**Do not compare these percentages without aligning** (a) corpus and domain, (b) reference convention, (c) word/phone/character scoring unit, (d) treatment of accepted variants, and (e) abstention policy.

Sources:
- Yoon & Brew (2006), *A linguistically motivated approach to grapheme-to-phoneme conversion for Korean*, *Computer Speech & Language* 20(3):357–381, DOI [10.1016/j.csl.2005.03.002](https://doi.org/10.1016/j.csl.2005.03.002). Abstract/summary: https://www.sciencedirect.com/science/article/abs/pii/S0885230805000239
- Lee & Lee (2009), *A data-driven grapheme-to-phoneme conversion method using dynamic contextual converting rules for Korean TTS systems*, DOI [10.1016/j.csl.2009.01.001](https://doi.org/10.1016/j.csl.2009.01.001). https://www.sciencedirect.com/science/article/abs/pii/S0885230809000023
- Jeon et al. (2026), *Phonemizing User-Generated Text: A Benchmark, Taxonomy, and Compositional Approach*, Findings of EMNLP 2026, [arXiv:2609.27205](https://arxiv.org/abs/2609.27205), [UGTPHON repository](https://github.com/naver-ai/UGTPHON).

## 4. Strong evidence for reference/convention mismatch

UGTPHON is designed for noisy user-generated text. Its Korean subset combines MultiLexNorm++ and online-community text; canonical forms are mapped to IPA-Dict entries, checked by native-speaker annotators, and manually transcribed when not covered. The dataset authors explicitly note that Korean phoneme annotations have lower inter-annotator agreement because IPA transcription conventions vary more for Korean. This is direct evidence that a strict string comparison can penalize convention differences even when a predicted pronunciation is defensible.

That caveat does **not** mean every reference is wrong. The correct response is item-level adjudication, not dismissing the benchmark.

The repository already has a concrete reference discrepancy: four `없는` occurrences omit vowel length present in the source-backed native entry. That small example demonstrates the mechanism; it does not establish that all remaining errors are annotation noise.

Other convention/representation risks:
- g2pk is output as Hangul and then converted by the ClippyFirst segment renderer; native and g2pk therefore do not have fully independent IPA-rendering stacks.
- KoG2P's custom phone labels require a project-side, explicitly lossy label-to-IPA map.
- eSpeak NG is a TTS-oriented phonemizer, not a normative IPA transcription authority.
- `hangul_to_ipa` documents scope omissions for some morphology-sensitive processes, including N-insertion and liquid tensification.
- The benchmark normalizer strips selected narrow marks but preserves some distinctions. Neither policy is universally correct; it must be matched to the gold convention.

Source: UGTPHON README and paper, https://github.com/naver-ai/UGTPHON and https://arxiv.org/abs/2609.27205.

## 5. Real engine errors exist, and the paired ledger identifies several

The following are not mere score-format effects:

- **R002 coda ㅇ loss:** the native liaison branch could turn coda ㅇ /ŋ/ into the following silent onset ㅇ and lose /ŋ/. PR #298 fixed the state transition and added regression cases such as 공인, 양아치, 동요 and 동이.
- **Broad IPA yod retention:** native output retained an extra /j/ after ㅈ/ㅉ/ㅊ before ㅕ, contrary to the NIKL Standard Pronunciation Rule 5 exception 1. PR #299 fixed this in broad surface IPA while preserving phonemic-mode distinctions; the paired audit found 13 such exact-match mismatches before the fix.
- **R010 morphology-conditioned fortition:** the native engine lacked exact-form licenses for 닮다 and 넘게. Source-backed full-form licenses fixed two exact matches without adding an unrestricted morphology heuristic.
- **Morphology-dependent abstentions:** 48 UGTPHON occurrences remain abstained across 47 unique words. R002 has 25 context labels, R003 has 20; labels can overlap, so these are context labels, not mutually exclusive item counts. Another engine's output alone cannot establish the correct morpheme boundary or rule application.

These findings show both real implementation defects and conservative coverage limits. The 14-case register captures a small, prioritized subset of the R002/R003 abstentions; it is not representative of every scored mismatch.

## 6. Correlations: what is measured, and what is still only a hypothesis

### Measured relationships

| Relationship | Evidence | Interpretation |
|---|---|---|
| Normalization profile ↔ exact score | Same repository reported 24.41% under the earlier profile and 53.18% under revised broad-IPA profile; the report says the profile change materially alters scores. | A major part of the apparent historical gain is metric-contract change, not a clean code-only gain. |
| Engine family/adapter ↔ score | On revised UGTPHON, native/g2pk are about 53%; phonemize 42.55%; KoG2P 27.30%; hangul_to_ipa 16.24%; eSpeak 8.14%. | Representation conventions, rule scope and adapter loss strongly affect these scores. This is association, not proof of a single causal factor per engine. |
| Dataset ↔ exact score | Native is 53.18% on UGTPHON and 35.81% on the SIGMORPHON public paired file, with different CER (9.19% vs 14.70%). | Dataset/domain/reference differences matter. Two datasets are insufficient to estimate a general domain effect. |
| Exact match ↔ CER | Native UGTPHON has 53.18% exact but 9.19% CER; SIGMORPHON has 35.81% exact but 14.70% CER. | Many non-exact tokens appear to have localized differences rather than wholly unrelated strings, but the per-token edit-distance distribution must be computed before quantifying this. |
| Abstention ↔ exact score | 48/2,703 occurrences abstain, but only 1.78% of all eligible occurrences. | Abstentions do not explain the much larger error share among scored items. |
| Repeated lexical item ↔ apparent paired delta | All four g2pk-only exact UGTPHON occurrences are repeated `없는`. | Occurrence-weighted scoring lets a single repeated item affect the aggregate; report both occurrence-weighted and unique-type results. |
| Morphology/interaction ↔ error risk | Actual defects and unresolved cases cluster around liaison, ㅎ-deletion, fortition, and rule/morpheme boundaries. Published Korean G2P research also identifies rule ordering, prosodic boundaries, lexical frequency and register as important. | Strongly motivated stratification target, but a full per-rule correlation is not yet measured across all mismatches. |

### Literature-grounded mechanism

Mun, Kim & Ko (2022) evaluated g2pk and KoG2P by phonological phenomenon and proposed that binary rule application misses gradient variation and prosodic boundaries; they identify factors including lexical frequency and speech register. Their study also treats rule ordering and phenomena such as ㅎ-deletion, 의 variation and place assimilation as distinct sources of error. This supports a hypothesis that a word-level rule engine without a full morphology/prosody layer will show concentrated errors at morpheme boundaries and interactions. It does not prove that each ClippyFirst error has that cause.

Paper: [KCI record](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002922160), DOI [10.29403/LI.26.2.2](https://doi.org/10.29403/LI.26.2.2).

## 7. The correlation analysis still needed to answer the question rigorously

The current summary tables do not contain sufficient per-item explanatory labels to calculate all requested correlations. The next benchmark iteration should extend the existing occurrence-level ledger, not create a second competing harness.

For every eligible occurrence, retain:
- dataset/source and sentence-row ID;
- canonical token, unique-type ID, occurrence frequency, and normalized IPA reference variant(s);
- native status (scored/abstained/error), predicted IPA, raw and normalized prediction, edit distance, CER contribution and exactness;
- engine/adapter and normalization-profile version;
- gold/source adjudication status and accepted pronunciation variants;
- source-backed phonological rule tags, morphology boundary status, rule-interaction tags, lexical exception status and prosodic-context availability;
- prediction length and reference length.

Then compute, without leaking the holdout into rule tuning:
1. exact match and CER by source (MultiLexNorm++ vs DC Inside), unique type vs occurrence, word length, and reference-variant count;
2. error/abstention rates by R002/R003/R004/R007/R010 and interactions, using gold rule labels rather than inferred labels from the predicted output;
3. edit-distance histogram and mismatch classes (length mark, aspiration, fortis, place, segment insertion/deletion, syllabification, rule ordering, unsupported/uncertain morphology);
4. paired per-item win/tie/loss matrix for native vs each engine and bootstrap intervals clustered by sentence row and, separately, lexical type;
5. reference adjudication rate: how many disagreements are accepted variants, convention mismatches, actual engine errors, or unresolved;
6. an independently adjudicated, frozen NIKL holdout with no tuning after results are viewed.

Do not fit a large correlation model to 275 sentence rows / 2,703 occurrences before these labels exist. Occurrences within a row and repeated lexical forms are dependent; use clustered intervals and avoid treating every occurrence as an independent sample.

## 7.1 Re-analysis of the full occurrence-level artifact

After downloading and inspecting the complete [pinned benchmark artifact 12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692), I computed descriptive strata from all 2,703 native-vs-g2pk occurrences. The reproducible analysis is now in `scripts/analyze_korean_benchmark_correlations.py`; it consumes the report JSON from the artifact and does not require or commit the raw corpus. The figures below are diagnostics against the selected corpus references, not normative pronunciation accuracy.

### A. The exact-match difference is concentrated in one repeated word

On the **2,655 occurrences scored by both systems**:

- Native: 1,412 exact; g2pk: 1,416 exact.
- Paired exact outcomes: **g2pk wins 4 occurrences, native wins 0, ties 2,651**.
- All four g2pk exact wins are the same lexical form, `없는`, repeated four times. The corpus reference omits vowel length that the source-backed native form preserves.
- The 1,860 unique lexical types in the paired set have macro type exact rates of 49.839% native and 49.892% g2pk (difference +0.0538 pp); only one type favors g2pk, none favors native, and 1,859 tie.
- A lexical-type cluster bootstrap sensitivity analysis gives a 95% interval of 0.00 to +0.4726 pp for the occurrence-weighted g2pk-minus-native exact-rate delta. Unlike the row-cluster interval, this interval includes zero. It is a sensitivity analysis, not a definitive two-way clustered interval.

If the four `없는` occurrences are removed **only as a sensitivity check**, the exact counts become 1,412 vs 1,412. Native has 2,072 total edits versus g2pk's 2,088 on the remaining 2,651 occurrences. This does not authorize changing production output to match the reference; it shows the headline exact-match lead is driven by one repeated reference-convention discrepancy.

**Important correction to the earlier interpretation:** the row-cluster bootstrap treats occurrences in separate rows as separate clusters even when they are the same lexical type. The reported positive row-cluster exact-match interval should not be read as robust evidence of a general g2pk advantage. Report row-cluster and lexical-type sensitivity together until a defensible multiway dependence treatment is implemented.

### B. Longer words are much less likely to be an exact string match

Rates below use the common paired subset and group the input by number of precomposed Hangul syllable blocks:

| Hangul blocks in token | Paired occurrences | Native exact | g2pk exact |
|---|---:|---:|---:|
| 1–2 | 1,108 | 61.91% | 62.27% |
| 3 | 724 | 53.18% | 53.18% |
| 4+ | 823 | 41.43% | 41.43% |

A similar pattern appears when grouped by normalized IPA reference length:

| Normalized reference length | Paired occurrences | Native exact | g2pk exact |
|---|---:|---:|---:|
| ≤5 characters | 688 | 71.22% | 71.80% |
| 6–7 characters | 630 | 59.68% | 59.68% |
| 8+ characters | 1,337 | 40.84% | 40.84% |

This is the clearest measured association in the current artifact: exact whole-token matching falls as the sequence gets longer. Longer forms have more opportunities for a single symbol-level difference, and may also contain more phonological interactions or morphology boundaries. The aggregate cross-tab cannot distinguish those mechanisms; it is not evidence that length itself causes errors.

### C. Most mismatches are small edit-distance differences

Among the 1,243 native non-exact outputs in the paired set, 707 (56.88%) are exactly one edit away from the selected reference, and 1,044 (83.99%) are at most two edits away. For g2pk, 695/1,239 (56.09%) non-exact outputs are one edit away and 1,031/1,239 (83.21%) are at most two edits away.

This supports a precise reading of the metrics: the engines fail exact whole-token IPA equality often, but most failures are not long arbitrary strings. They are often one- or two-character/segment differences. A single IPA character can encode a real contrast, so this does **not** mean the errors are harmless; the next step is to classify edits as genuine phonology, transcription convention, syllabification, or reference error.

### D. Source and test-set repetition are associated with different rates, but do not prove causation

| UGTPHON source | Paired occurrences | Native exact | g2pk exact | Paired exact wins |
|---|---:|---:|---:|---|
| MultiLexNorm++ | 784 | 55.36% | 55.36% | 0 vs 0 |
| DC Inside | 1,871 | 52.27% | 52.49% | 4 g2pk, 0 native |

The MultiLexNorm++ slice has a 3.09 pp higher native exact rate than the DC Inside slice, but source, word length, repetition and vocabulary are not controlled. The entire paired g2pk exact advantage again comes from the four `없는` occurrences in the DC Inside slice.

By **frequency within this test file** (not external Korean lexical frequency), native exact rate is 48.33% for single-occurrence types (1,612 scored occurrences), 59.29% for types appearing 2–3 times (452), and 61.76% for types appearing 4+ times (591). The 4+ group contains only 61 distinct types and receives much more occurrence weight; it includes the repeated `없는` discrepancy. This is evidence that occurrence-weighted metrics can be influenced by the composition/repetition of this small test set, not proof that common Korean words are generally easier.

### E. The most common character differences point to a broad-vs-narrow IPA convention mismatch

I also aligned normalized reference and native IPA strings with a deterministic minimum-edit alignment. This is a **symbol-level diagnostic**, not a phonological error classifier; where multiple optimal alignments exist, the individual operation labels can vary.

Among the 1,243 non-exact native occurrences, the most frequent aligned substitutions were:

| Reference symbol → native symbol | Count | Plausible issue to adjudicate |
|---|---:|---|
| `ɭ → l` | 525 | Coda-lateral symbol convention / degree of phonetic detail |
| `ʰ → s` | 194 | IPA-Dict's sibilant transcription convention versus the engine's broad representation |
| `ɦ → h` | 165 | Contextual allophone of Korean /h/ versus broad /h/ |
| `ɲ → n` | 73 | Palatal nasal versus `n+j` sequence |
| `ç → h` | 40 | Contextual realization of /h/ |
| `i → y` | 36 | Vowel/glide representation |
| `ʎ → l` | 33 | Palatalized lateral versus broad lateral |
| `ɕ → s` | 30 | Palatalized sibilant versus broad /s/ |

In the same alignment, the reference symbols most often involved in any substitution/deletion operation were `ʰ` (633), `ɭ` (539), `ɕ` (238), `ɦ` (165), `ɲ` (78), and `ç` (60). Other observed reference-only marks included stress `ˈ` (14) and length `ː` (10 deletions, with additional substitutions); the engine-only unreleased-stop mark `̚` was inserted 29 times.

This profile strongly suggests that a large share of exact-match failures involve the reference's narrow/allophonic choices versus the project's broad IPA output, not only missing phonological rules. For example, `돈을` aligns as reference `to̞nɯɭ` versus output `tonɯl`, and `수` as `sʰu` versus `su`. Those differences still need linguistic adjudication: broad-vs-narrow convention is a plausible explanation, not permission to call every symbol difference harmless. The acceptance protocol must decide which allophones and diacritics the target IPA layer promises to preserve.

The analysis script now reports the same alignment profiles in its JSON output under `symbol_error_profile`, with a warning that alignment operations are not gold error labels.

### F. What the artifact still cannot tell us

The full artifact supports source, length, test-frequency, and edit-distance strata. It does not provide independently reviewed rule/morpheme labels for every scored mismatch. Therefore it cannot yet establish that R002, R003, fortition, ㅎ deletion, or any other rule statistically explains the remaining 1,200+ mismatches. The 14-case R002/R003 queue is a selected adjudication queue, not a random sample and not gold.

Run the new analysis locally after extracting `multi-engine-ipa-report.json` from artifact 12559692692:

```bash
python scripts/analyze_korean_benchmark_correlations.py --input multi-engine-ipa-report.json --output korean-benchmark-correlation-summary.json
```

## 8. Practical conclusions and acceptance gates

- **Do not set a 90–95% target against the current raw exact-string metric and assume the engine is deficient by 40 points.** First define a defensible, independently adjudicated IPA convention and report exact match, phoneme error rate/edit distance, CER, coverage and accepted variants separately.
- **Do not use the published 99% phoneme-level numbers as a direct benchmark target** until the task, data, scoring unit and IPA conventions are matched.
- **Keep the two tasks separate:** Korean pronunciation → broad IPA; then reviewed IPA → Ukrainian practical transcription. The current external benchmark scores only the first task.
- **Preserve fail-closed behaviour.** Do not turn the 48 abstentions into guesses just to improve coverage.
- **Do not optimize on the 14-case register and then report it as holdout performance.** Adjudicate it as development data; create a new frozen holdout afterward.
- **Release status:** research-ready for diagnostics, still a partial prototype and not release-ready. Normative accuracy, independent IPA adjudication, and Ukrainian target accuracy remain unverified.

## Task ledger

| Task | Status | Acceptance criterion |
|---|---|---|
| Reconcile historical vs revised scores | DONE_VERIFIED | Reports show the profile change and same-profile comparisons only. |
| Summarize current native/g2pk paired results | DONE_VERIFIED | Uses pinned run 40092929978 and occurrence-level artifact. |
| Cross-check why published 90–99% figures are not comparable | DONE_VERIFIED | Primary paper records and scoring units documented. |
| Explain measured convention and adapter confounds | DONE_VERIFIED | Explicitly documented; no blanket dismissal of references. |
| Aggregate item-level stratification (source, length, test repetition, edit distance, lexical-type sensitivity) | DONE_VERIFIED | Reproducible analysis script and inspected full occurrence-level artifact; descriptive results are recorded in §7.1. |
| Rule × morphology × interaction correlation analysis | TODO / evidence-limited | Requires independently reviewed rule, morpheme-boundary and reference-adjudication labels for scored mismatches. |
| Independently adjudicate remaining scored mismatches and 14 R002/R003 forms | BLOCKED_SPECIALIST_ADJUDICATION | Exact source evidence, two independent IPA reviews, reconciliation and accepted variants. |
| Frozen NIKL normative holdout | TODO / dependency-blocked | Independent source-backed gold, split locked before tuning, full per-rule report. |
| Korean IPA → Ukrainian target evaluation | BLOCKED | Separate expert-reviewed Ukrainian gold corpus and fixed IPA inputs. |


### Small descriptive cross-tab from the 14-case R002/R003 triage queue

The existing 14-case queue has seven R002 and seven R003 cases. Against the **noisy corpus reference only**, g2pk is marked exact on 4/7 R002 cases and 3/7 R003 cases (7/14 overall). Exact-form official surface evidence has been found for three cases (`멋있어`, `수많은`, `싫어서)); four more have related component/rule evidence (`되었어`, `붙어야`, `쌓아서`, `좋은데`); seven have no source evidence recorded in this search pass. All 14 still lack independently adjudicated broad-IPA gold.

This is **not** a valid estimate of R002-vs-R003 accuracy: the 14 cases are a deliberately selected diagnostic queue, the reference is not normative gold, and source discovery status is not a correctness label. The small split does not show a meaningful rule-level correlation. It does show why raw engine/reference exactness cannot settle the cases: the official source confirms variants or surface forms in some cases, but the IPA representation and morphology still need independent review.


## Versioned IPA contract and holdout gate (2026-10-24)

The previous report's analysis-only work is now paired with a versioned output/scoring contract: [IPA transcription contract](IPA-TRANSCRIPTION-CONTRACT-2026-10-24.md). The correlation script emits immutable `legacy-broad-diagnostic-v0` metrics and candidate `clippyfirst-broad-v1` sensitivity metrics. The broad profile collapses `ɭ/l`, `ʎ/l`, `ɲ/n`, `ɦ/h`, `ç/h`, standalone `ɕ/s`, and sibilant `sʰ/s`; it preserves `tɕ` affricates, stop aspiration, fortisness, vowel length, coda unreleased marks and `i/y`. Recomputed on pinned artifact 12567083852, broad-v1 exact rates remain 91.0358% native and 90.9605% g2pk, while CER is 1.6847% and 1.7303% respectively. These remain sensitivity results, not validated accuracy.

A 24-item NIKL input manifest is frozen at `data/korean/ipa_holdout_2026-10-24.json`; fourteen rule-page examples that overlapped existing regression data were replaced with exact-form readings from official NIKL Online Q&A sources. It has no engine outputs and no IPA gold. External exact-token overlap against artifact 12567083852 is verified at 0/24. [The validator](../scripts/validate_ipa_holdout.py) checks local runtime/fixture leakage; exact-head CI for the revised set remains pending, so this is not yet a certified independent scored holdout. The 14 R002/R003 source-adjudication cases remain at 0/14 independent IPA gold.

See [discrepancy adjudication and holdout report](IPA-DISCREPANCY-ADJUDICATION-AND-HOLDOUT-2026-10-24.md) for acceptance gates and primary-source references.


## 8. Actual broad-v1 sensitivity result on the pinned artifact

I downloaded and inspected the pinned artifact `12559692692` from run `40092929978`. Its report JSON SHA-256 is `448c23993032e7a30a7f2cff716a9b048bf856481e1cc839c734c3de9b5f082f`. On the **same 2,655 paired scored occurrences** (48 native abstentions excluded from both paired scores), the candidate profile changes the result substantially:

| Engine | Legacy exact match | Candidate broad-v1 exact match | Legacy CER | Candidate broad-v1 CER |
|---|---:|---:|---:|---:|
| ClippyFirst native | 1,412/2,655 = 53.18% | 2,417/2,655 = **91.04%** | 9.19% | **1.6847%** |
| g2pk 0.9.4 | 1,416/2,655 = 53.33% | 2,415/2,655 = **90.96%** | 9.24% | **1.7303%** |

This is the strongest direct evidence so far that the original 53% exact-match score was heavily confounded by transcription convention. But 91% is **not yet an independent accuracy estimate**: the profile was chosen after inspecting mismatch patterns and still needs independent Korean IPA review.

### Which mappings drive the jump?

The ablation was run on the same 2,655 paired rows:

| Candidate normalization stage | Native exact match | g2pk exact match |
|---|---:|---:|
| Legacy profile | 53.18% | 53.33% |
| Collapse `ɭ→l` | 63.43% | 63.43% |
| Plus `ʎ→l` | 64.37% | 64.37% |
| Plus `ɲ→n` | 65.95% | 65.95% |
| Plus `ɦ→h` | 69.98% | 69.98% |
| Plus `ç→h` | 71.30% | 71.30% |
| Plus `ɕ→s` only | 71.86% | 71.86% |
| Plus collapse of sibilant `sʰ→s` | **91.04%** | **90.96%** |

The sibilant-aspiration convention is by far the largest individual driver. This is plausible because Korean sibilant aspiration/palatalization is often represented explicitly in phonetic transcription but omitted in broad phonological transcription. Nevertheless, the exact 20-point increase from the `sʰ` collapse makes it the highest-priority decision for independent reviewers. The profile preserves aspiration on stops/affricates, fortisness, length, and the coda unreleased mark.

A lexical-type cluster bootstrap (10,000 replicates; 1,860 types) gives a g2pk-minus-native exact-match delta of +0.15 percentage points under legacy with 95% interval [0.00, 0.47], and −0.08 points under broad-v1 with interval [−0.47, 0.37]. The broad-v1 interval includes zero, so the two engines are not meaningfully separated by exact match on this sample. The legacy apparent g2pk advantage is sensitive to the repeated lexical type `없는`.

The machine-readable aggregate is [`research/broad-ipa-profile-sensitivity-2026-10-24.json`](../research/broad-ipa-profile-sensitivity-2026-10-24.json). The executable analyzer now emits both profiles' exact match/CER and symbol-alignment profiles for each profile. These metrics should not be presented as “91% validated accuracy” until annotation and adjudication are complete.

### Residual differences after broad-v1

The native output still has 238 non-exact paired occurrences. The most frequent remaining aligned substitutions include `i→y` (37), `β→h` (29), `x→ʰ` (24), `h→ʰ` (20), and `ʝ→h` (19). Reference-only symbols include `ɥ` (36), stress `ˈ` (14), fortis mark `͈` (12), and length `ː` (10); engine-only coda unreleased marks `̚` occur 29 times. Do not normalize these automatically: inspect each context, particularly `i/y`, stress, length and consonant-symbol differences. The same deterministic alignment caveat applies; these are prioritization counts, not adjudicated error labels.

## 9. Holdout exact-token overlap check

The revised 24-item NIKL holdout manifest was checked against the exact token field in all 2,703 occurrence rows of artifact 12567083852 (1,907 unique Hangul tokens). **Exact input overlap: 0/24.** Fourteen rule-page examples were replaced with unused, exact-form readings from official NIKL Online Q&A sources after the full repository scan exposed contamination. The manifest Git blob SHA is `3a69a915e475f08d0c6aba0c0e52638bcf3d6121`; the pinned check is recorded in [`research/ipa-holdout-overlap-validation-2026-10-24.json`](../research/ipa-holdout-overlap-validation-2026-10-24.json).

This certifies exact-token disjointness from that benchmark artifact only. The holdout still has **0 IPA gold labels** and is not ready for scoring until two independent reviewers annotate and adjudicate it. Repository-hosted CI still needs to confirm the local runtime/fixture leakage validator.
