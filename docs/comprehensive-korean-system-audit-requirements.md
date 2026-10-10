# Comprehensive Korean-System Audit Requirements

**Document type:** audit specification and release gate  
**Scope:** Korean orthography → standard pronunciation analysis → phonological surface form → IPA representation → Ukrainian practical transcription → explanation, trace and browser presentation.  
**Normative baseline:** the current official *한국어 어문 규범 — 표준 발음법* published by the National Institute of Korean Language (NIKL), supplemented by NIKL explanatory materials and primary lexical sources.  
**Status:** requirements for a future audit; this document does not claim that every requirement has already been tested or passed.

## 1. Purpose and audit principles

The audit must establish whether the system produces outputs that are (a) supported by Korean pronunciation evidence, (b) internally consistent, (c) transparent about uncertainty, and (d) faithful to the project's explicitly defined Ukrainian transcription policy.

The audit must not collapse the following into one judgement:

1. **Korean standard pronunciation:** the expected Korean surface form under a specified context.
2. **Phonetic/phonological representation:** the IPA or broad phonetic analysis used by this project.
3. **Ukrainian target:** a practical graphemic approximation chosen for Ukrainian readers.
4. **Evidence and confidence:** what is sourced, what is inferred, and what remains provisional.
5. **Runtime behavior:** what the engine actually does for a given input.
6. **Explanation and trace:** whether the interface accurately describes the transformations that actually occurred.

A plausible Ukrainian-looking output is not evidence that the Korean analysis is correct. An accurate Korean surface form does not by itself validate the Ukrainian target. Passing a regression test proves conformance to that fixture, not universal linguistic correctness.

## 2. Evidence hierarchy and provenance

### 2.1 Source priority

For each rule or lexical claim, record the most authoritative available evidence in this order:

1. Current NIKL Standard Pronunciation Rules and official amendments/notes.
2. NIKL's official pronunciation dictionary, online Q&A, and explanatory publications relevant to the exact form.
3. A reputable Korean dictionary or reference grammar where the official rules do not settle the question.
4. Peer-reviewed phonetic/phonological research for questions requiring experimental or theoretical evidence.
5. Secondary references, used as leads or corroboration rather than silent replacements for official sources.
6. Project inference, clearly labelled as such.

Russian, English, or other language transcription conventions may be comparators; they must not be treated as authority for Ukrainian outputs or as substitutes for Korean phonological evidence.

### 2.2 Provenance fields

Every normative rule and every sourced lexical exception must, where applicable, identify:

- stable rule/record identifier;
- exact input form and relevant context;
- normative surface Hangul;
- IPA value and the level of representation it claims;
- Ukrainian target, explicitly marked as standard, project-selected, provisional, or unresolved;
- source title, publisher, URL, and the relevant article/section or dictionary entry;
- access/check date for mutable web sources;
- a concise explanation of why the source supports the specific claim;
- confidence/evidence class and any unresolved disagreement; define exactly what the confidence field measures (source reliability, Korean surface-form certainty, Ukrainian-target confidence, or another dimension) rather than letting one label imply all of them;
- tests that cover the claim.

A URL alone is insufficient if it does not identify the relevant claim. Never invent quotations, source details, dictionary attestations, or confidence.

### 2.3 Source-change control

When an official source changes or a cited page is unavailable, do not silently rewrite expected outputs. Record the change, compare old and new wording, identify affected rules and examples, then update fixtures and implementation only after review.

## 3. Inventory and coverage audit

Create a machine-readable inventory of all relevant rules in the current NIKL Standard Pronunciation Rules. Verify rule numbering, wording, notes, exceptions, and cross-references against the current official source; do not rely on memory or an old summary.

The inventory must include, at minimum, audit coverage for:

- phoneme inventories and basic syllable structure;
- coda neutralization and representative-coda selection;
- liaison/resyllabification and complex codas;
- nasal assimilation;
- liquid assimilation and liquid-to-nasal changes;
- fortition/tensification;
- aspiration and ㅎ-related interactions;
- palatalization and its morphological conditions;
- ㄴ insertion and related interactions;
- vowel rules, including ㅢ and permitted context-dependent readings;
- lexicalized or exception forms;
- compound/derived words and morpheme-boundary conditions;
- connected speech and phrase-boundary effects;
- loanwords, proper names, abbreviations, numerals, foreign text, punctuation and mixed-script input as separate scope decisions.

This list is a coverage checklist, not a claim that every item has the same scope or conditions under every article. Each applicable article must be mapped to its actual rule, conditions, exceptions, source and tests.

