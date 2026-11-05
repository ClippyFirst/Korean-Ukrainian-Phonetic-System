## 2026-11-05 — 236-candidate occurrence review and evidence correction

**Starting main:** `043754498f3ad8a17aa6c13b5f643b197536da8a`. **Working branch / draft PR:** `research/236-candidate-review-2026-11-05`, [PR #436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/436). The branch is research-only; no runtime pronunciation or Ukrainian-target behavior is intentionally changed.

- **DONE_VERIFIED as a derived inventory:** 239 replayed IDs join 239/239 to the pinned 370-row context superset; removing the three already-implemented FIX overlaps (37, 704, 2031) yields 236 unique candidate occurrences. The reproducible generator, CSV and regression are included in PR #436.
- **PARTIAL / EVIDENCE-LIMITED:** 213 occurrences have no individual disposition in the existing narrow registers; 22 overlap existing ABSTAIN records; one (1140, 출산) is provisional RETAIN. None of these 236 is independently IPA-adjudicated by this inventory. The original historical 239 selector/member list is still not proven.
- **Case-family triage:** 236 rows contain 254 Broad edit operations across 24 signatures; 184 are lenis ɕ→s and 24 are fortis ɕ͈→s͈. C11's optional [ɕ] candidate is lenis-only; fortis mismatches require a separate stratum. The inherited C04 tag on 206 rows is stale; current C04 has zero residual occurrences after C12 reclassification.
- **Source metadata correction:** Cambridge's primary record identifies S018 as Hyun Bok Lee (1993), JIPA 23(1), pp. 28–31. The prior 1999 / Sohn 2008 metadata was corrected in PR #436. This corrects bibliography only; it does not adjudicate any corpus token.
- **BLOCKED:** two independent Korean IPA reviews, token-to-source/audio/speaker/dialect/prosody crosswalk, and separately reviewed Ukrainian target remain necessary. Broad-v2/IPA-Dict strings are comparator annotations, not normative IPA gold.
- **CI:** an early PR head passed the full test matrix; an intermediate head exposed three documentation/test contract failures. The metadata and field-name fixes were committed; latest exact-head checks are pending. Do not mark this batch fully verified until they finish.

**Acceptance:** the 236-row inventory is complete only as a reproducible review queue. Linguistic closure requires a traceable per-occurrence or defensibly grouped decision, source/reviewer provenance, explicit variant/profile convention, and negative controls. Unsupported rows remain abstentions. The repository remains a partial research prototype, not release-ready.

---

