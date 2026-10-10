# Regression audit: user-supplied Korean standard-pronunciation corpus

**Date:** 2026-10-10  
**Primary authority:** National Institute of Korean Language (국립국어원), *표준 발음법*, https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002  
**Purpose:** Turn the submitted corpus into a reproducible release-gate checklist. The Korean surface readings below are the normative target; Ukrainian output is a project-specific practical transcription and is not itself an official Ukrainian standard.

## Why this audit is required

A browser result captured from the service on 2026-10-10 leaves multiple supplied words unresolved (including 해돋이, 맏이, 숱이, 끝이, and the complex-coda sequence 읽을 수 있습니다), and several surface readings in the displayed IPA/trace are visibly inconsistent with the source's own documented rule order. The corpus must be run through the actual engine after every change; a successful build alone is insufficient.

## High-priority expected Korean surface readings

| Input | Standard surface reading | Principal issue |
|---|---|---|
| 국립국어원 | [궁님꾸거원] | §19 then §18, followed by fortition |
| 서울역 | [서울력] | §29 compound n-insertion and liquid assimilation |
| 신라 | [실라] | §20 liquid assimilation |
| 설날 | [설랄] | §20 liquid assimilation |
| 독립문 | [동님문] | §19 before §18 |
| 종로 | [종노] | §19 |
| 같이 | [가치] | §17 palatalization |
| 굳이 | [구지] | §17 palatalization |
| 해돋이 | [해도지] | lexical/morphemic §17 case |
| 맏이 | [마지] | lexical/morphemic §17 case |
| 밭이 | [바치] | §17 palatalization |
| 꽃이 | [꼬치] | §13 liaison |
| 옷이 | [오시] | §13 liaison |
| 낮이 | [나지] | §13 liaison and §17 |
| 숱이 | [수치] | §17 palatalization |
| 끝이 | [끄치] | §17 palatalization |
| 값이 | [갑씨] | §14 complex-coda liaison; ㅅ becomes tense |
| 없어 | [업써] | §14 complex-coda liaison |
| 있어 | [이써] | §13 liaison |
| 읽고 | [일꼬] | §11 verb-stem ㄺ exception before ㄱ |
| 읽는 | [잉는] | §11 simplification then §18 nasal assimilation |
| 읽다 | [익따] | §11 coda simplification then §23 fortition |
| 읽지 | [익찌] | §11 and §23 |
| 읽습니다 | [익씀니다] | coda simplification, fortition and nasal assimilation |
| 맑다 | [막따] | §11 coda simplification and §23 |
| 맑고 | [말꼬] | verb-stem ㄺ exception before ㄱ |
| 맑게 | [말께] | verb-stem ㄺ exception before ㄱ |
| 밝다 | [박따] | §11 and §23 |
| 밝고 | [발꼬] | verb-stem ㄺ exception before ㄱ |
| 넓다 | [널따] | §10 lexical coda exception |
| 넓고 | [널꼬] | §10 coda exception and fortition |
| 밟다 | [밥따] | §10 exception for 밟- |
| 밟고 | [밥꼬] | §10 exception for 밟- and fortition |
| 밟는 | [밤는] | §10 exception then §18 |
| 삶 | [삼] | §11 coda simplification; length is lexical |
| 젊다 | [점ː따] | §11 coda simplification; length is lexical |
| 읊다 | [읍따] | §11 coda simplification and §23 |
| 읊고 | [읍꼬] | §11 coda simplification and §23 |
| 앉다 | [안따] | §10 coda simplification and §23 |
| 앉고 | [안꼬] | §10 and §23 |
| 앉는 | [안는] | §10 and §18 |
| 많다 | [만타] | §12 aspiration |
| 많고 | [만코] | §12 aspiration |
| 많습니다 | [만씀니다] | §12 deletion/assimilation; verify exact standard form against source before freezing |
| 좋다 | [조타] | §12 aspiration |
| 좋고 | [조코] | §12 aspiration |
| 좋지 | [조치] | §12 aspiration |
| 좋습니다 | [조씀니다] | §12 and nasal assimilation |
| 놓고 | [노코] | §12 aspiration |
| 놓는 | [논는] | §12(3), then §18 |
| 놓지 | [노치] | §12 aspiration |
| 낳다 | [나타] | §12 aspiration |
| 낳고 | [나코] | §12 aspiration |
| 낫다 | [낟따] | §9 coda neutralization and §23 |
| 낫고 | [낟꼬] | §9 and §23 |
| 낫지 | [낟찌] | §9 and §23 |
| 낯설다 | [낟썰다] | §9 and §23 |
| 낮잠 | [낟짬] | §9 and §23 |
| 꽃밭 | [꼳빧] | §9 and compound fortition; check spacing/context |
| 꽃망울 | [꼰망울] | §18 nasal assimilation |
| 옷맵시 | [온맵씨] | §18 nasal assimilation; lexical/compound structure |
| 앞문 | [암문] | §18 nasal assimilation |
| 앞니 | [암니] | §18 nasal assimilation |
| 뒷문 | [뒨문] | compound/nasal rule; verify lexical analysis |
| 뒷날 | [뒨날] | compound/nasal rule; verify lexical analysis |
| 콧물 | [콘물] | §18 nasal assimilation |
| 눈물 | [눈물] | no coda change |
| 신문 | [신문] | no coda change |
| 국민 | [궁민] | §18 nasal assimilation |
| 국물 | [궁물] | §18 nasal assimilation |
| 박물관 | [방물관] | §18 nasal assimilation |

**Editorial caution:** Entries explicitly marked “verify” or involving compound boundaries must be checked against the official standard and/or an NIKL dictionary/Q&A before being frozen as test expectations. This table is a review queue, not a substitute for lexical evidence. In particular, a Hangul boundary alone does not license a morphological rule.

## Mandatory acceptance criteria

1. Test every exact user-supplied input as a full token and as part of its original sentence/phrase.
2. Compare the engine's Korean surface sequence against a source-backed expected form independently of Ukrainian output.
3. Generate IPA from the same surface representation used for Ukrainian output; do not let IPA and Ukrainian text follow different rule orders.
4. Preserve punctuation and whitespace exactly. A rule may cross a plain inter-word space only where the official standard licenses connected phrase pronunciation; it must not cross punctuation.
5. Never expose raw Korean fragments inside the Ukrainian result as a substitute for unresolved output without a clear, user-visible uncertainty label.
6. Do not treat a transliteration decision as an official NIKL rule. The NIKL standard defines Korean pronunciation, not Ukrainian spelling.
7. Before release, run `npm test`, `npm run build`, `pytest`, and the corpus/data-integrity checks; inspect the generated site with the full user-supplied corpus.

## Official reference

National Institute of Korean Language, *한국어 어문 규범 — 표준 발음법*: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
