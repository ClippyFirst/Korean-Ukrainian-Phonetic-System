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
- Reviewed substantive content exposed in official NIKL search-index results. qna_seq=330743 directly attests 밝게[발께] and 굵은[굴근]; lexical source URLs now match the reviewed source-register locator. qna_seq=334294 discusses 맑게[말께], 묽고[물꼬], 밝기[발끼] and the ㄺ-before-ㄱ exception, but the available answer text does not directly attest 읽고[일꼬] or 밝는[방는]. qna_seq=317229 directly attests 외곬에[외골쎄]. qna_seq=307508 supports the lexical ㄼ exception but its indexed spelling 넓둥굴다 differs from the corpus input 넓둥글다, so exact orthographic attestation remains unresolved.
- Corrected the source register to distinguish direct attestation from partial rule-context support. Removed the unsupported claim that Q&A 334294 directly confirms 읽고 and 밝는; their Korean targets remain rule-derived under §§11/18/23. No target, IPA, or Ukrainian output values changed.
- Added batch-18 evidence review and regression tests. The source-register count for `unverified_lexical_citation_inventory_2026-10-22` falls from 42 to 38. The batch-17 test now checks its historical report rather than freezing a live count that later batches must update.
- Evidence boundary: direct HTML retrieval remained unavailable; the review is bounded to substantive content visible in the official indexed results and does not claim complete HTTP retrieval. Item-level KOGL rights remain unverified. No broad-IPA gold or Ukrainian-target validation was added.
- Task ledger: `DONE_VERIFIED` — claim-scope correction, source URL normalization, historical-count regression repair, batch report and tests (pending exact-head CI at time of this checkpoint). `BLOCKED / rights` — item-level reuse markings. `TODO` — inspect remaining citation-only pages through authorized access and adjudicate claim-by-claim. `BLOCKED_SPECIALIST_ADJUDICATION` — independent broad IPA and Ukrainian-target review.
- Release disposition remains deployed research preview / partial prototype; no production transcription logic changed.
