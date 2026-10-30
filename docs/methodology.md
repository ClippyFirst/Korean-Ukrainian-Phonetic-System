# Methodology

## Central principle

Korean orthography → Korean phonology → Korean phonological rules → Korean surface IPA → feature space → Ukrainian phonological candidate → Ukrainian phonetics → Ukrainian orthography.

The system must never collapse these layers into a direct character substitution.

## Runtime architecture: two browser engines, one IPA-first target adapter

The public browser service exposes two distinct pronunciation paths. They are not two labels for the same implementation.

| Public mode | Korean surface-pronunciation engine | Role and boundary |
|---|---|---|
| **Звичайний режим** | Locally bundled JavaScript port of g2pK, adapted from `ntdgo/korean-pronunciation 1.0.1` | Practical, high-coverage browser path. It uses the port's heuristic annotation and does not reproduce the original Python g2pK package's MeCab morphological analysis. |
| **Режим докладного аналізу** | The project's own deterministic **Kozak Kim** engine | Evidence-gated research path. It applies this repository's source-licensed phonological rules, exact lexical records, explicit uncertainty states, and inspectable IPA-to-Ukrainian trace. It does not call g2pK. |

Both paths converge on the same architectural boundary: Korean surface spelling → IPA representation → the project's IPA-to-Ukrainian adapter → Ukrainian practical orthography. Neither mode is permitted to generate the Ukrainian output by a parallel Hangul-to-Ukrainian character map.

The browser g2pK port is vendored under `src/vendor/g2pk/`; its application adapter is `src/app/g2pk_web.js`. The pinned port is called with `descriptive: false`, `verbose: false`, `groupVowels: false`, and `toSyl: true`. The port and its browser adaptation are attributed under Apache-2.0 in `public/THIRD_PARTY_NOTICES.txt` and `public/LICENSES/Apache-2.0.txt`. It runs locally in the browser without Python, MeCab, a server, or runtime network requests. A finite exact-form list may correct Korean surface forms only where an identified NIKL source directly supports the correction; raw vendored-port behavior remains separately testable, and corrections are not generalized to unseen words.

The Kozak Kim browser engine is implemented in `src/app/`: `engine.js` is its entry point; `engine_shared.js` handles Hangul structure and shared inventories; `engine_rules_ctx.js` handles within-word contextual rules; `engine_rules_phrase.js` handles a separate, restricted phrase-boundary pass; `engine_lexical.js` supplies exact lexical records; `engine_convert.js` coordinates the conversion; and `engine_ipa.js` owns IPA-to-Ukrainian mapping. The soft-mode policy is isolated in `soft_morphology.js`; Super-soft uncertainty brackets are a presentation annotation over the existing trace, not a change to IPA.

### The three Kozak Kim modes

- **Strict** is the default. It applies canonical correspondences, exact sourced lexical entries, and phonological rules only when the relevant environment is licensed. If the engine cannot establish a morphology-sensitive condition, it abstains or marks the target as unresolved/provisional rather than promoting a guess.
- **Soft** is an opt-in, limited hypothesis layer for a closed set of formal endings inside one Korean eojeol. It can cautiously extend selected formal liaison (R002), ㅎ deletion (R003), and palatalization (R007) patterns. It does not license substantive liaison under NIKL §15, R009/R010–R016, or transformations across whitespace. Such outputs carry low-confidence status.
- **Super-soft** is a separate opt-in maximum-coverage tier in the browser. It combines available Soft hypotheses with wider explicitly low-confidence practical fallbacks and, if needed, a typed orthographic-phonemic IPA fallback. For all 11,172 modern precomposed Hangul syllable blocks, it aims to provide an IPA or typed fallback and a Ukrainian candidate, with source spans accounted for in the trace. Low-confidence/provisional Ukrainian fragments are bracketed individually. Compatibility Jamo, decomposed Jamo, archaic Jamo, punctuation, and other non-syllable content are preserved literally rather than assigned invented pronunciations.

These are three policies within one native engine, not three separate engines. Super-soft's 100% coverage target is a software coverage contract for the defined modern Hangul syllable inventory; it is not a 100% pronunciation-accuracy claim. The browser UI exposes Strict, Soft, and Super-soft. Python CLI/API support is narrower and must not be assumed to have Super-soft parity.

