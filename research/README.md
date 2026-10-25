# Korean–Ukrainian Phonetic System: Research Programme

Status: research programme established; baseline repository and runtime audits substantially reconstructed; official NIKL inventory crawl is blocked by HTTP 403 from the GitHub Actions runner.
Last updated: 2026-10-25.

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
The Phase 0 reconstruction is substantially complete on the current mainline, with CI and deployment evidence recorded in the master handoff. Do not treat the programme as scientifically complete: the official NIKL source inventory has not been retrieved by the new collector, full browser/Python morphology parity is not established, and independent IPA/Ukrainian target validation remains open.

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

The implementation and candidate-only UI for the five residual forms are tracked in [PR #336](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/336); the case ledger and acceptance gates are maintained in [the residual-case handoff](../docs/RESIDUAL-FIVE-CASE-ANALYSIS-2026-10-25.md). The verified code head before the handoff-only follow-up was `3031e7fcc7aee16fedc6f6537ad8a44aa17da972`; the code itself was unchanged by the later documentation reconciliation.

- `칡칡이`: the search-result snippet labels a folk-song heading `칡칡이`, but the opened PDF text layer reads `칭칭이` and gives the refrain `치기타 칭칭나네`. Other passages in the same PDF also use `칭칭이` as a folk-song/refrain label. This strengthens a source-specific correction candidate but does not visually verify the exact heading at p. 180; no lexical meaning or morphology for `칡칡이` is established.
- `쫒아내면` and `무서웟어`: explicit, opt-in spelling candidates `쫓아내면` and `무서웠어`; the original is not silently rewritten.
- `많앗구나유유유`: three candidate interpretations remain separate. Context examples show that `ㅠㅠㅠ` can mean tears and `유유유` can be literal text, but they do not resolve this isolated input.
- `삶의`: queue `research/salmui-ipa-review-queue.json` and canonical source-/candidate-blind packets A/B are bound to queue SHA-256 `c13b50fa336a81d94b82ad689195655cd2e2ca3b11843874c9d46ca2178cdfe3`. Both reviewer submissions remain blank. NIKL's `[살믜]` and `[살메]` are Hangul surface variants, not IPA.
- Ukrainian target adaptation remains a separate blocked step after independent IPA review; no unsupported IPA or Ukrainian target was promoted to gold.

Exact-head CI at `3031e7fcc7aee16fedc6f6537ad8a44aa17da972) passed: 1,258 Node tests, browser integration/build, system/browser/Python regression and data-integrity checks, strict corpus/master-table generation, Python 3.11/3.12/3.13 test jobs, wheel build, and clean wheel installation. See [tests run 40228232017](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40228232017), [system verification 40228232002](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40228232002), [browser integration 40228232008](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40228232008), and [corpus artifacts 40228232001](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40228232001). The live NIKL inventory job remains skipped by configuration and is not a pass.

The remaining gates require external evidence or specialist input: (1) visual/print-source verification of the folk-song title, (2) the original context or user confirmation for `많앗구나유유유`, (3) two qualified independent blind IPA submissions for `삶의`, and (4) a separate Ukrainian target review after IPA reconciliation. Passing CI does not resolve these linguistic questions.


### Repository-only fingerprint audit — 2026-10-25

A bounded audit of existing text/data files found an earlier `삶의` footprint in `data/korean/lexical_pronunciations.csv` (line 644): `sal|mi` / `сал|мі`, with `sal|me` / `сал|ме` as alternate fields and status `provisional`. This is a candidate record, not independent gold. It does not match the separate triage notation `sal.mɰi`; the discrepancy is now recorded in the residual-case handoff and guarded by a regression test. Do not silently promote or rewrite the row. The reviewed page and sentence-corpus fixtures did not contain the other unresolved input fingerprints. This pass searched repository text/data only and did not search for PDF or audio files.
