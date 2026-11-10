# Korean G2P benchmark results — consolidated view (2026-11-08)

## Latest exact-head benchmark checkpoint — 2026-11-10

**Merged into main:** PR [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), merge `e8ebed5b9ccb67255209ccb20efa45ae0236bcbe`; measured PR head `18bafbe9d998f7fe818c9b65ec84d3b5098d6dfa`. Full matrix [run 42810042908](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042908) completed successfully.

### Completed matrix

| Dataset | Ten-engine track | Browser modes |
|---|---|---|
| UGTPHON | Strict IPA + Broad sensitivity | Strict / Soft / Super-soft |
| SIGMORPHON 2021 | Strict IPA + Broad sensitivity | Strict / Soft / Super-soft |
| Seoul Corpus SLR113 | Phonemic IPA sample | Full-corpus Hangul surface + phonemic IPA reports are separately available |
| K-SPAN 2.1 Modern | Strict IPA + Broad sensitivity | Strict / Soft / Super-soft |
| K-SPAN 2.1 Conservative | Strict IPA + Broad sensitivity | Strict / Soft / Super-soft |
| IPA-Dict Korean | Strict IPA + Broad sensitivity | Strict / Soft / Super-soft |

This is six ten-engine reference tracks across five datasets, plus fifteen Browser mode reports across five dataset families. Seoul's full-corpus Browser reports are separately evidenced by [run 42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257). The ten external engines are not labelled as Kozak Kim morphology modes.

### Source integrity and interpretation

- K-SPAN 2.1 source: 63,836 rows; 41,174 Hangul and 22,662 non-Hangul; zero unmatched NIKL WordNums.
- Key/WorldBet cross-representation differences: **WARN 22,843** (Modern 13,078; Conservative 9,765). IPA scoring uses the source WorldBet fields; key fields are separately audited. The warning is not converted to PASS.
- IPA-Dict is Wiktionary-derived and shares lineage with SIGMORPHON; it is not an independent holdout.
- Seoul reference is phonemic word-level IPA, not narrow phonetic gold.
- Browser engine errors: zero. One external `g2p-ko` error occurred on IPA-Dict; 999/1,000 occurrences were scored.
- Super-soft candidate-output availability is 100% on the five Browser-tested datasets. Availability is distinct from source-resolved scoring coverage and accuracy; heuristic/fallback rows are not counted as IPA gold matches.

### Aggregate artifact audit

Artifact [13766007256](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042908) was downloaded and inspected. It contains exactly two files: `korean-benchmark-aggregate-summary.json` (293,134 bytes) and `open-korean-benchmarks-work/prepared/source-sha256.txt` (410 bytes). The aggregate scope excludes token-level source text, IPA labels, mismatch examples and occurrence ledgers. JSON Schema validation passed during summary generation. ZIP SHA-256: `fa3281b337b60fccbf3ebc03796498325619138e2393ba54ddc9513c8d9598a3`.

Older artifacts `13621335293`, `13749341395` and `13750158865` remain stored until expiry/manual cleanup; the current GitHub integration cannot delete them. The corrected workflow does not retroactively sanitize them. See [benchmark artifact policy](BENCHMARK-ARTIFACT-POLICY.md).

### Verification boundary

PR-head workflows passed: Tests [42810042726](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042726), Verify [42810042823](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042823), master artifacts [42810042775](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042775), exhaustive register [42810043038](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810043038), UGTPHON [42810042906](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042906), and full matrix [42810042908](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042908). These are PR-head checks, not post-merge-main checks. ByT5, CharsiuG2P and neural pairing were skipped by policy.

**Status:** benchmark software/matrix = DONE_VERIFIED on the tested PR head; independent Korean IPA and Ukrainian target certification = BLOCKED; overall product = research prototype, not release-ready.

**Purpose:** one discoverable index of the measured Korean engines, scoring profiles, runtime modes, datasets, and external baselines. This page is a presentation layer over the canonical [benchmark suite register](KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md); the register remains the full historical and methodological source of truth.

## At a glance

