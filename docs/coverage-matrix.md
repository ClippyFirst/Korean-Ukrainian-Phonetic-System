## 2026-11-02 — Kozak Kim cross-runtime evidence and parity continuation

**Scope:** Kozak Kim only. Original g2pK code and vendor files remain unchanged. No new general phonological rule was added.

**Repository state:** branch `fix/kozak-kim-broad-version-metadata-2026-11-02`; Draft PR #421 stacked on Draft PR #420; code/test head `b4ace0eba2d1573cd78b1e6a971de5556a0bcb3c`. Starting point was PR #420 head `2db86dd97eab99fc18d5fa30c82febb76d5a4068`. No merge, release, deployment, or branch deletion.

| Work item | Status | Evidence / acceptance |
|---|---|---|
| Browser Broad IPA v2 metadata contract | DONE_VERIFIED | Browser report now keeps numeric `broad_candidate_benchmark_version: 2`; regression test covers actual `evaluateRows()` output. |
| IPA adjudication overlay in Browser runtime | DONE_VERIFIED | App and benchmark merge the existing IPA-adjudication CSV with appended metadata column preserved. `삶의` retains source-backed Hangul `살믜` / `살메`, but IPA and Ukrainian output are withheld. |
| Native R013 false abstention | DONE_VERIFIED | Exact attached `-ㄹ게` / attested `-ㄹ게요` completion gate is shared by rule and abstention logic. Internal substrings `올게이` / `할게이` remain non-R013 controls and return provisional, non-diagnostic-only project IPA. |
| Broad-profile Browser surface coda rendering | DONE_VERIFIED | Shared research profile renders representative final coda (`있다` → `읻따`); default Browser legacy profile remains `있따`. |
| Python regression/data integrity | DONE_VERIFIED | System verification run 41447654924 PASS (`python -m pytest -q`). |
| Browser regression/build | DONE_VERIFIED | System verification run 41447654924 PASS; 1,382 / 1,382 tests; `npm run build`; generated-page checks. |
| Browser/Native occurrence-level IPA parity | PARTIAL | Multi-engine run 41447654927 completed its Browser comparison and parity-audit steps successfully; exact artifact is still being assembled during the SIGMORPHON phase. Do not claim a numerical parity rate until the artifact is read. |
| Full Browser surface parity | PARTIAL | Direct Browser report 13143156104: 2,698 scored / 2,703 eligible. Preliminary comparison to the Native ledger showed 2,693 equal surfaces, four differences on morphology-abstained cases, and six missing Browser surface reconstructions. Final occurrence audit artifact is authoritative. |
| Broad v2 target thresholds | PARTIAL / NOT MET | Browser direct UGTPHON: Broad exact 86.2861%, Broad CER 2.2083%, five unresolved, zero engine errors; target 90%+ exact / CER ≤2% not met. |
| Original g2pK baseline | DONE_VERIFIED | Paired Native/g2pK diagnostic run 41447654997 PASS; no g2pK source/vendor files changed. |
| Independent IPA gold | BLOCKED | Frozen 24-item holdout and reviewer A/B packets exist; two qualified independent reviewers and adjudication are still required. |
| NIKL item-level reuse rights | BLOCKED | Official metadata inventory was SKIPPED; item-level KOGL clearance remains unverified. |
| Ukrainian target adaptation review | BLOCKED | Requires independent Ukrainian phonetic/orthographic expert review. |
| CharsiuG2P / ByT5 inference | DEFERRED | Both optional inference jobs were SKIPPED by workflow policy; no inference result is claimed. |

### Comparative results — do not mix profiles

**Native strict IPA vs original g2pK**, 2,698 paired UGTPHON occurrences:
- Kozak Native: 53.0393% strict exact; 9.0657% CER.
- g2pK: 53.1134% strict exact; 9.2304% CER.
- Kozak has lower CER; g2pK has a 0.0741 percentage-point strict-exact point edge.

**Browser legacy-default vs original g2pK**, 2,698 paired occurrences:
- Exact match tied at 53.4469%.
- Browser CER 8.0728% vs g2pK 8.2072%; paired sentence-cluster 95% CI for Browser-minus-g2pK CER delta: [−0.2246, −0.0531] percentage points.
- This is a separate legacy-default diagnostic, not the shared Broad profile.

**Browser shared Broad v2 direct UGTPHON**:
- 2,698 / 2,703 scored; 86.2861% Broad exact; 2.2083% Broad CER; five unresolved; zero engine errors.
- These corpus-relative metrics are not normative IPA accuracy. The original g2pK adapter uses the project's shared segment renderer, so it is not an independent IPA encoder.

### Exact CI commands and outcomes

- `npm install --no-audit --no-fund` — PASS.
- `npm test` → `node --experimental-strip-types --test tests/*.test.mjs` — PASS, 1,382 tests.
- `npm run build` → dictionary preparation + Vite production build — PASS.
- `test -f dist/index.html && test -f dist/system.html` — PASS.
- `python -m pip install -e ".[dev,all]"` — PASS.
- `python -m pytest -q` — PASS.
- Browser G2P integration run 41447654972 — PASS.
- Paired Native/g2pK run 41447654997 — PASS.
- External UGTPHON diagnostic run 41447654983 — PASS.
- Kiwi + MeCab-Ko morphology consensus run 41447654952 — PASS.
- Exhaustive test-case register extraction run 41447654941 — PASS; extracted classification queue still requires manual review.
- Research morphology adapter smoke run 41447655002 — PASS.
- Optional g2pK integration run 41447654921 — PASS; baseline code/vendor unchanged.
- Multi-engine run 41447654927: multi-engine comparison, Browser same-occurrence comparison, and Native/Browser parity-audit steps PASS; SIGMORPHON benchmark and artifact upload still running at this snapshot.
- NIKL metadata-only inventory — SKIPPED.
- CharsiuG2P and ByT5 inference — SKIPPED.
- Local pytest/npm were not run in this session; verification was performed by GitHub Actions.

