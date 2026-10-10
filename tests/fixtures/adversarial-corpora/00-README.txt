KOREAN–UKRAINIAN PHONETIC SYSTEM
ADVERSARIAL TEXT CORPUS COLLECTION
Version: 2026-10-11

PURPOSE
-------
These are raw Korean text stress corpora for testing the system. They are deliberately
not gold-standard output files: they do not prescribe a single Ukrainian transliteration
or claim that every sentence has a verified official pronunciation. Use them to expose
unresolved spans, context-sensitive behavior, segmentation problems, and rule interactions.

FILES
-----
01-coda-liaison.txt
  Coda + vowel-initial endings, particles, and ordinary connected text.
02-complex-codas.txt
  ㄺ, ㄼ, ㄵ, ㄶ, ㅀ and other complex-coda environments.
03-palatalization-boundaries.txt
  Palatalization, formal morpheme boundaries, and superficially similar controls.
04-nasal-liquid-assimilation.txt
  Nasalization, liquid assimilation, compounds, and multi-rule contexts.
05-fortition.txt
  Fortition/tensification with lexical and syntactic controls.
06-aspiration-and-h.txt
  ㅎ, aspiration, complex-coda interactions, and inflectional forms.
07-n-insertion.txt
  Potential ㄴ insertion, compounds, and boundary-sensitive controls.
08-inflection-and-morphology.txt
  Verb/adjective stems, endings, and related inflected forms.
09-compounds-and-boundaries.txt
  Compounds, 사이시옷-like environments, and morpheme-boundary ambiguity.
10-numbers-names-loans.txt
  Numbers, dates, acronyms, proper names, and loanwords.
11-long-mixed-prose.txt
  Longer continuous prose mixing multiple rule classes.
12-minimal-contrasts-and-negative-controls.txt
  Contrastive forms designed to catch overgeneralization.
13-rule-ordering-chains.txt
  Sequences where one rule may change the environment for another.
14-orthography-spacing-punctuation.txt
  Quotes, punctuation, spaces, symbols, jamo, and mixed-script input.
15-unknowns-and-proper-names.txt
  Evidence boundaries and cases where a confident guess is not justified.

RECOMMENDED WORKFLOW
--------------------
1. Run every file through the same engine version and configuration.
2. Save the untouched source text, raw output, unresolved-marker list, and trace separately.
3. Compare isolated forms with the same forms in sentence context.
4. Triage each issue by rule, morphology, lexical evidence, tokenization, or target-language mapping.
5. Verify Korean surface forms against the National Institute of Korean Language standard and
   authoritative lexical sources before treating a form as a gold oracle.
6. Keep Ukrainian target spelling provisional until its phonetic mapping has been reviewed.
7. Turn every confirmed defect into a minimal regression test and retain negative controls.

IMPORTANT
---------
A stress corpus is a discovery instrument, not proof of correctness. Some forms intentionally
require morphological or lexical evidence. An unresolved marker can be a correct safe failure;
silently producing an unsupported answer is not necessarily better. Do not use the Ukrainian
approximation as evidence that the Korean surface pronunciation is correct.