- **10 engines** were compared on UGTPHON, SIGMORPHON 2021 Korean, Seoul phonemic IPA, K-SPAN Modern, K-SPAN Conservative and IPA-Dict Korean (six reference tracks across five datasets).
- **15 Browser reports** cover Strict / Soft / Super-soft on UGTPHON, SIGMORPHON, K-SPAN Modern, K-SPAN Conservative and IPA-Dict; Seoul's six full-corpus Browser reports are separately evidenced.
- **3 Kozak Kim modes** were run on Seoul Corpus SLR113 for both Hangul surface pronunciation and phonemic IPA.
- **2 MFA v2.0.0 model variants** (Hangul / Jamo) were run on UGTPHON and SIGMORPHON. These are one MFA model family, not two independent engines.
- **SIGMORPHON Browser Strict / Soft / Super-soft is executed** on 999 eligible occurrences; candidate availability is 99.8999%, 99.8999% and 100%, respectively.
- **ByT5 and CharsiuG2P inference were skipped** under the default-off research policy; they have no current results in this run.

## Executable five-dataset matrix — results completed 2026-11-10

The five-dataset matrix is **scored and completed** in [run 42785083152](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42785083152): six 10-engine tracks (UGTPHON, SIGMORPHON, Seoul phonemic IPA, K-SPAN Modern, K-SPAN Conservative, IPA-Dict) and fifteen Browser reports across five datasets. The exact-head rerun [42796414336](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42796414336) validates the revised aggregate-only artifact builder and final workflow integration; its completion and artifact inspection remain required before merge.

| Dataset | Evaluation tracks | Current evidence state |
|---|---|---|
| UGTPHON | 10-engine Strict/Broad; Browser Strict/Soft/Super-soft | Executed; 2,703 eligible occurrences |
| SIGMORPHON 2021 | 10-engine Strict/Broad; Browser Strict/Soft/Super-soft | Executed; 999 eligible pairs from 1,000 raw rows |
| Seoul Corpus SLR113 | Full-corpus Browser Hangul surface and phonemic IPA modes; 1,000-occurrence 10-engine phonemic-IPA sample | Executed; 231,626 surface and 231,625 phonemic-IPA pairs |
| K-SPAN 2.1 | 1,000 Modern + 1,000 Conservative sampled word types; 10 engines and compatible Browser modes | Executed; 63,836-row source join; key/WorldBet cross-representation warning retained |
| IPA-Dict Korean | 1,000-word residual sample after exact overlap exclusion; 10 engines and compatible Browser modes | Executed; shares Wiktionary lineage with SIGMORPHON, not an independent holdout |

There are **five datasets and seven reference tracks**: UGTPHON (1), SIGMORPHON (1), Seoul (2), K-SPAN Modern/Conservative (2), IPA-Dict (1). The two K-SPAN variants must not be counted as separate datasets.

**Scoring contract:** ten engines use Strict-IPA and Broad-candidate diagnostic profiles. Strict/Soft/Super-soft are ClippyFirst Browser modes, not external-engine modes. Candidate output availability and source-resolved IPA scoring coverage are separate; Super-soft provides a candidate for 100% of eligible inputs across all five Browser-tested datasets, but heuristic/fallback candidates do not count as source-resolved accuracy.

See the [canonical matrix, source pins and rights boundaries](KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md) and [benchmark artifact policy](BENCHMARK-ARTIFACT-POLICY.md).

## Long-term speech-corpus acquisition portfolio — five selected sources

This historical acquisition portfolio contains five sources selected for broad domain coverage. It is not the current executable five-dataset matrix above: KsponSpeech and NIKL Daily Conversation remain access/terms-gated future candidates and are not currently scored.

| Dataset | Reference type / scale | Current status | What is still needed |
|---|---|---|---|
| **UGTPHON Korean test** | Noisy/user-generated Korean; 2,703 eligible token occurrences with IPA annotations | <badge color="success">Executed</badge> Multi-engine Strict/Broad; Kozak Kim three modes | SIGMORPHON/Seoul remain separate domains; expand mode coverage where compatible |
| **SIGMORPHON 2021 Korean (WikiPron-derived)** | Lexical word/IPA file; 1,000 raw rows, 999 eligible | <badge color="success">Executed</badge> Multi-engine Strict/Broad; three-mode Kozak Kim track is pending exact-main verification | Verify three-mode artifact; document possible Wiktionary lineage overlap |
| **Seoul Corpus / OpenSLR SLR113** | Spontaneous speech labels; 231,626 Hangul surface pairs and 231,625 phonemic IPA pairs | <badge color="success">Executed</badge> Three modes on both surface and phonemic-IPA tracks | Independent review of phonemic adapter; preserve CC BY-NC 2.0 restrictions |
| **KsponSpeech** | 969 hours / 622,545 utterances reported; spelling and pronunciation transcriptions | <badge color="warning">Access/terms blocked</badge> Selected candidate, not scored | Obtain AIHub corpus and verify exact reuse terms; then score surface Hangul first |
| **NIKL Daily Conversation Speech Corpus 2022 v1.0** | 630+ hours, 2,000+ speakers; spelling/pronunciation transcription | <badge color="warning">Access/terms blocked</badge> Selected candidate, not scored | Apply through NIKL, obtain exact package and verify corpus-specific terms; then score surface Hangul |

