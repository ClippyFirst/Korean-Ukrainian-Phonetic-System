# NIKL Rule 29: liquid assimilation follow-up — 2026-10-10

## Finding

A test-first sweep of the attached note to Standard Pronunciation Rule §29 found missing exact surface-form coverage. The browser regression test failed on `들일`: the engine returned an empty `surfaceHangul` instead of the normative surface form `들릴`. Eight examples from the official rule note are now represented as narrow, source-backed lexical controls.

## Official examples added

| Input | Standard pronunciation | IPA layer in this project | Rule |
|---|---|---|---|
| 들일 | [들ː릴] | `tɯlː|lil` | Length preserved in IPA; ㄴ after ㄹ is realized as ㄹ |
| 솔잎 | [솔립] | `sol|lip` | Liquid assimilation |
| 설익다 | [설릭따] | `sʌl|lik|t͈a` | Liquid assimilation plus fortition |
| 물약 | [물략] | `mul|ljak̚` | Liquid assimilation |
| 불여우 | [불려우] | `pul|ljʌ|u` | Liquid assimilation |
| 물엿 | [물렫] | `mul|ljʌt̚` | Liquid assimilation and coda neutralization |
| 휘발유 | [휘발류] | `hwi|pal|lju` | Liquid assimilation |
| 유들유들 | [유들류들] | `ju|dɯl|lju|dɯl` | Liquid assimilation across a repeated compound |

Source: [NIKL Standard Pronunciation Rules, Rule 29 attached note 1](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002).

## Verification logic

The regression suite checks the exact Korean surface forms and ensures that the output contains no unresolved placeholder. It does not claim that the provisional Ukrainian targets have been independently validated. In particular, the length in `들일[들ː릴]` is recorded in IPA because ordinary Hangul surface output cannot mark vowel length.

## Corpus and limits

The lexical corpus grows from 429 to 437 unique entries. These are specific official examples, not a license to infer ㄴ insertion or liquid assimilation for arbitrary unknown strings.

- [Regression test](../tests/adversarial-rule29-liquid-assimilation-2026-10-10.test.mjs)
- [NIKL Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002)
