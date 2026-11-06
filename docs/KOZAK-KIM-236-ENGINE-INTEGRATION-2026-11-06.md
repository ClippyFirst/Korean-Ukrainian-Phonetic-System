# Kozak Kim: integration of the 236-candidate review

**Date:** 2026-11-06  
**Implementation branch:** `research/236-candidate-review-2026-11-05`  
**Research source of truth:** [236-candidate review](../research/kozak-kim-236-candidate-review-2026-11-05.md) and [occurrence ledger](../research/kozak-kim-236-candidate-review-2026-11-05.csv)  
**Implementation ledger:** [15 rule-confirmed occurrences](../research/kozak-kim-236-engine-integration-2026-11-06.csv)

## Decision rule

The 236 rows are benchmark occurrences, not 236 independent phonological rules. Only a source-backed, correctly scoped standard-pronunciation decision is eligible for runtime integration. A benchmark comparator, a broad/narrow IPA convention difference, or a spelling error is not by itself a production rule.

The pipeline remains:

`Hangul orthography → exact lexical/morphological licensing → Korean surface phonology → IPA → Ukrainian IPA adapter → practical Ukrainian orthography`

No Ukrainian target is hard-coded in the new rule paths. New outputs continue through the existing IPA-to-Ukrainian adapter.

## Reconciled disposition

| Candidate disposition | Cases | Runtime decision |
|---|---:|---|
| `RULE_CONFIRMED_STANDARD_VARIANT` | 15 | 14 occurrences integrated or already implemented; 1 blocked as spelling normalization |
| `PROFILE_CONVENTION_MISMATCH_CONFIRMED` | 181 | No new phonological rule; preserve broad/narrow profile distinction |
| `ABSTAIN` | 12 | No runtime change; evidence insufficient |
| `UNADJUDICATED` | 28 | No runtime change; evidence insufficient |
| **Total** | **236** | **No unsupported guessing** |

The 181 profile cases remain in the research ledger but are not promoted to categorical Korean phonology rules. The 40 abstained/unadjudicated cases remain evidence-limited.

## New runtime integrations

### NIKL Rule 5 — genitive particle `의`

Exact eojeols `그놈의` and `자신의` retain principal broad IPA /ɰi/ and expose the permitted [e] alternative. The non-initial lexical `의` [i] alternative is not offered for these two genitive-particle forms. Other non-initial lexical `의` cases retain their separate [i] behavior.

Sources: `SRC-NIKL-QNA-334585`, `SRC-NIKL-QNA-335190`, `SRC-NIKL-PRON`.

### R008 — exact dictionary-backed lexical fortition

- `정권`: `정>권` — exact Kpedia pronunciation entry; NIKL Q&A 335292 is corroborative scope evidence only.
- `유사성`: `사>성` — NIKL Korean Basic Dictionary entry 70710; its dictionary long vowel in `유ː` is also retained as `ː` in IPA. The Ukrainian adapter preserves this as a length feature rather than inventing a Ukrainian length grapheme.
- `혐오증`: `오>증` — NIKL Korean Basic Dictionary search result.

These entries do **not** create productive rules for `-권`, `-성`, or `-증`. Negative controls cover unlisted lookalikes.

### NIKL Rule 29 — compound `연전연패`

The exact eojeol + pair `전>연` is licensed for compound n-insertion. Q&A 322807 resolves the context as `연패(連敗)` (successive defeats), not `연패(連霸)`; Q&A 327019 supports the Rule 29 scope. Occurrences 1816, 1843 and 1870 are repeated tokens in one source row, not three independent speakers.

### NIKL Rule 26 — `출시미정에`

The exact eojeol + pair `출>시` is licensed. NIKL Q&A 330766 bounds Rule 26; the Kpedia entry supplies the exact `출시[출씨]` lexical attestation. The implementation does not generalize fortition to every written ㄹ+ㅅ sequence.

## Previously implemented cases preserved

Five rule-confirmed cases already had exact runtime licenses on the starting branch and were retained: `출산` (R012), `팔자걸음` (R012), `보일거라` (R013), `물가로` (R014), and `안할듯` (R013).

## Explicitly not integrated

- `머리속에` (occurrence 2490) is orthographically missing the 사이시옷 in the figurative lexical form `머릿속`. Automatically changing the input spelling would add a spelling/semantic normalization feature, not a phonological rule. It remains **BLOCKED** until that separate feature has an explicit contract and disambiguation policy.
- The 181 profile-convention mismatches remain outside categorical rule tables.
- The 12 abstentions and 28 unadjudicated rows remain unimplemented. No IPA, audio, or Ukrainian target is fabricated.

## Verification added

Browser exact-form/negative-control regressions, Python surface/trace regressions, Rule 5 variant regressions, and an occurrence-to-runtime traceability test are added. Rule coverage and source-register rows are updated in place. Exact-head CI results will be appended to the master handoff after completion.

### Phrase-level Rule 29 candidates kept out of production

The remaining cohort includes three occurrences of `한국여자로` and one of `홍콩영화들` whose benchmark comparator contains n-insertion. NIKL Q&A 330322 confirms the conditional Rule 29 [붙임 2] scope for two words pronounced as one connected phrase, but it does not attest these exact tokens. The source records have no audio or prosodic-boundary annotation; both cases remain ABSTAIN. No phrase-level heuristic is added.
