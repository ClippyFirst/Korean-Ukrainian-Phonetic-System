## Exact-main benchmark checkpoint — 2026-11-08

The path-filtered multi-engine workflow completed successfully on main benchmark code commit `b548436d0fce9af4672fc5902d6670cbc134bd70`: [run 42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896), artifact `13621335293` (SHA-256 `c286d7e4f1ee02d40e1a9977e792eeb73bce12b32b658a8b3c4166c612ccc1a8`). The run contains the 10-engine UGTPHON and SIGMORPHON reports, per-occurrence mismatch ledger, unresolved review queue, three Browser Kozak Kim mode reports, Native/Browser parity report, and readiness audit. This is the current-main benchmark code snapshot; later documentation-only main commit(s) do not change the measured runtime.

### Ten-engine Strict IPA results

| Engine | UGTPHON exact | UGTPHON CER | SIGMORPHON exact | SIGMORPHON CER |
|---|---:|---:|---:|---:|
| ClippyFirst Native | 52.7387% (1,425/2,702) | 9.0130% | 35.9719% (359/998) | 14.5347% |
| g2pK 0.9.4 | 53.0892% (1,435/2,703) | 9.2328% | 35.3353% (353/999) | 14.8222% |
| g2p-ko 1.0.0 | 52.4602% (1,418/2,703) | 9.3928% | 35.6356% (356/999) | 14.6970% |
| KoG2Padvanced 2022 | 47.3178% (1,279/2,703) | 10.6815% | 32.6326% (326/999) | 15.8237% |
| phonemize 2.0.1 | 42.5453% (1,150/2,703) | 14.3531% | 28.9289% (289/999) | 17.4387% |
| KoG2P 2019 | 27.3030% (738/2,703) | 19.5122% | 18.7187% (187/999) | 21.8327% |
| kokorog2p 0.9.15 | 18.3130% (495/2,703) | 26.5352% | 9.6096% (96/999) | 30.7336% |
| HAMA 1.7.0 | 16.9071% (457/2,703) | 25.1081% | 12.7127% (127/999) | 27.6164% |
| hangul_to_ipa 2026 | 16.2412% (439/2,703) | 24.8054% | 8.9089% (89/999) | 29.8448% |
| eSpeak NG Korean | 8.1391% (220/2,703) | 33.6101% | 4.3043% (43/999) | 40.7236% |

The Native path abstained on one eligible occurrence in each dataset (2,702/2,703 UGTPHON; 998/999 SIGMORPHON); all other engines scored all eligible occurrences. On UGTPHON, g2pK has a marginally higher scored-only Exact rate, while Native has lower CER. On SIGMORPHON, Native leads both Exact and CER. This is not a universal winner claim. Broad-profile sensitivity results are separately recorded in the README and full artifact; the profile is research-only and deliberately lossy.

### Three Browser Kozak Kim modes — same 2,703 UGTPHON occurrences

| Mode | IPA profile | Source-resolved scored | Coverage | Exact (scored-only) | Coverage-adjusted Exact | CER | Heuristic rows | Typed fallback rows |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Strict | clippyfirst-korean-broad-v1 | 2,702 | 99.963% | 52.7387% | 52.7192% | 9.0130% | 0 | 0 |
| Soft | browser-legacy-contextual-v1 | 2,423 | 89.641% | 54.7668% | 49.0936% | 7.8785% | 280 | 0 |
| Super-soft | browser-super-soft-maximum-coverage-v1 | 2,239 | 82.834% | 56.1858% | 46.5409% | 7.8191% | 464 | 0 |

Important interpretation: these are three separate runtime policies and three different IPA profile IDs. The Soft/Super-soft scored-only Exact and CER are calculated only on their source-resolved rows; their coverage-adjusted Exact makes the abstention/heuristic trade-off visible. Soft and Super-soft's higher scored-only Exact must not be read as accuracy improvement: they score fewer source-resolved rows and have 280/464 heuristic rows, respectively. No typed fallback was emitted in this particular UGTPHON run. The earlier morphology-consensus Soft result (100% coverage on its separate harness) is a different benchmark protocol and must not be substituted for this Browser mode-specific report.

### Native/Browser parity