**Historical counting rule:** this long-term acquisition portfolio contains five sources, of which three have executed tracks and two remain access/terms-gated. The current executable matrix and its seven reference tracks are described separately above.

### Additional candidates and resources — outside the long-term acquisition portfolio

- **Mun, Kim & Ko (2022), 130-row hand-transcribed G2P gold:** high-value rule-phenomenon challenge candidate; blocked because the upstream repository exposes no data reuse licence. Requires written permission or a separately licensed release.
- **LDC2003L02 Korean Telephone Conversations Lexicon:** 25,251 lexical entries; paid LDC licence required. Potential sixth candidate, not acquired/scored.
- **Korean Word-IPA Dictionary / IPA-Dict Korean subset:** 62,676 entries reported by an external catalogue; included as a 1,000-word residual sample in the current executable matrix, with exact overlap excluded. It shares Wiktionary lineage with SIGMORPHON/WikiPron and is not an independent gold set.
- **Zeroth-Korean / OpenSLR SLR40:** CC BY 4.0 speech/lexicon resource; schema and lexicon phone provenance still need audit. ASR transcripts alone are not G2P pronunciation gold.
- **KoBALT-700:** useful for designing phonology challenge categories, but its multiple-choice tasks are not direct word-to-IPA gold.
- **CJKI Korean Phonetic Database and Nexdata Korean Pronunciation Dictionary:** commercial resources; excluded absent appropriate licences.
- **SIGMORPHON 2024:** not counted as a Korean dataset; documented task orthography groups do not establish a Hangul Korean split.

