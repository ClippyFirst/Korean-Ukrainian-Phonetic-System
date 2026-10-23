# Scientific release blockers — execution register (2026-10-23)

## Scope and evidence boundary

This continuation executes against the existing master plan, acceptance gates, IPA queue, rule-coverage register, and source register. It does not replace those sources of truth or declare any linguistic claim verified merely because a test or checklist exists.

Baseline inspected: `main` at `17440e995cd38a2e57b5d203dfb0bd072b1fdbb5` (2026-10-23). Repository tree was fetched recursively; one open PR was found (#263, native IPA empty-input boundary). Recent mainline CI showed the verification workflow and tests passing at the baseline SHA; the Pages deployment workflow for that SHA showed failure. A separate verification run was still in progress at inspection time. These are live snapshots, not a claim about the eventual run outcome.

## Task ledger

| ID | Status | Evidence observed | Acceptance criterion / next action |
|---|---|---|---|
| SR-01 | PARTIAL | `research/ipa-adjudication-queue.json` has 20 cases (IPA-001–IPA-020); 0/20 reviewer-A IPA fields populated, 0/20 reviewer-B IPA fields populated; all reconciliation statuses are `BLOCKED_SPECIALIST_ADJUDICATION`. | Recruit two qualified Korean phonetics reviewers. They independently transcribe broad IPA before seeing each other's work; record method/reference, boundaries, length and relevant contrasts; reconcile disagreements transparently. No author-generated guess may be relabelled independent gold. |
| SR-02 | BLOCKED_SPECIALIST_REVIEW | Existing target-layer consistency tests are mechanical and `research/RULE-COVERAGE.csv` explicitly calls the target policy linguistically provisional. | Two independent Ukrainian phonetics/orthography reviewers assess IPA → target correspondences, exceptions and ambiguity. Keep target review separate from Korean-surface and IPA review; document disagreement and reader comprehension evidence before claiming validated practical orthography. |
| SR-03 | PARTIAL | `research/RULE-COVERAGE.csv` contains R001–R016 plus IPA-UKR-MAPPING (19 data rows plus header). It records partial scope and remaining gaps; this is not proof that every subparagraph, exception and variant in NIKL §§9–30 is covered. | Build a source-derived atomic inventory: article → paragraph/subparagraph → condition → exception/variant → source example → implementation location → positive, negative and interaction tests. Each atomic row must be `covered`, `not_applicable_with_reason`, `blocked_source`, or `gap`; reviewers inspect the mapping against the official text. Do not infer completeness from article-level status or fixture count. |
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

Reason: independent IPA adjudication is 0/20; Ukrainian target evaluation remains independent-review blocked; full atomic coverage of NIKL §§9–30 is not demonstrated; item-level KOGL rights remain unresolved; live source access is blocked for some pages; and deployment for the inspected mainline SHA reported failure pending log inspection.

This status can change only when the corresponding evidence is added and verified. Do not close a gate solely by changing prose or checking a box.