The exact-head parity report matched all 2,703 occurrence identities and all 2,703 surface-Hangul outputs. On the 2,702 resolved occurrences, raw IPA and broad IPA matched 2,702/2,702 (100%); coverage/abstention states also matched. Both sides declared `clippyfirst-korean-broad-v1`, version 1, with the same profile contract. This establishes measured parity for the strict configuration on this dataset, not universal parity across every rule/input or the Soft/Super-soft modes.

### Seoul Corpus: third executable dataset and word-surface benchmark

The OpenSLR SLR113 label archive was downloaded in CI and parsed without downloading audio. Archive SHA-256: `63c3f8ffa6976307a732689d6c5be7b2db4ec20f14bf276faf98c886add0d24b`. The archive is licensed CC BY-NC 2.0; no corpus labels or audio are committed or included in the benchmark artifact.

- 240/240 TextGrid files parsed; 1,680 interval tiers and 2,671,221 interval annotations.
- Tier inventory: 480 `pWord.ortho.`, 480 `pWord.prono.`, 240 `phoneme`, 240 `utt.ortho.`, and 240 `utt.prono.` tiers. Duplicate tier names are preserved and paired by occurrence order.
- 604,576 paired word-tier interval slots; 604,564 have matching start/end boundaries within 0.1 ms. The 12 boundary mismatches are excluded.
- **231,626 aligned Hangul-only orthography→pronunciation word occurrences**, 54,868 unique source/reference pairs and 37,749 unique source forms.
- Audio was not used. This is a Hangul surface-pronunciation benchmark, not IPA Exact/CER and not Ukrainian target validation.

| Kozak Kim mode | Source-resolved scored | Coverage | Exact scored-only | Exact coverage-adjusted | CER scored-only | Heuristic | Typed fallback | Unresolved |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Strict | 224,764 / 231,626 | 97.0375% | 57.1537% | 55.4605% | 24.5421% | 0 | 0 | 6,862 |
| Soft | 201,516 / 231,626 | 87.0006% | 56.2055% | 48.8991% | 26.3641% | 26,057 | 0 | 4,053 |
| Super-soft | 193,390 / 231,626 | 83.4924% | 56.8509% | 47.4662% | 26.3118% | 38,207 | 29 | 0 |

Paired mode deltas on common source-resolved occurrences:
- Strict vs Soft: 201,516 common; 8,031 outputs changed; Strict had 778 exact wins, Soft had 0.
- Strict vs Super-soft: 193,390 common; 7,553 outputs changed; Strict had 771 exact wins, Super-soft had 0.
- Soft vs Super-soft: 193,390 common; **zero output changes**. Super-soft changes status/fallback classification, not the source-resolved surface predictions in this common set.

Interpretation: Strict has the best coverage-adjusted Exact and the lowest CER on this corpus. Soft and Super-soft do not improve Exact on the common scored subsets; they introduce heuristic/fallback strata and lower source-resolved coverage. The corpus is spontaneous speech and its transcription conventions differ from the project’s rule-based canonical profile, so these are diagnostic results—not an independently adjudicated universal accuracy claim. Do not tune rules on this corpus and then call it a sealed holdout.

#### Phonemic IPA benchmark from the `phoneme` tier

The primary annotation paper documents the phoneme inventory and IPA correspondence in Table 3 (Yun et al., 2015, DOI `10.13064/KSSS.2015.7.2.103`). A versioned adapter, `data/korean/ipa/seoul-corpus-phonemic-ipa-v1.json`, maps all 36 observed phone symbols. It explicitly expands the paper's `ʨ` affricate notation to `tɕ` and its asterisk fortis notation to the IPA combining mark `͈`; non-speech/unmapped labels are excluded rather than guessed.

- 1,134,781 phone intervals map through the 36-symbol adapter.
- 70,660 non-phone or unmapped intervals are excluded; their raw labels are not exported.
- **231,625 word-level IPA pairs** are aligned to the Hangul `pWord.ortho.` tier. Six words with cross-boundary phone intervals and one word containing a non-phone/unmapped label are excluded.
- This is phonemic IPA, not narrow phonetic gold. It does not encode context-conditioned voicing, release detail, speaker-specific variation or every allophonic place change.

