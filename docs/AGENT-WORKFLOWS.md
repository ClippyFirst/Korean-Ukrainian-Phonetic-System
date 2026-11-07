# Agent workflows and engineering operating model

**Status:** current operating guide, introduced 2026-11-06.  
**Scope:** repository work performed by coding agents and human maintainers.  
**Authority:** this guide routes work to existing contracts; it does not replace the research master directive, acceptance gates, source registers, rule coverage matrix or append-only handoff.

## Start with the right entry point

| Need | Start here | Authoritative detail |
|---|---|---|
| Understand the product and public interfaces | [README](../README.md) | [User guide](WEB-SERVICE-USER-GUIDE.md), [CLI/API guide](cli-and-api.md) |
| Understand runtime architecture | [Architecture](architecture.md) | [Repository structure](REPOSITORY-STRUCTURE.md), [IPA target contract](ukrainian-target-layer.md) |
| Understand Korean pronunciation evidence | [Research index](../research/README.md) | [Master directive](../research/MASTER-DIRECTIVE.md), [source register](../research/SOURCE-REGISTER.csv), [rule coverage](../research/RULE-COVERAGE.csv) |
| Check current research/release readiness | [Acceptance gates](../research/ACCEPTANCE-GATES.md) | [Decision log](../research/DECISION-LOG.md), [roadmap](../research/ROADMAP.md) |
| Continue existing work | [Master handoff](MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md) | Use the newest dated section; older entries are historical |
| Change code, tests, CI or documentation | [Engineering change skill](../.agents/skills/engineering-change/SKILL.md) | Root [AGENTS.md](../AGENTS.md) |
| Audit a subsystem or the whole repository | [Repository audit skill](../.agents/skills/repository-audit/SKILL.md) | [Repository audit snapshots](audits/) and dated top-level audits |
| Review a branch or PR | [Change review skill](../.agents/skills/change-review/SKILL.md) | PR-specific spec, diff and exact-head CI |
| Work on phonetic or IPA behavior | [Phonetic engineering skill](../.agents/skills/phonetic-engineering/SKILL.md) | [NIKL evidence skill](../.agents/skills/nikl-evidence-audit/SKILL.md), [rule coverage skill](../.agents/skills/nikl-rule-coverage/SKILL.md) |
| Capture NIKL source metadata | [NIKL crawler skill](../.agents/skills/nikl-norm-crawler/SKILL.md) | [Crawler guide](NIKL-NORM-CRAWLER.md) |

## The standard change lifecycle

```text
Request / existing issue / current plan
                 |
                 v
        Reconnaissance + scope
                 |
                 v
       Acceptance criteria / spec
                 |
                 v
     Evidence and root-cause check
                 |
                 v
     Failing test (when behavior changes)
                 |
                 v
       Smallest complete change
                 |
                 v
     Focused + full relevant checks
                 |
                 v
     Diff / integration / docs review
                 |
                 v
     Registers + append-only handoff
                 |
                 v
      Commit on owner-selected branch (`main` here)
                 |
                 v
       Exact-head CI + honest report
```

Not every documentation or configuration edit has a meaningful failing test. In those cases, use structural assertions, link checks, schema/build checks or exact-head CI, and state which verification was used. Do not fabricate a RED phase for an editorial-only change.

## Integration branch policy

The repository owner explicitly selects the integration branch. For this project the owner has designated `main`; ordinary continuation work therefore commits directly to `main` after reviewing the current state and preserving unrelated changes. Do not create task-specific branches unless the owner changes this instruction. Historical branches are audit/history evidence and must not be deleted as part of cleanup.

## Skill catalogue and boundaries

| Skill | Responsibility | Must not replace |
|---|---|---|
| `engineering-change` | General task framing, test-first implementation, root-cause debugging, lean changes, verification and handoff | Domain-specific linguistic adjudication |
| `repository-audit` | Whole-repository/subsystem map, risk-first findings, data-flow and documentation audit | A speculative redesign or unrequested code changes |
| `change-review` | Fixed-base review on specification/evidence and engineering-quality axes | Author's implementation task or PR merge decision |
| `phonetic-engineering` | Korean-to-IPA-to-Ukrainian pipeline, adversarial corpora, engine comparisons and runtime acceptance | Official NIKL source interpretation |
| `nikl-evidence-audit` | Source authority, claim-level evidence classes and pronunciation adjudication | Rule implementation coverage inventory |
| `nikl-rule-coverage` | Official rule inventory, implementation mapping and regression acceptance | A second rule/source registry |
| `nikl-norm-crawler` | Metadata-first official source inventory with rights-aware limits | Permission bypass or bulk text redistribution |

Use the narrowest skill that owns the work. Combine skills when a task crosses boundaries; do not duplicate their instructions into a new master prompt.

## Core transformation contract

For any Korean-to-Ukrainian pronunciation work, preserve the actual project pipeline:

`Korean source orthography → structural and supported morphological analysis → Korean phonology → IPA or typed uncertainty → Ukrainian target adaptation → Ukrainian practical orthography`.

Do not create a parallel Hangul-to-Ukrainian shortcut. Keep RR and Hanja as side layers, and keep Kozak Kim/NIKL research rules separate from the independent g2pK comparison adapters.

## Evidence and implementation are separate states

Use the project's task vocabulary:

