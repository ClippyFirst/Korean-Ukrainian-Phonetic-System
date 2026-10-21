---
name: nikl-evidence-audit
description: Use when adjudicating Korean pronunciation claims from NIKL rules, the Standard Korean Dictionary, official answers, or secondary literature; when reviewing lexical overrides, uncertain morphology, or source-to-IPA provenance.
---

# NIKL Evidence and Lexical Audit

## Mission

Keep the research engine evidence-gated. Every deterministic pronunciation decision must be traceable to an official attestation or a documented, correctly scoped application of a normative rule. Distinguish what the source says from what the engine derives.

## Source hierarchy and scope

1. NIKL Standard Pronunciation Rules (표준 발음법): https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
2. NIKL Standard Korean Dictionary: https://stdict.korean.go.kr/
3. Other official NIKL material, official answers, or official corpora where access/use terms allow, with exact page and context recorded.
4. Peer-reviewed linguistic publications and scholarly grammars, explicitly marked as secondary evidence.
5. Independent G2P implementations (g2pK, KoG2P, Kiwi, etc.) for differential tests and candidate discovery only.
6. Unverified web examples, community posts, and language-model suggestions as leads only.

Authority is claim-specific. A pronunciation rule, a dictionary entry, an official example, and a secondary phonetic description answer different questions; do not collapse them into one generic "source" field. Verify current terms, API conditions, and redistribution rights before bulk collection or publication.

## Evidence classes

Use explicit classes and never conflate them:
- DIRECT_OFFICIAL_ATTESTATION: exact form/pronunciation is printed by an official source;
- OFFICIAL_DICTIONARY_ATTESTATION: linked to an exact dictionary entry, lemma, and relevant sense/POS where available;
- OFFICIAL_RULE_DERIVATION: candidate follows from a cited rule and verified environment, but is not directly listed;
- OFFICIAL_ANSWER: official answer with exact question/context and date;
- SECONDARY_SUPPORTED: claim supported by a cited scholarly source;
- DIFFERENTIAL_ONLY: one or more G2P tools agree, but normative evidence has not been established;
- HYPOTHESIS_UNRESOLVED: insufficient or conflicting evidence.

If the repository already has a compatible schema, map these concepts to its established vocabulary instead of creating incompatible duplicate labels.

## Claim-level evidence record

For every material pronunciation claim, record:
- exact orthographic input and normalized form, without losing the original;
- lexical identity, POS, sense, and morphological segmentation only where established;
- exact official surface pronunciation if printed;
- source class and source authority;
- canonical URL, article/entry/question ID, retrieval date, and capture hash or immutable locator;
- exact short excerpt or source-position locator needed for review, subject to copyright policy;
- applicable environment and each rule in the ordered derivation chain;
- expected IPA and whether it is attested, derived, reviewed, or unresolved;
- variant/optionality notes;
- engine implementation and regression-test references;
- adjudication status, reviewer, date, disagreements, and next evidence needed.

Do not cite a broad homepage when a precise article or dictionary entry is available. Do not copy a pronunciation from a homograph, unrelated sense, or different part of speech.

## Adjudication procedure

1. Reproduce the input and output from the current engine before changing behavior.
2. Determine whether the form is an official listed example, a dictionary-attested lexical item, or an inferred/generated case.
3. Confirm the relevant article text, exact environment, exceptions, cross-references, and morphological assumptions.
4. Seek counterevidence: nearby forms where the rule does not apply, alternate lexical parses, optional pronunciations, and source disagreements.
5. Separate orthographic facts, morphological analysis, Korean surface pronunciation, IPA transcription, and Ukrainian adaptation.
6. If evidence supports a deterministic result, add or correct the existing evidence record and a focused regression.
7. If evidence is conflicting or incomplete, preserve an explicit unresolved/incomplete state with a machine-readable reason; do not pick the most plausible result silently.
8. Record the decision and why alternatives were rejected. Do not overstate certainty from agreement among tools.

## Resolving conflicting sources

