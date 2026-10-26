# One-pass continuation — source-backed Korean abstention recovery — 2026-10-25

- **Branch:** fix/source-backed-r003-exact-forms-2026-10-25; based on main commit 4a3f39b1df682dac0254db917d867405deee71fb.
- **Verified code/test head:** 66532e78eb75042e6b958c5e5bf313adf7e0f244. The final documentation/source-register follow-up is a separate commit and does not change runtime logic.
- **Implementation:** 19 new exact-form R002 formal-liaison licenses, nine new R003 ㅎ-deletion licenses, and one R004 complex-coda + ㅎ-suffix license; mirrored across Python and browser strict engines. Added regression tests for positive forms and negative controls.
- **Source evidence:** registered NIKL FAQ 8391 for 없음[업씀], reconciled Q&A 326978 (있- + -었-) and Q&A 306166 (two accepted 멋있어 variants), and registered Korean Basic Dictionary entry 긁히다 / 긁혀[글켜] for the R004 environment. Direct Hangul evidence is not IPA or Ukrainian-target gold.
- **Verification passed:** Python regression/data integrity and browser regression/build in Verify run [40216156212](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40216156212); full test matrix including Python 3.11, 3.12, 3.13, wheel install and web tests in [40216156229](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40216156229); multi-engine benchmark [40216156253](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40216156253); external UGTPHON diagnostic [40216156302](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40216156302).
- **Measured result:** 2,688/2,703 scored, 1,425 exact, CER 9.1757%, 99.4451% coverage, 15 unresolved occurrences, zero engine errors. Relative to the previous three-form baseline: 30 fewer abstentions, 13 more exact matches, CER improves by 0.0253 percentage points. Confidence intervals overlap; do not claim a robust accuracy gain.
- **Remaining unresolved:** 좃같아서, 괜찮아보이는디, 많을거같이, 많이본, 없을듯, 칡칡이, 못잃어, 알잖아아침에, 쫒아내면, 많앗구나유유유, 삶의, 개같이못하고, 좋아보인다고, 무서웟어, 좋아해주는. They remain fail-closed due compact phrase boundaries, likely spelling errors, uncertain lexical morphology, or independent IPA adjudication.
- **Status:** PARTIAL, not release-ready. Korean surface coverage is materially better; independent broad-IPA gold, Ukrainian target gold, and remaining source/morphology adjudication are still outstanding.

## Continuation record — train/train IPA conflict adjudication tooling (2026-10-26)

### Task ledger

- **DONE_VERIFIED (existing):** pinned SIGMORPHON/UGTPHON corpus builders, provenance-aware train/dev preparation, cross-corpus conflict queue, typed annotation packetizer, literal Unicode inventory, and conflict-pattern diagnostics. The queue's 366 conflicts remain research candidates, not errors or gold labels.
- **DONE_VERIFIED (new implementation; exact-head CI pending):** `scripts/validate_korean_ipa_adjudications.py` validates an independently supplied human decision document against the exact queue IDs, source forms, and source pins, then emits a separate provenance-linked ledger. It requires two explicit reviewer records per submitted case, controlled decision values, rationale, and evidence references for non-UNRESOLVED decisions. A final adjudication additionally requires a named adjudicator and rationale.
- **DONE_VERIFIED (tests added; exact-head CI pending):** `tests/test_validate_korean_ipa_adjudications.py` covers unresolved reviews, missing evidence, pin mismatch, unknown/duplicate queue IDs, altered source forms, missing adjudicator metadata, and partial-review reporting.
- **BLOCKED:** actual human adjudication of the 366 source conflicts. No reviewer decisions are fabricated or prefilled.
- **BLOCKED:** complete source-specific IPA adapter. UGTPHON does not pin the exact IPA-Dict snapshot used for labels; no mapping from symbols such as `ɦ/h`, `ɭ/l`, `ɕʰ/s`, `ç`, or length marks is justified yet.
- **BLOCKED:** production Strict rule changes from this corpus work. A corpus-label discrepancy alone is not normative pronunciation evidence.
- **DEFERRED:** third-party neural model runtime integration; model/data licensing, training overlap, output convention and resource gates remain unmet.

### New validator contract

CLI:
```bash
python scripts/validate_korean_ipa_adjudications.py \
  --queue-json path/to/korean-ipa-conflict-queue.json \
  --decisions-json path/to/human-decisions.json \
  --output-json path/to/validated-adjudication-ledger.json
```

The decisions input must declare `schema_version: "1.0"`, copy the queue's exact `source_pins`, and contain a `decisions` array. Each record is keyed by `queue_id` and exact `source_text`, with `reviewer_1` and `reviewer_2` records. Each reviewer supplies a controlled `decision`, non-empty `rationale`, and (except for `UNRESOLVED`) an `evidence_reference`. A final decision is optional and requires both `adjudicator` and `final_rationale`. Partial submissions are permitted and explicitly list unreviewed queue IDs. The source queue is never modified; the output explicitly asserts that no mapping or production rule was applied.

### Exact-head verification record

- Starting research head before this batch: `f8bf0c3490378723e6c275e56867ae6c0553be40`; default branch remains `main`.
- Implementation commits: validator `0c814d79195bb319a63baf8e4be11642da91c8a6`; focused tests `a252885881b24ec8769a2499e5e512dd80cc4c1d`; handoff update follows.
- Repository clone/local test execution was attempted but blocked in this environment because DNS/network access to `github.com` failed. Therefore no local test result is claimed. GitHub Actions exact-head runs must verify the validator/test integration before treating the new tooling as fully verified.
- Latest previously recorded exact-head workflows (before this batch): tests [40315132582](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40315132582), system verification [40315132650](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40315132650), corpus audit [40315132568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40315132568), scratch teacher/pairing [40315132667](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40315132667), and master artifacts [40315132603](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40315132603). These runs do **not** verify the new validator commits.
- **Current assessment:** research-ready infrastructure / partial prototype; not release-ready. The next acceptance gate is exact-head CI for this validator, followed by real independently authored reviewer decisions and a separately reviewed source-convention adapter. No production runtime behavior was changed by this batch.
