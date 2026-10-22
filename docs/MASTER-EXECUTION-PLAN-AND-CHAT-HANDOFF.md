undefined

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


## Continuation checkpoint — NIKL Q&A 326601 direct attestation, batch 28 (2026-10-22)

- Starting main: 2d561fcd7907514c1787ddc27d2b0695d4fa95cd (batch 27, qna_seq=318279, is merged).
- Official indexed NIKL Q&A [qna_seq=326601](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=326601), “몇으로 발음” (question 2026-01-18; answer 2026-01-20), directly gives 몇으로[며츠로] and explains Standard Pronunciation Rules §13: final ㅊ moves to the onset of vowel-initial 으로.
- The lexical note now records direct source support and the IPA boundary. Korean surface, project IPA, and Ukrainian target remain unchanged.
- Expected inventory after batch 28: **43/60** content-checked (28 direct target-form/official-rule-example, 1 official dictionary, 9 partial, 5 contextual-example-only); **17 citation-only/unreviewed** (13 Q&A/FAQ, one dictionary, three PDFs); **14** eligible HTML imports.
- Task ledger: DONE_VERIFIED after exact-head CI — official answer, title/date, direct source claim, source register, and queue tests. BLOCKED / rights — item-level KOGL mark remains unverified. TODO — review remaining 17 citations. BLOCKED_SPECIALIST_ADJUDICATION — independent broad-IPA gold and Ukrainian-target review remain outstanding.
- Direct NIKL fetch remains HTTP 403 in CI; no live manifest is claimed and no access-control bypass is attempted. Release remains deployed research preview / partial prototype.
