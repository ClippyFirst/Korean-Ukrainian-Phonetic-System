# Latest mismatch-fragment triage — 2026-11-02

This report remains about **Kozak Kim only**. Original g2pK 0.9.4 is an untouched comparison baseline. Full execution/CI/paired-metric handoff is maintained in [MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md](../docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md).

## Final multi-engine results — 2026-11-03

Exact-head workflow [41535300358](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41535300358) completed successfully on branch head 06b0a9180295f729f9ba9580cd59c3097b02d745; artifact [13184368365](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41535300358/artifacts/13184368365).

- Native/Browser parity: 2,703/2,703 eligible surface occurrences identical; 2,698/2,698 scored raw IPA strings identical; both runtimes abstained on the same five. This is implementation parity, not IPA gold validation.
- UGTPHON (2,698 paired): Kozak Native exact 53.0393%, CER 9.0613%; untouched g2pK 0.9.4 exact 53.1134%, CER 9.2304%. Kozak CER is lower by 0.1691 pp; g2pK has two more exact matches. Paired row-cluster 95% CI for g2pK-minus-Kozak CER: [+0.0860,+0.2617] pp; exact-rate delta CI [−0.0824,+0.2840] pp crosses zero.
- SIGMORPHON 2021 (998 paired): Kozak exact 35.8717%, CER 14.6100%; g2pK exact 35.3707%, CER 14.8106%. Kozak has five more exact matches and 0.2006 pp lower CER. Paired row-cluster 95% CI for g2pK-minus-Kozak exact delta [−1.0020,−0.1002] pp and CER delta [+0.0372,+0.3989] pp.
- g2pK surface Hangul is rendered through the project's shared IPA adapter; it is not an independent IPA encoder. Both corpora carry annotation limitations; these scores are diagnostic, not normative gold and not Ukrainian target validation.
- Training-readiness audit: 644 lexical rows, 45 additions, 24 frozen holdout forms, zero explicitly independently adjudicated IPA addition rows, and no holdout IPA gold. Supervised IPA training remains not ready. Reviewer A/B packets were generated without engine outputs and await independent annotation.
- Main Verify [41535300205](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41535300205) PASS (621 Python, 1,389 Browser, data/source integrity, Vite build/generated pages); Browser G2P [41535300397](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41535300397), UGTPHON [41535300287](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41535300287), Native/g2pK [41535300645](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41535300645), morphology [41535300307](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41535300307), and test extraction [41535300790](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41535300790) all PASS.
- Charsiu train/dev queue, CharsiuG2P inference, ByT5 inference and neural pairing were SKIPPED; NIKL metadata inventory was SKIPPED. No result or license clearance is claimed for these.

Interpretation: the data now supports lower Kozak CER on both independent benchmark splits, and a SIGMORPHON exact-match advantage; UGTPHON exact match remains a tiny g2pK point advantage. This is meaningful comparative evidence, but it is not proof of universal superiority or normative correctness.

## Algorithm updates and cluster decisions

| Order | Cluster | Evidence / change | Status |
|---:|---|---|---|
| 1 | C11 /s/ → [ɕ] — 229 operations / 227 occurrences | Expanded optional Broad [ɕ] candidates to ㅕ/ㅛ/ㅠ within the S018 p.31 /j/-initial-diphthong environment. Canonical /s/ and fortis /s͈/ unchanged. Python and Browser now agree. | PARTIAL: two independent IPA reviewers still required |
| 2 | C05 ㅟ — 72 combined operations | Preserve [y] canonical; retain [wi] and [ɥi] alternatives. | PARTIAL: adjudication required |
| 3 | C12 `kx/kç → kʰ` — 45 operations / 37 occurrences / 29 unique token strings | No phonological rewrite. Ito (2007), `SRC-KCI-ITO-2007-MORPHEME-STRUCTURE`, remains abstract-only lexical-distribution context and does not establish an acoustic [kx]/[kç] realization. The 37 text/IPA rows comprise 16 `kxɯ`-only, 12 `kçi`-only, 8 `kçj`-only and one overlapping `kxɯ+kçi` record; 12 rows use the `multilexnorm2026` namespace and 25 `dc_inside`. Schweizer, Ahn & Kwon (2026), `SRC-JIPA-SCHWEIZER-AHN-KWON-2026-SEOUL-STOPS`, provides contextual primary acoustic evidence for release+aspiration burst duration, but Study 1 uses /a/ and Study 2 /i,u,a,ʌ/ (no /ɯ/ or /j/); it reports no [kx]/[kç] labels and cannot adjudicate these text/IPA records. The current fragment file has no linked audio/speaker metadata. | PARTIAL: general acoustic evidence added; exact [kx]/[kç] interpretation, source-audio/annotation crosswalk and independent item-level IPA review remain blocked. |
| 4 | C06 unreleased coda — 34 operations | Preserve [p̚,t̚,k̚]; do not strip because a corpus annotation omitted release diacritics. | DONE_VERIFIED |
| 5 | C01/C07 liquids — 12 operations | Seoul-scoped optional [ɭ] retained for same-word intervocalic /l/ and the cited front/glide environment. Require a same-word predecessor; word-initial `례` remains [ɾ], not a spurious [ɭ] candidate. | PARTIAL |
| 6 | C09 lexical length — 8 operations | Preserve source-attested length. NIKL §7 `알다[알ː다]`, §14 `없어[업ː써]`, and §18 `없는[엄ː는]` show that the UGTPHON gold omits length in some occurrences. | DONE_VERIFIED as a preservation decision |
| 7 | C02 /h/ variants | Add source-scoped [ɸ] for same-word intervocalic ㅎ; keep [ç]/[x]/[ɦ] context-specific. `아하` is intervocalic; word-initial `하` is the negative control. | PARTIAL |
| — | 239 unmapped mismatch occurrences | Keep unresolved until sentence, morphology and source context are reviewed; do not invent IPA or force new cluster labels. | TODO |

