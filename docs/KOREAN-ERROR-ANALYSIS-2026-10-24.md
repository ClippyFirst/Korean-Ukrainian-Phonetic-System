# Korean engine error investigation — 2026-10-24

## Status

**PARTIAL — one reproducible implementation defect identified and patched on branch `fix/korean-ng-coda-liaison-2026-10-24`; CI and post-fix benchmark confirmation pending.** Do not treat the old benchmark scores as post-fix results.

Baseline diagnostic sources:
- [Multi-engine benchmark run 40089295231](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40089295231)
- [Artifact 12558044694](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40089295231/artifacts/12558044694)
- [Current benchmark report](MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md)
- Rule implementation: `src/korean_ukrainian/rules.py`, R002
- IPA renderer: `src/korean_ukrainian/ipa.py`

## 1. Confirmed defect: coda ㅇ is incorrectly resyllabified and then becomes silent

### Mechanism

The R002 liaison loop accepts a preceding coda whenever the next syllable has onset ㅇ. For a coda such as ㄴ, ㄹ, or ㅁ, moving it into the next onset can represent ordinary liaison. But coda ㅇ represents the velar nasal /ŋ/. The code's generic branch set `b.onset = a.coda` and `a.coda = ""`, which changed the following onset to Hangul ㅇ. In the IPA renderer, `onset_ipa()` correctly emits no consonant for onset ㅇ. Thus the /ŋ/ disappeared.

This is an implementation error, not a need for a lexical exception: it follows from conflating coda ㅇ (/ŋ/) with onset ㅇ (zero onset).

### Observed benchmark evidence

The diagnostic artifact's occurrence-level mismatch sample contains these examples:

| Word | Gold after declared broad-level normalization | Native before fix | g2pk 0.9.4 + same project renderer | Interpretation |
|---|---|---|---|---|
| 공인 | `koŋin` | `ko.in` | `koŋ.in` | native loses /ŋ/ |
| 양아치 | `jaŋatɕʰi` | `ja.a.tɕʰi` | `jaŋ.a.tɕʰi` | native loses /ŋ/ |
| 동요 | `toŋjo` | `to.jo` | `toŋ.jo` | native loses /ŋ/ |
| 동이 | `toŋi` | `to.i` | `toŋ.i` | native loses /ŋ/ |
| 심장은 | `ɕimdʑaŋɯn` | `sim.dʑa.ɯn` | `sim.dʑaŋ.ɯn` | native loses /ŋ/ |

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

## 3. Baseline numbers and interpretation

Before this fix, on UGTPHON:
- ClippyFirst native: 2,655/2,703 scored, 98.2242% coverage, 50.8851% exact match, CER 9.6619%.
- g2pk 0.9.4 + project renderer: 2,703/2,703 scored, 100% coverage, 53.0892% exact match, CER 9.2285%.
- On the 2,655 shared scored occurrences, g2pk's exact-rate advantage was +2.4482 percentage points (95% row-cluster bootstrap interval +1.2378 to +4.2219 pp); its CER delta was −0.4205 pp (−0.6625 to −0.2298 pp).

These are **pre-fix baseline results**. It is not yet known how many of the 65 net extra exact matches for g2pk on the shared subset are attributable to the coda-ㅇ defect. The artifact's diagnostic mismatch sample is capped at 250 rows, so it cannot support a full-corpus causal count.

## 4. Required next verification

1. Run Python unit/regression tests on the patched branch; require the new tests to pass.
2. Rerun the multi-engine workflow on the exact patched commit and inspect the new JSON artifact.
3. Report the exact number of corrected /ŋ/-loss occurrences and revised paired deltas. Do not infer the score gain from the five examples above.
4. Inspect the full paired prediction set, not only the capped mismatch sample, and categorize remaining errors by rule ID / phonological environment.
5. Build an independently adjudicated NIKL-based holdout, stratified by rule and interaction, before using exact-match scores as a release-quality claim.
6. Keep the Ukrainian target-rendering evaluation separate; the current benchmark scores IPA, not Ukrainian practical orthography.

## Task ledger

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Diagnose coda-ㅇ loss | DONE_VERIFIED | Source path in R002 and multiple concrete benchmark mismatches agree. |
| Patch R002 and add regressions | PARTIAL | Code and tests committed on investigation branch; CI must pass. |
| Quantify full-corpus effect | TODO | Exact-head rerun and occurrence-level output after patch. |
| Explain all remaining native-vs-g2pk differences | PARTIAL | Several mechanisms and caveats established; full paired predictions and adjudication still required. |
| Normative acceptance benchmark | TODO | Independently reviewed IPA gold with NIKL article/environment provenance. |
| Ukrainian output accuracy | BLOCKED | No independently adjudicated Korean-to-Ukrainian gold corpus in the current benchmark. |
