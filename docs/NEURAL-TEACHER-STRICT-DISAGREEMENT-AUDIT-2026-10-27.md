# Neural-teacher vs ClippyFirst Strict: first error-correlation audit (2026-10-27)

## Status and scope

**Status: PARTIAL / research-only.** This is a diagnostic of the reproducible three-seed SIGMORPHON development portfolio and the paired native-Strict outputs. It is not an independently adjudicated accuracy comparison, not a normative pronunciation gold set, and not a production-rule change.

- Repository branch: `research/strict-teacher-guided-rule-mining-2026-10-26`; portfolio code commit at training: `2a435c8574c924124e840bb83df5b2cdee2b9a0a`.
- Portfolio workflow: [40470223568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470223568).
- Reproducible artifact: [artifact 12717644093](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470223568/artifacts/12717644093), ZIP SHA-256 `f5c77a85e92238fcbe13729b1c2a78c1277e933e5f2d982457e79d13d2dc2fef`.
- Dataset: pinned SIGMORPHON 2021 medium Korean; the 1,000-row dev split was used both for model selection and this diagnostic. **Do not treat these numbers as held-out generalization.**
- All three runs use the same bidirectional-GRU encoder + dot-attention GRU decoder, with different random seeds. This is a seed-robustness check, not an architecture bake-off.
- Target is the corpus's tokenized roughly-phonemic IPA. ClippyFirst emits its own broad IPA convention, and no independently reviewed adapter currently reconciles them. Existing pair files therefore intentionally compute **no Strict-vs-teacher exact match, CER, WER, or ranking**.

## 1. What the three neural runs actually tell us

| Seed | Exact dev forms | Token error rate | Compact-char error rate | Length-mark-only mismatches | Other token/feature mismatches |
|---|---:|---:|---:|---:|---:|
| 20261026 | 602/1,000 (60.2%) | 12.7169% | 12.1814% | 107 | 291 |
| 20261027 | 592/1,000 (59.2%) | 13.1091% | 11.9876% | 113 | 295 |
| 20261028 | 584/1,000 (58.4%) | **12.3246%** | **11.4352%** | 116 | 300 |

Selection by the predeclared token-error-rate criterion selects seed 20261028, but seed 20261026 has the highest exact-form rate. That is a real metric trade-off, not a reason to discard either run. Keep all three checkpoints and their histories.

### Seed agreement is informative but not a rule oracle

Across the same 1,000 dev forms:
- all three seeds match the corpus reference on 455 forms;
- none match on 275 forms;
- exactly two match on 143 forms;
- exactly one matches on 127 forms.
- Pairwise exact prediction agreement between seeds is only 596/1,000, 633/1,000, and 609/1,000 respectively.

Interpretation: 455 unanimous-correct examples are the best initial candidate pool for studying recurring correspondences, while the 275 unanimous-wrong cases are valuable hard cases. Neither pool is automatically truth: the reference itself has a particular transcription convention, the dev set selected the checkpoints, and agreement can reproduce shared model bias. The 270 forms with mixed correctness are especially useful for identifying context-sensitive or weakly learned patterns.

## 2. Error families visible in the neural teacher

### A. Length marks are a large, separable discrepancy class

Depending on seed, 107–116/1,000 examples differ only by `ː`/`ˑ` marks. In seed 20261026, 80 length-mark-only cases underpredict the reference's mark count, versus 27 that overpredict it (the other cases have equal counts but different locations). Seed 20261027 has 72 under- and 41 over-predictions; seed 20261028 has 80 under- and 36 over-predictions.

This is a repeatable *teacher/reference mismatch*, not yet evidence that ClippyFirst is wrong. Length marking is part of the SIGMORPHON target representation and may not be part of the engine's intended broad-IPA contract. **Do not add vowel-length rules or length marks to the runtime on this evidence alone.** First decide and document whether ClippyFirst's Korean IPA contract preserves lexical/historical length, then verify the corpus convention and adjudicate examples independently.

### B. Most remaining teacher errors are not a single systematic feature

The three runs report 291, 295, and 300 non-length-only mismatch cases. Examples in the saved error samples include consonant/feature substitutions, deletions, insertions, and sequences that diverge substantially (e.g. `가까이`, `각주구검`, `감사합니다`, `관악산`). The teacher can produce implausible sequences on some forms, which is consistent with a small character-to-token sequence model having no explicit Korean syllable/morpheme structure. Such outputs are **hypothesis-generation clues**, not candidate rules.

### C. Longer inputs correlate with lower teacher exact match, but sparse bins are not reliable

In seed 20261026, exact match is 66.1% for 2-Hangul-syllable inputs with a coda and 62.3% without a coda; for 3 syllables with a coda it is 50.0%; for 4 syllables with a coda it is 41.5%. The 5–8-syllable bins contain only 1–23 examples each, so their rates are too unstable to generalize. This points toward adding structural segmentation and explicit morphophonological features to the *research analysis*, not toward a blanket “long words” production rule. Coda presence is a coarse shape feature and is not causal evidence by itself.

## 3. What the paired Strict run exposes directly

The pair builder aligned **994/1,000** inputs and deliberately excluded six inputs because native Strict marked the pronunciation diagnostic-only/unresolved. This is a meaningful coverage boundary, not six confirmed wrong outputs:

