# Source-backed R003 exact-form implementation — 2026-10-25

## Source-backed R003 exact-form implementation — 2026-10-25

- **Status: PARTIAL pending CI and benchmark rerun.** The implementation now adds strict, full-form + adjacent-pair licenses for two R003 cases whose exact Korean surface pronunciations are attested by NIKL sources:
  - `싫어서`, pair `싫>어`, official NIKL Online Q&A (2025-04-29): [source](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=313981), explicitly explains ㅎ deletion and ㄹ liaison, pronunciation [시러서].
  - `수많은`, pair `많>은`, Korean Basic Dictionary entry for 수많다: [source](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=71144), lists 활용 [수ː마는].
- Python native rules and browser rules use the same exact-form scope; neither change adds a productive suffix heuristic. An unlisted lookalike such as `많아보임` remains fail-closed.
- **Evidence boundary:** the official Hangul pronunciation notation supports the Korean surface rule application only. It is not independent broad-IPA gold, Ukrainian target gold, or a frozen holdout label. Those fields remain unadjudicated.
- Regression tests were added for Python rule traces/surface codas and browser strict-mode surface forms plus a negative control. They have **not yet been run in this environment**; the PR CI and pinned UGTPHON benchmark must confirm the behavior before the status can become `DONE_VERIFIED`.
- The historical 48-occurrence abstention count remains the baseline until a same-profile benchmark is rerun. Do not claim that the count is now 46, that total error count is zero, or that overall accuracy improved before CI artifacts establish it.


# Native Korean abstention audit — 2026-10-25

## Finding

The 48 UGTPHON native abstentions are **not runtime errors**. The pinned diagnostic reports 2,703 eligible token occurrences, 2,655 scored, 48 unresolved, and zero engine exceptions. They arise because the default `morphology_mode="strict"` intentionally requires exact full-form/pair evidence before applying morphology-conditioned rules. The same benchmark gives g2pk output for all 2,703 tokens, but its output is a comparator—not gold.

The audit covers 48 occurrences across 47 unique input strings. Rule-context counts sum to 49 because one occurrence has two unresolved contexts.

| Context class | Context count | Interpretation |
|---|---:|---|
| R002 liaison / neutralization | 25 | Formal vs substantive morpheme or exact inflection boundary is not licensed |
| R003 ㅎ-coda deletion | 20 | Requires an ending/suffix license |
| R007 palatalization | 2 | Formal-morpheme /i/ context is not licensed |
| R004 complex coda + ㅎ aspiration | 1 | Morphophonemic context is not licensed |
| IPA_ADJUDICATION | 1 | Korean surface evidence exists, but project IPA has no independent adjudication |

The dominant problem is **morphological coverage**, not a crash or a missing G2P dependency. The design is conservative by intention: adjacent Hangul syllables do not reliably reveal whether a boundary is an inflectional ending, particle, derivational suffix, or substantive morpheme. NIKL explicitly distinguishes formal-morpheme liaison (§§13–14) from substantive-morpheme behavior (§15); §12(4) conditions ㅎ deletion on a vowel-initial ending/suffix. See the official Standard Pronunciation Rules: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002

## Benchmark evidence

Pinned run: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40193119781
Artifact: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40193119781/artifacts/12598408166

UGTPHON native strict mode: 2,655/2,703 coverage (98.22%), 1,412 exact matches, exact rate 53.18%, CER 9.19%, 48 abstentions, 0 errors. On the 2,655 paired rows, g2pk exact rate is 53.33% and CER 9.24%; the small difference does not prove that abstentions are incorrect. The SIGMORPHON 2021 lexical set has only two native abstentions, showing the effect is strongly tied to the noisier UGTPHON inputs and its morphological/orthographic patterns.

