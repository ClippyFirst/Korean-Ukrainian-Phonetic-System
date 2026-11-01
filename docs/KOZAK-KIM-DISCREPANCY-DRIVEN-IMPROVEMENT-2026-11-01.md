# Kozak Kim: discrepancy-driven phonology improvement — 2026-11-01

## Scope and invariants

This workstream improves **only the in-repository Kozak Kim engine**. The vendored/original g2pK implementation is a frozen external comparison baseline: do not edit it, port its rules into Kozak Kim, or optimize Kozak Kim merely to imitate its output.

The objective is to improve Korean pronunciation analysis in Kozak Kim and demonstrate, with paired evidence, where its analysis is better, where it is worse, and where neither engine can be judged from the available reference.

Preserve the pipeline:

`Hangul orthography → structural/morphological analysis → Korean surface phonology → inspectable IPA → Ukrainian adaptation`

The IPA is the comparison boundary. Do not patch Ukrainian spellings to conceal an upstream IPA error. Do not collapse IPA contrasts to improve benchmark exact match unless an independently justified comparison profile is explicitly labelled as such.

## Starting point and baseline evidence

- Default branch at start: `main`, `7bbbd7e7ce888a9c995bb70959e17858263c07a8`.
- Working branch: `research/kozak-kim-discrepancy-driven-improvement-2026-11-01`, based on PR #415's verified research/code line `559000fa845b40450cb7173167a2d28016d282f8` (116 commits ahead of main, 0 behind at branch creation).
- Paired browser diagnostic: [Actions run 41331679243](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41331679243), artifact `13093672281`, report `kozak-kim-vs-original-g2pk-browser-report.json`.
- This artifact contains 2,703 eligible occurrences and 2,699 shared scored occurrences. Both engines scored 1,442/2,699 exact (53.4272%). Kozak Kim CER was 8.1358%; g2pK CER 8.2138%. The sentence-cluster bootstrap exact-delta 95% CI was [-0.20697, +0.20056] percentage points; it crosses zero. The CER-delta interval was [-0.16560, 0] percentage points and touches zero. This is evidence of a lower CER point estimate for Kozak Kim on this diagnostic, not a statistically established universal winner.
- On the 2,699 shared occurrences: 1,438 were exact for both; 4 exact only for Kozak Kim; 4 exact only for g2pK; 1,253 were wrong for both. There were 23 occurrences where the engines emitted different normalized IPA strings. In those 23, Kozak Kim had the smaller edit distance on 15; g2pK on 8. This is a useful triage signal, not a linguistic adjudication.
- g2pK remains unchanged and is not a gold oracle. UGTPHON references are diagnostic phonetic annotations, not a fully independent normative IPA gold set.

## First verified discrepancy repair

### §27 — complete `-(으)ㄹ게` ending boundary

The paired report exposed `올게이`: Kozak Kim produced fortis /k͈/ while g2pK retained plain /ɡ/, and the reference was closer to g2pK. The current rule already correctly handles `할게`, `다를게`, and `안타까울게`, but it previously triggered on any internal `ㄹ게` substring.

NIKL Q&A 330963 (2026-05-11) explicitly explains that `할게` consists of `하-` + ending `-ㄹ게` and is pronounced [할께]; Q&A 317780 and 325075 corroborate the ending-based analysis. This is a morphological condition, not a raw character-sequence rule.

**Change made on this branch:** the §27 rule now requires the current eojeol to end in the complete `-ㄹ게` ending, optionally followed by sentence-final `요` (`...ㄹ게` or `...ㄹ게요`). It no longer fires on `...ㄹ게이`. A focused regression test keeps the positive cases `할게`, `할게요`, `다를게`, `안타까울게` and uses `올게이` only as a substring-boundary negative control. The negative control is not being declared a normative lexical pronunciation.

Sources:
- NIKL Q&A 330963 (2026-05-11): confirms the attached ending -ㄹ게 and [할께] under §27: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=330963
- NIKL Q&A 308180 (2024-12-24): confirms 할게요 is -ㄹ게 plus the auxiliary particle 요; it grounds the optional 요 boundary, while Q&A 330963 / §27 ground fortition: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=308180
- The NIKL educational PDF also explicitly gives 할게요 [할께요] as a §27 example (search-indexed official source).

