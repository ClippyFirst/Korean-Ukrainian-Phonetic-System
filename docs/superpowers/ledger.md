# Superpowers execution ledger — latest continuation 2026-11-02

## Latest verified status — discrepancy-ledger audit and evidence-gated revalidation

- **Scope:** Kozak Kim only; original/vendor g2pK remains unchanged and comparison-only.
- **Base:** current `main` is `7bbbd7e7ce888a9c995bb70959e17858263c07a8`; verified PR #417 head is `fb5e1686bd86fd012d63cc92ad0261efe1a38113`, a descendant of main.
- **Current branch/PR:** `research/kozak-kim-abstention-audit-2026-11-02`, Draft PR #419 stacked on #417; documentation plus regression tests only, no production phonology rule changed.
- **PR stack:** #415 → #416 → #417 remains open/Draft. Exploratory PR #418 was closed unmerged because `중심닮음` was not present in the discrepancy ledger or the five-item native-abstention audit; its branch remains preserved for auditability. PRs #411/#414/#371 were inspected and left untouched as out of scope.
- **Exact-head verification on fb5:** system run 41420395798 PASS (Python/data, browser/build/generated pages, 1,374/1,374 browser tests); browser G2P 41420395791 PASS; extraction 41420395790 PASS; native pair 41420395800 PASS; pinned UGTPHON 41420395792 PASS; morphology consensus 41420395813 PASS; adapter smoke 41420395784 PASS; multi-engine 41420395805 PASS. NIKL metadata inventory, CharsiuG2P and ByT5 SKIPPED.
- **Browser pair:** run 41420395792 / artifact 13129915994; 2,699 shared; exact 53.4272% each; CER 8.0794% vs g2pK 8.2138%; delta −0.1344 pp, 95% sentence-cluster CI [−0.2246, −0.0531].
- **Native pair:** run 41420395800 / artifact 13130305158; 2,698 shared; Kozak exact 53.0393% / CER 9.0744%; g2pK on shared subset exact 53.1134% / CER 9.2304%; five native abstentions, zero engine errors. g2pK has a small exact point edge; Kozak has lower CER.
- **Multi-engine:** run 41420395805 / artifact 13129993707. UGTPHON: native 2,698 scored, exact 53.0393%, CER 9.0744%, PER 9.5378%; g2pK 2,703 scored, exact 53.0892%, CER 9.2285%, PER 9.6472%. SIGMORPHON: native 998 scored, exact 35.8717%, CER 14.6100%, PER 16.1721%; g2pK 999 scored, exact 35.3353%, CER 14.8222%, PER 16.3126%. Different denominators; no aggregate paired-delta claim. Both datasets remain diagnostic, not normative IPA gold; g2pK output uses the shared segment renderer.
- **Five real UGTPHON native abstentions:** `칡칡이` (R002 boundary unknown), `쫒아내면` (nonstandard spelling; do not normalize), `많앗구나유유유` (R003 ending boundary unknown), `삶의` (Hangul surface sourced but IPA unadjudicated), `무서웟어` (nonstandard spelling and R002 boundary unknown). No safe global or exact new rule is justified.
- **Abstention regression:** `test_actual_native_abstentions_remain_fail_closed_without_exact_morphology` covers the four morphophonological forms; the existing `삶의` test protects its two official Hangul variants and unresolved IPA gate. Push run 41425704134, PR run 41425711289 and extraction run 41425711296 all PASS on code/test head `4225cea7` (browser 1,374/1,374).
- **삶의 evidence:** NIKL MCFAQ 5716 gives `[살믜]` and permitted `[살메]`; current lexical row already preserves project-derived `sal.mi` and `sal.me` as provisional. NIKL supplies Hangul surface forms, not IPA. Existing test correctly keeps IPA diagnostic-only/unresolved and withholds Ukrainian output pending independent IPA review.
- **Rejected exploration:** `중심닮음` was not a project discrepancy or one of the five abstentions; PR #418 closed without merge. Do not count it as a product improvement.
- **Readiness:** research prototype; not research-certified/release-ready. Blockers: two independent C01–C07 submissions, C08 source extraction/prosody, C09 IPA quality/syllabification, C10 AP/IP contract, item-level NIKL rights, Ukrainian target review, and skipped optional source/neural jobs.
- **Local verification:** no local pytest/npm run; evidence is from GitHub Actions. Do not claim local test success. NIKL metadata inventory remains SKIPPED.

