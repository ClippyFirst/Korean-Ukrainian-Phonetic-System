# R002/R003 source adjudication: 14-form triage register (2026-10-24)

## Status

**PARTIAL — the 14-form triage set is registered and structurally guarded; exact-form source adjudication and independent IPA review remain open.** This change does not claim that any of the 14 forms has been linguistically adjudicated, and it does not add or alter production pronunciation rules.

The register is `research/r002-r003-source-adjudication-2026-10-24.json`. Its companion test, `tests/r002-r003-source-adjudication-queue.test.mjs`, requires 14 distinct inputs (7 R002 and 7 R003), preserves the exact benchmark row and morphophonological span, and prevents the diagnostic corpus reference or a competing engine output from being represented as normative IPA gold.

## Provenance and scope

- Benchmark workflow run: [40092929978](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978)
- Artifact: [12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692)
- Artifact commit: `94c21ea957c28225caea27b9df69aa8772fea6f7`
- Primary rule reference: [NIKL Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002)
- Existing error analysis: [KOREAN-ERROR-ANALYSIS-2026-10-24.md](KOREAN-ERROR-ANALYSIS-2026-10-24.md)

The 14 items were selected from the pinned diagnostic artifact's native abstention ledger: seven R002 cases and seven R003 cases. The artifact's IPA reference is noisy user-generated data, not a NIKL gold set. The rule-family URL gives the relevant normative framework but does **not** prove that each exact lexical form, segmentation, or morphophonological environment is licensed. Every item therefore remains `PENDING_EXACT_FORM_SOURCE`.

## Case register

| Case IDs | Forms | Why queued | Current gate |
|---|---|---|---|
| R002-01–07 | 되었어, 찢었으면, 했었음, 붙어야, 멋있어, 칡칡이, 이런삶은 | R002 native abstentions; some corpus references agree with g2pk, others do not; compact or lexical cases need segmentation review | Exact-form source + morphology + independent IPA |
| R003-01–07 | 수많은, 괜찮아보이는디, 많을거같이, 싫어서, 쌓아서, 좋아보인다고, 좋은데 | R003 native abstentions; includes compact colloquial strings and contexts where morphology/spacing is not independently established | Exact-form source + morphology + independent IPA |

The case-level register preserves diagnostic references and engine outputs solely to help reviewers locate the disagreements. These values are not accepted IPA gold. No candidate IPA is filled into the adjudication fields, no Ukrainian target is certified, and no production heuristic is licensed by this register.

## Required adjudication procedure

1. **Exact-form source review:** open the official NIKL rule text and relevant official Q&A/dictionary entry. Record the exact passage or answer, source locator, date, and whether the exact word and grammatical environment are directly attested or merely derived from a general rule.
2. **Morphological review:** record segmentation and the grammatical status of the following element. If a compact string such as `괜찮아보이는디`, `많을거같이`, `좋아보인다고`, or `이런삶은` cannot be safely segmented from the available evidence, keep it unresolved rather than inferring boundaries from adjacency.
3. **Independent broad IPA:** two qualified reviewers independently transcribe from the verified Korean form without seeing one another's IPA first. Record the transcription convention, syllable boundaries, relevant length/fortis/aspiration distinctions, qualifications, date, and method references.
4. **Reconciliation:** preserve disagreements until an evidence-backed reconciliation is documented. A rule citation alone, majority engine agreement, or match to noisy corpus IPA is not enough.
5. **Holdout freeze:** only source-verified, independently adjudicated items may be promoted to a normative holdout. Freeze the split and manifest before any rule changes are evaluated. Do not tune on the holdout.
6. **Separate target review:** evaluate Ukrainian rendering only after the Korean IPA input is frozen; report that result separately.

## Task ledger

| Task | Status | Acceptance criterion |
|---|---|---|
| Identify and register 14 distinct R002/R003 cases | DONE_VERIFIED as triage bookkeeping | 14 unique case IDs/inputs; 7 per rule; benchmark provenance retained |
| Keep noisy corpus and engine outputs out of normative gold | DONE_VERIFIED as schema/test guard | Automated test requires exact-form source and independent review fields to remain empty until reviewed |
| Verify exact NIKL source for all 14 forms | TODO | Each form has an exact official locator and excerpt; direct evidence is distinguished from rule-derived inference |
| Resolve morphological segmentation and rule applicability | TODO / BLOCKED where input context is insufficient | Each case has a reviewed parse and explicit licensed environment, or remains unresolved |
| Independent broad-IPA review | TODO / BLOCKED pending qualified reviewers | Two independent reviews, explicit convention, boundaries and reconciliation record |
| Frozen NIKL holdout and post-fix measurement | TODO | Held-out manifest frozen before development; score only adjudicated IPA and report coverage/abstention separately |
| Korean IPA → Ukrainian evaluation | BLOCKED | Separate independently reviewed Ukrainian target gold set and blinded evaluation protocol |

## Verification caveat

The repository's configured test workflow runs `npm test`, Python tests, and `npm run build`. This branch adds a test to that suite, but a passing result must not be claimed until the PR's exact-head CI has completed successfully. The register itself is not a benchmark score and does not change runtime behavior.
