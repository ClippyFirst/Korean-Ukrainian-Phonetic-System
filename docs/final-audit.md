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