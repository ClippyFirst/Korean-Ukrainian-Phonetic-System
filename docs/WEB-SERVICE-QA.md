# Web service QA

## Automated tests

npm test covers modern Hangul decomposition, CV/CVC mapping, ㅅ before ㅣ, ㄹ onset/coda, ㅇ onset/coda, simple and complex-coda liaison (including ㄶ/ㅀ and ㅆ liaison), ㅎ deletion/aspiration, nasal and liquid assimilation, palatalization, practical tensification, contextual voicing, unresolved ㅢ, non-Korean preservation, CSV quoting, deterministic conversion, and the public two-page/UI/CSP contract.

## Build

npm run build is the release build gate.

## Browser acceptance

Check desktop and narrow mobile widths: empty state; example flow; conversion; analytical panels; trace; copy; two-way navigation; visible keyboard focus; and reduced-motion behaviour.

## Research correctness

### Adversarial pronunciation cases

The regression suite now deliberately probes cases where a naive grapheme-to-grapheme converter is likely to fail:

- **신라 → [실라]**: ㄴ+ㄹ liquid assimilation, with the second ㄹ realized as surface [l], not onset [ɾ].
- **칼날 → [칼랄]**: ㄹ+ㄴ liquid assimilation.
- **밟는 → [밤는]**: lexical ㄼ exception in 밟- ([ㅂ] before consonants), followed by nasal assimilation.
- **넓죽하다 → [넙쭈카다]**: lexical ㄼ exception + tensification + ㅎ aspiration.
- **많아 / 싫어**: ㄶ/ㅀ must not invent an [h] onset during liaison.
- **넋이 / 곬이 / 값이**: the ㅅ component of ㄳ/ㄽ/ㅄ is carried as fortis ㅆ in the liaison environment.

These are standard-pronunciation edge cases, not merely arbitrary test strings. NIKL's Standard Pronunciation Rules and Online Q&A explicitly document the relevant exceptions and assimilation patterns.

The following remain explicit: ㅢ is context-dependent; 11,172 Hangul blocks are not a lexical corpus; contextual examples are not automatically universal rules; Russian and other Slavic systems are comparative evidence; the service is not translation.

## Release rule

A UI build is not by itself scientific validation. The web layer is complete only when its implementation boundary is documented and output remains traceable to the research repository.
