---
name: nikl-rule-coverage
description: Use when reconciling every official NIKL pronunciation article with repository implementation, IPA-first processing, evidence, and positive/negative/interacting regression tests; use for coverage gates and release readiness.
---

# NIKL Rule Coverage and Regression

## Purpose

Convert the official NIKL Standard Pronunciation Rules (표준 발음법) into a source-traceable acceptance contract for the existing Korean research engine. Coverage means more than a rule name in a CSV or a test file existing: it means the official scope is inventoried, implementation behavior is identified, and assertions actually verify the intended behavior.

Primary source: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002

## Mandatory repository reconnaissance

Before editing, inspect and reconcile the current state of:
- docs/NIKL-STANDARD-PRONUNCIATION-AUDIT-2026-10-09.md;
- docs/coverage-matrix.md;
- research/RULE-COVERAGE.csv;
- research/SOURCE-REGISTER.csv;
- tests/fixtures/standard-pronunciation-rule-coverage.json;
- existing rule, lexicon, IPA, morphology, and phonology schemas;
- all relevant NIKL article tests;
- docs/audits/COMPLETION-AUDIT-2026-10-20.md;
- the latest section of docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md.

Use the latest current-state section where historical snapshots conflict. Reuse existing source IDs and rule IDs. Do not add a second master matrix, duplicate rule registry, or parallel engine.

## Inventory-first method

1. Read the official table of contents and build the expected article/subarticle inventory independently of repository coverage.
2. Preserve official numbering, hierarchy, order, titles, examples, and cross-references. Verify the actual example list against the official page before marking an individual word as directly attested; general rule coverage is not lexical attestation.
3. Join the official inventory to the existing matrix by stable IDs, not by fuzzy rule-name similarity alone.
4. Classify every item using the repository vocabulary:
   - DONE_VERIFIED: exact acceptance behavior and required evidence are present and relevant tests were run;
   - PARTIAL: some implementation/evidence exists but acceptance criteria remain incomplete;
   - TODO: work remains;
   - BLOCKED: a named external dependency or missing evidence prevents progress;
   - DEFERRED: explicitly outside the agreed scope.
5. Distinguish these independent dimensions: source captured, rule interpreted, implementation present, IPA boundary respected, positive test, negative test, interaction test, cross-runtime parity, independent review, and final verification.
6. Do not upgrade status because a file exists or documentation claims completion. Inspect the assertion and implementation path.

## Rule case model

Each case should retain, where available:
- stable case ID;
- official article/subarticle ID and source URL;
- official input spelling and exact source example;
- official surface pronunciation, if explicitly supplied;
- evidence class: direct attestation, rule-derived, dictionary-attested, secondary-supported, hypothesis/unresolved;
- morphological segmentation and lexical identity only when supported;
- expected Korean phonological/IPA output and the evidence/rule chain deriving it;
- expected Ukrainian target, tested separately from Korean phonology;
- positive/negative/interaction classification;
- implementation path and test name;
- confidence/review status and unresolved questions.

Do not assume every official spelling has one context-free output. Preserve optionality and variants where the source establishes them. Do not invent IPA simply because the test harness expects a string.

## Test design requirements

For each applicable rule, build a balanced set rather than collecting only canonical positives:
- canonical positive example;
- boundary or minimal/near-minimal contrast;
- negative control where a similar spelling does not meet the environment;
- interaction case where rule order or a second rule matters;
- morphology-sensitive pair when the official rule requires morphological knowledge;
- lexical exception or dictionary-confirmed item where relevant;
- regression for every previously observed false positive/false negative.

Keep official example tests separate from generated/adversarial examples. Label generated examples as derived test material, not official quotations. A rule-derived expected form needs a traceable rule chain and review status.

Prioritize coverage of 받침/겹받침, neutralization, liaison, nasalization, liquid assimilation, fortition, palatalization, ㅎ aspiration/deletion, ㄴ insertion, 사이시옷, phrase boundaries, and morphology-dependent alternations according to the exact cited article. These categories are a checklist, not permission to overgeneralize them.

## Test assertion quality and examples

