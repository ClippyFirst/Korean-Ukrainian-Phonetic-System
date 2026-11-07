# Repository structure and ownership guide

**Snapshot:** 2026-11-07, after PR #456 (squash merge `18f5529b9100ea6e4f7c176c9627bacf1fc52585`) and the UGTPHON source-rights continuation. The latest mainline documentation commit at this snapshot is `f845e30729ca52f60831ac873b901676268db272`. This guide describes observed tree ownership and navigation boundaries; it is not a claim that every file has been independently reviewed line by line.

## What this repository contains

A Python research package, a browser-based practical/research application, Korean phonology and lexical datasets, a Korean-to-Ukrainian IPA target layer, reproducible research tooling, source-rights records and a public GitHub Pages service.

## Current 236-case and benchmark status — 2026-11-07

The reconstructed 236-row cohort contains 15 exact standard-form runtime dispositions, 181 bounded profile-convention decisions, 12 original abstentions and 28 residual cases. The 40 residual cases have explicit no-audio engine-policy dispositions, but all 40 remain unresolved as speaker-specific IPA gold. Do not describe the 181 profile decisions as new categorical rules or the 40 engine-policy decisions as IPA adjudication. The historical 236/239 selector membership is reconstructed, not independently proven.

Latest paired UGTPHON diagnostic: Native 1,425/2,702 exact (52.7387%), CER 9.0130%; g2pK 1,435/2,703 (53.0892%), CER 9.2328%. SIGMORPHON 2021 figures retained from the prior exact-head run: Native 358/998 exact (35.8717%), CER 14.5598%; g2pK 353/999 (35.3353%), CER 14.8222%. These are Korean G2P/IPA diagnostics, not Ukrainian target accuracy or normative gold. The multi-engine run 42414467825 was pending at the last check.

At main commit `45f1d266c7793b6c280ed3a1ec4565e309ec1cbb`, the recursive Git tree contains **848 entries** (805 files and 43 directories), including 183 Markdown files, 398 files under tests/, 65 scripts, 18 GitHub Actions workflows and 13 schemas. These are point-in-time inventory counts, not measures of implementation completeness.

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