| Input | Guarded context | Current reason for abstention |
|---|---|---|
| 가없이 | 없>이 | R002: liaison/neutralization requires exact morpheme evidence |
| 늙은이 | 늙>은 | R002: liaison/neutralization requires exact morpheme evidence |
| 많아지다 | 많>아 | R003: ㅎ-coda deletion requires an ending/suffix license |
| 말없이 | 없>이 | R002: liaison/neutralization requires exact morpheme evidence |
| 붉은기 | 붉>은 | R002: liaison/neutralization requires exact morpheme evidence |
| 수없이 | 없>이 | R002: liaison/neutralization requires exact morpheme evidence |

This reveals two high-value engineering questions:
1. **Morphological segmentation/lexical licensing:** the engine currently refuses to infer a morpheme boundary or apply R002 solely from a surface substring. This is conservative and prevents false positives, but it leaves productive compounds/derivations unresolved when a trusted analysis could license the rule.
2. **ㅎ-coda deletion licensing:** R003 needs the exact ending/suffix class; the engine does not yet have sufficient verified analysis for `많아지다`. Do not generalize from this one form.

These are confirmed *coverage gaps* in this dev slice; they are not evidence that the engine should guess. Next, add source-backed morphological analyses and case-level tests for the six forms, with explicit resolved/unresolved outcomes. Keep abstention until evidence is sufficient.

## 4. Why we cannot yet say “the neural model proves Strict is wrong”

The existing pair file explicitly records:
- Strict's output as broad IPA, while SIGMORPHON's target is tokenized roughly-phonemic IPA;
- no reviewed adapter from the latter into ClippyFirst's IPA conventions;
- no accuracy metric across the two outputs;
- no Ukrainian orthography derived from the teacher.

For example, a tokenized target such as `k a̠ ɡ o̞ k̚` and Strict's syllabified output `ka.ɡok̚` differ in segmentation and may differ in vowel/consonant conventions. A naive string diff would count representation choices as pronunciation errors. Likewise, teacher/reference length marks cannot be silently interpreted as mandatory ClippyFirst broad-IPA length.

Therefore this report separates:
- **Observed:** teacher/reference error statistics; six explicit Strict abstentions; source-shape associations.
- **Plausible hypotheses:** weak handling of morphology, coda-conditioned alternations, consonant assimilation/fortition, and long multi-syllable sequences may explain some teacher/engine divergences.
- **Not established:** the direction of error for any Strict-vs-teacher mismatch, a Strict accuracy score on SIGMORPHON, or a rule that is safe to integrate.

## 5. Recommended next research batch (in priority order)

1. **IPA contract and adapter review (blocking comparison).** Specify which symbols, length distinctions, syllable boundaries, aspiration/fortis features, and allophones are retained in ClippyFirst broad IPA versus SIGMORPHON target IPA. Build a versioned adapter only after review; preserve raw strings and provenance.
2. **Case-level triage on the 994 aligned forms.** Once the adapter is reviewed, classify disagreements as (a) representation-only, (b) teacher wrong, (c) Strict wrong, (d) both uncertain, or (e) unresolved because lexical/morphological context is absent. Use a blind human-reviewed sample before scoring.
3. **Investigate the six abstentions first.** Source evidence and morphological segmentation should decide whether R002/R003 can be licensed. Add positive and negative minimal pairs, not just these six positives.
4. **Mine stable teacher hypotheses.** Start with the 455 three-seed unanimous-correct dev forms, then look for repeated, context-defined correspondences and contrast them with the 275 unanimous-wrong forms. Record confidence and provenance per candidate; do not promote on model consensus alone.
5. **Targeted regression and independent adjudication.** Each candidate rule needs an authoritative rule environment, reviewed IPA, counterexamples, and regression tests. Keep all dev-derived results marked as development evidence.
6. **Freeze choices before any sealed test evaluation.** Do not inspect or select rules using the test partition. After the adapter and rules are frozen, evaluate once with a reproducible test-only path and report the different corpus/target scope separately.

## Acceptance criteria for moving a candidate into the deterministic engine

- exact rule environment and scope documented from an authoritative source;
- morphology/lexical prerequisites explicit, including when to abstain;
- source form, reviewed IPA, target adaptation, and provenance linked in a stable case record;
- at least one positive case and meaningful negative/minimal-pair regressions;
- no hidden dependence on teacher weights at runtime;
- Python/browser parity and all existing regression suites pass;
- improvement measured on a compatible, non-leaked evaluation set without worsening known cases.

## Evidence and artifacts

All seed-specific predictions, checkpoint weights, training histories, corpus manifest, error analyses, teacher/Strict paired JSONL, and hashes are retained in artifact 12717644093. The artifact contains train/dev only; the training workflow intentionally does not export or load test rows. Re-run the workflow rather than manually editing its derived metrics.

**Conclusion:** The current strongest actionable findings are (1) a sizeable teacher-only length-mark convention mismatch that must not be confused with engine error, (2) teacher instability on a substantial subset of forms, and (3) six explicit native Strict abstentions clustered around two morphology-licensed rules. The first next step is not bulk rule insertion; it is a reviewed IPA mapping plus focused morphological evidence and tests.
