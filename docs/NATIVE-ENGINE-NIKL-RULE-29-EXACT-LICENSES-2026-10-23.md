# Native engine: exact NIKL Rule 29 n-insertion licenses

Date: 2026-10-23

## Evidence

The National Institute of Korean Language's Standard Pronunciation Rule 29 explicitly lists forms such as 한여름[한녀름], 솜이불[솜ː니불], 꽃잎[꼰닙], 색연필[생년필], and 서울역. The official rule and example list are available at:

- https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
- NIKL Online Q&A, “한여름과 솜이불”, qna_seq=336242: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=97&pageIndex=1&qna_seq=336242

The source explicitly states that 한여름 and 솜이불 are both Rule 29 examples and describes the inserted ㄴ. This is evidence for the Korean surface form, not an independent IPA gold transcription.

## Implementation

The native Python rule engine now maintains a finite list of exact Rule 29 example licenses. A license is generated only when the complete input form matches an explicitly listed source example and the expected adjacent pair is present. This avoids inferring n-insertion from every coda + vowel-initial syllable sequence.

- Word-form examples can use the exact license in the ordinary same-word mode.
- Listed phrase examples are licensed only when the caller explicitly chooses `boundary_mode="phrase"`; whitespace alone does not enable cross-word phonology.
- The existing `n_insertion_licensed` boolean does not bypass exact form/pair licensing.
- Each changed R009 trace now records the exact license context, for example `R009:word:한여름:한>여`.
- Unlisted forms remain conservative unless a caller supplies an exact license. Explicit NIKL exceptions such as 육이오, 삼일절, 송별연, and 등용문 remain negative controls.

## Deliberate boundary

The official Rule 29 phrase list also includes `3연대` and `1연대`. They are not added to the native exact-license table because the native phonology API currently rejects mixed-script numeric input. Supporting them requires a separately specified Korean numeral-reading/normalization stage before phonology; silently treating the digits as Korean syllables would be incorrect. This remains outside this focused change.

## Regression coverage

- Exact Rule 29 word examples are checked against their full-form/pair licenses.
- Phrase examples are checked in both default same-word mode (must not change) and explicit phrase mode (must change only for the listed pair).
- Explicit no-insertion exceptions remain unchanged.
- A pipeline integration test verifies `한여름 → 한녀름` and checks rule-trace provenance without manually supplying a license.
- An unlisted coda-bearing near-match (`각여름`) confirms that R009 itself is not generalized by spelling alone; other rules are still traced independently.

## Acceptance and limits

- `DONE_VERIFIED / CI`: [test workflow #2185](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40021815322) passed Python 3.11/3.12/3.13 and browser tests/build; [system verification #5068](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40021815298) passed Python regression/data-integrity and browser regression/build; [master table/research corpus artifacts #2049](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40021815444) passed. The live NIKL inventory step was skipped/blocked, not passed, and is not used as acceptance evidence.
- The official Korean surface examples do not themselves establish a unique broad IPA or Ukrainian target. Those outputs remain provisional until the independent IPA and target-layer review gates are completed.
- This registry intentionally covers only the source-listed forms. It is not a general Korean morphological analyzer and does not infer unseen compounds or phrase boundaries.
