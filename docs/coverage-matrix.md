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
| R013 explicit phrase boundaries `줄 것`, `많을 거` | PARTIAL / CI PENDING | Python and Browser exact-pair licenses and positive/negative tests added. Compact no-space tokens remain intentionally unlicensed. Requires exact-head Python/Browser CI. |

The benchmark run predates the phrase-boundary code extension. Do not reuse its PASS as evidence for that new code.

## 2026-11-04 — R013 connected-phrase follow-up and current-head evidence

R013 / NIKL §27 exact connected-phrase licenses added for `줄 것` and `많을 거`. Python phrase mode binds each license to the exact adjacent eojeol pair and syllable-pair index; Browser phrase assimilation uses the same exact pair map. Positive cases: `해 줄 것 같다`, `많을 거 같이`. Compact no-space forms remain unlicensed; Browser additionally rejects punctuation-separated pairs. No hidden spaces are reconstructed.

Phrase mode assumes connected speech. NIKL §27 says a pause blocks fortition; the text API cannot infer prosodic pauses. This is rule-derived standard-pronunciation support, not acoustic IPA attestation. Primary evidence: NIKL Standard Pronunciation Rule 27 and official Q&A 310899 for colloquial dependent noun `거`.

Exact-head System Verify [41806844422] PASS: Python regression/data integrity; Browser 1,395/1,395; Vite build. Browser G2P [41806844476], paired Native/g2pK [41806844324], UGTPHON [41806844305], morphology consensus [41806844379], extraction [41806844316], and morphology smoke [41806844503] PASS. Multi-engine run [41806844311] was still in its comparison step at this checkpoint; no pass is claimed. Last completed full comparison: [41797276965], artifact [13306613436].

Comparative diagnostic (run 41797276965): UGTPHON paired n=2,698: Kozak Kim 1,431 exact / 8.9920% CER vs original g2pK 1,433 exact / 9.2304% CER; exact difference inconclusive (95% CI −0.0824 to +0.2840 pp), Kozak Kim CER lower by 0.2384 pp. SIGMORPHON paired n=998: Kozak Kim 358 exact / 14.5598% CER vs g2pK 353 exact / 14.8106% CER; five net Kozak-only exact wins, McNemar p=0.0625. Corpus IPA labels are not normative IPA gold; neither metric measures Ukrainian target quality.

Main is `607dccb46`, advanced through merged PRs #428/#430/#431. The benchmark module restored by #428 is byte-identical on main and this branch. PR #426 remains stacked on #425; no blind rebase. The corrected 36-row queue is already in #426 at `682c3a5`, byte-identical to its generated artifact. #427/#429 closed as superseded/no-op; branches retained.

R013 phrase implementation/tests: DONE_VERIFIED. IPA/prosody adjudication: PARTIAL/BLOCKED. Overall readiness: research prototype only. Independent Korean IPA reviewers, Ukrainian target review, NIKL item-level rights, C12 primary evidence and historical 239-case adjudication remain blocked.