## Source-adjudicated Kozak/g2pK contrasts

Browser paired report, 2,698 shared scored occurrences:
- both exact: 1,438;
- Kozak-only exact: 4 (`닮다`, `못잃어`, `넘게`, `인기`);
- g2pK-only exact: 4, all repeated occurrences of `없는`;
- both wrong: 1,252.
- Kozak lower edit distance on 26 occurrences; g2pK on 6; equal on 2,666.

Interpret these counts against sources, not as an unqualified win/loss tally:
- `닮다` and `넘게` use the NIKL §24 stem-final ㅁ/ㄻ + ending fortition environment.
- `인기[인끼]` is an optional NIKL-attested Sino-Korean fortition variant; preserve the non-fortis alternative.
- `못잃어` has insertion and non-insertion variants in the NIKL usage survey; neither engine is declared uniquely correct.
- All four g2pK-only exact `없는` rows omit the long vowel in the UGTPHON gold, while NIKL §18 gives `없는[엄ː는]`. This is an annotation limitation, not evidence that Kozak's long vowel is wrong.
- NIKL also gives `알다[알ː다]` and `없어[업ː써]`; Kozak retains the source-attested length.
- `사건[사ː껀]` (NIKL Q&A 313244) and `한자[한ː짜]` (NIKL Basic Korean Dictionary) are additional lower-error examples.

Native paired metrics: 2,698 shared occurrences; Kozak exact 53.0393% vs g2pK 53.1134%; Kozak CER 9.0613% vs g2pK 9.2304%. Browser paired metrics: exact tie at 53.4470%; Browser CER 8.0685% vs g2pK 8.2072%, cluster-bootstrap CER delta 95% CI [−0.2303, −0.0584] pp. These are corpus-relative diagnostics, not normative IPA gold; do not combine the two runtimes or fabricate a corrected score.

## Historical exact-head verification snapshot (superseded by the 2026-11-03 final results above)

Current branch head `5c775dfa6b6a969c320f47c1420c75ffa645e369`:
- Python regression/data integrity: PASS, run 41532567453.
- Browser regression/build/generated pages: PASS, 1,389/1,389, run 41532567453.
- Browser G2P: PASS, run 41532567366.
- External UGTPHON + paired Browser/g2pK: PASS, run 41532567276.
- Paired Native/g2pK: PASS, run 41532567384.
- Morphology consensus: PASS, run 41532567281.
- Test-case register extraction: PASS, run 41532567279.
- Ten-engine UGTPHON/SIGMORPHON and Native/Browser parity: IN_PROGRESS, run 41532567426.
- NIKL metadata inventory, Charsiu train/dev review queue, CharsiuG2P and ByT5 inference: SKIPPED; no results claimed.

The failed Python run 41530749317 was diagnosed and corrected: missing Python Broad [ɕ] contexts, word-initial [ɭ] overreach, stale v4 assertions, and an invalid [ɸ] negative control. Fresh exact-head Python and Browser verification now passes.

## Acceptance gates

1. Read the final ten-engine and Native/Browser parity artifacts from run 41532567426.
2. Keep C12 blocked until exact-environment primary evidence and independent IPA review exist.
3. Resolve the 239 unmapped occurrences by source/context adjudication.
4. Obtain two independent Korean IPA reviews.
5. Complete item-level NIKL reuse-rights review and independent Ukrainian target review.

No g2pK source/vendor file was modified. No merge or release was performed.

---

# Kozak Kim — occurrence-level mismatch fragment triage (2026-11-02)

## Scope and evidence

This report triages Kozak Kim only. Original g2pK 0.9.4 source and vendor files remain unchanged and comparison-only.

- Benchmark run: [41453407662](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41453407662)
- Artifact: [13148075070](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41453407662/artifacts/13148075070)
- Exact code head: `e7933ae4a67c94f0f69b4747d8e388aa082fc347`
- UGTPHON revision: `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`
- Multi-engine report SHA-256: `8c25e630ca828719b269aeb84c8037d9c40f881a0f15c2e4ddf9d427edffa0f9`
- Browser report SHA-256: `4ea71829c57a0295e9a599bd1d973a3ab90a0cc5ad37689f8fc64b5fca3bf4d1`

The Native ledger has 2,703 eligible occurrences, 2,698 scored and five abstained. Strict IPA has 1,267 non-exact scored occurrences. The research-only Broad sensitivity profile has 370 non-exact occurrences (2,328/2,698 exact; 86.2861%; CER 2.2038%). Strict and Broad counts are separate views of the same predictions, not independent error totals.

## Highest-frequency Broad mismatch fragments

These are grapheme-cluster edit operations from the artifact's selected Broad reference and prediction. Counts below are edit operations; occurrence counts are noted where useful. They are diagnostic fragments, not confirmed phoneme errors.

