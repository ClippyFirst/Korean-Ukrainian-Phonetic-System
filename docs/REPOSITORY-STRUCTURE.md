# Repository structure and ownership guide

**Current documentation snapshot:** 2026-11-08. This guide was reconciled from main commit e24cf7caff745fb612080aef6a33c8058f4144cc, after PR #461 (40 source-policy adjudications) merged at b014d0107a47c3117c7dcbdd8d403f7fca3c7d41. The documentation continuation is committed directly to main, as requested by the repository owner. This is a navigation/ownership map, not a claim that every file has been independently reviewed line by line.

## Current verification snapshot — 2026-11-08

The starting main commit e24cf7caff745fb612080aef6a33c8058f4144cc has successful push-triggered runs: [tests 42464216274](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42464216274), [system verification 42464216259](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42464216259), [master/research artifacts 42464216261](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42464216261), and [Pages deployment 42464216267](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42464216267). All four concluded successfully.

The latest applicable Korean G2P measurements are the paired UGTPHON run [42414467883](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42414467883) and complete multi-engine run [42416681855](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681855), both from the immediately preceding output-changing PRs #456/#457. PR #461 only adds source-policy metadata and does not change Hangul, IPA or Ukrainian output. The multi-engine attempt on PR #461 was cancelled and is not counted as a result. Optional CharsiuG2P and ByT5 inference were skipped by policy.