## Current next actions

1. Obtain two independent blind IPA submissions for C01–C07.
2. Recover the original C08 extraction table or preserve five mappings as inferred; obtain token-level IPA/prosody review; keep `유사성` unresolved.
3. Obtain independent IPA adjudication for `삶의` variants and the other source-backed lexical forms; do not treat NIKL Hangul readings as IPA.
4. Obtain source/context evidence for `칡칡이`, `쫒아내면`, `많앗구나유유유`, and `무서웟어`; preserve abstention until then.
5. Finish C09/C10, NIKL item-level rights, and Ukrainian target review; rerun exact-head CI and paired benchmarks after any future production change.

## Historical snapshots

## Kozak Kim continuation — 2026-11-01

- Reconcile main and PR #415/#416: DONE_VERIFIED (inspection); dedicated branch created from main and fast-forwarded to PR #416 descendant.
- C01–C07 blind packets: PARTIAL; seven separate pilot packet manifests created. Blocked for external scoring by missing utterance context and reviewer-sharing rights; no IPA predictions or references disclosed.
- C08 source triage: PARTIAL / EVIDENCE-LIMITED; Q&A 312649 confirms 의외성 only; §27 requires exact -(으)ㄹ morphology; no exact parse/source for 했을시 or 무고일수도있다는. No production changes.
- g2pK baseline: DONE_VERIFIED as scope check; original/vendor implementation untouched.
- CI evidence: PR #416 runs 41344976774, 41344981229, 41344981425, 41344981248, 41344981271, 41344981311, 41344981284, 41344981338 inspected; 41344981358 was still running. Current main run 41334227038 fails Python collection because benchmark helper is absent on main; see master handoff.

- C08 follow-up (2026-11-01): official NIKL Q&A 327466 supports the morphology of `일 수도`; NIKL 2021 guideline p.106 confirms dependent-noun `시` after `-을`. Both are rule-environment evidence, not direct lexical pronunciation records for the corpus strings. `유사성` remains unconfirmed; no `-성` generalization and no production patch. Added two source-register entries; item-level rights/context remain pending.

- C08 occurrence mapping gap: mass-cluster register claims 8 occurrences, but the 27-row paired occurrence ledger contains no C08 entries. Three source rows recovered from artifact 13097847614 (multilexnorm2026_1953, multilexnorm2026_1979, dc_inside_2024); five more remain unidentified. Corrected stale "remaining cases in paired ledger" text; acceptance requires recovery of all eight source-row IDs and contexts.


## Kozak Kim discrepancy review continuation — 2026-11-01

- Continuation branch: `research/kozak-kim-independent-ipa-packets-2026-11-01`; final branch head: `17647b219aa4310e37d77a8dd457c73c0871ace0`.
- Stacked Draft PR #417 targets the PR #416 branch, is mergeable, and contains only the incremental review-packet, evidence-register, test, and handoff changes. PR #416 and PR #415 remain open; neither was merged or modified.
- C01–C07: seven separate source-blind pilot JSON packets (six pilot forms each), separate reviewer instructions, and an internal-only cluster/provenance index. Browser regression test verifies no system/baseline names, candidate/reference IPA, or internal artifact identifiers leak into packet JSON. Packets remain PARTIAL/BLOCKED for scoring until exact source utterances and item-level reviewer-sharing rights are restored and verified.
- C08: NIKL Q&A 327466 supports the morphology of `일 수도`; NIKL 2021 guideline p.106 confirms dependent noun `시` after `-을`; Standard Pronunciation Rule §27 supplies conditional fortition. These are conditional morphology/rule-environment leads, not exact pronunciation attestations. No production phonology change; no generalized `-성` rule.
- C08 traceability correction: cluster summary reports eight cases, but the 27-row occurrence ledger contains no C08 entries. Three source-row IDs recovered (`multilexnorm2026_1953`, `multilexnorm2026_1979`, `dc_inside_2024`); five remain unidentified. Stale “remaining cases in paired ledger” wording was corrected.
- Exact-head GitHub Actions run `41346666445`: browser regression/build PASS; Python regression/data integrity PASS; 1,369 browser tests, 0 failures; NIKL metadata-only inventory SKIPPED. Extractor run `41346594433`: PASS. Multi-engine comparison run `41344981358` completed PASS; artifact `13099523369` inspected. ByT5 and Charsiu jobs were SKIPPED.
- Current main workflow `41334227038` has a Python collection failure because `scripts.benchmark_ugtphon_ko_surface` is absent from main; the inherited PR #416 branch contains it and passes Python regression/data integrity.
- No local shell/npm/pytest/build commands were executed; all test evidence is from GitHub Actions. No original g2pK implementation file was changed.