NIKL §13 explicitly licenses examples such as 깎아[까까], 옷이[오시], 있어[이써], 낮이[나지], 꽂아[꼬자], 꽃을[꼬츨], 쫓아[쪼차], 밭에[바테], 앞으로[아프로], 덮이다[더피다]. The official rules therefore support productive rule application *when the relevant morpheme boundary is known*. They do not license guessing that boundary in every unspaced noisy token.

## Occurrence-level audit

The g2pk column is only a comparator distance against the dataset's IPA annotation. It is **not** evidence that a production rule is linguistically correct. “Exact” means exact after the benchmark's declared normalization.

| Occurrence | Row ID | Input | Unresolved context(s) | g2pk diagnostic |
|---:|---|---|---|---|
| 38 | `multilexnorm2026_1916` | `같아서` | R002 `같>아` | not exact (distance 1) |
| 133 | `multilexnorm2026_1928` | `없음` | R002 `없>음` | not exact (distance 1) |
| 164 | `multilexnorm2026_1933` | `좃같아서` | R002 `같>아` | not exact (distance 1) |
| 222 | `multilexnorm2026_1945` | `되었어` | R002 `었>어` | exact (distance 0) |
| 294 | `multilexnorm2026_1962` | `찢었으면` | R002 `찢>었` | exact (distance 0) |
| 403 | `multilexnorm2026_1972` | `했었음` | R002 `했>었` | exact (distance 0) |
| 469 | `multilexnorm2026_1977` | `수많은` | R003 `많>은` | not exact (distance 1) |
| 484 | `multilexnorm2026_1979` | `붙어야` | R002 `붙>어` | exact (distance 0) |
| 538 | `multilexnorm2026_1985` | `멋있어` | R002 `있>어` | not exact (distance 2) |
| 574 | `multilexnorm2026_1989` | `긁혔다는거지` | R004 `긁>혔` | not exact (distance 2) |
| 587 | `multilexnorm2026_1994` | `괜찮아보이는디` | R003 `찮>아` | exact (distance 0) |
| 635 | `multilexnorm2026_2003` | `있었` | R002 `있>었` | exact (distance 0) |
| 704 | `multilexnorm2026_2011` | `많을거같이` | R003 `많>을`; R007 `같>이` | not exact (distance 3) |
| 798 | `dc_inside_2020` | `군대보냈어야` | R002 `냈>어` | exact (distance 0) |
| 821 | `dc_inside_2024` | `없음` | R002 `없>음` | not exact (distance 1) |
| 844 | `dc_inside_2024` | `많이본` | R003 `많>이` | exact (distance 0) |
| 868 | `dc_inside_2024` | `없을듯` | R002 `없>을` | not exact (distance 4) |
| 998 | `dc_inside_2050` | `칡칡이` | R002 `칡>이` | not exact (distance 1) |
| 1159 | `dc_inside_2115` | `이런삶은` | R002 `삶>은` | not exact (distance 2) |
| 1160 | `dc_inside_2115` | `끝내고싶어유유유유` | R002 `싶>어` | not exact (distance 2) |
| 1168 | `dc_inside_2118` | `이빨닦아야지` | R002 `닦>아` | not exact (distance 1) |
| 1181 | `dc_inside_2123` | `못잃어` | R003 `잃>어` | not exact (distance 2) |
| 1203 | `dc_inside_2124` | `알잖아아침에` | R003 `잖>아` | not exact (distance 1) |
| 1206 | `dc_inside_2124` | `싫어서` | R003 `싫>어` | not exact (distance 3) |
| 1269 | `dc_inside_2131` | `찾아` | R002 `찾>아` | exact (distance 0) |
| 1383 | `dc_inside_2155` | `벗어날` | R002 `벗>어` | not exact (distance 2) |
| 1395 | `dc_inside_2158` | `쌓아서` | R003 `쌓>아` | not exact (distance 1) |
| 1486 | `dc_inside_2174` | `쳐넣어야` | R003 `넣>어` | exact (distance 0) |
| 1503 | `dc_inside_2183` | `쫒아내면` | R002 `쫒>아` | exact (distance 0) |
| 1531 | `dc_inside_2186` | `많아서` | R003 `많>아` | not exact (distance 1) |
| 1548 | `dc_inside_2197` | `안늙었는데` | R002 `늙>었` | not exact (distance 1) |
| 1564 | `dc_inside_2198` | `애새끼낳으면` | R003 `낳>으` | not exact (distance 1) |
| 1596 | `dc_inside_2202` | `많앗구나유유유` | R003 `많>앗` | exact (distance 0) |
| 1606 | `dc_inside_2212` | `삶의` | IPA_ADJUDICATION | not exact (distance 2) |
| 1628 | `dc_inside_2212` | `싶어서` | R002 `싶>어` | not exact (distance 3) |
| 1877 | `dc_inside_2230` | `개같이못하고` | R007 `같>이` | exact (distance 0) |
| 1897 | `dc_inside_2235` | `좋아보인다고` | R003 `좋>아` | exact (distance 0) |
| 1941 | `dc_inside_2241` | `무서웟어` | R002 `웟>어` | not exact (distance 2) |
| 1981 | `dc_inside_2256` | `좋아해주는` | R003 `좋>아` | not exact (distance 1) |
| 2142 | `dc_inside_2618` | `잃었노` | R003 `잃>었` | exact (distance 0) |
| 2149 | `dc_inside_2530` | `개좆망했잖아` | R003 `잖>아` | not exact (distance 1) |
| 2242 | `dc_inside_2312` | `없으니깐` | R002 `없>으` | not exact (distance 1) |
| 2352 | `dc_inside_2564` | `않았지만` | R003 `않>았` | exact (distance 0) |
| 2406 | `dc_inside_2362` | `개많음` | R003 `많>음` | exact (distance 0) |
| 2434 | `dc_inside_2585` | `죽었잖아` | R003 `잖>아` | exact (distance 0) |
| 2564 | `dc_inside_3729` | `웃어넘기겟지만` | R002 `웃>어` | not exact (distance 1) |
| 2588 | `dc_inside_2392` | `좋은데` | R003 `좋>은` | exact (distance 0) |
| 2698 | `dc_inside_2514` | `없으니까` | R002 `없>으` | not exact (distance 1) |

