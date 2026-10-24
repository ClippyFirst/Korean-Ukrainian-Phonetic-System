# IPA contract, discrepancy adjudication and independent holdout — 2026-10-24

## Task ledger

| Workstream | Status | Evidence / acceptance boundary |
|---|---|---|
| Versioned broad-IPA contract | **DONE_VERIFIED for specification and executable normalizer** | `docs/IPA-TRANSCRIPTION-CONTRACT-2026-10-24.md`; deterministic legacy and `clippyfirst-broad-v1` profiles are separately reported. The candidate profile is sensitivity-only pending independent review. |
| Adjudicate observed engine/reference differences | **PARTIAL** | Measured symbol-level mismatch classes are classified as candidate convention differences, not automatically declared harmless. Three of the 14 R002/R003 cases have exact official Hangul surface evidence; four have related evidence; seven have no exact source recorded. **Independent IPA labels: 0/14.** |
| Independent holdout | **PARTIAL: external exact-token disjointness verified; independent IPA labels remain blocked** | 24 source-backed NIKL Rule 5/9 forms are frozen in `data/korean/ipa_holdout_2026-10-24.json`, with no engine outputs and no IPA gold. Local runtime/fixture overlap is checked by the validator. Exact overlap with the licensed UGTPHON benchmark remains unchecked until the pinned artifact is supplied to the validator. |

## 1. Versioned contract and scoring profiles

The repository previously used a single diagnostic normalizer. That is insufficient to distinguish a broad-IPA convention mismatch from a phonological error. The new contract names two profiles:

- `legacy-broad-diagnostic-v0`: preserves the old comparison behavior, including existing diacritic handling. This profile is immutable for historical comparability.
- `clippyfirst-broad-v1`: a candidate broad-level scoring profile that collapses only the explicit allophone symbol pairs listed below. It does not rewrite raw engine output, and its result is labelled sensitivity-only until independent IPA review.

The analysis script now reports exact match, CER, denominator and status for both engines under both profiles. It preserves fortisness, stop/affricate aspiration, vowel length and the unreleased-coda mark. It does **not** collapse `i/y`, remove length, or remove aspiration from stops.

## 2. Symbol-level mismatch adjudication

The pinned artifact's deterministic character alignment reported the following frequent substitutions in the native engine's non-exact outputs:

| Reference → native | Count | Adjudication decision |
|---|---:|---|
| `ɭ → l` | 525 | Candidate coda-lateral allophone / broad-symbol difference; test under v1 and review context |
| `ʰ → s` | 194 | Frequently a reference sibilant-aspiration detail; only `sʰ/s` is collapsed, never stop aspiration |
| `ɦ → h` | 165 | Candidate contextual /h/ allophone difference; review segment context |
| `ɲ → n` | 73 | Candidate palatal nasal allophone difference; inspect adjacency to palatal glide |
| `ç → h` | 40 | Candidate contextual /h/ allophone difference |
| `ʎ → l` | 33 | Candidate palatalized lateral allophone difference |
| `ɕ → s` | 30 | Candidate palatalized sibilant allophone difference |
| `i → y` | 36 | **Not normalized**: vowel/glide identity must be adjudicated by context |

These counts come from one deterministic minimum-edit alignment over normalized strings. They are useful for prioritization, but not an error taxonomy: a tied optimal alignment can assign individual edits differently. The new profile quantifies how much the proposed broad convention changes scores; it does not itself prove that any output is correct.

### 14 selected R002/R003 abstention cases