| Candidate cluster | Fragment difference | Operations | Triage interpretation | Engine decision |
|---|---:|---:|---|---|
| C11 — sibilant place/profile boundary | `ɕ → s` | 229 (227 occurrences) | UGTPHON often records [ɕ], while Kozak Kim's broad profile intentionally preserves /s/ vs /ɕ/. This is the largest residual cluster. | Do not collapse /s/ and /ɕ/. Require an explicit broad-profile policy and independent IPA review. |
| C12 — aspirated velar coarticulation profile | `kx/kç → kʰ` | 45 operations across 37 occurrences | Examples include `크게`, `솔직히`, `도쿄로`, `스크롤`. This is not a simple h/ʰ mismatch: the source transcribes a velar closure plus fricated/coarticulated release, while Kozak Kim emits one aspirated velar stop. The broad normalizer's x/ç→h mapping does not make these sequences equivalent. | No rewrite until an authoritative source and a profile policy justify the allophone or its optional representation. |
| C05 — front-rounded vowel/glide | `i → y`, `ɥ → ∅` | 72 combined | E.g. `분위기`: reference `punɥiɡi`, prediction `punyɡi`; `귀엽냐`: `kɥijʌmnja` vs `kyjʌmnja`. | Preserve alternate analyses pending source and token-level IPA adjudication. |
| C06 — unreleased coda detail | `∅ → ̚` | 34 (34 occurrences) | E.g. `없어도`, `목숨`, `없음`. Broad-vs-narrow release marking may explain this. | Keep release detail profile-scoped; do not strip from canonical output solely to fit this corpus. |
| C01/C07 — liquid realization | `ɾ → l` | 12 (12 occurrences) | E.g. `말한`: reference `maɾhan`, prediction `malhan`; boundary and onset/coda analysis need inspection. | Candidate for deeper rule/context audit; no global substitution. |
| C09 — lexical length | `∅ → ː` | 8 (8 occurrences) | Includes `알다`, `없는`, `한자`; lexical source evidence may override missing corpus length. | Preserve source-attested length; do not tune to noisy annotation omissions. |

There are 239 Broad-mismatch occurrences containing at least one fragment not mapped to the current C01–C10 candidate families. Those remain explicitly unmapped rather than being forced into a convenient category. Examples include fortis/plain onset, glide deletion, and consonant identity differences; they need sentence/morphology/source review before any engine edit.

## Concrete engine defects already fixed in the current PR chain

The preceding Browser/Native audit isolated a real implementation defect: after exact §12(4) ㅎ deletion, an empty coda entered generic liaison and erased a following vowel-initial syllable. The six surface regressions are now covered by the PR #422 change. Four unresolved-morphology surface mismatches were also aligned under the shared Broad profile without resolving the morphology or emitting IPA/Ukrainian output. The NIKL-attested length in 대한민국 was restored as a provisional IPA-first lexical overlay; the dictionary supplies Hangul length, not IPA.

These are implementation defects with reproducible expected surfaces. They are distinct from the remaining benchmark IPA annotation/profile differences above.

## Occurrence-level annotation format

`scripts/export_kozak_kim_mismatch_fragments.py` exports every Native occurrence with a non-zero strict or Broad report distance to a CSV. Each row carries:

- stable occurrence and source-row IDs;
- Hangul token and reconstructed surface;
- strict and Broad reference/prediction strings and distances;
- original g2pK comparison output;
- mismatch fragment pairs, separately for strict and Broad;
- candidate cluster labels;
- explicit `UNADJUDICATED_DIAGNOSTIC` and `NO_CHANGE_PENDING_SOURCE_AND_IPA_REVIEW` gates.

The aligner attaches combining diacritics and IPA modifier letters to their base segment before edit alignment. It is still a grapheme-string alignment, **not phoneme segmentation or phonetic adjudication**. The exported CSV must not be treated as a gold error list. Generate it from the pinned workflow artifact:

```bash
python scripts/export_kozak_kim_mismatch_fragments.py \
  --report-json multi-engine-ipa-report.json \
  --output-csv research/KOZAK-KIM-MISMATCH-FRAGMENTS-2026-11-02.csv
```

## Next implementation order

1. C11 sibilant place: inspect all 227 occurrences with sentence context, /i,j/ environment, word/morpheme boundary and source annotation. Keep the profile distinction until a documented project convention is approved.
2. C05 vowel/glide: separate phonemic /y/ from phonetic [ɥi] and test the exact syllabic environment; do not replace all /y/ with [ɥi] or vice versa.
3. C04 aspiration notation: decide whether the relevant source uses a modifier or a segment, then verify that the adapter preserves the intended contrast.
4. C06 release marking: verify broad/narrow scope and whether the source annotation is consistent.
5. C01/C07 liquids: inspect syllable boundaries and prosodic/morpheme context; only then consider a bounded rule.
6. Review all unmapped fragments and add new cluster IDs only when several cases share an evidenced cause.

For every proposed production change: add a failing regression first, establish the exact Korean rule environment from primary sources, add positive and negative controls, run Python and Browser suites, and compare before/after occurrence ledgers. Never modify the original g2pK baseline or promote UGTPHON/SIGMORPHON predictions to IPA gold.

## Algorithm updates — 2026-11-02 (evidence-scoped, profile-preserving)

The following changes address high-frequency clusters without forcing a corpus convention onto canonical broad IPA:

