## Current continuation delta — 2026-11-04

| Requirement | Current state | Evidence / next acceptance |
|---|---|---|
| Keep original g2pK comparison adapter isolated from Kozak research-only lexical candidates | **DONE_VERIFIED on PR branch; not merged** | Python adapter excludes `variant-aware-research` and `kozak-research-only` from surface, IPA and diagnostic-status overlays. Real `못잃어` and synthetic fixtures cover the three paths; source-backed `삶의` retains its diagnostic-only IPA warning. Optional g2pK tests passed 30/30 on Python 3.11 and 30/30 on Python 3.12. |
| Preserve original g2pK implementation/vendor files | **DONE_VERIFIED** | Recursive Git-tree comparison: all 9 `src/vendor/g2pk/` files are byte-identical to main. |
| Verify Python/browser/runtime integration and paired baseline | **DONE_VERIFIED on PR branch** | System Verify, Python 3.11/3.12/3.13, browser 1,345/1,345, wheel install, teacher-corpus audit, optional g2pK, and paired Native/g2pK diagnostic all passed. |
| Complete multi-engine diagnostic and independent linguistic review | **PARTIAL / evidence-limited** | Multi-engine benchmark still in progress; CharsiuG2P/ByT5 skipped. Official live NIKL inventory skipped. Independent IPA and Ukrainian-target gold remain external acceptance blockers. |

This delta does not change Kozak Kim production phonology, IPA policy or Ukrainian targets. It protects the independence of the g2pK comparison baseline. PR #432 remains Draft/open and unmerged; overall readiness remains a research prototype pending independent IPA adjudication, Ukrainian-target review, source-rights clearance and unresolved mismatch adjudication.
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