**Status:** implementation and regression authored; exact-head CI has not yet run. Keep this PARTIAL until the browser suite and build pass on the resulting commit and the paired benchmark is rerun.

## Discrepancy inventory from the paired report

The complete occurrence-level ledger is stored in [`research/KOZAK-KIM-PAIRED-DISCREPANCY-LEDGER-2026-11-01.csv`](../research/KOZAK-KIM-PAIRED-DISCREPANCY-LEDGER-2026-11-01.csv). It contains exactly 23 occurrences where the two engines emitted different normalized IPA strings, including repeated tokens as distinct occurrences. Each row records the reference, both engine outputs, edit distances, the closer engine, a provisional phenomenon cluster, and an adjudication note.

The ledger confirms 15 occurrences with lower edit distance for Kozak Kim and 8 for g2pK. This count is occurrence-level and must not be interpreted as 15 independent lexical wins: repeated forms include `없는`, `없다`, and `사건`, and the bootstrap unit remains the source sentence/utterance row.

Four exact-match discordances are especially informative:
- Kozak Kim only: `닮다`, `못잃어`, `넘게`, `인기`.
- g2pK only: four occurrences of `없는`.

The g2pK-only exact cases all concern the corpus omitting vowel length that is represented in the registered NIKL evidence. They are not sufficient grounds to remove length from Kozak Kim. `못잃어` is also variant-sensitive: the source register records both insertion and non-insertion readings, so the exact match is not by itself a normative ranking.

## Prioritized research clusters

### A. Morphology-conditioned fortition and rule boundaries — highest implementation priority

Evidence: 닮다, 넘게, 인기, 사건, 다를게, 안타까울게, 할게, 올게이. Existing rule families include NIKL §§24–28. The first repair narrows the productive-looking §27 rule to the complete ending boundary.

Next work:
1. Audit every §24–§28 rule for a declared morphological trigger, exact boundary, positive cases, and near-minimal negative controls.
2. Ensure exact full-form licenses are not accidentally generalized to substrings, homographs, or compounds.
3. Add tests for `-ㄹ게`, `-ㄹ게요`, and lookalikes where the same grapheme sequence is not the ending.
4. Re-score all paired occurrences and report both exact and edit-distance deltas, including regressions.

### B. Complex-coda / ㄺ-before-ㄱ ordering

Evidence: 읽고. The native engine's `일꼬` surface is closer to the corpus IPA than g2pK's `익꼬`. Preserve the explicit NIKL §11 verbal-stem exception and its lexical/morphological guard. Add contrasts for nouns (e.g. 닭이) and non-licensed ㄺ forms so the verb exception cannot leak into all complex-coda contexts.

### C. Long vowels and reference convention

Evidence: 없는 ×4, 없다 ×2, 없어, 알다, 많이, 사건, 한자. Several g2pK-only exact occurrences are caused by the reference omitting length where the NIKL-backed lexical entry preserves it. This is not automatically a Kozak Kim error. Separate:
- normative/lexical length evidence;
- corpus annotation omissions;
- cross-runtime IPA profile differences;
- true engine length insertion/deletion errors.

Do not remove long vowels globally, do not use the benchmark's closest variant as an authority, and do not alter the strict score normalizer to hide length.

### D. Variable morphology and phrase-level readings

Evidence: 못잃어. The registered NIKL usage-survey source reports both insertion and non-insertion readings. Keep both variants visible; do not turn one selected corpus annotation into a categorical rule or claim that the primary candidate is normatively dominant without the source percentages for this exact expression.

### E. IPA convention and segmental annotation

The earlier broad-candidate review identified recurring strict mismatches involving aspiration notation ([ʰ] vs [h]), /y/ vs /ɥi/, unreleased-coda marks, /j/ presence, and lateral allophones. These are review strata, not five proven phonological bugs. Maintain strict and broad-candidate metrics separately. Only an adjudicated IPA convention may decide whether a symbol difference is a true error.

### F. Remaining true engine candidates

대한민국 is closer under g2pK by one edit; 알다 and 없어 also appear closer under g2pK because the benchmark reference omits length. Each needs source-level analysis before code changes. No rule is changed merely because one engine has lower edit distance on a single noisy token.

## Required discrepancy-card schema