For each rule, document: **trigger → required context → transformation → ordering/interactions → exceptions → evidence → implementation location → tests → known limitations**.

## 4. Input parsing and orthographic integrity

Verify the parser with:

- all modern Hangul syllable combinations, including legal onset/vowel/coda combinations;
- standalone compatibility jamo and conjoining jamo, explicitly defined as supported, unsupported, or literal;
- precomposed Hangul syllables mixed with Latin letters, digits, spaces and punctuation;
- repeated and leading/trailing whitespace, tabs and line breaks;
- punctuation between words, including commas, sentence-final marks, brackets, quotation marks and dashes;
- empty input and very long input;
- decomposed Unicode sequences and normalization differences;
- unsupported or archaic Hangul and malformed sequences.

Required properties:

- no source character is silently dropped or reordered;
- literal text is preserved exactly unless the documented interface says otherwise;
- punctuation creates a rule boundary where the specification requires it;
- the UI and engine agree on what constitutes a word, eojeol, phrase boundary and non-Hangul segment;
- normalization, if used, is explicit and tested;
- unsupported input is handled deterministically and transparently.

## 5. Phonological rule engine

### 5.1 Conditions, not string adjacency alone

For every implemented rule, check that the engine verifies all required conditions, including morphology, lexical identity, syllable structure and phrase context where relevant. Orthographic adjacency must not be used as proof of a morpheme boundary or a lexical reading if the normative rule requires more evidence.

Where the engine cannot infer the required condition, it must either:
- use an exact, sourced lexical entry;
- expose a clearly labelled, user-selectable assumption/reading mode; or
- return a useful unresolved result.

Do not silently choose one morphological analysis for an unknown word when multiple standard pronunciations are possible.

### 5.2 Rule ordering and composition

Audit each pair and important sequence of interacting rules. In particular, test whether:

- an earlier change creates or removes the environment for a later rule;
- the implementation uses original orthographic features where the rule requires them, and surface features where required;
- one rule is applied twice accidentally;
- the ordering is supported by the official rule or source;
- a lexical override bypasses unrelated rules that should still apply;
- a general rule overwrites a specific, sourced lexical pronunciation;
- a later pass leaves stale intermediate data in the result or trace.

Create a rule-interaction matrix. Each interaction must be classified as **required**, **forbidden**, **context-dependent**, or **not applicable**, with evidence and tests. Do not infer an interaction merely because two rules can be placed next to one another in code.

### 5.3 Phrase-boundary behavior

The implementation's whitespace-based phrase linking is a heuristic, not proof that two written words are pronounced as one utterance. The audit must separately evaluate:

- connected-phrase mode;
- isolated-word mode;
- punctuation-separated words;
- multiple spaces and line breaks;
- lexical overrides on either side of the boundary;
- chains of three or more words;
- cases where a rule changes the coda and a later rule uses that new surface coda.

The UI must disclose the chosen assumption. A future mode selector or explicit phrase-boundary annotation is preferable to silently presenting every whitespace-separated pair as one connected phrase.

## 6. Lexicon and exceptions

Audit the complete lexical dataset, not just a hand-picked sample.

For every record, check:

- unique and correctly normalized input key;
- valid CSV quoting and all required columns; omitted trailing optional fields are acceptable only when the parser explicitly fills them with empty values and the data contract documents that convention;
- complete syllable segmentation;
- equal and sensible counts of Hangul syllables, Ukrainian target syllables and IPA syllable units where that record format requires alignment;
- surface Hangul agrees with the cited pronunciation;
- all alternates are explicitly represented and explained;
- the source supports the exact lexical form, not merely a nearby rule;
- provisional Ukrainian targets are not misrepresented as official Korean facts;
- lexical priority is intentional and documented;
- duplicate, near-duplicate, conflicting and obsolete records are identified;
- exceptions do not conceal general-engine defects.

Run both forward checks (input → record → output) and reverse integrity checks (every record is reachable, valid and covered by tests). Produce a report of unreferenced records, duplicate keys, conflicting entries and records with missing or weak provenance.

## 7. IPA validation

Define the IPA policy before scoring individual outputs. State whether the project uses broad phonemic, broad phonetic, or mixed/analytical IPA, and document how that policy handles predictable allophony, aspiration, fortisness, voicing, length, syllable boundaries and connected speech.

For each test case, verify that:

