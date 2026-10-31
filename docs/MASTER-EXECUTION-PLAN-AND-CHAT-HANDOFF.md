# Continuation — owner decisions: Ukrainian transliteration and dual-route service — 2026-10-31

## Confirmed product contract

The owner selected:
- Audience: both general users and specialists; concise presentation with full expert detail.
- Hanja: both Hangul→Hanja lexical annotation and Hanja→Hangul reading support.
- IPA: both surface phonetic IPA and phonemic representation.
- Dialect: standard South Korean (Seoul-based standard profile).
- Ukrainian output: **Ukrainian transliteration**, not a user-facing Ukrainian transcription product; preserve and improve the existing author-developed target system.
- Route coverage: show both IPA-mediated and RR-mediated Ukrainian transliteration.
- Detail: full provenance, trace and uncertainty.
- Adversarial inputs: project-generated Korean stress texts, clearly separated from normative NIKL evidence.

Terminology ruling: in this project, “Ukrainian transliteration” is the selected practical name for a Ukrainian-letter rendering guided by Korean pronunciation analysis and the existing project rules. It is not literal Hangul character replacement, translation, or the IPA itself. Do not relabel the public Ukrainian result as transcription.

## Implementation continuation

| Task | Status | Evidence / acceptance |
|---|---|---|
| Preserve the existing Ukrainian target | DONE_VERIFIED by source inspection; validation remains PARTIAL | The IPA-mediated route continues to use `src/app/engine_ipa.js` and generated IPA target data; the separate RR route continues to use `src/app/romanization_target.js`, `data/korean/rr_ukrainian_correspondence.csv`, and `data/korean/rr_ukrainian_context_rules.csv`. No third-party Ukrainian scheme was substituted. |
| Show both Ukrainian routes simultaneously | PARTIAL pending exact-head CI | Added a second Ukrainian result card; RR target is computed regardless of which route is selected as primary; both IPA and RR traces remain available; the secondary output has a separate copy control and explicit route/status note. Tests added in `tests/romanization-mode-ui.test.mjs`. |
| Correct user-facing terminology | PARTIAL pending exact-head CI | Updated service hero/footer, README, package description, service requirements, user guide and terminology contract to call the output Ukrainian transliteration and explain its two routes. |
| Surface phonetic and phonemic IPA | DONE_VERIFIED by source inspection; scientific scope remains PARTIAL | `result-ipa` is the selected engine's surface phonetic IPA; `result-ipa-phonemic` is an orthography-derived baseline from `renderPhonemicIpa`, not a separate G2P engine or fully morphology/prosody-resolved phonemic analysis. |
| Hanja in both directions | DONE_VERIFIED by existing implementation/tests; dictionary coverage PARTIAL | Existing local dictionary supports Hangul→Hanja lexical annotation and Hanja→Hangul reading workbench, preserves unknown spans and requires manual resolution of ambiguous readings. Coverage and ambiguity rates remain unevaluated. |
| Synthetic adversarial Korean text | DONE_VERIFIED as a generated fixture, not linguistic gold | Existing `tests/fixtures/adversarial-corpora/31-generated-mixed-phonology-prose-2026-10-31.txt` is explicitly labelled synthetic and not authoritative pronunciation gold. Reuse it; do not duplicate it or train/score from it without independent adjudication and held-out controls. |

**Rulings**
- Keep the existing primary IPA and RR adapters as separate, inspectable routes. The user's “both” means both outputs are visible together, not a replacement or a merged adapter.
- Keep the route selector only as a choice of which output is primary; it must not hide the second result or its trace.
- Keep the phonemic IPA field labelled as an orthography-derived baseline. Treating it as an independent phonemic G2P engine would overstate the evidence.
- Reuse the existing synthetic adversarial corpus instead of generating a near-duplicate; its provenance label and current corpus tests already match the request.

**Verification state at this handoff refresh**
- The static source-contract check against the pre-implementation baseline failed all eight expected dual-output assertions; after implementation, all eight corresponding static checks passed, required DOM IDs were present, and no duplicate IDs were found. This is a connector-side static inspection, not a substitute for the repository test suite.
- The exact-head GitHub Actions `tests` run [41242744214](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41242744214) and verification run [41242744232](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41242744232) were queued at the time of this update. No test/build pass is claimed.
- A local `git clone` attempt failed because this execution environment could not resolve `github.com`; local `npm test` and `npm run build` therefore remain unavailable. Continue to use exact-head CI as the acceptance gate.

**Remaining acceptance gates**
1. Exact-head Node tests, browser G2P integration, Vite build, Python tests and release checks must complete successfully.
2. Browser smoke must confirm both Ukrainian route cards update on the same input, the primary-route preference does not hide the alternate result, both traces are accessible, and copy controls copy the correct field.
3. Validate route-level uncertainty: IPA route must not expose provisional candidates as confirmed; RR route remains provisional pending independent Ukrainian-language review.
4. Hanja dictionary coverage and ambiguous-reading rates still need measurement; context-sensitive Hanja sense selection remains unsupported.
5. Independent Ukrainian reader/expert evaluation and a held-out comparison against the project's named Ukrainian transliteration comparators remain evidence-limited.

---

## Continuation — context-aware RR → Ukrainian phonetic adaptation — 2026-10-31

| Task | Status | Evidence / acceptance |
|---|---|---|
| Syllable-aware RR trace | PARTIAL pending exact-head CI | `src/app/romanization.js` decomposes each resolved Hangul syllable and records global word index, sentence-local word index, sentence index, syllable position, left/right context, onset class/origin, collision group and source-to-surface alignment; UI displays sentence, word and syllable indices plus the selected rule and any vowel collision. Right context is audit-only; current rule selection uses left coda class and word/sentence position. |
| Context-sensitive lenis mapping | PARTIAL / project proposal | `data/korean/rr_ukrainian_context_rules.csv` has 43 executable example-bearing rules and 28 alternative targets. Sixteen voiced-medial rules expose unvoiced alternatives; eight sentence-medial word-initial rules expose voiced alternatives because punctuation/spacing cannot identify the Korean accentual-phrase boundary. Unsupported post-obstruent lenis rules were removed; the unvoiced base mapping is the conservative fallback. |
| Context-sensitive ㅢ vowel adaptation | PARTIAL / NIKL-grounded Korean rule, Ukrainian mapping provisional | RR remains `ui`. NIKL Standard Pronunciation Rule 5 requires [i] for a consonantal onset; null-onset initial ㅢ keeps [ɰi], while [i] is an allowed noninitial variant. The `협의 [혀븨/혀비]` pair is represented with [ɰi] as default and [i] as an alternative. The adapter receives both source spelling and G2P surface form; only unambiguous simple-coda transfers are classified automatically. Complex codas and ㅎ-conditioned changes remain explicitly ambiguous. The possessive-particle [e] variant still requires morphology and is not guessed. |
| Phonemic aspiration and Ukrainian phonetic choices | PARTIAL / project conventions implemented | Aspirated onsets ㅋ/ㅌ/ㅍ/ㅊ map to к'/т'/п'/ч'. Lenis and fortis do not receive the aspiration apostrophe. ㅎ→г is a project approximation; fortis doubling is a visible tension marker, not a claim of gemination. Independent Ukrainian phonetic review remains required. |
| RR ㄹㄹ edge case | DONE_VERIFIED in implementation/tests; exact-head CI pending | RR onset `l` after a liquid coda has a Ukrainian `л` mapping; test covers `별래 → byeollae → пйолле`. |
| Sentence-position context | PARTIAL | Sentence-local word order resets at sentence punctuation. Sentence-initial and sentence-medial word-initial lenis contexts have separate rules; sentence-medial cases expose a voiced alternative. Punctuation does not infer an accentual-phrase boundary. |
| CSV/rule integrity | PARTIAL pending exact-head CI | RR CSV parsing supports quoted commas and rejects malformed field counts, duplicate/missing context rule IDs; more-specific context rules take precedence. Every rule example is tested against its declared context and selected adapter mapping. |
| Independent Ukrainian phonetic validation | BLOCKED / EVIDENCE-LIMITED | Requires expert review and reader testing; Ukrainian positional correspondences and practical orthographic choices remain project proposals. |
| Claim of superiority over Kholodovich–Konzevich | BLOCKED pending comparative evaluation | The design exposes more context, preserves the aspiration distinction and makes uncertain variants inspectable; no held-out comparative corpus or blinded reader study yet proves higher quality. |

**Starting point:** `main` at `5cec9deb4a8d622cd5f0ba969a2fd49b17281f43`.  
**Clean review branch:** `feat/korean-rr-contextual-phonetics-final`, created directly from that main commit and reconstructed from the final 16-file diff in 16 file-level commits, followed by documentation-only reconciliation updates (no force-push). The earlier 71-commit scratch branch `feat/korean-rr-contextual-phonetics-clean` is preserved but is not the review branch.  
**Review PR:** [#411](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/411), draft/open. Review branch head before this handoff refresh: `d17e2c698418f12b692631414afecf8fe55fa429`. PRs [#410](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/410) and [#409](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/409) were closed unmerged as superseded; their source branches are preserved. PR #371 is a separate benchmark workstream and remains untouched.

**Verification history:** The earlier run on commit `5ed9324271b753161cce28647d0285a97b9df7fb` had 1 failure out of 1,355 tests; Python 3.12/3.13 jobs passed, but that run is not a final pass. Subsequent work fixed the feature label and expanded the ㅢ/context tests. The current continuation adds executable validation of all 43 context-rule examples (source spelling → surface Hangul → RR → selected rule), 28 alternatives, sentence-local word indexing, left/right context metadata, five explicit vowel collision groups, quoted-comma CSV parsing, malformed-row and duplicate-ID rejection, specific-rule precedence, source-to-surface simple-coda resyllabification and conservative complex-coda fallback. **The latest exact-head tests/builds have not yet been verified in CI in this connector session; no pass is claimed.** Local test/build execution is unavailable in this connector-only session. GitHub Actions on the latest PR #411 head remains the acceptance gate.

**Research basis:** NIKL's [RR specification](https://www.korean.go.kr/front_eng/roman/roman_01.do) grounds the Korean-side RR values. NIKL's [Standard Pronunciation Rule 5](https://www.korean.go.kr/front/page/pageView.do?page_id=P000098) grounds ㅢ [i]/[ɰi] conditions and explicitly lists 협의 [혀븨/혀비]. The Russian H-K/Koncevich comparison is cross-checked against [Rud (2024)](https://ir.library.knu.ua/entities/publication/bdb2f408-ca5b-4fdc-879a-95240572e08a) and a [2025 KNU comparative study](https://ir.library.knu.ua/bitstreams/d1e9eddb-9bcb-4c86-8e39-d5e2f11c9570/download). Prosodic variation in lenis/aspirated cues is documented by [Choi, Kim & Cho (2020)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7580931/). Korean phonetics sources describe the lenis/fortis/aspirated contrast ([Song, Kim & Cho, 2023](https://biz.hanyang.ac.kr/documents/10980062/13049795/HISPhonCog2023_P76_Song_etal.pdf/f52b4285-3aee-1657-3383-d266ffff55d0); [Kim et al., 2024](https://doi.org/10.13064/ksss.2024.16.1.017)). These sources support Korean-side distinctions, not the chosen Ukrainian graphemes. The Ukrainian apostrophe is a project notation for phonemic aspiration, not an official Ukrainian Korean-transcription rule.

**Evidence boundary:** exhaustive syllable coverage and executable rule examples demonstrate software coverage and trace consistency, not linguistic correctness. No claim of superiority over Kholodovich–Konzevich, expert validation or independent Ukrainian target gold is made.

---

## Continuation — RR-mediated Ukrainian output — 2026-10-31

| Task | Status | Evidence / acceptance |
|---|---|---|
| Distinct RR → Ukrainian service mode | DONE_VERIFIED on code-bearing head; latest docs-only head pending CI | New UI option uses Korean surface form → Revised Romanization → Ukrainian correspondence; it does not replace the IPA-first Kozak Kim route. Dedicated RR trace is shown while the IPA target trace is hidden. |
| Machine-readable RR → Ukrainian correspondence register | PARTIAL pending independent linguistic review | `data/korean/rr_ukrainian_correspondence.csv` records 20 onset RR units (19 Hangul onset Jamo; ㄹ has r/l variants), 21 vowel and 27 coda units with status and notes; all 11,172 modern precomposed syllables are exercised by a test. |
| Full methodology tables and evidence boundary | DONE_VERIFIED on code-bearing head; latest docs-only head pending CI | Public methodology distinguishes NIKL's official RR source from project-authored Ukrainian approximations; includes component tables, whole-syllable examples, explicit target collisions, and a source-grounded H-K comparison; no official Ukrainian standard is claimed. |
| Independent linguistic validation | BLOCKED / EVIDENCE-LIMITED | Requires independent Ukrainian-language reader study, expert review, and held-out error analysis. |
| Python CLI/API RR mode | DEFERRED | User request implemented as a browser response mode; Python package, CLI and optional API remain on their existing IPA-first contract. |

Historical first RR implementation branch: `feat/korean-rr-ukrainian-mode`; PR [#407](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/407) was closed as superseded. Current review is PR [#409](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/409) on `feat/korean-rr-contextual-phonetics-clean`; earlier branches are preserved. Starting main SHA: `5cec9deb4a8d622cd5f0ba969a2fd49b17281f43`. Code-bearing head `6fa554c9980969ba346a7421501e8b453a2b6816`: GitHub Actions run 41230139392 passed `npm test` (1,349/1,349) and `npm run build`; run 41230139366 passed browser regression/build and Python regression. Later commits through `32a1131d656bdb002c5c619180af72b25e1b3554` changed documentation, methodology tables and stylesheet cache-busting only; no application logic changed after the code-bearing head. Exact-head CI for the documentation-only tip was queued at last inspection. Initial failures were fixed: Node tests now load the CSV through the factory, the new trace DOM IDs are present, and UI contract tests accept identified disclosure panels. Local execution was unavailable in this connector-only session.

Primary RR source: NIKL, [Romanization of Korean](https://www.korean.go.kr/front_eng/roman/roman_01.do). Ukrainian evidence context: Rud, V. (2024), [Особливості транслітерації корейських власних назв українською мовою](https://ir.library.knu.ua/entities/publication/bdb2f408-ca5b-4fdc-879a-95240572e08a). The Ukrainian mappings are project decisions requiring validation, not facts asserted by those sources.

---

# Full benchmark integration, methodology evidence and readiness — 2026-10-31

**Starting main for this continuation:** `f0bd109a294fff9eca9037023653c5765eb17225`  
**Current main after completed integration:** `ca6133890139f76c88253b2b1d0bbc3a6191601a`  
**Working state:** all listed PRs merged; no uncommitted local checkout was available. GitHub branches/PRs and workflow evidence were inspected through the repository connector.

## Current task ledger

| Task | Status | Evidence / acceptance |
|---|---|---|
| Per-engine occurrence ledger | **DONE_VERIFIED** | PR [#399](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/399) added schema v1; PR [#401](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/401) expanded it to 10 engines on both datasets. Latest artifact `13019822857` has 10 × 2,703 UGTPHON and 10 × 999 SIGMORPHON records (37,020 rows); ordering, source identity, and aggregate recomputation passed. |
| Corrected extended benchmark scoring, PER/PFER and p95 | **DONE_VERIFIED as diagnostic implementation** | PR #401 merged as `eb8e1f100e8aca377aef05a2aa896756c909ec5c`. Run [41141286672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286672) PASS; nearest-rank p95, per-metric IPA gold selection, coverage/abstentions, ordered ledgers and artifact checks are integrated. |
| Public and technical methodology figures | **DONE_VERIFIED** | PRs [#402](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/402) and [#404](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/404) refreshed benchmark figures and corrected SIGMORPHON native exact rate to 35.7715% (357/998). PR [#403](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/403) refreshed CI disclosure. |
| Claim-to-evidence register and methodology review record | **DONE_VERIFIED** | PR [#405](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/405) added the current claim register and structured review/adjudication record, linked from README and methodology. The record explicitly does not claim independent human review. |
| Current main software CI/build/deployment | **DONE_VERIFIED** | Main `ca6133890139f76c88253b2b1d0bbc3a6191601a`: system [41144925083](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41144925083), tests [41144925101](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41144925101), artifacts [41144925095](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41144925095), Pages/live smoke [41144925073](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41144925073): all PASS. Browser tests: **1,341/1,341**. Python 3.11/3.12/3.13, web tests/build, clean wheel install, teacher-corpus audit, strict corpus generation, Pages deploy, HTTP smoke and live Playwright practical-mode smoke passed. NIKL metadata-only inventory was **SKIPPED**. |
| Fresh CharsiuG2P/ByT5 inference and joined neural comparison | **PARTIAL / SKIPPED** | The latest corrected benchmark run skipped Charsiu, ByT5 and paired neural jobs under the default-off research opt-in. No fresh neural-vs-baseline result is claimed. |
| Independent Korean IPA gold and Ukrainian target gold | **BLOCKED / EVIDENCE-LIMITED** | No representative independent Korean IPA holdout with specialist adjudication and no independent Ukrainian target gold/user study. |
| Two independent Korean phonetics reviewers | **BLOCKED** | Issue [#337](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/issues/337) remains open with no qualified submissions. Potential leads identified but not contacted: [Yoonjung Kang](https://www.linguistics.utoronto.ca/people/directories/all-faculty/yoonjung-kang), [Taehong Cho](https://site.hanyang.ac.kr/web/hipcs/faculty), and [Seongyeon Ko](https://www.qc.cuny.edu/academics/cmalc/seongyeon-ko/). Availability and conflicts of interest are not checked. |
| Charsiu training overlap/weights rights and KoG2Padvanced license | **BLOCKED / EVIDENCE-LIMITED** | Charsiu overlap risk is known (508 UGTPHON and 729/999 SIGMORPHON forms in the available public training file); full checkpoint manifest and explicit weights license are missing. KoG2Padvanced upstream license is undeclared. |
| Python CLI/API parity for Super-soft | **DEFERRED** | Remains outside the verified browser/runtime scope; do not imply parity. |

## Reconciliation decisions

- PR #399 merged the baseline ledger producer; PR #401 selectively ported the useful corrected benchmark work from PR #371 and merged it. PR #401 is not a wholesale merge of the divergent #371 branch.
- PRs #402–#404 updated public/technical metric disclosures, current CI evidence and exact-rate rounding.
- PR #405 selectively ported the claim/evidence register and review record from PR #398. PR #398 was then **closed as superseded**; its source branch was preserved and not deleted.
- PR #371 remains open and divergent (117 commits ahead / 33 behind current main at latest compare). Its useful metric/workflow corrections are in main through #401; remaining branch changes are not accepted wholesale.
- No external model weights/caches were redistributed, no production settings changed, no release was published, and no user branch was deleted.

## Commands and verification actually executed

- Inspected default branch, PRs #371/#398/#399/#400–#405, commits, changed files, branch comparisons, workflow runs/jobs, logs, artifact metadata and canonical docs through GitHub repository tools.
- Downloaded artifacts `13018218724` and `13019822857`; used Python `zipfile` and `json` to validate 10 ordered ledgers per dataset, occurrence ID ranges, cross-engine source identity triples, scored/exact aggregate recomputation, and metric equality between artifacts.
- Recomputed exact-rate rounding from counts: SIGMORPHON native 357/998 = 35.7715%. Compared all aggregate metrics between the two artifacts; no metric counts changed.
- Verified exact-head and post-merge GitHub Actions runs linked above. No local `pytest`, `npm test`, Vite build, or shell command is claimed; those were executed by GitHub Actions, not a local checkout.
- The methodology contract test now guards the current 1,341 browser-test count, corrected benchmark figures, evidence register, and review boundaries.

## Readiness and next genuine blockers

The deployed software/service and its declared CI/build gates are green. The project is **not research-certified** as a fully accurate Korean-to-Ukrainian pronunciation standard; it remains a technically mature research prototype until independent Korean IPA and Ukrainian target gold exist.

Next work should focus on the two blind specialist reviews in issue #337 (one assigned packet per reviewer; no source/engine hints before both first-pass submissions are frozen), then a separate Ukrainian-target review. In parallel, resolve the Charsiu checkpoint license/training manifest and KoG2Padvanced license. Only after legal/evidence gates are satisfied should the opt-in neural inference and paired comparison be dispatched.

---

# Continuation — full public methodology and engine separation (2026-10-30)

| Task | Status | Acceptance evidence |
|---|---|---|
| Document the actual browser engine split | DONE_VERIFIED (documentation pending CI) | Ordinary mode selects the vendored g2pK JavaScript port through `createG2pWebAdapter`; detailed analysis selects the in-repository deterministic engine. |
| Document the three Kozak Kim modes | DONE_VERIFIED (documentation pending CI) | `strict`, `soft`, and `super-soft` are the actual `morphologyMode` values; soft is opt-in and super-soft is an explicit maximum-coverage branch. |
| Document current tests and benchmark limits | DONE_VERIFIED (documentation pending CI) | Main commit `f8dc58e84810179780a580ad3a93d0719e85c957`: 1,335 browser tests passed, Vite build passed, Python 3.11–3.13 passed, corpus artifacts and Pages deploy passed; NIKL metadata-only crawl skipped. Benchmark outcomes are mixed across UGTPHON and SIGMORPHON; no universal winner is claimed. |
| Document RR and Hanja as independent display layers | DONE_VERIFIED (documentation pending CI) | RR is generated from resolved Hangul surface; Hanja is a deterministic dictionary annotation and never feeds IPA/UA. Hanja dataset: 184,079 readings / 19 lazy chunks. |
| Independently validate Ukrainian target quality | BLOCKED | No independently adjudicated IPA→Ukrainian gold corpus or reader study; do not claim validated Ukrainian accuracy until one exists. |
| Establish universal Korean IPA accuracy | BLOCKED | No independent NIKL adjudicated holdout; noisy UGTPHON and SIGMORPHON conventions are diagnostic only. |

This continuation records a public-facing methodology update. It does not alter pronunciation rules, lexical records, generated linguistic data, or benchmark scores. Re-run current-head CI before marking the documentation changes as release-verified.

---

# Continuation — deterministic Hanja browser preview (2026-10-29)

| Task | Status | Acceptance evidence |
|---|---|---|
| Deterministic dictionary engine | DONE_VERIFIED (software integration) | Pinned libhangul-derived data; both Git blob hashes verified; 184,079 word readings across 19 lazy chunks. |
| Fourth output card and copy action | DONE_VERIFIED | Output order RR → IPA → Ukrainian → Hanja; UI contract and deployed live-browser smoke pass. |
| Preserve existing pipeline and CSP | DONE_VERIFIED | No neural model or external runtime API; same-origin lazy JS chunks; existing CSP remains unchanged; live output verified. |
| Build and regression verification | DONE_VERIFIED | 1,316 browser tests passed; Python 3.11/3.12/3.13, strict corpus validation, system checks, build, and deployment smoke passed. |
| Evaluate coverage and error rate | TODO | Needs an independently adjudicated, source-separated Hanja gold set and published metrics. |
| Contextual homograph disambiguation / full morphology | DEFERRED | The selected engine is deterministic and context-insensitive; do not guess unsupported senses. |
| Overall linguistic release readiness | PARTIAL | Software integration is live; Hanja accuracy/coverage has not been independently benchmarked. |

## Implementation contract

- Merge commit: f483708e5d0aa1324ee70b54aaf50eaf9376b31e; [PR #374](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/374).
- No neural model, external runtime API, remote runtime script, or new runtime dependency. Development/build preparation fetches two pinned data files and verifies Git blob SHA-1; the deployed browser makes no external runtime network calls.
- Data: HanjaKey commit 4397d39106453bf4ee71b565dfb25e98eb71580f; 184,079 word readings, 555 single-syllable readings used for deterministic ranking, 19 initial-consonant chunks, 4,067,901 generated bytes total.
- Candidate selection is deterministic (gloss-bearing entries first, then summed single-character source ranks, then source order), with reviewed project overrides. Unknown Hangul runs are preserved unless fully segmentable into dictionary terms and listed suffixes.
- Hanja is an orthographic annotation only; it must not alter the existing Romanization → IPA → Ukrainian outputs. Homographs can still be wrong because there is no contextual WSD.
- Canonical detail: [Hanja implementation/evidence ledger](HANJA-RESEARCH-LAYER-2026-10-29.md).

## Verification evidence

- CI on implementation head bc653b619e03aaea603b18e88617c498a8826e53: [tests 40959299673](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40959299673), [system verification 40959299802](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40959299802), [browser integration/build 40959299763](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40959299763), [master artifacts 40959300709](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40959300709), and [test-case register extraction 40959300490](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40959300490) passed.
- npm test: 1,316 passed, 0 failed. Build verified source hashes and emitted the 19 dictionary chunks.
- Deployment and live smoke: [Pages run 40959550037](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40959550037) passed. The live browser confirmed 정부는 경제 발전을 연구한다. → 政府는 經濟 發展을 硏究한다., plus existing UX regressions.
- Local Node/build execution was unavailable in this connector-only session; all test claims above refer to the cited GitHub Actions runs.

## Remaining blocker

Create and manually adjudicate a held-out Hanja corpus, then measure exact-match, span precision/recall/F1, false-conversion rate, abstention/coverage, and payload/latency. The current feature is deployed and software-verified, but remains a deterministic dictionary preview—not a context-aware converter or linguistically release-validated system.

---

# Continuation — Korean aspiration and fortis output convention (2026-10-29)

| Task | Status | Acceptance evidence |
|---|---|---|
| Aspiration apostrophe | PARTIAL | Canonical IPA mappings, sequence override, and focused Python/browser tests updated; exact-head CI not yet run. |
| Fortis doubling | PARTIAL | Five fortis IPA mappings now retain doubled Ukrainian graphemes; focused Python/browser tests added; exact-head CI not yet run. |
| Generated artifact parity | BLOCKED pending verification | Browser artifact mirrors the intended rows; generator check must pass. |
| Full release readiness | NOT READY | Independent IPA adjudication, target review, benchmark, and release gates remain open. |

## Change contract

- /kʰ/ → к', /tʰ/ → т', /pʰ/ → п', /tɕʰ/ → ч'.
- /k͈/ → кк, /t͈/ → тт, /p͈/ → пп, /s͈/ → сс, /tɕ͈/ → чч.
- /kʰjʌ/ → к'йо.
- IPA remains the sole target-adapter input. No direct Hangul-to-Ukrainian substitutions were introduced.

## Verification status

- Inspected default branch at `716b32df7b52e84849cc2e9926868942857d48bb`.
- Local tests/build were not executed in this connector-only session.
- Required checks: `npm run check:ipa-target-data`, `npm test`, `npm run build`, and `pytest tests/test_ipa_target_renderer.py`.
- Do not mark DONE_VERIFIED or release-ready until exact-head CI passes.

---

# Final execution checkpoint — 2026-10-27

## Branch and commit ledger

- **Workstream:** existing dedicated branch `research/strict-teacher-guided-rule-mining-2026-10-26`, PR [#339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/339), base `main`. The PR remains open and draft; no merge or release action was taken.
- **Starting branch head for this execution batch:** `286e5cd7f6ee9785f55c5a38a2667e2e2f8038c6`.
- **Implementation/test head before this final handoff update:** `49115cf4c8d69b98292eb7f524253fbf97022c41`.
- This handoff update is documentation-only; its own commit becomes the new branch head. The implementation head above identifies the exact code/test state currently awaiting CI.

## Outcome ledger

| Work item | Status | Evidence / acceptance still required |
|---|---|---|
| R016 exact-form production coverage | **PARTIAL** | Python and browser license registries add `맑게` → `말께`, `맑고` → `말꼬`; positive tests and `닭고기` negative control added; NIKL Q&A 320900/335693 registered. Exact-head runtime CI still pending. |
| Neural-teacher-guided narrow IPA | **PARTIAL** | Python narrow profile v2 adds onset ㄴ → [ɲ] before ㅑ/ㅒ/ㅕ/ㅖ/ㅛ/ㅠ only; profile metadata version is 2, tests cover positive and negative controls, broad IPA is unchanged. Dev-artifact counterfactual suggests improvement, but post-change benchmark and independent adjudication are pending. |
| Teacher disagreement → general production rules | **PARTIAL / EVIDENCE-LIMITED** | Charsiu artifact was inspected. Most high-frequency differences involve aspiration, lateral realization, /h/ variants, and IPA convention. Model training overlap is unknown; do not promote these differences automatically. |
| Ukrainian target adapter approval | **BLOCKED** | Narrow profile remains partial/research-only and target-incompatible; compatible-profile allowlist remains empty. |
| Full release readiness | **NOT READY** | Exact-head tests/build and benchmark rerun have not completed; independent IPA adjudication, target-inventory review, source/rights gates remain open. |

## Commands and checks actually executed

- `git ls-remote https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System.git HEAD` — **BLOCKED**, local DNS/network could not resolve GitHub; no local clean checkout was available.
- `unzip -l /mnt/data/charsiu-review.zip` — **PASS**, inspected artifact contents.
- `python /tmp/analyze_teacher.py` — **PASS as an exploratory artifact analysis**, not a repository test. It computed dev-only mismatch clusters using the benchmark's declared diagnostic normalizer.
- `python /tmp/counterfactual_nasal_j.py` — **PASS as a counterfactual simulation**, not a runtime test. It estimated dev-only exact-match/CER changes for the scoped nasal-glide mapping.
- GitHub content integrity checks — **PASS** for the four newly registered source rows having 12 CSV columns; current profile ID/version references agreeing across runtime and tests; R016 entries present in Python and browser; and regression/negative-control assertions present.
- Python pytest, Node browser tests, wheel-install checks, post-change Charsiu benchmark, and exact-head system verification — **NOT YET RUN TO COMPLETION**. On code head `49115cf4c8d69b98292eb7f524253fbf97022c41`, relevant Actions runs are queued: tests [40561248714](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40561248714), system verification [40561248790](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40561248790), Charsiu review [40561249001](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40561249001), and the remaining branch workflows. The official NIKL source inventory is skipped by workflow policy and is **not** a pass.

## Next genuine blockers

1. Wait for exact-head Actions; fix any test or build failures and rerun on the resulting code head.
2. Rerun the pinned Charsiu narrow-profile benchmark after the [ɲ] code change; compare exact match, CER, coverage, and per-case regressions on the same dev partitions. Keep results labelled development-only.
3. Independently adjudicate IPA conventions and the nasal-glide realization before considering a target-compatible profile.
4. Continue mining candidate clusters only where a repeated context can be tied to a source-backed phonological condition and negative controls; keep unresolved IPA conventions out of production broad IPA.
5. Complete the independent Ukrainian target-inventory review, KOGL/source-rights checks, and remaining acceptance gates before any release claim.

# Latest continuation — teacher-guided narrow IPA improvement (2026-10-27)

- **Implemented:** extended the opt-in Python narrow IPA profile with onset ㄴ → [ɲ] before glide-initial nuclei ㅑ/ㅒ/ㅕ/ㅖ/ㅛ/ㅠ. It deliberately does not apply before ㅣ. Broad IPA, browser runtime, and Ukrainian target adaptation remain unchanged.
- **Profile contract:** versioned the narrow profile as `korean-narrow-partial-sibilant-nasal-v2`; it remains partial/research-only and target-incompatible.
- **Teacher evidence:** inspected Charsiu train/dev artifact [12756518697](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40554419963/artifacts/12756518697), ZIP SHA-256 `b1d2d601f02b5554bea85dc65b8ff9bdacd92bcbead3889701808df8b88d445c`. The dev-only counterfactual changed 9 SIGMORPHON rows and 27 UGTPHON rows; exact match changed 431→438/999 and 1193→1214/1800, with CER 0.11348→0.11225 and 0.06034→0.05830. These are **simulation results before the code change**, not a post-change benchmark or held-out scores. The teacher's training overlap remains UNKNOWN.
- **Evidence and controls:** Ahn (2009) and the UCL thesis literature review are recorded in the source register. Tests cover positive cases 녀/냐/뉴, negative controls 니/난, and unchanged broad IPA. A broader mapping that also covered ㅣ degraded both dev datasets and was rejected.
- **Remaining verification:** exact-head CI is not currently available through the connected GitHub workflow query; local clone/test is blocked by DNS failure for `github.com`. Rerun Python tests and the pinned narrow-profile benchmark on the exact code head before marking DONE_VERIFIED. Do not enable Ukrainian target adaptation from this research profile.

# Latest continuation — source-backed R016 engine improvement (2026-10-27)

- **Implemented:** extended the existing deterministic R016 exact-form registry in Python and browser JavaScript with `맑게` (`맑>게`) and `맑고` (`맑>고`). Expected Korean surface outputs are `말께` and `말꼬`.
- **Evidence:** NIKL Standard Pronunciation Rule 11; official Q&A [qna_seq=320900](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=320900) explicitly confirms both forms, while [qna_seq=335693](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=335693) clarifies the written ㄺ-before-ㄱ condition. Both sources are now in `research/SOURCE-REGISTER.csv`.
- **Tests added:** Python R016 regression cases and browser runtime cases; the browser test asserts the final `surfaceHangul` outputs and retains `닭고기` as a negative control. The rule remains exact-form licensed; no blanket ㄺ+ㄱ rewrite was introduced.
- **Scope:** this is a real source-backed coverage repair in the production deterministic rule path, not a claim that the neural model discovered a new general rule. No neural runtime, IPA renderer, Ukrainian adapter, or target mapping changed.
- **Task ledger:** implementation = implemented; source records = added; Python/browser tests = added but awaiting exact-head CI; full teacher-disagreement-to-rule pipeline = still PARTIAL because corpus IPA conventions and candidate-level independent adjudication remain unresolved.
- **Verification caveat:** the local environment previously could not resolve GitHub, so do not claim local tests. Check the final PR-head CI and the exact commit before promoting this batch to DONE_VERIFIED.

# Continuation — neural-teacher-guided deterministic Strict improvement (2026-10-26)

# Latest continuation — browser IPA serialization regression (2026-10-27)

- **Implemented:** reconciled affected browser regression assertions with the engine's existing IPA display contract: `.` separates syllables within a Korean eojeol and source whitespace separates eojeol. The tests use the test-only `tests/render-expected-ipa.mjs` serializer where appropriate; raw source-data serialization checks remain separate.
- **Scope guard:** no production engine, Korean pronunciation rule, IPA segment sequence, lexical evidence, or Ukrainian adaptation was changed. This is test-oracle/serialization repair only.
- **Exact-head verification:** commit [4019e233c2a07cbb2d4679ad85fd77a56a307af4](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/4019e233c2a07cbb2d4679ad85fd77a56a307af4) passed system verification [40408709236](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709236): browser regression tests/build PASS; Python regression/data integrity PASS; official NIKL source inventory was skipped by workflow policy (metadata-only gate). The exhaustive test-case register extraction workflow [40408709171](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709171) also passed.
- **Historical failure and repair:** the earlier browser run had 1,213 passing and 39 failing reported subtests. The failures exposed stale expected separator formatting, assertions hidden after earlier failures, and one regex-escaping issue in the long-passage test. These were corrected without changing runtime behavior; the exact-head run above is green.
- **Remaining status:** the master case inventory is still PARTIAL; passing register generation is not proof that every assertion, observed result, linguistic adjudication, or Ukrainian target has been captured. Independent IPA adjudication and target adaptation review remain blocked on qualified human review. See issue [#337](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/issues/337) for the blind-review gate.
- **Local verification limitation:** this environment cannot resolve `github.com`, so a local clean checkout/test run was unavailable. Exact-head GitHub Actions is the verification evidence; do not claim local execution.
- **Latest inventory artifact:** [workflow 40412848533](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40412848533), artifact [12693823324](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40412848533/artifacts/12693823324), extraction step PASS on workflow-reported commit `c34aff61299dad547788eaab12112cac7b418762`. Counts: 644 lexical records; 359 test files / 387 source files scanned; 6,801 lexical-test links; 50,768 Hangul-literal candidates; 34,573 exact source lines preserved; 5,241 assertion candidates. All five CSVs passed stable-ID uniqueness checks; artifact ZIP SHA-256: `584f9bb98650caa12ba8753b6b7e42fc625e7c244daaf8cd981cb0623aea1443`.
- **Interpretation:** this is a reproducible loss-preserving source inventory, not a semantically complete case-level register. The 5,241 assertion candidates still need classification and observed-result joins; 50,768 Hangul spans are not 50,768 distinct pronunciation cases.
- **Next:** classify assertion candidates into expected-only, observed pass/fail, serialization-only, unresolved-by-design and review-required cases, preserving repeated provenance. Reconcile JSON fixtures and historical CI artifacts. Do not promote any pronunciation rule from separator-only test repairs.


## Latest continuation — typed IPA annotation boundary (2026-10-26)

- Added `scripts/packetize_korean_ipa_annotations.py` and focused tests. It creates lossless, typed packets for SIGMORPHON tokenized IPA and UGTPHON compact token annotations, records explicit boundary/stress/length markers, preserves raw target strings and rejects test/holdout partitions.
- The packets explicitly use `SOURCE_TYPED_NOT_MAPPED`; they do **not** claim that Unicode clusters are phonemes, map either corpus to ClippyFirst broad IPA, or produce Ukrainian output.
- The teacher-corpus workflow now tests the packetizer, runs it against both corpora's train/dev partitions, and uploads separate typed packets as artifacts.
- **Status:** the executable typed boundary is implemented; the actual IPA conversion remains blocked on primary-source convention review and independent adjudication of shared-form differences. No production rule or runtime behavior changed.
- **Final exact-head verification:** commit `9fadae60373f3feac79098be7a37bdd49e2d7085` passed all five workflows: tests [40299764757](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40299764757), system verification [40299764812](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40299764812), corpus audit/packetizer [40299764709](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40299764709), scratch teacher + dev error analysis [40299764689](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40299764689), and master artifacts [40299764695](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40299764695). Local clone/test execution was unavailable because this environment could not resolve `github.com`; exact-head CI supplied verification. Artifacts: corpus bundle [12638789799](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40299764709/artifacts/12638789799) and scratch teacher/error analysis [12639333712](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40299764689/artifacts/12639333712).
- Next engine-facing step: document exact source-specific segment inventories and build a reviewed, feature-preserving mapping table with explicit loss accounting and an unmapped state. Only then evaluate whether any deterministic phonological rule can be promoted.



## Latest continuation — source-only train/dev corpus preparation (2026-10-26)


## Latest continuation — two-source corpus builders (2026-10-26)


### Cross-corpus compatibility audit added

- New script: scripts/audit_korean_corpus_compatibility.py. It verifies generated JSONL output hashes against each manifest, validates split labels and counts, then reports source-form intersections for SIGMORPHON train/dev against UGTPHON train/dev. It removes only SIGMORPHON's whitespace phone-token separators for a second target-string comparison; it does not map symbols or infer syllable boundaries, and the result is not asserted equivalent to ClippyFirst broad IPA.
- The audit deliberately does not merge the corpora or run training. It marks target compatibility UNVERIFIED because the two datasets' IPA conventions have not yet been normalized through a reviewed adapter.
- Added unit tests for hash mismatch rejection, split-count validation, cross-source form overlap, and non-merging behavior. Integrated the report into the same CI artifact.
- **Verification state:** DONE_VERIFIED on exact-head workflow [40297304221](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40297304221); both builders, compatibility audit, and artifact upload succeeded. The earlier failure caused by the missing common output_row_count field and outdated test fixture was fixed and rerun successfully.
- Expected output artifact contains the metadata-only split audit, compatibility report, and separate train/dev JSONL/manifests for both corpora. The artifacts expire under GitHub's normal artifact retention, so regenerate with the documented scripts when needed.


- **Current work:** alongside the pinned SIGMORPHON word-level train/dev builder, added scripts/prepare_ugtphon_korean_corpus.py after inspecting the pinned upstream README's explicit token schema. It uses token-level phoneme labels, not the sentence-level phonemes field, because the upstream docs state those are not always a literal token join.
- **UGTPHON selection is deliberately conservative:** include only is_nc=false tokens whose surface exactly matches canonical, have a single-token canonical form, a non-empty phoneme string, and no comma variants/placeholders. Preserve sentence ID, token index, raw target, and source text. Report exclusions by reason and report source forms with conflicting targets; do not silently choose a variant.
- **Split policy differs by corpus:** SIGMORPHON word-level forms are required to be disjoint across train/dev/test for this prepared dataset. UGTPHON is sentence-split user-generated text where the same token form may naturally recur; its builder reports token-form intersections instead of falsely treating every repeated word as leakage. Neither builder exports test examples.
- **CI integration:** exact-head workflow [40297304221](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40297304221) passed both builders, all parser/audit tests, the cross-corpus compatibility step, and artifact upload. Artifact [12638378110](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40297304221/artifacts/12638378110) contains separate train/dev JSONL and provenance manifests.
- **Data contract:** SIGMORPHON tokenized IPA and UGTPHON token-level phoneme annotations remain separate target types. Do not concatenate them or call either one ClippyFirst broad IPA without an explicit reviewed adapter. A scratch teacher has now been trained from random initialization on SIGMORPHON train and evaluated on dev; it remains research-only. No runtime rules were changed.
- **Next:** design and independently validate a typed IPA adapter that preserves segment features and explicit/absent syllable boundaries; adjudicate cross-corpus target differences before any merge or rule promotion. Existing cross-corpus diagnostics are already implemented and run in CI.


- **Direction confirmed by owner:** prioritize learning from strong, traceable pronunciation data to improve ClippyFirst's own engine. Do not make an external neural checkpoint a product dependency. Checkpoint licensing is not a blocker for preparing and analyzing independently sourced corpus data; provenance and applicable source terms remain recorded rather than used to halt unrelated work.
- **Working branch / PR:** research/strict-teacher-guided-rule-mining-2026-10-26 / [draft PR #339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/339).
- **New implementation:** scripts/prepare_korean_g2p_corpus.py downloads the pinned SIGMORPHON 2021 medium Korean train/dev/test source files, verifies Git blob SHA-1 and expected row counts, writes only train/dev JSONL, preserves raw tokenized IPA targets, normalizes only the model-facing Hangul input to NFC, records source/output SHA-256 values, and refuses duplicate normalized forms or overlap across train/dev/test.
- **Test split protection:** test is fetched only to verify its source pin, count, and overlap; no test records are serialized. The CI workflow uploads train/dev JSONL and the provenance manifest as a research artifact, not as committed repository data.
- **Added verification:** tests/test_prepare_korean_g2p_corpus.py covers Git blob identity, NFC handling, raw IPA preservation, malformed TSV/UTF-8, duplicate normalized source forms, and row counts. The teacher corpus workflow now runs these tests and the real pinned-source preparation.
- **Status:** corpus preparation is DONE_VERIFIED by exact-head CI [40297304221](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40297304221). A scratch-trained research teacher has now completed training and dev-only error analysis; it remains separate from runtime. No production rule change or broad-IPA accuracy claim is made.
- **Next data batch:** implement and independently review a typed IPA adapter that preserves tokenization, segment features, length marks, and explicit versus absent syllable boundaries; adjudicate the 366 train/train cross-corpus target differences before merging data or promoting rules. The UGTPHON token schema and overlap diagnostics are already implemented.
- **Pipeline invariant:** source Hangul -> structural/phonological analysis -> typed phonetic/IPA representation -> Ukrainian target adaptation -> Ukrainian practical orthography. SIGMORPHON's tokenized IPA remains explicitly typed until its conventions are mapped and independently checked.


### Cross-corpus audit evidence (CI run 40295700341)

- Teacher corpus audit, both builders, compatibility report, and artifact upload all passed on code/test head b3d7b1725047d254c3a46bf2217d16ca133095c3. Full artifact: [12638605228](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40295700341/artifacts/12638605228).
- SIGMORPHON preparation: 8,000 train / 1,000 dev rows; zero normalized source-form overlap among train/dev/test.
- UGTPHON conservative token extraction: 13,271 train and 1,897 dev occurrences; 8,753 / 1,629 unique eligible forms. Eligible form intersections: train-dev 538, train-test 510, dev-test 228. These are repeated token forms across sentence splits, not duplicate sentence IDs.
- Cross-corpus source-form intersections: SIGMORPHON train × UGTPHON train 1,084; train × dev 257; dev × train 140; dev × dev 33.
- After removing only SIGMORPHON whitespace phone-token separators, target strings match for 718/1,084 train/train shared forms, 180/257 train/dev, 86/140 dev/train, and 23/33 dev/dev. Remaining differences are not automatically errors; no symbols were mapped and no syllable boundaries inferred. Target compatibility remains UNVERIFIED, and the corpora are not merged.
- The first compatibility audit failed before a common output_row_count manifest field was added and the test fixtures were corrected. The subsequent audit run 40295700341 passed all preparation, audit, and upload steps. Preserve this failure/fix history; do not report the earlier run as passing.
- The updated categorization run [40296047955](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296047955) passed all unit tests, source audits, both corpus builders, compatibility audit, and artifact upload. For train/train mismatches, 151/366 are length-mark-only under a diagnostic removal test, 215/366 remain other symbol/feature differences, and 0 differ only by syllable dots. Do not remove length marks from source data or treat either source as gold by default.

## Scratch teacher training added — 2026-10-26

- Added scripts/train_korean_g2p_teacher.py: a small bidirectional-GRU encoder + attention-GRU decoder trained from random initialization, using only the pinned SIGMORPHON train partition. It does not load pretrained weights or read test examples.
- The script verifies the generated train/dev hashes and target type, rejects train/dev source-form overlap, selects checkpoints on dev token error rate, and emits exact match, token error rate, and compact-character error rate. These metrics are source-convention-specific and are not broad-IPA accuracy.
- Added tests/test_train_korean_g2p_teacher.py and a separate CPU-only workflow .github/workflows/train-korean-g2p-teacher.yml that prepares the pinned corpus, trains the teacher, and uploads a short-retention checkpoint, dev predictions, and provenance report.
- **Training status: DONE_VERIFIED** on successful workflow [40296516593](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296516593), artifact [12638806286](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296516593/artifacts/12638806286). Best epoch 11; dev exact match 60.2% (602/1,000), token error rate 12.72% (843/6,629), compact-character error rate 12.18% (1,257/10,319). Checkpoint SHA-256: 4062bff4941fefe1b499a29163471e17d3e7eff2af690456d16f1fd93cc70a45.
- **Interpretation:** a scratch-trained teacher is a verified research artifact, not a production component. It learned from SIGMORPHON train only, selected on dev, did not load test or pretrained weights, and remains tied to the source's tokenized roughly-phonemic IPA. In 398 dev errors, 107 differed only by length marks in a diagnostic comparison (80 underpredicted, 27 overpredicted); do not strip length marks or treat the model as gold.
- **Remaining acceptance gate:** the new automated dev error-analysis script/workflow addition still needs exact-head CI confirmation. After that, inspect stratified error samples and map the source target convention before using any prediction to suggest deterministic rules. Do not use test/holdout data or automatically distill predicted outputs into runtime rules.

## Latest verified training/error-analysis state

- Exact code/test head before this documentation update: 985bfbab0cfc1a696e4f69209bb84d41446aec43. All five relevant workflows passed: tests [40296965072](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296965072), system verification [40296965094](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296965094), corpus audit [40296965215](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296965215), scratch teacher training/error analysis [40296965071](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296965071), and master artifacts [40296965019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296965019).
- Final scratch-teacher artifact for this run: [12638313059](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40296965071/artifacts/12638313059). The automated error report records 602 exact matches, 107 length-mark-only mismatches, 291 other mismatches; length-only cases include 80 underpredictions and 27 overpredictions.
- Source-shape diagnostic: 2-character forms have 66.1% exact match with a final coda (195/295) and 62.3% without (137/220); 3-character forms 50.0% with coda (59/118), 62.3% without (109/175); 4-character forms 41.5% with coda (17/41), 62.9% without (73/116). Larger buckets are small; these are leads for error review, not rules.
- **Status:** both corpus builders, compatibility audit, scratch teacher training, and automated dev error analysis are DONE_VERIFIED on successful CI evidence. The neural teacher remains a research-only hypothesis generator; the production deterministic engine is unchanged. Target IPA convention adaptation and independent phonological adjudication are still TODO.
- The present commit is documentation-only relative to the verified code/test head above; a new full Actions cycle may be queued because this remains a PR branch.

## Current execution record

- **PR:** [Draft PR #339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/339), based on `main` at `a452054a669de28426404d1110731715083423bb`. It remains draft and has not been merged.
- **Working branch:** `research/strict-teacher-guided-rule-mining-2026-10-26`.
- **Scope:** existing deterministic Strict/native engine, not the neural V3 production proposal. The public browser practical path's pinned JavaScript g2pK port remains separate.
- **Design decision:** use CharsiuG2P only as a research teacher. Do not import neural weights into runtime, silently replace Strict output, or tune on UGTPHON/SIGMORPHON/project holdout examples.
- **Implementation:** `scripts/mine_deterministic_rule_candidates.py`, `tests/test_mine_deterministic_rule_candidates.py`, `docs/TEACHER-GUIDED-STRICT-RULE-MINING-2026-10-26.md`; README link added. The utility preserves raw teacher/Strict outputs, uses conservative normalization, reports pairwise exact/CER and coarse context associations, and requires pinned model/data provenance, explicit license/overlap status, IPA output type, and train/dev-only split declarations. It never writes runtime rules.
- **Latest fully verified code/test head:** `08bf6b7a69c34e263ce4bdf146a3eb8e5fb70c96` (documentation-only follow-ups may advance the PR head without changing executable code).
- **Full test matrix:** [run 40291198283](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291198283) passed Python 3.11, 3.12, 3.13, wheel install, web tests/build, and teacher corpus audit.
- **System verification:** [run 40291198026](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291198026) passed Python regression/data integrity and browser regression/build. Official NIKL source inventory was skipped by workflow condition, not passed.
- **Master-table/research artifacts:** [run 40291198023](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291198023) passed.
- **Corpus split/overlap audit:** [run 40291198098](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291198098) passed with metadata-only artifact [12635583549](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290981510/artifacts/12635583549); overlap findings are recorded below.
- An earlier corpus-audit run failed because pytest was not installed; after adding the test dependency, a test assertion was corrected, and the exact-head audit passed. No failing run is represented as a pass.
- **Local verification limitation:** a shallow GitHub clone was attempted but the container could not resolve `github.com`; no local test result is claimed. CI supplied the executable verification.
- **Licensing/evidence blocker:** CharsiuG2P checkpoint weights have no verified explicit license in the checked model card; upstream training-data overlap is unknown. This blocks redistribution and leakage-free generalization claims, not independent deterministic-engine development.

## Benchmark-as-training-corpus audit (2026-10-26)

- **UGTPHON:** upstream pinned revision `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54` contains `ko/train.json`, `ko/dev.json`, `ko/test.json`; `ko/LICENSE` states Apache-2.0. Git tree blob sizes: train 3,651,448 bytes (SHA `771ef17ceed8127980f0be5103674cfa53627e55`), dev 512,281 bytes (SHA `71127176c1487741ed9a6492cdaabba78222461d`), test 729,354 bytes (SHA `59380491d5a797308c475f7d0007dcf6c4be00af`). The existing benchmark uses test only. Train/dev are candidate fine-tuning/validation partitions; full file hashes, row/token overlap checks, and model-rights review are still required.
- **SIGMORPHON 2021 Korean:** the source audit verified the pinned medium split at commit `821bcdece5a47820872215969f275004b0abe80c` (8,000/1,000/1,000 train/dev/test). Train/dev are candidate sources after attribution/terms review; the test partition and existing test fixture remain sealed.
- **Project NIKL 24-form holdout:** explicitly sealed for tuning and has no IPA gold; use only for future independent evaluation after two-reviewer annotation.
- **Charsiu multilingual ByT5:** no training run was started because the checkpoint weight license and original training-data overlap are unresolved. This blocks a responsible fine-tuning/redistribution decision, not independent deterministic-rule work.

- **CharsiuG2P upstream provenance:** code repo inspected at immutable commit `0c929390759fb94f8ecdfc05cc0bc5f2ff2dc0f4` is MIT, but contains separate Korean `data/train/kor.tsv` (2,075,385 bytes), `data/dev/kor.tsv` (1,738 bytes), and `data/test/kor.tsv` (16,676 bytes). `ko_info.txt` cites SIGMORPHON 2020 with literal `U/K`; `ko-2_info.txt` cites ipa-dict MIT. The Hugging Face checkpoint page says “No model card” and provides no verified weight license. Do not conflate code license with weight/data rights; overlap with benchmark rows is not established.
## Teacher-training corpus overlap audit (2026-10-26)

Exact-head source/split audit: [run 40290981510](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290981510), metadata-only artifact [12635583549](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290981510/artifacts/12635583549). The workflow verified pinned Git blob identities for UGTPHON, SIGMORPHON 2021 medium Korean, and the public Charsiu repository's Korean splits. It passed after installing the test dependency; the first attempt failed only because pytest was not installed, then the unit assertion was corrected to test quoted form leakage rather than a single-character substring.

- Split sizes: UGTPHON 1,976/246/275 train/dev/test; SIGMORPHON 8,000/1,000/1,000; Charsiu repository Korean data 62,126 train rows (61,900 unique forms; 226 duplicate-form rows), 50 dev, 500 test.
- Cross-corpus overlap: 508 unique UGTPHON test token forms occur in Charsiu repository train; 237 UGTPHON test forms occur in SIGMORPHON train; 729 SIGMORPHON test forms occur in Charsiu repository train. The full intersection matrix is in the metadata-only artifact.
- Interpretation: these are lexical overlap counts, not proof of checkpoint-level training exposure. But because the selected checkpoint's exact training manifest is unknown, do not claim UGTPHON/SIGMORPHON test performance is guaranteed independent for this teacher. Keep test splits sealed for rule tuning regardless.
- **Still blocked:** Charsiu checkpoint weights have no verified explicit license/model card; the upstream Korean source inventory includes a `U/K` license marker; original checkpoint training overlap remains unproven. No teacher inference, fine-tuning, or production rule changes were performed.
## Task ledger

| Task | Status | Acceptance evidence |
|---|---|---|
| Add reproducible teacher-vs-Strict per-case diagnostic | DONE_VERIFIED | Script emits machine-readable case-level raw/normalized outputs, exact-match and teacher-reference CER; full Python matrix passed |
| Prevent use of known test/holdout splits | DONE_VERIFIED | Tests reject non-train/dev splits and explicit holdout IDs even when mislabeled; verified benchmark family names are permitted only with train/dev split metadata, and row/provenance split mismatch and duplicate case IDs are rejected |
| Validate conservative normalization and context associations | DONE_VERIFIED | Tests cover preservation of IPA contrasts, eojeol boundary classes, all adjacent word pairs, and reference-normalized CER |
| Use model disagreements to add production rules | TODO | Each candidate needs independent primary-source adjudication, positive/negative controls, and separate dev-set improvement |
| Audit benchmark corpus split eligibility and rights | DONE_VERIFIED | Pinned UGTPHON train/dev/test files and Apache-2.0 data notice verified; SIGMORPHON fixture confirmed test-only in this repo; Charsiu upstream source notes and missing checkpoint model card documented 
| Run Charsiu inference / fine-tuning on a legally cleared train/dev corpus | PARTIAL | Charsiu inference on pinned SIGMORPHON/UGTPHON dev partitions is DONE_VERIFIED (run 40410860096); fine-tuning/redistribution and leakage-free generalization claims remain BLOCKED by unverified checkpoint-weight license and unknown original training overlap, with 508 UGTPHON test forms intersecting Charsiu repository train |
| Change Strict runtime or Ukrainian rendering from teacher predictions | DEFERRED | No automatic distillation; preserve deterministic runtime and IPA-to-Ukrainian boundary until evidence gates clear |

## Immediate continuation — updated 2026-10-27

1. **DONE_VERIFIED:** test-oracle IPA separator repair and loss-preserving inventory generation; see exact-head CI and the 5-inventory artifact recorded at the top of this handoff and in the case register.
2. **DONE_VERIFIED:** Charsiu train/dev comparison workflow ran to completion (run 40410860096). Treat its results as source-convention-specific diagnostics only; do not promote a rule from teacher output.
3. **PARTIAL:** semantic case-level register. The inventory contains 5,241 assertion/declaration candidates, but each still needs classification and observed-result joins. Preserve repeated test provenance and distinguish expected IPA from observed IPA.
4. **BLOCKED:** broad-IPA convention mapping and independent adjudication for shared corpus forms; independent Ukrainian target review; model-weight license and checkpoint training overlap for fine-tuning/redistribution. The blind review gate is tracked in issue #337.
5. Continue deterministic Strict improvements only from primary-source-backed environments with positive/negative controls. Keep model disagreements as a review queue, keep benchmark test partitions sealed, and do not alter production rules based on separator-only repairs or teacher predictions.

---

# One-pass continuation — source-backed Korean abstention recovery — 2026-10-25

- **Branch:** fix/source-backed-r003-exact-forms-2026-10-25; based on main commit 4a3f39b1df682dac0254db917d867405deee71fb.
- **Verified code/test head:** 66532e78eb75042e6b958c5e5bf313adf7e0f244. The final documentation/source-register follow-up is a separate commit and does not change runtime logic.
- **Implementation:** 19 new exact-form R002 formal-liaison licenses, nine new R003 ㅎ-deletion licenses, and one R004 complex-coda + ㅎ-suffix license; mirrored across Python and browser strict engines. Added regression tests for positive forms and negative controls.
- **Source evidence:** registered NIKL FAQ 8391 for 없음[업씀], reconciled Q&A 326978 (있- + -었-) and Q&A 306166 (two accepted 멋있어 variants), and registered Korean Basic Dictionary entry 긁히다 / 긁혀[글켜] for the R004 environment. Direct Hangul evidence is not IPA or Ukrainian-target gold.
- **Verification passed:** Python regression/data integrity and browser regression/build in Verify run [40216156212](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40216156212); full test matrix including Python 3.11, 3.12, 3.13, wheel install and web tests in [40216156229](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40216156229); multi-engine benchmark [40216156253](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40216156253); external UGTPHON diagnostic [40216156302](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40216156302).
- **Measured result:** 2,688/2,703 scored, 1,425 exact, CER 9.1757%, 99.4451% coverage, 15 unresolved occurrences, zero engine errors. Relative to the previous three-form baseline: 30 fewer abstentions, 13 more exact matches, CER improves by 0.0253 percentage points. Confidence intervals overlap; do not claim a robust accuracy gain.
- **Remaining unresolved:** 좃같아서, 괜찮아보이는디, 많을거같이, 많이본, 없을듯, 칡칡이, 못잃어, 알잖아아침에, 쫒아내면, 많앗구나유유유, 삶의, 개같이못하고, 좋아보인다고, 무서웟어, 좋아해주는. They remain fail-closed due compact phrase boundaries, likely spelling errors, uncertain lexical morphology, or independent IPA adjudication.
- **Status:** PARTIAL, not release-ready. Korean surface coverage is materially better; independent broad-IPA gold, Ukrainian target gold, and remaining source/morphology adjudication are still outstanding.

## Korean native-engine error analysis and post-fix benchmark — 2026-10-24

### Task ledger

- **DONE_VERIFIED on merged main:** R002 coda-ㅇ preservation; broad-IPA /j/ absorption after ㅈ/ㅉ/ㅊ + ㅕ. These are source-backed fixes with regression tests and measured gains.
- **DONE_VERIFIED and merged:** complete occurrence-level native-vs-g2pk audit for UGTPHON and SIGMORPHON; artifact 12559692692 retains every occurrence rather than a capped mismatch sample.
- **DONE_VERIFIED for Python native benchmark:** exact-form R010 (§24) licenses for 닮다 and 넘게 add two further exact matches; native CER also improves. The matching browser-engine licenses and tests were included in the merged PR.
- **PARTIAL:** 48 UGTPHON native abstentions remain across 47 unique words; 19 coincide with g2pk exact matches and 29 do not. R002 and R003 account for most unresolved contexts.
- **TODO:** source-adjudicate remaining abstentions and build an independent NIKL holdout.
- **BLOCKED:** full Korean IPA → Ukrainian accuracy is not measured because there is no independently adjudicated Ukrainian-output gold corpus.

### Confirmed causes and evidence

1. **R002 coda ㅇ loss.** The generic liaison branch treated coda ㅇ (/ŋ/) like a consonant that can move to silent onset ㅇ, dropping /ŋ/. PR #298 merged this fix. On the older normalization profile it gained 11 exact matches; on the revised broad-IPA profile the same-profile progression was 1,351 → 1,397 exact matches and CER 9.6619% → 9.3122%.
2. **Broad IPA retained an extra /j/ after ㅈ/ㅉ/ㅊ before ㅕ.** The official NIKL Standard Pronunciation Rule 5, exception 1, plus its explanation supports absorption in broad surface IPA while retaining the glide in phonemic output. PR #299 merged the fix. The revised-profile benchmark gained 13 exact matches and native CER fell from 9.3122% to 9.2060%.
3. **R010 (§24) fortition was withheld for two exact forms.** 닮다 and 넘게 were missing full-form licenses for stem-n/m + ending fortition. PR #297 adds narrow licenses in the Python engine and matching browser code. The latest Python benchmark gained two exact matches (1,410 → 1,412 of 2,655) and native CER fell from 9.2060% to 9.1883%. This is not a productive morphology analyzer and must not generalize to unlicensed forms.
4. **Four remaining g2pk-only exact occurrences are a reference convention mismatch.** All four are the word 없는. ClippyFirst preserves the NIKL-attested long vowel [엄ː는] as ʌːm.nɯn, while UGTPHON's reference omits length. Do not remove vowel length from production IPA to chase this score.
5. **g2pk is not universally better.** On UGTPHON, paired g2pk-minus-native exact delta is +0.1506 pp (95% CI +0.0351 to +0.3243) and paired CER delta +0.0531 pp (95% CI −0.0139 to +0.1302, crosses zero). On SIGMORPHON, native leads paired exact match by 0.4012 pp (95% CI for g2pk-minus-native −0.8024 to −0.1003); paired CER difference crosses zero. g2pk and native share the project's IPA segment renderer, so the comparison is not a fully independent end-to-end IPA stack.

### Current benchmark evidence

- Latest successful six-engine run: [40092929978](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978); artifact [12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692).
- Revised broad-IPA UGTPHON: native 1,412/2,655 exact (53.1827%), CER 9.1883%, coverage 98.2242%; g2pk 1,416/2,655 exact on the common scored subset (53.3333%), CER 9.2414%.
- Revised broad-IPA SIGMORPHON public paired file: native 357/997 exact (35.8074%), CER 14.7037%; g2pk 353/997 exact on the common scored subset (35.4062%), CER 14.8222%. This is not a leaderboard reproduction because the pinned public file contains paired references despite the upstream README describing word-only test inputs.
- Full UGTPHON pairwise categories: 1,412 both-exact; 1,239 both-not-exact; 4 g2pk-only exact; 19 native-abstained/g2pk-exact; 29 native-abstained/g2pk-not-exact.
- Full SIGMORPHON pairwise categories: 353 both-exact; 640 both-not-exact; 4 native-only exact; 2 native abstentions where g2pk is not exact.
- Canonical report: docs/MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md. Error analysis: docs/KOREAN-ERROR-ANALYSIS-2026-10-24.md. Master suite register: docs/KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md.

### Verification and PR state

- Run 40092929978: multi-engine benchmark passed on the Python R010-fix head; artifact uploaded and inspected.
- Run 40092327808: Python regression, browser tests/build and related test jobs passed before the browser R010 port was added.
- Run 40092327874: research morphology adapter smoke passed before the browser R010 port.
- The browser R010 implementation and parity test were merged with PR #297. Code-equivalent PR #300 CI passed: verification 40092757353, tests 40092757419, and multi-engine benchmark 40092757409. Post-merge mainline CI passed: tests 40093211039, system verification 40093211139, and master-table/research-artifact validation 40093211099 all succeeded on merge commit 2f7b58f0b7d976b9d660f21a739145ce19c533ab. The Pages deployment run 40093211042 subsequently completed successfully.
- PR #297 merged into main as 2f7b58f0b7d976b9d660f21a739145ce19c533ab. PR #300 was closed unmerged as superseded by #297; its relevant R010/R011 validation was preserved. PRs #298 and #299 are merged. PRs #280 and #281 are merged and their existing work is preserved.
- Functional Python benchmark head: 5962a9a8dbeacd04f4bd607a52d068d9aa97319a. The implementation is now on main via PR #297 merge commit 2f7b58f0b7d976b9d660f21a739145ce19c533ab. The docs-only reconciliation PR #301 merged at 04ef30e8e8ac88585e87641800b28325eb1173b3; it did not change runtime code.

### Readiness

**Research-ready for diagnostic comparisons; still a partial prototype, not release-ready.** The benchmark supports targeted code fixes and a clear remaining-error ledger, but it does not establish normative NIKL accuracy or Korean-to-Ukrainian output accuracy. Post-merge mainline tests, system verification, and master-table/research-artifact validation passed on 2f7b58f0b7d976b9d660f21a739145ce19c533ab; Pages deployment 40093211042 subsequently completed successfully. The next research gates are source adjudication of the 48 abstentions, an independently adjudicated NIKL holdout, and a separately reviewed Korean-IPA-to-Ukrainian gold corpus.

## Paired native IPA + morphology benchmark — 2026-10-24

- **Task ledger:** `DONE_VERIFIED` — paired native strict/soft IPA scoring; Kiwi and MeCab-Ko full-inventory diagnostics; rule-event boundary alignment; counterfactual boundary-gated ablation; pairwise segmentation comparison; representation-span audit; unit tests, CI workflow, and documentation. `BLOCKED` — morphology accuracy and rule-license correctness cannot be established without adjudicated gold morphology and a reviewed rule-licensing adapter.
- **Integration:** PR [#294](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/294) squash-merged into `main` as **`1efd49c3c5c15fdc9586cab8386651037d7ef13e`**. Source implementation/workflow head: `e166313a7e7ccce5ac52bf5372efbfe8182e6449`; subsequent commits on the PR branch updated the reports/handoff only. The merge changes research diagnostics and tests; no production phonology or public browser behavior was changed.
- **Pinned corpus:** UGTPHON Korean `ko/test.json`, commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`, 275 rows, 2,703 eligible token occurrences, 1,907 unique Hangul words. This is noisy user-generated text, not normative NIKL gold.
- **Native strict vs soft:** strict 2,655/2,703 scored (98.2242% coverage), 648 exact (24.4068%), CER 17.0648%, 47 unresolved unique words. Soft 2,677/2,703 (99.0381%), 650 exact (24.2809%), CER 17.0906%, 25 unresolved. On the 2,655-occurrence common subset, strict and soft are identical. Soft expands coverage but does not improve IPA accuracy on the common subset; its full-set exact rate decreases by 0.1259 pp and CER worsens by 0.0258 pp.
- **Counterfactual morphology boundary gate:** research-only ablation, not production integration. Kiwi retained 208 / suppressed 30 candidate soft licenses; MeCab-Ko retained 207 / suppressed 31. Full-set gated metrics: Kiwi 2,670/2,703 scored (98.7791%), 650 exact (24.3446%), CER 17.0810%; MeCab-Ko 2,672/2,703 (98.8531%), 650 exact (24.3263%), CER 17.0779%. Compared with strict, each gate scores more occurrences but adds only two exact matches overall.
- **Fair paired triad:** strict, soft, and each gated run all score the same 2,655-occurrence subset. For both analyzers, all three strategies are identical on this subset: exact-rate delta 0, CER delta 0, 0 exact wins/losses, 0 edit-distance wins/losses, and 2,655 ties. Paired CER uses the first listed reference variant per occurrence, so its denominator is identical; exact match accepts any listed variant. Full-set differences are coverage/status changes on extra cases, not a demonstrated accuracy gain.
- **Analyzer inventory:** Kiwi analyzed 1,907/1,907 words, 1,321 multi-morpheme words (69.27%), 4,552 morphemes, max 48; MeCab-Ko analyzed 1,907/1,907, 1,282 multi-morpheme words (67.23%), 4,100 morphemes, max 26. This CI run measured 2.114 s for Kiwi and 0.104 s for MeCab-Ko; timings are single-run diagnostics, not stable speed claims.
- **Pairwise segmentation:** exact boundary-set agreement 1,537/1,907 = 80.5978%; 1,878 shared boundaries, 307 Kiwi-only, 315 MeCab-only; micro F1 85.7926%. Output-shape audit: Kiwi 187 words with repeated spans, 205 repeated-span groups, 416 overlapping span pairs, 839 forms differing from literal source substring, and 55 zero-width morphemes across 53 words; MeCab-Ko has zero in those categories. Invalid source spans: zero for both. These representation counts are not automatically errors, but make naive offset alignment unsafe.
- **Rule-event alignment:** 238 comparable native soft-rule events; both analyzers observed 200 boundaries, neither observed 23, Kiwi-only 8, MeCab-only 7. Event agreement is 223/238 = 93.6975%; boundary observation rates are 87.3950% for Kiwi and 86.9748% for MeCab-Ko. Agreement is descriptive only, not phonological-rule accuracy.
- **Exact-head evidence before merge:** paired morphology workflow [40086297037](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40086297037) PASS for both real analyzers, counterfactual paired scoring and boundary agreement; tests [40086297004](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40086297004) PASS (web tests/build and Python 3.11–3.13); system verification [40086296966](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40086296966) PASS; corpus artifacts [40086297043](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40086297043) PASS; external UGTPHON [40086296972](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40086296972) PASS; multi-engine IPA [40086297060](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40086297060) PASS. The live NIKL inventory remains blocked/skipped due HTTP 403 and is not counted as a pass.
- **Independent IPA engines:** latest same-head multi-engine diagnostic shows g2pk 0.9.4 + project renderer modestly ahead of native strict on this noisy corpus (24.9723% vs 24.4068% exact; CER 16.6931% vs 17.0648%). This is diagnostic only, not NIKL normative gold; Ukrainian adaptation is not scored.
- **Open PRs at merge checkpoint:** none. No branch was blindly merged over conflicting code; PR #294 was a single reviewable research-benchmark change and its exact-head CI passed.
- **Remaining gates:** independently adjudicated morphology spans/lemmas/POS; false rule-permission evaluation; reviewed rule-licensing adapter; independent IPA adjudication; Ukrainian target-layer review; NIKL source reuse/terms and human clause-boundary review.
- **Release classification:** research preview / partial prototype, not release-ready.

## Native engine Rule 28/30 exact compound and saisiot licenses — 2026-10-23

- Scope: own Python research engine, branch `research/native-engine-nikl-compound-saisiot-2026-10-23`, based on current main after PR #278.
- Merge status: [PR #279](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/279) squash-merged successfully as `1d67f9fad7689853bac68554b4b00c2edcfa5e23`. Tested code head: `ba694566dfe51adb22a344010d78893a88f89442`; subsequent commits only reconciled documentation.
- Evidence: official NIKL Standard Pronunciation Rules, §§28 and 30: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002.
- Implementation: finite exact full-form/pair licenses for 18 Rule 28 compound-fortition examples and 15 Rule 30 saisiot examples; official URL added to trace source metadata. No blanket ㅅ-coda rule was introduced. Ambiguous homograph `잠자리` is intentionally excluded from automatic Rule 28 licensing.
- Tests: expected fortis onsets for all listed Rule 28 examples; expected coda/onset outcomes for Rule 30 fortition, nasal, and 이-initial examples; negative controls for `잠자리` and `옷가게`.
- Task ledger: `DONE_VERIFIED` — 18 exact Rule 28 licenses, 15 exact Rule 30 licenses, trace provenance, listed-form tests, and negative controls are implemented. [Tests #2194](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40022568933) passed Python 3.11/3.12/3.13 and browser tests/build; [system verification #5093](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40022568864) passed Python regression/data-integrity and browser regression/build; [corpus artifacts #2058](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40022568699) passed. Live NIKL inventory was skipped/blocked and is not claimed passed. `BLOCKED_SPECIALIST_ADJUDICATION` — broad IPA and Ukrainian target review remain separate.
- Verified code head: `ba694566dfe51adb22a344010d78893a88f89442`; subsequent branch commits only update the report and handoff. Evidence boundary: NIKL's Hangul surface examples do not by themselves certify IPA or Ukrainian adaptation.

## Native engine Rule 29 exact n-insertion licensing — 2026-10-23

- Scope: own Python research engine, branch `research/native-engine-sourced-n-insertion-2026-10-23`, based on main after PR #277.
- Merge status: [PR #278](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/278) squash-merged successfully as `31548f606a260d920293583b886b8bd4d51aa1a6`. Tested code head: `c95ec90692f1012fefd045514d7b7b0c6b08edcb`; subsequent branch commits only updated documentation.
- Evidence: NIKL Standard Pronunciation Rule 29 explicitly lists the exact word examples and attached examples. The official rule URL is recorded in `src/korean_ukrainian/rules.py`; a current NIKL Q&A also explicitly explains 한여름[한녀름] and 솜이불[솜ː니불]: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=97&pageIndex=1&qna_seq=336242.
- Implementation: added a finite exact-form/pair license registry for 29 listed word forms plus six listed cross-word examples. Cross-word examples require `boundary_mode="phrase"`; no global boolean or spelling-only guess grants a license. R009 trace now records the exact license context.
- Scope boundary: NIKL also lists `3연대` and `1연대`, but native input validation rejects mixed-script numeric strings. Those require a separately specified Korean numeral-reading stage and are not silently coerced by this patch.
- Tests: all listed word forms must apply the expected pair-specific R009 rule; listed phrase examples must not change in same-word mode and must change only in explicit phrase mode; NIKL no-insertion exceptions `육이오`, `삼일절`, `송별연`, and `등용문` remain unchanged. The pipeline test checks `한여름 → 한녀름` without a caller-supplied license and confirms an unlisted near-match remains conservative.
- Task ledger: `DONE_VERIFIED` — 29 exact word-form licenses, six explicit phrase licenses, R009 trace provenance, 29-word/six-phrase regression matrix, no-insertion exception tests, and native pipeline test are implemented. [Tests #2185](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40021815322) passed Python 3.11/3.12/3.13 and browser tests/build; [system verification #5068](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40021815298) passed Python regression/data-integrity and browser regression/build; [corpus artifacts #2049](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40021815444) passed. The live source inventory was skipped/blocked and is not claimed passed.
- Verified code head: `c95ec90692f1012fefd045514d7b7b0c6b08edcb`; later branch commits only update the report and handoff. Scientific boundary: NIKL bracketed Hangul pronunciations validate Korean surface behavior, not broad IPA or Ukrainian adaptation. Independent IPA and Ukrainian target reviews remain separate blockers.

## Native engine IPA-status hardening — 2026-10-23

- Scope: own Python research engine only; branch `research/native-engine-evidence-hardening-2026-10-23`, based on default-branch checkpoint `f351c2e2ef65de12ae05212ca0f43cff3c012676`.
- Merge status: [PR #277](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/277) squash-merged successfully as `faad03498793a15d8f6f179568412a9c8ffb0611`. The tested code head was `89567e77c7ea19cd3d2200b77685e0b12f338c6c`; subsequent commits before merge only reconciled documentation.
- Implementation: `phoneticize_korean()` and `transliterate_korean()` now both expose top-level `ipa_status`, `ipa_is_diagnostic_only`, and `ipa_status_reason`. When a recognized morphophonological context is unresolved, diagnostic IPA remains inspectable but is explicitly labelled; Ukrainian target selection remains fail-closed.
- Regression expansion: unresolved cases `앉아라`/R002, `쌓아`/R003, `넋하고`/R004, `갇이`/R007, and `긁고`/R008 must be marked diagnostic-only and must not render a Ukrainian target. Negative controls `먹이`, `일본`, `실수`, `밭에`, `국밥` must not be falsely marked unresolved. Source-backed lexical forms (`값어치`, `싫어`, `늙고`, `깎아`) remain provisional, not diagnostic-only; they are not used as unresolved tests because the exact lexicon entries intentionally resolve them.
- Documentation: README Python/API section defines the status contract; [focused contract and acceptance report](NATIVE-ENGINE-IPA-STATUS-AND-FAIL-CLOSED-REGRESSION-2026-10-23.md) records scope, test matrix, and evidence limits.
- Task ledger: `DONE_VERIFIED` — API status contract, native unresolved-context regression matrix, negative controls, README and focused report; [test workflow #2173](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40020824792) passed Python 3.11/3.12/3.13 and browser tests/build; [system verification #5030](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40020824867) passed browser regression/build and Python regression/data-integrity; [corpus artifacts #2037](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40020824940) passed. Source inventory was skipped/blocked and is not claimed passed. `BLOCKED_SPECIALIST_ADJUDICATION` — independent broad-IPA review and Ukrainian target-layer review remain open.
- Verification code head: `89567e77c7ea19cd3d2200b77685e0b12f338c6c`; subsequent branch commits update documentation only. Local clone was blocked by DNS resolution failure for `github.com`; repository CI provided the verification evidence.
- Release disposition: research preview / partial prototype; this API clarity improvement does not substitute for independent phonetic or Ukrainian-output adjudication.

## Independent UGTPHON validation and fail-closed correction — 2026-10-23

- Working branch / PR: `research/ugtphon-independent-validation-2026-10-23` / [PR #276](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/276).
- Final implementation merge: PR #276 was squash-merged into `main` as `8340c453d1e41654c5b154ff332e30e1bee22baf`. Verified PR-head code commit: `6c4f9269f473f62ad6128e7d3c59664354a7f902`; post-merge workflows are not configured to trigger on `push` in this repository, so the acceptance evidence is the green PR-head CI recorded below.
- User directive: validate the project's own research engine against independent sources; do not modify or blindly privilege third-party g2pK.
- External source: Naver AI's UGTPHON, pinned upstream commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`. The Korean test split contains 275 sentence rows (107 `multilexnorm2026`, 168 `dc_inside`); per-language `ko/LICENSE` declares Apache-2.0 and records KoMultiText/MultiLexNorm++ provenance. Dataset is noisy user-generated text, not a normative dictionary.
- Added `scripts/benchmark_ugtphon_ko.py` and `.github/workflows/ugtphon-benchmark.yml`: pinned external data is downloaded only to a temporary CI directory, license and split structure are checked, no raw corpus is committed, and the report is uploaded as an artifact. Scores exclude native-engine results explicitly marked unresolved.
- Latest benchmark [run #14](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40019431202), artifact [JSON report](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40019431202/artifacts/12530266549): 2,653 IPA token comparisons scored; 648 exact matches; exact-match rate 24.4252%; CER 17.0604%; 50 tokens explicitly unresolved and excluded; 437 non-Hangul/multi-token cases skipped; 0 missing-gold skips; 0 engine exceptions. This is a diagnostic convention-sensitive score, not a normative accuracy estimate.
- The benchmark exposed a real contract gap: for `앉아라`, R002 marked complex-coda liaison `conditional-disabled`, yet the pipeline still returned definitive-looking IPA and proceeded to target mapping. Fixed in `src/korean_ukrainian/pipeline.py`: unlicensed ambiguous contexts are surfaced as `pronunciation_status: unresolved` with structured context, and `transliterate_korean()` fails closed before IPA-to-Ukrainian mapping. Tests cover `앉아라` and ensure a source-backed `값어치` lexical override remains resolved. Diagnostic IPA remains inspectable for audit only.
- A second evidence-gated improvement applies the attached `-ㄹ게` ending as `[할께]` under NIKL Standard Pronunciation Rule 27. The official NIKL Q&A (https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=330963) is stored in the rule trace; the implementation is narrowly licensed and does not generalize to unrelated sequences such as `일본` or `실수`.
- Representative mismatch categories: `위` (`ɥi` vs project `y`) is likely an IPA-convention/variant adjudication issue; `사람` differs in stress, length, narrow vowel diacritics and initial-fricative convention; `사건` has a potentially substantive disagreement and must be checked against NIKL before any change. The full report includes 50 worst mismatches and unresolved examples. No rule was changed merely to match UGTPHON.
- Verification at code head `6c4f9269f473f62ad6128e7d3c59664354a7f902`: [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40019431324) passed Python 3.11/3.12/3.13 plus browser tests/build; [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40019431221) passed browser regression/build and Python regression/data-integrity; [strict corpus/master artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40019431249) passed; [optional g2pK integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40019431149) passed Python 3.11/3.12 integration and wheel-data checks; [external benchmark](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40019431202) passed.
- Task ledger: `DONE_VERIFIED` — pinned external benchmark intake and execution, metric reporting, parser/unit tests, fail-closed ambiguity gate and regression tests, NIKL-attested `-ㄹ게` handling, CI on Python 3.11/3.12/3.13, browser/build and corpus checks. `TODO / evidence adjudication` — inspect remaining IPA mismatches by class and direct NIKL evidence. `BLOCKED_SPECIALIST_ADJUDICATION` — independent normative IPA gold and independent Ukrainian target-layer review remain outstanding.
- Reports: [UGTPHON benchmark results](UGTPHON-BENCHMARK-RESULTS-2026-10-23.md); [independent validation protocol](INDEPENDENT-KOREAN-PHONOLOGY-VALIDATION-2026-10-23.md).
- Release disposition remains deployed research preview / partial prototype, not scientifically validated release.


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

### Continuation — source-rights audit implementation, 2026-10-23

Current main is `b795575c0d8b122123561c682e510ed5c171b5cc`; the exact-head CI and deployed Pages smoke all passed on this commit (runs 40010110375, 40010110416, 40010110513, 40010110447).

Working branch: `research/source-rights-ledger-validator-2026-10-23`. This batch adds `scripts/audit-source-register.mjs`, `tests/source-register-rights-audit.test.mjs`, and `npm run audit:source-register`. It parses quoted CSV correctly, checks required columns/row widths/duplicate IDs/HTTPS source URLs, and conservatively triages rights text into item-level license recorded, not applicable recorded, review required, or manual classification required. It emits an ephemeral queue instead of a second canonical registry and never marks a source cleared automatically.

Acceptance is still pending exact-head CI. Run `npm run audit:source-register` for a structural report; use `npm run audit:source-register -- --require-reviewed-rights` as a strict gate after the owner/reviewer has resolved every record. A non-zero strict result is expected until item-level rights are evidenced. This audit is not legal advice and cannot establish permission by itself.

Audit baseline for the current 100-row source register: 96 records `REVIEW_REQUIRED`, 2 `MANUAL_CLASSIFICATION_REQUIRED`, 1 `ITEM_LEVEL_LICENSE_RECORDED`, and 1 `NOT_APPLICABLE_RECORDED`. These are triage counts, not a legal clearance. The one explicit license-recorded row is not treated as permission for every retained artifact; verify scope, notices, and obligations before closure.

### Continuation — blinded IPA reviewer packets, 2026-10-23

Main after PR #270 is `1f91d0c3817153d8a07004778ed916fda39d4ec5`. Tests, Python 3.11–3.13, browser build/integration, system verification, corpus artifacts, public HTTP smoke, and live Playwright practical-mode smoke passed; Pages run [40012122568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40012122568) is successful.

Working branch: `research/blinded-ipa-review-packets-2026-10-23`. It adds `scripts/build-ipa-review-packet.mjs`, `tests/blinded-ipa-review-packet.test.mjs`, and `npm run ipa:review-packet`. Generate a packet with `npm run ipa:review-packet -- --reviewer A` or `--reviewer B`; JSON is written to stdout, the canonical queue is not modified, and the output includes a SHA-256 of the exact queue text. The projection omits candidate IPA, both existing reviewer records, reconciliation, Ukrainian target review, and free-text source notes. Tests use secret sentinel values to verify that hidden fields cannot leak.

This is workflow preparation only. No IPA value was added and the independent-review queue remains 0/20 in both slots. The official NIKL live inventory remains skipped/blocked by access restrictions; no bypass was attempted.

### Final continuation state after PR #270 and PR #271 — 2026-10-23

- Current main at the time of this handoff: `df733c7f7afdf1262bea6c46d07876d6f315ccaf`.
- PR #270 merged: read-only source-register integrity/right-triage command and tests. Audit result for 100 rows: 96 review required, 2 manual classification required, 1 explicit license recorded, 1 not applicable recorded. These are not legal decisions.
- PR #271 merged: blinded IPA reviewer packet generator, with SHA-256 of the exact queue text and sentinel tests proving that candidate IPA, reviewer A/B records, reconciliation, target review, and source notes are omitted.
- Exact PR #271 head `c709fdb785b4b1614fa1aa785ae35227886bb072`: Node tests **1195 passed / 0 failed**; Python 3.11–3.13, system verification, browser G2P and corpus artifact checks passed.
- Post-merge main tests, system verification, browser G2P and corpus artifacts passed. Pages run [40012736801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40012736801) completed successfully: deploy, public HTTP smoke, and live Playwright practical-mode interaction all passed.

Commands added:
- `npm run audit:source-register`
- `npm run audit:source-register -- --require-reviewed-rights` (expected to exit 3 until all rights statuses are resolved)
- `npm run ipa:review-packet -- --reviewer A`
- `npm run ipa:review-packet -- --reviewer B`

The live NIKL inventory remains skipped/blocked by HTTP 403. IPA remains 0/20 independent submissions in both reviewer slots; Ukrainian target review is separate. Scientific release remains blocked.

### Continuation — strict validation of returned IPA review packets (2026-10-23)

On top of merged PR #271, branch `research/validate-ipa-review-submissions-2026-10-23` adds `scripts/validate-ipa-review-submission.mjs` and `npm run ipa:validate-submission -- <submission.json> --reviewer A|B`.

The validator fails closed on stale queue hashes, missing/duplicate/unknown cases, modified source evidence, unexpected fields that could leak candidate IPA or another reviewer's data, missing reviewer/method/timestamp/IPA/boundary/length fields, and reviewer-slot mismatch. It requires a timezone-bearing timestamp and one of `present|absent|not_applicable|uncertain` for the length assessment. It only validates structure and provenance; it cannot certify phonetic correctness, expertise, independence, or target-layer quality. It does not alter the packet or canonical queue.

Tests use explicitly synthetic IPA fixture strings solely to exercise validation. No fixture is added to the research corpus and no gold IPA is created. The 20 cases remain blocked pending genuine independent reviewers.

### Continuation — executable NIKL article-reference index (2026-10-23)

Branch `research/nikl-article-test-index-2026-10-23` adds `scripts/audit-nikl-article-test-index.mjs` and `npm run audit:nikl-test-index -- --format json|csv`. It inventories literal article/section references found in test filenames and test text for all 30 NIKL articles, lists the referenced files, and marks articles with no explicit reference. It does not infer a complete numeric range from endpoint notation and does not equate a reference with coverage. This is a repeatable navigation/audit aid; source-derived atomic coverage and independent review remain separate acceptance requirements.

### Final handoff checkpoint — 2026-10-23 20:00 UTC

Code snapshot verified: `3a2052c9c27d7af6b5efa7c744d9e2ef14a70d41`. Merged PRs #270, #271, #273, and #274 added source-rights triage, blinded IPA reviewer packet generation, strict returned-packet validation, and an explicit article-reference index. PR #272 reconciled the handoff after the rights and packet merges.

Exact-main CI at this snapshot: Node tests **1205/1205 pass**; Python 3.11, 3.12, and 3.13 pass; browser G2P integration passes; browser regression/build and Python data integrity pass; master table/research corpus artifact workflow passes. Pages run [40015664039](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40015664039) subsequently passed deployment, public HTTP smoke, and live Playwright practical-mode smoke. The official NIKL inventory remains blocked by HTTP 403 and must not be represented as a successful crawl.

Remaining blockers are scientific, not simply technical: 20/20 independent IPA cases remain unsubmitted by each of two reviewers; Ukrainian target-layer review is outstanding; source-grounded atomic coverage of all paragraphs, exceptions, variants and interactions is unproven; 96/100 source records remain rights-review required and 2 require manual classification; live official-source access is blocked. The article index is only navigation evidence. Project status remains research preview / partial prototype.

### Continuation — evidence-led native unresolved-case repairs (2026-10-24)

Branch: `research/native-engine-unresolved-cases-2026-10-24`. This work is limited to the native Python research engine, source-backed lexical data, and regression tests; it does not adopt or modify a third-party G2P engine.

- Added exact full-form NIKL §14 formal-morpheme licenses for `앉아라` (pair `앉>아`) and `없어도` (pair `없>어`). These are rule-derived forms from transparent morphology and the official examples `앉아[안자]` / `없어[업써]`; the report does not claim that the official source directly lists the complete inflected forms.
- R002 now records its exact license scope, full form and adjacent pair in the trace.
- Added an exact `삶의` lexical entry based on NIKL's direct statement that the particle phrase is pronounced `[살믜]` or `[살메]`. The project IPA renderings are `sal.mɰi` / `sal.me`; they remain project-derived and Ukrainian target status remains provisional.
- Deliberately did not auto-resolve `많이본` or `좋아보인다고`: the likely spacing boundaries (`많이 본`, `좋아 보인다고`) cannot be safely inferred from Hangul adjacency. Compact forms remain unresolved; explicitly spaced controls are tested separately.
- Scholarly evidence and case-by-case decisions are documented in [docs/NATIVE-ENGINE-UNRESOLVED-CASES-2026-10-24.md](NATIVE-ENGINE-UNRESOLVED-CASES-2026-10-24.md). Literature reviewed includes Lee & Chung 2007 on morphology-conditioned pronunciation variation, Jeon et al. 1998 on staged rule processing, Jun 2015/2021 on gradient n-insertion, and the K-SPAN paper's limits as a non-recording-based lexical reference.
- Acceptance: **DONE_VERIFIED for code/tests and generated artifacts** at tested head `24dac25d625dc648ae421412aeb6ccb430a60034`. [Python/browser tests, Python 3.11–3.13](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40026472569) passed; [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40026472504) passed Python regression/data integrity and browser regression/build (official NIKL inventory skipped); [master table/corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40026472604) passed; [UGTPHON diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40026472528) passed. The compact forms and independent IPA/Ukrainian specialist reviews remain open blockers.

### Continuation — evidence-led native unresolved-case repairs (2026-10-24)

Branch: `research/native-engine-unresolved-cases-2026-10-24`. This work is limited to the native Python research engine, source-backed lexical data, and regression tests; it does not adopt or modify a third-party G2P engine.

- Added exact full-form NIKL §14 formal-morpheme licenses for `앉아라` (pair `앉>아`) and `없어도` (pair `없>어`). These are rule-derived forms from transparent morphology and the official examples `앉아[안자]` / `없어[업써]`; the report does not claim that the official source directly lists the complete inflected forms.
- R002 now records its exact license scope, full form and adjacent pair in the trace.
- Added an exact `삶의` lexical entry based on NIKL's direct statement that the particle phrase is pronounced `[살믜]` or `[살메]`. The project IPA renderings are `sal.mɰi` / `sal.me`; they remain project-derived and Ukrainian target status remains provisional.
- Deliberately did not auto-resolve `많이본` or `좋아보인다고`: the likely spacing boundaries (`많이 본`, `좋아 보인다고`) cannot be safely inferred from Hangul adjacency. Compact forms remain unresolved; explicitly spaced controls are tested separately.
- Scholarly evidence and case-by-case decisions are documented in [docs/NATIVE-ENGINE-UNRESOLVED-CASES-2026-10-24.md](NATIVE-ENGINE-UNRESOLVED-CASES-2026-10-24.md). Literature reviewed includes Lee & Chung 2007 on morphology-conditioned pronunciation variation, Jeon et al. 1998 on staged rule processing, Jun 2015/2021 on gradient n-insertion, and the K-SPAN paper's limits as a non-recording-based lexical reference.
- CI acceptance is pending at the time of this entry; do not mark the batch DONE_VERIFIED until the new Python regression test, full tests, system verification, and corpus artifacts finish successfully. The compact forms and independent IPA/Ukrainian specialist reviews remain open blockers.


### Continuation — IPA adjudication gate for 삶의 and target-layer separation (2026-10-24)

Branch / PR: `research/native-engine-unresolved-cases-2026-10-24` / [PR #281](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/281).

This continuation found a critical evidence distinction: NIKL MCFAQ 5716 directly attests Korean surface-Hangul readings `[살믜]` and `[살메]`, but does not supply IPA `sal.mɰi` or `sal.me`. Those IPA strings are project-rendered and remain unadjudicated. Rather than guessing that either is correct or silently changing it, the native engine now:
- stores the form-specific `ipa_adjudication_status=diagnostic_only_unresolved_pronunciation` in the existing dated lexical overlay `data/korean/lexical_additions_ipa-adjudication-2026-10-24.csv` (the canonical base lexicon schema remains unchanged);
- adds an `IPA_ADJUDICATION` unresolved context, keeps the candidate IPA inspectable, and returns `pronunciation_status=unresolved` / `ipa_is_diagnostic_only=true`;
- blocks IPA→Ukrainian target selection for `삶의` until independent IPA adjudication is complete;
- tests the explicit status/reason and confirms `transliterate_korean("삶의")` returns no Ukrainian orthography;
- records a separate blinded target-layer review protocol and source limitations in `docs/IPA-TARGET-ADJUDICATION-BLOCKERS-2026-10-24.md`.

The existing PR's source-backed exact-form work remains intact: `앉아라` and `없어도` use narrow NIKL-rule-derived licenses; `많이본` and `좋아보인다고` remain unresolved without explicit segmentation. No third-party G2P rules were adopted.

#### Verification evidence

The code/data/test state at `ea14a6d9b7f332a3b88a181d841bb34841eb893d` passed:
- Tests + Python 3.11/3.12/3.13 + web build: [run 40027594483](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594483).
- System verification: [run 40027594485](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594485).
- Master table / strict research corpus artifacts: [run 40027594415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594415).
- Optional g2pK integration: [run 40027594547](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594547).
- External UGTPHON IPA diagnostic: [run 40027594361](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594361).

All listed workflows concluded success. The official NIKL metadata-only inventory job was **skipped**, not passed. A later documentation-only commit `0348043653e7489e98e0f68dc2bb9a820e9cb99a` added extracted literature findings; no code/data/test files changed after the green code/test state. A local clone/test attempt was blocked because this execution environment could not resolve `github.com`; CI supplied the executable verification instead.

#### Evidence-based conclusions and remaining blockers

- Jun (2015, DOI 10.1017/S0952675715000275) shows n-insertion tendencies that differ between existing and novel words; the existing-word M1-length effect did not generalize in the novel-word experiment. Do not encode it as a universal categorical rewrite or copy study rates as calibrated engine probabilities.
- Jun (2021, DOI 10.5334/GJGL.1401) reports interacting gradient factors and no single absolute condition for n-insertion.
- Wei et al. (2023, DOI 10.21437/interspeech.2023-1635) distinguishes orthographic transcription accuracy from subjective comprehensibility ratings. It is methodological context only; it does not validate Korean IPA or Ukrainian mappings.
- Park (2019, DOI 10.14342/SMOG.2019.102.165) and Kim (2025, DOI 10.22557/hg.2025.3.86.1.5) are relevant ㅢ research leads, but their abstracts/full texts were unavailable in the retrieved records and they are not treated as evidence for the exact form.

Current task ledger:
- **DONE_VERIFIED:** form-specific IPA review gate; base lexicon schema preserved; overlay metadata structurally checked; regression tests and CI passed at the code/test state above.
- **PARTIAL:** official surface-Hangul evidence for 삶의 is present, but neither IPA candidate is independently validated.
- **BLOCKED_SPECIALIST_ADJUDICATION:** two qualified Korean phonetics reviewers must independently assess the exact construction, IPA convention, segmental realization, boundaries, and accepted alternatives.
- **BLOCKED_SPECIALIST_REVIEW:** Ukrainian target policy must be reviewed separately on a frozen, adjudicated IPA input.
- **BLOCKED_INPUT_ANALYSIS:** compact `많이본` / `좋아보인다고` require caller-supplied segmentation or a validated morphology/spacing component.
- **DEFERRED:** probabilistic modeling of optional variants requires a documented alternative representation and calibrated evidence.
- **BLOCKED_EXTERNAL_ACCESS:** official NIKL inventory job remains skipped due source-access restrictions; no bypass was attempted.

Readiness remains **research preview / partial prototype**, not a scientifically validated transcription standard. Do not mark the release gate complete based on CI.


### Correction — literature-led broad IPA candidates and explicit alternatives (2026-10-24)

The focused Undermind search completed and surfaced Park, Cho & Han (2016), “한국어 이중모음 /의/의 단모음화 양상,” DOI https://doi.org/10.17959/SPPM.2016.22.1.35. Its abstract reports 2,370 Seoul Corpus tokens, 93.04% overall monophthongization of /ɨi/, [i] for 94.40% of monophthongized tokens, and predominantly [e] for genitive-particle tokens. This strengthens the case that the broad surface candidate for [살믜] should be `sal.mi`, not the legacy `sal.mɰi`; [살메] remains represented as `sal.me`. The study does not directly measure 삶의 and its full text was unavailable, so both remain diagnostic-only hypotheses pending expert adjudication.

Implementation follow-up:
- Changed the primary project-rendered IPA candidate in the base lexical row and adjudication overlay to `sal.mi`; retained `sal.me` as the alternate.
- Extended the native IPA adapter to expose explicitly licensed lexical alternatives as `ipa.lexical_alternatives` instead of leaving them hidden only in CSV metadata.
- Kept the form-level `diagnostic_only_unresolved_pronunciation` gate, so both candidates remain inspectable but Ukrainian target selection is blocked.
- Updated regression tests to assert the primary candidate, alternate candidate/provenance, diagnostic status and target blocking.

Code/data/test commits: pipeline `f14472836232045665b80cc5dcce4b0b06a6af73`; base data `e872b184db1fe947c14b66dd2116eafa8654b51a`; overlay `2d4841b27f583931d58e6769f023809e13f77a9a`; final test fix `5beb7a8eb6e6e02f148658340c272f7296048943`. New exact-head CI is running for the changed code/test state: tests run 40028069871, system verification 40028069927, optional g2pK 40028069969, corpus artifacts 40028069909, and UGTPHON diagnostic 40028069920. Do not call this follow-up verified until all complete; the official NIKL inventory remains a known skipped/blocked external gate.


### Reviewer-queue expansion and target-reference correction — 2026-10-24

The focused literature search now supports a better broad-surface candidate for [살믜]: `sal.mi` rather than the earlier `sal.mɰi`. The primary candidate remains diagnostic-only because the corpus study does not directly measure 삶의 and no qualified independent reviewers have adjudicated the exact form. The alternative [살메] is separately exposed as `sal.me` in `ipa.lexical_alternatives`. The lexical Ukrainian target reference was aligned mechanically to the primary IPA candidate (`салмі`) but remains provisional and is **not** selected by `transliterate_korean` while IPA status is unresolved.

Added case `IPA-021` for 삶의 to `research/ipa-adjudication-queue.json`, with direct NIKL MCFAQ evidence, both official Hangul surface readings, no candidate IPA, blank reviewer fields, and `BLOCKED_SPECIALIST_ADJUDICATION`. The queue now has 21 cases: 20 in the pinned surface-regression fixture plus this separately sourced high-risk case. The blinded packet builder and validator remain generic; fixed-size tests were updated, and the queue-coverage test now requires all fixture cases while permitting separately sourced cases with official evidence. A 2016 corpus/acoustic paper was added to `research/SOURCE-REGISTER.csv` as limited evidence only; its full text and item-level reuse license remain unavailable/unassessed.

The first CI pass after queue expansion correctly caught fixed-count assumptions and a mismatch between the revised IPA and stored Ukrainian reference. These were repaired: queue size assertions now use the canonical queue size, the queue-coverage test allows the separately sourced case, and the provisional Ukrainian reference is aligned with the revised IPA without bypassing the target gate. The later system verification at run 40028573329 and test suite at run 40028573395 completed successfully (Python 3.11–3.13, web tests/build, Python regression/data integrity, browser regression/build). The NIKL metadata-only job was skipped. The source-register row then increased its audited row count from 101 to 102, and the corresponding audit-test expectation was updated; final CI for that latest source-register/test adjustment must be checked before marking the whole branch verified.


### Final verification closeout — 2026-10-24

The final code/data/test state is commit `30f1eab3043148193a74fb5d977033b74937726c`. All available relevant workflows passed:
- Tests (Python 3.11, 3.12, 3.13 and web): [run 40028810510](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810510).
- System verification: [run 40028810736](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810736).
- Master table / strict research corpus artifacts: [run 40028810589](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810589).
- Optional g2pK integration: [run 40028810621](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810621).
- External UGTPHON diagnostic: [run 40028810616](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810616).

The official NIKL metadata-only source inventory was skipped; this is not a pass. The current branch head later received only a source-register wording correction from “20-case” to “21-case” (`59b17390cca11142618df348019f8b02f0781239`); no runtime or test logic changed after the green code/test commit. Structural CSV validation after the correction found 102 source rows, 12 columns, and zero malformed-width rows. Local cloning remained blocked by unavailable DNS for github.com.

The focused research work is now complete as a documented evidence review, not a scientific adjudication. Current status:
- **DONE_VERIFIED:** form-specific diagnostic-only IPA gate; explicit primary/alternate candidate fields; target selection blocked while unresolved; queue expanded to 21 cases; queue/packet tests use canonical case count; source registry updated; full available CI passed.
- **BLOCKED_SPECIALIST_ADJUDICATION:** qualified independent reviewers must adjudicate the exact 삶의 broad IPA and convention. The 2016 Seoul Corpus study is indirect evidence only.
- **BLOCKED_SPECIALIST_REVIEW:** Ukrainian target adaptation must be evaluated separately on frozen, adjudicated IPA.
- **BLOCKED_EXTERNAL_ACCESS:** official NIKL inventory remains skipped.
- **DEFERRED:** probabilistic n-insertion modeling; compact forms requiring morphology/spacing analysis.

Do not merge this as a scientific release claim: the implementation is safer and the regression evidence is green, but the product remains a research preview / partial prototype until specialist adjudication and target-layer validation are complete.

### Direct NIKL inventory follow-up — 2026-10-24 (supersedes “skipped” as the final status)

The previous PR-run status showed the official NIKL metadata-only inventory as skipped because the job's condition only permits `research/nikl-*` refs. I did not leave the gate there. On dedicated diagnostic branch `research/nikl-metadata-inventory-2026-10-24`, the existing crawler was executed against three official URL variants without changing crawler safeguards:

- [Run 40029487614](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029487614): canonical `www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002` → HTTP 403.
- [Run 40029571329](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029571329): official mobile `www.korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002` → HTTP 403.
- [Run 40029630066](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029630066): canonical hostname without `www` → HTTP 403.

In each case, the collector logged `NIKL crawl BLOCKED: Official source denied or rate-limited this request (HTTP 403); do not bypass access controls.` and exited 3; the workflow records the expected access block as a warning. A green job conclusion therefore means the block was correctly classified, **not** that the source inventory passed. The first run's evidence artifact is [nikl-source-crawl-40029487614](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029487614/artifacts/12533748777). The official source URL is discoverable via public search indexing, but direct page retrieval also returns 403 in the web retrieval environment; search excerpts cannot supply a trustworthy full-page response hash or complete item-level metadata manifest.

**Current gate: `BLOCKED_EXTERNAL_ACCESS`, not `DONE_VERIFIED` and not merely `skipped`.** Completion acceptance remains: authorized direct source retrieval or an official export; all 30 articles reconciled with no missing, duplicate, or incomplete extraction; a validated metadata-only manifest with source and article hashes; and artifact/log review. Do not bypass the 403 or retain full article text without terms review. The diagnostic branch contains workflow-only endpoint experiments and is not part of PR #281's proposed production change.


### Local NIKL source capture and metadata inventory route — 2026-10-24

The collector already supports importing a locally saved official HTML page with `--input-html`; no duplicate crawler was added. Direct official desktop, mobile and bare-host endpoint attempts all returned HTTP 403 and must remain classified as `BLOCKED_EXTERNAL_ACCESS`. Search-index snippets are not equivalent to the original captured response.

Added `docs/NIKL-LOCAL-CAPTURE-AND-INVENTORY-2026-10-24.md` with the authorized browser-save procedure, exact Windows PowerShell-compatible command shape, fail-closed acceptance checks, and explicit limits of local-import provenance. Raw HTML must remain local and must not be committed. The manifest defaults to metadata and hashes only; it does not certify rights, rule interpretation, or IPA/target correctness.

Acceptance remains pending until a complete manifest is generated from an authorized official capture, reports all 30 articles with no missing/duplicate/incomplete records, and receives a human spot-check of article and subarticle structure. This documentation change does not claim the external inventory is complete and does not change the research-preview release status.


### Independent Korean IPA engine comparison — 2026-10-24

PR [#280](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/280) expands the existing native-vs-g2pk diagnostic to four additional executable baselines: KoG2P (pinned GPL-3.0 external checkout), hangul_to_ipa (pinned MIT external checkout), eSpeak NG via phonemizer, and phonemize 2.0.1. The raw corpus and third-party engine source are not vendored. KPD remains BLOCKED_ACCESS_AND_TERMS because authorized access and terms have not been verified; the 2022 research modification is not treated as executable until a reproducible implementation can be pinned.

Verified scoring run: [40069800681](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40069800681), artifact [12550916606](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40069800681/artifacts/12550916606). The scoring implementation was unchanged by subsequent report/matrix documentation commits on PR #280. The initial phonemize run is excluded because its adapter returned unchanged Hangul; after enabling and smoke-testing anyAscii preprocessing, the corrected run produced non-Hangul IPA and scored all eligible tokens.

Pinned UGTPHON Korean test split: 275 rows, 2,703 eligible token occurrences, 1,907 unique words. Results:
- ClippyFirst native: 2,653/2,703 scored; 648 exact (24.4252%); CER 17.0604%; 50 explicit abstentions; no runtime exceptions.
- g2pk 0.9.4: 2,703/2,703 scored; 675 exact (24.9723%); CER 16.6931%.
- KoG2P: 402 exact (14.8724%); CER 26.0795%.
- hangul_to_ipa: 404 exact (14.9464%); CER 30.9851%.
- eSpeak NG / phonemizer: 220 exact (8.1391%); CER 39.0498%.
- phonemize 2.0.1 with corrected adapter: 542 exact (20.0518%); CER 21.3645%.

On the 2,653-occurrence paired subset, g2pk scored 25.2167% exact vs native 24.4252%; paired delta +0.7915 percentage points (95% row-cluster bootstrap CI +0.4538 to +1.1924 pp). Paired CER delta was −0.3822 pp (95% CI −0.6055 to −0.2083 pp). These intervals exclude zero on this particular diagnostic set, but no multiple-comparison correction is applied, IPA annotations may be noisy/convention-dependent, and g2pk output is converted through the repository's segment renderer. This is evidence for a modest benchmark-specific g2pk advantage, not proof of universal superiority.

Full protocol, candidate register, confidence intervals and limitations: [docs/MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md](MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md). The coverage matrix and benchmark protocol are now merged into `main`. No production pronunciation rules were changed by this benchmark.

Remaining scientific gates are unchanged: official NIKL full-text inventory remains BLOCKED_EXTERNAL_ACCESS after HTTP 403; independent broad-IPA adjudication and separate Ukrainian target-layer review remain outstanding. This benchmark is not NIKL normative gold and does not score Ukrainian adaptation. The repository remains a research preview / partial prototype, not release-ready.

Integration outcome — 2026-10-24: PR #281 was squash-merged first as `f1c06f00a3cc6a724a8c5f155dbb8dbb50749c3e`; PR #280 was then reconciled against the updated `main` handoff and squash-merged as `6dc576db96ee12b0201a6271c5b3ea6b3710ae21`. The two PRs' shared handoff changes are reconciled; GitHub reports no open PRs at this checkpoint. The live official NIKL HTTP inventory remains blocked by HTTP 403; the local-file inventory is separately verified below. Post-merge CI on implementation commit `ddaf07ede4b83adb730e83269dcb50f7959fdbef` subsequently passed; see the post-merge verification record at the end of this handoff.


### NIKL local HTML inventory — 2026-10-24

The repository already contained `한국어 어문 규범.htm`; no user upload or duplicate source file was needed. The existing metadata-first importer was run against this committed file on dedicated branch `research/nikl-local-html-import-2026-10-24`.

- [Workflow run 40072018648](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072018648) succeeded.
- Manifest: `reports/nikl/standard-pronunciation-manifest.json`.
- Source size/hash: 322,678 bytes; SHA-256 `11dccd3c6eafb5167a6f448c2ccb5fc45fd698c5b2d1570ed3d1e5c177fa7a1e`.
- Parser inventory: 30/30 article records, IDs `NIKL-SP-01`–`NIKL-SP-30`; missing, duplicates, unexpected, incomplete, and parser errors all empty.
- Manifest contains article titles, anchors, normalized character counts, extraction status, and per-article text hashes; article text and raw HTML are not copied into the manifest.
- Provenance correctly remains `local-html-import`; no live HTTP response, robots check, or terms review is claimed.

The PR adds a source/manifest parity regression test and a reproducible GitHub Actions workflow that schema-validates the manifest, re-runs the parser against the checked-in HTML, and compares all generated metadata while normalizing only the import timestamp.

**Gate classification:** extraction from the exact repository file is technically complete. Source-capture authenticity and reuse rights remain `BLOCKED_EXTERNAL_ACCESS` / `not_assessed` because direct NIKL endpoints previously returned HTTP 403 and the local import cannot independently establish the capture history or license terms. Human spot-check of article/subparagraph structure and individual rule interpretation is still required. This does not unblock independent IPA adjudication or Ukrainian target-layer review; release status remains research preview / partial prototype.


### Post-merge verification — implementation commit ddaf07ede4b83adb730e83269dcb50f7959fdbef

PR [#282](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/282) was squash-merged into `main` as `ddaf07ede4b83adb730e83269dcb50f7959fdbef`. Post-merge checks tied to that exact commit:

- [tests — run 40072283801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283801): PASS.
- [NIKL local HTML inventory — run 40072283788](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283788): PASS; JSON schema validation and deterministic metadata parity pass, 30/30 articles, manifest artifact uploaded.
- [system verification — run 40072283773](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283773): PASS; its live NIKL crawl correctly remained BLOCKED by HTTP 403 and was not counted as an inventory pass.
- [master table and research corpus artifacts — run 40072283771](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283771): PASS.
- [GitHub Pages deployment and live browser smoke — run 40072283743](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283743): PASS; live browser smoke exercised 1,443 Korean input characters and observed 2,780 Ukrainian output characters and 3,725 IPA characters.

No open PRs remained after #282 merged. The scientific status is still research preview / partial prototype, not release-ready: capture authenticity/reuse rights and human rule-structure review remain open, as do independent IPA adjudication and Ukrainian target-layer review.


### NIKL manifest metadata-boundary correction — 2026-10-24

- **Why:** review of the repository-held HTML showed that v1's `title` field duplicated the complete normative clause text, despite the artifact being described as metadata-only. Also, each per-article `textSha256` spans the entire page block from one article heading to the next, including the official explanatory commentary and examples; it must not be misrepresented as a hash of only the normative clause.
- **Status: DONE_VERIFIED for the metadata-boundary correction.** PR [#284](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/284), branch `research/nikl-metadata-scope-hardening-2026-10-24`, bumps the manifest schema to v2. Article `title` is only `제N항`; `normativeTextSha256` and `normativeCharCount` fingerprint the clause wording without retaining it; `sourceUnitScope=article-block-including-official-commentary-and-examples` explicitly scopes the larger block hash. The committed manifest was regenerated from the existing HTML, retaining source SHA-256 `11dccd3c6eafb5167a6f448c2ccb5fc45fd698c5b2d1570ed3d1e5c177fa7a1e` and all 30 article records.
- **Verification evidence on exact head `60538bb917881c203795f8c21e207f8e704a8bff`:** tests matrix [40074199214](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199214) PASS; system verification [40074199217](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199217) PASS; NIKL schema/reproducibility [40074199284](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199284) PASS; corpus artifacts [40074199207](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199207) PASS. Intermediate failures during schema migration were fixed and rerun; they are retained as development history, not counted as final verification.
- **Still blocked:** the HTML's capture authenticity and capture-time source access/robots state cannot be inferred from its contents; reuse terms are not assessed; human spot-check of article/explanation/example boundaries remains required. Independent IPA adjudication and Ukrainian target-layer review remain separate scientific blockers. This change does not alter pronunciation behavior.


### Post-merge closeout — NIKL manifest schema v2 (2026-10-24)

- **Integration:** PR [#284](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/284) was squash-merged into `main` as implementation commit `47c712c9aa7ad35673024de55ba2baaf709e670b`. No open PRs remained at the post-merge check.
- **Main-head verification on `47c712c9aa7ad35673024de55ba2baaf709e670b`:** [tests 40074373782](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074373782) PASS; [system verification 40074373802](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074373802) PASS; [master table / research corpus artifacts 40074373761](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074373761) PASS; [NIKL local HTML inventory, schema and deterministic regeneration 40074373779](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074373779) PASS. The inventory workflow uploaded metadata-only artifact [12552468095](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074373779/artifacts/12552468095). [GitHub Pages deployment and live browser smoke 40074373817](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074373817) also PASS, including deployed-page smoke and adversarial Korean practical-mode browser exercise.
- **Executed path:** existing `scripts/nikl-norm-crawler.mjs` local import on `한국어 어문 규범.htm`; schema-v2 JSON Schema validation; deterministic manifest regeneration compared with the committed artifact except the naturally changing `importedAt`; Node browser regression suite; Python 3.11/3.12/3.13 regression/data checks; strict research-corpus generation; static site build and deployment smoke. The raw HTML remains the repository's existing source file; no copy was added by this work.
- **Task ledger:** `DONE_VERIFIED` — local HTML inventory is 30/30; schema-v2 metadata semantics, clause fingerprints, source-block scope, reproducibility and tests are verified. `BLOCKED_EXTERNAL_ACCESS` — live NIKL HTTP retrieval still returns 403 and the local file's capture authenticity cannot be established from the file alone. `BLOCKED_TERMS_REVIEW` — source reuse/redistribution terms not assessed. `BLOCKED_HUMAN_SOURCE_REVIEW` — subparagraph, commentary, examples and cross-references still need human spot-check before source passages are considered adjudicated evidence. `BLOCKED_SPECIALIST_ADJUDICATION` — independent broad IPA gold remains absent for unresolved cases. `BLOCKED_SPECIALIST_REVIEW` — Ukrainian target adaptation remains separately unvalidated.
- **Release classification:** research preview / partial prototype, not release-ready. Inventory completeness is not evidence of full pronunciation correctness or permission to redistribute source-derived text.


### Research-only morphology adapters — post-merge closeout (2026-10-24)

- **Task ledger:** `DONE_VERIFIED` — optional Kiwi/MeCab-Ko adapters, fake-engine contract tests, diagnostic runner, 16-input unlabelled review list, optional dependency extras, real-engine CI workflow, README, and acceptance gates are integrated into `main`. PR [#290](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/290) was squash-merged as `40abc854ba6a9877e0eb4bd9b53d1036aa2d7b52`.
- **Real-engine smoke:** [run 40078877780](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40078877780) PASS on the pre-merge code-identical head. Kiwi analyzed 16/16 inputs and emitted 40 tokens (about 1.10 s including initialization); MeCab-Ko analyzed 16/16 inputs and emitted 37 tokens (about 0.0015 s after initialization). Both artifacts declare `accuracy_claim=none_no_gold_segmentation`. Token counts/timing are diagnostic, not accuracy evidence.
- **Pre-merge exact-head checks:** [tests 40078877773](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40078877773), [system verification 40078877930](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40078877930), [corpus artifacts 40078877776](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40078877776), [g2pK 40078877822](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40078877822), [UGTPHON 40078877779](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40078877779), [paired native-vs-g2pk 40078877838](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40078877838), and [multi-engine IPA 40078877803](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40078877803) all PASS.
- **Post-merge verification on main commit `40abc854ba6a9877e0eb4bd9b53d1036aa2d7b52`:** [tests 40079044625](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40079044625) PASS (web plus Python 3.11/3.12/3.13); [system verification 40079044649](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40079044649) PASS; [corpus artifacts 40079044760](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40079044760) PASS; [GitHub Pages deployment and live practical-mode adversarial smoke 40079044743](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40079044743) PASS. The NIKL inventory step remained skipped due the known live-source HTTP 403 and is not counted as passed.
- **Fixes discovered during verification:** initial smoke attempts exposed a missing pytest install, comment lines being misread as inputs, and a mismatch between MeCab-Ko binding APIs. The workflow now installs test dependencies, the runner skips corpus comments, and the adapter supports the documented Rust binding, `python-mecab-ko`, and compatible legacy MeCab API. Final real-engine smoke passed for both engines.
- **Scope guard:** research-only Python adapter. It emits token forms, raw tags, source offsets, nullable lemma, and selected MeCab binding in diagnostic output; it does not emit pronunciation/IPA/Ukrainian output or automatically change phonology. The browser practical mode was not modified by the PR; post-merge live practical-mode regression passed.
- **Remaining blockers:** independent IPA adjudication; Ukrainian target-layer review; NIKL source reuse/terms and human clause-boundary review; specialist review of any future morphology-to-rule licensing; accuracy benchmarking against an adjudicated morphology corpus.
- **Release classification:** research preview / partial prototype, not release-ready. Successful analyzer installation and tokenization do not prove phonological correctness or Ukrainian transliteration quality.

## Continuation update — IPA→Ukrainian target abstention diagnostics (2026-10-24)

**Status:** diagnostic implementation merged and CI-verified.  
**PR:** [#306](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/306)  
**Code head tested by PR workflows:** `2f12ec34daa7a595d7bd411ab3d268294fbb71fb`  
**Merge commit:** `d12b41b1440de27f54a7ff63340e164d7759b024`.

- **DONE_VERIFIED — diagnostics:** shared IPA→Ukrainian rendering reports per-word `reason`, per-segment `segment_reasons`, adapter status and aggregate `unavailable_reasons`; native `transliterate_korean` reports `target_unavailable_reason` and `target_unavailable_segments`.
- **DONE_VERIFIED — fail-closed behavior:** no target spelling is inferred from feature similarity alone; lexical target references do not bypass the IPA→target boundary; whole Ukrainian output remains unavailable if any required word/segment is unresolved.
- **DONE_VERIFIED — PR-head CI:** all eight PR-triggered workflows completed successfully on code head `2f12ec34`: tests, system verification, corpus artifacts, optional g2pK, external UGTPHON diagnostic, paired native-vs-g2pK diagnostic, research morphology smoke, and multi-engine IPA diagnostic. Run IDs: [40126739786](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40126739786), [40126739821](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40126739821), [40126739758](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40126739758), [40126739753](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40126739753), [40126739791](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40126739791), [40126739773](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40126739773), [40126739772](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40126739772), [40126739752](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40126739752). This is exact PR-head evidence; it is not a claim that workflows were separately rerun on the merge commit.
- **TODO — reproducible 24-form reconciliation:** the exact frozen 24-form input list is not yet located in tracked fixtures reviewed for this continuation. Do not reconstruct it from counts or memory. Acceptance: commit the original 24 inputs with source/provenance and per-form engine status, IPA evidence, target failure reason, and expected abstention/output state; regenerate a deterministic report from that fixture.
- **BLOCKED_SPECIALIST_ADJUDICATION — 7 native strict cases:** unresolved Korean source phonology needs source-grounded rule-environment review and, where necessary, independent pronunciation adjudication. No diagnostic engine output is promoted to normative gold by itself.
- **BLOCKED_DEPENDENCY / PARTIAL_TARGET_COVERAGE — 17 target cases:** the Korean base install does not automatically provide private UPI 0.8.0, and the current target correspondence export is partial. Resolve package access/version/export separately from correspondence coverage; then review each IPA→Ukrainian mapping with explicit provenance. Installing UPI alone does not establish missing mappings. UPI packaging PR [#10](https://github.com/ClippyFirst/Ukrainian-Phonetic-Inventory/pull/10) is still open and its latest observed CI run [40126696199](https://github.com/ClippyFirst/Ukrainian-Phonetic-Inventory/actions/runs/40126696199) failed; its job logs were not retrievable through the inspected endpoint, so wheel-install support remains unverified.
- **Release classification:** research preview / partial prototype, not release-ready. The diagnostic code is verified, but full Korean→Ukrainian accuracy is not: there is no independently adjudicated target-output gold set, and the 24-form list is not yet reproducibly committed.

**Next acceptance gate:** find or recover the original 24-form list from a verifiable repository artifact/run input; add it as a tracked fixture without altering its membership; produce a per-form JSON/Markdown reconciliation; then resolve only evidence-supported phonology and target mappings.


## Continuation — author-owned ClippyFirst target renderer (2026-10-24)

**Work branch:** `fix/clippyfirst-core-ipa-target-2026-10-24`  
**PR:** [#310 — make ClippyFirst native IPA target renderer self-contained](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/310)  
**Base:** `main` at `cf77fcba215172d64a3f46d9401f662529fc947e`. Latest handoff edit is followed by further CI runs; retrieve the branch ref before recording a final head SHA.

### Implementation completed on the branch

- Added `src/korean_ukrainian/ipa_target_renderer.py`: IPA-only, longest-match rendering using local canonical correspondence rows plus explicit sequence overrides; trace includes mapping IDs, source references, status, word/syllable indices and source-length treatment.
- Added `data/korean/ipa_target_overrides.csv` and extended `data/correspondence/target_contract.csv` to distinguish the external Ukrainian Phonetic Inventory (UPI) metadata/candidate diagnostics from the locally owned Korean IPA→Ukrainian practical mapping.
- Routed native and G2P-derived Python practical output through the local renderer. UPI is optional and diagnostic-only; it no longer selects the output. The existing fail-closed gate for unresolved/diagnostic-only Korean IPA remains upstream.
- Added renderer tests for explicit/longest matches, 643 canonical lexical rows and 45 declared alternate readings, length markers, unknown IPA, trace provenance and provisional rounded-vowel mappings.
- Updated Python integration tests to distinguish target correspondence status from UPI's heuristic candidate score. Updated README, target-layer contract, benchmark register and target-adjudication blockers in place.
- The original frozen 24-form holdout is intentionally not copied into this PR: the reviewed mainline trees do not establish its exact membership/order. No candidate reconstruction is promoted to source-verified gold.

### CI feedback and fixes

- Browser regression/build passed on early PR head `3e4d94db795caa5efe78fdf9aec20d87b038d7ce` in the system-verification workflow.
- Python system verification on that head failed one remaining stale assertion in `tests/test_end_to_end.py`: it expected `score_type=heuristic_cost` for practical output. The contract now correctly distinguishes `explicit_correspondence_not_probability` for the locally rendered target from `heuristic_cost` for optional UPI candidate diagnostics; the end-to-end test was updated to assert both fields.
- An earlier run on an intermediate test head also exposed old adapter tests that expected UPI absence to suppress local output. Those assertions were updated to test local practical rendering and UPI diagnostic failure separately.
- Exact-head checks after these fixes are queued/in progress. Do not mark PR #310 `DONE_VERIFIED` until the latest branch head's Python 3.11–3.13 tests, browser tests/build, wheel clean-install check, system verification and relevant artifacts complete successfully. The official NIKL live inventory job may remain skipped/blocked by HTTP 403 and is not a pass.

### Scientific acceptance boundary

- The 643-row and 45-alternate checks prove reproducibility of project-declared outputs, not independent Ukrainian accuracy.
- `model-selected` means an explicit project mapping, not gold. `ɰi→ий`, `ø→ве`, `y→ві`, and `kʰjʌ→кхьо` remain provisional where marked.
- The target renderer does not repair Korean source phonology. Diagnostic-only IPA must continue to withhold Ukrainian output.
- The historic 7 unresolved-phonology / 17 target-blocker count is not reconciled with the candidate fixture's 5 / 19 diagnostic split. Recover the exact original fixture and its report first; never force the counts.
- Remaining blockers: independent Korean broad-IPA adjudication; independently reviewed Ukrainian target gold set; source-grounded resolution of the original 24-form list; exhaustive rule/exception/variant coverage; final exact-head CI.

**Status:** `PARTIAL` until exact-head CI completes; research preview / partial prototype, not release-ready.


### Follow-up: browser target renderer parity and trace audit (2026-10-24)

Latest follow-up commits on the same PR branch add the browser mapping-data projection, make target confidence/status visible in browser trace, and add cross-runtime parity coverage.

- `src/app/ipa_target_data.js` is generated from the canonical correspondence CSV and explicit override registry; `scripts/generate_ipa_target_data.py --check` is now asserted by Python tests to prevent drift.
- `src/app/engine_ipa.js` exposes detailed per-token provenance, project mapping status, unknown-sequence fail-closed behavior, and feature-loss notes for aspiration, fortisness, unreleased stops, and vowel length.
- `src/app/engine_convert.js` now returns `target_status`, detailed target mappings/features in trace, and fails closed for empty IPA as well as unknown mappings.
- `src/main.js` surfaces provisional/unavailable target status rather than presenting every mapped string as equally certain.
- `tests/test_ipa_target_renderer.py` compares browser and Python rendered text, overall status, token mapping IDs and token statuses across 13 shared IPA inputs. The assertion uses the actual Python trace key `mapping_status` (not `status`).
- `tests/ipa-ukrainian-trace.test.mjs` checks provisional mapping provenance, IPA feature losses, source/IPA syllable alignment, punctuation retention, and empty-IPA fail-closed behavior.
- Stale override `source_ref` values that pointed to code paths were changed to the stable project-decision documentation anchor; this avoids pretending the implementation code itself is the linguistic evidence.

**Verification state:** GitHub Actions runs were created for head `5ef8393ecb1565d4ae6ba3f8e62ca52c09d74d98`, but were still queued at last check. Earlier CI results do not verify this final head. Do not report these additions as passing until the exact-head workflows complete. If parity tests fail, correct the contract or implementation rather than weakening assertions to force green. 


### Follow-up: exact-head CI failure triage and regression fixes (2026-10-24)

**Observed exact-head CI result:** run [40131875165](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40131875165) on `94631cc169d74146d12cb0c70b004288523775ab` failed both browser and Python suites. The failure logs were inspected, not inferred from the red badge.

- Browser failures were stale assertions against the pre-detail trace schema: the old length-marker test expected `omitted-from-ukrainian-target` and a lower-case note, while the detailed renderer now emits a typed `vowel-length` feature and explicit `preserved-in-IPA-not-rendered-in-ukrainian-target` handling. The test now asserts the actual documented detailed contract.
- Browser runtime-invariant test used deep equality against the legacy three-field result despite the new trace contract exposing status, reason, mapping trace, and provenance. It now checks the compatibility fields individually while also asserting the new status/provenance contract; implementation detail is not hidden merely to satisfy an outdated snapshot.
- Python/browser parity test introduced a repository-root variable but passed the misspelled uppercase `ROOT` to subprocess. This was corrected to use `root`.
- The browser suite passed on intermediate head `428f8e1dae2bf2c86e80bd203ee8939cf538d8f3`; its Python suite still failed because of the case-sensitive root variable. The final correction is commit `317f0f106d230b10bbc42219ca1f9c3e5a369aa2`. New exact-head CI is required before any PASS claim.

**Task ledger at this handoff:**

| Task | Status | Evidence / acceptance |
|---|---|---|
| Local ClippyFirst IPA→Ukrainian renderer and trace provenance | PARTIAL | Implementation exists in Python and browser layers; exact-head CI must pass and the independent target gold set remains missing. |
| Browser/Python mapping parity | PARTIAL | Cross-runtime test covers 13 shared IPA inputs; final-head run must pass without weakening the comparisons. |
| Deterministic browser mapping artifact | PARTIAL | Generator and `--check` drift test added; generator/build checks must pass on final head. |
| Restore original 24-form fixture | BLOCKED_MISSING_SOURCE | Candidate list remains provenance-tagged as reconstructed from a prior handoff. Acceptance requires an authoritative tracked artifact or a verifiable source plus exact membership/order; do not promote candidates to gold. |
| Independent Korean broad-IPA adjudication | BLOCKED_SPECIALIST_ADJUDICATION | Internal engine agreement is not independent gold; resolve with source-grounded rule environments and reviewed pronunciation evidence. |
| Independent Ukrainian target accuracy | BLOCKED_SPECIALIST_REVIEW | Project-selected mappings and provisional overrides are not adjudicated target gold; acceptance requires a reviewed, licensed target set and explicit scoring protocol. |
| Official NIKL live metadata inventory | BLOCKED_EXTERNAL_ACCESS | Previous direct official endpoints returned HTTP 403; the normal-branch job being skipped is not a pass. Acceptance requires authorized retrieval, complete articles 1–30 reconciliation and hashed metadata manifest. |
| Release gate | PARTIAL / NOT RELEASE-READY | PR #310 remains open; final-head CI and empirical source/target gates are outstanding. |

No test is considered passing solely because a test file exists. The latest known head at this edit is `317f0f106d230b10bbc42219ca1f9c3e5a369aa2`; refresh branch refs and CI before finalizing this record.


### Verification closeout after regression fixes (2026-10-24, supersedes earlier queued status)

- **DONE_VERIFIED — system Python + browser regression/build on code-and-doc head `e462d15d9d31d4889ad562095ecb93f39247e8fe`:** [workflow run 40132735568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132735568) completed successfully. Python regression/data-integrity and browser regression/build both passed. Official NIKL metadata inventory was **skipped**, not passed.
- **DONE_VERIFIED — focused tests workflow on code head `317f0f106d230b10bbc42219ca1f9c3e5a369aa2`:** [run 40132671600](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132671600) passed. The only later change before `e462d15` was documentation/task-ledger updates.
- **DONE_VERIFIED — generated master table/research corpus artifacts on `e462d15`:** [run 40132738836](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132738836) passed.
- **DONE_VERIFIED — paired native-vs-g2pK diagnostic, external UGTPHON diagnostic, and browser G2P integration on `e462d15`:** runs [40132738928](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132738928), [40132738858](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132738858), and [40132738885](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132738885) passed. The paired/UGTPHON runs remain diagnostic and do not constitute normative IPA gold or Ukrainian-target accuracy.
- **PARTIAL — remaining benchmark workflows:** optional g2pK integration, research morphology adapter smoke, and multi-engine IPA diagnostic were still running at last check. Recheck their terminal status before a release decision; earlier successful runs on other heads do not substitute for these exact-head runs.
- **PR convergence (updated 2026-10-25):** at an earlier snapshot, PR #307 and #310 had identical Python renderer/pipeline blobs. The correctness-gate and candidate-presentation changes on #310 have since made the shared files diverge. #310 now carries the strict Python candidate gate plus browser UI candidate labeling; #307 still carries the unverified 24-form fixture and provenance audit. Both PRs remain open/mergeable; do not merge blindly or discard the fixture audit. Before convergence, compare the current diff and port only non-conflicting fixture/provenance work. Neither PR establishes the original 24-form source.
- **Latest tracked branch head at this note:** `e462d15d9d31d4889ad562095ecb93f39247e8fe`. A documentation-only update will trigger fresh checks; refresh the branch ref and wait for those checks before declaring the final PR head verified.


### Final exact-head verification — 2026-10-24

**Verified implementation head:** `a80cacf0f2c36c40a172ea24aad5a67bb9ba5756`. The latest code change is `317f0f106d230b10bbc42219ca1f9c3e5a369aa2`; commits after that are documentation/task-ledger changes only.

All nine relevant workflow families completed successfully on `a80cacf`:
- System verification: [40132976136](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976136) — Python regression/data integrity and browser regression/build passed.
- Focused test matrix: [40132976087](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976087) — passed.
- Generated master table and research corpus: [40132976175](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976175) — passed.
- Optional g2pK integration: [40132976258](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976258) — passed.
- Browser G2P integration: [40132976122](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976122) — passed.
- Paired native-vs-g2pK diagnostic: [40132976161](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976161) — passed as diagnostic only.
- External UGTPHON diagnostic: [40132976197](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976197) — passed as diagnostic only.
- Multi-engine IPA diagnostic benchmark: [40132976215](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976215) — passed as diagnostic only.
- Research morphology adapter smoke: [40132976263](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132976263) — passed, including Kiwi and MeCab-Ko adapter contract/real-engine smoke and strict/soft IPA comparisons.

**Explicit non-pass:** the official NIKL live metadata inventory job was skipped in system verification. Prior official endpoint attempts returned HTTP 403; no complete live inventory was generated.

**PR reconciliation (updated 2026-10-25):** PR #310 and PR #307 are both open and mergeable. Their Python renderer/pipeline blobs matched at an earlier snapshot but now diverge after #310's strict provisional-target gate. #310 includes browser-side generated mapping/trace/parity and UI candidate labeling; #307 carries the quarantined `reconstructed_unverified` 24-form fixture and provenance audit. Do not close or merge either blindly. Port fixture/provenance work only after checking its current diff against the strict output contract. The manifest `data/korean/ipa_holdout_2026-10-24.json` remains absent from inspected tracked refs, so original membership/order has not been restored.

**Final task ledger:** core implementation/regression verification `DONE_VERIFIED` on the recorded code head; original 24-form provenance `BLOCKED_MISSING_SOURCE`; independent Korean IPA adjudication `BLOCKED_SPECIALIST_ADJUDICATION`; independent Ukrainian target gold `BLOCKED_SPECIALIST_REVIEW`; official live NIKL inventory `BLOCKED_EXTERNAL_ACCESS`; release readiness `PARTIAL / NOT RELEASE-READY`. No IPA or Ukrainian gold labels, benchmark accuracy, or source licenses were fabricated.


### Final verification and target-status policy — 2026-10-25

The strict IPA→Ukrainian renderer and direct browser adapter abstain on provisional mappings by default, returning a separately traceable candidate and `provisional_mapping_requires_review`. The research pipeline/UI explicitly opt in to show candidate output with a provisional status, so it remains useful without claiming independent adjudication. Regression tests and clean-wheel checks cover both paths. Exact-head CI is still required after the latest changes.

The original 24-form holdout provenance, independent Korean IPA adjudication, independent Ukrainian target review, and complete official NIKL inventory remain blocked; do not infer release readiness from software CI alone.


### Final exact-head closeout — 2026-10-25

**Verified code/test head:** `4f65943b514992b89ce31df5db2d4e971dc0b6a9`. The production/research target-status correction is implemented: strict Python/browser target APIs abstain on provisional mappings and expose a traceable candidate; the research conversion pipeline explicitly opts in to show the candidate with `provisional` status, and lexical variants preserve that status. Browser and Python output parity tests now use explicit research mode when comparing candidates.

All nine relevant workflow families passed on this exact code head:
- System verification [40135565733](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565733).
- Focused Python/browser tests and wheel install [40135565670](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565670).
- Browser G2P [40135565682](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565682); optional g2pK [40135565680](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565680).
- Master table/research corpus artifacts [40135565706](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565706).
- Paired native/g2pK diagnostic [40135565751](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565751).
- External UGTPHON diagnostic [40135565684](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565684).
- Research morphology adapter smoke [40135565675](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565675).
- Multi-engine IPA comparison, including the pinned SIGMORPHON lexical split [40135565671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565671).

The NIKL live metadata inventory was skipped and is **not** counted as a pass. Independent gold adjudication is still absent: the original 24-form source/ordering is not recovered; IPA and Ukrainian target correctness require separate independent review. PR #307 and #310 remain open/mergeable because of overlapping renderer work; neither was merged blindly. **Final classification: improved and software-verified research prototype, still not release-ready.**


### Benchmark outcome and interpretation — exact code head `4f65943` (verified 2026-10-25)

The multi-engine workflow passed and produced these **Korean IPA** diagnostic results; they are not Ukrainian-target accuracy scores:

| Dataset | ClippyFirst native | g2pK 0.9.4 | Interpretation |
|---|---|---|---|
| UGTPHON Korean test, 275 rows / 2,703 token occurrences | 2,655 scored; 98.22% coverage; 1,412 exact; exact rate 53.18% (bootstrap 95% CI 48.49–58.20%); CER 9.19%; 48 abstentions; 0 runtime errors | 2,703 scored; 100% coverage; 1,435 exact; exact rate 53.09%; CER 9.23%; 0 runtime errors | Near parity on paired examples; native is more conservative. |
| SIGMORPHON 2021 Korean lexical test, 1,000 rows / 999 token occurrences | 997 scored; 99.80% coverage; 357 exact; exact rate 35.81%; CER 14.70%; 2 abstentions; 0 runtime errors | 999 scored; 100% coverage; 353 exact; exact rate 35.34%; CER 14.82%; 0 runtime errors | Small paired advantage to native on this pinned lexical split. |

These exact-match rates are **not 90–95%**. The reference sets use IPA conventions that are not identical to the project's broad IPA (including phonetic diacritics and segment/annotation differences); normalization removes only selected convention differences. The corpora also have scope/annotation limitations. The 9.19% and 14.70% character error rates show substantially closer sequences than exact-match rates alone suggest, but neither metric proves normative correctness. Some differences may be real phonological errors; do not attribute all to notation. The next benchmark improvement must come from categorized mismatch review against independently adjudicated IPA, not from relaxing normalization until the score rises.

Most native abstentions on UGTPHON are deliberate unresolved morphophonological contexts: 25 R002 liaison/neutralization cases, 20 R003 ㅎ deletion cases, 2 R007 palatalization cases, and 1 each for R004 aspiration and IPA adjudication. These are coverage limitations, not runtime exceptions. This benchmark does not measure IPA→Ukrainian mapping accuracy.


### Research UI candidate presentation — 2026-10-25

The strict IPA adapter remains fail-closed by default. The interactive research workbench, however, is designed to provide the best available candidate for inspection rather than blanking common cases with provisional target mappings. The main output card and its copy action now explicitly say **provisional Ukrainian candidate** whenever the target status is provisional; a warning explains that it is not independently validated. Trace rows label provisional segment spellings as candidates. This preserves research usability without representing candidates as confirmed orthography. The Python public pipeline remains strict and returns `candidate_orthography` separately when the target mapping is provisional.


### Final correctness-focused implementation batch — 2026-10-25

The browser research workbench and Python public pipeline now have deliberately different, explicit presentation contracts. The low-level Python IPA renderer remains strict: provisional correspondences yield no accepted `ukrainian_orthography` and return a separate `candidate_orthography` plus `provisional_mapping_requires_review`. The Python public pipeline no longer opts into provisional output. The interactive browser workbench still presents the best declared candidate for research usefulness, but its main result label, copy button, warning, trace rows and status explicitly identify it as provisional. This avoids silently hiding common candidate output while preventing it from being represented as independently validated orthography.

**Verification evidence at code head `5ccb880d0c0611efa1f7ef8ffd00a0d303778410`:**
- System verification [40177877602](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40177877602): success. Browser regression/build and Python regression/data integrity jobs passed; official live NIKL inventory was skipped, not passed.
- Browser G2P integration [40177877624](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40177877624): success; 1,220 tests passed, 0 failed.
- Dedicated test workflow [40177877599](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40177877599): success.
- Optional g2pK [40177877654](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40177877654), paired native/g2pK [40177877600](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40177877600), external UGTPHON [40177877596](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40177877596): success as integration/diagnostic checks, not independent IPA or Ukrainian gold.
- Python G2P differential report remains diagnostic: 18/20 surface forms equal, with differences on `넓죽하다` and `읽고`; IPA gold was not independently adjudicated.

A subsequent UI-copy wording-only commit is `239f6fc6dc5dfc9478d552fa99c3ca2c60fa4f30`. This is not a claim of full linguistic correctness. The original 24-form holdout provenance, independent IPA adjudication, independent Ukrainian target gold, and live NIKL inventory remain open blockers. Release classification remains **partial research prototype, not release-ready**.


### Final exact implementation-head verification — 2026-10-25

The final code head for the provisional-candidate gate and UI safeguards is `b41da53614f660d7f4b71fc9613730661715262b`. All nine relevant workflow families passed on this head:
- System verification [40178373051](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40178373051): Python regression/data integrity and browser regression/build passed. Official NIKL live inventory was skipped and is not a pass.
- Browser G2P [40178373030](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40178373030): 1,220/1,220 tests passed.
- Dedicated tests [40178373064](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40178373064): web suite, Python 3.11/3.12/3.13, and clean wheel installation passed.
- Generated master table/research artifacts [40178373059](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40178373059), optional g2pK [40178373090](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40178373090), paired native/g2pK [40178373033](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40178373033), external UGTPHON [40178373035](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40178373035), multi-engine IPA diagnostic benchmark [40178373027](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40178373027), and morphology adapter smoke [40178373061](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40178373061): all passed.
- The Python G2P differential remains 18/20 surface forms equal; `넓죽하다` and `읽고` still differ. These are diagnostic differences, not IPA gold-scored errors.

The implementation is software-verified, but linguistic correctness is not fully established: original 24-form source/ordering, independent Korean IPA adjudication, independent Ukrainian target gold, and authorized live NIKL inventory remain blocked. Classification remains **partial research prototype, not release-ready**.


### Exact-head correctness hardening — 2026-10-25

**Code under verification:** `b55df50cbc806497055c81cd29d309dc849ff9b2` on `fix/clippyfirst-core-ipa-target-2026-10-24`.

This pass closes a user-facing correctness gap: a `provisional` IPA→Ukrainian correspondence is no longer exposed as accepted `ukrainian` output. The Python renderer returns `ukrainian_orthography: null` plus a separate `candidate_orthography`; the browser native engine and practical g2pK adapter now withhold the complete accepted result if a provisional target occurs, retain a full `candidate_ukrainian`, label the candidate in the UI, and copy the candidate rather than an empty result. This applies to multiword input as well as single tokens. Korean phonology status remains separate from target-layer status; a target-layer uncertainty does not falsely relabel resolved IPA as unresolved Korean phonology.

Regression updates explicitly distinguish accepted orthography from candidate text and verify the IPA adapter reproduces candidate mappings in research opt-in mode. Verification on code head `b55df50cbc806497055c81cd29d309dc849ff9b2`:
- System verification: pass — [40183597497](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183597497); Python regression/data integrity and browser regression/build passed.
- Browser G2P: pass — [40183601946](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601946).
- Dedicated tests: pass — [40183601969](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601969): 1,220/1,220 web tests; Python 3.11, 3.12, 3.13 and wheel installation passed.
- Master table/research artifacts [40183601984](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601984), optional g2pK [40183601959](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601959), paired native/g2pK diagnostic [40183601967](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601967), UGTPHON diagnostic [40183601986](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601986), multi-engine diagnostic benchmark [40183601966](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601966), and morphology adapters [40183601968](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601968): all passed.
- Official live NIKL inventory remains **skipped**, not passed. This is an external-access/source-verification blocker.
- No independent Korean IPA gold or independent Ukrainian target gold was used. These software tests establish deterministic implementation behavior and parity, not linguistic accuracy.
- The original ordered source manifest for the 24-form holdout is still unverified; the reconstructed fixture remains quarantined and must not be described as restored from the original source.

Readiness: **software-verified research prototype; not release-ready** until source provenance and independent linguistic/target adjudication gates are closed.


### Final source-head acceptance update — 2026-10-25

The phrase-level fail-closed regression was added and verified on source/test commit `4686fd7119fe85043c4e6b32199188bd23487a1c`. The dedicated suite passed **1,221/1,221 browser tests**, Python 3.11/3.12/3.13, and clean wheel installation ([tests 40183919607](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919607)). System verification passed ([40183915965](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183915965)); browser G2P ([40183919654](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919654)), optional g2pK ([40183919624](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919624)), generated master table/research artifacts ([40183919655](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919655)), paired native/g2pK ([40183919614](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919614)), external UGTPHON ([40183919696](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919696)), multi-engine IPA diagnostic benchmark ([40183919643](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919643)), and morphology adapter smoke ([40183919637](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919637)) also passed. Official live NIKL inventory was skipped, so source-level acceptance remains open.

A subsequent documentation-only commit records this status; it does not change the implementation tested above. The repository remains a software-verified **partial research prototype**, not release-ready. Original 24-form manifest provenance, independent Korean IPA adjudication, independent Ukrainian target gold, and authorized live NIKL access remain acceptance blockers.


### Browser adapter failure semantics hardening — 2026-10-25

The public `ipaTargetForSource` API now returns `text: null`, an explicit unavailable reason, and no partial syllable/mapping trace for empty IPA, unknown IPA, or source/IPA alignment mismatch. It no longer uses an empty string that consumers could accidentally interpret as a successful spelling. Added regression cases for unknown/empty input and partial-output suppression. Exact-head CI is required before treating this change as verified.


### UI status wording correction — 2026-10-25

The workbench now checks `candidate_status === 'provisional'` before displaying the generic unavailable-target note. This prevents a result that includes a clearly labelled provisional candidate from being described only as “Ukrainian output unavailable.” The candidate remains explicitly unaccepted; this is a status-communication fix, not a linguistic-confidence upgrade. Exact-head CI is pending.


### Empty-render hardening — 2026-10-25

Closed a fail-open edge case: IPA containing only separators or length marks could previously pass through the Python renderer as an empty `model-selected` spelling; the browser detailed trace could similarly treat length-mark-only IPA as model-selected. Both adapters now require at least one mapped IPA token. Added regression cases for `.`, `...`, `ː`, `.ː.`, and `#`. Exact-head CI is pending.


### Target-layer truth-in-labeling — 2026-10-25

The workbench now states that `model-selected` Ukrainian output follows project-defined correspondences and has not been independently validated. The status is intentionally distinct from Korean phonology status: the source IPA may be resolved while the target spelling remains a project decision. Provisional correspondences remain candidate-only. This avoids implying that successful deterministic rendering equals independently proven linguistic correctness.


### Final exact-head verification and disposition — 2026-10-25

**Current branch head:** `ab9a0ad7ea96e73c7fc76a8a97a3bf5f9ff16d38` on `fix/clippyfirst-core-ipa-target-2026-10-24`. PR #310 remains open and mergeable; it has not been merged. PR #307 remains open and overlaps PR #310 in 14 files; do not merge both without reconciling the shared renderer/pipeline/tests. Its candidate 24-form fixture remains quarantined because the original ordered manifest is not verified.

Final-head CI:
- System verification [40189298362](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40189298362): **success**; Python regression/data integrity and browser regression/build passed. Official live NIKL inventory: **skipped** by workflow condition.
- Dedicated test matrix [40189298327](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40189298327): **success** — web, clean wheel install, Python 3.11, 3.12 and 3.13.
- Browser G2P [40189298365](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40189298365), optional g2pK [40189298358](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40189298358), paired native/g2pK [40189298328](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40189298328), pinned UGTPHON [40189298333](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40189298333), multi-engine benchmark [40189298339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40189298339), morphology adapter smoke [40189298350](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40189298350), and generated master/research artifacts [40189298360](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40189298360): **all success**.

The pinned Korean IPA diagnostic benchmark reported native ClippyFirst exact match **53.18%** with **98.22%** coverage and CER **9.19%** on the 2,703 eligible UGTPHON token occurrences (48 abstentions, 0 engine errors). On the 999 eligible SIGMORPHON 2021 lexical pairs, exact match was **35.81%**, coverage **99.80%**, CER **14.70%** (2 abstentions, 0 engine errors). These are Korean G2P/IPA diagnostics, not Ukrainian target accuracy; they show that the native engine is functional but still has substantial pronunciation error.

The latest software hardening:
- provisional IPA→Ukrainian mappings remain candidate-only by default;
- empty, delimiter-only, unmapped, and source/IPA-misaligned inputs fail closed without partial output;
- UI wording distinguishes candidate/unavailable status and states that `model-selected` target spellings are project-defined, not independently adjudicated.

**Disposition:** software-verified partial research prototype, **not release-ready**. Remaining acceptance blockers: verified primary source for the original 24-form list; independent Korean IPA adjudication/gold; independent Ukrainian target gold and evaluation protocol; authorized live NIKL inventory. No invented gold labels, phonological forms, or accuracy claims were added.


### End-to-end correctness continuation — 2026-10-25

**Implementation branch:** `fix/clippyfirst-core-ipa-target-2026-10-24`. **Code/evidence head:** `aca93752c5d059300baf33bd576a5a0fea8fa4fa`.

Changes completed in this batch:
- Public browser IPA helper APIs now fail closed for empty, separator-only, feature-only and hard-unmapped IPA; a multi-syllable call does not return partial Ukrainian output if any segment fails.
- Provisional mappings remain candidates unless research opt-in is explicitly boolean; opting in preserves the `provisional` status rather than relabelling it as model-selected.
- Failure results retain diagnostic mapping traces without returning a partial target string.
- Restored the 24-form diagnostic candidate fixture, provenance audit, regression test and JSON report runner from PR #307 onto the active renderer branch. The fixture remains explicitly `reconstructed_unverified`, with no fabricated IPA or Ukrainian gold.
- The optional g2pK workflow now runs the fixture audit on Python 3.11 and 3.12 and uploads per-runtime JSON artifacts.

Exact-head checks on the code/evidence head:
- Browser tests/build [40191515088](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515088): **success**, 1,231 browser tests passed, 0 failed; public build succeeded.
- System verification [40191515073](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515073): **success**; Python regression/data integrity and browser build passed. Official live NIKL inventory was **skipped**, not passed.
- Optional g2pK [40191515065](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515065): **success** on Python 3.11 and 3.12; target-renderer tests **20 passed** per runtime, fixture report generated and artifact uploaded, wheel data check passed.
- Browser G2P [40191515045](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515045), UGTPHON diagnostic [40191515110](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515110), paired native/g2pK diagnostic [40191515125](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515125), multi-engine benchmark [40191515023](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515023), morphology smoke [40191515056](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515056), and generated master/research artifacts [40191515019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515019): **all success**.

Current diagnostic fixture report: **18/24 accepted native orthographies + 1 provisional native candidate**; **23/24 accepted g2pK orthographies + 1 provisional g2pK candidate**. These are output/abstention counts only, not accuracy: both gold-label sets are unavailable. The 24 inputs remain an unverified reconstruction and must not be described as the original frozen holdout.

Disposition remains **PARTIAL / research prototype, not release-ready**. Outstanding acceptance gates: recover and hash the original 24-form manifest or create a separately named verified benchmark; obtain independent Korean IPA adjudication; obtain independent Ukrainian target gold and a scoring protocol; resolve the known native-vs-g2pK surface disagreements `넓죽하다` and `읽고` with primary evidence; obtain authorized official NIKL inventory evidence. No gold labels, linguistic forms, or target-accuracy scores were invented.

## Continuation update — primary-source adjudication of two G2P disagreements (2026-10-25)

- **DONE_VERIFIED_SOURCE — `넓죽하다`:** NIKL Rule 10 explicitly gives `넓-죽하다[넙쭈카다]` and explains the lexically restricted ㄼ → [ㅂ] exception. Primary source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307219. NIKL also gives `넓죽한[넙쭈칸]` in a 2025 answer: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=317348.
- **DONE_VERIFIED_SOURCE — `읽고`:** NIKL explicitly gives `읽고[일꼬]` and explains why the fortition must not be naively attributed to a surviving [ㄹ]. Primary source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=329463.
- **Evidence artifact:** `docs/PRIMARY-SOURCE-ADJUDICATION-2026-10-25.md` records the source scope, exact surface forms, rule interpretation, test implications and remaining acceptance gates.
- **Important boundary:** these sources adjudicate official Hangul surface-form expectations only. They do not constitute IPA gold or Ukrainian target gold. Raw upstream G2P outputs must remain inspectable; any correction is exact-form, narrow, and provenance-carrying.
- **TODO — implementation regression confirmation:** ensure the current branch has source-linked exact-form tests for both forms, test raw engine outputs separately from corrected surface forms, and run the relevant browser/native/G2P workflows on the exact resulting head. This connector session can commit repository files but cannot execute the checkout's local test suite.
- **BLOCKED_SPECIALIST_ADJUDICATION:** independent broad IPA for both forms.
- **BLOCKED_INDEPENDENT_TARGET_GOLD:** Ukrainian practical output accuracy remains unmeasured.
- **BLOCKED_MISSING_ORIGINAL:** original 24-form holdout provenance is still unverified; keep the fixture labelled `reconstructed_unverified`.
- **BLOCKED_EXTERNAL_ACCESS:** live NIKL inventory retrieval remains skipped/unverified; a skipped workflow is not a successful retrieval.
- **Release classification:** software-verified research prototype, not release-ready. The two Korean surface-form disputes now have primary-source evidence, but no full-system accuracy claim is justified.

## Continuation update — CI regression repaired at source-contract level (2026-10-25)

- **CI evidence on prior head:** workflow runs for commit `11a82dba4c43b704caabd495c773c537e06d3a4a` reported Browser G2P failure (run 40192385447) and system verification failure (run 40192385433). Python regression/data-integrity passed; browser tests failed at `tests/g2pk-nikl-surface-corrections.test.mjs:63` because the assertion still required obsolete wording `NIKL §§10, 23` after the evidence was tightened to the exact NIKL Q&A identifier `qna_seq=307219`. Result: 1 failing browser test, 1,230 passing; build skipped due to test failure.
- **Repair made:** source register now contains explicit rows `SRC-NIKL-QNA-307219` and `SRC-NIKL-QNA-329463`; the `읽고` lexical row points to qna_seq=329463 and accurately labels the Hangul surface reading as directly attested, while IPA/target remain provisional. The exact-form regression test now checks the exact source IDs rather than stale general-rule prose, and checks the lexical source URL/note against the current NIKL answer.
- **Latest branch commit at this update:** `81408985218837736077366edfe6e495f6db35e1`. GitHub Actions runs/statuses for this exact head were not yet returned by the connector when queried; therefore the repair is **not yet CI-verified**. Do not mark the gate passed until fresh exact-head workflows complete.
- **PR status:** PR #311 remains open and unmerged, layered on PR #310's branch. Its mergeability signal changed to false after the successive content commits; inspect/reconcile the branch relationship and fresh GitHub mergeability before merge. Do not merge blindly.
- **Status ledger:**
  - `DONE_VERIFIED_SOURCE`: exact NIKL surface evidence for `넓죽하다 → 넙쭈카다` and `읽고 → 일꼬`.
  - `PARTIAL`: source-linked correction allowlist, source register, lexical provenance, and tests updated; exact-head browser CI pending.
  - `BLOCKED_MISSING_ORIGINAL`: original 24-form holdout manifest/order remains unverified; candidate fixture stays quarantined as `reconstructed_unverified`.
  - `BLOCKED_SPECIALIST_ADJUDICATION`: independent Korean IPA labels/convention still missing.
  - `BLOCKED_INDEPENDENT_TARGET_GOLD`: independently annotated Ukrainian practical targets and scoring protocol still missing; no target accuracy claim.
  - `BLOCKED_EXTERNAL_ACCESS`: official live NIKL inventory job is skipped under workflow conditions; it is not a successful retrieval.
- **Acceptance criterion for this repair:** fresh workflows on the latest head pass the focused NIKL correction tests, the full browser suite/build, Python regression/data integrity, and source-register validation. The project remains a software-verified research prototype, not release-ready, until the independent linguistic and provenance gates are resolved.

## Follow-up continuation — second exact-head CI regression pass (2026-10-25)

A later CI cycle on `64e0e5650551593e2602f4d165fa9b139f019756` exposed six stale assertions/inventory expectations after the source update. The failures were not suppressed; the implementation/data/tests were reconciled:

- **Rule-mapping assertions:** restored explicit `§§11, 23` in the `읽고` lexical note while retaining the direct qna_seq=329463 citation and keeping IPA/Ukrainian target provisional.
- **Source-scope assertion:** updated batch-18 tests to expect the exact qna_seq=329463 attestation and source-register URL, while preserving the distinction that qna_seq=334294 is contextual support only.
- **Traceability audit:** the lexical note now has explicit article references, so the repository's audit snapshot of 0 unnumbered-rule notes matches the dynamically calculated test expectation.
- **Source-register inventory:** two new official-source rows raise the expected row count from 103 to 105 and REVIEW_REQUIRED from 99 to 101; unresolved item-level rights remain visible.
- **Focused correction regression:** the prior obsolete `NIKL §§10, 23` assertion was replaced with exact source-ID assertions; lexical provenance and source-register records are aligned.

The follow-up changes are committed on the same dedicated branch. At the moment of this update, the latest commit is `86223328ae9c88b294a0793fff2a7814e4052c37`; the connector had not yet returned fresh workflow runs for this exact commit. Therefore all fixes remain **pending exact-head CI verification** until the next workflow cycle is inspected. The previous failures remain part of the audit trail and must not be represented as passes.

Current acceptance boundary is unchanged: NIKL surface-form evidence is verified for the two exact forms, but independent IPA gold, Ukrainian target gold, original 24-form holdout provenance, and live NIKL inventory retrieval are still blocked. PR #311 is open and unmerged on top of PR #310; current GitHub metadata reports it mergeable, which is not a substitute for passing checks.

## Exact-head verification outcome after source-contract repair — 2026-10-25

The source-register/lexical-provenance/test repairs are now verified on code head `3b60d971bb7916b0418c90474c62fd4bb033dfdc`:

- **Browser G2P integration:** PASS, run [40192863070](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40192863070), 1,231 tests passed, 0 failed.
- **System verification:** PASS, run [40192863065](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40192863065): Python regression/data integrity and browser regression/build passed. The official NIKL live inventory step was skipped, not passed.
- **Paired native-vs-g2pk diagnostic:** PASS, run [40192863167](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40192863167). On the pinned UGTPHON Korean test split (275 rows, 2,703 eligible token occurrences): native exact rate 0.531827, CER 0.091883, 48 abstentions; g2pk 0.530892 exact, CER 0.092285, zero abstentions. Diagnostic only; no Ukrainian target evaluation.
- **External UGTPHON diagnostic:** PASS, run [40192863206](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40192863206).
- **Multi-engine IPA benchmark:** PASS, run [40192863213](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40192863213). On the same 2,703 UGTPHON occurrences, exact rates/CER were: native 0.531827/0.091883 (48 abstentions); g2pk 0.530892/0.092285; KoG2P 0.273030/0.195122; hangul_to_ipa 0.162412/0.248054; eSpeak NG Korean 0.081391/0.336101; phonemize 0.425453/0.143531. On SIGMORPHON 2021 Korean lexical test (999 eligible forms), native 0.358074 exact / CER 0.147037 (2 abstentions); g2pk 0.353353 / 0.148222; KoG2P 0.187187 / 0.218327; hangul_to_ipa 0.089089 / 0.298448; eSpeak NG 0.043043 / 0.407236; phonemize 0.289289 / 0.174387.
- **Interpretation boundary:** these public datasets score Korean surface-pronunciation predictions, not IPA independently adjudicated by Korean specialists and not Ukrainian practical transcription. They support a reproducible comparative diagnostic, not a target-accuracy or linguistic-gold claim.
- **Source registry:** 105 records; 101 remain in REVIEW_REQUIRED, and item-level reuse/KOGL status remains unresolved for the newly registered Q&A records. Strict rights acceptance stays blocked.
- **Status ledger:** exact Korean surface source claims for `넓죽하다` and `읽고` are `DONE_VERIFIED_SOURCE`; focused regression and system tests are `DONE_VERIFIED` on the code head; the 24-form original manifest, independent Korean IPA adjudication, independent Ukrainian target gold, and live NIKL inventory remain blocked. No PR was merged.

The final documentation successor will record these exact-head results; because that successor is a new commit, do not call its checks passed until its own workflow runs complete.

## Continuation — 48 native abstentions and morphology-consensus path (2026-10-25)

### Root cause, not a runtime failure

Historical pre-recovery baseline: the pinned UGTPHON Korean test split contains 2,703 eligible token occurrences. Native strict mode scored 2,655 and abstained on 48 occurrences across 47 unique forms, with zero engine exceptions. The contexts are morphology-conditioned: R002 liaison/neutralization (25 contexts), R003 ㅎ-coda deletion (20), R007 palatalization (2), R004 complex-coda + ㅎ aspiration (1), and one independent IPA-adjudication block. The context counts sum to 49 because one occurrence has two unresolved contexts.

The strict/soft and boundary-gated comparison already exists in the repository; its artifact is run [40191515056](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515056). Strict scores 53.1827% exact / 9.1883% CER at 98.2242% coverage. Soft scores 53.0818% exact / 9.1868% CER at 99.0381% coverage. MeCab boundary-gated scores 53.1063% exact / 9.1927% CER at 98.8531% coverage; Kiwi boundary-gated scores 53.1086% exact / 9.1984% CER at 98.7791% coverage. The paired strict/soft subset has unchanged exact/CER metrics. This evidence does not support changing strict default: reducing abstentions alone does not demonstrate higher accuracy.

### Implementation added on `fix/native-abstention-consensus-current-main-2026-10-25`

- Added `src/korean_ukrainian/morphology_rule_licenses.py`: exact-form licenses are derived only where two distinct optional morphology analyzers agree on a character-aligned boundary and the right-hand POS tag belongs to a conservative formal-morpheme class. Overlapping/zero-width spans and one-analyzer disagreements are rejected. It does not infer spaces or license substantive-morpheme contexts.
- Any rule applied from this source is marked `analyzer-supported-low-confidence`; the resulting IPA is `diagnostic_only_analyzer_morphology`. The adapter cannot produce accepted Ukrainian output.
- Extended the existing `scripts/benchmark_morphology_ipa_delta.py` with `--analyzer consensus`, reusing the established strict/soft benchmark and scoring contract rather than creating a duplicate strict/soft benchmark.
- Added `.github/workflows/morphology-consensus-diagnostic.yml` to run both optional analyzers on the pinned UGTPHON split and upload the diagnostic report.
- Added unit tests for consensus on `같아서` / `좋아`, lexicalized `많이`, a disagreement on `같이`, zero-width morphology, and the diagnostic-only IPA status.
- Exact NIKL source IDs for `넓죽하다 → 넙쭈카다` and `읽고 → 일꼬` are already present in the current mainline adapter and regression test; the source adjudication is documented in `docs/PRIMARY-SOURCE-ADJUDICATION-2026-10-25.md`.

### Task ledger

| Task | Status | Acceptance / blocker |
|---|---|---|
| Explain 48 strict abstentions | `DONE_VERIFIED_PRIOR_HEAD` | Occurrence-level audit and existing CI artifact show morphology-conditioned fail-closed behavior, not runtime errors |
| Strict vs soft comparison | `DONE_VERIFIED_PRIOR_HEAD` | Existing artifact is diagnostic and not a fresh run on this branch |
| Analyzer-consensus licensing implementation | `PARTIAL` | Code and fixture tests added; must pass exact-head CI and consensus benchmark before adoption |
| Reduce all 48 abstentions | `DEFERRED_UNSAFE_AS_A_BLANKET_GOAL` | No blind removal of abstentions; some cases need segmentation, others source/IPA review |
| Original 24-form holdout provenance | `BLOCKED_MISSING_ORIGINAL` | `data/korean/benchmarks/target-renderer-holdout-24.csv` is `reconstructed_unverified`; no reviewed historical tree or artifact established exact original membership/order |
| Independent Korean IPA gold | `BLOCKED_SPECIALIST_ADJUDICATION` | Independent broad-IPA annotation/convention still missing |
| Independent Ukrainian target gold | `BLOCKED_INDEPENDENT_TARGET_GOLD` | Independently annotated target outputs and a scoring protocol still missing |
| Live official NIKL inventory | `BLOCKED_EXTERNAL_ACCESS` | Prior workflow skipped live retrieval; a skip is not a pass |
| Source rights | `PARTIAL` | Existing registry has 105 records; 101 still require item-level license/KOGL review |

### Verification boundary

The new consensus implementation has not yet been validated by a fresh exact-head workflow at the time of this handoff update. The current branch is based on the current `main` ref, and the final PR must wait for its own test, system verification, browser regression, and morphology-consensus benchmark results. Do not merge or call release-ready on the basis of prior-head benchmark artifacts.

Release classification remains **software-verified research prototype / partial prototype, not release-ready**. The correct near-term objective is evidence-backed candidate coverage with visible uncertainty, not forcing all 48 abstentions to disappear.

## Final continuation update — abstention, morphology consensus, and source provenance (2026-10-25)

### Findings and measured behavior

At the pre-recovery checkpoint, the 48 strict-mode abstentions on UGTPHON were **fail-closed unresolved contexts, not runtime errors**: 48 occurrences across 47 unique forms. Context counts are R002 liaison/neutralization (25), R003 ㅎ-coda deletion (20), R007 palatalization (2), R004 complex-coda + ㅎ aspiration (1), and one independent IPA-adjudication blocker. These total 49 contexts because `많을거같이` contains two unresolved contexts.

Existing strict/soft and boundary-gated results are from the pinned research artifact [40191515056](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515056); the strict/soft benchmark was reused, not duplicated:

| Strategy | Scored / 2703 | Coverage | Exact matches | Exact rate | CER | Unresolved occurrences |
|---|---:|---:|---:|---:|---:|---:|
| Native strict | 2655 | 98.2242% | 1412 | 53.1827% | 9.1883% | 48 |
| Native soft | 2677 | 99.0381% | 1421 | 53.0818% | 9.1868% | 26 |
| MeCab boundary-gated | 2672 | 98.8531% | 1419 | 53.1063% | 9.1927% | 31 |
| Kiwi boundary-gated | 2670 | 98.7791% | 1418 | 53.1086% | 9.1984% | 33 |

Soft mode adds 22 scored occurrences but lowers exact rate slightly. Boundary-only gating is not sufficient evidence for rule licensing. The new optional two-analyzer consensus mode requires both analyzers to agree on a source-aligned boundary and formal POS tag; it rejects overlapping/zero-width spans and withholds all licenses where both analyzers indicate an unspaced MAG→VV/VA/VX boundary.

The guarded consensus benchmark passed in [run 40196942415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40196942415) on a prior code head: 2,684/2,703 scored (99.2971% coverage), 1,423 exact (53.0179%), CER 9.1930%, 19 unresolved occurrences, 0 engine exceptions. It yielded diagnostic candidates for 28 unique strict-mode abstentions (29 occurrences). Paired strict-vs-consensus exact/CER were unchanged. Compared with strict, coverage improves but exact rate and CER are slightly worse; this is a **candidate-coverage improvement, not an accuracy improvement**. The strict default is unchanged, and all analyzer-derived IPA remains diagnostic-only.

### Correctness and provenance changes

- Added `src/korean_ukrainian/morphology_rule_licenses.py` and `--analyzer consensus` to the existing benchmark, plus a pinned dual-analyzer UGTPHON workflow.
- The adapter withholds licenses for likely unspaced adverb-to-verb phrases, preserving phrase-level uncertainty instead of pretending to reconstruct missing spaces.
- The remaining 19 unresolved forms include independent IPA review (`삶의`), complex-coda/ㅎ morphology (`긁혔다는거지`), analyzer disagreements/contractions (`있었`, `했었음`, `군대보냈어야`, `좋아해주는`), lexicalized boundaries (`많이본`, `많을거같이`), likely unspaced phrases (`못잃어`, `안늙었는데`, `개같이못하고`), and noisy/contracted endings (`쫒아내면`, `많앗구나유유유`, `무서웟어`, `죽었잖아`, `웃어넘기겟지만`). The current head's refreshed report enumerates the exact remaining contexts.
- Ported the unique diagnostic-only IPA safety invariant from stale PR #307 into `g2pk_engine.py`: lexical IPA marked `diagnostic_only_unresolved_pronunciation` is not treated as an exact accepted override, its status is propagated through the g2pK adapter, and the target gate must return unavailable. The regression test exercises the real IPA-adjudication overlay for `삶의`.
- The raw JavaScript g2pK port intentionally remains pinned. The Python differential warning compares that raw port, not the practical browser adapter. For `넓죽하다` and `읽고`, raw JS differs from NIKL, while `src/app/g2pk_web.js` applies exact-form corrections to `넙쭈카다` and `일꼬` before IPA. The differential report now labels this as an expected raw-port divergence covered by the adapter, and the browser regression asserts the corrected surfaces.
- Added the corroborating NIKL Q&A qna_seq=317348 to `research/SOURCE-REGISTER.csv`. The register now has 106 records; 102 remain `REVIEW_REQUIRED`. This row is not rights-cleared; item-level KOGL review remains open.

### Current task ledger

| Task | Status | Acceptance / blocker |
|---|---|---|
| Explain strict 48 abstentions | `DONE_VERIFIED_PRIOR_HEAD` | Reproducible artifact; fail-closed contexts, not runtime errors |
| Strict/soft/boundary benchmark | `DONE_VERIFIED_PRIOR_HEAD` | Existing pinned artifact, not a fresh target-accuracy evaluation |
| Dual-analyzer consensus implementation | `DONE_VERIFIED_PRIOR_HEAD` | Guarded benchmark passed on prior head; final-head rerun still pending |
| Diagnostic-only IPA target gate | `PARTIAL` | Code and regression added; final-head tests still pending |
| Raw-port versus practical-adapter report | `PARTIAL` | Corrected report/assertions added; final-head test run pending |
| Original 24-form holdout provenance | `BLOCKED_MISSING_ORIGINAL` | The CSV remains `reconstructed_unverified`; exact original membership/order not recovered |
| Independent Korean IPA gold | `BLOCKED_SPECIALIST_ADJUDICATION` | Requires independent expert annotation and convention |
| Independent Ukrainian practical-transcription gold | `BLOCKED_INDEPENDENT_TARGET_GOLD` | Requires independently annotated targets and a scoring protocol |
| Live NIKL inventory retrieval | `BLOCKED_EXTERNAL_ACCESS` | Prior official live-inventory workflow skipped; not a pass |
| Source rights | `PARTIAL` | 106 records, 102 require item-level rights review |

### Branch and verification state

- Current branch: `fix/native-abstention-consensus-current-main-2026-10-25`, based on main commit `c55230a5ae864578205d9d3dc392e3f1dd097a4b`.
- PR #314 is the active continuation. PR #313 was closed as superseded; its branch was not deleted. PR #310 is merged. PR #311 is closed/unmerged, but its exact-source records and corrections are present on current main.
- PR #307 remains open pending final-head verification; its unique diagnostic-only IPA gate is now ported here, while its older renderer/holdout changes are superseded by the newer mainline implementation. Close it only after the current safety test passes.
- The latest code head before this documentation-only update is `839fd65748ab88f9c0054b8b9b023d48c427c307`; the refreshed workflow set was queued, not completed, at the time of this update. Earlier code-head test/system/browser/benchmark workflows passed, but they do not verify the latest source-register count and regression-report changes. Do not claim the final head passed until its own workflows complete.
- Local checkout/tests remain unavailable in this session due the earlier GitHub DNS failure; CI is the verification source.

Release classification remains **software-verified research prototype / partial prototype, not release-ready**. The next acceptance gate is exact-head CI plus independent IPA and Ukrainian target gold; removing every abstention is not a valid goal if it requires guessing.
## Continuation — strict/soft interface and abstention-aware scoring (2026-10-25)

- The existing morphology-consensus work in PR #314 is preserved and used as the implementation base. This continuation adds no second consensus adapter and no duplicate consensus workflow.
- The Python CLI and FastAPI now expose the already-existing `morphology_mode="strict"|"soft"` option. Strict remains the default. Soft is rejected with g2pk and in decomposition mode rather than being silently ignored. Its rule trace must remain `heuristic-low-confidence`; the IPA target gate remains in place.
- The existing `scripts/benchmark_morphology_ipa_delta.py` now reports `coverage_adjusted_exact_match_rate = exact_matches / attempted_occurrences` alongside conditional exact-match rate and coverage. This makes the cost of abstentions explicit without counting unresolved output as a correct prediction.
- Tests cover the strict default, soft-mode trace provenance, CLI flag parsing, invalid mode combinations, and coverage-adjusted scoring.
- README documents the CLI/API usage and points to `docs/NATIVE-ABSTENTION-AUDIT-2026-10-25.md`. The previous root-cause table and the analyzer-consensus implementation remain canonical in PR #314; no duplicate 48-case audit document or second benchmark workflow is being added.
- **Exact-head CI pending:** branch `fix/abstention-consensus-api-modes-2026-10-25`; current code head before this handoff update was `ee2b41b2c76314226d689d992642a51e2f90b148`. Verify tests and the existing consensus workflow on the final head before claiming success.
- **Acceptance boundary:** soft mode may raise coverage, but historical measurements show the coverage gain is not an accuracy gain on the common scored subset. Keep strict default and do not promote analyzer-derived IPA to accepted Ukrainian output.

## Consolidated continuation — abstention metrics and recovered holdout (2026-10-25)

- **48-abstention diagnosis is evidence-backed:** strict native has 48 unresolved token occurrences over 47 unique forms, zero runtime errors. The exact-head Kiwi + MeCab-Ko consensus diagnostic passed on [run 40197611605](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40197611605), artifact [12600583566](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40197611605/artifacts/12600583566). Strict: 98.2242% coverage / 53.1827% exact among scored / 52.2383% coverage-adjusted exact / CER 9.1883% / 48 abstentions. Soft: 99.0381% / 53.0818% / 52.5712% / CER 9.1868% / 26 abstentions. Analyzer consensus: 99.2971% / 53.0179% / 52.6452% / CER 9.1930% / 19 unresolved occurrences. Zero runtime errors.
- **Interpretation:** consensus resolves 28 unique words compared with strict, but it remains diagnostic-only and exact match among scored cases decreases slightly. This is not a proven pronunciation-accuracy improvement. Do not remove the strict fail-closed default or promote analyzer IPA to accepted Ukrainian output without independent adjudication.
- **Other CI evidence on that same code head:** paired UGTPHON [40197611630](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40197611630), multi-engine [40197611644](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40197611644), g2pK integration (Python 3.11/3.12) [40197611672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40197611672), morphology smoke [40197611658](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40197611658), and external UGTPHON [40197611715](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40197611715) passed. Full Python/browser verification was still queued at the time of this note; exact-head system checks must finish before the code PR is accepted.
- **Original holdout recovered:** exact frozen manifest Git blob `f30c5fa8a59753df3d7c06bbbe7d4e43d0b8fb26` is now tracked at `data/korean/benchmarks/ipa-holdout-24-manifest.json`; SHA-256 `4596d9ba0494f220dd0a72ba92853f9d33d8f47cb8ba81b700b490a02f0706d5`. Exact 24/24 forms, order, and original case IDs match. Integrity workflow [40197942950](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40197942950) passed; artifact [12600733671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40197942950/artifacts/12600733671). Historical commit/tree/PR/run reference remains unresolved, so membership is `DONE_VERIFIED_MANIFEST_BLOB`, historical origin `PARTIAL`.
- **Gold labels:** the manifest supplies official Hangul surface examples, not broad IPA gold. Independent two-reviewer IPA annotation and adjudication remain `BLOCKED_SPECIALIST_ADJUDICATION`; Ukrainian practical-transcription gold and scoring protocol remain `BLOCKED_INDEPENDENT_TARGET_GOLD`.
- **Live NIKL inventory:** the `research/nikl-` branch is intended to trigger the existing metadata-only official-source crawl. Inspect its actual job outcome; prior runs were skipped or HTTP 403 and are not passes. Site-wide NIKL copyright policy was independently checked in the public web view on 2026-10-25: materials are reusable under Korean Copyright Act Article 24-2 unless a separate KOGL type is displayed ([official policy](https://www.korean.go.kr/front/page/pageView.do?mn_id=105&page_id=P000189)). Individual rules/Q&A item markings remain unverified; keep rights status `PARTIAL` and do not bulk-clear the source registry.
- **PR dependency chain:** PR #314 contains the research-only morphology-consensus adapter; PR #316 adds strict/soft API/CLI access and coverage-adjusted metrics; PR #318 is the holdout recovery and NIKL-crawl follow-up stacked on #316. PR #315 was closed as a duplicate after its complementary changes were ported into #316. Do not merge the stacked PRs out of order.

## CI failure diagnosis and repair — consolidated PR #319

- The first consolidated-head system/browser run [40199083940](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40199083940) surfaced two stale assertions, not production runtime failures:
  1. `tests/nikl-r11-exception-contrast-evidence.test.mjs` still expected `js-port-diverges-from-nikl-normative-output`, while the evidence fixture correctly records the more specific `raw-js-port-diverges-python-matches-nikl-practical-adapter-corrects`. Updated the test to assert the current explicit differential state.
  2. `tests/test_source_register_integrity.py` requires the rights note to state that the item-level KOGL type is “not established.” The new note had described the same uncertainty but omitted that required phrase. Updated the register wording without claiming clearance.
- Fix commits: `32ecab1e80f915891188275db2303f89a46fae52` and `d797335c2e0922efa6f0e87d90cbb79e08834780`. Exact-head system/browser reruns are pending; do not mark those checks complete until they pass.
- The live NIKL crawl itself is **blocked** with HTTP 403 on this runner. The workflow correctly refuses to retry/bypass; the metadata-only inventory is not verified live.

## Continuation — exact-form source evidence for abstention cases (2026-10-25)

- Ported the existing 14-case R002/R003 source-adjudication queue from the stale PR #304 branch without promoting its diagnostic IPA to gold. Queue: `research/r002-r003-source-adjudication-2026-10-24.json`; companion schema/provenance test: `tests/r002-r003-source-adjudication-queue.test.mjs`; review protocol: `docs/R002-R003-SOURCE-ADJUDICATION-AND-HOLDOUT-2026-10-24.md`.
- Added exact-form NIKL surface evidence records for `멋있어` (Q&A 306166), `싫어서` (Q&A 313981), and `수많은` (Korean Basic Dictionary entry 71144). All remain `SOURCE_FOUND_PENDING_IPA`; none supplies independent broad IPA or Ukrainian target gold.
- Browser G2P runtime now uses the exact source readings `싫어서 → 시러서` and `수많은 → 수마는`; the exact dictionary form `수많은` retains `ː` in the inspectable IPA trace. The alternate `멋있어` surface is exposed only when the main surface matches one of the two NIKL-attested forms and the alternate target mapping is fully supported; the generated alternative is `lexical-review`, not gold. No source-Hangul-to-Ukrainian shortcut was added.
- Native strict 48-case abstention count is not changed by these browser-only corrections. Do not report it as resolved; the 14-case queue still needs independent broad-IPA review and separate Ukrainian target review.
- At this earlier checkpoint the source register had 109 rows (105 `REVIEW_REQUIRED`, 2 `MANUAL_CLASSIFICATION_REQUIRED`, 1 `NOT_APPLICABLE_RECORDED`, 1 `ITEM_LEVEL_LICENSE_RECORDED`); this count is superseded by the continuation update below.
- Current implementation branch: `fix/nikl-surface-abstention-corrections-2026-10-25`. Exact-head CI pending; no local test run is claimed. Keep the strict native default unchanged.

## Final continuation — source queue, browser corrections, and mainline verification (2026-10-25)

- PR #319 merged to main as `052392986bd9fbc52430e8ad80d30cf9de0d1ae7`. Post-merge Python 3.11/3.12/3.13, wheel install, browser regression/build, and corpus generation passed. Its first live Pages smoke timed out waiting for rendered output after deployment; the failure was isolated to `scripts/smoke-live-pages-browser.mjs:19` after HTTP asset smoke and Pages deployment succeeded. Failed-job rerun was requested; see run [40207292671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40207292671).
- PR #320 merged as `e7d8ad8371df4b19674b0e05be2dddcf5ad65f92`. Exact-head browser G2P integration [40207971356](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40207971356), tests/wheel/Python matrix [40207971370](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40207971370), system verification [40207971359](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40207971359), and research-artifact generation [40207971388](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40207971388) all passed. Post-merge mainline checks on `e7d8ad8...` also passed Python/browser/system and wheel checks; the Pages deployment workflow is running its post-deploy browser smoke.
- Source-backed browser corrections now cover seven exact forms: the previous five plus `싫어서 → 시러서` (NIKL Q&A 313981) and `수많은 → 수마는` (NIKL Korean Basic Dictionary 71144). The exact dictionary form preserves `ː` in inspectable IPA. For `멋있어`, the other NIKL-attested surface may be exposed only when the primary surface is itself one of the two cited variants and the alternative IPA-to-target mapping is fully supported; the generated variant remains `lexical-review`, not gold. The pipeline remains Hangul → surface reading → IPA → target; no direct Hangul-to-Ukrainian override was added.
- The existing 14-form R002/R003 source queue is now on mainline, with three cases `SOURCE_FOUND_PENDING_IPA` (`멋있어`, `싫어서`, `수많은`) and eleven still lacking exact-form source evidence. Queue: `research/r002-r003-source-adjudication-2026-10-24.json`; review protocol: `docs/R002-R003-SOURCE-ADJUDICATION-AND-HOLDOUT-2026-10-24.md`.
- At this earlier mainline checkpoint native strict mode had 48 abstentions/47 unique forms. PR #328 subsequently reduces the code-equivalent benchmark to six unresolved forms while preserving strict default behavior; the exact-head benchmark and source limits are documented below. Soft heuristic and analyzer consensus remain opt-in diagnostics.
- At this earlier mainline checkpoint the source registry had 109 rows; PR #328 adds four source records across the recovery work, bringing the current branch to 113 rows (109 `REVIEW_REQUIRED`, 2 `MANUAL_CLASSIFICATION_REQUIRED`, 1 `NOT_APPLICABLE_RECORDED`, 1 `ITEM_LEVEL_LICENSE_RECORDED`). The official live NIKL inventory crawl remains `BLOCKED_EXTERNAL_ACCESS`; a skipped crawl is not a pass.
- PR #307 was closed unmerged as superseded by the newer self-contained renderer on mainline. PR #304's source queue and adjudication protocol have been ported; close it only after the error-analysis status reconciliation in the current docs PR is merged. PR #305 remains open for a separate broad-IPA normalization/score-causality audit; its large, diverged branch was not merged wholesale. The 24-form holdout membership is recovered and integrity-verified, but historical origin remains partial, IPA gold is absent, and Ukrainian target gold is absent.

## Follow-up — preserve lexical length in the target feature trace (2026-10-25)

- The exact-form dictionary reading `수많은[수ː마는]` already preserves `ː` in IPA; the browser adapter now also recomputes that syllable's detailed target trace after adding length, so `targetFeatures` explicitly contains `feature=vowel-length` with `handling=preserved-in-ipa-not-rendered-in-ukrainian-target`. This prevents a source-attested IPA feature from being present in the IPA string but absent from the target-layer loss audit.
- Regression `tests/g2pk-nikl-surface-corrections.test.mjs` now asserts the feature-level trace. The target grapheme output is not changed by the length mark, and no IPA/Ukrainian gold label is added.
- Current branch: `fix/nikl-length-trace-provenance-2026-10-25`; head `c5ccf9987f99e0e130182a0297e6ff00b4b5c183`. Exact-head CI is pending.
- PR #322 merged as `e2404ed378d8c509ce559f835346d0e518fda82f`; it adds cache-busting and structured diagnostics to the live Pages browser smoke. The next mainline deployment will verify whether the previous repeated render timeout was CDN propagation or an application defect. Do not call live deployment healthy until that smoke passes.

## Live Pages smoke root cause and corrected acceptance contract (2026-10-25)

- The diagnostic run [40208716593](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40208716593) established that the repeated live smoke timeout was **a test-contract mismatch, not a browser JavaScript exception**: page errors were empty, IPA output was 3,725 characters, but accepted Ukrainian output was empty and the UI status explicitly said it was showing a provisional candidate.
- The existing UI intentionally withholds `#result-ukrainian` when a target mapping is provisional and instead exposes a separate `#candidate-panel` / `#candidate-value`, labelled `Попередній український кандидат`. The old smoke script incorrectly required accepted output for the entire long adversarial passage, contradicting this fail-closed contract.
- The live smoke acceptance now permits either (a) accepted Ukrainian output, or (b) a substantial candidate shown in the separate visible candidate panel with the explicit provisional label/status. It still requires substantial IPA, practical-mode identification, and zero browser exceptions; it fails if the provisional panel is empty or mislabeled. The smoke-contract regression protects this distinction.
- This is not a relaxation of linguistic acceptance: provisional output is never reclassified as accepted output. The mainline deployment after this change must still pass its live smoke; until then deployment verification remains pending.



## Korean abstention recovery continuation — 2026-10-25

- The latest pre-batch exact-head benchmark (run https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40216452439) scored 2,688/2,703, exact 1,425, CER 9.1757%, 15 unresolved, zero engine errors. This is baseline, not the result of the new batch.
- PR #328 adds nine narrow exact-form/pair recoveries in both Python and browser engines. NIKL Q&A 327454 directly confirms 같이 [가치] under Rule 17; the two R007 licenses are restricted to 많을거같이 and 개같이못하고. Other entries are form-scoped applications of existing NIKL rules, not direct full-token source attestations.
- Intentionally withheld: 칡칡이 (uncertain reduplicated morphology), 못잃어 (phrase-level boundary), 쫒아내면 / 많앗구나유유유 / 무서웟어 (no silent spelling repair), and 삶의 (independent IPA adjudication). Exact-head CI and multi-engine artifact must complete before the batch is marked verified.
- Source registry: 113 rows; 109 item-level rights reviews remain REVIEW_REQUIRED.


## Verified status after exact-form recovery batch — 2026-10-25 17:46 UTC

- Branch `fix/source-backed-r003-exact-forms-2026-10-25`, PR #328; latest head `8629906353b4062ccade013b151441a34651d05b`.
- Nine source-scoped recoveries are implemented across R002/R003/R007 in Python and browser strict engines. NIKL Q&A 327454 directly confirms 같이 [가치]; all other new licenses remain exact full-form + adjacent-pair derivations, not direct attestations of every noisy token.
- Full test workflow passed on the latest head: Python 3.11/3.12/3.13, browser suite/build, wheel install. System verification passed Python data integrity and browser regression/build. Master table/research artifact validation and external UGTPHON diagnostic passed. Official live NIKL inventory remained skipped due the existing access limitation.
- Completed multi-engine run on the code-equivalent head `723497ab18a9c71c9d25b1e3055ebe2fdfc3e2a8` reported 2,697/2,703 scored, 1,429 exact, CER 9.1725%, six unresolved, zero engine errors. The latest-head benchmark rerun remains in progress; do not mark it complete until its artifact is published.
- Remaining strict unresolved forms: `칡칡이` (reduplicated morphology unverified), `못잃어` (phrase-level boundary and variable ㄴ-insertion), `쫒아내면` (nonstandard spelling is not silently corrected), `많앗구나유유유` and `무서웟어` (likely spelling errors not normalized), and `삶의` (official source gives variants but independent IPA/target adjudication remains required).
- Source register: 112 rows; 108 `REVIEW_REQUIRED`, 2 `MANUAL_CLASSIFICATION_REQUIRED`, 1 `NOT_APPLICABLE_RECORDED`, 1 `ITEM_LEVEL_LICENSE_RECORDED`. No rights decisions were inferred from source citations.


- Additional residual evidence: NIKL's 2022 language-use survey discusses variable ㄴ-insertion responses in the 못 잃어 phrase family, but its surfaced percentage table is for 못 잇는다 only. Source registered as `SRC-NIKL-USAGE-SURVEY-2022`; no variant or frequency is inferred for the exact token 못잃어.


## Repository-local NIKL skills applied to current evidence batch — 2026-10-25

- Applied `.agents/skills/nikl-evidence-audit/SKILL.md` and `.agents/skills/nikl-rule-coverage/SKILL.md` to the active abstention-recovery PR. The review distinguishes direct NIKL surface attestation, exact-form rule derivation, project IPA, and Ukrainian target; no source reading was promoted to IPA/target gold.
- Applied the evidence-scope inventory from `docs/LEXICAL-EVIDENCE-REVIEW-BATCH-28-2026-10-22.md` to correct a stale skill catalog: current reviewed inventory is 43/60, with 17 citation-only/unreviewed. The count is for the 60-item lexical citation audit, not the full source-register size or the item-level rights audit. Updated the contract test so this documentation drift fails CI.
- Updated existing `research/RULE-COVERAGE.csv` rows R002/R003/R004/R007 in place to reflect the new finite licenses and their limits. Applied the rule-coverage skill's assertion-quality gate by adding output-layer checks in `tests/test_ugtphon_abstention_recovery.py`: source-attested Korean surfaces (`없음`, `싫어서`, `수많은`, `많아서`), actual `같>이` palatalized onset/coda, and the narrow complex-H coda/onset structure. Browser tests independently assert exact Korean surface for the directly attested R003 forms. Exact-head tests passed on `3da5e4deea9dcfb305a5f61dcb0bb4630380cd3b`. These checks validate Korean surface/structure only, not broad IPA or Ukrainian target gold.
- No live NIKL crawl was retried: the official endpoint's recorded HTTP 403 remains an explicit blocker under the crawler skill. No access-control bypass or rights assumption was introduced.


## Final exact-head verification — 2026-10-25 17:54 UTC

- Latest verified code/test head: `3da5e4deea9dcfb305a5f61dcb0bb4630380cd3b`; PR #328 remains open and unmerged.
- The exact-head full test suite, Python/browser system verification, master table/research validation, paired native-vs-g2pk, morphology consensus, research adapter smoke, external UGTPHON diagnostic, and multi-engine benchmark all passed. The official live NIKL inventory job remains skipped because the live collector is blocked by HTTP 403.
- Strict native benchmark: 2,697/2,703 scored, 1,429 exact, CER 9.1725%, six unresolved, zero engine errors. Baseline before this batch was 2,688 scored, 1,425 exact, CER 9.1757%, 15 unresolved. The gain is nine additional scored cases and four exact matches; the CER difference is small and does not prove global accuracy.
- Remaining unresolved cases and criteria: `칡칡이` — independently establish reduplicated morphology; `못잃어` — now has two usage-survey-backed, variant-aware provisional surface candidates; its Ukrainian target is candidate-only; `쫒아내면`, `많앗구나유유유`, `무서웟어` — no silent spelling repair; `삶의` — represent the official surface variants and obtain independent IPA/target adjudication. None should be forced into a single output merely to reduce the counter.
- Current source register: 113 rows; 109 `REVIEW_REQUIRED`, 2 `MANUAL_CLASSIFICATION_REQUIRED`, 1 `NOT_APPLICABLE_RECORDED`, 1 `ITEM_LEVEL_LICENSE_RECORDED`. Live NIKL inventory access remains blocked; rights review remains open.


## Skill-gated output verification checkpoint — 2026-10-25 17:54 UTC

- Added output-layer assertions after reviewing the test suite against `.agents/skills/nikl-rule-coverage/SKILL.md`. Exact-head tests and Python/browser system verification passed on `3da5e4deea9dcfb305a5f61dcb0bb4630380cd3b` (see runs [40218462136](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40218462136) and [40218462072](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40218462072)).
- Official NIKL evidence directly confirms `싫어서[시러서]` (Q&A 313981), `많아서[마ː나서]` (Q&A 334550), and `같이[가치]` (Q&A 306624 / 327454); the Korean Basic Dictionary directly lists `수많은[수ː마는]`. Browser and Python checks assert Korean surface forms/structure without promoting bracket notation to IPA gold.
- Current UGTPHON diagnostic on this head: native 2,697/2,703 scored, 1,429 exact, CER 9.1725%, 6 unresolved, 0 errors; pre-batch baseline was 2,688 scored, 1,425 exact, CER 9.1757%, 15 unresolved. Paired g2pk: 2,703 scored, 1,435 exact, CER 9.2285%. This batch gains 9 scored cases and 4 exact matches; CER improvement is small and does not prove global accuracy. Diagnostic [40218462070](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40218462070).
- The separate SIGMORPHON diagnostic is not interchangeable with the UGTPHON split: native 997/999 scored, 357 exact, CER 14.7037%; g2pk 999/999 scored, 353 exact, CER 14.8222%. Paired exact delta native-minus-g2pk is about +0.401 percentage points on the 997 shared cases; paired CER delta native-minus-g2pk is about -0.113 points. This is a diagnostic benchmark only, not an official NIKL gate or IPA-to-Ukrainian score. [Run 40218462123](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40218462123).
- Next acceptance criteria: specialist adjudication for unlisted morphology and independent broad-IPA/Ukrainian-target review. Keep the live NIKL inventory marked `BLOCKED_EXTERNAL_ACCESS` (HTTP 403); no access-control bypass was attempted.

## Variant-aware residual recovery — 2026-10-25

- Added an exact lexical phrase entry for `못잃어` with two explicitly provisional surface candidates: `몬니러` (ㄴ-insertion) and `모시러` (no ㄴ-insertion). NIKL's 2022 usage survey discusses both response types for this phrase, but the displayed percentages belong to `못 잇는다` and are not transferred. IPA is project-derived; Ukrainian adaptation remains provisional.
- The entry is available in the base lexical CSV used by both the native loader and browser test harness. Regression tests assert both candidates and their provisional status.
- Remaining unresolved forms after the code change are expected to be `칡칡이`, `쫒아내면`, `많앗구나유유유`, `삶의`, and `무서웟어`; this is not a verified benchmark result until current-head CI completes.
- Acceptance boundary: this is a variant-aware candidate recovery, not a normative pronunciation selection or independent IPA/Ukrainian-target gold.

- Added a target-layer acceptance regression for the `못잃어` phrase candidates: even if all IPA segments map through model-selected correspondences, the lexical record's `target_status=provisional` now forces candidate-only output in native and browser runtimes. This prevents a provisional lexical Ukrainian rendering from being exposed as accepted output.

## Final merged verification — 2026-10-25 18:57 UTC

- Starting main commit for this batch: `afe6ecd6e9c57e084ff66f8f130d58308831b947`.
- Implementation PR [#330](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/330) was squash-merged; final main commit: `398b9a591907be7d9e1561ae721c157788fcad6b`.
- Exact PR-head benchmark [40223272365](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223272365), on code tree merged unchanged into main: native **2,698/2,703 scored**, **1,430 exact**, **CER 9.1697%**, **5 unresolved**, **0 engine exceptions**. Relative to the original 45-unresolved baseline (2,658 scored, 1,412 exact, CER 9.2010%), this is 40 fewer abstentions and 18 additional exact matches. Treat as a diagnostic coverage gain, not general accuracy proof; UGTPHON labels are noisy and confidence intervals overlap.
- Exact-head tests [40223272311](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223272311), system verification [40223272342](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223272342), master/research artifacts [40223272370](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223272370), paired native-vs-g2pk [40223272359](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223272359), optional g2pK [40223272349](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223272349), external UGTPHON [40223272386](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223272386), morphology consensus [40223272367](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223272367), and research adapter smoke [40223272407](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223272407) all passed.
- Post-merge main verification [40223608315](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223608315), tests [40223608342](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223608342), master/research artifacts [40223608335](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223608335), and GitHub Pages deployment/live browser smoke [40223608333](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223608333) all passed.
- Five remaining evidence-limited cases: `칡칡이` (compact morphology/boundary), `쫒아내면` and `무서웟어` (likely spelling errors; no silent correction), `많앗구나유유유` (nonstandard spelling/stylized suffix uncertain), and `삶의` (specialist IPA adjudication still blocked). Do not force production licenses to clear these.
- The live official NIKL inventory remains blocked/skipped because its collector receives HTTP 403; no access-control bypass was attempted. Rights review and independent IPA/Ukrainian-target gold remain open.
- Status: **PARTIAL / research prototype**, not release-ready for validated Ukrainian output.


## Final residual-case evidence gate — 2026-10-25

- Reconciled the stale “45 unresolved” request against current main and the latest recorded merged benchmark: the residual count is **5**, not 45. The benchmark run is [40223272365](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40223272365); it reports 2,698/2,703 scored, 1,430 exact, CER 9.1697%, five unresolved, and zero engine exceptions.
- Added `research/final-residual-abstention-triage-2026-10-25.json` and `tests/test_final_residual_abstention_triage.py`. The gate tests ensure no residual case emits accepted Ukrainian orthography until the relevant blocker is resolved.
- Source checks: NIKL MCFAQ 5716 explicitly permits `삶의[살믜]/[살메]` (Hangul pronunciation, not IPA); the Korean Basic Dictionary entry for `쫓아내다` gives `[쪼차내다]`; the official dictionary example includes correctly spelled `무서웠어`; an official NIKL Q&A quotes `많았구나`. These support source-level observations only, not silent spelling repair or exact noisy-form pronunciation.
- No production pronunciation rule was added for `칡칡이`, `쫒아내면`, `많앗구나유유유`, or `무서웟어`: the first lacks a verified lexical parse and the other three are nonstandard spellings whose intended correction must not be silently substituted. `삶의` remains diagnostic-only until independent IPA review; Ukrainian target review remains a separate gate.
- New branch: `fix/final-abstention-evidence-2026-10-25`, based on current main `d23646af23b10be6b9f5223002cf634cd128ea06`. Exact-head CI for this branch is not yet known; do not mark these new tests `DONE_VERIFIED` until Actions finishes.


## Benchmark corpora as teacher-training data — 2026-10-26 follow-up

- **First pinned-source audit completed:** [run 40291000666](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291000666), metadata-only [artifact 12635783073](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291000666/artifacts/12635783073), success. UGTPHON: 1,976 train / 246 dev / 275 test rows; SIGMORPHON Korean: 8,000 / 1,000 / 1,000; Charsiu repository Korean data: 62,126 train / 50 dev / 500 test rows. Exact normalized form overlap with Charsiu repository train: 508 unique UGTPHON test token forms and 729/1,000 SIGMORPHON test words. This is a strong contamination warning, not proof that the selected Hugging Face checkpoint used these exact files. Its full training manifest remains unknown.


- **Decision:** benchmark families can be used for learning only through their actual licensed `train`/`dev` partitions. The existing UGTPHON/SIGMORPHON test snapshots remain evaluation-only; never re-label them as train/dev or use them to tune the teacher/rules.
- **Code update:** the teacher disagreement miner now allows dataset identifiers such as UGTPHON and SIGMORPHON when the manifest declares a real train/dev split, while continuing to reject non-train/dev splits and explicit project holdout/test identifiers. Focused tests cover both allowed benchmark-family identifiers and the sealed 24-form holdout rejection. Added `scripts/audit_teacher_corpus_splits.py` and a job in the existing `.github/workflows/test.yml` to verify pinned Git blob hashes, check split labels, count within-dataset and cross-corpus overlaps, and upload a metadata-only report without printing corpus rows. The audit also pins Charsiu repository `data/{train,dev,test}/kor.tsv` as an overlap proxy; its source metadata is mixed (`U/K` and MIT), and this does not establish the exact Hugging Face checkpoint's training manifest.
- **Corpus discovery completed:** pinned UGTPHON Korean train/dev/test files exist at `naver-ai/UGTPHON@ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`; its Korean subset license says Apache-2.0. Pinned SIGMORPHON `kor_train.tsv`, `kor_dev.tsv`, and `kor_test.tsv` exist at `sigmorphon/2021-task1@821bcdece5a47820872215969f275004b0abe80c`; observed row counts are 8,000/1,000/1,000 and the benchmark register records CC BY-SA 3.0 data terms. Details and caveats are in `docs/TEACHER-CORPUS-ELIGIBILITY-2026-10-26.md`.
- **Still blocked:** no teacher inference or fine-tuning is claimed. The selected Hugging Face Charsiu checkpoint has no model card / explicit weight license on its page, and its original training-data overlap is unknown. A repository's MIT code license does not automatically license model weights. Exact normalized overlap across the source splits has not yet been computed. Fine-tuning and teacher inference remain BLOCKED pending these gates.
- **Rule gate unchanged:** teacher predictions are hypotheses, not normative Korean evidence. Production Strict changes still require source adjudication, positive/negative controls, and separate dev/holdout evaluation. Preserve the IPA → Ukrainian adaptation boundary.
- **Acceptance:** exact-head CI must pass after these code/test updates. The previous CI results do not verify this follow-up commit.



## Continuation verification update — 2026-10-26 (current PR head)

- **Latest code/test head with completed CI at time of this audit:** `d9bf45628a0243ee46010c7cb706e5661057be8d`. The branch subsequently received documentation-only reconciliation commits; check the live PR head and rerun/status-check those exact commits before merge. PR #339 remains open and draft. The earlier supplied SHA `7e3728e3aa62a96b7f5635bf4832f6c747d40677` was not the head at audit time.
- **Code/test-head CI:** all four PR-triggered workflows associated with `d9bf45628a0243ee46010c7cb706e5661057be8d` completed successfully: tests [40291416230](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291416230), system verification [40291416238](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291416238), teacher corpus split audit [40291416210](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291416210), and master table/research artifacts [40291416486](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291416486). These establish software/workflow verification only; they do not establish teacher accuracy or any Strict quality gain.
- **Alternative-model assessment:** SIGMORPHON 2021 Korean medium data are available as 8,000 train / 1,000 dev / 1,000 test examples under the task's stated CC BY-SA 3.0 data terms. The task documentation explicitly describes targets as tokenized *roughly-phonemic IPA*, not a guaranteed narrow phonetic IPA gold standard; its competition rules also restricted external resources for the medium subtask. A model trained from scratch on its train split could be a separate rough-phonemic research baseline, but cannot be represented as an IPA-equivalent teacher for Strict without an independently reviewed representation adapter. The source documents are [SIGMORPHON 2021 repository](https://github.com/sigmorphon/2021-task1) and [task README/search result](https://github.com/sigmorphon/2021-task1#readme).
- **Current decision:** no alternative pretrained checkpoint with both verified weights license and appropriate IPA target contract was cleared in this run. Charsiu checkpoint rights and its exact training-data manifest remain unresolved. Therefore no checkpoint was downloaded/run, no inference or fine-tuning was performed, and no model result or Strict rule gain is claimed. Do not treat this as evidence that model training is impossible; it remains a separate option after source terms and target representation are reviewed.
- **Strict changes:** none made in this continuation. The existing rule gate remains primary-source phonological evidence + positive and negative controls + eligible dev improvement + regression review. The 24-form project holdout and all official test splits remain sealed.
- **Documentation-head verification update:** the later documentation-only head `1b598162d80d01850d5d63bffab4aa363a1f501b` was also verified by all four workflows: tests [40292454456](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40292454456), system verification [40292454599](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40292454599), teacher corpus audit [40292454631](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40292454631), and master table/research artifacts [40292454580](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40292454580) all completed successfully. This is documentation/workflow verification, not model inference or a Strict accuracy result. Local clone/network execution was unavailable; no local test command is claimed.

### Updated task ledger

| Task | Status | Evidence / remaining acceptance criterion |
|---|---|---|
| Verify latest PR head and queued CI | DONE_VERIFIED | PR head `d9bf45628a0243ee46010c7cb706e5661057be8d`; all four exact-head workflows completed successfully (run IDs above) |
| Pin and audit UGTPHON / SIGMORPHON / Charsiu repository splits | DONE_VERIFIED | Source blobs, split counts, duplicate counts and overlap intersections recorded in the corpus audit artifact; lexical overlap is not proof of checkpoint training exposure |
| Establish an eligible pretrained neural IPA teacher | BLOCKED | Need a checkpoint with explicit weights terms, reproducible immutable revision, training-data provenance/overlap assessment, and an output convention compatible with the miner's IPA contract |
| Train a separate SIGMORPHON-only rough-phonemic baseline | TODO | Optional alternative, not an IPA teacher by default; acceptance requires a reproducible train/dev-only run, pinned environment, documented CC BY-SA attribution/terms, raw outputs, and an explicitly typed target representation |
| Run Charsiu inference or fine-tuning | BLOCKED | Explicit checkpoint weights license and original training-data manifest/overlap remain unresolved; do not download/use weights for this workflow until cleared |
| Promote teacher-derived Strict rules | TODO | Independent NIKL/primary-source adjudication, positive/negative controls, dev improvement, and regression evidence required; no teacher-derived rule is licensed yet |
| Change production Strict in this continuation | DEFERRED | No source-backed candidate passed the acceptance gate in this run; do not invent rules from associations |

## Continuation update — case-ID leakage guard (2026-10-26)

- **Code review finding:** the teacher/Strict miner checked the manifest split, each row split, and known holdout markers in `dataset_id`, but a row with a misleading `case_id` like `test-001` could pass if labeled `dev`.
- **Change made:** the miner now rejects obvious test/holdout/24-form markers in case IDs, with regression coverage for hyphenated, underscored, and project-style IDs. This tightens the research guard without changing runtime pronunciation or model behavior.
- **Commits:** code `806d256e7be819569c24cf0cc1d8a8b4aaf6573b`; tests `5a90b3dadb2bc8729b1f30f1c7cef7ae5b385812`.
- **Verification:** the corrected code/test head `1a48567f042a25023df90258fde30497240b6bd4` passed all four PR workflows: tests [40293964930](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40293964930), system verification [40293964888](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40293964888), corpus audit [40293964882](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40293964882), and master artifacts [40293964952](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40293964952). The earlier attempt failed because the newly added test fixture accidentally wrote literal backslash-n strings instead of JSONL line breaks; this was corrected and the full matrix then passed. The documentation head `e438ea8ef748b4ccb3f2b2b38d11795355836514` subsequently passed all four exact-head workflows: tests [40294156717](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40294156717), system verification [40294156664](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40294156664), corpus audit [40294156675](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40294156675), and master artifacts [40294156700](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40294156700). Later follow-up commits in this branch are documentation-only; the code/test head remains `1a48567f042a25023df90258fde30497240b6bd4`.
- **Limit:** this marker heuristic cannot infer provenance from opaque IDs. Source manifests and split membership still must be verified; never use the guard to justify relabeling or reusing sealed records.

### Additional model search — licensed MFA G2P candidate (2026-10-26)

- Found the official Montreal Forced Aligner Korean (Jamo) G2P v3.0.0 card: Phonetisaurus architecture, MFA phone set, declared CC BY 4.0, 49,655 training words and 5,518 evaluation words. Official sources: https://mfa-models.readthedocs.io/en/latest/g2p/Korean/Korean%20(Jamo)%20MFA%20G2P%20model%20v3_0_0.html and https://mfa-models.readthedocs.io/en/latest/g2p/Korean/index.html.
- This may offer a legally clearer alternative to Charsiu's undocumented checkpoint weights, but is **not yet cleared for IPA teacher use**. The phone set requires a verified adapter, and the published WER/PER are both 100%, a quality warning requiring investigation. No artifact was downloaded and no inference was run.
- Next acceptance criteria: pin artifact/version/hash; inspect phone inventory and dictionary/data terms; explain/reproduce the published metrics; test an explicit phone-set-to-IPA adapter; then evaluate only on approved train/dev examples, keeping test/holdout sealed.



## Train-only IPA conflict queue and source-convention review — 2026-10-26

- Added `scripts/build_korean_ipa_adjudication_queue.py` with regression tests and integrated it into the pinned-corpus audit workflow. It creates a provenance-preserving queue from SIGMORPHON-train × UGTPHON-train shared forms, retaining all raw candidate annotations and literal Unicode code-point inventories without claiming these are phoneme segments.
- The queue removes only SIGMORPHON token-separator whitespace for diagnostic comparison. It rejects dev/test rows, mismatched source revisions, unsupported target representations, and duplicate IDs. No source target is chosen as gold; no IPA mapping or runtime rule is generated.
- Added `docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md` with pinned primary-source references. SIGMORPHON 2021 documents roughly-phonemic IPA tokenized with `segments` and removal of stress/syllable markers in preprocessing; UGTPHON documents IPA-Dict-derived Korean token targets checked by native speakers and its own token-level annotation conventions. This supports the decision not to equate the two corpora by raw symbol identity.
- Status: **DONE_VERIFIED** for the queue implementation only after exact-head corpus workflow and focused tests pass. The 366 conflicting train/train forms remain **PARTIAL / UNADJUDICATED** until source-specific symbol mapping and independent review. Teacher-versus-Strict comparison remains invalid across incompatible representations until the reviewed adapter exists. Production pronunciation rules and runtime output remain unchanged.


## Same-input neural-teacher / native Strict pairing — 2026-10-26

- Added `scripts/compare_korean_teacher_strict_dev.py` and focused tests. The teacher and native Strict engine are paired by exact SIGMORPHON dev `case_id` and NFC source form; native output is generated from `phoneticize_korean(..., morphology_mode="strict", ipa_level="broad")` on those same inputs.
- The output deliberately computes **no exact-match, CER, WER, or ranking metric**. SIGMORPHON's tokenized roughly-phonemic IPA has not been independently mapped to the project's broad surface-IPA contract, and the teacher checkpoint was selected using this same dev split. Native diagnostic-only IPA rows are excluded and recorded, not scored.
- The train-teacher workflow now runs this pairer and uploads paired raw outputs plus a summary alongside the scratch checkpoint and dev error analysis. This prepares aligned evidence but does not fulfill the valid-comparison acceptance gate yet.
- Status: pairer implementation **PARTIAL until exact-head CI and artifact inspection**; valid cross-model comparison remains **BLOCKED** on the reviewed IPA adapter and an evaluation set not used for teacher checkpoint selection. Neural weights remain research-only; no production rules/runtime output changed.


## Exact-head acceptance update — 2026-10-26 10:10 UTC

**Branch head:** `80d5ba5bd7d90f19d4b818c97819a118bc3f4fcc` on `research/strict-teacher-guided-rule-mining-2026-10-26`; canonical review remains Draft PR [#339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/339).

### Train-only IPA adjudication queue — DONE_VERIFIED

- Exact-head corpus workflow [40305148677](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305148677) passed and uploaded artifact [12641213879](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305148677/artifacts/12641213879).
- Queue summary from the artifact: 8,000 SIGMORPHON train rows; 13,271 eligible UGTPHON train token occurrences; 1,084 shared source forms; 718 matches after only removing SIGMORPHON whitespace token separators; **366 queued conflicts** (151 length-mark-only diagnostics, 215 other symbol/feature diagnostics, zero dot-only). Queue status is unadjudicated; no source chosen as gold, no IPA mapping applied, and no production rule changed.

### Same-input teacher / native Strict pairing — DONE_VERIFIED as an alignment artifact, not as a valid accuracy comparison

- The scratch-teacher workflow passed on exact branch head in [run 40305148602](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305148602), artifact [12642810161](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305148602/artifacts/12642810161).
- It paired 1,000 teacher dev predictions to 1,000 native Strict outputs by exact case ID/source form; 994 rows have non-diagnostic-only Strict IPA, 6 were excluded because native IPA remained diagnostic-only. **No teacher-versus-Strict accuracy metric was computed** because the source IPA conventions remain unmapped and this dev split was used to select the teacher checkpoint.
- Exact-head scratch teacher metrics: 596/1,000 exact token sequences (59.6%); token error rate 12.7923%; compact-character error rate 12.1039%; best epoch 12; checkpoint SHA-256 `21cb99a696c911752694ec77b4dbd5f9d8496879e4ff3c3cf309485ad324be20`. These are SIGMORPHON source-convention metrics only, not ClippyFirst broad-IPA accuracy. Error categories: 596 exact, 116 length-mark-only diagnostics, 288 other token/feature differences.

### Final workflow status on the exact branch head

- Tests, Python 3.11/3.12/3.13, browser regression/build, and clean wheel install: [40305148584](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305148584) — PASS.
- System verification: [40305148531](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305148531) — PASS; optional live NIKL source inventory was skipped by condition and is not claimed as passed.
- Teacher corpus audit, builders, conflict queue, and typed packetization: [40305148677](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305148677) — PASS.
- Scratch training, dev error analysis, and same-input teacher/Strict pairing: [40305148602](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305148602) — PASS.
- Master artifacts: [40305148646](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305148646) — PASS.
- Local clone/test execution remains unavailable in this environment because the earlier GitHub DNS resolution failed; all verification claims above refer to remote CI.

### Remaining acceptance blockers

1. **IPA adapter:** no source-specific, independently reviewed mapping from SIGMORPHON tokenized roughly-phonemic IPA and UGTPHON IPA-Dict-derived token targets to ClippyFirst broad surface IPA. The queue is not a converter.
2. **Adjudication:** all 366 train/train conflicts still require evidence-backed review; no normalization should delete length marks or collapse segment/feature distinctions by default.
3. **Valid model comparison:** wait for a reviewed adapter and use a separate eligible evaluation set not used to select the checkpoint. Current paired output is diagnostic only.
4. **Rule promotion:** no deterministic rule is promoted until exact phonological environments, exceptions, primary sources, independent review, positive/negative tests, and separate-set improvement are demonstrated.
5. **Runtime model integration:** deferred; current evidence supports offline teacher use only. No production phonological rule or runtime output changed in this batch.

**Project status:** research infrastructure is release-verifiable, but the Korean-to-Ukrainian system as a whole remains a partial prototype, not release-ready.


## Source-specific IPA inventory audit — exact verification

Added `scripts/audit_korean_ipa_symbol_inventories.py` with tests and integrated it into the existing corpus workflow. Exact code/test head `49db9150c2bd680d26eb4a04265376df06c7e56a` passed all five relevant workflows: tests [40305565475](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305565475), system verification [40305565473](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305565473), corpus audit [40305565459](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305565459), scratch teacher + paired diagnostic [40305565649](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305565649), and master artifacts [40305565464](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305565464). Inventory artifact [12641804746](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305565459/artifacts/12641804746).

Observed inventory counts:
- SIGMORPHON train/dev: 47/46 distinct Unicode code points and 60/59 source-whitespace target tokens.
- UGTPHON train/dev: 51/50 distinct Unicode code points; 13,271/1,897 token occurrences and 8,753/1,629 unique forms.
- Length mark `ː`: 1,630 occurrences in SIGMORPHON train targets vs 105 in UGTPHON train targets. Primary stress `ˈ`: 105 in UGTPHON train, absent in SIGMORPHON train inventory.
- UGTPHON has `ç` (211 train occurrences) and `ø` (300 train occurrences), not present in SIGMORPHON train; example rows include `비키니 → pikçini` and `사인회 → sʰa̠inɦø̞`. These are review targets, not presumed errors or mapped symbols.

The inventory tool is **DONE_VERIFIED**. It does not perform phoneme segmentation or conversion. The queue and pairer are also verified as tools, but the linguistic acceptance gate remains blocked: source IPA adapter not reviewed, 366 train/train target conflicts unadjudicated, and no valid cross-engine accuracy metric. The neural teacher remains offline-only; no production rule/runtime output changed.


## Upstream example check for UGTPHON symbols

Directly fetched the pinned upstream README files through the GitHub integration. SIGMORPHON's pinned README explicitly defines targets as a roughly-phonemic IPA phone sequence tokenized by `segments`, derived from Wiktionary via WikiPron. The pinned UGTPHON README includes the examples `키키 → kçikçi` and `킥킥 → kçik̚kçik̚`; this confirms that `ç` occurs as part of its source annotation convention and should not be discarded as an apparent typo. The inventory's `ç` and `ø` findings are therefore convention-review targets, not automatic data-cleaning rules. No mapping is promoted until the source-specific phonetic interpretation is independently checked.


## Final execution ledger — code head and verification (2026-10-26)

- **Starting code head for this continuation:** `e1258668d5ebf75815da64a3d768985776cb45de`.
- **Latest implementation/test head:** `49db9150c2bd680d26eb4a04265376df06c7e56a` (queue, paired diagnostic, symbol inventory tools and their CI wiring).
- **Documentation/review head before this final ledger update:** `af1c02a6908a849c7d89afbd351a4938053cf3a4`.
- **Canonical branch/PR:** `research/strict-teacher-guided-rule-mining-2026-10-26`, Draft PR [#339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/339).

### Exact documentation-head CI before this ledger update

On `af1c02a6908a849c7d89afbd351a4938053cf3a4):
- [Tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40306010829) — PASS: Python 3.11, 3.12, 3.13; browser regression/build; clean wheel install; teacher corpus audit.
- [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40306010751) — PASS. Optional live NIKL source inventory was skipped by condition.
- [Teacher corpus audit](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40306010856) — PASS.
- [Scratch teacher, error analysis, and paired diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40306010764) — PASS; artifact [12641864872](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40306010764/artifacts/12641864872).
- [Master artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40306010798) — PASS.
- [Source IPA inventory + conflict queue + typed corpus packets](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40306010856) — PASS; artifact [12641804746](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40306010856/artifacts/12641804746).

### Final task ledger

| Task | Status | Acceptance evidence / remaining gate |
|---|---|---|
| Train-only SIGMORPHON/UGTPHON conflict queue | **DONE_VERIFIED** | Pinned inputs, tests, train-only guard, CI artifact; 366 conflicts retained for review |
| Source-specific IPA Unicode/token inventory | **DONE_VERIFIED** | Tests and artifact; no segmentation assumptions |
| Teacher/native Strict same-input pairing | **DONE_VERIFIED as alignment artifact** | 994 aligned cases, 6 diagnostic-only exclusions; no cross-engine metric |
| Source-specific conversion to agreed ClippyFirst IPA | **BLOCKED / EVIDENCE-LIMITED** | Need independently reviewed mapping for source-specific diacritics, allophones, length and `kç` notation |
| Adjudication of 366 train/train conflicts | **TODO / UNADJUDICATED** | Need evidence-backed decision per case, not automatic normalization |
| Valid teacher-versus-Strict accuracy comparison | **BLOCKED** | Needs reviewed adapter and separate eligible evaluation data not used to select teacher checkpoint |
| Production rule promotion | **DEFERRED pending evidence** | No candidate promoted without exact environment, exceptions, primary sources, independent review, regression controls and separate-set improvement |
| Neural runtime integration | **DEFERRED** | Scratch teacher remains offline-only; current evidence does not justify production fallback/ensemble |
| Production engine behavior | **PRESERVED** | No runtime phonological rule or Ukrainian output changed |

The exact implementation commit above is verified by CI. This ledger itself is a documentation-only follow-up; the final branch commit is reported in the execution handoff/review summary. Overall product status remains **research-ready infrastructure / partial prototype**, not release-ready.


## Reuse of existing neural-vs-native benchmark evidence from PR #338

Reviewed open Draft PR [#338](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/338), its latest successful multi-engine workflow [40290133252](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290133252), and paired artifact [12635458650](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290133252/artifacts/12635458650). This already supplies an executed, same-occurrence, shared-normalizer diagnostic comparison of pinned CharsiuG2P against the deterministic native Strict pipeline. Reused the evidence rather than porting or duplicating PR #338's large benchmark harness into this branch. PR #338 remains open and untouched because it owns the separate neural benchmarking workflow; PR #339 adds source-convention adjudication and scratch-teacher pairing.

### Existing CharsiuG2P diagnostic results

Pinned model `charsiu/g2p_multilingual_byT5_small_100`, revision `ed5cf99707fb39f5f3ccc461530d56b6fb531fd3`; tokenizer `google/byt5-small`, revision `68377bdc18a2ffec8a0533fef03b1c513a4dd49d`. Model weights' redistribution license remains unresolved, so use is research-only and no weights are checked into artifacts.

- **SIGMORPHON:** Charsiu 709/999 exact (70.971%), CER 5.4081%. On the 997 occurrences where both model and native Strict produced scorable outputs, Charsiu 707/997 exact (70.9127%), CER 5.4244%; native Strict 357/997 exact (35.8074%), CER 14.7037%. Paired exact-match delta +35.1053 percentage points; paired CER delta −9.2793 points. The report's paired row-cluster 95% CI for exact-match delta is [31.996, 38.014] percentage points.
- **UGTPHON:** Charsiu 2,393/2,703 exact (88.5313%), CER 3.6239%. On the 2,698 common-scored occurrences, Charsiu 2,392/2,698 exact (88.6583%), CER 3.6029%; native Strict 1,430/2,698 exact (53.0022%), CER 9.1697%. Paired exact-match delta +35.6561 percentage points; paired CER delta −5.5668 points. The report's paired row-cluster 95% CI for exact-match delta is [31.5149, 40.0973] percentage points.

**Interpretation:** these are valid *relative diagnostic comparisons under the same declared normalizer*, not normative IPA accuracy or Ukrainian-target quality. The normalizer applies NFD, maps `g` to `ɡ`, removes tie bars and selected narrow diacritics (including retraction), and removes spaces/periods while retaining length, aspiration, fortis, and unreleased-stop marks. The report includes sensitivity-only profiles; ignoring length raises SIGMORPHON exact match to 83.2833%, but that is explicitly diagnostic and must not be adopted as the primary score because it may erase lexical/prosodic information. The public model's training-source overlap cannot be excluded.

### Observed discrepancy examples for adapter review — not rule promotions

- SIGMORPHON `가까이하다`: source/Charsiu `ka̠k͈a̠iɦa̠da̠`; native Strict `ka.k͈a.i.ha.da`. Under the shared normalizer the remaining discrepancy is `ɦ` vs `h`.
- SIGMORPHON `가는돌고기`: source/Charsiu `ka̠nɯndo̞ɭɡo̞ɡi`; native Strict `ka.nɯn.dol.ɡo.ɡi`. The normalized mismatch includes `ɭ` vs `l`.
- UGTPHON `아끼셔`: source/Charsiu `a̠k͈iɕʰjʌ̹`; native Strict `a.k͈i.sjʌ`. The normalized mismatch includes `ɕʰ` vs `s`.
- UGTPHON `현모양처다이기야`: source/Charsiu begins `çjʌ̹...`; native Strict begins `hjʌn...`. The pinned UGTPHON README uses `kçikçi` and `kçik̚kçik̚` in its own examples, so `ç` is source-convention notation, not something to delete as an assumed typo.

These examples are **source-convention or phonology hypotheses only**. Because they come from benchmark/test rows, they must not be used to tune production rules. Use train/train evidence for candidate formation, the reviewed source adapter for normalization, and a separate adjudicated evaluation set for acceptance.

### PR reconciliation

- PR #339 remains the canonical draft for this train-only conflict queue, inventory audit, and scratch teacher/Strict alignment artifact.
- PR #338 remains the separate canonical draft for pinned third-party neural model inference and paired multi-engine benchmark artifacts. Its existing results were reused as evidence; no code or branch changes were made to #338.
- PR #340 was auto-closed as merged into the #339 branch when its commits were fast-forwarded; no work was discarded.


## Continuation — conflict-pattern triage added (2026-10-26)

- Added `scripts/analyze_korean_ipa_conflict_patterns.py` and `tests/test_analyze_korean_ipa_conflict_patterns.py`; wired them into `.github/workflows/teacher-corpus-audit.yml`.
- The workflow now emits `korean-ipa-conflict-patterns.json` next to the train-only conflict queue. It summarizes all 366 conflict forms, retains every UGTPHON candidate occurrence, distinguishes raw occurrence frequency from distinct target strings, counts cross-corpus target pairs and literal Unicode code points, and prioritizes high-frequency forms for provenance review.
- This is a **triage report, not adjudication**: it does not align characters as phones, select gold, map source IPA into ClippyFirst broad IPA, remove length marks, or emit runtime rules.
- Inspection of the generated queue showed that `진짜` has 78 UGTPHON occurrences but repeats the same comparison-target string. Across the 366 queued forms, the inspected artifact contained 803 cross-corpus candidate pairs and no form with more than one distinct UGTPHON comparison-target string. Repeated occurrences are not independent votes or distinct pronunciation variants; the new report keeps occurrence counts and unique target strings separate.
- Illustrative disagreements include `가능하다` (`ka̠ːnɯŋɦa̠da̠` vs `ka̠nɯŋɦa̠da̠`), `갈등` (`ka̠ɭt͈ɯŋ` vs `ka̠ɭdɯŋ`), and `거인` (`kɘːin` vs `kʌ̹in`). These are unresolved examples, not claims that either annotation is wrong.
- Acceptance: exact-head corpus workflow must pass the new unit tests, build the report from the freshly generated pinned queue, and upload it. The 366 forms remain `UNADJUDICATED`; no production runtime or Ukrainian output was changed.


### Conflict triage verification and correction record — 2026-10-26

- The first triage test run failed because the test expected an integer while the report accidentally returned the ranked rows list. The report field was corrected to keep `forms_with_five_or_more_ugtphon_candidate_occurrences` as an integer and expose the rows separately as `highest_occurrence_forms`.
- A second audit of the generated artifact corrected a linguistic interpretation risk: candidate multiplicity in UGTPHON reflects repeated token occurrences, not necessarily pronunciation variants. The implementation now counts occurrences and distinct target strings separately; a regression explicitly tests repeated identical targets.
- Corrected report from corpus artifact [12645583079](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40313643070/artifacts/12645583079): 366 conflict forms, 803 candidate-occurrence pairs, 292 pairs matching only after diagnostic length-mark removal, 33 forms with at least five UGTPHON occurrences, and zero forms with multiple distinct UGTPHON comparison targets among the eligible queue rows. `진짜` has 78 occurrences of one identical target; frequency is not independent corroboration.
- Exact-head verification after the repeated-occurrence regression: corpus audit [40313774415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40313774415) PASS; full tests [40313774457](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40313774457) PASS; system verification [40313774352](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40313774352) PASS; master artifacts [40313774559](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40313774559) PASS. The scratch-teacher workflow was still running when this entry was prepared; do not mark it passed until its exact-head run completes.
- No IPA source mapping, target Ukrainian output, or production rule was added. The 366 forms remain `UNADJUDICATED`; the next valid step remains independent source-backed review, not automatic normalization.


### IPA-Dict provenance boundary — 2026-10-26

- Inspected the pinned UGTPHON README: it states that token phoneme labels are looked up from IPA-Dict, checked by native-speaker annotators, and manually transcribed when uncovered; it does not pin the exact IPA-Dict source revision in the inspected metadata.
- Inspected IPA-Dict README at commit [972cd67dd5f96bc5660e28070cde26e3928abcd7](https://github.com/open-dict-data/ipa-dict/blob/972cd67dd5f96bc5660e28070cde26e3928abcd7/README.md). The project describes its targets as broadly phonemic/readability-oriented and credits the Korean subset to Korean Wiktionary-derived data. This supports the interpretation that IPA conventions may differ from the roughly-phonemic SIGMORPHON/WikiPron targets, but does not define a symbol-by-symbol conversion.
- **New evidence blocker:** the exact IPA-Dict snapshot used for the pinned UGTPHON labels has not been established. The inspected current upstream README is not proof of the exact snapshot embedded by UGTPHON. Do not use it to auto-map targets; either recover the precise revision from source manifests/history or record that it is irrecoverable.
- Repository documentation updated: `docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md`. This provenance finding changes no code output, mapping, or runtime rule.


### Final exact-head triage verification — 2026-10-26

- Hardened `scripts/analyze_korean_ipa_conflict_patterns.py`: it now requires exact SIGMORPHON and UGTPHON source pins and target-representation IDs, rejects duplicate conflict source forms, rejects decision flags that contradict train-only/no-mapping behavior, and labels the sum of per-form unique target strings unambiguously.
- Added regressions for duplicate source forms, wrong source revision, forbidden decision flags, repeated identical targets, and malformed queues.
- Final verified code/test head for this batch: `b0568099c2a2102196eb393e74529e2f8f353484`.
- Corpus audit/report artifact: [run 40314470436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470436) PASS; artifact [12645294759](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470436/artifacts/12645294759).
- Full tests: [40314470455](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470455) PASS; system verification: [40314470467](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470467) PASS; master artifacts: [40314470417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470417) PASS; scratch teacher + dev analysis: [40314470435](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470435) PASS.
- The final triage artifact confirms 366 conflict forms, 803 candidate-occurrence pairs, 292 length-mark-only candidate-pair diagnostics, 33 forms with at least five occurrences, and no distinct UGTPHON target variants among the selected eligible rows. These are corpus-structure diagnostics only.
- Documentation now records an additional provenance blocker: UGTPHON's pinned README identifies IPA-Dict as the source but does not pin the exact IPA-Dict snapshot. The current upstream IPA-Dict README is contextual evidence, not proof of the exact embedded source revision. No mapping or runtime rule was introduced.
- The docs-only continuation after this code/test head must receive its own current-head Actions verification before this branch can be considered fully verified.


### Branch/PR reconciliation — 2026-10-26

- Current default branch confirmed as `main`. GitHub compare from `main` to the then-current research head `24ae7dd4991a20fc79aa03bc4d2d414dec0989d2` reported 228 commits ahead, 0 behind, and 34 changed files. No rebase or wholesale merge was attempted.
- PR #339 remains the active draft for this research branch. PR #338 remains a separate draft neural-baseline branch; its existing Charsiu diagnostic results were reused as evidence, but its code was not copied into the Strict rule-mining branch.
- Open PRs #336 and #329 contain overlapping independent-IPA-review tooling/docs; they were inspected but left untouched because they cover the residual/holdout review path, not the 366 train/train corpus conflicts. Reuse their review packet approach when the corpus queue is ready for actual human annotation rather than creating a competing holdout workflow.
- Open PRs #305 and #326 contain broad-IPA profile-sensitivity and sealed-holdout work. Their reported score changes are normalization-profile diagnostics, not an adjudicated common IPA gold set; neither branch was merged into this work. PR #327 is based on the separate #326 research branch and was left untouched.
- PR #336 also changes residual runtime edge cases; those changes were not ported because this batch's scope is source-convention evidence and train-only conflict triage. No runtime behavior changed.
- Exact-head verification for documentation head `24ae7dd4991a20fc79aa03bc4d2d414dec0989d2`: full tests [40314686192](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314686192) PASS; system verification [40314686079](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314686079) PASS; corpus audit [40314686082](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314686082) PASS; scratch teacher/pairing [40314686014](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314686014) PASS; master artifacts [40314686101](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314686101) PASS.
- The optional live NIKL source inventory remains skipped/blocked by its existing HTTP 403 condition; this continuation does not claim a live NIKL crawl succeeded.


### Exact-head rerun after PR/branch reconciliation — 2026-10-26

The complete current branch head before this final handoff evidence entry, `801b027627297e2311d428a28933fc295b014b4b`, passed all five relevant workflows:
- Full tests: [40314920650](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314920650) PASS (Python 3.11/3.12/3.13, browser tests/build, clean wheel install, corpus audit tests).
- System verification: [40314920643](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314920643) PASS; live NIKL source inventory step was skipped by condition, not passed.
- Teacher corpus split audit + conflict triage artifact: [40314920750](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314920750) PASS.
- Scratch teacher, dev error analysis, same-input pairing: [40314920646](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314920646) PASS.
- Master artifacts: [40314920580](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314920580) PASS.

The branch is still a research-ready partial prototype, not release-ready. The remaining work is evidence-limited: recover/pin the exact IPA-Dict revision used by UGTPHON if possible, independently adjudicate the 366 train/train conflicts, then build and review the versioned source-specific IPA adapter. Do not promote a deterministic rule or enable neural runtime fallback before those gates clear.


## Continuation record — train/train IPA conflict adjudication tooling (2026-10-26)

- **DONE_VERIFIED:** Added `scripts/validate_korean_ipa_adjudications.py`. It validates a separately supplied human decision document against exact queue IDs, source forms, and source pins, then emits a separate provenance-linked ledger. It requires two explicit reviewer records per submitted case, controlled decisions, rationale, and evidence references for non-`UNRESOLVED` decisions. Final adjudication requires a named adjudicator and rationale.
- **DONE_VERIFIED:** Added `tests/test_validate_korean_ipa_adjudications.py` for unresolved reviews, missing evidence, source-pin mismatch, unknown/duplicate queue IDs, altered source forms, missing adjudicator metadata, and partial-review reporting.
- **BLOCKED:** Actual human adjudication of the 366 source conflicts. Reviewer decisions are not fabricated or prefilled.
- **BLOCKED:** Complete source-specific IPA adapter. UGTPHON does not pin the exact IPA-Dict snapshot used for labels; no mapping for `ɦ/h`, `ɭ/l`, `ɕʰ/s`, `ç`, or length marks is justified yet.
- **BLOCKED:** Production Strict rule changes from this corpus work. A corpus-label discrepancy alone is not normative pronunciation evidence.
- **DEFERRED:** Third-party neural model runtime integration; model/data licensing, training overlap, output convention, and resource gates remain unmet.

### Validator CLI

```bash
python scripts/validate_korean_ipa_adjudications.py \
  --queue-json path/to/korean-ipa-conflict-queue.json \
  --decisions-json path/to/human-decisions.json \
  --output-json path/to/validated-adjudication-ledger.json
```

The input uses `schema_version: "1.0"`, the queue's exact `source_pins`, and a `decisions` array. Each decision includes `queue_id`, exact `source_text`, and `reviewer_1`/`reviewer_2` records. Each reviewer supplies a distinct `reviewer_id`, controlled decision, and rationale; non-`UNRESOLVED` reviewer decisions require an evidence reference. The two reviewer IDs must differ. A final decision requires an adjudicator and a non-empty final rationale; any final decision other than `UNRESOLVED` also requires `final_evidence_reference`. Partial submissions are allowed and explicitly list unreviewed queue IDs. The original queue is not modified, and the output asserts that no mapping or production rule was applied.

### Verification status

- Starting research head before this batch: `f8bf0c3490378723e6c275e56867ae6c0553be40`; default branch: `main`.
- Implementation commits: validator `0c814d79195bb319a63baf8e4be11642da91c8a6`; tests `a252885881b24ec8769a2499e5e512dd80cc4c1d`.
- Local clone/test execution was attempted but blocked because DNS/network access to `github.com` failed. No local test result is claimed. Exact-head GitHub Actions must verify the new validator before this task is fully verified.
- Previously recorded exact-head workflows before this batch: tests [40315132582](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40315132582), system verification [40315132650](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40315132650), corpus audit [40315132568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40315132568), scratch teacher/pairing [40315132667](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40315132667), and master artifacts [40315132603](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40315132603). These runs do not verify the new validator.
- **Current assessment:** research-ready infrastructure / partial prototype; not release-ready. No production runtime behavior changed in this batch.


### Validator hardening and CI wiring — 2026-10-26

- Strengthened the human-adjudication ledger validator so `reviewer_1` and `reviewer_2` cannot silently represent the same person: both records require explicit, distinct `reviewer_id` values.
- Final non-`UNRESOLVED` decisions now require a separate `final_evidence_reference`, in addition to adjudicator and rationale. Malformed non-string final rationale is rejected as a validation error rather than escaping as an unhandled attribute error.
- Expanded regression tests for duplicate reviewer identity, final-evidence requirements, successful evidence-backed adjudication, and missing/malformed adjudicator metadata.
- Wired `scripts/validate_korean_ipa_adjudications.py` and its tests into `.github/workflows/teacher-corpus-audit.yml`, both as path triggers and in the test command. This prevents the focused research gate from silently ignoring edits to the adjudication validator.
- Commits for this batch: validator `21b613d8d0df299d9410bf829e9d9068b8ebc1c4`; test updates `5c3198324b63f4260bade25ca049359b7a3a615d`, `9c3ef572058d24ab89bed947fa3ae7dcb1c8bd68`; CI wiring `c4a08e877cd4153d75697f1359d0f0d911442cef`.
- **Verification:** exact code/test head `e03cc4443926e534ff3afd5498815607ce9a32af` passed all five relevant workflows after validator hardening and CI wiring: tests [40317106631](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40317106631) PASS (Python 3.11/3.12/3.13, web, wheel install, focused corpus audit including validator tests); system verification [40317106621](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40317106621) PASS (NIKL live source inventory explicitly SKIPPED); corpus split audit [40317106623](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40317106623) PASS; scratch teacher [40317106628](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40317106628) PASS; master artifacts [40317106634](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40317106634) PASS. Three subsequent commits (`f18fe4f`, `0db0842`, `ebe9fc7`) are documentation-only; compare `e03cc444...` to `ebe9fc72...` confirms only `docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md` and `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md` changed. Local clone/test execution remains unavailable due GitHub DNS failure, so verification is CI-based.
- Remaining evidence gate is unchanged: no actual human adjudication is fabricated; all 366 train/train source conflicts remain unadjudicated; exact IPA-Dict snapshot provenance remains unresolved; no IPA mapping or production Strict rule is promoted.


### IPA-Dict provenance and licensing risk — 2026-10-26

- Verified the pinned UGTPHON README identifies `data/ko.txt` (62,447 Korean entries) as IPA-Dict-derived and says labels are looked up, native-speaker checked, and manually transcribed when absent. It does not pin the exact IPA-Dict revision or hash.
- The separately inspected IPA-Dict README at `972cd67dd5f96bc5660e28070cde26e3928abcd7` attributes the Korean subset to `laviande22/korean-word-ipa-dictionary`, extracted from Korean Wiktionary, under CC BY-SA 4.0. This is upstream provenance evidence, not proof that this exact snapshot fed UGTPHON.
- Added a rights-risk note to `docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md`: UGTPHON's stated Korean Apache-2.0 terms and the cited upstream IPA-Dict CC BY-SA terms require source-specific rights review before treating redistribution/commercial reuse of derived annotation artifacts as cleared. No legal conclusion is asserted; no IPA-Dict dump is copied into the repository.
- Exact IPA-Dict snapshot recovery remains BLOCKED by missing upstream version/hash metadata. Do not infer the embedded revision from the current IPA-Dict README, and do not promote a mapping or runtime rule based on this evidence.
- The convention-review update and subsequent handoff corrections are documentation-only descendants of the verified code/test head `e03cc4443926e534ff3afd5498815607ce9a32af`. No executable code or tests changed after that verified head; the docs-only commits do not change the recorded test result.


### Final research-teacher pairing evidence — 2026-10-26

- Scratch-teacher run [40317106628](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40317106628) completed successfully and uploaded artifact [12646399461](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40317106628/artifacts/12646399461), SHA-256 `6b3c545fa4b1eb9c80268d54181f60c8be612b5bbda32376acc86cff6f111b1c`.
- On 1,000 SIGMORPHON dev rows, the scratch teacher reproduced the existing metrics: 602 exact token-sequence matches (60.2%), token error rate 12.72%, compact-character error rate 12.18%; 107 mismatches were length-mark-only diagnostics and 291 were other token/feature differences (80 underpredicted and 27 overpredicted length marks).
- Teacher/Strict same-input pairing produced 994 paired cases and excluded 6, but correctly reported `BLOCKED_INCOMPATIBLE_OR_UNREVIEWED_IPA_CONVENTIONS`; cross-convention comparison metrics were not computed. This is the correct fail-closed result, not a missing test or a failed model.
- These figures are SIGMORPHON source-token-sequence metrics only. They are not broad-IPA accuracy, Ukrainian transliteration quality, or evidence that any Strict rule should be changed.


### Explicit interpretation of the 60.2% result — 2026-10-26

The figure 60.2% (602/1,000) belongs only to the standalone scratch-trained bidirectional-GRU/attention-GRU research teacher evaluated against the SIGMORPHON tokenized-IPA dev targets. It does not measure the deterministic ClippyFirst Strict engine, the browser's vendored rule-based G2P path, ClippyFirst broad-IPA conversion, or Ukrainian practical transcription. The checkpoint was selected using this same dev split, so the score is development feedback rather than independent final generalization evidence. Do not report it as "ClippyFirst engine accuracy."

**Acceptance criteria for any future engine-level percentage:** (1) define the exact engine/version and input/output boundary; (2) independently adjudicate source convention mappings and preserve unmapped cases; (3) use a separately eligible evaluation set not used for rule/model selection and audit source-form/corpus overlap; (4) report denominator, exact-match definition, error rates, exclusions, and uncertainty; (5) evaluate Korean surface/IPA and Ukrainian output as separate layers. Until these gates pass, Strict-versus-teacher accuracy is BLOCKED_INCOMPATIBLE_OR_UNREVIEWED_IPA_CONVENTIONS; no production rule is promoted from the 60.2% result.


### Deterministic rule promotion gate added — 2026-10-26

- Added `scripts/evaluate_deterministic_rule_candidate.py` with tests. It requires a primary-source clause, immutable dataset revision/license status, independently reviewed ClippyFirst broad-v1 gold convention, two distinct reviewers, train-only rule selection, dev-only evaluation, at least two positive and two negative controls, and no sealed-test identifiers.
- Positive controls must be corrected; negative controls must remain unchanged and correct; dev exact match must improve, or tie while codepoint CER improves. CER is explicitly a Unicode-codepoint diagnostic, not phoneme error rate.
- A pass only permits human review; the tool always sets `production_promotion=false`. No production rule was changed because the teacher/Strict IPA conventions remain unreviewed and the 366 train/train conflicts are not independently adjudicated.
- This is an executable acceptance gate, not a claim that engine quality has already improved. The next genuine runtime change must cite primary Korean phonology evidence, include positive/negative regression controls, and show a same-convention gain on eligible held-out dev data without touching sealed test/holdout forms.


### Verification of deterministic rule-candidate gate — 2026-10-26

- **Verified code/test head:** `b2e460ae0c2315ac9fc3273f7451d4daedd236de`.
- **Tests:** [40320537172](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40320537172) PASS — Python 3.11/3.12/3.13, browser tests/build, wheel install, and all Python tests including the new candidate gate.
- **Corpus audit:** [40320537189](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40320537189) PASS — pinned corpus preparation, split/overlap audit, IPA packetization/conflict queue, and rule-gate tests.
- **System verification:** [40320537156](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40320537156) PASS; live NIKL source inventory was skipped by workflow condition and is not counted as passed.
- **Master artifacts:** [40320537166](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40320537166) PASS.
- **Scratch research teacher / diagnostic pairing:** [40320537218](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40320537218) PASS. This is research-only and does not affect runtime.
- The first candidate-gate test run exposed three test-fixture mistakes (wrong control index, JSONL newline literal, and wrong evaluation-row index). They were corrected; the exact code/test head above passes all five workflows.
- **Outcome boundary:** no production phonology rule or runtime output changed. This gate makes future rule changes evidence- and regression-checkable, but it does not itself improve engine accuracy. The real rule-promotion blocker remains the independently reviewed IPA convention mapping and adjudication of the 366 train/train conflicts. Keep PR #339 draft until an evidence-backed deterministic change demonstrates same-convention improvement on eligible dev data.

## Owner escalation — neural benchmark gap and runtime integration (2026-10-26)

The owner correctly identified that the earlier R002/R016-only benchmark delta is much smaller than the neural-vs-Strict gap. This section distinguishes actual integration from infrastructure work.

### What is now integrated on this continuation branch

- Ported the already source-backed R002 exact-form formal/substantive liaison cases and R016 exact-form verbal-stem ㄺ-before-ㄱ cases, including Python and browser regression coverage, into this branch's shared runtime files/tests. The final browser test file is the superset version from the verified R002/R016 PR; research-only tests were not removed.
- This makes the existing verified rule batch available alongside the teacher-guided corpus/error-analysis pipeline on this branch. It does **not** mean those two rules were distilled from Charsiu, and it does not claim they close the large benchmark gap.
- PR #341 remains a separate open draft against main; no PR was merged and no branch was force-updated.

### Model benchmark evidence and interpretation

The already executed PR #338 artifact [12635458650](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290133252/artifacts/12635458650) reports CharsiuG2P exact-match results of 2,393/2,703 (88.5313%) on UGTPHON and 709/999 (70.9710%) on SIGMORPHON, compared with ClippyFirst native 1,430/2,698 (53.0022%) and 357/997 (35.8074%) respectively. On common-scored rows, the reported exact-rate deltas are +35.6561 pp (UGTPHON) and +35.1053 pp (SIGMORPHON). These are same-harness diagnostic scores, not normative IPA or Ukrainian-target accuracy; checkpoint training overlap and weights-license status remain unresolved.

The scratch-trained model is a different experiment and must not be conflated with Charsiu. The latest saved checkpoint is artifact [12638708277](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40297632775/artifacts/12638708277), also reproduced in artifact [12642016107](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40303812666/artifacts/12642016107): both have checkpoint SHA-256 21cb99a696c911752694ec77b4dbd5f9d8496879e4ff3c3cf309485ad324be20, identical dev-prediction SHA-256 5a62bada44a00ae9809e3ae00b136b9788bfaf0b8c6988f8c22fe3626f24e559, and 596/1,000 exact (59.6%). A separate earlier checkpoint, artifact 12638313059, has a different SHA-256 and scored 602/1,000 (60.2%). Both use the same pinned train/dev data hashes, so this is run-to-run training variation, not a corpus-data conflict; report both rather than claiming that either score supersedes the other. The latest checkpoint's error categories are 116 length-mark-only mismatches (92 under-predicted, 24 over-predicted) and 288 other token/feature mismatches.

### Rule promotion ledger

- `DONE_VERIFIED`: R002/R016 implementation + positive/negative regression tests exist in Python/browser on this branch.
- `DONE_VERIFIED`: same-harness Charsiu-vs-native diagnostic outputs exist and preserve per-occurrence raw predictions.
- `PARTIAL`: teacher error-analysis and candidate-mining tools exist; the Charsiu train/dev inference and raw pair-ledger workflow is now implemented, but its exact-head execution is pending and no accepted Charsiu-derived production rule has yet been independently adjudicated and promoted.
- `BLOCKED`: cannot safely distill exact test-set cases into runtime rules; UGTPHON/SIGMORPHON test are evaluation-only. The Charsiu checkpoint's training overlap is unknown, and its output convention is not independently mapped to ClippyFirst broad IPA. The 366 train/train cross-corpus conflicts remain unadjudicated.
- `TODO`: run teacher inference only on eligible train/dev material, generate a review queue from those splits, adjudicate candidate environments against primary NIKL sources, add positive and negative controls, then evaluate the frozen test sets once without using their cases to select rules.

### Required next engineering batch

1. `DONE_PENDING_CI`: `scripts/benchmark_charsiu_research_split.py` and `.github/workflows/charsiu-dev-rule-mining.yml` now run the pinned Charsiu checkpoint on the prepared SIGMORPHON dev and UGTPHON dev partitions only. The workflow preserves raw per-occurrence teacher/native/gold strings, records immutable model/tokenizer revisions and unresolved license/training-overlap status, and does not export model weights. The frozen test split is never passed to this workflow.
2. `TODO`: after the workflow artifact is available, inspect repeated *dev* contexts where the teacher and Strict disagree; separate true phonological environments from output-convention differences and lexical memorization. No test cases may be used to choose candidate rules.
3. For each candidate, require primary-source support, explicit morphology/boundary conditions, counterexamples, and an IPA convention mapping before changing runtime.
4. Implement only candidates that pass the existing rule evaluator and keep Python/browser parity; rerun the unchanged test benchmark as final evaluation, not as a tuning source.

**Readiness remains:** research-ready partial prototype, not release-ready. The important gap is no longer hidden: the neural benchmark is strong, but evidence-backed model-to-rule distillation is not yet complete.

## 2026-10-26 continuation: narrow IPA adapter and paired teacher evaluation

The partial narrow profile is now implemented in `src/korean_ukrainian/ipa.py` without changing the default broad IPA path:
- `ㅅ` is aspirated as `[sʰ]` in the narrow profile.
- `ㅅ` before `ㅣ, ㅖ, ㅑ` is realized as `[ɕʰ]`, based on the cited Korean sibilant study.
- Fortis `ㅆ` remains `[s͈]`; its palatalization is not assumed because evidence is mixed.
- The profile explicitly declares itself partial and `target_compatible=false`. Ukrainian target rendering therefore fails closed for this profile; broad IPA remains the default and retains its existing output contract.
- The new Charsiu train/dev runner now compares the same pinned teacher predictions against both broad Strict and the partial-narrow profile, preserving raw per-occurrence strings and not promoting rules automatically.

The first train/dev inference attempt on run [40332391810](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40332391810) successfully installed pinned dependencies, passed its split-guard tests, and prepared both datasets with no test rows exported. It then failed at report serialization because the paired benchmark uses the key `word`, while the review ledger expected `token`. That schema bug was fixed in `23cf6c0804e402ce3e70e25804b2c7e68907ae66`; the regression fixture was corrected in `972b394c983f89a2146f145ca44377a57596527f`. The corrected exact-head test and Charsiu runs were queued at handoff update time; they are **not yet passes**.

This is the first deterministic allophonic IPA feature batch derived through source review, not a claim that Charsiu's outputs are authoritative. No test split is used to choose these rules. Remaining high-frequency differences such as lateral retroflexion and /h/ allophony stay unimplemented because the available literature documents context/dialect variability and no independent adjudicated IPA gold set exists.
## 2026-10-26: source-backed rule transfer and cross-runtime parity audit

This batch responds to the large neural-vs-Strict gap by auditing the production browser engine against the Python rule inventory and official NIKL rules, rather than assuming raw neural IPA can be copied directly into runtime.

### Rule changes implemented (CI still pending)

- R011 / NIKL §25: added exact source-backed stem ㄼ/ㄾ + ending cases 넓다, 넓고, 넓지, 훑다, 훑고, 훑지 to the Python license inventory and mirrored them in browser JavaScript. No generic ㄼ/ㄾ category license was added.
- R012 / NIKL §26: added exact source-backed Sino-Korean ㄹ + ㄷ/ㅅ/ㅈ cases 갈등, 발동, 절도, 말살, 일시, 갈증, 물질, 발전, 몰상식, 불세출. 불소 is deliberately omitted because the relevant reading depends on lexical sense.
- R013 / NIKL §27: mirrored the already source-backed attached ending -ㄹ게 → fortis onset rule in the browser engine, using official Q&A 330963. The rule does not cross a written space; a negative control tests that boundary.
- R014 / NIKL §28: mirrored the entire existing Python exact-compound table into browser JavaScript. Benchmark review exposed 물가, whose gold was [물까] while both the model and prior native browser behavior missed the fortition. Official NIKL Q&A 316282 explicitly lists 물가[물까] and 봄비[봄삐]; both exact-form licenses are now in Python and browser. This is an exact lexical license, not a general ㄹ+ㄱ or ㅁ+ㅂ rule.
- R015 / NIKL §30: mirrored the 15 exact source-backed saisiot forms from the Python inventory into the browser engine, including deletion + fortition and the listed nasalization/n-insertion cases. 베갯잇 and 도리깻열 remain fail-closed because they are not in the adjudicated rule inventory.
- Added Python and browser regression coverage, including negative controls against category-only overgeneralization. The official sources used for the new exact-form rules are registered in data/korean/sources.csv and research/SOURCE-REGISTER.csv.

### Teacher benchmark correction: do not use the previous narrow score delta

The first Charsiu dev run [40334001997](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40334001997) completed and produced a raw artifact. Review found that its initial “narrow vs broad” comparison was not controlled: broad scores came from the full native pipeline with lexical IPA overrides, while narrow scores came from a direct renderer call that bypassed those overrides and did not preserve the full pipeline's unresolved-pronunciation abstentions. Therefore the apparent narrow-profile gain in that artifact must not be cited as an effect size for the sibilant rule.

The runner was corrected to render broad and narrow from the same post-rule syllable analysis; exclude lexical IPA overrides from both controlled profile outputs; preserve the same unresolved-pronunciation abstentions for both profiles; keep the full production-pipeline baseline separately; and record per-occurrence raw outputs and deltas with an explicit convention-unreviewed, diagnostic-only interpretation.

The g2pk comparison adapter was also made importable at module level. The earlier Charsiu artifact showed g2pk blocked because the runner imported a nonexistent _g2pk_surface_to_ipa; that was fixed and regression-tested.

### Verification state and task ledger

- DONE_PENDING_CI: source-backed R011/R012/R014/R015 exact-form rule inventories and R013 attached-ending rule are implemented in both Python and browser runtime, with positive/negative regression tests.
- DONE_PENDING_CI: official NIKL Q&A 316282 and 330963 are registered and the source-backed R014/R013 cases are documented.
- DONE_PENDING_CI: controlled broad/narrow IPA profile renderer, common abstention gate, per-occurrence ledger, and g2pk adapter regression are implemented.
- BLOCKED_PENDING_EVIDENCE: no Charsiu output is automatically promoted. Its output convention still lacks an independently adjudicated mapping to ClippyFirst broad IPA; training overlap and checkpoint license remain unresolved.
- TODO: inspect the corrected dev artifact after it completes; classify repeated disagreements as already-covered source rules, IPA convention/feature differences, genuinely missing phonological environments, or morphology/lexical uncertainty. Promote only independently source-confirmed candidates with positive and negative controls.
- BLOCKED: live official NIKL source-inventory workflow remains skipped/blocked by source access, not passed. Independent IPA→Ukrainian target gold is still absent.

At handoff update time, corrected Charsiu train/dev run [40338300356](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40338300356) and later exact-head run [40338691112](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40338691112) were queued. Latest system verification [40338700703](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40338700703) was also queued. These are not passes. Latest code/source head before this documentation batch was 6b1eb894f15c74fdfb4afd11bebbb146f7e0dabf.

Readiness remains research-ready partial prototype, not release-ready until exact-head CI passes, corrected dev artifacts are inspected, target IPA/Ukrainian adjudication is established, and remaining evidence gaps are resolved.
## 2026-10-26 final rule-inventory parity addendum

A second inventory comparison found and closed further Python/browser gaps:
- R002 formal-liaison inventory was missing the exact Python licenses for 앉아라 and 없어도; these are now mirrored in the browser table.
- R009 / NIKL §29 had 29 source-backed word-internal n-insertion licenses in Python but no matching browser word map. The full 29-form map is now mirrored; the existing six phrase-level insertion licenses are also represented in Python for explicit phrase-boundary mode.
- Added tests/test_rule_license_parity.py, which compares the actual Python and JavaScript exact-form maps for R002/R003/R004/R007/R009/R010/R011/R012/R014/R015/R016 and compares R013/R009 phrase-license sets. This guards against the same class of cross-runtime drift recurring.
- Added a browser behavior regression for representative R009 forms and a negative control (솜이 is not licensed merely because it has a coda before ㅣ).

The full audited map counts now match across runtimes for the compared exact-form families: R002 formal 33; R002 substantive 5; R003 18; R004 1; R007 2; R009 word-internal 29; R010 2; R011 6; R012 10; R014 20; R015 15; R016 3. R013 adnominal phrase sets match at 9; R009 phrase sets match at 6. This is source-inventory parity, not proof that every pronunciation is independently adjudicated.

Verification remains blocked by the hosted runner queue. At code/test head cbd4c90c383881e7346763da208295c7659a3044, the full tests workflow [40340319366](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40340319366), system verification [40340318888](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40340318888), and corrected Charsiu train/dev workflow [40340319150](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40340319150) were queued, not passed. A local git clone was attempted but failed because the environment could not resolve github.com; local tests were therefore not run. Do not mark these changes DONE_VERIFIED until the queued workflows return final results.

The corrected Charsiu comparison remains evidence-only. No Charsiu output has been automatically promoted into production; the new runtime rules above are supported by the registered official NIKL rules/Q&A, and the benchmark disagreement only helped prioritize source review. Readiness remains research-ready partial prototype, not release-ready.

## 2026-10-26 continuation: productive morphology licenses and benchmark integrity

### Executable work added (verification pending)

- Fixed the recursion defect in `scripts/benchmark_charsiu_research_split.py` (commit `4a1b4f5d1cd9c8dee985dd7858922dc07eedc1f4`). The broad/narrow renderer comparison now runs both renderers from one post-rule syllable analysis and shares the production ambiguity gate; lexical IPA overrides are excluded from both controlled outputs.
- Extended the existing `src/korean_ukrainian/morphology_rule_licenses.py` rather than creating a duplicate module. The research-only helper now derives low-confidence exact-form licenses for R010/R011/R016 when two morphology analyses agree on a surface-aligned VV/VA stem + ending boundary. It also extends registered R012/R014/R015 lexical roots across a consensus-confirmed attached particle/ending. The strict default and browser runtime remain unchanged.
- Added tests for productive examples `읽고 → 일꼬`, `넓고 → 널꼬`, `많다 → 만따`, and source-registered lexical roots `물가로 → 물까로`, `봄비가 → 봄삐가`, `냇가에 → 내까에`, `갈등이 → 갈뜽이`. Negative controls include `닭고기`, `물가공`, analyzer-boundary disagreement, zero-width morphology, and missing/nonliteral source alignment. These are expected assertions in new tests, not claimed test passes.
- Updated README to document the research-only boundary and latest saved checkpoint result, 59.6% (596/1,000). Subsequent artifact reconciliation established that the earlier 60.2% (602/1,000) belongs to a distinct checkpoint on the same pinned train/dev data; retain both as run-to-run variation rather than calling the earlier score superseded.

### Benchmark-integrity correction

The UGTPHON test artifact [40328909490](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40328909490), artifact [12654815334](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40328909490/artifacts/12654815334), contains `물가로` at row `dc_inside_2261`, occurrence `2001`. That test mismatch was explicitly used to prioritize review of R014 compound fortition. NIKL Q&A 316282 subsequently verified the underlying lexical examples `물가[물까]` and `봄비[봄삐]`, but the `물가로` test occurrence is now **test-informed and not an untouched holdout**. Historical benchmark outputs remain intact for reproducibility; do not cite this occurrence or the unadjusted aggregate as independent final-evaluation evidence. A replacement holdout or a clearly reported exclusion is required for a final accuracy claim.

### Current task ledger

- `DONE_VERIFIED`: source-backed Python/browser exact-form inventories R002/R009/R011–R016 have been reconciled; the existing parity test checks the audited maps.
- `PARTIAL`: morphology-consensus licensing is implemented as an opt-in research helper, not as the default engine path. It remains low-confidence and diagnostic-only pending real-analyzer and exact-head CI.
- `PARTIAL`: Charsiu train/dev runner exists and its previous successful artifact can be used for raw hypothesis review, but the corrected controlled run has not yet completed successfully on the latest head.
- `BLOCKED`: Charsiu checkpoint weights license and training-data overlap remain unresolved; its output IPA convention is not independently mapped to ClippyFirst broad IPA.
- `BLOCKED`: the UGTPHON `물가로` test case has been used to prioritize a rule and is no longer independent. A fresh or explicitly decontaminated evaluation set is required.
- `BLOCKED`: independent IPA→Ukrainian target gold and authorized live NIKL source inventory remain unavailable/skipped.
- `TODO`: exact-head CI, real Kiwi/MeCab morphology smoke, and corrected Charsiu train/dev artifact inspection. No local test run is claimed: `git ls-remote https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System.git HEAD` failed because this environment could not resolve `github.com`.

At this update, the latest visible Actions jobs from code/test head `16d07d752ecdb6ddb02b7a679edcaa528cfc5348` were still queued (including tests run [40343058866](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40343058866) for the Charsiu workflow and system verification [40343058844](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40343058844)); later code/test commits were not yet associated with final check results. Do not mark the current implementation DONE_VERIFIED until current-head checks finish.

## Final handoff state for this one-pass continuation

- Latest branch HEAD: `f9cd130ad57c119fc2d600e63a28c9f6d000aacb`.
- Latest executable code/test HEAD: `e14b4b026738755dbee1c819da8635aec4f6c0f7`; later commits through branch HEAD update the handoff, audit, benchmark register, README, and PR description.
- Full test matrix on the preceding code/test head `16d07d752ecdb6ddb02b7a679edcaa528cfc5348`: [40343059002](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40343059002) is still queued across Python 3.11/3.12/3.13, browser/build, wheel install and corpus audit. System verification [40343058844](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40343058844) and corrected Charsiu train/dev [40343058866](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40343058866) are also still queued.
- The current executable head `e14b4b0` has no final check result surfaced by the connected Actions listing. Therefore the morphology-consensus changes, source-alignment hardening, and newly added tests remain `PARTIAL`, not `DONE_VERIFIED`.
- Local test execution was unavailable because the container cannot resolve github.com. No local or remote test pass is claimed for the latest code/test head.
- Release status: research-ready partial prototype, not release-ready. Next genuine blocker is exact-head CI completion, followed by inspecting the corrected train/dev artifact and constructing an evaluation set that excludes test-informed cases such as `물가로`.

## Superseding status correction — latest executable head 2026-10-26

This entry supersedes the prior executable-head references in earlier continuation notes.

- Latest executable code/test head: `36b8e909d65ebf0e69af22f6183155853f34ae14`.
- The final morphology hardening now also requires both analyzers to agree on whether an attached lexical-root suffix is a particle or an ending; a dedicated negative test covers disagreement.
- Exact-head test matrix: [40344662542](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40344662542), queued.
- Exact-head system verification: [40344662684](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40344662684), queued.
- Exact-head Charsiu train/dev: [40344662592](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40344662592), queued.
- Exact-head real morphology smoke: [40344662799](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40344662799), queued.
- The CI backlog remains the immediate verification blocker. No test pass is claimed for `36b8e90`; local test execution is unavailable because GitHub DNS resolution fails in the container.

## Latest code/test delta — lexical-rule provenance and fail-closed consensus (2026-10-26)

- Latest executable code/test head: `d09a739b2269298ffc2ef8941d0cf564a91f642d`.
- Lexical-root extension audit records now expose the registered root, the internal licensed syllable pair, and the exact full-form license separately from the external morpheme boundary. This prevents the report from misrepresenting a suffix boundary such as `가>로` as the internal R014 pair `물>가`.
- A regression assertion checks that provenance for `물가로`.
- Exact-head Actions for this SHA have not yet surfaced final results. The latest visible full matrix remains queued on earlier code/test heads; no test pass is claimed.

### Prior CI failure reconciliation

The earlier Python 3.13 failure in [run 40334002025](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40334002025) was the stale assertion `test_narrow_ipa_is_explicitly_unavailable` after the partial narrow profile had been implemented. The current branch's `tests/test_ipa.py` replaces that assertion with explicit partial-profile, source-scope, and unchanged-broad-default checks; `tests/test_narrow_ipa.py` adds positive/negative controls and the Ukrainian target fail-closed test. The old failure belongs to the earlier `81e5aa2` head, not the current code/test head. The replacement tests remain unverified until current-head run [40344916989](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40344916989) finishes.

## Latest continuation — systematic source-verified production-rule promotion (2026-10-26)

### Executed in the production runtime

Expanded the closed R010 inventory in both Python and browser runtimes with eleven source-backed NIKL §24 stem+ending examples (seven from the current normative rule page and four supported by the official teacher-training material):
- `안다 → 안따`
- `안고 → 안꼬`
- `감다 → 감따`
- `감고 → 감꼬`
- `껴안다 → 껴안따`
- `앉고 → 안꼬`
- `얹다 → 언따`
- `삼고 → 삼꼬`
- `더듬지 → 더듬찌`
- `닮고 → 담꼬`
- `젊지 → 점찌`

The production rule remains gated by an exact full-form + adjacent-pair license and the existing R010 coda/onset environment; this change does not create a broad coda-only heuristic. Added positive runtime regressions and negative controls for the official `-기-` exception (`안기다`), noun-like sequence `감도`, and ambiguous homograph `신고`. The latter is deliberately omitted from automatic licensing because the orthography can be a noun meaning ‘report’; an unconditional full-form rule would not be safe without morphology/sense evidence.

The Python map and browser `NIKL_24_STEM_NM_ENDING_FORMS` map are covered by the existing exact parity test. The canonical S001 source record points directly to the official NIKL Standard Pronunciation Rules page; S015 in `data/korean/sources.csv` and `SRC-NIKL-TRAINING-2009` in `research/SOURCE-REGISTER.csv` both record the official 2009 teacher-training material and its item-level rights uncertainty. The IPA convention review records scope and exclusions.

### Existing verified implementation preserved

- Existing source-backed inventories R002/R003/R004/R007/R009/R011/R012/R013/R014/R015/R016 and their browser parity are reused rather than duplicated.
- The partial narrow IPA profile remains optional/research-only; it is not treated as approved Ukrainian target input.
- The morphology-consensus adapter remains research-only and low-confidence. No analyzer output or Charsiu prediction was automatically promoted to normative pronunciation gold.

### Verification state and next acceptance gate

Commits in this batch: `6f0937c` (Python R010 inventory), `6b7b3e3` (browser inventory), `58ee23c` (runtime regression tests), `0f323e1` (source registry), `272f7ac` (IPA review evidence). These changes were made on `research/strict-teacher-guided-rule-mining-2026-10-26` under PR #339.

Exact-head GitHub Actions for `272f7ac9f0746d5005d2767495dd25361ed3c250` are queued, not passed:
- tests: [40346869597](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40346869597)
- system verification: [40346869660](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40346869660)
- corrected Charsiu broad/narrow train/dev: [40346870076](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40346870076)
- morphology-consensus diagnostic: [40346869726](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40346869726)

No local repository tests were run; the connected GitHub API is available, but a local checkout/runtime is not. Do not describe the batch as verified until the exact-head jobs complete.

### Remaining scope boundary

This is a source-verified production expansion of the closed inventory, **not** unrestricted productive morphological inference. The official rule depends on stem/ending morphology; broad generalization from surface consonants would incorrectly tense nouns and excluded `-기-` constructions. The next expansion must either add independently source-backed unambiguous forms to the closed inventory or implement a separately opt-in, explicitly low-confidence morphological route with adversarial controls. Neural-teacher output alone is never sufficient evidence for promotion.

## Follow-on source-backed promotion: R016 `읽거든` (2026-10-26)

The same review of official NIKL examples found that §11 explicitly contrasts `읽고[일꼬]` and `읽거든[일꺼든]`. Added the second example to the exact R016 inventory in Python and browser JavaScript, plus a production regression for the exact R016 trace and a negative control ensuring `닭고기` is not licensed by R016. The exact-map parity test already covers this inventory. This is another closed-inventory promotion based on the official source, not on teacher output alone.

Relevant code commits: `6f0937c` (R010 inventory), `6b7b3e3` (browser R010), `58ee23c` (R010 tests), `6f0937c`/subsequent map commit `6b2ffab` (R016 browser), `93431c3` and `ebba6ff` (R016 regression and negative-control assertion). Documentation continuation: `d6c3906`.

Latest exact-code CI jobs are still queued; most recent visible run set for executable head `ebba6ff8aceefa899e5ca90edccb8b4e421e5553` includes tests [40347179149](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40347179149), system verification [40347179134](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40347179134), and morphology consensus [40347179334](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40347179334). The workflow queue is heavily backlogged; status is queued, not pass. No local execution was available.

The next genuine step is to process any remaining source-confirmed cases against the existing inventory/rule scope and only widen productive morphology where the runtime can distinguish grammatical stem/ending boundaries from lexical lookalikes. Do not turn the model's higher exact-match score into a generic rule without that boundary evidence.




## Deterministic R003 exact-form coverage extension — 2026-10-26

- **Implementation:** added the six closed-form NIKL §12(4) H-deletion licenses `낳은 → 낳>은`, `놓아 → 놓>아`, `쌓이다 → 쌓>이`, `않은 → 않>은`, `닳아 → 닳>아`, and `싫어도 → 싫>어` to both Python and browser rule inventories. These are exact-form licenses, not a productive morphology heuristic.
- **Evidence:** NIKL Standard Pronunciation Rule 12(4) directly lists the cited examples and describes deletion of ㅎ before a vowel-initial ending/suffix. Official source: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002. The rule establishes Korean surface behavior only; it is not independent IPA or Ukrainian-target gold.
- **Regression coverage:** added Python positive cases plus a cross-form negative control, and browser surface-output checks for all six forms. Existing unresolved lookalikes remain fail-closed.
- **Commit sequence:** runtime Python `38aabed6d65d2c6d6eb38a5303e2a954eb138c8c`; browser mirror `0ab9b1ae2b64b5de75ebff1025e10f20880c0d8a`; Python tests `02e0f0bc6023f2dc984e98e16868ccf72b9f8690`; browser tests/current head `349aed2224cd3a79a7822084480d0ff7fba6b7ca`.
- **Verification status:** implementation and test additions are committed, but exact-head CI is still queued at the time of this entry. Do not mark DONE_VERIFIED until Python, browser/build, test-matrix and source/artifact workflows finish. The separate Charsiu research workflow previously failed before inference due to a missing import in `benchmark_charsiu_research_split.py`; that import was repaired in commit `17311ee275f154116b14a5915e5ddecfa9f5870f`, and its rerun is also queued.
- **Scope boundary:** this source-backed R003 expansion is not claimed as a rule discovered by the neural model. Teacher error buckets remain hypotheses until the model target convention is independently mapped to ClippyFirst broad IPA. No length mark is deleted, no teacher prediction is copied into production, and no test/holdout data is used for rule selection.


## Separate neural-teacher candidate register — 2026-10-26

Created [docs/NEURAL-TEACHER-CANDIDATE-RULE-REGISTER-2026-10-26.md](NEURAL-TEACHER-CANDIDATE-RULE-REGISTER-2026-10-26.md) as the canonical concise register for model-derived hypotheses, source-convention conflicts, existing coverage, and acceptance criteria. This is a companion register, not a replacement for this handoff or the existing mining/evaluation scripts.

Key reconciled counts: the latest saved scratch-teacher checkpoint is 596/1,000 exact on the SIGMORPHON tokenized-IPA dev convention (404 mismatches: 116 length-mark-only and 288 other). The distinct earlier checkpoint scored 602/1,000 (398 mismatches: 107 length-mark-only and 291 other). The cross-corpus train/train intersection has 1,084 shared forms, with 366 target strings needing review (151 length-only diagnostics, 215 other symbol/feature differences). These counts describe annotation-string discrepancies, not missing phonological rules. No generalized production rule has been independently confirmed specifically from neural-teacher output in this workstream. Six exact-form R003 licenses were added from NIKL §12(4), not distilled from the model.

The register enumerates ten review families, each explicitly labelled as a hypothesis/work queue rather than a discovered rule. It also defines the procedure to establish a defensible count: retrieve and hash exact-head artifacts; reconcile typed IPA conventions; enumerate case-level residuals; group source-confirmed environments; add positive/negative controls; evaluate only against reviewed ClippyFirst broad-IPA dev gold; then count source-confirmed-not-implemented candidates separately from hypothesis-only and blocked items.

Current verification caveat remains: the current PR #339 head has not been verified by local execution, and the last observed exact-head workflow set was queued. The register and this handoff update are documentation commits; they do not change runtime behavior or establish a new test pass. Release status remains research-ready partial prototype, not release-ready.


### Artifact-level metric reconciliation note

Artifact reconciliation is complete: artifact 12638313059 (run 40296965071) reports 602/1,000 exact, 107 length-mark-only, 291 other, best epoch 11, checkpoint SHA-256 4062bff4941fefe1b499a29163471e17d3e7eff2af690456d16f1fd93cc70a45. Artifacts 12638708277 and 12642016107 share checkpoint SHA-256 21cb99a696c911752694ec77b4dbd5f9d8496879e4ff3c3cf309485ad324be20 and prediction SHA-256 5a62bada44a00ae9809e3ae00b136b9788bfaf0b8c6988f8c22fe3626f24e559; both report 596/1,000 exact, 116 length-mark-only, 288 other, best epoch 12. The two distinct checkpoints use identical training/dev source hashes and 8,000/1,000 rows, with zero test rows loaded and no pretrained weights. This is reproducibility/run-to-run variation; neither result is independent generalization evidence.


## CI-driven correction batch and Charsiu case-level diagnostic — 2026-10-26

### Exact failures inspected from the earlier current-head Actions run

The run set associated with head eaf542ed259c89cde1fa3f9562083d94bacb01bb completed with failures, not passes:
- Python/system tests exposed a stale R010 negative assertion for 닮고, an R010 test fixture using the already-built-in licensed form 안고, a morphology-consensus test incorrectly expecting R010 to tense 많다, and a Python/browser §29 phrase inventory mismatch (Python had 한 입 while the browser map had 한 일).
- Browser tests exposed stale negative tests for newly source-licensed forms (깻잎, 나뭇잎, 냇가), rule-trace assertions against end-to-end lexical overrides that intentionally bypass the contextual-rule trace, a hard-coded source-register row count (113 vs current 116), and the attached -ㄹ게 IPA separator mismatch.
- Charsiu train/dev inference and report generation completed and uploaded artifact 12666733087, but its final validation step failed because the workflow asserted a lowercase phrase while the report text begins with “Controlled”. The workflow assertion was corrected; no successful rerun is yet confirmed.

### Corrections committed on the existing PR #339 branch

- Corrected the Python §29 phrase inventory to 한 일 / 한>일 to match the official NIKL phrase example and the existing browser map; updated its positive test.
- Tightened the research-only morphology-consensus helper so ㅎ-bearing codas in _H_CODAS cannot produce an R010 stem-n/m fortition candidate. Updated the 많다 test to expect the aspirated surface 만타 and no R010 license, and to require diagnostic-only marking only when a morphology license was actually applied.
- Updated the R010 tests so 닮고 is a positive exact-form license (supported by the official §24 inventory), 닮기 is the unlicensed lookalike, and the generic exact-license guard uses an unlisted fixture instead of 안고, which is already source-licensed.
- Updated the §30 negative tests to keep exact source-backed forms out of the unlicensed queue: 깻잎 and 나뭇잎 are no longer used as negative controls; 냇가 is no longer asserted to be unlicensed; 베갯잇 and 도리깻열 remain the unresolved negative controls.
- Updated browser rule tests to inspect applyContextualRules directly for exact map behavior when the end-to-end conversion is intentionally intercepted by an exact lexical pronunciation record. End-to-end surface-output assertions remain in place.
- Updated source-register integrity expectations from 113 to 116 rows and from 109 to 112 review-required entries, reflecting the three added NIKL sources.
- Corrected the browser IPA renderer to emit a dot between adjacent syllables in a single eojeol, matching the explicit syllable-boundary convention exercised by the regression for 할게.
- Corrected the Charsiu workflow assertion to match the report's case-sensitive wording.

### Charsiu artifact review: diagnostic counts, not missing rules

The paired report artifact 12666733087 from run 40356670303 was parsed locally. Its results and a 1,000-row SIGMORPHON / 1,834-row UGTPHON case cross-tab are documented in [NEURAL-TEACHER-CANDIDATE-RULE-REGISTER-2026-10-26.md](NEURAL-TEACHER-CANDIDATE-RULE-REGISTER-2026-10-26.md). Charsiu matches its corpus target while Strict broad does not on 345 SIGMORPHON and 728 UGTPHON dev rows under the declared diagnostic normalizer. The raw examples show diacritic, aspiration, syllable-boundary and source-tokenization differences; these 1,073 rows are a convention-review queue, not a count of missing rules. The partial narrow profile changes apparent exact-match rates materially, further establishing that source IPA convention mapping must precede phonological rule mining. Charsiu checkpoint licensing and exact training overlap remain unresolved.

### Verification status after corrections

Latest documentation/code/test commit observed while updating this handoff: 30d69861940dc9a7be2ee5da23038d1d10f9695f. The earlier failing run proves the identified defects existed on its head. The connected Actions listing showed the 4dbe87f head's workflows queued; later commits were not associated with surfaced exact-head runs at the time of this update. No local repository checkout is available and no local pytest/npm suite is claimed. Therefore all corrections remain PARTIAL until the latest commit's Python 3.11–3.13, browser/build, system verification, corpus audit, scratch-teacher, and Charsiu workflows finish successfully. Do not merge PR #339 or mark release-ready on the basis of these commits alone.


## Superseding follow-on: close omitted source-backed R010 example 안지 — 2026-10-26

- Primary evidence: S015 / SRC-NIKL-TRAINING-2009 already registered the official NIKL teacher-training PDF and explicitly lists 안지[안찌] under §24. Item-level reuse marking remains unresolved; the source establishes Korean surface behavior only.
- Added exact full-form + pair license 안지 → 안>지 in Python R010 and browser NIKL_24_STEM_NM_ENDING_FORMS. Added Python positive regression (surface 안찌, onset ㅉ) and browser generic-mode IPA/rule regression (an.tɕ͈i), while retaining the existing negative controls for 감도 and -기- forms.
- R010 inventory count is now 14 exact entries on both Python and browser sides by static map inspection. This is a source-backed closed-inventory completion, not a neural-teacher-derived generalized rule.
- Latest executable code/test commit: 102242c93c95ee8e7300879a8716851c3a5baa01. Latest register update: b30762a81e6d15c80a28e00083785a674d8461f1. No local test execution is claimed.
- Exact-head CI remains unverified: the connected workflow API returned no runs for the recent Contents-API commits after the queued 4dbe87f head. The earlier failing runs were inspected and corrected, but their results do not verify these later commits. The next acceptance gate is to obtain a genuine exact-head run for Python/browser tests, system verification, source audit, and research workflows; do not merge or mark DONE_VERIFIED before that.


## Superseding source-backed R010 addition: 신다 — 2026-10-26

- Primary source verified: official NIKL Online Q&A 325349 states that 신다 is pronounced [신따] under Standard Pronunciation Rule 24 and distinguishes it from 산다; the page was retrieved during this work session. It is now registered as SRC-NIKL-QNA-325349.
- Added exact-form pair 신다 → 신>다 to the Python and browser R010 maps, with tests for surface 신따 and broad IPA sin.t͈a. The existing lexical record independently stores 신다[신ː따], but the Q&A provides the explicit §24 morphology explanation.
- R010 now contains 15 exact entries on each runtime side by static inspection: the original 13, plus 안지 and 신다. The source register now has 117 data rows; the audit expectation is 113 review-required, one item-level license recorded, one not-applicable, and two manual-classification rows.
- Latest runtime/test commit before this documentation note: 8fa826ce01f36f7b726a8ddb1caf3cbc4f6fe47d. Latest register note: 9da3bccd35b3603db00ecfea04c907ce17a2a119. Exact-head CI has not yet been observed for these latest commits; do not mark this batch DONE_VERIFIED until it runs.


## Final reconciliation note for this execution pass — 2026-10-26

- Updated the article-by-article audit at docs/NIKL-STANDARD-PRONUNCIATION-AUDIT-2026-10-09.md to name the exact new §24 evidence for 안지 (S015) and 신다 (SRC-NIKL-QNA-325349), while retaining the reason ambiguous 신고/감지 are not automatically licensed.
- A static CSV parse of research/SOURCE-REGISTER.csv found 117 data rows, 12 columns in every row, no duplicate source IDs, and rights classification counts matching the repository's audit rules: 113 REVIEW_REQUIRED, 1 ITEM_LEVEL_LICENSE_RECORDED, 1 NOT_APPLICABLE_RECORDED, 2 MANUAL_CLASSIFICATION_REQUIRED. This is a pre-CI structural check, not a claim that the repository audit test passed.
- Current PR #339 remains Draft and unmerged. Current branch HEAD at the time of this note is ed492e6781e7392218e0af939c6fc6b207673e98; the latest executable-code/test commit is 8fa826ce01f36f7b726a8ddb1caf3cbc4f6fe47d. The associated exact-tree Actions set (13 workflows) remained queued when last checked; no Python, browser, build, teacher, or benchmark result is claimed as passing on that tree. No local checkout was available, so no local tests were run.
- Outcome ledger: source-backed implementation additions 안지 and 신다 are **PARTIAL pending CI**; R010 map parity and source-register integrity are **statically inspected, not DONE_VERIFIED**; Charsiu case-level results are **exploratory, convention-unreviewed**; generalized neural-teacher-derived production rules remain **0 confirmed**; IPA-convention adapter and independent Ukrainian target gold remain **BLOCKED by missing independent review/evidence**.
- Stop/go: continue with exact-head CI retrieval when the external Actions queue becomes available. Do not merge PR #339, promote neural-derived rules, or claim release readiness until required verification and linguistic review gates pass.


## Reuse of train/train IPA adjudication queue; PR #340 reconciliation — 2026-10-26

PR #340 (“Research: build train-only IPA conflict adjudication queue”) is closed and unmerged. I inspected its changed files and its failed CI logs. The predecessor script failed three unit tests with KeyError: _normalized_source because build_queue assumed rows had been preprocessed by load_rows, while unit tests passed valid raw pinned rows directly.

The useful functionality is already present in the current PR #339 branch and is more robust: scripts/build_korean_ipa_adjudication_queue.py calls _prepare_in_memory_rows for both train corpora before grouping; tests/test_build_korean_ipa_adjudication_queue.py covers raw in-memory rows and train-only/pin/duplicate guards; .github/workflows/teacher-corpus-audit.yml runs the generator and uploads korean-ipa-adjudication-queue.json alongside separate train/dev corpora and typed-IPA packets. I did not reopen or merge PR #340 and did not duplicate its files.

The queue is deliberately conservative: it uses only pinned train/train forms, removes SIGMORPHON whitespace-token serialization for comparison only, preserves all raw IPA and source IDs, and does not select gold, map IPA symbols, or generate production rules. It is the appropriate case-level evidence queue for the next research stage. Its status remains PARTIAL until the current branch's unit tests and Teacher corpus split audit pass and the current artifact is retrieved.

The relevant current-head workflow set was still queued when last checked. The earlier PR #340 failures are evidence about the predecessor only; they do not prove that the current PR #339 implementation fails or passes. The current branch implementation must be judged on its own exact-head run.


## Train/train queue safety fix — partial annotation overlap — 2026-10-26

Inspection of scripts/build_korean_ipa_adjudication_queue.py found a second edge case beyond the closed PR #340 unit-test defect: the prior difference classifier treated any non-empty intersection between target sets as exact and omitted the entire source form. That could silently discard a conflict when one corpus had multiple annotations and only one target overlapped the other corpus.

Fixed the classifier to:
- exclude a form as exact only when the complete normalized target sets are equal;
- retain any non-empty-but-partial overlap as partial_annotation_overlap_requires_review;
- classify dot-only or length-only diagnostics only when the full sets are equal after that diagnostic transform;
- add a regression with two SIGMORPHON variants where only one overlaps UGTPHON, asserting both variants remain in the queue.

This is an evidence-preservation fix, not a phonological rule or IPA mapping. Latest executable code/test commit: e825398429750af093bda60645bcb0efbadcb6b8. Exact-head workflow set 403630138xx was queued at the last check; no pass is claimed. The queue remains PARTIAL until the unit tests, Teacher corpus split audit, and artifact upload succeed.


## Owner-directed priority change — exhaustive test-case register first (2026-10-26)

The owner clarified that the next deliverable must be a register of **all rules and every concrete example discovered or exercised by each test**, before any further implementation edits. The canonical new document is [Master test-case and rule-evidence register](MASTER-TEST-CASE-AND-RULE-REGISTER-2026-10-26.md).

- Current register status: **PARTIAL INVENTORY**, not complete. It contains a first batch of directly inspected examples and a full-scope test-family index, but it does not yet contain every case from all 28 lexical evidence batches, all test fixtures/corpora, every test assertion, and all historical run artifacts.
- Code-change freeze for this workstream: no additional production-rule edits until the completeness gate in the register is satisfied. This is a documentation/data-inventory phase, not a rule-mining or rule-promotion phase.
- Keep expected values distinct from observed outputs. A passing test run is recorded only when its workflow run is tied to the exact commit; a test assertion by itself is EXPECTED_ONLY.
- Keep every counterexample and forbidden trace, punctuation boundary, unresolved/abstention case, permitted variant, and repeated test provenance. Do not collapse different modes (generic/no lexicon, lexical override, strict morphology, research morphology, browser and Python) into one result.
- Research-teacher and SIGMORPHON/UGTPHON/Charsiu discrepancies remain a separate typed case class. Annotation differences are not automatically missing phonological rules.
- Next execution order: enumerate the repository test/fixture/corpus manifest; extract the complete lexical CSV and all lexical review batches; extract case literals and expected IPA/Ukrainian values from every test; reconcile actual CI outcomes/artifacts by commit; add machine-readable case rows and integrity checks; publish audited counts and only then return to rule-level work.
- Exact current branch at the point this priority change began: `research/strict-teacher-guided-rule-mining-2026-10-26`. New register commit: `b7d6c9d0bcd5a8558d07589eedf5007d8454ef94`.


### Test-case register progress — 2026-10-26

- Created canonical case-register specification: docs/MASTER-TEST-CASE-AND-RULE-REGISTER-2026-10-26.md.
- Created research/TEST-CASE-REGISTER-MANIFEST-2026-10-26.csv: 431 tracked inventory rows including 179 test-source files, 177 fixture files, one corpus file, and relevant Korean data/research scripts.
- Created research/TEST-CASE-REGISTER-LEXICAL-BASE-2026-10-26.csv from the pinned lexical dictionary: all 644 rows preserved, 17 columns, zero malformed rows and zero duplicate input forms. Source blob SHA: 1bd0d8116a5f5a4e74bcdbf7fc4999445b4478c5.
- These are inventory foundations, not completion. Every test assertion still needs a case-level link; non-lexical fixtures/literals need extraction; expected outputs must remain separate from observed outcomes; actual pass/fail evidence must tie to an exact commit and workflow run.
- **No further production-rule changes until the exhaustive case-register completeness gate passes.**


- Added scripts/build_test_case_register.py plus tests/test_build_test_case_register.py. The extractor produces five separate CSVs: lexical source rows, lexical-to-test text-occurrence links, all Hangul spans, a line-by-line inventory of every scannable test/fixture/corpus source line (including IPA-only and Latin-script assertions), and unclassified assertion/test-declaration candidates. Occurrences and literal spans remain unclassified; this avoids pretending that a string match proves a test input or a rule pass. Exact-head CI is pending; no local test result is claimed.

## Efficient neural-teacher → deterministic-rule workflow — owner priority — 2026-10-26

The goal is not to copy teacher predictions into the engine. The teacher is a hypothesis generator; each promotion must preserve the pipeline Hangul structure/morphology → Korean phonology → typed IPA → Ukrainian adaptation → Ukrainian orthography.

### Resource-efficient execution order

1. Reuse pinned corpora and existing teacher/engine artifacts; do not retrain or rerun an expensive model unless the current artifact is missing, incompatible, or fails integrity checks.
2. Build a single case-level ledger keyed by stable case ID and source hashes. Preserve raw source/target strings, tokenization, tone/length/diacritics, word/syllable boundaries, model checkpoint, engine commit, run ID, mode, and provenance. Keep expected values, observed outputs, and adjudicated gold in separate fields.
3. Run cheap deterministic checks first: exact token match, reviewed serialization-only comparison, known IPA convention mapping, and existing rule trace. Never normalize away length, stress, boundaries, or features without an explicit reviewed policy.
4. Classify remaining mismatches by pipeline stage. Distinguish model error, reference/convention disagreement, engine bug, missing general rule, morphology uncertainty, Ukrainian mapping gap, and formatting defect. Unknown cases stay unresolved rather than being forced into a category.
5. Cluster by shared phonological/morphological environment and ordered rule interaction, not just by surface spelling. Rank candidate clusters by estimated coverage × confidence × implementation simplicity, with uncertainty and regression risk as penalties. Prefer one verified general rule over many lexical exceptions.
6. For each candidate, automatically assemble positive examples, nearest negative controls, counterexamples, source citations, and affected existing tests. Require exact-environment primary evidence or independently adjudicated pronunciation evidence before promotion.
7. Implement a small coherent batch; add regression cases for every reviewed positive and negative example; run the relevant focused tests, then full Python/browser parity and independent held-out evaluation. Record baseline vs candidate counts and errors by class.
8. Keep lexical overrides as explicit exceptions only when the evidence supports lexical specificity. A candidate that does not improve held-out performance or causes unexplained regressions is rejected or rolled back.

### Current execution evidence and blockers

- The latest inspected run for the test-case extractor failed because its unit test expected a Python test declaration even though the temporary fixture only contained JavaScript; the fixture now includes an actual JavaScript test declaration and assertion. The extractor must still pass on an exact-head run before its inventories can be trusted.
- The latest inspected browser test failures include separator-contract mismatches caused by a temporary change to use spaces between adjacent Hangul syllables. The renderer preserves literal spaces itself; a dot is required between adjacent syllables within a token and does not cross literal whitespace. Restored the dot separator in `src/app/engine_convert.js`; exact-head verification is still pending.
- Other failures remain to adjudicate, including exact-form outputs for `훑다`/surface `훑따` vs the test's `훌따`, saisiot `고갯짓` expected `고개찟` vs observed `고개찓`, the §29 `홑이불` license, the §24 `신다` IPA expected `sin.t͈a` vs observed `ɕin.t͈a`, and a CLI rights-inventory count (116 vs 117). Do not silently change gold values or broaden rules to make CI green; inspect the exact source and contract for each.
- The latest inspected full test workflow failed in browser and Python jobs; one matrix leg was cancelled after another failure. The case-register workflow also failed. These are real failures from runs on earlier branch heads, not results for the latest edits. No exact-head green result is claimed.
- Production changes are paused except reverting the identified IPA separator regression. The next high-value step is to retrieve the newly triggered exact-head workflow results, repair the extractor's own contract first, then turn the failure list and teacher prediction artifacts into linked case rows before promoting any teacher-derived rule.

### Selection metric

For each candidate cluster record: `eligible_cases`, `cases_explained`, `independent_source_count`, `positive_controls`, `negative_controls`, `heldout_delta`, `regressions`, `confidence`, and `implementation_cost`. Do not use teacher exact-match score alone as a production objective. Optimize verified error reduction on eligible held-out cases, with zero unexplained regression as the guardrail.

## Latest continuation — efficiency improvements and teacher artifact triage (2026-10-26)

### Evidence retrieved and analyzed
- Retrieved and inspected GitHub Actions artifact `12675765407` from scratch-teacher run `40376661106`. Checkpoint SHA-256: `4062bff4941fefe1b499a29163471e17d3e7eff2af690456d16f1fd93cc70a45`; 8,000 train / 1,000 dev rows, zero test rows loaded, no pretrained weights, best epoch 11. Dev metrics: 602/1,000 exact, 107 length-mark-only differences, 291 other differences. Length marks were underpredicted in 80 cases and overpredicted in 27; reference had 237 length tokens and prediction 145. This is a model-error triage signal only, not permission to normalize length or infer production rules.
- Re-read the paired teacher/Strict artifact: 994 scored pairs, six excluded unresolved cases, and no metrics computed because IPA conventions are unreviewed/incompatible. Do not mine production rules directly from these pairs.
- Retrieved multi-engine diagnostic artifact `12675825441` from run `40376661231`. It reports 2,703 UGTPHON test-token occurrences and 999 eligible SIGMORPHON test words. Native exact rates are 53.00% and 35.81% under the artifact's diagnostic normalizer, respectively. These are noisy/non-normative test diagnostics and must not be used for candidate selection or rule tuning; the artifact itself says so. Use it to characterize coverage and failure modes only, not to claim generalization.
- Reused rather than retrained the scratch teacher: the retrieved checkpoint SHA matches an earlier run's artifact, so repeating training would not currently add information.

### Correctness guard added
- `scripts/mine_deterministic_rule_candidates.py` now fails closed unless provenance explicitly supplies teacher and Strict IPA convention labels, `ipa_conventions_comparable=true`, and a reviewed mapping ID. “Both outputs are IPA” is not enough to make them comparable.
- Added a regression test that an unreviewed convention comparison is rejected.
- Added the miner script and its test to the teacher corpus audit workflow path filters and test command.
- Updated `docs/NEURAL-TEACHER-CANDIDATE-RULE-REGISTER-2026-10-26.md` with exact artifact provenance, error counts, interpretation limits, and the new gate.

### Verification status and next action
- Current branch head after these changes is recorded in GitHub ref `research/strict-teacher-guided-rule-mining-2026-10-26`; retrieve the ref for the current SHA rather than copying a stale SHA from this handoff.
- The exact-head Actions runs observed after the latest changes were queued due the repository's CI backlog. The case-register extractor had a real failure on the prior head: its assertion expected an unindented raw line although the fixture intentionally preserved source indentation. Corrected the expected line and committed that fix; the subsequent exact-head run still must pass before the register is trusted.
- No new production phonology rule was promoted from the teacher. The efficient next step is to get the extractor and guard tests green, use the generated register to cross-link the complete set of test cases, and then classify existing dev/model mismatches by reviewed IPA feature before any rule-level experiment. Do not treat benchmark test splits as rule-selection data.

## Regression triage after first executable CI feedback — 2026-10-26

The first executable browser workflow after the inventory/miner changes (run `40377932233`, commit `980d98b5d459f8ace471124027030d65a15c32d2`) exposed several distinct classes. Do not mix them into one “phonology failure” count:

1. **IPA serialization contract:** many assertions expected spaces between syllable-level IPA units, while the documented result contract emits dots within an eojeol and preserves source whitespace between eojeols. Later test files now contain dotted expectations; the cited failing run predates those test-source states. The latest exact-head run must establish whether this migration is complete.
2. **Source-backed production gaps fixed but unverified:** in browser R011, exact licensed ㄾ forms now reduce ㄾ to ㄹ before the §25 fortis ending (so 훑다 should yield 훌따); the Python R011 adapter mirrors this and has a new regression assertion. In browser context processing, an exact §29 word-insertion license now prevents an unrelated unlicensed §17 palatalization guard from short-circuiting 홑이불[혼니불]. These changes preserve exact-form gating; they do not add productive guessing.
3. **Incorrect test expectations corrected from the repository's source-backed record:** 고갯짓 expected surface was corrected to 고개찓, matching the lexical evidence row, and the exact §24 신다 IPA expectation was corrected to ɕin.t͈a. The source-register count assertion was updated from 116 to 117 after the two registered source-backed additions.
4. **Extractor validation defect fixed:** the lexical-to-test table is one-to-many, so case_id is a foreign key, not a unique row ID. Each occurrence now receives a stable `link_id`; the CI uniqueness gate validates `link_id`. The source scanner now also includes checked-in `data/korean/` and `examples/` inputs, keeps lexical links restricted to tests, records source category, and deliberately excludes its own generated `research/` outputs to avoid recursive ingestion.

These are code/test changes, not verified outcomes. The exact-head test-case-register workflow and full browser/Python suite were still queued at the last check because of the GitHub Actions backlog. Local execution is unavailable in this environment (no local checkout and network access to GitHub is blocked). Do not count any of the above as DONE_VERIFIED until the relevant exact-head jobs pass; if a new failure occurs, inspect its assertion and source evidence before changing the expected value.

## One-pass continuation update — 2026-10-26, current branch head `44c3750cc874e9184471d1efc74b76050f47ee93`

### Completed and evidence-backed

- **DONE_VERIFIED — reproducible candidate inventory generation:** exact-head artifact run [40381081948](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40381081948), artifact [12681810325](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40381081948/artifacts/12681810325). It preserved 34,452 raw source lines from 385 files, extracted 50,737 Hangul-literal candidates and 5,512 assertion/test-declaration candidates, linked 644 lexical rows to 6,790 test-text occurrences, and retained 357 test files. These are candidates, not a semantically adjudicated 50k-case corpus. The artifact should be reused; no need to retrain a teacher for extraction.
- **DONE_VERIFIED — Python test import repair:** `tests/test_rules.py` now imports the public `phoneticize_korean` function used by the §25/26 regression. Python 3.11 and 3.13 passed in run [40393795942](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40393795942); Python 3.12 was still in progress at the last check.
- **DONE_VERIFIED — target-mapping failure no longer hides resolved Korean surface:** `src/app/engine_convert.js` now derives the displayed Korean surface from the resolved phonological units and only withholds it for explicitly unlicensed Korean morphology. This fixed the §30 `뒷마루` surface-visibility failure in system run [40394525415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40394525415): the browser suite decreased from 33 to 31 failures. This fix keeps the pipeline boundary intact: Korean surface/IPA analysis is not erased just because the Ukrainian mapping is unavailable.
- **PARTIAL — attached -ㄹ게 guard implementation committed, exact-head CI pending:** the browser rule now checks the original orthographic coda before applying the attached `-ㄹ게` fortition, avoiding accidental application when a complex coda has been reduced earlier. The contradictory `넓게` negative assertion was corrected: `넓게 → 널께` is independently source-licensed in the lexical dictionary (§25), while the productive -ㄹ게 rule itself must not generalize from that reduced coda.
- **Implementation committed, verification pending — §24 exact forms:** the browser runtime now reduces only licensed complex codas in the exact §24 stem-n/m inventory before fortition (e.g. `닮고 → 담꼬`), rather than retaining the orthographic complex coda in the exposed surface.

### Rejected experiment / preserved contract

A trial changing lexical IPA syllable joining from spaces to dots raised the browser failure count from 33 to 49. It was reverted in commit `0520ea7dd64bc94ee693572d99e187d19e1eb1bd`. Do not repeat a global separator replacement. Existing tests mix dotted and whitespace-separated IPA expectations; resolve this by adjudicating the declared result contract and word/syllable boundaries, then make a coordinated renderer + test migration with positive and negative controls.

### Exact current verification status

The latest code head is `44c3750cc874e9184471d1efc74b76050f47ee93` on `research/strict-teacher-guided-rule-mining-2026-10-26`, PR #339 remains open and draft. Workflows for this head were queued/in progress at the last poll; **do not claim exact-head green CI**.

The latest completed browser/system test evidence is run [40394525415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40394525415) on the preceding code head `61b2f5e44a5373eab254cebf7d4d45a5aae57555`: 1,225 passed, 31 failed. Remaining observed failure clusters include:
- inconsistent IPA separator expectations (dots vs spaces) across lexical, generic and variant paths;
- generic vowel-variant output/boundary handling;
- the §24 `닮고` surface mismatch (targeted in the current head but not yet re-run);
- several source-backed IPA/surface regressions whose expected/observed values need individual case records before changing production rules.

The neural teacher's saved dev-pair artifact marks comparisons `BLOCKED_INCOMPATIBLE_OR_UNREVIEWED_IPA_CONVENTIONS`; it was trained/selected on the same dev split. Do not treat its outputs as gold, tune production rules from those dev examples, or claim accuracy gains. No new generalized production rule has been promoted from teacher output in this continuation.

### Next actions, in order

1. Poll the current-head test and system-verification workflows for `44c3750cc874e9184471d1efc74b76050f47ee93`; fix only failures supported by source evidence or a clear implementation defect, then rerun.
2. Build case-level rows from the existing inventory artifact: exact input × mode × expected assertion, test title/path/line, raw expected IPA and Ukrainian target, source/license, observed current-head output/run. Keep duplicate provenance and distinguish expected-only from observed.
3. Resolve IPA boundary serialization once against the documented contract, including variant generation, without lossy global normalization.
4. After the register and adapter contract are reliable, use eligible training examples for exploratory teacher-guided clustering. Keep dev for validation and test/holdout sealed; do not retrain the scratch teacher unless the data or architecture changes.
5. Update this handoff and the case register with final exact-head CI, final SHA and remaining blockers. Keep PR #339 draft until all required checks pass and the source/IPA/target gates are satisfied.

## Follow-up — IPA boundary migration and current CI blocker (2026-10-26)

The code/test head before this note is `5bf3eba6da219aca76084ea9d9ac384206365806`.

- **Implementation committed:** lexical IPA now renders `.` between syllables within a Korean eojeol and preserves literal source whitespace between eojeols. The same renderer contract is applied to generic vowel variants and source-backed surface-only lexical paths.
- **Regression expectations updated:** single-word IPA fixtures that previously expected spaces now expect within-word dots; phrase-level expected IPA is generated from the Korean input's actual whitespace boundaries. This avoids both false word-boundary insertion and dots crossing real spaces.
- **The previous completed browser result is not a verdict on this migration.** Run [40394805769](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40394805769), on pre-migration code head `44c3750cc874e9184471d1efc74b76050f47ee93`, reported 1,226 passing and 30 failing tests. Several were known separator-contract mismatches; other failures included generic-vowel variant expectations and exact-form surface handling. The current migration has not yet been verified by CI.
- Current-head workflow batch for `5bf3eba6da219aca76084ea9d9ac384206365806` includes test run [40396716406](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40396716406) and system verification [40396716306](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40396716306). Both were queued at last poll. This is an external CI-queue blocker, not a pass.
- **Do not close the phase or mark release-ready until the current-head browser suite, Python 3.11–3.13 matrix, wheel install, artifact regeneration, and parity checks finish.** If any new failure remains, inspect its exact assertion and source before editing expected values or production rules. The IPA serializer migration is complete as an implementation batch, but acceptance remains PARTIAL pending exact-head verification.

The test-case inventory artifact remains the reusable source of candidate occurrences; full case-level semantic classification and the evidence-gated teacher-to-rule mining stage remain incomplete. Teacher dev comparisons are still blocked by IPA convention incompatibility and must not be used as gold labels.



## Continuation checkpoint — lossless register rows and exact-head CI (2026-10-26)

### Implementation completed

- **DONE_VERIFIED at the focused-step level — exact raw source preservation:** removed whitespace stripping from the derived lexical-test-link and Hangul-literal candidate rows. Source indentation and trailing whitespace now survive consistently with the source-line inventory.
- Added regression assertions for an indented test line to both output families. The extraction workflow's focused “Test extractor behavior” step passed on code/test head [ceda29b9e472f361cae5912e10e5896bcf7672b9](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/ceda29b9e472f361cae5912e10e5896bcf7672b9), workflow [40400451180](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40400451180).
- Master case-register documentation updated in commit [7cb1202601026bd9f69511c9a2a12406c6d4cdc4](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/7cb1202601026bd9f69511c9a2a12406c6d4cdc4). No production phonological rule was changed.

### Verification state — do not overstate

- The exact-head extraction workflow was still generating the five inventories and uploading its artifact at the last poll. New generated counts and hashes remain **PENDING**.
- The full test matrix for code/test head ceda29b was queued; the current branch's browser/system workflows show a broad IPA serialization regression cluster. The preceding executable head's Python 3.11, 3.12, 3.13, wheel-install and teacher-corpus-audit jobs passed, but its browser job failed. Those older passes do not prove the new head green.
- Browser output currently renders within-eojeol syllable boundaries with dots, while many older test expectations still use spaces (e.g. actual nʌk̚.ɕ͈i vs expected nʌk̚ ɕ͈i). The intended dot-within-eojeol / preserve-source-whitespace-between-eojeols contract is documented in the preceding IPA-boundary migration note. This is a test/contract reconciliation task, not evidence to change Korean phonological rules. Preserve genuine surface/variant mismatches as separate failures.
- PR #339 remains open and draft. No merge or release claim is justified.

### Task ledger

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Preserve raw source lines in all derived register rows | DONE_VERIFIED (focused regression step) | Focused extractor step passed in run 40400451180; exact full inventory artifact still pending |
| Regenerate all five inventories at the updated head | PARTIAL | Workflow generation/upload step was in progress; record counts, hashes and artifact URL after completion |
| Run exact-head Python 3.11–3.13, browser, build and wheel checks | PARTIAL | Full matrix pending; do not reuse old-head green jobs |
| Resolve remaining IPA serialization expectations | TODO | Reconcile each expected value against input eojeol boundaries and the declared renderer contract; do not blanket-replace spaces or modify source-backed pronunciation values |
| Complete semantic case-level classification | TODO | Link every test/fixture assertion to stable input/mode/expected output/provenance and observed exact-head run; retain duplicate provenance and negative controls |
| Promote any teacher-derived production rule | BLOCKED | Requires compatible IPA conventions, primary-source adjudication, positive/negative controls, Ukrainian target review and independent evaluation |

### Commands / execution evidence

- Updated scripts/build_test_case_register.py and tests/test_build_test_case_register.py through GitHub commits dccb093 and ceda29b.
- Focused extractor behavior: PASS in workflow 40400451180.
- Full exact-head test matrix: pending at last poll; no local clone or local test run was possible because the execution environment could not resolve github.com.
- Do not retrain the scratch teacher just to rebuild the register. Reuse the existing pinned corpus/teacher artifacts and keep teacher disagreements separate from gold labels.

### Next executable actions

1. Poll workflow 40400451180 until inventory generation/upload ends; retain its artifact and record actual counts/hashes.
2. Poll exact-head test workflow 40400451313 and system verification 40400451288; inspect the full logs for the updated head.
3. Reconcile IPA dot/space failures in bounded batches with explicit word-boundary controls; keep unrelated phonological and target-layer failures separate.
4. Continue from the generated inventory artifact to case-level assertion classification. Do not restart inventory generation or neural training unnecessarily.


## Verified inventory generation and full test result — 2026-10-26

### Inventory artifact is now complete

The loss-preserving extraction workflow [40400451180](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40400451180) finished successfully on code/test head ceda29b and uploaded [artifact 12689091191](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40400451180/artifacts/12689091191). ZIP SHA-256: 1b7ebaf1feaeb0139b395388b052c639c43ba0db58a40723f7c60178ad287b3b.

Verified counts: 644 lexical rows; 357 test files; 385 source files; 6,794 lexical-to-test text links; 50,753 Hangul literal candidates; 34,509 exact source lines with per-line hashes; 5,522 assertion/test-declaration candidates; 644 lexical inputs with at least one textual match. This artifact is reproducible and loss-preserving, but remains a candidate inventory rather than a semantically complete case ledger.

### Exact code/test-head verification

Workflow [40400451313](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40400451313) on ceda29b completed with:
- PASS: Python 3.11, Python 3.12, Python 3.13, wheel install, teacher-corpus audit.
- FAIL: browser/web test job.
Workflow [40400451288](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40400451288): Python regression/data integrity PASS; browser regression FAIL; optional NIKL metadata-only inventory skipped by workflow condition.
Browser G2P integration [40400451174](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40400451174) also failed.

The web test log contains **82 failing subtests**. Most observed examples are serialization-contract mismatches: current output uses dots between syllables within one eojeol (for example actual nʌk̚.ɕ͈i), while older assertions still expect spaces (nʌk̚ ɕ͈i). However, not all failures are separator-only: the log also includes incomplete output for mixed numeric/phrase inputs (e.g. “3 연대” returned only “sam” instead of the expected full phrase) and a generic vowel-variant assertion still using the old format. Do not bulk-replace all spaces or call all 82 failures mere formatting. Separate pure renderer-expectation updates from actual tokenization, variant, surface, and target failures.

### Task ledger refresh

| Task | Status | Evidence |
|---|---|---|
| Lossless raw-line register generation | DONE_VERIFIED | Artifact 12689091191; run 40400451180 passed generation and upload |
| Python unit/data tests across 3.11–3.13 | DONE_VERIFIED for code/test head ceda29b | Run 40400451313 |
| Wheel installation | DONE_VERIFIED for code/test head ceda29b | Run 40400451313 |
| Browser suite / public build gate | PARTIAL / FAIL | 82 browser subtests failed; build step skipped after test failure |
| Full semantic case register | PARTIAL | Candidate inventory exists; assertion classification, exact observed-result joins, and duplicate provenance reconciliation remain |
| Neural-teacher-to-production-rule promotion | BLOCKED | IPA conventions and independent source/target adjudication remain unresolved |

The current PR head includes later documentation-only commits after ceda29b; the above executable verification is explicitly for ceda29b. Exact-head checks for the later documentation head must be confirmed separately. PR #339 remains draft and must not be merged while the browser gate is failing.


## Artifact integrity cross-check and PR merge-ref provenance — 2026-10-26

The extraction workflow was triggered by PR head ceda29b, but GitHub Actions checked out the PR merge ref at commit [ff01dd5fbfa35008c1ca24adc652ac1ee5a84310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/ff01dd5fbfa35008c1ca24adc652ac1ee5a84310), which merges ceda29b into main a452054a669de28426404d1110731715083423bb. The artifact's embedded extraction report correctly records ff01dd5 as the checked-out commit. Distinguish the PR head SHA from the tested merge-ref SHA in future evidence records.

After downloading artifact 12689091191, an independent local cross-check of the generated CSVs verified:
- all 34,509 source-line keys (path + line number) are unique;
- all 50,753 Hangul candidate rows' raw_line values exactly match their corresponding source-line row;
- all 6,794 lexical-link raw_test_line values exactly match their corresponding source-line row;
- zero raw-line mismatches in either derived inventory.

This verifies exact line-level provenance for those two derived inventories. It does not establish that each row is a distinct test case or that each lexical occurrence is semantically asserted. The local cross-check was performed against the downloaded CI artifact; repository clone and full local suite execution remain unavailable due to the GitHub DNS failure in the local environment.


## Browser failure case ledger and assertion-candidate precision — 2026-10-26

### Observed failure ledger

Parsed the complete TAP log for browser test run [40400451313](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40400451313), job 121844594361, preserving one row per failing subtest's first observed assertion. The CSV is [research/BROWSER-FAILURE-REGISTER-2026-10-26.csv](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/blob/research/strict-teacher-guided-rule-mining-2026-10-26/research/BROWSER-FAILURE-REGISTER-2026-10-26.csv), committed in [29349940519d47345a2859b1050ba9a884e900f0](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/29349940519d47345a2859b1050ba9a884e900f0).

- 82 observed failing subtests have exact test title, source file, callback and assertion line/column, actual/expected values where present, run/job IDs, PR head SHA and checked-out merge SHA.
- 77 are **POSSIBLE_IPA_SEPARATOR_EXPECTATION** only by a mechanical check that replacing output dots with spaces makes the expected string. This is a triage hypothesis, not proof that every expected value should be rewritten.
- 4 are **OUTPUT_MISMATCH_REQUIRES_CASE_REVIEW**, including truncated outputs for “몇 리”, mixed-script numeric input, “밭 아래”, and “3 연대”.
- 1 is **VARIANT_EXPECTATION_OR_BOUNDARY_FAILURE** for a generic ㅢ alternative assertion.
- The tested PR head was ceda29b; GitHub Actions checked out merge commit ff01dd5 into main a452054. Keep those two SHAs distinct.

### Assertion candidate detector hardening

The original assertion-candidate regex also treated import lines such as “import assert from ...” as assertion candidates. The detector is now anchored to the start of a source line and records a specific assertion/declaration kind; regression tests assert that import lines are excluded while actual test declarations and assert.equal lines remain. Code commit [e13df2132e8301e6946f541ef4cdaa95534937b4](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/e13df2132e8301e6946f541ef4cdaa95534937b4), test commit [7aea60fc1cb1c4bfe7717044b9d0c8a0481fb328](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/7aea60fc1cb1c4bfe7717044b9d0c8a0481fb328). The exact-head extraction/test workflows for this detector change were queued at the last poll; the exact-head artifact is now regenerated: 5,241 assertion/test-declaration candidates on 359 test files and 387 source files. The earlier 5,522 count is superseded because the stricter detector excludes non-assertion imports/declarations; the count remains a candidate-line inventory, not a semantically complete case count.

### Next bounded batch

1. Confirm the updated extractor regression and regenerate the five inventories on the latest PR head; record the new counts and file hashes from the embedded report.
2. Use the 82-row failure ledger to split the 77 possible separator cases from the five non-separator cases. Fix/normalize only assertions confirmed to conflict with the declared eojeol renderer contract; investigate the five remaining cases against their exact source inputs and stack locations.
3. Continue semantic case extraction after preserving the original raw assertions and per-test provenance. No production rule promotion is justified by this browser failure ledger.


### Continuation — fail-closed source scanning for the case register (2026-10-26)

- **Change:** `scripts/build_test_case_register.py` previously skipped files on `UnicodeDecodeError` or `OSError`. That could silently undercount source files and make an incomplete evidence inventory look like a successful scan. The extractor now raises a path-bearing `RuntimeError` and stops, so the operator must resolve the file or explicitly change the inventory scope.
- **Regression coverage:** `tests/test_build_test_case_register.py` now includes a genuinely invalid UTF-8 source fixture and verifies that each preserved line's SHA-256 matches the exact UTF-8 bytes of `raw_line`.
- **Integration:** PR [#342](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/342) was squash-merged into `research/strict-teacher-guided-rule-mining-2026-10-26` as `ce6f96927695eaed10cdbe3e848bfa1b5bea6c09`. It deliberately targeted the active research branch rather than `main`, avoiding replay of that branch's existing 557-commit delta. The temporary fix branch remains available as review history.
- **Verification:** local `git clone` and test execution are blocked by container DNS resolution (`Could not resolve host: github.com`). The focused GitHub Actions workflow has not yet been confirmed for this exact head; do not mark the change `DONE_VERIFIED` until the PR workflow passes.
- **Scope boundary:** no pronunciation rules, corpus labels, IPA mappings, or Ukrainian outputs changed. The independent IPA and Ukrainian-target reviews, complete case-level extraction, and release blockers remain unchanged.


### Verification update — fail-closed register extractor (2026-10-26)

- **Focused workflow PASS:** [run 40406510664](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40406510664), exact code head `63959896008b0a32ed43975a7ee7b33406fb9576`. The extractor unit-test step passed, the full five-inventory generation and stable-ID checks passed, and artifact [12691277687](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40406510664/artifacts/12691277687) was uploaded (3,082,014 bytes; SHA-256 `f344d8ce01693885ba59dbc141228f40e9eb6bbb73bb2a96d73cc22578a38c09`).
- **Python regression PASS:** in [system verification run 40406510656](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40406510656), the Python regression/data-integrity job passed.
- **Unrelated broad gate remains red:** browser regression/build failed in run `40406510656`; the same browser job also failed on base branch head `7e12aaa620cd5feb683f7ff8a6aeb752180430f3` in run `40405224724`. The log download endpoint returned `BlobNotFound`, so the exact failing assertion is not independently confirmed here. Treat this as a pre-existing branch-level blocker with matching failure signature, not as a proven effect of the Python-only change.
- **Status:** `DONE_VERIFIED` for the fail-closed extractor behavior and inventory-generation workflow on code head `63959896008b0a32ed43975a7ee7b33406fb9576`; PR #342 was squash-merged as `ce6f96927695eaed10cdbe3e848bfa1b5bea6c09`. The broader browser job remained failed on both the PR head and its base branch; merge was limited to the isolated Python register change after the focused gate passed. This is not a green full-system verification. The repository's pronunciation and Ukrainian-target research blockers are unchanged.


### Continuation — browser IPA regression-oracle reconciliation (2026-10-26)

- **Outcome:** `DONE_VERIFIED` for the browser IPA regression-oracle repair. PR [#343](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/343) was squash-merged into `research/strict-teacher-guided-rule-mining-2026-10-26` as `19832224daab7d17b56df75485bb5461ea3c9ef9`.
- **Root cause:** the browser engine's documented output serialization uses `.` between syllables within one source word and spaces between source words. Some regression fixtures still used the older space-separated representation, and `tests/nikl-articles-8-23-gap-closure.test.mjs` had a duplicate `renderExpectedIpa` import. This was test-oracle/fixture drift; no production pronunciation rule was changed.
- **Fix:** the existing test-only `renderExpectedIpa(input, oracle)` helper now normalizes independent expected IPA using source eojeol boundaries. Direct serialization expectations were corrected, the duplicate import/binding was removed, and the long-passage local renderer now receives an IPA token array.
- **Verification PASS:** exact-head [system verification run 40408709236](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709236) completed `Browser regression tests and build` and `Python regression and data integrity` successfully. [Register extraction run 40408709171](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709171) completed inventory generation and artifact upload successfully. The official NIKL source inventory remains metadata-only/skipped in the system workflow; it is not claimed as verified.
- **Related integrity fix:** PR [#342](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/342) was squash-merged as `ce6f96927695eaed10cdbe3e848bfa1b5bea6c09`; the register generator now fails closed on unreadable candidate files instead of silently undercounting the source inventory. Its focused workflow and Python regression checks passed.
- **Remaining blockers:** the local clone remains unavailable because this environment cannot resolve `github.com`; exact-head CI supplied verification. These test/tooling fixes do not complete the semantic case-level ledger, independent IPA convention arbitration, Ukrainian target adaptation review, or licensed-source rights review. Overall repository remains a research-ready partial prototype, not release-ready.


### Exact-head inventory after assertion-candidate detector hardening — 2026-10-26

- **Merged branch result:** `19832224daab7d17b56df75485bb5461ea3c9ef9`. The extraction workflow checked out synthetic PR merge ref `456f764390441bab7a02d55c1020144ffb57c015` (PR #343 head `4019e233c2a07cbb2d4679ad85fd77a56a307af4` merged into base `a751e9b6657bc3958d4feb3e692de42c81aa1c82`); distinguish that CI merge ref from the final post-merge branch commit.
- **Extraction PASS:** [run 40408709171](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709171), artifact [12691822644](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709171/artifacts/12691822644), ZIP SHA-256 `28271fcbf18402e8046399721e6c6be1db42d4998e94d6f2dee7c9ca9d0b223e`.
- **Current inventory:** 644 lexical records; 359 test files scanned; 387 source files scanned; 6,801 lexical-to-test text links; 34,573 exact source lines preserved; 5,241 assertion/test-declaration candidates; 644 lexical inputs with at least one text match.
- **Interpretation:** the previous 5,522 assertion-candidate count is superseded by the stricter line-anchored detector. Text links and assertion candidates remain discovery inventories, not proof that every lexical input has a test assertion or that each assertion has been semantically classified.
- **Next acceptance gate:** build a case-level register that links exact source/input × mode × expected assertion to observed result from a matching run/commit, while preserving duplicate test provenance and keeping expected IPA distinct from observed IPA. Do not promote production pronunciation rules from candidate lines alone.


## Current PR #339 merge-ref CI reconciliation — 2026-10-27

**Identity matters:** research branch head before this acceptance-doc-only commit was `256b27a454c992218ca87a0fdf58ea6135071560`; PR #339's Actions checked out synthetic merge ref commit `348a3dc18764191f68339333ce24bc0f54e2c523` (merge of that head into default `main` `a452054a669de28426404d1110731715083423bb`). Subsequent continuation commits update the handoff, case register, and acceptance gates only; they do not change the runtime/test code represented by this merge-ref run.

### Exact outcomes observed on merge ref 348a3dc

- **PASS** tests matrix [40410859903](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859903): Python 3.11, 3.12, 3.13, wheel-install, web, and teacher-corpus audit all passed.
- **PASS** system verification [40410859949](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859949): browser regression/build and Python regression/data integrity passed. Official NIKL source inventory was skipped in metadata-only mode, not passed.
- **PASS** browser G2P integration [40410859840](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859840).
- **PASS** exhaustive case-register extraction [40410859892](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859892), artifact [12693590917](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859892/artifacts/12693590917), ZIP SHA-256 `c8e90fe5bd121fa31073d087faa6787cf2136c4fa4e6e71962ba63c6b2b4a34e`. Counts remain 644 lexical records, 359 test files, 387 source files, 6,801 text links, 34,573 preserved lines, 5,241 assertion candidates.
- **PASS** browser external integration [40410859840](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859840); paired native-vs-g2pk [40410859885](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859885); pinned UGTPHON diagnostic [40410859897](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859897); morphology consensus [40410860218](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860218); morphology adapter smoke [40410859942](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859942); optional g2pK integration [40410859938](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859938); teacher-corpus split audit [40410860054](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860054); scratch-teacher training [40410859771](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859771). All reported jobs in those runs passed.
- **PASS** pinned multi-engine IPA comparison [40410860080](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860080).
- **PASS — Charsiu train/dev comparisons:** [run 40410860096](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860096), artifact [12692089349](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860096/artifacts/12692089349), ZIP SHA-256 `62094ba4ee003e18a30a3ddbde1c8cafbf158c5cf0c14fd72c95f7e27d188ff0`. On SIGMORPHON dev (1,000 forms), Charsiu scored 676/1,000 exact (67.60%), CER 5.6465%; native broad profile scored 331/994 exact (33.30%), CER 15.3967%, with 6 native abstentions. On UGTPHON dev (1,834 Hangul-eligible occurrences), Charsiu scored 1,670/1,834 exact (91.06%), CER 2.3502%; native broad profile scored 977/1,800 exact (54.28%), CER 9.5802%, with 34 native abstentions. A controlled narrow partial-sibilant profile changes native scores to 431/994 (43.36%), CER 11.2901% on SIGMORPHON and 1,193/1,800 (66.28%), CER 6.3537% on UGTPHON. These are source-convention-specific dev diagnostics, not broad-IPA truth or proof of independent checkpoint training exposure. The report explicitly marks target compatibility unreviewed and every case as ineligible for production-rule promotion.

### Current disposition

The isolated browser/test-oracle repair and register extraction are verified; the PR merge-ref core software gates are green. The research branch currently compares as 580 commits ahead of `main` and 0 behind (`main` base `a452054a669de28426404d1110731715083423bb`); PR #339 remains open/Draft. Do not merge the full research branch solely because the currently completed jobs passed. Scientific release blockers remain independent IPA convention adjudication, independent Ukrainian target validation, source/license review, and a complete semantic case-level register.


## Verified assertion-classification queue — 2026-10-27

**Implementation and focused acceptance:** PR [#344](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/344) was squash-merged into the research branch as `e324ffe699ad4a234c39cace330a8ecd4a84259e`. The branch now contains `scripts/classify_test_case_candidates.py`, its unit tests, and the extraction-workflow integration.

- **PASS — focused queue and inventory generation:** [workflow 40464392516](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40464392516), artifact [12715418796](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40464392516/artifacts/12715418796), ZIP size 3,312,373 bytes; expires 2026-11-26.
- **PASS — full system verification:** [run 40464392495](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40464392495): browser regression/build and Python regression/data integrity passed. The official NIKL source inventory was skipped by metadata-only workflow policy.
- **PASS — Python/browser system verification and research corpus artifact workflow:** [run 40464374294](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40464374294) and [run 40464374206](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40464374206) passed on the same code head.
- **Exact generated counts:** 644 lexical records; 360 test files; 388 source files; 6,801 lexical-to-test text links; 50,768 Hangul-literal candidates; 34,661 source lines preserved; 5,261 assertion/test-declaration candidates; 5,261 rows in the new classification queue.
- **Queue artifact hash:** `599a5c22659c9bfe1492276241963db6debf605f86195f4ebabf47cf54424e36` (SHA-256 of the queue CSV). The extraction workflow validates non-empty unique IDs for all six CSV inventories.

### Scope and limitations

The new queue's regex labels are triage hints only. Every row remains `UNCLASSIFIED_REQUIRES_CASE_LEVEL_REVIEW`; expected values are not parsed and observed results remain `NOT_TIED_TO_EXACT_HEAD_RUN`. This improves work ordering and stable provenance but **does not** complete the semantic case register or verify any IPA/Ukrainian gold. The register remains `PARTIAL INVENTORY`.

### Next executable work

1. Extend the queue into case-level rows with exact input, test title/path/line, mode, expected assertion, negative-control role, and provenance while retaining duplicate test provenance.
2. Join observed actual outputs and pass/fail only from artifacts/logs tied to a specific commit and run; keep expected-only cases separate.
3. Continue independent IPA convention and Ukrainian-target adjudication. Do not promote neural-teacher candidates to production rules until the evidence gates in this handoff are met.


## Verified test-context enrichment for assertion queue — 2026-10-27

PR [#345](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/345) was squash-merged into the research branch as `f319c3b343da4c362e8e9c531604736ee3d39178`. Its Git tree `1c736eb07aea1a0300c2263d1762fc1fc755c1b7` is identical to tested PR head `8a0506e032fdd80cb624177b3a77a94c0fef2edd`, so the verification evidence covers the merged file state.

- **PASS — inventory extraction + queue context:** [workflow 40464794197](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40464794197), artifact [12716545824](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40464794197/artifacts/12716545824), 3,345,787 bytes; expires 2026-11-26. All six CSV inventories passed non-empty stable-ID and uniqueness checks.
- **PASS — system verification:** [workflow 40464794240](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40464794240): Python regression/data integrity, browser regression/build and generated-page verification passed. Official NIKL source inventory was skipped in metadata-only mode.
- **Exact counts:** 644 lexical records; 360 test files; 388 source files; 6,801 lexical-to-test text links; 50,768 Hangul-literal candidates; 34,688 preserved source lines; 5,270 assertion/test-declaration candidates; 5,270 queue rows.
- **Queue CSV SHA-256:** `f797d5296f9073cbe8fecf4cfdc61d8959798a04384d8f054b8924b256833f4b`.
- **Context fields added:** nearest preceding JS `test`/`it` and `describe`/`suite` declarations, plus Python `def test_*` and `class Test*` where recognized. The raw declaration and source line are retained. This is explicitly heuristic context: a nearest-preceding declaration may cross a closed scope, so reviewers must confirm the association.

All queue rows still remain `UNCLASSIFIED_REQUIRES_CASE_LEVEL_REVIEW`; expected values are not parsed and actual outcomes are not inferred. This reduces manual navigation cost but does not complete the semantic register or any linguistic adjudication gate. The project remains a research-ready partial prototype, not release-ready.


## Verified raw-assertion literal extraction — 2026-10-27

PR [#346](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/346) was squash-merged as `93736d0e6d6f826c4b502541a99bb44158afef53`. The merged Git tree `792a173c0d0533d2c656bf6564e4a3b19361b565` exactly matches tested head `44a4e9a10e66520345107d9fabb53908d504676c`.

- **PASS — focused extraction and literal parser tests:** [workflow 40465361133](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40465361133), artifact [12716302090](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40465361133/artifacts/12716302090), 3,367,183 bytes; expires 2026-11-26.
- **PASS — full system verification:** [workflow 40465361074](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40465361074): Python regression/data integrity, browser regression/build and generated-page checks passed. Official NIKL source inventory was skipped in metadata-only mode.
- **Current generated counts:** 644 lexical records; 360 test files; 388 source files; 6,801 lexical-to-test text links; 50,768 Hangul-literal candidates; 34,711 exact source lines; 5,286 assertion/test-declaration candidates; 5,286 queue rows.
- **Queue CSV SHA-256:** `09c26a7ebd856619fe9941702f2e12e968e717afe8dc5fba27f5f470a0df39e9` (24 columns).

### Raw expectation extraction contract

The queue now copies a simple, explicitly present assertion subject and expected lexeme when the one-line call shape is recognized. String/scalar literals are labeled `RAW_LITERAL_EXTRACTED_NOT_ADJUDICATED`; regexes are labeled `RAW_REGEX_EXTRACTED_NOT_ADJUDICATED`; computed expressions are labeled `EXPECTED_EXPRESSION_NOT_EVALUATED`; predicate-only assertions and unsupported forms remain explicit. The parser preserves the raw lexeme—it does not decode escapes, normalize IPA, evaluate code, infer actual output, or adjudicate correctness.

Every row remains `UNCLASSIFIED_REQUIRES_CASE_LEVEL_REVIEW` and `NOT_TIED_TO_EXACT_HEAD_RUN`. This is a better evidence queue, not a completed semantic register. The next acceptance task is to resolve loop-variable fixtures and multi-line assertions into exact case inputs/modes without losing provenance, then attach actual outcomes only from matching CI logs/artifacts. Linguistic release blockers remain unchanged.


## Assertion-queue coverage report verified — 2026-10-27

PR [#347](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/347) was squash-merged as `34cd98992dbbf3f1abfd63006a66c4e03cd5f2a5`. It adds explicit coverage counts and CI assertions that the queue cannot auto-verify cases or invent observed outcomes.

- **PASS — extraction + artifact report:** [workflow 40465942564](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40465942564), artifact [12716247798](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40465942564/artifacts/12716247798), 3,367,720 bytes; expires 2026-11-26.
- **PASS — system verification:** [workflow 40465937572](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40465937572): Python regression/data integrity and browser regression/build passed. Official NIKL source inventory was skipped by metadata-only policy.
- **PASS — research corpus artifact workflow:** [workflow 40465937576](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40465937576).

### Current measured triage coverage (5286 rows, 24 columns)

- 4,257 assertion candidates; 1,029 test-declaration candidates.
- 1,553 raw literal/regex fragments copied without evaluation: 1,004 string/scalar literals and 549 regex literals.
- 1,045 expected expressions explicitly left unevaluated; 336 predicate-only assertions; 1,323 unsupported assertion forms; 1,029 non-assertion declarations.
- 2,598 rows have a non-empty expected-expression fragment (includes raw literals, regexes and unevaluated expressions).
- Dimension hints are multi-label, not mutually exclusive: IPA 590; Ukrainian target 482; Korean surface 280; rule trace 331; status/abstention 804; boundary/serialization 442; source provenance 500; variants 211; general assertion 1,848; unclassified 580.
- Queue CSV SHA-256 remains `09c26a7ebd856619fe9941702f2e12e968e717afe8dc5fba27f5f470a0df39e9`; the workflow report separately records the report/artifact metadata.

These are parser coverage counts, not case coverage or linguistic accuracy. All rows remain `UNCLASSIFIED_REQUIRES_CASE_LEVEL_REVIEW`; no expected value is adjudicated and no observed result is inferred. The semantic register remains partial. Next work must resolve fixtures/loop bindings and multiline assertions into exact inputs and modes, then join outcomes only to matching commit-specific test logs. Independent IPA and Ukrainian target adjudication remain separate acceptance gates.


## Final one-pass reconciliation — 2026-10-27

### Branch and commit state

- Default branch `main` remains at starting reference `a452054a669de28426404d1110731715083423bb` for this continuation; no release or mainline merge was performed.
- The continuation started from the existing research line around `823cfa48ae93643decc1f853763dacfcaac9eb25` because the canonical case-register generator and evidence documents exist on that research branch but are absent from `main`. The focused changes were isolated in feature branches/PRs and merged back into that research line to avoid duplicating the existing generator.
- PRs #342, #343, #344, #345, #346 and #347 are integrated into the research branch. The latest queue/report implementation commit is `34cd98992dbbf3f1abfd63006a66c4e03cd5f2a5`; later commits update the master register, audit and handoff only. The last audit-only commit before this handoff refresh was `9f1d94cb44ca0666c09efdc41e1ba70eacc92dd7`.
- Open draft PR [#339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/339) still targets `main`. Do not merge it wholesale while the independent IPA, Ukrainian-target, licensing and complete-case-register gates remain open.

### Verification boundary

- **PASS on executable code/workflow head:** queue extraction + coverage report [40465942564](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40465942564), artifact [12716247798](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40465942564/artifacts/12716247798); system verification [40465937572](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40465937572); corpus artifact workflow [40465937576](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40465937576). The NIKL live inventory was skipped by policy, not passed.
- The latest handoff/audit edits are documentation-only. Current docs-head workflows were queued at commit `0e5835eb69c2f9c3c1028ea85555e9d22c935f7b`; later documentation commits may trigger another run. Do not claim those queued runs passed. Runtime/tests are unchanged from the verified code/workflow head above.
- Local clone and local tests remain unavailable: `git clone` could not resolve `github.com`. No local pass is claimed.

### Final task ledger

- **DONE_VERIFIED:** test-only dotted-IPA expectation reconciliation; deterministic assertion queue; nearest test/suite context hints; raw literal/regex extraction; queue coverage report and fail-closed status checks. All four new queue/coverage stages passed their focused GitHub Actions and system/browser/Python checks.
- **PARTIAL:** semantic case-level register. Current queue: 5,286 rows; 4,257 assertion candidates and 1,029 test declarations. Raw literals/regexes are preserved, but expected expressions are not evaluated and no row has a commit-specific observed result.
- **TODO:** bind loop-driven fixtures and multiline assertions to exact input/mode/test IDs; extract expected values for supported structures; join actual outcomes only from exact commit/run logs; validate generated queue coverage against all executable test cases.
- **BLOCKED / EVIDENCE-LIMITED:** independent IPA annotation/adjudication and separate Ukrainian target review require qualified reviewers and a documented adjudication protocol. Official live NIKL source inventory remains skipped by metadata-only workflow policy; do not substitute the local snapshot for rights or provenance approval.
- **DEFERRED:** teacher model invocation/training and any runtime rule promotion. Current teacher/model-license and dataset-overlap limitations remain as documented; this continuation changed no production pronunciation rules, did not add model weights, and did not change external settings.

**Readiness decision:** research-ready partial prototype, not release-ready. The next real acceptance milestone is a source-linked case-level register with exact inputs/modes, raw expected evidence, actual results tied to exact runs, followed by independent IPA and Ukrainian-target adjudication. No neural-model hypothesis is promoted to production by this continuation.


## Neural teacher portfolio for reusable rule-mining evidence (2026-10-27)

- Added `.github/workflows/train-korean-g2p-teacher-portfolio.yml` on branch `research/strict-teacher-guided-rule-mining-2026-10-26`.
- Reuses the existing pinned SIGMORPHON train/dev corpus builder and existing scratch-trained bidirectional-GRU + dot-attention-GRU model; does not duplicate the corpus pipeline and does not change production pronunciation rules.
- Trains three independently seeded instances (20261026, 20261027, 20261028) with identical architecture and hyperparameters. This is a seed-stability portfolio, **not yet an architecture comparison**.
- Each run retains the selected checkpoint weights, complete per-epoch training history, model/data config, checkpoint and prediction SHA-256 hashes, dev predictions, structured dev error analysis, teacher-vs-Strict aligned pairs, and pair summary. A deterministic portfolio index ranks seeds by dev token error rate, then exact match, then seed.
- The artifact includes the pinned corpus manifest and train/dev JSONL so the experiment can be reproduced. Workflow artifact retention is set to 90 days (GitHub Actions artifact retention, not permanent archival).
- The test split is never exported, loaded, scored, or used for model selection in this workflow. Dev rankings are research triage only and must not be reported as held-out benchmark results. Target strings remain SIGMORPHON-tokenized IPA; comparison with ClippyFirst broad IPA computes no accuracy until the reviewed representation mapping exists.
- **Status: PARTIAL / CI pending** at commit `2a435c8574c924124e840bb83df5b2cdee2b9a0a`. The workflow has been committed to the existing research PR branch; no training run or artifact is claimed until Actions completes.
- Next acceptance steps: verify exact-head tests and portfolio workflow; inspect all three reports and artifact hashes; then add a genuinely different compact architecture only if the seed portfolio is stable and resource cost remains reasonable. After source-convention mapping and split-overlap audit, evaluate the selected checkpoint once on a permitted held-out benchmark and feed disagreement cases into the existing train-only rule-candidate miner. Promote no rule without primary-source adjudication, positive/negative controls, and regression tests.


### Baseline rerun alongside portfolio (2026-10-27)

- The existing single-seed scratch-teacher workflow passed on code commit `2a435c8574c924124e840bb83df5b2cdee2b9a0a`: [run 40470223666](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470223666), artifact [12718580694](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470223666/artifacts/12718580694), 1.81 MB, currently available until 2026-11-10.
- Reproduced dev result: 602/1,000 exact (60.2%), token error rate 12.7169%, compact-character error rate 12.1814%, best epoch 11; checkpoint SHA-256 `4062bff4941fefe1b499a29163471e17d3e7eff2af690456d16f1fd93cc70a45`.
- Dev error analysis: 107 length-mark-only mismatches (80 underpredictions, 27 overpredictions) and 291 other token/feature mismatches. This is source-tokenized SIGMORPHON IPA, dev-selected, and not comparable directly to the native broad-IPA UGTPHON score.
- Portfolio workflow [run 40470223568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470223568) has passed its data/metric tests and pinned train/dev corpus preparation; the three-seed training step was still running at the time of this update. No portfolio ranking or 90-day artifact is claimed until that run completes.


### Seed-portfolio run completed (2026-10-27)

- Portfolio workflow [40470223568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470223568) **PASS** on executable/workflow commit `2a435c8574c924124e840bb83df5b2cdee2b9a0a`; artifact [12717644093](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470223568/artifacts/12717644093), 5,641,578 bytes, SHA-256 of artifact ZIP `f5c77a85e92238fcbe13729b1c2a78c1277e933e5f2d982457e79d13d2dc2fef`, retained until 2027-01-25.
- All three independent training runs, error analyses, same-input teacher/Strict pairing, checkpoint hashes, and deterministic portfolio index completed and were uploaded.
- Dev-only ranking by token error rate: seed 20261028 — exact 584/1,000 (58.4%), token error rate 12.3246%, compact-character error rate 11.4352%; seed 20261026 — 602/1,000 exact (60.2%), token error rate 12.7169%, compact-character error rate 12.1814%; seed 20261027 — 592/1,000 exact (59.2%), token error rate 13.1091%, compact-character error rate 11.9876%.
- Interpretation: there is seed variance and metric trade-off. Seed 20261028 ranks first on the predeclared token-error selection metric, while seed 20261026 has the highest exact-match rate. Do not cherry-pick metrics; retain all three checkpoints and reports. This is a dev-set comparison within one architecture, not an independent held-out score or a comparison against native broad-IPA benchmark numbers.
- The latest documentation-only branch head `e2de1ce10c59f2acd7d227d71cba6d08d00e7af5` has a second exact-head portfolio run queued as [40470498594](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470498594); verify it before marking the latest head `DONE_VERIFIED`.
- Long-term preservation limitation: GitHub Actions artifact retention is 90 days, not permanent. The artifact contains model weights, all per-seed reports/predictions/analyses, and train/dev corpus files plus manifest; keep the checksums and consider a versioned archival release/DOI only after license and data-rights review. Do not commit binary weights or publish an archive automatically.


### Neural-teacher vs native Strict disagreement audit (2026-10-27)

- Added [`docs/NEURAL-TEACHER-STRICT-DISAGREEMENT-AUDIT-2026-10-27.md`](NEURAL-TEACHER-STRICT-DISAGREEMENT-AUDIT-2026-10-27.md) based on the saved three-seed portfolio artifact [12717644093](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470223568/artifacts/12717644093), not on guessed outputs.
- Across 1,000 SIGMORPHON dev examples, the seeds are correct together on 455, wrong together on 275, and have mixed correctness on 270; pairwise exact prediction agreement is 59.6–63.3%. This is evidence of model variance, not rule truth.
- Length-mark-only mismatches account for 107–116 examples per seed; underprediction is more frequent than overprediction. This is a target-convention diagnostic and **must not be interpreted as a ClippyFirst runtime bug** until the broad-IPA contract and a reviewed adapter establish that length is in scope.
- The paired native Strict run includes 994 inputs and excludes six as diagnostic-only/unresolved. Five involve R002 morpheme-boundary/licensing uncertainty (가없이, 늙은이, 말없이, 붉은기, 수없이); one involves R003 ㅎ-coda deletion licensing (많아지다). These are confirmed coverage/abstention cases, not confirmed wrong pronunciations.
- Strict-vs-teacher accuracy remains **BLOCKED** because SIGMORPHON tokenized roughly-phonemic IPA has not been mapped by an independently reviewed adapter to ClippyFirst broad IPA. No cross-convention score is reported and no production rule was changed.
- Next acceptance gate: review IPA conventions and adapter; adjudicate the six morphology cases with source-backed positive/negative tests; triage teacher disagreements; promote only candidates with authoritative rule environment, reviewed IPA, counterexamples, and regression/parity evidence. Keep all dev-derived findings marked as development evidence; do not select rules on sealed test data.
- Evidence status: the audit is a reproducible diagnostic summary of the artifact; source-shape associations are descriptive only. The test split was not loaded or exported by the training workflow. The artifact remains subject to the recorded 90-day retention and licensing/archival limitation.


### Exact-head workflow reconciliation for disagreement audit (2026-10-27)

- Portfolio rerun [40470604816](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470604816) **PASS**: metric/data guards, pinned corpus prep, all three seeds, analyses/pairing, index, and artifact upload. Artifact [12718129194](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470604816/artifacts/12718129194), 5,641,578 bytes, SHA-256 `fd41b831eec6d19a6a5391bb089350b1254f96856b84ed305dd30ad9f5e6e1f4`, expires 2027-01-25. The three reported metrics match the previously inspected portfolio; the latest artifact index records the workflow's own commit identifier.
- System verification [40470604820](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470604820) **PASS** for browser regression/build and Python regression/data integrity; official NIKL inventory was skipped by workflow policy (metadata-only gate).
- General tests [40470604731](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470604731) **PASS** for wheel-install, web, teacher-corpus audit, and Python 3.11/3.12/3.13; exhaustive register extraction [40470604714](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470604714) **PASS**; teacher corpus split audit [40470604739](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470604739) **PASS**.
- These runs verify branch head `390833453758a5d0eb4b956dfabfe41187e10dc7` before the current report/handoff-only commits. The new changes are documentation only; no runtime or test code changed afterward. Therefore the linguistic comparison remains PARTIAL due to the explicitly documented IPA-convention gate, not due to a failed CI check.


### Seed-consensus disagreement triage and raw IPA inventory (2026-10-27)

- Added `scripts/summarize_korean_teacher_strict_disagreements.py` and `tests/test_summarize_korean_teacher_strict_disagreements.py`. The script preserves all three seeds' predictions, teacher reference tokens, native Strict broad IPA, consensus correctness category, and six non-paired cases. It rejects non-dev rows and intentionally does not score across incompatible IPA conventions.
- Integrated the case-level triage into `.github/workflows/train-korean-g2p-teacher-portfolio.yml`; expected artifact output is `seed-consensus-disagreement-triage.json`. Exact workflow rerun [40472610993](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40472610993) was queued when recorded; do not mark the new script/workflow step verified until it completes successfully.
- Deepened `docs/NEURAL-TEACHER-STRICT-DISAGREEMENT-AUDIT-2026-10-27.md` with a raw character inventory over the 455 forms that all three seeds match to the dev reference. Frequent differences include vowel retraction/lowering/rounding diacritics, affricate tie bars, `ɭ` vs `l`, `ɦ` vs `h`, and target-side length marks. These are counts of Unicode character occurrences, not case-level error rates.
- Example triage: `가까이` shows a seed-specific extra `k͈` in one teacher prediction while other seeds match the reference and Strict's broad form is compatible after accounting for separators/vowel notation; this is a teacher instability example, not a Strict bug. `가솔린` illustrates target convention differences (`sʰ`, `ɭ`) versus the engine's explicitly broad `s`, `l` choices.
- Engineering consequence: no “317 Strict errors” or cross-system accuracy is asserted. The reviewed adapter remains the blocking gate; stripping all IPA diacritics would be unsafe. Candidate correspondence mappings need explicit per-feature scope and reviewed cases before any score or rule change.
- Branch changes include the script, tests, workflow integration, and updated audit; the latest documentation commit at this note is `29dd3766a2f7b2ca35280811870959417f0b097b`. Runtime pronunciation rules remain unchanged.


### Current implementation blocker — exact-form morphology candidates (2026-10-27)

- Research review identified transparent candidate environments for R002 at `없>이` in `가없이`, `말없이`, `수없이`, and `늙>은` in `늙은이`, plus R003 `많>아` in `많아지다`. The source rules already referenced by the engine cover liaison before formal morphemes (NIKL §§13–14) and ㅎ-deletion before vowel-initial endings/suffixes (NIKL §12(4)); these are exact-form applications, not a productive morphology heuristic.
- A Python exact-form inventory change and focused positive/negative tests were authored, but the corresponding edit to `src/app/engine_shared.js` was blocked by the connected GitHub write tool's safety layer, and a restore attempt for the Python file was also blocked. Therefore **Python/browser license parity is currently unresolved and this branch must not be merged**. Do not mark these candidate runtime changes `DONE_VERIFIED`; they are `PARTIAL/BLOCKED` until the browser map is mirrored or the Python edit is safely reverted and all tests pass.
- `붉은기` intentionally remains unlicensed because its exact lexical/morphological status is not sufficiently established by the evidence reviewed here. It must continue to abstain. Do not add it based on the teacher output alone.
- The added consensus-triage script and tests are research-only and preserve raw IPA. Portfolio workflow [40472610993](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40472610993) was still running at this note; general tests [40472610978](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40472610978) had Python 3.11/3.12 and corpus-audit jobs pass, while wheel/web/Python 3.13 remained queued. These runs were triggered before the latest Python license change and are not exact-head verification for it.
- Immediate acceptance gate: resolve the blocked source-file write through an approved repository-edit path; run `tests/test_rules.py`, `tests/test_rule_license_parity.py`, full Python 3.11–3.13, browser/build/wheel tests, and system verification on the same final code head. If parity cannot be restored, do not merge and keep the pronunciation engine's prior validated behavior as the target.




### 2026-10-27 continuation — exact-form browser parity restored; acceptance pending

- Corrected the earlier blocker note: commit `2f61d079d060159e6b1a6334a6c9f213069cc1dd` safely mirrored the five exact-form Korean licenses from Python into `src/app/engine_shared.js`: R002 (`가없이`, `말없이`, `수없이`, `늙은이`) and R003 (`많아지다`). The entries remain closed-form licenses, not productive substring heuristics.
- Existing focused tests in `tests/test_rules.py` assert those four R002 cases, preserve `붉은기` as unresolved, assert the R003 case `많아지다`, and preserve `많아보이다` as a negative control. Browser parity is now implemented in code but not yet `DONE_VERIFIED` until the browser and Python suites pass on the exact latest head.
- The current audit was updated in place: `docs/NEURAL-TEACHER-STRICT-DISAGREEMENT-AUDIT-2026-10-27.md`, latest audit commit `96da861315cde71b2ed8c017b4ce87fa42f2d3fa` (which also corrects the stale claim that the earlier portfolio was reproducible). It explicitly supersedes the older note that the browser edit was blocked.
- CI status from the last poll before the mirror commit: reproducible portfolio run `40473686808`, general tests `40473686766`, and system verification `40473686608` were still queued (optional NIKL metadata-only job skipped). They were triggered before the browser parity edit and are not exact-head evidence. Fresh workflows for the new head must be polled and, if necessary, rerun.
- The earlier reproducibility defect remains an acceptance blocker: nominally same seed/config/data produced differing checkpoint/prediction hashes and metrics across portfolio runs. The new workflow pins Python/PyTorch, sets one intra-op and inter-op thread, records environment/hyperparameters, and repeats seed `20261026` while requiring identical checkpoint, predictions, and metrics. Mark reproducibility `DONE_VERIFIED` only after that gate passes.
- Status ledger: `PARTIAL` — R002/R003 exact-form candidate implementation mirrored; `TODO` — confirm exact-head Python/browser/build/wheel/system tests; `BLOCKED` — cross-convention teacher-vs-Strict accuracy until reviewed IPA mapping and independent adjudication; `BLOCKED` — canonical seed-portfolio metrics until deterministic duplicate-run gate passes; `DEFERRED` — neural runtime integration. `붉은기` remains intentionally unlicensed.
- No evidence yet establishes improved Ukrainian practical-orthography accuracy from these candidates. The rules operate at the Korean morphophonological stage only; final IPA adaptation and Ukrainian output remain separate acceptance gates. Keep PR #339 draft and do not merge before all exact-head checks and linguistic review are complete.


### Exact latest-head status refresh — 2026-10-27

- Latest audit commit: `3de0a48b01a82ecb1f19da2a8a41f7bcacb0dedc`; branch remains `research/strict-teacher-guided-rule-mining-2026-10-26`, PR #339 open/draft.
- On the immediately preceding executable+handoff head `4e96606d25bab6d666fa304504b5520cbf6be536`, the tests workflow `40474711191`, system verification `40474710969`, corpus audit `40474711100`, scratch-teacher workflow `40474711057`, master artifacts `40474711073`, browser integration `40474711252`, and deterministic portfolio gate `40474711208` were all still queued at the last poll. No pass/fail result is available; queued is not pass.
- The final audit correction is documentation-only, but it changes the branch head, so the latest head still requires a CI status refresh. Do not claim exact-head tests passed until they finish. Optional NIKL live/metadata inventory remains skipped by workflow condition, so that source fetch has not been verified in this run.
- Audit interpretation correction: the first portfolio artifact's numbers are artifact-specific, not proof of repeatability. Subsequent same-seed runs changed checkpoint/prediction hashes and metrics. Canonical portfolio status remains `BLOCKED` pending the duplicate-seed gate.


### Sequential rule order and browser runtime regression coverage — 2026-10-27

- Code commit `96a168f74e5160e5d1bb32a5786a54cca9ab316d` corrects the `많아지다` Python test to assert the actual ordered sequence: R003 removes the ㅎ component from ㄶ, then R002 resyllabifies retained ㄴ, yielding `마나지다`. The previous expectation (ㄴ coda + silent onset ㅇ) contradicted the subsequent R002 implementation.
- Added browser integration test `tests/exact-form-teacher-triage-cases.test.mjs` in commit `e832f752c5de805877c49ac74a64abee45686b87`. It asserts browser surface-Hangul results for `가없이`, `말없이`, `수없이`, `늙은이`, and `많아지다`, plus the negative control `많아보이다`. The test has not yet run in a completed CI job.
- Source-level map parity check: Python/browser R002 formal map 37/37 entries and R003 map 25/25 entries matched exactly. This is not a substitute for Python tests, browser tests, build, or system verification.
- Updated audit after the correction: `docs/NEURAL-TEACHER-STRICT-DISAGREEMENT-AUDIT-2026-10-27.md`, commit `96da861315cde71b2ed8c017b4ce87fa42f2d3fa`.
- Current acceptance remains `PARTIAL`: exact-form rule code is mirrored and regression coverage added; do not mark it verified until latest-head CI finishes. Reproducibility remains `BLOCKED` until the repeated-seed checkpoint/prediction hash gate passes. The broad-IPA adapter and independent case adjudication remain the central research blockers.




### Latest CI poll after browser regression addition — 2026-10-27

For exact branch head `4be18f7d25dda301120256868b85b1d59e20738b`, the following key workflows were started but remained **QUEUED** at the latest poll:
- Full tests (Python 3.11/3.12/3.13, browser, wheel): [40475408870](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40475408870).
- System verification (Python/browser regression and data integrity): [40475408848](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40475408848); optional NIKL inventory job was skipped by its workflow condition.
- Browser G2P integration: [40475408813](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40475408813).
- Reproducible seed portfolio / duplicate-seed gate: [40475409331](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40475409331).
- Teacher corpus audit: [40475409203](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40475409203).
- Scratch teacher training and error analysis: [40475409001](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40475409001).

These are neither passes nor failures; the runner has not returned a conclusion. No exact-head test outcome is claimed. The current task is blocked on external CI execution/runner availability, while the research acceptance blockers (reproducibility, reviewed IPA adapter, independent pronunciation adjudication) remain separate.


### `말없이` expected surface correction — 2026-10-27

- Follow-up sequential-rule review corrected the browser test expectation for `말없이`: its preceding ㄹ coda resyllabifies into 없, so the expected surface-Hangul form is `마럽씨`, not `말업씨`. Test correction commit: `e34e9285474cbe8f8dc34a33ea10283e1ad31e7f`; audit correction commit: `a0bbc9bc446b207b03403e479edd12c6f89e92ba`.
- This was an expectation correction only; no runtime rule changed. The browser test and Python rule tests remain unexecuted because the corresponding GitHub Actions jobs have stayed queued. Keep the new outputs `PARTIAL` pending test execution and independent source review.


### Scope clarification: Korean phonology and IPA first; Ukrainian target last (2026-10-27)

The active implementation scope is now explicitly ordered as requested: **Korean structural/morphological analysis → Korean phonological surface → typed IPA → cross-runtime IPA acceptance → Ukrainian adaptation only at the very end.** Do not spend this phase tuning Ukrainian letters or target mappings while Korean IPA remains under-specified.

New finding in audit commit `52e1fd4ab7def80531cb5a5591d2f897292c50d2`: Python broad IPA renders fortis ㅆ as `s͈`, while the browser renderer emits `ɕ͈` before its broad `J_VOWELS` set. Python labels its narrower sibilant profile explicitly and only partially; browser currently has no equivalent named profile contract. This is a **Korean IPA contract issue**, independent of Ukrainian spelling quality. Do not choose a canonical form by convenience or silently normalize the strings.

Updated task ledger:
- `PARTIAL`: source-level Python/browser rule-map equality for the affected exact-form inventories (37 R002 entries and 25 R003 entries) was checked manually; the pre-existing `tests/test_rule_license_parity.py` already automates parity across the larger set of exact-form inventories. The latest test execution is still waiting on CI, so it is not yet `DONE_VERIFIED`.
- `PARTIAL`: five exact-form rules mirrored and regression cases added; latest-head runtime tests have not executed.
- `TODO`: define a runtime-independent IPA profile contract and paired fixtures for the same Korean forms; explicitly distinguish phonemic, broad, and partial-narrow outputs.
- `BLOCKED`: end-to-end runtime acceptance and canonical neural-teacher metric status while CI runs remain queued and the duplicate-seed gate is unresolved.
- `DEFERRED`: Ukrainian practical orthography, target mapping refinements, and UI output polish until Korean surface forms and IPA profiles pass acceptance.

At the latest poll, all current-head workflows (tests, system verification, browser integration, seed portfolio, corpus audit and multi-engine diagnostics) remained `QUEUED`; no pass/fail claims are made. The optional NIKL source-inventory job was skipped by its condition. PR #339 stays open/draft. No runtime IPA-profile change was made because changing browser IPA without first separating the target adapter could silently change Ukrainian output, contrary to the current phase boundary.


### Parity-test inventory correction — 2026-10-27

Inspection confirmed that `tests/test_rule_license_parity.py` already exists and compares Python dictionaries with browser exact-form maps across multiple rule families, including R002 and R003. Do not create a duplicate test or duplicate implementation. The earlier note's TODO applies only to **running the existing test on the current head**, not authoring a parity test from scratch. The test is currently unverified because current-head CI jobs remain queued. The separate Korean IPA-profile parity gap is not covered by this table-inventory test and remains a genuine TODO.


## Current-head regression repair and IPA contract gate (2026-10-27)

- **Current starting head:** `37487217fd187874099661025f5c6cb72963e172`. PR #339 remains open and Draft; base is `main`.
- **Exact-head CI inspection:** on that head, browser G2P integration, corpus split audit, master artifact generation, morphology-consensus diagnostic, external UGTPHON diagnostic, multi-engine diagnostic, optional g2pK integration, and exhaustive case-register extraction passed. The Python test workflow failed in `tests/test_summarize_korean_teacher_strict_disagreements.py::test_seed_consensus_is_preserved_without_cross_ipa_scoring`; system verification failed at the same Python regression. The seed-portfolio workflow also failed its focused test gate for the same failure. No phonological runtime failure was demonstrated by those three failures.
- **Root cause:** the test fixture generated IDs as `sigmorphon-dev:NNNNN`, while the analyzer correctly requires the pinned dataset/split prefix `sigmorphon-2021-task1-medium-korean:dev:`. Updated the fixture IDs only; analyzer validation remains strict. Fix commit: `82e24ce2375872693952ee2e5224c8743d317f33`.
- **IPA acceptance contract:** added [Korean IPA runtime-profile contract](KOREAN-IPA-RUNTIME-PROFILE-CONTRACT-2026-10-27.md). Python broad fortis ㅆ (`s͈`) and browser contextual fortis output (`ɕ͈` before `J_VOWELS`) remain intentionally unreconciled pending phonetic/profile adjudication. No production rule, IPA string, or Ukrainian adaptation was changed to conceal the mismatch.
- **Task ledger:** `DONE_VERIFIED` — identify the fixture-prefix regression and correct the test data; `PARTIAL` — profile contract documented; `TODO` — paired versioned Python/browser IPA fixtures and explicit browser profile metadata; `BLOCKED` — parity approval until the profile semantics are independently decided and exact-head CI passes; `DEFERRED` — Ukrainian adaptation until Korean IPA acceptance is stable.
- **Verification status for the fix:** Actions triggered on `82e24ce2375872693952ee2e5224c8743d317f33` were queued at the time this entry was written. The fix is not marked verified until those runs complete. No test pass is inferred from the code edit.


## Paired sibilant-profile baseline fixtures (2026-10-27)

Added a browser diagnostic snapshot `tests/ipa-profile-legacy-baseline.test.mjs` and Python broad-profile assertions in `tests/test_narrow_ipa.py`. The fixtures make the current mismatch inspectable on identical Korean forms: Python broad `씨 → s͈i`, while browser legacy `씨 → ɕ͈i`; Python broad and browser legacy both currently use `s͈a` for `싸`. Browser-only baseline cases also cover `시`, `쇼`, and `쌰`. Test comments explicitly classify these as current implementation baselines, not pronunciation gold and not cross-runtime parity approval. No production runtime output or Ukrainian adapter changed.

- Current head after fixture additions: `a3666562c4817f15e33a6e68835094d81f1409f0`.
- `PARTIAL`: baseline tests added; exact-head CI must execute them before verification.
- `BLOCKED`: profile equivalence and IPA correctness remain open until independent phonetic review determines whether broad IPA includes the contextual palatalization and whether the browser should expose a separate surface/narrow profile.
- `DEFERRED`: Ukrainian adaptation changes until Korean IPA profile acceptance is stable.


## Current execution snapshot (2026-10-27; head reconciliation)

- Branch head at this snapshot: `82a0bf6b7aab1aa7b571a6e86910f566a01103ce`; the following documentation commit will supersede this SHA while preserving the state described here.
- The prior exact-head test failure was a malformed fixture ID, not a relaxed analyzer contract. Fixture corrected in `82e24ce2375872693952ee2e5224c8743d317f33`.
- Browser and Python diagnostic baseline fixtures now cover the unresolved sibilant profile difference; no production IPA output or Ukrainian mapping was modified.
- Latest exact-head CI is backlogged. Runs on the current lineage are queued; therefore the fixture repair and new tests remain `PARTIAL`, not `DONE_VERIFIED`, until exact-head Python, browser, and system workflows complete.
- The independent phonetic decision remains the genuine blocker: determine the intended broad/surface treatment of ㅅ/ㅆ before front/j-vowels, add versioned profile metadata/paired fixtures, then test. Ukrainian adaptation stays deferred.


## Browser IPA profile metadata boundary (2026-10-27)

The browser converter now attaches `ipa_profile` and `ipa_profile_status` metadata to both the ordinary conversion result and the multi-part/lexical aggregate result. Default legacy output is labelled `browser-legacy-contextual-v1`; the explicit surface-mode path is labelled `browser-surface-mode-legacy-v1`; both currently report `unadjudicated-cross-runtime`. This change does not alter the IPA string, contextual rules, Ukrainian target mapping, or any phonological result. The baseline regression test asserts the metadata and current browser strings. Current pre-documentation head: `a3e916bf9769ccf7c3b227b57700681b4a441fb4`. Exact-head CI is queued; mark implementation `PARTIAL` until Python/browser/system tests pass. The metadata labels provenance, not phonetic correctness or approval for cross-runtime scoring.


## Continuation handoff — 2026-10-27 12:00 UTC+02:00

### Exact starting state and CI regression

- Default branch: main; latest base SHA observed: a452054a669de28426404d1110731715083423bb.
- Working branch: research/strict-teacher-guided-rule-mining-2026-10-26; initial HEAD for this session: 4379463aab4f5a829c61ed666deb28cafffa1a6e.
- PR #339 remains open and Draft: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/339.
- Contract file docs/KOREAN-IPA-RUNTIME-PROFILE-CONTRACT-2026-10-27.md exists. Its source/conformance wording has been reconciled with the implementation: browser results already expose versioned ipa_profile strings and ipa_profile_status=unadjudicated-cross-runtime; Python exposes level and realization_status, while its structured transcription_profile object is currently only returned for the partial narrow profile. A shared typed schema, feature/boundary sequence, adapter eligibility gate, and paired fixtures remain incomplete.
- Exact-head run 40480217054 (seed portfolio, SHA 4379463aab4f5a829c61ed666deb28cafffa1a6e) FAIL: summarize_korean_teacher_strict_disagreements.py rejected a variable number of Strict pairs because it hard-coded 994. The preceding checkpoint/prediction same-seed hash and dev-metric comparison PASS; this failure is not evidence of model nondeterminism.
- Corrective implementation: triage now requires 1,000 pinned dev predictions, requires every Strict pair ID to be a prediction ID, and requires identical Strict pair-ID sets across all three seeds. It no longer assumes a fixed number of resolved cases. Added tests for variable pair counts and for fail-closed behavior when pair IDs differ across seeds.
- Changes committed via GitHub contents API: bdfa337827ecea10edcd727062ab22f30b04ec3b (triage logic), a826d23d8c2623ef8a7c6f1fc552804bd5f4bfc5 (regressions), b9509b0870a833dca95f6ab1fa2cb95782fea9fc (contract/source reconciliation). Verify the actual branch HEAD before treating these as final.
- CI was launched on a826d23d8c2623ef8a7c6f1fc552804bd5f4bfc5; the seed portfolio, test suite, system verification, and other workflows were queued/in progress at the time of this note. These are QUEUED/IN_PROGRESS, not PASS. Poll exact-head runs and inspect logs before closing the defect.

### Evidence update: Korean sibilants

- Kang, Hyunsook (2010), “Coarticulation effects of Korean sibilant /s/ before a high front segment,” Studies in Phonetics, Phonology, and Morphology 16(1):3–18, https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001444770. The abstract reports acoustic differences for /s/ before /i, ye, ya/ and a distinct spectral pattern before /yu, yo/. This supports contextual distinctions, not a universal categorical IPA conversion for tense /s͈/.
- Kong & Kang (2020), “Gendered spectral patterns of sibilant fricatives in Seoul Korean,” Studies in Phonetics, Phonology, and Morphology 26(1):1–19, https://kci.go.kr/kciportal/landing/article.kci?arti_id=ART002585434. The abstract includes lax and tense sibilants, notes palatalized variants before /i/, and reports speaker-related spectral differences. This does not resolve whether every browser ɕ͈ token should replace Python broad s͈.
- Decision: keep the mismatch unadjudicated; do not rewrite either profile based on the abstracts alone.

### Task ledger at this checkpoint

| Task | Status | Acceptance evidence still required |
|---|---|---|
| Repository/PR/head and contract presence checked | DONE_VERIFIED | Recheck exact final HEAD before handoff closes |
| Seed-portfolio variable-pair failure diagnosed and corrected | PARTIAL | Exact-head seed-portfolio run passes; inspect artifact and all three pair-ID sets |
| Python/browser rule-license parity fixture | PARTIAL | Existing tests/test_rule_license_parity.py remains in use; current-head full test workflow must pass |
| Browser IPA profile metadata | DONE_VERIFIED (limited scope) | Field exists; does not prove shared typed schema or compatibility |
| Shared typed IPA schema and adapter gate | TODO | Versioned schema in both runtimes; incompatible/unreviewed profiles rejected before target mapping; no silent loss of boundaries/diacritics |
| ㅅ/ㅆ profile adjudication | BLOCKED / UNADJUDICATED | Primary-source or expert evidence that specifically adjudicates fortis /s͈/ in listed vowel contexts; paired fixtures |
| Independent gold for teacher disagreements | BLOCKED | Independent pronunciation/IPA adjudication; teacher consensus is not gold |
| Ukrainian target changes | DEFERRED | Only after Korean surface and typed IPA acceptance; no target changes in this continuation |

No production pronunciation rule or Ukrainian mapping was changed in this continuation. No local test result is claimed; verification relies on GitHub Actions. PR #339 must remain Draft until all required current-head gates pass and scientific IPA acceptance is independently supported.


## Versioned IPA metadata and paired fixture continuation — 2026-10-27

- Added common metadata fields to Python IPA output: ipa_profile, ipa_profile_version, ipa_profile_level, ipa_profile_status. Profile IDs distinguish Python phonemic, broad, and partial-narrow output. Existing IPA strings and target conversion behavior are unchanged by this metadata-only change.
- Added the same metadata keys to browser output; browser profile IDs remain browser-legacy-contextual-v1 and browser-surface-mode-legacy-v1, with level identifying the relevant mode. Status remains unadjudicated-cross-runtime.
- Added tests asserting the Python/browser metadata contract and shared source-form fixture at tests/fixtures/korean-ipa-profile-pairs-2026-10-27.json. The fixture preserves each runtime's current output separately, declares UNADJUDICATED and target-adapter eligibility UNVERIFIED, and does not pretend to establish cross-runtime parity.
- Current relevant commits: Python metadata 2e35037e718a5c19215165f176122e2ea36f2d6f; Python metadata tests a9d838af90b830198dd2396ba65cf8a5684b7267; browser metadata cfee2575620aa9d89a5cbe62f6ba0740cb775d9e; browser metadata tests 0513d836b9a4a05a964f9501bd20addcba6227da; shared fixture f54c2cdd211b8a4175cf70003616a92df7e2a41b; browser shared-fixture test 78af6c365f8a4259827f6c862958239884bcf30d; Python shared-fixture test e66750873e9685da45373bb3eccd7b6a9384f932; syntax correction ef0b47912a511fc3cff374b7679e0c942e963650; contract update 07dd0d72ce8bde18ddb6123a323ca6b05840df5f.
- These changes remain PARTIAL until exact-head CI confirms all Python/browser tests. Metadata does not yet provide a shared structured segment/feature/boundary sequence and does not by itself enforce adapter eligibility; do not claim full typed IPA acceptance or parity.
- No production Korean pronunciation rules or Ukrainian mappings changed. PR #339 remains Draft.


## Final continuation checkpoint — 2026-10-27

### Exact state and verification ledger

- Starting branch HEAD: 4379463aab4f5a829c61ed666deb28cafffa1a6e. Latest code/data/test head before this handoff update: ea79916124e7fff9c939bf79b3e932c5f3b757fc.
- Branch: research/strict-teacher-guided-rule-mining-2026-10-26. PR #339 remains OPEN / DRAFT; base main SHA observed as a452054a669de28426404d1110731715083423bb.
- Local clone command attempted: git clone --filter=blob:none --depth=1 --branch research/strict-teacher-guided-rule-mining-2026-10-26 https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System.git /tmp/kua-repo. Result: BLOCKED, DNS could not resolve github.com. No local test pass is claimed.
- Historical exact-head seed portfolio run 40480217054 on 4379463aab4f5a829c61ed666deb28cafffa1a6e: FAIL in the triage step because a fixed 994-pair expectation rejected a variable pair count. Its same-seed checkpoint and prediction hashes matched, and dev metrics matched. This was a triage cardinality assertion failure, not demonstrated model drift.
- Corrected triage: validates 1,000 dev predictions, requires Strict pair IDs to be a subset of those IDs, and requires identical Strict pair-ID sets across seeds; count is no longer hard-coded. Added tests for variable pair counts and pair-set mismatch. Status remains PARTIAL pending current-head CI.
- Versioned IPA metadata added to both runtime result shapes: ipa_profile, ipa_profile_version, ipa_profile_level, ipa_profile_status. Added a shared fixture for 싸/씨/시/쇼/쌰, preserving Python and browser outputs separately. Fixture labels are UNADJUDICATED and target-adapter eligibility UNVERIFIED. This does not yet create a typed segment/feature/boundary sequence or enforce a shared adapter gate.
- Source register additions: SRC-KANG-2010-KOREAN-SIBILANT-COARTICULATION and SRC-KONG-KANG-2020-SEOUL-SIBILANTS. Their license states remain not_assessed; source register audit test expectations updated from 117 to 119 rows and REVIEW_REQUIRED from 113 to 115; manual-classification count remains 2.
- Exact-head CI poll for ea79916124e7fff9c939bf79b3e932c5f3b757fc showed tests, browser integration, system verification, seed portfolio, teacher training, corpus audit, and research workflows QUEUED. They are not PASS. Latest run IDs include tests 40486623075, system verification 40486623078, browser integration 40486623079, seed portfolio 40486623081, teacher split audit 40486623109, and master artifacts 40486623134. Poll these and inspect logs/artifacts before marking anything verified. A prior code/test head a826d23d8c2623ef8a7c6f1fc552804bd5f4bfc5 passed tests, system verification, browser integration, corpus audit and several diagnostics, but that is not verification of the later IPA metadata/fixture/source-register changes.
- Primary source abstracts: Kang (2010) reports context-specific /s/ coarticulation and a distinct /yu, yo/ pattern; Kong & Kang (2020) report speaker/context variation and palatalized variants before /i/. These do not settle a universal categorical [ɕ͈] output for tense /s͈/. Do not change either profile without further adjudication.

### PR and branch reconciliation

- PR #340 is merged into this research branch and its train-only conflict-queue work was reused; it was not independently re-merged.
- PR #341 remains open/Draft and has source-backed R002/R016 changes in rules.py and browser rule modules. No duplicate rule edits were made in this continuation; its branch remains separately owned and was not merged blindly.
- PR #338 remains open/Draft for separate neural V3 benchmark research; no runtime neural dependency or weights were added.
- PR #336 remains open and outside the present IPA-profile scope; it was left untouched.
- No branch was deleted, no PR was merged, no release was published, and no external settings were changed.

### Final task ledger

| Task | Status | Remaining acceptance criterion |
|---|---|---|
| Repository state, PR state, contract presence | DONE_VERIFIED | Recheck exact final HEAD after this handoff commit |
| Seed-portfolio triage correction | PARTIAL | Exact-head seed workflow passes and all three pair-ID sets are inspected |
| Shared versioned profile metadata | PARTIAL | Exact-head Python/browser CI passes |
| Paired IPA fixtures | PARTIAL | Shared fixture tests pass; independent adjudication remains separate |
| Source register / rights triage | PARTIAL | Exact-head source-register audit passes; publication rights remain not assessed |
| ㅅ/ㅆ phonetic adjudication | BLOCKED / UNADJUDICATED | Independent evidence specifically adjudicates tense /s͈/ contexts and broad-vs-narrow representation |
| Full typed IPA features/boundaries and adapter eligibility enforcement | TODO | Shared typed structure and fail-closed downstream gate with tests |
| Ukrainian target changes | DEFERRED | Revisit only after Korean surface and IPA gates pass |

Readiness remains research-ready partial prototype, not release-ready. Do not promote rules, claim teacher accuracy against ClippyFirst broad IPA, change Ukrainian adaptation, or mark PR #339 ready until the required evidence and exact-head CI are complete.


## Fail-closed IPA adapter guard continuation — 2026-10-27

- Implemented ipaTargetForProfile(source, ipaResult, options) in src/app/engine_ipa.js. It requires a structured runtime result with explicit IPA profile ID/version/level/status and a nonempty IPA string. It fails closed for absent metadata, unadjudicated profiles, partial research-only profiles, and profiles not in the target-compatibility allowlist.
- ADAPTER_COMPATIBLE_IPA_PROFILES is intentionally empty; no existing profile has passed independent phonetic adjudication and target acceptance. Existing raw-string APIs and legacy runtime paths remain unchanged for compatibility, so the guard is not yet wired as the only production entry point. Do not call the entire adapter gate complete.
- Added regression cases to tests/ipa-ukrainian-trace.test.mjs: missing object/metadata, broad unadjudicated profile, partial narrow profile, and unregistered profile claiming adjudication.
- CI for implementation commit 56be0591f6342d27356ef64e965873b73321d9a3 and test commit 4b4dd73c8003dc29f84b88a52bbe3adb88fca431 was in progress/queued when this note was authored. Latest runs: tests 40503461770, system verification 40503462048, browser G2P 40503462012, seed portfolio 40503461991. Inspect exact-head results before upgrading status.
- Prior HEAD b867fd01233bfaed64eec63beaa233bac9fbbe10 passed system verification (Python regression/data integrity and browser regression/build), test matrix (Python 3.11/3.12/3.13, web, wheel-install and teacher-corpus audit), browser integration, seed reproducibility, corpus split audit, and research diagnostic workflows. NIKL official inventory job was SKIPPED, not PASS.
- Diagnostic note: a browser g2pK-vs-Python-g2pK report includes raw-port surface divergences such as 읽고; the same report labels them as raw JS-port divergence and says the practical NIKL correction yields 일꼬. Do not misclassify that diagnostic as a failure of the native strict engine or as IPA gold. Keep engine comparison layers separate.
- Acceptance remains PARTIAL until the new tests pass, and adapter compatibility remains BLOCKED/UNADJUDICATED until the allowlist can be populated with independently accepted profiles and the production path is wired through the guard.


## Cross-runtime profile-aware adapter guard — implementation expanded 2026-10-27

- Added browser guard `ipaTargetForProfile(source, ipaResult, options)` in `src/app/engine_ipa.js`; the compatibility allowlist is private and read-only from the public API.
- Added matching Python guard `render_profiled_ipa_to_ukrainian(source, ipa_result, allow_provisional=False)` in `src/korean_ukrainian/ipa_target_renderer.py`; its compatibility allowlist is an immutable empty frozenset.
- Both reject incomplete metadata, unadjudicated broad profiles, partial research-only narrow profiles, and purportedly adjudicated profiles not explicitly allowlisted. No profile is currently allowlisted.
- Regression tests were added to `tests/ipa-ukrainian-trace.test.mjs` and `tests/test_ipa_target_renderer.py`.
- Current code/test commits: browser guard `56be0591f6342d27356ef64e965873b73321d9a3`, browser guard tests `4b4dd73c8003dc29f84b88a52bbe3adb88fca431`, private browser allowlist `b373483d340a216e60d9bda9d145b08448db236b`, read-only browser allowlist tests `ad195cc8570a142ff27bbcb972ee66e16173c3d2`, Python guard `0d7fa60a34deb1c8b64d991448d5edec4013f8f0`, Python tests `7f068964ff5da6b613fac11d52094003bf0f9078`.
- Exact-head runs for `7f068964ff5da6b613fac11d52094003bf0f9078` remain queued at this checkpoint (tests run `40503747819`, system verification `40503747777`, browser integration `40503747782`, seed portfolio `40503747887`). Earlier commit `b867fd01233bfaed64eec63beaa233bac9fbbe10` passed its full test matrix, browser integration, seed reproducibility, corpus split audit and research workflows; those passes do not verify these new guard changes.
- Production wiring is still intentionally incomplete: legacy raw-string adapters and runtime calls remain for compatibility, and the allowlists remain empty pending independent phonetic adjudication. Therefore this is fail-closed API groundwork, not completion of the IPA acceptance gate.


## Exact-head profile-guard CI and controlled broad/narrow dev comparison — 2026-10-27

- Current branch/head at benchmark completion: `research/strict-teacher-guided-rule-mining-2026-10-26` / `c244265eb17d449ddd6f7f11df1f02a621c1a837`. PR #339 remains open and Draft.
- Exact-head `tests` workflow [40503863717](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863717) passed: Python 3.11/3.12/3.13, browser tests/build, wheel build/install. System verification [40503863769](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863769), browser integration [40503863653](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863653), teacher split audit [40503863644](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863644), seed portfolio [40503863729](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863729), multi-engine diagnostic [40503863730](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863730), native-vs-g2pk diagnostic [40503863761](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863761), morphology consensus [40503863708](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863708), external UGTPHON diagnostic [40503863812](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863812), research morphology smoke [40503863849](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863849), optional g2pK [40503863770](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863770), master artifacts [40503863749](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863749), and exhaustive test-case register extraction [40503863783](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863783) all passed. The official live NIKL source-inventory job in system verification was **SKIPPED**, not passed.
- The train/dev-only Charsiu broad/narrow comparison [40503863832](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863832) completed successfully and produced artifact [12734702435](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40503863832/artifacts/12734702435) (14-day retention). The runner used pinned model/tokenizer revisions, did not serialize or evaluate the test split for rule selection, retained raw targets, and asserted no automatic production-rule promotion.
- **Controlled profile-sensitivity results (not validated cross-corpus accuracy):**
  - SIGMORPHON medium Korean dev: 1,000 eligible forms; controlled broad profile 332/999 exact (33.23%), CER 15.47%, coverage 999/1,000; partial narrow sibilant profile 431/999 exact (43.14%), CER 11.36%, same coverage. Narrow-minus-broad sensitivity: +9.91 percentage points exact match and −4.11 percentage points CER.
  - UGTPHON dev: 1,897 source rows; 63 non-Hangul rows excluded by the benchmark adapter, leaving 1,834 eligible token occurrences across 1,629 unique forms. On the common 1,800 cases scored by both controlled profiles, broad 977 exact (54.28%), CER 9.61%, coverage 1,800/1,834; partial narrow 1,193 exact (66.28%), CER 6.35%, same coverage. Narrow-minus-broad sensitivity: +12.00 percentage points exact match and −3.25 percentage points CER.
  - Charsiu's raw dev scores were SIGMORPHON 676/1,000 exact (67.60%), CER 5.65%; UGTPHON 1,670/1,834 exact (91.06%), CER 2.35%. These are descriptive scores against each corpus's own declared targets only; they are **not** proof of superiority under a shared, independently adjudicated IPA convention.
- The controlled comparison renders broad and partial narrow from the same post-rule analysis, excludes lexical IPA overrides from both sides, and applies the same unresolved-pronunciation abstention gate. The sizable delta is evidence that the IPA annotation convention materially changes the measured score, not a reason to promote the narrow profile or change production output. Source-target conventions remain `UNREVIEWED` relative to ClippyFirst broad IPA; teacher training overlap is `UNKNOWN`; checkpoint weights license remains `UNRESOLVED`. No teacher output was promoted into a rule and no Ukrainian target mapping was changed.
- Guard tests and the full current-head test/system checks now pass, but the fail-closed profile adapter allowlists remain intentionally empty and legacy raw-string target paths still exist. Full typed feature/boundary representation and production wiring remain `PARTIAL/TODO`; independent phonetic adjudication remains `BLOCKED`; Ukrainian adaptation remains `DEFERRED`. Repository status remains **research-ready partial prototype, not release-ready**.

## 2026-10-27 metadata consistency, seed reproducibility, and sibilant evidence review

### Exact code/test head before this evidence/register batch

- Code/test head 8d19b204a655c998ee9d3ca1c1fd70afbfa7c7f7 passed the full tests workflow [40506463822](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463822): Python 3.11/3.12/3.13, browser tests/build, wheel build/install, and corpus audit. System verification [40506463927](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463927), browser integration [40506463782](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463782), teacher split audit [40506463835](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463835), exhaustive test-case register extraction [40506463943](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463943), multi-engine diagnostic [40506463954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463954), paired native/g2pk diagnostic [40506463802](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463802), research morphology smoke [40506463829](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463829), morphology consensus [40506463952](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463952), external UGTPHON diagnostic [40506463766](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463766), scratch teacher [40506463769](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463769), optional g2pK [40506463755](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463755), and master artifacts [40506463757](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463757) passed. The official NIKL live source-inventory job remained **SKIPPED**, not PASS. Charsiu train/dev broad/narrow workflow [40506463914](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463914) was still running at the checkpoint for this note; do not count it as pass until completion.
- The lexical/mixed-input early return in src/app/engine_convert.js was missing ipa_profile_version and ipa_profile_level. Both are now emitted consistently with the normal return path; the phrase regression in tests/ipa-ukrainian-trace.test.mjs asserts the full metadata contract. This fix is included in code/test head 8d19b204a655c998ee9d3ca1cfd70afbfa7c7f7 and its test matrix passed.
- The exact-head seed portfolio [40506463940](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463940) passed with pinned PyTorch 2.14.1+cpu, deterministic CPU settings, test partition not loaded, and same-seed checkpoint/prediction hash reproducibility. Artifact [12734659163](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40506463940/artifacts/12734659163) reports:
  - seed 20261026: dev exact 604/1,000 (60.4%), token error rate 12.4001%, compact-character error rate 11.7841%;
  - seed 20261027: 600/1,000 (60.0%), token error rate 12.8526%, compact-character error rate 11.8519%;
  - seed 20261028: 591/1,000 (59.1%), token error rate 12.4755%, compact-character error rate 11.3771%.
  The deterministic dev ranking selects seed 20261026 by token error rate, then exact-match rate; seed 20261028 has the best compact-character error rate, so there is no winner on every metric. Case-level seed consensus: 464 cases all three match the SIGMORPHON dev reference, 260 have mixed seed correctness, 276 have none correct; only 999/1,000 cases have a Strict pair, with one unresolved/diagnostic-only case. These are dev-target diagnostics, not independently adjudicated Korean IPA accuracy.
- Reproducibility hardening: the single-seed workflow previously installed unpinned latest CPU PyTorch while the seed-portfolio workflow pins 2.14.1+cpu. The single-seed workflow is now pinned to the same exact version and asserts the runtime version, avoiding silent environment drift between comparable experiments. Earlier results from older PyTorch environments remain historical and should not be overwritten as if they were the same experiment.
- Additional source review registered SRC-HOLLIDAY-REIDY-2016-PRODUCTION / S016: Holliday & Reidy's 2016 LabPhon poster used six female native Korean speakers and 18 word-initial CV tokens in /a, i, u/ contexts; it reports context-sensitive aspiration and palatalization before /i/. This small poster is not normative and its redistribution terms are unassessed. It cautions against treating the current partial narrow profile's [sʰ] as uniform before high vowels and leaves the exact aspiration of [ɕʰ] and tense /s͈/ palatalization unresolved. The narrow profile remains partial/research-only, the adapter allowlists remain empty, and no production rule or Ukrainian target mapping was changed.
- The research source register now has 120 rows. The rights audit remains intentionally unresolved for 116 sources; source registration does not establish permission to redistribute source text. The final source-register audit must still pass after this batch.
- PR #339 remains open and Draft. Repository remains **research-ready partial prototype, not release-ready**. Remaining blockers: (1) source/convention adjudication of broad/narrow IPA and sibilant contexts; (2) full structured IPA segment/feature/boundary representation and exclusive production wiring through the guard; (3) independent target-inventory review before any Ukrainian mapping change; (4) item-level source-rights clearance where needed. No neural teacher output was promoted to production rules.



## Exact-head CI reconciliation and next acceptance gate — 2026-10-27 15:32 UTC+02

### Repository state

- Working branch: `research/strict-teacher-guided-rule-mining-2026-10-26`.
- Latest code/test head reviewed: `f0e6a56e712a98ab8710df22d7a8e7decb27801c` (`research: register sibilant evidence and pin teacher environment`).
- PR [#339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/339) remains open and Draft. No merge, release, branch deletion, or external setting change was performed.
- The branch head includes the profile-aware Python/browser fail-closed guards and their tests, plus the lexical/phrase IPA metadata consistency fix. The runtime allowlists are intentionally empty.

### Exact-head workflow reconciliation

The following workflow runs report the exact head `f0e6a56e712a98ab8710df22d7a8e7decb27801c` and completed successfully:

- [Tests — 40507960275](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960275): PASS.
- [System verification — 40507960621](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960621): PASS.
- [Browser G2P integration — 40507960342](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960342): PASS.
- [Teacher corpus split audit — 40507960639](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960639): PASS.
- [Teacher seed portfolio — 40507960633](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960633): PASS.
- [Scratch teacher training — 40507960182](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960182): PASS.
- [Master table/research artifacts — 40507962745](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507962745): PASS.
- [Exhaustive test-case register extraction — 40507961067](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507961067): PASS.
- [Native engine vs g2pk diagnostic — 40507960638](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960638): PASS.
- [Multi-engine IPA diagnostic — 40507960369](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960369): PASS.
- [Morphology consensus diagnostic — 40507960113](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960113): PASS.
- [External UGTPHON diagnostic — 40507960131](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960131): PASS.
- [Research morphology adapter smoke — 40507960500](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960500): PASS.
- [Optional g2pK integration — 40507960433](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960433): PASS.
- [Charsiu train/dev broad-vs-narrow review — 40507960081](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40507960081): PASS.

These workflow successes verify the code/tests/diagnostics at this commit. They do **not** establish that the broad/narrow IPA convention is independently adjudicated, that either corpus's target strings are equivalent to ClippyFirst IPA, or that a profile is ready for Ukrainian adaptation. The official live NIKL source-inventory step is skipped by workflow policy and remains SKIPPED, not PASS. Local clean-checkout tests were not run because this execution environment previously could not resolve `github.com`; no local pass is claimed.

### Updated task ledger

| Task | Status | Acceptance evidence / remaining criterion |
|---|---|---|
| Current branch and PR state reconciled | DONE_VERIFIED | PR #339 is open/Draft; exact code/test head identified |
| Python/browser regression, build, wheel, integration checks | DONE_VERIFIED | Exact-head workflow runs listed above passed |
| Pinned teacher environment and deterministic seed portfolio | DONE_VERIFIED | Exact-head training/portfolio workflows passed; dev metrics remain source-convention-specific |
| Teacher corpus split integrity and research diagnostics | DONE_VERIFIED | Exact-head audit/diagnostic workflows passed; diagnostics do not define IPA gold |
| Versioned IPA metadata in normal and lexical/phrase runtime returns | DONE_VERIFIED | Code/test head 8d19b204a655c998ee9d3ca1c1fd70afbfa7c7 passed; later exact-head test suite also passes |
| Fail-closed profile-aware adapter guard in Python and browser | DONE_VERIFIED as guard API only | Exact-head tests pass; allowlists remain empty and legacy raw-string paths still exist |
| Full shared typed IPA segment/feature/boundary representation | TODO | Define and test a loss-preserving schema shared by Python/browser; preserve raw IPA, profile/version, boundary type, feature spans and unknown/unresolved state |
| Exclusive production wiring through approved profile gate | BLOCKED pending profile adjudication | Must not silently break all current output by wiring an empty allowlist; acceptance requires approved profile plus migration tests proving no bypass remains |
| Broad/narrow and ㅅ/ㅆ context adjudication | BLOCKED / UNADJUDICATED | Blind independent review and source/convention decision required; current studies do not settle universal tense-/sibilant-palatalization behavior |
| NIKL official source inventory | BLOCKED / SKIPPED | Workflow policy skips live source retrieval; requires an accessible official source snapshot and a non-skipped inventory audit |
| Source redistribution/license clearance | PARTIAL | Source registry records sources, but many rights remain not assessed; item-level clearance required before redistribution |
| Ukrainian target inventory and mapping changes | DEFERRED | Resume only after Korean surface IPA and typed adapter acceptance; do not change mapping to compensate for upstream uncertainty |

### Immediate next action

Continue from the existing schema and target-trace implementations rather than creating a parallel pipeline. Design the typed runtime IPA result as an additive, loss-preserving representation first; require exact Python/browser fixture parity for structure and provenance, but do not assert identical IPA strings until the profile convention is adjudicated. Keep the production allowlists empty and PR #339 Draft until blind review, target inventory review, and migration/no-bypass acceptance tests are complete. Repository remains **research-ready partial prototype, not release-ready**.


## Continuation — profile-gate option validation and exact-head CI review (2026-10-27)

- **Starting reference:** prior handoff checkpoint `c244265eb17d449ddd6f7f11df1f02a621c1a837`; work continued on `research/strict-teacher-guided-rule-mining-2026-10-26`. The GitHub connector did not expose a direct current-branch-head/PR-metadata endpoint in this session, so this SHA is a checkpoint, not a claim that no external commit landed concurrently.
- **Implemented:** both profile-aware adapter gates now validate options before profile rejection. JavaScript rejects a non-object `options` value and non-boolean `allowProvisional`; Python rejects non-boolean `allow_provisional`, including when the profile itself is incomplete/unapproved. This closes a real cross-runtime validation inconsistency where the empty allowlist previously short-circuited malformed opt-in values.
- **Regression tests added:** `tests/ipa-ukrainian-trace.test.mjs` and `tests/test_ipa_target_renderer.py` cover malformed opt-in values before an unapproved profile is rejected. These tests are added but are **not yet verified by CI on the resulting head**.
- **Changes pushed sequentially to the existing branch:** Python guard `2f03ea8b2180cec4890d6b56b25faf33f8a57822`; JS guard `082bd69bed6b367a571abf0df47a340ba58987c5`; Python test `a7f54767a71d7537f26919440a0dae6335beba37`; JS test `f71156401332315600ab25f978925799da2cb47f`.
- **Exact checkpoint CI review (runs associated with `c244265...`):** tests `40503863717` PASS (Python 3.11, 3.12, 3.13; wheel install; web; teacher-corpus audit); system verification `40503863769` PASS for browser regression/build and Python regression/data integrity, while official NIKL source inventory was SKIPPED; browser integration `40503863653` PASS; teacher corpus split audit `40503863644` PASS; seed portfolio `40503863729` PASS; paired native-vs-g2pk diagnostic `40503863761` PASS. These results verify the checkpoint only, not the four commits listed above. Other checkpoint workflows returned success, including master artifacts, morphology adapter smoke, optional g2pK integration, exhaustive test register extraction, and multi-engine diagnostics; no run was cancelled or claimed as passed based on a queued state.
- **Remaining verification:** exact-head Actions must run for `f711564...` (or later branch head). Local tests remain BLOCKED unless a clean checkout and dependencies become available; no local execution is claimed.
- **Status ledger:** `DONE_VERIFIED` — checkpoint CI results above; `PARTIAL` — option validation fix and regression tests committed but awaiting exact-head CI; `BLOCKED` — current live branch/PR snapshot and exact-head run details could not be queried directly through available GitHub actions; `BLOCKED` — approved IPA profile and independent ㅅ/ㅆ adjudication; `SKIPPED` — official NIKL live inventory job. Production raw-string pathways remain, so the repository is still a **research-ready partial prototype, not release-ready**.


## Continuation — shared typed-IPA negative contract suite (2026-10-27)

- **Branch:** `research/strict-teacher-guided-rule-mining-2026-10-26`; prior known checkpoint `c244265eb17d449ddd6f7f11df1f02a621c1a837`. Current head is being verified after the latest shared fixture/docs commits; do not treat a prior SHA as the final verified head.
- Added `tests/fixtures/ipa-profile-gate-cases.json` as a single negative-contract fixture consumed by both Python and browser tests. Cases cover raw-string input, missing metadata, empty IPA, zero/boolean profile versions, unadjudicated status, partial research-only status, and an unknown profile falsely marked compatible. Expected outcomes are rejection reasons, not linguistic gold.
- Python and JS test consumers added in `tests/test_ipa_target_renderer.py` and `tests/ipa-ukrainian-trace.test.mjs`. The fixture deliberately checks Python bool-versus-int and JavaScript integer semantics against the same expected contract.
- The prior checkpoint's browser integration passed at run `40514833256`; the exhaustive test-case register extraction passed at `40514832717`. In the latest visible system run `40514832575`, Python regression/data integrity was still `IN_PROGRESS`, browser regression/build was `QUEUED`, and official NIKL source inventory was `SKIPPED`. Full test matrix `40514832909` remained queued. These results predate the shared fixture additions and do not verify them.
- New exact-head CI should be read from the current branch head, not inferred from prior run IDs. No local tests are claimed. `PARTIAL`: shared fixtures and both consumers are committed but exact-head verification is pending. `BLOCKED`: independent ㅅ/ㅆ adjudication and approved target-compatible profile. `TODO`: exhaustive production-entry-point audit and safe retirement/restriction of legacy raw-string production routes. `SKIPPED`: live official NIKL inventory. PR #339 remains open/Draft; do not merge or release.


## Production-path audit continuation — 2026-10-27

- Audited browser and Python runtime entry points on the latest pre-audit code head `4c21616b1b96d954e1ed3384e6490e7a30443e9c`; full findings are recorded in `docs/IPA-PRODUCTION-PATH-AUDIT-2026-10-27.md` (commit `6db40e472d07990e1d85901fc46c15e0d7716ef9`).
- Confirmed acceptance blocker: browser `convertText()` uses `traceIpaMappingDetailed()` directly to populate public Ukrainian output on both the normal and lexical/mixed-input return paths, while labeling the IPA profile `unadjudicated-cross-runtime`; it does not route these outputs through the profile-aware `ipaTargetForProfile()` guard. The guard's allowlist is intentionally empty. Python `transliterate_korean()` has stricter unresolved/diagnostic checks but still uses the raw-IPA renderer rather than an approved profile allowlist.
- Do not flip the default to the empty allowlist without an explicit migration plan, because that would silently suppress existing UI output. Required next implementation: opt-in strict browser mode through the typed profile gate for both return paths; parity tests against the shared Python/JS fixture; then default cutover only after independent profile adjudication and target inventory acceptance.
- Exact head after audit note: `6db40e472d07990e1d85901fc46c15e0d7716ef9`. Exact-head test matrix `40516457748`, system verification `40516457466`, and browser integration `40516458082` were all **QUEUED** when checked; official NIKL source inventory remained **SKIPPED**. No current-head CI pass or local test pass is claimed. Local clean-checkout verification remains blocked by the previously observed DNS failure resolving `github.com`.
- Status: source audit `DONE_VERIFIED`; profile-gated production wiring `TODO`; independent ㅅ/ㅆ and broad/narrow IPA adjudication `BLOCKED`; official NIKL inventory `SKIPPED`; target-inventory review `DEFERRED` pending IPA adjudication; rights clearance `PARTIAL`. PR #339 remains Draft and unmerged. Repository remains research-ready partial prototype, not release-ready.


## Opt-in strict browser IPA gate implementation — 2026-10-27

- Implemented an additive `requireAdjudicatedIpaProfile: true` option in `src/app/engine.js`. Both public browser entry points, `convert()` and `convertSurface()`, now pass their completed result through `ipaTargetForProfile()` when strict mode is explicitly enabled. Invalid non-boolean values throw. The default compatibility path is unchanged; it must still be treated as legacy/research-only because it can return Ukrainian text while the profile is unadjudicated.
- Added browser tests in `tests/ipa-ukrainian-trace.test.mjs` covering both strict entry points, exact unadjudicated-profile rejection, no accepted Ukrainian/candidate output, and invalid option types. These tests are committed at code/test head `9e58098878c3543593c8e5eb88415e1fa0b1be40`; they are **not yet verified by exact-head CI**.
- Detailed source finding and implementation boundary are recorded in `docs/IPA-PRODUCTION-PATH-AUDIT-2026-10-27.md` (updated at `ffc3567c071cc04e7555a9040afe7eb8a88ea118`). The strict browser mode is a migration seam, not exclusive production wiring: Python pipeline parity remains TODO, and default legacy paths remain present. Do not switch the default until a profile is independently adjudicated and allowlisted.
- Latest known code/test head before these doc-only follow-ups: `9e58098878c3543593c8e5eb88415e1fa0b1be40`. Exact-head workflow runs: tests `40516777772`, system verification `40516777768`, and browser integration `40516777624` were **QUEUED** when checked; all other associated research/diagnostic workflows were also queued. No CI pass is claimed. Official NIKL live inventory remains skipped by workflow policy; local tests remain blocked by the previously observed DNS failure resolving `github.com`.
- Updated status: browser strict-gate API + regression tests `PARTIAL` pending CI; shared Python/JS negative fixtures `PARTIAL` pending CI; exclusive production profile-gate wiring `TODO`; independent broad/narrow and ㅅ/ㅆ adjudication `BLOCKED`; NIKL live source inventory `SKIPPED`; target-inventory review `DEFERRED`; rights clearance `PARTIAL`. PR #339 remains Draft/unmerged. Repository remains research-ready partial prototype, not release-ready.


## Cross-runtime strict IPA gate continuation — 2026-10-27

- Added Python parity in `src/korean_ukrainian/pipeline.py`: opt-in `transliterate_korean(..., require_adjudicated_ipa_profile=True)` routes the typed IPA result through `render_profiled_ipa_to_ukrainian()`; invalid non-bool values raise `TypeError`. Default behavior is unchanged. Tests in `tests/test_ipa_target_renderer.py` cover broad unadjudicated profile rejection, narrow partial-profile rejection, and option validation.
- Browser strict mode from the prior batch is tested on both `convert()` and `convertSurface()`; the browser regression now also includes `6·25`, a sourced mixed-script lexical key that exercises the early-return path. The common negative profile fixture is consumed by both Python and JS tests.
- Latest code/test head: `dce303cabdeedebe5508e94ddf5389af36c300a2`. Exact-head tests `40517249803`, system verification `40517249986`, and browser integration `40517249868` remained **QUEUED** when checked. No pass is claimed. Audit doc updated at `b75465152d264f38fa971991344d3799b879b387`.
- Task ledger: opt-in browser gate + regression tests `PARTIAL` pending CI; opt-in Python gate + regression tests `PARTIAL` pending CI; shared negative fixtures `PARTIAL` pending exact-head CI; default exclusive production gate `TODO`; broad/narrow and ㅅ/ㅆ adjudication `BLOCKED`; official NIKL live source inventory `SKIPPED`; target-inventory review `DEFERRED`; source rights `PARTIAL`. Default legacy output remains intentionally compatible but unapproved. PR #339 remains open/Draft; no merge/release.


## Strict IPA gate hardening and exact-head status — 2026-10-27

- Added fail-closed opt-in profile-gated entry points to both runtimes: browser `createEngine().convert()` and `convertSurface()` accept `requireAdjudicatedIpaProfile: true`; Python `transliterate_korean()` accepts `require_adjudicated_ipa_profile=True`. Default compatibility paths are unchanged. Invalid option types are rejected.
- Browser strict mode clears accepted Ukrainian output, candidate output, trace target outputs/mappings/features, and variant Ukrainian spellings, retaining source/IPA traceability. The regression suite includes simple input, surface mode, and the mixed-script lexical key `6·25` to exercise the early return. Python tests cover broad unadjudicated profile, narrow partial profile, and type validation.
- Strict mode preserves the upstream unresolved-pronunciation/diagnostic-only gate before an approved profile could produce a target. Detailed audit: `docs/IPA-PRODUCTION-PATH-AUDIT-2026-10-27.md`.
- Latest code head reviewed: `4456d47393313090cb17115494a6ce85347fa121`. Exact-head tests `40517742289`, system verification `40517742426`, and browser integration `40517742266` were **QUEUED** when checked. No exact-head CI pass is claimed; local tests remain blocked by DNS/network unavailability. NIKL live source inventory remains skipped.
- Status: strict opt-in APIs and tests `PARTIAL` pending exact-head CI; exclusive default production wiring `TODO`; independent broad/narrow and ㅅ/ㅆ adjudication `BLOCKED`; official NIKL inventory `SKIPPED`; Ukrainian target-inventory review `DEFERRED`; source rights `PARTIAL`. Do not make strict mode default until profile adjudication and target review are complete. PR #339 remains Draft and unmerged; no release performed.



## Strict IPA abstention regression — 2026-10-27

- Added a Python regression in commit e12746255f576dd416587ff17cb20f59fc07ecc1: input 앉어라 must remain unresolved when require_adjudicated_ipa_profile=True, with no Ukrainian orthography and reason unresolved_korean_phonology. This ensures the strict profile gate never overrides the upstream phonology abstention.
- Exact-head workflow lookup for that test-only commit returned no associated runs. Prior code-head runs 40517742289 (tests), 40517742426 (system verification), and 40517742266 (browser integration) were still queued at last job inspection. Do not claim tests passed; new regression is PARTIAL until exact-head CI runs.
- Latest branch head after the audit/handoff updates: fbedddecd6bfee1f23d3cdaf40d6e10d291ba1e1. No release or merge. Next step is to obtain an actual exact-head CI result, then fix failures before any further acceptance claims.



## CI status refresh — 2026-10-27

- Refreshed job states for the strict-gate code head 4456d47393313090cb17115494a6ce85347fa121. Browser G2P integration run 40517742266 is now **SUCCESS** for that code head. This predates the additional Python-only unresolved-phonology regression commit e12746255f576dd416587ff17cb20f59fc07ecc1 and does not verify the exact latest branch head.
- Test matrix run 40517742289 remains QUEUED across web, wheel-install, Python 3.11/3.12/3.13, and teacher-corpus-audit. System verification run 40517742426 remains QUEUED for Python regression/data integrity and browser regression/build; official NIKL inventory is SKIPPED. The exact latest branch head e4f682aecab3ae8bbc79ee56fbc7c2118edbe85e returned no associated PR-triggered workflow runs and no combined commit status entries.
- Verification ledger: browser G2P integration on 4456d47 = DONE_VERIFIED for that earlier code snapshot only; current strict-gate tests = PARTIAL; exact-head CI = BLOCKED/WAITING on workflow scheduling. No full suite pass is claimed.



## Final state of this continuation — 2026-10-27

- Latest branch head after acceptance-gate evidence refresh: 4a077abfead6ec418ba41667971215aebbb6929c.
- The only newly completed CI job identified in this continuation is browser G2P integration run 40517742266 on earlier code head 4456d47393313090cb17115494a6ce85347fa121. The current test matrix and system regression/build jobs remain queued; the exact latest branch head has no associated PR-triggered workflow run in the connector result. Do not infer pass from an empty run list.
- The unresolved-phonology strict-mode regression is committed but unverified. This work session's accepted outcome is implementation + audit/handoff updates, not verified release readiness. PR #339 remains open/Draft/unmerged. Next action is exact-head CI verification; if the platform continues to leave jobs queued or not trigger runs, record that as an external CI blocker and continue with locally reproducible checks when network access becomes available.


## Current execution ledger refresh — 2026-10-27

- Current branch head before this ledger refresh: `ff7841d3f49ffbe910ba031647828a34e7ad5baa` (audit now includes live CI status and a task ledger). The most recent relevant CI lookup was associated with prior head `650465730888a1c852f242c41d1c60b1baac3371`; do not carry its status forward as a pass for later documentation commits.
- Runs on that prior head: tests `40520590812` (web, Python 3.11/3.12/3.13, wheel install, teacher-corpus audit all QUEUED); system verification `40520590789` (browser regression/build and Python regression/data integrity QUEUED; official NIKL inventory SKIPPED); browser G2P integration `40520590788` QUEUED; Charsiu rule-review queue `40520590865` QUEUED. Combined status returned no records, which is not a pass.
- Added a live task ledger and exact acceptance conditions to `docs/IPA-PRODUCTION-PATH-AUDIT-2026-10-27.md`. Current classifications: strict cross-runtime opt-in gate PARTIAL; unresolved-phonology regression PARTIAL pending CI; exclusive default-path migration TODO; approved IPA profile BLOCKED on independent adjudication and allowlist evidence; Ukrainian inventory review BLOCKED pending accepted IPA; NIKL source inventory BLOCKED/SKIPPED; rights clearance BLOCKED; release DEFERRED.
- Latest committed unresolved-input regression still requires exact-head CI. Do not change the allowlist or default behavior merely to obtain green tests. The strict allowlist remains empty by design, so globally forcing strict mode would suppress all Ukrainian targets.
- No local tests were run in this environment; the known DNS/network blocker remains. No PR merge, release, force-push, branch deletion, or external setting change was performed. PR #339 remains open/Draft at the last metadata check.
- Next acceptance action: wait for exact-head CI, inspect job-level conclusions, fix actual failures and rerun. If CI stays queued or does not trigger on the new head, classify that as a CI scheduling blocker rather than reporting success. Research and licensing blockers remain independent of CI.


## Final exact-head verification — 2026-10-27

- **Branch:** `research/strict-teacher-guided-rule-mining-2026-10-26`
- **Verified head before this documentation refresh:** `17faadd59c3457ab7bf53ce26a86bba940403235`
- **PR:** [#339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/339), still open and Draft; base `main` at `a452054a669de28426404d1110731715083423bb`; not merged.
- **Core tests:** [run 40521287118](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287118) SUCCESS — wheel install, Python 3.11/3.12/3.13, web tests/build, teacher corpus audit.
- **System regressions:** [run 40521287327](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287327) SUCCESS — browser regression/build and Python regression/data integrity. Official NIKL source inventory sub-job SKIPPED by workflow condition.
- **Other exact-head workflows SUCCESS:** browser G2P [40521287009](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287009), g2pK [40521287258](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287258), Charsiu train/dev [40521287017](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287017), multi-engine IPA [40521287184](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287184), morphology adapter [40521287228](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287228), corpus split audit [40521287330](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287330), master/corpus generation [40521286886](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521286886), scratch teacher [40521287178](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287178), case register [40521287304](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287304), morphology consensus [40521287734](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287734), native-vs-g2pk [40521287673](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287673), UGTPHON [40521287490](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287490), seed portfolio [40521287245](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287245), and additional system verification [40521279934](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521279934).
- **Implementation status:** opt-in fail-closed profile gate in browser and Python, shared negative fixture consumers, target-trace leakage guards, and unresolved-phonology abstention regression are **DONE_VERIFIED** by exact-head CI. The default browser/Python compatibility paths still exist; exclusive default wiring remains **TODO**.
- **Evidence blockers:** independent broad/narrow IPA adjudication and `ㅆ` cross-runtime resolution; non-empty compatible-profile allowlist; Ukrainian target-inventory review; verifiable official NIKL source inventory; teacher/checkpoint rights clearance. These cannot be solved by passing software tests or by promoting model predictions.
- **Commands and environment:** GitHub Actions workflows listed above were inspected via the GitHub API/connector. Local clean checkout/tests were not executed because this container could not resolve `github.com`; no local pass is claimed.
- **Readiness:** research-ready partial prototype, not release-ready. No merge, release, force-push, branch deletion, or external setting change was performed.

### Task ledger

| Task | Status | Acceptance/evidence |
|---|---|---|
| Cross-runtime opt-in IPA-profile gate and shared negative fixture | DONE_VERIFIED | Exact-head Python/web/system CI successful. |
| Preserve unresolved phonology and suppress target leakage in strict mode | DONE_VERIFIED | `앉어라` abstention regression and browser trace/mixed-script cases passed. |
| Core tests and package/web builds | DONE_VERIFIED | Python 3.11/3.12/3.13, wheel-install, web tests/build, browser regression/build, Python data-integrity all passed in CI. |
| Default production-path migration | TODO | Requires accepted IPA profile and safe migration tests; compatibility path remains. |
| Independent broad/narrow IPA profile and `ㅆ` adjudication | BLOCKED | Qualified independent review and auditable evidence needed. |
| Ukrainian target-inventory approval | BLOCKED | Depends on accepted IPA and independent target review. |
| Official NIKL source inventory | BLOCKED | Workflow skipped; supply verified official source evidence. |
| Teacher/checkpoint/data rights | BLOCKED | License and provenance evidence incomplete. |
| Release | DEFERRED | Do not release until the evidence and rights gates clear. |

# Latest continuation — stale source-register test expectations repaired (2026-10-27)

- **Starting branch/head:** `research/strict-teacher-guided-rule-mining-2026-10-26`, prior head `23058c5a304e28a1493aa429f011c265e9ee5f1c`.
- **Change:** commit [ca7c8096e6fc6697a29a14f476e9b8b4bfb14b40](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/ca7c8096e6fc6697a29a14f476e9b8b4bfb14b40) updates `tests/source-register-rights-audit.test.mjs` from 120 to 124 source-register rows and from 116 to 120 `REVIEW_REQUIRED` rows. The current CSV has 124 rows; the old assertions caused two failures in both browser and system test runs [40561431726](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40561431726) and [40561431433](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40561431433). The correction is a test expectation repair, **not an engine-accuracy improvement**.
- **Verification state:** exact-commit workflows triggered for `ca7c8096e6fc6697a29a14f476e9b8b4bfb14b40`; at handoff update, system verification [40566064559](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566064559), core tests [40566064795](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566064795), browser G2P [40566064534](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566064534), and several diagnostic workflows were queued or in progress. Do not mark this correction DONE_VERIFIED until exact-head checks complete.
- **Preserved real engine changes already on this branch:** source-backed R010 exact-form additions and R016 `맑게 → 말께`, `맑고 → 말꼬` exist in Python/browser logic with negative controls. They are sourced deterministic coverage repairs, not claimed neural discoveries. The Charsiu-guided [ɲ] change is restricted to an opt-in Python narrow IPA research profile; it remains target-incompatible and is not a production Ukrainian-output rule.
- **Neural-to-deterministic acceptance remains PARTIAL:** the current evidence identifies recurrent differences, but corpus IPA conventions and Charsiu training overlap/rights remain unresolved. No new generalized production phonology rule has been independently established from teacher output in this batch. Do not promote teacher strings or broaden the narrow profile to make benchmark scores look better.
- **Next execution:** wait for exact-head CI on the test correction; then inspect fresh paired dev artifacts and adjudicate one high-frequency error family against the ClippyFirst broad-IPA convention and primary phonology sources. Any candidate must have positive and negative controls and show before/after metrics on an eligible development split. Benchmark test/holdout partitions remain sealed. Keep PR #339 draft until exact-head checks and evidence gates pass.


## Exact-head verification and decision checkpoint — 2026-10-27 19:20 UTC

### Repository state verified during continuation

- Default branch: `main`, starting commit `a452054a669de28426404d1110731715083423bb` (2026-10-25; “docs: remove residual audit timestamp placeholder”).
- Existing work branch: `research/strict-teacher-guided-rule-mining-2026-10-26`; PR #339 remains open and draft, base SHA `a452054a669de28426404d1110731715083423bb`.
- Verified branch head at this checkpoint: `03b11167842f30ba241c07ceb3597ac4cb3abab7`. It is 746 commits ahead of `main`, 0 behind; the diff touches 142 files. Do not merge the branch wholesale based on CI alone.
- Local clean checkout and local test execution remain BLOCKED: the environment cannot resolve `github.com` (git clone failed with DNS resolution error). Source inspection and CI checks below were performed through GitHub.

### Exact-head Actions evidence

All listed runs report conclusion `success` for the exact head `03b11167842f30ba241c07ceb3597ac4cb3abab7`:

- [Core tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333765)
- [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333499)
- [Browser G2P integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333397)
- [Charsiu train/dev IPA rule-review queue](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333859), artifact `12762619456` (SHA-256 `af307209d6844cc8f41d94d892c7d322ce9787615c8c11d91c1aeb18b55d887a`)
- [Scratch neural-teacher portfolio](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333747)
- [Multi-engine Korean IPA diagnostic benchmark](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333619)
- [External UGTPHON diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333592)
- [Morphology-consensus IPA diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333672)
- [Teacher corpus split audit](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333728)
- [Research morphology adapter smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333472)
- [Master tables and research corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333437)
- [Test-case register extraction](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333935)
- [Paired native engine vs g2pk diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333715)
- [Train scratch Korean G2P teacher](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40566333546)

Earlier failures on code head `49115cf4c8d69b98292eb7f524253fbf97022c41` are superseded only for the tested later head above; do not erase them from historical evidence. A passing exact-head CI verifies the workflow commands, not the scientific validity of a phonological hypothesis.

### Neural-to-rule decision: do not promote broad-IPA rules yet

- The existing dev audit reports repeated Charsiu/Strict differences for aspiration, lateral symbols, /h/ variants, and sibilants. These counts use a diagnostic normalizer and corpora with unresolved convention mapping; they are not proof that Strict is wrong.
- The scoped onset /n/ → [ɲ] before glide-initial nuclei remains an **opt-in narrow-IPA research-profile** change. Its dev counterfactual is encouraging but was performed on the teacher-selection/dev data, lacks an independently adjudicated ClippyFirst broad-IPA target, and is not a production Ukrainian-output rule. Do not copy it into broad IPA.
- The source-backed R010/R016 exact-form repairs, including `맑게 → 말께` and `맑고 → 말꼬`, are real deterministic runtime changes on this branch with negative controls. They are not established neural discoveries; keep their evidence and attribution separate.
- Current defensible count for new generalized production phonology rules independently established specifically from neural-teacher output in this cycle: **0**. This is an evidence-gated result, not a claim that no missing rules exist.
- IPA-first review also identified a browser-path risk: default legacy browser conversion can return Ukrainian text under an unadjudicated profile label unless the explicit profile-gated option is enabled. The opt-in guard is a migration seam only; do not claim the default browser route is profile-approved. Python/browser behavior and target adapter approval still require a dedicated parity/migration acceptance decision.

### Ledger update

| Item | Status | Acceptance criterion / next action |
|---|---|---|
| Current branch CI | DONE_VERIFIED for head `03b11167842f30ba241c07ceb3597ac4cb3abab7` | All exact-head workflows listed above are green. Any new commit needs its own relevant CI. |
| Source-backed R010/R016 exact-form runtime coverage | PARTIAL pending final merge/release gates | Preserve exact-form scope, source links, Python/JS parity, and positive/negative tests; do not misattribute to neural discovery. |
| Narrow /n/→[ɲ] candidate | PARTIAL, research-only | Requires independent phonetic adjudication and a post-change, same-input evaluation with a reviewed target convention before any promotion. |
| Teacher disagreements → generalized production rules | BLOCKED / evidence-limited | First complete independent IPA convention mapping and case-level adjudication; verify each context against primary sources and negative controls; evaluate on eligible dev data only. |
| Browser/Python profile-gated IPA-first target path | PARTIAL | Prove that accepted Ukrainian output cannot bypass the reviewed profile gate, including lexical/mixed-script and word-alignment paths, while preserving a deliberate compatibility mode. |
| Local tests | BLOCKED | DNS/network unavailable in this environment; CI is the only executed test evidence for the exact SHA above. |
| Release readiness | NOT READY | PR remains draft; source/weights rights, IPA convention mapping, target-inventory review, default browser gating, and independently adjudicated rule gains remain open. |

Next work should inspect the downloaded Charsiu rule-review artifact at case level, select a repeated candidate only if its exact context survives convention adjudication, and either implement a narrowly scoped rule with paired controls and before/after dev metrics or record a reasoned rejection. Keep test/holdout partitions sealed. No release or merge is authorized by this checkpoint.


### Charsiu artifact inspection — exact run 40566333859

Artifact `12762619456` was downloaded and its JSON reports and paired JSONL files inspected. Artifact SHA-256 matches the Actions metadata: `af307209d6844cc8f41d94d892c7d322ce9787615c8c11d91c1aeb18b55d887a`.

| Dev corpus / profile | Exact match | CER | Coverage | Unresolved/abstained |
|---|---:|---:|---:|---:|
| SIGMORPHON reference, native broad | 332/999 = 33.23% | 15.4736% | 999/1,000 = 99.9% | 1 |
| SIGMORPHON reference, research narrow | 448/999 = 44.84% | 11.0870% | 99.9% | 1 |
| UGTPHON reference, native broad | 977/1,800 = 54.28% | 9.6086% | 1,800/1,834 = 98.15% | 34 |
| UGTPHON reference, research narrow | 1,226/1,800 = 68.11% | 6.0346% | 98.15% | 34 |

The narrow-minus-broad deltas are +11.61 percentage points exact / −4.3866 percentage points CER on SIGMORPHON and +13.83 points exact / −3.5740 points CER on UGTPHON, with unchanged coverage. These are same-input *profile-sensitivity diagnostics*, not proof of production improvement: the narrow profile includes the research-only sibilant and nasal-glide mappings; target IPA conventions are still unreviewed against ClippyFirst broad IPA; Charsiu weight licensing is unresolved and training overlap is unknown. The artifact explicitly marks every paired case `DIAGNOSTIC_ONLY_IPA_CONVENTION_UNREVIEWED` and `production_rule_promotion=false`.

The teacher's own dev scores are 676/1,000 (67.60%, CER 5.6465%) for SIGMORPHON and 1,670/1,834 (91.06%, CER 2.3502%) for UGTPHON. Do not interpret the teacher/Strict gap as a comparable accuracy gap until the target conventions and evaluation independence are resolved. The 34 UGTPHON abstentions are coverage limitations, not automatically pronunciation errors.

### Candidate-cluster decision from the artifact

- **Repeated vowel diacritics / syllable separators:** reject as a phonological-rule candidate. The reference formats differ in token separators and vowel detail; normalization choices affect string metrics but do not license phonological rewrites.
- **Coda lateral `l` vs `ɭ`:** evidence-limited convention/allophony candidate, not production-promotable from this artifact. Need a declared broad-vs-narrow policy and independent phonetic adjudication before changing the coda renderer.
- **Aspiration, `h`/`ɦ`, and sibilant differences:** retain as separate context-sensitive hypotheses; do not collapse into a global symbol substitution. A teacher's exact prediction is not an independent gold label, and Charsiu training exposure is unknown.
- **Onset `n` → `ɲ` before glide-initial nuclei:** keep only in the existing narrow research profile. The dev counterfactual supports investigating its narrowly stated environment, but it does not justify broad-IPA or Ukrainian-target promotion.
- **Production decision:** no generalized production rule was promoted from this artifact. This is the correct evidence-gated decision given the available evidence, not a failed attempt to improve scores.

No source data or model weights were added to runtime; raw predictions remain research artifacts. The artifact was inspected with Python's standard `zipfile`/JSON readers; repository tests were not run locally because the checkout/network blocker remains.


## Follow-up implementation batch — narrow nasal/glide scope tests (2026-10-27)

### Actual code change

- Added regression coverage in `tests/test_ipa.py` for the existing teacher-guided, opt-in narrow profile's onset ㄴ → [ɲ] mapping before ㅑ/ㅒ/ㅕ/ㅖ/ㅛ/ㅠ.
- Positive examples cover `냐`, `녀`, `녜`, `뇨`, and `뉴`; a no-onset control `얘` confirms that the mapping does not synthesize ㄴ.
- Negative controls retain `니 → ni` and `난 → nan`; broad and phonemic output for `냐` must remain `nja`. This protects the non-production boundary and prevents the research allophone from leaking into default IPA.
- Test source commit: `d42397801e317038449f059bd498c51ef95e708a`. The initial test expectations were corrected against the actual `VOWEL_IPA` table before the final test commit; the current head contains only the corrected expectations.

### Evidence interpretation remains deliberately narrow

The source check was strengthened with the KCI record for Mee-Jin Ahn (2009), *Korean /n/-deletion: phonetic initial strengthening to denasalization*, DOI 10.17959/sppm.2009.15.1.53, and the UCL thesis literature review that summarizes Korean /n/ as [nʲ]/[ɲ] before /i,j/. Ahn's abstract specifically discusses a word-initial strengthening/deletion pathway and does **not** justify categorical [ɲ] for every onset /n/ in every word. The UCL thesis is a secondary synthesis, not a normative pronunciation standard. Therefore:
- the rule remains only a partial, opt-in narrow research profile;
- it is not promoted into broad IPA, browser JavaScript, or Ukrainian target adaptation;
- word-initial /n/-deletion and lexical/morphological variability remain open review questions;
- the positive examples are implementation-scope tests, not independent phonetic gold labels.

Sources: https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001340886 and https://discovery.ucl.ac.uk/1324541/1/1324541.pdf . Existing source-register entries `SRC-AHN-2009-N-DELETION` and `SRC-UCL-KOREAN-PHONETICS-THESIS` were reused; no duplicate source rows were added.

### Verification status

GitHub Actions started for the test commit `d42397801e317038449f059bd498c51ef95e708a`, including [the full test workflow](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40569603269), [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40569603362), and [browser integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40569603677). At the time this handoff entry was written, these runs were queued; Charsiu rule-review and multi-engine diagnostics were in progress. No pass is claimed until the exact-head results are read.

### Ledger

| Item | Status | Acceptance |
|---|---|---|
| Narrow nasal-glide rule test coverage | PARTIAL pending exact-head CI | Full Python suite passes; broad/phonemic negative controls and profile metadata remain green |
| Generalized production promotion from neural teacher | BLOCKED / evidence-limited | Independent case-level adjudication, source/environment limits, paired negative controls, and same-input eligible dev evaluation |
| Word-initial /n/ variability in narrow IPA | TODO | Decide whether the profile should preserve [n], emit [ɲ], model uncertainty, or abstain for word-initial cases based on lexical/morphological and phonetic evidence |


## Candidate-cluster counterfactual and regression-gate update — 2026-10-27

A second cluster was tested from the saved Charsiu dev pair artifact instead of being promoted from a high-frequency edit list.

- Candidate `NT-CODA-N-PALATAL-AFFRICATE-2026-10-27`: coda `n` immediately before a following palatal affricate, simulated as `n → ɲ` in narrow IPA.
- Exact same-input counterfactual, repository diagnostic normalizer:
  - SIGMORPHON dev: 448/999 → 465/999 exact (+1.70 pp), CER 11.0870% → 10.7978%, 17 exact fixes / 0 exact regressions.
  - UGTPHON dev: 1,226/1,800 → 1,182/1,800 exact (−2.44 pp), CER 6.0346% → 6.4530%, 0 exact fixes / 44 exact regressions.
  - Coverage and abstentions did not change (SIGMORPHON 999/1,000; UGTPHON 1,800/1,834).
- **Decision: reject production promotion.** Opposite corpus effects indicate the source IPA conventions are not interchangeable for this correspondence. No runtime code changed for this candidate. The case-level audit and canonical candidate register were updated in place.
- This is a measured rejection, not a claim that [ɲ] is never a valid realization. Reopening requires source-blind case adjudication under one declared IPA profile and a context-sensitive review of positive and negative environments.

### Test hardening in this continuation

- `tests/test_ipa.py`: added positive examples for the existing opt-in onset ㄴ + glide → [ɲ] narrow-profile mapping, plus no-onset, /i/, non-glide, broad, and phonemic negative controls.
- `tests/test_pipeline.py`: added a fail-closed check proving the narrow research IPA profile does not produce accepted Ukrainian orthography.
- The first CI run at `a948418086c6a6cc2245ff5418911681a0c60b0b` failed in the new test because expected strings incorrectly omitted the IPA glide in ㅑ/ㅕ/ㅖ/ㅠ. The failure was inspected from the exact GitHub Actions log and the expectations were corrected against the repository's actual `VOWEL_IPA` table in subsequent commits. The failure is retained as historical evidence; it must not be described as a passing test.
- Corrected test source commit: `d42397801e317038449f059bd498c51ef95e708a`; subsequent pipeline safety test commit: `94fcdb834d7706cc6b0bc39078d9b49340723a44`.
- The current branch then received documentation-only commits for the measured candidate decision. Exact-head tests/system verification remain pending in Actions as of this entry; do not mark this test batch `DONE_VERIFIED` until their final conclusions are fetched.

### Current status refinement

| Item | Status | Decision |
|---|---|---|
| Existing onset ㄴ + selected glide → [ɲ] narrow profile | PARTIAL | Rule exists; new tests encode its intended scope; source limitations and lexical/word-initial variation remain. No broad IPA or target promotion. |
| Coda /n/ → [ɲ] before palatal affricate | BLOCKED / EVIDENCE-LIMITED | Cross-corpus dev results conflict; no runtime implementation. |
| Narrow IPA target leakage guard | PARTIAL pending exact-head CI | New pipeline test asserts narrow IPA remains target-incompatible and accepted Ukrainian output is withheld. |
| General neural-teacher-to-production rule promotion | BLOCKED / EVIDENCE-LIMITED | No new generalized production rule passes independent IPA convention adjudication in this cycle. |


## Follow-up candidate implemented in research profile v3 — /h/ after sonorants (2026-10-27)

A source-supported, tightly scoped candidate was selected after a second controlled counterfactual:
- Kang & Lee (2019), DOI 10.17290/jlsk.2019..84.175, and Eom (2014), DOI 10.17959/sppm.2014.20.3.357, describe variable /h/ voicing/weakening/deletion after sonorants. They do not support a categorical all-speaker rule.
- On saved dev outputs, replacing same-word coda-sonorant + onset /h/ with [ɦ] improved both convention-specific diagnostics: SIGMORPHON 448/999 → 466/999 exact and CER 11.0870% → 10.5929%; UGTPHON 1,226/1,800 → 1,265/1,800 exact and CER 6.0346% → 5.5950%. The simulation changed 61 and 99 rows respectively, with 18/0 and 39/0 exact fixes/regressions. These remain counterfactual dev metrics, not post-change runtime results.
- Implemented in Python narrow IPA only: onset ㅎ after same-word coda ㄴ/ㄹ/ㅁ/ㅇ emits one [ɦ] candidate realization. Broad and phonemic output remain unchanged; no word-boundary crossing; no deletion inference; no JS or Ukrainian target changes.
- Profile version bumped to `korean-narrow-partial-sibilant-nasal-h-v3` / version 3 and remains `partial-research-only`, `target_compatible=false`.
- Regression tests added for positives `감히`, `간호원`, `영화`, negatives `아하` and `감 하`, broad/phonemic stability, and target-adapter fail-closed behavior.
- Source register updated with `SRC-KANG-LEE-2019-H-REALIZATIONS` and `SRC-EOM-2014-H-SONORANT`.

**Current status: PARTIAL.** A new same-input Charsiu dev run and exact-head Python/system/browser checks are pending; the narrow profile must remain research-only regardless of development scores. The previous CI failure for the first draft of nasal-glide tests was corrected in later commits; the new h-profile tests have not yet been marked passed. The coda /n/→[ɲ] candidate remains rejected for production due to opposite SIGMORPHON/UGTPHON effects.


## Latest continuation checkpoint — actual runtime benchmark and failed exact-head CI (2026-10-27)

- Current implementation/test-fix commit at checkpoint: `9807deacd0b9887a31cff3a73084010af38b13eb`; branch remains `research/strict-teacher-guided-rule-mining-2026-10-26`. Subsequent audit-document update: `8fbd6f8f6bdc6b4c9b344d4cf0ae9ed6d661f129`.
- Actual post-change Charsiu workflow `40571047706` succeeded and uploaded artifact `12765811211` (SHA-256 `1b31b4e85315e44c423b18588e573688e17c2141cca3b9fb31bbf08fac8373f8`). SIGMORPHON dev: broad 332/999 exact, CER 15.4736%; narrow v3 466/999, CER 10.5929%. UGTPHON dev: broad 977/1800, CER 9.6086%; narrow v3 1265/1800, CER 5.5950%. Coverage/abstentions unchanged within each corpus (999/1000; 1800/1834). The benchmark enforces dev-only use and reports unreviewed IPA conventions; do not interpret as target-compatible accuracy or independent evaluation.
- Multi-engine IPA diagnostic workflow `40571047839` also completed successfully and uploaded artifact `12764769798`; this is a diagnostic benchmark, not phonetic adjudication.
- Exact-head workflows on `45f6312bba2f5c55df5987019db952ab208109e6` revealed two stale expectations in `tests/test_narrow_ipa.py` (profile v2 and old realization-status label). Fixed those assertions in `9807deacd0b9887a31cff3a73084010af38b13eb`. Python 3.13, system verification Python/browser, and browser G2P test jobs failed on these same two stale assertions; many other browser subtests passed (1266 passed, 2 failed in the browser test job). A new successful CI run on the fix commit has not yet been confirmed.
- Scratch-teacher seed portfolio `40571047715`, teacher corpus audit `40571047683`, multi-engine diagnostic `40571047839`, and Charsiu run `40571047706` completed successfully. Teacher training `40571047884` completed successfully, but training success alone is not rule evidence or release validation.
- **Status remains PARTIAL** until a fresh exact-head run passes Python 3.11/3.12/3.13, wheel-install, teacher corpus audit, browser tests/build, and system verification. Then inspect post-fix Charsiu artifact/provenance and cross-runtime behavior. Narrow v3 remains research-only and target-incompatible; broad IPA and Ukrainian target mappings were not promoted. Coda /n/ before a palatal affricate remains rejected due to opposite corpus effects.


### Follow-up CI finding and repair — source register count guards

The first CI run after the IPA-profile assertion repair (`9807deacd0b9887a31cff3a73084010af38b13eb`) verified Python 3.11, 3.12, and 3.13 test jobs PASS; the clean wheel build/install PASS; and teacher-corpus audit PASS. Browser/npm tests still failed in two source-register rights-audit assertions because the two new peer-reviewed source rows raised the registry count from 124 to 126. Updated `tests/source-register-rights-audit.test.mjs` to expect 126 rows and 122 REVIEW_REQUIRED rows in commit `da85537a3e7857cae7301b0131a5c385f53c5730`. The same count failure affected browser/system workflows. **This second repair still needs a fresh exact-head npm/browser/system run**; do not infer success from the earlier Python passes. This is a test expectation correction for the intentionally expanded source register, not a relaxation of rights review: unresolved rights remain a hard block.


## Exact-head verification completed — 2026-10-27

### CI and implementation verification

The fresh PR validation after the source-register count-guard repair has completed successfully. The workflows checked out the PR merge ref `8a42c3c9c762be421d71abf48256aa03a430aa13`, which merges PR-head commit `97f3784e669ef24df831a57b3ea2307b4c68e899` into base `a452054a669de28426404d1110731715083423bb`.

- System verification workflow `40574521179`: Python regression/data integrity **PASS**; browser regression tests and build **PASS**.
- Test workflow `40574521301`: Python 3.11 **PASS**; Python 3.12 **PASS**; Python 3.13 **PASS**; clean wheel build/install **PASS**; teacher-corpus split audit **PASS**; web/npm checks **PASS**.
- Optional g2pK integration `40574521197`: Python 3.11 and 3.12 **PASS**.
- Browser G2P integration `40574521257`: **PASS**.
- Charsiu research-only train/dev comparison `40574521095`: **PASS**, including split guards, provenance assertions, no test-split serialization, and no automatic rule promotion.
- Korean morphology-consensus IPA diagnostic `40574521198`: **PASS**.
- Multi-engine IPA diagnostic `40574520978`: **PASS**.
- External UGTPHON diagnostic `40574521003`: **PASS**.
- Paired native-vs-g2pK diagnostic `40574521028`: **PASS**.
- Research morphology adapter smoke `40574521129`: Kiwi and MeCab-Ko real-engine smoke tests, native strict/soft IPA checks, and boundary-agreement check **PASS**.
- Scratch-teacher seed portfolio `40574521109`: **PASS**.
- Exhaustive test-case register extraction `40574521154`: **PASS**.

The stale source-register count expectations are now verified by the passing web/browser gates. The expected row counts were corrected to reflect the two added source records; unresolved licensing classifications remain unresolved and the rights gate was not weakened.

### Fresh actual-runtime research benchmark

Workflow `40574521095` uploaded artifact `12766869026`, SHA-256 `81e394b52248e7a2594bf5e4cad0c48c74914a93398c71e8ff92e74c050c80da`. Pinned Charsiu model revision: `ed5cf99707fb39f5f3ccc461530d56b6fb531fd3`; tokenizer revision: `68377bdc18a2ffec8a0533fef03b1c513a4dd49d`. Only development splits were serialized; test records were not exported.

- SIGMORPHON dev: native broad renderer 332/999 exact (33.23%), CER 15.4736%; narrow research v3 466/999 (46.65%), CER 10.5929%; narrow-minus-broad +13.41 percentage points exact, CER −4.8807 pp; 1 unresolved in 1,000 eligible.
- UGTPHON dev: native broad renderer 977/1,800 exact (54.28%), CER 9.6086%; narrow research v3 1,265/1,800 (70.28%), CER 5.5950%; narrow-minus-broad +16.00 percentage points exact, CER −4.0136 pp; 34 unresolved/excluded among 1,834 eligible.

Interpretation remains strictly diagnostic: the two reference IPA conventions have not been independently adjudicated into a common profile. These results measure sensitivity to ClippyFirst's broad vs. narrow IPA rendering against the pinned corpora; they are not proof of universal Korean phonetic accuracy, target-compatible Ukrainian output, or independent gold-label accuracy. Charsiu's licensing/weight-use terms and possible training overlap remain review items. The neural teacher's higher match scores likewise do not authorize automatic rule promotion.

### Updated task ledger

| Task | Status | Evidence / remaining acceptance |
|---|---|---|
| Python/browser/system regression after the two test repairs | DONE_VERIFIED | PR merge-ref workflows above all pass, including three Python versions, wheel install, browser tests/build, and web/npm checks |
| Research-only v3 runtime benchmark and provenance/split guards | DONE_VERIFIED for execution and artifact integrity | Run `40574521095`, artifact `12766869026`; phonetic interpretation and target compatibility remain unverified |
| Narrow /h/ after same-word sonorant coda | PARTIAL / research-only | Code and regression tests verified; optionality, speaker/dialect variation, case-level IPA adjudication, and target adaptation remain unresolved |
| Coda /n/ → [ɲ] before a palatal affricate | BLOCKED / EVIDENCE-LIMITED | Opposite cross-corpus effects; no runtime promotion |
| IPA convention reconciliation across corpora and runtimes | TODO / BLOCKED by expert evidence | Independently adjudicate a source-blind sample under one declared profile; preserve disagreements and provenance |
| Charsiu licensing and training-overlap review | BLOCKED | Confirm model/tokenizer terms and training-data overlap before redistributing or treating outputs as independent evidence |
| Ukrainian adaptation for experimental narrow IPA | DEFERRED until IPA is adjudicated | Must consume typed IPA and remain fail-closed for unsupported/unreviewed forms |
| Release readiness | NOT READY | CI is green, but linguistic adjudication, source rights, target adaptation, and broader independent evaluation are outstanding |

### Current disposition

The implementation and CI repair batch is now **DONE_VERIFIED** for the tested PR merge ref. The project overall remains a **research prototype / partial**, not release-ready. Keep the v3 narrow profile opt-in, research-only, and target-incompatible; do not promote corpus-sensitive outputs to broad IPA or Ukrainian orthography. PR #339 remains open, draft, and unmerged; no merge or release was performed by this continuation.


## Case-level audit of fresh Charsiu artifact — 2026-10-27

Inspected both pair-level JSONL files inside artifact `12766869026` directly after download. The profile outputs differ from broad output on 326/1,000 SIGMORPHON dev rows and 472/1,834 UGTPHON dev rows. Among changed scored rows, the declared diagnostic edit distance improved on 302 and was unchanged on 24 for SIGMORPHON; it improved on 435 and was unchanged on 37 for UGTPHON. There were zero rows where the narrow output had a greater stored edit distance than broad, and zero broad-exact → narrow-nonexact cases on either set. This is an artifact-level descriptive audit, not proof of generalization: the candidate rule was chosen after counterfactual analysis of these same dev corpora, so these rows are selection-contaminated and must not be called an independent holdout. No test split was exported or evaluated. The next meaningful accuracy gate is source-blind case adjudication and an untouched, eligible evaluation set under a declared common IPA convention; rights and target-compatibility gates also remain open.


## One-pass continuation reconciliation — 2026-10-27 (latest exact-head verification)

### Exact current state

- Branch: `research/strict-teacher-guided-rule-mining-2026-10-26`.
- Starting PR head before this reconciliation: `0702e1c4778725b605ef432f038313af86b6b764`.
- PR #339 remains open, draft, and unmerged. The PR is not release-ready merely because CI is green.
- Latest PR-triggered checks for the exact starting head `0702e1c4778725b605ef432f038313af86b6b764` completed successfully: system verification `40576910940`; test matrix `40576910855`; browser integration `40576910678`; teacher-corpus split audit `40576910707`; Charsiu dev-only rule-review `40576910747` (see distinct run ID in workflow list if duplicated by connector); neural teacher seed portfolio `40576910768`; morphology-consensus `40576910938`; research morphology smoke `40576910725`; multi-engine benchmark `40576910776`; UGTPHON `40576910741`; native-vs-g2pK `40576911061`; exhaustive test-case register `40576910875`; master-table/research artifacts `40576910699`; optional g2pK integration `40576910764`. All listed runs reported completed/success in GitHub Actions. These are implementation, integrity, and diagnostic checks, not independent IPA or Ukrainian-target accuracy certification.

### Open-PR reconciliation (reviewed; no blind port/merge)

- **PR #341** (`fix/r002-source-backed-substantive-liaison-2026-10-26`, head `0f2177e60053fe85a5162229f6c0fd67561e817e`): source-backed exact-form rules for formal/substantive liaison and selected ㄺ+ㄱ verbal forms. Its eight relevant verification workflows completed successfully on that head. It overlaps this PR in `src/korean_ukrainian/rules.py`, browser rule modules, tests, the benchmark register, and the master handoff. Keep it separate until the owner/reviewer resolves the overlapping code and both PRs' combined behavior is verified; do not copy the same licenses into this branch or treat a separate PR's CI as proof for a combined tree.
- **PR #338** (`research/neural-korean-g2p-v3-2026-10-26`, head `691a8ab77c7c6c24137fa9c2a11100de05386536`): neural G2P research harness and contextual evaluator. It remains research-only; authentic NN-KoG2P inference and licensing/training-overlap questions remain blocked. No model outputs are promoted into runtime rules.
- **PR #329** (`fix/ipa-review-source-blinding-20261025`, head `636dac36c27e4d72b13dc37f9698ad90bfb24b96`): source-blind IPA review packets. Keep the review-packet work distinct; no qualified independent submissions are present, so do not manufacture adjudications.
- **PR #326** (`research/benchmark-profile-sensitivity-and-ipa-holdout-2026-10-25`, head `ffa2d993b89e29ef5d43b2059d8aff0269b4f391`): diverged/non-mergeable research branch with frozen 24-form holdout infrastructure but no IPA gold annotations. Do not merge its broad runtime diff. Reconcile only after a fresh base comparison and explicit selection of non-conflicting research artifacts.
- PRs #336 and #327 contain residual-case and NIKL crawl-blocker work; their documented blockers remain evidence-gated. The official NIKL inventory request previously returned HTTP 403; a skipped conditional job is not a successful crawl.

### Current task ledger

- `DONE_VERIFIED`: exact-head Python/browser/system/diagnostic workflows for PR #339's current starting head, including wheel install, corpus split guards, provenance assertions, and no automatic rule promotion.
- `PARTIAL`: opt-in narrow IPA profile v3 and deterministic candidate mining; these are research-only and not target-compatible.
- `PARTIAL`: source-backed rule coverage in PR #341 is separately implemented and tested, but not integrated into this branch or the default branch; overlapping diffs require coordinated review.
- `BLOCKED`: independent, source-blind IPA adjudication under a declared common convention; qualified reviewer submissions are not available in the repository.
- `BLOCKED`: an untouched eligible evaluation set for candidate selection; current dev comparisons are selection-contaminated.
- `BLOCKED`: Charsiu model/tokenizer license review and possible training-data overlap; do not redistribute model/data or claim independence before review.
- `BLOCKED`: remaining KOGL/source-rights classifications and the official NIKL inventory crawl after HTTP 403.
- `DEFERRED`: Ukrainian adaptation of experimental narrow IPA until the upstream surface/IPA representation is independently adjudicated and target feature losses are explicitly accepted.

### Release decision

The work materially improves reproducibility, exact-form Korean rule coverage across separate PRs, IPA-profile metadata/gating, research provenance, and regression protection. It does **not** establish a validated end-to-end Korean→IPA→Ukrainian engine. Keep PR #339 draft/open; do not merge, publish, or mark release-ready. The next real acceptance evidence is independent blinded IPA annotation plus an untouched evaluation protocol, followed by a reviewed typed IPA-to-Ukrainian adapter and source-rights closure.


# Continuation checkpoint — repository/PR state recheck (2026-10-27)

## Evidence obtained in this pass

- Read the current public `main` README and the existing handoff, completion audit, source register, Python IPA generator and IPA-to-Ukrainian renderer through GitHub repository-content API. This was remote source inspection; no local clone or local test command was available/executed in this pass.
- The repository's public `main` README explicitly documents the intended browser and native path as Korean surface pronunciation → project IPA → IPA-to-Ukrainian mapping, and states that the target renderer consumes IPA only. It also states that target choices remain provisional and that browser JS G2P is not fully equivalent to Python g2pK's MeCab-based morphological analysis.
- The current research branch's `src/korean_ukrainian/ipa.py` contains both the narrow onset /n/ → [ɲ] before selected glide nuclei and the same-word sonorant-coda /h/ → [ɦ] candidate. These remain opt-in narrow-profile behavior; broad IPA and the renderer should not be inferred to be independently validated by their presence.
- The requested path `docs/KOREAN-IPA-RUNTIME-PROFILE-CONTRACT-2026-10-27.md` was not found at that exact path on the inspected refs. Treat the contract as **BLOCKED / path-or-branch reconciliation required**, not as verified current documentation. The candidate register path named in the continuation prompt was likewise not found on the inspected branch; the strict-disagreement audit did exist. Locate the canonical paths before claiming those documents were updated.
- PR #339 is open and draft; its description reports successful code/test workflows on code head `0702e1c4778725b605ef432f038313af86b6b764`, but the description also records a Charsiu model-download HTTP 429 failure on a later documentation head and a still-running seed portfolio. Do not treat all research workflows as green on the newest head.
- PR #341 is open and overlaps the rule modules, tests and handoff. Its documented implementation includes exact-form R002 liaison and R016 ㄺ+ㄱ licenses, with separate successful checks on its own head. It has **not** been merged or tested as a combined tree with #339 in this pass; do not cherry-pick or merge it blindly.
- PR #338 remains research-only; authentic NN-KoG2P inference, license terms and model availability are not established. PR #329 supplies blinded packet infrastructure but not independent annotations. PR #326 remains a non-gold holdout/profile-sensitivity effort; PR #336 still has unresolved evidence cases; PR #327 records the NIKL HTTP 403 blocker. No reviewer submissions were present in the inspected recruitment issue #337.
- The source register records the official NIKL direct collector's HTTP 403 and explicitly says that no valid crawl manifest was emitted. This remains a real external-access/rights evidence blocker; a skipped workflow step is not a pass.

## Task ledger after recheck

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Preserve IPA-first target renderer | PARTIAL | Current source code and README support the boundary; require current-head end-to-end test proving target renderer consumes IPA only and an IPA mutation changes target output where expected. |
| Narrow IPA /h/ and nasal-glide candidates | PARTIAL | Present in research branch source, but dev selection contamination and no independent IPA adjudication prevent promotion; retain opt-in research-only scope. |
| Reconcile #339 and #341 | TODO | Compare exact latest head SHAs and shared-file diffs, combine only source-backed non-conflicting changes, then run the full suite on the combined tree. This pass did not establish a combined tree. |
| Independent IPA gold/review | BLOCKED | Need two qualified independent source-blind broad-IPA submissions under one declared convention, queue fingerprint validation and reconciliation. No submission may be fabricated. |
| Independent Ukrainian target gold | BLOCKED | Need a separately reviewed target policy and gold set after IPA is frozen. |
| Charsiu benchmark on latest code | BLOCKED | Earlier artifact is diagnostic/dev-only; the latest reported download returned HTTP 429. Retry pinned model retrieval and compare artifact hashes before inference; document model/tokenizer licenses and training overlap. |
| Official NIKL source inventory and item-level rights | BLOCKED | Direct access returned HTTP 403 and no manifest exists. Import only an authorized local official copy with provenance/version and item-level rights checks; do not bypass access controls. |
| Runtime-profile contract and candidate register canonical paths | TODO | Locate the actual current paths or create only if absent after repository tree search; synchronize IDs, versions, scope, tests and target-compatibility gate. |
| Exact-head local verification | BLOCKED | No local checkout/runtime was available in this pass. Required acceptance: run documented Python, Node/browser, build, generation/drift, wheel-install and benchmark workflows against the final code SHA, recording skipped jobs separately. |

## Integrity note

This checkpoint is a remote source/metadata inspection, not an implementation test run or independent linguistic evaluation. No accuracy claim is upgraded. The repository remains a **PARTIAL research prototype, not release-ready** until the IPA and Ukrainian target evidence gates are satisfied. The latest exact branch HEAD and exact final CI state must be read from GitHub branch/Actions metadata at the next execution; the content API response supplies blob hashes, not the branch commit SHA.


# Execution continuation — final evidence boundary (2026-10-27)

## This pass's exact actions and results

- **Remote inspection:** GitHub content API read the public main README, current research-branch handoff/audit, research/SOURCE-REGISTER.csv, src/korean_ukrainian/ipa.py, and src/korean_ukrainian/ipa_target_renderer.py; fetched metadata/body for PRs #339, #341, #338, #329, #326, #336 and #327, plus reviewer recruitment issue #337.
- **Documentation changed:** appended evidence-gated recheck sections to this handoff and docs/audits/COMPLETION-AUDIT-2026-10-20.md on the existing research branch. Audit update commit: f35b1a5ecc8218a7bbc81c5ef51a7ab94f484fe2. The commit exists on GitHub and its diff contains only the intended audit addendum. No runtime code, corpus, rule registry, or production profile was changed in this pass.
- **GitHub Actions status:** combined-status API returned an empty status list for audit commit f35b1a5ecc8218a7bbc81c5ef51a7ab94f484fe2. This means no status checks were exposed by that endpoint for this documentation commit; it is not a pass. No new workflow runs were started by this pass.
- **Local commands:** none. A clean local checkout/runtime was not available through the tools used here. Python, Node, build, wheel install, generated-artifact drift, benchmarks, and live Pages checks are therefore NOT RUN in this pass.

## Corrected interpretation

The latest branch code contains the narrow [ɲ] and [ɦ] research candidates. They remain non-production hypotheses; the previous rejection of generalized coda /n/ → [ɲ] remains applicable to that broader proposal and is not contradicted by the narrower opt-in candidate. Any benchmark results on dev data are selection-contaminated and cannot establish independent phonetic correctness. The IPA-to-Ukrainian renderer is documented and implemented as an IPA consumer, but this pass did not execute a mutation-based end-to-end proof on the exact branch head.

The current file names explicitly requested in the continuation prompt for the dated runtime-profile contract and neural-teacher candidate register were not found at those exact paths on the inspected branch. Do not cite those filenames as current artifacts until the repository tree is searched and the canonical paths are reconciled. The strict-disagreement audit is present.

## Final status ledger for this pass

- DONE_VERIFIED: remote source inspection and the two documentation append commits are present on the named branch; PR/issue bodies for the named workstreams were read.
- PARTIAL: IPA-first renderer contract is visible in source/docs; narrow profile is implemented but not independently adjudicated; PR #341 contains potentially reusable source-backed rules but no combined-tree verification exists.
- BLOCKED: independent expert IPA labels; separate Ukrainian target gold; official NIKL live inventory (HTTP 403, no manifest); exact external model/tokenizer rights and teacher-training overlap; Charsiu inference retry after reported HTTP 429; local exact-head tests and artifact reproducibility.
- TODO: compare the exact current head SHAs/diffs of #339 and #341, integrate safe non-conflicting changes only after inspection, run full CI on the combined tree, locate/reconcile missing contract/register paths, and validate all generated artifacts.

**Readiness remains: PARTIAL RESEARCH PROTOTYPE — NOT RELEASE-READY.** The documentation updates clarify evidence and blockers but do not themselves improve or prove phonetic accuracy. The next genuinely useful action is to inspect exact live PR head/base SHAs and current workflow runs, then test a deliberately constructed combined tree; independently, obtain qualified source-blind IPA annotations and close the Ukrainian target review only after IPA is frozen.


# Mainline consolidation checkpoint — 2026-10-27

- The source-backed exact-form R002 liaison and R016 ㄺ+ㄱ changes from PR #341 were merged into `main` as `1def51dd9f88364891ff0051e9aadb5900f2e42c`.
- This consolidation branch is based on that current mainline commit and carries forward the full research branch tree from PR #339, including the already-present R002/R016 implementation/test changes, research-only narrow IPA profile, teacher-corpus safeguards, benchmark tooling, registers, and handoff updates. It deliberately does not promote the narrow profile into the production Ukrainian target path.
- The prior PR #339 text saying PR #341 was not merged is historical and superseded by this checkpoint. The branch is a tree-level consolidation snapshot; its new exact-head workflows must pass before merge.
- Scientific status is unchanged: public noisy-corpus diagnostics are not normative IPA gold; dev profile gains are selection-contaminated; independent IPA adjudication and separate Ukrainian target gold remain blocked. Do not describe this consolidation as a proven accuracy gain.


# Mainline consolidation final checkpoint — 2026-10-27

## Merge and branch reconciliation
- PR #341 was squash-merged into `main` as `1def51dd9f88364891ff0051e9aadb5900f2e42c`, integrating exact-form source-backed R002 liaison and R016 ㄺ-before-ㄱ rules with regression coverage.
- PR #348 was squash-merged as `72d2a785160382ffbfdce4f5654afb9671d957f9`. It consolidates the deterministic engine/research tree, IPA-first rendering boundary, benchmark and teacher-readiness tooling, source-blind packet tooling already present in that tree, and the unique contextual/sentence-level neural-G2P evaluator/tests/docs.
- PRs #339 and #338 are closed as superseded by #348. Their source branches were not deleted or force-updated; branch deletion is intentionally not performed in this execution. PRs #329, #326, #336, #327, and #305 remain open because they contain distinct unresolved reviewer/holdout/source-evidence work not safely replaceable by the consolidation.

## Exact-head verification evidence
The final code-bearing consolidation head was `3c4bbfd83f2c8e33bbc50a4c016abe75f30795ac`; merge commit on `main` is `72d2a785160382ffbfdce4f5654afb9671d957f9`.

Passed on the exact consolidation head:
- Multi-engine IPA benchmark, including adapter tests, frozen-holdout-overlap audit, UGTPHON and SIGMORPHON comparison: [run 40585528130](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585528130) — success.
- External UGTPHON diagnostic and paired native-vs-g2pK: [run 40585528014](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585528014) — success; [run 40585528085](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585528085) — success.
- System verification, Python regression/data integrity, browser tests/build/page verification: [run 40585528028](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585528028) — success.
- Browser G2P integration: [run 40585527918](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585527918) — success.
- Morphology adapter smoke/strict-soft diagnostics: [run 40585528036](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585528036) — success.
- Teacher corpus split audit: [run 40585527921](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585527921) — success.
- Exhaustive test-case register extraction: [run 40585528153](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585528153) — success.
- Master table/research corpus artifacts: [run 40585528184](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585528184) — success.
- Optional g2pK integration: [run 40585528138](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585528138) — success.
- Scratch-teacher three-seed reproducibility portfolio: [run 40585528188](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585528188) — success; research-only, dev-only, no production promotion.

**Still pending:** full standalone Python 3.11/3.12/3.13 + wheel-install/web matrix [run 40585528103](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40585528103) remained queued at the final poll. Post-merge `main` push runs are also queued; do not count these as passed until completion. The post-merge master-table run passed. NIKL live inventory was skipped by workflow configuration, not passed; Charsiu and licensed ByT5 inference jobs were skipped as opt-in research dependencies.

## Benchmark results and interpretation
- UGTPHON test: native ClippyFirst scored 2,698/2,703, 1,430 exact (53.0022%), CER 9.1697%, 99.815% coverage, five abstentions, zero runtime errors. g2pK 0.9.4: 1,435/2,703 exact (53.0892%), CER 9.2285%.
- SIGMORPHON 2021 Korean test: native scored 997/999, 357 exact (35.8074%), CER 14.7037%, 99.7998% coverage, two abstentions, zero runtime errors. g2pK: 353/999 exact (35.3353%), CER 14.8222%.
- These remain diagnostic IPA comparisons against noisy/lexical reference corpora, not normative NIKL gold and not Ukrainian-target accuracy. Dev broad/narrow profile gains are selection-contaminated. No independent source-blind IPA adjudication or separate Ukrainian target gold was created by this merge.

## Readiness
The repository is a **tested partial research prototype, not release-ready**. Keep the narrow IPA profile research-only and target-incompatible until independent IPA convention adjudication and Ukrainian-target review are completed. Other remaining blockers include official NIKL inventory/manifest access (HTTP 403), model licensing/training-overlap verification, and qualified independent reviewers.


# One-pass continuation — current mainline and remaining evidence gates (2026-10-27)

## Verified starting point

- Default branch: `main`; starting commit: `42780155008c713200737d07246ef111e411d152`.
- Dedicated continuation branch: `fix/one-pass-independent-validation-2026-10-27`.
- Repository currently has no open PRs. Previously closed PRs remain closed; historical branch refs are not automatically deleted.
- Local clean checkout and local test execution are blocked because this environment cannot resolve `github.com`. Do not report local tests as passed.
- Current main commit has no reported combined-status checks through the connected status query; earlier successful Actions runs were on a different PR head and are not exact-head evidence.

## One-pass task ledger

| Work item | Status | Evidence / acceptance |
|---|---|---|
| Consolidated engine and prior source-backed rules | PARTIAL | Existing code/data preserved; exact current-main test suite still requires CI. |
| Source-blind independent IPA packet generation | DONE_VERIFIED as software contract | Existing builder and per-review submission validator have regression tests; neither supplies real human annotations. |
| Paired reviewer comparison and fail-closed disagreement report | IMPLEMENTED_PENDING_CI | New `scripts/compare-ipa-review-pair.mjs`, package command, and tests require a green exact-head CI run. Agreement is not treated as gold. |
| Independent broad IPA gold | BLOCKED_EXTERNAL_REVIEW | The 24-case frozen holdout correctly has `ipaGold: null`; acceptance requires two real independent qualified reviews plus documented adjudication. |
| Independent Ukrainian target gold | BLOCKED_EXTERNAL_REVIEW | Requires a separate blinded target-layer review on frozen, adjudicated IPA; no reviewer judgments are fabricated. |
| NIKL official live crawl | BLOCKED_SOURCE_ACCESS | Previously observed HTTP 403; the local official HTML can support a local inventory, but does not establish permission to redistribute all content. |
| Root license and citation metadata | BLOCKED_OWNER_DECISION / EVIDENCE | Do not choose a project license on the owner's behalf; citation metadata must use verified author/version/DOI details. |
| Release gate | NOT_READY | Must wait for exact-head CI, independent IPA adjudication, Ukrainian-target review, and source/rights clearance. |

## Commands and checks in this continuation

- GitHub repository metadata, current default branch, recent commit list, root tree, execution plan, holdout manifest, runtime-profile contract, target renderer, and review scripts fetched through the connected GitHub API.
- Local `git clone --depth 1 https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System.git /tmp/korean-ua` — BLOCKED: `Could not resolve host: github.com`.
- No Python/Node test or build has been run locally in this environment.
- The new pair-comparison tests are intended to run through the repository's existing `npm test` workflow when this branch PR is opened.

## Stop condition and genuine next blocker

The feasible software-side improvement in this pass is to make two-review comparison reproducible and explicitly non-adjudicative. The remaining blocker is now a real external dependency: qualified independent reviewers and owner/source-rights decisions. A green CI cannot substitute for those judgments.


# Post-merge closeout — 2026-10-27

- PR [#350](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/350) merged by squash into `main`; merge commit `02f1c13cdf9387b2355fbe0716b8f8f05132c719`. The PR head tested was `e7b88d87005c75ad124b59041774e825dad9ca32`.
- Added `scripts/compare-ipa-review-pair.mjs`, `npm run ipa:compare-review-pair`, tests in `tests/compare-ipa-review-pair.test.mjs`, and its operating contract in `docs/INDEPENDENT-IPA-REVIEW-PAIR-COMPARISON.md`.
- Exact PR-head CI results: [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40591140023) PASS; [browser G2P integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40591140029) PASS; [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40591133811) PASS; [master-table/research-corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40591140186) PASS; test-case-register extractor steps PASS in [run 40591140047](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40591140047). The official live NIKL inventory was SKIPPED by policy, not passed.
- An earlier run on the same PR head failed one new assertion because its expected notice text did not match the actual notice. The notice was clarified, and the later exact PR-head test and system-verification runs passed. Do not count the earlier run as a pass.
- Local `git clone` and local test execution remain blocked by DNS resolution of `github.com`; no local test results are claimed.
- The merge commit's own CI was still running at the time of this update. PR-head green checks are strong exact-code evidence, but this documentation update and merge do not close the external linguistic gates.
- Remaining genuine blockers: two independent qualified IPA reviewers plus documented reconciliation; separate Ukrainian-target review; source/rights clearance; owner decision on repository licensing; official live NIKL crawl remains blocked/skipped. Release status remains **NOT READY**.
- Branch cleanup: PR debt was closed and there are no open PRs. This connector does not expose branch-ref deletion, so historical branch refs have not been deleted and are not claimed as deleted.


# Continuation — paired benchmark integrity hardening (2026-10-28)

This section supersedes earlier branch/PR status statements above where they conflict with the current repository state.

- **Current work branch:** `fix/paired-benchmark-integrity-2026-10-28`, based on `main` at `4bf96951cd3281c5e24c7f9f874aea86e6602f00`.
- **PR:** [#351](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/351); open pending the pinned multi-engine benchmark result.
- **Implementation:** `scripts/benchmark_multi_engine_ko.py` now rejects duplicate occurrence IDs rather than silently overwriting records in dictionary construction, rejects candidate/native pairs whose same occurrence ID points to different source rows, and emits explicit paired/candidate-only/native-only occurrence counts plus paired row count with paired bootstrap intervals.
- **Regression tests:** `tests/test_multi_engine_benchmark.py` checks the denominator fields and invalid pairing rejection.
- **Verification:** Python 3.11, 3.12 and 3.13 suites, browser tests, wheel-install check, teacher-corpus audit, system verification, master-table/research artifacts, test-case-register extraction, and the pinned multi-engine benchmark all passed. The final-head benchmark run is [40646442747](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40646442747), with artifact [12797696557](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40646442747) (`multi-engine-korean-ipa-diagnostic`).
- **Fresh pinned benchmark results (1000 row-cluster bootstrap replicates; paired deltas are candidate minus ClippyFirst):**
  - UGTPHON: ClippyFirst 1430/2698 exact (53.002%), CER 9.170%, coverage 99.815%; g2pk 1435/2703 (53.089%), CER 9.229%, coverage 100%. On the 2698 shared scored occurrences, g2pk exact-rate delta +0.111 percentage points, 95% CI [-0.037, +0.299 pp]; CER delta +0.061 pp, 95% CI [-0.008, +0.138 pp]. Both paired intervals include zero; no reliable winner on this noisy dataset.
  - SIGMORPHON 2021: ClippyFirst 357/997 exact (35.807%), CER 14.704%, coverage 99.800%; g2pk 353/999 (35.335%), CER 14.822%, coverage 100%. On the 997 shared scored occurrences, g2pk exact-rate delta -0.401 percentage points, 95% CI [-0.802, -0.100 pp]; CER delta +0.113 pp, 95% CI [-0.025, +0.273 pp]. ClippyFirst's exact-match advantage is small; CER uncertainty interval includes zero.
  - Other baselines scored substantially lower on these reference conventions: KoG2P, hangul_to_ipa, eSpeak NG and phonemize. This is a dataset-and-normalizer-specific diagnostic ranking, not a claim of universal phonetic authority.
- **Scope and interpretation:** this fixes statistical pairing integrity only; it does not change Korean phonological rules or claim improved IPA accuracy. These scores compare IPA only, remain convention-sensitive, and do not measure Ukrainian orthographic adaptation. UGTPHON is noisy user-generated text; SIGMORPHON is lexical and not a sentence-context NIKL standard-pronunciation set.
- **Remaining gates:** independent Ukrainian target gold, IPA adjudication for genuinely ambiguous cases, and source/rights review remain evidence-limited blockers, not reasons to stop automated benchmark work.


# Continuation — dictionary-attested 닭갈비 coverage (2026-10-28)

- **Work branch / PR:** `fix/source-backed-dakgalbi-pronunciation-2026-10-28`, [PR #352](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/352), based on `main` at `4bbf88f594c3edd208253aed621cd46643387149`.
- **Source evidence:** the National Institute of Korean Language Korean Basic Dictionary public result for `ParaWordNo=56047` lists `닭갈비[닥깔비]`. Registered as `SRC-KRDICT-ENG-56047`. This is exact-form Hangul surface evidence only; the direct detail page was not independently retrievable in this run, and item-level KOGL/reuse marking remains unverified.
- **Implementation:** Python `_NIKL_R014_WORD_LICENSES` and browser `NIKL_28_COMPOUND_FORTITION_FORMS` now license only `닭갈비` → `닥깔비`. A browser interaction bug was fixed so the exact §28 compound license resolves the ㄺ+ㄱ sequence instead of being prematurely blocked by the separate §11 verbal-stem rule. No global ㄺ+ㄱ rewrite was introduced.
- **Tests:** Python and browser regression cases check the exact surface, IPA-first browser output, and Python/JS rule-license parity. Source-register row and rights-count expectations were updated to reflect the additional evidence row.
- **Benchmark evidence:** the pinned multi-engine workflow [40647595619](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40647595619) passed on code head `3a7a14bd4bc7b3699386610c7c73531a5ad5a238`; artifact [12797673188](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40647595619).
  - UGTPHON metrics were unchanged: 1430/2698 exact, CER 9.170%, coverage 99.815%; this form was not present in its eligible token occurrences.
  - SIGMORPHON 2021 native coverage increased from 997 to 998 scored tokens (99.800% → 99.900%); exact matches remained 357, so exact rate changed from 35.807% to 35.772% due to the larger denominator; CER improved from 14.704% to 14.698%. This is one recovered prediction, **not an exact-match gain**.
  - For `닭갈비`, ClippyFirst now returns `tak̚.k͈al.bi` rather than abstaining. The reference is `ta̠k̚k͈a̠ɭbi`; the normalized character distance remains 1 because the reference uses `ɭ` while the project broad IPA uses `l`. Do not alter the production IPA solely to imitate this reference convention.
- **Latest-head verification:** on `b5fea696897047f15681aad14384752a6f84315a`, Python 3.11/3.12/3.13 suites, browser tests/build, wheel install and teacher-corpus audit passed. Remaining exact-head system and benchmark checks were still running at the time of this documentation update.
- **Status:** a narrowly evidence-backed coverage repair is implemented; IPA and Ukrainian target are still project-generated, not independently adjudicated gold. Item-level rights review and independent Ukrainian-target validation remain open. Do not claim release readiness from this lexical repair.


### 2026-10-29 follow-up — Korean aspiration and fortis target output

- **Work branch / PR:** `fix/korean-aspiration-fortis-output-2026-10-29`, [PR #372](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/372), based on `main` at `716b32df7b52e84849cc2e9926868942857d48bb`.
- **Target convention implemented:** aspirated onsets render with an apostrophe (`kʰ → к'`, `tʰ → т'`, `pʰ → п'`, `tɕʰ → ч'`); fortis onsets preserve doubling (`k͈ → кк`, `t͈ → тт`, `p͈ → пп`, `s͈ → сс`, `tɕ͈ → чч`). The palatalized fortis sibilant `ɕ͈` now renders as `шш`, not `ш`.
- **Provisional exception:** `kʰjʌ` remains provisional and has candidate target `к'хьо`. It retains the previous project target base rather than silently changing to `к'йо`; strict mode still abstains until the mapping is adjudicated.
- **Implementation/evidence:** updated canonical IPA→Ukrainian correspondence data, the explicit override registry, generated browser mapping data, aligned lexical target fixtures, the independent test oracle, browser/Python regressions, and this handoff/audit record. This is a declared project orthography convention, not independent proof that every Ukrainian adaptation is linguistically optimal.
- **Exact-head verification on `08dd78de7efee0988b6fa1195b871425f988634f`:** GitHub Actions `tests` passed, including **1,305/1,305 browser tests**, Python 3.11/3.12/3.13, wheel installation, and teacher-corpus audit. System verification, master-table/research-corpus artifacts, test-case-register extraction, optional g2pK integration, paired native-vs-g2pK diagnostic, and external UGTPHON diagnostic passed. The multi-engine benchmark was still running at the time of this record; do not infer its result from the other workflows.
- **Execution limitation:** local clone and local test execution were unavailable in this connector-only session. Test claims above refer only to the named GitHub Actions runs on that exact code head.
- **Task ledger:** `DONE_VERIFIED` — target mapping, corpus synchronization, and Python/browser regressions on the cited head; `PARTIAL` — public-site deployment and live smoke test pending merge/deploy; `BLOCKED` — independent Ukrainian-target gold and source/rights adjudication remain separate project gates; `DEFERRED` — no unrelated IPA-profile or neural-teacher redesign.
- **Release/readiness:** this change is software-verified on the cited head, but it does not make the entire repository linguistically release-ready. The site is deployed from `main`; merge PR #372 only after all required exact-head checks are green, then verify the Pages deployment and its live smoke test.


# Continuation — Ukrainian-first output and conservative Hanja annotation (2026-10-30)

- **Branch:** `fix/hanja-output-hierarchy-and-unknown-spans-2026-10-30`, based on `main` at `1f78c26e6aeb43b7c2e7eba6f0659f9cceba38ec`.
- **Change:** Ukrainian practical output is first. Romanization and IPA remain supporting cards. Hanja occupies the former Ukrainian-card position after those cards.
- **Hanja coverage behavior:** unknown words and native Korean vocabulary are not converted by guessing. In `현대 한국어의 표준 발음 값이`, known dictionary entries can become Hanja while `값이` and grammatical particles remain Hangul. This is expected conservative annotation behavior; Hanja is not complete coverage or a translation.
- **Regression coverage:** updated `tests/hanja-ui-contract.test.mjs` for the output order and visible fallback explanation; added a deterministic mixed-script fixture to `tests/hanja.test.mjs`.
- **Status:** PARTIAL pending exact-head GitHub Actions, static build, and live deployed Pages smoke. This connector session cannot claim local test execution because it has no local repository checkout.
- **Acceptance criterion:** `npm test`, `npm run build`, source integrity checks, and post-deployment browser smoke must pass on this branch's exact head; then inspect that the Ukrainian card is first and the mixed-script Hanja example preserves unsupported/native Hangul.
- **Scope kept unchanged:** no neural model, no external runtime API, no changes to pronunciation/IPA/Ukrainian mapping; Hanja coverage metrics remain TODO and contextual WSD remains DEFERRED.


# UI follow-up — swap wide IPA and Hanja cards (2026-10-30)

- **Branch:** `fix/swap-ipa-hanja-cards-2026-10-30`, based on `main` at `7f0d20c228d91836f192744b45447822cc3d2d4e`.
- **Requested order:** Ukrainian → Romanization → 漢字 (Hanja · dictionary annotation) → IPA (wide IPA) → Analysis.
- **Implementation:** swapped only the adjacent IPA and Hanja result-card DOM blocks in `index.html`; labels, output IDs, copy controls, content, rendering logic, and the Ukrainian-first hierarchy remain unchanged.
- **Regression:** updated `tests/hanja-ui-contract.test.mjs` to assert the exact new order.
- **Status:** PARTIAL until exact-head CI, build, and post-deployment Pages smoke confirm the order.
- **Scope:** no Korean processing, IPA values, Ukrainian adaptation, Hanja dictionary, or network behavior changed.


# Editorial principle — separate service and methodology audiences (2026-10-30)

This is a standing content and information-architecture decision for the public website:

- **Service page — for everyday users.** Explain the practical task in plain Ukrainian: what to enter, what result they receive, how to use it, and how to interpret visible uncertainty or limitations. Keep academic and implementation terminology out of the main user path unless a short explanation is genuinely necessary. Do not hide limitations; explain them in ordinary language and link to the methodology for technical detail.
- **Methodology page — for scholars, linguists, and technical researchers.** Preserve scientific precision and full technical depth: IPA, G2P, NIKL, phonological rules, source evidence, corpora, confidence/evidence statuses, architecture, validation limits, and research history where relevant.
- **Cross-link the two layers.** The service may link to the methodology for readers who want to know exactly how a result is produced; the methodology may link back to the service as the practical demonstration. These are two audience-specific presentations of the same system, not separate products or contradictory accounts.
- **Do not flatten the methodology to make it accessible, and do not burden the service UI with academic exposition.** Translate limitations for the service audience without weakening or omitting the underlying scientific qualifications.

Apply this boundary to future copy edits, UI labels, help text, navigation, and documentation placement. When in doubt, ask whether the sentence helps an ordinary visitor use/understand the result (service) or documents how/why the system works (methodology).

# Super-soft mode — 100% input coverage requirement (2026-10-30)

- **User requirement:** the Kozak Kim Korean engine must gain a distinct opt-in Super-soft mode with **100% technical coverage of modern Hangul syllable input**, comparable in coverage intent to other G2P engines. This is not a request to claim 100% pronunciation accuracy.
- **Definition:** every modern Hangul syllable receives a non-empty Ukrainian candidate and IPA/typed phonetic result; every source span is accounted for in provenance; literals are preserved; unresolved morphology must fall back to an explicitly low-confidence orthographic/phonemic path rather than disappearing.
- **Pipeline invariant:** source Hangul → structural analysis → Korean phonology or typed orthographic fallback → IPA/typed result → Ukrainian IPA adapter → Ukrainian output. No direct Hangul→Ukrainian bypass, neural model, or runtime API.
- **Mode separation:** Strict remains fail-closed; current Soft and Practical contracts remain unchanged; Super-soft is a separate opt-in maximum-coverage tier. Heuristic fallback never becomes exact/NIKL evidence and never writes into the lexical registry.
- **Acceptance:** exhaustive end-to-end coverage of all 11,172 modern Hangul syllables, IPA-target coverage, adversarial morphology/mixed-script tests, source-span trace accounting, strict-mode regression, browser build, and deployed smoke. Measure coverage separately from pronunciation accuracy. Python CLI/API parity is deferred because those entry points do not expose Super-soft.
- **Initial finding:** the existing Practical mode was not 100% coverage: unresolved morphology, unsupported Jamo, and unmapped IPA could produce empty output.
- **Current status: DONE_VERIFIED for browser implementation and exact-head coverage tests; deployment smoke pending.** See [Super-soft 100% coverage specification](SUPER-SOFT-100-PERCENT-COVERAGE-SPEC-2026-10-30.md).


# Super-soft 100% coverage implementation continuation — 2026-10-30

- **User authorization:** implementation approved; proceed autonomously and rigorously.
- **Branch:** `feat/super-soft-100-percent-coverage-2026-10-30`, based on main `0083bed43e824836dd6613c53ca70944b9a9290d` and the preceding specification-only branch commit `4e9c2bd1aefeaf0228cc07a50ffe7d2bda07321f`.
- **Implemented batch (verification pending):** opt-in `super-soft` mode in browser native engine; reuses existing Soft/Practical deterministic rule paths; only unresolved morphology falls back to orthographic-phonemic IPA with explicit low-confidence provenance; target provisional mappings remain candidate-only; standalone compatibility Jamo and non-Korean literals are preserved; adds per-source-span coverage accounting and research-only UI toggle.
- **Tests authored:** exhaustive 11,172 modern Hangul syllable inventory through IPA and Ukrainian target adaptation; unresolved morphology fallback; literal/Jamo preservation; mode isolation; UI wiring.
- **Status:** PARTIAL until exact-head CI passes. Do not claim 100% until the exhaustive test and complete target mapping gate pass. Independent pronunciation accuracy is BLOCKED/EVIDENCE-LIMITED without independently adjudicated held-out Korean pronunciation gold.
- **Environment blocker:** direct local GitHub clone was attempted and failed because DNS could not resolve `github.com`; local npm/Python/browser commands cannot be run from this container. GitHub Actions exact-head workflows are the available verification path. This is not a test pass.


# Super-soft mode — exact-head verification update (2026-10-30)

- Verified branch head: feat/super-soft-100-percent-coverage-2026-10-30 at c57f34c52e15e5a55fc5943e4069c019bfb12a07.
- Status: DONE_VERIFIED for browser implementation and technical coverage acceptance; release deployment smoke remains pending.
- Exhaustive evidence: all 11,172 modern Hangul syllables produced non-empty IPA and IPA-adapted Ukrainian candidates; 13 registered strict morphology gaps each achieved full candidate and trace coverage; full NIKL master passage achieved 100% Hangul candidate coverage and 100% source-span trace coverage.
- Tests: npm test 1326 passed / 0 failed; npm run build passed; browser regression/build, browser-G2P, Python 3.11/3.12/3.13 regression/data integrity, wheel install, teacher-corpus audit, master table/research corpus artifacts, and exhaustive test-case register extraction passed. Official NIKL metadata-only inventory job skipped by configuration.
- Methodology page: system.html now documents the Super-soft ladder, coverage scope, candidate confidence, and accuracy limitations for researchers.
- Design: Strict/Soft/Practical unchanged; Super-soft is opt-in in research mode. Low-confidence practical/morphological heuristics, orthographic-phonemic fallbacks, and provisional lexical target adaptations are candidate-only and explicitly traced; unresolved morphology flags are preserved in trace uncertainty metadata. IPA remains the only input to the Ukrainian target adapter. Compatibility/decomposed Jamo and non-Korean literals are preserved.
- Scope note: Python CLI/API still accept only strict/soft; this new mode is scoped to browser-native service runtime. Cross-runtime parity is DEFERRED, not claimed.
- Evidence limitation: no independent held-out adjudicated gold corpus was added; 100% coverage is not 100% pronunciation accuracy.
- Next step: make PR #379 ready, merge only against unchanged tested head, then verify Pages deployment and live smoke. Local clone/test commands unavailable because GitHub DNS resolution failed in the container.


# Super-soft post-merge deployment and trace-integrity follow-up (2026-10-30)

This section supersedes earlier statements in this handoff that PR #379 or its Pages deployment were still pending.

- **Implementation PR:** [#379](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/379), merged 2026-10-30 08:56 UTC. Merge commit on `main`: `10ce8b580af145da58c41f7a66c7752f021ca13f`. The PR's final tested source head was `578e9be52f8a6fc926c2bd635658dc0dcc926e3b`.
- **Exact-head evidence:** GitHub Actions on merge commit `10ce8b580af145da58c41f7a66c7752f021ca13f`: tests run `41029777321`, system verification `41029777417`, browser G2P `41029777347`, research corpus artifacts `41029777416`, and Pages deployment `41029777444` all completed successfully. The test report records 1,326 passed / 0 failed and `npm run build` passed. Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, browser tests/build, G2P integration, and research artifact checks passed. The optional official NIKL metadata-only inventory job was skipped by workflow configuration; it is not a pass.
- **Deployment evidence:** Pages deployment run `41029777444` succeeded. Its deployment job completed the HTTP smoke for both public pages and the live Playwright browser smoke, including practical-mode target conventions, lazy same-origin Hanja dictionary output, candidate handling, clipboard fallback, mobile trace labels, and methodology navigation. The live smoke did not yet exercise Super-soft itself; a dedicated Super-soft live assertion is added in the trace-integrity follow-up below.
- **Implementation scope:** browser-native deterministic Super-soft is deployed as an opt-in research-mode control. It returns candidate output for the 11,172 modern Hangul syllable inventory; this remains technical coverage, not a pronunciation-accuracy claim. Strict/Soft/Practical remain separate. Python CLI/API parity is DEFERRED. Independent held-out pronunciation accuracy is BLOCKED / EVIDENCE-LIMITED pending adjudicated gold.
- **Trace-integrity review:** the initial offset binder retried a failed monotonic match from offset zero. This could theoretically attach a repeated trace token to an earlier occurrence and inflate source-span coverage. The follow-up removes that retry, exposes `untraced_source_offsets`, and adds a mixed-Unicode exact-offset regression.
- **Follow-up PR:** [#380](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/380), branch `fix/super-soft-trace-offset-integrity-2026-10-30`, based on `10ce8b580af145da58c41f7a66c7752f021ca13f`. It also extends the live Pages smoke to switch into research mode, enable Super-soft, and assert 100% Hangul coverage, 100% trace accounting, a candidate, IPA, and low-confidence status. At this handoff update, exact-head CI is still running; do not mark this follow-up DONE_VERIFIED or merge it until all required jobs pass.
- **Local execution limitation:** this connector session has no working local repository checkout/network path, so no local npm/Python/browser commands are claimed. Exact-head GitHub Actions are the verification source.
- **Task ledger:** Super-soft browser implementation and exhaustive 11,172-syllable acceptance — DONE_VERIFIED on merged main; deployment — DONE_VERIFIED for general public service smoke, Super-soft-specific live smoke pending PR #380; exact source-offset hardening — PARTIAL pending PR #380 CI; independent pronunciation accuracy — BLOCKED / EVIDENCE-LIMITED; Python CLI/API parity — DEFERRED.


# Super-soft final verification — PR #380 deployed (2026-10-30)

This section is the latest authoritative status and supersedes the earlier pending-PR #380 entries above.

- **Final main commit:** `1394f496242cec631f7341995cdbf402f70274bf`.
- **Trace-integrity follow-up:** [PR #380](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/380), final tested head `d8a9070dd253c8f4242685c8c67f69179b4a4a05`, merged at 2026-10-30 09:30:54 UTC as `1394f496242cec631f7341995cdbf402f70274bf`.
- **Code hardening:** removed the unsafe offset-zero retry from trace/source alignment; if a trace item cannot be matched monotonically after the previous item, it is no longer attached to an earlier repeated substring. Coverage reports explicit `untraced_source_offsets`. A new mixed-Unicode test verifies every trace interval is monotonic, non-overlapping, UTF-16-correct, points to the exact source substring, and covers the full input; it checks repeated Hangul, emoji, punctuation, spaces, compatibility Jamo, decomposed Jamo, and digits.
- **Exact-head checks on PR #380 head:** browser tests **1,327 passed / 0 failed**, Vite production build passed, Python 3.11/3.12/3.13 regressions/data checks passed, wheel install passed, teacher-corpus audit passed, browser G2P integration passed, master table/research corpus artifacts passed, and exhaustive test-case register extraction passed. The optional official NIKL metadata-only inventory job was skipped by workflow configuration; it is not reported as passed.
- **Post-merge exact-main checks:** test run `41033991233`, system verification `41033991213`, browser G2P `41033991249`, and research corpus artifacts `41033991232` all succeeded on `1394f496242cec631f7341995cdbf402f70274bf`. Browser tests/build and Python 3.11/3.12/3.13, wheel installation, teacher-corpus audit, and data integrity checks passed.
- **Deployment and live verification:** Pages deployment run `41033991218` succeeded. HTTP smoke fetched both public pages and the built JavaScript asset. The live Playwright step also passed after exercising the Super-soft research control on mixed Hangul/literal input and asserting 100% Hangul coverage, 100% trace accounting, a non-empty Ukrainian candidate, non-empty IPA, and explicit low-confidence status. The same live run passed the pre-existing practical-mode, Hanja, candidate-selection, clipboard, mobile trace, and methodology navigation checks. Public URL: https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- **Mode boundary:** Super-soft is browser-native and opt-in inside research mode. It gives a candidate for every modern Hangul syllable block covered by the exhaustive 11,172-syllable test. It does not claim 100% pronunciation accuracy. Strict, Soft, and Practical remain distinct. Standalone/decomposed Jamo and non-Korean literals are preserved rather than assigned invented pronunciation.
- **Remaining evidence gates:** independent held-out Korean pronunciation adjudication and Ukrainian target orthography adjudication remain BLOCKED / EVIDENCE-LIMITED. Python CLI/API Super-soft parity remains DEFERRED. The optional official NIKL metadata-only source inventory job remains skipped by workflow configuration.
- **Task ledger:** Super-soft browser implementation — DONE_VERIFIED; exhaustive 11,172-syllable IPA + Ukrainian candidate coverage — DONE_VERIFIED; source-span trace integrity on tested mixed Unicode — DONE_VERIFIED; Super-soft live Pages UI smoke — DONE_VERIFIED; Strict/Soft/Practical regression and Python data checks — DONE_VERIFIED; independent pronunciation accuracy — BLOCKED / EVIDENCE-LIMITED; Python CLI/API parity — DEFERRED.
- **Readiness:** the deterministic browser feature is deployed and software-verified. This is not a claim that Korean pronunciation accuracy or Ukrainian target quality has been independently established; those linguistic evidence gates remain open.
- **Local execution limitation:** no local npm/Python/browser commands are claimed from this connector-only session. The exact-head and post-merge GitHub Actions results above are the verification evidence.


# Super-soft Unicode edge-case verification follow-up (2026-10-30)

This is a test-only follow-up to the final deployed verification above.

- **PR:** [#382](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/382), tested head `a40f0c87468bb1a410861899b9e9795c1ae219cd`, merged to `main` as `d700f1662c86324fba2c01df9d2aa46422cb9ab2`.
- **Added regression:** explicitly checks archaic Hangul Jamo U+1113, U+115F, U+11F9 and an isolated high surrogate. They remain literal source spans with status `literal`, identical output, empty IPA, and exact trace offsets; no pronunciation is guessed.
- **Scope:** the test includes one modern Hangul syllable and confirms 100% syllable coverage plus complete trace accounting of the mixed input. Archaic Jamo and malformed code units are not counted as modern Hangul pronunciation coverage; they are preserved source text.
- **Exact-head evidence:** 1,328 browser tests passed / 0 failed; Vite production build passed; Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, system verification, master table/research corpus artifacts, and exhaustive test-case register extraction passed.
- **Task ledger:** modern Hangul maximum coverage, exact mixed-Unicode trace accounting, literal/archaic-Jamo/malformed-code-unit preservation, and live Super-soft Pages smoke — DONE_VERIFIED. Independent Korean pronunciation and Ukrainian target accuracy — BLOCKED / EVIDENCE-LIMITED. Python CLI/API parity — DEFERRED.
- **No runtime behavior or IPA correspondence changed in PR #382.** The 100% coverage claim remains limited to modern Hangul syllable blocks, not archaic Jamo or pronunciation accuracy.

# Super-soft long-passage quality audit continuation (2026-10-30)

**Branch:** research/super-soft-long-passage-quality-audit-2026-10-30  
**PR:** [#384](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/384)  
**Base:** main at 9351c5ad5e09291d2dfa314df5b6472231dc55e8.

## Finding and bounded implementation

The existing Super-soft contract verifies non-empty IPA/candidate output and exact source-span accounting. It correctly warns that coverage is not accuracy, but the result metadata and browser status line did not quantify the share of low-confidence syllables or separate target-adapter states. This made long stress-text output harder to assess at a glance.

The continuation adds the following transparent counters without changing any pronunciation rule or Ukrainian mapping:

- low-confidence syllable count and share (also exposed as heuristic_share);
- model-selected, provisional, and unavailable target-adapter counts;
- missing-IPA count;
- explicit null for independently verified pronunciation rate, with status not_independently_adjudicated;
- a browser status-line disclosure of low-confidence share;
- regression coverage for a morphology-sensitive token and the full NIKL master-passage fixture.

## Current task ledger

| Item | Status | Evidence / acceptance |
|---|---|---|
| Base branch and latest main inspected | DONE_VERIFIED | Default branch main, base SHA above; recent commits and open PRs inspected |
| Existing Super-soft implementation and fixture reused | DONE_VERIFIED | src/app/engine.js, src/app/engine_convert.js, tests/super-soft-coverage.test.mjs, NIKL master-passage fixture |
| Low-confidence and target certainty metrics | PARTIAL | Implemented on PR #384; exact-head test/CI verification in progress |
| UI disclosure of heuristic share | PARTIAL | Implemented on PR #384; UI contract and browser CI verification in progress |
| Independent Korean pronunciation accuracy | BLOCKED / EVIDENCE-LIMITED | Requires independently adjudicated held-out Korean pronunciation gold; master passage is a stress fixture, not gold |
| Independent Ukrainian target quality | BLOCKED / EVIDENCE-LIMITED | Requires blinded review of frozen, adjudicated IPA inputs |
| Python CLI/API parity for Super-soft | DEFERRED | Current scope is browser-native service only |

## Verification record

The first exact-head CI attempt on 8ecb8dd803a72fd273ab1b85d5f5db0039f0508f exposed a mismatch in the newly authored test: it assumed each trace item represented exactly one Hangul code point, while some lexical spans cover multiple code points. The runtime correctly counted every source code point covered by a trace interval. The test was corrected to match intervals against exact UTF-16 offsets. The corrected head is 08e438338389015917dff002bbd6b01ce0889308; the browser regression test and build, Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, and system verification have succeeded on that head. Remaining queued workflows must complete before marking all checks DONE_VERIFIED.

No local npm/Python/browser command is claimed in this connector-only execution. Do not infer accuracy from candidate coverage, test pass counts, or the IPA mapping table.

## Next acceptance gate

Confirm the remaining exact-head workflows finish successfully; inspect the stress fixture's computed counts; verify the browser status line discloses the heuristic share. Only source-backed and independently adjudicated cases may be promoted into pronunciation gold or production rules.

- **Metric semantics follow-up:** `low_confidence_share` and `heuristic_share` now return 0 (not 100%) for an input with no modern Hangul syllables. The target count field is named `target_project_mapping_units` to avoid implying a neural/model inference stage; the runtime remains deterministic.

## Final continuation verification (2026-10-30)

**Verified code head:** 7ca4e625a0ef1687a89b021c3a1f9b357cdc19ca. **PR head after handoff-only update:** 062f08de4cc8ab8a9c7b51476fcb402b12ff47ac. The handoff-only commit changes no runtime or test code.

- Browser suite: **1,331 passed, 0 failed**; production Vite build passed in exact-head run [41053021059](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41053021059).
- Python regression/data integrity passed on Python 3.11, 3.12, and 3.13; clean wheel installation and teacher-corpus audit passed in the same run.
- System verification, browser G2P integration, master-table/research-corpus generation, and exhaustive test-case register extraction all completed successfully on the verified code head: runs [41053021107](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41053021107), [41053021035](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41053021035), [41053021046](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41053021046), and [41053021090](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41053021090).
- The initial test-only failure on 8ecb8dd was fixed by aligning confidence calculations to the complete UTF-16 trace intervals; the corrected test passed on 7ca4e62.
- The low-confidence share is explicitly 0 for empty/no-modern-Hangul input; this avoids reusing the coverage convention of 100% for an empty denominator. The target mapping counter is named target_project_mapping_units to avoid implying neural inference.
- PR #384 remains open; no merge or deployment was performed. PR #371 remains untouched because it is an independent multi-engine benchmark effort.

**Final status:** transparency metrics, trace-aligned counting, UI disclosure, tests, and handoff — DONE_VERIFIED on code head 7ca4e62. Independent Korean pronunciation accuracy and Ukrainian target quality — BLOCKED / EVIDENCE-LIMITED pending adjudicated gold and specialist review. Python CLI/API Super-soft parity — DEFERRED. The service remains a deterministic research prototype with a deployed browser implementation, not a linguistically accuracy-certified release.

## Exact lexical controls and final CI confirmation (2026-10-30)

- Added 27 exact/source-backed controls from the master passage. For each, Super-soft is required to preserve the Strict engine's Korean surface form, IPA, and IPA-derived Ukrainian target.
- Exact code head: 31ab5269e70ac800870b60251fe8b1e744f9e179.
- Browser tests: 1,332 passed, 0 failed; production build passed in run 41053589850.
- Python 3.11/3.12/3.13, wheel installation, teacher-corpus audit, system verification, browser G2P integration, master/research artifact generation, and exhaustive test-case register extraction all passed on the exact head. Relevant runs: 41053589850, 41053590044, 41053589866, 41053589911, 41053589871.
- The 27-control regression protects existing evidence-backed cases; it does not certify the remaining stress-passage forms or independently adjudicate Ukrainian target quality.

PR #384 remains the proposed change set. No unrelated benchmark PR was modified.

# Post-merge status and live Super-soft confidence smoke (2026-10-30)

PR #384 was merged into main by squash commit f9cefe405b80a802424a30af91c3b3e096d7d1ac.

- Main-branch browser tests: 1,332 passed, 0 failed; Vite production build passed in run 41053956460.
- Python 3.11/3.12/3.13, clean wheel installation, teacher-corpus audit, system verification, and browser G2P integration passed in runs 41053956460, 41053956498, and 41053956423.
- GitHub Pages deployment run 41053956599 completed successfully. HTTP smoke passed for index.html, system.html, and the first JS asset; Playwright live browser smoke passed the adversarial Korean passage and existing Hanja, clipboard, accessibility/mobile, mode-disclosure, and methodology checks.
- Public service: https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/ .
- The deployed Super-soft mode now displays low-confidence share beside candidate and trace coverage. A follow-up live smoke assertion is being added on branch docs/live-super-soft-confidence-smoke-2026-10-30 to verify the exact numeric UI label; the previous live smoke already verified the Super-soft path, candidate, IPA, 100% modern-Hangul coverage, and low-confidence disclosure.

**Superseding status:** PR #384 is MERGED; deployment run 41053956599 is SUCCESS. The earlier statement that PR #384 remained open/no deployment had not yet been refreshed at the time it was appended and is superseded by this section.

**Readiness:** software implementation and public deployment are verified. Independent Korean pronunciation accuracy and Ukrainian target quality remain BLOCKED / EVIDENCE-LIMITED pending adjudicated gold and specialist review. Python CLI/API Super-soft parity remains DEFERRED. The service is a deterministic research prototype, not a linguistically accuracy-certified product.

# Final live-metric verification (2026-10-30)

PR #385 was merged into main by squash commit 0ab1e2c3da0210a76b6edc63c0190a499ff36fab. This supersedes the earlier note that the numeric Super-soft confidence smoke was still being added.

- Main browser tests: 1,332 passed, 0 failed in run 41054652297.
- Python 3.11/3.12/3.13 regression and data checks passed; system verification passed in run 41054652213; master/research artifact generation passed in run 41054652115.
- GitHub Pages deployment completed successfully in run 41054652088. HTTP smoke, static build, and live Playwright browser smoke passed.
- The live Super-soft smoke now asserts the exact numeric status pattern `низька впевненість: N% (n/total)` and verifies the Hangul denominator, in addition to candidate/IPA presence and complete modern-Hangul/trace coverage.
- Public URL: https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/ .
- Final main commit at this handoff update: 0ab1e2c3da0210a76b6edc63c0190a499ff36fab. PR #384 and PR #385 are merged. PR #371 remains open and untouched as a separate benchmark effort.

**Final readiness:** deterministic browser implementation, confidence/target-coverage transparency, regression controls, and public deployment — DONE_VERIFIED. Independent Korean pronunciation accuracy and Ukrainian target quality — BLOCKED / EVIDENCE-LIMITED pending independently adjudicated gold and specialist review. Python CLI/API Super-soft parity — DEFERRED. This remains a deterministic research prototype, not an accuracy-certified linguistic release.

# Super-soft inline uncertainty notation (2026-10-30)

**User-facing convention:** in the Super-soft research candidate, square brackets mark only the Ukrainian target span whose Korean phonological derivation or IPA→Ukrainian mapping is low-confidence/provisional. Example: `ка[кап]і[іт]`; unbracketed spans are not thereby certified as independently accurate. Brackets do not repeat the reading, do not contain IPA, and do not mark the entire word unless the entire trace unit is uncertain.

- Added deterministic trace-based rendering in `src/app/super_soft_annotation.js`; the underlying IPA and unannotated candidate fields are not mutated.
- Low-confidence fallback/heuristic statuses, low-confidence uncertainty metadata, and provisional lexical target mappings are bracketed per trace item.
- Strict, Soft, Practical, and ordinary candidate displays are unchanged; annotation is enabled only when the research-only Super-soft mode is selected.
- The candidate note explains the notation; live Pages Playwright smoke asserts that the Super-soft candidate contains bracketed uncertainty.
- Verification is pending exact-head CI and live deployment smoke. No Korean phonology rule, IPA value, or Ukrainian correspondence was changed by this presentation feature.

# Final verification — Super-soft uncertainty brackets (2026-10-30)

PR #387 was merged to `main` as `a1c03fec1316433ab6f496b7ed88002c53c93067`.

- **Behavior:** only in the opt-in Super-soft research candidate, low-confidence phonological fallback/heuristic spans and provisional IPA→Ukrainian target spans are wrapped in square brackets, per trace item. Confident trace spans remain unbracketed. The candidate note defines `[fragment]` as uncertainty notation.
- **Pipeline integrity:** annotation consumes the existing per-span trace and IPA-derived Ukrainian segment; it does not alter IPA, the underlying unannotated candidate, lexical data, or phonological rules. Strict, Soft, Practical, and non-Super-soft candidate displays remain unchanged.
- **Browser suite:** 1,334 passed, 0 failed; production build passed in exact-head run [41058618197](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41058618197).
- **System verification:** passed in run [41058618272](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41058618272).
- **Python:** 3.11, 3.12, 3.13 regression/data checks and clean wheel installation passed in run [41058618197](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41058618197).
- **Browser G2P integration:** passed in run [41058618240](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41058618240).
- **Research artifacts:** master table/research corpus artifacts passed in run [41058618233](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41058618233); exhaustive test-case register extraction passed in run [41058469280](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41058469280).
- **Deployment/live smoke:** GitHub Pages deployment, HTTP smoke, and Playwright live-browser smoke passed in run [41058618208](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41058618208). The live smoke selected the Super-soft candidate and asserted bracketed uncertain spans plus the explanatory note.
- **Public site:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/ .

**Status:** bracketed uncertainty display — DONE_VERIFIED and deployed. This is a presentation of the engine's existing confidence metadata, not a claim that unbracketed spans are independently certified. Independent Korean pronunciation accuracy and Ukrainian target quality remain BLOCKED / EVIDENCE-LIMITED pending adjudicated gold and specialist review; Python CLI/API Super-soft parity remains DEFERRED.


# Two-engine methodology and service disclosure follow-up — 2026-10-30

**Branch:** `docs/full-methodology-service-clarity-2026-10-30`  
**Base:** `main` at `11f03cc261ebc8385ab76b6e0041fd9fe9f0563d`  
**PR:** [#397 — Document the two Korean engines and complete Kozak Kim methodology](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/397)  
**Latest branch head at this handoff update:** pending this handoff commit; inspect the PR head for the exact SHA.

## Work completed in this branch

- Updated the service mode description so users see directly that **Режим докладного аналізу** uses the project's own deterministic Kozak Kim engine, unlike **Звичайний режим** on the JavaScript g2pK port. The existing direct methodology anchor remains linked from the explanatory disclosure.
- Expanded `system.html` with the pinned browser-port identity/configuration, upstream provenance and Apache-2.0 notices, the distinction from Python g2pK/MeCab, the Kozak Kim module map, the strict/soft/super-soft mode boundaries, and the actual Super-soft coverage contract.
- Refreshed section 19 against main's 2026-10-30 exact-head evidence: browser tests 1,339/1,339; Vite build; Python 3.11/3.12/3.13 regression and wheel checks; system verification; master/research artifact generation.
- Added paired benchmark confidence intervals and retained the mixed conclusion: the small UGTPHON exact-match edge is g2pK's, while SIGMORPHON exact match favours native; paired CER intervals cross zero. Neither benchmark evaluates Ukrainian target quality or proves a universal winner.
- Updated `docs/methodology.md` with the two-engine architecture and a compact account of all three Kozak Kim modes.
- Fixed the live Pages smoke's ambiguous `.mode-disclosure` selector by selecting the ordinary-mode disclosure using its summary text; added a regression contract to prevent the ambiguity from returning.

## Verification evidence and honest status

- Main baseline commit: `11f03cc261ebc8385ab76b6e0041fd9fe9f0563d`.
- Main browser suite/build: run [41084643011](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41084643011) — **PASS**, 1,339 tests passed, 0 failed; Vite build passed; Python 3.11/3.12/3.13 matrix and wheel build passed.
- Main system verification: [41084642910](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41084642910) — **PASS**; official NIKL metadata-only inventory was **SKIPPED**, not passed.
- Main master/research artifacts: [41084643006](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41084643006) — **PASS**.
- Main Pages run [41084642903](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41084642903): deployment and HTTP smoke passed; live Playwright smoke failed because the generic locator matched two disclosure elements. This is a test-selector failure, not a pronunciation assertion. The PR fixes the selector, but the fix is not yet verified until exact-head CI runs.
- PR #397 exact-head runs [41101168856](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101168856), [41101168913](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101168913), [41101168889](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101168889), [41101168989](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101168989), and [41101168912](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101168912) were **QUEUED** at the time of this update. No PR test pass is claimed.
- Local commands were not run: this GitHub connector session does not provide a checked-out working tree. Verification must come from exact-head GitHub Actions, not an assumed local run.

## Task ledger

| Task | Status | Evidence / remaining acceptance |
|---|---|---|
| Visible service distinction between g2pK and Kozak Kim | PARTIAL | Copy is updated; exact-head browser/UI test and live Pages smoke still need to pass. |
| Full researcher-facing engine/mode methodology | PARTIAL | Source-grounded page and companion document updated; exact-head test and build pending. |
| Benchmark interpretation and CI evidence | DONE_VERIFIED | Figures and caveats checked against the current multi-engine report and main workflow runs cited above. |
| Pages smoke selector repair | PARTIAL | Source and contract test updated; exact-head Actions run must prove it passes. |
| Independent Korean pronunciation gold and Ukrainian target gold | BLOCKED / EVIDENCE-LIMITED | No independently adjudicated, sufficiently representative holdout corpus and specialist review yet. |
| Python CLI/API Super-soft parity | DEFERRED | Current scope is the browser service; the methodology explicitly avoids implying parity. |

## Scope preserved

- No Korean phonological rule, lexical pronunciation, IPA value, or Ukrainian target mapping was changed.
- PR #371 (extended multi-engine benchmark) remains open and untouched; its benchmark work is independent of this documentation/service-clarity change.
- No merge, release, or production-setting change was performed.

**Next acceptance gate:** wait for PR #397 exact-head test, Python/data, browser G2P, artifact-generation, and live Pages checks. Fix only evidence-backed failures, then update this handoff with the final head SHA and actual run conclusions. Until that gate is green, the PR remains **PARTIAL**, not release-ready.


## Final documentation-link and queue refresh — 2026-10-30 17:46 UTC

- Corrected the two remaining IPA-first evidence links in `system.html` that still pointed to the historical `test/block-standard-rule-coverage-gate-2026-10-11` branch. They now resolve against `main`; both target files are present on the default branch.
- Code/documentation head before this handoff-only refresh: `827a4e00c879f1c39f73275e403e9e2f16c626a7`. The handoff update itself is documentation-only; the PR head is authoritative for the resulting commit SHA.
- Latest PR-head workflows for code/documentation head `827a4e00c879f1c39f73275e403e9e2f16c626a7` are queued: tests [41101428380](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101428380), system verification [41101428438](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101428438), Browser G2P integration [41101428325](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101428325), master/research artifacts [41101428447](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101428447), and exhaustive test-case register extraction [41101428483](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101428483). Queue state is not a pass.
- PR #397 remains open and unmerged. No production release or merge was performed.


## Final exact-match assertion correction — 2026-10-30 17:47 UTC

- Tightened the methodology contract test to assert the exact positive wording actually used for the native SIGMORPHON exact-match delta (`вищий на 0,4012 відсоткового пункта`). This is a test expectation correction only; no benchmark data or engine behavior changed.
- Latest code/documentation/test head: `aea77aa42100cc5ab0cd013eac48767789786f84`.
- Exact-head runs at this point remain **QUEUED**: tests [41101524940](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101524940), system verification [41101524989](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101524989), Browser G2P integration [41101524894](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101524894), research artifacts [41101525219](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101525219), and exhaustive register extraction [41101525065](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41101525065). No exact-head pass is claimed.


## Exact-head CI resolution and final handoff — 2026-10-30 18:34 UTC

- Corrected the exact browser/UI contract regression found by CI. The pre-existing test requires the user-facing phrase `Власна розробка з детермінованим рушієм Козака Кіма`; the first wording update had replaced that exact phrase with a semantically similar but contract-incompatible formulation. Restored the tested phrase while retaining the explicit contrast with ordinary mode on g2pK. This is a copy/contract correction; no engine behavior or phonological data changed.
- Corrected code/documentation head: `e3331ce8cdb24146bf79471390284a076aac5684`.
- Exact-head browser G2P integration [41107787309](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41107787309): **PASS**.
- Exact-head system verification [41107787171](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41107787171): **PASS**; Python regression/data-integrity job passed. Official NIKL metadata-only inventory was **SKIPPED**, not a crawl or source validation.
- Exact-head browser tests/build [41107787277](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41107787277): **PASS**, 1,340 / 1,340 tests, 0 failures; Vite production build passed. Python 3.11, 3.12, 3.13, teacher-corpus audit, and wheel-install jobs all passed in the same workflow.
- Exact-head master/research artifacts [41107787203](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41107787203): **PASS**.
- Exact-head exhaustive test-case register extraction [41107787353](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41107787353): **PASS**.
- The earlier failures on `6184285` were a single UI-contract mismatch: the changed service copy no longer matched the existing exact phrase assertion. CI logs confirmed the phonology/G2P logic was not the cause. The corrected exact-head run now passes.
- The PR's browser smoke selector repair is covered by the passing source contract and build/tests. The live Pages Playwright smoke still requires a post-merge deployment run; no deployment is claimed here.
- Task ledger update: visible service distinction — **DONE_VERIFIED** (exact-head tests/build); researcher-facing two-engine and Kozak Kim methodology — **DONE_VERIFIED** (exact-head tests/build, research artifacts); benchmark interpretation — **DONE_VERIFIED**; browser G2P integration — **DONE_VERIFIED**; Python regression/data integrity and 3.11/3.12/3.13 + wheel — **DONE_VERIFIED**; master/research artifacts and exhaustive register extraction — **DONE_VERIFIED**; live Pages smoke repair — **PARTIAL** pending the post-merge deployed-browser acceptance run; independent specialist-adjudicated Korean pronunciation gold and Ukrainian target gold — **BLOCKED / EVIDENCE-LIMITED**; Python CLI/API Super-soft parity — **DEFERRED**.
- PR #397 remains open and unmerged. Public Pages has not yet received these changes. PR #371 remains untouched. No pronunciation rules, lexical outputs, IPA values, Ukrainian mappings, external settings, or release state were changed.
- Connector-only execution limitation remains: no local checkout was available, so no local shell test commands are claimed; the exact-head GitHub Actions results above are the verification evidence.

**Current acceptance state:** implementation and all PR-head CI gates listed above are green at code/documentation head `e3331ce8cdb24146bf79471390284a076aac5684`. The PR is suitable for review/merge from a CI perspective, but deployment/live-browser acceptance is pending after merge. Research accuracy is not certified by CI and remains evidence-limited.


## Final PR-head rerun confirmation — 2026-10-30 18:35 UTC

The handoff-only branch head `f7177a03c849c03d7c0f77d0aafb05206f55b34d` has now also completed its rerun:
- Browser regression tests/build: **PASS** (1,340 / 1,340; Vite build) — [run 41108026830](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41108026830).
- Python regression/data integrity: **PASS** — [run 41108026830](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41108026830).
- Python 3.11/3.12/3.13, teacher-corpus audit, wheel installation: **PASS** — [run 41108026860](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41108026860).
- Browser G2P integration: **PASS** — [run 41108026931](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41108026931).
- Corpus generation: **PASS** — [run 41108026834](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41108026834).
- Exhaustive test-case register extraction: **PASS** — [run 41108026977](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41108026977).
- Official NIKL metadata-only inventory: **SKIPPED** in the system workflow; it is not represented as a successful live inventory/crawl.
- Live Pages deployment/Playwright smoke remains post-merge acceptance, not part of these PR-head checks.

PR #397 is open, unmerged, and GitHub currently reports it mergeable. The implementation is CI-green and review-ready; the public site is not updated until the PR is merged and Pages deployment passes.


## Merge and production deployment acceptance — 2026-10-30 18:49 UTC

- PR [#397](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/397) was squash-merged after all required PR-head checks passed. Merge commit: `4ee68ae0be1ec9431d3101e847f196d292d8f06e`. This is now the `main` branch implementation commit.
- Main-branch browser tests/build: **PASS** — [run 41109750124](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41109750124).
- Main-branch system verification: **PASS** — [run 41109750290](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41109750290).
- Main-branch master/research artifacts: **PASS** — [run 41109750198](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41109750198).
- GitHub Pages deployment: **PASS** — [run 41109750296](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41109750296). Python 3.11/3.12/3.13 regression and data checks all passed; browser tests and static build passed; deployment job completed successfully.
- Deployed HTTP smoke: **PASS** for `index.html`, `system.html`, and the first built JavaScript asset at `https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/`.
- Deployed Playwright browser smoke: **PASS**. The live run verified the deterministic Hanja dictionary chunk/output, result announcement, mode disclosure, clipboard-denial fallback, mobile trace labels at 390 px, and methodology navigation. It processed a 1,443-character Korean input and observed the expected inline candidate/IPA outputs. The output status explicitly retained its uncertainty wording: `g2pK · Словникова вимова застосована · Показано попередній кандидат, не підтверджений результат`.
- Therefore the previous live Pages smoke blocker is **DONE_VERIFIED**. The service update is deployed and its production HTTP/browser smoke passed.
- Public URLs: [service](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/index.html) · [methodology](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#methodology-02c-kozak-kim).
- PR #371 remains open and untouched; it is a separate benchmark-metrics workstream. Independent specialist-adjudicated Korean pronunciation gold and Ukrainian target gold remain evidence-limited; this release makes no new claim of independent linguistic certification. Python CLI/API Super-soft parity remains deferred.
- Release classification for this scope: **deployed documentation/service-clarity update, CI-green and live-smoke-verified**. The underlying research prototype is not thereby certified as a fully accurate Korean-to-Ukrainian pronunciation standard.


## Corrected extended benchmark verification — 2026-10-30

**Status: DONE_VERIFIED for the baseline benchmark implementation and both pinned dataset runs; PARTIAL for neural pairing and independent linguistic validity.**

- PR [#401](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/401), branch `bench/extended-metrics-ledger-integration-2026-10-31`, source head `e27725c62ee02b00fda6d6e76f178d0479609bf9`; GitHub PR merge-test commit `0712f9d03c8f266d10bd0f696320f87a380ef3d1`.
- Benchmark workflow [41138727409](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41138727409): **PASS**. Exact job `124347562740` completed successfully; both datasets ran, both occurrence ledgers validated (schema v1, 10 engines × 2,703 UGTPHON occurrences and 10 engines × 999 SIGMORPHON occurrences), and artifact `multi-engine-korean-ipa-diagnostic` (artifact ID `13018218724`) uploaded.
- The corrected scoring now independently selects the closest IPA gold alternative for exact/CER, PER, and feature-weighted proxy. Latency p95 uses nearest-rank; the previous four-observation tail-loss regression is covered by tests.
- **UGTPHON diagnostic split** (2,703 token occurrences; native 2,698 scored, 5 abstentions): native exact 53.0022%, CER 9.1697%, PER 9.6139%, feature proxy 4.8765%; g2pk exact 53.0892%, CER 9.2285%, PER 9.6472%, proxy 4.8952%; g2p-ko 1.0.0 exact 52.4602%, CER 9.3885%, PER 9.8446%, proxy 4.9779%; KoG2Padvanced exact 47.3178%; phonemize exact 42.5453%. Full 10-engine results and per-occurrence provenance are in the workflow artifact/log.
- **SIGMORPHON 2021 lexical diagnostic split** (999 token occurrences; native 998 scored, 1 abstention): native exact 35.7715%, CER 14.6978%, PER 16.2343%, feature proxy 7.5491%; g2pk exact 35.3353%, CER 14.8222%, PER 16.3126%, proxy 7.5990%; g2p-ko 1.0.0 exact 35.6356%, CER 14.6970%, PER 16.2351%, proxy 7.5524%; KoG2Padvanced exact 32.6326%; phonemize exact 28.9289%.
- These are **diagnostic benchmark results**, not adjudicated independent Korean IPA gold. UGTPHON includes test-informed material; neither set establishes Ukrainian target-layer accuracy. Do not present tiny differences between native/g2pk/g2p-ko as statistically decisive without paired artifact-level analysis.
- Neural CharsiuG2P inference, licensed ByT5 inference, and paired neural aggregation were **SKIPPED** because the explicit `workflow_dispatch` opt-in was not selected. This is intentional, not a failure or a successful neural comparison.
- The artifact upload is verified, but the archive's contents have not been independently inspected in this connector session. Use the artifact as the inspectable source before promoting corrected PER/PFER tables into public methodology.
- External-only/legal caveats remain: KoG2Padvanced has no declared upstream license; Charsiu weights licensing and train/test overlap are unresolved; no third-party weights or source are vendored.
- No production phonology, IPA mapping, Ukrainian target mapping, runtime UI, deployment, or release changed.

**Next acceptance gates:** recruit two independent Korean phonetics/phonology reviewers for issue #337 using the separate blind packets; after IPA is frozen, complete a separate Ukrainian-target review; resolve Charsiu checkpoint licensing/training manifest and KoG2Padvanced license. Neural inference remains a manual, default-off research opt-in and should only run after legal/evidence gates are cleared. PR #371 remains open/divergent with useful corrections selectively ported through #401; PR #398 is closed as superseded; PRs #401–#405 are merged.


### Artifact-level integrity verification — 2026-10-31

Downloaded and inspected GitHub artifact `13018218724` (10 files; ZIP archive). Independently parsed both report JSON files:
- UGTPHON: all 10 engine ledgers have exactly 2,703 ordered occurrence IDs; source identity triples (row_id, token, gold) are identical across engines; each engine's recomputed scored/exact counts match the aggregate report.
- SIGMORPHON: all 10 engine ledgers have exactly 999 ordered occurrence IDs; source identity triples align across engines; recomputed scored/exact counts match aggregates.
- The native-vs-g2pk occurrence audit is complete: UGTPHON counts 1,429 both-exact, 1,264 both-not-exact, 4 g2pk-only exact, 1 native-only exact, and 5 native abstentions (2 where g2pk is exact); SIGMORPHON counts 353 both-exact, 641 both-not-exact, 4 native-only exact, and 1 native abstention where g2pk is not exact. These are comparisons to the corpus annotation, explicitly not normative gold.
- Report supplemental status confirms rule accuracy and Ukrainian target metrics are NOT_MEASURED; output determinism is not asserted; comparable peak RSS is not measured. PER is a broad-IPA segment metric; feature-weighted error is a project-defined proxy, not a standardized universal PFER.
- Artifact integrity assertions executed in the analysis runtime: **PASS** (ledger ordering/count, cross-engine source identity alignment, recomputed scored/exact totals for both datasets).

This validates internal report consistency, not corpus validity or linguistic correctness. Public methodology score publication still requires review of the exact artifact-derived tables and caveats; no new accuracy claim is authorized by this consistency check.


## PR #401 integration and corrected public benchmark disclosure — 2026-10-31

**Integration: DONE_VERIFIED.** PR [#401](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/401) was squash-merged to `main` as `eb8e1f100e8aca377aef05a2aa896756c909ec5c`. The benchmark run [41138727409](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41138727409) passed on benchmark-code commit `e27725c62ee02b00fda6d6e76f178d0479609bf9`. The four commits from that tested code head to PR head `104a49c04e2ecc6f613fc60cc44101fc1f85474e` changed only the canonical handoff and benchmark register; the GitHub compare confirms no workflow, script, or test changes. Therefore the successful benchmark is code-equivalent to the merged tree. The redundant documentation-head benchmark rerun [41141286672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286672) was still in progress at merge time; it is not represented as a pass.

**Exact-head and post-merge verification:**
- PR-head Python 3.11/3.12/3.13, web tests/build, clean wheel install, teacher-corpus audit: **PASS** — [41141286664](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286664).
- PR-head system verification: **PASS** — [41141286671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286671).
- PR-head master/research artifacts: **PASS** — [41141286694](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286694).
- PR-head exhaustive test-case extraction: **PASS** — [41141286716](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286716).
- Post-merge main browser tests/build and Python regression/data integrity: **PASS** — [41142749793](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41142749793).
- Post-merge Python 3.11/3.12/3.13, web tests/build, wheel install, teacher-corpus audit: **PASS** — [41142749808](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41142749808).
- Post-merge master/research artifact generation: **PASS** — [41142749796](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41142749796).
- Post-merge Pages deployment [41142749819](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41142749819): **PASS**. Python 3.11/3.12/3.13 corpus and pipeline checks, browser regression tests, both-page static build, artifact verification, Pages deploy, HTTP smoke, and live Playwright smoke of practical mode with an adversarial Korean passage all passed. The metadata-only NIKL inventory was **SKIPPED**, not passed.

**Public benchmark correction:** `system.html` and `docs/methodology.md` are being refreshed in branch `docs/korean-benchmark-evidence-refresh-2026-10-31` to replace the stale pre-correction native/g2pK figures with the inspected schema-v1 artifact results. Rates are stated over each engine's scored predictions, with coverage/abstentions shown separately. The feature-weighted metric is explicitly described as a project-defined proxy. Neither benchmark establishes independent Korean IPA gold or Ukrainian target quality.

**Remaining gates:** independent specialist-adjudicated Korean IPA gold and Ukrainian target gold remain **BLOCKED / EVIDENCE-LIMITED**; CharsiuG2P training overlap and weights-license status remain unresolved; KoG2Padvanced upstream license is undeclared; neural inference and paired neural aggregation remain opt-in and were skipped. Issue [#337](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/issues/337) still has no qualified reviewer submissions. Potential reviewer leads are listed in the current task ledger but have not been contacted. PR #371 remains open/divergent; PR #398 is closed as superseded.


## PR #402 integration and current CI evidence refresh — 2026-10-31

**Integration: DONE_VERIFIED.** PR [#402](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/402) was squash-merged to `main` as `17ed09fd96ea5883172c4a5f908177535ef4ed29`. It replaces the stale pre-correction native/g2pK benchmark figures in the public service methodology and technical methodology with the artifact-inspected PR #401 results. The public disclosure reports each engine's scored denominator and abstentions separately, and labels PER and the feature-weighted proxy accurately.

**Exact-main post-merge verification at `17ed09fd96ea5883172c4a5f908177535ef4ed29`:**
- System verification [41143243310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143243310): **PASS** — 1,340 / 1,340 browser tests, Python regression/data integrity, and Vite 8.3.1 production build.
- Tests workflow [41143243218](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143243218): **PASS** — Python 3.11/3.12/3.13, web tests/build, clean wheel installation, and teacher-corpus audit.
- Master/research artifact generation [41143243251](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143243251): **PASS** — master table and strict Korean corpus generation/artifact upload.
- Pages deployment [41143243225](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143243225): **PASS** — Python checks, browser tests/build, Pages deployment, HTTP smoke, and live Playwright smoke of practical mode using an adversarial Korean passage.
- Official NIKL metadata-only inventory: **SKIPPED**, not passed.

PR [#403](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/403) merged as `f2e870eb45edc821af712c243774baa549e2ded1`, refreshing the public methodology's stale CI section (formerly 1,339 tests and an older incomplete deployment smoke) to current exact-main evidence. Exact-head run [41143561334](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143561334) passed. Post-merge main runs also passed: system verification [41143654455](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143654455), Python/web/wheel/teacher audit [41143653449](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143653449), master/research artifacts [41143653435](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143653435), and Pages deployment/live smoke [41143653453](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41143653453). The metadata-only NIKL inventory remained SKIPPED.

The PR #401 documentation-head benchmark rerun [41141286672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286672) later completed **PASS** and uploaded artifact `13019822857`. Independent inspection confirmed 10 ordered ledgers × 2,703 UGTPHON and 10 × 999 SIGMORPHON occurrences; IDs, source identity triples, and recomputed scored/exact totals align. Aggregate metrics match artifact `13018218724`. CharsiuG2P, ByT5, and neural pairing were SKIPPED under default-off opt-in.

**Still blocked/evidence-limited:** independent specialist-adjudicated Korean IPA gold, independent Ukrainian target gold, qualified reviewer submissions for issue #337, Charsiu checkpoint weights licensing and full training-overlap resolution. Neural inference and paired neural aggregation remain default-off opt-ins; KoG2Padvanced upstream license is undeclared. These prevent research certification, not the software CI/build/deployment gates.


## Latest exact-head benchmark rerun and rounding correction — 2026-10-31

The documentation-head rerun [41141286672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286672) completed **PASS** on code-equivalent PR #401 head `104a49c04e2ecc6f613fc60cc44101fc1f85474e`. Artifact `13019822857` (`multi-engine-korean-ipa-diagnostic`) was downloaded and independently checked:
- 10 engine ledgers × 2,703 UGTPHON occurrences and 10 × 999 SIGMORPHON occurrences;
- ordered occurrence IDs, identical source identity triples across engines, and recomputed scored/exact counts all **PASS**;
- all aggregate metric values match the previously inspected artifact `13018218724` for both datasets.

**Rounding correction:** SIGMORPHON native exact match is 357/998 = 0.357715, i.e. **35.7715%** to four decimal places (not 35.7716%). The earlier 35.7716% transcription was a rounding typo; no underlying count or metric changed. Corrected consistently in `system.html`, `docs/methodology.md`, this register, and the methodology contract test.

Neural CharsiuG2P, ByT5, and paired neural jobs were **SKIPPED** under the default-off opt-in. This run does not resolve independent Korean IPA gold, Ukrainian target gold, checkpoint licensing, or training-overlap uncertainty.


## Selective port of methodology evidence register and review record — 2026-10-31

The useful methodology work from open PR [#398](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/398) is being selectively ported, not merged wholesale. Two new canonical documents are added:
- `docs/METHODOLOGY-CLAIMS-AND-EVIDENCE-REGISTER-2026-10-30.md`: public-claim → implementation/test/source/artifact mapping with DONE_VERIFIED / PARTIAL / BLOCKED / DEFERRED statuses.
- `docs/METHODOLOGY-DEBATE-REVIEW-2026-10-30.md`: structured academic/evidence/engineering review lenses and adjudication rules.

Both were rewritten against the current main state: PRs #401–#404, corrected metrics, final artifact `13019822857`, current CI, and current licensing/reviewer blockers. Stale #398 claims about a statistically noticeable SIGMORPHON advantage were removed; paired exact-classification McNemar p=0.125 is now recorded as non-significant. Historical Charsiu scores remain explicitly historical because current inference was skipped.

**Important distinction:** the review record documents structured analytical perspectives based on published skill instructions. It does not claim independent human review, autonomous external agents, or participation by the skill authors. Issue [#337](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/issues/337) still has no qualified independent reviewer submissions.

The new documents are linked from README and guarded by the methodology contract test. No pronunciation rules, IPA values, Ukrainian target mappings, or runtime behavior changed.


### RR contextual adapter follow-up — coda ㅇ and Ukrainian target convention (2026-10-31)

- Added a focused regression for Hangul 강: the surface RR unit is `gang`; the final `ng` is one coda correspondence unit and the current project output is `нг` (`канг`). The trace must contain one coda mapping, not two independent mappings for `n` and `g`.
- Clarified the data row and the public comparison table: `нг` is a **provisional project digraph candidate for one Korean velar nasal [ŋ]**, not an instruction to pronounce a two-consonant sequence /n+ɦ/ or /n+g/. This preserves the RR distinction from coda `n`, but reader interpretation is not validated and must remain a target-review item.
- This decision intentionally does not silently force the RR route to copy the IPA-first route's current `ŋ → н` practical mapping. The two routes have different contracts; their divergent target spellings are a known cross-route consistency question for independent Ukrainian phonetic review, not evidence that either one is correct.
- Test-first commit: `4a766a1f1dec91373694ca05631ac055b1bce4ad` added the regression asserting `кан`; review of the existing comparison table and correspondence decision showed that this assertion contradicted the declared RR project convention. The test was corrected in `fd11f799424672be62551cc6a43cecb39241e875` to assert the intended one-unit `нг` candidate. The data and public methodology clarification are in `b399542c6ae17310f8f201ad201a9d596f3639bc` and `edb6de5edf766f562448fcbab090e055f6a0e97b`.
- Exact-head GitHub Actions were queued at the last check; no fresh test/build pass is claimed. Local execution is unavailable in the connector-only environment. Keep M-18/M-19/M-21/M-22 PARTIAL until exact-head checks complete; independent Ukrainian reader/phonetic review remains BLOCKED.


### RR trace visibility follow-up — 2026-10-31

- The adapter already returned `mapping_id` and `notes` for each selected RR correspondence, but the browser trace rendered only the RR unit, phonological feature and context. This made the selected rule itself invisible to users.
- Added UI rendering for the selected rule ID and mapping rationale; the UI contract test now requires both fields. This is an observability correction, not a change to phonetic rule selection or Ukrainian output.
- Test contract commit: `5074596cb13ed3c478ddbd3eecff9197352a15ea`; implementation commit: `3c75c398a4dad87d2895a3f421189b11a9f4de92`. Exact-head Actions are queued; no pass is claimed until completed. Local Node/build execution is unavailable in this connector-only session.


### RR correspondence-key correctness — 2026-10-31

- Review found that the base correspondence loader keyed rows only by `layer + RR`. Several distinct Korean coda Jamo share the same RR surface value (for example ㄱ, ㄲ, ㄳ, ㄺ → `k`), so later CSV rows overwrote earlier ones. The Ukrainian output could remain identical, but the trace could report the wrong source Jamo/rule rationale.
- Added a regression comparing 각 (ㄱ coda) and 넋 (ㄳ coda), both with RR `k`, and requiring distinct trace IDs `ㄱ:coda` and `ㄳ:coda` plus the complex-coda note. Updated correspondence indexing and lookup to use the triple `layer + Hangul Jamo + RR unit`. This preserves source identity without changing the selected Ukrainian string.
- Test contract commit: `0a458011f5cd8afdc0d8414e6778e4f21e30d3fd`; implementation commit: `2e9a92147d672e51bbe0b8815c7cd0ccb87a8659`. Exact-head tests/build are still pending in GitHub Actions; local execution remains unavailable.


### Final execution checkpoint — 2026-10-31

- Starting default-branch commit: `5cec9deb4a8d622cd5f0ba969a2fd49b17281f43` (`main`). Working branch: `feat/korean-rr-contextual-phonetics-final`. Final branch head at this checkpoint: `03b68edc89b2c308df3d1cd7b6dcc387d21aea02`. Branch is 41 commits ahead of base; PR [#411](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/411) remains open and unmerged.
- Exact-head Actions: tests run [41237280487](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41237280487), system verification [41237280525](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41237280525), and master/research artifacts [41237274934](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41237274934) were still QUEUED at the checkpoint. No exact-head test/build/deployment pass is claimed. The connector-only environment did not provide a local checkout/runtime, so `npm test`, `npm run build` and Python suites could not be run locally.
- Executed independent remote-data contract inspection: 68 base correspondence rows (20 onset, 21 vowel, 27 coda), 43 context rules, zero duplicate composite `layer:hangul:rr` keys, zero duplicate context-rule IDs; confirmed the coda-`ㅇ` digraph status, composite lookup implementation, coda-identity regression, and UI rendering/test assertions for `mapping_id` and `notes`. This is a static data/code contract check, not a substitute for the repository test suite.
- Open PR #371 remains untouched: its benchmark branch is 117 commits ahead and 34 behind main (diverged); useful benchmark work was already selectively integrated through the mainline PR history and it is unrelated to this RR task. No merge, release, or deployment setting was changed.
- Readiness: RR contextual implementation is present on the PR branch, but it remains PARTIAL pending exact-head CI and independent Ukrainian target review. No superiority claim over Kholodovich–Konzevich is supported without a held-out comparison corpus and blinded reader evaluation.


---

## Continuation — confirmed product contract and CI repair — 2026-10-31

### Owner decisions (confirmed in chat)

- Audience: both general users and specialists; default presentation should be accessible, with full technical trace available.
- Dialect: standard South Korean (Seoul-based standard).
- IPA: expose both phonetic and phonemic representations where the selected engine can support them; label the profile, engine and provenance. Do not imply that one engine emits both if it does not.
- Hanja: bidirectional goal (Hangul → Hanja annotation and Hanja → Hangul reading), including mixed Hangul/Hanja input. Existing dictionary-backed Hangul → Hanja preview is not evidence that reverse conversion is implemented. Reverse readings must retain ambiguity and must not silently choose a homophone.
- Primary Ukrainian target: the project's existing author-developed Ukrainian **transliteration / practical Ukrainian rendering system**, to be improved in place. Do not replace it with a new transcription system. Keep the IPA-mediated and RR-mediated input routes distinct and inspectable; terminology in UI must follow this product contract. Do not conflate the Ukrainian target with IPA itself.
- Detail: full expert trace is available; ordinary users get a simple result first.
- Test data: create additional adversarial Korean stimuli as project-generated fixtures; label them as synthetic test inputs, not authoritative pronunciation gold. Existing adversarial corpus files are retained and extended only where a distinct gap is identified.

### Verified engine inventory

- Ordinary browser mode: pinned JavaScript port of g2pK via `createG2pWebAdapter`; UI currently identifies it as g2pK.
- Detailed research mode: project-owned deterministic Kozak Kim engine; separate strict/soft/super-soft modes.
- RR mode: browser-only resolved Hangul surface → NIKL Revised Romanization → project-authored Ukrainian correspondence adapter. It is not the IPA-first route.
- The displayed IPA is currently the IPA result emitted by the selected G2P engine; the repository has not yet established a separately selectable phonemic-IPA engine/profile in the user interface. Acceptance requires an explicit phonetic/phonemic profile contract and engine provenance, not merely a second label.

### Task ledger

| Task | Status | Evidence / next acceptance |
|---|---|---|
| Preserve and improve the existing Ukrainian target | PARTIAL | Existing IPA-first and RR-mediated adapters are preserved. Treat the project target as the primary Ukrainian output; audit labels and methodology terminology without changing its data contract blindly. Acceptance: documented target contract, route provenance, regression coverage. |
| Expose phonetic and phonemic IPA | PARTIAL | Existing engine IPA is visible, but no confirmed selectable dual-profile contract is established. Acceptance: engine-specific profile definition, feature-preserving conversion or independently sourced output, tests and provenance; no fabricated narrow IPA. |
| Hanja Hangul→Hanja | DONE_VERIFIED as dictionary annotation preview | `src/app/hanja.js`, pinned libhangul-derived BSD-3-Clause data and existing tests; lexical annotation only, with conservative Hangul fallback. |
| Hanja Hanja→Hangul and mixed-script input | TODO | Reverse dictionary/readings and an input normalization/UI contract are not implemented. Acceptance: source-attributed reverse index, explicit multiple-reading alternatives, no silent homophone selection, mixed-script regression tests, and correct IPA/RR processing after user selection. |
| Standard South Korean dialect default | PARTIAL | Current data and source-rule inventory are standard South Korean/NIKL oriented; make the dialect/profile explicit in UI and trace. Acceptance: documented scope and regression fixtures; no claim of North Korean coverage. |
| Generated adversarial Korean tests | PARTIAL | Extensive pre-existing adversarial fixtures already cover coda liaison, complex codas, palatalization, assimilation, fortition, aspiration, n-insertion, morphology, names/loans, minimal contrasts and rule chains. Add only new, non-duplicative synthetic passages with no invented gold labels. |
| Fix exact-head web test failures | PARTIAL | Previous exact-head CI run 41237406700 failed 2/1,370 web tests (1,368 passed): (a) stale expectation `희망` → `гіманґ` conflicted with the declared provisional coda `ㅇ→нг` mapping; test now expects `гіманг`; (b) trace omitted ㅅ/ㅆ-before-ㅣ palatalization metadata; adapter now records feature, mapping ID and vowel context. New exact-head CI triggered at commit `3289724b47acfaf320157faeda3c45c242a6309a`; results must be inspected before marking DONE_VERIFIED. |
| Independent Ukrainian target review and reader testing | BLOCKED / EVIDENCE-LIMITED | Requires independent reviewers and held-out readers; software tests cannot establish the quality of Ukrainian letter choices. |
| Release readiness | BLOCKED | Exact-head web/browser CI, full Hanja reverse-input behavior, IPA profile contract, and independent target validation remain open. |

### Current execution state

- Active review branch: `feat/korean-rr-contextual-phonetics-final`; PR [#411](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/411), still draft/open.
- Repair commits: `39bf53200fe663ce87ac33d7bbe5dd482f10dbe1` (palatalization trace metadata) and `3289724b47acfaf320157faeda3c45c242a6309a` (align the `ng` regression expectation with the declared table).
- Exact-head CI for `3289724b47acfaf320157faeda3c45c242a6309a`: runs 41239825542 (tests), 41239825512 (system verification), 41239825533 (browser G2P), 41239825505 (multi-engine IPA diagnostic), 41239825553 (UGTPHON diagnostic), 41239825603 (paired native/g2pk diagnostic), 41239825611 (master artifacts), and 41239825564 (test register extraction). Pending at the time of this update.
- Do not merge PR #411 until the exact-head web/browser gates pass and product-contract corrections are reconciled. PR #371 remains a separate benchmark workstream and is untouched.


## Continuation — reverse Hanja adapter and synthetic adversarial fixture — 2026-10-31

| Task | Status | Evidence / acceptance |
|---|---|---|
| Reverse Hanja reading adapter | PARTIAL | `src/app/hanja.js:createHanjaToHangulConverter` reverses the existing reading→Hanja map with deterministic longest-match lookup. Unique readings convert; ambiguous Hanja spans are preserved and return candidate readings; unknown characters are preserved/reported. Unit tests added for unique, mixed-script, ambiguous and partial cases. Browser input integration, candidate selection, source-offset preservation and coverage benchmark remain TODO. |
| Synthetic owner-requested adversarial text | DONE_VERIFIED as test stimulus only | `tests/fixtures/adversarial-corpora/31-generated-mixed-phonology-prose-2026-10-31.txt` adds generated passages covering complex codas, liaison, fortition, palatalization, ㅢ, morphology, names/loans, numerals, punctuation and longer prose. It explicitly carries no pronunciation gold and must not be used as a scored reference without independent adjudication. |
| Exact-head CI after reverse adapter and new fixture | TODO / pending | Latest code and documentation commits trigger new test/build, browser G2P, system verification, IPA diagnostic, paired engine, corpus artifact and extraction workflows. Inspect the latest exact-head runs before marking these changes verified. |

The reverse Hanja adapter does not yet make the browser bidirectional. Do not state that the input box accepts arbitrary Hanja as a fully supported pronunciation source until mixed-script normalization and ambiguous-reading selection are integrated and tested.


## Continuation — dual IPA presentation and reverse-Hanja tests — 2026-10-31

| Task | Status | Evidence / acceptance |
|---|---|---|
| Surface phonetic IPA provenance | PARTIAL | Ordinary browser mode uses pinned g2pK JS port; detailed mode uses Kozak Kim; each emits its own surface IPA and is identified in the UI. Cross-runtime profiles remain unadjudicated and must not be treated as approved target-adapter inputs. |
| Separate phonemic IPA display | PARTIAL / baseline implemented | `src/app/ipa_phonemic.js` mirrors the Python `phonemic_segments` inventory for Hangul onset/nucleus/coda values; `index.html` exposes a separate field and copy control. It is explicitly labelled as an orthography-derived phonemic baseline, not a second G2P engine. It does not resolve morphology, lexical alternations or prosody and flags non-Hangul material. Tests cover onset/nucleus/coda, fortis, aspiration, ㅢ, complex codas and mixed literals. Acceptance for a full phonemic profile requires cross-runtime parity fixtures and independent phonological adjudication. |
| Reverse Hanja ambiguity ordering | PARTIAL / fix submitted | CI exposed that candidate readings were correctly sorted by Unicode codepoint, while the test expected the reverse order. The test expectation is now aligned with deterministic ordering; exact-head tests on `a124df38397fb961e76a80a63f98192eba54a9d6` are pending. |

The current user-facing IPA contract is: **surface phonetic IPA** from the selected G2P engine, plus a separately labelled **orthography-derived phonemic baseline**. Never imply that the baseline is contextually adjudicated phonemic output. The primary Ukrainian result remains the project's existing author-developed transliteration/practical rendering system, not a replacement subsystem.


## Continuation — Hanja bidirectional UI integration — 2026-10-31

| Task | Status | Evidence / acceptance |
|---|---|---|
| Hangul → Hanja annotation | DONE_VERIFIED as conservative dictionary annotation in prior CI | Existing deterministic, pinned dictionary path remains unchanged. |
| Hanja → Hangul reverse workbench | PARTIAL pending exact-head CI and linguistic evaluation | A standalone Hanja input disclosure below the main input provides an editable Hangul reading output, ambiguity/unmapped notes, and a handoff button to the main Korean input. The browser loads all 19 local dictionary chunks only when reverse lookup is used. Ambiguous/partial results are blocked until the user edits the reading; no silent homophone choice. Tests: `tests/hanja.test.mjs`, `tests/hanja-ui-contract.test.mjs`. |
| Hanja mixed-script normalization and pronunciation | PARTIAL | User can reverse-convert a mixed Hanja/Hangul phrase and transfer the edited Hangul result into the main pipeline. It is intentionally a separate step so the original input and normalized reading remain visible. End-to-end browser smoke, source-offset review and reverse-coverage benchmark remain TODO. |

The reverse lookup is dictionary-backed, not contextual Hanja WSD. It inverts a reading→Hanja word map and lacks full single-character coverage. Unknown/ambiguous spans remain visible for manual correction. Do not claim arbitrary Hanja text is automatically and contextually resolved.


## Owner-confirmed final product contract — implementation reconciliation — 2026-10-31

The primary Ukrainian output is named **українська транслітерація** throughout the product UI and methodology. The term is defined here as the existing author-developed practical Ukrainian-letter rendering guided by Korean pronunciation and project research rules; it is not literal character-by-character Hangul substitution, a translation, or IPA itself. The existing IPA-first target and RR-mediated target are preserved as distinct routes; no replacement target system was introduced.

### Current user-facing implementation

- Korean Hangul input remains the main field. A generated adversarial quick example is available; the full synthetic passage is retained in `tests/fixtures/adversarial-corpora/31-generated-mixed-phonology-prose-2026-10-31.txt` and carries no gold labels.
- Default dialect scope is explicitly labelled standard South Korean (Seoul-based standard).
- Ordinary and specialist audiences are served by the accessible default mode plus separate detailed research mode and collapsed full trace panels.
- IPA has two separately labelled outputs: selected-engine surface phonetic IPA, and a Hangul-derived phonemic baseline. The JS baseline is parity-tested against the Python phonemic inventory on representative syllable/coda/vowel cases. It remains explicitly non-morphological and non-prosodic.
- Revised Romanization remains a separate result and a separate RR→Ukrainian route.
- Hangul→Hanja annotation remains in the result card. Hanja→Hangul is now a standalone disclosure below the main input, so it can be used before any Hangul result exists. It loads the 19 local dictionary chunks only when Han-script input is present, supports mixed text, shows ambiguity/unmapped spans, provides an editable Hangul reading, blocks transfer while any Han characters remain, and transfers the manually resolved Hangul into the main input. It is dictionary lookup, not contextual WSD or complete character coverage.

### Updated task ledger

| Task | Status | Evidence / remaining acceptance |
|---|---|---|
| Owner-approved Ukrainian transliteration terminology | DONE_VERIFIED as UI/docs contract | `index.html`, `src/main.js`, `system.html`, `README.md`; UI regression assertions updated. The existing target correspondence data remains unchanged by the terminology change. |
| Dual IPA fields | PARTIAL | `src/app/ipa_phonemic.js`, separate UI field/copy action, `tests/ipa-phonemic.test.mjs`, and Python↔browser parity test in `tests/test_ipa.py`. Exact-head CI is pending; phonemic output is a baseline, not morphology/prosody-resolved IPA. |
| Hanja both directions | PARTIAL | Reverse lookup and standalone UI are implemented; ambiguous/unmapped readings require manual correction. Exact-head CI, browser smoke, dictionary coverage/error rates and contextual reading evaluation remain required. |
| Standard South Korean profile label | DONE_VERIFIED as product default label | Main input guidance identifies the standard South Korean / Seoul-based scope; linguistic coverage remains standard-only. |
| Simple + expert audience | DONE_VERIFIED as current interaction structure | Ordinary default mode, detailed Kozak Kim mode, collapsed trace disclosures and full source/rule trace remain available. |
| Generated adversarial inputs | DONE_VERIFIED as stimuli only | Added quick example and fixture; no fabricated gold outputs. |

### CI failures found and corrected during this continuation

- Exact-head web tests on `d917ca865fd66239089bfb8497ac0aeff16fe417` exposed stale assertions expecting the old UI term "Український запис" and the old Hanja import signature. The UI and methodology now use the confirmed "Українська транслітерація" term; affected tests were updated, including `tests/ipa-ukrainian-trace.test.mjs`, `tests/corpus-sentence-and-trace-regression.test.mjs`, `tests/web-ui-contract.test.mjs`, and `tests/hanja-ui-contract.test.mjs`.
- Exact-head CI on the current continuation branch is pending because GitHub Actions runners are queued. Do not mark these latest UI changes DONE_VERIFIED until the newest `tests`, browser integration and system verification jobs complete.


## Open-PR reconciliation — 2026-10-31

- PR #411 is the active draft for this workstream; it has no submitted review or inline review threads, is based on current main `5cec9deb4a8d622cd5f0ba969a2fd49b17281f43`, and remains unmerged.
- PR #371 is a historical benchmark branch. Its review findings on p95 percentile definition, independent gold-variant selection per metric, and branch-name-gated research jobs were already ported through PR #401 and merged into main at `eb8e1f100e8aca377aef05a2aa896756c909ec5c`; the occurrence-ledger fix from PR #399 was also merged at `cb1ceafd0d9a01c60cf68dd279e0858e732eb780`. Current main's benchmark code/tests contain nearest-rank p95, per-metric IPA gold selection, and explicit default-off workflow dispatch for research inference.
- PR #371 remains open and is not merged or modified. Its unique external smoke workflow calls `https://api.mikai.me/public/v1/translit`; it is left untouched because this continuation does not require sending project/user text to an unreviewed external service. Its base is stale/diverged from current main.
- Owner-supplied inspiration repositories (obra/superpowers, mattpocock/skills, DietrichGebert/ponytail) were retained as workflow references. No external agent framework or third-party code was imported into the product; changes remained incremental, test-first, and within the repository's existing architecture.


## Exact-head handoff snapshot — 2026-10-31

- Base: `main` at `5cec9deb4a8d622cd5f0ba969a2fd49b17281f43`.
- Active branch: `feat/korean-rr-contextual-phonetics-final`.
- PR #411: open, draft, mergeable, no review submissions/inline threads; latest branch head at this snapshot: `26e1693b0283857020f753aabe978ed7d13a10c5`.
- Latest exact-head workflow set on that SHA: tests `41242883661`, browser G2P `41242883863`, system verification `41242883742`, master artifacts `41242883671`, test-case register `41242883725`, paired engine diagnostic `41242883835`, UGTPHON `41242883745`, multi-engine IPA diagnostic `41242883728`. These were queued/in progress at snapshot time; no passing claim is made for this exact head.
- The last fully completed test run before the Hanja standalone UI, updated terminology and engine-provenance changes was `41240462365`: 1,378 web tests passed, 0 failed; Python 3.11/3.12/3.13, wheel install and teacher-corpus audit passed. This is historical evidence only, not acceptance for the current head.
- Latest known failures on earlier heads were stale assertions after product-label/import changes; those tests have been updated. Current exact-head CI is required to confirm the repairs.
- Local npm/Python/build/browser execution remains unavailable in this connector-only session. Continue from exact-head GitHub Actions and independent linguistic evaluation; do not merge or mark release-ready while gates remain pending.


## Live Pages acceptance and parallel owner commits — 2026-10-31

- Preserved owner-authored commits adding the dual-route live browser smoke / Pages contract test and the separate IPA/RR architecture and QA documentation. No unrelated user changes were reverted.
- Corrected the architecture diagram to distinguish the main Hangul input from the optional standalone Hanja/mixed-script workbench. Reverse Hanja lookup is manual-review → confirmed Hangul → main input; it is not an automatic pre-G2P normalization stage.
- Extended `scripts/smoke-live-pages-browser.mjs` to clear the main input, open the standalone Hanja workbench, convert a known mixed Hanja/Hangul phrase, verify a unique reading, and transfer that reading into the main pronunciation pipeline. `tests/romanization-mode-ui.test.mjs` locks this live smoke contract.
- Current PR #411 head: `b5482f9408515b393fb6b3ec155f1887a002c1d0`. Exact-head tests `41243394040`, browser integration `41243394029`, system verification `41243394008`, master artifacts `41243394023`, test-register extraction `41243394106`, paired-engine diagnostic `41243394069`, UGTPHON `41243394208`, and multi-engine benchmark `41243394014` were queued/in progress at this snapshot. Await these; no current-head pass is claimed.