**Disposition:** research prototype. Independent linguistic adjudication, source context, item-level rights, five missing C08 occurrence IDs, and Ukrainian target review remain open. Not release-ready.


## Supplementary paired benchmark — SIGMORPHON 2021 Korean lexical test (run 41344981358)

The completed multi-engine diagnostic artifact `13099523369` was downloaded and inspected. It pins g2pK 0.9.4 and compares the native Kozak Kim path with the same 998 paired word-level inputs:

| Metric | Kozak Kim (clippyfirst_native) | Original g2pK 0.9.4 | Paired delta (g2pK − Kozak) |
|---|---:|---:|---:|
| Exact match | 358/998 = 35.8717% | 353/998 = 35.3707% | −0.5010 pp |
| CER | 14.6225% | 14.8106% | +0.1881 pp |

Paired row-cluster bootstrap (1,000 replicates): exact-match delta 95% interval `[-1.0020, -0.1002]` pp; CER delta interval `[+0.0250, +0.3859]` pp. Pairwise audit: 5 native-only exact cases, 0 g2pK-only exact cases, 353 both exact, 640 both non-exact, and 1 native abstention while g2pK returned a non-exact output. This is a **small diagnostic advantage**, not proof of universal superiority.

**Mandatory limitations:** SIGMORPHON is a lexical word-level set, not a sentence-context or normative NIKL set; IPA conventions differ from the reference; g2pK outputs pass through the project's shared segment renderer, which may bias comparison; the benchmark does not score Ukrainian output. The bootstrap intervals are diagnostic uncertainty intervals, not a substitute for independent gold adjudication or a preregistered statistical claim. ByT5 and CharsiuG2P inference jobs were SKIPPED. g2pK source/version remained unchanged.

- C01–C07 packet preparation: DONE_VERIFIED. 39/39 unique source-row IDs matched to official UGTPHON Korean test; every target token present; raw sentence context included, no canonical/IPA/system outputs. UGTPHON ko/LICENSE states Apache-2.0; attribution included. Packets READY_FOR_INDEPENDENT_REVIEW_PILOT; reviewer assignment/submissions remain TODO.


## Analyzer evidence and training-data gate

Kiwi/MeCab-Ko run 41353171166 is diagnostic only: partial boundary agreement for 무고일수도있다는; disagreement for 했을시 and 유사성. The training-readiness artifact 13101748305 records 644 unique lexical rows, no explicitly adjudicated IPA gold, 24 frozen holdout cases without IPA gold, and no overlap. Supervised IPA training remains blocked.


## C08 evidence follow-up — 2026-11-02

- Reconstructed the five previously missing C08 target/context rows from the pinned UGTPHON Korean test split: `해줄것` (`multilexnorm2026_1916`), `많을거같이` (`multilexnorm2026_2011`), `보일거라` (`dc_inside_2186`), `내릴수있는` (`dc_inside_2266`), and `안할듯` (`dc_inside_2557`). Together with the three earlier rows, all eight working contexts are now recorded.
- Three NIKL Q&A sources were added to SOURCE-REGISTER: 317798, 310899, 331601. Their claims are deliberately scoped to rule environment/morphology, not exact UGC IPA.
- The five memberships are inferred from exact token/context matches and the fortis mismatch signature because the original C08 extraction table was not preserved. Keep this traceability caveat explicit.
- Pre/post artifact comparison of 13097847614 and 13102456604 confirms only two Kozak Kim outputs changed: `무고일수도있다는` and `했을시`; all g2pK outputs are unchanged.
- No new production phonology rules were added. Independent IPA/prosody review, `유사성` lexical evidence, item-level NIKL rights, C09/C10 and Ukrainian target review remain open.


