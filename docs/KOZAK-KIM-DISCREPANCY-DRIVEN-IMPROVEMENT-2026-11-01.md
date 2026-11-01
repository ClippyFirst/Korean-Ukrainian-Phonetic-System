# Kozak Kim: discrepancy-driven phonology improvement — 2026-11-01

## C08 occurrence mapping and exact morphology follow-up — 2026-11-02

The five previously unenumerated C08 contexts have now been reconstructed from the pinned UGTPHON Korean test split (revision `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`) by matching the fortis-versus-plain mismatch signature and exact target token. The eight working IDs are:

| Source row | Target | Conditional morphology / evidence | Status |
|---|---|---|---|
| `multilexnorm2026_1953` | `무고일수도있다는` | `X일 + -(으)ㄹ + 수`; NIKL Q&A 327466 + 307960 | Exact §27 context rule now present; output changed plain `s` → fortis `s͈` |
| `multilexnorm2026_1979` | `했을시` | `했- + -(으)ㄹ + 시`; NIKL Q&A 313481 + 333044 | Exact §27 context rule now present; output changed plain `ɕ` → fortis `ɕ͈`; analyzer disagreement remains |
| `dc_inside_2024` | `유사성` | Exact lexical/suffix analysis unresolved; Q&A 312649 confirms `의외성` only | Keep unresolved; no `-성` generalization |
| `multilexnorm2026_1916` | `해줄것` | Likely `해 줄 것`; Q&A 335204 gives `할 것을[할꺼슬]` and the §27 cohesion condition | Conditional rule-environment support; no exact-token IPA |
| `multilexnorm2026_2011` | `많을거같이` | Likely `많을 거 같이`; Q&A 310899 confirms colloquial dependent noun `거`, Q&A 335204 supports the conditional §27 environment | Conditional morphology; exact token and prosody not attested |
| `dc_inside_2186` | `보일거라` | Likely `보일 거라`; Q&A 310899 + 335204 | Conditional morphology; exact token and prosody not attested |
| `dc_inside_2266` | `내릴수있는` | Likely `내릴 수 있는`; Q&A 331601 gives `알 수 없는[알쑤엄는]`, Q&A 307960 supports the same environment | Direct rule-environment precedent; not exact-token IPA |
| `dc_inside_2557` | `안할듯` | Likely `안 할 듯`; Q&A 336313 gives `할 듯[할뜯]` and notes a pause can permit a plain onset | Direct analogous example; exact UGC prosody unresolved |

The two output changes above were independently verified by comparing pre-context artifact `13097847614` with current artifact `13102456604`: exactly those two Kozak Kim token outputs changed among the shared occurrences; all g2pK outputs remained unchanged.

**Traceability caveat:** the original one-off C08 extraction table containing the eight source-row IDs was not preserved. The five new memberships are high-confidence reconstructions from the pinned benchmark mismatch signature plus exact target-token/source-sentence matching, not copied from that missing extraction artifact. They are recorded as reconstructed rather than primary-source mappings.

Four new NIKL sources are now registered: Q&A 335204 (Rule §27 and the dependent-noun/cohesion condition), 310899 (colloquial dependent noun `거`), 331601 (`알 수 없는[알쑤엄는]`), and 336313 (`할 듯[할뜯]`). These establish conditional morphological/rule environments; they do not supply independent IPA gold for the UGC tokens. No production rule was added in this continuation. All eight contexts are now in the fixture; `유사성` remains unresolved; independent IPA/prosody review and item-level rights remain open.

---

## Latest continuation update — 2026-11-01: C01–C07 blind packets, C08 contexts, and Python sentence parity

This section supersedes the earlier C08/context-readiness notes below. Older entries are retained as historical snapshots.

### C01–C07 independent-review packages

- Seven separate packets: research/ipa-review-packets/blind-ipa-C01.json through blind-ipa-C07.json; six pilot forms per packet, 42 entries and 39 unique source-row IDs.
- All 39 IDs and target tokens were matched to the pinned UGTPHON Korean test split. Raw sentence context is included; canonical labels, phoneme annotations, IPA, engine outputs and benchmark results are excluded.
- The packet schema is now neutral (korean-independent-ipa-review-v1). A leak in the former kozak-kim schema identifier was removed from all seven packets. The regression test now rejects kozak-kim, kozak_kim, g2pk, engine labels, IPA/reference fields and internal artifact identifiers.
- UGTPHON's Korean subset is covered by its Apache-2.0 license and attribution. Raw MultiLexNorm++ source files are not redistributed.
- **Disposition:** READY_FOR_INDEPENDENT_REVIEW_PILOT. This means packages are prepared, not that independent review has occurred. Two separate qualified reviewer submissions remain outstanding.

### C08 context and morphology evidence

A pinned fixture at tests/fixtures/kozak-kim-c08-source-contexts.json restores three source contexts:

1. multilexnorm2026_1953, 무고일수도있다는: full sentence confirms the intended X일 수도 construction. NIKL Q&A 327466 supports the dependent-noun morphology; Standard Pronunciation Rule §27 supports a conditional fortition derivation.
2. multilexnorm2026_1979, 했을시: full user-generated sentence is restored. NIKL Q&A 313481 and 333044 confirm dependent noun 시 after -을; §27 supports a conditional derivation. The unspaced, noisy UGC context leaves exact segmentation/prosodic cohesion less certain.
3. dc_inside_2024, 유사성: context is restored, but NIKL Q&A 312649 confirms 의외성 only; 유사성 is mentioned in the question, not confirmed in the official answer. It remains unresolved.

The existing two exact same-eojeol §27 forms are retained; **no new phonological rule family or generalized -성 / ㄹ+ㅅ rule was added in this continuation**. Five of the eight C08 occurrences still lack recovered source-row IDs/context. None of these context/morphology sources is direct IPA gold.

The 2021 NIKL educational PDF remains listed as supplementary research only. Its item-level reuse marking has not been cleared, and it is no longer relied on as production evidence; the C08 morphology claims instead cite official Q&A 313481/333044 and Q&A 327466.

### Cross-runtime correction and measured effect

Python previously matched exact R013 same-word licenses against the entire request string, so a licensed eojeol inside a sentence could be missed. The Python rule-license path now resolves the containing eojeol and matches only the exact licensed word/pair. Browser and Python full-sentence tests cover both positive contexts; negative controls preserve the unresolved 유사성 case.

