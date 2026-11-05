# Repository structure and ownership guide

**Snapshot:** 2026-11-05, verified code/test head `be65ee71b9d3f224876875830b30be856f96126f`; documentation and audit addenda committed through `eba384fba0a201837cdb3b657ced4f376ae84fdd`. This guide describes the observed tree and stable ownership boundaries; it is not a claim that every file has been independently reviewed line by line.

## What this repository contains

A Python research package, a browser-based practical/research application, Korean phonology and lexical datasets, a Korean-to-Ukrainian IPA target layer, reproducible research tooling, and a public GitHub Pages service.

The recursive Git tree contained **799 entries** (files plus directories), including **163 Markdown files**, **388 test files**, **61 scripts**, **18 GitHub Actions workflows**, and **13 schemas**. The current documentation tree contains 144 entries. These are point-in-time inventory counts; see the latest audit addendum for the exact head and CI snapshot.

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
| `.agents/skills/` | Four repository-specific agent skills: NIKL evidence audit, NIKL crawler, rule coverage and phonetic engineering | Extend existing skills rather than copying generic upstream workflows |
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
| Source register audit | `npm run audit:source-register` |
| NIKL local HTML inventory | `npm run crawl:nikl -- --url "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002" --input-html "한국어 어문 규범.htm" --output reports/nikl/standard-pronunciation-manifest.json` |

Runtime requirements are Node.js `>=22.12.0` and Python `>=3.11`. Optional extras are documented in `pyproject.toml`; do not assume g2pK, Kiwi, MeCab-Ko, FastAPI or Excel dependencies exist in a minimal install.

## Agent workflow references

The four supplied upstream repositories were reviewed as process references, not as code or text to copy:

- [unlazy](https://github.com/Leonxlnx/unlazy): observable acceptance gates, explicit command oracles, and honest handoff for unmet manual gates.
- [Superpowers](https://github.com/obra/superpowers): red/green TDD, systematic root-cause debugging and verification before completion claims.
- [Matt Pocock's skills](https://github.com/mattpocock/skills): separate specification compliance from engineering-standard review; trace research claims to primary sources.
- [Ponytail](https://github.com/DietrichGebert/ponytail): risk-first whole-repository audit, real data-flow tracing, concrete reproducible findings and smallest effective fixes.

The project already has domain-specific skills in `.agents/skills/` and an integration record in [AGENT-SKILL-INTEGRATION-2026-11-01.md](AGENT-SKILL-INTEGRATION-2026-11-01.md). Do not add overlapping generic skills or a second gate ledger without a demonstrated gap.

## Safe structural evolution

- Do not bulk-move dated reports or rename data files during a documentation pass: many tests, scripts, fixtures and historical links may depend on stable paths.
- Add a canonical index entry before introducing a new guide.
- Keep one canonical source register, one rule coverage matrix, one acceptance-gate register, and one append-only handoff.
- Keep generated data generated; change the source and generator, then verify no drift.
- Preserve third-party code, data and attribution boundaries.
- Record unsupported cases as unresolved rather than filling gaps with plausible output.

## Known audit boundaries at this snapshot

- `main` is the default branch and is the only branch currently returned by the branch inventory. No open PRs were found at the audit snapshot.
- The main branch was reported as unprotected by GitHub repository metadata. No branch-protection or ruleset settings were changed.
- The latest exact-head CI before this continuation passed browser/Python regression, build, generated artifacts and Pages deployment. This continuation adds a fresh exact-head verification; see the audit addendum.
- The NIKL local HTML inventory is structurally complete (30/30) but page-level reuse terms and capture authenticity are not established.
- Independent Korean IPA and Ukrainian target review remain external acceptance gates.


## NIKL rule ownership boundary

NIKL Standard Pronunciation Rules R001–R016 and exact-form/morphological licenses are implemented in Kozak Kim's research/native rule modules (`src/app/engine_rules_ctx.js`, `src/korean_ukrainian/rules.py`, canonical `data/korean/rules.csv`, and `research/RULE-COVERAGE.csv`). The browser and Python g2pK adapters are isolated baselines: they preserve raw g2pK surface output and derive IPA without Kozak Kim NIKL rule, lexical surface, or IPA overlays. Do not move NIKL licenses into `src/vendor/g2pk/` or either g2pK adapter. The existing user-supplied `한국어 어문 규범.htm` is retained; this continuation does not create a fresh NIKL snapshot.


## Current mismatch evidence register

`research/kozak-kim-context-adjudication-2026-11-05.csv` records four context-restored NIKL §27 exact-form corrections and one provisional R012 retain decision. It is a narrow decision register, not the complete historical 239-occurrence ledger. The original NIKL HTML capture remains in place; no new snapshot was created. NIKL rules remain exclusive to Kozak Kim; g2pK remains an independent baseline.
