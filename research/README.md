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
The repository audit/navigation, independent browser/Python version policy, and owner-approved ClippyFirst Project License have been merged into `main` via PR #434 (merge commit `56318e8a293d6f92dc307256430279d386a77d33`). The repository remains a **partial research prototype**, not research-certified or release-ready. Software CI on the current main head passed for tests, system verification and generated artifacts, but the Pages deployment timed out; these checks do not establish linguistic correctness or source-item reuse rights. Distinguish the blocked live NIKL HTTP crawl from the already completed local-HTML metadata inventory: the repository-held capture parses 30/30 Standard Pronunciation Rules articles and its schema/reproducibility workflow passed, while page-level KOGL rights and pristine capture authenticity remain unresolved.

Current evidence gaps:
- cleanly recapture the NIKL page with translation/browser extensions disabled, preserve the new file as a separately identified source artifact, and compare its byte hash; the current local HTML inventory is 30/30 but contains a likely injected DeepL controller and 17 referenced assets are absent;
- inspect the page-specific KOGL mark and item-level reuse terms for the Standard Pronunciation Rules page and cited Q&A/dictionary items; live automated HTTP access remains blocked (HTTP 403), and local import does not verify robots or rights;
- obtain independent Korean IPA review and adjudication from qualified reviewers on a frozen holdout;
- obtain independent Ukrainian phonetic/orthographic target review on frozen IPA inputs;
- finish rule-level parity across browser, Python, CLI, and API where the current rule coverage matrix says it is incomplete;
- crosswalk C12 mismatch rows to source utterances, audio, speakers, dialect and prosodic context before any production change;
- reconcile the historical 239 Broad-v2 mismatch occurrences. This is a historical diagnostic population, not 239 confirmed production defects. The archived 1,267-row fragment export, 36-row current unmapped queue, 13 cluster rows, and 38 paired-discrepancy rows have different grains and are not interchangeable. A complete hash-pinned 239-occurrence ledger with source-context crosswalk, exact IPA profile, provenance and adjudication is still missing; do not mass-change production outputs or expected tests to force corpus agreement.
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


## 2026-11-05 — engine scope and mismatch continuation

NIKL R001–R016 and their exact-form licenses belong exclusively to Kozak Kim. The ordinary browser and optional Python g2pK adapters now preserve raw g2pK surfaces and derive IPA without Kozak Kim NIKL or lexical overlays. This restores a genuinely independent comparison baseline; see `docs/G2PK-INTEGRATION-2026-10-15.md` and the current repository audit.

The historical 239 Broad-v2 mismatch occurrences remain PARTIAL / EVIDENCE-LIMITED. They are not 239 proven engine bugs. The 36-row unmapped queue is a later, narrower extraction; the 1,266-row fragment export is a different occurrence/fragment grain. Each candidate correction needs the original source context, profile/normalization provenance, a defensible Korean pronunciation analysis, and a negative control before production promotion.


## 2026-11-05 follow-up — context-recovered R013 cases

The historical **239** figure is the 2026-11-02 population of Broad-v2 mismatch occurrences whose fragments had not yet been assigned to C01–C10 candidate families. It is not the current count of unresolved production defects. Subsequent cluster work (including C11 and C12) reclassified substantial portions; the later **36-row** unmapped review queue is a narrower extraction and has a different grain. Do not treat 239, 36, 1,266 fragment rows, 13 cluster rows, or 38 paired-discrepancy rows as interchangeable.