| Kozak Kim mode | Source-resolved scored | Coverage | Exact scored-only | Exact coverage-adjusted | CER scored-only | Broad candidate Exact | Broad candidate CER | Heuristic | Typed fallback |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Strict | 224,763 / 231,625 | 97.0375% | 14.1166% | 13.6984% | 39.9210% | 14.1224% | 40.1832% | 0 | 0 |
| Soft | 201,515 / 231,625 | 87.0005% | 14.7969% | 12.8734% | 40.8696% | 14.8034% | 41.1359% | 26,057 | 0 |
| Super-soft | 193,389 / 231,625 | 83.4923% | 15.3788% | 12.8402% | 40.4053% | 15.3856% | 40.6759% | 38,207 | 29 |

Paired comparisons: Strict vs Soft has 201,515 common scored occurrences, 6,481 output changes, 793 Strict exact wins and zero Soft exact wins. Strict vs Super-soft has 193,389 common, 5,837 changes, 788 Strict exact wins and zero Super-soft exact wins. Soft and Super-soft produce identical source-resolved IPA outputs on all 193,389 common occurrences; Super-soft changes only the status/fallback classification there.

Interpretation: Strict has the best coverage-adjusted Exact and lowest CER in this phonemic reference. The higher scored-only Exact of Soft/Super-soft is a selection effect: they score fewer source-resolved occurrences and classify more cases as heuristic. Because this gold is phonemic while the engine profiles retain phonetic/allophonic detail, raw Exact/CER are diagnostic and must not be presented as narrow-IPA acceptance. This benchmark is not Ukrainian target validation.

Evidence: [Seoul preflight, surface and phonemic-IPA benchmark run 42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257), artifact `13623457737`. The artifact contains metadata and aggregate metrics only; raw word/IPA pairs remain temporary CI data.



**Candidate output availability is now reported separately from source-resolved scoring coverage.** It counts non-abstained candidate outputs (including explicitly labelled heuristic and typed fallback) and is not an accuracy metric. On the Hangul surface track, candidate output availability is Strict **224,764/231,626 (97.0375%)**, Soft **227,573/231,626 (98.2502%)**, Super-soft **231,626/231,626 (100%)**. On the phonemic-IPA track it is Strict **224,763/231,625 (97.0375%)**, Soft **227,572/231,625 (98.2502%)**, Super-soft **231,625/231,625 (100%)**. Source-resolved scored coverage remains 97.0375% / 87.0006% / 83.4924% (surface) and 97.0375% / 87.0005% / 83.4923% (IPA) for Strict / Soft / Super-soft. The additional availability comes from heuristic/fallback outputs; it does not change Exact/CER numerators or establish accuracy gains. Unresolved source passthrough is not counted as an available candidate.

### Remaining evidence limits

- The Broad sensitivity profile remains `research-only-unadjudicated`; its feature collapses are documented and are not normative IPA gold.
- UGTPHON has been inspected during project research; SIGMORPHON is a public paired lexical file with transcription-convention and possible training-overlap limitations.
- The two benchmark datasets do not validate Ukrainian target rendering.
- Neural ByT5 and CharsiuG2P jobs were skipped under the existing default-off research policy.
- Seoul Corpus now has two separately scored three-mode tracks (Hangul surface and phonemic IPA) from the CC BY-NC 2.0 TextGrid labels; audio is not used. KsponSpeech and NIKL 2022 remain access/terms-gated and unscored.

Reproduce from [run 42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896), artifact `13621335293`.

---

# Methodology

## Central principle

Korean orthography → Korean phonology → Korean phonological rules → Korean surface IPA → feature space → Ukrainian phonological candidate → Ukrainian phonetics → Ukrainian orthography.

The system must never collapse these layers into a direct character substitution.

## Runtime architecture: two browser engines, one IPA-first target adapter

The public browser service exposes two distinct pronunciation paths. They are not two labels for the same implementation.

| Public mode | Korean surface-pronunciation engine | Role and boundary |
|---|---|---|
| **Звичайний режим** | Locally bundled JavaScript port of g2pK, adapted from `ntdgo/korean-pronunciation 1.0.1` | Practical, high-coverage browser path. It uses the port's heuristic annotation and does not reproduce the original Python g2pK package's MeCab morphological analysis. |
| **Режим докладного аналізу** | The project's own deterministic **Kozak Kim** engine | Evidence-gated research path. It applies this repository's source-licensed phonological rules, exact lexical records, explicit uncertainty states, and inspectable IPA-to-Ukrainian trace. It does not call g2pK. |