**Evidence-source correction (2026-11-02):** the earlier provisional references to NIKL Q&A 335204 and 336313 were removed from the active source register because their direct pages could not be independently retrieved in this verification pass. The current active basis is NIKL Q&A 317798 (Rule §27 examples and pause caveat), 310899 (colloquial dependent noun 거), 331601 (알 수 없는[알쑤엄는]), plus the already registered 307960/327466/313481/333044 and the official Rule §27 page. Older historical mentions of 335204/336313 are superseded and are not current evidence claims.

- Native diagnostic [run 41358508325](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41358508325), artifact `13104257589`: 2,698 paired; native CER 9.1047% vs g2pK 9.2304%; exact match 53.0393% vs 53.1134%; five native abstentions and zero engine errors. Separate profile from browser.

## Final continuation record — 2026-11-02

- Engine/data/test head: `d5008af0901628c36b43d627ea52c52a22c265c0`; this ledger refresh is documentation-only.
- Source register 165 rows: 155 REVIEW_REQUIRED, 7 MANUAL_CLASSIFICATION_REQUIRED, 2 item-level licenses recorded, 1 not applicable. The unverified Q&A locator 302689 was removed; the official §14 source is used for 없어[업ː써].
- Production source-code head unchanged: `bc7b1474eecfe8df8006572abf0f07957f829647`; production lexical data now adds source-backed C09 long-vowel entries for 사람, 모르다 and 괴성 (with variants), all with provisional Ukrainian targets. No general phonology rule changed. Original g2pK untouched.
- Exact-head system verification run `41414231979` on `d5008af0901628c36b43d627ea52c52a22c265c0` was QUEUED when recorded; Python/data and browser/build outcomes are not yet verified. NIKL metadata-only inventory skipped. Local tests not run due clone DNS failure.
- Stop status: research prototype; all new source claims are scope-limited and tests added, but no release certification.


## Follow-up — 2026-11-02

- C09 now explicitly separates official dictionary vowel-length notation from contemporary Seoul/Gyeonggi surface realization. Added the abstract-reviewed Kim & Park (2019) source record; no word-specific short variants are inferred.
- Corrected stale test expectations for quoted CSV source rows, the 괴성 dictionary result locator, C06 source citation, and source-register count. Exact-head system CI run `41418730591` passed Python/data integrity and browser regression/build; NIKL metadata inventory skipped.
- Source register: 166 rows; 156 REVIEW_REQUIRED, 7 MANUAL_CLASSIFICATION_REQUIRED, 2 item-level licenses, 1 not applicable. Engine remains a research prototype; no production phonology rule or g2pK source changed.


## Follow-up — 2026-11-02 (C05)

- Added Lee (2017) as independent contextual evidence for /y, ø/ diphthongization. C05 remains partial; no global /y/→[ɥi] rule or token IPA was inferred.
- Source register: 167 rows; 157 REVIEW_REQUIRED, 7 MANUAL_CLASSIFICATION_REQUIRED, 2 item-level licenses, 1 not applicable. No production phonology rule changed and g2pK remains untouched.


## Final continuation record — 2026-11-02 (head 84e4200)

- Exact-head push/PR system verification passed Python/data integrity and browser/build; browser 1,374/1,374, zero failures/skips; production build and generated pages passed. NIKL metadata-only inventory skipped.
- Latest browser pair: run 41419733723, artifact 13129795347; exact tied 53.4272%, CER 8.0794% vs g2pK 8.2138%, paired CER CI [−0.2246, −0.0531] pp. Latest native pair: artifact 13129641115; Kozak exact 53.0393%, CER 9.0744%; g2pK exact 53.0892%, CER 9.2285%. Kozak has lower CER; g2pK a small exact point edge. Shared IPA renderer caveat remains.
- Morphology, browser, extraction and paired diagnostics passed. Optional neural inference skipped. Source register 167 rows; 157 REVIEW_REQUIRED, 7 MANUAL_CLASSIFICATION_REQUIRED, 2 item-level licenses, 1 not applicable.
- No production phonology rule changed in this follow-up; original g2pK remains untouched. Research prototype, not release-ready.
