# Teacher-guided deterministic rule discovery for ClippyFirst Strict — 2026-10-26

## Decision

**Use a neural G2P as a research teacher, not as the Strict runtime.** The objective is to discover missing, explainable Korean phonological/morphological rules and then implement only independently justified rules in the existing deterministic engine. This does not copy ByT5 weights, train a neural network, or let model predictions directly change production output.

The current mainline has a layered Python engine (\`pipeline.py\` + \`rules.py\`) with source-backed licenses and deliberate abstention for ambiguous morphology. The public browser practical path is a separate pinned JavaScript g2pK port. Neither should be silently replaced or modified to imitate a checkpoint's raw outputs.

## Benchmark corpus eligibility audit (2026-10-26)

The existing benchmark files are not all training material. The immutable UGTPHON revision already pinned by the repository contains separate Korean `ko/train.json`, `ko/dev.json`, and `ko/test.json` files, plus `ko/LICENSE` declaring Apache-2.0. At that exact revision, Git tree entries report blob sizes of 3,651,448 bytes (train), 512,281 bytes (dev), and 729,354 bytes (test); the Korean dev/test files were fetched and declare their own split labels. The project's scored benchmark uses **only `ko/test.json`** (275 rows); it must remain evaluation-only. The separate train partition is a candidate for model fine-tuning after pinned download, SHA-256 capture, split-integrity validation, deduplication, and model-rights review. Use dev for checkpoint selection, not gradient training.

The repository's benchmark converter uses a pinned SIGMORPHON test fixture, but a separate source audit verified the official medium Korean train/dev/test files at immutable commit `821bcdece5a47820872215969f275004b0abe80c`: 8,000 / 1,000 / 1,000 rows. Treat train as a candidate fitting source and dev as selection-only; re-check task-specific terms and preserve attribution before use. The current benchmark test fixture and official test split remain sealed. The project's frozen 24-form NIKL holdout has source-attested Hangul readings but no IPA gold and explicitly prohibits tuning; it is not training data.

The exact-head split audit passed in [run 40290981510](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290981510), artifact [12635583549](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290981510/artifacts/12635583549). It found 508 unique UGTPHON test token forms in Charsiu repository train and 237 UGTPHON test forms in SIGMORPHON train. Because the exact checkpoint's training manifest is unknown, these are strong overlap warnings rather than proof of checkpoint-level exposure. Do not use these test sets as a guaranteed independent evaluation of the selected teacher. A neural fine-tune is not itself a deterministic-rule license.

### Additional audit: CharsiuG2P's own Korean training files

The upstream code repository `lingjzhu/CharsiuG2P` at commit `0c929390759fb94f8ecdfc05cc0bc5f2ff2dc0f4` is MIT-licensed as a **code repository**, but that must not be assumed to license its separately hosted checkpoint weights or every bundled dataset. The repository contains `data/train/kor.tsv` (2,075,385 bytes), `data/dev/kor.tsv` (1,738 bytes), and `data/test/kor.tsv` (16,676 bytes). Its Korean source notes are mixed: `sources/info/others/ko_info.txt` points to the SIGMORPHON 2020 `kor_dev.tsv` source with the literal license value `U/K`, while `ko-2_info.txt` points to `open-dict-data/ipa-dict/data/ko.txt` with MIT. This is not a sufficiently clear, row-level license/provenance manifest for unrestricted redistribution or a clean overlap claim.

The selected Hugging Face checkpoint page currently says **“No model card”** and exposes no clear license declaration in the inspected page. Therefore the MIT license on the source-code repository does not clear the checkpoint weights. The exact checkpoint's training overlap with UGTPHON and SIGMORPHON-derived items is also not proven. Before fine-tuning that checkpoint, obtain a rights clarification or select a checkpoint whose weights license and training sources are explicitly documented. The code's train/dev/test files are useful for provenance analysis, but the existing model's own train split is not a fresh independent evaluation set.

Sources inspected: [CharsiuG2P source repository](https://github.com/lingjzhu/CharsiuG2P/tree/0c929390759fb94f8ecdfc05cc0bc5f2ff2dc0f4), [Korean source note (`ko_info.txt`)](https://github.com/lingjzhu/CharsiuG2P/blob/0c929390759fb94f8ecdfc05cc0bc5f2ff2dc0f4/sources/info/others/ko_info.txt), [Korean source note (`ko-2_info.txt`)](https://github.com/lingjzhu/CharsiuG2P/blob/0c929390759fb94f8ecdfc05cc0bc5f2ff2dc0f4/sources/info/others/ko-2_info.txt), [Hugging Face checkpoint](https://huggingface.co/charsiu/g2p_multilingual_byT5_small_100).

## What was implemented

- \`scripts/mine_deterministic_rule_candidates.py\` reads raw teacher IPA and current Strict IPA from JSONL plus a required provenance manifest.
- It preserves raw outputs and IDs; normalization is conservative (Unicode NFC and whitespace collapse only). It does **not** erase vowel length, aspiration, tense consonants, tone/stress, syllable boundaries, or IPA segments.
- It computes pairwise disagreement and CER for teacher-vs-Strict diagnostics and groups disagreements by coarse adjacent-Hangul coda/onset contexts.
- It rejects non-\\`train\\`/\\`dev\\` splits and explicit holdout/test identifiers, while allowing benchmark family names only for declared train/dev partitions; it requires \\`test_data_used_for_tuning=false\\` and explicit model/dataset license status, immutable revisions, IPA output type, and training-overlap status.
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


## Continuation verification update — 2026-10-26 (current PR head)

- **Latest code/test head with completed CI at time of this audit:** `d9bf45628a0243ee46010c7cb706e5661057be8d`. The branch subsequently received documentation-only reconciliation commits; check the live PR head and rerun/status-check those exact commits before merge. PR #339 remains open and draft. The earlier supplied SHA `7e3728e3aa62a96b7f5635bf4832f6c747d40677` was not the head at audit time.
- **Code/test-head CI:** all four PR-triggered workflows associated with `d9bf45628a0243ee46010c7cb706e5661057be8d` completed successfully: tests [40291416230](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291416230), system verification [40291416238](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291416238), teacher corpus split audit [40291416210](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291416210), and master table/research artifacts [40291416486](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291416486). These establish software/workflow verification only; they do not establish teacher accuracy or any Strict quality gain.
- **Alternative-model assessment:** SIGMORPHON 2021 Korean medium data are available as 8,000 train / 1,000 dev / 1,000 test examples under the task's stated CC BY-SA 3.0 data terms. The task documentation explicitly describes targets as tokenized *roughly-phonemic IPA*, not a guaranteed narrow phonetic IPA gold standard; its competition rules also restricted external resources for the medium subtask. A model trained from scratch on its train split could be a separate rough-phonemic research baseline, but cannot be represented as an IPA-equivalent teacher for Strict without an independently reviewed representation adapter. The source documents are [SIGMORPHON 2021 repository](https://github.com/sigmorphon/2021-task1) and [task README/search result](https://github.com/sigmorphon/2021-task1#readme).
- **Current decision:** no alternative pretrained checkpoint with both verified weights license and appropriate IPA target contract was cleared in this run. Charsiu checkpoint rights and its exact training-data manifest remain unresolved. Therefore no checkpoint was downloaded/run, no inference or fine-tuning was performed, and no model result or Strict rule gain is claimed. Do not treat this as evidence that model training is impossible; it remains a separate option after source terms and target representation are reviewed.
- **Strict changes:** none made in this continuation. The existing rule gate remains primary-source phonological evidence + positive and negative controls + eligible dev improvement + regression review. The 24-form project holdout and all official test splits remain sealed.
- **Local verification:** the connected GitHub environment supplied CI evidence; local clone/network execution was not available in this run, so no local test command is claimed. The later documentation-only reconciliation commits are not represented as separately CI-verified unless their exact-head runs complete successfully.

### Updated task ledger

| Task | Status | Evidence / remaining acceptance criterion |
|---|---|---|
| Verify latest PR head and queued CI | DONE_VERIFIED | PR head `d9bf45628a0243ee46010c7cb706e5661057be8d`; all four exact-head workflows completed successfully (run IDs above) |
| Pin and audit UGTPHON / SIGMORPHON / Charsiu repository splits | DONE_VERIFIED | Source blobs, split counts, duplicate counts and overlap intersections recorded in the corpus audit artifact; lexical overlap is not proof of checkpoint training exposure |
| Establish an eligible pretrained neural IPA teacher | BLOCKED | Need a checkpoint with explicit weights terms, reproducible immutable revision, training-data provenance/overlap assessment, and an output convention compatible with the miner's IPA contract |
| Train a separate SIGMORPHON-only rough-phonemic baseline | TODO | Optional alternative, not an IPA teacher by default; acceptance requires a reproducible train/dev-only run, pinned environment, documented CC BY-SA attribution/terms, raw outputs, and an explicitly typed target representation |
| Run Charsiu inference or fine-tuning | BLOCKED | Explicit checkpoint weights license and original training-data manifest/overlap remain unresolved; do not download/use weights for this workflow until cleared |
| Promote teacher-derived Strict rules | TODO | Independent NIKL/primary-source adjudication, positive/negative controls, dev improvement, and regression evidence required; no teacher-derived rule is licensed yet |
| Change production Strict in this continuation | DEFERRED | No source-backed candidate passed the acceptance gate in this run; do not invent rules from associations |

## Continuation update — fail-closed case-ID guard (2026-10-26)

A code review found that the candidate miner rejected forbidden split labels and holdout-marked dataset identifiers, but did not independently inspect each `case_id`. A mislabeled row such as `test-001` could therefore pass if the manifest and row split both claimed `dev`. This is now guarded at row ingestion: obvious `test`, `holdout`, and `24-form` identifier markers are rejected regardless of the declared split. Regression tests cover hyphenated, underscored, and project-style 24-form identifiers.

- Code commit: `806d256e7be819569c24cf0cc1d8a8b4aaf6573b`.
- Regression-test commit: `5a90b3dadb2bc8729b1f30f1c7cef7ae5b385812`.
- **Verification:** corrected code/test head `1a48567f042a25023df90258fde30497240b6bd4` passed all four workflows: tests [40293964930](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40293964930), system verification [40293964888](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40293964888), corpus split audit [40293964882](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40293964882), and master artifacts [40293964952](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40293964952). The first attempt exposed a malformed JSONL test fixture (literal `\\n`); the fixture was corrected and the full matrix passed. The documentation head `e438ea8ef748b4ccb3f2b2b38d11795355836514` subsequently passed all four exact-head workflows: tests [40294156717](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40294156717), system verification [40294156664](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40294156664), corpus audit [40294156675](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40294156675), and master artifacts [40294156700](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40294156700). Subsequent follow-up commits are documentation-only; executable changes remain verified at code/test head `1a48567f042a25023df90258fde30497240b6bd4`.
- This is a defensive guard, not proof that every arbitrary opaque ID maps to the correct partition. The immutable source manifest and split membership remain authoritative; reviewers must not relabel test records as dev or use this heuristic as a substitute for row-level provenance.



## Continuation: prepare real train/dev data for ClippyFirst (2026-10-26)

The first executable corpus builder now exists at scripts/prepare_korean_g2p_corpus.py. It uses the pinned SIGMORPHON 2021 medium Korean source and exports only the 8,000-row training partition and 1,000-row development partition. It verifies pinned Git blob IDs and row counts for train/dev/test, checks normalized source-form duplicates and cross-split leakage, preserves the raw target token string, and records source and output hashes in manifest.json. The test partition is inspected only for integrity/overlap and is never serialized into the training artifact.

This enables a concrete research corpus for ClippyFirst without loading or fine-tuning Charsiu. The tokenized IPA convention is explicitly typed and preserved; it is not silently relabeled as the project's broad IPA. A future adapter must document symbol and boundary mappings, preserve contrastive distinctions, and fail on unmapped symbols. This corpus can support error analysis and hypothesis generation; it does not automatically establish productive Korean phonological rules or Ukrainian target accuracy.

The corpus workflow runs parser tests, performs the pinned-source audit, builds train/dev JSONL, and uploads a provenance-bearing research artifact. It does not change runtime code, run a neural model, or claim any accuracy gain. Further data work should inspect UGTPHON's exact token/phoneme alignment before combining it with SIGMORPHON, then create an audited cross-corpus deduplication report and independently review the target IPA convention.

Updated status: corpus builder implementation is PARTIAL until exact-head CI confirms it; source-backed production-rule changes remain TODO and are still gated by independent phonological evidence and regression tests. Checkpoint rights are not a blocker for this source-only corpus preparation step.


### Second source: conservative UGTPHON token labels

The pinned upstream schema was inspected directly in its README at revision ef0d5a09c2ea1874c7206020f875cbd9cfea2f54. It explicitly distinguishes sentence-level phonemes from token-level phoneme annotations; the sentence field is not guaranteed to be the literal concatenation of token fields. The new scripts/prepare_ugtphon_korean_corpus.py therefore works from aligned token objects only.

It exports a conservative baseline subset: canonical tokens with is_nc=false, exact surface/canonical equality, one token with no whitespace, a non-empty phoneme target, and no comma-joined alternatives or placeholder symbols. It keeps raw target text and source sentence/token IDs, counts exclusion reasons, and reports cases where the same normalized source form has multiple target strings. It does not autocorrect noncanonical spellings or guess which variant is intended. Only train/dev are serialized; test is used for source-integrity and aggregate overlap diagnostics only.

The CI artifact now contains separate SIGMORPHON and UGTPHON train/dev JSONL files and manifests. Their targets remain separate typed representations. A future cross-corpus merger must compare normalized source forms and target conflicts, document IPA convention differences, and keep the test split sealed. This is a practical first data pipeline for ClippyFirst's own research; it is not yet a trained model or a new deterministic rule.


### Cross-corpus compatibility audit

scripts/audit_korean_corpus_compatibility.py now validates both generated manifests and JSONL hashes, checks output counts/split labels, and reports normalized source-form intersections across SIGMORPHON and UGTPHON train/dev. It reports raw target-string relations and a second diagnostic after removing only SIGMORPHON's whitespace phone-token separators. This does not map symbols or infer syllable boundaries, explicitly marks target compatibility UNVERIFIED, and never merges or trains. This audit is intended to make cross-source overlap visible before a future reviewed IPA adapter and data reconciliation step.
