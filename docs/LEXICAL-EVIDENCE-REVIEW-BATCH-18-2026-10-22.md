# NIKL Q&A claim-scope review — batch 18 (2026-10-22)

## Why this review exists

The source register had two Q&A citations marked unreviewed even though the official search index exposed substantive answer text. One citation also appeared to be overstated in the lexical corpus: the indexed answer for qna_seq=334294 discusses the *rule environment* and forms 맑게[말께], 묽고[물꼬], 밝기[발끼], but the available answer text does not list 읽고[일꼬] or 밝는[방는]. A citation can support a rule without directly attesting every form later derived under that rule.

## 1. qna_seq=330743 — direct attestation

- Official URL: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=330743
- Indexed title: “낱말 발음이 궁금합니다.”
- Indexed question date: 2026-05-03; answer date: 2026-05-04.
- The official indexed answer explicitly gives 밝게[발께] and 굵은[굴근] and explains the relevant rule environments.
- Decision: mark this source as reviewed with direct Korean surface attestations for these two exact forms. Keep Ukrainian output provisional; the bracketed Hangul reading is not IPA; item-level reuse marking remains unverified.
- Locator normalization: the lexical rows for 밝게 and 굵은 use the same official URL recorded in the source register.

## 2. qna_seq=334294 — partial rule-context support, not full-form attestation

- Official URL: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=334294
- Indexed title: “ㄺ + ㄱ 답변에 대한 재질문.”
- The available official indexed answer discusses 닭과[닥꽈], 맑게[말께], 묽고[물꼬], and 밝기[발끼], including the verb-stem ㄺ-before-ㄱ exception.
- It does **not** list 읽고[일꼬] or 밝는[방는] in the answer text available for review.
- Decision: the source register now describes the source as partially reviewed and narrows its claim scope. The lexical corpus no longer says that this Q&A directly confirms 읽고 or 밝는.
- Current treatment: 읽고[일꼬] is derived from the Standard Pronunciation Rules' licensed verb-stem ㄺ-before-ㄱ exception plus fortition; 밝는[방는] is derived from complex-coda simplification and nasal assimilation. These remain rule-derived rather than directly attested by this citation.
- This is a correction to evidence provenance, not a change to the Korean target forms or Ukrainian outputs.


## 3. qna_seq=307508 — partial support pending spelling resolution

- Official URL: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307508
- Indexed title: “넓의 발음.” The answer explicitly describes the lexical ㄼ exception and gives 넓죽하다[넙쭈카다] plus a second form rendered in the indexed text as 넓둥굴다[넙뚱글다].
- The corpus input is 넓둥글다. The indexed answer's visible spelling differs by one vowel from the corpus input; without full-page verification it would be unsafe to claim exact orthographic attestation.
- Decision: mark the citation as reviewed but partial. It supports the relevant exception context and the pronunciation string [넙뚱글다], but the exact spelling-to-form match remains unresolved. The lexical target itself is unchanged.

## 4. qna_seq=317229 — direct attestation

- Official URL: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317229
- Indexed title: “외곬에.” The official indexed answer directly states “외곬에” is pronounced [외골쎄] and cites Standard Pronunciation Rules §14.
- Decision: mark the exact Korean surface as directly attested; keep IPA and Ukrainian target validation separate. The source URL in the lexical corpus is normalized to the official desktop locator.

## Evidence limits

The review used substantive text exposed in the official NIKL search index because direct HTML fetch was unavailable in this environment. The exact statements above are bounded by that visible indexed text; this report does not claim a complete HTTP retrieval of either page. Source reuse rights remain unverified. No broad-IPA gold or Ukrainian-target validation was added. No production transcription logic changed.

## Updated inventory

The citation-only/unreviewed source-register count falls from 42 to 38. Four sources are now reviewed at claim-scope level. qna_seq=330743 directly attests 밝게 and 굵은; qna_seq=317229 directly attests 외곬에. qna_seq=334294 is partial contextual evidence for 읽고/밝는, while qna_seq=307508 is partial because the indexed orthography for the cited compound does not exactly match the corpus input.
