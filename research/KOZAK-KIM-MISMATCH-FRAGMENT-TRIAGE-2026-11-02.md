# Latest verified continuation — 2026-11-02 (Kozak Kim only)

**Implementation/test head:** `2762e8647a075ed8143503c3f4f19d1318ef0e7c`  
**Branch:** `research/kozak-kim-mismatch-fragment-triage-2026-11-02`  
**PR:** [#423](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/423), Draft / open / unmerged.  
**Scope:** Kozak Kim only. Original g2pK 0.9.4 source and vendor files remain unchanged.

## Root-cause fixes after exact-head CI exposed stale and inconsistent expectations

The first post-v5 verification attempt, run [41530749317](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41530749317), failed on the PR merge ref `f506df68cbbdcf1e105022b544939d5556f933a2`. The failure was read from the job log and separated into actual implementation defects versus stale/incorrect assertions:

1. **Python/Browser Broad-profile drift:** Browser already exposed optional [ɕ] before ㅕ/ㅛ/ㅠ; Python's Broad candidate set omitted those nuclei. Python now matches the Browser set. Canonical /s/ remains unchanged and fortis ㅆ remains excluded.
2. **Word-initial liquid overreach:** Broad [ɭ] generation treated a word-initial ㄹ before a glide as the cited intervocalic /l/ context. Python and Browser now require a same-word predecessor before emitting this candidate. Canonical [ɾ] remains.
3. **Profile metadata assertions:** two tests still expected v4 although the narrow profile was deliberately bumped to v5. Assertions now check v5.
4. **Incorrect [ɸ] negative control:** `아하` is same-word intervocalic ㅎ, so [ɸ] is a valid Narrow realization under the selected S018 profile. The negative control now uses word-initial `하`; Broad canonical [h] remains unchanged.

Fixes and regression coverage were committed in:
- `36be6cc6677282d896c097fe8621501876a1a9fe` — align Python Broad [ɕ] candidates and scope [ɭ].
- `1081f45c60d055b59bad7500703d58fffdf6a04b` — same-word scope for Browser [ɭ].
- `8ad3abc33772cdbb15abbc89d8be9a6eb3221ea7` — v5 contract and corrected context regressions.
- `e56d103704e547ba9ee05a62d17014593c69bac9` — Narrow v5 metadata assertion.
- `2762e8647a075ed8143503c3f4f19d1318ef0e7c` — Browser regression for word-initial `례`.

## Exact-head verification — commit `2762e8647a075ed8143503c3f4f19d1318ef0e7c`

| Workflow | Run | Result |
|---|---:|---|
| Python regression + data integrity | [41531592010](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41531592010) | **PASS** — full `python -m pytest -q`; no failures. |
| Browser regression + production build + generated-page checks | [41531592010](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41531592010) | **PASS** — 1,389/1,389 Browser tests; Vite build and generated-page checks passed. |
| Browser G2P integration | [41531591926](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41531591926) | **PASS**. |
| External UGTPHON diagnostic (Native + Browser + original g2pK paired reports) | [41531591932](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41531591932) | **PASS**. |
| Paired Native Kozak Kim vs g2pK | [41531592007](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41531592007) | **PASS**. |
| Kiwi + MeCab-Ko morphology consensus | [41531591917](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41531591917) | **PASS**. |
| Exhaustive test-case register extraction | [41531591990](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41531591990) | **PASS**. |
| Ten-engine UGTPHON + SIGMORPHON + Native/Browser parity | [41531591922](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41531591922) | **IN_PROGRESS** at this checkpoint; do not claim its final comparison or artifact yet. |
| Official NIKL metadata inventory | [41531592010](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41531592010) | **SKIPPED**. |
| CharsiuG2P inference / ByT5 inference | [41531591922](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41531591922) | **SKIPPED** by workflow policy; no inference result is claimed. |

Non-blocking log notes: the Vite build emitted its existing chunk-size advisory; GitHub's runner emitted Node 20 action deprecation notices. The Python suite emitted the existing diagnostic-only 20-case g2pK JS-port differential warning (18 equal, 2 divergent); this is not a failing assertion and does not modify the original baseline.

## Paired comparison against untouched original g2pK

Pinned UGTPHON test split; metrics are diagnostic and not normative IPA gold. Both systems use the same selected occurrence set when the paired subset is reported.

**Native Kozak Kim vs original g2pK**, 2,698 shared scored occurrences (artifact `13182990258`, run `41531592007`):
- Strict exact: Native 1,431/2,698 = **53.0393%**; g2pK 1,433/2,698 = **53.1134%**.
- Strict CER: Native **9.0613%**; g2pK **9.2304%**.
- Interpretation: Native has 0.1691 percentage points lower CER, while g2pK has a two-occurrence (0.0741 pp) strict-exact edge. Native abstained on five occurrences; there were zero engine errors.

**Browser Kozak Kim vs original g2pK**, 2,698 shared scored occurrences (artifact `13182830583`, run `41531591932`):
- Exact: both **53.4470%** (1,442/2,698).
- CER: Browser **8.0685%**; g2pK **8.2072%** — Browser lower by **0.1387 percentage points**.
- Sentence/utterance-cluster bootstrap (264 row clusters, 2,000 resamples): exact-rate delta 95% CI **[−0.2071, +0.2006] pp**; CER delta (Browser minus g2pK) 95% CI **[−0.2303, −0.0584] pp**.
- 2,498/2,698 surfaces were identical; 200 differed. Browser abstained on five tokens; g2pK abstained on none.
- Interpretation: Browser ties g2pK on strict exact match and has lower CER on this diagnostic sample. This does not prove universal superiority or normative accuracy. g2pK emits Hangul surface forms that are rendered through the project's shared IPA adapter, so this is not an independent IPA encoder comparison.

Do not collapse the Native and Browser metrics into one score. They are separate runtime comparisons and have different paired reports. The original g2pK code/vendor files are unchanged.

## Current task ledger

| Work item | Status | Evidence / acceptance |
|---|---|---|
| Python/Browser Broad [ɕ] candidate parity for ㅕ/ㅛ/ㅠ | DONE_VERIFIED | Python and Browser regression suites pass on `2762e8647a075ed8143503c3f4f19d1318ef0e7c`; canonical /s/ and fortis ㅆ remain unchanged. |
| [ɭ] scope excludes word-initial ㄹ false positive | DONE_VERIFIED | Python existing negative control plus Browser `례` regression; full suites pass. |
| Narrow IPA profile v5 metadata and context assertions | DONE_VERIFIED | Python suite passes; v5 remains partial research-only and not target-compatible. |
| Python regression/data integrity | DONE_VERIFIED | Run 41531592010 PASS. |
| Browser regression/build/generated pages | DONE_VERIFIED | Run 41531592010 PASS, 1,389/1,389. |
| Paired Native/g2pK comparison | DONE_VERIFIED | Run 41531592007 PASS; exact/CER trade-off above. |
| Paired Browser/original g2pK comparison | DONE_VERIFIED | Run 41531591932 PASS; exact tie, lower Browser CER on this diagnostic sample. |
| Morphology consensus + external UGTPHON + extraction | DONE_VERIFIED | Runs 41531591917, 41531591932, 41531591990 PASS. |
| Ten-engine comparison and runtime parity | PARTIAL | Run 41531591922 still running at this checkpoint; await final artifacts. |
| C11 / C05 / C01-C07 / C02 allophone policy | PARTIAL | Source-scoped optional variants are implemented; two qualified IPA reviewers and adjudication remain required. |
| C12 `kx/kç → kʰ` | BLOCKED | 45 operations / 37 occurrences; no exact-environment primary source plus independent item-level IPA adjudication. No production rewrite. |
| 239 unmapped mismatch occurrences | TODO | Require sentence/morphology/source review; create new clusters only when a shared cause is evidenced. |
| NIKL item-level reuse rights | BLOCKED | Metadata-only inventory was skipped; item-level permission remains unverified. |
| Ukrainian target adaptation review | BLOCKED | Independent Ukrainian phonetic/orthographic review outstanding. |
| CharsiuG2P / ByT5 inference | DEFERRED | Optional inference jobs were skipped; no result claimed. |
| Release readiness | DEFERRED | Research prototype; not release-ready or research-certified. |

## Methodology applied

- **Superpowers:** systematic debugging from CI evidence; test-first regression at the Python behavior seam; fresh verification before success claims.
- **Matt Pocock skills:** narrow, behavior-oriented regression coverage; diagnose the root cause before changing code; review standards and behavior separately.
- **Ponytail:** preserve existing module boundaries and g2pK baseline; change only the demonstrated mismatch behavior; no extra abstraction or speculative normalization.

## Remaining acceptance gates

1. Read and archive the final ten-engine UGTPHON/SIGMORPHON and Native/Browser parity artifacts from run 41531591922.
2. Keep C12 and the 239 unmapped mismatch occurrences evidence-limited until their exact Korean environments are source-adjudicated.
3. Obtain two independent Korean IPA reviews and adjudicate disagreements.
4. Complete item-level NIKL reuse-rights review.
5. Obtain independent Ukrainian target adaptation review.

No merge, release, deployment, or g2pK/vendor modification was made.

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

- **C11 sibilant place:** Broad canonical /s/ remains unchanged. The engine now exposes an optional [ɕ] allophone variant for lenis ㅅ before ㅣ, ㅑ, ㅒ, ㅖ; fortis ㅆ is deliberately excluded. The narrow profile continues to expose [ɕʰ] and now includes ㅒ. Evidence: Lee (1999), Korean, Illustrations of the IPA, describes /s/ as [ɕ] before /i/ or a diphthong beginning [j]; Kang (2010) supplies acoustic evidence for /i, ye, ya/ and cautions that /yo, yu/ differ. This is an optional reading, not a forced broad rewrite.
- **C04 /h/ allophones:** The narrow research profile now outputs [ç] before selected high-front/glide nuclei and [x] before ㅜ; the shared Broad result also exposes these as optional variants while retaining canonical [h]. The narrow profile is versioned v4. Evidence: Lee (1999), *Korean, Illustrations of the IPA*. This does not solve C12, which concerns aspirated velar /kʰ/ release/coarticulation, not underlying ㅎ.
- **C05 front-rounded ㅟ:** [ɥi] is now exposed as an additional broad IPA variant alongside existing canonical [y] and alternate [wi]. Evidence: the UCL acoustic/phonetic thesis review of Lee (1996) describes /wi/ as sometimes [ɥi], [ø] or [y]. The canonical remains [y]; the variant does not assert one speaker-independent pronunciation.
- **C04 /h/ allophones:** Narrow research IPA now represents [ç] before selected high-front/glide nuclei and [x] before ㅜ; the previously implemented optional post-sonorant [ɦ] retains priority. Broad and phonemic IPA are unchanged. The narrow profile was versioned from v3 to v4. Evidence: Lee (1999), Illustrations of the IPA, for Seoul Korean. This is profile-scoped, not a general ㅎ deletion rule.
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
| 1 | C11 — `ɕ → s`, 229 operations / 227 occurrences | Expanded optional lenis /s/ → [ɕ] candidates to all /j/-initial nuclei described by Lee (1999), including ㅕ/ㅛ/ㅠ. | PARTIAL: canonical /s/ remains; ㅆ is excluded; optional variants are not accuracy gains and are not scored as canonical predictions. |
| 2 | C05 — ㅟ [y] vs [ɥi]/[wi], 72 combined operations | Retained existing [wi] and added [ɥi] as a separately inspectable Broad candidate. | PARTIAL: canonical [y] remains; speaker/context distribution needs independent review. |
| 3 | C12 — `kx/kç → kʰ`, 45 operations / 37 occurrences | No phonological rewrite. The mismatch is velar coarticulation/release, not a simple ㅎ aspiration spelling difference. | BLOCKED: no sufficiently specific authoritative source and no independently adjudicated item-level IPA. Do not map `kx/kç` to `kʰ` in the normalizer. |
| 4 | C06 — unreleased coda, 34 operations | No change; [p̚], [t̚], [k̚] remain represented and Broad normalization preserves the unreleased marker. | DONE_VERIFIED as a preservation decision; corpus omissions alone do not license stripping the feature. |
| 5 | C01/C07 — liquid realizations, 12 operations | Added Seoul-scoped [ɭ] for intervocalic /l/ and before /i,j/ in Narrow v5; exposed the same as optional Broad variants. | PARTIAL: no blanket ɾ/l/ substitution; coda and geminate behavior remain separately conditioned. |
| 6 | C09 — lexical length, 8 operations | No new global rule; existing source-attested length overrides remain. | DONE_VERIFIED as a preservation decision; annotation omissions do not license deleting lexical length. |
| Additional unmapped | C02 /h/ realization and other fragments | Added source-scoped [ɸ] for same-word intervocalic ㅎ in Narrow v5 and as an optional Broad variant. Existing [ç]/[x] and post-sonorant [ɦ] contexts remain separately scoped. | PARTIAL: S018 describes [ɸ] between voiced sounds; this does not authorize a general /h/ rewrite or ㅎ deletion. |

### Source and runtime contract

- S018 (Lee 1999, Seoul Korean, Illustrations of the IPA) supports [ɕ] for /s/ before /i/ or a /j/-initial diphthong, [ç] before /i,j/, [x] before /u/, [ɸ] between voiced sounds, and [ɭ] intervocalically / before /i,j/. The implementation keeps the newly added broad readings optional and keeps narrow-profile details out of the Ukrainian target path.
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

