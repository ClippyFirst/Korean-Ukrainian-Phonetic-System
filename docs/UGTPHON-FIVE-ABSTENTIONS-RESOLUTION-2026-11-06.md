# UGTPHON five native abstentions — case review and scoped recovery (2026-11-06)

## Outcome

The five rows were not five instances of one missing phonological rule. Three are recoverable as exact-token, morphology-conditioned surface analyses; `삶의` now has a source-adjudicated standard variant set (see the 2026-11-07 addendum); `칡칡이` remains blocked because its source-identified folk-song heading has no source-specific spoken realization.

This change preserves each source spelling exactly. It does not normalize typos, infer arbitrary morpheme boundaries, or turn UGTPHON annotations into normative Korean pronunciation gold.

| UGTPHON token | Source row | Decision | Scope / evidence |
|---|---|---|---|
| `칡칡이` | `dc_inside_2050` | **Still blocked: source identity / audio** | The exact string is a field-recorded folk-song heading `[철마면 민요 26]` in the Busan oral-culture collection; its refrain contains `치기타 칭칭나네`. This may be a regional song name or transcriptional variant, not the compositional noun phrase `칡+칡+이`. Kiwi and MeCab-Ko agreement on `칡>이` is not enough to establish the title's lexical segmentation. NIKL's dialect transcription example `[칠기]` for `칡이` does not adjudicate this proper-name use. No audio/field notes are available. Keep the R002 abstention. |
| `쫒아내면` | `dc_inside_2183` | Exact R002 diagnostic recovery | The source writes `쫒`, not standard `쫓`. The benchmark IPA follows the written final `ㅈ` into the following vowel-initial syllable. The full token is licensed only as this exact noisy spelling; it is not normalized to `쫓아내면`, and no standard lexical claim is made. |
| `많앗구나유유유` | `dc_inside_2202` | Exact R003 recovery | Context identifies `많-` + past ending `-았-` + `구나`; source typo `앗` is retained. NIKL §12(4) explicitly deletes ㅎ from `ㅎ/ㄶ/ㅀ` before a vowel-initial ending; NIKL Q&A directly confirms `많아[마ː나]`. The license applies only to this full noisy token and pair `많>앗`. |
| `삶의` | `dc_inside_2212` | **Source-adjudicated standard variants; speaker choice unselected** | NIKL MCFAQ 5716 directly gives `[살믜]` and `[살메]`; Rule 5 commentary excludes the `[i]` reading when ㅁ resyllabifies into the onset before ㅢ. The project lexicon now renders these as `sal.mɰi` and `sal.me`; the Ukrainian `ɰi → ий` mapping remains provisional. |
| `무서웟어` | `dc_inside_2241` | Exact R002 diagnostic recovery | The source has `웟` with single `ㅅ`, not standard `웠` with `ㅆ`. The benchmark IPA reflects the written single `ㅅ` as the onset of the following vowel-initial ending. The exact pair `웟>어` is licensed only for this token; no spelling normalization is performed. |

## Implementation

- Added exact-form R002 licenses for `쫒아내면` and `무서웟어` in Python and Browser.
- Added an exact-form R003 license for `많앗구나유유유` in Python and Browser.
- Added a positive R003 regression for `많앗구나유유유`; extended Python positive regressions and added near-form negative controls for all three recoveries.
- Added Browser positive and negative regressions for the three recovered cases; `칡칡이` remains fail-closed. `삶의` now exposes its source-backed broad-IPA variant set as a research-only lexical entry.
- The `삶의` source-based IPA variant set is now recorded. Its speaker-specific selection remains unknown, and the Ukrainian target layer remains provisional.

## Benchmark evidence

The following reports were produced from the pinned UGTPHON Korean test split (275 dataset rows; 2,703 scorable Hangul tokens). The current browser and Python benchmark runs use the same engine code as this branch; later commits only corrected regression expectations.

### Direct Browser diagnostic — run 42290856158

