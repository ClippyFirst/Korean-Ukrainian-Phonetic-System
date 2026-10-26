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

## Automated integrity audit\n\n`scripts/audit_teacher_corpus_splits.py` downloads only the pinned UGTPHON, SIGMORPHON and Charsiu-repository Korean split files, verifies each Git blob SHA-1, records byte SHA-256 and sizes, checks UGTPHON row split labels, and reports raw-form and cross-dataset split intersections without emitting example text. It is run by the existing `.github/workflows/test.yml` matrix and uploads a metadata-only artifact. This is a source/split audit, not model training or permission to fine-tune.\n\n
## Charsiu repository's Korean data: overlap proxy, not checkpoint proof

The upstream Charsiu repository also exposes Korean `data/train/kor.tsv`, `data/dev/kor.tsv`, and `data/test/kor.tsv` at repository commit `0c929390759fb94f8ecdfc05cc0bc5f2ff2dc0f4` (file Git blob SHAs are pinned in `scripts/audit_teacher_corpus_splits.py`). Its source notes list `sources/info/others/ko_info.txt` with license marker `U/K` and `ko-2_info.txt` with MIT. This is mixed-source data with unresolved terms for at least one source. It is useful as an **overlap proxy** for assessing whether the public benchmark forms may already occur in Charsiu's published Korean data; it is not proof that this exact repository split was used to train the selected Hugging Face checkpoint.

The automated audit now verifies the Charsiu source file blob hashes and compares every benchmark split against every Charsiu-repository split, alongside within-dataset train/dev/test overlap. It reports only counts and file hashes, not corpus rows. The exact checkpoint training manifest remains unknown, so even zero observed overlap with these files would not prove that a test set was unseen by the checkpoint.

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
| Compute cross-split/cross-corpus overlap | PARTIAL pending exact-head CI | `scripts/audit_teacher_corpus_splits.py` verifies pinned Git blob IDs and emits overlap counts without copying corpus rows; the first exact-head workflow must confirm source schema and counts |
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
