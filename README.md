# Korean–Ukrainian Phonetic System

## Exact-main benchmark checkpoint — 2026-11-08

The path-filtered multi-engine workflow completed successfully on main benchmark code commit `b548436d0fce9af4672fc5902d6670cbc134bd70`: [run 42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896), artifact `13621335293` (SHA-256 `c286d7e4f1ee02d40e1a9977e792eeb73bce12b32b658a8b3c4166c612ccc1a8`). The run contains the 10-engine UGTPHON and SIGMORPHON reports, per-occurrence mismatch ledger, unresolved review queue, three Browser Kozak Kim mode reports, Native/Browser parity report, and readiness audit. This is the current-main benchmark code snapshot; later documentation-only main commit(s) do not change the measured runtime.

### Ten-engine Strict IPA results

| Engine | UGTPHON exact | UGTPHON CER | SIGMORPHON exact | SIGMORPHON CER |
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

The Native path abstained on one eligible occurrence in each dataset (2,702/2,703 UGTPHON; 998/999 SIGMORPHON); all other engines scored all eligible occurrences. On UGTPHON, g2pK has a marginally higher scored-only Exact rate, while Native has lower CER. On SIGMORPHON, Native leads both Exact and CER. This is not a universal winner claim. Broad-profile sensitivity results are separately recorded in the README and full artifact; the profile is research-only and deliberately lossy.

### Three Browser Kozak Kim modes — same 2,703 UGTPHON occurrences

| Mode | IPA profile | Source-resolved scored | Coverage | Exact (scored-only) | Coverage-adjusted Exact | CER | Heuristic rows | Typed fallback rows |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Strict | clippyfirst-korean-broad-v1 | 2,702 | 99.963% | 52.7387% | 52.7192% | 9.0130% | 0 | 0 |
| Soft | browser-legacy-contextual-v1 | 2,423 | 89.641% | 54.7668% | 49.0936% | 7.8785% | 280 | 0 |
| Super-soft | browser-super-soft-maximum-coverage-v1 | 2,239 | 82.834% | 56.1858% | 46.5409% | 7.8191% | 464 | 0 |

Important interpretation: these are three separate runtime policies and three different IPA profile IDs. The Soft/Super-soft scored-only Exact and CER are calculated only on their source-resolved rows; their coverage-adjusted Exact makes the abstention/heuristic trade-off visible. Soft and Super-soft's higher scored-only Exact must not be read as accuracy improvement: they score fewer source-resolved rows and have 280/464 heuristic rows, respectively. No typed fallback was emitted in this particular UGTPHON run. The earlier morphology-consensus Soft result (100% coverage on its separate harness) is a different benchmark protocol and must not be substituted for this Browser mode-specific report.

### Native/Browser parity

The exact-head parity report matched all 2,703 occurrence identities and all 2,703 surface-Hangul outputs. On the 2,702 resolved occurrences, raw IPA and broad IPA matched 2,702/2,702 (100%); coverage/abstention states also matched. Both sides declared `clippyfirst-korean-broad-v1`, version 1, with the same profile contract. This establishes measured parity for the strict configuration on this dataset, not universal parity across every rule/input or the Soft/Super-soft modes.

### Remaining evidence limits

- The Broad sensitivity profile remains `research-only-unadjudicated`; its feature collapses are documented and are not normative IPA gold.
- UGTPHON has been inspected during project research; SIGMORPHON is a public paired lexical file with transcription-convention and possible training-overlap limitations.
- The two benchmark datasets do not validate Ukrainian target rendering.
- Neural ByT5 and CharsiuG2P jobs were skipped under the existing default-off research policy.
- Seoul Corpus, KsponSpeech, and NIKL 2022 remain separate access/terms/format-gated corpus candidates; they are not included in this run.

Reproduce from [run 42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896), artifact `13621335293`.

Evidence-scoped Korean → Ukrainian phonetic rendering research prototype with a two-page browser service. The system separates Korean phonology and IPA from Ukrainian target adaptation, and preserves typed uncertainty rather than guessing unsupported pronunciations.

## Current status — 2026-11-08