**Readiness:** partial research prototype, not release-ready and not research-certified. The next evidence gates are the final multi-engine/SIGMORPHON artifact, independent IPA adjudication, item-level source-rights review, and independent Ukrainian target review.


# Initial specification → final implementation coverage

Audit date: 2026-10-02

| Layer / requirement | Final state | Evidence in repository |
|---|---|---|
| KOR_ORTH → KOR_PHON → KOR_PHON_RULES → KOR_IPA → UA target → UA orthography | Implemented as separate API layers | `pipeline.py`, `phonology.py`, `rules.py`, `ipa.py`, `ukrainian_adapter.py`, `orthography.py` |
| Modern Hangul Unicode model | Implemented | 19 L × 21 V × 28 T positions; 11,172 generated blocks; NFD metadata |
| 67 modern Jamo records | Implemented | `data/korean/jamo.csv` + schema |
| 11 complex codas | Implemented | `COMPLEX_LIAISON`, validation cases |
| Korean segmental inventory | Implemented with explicit analysis-dependent vowels | `phonemes.csv`, `analyses.csv` |
| Contextual pronunciation rules | Implemented/conditional | R001–R015; `rule_scope.csv` |
| §§9–30 computational coverage | Explicitly classified | `rule_scope.csv`; §§24–30 conditional where lexical/morphological information is required |
| Rule ordering | Versioned and machine-readable | `rule_ordering.csv` |
| Alternative analyses / uncertainty | Implemented | `analyses.csv`, rule status/confidence, broad IPA only |
| Narrow IPA | Explicitly unavailable | `ipa.py` rejects `level="narrow"` |
| Feature-based Korean→Ukrainian ranking | Implemented | `correspondence.py` |
| UPI target source of truth | Implemented; unresolved if unavailable | adapter pins UPI 0.8.0 and rejects incompatible versions; lexical Ukrainian targets are reference-only |
| UPI mapping penalties and selection gate | Integrated; fail-closed gate tested | adapter loads `transliteration_mapping.csv`, ranking exposes component costs, and selection requires an explicit mapping ID plus renderable grapheme |
| Ukrainian sequence-level orthography | Delegated, not duplicated | UPI remains authoritative; this repo exposes segmentwise candidates and does not select unmapped candidates or fall back to Hangul-keyed lexical targets |
| Validation corpus | Rule-demonstration corpus implemented | `data/validation/cases.csv` |
| Comparative Korean IPA engine benchmark | Diagnostic benchmark executed on pinned UGTPHON (275 rows; 2,703 eligible token occurrences); native vs g2pk paired delta +0.79 percentage points exact match and −0.38 points CER, with paired row-cluster intervals excluding zero; KoG2P, hangul_to_ipa, eSpeak NG and phonemize also run. This is not NIKL normative gold and does not assess Ukrainian adaptation. | [Benchmark protocol/results](MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md), [successful run 40069800681](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40069800681), PR #280 |
| Lexical/corpus attestation | Not claimed | No corpus dataset is fabricated |
| Evidence/provenance | Implemented for current claims | `sources.csv`, `evidence.csv`, rule source IDs |
| Generated-artifact reproducibility | Implemented | exact `syllables.csv` vs generator test |
| Schema validation | Implemented | JSON Schema tests for rule, Jamo, validation and rule scope data |
| Negative/adversarial testing | Implemented and extended | mixed-script, unknown boundary, unlicensed insertion/fortition, unsupported IPA, complex-coda chains |
| Public Python API | Implemented | exported functions in `__init__.py` |
| User-facing structured result | Implemented | `transliterate_korean()` returns layer outputs, traces, candidates and heuristic selection status |
| CI/reproducibility | Repository-configured; exact final commit must be verified by fresh CI before release claim | `docs/reproducibility.md` |
| Academic/publication-final status | Not claimed | Independent linguistic review, corpus validation, acoustic narrow IPA and gold-output evaluation remain external empirical work |

## Set distinction

The final repository deliberately distinguishes:

1. **Combinatorial set** — 11,172 modern Hangul graphic syllables.
2. **Phonotactically possible set** — constrained by Korean syllable/rule structure.
3. **Morphologically licensed set** — requires explicit context metadata for rules such as §§24–30.
4. **Lexically attested set** — not inferred from combinatorics.
5. **Corpus-observed set** — requires an external pronunciation corpus.

The repository does not use the first set as a substitute for the last two.

## Readiness interpretation

“Full readiness” here means the computational architecture, machine-readable contracts, conditional rule model, provenance, validation and reproducibility layers are closed to the extent supported by the available evidence. It does **not** mean that missing empirical datasets have been invented or that a computational heuristic has been promoted to a linguistic fact.


## IPA→Ukrainian public adapter failure contract

**Status:** implemented; exact-head CI pending at the time of this matrix update.

Unavailable output uses `null`, not a successful-looking empty string. Empty IPA, delimiter-only IPA, unmapped IPA, source/IPA alignment mismatch, and provisional mappings are covered by regression cases. Partial target strings are withheld if a segment cannot be rendered or if a provisional correspondence prevents accepted output.


## Final exact-head status — 2026-10-25

The current branch head `ab9a0ad7ea96e73c7fc76a8a97a3bf5f9ff16d38` passed system verification, browser regression/build, Python regression/data integrity, clean wheel installation, Python 3.11/3.12/3.13, browser G2P, optional g2pK, paired native/g2pK, pinned UGTPHON, multi-engine benchmark, morphology adapter smoke and generated research artifacts. The official live NIKL inventory job was skipped, not passed. This matrix records software readiness only; the repository remains a partial research prototype pending independent linguistic/target gold and original holdout provenance.


## Latest Kozak Kim continuation — 2026-11-02

