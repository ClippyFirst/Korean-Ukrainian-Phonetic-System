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

Regression coverage now includes supported /i, ye, ya/ examples, negative controls for /jʌ, jo, ju/, ㅒ and fortis /s͈/, and six resyllabified forms: 멋있어, 멋있노, 무슨뜻임, 것이냐, 저딴짓이면서, and 법알못이구만. The last three include the Rule 13 context cases 475, 2392 and 2667. Code correction commit: dcf1726212e16719b0fdc03311e5903448151e8b. No canonical IPA, phonemic output, Ukrainian target, or benchmark gold changed.

The 24 fortis ɕ͈→s͈ edit operations occur in 24 occurrence IDs across 19 source rows; 23 are before /i/ and one is before /jo/ (ID 96). Twenty-two forms contain orthographic ㅆ; two are coda-triggered fortition cases (했을시, 실시간). No [ɕ͈] runtime variant is accepted because the 2021 acoustic evidence is context- and speaker-specific and describes the fronted /s͈i/ variant as closer to [s] than [ɕ]. The 12 abstentions and 28 unadjudicated rows remain evidence-limited. The stale artifact from PR #441 is reconciled in PR #443; current exact-head CI and skipped optional jobs must be assessed on PR #443, not inferred from the earlier run.


## Post-merge continuation — 2026-11-06

PR #441 is merged into `main` (merge commit `f89c475c56796119e87130367fc15926b2428220`; verified implementation head `847cdb240aadc2c9343127fbb7de6dafad0441d4`). All 15 standard-form/rule occurrences have runtime dispositions (ten new exact integrations plus five baseline licenses). The 181 profile rows remain non-categorical; 12 abstentions and 28 unadjudicated rows remain unresolved.

The 24 fortis [ɕ͈]→/s͈/ edit operations occur in 24 occurrence IDs across 19 source rows; 23 are before /i/ and one is before /jo/ (ID 96). Direct acoustic evidence (Kong & Kang 2021) shows age- and gender-conditioned fronting of word-initial /s͈i/ in young women, but explicitly describes it as closer to alveolar [s] than post-alveolar [ɕ]. It therefore does not justify an optional [ɕ͈] IPA variant for unknown speakers. The /jo/ case remains out of scope. The two /ɘː/ versus /ʌː/ cases remain transcription-profile questions. Phrase-level Rule 29 candidates `한국여자로` and `홍콩영화들` still require exact morphology and prosodic-boundary evidence. The 12+28 residual occurrences require original audio, speaker crosswalk and two independent Korean IPA annotations, followed by separate Ukrainian target review.

### Multi-engine artifact acceptance

The multi-engine workflow on exact PR #441 head `847cdb240aadc2c9343127fbb7de6dafad0441d4` (run [42215019081](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42215019081)) did **not** pass. Comparison and reviewer-packet generation succeeded, but the export `cmp` failed: generator output contained 25 unmapped-Broad occurrences; the tracked CSV contained 26, including ID 2490 (`머리속에`) now covered by the exact alias. Failure was byte 86966 / line 26. Browser same-occurrence parity, Native/Browser parity and SIGMORPHON steps were skipped downstream; optional ByT5/Charsiu inference jobs were skipped by policy. Regenerate the tracked artifact using the pinned generator and corpus, inspect the complete row-level diff, and rerun the full workflow. Do not change the expected count or weaken `cmp`.

Current main `2e9647540e1be47571579f71b7466393172a2a6d` has successful tests 42216016963, system verification 42216016988, master artifacts 42216016940 and Pages deployment 42216016937. These do not substitute for the failed multi-engine artifact gate. No local shell test was run in this connector-only session.

### Generated unmapped-Broad CSV reconciliation

The tracked `research/kozak-kim-unmapped-mismatch-review-queue-2026-11-05.csv` has been regenerated from the exact CSV uploaded by workflow run [42215019081](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42215019081), artifact 13501009061. A row-by-row comparison identified only one stale entry: ID 2490 (`머리속에`), which the exact pronunciation alias now covers. The refreshed queue contains 25 rows and matches the artifact's 89,638 bytes; its Git blob SHA is `15655fa35b74251c8c0fdd6e2b6dc973d3bba631`. This is an artifact reconciliation, not a new linguistic adjudication. The export gate still requires an exact-head rerun; downstream parity and SIGMORPHON checks must execute before DONE_VERIFIED.

## 2026-11-06 — fortis sibilant evidence review: no [ɕ͈] runtime variant accepted

A targeted review of the 24 `ɕ͈→s͈` edit operations found **24 occurrence IDs in 19 source rows** (correcting the earlier 23-row count). Twenty-three reference realizations are before /i/; the sole /j/-initial case is ID 96 `똥꼬쑈` /ɕ͈jo/. Twenty-two forms contain orthographic ㅆ; two are coda-triggered fortition contexts, IDs 481 `했을시` and 551 `실시간`.

### Evidence assessment

- Holliday (2014, JASA) describes both Korean lenis-aspirated /sh/ and fortis /s*/ as typically palatalized before /i/ or /j/ (SRC-HOLLIDAY-2014-JASA). This is a background statement in a perception study, not token-level production evidence.
- Holliday (2016, Phonetica) explicitly notes that /s*/ may palatalize less consistently than /sh/ (SRC-HOLLIDAY-2016-PHONETICA); its own experiment is perceptual.
- Holliday & Reidy (2016) state in the poster background that /s*/ is sometimes palatalized before /i/, but the poster does not report speaker-level or token-level fortis-palatalization results from its six-speaker production sample (SRC-HOLLIDAY-REIDY-2016-POSTER).
- Kong & Kang (2020) report palatalized variants before /i/ in an abstract covering both /s/ and /s'/, but do not disaggregate which category produced them (SRC-KONG-KANG-2020-SPECTRAL).
- **Kong & Kang (2021) provide the decisive direct acoustic constraint.** Their study analyzes 39 adult Seoul Korean speakers and 1,832 sibilant tokens. For young female speakers, word-initial tense /s͈i/ has age-related spectral fronting; however, the authors explicitly state that this variant is closer to alveolar [s] than post-alveolar [ɕ], and that the pattern is context- and gender-specific (SRC-KONG-KANG-2021-SIBILANTS).

### Implementation decision

**No [ɕ͈] runtime variant is accepted.** The 2021 acoustic result does not support converting the 23 /i/ cases into [ɕ͈]; it describes a different, speaker-conditioned fronting pattern. The 2014/2016 claims are mixed background/perception evidence, and the 2016 poster does not provide a token-level fortis production result. The 2020 abstract does not distinguish lenis from fortis. No source maps the 236 occurrences to the speakers in these studies.

Keep canonical broad [s͈] unchanged in Python and Browser. Do not add [ɕ͈] to broad or narrow output, do not select a fronted variant without speaker identity and acoustic evidence, and do not change Ukrainian target mappings. ID 96 /jo/ remains separately unsupported. The 24 mismatches remain PARTIAL/BLOCKED for speaker-level adjudication; they are part of the 181 profile-convention cases and distinct from the 40 abstained/unadjudicated occurrences.

### Regression and inventory evidence

The data-inventory test `test_fortis_sibilant_candidate_inventory_has_exact_context_distribution` records the 24 operations, 24 occurrence IDs, 19 source rows, 23 /i/ contexts and the single /jo/ case. Existing negative controls retain `씨` as a no-variant case in the broad research profile. No runtime code change is required or accepted from this evidence review.
