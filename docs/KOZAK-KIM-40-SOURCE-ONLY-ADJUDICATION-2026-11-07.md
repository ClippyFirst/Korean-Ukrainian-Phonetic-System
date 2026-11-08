# Kozak Kim: source-only adjudication of the 40 residual occurrences

**Date:** 2026-11-07; evidence reconciliation: 2026-11-08  
**Base:** `main` at `1f220fcd7e3b44dab7302b37e2fe225812ee18a6`  
**Branch:** `research/source-only-40-case-adjudication-2026-11-07`  
**Primary register:** [17-token source adjudication CSV](../research/kozak-kim-40-source-adjudication-2026-11-07.csv)  
**Occurrence register:** [40-case engine-policy CSV](../research/kozak-kim-40-no-audio-engine-policy-2026-11-06.csv)

## Executive result

The source-only pass adjudicates **all 17 distinct token spellings across all 40 occurrence rows** at the level that written forms, morphology, official pronunciation rules, and published phonetics can support. The 40 engine-policy decisions remain valid. This work does not convert source-based decisions into claims about an unknown speaker's exact phonetic realization.

- **17/17 distinct spellings:** source-based structural and broad-profile disposition recorded.
- **40/40 occurrences:** linked to one of those source adjudications.
- **22 `아끼셔` rows:** one repeated source-row/token family, not 22 independent speakers or recordings.
- **No invented narrow IPA:** no speaker-specific allophone, glide, vowel quality, or prosodic variant is guessed.
- **No new categorical runtime rule:** the existing engine policy already matches the source-supported boundary. Phrase-level Rule 29 remains explicitly conditional.
- **Repository acceptance: 40/40 source-based decisions accepted without audio.** Audio and speaker identity are not acceptance prerequisites.
- **Speaker-specific acoustic IPA gold: 0/40, non-blocking and out of scope.** This optional annotation would require recordings and a speaker crosswalk, but its absence does not block source-based phonological adjudication, broad IPA policy, Ukrainian adaptation, or repository acceptance.

The legacy `speaker_ipa_gold_status=UNRESOLVED_NO_AUDIO` field is retained for traceability only. It describes the separate speaker-specific acoustic annotation dimension; it is explicitly **non-blocking** and must not be used as the acceptance status for source adjudications. The new `source_acceptance_status` column in the occurrence policy CSV records the actual acceptance decision independently.

## Source-based adjudication

