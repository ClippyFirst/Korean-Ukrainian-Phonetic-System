## 2026-11-02 current continuation — PR #421

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

# Final audit — 2026-10-03

## Release status

**Version 0.6.0 — computationally research-ready within the documented evidence boundary, with an exhaustive Hangul master-table projection.**

This release closes the implementation layers identified by the original research-system specification and the v0.4.1 adversarial audit. It does not manufacture empirical evidence that is not present in the repository.

## Initial specification → final state

### Core architecture

Implemented as separate layers:

KOR_ORTH → KOR_PHON → KOR_PHON_RULES → KOR_IPA → UA_PHONETIC_TARGET → UA_ORTHOGRAPHY

The implementation keeps orthographic decomposition, phonological structure, contextual rules, IPA, target candidate ranking and target grapheme rendering separately addressable.

### Hangul / Unicode

- 19 leading Jamo positions.
- 21 medial Jamo positions.
- 27 trailing consonant Jamo plus the empty trailing slot.
- 67 actual modern Jamo records.
- Exactly 11,172 modern precomposed Hangul syllable blocks generated deterministically.
- Canonical NFD decomposition metadata.
- Explicit compatibility-Jamo codepoints.
- Exact committed-artifact equality test.

The 11,172 rows are treated as a combinatorial graphic inventory, never as a lexical or phonemic inventory.

### Korean phonology

The repository preserves the 19-consonant and 21-vowel orthographic/segmental baseline, with explicit analysis-dependent contemporary vowel representations and Seoul stop-cue variation.

The computational rule registry is now R001–R015.

### Standard Pronunciation coverage

Sections 9–30 are explicitly classified in data/korean/rule_scope.csv.

- §§9–15: implemented in the core coda/liaison/ㅎ rule system.
- §16: explicitly scoped outside the ordinary lexical-word pipeline because consonant-letter names require a dedicated lexical-name parser.
- §17: implemented as palatalization.
- §§18–20: implemented as nasal/liquid assimilation.
- §21: represented as an explicit negative constraint rather than a positive rewrite.
- §22: variation-only; no deterministic vowel rewrite is fabricated.
- §23: implemented as post-coda fortition.
- §§24–28: implemented as explicit-license conditional rules R010–R014 because morphology/lexical structure cannot safely be inferred from adjacent Hangul alone.
- §29: implemented as explicitly licensed R009; word-boundary crossing requires phrase mode.
- §30: implemented as conditional R015 with explicit saisiot licensing.

This design is evidence-preserving: conditional rules cannot silently fire merely because a phonological shape happens to be adjacent.

### Rule ordering and provenance

R001–R015 are synchronized across runtime rule registry, data/korean/rules.csv, data/korean/rule_ordering.csv, data/korean/rule_scope.csv, tests and rule traces.

Rule traces preserve source, confidence, status and explicit licensing context.

### Adversarial probes

The validation/test layer covers, among others:

- 넋이
- 값이
- 앉아
- 닭을
- 젊어
- 긁는
- 뚫네
- 핥네
- 한여름
- 무슨 일
- 먹이
- 몇 년
- 국밥
- 각하
- 같이
- 가A
- unsupported IPA
- unknown boundary mode
- unlicensed morphology-sensitive rules.

The critical distinction is that positive contextual processes are not inferred when the required lexical/morphological/phrase license is absent.

### IPA

The repository provides phonemic and rule-supported broad IPA.

Narrow IPA is deliberately rejected because the repository does not contain an acoustic/allophonic model capable of supporting a defensible narrow transcription. This is a correctness safeguard, not a missing label.

### Ukrainian target layer

The Korean repository does not duplicate the Ukrainian phonetic inventory.

The target layer is pinned to ukrainian-phonetic-inventory 0.8.0 and explicitly rejects incompatible versions.

Candidate ranking now consumes documented UPI mapping metadata where available:

total_cost = feature_cost + context_penalty + phonotactic_penalty + orthographic_penalty

The score is a heuristic cost, not a probability.