Both paths converge on the same architectural boundary: Korean surface spelling → IPA representation → the project's IPA-to-Ukrainian adapter → Ukrainian practical orthography. Neither mode is permitted to generate the Ukrainian output by a parallel Hangul-to-Ukrainian character map.

The browser g2pK port is vendored under `src/vendor/g2pk/`; its application adapter is `src/app/g2pk_web.js`. The pinned port is called with `descriptive: false`, `verbose: false`, `groupVowels: false`, and `toSyl: true`. The port and its browser adaptation are attributed under Apache-2.0 in `public/THIRD_PARTY_NOTICES.txt` and `public/LICENSES/Apache-2.0.txt`. It runs locally in the browser without Python, MeCab, a server, or runtime network requests. A finite exact-form list may correct Korean surface forms only where an identified NIKL source directly supports the correction; raw vendored-port behavior remains separately testable, and corrections are not generalized to unseen words.

The Kozak Kim browser engine is implemented in `src/app/`: `engine.js` is its entry point; `engine_shared.js` handles Hangul structure and shared inventories; `engine_rules_ctx.js` handles within-word contextual rules; `engine_rules_phrase.js` handles a separate, restricted phrase-boundary pass; `engine_lexical.js` supplies exact lexical records; `engine_convert.js` coordinates the conversion; and `engine_ipa.js` owns IPA-to-Ukrainian mapping. The soft-mode policy is isolated in `soft_morphology.js`; Super-soft uncertainty brackets are a presentation annotation over the existing trace, not a change to IPA.

### The three Kozak Kim modes

- **Strict** is the default. It applies canonical correspondences, exact sourced lexical entries, and phonological rules only when the relevant environment is licensed. If the engine cannot establish a morphology-sensitive condition, it abstains or marks the target as unresolved/provisional rather than promoting a guess.
- **Soft** is an opt-in, limited hypothesis layer for a closed set of formal endings inside one Korean eojeol. It can cautiously extend selected formal liaison (R002), ㅎ deletion (R003), and palatalization (R007) patterns. It does not license substantive liaison under NIKL §15, R009/R010–R016, or transformations across whitespace. Such outputs carry low-confidence status.
- **Super-soft** is a separate opt-in maximum-coverage tier in the browser. It combines available Soft hypotheses with wider explicitly low-confidence practical fallbacks and, if needed, a typed orthographic-phonemic IPA fallback. For all 11,172 modern precomposed Hangul syllable blocks, it aims to provide an IPA or typed fallback and a Ukrainian candidate, with source spans accounted for in the trace. Low-confidence/provisional Ukrainian fragments are bracketed individually. Compatibility Jamo, decomposed Jamo, archaic Jamo, punctuation, and other non-syllable content are preserved literally rather than assigned invented pronunciations.

These are three policies within one native engine, not three separate engines. Super-soft's 100% coverage target is a software coverage contract for the defined modern Hangul syllable inventory; it is not a 100% pronunciation-accuracy claim. The browser UI exposes Strict, Soft, and Super-soft. Python CLI/API support is narrower and must not be assumed to have Super-soft parity.

### Mode-specific benchmark contract (three separate Kozak Kim result sets)

The three modes must be documented and benchmarked as separate configurations. They share the same underlying deterministic engine and the same IPA/target boundary, but they have different acceptance policies and therefore different coverage/accuracy trade-offs. Never publish one aggregate “Kozak Kim score” without identifying the mode, IPA profile, corpus revision, denominator, and unresolved/fallback policy.