Every future discrepancy cluster must record:
- stable cluster ID and phenomenon;
- occurrence IDs and lexical types separately;
- exact source Hangul, token context, and word/phrase boundaries;
- Kozak Kim IPA, untouched g2pK IPA, all reference alternatives, and normalized forms;
- rule trace and rule-order path from Kozak Kim;
- whether the difference is surface phonology, IPA convention, lexical variant, morphology, corpus noise, or unknown;
- primary source URL, exact article/Q&A/item scope, and source-register row;
- positive, negative, boundary, and interaction controls;
- proposed implementation location and expected blast radius;
- pre-change baseline, post-change paired results, regression count, coverage/abstention change;
- status: `DONE_VERIFIED`, `PARTIAL`, `TODO`, `BLOCKED`, or `DEFERRED`.

Do not aggregate duplicate tokens as independent lexical evidence. Statistical resampling must cluster by sentence/utterance row, not by token.

## End-to-end improvement loop

1. Freeze a reproducible Kozak Kim/g2pK paired artifact with identical inputs and references.
2. Extract all engine-discordant occurrences, all cases where Kozak Kim is farther from every reference, and high-frequency shared errors.
3. Group by the actual conditioning environment (morpheme, coda, onset, vowel, boundary, phrase context), not by visually similar IPA strings alone.
4. Adjudicate each group against NIKL standard/Q&A, authoritative dictionary entries, and qualified Korean phonology review. Treat g2pK as a comparison system only.
5. Write a formal rule contract: trigger, ordering, exceptions, alternatives, and abstention conditions.
6. Add RED tests first: positive, negative, minimal-pair, boundary, and rule-interaction cases.
7. Implement the smallest change in the native Kozak Kim module. Preserve provenance and the IPA trace. Keep g2pK files untouched.
8. Run the focused test, full Node suite, browser build, Python suite/parity checks where applicable, and the paired benchmark on the same pinned data.
9. Evaluate paired exact classification, CER, PER/feature diagnostics, coverage, abstentions, regressions, cluster-bootstrap intervals, and per-cluster effects.
10. Promote only source-backed, holdout-generalizing rules. Otherwise retain a research candidate or explicit unresolved status.

## Acceptance criteria for a claimed Kozak Kim advantage

A claim must state the exact corpus/version, shared occurrence denominator, reference convention, profile version, coverage, abstentions, exact rate, CER, uncertainty interval, and per-cluster results. A robust claim of overall superiority additionally requires an independently adjudicated held-out set and a paired confidence interval that supports the claimed direction. Until then, use the narrower wording: “Kozak Kim is better on these source-backed discrepancy classes under this diagnostic,” with examples and counterexamples.

## Current task ledger

| Task | Status | Acceptance evidence / next step |
|---|---|---|
| Freeze scope: Kozak Kim only; g2pK immutable | DONE_VERIFIED | Explicit user direction; branch changes only native Kozak Kim and its tests/docs |
| Inspect paired diagnostic and extract output-different cases | DONE_VERIFIED | Artifact 13093672281; 2,699 shared; 23 output-different; 15 KK closer / 8 g2pK closer |
| §27 complete `-ㄹ게` boundary repair | PARTIAL | Code and focused test authored; run exact-head Node tests/build and paired diagnostic |
| Long-vowel discrepancies | TODO | Source-vs-reference adjudication for 없는/없다/없어/알다/많이/사건/한자 |
| §11 complex-coda contrast expansion | TODO | Positive verbal-stem and negative noun/lookalike controls, source review |
| 못잃어 variant adjudication | PARTIAL | NIKL survey records both variants; no source-backed ranking for this exact item |
| Broad IPA convention clusters | BLOCKED | Independent IPA convention and reviewer adjudication needed |
| Overall Kozak Kim superiority claim | BLOCKED | Current paired CI crosses zero; independent held-out gold required |

## Verification status

The code/test change is committed through GitHub's repository contents API on this branch. This connector-only environment does not provide a local checkout or a workflow-dispatch action. No local Node test, npm test, browser build, Python test, or exact-head Actions run is claimed for the new change. The next verification must run the focused `nikl-morphology-guard-matrix-24-30.test.mjs`, full browser suite/build, and paired browser diagnostic on the new branch head.
