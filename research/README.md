# Korean–Ukrainian Phonetic System: Research Programme

Status: research programme established; baseline repository and runtime audits substantially reconstructed; official NIKL inventory crawl is blocked by HTTP 403 from the GitHub Actions runner.
Last updated: 2026-10-21.

This directory is the durable source of truth for research planning, evidence tracking, implementation coverage, decisions, and release acceptance. Continue work from these files rather than relying on chat history.

## Start here
1. [Master directive](MASTER-DIRECTIVE.md) — mission, principles, and working protocol.
2. [Roadmap](ROADMAP.md) — staged work programme and exit criteria.
3. [Source register](SOURCE-REGISTER.csv) — source inventory and seed sources.
4. [Rule coverage matrix](RULE-COVERAGE.csv) — traceability from rules to code and tests.
5. [Source-by-source assessment](SOURCE-ASSESSMENT-2026-10-15.md) — utility, limits, and integration decisions for current and candidate sources.
6. [Source discovery queue](SOURCE-DISCOVERY-QUEUE.csv) — prioritized research backlog with risks and next actions.
7. [Literature and methods review](LITERATURE-AND-METHODS-REVIEW-2026-10-15.md) — Korean G2P research, formal rule models, neural/hybrid alternatives, Ukrainian receiving-language studies, and the required comparison protocol.
8. [Critical literature review 01](CRITICAL-LITERATURE-REVIEW-01-2026-10-16.md) — evidence memo distinguishing accessible full-text findings from abstract-only evidence, with implementation implications and remaining review tasks.
9. [Ukrainian target-layer comparison](UKRAINIAN-TARGET-LAYER-COMPARISON-2026-10-16.md) — page-referenced comparison of Shchegel (2009) and Kovalchuk (2011), including conflicts and proposed tests.
10. [Decision log](DECISION-LOG.md) — durable record of consequential decisions.
11. [Release acceptance gates](ACCEPTANCE-GATES.md) — evidence required before a release is accepted.

## Current state
The Phase 0 reconstruction is substantially complete on the current mainline, with current CI and deployment evidence recorded in the master handoff. Do not treat the programme as scientifically complete: the official NIKL source inventory has not yet been crawled by the new collector, full browser/Python morphology parity is not established, and independent IPA/Ukrainian target validation remains open.

Current evidence gaps:
- run the official NIKL collector in a network-enabled environment and reconcile all 30 article headings;
- inspect current source reuse terms before retaining or redistributing official article text;
- finish rule-level parity across browser, Python, CLI, and API where the current matrix says it is incomplete;
- obtain independent phonetic/IPA and Ukrainian target-layer review;
- retain exact-head CI and deployment smoke evidence for each release candidate.

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


## Official NIKL collection continuation — 2026-10-21

The metadata-first collector is available at `scripts/nikl-norm-crawler.mjs`; see `docs/NIKL-NORM-CRAWLER.md`. It is designed to inventory only the 30 articles of 제2부 표준 발음법, checks robots.txt, records exact response and per-article hashes, and fails closed on incomplete extraction. Fixture-based tests are part of the existing Node regression suite. The live crawl was attempted by GitHub Actions but the official page returned HTTP 403; the workflow recorded BLOCKED and did not try alternate hosts or bypasses. No live article inventory was produced. Source reuse terms remain unassessed, and the default output does not retain article text. See `research/SOURCE-REGISTER.csv`, `research/RULE-COVERAGE.csv`, and the latest master handoff for current status.


## Residual Korean edge cases — continuation on source-blind review workflow (2026-10-25)

This branch is based on `fix/ipa-review-source-blinding-20261025` (PR #329) so the new `삶의` review reuses the canonical source-and-candidate-blind packet builder and submission validator instead of duplicating a weaker packet format.

- Source evidence remains in `research/salmui-ipa-review-queue.json`; the reviewer packets contain only opaque `BLIND-001`, the Hangul input, fixed instructions, and empty fields.
- Packets A/B are bound to the exact queue bytes by SHA-256 `c13b50fa336a81d94b82ad689195655cd2e2ca3b11843874c9d46ca2178cdfe3`.
- Reviewer fields are intentionally blank. No IPA annotation or Ukrainian target is invented.
- `칡칡이` remains blocked despite an exact folk-song-heading attestation; `많앗구나유유유` remains multi-candidate because no original context identifies the tail.
- Explicit spelling suggestions for `쫒아내면` and `무서웟어` are integrated into the web UI and require user selection; sources are visible beside candidates.

Fresh exact-head CI for this stacked branch is the acceptance gate. Independent qualified reviewer submissions and the subsequent Ukrainian target review remain external blockers.

Current pull request: [#335](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/335), based on `main`; source-blinding implementation is reused from PR #329 and is not intended as a second runtime feature.
