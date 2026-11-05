## 2026-11-05 — Current evidence adjudication: 191 dispositioned, 45 open

**Baseline:** 236 reconstructed candidate occurrences, all retained. **Current disposition:** 11 `RULE_CONFIRMED_STANDARD_VARIANT`, 180 `PROFILE_CONVENTION_MISMATCH_CONFIRMED`, 17 `ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW`, and 28 `NOT_INDIVIDUALLY_ADJUDICATED`. Thus 191 are dispositioned and **45 remain unresolved**. No case in this queue has independent speaker-level acoustic IPA gold.

**Eleven exact rule/lexical cases:** 341 `그놈의`; 826 `유사성`; 1140 `출산`; 1406 `팔자걸음`; 1527 `보일거라`; 2001 `물가로`; 2010 `혐오증`; 2092 `출시미정에`; 2490 `머리속에` → standard `머릿속에`; 2533 `안할듯`; and 1610 `자신의`. Each is supported by exact NIKL standard/dictionary/educational evidence or the recorded expert lexical attestation, scoped to the exact form and morphology. No productive rule is generalized beyond the documented environment.

**180 profile/variation cases:** 149 lenis-sibilant `ɕ→s` occurrences in the research-supported /i, ye, ya/ contexts (including IDs 49 `무슨뜻임` and 143 `멋있노`, where ㅅ is resyllabified before /i/); 23 fortis `ɕ͈→s͈` place-symbol pairs; three Rule 13 resyllabification contexts (475, 2392, 2667); three earlier lexical/profile cases (520, 2307, 2562); ID 2462 (`주는대로`, ㅐ /ɛ/ vs comparator /e/); and ID 2170 (`게임`, documented [께임]~[게임] loanword variation). These close only exact benchmark/profile discrepancies; they do not claim that a specific speaker produced a particular narrow phone.

**ID 2170 `게임` — new official source review:** the National Institute of Korean Language's 2005 usage column `외래어의 s 발음` lists `게임[께임]` among loanwords commonly pronounced with a fortis initial and describes a contemporary shift in announcer speech from `[께임]` toward `[게임]`. Thus the comparator /k͈/ and project /k/ are both documented variants. This is a profile/variation closure for this exact token only; it does not select the candidate speaker's pronunciation. The source is qualitative and dated; no audio or speaker identity is available. Citation only; item-level reuse terms not separately assessed. Source ID: `SRC-NIKL-LOANWORD-GAME-2005`.

**17 abstentions:** 78 `오조오억배`; 257 `문화체험공간`; 538 `멋있어`; 545 `정권`; 643 `홍콩영화들`; 813 `사전체험`; 853 `만듬사전체험때`; 899 `자기이입하네`; 1219 (elongated UGC token ending `정액싸고`); 1288 (mixed long UGC token); 1805/1832/1859 `한국여자로`; 1816/1843/1870 `연전연패`; and 2215 `첫연애실패후`. These remain open for glide insertion, source-specific lexical or IPA evidence, mixed edit signatures, or prosodic boundary decisions.

**28 unadjudicated occurrences:** 606 `쇼`; 843 `모션어디서`; 1155/1157 `뿌셔우우` variants; 22 repeated `아끼셔` occurrences (IDs 1414–1477) in one source row; 1885 `대한민국` (/ɛː/ vs /eː/); and 2489 `포지션을` (/ɕ/ before /jʌ/). The repeated `아끼셔` tokens are one source-row/token family, not 22 independent speakers.

**Full-text literature and limits:** Kim & Hong (2025) [Kim25e] and Kang (2010) [Kan10b] do not establish categorical glide insertion for `체험` or `오조오억배`; Kim et al. (2021) [Kim21c] and Kong & Kang (2021) [Kon21] support context-dependent sibilant variation but not token-specific narrow IPA. Jun (2015) [Jun14] documents variable n-insertion, not item-specific evidence for `연전연패`. Kang's lenis findings are not transferred to fortis /s͈/ or /jʌ/ contexts.

**Interpretation:** 11 exact standard-form/rule decisions + 180 broad-profile/variation reconciliations; **none are speaker-level acoustic IPA gold**. No production IPA, Ukrainian target, benchmark gold, or runtime rule changed.

**Reproducibility/verification:** the generator pins the current adjudication-register blob; the generated CSV retains all 236 rows. The source register has 201 entries (3 item-level licenses, 1 not applicable, 176 rights-review required, 21 manual classification required; 197 open). Last available exact-head CI failed on stale test expectations; those expectations have been corrected and updated again for the new source/case, but no exact-head run is available yet. Local pytest/npm were not run in this connector-only session. No test pass is claimed.