Using the pinned `naver-ai/UGTPHON:ko/test.json` source at commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`, four exact same-eojeol forms now have source-context-backed NIKL §27 licenses in Kozak Kim only: `해줄것`, `많을거같이`, `내릴수있는`, and `존중시킬수도있지만`. The context/decision register is [`kozak-kim-context-adjudication-2026-11-05.csv`](kozak-kim-context-adjudication-2026-11-05.csv). The UGTPHON Broad-v2 IPA is a comparator, not normative gold; the NIKL rule supplies the phonological basis. Browser/Python tests cover the exact forms, full source sentences, negative controls, and g2pK isolation.

One additional queue item, `출산` (UGTPHON row `dc_inside_2107`), is **retained under the existing Kozak Kim R012 / NIKL §26 license** pending independent review: the Broad-v2 comparator omits fortis /s͈/, but that alone is not sufficient reason to remove a source-backed rule. The full user-generated context is not duplicated in the ledger because it contains profanity; the pinned row ID is retained.

The 36-row queue now has complete recorded dispositions: four exact-form R013 fixes, one provisional R012 retain (`출산`), and 31 individually reasoned `ABSTAIN` decisions. These are conservative production dispositions, not independent IPA judgments. The full hash-pinned 239-occurrence/context ledger remains blocked on exact historical membership and fragment-to-C01–C10 assignment; the 36-row queue is not a substitute. The full post-fix UGTPHON benchmark has not been rerun. Do not claim that all 239 are fixed or that old benchmark metrics measure the new code.


## 2026-11-05 follow-up — queue dispositions and trace provenance

The 36-row narrow Broad queue now has explicit row-level dispositions: four exact R013 fixes, one provisional R012 retain (`출산`), and 31 evidence-limited abstentions in [the individual decision register](kozak-kim-31-row-individual-abstentions-2026-11-05.csv). Each abstention records the occurrence/source-row locator, pinned UGTPHON commit, reference and engine profile labels, the queue blob SHA, and a row-specific reason. Historical engine commit and normalizer version are explicitly marked unrecovered rather than guessed. These are conservative production decisions, not independent IPA judgments.

Python `RuleTrace` now exposes per-occurrence `applied_occurrences` and `license_contexts` (including matched source license, source pair, word form, index and before/after state); the original scalar `license_context` remains for compatibility.

The full historical **239** population remains separate and BLOCKED. The original 2026-11-02 multi-engine artifact has been recovered and hash-pinned (run `41471244424`, artifact `13156351613`, SHA-256 `749ac9a2b9db96c1e27828919afe05ef4320e35ca6a91ab2038c1ff3e9d04c69`; run-head `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695`). It contains 2,703 stable occurrence records per engine and pins the UGTPHON source revision, Native IPA profile, Broad sensitivity profile, normalization code snapshot and g2pK 0.9.4. What remains unrecovered is the exact 239-member ID set or a reproducible historical per-fragment C01–C10 assignment/selection predicate. The 1,267-row fragment export and 36-row current queue do not encode that membership. Do not select an arbitrary subset or create placeholder rows.


## 2026-11-05 — recovered historical benchmark source artifact

The original 2026-11-02 multi-engine benchmark artifact has now been recovered and pinned in [the historical-239 recovery manifest](kozak-kim-historical-239-recovery-manifest-2026-11-05.md): workflow run `41471244424`, run-head `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695`, artifact `13156351613`, SHA-256 `749ac9a2b9db96c1e27828919afe05ef4320e35ca6a91ab2038c1ff3e9d04c69`. It contains the full 2,703-occurrence ten-engine report, the pinned UGTPHON source revision, the native and broad profile IDs, normalization contract and upstream engine pins.

This closes the *artifact recovery* part of the 239 task, but not the 239-row ledger. The tracked 1,267-row mismatch export does not preserve a per-fragment C01–C10 assignment or an explicit historical-239 membership flag. The original selection predicate/assignment snapshot must be reproduced and shown to yield exactly 239 stable IDs before source contexts and individual decisions can be joined. Do not force a 239-row selection from the aggregate count.

The 31 current-queue abstention rationales now identify each occurrence, source row and its concrete unmatched Broad edit(s); all 31 decisions remain conservative evidence-status abstentions, not independent IPA judgments. The recovered historical benchmark ZIP has been hash-verified, but inspection of the pinned exporter shows that its stored cluster labels are only occurrence-level unions over strict plus Broad edits. The union cannot reconstruct the historical per-fragment C01–C10 membership predicate; see the recovery manifest for the exact negative reconstruction counts and remaining acceptance condition.

## 2026-11-05 verification refresh — current `main`

Current `main` is `d68cb09e12eb8b71b264775f2cf7ac6e9c2a51c5` (single branch; no open PRs). Exact-head GitHub Actions on this commit: tests `42000327552` PASS (Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, browser tests); System Verify `42000327509` PASS (Python and browser tests/build; live NIKL metadata-only inventory SKIPPED); master/research artifacts `42000327383` PASS; Pages deployment `42000327385` PASS. These checks validate software and generated artifacts, not independent IPA correctness, Ukrainian target quality, or source-item rights.

The narrow 36-row queue's disposition register is complete (4 FIX, 1 provisional RETAIN, 31 ABSTAIN); the five source-context adjudication rows are separately recorded in `kozak-kim-context-adjudication-2026-11-05.csv`. Python `RuleTrace` per-occurrence `applied_occurrences` and `license_contexts` are implemented and covered by the verified test suite. The historical 239-row ledger remains BLOCKED solely on exact 239 membership / historical fragment assignment reconstruction; the recovered artifact itself is no longer missing.
