# Korean G2P engine improvement research — 2026-11-01

## Scope and terminology

This review concerns the repository's **native ClippyFirst Korean pronunciation engine** and its optional **g2pK adapter**. These are distinct implementations:

- Native engine: deterministic NIKL-oriented rules, exact lexical licenses, a structured syllable representation, and a research-only morphology/analyzer path.
- g2pK adapter: calls the external Kyubyong Park g2pK package, receives Hangul surface spelling, then derives ClippyFirst broad IPA. It does not expose a complete per-rule trace.

Do not conflate g2pK with the native engine or describe the third-party library as ClippyFirst-authored. The upstream g2pK README notes that the library is not perfect and documents MeCab-based contextual analysis, prescriptive/descriptive modes, and a verbose rule trace.

## Current measurable baseline

The latest fully documented comparable multi-engine baseline currently available in the repository's benchmark history is Actions run [40837034742](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40837034742):

| Engine | UGTPHON exact | SIGMORPHON exact | Interpretation |
|---|---:|---:|---|
| Native ClippyFirst | 53.002% | 35.772% | Better CER/PER/feature proxy than g2pK on both sets in that run |
| g2pK | 53.089% | 35.335% | Near-tied exact match; not better on all sequence/feature metrics |

This is a historical verified baseline, not a score for the current branch head. Exact match alone is not an adequate objective: a model can tie exact match while producing worse partial sequences, and IPA source conventions can create apparent errors that are not yet adjudicated phonological errors.

The neural-teacher register currently reports 0 teacher-vs-Strict disagreements established as true phonological errors because the source IPA conventions have not yet been reconciled. It also records 107 length-mark-only diagnostics and 291 other teacher mismatches in one saved dev artifact; these are triage categories, not counts of missing rules.

## Research findings relevant to improvement

### 1. Morphology must be represented as structure, not guessed from adjacent letters

The 2022 study by Mun, Kim and Ko evaluated g2pK and KoG2P rule-by-rule and reports improvements from:
- adding h-deletion;
- handling ㅢ variation;
- consonant-place assimilation;
- revising the ordering of rules such as h/ㅎ neutralization;
- accounting for prosodic boundaries.

It identifies two general limitations in common rule-based engines: binary application of phonological rules and lack of prosodic-boundary information. It proposes modelling gradient rule application with factors such as lexical frequency and speech register.