When official sources appear to disagree, do not silently choose whichever output matches the current engine.

1. Verify that the sources refer to the same lexical item, POS, sense, grammatical form, and speech/style conditions.
2. Check whether one source gives a normative standard, another a dictionary-listed variant, and another a descriptive or colloquial form.
3. Record publication/update dates and whether the source is current or historical.
4. Preserve each source's claim independently and explain the scope of the apparent disagreement.
5. If the disagreement remains material, mark the engine decision unresolved or variant-bearing and state what expert review or additional source would resolve it.
6. Do not treat a majority vote among G2P systems as a resolution of normative evidence.

### Safe handling of automated suggestions

Automated agents may propose candidate examples, article mappings, segmentations, or IPA. Treat each as untrusted until independently verified against the source and project schema. A source URL alone does not prove that the cited page contains the claimed form. Re-open the exact source, verify the relevant span, and retain a reproducible locator. Reject unsupported claims rather than weakening the acceptance gate to fit them.

**Direct-example gate:** use `DIRECT_OFFICIAL_ATTESTATION` or the repository's equivalent `direct-NIKL-example` status only when the exact orthographic form and pronunciation are visible in the cited official page/entry/answer. Inspect the actual enumerated example list, not just the general rule or its explanatory prose. A secondary search result quoting a rule, agreement with G2P, or a plausible derivation cannot upgrade a rule-derived case to direct evidence. If the exact source span cannot be checked, retain `OFFICIAL_RULE_DERIVATION` / `derived-from-NIKL-rule` or `HYPOTHESIS_UNRESOLVED` and record the access/evidence limitation.

**Regression lesson:** NIKL §13's current enumerated examples include `깎아[까까]`, `옷이[오시]`, `있어[이써]`, `낮이[나지]`, `꽂아[꼬자]`, `꽃을[꼬츨]`, `쫓아[쪼차]`, `밭에[바테]`, `앞으로[아프로]`, and `덮이다[더피다]`; they do not list `숲이[수피]`. The general liaison rule supports `숲이[수피]` as a candidate, but without an exact lexical attestation it must remain rule-derived. See the official [Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002).

## Morphology and rule scope

- A rule's existence does not establish that it applies to every visually similar string.
- Do not infer morpheme boundaries solely from a Hangul substring if the surface form is lexically or grammatically ambiguous.
- Treat heuristic segmentation as a candidate, not a fact. Keep heuristic provenance and confidence visible.
- Apply only rule environments licensed by the source. Preserve ordered interactions and negative conditions.
- Do not turn a dictionary pronunciation into a universal productive rule.
- Preserve variation and optionality instead of normalizing them away.
- Keep a strict boundary between source evidence and Ukrainian target choices; a target-language preference cannot be used as evidence for Korean pronunciation.

## IPA-first boundary

The research pipeline is:

Hangul → structure/morphology → Korean phonology → IPA or typed unresolved result → Ukrainian target adaptation → Ukrainian practical orthography.

The IPA/typed result must be the actual input to the Ukrainian adapter. Do not accept an audit-only IPA field alongside a parallel grapheme-to-Ukrainian implementation. If the current pipeline violates this, classify it as an architecture defect and trace the actual call graph before claiming resolution.

## Review and audit quality

- Prefer correcting an existing evidence record and its test over adding duplicates.
- Add a negative regression when an earlier overgeneralization applied a rule outside its official environment.
- Ensure source citations remain available after generated artifacts are rebuilt.
- Record disagreement between official norms, dictionary entries, scholarly analysis, and G2P output rather than hiding it.
- Never fabricate IPA, source quotations, article IDs, dictionary senses, URLs, licenses, or test outcomes.
- When no independent linguist review is available, mark that limitation; automated self-consistency is not independent validation.

## Completion report

For each audit batch, report the claims reviewed, evidence classes, records changed, regressions added, unresolved items, commands actually run, and exact commit/branch. State whether conclusions are directly attested, rule-derived, or provisional. Update the existing audit/handoff rather than creating a competing source of truth.
