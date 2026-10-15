# Korean–Ukrainian Phonetic System: Research Programme

Status: programme scaffolding created; baseline repository audit not yet completed.
Last updated: 2026-10-15.

This directory is the durable source of truth for research planning, evidence tracking, implementation coverage, decisions, and release acceptance. Continue work from these files rather than relying on chat history.

## Start here
1. [Master directive](MASTER-DIRECTIVE.md) — mission, principles, and working protocol.
2. [Roadmap](ROADMAP.md) — staged work programme and exit criteria.
3. [Source register](SOURCE-REGISTER.csv) — source inventory and seed sources.
4. [Rule coverage matrix](RULE-COVERAGE.csv) — traceability from rules to code and tests.
5. [Source-by-source assessment](SOURCE-ASSESSMENT-2026-10-15.md) — utility, limits, and integration decisions for current and candidate sources.
6. [Source discovery queue](SOURCE-DISCOVERY-QUEUE.csv) — prioritized research backlog with risks and next actions.
7. [Decision log](DECISION-LOG.md) — durable record of consequential decisions.
8. [Release acceptance gates](ACCEPTANCE-GATES.md) — evidence required before a release is accepted.

## Current state
The programme has been defined, but the existence of these documents does not mean the repository, all branches, external sources, runtime parity, or public deployment have been fully audited. Those are Phase 0 tasks.

Open until Phase 0 produces evidence:
- full branch, commit, and PR inventory and identification of unmerged useful work;
- baseline test and build results;
- external source and implementation inventory;
- rule-level coverage across browser, Python, CLI, and API;
- independent corpus quality and Ukrainian target-layer review;
- deployed-site verification.

## Working rules
- Update these files as work progresses. Every work session must leave a durable status update.
- Record exact evidence, source URLs, versions, commit SHAs, commands, and outcomes.
- Distinguish not checked, checked and absent, partially implemented, implemented, tested, and independently reviewed.
- Do not mark work complete based on documentation claims alone.
- Prefer small, reviewable changes on task-specific branches and integrate only after required checks.
- Never claim a branch was merged, a test passed, or a site was verified unless the result is recorded.
- If uncertain, record the uncertainty and next verification step.

## Status vocabulary
Use controlled statuses where possible: not_started, in_progress, blocked, source_verified, formalized, implemented, tested, runtime_verified, cross_runtime_verified, independently_reviewed, accepted, rejected, deferred.

A single item may need separate source, implementation, testing, and review statuses. Do not collapse them into one ambiguous “done” field.