## Fix strategy

1. Preserve strict mode as the correctness baseline. Do not reduce the abstention count by blindly copying g2pk, KoG2P, eSpeak, or the corpus's IPA.
2. Add a reproducible strict-vs-soft benchmark. The existing opt-in soft morphology layer can hypothesize a closed set of formal endings for R002/R003/R007 and marks applied rules `heuristic-low-confidence`. The comparison must report exact match, CER, coverage, remaining abstentions, heuristic count and sample forms side-by-side.
3. If soft mode improves coverage without material score regression, keep it an explicit opt-in and improve its user-facing confidence/status. Do not silently change the strict default until the benchmark and targeted false-positive controls support the change.
4. Resolve individual high-confidence forms only through NIKL-backed exact-form licenses or independently verified morphology. Do not license noisy typos or infer missing spaces (for example `많이본`, `좋아보인다고`) merely because a competing engine agrees.
5. R004 and the IPA_ADJUDICATION case need separate source/specialist work; the current soft layer does not cover R004 and must not resolve a missing independent IPA judgment.

## Status

- **DONE_VERIFIED_SOURCE:** two exact browser surface corrections are pinned to NIKL primary sources in `docs/PRIMARY-SOURCE-ADJUDICATION-2026-10-25.md`.
- **DONE_VERIFIED_PRIOR_HEAD:** the repository already has a strict/soft and analyzer-boundary benchmark; reuse its pinned artifact rather than duplicating its workflow. See the quantitative follow-up below.
- **PARTIAL:** two-analyzer formal-tag consensus adapter and benchmark passed in [run 40196942415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40196942415) on a prior code head; exact-head rerun after the later IPA-status, source-register, and diagnostic-report assertions is queued and not yet verified.
- **BLOCKED_SPECIALIST_ADJUDICATION:** independent IPA review; one occurrence is withheld for this reason rather than a phonological rule.
- **BLOCKED_INPUT_NORMALIZATION / MORPHOLOGY:** word segmentation and morpheme-boundary inference for unspaced noisy input.
- **BLOCKED_INDEPENDENT_TARGET_GOLD:** this audit evaluates Korean IPA annotations only, not Ukrainian output.
- **BLOCKED_EXTERNAL_ACCESS / RIGHTS_REVIEW:** live NIKL inventory and item-level reuse review remain unresolved.


