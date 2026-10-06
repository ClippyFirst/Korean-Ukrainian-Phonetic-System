# Web service QA

## Automated tests

npm test covers modern Hangul decomposition, CV/CVC mapping, ㅅ before ㅣ, ㄹ onset/coda, ㅇ onset/coda, complex-coda liaison, simple liaison, practical tensification, contextual voicing, unresolved ㅢ, non-Korean preservation, CSV quoting, deterministic conversion, and the public two-page/UI/CSP contract.

## Build

npm run build is the release build gate.

## Browser acceptance

Check desktop and narrow mobile widths: empty state; example flow; conversion; analytical panels; trace; copy; two-way navigation; visible keyboard focus; and reduced-motion behaviour.

## Research correctness

The following remain explicit: ㅢ is context-dependent; 11,172 Hangul blocks are not a lexical corpus; contextual examples are not automatically universal rules; Russian and other Slavic systems are comparative evidence; the service is not translation.

## Release rule

A UI build is not by itself scientific validation. The web layer is complete only when its implementation boundary is documented and output remains traceable to the research repository.
