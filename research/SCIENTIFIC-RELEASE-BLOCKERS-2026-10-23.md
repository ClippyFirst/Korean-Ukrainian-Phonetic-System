# Scientific release blockers — reconciled execution register (2026-10-23)

## Scope and baseline

Current default branch baseline: `5bb9178243604d169c2209671a953f8683b48408` (includes the merged native IPA-adapter empty-input guard, PR #264). This register reconciles the master handoff, acceptance gates, source register, normative article fixture, IPA queue, and deployment workflow. It supplements those canonical sources; it does not replace them.

**Disposition: deployed research preview / partial prototype. Not accepted as a scientifically validated release.**

## Corrected inventory findings

### Normative article coverage is present, but has a bounded meaning

- `tests/fixtures/standard-pronunciation-rule-coverage.json` enumerates all articles 1–30 in order: 29 are marked `verified`, and Article 1 is `not-applicable` because it is a governing principle rather than a standalone phonological rewrite.
- `tests/standard-pronunciation-rule-coverage-gate.test.mjs` verifies article inventory, exact evidence references, source URLs, linked test-title anchors, status vocabulary, unique evidence IDs, and absence of silently unverified numbered articles.
- The matrix itself explicitly limits “verified” to **finite normative-example coverage**. It does not establish every subparagraph, exception, productive environment, all lexical/morphological contexts, or independent linguistic review.
- `research/RULE-COVERAGE.csv` is a separate cross-runtime phenomenon/workstream matrix, not the 30-article inventory. Its `partial` and `known_gaps` fields remain material. The correct status is therefore **PARTIAL with substantial existing finite-example coverage**, not “no 30-article coverage.”

### Source and reuse rights

- `research/SOURCE-REGISTER.csv` has 100 data rows at the current baseline.
- NIKL's site-wide reuse policy is documented in the register, but the precise item-level KOGL marking on the standard page and multiple Q&A items was not visually verified. This is not evidence of blanket prohibition, nor does the site-wide policy alone settle the terms for every copied artifact.
- Review the exact source item and intended artifact/use. Record visible license/KOGL type, exact URL or record ID, access/review date, attribution, modification and redistribution conditions, artifact retained, hash where applicable, reviewer and rationale. While unresolved, keep only necessary reference metadata and do not redistribute copied text/data whose permission is not established.

### IPA and Ukrainian target evaluation

- `research/ipa-adjudication-queue.json` contains 20 cases (IPA-001–IPA-020). Reviewer A and B submissions remain empty for all cases; final IPA and reconciliation are null. Current independent broad-IPA adjudication is **0/20**.
- NIKL Hangul surface notation supports a Korean surface claim; it is not itself IPA gold.
- Ukrainian target adaptation is a separate review boundary. Passing structural mapping tests does not establish Ukrainian phonetic adequacy or user comprehension.

### Source retrieval

- The existing official NIKL crawler records HTTP 403 for direct access in the GitHub Actions environment and did not emit a live verified manifest.
- Continue only through ordinary authorized access or the existing local saved-page importers. Record access mode/status/hash and preserve uncertainty. Do not bypass access controls or promote source rows based on titles, URLs, or inferred contents.

### Pages smoke regression

- Run [40007564481](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007564481), failed job `120599746894`, showed that deployment succeeded but the following smoke step failed on a stale grep assertion. It expected the obsolete UI statement “Практичний режим точно відтворює вихід JavaScript-порту g2pK без словникових виправлень”, while the current UI explicitly documents a few exact NIKL-supported surface corrections.
- The current continuation updates the assertion to the exact phrase now in `index.html` and adds a Node regression test that cross-checks the workflow assertion against source HTML, mode ID, and system page title.
- This is a source-level repair only. Exact-head CI must pass, and after merge/manual workflow dispatch the public HTTP smoke and live Playwright interaction must pass before deployment is called verified.

## Task ledger

| ID | Status | Evidence | Acceptance criterion |
|---|---|---|---|
| SR-01 | BLOCKED_SPECIALIST_ADJUDICATION | 20-case queue; 0/20 independent submissions. | Two distinct qualified reviewers independently transcribe broad IPA with declared convention, boundaries and length; preserve originals and document reconciliation. |
| SR-02 | BLOCKED_SPECIALIST_REVIEW | Independent Ukrainian target-layer assessment and reader validation absent. | Independent review of IPA-to-Ukrainian choices, ambiguity, exceptions and comprehension. |
| SR-03 | PARTIAL | 30 article inventory mapped; 29 finite-example verified, Article 1 N/A; article-specific tests and separate cross-runtime matrix exist. | Create/reconcile atomic rows for each subparagraph, condition, exception, variant and interaction; link source, implementation and positive/negative/interaction tests; record gap/blocked-source/justified N/A explicitly. |
| SR-04 | BLOCKED_RIGHTS_REVIEW | Site-wide policy recorded; item-level marks and artifact-specific use unresolved for multiple records. | Evidence-backed item-level decision for each retained source/artifact, including attribution and reuse conditions. |
| SR-05 | BLOCKED_EXTERNAL_ACCESS | Canonical live NIKL crawl returns HTTP 403 in current workflow. | Authorized source retrieval or human-saved input through allowlisted importer, with hashes and retrieval provenance. |
| SR-06 | PARTIAL | Stale Pages smoke assertion root cause established; assertion and regression guard changed in this branch. | Exact-head CI passes; live HTTP and Playwright smoke pass against deployed URL. |
| SR-07 | DONE_VERIFIED at baseline | IPA adapter empty-input contract merged in main at `5bb9178243604d169c2209671a953f8683b48408`. | Keep source IPA boundary explicit; do not interpret API-contract correctness as phonetic validation. |

## Reviewer protocol for the 20-case queue

1. Freeze and hash the queue and review instructions before review.
2. Provide each reviewer with the written form, source-backed Korean surface comparator, relevant context, and declared broad-IPA convention. Hide the other reviewer's work and generated candidate IPA.
3. Each reviewer records qualification, timestamp, method/reference, IPA, syllable boundaries, vowel-length decision and notes.
4. Preserve both independent submissions. Do not reconcile until both are complete; unresolved disagreement stays unresolved.
5. Only after IPA adjudication route the case to the separate Ukrainian target review.
6. Report counts with denominators; never claim accuracy without an independent gold set and defined scoring procedure.

## Final release gate

Scientific release remains blocked until independent IPA adjudication, independent Ukrainian target review, atomic rule coverage, item-level rights review, and permitted source evidence are complete. CI/build success is necessary but not sufficient. No local commands were run in this GitHub-API-only session; do not claim local tests or live Pages smoke passed.
