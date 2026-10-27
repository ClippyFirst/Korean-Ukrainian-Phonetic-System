# ClippyFirst v3: training readiness and honest benchmark protocol

**Status: research design, not a trained model.** This is the 2026-10-26 decision record; it does not claim a score improvement.

## Decision

Pursue v3 as a **hybrid, trainable residual engine**, not as an opaque end-to-end replacement of the evidence-backed phonology pipeline:

1. source orthography and structural analysis;
2. source-language phonology, with explicit contextual/morphological features;
3. inspectable IPA output as the adapter boundary;
4. Ukrainian target adaptation from IPA;
5. practical Ukrainian orthography.

A learned component may propose or rank unresolved source-phonology analyses, but must expose confidence and abstain when unsupported. It must not bypass IPA or silently derive Ukrainian output directly from Hangul. Source-backed deterministic rules remain authoritative where their environments are established.

## What current data can teach

The repository contains about 644 rows in its lexical pronunciation table, smaller additions, rule tables, IPA realizations, target overrides, and external diagnostic benchmarks. But IPA candidates are not automatically independent IPA gold. Source-attested Hangul surface notation, project-derived IPA, and model-selected/provisional Ukrainian output are different label types.

The frozen 24-form holdout at data/korean/benchmarks/ipa-holdout-24-manifest.json explicitly prohibits tuning and still has pending independent IPA annotations. It must remain untouched during training and normalization/rule tuning. UGTPHON and SIGMORPHON test splits are evaluation-only. Training on their test rows and reporting scores on those rows would be leakage, not generalization.

The new script scripts/audit_v3_training_readiness.py inventories rows, duplicates, holdout overlap, and explicit adjudication markers. Its refusal to declare supervised IPA training ready is intentional. Run:

```sh
python scripts/audit_v3_training_readiness.py --output artifacts/v3-training-readiness.json
python -m pytest tests/test_v3_training_readiness.py -q
```

## Why not train on every current label yet

- There is no sufficiently sized independently adjudicated IPA gold split identified by the current data contract.
- Some IPA candidates are project-derived from Hangul readings; treating them as gold would teach the model the current engine's assumptions and then falsely validate it against itself.
- Ukrainian target statuses include provisional/model-selected decisions, not an independently reviewed target gold corpus.
- The frozen holdout has inputs but no final IPA gold. Its 24 items are blind-evaluation inputs only after two independent broad-IPA annotations and adjudication.
- A small neural model trained on a few hundred noisy labels may memorize forms rather than learn Korean morphophonology. It may be a useful experiment, but no 80–90% result can be promised from current evidence.

## Benchmark scorecard for v3

Keep full-corpus exact match, CER, coverage, abstentions, runtime errors, and confidence intervals unchanged. Report separate tracks rather than one blended percentage:

| Track | Measures | Required evidence |
|---|---|---|
| A. Full external IPA diagnostic | Generalization on unchanged UGTPHON and SIGMORPHON test sets | Pinned data/engine versions; no test training; paired per-occurrence deltas |
| B. Frozen independent IPA holdout | Accuracy on unseen source-backed standard-pronunciation forms | Two independent IPA annotations, adjudication, locked manifest |
| C. Rule/environment challenge | Accuracy by source-backed phonological rule and interaction, including negative controls | Normative source per item; balanced cases; no train/test overlap |
| D. IPA-to-Ukrainian renderer | Ukrainian practical target quality, separate from Korean G2P | Independently reviewed Ukrainian targets and explicit variants |
| E. End-to-end parity and abstention | Python/browser agreement, supported-input coverage, fail-closed behavior | Regression tests, traceable IPA, no silent fallback |

An 80–90% figure is meaningful only when the track, denominator, coverage, sample size, label authority, and confidence interval are shown. A curated rule challenge may legitimately reach that range before broad-corpus exact match does, but it must never be presented as 80–90% accuracy on general Korean.

## Training experiment acceptance gates

1. Audit each candidate label's source, type, confidence, variant status, license, and independence from the current engine.
2. Split by lexical family/lemma and source/document where possible, not random duplicate rows; freeze test IDs before experiments.
3. Independently adjudicate broad IPA for representative train/dev/test data. Hangul surface readings are evidence, not IPA labels.
4. Compare current ClippyFirst, deterministic-only ablation, morphology-aware deterministic engine, and learned residual model on the same frozen examples. g2pK remains an allowed comparator, not the gold authority.
5. Preserve strict primary exact match and CER; also report coverage, abstention, error taxonomy, rule strata, paired bootstrap intervals, and Ukrainian-target metrics only on separate target gold.
6. Accept v3 only if it improves the locked independent holdout and at least one external corpus without material regression on other strata, increasing unsupported guesses, or an irreproducible training recipe.
7. Do not delete hard cases, normalize away meaningful IPA distinctions, move test items into training, or headline a curated subset as broad accuracy.

## Current benchmark and blocker

Latest g2pK-inclusive full diagnostic run on PR #336 is [run 40238222133](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40238222133), head ff14ec72e3167d9268f1348f399abb155098caee. The multi-engine job completed successfully; inspect the artifact before claiming updated scores. Previously verified ClippyFirst exact match was 53.0022% on UGTPHON and 35.8074% on SIGMORPHON, with CER 9.1697% and 14.7037%. The s/ɕ aspiration sensitivity profile is diagnostic only, not a replacement for primary scores.

**Next blocker:** independently adjudicated IPA train/dev/test data and a separate Ukrainian target gold set. Until then, supervised IPA model training is not evidence-ready; run the data audit and continue source-backed deterministic repairs in parallel.