The latest completed paired browser benchmark (run 41353450686, artifact 13102456604) scores 2,699 shared occurrences: exact match is 53.4272% for both systems; Kozak Kim CER is 8.1097% versus original g2pK 8.2138%, a −0.1040 pp paired delta (95% sentence-cluster bootstrap CI −0.1951 to −0.0261 pp). Exact-match delta remains unproven because its interval crosses zero. Relative to the preceding PR #416 browser artifact, only the two targeted C08 outputs changed; each improved by one edit, neither became exact, and g2pK outputs did not change.

**Current conclusion:** source-context traceability and runtime parity improved; the eight-case C08 cluster is not fully resolved; C01–C07 still require independent human IPA adjudication. Research prototype only.

---

## Scope and invariants

This workstream improves **only the in-repository Kozak Kim engine**. The vendored/original g2pK implementation is a frozen external comparison baseline: do not edit it, port its rules into Kozak Kim, or optimize Kozak Kim merely to imitate its output.

The objective is to improve Korean pronunciation analysis in Kozak Kim and demonstrate, with paired evidence, where its analysis is better, where it is worse, and where neither engine can be judged from the available reference.

Preserve the pipeline:

`Hangul orthography → structural/morphological analysis → Korean surface phonology → inspectable IPA → Ukrainian adaptation`

The IPA is the comparison boundary. Do not patch Ukrainian spellings to conceal an upstream IPA error. Do not collapse IPA contrasts to improve benchmark exact match unless an independently justified comparison profile is explicitly labelled as such.

## Starting point and baseline evidence

- Default branch at start: `main`, `7bbbd7e7ce888a9c995bb70959e17858263c07a8`.
- Working branch: `research/kozak-kim-discrepancy-driven-improvement-2026-11-01`, based on PR #415's verified research/code line `559000fa845b40450cb7173167a2d28016d282f8` (116 commits ahead of main, 0 behind at branch creation).
- Paired browser diagnostic: [Actions run 41331679243](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41331679243), artifact `13093672281`, report `kozak-kim-vs-original-g2pk-browser-report.json`.
- This artifact contains 2,703 eligible occurrences and 2,699 shared scored occurrences. Both engines scored 1,442/2,699 exact (53.4272%). Kozak Kim CER was 8.1358%; g2pK CER 8.2138%. The sentence-cluster bootstrap exact-delta 95% CI was [-0.20697, +0.20056] percentage points; it crosses zero. The CER-delta interval was [-0.16560, 0] percentage points and touches zero. This is evidence of a lower CER point estimate for Kozak Kim on this diagnostic, not a statistically established universal winner.
- On the 2,699 shared occurrences: 1,438 were exact for both; 4 exact only for Kozak Kim; 4 exact only for g2pK; 1,253 were wrong for both. In the original pre-§27/§26 baseline artifact, there were 23 occurrences where the engines emitted different normalized IPA strings. In that historical snapshot, Kozak Kim had the smaller edit distance on 15 and g2pK on 8. This is a useful triage signal, not a linguistic adjudication.
- g2pK remains unchanged and is not a gold oracle. UGTPHON references are diagnostic phonetic annotations, not a fully independent normative IPA gold set.

## First verified discrepancy repair

### §27 — complete `-(으)ㄹ게` ending boundary

The paired report exposed `올게이`: Kozak Kim produced fortis /k͈/ while g2pK retained plain /ɡ/, and the reference was closer to g2pK. The current rule already correctly handles `할게`, `다를게`, and `안타까울게`, but it previously triggered on any internal `ㄹ게` substring.

NIKL Q&A 330963 (2026-05-11) explicitly explains that `할게` consists of `하-` + ending `-ㄹ게` and is pronounced [할께]; Q&A 317780 and 325075 corroborate the ending-based analysis. This is a morphological condition, not a raw character-sequence rule.

**Change made on this branch:** the §27 rule now requires the current eojeol to end in the complete `-ㄹ게` ending, optionally followed by sentence-final `요` (`...ㄹ게` or `...ㄹ게요`). It no longer fires on `...ㄹ게이`. A focused regression test keeps the positive cases `할게`, `할게요`, `다를게`, `안타까울게` and uses `올게이` only as a substring-boundary negative control. The negative control is not being declared a normative lexical pronunciation.

Sources:
- NIKL Q&A 330963 (2026-05-11): confirms the attached ending -ㄹ게 and [할께] under §27: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=330963
- NIKL Q&A 308180 (2024-12-24): confirms 할게요 is -ㄹ게 plus the auxiliary particle 요; it grounds the optional 요 boundary, while Q&A 330963 / §27 ground fortition: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=308180
- The NIKL educational PDF also explicitly gives 할게요 [할께요] as a §27 example (search-indexed official source).

**Status:** DONE_VERIFIED for the native rule implementation, focused regression, full browser/Python/build checks, and paired before/after diagnostic. The rule's broader productivity is still limited to the attested ending boundary; this does not verify unrelated morphology or IPA conventions.

## Discrepancy inventory from the paired report

The occurrence-level ledger is stored in [`research/KOZAK-KIM-PAIRED-DISCREPANCY-LEDGER-2026-11-01.csv`](../research/KOZAK-KIM-PAIRED-DISCREPANCY-LEDGER-2026-11-01.csv). Its original 23 rows are explicitly tagged `baseline_run_41331679243_pre_§27_and_§26`; two additional rows record the newly created post-§26 output divergences from run 41336800424. The baseline tag refers to the original paired run before both the §27 substring-boundary repair and the §26 出産-family repair; the row for `올게이` separately records its §27 before/after result. The 25 rows therefore span two labelled snapshots and must not be treated as one simultaneous comparison. Each row records source identity, reference, both engine outputs, edit distances, a provisional phenomenon cluster, and adjudication notes.

The original baseline ledger confirms 15 occurrences with lower edit distance for Kozak Kim and 8 for g2pK. This is a historical-snapshot count, not the current exact-head disagreement count, and must not be interpreted as 15 independent lexical wins: repeated forms include `없는`, `없다`, and `사건`, and the bootstrap unit remains the source sentence/utterance row.

Four exact-match discordances are especially informative:
- Kozak Kim only: `닮다`, `못잃어`, `넘게`, `인기`.
- g2pK only: four occurrences of `없는`.

