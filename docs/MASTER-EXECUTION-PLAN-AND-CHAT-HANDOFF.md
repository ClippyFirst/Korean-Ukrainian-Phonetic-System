# Continuation — Kozak Kim discrepancy review packetization and C08 source triage — 2026-11-01

**Continuation branch:** `research/kozak-kim-independent-ipa-packets-2026-11-01`  
**Default-branch base:** `7bbbd7e7ce888a9c995bb70959e17858263c07a8`  
**Inherited implementation head:** `2712b2c53dbb771c0febe828ce926e24d92aacbd` (PR #416 descendant of current main).  
**Scope:** Kozak Kim only; original g2pK remains untouched and comparison-only.

## Current continuation ledger

| Task | Status | Evidence / acceptance |
|---|---|---|
| Reconcile current main and PR #415/#416 | DONE_VERIFIED (inspection) | main `7bbbd7e`; #415 head `0b4b126`; #416 head `2712b2c`; main...#416 = 192 ahead / 0 behind. Dedicated continuation branch created from main and fast-forwarded to #416 descendant. |
| Preserve IPA-first and source-backed implementation | DONE_VERIFIED (inherited) | PR #416 exact-head system run `41344976774` PASS; browser G2P integration `41344981229` PASS; paired native/g2pK `41344981425` PASS; UGTPHON `41344981311` PASS; morphology diagnostics `41344981284` and `41344981338` PASS. |
| C01–C07 blind review packetization | PARTIAL | Seven separate pilot JSON packets and index created. They contain token/source-row identifiers only; no engine output, reference IPA, or ranking. Not ready for scoring because source utterance context and reviewer-sharing rights are missing. |
| C08 lexical/morphological evidence | PARTIAL / EVIDENCE-LIMITED | NIKL Q&A 312649 confirms 의외성 only; 유사성 appears in the question but is not confirmed by the answer. §27 is conditional on exact morphology; no exact segmentation evidence for 했을시 or 무고일수도있다는. No production change justified. |
| Remaining C08 cases | TODO / BLOCKED ON CONTEXT | Restore exact utterances, spacing/morpheme analysis, exact-form source evidence, and near-minimal negative controls. |
| Original g2pK integrity | DONE_VERIFIED (scope control) | No original/vendor g2pK implementation file changed in this continuation. |
| Independent IPA adjudication | BLOCKED | No reviewer submissions; packet manifests lack full context and rights review. |

## C01–C07 packet details

- Files: `research/ipa-review-packets/kozak-kim-C01.json` through `kozak-kim-C07.json`.
- Index/protocol: `research/ipa-review-packets/README-KOZAK-KIM-C01-C07.md`.
- Blinding: no engine IPA, gold IPA, engine identity, ranking, or rule hypothesis.
- Evidence limit: artifact `13097847614` has token-level rows, not source utterance text. Restore licensed context and verify sharing rights before dispatch.
- Freeze packet hashes and independent first-pass submissions before reconciliation.

## C08 source triage

- NIKL Q&A [312649](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=312649) asks about 의외성 and mentions 다양성[-썽], 유사성[-썽] in the question. The official answer cites only Urimalsaem's 의외성 [의ː외썽/의ː웨썽]. This does not establish 유사성.
- NIKL Standard Pronunciation Rule §27 confirms fortition after the adnominal -(으)ㄹ ending, but not the morphology/spacing of an unspaced corpus string. For 했을시, apply the rule only if the original context confirms 했을 시 = -(으)ㄹ + noun 시.
- 무고일수도있다는 remains unsegmented; no exact source-backed trigger established.
- Decision: no new C08 rule, no generalized -성 rule, and no guessed spacing/morphology.

## CI reconciliation

- Current main workflow `41334227038`: browser regression/build PASS; Python regression/data-integrity FAIL at collection because `tests/test_ugtphon_surface_benchmark.py` imports `scripts.benchmark_ugtphon_ko_surface`, absent from main. Exact error: `ModuleNotFoundError: No module named 'scripts.benchmark_ugtphon_ko_surface'`.
- PR #416 push run `41344976774`: browser regression/build PASS; Python regression/data-integrity PASS; NIKL metadata-only inventory SKIPPED.
- PR #416 pull-request runs: `41344981229` browser integration PASS; `41344981425` paired native/g2pK PASS; `41344981248` system PASS; `41344981271` register extraction PASS; `41344981311` UGTPHON PASS; `41344981284` morphology consensus PASS; `41344981338` morphology adapter PASS. Multi-engine run `41344981358` was IN_PROGRESS when inspected.
- No local shell, npm, pytest, or build command was executed in this connector-only session; test statuses above are GitHub Actions evidence.

## Remaining acceptance gates

1. Restore licensed source utterances and item-level sharing rights for C01–C07.
2. Expand pilot samples only from exact cluster membership; repeated tokens are not independent evidence.
3. Obtain two independent blind Korean IPA submissions; freeze first-pass results before engine/reference reveal.
4. Resolve each C08 segmentation/source claim before code changes; add positive, negative, boundary, and interaction controls.
5. Re-run exact-head browser, Python, generated-data, build, and paired benchmark checks after any engine change.
6. Keep g2pK unchanged and report both wins and regressions.

**Readiness:** research prototype. This continuation improves review readiness and traceability; it does not certify IPA accuracy or release readiness.

---

