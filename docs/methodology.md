# Methodology

## Central principle

Korean orthography → Korean phonology → Korean phonological rules → Korean surface IPA → feature space → Ukrainian phonological candidate → Ukrainian phonetics → Ukrainian orthography.

The system must never collapse these layers into a direct character substitution.

## Evidence classes

FACT: directly supported by a cited normative, peer-reviewed or technical source.

MODEL ASSUMPTION: a computational choice required to make the system deterministic.

HEURISTIC: a parameterized engineering approximation, especially candidate-ranking weights.

EMPIRICAL RESULT: a result obtained from corpus/data validation.

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
