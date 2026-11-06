# Architecture

## System contract

The product is a Korean-to-Ukrainian **phonetic rendering** system. It does not translate meaning and it does not claim to be an official Ukrainian national transcription standard.

The intended transformation boundary is:

```text
Korean orthography
  → Hangul / input structure
  → lexical and morphological context
  → Korean phonological analysis and ordered realization rules
  → Korean surface form and typed/project IPA
  → IPA-to-Ukrainian target adaptation
  → Ukrainian practical orthography
```

The Ukrainian target must be derived from the IPA/typed phonetic result. A parallel Hangul-to-Ukrainian shortcut is not an acceptable substitute. Revised Romanization (RR) and Hanja are separate explanatory side layers; neither is the source for the Ukrainian target.

## Runtime topology

### Browser application

- Entry documents: `index.html` (service) and `system.html` (methodology/research view).
- UI and orchestration: `src/main.js`.
- Engine composition: `src/app/engine.js`, with focused modules for shared Hangul handling, contextual rules, phrase-boundary rules, lexical handling, IPA and conversion.
- Practical pronunciation path: `src/app/g2pk_web.js` over the pinned browser-compatible G2P implementation in `src/vendor/g2pk/`.
- Research path: the project's own browser rule engine and evidence/lexical overlays. Practical and research modes are intentionally distinct.
- Target mapping: `src/app/engine_ipa.js` and the generated browser projection `src/app/ipa_target_data.js`; canonical source tables remain under `data/korean/`.
- RR and Hanja: `src/app/romanization.js` and `src/app/hanja.js`, rendered as separate information.

The browser port is not a claim of exact parity with Python g2pK's MeCab-dependent morphology. Preserve the documented limitations and explicit profile selection. Both browser and Python g2pK adapters preserve the pinned external engine's surface output and derive IPA from it; they do not consume Kozak Kim NIKL rule licenses, lexical surface corrections, lexical IPA overrides, or unresolved lexical statuses. The NIKL R001–R016 implementation and exact-form licenses are scoped exclusively to Kozak Kim.

### Python package, CLI and API

- Package: `src/korean_ukrainian/`; distribution metadata and optional extras are in `pyproject.toml`.
- CLI entry: `src/korean_ukrainian/cli.py` (`korean-ua`).
- Optional FastAPI application: `src/korean_ukrainian/api.py`.
- Main orchestration: `src/korean_ukrainian/pipeline.py`.
- Core stages: `hangul.py`, `phonology.py`, `rules.py`, `ipa.py`, `ipa_target_renderer.py`, and `orthography.py`.
- Optional comparison backend: `g2pk_engine.py`; it is not silently substituted for the native engine.
- Research-only morphology adapters and rule licences: `research_morphology.py` and `morphology_rule_licenses.py`.

The native path exposes analysis, surface/IPA phoneticization, IPA rendering and final transliteration as inspectable operations. Consumers must inspect status fields: an IPA string may be diagnostic-only when pronunciation context is unresolved, and provisional mappings are not expert-adjudicated output.

## Canonical data and generated projections

| Data area | Ownership / purpose |
|---|---|
| `data/korean/jamo.csv`, `phonemes.csv`, `vowels.csv`, `syllables.csv`, `phonotactics.csv` | Korean structural and phonological inventories |
| `data/korean/rules.csv`, `rule_ordering.csv`, `rule_scope.csv`, `realization_environments.csv` | Ordered rule definitions, environments and exclusions |
| `data/korean/lexical_pronunciations.csv` and dated additions | Exact lexical controls with provenance/status; dated additions are overlays, not independent gold |
| `data/korean/evidence.csv`, `sources.csv` | Claim/evidence metadata and source references |
| `data/korean/canonical_correspondence.csv`, `ipa_target_overrides.csv`, `ipa_realizations.csv` | Canonical IPA-to-Ukrainian target correspondence and explicit sequence/realization decisions |
| `data/correspondence/` | Feature weights and target contract |
| `data/validation/` | Validation case data |
| `schemas/` | Machine-readable contracts for records and import manifests |

Generated browser data must be rebuilt from canonical data, not edited independently. Use `npm run generate:ipa-target-data` and `npm run check:ipa-target-data`; the corresponding Python integrity tests also guard the projection.

## Research and source-evidence tooling

- `scripts/`: corpus generation, source import, auditing, benchmark, adjudication packet and training-readiness tooling.
- `research/`: source register, rule coverage, decision log, acceptance gates, reviewer packets and discrepancy ledgers.
- `.agents/skills/`: repository-specific NIKL evidence, crawler, rule-coverage and phonetic-engineering operating instructions.
- `.github/workflows/`: regression, data-generation, source inventory, benchmark, Pages deployment and optional research jobs.
- `reports/`: generated summaries and metadata-only source manifests. Treat reports as outputs; identify the canonical inputs and generator before editing them.

## Tests and build

- Browser tests: `npm test` → Node's test runner over `tests/*.test.mjs`.
- Browser build: `npm run build` → Vite build for both public pages.
- Combined browser release check: `npm run check:release`.
- Python tests: `python -m pytest -q`.
- Strict corpus generation: `python scripts/generate_korean_corpus.py --strict`.
- Master table generation: `python scripts/generate_master_table.py`.
- NIKL local HTML inventory: see [NIKL capture and inventory](NIKL-LOCAL-CAPTURE-AND-INVENTORY-2026-10-24.md) and [collector contract](NIKL-NORM-CRAWLER.md).

Requirements: Node.js `>=22.12.0`; Python `>=3.11`. Optional dependencies (g2pK, Kiwi, MeCab-Ko, FastAPI, Excel I/O) are explicitly installed through extras. Do not assume optional packages are present in a minimal install.

## Third-party boundaries

The browser-side G2P-derived code under `src/vendor/g2pk/` retains its upstream licence and attribution in `public/THIRD_PARTY_NOTICES.txt` and `public/LICENSES/`. Hanja data and external corpora have separate source-specific terms. The root ClippyFirst Project License does not replace third-party licences or clear source datasets.

## Evidence and confidence boundary

- Korean orthographic spelling, Korean surface pronunciation, IPA transcription and Ukrainian target spelling are different artifacts.
- NIKL bracketed readings are Korean pronunciation notation, not IPA.
- Corpus agreement and G2P agreement are diagnostic; they are not independent normative gold.
- `model-selected`, `provisional`, `diagnostic_only_unresolved_pronunciation`, `unavailable` and reviewer/adjudication states must not be collapsed into one success label.
- Unresolved source contexts remain unresolved; do not infer a general rule from a lexical example.
- Source access and source reuse rights are separate questions. A locally parsed NIKL file does not itself establish page-level KOGL permission.

For the repository inventory, file ownership, branch/CI snapshot and current blockers, see [Repository structure](REPOSITORY-STRUCTURE.md) and the latest dated [repository audit](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md).