## Quantitative follow-up from the existing paired morphology artifacts

The existing research benchmark (run [40191515056](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515056), artifacts [MeCab-Ko](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515056/artifacts/12598531053) and [Kiwi](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515056/artifacts/12598625698)) already measures strict, soft, and boundary-gated IPA. No duplicate strict/soft benchmark was added.

| Strategy | Scored / 2703 | Coverage | Exact matches | Exact rate | CER | Unresolved occurrences |
|---|---:|---:|---:|---:|---:|---:|
| Native strict | 2655 | 98.2242% | 1412 | 53.1827% | 9.1883% | 48 |
| Native soft | 2677 | 99.0381% | 1421 | 53.0818% | 9.1868% | 26 |
| MeCab boundary-gated counterfactual | 2672 | 98.8531% | 1419 | 53.1063% | 9.1927% | 31 |
| Kiwi boundary-gated counterfactual | 2670 | 98.7791% | 1418 | 53.1086% | 9.1984% | 33 |

The strict/soft numbers show that 22 unique forms change status under soft mode, but exact rate is slightly lower overall and the strict-vs-soft paired subset has identical exact/CER scores. Boundary-only gating is more conservative but does not improve paired accuracy; it also resolves fewer forms than soft. The boundary-only approach is not a valid rule-licensing adapter, because a character boundary alone does not prove that a following syllable is a formal ending/particle.

The paired morphology reports also show 93.70% Kiwi/MeCab agreement on 238 observed soft-rule events, but 31 MeCab and 30 Kiwi candidate licenses lack a matching observed boundary. Across all word segmentations, exact boundary-set agreement is 80.60%; neither analyzer is gold. The new consensus helper therefore requires **two distinct analyzers to agree on the exact source offset and a formal POS-tag class**, does not license substantive contexts, preserves exact-form scope, and marks any applied rule as `analyzer-supported-low-confidence`. It does not convert candidate IPA into accepted IPA or Ukrainian output.

## Current acceptance ledger

- `DONE_VERIFIED_SOURCE`: exact NIKL evidence for `넓죽하다 → 넙쭈카다` and `읽고 → 일꼬` is already present on current main; the regression test checks both Q&A IDs.
- `DONE_VERIFIED_PRIOR_HEAD`: strict/soft and boundary-gated metrics above are backed by the existing research artifact, but are not a fresh run on the current PR head.
- `TODO / pending exact-head CI`: analyzer-consensus helper, tests, and dual-analyzer UGTPHON workflow added on the current continuation branch.
- `PARTIAL_MANIFEST_PROVENANCE`: the original frozen 24-form manifest has been recovered by immutable Git blob SHA `f30c5fa8a59753df3d7c06bbbe7d4e43d0b8fb26`; exact forms, order, and original case IDs match the tracked CSV. The historical commit/tree/PR/run reference remains unresolved; IPA and Ukrainian gold remain unavailable.
- `BLOCKED_SPECIALIST_ADJUDICATION`: no independent Korean broad-IPA gold set.
- `BLOCKED_INDEPENDENT_TARGET_GOLD`: no independent Ukrainian practical-transcription gold set or scoring protocol.
- `BLOCKED_EXTERNAL_ACCESS`: official live NIKL inventory workflow was skipped in prior runs; it is not a pass.
- `PARTIAL / RIGHTS_REVIEW`: source references are not blanket reuse licenses; the existing source registry still requires item-level license/KOGL review.