- **C11 sibilant place:** Broad canonical /s/ remains unchanged. The engine now exposes an optional [ɕ] allophone variant for lenis ㅅ before ㅣ, ㅑ, ㅒ, ㅖ; fortis ㅆ is deliberately excluded. The narrow profile continues to expose [ɕʰ] and now includes ㅒ. Evidence: Lee (1993, p.31) explicitly describes /s/ as alveolopalatal before /i/ or any diphthong beginning [j]. Kang (2010) finds distinct spectra for /yu, yo/ vs /ya, ye/; this warrants context-sensitive review but does not contradict the S018 broad description. This is an optional reading, not a forced broad rewrite.
- **C02 /h/ allophones:** The narrow research profile now outputs [ç] before selected high-front/glide nuclei and [x] before ㅜ; the shared Broad result also exposes these as optional variants while retaining canonical [h]. The narrow profile has since advanced to v5 with source-scoped [ɸ] and [ɭ] candidates. Evidence: Lee (1993), *Korean, Illustrations of the IPA*. This does not solve C12, which concerns aspirated velar /kʰ/ release/coarticulation, not underlying ㅎ.
- **C05 front-rounded ㅟ:** [ɥi] is now exposed as an additional broad IPA variant alongside existing canonical [y] and alternate [wi]. Evidence: the UCL acoustic/phonetic thesis review of Lee (1996) describes /wi/ as sometimes [ɥi], [ø] or [y]. The canonical remains [y]; the variant does not assert one speaker-independent pronunciation.
- **C02 /h/ allophones:** Narrow research IPA now represents [ç] before selected high-front/glide nuclei and [x] before ㅜ; the previously implemented optional post-sonorant [ɦ] retains priority. Broad and phonemic IPA are unchanged. The narrow profile was subsequently advanced to v5; see the v5 profile tests and current cluster register. Evidence: Lee (1993), Illustrations of the IPA, for Seoul Korean. This is profile-scoped, not a general ㅎ deletion rule.
- **C06 release marking and C09 lexical length:** No change. Existing [p̚,t̚,k̚] output and source-attested lexical length remain. UGTPHON omissions are not enough to justify stripping these features.
- **C01/C07 liquids:** No blanket ɾ/l/ɭ/ʎ replacement. The remaining examples include different positions and possible morphology/prosody; the corpus does not establish a single safe environment. Further context/source adjudication is required.

The optional variants are exposed in both Native and Browser shared-Broad result contracts; canonical IPA and the legacy Browser default remain unchanged. New tests cover lenis/fortis negative controls, [ɥi], and narrow /h/ contexts. This is an algorithmic representation improvement, not an adjudicated accuracy claim.

### Correction to the initial C04 label

The earlier fragment heuristic called 45 operations across 37 occurrences an aspiration-notation mismatch because the grapheme aligner displayed fragments like h → kʰ. That label was misleading. The full IPA strings show the actual source forms are kx or kç, compared with Kozak Kim's kʰ. The exporter now identifies this as C12_aspirated_velar_coarticulation_profile and suppresses the false C04 label. It remains evidence-limited; no production kʰ rule has been changed.

## Follow-up algorithm adaptations — 2026-11-02

This continuation implements source-scoped variants in Kozak Kim itself. It does not rewrite canonical Broad IPA to fit the UGTPHON annotations. Original g2pK source/vendor files remain untouched.

### Cluster-ordered disposition

| Priority | Cluster | Engine change | Status and boundary |
|---|---|---|---|
| 1 | C11 — `ɕ → s`, 229 operations / 227 occurrences | Expanded optional lenis /s/ → [ɕ] candidates to all /j/-initial nuclei described by Lee (1993), including ㅕ/ㅛ/ㅠ. | PARTIAL: canonical /s/ remains; ㅆ is excluded; optional variants are not accuracy gains and are not scored as canonical predictions. |
| 2 | C05 — ㅟ [y] vs [ɥi]/[wi], 72 combined operations | Retained existing [wi] and added [ɥi] as a separately inspectable Broad candidate. | PARTIAL: canonical [y] remains; speaker/context distribution needs independent review. |
| 3 | C12 — `kx/kç → kʰ`, 45 operations / 37 occurrences | No phonological rewrite. Ito (2007), `SRC-KCI-ITO-2007-MORPHEME-STRUCTURE`, reports lexical underrepresentation of /kʰ/ and proposes possible confusion with a velar/uvular fricative; this is abstract-only lexical-distribution context, not acoustic evidence for [kx]/[kç]. | BLOCKED: no sufficiently specific authoritative source or independently adjudicated item-level IPA; do not map `kx/kç` to `kʰ` in the normalizer. |
| 4 | C06 — unreleased coda, 34 operations | No change; [p̚], [t̚], [k̚] remain represented and Broad normalization preserves the unreleased marker. | DONE_VERIFIED as a preservation decision; corpus omissions alone do not license stripping the feature. |
| 5 | C01/C07 — liquid realizations, 12 operations | Added Seoul-scoped [ɭ] for intervocalic /l/ and before /i,j/ in Narrow v5; exposed the same as optional Broad variants. | PARTIAL: no blanket ɾ/l/ substitution; coda and geminate behavior remain separately conditioned. |
| 6 | C09 — lexical length, 8 operations | No new global rule; existing source-attested length overrides remain. | DONE_VERIFIED as a preservation decision; annotation omissions do not license deleting lexical length. |
| Additional unmapped | C02 /h/ realization and other fragments | Added source-scoped [ɸ] for same-word intervocalic ㅎ in Narrow v5 and as an optional Broad variant. Existing [ç]/[x] and post-sonorant [ɦ] contexts remain separately scoped. | PARTIAL: S018 describes [ɸ] between voiced sounds; this does not authorize a general /h/ rewrite or ㅎ deletion. |

### Source and runtime contract

- S018 (Lee 1993, Seoul Korean, Illustrations of the IPA) supports [ɕ] for /s/ before /i/ or a /j/-initial diphthong, [ç] before /i,j/, [x] before /u/, [ɸ] between voiced sounds, and [ɭ] intervocalically / before /i,j/. The implementation keeps the newly added broad readings optional and keeps narrow-profile details out of the Ukrainian target path.
- S019 remains a narrower acoustic source for selected sibilant contexts; it is not used to force a universal /s/→[ɕ] rewrite.
- S020 continues to support [ɥi] as one possible ㅟ realization; it does not replace [y] or [wi].
- The narrow profile is now `clippyfirst-korean-narrow-contextual-allophones-v5`, version 5, partial research-only and not target-compatible.
- Python and Browser Broad candidate generation were updated together. No original g2pK/vendor source was changed.

### Exact-head verification boundary

