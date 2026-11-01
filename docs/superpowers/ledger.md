# Superpowers execution ledger — latest continuation 2026-11-02

## Latest verified status — C01–C07 / C08 continuation

- **Scope:** only Kozak Kim; original g2pK stays untouched.
- **Branch/PR:** `research/kozak-kim-independent-ipa-packets-2026-11-01`, draft PR #417 stacked on PR #416; last verified code/test head `8b22f778112442024f876061bd0e576af762e761`.
- **C01–C07:** seven neutral blind packets, 42 entries, 39 unique source rows, full source contexts, no engine/baseline/IPA leakage. Packet preparation is DONE_VERIFIED; independent reviewer submissions remain BLOCKED.
- **C08:** all eight source contexts are now mapped in the pinned fixture. Three were independently recovered earlier; five were reconstructed from the fortis-mismatch signature because the original extraction table is missing. Seven have conditional -(으)ㄹ + dependent-noun evidence: Q&A 317798 (것), 310899 (거), 331601/307960 (수), 336313 (듯), 327466 (일 수도), and 313481/333044 (시). `유사성` remains unresolved. No new production rule or generalized -성 rule was added.
- **Runtime:** Python exact R013 same-eojeol licensing now works for a licensed word inside a full sentence. Full-context positive and negative tests pass in Python and browser.
- **Benchmark:** browser paired run 41357680349/artifact 13104120884: 2,699 shared; CER 8.1097% vs g2pK 8.2138% (−0.1040 pp; 95% cluster CI −0.1951 to −0.0261 pp); exact match 53.4272% each. Native pair run 41358508325/artifact 13104257589: 2,698 shared; CER 9.1047% vs 9.2304%, exact match 53.0393% vs 53.1134% (g2pK slightly higher); five native abstentions, zero engine errors. Only the two C08 target outputs changed relative to the prior PR #416 browser artifact; g2pK outputs are unchanged.
- **Rights:** source register 155 rows; 146 review required and 7 manual classifications remain (plus one item-level license recorded and one not applicable). NIKL item-level rights review is open.
- **CI:** Exact-head push run `41358386793` and exact-head PR run `41358392166` both PASS on documentation head `94a2a2e` (code/test head `8b22f778`); Python regression/data integrity and browser regression/build included. Current branch also passed packet extraction `41358508478`, browser pair `41358508374`, native pair `41358508325`, morphology consensus `41358508508` and morphology adapter `41358508288`. Multi-engine run `41358068874` was cancelled by the subsequent branch update; latest run `41358508284` was still in progress at handoff; Charsiu/ByT5 jobs were skipped. No multi-engine score is claimed. Optional Charsiu/ByT5 and NIKL metadata-only inventory were skipped; multi-engine comparison runs were cancelled before a complete score report was produced, including latest run `41354753780`; no multi-engine score is claimed.
- **Training readiness:** supervised IPA training is NOT READY: the partial audit found 644 unique lexical rows but zero explicitly independently adjudicated IPA rows and 24 frozen holdout cases without IPA gold; no holdout overlap was found.
- **Readiness:** research prototype, not research-certified or release-ready. Next blockers are two independent IPA reviews, C08 source-extraction provenance and prosodic adjudication, C09/C10 adjudication, item-level rights and Ukrainian target review.

## Revalidation note — 2026-11-02

- The latest completed paired browser run is `41357680349` (artifact `13104120884`): 2,699 shared scored occurrences; exact match 53.4272% for both systems; Kozak Kim CER 8.1097%, original g2pK CER 8.2138%, paired delta −0.1040 pp (95% sentence-cluster CI −0.1951 to −0.0261 pp). This is a diagnostic on noisy UGTPHON annotations, not normative IPA adjudication.
- The latest source register is 155 rows (146 review-required, 7 manual-classification-required, 1 item-level license recorded, 1 not applicable). Item-level NIKL rights remain open.
- C01–C07 packet preparation is complete, but no independent reviewer annotations have been received. C08 remains PARTIAL / EVIDENCE-LIMITED: all eight contexts are in the working fixture; five memberships are reconstructed because the original extraction table is missing; `유사성` remains unresolved and no suffix-wide or generic fortition rule was added.
- The full-sentence Python negative control is strengthened to exercise the recovered `유사성` source sentence, not only the isolated token. This is test coverage only; it does not change production phonology.
- Latest multi-engine workflow `41354753780` was cancelled; neural inference was skipped. No multi-engine result is claimed.

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
