# Contributing

Thank you for helping improve the Korean–Ukrainian Phonetic System. This repository combines a browser application, a Python package and a research programme. A contribution is complete only when its implementation, evidence, tests and documentation agree.

## Before changing anything

1. Read the [project overview](README.md), [documentation map](docs/README.md) and [repository instructions](AGENTS.md).
2. For agent-assisted work, use the focused procedure in `.agents/skills/`; see [agent workflows](docs/AGENT-WORKFLOWS.md).
3. Identify the canonical owner of the behavior or data you intend to change. Do not create a second source register, rule matrix, benchmark register, acceptance ledger or master plan.
4. Check the current `main`, open pull requests and exact-head CI before editing. The repository owner currently designates `main` as the sole active integration branch. External contributors should work in a fork and submit a pull request; maintainers should follow the owner's current integration instruction.

## Development setup

Requirements:
- Node.js 22.12.0 or newer for the browser application.
- Python 3.11 or newer for the Python package and research tooling.

Browser:
```bash
npm install
npm test
npm run build
npm run check:release
```

Python:
```bash
python -m pip install -e ".[dev]"
python -m pytest
```

Research extras are optional. Inspect `pyproject.toml` and install only the extras needed for the task. Benchmark runners may require additional pinned system packages and external engines; prefer the corresponding GitHub Actions workflow and benchmark-register instructions.

## Linguistic and data contributions

Preserve the documented transformation:

`Korean source orthography → structural and supported morphological analysis → Korean phonology → IPA or explicitly typed uncertainty → Ukrainian target adaptation → Ukrainian practical orthography`.

- Do not implement a parallel direct-Hangul-to-Ukrainian shortcut.
- Keep orthographic romanization, broad/narrow IPA, phonetic transcription and Ukrainian adaptation distinct.
- Do not silently guess unsupported pronunciations. Keep unresolved, partial and heuristic outcomes typed and visible.
- Cite primary sources at claim level. Record exact rule environment, source scope, edition/version, access date and the strength of the evidence.
- Distinguish normative attestations, dictionaries, corpus labels, secondary analyses, model predictions and hypotheses.
- Update `research/SOURCE-REGISTER.csv`, `research/RULE-COVERAGE.csv`, `research/ACCEPTANCE-GATES.md` or `research/DECISION-LOG.md` only when the contribution changes the concern owned by that register.
- Do not commit restricted corpora, audio, private reviewer mappings or token-level extracts unless their exact redistribution rights have been verified. Follow the aggregate-only artifact policy for restricted benchmark sources.

## Benchmark reporting

Every reported result must identify:
- dataset and immutable source/version pin;
- split, eligibility filters and denominator;
- engine and exact version/commit;
- IPA/normalization profile and whether it is independently adjudicated;
- candidate output availability separately from source-resolved scoring coverage;
- Exact, CER and other metrics with their scoring population;
- abstentions, unresolved/partial/heuristic/fallback rows and engine errors;
- overlap, training leakage, licensing and independent-review limitations.

Do not describe multiple tracks from one corpus as independent datasets. Do not describe a phonemic corpus reference as narrow phonetic gold. Do not present a skipped workflow as a pass or model-card figures as locally measured results.

## Tests and generated artifacts

- Add a focused regression for behavior changes and verify that it fails for the intended reason before fixing the behavior.
- Run focused tests first, then the relevant repository-defined checks in `package.json`, `pyproject.toml` and `.github/workflows/`.
- Regenerate generated data through its source generator; do not hand-edit generated output.
- Run `npm run audit:source-register` when source metadata changes and `npm run audit:source-rights` before release-oriented changes.
- Verify browser/Python parity when a shared behavior changes.
- Record exact commit SHA, command or workflow run ID, result, skipped jobs and unresolved limitations.

## Documentation and review

- Update the root README or `docs/README.md` when navigation or project status changes.
- Update `docs/REPOSITORY-STRUCTURE.md` when ownership, entry points or repository boundaries change.
- Append execution facts to `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`; preserve historical audit snapshots.
- Keep the change focused. Do not rename or move historical research files just to make the tree look tidy.
- Separate specification compliance from engineering quality in reviews.
- Never claim research certification, release readiness, complete linguistic coverage or rights clearance without the corresponding evidence.

## Licensing

The root project uses a custom, purpose-limited licence and is not an OSI-approved open-source licence. Read [LICENSE](LICENSE) and [licensing and permissions](docs/LICENSING-AND-PERMISSIONS.md) before reusing code or data. Third-party code, corpora, model weights and reference materials retain their own licences and terms. A citation is not a reuse permission.
