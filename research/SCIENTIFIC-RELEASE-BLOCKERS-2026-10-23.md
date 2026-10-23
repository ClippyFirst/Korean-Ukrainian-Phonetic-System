# Scientific release blockers — execution register (2026-10-23)

## Scope and evidence boundary

This continuation executes against the existing master plan, acceptance gates, IPA queue, rule-coverage register, and source register. It does not replace those sources of truth or declare any linguistic claim verified merely because a test or checklist exists.

Historical baseline inspected: `main` at `17440e995cd38a2e57b5d203dfb0bd072b1fdbb5` (2026-10-23). At that snapshot, one open PR (#263, native IPA empty-input boundary) was found; that PR has since been superseded by PR #264 and closed. Recent mainline CI at the historical baseline showed tests/verification passing while the Pages deployment workflow failed its smoke assertion. The root cause and ported correction are recorded below. This is a historical snapshot, not a claim about the current deployment.

## Task ledger

| ID | Status | Evidence observed | Acceptance criterion / next action |
|---|---|---|---|
| SR-01 | PARTIAL | `research/ipa-adjudication-queue.json` has 20 cases (IPA-001–IPA-020); 0/20 reviewer-A IPA fields populated, 0/20 reviewer-B IPA fields populated; all reconciliation statuses are `BLOCKED_SPECIALIST_ADJUDICATION`. | Recruit two qualified Korean phonetics reviewers. They independently transcribe broad IPA before seeing each other's work; record method/reference, boundaries, length and relevant contrasts; reconcile disagreements transparently. No author-generated guess may be relabelled independent gold. |
| SR-02 | BLOCKED_SPECIALIST_REVIEW | Existing target-layer consistency tests are mechanical and `research/RULE-COVERAGE.csv` explicitly calls the target policy linguistically provisional. | Two independent Ukrainian phonetics/orthography reviewers assess IPA → target correspondences, exceptions and ambiguity. Keep target review separate from Korean-surface and IPA review; document disagreement and reader comprehension evidence before claiming validated practical orthography. |
| SR-03 | PARTIAL, finite-example coverage mapped | `tests/fixtures/standard-pronunciation-rule-coverage.json` maps articles 1–30 (29 `verified`, Article 1 `not-applicable`); CI validates exact evidence anchors. The separate phenomenon matrix retains implementation and cross-runtime gaps. | Reconcile an atomic inventory of subparagraphs, conditions, exceptions, variants and interactions against official source, implementation and positive/negative tests. Do not equate article-level evidence with productive morphological completeness. |
| SR-04 | BLOCKED_RIGHTS_REVIEW | Source register has 101 data rows at inspected baseline; numerous NIKL rows explicitly state that site-wide policy is known but item-level KOGL markings were not checked. | For each retained source record, capture item-level license/KOGL type, source page or record ID, applicable terms, attribution text, modification/redistribution conditions, review date and reviewer. Exclude or metadata-only-reference rows whose reuse permissions are unresolved. Do not infer a record's license from another record or the site-wide policy. |
| SR-05 | BLOCKED_EXTERNAL_ACCESS | Existing handoff records HTTP 403 for live NIKL access and distinguishes metadata-only local import from source verification. | Retry only through ordinary authorized access and the existing allowlisted intake path. Save the exact URL, timestamp, status, retrieval method and content hash where permitted. A 403 is not evidence that a claim is false or that a rule is absent. Do not bypass access controls, fabricate a successful crawl, or promote citation-only rows to reviewed. |
| SR-06 | PARTIAL | Baseline mainline CI: `Verify Korean–Ukrainian system` and `tests` reported success at SHA `17440e995cd38a2e57b5d203dfb0bd072b1fdbb5`; Pages deployment reported failure; another verify run was in progress. | Inspect the failed deployment run's job/step logs and repair only a demonstrated configuration or build issue. Re-run the workflow at the exact final candidate SHA and verify the public URL. Never treat tests passing as deployment passing. |
| SR-07 | PARTIAL | The README documents separate practical browser and native research paths; the browser JS port lacks the original g2pK MeCab morphology model. | Keep raw-port parity, normative surface comparison, IPA adjudication and Ukrainian target evaluation as distinct metrics. Test the supported paths separately and publish cross-runtime differences. No blanket Python/browser parity claim without a defined comparable subset and measured results. |

## Reviewer protocol for the 20-case IPA queue

Use the existing `research/ipa-adjudication-queue.json`; do not create a parallel gold corpus.

1. Freeze and hash the queue revision and review instructions before adjudication.
2. Give each reviewer the Korean written form, source-backed Korean surface comparator, relevant context, and the project's declared broad-IPA convention. Hide the other reviewer's IPA and all generated candidate IPA.
3. Each reviewer records qualification, date, exact reference/convention, IPA, syllable boundaries, vowel-length decision, and notes. A blank field means not reviewed; it is never an implicit agreement.
4. Compare results only after both submissions are complete. Preserve both originals. Any disagreement is marked unresolved until a documented reconciliation records the rationale and adjudicator.
5. Do not treat NIKL bracket notation such as `넉씨` as IPA. It supports a Korean surface-form claim only.
6. Once IPA is adjudicated, route the same case to the separate Ukrainian-target review. IPA completion does not automatically close target review.
7. Report counts with denominators (e.g. 0/20 independently double-reviewed); never report an accuracy score without a defined, independently adjudicated test set and scoring protocol.

## Rule coverage completion protocol

- Use the official NIKL *표준 발음법* article hierarchy as the source inventory. Preserve exact article/subparagraph identifiers and quotations only to the extent permitted by the source's terms.
- Link each atomic condition to the current canonical rule registry, data files, runtime implementation, and tests. Record ordering dependencies explicitly.
- Include negative controls that demonstrate when a superficially similar form must not trigger the rule; include interactions where two or more rules apply.
- Distinguish rule existence, exact-example coverage, productive-environment coverage, lexical/morphological licensing, and independent normative review. These are separate statuses.
- When source text is unavailable, mark the specific atom `blocked_source` and state which acceptance claim it prevents. Do not fill gaps from memory or from a third-party engine's output.

## KOGL/source-rights review protocol

- Review the exact source item and its displayed rights marking, not merely a general website policy.
- Record source ID, exact URL/record identifier, retrieved-on date, rights label and link, attribution requirement, redistribution/derivative restrictions, the actual artifact retained (if any), SHA-256, reviewer, decision and rationale.
- Distinguish source citation, metadata, short factual pronunciation notation, full page text, downloaded PDF, and adapted dataset. Permissions may differ by artifact and use.
- Where status remains unknown, retain only the minimum reference metadata necessary for audit, do not redistribute copied content, and mark the record blocked pending rights review. This register is not legal advice and cannot make the owner's licensing decision for them.

## Current release decision

**Research preview / partial prototype. Not accepted as a scientifically validated release.**

Reason: independent IPA adjudication is 0/20; Ukrainian target evaluation remains independent-review blocked; although all 30 numbered articles have finite-example evidence mapping (29 verified and Article 1 not-applicable), exhaustive atomic subparagraph/exception/productive-environment coverage is not demonstrated; item-level KOGL rights remain unresolved; live source access is blocked for some pages; and the corrected Pages smoke assertion still needs post-merge public verification.

This status can change only when the corresponding evidence is added and verified. Do not close a gate solely by changing prose or checking a box.


## Deployment smoke diagnosis — 2026-10-23 follow-up

The failed Pages run was inspected at job `120599746894` in [workflow run 40007564481](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007564481). The actual Pages deployment step reported success. The following smoke step failed because it searched for the obsolete UI sentence “Практичний режим точно відтворює вихід JavaScript-порту g2pK без словникових виправлень”, which contradicted the current UI and current exact NIKL-backed corrections. Python 3.11/3.12/3.13, browser tests/build, artifact upload, and Pages deploy all succeeded in that run; the stale text assertion caused the job-level failure before the later Playwright smoke could run.

The branch now updates the assertion to check the current UI contract: “лише кілька точних виправлень корейської поверхневої форми, прямо підтверджених NIKL”. This is a narrow smoke-test repair, not evidence that the new assertion has passed against the live deployment yet. Exact-head PR CI is pending; the Pages workflow itself triggers on pushes to main or manual dispatch, so live deployment smoke will run after an accepted merge or manual dispatch.


## Current implementation reconciliation — 2026-10-23

Since the historical baseline above, the native mainline merged:
- PR #261, empty Korean input rejection: `1860616a15a664ef189ffdaff50fe559aa1339a5`.
- PR #262, explicit source fortis feature and source-feature provenance: `17440e995cd38a2e57b5d203dfb0bd072b1fdbb5`.
- PR #264, direct IPA adapter empty-input rejection: `5bb9178243604d169c2209671a953f8683b48408`.

The direct adapter now rejects non-string IPA before target-adapter initialization and rejects empty tokenization results. The source feature boundary explicitly retains Korean fortisness separately from aspiration, without inventing a Ukrainian target ranking weight. PR #263 was closed as superseded after its code/test change was ported into #264; its branch was not deleted.

PR #266 ports the verified stale Pages smoke assertion repair from PR #265 and reconciles current handoff status. The corrected assertion has not yet been proven against a fresh post-merge deployment at the time of this report update; inspect the triggered Pages workflow and public smoke before claiming deployment readiness.

Scientific blockers remain unchanged: 0/20 independent IPA reviewer submissions, independent Ukrainian target review, atomic normative-rule coverage, item-level KOGL evidence, and authorized live NIKL source access. Readiness remains research preview / partial prototype.

## Current-main reconciliation after PR #266 — 2026-10-23

Current main is `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e`. This supersedes the older source/count snapshot above for current repository state.

- **Rule coverage correction:** `tests/fixtures/standard-pronunciation-rule-coverage.json` maps articles 1–30, with 29 `verified` finite-example statuses and Article 1 `not-applicable`. Its CI gate checks evidence-index integrity, not every productive environment. Do not report article coverage as absent; do not report it as exhaustive.
- **Source register correction:** current `research/SOURCE-REGISTER.csv` has 100 data rows. Exact item-level KOGL marking remains unresolved for multiple NIKL records.
- **IPA:** 20 cases, 0/20 independent submissions in each reviewer slot; no final IPA gold.
- **Pages:** PR #266 merged the corrected smoke assertion. Public HTTP and Playwright verification on the resulting deployed artifact remains required.
- **NIKL source intake:** live inventory job skipped/blocked; no pass is claimed.
- **Additional safeguard:** a Node regression test is being added to catch drift between the workflow's grep assertion and the source HTML before deployment. Its status is pending exact-head CI.

Scientific release disposition remains blocked; deployed research preview / partial prototype only.

## Deployment acceptance update — 2026-10-23

The corrected Pages workflow is now verified on main commit `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e`: [run 40009408019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40009408019) passed Python 3.11/3.12/3.13, browser tests/build, the public HTTP smoke, and the live Playwright practical-mode interaction. Therefore SR-06 is `DONE_VERIFIED` for that deployed commit. The additional source-HTML regression test in the current follow-up branch still needs exact-head CI. The live NIKL inventory remained skipped/blocked, not passed.

## Current main and rights-audit tooling — 2026-10-23

This update supersedes any older statement that Pages smoke is still pending. Main is `b795575c0d8b122123561c682e510ed5c171b5cc`; [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40010110513), [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40010110375), [corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40010110416), and [Pages deployment with public HTTP + live Playwright smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40010110447) all passed on that exact commit.

A follow-up branch `research/source-rights-ledger-validator-2026-10-23` adds a read-only CSV structure audit and conservative, ephemeral item-level rights-review queue. It deliberately does not access source sites, infer permissions from general policy, modify the register, or claim legal clearance. The command `npm run audit:source-register` summarizes the current 100-row register; `npm run audit:source-register -- --require-reviewed-rights` is an intentional strict gate that exits non-zero while any item-level rights classification remains open. Exact-head CI is required before this tooling can be accepted.

The live NIKL inventory remains `BLOCKED` when the official endpoint denies the request; no bypass is attempted. IPA remains 0/20 independent submissions in both reviewer slots, and Ukrainian target review remains separate. Release disposition is still research preview / partial prototype, not scientifically validated.

### Source-register audit baseline

The current 100-row register classifies as: `REVIEW_REQUIRED=96`, `MANUAL_CLASSIFICATION_REQUIRED=2`, `ITEM_LEVEL_LICENSE_RECORDED=1`, `NOT_APPLICABLE_RECORDED=1`. These are conservative triage labels produced from the existing free-text `license_status` column, not legal conclusions. Even the single explicit license-recorded row still requires a human check that the license covers the exact retained artifact and obligations. The strict gate is expected to remain blocked.

## Independent IPA reviewer packet tooling — 2026-10-23

PR #270 has merged as `1f91d0c3817153d8a07004778ed916fda39d4ec5`. Exact-main tests, system verification, browser G2P integration, and corpus artifact workflows passed; [Pages run 40012122568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40012122568) also passed deployment, public HTTP smoke, and live Playwright practical-mode smoke.

A follow-up branch `research/blinded-ipa-review-packets-2026-10-23` adds `scripts/build-ipa-review-packet.mjs` and `npm run ipa:review-packet -- --reviewer A|B`. It projects the canonical 20-case queue into a reproducibly hashed, blinded packet containing only Korean input, source-backed surface evidence, and blank IPA-review fields. It deliberately omits candidate IPA, both reviewer records, reconciliation, Ukrainian target review, and source-note fields that could expose hidden review data. Regression tests inject secret sentinel values into those forbidden fields and assert that no value leaks into either packet.

This enables a clean handoff but does not complete adjudication: the queue remains 0/20 independent IPA submissions for reviewer A and 0/20 for reviewer B. The packet's source comparator is Hangul notation, not IPA; the reviewer protocol states this explicitly. Exact-head CI is required before merging the tooling.