**Verified implementation/test head:** `fb5e1686bd86fd012d63cc92ad0261efe1a38113` (descendant of current `main` `7bbbd7e7ce888a9c995bb70959e17858263c07a8`). The current continuation is evidence/documentation-only; no new production phonology rule is accepted.

- Exact-head system verification: [41420395798](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41420395798) PASS (Python/data integrity, browser 1,374/1,374, production build and generated-page checks). NIKL metadata-only inventory SKIPPED.
- Paired browser diagnostic: 2,699 shared; exact match tied 53.4272%; Kozak CER 8.0794% vs original g2pK 8.2138%; 95% sentence-cluster CI for the CER delta [−0.2246, −0.0531] pp.
- Paired native diagnostic: 2,698 shared; Kozak exact 53.0393% / CER 9.0744%; g2pK exact 53.1134% / CER 9.2304%; five native abstentions, zero engine errors.
- Multi-engine diagnostic: UGTPHON native 2,698 scored (exact 53.0393%, CER 9.0744%, PER 9.5378%) vs g2pK 2,703 (exact 53.0892%, CER 9.2285%, PER 9.6472%); SIGMORPHON native 998 scored (exact 35.8717%, CER 14.6100%, PER 16.1721%) vs g2pK 999 (exact 35.3353%, CER 14.8222%, PER 16.3126%). Denominators differ. These datasets are diagnostic, not normative IPA gold; g2pK output uses the shared project IPA renderer.
- Five UGTPHON native abstentions remain evidence-limited: `칡칡이`, `쫒아내면`, `많앗구나유유유`, `삶의`, `무서웟어`. `삶의` already has NIKL MCFAQ 5716 Hangul variants [살믜]/[살메] and provisional project IPA variants `sal.mi`/`sal.me`; independent IPA adjudication is still required. Do not promote the corpus IPA annotation to gold.
- Added a fail-closed regression for the four R002/R003 native abstentions; the existing `삶의` test continues to protect its two NIKL surface variants and IPA-adjudication gate. Push/PR system verification and extraction pass on `4225cea7`; browser tests 1,374/1,374.
- Readiness remains **research prototype**, not research-certified or release-ready. Independent Korean IPA review, C08/C09/C10 adjudication, NIKL item-level rights and Ukrainian target review remain open.


## Kozak Kim continuation coverage update — 2026-11-04

| Coverage area | Current status | Evidence / remaining acceptance |
|---|---|---|
| Native Kozak Kim vs original g2pK 0.9.4, pinned UGTPHON | DONE_VERIFIED as diagnostic only | Run 41726881384, artifact 13276390247; paired n=2,698. Native 1,431/2,698 exact (53.0393%) / CER 8.9920%; g2pK 1,433/2,698 exact (53.1134%) / CER 9.2304%. Paired exact delta +0.0741 pp (CI crosses zero); paired CER delta +0.2384 pp (g2pK higher; CI excludes zero). Raw g2pK full-coverage score is 1,435/2,703 exact (53.0892%) / CER 9.2285%; not paired. Not normative IPA gold. |
| Mismatch-fragment export and checked-in review queue | PARTIAL | Exporter produced 36 unmapped-broad occurrences / 55 fragments with 0 missing context lookups, but `cmp` against `research/kozak-kim-unmapped-mismatch-review-queue-2026-11-03.csv` failed at byte 31,117 / line 14. Regenerate/review changed rows and rerun final golden check. |
| Same-occurrence Browser Kozak Kim and Native/Browser parity in multi-engine run | TODO / BLOCKED_BY_UPSTREAM_GATE | Skipped after queue drift failure in run 41726881384; rerun on same exact head after reconciliation. |
| SIGMORPHON multi-engine portfolio on latest head | TODO / BLOCKED_BY_UPSTREAM_GATE | Skipped after queue drift failure; no current-head score is claimed. |
| Original g2pK baseline isolation | DONE_VERIFIED | Original g2pK 0.9.4 and vendored browser source unchanged; Kozak research lexical overlays excluded from the adapter. |
| Independent Korean IPA and Ukrainian target acceptance | BLOCKED | Independent qualified reviewers/adjudication and separate Ukrainian target review/gold are absent. |

The benchmark comparison is differential corpus evidence only. It does not establish universal Kozak Kim superiority, normative IPA accuracy, or Ukrainian output quality.


## 2026-11-04 — exact artifact queue reconciliation

| Coverage area | Status | Evidence / remaining acceptance |
|---|---|---|
| Generated vs checked-in unmapped-broad queue | DONE_VERIFIED as artifact reconciliation | Run 41794874090 / artifact 13305816579 generated 36 occurrences / 55 fragments / 0 missing context lookups. Commit c0cbe3740e734c87d3202cca496b83d9603ea218 refreshes the checked-in file from 43 to 36 rows; all 36 retained rows match the generated artifact byte-for-byte by per-row hash. |
| Seven previously queued occurrences | DONE_VERIFIED as disposition reconciliation only | 1406, 1527, 2001, 2010, 2533 are broad-exact; 868 retains mapped C06; 2562 retains mapped C11. This does not adjudicate IPA truth. |
| Same-occurrence Browser / Native parity | TODO / IN_PROGRESS | Run 41797143756 triggered on refreshed queue commit; inspect final job statuses and artifact before marking complete. |
| SIGMORPHON portfolio on refreshed queue head | TODO / IN_PROGRESS | Same run 41797143756; no current-head score claimed yet. |
| Independent Korean IPA / Ukrainian target acceptance | BLOCKED | Qualified external review and adjudication still absent; corpus-relative labels cannot substitute. |

No runtime code or g2pK baseline code changed in this queue reconciliation. Research-prototype disposition unchanged.

## 2026-11-04 — benchmark and phrase-boundary coverage update