| Status | Meaning |
|---|---|
| `DONE_VERIFIED` | The implementation and its required verification evidence exist on the stated commit. |
| `PARTIAL` | Some implementation or evidence exists, but at least one acceptance criterion remains open. |
| `TODO` | Work remains and no external blocker currently prevents it. |
| `BLOCKED` | A specific external dependency or missing evidence prevents the next acceptance step. |
| `DEFERRED` | Explicitly outside the current agreed scope. |

For research work, track source verification, linguistic interpretation, implementation, tests, cross-runtime parity and independent review separately. A case can have a verified official surface form while its IPA or Ukrainian adaptation remains unresolved.

## Review and verification rules

- For behavior changes, reproduce first and observe a focused test fail for the intended reason before implementation.
- Debug from the root cause. Trace inputs and outputs across modules, browser/native adapters, generated data and downstream renderers.
- Review specification compliance separately from engineering quality. Both must be acceptable.
- Review code beyond the diff: callers, tests, schemas, data, workflows and runtime entry points can be affected without being edited.
- Run the actual relevant full checks from `package.json`, `pyproject.toml` and `.github/workflows/`. Record exact commit, command/run ID, counts, result and skips.
- Never count a skipped job as a pass. Never infer a local test run from a GitHub Actions result.
- Never use aggregate benchmark scores as independent linguistic gold. Report denominator, split, profile, abstentions, failures and known convention limits.

## Structural and documentation rules

- Preserve stable file paths and dated research records. Do not bulk-move the flat `docs/` namespace just to make it look tidy.
- Put human navigation in `README.md` and `docs/README.md`; put agent routing in root `AGENTS.md`; put task procedure in the smallest relevant skill.
- Keep one canonical register for each concern: source provenance, rule coverage, acceptance gates, decisions and execution handoff.
- Generated data must be changed through its source and generator, then checked for drift.
- Keep upstream/vendor code, project-authored logic, external corpus data and user-supplied captures clearly separated.
- Do not create new documentation pages that restate an existing register. Link to the owner document and record only the new decision/evidence.


### Unlazy — explicit gates and evidence freshness

Reviewed source: [Leonxlnx/unlazy](https://github.com/Leonxlnx/unlazy/tree/16671491f6679ad9378f52604d3bc2415b4120c7), commit `16671491f6679ad9378f52604d3bc2415b4120c7` (2026-11-06 snapshot; README identifies source version 2.1.0 as unreleased). Its core skill requires observable acceptance gates, inspected command oracles, explicit approval before executing inherited checks, definition-bound evidence, re-verification, and honest handoff for unmet/abandoned gates.

**Adopt selectively:** keep the existing repository task vocabulary and canonical acceptance/handoff registers; make every substantial workstream's outcome, exact-head verification and unresolved handoff explicit; re-run relevant checks after final edits and treat stale/cancelled/skipped evidence as non-passing. This reinforces rather than replaces the current GitHub Actions and project registers.

**Do not import:** the standalone gate-checker, approval store, Stop hook, `.unlazy/` state machine, lease/dispatch machinery or Depth Tree orchestration. The repository already has CI, canonical matrices and domain-specific evidence skills; adding a second gate engine would duplicate state and introduce shell-execution/approval semantics that are not needed for this task. Unlazy's README describes approval as consent, not sandboxing; its checker executes commands with ambient filesystem, environment, credential and network access. No unlazy code, skill text, hook or dependency is copied.

## Upstream practices reviewed

The following repositories informed this operating model. The project adapts selected workflow ideas; it does not vendor, mirror or copy their skill text or implementation.

| Upstream | Revision reviewed | Selected practice | Project-specific adaptation |
|---|---|---|---|
| [obra/superpowers](https://github.com/obra/superpowers) | [`22f0b463`](https://github.com/obra/superpowers/tree/22f0b463e7a5e579904dd6211a520321035526f7) | Red/green TDD, systematic root-cause debugging, verification before completion | Applied through `engineering-change` and `phonetic-engineering`; no blanket rule that every prose/config edit must have a contrived failing test |
| [mattpocock/skills](https://github.com/mattpocock/skills) | [`4ae2317d`](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d) | Separate spec compliance from engineering standards; trace research claims to primary sources; keep docs discoverable | Applied through `change-review`, NIKL evidence workflows and this navigation guide; no dependency on its external issue-tracker setup or subagent orchestration |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | [`96608e07`](https://github.com/DietrichGebert/ponytail/tree/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846) | Risk-first repository audit, trace real data flow, concrete findings, smallest complete fix | Applied through `repository-audit` and `change-review`; benchmark savings/scoreboard claims are not imported as evidence about this project |

### Practices deliberately not imported

- No wholesale copy of upstream skills, prompts, hooks, plugins, or benchmark code.
- No requirement to spawn parallel agents where the current environment does not provide them.
- No Ponytail benchmark savings or quality percentages are attributed to this repository.
- No blanket “fewest lines” objective: correctness, evidence, security, accessibility, error handling and complete acceptance take priority over line count.
- No bulk directory migration or renaming of historical docs, source files, fixtures or generated artifacts.
- No second source registry, rule matrix, master plan or acceptance-gate ledger.

## Maintenance

When a skill is added, removed or materially changed:
1. update root `AGENTS.md` routing;
2. update this catalogue and `docs/README.md` if navigation/ownership changes;
3. add or update a structural contract test when it protects a real invariant;
4. update the upstream integration record if a source revision or adopted practice changes;
5. verify links and run the relevant test suite on the final commit.

The skill file is the operational contract. This guide explains where it fits; it is not a second copy of the skill.
