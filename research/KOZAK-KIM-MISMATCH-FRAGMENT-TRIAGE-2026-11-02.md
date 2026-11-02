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
- **C05 front-rounded ㅟ:** [ɥi] is now exposed as an additional broad IPA variant alongside existing canonical [y] and alternate [wi]. Evidence: the UCL acoustic/phonetic thesis review of Lee (1996) describes /wi/ as sometimes [ɥi], [ø] or [y]. The canonical remains [y]; the variant does not assert one speaker-independent pronunciation.
- **C04 /h/ allophones:** Narrow research IPA now represents [ç] before selected high-front/glide nuclei and [x] before ㅜ; the previously implemented optional post-sonorant [ɦ] retains priority. Broad and phonemic IPA are unchanged. The narrow profile was versioned from v3 to v4. Evidence: Lee (1999), Illustrations of the IPA, for Seoul Korean. This is profile-scoped, not a general ㅎ deletion rule.
- **C06 release marking and C09 lexical length:** No change. Existing [p̚,t̚,k̚] output and source-attested lexical length remain. UGTPHON omissions are not enough to justify stripping these features.
- **C01/C07 liquids:** No blanket ɾ/l/ɭ/ʎ replacement. The remaining examples include different positions and possible morphology/prosody; the corpus does not establish a single safe environment. Further context/source adjudication is required.

The optional variants are exposed in both Native and Browser shared-Broad result contracts; canonical IPA and the legacy Browser default remain unchanged. New tests cover lenis/fortis negative controls, [ɥi], and narrow /h/ contexts. This is an algorithmic representation improvement, not an adjudicated accuracy claim.

### Correction to the initial C04 label

The earlier fragment heuristic called 45 operations across 37 occurrences an aspiration-notation mismatch because the grapheme aligner displayed fragments like h → kʰ. That label was misleading. The full IPA strings show the actual source forms are kx or kç, compared with Kozak Kim's kʰ. The exporter now identifies this as C12_aspirated_velar_coarticulation_profile and suppresses the false C04 label. It remains evidence-limited; no production kʰ rule has been changed.
