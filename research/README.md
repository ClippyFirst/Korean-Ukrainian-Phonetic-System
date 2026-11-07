# Current continuation — UGTPHON five native abstentions (2026-11-06)

See [case-by-case evidence and implementation](../docs/UGTPHON-FIVE-ABSTENTIONS-RESOLUTION-2026-11-06.md) and the updated [residual triage register](final-residual-abstention-triage-2026-10-25.json).

- Three exact-form recoveries are implemented in Python and Browser: `쫒아내면` (R002), `많앗구나유유유` (R003), and `무서웟어` (R002). Raw spelling is preserved; these are provisional, not independent IPA gold.
- `칡칡이` remains blocked: the opened Busan oral-culture PDF directly records it as a folk-song heading and cites 1991 fieldwork / 1992 source, but no audio or field notes establish its spoken realization. The earlier source-register claim that the PDF text layer read `칭칭이` was incorrect and has been corrected.
- `삶의` remains blocked from asserted IPA and Ukrainian output: NIKL supports Hangul `[살믜]/[살메]`, not a word-specific IPA adjudication.
- Current implementation branch: `fix/five-ugtphon-native-abstentions-final-release-2026-11-06`; PR #454. Browser and paired Native-vs-g2pk diagnostics report 2,701/2,703 coverage and 2 unresolved cases. Full multi-engine comparison was cancelled during external implementation fetching; exact-head CI is pending on PR #454.

---

# Korean–Ukrainian Phonetic System: Research Programme

Status: evidence-scoped research prototype. Mandatory multi-engine diagnostic comparison and exact-head software verification passed on PR #443; independent Korean IPA review, independent Ukrainian target review, original historical cohort membership proof and residual token-level evidence remain open. The scoped source-redistribution gate passes for positively recorded redistributed material; it is not blanket legal clearance.
Last updated: 2026-11-06.

See [engineering workflow reference audit](../docs/ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md) for the pinned review of all four supplied repositories and project-specific adoption decisions.

This directory is the durable source of truth for research planning, evidence tracking, implementation coverage, decisions, and release acceptance. Continue work from these files rather than relying on chat history.

## Start here
1. [Master directive](MASTER-DIRECTIVE.md) — mission, principles, and working protocol.
2. [Roadmap](ROADMAP.md) — staged work programme and exit criteria.
3. [Source register](SOURCE-REGISTER.csv) — source inventory and seed sources.
4. [Rule coverage matrix](RULE-COVERAGE.csv) — traceability from rules to code and tests.
5. [Source-by-source assessment](SOURCE-ASSESSMENT-2026-10-15.md) — utility, limits, and integration decisions for current and candidate sources.
6. [Source discovery queue](SOURCE-DISCOVERY-QUEUE.csv) — prioritized research backlog with risks and next actions.
7. [Literature and methods review](LITERATURE-AND-METHODS-REVIEW-2026-10-15.md) — Korean G2P research, formal rule models, neural/hybrid alternatives, Ukrainian receiving-language studies, and the required comparison protocol.
8. [Critical literature review 01](CRITICAL-LITERATURE-REVIEW-01-2026-10-16.md) — evidence memo distinguishing accessible full-text findings from abstract-only evidence, with implementation implications and remaining review tasks.
9. [Ukrainian target-layer comparison](UKRAINIAN-TARGET-LAYER-COMPARISON-2026-10-16.md) — page-referenced comparison of Shchegel (2009) and Kovalchuk (2011), including conflicts and proposed tests.
10. [Decision log](DECISION-LOG.md) — durable record of consequential decisions.
11. [Release acceptance gates](ACCEPTANCE-GATES.md) — evidence required before a release is accepted.
12. [236-candidate review note](kozak-kim-236-candidate-review-2026-11-05.md) and [occurrence ledger](kozak-kim-236-candidate-review-2026-11-05.csv) — reconstructed cohort, exact contexts and evidence-limited dispositions.
- [236-candidate engine integration ledger](kozak-kim-236-engine-integration-2026-11-06.csv) — one runtime disposition per rule-confirmed occurrence, including existing licenses and the orthographic blocker.
13. [Sibilant-glide scope review](KOREAN-SIBILANT-GLIDE-SCOPE-REVIEW-2026-11-05.md) — Kang (2009/2010) evidence boundary for /s/ before /j/; explicitly records why 27 out-of-scope occurrences remain open.

