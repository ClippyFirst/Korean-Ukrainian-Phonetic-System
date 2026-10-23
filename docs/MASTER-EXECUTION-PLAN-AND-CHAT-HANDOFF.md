## NIKL multi-page evidence import continuation — 2026-10-22

- Starting default-branch commit: `916b2b5b3e9c5a472f729b6de79bcbb6c777b6dc`.
- Working branch: `research/nikl-evidence-import-batch-2026-10-22`; PR #216.
- Added `scripts/nikl-evidence-import.mjs` and `npm run import:nikl-evidence` to inventory multiple official Q&A/curated FAQ/rules/reuse-policy pages saved through ordinary browser access. It enforces HTTPS official-host and path allowlists, exact page identifiers, allowed query parameters, canonical URL uniqueness, unique source IDs, file-size/UTF-8/content checks, and output/source collision protection.
- Output is metadata-and-hashes only: title/headings, import timestamp, basename/byte count, SHA-256, and normalized visible-text length. It explicitly records local-import mode, null HTTP fetch/status, robots not checked, reuse terms unassessed, content not retained, and claim support not established. It does not promote source-register rows to reviewed status.
- Added `schemas/nikl-evidence-import-manifest.schema.json`, Node and Python regression tests, a usage guide, and a README entry. Existing 30-article rules collector remains separate and unchanged.
- Final implementation/test head before this handoff correction: `a7f7339a12c88b0d6a6485fb131ee6bafba9faed`. CI run [39778627927](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39778627927) passed **1,108/1,108 Node tests**, Vite build, Python regression/data-integrity, and source inventory checks; [matrix tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39778627947) passed Python 3.11/3.12/3.13 and browser tests; [browser G2P integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39778627923) and [master-table/corpus checks](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39778627848) also passed. The source crawl correctly logged HTTP 403 as `BLOCKED`; it did not emit a live manifest. An intermediate test run failed because a duplicate-URL fixture used a source ID that contradicted the newly enforced URL-ID match; the fixture was corrected, and all final-head checks passed.
- Retrieval constraints were rechecked: the direct official pages for three remaining cited Q&A URLs returned public-cache misses in the available web view, and the connected Firecrawl account reports `remainingCredits=-1000`; no source claims were promoted on that basis.
- Task ledger: `DONE_VERIFIED` — safe batch importer, URL/query allowlisting, source-ID/URL consistency, duplicate and collision checks, error-page rejection, metadata-only output contract, schema and tests at the implementation/test head above. The current commit adds only this handoff/audit checkpoint; its own CI is the final merge gate. `BLOCKED` — live direct source access HTTP 403; no authorized saved HTML batch was available in this run. `BLOCKED / rights` — item-level KOGL marks remain unverified. `TODO` — obtain the 44 remaining citation pages through ordinary authorized access and manually adjudicate each claim. `BLOCKED_SPECIALIST_ADJUDICATION` — broad IPA gold remains 0/20 and independent Ukrainian-target review remains outstanding.
- Evidence inventory is unchanged: 16/60 newly inventoried citation pages content-checked (9 direct for target forms, 2 partial, 5 contextual-only); 44 remain citation-only/unreviewed. Importing a file will not change these counts until a human inspects and records claim-level evidence.
- Release disposition remains a deployed research preview / partial prototype, not a scientifically validated release. No production transcription engine or public UI behavior changed.


## NIKL citation-template continuation — 2026-10-22

