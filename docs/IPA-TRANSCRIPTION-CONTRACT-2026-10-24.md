# Korean IPA transcription contract — ClippyFirst broad v1

**Status:** PROJECT CONTRACT PROPOSED AND VERSIONED; independent phonetic review required before treating all normalization equivalences as linguistically adjudicated.
**Effective for new benchmark reporting:** record both `legacy-broad-diagnostic-v0` (the historical normalization) and `clippyfirst-broad-v1` (the declared project comparison profile). Never overwrite historical results.
**Scope:** Korean surface pronunciation → IPA representation only. Ukrainian adaptation is a separate, downstream layer.

## 1. What the output means

The canonical ClippyFirst IPA layer is a **broad IPA representation of the resolved Korean surface pronunciation**: it represents the result of Korean pronunciation rules at segment level without claiming acoustic narrow transcription. It is not merely a grapheme-to-phoneme spelling table and is not an underlying phonemic transcription. Rule order and morphologically conditioned environments must be resolved or explicitly marked uncertain before downstream Ukrainian adaptation.

The pipeline contract remains:

`Hangul orthography → structural/morphological analysis → Korean surface phonology → IPA → Ukrainian target adaptation → Ukrainian practical orthography`

The Korean Standard Pronunciation Rules and NIKL dictionary/Q&A can establish a Korean surface reading, usually rendered in Hangul brackets. They do **not** by themselves establish IPA gold or Ukrainian target gold. The Ukrainian target is never independently generated from Hangul.

## 2. Symbol policy

| Feature | ClippyFirst policy | Scoring policy |
|---|---|---|
| Korean fortis series, e.g. `k͈`, `s͈`, `tɕ͈` | Preserve explicitly | Never normalize away |
| Aspirated stops/affricates, e.g. `kʰ`, `tʰ`, `pʰ`, `tɕʰ` | Preserve explicitly | Never normalize away; protect `tɕ` before standalone `ɕ→s` normalization |
| Source-attested vowel length `ː` | Preserve when licensed by the source analysis | Never normalize away |
| Coda unreleased mark `̚` | Preserve in emitted IPA for now; this is an explicit project representation choice | Preserve in both profiles until separately reviewed |
| Affricate tie bar `͡` | Optional typographic segmentation, not a different segment sequence | Ignore in scoring, as in the legacy profile |
| Syllable dots / whitespace | Boundary metadata, not IPA phones | Ignore for phone-string comparison; preserve separately when the API provides boundaries |
| Narrow vowel-position diacritics `̝ ̠ ̞` in the currently supported contexts | Not required by this broad layer | Historical profile removes the explicitly listed marks; no other diacritic is silently dropped |
| Allophone-symbol variants `ɭ/l`, `ʎ/l`, standalone `ɕ/s`, `ɦ/h`, `ç/h`, `ɲ/n`, and sibilant `sʰ/s` | The proposed canonical comparison maps these to the project’s broad symbols only for scoring; it does not rewrite raw engine output. The `tɕ` affricate sequence is protected and restored around standalone `ɕ→s` normalization. | Mappings are explicit in `normalize_ipa_profile(..., "clippyfirst-broad-v1")`; report sensitivity against legacy scores until independent review signs off |
| Vowel/glide differences such as `i/y` | Do not assume equivalence | Preserve and adjudicate by context |
| Unresolved morphology or competing readings | Do not guess an IPA gold | Mark unresolved/abstain; never score an abstention as a correct pronunciation |

The allophone mappings above are a **versioned project decision for broad-level comparison**, not a claim that the symbols are interchangeable in every language or context. The candidate profile materially changes exact-match scores and must be reviewed against Korean phonetic literature and a representative, independently labelled sample. If a review rejects any mapping, create a new profile version; do not silently edit v1 after results are published.

## 3. Two metrics must be published

1. **Historical exact match / CER:** use the unchanged legacy normalizer and the pinned reference, preserving comparability with already published 24.41% / 53.18% results.
2. **Broad-v1 exact match / CER:** apply the explicit allophone comparison profile, report its denominator, coverage and delta from legacy. This is a convention-sensitivity result until independent labels validate the mappings; it is not a replacement score and must not be marketed as improved engine accuracy.

Always report coverage/abstention separately from exact match, character error rate (CER), and lexical-type as well as occurrence-weighted results. Never compare a word-level acceptability score from literature directly with whole-token IPA exact match.

## 4. Adjudication labels

Every mismatch must be assigned one of the following by a reviewer, with the evidence and context retained:

- `PHONOLOGY_ERROR`: the engine's predicted Korean surface segments/rule application conflict with the source-supported reading.
- `MORPHOLOGY_OR_LEXICAL_ANALYSIS_ERROR`: the wrong morpheme/lexeme or boundary was assumed.
- `TRANSCRIPTION_CONVENTION_ONLY`: two IPA strings encode the same intended broad target under the declared contract.
- `REFERENCE_ERROR_OR_VARIANT`: reference is unsupported, malformed, or omits an attested alternative.
- `UNRESOLVED_NEEDS_REVIEW`: evidence does not discriminate.
- `NOT_COMPARABLE`: incompatible scope, normalization, or source representation.

