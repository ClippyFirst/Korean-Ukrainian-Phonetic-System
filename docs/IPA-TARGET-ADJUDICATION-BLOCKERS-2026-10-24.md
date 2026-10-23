# IPA and Ukrainian target adjudication blockers — 2026-10-24

## Purpose

This note narrows the remaining scientific work after the native-engine unresolved-case patch. It is not a new engine design and does not introduce a third-party G2P. It records a specific IPA-evidence gap and an independent target-layer review protocol so the next implementation decision is made from evidence rather than from the appearance of a successful test.

## Case 1: 삶의 — surface evidence is not IPA gold

Official NIKL MCFAQ item 5716 gives the particle phrase 삶의 with surface-pronunciation spellings [살믜] and [살메]:
https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5716&mn_id=217&pageIndex=225

That is strong evidence for the official Korean surface-Hangul alternatives. It does **not** directly attest the IPA strings `sal.mɰi` and `sal.me`. Those strings were rendered by the project and must not be cited as if NIKL supplied IPA.

The primary candidate `sal.mɰi` deserves specific scrutiny: the project must state whether it represents underlying/phonological /ɰi/, a broad surface transcription, or a house notation. These are not interchangeable claims. Korean Standard Pronunciation Rule §5 and the special allowance for particle 의 must be applied to the correct grammatical and syllabic environment; a general rule about ㅢ after a consonant must not be applied mechanically without checking the particle construction. Conversely, the fact that NIKL writes [살믜] is not by itself evidence that a glide [ɰ] is phonetically present.

**Current adjudication: BLOCKED_SPECIALIST_ADJUDICATION.** Do not silently replace `sal.mɰi` with `sal.mi`, nor accept `sal.mɰi` as expert-validated, solely from the Hangul notation. Keep the NIKL surface readings, project IPA candidates, and Ukrainian target output as distinct evidence layers. The project IPA candidates are hypotheses pending independent transcription by qualified Korean phonetics reviewers.

Required resolution:
1. Two qualified reviewers independently transcribe the item from the official normative context and, if available, a suitable recording with provenance and dialect/register identified.
2. Each reviewer records the transcription convention (phonemic vs broad surface IPA), syllable boundary, treatment of ㅢ, and whether each reading is normative, optional, or unsupported in this exact construction.
3. Reconcile disagreement with cited rule passages and acoustic evidence; do not manufacture an audio source if none is available.
4. Update the case fixture and source register only after adjudication, preserving both accepted alternatives where supported.
5. Keep Ukrainian target review open until the IPA decision is stable.

## Case 2: separate the Ukrainian target layer

A correct Korean surface analysis does not establish that a Ukrainian rendering is optimal. The target review must be conducted on a frozen IPA input, without showing reviewers the current Ukrainian answer first.

Reviewers should separately assess:
- preservation of Korean contrasts that the project has chosen to represent (including fortisness and relevant consonant/vowel distinctions);
- systematic handling of IPA length, syllable and word boundaries, and alternatives;
- consistency across the existing IPA-to-Ukrainian inventory rather than isolated intuitive spellings;
- readability and likely pronunciation by Ukrainian readers, tested with a blinded reading task where feasible;
- trade-offs where Ukrainian orthography has no exact equivalent, with the model decision stated rather than misrepresented as phonetic identity.

The target-layer report must identify the target policy version, IPA input version, reviewer qualifications, blinded procedure, disagreements, and limitations. Korean IPA adjudication and Ukrainian orthographic preference are separate judgments and must not be combined into one approval.

## Morphology and variation gates retained

- `많이본` and `좋아보인다고` remain unresolved unless the caller supplies segmentation or a validated morphology/spacing component provides it. Character adjacency is not a morpheme-boundary detector.
- N-insertion and other variable processes must be represented as explicit alternatives with provenance and confidence once sufficient evidence exists. Do not add a universal deterministic rewrite from studies showing gradient effects.
- Exact-form licenses for `앉아라` and `없어도` remain narrowly scoped, rule-derived results, not claims that NIKL directly lists each full inflected form.
- A passing regression test verifies the declared implementation contract; it does not adjudicate linguistic truth.

## Evidence ledger

| Item | Status | Acceptance criterion |
|---|---|---|
| NIKL surface spellings for 삶의 | DONE_VERIFIED as official Hangul evidence | Retain exact source URL and distinguish [살믜]/[살메] from IPA |
| `sal.mɰi` as broad surface IPA | BLOCKED_SPECIALIST_ADJUDICATION | Two independent reviews with convention, segmental, boundary and variant decisions |
| `sal.me` as broad surface IPA | BLOCKED_SPECIALIST_ADJUDICATION | Same independent procedure; do not infer equivalence from Hangul spelling alone |
| Ukrainian target for 삶의 | BLOCKED_SPECIALIST_REVIEW | Review frozen IPA candidates separately from Korean source adjudication |
| Automatic segmentation of compact strings | BLOCKED_INPUT_ANALYSIS | Caller-supplied segmentation or validated morphological/spacing analysis |
| Probabilistic variant selection | DEFERRED | Evidence-backed candidate distribution and calibrated confidence, not a hidden guess |

## Relevant scholarly anchors

- Park, Sunwoo (2019), “On the Phonological Representation and Acoustic Properties of the Diphthong /ɨi/ in Korean,” *Studies in Modern Grammar*. DOI: https://doi.org/10.14342/SMOG.2019.102.165. This is a relevant source to retrieve and evaluate; its existence alone does not settle the exact 삶의 case.
- Shin, Jiyoung, J. Kiaer & Jaeeun Cha (2012), *The Sounds of Korean: Tables*. DOI/book identifier: https://doi.org/10.1017/CBO9781139342858. Use the relevant vowel and phonological-rule sections; do not treat a handbook citation as case-specific experimental evidence.
- Jun, Jongho (2015), “Korean n-insertion: a mismatch between data and learning.” DOI: https://doi.org/10.1017/S0952675715000275.
- Jun, Jongho (2021), “Morphophonological gradience in Korean n-insertion.” DOI: https://doi.org/10.5334/GJGL.1401.

The first two references are leads for the ㅢ review, not proof of the final IPA for 삶의. The n-insertion papers support explicit variation handling, not a direct pronunciation decision for this case.

## Active literature review

A focused Undermind deep search has been launched for primary evidence on ㅢ in the particle construction 삶의 and independent IPA-to-Ukrainian evaluation:
https://app.undermind.ai/projects/de353992-202a-4b09-bf19-47932f80e426?path=/Independent%20IPA%20adjudication%20of%20Korean%20%EC%9D%98%20in%20%EC%82%B6%EC%9D%98%20and%20Ukrainian%20target%20mapping

Do not mark the literature task complete until its returned papers have been inspected and exact relevant claims have been verified.
