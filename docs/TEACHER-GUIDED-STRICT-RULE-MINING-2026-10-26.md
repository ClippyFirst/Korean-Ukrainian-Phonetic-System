# Teacher-guided deterministic rule discovery for ClippyFirst Strict — 2026-10-26

## Decision

**Use a neural G2P as a research teacher, not as the Strict runtime.** The objective is to discover missing, explainable Korean phonological/morphological rules and then implement only independently justified rules in the existing deterministic engine. This does not copy ByT5 weights, train a neural network, or let model predictions directly change production output.

The current mainline has a layered Python engine (\`pipeline.py\` + \`rules.py\`) with source-backed licenses and deliberate abstention for ambiguous morphology. The public browser practical path is a separate pinned JavaScript g2pK port. Neither should be silently replaced or modified to imitate a checkpoint's raw outputs.

## What was implemented

- \`scripts/mine_deterministic_rule_candidates.py\` reads raw teacher IPA and current Strict IPA from JSONL plus a required provenance manifest.
- It preserves raw outputs and IDs; normalization is conservative (Unicode NFC and whitespace collapse only). It does **not** erase vowel length, aspiration, tense consonants, tone/stress, syllable boundaries, or IPA segments.
- It computes pairwise disagreement and CER for teacher-vs-Strict diagnostics and groups disagreements by coarse adjacent-Hangul coda/onset contexts.
- It rejects non-\`train\`/\`dev\` splits and known benchmark/holdout identifiers, requires \`test_data_used_for_tuning=false\`, and requires explicit model/dataset license status, immutable revisions, IPA output type, and training-overlap status.
- It labels context buckets as **associations, not causes**. It cannot emit executable rules and does not write to production lexicons or rule code.
- \`tests/test_mine_deterministic_rule_candidates.py\` covers conservative normalization, raw-output preservation, provenance, forbidden benchmark/holdout splits, mismatched split metadata, and duplicate IDs.

## Why this is the right distillation boundary

A neural model's output is a useful hypothesis generator, but it is not automatically a Korean pronunciation authority. A mismatch may come from:
1. a real missing Strict rule;
2. teacher error or an unsupported pronunciation variant;
3. differences in IPA conventions (e.g. aspiration, length, syllable boundaries);
4. lexical or morphological context absent from the deterministic input;
5. an incorrect or insufficiently adjudicated benchmark reference.

Therefore, a high-disagreement context is only a review queue. A deterministic rule may be added only after a linguist/researcher verifies the exact environment against the National Institute of Korean Language (NIKL) or another suitable primary source, supplies positive and negative-control examples, and demonstrates improvement on a separate development set. Test/holdout examples remain sealed.

## Input contract

The JSONL file contains one occurrence per line, for example:

\`\`\`json
{"case_id":"dev-001","split":"dev","source_text":"국물","teacher_ipa":"kuŋ.mul","strict_ipa":"kuk.mul","source_provenance":"independently licensed development example"}
\`\`\`

The separate provenance JSON must include:

- \`model_id\`, immutable \`model_revision\`;
- \`model_license_status\` (unknown/unresolved is explicit; do not redistribute weights);
- \`teacher_output_type: "IPA"\` — custom phone alphabets must first have a verified mapping;
- \`teacher_model_training_overlap_status\`;
- \`dataset_id\`, immutable \`dataset_revision\`, \`split\` (\`train\` or \`dev\` only);
- \`source_url\`, \`dataset_license_status\`;
- \`test_data_used_for_tuning: false\`.

Example invocation:

\`\`\`powershell
python scripts/mine_deterministic_rule_candidates.py --input-jsonl reports/strict-teacher/dev-predictions.jsonl --provenance-json reports/strict-teacher/provenance.json --output-json reports/strict-teacher/rule-candidates.json --min-context-support 3
\`\`\`

Do not run it against UGTPHON test, SIGMORPHON test, the project 24-form holdout, or any split whose provenance is uncertain. A manifest is an auditable declaration, not proof that the teacher's original training corpus did not overlap with the supplied examples.

## Known limitations

- The current utility analyzes already-generated predictions; it does not download a checkpoint or invoke a model.
- The CharsiuG2P multilingual ByT5 checkpoint's explicit weight-license status and upstream training-data overlap are unresolved in the current research gate. This tool must not be interpreted as permission to redistribute weights or derived large-scale prediction dumps.
- The coarse context buckets are not a morphology analyzer and cannot distinguish stem/ending, compound, lexicalized phrase, or prosodic boundaries from Hangul alone.
- A context's mismatch rate is not a causal estimate. The per-case outputs and context counts require manual review.
- No new production pronunciation rule is claimed by this change. That would require source-backed evidence and a passing exact-head benchmark after implementation.

## Acceptance status

| Task | Status | Acceptance criterion |
|---|---|---|
| Deterministic teacher-disagreement report | \`DONE_VERIFIED\` after CI | Raw per-case outputs, exact/CER, explicit provenance, and context associations reproducibly generated |
| Test/holdout guardrails | \`DONE_VERIFIED\` after CI | Unit tests prove rejection of known benchmark IDs and non-train/dev splits |
| Learn executable rules from teacher outputs | \`TODO\` | Candidate manually source-adjudicated, with positive/negative tests and a clean dev-set gain |
| Run teacher on a legally cleared train/dev corpus | \`BLOCKED\` | Need a suitable corpus split, rights evidence, a pinned inference environment, and overlap audit |
| Change production Strict output based on Charsiu | \`DEFERRED\` | Do not change until the acceptance criteria above are met |

## Final principle

The desired product is a **neural-free deterministic engine with neural-comparable results where evidence supports that claim**, not a disguised neural service. This workflow helps us learn from neural disagreements while keeping the runtime transparent, source-backed, reproducible, and safe against test leakage.
