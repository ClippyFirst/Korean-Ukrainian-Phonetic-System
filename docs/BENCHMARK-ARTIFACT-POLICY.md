# Benchmark artifact policy

**Scope:** the consolidated five-dataset workflow artifact named `multi-engine-korean-ipa-diagnostic` in `.github/workflows/multi-engine-ipa-benchmark.yml`. This policy does not silently redefine the separate MFA, teacher-corpus, neural-training, morphology or corpus-inventory workflows; each has its own retention and data contract.

## Allowed contents of the consolidated matrix artifact

The public artifact may contain exactly:

1. `korean-benchmark-aggregate-summary.json` — schema-validated aggregate metrics for six multi-engine tracks and fifteen Browser mode reports, plus source counts, source hashes, licence metadata, limitations and aggregate warning counts.
2. `open-korean-benchmarks-work/prepared/source-sha256.txt` — source file names and cryptographic checksums only.

The aggregate builder is `scripts/build_full_korean_benchmark_summary.py`. It delegates to `scripts/summarize_korean_benchmark_reports.py`, which retains only declared aggregate metric fields, strips per-occurrence records and removes K-SPAN row-level mismatch examples before JSON Schema validation. The builder additionally requires six multi-engine tracks and fifteen Browser reports; all five Browser-tested datasets to contain Strict, Soft and Super-soft reports; Super-soft candidate availability of 100% for each dataset; and K-SPAN status `WARN` with 22,843 discrepancies (Modern 13,078; Conservative 9,765).

## Prohibited contents

Do not upload raw source corpora or benchmark TSV/CSV files; per-token Hangul inputs, IPA references, engine predictions or occurrence ledgers; mismatch-fragment exports and unresolved review queues; holdout reviewer packets or packet manifests; raw preparation manifests containing row-level examples; or stdout dumps that reproduce token-level reports.

These files may exist temporarily on the isolated CI runner when required to execute tests and comparisons; they are not public benchmark artifacts and are not committed to the repository.

## Legacy artifacts that predate the corrected upload contract

The following consolidated-workflow artifacts were inspected and are **not aggregate-only**:

| Workflow run | Artifact | Created (UTC) | Expires (UTC) | Observed contents |
|---|---:|---|---|---|
| [42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896) | 13621335293 | 2026-11-08 14:19 | 2026-12-08 14:19 | Per-occurrence UGTPHON/SIGMORPHON reports, mismatch fragments/queue, predictions, reviewer packets and SIGMORPHON test TSV |
| [42778967197](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42778967197) | 13749341395 | 2026-11-10 08:48 | 2026-12-10 08:48 | Same row-level materials plus the raw K-SPAN preparation manifest with ten key/WorldBet examples |
| [42785083152](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42785083152) | 13750158865 | 2026-11-10 09:26 | 2026-12-10 09:26 | Per-occurrence UGTPHON/SIGMORPHON reports, mismatch fragments/queue, predictions, reviewer packets and SIGMORPHON test TSV; no raw K-SPAN preparation manifest |

The old bundles contain derived token-level diagnostics and licensed source extracts, not audio or a complete Seoul/K-SPAN/IPA-Dict corpus archive. Nevertheless, they violate the consolidated workflow's intended aggregate-only publication contract. They remain available until expiry unless the repository owner deletes them manually. The connected GitHub actions available in this session can list and download artifacts but cannot delete them. Do not claim that the legacy artifacts have been removed.

The current corrected workflow run [42796414336](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42796414336) is the first end-to-end verification of the new builder and upload allow-list. Mark the policy `DONE_VERIFIED` only after that run succeeds and the uploaded artifact is inspected to contain exactly the two allowed files.

## Separate workflow contracts

MFA diagnostic artifacts, teacher-corpus/train-dev artifacts, optional neural outputs, morphology diagnostics and corpus inventory artifacts are outside this file's consolidated-matrix allow-list. Their outputs can contain per-token or training material and must be evaluated against their own source licences, retention windows and documented research purpose. Do not infer that the aggregate-only matrix policy has been applied to them.

