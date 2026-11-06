# UGTPHON five native abstentions — case review and scoped recovery (2026-11-06)

## Outcome

The five rows were not five instances of one missing phonological rule. Three are recoverable as exact-token, morphology-conditioned surface analyses; two remain blocked for different reasons: `칡칡이` is a source-identified folk-song heading with no recording to adjudicate its lexical pronunciation, while `삶의` lacks independent IPA adjudication.

This change preserves each source spelling exactly. It does not normalize typos, infer arbitrary morpheme boundaries, or turn UGTPHON annotations into normative Korean pronunciation gold.

| UGTPHON token | Source row | Decision | Scope / evidence |
|---|---|---|---|
| `칡칡이` | `dc_inside_2050` | **Still blocked: source identity / audio** | The exact string is a field-recorded folk-song heading `[철마면 민요 26]` in the Busan oral-culture collection; its refrain contains `치기타 칭칭나네`. This may be a regional song name or transcriptional variant, not the compositional noun phrase `칡+칡+이`. Kiwi and MeCab-Ko agreement on `칡>이` is not enough to establish the title's lexical segmentation. NIKL's dialect transcription example `[칠기]` for `칡이` does not adjudicate this proper-name use. No audio/field notes are available. Keep the R002 abstention. |
| `쫒아내면` | `dc_inside_2183` | Exact R002 diagnostic recovery | The source writes `쫒`, not standard `쫓`. The benchmark IPA follows the written final `ㅈ` into the following vowel-initial syllable. The full token is licensed only as this exact noisy spelling; it is not normalized to `쫓아내면`, and no standard lexical claim is made. |
| `많앗구나유유유` | `dc_inside_2202` | Exact R003 recovery | Context identifies `많-` + past ending `-았-` + `구나`; source typo `앗` is retained. NIKL §12(4) explicitly deletes ㅎ from `ㅎ/ㄶ/ㅀ` before a vowel-initial ending; NIKL Q&A directly confirms `많아[마ː나]`. The license applies only to this full noisy token and pair `많>앗`. |
| `삶의` | `dc_inside_2212` | **Still blocked: IPA adjudication** | NIKL MCFAQ 5716 confirms the standard Hangul readings `[살믜]` and `[살메]`, not IPA. Park, Cho & Han (2016) analyzed 2,370 Seoul-Corpus /ɨi/ tokens; among 628 monophthongized genitive-particle `-의` tokens, 602 (95.86%) were [e]. Thus `sal.me` is the statistically common spontaneous-speech candidate, while `sal.mi` remains a NIKL-permitted reading and the UGTPHON annotation. These are population-level observations, not a speaker-specific adjudication of this token. Keep IPA and Ukrainian target withheld pending qualified review. |
| `무서웟어` | `dc_inside_2241` | Exact R002 diagnostic recovery | The source has `웟` with single `ㅅ`, not standard `웠` with `ㅆ`. The benchmark IPA reflects the written single `ㅅ` as the onset of the following vowel-initial ending. The exact pair `웟>어` is licensed only for this token; no spelling normalization is performed. |

## Implementation

- Added exact-form R002 licenses for `쫒아내면` and `무서웟어` in Python and Browser.
- Added an exact-form R003 license for `많앗구나유유유` in Python and Browser.
- Added a positive R003 regression for `많앗구나유유유`; extended Python positive regressions and added near-form negative controls for all three recoveries.
- Added Browser positive and negative regressions for the three recovered cases; `칡칡이` and `삶의` remain fail-closed.
- Kept `삶의` in the IPA-adjudication hold. Its source-backed Hangul variants remain distinct from IPA, and the Ukrainian target layer is not approved by this work.

## Evidence boundaries

1. UGTPHON is a noisy user-generated-text benchmark with separate raw text, canonical text, and IPA fields. Its Korean token annotations are not the same thing as an official NIKL pronunciation ruling or speaker-specific acoustic gold.
2. The three new rules are exact-token licenses. They do not enable a productive R002/R003 heuristic for similar-looking forms.
3. The two typo-bearing tokens (`쫒아내면`, `무서웟어`) retain their raw spelling. The engine models the written surface sequence used by the benchmark; it does not assert that those spellings are standard.
4. The IPA in the new exact-form cases is rule-derived broad IPA. Passing runtime tests demonstrates implementation/parity, not independent phonetic validation or Ukrainian-target acceptance.
5. The `칡칡이` source record identifies a song title but provides no audio, and analyzer agreement cannot settle a proper-name reading. The `삶의` literature supports a candidate range, not a definitive per-token choice. A qualified reviewer must adjudicate the broad IPA and the Ukrainian target independently.

## Primary and scholarly sources

- NIKL, Standard Korean Pronunciation Rules, especially §§12(4), 13–14: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
- NIKL Online Q&A 317199, `많아` → `[마ː나]` and §12(4): https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317199
- NIKL MCFAQ 5716, genitive particle `의`: `삶의[살믜]/[살메]`: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5716
- NIKL 2024 regional-variation transcription report, example for the grammatical form `칡이` → `[칠기]` (not evidence for the song title): https://www.korean.go.kr/common/download.do?c_file_name=ecbc2e07-fb80-40d5-804b-8254964798d9.pdf&file_path=reportData&o_file_name=2024%EB%85%84+%EC%84%B8%EB%8C%80%EB%B3%84+%EC%84%B1%EB%B3%84+%EC%A7%80%EC%97%AD%EC%96%B4+%EB%B3%80%EC%9D%B4+%EC%A1%B0%EC%82%AC+%EA%B2%B0%EA%B3%BC+%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf
- Busan Metropolitan City Historical Compilation Committee, *Dongbusan Cultural Area Folk Songs II* (2015), `[철마면 민요 26] 칡칡이`, field recording metadata (1991-10-19) and refrain `치기타 칭칭나네`, printed pp. 586–587: https://www.busandabom.net/data/history/ebook/EB_culture_song02.pdf
- Park, Cho & Han (2016), “한국어 이중모음 /의/의 단모음화 양상”, DOI: https://doi.org/10.17959/SPPM.2016.22.1.35
- UGTPHON upstream dataset and annotation contract: https://github.com/naver-ai/UGTPHON

## Verification status

This document describes the implementation submitted on branch `fix/five-ugtphon-native-abstentions-2026-11-06`. Do not mark the code changes DONE_VERIFIED until the exact-head Python, Browser, benchmark, and cross-runtime checks pass. The source identity/audio review for `칡칡이` and independent IPA/Ukrainian-target review for `삶의` remain blocked regardless of software CI.