**Integration branch:** `main`. **Latest runtime integration:** PR [#461](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/461), squash merge `b014d0107a47c3117c7dcbdd8d403f7fca3c7d41` (40 source adjudications). **Audio acceptance clarification:** PR [#460](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/460), squash merge `1e97152e505c75fe294d56befd978789b719d59e`. Earlier feature and maintenance integrations remain documented in the audit history.

### What the 236 cases mean

The reconstructed 236-row cohort is **not 236 independently confirmed phonological rules**:

| Cohort disposition | Rows | What is actually established |
|---|---:|---|
| Exact standard-form runtime dispositions | 15 | Ten exact integrations plus five pre-existing exact licenses; no spelling rewrite |
| Profile-convention decisions | 181 | Bounded broad/narrow or transcription-profile distinctions; not 181 new categorical rules or speaker-level IPA gold |
| Original abstentions | 12 | Engine policy explicitly decided under the no-audio constraint; speaker-specific IPA remains unresolved |
| Previously unadjudicated residuals | 28 | Engine policy explicitly decided under the no-audio constraint; speaker-specific IPA remains unresolved |
| **Total** | **236** | Reconstructed candidate cohort; original historical selector membership is not independently proven |

Thus, **15/236 have exact standard-form runtime dispositions**. The 181 are handled as bounded profile decisions/non-promotions, not as a set of new production rules. The remaining 40 have accepted source-based engine-policy dispositions without audio (including conditional phrase-mode behavior where word boundaries are explicit), while **40/40 speaker-specific narrow IPA annotations remain optional and out of scope**. PR [#461](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/461) integrates all 17 adjudication families / 40 occurrence IDs into the browser and Python runtime metadata registry; the two normalized `ㅠ` emoticon rows remain non-matched until raw-span offsets are revalidated. The original 236/239 cohort membership is reconstructed, not proven from the original selector/member list. The 2026-11-07 source-only matrix crosswalks 17 spellings to all 40 residual occurrences. NIKL Rule 5 liaison provenance is retained through the IPA adapter: `삶의` has source-supported [살믜]/[살메] variants and `협의` has [혀븨]/[혀비]; ordinary consonant-onset `ㅢ` remains distinct. These are standard/source-backed policy variants, not speaker-specific IPA gold. See the [236-case integration record](docs/KOZAK-KIM-236-ENGINE-INTEGRATION-2026-11-06.md), [40-case policy record](docs/KOZAK-KIM-40-NO-AUDIO-ADJUDICATION-2026-11-06.md), [40-case source-only matrix](docs/KOZAK-KIM-40-SOURCE-ONLY-ADJUDICATION-2026-11-07.md), and machine-readable registers.

### Kozak Kim: three modes, three separate benchmark tracks

Kozak Kim is one deterministic engine with three operating policies—not three independent engines. They must be reported separately:

| Mode | Contract | Benchmark status |
|---|---|---|
| **Strict** | Source-licensed rules and exact lexical evidence; abstains/marks unresolved when the evidence does not license a decision. | **Measured diagnostic.** Current ten-engine UGTPHON and SIGMORPHON comparisons measure this strict path; they do not measure Ukrainian target accuracy. |
| **Soft** | Opt-in, closed-set low-confidence hypotheses for selected formal endings (R002/R003/R007); it does not generalize to substantive liaison or cross-whitespace rules. | **Measured diagnostic on UGTPHON.** Run [42487169477](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487169477): 2,703/2,703 coverage, 1,425 exact (52.7192%), CER 9.0123%. On the 2,702 shared occurrences, Soft and Strict had identical Exact and CER; Soft resolved one additional occurrence and changed three unique words/statuses. Other corpora and the 236-case cohort remain unscored for Soft. |
| **Super-soft** | Browser-only maximum-coverage tier with low-confidence fallbacks and typed orthographic-phonemic IPA fallback; provisional fragments are visibly bracketed. | **Measured diagnostic, not accuracy acceptance.** Exact-main browser run 42487350896: 2,239/2,703 source-resolved scored (82.834% coverage), 1,258 exact (56.1858% scored-only; 46.5409% coverage-adjusted), CER 7.8191%; 464 heuristic rows, zero typed fallback rows. Separate IPA profile; see the exact-main checkpoint above. |

Do not transfer Strict scores to Soft or Super-soft. Each mode needs its own coverage, abstention/fallback, Exact and CER report on identical occurrence IDs, plus paired mode deltas and a separate broad-IPA sensitivity view. Super-soft fallback outputs must be stratified and must not be counted as source-resolved IPA accuracy. The 236-case cohort is not a 236-row gold set: retain the 15 exact standard-form, 181 profile-convention, and 40 source-policy strata, and leave unsupported rows unscored rather than manufacturing broad-IPA gold. The ordinary g2pK path is a separate comparator, not a fourth Kozak mode. Full contracts and acceptance criteria: [three-mode methodology and benchmark protocol](docs/methodology.md#mode-specific-benchmark-contract-three-separate-kozak-kim-result-sets).

### Latest measured pronunciation benchmarks

The latest paired Native/g2pK diagnostic is from PR #456; the complete multi-engine diagnostic was rerun successfully on PR #457. These are Korean G2P comparisons, **not Ukrainian transcription accuracy**:

| Dataset / engine | Scored | Exact match | CER | Coverage |
|---|---:|---:|---:|---:|
| UGTPHON Korean test — Native | 2,702 | 52.7387% (1,425) | 9.0130% | 99.9630% |
| UGTPHON Korean test — g2pK 0.9.4 | 2,703 | 53.0892% (1,435) | 9.2328% | 100% |
| SIGMORPHON 2021 Korean test — Native | 998 | 35.9719% (359) | 14.5347% | 99.90% of 999 eligible |
| SIGMORPHON 2021 Korean test — g2pK 0.9.4 | 999 | 35.3353% (353) | 14.8222% | 100% |

- UGTPHON paired comparison (run [42414467883](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42414467883)): 2,702 shared occurrences; g2pK coverage-adjusted exact-match delta versus Native `+0.003701`, while its CER delta is `+0.002207` (higher is worse). Native abstained on one occurrence; g2pK abstained on none. Diagnostic only, not normative gold.
- SIGMORPHON paired comparison in [multi-engine run 42416681855](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681855): 998 shared words: Native 359/998 (35.9719%) versus g2pK 353/998 (35.3707%) on the paired denominator, so Native leads exact match by 0.6012 percentage points; paired CER is 14.5347% versus 14.8106%, a 0.2759-point Native advantage. The Native engine abstained on one word.
- Multi-engine SIGMORPHON diagnostic: Native was 359/998 exact (35.9719%), ahead of g2pK (353/999; 35.3353%) and the other installed deterministic/phonemizer baselines in that run. This is a dataset- and convention-specific diagnostic, not proof of normative accuracy.
- CharsiuG2P and ByT5 inference were skipped by policy; no neural score is claimed.

Evidence: [latest paired Native/g2pK diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42414467883), [source-only PR #456](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/456), and its exact-head [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42414467840). The complete [multi-engine diagnostic PR #457 run](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681855) passed, including the queue byte comparison, Browser Kozak Kim parity, and SIGMORPHON lexical benchmark. The earlier run [42414467825](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42414467825) failed only because generated CSV line endings differed from the committed canonical representation; PR #457 pins the format and verifies the exact output. PR #457's [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681845), [Python/browser test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681848), [research artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681843), and [exhaustive test-case extraction](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681889) all passed. Historical mandatory baseline runs [42226435101](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42226435101) and [42226435403](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42226435403) remain linked as earlier evidence, not as the latest benchmark.



### Latest full multi-engine diagnostic

The successful pinned run 42416681855 also compared ten engines, not only Native and g2pK:

| Engine | UGTPHON exact | UGTPHON CER | SIGMORPHON exact | SIGMORPHON CER |
|---|---:|---:|---:|---:|
| ClippyFirst Native | 52.7387% | 9.0130% | 35.9719% | 14.5347% |
| g2pK 0.9.4 | 53.0892% | 9.2328% | 35.3353% | 14.8222% |
| g2p-ko 1.0.0 | 52.4602% | 9.3928% | 35.6356% | 14.6970% |
| KoG2Padvanced 2022 | 47.3178% | 10.6815% | 32.6326% | 15.8237% |
| phonemize 2.0.1 | 42.5453% | 14.3531% | 28.9289% | 17.4387% |
| KoG2P 2019 | 27.3030% | 19.5122% | 18.7187% | 21.8327% |
| kokorog2p 0.9.15 | 18.3130% | 26.5352% | 9.6096% | 30.7336% |
| HAMA 1.7.0 | 16.9071% | 25.1081% | 12.7127% | 27.6164% |
| hangul_to_ipa 2026 | 16.2412% | 24.8054% | 8.9089% | 29.8448% |
| eSpeak NG Korean | 8.1391% | 33.6101% | 4.3043% | 40.7236% |


#### Broad-profile sensitivity re-score (research-only)

The same PR #457 artifact also contains a separately versioned `broad-candidate-ipa-v2` sensitivity score using `korean-broad-candidate-sensitivity-v1`. This is **not** a blanket removal of IPA diacritics: it records feature loss and retains stop aspiration, fortisness, vowel length, unreleased codas, and the /s–ɕ–ʃ/ place distinctions. It does collapse selected distinctions (including lateral place, palatal nasality, several h-realizations, fricative aspiration, stress, and selected quality diacritics). These values are historical PR #457 artifact results, not yet the replacement exact-main run 42487350896, which is still executing.

| Engine | UGTPHON broad exact | UGTPHON CER | SIGMORPHON broad exact | SIGMORPHON CER |
|---|---:|---:|---:|---:|
| ClippyFirst Native | 86.23% (2,330/2,702) | 2.14% | 69.84% (697/998) | 6.15% |
| g2pK 0.9.4 | 85.72% (2,317/2,703) | 2.37% | 68.67% (686/999) | 6.46% |
| g2p-ko 1.0.0 | 84.83% (2,293/2,703) | 2.54% | 69.07% (690/999) | 6.31% |
| KoG2Padvanced 2022 | 70.29% (1,900/2,703) | 4.93% | 59.76% (597/999) | 8.78% |
| phonemize 2.0.1 | 70.33% (1,901/2,703) | 7.73% | 58.26% (582/999) | 9.31% |
| KoG2P 2019 | 40.77% (1,102/2,703) | 13.35% | 34.53% (345/999) | 14.39% |
| kokorog2p 0.9.15 | 28.49% (770/2,703) | 20.39% | 20.42% (204/999) | 23.18% |
| HAMA 1.7.0 | 28.30% (765/2,703) | 18.98% | 27.53% (275/999) | 19.99% |
| hangul_to_ipa 2026 | 25.75% (696/2,703) | 19.61% | 17.22% (172/999) | 23.48% |
| eSpeak NG Korean | 12.06% (326/2,703) | 29.92% | 6.71% (67/999) | 36.34% |

Interpretation: under this broad sensitivity profile Native leads Exact and CER on both corpora; g2pK and g2p-ko remain close. These are not independent normative IPA gold results, and they do not establish Ukrainian target accuracy. Do not compare this table directly with the Strict table above as if the references were unchanged: the sensitivity profile deliberately collapses a declared subset of reference/prediction features. The exact-main rerun is [42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896); its final artifact supersedes this historical PR artifact after review.

These are Korean IPA diagnostics under the pinned datasets and normalization, not Ukrainian target scores or normative gold. CharsiuG2P and ByT5 inference were skipped by policy. Full scored counts and methodological limitations are in the [current audit](docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md#current-main-continuation--2026-11-08-documentation-and-benchmark-reconciliation).
### IPA-to-Ukrainian renderer — separate validation status

The repository has two distinct IPA stages, and the phrase “project IPA renderer” must be qualified:

- Korean surface Hangul → broad IPA: src/korean_ukrainian/ipa.py, function realize_syllables(). The g2pK adapter first receives g2pK's Hangul pronunciation spelling and then uses this shared project module to derive IPA. Native also uses this IPA realization layer after its own Korean analysis. Therefore the Native/g2pK comparison does not compare two independently implemented IPA encoders.
- IPA → Ukrainian: src/korean_ukrainian/ipa_target_renderer.py. This downstream target adapter is not used to calculate Korean IPA exact-match/CER benchmark scores.

The full multi-engine comparison has further adapter dependencies: g2p-ko and KoG2Padvanced surface outputs are also converted through the shared project broad-IPA adapter; kokorog2p is g2pK-derived rather than a fully independent algorithm lineage. Read the ten-engine table as a comparison of pronunciation-surface systems under a shared, explicit IPA representation layer, not ten independent IPA encoders.

The ClippyFirst IPA renderer is the downstream target adapter, not a Korean G2P engine:

**Korean text → Korean phonological analysis → IPA → ClippyFirst IPA renderer → Ukrainian practical orthography.**

- Python: src/korean_ukrainian/ipa_target_renderer.py; browser: src/app/engine_ipa.js.
- The renderer accepts IPA and returns Ukrainian target text with mapping status/trace. It does not independently derive Korean pronunciation from Hangul.
- Regression tests reproduce 644 canonical lexical pronunciation rows and 46 alternate IPA rows; the explicit override registry contains 28 traceable mappings. These counts establish implementation reproducibility, not independent Ukrainian target accuracy.
- The recovered 24-form target-renderer holdout still has no IPA gold and no Ukrainian gold for any row. No renderer exact-match/CER accuracy score is therefore available.
- Unknown/ambiguous IPA fails closed; provisional mappings remain explicitly gated. Length is retained in IPA/provenance and is not automatically written as an extra Ukrainian grapheme.

**Native trend interpretation:** the latest UGTPHON exact-match rate is lower than the 2026-10-24 snapshot, but its CER is better; SIGMORPHON exact match and CER are both better. Since historical profile/reference conventions and eligible counts are not perfectly identical, this does not establish a general Native regression. Current paired results remain mixed by metric: g2pK has a small UGTPHON exact-match lead, while Native has lower UGTPHON CER and leads on SIGMORPHON exact match/CER. See the [current audit reconciliation](docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md#current-main-continuation--2026-11-08-documentation-and-benchmark-reconciliation).


### Readiness and remaining work

The repository is a **software-verified, bounded research prototype**; it remains a **research prototype, not independently research-certified or release-ready** as an authoritative transcription standard. Remaining substantive work is evidence-limited: original 236/239 cohort provenance, speaker-specific IPA evidence for the 40 no-audio cases, independent Ukrainian target validation if certification is pursued, broader source-backed rule coverage, and deployment/live-smoke confirmation on the latest main commit. No external reviewer outreach or correspondence is part of this execution pass.

## Documentation and repository map

- [Documentation index](docs/README.md) — canonical navigation for users, developers and researchers.
- [Agent workflows](docs/AGENT-WORKFLOWS.md) — task routing, repository-local skills, evidence/verification lifecycle and upstream practice decisions.
- [Agent instructions](AGENTS.md) — repository-wide entry contract and skill router.
- [Versioning policy](docs/VERSIONING-POLICY.md) — separate version streams for the private browser app and installable Python package.
- [Repository structure guide](docs/REPOSITORY-STRUCTURE.md) — current component map, data ownership, runtime entry points, development commands and safe navigation.
- [Repository audit and structure — 2026-11-06](docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md) — canonical continuation, current implementation, CI, rights and readiness status.
- [UGTPHON Korean-subset source-rights audit](docs/KOZAK-236-SOURCE-RIGHTS-AUDIT-2026-11-06.md) and [third-party licences](licenses/README.md) — source-specific licence scope, attribution and reviewer-packet boundary.
- [236-candidate review](research/kozak-kim-236-candidate-review-2026-11-05.md) and [engine integration](docs/KOZAK-KIM-236-ENGINE-INTEGRATION-2026-11-06.md) — evidence disposition and exact runtime changes.
- [Previous repository audit — 2026-11-04](docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-04.md) — historical audit and earlier exact-head status.

- [Engineering workflow reference audit — 2026-11-06](docs/ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md) — four upstream references and explicit adoption boundaries.

## Development and agent workflows

Contributors and coding agents should start with [AGENTS.md](AGENTS.md), then use the [agent workflow guide](docs/AGENT-WORKFLOWS.md) to select the maintained skill and canonical research/engineering record. The guide adapts selected practices from Unlazy, Superpowers, Matt Pocock's skills and Ponytail without copying or vendoring their implementations.

## Author, licensing and permissions

The project is authored by **Vitalii Volodymyrovych Tkachuk** under the authorial pseudonym **ClippyFirst**. The original project materials are governed by the custom [ClippyFirst Project License](LICENSE); a practical explanation is in [Licensing and permissions](docs/LICENSING-AND-PERMISSIONS.md). Scientific use of the public service's results and the Korean-to-Ukrainian correspondence table is permitted with attribution. Reuse, integration, self-hosting, modification or redistribution of the technical implementation requires the author's prior written permission. Third-party components and datasets retain their own licences and notices.

## Public web service

The project has two public-facing pages:

- **Service** — Korean text → practical Ukrainian reading.
- **System** — full researcher-facing methodology: the g2pK ordinary path, the three Kozak Kim modes, IPA-first Ukrainian adaptation, RR/Hanja side layers, benchmarks, tests, evidence and limitations.

- [Open the live service](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/index.html)
- [Read the methodology and edge-case registry](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#methodology-02c-kozak-kim)

The service is intentionally modelled on the functional architecture of the Chinese-for-Ukrainians project: the tool is the centre of the page, typography carries hierarchy, results are inspectable and there is no marketing/AI decoration.

The Korean visual identity uses South Korean national colours: Taegeuk red #CD2E3A and Taegeuk blue #0047A0.

## Sentence-level adversarial corpus

The system page now publishes a five-line running-text test corpus that stresses complex-coda liaison, coda neutralization, fortition, palatalization, the particle `의`, and the contracted form `설명했어요`. The regression fixture and tests keep the normative Korean surface form separate from the provisional Ukrainian target.

- [View the corpus on the live methodology page](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#sentence-adversarial-corpus)
- [Corpus fixture](tests/fixtures/adversarial-sentence-corpus.txt)
- [Regression tests](tests/adversarial-sentence-corpus.test.mjs)

A third adversarial window adds a longer text stressing `흙을`, `밟으며`, `낡은`, `놓인`, `맑은`, `햇빛이`, `젊은`, `신라`, `설날`, `독립문`, and `종로`. It records Korean surface-form controls separately from Ukrainian target choices.

- [Third corpus on the live methodology page](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#third-adversarial-corpus)
- [Third corpus fixture](tests/fixtures/adversarial-sentence-corpus-3.txt)
- [Third corpus tests](tests/adversarial-sentence-corpus-3.test.mjs)

Passing tests demonstrates reproducibility of declared model outputs and absence of unresolved placeholders in this fixture; it does not validate the Ukrainian approximations through an independent reader study.

## Complex-coda liaison audit (2026-10-10)

A follow-up NIKL source sweep added twelve exact regression cases for complex-coda liaison, fortis [ㅆ], and the conjugation patterns of `넓다` / `짧다`, including `넓어[널버]`, `넓으니[널브니]`, and `짧아[짤바]`. The new entries are narrow lexical controls, not general morphology guesses.

- [Read the audit report](docs/complex-coda-liaison-followup-2026-10-10.md)
- [Regression test](tests/adversarial-complex-coda-liaison-2026-10-10.test.mjs)

## NIKL audit: exceptions to automatic ㄴ insertion (2026-10-10)

A test-first audit exposed a missing standard surface form for `값있다[가빋따]`. Three lexical controls are now included: `값있다[가빋따]`, `곧이어[고디어]`, and `음용[으묭]`. They encode NIKL's caution that ㄴ insertion is not automatic in every similar phonological environment.

- [Audit report](docs/n-insertion-exceptions-audit-2026-10-10.md)
- [Regression test](tests/adversarial-n-insertion-exceptions-2026-10-10.test.mjs)

## NIKL Rule 29: liquid assimilation

Added eight official examples from the attached note to Rule 29, including `들일[들ː릴]`, `솔잎[솔립]`, `설익다[설릭따]`, `물약[물략]`, `불여우[불려우]`, `물엿[물렫]`, `휘발유[휘발류]`, and `유들유들[유들류들]`. The exact surface-form controls are source-backed; Ukrainian targets remain provisional.

- [Audit report](docs/rule29-liquid-assimilation-audit-2026-10-10.md)
- [Regression test](tests/adversarial-rule29-liquid-assimilation-2026-10-10.test.mjs)

### NIKL local source capture (2026-11-05)

The repository contains the user-supplied local HTML capture `한국어 어문 규범.htm`. The metadata-only manifest records a complete structural inventory of the 30 articles in Part 2, `표준 발음법`; see [the capture and inventory report](docs/NIKL-LOCAL-CAPTURE-AND-INVENTORY-2026-10-24.md). This is a local-file import, not a live HTTP fetch. The per-page KOGL/reuse marking remains unverified, and the saved HTML contains a likely extension-injected `deepl-input-controller` node; do not treat the capture as a verified pristine server response or redistribute its contents on that basis.

## Benchmark review after renderer integration (2026-10-24)

- [Consolidated benchmark review, exact metrics, interpretation and remaining gates](docs/BENCHMARK-REVIEW-2026-10-24.md)
- [Current Korean benchmark suite register](docs/KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md)
- [Methodology claims-and-evidence register](docs/METHODOLOGY-CLAIMS-AND-EVIDENCE-REGISTER-2026-10-30.md)
- [Methodology review and adjudication record](docs/METHODOLOGY-DEBATE-REVIEW-2026-10-30.md)

## Teacher-guided improvement of the neural-free Strict engine (2026-10-26)

CharsiuG2P can be used as a research teacher to identify contexts where a deterministic engine disagrees with a neural model; it is not added to the Strict runtime. The new offline tool `scripts/mine_deterministic_rule_candidates.py` preserves raw outputs, records model/data provenance, rejects known benchmark/holdout splits, and produces review-only context associations. It does not generate or activate rules automatically. A rule can enter production only after independent NIKL/source review, positive and negative-control tests, and a separate development-set improvement.

- [Teacher-guided rule-discovery protocol and acceptance gates](docs/TEACHER-GUIDED-STRICT-RULE-MINING-2026-10-26.md)
- [Rule candidate mining script](scripts/mine_deterministic_rule_candidates.py)
- [Regression tests](tests/test_mine_deterministic_rule_candidates.py)
- [Pinned train/dev corpus builder](scripts/prepare_korean_g2p_corpus.py) — emits provenance-bearing SIGMORPHON JSONL while preserving raw tokenized IPA; test records are never exported.
- [Corpus preparation tests](tests/test_prepare_korean_g2p_corpus.py)
- [Conservative UGTPHON Korean token corpus builder](scripts/prepare_ugtphon_korean_corpus.py) — uses aligned token-level fields and excludes ambiguous/noisy targets rather than guessing.
- [UGTPHON preparation tests](tests/test_prepare_ugtphon_korean_corpus.py)
- [Cross-corpus overlap and target-compatibility audit](scripts/audit_korean_corpus_compatibility.py) — reports source-form intersections and raw target-string relations without merging incompatible IPA conventions.
- [Compatibility audit tests](tests/test_audit_korean_corpus_compatibility.py)
- [Scratch G2P teacher training](scripts/train_korean_g2p_teacher.py) — trains from random initialization on SIGMORPHON train, selects on dev, and never loads test or pretrained weights.
- [Scratch teacher tests](tests/test_train_korean_g2p_teacher.py)
- [Dev-only teacher error analyzer](scripts/analyze_korean_g2p_teacher_errors.py) — groups errors by token sequence, length-mark differences, and source shape without producing rules.
- [Teacher error-analysis tests](tests/test_analyze_korean_g2p_teacher_errors.py)
- [CPU training workflow](.github/workflows/train-korean-g2p-teacher.yml) — uploads a short-lived research checkpoint and dev-only predictions.

**Metric interpretation:** the latest saved checkpoint is 59.6% (596/1,000) exact token-sequence match of the separate, randomly initialized research-only GRU teacher on the SIGMORPHON dev convention. A distinct earlier checkpoint trained on the same pinned 8,000-row train / 1,000-row dev data scored 60.2% (602/1,000); the checkpoint hashes differ, so these are run-to-run training variation, not conflicting dataset versions. Neither score is an accuracy measure for the deterministic ClippyFirst Strict engine, the browser G2P path, the IPA-to-Ukrainian adapter, or Ukrainian transcription. The dev split selected the checkpoint, so neither score is an independent final evaluation. A valid Strict-versus-teacher score remains blocked until the source IPA conventions are independently mapped and a separate eligible evaluation set is established.

The current CharsiuG2P checkpoint's weights-license status and training-data overlap remain unresolved. Do not redistribute its weights or use test/holdout predictions to tune Strict.

## Research-only morphological analyzers (2026-10-24)

The Python research package has optional adapters for [Kiwi](https://github.com/bab2min/kiwi) and MeCab-Ko. The adapters return inspectable morpheme forms, tags and source offsets; the separate `morphology_rule_licenses.py` layer can consume two analyzer results and emit **low-confidence, exact-form licenses** for source-backed R002/R003/R007 and stem rules R010/R011/R016. It can also extend a registered R012/R014/R015 lexical root across a particle/ending only when both analyzers agree on that attached grammatical boundary. This is not pronunciation gold, not a default runtime path, and does not automatically certify IPA or Ukrainian output. The public browser practical mode does not load or call these adapters.

- [Research morphology integration contract and acceptance gates](docs/RESEARCH-MORPHOLOGY-ADAPTERS-2026-10-24.md)
- Adapter: `src/korean_ukrainian/research_morphology.py`
- Tests with fake engines: `tests/test_research_morphology.py`
- Diagnostic inputs (unlabelled, not gold): `data/korean/morphology-review-corpus.txt`
- Diagnostic runner on the 16-item review list: `scripts/benchmark_research_morphology.py`
- [Paired full-corpus IPA/morphology benchmark and measured results](docs/RESEARCH-MORPHOLOGY-ADAPTERS-2026-10-24.md#same-corpus-benchmark-results--2026-10-24): `scripts/benchmark_morphology_ipa_delta.py`
- Pairwise Kiwi-vs-MeCab boundary comparison (agreement is not accuracy): `scripts/compare_morphology_analyzers.py`
- [Consensus morphology rule-license adapter](src/korean_ukrainian/morphology_rule_licenses.py) and [regression tests](tests/test_morphology_rule_licenses.py).

The pinned UGTPHON benchmark found that the existing native soft mode raised coverage from 98.22% to 99.04% but lowered exact-match rate from 24.41% to 24.28% and slightly worsened CER. Kiwi and MeCab-Ko each analyzed all 1,907 unique words, but their outputs are not yet used by the IPA engine. See the report for detailed limits and pairwise boundary agreement.

Install Kiwi with `uv pip install -e '.[research-kiwi]'`; install MeCab-Ko bindings with `uv pip install -e '.[research-mecab-ko]'`. A real-engine CI smoke run successfully installed and ran both adapters against the 16-input diagnostic list (Kiwi: 40 tokens; MeCab-Ko: 37 tokens). These counts and runtime are diagnostic only, not accuracy metrics: no independently adjudicated gold segmentation/POS set exists. The MeCab adapter records its selected binding and never substitutes a different analyzer family; see the research document for the evidence gates.

## Pronunciation engines: browser and Python

### Browser service — JavaScript G2P (default practical mode)

The public GitHub Pages service now uses a browser-only, vendored subset adapted from `ntdgo/korean-pronunciation` 1.0.1, a JavaScript port of g2pK. It retains Korean rule tables and heuristic annotation while excluding the unused CMU English pronunciation dictionary, English transliteration, and numeral conversion. This avoids shipping a multi-megabyte dictionary to the browser. It runs locally without a server, Python, MeCab, network calls, or native binaries. Attribution and the Apache 2.0 license are bundled in `public/THIRD_PARTY_NOTICES.txt` and `public/LICENSES/Apache-2.0.txt`. The path is:

`Hangul input → JS G2P surface spelling → project IPA conversion → IPA-to-Ukrainian mapping`.

The browser preserves Latin text, digits, punctuation, and whitespace. Practical mode passes Korean-bearing spans through the pinned JavaScript g2pK port and derives IPA from its raw Hangul surface. It does not apply NIKL rule licenses, Kozak Kim lexical surface corrections, lexical IPA overrides, or NIKL pronunciation variants. NIKL R001–R016 and their exact-form/morphological licenses belong exclusively to Kozak Kim's research engine. This keeps g2pK an independent comparison baseline; the Ukrainian target is still generated from IPA, never directly from Hangul.

**Important limitation:** the JavaScript port implements rule-based G2P and idiom handling, but does not reproduce the original Python g2pK's MeCab-based morphological analysis. It is therefore a browser-compatible reference engine, not a claim of exact parity with Python g2pK on morphology-dependent homographs. Those cases must be covered by source-backed lexical controls and adversarial regression tests.

### Python / CLI / API

The native Python research pipeline uses the **author-owned ClippyFirst IPA-to-Ukrainian renderer** in `src/korean_ukrainian/ipa_target_renderer.py` for practical output. It consumes source IPA only and applies this repository's canonical correspondence table plus explicit, traceable sequence overrides. The separate `ClippyFirst/Ukrainian-Phonetic-Inventory` package (expected version `0.8.0`) remains optional and is used only for Ukrainian feature/candidate diagnostics, never to choose the practical output. See [the target-layer contract](docs/ukrainian-target-layer.md).

The browser renderer uses a generated projection of the same two CSV sources; it carries mapping IDs/statuses into the trace and reports provisional target mappings separately from Korean pronunciation status. Regenerate with `npm run generate:ipa-target-data` and verify no drift with `npm run check:ipa-target-data` (also enforced by Python tests).

A clean installation can therefore render IPA sequences covered by local correspondence data without UPI. If UPI is unavailable, its candidate-analysis diagnostics are marked unavailable separately; this does not make unmapped IPA renderable or validate the Ukrainian mapping linguistically. Stored lexical Ukrainian forms remain audit references only and never bypass the IPA boundary.

**Native IPA status contract:** `phoneticize_korean()` and `transliterate_korean()` expose `ipa_status`, `ipa_is_diagnostic_only`, and `ipa_status_reason` at the analysis root and mirror equivalent `status`, `is_diagnostic_only`, and `status_reason` fields inside the IPA object. When a source/morphology-dependent context cannot be resolved, the IPA string remains available for inspection but is explicitly marked `diagnostic_only_unresolved_pronunciation`; Ukrainian target selection is blocked and the rendered target is `null`. Otherwise the result is `provisional`, not expert-adjudicated gold. Consumers must check the status fields rather than treating the presence of an IPA string as proof of a resolved pronunciation.

The Python package, CLI, and optional FastAPI backend can use the original pinned g2pK engine as an optional pronunciation provider. The g2pK adapter returns the engine's surface spelling and derives project IPA from it; it does not import Kozak Kim's NIKL lexical, surface, IPA, or diagnostic-status overlays. Install with `python -m pip install -e ".[g2pk]"`, then run `korean-ua analyze "넋이 굳이" --pronunciation-engine g2pk`. The native Kozak Kim Python engine remains the default unless g2pK is explicitly selected; missing dependencies never trigger a silent fallback.

Both runtimes preserve the same methodological boundary: the Ukrainian target is generated from IPA, never by a parallel Hangul-to-Ukrainian substitution. See [the Python integration and validation boundary](docs/G2PK-INTEGRATION-2026-10-15.md).

## Scientific pipeline

Korean orthography → Korean phonology → contextual rules → Korean surface representation / IPA → Ukrainian phonetic target → Ukrainian orthography

The web service is a practical runtime projection of this research model. It is **not** an official Ukrainian national standard and it does not translate Korean meaning. Ukrainian correspondences are model decisions: for example, ㅎ → г is a documented approximation with a stated phonetic trade-off, not a claim of exact equivalence.

## Research layers

- Unicode Hangul decomposition/composition.
- Exact 19 × 21 × 28 = 11,172 modern precomposed Hangul blocks.
- Modern Jamo inventory and structured onset/nucleus/coda representation.
- 11 complex codas as explicit component sequences.
- Rule registry R001–R016 with evidence/provenance.
- Context-sensitive sequence corpus.
- Ukrainian target layer separated from Ukrainian graphemic realization.
- Comparative Slavic evidence with provenance controls.
- Adversarial regression tests and reproducible generated artifacts.
- Shared, provenance-carrying lexical pronunciation overrides for high-risk exceptions (see [lexical coverage audit](docs/LEXICAL-PRONUNCIATION-COVERAGE-2026-10-09.md)).

## Web runtime boundary

The browser practical adapter uses the reduced browser-only G2P core; the native research adapter implements:

- Unicode-safe Hangul decomposition;
- canonical onset/vowel/coda mappings from data/korean/canonical_correspondence.csv, including the explicitly model-selected onset target ㅎ [h] → Ukrainian г [ɦ] (glottal place retained, voicelessness not retained);
- ㅅ/ㅆ → ш in the relevant i/j-like environments;
- simple-coda liaison where the outcome is unambiguous, and exact sourced complex-coda pronunciations; codas whose representative changes under §15 are withheld before ㅏ/ㅓ/ㅗ/ㅜ/ㅟ when morphology is unknown; unknown non-ㅎ complex-coda + vowel sequences are also marked unresolved; ㄶ/ㅀ retain their special ㅎ behavior;
- ㅎ deletion and ㅎ-driven aspiration; §12(4) ㅎ/ㄶ/ㅀ deletion before vowels is resolved through exact sourced lexical entries, and unknown morphology-dependent forms are marked unresolved; the direct complex-coda + ㅎ suffix pattern is also lexical-evidence gated;
- nasal assimilation, liquid assimilation and palatalization in the documented environments; §§18–20 assimilation can cross plain whitespace as connected phrase speech, but punctuation blocks cross-boundary rules;
- selected lexical coda exceptions such as 밟- and 넓죽-/넓둥글-/넓적- where standard pronunciation cannot be inferred from the coda inventory alone;
- selected contextual voicing;
- practical tensification neutralization;
- normative [ɰi] default for ㅇ+ㅢ, [i] for consonant-onset ㅢ, and documented optional readings;
- preservation of non-Hangul text;
- an inspectable rule/status trace.


- Optional `morphology_mode=soft` (UI checkbox **М’яка морфологія**) may propose
  high-frequency formal-ending readings (이 / 을 / 어 / 았 / 고 / …) with status
  `heuristic-low-confidence`. Default remains **strict** (exact evidence only).
  Soft never selects §15 substantive neutralization and never licenses
  R009 / R010–R016. Full contract:
  [docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md](docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md).

The Python CLI and FastAPI expose this choice explicitly; strict remains the default, and soft-mode rule traces remain low-confidence. Examples:

```sh
korean-ua analyze "좋아" --morphology-mode strict
korean-ua analyze "좋아" --morphology-mode soft
```

For the API, send `"morphology_mode": "soft"` with `"pronunciation_engine": "native"` to `/v1/transliterate`. The `g2pk` engine does not accept this native morphology setting. Compare modes with the pinned diagnostic workflow and inspect both coverage and coverage-adjusted exact match; do not judge the soft mode by abstention count alone. See [the native abstention audit](docs/NATIVE-ABSTENTION-AUDIT-2026-10-25.md).

The native Python R009 implementation additionally applies a finite, exact-form license list for examples explicitly enumerated in NIKL §29 (including 한여름, 솜이불, 꽃잎, 색연필, 서울역); listed cross-word examples require explicit `boundary_mode="phrase"`. This is not a productive n-insertion heuristic: unlisted forms still require exact licensing. See [the native Rule 29 license audit](docs/NATIVE-ENGINE-NIKL-RULE-29-EXACT-LICENSES-2026-10-23.md).

The native Python engine also has exact, source-backed Rule 28 compound-fortition and Rule 30 saisiot licenses for listed examples; each license is full-form and pair-specific, and ambiguous homographs are not automatically guessed. See [the Rule 28/30 license audit](docs/NATIVE-ENGINE-NIKL-RULE-28-30-EXACT-LICENSES-2026-10-23.md).

It deliberately does **not** claim to be a complete lexical, morphological or acoustic Korean pronunciation engine. Research-layer rules that require lexical or morphological licensing remain outside the browser's automatic scope. For §17 palatalization, the browser accepts exact sourced lexical entries; an unlisted ㄷ/ㅌ/ㄾ + 이-looking sequence is marked unresolved instead of inferring a formal-morpheme boundary from spelling alone. The Python §29 n-insertion rule requires a full-form and pair-specific license rather than a global boolean. The Python research layer and browser both require exact full-form/pair evidence for morphologically ambiguous complex-coda liaison and for simple-coda cases where §15 neutralization could change the result; sourced lexical entries cover known examples.

## Exhaustive Hangul inventory

19 × 21 × 28 = **11,172 modern Hangul syllable blocks** are generated deterministically.

This is a Unicode combinatorial inventory, not a lexical dictionary and not 11,172 unique pronunciations.

Generate the research artifacts with:

    python scripts/generate_korean_corpus.py --strict

## Development

Requirements: Node.js 22+ and Python 3.11+ for the research layer.

Web service:

    npm install
    npm test
    npm run build
    npm run dev

The GitHub Pages workflow in `.github/workflows/deploy-pages.yml` runs browser tests, Python pipeline/data-integrity tests, builds the static site, and deploys the `dist/` artifact on pushes to `main`.
Research layer:

    python scripts/generate_korean_corpus.py --strict
    pytest

## Documentation

### Research
- docs/NIKL-STANDARD-PRONUNCIATION-AUDIT-2026-10-09.md — article-by-article audit of all 30 official Standard Pronunciation Rules, implementation boundary, and regression cases
- docs/USER-CORPUS-REGRESSION-AUDIT-2026-10-10.md — regression audit for the user-supplied Korean corpus, with high-priority normative surface readings and release acceptance criteria
- The web interface now shows a separate **Нормативна корейська вимова** line for exact source-backed lexical entries; it is kept distinct from the provisional Ukrainian transcription. The user corpus has new §9–§23 regression fixtures and explicit surface-reading assertions.
- docs/methodology.md
- docs/slavic-comparative-master-table.md
- docs/comparative-evidence-methodology.md
- docs/multilevel-corpus.md
- docs/superpowers/specs/2026-10-04-korean-ukrainian-target-design.md
- docs/superpowers/plans/2026-10-04-korean-ukrainian-target-implementation.md

### Web service
- docs/WEB-SERVICE-REQUIREMENTS.md
- docs/WEB-SERVICE.md
- docs/WEB-SERVICE-ARCHITECTURE.md
- docs/WEB-SERVICE-QA.md
- docs/WEB-SERVICE-USER-GUIDE.md

## Research integrity

The repository explicitly distinguishes:

- source-language fact;
- documented external system;
- project model decision;
- conditional rule;
- hypothesis;
- unresolved analysis.

Missing evidence is not converted into a fabricated one-to-one correspondence.

## Status

**Research layer:** a tested research prototype with source-backed rule coverage, but incomplete independent IPA and target-language validation.

**Web layer:** a technically deployed research preview. Practical mode uses the pinned JavaScript g2pK port without NIKL or Kozak Kim overlays; its raw surface is independently regression-tested and passed to the shared IPA/target adapter. Kozak Kim's research modes own the project's NIKL rule inventory and evidence-scoped licenses. Neither mode has an independently adjudicated full IPA gold set or completed Ukrainian target review. The public UI states these limitations. The deployment workflow HTTP-smokes the public pages and runs headless Chromium; this verifies interaction and output presence, not normative pronunciation accuracy.

Neither layer claims official Ukrainian standardisation, exhaustive lexical attestation, acoustic narrow-IPA validation or independent expert adjudication without the corresponding evidence.

## License / attribution

The repository includes a root-level [ClippyFirst Project License](LICENSE), version 1.0 (2026). It is a purpose-limited custom licence, not an OSI-approved open-source licence; it does not replace third-party licences or establish reuse rights for external corpora and source extracts. See [licensing and permissions](docs/LICENSING-AND-PERMISSIONS.md).


### Surface regression source adjudication (2026-10-21)

The 20-case practical-port fixture separates the pinned JavaScript output from NIKL normative comparators. Nineteen comparators are directly attested official examples/Q&A; one (`숲이`) remains rule-derived and is not treated as a direct lexical attestation. Independently adjudicated IPA gold remains 0/20, and Ukrainian target review is separate. See the [source-adjudication report](docs/audits/SURFACE-REGRESSION-SOURCE-ADJUDICATION-2026-10-21.md) and [metadata regression test](tests/normative-surface-evidence-fixture.test.mjs).

### Model-wide target consistency audit

The lexical layer has a dedicated regression suite for Ukrainian target segmentation, non-duplication of fortisness, word-initial onset choices, and IPA/target consistency in high-risk forms.

- [Audit summary on the methodology page](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#model-wide-target-consistency)
- [Regression tests](tests/model-wide-target-consistency.test.mjs)

## Research programme and completion roadmap

The durable project plan, evidence registers, rule-coverage matrix, architecture decisions, and release acceptance criteria are maintained in the repository so that work can continue consistently across sessions.

- [Research programme index](research/README.md)
- [Master directive](research/MASTER-DIRECTIVE.md)
- [Staged roadmap and current work queue](research/ROADMAP.md)
- [External source register](research/SOURCE-REGISTER.csv)
- [Rule-to-implementation coverage matrix](research/RULE-COVERAGE.csv)
- [Architecture decision log](research/DECISION-LOG.md)
- [Release acceptance gates](research/ACCEPTANCE-GATES.md)

The initial Phase 0 reconstruction is substantially complete for the current mainline: current CI covers browser tests/build, Python 3.11/3.12/3.13, corpus artifacts and system verification. Remaining acceptance gaps and their evidence are tracked in the handoff, completion audit, and research/ACCEPTANCE-GATES.md.


## Official NIKL Standard Pronunciation Rules collector

The metadata-first collector for the official Korean-language norms portal is implemented in [scripts/nikl-norm-crawler.mjs](scripts/nikl-norm-crawler.mjs). It scopes extraction to the 30 articles in 제2부 표준 발음법, checks robots.txt, records source/HTTP and per-article hashes, and fails closed on incomplete inventories. By default it stores metadata only; source terms remain explicitly unassessed and article text is not retained. See the [collector guide](docs/NIKL-NORM-CRAWLER.md) and run `npm run crawl:nikl` locally when network/policy checks are available. If automated access is denied but the official page opens normally in a browser, the collector also supports an auditable `--input-html` import that does not claim a live fetch. The live crawl remains subject to source availability; the collector uses the canonical official desktop full-text route, and HTTP 403 remains a documented BLOCKED state rather than a reason to bypass access controls. For the remaining cited Q&A/FAQ pages, [the metadata-only batch importer](scripts/nikl-evidence-import.mjs) can inventory ordinary browser-saved official pages without retaining page text or marking citations reviewed; see [the batch-import guide](docs/NIKL-EVIDENCE-BATCH-IMPORT.md). The three cited NIKL-hosted PDFs have a separate local binary-metadata intake ([guide](docs/NIKL-PDF-IMPORT.md), `npm run template:nikl-pdf`, `npm run import:nikl-pdf`) that never extracts document text or asserts claim support.

## Repository-local agent skills

Specialized agent workflows for official NIKL scraping, article-by-article rule coverage, and evidence-gated pronunciation adjudication are documented in [docs/AGENT-SKILLS-NIKL.md](docs/AGENT-SKILLS-NIKL.md) and installed under `.agents/skills/`. These are workflow instructions; they do not claim that a live crawl or new linguistic validation has already run.


## Human review of official Standard Pronunciation Rules (2026-10-24)

The committed official-source HTML is now paired with a machine-readable review of all 30 article lead-ins and their separately labelled `해설` paragraphs. The regression checks preserve the boundary between normative Korean text, explanatory commentary, broad IPA, and provisional Ukrainian adaptation.

- [Human-review record](docs/NIKL-HUMAN-REVIEW-2026-10-24.md)
- [Machine-readable review fixture](tests/fixtures/nikl-article-review-1-30.json)
- [Source-boundary regression test](tests/nikl-article-review-1-30.test.mjs)
- [Cross-rule engine surface/IPA regression (24 source-backed project-IPA cases)](tests/nikl-human-review-surface-regression.test.mjs)

- [Surface-only evidence for unresolved 긁고](tests/fixtures/nikl-surface-only-complex-coda.json)
- [Guard test keeping that case out of IPA/target gold](tests/nikl-surface-only-complex-coda.test.mjs)


## Research: neural teacher and IPA corpus reconciliation

The research-only scratch G2P teacher, source-pinned SIGMORPHON/UGTPHON train/dev builders, and lossless typed IPA packets are available through [PR #339](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/339). The [neural-teacher candidate rule register](docs/NEURAL-TEACHER-CANDIDATE-RULE-REGISTER-2026-10-26.md) is the separate ledger for measured teacher findings, candidate families, evidence gates, and the unresolved total of genuinely missing rules. The [source-convention review](docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md) and [train-only adjudication queue](scripts/build_korean_ipa_adjudication_queue.py) preserve disagreements for review instead of treating either corpus as automatic IPA gold. The neural model is not in runtime; no production rules are changed by this research path.

The teacher workflow also emits same-input raw IPA pairs for the scratch model and native Strict engine on the SIGMORPHON dev forms using [`scripts/compare_korean_teacher_strict_dev.py`](scripts/compare_korean_teacher_strict_dev.py). It intentionally computes no cross-engine accuracy metric: source IPA conventions are not yet reconciled, and the teacher was selected on this dev split. See the [IPA convention review](docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md).

The corpus workflow now also emits a source-specific [IPA symbol inventory audit](scripts/audit_korean_ipa_symbol_inventories.py). It counts literal Unicode code points and preserves SIGMORPHON's source whitespace tokens without inventing phoneme segmentation; see the [convention review](docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md) for the measured inventory differences and remaining adapter gate.

The source inventory review also checked the pinned upstream UGTPHON README, which itself shows `kçikçi` and `kçik̚kçik̚` for Korean examples. This confirms `ç` is part of the upstream annotation notation; it must be preserved until its ClippyFirst mapping is reviewed, not dropped as a suspected typo.

A second-stage conflict triage report is generated by [`scripts/analyze_korean_ipa_conflict_patterns.py`](scripts/analyze_korean_ipa_conflict_patterns.py). It preserves multiple UGTPHON candidate annotations per form and reports literal-symbol/variant counts without pretending to align phones or adjudicate either source as gold; see the [source-convention review](docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md).


### Productive morphology licensing (research-only, 2026-10-26)

The analyzer-consensus adapter now goes beyond exact word-list coverage without broadening the default strict engine. When Kiwi and MeCab-Ko agree on an exact surface-aligned grammatical boundary, it may create a full-form license for source-backed R002/R003/R007 and for VV/VA stem + ending environments in R010/R011/R016. It may also carry a registered R012/R014/R015 lexical root's internal rule across an analyzer-confirmed attached particle/ending (for example, a licensed compound root followed by a particle). Noun-to-noun lookalikes, analyzer boundary disagreements, zero-width morphemes, spaces, and unregistered roots remain fail-closed.

Every such application is marked `analyzer-supported-low-confidence` and the IPA remains diagnostic-only. This is a controlled way to use morphology to make existing sourced rules productive; it is **not** evidence that the analyzers are gold, and it does not change the default browser or strict runtime.


## Korean Revised Romanization as a parallel audit view (2026-10-28)

The service now displays a **basic Revised Romanization (RR) rendering** beside IPA and Ukrainian output. It romanizes the resolved Hangul surface form emitted by the selected pronunciation path; it is not English phonetic spelling, and it is not an input to the IPA-to-Ukrainian adapter.

The pipeline remains:

`Hangul → Korean surface pronunciation → IPA → Ukrainian target`

The RR display is a separate diagnostic branch:

`resolved Hangul surface → RR letter-value rendering`

**Scope limitation:** this initial adapter covers standard Hangul syllable decomposition, core RR onset/vowel/coda letter values, adjacent ㄹ handling, and preservation of whitespace/punctuation/non-Hangul text. It is not yet independently validated as a complete implementation of every NIKL Revised Romanization rule, and it does not reverse-convert Latin text to Hangul. Do not use it as pronunciation gold or infer IPA from the Latin output. See [the implementation contract and validation gaps](docs/KOREAN-ROMANIZATION-RR-2026-10-28.md).

Normative reference: [National Institute of Korean Language — Romanization of Korean](https://www.korean.go.kr/front_eng/roman/roman_01.do).

## Optional Hanja output (deterministic preview)

The browser shows the outputs in the order **Romanization → IPA → Ukrainian transcription → Hanja annotation**. Hanja uses a deterministic word dictionary derived from the BSD-licensed libhangul data inventory, fetched at a pinned revision and integrity-checked only during development/build preparation. The deployed browser lazily loads only the generated dictionary chunks matching the initial consonants present in the current input; it makes no external network/API calls and does not affect the three existing conversion results. Candidate selection is deterministic but context-insensitive, so homographs can still be wrong; unknown Hangul runs are preserved unless they can be fully segmented. This is a research feature, not a complete Korean morphological analyzer. See [the implementation and evidence ledger](docs/HANJA-RESEARCH-LAYER-2026-10-29.md).


## Korean UGT raw-surface benchmark (research-only)

The raw-surface UGTPHON benchmark is implemented in [`scripts/benchmark_ugtphon_ko_surface.py`](scripts/benchmark_ugtphon_ko_surface.py), with regression tests in [`tests/test_ugtphon_surface_benchmark.py`](tests/test_ugtphon_surface_benchmark.py). It is deliberately separate from canonical lexical G2P: predictions start from `token.text`, optional exact/context/lengthening retrieval is learned from the training split only, ambiguous mappings and canonical collisions are withheld, and test `canonical` labels are never used for prediction. The report compares raw G2P with train-only normalization on the same tokens and reports category-level coverage, exact match, CER, abstentions and potential canonical false rewrites. This is a diagnostic for noisy user-generated text, not a change to the default standard-Korean pronunciation engine and not normative IPA accuracy.

Latest pinned train/test diagnostic (2026-11-01): on 2,624 paired tokens, train-only retrieval improves exact match from 51.3720% to 51.6006% (+0.2287 pp) and CER from 10.0783% to 9.9730% (−0.1054 pp), with 6 exact improvements and 0 regressions. Coverage remains limited (22 hits among 722 noncanonical tokens), so the stage stays research-only. [Workflow and artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325015010).


### Five-dataset Korean G2P benchmark portfolio

The benchmark register now tracks five distinct Korean pronunciation-reference datasets: UGTPHON, SIGMORPHON 2021, Seoul Corpus (OpenSLR SLR113), KsponSpeech, and the NIKL Daily Conversation Speech Corpus 2022. Only UGTPHON and SIGMORPHON currently have executable multi-engine IPA comparisons; Seoul is selected for phone-label ingestion, while KsponSpeech and NIKL 2022 require access/terms checks and separate Hangul-surface scoring contracts. The LDC Korean Telephone Conversations Lexicon is retained as an alternate licensed sixth candidate. **Five datasets in the portfolio does not mean five completed benchmark runs.** See the [five-dataset register, source pins, licence gates and scoring policy](docs/KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md#2026-11-08--five-dataset-korean-g2p-benchmark-portfolio).