These distinctions and source-level details are recorded in the [canonical benchmark suite register](KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md#2026-11-08--long-term-five-corpus-acquisition-portfolio).

## 1. Ten-engine comparison — Strict IPA and Broad sensitivity

<text>Source: [multi-engine workflow run 42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896), artifact [13621335293](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896/artifacts/13621335293), benchmark code head `b548436d0fce9af4672fc5902d6670cbc134bd70`. The run completed successfully. The tables below are transcribed from its workflow output and the register.</text>

**Strict IPA** — Exact is scored-only; CER is character error rate. Native abstained on one eligible occurrence per dataset; external engines scored all eligible rows.

| Engine | UGTPHON Exact | UGTPHON CER | SIGMORPHON Exact | SIGMORPHON CER |
|---|---:|---:|---:|---:|
| ClippyFirst Native | 52.7387% (1,425/2,702) | 9.0130% | 35.9719% (359/998) | 14.5347% |
| g2pK 0.9.4 | 53.0892% (1,435/2,703) | 9.2328% | 35.3353% (353/999) | 14.8222% |
| g2p-ko 1.0.0 | 52.4602% (1,418/2,703) | 9.3928% | 35.6356% (356/999) | 14.6970% |
| KoG2Padvanced 2022 | 47.3178% (1,279/2,703) | 10.6815% | 32.6326% (326/999) | 15.8237% |
| phonemize 2.0.1 | 42.5453% (1,150/2,703) | 14.3531% | 28.9289% (289/999) | 17.4387% |
| KoG2P 2019 | 27.3030% (738/2,703) | 19.5122% | 18.7187% (187/999) | 21.8327% |
| kokorog2p 0.9.15 | 18.3130% (495/2,703) | 26.5352% | 9.6096% (96/999) | 30.7336% |
| HAMA 1.7.0 | 16.9071% (457/2,703) | 25.1081% | 12.7127% (127/999) | 27.6164% |
| hangul_to_ipa 2026 | 16.2412% (439/2,703) | 24.8054% | 8.9089% (89/999) | 29.8448% |
| eSpeak NG Korean | 8.1391% (220/2,703) | 33.6101% | 4.3043% (43/999) | 40.7236% |

**Broad-candidate sensitivity** — exact and CER under the shared research-only Broad profile. This intentionally collapses selected distinctions; it is not normative IPA gold. Values are from the same exact-head run, not the older pre-R013 table.

| Engine | UGTPHON Broad Exact | UGTPHON Broad CER | SIGMORPHON Broad Exact | SIGMORPHON Broad CER |
|---|---:|---:|---:|---:|
| ClippyFirst Native | 86.2324% (2,330/2,702) | 2.1366% | 69.8397% (697/998) | 6.1538% |
| g2pK 0.9.4 | 85.7196% (2,317/2,703) | 2.3738% | 68.6687% (686/999) | 6.4584% |
| g2p-ko 1.0.0 | 84.8317% (2,293/2,703) | 2.5401% | 69.0691% (690/999) | 6.3140% |
| KoG2Padvanced 2022 | 70.2923% (1,900/2,703) | 4.9274% | 59.7598% (597/999) | 8.7818% |
| phonemize 2.0.1 | 70.3293% (1,901/2,703) | 7.7328% | 58.2583% (582/999) | 9.3069% |
| KoG2P 2019 | 40.7695% (1,102/2,703) | 13.3525% | 34.5345% (345/999) | 14.3870% |
| kokorog2p 0.9.15 | 28.4869% (770/2,703) | 20.3884% | 20.4204% (204/999) | 23.1819% |
| HAMA 1.7.0 | 28.3019% (765/2,703) | 18.9768% | 27.5275% (275/999) | 19.9921% |
| hangul_to_ipa 2026 | 25.7492% (696/2,703) | 19.6062% | 17.2172% (172/999) | 23.4839% |
| eSpeak NG Korean | 12.0607% (326/2,703) | 29.9195% | 6.7067% (67/999) | 36.3350% |

**Interpretation:** Strict and Broad are separate scoring profiles, not runtime modes. Broad scores are sensitivity diagnostics only. On UGTPHON, g2pK has a slightly higher Strict Exact than Native, while Native has lower Strict CER; on SIGMORPHON, Native leads both Strict Exact and CER. The two datasets do not establish one universal winning engine. External predictions are compared through the project's IPA representation adapter, so this is not a fully independent end-to-end IPA representation stack for every engine.

## 2. Kozak Kim Browser operating modes — UGTPHON

Same 2,703 eligible occurrences. These are three actual Browser runtime policies, not three different engines.

| Mode | IPA profile | Source-resolved scored | Scored coverage | Exact scored-only | Coverage-adjusted Exact | CER | Heuristic | Typed fallback | Engine errors |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Strict | `clippyfirst-korean-broad-v1` | 2,702 | 99.9630% | 52.7387% | 52.7192% | 9.0130% | 0 | 0 | 0 |
| Soft | `browser-legacy-contextual-v1` | 2,423 | 89.6411% | 54.7668% | 49.0936% | 7.8785% | 280 | 0 | 0 |
| Super-soft | `browser-super-soft-maximum-coverage-v1` | 2,239 | 82.8339% | 56.1858% | 46.5409% | 7.8191% | 464 | 0 | 0 |

Candidate output availability is different from source-resolved scored coverage: Strict 2,702/2,703 (99.9630%); Soft 2,703/2,703 (100%, including 280 explicitly heuristic rows); Super-soft 2,703/2,703 (100%, including 464 explicitly heuristic rows). Heuristic candidates are not source-resolved accuracy wins. Soft and Super-soft's higher scored-only Exact is a selection effect; coverage-adjusted Exact is lower than Strict.

**Native ↔ Browser parity:** on UGTPHON, all 2,703 occurrence IDs and surface-Hangul outputs matched; raw and Broad IPA matched 2,702/2,702 resolved cases (100%). This proves parity for that strict configuration and dataset, not for all possible inputs or Soft/Super-soft.

## 3. Seoul Corpus SLR113 — Hangul surface pronunciation

Label-only TextGrid evaluation; audio was not used. The aligned reference contains 231,626 Hangul-only word occurrences. This is surface pronunciation, not IPA or Ukrainian target validation.

| Mode | Source-resolved scored | Scored coverage | Candidate availability | Exact scored-only | Coverage-adjusted Exact | CER | Heuristic | Typed fallback | Unresolved |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Strict | 224,764/231,626 | 97.0375% | 97.0375% | 57.1537% | 55.4605% | 24.5421% | 0 | 0 | 6,862 |
| Soft | 201,516/231,626 | 87.0006% | 98.2502% | 56.2055% | 48.8991% | 26.3641% | 26,057 | 0 | 4,053 |
| Super-soft | 193,390/231,626 | 83.4924% | 100% | 56.8509% | 47.4662% | 26.3118% | 38,207 | 29 | 0 |

Strict has the best coverage-adjusted Exact and lowest CER here. On the common scored subset, Strict wins 778 exact cases over Soft (zero Soft wins) and 771 over Super-soft (zero Super-soft wins). Soft and Super-soft have identical source-resolved outputs on their 193,390 common cases; Super-soft changes status/fallback classification, not those predictions.

## 4. Seoul Corpus SLR113 — phonemic IPA

The 36-symbol adapter produces 231,625 word-level phonemic IPA pairs. This is **phonemic**, not narrow phonetic gold; allophonic detail, speaker variation and release properties are not represented. Treat Exact/CER as diagnostics, not narrow-IPA acceptance.

| Mode | Source-resolved scored | Scored coverage | Candidate availability | Exact scored-only | Coverage-adjusted Exact | CER | Broad candidate Exact | Broad candidate CER | Heuristic | Typed fallback |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Strict | 224,763/231,625 | 97.0375% | 97.0375% | 14.1166% | 13.6984% | 39.9210% | 14.1224% | 40.1832% | 0 | 0 |
| Soft | 201,515/231,625 | 87.0005% | 98.2502% | 14.7969% | 12.8734% | 40.8696% | 14.8034% | 41.1359% | 26,057 | 0 |
| Super-soft | 193,389/231,625 | 83.4923% | 100% | 15.3788% | 12.8402% | 40.4053% | 15.3856% | 40.6759% | 38,207 | 29 |

Low IPA Exact/CER performance must be interpreted in light of the mismatch between phonemic reference conventions and the engine's phonetic/allophonic output profile. Do not infer that the Ukrainian renderer is poor from this Korean IPA scoring alone; the target layer is not tested here.

## 5. External MFA Korean G2P v2.0.0 baseline

Source: [MFA workflow run 42513951588](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588), artifact [13630946780](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588/artifacts/13630946780). MFA is one model family with Hangul and Jamo input variants. Strict grapheme handling, top-1 output and a 56-symbol allow-list are used.

| Dataset | MFA variant | Candidate availability | Exact scored-only | CER | PER | Feature-weighted error proxy | Engine errors |
|---|---|---:|---:|---:|---:|---:|---:|
| UGTPHON (2,703) | Hangul | 99.0381% (2,677) | 15.1289% | 27.3038% | 28.5421% | 9.7728% | 0 |
| UGTPHON (2,703) | Jamo | 100% (2,703) | 16.0562% | 24.5200% | 25.5353% | 6.3079% | 0 |
| SIGMORPHON (999 eligible) | Hangul | 99.8999% (998) | 24.6493% | 17.3079% | 20.6270% | 4.2841% | 0 |
| SIGMORPHON (999 eligible) | Jamo | 100% (999) | 24.8248% | 17.1632% | 20.4528% | 4.0951% | 0 |

The SIGMORPHON TSV has 1,000 raw rows; the shared scorer admits 999 eligible occurrences. The one excluded row remains outside the scoring denominator. MFA is comparison-only, not part of the production pipeline. Its phone-to-IPA identity assumption and training-data overlap still need independent review.

## 6. Mode/dataset completeness matrix — refreshed 2026-11-10

| Dataset / reference | 10-engine Strict | 10-engine Broad | Browser Strict | Browser Soft | Browser Super-soft | MFA Hangul/Jamo |
|---|---|---|---|---|---|---|
| UGTPHON | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** |
| SIGMORPHON 2021 Korean | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** |
| Seoul SLR113 Hangul surface | n/a | n/a | **EXECUTED** | **EXECUTED** | **EXECUTED** | n/a |
| Seoul SLR113 phonemic IPA | **EXECUTED** (1,000-occurrence sample) | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** | n/a |
| K-SPAN Modern | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** | n/a |
| K-SPAN Conservative | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** | n/a |
| IPA-Dict Korean | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** | **EXECUTED** | n/a |
| Independent Ukrainian target gold | n/a | n/a | **NOT AVAILABLE** | **NOT AVAILABLE** | **NOT AVAILABLE** | n/a |

The executable portfolio contains **five datasets and seven reference tracks**: UGTPHON (1), SIGMORPHON (1), Seoul (2), K-SPAN Modern/Conservative (2), and IPA-Dict (1). K-SPAN Modern and Conservative are two tracks within one dataset. The consolidated workflow's aggregate summary combines six multi-engine tracks and fifteen Browser reports; Seoul's six full-corpus Browser reports remain separately evidenced by run [42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257).

**Not executed / not scored:** ByT5 inference, CharsiuG2P inference, KsponSpeech, NIKL Daily Conversation Speech Corpus 2022, and the Mun/Kim/Ko 130-row hand-transcribed gold (reuse permission unresolved). These are not zero scores and must not be shown as benchmark failures or passes. The official NIKL metadata-only inventory was skipped by policy; the NIKL MKUFS2 index was used only for K-SPAN WordNum joining, not as a scored IPA dataset.

## 7. How to read the metrics

- **Exact (scored-only):** exact string match among source-resolved outputs only.
- **Coverage-adjusted Exact:** exact matches divided by all eligible occurrences; abstentions do not disappear from the denominator.
- **Source-resolved coverage:** outputs eligible for accuracy scoring divided by all eligible occurrences; excludes heuristic/fallback-only candidates.
- **Candidate output availability:** non-empty candidate outputs divided by all eligible occurrences; may include explicitly labelled heuristic or typed fallback candidates. It is not accuracy.
- **CER:** character error rate under the benchmark's IPA serialization and normalization.
- **PER:** phoneme error rate; do not confuse with CER or the feature-weighted project proxy.
- **Feature-weighted error proxy:** project-defined diagnostic, not a standardized external metric.
- **Strict vs Broad:** different normalization/scoring profiles. Broad is deliberately lossy and research-only.
- **Strict / Soft / Super-soft:** runtime operating modes for Kozak Kim; not modes that can be applied to unrelated third-party engines.

Do not pool datasets or report one blended headline score: UGTPHON is noisy user-generated text, SIGMORPHON is a lexical paired file, and Seoul SLR113 is spontaneous speech with a different annotation convention.

## 8. Evidence and reproduction links

- [10-engine + UGTPHON Browser mode + parity run 42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896) · [artifact 13621335293](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896/artifacts/13621335293).
- [Seoul surface + phonemic IPA mode run 42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257) · artifact 13623457737.
- [MFA Hangul/Jamo run 42513951588](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588) · [artifact 13630946780](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588/artifacts/13630946780).
- Full historical notes, source lineage, acceptance gates and previous runs: [Korean benchmark suite register](KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md).


## 9. Consolidated five-dataset results — 2026-11-10

Source: [full matrix run 42785083152](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42785083152). Each open-dataset track uses a 1,000-occurrence sample. The table below records only the highest scored-only Exact on each track; it is not a cross-dataset leaderboard.

| Reference track | Highest Exact | Engine | CER | Notes |
|---|---:|---|---:|---|
| Seoul phonemic IPA | 21.200% (212/1,000) | KoG2P 2019 | 32.024% | Phonemic reference; not narrow phonetic gold |
| K-SPAN Modern | 25.000% (250/1,000) | KoG2P 2019 | 15.645% | Source WorldBet Modern reference |
| K-SPAN Conservative | 18.800% (188/1,000) | KoG2P 2019 | 16.150% | Source WorldBet Conservative reference |
| IPA-Dict Korean | 41.265% (411/996) | ClippyFirst Native | 9.934% | Native abstained on four of 1,000 eligible occurrences |

No Native runtime errors occurred. One external `g2p_ko_1_0_0` engine error occurred on IPA-Dict (999/1,000 scored); it is retained in the report rather than hidden. Other external engines completed the four open tracks without engine-loop errors.

### Browser mode availability and source-resolved scoring

Candidate availability counts any non-empty candidate, including explicitly labelled heuristic/fallback candidates. Source-resolved coverage is the fraction eligible for accuracy scoring. These are different measures.

| Dataset | Mode | Source-resolved scored / eligible | Candidate availability | Exact scored-only | Coverage-adjusted Exact | CER | Heuristic / fallback |
|---|---|---:|---:|---:|---:|---:|---:|
| UGTPHON | Strict | 2,702/2,703 | 99.9630% | 52.7387% | 52.7192% | 9.0130% | 0 / 0 |
| UGTPHON | Soft | 2,423/2,703 | 100% | 54.7668% | 49.0936% | 7.8785% | 280 / 0 |
| UGTPHON | Super-soft | 2,239/2,703 | 100% | 56.1858% | 46.5409% | 7.8191% | 464 / 0 |
| SIGMORPHON | Strict | 998/999 | 99.8999% | 35.8717% | 35.8358% | 14.5598% | 0 / 0 |
| SIGMORPHON | Soft | 987/999 | 99.8999% | 35.6636% | 35.2352% | 13.9517% | 11 / 0 |
| SIGMORPHON | Super-soft | 942/999 | 100% | 35.7749% | 33.7337% | 13.9085% | 57 / 0 |
| K-SPAN Modern | Strict | 994/1,000 | 99.400% | 10.8652% | 10.800% | 27.7898% | 0 / 0 |
| K-SPAN Modern | Soft | 974/1,000 | 99.900% | 10.0616% | 9.800% | 28.3998% | 25 / 0 |
| K-SPAN Modern | Super-soft | 915/1,000 | 100% | 10.4918% | 9.600% | 28.1206% | 85 / 0 |
| K-SPAN Conservative | Strict | 993/1,000 | 99.300% | 7.5529% | 7.500% | 27.4537% | 0 / 0 |
| K-SPAN Conservative | Soft | 976/1,000 | 99.700% | 6.2500% | 6.100% | 28.2946% | 21 / 0 |
| K-SPAN Conservative | Super-soft | 919/1,000 | 100% | 6.3112% | 5.800% | 28.2485% | 81 / 0 |
| IPA-Dict Korean | Strict | 996/1,000 | 99.600% | 41.2651% | 41.100% | 9.9335% | 0 / 0 |
| IPA-Dict Korean | Soft | 975/1,000 | 99.800% | 41.6410% | 40.600% | 9.1205% | 23 / 0 |
| IPA-Dict Korean | Super-soft | 923/1,000 | 100% | 40.7367% | 37.600% | 9.2522% | 77 / 1 |

Browser engine errors were zero in these fifteen reports. The single typed fallback is on IPA-Dict Super-soft. Soft/Super-soft may show a higher scored-only Exact because heuristic cases are excluded from the scored denominator; coverage-adjusted Exact is the appropriate all-eligible comparison.

### K-SPAN join and cross-representation warning

The pinned K-SPAN 2.1 join contains 63,836 observations: 41,174 Hangul rows, 22,662 non-Hangul rows and zero unmatched NIKL WordNum joins. Official Table 1 maps source WorldBet fields directly to IPA; parallel key fields are audited independently.

- Total key/WorldBet discrepancies: **22,843**.
- Modern: **13,078**.
- Conservative: **9,765**.
- Status: **WARN**, not PASS.

This is a source cross-representation discrepancy, not permission to rewrite source labels. The benchmark retains all source rows and does not silently drop or normalize disagreements.

### IPA-Dict lineage and interpretation

IPA-Dict Korean contributes a 1,000-word residual sample after exact orthographic overlap exclusion against UGTPHON, SIGMORPHON and K-SPAN. Its Korean source is credited to the Korean Word-IPA Dictionary/Wiktionary lineage, shared with SIGMORPHON/WikiPron. It is supplementary lexical coverage, not an independent holdout.

### Artifact verification status

Run 42785083152 completed scoring and the open-dataset aggregate summary's JSON Schema validation, but inspection showed that its uploaded workflow bundle still contained row-level UGTPHON/SIGMORPHON reports, mismatch CSVs, predictions, reviewer packets and the SIGMORPHON source TSV. The workflow has since been changed to publish only the combined aggregate summary and source checksums. Exact-head integration [42796414336](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42796414336) must finish and its artifact be inspected before the aggregate-only policy is marked DONE_VERIFIED. See [benchmark artifact policy](BENCHMARK-ARTIFACT-POLICY.md).


---

**Status:** the result tables above are measured diagnostic evidence, not release certification. None of these Korean G2P comparisons independently validates IPA→Ukrainian target accuracy.
