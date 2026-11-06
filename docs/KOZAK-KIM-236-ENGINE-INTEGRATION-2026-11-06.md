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
| `RULE_CONFIRMED_STANDARD_VARIANT` | 15 | 15 occurrences integrated or already implemented (10 new exact integrations plus 5 baseline integrations); no input spelling rewrite |
| `PROFILE_CONVENTION_MISMATCH_CONFIRMED` | 181 | No new phonological rule; preserve broad/narrow profile distinction |
| `ABSTAIN` | 12 | No runtime change; evidence insufficient |
| `UNADJUDICATED` | 28 | No runtime change; evidence insufficient |
| **Total** | **236** | **No unsupported guessing** |

The 181 profile cases remain in the research ledger but are not promoted to categorical Korean phonology rules. The broad profile already exposes optional [ɕ] for lenis-sibilant occurrences where the cited context applies; it now also exposes research-only [ɛ]~[e] quality variants for ㅐ and the exact-word [k͈] variant for 게임. The ㅐ variant preserves an existing length marker but never adds one. Fortis-sibilant [ɕ͈] cases and the two /ɘː/ versus /ʌː/ symbol-profile cases are not rewritten. The 40 abstained/unadjudicated occurrences represent 17 unique token forms: repeated 아끼셔 accounts for 22 occurrences and 한국여자로 for three. The 28 unadjudicated rows include 27 lenis-sibilant mismatches outside the /i, ye, ya/ environments covered by Kang (2010), plus one separate mid-front-vowel quality case. Occurrence repeats are not independent speaker evidence.

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

- `머리속에` (occurrence 2490) now has an exact pronunciation-only lexical alias `리>속`, based on the attested reading of `머릿속`. The source spelling is preserved; no automatic orthographic rewrite or productive `머리+속` rule is introduced.
- The 181 profile-convention mismatches remain outside categorical rule tables.
- The 12 abstentions and 28 unadjudicated rows remain unimplemented. No IPA, audio, or Ukrainian target is fabricated.

## Verification added

Browser exact-form/negative-control regressions, Python surface/trace regressions, Rule 5 variant regressions, an occurrence-to-runtime traceability test, and an exact seven-form browser/Python parity test are added. Rule coverage and source-register rows are updated in place.

**Exact code-head verification (8a5e6b83f7b6b1377200be3c4bdb330dc4d16de0):** system verification [42180312202](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312202) passed Python regression/data integrity and browser regression/build (1,398/1,398); the official NIKL metadata inventory was skipped. Tests [42180312303](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312303) passed web, Python 3.11/3.12/3.13, wheel-install and teacher-corpus audit. Browser G2P [42180312258](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312258), master/research artifacts [42180312182](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312182), exhaustive test-case extraction [42180312181](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312181), external UGTPHON [42180312221](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312221), paired native/g2pk [42180312228](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312228), morphology consensus [42180312341](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312341), and morphology adapter smoke [42180312291](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312291) passed. The multi-engine diagnostic [42180312294](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312294) was still running at this documentation snapshot; no result is claimed.

### Phrase-level Rule 29 candidates kept out of production

The remaining cohort includes three occurrences of `한국여자로` and one of `홍콩영화들` whose benchmark comparator contains n-insertion. NIKL Q&A 330322 confirms the conditional Rule 29 [붙임 2] scope for two words pronounced as one connected phrase, but it does not attest these exact tokens. The source records have no audio or prosodic-boundary annotation; both cases remain ABSTAIN. No phrase-level heuristic is added.


### Derived mismatch queue refreshed after the exact 236-case runtime changes

The current unmapped-Broad snapshot is **26 rows**. Six occurrences removed from the previous 32-row export are now covered by exact runtime licenses: 545 (`정권`), 826 (`유사성`), 1610 (`자신의`), and 1816/1843/1870 (repeated `연전연패`). The 236-candidate adjudication ledger is unchanged. `그놈의` remains a diagnostic mismatch because the engine's principal /ɰi/ is source-backed and [e] is an exposed permitted variant; the UGTPHON comparator is not speaker-specific gold.

The tracked 26-row CSV matches the generated artifact row-by-row. The multi-engine export/cmp and downstream benchmark workflow on exact head `59e31ac63467280d345ee95533854b61608059f6` was still running at this documentation snapshot.



## 2026-11-06 implementation follow-up

- Added exact R008 pronunciation alias for `머리속에`; it returns the lexical fortis reading while retaining the user's written form. Negative controls prevent generalization to neighboring forms.
- Added optional research-only broad-profile variants for exact `게임` `[k͈]` and group-level `ㅐ` `[ɛ]~[e]`. The canonical output remains unchanged, and variants are not accepted as speaker-level gold or approved Ukrainian targets.
- The 12 abstentions and 28 unadjudicated cases remain blocked by missing source audio/speaker crosswalk and independent IPA annotation. Fortis sibilant place mismatches remain outside the lenis coarticulation evidence.

**Updated implementation status:** 15/15 standard-form/rule occurrences have runtime dispositions (10 new exact integrations plus 5 already present on baseline); 181 profile differences are explicitly handled as profile variants or non-integrations; 40 remain evidence-limited.

## 2026-11-06 — broad-profile sibilant scope and resyllabification parity correction

A second implementation review found two Browser/Python mismatches affecting the 236-case profile work:

- Browser previously exposed optional lenis [ɕ] for every /j/-initial nucleus in its broad profile, although the reviewed Kang (2010) evidence supports only /i, ye, ya/ (ㅣ, ㅖ, ㅑ). The Browser set now matches the Python broad-profile set exactly. No optional [ɕ] is emitted for the 27 out-of-scope lenis operations (/jʌ/, /jo/, /ju/ and other unsupported contexts); the canonical broad /s/ is unchanged.
- Browser previously inspected the original onset when constructing optional variants, so it missed surface lenis /s/ created by coda-ㅅ resyllabification. It now inspects the post-rule surface onset while retaining the source vowel context. This exposes the same research-only optional [ɕ] candidate for 멋있어 (ID 538) and 멋있노 (ID 143) as the Python path. NIKL Q&A 306166 directly attests the [머시써] variant for 멋있어; neither case is claimed as speaker-specific acoustic IPA gold.

Regression coverage now includes supported /i, ye, ya/ examples, negative controls for /jʌ, jo, ju/, ㅒ and fortis /s͈/, and the two resyllabified forms. Code correction commit: dcf1726212e16719b0fdc03311e5903448151e8b. No canonical IPA, phonemic output, Ukrainian target, or benchmark gold changed.

The 24 fortis ɕ͈→s͈ edit operations across 23 occurrence rows remain unresolved; 22 are on forms containing orthographic ㅆ and two are coda-triggered fortition cases (했을시, 실시간). The 12 abstentions and 28 unadjudicated rows remain evidence-limited. Exact-head CI must be read from the final PR #441 head; skipped optional jobs are not passes.