The last completed exact-head workflow set belongs to prior code head `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695`, before this follow-up code change. It passed Python/data integrity, Browser tests/build, Browser G2P, external UGTPHON, paired Native/g2pK, morphology consensus, test-case extraction, and the ten-engine comparison. The new v5 code and tests have not yet obtained a workflow result at their current head; do not transfer the prior PASS statuses to the new code.

The local environment could not resolve `github.com`, so a clean local checkout/test run was unavailable. GitHub connector commits also returned no exact-head workflow runs or commit status checks at the time of this update. Fresh exact-head CI is therefore BLOCKED pending a workflow run on the current branch head.

### Diagnostic baseline — prior exact-head artifact only

The completed multi-engine artifact on the previous head scored 2,698 Native occurrences and 2,703 g2pK occurrences. On the 2,698 paired scored occurrences:

- Strict exact: Native 1,431/2,698 (53.0393%); original g2pK 1,433/2,698 (53.1134%).
- Strict CER: Native 2,090/23,065 (9.0613%); original g2pK 2,129/23,065 (9.2304%).
- Broad candidate exact: Native 2,328/2,698 (86.2861%); original g2pK 2,312/2,698 (85.6931%).
- Broad candidate CER: Native 489/22,189 (2.2038%); original g2pK 527/22,189 (2.3751%).

These are paired corpus-relative diagnostics, not normative IPA accuracy. Native has lower CER in both views; g2pK retains a two-occurrence strict exact-match edge. The new optional variants and v5 narrow-profile changes have not been benchmarked on a fresh exact head, so no improvement is claimed.

### Next acceptance actions

1. Obtain fresh exact-head Python and Browser test/build results for the current branch head.
2. Run the paired Native/g2pK and multi-engine diagnostic on that exact head; compare strict and Broad metrics separately and inspect whether optional variant coverage is useful without changing canonical output.
3. Keep C12 and the 239 unmapped mismatch occurrences evidence-limited until source/context adjudication exists.
4. Obtain two independent IPA reviewers, complete item-level NIKL rights review, and independent Ukrainian target-layer review before release claims.



## Continuation correction — 2026-11-03

### C04/C02 cluster identity

The earlier progress bullets above incorrectly labelled the /h/ allophone work as C04. The current mass-mismatch register defines **C02** as the /h/ realization cluster. **C04** is a separate IPA aspiration-symbol/segmentation convention cluster and now has zero assigned residual occurrences after the 37-occurrence `kx/kç` set was reclassified as C12. The [ç]/[x]/[ɸ] work belongs under C02; the optional [ɭ] work belongs under C01/C07. No phonological inference should be drawn from the old C04 labels.

### C08 occurrence traceability

The pinned fixture `tests/fixtures/kozak-kim-c08-source-contexts.json` now maps all eight C08 source-row IDs. Three IDs (`multilexnorm2026_1953`, `multilexnorm2026_1979`, `dc_inside_2024`) were independently recovered from the paired artifact; five (`multilexnorm2026_1916`, `multilexnorm2026_2011`, `dc_inside_2186`, `dc_inside_2266`, `dc_inside_2557`) are high-confidence reconstructions from the pinned fortis-mismatch signature and exact token/context in the pinned source split. The missing original one-off extraction table is still not recovered, so those five must remain explicitly labelled reconstructed.

Seven cases have conditional morphology / Rule §27 environment leads; this is not exact-token IPA gold. `유사성` remains the one unresolved lexical case: NIKL Q&A 312649 attests `의외성`, not `유사성`. The fixture records the analyzer disagreement for `했을시`, the colloquial dependent noun `거`, pause/prosody uncertainty for `안할듯`, and the exact source-row sentences. No new production rule is licensed by this mapping. Added a Python integrity test for the eight-ID partition, three independently recovered plus five reconstructed, the unresolved `유사성` case, and explicit non-gold/no-production-change limitations.

### Additional NIKL surface comparator

Registered NIKL Q&A 319525 for `맛없다[마덥따]` under §15. It is Hangul surface evidence, not IPA or Ukrainian target gold. In the paired SIGMORPHON diagnostic, Kozak Kim's surface-derived form matches this official Korean reading while original g2pK's does not. This is a bounded exact-form comparison only; it does not license a general rule for every `맛+vowel` sequence. Original g2pK remains unchanged.


## Exact-head verification addendum — 2026-11-03

Full system Verify [41611005804](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41611005804) on the 2026-11-03 branch head passed: 624 Python tests, 1,389 Browser tests, Vite public-page build and generated-page checks. The new C08 3+5 source-row mapping integrity test passed. NIKL metadata inventory was skipped. Browser G2P, UGTPHON, paired Native/g2pK, morphology and test extraction diagnostic workflows passed on the same production algorithm tree; the latest multi-engine result remains the previously inspected successful artifact 13184368365, because subsequent reruns were cancelled during concurrent PR-head updates. No production phonology code changed after algorithm tree `5c775dfa6b6a969c320f47c1420c75ffa645e369`.


## C08 no-generalization regression — 2026-11-03

The five reconstructed/uncertain contexts `해줄것`, `많을거같이`, `보일거라`, `내릴수있는`, and `안할듯` are now explicit negative controls in `tests/test_end_to_end.py`: the current R013 implementation must not fortify them without an exact same-word or phrase license. This protects against suffix-wide generalization; it does not assert plain-onset normative gold. Exact-head Verify [41611695345](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41611695345) passed 624 Python tests, 1,389 Browser tests, Vite build and generated-page checks. NIKL metadata inventory skipped.


## 2026-11-03 — Kozak Kim lexical ablation continuation (PR #425)