## Current state — 2026-11-06

The current integration is on `main` at merge commit `bb972871a207b1f703503ade980a36cf3b976085` (PR [#443](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/443)). The exact PR head was `625d6e3171e30ae7a6aae525dfdd4ded2c5249f8`.

### Verified software and benchmark outcomes

- **DONE_VERIFIED — mandatory multi-engine diagnostic:** run [42226435101](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42226435101) passed pinned-engine installation/license checks, UGTPHON and SIGMORPHON split validation, adapter tests, holdout-overlap audit, reviewer-packet generation, multi-engine comparison, mismatch export, same-occurrence Browser run, Native/Browser parity and SIGMORPHON lexical-gold comparison.
- **DONE_VERIFIED — exact-head system verification:** run [42226435403](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42226435403) passed browser tests, `npm run audit:source-rights`, public-page build and generated-page checks; Python regression/data integrity also passed.
- **DONE_VERIFIED — source-rights gate, narrowly scoped:** 213 source-register rows, 12 columns and zero structural errors; zero unresolved positively recorded redistribution blockers. The source triage still contains informational review/manual-classification records for citation-only or non-redistributed references. This is not blanket legal clearance.
- **SKIPPED, not passed:** optional CharsiuG2P and ByT5 inference jobs; conditional live NIKL crawl.

### Current 236-occurrence disposition

| Disposition | Rows | Interpretation |
|---|---:|---|
| Exact standard-form runtime dispositions | 15 | Ten new exact integrations plus five pre-existing exact licenses |
| Profile-convention decisions | 181 | Explicitly not categorical phonology rules or speaker-level IPA gold |
| Pending independent Korean IPA | 12 | Abstain; no guessed target |
| Not individually adjudicated | 28 | Evidence incomplete |
| **Total** | **236** | Reconstructed candidate cohort; original historical membership is not proven |

### Remaining acceptance blockers

- **BLOCKED — independent Korean IPA:** obtain two qualified independent annotations on frozen, source-linked tokens, reconcile disagreements and retain profile/uncertainty metadata. The reviewer-packet generator is preparation tooling, not evidence of completed review.
- **BLOCKED — Ukrainian target validation:** independently review target adaptation on frozen IPA inputs, separately from Korean IPA adjudication.
- **BLOCKED — 40 residual occurrences:** 12 abstentions plus 28 unadjudicated rows require token-level source/audio/speaker/prosody evidence or qualified independent IPA annotation.
- **PARTIAL — historical cohort identity:** a reproducible reconstructed 236/239 inventory exists, but the original selector/member list is not proven.
- **BLOCKED — broader source review:** the strict gate covers positively recorded redistribution; it does not grant rights to unrecorded or future reuse. Obtain item-level terms before adding retained source material.
- **PARTIAL — broad coverage:** continue only where the current rule-coverage matrix identifies a concrete gap with primary-source evidence and cross-runtime acceptance.

**Readiness:** software-verified bounded research prototype; not independently research-certified and not release-ready.

## Working rules
- Update these files as work progresses. Every work session must leave a durable status update.
- Record exact evidence, source URLs, versions, commit SHAs, commands, and outcomes.
- Distinguish not checked, checked and absent, partially implemented, implemented, tested, and independently reviewed.
- Do not mark work complete based on documentation claims alone.
- Prefer small, reviewable changes on task-specific branches and integrate only after required checks.
- Never claim a branch was merged, a test passed, or a site was verified unless the result is recorded.
- If uncertain, record the uncertainty and next verification step.

## Status vocabulary
Use controlled statuses where possible: not_started, in_progress, blocked, source_verified, formalized, implemented, tested, runtime_verified, cross_runtime_verified, independently_reviewed, accepted, rejected, deferred.

A single item may need separate source, implementation, testing, and review statuses. Do not collapse them into one ambiguous “done” field.


## Official NIKL collection continuation — 2026-10-21

The metadata-first collector is available at `scripts/nikl-norm-crawler.mjs`; see `docs/NIKL-NORM-CRAWLER.md`. It is designed to inventory only the 30 articles of 제2부 표준 발음법, checks robots.txt, records exact response and per-article hashes, and fails closed on incomplete extraction. Fixture-based tests are part of the existing Node regression suite. The live crawl was attempted by GitHub Actions but the official page returned HTTP 403; the workflow recorded BLOCKED and did not try alternate hosts or bypasses. No live article inventory was produced. Source reuse terms remain unassessed, and the default output does not retain article text. See `research/SOURCE-REGISTER.csv`, `research/RULE-COVERAGE.csv`, and the latest master handoff for current status.

## Feature continuation — Korean Revised Romanization (2026-10-28)

The RR audit view is being developed in [PR #354](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/354). See [the feature contract and evidence](../docs/KOREAN-ROMANIZATION-RR-2026-10-28.md), [the roadmap status](ROADMAP.md#korean-revised-romanization-audit-view--2026-10-28), and [the RR release gate](ACCEPTANCE-GATES.md#addendum--revised-romanization-feature-gate-2026-10-28). It is intentionally a parallel display from resolved surface Hangul; IPA remains the only source for the Ukrainian target. The implementation is partial until exact-head CI/browser checks and a complete source-backed NIKL RR conformance matrix pass.


## 2026-11-05 — engine scope and mismatch continuation

NIKL R001–R016 and their exact-form licenses belong exclusively to Kozak Kim. The ordinary browser and optional Python g2pK adapters now preserve raw g2pK surfaces and derive IPA without Kozak Kim NIKL or lexical overlays. This restores a genuinely independent comparison baseline; see `docs/G2PK-INTEGRATION-2026-10-15.md` and the current repository audit.

The historical 239 Broad-v2 mismatch occurrences remain PARTIAL / EVIDENCE-LIMITED. They are not 239 proven engine bugs. The 36-row unmapped queue is a later, narrower extraction; the 1,267-row fragment export is a different occurrence/fragment grain. Each candidate correction needs the original source context, profile/normalization provenance, a defensible Korean pronunciation analysis, and a negative control before production promotion.


## 2026-11-05 follow-up — context-recovered R013 cases

The historical **239** figure is the 2026-11-02 population of Broad-v2 mismatch occurrences whose fragments had not yet been assigned to C01–C10 candidate families. It is not the current count of unresolved production defects. Subsequent cluster work (including C11 and C12) reclassified substantial portions; the later **36-row** unmapped review queue is a narrower extraction and has a different grain. Do not treat 239, 36, 1,267 fragment rows, 13 cluster rows, or 38 paired-discrepancy rows as interchangeable.

Using the pinned `naver-ai/UGTPHON:ko/test.json` source at commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`, four exact same-eojeol forms now have source-context-backed NIKL §27 licenses in Kozak Kim only: `해줄것`, `많을거같이`, `내릴수있는`, and `존중시킬수도있지만`. The context/decision register is [`kozak-kim-context-adjudication-2026-11-05.csv`](kozak-kim-context-adjudication-2026-11-05.csv). The UGTPHON Broad-v2 IPA is a comparator, not normative gold; the NIKL rule supplies the phonological basis. Browser/Python tests cover the exact forms, full source sentences, negative controls, and g2pK isolation.

One additional queue item, `출산` (UGTPHON row `dc_inside_2107`), is **retained under the existing Kozak Kim R012 / NIKL §26 license** pending independent review: the Broad-v2 comparator omits fortis /s͈/, but that alone is not sufficient reason to remove a source-backed rule. The full user-generated context is not duplicated in the ledger because it contains profanity; the pinned row ID is retained.

The 36-row queue now has complete recorded dispositions: four exact-form R013 fixes, one provisional R012 retain (`출산`), and 31 individually reasoned `ABSTAIN` decisions. These are conservative production dispositions, not independent IPA judgments. The full hash-pinned 239-occurrence/context ledger remains blocked on exact historical membership and fragment-to-C01–C10 assignment; the 36-row queue is not a substitute. The full post-fix UGTPHON benchmark has not been rerun. Do not claim that all 239 are fixed or that old benchmark metrics measure the new code.


## 2026-11-05 follow-up — queue dispositions and trace provenance

The 36-row narrow Broad queue now has explicit row-level dispositions: four exact R013 fixes, one provisional R012 retain (`출산`), and 31 evidence-limited abstentions in [the individual decision register](kozak-kim-31-row-individual-abstentions-2026-11-05.csv). Each abstention records the occurrence/source-row locator, embedded full source context (text, canonical form and phoneme annotation), occurrence-specific token index, pinned UGTPHON commit and source blob, engine run-head/profile, benchmark artifact/report hashes, normalizer/profile blob hashes, queue blob SHA, and a row-specific reason. The Kozak engine run-head is pinned to `c0cbe3740e734c87d3202cca496b83d9603ea218`; the normalizer script, Broad sensitivity profile, benchmark run/artifact/report digests, and UGTPHON dataset Git blob are now pinned per row in the expanded register. These are conservative production decisions, not independent IPA judgments.

Python `RuleTrace` now exposes per-occurrence `applied_occurrences` and `license_contexts` (including matched source license, source pair, word form, index and before/after state); the original scalar `license_context` remains for compatibility.

The full historical **239** population remains separate and BLOCKED. The original 2026-11-02 multi-engine artifact has been recovered and hash-pinned (run `41471244424`, artifact `13156351613`, SHA-256 `749ac9a2b9db96c1e27828919afe05ef4320e35ca6a91ab2038c1ff3e9d04c69`; run-head `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695`). It contains 2,703 stable occurrence records per engine and pins the UGTPHON source revision, Native IPA profile, Broad sensitivity profile, normalization code snapshot and g2pK 0.9.4. What remains unrecovered is the exact 239-member ID set or a reproducible historical per-fragment C01–C10 assignment/selection predicate. The 1,267-row fragment export and 36-row current queue do not encode that membership. Do not select an arbitrary subset or create placeholder rows.


## 2026-11-05 — recovered historical benchmark source artifact

The original 2026-11-02 multi-engine benchmark artifact has now been recovered and pinned in [the historical-239 recovery manifest](kozak-kim-historical-239-recovery-manifest-2026-11-05.md): workflow run `41471244424`, run-head `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695`, artifact `13156351613`, SHA-256 `749ac9a2b9db96c1e27828919afe05ef4320e35ca6a91ab2038c1ff3e9d04c69`. It contains the full 2,703-occurrence ten-engine report, the pinned UGTPHON source revision, the native and broad profile IDs, normalization contract and upstream engine pins.

This closes the *artifact recovery* part of the 239 task, but not the 239-row ledger. The tracked 1,267-row mismatch export does not preserve a per-fragment C01–C10 assignment or an explicit historical-239 membership flag. The original selection predicate/assignment snapshot must be reproduced and shown to yield exactly 239 stable IDs before source contexts and individual decisions can be joined. Do not force a 239-row selection from the aggregate count.

The 31 current-queue abstention rationales now identify each occurrence, source row and its concrete unmatched Broad edit(s); all 31 decisions remain conservative evidence-status abstentions, not independent IPA judgments. The recovered historical benchmark ZIP has been hash-verified, but inspection of the pinned exporter shows that its stored cluster labels are only occurrence-level unions over strict plus Broad edits. The union cannot reconstruct the historical per-fragment C01–C10 membership predicate; see the recovery manifest for the exact negative reconstruction counts and remaining acceptance condition.

## 2026-11-05 verification refresh — current `main`

Current `main` is `043754498f3ad8a17aa6c13b5f643b197536da8a`. Draft PR #436 is the only open PR and carries the 236-candidate review branch; the merged PR #435 source branch is retained. Exact-head GitHub Actions on this commit: tests `42000327552` PASS (Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, browser tests); System Verify `42000327509` PASS (Python and browser tests/build; live NIKL metadata-only inventory SKIPPED); master/research artifacts `42000327383` PASS; Pages deployment `42000327385` PASS. These checks validate software and generated artifacts, not independent IPA correctness, Ukrainian target quality, or source-item rights.

The narrow 36-row queue's disposition register is complete (4 FIX, 1 provisional RETAIN, 31 ABSTAIN); the five source-context adjudication rows are separately recorded in `kozak-kim-context-adjudication-2026-11-05.csv`. Python `RuleTrace` per-occurrence `applied_occurrences` and `license_contexts` are implemented and covered by the verified test suite. A replay now yields 239 reconstructed candidate IDs and a 236-row context-linked review ledger is proposed in PR #436. The original historical selector/member list remains unproven, and 236 individual IPA decisions remain outstanding.

### Historical Broad mismatch recovery

- [370-row full-context, hash-pinned Broad mismatch ledger](kozak-kim-broad-mismatch-context-ledger-2026-11-05.csv): all broad-profile mismatch occurrences from the pinned 2026-11-02 report, joined to exact UGTPHON sentence/token context and engine/profile/normalizer provenance. All are conservatively `ABSTAIN` pending independent adjudication.
- [Historical 239 recovery manifest](kozak-kim-historical-239-recovery-manifest-2026-11-05.md): explains why the 370-row evidence superset must not be confused with the historical 239-member cohort.



### Historical 239 baseline refinement — 2026-11-05

The pre-C11/C12 benchmark artifact and C01–C10 aggregate cluster snapshot have been recovered and hash-pinned. The missing item is narrower than previously stated: not the benchmark or baseline, but the per-fragment assignment snapshot / executable selection predicate required to reproduce exactly 239 unique occurrence IDs. See the [updated recovery manifest](kozak-kim-historical-239-recovery-manifest-2026-11-05.md). Do not replace this historical cohort with the 370-row Broad context superset.


### 31-row provenance correction — 2026-11-05

The 31-row abstention ledger's Broad profile blob SHA was found truncated to 39 characters. All 31 rows and the regression expectation now use the complete 40-character SHA-1 `e13086f0fd98ce9564326ff50b0458c27392932f`. This changes provenance metadata only, not linguistic decisions or runtime behavior. Exact-head CI for the connector-created commit remains unverified.


## Reconstructed 239-case candidate replay — 2026-11-05

A replay of the pinned pre-C11/C12 benchmark now yields a **239-ID candidate set**. This is a material narrowing of the earlier recovery blocker, but it is deliberately not labelled the original historical membership snapshot: the original selector/list was not preserved, and the recovered replay is a candidate interpretation of the triage note.

### Exact replay inputs

- Baseline code head: `e7933ae4a67c94f0f69b4747d8e388aa082fc347`.
- Workflow run / artifact: [41453407662](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41453407662) / [13148075070](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41453407662/artifacts/13148075070).
- Artifact ZIP SHA-256: `075ceff080decbb142492448c9344816bfb53f1e87fe563826668d037c053b89`.
- Report SHA-256: `8c25e630ca828719b269aeb84c8037d9c40f881a0f15c2e4ddf9d427edffa0f9`.
- Historical classifier source: `scripts/export_kozak_kim_mismatch_fragments.py` at commit `8c335dd7031bdae59b3ef7db715b54f0fdc9bcd5`, blob `e0bb7f32d5b320d468e0bdcab0ed134c7a3278ec`.
- Candidate ID snapshot: [`kozak-kim-historical-239-candidate-ids-2026-11-05.txt`](kozak-kim-historical-239-candidate-ids-2026-11-05.txt).

### Replayed rule and result

For each Native scored occurrence with Broad edit distance greater than zero, the Broad reference/prediction pair was aligned using the historical NFC-plus-combining-mark grapheme aligner. The **Broad fragments only** were concatenated and passed to the pre-C11/C12 aggregate C01-C10 classifier. An occurrence was selected only when that aggregate classifier returned `UNMAPPED_REQUIRES_REVIEW` and no C01-C10 label.

- Broad mismatch superset: **370** occurrences.
- Reconstructed candidate set: **239** unique occurrence IDs, **111** source rows, **154** unique tokens.
- The replay exactly reproduces the historical aggregate count of 239.
- This is an occurrence-level aggregate selector, not a per-fragment selector. The later per-fragment classifier returns **269** occurrences with at least one individually unmapped Broad edit. These populations must not be conflated.
- Therefore the earlier prose saying that the historical 239 necessarily meant “at least one individual fragment was unmapped” was too strong. The replay supports the narrower aggregate interpretation above; the original selection implementation remains unproven.

### Crosswalk to decisions already recorded

| Current disposition | Candidate IDs | Interpretation |
|---|---:|---|
| `FIX` | **3** | IDs `37`, `704`, `2031` overlap the four exact R013 fixes in the 36-row queue. Their exact source-context licenses are implemented in Kozak Kim and covered by the merged PR #426 verification. |
| `RETAIN` | **1** | ID `1140` (`출산`) is a provisional R012 retain, still awaiting independent Korean IPA review; it is not counted as solved. |
| `ABSTAIN` | **22** | These IDs overlap the individually reasoned 31-row abstention ledger; they remain unresolved pending evidence/review. |
| No individual disposition | **213** | Candidate rows without a row-specific fix/retain/abstain decision in the current narrow queue. |

The fourth exact R013 fix, occurrence `2018` (`존중시킬수도있지만`), is outside this reconstructed candidate set because its historical Broad fragments already receive C02/C04 aggregate labels. Thus **3 of the 239 candidates have verified exact-form fixes**, leaving **236 candidate cases not yet resolved** (213 undecided + 22 abstentions + 1 provisional retain). This is a crosswalk against the old benchmark, not a claim that a post-fix full benchmark now has exactly 236 mismatches.

### Status and acceptance boundary

- Historical 239 membership: **PARTIAL** — a hash-pinned replay yields exactly 239 stable candidate IDs, but the original saved ID list/predicate is absent, so historical identity is not yet independently proven.
- Candidate remaining count: **236**, after subtracting only the three verified FIX overlaps. RETAIN and ABSTAIN do not decrement the unresolved count.
- Next acceptance: confirm that the original 239 triage used this aggregate Broad-only pre-C11/C12 selector, or recover the original selector/member list; then preserve the 239-row candidate crosswalk and adjudicate the remaining 236 individually.
- No runtime phonological rule was changed in this recovery pass. The full post-fix benchmark has not been rerun. No independent IPA decision is inferred from the benchmark label.



## Exact-head CI and merge record — 2026-11-05

The reconstructed candidate snapshot and its regression crosswalk were merged to `main` through PR [#435](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/435), merge commit `98e450f1fb90e920d2b372ab3098b000d34de2e2`. PR head before merge: `f4064bb998343f587ee769259059db7202dc121f`.

Exact-head checks on the PR head:
- System Verify [42009815364](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009815364): **PASS** — Python regression/data integrity and Browser regression/build. Official NIKL metadata inventory: **SKIPPED**.
- Tests [42009822625](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009822625): **PASS** — Python 3.11, 3.12, 3.13; web tests; teacher-corpus audit; clean wheel installation.
- Master/research corpus artifacts [42009822802](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009822802): **PASS**.
- Exhaustive test-case register extraction [42009822726](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009822726): **PASS**.
- The first test run on pre-correction PR head `6037ed553b199b5091542064eba4121aff99ceff` exposed a test-parser defect (the test read the header line instead of the following comma-separated ID line). The parser was corrected in `f4064bb998343f587ee769259059db7202dc121f`; the exact-head rerun above passed.
- Local pytest/npm were not run in this connector-only session. GitHub Actions supplied the verification evidence.
- No post-fix multi-engine benchmark was run; the recovery PR changes only research metadata/tests and does not claim updated phonetic benchmark scores.

Current research disposition remains: **239 reconstructed candidate IDs; 3 verified FIX overlaps; 236 candidate cases still unresolved**. RETAIN and ABSTAIN do not decrement the remaining count. Historical membership is still PARTIAL pending confirmation of the original aggregate selector; no independent IPA or Ukrainian-target gold is claimed.


## 2026-11-05 — 236-candidate review and source correction

A hash-pinned pre-C11/C12 Broad-only aggregate replay yields 239 unique candidate IDs from the 370-row context superset. Three exact-form FIX overlaps (37, 704, 2031) are excluded, leaving 236 candidate occurrences. The occurrence ledger and reproducible generator are proposed in [draft PR #436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/436): 213 have no individual disposition in the current narrow registers, 22 overlap the 31-row ABSTAIN register, and one (1140, 출산) is a provisional RETAIN. RETAIN/ABSTAIN do not decrement the unresolved count.

The 236 rows carry 254 Broad edit operations across 24 signatures; 184 are lenis ɕ→s and 24 are fortis ɕ͈→s͈. The latter are not covered by the lenis-only C11 optional variant. The inherited C04 label on 206 rows is stale: current C04 has zero residual occurrences after reclassification to C12. The new ledger names inherited labels as historical only.

The Cambridge S018 bibliography is corrected to Hyun Bok Lee (1993), JIPA 23(1), pp. 28–31. Direct page-31 inspection found /s/ classified among fortis sounds, so S018 does not directly support modern lenis /s/. S019 (Kang 2010) supports only an acoustic-coarticulation hypothesis before /i, ye, ya/; the crosswalk finds 157/184 lenis edits in scope and 27 outside. The optional broad/narrow research variants are now restricted to ㅣ, ㅖ, ㅑ; canonical broad output and Ukrainian targets remain unchanged. PR #436 exact-head CI is pending at the latest branch update; earlier intermediate test failures were fixed, and the next CI result must be checked before marking this batch DONE_VERIFIED.


## 2026-11-06 — superseding 236-candidate disposition and engine integration

This section supersedes the 2026-11-05 snapshot above, which described the earlier 213/22/1 split before the complete candidate-by-candidate adjudication.

The reproducible 236-row candidate ledger now has: 15 RULE_CONFIRMED_STANDARD_VARIANT, 181 PROFILE_CONVENTION_MISMATCH_CONFIRMED, 12 ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW, and 28 NOT_INDIVIDUALLY_ADJUDICATED. The 181 profile cases are not 181 confirmed pronunciation errors or 181 new rules. The 40 evidence-limited occurrences are 17 unique token forms; repeated 아끼셔 (22 rows) and 한국여자로 (3 rows) are not independent speaker observations.

The engine integration register [kozak-kim-236-engine-integration-2026-11-06.csv](kozak-kim-236-engine-integration-2026-11-06.csv) maps all 15 rule-confirmed occurrences: 9 new occurrence-level licenses across seven exact eojeols, five already implemented baseline cases, and one blocked orthographic normalization case (머리속에). New forms are exact-scoped: 그놈의, 자신의, 정권, 유사성, 혐오증, 연전연패, and 출시미정에. The 181 profile mismatches, 12 abstentions and 28 unadjudicated rows did not generate production rules.

The exact browser/Python parity test covers all seven new eojeols and verifies equal surface Hangul and broad IPA. Dictionary length in 유ː사썽 is preserved in IPA. Exact code-head CI at 8a5e6b83f7b6b1377200be3c4bdb330dc4d16de0 passed System Verify (Browser 1,398/1,398), Tests (Python 3.11/3.12/3.13, web, wheel, teacher corpus), Browser G2P, master/research artifact generation, exhaustive register extraction, external UGTPHON, paired native/g2pk, morphology-consensus and morphology-adapter smoke workflows. The multi-engine benchmark remained in progress at the last check; see the master handoff and [PR #436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/436) for the exact status. Charsiu/ByT5 inference and official NIKL metadata-only inventory were skipped by workflow policy, not passed.

The 236 cohort remains reconstructed candidate membership, not proof of original selector membership. Independent token-level acoustic IPA, Ukrainian target review and item-level NIKL rights review remain blockers. The repository remains a research prototype, not a release-ready transcription authority.

## 2026-11-06 — no-audio engine-policy closure for the residual 40

The user's constraint is that no audio will be supplied. The 40 residual occurrences therefore received explicit engine-policy decisions without being falsely promoted to speaker-level IPA gold. See the [detailed adjudication](../docs/KOZAK-KIM-40-NO-AUDIO-ADJUDICATION-2026-11-06.md) and [40-row occurrence register](kozak-kim-40-no-audio-engine-policy-2026-11-06.csv).

- All 40 rows now carry `ENGINE_POLICY_RESOLVED_NO_AUDIO`; all 40 retain `UNRESOLVED_NO_AUDIO` for speaker-specific IPA gold.
- Three explicit, correctly spaced phrase pairs now have NIKL §29 [붙им 2] insertion support in both Python and browser runtimes: `홍콩 영화들`, `한국 여자로`, and `첫 연애`. Compact tokens are not split automatically.
- Other decisions preserve broad /s/, broad vowel hiatus, no unsupported /j/ insertion in `오조오억배` or `체험`, non-selective [ɛ]~[e] quality candidates, and raw `ㅠ` emoticons as non-speech.
- The historical 236 candidate dispositions remain 15 rule-confirmed, 181 profile-convention, 12 ABSTAIN, and 28 unadjudicated. The new engine-policy field is a separate axis, not a rewrite of the historical evidence status.