The g2pK-only exact cases all concern the corpus omitting vowel length that is represented in the registered NIKL evidence. They are not sufficient grounds to remove length from Kozak Kim. `못잃어` is also variant-sensitive: the source register records both insertion and non-insertion readings, so the exact match is not by itself a normative ranking.

## Mass mismatch inventory

The direct browser diagnostic artifact from run `41335549779` (`13094469490`) contains 2,699 scored occurrences. Strict profile: 1,442 exact and 1,257 mismatches (53.4272% exact). The unadjudicated broad-candidate sensitivity profile: 2,522 exact and 177 residual mismatches (93.4420% exact; CER 1.2211%). The broad profile is research-only and does not define normative correctness.

A feature-alignment review produced the occurrence-level cluster summary in [`research/KOZAK-KIM-MASS-MISMATCH-CLUSTERS-2026-11-01.csv`](../research/KOZAK-KIM-MASS-MISMATCH-CLUSTERS-2026-11-01.csv). Top recurring clusters (counts are unique occurrences within each cluster, not additive; clusters overlap):

- Strict-only profile differences: dark/lateral [ɭ] versus /l/ (464); conditioned /h/ allophones [ɦ, ç, β, ʝ, ɸ, x, …] versus broad /h/ (261); palatal nasal [ɲ] versus /n/ (77).
- Broad residual differences: aspiration notation [ʰ] versus [h] (37); /y/ versus /ɥi/ (35); unreleased-coda diacritic (34); /l/ versus [ɾ] (12); fortis mark missing in the reference/prediction comparison (11); vowel length (15).
- Stress-mark differences occur in 11 strict-profile occurrences and overlap with length/IPA annotation differences.

These are not 10 confirmed phonological defects. Most are likely IPA-profile or narrow-allophone differences; the /l/~[ɾ] and fortition groups require environment-specific linguistic review. The inventory preserves examples, profile scope, counts, provisional classification, and next actions. Do not sum cluster counts or use them as independent statistical units.

## Second source-backed candidate: §26 fortition in the 출산 family

The broad residual fortition cluster includes `비출산`. In the pre-fix diagnostic, both Kozak Kim and g2pK emitted `pi.tɕʰul.san` (distance 2), while the reference included fortis `/s͈/`. The NIKL Korean Basic Dictionary directly lists `출산[출싼]`, `출산율[출싼뉼]`, `출산하다[출싼하다]`, and `저출산[저ː출싼]`. Standard Pronunciation Rule §26 covers Sino-Korean ㄹ + ㄷ/ㅅ/ㅈ fortition; the dictionary entries are exact lexical evidence, not a license to generalize from every ㄹ+ㅅ string.

**Change implemented:** the exact-form §26 license map includes `출산`, `출산율`, `출산하다`, corpus form `비출산`, and dictionary-attested `저출산`, each with the internal `출>산` boundary. `비출산` is rule-derived from the attested `출산` constituent; it is not presented as a separate direct dictionary quotation. Positive controls cover all five forms; negative controls `비출고` and `저출고` confirm that the rule does not fire from an arbitrary substring.