Source: Mun, Seongmin, Su-Han Kim and Eon-Suk Ko (2022), *A proposal to improve on existing Grapheme-to-Phoneme conversion models informed by linguistics*, 언어와 정보 26(2), 27–46, DOI [10.29403/LI.26.2.2](https://doi.org/10.29403/LI.26.2.2). The KCI abstract is available at https://www.kci.go.kr/kciportal/mobile/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002922160.

The repository already has many of these rule families and explicit full-form licenses. The remaining opportunity is not to add a generic rule for each phenomenon; it is to make the evidence for **morpheme, word and phrase boundaries** explicit and reusable across rules.

### 2. Syllable–morpheme connectivity and rule re-evaluation are promising architecture patterns

You and Moon's Interspeech 2026 paper proposes an object-oriented representation with syllable–morpheme connectivity and recursive re-evaluation of sequential phonological rules. Its abstract reports 85.7% sentence-level accuracy and 3.14 ms latency versus 27.2% and 14.98 ms for g2pK in the authors' own evaluation.

Source: You, Heejo and Sung-woo Moon (2026), *Uncovering the Impact of G2P Precision on Korean TTS: A Large-Scale Statistical Validation via a Novel Morphological Engine*, Interspeech 2026, Zenodo record [22167288](https://zenodo.org/records/22167288), DOI [10.5281/zenodo.22167288](https://doi.org/10.5281/zenodo.22167288).

These numbers are **not comparable** to this repository's token-level IPA exact match, CER, PER or feature proxy. The paper record provides a paper, not a verified runnable engine or reusable benchmark implementation. Its reported architecture is a research lead, not permission to copy code and not proof that the same gains will transfer.

### 3. The repository already has useful foundations to preserve

- Syllable stores onset, nucleus, coda, source character and word-boundary metadata.
- The deterministic engine applies an explicitly ordered NIKL rule sequence and returns rule traces.
- Morphology-sensitive rules fail closed without exact full-form/pair licenses.
- A separate research path uses analyzer consensus to propose low-confidence licenses; it does not silently change the strict browser/runtime path.
- The neural-teacher workflow is hypothesis generation only; source IPA differences remain unadjudicated.
- Exact lexical pronunciation entries preserve source URLs, confidence and rule notes.

Do not replace these safeguards with a broad heuristic or train on the synthetic adversarial corpus.

## Implemented correctness hardening in this continuation

The optional g2pK adapter previously aligned source and surface words by positional zip after checking only that their token counts matched. A changed separator or punctuation boundary could therefore associate a source lexical IPA entry with the wrong surface token.

The adapter now uses _aligned_source_words:
- requires equal Korean word-token counts;
- compares every exact inter-word separator between source and surface (including whitespace and punctuation);
- returns no source-word mapping when alignment is uncertain;
- withholds both source-specific surface overrides and lexical IPA overrides when alignment is not verified;
- exposes word_alignment_status as either verified-source-surface-word-boundaries or unknown-source-surface-word-boundaries.

Regression tests cover a normal aligned sentence, punctuation shifted across the boundary, and a merged-word output. This is a correctness/provenance fix, **not a claimed benchmark-accuracy gain**. Exact-head CI is required before marking it verified.

## Recommended implementation sequence

| Priority | Work item | Why | Acceptance gate |
|---|---|---|---|
| P0 | Reconcile IPA conventions and adjudicate benchmark disagreement cases | Prevents optimizing annotation differences as if they were Korean errors | Source-blind reviewed mapping for each relevant IPA feature; preserve raw source strings |
| P1 | Introduce an inspectable syllable–morpheme boundary layer in the research engine | Makes formal endings, lexical compounds, eojeol boundaries and phrase boundaries explicit | Boundary provenance, analyzer agreement/disagreement, unknown state; no default runtime behavior change |
| P1 | Add bounded local rule re-evaluation for rules whose output changes a neighboring rule's input | Avoids relying on a fragile one-pass order where a prior change enables a later rule | Explicit dependency order, deterministic termination, cycle detection, trace of each pass, positive/negative tests |
| P2 | Expand exact source-backed cases for h-deletion, ㅢ variation and place assimilation | These are specifically identified by the 2022 rule-by-rule study | NIKL/primary evidence per environment; no spelling-only generalization |
| P2 | Represent optional/descriptive variants as typed alternatives, not silent replacements | Korean variation depends on lexical frequency, register and prosodic context | Separate standard-prescriptive and descriptive profiles; no unsupported probability claims |
| P3 | Benchmark speed and memory independently from accuracy | g2pK's MeCab path can have substantial startup and per-call costs | Warm/cold and per-word/batch scopes separated; repeated runs; no timing comparisons across unlike scopes |

### Proposed morphology representation

Add this only in a research branch first. Each syllable should be linked to:
- its source Hangul span and syllable index;
- a morpheme ID (or explicit unknown);
- boundary kind: within-morpheme, morpheme, eojeol, phrase, or unknown;
- analyzer source(s), agreement state and confidence;
- candidate lexical class where a rule requires it.

A rule should declare which boundary kinds it can cross, its source-backed environment, its dependencies, and whether it is categorical or variable. The engine should preserve all competing analyses where Kiwi and MeCab disagree. It must not collapse analyzer output into a false certainty.

### Bounded rule re-evaluation

Do not introduce unrestricted recursion. A safe experiment should:
1. apply a deterministic, explicit rule dependency schedule;
2. after a rule changes a segment, re-evaluate only affected neighboring rules;
3. stop when the representation is unchanged;
4. enforce a small documented pass bound and detect repeated states/cycles;
5. retain a full trace showing which rule caused each re-evaluation;
6. fail closed if the pass bound is reached without convergence.

This is a proposal for a research-only prototype, not a production change in this commit.

## Benchmark protocol before promoting any change

1. Freeze source revisions, preprocessing and the IPA convention mapping before comparing engines.
2. Keep train/dev/test and synthetic adversarial fixtures strictly separate. Never tune on the held-out test set.
3. Report exact match, CER, PER, coverage, coverage-adjusted accuracy, abstentions and per-case errors together.
4. Stratify errors by rule family, morphology boundary, word/phrase boundary, length, vowel variant, coda, and IPA feature.
5. Use paired case-level comparisons and confidence intervals; do not infer an improvement from a single aggregate score.
6. Require no unacceptable regressions on independently adjudicated standard Korean controls.
7. Keep Korean surface accuracy, IPA accuracy and Ukrainian target accuracy as separate acceptance layers.

## Decisions and blockers

- **No third-party implementation copied or vendored.** KoG2Padvanced was recorded as research-only because its repository had no declared license; the Interspeech 2026 paper's runnable source/checkpoint has not been verified.
- **No new phonological rule promoted** from raw teacher disagreement or benchmark-only gains.
- **No new benchmark score claimed** for the current branch head.
- **Next genuine blocker:** a reviewed, source-convention-compatible case-level IPA adjudication set. Without it, the team cannot reliably tell whether a proposed rule improves Korean phonology or merely matches one corpus's annotation style.

## References

- Park, Kyubyong. [g2pK repository](https://github.com/kyubyong/g2pK) (Apache-2.0; third-party implementation).
- Mun, Kim and Ko (2022). [DOI 10.29403/LI.26.2.2](https://doi.org/10.29403/LI.26.2.2).
- You and Moon (2026). [Zenodo 22167288](https://zenodo.org/records/22167288).
- Repository's source and convention review: research/SOURCE-REGISTER.csv, docs/KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md, and docs/NEURAL-TEACHER-CANDIDATE-RULE-REGISTER-2026-10-26.md.