**Readiness:** partial research prototype, not research-certified or release-ready. The remaining 45 occurrences need exact item-specific evidence and/or independent IPA/audio review.

---

---

## Previous snapshot (superseded)

## 2026-11-05 — 159 evidence-supported resolutions (nine standard-form, 150 profile-convention)

**Current status:** the reconstructed baseline remains **236 occurrence rows**. Nine are `RULE_CONFIRMED_STANDARD_VARIANT`: **IDs 341, 826, 1140, 1406, 1527, 2001, 2010, 2490 and 2533**. A further **150 occurrences** are `PROFILE_CONVENTION_MISMATCH_CONFIRMED`: three earlier lexical/profile cases (IDs 2562, 520 and 2307) plus **147 lenis-sibilant occurrences across 106 exact source-row/token families**. The active unresolved count is **77**: 57 without individual disposition and 20 abstained pending independent IPA review. All 236 original rows remain in the ledger.

- **ID 78 — 오조오억배 remains ABSTAIN.** NIKL Rule 4 classifies ㅓ as a monophthong, but that does not exclude a separate glide or transitional interval in a V.V sequence. The 2025 full-text study by Kim & Hong tests 기억–기역 and 보안–보완 within-word sequences, not 오억 or numeral compounds; for 보완 it attributes the distinction mainly to longer preserved /o/ rounding rather than a clearly separate /w/ gesture. No located study tests 오조오억배 or the exact /o.ʌ/ numeral boundary. Keep pending token audio or independent Korean IPA review.
- **ID 2562 — 정신병자네:** the official NIKL Basic Dictionary lists `정신병자[정신뼝자]`; the current engine applies the exact full-form R014 / §28 license `정신병자네: 신>병`, and the existing regression asserts `정신뼝자네`. This closes the historical `p͈→b` mismatch. The other historical difference, comparator `ɕ` versus project broad `/s/`, occurs in `신` before `ㅣ`; the broad profile keeps `/s/` canonical and exposes `[ɕ]` only as a research-only optional variant in the `/i, ye, ya/` contexts supported by Kang (2010). This is a profile-convention resolution, not a token-specific acoustic IPA adjudication. No general ㄴ+ㅂ fortition rule is inferred.
- **IDs 520 and 2307 — 없다:** the official NIKL Basic Dictionary lists `없다[업ː따]`, confirming the long vowel (Hangul bracket notation is not IPA). Lee (1993), JIPA p.31, explicitly uses `/ʌː/` in the Seoul Korean long-vowel inventory. The IPA-Dict-derived comparator's `/ɘː/` versus the project's broad `/ʌː/` is therefore recorded as a transcription-profile difference, not a token-level acoustic or phonemic error. Both rows are the same lexical form in different source rows and are not independent speaker confirmations. Existing regression `tests/test_pipeline.py` preserves `없다` as `ʌːp̚.t͈a`; no production change.
- **ID 826 — 유사성:** the official NIKL Korean Basic Dictionary entry 70710 directly gives `유사성[유ː사썽]`. The context is `장르의 유사성`; the comparator's /s͈/ matches the official fortis reading, while Kozak's /s/ does not. Exact lexical attestation only; no general `-성` fortition rule is inferred.
- **ID 2490 — 머리속에:** the context '포지션을 머리속에 집어넣고서' uses the figurative lexical item 머릿속 ('in one's mind'). Korean-language professor Kim Nam-mi explicitly attests 머릿속[머리쏙]. The comparator's /s͈/ matches this exact lexical form; Kozak's /s/ does not. This is an exact lexical attestation, not a productive rule for arbitrary 머리+속 sequences. The corpus spelling lacks the standard 사이시옷; no token audio or acoustic IPA review was performed.
- **ID 341 — 그놈의:** NIKL Standard Pronunciation Rule 5 distinguishes non-initial lexical 의 (where [i] is permitted) from the genitive particle 의 (where [e] is an accepted variant alongside [ɯi]). The canonical context makes 의 the genitive particle. The comparator's [e] is normatively supported; Kozak's [i] is not the rule's listed particle variant.
- **ID 1140 — 출산:** NIKL Basic Dictionary directly lists 출산[출싼]. Kozak's fortis s͈ matches; the IPA-Dict comparator omits fortis. This upgrades the historical provisional RETAIN for R012. Exact lexical attestation only.
- **ID 1406 — 팔자걸음:** NIKL Basic Dictionary lists 팔자[팔짜]; Rule 26 licenses ㄹ+ㅈ fortition in Sino-Korean words. The candidate contains this exact Sino-Korean morpheme.
- **ID 1527 — 보일거라:** the context parses as 보일 거라 생각하는 건가: adnominal 보이-ㄹ followed by dependent noun 거 (colloquial 것). Rule 27 licenses fortition after adnominal -(으)ㄹ; NIKL's parallel example is 할 것을[할꺼슬]. The comparator's /k͈/ is supported over Kozak's /ɡ/ for this exact morphosyntactic context. No general ㄹ+ㄱ rewrite is inferred.
- **ID 2001 — 물가로:** an official NIKL educational PDF explicitly lists 물가[물까] in the price sense and contrasts 결과[결과] as a negative control. Exact lexical license only.
- **ID 2010 — 혐오증:** NIKL Basic Dictionary lists 혐오증[혀모쯩]. The standard form supports the fortis affricate tɕ͈; Kozak's lenis dʑ is unsupported. Exact lexical license only.
- **ID 2533 — 안할듯:** Rule 27 requires fortition after adnominal -(으)ㄹ before ㄱ/ㄷ/ㅂ/ㅅ/ㅈ; its commentary explicitly gives 할 듯하다[할뜨타다]. The candidate parses as 안 하-ㄹ + 듯. This is a connected adnominal construction, not a general ㄹ+ㄷ rule.
- **IDs 257 (문화체험공간), 813 (사전체험) and 853 (만듬사전체험때) remain ABSTAIN.** The proposed Rule 5 argument was rejected: 체험 is 체+험, and 험 contains ㅓ, not ㅕ. Rule 5 therefore does not establish that the comparator's /j/ is phonemic. Independent IPA annotation or token-level audio is required; IDs 813 and 853 are repeated tokens in one source row.
- **147 lenis-sibilant occurrences across 106 source-row/token families** are closed as profile-convention mismatches. Their only Broad-v2 mismatch is `ɕ→s`, and each exact Hangul token has ㅅ before ㅣ, ㅖ or ㅑ. The project broad profile keeps /s/ canonical and exposes [ɕ] only as a research-only optional variant; Kang (2010, S019) supports acoustic coarticulation in these contexts but not a categorical mapping. This is not a claim about the actual speaker's realization or token-specific IPA gold. The 147 occurrences include IDs 293 (실수) and 1206 (싫어서), previously abstained. ID 538 (멋있어) remains ABSTAIN because its discrepancy is not a lenis ㅅ onset in the supported contexts. Of the 157 context-compatible lenis operations, 148 are now closed; nine co-occur with other unresolved mismatch fragments and remain open. The 27 lenis operations outside /i, ye, ya/ contexts and all 24 fortis `ɕ͈→s͈` operations remain unresolved.
- **IDs 1816, 1843 and 1870 — 연전연패 — remain ABSTAIN.** Rule 29 is relevant to n-insertion, but Jun (2015) documents variability and does not provide item-specific evidence. Three repetitions in one source row are not independent speakers or acoustic confirmations.
- Current disposition counts: **204** NOT_INDIVIDUALLY_ADJUDICATED, **23** ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW, **0** pending RETAIN, and **8** RULE_CONFIRMED_STANDARD_VARIANT. Historical membership remains reconstructed, not proven.
- These are nine normative rule/lexical confirmations plus 150 profile-convention resolutions, not token-specific acoustic IPA gold. No production IPA, Ukrainian target, benchmark gold, or runtime rule changed.

**Additional research evidence:** Kim & Hong (2025), full text reviewed, DOI 10.30961/lr.2025.61.1.1; Holliday (2012), DOI 10.13064/KSSS.2012.4.1.067; Schertz & Kang (2022), DOI 10.1075/kl.16001.sch; Kong & Kang (2021), DOI 10.13064/KSSS.2021.13.1.037; Kim Nam-mi (2017), expert column in *Donga Ilbo* on 머릿속[머리쏙]; official NIKL Basic Dictionary entry 70710 for 유사성[유ː사썽].

 Scope and result

This is an evidence-preserving review inventory, not a phonological confirmation. It materializes the 236 candidate occurrences left after crosswalking three already-implemented exact-form fixes against the reconstructed 239-ID cohort.

| Measure | Result |
|---|---:|
| Reconstructed candidate IDs | 239 |
| IDs unique and joined to the pinned 370-row Broad-mismatch context superset | 239 / 239 |
| Existing exact-form FIX overlaps excluded | 3 (37, 704, 2031) |
| Candidate occurrences in this review ledger | **236** |
| Existing individual ABSTAIN overlaps | 22 |
| Provisional RETAIN | 1 (1140, 출산) |
| No individual disposition in current review registers | 213 |
| Distinct token strings | 151 |
| Distinct source rows / sentence contexts | 110 |
| Distinct source-row + token pairs | 168 |

The 236 are candidate occurrences, not 236 established pronunciation errors, not 236 distinct words, and not a post-fix benchmark mismatch count.

## Cohort reconstruction

The 239 IDs are from a hash-pinned replay of the pre-C11/C12 Broad-only aggregate C01–C10 classifier. The replay selects 239 unique occurrences from a 370-occurrence Broad-mismatch superset. The original historical per-fragment assignment snapshot or original selector was not preserved. Membership is therefore RECONSTRUCTED_CANDIDATE, not proof that these are exactly the original historical 239 members.

The 370-row superset joins to the pinned UGTPHON Korean test split at commit ef0d5a09c2ea1874c7206020f875cbd9cfea2f54 (Git blob 59380491d5a797308c475f7d0007dcf6c4be00af). It retains source-row IDs, token indices, sentence context, canonical context, phoneme annotation, engine/profile/normalizer provenance and benchmark artifact/report hashes.

## Existing decisions: do not overcount

- **3 FIX overlaps:** IDs 37 (해줄것), 704 (많을거같이) and 2031 (내릴수있는) have exact-form R013 licenses already implemented in Kozak Kim. The separate fourth R013 fix, occurrence 2018 (존중시킬수도있지만), is outside this reconstructed cohort. The three are excluded from the 236.
- **22 ABSTAIN overlaps:** these have individual rationale rows in the 31-row abstention register. They remain unresolved; ABSTAIN is not resolution and does not decrement the count.
- **One historical RETAIN upgraded:** occurrence 1140 (출산) is now a rule-confirmed exact lexical form under the NIKL dictionary entry; the prior R012 rationale remains preserved.
- **Current individual dispositions:** 20 ABSTAIN, nine rule-confirmed, 150 profile-convention mismatches confirmed, zero pending RETAIN, and 57 without individual disposition. The 370-row context ledger's default ABSTAIN / EVIDENCE_LIMITED_DIAGNOSTIC_ONLY remains a safe no-change baseline, not an individual review result.

## S018/S019 page-level source check and 236-case Hangul environment crosswalk

[Cambridge's primary PDF](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/07312FF2A7409D9C71A4FE83E12AA54D/S0025100300004758a.pdf/korean.pdf) was inspected directly: Lee (1993), printed p.31, describes /s/ as [ɕ] before /i/ or a diphthong beginning [j]. However, the same page explicitly classifies /s/ among the fortis sounds (/p,t,k,c,s/). Its [ɕ] statement therefore cannot be transferred to modern lenis /s/ without reconciling the source's phonological inventory and transcription conventions; nor does it directly adjudicate modern /s͈/. S018 remains useful for its separately scoped Seoul /h/, /l/ and release descriptions.

The more relevant lenis-sibilant source is S019, Kang (2010), *Coarticulation effects of Korean sibilant /s/ before a high front segment*. A second Kang (2010) study, S027, *Korean Sibilant /s/ before a High Front and a Round Segment*, treats a separate labio-palatalized spectral pattern when high-front and round segments co-occur within a syllable. Its KCI abstract reports acoustic palatalization/coarticulation before /i, ye, ya/ and a distinct spectral pattern before /yu, yo/. It supports a narrow, research-only hypothesis, not a categorical [ɕ] transcription rule. A deterministic Hangul crosswalk now checks only the explicit /i, ye, ya/ environments (ㅣ, ㅖ, ㅑ): **157 of 184** lenis `ɕ→s` edits across 156 candidate occurrences are context-compatible with that abstract. The remaining **27** lenis edits (27 occurrences, six token strings, five source rows; IDs 606, 843, 1155, 1157, 1414, 1417, 1420, 1423, 1426, 1429, 1432, 1435, 1438, 1441, 1444, 1447, 1450, 1453, 1456, 1459, 1462, 1465, 1468, 1471, 1474, 1477, and 2489) are outside S019's /i, ye, ya/ environments. One of these, ID 606 `쇼` (/yo/), is a separate high-front-plus-round context potentially relevant to S027 (Kang 2010), whose abstract describes a labio-palatalized spectral pattern but does not specify a canonical IPA segment. The other 26 operations remain outside the contexts of these two reviewed abstracts. None of these cases is licensed as a simple [ɕ] output by that evidence. The mixed `실시간` row (ID 551) has one lenis context plus a separate fortis `ɕ͈→s͈` operation; the second context is not lenis evidence. `신라시절` (ID 103) has two lenis operations in the covered contexts.

The full 24-operation fortis `ɕ͈→s͈` stratum remains separately unresolved. The crosswalk establishes context compatibility only for the 157 lenis operations; it does **not** establish the actual pronunciation of any token, speaker/dialect realization, source annotation correctness, or Ukrainian target. Both Kang abstracts were reviewed; the full acoustic data and independent IPA adjudication remain outstanding. S027 is a distinct labio-palatalization hypothesis, not an extension of the simple [ɕ] candidate. The 20 ABSTAIN rows and 57 rows without individual disposition remain open as recorded; 147 additional lenis-sibilant occurrences are closed as profile-convention mismatches.



### Fortis stratum triage

The 24 `ɕ͈→s͈` operations are now separated by orthographic source: 22 are on forms containing orthographic ㅆ (15 distinct token strings); two are coda-triggered fortition of ㅅ after ㄹ, in `했을시` (ID 481) and `실시간` (ID 551). The latter two share a high-front /i/ environment with lenis candidates but are fortis outputs. Lee's /s/ is classified as fortis in his own inventory, but that category cannot be mapped directly to modern /s͈/ without reconciling transcription conventions; neither S018 nor S019 independently adjudicates these modern fortis tokens. The 24 operations cover 17 token strings and 19 source rows. They remain a separate, unresolved stratum and cannot inherit C11's lenis decision.

## Case-level triage interpretation — review, not confirmation

The 236 rows have been reviewed structurally by occurrence identity, source context, prior disposition, edit signature and provenance. This is a case-family triage, not independent pronunciation adjudication.

| Signature family | Operations | Occurrence rows | Distinct tokens | Existing disposition in that family |
|---|---:|---:|---:|---|
| Lenis `ɕ → s` | 184 | 183 | 110 | 182 not individually adjudicated; 1 ABSTAIN |
| Fortis `ɕ͈ → s͈` | 24 | 24 | 17 | 23 not individually adjudicated; 1 ABSTAIN |
| Other 22 signatures | 46 | Mixed/overlapping | Heterogeneous | Includes the remaining ABSTAINs and the provisional RETAIN; consult each CSV row |

The 22 ABSTAIN rows all carry `UNMAPPED_FRAGMENT_AND_NO_INDEPENDENT_IPA_GOLD`; they cover 18 distinct tokens and 15 source rows. Repeated tokens/rows must be grouped before evidence is counted. A row may contain multiple edit operations, so operation counts, occurrence counts and unique-token counts are not interchangeable.

The provisional RETAIN is occurrence 1140 (`출산`, source row `dc_inside_2107`). Its context-specific record says existing Kozak Kim R012 licenses fortis /s͈/ for this Sino-Korean form under NIKL §26, while the Broad-v2 comparator omits fortis. This is a reason not to delete an existing source-backed rule merely to match one corpus annotation; it remains pending independent Korean review. The CSV preserves the context-ledger default ABSTAIN separately from the later occurrence-specific provisional RETAIN so provenance is not overwritten.

The lenis and fortis sibilant families are separate review strata. C11's optional [ɕ] candidate is lenis-only; the 24 fortis operations cannot inherit that decision. The remaining 46 operations span 22 heterogeneous signatures (stop voicing/fortition differences, segment deletions/insertions, vowel quality/length and other sibilant mappings). These are not one productive rule and must be reviewed against their own exact environments.

## Repetition and source-weighting audit

The 236 occurrences resolve to **151 unique token spellings** across **110 source rows**. A total of **135 token spellings occur once**; the remaining repeated forms are clustered, with the largest counts: 아끼셔 (22), 스시녀들은 (15), 시중도 (14), 신안 (10), 시발 (7), 훨씬 (6), 병신 (4). Source-row concentration is also uneven: one row contributes 30 candidate occurrences, another 22, and another 10. These are repeated observations from source text, not independent speakers or independent acoustic samples. The 236 count is a candidate-occurrence count only; group by exact token, source row, audio/speaker identity, context and transcription convention before evidence weighting.

## Mismatch profile

The inherited export cluster field carries C11 on 207 of the 236 rows and a historical C04 tag on 206 rows. **The C04 tag is stale:** the current cluster register reports zero C04 residual occurrences and reclassifies the former aspirated-velar set under C12. The 206 inherited C04 labels must not be read as a current classification or as 206 live C04 errors. The review CSV therefore names this field historical_export_cluster_labels_descriptive_only.

The 236 rows contain **254 edit operations across 24 signatures**. The table gives operations and the number of distinct occurrence IDs containing each signature; occurrence counts overlap because one occurrence may have multiple edit operations.

| Broad edit signature | Operations | Occurrences |
|---|---:|---:|
| ɕ → s | 184 | 183 |
| ɕ͈ → s͈ | 24 | 24 |
| t → d | 6 | 4 |
| n → ∅ | 5 | 5 |
| j → ∅ | 4 | 4 |
| ɕ → ʑ | 4 | 2 |
| k͈ → ɡ | 3 | 3 |
| ŋ → ∅ | 3 | 3 |
| n → ɡ | 3 | 3 |
| ɘː → ʌː | 2 | 2 |
| s͈ → s | 2 | 2 |
| ɕ͈ → ʑ | 2 | 2 |
| e → i | 1 | 1 |
| ∅ → i | 1 | 1 |
| s → s͈ | 1 | 1 |
| k → ɡ | 1 | 1 |
| ɰ → ∅ | 1 | 1 |
| ɛː → eː | 1 | 1 |
| ɕ͈ → s | 1 | 1 |
| k͈ → k | 1 | 1 |
| n → s | 1 | 1 |
| e → ɛ | 1 | 1 |
| t͈ → d | 1 | 1 |
| p͈ → b | 1 | 1 |

The 184 ɕ→s operations are lenis /s/ versus [ɕ] candidates; 157 fit the /i, ye, ya/ contexts in Kang (2010)'s abstract and 27 do not. The 24 ɕ͈→s͈ operations are fortis-marked and remain a separate unresolved stratum. Lee (1993) cannot be used as direct lenis evidence because its page-31 inventory classifies /s/ among fortis sounds. Those 24 operations therefore require a separate review stratum and cannot be treated as covered by the lenis C11 implementation. Other differences include ɕ→ʑ, ɕ͈→ʑ, vowel quality/length, fortis-vs-lenis stops, nasal insertion/deletion, glide loss and liquid/nasal realization.

The strongest aggregate signal is a transcription-profile / sibilant-place question, not evidence for hundreds of independent productive sound-change rules. Repeated forms are material: 아끼셔 occurs 22 times, 스시녀들은 15, 시중도 14 and 신안 10. Occurrence-level repetitions must be grouped by source row, token, speaker/audio and annotation convention before counting independent evidence.

Edit operations are grapheme-cluster alignments over normalized IPA strings, not guaranteed phoneme alignments. Broad-v2 / IPA-Dict-derived comparator strings and the project's broad profile remain unadjudicated; a distance or symbol mismatch cannot decide which representation is correct.

## Review gates

No canonical broad IPA, phonemic output, Ukrainian target, or production-default phonological rule was changed by this pass. The research-only optional [ɕ] variant and partial narrow-profile candidate list were conservatively narrowed to Kang (2010)'s explicit /i, ye, ya/ contexts; they are not categorical claims. The Ukrainian target layer remains downstream of independently adjudicated IPA.

For each occurrence or defensibly grouped token/context family, record:
1. exact token/context identity, including morpheme, eojeol and prosodic boundaries;
2. primary source and exact rule environment, or audio/speaker evidence where the question is phonetic;
3. broad-vs-narrow IPA convention and all supported variants;
4. two independent Korean IPA annotations and adjudicated disagreements;
5. whether the difference is a profile/notation mismatch, valid variant, existing rule, implementation defect, or unresolved;
6. only after IPA adjudication, a separately reviewed Ukrainian target and regression expectation.

**Acceptance:** every occurrence needs a traceable individual or explicitly grouped decision with source/reviewer provenance; repeated occurrences must not be counted as independent confirmations; unresolved cases remain explicit abstentions. This inventory alone does not meet that linguistic acceptance gate.



## Current external diagnostics — PR #436 exact head 44c9b08f20d3099ce57a2ba9b7a478c4ed0388d3

These are research-only comparators, not adjudications of the 236 candidates or normative Korean pronunciation gold.

- **UGTPHON IPA diagnostic** (run 42015760365, artifact 13409167367): 275 rows, 2,698 scored tokens, 1,431 exact (53.0393%), CER 8.966%, five unresolved, zero engine errors; 437 non-Hangul/multitoken items skipped. The report warns that IPA-Dict conventions may differ from the project's broad IPA profile and token scoring loses sentence prosody/cross-token context.
- **Native engine vs g2pk paired comparison** (run 42015759158, artifact 13409610917): 2,698 shared tokens. Native: 1,431 exact (53.0393%), CER 8.966%; g2pk plus the repository segment-IPA renderer: 1,433 exact (53.1134%), CER 9.2304%. Exact rate improves by 0.0741 percentage points while CER worsens by 0.2644 points. This near-tie on noisy data does not justify changing the production engine.
- **Kiwi + MeCab-Ko morphology consensus** (run 42015759037, artifact 13409132597): 2,703 occurrences / 1,907 unique Hangul words; three words changed IPA/status, one newly resolved, four unresolved and 24 withheld for unspaced phrase-boundary ambiguity. The report describes morphology as candidate support, not gold segmentation/pronunciation.
- **Raw-surface retrieval** (run 42015760365, artifact 13409845420): 3,140 attempted, 2,639 scored, 84.0446% coverage, 51.6484% exact among scored, 43.4076% coverage-adjusted exact, CER 9.811%. Train-only retrieval hits 22/722 noncanonical tokens (3.0471%), zero canonical tokens, and reports zero potential canonical false rewrites. This is limited retrieval, not candidate closure.

External UGTPHON, paired-engine, morphology, artifact generation, Python 3.11/3.12/3.13, browser regression/build, wheel install and corpus audit passed. Multi-engine IPA comparison job 127206409326 in run 42015758991 was still running at the last check. CharsiuG2P, ByT5 and official NIKL metadata checks were skipped, not passed. Local pytest/npm were not run in this connector-only session.

**Interpretation:** keep engine comparisons and explicit abstentions. These scores do not decide whether ɕ/s or ɕ͈/s͈ is correct for any individual candidate. No production phonological rule or Ukrainian target change is authorized.


The generator now verifies Git object IDs for all four input snapshots before reading them: candidate-ID list `f46f6760dde844a3e7cf9abe00dc74969f45eca8`, 370-row context superset `e6c4843bbb9f1e3eb83527698880d4d60184c333`, 31-row abstention register `de838dcdc247e1846e0e633766135b3a902f436b`, and context-adjudication register `6e05846a0aebdfc7297d070275051679d884f3c8`. A changed input now fails closed until the snapshot pin is deliberately reviewed and updated.

## Independent reviewer packet preparation

Use [the 236-case independent review protocol](../docs/KOZAK-236-INDEPENDENT-REVIEW.md) to generate two local system-blind, reference-withheld packets. The generated files are not committed because raw sentence rights are not cleared for external redistribution.

## Reproducibility

- Generator: scripts/build_kozak_236_candidate_review.py
- Output: research/kozak-kim-236-candidate-review-2026-11-05.csv
- Regression: tests/test_kozak_236_candidate_review.py
- Inputs: the 239-ID candidate snapshot, 370-row context superset, 31-row abstention register and context-adjudication register.


## Primary-source check and bibliographic correction

The repository's S018 entry and research source register had inconsistent metadata for the Cambridge Korean IPA illustration. Cambridge identifies **Hyun Bok Lee**, *Korean*, JIPA **23(1), June 1993, pp. 28–31** (online 6 February 2009), DOI 10.1017/S0025100300004758. Bibliographic metadata is corrected. A separate page-level review found that Lee classifies /s/ among fortis sounds, so S018 does **not** directly license the modern lenis /s/ C11 hypothesis. S019 (Kang 2010) is the relevant lenis acoustic-coarticulation source, but only its /i, ye, ya/ contexts are covered by the abstract. This citation is not an audio source for any UGTPHON occurrence.

Kang (2010)'s KCI abstract supports context-dependent acoustic coarticulation before /i, ye, ya/ and reports materially different spectral patterns before /yu, yo/. Kong and Kang (2020)'s KCI abstract reports preliminary speaker-related spectral differences. These sources support a context- and speaker-sensitive review, not an unconditional [ɕ] rewrite for every /j/-initial nucleus or a blanket fortis mapping. Two independent IPA reviews and item-level context adjudication remain required.


## 2026-11-05 current multi-engine and training-readiness checkpoint

The complete ten-engine diagnostic at run 42019876519 / artifact 13411253960 (artifact ZIP SHA-256 `bd5d4bc605a692858477984ba44539612270b8f90fc3d9c1a8e737f86557d5ca`) completed the comparison step over 2,703 eligible occurrences; 2,698 were shared scored tokens for paired comparisons. The job's only failure was the final generated-queue `cmp`: the new 32-row output was compared with the old 36-row historical file. That historical file is now restored and preserved; the current 32-row output is separately versioned as `research/kozak-kim-unmapped-mismatch-review-queue-2026-11-05.csv`. The workflow's comparison target has been changed to the versioned file.

The paired Native/g2pk result on the 2,698 shared tokens is Native 1,431/2,698 (53.0393%), g2pk 1,433/2,698 (53.1134%); paired CER 8.9660% vs 9.2285%. The +0.0741 percentage-point exact-match delta accompanies a +0.2644 percentage-point CER regression. This does not justify switching engines. Full ten-engine results and adapter limitations are recorded in [the current repository audit](../docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-04.md).

The artifact's training-readiness report records 644 lexical rows, 46 additions and a 24-case frozen holdout, but zero independently adjudicated IPA gold labels in additions and zero holdout IPA gold labels. `supervised_ipa_training_ready=false`. Reviewer A/B packets contain the same 24 source cases and no engine outputs; they are blank and prohibit tuning use. Independent Korean IPA annotation is therefore still the next evidence gate, not model training.

At the latest code/test checkpoint, Python 3.11/3.12/3.13, browser tests/build, wheel install, teacher-corpus audit, paired UGTPHON and core system verification passed. The updated multi-engine rerun was still in progress; CharsiuG2P, ByT5 and official NIKL metadata jobs were skipped by policy, not passed. Exact-head results must be read again after the current documentation commits.


## Latest exact-head verification

At `f2b30e3e64b42fed4ce9a857f76399df87559a12`, CI exposed and then fixed three stale test expectations caused by the current canonical source-register CSV (unquoted first field, 179 rows, 10 manual-classification rows). The rerun passed the full tests workflow including Python 3.11/3.12/3.13, wheel install, teacher-corpus audit and web; system verification passed browser regression/build and Python regression/data integrity; master corpus artifact generation passed. The multi-engine, external UGTPHON, paired-engine and morphology diagnostics were still in progress at the last check. CharsiuG2P, ByT5 and NIKL metadata jobs are skipped by policy, not passed. No local pytest/npm was run here.


## 2020 Seoul sibilant variation source — speaker-conditioned evidence, not a universal symbol

The KCI primary article record for Kong and Kang (2020), *Gendered spectral patterns of sibilant fricatives in Seoul Korean*, DOI [10.17959/sppm.2020.26.1.1](https://doi.org/10.17959/sppm.2020.26.1.1), was rechecked on 2026-11-05. Its abstract describes a preliminary acoustic study of 32 young Seoul Korean adults (17 women, 15 men), with word-initial and word-medial tokens in seven monophthong contexts (/i, a, u, o, ʌ, e, ɨ/). It reports speaker-gender differences in spectral peak frequency and variance, and palatalized variants before /i/.

This supports treating sibilant realization as speaker- and context-sensitive and argues against converting the 236 corpus mismatches into a universal [ɕ] rule. It does not provide evidence for /ye/ or /ya/ diphthongs, does not establish a categorical /s͈/ → [ɕ͈] mapping, and does not identify the speakers/audio behind UGTPHON occurrences. Full text and raw acoustic data were not independently inspected; this is an abstract-level source check only. It therefore does not close any individual candidate.

The separate 2010 Sung & Cho study compares Korean lax/tense sibilants with English /s/ and /ʃ/ across /i, a, u/, using duration, center of gravity and major spectral peak. Its abstract reports strong vowel effects and acoustic distinctness of Korean sibilants from both English categories. It is a useful warning against equating Korean /s/ with English /s/ or /ʃ/ based on a single IPA symbol, but the abstract does not give a direct modern segmental IPA adjudication for this cohort. KCI record: [ART001486421](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001486421). The paper's full text was not inspected. Its item-level reuse terms are not assessed; only citation-level use is recorded in the source register.

**Current source-grounded scope:** S019 supports acoustic palatalization/coarticulation for lenis /s/ before /i, ye, ya/ in its abstract; S027 treats a separate within-syllable high-front-plus-round labio-palatalized pattern, without naming a canonical segmental IPA; Kong & Kang (2020) adds preliminary speaker/gender variation with palatalized variants before /i/; Sung & Cho (2010) warns that Korean lax/tense sibilants are acoustically distinct from English /s/ and /ʃ/. None licenses blanket simple [ɕ] for all /j/-initial nuclei, blanket [ɕ͈] for fortis ㅆ, or item-level confirmation without source audio and independent review.
