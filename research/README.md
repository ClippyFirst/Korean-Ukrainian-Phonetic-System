# Korean–Ukrainian Phonetic System: Research Programme

Status: research prototype; repository documentation, versioning policy and owner-approved custom licence are integrated into main. Scientific certification and release readiness remain blocked by independent IPA/Ukrainian review, NIKL item-level rights, C12 evidence, historical mismatch reconciliation and remaining coverage/parity work.
Last updated: 2026-11-05.

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

## Current state — 2026-11-05
The repository audit/navigation, independent browser/Python version policy, and owner-approved ClippyFirst Project License have been merged into `main` via PR #434 (merge commit `56318e8a293d6f92dc307256430279d386a77d33`). The repository remains a **partial research prototype**, not research-certified or release-ready. Software CI on the exact PR head passed, but those checks do not establish linguistic correctness or source-item reuse rights. The official NIKL metadata-only inventory was skipped; it must not be described as passed.

Current evidence gaps:
- complete a network-enabled, policy-compliant NIKL item inventory and inspect per-item KOGL markings/source ownership; the Standard Pronunciation Rules page previously returned HTTP 403 to automation;
- obtain independent Korean IPA review and adjudication from qualified reviewers on a frozen holdout;
- obtain independent Ukrainian phonetic/orthographic target review on frozen IPA inputs;
- finish rule-level parity across browser, Python, CLI, and API where the current rule coverage matrix says it is incomplete;
- crosswalk C12 mismatch rows to source utterances, audio, speakers, dialect and prosodic context before any production change;
- recover and reconcile the historical 239 mismatch occurrences into a hash-pinned occurrence ledger; the current 36-row Broad queue is not a substitute;
- close remaining names, loanwords, Hanja and regional-style coverage gaps;
- retain exact-head CI and deployment smoke evidence for each release candidate.

Supervised neural training remains deferred until independently adjudicated IPA gold is available.

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

## Feature continuation — Korean Revised Romanization (2026-10-28)

The RR audit view is being developed in [PR #354](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/354). See [the feature contract and evidence](../docs/KOREAN-ROMANIZATION-RR-2026-10-28.md), [the roadmap status](ROADMAP.md#korean-revised-romanization-audit-view--2026-10-28), and [the RR release gate](ACCEPTANCE-GATES.md#addendum--revised-romanization-feature-gate-2026-10-28). It is intentionally a parallel display from resolved surface Hangul; IPA remains the only source for the Ukrainian target. The implementation is partial until exact-head CI/browser checks and a complete source-backed NIKL RR conformance matrix pass.
