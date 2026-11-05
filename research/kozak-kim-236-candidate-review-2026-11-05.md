# 236-candidate review ledger — 2026-11-05

## Scope and result

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
- **1 RETAIN:** occurrence 1140 (출산) provisionally retains the existing source-backed R012 form. Independent Korean IPA review is pending; RETAIN is not completed adjudication.
- **213 not individually adjudicated:** no occurrence-specific disposition was found in the current narrow review registers. The 370-row context ledger's default ABSTAIN / EVIDENCE_LIMITED_DIAGNOSTIC_ONLY is a safe no-change baseline, not an individual review result.

## S018/S019 page-level source check and 236-case Hangul environment crosswalk

[Cambridge's primary PDF](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/07312FF2A7409D9C71A4FE83E12AA54D/S0025100300004758a.pdf/korean.pdf) was inspected directly: Lee (1993), printed p.31, describes /s/ as [ɕ] before /i/ or a diphthong beginning [j]. However, the same page explicitly classifies /s/ among the fortis sounds (/p,t,k,c,s/). Its [ɕ] statement therefore cannot be transferred to modern lenis /s/ without reconciling the source's phonological inventory and transcription conventions; nor does it directly adjudicate modern /s͈/. S018 remains useful for its separately scoped Seoul /h/, /l/ and release descriptions.

The more relevant lenis-sibilant source is S019, Kang (2010), *Coarticulation effects of Korean sibilant /s/ before a high front segment*. Its KCI abstract reports acoustic palatalization/coarticulation before /i, ye, ya/ and a distinct spectral pattern before /yu, yo/. It supports a narrow, research-only hypothesis, not a categorical [ɕ] transcription rule. A deterministic Hangul crosswalk now checks only the explicit /i, ye, ya/ environments (ㅣ, ㅖ, ㅑ): **157 of 184** lenis `ɕ→s` edits across 156 candidate occurrences are context-compatible with that abstract. The remaining **27** lenis edits (27 occurrences, six token strings, five source rows; IDs 606, 843, 1155, 1157, 1414, 1417, 1420, 1423, 1426, 1429, 1432, 1435, 1438, 1441, 1444, 1447, 1450, 1453, 1456, 1459, 1462, 1465, 1468, 1471, 1474, 1477, and 2489) are outside those environments and cannot be attributed to S019. The mixed `실시간` row (ID 551) has one lenis context plus a separate fortis `ɕ͈→s͈` operation; the second context is not lenis evidence. `신라시절` (ID 103) has two lenis operations in the covered contexts.

The full 24-operation fortis `ɕ͈→s͈` stratum remains separately unresolved. The crosswalk establishes context compatibility only for the 157 lenis operations; it does **not** establish the actual pronunciation of any token, speaker/dialect realization, source annotation correctness, or Ukrainian target. Kang's abstract was reviewed; the full acoustic data and independent IPA adjudication remain outstanding. The 22 ABSTAIN rows and 213 rows without individual disposition remain open as recorded.



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
