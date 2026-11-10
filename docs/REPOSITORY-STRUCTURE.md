# Repository structure and ownership guide

## Current repository state — 2026-11-10

- `main` is the sole active integration branch. Five-dataset benchmark integration PR #465 merged as `e8ebed5b9ccb67255209ccb20efa45ae0236bcbe`.
- Human navigation lives in root `README.md` and this `docs/README.md`; agent routing remains in root `AGENTS.md`; workflow procedures remain in `.agents/skills/` and `docs/AGENT-WORKFLOWS.md`.
- The five-dataset matrix and aggregate-only artifact policy are now implemented and verified on PR head; post-merge exact-main verification remains separate.
- Historical branches are preserved as audit history. Do not treat their existence as a request to merge or delete them.
- Research/release blockers remain independent Korean IPA gold, Ukrainian target review, historical cohort provenance, raw `ㅠ` offsets and restricted speech-corpus terms.

See [latest audit](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md), [benchmark dashboard](BENCHMARK-RESULTS-2026-11-08.md), [agent workflow guide](AGENT-WORKFLOWS.md) and [acceptance gates](../research/ACCEPTANCE-GATES.md).

## Latest integration checkpoint — 2026-11-10

**Default branch:** `main` at `920b6365539058b658348855c5daddc066558b15`.  
**Integration under review:** [PR #465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), branch `benchmark/five-dataset-matrix-reconciled-2026-11-09`, exact head `840cb3f177e147dfe1ae53e7bdd26d524b699b64`.  
**Branch relationship:** 66 commits ahead of main, 0 behind. The branch is based on current main; this is not a merge-base conflict.

### Verified execution evidence

- **DONE_VERIFIED:** six ten-engine reference tracks and fifteen Browser Strict/Soft/Super-soft reports across five datasets — [run 42785083152](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42785083152). These are benchmark outputs, not independent IPA-gold certification.
- **DONE_VERIFIED:** six full-corpus Seoul Browser surface/phonemic reports — [run 42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257).
- **DONE_VERIFIED:** source preparation, full 63,836-row K-SPAN/NIKL WordNum join and master/research artifact generation — [run 42799423026](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799423026) (PASS).
- **DONE_VERIFIED:** exhaustive test-case register extraction — [run 42799422733](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422733) (PASS).
- **DONE_VERIFIED:** external UGTPHON diagnostic — [run 42799422696](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422696) (PASS).

### Exact-head CI — currently failing, not accepted

On PR #465 head `840cb3f177e147dfe1ae53e7bdd26d524b699b64`:

| Workflow | Run | Result | Observed cause |
|---|---:|---|---|
| Verify | [42799422710](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422710) | FAIL | Source-register CSV shape; Browser link/checkpoint assertions |
| Tests | [42799422543](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422543) | FAIL | Same malformed CSV; Python 3.11/3.13 cancelled by fail-fast |
| Multi-engine | [42799422846](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422846) | FAIL | Aggregate summary builder cannot import sibling summarizer when run as a script; optional neural jobs skipped |
| Master/research artifacts | [42799423026](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799423026) | PASS | Generation completed |
| Exhaustive register extraction | [42799422733](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422733) | PASS | Extraction completed |
| UGTPHON diagnostic | [42799422696](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422696) | PASS | Diagnostic completed |

The CSV defect affects three newly ported rows (IPA-Dict, Seoul SLR113 and NIKL MKUFS2): embedded thousands separators were not quoted, producing 13/13/15 parsed fields instead of the declared 12. Browser failures are a relative link incorrectly prefixed with `docs/` inside `docs/README.md` and a missing latest-checkpoint heading in the structure guide. These are being corrected at source; validation is not being weakened.

### Research and data-quality boundaries

- K-SPAN 2.1: 63,836 rows joined; 41,174 Hangul and 22,662 non-Hangul; zero unmatched NIKL WordNums.
- K-SPAN key/WorldBet consistency remains **WARN: 22,843** (Modern 13,078; Conservative 9,765). Source WorldBet fields drive IPA scoring; parallel key fields are audited separately and never silently rewritten.
- Super-soft 100% candidate availability is not 100% source-resolved IPA coverage or accuracy.
- SIGMORPHON and IPA-Dict share Wiktionary lineage; IPA-Dict is supplementary coverage, not an independent holdout.
- Optional CharsiuG2P/ByT5 inference and NIKL metadata-only inventory are **SKIPPED**, not passed.
- Legacy workflow artifacts with row-level material remain subject to their expiry/manual-cleanup boundary; see [benchmark artifact policy](BENCHMARK-ARTIFACT-POLICY.md).

### Task ledger and readiness

- **DONE_VERIFIED:** scoring matrix, Seoul full-corpus Browser runs, source joins and aggregate source preparation on their cited runs.
- **PARTIAL:** aggregate-only workflow integration; summary builder import fix and final artifact ZIP inspection remain.
- **TODO:** repair CSV quoting and documentation contract issues; rerun Python 3.11/3.12/3.13, Browser, Verify and full matrix on the final exact head; inspect uploaded artifact contents.
- **WARN:** K-SPAN parallel key/WorldBet source disagreement; preserve counts and source fields.
- **BLOCKED:** independent Korean IPA gold and independent Ukrainian target review; raw audio/speaker crosswalk and restricted corpus terms remain unavailable.
- **DEFERRED:** optional neural inference; not required for deterministic matrix acceptance.

**Readiness:** software-verified, evidence-scoped research prototype. Not independently research-certified or release-ready. Do not merge PR #465 until exact-head required CI is green and the aggregate artifact is inspected.

## Previous integration checkpoint — 2026-11-10 (superseded)

**Main base:** `920b6365539058b658348855c5daddc066558b15`.  
**Active PR:** [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), `benchmark/five-dataset-matrix-reconciled-2026-11-09`.  
**Verification snapshot PR head:** `de841219a3ecc50db874ebde90d250edce7cdf9f` (33 commits ahead, 0 behind; 20 changed files; GitHub mergeability: clean).  
**Matrix runtime snapshot:** `dfbaf4d122dd48377c56f79227c65617aa9eed6d`; the newer PR-head commits after this snapshot are documentation/test-workflow coordination only, not benchmark-runtime changes.

### Exact latest-head checks

- Tests [42777829552](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829552): **PASS**.
- System Verify [42777829403](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829403): **PASS**.
- Master/research artifacts [42777829668](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829668): **PASS**.
- External UGTPHON diagnostic [42777829606](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829606): **PASS**.
- Exhaustive test-case register extraction [42777829427](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829427): **PASS**.
- NIKL metadata-only inventory remains **SKIPPED** by policy.

### Full matrix status — not yet complete

- The pinned multi-engine/open-dataset run [42776987807](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42776987807) is running on runtime snapshot `dfbaf4d1`.
- Completed successfully in that run: source/input validation; benchmark adapter tests; training-readiness/holdout-overlap audit; independent IPA review-packet generation; 10-engine UGTPHON comparison; mismatch-ledger export; UGTPHON Browser modes; mode-availability check; Native/Browser parity.
- The SIGMORPHON 10-engine comparison is currently running. Seoul, K-SPAN Modern/Conservative, IPA-Dict, Browser follow-ups and final aggregate/schema gates must still complete.
- A fresh full-matrix run [42777829497](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829497) is queued for exact latest PR head `de841219`. Do not claim full-matrix PASS or schema PASS until this exact-head run completes and its aggregate artifact is inspected.

### K-SPAN evidence boundary

The official K-SPAN 2.1 Table 1 mapping is used (`o → e → e`, `p → E → ɛ`, `x → th → tʰ`, `m → ix → ɯ`, `j → ˆ → ʌ`, `u → jˆ → jʌ`, `7 → ixi → ɯi`). The 63,836-row join retains all rows. Scoring converts source `ModernPhon` / `ConservativePhon` WorldBet fields directly to IPA; parallel key fields are independently audited. Their 22,843 discrepancies (Modern 13,078; Conservative 9,765) remain explicit **WARN**, not PASS. Aggregate-only summaries retain warning status/counts and omit row-level examples.

### CI cancellation policy

The benchmark workflow now uses `cancel-in-progress: false`: an already-running pinned matrix is allowed to finish; newer PR revisions queue behind it, with only the latest pending revision retained. This addresses repeated cancellation by documentation-only PR commits.

### Readiness and disposition

PR #465 remains OPEN and unmerged pending the exact-head matrix and schema. PRs [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463) and [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462) remain open and untouched; their changed-file scopes overlap with #465, but close them only after #465 passes and unique scope is reconciled. No historical branch was deleted or force-updated.

The repository remains a software-verified, evidence-scoped research prototype, not release-ready or independently research-certified. Independent Korean IPA review, separate Ukrainian target review, historical membership/raw-offset evidence and restricted-dataset access remain separate acceptance gates.


## Historical integration snapshot — 2026-11-10 (PR head d71, superseded)

**Default branch:** `main` — `920b6365539058b658348855c5daddc066558b15`.  
**Active integration:** [PR #465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), branch `benchmark/five-dataset-matrix-reconciled-2026-11-09`, based on `main`; no changes have been merged to `main`. The exact-head results below refer to verification snapshot `d71ef50f`; subsequent commits in this branch are documentation-only.

**Exact-head verification on PR head `d71ef50f`:**
- [Tests #42775887452](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887452) — **PASS** (Python 3.11/3.12/3.13, Browser, wheel install, teacher-corpus audit).
- [System Verify #42775887811](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887811) — Python and Browser **PASS**; NIKL metadata-only inventory **SKIPPED** by policy.
- [Master/research artifacts #42775887930](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887930) — **PASS**.
- [Exhaustive test-case register #42775887402](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887402) — **PASS**.
- [External UGTPHON diagnostic #42775887380](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887380) — **PASS**.
- [Multi-engine/open-dataset matrix #42775887397](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887397) — **CANCELLED**, not a pass. The preceding runtime/test head `c42b7f9` has a separate [matrix run #42775642949](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775642949), which was **IN_PROGRESS** at the last inspection. Its final artifact and schema must be inspected; green supporting workflows do not imply matrix completion.

**K-SPAN:** the official K-SPAN 2.1 mapping is versioned `kspan-worldbet-to-ipa-v2`. The previous full-matrix failure exposed WorldBet `wi`; the adapter now maps `wi → wi`, with regression coverage for `wi` and `kanixnkwi`. The 63,836-row source join still contains 22,843 parallel key/WorldBet discrepancies (Modern 13,078; Conservative 9,765). These remain `WARN`, not a clean integrity pass. Scoring uses source `ModernPhon` / `ConservativePhon`; key fields are audited independently.

**Fallback policy:** Browser Super-soft may emit a low-confidence, typed `orthographic-phonemic-fallback` candidate from the project correspondence table. It is not source-resolved IPA gold and is excluded from accuracy scoring. Python parity remains TODO.

**Task ledger:** mainline software/docs baseline — `DONE_VERIFIED`; benchmark adapters/preparation and source diagnostics — `PARTIAL`; full five-dataset matrix and aggregate schema acceptance — `PARTIAL`; Python fallback parity — `TODO`; independent Korean IPA and Ukrainian target review — `BLOCKED` pending qualified reviewers and frozen review sets. PRs [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463) and [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462) remain open and untouched pending #465 acceptance and unique-scope reconciliation.

**Readiness:** software-verified, evidence-scoped research prototype; not release-ready or independently research-certified.

### Historical integration evidence (retained)

- Audited main baseline before PR #464: `45a02a62ce955c3db10eb0faaaa1ce8d9f2c9cdb`.
- Superseded PR #463 benchmark head: `167c12a7e9945dc757a57ea734e9745aa69032f3`; its failed exact-head matrix evidence is [run 42665749678](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42665749678).
- Documentation PR #464 merged into main as `d2699911dbc70ef9978e5af06643b1281725a71a`; separate post-merge main verification passed on `5c12f92c36ecae455dc4281dd7a8c0217f5dc4dc`, including Tests [42679091769](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091769) and Pages live smoke [42679091977](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091977).

## Navigation by reader task

| If you need to… | Start here |
|---|---|
| Understand the project, use the web app, CLI or API | [Root README](../README.md), [web-service user guide](WEB-SERVICE-USER-GUIDE.md), [CLI/API guide](cli-and-api.md) |
| Find the canonical documentation | [Documentation map](README.md) |
| Understand runtime architecture and IPA-first boundaries | [Architecture](architecture.md), [methodology](methodology.md), [IPA target layer](ukrainian-target-layer.md) |
| Change browser/Python behavior | [Root AGENTS.md](../AGENTS.md), [agent workflow guide](AGENT-WORKFLOWS.md), the owning `.agents/skills/` procedure |
| Change or validate Korean phonology | [Korean phonology](korean-phonology.md), [rule coverage matrix](../research/RULE-COVERAGE.csv), [source register](../research/SOURCE-REGISTER.csv) |
| Evaluate a G2P engine or dataset | [Benchmark suite register](KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md), [acceptance gates](../research/ACCEPTANCE-GATES.md) |
| Change Ukrainian rendering | [Ukrainian target layer](ukrainian-target-layer.md), [target contract](../data/correspondence/target_contract.csv) |
| Add or assess a source | [Research index](../research/README.md), [source discovery queue](../research/SOURCE-DISCOVERY-QUEUE.csv), [licensing guide](LICENSING-AND-PERMISSIONS.md) |
| Understand the latest status and blockers | [Current repository audit](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md) |
| Review consequential decisions | [Decision log](../research/DECISION-LOG.md) |
| Continue a previous session | [Master execution plan and handoff](MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md), using the latest dated section and the current audit where it supersedes the oversized handoff |

## Runtime and benchmark entry points

| Concern | Canonical implementation / workflow | Boundary |
|---|---|---|
| Python package | `src/korean_ukrainian/` | Installable package; version stream is defined in [versioning policy](VERSIONING-POLICY.md). |
| Browser application | `src/app/`, `index.html`, `public/` | Browser runtime and public web service; keep parity with Python where behavior is shared. |
| Native Korean phonology and IPA | `src/korean_ukrainian/phonology.py`, `ipa.py`, `pipeline.py` | Korean analysis and IPA result precede Ukrainian target rendering. |
| Ukrainian IPA renderer | `src/korean_ukrainian/ipa_target_renderer.py`, `src/app/engine_ipa.js` | Downstream IPA→Ukrainian adapter; never a direct Hangul substitution path. |
| Isolated g2pK baseline | `src/vendor/g2pk/`, its adapter and dedicated workflows | Comparison baseline; no Kozak Kim overlays. |
| External MFA benchmark | `scripts/benchmark_mfa_g2p.py`, `.github/workflows/mfa-g2p-benchmark.yml` | Comparison-only; Hangul and Jamo are one model family. |
| Other multi-engine benchmarks | `scripts/benchmark_multi_engine_ko.py`, `.github/workflows/multi-engine-ipa-benchmark.yml` | Pinned adapters and datasets; read per-run eligibility and exclusions. |
| Research morphology diagnostics | `src/korean_ukrainian/research_morphology.py`, dedicated scripts/workflows | Research-only unless explicit acceptance gates promote behavior. |
| Canonical linguistic data | `data/korean/`, `data/correspondence/` | Structured source of truth; generated files must be regenerated and drift-checked. |
| Research evidence and decisions | `research/` | Source provenance, acceptance, decisions, coverage and review queues. |
| Tests | `tests/` | Browser, Python, parity, rights, data and generated-artifact checks. |
| Automation | `.github/workflows/` | CI, benchmark, audit, build and Pages deployment definitions. |

## GitHub Actions workflow map

The workflow directory is organized by responsibility rather than by runtime language. These files are the authoritative automation definitions; this table is navigation, not a second configuration source.

| Workflow | Responsibility | Operational boundary |
|---|---|---|
| `.github/workflows/test.yml` | Main test matrix: Python 3.11–3.13, browser tests, wheel installation and teacher-corpus audit | Core regression and packaging checks |
| `.github/workflows/verify.yml` | System verification: Python regression/data integrity, browser regression/build and source redistribution rights gate | Mainline verification; metadata-only NIKL crawl is separately gated |
| `.github/workflows/master-table.yml` | Generate the master table and strict research corpus artifacts | Generated outputs must come from canonical inputs |
| `.github/workflows/deploy-pages.yml` | Python/data checks, browser static build and GitHub Pages deployment | Deployment gate; not a linguistic research certification |
| `.github/workflows/multi-engine-ipa-benchmark.yml` | Pinned multi-engine IPA comparison, Browser mode runs, Native/Browser parity and optional neural comparison jobs | Long-running research benchmark; CharsiuG2P and ByT5 jobs are default-off |
| `.github/workflows/ugtphon-benchmark.yml` | External engine diagnostic on the pinned UGTPHON Korean split | Comparison-only; report its own source and split |
| `.github/workflows/mfa-g2p-benchmark.yml` | MFA Korean G2P Hangul/Jamo comparison | External baseline only; model variants are one model family |
| `.github/workflows/native-vs-g2pk-benchmark.yml` | Paired Native versus g2pK diagnostic | Isolated comparison; not a production fallback |
| `.github/workflows/g2pk-integration.yml` | Optional g2pK integration verification | Keeps vendor integration separate from Kozak Kim rules |
| `.github/workflows/browser-g2pk.yml` | Browser g2pK integration checks | Browser adapter boundary |
| `.github/workflows/morphology-consensus-diagnostic.yml` | Research morphology-consensus IPA diagnostics | Research-only; not a replacement for the three runtime modes |
| `.github/workflows/charsiu-dev-rule-mining.yml` | Charsiu train/dev broad/narrow IPA rule-review queue | Research-only; no test-set tuning or production promotion |
| `.github/workflows/train-korean-g2p-teacher.yml` | Train a scratch Korean G2P research teacher | Experimental model workflow; separate from production runtime |
| `.github/workflows/train-korean-g2p-teacher-portfolio.yml` | Train a seed portfolio for the Korean G2P research teacher | Model comparison and reproducibility only |
| `.github/workflows/teacher-corpus-audit.yml` | Audit teacher corpus splits and eligibility | Prevents split leakage and unsupported corpus claims |
| `.github/workflows/holdout-manifest-recovery.yml` | Validate recovered Korean holdout manifest integrity | Recovery/integrity check, not a new gold source |
| `.github/workflows/seoul-corpus-inventory.yml` | Preflight the Seoul Corpus label archive | Metadata/label inventory; audio is not required for this workflow |
| `.github/workflows/nikl-local-html-inventory.yml` | Inventory locally supplied NIKL HTML sources | Source metadata capture; not permission to redistribute |
| `.github/workflows/research-morphology-smoke.yml` | Smoke tests and paired IPA/analyzer-agreement diagnostics for research morphology | Research adapter boundary |
| `.github/workflows/test-case-register.yml` | Extract and validate the exhaustive test-case register | Generated register integrity and schema checks |

**How to choose a workflow:** use `test.yml` and `verify.yml` for ordinary software changes; use the owning benchmark workflow for measured engine claims; use inventory/audit workflows for source or split integrity; use `deploy-pages.yml` for the public service build/deploy gate. A skipped optional job is not a pass and a successful software workflow does not certify linguistic accuracy or data rights.

## MFA external baseline — executed 2026-11-08

The isolated MFA v2.0.0 workflow passed: [run 42513951588](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588), artifact [13630946780](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588/artifacts/13630946780).

| Dataset | Model | Availability | Exact | CER | PER |
|---|---|---:|---:|---:|---:|
| UGTPHON | Hangul | 99.0381% | 15.1289% | 27.3038% | 28.5421% |
| UGTPHON | Jamo | 100% | 16.0562% | 24.5200% | 25.5353% |
| SIGMORPHON 2021 Korean | Hangul | 99.8999% | 24.6493% | 17.3079% | 20.6270% |
| SIGMORPHON 2021 Korean | Jamo | 100% | 24.8248% | 17.1632% | 20.4528% |

The raw SIGMORPHON file contains 1,000 rows; 999 pass the shared scorer's eligibility filter. The benchmark uses top-1, strict grapheme handling and an allow-list of 56 MFA phones. The phone-to-IPA identity assumption still needs independent specialist review. MFA remains outside production.

## Data and evidence ownership

- `data/korean/rules.csv`, `rule_scope.csv`, `rule_ordering.csv`, `realization_environments.csv` and `phonotactics.csv` hold structured phonological rule information.
- `data/korean/lexical_pronunciations.csv`, lexical additions and IPA realization/override files hold lexical evidence and explicit exceptions; do not silently convert research candidates into production gold.
- `data/korean/ipa/` holds versioned IPA normalization/reference adapters, with source conventions and exclusions recorded alongside each profile.
- `data/correspondence/` and `data/korean/canonical_correspondence.csv` hold target correspondence and canonical mapping material; inspect schemas and provenance before editing.
- `research/SOURCE-REGISTER.csv` is the source inventory; `research/RULE-COVERAGE.csv` maps rule evidence to implementation/tests; `research/ACCEPTANCE-GATES.md` owns acceptance status; `research/DECISION-LOG.md` is append-only.
- `reports/` contains generated/derived reports. Do not hand-edit generated output when a canonical input and generator exist.
- `licenses/`, `LICENSE` and `public/THIRD_PARTY_NOTICES.txt` document distinct project and third-party rights. The root custom licence is not an OSI-approved open-source licence.

## Development commands

The authoritative command list is in `package.json` and `pyproject.toml`; inspect scripts before execution because names and environments can evolve.

```bash
# Browser tests and production build
npm test
npm run build

# Python tests
python -m pytest

# Install the Python project in editable mode (review pyproject.toml first)
python -m pip install -e ".[dev]"

# Build a wheel (the CI workflow also tests wheel installation)
python -m build
```

For benchmark reproduction, prefer the pinned workflow or documented script invocation in the benchmark register. Do not infer reproducibility from the presence of a script alone.

## Safe change sequence

1. Read root `AGENTS.md`, the relevant focused skill and the owning source/evidence register.
2. Inspect the current main state, callers, tests, schemas, generators and workflows before editing.
3. For behavior changes, add a regression that fails for the intended reason; fix the root cause rather than patching a symptom.
4. Keep Korean orthography, structural/morphological analysis, Korean phonology, IPA/typed uncertainty and Ukrainian target rendering as explicit stages.
5. Update canonical data first and regenerate derived artifacts through their generator.
6. Run the focused tests, then the repository-defined CI matrix and parity/rights/data gates relevant to the change.
7. Record exact commit/run IDs and distinguish PASS, FAIL, SKIPPED, CANCELLED and NOT RUN.
8. Update the existing audit/register/handoff in place; do not create a duplicate plan or second source of truth.

## Branch and history policy

`main` is the only active integration branch for the current owner-directed continuation. Historical/supporting refs may remain for recovery and auditability; their existence does not mean they are active development targets. No branch should be deleted or force-updated merely to make the branch list look tidy. Inspect open PRs and compare any proposed branch changes before merging; never merge a stale branch solely because its name looks unfinished.

## Structure inventory and limitations

The repository is intentionally not reorganized by bulk-moving historical research files. The flat, dated `docs/` and `research/` namespaces preserve stable links and audit history. Use this guide and [documentation map](README.md) as the curated navigation layer instead of renaming old records.

Counts and file inventories in historical audit sections are point-in-time snapshots; do not treat them as current counts. The current tree is large and includes 100+ research/documentation records, data, schemas, workflows, scripts, and both Python/browser runtimes. The full recursive tree at `05137e2ce3c03c72a9e4de6754e9a6f29855cb47` is the authoritative inventory for this snapshot.

## What this repository contains

A Python research package, a browser-based practical/research application, Korean phonology and lexical datasets, a Korean-to-Ukrainian IPA target layer, reproducible research tooling, source-rights records and a public GitHub Pages service.

## Previous 236-case and benchmark snapshot — 2026-11-07

The reconstructed 236-row cohort contains 15 exact standard-form runtime dispositions, 181 bounded profile-convention decisions, 12 original abstentions and 28 residual cases. The 40 residual cases have explicit no-audio engine-policy dispositions, but all 40 remain unresolved as speaker-specific IPA gold. Do not describe the 181 profile decisions as new categorical rules or the 40 engine-policy decisions as IPA adjudication. The historical 236/239 selector membership is reconstructed, not independently proven.

Historical snapshot only: its UGTPHON paired values are superseded by the current 2026-11-08 table below; its SIGMORPHON values are likewise superseded. Preserve this paragraph as dated audit history, not as the current benchmark statement.

At the current documentation inventory check on main commit `f786c746d2f744b611acda0bc02f81d93c448487`, the recursive Git tree contains **853 entries** (810 files and 43 directories), including 183 Markdown files, 399 files under `tests/`, 65 scripts, 18 GitHub Actions workflows and 13 schemas, 150 files under `docs/` and 60 under `research/`. These are point-in-time inventory counts, not measures of implementation completeness.


## IPA target renderer ownership and validation boundary

## Korean surface-to-IPA adapter (upstream of the target renderer)

Do not confuse the Korean IPA realization module with the Ukrainian target renderer:

- src/korean_ukrainian/ipa.py / realize_syllables(): Korean surface Hangul → broad IPA. The g2pK adapter uses this module to render g2pK's Hangul pronunciation output; Native shares the same IPA realization layer.
- src/korean_ukrainian/ipa_target_renderer.py: IPA → Ukrainian practical orthography. This is downstream and is not used to score Korean G2P IPA exact match/CER.

The paired Native/g2pK and selected multi-engine comparisons therefore share an IPA representation adapter. g2p-ko and KoG2Padvanced surface outputs also pass through it; kokorog2p is g2pK-derived. The benchmark is not a comparison of ten fully independent IPA encoders.

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

Local shell/npm/pytest commands were not run in this connector-only environment. The CI evidence above is the actual verification source. PR #461 was squash-merged into main as `b014d0107a47c3117c7dcbdd8d403f7fca3c7d41`; the latest open-PR query returned zero open PRs. Non-required diagnostic jobs are recorded separately in the canonical audit.


## 2026-11-08 — benchmark mode ownership and execution map

The existing directory structure remains intentionally stable; no bulk moves or duplicate skill/plan systems were introduced. Benchmark responsibilities are:

- scripts/benchmark_kozak_kim_browser.mjs — shared Browser Kozak Kim token-level IPA scorer for UGTPHON and SIGMORPHON; dataset identity and source are explicit report metadata.
- scripts/benchmark_kozak_kim_seoul_browser.mjs — Seoul word-level Hangul surface scorer.
- scripts/benchmark_kozak_kim_seoul_ipa.mjs — Seoul word-level phonemic IPA scorer via the versioned adapter.
- .github/workflows/multi-engine-ipa-benchmark.yml — pinned external Strict-compatible engine comparisons plus three-mode Kozak Kim reports for UGTPHON and SIGMORPHON.
- tests/kozak-kim-ipa-first-benchmark.test.mjs and tests/kozak-kim-seoul-benchmark.test.mjs — metric semantics, typed fallback, unresolved passthrough and output-availability regressions.

The canonical metric and compatibility contract is [methodology — mode coverage and output availability](methodology.md#mode-coverage-and-output-availability-contract-2026-11-08). Do not label third-party engines as Kozak Kim modes; do not treat the morphology-consensus diagnostic as a replacement mode; do not score the reconstructed 236-case candidate cohort as gold.
