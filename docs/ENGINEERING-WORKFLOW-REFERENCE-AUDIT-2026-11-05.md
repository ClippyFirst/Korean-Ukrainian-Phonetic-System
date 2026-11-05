# Engineering workflow reference audit — 2026-11-05

## Scope and reviewed snapshots

This comparison covers README, root structure, skills, tests, workflows and LICENSE at pinned commits:

- [obra/superpowers](https://github.com/obra/superpowers/tree/22f0b463e7a5e579904dd6211a520321035526f7) — `22f0b463e7a5e579904dd6211a520321035526f7` (2026-11-03).
- [mattpocock/skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d) — `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d` (2026-10-31).
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail/tree/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846) — `96608e078b2d5ea607c5c3b8b5a54d1c1fba6846` (2026-10-29).

This is a workflow comparison, not a security audit or independent reproduction of the third parties' benchmark claims.

## Findings and project-specific adoption

### Superpowers — staged engineering method

Its README and composable skills describe requirements/design clarification, a concrete plan, TDD, systematic debugging, code review, verification-before-completion, worktree use and branch finishing.

**Adopt:** define the exact linguistic question and acceptance criteria before changing a rule; use failing regressions before fixes; separate debugging from speculative patching; require exact-head verification; isolate coherent work on dedicated branches.

**Boundary:** software workflow cannot substitute for Korean phonetic expertise, primary-source interpretation, corpus provenance, licensing review or independent Ukrainian target validation.

### Matt Pocock skills — small, composable and project-aware

Its README and skill catalogue emphasize small editable procedures, project setup, codebase design, research, TDD, implementation, review and bug diagnosis. Setup asks the project to identify its own tracker, labels and documentation location.

**Adopt:** one canonical documentation map; distinct research/implementation/review/release responsibilities; project-specific vocabulary and source ownership; focused procedures that point to canonical matrices rather than duplicating them.

**Boundary:** this repository already has extensive matrices and registers. A second skill catalogue or duplicate master plan would worsen discoverability.

### Ponytail — minimal changes with correctness gates

Its README promotes small necessary changes and exposes audit, debt, gain, help and review skills. The repository has broad packaging/runtime tests and a benchmark-results area with methodology and limitations. Its efficiency and test-coverage numbers are author-reported for its own setup; they were not independently reproduced here.

**Adopt:** smallest evidence-backed changes; keep audit separate from implementation; benchmark with pinned tasks, baselines, repetitions, metrics, raw artifacts and limitations; test supported runtimes independently.

**Boundary:** never trade linguistic correctness, provenance, accessibility or test coverage for fewer lines/tokens.

## Synthesis

| Practice | Decision | Application |
|---|---|---|
| Requirements/design clarification | Adopt | State the exact rule environment, source and evidence needed |
| TDD/systematic debugging | Adopt | Regression first, minimal fix, rerun exact matrix |
| Verification before completion | Adopt | Exact-head CI and generated-artifact parity for DONE_VERIFIED |
| Small composable procedures | Adopt | Improve navigation; retain existing matrices as canonical |
| Multi-agent orchestration | Selective | Parallelize independent evidence collection; one owner reconciles decisions |
| Benchmark methodology | Adopt | Pin inputs, artifacts, paired subsets, exclusions and limitations |
| Broad automatic refactoring | Reject as default | Linguistic and licensing constraints require evidence per change |
| Copying skill code | Not performed | No code, skill text, artwork or benchmark data copied |

## Licensing and reuse

All three inspected snapshots contain an MIT License: Jesse Vincent (2025), Matt Pocock (2026), and DietrichGebert (2026). No third-party material was copied. MIT permission for these repositories does not apply to unrelated linked assets or datasets. The target repository's ClippyFirst Project License continues to govern its original implementation; each dependency and dataset retains its own terms.

## Conclusion

The target repository already has an IPA-first contract, evidence/source registers, roadmap, handoff, focused tests, runtime parity checks and GitHub Actions. Its immediate need is discoverability and evidence/status reconciliation, not another methodology framework. A reproducible candidate inventory can pass software CI while its pronunciations remain unresolved; those are separate acceptance layers.

## References

- [Superpowers README](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/README.md) · [skills](https://github.com/obra/superpowers/tree/22f0b463e7a5e579904dd6211a520321035526f7/skills)
- [Matt Pocock skills README](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/README.md) · [engineering skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering)
- [Ponytail README](https://github.com/DietrichGebert/ponytail/blob/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846/README.md) · [tests](https://github.com/DietrichGebert/ponytail/tree/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846/tests)