| Token(s) | Source-supported decision | What is not inferred |
|---|---|---|
| `오조오억배` | Keep broad /o.ʌ/ inside 오억; do not insert phonemic /j/ or /w/ from a transition. Keep the separate /o.o/ sequence at 조–오 distinct. | No narrow glide choice or token-specific connected-speech realization. |
| `문화체험공간`, `사전체험`, `만듬사전체험때` | In 체험, /h/ intervenes between /e/ and /ʌ/: /e.hʌ/. It is not adjacent-VV hiatus, so no extra /j/ is inserted. | No change to the lexical /h/ onset; no glide insertion inferred from unrelated VV experiments. |
| `쇼` | NIKL says to follow Hangul spelling; its phonetics article describes ㅅ as [ʃ] before [j], and ㅛ is a diphthong. Retain underlying /s/ and record [ʃ] as a general profile expectation. | No token-specific narrow IPA; the NIKL source uses [ʃ], not [ɕ] or [ɕʷ]. |
| `홍콩영화들` | Rule 29 [붙임 2] permits n-insertion only when two explicitly segmented words are pronounced as one connected phrase. Phrase-mode path remains available for `홍콩 영화들`. | Compact `홍콩영화들` does not establish hidden spacing or prosodic grouping. |
| `모션어디서`, `포지션을` | Retain underlying /s/; NIKL's general phonetic description predicts [ʃ] before the /j/ onglide in ㅕ. | Kang's acoustic study does not measure these exact /jʌ/ loanword tokens; NIKL's [ʃ] is a profile-level expectation, not speaker-specific narrow gold and not [ɕ]. |
| `자기이입하네` | Preserve the broad /i.i/ sequence. Do not delete a vowel nucleus or insert an extra /j/ categorically. | No speaker-specific hiatus resolution or coalescence. |
| `뿌셔우우`, `뿌셔우우우` | Preserve playful UGC spelling and underlying /s/; NIKL's general description predicts [ʃ] before the /j/ onglide in ㅕ. | Do not normalize the lexeme or claim a speaker-specific narrow realization; [ʃ] is a general profile expectation, not [ɕ] token gold. |
| Two normalized records containing repeated `유` | The source context contains raw compatibility-jamo `ㅠ` emoticons. Preserve raw `ㅠ` and exclude those spans from G2P. | Do not treat normalized `유` as spoken /ju/; the emoticon has no IPA target. |
| 22 occurrences of `아끼셔` | Candidate morphology is 아끼-시-어 → 아끼셔; the ㅅ belongs to the honorific ending, not the fortis /k͈/ in 끼. Retain underlying /s/; NIKL's general description predicts [ʃ] before /j/. | The exact no-요 contraction is not directly attested by the cited NIKL pages; [ʃ] is a general profile expectation, not speaker-specific narrow gold. |
| Three occurrences of `한국여자로` | Conditional Rule 29 path for explicit `한국 여자로` in connected-phrase mode. | Compact token does not establish the boundary or prosodic grouping; no automatic rewrite. |
| `대한민국` | Retain canonical broad vowel; preserve [ɛ]~[e] only as a research variant set. | Group-level merger studies cannot select this speaker's vowel quality or length. |
| `첫연애실패후` | NIKL Q&A directly documents three readings for `첫 연애`: connected [천녀내], pause [첟#여내], and liaison without n-insertion [처뎌내]. | No choice among these for the compact corpus token or its full phrase. |

The adjudication matrix records one row per source adjudication, all occurrence IDs, structural analysis, source IDs, claim IDs, and claim limits. The companion [claim-level evidence ledger](../research/kozak-kim-40-adjudication-evidence-claims-2026-11-08.csv) records one atomic claim per row and exactly one source per row. It intentionally does not add an IPA string where the sources do not establish one.

## Why these source decisions are justified

### Glide and hiatus cases

Kim & Hong (2025) directly studied the distinction between transitions and glides in /iə~ijə/ and /oa~owa/. Their results show that the sequences are not uniformly distinguished and that glide-like enhancement has measurable cues. Their stimuli do **not** include 오억 or the numeral compound 오조오억배. Kim (2021) reports that VV transitions vary with relative vowel openness, while Shin (2013), studying ten Standard Korean speakers, reports optional /j/ formation/insertion conditioned by stem shape, syllable count and speech rate. Kang's hiatus-resolution study also concerns adjacent VV sequences, not the target numeral or /i.i/ items. Together, these sources justify *not adding a categorical glide* to the target forms; they do not establish the exact speaker's narrow transition or a categorical /j/ insertion rule. [Kim25e] [Kim21f] [Unk13n] [Kan10b]

The three 체험 forms are a simpler structural case: the sequence is /e.hʌ/, not adjacent vowels. The proposed extra glide is blocked by the intervening /h/. This is a grapheme/morpheme structure decision, not an inference about acoustic transition.

### Sibilants

NIKL's 1993 phonetics article *자음의 발음* states that ㅅ has the value [s] generally and is realized near the palate as [ʃ] before [i] or [j]. NIKL's Romanization page classifies ㅕ and ㅛ as diphthongs (yeo/yo), so the written ㅕ/ㅛ contexts in this cohort contain the relevant /j/ onglide. This supports underlying /s/ with a general profile-level [ʃ] expectation in those contexts; it does not provide acoustic measurements for these exact UGTPHON tokens, and [ʃ] must not be silently relabeled [ɕ]. Kang's acoustic study independently reports context-sensitive changes in the first 30 ms of lenis /s/ before /i, ye, ya/ and a distinct spectral pattern before /yo, yu/; it does not measure the exact /jʌ/ tokens. The five-speaker EPG study compares /s/ and fortis /s*/ in /i, a, u/ contexts, while Sung reports speaker- and morphology-sensitive palatalization gestures. None supplies speaker-specific narrow IPA for this corpus. [SRC-NIKL-PHONETICS-1993] [SRC-NIKL-ROMANIZATION] [Kan10d] [Kan10e] [Kim21c] [Sun14]

For `쇼`, NIKL says to pronounce the foreign word according to Hangul spelling, but does not provide an IPA transcription. The separate rounded-segment acoustic paper reports a labio-palatalized spectral pattern, not a canonical segment symbol. Thus the engine keeps broad /s/ and does not invent [ɕʷ]. [SRC-NIKL-QNA-332662]

### N-insertion and prosody

NIKL Rule 29 and Q&A 330322 establish that n-insertion can apply across two words pronounced as one connected phrase. Q&A 316146 is more specific: `첫 연애` has connected [천녀내], pause [첟#여내], and liaison [처뎌내] possibilities. Jun (2015, 2021) shows that n-insertion is variable and conditioned by phonological and morphological factors, including dialect; it should not be applied as a universal categorical rewrite. This justifies explicit phrase mode and preserving ambiguity for compact strings. [Jun15] [Jun21]

### Mid-front vowel and `대한민국`

The Seoul /ɛ/–/e/ literature finds merger and residual differentiation conditioned by cohort, gender, and syllable position. The cited studies are group-level and do not identify the corpus speaker or this token's acoustic quality. Therefore [ɛ]~[e] remains a research variant set; no single speaker-level value is selected. [Lee23] [Lee21] [Eychenne15]

### Genitive `의` and the limit of corpus-level acoustic evidence

The Seoul Corpus literature provides recordings and phonemic labels from 40 Seoul Korean speakers. The study of 2,370 /ɨi/ tokens reports that 602/628 (95.86%) monophthongized genitive tokens were [e], while 94.40% of monophthongized tokens overall were [i]. This supports retaining both source-derived broad candidates /sal.mɰi/ and /sal.me/ for NIKL [살믜]/[살메], but the genitive aggregate does not select this token. The Seoul Corpus is described as 40-speaker spontaneous speech with phonemic/TextGrid annotation. OpenSLR SLR113 publicly lists the label and sound archives under CC BY-NC 2.0, giving a concrete non-commercial retrieval route; however, the 57 MB TextGrid archive could not be downloaded in this environment, so no exact `삶의` hit, speaker, timestamp or matching audio segment is confirmed. A 2025 abstract on 의 variation reports additional context-conditioned realizations but was not used to add a runtime rule. Thus this literature can inform the variant inventory but cannot choose a speaker-specific realization for a particular `삶의` token. [Unk16l] [Yun15] [Yun17b]

## 2026-11-08 claim-level source reconciliation

The evidence ledger is the authoritative mapping from each adjudication row to atomic claims and their individual sources. Every ledger row has exactly one `source_id`, a source URL, an evidence-type label, a directness label, the supported proposition, and an explicit claim limit. The adjudication CSV's `claim_ids` column points to those rows. Multiple sources are not bundled as if they proved the same proposition.

### Corrections and evidence boundaries

- **Incorrect citation removed:** `SRC-NIKL-QNA-321634` concerns the adjective `시다` (“sour”), not the honorific prefinal ending `-시-`. It is retained in the evidence ledger only as an explicitly excluded source and is no longer attached to the `아끼셔` adjudication.
- **Replacement evidence:** NIKL Q&A 332091 discusses `-세요` as the shortened form of `-시어요`; NIKL MCFAQ 6288 explicitly describes `-셔요` as a shortened form of `-시어요`. Neither directly attests the exact no-`요` token `아끼셔`. The parse `아끼-시-어` is therefore a source-supported morphological analysis, but the exact token contraction remains qualified rather than claimed as a directly documented dictionary example.
- **Sibilant evidence corrected:** NIKL's 1993 phonetics article *자음의 발음* states that ㅅ has the value [s] generally and is realized near the palate as [ʃ] before [i] or [j]. NIKL's Romanization page classifies ㅕ and ㅛ as diphthongs (yeo/yo), supporting a /j/ onglide in the relevant written syllables. This supplies a general Standard Korean [ʃ] profile expectation for `쇼`, `모션어디서`, `포지션을`, `뿌셔…`, and `아끼셔`. It is not a recording or acoustic measurement of these 40 tokens, and the source symbol is [ʃ], not [ɕ]. Kang (2010) independently measures /s/ before /i, ye, ya/ and separately /yo, yu/, but not the exact /jʌ/ tokens. Therefore retain the underlying phoneme /s/, expose [ʃ] only as a source-backed profile expectation where the /j/ environment is present, and do not claim speaker-specific narrow IPA.
- **N-insertion:** NIKL Q&A 330322 directly establishes the connected-phrase condition in Rule 29 supplement 2. Jun (2015, 2021) independently supports variable/gradient application. Neither source establishes the prosodic grouping of compact corpus tokens `홍콩영화들` or `한국여자로`.
- **First-love phrase:** NIKL Q&A 316146 directly covers the spaced substring `첫 연애`, not the full compact token `첫연애실패후`. Its three alternatives remain conditional; no one is selected for the occurrence.
- **Glide/hiatus:** Kim & Hong (2025) directly study /iə~ijə/ and /oa~owa/, not `오억` or `자기이입하네`. Shin (2013) studies optional /j/ formation/insertion in other structures. These papers justify caution against categorical insertion, not a speaker-specific transcription.
- **UGTPHON source-only claims:** the upstream `ko/test.json` was fetched and checked at commit `59380491d5a797308c475f7d0007dcf6c4be00af` (275 records). The claim ledger records exact source-row IDs, including `multilexnorm2026_1922`, `multilexnorm2026_1954`, `multilexnorm2026_1999`, `multilexnorm2026_2004`, `dc_inside_2024`, `dc_inside_2035`, `dc_inside_2110`, `dc_inside_2124`, `dc_inside_2135`, `dc_inside_2170`, `dc_inside_2227`, `dc_inside_2232`, and `dc_inside_2544`. The raw `ㅠ` material and its normalized `유` rendering are confirmed in source records `dc_inside_2124` and `dc_inside_2135`; exact sub-span boundaries still require validation before automated runtime exclusion.
- **Vowel merger:** Lee & Cho (2021) and Lee (2023) provide population-level evidence about /e/–/ɛ/ variation. Neither identifies the unknown speaker or the acoustic realization of `대한민국`.

### Status interpretation

`VERIFIED_PRIMARY_PAGE` means the official source page was opened and its relevant statement checked. `VERIFIED_KCI_PUBLISHER_ABSTRACT` or `VERIFIED_DOI_METADATA` means publisher/index metadata and abstract were checked, not necessarily the full experimental paper. `INDIRECT_FOR_TARGET` means the study supports a general mechanism but did not test the adjudicated token. `TARGET_CONTEXT_NOT_COVERED`, `AUDIO_ABSENT`, and `RAW_OFFSETS_REQUIRE_REVALIDATION` are explicit evidence limits, not resolved claims.

**Result:** all 40 occurrences are accepted for the repository's source-based adjudication and engine-policy scope without audio. The 0/40 speaker-specific narrow IPA annotation count is a separate, optional research dimension and is not a blocker. Evidence limits remain explicit: the exact no-`요` form `아끼셔` is not directly attested by the cited morphology pages; compact n-insertion candidates retain conditional phrase-mode policies rather than inferred hidden prosody; and raw emoticon span offsets must be revalidated before automated runtime slicing. None of these limits makes audio a prerequisite for accepting the supported source-based decisions.

## Research source links

- NIKL [Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002), especially Rule 29 and supplement 2.
- NIKL [Q&A 330322](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=330322): connected-phrase scope for Rule 29.
- NIKL [Q&A 316146](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=316146): exact `첫 연애` prosodic alternatives.
- NIKL [Q&A 332662](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=332662): `쇼` read according to Hangul spelling; NIKL [Romanization of Korean](https://www.korean.go.kr/front_eng/roman/roman_01.do): ㅕ/ㅛ classified as diphthongs; NIKL [Song (1993), 자음의 발음](https://www.korean.go.kr/nkview/nklife/1993_1/1993_0101.pdf): ㅅ [s] generally, [ʃ] before [i] or [j].
- NIKL [Q&A 332091](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=332091): analysis of `-세요` and `-시-`; NIKL [MCFAQ 6288](https://korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=6288&mn_id=217&pageIndex=1): `-셔요` as shortened `-시어요`. Q&A 321634 is excluded because it concerns adjective `시다`, not honorific `-시-`.
- [Kim & Hong 2025](https://doi.org/10.30961/lr.2025.61.1.1); [Kang 2010, hiatus resolution](https://doi.org/10.3765/BLS.V36I1.3910).
- [Kang 2010, lenis /s/ coarticulation](https://doi.org/10.17959/SPPM.2010.16.1.3); [Kang 2010, high-front + rounded context](https://www.semanticscholar.org/paper/bf95ee5d14eecfa8b4891aa949b4789063afd328); [Kim et al. 2021 EPG](https://doi.org/10.12963/csd.21815); [Sung 2014](https://doi.org/10.21437/Interspeech.2014-27).
- [Jun 2015](https://doi.org/10.1017/S0952675715000275); [Jun 2021](https://doi.org/10.5334/GJGL.1401).
- [Park et al. 2016, /의/ monophthongization](https://doi.org/10.17959/SPPM.2016.22.1.35); [Yun et al. 2015 Seoul Corpus](https://doi.org/10.13064/KSSS.2015.7.2.103); [Yun 2017 Seoul Corpus](https://doi.org/10.1109/ICSDA.2017.8384420).
- [Lee 2023](https://doi.org/10.17959/sppm.2023.29.2.193); [Lee 2021](https://doi.org/10.17002/sil..61.202110.1); [Eychenne et al. 2015](https://doi.org/10.13064/KSSS.2015.7.2.119).

## Undermind research trails

The completed literature searches and their summaries are available in the research workspace:

- [Korean sibilant /jʌ/ contexts](https://app.undermind.ai/projects/de353992-202a-4b09-bf19-47932f80e426?path=%2FKorean%20sibilant%20j%CA%8C%20contexts)
- [Korean phrase n-insertion](https://app.undermind.ai/projects/de353992-202a-4b09-bf19-47932f80e426?path=%2FKorean%20phrase%20n%20insertion)
- [Korean vowel hiatus and glides](https://app.undermind.ai/projects/de353992-202a-4b09-bf19-47932f80e426?path=%2FKorean%20vowel%20hiatus%20and%20glides)
- [Korean sibilant palatalization before ㅕ and fortis contexts](https://app.undermind.ai/projects/de353992-202a-4b09-bf19-47932f80e426?path=%2FKorean%20sibilant%20palatalization%20before%20%E3%85%95%20and%20fortis%20contexts)
- [삶의 IPA and genitive 의 variation](https://app.undermind.ai/projects/de353992-202a-4b09-bf19-47932f80e426?path=%2F%EC%82%B6%EC%9D%98%20IPA%20and%20genitive%20%EC%9D%98%20acoustic%20variation)

## Implementation and acceptance

No runtime rule was added in this pass because the current engine policy already matches the source-supported distinctions. In particular:

1. Phrase-mode Rule 29 is conditional on explicit word segmentation and connected-phrase mode; compact corpus strings remain unchanged.
2. Broad /s/ remains canonical before /jʌ/; optional narrow [ɕ] is not inferred from spelling.
3. Research-only [ɛ]~[e] remains a variant set, not a selected speaker value.
4. Raw `ㅠ` emoticons remain outside G2P.
5. Broad /i.i/ and /o.ʌ/ are not rewritten by unverified hiatus rules.

**Acceptance outcome:** 40/40 source-based engine-policy decisions are accepted without audio. Speaker-specific narrow IPA gold is an optional, non-blocking annotation dimension (0/40), not a release gate. Compact n-insertion cases are accepted as conditional policies, and no hidden prosodic grouping is inferred. The emoticon classification is accepted; exact span offsets remain a separate runtime-boundary check. This is a source-grounded production-policy result, not an independently annotated acoustic benchmark.

## 2026-11-07 benchmark-fragment taxonomy correction

The existing mismatch taxonomy already reserves **C13** for source-attested lexical vowel length. The genitive-particle difference is therefore registered as **C14 — `C14_NIKL_GENITIVE_UI_PARTICLE`**, not as a resyllabification class.

The 16 strict mismatch fragments are limited to five exact benchmark token forms:

- `그놈의`: 1 occurrence
- `대황본의`: 3 occurrences
- `염전의`: 10 occurrences
- `대한민국의`: 1 occurrence
- `삶의`: 1 occurrence

NIKL Q&A 335190 distinguishes the genitive-particle allowance ([ɯi] as the principal form and [e] as a permitted variant) from non-initial lexical `의` [i]. NIKL MCFAQ 5716 directly attests `삶의` as [살믜]/[살메]. The classifier uses an explicit exact-form allowlist; it does **not** infer genitive morphology from the orthographic sequence coda+`의`.

This benchmark classification is distinct from the runtime liaison-provenance correction for lexical `협의` [혀븨]/[혀비]. The latter preserves the /ɰi/ path when a coda is resyllabified into the onset before `ㅢ`; it is not a genitive-particle exception.

Of the 16 strict fragments, only the `그놈의` occurrence remains in the broad unmapped review queue, because that occurrence also has a separate unresolved /e/ versus /i/ fragment. The other 15 are source-adjudicated variants, not speaker-specific IPA gold. No Ukrainian target is promoted by this classification.



## 2026-11-08 acceptance clarification: audio is not a gate

The repository's target is a source-grounded Korean-to-Ukrainian pronunciation policy, not speaker diarization or acoustic phonetic annotation. Therefore, audio is **not required** to accept an adjudication when authoritative orthographic, morphological, phonological, normative-pronunciation, and corpus sources support the decision at the required level.

Acceptance is based on the `source_acceptance_status` field in `research/kozak-kim-40-no-audio-engine-policy-2026-11-06.csv`. The legacy `speaker_ipa_gold_status=UNRESOLVED_NO_AUDIO` records only that speaker-specific acoustic gold was not annotated. It is not an acceptance blocker and must not be interpreted as an unfinished source adjudication.

The accepted scope includes broad/profile-level IPA and explicit conditional rules. It does not claim an unknown speaker's exact narrow realization. Conditional phrase-level processes remain conditional where the compact corpus spelling does not encode boundaries; this is a correct accepted policy, not an unresolved task. The raw emoticon spans are accepted as non-speech source material; their exact subspan offsets must be checked before automated slicing, independently of audio.


## 2026-11-08 runtime integration — PR #461

The 17 adjudication families and all 40 occurrence IDs are now represented in the shared, versioned runtime registry `src/korean_ukrainian/source_adjudications.json`. Both the browser engine and Python pipeline attach bounded, exact-form `source_adjudications` metadata to their result objects. The registry is packaged with the Python distribution. This makes the accepted decision, evidence IDs, claim IDs, occurrence IDs, and implementation constraint inspectable at runtime.

This is deliberately a **policy/traceability integration, not a new phonological rewrite**. The source adjudications mostly confirm conservative behavior already implemented: preserve broad vowel sequences, do not add categorical glides/coalescence, retain underlying /s/ rather than inventing [ɕ], keep [ɛ]~[e] research-only, preserve stylized spellings, and apply Rule 29 only in explicitly spaced connected-phrase mode. The registry does not rewrite Hangul, IPA, or Ukrainian output. It must not be interpreted as speaker-specific narrow IPA gold.

The exact-form matcher requires a Korean-script boundary, so a substring inside a longer Korean eojeol is not silently promoted. The three conditional Rule 29 families expose metadata for their compact source token and explicit spaced phrase; only the existing phrase-mode rule can change the phonological result when the user actually supplies the boundary and selects phrase mode.

**Two of the 40 occurrence rows are intentionally not auto-matched:** the original raw source contained compatibility-jamo `ㅠ` emoticon spans, while the corpus's normalized token strings contain `유`. The accepted source classification remains in the registry, but the runtime does not mistake normalized `유` for spoken /ju/ or slice the string. Exact raw-span offsets must be revalidated before a source-preserving non-speech span can be applied automatically. This is an implementation-boundary check, not an audio dependency.

Regression coverage checks all 15 runtime-matchable distinct token forms, the 22-occurrence `아끼셔` family, both explicit phrase forms, the no-match behavior for normalized `유` lookalikes, and the invariant that attaching adjudication metadata does not mutate IPA or Ukrainian output. PR #461 CI is the acceptance oracle; no local test result is claimed from the connector-only environment.
