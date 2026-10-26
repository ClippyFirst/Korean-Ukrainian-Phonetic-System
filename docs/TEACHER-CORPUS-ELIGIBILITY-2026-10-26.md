# Korean train/dev corpora for Charsiu-guided Strict research — 2026-10-26

## Decision

The repository inspection found genuine train/dev partitions for both existing benchmark families. They are eligible *candidate data* for a teacher experiment, unlike the test partitions already used in the benchmark reports. This document records exact source revisions and rights evidence so the corpus cannot silently drift.

Finding train/dev files does **not** authorize fine-tuning an unlicensed checkpoint, establish that Charsiu's original training data do not overlap, or make the corpus IPA gold. Do not download, modify, or redistribute the Charsiu weights until the checkpoint's applicable terms are verified.

## Source inventory

| Dataset | Split | Pinned source | File identity | Current decision |
|---|---|---|---|---|
| UGTPHON Korean | train | [naver-ai/UGTPHON](https://github.com/naver-ai/UGTPHON/tree/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/ko) at commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54` | `ko/train.json`, Git blob `771ef17ceed8127980f0be5103674cfa53627e55` | Candidate train source; inspect row/token schema and deduplicate before model use |
| UGTPHON Korean | dev | same pinned commit | `ko/dev.json`, Git blob `71127176c1487741ed9a6492cdaabba78222461d`; 246 rows observed | Candidate development source |
| UGTPHON Korean | test | same pinned commit | `ko/test.json`, Git blob `59380491d5a797308c475f7d0007dcf6c4be00af`; 275 rows observed | **Sealed evaluation only**; never fine-tune or mine rules from it |
| UGTPHON Korean | license | same pinned commit | `ko/LICENSE`, Git blob `854f72ef490f9343f73758bc856ba9bf1eeee544` | Apache-2.0 for this Korean subset; upstream notes derivation from KoMultiText / MultiLexNorm++ |
| SIGMORPHON 2021 Korean | train | [sigmorphon/2021-task1](https://github.com/sigmorphon/2021-task1/tree/821bcdece5a47820872215969f275004b0abe80c/data/medium) at commit `821bcdece5a47820872215969f275004b0abe80c` | `data/medium/kor_train.tsv`; 8,000 rows, 8,000 unique grapheme forms | Candidate supervised train source |
| SIGMORPHON 2021 Korean | dev | same pinned commit | `data/medium/kor_dev.tsv`; 1,000 rows, 1,000 unique grapheme forms | Candidate development source |
| SIGMORPHON 2021 Korean | test | same pinned commit | `data/medium/kor_test.tsv`; 1,000 rows, 1,000 unique grapheme forms | **Sealed evaluation only**; not training data |

### Rights and source caveats

- UGTPHON's pinned Korean license file explicitly says the Korean subset is licensed under Apache License 2.0 and names KoMultiText / MultiLexNorm++ as sources. The data are noisy user-generated text and include normalization/variant metadata; do not assume every sentence-level `phonemes` field is a word-level gold pronunciation.
- SIGMORPHON's pinned README describes WikiPron/Wiktionary-derived data and an 80/10/10 train/dev/test split. The project benchmark register records CC BY-SA 3.0 data terms. The source also documents task-specific resource restrictions for competition submissions; before using the files in a new training experiment, preserve attribution and re-check the applicable upstream data terms and those task restrictions rather than assuming they disappear.
- The SIGMORPHON file format is grapheme + tab + tokenized roughly-phonemic IPA. It is not byte-for-byte the same representation as the project's broad IPA; preserve raw targets and define a documented adapter only after the convention is inspected.
- Charsiu's upstream GitHub repository documents training/fine-tuning code and is MIT-licensed as a repository, but the selected Hugging Face checkpoint `charsiu/g2p_multilingual_byT5_small_100` currently shows **“No model card”** and no explicit checkpoint license on the model page. A repository code license is not sufficient evidence that checkpoint weights have the same license.
- The original Charsiu training-data inventory and overlap with these corpora have not been established. This blocks a leakage-free claim even if a fine-tuning run is technically possible.

## Automated integrity audit

`scripts/audit_teacher_corpus_splits.py` downloads only the pinned UGTPHON, SIGMORPHON and Charsiu-repository Korean split files, verifies each Git blob SHA-1, records byte SHA-256 and sizes, checks UGTPHON row split labels, and reports raw-form and cross-dataset split intersections without emitting example text. It is run by the existing `.github/workflows/test.yml` matrix and uploads a metadata-only artifact. This is a source/split audit, not model training or permission to fine-tune.


## Charsiu repository's Korean data: overlap proxy, not checkpoint proof

The upstream Charsiu repository also exposes Korean `data/train/kor.tsv`, `data/dev/kor.tsv`, and `data/test/kor.tsv` at repository commit `0c929390759fb94f8ecdfc05cc0bc5f2ff2dc0f4` (file Git blob SHAs are pinned in `scripts/audit_teacher_corpus_splits.py`). Its source notes list `sources/info/others/ko_info.txt` with license marker `U/K` and `ko-2_info.txt` with MIT. This is mixed-source data with unresolved terms for at least one source. It is useful as an **overlap proxy** for assessing whether the public benchmark forms may already occur in Charsiu's published Korean data; it is not proof that this exact repository split was used to train the selected Hugging Face checkpoint.

The exact-head automated audit passed in [Teacher corpus split audit run 40290981510](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290981510), with metadata-only artifact [12635583549](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40290981510/artifacts/12635583549). It verified every pinned Git blob and reported: UGTPHON 1,976 train / 246 dev / 275 test rows; SIGMORPHON 8,000 / 1,000 / 1,000; Charsiu repository Korean data 62,126 train rows (61,900 unique forms; 226 duplicate-form rows), 50 dev and 500 test rows. Cross-corpus unique-form intersections include **508 UGTPHON test forms found in Charsiu repository train**, 237 UGTPHON test forms in SIGMORPHON train, and 729 SIGMORPHON test forms in Charsiu repository train. Other intersections are preserved in the JSON artifact. The audit reports counts and file hashes, not corpus rows.

### First automated overlap results (audit run 40291000666)

The pinned-source audit completed successfully and uploaded [metadata-only artifact 12635783073](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40291000666/artifacts/12635783073). Verified counts:

- UGTPHON Korean: **1,976 train rows** (1,972 unique sentence strings; 10,341 unique token forms), **246 dev rows** (1,914 token forms), **275 test rows** (2,170 token forms).
- SIGMORPHON Korean: **8,000 train / 1,000 dev / 1,000 test**; all grapheme forms are unique within each split.
- Charsiu repository's Korean data: **62,126 train rows / 61,900 unique grapheme forms** (226 duplicate-form rows), 50 dev rows, 500 test rows.

Most importantly, the public benchmark forms overlap materially with the Charsiu repository's published Korean training split: **508 unique UGTPHON test token forms** occur in Charsiu train; **729 of 1,000 SIGMORPHON test words** occur in Charsiu train. This is not proof that the selected Hugging Face checkpoint used this exact repository split, but it is a serious contamination signal. The original checkpoint's full training manifest remains unknown. The SIGMORPHON test set therefore cannot be described as an independent generalization test for a model trained on these Charsiu repository data. The UGTPHON figure is a token-form intersection, not a count of affected sentence rows.

The audit also finds substantial overlap among the separate corpus families (for example, 1,093 UGTPHON train token forms intersect SIGMORPHON train; 237 UGTPHON test token forms intersect SIGMORPHON train). These counts are normalized exact-form overlaps, not pronunciation agreement. Deduplication and split policy must be explicit before any fitting or dev selection. The report contains only counts and hashes, no corpus examples.

**Status correction:** source pinning, split-label checks, and overlap counting are now `DONE_VERIFIED` on the audited code head. Model inference/fine-tuning and contamination-free evaluation remain blocked.

## Required pipeline

1. Download only the pinned train/dev files in an isolated, reproducible workflow and record their Git blob SHA, byte SHA-256, row count, split, and license evidence.
2. Parse corpus records without flattening tokenized IPA or silently rewriting Hangul. For UGTPHON, explicitly decide whether training examples are token-level or phrase-level; retain source IDs and normalization metadata.
3. Normalize the input/output representation only through a reviewed adapter. Keep the raw source target alongside the normalized target and document each lossy mapping; do not discard length, tense/aspirated distinctions, or syllable boundaries to improve superficial scores.
4. Detect exact normalized input overlap across train/dev/test and across corpora. Report intersections and duplicate counts; keep all test rows sealed.
5. Resolve checkpoint rights before loading or fine-tuning Charsiu. If unresolved, the corpus preparation and deterministic-source research may proceed, but checkpoint training/inference is blocked.
6. Run teacher inference on the eligible train/dev examples only after gates clear. Compare the teacher, the corpus reference, and ClippyFirst Strict separately; the teacher is not the gold standard.
7. Turn disagreements into a review queue. Add a Strict rule only when primary Korean sources support the precise rule environment, positive and negative controls pass, and separate dev results improve without changing unrelated forms.
8. Run the untouched test/holdout exactly once after rule selection, report coverage/abstention separately from accuracy, and do not use test errors for subsequent patches.

## Task ledger

| Task | Status | Acceptance criterion |
|---|---|---|
| Locate exact train/dev files and source revisions | DONE_VERIFIED | Pinned file paths/commits recorded above; SIGMORPHON row counts checked |
| Record UGTPHON Korean data license | DONE_VERIFIED | Pinned `ko/LICENSE` identifies Apache-2.0 |
| Record SIGMORPHON train/dev/test partition structure | DONE_VERIFIED | Pinned repository contains 8,000/1,000/1,000 Korean rows; source README reviewed |
| Compute cross-split/cross-corpus overlap | DONE_VERIFIED | Exact-head CI run 40290981510 verified pinned Git blob IDs and uploaded metadata-only artifact 12635583549; it reported 508 UGTPHON test forms intersecting Charsiu repository train and 237 intersecting SIGMORPHON train |
| Verify Charsiu checkpoint weight license | BLOCKED | Exact selected checkpoint must expose applicable, explicit usage/modification terms |
| Audit Charsiu original training-data overlap | BLOCKED | Source-level training inventory or documented uncertainty assessment with no false leakage-free claim |
| Fine-tune Charsiu / run teacher inference | BLOCKED | Checkpoint rights, pinned environment, train/dev-only manifest, IPA convention adapter and overlap report |
| Add deterministic Strict rules | TODO | Independent primary-source adjudication, positive/negative controls and held-out improvement |

## Primary source links

- UGTPHON repository and pinned Korean files: https://github.com/naver-ai/UGTPHON/tree/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/ko
- UGTPHON Korean license: https://github.com/naver-ai/UGTPHON/blob/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/ko/LICENSE
- SIGMORPHON 2021 task and split documentation: https://github.com/sigmorphon/2021-task1/tree/821bcdece5a47820872215969f275004b0abe80c
- Selected Charsiu checkpoint page (no model card at inspection): https://huggingface.co/charsiu/g2p_multilingual_byT5_small_100
- Charsiu code, data and fine-tuning instructions: https://github.com/lingjzhu/charsiug2p

## Alternative pretrained model candidate: Montreal Forced Aligner Korean (Jamo) G2P v3.0.0

The official MFA documentation lists [Korean (Jamo) MFA G2P v3.0.0](https://mfa-models.readthedocs.io/en/latest/g2p/Korean/Korean%20(Jamo)%20MFA%20G2P%20model%20v3_0_0.html), architecture Phonetisaurus, compatible with MFA v3.0.0, with an explicit **CC BY 4.0** model license and an MFA phone set. The model card reports 49,655 training words and 5,518 evaluation words; its published WER and PER are both **100.00%**. The official [Korean model index](https://mfa-models.readthedocs.io/en/latest/g2p/Korean/index.html) also lists other Korean MFA G2P versions under CC BY 4.0.

**Decision: promising alternative candidate, not yet approved as an IPA teacher.** Unlike the Charsiu checkpoint currently under review, the MFA page does state a model license. However, licensing alone is insufficient: the output inventory is the MFA phone set, not a guaranteed IPA transcription, and the reported 100% WER/PER is a major quality warning that needs investigation. Before any benchmark use, pin the exact release artifact and hash, verify the artifact's accompanying terms and underlying dictionary provenance, inspect the phoneset, define and test an explicit MFA-phone-to-IPA adapter (including unmapped-symbol failure), and independently reproduce or explain the reported metrics. No model was downloaded or run in this continuation. Do not relabel MFA output as IPA and do not use its predictions as gold.



## Executable corpus preparation — 2026-10-26 continuation

The audit-only workflow has been extended with `scripts/prepare_korean_g2p_corpus.py`. It materializes the pinned SIGMORPHON 2021 medium Korean `train` and `dev` partitions as JSONL while preserving the original tokenized-IPA target string. Every row carries the immutable source revision, split, source line, and explicit target-representation label. Hangul input is normalized to NFC for the model-facing field, while the original source spelling is preserved separately. IPA targets are **not** normalized, re-tokenized, converted to broad IPA, or treated as already equivalent to the ClippyFirst IPA contract.

The preparation command verifies all three source Git blob identities and expected row counts. It checks normalized source-form duplicates within each split and rejects any train/dev, train/test, or dev/test source-form intersection. The test source is fetched only to verify its pin and split isolation; test records are never written to output. Only `train.jsonl`, `dev.jsonl`, and a provenance/hash manifest are generated. The workflow uploads these research outputs as a build artifact; it does not commit corpus rows into the repository or train a model.

Run locally:

```powershell
python scripts/prepare_korean_g2p_corpus.py --output-dir reports/korean-g2p-corpus
```

Expected source counts are 8,000 train and 1,000 dev examples; the pinned 1,000-row test split is not exported. These are source-record counts, not claims about unique phonological contexts, normative accuracy, or target IPA compatibility. The manifest captures byte SHA-256 values and generated-file hashes so the corpus can be reproduced and compared.

**Scope correction:** this dataset-preparation path is independent of the Charsiu checkpoint. Unresolved teacher-weight provenance does not block preparing source-backed train/dev examples for ClippyFirst's own research. However, this step is not model training, does not settle all source/task terms, and does not itself authorize any rule change. Before combining with UGTPHON, run cross-corpus overlap checks and inspect the UGTPHON token/phoneme schema; do not treat sentence-level labels as word-level gold by assumption.


## UGTPHON token-level corpus preparation — 2026-10-26 continuation

The pinned UGTPHON README documents three aligned layers: raw sentence text, a canonical normalized sentence, and sentence-level IPA; each token additionally carries surface text, canonical form, and phoneme annotation. The sentence-level phonemes field is **not guaranteed to equal the literal join of token phonemes**, so the new builder uses token-level annotations only.

The new scripts/prepare_ugtphon_korean_corpus.py exports a conservative subset from train/dev: only tokens with is_nc=false, exact surface/canonical equality, a single-token canonical form, a non-empty phoneme target, and no comma-separated target variants or placeholder notation. It preserves source sentence ID, token index, raw surface/canonical text, and raw target string. Noncanonical spellings, normalization cases, multiword expansions, missing phonemes, and ambiguous comma variants are counted by exclusion reason rather than silently repaired or guessed. Multiple target strings for the same normalized source form are reported, not arbitrarily collapsed.

The builder verifies the pinned source Git blob SHA-1, byte SHA-256, expected sentence counts, UTF-8/JSON structure, sentence ID uniqueness, language, and split labels. It inspects test only for source integrity and aggregate overlap diagnostics; test examples are never exported. Unlike the word-level SIGMORPHON builder, UGTPHON token forms may naturally recur across sentence splits, so the manifest reports eligible form intersections instead of treating all repeated words as sentence leakage. Keep sentence-level split provenance and never use test examples for model selection.

The workflow now builds both datasets into separate JSONL outputs and publishes them with separate manifests in one research artifact. Do not concatenate their targets without an explicit representation adapter: SIGMORPHON uses tokenized IPA, while UGTPHON's Korean token phoneme annotations have their own source convention. Neither has been independently proven equivalent to the project's broad IPA output. These corpora support own-engine research and error analysis; they do not themselves license a phonological rule or prove Ukrainian output accuracy.


## Cross-corpus compatibility gate — 2026-10-26 continuation

The workflow now runs scripts/audit_korean_corpus_compatibility.py after preparing both source datasets. It verifies each generated JSONL against the SHA-256 in its manifest, validates row counts and split labels, then reports train/dev cross-corpus normalized-form intersections and target-string relations. The report contains counts and hashes only; it does not emit source words or combine the datasets. For diagnostic comparison only, it removes whitespace phone-token separators from SIGMORPHON targets and compares the resulting compact string with the UGTPHON target. It does not map IPA symbols, infer syllable boundaries, or equate this representation with ClippyFirst broad IPA. The audit therefore reports target compatibility as UNVERIFIED and explicitly refuses to merge or train. Its next gate is a reviewed common representation adapter, followed by source-form and target-conflict adjudication. This keeps useful overlapping data visible without allowing accidental mixing to conceal different conventions.
