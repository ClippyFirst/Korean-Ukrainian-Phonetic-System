# Master Directive

Programme: Complete and validate the Korean–Ukrainian Phonetic System  
Repository: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System  
Version: 1.0  
Established: 2026-10-15  
Status: Operational framework; repository baseline still to be audited.

## 1. Mission
Develop the repository into a scientifically grounded, reproducible, maintainable, and technically reliable system for rendering Korean pronunciation in Ukrainian. The goal is not to maximize rule count or documentation volume. The goal is to maximize justified correctness under explicitly stated input, linguistic, and runtime conditions, and to make uncertainty and limitations visible.

Every useful finding should move through this lifecycle:

**discover → assess → source → formalize → implement → test independently → integrate → document → release-verify.**

A source being found is not evidence that its contents have been implemented. A rule being documented is not evidence that the runtime applies it correctly. A passing test suite is not proof that the corpus is complete or correct.

## 2. Non-negotiable principles
1. **IPA-first:** Ukrainian output must derive from phonetic/phonological analysis and IPA, never from a parallel Hangul-to-Ukrainian substitution path.
2. **Evidence traceability:** normative claims, lexical exceptions, mapping decisions, and special licenses point to verifiable sources or are labelled as project policy/hypothesis.
3. **Separate kinds of truth:** distinguish official Korean norm, descriptive evidence, dictionary pronunciation, project-level Ukrainian rendering decisions, and heuristic predictions.
4. **Canonical data:** avoid divergent copies of rules in source code, documentation, and generated tables. Define authoritative structured data and validation procedures.
5. **Fail visibly:** do not silently substitute engines, discard unsupported input, or present low-confidence heuristic output as normative certainty.
6. **Context-aware processing:** account for rule order, boundaries, lexical conditions, morphology, and interactions. Avoid indiscriminate global string replacements.
7. **Independent tests:** expected values must be sourced or independently reviewed, not derived only from the implementation being tested.
8. **Reproducibility:** record versions, commands, environment assumptions, provenance, and outcomes.
9. **Licensing and attribution:** inspect licenses before copying code, data, examples, or corpora. Record attribution and redistribution obligations.
10. **No unsupported completion claims:** “complete”, “fully covered”, “accurate”, “merged”, “deployed”, and “verified” require evidence.
11. **Preserve history:** inspect existing work before replacing it. Archive superseded approaches with reasons rather than silently deleting useful research.
12. **One source of truth, explicit adapters:** browser, Python, CLI, and API may have different constraints, but differences must be documented and tested.

## 3. Roles
Coordinate the work as Korean phonology researcher, Ukrainian phonetics/transcription researcher, corpus curator, G2P/morphology engineer, Python/JavaScript engineer, QA/release engineer, technical writer, and independent reviewer.

Do not assume earlier project decisions are correct merely because they are already committed. Re-check important claims against evidence.

## 4. Required workflow for each change
1. State the problem and observable failure or missing capability.
2. Identify authoritative and secondary sources.
3. Record exact source passage, stable URL, access/version date, and license where relevant.
4. Formalize conditions, scope, exclusions, ordering dependencies, and counterexamples.
5. Identify canonical data/code locations to change.
6. Add positive, negative, boundary, interaction, and regression tests as appropriate.
7. Run targeted tests, then the relevant full suite/build.
8. Compare browser/Python/API behavior where the feature is meant to be shared.
9. Document behavior, uncertainty, and limitations.
10. Record commit/PR and update the coverage matrix and programme status.

A rule must not be marked accepted if a required stage is missing. Use blocked or limited rather than inventing certainty.

## 5. Linguistic scope
Audit, at minimum:
- Hangul normalization, syllable decomposition, and input segmentation;
- consonant/vowel inventories, realization, and relevant variation;
- coda neutralization and complex 받침;
- liaison/resyllabification;
- nasalization and liquid assimilation;
- aspiration and ㅎ-related alternations;
- palatalization and tensification;
- ㄴ-insertion and 사이시옷;
- morphology-conditioned alternations and endings;
- lexicalized pronunciations and exceptions;
- spacing, compounds, particles, and word-boundary interactions;
- 의 and other context-sensitive forms;
- loanwords, foreign text, numerals, punctuation, and mixed-script input;
- mapping from IPA/features to Ukrainian spelling and its phonetic limitations.

This is a checklist for investigation, not a claim that every item applies uniformly or has one uncontroversial answer.

## 6. Runtime and product scope
Audit browser runtime/deployed app, Python engine, CLI, API, optional external G2P adapters, and shared/canonical data independently. Do not claim parity unless the same versioned corpus has been run against each runtime and differences have been reviewed. Do not treat an optional external engine as a silent fallback.

## 7. Required session handoff
At the end of every work session:
- update this programme's current state;
- update the roadmap status and next actions;
- update relevant source/rule/decision registers;
- record exact commits, PRs, commands, test outcomes, and blockers;
- name the next smallest actionable task.

At the next session, read these files and continue from the first uncompleted task. Do not restart closed work without new evidence or an identified regression.

## 8. Definition of success
A release is acceptable only when behavior is explainable, core rules are traceable, implementation and tests agree with independently reviewed evidence, runtime differences are explicit, reproducible checks pass, public deployment is verified, and limitations are visible. See [Release Acceptance Gates](ACCEPTANCE-GATES.md).