| Metric | Historical baseline run 42226435101 | Current Browser diagnostic | Change |
|---|---:|---:|---:|
| Scored / coverage | 2,698 / 2,703 (99.815%) | 2,701 / 2,703 (99.926%) | +3 scored; +0.111 pp |
| Strict IPA exact | 1,433 / 2,698 (53.113%) | 1,435 / 2,701 (53.129%) | +2 exact; +0.015 pp |
| Strict IPA CER | 8.9486% | 8.9418% | -0.0068 pp |
| Broad candidate exact | 2,341 / 2,698 (86.768%) | 2,344 / 2,701 (86.783%) | +3 exact; +0.015 pp |
| Broad candidate CER | 2.0731% | 2.0696% | -0.0035 pp |
| Unresolved | 5 | 2 | -3 |

Coverage-adjusted exact match moved from 53.015% to 53.089% in strict mode (+0.074 pp), and from 86.608% to 86.719% in broad mode (+0.111 pp). This baseline is the last successful historical benchmark (PR #443), not a post-PR #447 baseline: the later PR #447 multi-engine run 42261250219 was cancelled before producing a score.

### Paired Python Native vs g2pk diagnostic — run 42291597098

- Native: 2,701 scored, 1,435 exact (53.1285%), CER 8.9418%, 2 unresolved, 0 engine errors.
- g2pk: 2,703 scored, 1,435 exact (53.0892%), CER 9.2328%, 0 unresolved, 0 engine errors.
- Paired 2,701-token subset: exact matches tied at 1,435; native CER 8.9418% vs g2pk 9.2274%, a 0.2856 pp lower CER for Native.
- g2pk produces surface Hangul which is passed through this repository's IPA segment renderer; it does not run the native phonological rules. This is diagnostic evidence, not an independent model or normative gold comparison.

### Full multi-engine status

The multi-engine workflow 42292099893 was cancelled during external implementation/license fetching, before the benchmark adapter tests or comparison ran. No full multi-engine score is claimed. The active PR #454 opens a fresh exact-head run. CharsiuG2P and ByT5 remain skipped by the repository's current comparative-only/license policy, not passed.

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

This document describes the implementation submitted on branch `fix/five-ugtphon-native-abstentions-final-release-2026-11-06` in PR #454. Browser and paired Native-vs-g2pk diagnostics have numeric results above; the full multi-engine workflow and exact-head regression CI remain pending. The source identity/audio review for `칡칡이` and independent IPA/Ukrainian-target review for `삶의` remain blocked regardless of software CI.


## 2026-11-07 source-only follow-up — 삶의 variants resolved from official sources

The earlier statement that 삶의 lacked independent IPA adjudication is superseded at the standard-variant level. No audio is required to establish the normative variant set:

1. NIKL MCFAQ 5716 directly names 삶의 and gives the official Hangul readings [살믜] and [살메] under Standard Pronunciation Rule §5(다만 4).
2. NIKL §5 commentary (Rule 5, lines 1399–1439 of the official page) clarifies that the consonant-initial ㅢ → [i] exception does not apply when the preceding coda moves into the onset before ㅢ. In 삶의, ㅁ is resyllabified into the second syllable. The earlier sal.mi project candidate therefore incorrectly applied the post-consonantal [i] rule.
3. The research lexicon now distinguishes the project IPA renderings sal.mɰi for [살믜] and sal.me for [살메]. This uses the repository's existing ɰi notation for ㅢ; NIKL itself supplies Hangul pronunciation notation, not IPA.
4. Park, Cho & Han (2016) report [e] in 602/628 (95.86%) of monophthongized genitive-particle tokens in the Seoul Corpus. This supports the population-level prevalence of the [e] variant, not a choice for this unknown speaker.

**Updated disposition:** 삶의 is no longer blocked for its normative Hangul/derived broad-IPA variant set. The speaker-specific selection remains unresolved; the IPA-to-Ukrainian ɰi → ий mapping remains provisional, so the production target renderer continues to withhold final Ukrainian orthography unless explicitly invoked in provisional research mode. No speaker-specific narrow IPA or target gold is claimed.

The same Rule 5 correction is applied to the 협의 lexical control: [혀븨] is now represented separately as hjʌ|bɰi, while the permitted [혀비] variant remains hjʌ|bi. The prior data had collapsed both Hangul variants to bi.

칡칡이 remains the sole unresolved case in this five-row set: the source identifies the folk-song heading, but the available text sources do not establish its lexical segmentation or a source-specific spoken realization. The exact spelling remains preserved; no audio is requested.

**Files updated:** data/korean/lexical_pronunciations.csv, research/SOURCE-REGISTER.csv. The exact-head CI for this follow-up is still pending.
