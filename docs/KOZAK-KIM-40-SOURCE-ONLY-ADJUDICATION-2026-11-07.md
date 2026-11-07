# Kozak Kim: source-only adjudication of the 40 residual occurrences

**Date:** 2026-11-07  
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
- **Speaker-specific IPA gold remains 0/40:** this is a separate claim and remains unresolved without the original recording/speaker crosswalk.

The label `UNRESOLVED_NO_AUDIO` in the original occurrence CSV is retained deliberately: it means *speaker-specific IPA gold is unavailable*, not that the engine has no source-based policy.

## Source-based adjudication

| Token(s) | Source-supported decision | What is not inferred |
|---|---|---|
| `오조오억배` | Keep broad /o.ʌ/ inside 오억; do not insert phonemic /j/ or /w/ from a transition. Keep the separate /o.o/ sequence at 조–오 distinct. | No narrow glide choice or token-specific connected-speech realization. |
| `문화체험공간`, `사전체험`, `만듬사전체험때` | In 체험, /h/ intervenes between /e/ and /ʌ/: /e.hʌ/. It is not adjacent-VV hiatus, so no extra /j/ is inserted. | No change to the lexical /h/ onset; no glide insertion inferred from unrelated VV experiments. |
| `쇼` | NIKL says foreign-word 쇼 is read according to its Hangul spelling. Keep broad phonemic /s/. | NIKL does not provide IPA. Rounded coarticulation is not a categorical [ɕ] or [ɕʷ] segment. |
| `홍콩영화들` | Rule 29 [붙임 2] permits n-insertion only when two explicitly segmented words are pronounced as one connected phrase. Phrase-mode path remains available for `홍콩 영화들`. | Compact `홍콩영화들` does not establish hidden spacing or prosodic grouping. |
| `모션어디서`, `포지션을` | Keep broad /s/ before /jʌ/ in the loanword syllables. | Available acoustic [ɕ]-like evidence is for other high-front contexts; it does not establish categorical [ɕ] before /jʌ/. |
| `자기이입하네` | Preserve the broad /i.i/ sequence. Do not delete a vowel nucleus or insert an extra /j/ categorically. | No speaker-specific hiatus resolution or coalescence. |
| `뿌셔우우`, `뿌셔우우우` | Preserve playful UGC spelling; if read from Hangul, retain broad /s/ rather than adding a special [ɕ] rule. | Do not normalize to another lexical form or claim the intended lexeme/narrow sound is known. |
| Two normalized records containing repeated `유` | The source context contains raw compatibility-jamo `ㅠ` emoticons. Preserve raw `ㅠ` and exclude those spans from G2P. | Do not treat normalized `유` as spoken /ju/; the emoticon has no IPA target. |
| 22 occurrences of `아끼셔` | Morphology is 아끼-시-어 → 아끼셔. The ㅅ in the honorific ending is lenis /s/; /k͈/ in 끼 is a different consonant. Keep broad /s/ before /jʌ/. | No categorical [ɕ], no fortis reinterpretation, and no speaker-specific narrow realization. |
| Three occurrences of `한국여자로` | Conditional Rule 29 path for explicit `한국 여자로` in connected-phrase mode. | Compact token does not establish the boundary or prosodic grouping; no automatic rewrite. |
| `대한민국` | Retain canonical broad vowel; preserve [ɛ]~[e] only as a research variant set. | Group-level merger studies cannot select this speaker's vowel quality or length. |
| `첫연애실패후` | NIKL Q&A directly documents three readings for `첫 연애`: connected [천녀내], pause [첟#여내], and liaison without n-insertion [처뎌내]. | No choice among these for the compact corpus token or its full phrase. |

The machine-readable matrix records one row per distinct spelling, all occurrence IDs, morphological/structural analysis, source IDs, and the exact claim limit. It intentionally does not add an IPA string where the sources do not establish one.

## Why these source decisions are justified

### Glide and hiatus cases

Kim & Hong (2025) directly studied the distinction between transitions and glides in /iə~ijə/ and /oa~owa/. Their results show that the sequences are not uniformly distinguished and that glide-like enhancement has measurable cues. Their stimuli do **not** include 오억 or the numeral compound 오조오억배. Kim (2021) reports that VV transitions vary with relative vowel openness, while Shin (2013), studying ten Standard Korean speakers, reports optional /j/ formation/insertion conditioned by stem shape, syllable count and speech rate. Kang's hiatus-resolution study also concerns adjacent VV sequences, not the target numeral or /i.i/ items. Together, these sources justify *not adding a categorical glide* to the target forms; they do not establish the exact speaker's narrow transition or a categorical /j/ insertion rule. [Kim25e] [Kim21f] [Unk13n] [Kan10b]

The three 체험 forms are a simpler structural case: the sequence is /e.hʌ/, not adjacent vowels. The proposed extra glide is blocked by the intervening /h/. This is a grapheme/morpheme structure decision, not an inference about acoustic transition.

### Sibilants

Kang's acoustic study reports context-sensitive changes in the first 30 ms of lenis /s/ before /i, ye, ya/; it separately reports that /yo, yu/ have a different spectral pattern. The five-speaker EPG study compares /s/ and fortis /s*/ in /i, a, u/ contexts and finds articulatory differences, but it does not test /jʌ/ or the exact honorific contraction. The palatalization study by Sung also finds speaker- and morphology-sensitive gestural effects. Together, these sources support keeping the phonemic/broad contrast and rejecting a blanket spelling-triggered [ɕ] rule; they do not prove that every token is phonetically [s]. [Kan10d] [Kan10e] [Kim21c] [Sun14]

For `쇼`, NIKL says to pronounce the foreign word according to Hangul spelling, but does not provide an IPA transcription. The separate rounded-segment acoustic paper reports a labio-palatalized spectral pattern, not a canonical segment symbol. Thus the engine keeps broad /s/ and does not invent [ɕʷ]. [SRC-NIKL-QNA-332662]

### N-insertion and prosody

NIKL Rule 29 and Q&A 330322 establish that n-insertion can apply across two words pronounced as one connected phrase. Q&A 316146 is more specific: `첫 연애` has connected [천녀내], pause [첟#여내], and liaison [처뎌내] possibilities. Jun (2015, 2021) shows that n-insertion is variable and conditioned by phonological and morphological factors, including dialect; it should not be applied as a universal categorical rewrite. This justifies explicit phrase mode and preserving ambiguity for compact strings. [Jun15] [Jun21]

### Mid-front vowel and `대한민국`

The Seoul /ɛ/–/e/ literature finds merger and residual differentiation conditioned by cohort, gender, and syllable position. The cited studies are group-level and do not identify the corpus speaker or this token's acoustic quality. Therefore [ɛ]~[e] remains a research variant set; no single speaker-level value is selected. [Lee23] [Lee21] [Eychenne15]

### Genitive `의` and the limit of corpus-level acoustic evidence

The Seoul Corpus literature provides recordings and phonemic labels from 40 Seoul Korean speakers. The study of 2,370 /ɨi/ tokens reports that 602/628 (95.86%) monophthongized genitive tokens were [e], while 94.40% of monophthongized tokens overall were [i]. This supports retaining both source-derived broad candidates /sal.mɰi/ and /sal.me/ for NIKL [살믜]/[살메], but the genitive aggregate does not select this token. The Seoul Corpus is described as 40-speaker spontaneous speech with phonemic/TextGrid annotation; the source search still did not confirm an exact `삶의` token, speaker, timestamp, or a currently lawful token-level retrieval route. A 2025 abstract on 의 variation reports additional context-conditioned realizations but was not used to add a runtime rule. Thus this literature can inform the variant inventory but cannot choose a speaker-specific realization for a particular `삶의` token. [Unk16l] [Yun15] [Yun17b]

## Research source links

- NIKL [Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002), especially Rule 29 and supplement 2.
- NIKL [Q&A 330322](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=330322): connected-phrase scope for Rule 29.
- NIKL [Q&A 316146](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=316146): exact `첫 연애` prosodic alternatives.
- NIKL [Q&A 332662](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=332662): `쇼` read according to Hangul spelling.
- NIKL [Q&A 332091](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=332091): `-세요` is the shortened form of `-시어요`; [Q&A 321634](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=321634) directly documents `시어` → `셔`.
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

**Acceptance outcome:** source-based engine policy is adjudicated for all 40 occurrences. Speaker-specific narrow IPA gold remains unavailable for 40/40, and the exact prosodic realization of compact n-insertion candidates remains conditional. This is a source-grounded production-policy result, not an independently annotated acoustic benchmark.

