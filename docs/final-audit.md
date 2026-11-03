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
