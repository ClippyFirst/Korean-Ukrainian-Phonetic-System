## 2026-11-04 verification refresh — g2pK baseline isolation (PARTIAL)

The verified code/test snapshot `047ecf2885281b0c5d579212439f36b6b815219d` passed System Verify [41879691726], full tests matrix [41880371150] (Python 3.11/3.12/3.13, web, wheel install and teacher-corpus audit), and optional g2pK [41879691621] (29 tests on each of Python 3.11 and 3.12).

On the subsequent pre-new-test branch snapshot `a92f1f6bdf492a57bd8304fc11d193313fde9fb3`, System Verify [41881763346], optional g2pK [41881763221], paired Native/g2pK [41881763151], external UGTPHON [41881763371], morphology consensus [41881763588], exhaustive register extraction [41881763551], and master-table artifacts [41881763224] passed. The tests matrix [41881763484] passed Python 3.11/3.12/3.13, web and wheel install; its teacher-corpus audit failed due external HTTP 503 and was rerun, still in progress at last inspection. Multi-engine runs were cancelled; CharsiuG2P/ByT5 were skipped. Official NIKL metadata inventory was skipped.

Paired UGTPHON (n=2,698) on the mainline snapshot: native Kozak 53.0022% exact / 9.1697% CER; g2pK 53.1134% exact / 9.2304% CER. Exact match favours g2pK by 0.1112 pp; CER favours Kozak by 0.0607 pp. This is noisy diagnostic evidence, not normative IPA gold.

Current branch tip `a8781dbd134929fb3b65ac168c9ea8fee0bf57c7` has no `src/` changes against verified snapshot `047ecf2885281b0c5d579212439f36b6b815219d`; the only test-tree difference is one added regression that preserves the source-backed diagnostic-only IPA status for `삶의`. That new test has not yet run. TDD RED was not observed. No release-readiness claim follows from these software checks.

## Continuation audit — 2026-11-04: g2pK research-overlay isolation

**Status: PARTIAL; PR #432 is Draft/open and exact-head CI is pending.**

The current-main Python g2pK adapter consumed the shared Kozak lexical table without filtering research-only input kinds. This could let a Kozak research candidate rewrite the adapter's external g2pK Hangul surface, inject Kozak-derived IPA, or leak a diagnostic-only status into the g2pK result. The narrow PR #432 adds a guard for `variant-aware-research` and `kozak-research-only` at each of those three boundaries, with a real `못잃어` regression and synthetic structural tests for the other paths.

No Korean phonological rule or Kozak Kim production output is changed. No g2pK source/vendor file is changed; all 9 files in `src/vendor/g2pk/` were verified byte-identical to the base `main` tree. The PR changes only the Python adapter and its tests.

The test-first commits did not receive a confirmed RED run because GitHub Actions remained queued; the implementation was applied without claiming that RED was observed. Latest exact-head System Verify, Python matrix, optional g2pK and paired benchmark jobs remain queued. Local execution is blocked by DNS resolution failure for GitHub, so no local test result is claimed.

**Acceptance remains open** until exact-head CI passes and the g2pK integration plus paired Native/g2pK diagnostic confirm that the external baseline is not affected by Kozak-only overlays. This is a baseline-integrity correction, not evidence that either engine is linguistically superior.

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