Full sequence-level Ukrainian orthography remains owned by UPI. The Korean repository therefore does not pretend that segmentwise target candidates constitute a universally correct Ukrainian spelling.

### API

The public API exposes the required Hangul, analysis, phonology, phonetics, target mapping, ranking and end-to-end functions.

analyze_korean() now rejects mixed-script input instead of silently discarding unsupported characters.

### Evidence and competing analyses

Current machine-readable evidence includes 6 source records, 13 claim-level evidence records, 4 competing-analysis records, rule-level source references, and explicit status/confidence fields.

Normative NIKL material is separated from peer-reviewed Seoul phonetics and contemporary variation evidence.

### Validation and tests

Fresh verification on the final candidate:

- existing tests workflow: 61 passed, 0 failed;
- new multi-version CI workflow: success across Python 3.11, 3.12 and 3.13;
- package installation succeeded under CI;
- schema validation, generated-artifact equality, foreign-key validation, rule behavior, IPA, target ranking and adversarial tests are included.

Historical v0.4.1 verification (49/49) is retained as history only and was not reused as proof for this release.


## Exhaustive master-table layer

Version 0.6.0 adds the practical table layer requested for direct use.

- deterministic modern Hangul inventory: exactly 11,172 syllable blocks;
- three-column presentation projection: `korean,ipa,ukrainian`;
- IPA is a primary verification column between Korean and Ukrainian;
- canonical isolated-syllable rendering derived from the IPA-centered model;
- separate canonical correspondence basis in `data/korean/canonical_correspondence.csv`;
- deterministic generator in `scripts/generate_master_table.py`;
- primary generated table includes Korean, IPA and Ukrainian;
- audit projection additionally includes decomposition, scope and lexical-status metadata;
- GitHub Actions generates the CSV artifacts reproducibly.

The table is exhaustive for the Unicode combinatorial syllable space, not for the Korean lexicon or all connected-speech contexts. Context-sensitive pronunciation remains governed by the rule system. This boundary is consistent with the NIKL Standard Pronunciation Rules, which explicitly distinguish contextual pronunciation processes.

## Reproducibility

The repository now has an explicit .github/workflows/ci.yml covering pushes and pull requests.

The exact final candidate commit is the subject of fresh CI verification.

## Scientific boundaries that remain intentionally open

These are not silently closed because doing so would require data not present in the repository:

1. exhaustive lexical pronunciation-dictionary coverage;
2. corpus-scale frequency/attestation statistics;
3. a defensible acoustic narrow-IPA model;
4. independent expert adjudication of competing phonological analyses;
5. gold-corpus optimisation and held-out evaluation of correspondence weights;
6. exhaustive lexical/morphological exception lists;
7. sequence-level Ukrainian orthographic evaluation against a gold corpus.

These are empirical research extensions, not defects that should be hidden by hard-coded outputs.

## Initial-vs-final conclusion

The original architecture and implementation requirements are now represented in the repository as implemented computational layers, explicit conditional layers where external lexical/morphological information is required, explicit variation-only or scoped-out layers where deterministic computation would overclaim, machine-readable provenance, adversarial validation, reproducible generated artifacts, and fresh CI verification.

The project should therefore be described as a research-ready computational framework/prototype, not as a universally authoritative Korean→Ukrainian transcription standard.

## External evidence boundary

The normative baseline is the National Institute of Korean Language Standard Pronunciation Rules:
https://www.korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002

The Unicode combinatorial model follows Unicode Core Specification Chapter 18:
https://unicode.org/versions/Unicode18.0.0/core-spec/chapter-18/

Peer-reviewed phonetic evidence remains recorded in data/korean/sources.csv.

## Final recommendation for scientific presentation

The repository is suitable for a research demonstration, methodological paper draft, specialist review and further corpus-based validation.

It should not claim that every Korean lexical item has a uniquely determined Ukrainian output, that heuristic ranking is probabilistic, or that the current broad IPA layer is an acoustic narrow transcription.

