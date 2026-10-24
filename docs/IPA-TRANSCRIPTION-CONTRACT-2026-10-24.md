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
| Aspirated stops/affricates, e.g. `kʰ`, `tʰ`, `pʰ`, `tɕʰ` | Preserve explicitly | Never normalize away |
| Source-attested vowel length `ː` | Preserve when licensed by the source analysis | Never normalize away |
| Coda unreleased mark `̚` | Preserve in emitted IPA for now; this is an explicit project representation choice | Preserve in both profiles until separately reviewed |
| Affricate tie bar `͡` | Optional typographic segmentation, not a different segment sequence | Ignore in scoring, as in the legacy profile |
| Syllable dots / whitespace | Boundary metadata, not IPA phones | Ignore for phone-string comparison; preserve separately when the API provides boundaries |
| Narrow vowel-position diacritics `̝ ̠ ̞` in the currently supported contexts | Not required by this broad layer | Historical profile removes the explicitly listed marks; no other diacritic is silently dropped |
| Allophone-symbol variants `ɭ/l`, `ʎ/l`, `ɕ/s`, `ɦ/h`, `ç/h`, `ɲ/n`, and sibilant `sʰ/s` | The proposed canonical comparison maps these to the project’s broad symbols only for scoring; it does not rewrite raw engine output | Mappings are explicit in `normalize_ipa_profile(..., "clippyfirst-broad-v1")`; report sensitivity against legacy scores until independent review signs off |
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
- The holdout is not certified independent of the licensed external benchmark until exact overlap checking is run against the pinned source corpus. No third-party dataset is copied into the repository.
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

On the pinned multi-engine artifact (JSON SHA-256 `448c23993032e7a30a7f2cff716a9b048bf856481e1cc839c734c3de9b5f082f`), 2,655 paired occurrences were scored after excluding 48 native abstentions.

| Profile | ClippyFirst exact match | ClippyFirst CER | g2pk exact match | g2pk CER |
|---|---:|---:|---:|---:|
| Legacy | 1,412/2,655 (53.18%) | 9.19% | 1,416/2,655 (53.33%) | 9.24% |
| Candidate broad v1 | 2,417/2,655 (91.04%) | 1.70% | 2,415/2,655 (90.96%) | 1.75% |

These are normalization-sensitivity results on the same reference strings, not newly validated accuracy estimates. After the other proposed allophone collapses, exact match is 71.30%; adding `ɕ→s` alone gives 71.86%; collapsing sibilant `sʰ→s` alone gives 83.92%; applying both gives 91.04%. Independent IPA labels are required to confirm that the broad comparison is linguistically appropriate rather than an over-collapse.