Two reviewers independently record broad IPA and classification. Disagreement goes to a third adjudicator. A Hangul bracketed reading, one engine's output, agreement between engines, or a rule name alone is not sufficient to populate `finalBroadIpa`.

## 5. Benchmark and holdout integrity

- UGTPHON/MultiLexNorm++ and SIGMORPHON remain **diagnostic external benchmarks**, not normative Korean standard gold.
- Do not tune rules or normalization mappings on the frozen NIKL holdout.
- The holdout manifest stores only input, rule/source evidence and Korean surface-form evidence. IPA gold, reviewer identities and adjudication remain empty until independent annotation.
- Exact-token overlap against the pinned external benchmark is currently 0/24. Full local runtime/test leakage CI remains a separate gate. No third-party dataset is copied into the repository.
- Any overlap, even if surface forms are the same, is excluded from the independent holdout or disclosed before scoring. The accepted set is frozen by its manifest hash in the validation record.
- Keep a separate development/error-analysis set; never use the holdout for rule selection and then continue calling it a holdout.

## 6. Release gates

A broad-IPA release claim requires:
- a versioned contract and deterministic normalizer;
- two independent IPA labels plus adjudication for each gold item;
- source scope and morphology recorded;
- frozen, overlap-checked holdout with no tuning leakage;
- per-rule and per-morphology error slices, abstention/coverage, exact match, CER and lexical-type sensitivity;
- Ukrainian target review as a separate acceptance task.

Until those gates pass, the status is **research-ready for diagnostics, not independently validated for release**.


### Measured profile sensitivity (2026-10-24)

On pinned multi-engine artifact 12567083852 (report JSON SHA-256 `448c23993032e7a30a7f2cff716a9b048bf856481e1cc839c734c3de9b5f082f`), 2,655 paired occurrences were scored after excluding 48 native abstentions.

| Profile | ClippyFirst exact match | ClippyFirst CER | g2pk exact match | g2pk CER |
|---|---:|---:|---:|---:|
| Legacy | 1,412/2,655 (53.18%) | 9.19% | 1,416/2,655 (53.33%) | 9.24% |
| Candidate broad v1 | 2,417/2,655 (91.04%) | 1.6847% | 2,415/2,655 (90.96%) | 1.7303% |

These are normalization-sensitivity results on the same reference strings, not newly validated accuracy estimates. The final broad-v1 normalizer preserves `tɕ` affricates; the corrected reference-character denominator is 21,962. After the other proposed allophone collapses, exact match is 71.30%; adding `ɕ→s` alone gives 71.86%; collapsing sibilant `sʰ→s` alone gives 83.92%; applying both gives 91.04%. Independent IPA labels are required to confirm that the broad comparison is linguistically appropriate rather than an over-collapse.


## 7. Evidence supporting the candidate equivalences

These references support the *phonological plausibility* of the mappings, not the correctness of each individual benchmark transcription:

- **Korean consonant/allophone chart (Ohio State University, Spoken English Program):** [Korean consonants, IPA](https://ielp.ehe.osu.edu/files/2022/08/Korean_IPA.pdf). Its explanatory notes identify bracketed `[ɭ]` and `[ʎ]` as non-phonemic lateral phones, describe taps and lateral approximants as allophones of /l/, describe `[ç]` and other non-phonemic fricatives as allophones of /h/, and describes the aspirated fricative `[sʰ]` as corresponding to the lax sibilant phoneme rather than a separate aspirated-fricative phoneme.
- **Sibilant coarticulation:** Kang, Hyunsook (2010), “Coarticulation effects of Korean sibilant /s/ before a high front segment,” *Studies in Phonetics, Phonology and Morphology* 16(1), 3–18. [DOI: 10.17959/sppm.2010.16.1.3](https://doi.org/10.17959/sppm.2010.16.1.3). The study finds measurable palatalized acoustic properties of /s/ before high-front segments; it supports treating `ɕ/s` as a broad-vs-allophonic representation question, not unconditional identity in every context.
- **Allophonic /h/:** Han & Choi (2015), “The influence of spelling on the production and storage of words with allophonic variants of /h/ in Korean,” *Applied Psycholinguistics*. [Cambridge University Press](https://www.cambridge.org/core/journals/applied-psycholinguistics/article/abs/influence-of-spelling-on-the-production-and-storage-of-words-with-allophonic-variants-of-h-in-korean/695C8A620FADB77A80F9DA02D65AFE42). The study explicitly investigates [ɦ] as an allophonic variant of /h/.
- **Palatalized nasal:** “Korean n-insertion: a mismatch between data and learning,” *Phonology* (Cambridge University Press). [Article](https://www.cambridge.org/core/journals/phonology/article/korean-ninsertion-a-mismatch-between-data-and-learning/6C53BDA0D8F55B2DA793E043D10B968D). The article notes that the sequence /nj/ may be realized phonetically as [ɲ]. The candidate normalizer maps [ɲ] to broad `n` while retaining a following `j` if present; it does not delete the glide.

The evidence supports a broad-phonological comparison profile, but does not license indiscriminate normalization of unrelated symbols. Keep `i/y`, stress, length, fortisness, stop aspiration and unreleased-coda marks distinct until their own evidence review.
