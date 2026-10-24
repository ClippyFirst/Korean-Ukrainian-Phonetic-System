# Korean engine error investigation — 2026-10-24

## Status

**DONE_VERIFIED for the coda-ㅇ and palatal-yod fixes and the complete paired benchmark audit; DONE_VERIFIED for Python R010 exact-form fixes and their post-fix benchmark; PARTIAL for browser parity of the newly added R010 licenses until the latest CI finishes.** The benchmark now retains the full occurrence-level native-vs-g2pk ledger instead of a capped mismatch sample. The open PR #297 is the current integration branch; it is not merged.

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

### B. Confirmed second defect: broad IPA retained /j/ after ㅈ/ㅉ/ㅊ before ㅕ

The full occurrence-level audit before this fix found 19 UGTPHON occurrences where g2pk exactly matched the normalized reference and native did not. Thirteen had the same one-character error: native rendered a palatal affricate followed by an extra [j], e.g. tɕʰjʌ instead of tɕʰʌ. The affected forms included 던져주다, 조져버리고, 졌으면, 책임져라, 무쳣다, 쳐버려가지고, 쳐먹은, 까졍, 쳐먹고, 쳐받어, 빠져, 헤어졋겟지, and 자빠졌네.

This is a confirmed renderer-boundary defect, not a g2pk-specific IPA advantage. The official National Institute of Korean Language source explicitly states Standard Pronunciation Rule 5, exception 1: verbal forms 져/쪄/쳐 are pronounced [저/쩌/처], and its explanation identifies the restriction on [j] immediately after these palatal affricates: [official rule](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002), [NIKL explanation](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=302312).

PR #299 is merged at f1267f700b2a7ff726765fc17b6d2fa093561dfb. The native renderer now absorbs /j/ in broad surface IPA only for ㅈ/ㅉ/ㅊ + ㅕ, while preserving the glide in phonemic output. Regression tests cover 져/쪄/쳐 and benchmark examples. In the revised broad-IPA profile, the paired native exact count increased from 1,397 to 1,410 (+13) and native CER fell from 9.3122% to 9.2060% on the same 2,655 scored occurrences.

### C. g2pk is not uniformly better

The complete paired audit now shows the specific remaining differences rather than a capped sample.

- On UGTPHON after the yod fix, only six occurrences were g2pk-only exact; two of them were the morphology-gated forms 닮다 and 넘게, and four were occurrences of 없는. The two R010 (§24) cases are now covered by exact full-form licenses on PR #297; after this patch, the latest report has only the four 없는 occurrences in this category.
- On SIGMORPHON, native has four native-only exact matches and no g2pk-only exact matches among the 997 shared scored occurrences:
  - 값어치: native ka.bʌ.tɕʰi matches the normalized reference; g2pk's kap̚.s͈ʌ.tɕʰi does not.
  - 놓치다: native not̚.tɕʰi.da matches the provided reference, while g2pk's no.tɕʰi.da does not. This item still needs independent phonetic adjudication because the reference convention itself may be questionable.
  - 많다: native preserves the length marker, which the paired reference also marks; g2pk omits it.
  - 맛없다: native's output matches the paired reference; g2pk's liaison differs.
- The SIGMORPHON paired exact delta is −0.4012 pp for g2pk-minus-native (95% CI −0.8024 to −0.1003), favoring native. Its CER difference crosses zero. Therefore the earlier UGTPHON-only g2pk lead must not be generalized to Korean pronunciation overall.

### D. Benchmark convention limits the meaning of exact match

UGTPHON is noisy user-generated text, not an independently adjudicated NIKL rule suite. Its IPA annotations include diacritics and conventions not identical to the project's broad IPA. The scorer ignores the declared broad-level diacritics, including retraction U+0320, but retains contrasts such as aspiration, fortis, vowel length, and unreleased stops.

The clearest remaining case is 없는, repeated in four corpus rows. The source-backed ClippyFirst lexicon records the NIKL-attested long vowel [엄ː는] as ʌːm.nɯn; the UGTPHON reference omits length. The four exact-match differences are therefore a reference/annotation convention mismatch, not evidence that the native engine should delete a sourced length contrast. Do not remove vowel length globally just to raise exact match.

### E. The current paired comparison is not fully independent

g2pk emits surface Hangul and both systems use the project's IPA segment renderer. The benchmark primarily compares the phonological surface-form decisions and their effect on the shared renderer; it does not independently validate the renderer or Ukrainian output. This is useful for finding structural differences but cannot establish that g2pk's IPA is universally more correct.

## 3. Paired measurements across fixes

### Historical coda-ㅇ comparison — older normalization profile

The pre-fix and post-fix runs below use the same older normalization profile and six-engine workflow contract. The post-fix run is [40090827524](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40090827524), artifact [12558762097](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40090827524/artifacts/12558762097).

| Measure | Pre-R002-fix run 40087193952 | Post-R002-fix run 40090827524 | Change |
|---|---:|---:|---:|
| Native exact matches on scored subset | 648 / 2,655 | 659 / 2,655 | +11 |
| Native exact-match rate | 24.4068% | 24.8211% | +0.4143 pp |
| Native CER | 17.0648% | 16.7439% | −0.3209 pp |
| g2pk exact matches on same paired subset | 669 / 2,655 | 669 / 2,655 | unchanged |

