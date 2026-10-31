---
name: phonetic-engineering
description: Use when changing, testing, benchmarking, reviewing, or researching the Korean-to-IPA-to-Ukrainian pipeline, RR/Hanja side layers, or Korean G2P engines; especially for adversarial sentence tests and engine comparisons.
---

# Phonetic Engineering and Adversarial Benchmarking

## Mission

Improve end-to-end behavior without confusing a plausible output with a verified pronunciation. Use adversarial inputs to expose failure modes, independent evidence to establish expected results, and reproducible comparisons to select engines.

This skill complements the existing NIKL evidence-audit, norm-crawler, and rule-coverage skills. Those remain authoritative for official Korean evidence and rule inventory. Do not create a second source register, rule matrix, or benchmark ledger.

## Architecture contract

Preserve this pipeline:

source Hangul and original input
→ structural and (where supported) morphological analysis
→ Korean surface phonology
→ IPA or a typed unresolved/partial result
→ Ukrainian target adaptation
→ Ukrainian practical orthography.

The Ukrainian adapter must consume the IPA or explicitly typed phonetic result. Never add a parallel direct Hangul-to-Ukrainian route.

Keep source orthography, surface pronunciation, broad IPA, narrow/research-only IPA, IPA-to-Ukrainian adaptation, RR-to-Ukrainian rendering, Hanja annotation, and unresolved analyses distinct. RR and Hanja are side layers and must not silently change the core pronunciation path. Preserve original input, spacing, punctuation, mixed-script spans, and unknown material.

## Evidence and expected-output policy

Every expected linguistic output must declare its origin:
1. Direct official attestation.
2. Official rule derivation with the exact rule and environment recorded.
3. Dictionary attestation for the exact lexical item, sense, and part of speech.
4. Independently adjudicated expert IPA.
5. External corpus annotation, with conventions and limitations stated.
6. Generated adversarial stimulus with no gold pronunciation.

Never upgrade corpus annotation or generated stimulus into normative truth. Agreement among G2P engines is differential evidence, not independent adjudication. Do not infer gold IPA or Ukrainian forms from the engine being evaluated, a language model, or majority vote.

If evidence is insufficient, assert a typed unresolved/partial status and reason. Never invent an expected output to make a test green.

## Adversarial test design

For each material rule or pipeline boundary, build a balanced family where evidence permits:
- canonical positive;
- minimal or near-minimal contrast;
- negative control;
- interacting rules where order matters;
- morphology-sensitive contrast;
- phrase-boundary contrast;
- long natural sentence with several interacting phenomena;
- mixed-input case with Latin text, digits, punctuation, whitespace, emoji, or other scripts;
- uncertainty case: homograph, unknown word, missing context, malformed or unsupported input, or competing analyses.

Consider Korean coda and complex-coda neutralization, liaison, nasalization, liquid assimilation, fortition, palatalization, ㅎ aspiration/deletion, ㄴ insertion, 사이시옷, phrase-boundary effects, morphology-sensitive endings/particles, loanwords, names, numerals, Hanja homographs, and vowel/glide variants including ㅢ. Apply each only within its documented environment.

Add short diagnostic cases alongside long passages. Maintain a case map identifying which span tests which condition. Do not force every phenomenon into every sentence.

### Generated text rules

Generated or hand-authored stress passages are useful for robustness and interaction discovery. Label them synthetic/adversarial: they are not official examples, corpus gold, or expert adjudication.

For each generated passage, record a stable fixture ID/version, authoring method, target phenomena and spans, whether expected outputs exist, provenance/review status for each expected output, and known ambiguities.

If there is no independently supported expected pronunciation, test only legitimate properties: preservation, deterministic behavior, trace consistency, typed abstention, and absence of silent character loss. Do not assert exact IPA or Ukrainian output.

## Assertion quality

A test must fail for the defect it claims to prevent.

1. Reproduce the current behavior before editing.
2. Write the narrowest test for the observed defect.
3. Confirm it fails for the intended reason, not setup or stale data.
4. Make the smallest evidence-backed correction.
5. Confirm it passes, then run neighboring and interaction suites.
6. Add negative and unresolved controls where overgeneralization is possible.
7. Verify trace provenance for the stage, rule/source, engine, and uncertainty state.

Prefer public interfaces and end-to-end behavior. Avoid tests that only assert non-empty output, a rule label, or agreement with the same implementation that generated the expected value. Do not normalize away the whitespace, punctuation, code points, or script boundaries under test.

## Whole-sentence and service-level acceptance

Test realistic sentences through the public service entry point, not only helper functions. Verify:
- complete input consumption and output-span alignment;
- no dropped, duplicated, or reordered source characters;
- preservation of punctuation, spaces, newlines, and mixed-script runs;
- stable output and trace for repeated identical requests;
- bounded handling of long inputs and unsupported characters;
- UI status and copy actions correspond to the selected output layer;
- accessible labels and mobile layout remain usable;
- one unresolved span does not silently corrupt neighboring resolved spans.

Report software correctness, linguistic evidence, and product usability as separate dimensions.

## Engine comparison and selection

Compare engines on identical frozen occurrences, normalization, runtime conditions, and versioned splits. Report:
- exact-match rate and denominator;
- character error rate;
- phoneme error rate or a clearly defined alternative;
- coverage, abstentions, and failures separately;
- per-case paired wins/losses and error clusters;
- p50/p95 latency under the same protocol;
- memory/resource use when measured;
- determinism and reproducibility;
- version, source/checkpoint provenance, license, and training-data overlap risks.

Keep token and sentence evaluation separate. Prevent leakage by splitting at document/source/lemma level where feasible; deduplicate normalized forms across partitions. Preserve ordered per-engine occurrence ledgers so comparisons can be recomputed.

Do not select a universal winner from tiny aggregate-rate differences, incomparable test sets, or corpora that are not independent gold. Prefer a Pareto view of accuracy, coverage, latency, stability, and legal deployability. A model that cannot lawfully or reproducibly ship is not eligible as a production default.

Neural models and external services remain opt-in until licenses, model manifests, data provenance, privacy, reproducibility, and runtime costs are cleared. Do not silently add network calls, telemetry, remote dependencies, or model downloads to production.

## Debugging, review, and verification

Use test-first development: red, confirm the intended failure, minimal green, then refactor. On failure, investigate root cause before changing code. Trace the full data flow, callers, downstream adapters, generated data, and browser behavior.

Review changes on two axes:
- specification/evidence: does behavior match the request and cited linguistic rule?
- engineering quality: is it correct, maintainable, safe, tested, performant enough, and no more complex than necessary?

Before claiming completion, run the actual relevant commands or cite exact-head CI evidence. Read exit codes, counts, skips, and artifacts. A skipped neural benchmark, unavailable local environment, or metadata-only crawl is not a pass.

## Release gates

Do not claim linguistic certification or release readiness until relevant gates exist:
- complete source/rule scope and evidence mapping;
- adversarial positive, negative, interaction, and long-text regression coverage;
- independent Korean IPA adjudication on a source-separated holdout;
- independent Ukrainian target review and reader testing;
- reproducible multi-engine comparison with coverage and paired error analysis;
- legal clearance for every production dependency/model/data source;
- exact-head CI, clean build/install, deployed browser smoke, and runtime parity for every advertised interface.

When blocked, name the missing evidence, consequence, and acceptance criterion. Do not hide blockers behind a high test count.
