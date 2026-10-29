# Deterministic Hanja layer — implementation and evidence ledger (2026-10-29)

## Product contract

Hanja is an optional orthographic/lexical annotation, separate from pronunciation and translation. It must not feed the IPA or Ukrainian target adapter. Existing output logic is unchanged; Hanja is an additional result card.

The implementation is deliberately deterministic:
- no neural models, model weights, inference APIs, or remote runtime calls;
- a pinned build-time preparation script fetches only libhangul-derived Hanja data files, verifies both Git blob SHA-1 values, and emits a compact word-reading map sharded into 19 initial-consonant chunks;
- the browser lazily imports only the generated dictionary chunks matching the initial consonants present in the current input; the existing `connect-src 'none'` CSP remains unchanged because this is a script chunk, not a `fetch()` call;
- a deterministic ranker chooses one candidate per reading: gloss-bearing entries first, then the sum of per-character Hanja ranks from the single-character table, then stable source order; hand-reviewed project overrides take precedence;
- whole Hangul runs are converted only if they can be segmented into dictionary terms and explicit suffixes; otherwise the whole run is preserved.

This is a broad deterministic dictionary-backed preview, not a complete Korean morphological analyzer or contextual Hanja WSD engine. The ranker cannot infer sentence meaning, so homographs can still be wrong. Do not claim contextual word-sense disambiguation or perfect Korean coverage.

## Current implementation

- Engine: `src/app/hanja.js`; build-time dictionary preparation: `scripts/prepare-hanja-dictionary.mjs`.
- UI: `index.html`, `src/main.js`, `src/styles/main.css`; tests: `tests/hanja.test.mjs`, `tests/hanja-dictionary-build.test.mjs`, and `tests/hanja-ui-contract.test.mjs`.
- Data source is pinned to HanjaKey commit `4397d39106453bf4ee71b565dfb25e98eb71580f`, using only `hanja.txt` (Git blob `7cca2b4666ca19dcb10aaada52af89360c381659`) and `hanja_words.txt` (Git blob `07a9a7fc675c82628f4bacfeb22db679ce60866f`). Both retain the libhangul BSD 3-Clause attribution; the full notice is in `public/THIRD_PARTY_NOTICES.txt`.
- Build preparation generates a compact one-candidate-per-reading map, sharded into 19 initial-consonant chunks. The selected candidate follows a deterministic, inspectable ranking heuristic; the browser loads only the chunks represented in the current input from the same origin, not from a third-party API. `connect-src 'none'` remains unchanged.
- The 4.87 MB raw word inventory is not checked into the repository; exact upstream revision and Git blob hashes are pinned so development/build preparation is reproducible and rejects changed source bytes. `npm run dev` and `npm run build` invoke the preparer automatically. The NIKL-derived definition corpus (~20.16 MB, CC BY-SA 2.0 KR) and any LLM-generated ranking data are intentionally excluded.

## Deterministic behavior examples

| Input | Output | Interpretation |
|---|---|---|
| `정부는 경제 발전을 연구한다.` | `政府는 經濟 發展을 硏究한다.` | Known lexical spans annotated; particles/endings remain Hangul. |
| `대한민국의 문화와 역사` | `大韓民國의 文化와 歷史` | Known terms annotated; grammatical material preserved. |
| `컴퓨터와 서울` | `컴퓨터와 서울` | Unsupported/loanword/place-name spans are not guessed. |

These are unit-test fixtures for the curated dictionary, not claims of full linguistic analysis.

## Task ledger

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Choose a deterministic browser-compatible approach | DONE_VERIFIED (design) | Local longest-match dictionary, no model/API/dependency. |
| Implement dictionary-backed deterministic converter | PARTIAL | Pinned source data, Git-blob integrity checks, deterministic candidate ranker, lazy local runtime chunk, and fail-closed segmentation are implemented; exact-head build and generated-data counts/size still need CI verification. |
| Add fourth Hanja output without replacing existing results | PARTIAL | UI card and copy action are wired; DOM order is now explicitly RR → IPA → Ukrainian → Hanja, with an order regression assertion. Exact-head CI still required. |
| Preserve current CSP and no external runtime network | PARTIAL | Runtime has no fetch/XHR/WebSocket or external API; a same-origin dynamic JS chunk is lazy-loaded under `script-src 'self'`. Verify built asset paths and browser smoke in CI. Build/dev preparation does fetch two pinned upstream data files and validates their Git blob hashes. |
| Add deterministic regression tests | PARTIAL | Converter, UI-order, source-integrity/ranking fixtures added; exact-head CI is running. Local Node/build remain unavailable because direct GitHub network access from the connector session is blocked. |
| Evaluate coverage and error rate | TODO | Source-separated manually reviewed test set; report exact-match/span precision/recall, false-positive annotation rate, and abstention/coverage. |
| Add full morphological segmentation / contextual homograph disambiguation | DEFERRED | A dictionary-only implementation cannot reliably decide sense or morphology. Must not be simulated with invented rules. |
| Build reproducible broad dictionary input | PARTIAL | A pinned build-time fetcher now verifies both libhangul-derived source files by Git blob SHA-1 and emits a compact map. Acceptance: exact-head CI must verify hashes, entry count, build success, generated chunk size, and live lazy loading. Source rows are not committed to Git. |

## Candidate engines not selected for this browser implementation

- `hanja-wsd` is neural, so it does not meet the current deterministic requirement.
- `Kyubyong/h2h_converter` is a legacy neural/TensorFlow implementation, also out of scope.
- UTagger may offer deterministic morphology/WSD components, but exact artifact availability and licensing have not been verified.
- Hanjaro is a reference service, not a verified public API or redistribution license.
- Gukhanmun is primarily Hanja/mixed text → Hangul, the opposite direction.

These remain research references only; none is included as a runtime dependency. The selected deterministic dictionary data comes from the separate BSD-attributed libhangul files described above; no neural model or model-generated data is included.

## Verification and release gate

This change was authored through GitHub connector APIs; no local checkout or local Node runtime was available in this session. Therefore no local test/build result is claimed. Required checks:
1. `node --experimental-strip-types --test tests/*.test.mjs`
2. `npm run build`
3. inspect the built page and verify no new network requests and that the existing three output paths are unchanged;
4. browser smoke on the deployed Pages site after the PR is merged and deployment completes.

Do not call the feature release-ready until exact-head CI passes and a manual UI smoke confirms correct display and copy behavior. The current feature should be labelled a **limited dictionary preview** until a licensed, broad lexicon and a reviewed evaluation set exist.