**Canonical researcher-facing explanation:** [the service methodology page](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#methodology-02c-kozak-kim), with [ordinary-mode g2pK details](https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/system.html#methodology-02a).

## Comparative measurements and their scope (latest diagnostic run: 2026-10-29)

The 2026-10-24 values in the historical benchmark review below are retained for traceability, but they are superseded for current interpretation by the expanded, corrected broad-IPA run in PR [#371](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/371), workflow [40843579685](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40843579685), at benchmark-branch commit `a10e2bb7ea9b636a816f13c972589fd0d8e505ec). The report is [EXTENDED-BENCHMARK-METRICS-2026-10-29.md](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/blob/bench/extended-metrics-runtime-2026-10-29/docs/EXTENDED-BENCHMARK-METRICS-2026-10-29.md).

This is a diagnostic comparison of Korean IPA outputs against two public paired datasets. It is not a normative NIKL gold evaluation and does not score the IPA-to-Ukrainian adapter.

### Native Kozak Kim vs g2pK 0.9.4

| Dataset | Engine | Coverage | Exact match | Coverage-adjusted exact | CER | PER | Feature-weighted proxy |
|---|---|---:|---:|---:|---:|---:|---:|
| UGTPHON | ClippyFirst native | 99.815% (2,698/2,703) | 53.002% | 52.904% | 9.170% | 9.614% | 4.877% |
| UGTPHON | g2pK 0.9.4 | 100% (2,703/2,703) | 53.089% | 53.089% | 9.229% | 9.647% | 4.895% |
| SIGMORPHON | ClippyFirst native | 99.900% (998/999) | 35.772% | 35.736% | 14.698% | 16.234% | 7.549% |
| SIGMORPHON | g2pK 0.9.4 | 100% (999/999) | 35.335% | 35.335% | 14.822% | 16.313% | 7.599% |

The paired comparison is more informative than comparing percentages with different denominators:

- **UGTPHON:** on 2,698 shared scored occurrences, g2pK minus native exact-match delta is +0.1112 percentage points (95% row-cluster bootstrap CI −0.0371…+0.2988); CER delta is +0.0607 points (CI −0.0084…+0.1383). Both intervals cross zero. The measured exact-match and CER differences do not establish a statistically clear winner.
- **SIGMORPHON:** on 998 shared scored occurrences, g2pK minus native exact-match delta is −0.4008 percentage points (95% CI −0.8016…−0.1002), favouring native on exact match for this split. CER delta is +0.1128 points (CI −0.0126…+0.2771), crossing zero. The exact-match result is a small, dataset-specific native advantage, not universal superiority.

The updated run adds segment-based PER and a **project-defined feature-weighted phonological error-rate proxy**. The latter is not a universally standardized metric; unsupported-feature counts must accompany it (native: 1,004 on UGTPHON and 476 on SIGMORPHON). The run also records coverage-adjusted exact match, abstentions, paired deltas, and timing. No single metric should be used as a standalone ranking.

### Measured runtime under the benchmark harness

For UGTPHON, five repeated unique-word timing samples gave a native median of **366.002 ms** (range 358.042–391.706 ms) and a g2pK median of **17,412.489 ms** (range 17,250.866–17,644.237 ms), approximately **47.6× lower elapsed time** for the native implementation under this particular harness. The measured scope includes Python adapter overhead and excludes corpus loading/scoring. This is a reproducible engineering result for that run configuration, not a universal speed claim across machines, languages, or browser execution.

On SIGMORPHON, the recorded pass took 155.475 ms for native and 9,359.415 ms for g2pK (unique-word calls, including Python adapter overhead; corpus loading/scoring excluded). Treat this as a measured run-level diagnostic; do not extrapolate it to all environments. Batch engines and neural cold-start timings are not directly comparable with in-process per-word calls.

### CharsiuG2P: a strong research result that must remain qualified

The separate comparative-only CharsiuG2P job in run [40843579685](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40843579685) completed and produced these observed scores:

| Dataset | Exact match | CER | PER | Feature proxy | Coverage |
|---|---:|---:|---:|---:|---:|
| UGTPHON (2,703 occurrences) | **88.531%** (2,393/2,703) | 3.624% | 3.356% | 2.399% | 100% |
| SIGMORPHON (999 occurrences) | **70.971%** (709/999) | 5.408% | 5.582% | 2.136% | 100% |

These are materially higher reference-match scores than the deterministic native baseline in this particular experiment. They must be reported, not hidden. They are **not yet independent generalization evidence**: the public Charsiu training inventory intersects 508 unique UGTPHON test forms and 729 of 999 SIGMORPHON forms; the checkpoint's full training manifest is unavailable, so this does not prove that every intersecting form was used in training, but contamination cannot be ruled out. The model's output IPA convention is not independently specified, and the checkpoint weights' license is unresolved. The model was run once with cold model load plus batched inference; neural repeatability was not measured. Therefore CharsiuG2P is a strong research teacher/baseline, not an automatically correct gold oracle or production dependency.

The separate licensed `willwade/byt5-g2p-multilingual-tiny` experiment returned zero exact matches and CER above 100% under the tested `<kor>:` prefix/output contract. This is a failed candidate **in that configuration**, not a general verdict on ByT5 architectures.

### Workflow and verification status

Run 40843579685 used benchmark head `a10e2bb7ea9b636a816f13c972589fd0d8e505ec`. Its pinned multi-engine IPA job and separate neural inference jobs completed, but the final pairing/aggregation job failed because the baseline report lacked `per_engine_occurrences`. This producer/consumer schema defect has since been fixed separately in PR [#399](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/399): the baseline now emits a complete ordered occurrence ledger for every engine, with explicit scored/abstained/error/missing states, and CI validates the ledger schema. Exact-head run [41123471367](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41123471367) successfully generated and validated ledgers for 2,703 UGTPHON and 999 SIGMORPHON occurrences across six engines. The neural inference and joined neural-pairing jobs were **SKIPPED** on this general PR because they remain opt-in/research-branch-only; therefore no fresh combined neural comparison is claimed. PR #371 itself remains open, divergent from current `main` and unmerged. Its results remain inspectable research evidence, not an implementation already integrated into production `main`.

### What these measurements do not establish

- No independently adjudicated, representative NIKL holdout currently establishes absolute Korean pronunciation accuracy or per-rule accuracy.
- Neither public dataset is a normative standard-pronunciation gold corpus; reference conventions and noise matter.
- No independently approved IPA-to-Ukrainian gold set exists, so these IPA scores do not measure Ukrainian target accuracy, readability, or user preference.
- Passing regression tests establish conformance to declared fixtures/contracts, not independent linguistic correctness.
- Full Hangul syllable-inventory software coverage is not lexical, morphological, or pronunciation accuracy.
- The feature-weighted proxy is project-defined and partly constrained by unsupported feature inventories.
- The Charsiu checkpoint's training overlap and weights-license status remain unresolved; do not redistribute its weights or claim leakage-free generalization.

## Evidence classes

FACT: directly supported by a cited normative, peer-reviewed or technical source.

MODEL ASSUMPTION: a computational choice required to make the system deterministic.

HEURISTIC: a parameterized engineering approximation, especially candidate-ranking weights.

EMPIRICAL RESULT: a result obtained from a pinned corpus/run with declared denominator and metric.

INDEPENDENTLY VALIDATED RESULT: an empirical result checked against a separately adjudicated, representative gold set by qualified reviewers. The current public IPA benchmark results do not meet this stronger category.

UNRESOLVED: a question for which sources support competing analyses or the available evidence is insufficient.



## Candidate ranking

Candidate score is a cost function, not a probability. Feature mismatch weights are model parameters. Context, phonotactics and orthographic legality are separate penalties so a reviewer can inspect why a candidate ranked where it did.

## Generated vs observed sets

The 11,172 Hangul blocks are generated Unicode combinations. They must not be reported as lexical attestations. Lexical/corpus coverage is a separate future dataset.

## Uncertainty

Alternative vowel realizations and contemporary Seoul stop cue change are represented explicitly. A single preferred output is therefore always contextual to the selected analysis and rule ordering.


## Korean ㅎ → Ukrainian practical target

The browser's primary practical model currently maps onset ㅎ, whose broad Korean phonetic basis is voiceless glottal [h], to Ukrainian **г** [ɦ]. This is a project-level approximation, not a claim that the phones are identical and not an inherited transcription convention. The choice preserves glottal place of articulation while sacrificing the Korean segment's voicelessness; Ukrainian **х** [x] would preserve voicelessness but shift the place of articulation toward the velar region. Neither candidate is a perfect match. The choice should be evaluated through controlled reader-production tests and, if available, acoustic comparison—not justified by Latin-letter substitution alone.

This onset mapping does not override Korean phonological rules: when ㅎ deletes, triggers aspiration, or participates in a coda process, the Korean surface form must be determined first. Only then is the resulting surface segment mapped into Ukrainian. The coda entry ㅎ and the onset entry ㅎ therefore remain separate analyses.


## Sentence-level adversarial validation

The regression corpus at `tests/fixtures/adversarial-sentence-corpus.txt` covers several interacting processes in running text: ㄼ resyllabification in `짧아도`, coda neutralization and fortition in `빗고`, the morphology-sensitive reading of `넓지만`, licensed particle-`의` variants, and the contracted past-tense form `설명했어요`. Expected Korean surface forms and Ukrainian target strings are tested separately.

The corpus is an engineering regression set, not a representative frequency corpus. Its Ukrainian outputs are marked provisional. Passing the tests establishes that the implementation reproduces declared decisions and avoids unresolved placeholders in these cases; it does not establish that the chosen Ukrainian approximations are optimal or that all possible contexts have been covered. Future evaluation should include independent Korean phonetics review and Ukrainian-reader production/perception testing.


## Third sentence-level adversarial window

The third corpus is based on a user-supplied running text and adds further controls for complex codas and liaison (`흙을`, `밟으며`, `낡은`, `맑은`), ㅎ deletion (`놓인`), coda neutralization/fortition/liaison (`햇빛이`), and lateralization/nasalization (`신라`, `설날`, `독립문`, `종로`). The browser-facing page labels these as Korean surface-form controls. Only forms with an explicit lexical row are asserted against the runtime in the current regression test; unencoded examples remain audit targets rather than silently being treated as validated engine behavior. Passing tests do not validate the Ukrainian target through independent reader testing.


## Model-wide Ukrainian-target consistency audit

A review of the lexical layer found two different defects that must not be conflated with Korean pronunciation errors: (1) Ukrainian target syllables sometimes duplicated the segmental coda by moving it into the next target syllable, and (2) some target strings encoded Korean fortisness as doubled Ukrainian onset letters despite the project's stated neutralization policy. The same pass corrected several clear word-initial lenis/affricate targets and updated contextual IPA where it contradicted the model's stated realization. Regression coverage lives in `tests/model-wide-target-consistency.test.mjs`. The corrections preserve source-backed Korean surface forms and leave Ukrainian targets provisional; no test pass is evidence of reader-tested transcription quality.


The same audit also enforces the declared coda-`ㄹ` target `л` (not `ль`), context-sensitive `ㅢ` readings, and the special `ㅅ/ㅆ + ㅣ` target `ш`. It fixes duplicated or shifted consonants in the target syllable array without changing the verified Korean surface form. Context-dependent Ukrainian spellings for glides remain graphemic model decisions rather than universal Korean facts.

A second corpus-wide pass found three remaining lexical entries that still wrote Korean coda [l] with Ukrainian `ль` (`얇실하다`, `짧다`, `읽거든`), plus `넓습니다`, where doubled `сс` encoded Korean fortisness contrary to the declared practical-target policy. These targets are now `ял|шіл|га|да`, `чал|та`, `іл|ко|ден`, and `нол|сим|ни|да`, respectively. The hard-lateral regression list and fortis-neutralization checks now cover these missed cases as well.

A full aligned-syllable coda scan then found `밭이랑`, whose Korean surface is `반니랑` [pan ni ɾaŋ] but whose Ukrainian target still followed the written coda of `밭` and the IPA spelling of [ŋ]. Its target is corrected from `пат|ні|ранґ` to `пан|ні|ран`. A corpus-wide regression now checks each aligned syllable's final IPA coda against the declared Ukrainian target (`к/т/п/н/м/л`) so similar surface-vs-orthography drift is caught earlier.

A subsequent onset-alignment pass found several lexical targets that disagreed with the project's contextual onset model: initial ㄷ/ㅂ/ㅈ in `들일`, `불여우`, `지식의`, and `집안일`; intervocalic ㅈ in `넓어졌다는`; intervocalic ㄷ in `할지라도`; and onset ㅎ in `휘발유`. These targets now follow their aligned surface IPA and the declared Ukrainian mappings. The source-attested IPA for `값있다` was also corrected from `p` to contextual `b` in the second syllable, matching its between-vowels realization and the practical target `б`. These are narrow lexical corrections, not a claim that a simple grapheme-to-phoneme rule can replace lexical evidence. The lexical corpus now also has an automated onset-alignment guard for the declared practical mappings, including the deliberate `ㅅ/ㅆ + ㅣ → ш` exception; this helps distinguish true mismatches from that documented model choice.


## Consistency of the Ukrainian target for coda ㅇ

The current practical model maps Korean coda [ŋ] to Ukrainian **н** as an explicit approximation; it does not append **г** to imitate the Latin/IPA spelling *ng*. This decision applies equally to canonical conversion and exact lexical overrides. A corpus audit corrected `국민`, `박물관`, `한국말`, `국립국어원`, and `국립국어원에서`; the regression test checks every aligned target/IPA syllable in the lexical table for this specific inconsistency. The Korean IPA remains [ŋ] where source evidence supports it—the repair changes only the Ukrainian target, not the Korean pronunciation analysis.


## Phrase boundaries when a lexical override is present

The browser resolves exact sourced lexical entries at word level. This must not accidentally disable a separately licensed phrase-level rule in the adjacent word. In particular, NIKL §18 nasal assimilation across plain whitespace is re-applied to the preceding word's final coda when a following word begins with ㄴ/ㅁ, even if that following word uses an exact lexical override. Punctuation remains a hard boundary for this pass. Regression coverage includes `밥 먹는다`, `밥 문법`, and the punctuation contrast `밥, 문법`. This boundary repair is limited to the explicitly supported nasal-assimilation environment; it is not a general morphological parser.


## Liquid-to-nasal assimilation after the representative ㄷ coda

The surface representative ㄷ must be included alongside ㄱ and ㅂ when a following ㄹ is realized as ㄴ; the coda then participates in nasal assimilation as well. This includes written codas such as ㅅ/ㅈ/ㅊ after neutralization. The browser regression `몇 리` guards the [면니]-type sequence across a phrase boundary. The rule is about the Korean surface sequence; Ukrainian output remains a project-specific approximation.


Phrase-boundary liquid assimilation is also preserved when any exact lexical entry causes word-level conversion: `신 라면 문법` exercises ㄴ+ㄹ → ㄹㄹ, while `칼 날 문법` exercises ㄹ+ㄴ → ㄹㄹ. The repair changes only the affected edge segments and records the rule on both neighbouring trace rows. It does not cross punctuation and does not infer morphology-dependent liaison or palatalization.


### Composition of consecutive phrase-boundary rules

The regression suite also checks chains of adjacent word-boundary changes, not only isolated pairs. In `국 립 문법`, the boundary `ㄱ + ㄹ` first yields the liquid-to-nasal pattern and nasalizes the coda, then `ㅂ + ㅁ` at the next boundary nasalizes independently. In `몇 리 문법`, the representative coda of ㅊ is ㄷ; the test verifies the ㄷ + ㄹ sequence and confirms that a later lexical override in the same phrase does not bypass the boundary pass. These are regression examples for rule composition, not claims that arbitrary orthographic adjacency establishes every morphophonemic rule.


## Phrase-boundary assimilation: normative rule vs runtime heuristic

NIKL Standard Pronunciation Rules §18 explicitly extends nasal assimilation to two words pronounced together as one utterance. The normative condition is connected-phrase pronunciation, not the mere presence of a whitespace character. The browser engine currently uses plain whitespace as a deterministic proxy for that prosodic condition and blocks the rule at punctuation. This is an engineering heuristic, not a claim that every whitespace-separated pair must undergo assimilation.

Consequences for interpretation and evaluation:

- Treat phrase-boundary nasal/liquid changes as context-dependent predictions, not guaranteed readings for every written sentence.
- Preserve the distinction between the cited Korean surface rule and the browser's simplified phrase-link detection.
- A future interface should let users choose connected-phrase mode or provide prosodic/phrase-boundary information instead of inferring it silently.
- Regression tests can verify the deterministic implementation, but cannot establish the intended prosodic grouping of arbitrary user text.

Normative source: National Institute of Korean Language, *한국어 어문 규범 — 표준 발음법 제18항*, including the note that the rule also applies when two words are pronounced together as one utterance: https://korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002#a402
