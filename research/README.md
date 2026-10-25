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


## Residual Korean edge cases — 2026-10-25

Continuation branch: [PR #334](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/334).

- `칡칡이`: exact string found as a regional folk-song title in [this local-culture PDF](https://www.busandabom.net/data/history/ebook/EB_culture_song02.pdf); lexical meaning and morpheme boundaries are still unverified. Status remains `blocked`.
- `쫒아내면` and `무서웟어`: the service now presents explicit, opt-in spelling candidates (`쫓아내면`, `무서웠어`). The original input is preserved unless the user selects a candidate.
- `많앗구나유유유`: the UI preserves three separate spelling/tokenization interpretations; contextual web evidence shows both `ㅠㅠㅠ` as crying and `유유유` as a phrase/title exist, but it does not resolve this input. Status remains multiple candidates only.
- `삶의`: two source-blind review packets are prepared under `research/ipa-review-packets/`; no reviewer annotations have been fabricated. `research/salmui-ipa-adjudication-coordinator.json` keeps independent IPA adjudication and subsequent Ukrainian target review as separate blocked gates.
- New regression tests: `tests/spelling-suggestions.test.mjs` and `tests/residual-five-evidence-and-blind-review.test.mjs`.

The exact-head GitHub Actions workflows are the executable verification gate. UI/code tests do not establish linguistic correctness; external qualified reviewers are still required for IPA and Ukrainian adaptation.


### Verification update — 2026-10-25

On `1e2288293c63e88dbb8150270e7910e625b3c48c`, the Node test suite passed **1,256/1,256**, Python tests passed on 3.11/3.12/3.13, the wheel build/clean-install check passed, Browser G2P integration passed, system browser/Python verification passed, and master-table/strict-corpus generation passed. Evidence: runs [40227008756](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40227008756), [40227008757](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40227008757), [40227008762](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40227008762), and [40227008739](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40227008739). The official NIKL live-inventory job was skipped, not passed. These are implementation/data-contract checks only; the `삶의` blind packets still await two qualified independent submissions and subsequent Ukrainian target review.