Source: [NIKL Korean Basic Dictionary search for 출산](https://krdict.korean.go.kr/kor/dicMarinerSearch/search?ParaWordNo=&mainSearchWord=%EC%B6%9C%EC%82%B0) directly returns `출산[출싼]`, `출산율[출싼뉼]`, `출산하다[출싼하다]`, and `저출산[저ː출싼]`. The official [NIKL explanation of Standard Pronunciation Rule §26](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=318429) gives the exact ㄹ + ㄷ/ㅅ/ㅈ environment and source-listed examples. Its later [Q&A on exceptions and lexical boundaries](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=327397) cautions that direct Sino-Korean constituent structure matters; therefore the implementation remains exact-form licensed.

**Status:** DONE_VERIFIED for the original four-form set (`출산`, `출산율`, `출산하다`, `비출산`), its positive/negative controls, exact-head CI and paired benchmark. The additional dictionary-attested `저출산` control was added after artifact `13095038704`; its focused/full exact-head CI is pending. It is not counted as a benchmark win. This does not make R012 a productive Sino-Korean analyzer; broader R012 coverage remains partial.

## Prioritized research clusters

### A. Morphology-conditioned fortition and rule boundaries — highest implementation priority

Evidence: 닮다, 넘게, 인기, 사건, 다를게, 안타까울게, 할게, 올게이. Existing rule families include NIKL §§24–28. The first repair narrows the productive-looking §27 rule to the complete ending boundary.

Next work:
1. Audit every §24–§28 rule for a declared morphological trigger, exact boundary, positive cases, and near-minimal negative controls.
2. Ensure exact full-form licenses are not accidentally generalized to substrings, homographs, or compounds.
3. Add tests for `-ㄹ게`, `-ㄹ게요`, and lookalikes where the same grapheme sequence is not the ending.
4. Re-score all paired occurrences and report both exact and edit-distance deltas, including regressions.

### B. Complex-coda / ㄺ-before-ㄱ ordering

Evidence: 읽고. The native engine's `일꼬` surface is closer to the corpus IPA than g2pK's `익꼬`. Preserve the explicit NIKL §11 verbal-stem exception and its lexical/morphological guard. Add contrasts for nouns (e.g. 닭이) and non-licensed ㄺ forms so the verb exception cannot leak into all complex-coda contexts.

### C. Long vowels and reference convention

Evidence: 없는 ×4, 없다 ×2, 없어, 알다, 많이, 사건, 한자. Several g2pK-only exact occurrences are caused by the reference omitting length where the NIKL-backed lexical entry preserves it. This is not automatically a Kozak Kim error. Separate:
- normative/lexical length evidence;
- corpus annotation omissions;
- cross-runtime IPA profile differences;
- true engine length insertion/deletion errors.

Do not remove long vowels globally, do not use the benchmark's closest variant as an authority, and do not alter the strict score normalizer to hide length.

### D. Variable morphology and phrase-level readings

Evidence: 못잃어. The registered NIKL usage-survey source reports both insertion and non-insertion readings. Keep both variants visible; do not turn one selected corpus annotation into a categorical rule or claim that the primary candidate is normatively dominant without the source percentages for this exact expression.

### E. IPA convention and segmental annotation

Use the mass mismatch inventory and its profile scope. The 464 dark-l, 261 /h/-allophone, and 77 palatal-nasal occurrences are primarily strict IPA-profile candidates; 37 aspiration-notation, 35 /y/~/ɥi/, 34 unreleased-coda, and 12 lateral-flap occurrences remain in the broad residual. Do not rewrite the engine to match a narrow transcription convention without independent review. The 11 residual fortition cases are a separate phonological-rule workstream; `비출산` now has an exact §26 license, while the remaining examples are not yet adjudicated.

### F. Remaining true engine candidates

대한민국 is closer under g2pK by one edit; 알다 and 없어 also appear closer under g2pK because the benchmark reference omits length. Each needs source-level analysis before code changes. No rule is changed merely because one engine has lower edit distance on a single noisy token.

## Required discrepancy-card schema

Every future discrepancy cluster must record:
- stable cluster ID and phenomenon;
- occurrence IDs and lexical types separately;
- exact source Hangul, token context, and word/phrase boundaries;
- Kozak Kim IPA, untouched g2pK IPA, all reference alternatives, and normalized forms;
- rule trace and rule-order path from Kozak Kim;
- whether the difference is surface phonology, IPA convention, lexical variant, morphology, corpus noise, or unknown;
- primary source URL, exact article/Q&A/item scope, and source-register row;
- positive, negative, boundary, and interaction controls;
- proposed implementation location and expected blast radius;
- pre-change baseline, post-change paired results, regression count, coverage/abstention change;
- status: `DONE_VERIFIED`, `PARTIAL`, `TODO`, `BLOCKED`, or `DEFERRED`.

Do not aggregate duplicate tokens as independent lexical evidence. Statistical resampling must cluster by sentence/utterance row, not by token.

## End-to-end improvement loop

1. Freeze a reproducible Kozak Kim/g2pK paired artifact with identical inputs and references.
2. Extract all engine-discordant occurrences, all cases where Kozak Kim is farther from every reference, and high-frequency shared errors.
3. Group by the actual conditioning environment (morpheme, coda, onset, vowel, boundary, phrase context), not by visually similar IPA strings alone.
4. Adjudicate each group against NIKL standard/Q&A, authoritative dictionary entries, and qualified Korean phonology review. Treat g2pK as a comparison system only.
5. Write a formal rule contract: trigger, ordering, exceptions, alternatives, and abstention conditions.
6. Add RED tests first: positive, negative, minimal-pair, boundary, and rule-interaction cases.
7. Implement the smallest change in the native Kozak Kim module. Preserve provenance and the IPA trace. Keep g2pK files untouched.
8. Run the focused test, full Node suite, browser build, Python suite/parity checks where applicable, and the paired benchmark on the same pinned data.
9. Evaluate paired exact classification, CER, PER/feature diagnostics, coverage, abstentions, regressions, cluster-bootstrap intervals, and per-cluster effects.
10. Promote only source-backed, holdout-generalizing rules. Otherwise retain a research candidate or explicit unresolved status.

## Acceptance criteria for a claimed Kozak Kim advantage

A claim must state the exact corpus/version, shared occurrence denominator, reference convention, profile version, coverage, abstentions, exact rate, CER, uncertainty interval, and per-cluster results. A robust claim of overall superiority additionally requires an independently adjudicated held-out set and a paired confidence interval that supports the claimed direction. Until then, use the narrower wording: “Kozak Kim is better on these source-backed discrepancy classes under this diagnostic,” with examples and counterexamples.

## Current task ledger

| Task | Status | Acceptance evidence / next step |
|---|---|---|
| Freeze scope: Kozak Kim only; g2pK immutable | DONE_VERIFIED | Explicit user direction; branch changes only native Kozak Kim and its tests/docs |
| Inspect paired diagnostic and extract output-different cases | DONE_VERIFIED | Artifact 13093672281; 2,699 shared; 23 output-different; 15 KK closer / 8 g2pK closer |
| §27 complete `-ㄹ게` boundary repair | DONE_VERIFIED | Browser test 1114 passed; run 41335549779 confirms `올게이` distance 3→1, no other paired Kozak Kim output changes, and no regressions in 2,699 shared occurrences |
| §26 exact `출산`-family fortition licenses | PARTIAL (split verification) | Original `출산`, `출산율`, `출산하다`, `비출산` set: DONE_VERIFIED by run 41336800458 and paired artifact 13095038704. New `저출산` dictionary-backed control and `저출고` negative control: code/tests authored, exact-head CI pending; not included in paired artifact. Productive R012 morphology remains partial |
| Long-vowel discrepancies | TODO | Source-vs-reference adjudication for 없는/없다/없어/알다/많이/사건/한자 |
| §11 complex-coda contrast expansion | TODO | Positive verbal-stem and negative noun/lookalike controls, source review |
| 못잃어 variant adjudication | PARTIAL | NIKL survey records both variants; no source-backed ranking for this exact item |
| Broad IPA convention clusters | BLOCKED | Independent IPA convention and reviewer adjudication needed |
| Overall Kozak Kim superiority claim | BLOCKED | Exact-match CI still crosses zero; CER advantage is supported on this diagnostic only. Independent held-out, normatively adjudicated gold required |

## Measured result of the §27 boundary repair

The repaired branch was rerun through the existing paired browser benchmark after adding `src/app/engine_rules_ctx.js` and the morphology regression test to the workflow's PR path filter.

- Before repair: run [41331679243](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41331679243), artifact `13093672281`. Shared subset: 2,699. Kozak Kim exact 1,442/2,699 (53.4272%), CER 8.1358%; g2pK exact 1,442/2,699 (53.4272%), CER 8.2138%. Paired CER delta (Kozak minus g2pK) = -0.07802 pp; 95% sentence-cluster bootstrap CI [-0.16560, 0] pp.
- After repair: run [41335549779](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549779), artifact `13094763897`. Same shared subset: 2,699. Kozak Kim exact 1,442/2,699 (53.4272%), CER 8.1271%; g2pK exact 1,442/2,699 (53.4272%), CER 8.2138%. Paired CER delta = -0.08669 pp; 95% sentence-cluster bootstrap CI [-0.17414, -0.01235] pp. Exact-match delta remains zero; its 95% CI [-0.20697, +0.20056] pp crosses zero.
- Paired unit: 264 UGTPHON sentence/utterance rows; 2,000 bootstrap resamples; seed 20261101.
- A record-by-record diff of the before/after JSON artifacts found exactly one changed Kozak Kim IPA output among all 2,699 shared scored occurrences: `올게이` changed from `ol.k͈e.i` (edit distance 3) to `ol.ɡe.i` (distance 1). g2pK was `ol.ɡe.i` in both runs. No other Kozak Kim paired output changed; no benchmark regression was observed.
- The CER reduction is exactly the two-edit improvement on this occurrence; exact match does not increase because the reference still differs in other phonetic details. This verifies the targeted repair, not a broad accuracy jump.

Interpretation: on this diagnostic, Kozak Kim's CER advantage over untouched g2pK is now supported by the paired sentence-cluster interval, while exact-match rates remain tied. This is a narrow, source-backed diagnostic result. It does not establish universal superiority, nor does it resolve IPA convention differences or the need for independent normative gold.

## Repository-wide test-candidate pool

The existing exhaustive test-case register extractor also ran on the current branch head. Actions run [41335266701](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335266701) completed successfully and produced artifact `13095127295`. Its classification queue contains 6,389 candidates: 5,174 assertion candidates and 1,215 test declarations. Dimension hints include 667 IPA, 298 Korean-surface, 373 rule-trace, 916 status/abstention, 558 Ukrainian-target, 226 variant, and 479 boundary/serialization candidates. **All 6,389 require manual review**; 1,701 extracted assertion forms are unsupported, and observed results were not inferred. This is a broad test-discovery pool, not gold data and not proof that all linguistic phenomena have been adjudicated.

Use it to locate existing positive/negative controls and identify gaps, then classify by linguistic environment and source evidence. Do not bulk-promote extracted literals into gold expectations.

## Verification status

Code/test verification head: `5fca54917ceea174d74205198e9929101b2172d4`; paired-benchmark code-bearing head: `8ac8cd18cadb8f074ecdc3cbc7ee3a562144a3dc`. Subsequent commits only update research evidence, acceptance gates, and the handoff; they do not alter the verified engine/test code.

- Actions run [41335266673](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335266673): **PASS**. Browser regression tests: 1,365/1,365; public-page build: PASS; generated-page verification: PASS; Python regression/data-integrity job: PASS.
- After updating the benchmark workflow path filter, run [41335549717](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549717): **PASS**. Browser suite/build and Python regression/data-integrity passed again on code-bearing head `8ac8cd18cadb8f074ecdc3cbc7ee3a562144a3dc`.
- Run [41335549779](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549779): **PASS**. Pinned corpus validation, direct browser diagnostic, paired Kozak Kim-vs-original-g2pK diagnostic, raw-surface diagnostic, and paired native-vs-g2pk diagnostic all completed and artifacts uploaded.
- The focused §27 boundary test passed as browser test 1114. It confirms `할게`, `할게요`, `다를게`, `안타까울게` retain the licensed rule and `올게이` does not receive fortition from an internal substring.
- Actions run [41335266701](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335266701): **PASS**. Test-case register extraction, validation, inventory generation, and artifact upload all succeeded.
- An earlier run failed because the new NIKL source row duplicated an existing `SRC-NIKL-QNA-330963` and the source-register test still expected 141 rows. The duplicate was removed, the existing record reused, a distinct `SRC-NIKL-QNA-308180` row added, and the expected count updated to 142 (133 review-required). The latest browser and Python jobs pass.
- The metadata-only official NIKL source-inventory job was skipped; item-level reuse/license review remains open.
- The paired Kozak Kim-vs-original-g2pK benchmark has now been rerun after the repair; see the measured before/after section above. The official NIKL source-inventory metadata-only job was skipped, and item-level reuse/license review remains open.


## Measured result of the §26 출산-family repair

The exact-head paired browser run [41336800424](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41336800424), artifact `13095038704`, re-ran the same 2,699 shared occurrences against the unchanged original g2pK implementation. Before/after artifact comparison used `13094763897` and `13095038704`.

- `비출산`: Kozak Kim surface `비출산` → `비출싼`; its IPA edit distance to the UGTPHON reference improved 2 → 1. Original g2pK remained `비출산` (distance 2).
- `출산`: Kozak Kim surface `출산` → `출싼`; original g2pK remained `출산`. The IPA edit distance did not improve because UGTPHON's IPA uses an aspirated-sibilant annotation where the NIKL dictionary gives the fortis Hangul pronunciation. This is a useful example of why surface-form source adjudication and raw IPA CER must be reported separately.
- No other paired Kozak Kim outputs changed in this §26-only comparison; g2pK outputs remained unchanged.
- On the paired subset, exact match stayed tied at 1,442/2,699 (53.4272%). Kozak Kim CER improved 8.1271% → 8.1228%; original g2pK CER remained 8.2138%. Paired CER delta improved from −0.08669 pp to −0.09102 pp; post-change 95% sentence-cluster bootstrap CI [−0.17881, −0.01647] pp (264 row clusters, 2,000 resamples, seed 20261101). This is a small measured diagnostic gain, not a universal accuracy claim.

The source-derived `저출산` control was added after inspecting the same official dictionary entry; it is not a UGTPHON test-set-derived exception and was not counted as a benchmark win. The dictionary directly records its pronunciation `[저ː출싼]`; the engine's exact rule license addresses fortition only, not independent validation of vowel length. This follow-up control still awaits exact-head CI.


### Verification status of the `저출산` follow-up

The code and positive/negative controls for `저출산` were added after the completed benchmark/system runs 41336800424 and 41336800458. New exact-head Actions for the current branch tip were created: system run `41339399132`, paired browser benchmark `41339399053`, native paired benchmark `41339399044`, and register extraction `41339399017`. At the time of this handoff these jobs were queued/in progress; no pass is claimed for the new `저출산` test until those runs complete.

 
## Follow-up: source-derived §26 and lexical readings — 2026-11-01

This continuation supersedes the earlier pending status for 실시간 and 이중성. Scope remains **Kozak Kim only**; original g2pK is unchanged and remains a comparison baseline, not linguistic gold.

### Implemented and verified

- **§26 실시간**: official NIKL lexical material records 실시간(實時間); combined with NIKL Standard Pronunciation Rule §26, this establishes the exact Sino-Korean 실>시간 boundary. Kozak Kim now surfaces 실씨간. The license is exact-form scoped; no generic ㄹ+ㅅ inference was introduced.
- **Exact lexical 이중성**: NIKL Korean Basic Dictionary directly lists 이중성(二重性) [이ː중썽]. The dated lexical addition preserves the long vowel and fortis onset in project IPA iː|dʑuŋ|s͈ʌŋ. IPA is derived from the attested Hangul reading, not supplied by NIKL. The Ukrainian target is explicitly provisional and is not accepted as confirmed output.
- **-성 research boundary**: the Basic Dictionary identifies -성(性) as a derivational suffix, and NIKL Q&A 312649 directly confirms 의외성[의ː외썽]. That answer does not directly confirm 유사성; the questioner's examples are not treated as official attestations. No productive suffix rule is implemented.
- **Phrase cases remain bounded**: 했을시 and 무고일수도있다는 occur without reliable whitespace in the corpus. The engine does not infer 했을 시 or 일 수 boundaries from an unspaced string. Exact phrase/morphology evidence is still required.

Sources registered: SRC-NIKL-INFO-SILSIGAN, SRC-NIKL-DIC-IJUNGSEONG, SRC-NIKL-DIC-SEONG-SUFFIX, and SRC-NIKL-QNA-312649. The source register now contains 147 rows; 138 remain review-required for item-level reuse terms. The official metadata-only source-inventory workflow was skipped, so rights closure is not claimed.

### Paired diagnostic result

Exact-head browser comparison: [Actions run 41342127112](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127112), artifact 13098181051. Same 2,699 shared occurrences:

- Exact match: 1,442/2,699 (53.4272%) for both engines; exact-rate delta remains zero.
- Kozak Kim CER: 8.1184%; original g2pK CER: 8.2138%; paired CER delta: −0.09536 percentage points.
- Sentence-cluster bootstrap (264 source rows, 2,000 resamples, seed 20261101): exact-delta 95% CI [−0.20697, +0.20056] pp (crosses zero); CER-delta 95% CI [−0.18443, −0.02046] pp. This is diagnostic evidence on UGTPHON, not independent normative adjudication.
- Only two Kozak Kim outputs changed relative to the preceding post-§26 snapshot: 실시간 improved from edit distance 3→2; 이중성 changed from i.dʑuŋ.sʌŋ to iː.dʑuŋ.s͈ʌŋ, preserving the dictionary's long vowel and fortisness while edit distance stayed 1 because UGTPHON omits length. g2pK outputs did not change; no paired regressions were observed.

### Mass-cluster status after this pass

- C08 fortition cluster: 11 initial occurrences → 8 residual after source-backed repairs for 비출산, 실시간, and 이중성. Remaining cases include the unspaced phrase forms and 유사성; no broad suffix or phrase rule is authorized.
- C09 length cluster: 15 → 16 because source-backed 이중성[이ː중썽] now correctly preserves length even though the corpus reference omits it. Do not strip length to optimize CER.
- C01–C07 remain profile/allophony or environment-review tasks. No changes were made for [ɭ]~/l/, conditioned /h/, [ɲ], [ʰ]~/h/, /y/~/ɥi/, unreleased-coda marks, or liquid realization.

### Verification

- System run [41342127230](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127230): PASS. Browser tests 1,368/1,368; public-page build and generated-page verification PASS; Python regression/data-integrity PASS. The metadata-only NIKL inventory job was SKIPPED.
- Browser g2pK integration [41342127246](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127246): PASS; original practical-mode integration remains intact.
- Native-vs-g2pK paired diagnostic [41342127228](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127228): PASS.
- Morphology consensus [41342127218](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127218), research morphology adapter [41342127131](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127131), and exhaustive test-case register extraction [41342127140](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127140): PASS.
- Multi-engine Charsiu/ByT5 diagnostic [41342127137](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127137) was still in progress at this handoff; no result is claimed.

**Readiness:** implementation and available software checks are verified, but the project remains a research prototype. Independent Korean IPA adjudication, independent Ukrainian target review, item-level NIKL rights review, and a held-out specialist-adjudicated corpus remain blockers. PR #416 stays draft and unmerged.


## Exact-head reproducibility update — 2026-11-01

The latest branch head `0c7688bb91687fec81965f426c24dd248df918bb` was re-run through [UGTPHON workflow 41342607471](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607471). Its paired browser artifact `13097847614` was downloaded and inspected. The result reproduces the immediately preceding artifact `13098181051` with no Kozak Kim output changes across the 2,699 shared scored occurrences.

- 2,703 eligible occurrences; Kozak Kim scored 2,699 (4 unresolved, 99.8520% coverage); g2pK scored 2,703.
- Shared subset: 2,699. Exact both: 1,438; Kozak Kim only: 4; g2pK only: 4; both wrong: 1,253.
- Shared exact match: 1,442/2,699 (53.4272%) for each engine. Exact delta is zero; sentence-cluster 95% CI [-0.20697, +0.20056] pp crosses zero.
- Kozak Kim CER 8.1184%; g2pK CER 8.2138%; paired CER delta -0.09536 pp; sentence-cluster 95% CI [-0.18443, -0.02046] pp (264 row clusters, 2,000 resamples, seed 20261101).
- There are 26 current occurrences with different normalized IPA strings. The earlier 23-row count belongs to the original pre-§27/§26 baseline; the current 26 reflect the repaired `올게이` case leaving the set and four later source-backed output differences entering it (`비출산`, `출산`, `실시간`, `이중성`). The 27-row occurrence ledger deliberately retains historical snapshots; it is not a simultaneous current set. `paired-17` remains as historical evidence for the repaired false positive.

Exact-head system verification [41342607492](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607492), browser g2pK integration [41342607484](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607484), paired native diagnostic [41342607520](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607520), morphology consensus [41342607489](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607489), morphology adapter [41342607508](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607508), and test-case extraction [41342607558](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607558) all passed. The metadata-only NIKL inventory job was skipped; optional ByT5/Charsiu inference and joined neural pairing were skipped. No neural score or source-rights clearance is claimed.

This verifies exact-head reproducibility and preserves the narrow claim: lower paired CER on this diagnostic profile, tied exact match, no independent normative IPA or Ukrainian target validation.


### Current IPA-discordance direction and unresolved occurrences

For the current exact-head artifact `13097847614`, the 26 normalized-IPA-discordant occurrences comprise **21 distinct token forms**. Relative to the best shared UGTPHON reference alternative, Kozak Kim has the lower edit distance on 17 occurrences, original g2pK on 7, and the engines tie on 2. These are occurrence-level reference-distance comparisons, not 17 independently adjudicated lexical wins: repeated forms include `없는` (4), `없다` (2), and `사건` (2), and the resampling unit remains the source sentence/utterance row.

The same artifact contains four unresolved Kozak Kim occurrences:

| Occurrence | Input | Evidence status | Decision |
|---|---|---|---|
| `dc_inside_2050` | `칡칡이` | Lexical/structural analysis not established | Keep unresolved; do not copy g2pK's resolved guess as gold |
| `dc_inside_2183` | `쫒아내면` | Possible nonstandard spelling/typo for `쫓아내면`; not confirmed by this benchmark | Keep source orthography intact; do not auto-correct spelling in the phonology engine |
| `dc_inside_2202` | `많앗구나유유유` | Likely nonstandard inflectional spelling, but no normalization contract or adjudication | Keep unresolved; no silent typo repair |
| `dc_inside_2241` | `무서웟어` | Likely nonstandard spelling of an inflected form, but source intent is not adjudicated | Keep unresolved; no silent typo repair |

Original g2pK returns outputs for these four inputs, but that does not establish those outputs as correct. The correct next step is an explicit source-orthography/typo policy and, for `칡칡이`, lexical/morphological evidence. Until then, Kozak Kim's abstention is preferable to an unsupported confident guess.


## Continuation — C01–C07 blind packetization and C08 evidence triage (2026-11-01)

### C01–C07 independent review packets

Seven separate source-blind pilot packets are stored in `research/ipa-review-packets/blind-ipa-C01.json` through `kozak-kim-C07.json`; see [packet index](../research/ipa-review-packets/README-KOZAK-KIM-C01-C07.md). They exclude engine outputs, reference IPA, engine identities, benchmark rankings, and proposed rule explanations.

**Not ready for external scoring:** artifact `13097847614` contains token-level forms and source-row identifiers but not the original sentence/utterance. Restore full licensed source context, verify item-level reviewer-sharing rights, freeze packet hashes, and only then dispatch blind copies. Current status: `PARTIAL / BLOCKED_MISSING_SENTENCE_CONTEXT_AND_RIGHTS_CHECK`.

### C08 exact-form evidence triage

- **의외성:** NIKL Q&A 312649 (2025-04-09) points to Urimalsaem's explicit pronunciation `[의ː외썽/의ː웨썽]`. The question mentions 다양성[-썽] and 유사성[-썽] as examples, but the official answer confirms only 의외성. Do not generalize this source to every `-성` form. [Official Q&A](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=312649).
- **했을시:** NIKL Standard Pronunciation Rule §27 establishes fortition of ㄱ/ㄷ/ㅂ/ㅅ/ㅈ after the adnominal `-(으)ㄹ` ending. It does not establish that this unspaced corpus string is segmented as `했을 시` or that this was the intended construction. Apply §27 only if the original context confirms the morphology and boundary. [Official rule text](https://korean.go.kr/kornorms/regltn/regltnView.do).
- **무고일수도있다는:** exact spacing, morpheme segmentation, and the relevant trigger remain unresolved; no exact-form source or trustworthy parse is established.

**Decision:** no C08 production change. No productive `-성` suffix rule. No silent insertion of spaces or inferred morphology. Keep all eight residual cases unresolved until each exact occurrence has source context, a defensible morphological analysis, and source-backed pronunciation. Any later change must add positive, negative, boundary, and interaction controls before paired re-benchmarking.


## C08 evidence update — exact morphology leads checked (2026-11-01)

The official-source search found useful **morphological** evidence for two of the residual forms, but not direct lexical pronunciation attestations. The decision remains research-only; no engine code changed.

| Corpus token | Candidate analysis | New official evidence | Decision |
|---|---|---|---|
| `무고일수도있다는` | `무고 + 이- + -(으)ㄹ + 수 + 도 + 있- + -다는`, i.e. likely `무고일 수도 있다는` | NIKL Q&A 327466 explicitly parses `둘 다일 수도` as noun + copula `이-` + adnominal `-(으)ㄹ` + dependent noun `수` + particle `도`. Standard Pronunciation Rule §27 directly includes `할 수는[할쑤는]`. | Strong conditional morphology lead: if the missing source utterance confirms this parse and prosodic connection, §27 predicts fortition at `수`. Still not a direct attestation of this exact corpus phrase or its pronunciation. |
| `했을시` | likely `했- + -(으)ㄹ + 시`, i.e. `했을 시` with dependent noun `시(時)` | NIKL's 2021 public-language guideline (p. 106) explicitly uses `규칙을 어겼을 시에는` and identifies `시` as a dependent noun used after `-을`. Rule §27 supplies the conditional fortition rule. | Strong conditional morphology/spacing lead. The exact source sentence and prosodic connection remain missing; no direct pronunciation entry for `했을 시` found. |
| `유사성` | Sino-Korean noun + suffix `-성` | NIKL Q&A 312649 asks about 의외성 and mentions 유사성[-썽] in the question, but its answer confirms only 의외성 `[의ː외썽/의ː웨썽]`. No exact official dictionary/Q&A attestation for 유사성 was found in this search. | Still unsupported as an exact lexical claim. Do not generalize a productive `-성` fortition rule from 의외성. |

**Evidence boundary:** Rule §27 states that ㄱ/ㄷ/ㅂ/ㅅ/ㅈ after the adnominal `-(으)ㄹ` are fortis and gives `할 수는[할쑤는]`; the official explanation also notes that closeness between the two elements matters. This establishes the rule environment, not the missing source context for these two unspaced tokens. No positive production patch is justified until source-row utterances are restored and checked. Source records added: `SRC-NIKL-QNA-327466` and `SRC-NIKL-EDU-2021-DEPENDENT-SI`.


## C08 occurrence-mapping gap — 2026-11-01

The mass-mismatch cluster register reports eight C08 occurrences, but the current `KOZAK-KIM-PAIRED-DISCREPANCY-LEDGER-2026-11-01.csv` has 27 rows and contains no C08 entries. Three source-row IDs were recovered from paired artifact `13097847614`: `multilexnorm2026_1953` (`무고일수도있다는`), `multilexnorm2026_1979` (`했을시`), and `dc_inside_2024` (`유사성`). The other five C08 occurrences are not currently enumerated in either the occurrence ledger or the inspected report excerpt. The stale phrase “remaining cases in the paired ledger” has been replaced with this explicit gap. Do not claim all eight have been source-reviewed until the five missing source-row IDs and exact utterances are recovered.


## Kozak Kim discrepancy review continuation — 2026-11-01

- Continuation branch: `research/kozak-kim-independent-ipa-packets-2026-11-01`; final branch head: `17647b219aa4310e37d77a8dd457c73c0871ace0`.
- Stacked Draft PR #417 targets the PR #416 branch, is mergeable, and contains only the incremental review-packet, evidence-register, test, and handoff changes. PR #416 and PR #415 remain open; neither was merged or modified.
- C01–C07: seven separate source-blind pilot JSON packets (six pilot forms each), separate reviewer instructions, and an internal-only cluster/provenance index. Browser regression test verifies no system/baseline names, candidate/reference IPA, or internal artifact identifiers leak into packet JSON. Packets remain PARTIAL/BLOCKED for scoring until exact source utterances and item-level reviewer-sharing rights are restored and verified.
- C08: NIKL Q&A 327466 supports the morphology of `일 수도`; NIKL 2021 guideline p.106 confirms dependent noun `시` after `-을`; Standard Pronunciation Rule §27 supplies conditional fortition. These are conditional morphology/rule-environment leads, not exact pronunciation attestations. No production phonology change; no generalized `-성` rule.
- C08 traceability correction: cluster summary reports eight cases, but the 27-row occurrence ledger contains no C08 entries. Three source-row IDs recovered (`multilexnorm2026_1953`, `multilexnorm2026_1979`, `dc_inside_2024`); five remain unidentified. Stale “remaining cases in paired ledger” wording was corrected.
- Exact-head GitHub Actions run `41346666445`: browser regression/build PASS; Python regression/data integrity PASS; 1,369 browser tests, 0 failures; NIKL metadata-only inventory SKIPPED. Extractor run `41346594433`: PASS. Multi-engine comparison run `41344981358` completed PASS; artifact `13099523369` inspected. ByT5 and Charsiu jobs were SKIPPED.
- Current main workflow `41334227038` has a Python collection failure because `scripts.benchmark_ugtphon_ko_surface` is absent from main; the inherited PR #416 branch contains it and passes Python regression/data integrity.
- No local shell/npm/pytest/build commands were executed; all test evidence is from GitHub Actions. No original g2pK implementation file was changed.

**Disposition:** research prototype. Independent linguistic adjudication, source context, item-level rights, five missing C08 occurrence IDs, and Ukrainian target review remain open. Not release-ready.


## Supplementary paired benchmark — SIGMORPHON 2021 Korean lexical test (run 41344981358)

The completed multi-engine diagnostic artifact `13099523369` was downloaded and inspected. It pins g2pK 0.9.4 and compares the native Kozak Kim path with the same 998 paired word-level inputs:

| Metric | Kozak Kim (clippyfirst_native) | Original g2pK 0.9.4 | Paired delta (g2pK − Kozak) |
|---|---:|---:|---:|
| Exact match | 358/998 = 35.8717% | 353/998 = 35.3707% | −0.5010 pp |
| CER | 14.6225% | 14.8106% | +0.1881 pp |

Paired row-cluster bootstrap (1,000 replicates): exact-match delta 95% interval `[-1.0020, -0.1002]` pp; CER delta interval `[+0.0250, +0.3859]` pp. Pairwise audit: 5 native-only exact cases, 0 g2pK-only exact cases, 353 both exact, 640 both non-exact, and 1 native abstention while g2pK returned a non-exact output. This is a **small diagnostic advantage**, not proof of universal superiority.

**Mandatory limitations:** SIGMORPHON is a lexical word-level set, not a sentence-context or normative NIKL set; IPA conventions differ from the reference; g2pK outputs pass through the project's shared segment renderer, which may bias comparison; the benchmark does not score Ukrainian output. The bootstrap intervals are diagnostic uncertainty intervals, not a substitute for independent gold adjudication or a preregistered statistical claim. ByT5 and CharsiuG2P inference jobs were SKIPPED. g2pK source/version remained unchanged.


## C01–C07 source-context restoration — 2026-11-01

The earlier blocker “source utterance context unavailable” is superseded. All **39 unique source-row IDs** across the seven six-item pilot packets were matched to the official `naver-ai/UGTPHON/ko/test.json` (275-row Korean test split); every target token is present in its included raw sentence. UGTPHON's `ko/LICENSE` explicitly states Apache-2.0 for the Korean subset. Packets now include raw sentence context only, plus source-row provenance and attribution to UGTPHON, KoMultiText, and MultiLexNorm++; they exclude canonical text, phoneme annotations, IPA-Dict data, system outputs, and reference IPA.

**Updated status:** packet preparation is `DONE_VERIFIED`; the packets are `READY_FOR_INDEPENDENT_REVIEW_PILOT`. Independent reviewer assignment and first-pass submissions remain `TODO`. These six-item-per-cluster samples are not full cluster censuses. Preserve the Apache-2.0 notice and attribution; no raw gated MultiLexNorm++ files are redistributed. Upstream provenance/terms remain a documented limitation for broader reuse.


### Independent morphology cross-check and training-data readiness

The pinned Kiwi/MeCab-Ko cross-check (run 41353171166; artifacts 13102576042, 13101838045, consensus 13102406365) adds a useful constraint:
- Both analyzers find the target boundary before dependent noun 수 in 무고일수도있다는, though their internal segmentation of 일 differs.
- Kiwi parses 했을시 as 하/VV + 었/EP + 을/ETM + 시/NNB; MeCab-Ko parses 했/VV+EP + 을시/EC. The NIKL Q&A supports the dependent-noun analysis, but independent analyzer consensus is absent.
- Kiwi segments 유사성 as 유사/NNG + 성/XSN; MeCab-Ko treats it as one NNG. This does not establish the lexical pronunciation, and the form remains unresolved.

Do not resolve analyzer disagreement by majority vote. These outputs are diagnostic morphology hypotheses, not gold segmentation or IPA.

A separate training-readiness audit (partial workflow artifact 13101748305) reports 644 unique lexical rows, zero additions explicitly marked as independently adjudicated IPA gold, and 24 frozen holdout cases without IPA gold; no holdout overlap was found. Supervised IPA training is therefore NOT READY. No training was run.
