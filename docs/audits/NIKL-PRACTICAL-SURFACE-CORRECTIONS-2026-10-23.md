# NIKL-backed practical surface corrections — 2026-10-23

## Decision

The raw vendored JavaScript g2pK port remains unchanged and independently inspectable. The browser practical adapter now applies a narrow, exact-form allowlist when the port output conflicts with an explicit official NIKL surface reading. The correction is applied to the Korean surface **before** the project IPA adapter. Ukrainian output continues to be derived from that IPA; no Hangul-to-Ukrainian parallel path was introduced.

This is a justified correction to the earlier “never replace normativeSurface” adapter contract: the raw-port parity fixture still records the upstream result, while the user-facing practical service no longer knowingly emits these exact, directly contradicted readings.

## Exact allowlist

| Written form | Raw-port issue documented in fixture | NIKL-backed surface used before IPA | Evidence |
|---|---|---|---|
| 값어치 | Pinned port: 갑써치 | 가버치 | Official NIKL FAQ mcfaq_seq=5949; §15 붙임 |
| 넓죽하다 | Pinned port: 널쭈카다 | 넙쭈카다 | NIKL *표준 발음법* §§10, 23; official Q&A qna_seq=307508 |
| 넓둥글다 | Lexical ㄼ exception | 넙뚱글다 | NIKL *표준 발음법* §10 exception |
| 넓적하다 | Related lexical ㄼ exception | 넙쩌카다 | Official NIKL Q&A qna_seq=322805 |
| 읽고 | Pinned port: 익꼬 | 일꼬 | NIKL *표준 발음법* §1 commentary and §§11/23; Q&A qna_seq=315279 |

Sources:
- https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5949&mn_id=217
- https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
- https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307508
- https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=322805
- https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=315279

## Implementation and guardrails

- `src/app/g2pk_web.js`: a finite, exact-word map corrects the Korean surface before `engine.convertSurface()`.
- `result.normativeCorrections` and the analysis text expose which exact correction was applied and its evidence label.
- If the pinned port changes string length, correction is skipped rather than applied at potentially incorrect offsets.
- No broad `ㄺ` or `ㄼ` rule was added; unrelated words such as 넓다, 읽는, and 같이 must not be corrected by this allowlist.
- `tests/fixtures/g2pk-surface-regression.json` continues to preserve raw vendored-port output for upstream parity diagnostics. It is not treated as IPA or Ukrainian gold.
- `tests/g2pk-nikl-surface-corrections.test.mjs` checks all exact forms, the registered source identities, running-text offsets, punctuation preservation, and that Ukrainian output is recomputed from IPA.

## Evidence boundary

NIKL's Korean bracket notation confirms a Korean surface reading, not broad IPA and not Ukrainian adaptation. The code's IPA and Ukrainian output are reproducible outputs of the project adapter but remain provisional until independently adjudicated. Live direct retrieval of some official pages has returned HTTP 403 in the repository's runner; this review uses official indexed content and the registered official source records, not a claimed successful live crawl. Item-level KOGL reuse marks remain unverified.

## Acceptance status

- Implementation: implemented on the continuation branch.
- Test acceptance: pending exact-head GitHub Actions at the time of this document.
- Raw g2pK parity: intentionally preserved as a diagnostic; not a claim that the upstream port is normatively correct.
- IPA/Ukrainian independent gold: still outstanding.
- Release readiness: research preview / partial prototype, not fully validated.
