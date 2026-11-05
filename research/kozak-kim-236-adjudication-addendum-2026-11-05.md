# 236-candidate adjudication addendum — 2026-11-05

This addendum records the latest evidence decisions on the single working branch `research/236-candidate-review-2026-11-05`. It supplements the existing review and handoff; the reconstructed baseline remains 236 occurrence rows.

## Current counts

- 10 `RULE_CONFIRMED_STANDARD_VARIANT`
- 153 `PROFILE_CONVENTION_MISMATCH_CONFIRMED`
- 20 `ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW`
- 53 `NOT_INDIVIDUALLY_ADJUDICATED`
- 73 active unresolved occurrences (20 abstentions + 53 without individual disposition)

The 236-row historical membership is still reconstructed from pinned replay, not proof of the original selector's membership. Profile-convention closures are not token-specific acoustic IPA gold.

## New profile-convention resolutions

IDs 475, 2392 and 2667 are lenis /s/ before /i/ across a coda-resyllabification boundary. Their morphological parses place a noun-final ㅅ before copular 이-. NIKL Standard Pronunciation Rule 13 explicitly gives the resyllabification pattern 옷이[오시]. Kang (2010) studies /s/ before /i/ and reports context-conditioned palatalization/coarticulation, not a categorical phoneme change. The comparator [ɕ] versus project broad /s/ is therefore classified as a broad-vs-narrow profile difference. No token-specific acoustic IPA review was performed, and no production rule or Ukrainian target changed.

## New standard-form resolution

ID 2092 contains the exact Sino-Korean lexical item 출시 (出市). NIKL Standard Pronunciation Rule 26 requires fortition of ㅅ after ㄹ in Sino-Korean words. NIKL Q&A 330766 confirms the rule's scope and notes lexical exceptions; it does not itself attest 출시. The Kpedia lexical entry independently identifies 출시 (出市) and gives [출씨]. The comparator's fortis [ɕ͈] and the project's /s͈/ represent the fortis category, while the Kozak output's plain /s/ omits fortis. This is an exact lexical/rule confirmation, not token-specific acoustic IPA gold. No production rule, benchmark gold or Ukrainian target changed.

## Explicitly not closed

- ID 49 remains open: its colloquial nominal/copular parse needs confirmation.
- IDs 143 and 538 remain open because the lexical form has variable accepted pronunciations and the exact inflected token needs independent review.
- IDs 481 and 551 remain open because they include fortis sibilants; lenis /s/ evidence does not adjudicate fortis place.
- ID 551 is mixed: only its lenis component is in the /i/ environment; its fortis component remains unresolved.
- ID 78 remains evidence-limited pending token audio or independent Korean IPA review.
- No IPA gold, audio annotation, Ukrainian target, or production behavior was changed.

## Evidence sources

- [NIKL Standard Pronunciation Rule 13 and Rule 26](https://korean.go.kr/kornorms/regltn/regltnView.do)
- [NIKL Online Q&A 330766 — Rule 26 scope and lexical exceptions](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&qna_seq=330766)
- [Kpedia — 출시 (出市), pronunciation [출씨]](https://www.kpedia.jp/w.asp?isnop=1&p1=13456)
- Kang (2010), S019: lenis /s/ coarticulation before /i, ye, ya/; see the existing source register for the project citation and scope limitations.

## Verification status

The generated ledger and adjudication register have been updated on the same branch. GitHub Actions must pass on the latest branch head before these changes are considered verified. The repository remains a partial research prototype, not research-certified or release-ready.