The new exact-head implementation adds an explicit research-overlay ablation mode and a benchmark audit without changing the default engine policy. See [PR #425](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/425) and the master handoff for full evidence.

- Both `kozak-research-only` and `variant-aware-research` entries are excluded from both surface and IPA overrides when ablation is enabled; the result records `research-lexical-excluded`. The default mode remains unchanged.
- New occurrence-level audit compares full and ablated native outputs; the separate Native/g2pK pairwise helper preserves repeated occurrences and exact-match categories.
- System Verify 41654558006 PASS (Python regression/data integrity, Browser 1,391/1,391, Vite build, generated pages). Paired Native/g2pK 41654557675 PASS; Native exact 53.0393%, CER 9.0613%; g2pK paired exact 53.1134%, CER 9.2304% on 2,698 shared tokens.
- Multi-engine run 41654557693 remains IN PROGRESS at this report update. Its completed artifact and generated mismatch queue must be inspected before any new benchmark conclusion or mismatch count is recorded.
- Original g2pK vendor Browser file remains identical to main. No independent IPA gold, rights clearance, or Ukrainian target adjudication is implied by software tests.

## 2026-11-04 — current unmapped-broad queue and rule-boundary triage

The exact refreshed queue has 36 occurrence rows, 32 unique Hangul tokens, 27 source-row IDs, 55 unmapped-broad fragments, and 36/36 context lookups FOUND. The 55 fragments represent repeated occurrence-level evidence, not 55 independent linguistic phenomena. Frequent families include stop/affricate voicing or transcription differences (`t→d`), segment deletions (notably `j`, `n`, `l`, `ŋ`), fortis/lenis differences (`s͈→s`, `k͈→ɡ`) and sibilant-place/voicing differences (`ɕ→ʑ`, `ɕ͈→ʑ`). Repeated tokens mean raw fragment counts overstate independent lexical coverage.

No production rule is inferred from those fragments alone: they may reflect phonemic/phonetic convention, corpus annotation, morphology, prosody or genuine engine error. In particular, the compact UGC tokens `해줄것` and `많을거같이` remain unlicensed for R013 because the runtime cannot safely reconstruct their word boundaries or pause structure from the token alone.

A bounded improvement now supports explicit phrase input: `줄 것` and `많을 거` are exact NIKL §27 adjacent-eojeol licenses. Python requires `boundary_mode="phrase"`; Browser uses the same exact pair map. The Python implementation records the exact pair index so a matching syllable sequence elsewhere in the sentence cannot inherit the license. New tests preserve the no-space and punctuation negatives. This is a rule-derived standard reading, not direct acoustic IPA evidence; new CI is pending.


## 2026-11-04 — exact-head verification and discrepancy benchmark refresh

**Verified branch head:** `9803eef502ea655319954520b984fe33049ffe8e` (PR #426; code/test tree includes the exact R013 connected-phrase implementation). This supersedes the earlier checkpoint that described the current multi-engine rerun as still in progress.

### Exact-head software and runtime verification

- System Verify [41809176725](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809176725): **PASS** — Browser regression/build job PASS; Python regression/data-integrity job PASS. The Browser suite is 1,395/1,395 at this head. Official NIKL source inventory was **SKIPPED** (metadata-only), not passed.
- Browser G2P integration [41809183570](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183570): **PASS**.
- Paired Native/g2pK [41809183782](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183782): **PASS**.
- External UGTPHON [41809183902](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183902): **PASS**.
- Morphology consensus [41809183398](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183398), morphology adapter smoke [41809183542](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183542), and exhaustive test-case extraction [41809183481](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183481): **PASS**.
- Multi-engine benchmark [41809183760](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183760): **PASS**, all 17 comparison/export/runtime-parity steps passed. Artifact [13312557366](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183760/artifacts/13312557366), SHA-256 `c33601cf32fbe70aa4f199936eeacb749f4f305dabd574f44dc9d3da02b89315`.
- CharsiuG2P inference, ByT5 inference, and neural pairing were **SKIPPED** under the default-off policy. They are not passes and no neural result is claimed.

### Runtime parity

On the same pinned UGTPHON occurrences and shared IPA profile:
- Surface Hangul: **2,703/2,703 identical** between Native and Browser.
- Raw IPA: **2,698/2,698 identical**.
- Broad IPA: **2,698/2,698 identical**.
- Both runtimes scored the same 2,698 occurrences and abstained on the same five.

This verifies implementation parity, not independent pronunciation accuracy.

### Refreshed paired diagnostic against the unchanged original g2pK 0.9.4 baseline

**UGTPHON, 2,698 paired scored occurrences**
- Kozak Kim: 1,431 exact (**53.0393%**), CER **8.9920%**.
- Original g2pK: 1,433 exact (**53.1134%**), CER **9.2304%**.
- g2pK's exact-match point edge is **0.0741 pp**; the paired row-cluster 95% CI for g2pK-minus-Kozak exact delta is **−0.0824 to +0.2840 pp**, crossing zero.
- Kozak Kim's CER is lower by **0.2384 pp**; paired row-cluster 95% CI for g2pK-minus-Kozak CER delta is **+0.1392 to +0.3464 pp**.

**SIGMORPHON 2021, 998 paired scored occurrences**
- Kozak Kim: 358 exact (**35.8717%**), CER **14.5598%**.
- Original g2pK: 353 exact (**35.3707%**), CER **14.8222%**.
- Kozak Kim has five net exact wins (five Kozak-only exact, zero g2pK-only exact); exact two-sided McNemar **p = 0.0625**, so the exact-match result is promising but not decisive at the 0.05 threshold.
- Paired row-cluster bootstrap gives a descriptive Kozak-minus-g2pK exact delta interval of **+0.1002 to +1.0020 pp** and a CER improvement interval of **+0.0986 to +0.4444 pp**. These descriptive bootstrap intervals are not substituted for the exact McNemar test or a preregistered inference plan.
- The broad-candidate view is separately reported and is sensitivity analysis only; its normalizations remove selected IPA distinctions and do not establish normative IPA accuracy.

The two pinned corpora are diagnostic annotations, not independently adjudicated Korean IPA gold. The g2pK surface is rendered through the shared project IPA adapter, so it is not an independent IPA encoder. Neither corpus measures Ukrainian target quality. No universal engine-superiority claim is made.

### R013 phrase-boundary acceptance

**DONE_VERIFIED:** exact NIKL §27 adjacent-eojeol licenses `줄 것` and `많을 거` now have current-head Python and Browser verification. Python phrase mode records the exact adjacent pair index and trace context; Browser uses the same exact pair map. Compact no-space forms and punctuation-separated boundaries remain negative controls. Phrase mode assumes connected speech; NIKL §27 says a pause blocks fortition, and the text API does not infer pauses. This is a rule-derived surface/phonology result, not direct acoustic IPA attestation.

### Remaining blockers

- Independent Korean IPA adjudication: two qualified reviewers must annotate the frozen 24-case blind packet; no reviewer annotation is yet accepted.
- Independent Ukrainian target-layer review and reader validation.
- Item-level NIKL reuse/KOGL verification; metadata-only inventory remains skipped and the official metadata route has returned 403.
- C12 aspirated-velar coarticulation: general primary acoustic evidence is registered, but the 37 text/IPA rows (29 unique tokens; 16 `kxɯ`-only, 12 `kçi`-only, 8 `kçj`-only, one overlap) have no linked audio/speaker metadata in the mismatch file. The cited paper has no /ɯ/ or /j/ context and no [kx]/[kç] notation. Exact source-audio/annotation crosswalk and independent item-level IPA review remain blocked; no `kx/kç → kʰ` production rewrite.
- Historical 239-case mismatch population: exact source/context adjudication remains incomplete. The refreshed 36-row unmapped-Broad queue is a separate generated subset (36/36 context lookups found), not a resolution of all 239 historical occurrences.
- Remaining NIKL interaction, names/loans, Hanja, and regional/style coverage remain partial or unverified.

**Readiness:** software and current branch CI are verified for this continuation; the overall system remains a **research prototype**, not research-certified or release-ready. Original g2pK 0.9.4 and vendored source remain unchanged and comparison-only.


## 2026-11-04 completed paired benchmark refresh

Latest completed artifact [41843472619](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41843472619), artifact 13330749031, SHA-256 `4c0b22df3e964b6483c098b066497dbe5518ed13e6a55af919e41a1d8cbb357d`. UGTPHON paired n=2,698: Kozak 53.0393% exact / 8.9920% CER; original g2pK 53.1134% / 9.2304%. SIGMORPHON paired n=998: Kozak 35.8717% / 14.5598%; g2pK 35.3707% / 14.8106%. Exact-match uncertainty on UGTPHON crosses zero; SIGMORPHON favours Kozak on exact and CER. Both are diagnostic annotations, not normative IPA gold. Native/Browser parity on the same UGTPHON occurrences is 2,703/2,703 surface and 2,698/2,698 IPA identical, with five shared abstentions.

Exact-head rerun [41849673041](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41849673041) on `02a72da6534b110d63810c497a6b7fba9b790a3e` is still running its multi-engine comparison; this completed artifact is the prior reproducible snapshot, not a result from the rerun.


## 2026-11-04 — source-attested vowel-length discrepancy: 없는

**Disposition: Kozak Kim preserved; no production change.**

The completed exact-head multi-engine artifact (run [41851913351](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41851913351), artifact 13337845603, SHA-256 `7c0dce9cada1c15a22f99f18bea048b75f2df9b0133d9e87fcda3f95b82a484c`) contains four occurrences of `없는` (source rows `dc_inside_2035`, `dc_inside_2108`, `dc_inside_2212`, `dc_inside_2269`). All four have the same diagnostic split:
- Kozak Kim: `ʌːm.nɯn`
- original g2pK 0.9.4: `ʌm.nɯn`
- corpus reference: `ʌ̹mnɯn`

The official NIKL Korean Basic Dictionary entry `없다` (ParaWordNo=89917) directly lists the application `없는[엄ː는]`. This is Hangul surface evidence for vowel length, not source IPA. The project's `/ʌːm.nɯn/` is the broad-IPA rendering of that attested length. Therefore the four g2pK exact matches are matches to a corpus string that omits the source-attested length; they are not evidence that Kozak Kim should shorten the vowel.

The source is registered as `SRC-NIKL-KRDICT-89917` / `S026`; C13 and four occurrence rows are added to the discrepancy registers. The new regression checks the exact source record and existing Kozak output. The raw corpus annotation, benchmark scoring and original g2pK implementation remain untouched. Item-level KOGL marking is still unverified.


## 2026-11-04 final verification checkpoint — evidence-only NIKL length adjudication

**Branch head entering this checkpoint:** `9b81a412d733b61ddd0782920ef727291cd1a374`. The C13 continuation changes only source metadata, discrepancy evidence, tests, and documentation; Kozak Kim production code and the pinned g2pK baseline are unchanged.

### Red/green and exact-head verification

- Test-first RED: `e11be81d5a2db517aa808a12f6eb31264fb492ef`; System Verify [41869617954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41869617954) failed exactly because `SRC-NIKL-KRDICT-89917` had not yet been registered. The Browser suite passed at this RED checkpoint.
- Evidence GREEN: `00aa0b6ebb1c4dfae906d4661cb88d8b8d0876a9` added the NIKL source to the research register and source catalog, C13 and four paired occurrence rows, and the test asserting the source-backed length and the existing Kozak IPA.
- Follow-up test correction: `9b81a412d733b61ddd0782920ef727291cd1a374` updated the Browser source-rights audit's expected register count from 176 to 177 and REVIEW_REQUIRED from 164 to 165, and explicitly checks the new source remains unresolved for item-level rights. This was a stale fixed-count assertion caused by the new source record, not a browser-engine regression.
- Exact-head System Verify [41870455925](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41870455925): PASS — Python regression/data integrity PASS; Browser **1,396/1,396**, 0 failures; Vite build (55 modules) and generated-page checks PASS. A duplicate exact-head verify [41870442892](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41870442892) also PASS.
- Browser G2P [41870455567], paired Native/g2pK [41870455546], external UGTPHON [41870455517], morphology consensus [41870455515], morphology adapter smoke [41870455495], and exhaustive extraction [41870455600]: PASS.
- Multi-engine rerun [41870455614] is still in progress at the multi-engine comparison step as of this checkpoint. Do not claim a result from that run until it completes. The latest completed exact production-code benchmark remains [41851913351], artifact 13337845603, SHA-256 `7c0dce9cada1c15a22f99f18bea048b75f2df9b0133d9e87fcda3f95b82a484c`; production code is unchanged since that benchmark.
- Official NIKL metadata-only inventory: SKIPPED, not passed. CharsiuG2P and ByT5 inference: SKIPPED, not passed.

### C13 source adjudication: 없는

The four UGTPHON occurrences (`dc_inside_2035`, `dc_inside_2108`, `dc_inside_2212`, `dc_inside_2269`) all have Kozak `/ʌːm.nɯn/`, original g2pK `/ʌm.nɯn/`, and corpus reference `/ʌ̹mnɯn/`. NIKL Korean Basic Dictionary entry 89917 directly lists `없는[엄ː는]`. This supports the long vowel at the Hangul surface level; it does not supply IPA. The project's `/ʌːm.nɯn/` is the derived broad-IPA rendering. The corpus annotation omits length, so g2pK's exact string match is not the stronger source-backed reading. Preserve Kozak's existing output; do not shorten it or rewrite the raw corpus reference.

Source register: `SRC-NIKL-KRDICT-89917`; catalog: `S026`; mass cluster: C13; paired ledger: occurrence IDs 893, 1145, 1621, 2290. The new Python regression passed on the exact verified head. Item-level KOGL marking remains unchecked.

### Existing source-backed comparative wins retained

- `인기`: NIKL Q&A 331569 explicitly gives optional `인기[인끼]`; the existing `variant-aware-research` row preserves the non-fortis alternative. The current paired occurrence is native exact and g2pK non-exact. This is a lexical optional variant, not a productive ㄴ+ㄱ or all-`氣` rule.
- `못잃어`: the existing `variant-aware-research` entry keeps both `몬니러` and `모시러` candidates. NIKL's 2022 usage survey discusses both n-insertion and non-insertion for `못 잃어`, but the percentages in the surfaced table belong to `못 잇는다` and must not be transferred. The primary candidate is not a normative ranking. The paired occurrence is native exact and g2pK non-exact.
- These existing rows are preserved; no new productive rule or production override was introduced in this checkpoint.

### Readiness and handoff

- Original g2pK 0.9.4 remains pinned and unchanged; no vendor file was touched.
- PR #426 remains Draft/open, based on PR #425; it is a stacked change and must not be merged independently. No merge, release, deployment, force-push, or branch deletion.
- Independent Korean IPA review, independent Ukrainian target review, item-level NIKL rights, C12 source audio/speaker/prosodic crosswalk, historical 239-case adjudication, and names/loans/Hanja/regional-style coverage remain open.
- Research-only neural inference remains deferred/skipped.
- Readiness remains **research prototype**, not research-certified or release-ready.


## 2026-11-05 follow-up — reclassification and context-backed corrections

The 239 count above is historical: it counted Broad-v2 occurrences with mismatch fragments not assigned to C01–C10 at the 2026-11-02 snapshot. Subsequent C11/C12 and related cluster work reclassified large portions; the later 36-row unmapped queue is a narrower extract. These counts describe different snapshots and grains, not 239 currently proven defects.

The pinned UGTPHON Korean test split was fetched at commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54` (Apache-2.0 per the Korean subset README metadata). Four exact same-eojeol contexts now have R013 / NIKL §27 licenses in Kozak Kim: `해줄것`, `많을거같이`, `내릴수있는`, and `존중시킬수도있지만`. The source contexts, Broad-v2 comparator values, prior outputs, licensed syllable pairs and decisions are in `kozak-kim-context-adjudication-2026-11-05.csv`. No equivalent rule or lexical overlay was added to g2pK.

The `출산` case (row `dc_inside_2107`) is provisionally retained under the existing R012 / NIKL §26 license: the corpus comparator omits fortis /s͈/, but a single Broad-v2 reference is not sufficient to overturn the NIKL-backed form. Independent Korean review is still required.

**Current queue disposition:** 4 exact-form corrections implemented; 1 provisional retain; 31 of the 36 rows remain without an individual fix/retain/abstain adjudication. The full historical 239-occurrence ledger with stable IDs, full context, exact profile/version provenance and reviewer decisions is still TODO. The 2,703-record multi-engine report is pre-fix; the full benchmark has not been rerun on the new code. Do not describe old scores as post-fix metrics.

**Known trace limitation:** Python `RuleTrace` has one scalar `license_context` per rule pass. When a sentence contains multiple licensed R013 forms, IPA output and isolated exact-form tests cover each correction, but the sentence-level trace may retain only the last license context. Per-occurrence provenance is a follow-up requirement.
