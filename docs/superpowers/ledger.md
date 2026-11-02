# Superpowers execution ledger — latest continuation 2026-11-02

## Latest verified status — Kozak Kim / C01–C08 and multi-engine revalidation

- **Scope:** only Kozak Kim; original g2pK remains unchanged and comparison-only.
- **Branch/PR:** `research/kozak-kim-independent-ipa-packets-2026-11-01`; C09 evidence/test continuation in progress; draft PR #417 stacked on PR #416. PRs #415/#416 remain open. No production phonology rule changed in this continuation.
- **C01–C07:** seven system-blind, reference-withheld packets, 42 entries, 39 unique source rows, full source contexts, no engine/baseline/IPA leakage; source identities remain inferable and reviewer instructions prohibit corpus-gold lookup. Packet preparation DONE_VERIFIED; two independent reviewer submissions BLOCKED.
- **C08:** all eight contexts are in the pinned fixture; three IDs were independently recovered and five reconstructed from the fortis-mismatch signature because the original extraction table is missing. Seven have conditional morphology/rule-environment leads. Active NIKL Q&A sources are 317798, 310899 and 331601; provisional 335204/336313 are removed. `유사성` remains unresolved. No suffix-wide `-성` rule.
- **R013:** two exact same-eojeol C08 licenses are covered inside full sentences in Python and browser. This is bounded rule behavior, not independent IPA adjudication; the pause/prosody uncertainty remains.
- **Browser pair:** run 41409348959 / artifact 13124269774; 2,699 shared; exact 53.4272% each; CER 8.1097% vs g2pK 8.2138%; delta −0.1040 pp, 95% sentence-cluster CI [−0.1951, −0.0261].
- **Native pair:** run 41409348973 / artifact 13124712631; 2,698 shared; exact 53.0393% vs 53.1134%; CER 9.1047% vs 9.2304%; five native abstentions, zero engine errors.
- **Multi-engine:** run 41358812573 / artifact 13105045922 completed successfully. UGTPHON (2,698 shared): exact 53.0393% vs 53.1134%; CER 9.1047% vs 9.2304%; paired bootstrap CER interval for g2pK-minus-Kozak [+0.0428,+0.2194] pp. SIGMORPHON (998 shared): exact 35.8717% vs 35.3707%; CER 14.6225% vs 14.8106%; paired bootstrap intervals favor Kozak Kim on both metrics. Both datasets remain diagnostic, not normative IPA gold.
- **g2pK integrity:** no original/vendor g2pK source file changed; shared segment-to-IPA renderer remains an evaluation caveat, not a g2pK code modification.
- **C09:** official NIKL dictionary/Q&A evidence now directly confirms length in 사람[사ː람], 모르다[모ː르다], 알다[알ː다], 없는[엄ː는], 없어[업ː써], 이중성[이ː중썽]; official dictionary result listing gives 괴성[괴ː성/궤ː성]. C09 lexical length evidence is PARTIAL / SOURCE-LENGTH-CONFIRMED; the IPA mapping, exact sense matching, vowel-quality variants, syllable boundaries and stress are not independently adjudicated. Keep length; do not optimize to corpus omission. C10 stress remains BLOCKED pending a declared prosody convention and specialist review.\n- **Rights:** source register 160 rows: 151 REVIEW_REQUIRED, 7 MANUAL_CLASSIFICATION_REQUIRED, 1 item-level license recorded, 1 not applicable. NIKL item-level reuse review remains open.
- **Exact-head CI:** push system/Python/data run 41409343802 PASS; PR system/Python/data + browser regression/build 41409713381 PASS; browser suite 1,373/1,373; extraction 41409349029 PASS; browser pair 41409348959 PASS; native pair 41409348973 PASS; morphology consensus 41409348958 PASS; morphology adapter 41409348957 PASS. Multi-engine job 41409349048 was re-run but had not completed its comparison/report step at handoff; latest completed portfolio remains 41358812573. Optional Charsiu/ByT5 and NIKL metadata-only inventory SKIPPED.
- **Training readiness:** NOT READY: 644 unique lexical rows, zero additions explicitly marked independently adjudicated IPA gold, 24 frozen holdout cases without IPA gold; no overlap found.
- **Readiness:** research prototype, review-packet-ready but not research-certified or release-ready. Blockers: independent C01–C07 review, C08 source-extraction traceability/prosody/lexical review, C09/C10 adjudication, item-level rights, and Ukrainian target review.
- **TDD red/green:** first C08 source-reference guard run 41407653541 failed because its regex was over-escaped; it was corrected and Python regression passed. First C01–C07 packet run 41409223158 failed because the packet JSON leaked the forbidden identity term `engine`; packet instructions were corrected to say `software outputs`, and the final browser suite passed 1,373/1,373.
- **Local tests:** no local pytest/npm run; local clone attempt failed because github.com DNS was unavailable. Do not claim local test success.

## Current next actions

1. Obtain two independent blind IPA submissions for C01–C07.
2. Seek the original C08 extraction table; keep five mappings explicitly inferred if unavailable; obtain token-level IPA/prosody review; do not license `유사성`.
3. Keep source-backed C09 length; finish independent IPA vowel-quality/syllable-boundary adjudication; define and review C10 stress conventions.
4. Resolve NIKL item-level reuse rights and Ukrainian target review.
5. Re-run exact-head CI and paired benchmarks after any future production change.

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
