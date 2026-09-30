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