| Area | Status | Evidence / remaining acceptance |
|---|---|---|
| Refreshed UGTPHON queue and multi-engine gate | DONE_VERIFIED | Run 41797276965 / artifact 13306613436; 36 queue rows, 55 fragments, all context lookups found; exporter cmp PASS. |
| Native/Browser parity | DONE_VERIFIED | Same run: 2,703/2,703 surface parity; 2,698/2,698 IPA parity; no differences. |
| SIGMORPHON lexical comparison | DONE_VERIFIED as diagnostic | Paired n=998; Native 358 exact / 14.5598% CER vs g2pK 353 exact / 14.8106% CER; exact McNemar p=0.0625. |
| Blind IPA holdout | PARTIAL / BLOCKED | 24 cases packaged for reviewers A/B; no predictions or gold included; independent annotations pending. |
| R013 exact phrase boundaries and same-eojeol licenses in phrase mode | DONE_VERIFIED for software behavior | Python phrase mode now retains exact same-eojeol R013 licenses as well as exact adjacent-eojeol licenses; test `test_r013_same_eojeol_license_is_retained_when_phrase_mode_is_enabled`. System Verify 41849672939 PASS on head `02a72da6534b110d63810c497a6b7fba9b790a3e`; Python 652 tests, Browser 1,396/1,396, build/generated pages PASS. Compact and punctuation-separated phrase controls remain negative. Prosodic pause and productive morphology remain outside the text-only contract. |

The benchmark run predates the phrase-boundary code extension. Do not reuse its PASS as evidence for that new code.

## 2026-11-04 — R013 connected-phrase follow-up and current-head evidence

R013 / NIKL §27 exact connected-phrase licenses added for `줄 것` and `많을 거`. Python phrase mode binds each license to the exact adjacent eojeol pair and syllable-pair index; Browser phrase assimilation uses the same exact pair map. Positive cases: `해 줄 것 같다`, `많을 거 같이`. Compact no-space forms remain unlicensed; Browser additionally rejects punctuation-separated pairs. No hidden spaces are reconstructed.

Phrase mode assumes connected speech. NIKL §27 says a pause blocks fortition; the text API cannot infer prosodic pauses. This is rule-derived standard-pronunciation support, not acoustic IPA attestation. Primary evidence: NIKL Standard Pronunciation Rule 27 and official Q&A 310899 for colloquial dependent noun `거`.

Exact-head System Verify [41806844422] PASS: Python regression/data integrity; Browser 1,395/1,395; Vite build. Browser G2P [41806844476], paired Native/g2pK [41806844324], UGTPHON [41806844305], morphology consensus [41806844379], extraction [41806844316], and morphology smoke [41806844503] PASS. Multi-engine run [41806844311] was still in its comparison step at this checkpoint; no pass is claimed. Last completed full comparison: [41797276965], artifact [13306613436].

Comparative diagnostic (run 41797276965): UGTPHON paired n=2,698: Kozak Kim 1,431 exact / 8.9920% CER vs original g2pK 1,433 exact / 9.2304% CER; exact difference inconclusive (95% CI −0.0824 to +0.2840 pp), Kozak Kim CER lower by 0.2384 pp. SIGMORPHON paired n=998: Kozak Kim 358 exact / 14.5598% CER vs g2pK 353 exact / 14.8106% CER; five net Kozak-only exact wins, McNemar p=0.0625. Corpus IPA labels are not normative IPA gold; neither metric measures Ukrainian target quality.

Main is `607dccb46`, advanced through merged PRs #428/#430/#431. The benchmark module restored by #428 is byte-identical on main and this branch. PR #426 remains stacked on #425; no blind rebase. The corrected 36-row queue is already in #426 at `682c3a5`, byte-identical to its generated artifact. #427/#429 closed as superseded/no-op; branches retained.

R013 phrase implementation/tests: DONE_VERIFIED. IPA/prosody adjudication: PARTIAL/BLOCKED. Overall readiness: research prototype only. Independent Korean IPA reviewers, Ukrainian target review, NIKL item-level rights, C12 primary evidence and historical 239-case adjudication remain blocked.


## 2026-11-04 final continuation status — Kozak Kim only

**Production-code head:** a6ac71c1f3b2c543544e8bf4331f7a6555374422. No Kozak Kim production source or benchmark implementation changed after the earlier verified code head 9803eef502ea655319954520b984fe33049ffe8e; subsequent changes are source-register, evidence, documentation and regression-test updates.

### Exact-head checks before the final C12 data-distribution assertion
- System Verify 41813316574 and 41813324446: PASS — Browser regression suite 1,395/1,395, Vite production build/generated-page checks, Python regression and data-integrity suite.
- Browser G2P 41813324361, paired Native/g2pK 41813324279, external UGTPHON 41813324358, morphology consensus 41813324282, morphology smoke 41813324356, and exhaustive test-case extraction 41813324414: PASS.
- Latest completed multi-engine comparison 41809183760: PASS, artifact 13312557366, SHA-256 c33601cf32fbe70aa4f199936eeacb749f4f305dabd574f44dc9d3da02b89315.
- The C12 occurrence-distribution assertion is added in this final documentation/test commit and must be included in the final System Verify rerun.
- NIKL metadata-only inventory, CharsiuG2P and ByT5 inference remain SKIPPED, not passed.

### Paired diagnostic against unchanged original g2pK 0.9.4
- UGTPHON paired set (n=2,698): Kozak Kim 1,431 exact (53.0393%), CER 8.9920%; g2pK 1,433 exact (53.1134%), paired CER 9.2304%. Exact-match delta is only 0.0741 pp in g2pK's favour and its paired 95% CI crosses zero (−0.0824 to +0.2840 pp). Kozak Kim CER is lower by 0.2384 pp (paired CI for g2pK-minus-Kozak CER: +0.1392 to +0.3464 pp).
- SIGMORPHON paired set (n=998): Kozak Kim 358 exact (35.8717%), CER 14.5598%; g2pK 353 exact (35.3707%), paired CER 14.8106%. Five net Kozak-only exact wins yield exact two-sided McNemar p=0.0625: promising, not decisive at 0.05. Kozak Kim CER is lower by 0.2508 pp (paired bootstrap CI +0.0986 to +0.4444 pp). The full g2pK scored-set CER is 14.8222% on 999 cases; do not confuse it with the 998-case paired CER.
- These corpora are diagnostic annotations, not independently adjudicated Korean IPA gold. g2pK's IPA is rendered through the shared project adapter; it is not an independent IPA encoder. No universal superiority claim follows.