A test is useful only when it would fail for the bug it claims to prevent. For each coverage reference, inspect the assertion body and verify that:
- the expected article/rule ID is explicit or unambiguously mapped;
- the Korean input is the intended form and is not silently pre-normalized into a different case;
- the assertion checks the output layer relevant to the claim (surface pronunciation/IPA versus Ukrainian adaptation);
- the test does not merely check that output is non-empty or that a rule label appears in a trace;
- negative controls prove the rule does not fire outside its environment;
- unresolved cases assert the typed unresolved status/reason rather than accepting any output;
- fixtures do not label generated candidates as verbatim official examples.

When one input can have multiple parses, tests should specify the contextual evidence provided to the engine and should include a test where that evidence is absent. Avoid hard-coding a single lexical parse when the source does not establish it.

### Rule-to-test traceability pattern

Use the existing test and fixture conventions, but ensure each test case can answer:
- Which official article supports this expectation?
- Is the expectation directly quoted, dictionary-attested, or rule-derived?
- Which transformation stages are expected to run, and in what order?
- What nearby input would demonstrate that the rule's scope is limited?
- What does the engine return if the evidence is insufficient?

Do not impose a universal minimum number of cases per article if that would encourage fabricated examples. Coverage requirements should scale with the rule's stated conditions, alternatives, exceptions, and known interactions.

## IPA-first architecture gate

Required path:

Hangul → structural/morphological analysis → Korean phonology → IPA or explicitly typed unresolved result → Ukrainian target adaptation → Ukrainian practical orthography.

Verify dataflow, not just display. The Ukrainian adapter must consume the IPA/typed phonetic result. A parallel Hangul-to-Ukrainian mapping is an architectural failure even if an IPA string is displayed elsewhere for audit.

Preserve rule order, source provenance, syllable boundaries, uncertainty, optional variants, and other features the project contract requires. Where IPA is incomplete, use the repository's explicit unresolved/incomplete type and keep the reason visible. Heuristics may rank hypotheses but must not silently become normative rules.

## Gate implementation

- Validate official inventory count and exact IDs against the coverage fixture.
- Validate unique IDs, resolvable source links, expected-case references, and that referenced test names/assertions exist.
- Ensure missing article IDs and source examples cause a failing gate, not warnings that can be ignored.
- Validate generated artifacts against source registries and fail on drift.
- Run relevant focused tests first, then the complete repository-defined test suite, Python tests, browser/parity checks, static build, and release gates available in the environment.
- Record exact commands, exit codes, environment/runtime versions, and whether checks ran locally or in CI.
- Re-run failed checks after fixes and verify the final exact commit, not a prior tree.

## Status and release language

A coverage fixture passing establishes consistency of the inventory and test references only. It does not by itself establish that all rules are implemented, that phonetic analyses are linguistically correct, or that results are acoustically validated. Report these as separate claims.

Update the existing matrix, audit register, and handoff in place. Every remaining TODO/BLOCKED item must have a concrete acceptance criterion and a named missing dependency/evidence. Do not stop after documenting gaps when implementation is feasible.


## Evidence class and source-instrument gate (added 2026-10-22)

Coverage assertions must encode the scope of the evidence, not just the expected Hangul string.

- Distinguish a case-specific official answer, a quoted official-rule example, a dictionary's explicitly bracketed paradigm form, a mere orthographic occurrence in example prose, and a rule-derived prediction.
- A target spelling found in an ordinary sentence without a bracketed pronunciation does not satisfy a direct-pronunciation coverage assertion.
- A dictionary page that lists the lemma and neighboring applications does not directly attest an unlisted inflection.
- When a page reproduces a rule example that is not the question target, label the example separately; do not imply that the answer specifically adjudicates it.
- Preserve the exact named source instrument: `표준 발음법` and `한글맞춤법` are distinct. Same article numbers do not mean the source cited the same rule set. Test any project crosswalk separately.
- For negative controls such as `값있다[가빋따]` and `곧이어[고디어]`, assert that the engine does not apply ㄴ-insertion merely because a phonetic environment appears superficially compatible. The official source states that §29 ㄴ-insertion is not automatic.

Required regression dimensions for evidence-backed rows:
1. exact source identity and URL;
2. exact target form and source-attested surface notation;
3. evidence class and claim scope;
4. source instrument/article attribution;
5. direct-versus-derived distinction;
6. negative controls and adjacent non-examples;
7. separate status for broad IPA and Ukrainian target validation.
