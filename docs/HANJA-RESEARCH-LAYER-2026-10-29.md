# Deterministic Hanja layer — implementation and evidence ledger (2026-10-29)

## Product contract

Hanja is an optional orthographic/lexical annotation, separate from pronunciation and translation. It must not feed the IPA or Ukrainian target adapter. Existing output logic is unchanged; Hanja is an additional result card.

The implementation is deliberately deterministic and browser-local:
- no neural models, model weights, API calls, remote scripts, or new runtime dependencies;
- a hand-curated, small lexical table and longest-match scan;
- preserve punctuation, whitespace, Latin/Cyrillic spans, and unknown Hangul characters;
- known lexical strings are annotated while particles/endings remain Hangul when not part of a table entry;
- unknown spans are retained, not guessed.

This is an initial dictionary-preview, not a complete Hanja converter or morphological analyzer. Longest-match scanning can incorrectly annotate a known substring inside an unknown compound or a homograph with a different sense. The UI states this limitation. Do not claim contextual word-sense disambiguation or full Korean coverage.

## Current implementation

- Engine: `src/app/hanja.js`
- UI: `index.html`, `src/main.js`, `src/styles/main.css`
- Tests: `tests/hanja.test.mjs`
- Runtime uses no network. The existing `connect-src 'none'` Content Security Policy remains intact.
- Initial curated entries cover common terms such as 韓國語, 經濟, 發展, 政府, 社會, 文化, 歷史, 政治, 學生, 學校, 大學, 科學, 技術, 情報, 國家, 世界, 時間, 問題, 方法, 結果, 硏究, 言語, and others. This is not claimed to be an exhaustive or frequency-ranked dictionary.
- The mapping table is manually authored for this prototype; no third-party dictionary file or model weights are bundled. Any future imported lexicon must have its source, revision, transformation, and license recorded before inclusion.
- A promising deterministic data source was reviewed: HanjaKey's `hanja_words.txt` is a ~4.87 MB word inventory derived from libhangul and identifies the per-file BSD 3-Clause provenance; its separate NIKL-derived `hanja_words_nikl.txt` is ~20.16 MB and CC BY-SA 2.0 KR. See [HanjaKey data provenance](https://github.com/SJY051/HanjaKey/blob/main/THIRD_PARTY_DATA.md) and [resource notes](https://github.com/SJY051/HanjaKey/blob/main/Sources/HanjaKitCore/Resources/README.md). Neither file is imported here: the connector cannot retrieve the large file contents for a pinned, byte-verified vendoring step, and a build-time download would introduce an avoidable external build dependency. This is a researched candidate, not integrated data.

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
| Implement first curated lexicon and converter | PARTIAL | Deterministic longest-valid-segmentation scanner and suffix inventory exist; unknown eojeol runs fail closed. Vocabulary remains intentionally small and needs source-attributed expansion. |
| Add fourth Hanja output without replacing existing results | PARTIAL | UI card and copy action are wired; DOM order is now explicitly RR → IPA → Ukrainian → Hanja, with an order regression assertion. Exact-head CI still required. |
| Preserve current CSP and no-network contract | PARTIAL | No network code added; verify source assertions and built artifact in CI. |
| Add deterministic regression tests | PARTIAL | Focused tests added; not yet executed in a local checkout during this connector-only session. |
| Evaluate coverage and error rate | TODO | Source-separated manually reviewed test set; report exact-match/span precision/recall, false-positive annotation rate, and abstention/coverage. |
| Add full morphological segmentation / contextual homograph disambiguation | DEFERRED | A dictionary-only implementation cannot reliably decide sense or morphology. Must not be simulated with invented rules. |
| Import a broad external Hanja lexicon | BLOCKED pending reproducible vendoring | HanjaKey/libhangul word inventory is a promising BSD-attributed source, but the large file could not be retrieved for byte-verified vendoring in this connector session. Acceptance: pin upstream commit, verify exact file hash and per-file notice, add a deterministic transformation/import script, measure compressed payload and coverage, and test the built static asset. NIKL-derived definitions are not needed for a first conversion dictionary and remain excluded. |

## Candidate engines not selected for this browser implementation

- `hanja-wsd` is neural, so it does not meet the current deterministic requirement.
- `Kyubyong/h2h_converter` is a legacy neural/TensorFlow implementation, also out of scope.
- UTagger may offer deterministic morphology/WSD components, but exact artifact availability and licensing have not been verified.
- Hanjaro is a reference service, not a verified public API or redistribution license.
- Gukhanmun is primarily Hanja/mixed text → Hangul, the opposite direction.

These remain research references only; none is included as a runtime dependency.

## Verification and release gate

This change was authored through GitHub connector APIs; no local checkout or local Node runtime was available in this session. Therefore no local test/build result is claimed. Required checks:
1. `node --experimental-strip-types --test tests/*.test.mjs`
2. `npm run build`
3. inspect the built page and verify no new network requests and that the existing three output paths are unchanged;
4. browser smoke on the deployed Pages site after the PR is merged and deployment completes.

Do not call the feature release-ready until exact-head CI passes and a manual UI smoke confirms correct display and copy behavior. The current feature should be labelled a **limited dictionary preview** until a licensed, broad lexicon and a reviewed evaluation set exist.