The source-adjudication queue registered in [PR #304](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/304) remains the source of record. Current evidence state:

- **Exact-form Korean surface evidence found (3):** `멋있어` (NIKL permits [머디써] and [머시써]); `싫어서` ([시러서]); `수많은` ([수ː마는]).
- **Related component/rule evidence only (4):** `되었어`, `붙어야`, `쌓아서`, `좋은데`. Related evidence must not be promoted to whole-form IPA gold.
- **No exact source recorded in this pass (7):** `찢었으면`, `했었음`, `칡칡이`, `이런삶은`, `괜찮아보이는디`, `많을거같이`, `좋아보인다고`.

This is **surface-source adjudication**, not IPA adjudication. NIKL bracket notation uses Hangul and cannot be copied into `finalBroadIpa`. The queue still has 0/14 independently labelled broad-IPA gold items and no Ukrainian target adjudication. Variants such as `멋있어` must be represented as allowed alternatives, not forced into a single answer.

Primary source locators:
- [NIKL Online Q&A — 멋있어](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=306166)
- [NIKL Online Q&A — 싫어서](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=313981)
- [NIKL Korean Basic Dictionary — 수많다 / 수많은](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=71144)
- [NIKL Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002)

## 3. Frozen independent-holdout inputs

`data/korean/ipa_holdout_2026-10-24.json` contains 24 official-source examples drawn from NIKL Rule 5 (ㅢ readings) and Rule 9 (coda neutralization). The manifest stores the exact Korean input, official Hangul surface reading, rule and source locator. It deliberately stores **no engine outputs and no IPA gold**.

Validation:
- every item has an official NIKL URL and surface notation is explicitly labelled “not IPA”;
- IDs and inputs must be unique;
- two reviewer IPA fields and adjudicator fields must remain empty;
- inputs must not be present in the repository's local runtime pronunciation data or existing text fixtures;
- `scripts/validate_ipa_holdout.py` can check exact overlap against either the pinned benchmark artifact (`native_g2pk_pairwise_audit.occurrences`) or the original corpus JSON.

**External token overlap check completed; IPA gold still pending:** the exact pinned artifact has 0/24 token overlaps with the final manifest. The result and manifest Git blob SHA are recorded in `research/ipa-holdout-overlap-validation-2026-10-24.json`. The validator CLI can repeat this check when the artifact is available. Do not tune on this set. The 24 inputs are frozen candidates, not 24 IPA gold labels.

## Verification commands

Run in a clean checkout with the project's Python test dependencies:

```sh
pytest -q tests/test_benchmark_score_causality.py tests/test_ipa_contract_and_holdout.py
python scripts/validate_ipa_holdout.py
python scripts/analyze_korean_benchmark_correlations.py --input multi-engine-ipa-report.json --output score-causality.json
python scripts/validate_ipa_holdout.py --benchmark-artifact multi-engine-ipa-report.json --require-overlap-check
```

The last two commands require the pinned benchmark artifact produced by the existing CI workflow; it is intentionally not committed because it contains licensed third-party data.

## Remaining acceptance gates

1. Run the candidate profile on the exact pinned artifact and publish both profiles' measured rates. Do not estimate a new score from symbol counts.
2. Obtain two independent IPA transcriptions for all selected mismatch cases and holdout inputs, then adjudicate disagreements with the contract.
3. **DONE for exact-token overlap:** final manifest has 0/24 exact overlaps with the pinned artifact and is frozen by Git blob SHA. Remaining: confirm local runtime/fixture leakage check in CI.
4. Only after those gates, decide whether `clippyfirst-broad-v1` becomes the sole primary metric. Until then, retain the legacy score and publish sensitivity results side by side.
5. Review Ukrainian targets separately; this report does not certify target-language accuracy.

**Readiness:** research-ready for reproducible diagnostics; not release-ready for an independently validated Korean IPA or Ukrainian transcription accuracy claim.


## Quantified profile sensitivity

The pinned artifact was re-scored with the versioned comparison profiles. On 2,655 paired occurrences, native exact match/CER changes from 53.18% / 9.19% under legacy normalization to 91.04% / 1.70% under candidate broad-v1; g2pk changes from 53.33% / 9.24% to 90.96% / 1.75%. The sibilant `sʰ→s` collapse is the largest score driver. These are sensitivity measurements, not independently validated accuracy claims. See [the aggregate results](../research/broad-ipa-profile-sensitivity-2026-10-24.json) and [full report](KOREAN-BENCHMARK-SCORE-CAUSALITY-2026-10-24.md).


### Primary phonetic literature for the broad-profile candidates

The allophone decisions are now linked to descriptive and experimental sources:

- [Ohio State University Korean IPA chart](https://ielp.ehe.osu.edu/files/2022/08/Korean_IPA.pdf) labels `[ɭ]` and `[ʎ]` as non-phonemic lateral phones/allophones of /l/, identifies `[ç]` as an /h/ allophone, and treats `[sʰ]` as the phonetic realization of the lax sibilant phoneme.
- Kang (2010), [“Coarticulation effects of Korean sibilant /s/ before a high front segment”](https://doi.org/10.17959/sppm.2010.16.1.3), reports palatalized acoustic properties of /s/ before high-front segments.
- Han & Choi (2015), [“The influence of spelling on the production and storage of words with allophonic variants of /h/ in Korean”](https://www.cambridge.org/core/journals/applied-psycholinguistics/article/abs/influence-of-spelling-on-the-production-and-storage-of-words-with-allophonic-variants-of-h-in-korean/695C8A620FADB77A80F9DA02D65AFE42), studies [ɦ] as an allophonic variant of /h/.
- [“Korean n-insertion: a mismatch between data and learning”](https://www.cambridge.org/core/journals/phonology/article/korean-ninsertion-a-mismatch-between-data-and-learning/6C53BDA0D8F55B2DA793E043D10B968D) discusses [ɲ] as a phonetic realization of /nj/; the candidate profile maps [ɲ] to `n` while retaining the following `j` when present.

These sources support the broad-vs-narrow hypothesis, but they do not replace independent annotation of the exact benchmark items. The remaining `i/y`, stress, length and consonant-symbol mismatches remain separate adjudication targets.