### C12 — evidence refinement, no production rewrite
The 37 mismatch rows represent 29 unique token strings: 16 kxɯ-only, 12 kçi-only, 8 kçj-only, and one overlapping kxɯ+kçi row (키큰남). Source-row namespaces: 12 multilexnorm2026, 25 dc_inside. The fragment CSV contains text/IPA fields but no audio or speaker metadata.

Schweizer, Ahn & Kwon (2026), JIPA 56, e6, DOI 10.1017/S002510032510087X, CC-BY-4.0, is registered as contextual primary acoustic evidence. It measures burst duration (release to voicing onset; release+aspiration if any), closure duration, voicing and spectral measures. Study 1 uses following /a/; Study 2 uses /i,u,a,ʌ/. It has no /ɯ/ or /j/ target context and reports no [kx]/[kç] transcription. It cannot adjudicate the C12 tokens. Status remains PARTIAL for general acoustic evidence and BLOCKED for exact [kx]/[kç] interpretation, source-audio/annotation crosswalk and two independent Korean IPA reviews. No C12 production rule, lexical entry or narrow IPA profile was added.

### Scope and readiness
- Kozak Kim is the only engine being improved. Original g2pK 0.9.4 remains an unmodified comparison baseline; all nine vendored g2pK files are byte-identical to current main and the dependency remains pinned.
- The 36-row unmapped-Broad queue (55 fragments; 36/36 context lookups found) is not a resolution of the historical 239-case mismatch population.
- Independent Korean IPA review, Ukrainian target-layer review, item-level NIKL reuse verification, C12 audio adjudication, and names/loans/Hanja/regional-style coverage remain open.
- Readiness: research prototype; not research-certified and not release-ready.


## 2026-11-04 — final verification refresh and methodology review