## Kozak Kim exact-head audit update — 2026-11-03 (PR #424)

- Exact head `dca64251e073c74a61e62dab3cb99c5fdcb36943`; stacked on Draft PR #423, no merge or release.
- Source-backed `끌다` correction and bounded Rule §24 `굶다` entry are implemented with regression coverage. NIKL supplies Hangul readings, not IPA; `끌다` IPA is project-derived and Ukrainian output remains withheld.
- Kozak-only research rows are explicitly prevented from affecting the g2pK comparison adapter. No vendored/upstream g2pK source files changed.
- Exact-head System Verify 41628584922: Browser 1,391/1,391, Python regression/data integrity, Vite build and generated-page checks PASS. g2pK integration 3.11/3.12, morphology consensus, test extraction, UGTPHON, paired Native/g2pK and multi-engine diagnostics PASS. NIKL metadata inventory, CharsiuG2P and ByT5 SKIPPED.
- Paired diagnostic update: UGTPHON n=2,698, Kozak CER 9.0613% vs g2pK 9.2285%, with g2pK +2 exact cases overall; SIGMORPHON n=998, Kozak exact 35.8717% vs g2pK 35.3353%, CER 14.5598% vs 14.8222%. The shared IPA renderer and non-gold corpus references limit claims.
- Remaining acceptance blockers: two independent Korean IPA reviewers/adjudication; item-level NIKL reuse-rights determination; independent Ukrainian target review; C12 primary acoustic/articulatory evidence; 239 unmapped mismatches; adjudicated IPA gold for training. Current disposition remains research prototype, not release-ready.


## Exact-head audit addendum — 2026-11-03 (PR #424, commit 2e6e739)

A source-aware code-path audit found that the Python g2pK adapter filtered `kozak-research-only` rows but not `variant-aware-research`. The latter allowed the provisional `못잃어 → 몬니러` candidate and its project IPA to contaminate the g2pK application adapter. Test-first reproduction failed exactly as expected on `5131e807`; commit `2e6e739` now filters both research-only input kinds in both surface and IPA override paths. Exact-head system verify passed (Browser 1,391/1,391; Python/data integrity; production build; generated pages), as did optional g2pK integration on Python 3.11/3.12. Original vendored/upstream g2pK remains unchanged; raw multi-engine benchmark calls `G2p()` directly.

The prior multi-engine artifact 13226589858 remains valid for the raw benchmark path. Rerun 41637795800 was still in progress at audit time; no new score is claimed. CharsiuG2P, ByT5 and NIKL metadata-only inventory were skipped. Release disposition remains research prototype / not release-ready.


## Kozak Kim exact-head audit — 2026-11-04 (PR #426)

The exact-head multi-engine run [41726881384](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41726881384), artifact `13276390247`, completed the pinned UGTPHON engine comparison but failed the subsequent checked-in mismatch-queue `cmp` at byte 31,117 / line 14. Exporter: 36 unmapped-broad occurrences / 55 fragments; zero missing context lookups. This is a golden-artifact drift failure, not an engine crash. Same-occurrence Browser/parity and SIGMORPHON downstream stages were skipped and remain unverified.

On 2,698 paired UGTPHON scored occurrences, On the shared paired subset n=2,698: Native 1,431/2,698 exact (53.0393%), CER 8.9920%; g2pK 1,433/2,698 exact (53.1134%), CER 9.2304%. Raw g2pK full coverage was 2,703/2,703, 1,435 exact (53.0892%), CER 9.2285%; these raw values are not paired to Native because Native abstained on five occurrences. Paired g2pK-minus-Native exact delta +0.0741 pp (95% CI −0.0824 to +0.2840; inconclusive), CER delta +0.2384 pp (95% CI +0.1392 to +0.3464; g2pK higher). Five Native abstentions are excluded from paired scores. UGTPHON is diagnostic, not normative IPA gold; g2pK surface Hangul is passed through the shared project IPA renderer. No universal superiority claim is warranted.

