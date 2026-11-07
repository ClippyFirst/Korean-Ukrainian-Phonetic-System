# Kozak Kim: 40 no-audio residual cases — engine-policy adjudication

**Date:** 2026-11-06  
**Base:** `main` at `3570b3e5a35533739226d6bf9f0eefb1eb81fbac`  
**Working branch:** `research/no-audio-40-case-adjudication-2026-11-06`  
**Scope:** the 12 individual ABSTAIN occurrences plus the 28-row focused residual register.

## Executive result

All **40/40 occurrences now have an explicit, evidence-bounded engine-policy decision** in [the occurrence-level register](../research/kozak-kim-40-no-audio-engine-policy-2026-11-06.csv). The register covers **17 distinct token spellings across 12 decision families**. The 22 `아끼셔` rows are repeated occurrences from one source-row/token family, not 22 independent speakers or phonetic observations.

This does **not** claim 40/40 speaker-level IPA gold. The same register deliberately keeps `speaker_ipa_gold_status=UNRESOLVED_NO_AUDIO` for all 40. No audio was supplied, and none is requested. Without the original signal and speaker crosswalk, the project cannot responsibly select narrow allophones, speaker-specific vowel quality, or optional connected-speech realizations. That evidence limitation is separate from deciding what the production engine should do.

The result is therefore:

- **40/40 engine-policy dispositions:** resolved without audio.
- **0 invented token-specific narrow IPA transcriptions.**
- **0 forced choices between variants where prosody or speaker realization is unknown.**
- **3 explicit phrase-boundary Rule 29 patterns added to both browser and Python runtimes.**
- The pre-existing 12 ABSTAIN and 28 evidence-reviewed-unresolved provenance labels remain intact; this addendum does not rewrite historical evidence status or inflate the 236-case completion count.

## Implementation

### Rule 29 connected-phrase n-insertion

The browser and Python engines now expose conditional phrase-mode handling for these explicitly spaced phrase pairs under the general NIKL Standard Pronunciation Rule 29 [붙임 2] framework. These are **not lexical attestations or token-specific production licenses** for the compact corpus forms; they are runtime paths available only when the caller supplies the word boundary and connected-phrase mode:

| Explicit phrase input | Connected-phrase surface | Scope |
|---|---|---|
| `홍콩 영화들` | `홍콩녕화들` | Only when the words are explicitly segmented and treated as one phrase |
| `한국 여자로` | `한궁녀자로` | Same |
| `첫 연애` | `천녀내` | Same; NIKL Q&A 316146 explicitly says the result depends on prosodic grouping |

The Python API requires `boundary_mode="phrase"`. The browser runtime uses explicit whitespace as its documented connected-phrase proxy. NIKL Q&A 330322 establishes the general two-word connected-phrase scope using `무슨 일`; it does not attest these exact tokens. Neither runtime infers hidden spaces in compact inputs: `홍콩영화들`, `한국여자로`, and `첫연애` do **not** trigger this phrase rule. This is important because the corpus tokens are compact strings and their original prosodic boundaries are not encoded.