- Starting main commit: `4d843832272df56e76ff296f638eabd0438c45e0`.
- Working branch / PR: `fix/nikl-evidence-import-source-url-compat-2026-10-22` / [PR #217](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/217).
- The existing citation inventory contains 44 unreviewed rows: 34 Q&A, 4 FAQ, 3 Korean Basic Dictionary, and 3 NIKL-hosted PDF/document URLs. The original importer rejected some otherwise valid official URLs and MCFAQ IDs. This was corrected without relaxing HTTPS, host/path/query allowlists, or the no-network contract.
- Added `npm run template:nikl-evidence` to generate a deterministic local-import manifest template from the source register. It selects the 38 official Q&A/FAQ rows, records stable IDs and expected saved-page filenames, and does not fetch pages or change review statuses. The three dictionary records and three PDFs are deliberately excluded for separate handling.
- Exact implementation/test head `8bad819d4294af56feda6249be2f992e7854dbef`: [Node tests + Vite build](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39784141517) passed **1,112/1,112**; Python 3.11/3.12/3.13, [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39784141636), [browser G2P](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39784141594), and [corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39784141499) passed.
- Task ledger: `DONE_VERIFIED` — URL compatibility, template generator, CSV/path safeguards, 38-row inventory regression, CI. `BLOCKED` — no saved official HTML batch; live fetch remains HTTP 403. `BLOCKED / rights` — item-level reuse marks. `TODO` — obtain and inspect 38 Q&A/FAQ pages, then separately intake 3 dictionary pages and 3 PDFs. `BLOCKED_SPECIALIST_ADJUDICATION` — broad IPA and Ukrainian-target independent reviews.
- Source evidence remains **16/60 checked, 44 unreviewed**. No linguistic source claim was promoted. The system remains a deployed research preview / partial prototype, not a validated release.


## Korean Basic Dictionary intake continuation — 2026-10-22

- Starting main commit: `9abf3ddf2e5468c309025ce2cbe4fcee9b3a6e78`.
- Working branch / PR: `research/krdict-evidence-import-2026-10-22` / [PR #218](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/218).
- The safe local evidence importer now supports the official Korean Basic Dictionary English/Korean HTML entry paths with strict `ParaWordNo`, source-ID, language, and `nation=eng` validation. The source-register-driven template covers 41 of 44 outstanding citations: 38 Q&A/FAQ + 3 dictionary pages.
- Exact implementation/test head `db782975aead7422163fd2f499859e0eae295576`: [Node + Vite build](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39784994528) passed **1,114/1,114**; Python 3.11/3.12/3.13, [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39784986483), and [corpus artifact checks](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39784995035) passed.
- `DONE_VERIFIED`: dictionary URL/ID guard, schema, tests, 41-row template generation. `BLOCKED`: no human-saved HTML batch and live direct source access remains HTTP 403. `BLOCKED / rights`: item-level reuse terms. `TODO`: inspect the 41 HTML pages and design separate PDF intake for 3 documents. `BLOCKED_SPECIALIST_ADJUDICATION`: broad IPA and Ukrainian-target review.
- Evidence counts remain **16/60 checked, 44 unreviewed**. No linguistic claim was promoted; the system remains a research preview / partial prototype.


## NIKL PDF evidence intake continuation — 2026-10-22

- Starting main commit: `32aaf7fcf9fd15e071a0a67d53686cc87f3d627d`.
- Working branch: `research/nikl-pdf-intake-2026-10-22`.
- Added a dedicated PDF template and binary-metadata importer for the three existing NIKL download citations. It validates official HTTPS host/path, query parameters, UUID stored filename/source-ID equality, safe local paths and symlink containment, PDF signature/version, EOF marker, and a 100 MiB size limit. It records SHA-256 and explicit null/not-assessed/unreviewed states; it does not extract or retain document text.
- Added schema, Node/Python tests, package commands, README link, and [PDF intake guide](NIKL-PDF-IMPORT.md).
- Exact code/test head `6ea955108d84981247696b2f9a0c7aae095a931e`: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39785721762) passed **1,120/1,120 Node tests**, Vite build, and Python regression/data-integrity. The live source check returned HTTP 403 and remained explicitly `BLOCKED`.
- `DONE_VERIFIED`: PDF intake toolchain and validation gates. `BLOCKED`: no saved PDF batch and live access denied. `BLOCKED / rights`: document-specific reuse terms. `TODO`: save, inspect, and claim-adjudicate the three PDFs. `BLOCKED_SPECIALIST_ADJUDICATION`: independent IPA and Ukrainian target review.
- Collection tooling now covers the 41 eligible HTML records plus three PDF records, but evidence inventory remains **16/60 checked and 44 unreviewed**. No linguistic claim was promoted; release status remains research preview / partial prototype.


## Partial dictionary evidence review — batch 17 — 2026-10-22

- Working branch: `research/krdict-partial-evidence-review-2026-10-22`.
- Reviewed official Korean Basic Dictionary entry 79033: 좋다[조ː타] and 좋아[조ː아] are listed; 좋아도 is not a direct dictionary pronunciation. Reviewed entry 57199: 발음[바름] is listed; 발음과 is not a separate dictionary attestation. Both are recorded as partial lemma/application support, while the existing lexical targets remain rule-derived.
- Entry 89917 for 없다/없었다 could not be fetched through the available public page view and remains unreviewed. No evidence was inferred from its URL or citation note.
- Source inventory updated from 16/60 checked and 44 unreviewed to **18/60 checked and 42 unreviewed** (9 direct, 4 partial, 5 contextual-example-only). Item-level KOGL rights and independent IPA/Ukrainian-target review remain open.
- Code/test head `7973f9ea230c2a261f2a0b11fe2fd4a979eea906`: [CI](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39787113641) passed **1,123/1,123 Node tests**, Vite build, and Python regression/data-integrity. No production transcription code or lexical outputs changed.


## NIKL Q&A claim-scope review — batch 18 — 2026-10-22

- Starting main commit: `b20c3ebc3e3f5dafbdafd100e3f89efa2cf969a6`.
- Working branch / PR: `research/nikl-qna-claim-scope-review-2026-10-22` / [PR #221](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/221).
- Reviewed substantive content exposed in official NIKL search-index results. qna_seq=330743 directly attests 밝게[발께] and 굵은[굴근]; lexical source URLs now match the reviewed source-register locator. qna_seq=334294 discusses 맑게[말께], 묽고[물꼬], 밝기[발끼] and the ㄺ-before-ㄱ exception, but the available answer text does not directly attest 읽고[일꼬] or 밝는[방는]. qna_seq=317229 directly attests 외곬에[외골쎄]. qna_seq=307508 supports the lexical ㄼ exception but its indexed spelling 넓둥굴다 differs from the corpus input 넓둥글다, so exact orthographic attestation remains unresolved. qna_seq=328719 directly attests 없이[업씨] and corrects the corpus rule attribution to §10 simplification → §13 liaison → §23 fortition (not §14); qna_seq=330620 directly attests 값없다[가법따] and clarifies §15 applies before substantive 없-; qna_seq=330938 directly attests 꽃잎[꼰닙] but does not prescribe a unique intermediate ordering; qna_seq=335263 directly attests 실없다[시럽따] and corrects the question's mistaken [시럼따] premise. qna_seq=305480 directly attests 읽다[익따] and contrasts 읽어[일거]; qna_seq=335881 directly attests 밭이랑[반니랑] and 집안일[지반닐] while distinguishing ㄴ-insertion from 사이시옷. The latter does not establish a unique intermediate order; corpus derivation notes now state that limitation. qna_seq=325287 directly attests 짧다[짤따] and 삶다[삼ː따], with source length notation kept distinct from IPA. Curated FAQ 6674 directly attests 밭일[반닐] but not attached forms 밭일과/밭일을; FAQ 6718 directly attests 많이[마ː니] and identifies §12 ㅎ-deletion. FAQ 8420 directly attests 않았다[아낟따]. The previous MCFAQ 8505 locator for 의견란 was not independently reviewed; it is retained as a superseded historical locator with no claim about its page content. The lexical row now cites Q&A 313452 for 의견란[의ː견난]; that answer explicitly marks vowel length, though Ukrainian adaptation remains provisional.
- Corrected the source register to distinguish direct attestation from partial rule-context support. Removed the unsupported claim that Q&A 334294 directly confirms 읽고 and 밝는; their Korean targets remain rule-derived under §§11/18/23. No target, IPA, or Ukrainian output values changed.
- Added batch-18 evidence review and regression tests. The source-register count for `unverified_lexical_citation_inventory_2026-10-22` falls from 42 to 27. The batch-17 test now checks its historical report rather than freezing a live count that later batches must update.
- Evidence boundary: direct HTML retrieval remained unavailable; the review is bounded to substantive content visible in the official indexed results and does not claim complete HTTP retrieval. Item-level KOGL rights remain unverified. No broad-IPA gold or Ukrainian-target validation was added.
- Task ledger: `DONE_VERIFIED` — claim-scope correction, source URL normalization, historical-count regression repair, batch report and tests (pending exact-head CI at time of this checkpoint). `BLOCKED / rights` — item-level reuse markings. `TODO` — inspect remaining citation-only pages through authorized access and adjudicate claim-by-claim. `BLOCKED_SPECIALIST_ADJUDICATION` — independent broad IPA and Ukrainian-target review.
- Release disposition remains deployed research preview / partial prototype; no production transcription logic changed.


## Current continuation checkpoint — 2026-10-22, after batch 18

- Current main starting point for this checkpoint: `353a5075ece1d70b188d20dc9d59f43005b3767b`.
- Batch 18 PR #221 was merged as `353a5075ece1d70b188d20dc9d59f43005b3767b`.
- Exact tested source branch head before squash merge: `913716d7e4f23ab54a5b6651f963f2fe9449cf7f`; CI [39823330236](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39823330236) passed **1,136/1,136 Node tests**, Vite build, Python regression/data-integrity, and the source-inventory diagnostic. The source-inventory diagnostic correctly reported direct NIKL HTTP 403 as `BLOCKED`; no live manifest was claimed.
- Evidence inventory at this checkpoint: **33/60** citations content-checked (21 direct target-form attestations, 7 partial, 5 contextual-example-only); **27 citation-only/unreviewed** remain. The 27 are one Korean Basic Dictionary citation (없었다), three NIKL-hosted PDFs, and 23 NIKL Q&A/FAQ citations. This count refers to claim-level content review, not to the 30 normative articles in the separate standard-rule coverage matrix.
- Batch 18 corrected overclaimed direct-attestation wording and source-instrument attribution, normalized reviewed URLs, and corrected the skills catalog's stale inventory/test count. No Korean output, IPA target, Ukrainian target, or production transcription code changed.
- Task ledger: `DONE_VERIFIED` — batch-18 claim-scope corrections, tests, skills-catalog alignment, and exact-head CI. `BLOCKED` — live NIKL crawler receives HTTP 403; no current live manifest. `BLOCKED / access` — remaining 27 cited source pages/documents have not been saved through ordinary browser access in this environment; their content must not be inferred from URL/title alone. `BLOCKED / rights` — item-level KOGL/reuse marking is not independently verified. `TODO` — obtain authorized human-saved copies for the 23 Q&A/FAQ pages, one dictionary entry, and three PDFs; run the existing HTML/PDF importers; manually verify exact source passages and classify each claim. Acceptance: each imported source has matching registered identity and a stable locator, the target form is explicitly present for direct-attestation status, and all metadata/schema/source-register tests pass. `BLOCKED_SPECIALIST_ADJUDICATION` — independent broad-IPA gold and Ukrainian-target review remain absent.
- Release disposition remains **deployed research preview / partial prototype**, not a scientifically validated release. The browser and Python CI suites passing do not establish independent IPA correctness or target-language validity.

## Continuation checkpoint — Python IPA-first boundary and mapping gate (2026-10-22)

- Starting main before this batch: dc7a658a492fb07a94a4db4cbd030af5c3b8913b.
- PR #224 (Enforce IPA-first target rendering in Python pipeline) was merged as `aa2e9d17efc4c45686166d2a6950d2d8f309f457`; its handoff/audit close-out PR #225 was merged as `1e40e0271c706311d21af144e003b5742d0e5ab7`.
- Call-graph inspection found a real Python-only architectural bypass: transliterate_korean() called the IPA → UPI adapter but then overwrote its Ukrainian result with a Hangul-keyed lexical CSV target. This bypass is removed. Lexical Ukrainian values are returned only as audit/reference fields.
- Additional review found that the adapter ranks unmapped inventory candidates by feature distance. The selector now requires both an explicit mapping ID and a nonempty Ukrainian grapheme; if no licensed candidate exists, it fails closed to unresolved output. This prevents feature similarity alone from masquerading as a supported correspondence.
- Tests cover lexical-reference non-override, correct unresolved behavior when UPI is unavailable, mapped-candidate selection over an unmapped nearest candidate, and no selection when every candidate is unmapped. Coverage matrix and IPA-first audit are updated in the same change.
- Final exact-head CI passed at `e5cc237075ce82b3d7e473a2de3dc352a186caef`: 1,136/1,136 Node tests, Vite build, Python regression/data-integrity on Python 3.11/3.12/3.13, optional g2pK integration on Python 3.11/3.12, and master-table/corpus artifact checks. Runs: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39825037772), [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39825037696), [g2pK integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39825037730), and [corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39825037717). The subsequent squash merge is `aa2e9d17efc4c45686166d2a6950d2d8f309f457`. Post-merge GitHub Pages validation, browser tests/build, and Python 3.11/3.12/3.13 checks passed; the final Pages deploy job was still queued at this checkpoint.
- Task ledger: DONE_VERIFIED after final exact-head CI — remove lexical target override and require explicit mapped/renderable candidate; BLOCKED_SPECIALIST_ADJUDICATION — independent broad-IPA gold and Ukrainian-target review remain missing. BLOCKED / optional dependency is not a defect when UPI is absent: output must be explicitly unresolved rather than fabricated.
- Release disposition remains deployed research preview / partial prototype, not release-ready.


## Post-merge public Pages verification — 2026-10-22

- Current main at this checkpoint: `1e40e0271c706311d21af144e003b5742d0e5ab7`; no open PRs were found.
- Post-merge system verification [run 39825627278](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39825627278) passed. The main tests workflow [39825627362](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39825627362) passed; the corpus/master-table artifact workflow [39825627233](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39825627233) passed.
- GitHub Pages deployment and live smoke workflow [39825627246](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39825627246) passed, including deploy, HTTP smoke checks for `index.html`, `system.html`, and a JS asset, plus the Playwright live practical-mode adversarial passage.
- Live browser smoke result: **1,443 Korean input characters**, **2,782 Ukrainian output characters**, **3,731 IPA characters**; status `g2pK JS · Контекстну вимову застосовано`. This verifies the deployed browser path ran end-to-end for the fixture. It is not a human adjudication of every output, independent IPA gold, or proof of complete normative coverage.
- The public browser uses the JavaScript G2P practical path; the Python native IPA-first correction is a separate research/API path. The live browser result therefore validates deployment and practical-mode availability, not the Python native target inventory.
- Remaining blockers after batch 19: live NIKL fetch HTTP 403; 26 cited source items awaiting content review; item-level reuse rights unverified; independent broad-IPA gold and Ukrainian-target adjudication absent. Status remains deployed research preview / partial prototype.


## Continuation checkpoint — NIKL Q&A 279931 claim-scope review, batch 19 (2026-10-22)

- Starting main for this batch: cc571079458d15124c8b52c7704ef8b830984874 (post-merge public Pages smoke and IPA-first checkpoint were already recorded).
- Reviewed official NIKL Q&A [qna_seq=279931](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=279931), titled “'ㄴ' 첨가” (question 2023-09-11; answer 2023-09-13).
- The question presents 음용[으묭] as the reading being asked about; the answer says §29 ㄴ-insertion is not obligatory in every similar environment but does not repeat [으묭] as a standalone answer example. Classified as partial rule-context / negative-control support, not direct attestation.
- Changed evidence wording/status only. Korean surface Hangul, project IPA, and Ukrainian target fields are unchanged. The Korean bracket notation is not IPA.
- Inventory: 34/60 citations content-checked (21 direct, 8 partial, 5 contextual-example-only); 26 citation-only/unreviewed remain: 22 Q&A/FAQ pages, one Korean Basic Dictionary entry, and three PDFs. The HTML import queue contains 23 eligible pages.
- CI on the implementation/test head passed: 1,139/1,139 Node tests, Vite build, Python regression/data-integrity, and source-register checks. The live NIKL fetch returned HTTP 403 and was explicitly classified BLOCKED; no live manifest was produced and no access-control bypass was attempted.
- Task ledger: DONE_VERIFIED — source claim narrowed, source register updated, batch report and regression test added, queue counts reconciled. BLOCKED / rights — item-level KOGL marking remains unverified. TODO — continue claim-by-claim review of the remaining 26 citations. BLOCKED_SPECIALIST_ADJUDICATION — independent broad-IPA gold and Ukrainian-target review remain absent.
- Release status remains deployed research preview / partial prototype, not a scientifically validated release.


## Continuation checkpoint — NIKL Q&A 317202 claim-scope review, batch 20 (2026-10-22)

- Starting main: 3f125e09533019098f6eaafec86fa274a9630a18, which already contains batch 19 (Q&A 279931). This branch ports only the new batch-20 evidence review and its count/test reconciliation on top of that current mainline.
- Official indexed NIKL Q&A [qna_seq=317202](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317202), title “홑이불”, question 2025-06-28 and answer 2025-06-30, directly gives 홑이불[혼니불] and describes ㄴ-insertion and nasal assimilation.
- The corpus input is 홑이불을, not the lemma 홑이불. The exact inflected form is absent from the answer, so evidence is partial lemma/application support. The lexical note now states that liaison of final ㄹ before particle 을 follows §13 and does not infer a unique intermediate ordering. Korean surface, project IPA, and Ukrainian target values remain unchanged.
- Task ledger: DONE_VERIFIED after exact-head CI — source title/date and answer scope reviewed from official indexed content; source register and lexical evidence note narrowed; batch-20 report and regression tests added; current HTML intake queue and counts reconciled. PARTIAL — lemma pronunciation directly attested, full inflected input rule-derived. BLOCKED / rights — item-level KOGL mark not verified. TODO — review remaining 25 citations claim-by-claim. BLOCKED_SPECIALIST_ADJUDICATION — independent broad-IPA gold and Ukrainian-target review remain outstanding.
- Inventory after this batch: **35/60** citations content-checked (21 direct target-form attestations, 9 partial, 5 contextual-example-only); **25 citation-only/unreviewed** (21 Q&A/FAQ pages, one Korean Basic Dictionary entry, three PDFs). The HTML import template now contains 22 eligible pages (21 Q&A/FAQ + one dictionary entry).
- Direct NIKL fetch remains HTTP 403; no live manifest is claimed and no bypass is attempted. The saved-page import path remains the compliant alternative. Item-level reuse rights remain unverified.
- Release status remains deployed research preview / partial prototype, not a scientifically validated release.


## Batch-20 merge verification and batch-21 continuation — 2026-10-22

- Batch 20 is merged on main as `9e6fa37768021fc0998360d81f67816d70d45635`. Exact-main system CI [39829054489](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39829054489) passed: **1,142/1,142 Node tests**, Vite build, Python regression/data-integrity, and source inventory diagnostic. The source diagnostic explicitly recorded HTTP 403 as BLOCKED; no live manifest was emitted. The master-table/corpus workflow [39829014339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39829014339) also passed. GitHub Pages deploy [39829014364](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39829014364) was still in progress at this checkpoint.
- Batch 21 source: official NIKL Q&A qna_seq=311009, “'빛' 발음이 궁금합니다.” (question 2025-03-04; answer 2025-03-05). The question concerns 빛 in personal names; the answer reproduces official §13/§18 examples including 옷이[오시], 국물[궁물], 없는[엄ː는]. These exact forms are therefore recorded as official-rule-example evidence with a scope note, not as the Q&A's primary target.
- A concrete data-note defect was corrected: 국물 nasal assimilation is triggered by following ㅁ, not ㄹ. The lexical note now says “before ㅁ”. The three lexical surface, IPA, and Ukrainian target fields remain unchanged; their source URLs now match the observed official locator.
- Batch-21 exact-head verification passed at 4e737cff714bb4a7eea019a01ac65e4117889608: [system CI 39829847141](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39829847141) passed **1,145/1,145 Node tests**, Vite build, Python regression/data-integrity, and source inventory diagnostic. Expected post-review inventory: 36/60 citations content-checked (22 direct target-form/official-rule-example, 9 partial, 5 contextual-example-only), 24 citation-only/unreviewed, 21 eligible HTML imports. Item-level KOGL marking and independent broad-IPA/Ukrainian-target review remain open.
- Release disposition remains deployed research preview / partial prototype.


## Continuation checkpoint — NIKL Q&A 312379 mixed-scope evidence review, batch 22 (2026-10-22)

- Starting main: d72ba016b18950e0455ec032567bcec9c695a635, which includes batch 21 PR #233 (qna_seq=311009) merged as that commit.
- Reviewed official indexed NIKL Q&A [qna_seq=312379](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=312379), “표준발음과 음운변동을 알려주세요” (question 2025-04-03; answer 2025-04-08).
- The answer directly attests 얇실하다[얄씰하다] and explains §§10/23. Its reproduced §23 examples also contain 밭갈이[받까리] and 값지다[갑찌다]; these are quoted official-rule examples, not the Q&A question target.
- Existing lexical notes for the three forms were preserved. No Korean surface, project IPA, or Ukrainian target field changed.
- Inventory after batch 22: 37/60 citations content-checked (23 direct target-form/official-rule-example attestations, 9 partial, 5 contextual-example-only); 23 citation-only/unreviewed remain: 19 Q&A/FAQ pages, one Korean Basic Dictionary entry, and three PDFs. The HTML intake queue contains 20 eligible pages.
- Task ledger: DONE_VERIFIED after exact-head CI — source scope reviewed, source register and intake queue reconciled, regression coverage added. BLOCKED / rights — item-level KOGL marking remains unverified. TODO — continue reviewing the remaining 23 citations. BLOCKED_SPECIALIST_ADJUDICATION — independent broad-IPA gold and Ukrainian-target review remain absent.
- Release status remains deployed research preview / partial prototype, not a scientifically validated release.

- Exact tested implementation head: e79d7c2b2fc9cef9af8e98f51ba702e8b67c2d67. [CI run](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39830641838) passed 1,147/1,147 Node tests, Vite build, Python regression/data-integrity, and source-register checks. Direct NIKL fetch returned HTTP 403 and was explicitly classified BLOCKED.


## Continuation checkpoint — NIKL Q&A 314041 claim-scope review, batch 23 (2026-10-22)

- Starting main: 86ff1394c765b119dafb4506c15045ea1b5a1018 (includes batch 22, qna_seq=312379, with direct-answer and quoted-rule-example scope recorded).
- Official indexed NIKL Q&A [qna_seq=314041](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=314041), “낱낱이 음운변동” (question 2025-04-28; answer 2025-04-29), directly gives 낱낱이[난ː나치] and explicitly states final neutralization → nasalization → palatalization.
- Corrected the lexical note that previously said exact ordering could vary by analysis; this answer does state a specific sequence. The existing IPA preserves long vowel nanː|na|tɕʰi. Korean surface and Ukrainian target remain unchanged.
- Expected inventory after batch 23: **38/60** content-checked (24 direct target-form/official-rule-example, 9 partial, 5 contextual-example-only); **22 citation-only/unreviewed** (18 Q&A/FAQ, one dictionary, three PDFs); **19** eligible HTML imports.
- Task ledger: DONE_VERIFIED after exact-head CI — source title/date, exact-form attestation, explicit sequence, source-register status, IPA length preservation, and queue tests. BLOCKED / rights — item-level KOGL mark remains unverified. TODO — review remaining 22 citations. BLOCKED_SPECIALIST_ADJUDICATION — independent broad-IPA gold and Ukrainian-target review remain outstanding.
- Direct NIKL fetch remains HTTP 403 in CI; no live manifest is claimed and no access-control bypass is attempted. Release remains deployed research preview / partial prototype.


## Continuation checkpoint — NIKL Q&A 313717 direct attestation, batch 24 (2026-10-22)

- Starting main: db009ec1966d814430792ac656d681f1994302d0 (batch 23, qna_seq=314041, is merged).
- Official indexed NIKL Q&A [qna_seq=313717](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=313717), “붙이는 구개음화” (question 2025-04-23; answer 2025-04-24), directly states 붙이다[부치다] and explains §17 palatalization of ㅌ before suffixal 이.
- The lexical note now states that the answer directly attests the exact target; no Korean surface, project IPA, or Ukrainian target field changed.
- Expected inventory after batch 24: **39/60** content-checked (25 direct target-form/official-rule-example, 9 partial, 5 contextual-example-only); **21 citation-only/unreviewed** (17 Q&A/FAQ, one dictionary, three PDFs); **18** eligible HTML imports.
- Task ledger: DONE_VERIFIED after exact-head CI — source title/date, exact target, §17 explanation, source register, and queue tests. BLOCKED / rights — item-level KOGL mark remains unverified. TODO — review remaining 21 citations. BLOCKED_SPECIALIST_ADJUDICATION — independent broad-IPA gold and Ukrainian-target review remain outstanding.
- Direct NIKL fetch remains HTTP 403 in CI; no live manifest is claimed and no access-control bypass is attempted. Release remains deployed research preview / partial prototype.


### Batch-24 exact-head verification checkpoint

- Tested implementation/test head: cddeac9cd546c59c737161fc8c321c9e35093891.
- [System verification CI 39832329925](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39832329925) passed **1,153/1,153 Node tests**, Vite build, Python regression/data-integrity, and source inventory diagnostic wrapper.
- The live NIKL request again returned HTTP 403 and was explicitly recorded as BLOCKED; no live manifest was emitted.
- The existing two diagnostic-only JS/Python surface divergences (넓죽하다, 읽고) remain unresolved and have no independent IPA adjudication.
- The next commit only adds this verification close-out; final-head CI is rerun before merge.


## Continuation checkpoint — NIKL Q&A 313201 direct rule-example review, batch 25 (2026-10-22)

- Starting main: 1eecb11275e5af031cd40082f6cc6f8da51cc531 (batch 24, qna_seq=313717, is merged).
- Official indexed NIKL Q&A [qna_seq=313201](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=313201), “‘굳이’ 구개음화” (question 2025-04-16; answer 2025-04-18), asks about 굳이 and reproduces the official §17 example 굳이[구지]. Classified as direct official-rule-example evidence for the exact target.
- Normalized the source URL to the canonical official route without optional search parameters. The Korean surface, project IPA, and Ukrainian target remain unchanged; independent phonetic review of IPA allophony and Ukrainian adaptation is still needed.
- Expected inventory after batch 25: **40/60** content-checked (26 direct target-form/official-rule-example, 9 partial, 5 contextual-example-only); **20 citation-only/unreviewed** (16 Q&A/FAQ, one dictionary, three PDFs); **17** eligible HTML imports.
- Task ledger: DONE_VERIFIED after exact-head CI — source title/date, target/example scope, URL parity, source register, and queue tests. BLOCKED / rights — item-level KOGL mark remains unverified. TODO — review remaining 20 citations. BLOCKED_SPECIALIST_ADJUDICATION — independent broad-IPA gold and Ukrainian-target review remain outstanding.
- Direct NIKL fetch remains HTTP 403 in CI; no live manifest is claimed and no access-control bypass is attempted. Release remains deployed research preview / partial prototype.


### Batch-25 exact-head verification checkpoint

- Tested implementation/test head: 63d8659d07d5bd6589a1e8336a434361bcbaa888.
- [System verification CI 39833113496](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39833113496) passed **1,156/1,156 Node tests**, Vite build, Python regression/data-integrity, and the source inventory diagnostic wrapper.
- Direct NIKL fetch again returned HTTP 403 and was explicitly classified BLOCKED; no live manifest was produced.
- The two known JS/Python surface differences (넓죽하다, 읽고) remain diagnostic-only and have not received independent IPA adjudication.
- The next commit adds this verification close-out only; exact-head CI is rerun before merge.


## Continuation checkpoint — NIKL Q&A 311728 direct correction, batch 26 (2026-10-22)

- Starting main: 6d0f8ff887d8437c7d5316a9656dc807dd32124e (batch 25, qna_seq=313201, is merged).
- Official indexed NIKL Q&A [qna_seq=311728](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=311728), “앞일과 공업용의 발음 관련” (question 2025-03-21; answer 2025-03-26), corrects the question's proposed 공업용[공업뇽] to the standard 공업용[공엄뇽]. The answer also reproduces official §29 examples such as 영업-용[영엄뇽].
- Classified as direct attestation for the exact lexical target. The Korean surface, project IPA, and Ukrainian target are unchanged; item-level rights and independent IPA/Ukrainian review remain open.
- Expected inventory after batch 26: **41/60** content-checked (27 direct target-form/official-rule-example, 9 partial, 5 contextual-example-only); **19 citation-only/unreviewed** (15 Q&A/FAQ, one dictionary, three PDFs); **16** eligible HTML imports.
- Task ledger: DONE_VERIFIED after exact-head CI — source title/date, correction of question premise, source register, and queue tests. BLOCKED / rights — item-level KOGL mark remains unverified. TODO — review remaining 19 citations. BLOCKED_SPECIALIST_ADJUDICATION — independent broad-IPA gold and Ukrainian-target review remain outstanding.
- Direct NIKL fetch remains HTTP 403 in CI; no live manifest is claimed and no access-control bypass is attempted. Release remains deployed research preview / partial prototype.


### Batch-26 exact-head verification checkpoint

- Tested implementation/test head: c43715ecb8637cda4c32dfece452e6ec2bd633ef.
- [System verification CI 39834567015](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39834567015) passed **1,159/1,159 Node tests**, Vite build, Python regression/data-integrity, and source inventory diagnostic wrapper.
- Direct NIKL fetch again returned HTTP 403 and was explicitly classified BLOCKED; no live manifest was emitted.
- Two known JS/Python surface differences (넓죽하다, 읽고) remain diagnostic-only and lack independent IPA adjudication.
- The next commit only adds this verification close-out; final-head CI is rerun before merge.


## Mainline close-out — canonical NIKL collector + evidence review state (2026-10-22)

This section supersedes any earlier handoff statement that stops at batch 26. The completion audit and source register are the source of truth for the latest claim-review count; batch numbers in historical branch notes were created on parallel branches and should not be interpreted as a perfectly linear count.

- **Verified main before this documentation close-out:** `26ed48842a4f475ecd1a5eb2f9f92af7547ff9af` (merge of the current qna_seq=311728 correction, PR #243).
- **PR reconciliation:** PR #243 merged. Duplicate PRs #241 and #242 were closed with comments pointing to the merged change. No open PRs remained at the time of this checkpoint.
- **Exact-main CI:** [system verification 39834874376](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39834874376) passed; [test workflow 39834874589](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39834874589) passed. Browser suite: **1,159 passed, 0 failed**; Vite build passed; Python regression/data-integrity passed. The official source live-fetch step was skipped in the system workflow because the source diagnostic is not a successful source fetch. Prior source diagnostics repeatedly returned HTTP 403 and were recorded BLOCKED.
- **Deployment/artifact workflows:** at the time of this close-out, master-table/corpus artifacts run [39834874436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39834874436) remained queued and Pages deployment run [39834874486](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39834874486) remained pending. Do not claim these two runs succeeded unless a later run proves it.
- **Current evidence inventory from the merged batch-26 source review:** 41/60 citations content-checked; 19 citation-only/unreviewed remain (15 Q&A/FAQ, one Korean Basic Dictionary entry, three PDFs); 16 eligible HTML imports remain. These counts concern citation review and import queue, not the 30-article normative-rule inventory. Use the latest `docs/audits/COMPLETION-AUDIT-2026-10-20.md` and `research/SOURCE-REGISTER.csv` as the current evidence ledger.
- **DONE_VERIFIED:** collector has canonical official desktop URL, metadata-only default, fail-closed 30-article completeness gate, JSON Schema, explicit local HTML import with honest provenance, CLI missing-value checks, and protection against overwriting the imported HTML. Node/Python regressions cover the import and provenance contract.
- **DONE_VERIFIED:** current mainline evidence correction for qna_seq=311728 distinguishes the question's mistaken proposed reading 공업용[공업뇽] from the official answer 공업용[공엄뇽], records the official title/date and source URL, preserves the Korean surface/project IPA/Ukrainian target fields, and updates queue counts.
- **TODO:** audit the remaining 19 citation-only sources claim by claim; the three PDFs require the separate saved-PDF workflow. Do not mark a citation reviewed merely because a URL exists.
- **BLOCKED / source access:** GitHub Actions direct fetch to NIKL returns HTTP 403. Do not bypass it. If the official page is accessible through ordinary browser use, a human-saved HTML file can be processed using `npm run crawl:nikl -- --url "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002" --input-html "PATH_TO_SAVED_PAGE.html"`; the manifest must retain the explicit local-import provenance and still pass the all-30-articles completeness gate.
- **BLOCKED / rights:** item-level KOGL reuse marking is not verified; metadata-only retention remains the default.
- **BLOCKED_SPECIALIST_ADJUDICATION:** independent broad-IPA gold and Ukrainian practical-target review remain absent. Two JS/Python differential cases, `넓죽하다` and `읽고`, remain diagnostic-only and lack independent IPA adjudication. Korean bracket notation from NIKL is not IPA and cannot itself validate the project's IPA transcription.
- **Release disposition:** deployed research preview / partial prototype, **not release-ready**. Engineering and CI gates pass, but source-access, rights, remaining citation review, and specialist IPA/Ukrainian-output acceptance criteria remain open.


## Continuation checkpoint — Q&A 318279 embedded dictionary attestation, batch 27 (2026-10-22)

- Starting main: 71ddf1e8551fe7c4ff4f2ef10fb972a617106af1 (includes the batch-26 mainline verification close-out).
- Official indexed NIKL Q&A [qna_seq=318279](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=318279), “‘찾아가다’라는 동사의 쓰임” (question 2025-07-14; answer 2025-07-15), is primarily about syntax. Its answer embeds the Standard Korean Dictionary entry directly giving 찾아가다[차자가다] and conjugation 찾아가[차자가].
- Evidence class is OFFICIAL_DICTIONARY_ATTESTATION; do not claim the Q&A itself explains phonology. The project's §13 mapping remains a separate rule-analysis layer. Korean surface, project IPA, and Ukrainian target are unchanged.
- Expected inventory after batch 27: **42/60** content-checked (27 direct target-form/official-rule-example, 1 official dictionary, 9 partial, 5 contextual-example-only); **18 citation-only/unreviewed** (14 Q&A/FAQ, one dictionary, three PDFs); **15** eligible HTML imports.
- Task ledger: DONE_VERIFIED after exact-head CI — dictionary attestation, claim scope, source register, and queue tests. BLOCKED / rights — item-level KOGL mark remains unverified. TODO — review remaining 18 citations. BLOCKED_SPECIALIST_ADJUDICATION — independent broad-IPA gold and Ukrainian-target review remain outstanding.
- Direct NIKL fetch remains HTTP 403 in CI; no live manifest is claimed and no access-control bypass is attempted. Release remains deployed research preview / partial prototype.


### Batch-27 exact-head verification checkpoint

- Tested implementation/test head: afbeef7dd307b02efab4fcc86ff63ee4e311b238.
- [System verification CI 39836022141](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39836022141) passed **1,162/1,162 Node tests**, Vite build, Python regression/data-integrity, and source inventory diagnostic wrapper.
- Direct NIKL fetch again returned HTTP 403 and was explicitly classified BLOCKED; no live manifest was emitted.
- The two known JS/Python surface differences (넓죽하다, 읽고) remain diagnostic-only and lack independent IPA adjudication.
- The next commit only adds this verification close-out; final-head CI is rerun before merge.


## Continuation checkpoint — integrated NIKL master passage run through browser engine (2026-10-22)

- Working branch: `research/nikl-corpus-engine-regression-2026-10-22`; draft PR #247.
- Latest engine/test implementation at this checkpoint: `c86a550e38bb5b959825cf222329d95486f7d588`; follow-up audit/handoff documentation commits are on the same branch.
- Added `tests/fixtures/nikl-all-articles-master-passage-2026-10-22.txt` and `tests/nikl-master-passage-engine-regression.test.mjs`. The test runs each unique Hangul token and the full passage through the browser engine in strict and practical modes, checks every matching lexical record against stored Korean surface/IPA/Ukrainian target, gates unresolved tokens/issues, and tests seven generic §19 outputs without lexical overrides.
- Latest measured corpus run: 5,230 characters; 855 unique Hangul tokens; 329 lexical hits; 526 generic-resolved tokens; zero unresolved tokens; zero token-level issues. Full-text strict and practical conversion both produced IPA and Ukrainian output with zero unresolved placeholders. The 23 diagnostics are expected warnings for isolated compatibility Jamo included in the inventory, not actionable word-level issues.
- The first run exposed 13 unresolved token forms. Review showed that most were malformed particle/ending joins in the passage, not evidence for loosening the engine's morphology guards. These contexts were corrected; the final run has zero unresolved tokens. No unsupported pronunciations were invented.
- Generic §19 regression oracles pass: 침략→침냑, 강릉→강능, 막론→망논, 석류→성뉴, 협력→혐녁, 법리→범니, 국립→궁닙.
- Exact-head CI for the implementation batch: browser tests **1,166/1,166 passed**, Vite build passed, Python regression/data-integrity jobs on 3.11/3.12/3.13 passed, and master-table/research-corpus generation passed. See PR #247 and `docs/audits/NIKL-MASTER-PASSAGE-ENGINE-RUN-2026-10-22.md`.
- **DONE_VERIFIED:** corpus is wired into the actual browser engine; known lexical records are regression-locked; the reported token-level blockers were corrected; full-text strict/practical smoke checks and all current CI jobs pass.
- **PARTIAL:** this does not prove all subparagraphs, exceptions, and allowed variants of articles 1–30 are covered by the passage, nor that all 526 generic outputs are normatively correct. Continue with article/subparagraph span mapping and independent NIKL adjudication of generic outputs.
- **BLOCKED / external access:** direct NIKL live fetch in CI remains HTTP 403 and must remain explicitly blocked; do not bypass access controls or invent evidence.
- **BLOCKED_SPECIALIST_ADJUDICATION:** independent broad-IPA gold and Ukrainian practical-target review remain outstanding; Ukrainian targets are project approximations, not NIKL prescriptions.
- **Release disposition:** research preview / partial prototype, not release-ready. Keep PR #247 in draft until rule-by-rule coverage and generic-output adjudication are complete.

### Continuation checkpoint — runtime IPA-first invariant verified (2026-10-22)

- Branch: `research/nikl-corpus-engine-regression-2026-10-22`; draft PR #247 remains open and unmerged.
- Added `tests/ipa-first-runtime-invariant.test.mjs`. For every unique Hangul token in the integrated passage, the test re-runs the IPA → Ukrainian adapter on the *actual IPA returned by the runtime engine* and requires exact equality with the runtime target. It repeats this for every Hangul-only lexical row and every exposed licensed alternate.
- Results at tested code head `b980dc498c57bc0502325b4cf5fd71318664b9dc`: 855 passage tokens, 0 divergences; 630 Hangul-only lexical rows, 0 divergences; direct IPA contrast and unknown-segment fail-closed controls pass.
- [Tests/build/Python 3.11–3.13 CI](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39839292113): 1,170 tests passed, 0 failed; build and all three Python versions passed. [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39839292102) and [generated artifact checks](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39839292149) passed.
- No production conversion changes were made because the runtime audit found no IPA→Ukrainian divergence; test-harness expectation errors were corrected rather than distorting correct adapter behavior.
- **DONE_VERIFIED:** the tested corpus and all Hangul-only lexical rows/variants preserve the single Korean surface/IPA → Ukrainian path at runtime.
- **PARTIAL:** this verifies the adapter boundary, not normative correctness of all Korean IPA surfaces. Continue source-backed adjudication of generic phonology and article/subparagraph/exception/variant coverage.
- **BLOCKED:** direct NIKL fetch remains HTTP 403 in CI; no bypass or fabricated evidence. Independent broad-IPA gold and Ukrainian-target specialist review remain open.
- Release status remains research preview / partial prototype, not release-ready.


## Korean NIKL master-passage execution update — 2026-10-22

- Branch: `research/nikl-corpus-engine-regression-2026-10-22`; PR #247 remains draft.
- Restored the intentionally ambiguous forms in `tests/fixtures/nikl-all-articles-master-passage-2026-10-22.txt`; do not claim the previous sanitized-corpus result represents the user's exact input.
- CI at `0fa20f2790f66b8b3e3b06a70b67bdc97e999ce4` failed as expected on 13 unresolved tokens. The test gate was corrected to register those exact cases rather than inventing pronunciations: `짧은소리의`, `수많이는`, `없으니를`, `없애다에서는`, `값에서는`, `밟으니와`, `싫어도에서는`, `외곬에를`, `값있는에서는`, `히읗을의`, `벼훑이를`, `밭이와`, `붙임`.
- Updated tests now require that exact unresolved set, fail on new gaps, and check IPA→Ukrainian parity for resolved tokens/variants. These changes are a gate correction, not proof that the 13 cases have been solved.
- Audit: `docs/audits/NIKL-MASTER-PASSAGE-ENGINE-RUN-2026-10-22.md`.
- Pending final evidence: CI on the final branch head after the last test commit; verify fixture fidelity against the full user message; inspect any remaining failures; update this section with exact final SHA and statuses.
- Classification: broad IPA-first runtime invariant = partially verified; 13 source/morphology contexts = blocked/evidence-limited; exhaustive articles 1–30 normativity = PARTIAL; release = not ready as a fully normative transcriber.


## Final-head verification — 2026-10-22

- Current fixture/code/test head: `34dc21fb521cc03933f091c89da14473bbd02a66`; branch `research/nikl-corpus-engine-regression-2026-10-22`; draft PR #247.
- Restored two additional wording differences: `별도의 규정을 확인하시오` and `꽃밭을 검증하시오`.
- [Tests/build/Python 3.11–3.13](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842388316): **1,170/1,170 passed**, build passed, all three Python versions passed.
- [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842380731): passed. [Artifact generation](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842388501): `generate-corpus` job passed; workflow overall conclusion was still updating at the time of writing.
- The exact unresolved set remains 13 tokens documented in the NIKL audit. All other resolved-token runtime targets pass IPA-adapter equality; no pronunciations were invented.
- **Still open:** byte-for-byte verification against the full user message; resolve/segment the 13 malformed or morphology-ambiguous contexts using evidence; source-map all subparagraphs/exceptions/variants; normative review of generic IPA. NIKL live access returns HTTP 403.
- **Stop status:** feasible harness correction and CI completed; linguistic coverage remains PARTIAL and release is not ready. Do not label the entire request “fully completed” while these evidence gaps remain.


## Fail-closed runtime correction and final verification — 2026-10-22

Commit with implementation and tests: `f296014d5980123c8c64b9dde9abd47c43382131` (production fix `761d89c030687a3b588af717ffda430917aa8570`). For a single unresolved Hangul token, the engine now withholds the entire IPA string, Ukrainian target, and derived variants instead of exposing partial results from unaffected syllables. Diagnostic trace/issues remain available for research. Added a regression that checks every registered gap has empty IPA/target/variants and that the exact known-gap set remains unchanged.

- [Tests/build/Python 3.11–3.13](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842772761): **1,171/1,171 tests passed**, 0 failed; production build passed; Python 3.11, 3.12, and 3.13 passed.
- [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842772726): passed.
- [Browser G2P integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842772847): passed.
- [Master-table/research-corpus artifact workflow](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842772746): passed.
- Final stress fixture on this code head: 5,198 Unicode characters; 852 unique Hangul tokens; 322 exact lexical hits; 517 generic resolved tokens; exactly 13 registered unresolved tokens; 0 unexpected unresolved forms; 0 runtime IPA→Ukrainian divergences among resolved tokens. The unresolved forms are withheld, not rendered as accepted transcription.

**DONE_VERIFIED:** fail-closed behavior for unresolved single-token contexts; exact gap-set regression; runtime IPA parity for all resolved corpus tokens/variants; all listed CI checks on the implementation/test head. **PARTIAL / evidence-limited:** the 13 contexts themselves are not normatively solved; byte-for-byte identity with the complete original chat text is not proven; article/subparagraph/exception/allowed-variant mapping and generic IPA adjudication remain incomplete. Direct NIKL fetch remains HTTP 403. Release readiness remains **NO** (research preview / partial prototype).


## 2026-10-23 continuation — verified work and active acceptance gate

- PR #249 merged as `e9f769035172eb43387443f8e33fdfef04733a42`: literal preservation of bracketed Jamo and punctuation-separated inventories; browser/build and Python/data-integrity CI succeeded; official NIKL metadata-only job was skipped.
- PR #250 merged as `242569b6af93828612048e283fe8af0f7847fba8`: whitespace-separated consonant/vowel inventory preservation. Exact-head CI run [39951169935](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39951169935), general tests/build run [39951169795](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39951169795), browser G2P run [39951169850](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39951169850), and generated-artifact run [39951169893](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39951169893) all completed successfully; Python 3.11, 3.12, 3.13 and production builds passed. Source-inventory job was skipped.
- PR #251 merged as `b869b39b56812c5852a05e779a3953809da54e9b` from exact implementation head `846a4b6c29c8e6f6aeef93f96b0487ac5ffc34b8`, after verification, JS tests/build, browser G2P, Python 3.11/3.12/3.13, and generated-artifact checks passed. Mixed-text unresolved units are visible inside `⟦…⟧`; IPA remains withheld; single-token unresolved behavior remains empty/fail-closed. The post-merge main checks and GitHub Pages deployment succeeded for code/documentation head `b733acccc8b14bb4e098814e0686be4961c9d141`: 1,175 JavaScript tests passed, production build passed, Python 3.11/3.12/3.13 and generated-artifact checks passed, and the Pages workflow's live public-page and adversarial practical-mode smoke tests passed. This handoff-only update triggers a fresh run for the resulting HEAD; use that exact run before declaring the final documentation commit deployed.

Open evidence-review PRs #244 and #246 were inspected but intentionally left untouched. Their branches have diverged from current `main` (PR #244: 10 commits ahead/11 behind; PR #246: 12 ahead/8 behind), and both report non-mergeable. They alter lexical evidence/source registers and need careful conflict reconciliation plus claim-level source review; they were not blindly merged. Their bodies report live NIKL HTTP 403, so the cited source claims remain bounded by the evidence included in those branches.

**Readiness at this handoff:** the technical service is deployable and its regression suite is green, but the project remains a research preview/partial prototype for normative claims. The remaining blockers are exhaustive rule/subparagraph/exception/variant mapping, independent adjudication of generic Korean IPA/surface outputs, a genuinely independent Ukrainian adaptation gold set, and a reproducible permitted route to official source captures. Do not describe it as a fully validated normative system.
- Remaining release blockers: exhaustive *표준 발음법* 1–30 rule/subparagraph/exception/variant evidence mapping; independent adjudication of generic IPA and Korean surface readings; independent Ukrainian adaptation gold set; resolve HTTP 403 to live NIKL or use reproducibly sourced local official captures. Green CI establishes technical regressions only, not linguistic correctness.


## Continuation checkpoint — NIKL Q&A 326601 claim-scope review (2026-10-23)

- Reconciled the open batch-28 work against current `main` rather than merging its divergent branch. PR #246's useful source adjudication is ported as a small, reviewable change: official indexed answer “몇으로 발음” (question 2026-01-18; answer 2026-01-20) directly attests 몇으로[며츠로] and explicitly cites Standard Pronunciation Rules §13 for liaison of final ㅊ before vowel-initial 으로.
- Updated `research/SOURCE-REGISTER.csv` to distinguish the official surface-form attestation from IPA and Ukrainian adaptation, and clarified the lexical row without changing its Korean surface, project IPA, or Ukrainian target.
- Inventory moves from 42/60 to **43/60 citations content-checked**; **17 citation-only/unreviewed** remain (14 eligible HTML + 3 PDFs). This is claim-level source review, not full coverage of the 30 normative articles.
- Item-level KOGL/reuse rights remain unverified. Broad independent IPA gold and Ukrainian-target adjudication remain outstanding; no pronunciation or Ukrainian output was changed.
- Direct live NIKL retrieval remains HTTP 403 in the existing checks. This review is bounded to the official indexed answer content already examined; no access-control workaround is used.
- Task ledger: `PARTIAL` — source claim-scope and inventory changes are implemented, but the first exact-head CI exposed a batch-28 integration-status assertion failure. The source-register field has been corrected; exact-head CI must be rerun before this item is marked `DONE_VERIFIED`. `BLOCKED / rights` — item-level reuse marks; `TODO` — inspect remaining 17 citations via authorized saved copies; `BLOCKED_SPECIALIST_ADJUDICATION` — independent broad IPA and Ukrainian practical-target review.
- Release disposition remains **deployed research preview / partial prototype**, not a scientifically validated release.


## Continuation checkpoint — batch 29 NIKL-backed surface correction (2026-10-23)

- Added a finite exact-form correction layer before IPA for `값어치→가버치`, `넓죽하다→넙쭈카다`, `넓둥글다→넙뚱글다`, `넓적하다→넙쩌카다`, and `읽고→일꼬`. The raw g2pK implementation and raw-port fixture remain unchanged; no general grapheme rule was added.
- Ukrainian output continues to be generated from IPA. Correction provenance is visible in analysis; the adapter skips offset-sensitive correction if the port changes string length.
- Source evidence registered: NIKL *표준 발음법* §§10/11/15/23 and official Q&A/FAQ qna_seq=307508, qna_seq=315279, qna_seq=322805, mcfaq_seq=5949. qna_seq=307508 is direct for `넓죽하다` only; qna_seq=322805 directly supports `넓둥글다[넙뚱글다]` and `넓적하다[넙쩌카다]`, resolving the earlier spelling gap with independent evidence. See `docs/audits/NIKL-PRACTICAL-SURFACE-CORRECTIONS-BATCH-29-2026-10-23.md`.
- **DONE_VERIFIED / MERGED:** PR #253 was squash-merged as `46de5d71aae12380c353642d73b0b13743b97662` after exact PR-head `bfe04acce510b400ed1f8208b24ef49ac61065be` passed JavaScript, build, browser G2P, Python 3.11–3.13, and generated-artifact checks.
- Fixed intake queue remains 43/60 content-checked; 17 remain unreviewed (14 HTML + 3 PDFs). Item-level KOGL marks, independent broad IPA gold, independent Ukrainian-target gold, exhaustive rule/subparagraph/exception mapping, and permitted live NIKL captures remain open.
- **Readiness:** research preview / partial prototype, not a fully validated normative transcriber.


## Final batch 29 verification and merge checkpoint — 2026-10-23

- **DONE_VERIFIED on exact PR head** `bfe04acce510b400ed1f8208b24ef49ac61065be`, merged as `46de5d71aae12380c353642d73b0b13743b97662`: 1,182/1,182 JavaScript tests passed; production build, browser G2P integration, Python 3.11/3.12/3.13, and generated corpus artifacts passed. Evidence: [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39963917834), [browser G2P](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39963917781), [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39963917899), [artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39963918041).
- The earlier batch-28 pending-CI wording is historical; exact-head CI passed and PR #252 was merged as `74b773bc59deb8c381de20a0d5404da231083ce5`. Post-merge main CI and GitHub Pages deployment/live smoke were not independently confirmed in this session; do not infer deployment success from PR-head CI alone.
- **Still open:** independent IPA gold, independent Ukrainian adaptation gold, exhaustive *표준 발음법* article/subparagraph/exception/variant mapping, item-level KOGL rights, and permitted reproducible live source access (HTTP 403 remains the recorded block). This run skipped the optional live-source inventory step; do not count it as successful source retrieval.
- Release status remains research preview / partial prototype until those linguistic and rights gates are satisfied.


## Native research-engine continuation — 2026-10-23
- **Scope correction:** the active work is the native Python research engine (`src/korean_ukrainian/`), not the JS g2pK practical port.
- **Implementation merged:** PR [#255](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/255), branch `research/native-engine-surface-boundary-2026-10-23`, squash commit `6df6a5d2e5d8a472ce7b8ceee7365b57451ccfcd`. It adds `surface_hangul` and `surface_status` to native `phoneticize_korean` output by recomposing the mutated onset/nucleus/coda fields. It adds source-attested surface regressions for `값어치`, `넓죽하다`, `넓둥글다`, `읽고`, `넋이`, plus a rule-only `넓적하다` case and whitespace boundaries.
- **Status:** DONE_VERIFIED on final PR head `6ed03a0f5c5b26c0afb8764a6dfc94eaf8eadc36`. Tests/build/Python 3.11–3.13 passed [run 39967012003](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39967012003); system verification passed [run 39967011633](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39967011633); generated corpus artifacts passed [run 39967011496](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39967011496). Optional g2pK CI also passed [run 39967011397](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39967011397), but it is not the implementation target. No local execution is claimed; edits were made through the GitHub API. Report: `research/NATIVE-ENGINE-SURFACE-IPA-BOUNDARY-2026-10-23.md`.
- **Contract:** this exposes the native Korean surface form as a distinct boundary before IPA; it neither routes through the JS port nor creates a Hangul-to-Ukrainian shortcut. The IPA and Ukrainian target still require independent evaluation.


## Native research-engine continuation — strict IPA boundary audit (2026-10-23)

Task ledger, reconciled against code and exact-head CI:

- **DONE_VERIFIED** — PR #257 / commit `6b2ebf9826f48084b738020f73b819ccb689f958`: preserve IPA vowel-length and unreleased-stop metadata; reject unsupported IPA symbols; correct primary IPA `r`→`ɾ` entries; add an initial registry parser regression.
- **DONE_VERIFIED** — PR #258 / merge commit `f2cfda570d424c23425fdf948edc91cea65a6d7b`: reject duplicate length markers; require unreleased-stop diacritics to follow a supported stop in the same syllable; reject cross-boundary/misattached modifiers; scan the raw base lexicon and every dated overlay, including alternate IPA fields; enforce IPA/surface syllable-count alignment; correct hidden alternate IPA for `발음의` and its stale regression fixture.
- **CI evidence on final PR #258 head `995417e23e772297520017a4ac51f13ae4986cb5`:** Python 3.11–3.13 + web tests PASS [40003785817](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40003785817); system/Python data-integrity and browser/build PASS [40003785800](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40003785800); generated master table/corpus PASS [40003785656](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40003785656); optional g2pK integration PASS [40003785813](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40003785813). Optional live NIKL inventory was SKIPPED (HTTP 403 remains the recorded blocker), not passed.
- **PARTIAL / BLOCKED_SPECIALIST_ADJUDICATION** — `research/ipa-adjudication-queue.json` contains 20 cases and all remain unadjudicated. Do not populate IPA gold from the engine's own output or infer IPA from NIKL Hangul notation. Next acceptance criterion: qualified reviewer A independently transcribes broad IPA, reviewer B independently reviews without seeing A's answer, and disagreement is reconciled with method references.
- **TODO / BLOCKED** — independent Ukrainian target-layer review; exhaustive subparagraph/exception/variant review of all 30 Standard Pronunciation articles; 17 source citations remain unreviewed (14 HTML, 3 PDF per latest audit); item-level KOGL reuse type remains unchecked for numerous NIKL records; live source inventory unavailable in CI.
- **DEFERRED** — owner-dependent project-wide licensing decision; do not infer license from third-party/vendor notices.
- Local tests were not run because this session had GitHub API access rather than a local checkout. The merged implementation is verified by exact-head CI, not by a local run.
- **Readiness remains:** deployed research preview / partial prototype; not release-ready as a scientifically validated transcriber. No PR was merged without its exact-head CI passing; the practical JS transcription implementation was not modified in this batch.


## Native research-engine continuation — feature vectors and boundary propagation (2026-10-23)

- **DONE_VERIFIED — PR #259**, merge commit `25c098ce46a355b810a60550ea77f1a026bc1c7d`: every segment in all raw primary/alternate IPA forms must map to a non-empty source feature vector with core feature fields. CI passed Python 3.11–3.13/web, system/data integrity/browser build, and generated artifacts. Evidence: [tests 40004118905](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40004118905), [system 40004118883](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40004118883), [artifacts 40004118959](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40004118959).
- **DONE_VERIFIED — PR #260**, merge commit `a378cb28068fe645b4a68bcc587dd94c39514501`: IPA segments preserve syllable/word indices and boundary type through IPA→target analysis and candidate selection; the Ukrainian renderer preserves word spaces but omits IPA syllable dots. Exact code/test commit `03e56964c263bfff3a128591bb3750569f1acc0d` passed Python 3.11–3.13/web [40004783735](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40004783735), system verification/browser build [40004783586](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40004783586), generated artifacts [40004783701](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40004783701), optional g2pK integration [40004783755](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40004783755).
- **CI lessons:** strict raw-row audit exposed the hidden alternate IPA typo and stale cross-runtime assertion; boundary E2E test exposed a missing import. Each was corrected and the relevant exact code/test head passed. No local test run is claimed.
- **TODO / BLOCKED_SPECIALIST_ADJUDICATION:** the 20-case broad-IPA queue still requires two qualified independent reviewers; do not treat engine output as its own gold. **TODO:** independent Ukrainian target review. **TODO:** exhaustive article/subparagraph/exception/variant audit. **BLOCKED:** item-level KOGL rights and live NIKL inventory (HTTP 403; workflow skipped).
- **Readiness:** technically improved research preview / partial prototype; not scientifically release-ready.


## Native pipeline empty-input fail-closed follow-up — 2026-10-23

- Starting default branch: `main` at `e1c079f81604bf2a6f3f93624fea06a22b14dd8a`.
- Working branch / PR: `research/native-empty-input-fail-closed-2026-10-23` / [PR #261](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/261).
- Problem found: empty/whitespace-only input could flow to an empty IPA segment list; `_select_target` then returned an empty selection object, allowing a false `model-selected` state with no output segments.
- Implementation: shared input validation for `analyze_korean`, `phonologize_korean`, and `phoneticize_korean`; fail-closed `_select_target` for empty segments; regressions across all public pipeline stages and unsupported non-Hangul input. No JS practical engine or linguistic data changed.
- First CI attempt exposed a validation-order mismatch for `hello`; fixed by checking unsupported characters before the no-Hangul empty-state check. The next run exposed a fixture that contained literal escaped text rather than actual whitespace; changed it to a literal non-breaking space. These failures and fixes are retained as evidence, not hidden.
- Implementation/test head `052f8ef0155be23ad86b8f58f94b8c7a5ffa3af6`: tests/Python 3.11–3.13/web build PASS [40006290986](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006290986); system/browser/Python integrity PASS [40006290971](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006290971); corpus artifacts PASS [40006290630](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006290630); optional g2pK Python 3.11/3.12 PASS [40006292252](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006292252). Live NIKL inventory skipped, not passed. Local tests not run.
- PR #261 merged as `1860616a15a664ef189ffdaff50fe559aa1339a5` after exact final-head CI passed. The empty-input contract fix is now on main; the live NIKL inventory remains skipped.
- Remaining scientific blockers unchanged: independent IPA adjudication queue (20 cases), independent Ukrainian target review, exhaustive article/subparagraph/exception coverage, item-level KOGL evidence, and live NIKL access (HTTP 403).
- Release status remains research preview / partial prototype, not scientifically validated or release-ready.


## Native IPA fortis-feature preservation — 2026-10-23

- Starting `main`: `1860616a15a664ef189ffdaff50fe559aa1339a5` (the merge of PR #261).
- Working branch / PR: `research/native-ipa-fortis-feature-preservation-2026-10-23` / [PR #262](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/262).
- Gap: source IPA feature vectors collapsed fortis forms (`p͈`, `tɕ͈`, `s͈`) with plain forms. Raw IPA was still preserved, but feature-based analysis lost the distinction.
- Implementation: add `fortis` to every supported source feature vector; require it in the raw lexical base/overlay audit; preserve `source_features` through target selection. Aspiration remains a separate feature. No IPA data or target mapping values were changed.
- Target-layer guardrail: `fortis` is deliberately excluded from `DEFAULT_WEIGHTS` because the reviewed Ukrainian inventory does not expose an explicit fortis feature. Candidate ordering is unchanged; the new feature is retained for analysis/provenance pending a reviewed target policy.
- Exact implementation/test head `a7b159baccba147837d979e3428a6cca486662b1`: Python 3.11–3.13/web [40006952606](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952606), system/browser/Python integrity [40006952310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952310), corpus artifacts [40006952531](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952531), and optional g2pK Python 3.11/3.12 [40006952377](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952377) all PASS. Live NIKL inventory was skipped, not passed. Local tests were not run.
- Code/test result: `DONE_VERIFIED` at the implementation/test head; documentation changes need final exact-PR-head CI before merge.
- Still open: independent IPA gold (20 cases), Ukrainian target review, exhaustive normative article/subparagraph/exception coverage, item-level KOGL evidence, and permitted live NIKL access.


## Native IPA adapter empty-input guard — current-mainline port — 2026-10-23

- Starting `main`: `17440e995cd38a2e57b5d203dfb0bd072b1fdbb5` (after PR #262).
- Working branch / PR: `fix/native-ipa-adapter-empty-input-mainline-2026-10-23` / [PR #264](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/264).
- Gap: direct callers of `map_ipa_to_ukrainian` could submit empty, whitespace-only, or boundary-only IPA and receive an empty analysis result. The Korean-input validator cannot protect this public downstream boundary.
- Change: type-check IPA before loading the target inventory; reject tokenization that produces zero supported segments. Tests cover empty input, real tab/newline whitespace, separator-only strings, non-string values, and valid IPA.
- Open PR reconciliation: [PR #263](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/263) contained this useful guard on a branch one commit behind main and became non-mergeable after PR #262 touched overlapping documentation. Its code/test change was inspected and ported to current mainline in [PR #264](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/264), including validation before target-adapter initialization. PR #264 merged as `5bb9178243604d169c2209671a953f8683b48408` after final-head CI passed. PR #263 was then closed as superseded with an explanatory comment; its branch/history was retained and not deleted.
- Implementation/test head `4c7bda56c6feda4b82b1ffa9c9028c7fb02d8ce3`: Python 3.11–3.13/web [40007944889](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007944889), system/browser/Python integrity [40007944954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007944954), corpus artifacts [40007945023](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007945023), optional g2pK Python 3.11/3.12 [40007945019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007945019): all PASS. Live NIKL inventory skipped, not passed. Local tests were not run.
- `DONE_VERIFIED` for the implementation/test head; final exact-PR-head CI must pass after the documentation updates.
- Scientific blockers unchanged: independent IPA gold (20 cases), independent Ukrainian target review, exhaustive normative rule/subparagraph/exception coverage, item-level KOGL evidence, and permitted live NIKL access.

## Scientific release blockers and Pages smoke repair — 2026-10-23

- Current base before this follow-up: 5bb9178243604d169c2209671a953f8683b48408 (PR #264 merged).
- Ported from inspected open PR #265: research/SCIENTIFIC-RELEASE-BLOCKERS-2026-10-23.md and the corrected assertion in .github/workflows/deploy-pages.yml. The original #265 branch is one commit behind and conflicts with current documentation; this branch integrates the changes with the current-mainline #261/#262/#264 statuses.
- Release evidence reconciled against the current repository: IPA queue 20 cases with 0/20 independent reviewer submissions in each reviewer slot; current source register 100 data rows with item-level KOGL review incomplete for multiple records; the separate article fixture maps NIKL articles 1–30 (29 finite-example statuses verified, Article 1 not-applicable), while research/RULE-COVERAGE.csv is a separate phenomenon/workstream matrix. Article mapping is not atomic proof of every subparagraph, exception, productive environment, or variant.
- Pages failure diagnosis: run [40007564481](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007564481), job 120599746894; deploy itself succeeded, then the smoke step failed because its grep expected obsolete wording that the current UI no longer uses. The workflow assertion now checks the UI's current narrower claim about a few exact NIKL-backed surface-form corrections. This change still needs exact PR-head CI and a fresh post-merge Pages + live Playwright smoke before deployment is marked verified.
- The earlier PR #265 was inspected, not blindly merged; its useful workflow assertion and blocker ledger were ported here. PR #266 already carries the #264 merge-state reconciliation, so these updates are integrated rather than duplicating or reverting it.
- Release status remains research preview / partial prototype. Do not promote it to release-ready until independent IPA and Ukrainian review, atomic normative coverage, item-level rights, source access, and live deployment smoke are evidenced.

## Corrected coverage and current-main checkpoint — 2026-10-23

Current main after PR #266: `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e`.

The earlier blocker note understated the existing article inventory. `tests/fixtures/standard-pronunciation-rule-coverage.json` contains all article numbers 1–30 in order; 29 are marked `verified` and Article 1 is `not-applicable`. The associated test `tests/standard-pronunciation-rule-coverage-gate.test.mjs` checks exact evidence anchors and test titles. Its declared meaning is finite normative-example coverage, not exhaustive coverage of every subparagraph, exception, productive environment or lexical/morphological context. Keep that distinction explicit in future reports.

The current `research/SOURCE-REGISTER.csv` contains 100 data rows. Exact item-level KOGL marks remain unverified for multiple NIKL records. The 20-case IPA queue remains 0/20 independently submitted in both reviewer slots. Independent Ukrainian target review remains separate and outstanding.

PR #266 merged the stale Pages smoke assertion fix and blocker ledger as `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e`. Post-merge Pages run [40009408019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40009408019) passed the Python 3.11/3.12/3.13 matrix, browser tests/build, public HTTP smoke for index/system/JS asset, and live Playwright practical-mode interaction. This closes the deployment smoke gate for commit `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e`; the live NIKL source inventory job remains skipped/blocked, not passed.

A follow-up Node test now checks that the workflow's expected UI phrase, practical-mode selector, and system-page title match the source HTML. Exact-head CI on this continuation is required before merging that test. No local commands were run in this API-only session.

### Post-merge deployment verification — 2026-10-23

The Pages workflow for main commit `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e` passed in [run 40009408019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40009408019). All three Python versions passed; browser regression/build passed; the deploy job's public HTTP smoke and live Playwright interaction smoke both passed. This verifies the public deployment path for that commit. It does not establish IPA correctness, Ukrainian target adequacy, or source licensing. The separate live NIKL inventory job was skipped/blocked.

