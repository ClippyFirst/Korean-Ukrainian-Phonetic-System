# Teacher-guided deterministic rule discovery for ClippyFirst Strict — 2026-10-26

## Decision

**Use a neural G2P as a research teacher, not as the Strict runtime.** The objective is to discover missing, explainable Korean phonological/morphological rules and then implement only independently justified rules in the existing deterministic engine. This does not copy ByT5 weights, train a neural network, or let model predictions directly change production output.

The current mainline has a layered Python engine (\`pipeline.py\` + \`rules.py\`) with source-backed licenses and deliberate abstention for ambiguous morphology. The public browser practical path is a separate pinned JavaScript g2pK port. Neither should be silently replaced or modified to imitate a checkpoint's raw outputs.

## Benchmark corpus eligibility audit (2026-10-26)

The existing benchmark files are not all training material. The immutable UGTPHON revision already pinned by the repository contains separate Korean `ko/train.json`, `ko/dev.json`, and `ko/test.json` files, plus `ko/LICENSE` declaring Apache-2.0. At that exact revision, Git tree entries report blob sizes of 3,651,448 bytes (train), 512,281 bytes (dev), and 729,354 bytes (test); the Korean dev/test files were fetched and declare their own split labels. The project's scored benchmark uses **only `ko/test.json`** (275 rows); it must remain evaluation-only. The separate train partition is a candidate for model fine-tuning after pinned download, SHA-256 capture, split-integrity validation, deduplication, and model-rights review. Use dev for checkpoint selection, not gradient training.

The repository's SIGMORPHON converter explicitly consumes the pinned `kor_test.tsv` paired word/IPA file and labels the resulting rows as `test`; its provenance notes a Wiktionary CC BY-SA 3.0 basis and a mismatch between the pinned paired file and the shared-task README. That current test file is evaluation-only, not a training corpus. I did not verify an immutable official Korean train/dev artifact in this run, so SIGMORPHON train/dev remain **BLOCKED pending source/partition verification**. The project's frozen 24-form NIKL holdout has source-attested Hangul readings but no IPA gold and explicitly prohibits tuning; it is not training data.

The candidate training plan is therefore: (1) acquire UGTPHON Korean train/dev/test from the pinned revision, recording SHA-256 for each file; (2) check duplicate row IDs and exact row/token overlap across partitions before fitting; (3) fine-tune only if the selected base checkpoint's license permits it; (4) use train for gradient updates, dev for early stopping/hyperparameter selection, and test once for final comparison; (5) separately use source-backed NIKL examples to adjudicate deterministic rules. A neural fine-tune is not itself a deterministic-rule license.

### Additional audit: CharsiuG2P's own Korean training files

The upstream code repository `lingjzhu/CharsiuG2P` at commit `0c929390759fb94f8ecdfc05cc0bc5f2ff2dc0f4` is MIT-licensed as a **code repository**, but that must not be assumed to license its separately hosted checkpoint weights or every bundled dataset. The repository contains `data/train/kor.tsv` (2,075,385 bytes), `data/dev/kor.tsv` (1,738 bytes), and `data/test/kor.tsv` (16,676 bytes). Its Korean source notes are mixed: `sources/info/others/ko_info.txt` points to the SIGMORPHON 2020 `kor_dev.tsv` source with the literal license value `U/K`, while `ko-2_info.txt` points to `open-dict-data/ipa-dict/data/ko.txt` with MIT. This is not a sufficiently clear, row-level license/provenance manifest for unrestricted redistribution or a clean overlap claim.

The selected Hugging Face checkpoint page currently says **“No model card”** and exposes no clear license declaration in the inspected page. Therefore the MIT license on the source-code repository does not clear the checkpoint weights. The exact checkpoint's training overlap with UGTPHON and SIGMORPHON-derived items is also not proven. Before fine-tuning that checkpoint, obtain a rights clarification or select a checkpoint whose weights license and training sources are explicitly documented. The code's train/dev/test files are useful for provenance analysis, but the existing model's own train split is not a fresh independent evaluation set.

Sources inspected: [CharsiuG2P source repository](https://github.com/lingjzhu/CharsiuG2P/tree/0c929390759fb94f8ecdfc05cc0bc5f2ff2dc0f4), [Korean source note (`ko_info.txt`)](https://github.com/lingjzhu/CharsiuG2P/blob/0c929390759fb94f8ecdfc05cc0bc5f2ff2dc0f4/sources/info/others/ko_info.txt), [Korean source note (`ko-2_info.txt`)](https://github.com/lingjzhu/CharsiuG2P/blob/0c929390759fb94f8ecdfc05cc0bc5f2ff2dc0f4/sources/info/others/ko-2_info.txt), [Hugging Face checkpoint](https://huggingface.co/charsiu/g2p_multilingual_byT5_small_100).

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


## Benchmark corpora: training vs evaluation (clarification, 2026-10-26)

**Yes, benchmark data can be useful for learning, but only through its explicitly released training/development partitions.** A benchmark's test file is an evaluation set and must not be used to fine-tune the neural teacher, select rules, choose IPA normalization, or decide which examples to patch. The fact that a repository is called UGTPHON or SIGMORPHON does not itself disqualify its train/dev partitions; the exact file, immutable revision, split, license, and row membership must be verified.

The candidate miner now allows a pinned UGTPHON/SIGMORPHON dataset identifier when the provenance declares a real `train` or `dev` split. It continues to reject non-train/dev splits and dataset identifiers that denote the project holdout or a sealed test set. This is an eligibility correction, **not evidence that such train/dev files have already been located, licensed, or processed**. The benchmark snapshots currently described in the repository are test/evaluation inputs; they must not be re-labelled as training data.

Keep two distinct workflows:

1. **Teacher inference / rule discovery:** run the existing pinned neural checkpoint on licensed train/dev examples; compare raw IPA outputs with Strict; manually verify discrepancies against primary Korean sources; validate candidate changes on a separate dev subset.
2. **Fine-tuning the neural teacher:** only if the exact checkpoint's license permits modification/training and the dataset license permits the intended use. Record base checkpoint/revision, training code and config, seeds, data hashes/splits, output checkpoint provenance, and overlap with the original teacher training data. If model rights or original training-data overlap remain unresolved, this step stays blocked; do not download/redistribute weights or claim leakage-free evaluation.

Use a three-way separation where data availability permits: train partition for fitting/fine-tuning, dev partition for selecting hypotheses and deterministic rule candidates, and a sealed test/holdout partition for one-time final evaluation only. Deduplicate normalized source forms across partitions before training and report exact overlap counts. If the upstream source has only a test split, it is useful for evaluation only and is not repurposed as training data. For any deterministic rule, neural agreement is a hypothesis signal—not a linguistic citation—and the final implementation still requires positive and negative controls plus a held-out gain.

### Updated task status

| Task | Status | Acceptance criterion |
|---|---|---|
| Permit benchmark-family train/dev partitions in the diagnostic miner | `DONE_VERIFIED` after exact-head CI | UGTPHON/SIGMORPHON identifiers accepted for train/dev; explicit holdout/test identifiers and non-train/dev splits rejected |
| Locate and license actual benchmark train/dev files | `TODO` | Pin upstream revision and exact file paths; verify license, split semantics, duplicates and leakage before inference |
| Run Charsiu teacher on benchmark train/dev | `BLOCKED` | Need actual permitted train/dev files, pinned inference environment, and checkpoint usage rights/overlap assessment |
| Fine-tune Charsiu on benchmark data | `BLOCKED` | In addition to dataset rights, verify checkpoint license permits fine-tuning and define an uncontaminated held-out evaluation protocol |
| Add source-adjudicated rules to deterministic Strict | `TODO` | Each rule backed by primary source, positive/negative regression tests, and a separate dev/holdout evaluation |
\n\nSee [`TEACHER-CORPUS-ELIGIBILITY-2026-10-26.md`](TEACHER-CORPUS-ELIGIBILITY-2026-10-26.md) for the pinned train/dev file inventory, license notes, split boundaries, and the remaining checkpoint/overlap blockers.\n