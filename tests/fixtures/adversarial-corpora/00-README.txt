KOREAN–UKRAINIAN PHONETIC SYSTEM
ADVERSARIAL TEXT CORPUS COLLECTION
Version: 2026-10-11

PURPOSE
-------
These are raw Korean text stress corpora, not gold-standard outputs. They do not prescribe
one Ukrainian transliteration or claim every sentence has a verified official pronunciation.
Use them to expose unresolved spans, context-sensitive behavior, segmentation problems, and
rule interactions.

COLLECTION SIZE
---------------
15 broad thematic corpora (01–15) plus 150 rule-family corpora:
30 test families × 5 separate TXT files = 150 additional files.
Total: 165 Korean TXT corpora, plus this index.

RULE-FAMILY CORPORA
-------------------
Each family has five files named rule-NN-01 through rule-NN-05. The 30 families cover:
general principles; consonant contrasts; vowel contrasts; ㅚ/ㅟ; ㅢ; vowel length; final
neutralization; simple codas; complex codas; ㄺ; 밟-; 넓-; liaison with particles; liaison
with endings; palatalization; nasalization; liquid assimilation; ㅎ and aspiration; coda-
conditioned fortition; morphological/lexical fortition; ㄴ insertion; insertion controls;
coda+ㄹ; complex coda+nasalization; connected speech; verb inflection; adjective inflection;
names and loanwords; chained rules; and negative controls.

The numeric IDs are collection group IDs, not a claim that every file maps one-to-one to
one numbered paragraph of the official regulation. Many examples intentionally test rule
interactions. Before promoting an example to a normative gold test, map it to the exact
provision and verify it against the National Institute of Korean Language.

ORIGINAL 15 CORPORA
-------------------
01-coda-liaison.txt — Coda + vowel-initial endings, particles, and connected text.
02-complex-codas.txt — Complex final consonants.
03-palatalization-boundaries.txt — Palatalization and morpheme boundaries.
04-nasal-liquid-assimilation.txt — Nasalization and liquid assimilation.
05-fortition.txt — Fortition/tensification and controls.
06-aspiration-and-h.txt — ㅎ and aspiration.
07-n-insertion.txt — ㄴ insertion and controls.
08-inflection-and-morphology.txt — Inflectional forms.
09-compounds-and-boundaries.txt — Compounds and boundary ambiguity.
10-numbers-names-loans.txt — Numbers, dates, names, and loanwords.
11-long-mixed-prose.txt — Longer mixed-rule prose.
12-minimal-contrasts-and-negative-controls.txt — Minimal contrasts.
13-rule-ordering-chains.txt — Rule-ordering chains.
14-orthography-spacing-punctuation.txt — Punctuation, spacing, symbols, and mixed scripts.
15-unknowns-and-proper-names.txt — Evidence-sensitive names and unknowns.

RECOMMENDED WORKFLOW
--------------------
1. Run every file through the same engine version and configuration.
2. Save source text, raw output, unresolved markers, and trace separately.
3. Compare isolated forms with the same forms in sentence context.
4. Triage by rule, morphology, lexical evidence, tokenization, or target-language mapping.
5. Verify Korean surface forms against the National Institute of Korean Language standard and
   authoritative lexical sources before treating a form as a gold oracle.
6. Keep Ukrainian target spelling provisional until its phonetic mapping has been reviewed.
7. Turn every confirmed defect into a minimal regression test and retain negative controls.

IMPORTANT
---------
A stress corpus is a discovery instrument, not proof of correctness. Some forms require
morphological or lexical evidence. An unresolved marker can be a correct safe failure; silently
producing an unsupported answer is not necessarily better. Do not use the Ukrainian approximation
as evidence that the Korean surface pronunciation is correct.