## First analyzer-consensus CI result and false-positive guard

The first exact-head consensus workflow passed on commit `f3bd48b668e3b72f7dbe7e00c417a5438170ff25` (run [40196004838](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40196004838)). It scored 2,686/2,703 occurrences (99.3711% coverage), exact 1,423/2,686 (52.9784%), CER 9.1981%, with 17 unresolved occurrences/unique forms and zero engine exceptions. It produced low-confidence candidates for 30 unique strict-mode abstentions. The paired strict-vs-consensus subset remained exactly unchanged: 2,655 paired occurrences, 0 exact-rate delta, 0 CER delta.

The first report exposed an important input-boundary hazard: `못잃어` and `안늙었는데` have a likely unspaced adverb-to-verb boundary (`MAG → VV)). Applying a local ending rule does not reconstruct the missing eojeol space or the phrase-level phonology. I therefore added a stricter guard: if both analyzers agree on an unspaced `MAG → VV/VA/VX` boundary, the consensus adapter withholds all licenses for that token. This is intentionally conservative and is being re-benchmarked on the updated head; do not reuse the first run's 30-form coverage as the final result.

The final acceptance criterion remains: exact-head CI passes, the consensus report enumerates remaining abstentions, all analyzer-derived IPA stays diagnostic-only, and strict default output is unchanged.

## Second consensus result after the unspaced-phrase guard

The second consensus workflow passed in [run 40196942415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40196942415) on a prior code head. After withholding licenses for tokens where both analyzers agree on an unspaced `MAG → VV/VA/VX` boundary:

| Strategy | Scored / 2703 | Coverage | Exact matches | Exact rate | CER | Unresolved occurrences |
|---|---:|---:|---:|---:|---:|---:|
| Native strict | 2655 | 98.2242% | 1412 | 53.1827% | 9.1883% | 48 |
| Native soft | 2677 | 99.0381% | 1421 | 53.0818% | 9.1868% | 26 |
| Analyzer-consensus candidate | 2684 | 99.2971% | 1423 | 53.0179% | 9.1930% | 19 |

The consensus candidate scores 29 more occurrences than strict (28 unique forms), but its exact rate is 0.1648 percentage points lower and CER is 0.0047 percentage points worse. The strict-vs-consensus paired subset is unchanged. This is a **coverage/diagnostic improvement, not an accuracy improvement**; keep it opt-in and diagnostic-only. The report identifies 24 unique tokens with a shared likely missing-space adverb-to-verb boundary; no rules are licensed for those tokens.

The remaining 19 unresolved forms are evidence-limited rather than runtime failures. They include: an IPA-adjudication blocker (`삶의`); a complex-coda/ㅎ context without a source-aligned boundary (`긁혔다는거지`); analyzer/orthographic contractions (`있었`, `했었음`, `군대보냈어야`, `벗어날`, `좋아해주는`); lexicalized or phrase-level boundaries (`많이본`, `많을거같이`, `못잃어`, `안늙었는데`, `개같이못하고`, `알잖아아침에`, `개좆망했잖아`); and noisy spellings or ending segmentation (`쫒아내면`, `많앗구나유유유`, `무서웟어`, `죽었잖아`, `웃어넘기겟지만`). One occurrence can contain multiple unresolved contexts, which is why the 48 occurrence count and 49 context count differ.

## Raw port versus practical browser adapter

The Python differential warning compares the **raw vendored JavaScript g2pK port** against Python g2pk; it does not call the practical adapter. Its two raw mismatches are intentional and source-backed: raw JS gives `널쭈카다` / `익꼬`, while the practical browser adapter applies exact-form NIKL corrections to `넙쭈카다` / `일꼬` before IPA. The raw port remains pinned for upstream parity. The differential report now carries the practical adapter surface and labels the mismatch as an expected raw-port divergence covered by the adapter. Browser regression coverage independently checks the corrected output and the source IDs.

## Exact-head verification boundary

Core consensus logic and the diagnostic-only g2pK gate passed the previous head's test/system/browser/benchmark workflows. The latest head `839fd65748ab88f9c0054b8b9b023d48c427c307` includes the final source-register count update and sharper regression assertions; its workflow set is currently queued, not passed. Do not mark those final-head checks successful until GitHub reports completion.

## Reconciled strict/soft/consensus result on current implementation head

The exact-head morphology-consensus workflow [40197611605](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40197611605) passed on code head `781dc5d0d1956d216afd30a04671b2db93e853d6`. Artifact [12600583566](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40197611605/artifacts/12600583566) reports the same pinned 2,703-occurrence UGTPHON split:

| Mode | Coverage | Exact among scored | Coverage-adjusted exact | CER | Unresolved occurrences |
|---|---:|---:|---:|---:|---:|
| Strict | 98.2242% | 53.1827% | 52.2383% | 9.1883% | 48 |
| Soft heuristic | 99.0381% | 53.0818% | 52.5712% | 9.1868% | 26 |
| Kiwi + MeCab-Ko consensus (diagnostic only) | 99.2971% | 53.0179% | 52.6452% | 9.1930% | 19 |

Consensus resolves 28 unique words relative to strict and leaves 19 unresolved occurrences/unique words. This is a coverage gain, not a demonstrated improvement in pronunciation accuracy: exact match among scored cases falls slightly, while coverage-adjusted exact rises because more cases receive a candidate. All consensus-derived IPA remains `diagnostic_only_analyzer_morphology`; it is not independent IPA gold and is not promoted to Ukrainian output. The strict default and target-rendering evidence gate remain unchanged.

## Additional exact-form evidence and runtime boundary (2026-10-25)

The 14-case R002/R003 triage queue is now tracked at `research/r002-r003-source-adjudication-2026-10-24.json`, with schema regression `tests/r002-r003-source-adjudication-queue.test.mjs`. Three exact-form official source findings are recorded as `SOURCE_FOUND_PENDING_IPA`:

- `멋있어`: NIKL Q&A qna_seq=306166 accepts `[머디써]` and `[머시써]` as variants.
- `싫어서`: NIKL Q&A qna_seq=313981 explains ㅎ deletion from ㅀ before a vowel-initial ending and gives `[시러서]`.
- `수많은`: NIKL Korean Basic Dictionary entry 71144 gives `[수ː마는]`.

These are Hangul surface-pronunciation sources, not IPA gold. The browser G2P adapter now applies exact-form source corrections for `싫어서 → 시러서` and `수많은 → 수마는`, preserves the dictionary's `ː` in inspectable IPA only for the exact form `수많은`, and exposes the alternate `멋있어` reading only when the primary G2P surface is one of the two officially attested forms and the alternative IPA-to-target mapping is fully supported. The alternate is marked `lexical-review`; neither generated IPA nor Ukrainian output is labeled gold. The corrections run before IPA adaptation; no direct Hangul-to-Ukrainian mapping was added and no general rule was inferred.

**Important limit:** these source-backed browser corrections do not change native strict-mode decisions for the 48 UGTPHON occurrences. Those remain unresolved in native strict mode until the native engine has an accepted IPA-level exact-form license or independent specialist adjudication. The source queue is for adjudication, not a tuning or scoring split.

The source register now contains 109 records. Its rights audit classifies 105 as `REVIEW_REQUIRED`, 2 as `MANUAL_CLASSIFICATION_REQUIRED`, 1 as `NOT_APPLICABLE_RECORDED`, and 1 as `ITEM_LEVEL_LICENSE_RECORDED`. Thus 107 records still need a human rights decision; adding evidence does not clear item-level reuse terms.

