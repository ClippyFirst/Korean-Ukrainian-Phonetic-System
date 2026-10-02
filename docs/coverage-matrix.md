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
| UPI target source of truth | Implemented | adapter pins UPI 0.8.0 and rejects incompatible versions |
| UPI mapping penalties | Integrated | adapter loads `transliteration_mapping.csv` and ranking exposes component costs |
| Ukrainian sequence-level orthography | Delegated, not duplicated | UPI remains authoritative; this repo exposes segmentwise target candidates |
| Validation corpus | Rule-demonstration corpus implemented | `data/validation/cases.csv` |
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