System Verify 41726881404, Browser G2P 41726881454, paired Native/g2pK 41726881375, UGTPHON 41726881376, morphology consensus 41726881382, morphology adapter smoke 41726881366, and test-case extraction 41726881450 passed on the implementation head. NIKL metadata-only crawl and neural inference were skipped. Original g2pK package/vendor source remains untouched. Current disposition: research prototype, not research-certified or release-ready. Golden queue regeneration/review and exact-head rerun, independent Korean IPA adjudication, item-level NIKL rights, Ukrainian target review, C12 evidence and 239 unmapped mismatch adjudications remain open.


## 2026-11-04 exact-head docs-only verification refresh

Latest documented branch head before this verification note: `528c811224e9725360282441d71ff5b8baac1423`. Exact-head System Verify [41794525526](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41794525526) completed SUCCESS: Python regression/data integrity PASS; Browser regression/build PASS with 1,394/1,394 tests, 0 failures, 0 skips; Vite production build and generated-page checks PASS. NIKL metadata-only inventory was SKIPPED, not passed. Build emitted a non-fatal large-chunk warning (two generated dictionary chunks exceed 500 kB) and Node 20 deprecation warnings from setup actions; no build failure. This is docs-only verification on the current algorithm tree, not a new pronunciation/benchmark result. The multi-engine golden-queue mismatch described above remains unresolved.


## 2026-11-04 mismatch-queue exact-artifact reconciliation (PR #426)

The prior golden-file failure is resolved at data-artifact level on commit `c0cbe3740e734c87d3202cca496b83d9603ea218`. Run [41794874090](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41794874090), artifact [13305816579](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41794874090/artifacts/13305816579), generated 36 unmapped-broad occurrences / 55 fragments with zero missing context lookups. The checked-in queue was reconciled from 43 to 36 rows. All 36 retained records were byte-identical to the generated records under per-row hash comparison. Seven old records were removed only after checking their current broad-profile disposition: five are broad-exact (1406 `팔자걸음`, 1527 `보일거라`, 2001 `물가로`, 2010 `혐오증`, 2533 `안할듯`); 868 `없을듯` now has only a mapped C06 unreleased-coda difference; 2562 `정신병자네` has a mapped C11 sibilant-place difference. These are benchmark-relative dispositions, not expert adjudications. No production rule changed; original g2pK remains untouched.

The refreshed exact-head multi-engine run [41797143756](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41797143756) and associated regression workflows were in progress at audit time. Same-occurrence Browser parity and current-head SIGMORPHON results remain unverified until that run and its artifact complete. Disposition remains research prototype / not research-certified / not release-ready.

## 2026-11-04 — exact-head benchmark completion and phrase-boundary follow-up

The refreshed-queue baseline passed in [run 41797276965](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41797276965), artifact [13306613436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41797276965/artifacts/13306613436). All 17 steps succeeded: multi-engine UGTPHON, 36-row queue export/cmp, same-occurrence Browser, Native/Browser parity, SIGMORPHON lexical portfolio, and artifact upload. Runtime parity: 2,703/2,703 surface equal; 2,698/2,698 IPA equal.

UGTPHON paired strict n=2,698: Native 1,431 exact / 8.9920% CER; g2pK 1,433 exact / 9.2304% CER. SIGMORPHON paired n=998: Native 358 exact / 14.5598% CER; g2pK 353 exact / 14.8106% CER; five net Native-only exact wins, exact McNemar p=0.0625. Broad sensitivity favors Native on both datasets but remains research-only and non-normative. The holdout packet has 24 cases for two independent reviewers, no engine outputs or IPA gold, annotation pending.

A separate source-backed R013 phrase-boundary extension was added after that baseline run: exact adjacent eojeol pairs `줄 것` and `많을 거`, with Python phrase-mode lookup indexed to the exact word boundary and the Browser map mirrored. Compact forms remain unlicensed. The new code/tests are not covered by run 41797276965 and remain CI-pending; do not mark the extension complete until exact-head tests pass.

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