**Exact verified pre-documentation head:** `8615aa8eb4195c23bc7ff0a3eac64ae122af9b46` (PR #426, still draft/open; base PR #425). The following workflows completed on this exact head:

- System Verify [41815472574](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472574): PASS. Python regression/data-integrity job PASS; Browser regression/build PASS, **1,395/1,395 tests, 0 failures**. Vite production build and generated-page checks passed. The Python pytest output reached 100% with no failures; pytest did emit its intentional diagnostic-only Python-vs-pinned-JS comparison warning (18/20 equal, two known port divergences where Python matches the project practical adapter). This warning is not a suite failure.
- Browser G2P [41815472566](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472566): PASS (25/25 tests).
- Paired Native/g2pK [41815473135](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815473135): PASS. UGTPHON shared scored set n=2,698: Kozak Kim 1,431 exact (53.0393%), CER 8.9920%; original g2pK 1,433 exact (53.1134%), CER 9.2304%. Exact-match difference remains inconclusive; Kozak CER is lower by 0.2384 pp. g2pK's full 2,703-case denominator is not the paired denominator.
- External UGTPHON [41815472667](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472667), morphology consensus [41815472569](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472569), morphology smoke [41815472553](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472553), and exhaustive test-case extraction [41815472973](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472973): PASS. The morphology-consensus diagnostic did not improve exact matches and had slightly higher CER than strict (0.090093 vs 0.089920); it remains diagnostic-only, not a production replacement.
- Multi-engine benchmark [41815472970](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472970): PASS; all 17 workflow steps succeeded. Artifact [13314914671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472970/artifacts/13314914671), SHA-256 `b33d8838877ef2bf89f959e920d1d4c82c831a108248fa002dbd773316e27a14`. Its multi-engine runner reports 71 Python checks and 25 Node tests passing. This is diagnostic comparison, not normative IPA adjudication.
- Official NIKL metadata-only inventory: SKIPPED. CharsiuG2P inference, ByT5 inference and neural pairing: SKIPPED. None is reported as passed.
- Non-fatal environment/build notices: Node 20 deprecation notices from upstream Actions, Node `punycode`/`url.parse` deprecations, and Vite's large-chunk warning. No failed check is attributed to these notices.

### C12 exact-data verification

The final regression assertion now validates all 37 C12 occurrence rows, 29 unique token strings, the exact pattern partition (16 `kxɯ` only, 12 `kçi` only, 8 `kçj` only, one overlapping `kxɯ+kçi` row), source namespaces (12 `multilexnorm2026`, 25 `dc_inside`), and the absence of audio/speaker columns in the fragment CSV. CI passed on this assertion. This verifies the mismatch dataset's structure, not the acoustic interpretation of the source IPA.

### Methodology review and decisions

- **Superpowers:** retain plan-first execution, one vertical slice at a time, TDD red→green, systematic diagnosis for failed checks, and a final verification gate.
- **Matt Pocock Skills:** retain public-behaviour test seams, independent expected values, one change per slice, and separate standards/spec review axes.
- **Ponytail:** retain the smallest justified change, reuse of existing Python/Browser rule maps and repository contracts, and review of surrounding callers rather than diff-only inspection.
- **Unlazy:** apply explicit acceptance gates, task decomposition, evidence fingerprints/artifact references, and re-verification of already completed checks. The repository already has canonical master plan, acceptance-gates, coverage matrix and task ledger; therefore no duplicate `GATES.md`, external skill dependency, hook, or imported script was added. Unlazy's executable checker requires local shell approval and is not available through this GitHub-only execution path.
- **Ruling:** keep the project's existing phonetic-engineering skill and canonical execution records as the source of truth; borrow compatible methods, do not wholesale vendor four agent frameworks or duplicate their overlapping ledgers. This avoids maintenance burden and preserves the user's existing architecture.

### Current task ledger

| Work item | Status | Evidence / acceptance still required |
|---|---|---|
| Current Python regression/data integrity, Browser suite/build, Browser G2P and diagnostic workflows | DONE_VERIFIED at exact head above | Re-run after this documentation-only refresh; do not transfer this exact-head claim to later code changes. |
| C12 row-count, unique-token, pattern and source-namespace integrity | DONE_VERIFIED | Regression assertion passed in System Verify. |
| C12 exact [kx]/[kç] acoustic interpretation | BLOCKED | Obtain source recordings, speaker/dialect/prosodic metadata and original annotation protocol; then two independent Korean IPA reviews. No production rewrite. |
| Independent Korean IPA blind packet (24 cases) | BLOCKED | Two qualified reviewers annotate independently, reconcile disagreements, and provide provenance. |
| Ukrainian target layer | BLOCKED | Independent Ukrainian phonetic/orthographic review and reader validation; corpus IPA metrics cannot substitute. |
| NIKL item-level reuse/KOGL permissions | BLOCKED | Item-specific source and redistribution/reviewer-sharing rights evidence; official metadata crawl currently returns 403. |
| Historical 239-case mismatch population | PARTIAL / EVIDENCE-LIMITED | Reconstruct exact source/context memberships and adjudicate every retained occurrence; the 36-row unmapped-Broad queue is not a substitute. |
| C01–C11 optional variants and profile conventions | PARTIAL / REVIEW-PENDING | Review token contexts, dialect/prosody and source transcription conventions; two independent IPA reviewers before promoting any narrow profile. |
| Names, loans, Hanja, regional/style coverage | TODO / PARTIAL | Evidence-backed scoped datasets and explicit uncertainty/abstention acceptance; Hanja and RR remain separate research modes. |
| Neural teacher evaluation | DEFERRED / SKIPPED | Only revisit with reproducible licensed model weights, independent held-out IPA gold and a demonstrated advantage; no production integration now. |
| Original g2pK 0.9.4 baseline | DONE_VERIFIED as preserved dependency | Keep pinned and unmodified; comparison output remains diagnostic and is not used as a source of production rules. |

**Readiness remains:** research prototype; software checks for the exact head are green, but research certification and release acceptance are not met.


## 2026-11-04 — R013 occurrence-scope defect found and corrected

**Code/test head:** `648949a40638a7b0d18b8c026b15de7e24a1235f`.

### Root cause and TDD evidence

A focused re-review of the R013 attached ending `-ㄹ게` found that Python accumulated the licensed syllable pair in a sentence-global `attested_l_ge_pairs` set. If one complete `-ㄹ게` ending licensed `할>게`, another identical pair inside a longer, unrelated eojeol could inherit that permission.

The minimal counterexample is `할게 할게다`:
- RED commit `34fffa593bd10a16a2d963b252cef92caa8ed7d3`, System Verify [41841891363](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41841891363): the new Python regression failed exactly as predicted: actual `할께 할께다`, expected `할께 할게다`. Browser regression/build passed on the same red commit.
- GREEN commit `3358b81492022da11154b375121bbd16e1912c13`: replaced the global pair set with an occurrence-indexed `attested_l_ge_contexts` map. R013 now authorizes the exact eligible position; unrelated same-pair positions cannot inherit the license.
- Browser parity regression commit `648949a40638a7b0d18b8c026b15de7e24a1235f`: added the same counterexample to the Browser morphology guard suite. Browser already checked the exact eojeol and correctly returns `할께 할게다`.

### Exact-head verification

- System Verify [41842288415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288415): PASS on the code/test head; Python regression/data integrity PASS; Browser **1,396/1,396**, 0 failures; production build/generated-page checks PASS. The new Browser counterexample is test 1,148 and passed.
- Browser G2P [41842288550](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288550): PASS.
- Paired Native/g2pK [41842288377](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288377), external UGTPHON [41842288200](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288200), morphology consensus [41842288389](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288389), research morphology smoke [41842288230](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288230), and test-case extraction [41842288344](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288344): PASS.
- Multi-engine benchmark [41842288431](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288431): IN PROGRESS at this ledger update. Its 12 setup/validation/adapter/holdout steps have passed; the multi-engine comparison is running, and queue export, same-occurrence Browser, runtime parity, SIGMORPHON and artifact upload have not yet been verified on this head. Do not infer a final result.
- Official NIKL metadata-only inventory: SKIPPED, not passed. Neural inference: SKIPPED.
- All nine vendored `src/vendor/g2pk/` blobs are SHA-identical to current `main`; no vendored g2pK file changed.

### Review correction

The earlier self-review entry stating that no Important defect was identified is superseded for this area: the earlier review did not include this sentence-level repeated-pair counterexample. The focused re-review found one Important correctness defect, reproduced it with a red test, fixed it, and verified both runtimes. This remains an author self-review, not independent human review; PR #426 has no submitted reviews or inline review threads.

### Updated task disposition

| Task | Status | Evidence / remaining acceptance |
|---|---|---|
| R013 `-ㄹ게` license must remain inside the exact eligible occurrence | DONE_VERIFIED | Red failure 41841891363; occurrence-indexed fix 3358b814; current head `02a72da6534b110d63810c497a6b7fba9b790a3e`, System Verify 41849672939 PASS (Python 652, Browser 1,396/1,396, production build/generated pages). Independent Korean morphology/IPA review remains open. |
| R013 exact phrase pair licenses `줄 것` / `많을 거` plus same-eojeol retention in phrase mode | DONE_VERIFIED for software behavior | Exact pair/index matching, punctuation/compact negative controls, and same-eojeol phrase-mode regression pass System Verify 41849672939 on `02a72da6534b110d63810c497a6b7fba9b790a3e`. Linguistic pause/cohesion remains conditional because the text API has no pause annotation. |
| Multi-engine benchmark on current Kozak Kim code | PARTIAL / IN_PROGRESS | Latest completed run 41843472619, artifact 13330749031, SHA-256 4c0b22df3e964b6483c098b066497dbe5518ed13e6a55af919e41a1d8cbb357d; current exact-head rerun 41849673041 remains in step 13 (multi-engine comparison). ByT5 and CharsiuG2P inference SKIPPED. |
| Independent Korean IPA / Ukrainian target review | BLOCKED | Human reviewers and adjudication still absent. |
| C12 acoustic interpretation and NIKL item-level rights | BLOCKED | Source audio/metadata and item-specific rights evidence remain unavailable. |

No g2pK source, dependency pin, or vendor blob was modified. PR #426 remains Draft/open, stacked on PR #425. No merge, release, deployment, force-push or branch deletion. Readiness remains research prototype, not research-certified or release-ready.


## 2026-11-04 exact-head continuation — benchmark refresh and NIKL length adjudication

**Latest verified code/test baseline before this evidence-only patch:** `3a262b317a6ec5ffa49a11ebd46926be2d5a1a72`. The current evidence-only branch head includes a test-first RED checkpoint described below; no production engine code changed in this continuation.

### Test-first evidence update

- RED commit `e11be81d5a2db517aa808a12f6eb31264fb492ef`; System Verify [41869617954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41869617954) failed only in Python data-integrity because the newly added test correctly found the missing source-register key `SRC-NIKL-KRDICT-89917`. The Browser regression/build job passed; official NIKL metadata-only inventory was skipped.
- The failure was the expected missing evidence record, not a Kozak Kim pronunciation defect. The implementation response is source-register/catalog/ledger addition only; production IPA remains unchanged.
- The new test asserts the official dictionary's Hangul form `없는[엄ː는]` and separately checks the project's current broad IPA `ʌːm.nɯn`. It explicitly does not claim that the dictionary supplies IPA.

### Current exact-head verification (before this evidence-only patch)

- System Verify [41851913461](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41851913461): PASS — Python regression/data integrity and Browser regression/build jobs succeeded; official NIKL metadata-only inventory was skipped.
- Multi-engine Korean IPA diagnostic [41851913351](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41851913351): PASS. Artifact 13337845603; SHA-256 `7c0dce9cada1c15a22f99f18bea048b75f2df9b0133d9e87fcda3f95b82a484c`.
- External UGTPHON [41851913522], paired Native/g2pK [41851913346], Browser G2P [41851913352], exhaustive test-case extraction [41851913799], morphology consensus [41851913516], and real-engine morphology smoke [41851913585]: PASS.
- Multi-engine neural inference jobs (CharsiuG2P, ByT5 and pairing neural outputs): SKIPPED, not passed. Official NIKL metadata-only inventory: SKIPPED, not passed.

### Paired diagnostic against unchanged original g2pK 0.9.4

- UGTPHON paired set (n=2,698): Kozak Kim 1,431 exact (53.0393%), CER 8.9920%; g2pK 1,433 exact (53.1134%), paired CER 9.2304%. Exact-match delta is 0.0741 percentage points in g2pK's favour, with paired row-cluster 95% CI −0.0824 to +0.2840 pp (crosses zero). Kozak Kim CER is lower by 0.2384 pp; paired CI for g2pK-minus-Kozak CER is +0.1392 to +0.3464 pp.
- SIGMORPHON paired set (n=998): Kozak Kim 358 exact (35.8717%), CER 14.5598%; g2pK 353 exact (35.3707%), paired CER 14.8106%. Five net Kozak-only exact wins; exact two-sided McNemar p=0.0625 (promising, not decisive at 0.05). Kozak Kim CER is lower by 0.2508 pp; paired bootstrap CI +0.0986 to +0.4444 pp.
- Broad-candidate sensitivity is higher for Kozak on both sets (UGTPHON 86.47% vs 85.69%; SIGMORPHON 69.74% vs 68.74%), but the profile removes selected IPA distinctions and is research-only/unadjudicated. Do not report these as normative accuracy.
- The two corpora are diagnostic annotations, not independently adjudicated Korean IPA gold. g2pK is rendered through the shared project IPA adapter. No universal superiority claim follows.

### Native/Browser parity

On the 2,703 eligible UGTPHON occurrences, Native and Browser surface Hangul are identical (2,703/2,703); on 2,698 scored IPA occurrences, raw IPA is identical (2,698/2,698). Both runtimes abstain on the same five cases. This verifies cross-runtime parity, not linguistic correctness.

### C13 — source-attested length in 없는

The four UGTPHON cases (`dc_inside_2035`, `dc_inside_2108`, `dc_inside_2212`, `dc_inside_2269`) all show Kozak `/ʌːm.nɯn/`, g2pK `/ʌm.nɯn/`, corpus `/ʌ̹mnɯn/`. NIKL Korean Basic Dictionary entry 89917 directly lists `없는[엄ː는]`. The corpus omits the long mark, so g2pK's exact match is not the stronger source-backed reading. Kozak's output is preserved; no production change and no benchmark reference rewrite. Source row `SRC-NIKL-KRDICT-89917`, catalog row `S026`, C13 cluster and four paired occurrence rows record the adjudication. The official source supplies Hangul, not IPA; the project's broad IPA is derived. Item-level KOGL status remains unchecked.

### Methodology applied from the four referenced engineering repositories

- **Superpowers:** red/green discipline and systematic root-cause investigation. The new test was observed failing for the expected missing evidence key before the source/catalog records were added.
- **Matt Pocock skills:** small composable engineering checks; preserve the existing task contract rather than replacing it with a new process.
- **Ponytail:** minimal-change discipline; this finding did not justify modifying phonological production code.
- **unlazy:** explicit acceptance evidence and re-verification; runnable checks are reported separately from skipped/manual gates.

These methods are used as engineering practices, not vendored dependencies or new production packages.

### Remaining blockers and readiness

Independent Korean IPA adjudication (24-case blind packet), independent Ukrainian target review, item-level NIKL/KOGL permissions, C12 source audio and speaker/prosodic crosswalk, historical 239-case adjudication, and broad NIKL/names/loans/Hanja/regional-style coverage remain open. Neural teacher inference remains deferred/skipped. Original g2pK 0.9.4 and all vendored g2pK files remain unchanged.

Readiness: **research prototype**, not research-certified or release-ready.


## 2026-11-04 final verification checkpoint — evidence-only NIKL length adjudication

**Branch head entering this checkpoint:** `9b81a412d733b61ddd0782920ef727291cd1a374`. The C13 continuation changes only source metadata, discrepancy evidence, tests, and documentation; Kozak Kim production code and the pinned g2pK baseline are unchanged.

### Red/green and exact-head verification

- Test-first RED: `e11be81d5a2db517aa808a12f6eb31264fb492ef`; System Verify [41869617954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41869617954) failed exactly because `SRC-NIKL-KRDICT-89917` had not yet been registered. The Browser suite passed at this RED checkpoint.
- Evidence GREEN: `00aa0b6ebb1c4dfae906d4661cb88d8b8d0876a9` added the NIKL source to the research register and source catalog, C13 and four paired occurrence rows, and the test asserting the source-backed length and the existing Kozak IPA.
- Follow-up test correction: `9b81a412d733b61ddd0782920ef727291cd1a374` updated the Browser source-rights audit's expected register count from 176 to 177 and REVIEW_REQUIRED from 164 to 165, and explicitly checks the new source remains unresolved for item-level rights. This was a stale fixed-count assertion caused by the new source record, not a browser-engine regression.
- Exact-head System Verify [41870455925](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41870455925): PASS — Python regression/data integrity PASS; Browser **1,396/1,396**, 0 failures; Vite build (55 modules) and generated-page checks PASS. A duplicate exact-head verify [41870442892](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41870442892) also PASS.
- Browser G2P [41870455567], paired Native/g2pK [41870455546], external UGTPHON [41870455517], morphology consensus [41870455515], morphology adapter smoke [41870455495], and exhaustive extraction [41870455600]: PASS.
- Multi-engine rerun [41870455614] is still in progress at the multi-engine comparison step as of this checkpoint. Do not claim a result from that run until it completes. The latest completed exact production-code benchmark remains [41851913351], artifact 13337845603, SHA-256 `7c0dce9cada1c15a22f99f18bea048b75f2df9b0133d9e87fcda3f95b82a484c`; production code is unchanged since that benchmark.
- Official NIKL metadata-only inventory: SKIPPED, not passed. CharsiuG2P and ByT5 inference: SKIPPED, not passed.

### C13 source adjudication: 없는

The four UGTPHON occurrences (`dc_inside_2035`, `dc_inside_2108`, `dc_inside_2212`, `dc_inside_2269`) all have Kozak `/ʌːm.nɯn/`, original g2pK `/ʌm.nɯn/`, and corpus reference `/ʌ̹mnɯn/`. NIKL Korean Basic Dictionary entry 89917 directly lists `없는[엄ː는]`. This supports the long vowel at the Hangul surface level; it does not supply IPA. The project's `/ʌːm.nɯn/` is the derived broad-IPA rendering. The corpus annotation omits length, so g2pK's exact string match is not the stronger source-backed reading. Preserve Kozak's existing output; do not shorten it or rewrite the raw corpus reference.

Source register: `SRC-NIKL-KRDICT-89917`; catalog: `S026`; mass cluster: C13; paired ledger: occurrence IDs 893, 1145, 1621, 2290. The new Python regression passed on the exact verified head. Item-level KOGL marking remains unchecked.

### Existing source-backed comparative wins retained

- `인기`: NIKL Q&A 331569 explicitly gives optional `인기[인끼]`; the existing `variant-aware-research` row preserves the non-fortis alternative. The current paired occurrence is native exact and g2pK non-exact. This is a lexical optional variant, not a productive ㄴ+ㄱ or all-`氣` rule.
- `못잃어`: the existing `variant-aware-research` entry keeps both `몬니러` and `모시러` candidates. NIKL's 2022 usage survey discusses both n-insertion and non-insertion for `못 잃어`, but the percentages in the surfaced table belong to `못 잇는다` and must not be transferred. The primary candidate is not a normative ranking. The paired occurrence is native exact and g2pK non-exact.
- These existing rows are preserved; no new productive rule or production override was introduced in this checkpoint.

### Readiness and handoff

- Original g2pK 0.9.4 remains pinned and unchanged; no vendor file was touched.
- PR #426 remains Draft/open, based on PR #425; it is a stacked change and must not be merged independently. No merge, release, deployment, force-push, or branch deletion.
- Independent Korean IPA review, independent Ukrainian target review, item-level NIKL rights, C12 source audio/speaker/prosodic crosswalk, historical 239-case adjudication, and names/loans/Hanja/regional-style coverage remain open.
- Research-only neural inference remains deferred/skipped.
- Readiness remains **research prototype**, not research-certified or release-ready.


### 2026-11-04 status correction — multi-engine rerun

The first attempt of multi-engine workflow run [41870455614](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41870455614) was **cancelled** while the `Run multi-engine comparison` step was active. It produced no final artifact and no new benchmark score. A rerun of the failed/cancelled multi-engine job (job ID `126716565928`) was requested; attempt 2 was pending/queued at the latest status check. Until that rerun completes, use the latest completed benchmark artifact from run `41851913351` (artifact `13337845603`, SHA-256 `7c0dce9cada1c15a22f99f18bea048b75f2df9b0133d9e87fcda3f95b82a484c`). The production engine has not changed since that completed artifact; do not claim the cancelled attempt passed.