### Revised broad-IPA profile — same-profile fix progression

The newer normalization profile ignores selected narrow diacritics including U+0320, so its absolute scores are not comparable to the older-profile table above. Within the revised profile, these comparisons are like-for-like:

| Runtime state | Native exact matches / 2,655 | Exact rate | Native CER | Evidence |
|---|---:|---:|---:|---|
| Before R002 coda-ㅇ fix | 1,351 | 50.8851% | 9.6619% | run 40089295231 |
| After R002, before palatal-yod fix | 1,397 | 52.6177% | 9.3122% | run 40091582624 |
| After palatal-yod fix | 1,410 | 53.1073% | 9.2060% | run 40092004565 |
| After exact-form R010 licenses for 닮다 and 넘게 | 1,412 | 53.1827% | 9.1883% | run 40092327799 |

The yod fix added 13 exact matches and reduced CER by 0.1062 pp on the revised profile. The R010 exact-form licenses added two further exact matches and reduced CER by about 0.0177 pp. These are measured improvements, not projected values.

Latest complete artifact: [run 40092327799](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092327799), [artifact 12559731356](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092327799/artifacts/12559731356). The complete pairwise ledger has 1,412 both-exact, 1,239 both-not-exact, 4 g2pk-only exact, 19 native-abstained/g2pk-exact, and 29 native-abstained/g2pk-not-exact UGTPHON occurrences.## 4. Latest post-fix benchmark results and interpretation

On UGTPHON, ClippyFirst native scores 1,412/2,655 (53.1827% exact, 9.1883% CER, 98.2242% coverage). g2pk scores 1,416/2,655 exact on the shared scored subset (53.3333%) and 9.2414% CER on that same subset. The paired exact-rate delta is +0.1506 pp for g2pk (95% CI +0.0351 to +0.3243); paired CER delta is +0.0531 pp (95% CI −0.0139 to +0.1302), which crosses zero. All four remaining g2pk-only exact occurrences are repeated references to 없는 without the long-vowel marker that the NIKL source-backed native lexicon preserves.

On SIGMORPHON, native scores 357/997 (35.8074%) versus g2pk 353/997 (35.4062%) on the shared scored subset. The g2pk-minus-native exact delta is −0.4012 pp (95% CI −0.8024 to −0.1003), favoring native; the CER delta crosses zero. This dataset is a public paired-file diagnostic, not a leaderboard reproduction, because the pinned file contents differ from the upstream README's description.

The benchmark evaluates Korean IPA only. It does not measure IPA-to-Ukrainian adaptation or Ukrainian output quality. The shared IPA renderer also means the g2pk comparison is not fully independent end-to-end evidence.## 5. Required next verification

1. **DONE_VERIFIED** — complete occurrence-level native-vs-g2pk ledger emitted in schema v4 and inspected for both pinned datasets.
2. **DONE_VERIFIED** — R002 coda-ㅇ fix, broad-IPA yod absorption, and the Python R010 exact-form licenses for 닮다 and 넘게 have passing Python regressions and measured post-fix benchmark improvements.
3. **PARTIAL** — the matching browser-engine R010 licenses and tests are now added on PR #297; acceptance requires the latest browser, Python, and parity CI to pass on the same head.
4. **TODO** — review the remaining 48 abstentions against NIKL and morphology evidence. Prioritize R002 liaison/neutralization and R003 ㅎ-coda deletion; never copy external outputs directly into production rules.
5. **TODO** — build an independently adjudicated NIKL holdout stratified by rule, environment, and rule interactions, with a separate held-out split.
6. **BLOCKED** — independently adjudicated Korean IPA → Ukrainian practical-output gold corpus is not available; keep target-rendering evaluation separate.## Task ledger

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Diagnose and fix coda-ㅇ loss | DONE_VERIFIED | PR #298 merged; same-profile benchmark improvement and regression tests. |
| Diagnose and fix broad-IPA palatal-yod retention | DONE_VERIFIED | PR #299 merged; 13 exact-match gains on the revised profile and NIKL Rule 5 evidence. |
| Build full paired native-vs-g2pk audit | DONE_VERIFIED | Schema-v4 artifact 12559731356 preserves all occurrences; category totals reconcile to 2,703 UGTPHON and 999 SIGMORPHON entries. |
| Fix R010 exact-form gaps for 닮다 and 넘게 | DONE_VERIFIED for Python benchmark; browser parity pending latest CI | Two additional exact matches and CER improvement; strict full-form licenses only. |
| Explain all remaining native-vs-g2pk differences | PARTIAL | Four g2pk-only exact occurrences are reference-length mismatch for 없는; 48 native abstentions still require adjudication. |
| Normative acceptance benchmark | TODO | Independently reviewed IPA gold with NIKL article/environment provenance. |
| Ukrainian output accuracy | BLOCKED | No independently adjudicated Korean-to-Ukrainian gold corpus in the current benchmark. |