For `첫 연애`, the official answer is conditional, not a single universal form: [천녀내] is possible when grouped as one phrase; [첟#여내] with a pause and [처뎌내] with liaison but no n-insertion are also described. The engine only applies the connected-phrase path when the caller supplies explicit phrase boundaries; it does not pretend to infer the speaker's prosody.

### Other 35 occurrences: retain the existing broad policy

| Family / occurrences | Engine decision | Reason and limit |
|---|---|---|
| `오조오억배` (78) | Keep broad /o.ʌ/; do not add categorical /j/ | Acoustic transition vs. phonological glide is not resolved by the corpus comparator. Kim & Hong (2025) study /iə~ijə/ and /oa~owa/, not this numeral /o.ʌ/ sequence. |
| `문화체험공간`, `사전체험`, `만듬사전체험때` (257, 813, 853) | Keep `체험` without /j/ | The sequence is /e.hʌ/, with /h/ intervening; it is not adjacent VV hiatus. A /j/ insertion rule is not licensed by the cited hiatus studies. |
| `자기이입하네` (899) | Preserve the broad /i.i/ sequence; do not delete a nucleus or add /j/ | The comparator's deleted /i/ is not independent gold. Korean glide formation/coalescence can vary with context and speech rate; no speaker-specific choice is justified. |
| Repeated `ㅠ` in 1219 and 1288 | Preserve raw `ㅠ` as literal non-speech notation; exclude those spans from G2P | The source context contains compatibility-jamo emoticons, but the candidate canonicalization rewrites them as `유`, creating artificial /ju/ strings. The runtime already treats standalone compatibility jamo as unresolved and does not phonologize them. The raw source must remain authoritative; a canonicalized `유` must not be retroactively treated as a spoken syllable. |
| `쇼` (606) | Keep broad /s/; no categorical [ɕ] or [ɕʷ] | NIKL Q&A 332662 advises reading the foreign word according to Hangul spelling; the acoustic labio-palatalized pattern reported for rounded high-front contexts is not a categorical segmental IPA prescription. |
| `모션어디서`, `포지션을` (843, 2489) | Keep broad /s/ before /jʌ/ | The reviewed /i, ye, ya/ evidence does not establish [ɕ] in this /jʌ/ loanword context. |
| `뿌셔우우`, `뿌셔우우우` (1155, 1157) | Preserve source spelling and broad /s/ | Playful UGC spelling has unresolved lexical intent; do not normalize it or derive a special [ɕ] rule from a comparator. |
| `대한민국` (1885) | Retain canonical broad vowel; keep the existing research-only [ɛ]~[e] quality candidate | Group-level merger studies do not identify this speaker's vowel quality or duration. Preserve any source-supported length marker; do not select a speaker-specific [ɛː] or [eː] from text alone. |
| 22 `아끼셔` occurrences (1414–1477) | Keep broad lenis /s/ before /jʌ/; no [ɕ] variant | The morphology is 아끼-시-어 → 아끼셔. The fortis /k͈/ in 끼 is a different segment and does not make the sibilant fortis. The reviewed studies do not test this /jʌ/ contraction context. |

## Evidence and interpretation

1. **NIKL Standard Pronunciation Rule 29** is the primary normative basis for n-insertion, including the connected-phrase supplement: [official rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002).
2. **NIKL Q&A 330322** confirms that Rule 29 [붙임 2] can apply across two words pronounced as one connected phrase. It supports the rule's scope, not an audio-backed adjudication of the compact `홍콩영화들` or `한국여자로` corpus tokens.
3. **NIKL Q&A 316146** directly addresses `첫 연애` and distinguishes connected grouping from a pause/liaison reading: [official answer](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=316146).
4. **Kim & Hong (2025)**, *Between Transitions and Glides: The Acoustic Characteristics of /iə~ijə/ and /oa~owa/*, DOI [10.30961/lr.2025.61.1.1](https://doi.org/10.30961/lr.2025.61.1.1), is directly relevant to the distinction between a transition and a phonological glide. Its experimental sequences are not the exact /o.ʌ/ numeral or /e.hʌ/ `체험` contexts.
5. **Shin (2013)**, *수의적 /j/ 활음화와 /j/ 활음 첨가에 대한 음성, 음운론적 연구*, reports optionality related to syllable structure and speech rate. It supports caution, not a token-specific output.
6. **Kang (2010)**, *Coarticulation effects of Korean sibilant /s/ before a high front segment*, and the separate rounded-segment study distinguish acoustic coarticulation patterns. Neither licenses a universal /s/→[ɕ] rule before every /j/-initial sequence. The existing project source register records the narrower experimental scopes and rights status.
7. **Lee (2023)** and the existing mid-front-vowel sources support a research-only [ɛ]~[e] candidate, not speaker-level selection for `대한민국`.

The exact source IDs and limits are recorded in `research/SOURCE-REGISTER.csv` and the new occurrence-level policy CSV. Citation-only sources remain citation-only; this work does not redistribute third-party papers or audio.

## Verification added

- Python: exact phrase-mode Rule 29 tests, compact-token negative controls, 40-row crosswalk/provenance tests, source-register ID validation.
- Browser: matching phrase-mode regressions, compact-token negative controls, no-glide controls for `오조오억배` and `체험`, retained-hiatus control for `자기이입하네`, and broad /s/ controls for all reviewed sibilant families.
- Existing standalone-jamo regression now includes `ㅠㅠ`, ensuring raw emoticon jamo is not emitted as pronunciation.

These tests are committed to this branch and must be checked by the repository CI before merge. No local test run is claimed in this connector-only session.

## Final classification

| Question | Result |
|---|---|
| Are the 40 engine behaviors decided without audio? | **Yes — all 40 have a bounded policy decision.** |
| Are all 40 speaker-level IPA readings independently verified? | **No — none is claimed as such.** |
| Did we add guessed narrow IPA or select a speaker's optional variant? | **No.** |
| Can the engine now handle the three relevant Rule 29 phrase patterns when boundaries are explicit? | **Yes — browser and Python paths are updated; compact strings remain unsegmented.** |
| Does this make the entire 236-case cohort fully complete or the repository release-ready? | **No.** The historical cohort membership and independent IPA gold limitations remain. |

The user's no-audio constraint is respected. Remaining uncertainty is explicit and does not silently leak into canonical IPA or Ukrainian output.


## 2026-11-07 follow-up — source-only adjudication completed

The no-audio constraint is now handled through a separate source-only pass rather than treating the absence of recordings as a blanket blocker. All 17 distinct token spellings across the 40 occurrence rows have a source-based structural/broad-profile disposition in [the 2026-11-07 adjudication report](KOZAK-KIM-40-SOURCE-ONLY-ADJUDICATION-2026-11-07.md) and [the 17-token machine-readable register](../research/kozak-kim-40-source-adjudication-2026-11-07.csv).

This closes the **source-based engine-policy question** for all 40 occurrences: canonical broad sequences, explicit morphology, conditional Rule 29 variants, non-speech exclusion, and research-only vowel variants are now recorded separately. It does not change `speaker_ipa_gold_status=UNRESOLVED_NO_AUDIO`: no cited study supplies the identity, recording, prosodic grouping or token-level acoustic measurement for the original speaker. In particular, broad /s/ before /jʌ/ remains the source-supported engine representation; [ɕ] is not assigned categorically, and no individual `대한민국` vowel variant or compact-string n-insertion option is selected.

The 17-token CSV references only source IDs present in `research/SOURCE-REGISTER.csv`. Jun (2021) was added to the source register because its peer-reviewed survey study directly supports the gradient/conditioned n-insertion boundary. No runtime change was justified: the existing Python and Browser policies already implement these source boundaries. Exact-head CI must still validate the documentation/data-only continuation.
