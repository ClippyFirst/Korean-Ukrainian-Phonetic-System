---
name: nikl-evidence-audit
description: Use when adjudicating Korean pronunciations against official NIKL rules, dictionary entries, examples, or Q&A, and when auditing provenance and evidence quality for lexical overrides.
---

# NIKL Evidence and Lexical Audit

## Mission

Prevent unsupported pronunciations from entering the research engine. Establish what the official source actually supports, where evidence applies, and which claims remain provisional.

## Source hierarchy

1. NIKL Standard Pronunciation Rules: https://korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002
2. NIKL Standard Korean Dictionary: https://stdict.korean.go.kr/
3. Other official NIKL material and answers, with exact page/context recorded.
4. Peer-reviewed linguistic references, clearly labelled as secondary evidence.
5. Independent G2P implementations (e.g. g2pK, KoG2P, Kiwi) for differential testing only, not normative adjudication.
6. Unverified web examples and model suggestions are leads, not evidence.

Check each source's terms, API conditions, and redistribution limits before downloading or committing data. Do not assume public accessibility means unrestricted reuse.

## Evidence record

For each claim, record where available: exact Korean form; lexical identity/POS if established; official surface pronunciation exactly as printed; source class; canonical URL; article/entry ID; relevant short excerpt or local reference; retrieval date; environment and morphology; whether directly attested or derived from a cited rule; independent review status; disagreements; confidence/status; and what evidence would resolve uncertainty.

Use distinct statuses:
- directly attested: exact form/pronunciation appears in the source;
- rule-derived: follows from a cited rule but is not directly listed;
- dictionary-attested: tied to an exact dictionary entry;
- secondary-supported: supported by a cited non-primary source;
- hypothesis/unresolved: insufficient evidence.

Never label a rule-derived candidate as a direct official example. Never copy a pronunciation from a different homograph or part of speech. Do not erase optionality or variation in the source.

## Engine integration rules

- Official Korean surface form, IPA analysis, and Ukrainian target are separate fields.
- Only a documented transformation or verified source record may license a deterministic pronunciation override.
- A rule's existence does not prove it applies to every similar spelling; check the exact environment, morphology, and exceptions.
- Do not infer morphology solely from a Hangul substring if the form is ambiguous.
- When evidence does not settle the reading, preserve an explicit unresolved result and explain the missing evidence.
- Never fabricate IPA, article numbers, examples, URLs, source quotations, or test outcomes.

## Audit completion

Review existing evidence registries and reports before adding entries. Prefer correcting an existing record and test over creating duplicates. Add a negative regression when an overgeneralization caused an unsupported application. Update the existing audit/handoff with actual outcomes, limitations, commands run, and the next blocker.