The earlier 2026-11-07 snapshot below is retained as history; the current benchmark and 236-case reconciliation is in the current audit [addendum](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md#current-main-continuation--2026-11-08-documentation-and-benchmark-reconciliation).

The audited starting main commit was `e72856c1f03bfb775805748f96ec23889ca2e60f`. The two failed main-head runs at that snapshot were reconciled in PR [#457](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/457), verified on `ab6c7c69ba65b7fd5da4383d2105ef81a5bcb51d).

PR #457's exact-head checks and post-merge main checks passed: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681845), [Python/browser test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681848), [master/research artifact checks](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681843), [exhaustive test-case extraction](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681889), and [full multi-engine benchmark](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681855). The metadata-only NIKL inventory was skipped by policy; no claim of its execution is made.

Post-merge main verification [42418241279](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241279), test matrix [42418241284](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241284), research artifacts [42418241294](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241294), and Pages deployment/live smoke [42418241365](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241365) all passed on `62ca357d`. The initial failures were corrected without changing the source corpus pins or linguistic classifications: the UGTPHON source-register row was repaired as valid CSV, the exact `naver-ai/UGTPHON/ko/test.json` path was aligned in the reviewer-packet validator, and the mismatch-queue exporter was made byte-compatible with the committed CRLF/no-trailing-newline format. The full multi-engine run subsequently passed its exact artifact comparison, Browser Kozak Kim execution and Native/Browser parity audit.

This point-in-time guide describes observed tree ownership and navigation boundaries; it is not a claim that every file has been independently reviewed line by line.

## What this repository contains

A Python research package, a browser-based practical/research application, Korean phonology and lexical datasets, a Korean-to-Ukrainian IPA target layer, reproducible research tooling, source-rights records and a public GitHub Pages service.

## Previous 236-case and benchmark snapshot — 2026-11-07

The reconstructed 236-row cohort contains 15 exact standard-form runtime dispositions, 181 bounded profile-convention decisions, 12 original abstentions and 28 residual cases. The 40 residual cases have explicit no-audio engine-policy dispositions, but all 40 remain unresolved as speaker-specific IPA gold. Do not describe the 181 profile decisions as new categorical rules or the 40 engine-policy decisions as IPA adjudication. The historical 236/239 selector membership is reconstructed, not independently proven.

Historical snapshot only: its UGTPHON paired values are superseded by the current 2026-11-08 table below; its SIGMORPHON values are likewise superseded. Preserve this paragraph as dated audit history, not as the current benchmark statement.

At main commit `e72856c1f03bfb775805748f96ec23889ca2e60f`, the recursive Git tree contains **848 entries** (805 files and 43 directories), including 183 Markdown files, 398 files under `tests/`, 65 scripts, 18 GitHub Actions workflows and 13 schemas, 150 files under `docs/` and 59 under `research/`. These are point-in-time inventory counts, not measures of implementation completeness.


## IPA target renderer ownership and validation boundary

The IPA-to-Ukrainian renderer is a downstream adapter, separate from the Korean G2P engines:

- Python: `src/korean_ukrainian/ipa_target_renderer.py`.
- Browser: `src/app/engine_ipa.js`.
- Input contract: an explicit IPA sequence (or a profile-adjudicated IPA result); output: Ukrainian practical orthography, status, and a mapping trace.
- It must not infer Korean pronunciation directly from Hangul or bypass the Korean phonology/IPA stage.
- Existing tests reproduce 644 canonical lexical rows and 46 alternate IPA rows; the explicit override table contains 28 mappings. These are regression/reproducibility checks, not independent Ukrainian target-accuracy scores.
- The recovered 24-form renderer holdout has no IPA gold and no Ukrainian gold for any row. Independent Ukrainian target validation is therefore still open.

For current G2P scores, Native-versus-g2pK interpretation, the 236-case disposition and current-main verification, use the dated [2026-11-08 audit continuation](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md#current-main-continuation--2026-11-08-documentation-and-benchmark-reconciliation). Do not use renderer reproducibility counts as Korean G2P accuracy, or Korean G2P scores as renderer accuracy.

## Top-level map

| Path | Responsibility | Editing rule |
|---|---|---|
| `src/korean_ukrainian/` | Python domain logic, pipeline, IPA renderer, CLI/API and research adapters | Change with focused Python tests; preserve IPA-first target flow |
| `src/app/`, `src/main.js`, `src/styles/` | Browser application and JS engine | Change with browser regressions and production build |
| `src/vendor/g2pk/` | Pinned third-party browser G2P code | Do not patch as if it were project-authored; preserve upstream provenance and licence |
| `data/korean/` | Korean inventories, rules, lexical controls, evidence and target correspondence | Canonical data; update provenance and relevant schema/tests |
| `data/correspondence/` | Target contract and feature weights | Keep distinct from Korean source phonology |
| `data/validation/`, `schemas/` | Validation cases and machine-readable data contracts | Schema changes require compatibility and fixture tests |
| `scripts/` | Generators, importers, audits, benchmarks and reviewer-packet builders | Prefer existing scripts; generated outputs must be reproducible |
| `tests/` | Python and browser regression suites, fixtures and corpora | Fixtures are not automatically gold labels |
| `research/` | Source register, rule coverage, acceptance gates, decisions, reviewer queues and discrepancy ledgers | Canonical research status; update existing registers, do not create parallel ledgers |
| `docs/` | Stable guidance, dated audits, research notes, user/developer docs and handoff | Use the documentation index; keep historical links stable |
| `licenses/` | Third-party data licence texts and source notices (currently the pinned UGTPHON Korean-subset Apache-2.0 notice) | Not the project-code licence; preserve source scope and full notices with permitted reviewer packets |
| `.agents/skills/` | Seven repository-local skills: four domain-specific phonetic/NIKL skills plus engineering-change, repository-audit and change-review | Route through root `AGENTS.md`; extend the owning skill rather than copying generic upstream workflows |
| `.github/workflows/` | Tests, verification, generated artifacts, research jobs and Pages deployment | Inspect path filters, permissions, skip policies and exact-head results |
| `public/` | Static assets and third-party notices/licences | Third-party terms remain independent |
| `reports/` | Generated audit summaries and metadata-only manifests | Regenerate from canonical inputs; do not hand-edit generated outputs |
| `examples/` | CLI/API sample inputs and requests | Keep aligned with current interfaces |
| `index.html`, `system.html` | Public service and researcher-facing system pages | Keep user-facing claims aligned with runtime and evidence status |
| `한국어 어문 규범.htm` | User-supplied local capture of NIKL Korean-language norms page | Treat as a source artifact with provenance and rights caveats; do not silently normalize or overwrite |

## Runtime entry points

See [Architecture](architecture.md) for the full flow and component responsibilities.

- Browser service: `index.html` → `src/main.js` → browser engine and practical G2P adapter.
- Browser research mode: `src/main.js` → project JS engine → Korean surface/IPA → IPA target mapping.
- Python library: `src/korean_ukrainian/pipeline.py`.
- CLI: `korean-ua` → `src/korean_ukrainian/cli.py`.
- Optional API: FastAPI app in `src/korean_ukrainian/api.py`.
- Native IPA-to-Ukrainian renderer: `src/korean_ukrainian/ipa_target_renderer.py`.
- Browser target projection: `src/app/engine_ipa.js` and generated `src/app/ipa_target_data.js`.

## Canonical sources of truth

1. **Runtime behavior:** current source code, schemas, canonical data and tests.
2. **Research evidence:** `research/SOURCE-REGISTER.csv`, `research/RULE-COVERAGE.csv`, claim/evidence records and reviewer/adjudication packets.
3. **Research decisions and readiness:** `research/DECISION-LOG.md`, `research/ACCEPTANCE-GATES.md`, `research/ROADMAP.md`.
4. **User/developer navigation:** `README.md`, this guide, `docs/README.md`, `docs/architecture.md`.
5. **Historical evidence:** dated reports in `docs/` and `docs/audits/`; these remain immutable context and may be superseded by a newer dated audit.
6. **Session continuation:** `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`; newest dated section supersedes older snapshots.

A successful test proves only the assertion encoded in that test. It does not prove independent linguistic correctness, source rights, or expert acceptance.

## Development and verification

| Task | Command |
|---|---|
| Browser regression suite | `npm test` |
| Browser production build | `npm run build` |
| Combined browser release check | `npm run check:release` |
| Python suite | `python -m pytest -q` |
| Strict research corpus generation | `python scripts/generate_korean_corpus.py --strict` |
| Master table generation | `python scripts/generate_master_table.py` |
| IPA target data generation | `npm run generate:ipa-target-data` |
| IPA target data drift check | `npm run check:ipa-target-data` |
| Source register audit (read-only triage) | `npm run audit:source-register` |
| Strict positive-redistribution rights gate | `npm run audit:source-rights` |
| NIKL local HTML inventory | `npm run crawl:nikl -- --url "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002" --input-html "한국어 어문 규범.htm" --output reports/nikl/standard-pronunciation-manifest.json` |

Runtime requirements are Node.js `>=22.12.0` and Python `>=3.11`. Optional extras are documented in `pyproject.toml`; do not assume g2pK, Kiwi, MeCab-Ko, FastAPI or Excel dependencies exist in a minimal install.

## Agent workflow references

The four supplied upstream repositories were reviewed as process references, not as code or text to copy:

- [unlazy](https://github.com/Leonxlnx/unlazy): observable acceptance gates, explicit command oracles, and honest handoff for unmet or abandoned gates.
- [Superpowers](https://github.com/obra/superpowers): red/green TDD, systematic root-cause debugging and verification before completion claims.
- [Matt Pocock's skills](https://github.com/mattpocock/skills): separate specification compliance from engineering-standard review; trace research claims to primary sources.
- [Ponytail](https://github.com/DietrichGebert/ponytail): risk-first whole-repository audit, real data-flow tracing, concrete reproducible findings and smallest effective fixes.

The project already has domain-specific skills in `.agents/skills/` and the current [agent workflow guide](AGENT-WORKFLOWS.md) and historical [phonetic skill integration record](AGENT-SKILL-INTEGRATION-2026-11-01.md). Do not add overlapping generic skills or a second gate ledger without a demonstrated gap.

## Safe structural evolution

- Do not bulk-move dated reports or rename data files during a documentation pass: many tests, scripts, fixtures and historical links may depend on stable paths.
- Add a canonical index entry before introducing a new guide.
- Keep one canonical source register, one rule coverage matrix, one acceptance-gate register, and one append-only handoff.
- Keep generated data generated; change the source and generator, then verify no drift.
- Preserve third-party code, data and attribution boundaries.
- Record unsupported cases as unresolved rather than filling gaps with plausible output.

## Known audit boundaries at this snapshot

- `main` is the default branch and was reported as unprotected by GitHub repository metadata at this snapshot. No branch-protection or ruleset settings were changed.
- PR #443 merged the 236-case evidence reconciliation, regenerated diagnostic queue, scoped source-rights gate and release-workflow integration at `bb972871a207b1f703503ade980a36cf3b976085`. PR #439 was closed as superseded; its branch was preserved. Other historical/supporting branches were not deleted or force-updated.
- Exact-head multi-engine run [42226435101](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42226435101) passed all mandatory pinned comparison, export, Browser same-occurrence, Native/Browser parity and SIGMORPHON steps. Optional CharsiuG2P and ByT5 inference jobs were skipped by policy.
- Exact-head system verification [42226435403](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42226435403) passed browser regression, `npm run audit:source-rights`, build and generated-page checks; Python regression/data integrity passed. This is GitHub Actions evidence, not a local shell run.
- The strict rights gate found no unresolved positively recorded redistribution item. Citation-only references and non-redistributed materials remain distinct from copied content; this result is not blanket legal clearance or a legal opinion.
- The 236-occurrence cohort remains a reconstructed candidate inventory: 15 exact standard-form runtime dispositions, 181 profile-convention decisions, 12 IPA abstentions and 28 unadjudicated cases. The original historical 236/239 membership predicate is not proven.
- Independent Korean IPA review and separate Ukrainian target review remain external acceptance gates. The repository is not release-ready or independently research-certified.
- The master handoff is approximately 1 MB and remains preserved as a historical append-only record. Where the available connector write path cannot safely append, the newest dated repository-audit continuation is the current status source; do not truncate or replace the handoff.
## NIKL rule ownership boundary

NIKL Standard Pronunciation Rules R001–R016 and exact-form/morphological licenses are implemented in Kozak Kim's research/native rule modules (`src/app/engine_rules_ctx.js`, `src/korean_ukrainian/rules.py`, canonical `data/korean/rules.csv`, and `research/RULE-COVERAGE.csv`). The browser and Python g2pK adapters are isolated baselines: they preserve raw g2pK surface output and derive IPA without Kozak Kim NIKL rule, lexical surface, or IPA overlays. Do not move NIKL licenses into `src/vendor/g2pk/` or either g2pK adapter. The existing user-supplied `한국어 어문 규범.htm` is retained; this continuation does not create a fresh NIKL snapshot.


## Current mismatch evidence register

`research/kozak-kim-context-adjudication-2026-11-05.csv` records four context-restored NIKL §27 exact-form corrections and one provisional R012 retain decision. The reconstructed 239-ID cohort and 236-row source-context review inventory are documented in `research/kozak-kim-236-candidate-review-2026-11-05.csv` (draft PR #436); historical membership is still partial and the 236 are not individually IPA-adjudicated. The original NIKL HTML capture remains in place; no new snapshot was created. NIKL rules remain exclusive to Kozak Kim; g2pK remains an independent baseline.


## Current 236-case status after PR #446

PR [#446](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/446) is merged at `321e4a126167eab0ad31fc44ae22b587ee8c809c`. It adds a 28-row residual evidence register, projects five review fields into the generated 236-row ledger, registers Lee (2023) as citation-only research evidence, and adds regression guards for the 12 abstentions, 28 unadjudicated rows and six unresolved sibilant token strings. It does **not** add a new canonical IPA decision, Ukrainian target, production phonology rule or benchmark gold.

The disposition remains 15 exact standard-form runtime cases, 181 profile-convention decisions, 12 abstentions and 28 unadjudicated cases. The 28-row evidence review is complete as a traceability/evidence review, not as token-level IPA adjudication. All 40 residual cases remain blocked on original audio and speaker crosswalk, two independent Korean broad/narrow IPA annotations with syllable/prosodic boundaries, blind reconciliation, and a separate Ukrainian target review. See the [residual register](../research/kozak-kim-236-residual-review-2026-11-06.csv), [current audit](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md) and [acceptance gates](../research/ACCEPTANCE-GATES.md).

Exact-head PR CI passed the required software and diagnostic jobs; post-merge tests, system verification and master/research artifact generation passed (runs [42254523067](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42254523067), [42254523015](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42254523015), [42254523078](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42254523078)). The Pages deployment run [42254523031](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42254523031) was cancelled by the subsequent documentation-only push; replacement deployment [42254864628](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42254864628) was queued on `main` commit `e0feeb6ac3697d026d151f3fbb78796728a1e8da`. No local shell, npm or pytest run is claimed for the connector-only session.


## 2026-11-08 runtime adjudication integration — PR #461

The 40 source-based adjudications are now wired into the Kozak Kim runtime result metadata in both browser and Python paths. The shared registry is `src/korean_ukrainian/source_adjudications.json`; browser matching is in `src/app/engine_adjudications.js`, and Python matching is in `src/korean_ukrainian/source_adjudications.py`. Python wheel package data includes the same JSON registry.

The registry contains 17 adjudication families and all 40 occurrence IDs. Fifteen distinct source forms are runtime-matchable using exact Korean-script boundaries. The two non-speech `ㅠ` source rows remain registered but intentionally do not match normalized `유` strings until the raw source offsets are revalidated. This is not an audio blocker.

The integration attaches source IDs, claim IDs, occurrence IDs, accepted status and a bounded runtime action. It does not mutate source text, Korean IPA or Ukrainian target output. Existing Rule 29 behavior for `홍콩 영화들`, `한국 여자로` and `첫 연애` remains conditional on explicit spacing and phrase mode. Do not interpret source-policy acceptance as speaker-specific narrow IPA gold.

PR [#461](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/461) exact-head verification on `87e7bb32611e7042c7f0ecf5df1d1fd5ac49aa5b`:
- Python regression/data-integrity workflow [42463790481](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790481): passed.
- Browser regression, source-rights gate and public-page build [42463790481](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790481): browser tests, rights gate, public-page build and generated-page verification all passed.
- Test matrix [42463790417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790417): Python 3.11, 3.12 and 3.13 passed; browser tests/build and wheel build passed.
- Browser G2P integration [42463790446](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790446): npm tests and build passed.
- Master/research artifact generation [42463790433](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790433): master table and strict corpus generation passed.
- Optional Charsiu queue and official NIKL metadata-only inventory were skipped by policy; neither is counted as a pass.

Local shell/npm/pytest commands were not run in this connector-only environment. The CI evidence above is the actual verification source. The PR remains open pending merge; non-required diagnostic jobs are recorded separately in the canonical audit.
