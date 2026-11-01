# Korean G2P engine improvement research — 2026-11-01

## Scope and terminology

This review concerns the repository's **native ClippyFirst Korean pronunciation engine** and its optional **g2pK adapter**. These are distinct implementations:

- Native engine: deterministic NIKL-oriented rules, exact lexical licenses, a structured syllable representation, and a research-only morphology/analyzer path.
- g2pK adapter: calls the external Kyubyong Park g2pK package, receives Hangul surface spelling, then derives ClippyFirst broad IPA. It does not expose a complete per-rule trace.

Do not conflate g2pK with the native engine or describe the third-party library as ClippyFirst-authored. The upstream g2pK README notes that the library is not perfect and documents MeCab-based contextual analysis, prescriptive/descriptive modes, and a verbose rule trace.

## Current measurable baseline

The latest completed paired native/g2pK diagnostic on the current research branch is Actions run [41248014239](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014239), artifact [13060260820](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014239/artifacts/13060260820). The separate UGTPHON profile run is [41248014136](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014136), artifact [13059792615](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014136/artifacts/13059792615).

| Engine/profile | Scored tokens | Exact | CER | Interpretation |
|---|---:|---:|---:|---|
| Native broad IPA | 2,698 | 53.0022% | 9.1697% | 5 unresolved; 0 engine errors |
| g2pK-derived IPA | 2,703 | 53.0892% | 9.2285% | 0 unresolved; 0 engine errors |
| g2pK, same 2,698-token paired subset | 2,698 | 53.1134% | 9.2304% | +0.1112 percentage points exact vs native, but +0.0607 pp worse CER |
| Native partial-narrow IPA profile v3 | 2,698 | 70.4225% | 4.8992% | Partial research-only profile; not independently adjudicated or target-compatible |

The paired native/g2pK difference is tiny and metric-dependent: g2pK has a 3-token exact-match advantage on the paired subset, while native has lower CER. The comparison also shares the repository IPA renderer for g2pK surface Hangul and is therefore not fully independent. UGTPHON is noisy user-generated text, not a normative standard-pronunciation corpus.

The broad-vs-partial-narrow result uses the same 2,698 tokens, but the narrow profile adds research-only allophonic detail to better match the UGTPHON annotation convention. Its higher exact match is **not proof of improved standard-Korean G2P** and must not be fed into the Ukrainian target adapter.

The broader multi-engine run [41248014178](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014178) was **CANCELLED** during its multi-engine comparison step; its uploaded artifact contains training-readiness/leakage information, not a completed multi-engine score. Do not cite that cancelled run as a benchmark pass.

Exact match alone is not an adequate objective: report CER, PER, coverage, unresolved cases and per-case errors together. IPA source conventions can create apparent errors that are not yet adjudicated phonological errors.

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
- The research-only morphology module already adapts Kiwi and MeCab-Ko, validates source offsets, preserves zero-width and unaligned morphemes, and builds syllable↔morpheme links and boundary classes. It explicitly grants no pronunciation-rule licenses.
- The analyzer agreement diagnostic found exact boundary-set agreement for 1,537/1,907 words (80.5978%); this is pairwise analyzer agreement, **not** segmentation accuracy. The two analyzers are not gold.
- A Kiwi+MeCab-Ko consensus diagnostic changed four words and newly resolved one previously unresolved form, but added no exact matches and slightly worsened CER (strict: 53.0022% exact / 9.1697% CER; consensus: 52.9826% exact / 9.1776% CER). It also withheld 24 unspaced phrase-boundary cases. No rule is promoted.
- The neural-teacher workflow is hypothesis generation only; source IPA differences remain unadjudicated.
- Exact lexical pronunciation entries preserve source URLs, confidence and rule notes.

Do not duplicate the existing morphology alignment helper, replace these safeguards with broad heuristics, or train on the synthetic adversarial corpus.

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

## Latest morphology diagnostic — 2026-10-31

Actions run [41248014188](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014188) verified real Kiwi and MeCab-Ko smoke jobs and pairwise boundary diagnostics. Artifact [13060536030](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014188/artifacts/13060536030) reports 80.5978% exact boundary-set agreement over 1,907 words. This measures how often two analyzers agree, not whether either is correct. A separate soft-rule alignment diagnostic found 217 common rule events, with 186 observed by both analyzers, 18 by neither, 8 Kiwi-only and 5 MeCab-only.

The consensus evaluation artifact [13060490661](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41248014274/artifacts/13060490661) reports 2,703 token occurrences and 1,907 unique Hangul words. It changed four unique words; one additional word (칡칡이) became resolved, but overall exact match did not improve and CER became slightly worse. All changed IPA remains diagnostic-only. This confirms the correct next step is reviewed rule-specific licensing, not blanket promotion of analyzer consensus.

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
