# Korean engine error investigation — 2026-10-24

## Status

**DONE_VERIFIED for the targeted coda-ㅇ fix and core CI; broader error taxonomy remains PARTIAL.** The patched head passed the Python regression/data-integrity job, browser tests/build, and the pinned multi-engine benchmark. The older-profile post-fix benchmark is run 40090827524; do not compare its scores directly with the revised-normalization results on open PR #297.

Baseline diagnostic sources:
- [Multi-engine benchmark run 40089295231](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40089295231)
- [Artifact 12558044694](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40089295231/artifacts/12558044694)
- [Revised benchmark report on open PR #297 branch](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/blob/bench/ko-eight-suite-and-abstention-audit-2026-10-24/docs/MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md)
- Rule implementation: `src/korean_ukrainian/rules.py`, R002
- IPA renderer: `src/korean_ukrainian/ipa.py`

## 1. Confirmed defect: coda ㅇ is incorrectly resyllabified and then becomes silent

### Mechanism

The R002 liaison loop accepts a preceding coda whenever the next syllable has onset ㅇ. For a coda such as ㄴ, ㄹ, or ㅁ, moving it into the next onset can represent ordinary liaison. But coda ㅇ represents the velar nasal /ŋ/. The code's generic branch set `b.onset = a.coda` and `a.coda = ""`, which changed the following onset to Hangul ㅇ. In the IPA renderer, `onset_ipa()` correctly emits no consonant for onset ㅇ. Thus the /ŋ/ disappeared.

This is an implementation error, not a need for a lexical exception: it follows from conflating coda ㅇ (/ŋ/) with onset ㅇ (zero onset).

### Observed benchmark evidence

The two diagnostic artifacts' capped occurrence-level mismatch samples contain these examples. The first three are from UGTPHON; the last two are from the separate SIGMORPHON paired-file diagnostic:

| Dataset | Word | Gold after declared broad-level normalization | Native before fix | g2pk 0.9.4 + same project renderer | Interpretation |
|---|---|---|---|---|---|
| UGTPHON | 공인 | `koŋin` | `ko.in` | `koŋ.in` | native loses /ŋ/; g2pk matches |
| UGTPHON | 양아치 | `jaŋatɕʰi` | `ja.a.tɕʰi` | `jaŋ.a.tɕʰi` | native loses /ŋ/; g2pk matches |
| UGTPHON | 심장은 | `ɕimdʑaŋɯn` | `sim.dʑa.ɯn` | `sim.dʑaŋ.ɯn` | native loses /ŋ/; neither exactly matches the reference |
| SIGMORPHON | 놀이공원 | `noɾiɡoŋwʌn` | `no.ɾi.ɡo.wʌn` | `no.ɾi.ɡoŋ.wʌn` | native loses /ŋ/; g2pk matches |
| SIGMORPHON | 동요 | `toŋjo` | `to.jo` | `toŋ.jo` | native loses /ŋ/; g2pk matches |
| SIGMORPHON | 동이 | `toŋi` | `to.i` | `toŋ.i` | native loses /ŋ/; g2pk matches |

The displayed gold strings are normalized forms used by the diagnostic scorer, not an independent normative IPA adjudication. The repeated error pattern and code path establish the implementation defect even though UGTPHON is not a normative gold set.

### Correction

R002 now skips resyllabification when the preceding coda is ㅇ, preserving it in the preceding syllable. Regression tests cover the direct rule transition and full broad-IPA outputs for 공인, 양아치, 동요, and 동이. The patch is not considered verified until repository CI passes and the multi-engine benchmark is rerun on the patched head.

## 2. Other error sources established by current evidence

### A. Morphophonological abstentions are a separate coverage issue

The baseline strict native engine abstained on 48 of 2,703 UGTPHON token occurrences (47 unique words). Recorded unresolved-context labels were:
- R002 liaison / neutralization requiring exact morpheme evidence: 25;
- R003 ㅎ-coda deletion requiring an ending/suffix license: 20;
- R007 palatalization requiring formal-morpheme evidence: 2;
- R004 complex-coda + ㅎ aspiration requiring morphophonemic evidence: 1;
- one IPA-adjudication gap.

There are 49 labels for 48 occurrences because one occurrence has two unresolved contexts. Some abstained words are pronounced transparently in the corpus context, and g2pk matches the corpus reference for some (e.g. 되었어, 찢었으면, 붙어야, 있었). This suggests a conservative coverage limitation caused by requiring exact-form/morpheme licenses without a complete production morphology layer. It does **not** justify indiscriminately adding lexical licenses from noisy corpus labels. Each candidate needs official NIKL rule-environment verification or independently reviewed morphology evidence.

### B. g2pk is not uniformly better

On the separate SIGMORPHON public paired lexical file, the capped diagnostic sample contains cases where ClippyFirst matches and g2pk does not:
- 값어치: native `ka.bʌ.tɕʰi` matches the normalized reference; g2pk's `kap̚.s͈ʌ.tɕʰi` does not. The project already has a source-backed NIKL lexical override for this form.
- 놓치다: native preserves `t̚` in `not̚.tɕʰi.da`; g2pk's rendered `no.tɕʰi.da` does not match the reference's unreleased-stop marker.

Conversely, the sample includes g2pk-only matches for words affected by the coda-ㅇ defect. These examples show why the correct response is targeted, evidence-backed fixes rather than replacing native rules wholesale with g2pk behavior.

### C. Benchmark convention limits the meaning of exact match

UGTPHON is noisy user-generated text, not an independently adjudicated NIKL rule suite. Its IPA annotations include diacritics and conventions not identical to the project's broad IPA. The scorer removes only declared diacritics and separators; it retains contrasts such as aspiration, fortis, vowel length, and unreleased stops. Some score differences therefore reflect reference conventions or real phonetic distinctions, and a non-exact score alone does not diagnose which. A normative challenge set with exact NIKL article/environment provenance and independently reviewed IPA is still needed.

### D. The current paired comparison is not fully independent

g2pk emits surface Hangul and both systems use the project's IPA segment renderer. The benchmark primarily compares the phonological surface-form decisions and their effect on the shared renderer; it does not independently validate the renderer or Ukrainian output. This is useful for finding structural differences but cannot establish that g2pk's IPA is universally more correct.

## 3. Paired pre-/post-fix measurement

The pre-fix and post-fix runs below use the same older normalization profile and six-engine workflow contract, so this comparison is like-for-like. The post-fix run is [40090827524](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40090827524), artifact [12558762097](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40090827524/artifacts/12558762097). Python regression/data integrity and browser tests/build passed in [system verification run 40090827438](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40090827438).

| Measure (older normalization profile) | Pre-fix run 40087193952 | Post-fix run 40090827524 | Change |
|---|---:|---:|---:|
| Native exact matches on scored subset | 648 / 2,655 | 659 / 2,655 | **+11 exact matches** |
| Native exact-match rate | 24.4068% | 24.8211% | **+0.4143 pp** |
| Native CER | 17.0648% | 16.7439% | **−0.3209 pp** |
| g2pk exact matches on same paired subset | 669 / 2,655 | 669 / 2,655 | unchanged |
| g2pk-minus-native exact-rate delta | +0.7909 pp | +0.3766 pp | advantage reduced by 0.4143 pp |
| g2pk-minus-native CER delta | −0.3819 pp | −0.0610 pp | gap reduced by 0.3209 pp |

Post-fix paired row-cluster bootstrap 95% intervals are +0.1527 to +0.6505 percentage points for g2pk-minus-native exact match, and −0.1457 to +0.0284 pp for the CER delta. Thus the exact-match advantage remains detectable under this diagnostic scoring contract, but the CER difference no longer clearly excludes zero. The fix removed about half of the baseline exact-match gap on the common scored set.

Because R002 coda-ㅇ handling is the only runtime change between these heads, the 11 additional exact matches and CER improvement are strong aggregate evidence that the defect materially affected the benchmark. However, the artifact still retains only a capped 250-row mismatch sample, so it does not yet count every corrected /ŋ/-loss occurrence or fully classify all remaining errors. The exact post-fix scores above use the older normalization profile; the revised broad-IPA profile on PR #297 reports a different absolute score scale and must be compared only against a matching run on that same profile.

## 4. Baseline numbers and interpretation

Before this fix, on UGTPHON:
- ClippyFirst native: 2,655/2,703 scored, 98.2242% coverage, 50.8851% exact match, CER 9.6619%.
- g2pk 0.9.4 + project renderer: 2,703/2,703 scored, 100% coverage, 53.0892% exact match, CER 9.2285%.
- On the 2,655 shared scored occurrences, g2pk's exact-rate advantage was +2.4482 percentage points (95% row-cluster bootstrap interval +1.2378 to +4.2219 pp); its CER delta was −0.4205 pp (−0.6625 to −0.2298 pp).

These are **pre-fix baseline results**. It is not yet known how many of the 65 net extra exact matches for g2pk on the shared subset are attributable to the coda-ㅇ defect. The artifact's diagnostic mismatch sample is capped at 250 rows, so it cannot support a full-corpus causal count.

## 4. Required next verification

1. **DONE_VERIFIED** — Python regression/data-integrity tests passed; browser tests and build passed; pinned multi-engine and paired UGTPHON benchmarks completed on the patched head.
2. **PARTIAL** — aggregate pre-/post-fix effect is quantified (+11 exact matches; native CER −0.3209 pp on the older profile), but the capped mismatch sample prevents counting all corrected /ŋ/-loss cases.
3. **TODO** — extend the benchmark artifact to retain complete occurrence-level predictions (or a complete paired error ledger) and classify every native/g2pk disagreement by rule ID / phonological environment.
4. **TODO** — rerun the revised broad-IPA profile from PR #297 on the patched runtime after that benchmark branch is reconciled; compare only like-for-like normalization profiles.
5. **TODO** — build an independently adjudicated NIKL-based holdout, stratified by rule and interaction, before using exact-match scores as a release-quality claim.
6. **BLOCKED** — independently adjudicated Korean IPA → Ukrainian practical-output gold corpus is not available; keep target-rendering evaluation separate.

## Task ledger

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Diagnose coda-ㅇ loss | DONE_VERIFIED | Source path in R002 and multiple concrete benchmark mismatches agree. |
| Patch R002 and add regressions | DONE_VERIFIED | PR #298 head `7f2bafc90cb85c4fff76697a38687d14d9d4e101`; Python regression/data-integrity and browser test/build jobs passed; targeted multi-engine benchmark completed. |
| Quantify full-corpus effect | PARTIAL | Same-profile aggregate pre/post comparison: +11 exact matches, native CER −0.3209 pp. Full per-occurrence corrected-case count remains unavailable because artifact mismatch sample is capped at 250. |
| Explain all remaining native-vs-g2pk differences | PARTIAL | Several mechanisms and caveats established; full paired predictions and adjudication still required. |
| Normative acceptance benchmark | TODO | Independently reviewed IPA gold with NIKL article/environment provenance. |
| Ukrainian output accuracy | BLOCKED | No independently adjudicated Korean-to-Ukrainian gold corpus in the current benchmark. |
