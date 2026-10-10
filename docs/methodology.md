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