| Kozak Kim mode | What is evaluated | Existing benchmark evidence | Current evidence status |
|---|---|---|---|
| **Strict** | Canonical/source-licensed IPA only; unresolved cases remain abstentions and are reported as coverage loss, not silently removed from the headline denominator. | The pinned multi-engine UGTPHON and SIGMORPHON diagnostics measure the strict Native path. Latest current-main paired/multi-engine evidence is linked from the [current audit](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md#current-main-continuation--2026-11-08-documentation-and-benchmark-reconciliation). | **MEASURED_DIAGNOSTIC** — current strict scores exist; they are corpus/convention diagnostics, not independent normative IPA gold. |
| **Soft** | The same inputs and gold as Strict, with only the documented closed-set formal-ending hypotheses enabled. Report changed outputs, newly resolved cases, heuristic-rule counts, coverage, Exact, CER, and paired per-occurrence deltas against Strict. | `scripts/benchmark_morphology_ipa_delta.py` implements strict/soft paired scoring on UGTPHON; `.github/workflows/morphology-consensus-diagnostic.yml` runs and archives it alongside morphology diagnostics. | **MEASURED_DIAGNOSTIC on UGTPHON; broader suite PARTIAL** — exact-main run [42487169477](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487169477), artifact `13620331011`, measured Soft at 2,703/2,703 coverage (100%), 1,425 exact (52.7192%), CER 9.0123%. Strict on the same run: 2,702/2,703 coverage (99.9630%), 1,425/2,702 exact (52.7387%), CER 9.0130%. On the 2,702-occurrence paired subset the two modes were identical (Exact delta 0.0000 pp; CER delta 0.0000 pp); Soft resolved one additional occurrence and changed three unique-word outputs/statuses, without improving paired accuracy. This is a UGTPHON diagnostic only; SIGMORPHON and the 236-case cohort still need separate Soft scoring. Analyzer-consensus/boundary-gated counterfactuals are not Soft results. |
| **Super-soft** | Browser-only maximum-coverage tier, scored separately from its IPA fallback type: source-resolved IPA, low-confidence heuristic IPA, typed orthographic-phonemic fallback, and Ukrainian candidate availability must have separate counts. Report exact/CER only for strata with a defensible compatible IPA reference; fallback coverage is not pronunciation accuracy. | Current tests cover the mode's fallback behavior, uncertainty labels/brackets, and the 11,172 modern precomposed Hangul coverage contract. `scripts/benchmark_kozak_kim_browser.mjs` accepts `--mode strict|soft|super-soft`, and the main multi-engine workflow invokes all three on identical UGTPHON occurrences. | **MEASURED_DIAGNOSTIC; not accuracy acceptance** — exact-main run [42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896): 2,239/2,703 source-resolved scored (82.834% coverage), 1,258 exact (56.1858% scored-only; 46.5409% coverage-adjusted), CER 7.8191%; 464 heuristic rows and zero typed fallback rows. This uses `browser-super-soft-maximum-coverage-v1`, not the Strict profile. The 100% inventory coverage target is a separate software contract, not an accuracy result. |

#### Required three-mode benchmark matrix

For every pinned corpus and for the reconstructed 236-candidate Kozak Kim cohort, run Strict, Soft, and Super-soft on the exact same input occurrences and retain a row-level ledger. Publish, per mode:

- attempted, eligible, scored, unresolved, partial, heuristic, fallback, runtime-error and Ukrainian-target-unavailable counts;
- coverage and coverage-adjusted Exact, plus scored-only Exact with its denominator;
- CER with one fixed reference-variant/character denominator across paired modes; report paired per-occurrence Exact wins/losses and CER deltas;
- strict-reference scores and a separately labelled broad-profile sensitivity score, including every lossy normalization operation and feature-loss count;
- for Super-soft, typed-fallback strata and fallback-only coverage separately from source-resolved IPA accuracy;
- mode-to-mode output/status changes, exact occurrence IDs, and source/profile/version hashes.

The 236-case review is not a 236-row gold set. The 15 standard-form dispositions, 181 profile-convention decisions, and 40 source-policy decisions must remain separately stratified. In particular, broad/narrow convention differences must not be auto-labelled as engine errors or erased by blanket diacritic stripping. For each row, use only source-supported broad-profile references; otherwise mark the score as convention-sensitive or unscorable. The 40 source-policy decisions do not create speaker-specific IPA gold.

A valid comparison must include two complementary views: (1) each mode against the same reference and same denominator policy, and (2) paired Strict-vs-Soft-vs-Super-soft changes on the common scored subset. Report coverage separately so a mode cannot improve its score by abstaining, and report fallback strata so Super-soft cannot appear more accurate merely by always producing a candidate.

The existing ten-engine comparison remains a Strict-path diagnostic; it is not a benchmark of all three Kozak Kim modes. The ordinary g2pK path remains a separate external baseline, not a fourth Kozak mode. The IPA-to-Ukrainian target renderer must be evaluated in a separate downstream benchmark with frozen IPA inputs and independent Ukrainian target review.

**Canonical researcher-facing explanation:** [the service methodology page](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#methodology-02c-kozak-kim), with [ordinary-mode g2pK details](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#methodology-02a).

## How to interpret the comparative measurements

The corrected multi-engine run [41138727409](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41138727409), artifact `13018218724`, compares Korean IPA on pinned UGTPHON and SIGMORPHON test data. It does not measure Ukrainian target quality.

| Dataset | Engine | Scored / eligible | Abstentions | Exact match | CER | PER | Feature proxy |
|---|---|---:|---:|---:|---:|---:|---:|
| UGTPHON | ClippyFirst native | 2,698 / 2,703 | 5 | 53.0022% | 9.1697% | 9.6139% | 4.8765% |
| UGTPHON | g2pk 0.9.4 | 2,703 / 2,703 | 0 | 53.0892% | 9.2285% | 9.6472% | 4.8952% |
| SIGMORPHON 2021 | ClippyFirst native | 998 / 999 | 1 | 35.7715% | 14.6978% | 16.2343% | 7.5491% |
| SIGMORPHON 2021 | g2pk 0.9.4 | 999 / 999 | 0 | 35.3353% | 14.8222% | 16.3126% | 7.5990% |

Rates are calculated over each engine's scored predictions; coverage and abstentions are separate. They are not automatically a paired comparison because denominators differ. Exact/CER, PER, and the feature-weighted proxy each select their own closest IPA gold alternative and denominator. PER is a broad-IPA segment metric. The feature-weighted error is a project-defined proxy, not a standardized phonological feature error rate. Latency p95 uses nearest-rank.

These results remain diagnostic rather than normative. UGTPHON includes test-informed material; SIGMORPHON is a public lexical test file with its own transcription convention. The g2pK comparison shares the project's segment-level IPA renderer. The benchmark artifact's occurrence ledgers and aggregate totals were independently checked for ordering, source-identity alignment, and recomputation, but that validates report consistency, not the corpus annotations or linguistic correctness. Neither corpus evaluates the IPA-to-Ukrainian target adapter. The results do not establish a universal winner or prove independent Korean pronunciation accuracy.

## Evidence classes

FACT: directly supported by a cited normative, peer-reviewed or technical source.

MODEL ASSUMPTION: a computational choice required to make the system deterministic.

HEURISTIC: a parameterized engineering approximation, especially candidate-ranking weights.

EMPIRICAL RESULT: a result obtained from corpus/data validation.

UNRESOLVED: a question for which sources support competing analyses or the available evidence is insufficient.

## Candidate ranking

Candidate score is a cost function, not a probability. Feature mismatch weights are model parameters. Context, phonotactics and orthographic legality are separate penalties so a reviewer can inspect why a candidate ranked where it did.

## Generated vs observed sets

The 11,172 Hangul blocks are generated Unicode combinations. They must not be reported as lexical attestations. Lexical/corpus coverage is a separate future dataset.

## Uncertainty

Alternative vowel realizations and contemporary Seoul stop cue change are represented explicitly. A single preferred output is therefore always contextual to the selected analysis and rule ordering.


## Korean ㅎ → Ukrainian practical target

The browser's primary practical model currently maps onset ㅎ, whose broad Korean phonetic basis is voiceless glottal [h], to Ukrainian **г** [ɦ]. This is a project-level approximation, not a claim that the phones are identical and not an inherited transcription convention. The choice preserves glottal place of articulation while sacrificing the Korean segment's voicelessness; Ukrainian **х** [x] would preserve voicelessness but shift the place of articulation toward the velar region. Neither candidate is a perfect match. The choice should be evaluated through controlled reader-production tests and, if available, acoustic comparison—not justified by Latin-letter substitution alone.

This onset mapping does not override Korean phonological rules: when ㅎ deletes, triggers aspiration, or participates in a coda process, the Korean surface form must be determined first. Only then is the resulting surface segment mapped into Ukrainian. The coda entry ㅎ and the onset entry ㅎ therefore remain separate analyses.


## Sentence-level adversarial validation

The regression corpus at `tests/fixtures/adversarial-sentence-corpus.txt` covers several interacting processes in running text: ㄼ resyllabification in `짧아도`, coda neutralization and fortition in `빗고`, the morphology-sensitive reading of `넓지만`, licensed particle-`의` variants, and the contracted past-tense form `설명했어요`. Expected Korean surface forms and Ukrainian target strings are tested separately.

The corpus is an engineering regression set, not a representative frequency corpus. Its Ukrainian outputs are marked provisional. Passing the tests establishes that the implementation reproduces declared decisions and avoids unresolved placeholders in these cases; it does not establish that the chosen Ukrainian approximations are optimal or that all possible contexts have been covered. Future evaluation should include independent Korean phonetics review and Ukrainian-reader production/perception testing.


## Third sentence-level adversarial window

The third corpus is based on a user-supplied running text and adds further controls for complex codas and liaison (`흙을`, `밟으며`, `낡은`, `맑은`), ㅎ deletion (`놓인`), coda neutralization/fortition/liaison (`햇빛이`), and lateralization/nasalization (`신라`, `설날`, `독립문`, `종로`). The browser-facing page labels these as Korean surface-form controls. Only forms with an explicit lexical row are asserted against the runtime in the current regression test; unencoded examples remain audit targets rather than silently being treated as validated engine behavior. Passing tests do not validate the Ukrainian target through independent reader testing.


## Model-wide Ukrainian-target consistency audit

A review of the lexical layer found two different defects that must not be conflated with Korean pronunciation errors: (1) Ukrainian target syllables sometimes duplicated the segmental coda by moving it into the next target syllable, and (2) some target strings encoded Korean fortisness as doubled Ukrainian onset letters despite the project's stated neutralization policy. The same pass corrected several clear word-initial lenis/affricate targets and updated contextual IPA where it contradicted the model's stated realization. Regression coverage lives in `tests/model-wide-target-consistency.test.mjs`. The corrections preserve source-backed Korean surface forms and leave Ukrainian targets provisional; no test pass is evidence of reader-tested transcription quality.


The same audit also enforces the declared coda-`ㄹ` target `л` (not `ль`), context-sensitive `ㅢ` readings, and the special `ㅅ/ㅆ + ㅣ` target `ш`. It fixes duplicated or shifted consonants in the target syllable array without changing the verified Korean surface form. Context-dependent Ukrainian spellings for glides remain graphemic model decisions rather than universal Korean facts.

A second corpus-wide pass found three remaining lexical entries that still wrote Korean coda [l] with Ukrainian `ль` (`얇실하다`, `짧다`, `읽거든`), plus `넓습니다`, where doubled `сс` encoded Korean fortisness contrary to the declared practical-target policy. These targets are now `ял|шіл|га|да`, `чал|та`, `іл|ко|ден`, and `нол|сим|ни|да`, respectively. The hard-lateral regression list and fortis-neutralization checks now cover these missed cases as well.

A full aligned-syllable coda scan then found `밭이랑`, whose Korean surface is `반니랑` [pan ni ɾaŋ] but whose Ukrainian target still followed the written coda of `밭` and the IPA spelling of [ŋ]. Its target is corrected from `пат|ні|ранґ` to `пан|ні|ран`. A corpus-wide regression now checks each aligned syllable's final IPA coda against the declared Ukrainian target (`к/т/п/н/м/л`) so similar surface-vs-orthography drift is caught earlier.

A subsequent onset-alignment pass found several lexical targets that disagreed with the project's contextual onset model: initial ㄷ/ㅂ/ㅈ in `들일`, `불여우`, `지식의`, and `집안일`; intervocalic ㅈ in `넓어졌다는`; intervocalic ㄷ in `할지라도`; and onset ㅎ in `휘발유`. These targets now follow their aligned surface IPA and the declared Ukrainian mappings. The source-attested IPA for `값있다` was also corrected from `p` to contextual `b` in the second syllable, matching its between-vowels realization and the practical target `б`. These are narrow lexical corrections, not a claim that a simple grapheme-to-phoneme rule can replace lexical evidence. The lexical corpus now also has an automated onset-alignment guard for the declared practical mappings, including the deliberate `ㅅ/ㅆ + ㅣ → ш` exception; this helps distinguish true mismatches from that documented model choice.


## Consistency of the Ukrainian target for coda ㅇ

The current practical model maps Korean coda [ŋ] to Ukrainian **н** as an explicit approximation; it does not append **г** to imitate the Latin/IPA spelling *ng*. This decision applies equally to canonical conversion and exact lexical overrides. A corpus audit corrected `국민`, `박물관`, `한국말`, `국립국어원`, and `국립국어원에서`; the regression test checks every aligned target/IPA syllable in the lexical table for this specific inconsistency. The Korean IPA remains [ŋ] where source evidence supports it—the repair changes only the Ukrainian target, not the Korean pronunciation analysis.


## Phrase boundaries when a lexical override is present

The browser resolves exact sourced lexical entries at word level. This must not accidentally disable a separately licensed phrase-level rule in the adjacent word. In particular, NIKL §18 nasal assimilation across plain whitespace is re-applied to the preceding word's final coda when a following word begins with ㄴ/ㅁ, even if that following word uses an exact lexical override. Punctuation remains a hard boundary for this pass. Regression coverage includes `밥 먹는다`, `밥 문법`, and the punctuation contrast `밥, 문법`. This boundary repair is limited to the explicitly supported nasal-assimilation environment; it is not a general morphological parser.


## Liquid-to-nasal assimilation after the representative ㄷ coda

The surface representative ㄷ must be included alongside ㄱ and ㅂ when a following ㄹ is realized as ㄴ; the coda then participates in nasal assimilation as well. This includes written codas such as ㅅ/ㅈ/ㅊ after neutralization. The browser regression `몇 리` guards the [면니]-type sequence across a phrase boundary. The rule is about the Korean surface sequence; Ukrainian output remains a project-specific approximation.


Phrase-boundary liquid assimilation is also preserved when any exact lexical entry causes word-level conversion: `신 라면 문법` exercises ㄴ+ㄹ → ㄹㄹ, while `칼 날 문법` exercises ㄹ+ㄴ → ㄹㄹ. The repair changes only the affected edge segments and records the rule on both neighbouring trace rows. It does not cross punctuation and does not infer morphology-dependent liaison or palatalization.


### Composition of consecutive phrase-boundary rules

The regression suite also checks chains of adjacent word-boundary changes, not only isolated pairs. In `국 립 문법`, the boundary `ㄱ + ㄹ` first yields the liquid-to-nasal pattern and nasalizes the coda, then `ㅂ + ㅁ` at the next boundary nasalizes independently. In `몇 리 문법`, the representative coda of ㅊ is ㄷ; the test verifies the ㄷ + ㄹ sequence and confirms that a later lexical override in the same phrase does not bypass the boundary pass. These are regression examples for rule composition, not claims that arbitrary orthographic adjacency establishes every morphophonemic rule.


## Phrase-boundary assimilation: normative rule vs runtime heuristic

NIKL Standard Pronunciation Rules §18 explicitly extends nasal assimilation to two words pronounced together as one utterance. The normative condition is connected-phrase pronunciation, not the mere presence of a whitespace character. The browser engine currently uses plain whitespace as a deterministic proxy for that prosodic condition and blocks the rule at punctuation. This is an engineering heuristic, not a claim that every whitespace-separated pair must undergo assimilation.

Consequences for interpretation and evaluation:

- Treat phrase-boundary nasal/liquid changes as context-dependent predictions, not guaranteed readings for every written sentence.
- Preserve the distinction between the cited Korean surface rule and the browser's simplified phrase-link detection.
- A future interface should let users choose connected-phrase mode or provide prosodic/phrase-boundary information instead of inferring it silently.
- Regression tests can verify the deterministic implementation, but cannot establish the intended prosodic grouping of arbitrary user text.

Normative source: National Institute of Korean Language, *한국어 어문 규범 — 표준 발음법 제18항*, including the note that the rule also applies when two words are pronounced together as one utterance: https://korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002#a402


## Claim traceability and review record

The [methodology claims-and-evidence register](METHODOLOGY-CLAIMS-AND-EVIDENCE-REGISTER-2026-10-30.md) maps each public statement to code, tests, sources, benchmark runs, denominators and evidence limits. The [methodology review and adjudication record](METHODOLOGY-DEBATE-REVIEW-2026-10-30.md) documents the structured academic, evidence and engineering review perspectives used to challenge those claims.

The review record is a record of analytical procedures, not independent human expert review. Independent Korean IPA adjudication and independent Ukrainian target review remain separate blocked acceptance gates.