- IPA corresponds to the intended Korean surface form;
- IPA and Ukrainian target describe the same selected reading;
- coda symbols and boundary notation are used consistently;
- changes are reflected in both the aggregate IPA and per-syllable trace;
- the same symbol is not used for incompatible values without explanation;
- long vowels, aspiration, fortisness, affricates, lateral/tap realizations and vowel variants follow the documented policy;
- separators are meaningful and not mistaken for phonological boundaries;
- IPA differences that are legitimate variation are not incorrectly marked as errors.

Do not compare strings mechanically where multiple IPA conventions are acceptable; require an explicit normalization policy and expert-reviewed expected values.

## 8. Ukrainian practical transcription audit

Treat Ukrainian output as a designed target system, not a direct copy of IPA or a Russian transliteration standard.

The audit must test:

- one-to-many and many-to-one correspondences;
- consonant onset vs coda behavior;
- positional variants and contextual allophones;
- representation of Korean contrasts that Ukrainian orthography does not preserve;
- syllable boundaries and word boundaries;
- avoidance of accidental Ukrainian words or misleading clusters where relevant;
- consistent treatment of aspiration, fortisness, palatalization, affricates, ㅅ/ㅆ, ㄹ, ㅇ and ㅢ;
- proper names and lexical exceptions;
- readable output for Ukrainian users without claiming a contrast is preserved when it is not.

Every mapping decision must be labelled as normative Korean analysis, phonetic approximation, or project-specific Ukrainian convention. Any deliberate information loss must be documented.

## 9. Trace, explanations and internal consistency

For every conversion, compare the aggregate result with the per-unit trace.

Required invariants:

1. Concatenating trace outputs, under the documented literal/spacing rules, reproduces the aggregate Ukrainian output exactly.
2. Combining trace IPA units with the documented separator policy reproduces the aggregate IPA exactly.
3. A trace rule is present only when its transformation was applied, or when it is explicitly labelled as a blocked/unresolved condition rather than a completed transformation.
4. If a transformation fails because the expected old target is absent, the trace must not claim a successful rewrite.
5. Lexical and contextual rule labels are distinguished; a lexical lookup must not be presented as a general rule derivation.
6. The displayed source, surface Hangul, analysis, Ukrainian output, IPA, variants, status and issues refer to the same selected reading.
7. No stale trace entry survives after later transformations change the aggregate result.
8. Status values (canonical, contextual, lexical, lexical-review, unresolved, or any current alternatives) have documented, mutually intelligible meanings.

Specific code-review target: the functions rewriteCoda and rewriteOnset in src/app/engine.js currently have branches that conditionally rewrite strings but add the rule to a trace without proving that the corresponding output string was changed. Audit whether this creates false-positive traces with real lexicon records. Add a minimal regression fixture for every confirmed case before modifying behavior. Consider separately whether Ukrainian and IPA rewrites both succeeded; do not silently equate success in one representation with success in the other.

## 10. Test strategy

### 10.1 Unit tests

Cover decomposition, mapping lookup, CSV parsing, boundary detection, each individual phonological rule, each output mapping, trace construction, status selection and error handling.

### 10.2 Normative examples

Every relevant official example should be represented in a fixture with source citation, input, expected standard surface form, expected IPA policy, expected Ukrainian target and a note explaining the target's evidence class. Where the Ukrainian target is still provisional, the test must not imply it is officially prescribed.

### 10.3 Contrastive and adversarial pairs

For every rule, construct minimally contrasting cases:
- trigger present vs absent;
- licensed morphology vs unknown morphology;
- lexical exception vs productive pattern;
- connected phrase vs punctuation boundary;
- isolated word vs sentence context;
- one rule vs interacting rule sequence;
- standard form vs permitted variant;
- supported Hangul vs malformed/unsupported input.

### 10.4 Property and metamorphic tests

Where applicable, test:
- determinism across repeated runs;
- preservation of literal substrings and punctuation;
- no unexplained loss of source units;
- aggregate output/trace equality;
- consistent output for equivalent normalized inputs if normalization is part of the contract;
- unrelated changes elsewhere in a sentence do not mutate a token's reading unless the context rule licenses it;
- phrase rules never cross a forbidden punctuation boundary;
- lexical record ordering does not change the result.

Property tests must not encode a linguistically false assumption just because it is convenient to automate.

### 10.5 Regression discipline

Every confirmed bug needs:
1. a minimal failing input;
2. a source-grounded expected result;
3. a test that fails before the fix;
4. the smallest justified code change;
5. a test that passes after the fix;
6. a check for collateral changes to related cases;
7. a note in the audit ledger.

A green test suite is necessary but not sufficient: fixture quality and source correctness must also be reviewed.

## 11. Sentence-level and real-use evaluation

Evaluate more than isolated syllables and dictionary examples. Build a versioned corpus spanning:

- short phrases and longer natural sentences;
- different speech styles and grammatical constructions;
- particles, endings, compounds and derived words;
- proper names, place names and common loanwords;
- multiple phonological processes in the same sentence;
- punctuation, quotations, lists and paragraph boundaries;
- inputs with and without lexical coverage;
- cases where the system should abstain rather than guess.

Each corpus item must separate the Korean reference reading from the Ukrainian target judgement. Track error classes, severity, evidence quality and confidence. Publish a reproducible sample and disclose selection bias; do not present a curated adversarial set as representative of all Korean text.

## 12. User interface and accessibility

Audit both service and methodology pages for:

- visible distinction between Korean input, surface form, IPA, Ukrainian output and explanation;
- clear labelling of variants and provisional outputs;
- useful unresolved messages that say what evidence is missing;
- source links near the claims they support;
- no implication that the tool translates meaning;
- no implication that the Ukrainian output is a unique official standard;
- keyboard-only operation, visible focus, semantic labels and screen-reader-friendly results;
- responsive behavior at narrow mobile widths and high zoom;
- readable IPA fonts and correct Unicode rendering;
- copy/paste behavior that preserves intended text;
- useful empty, loading, error and very-long-input states;
- no reliance on colour alone to distinguish confidence or status;
- performance acceptable for long inputs, with bounded work and no UI lockups.

Use real assistive-technology and browser checks where available; static inspection alone must not be described as a full accessibility audit.

## 13. Data quality, build and security

Validate all structured datasets for encoding, schema drift, duplicate keys, malformed rows, missing source fields and inconsistent identifiers. Confirm the application consumes the intended dataset files and that published data match the reviewed revision.

Release validation must include, in the project's supported Node version:

- npm run check:release (the current script runs tests and then the production build);
- review of all test output and build warnings;
- a clean checkout/build, not only a developer's existing working directory;
- browser smoke tests for service and system pages;
- validation of GitHub Pages paths, anchors, source links and assets;
- inspection of the generated output and console errors;
- a check that no private keys, tokens or unintended user data are committed.

Record the exact commit SHA, runtime version, commands, exit codes and any skipped checks. “CI unavailable” and “tests not run” must remain distinct from “tests passed.”

## 14. Severity and reporting

Classify findings:

- **P0 — release blocker:** fabricated or materially wrong normative claim; corrupted input/output; broad systematic mis-transcription; unsafe or misleading certainty.
- **P1 — high:** incorrect standard surface form, major rule-order error, systematic IPA/target mismatch, false trace that materially misleads users.
- **P2 — moderate:** isolated transcription defect, missing important exception, incomplete source provenance, confusing unresolved behavior.
- **P3 — low:** wording, navigation, minor display or documentation inconsistency.

Each finding must contain: ID, severity, exact input, observed result, expected result, source/evidence, affected files/data, root cause, proposed fix, regression test, confidence and verification status.

Distinguish **confirmed defect**, **probable defect**, **coverage gap**, **design trade-off**, and **unverified hypothesis**. Never report a hypothesis as a confirmed bug.

## 15. Deliverables for a complete audit

The audit is complete only when it produces:

1. a rule-by-rule normative coverage matrix;
2. a full lexical-dataset quality/provenance report;
3. a rule-interaction matrix;
4. a trace/output consistency report;
5. an IPA consistency report;
6. a Ukrainian-target policy and consistency report;
7. a sentence-level adversarial corpus with reviewed references;
8. a reproducible test/build log tied to a commit SHA;
9. a prioritized findings ledger with evidence and regression tests;
10. a list of known limitations and unsupported inputs;
11. a user-facing methodology update that matches actual implementation;
12. a final release recommendation: pass, conditional pass, or fail, with explicit unresolved blockers.

## 16. Exit criteria

Do not declare the system fully audited until all of the following are true:

- all applicable official rules have been inventoried and mapped to implementation/tests or explicitly documented as out of scope;
- all P0 and P1 findings are fixed or explicitly block release;
- no unexplained aggregate-output/trace mismatch remains;
- lexical records have passed schema, provenance and conflict checks;
- normative Korean references are reviewed independently of Ukrainian target choices;
- every provisional target and unresolved case is labelled accurately;
- the full release command succeeds in a supported environment, with evidence recorded;
- browser smoke tests cover both published pages;
- residual risks, missing expert review and limitations are disclosed.

A complete audit may conclude that some cases cannot be resolved automatically. Correct abstention and transparent uncertainty are acceptable outcomes; unsupported certainty is not.
