# Native engine: exact NIKL Rule 28 and Rule 30 licenses

Date: 2026-10-23

## Evidence

The native rule engine now carries finite full-form/pair licenses for examples explicitly listed under NIKL Standard Pronunciation Rules 28 and 30. The canonical source is the National Institute of Korean Language's official Standard Pronunciation Rules page:

- https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002

The source's Rule 28 examples include 문고리, 눈동자, 신바람, 산새, 손재주, 길가, 물동이, 발바닥, 바람결, 그믐달, 강가, 초승달, 등불, 창살, 강줄기, 아침밥, 굴속, and 술잔. Rule 30 examples cover written 사이시옷 before fortis onsets, nasal contexts, and 이-initial contexts, including 냇가, 샛길, 빨랫돌, 콧등, 깃발, 대폿밥, 햇살, 뱃속, 뱃전, 고갯짓, 아랫니, 뒷마루, 뱃머리, 깻잎, and 나뭇잎.

These official Hangul pronunciations support Korean surface behavior. They do not independently establish broad IPA gold or Ukrainian adaptation.

## Implementation

- Rule 28 (R014) has exact full-form/pair licenses for 18 listed examples.
- Rule 30 (R015) has exact full-form/pair licenses for 15 listed examples.
- Each changed trace includes the exact license key and the official NIKL rule URL in its source metadata.
- No generalization is made from a written coda ㅅ to arbitrary saisiot behavior.
- The ambiguous homograph 잠자리 is deliberately excluded from automatic R014 licensing because the source's fortis reading is not safe to infer from spelling alone without semantic/morphological disambiguation.
- An unlisted coda-ㅅ form such as 옷가게 remains unchanged by R015 unless the caller provides an exact license.

## Regression coverage

- All 18 Rule 28 forms assert the expected fortis onset and exact trace context.
- All 10 Rule 30 fortition forms assert the onset and coda outcome.
- Three Rule 30 nasal-context forms assert coda ㄴ.
- Two Rule 30 이-initial forms assert coda ㄴ plus inserted onset ㄴ.
- Negative controls guard the excluded homograph and an unrelated ㅅ-coda sequence.

## Scope and acceptance

- `DONE_VERIFIED / CI`: [test workflow #2194](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40022568933) passed Python 3.11/3.12/3.13 and browser tests/build; [system verification #5093](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40022568864) passed Python regression/data-integrity and browser regression/build; [master table/research corpus artifacts #2058](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40022568699) passed. The live NIKL source inventory step was skipped/blocked, not passed.
- This exact list is not a productive compound parser. Unlisted compounds and homographs remain dependent on explicit lexical/morphological evidence.
- Independent IPA adjudication and Ukrainian target-layer review remain separate scientific acceptance gates.
