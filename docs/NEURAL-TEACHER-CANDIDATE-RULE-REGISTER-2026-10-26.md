# Neural-teacher findings and deterministic-rule candidate register — 2026-10-26

## Purpose and decision

This is the separate, canonical register for conclusions from the research-only neural G2P teacher and candidate rule families to investigate in ClippyFirst's deterministic Korean engine. It is intended to reduce repeated re-reading and speed up work without lowering the evidence threshold.

The teacher is a hypothesis generator only. Its raw predictions are not Korean pronunciation gold, are not copied into runtime, and do not bypass the pipeline:

Hangul structure/morphology → Korean phonology → typed IPA → Ukrainian target adaptation → Ukrainian orthography.

Promotion requires primary-source evidence for the exact environment, a reviewed IPA convention, sufficient morphology resolution, positive and negative controls, and a separate eligible development evaluation with no unacceptable regressions.

## Executive status

| Measure | Current defensible result | Interpretation |
|---|---:|---|
| Scratch teacher exact token-sequence match in retrieved artifact 12638313059 | 602/1,000 (60.2%) | Source-convention-specific; not ClippyFirst broad-IPA accuracy; artifact identity is explicit |
| Teacher dev mismatches in retrieved artifact 12638313059 | 398 | Error pool, not 398 missing rules |
| Mismatches classified as length-mark-only in that artifact | 107 | Diagnostic category; not permission to remove length |
| Other teacher dev mismatches in that artifact | 291 | Mixed errors; not yet a count of phonological rules |
| Cross-corpus train/train shared forms | 1,084 | SIGMORPHON and UGTPHON forms intersect |
| Shared forms with serialization-only target match | 718/1,084 | Compared after removing SIGMORPHON phone-token whitespace only |
| Shared forms requiring source-convention review | 366/1,084 | 151 length-mark-only diagnostics + 215 other symbol/feature differences |
| Teacher-vs-Strict discrepancies adjudicated as true phonological errors | **0 established by this evidence set** | IPA conventions have not been mapped to reviewed ClippyFirst broad IPA |
| New generalized production rules confirmed specifically from neural output in this workstream | **0** | Source-backed rule additions are not neural discoveries |
| New exact-form licenses added to existing R003 in this workstream | 6 | NIKL §12(4) examples, not six generalized rules |
| Total genuinely missing rules remaining | **Unknown** | Requires case-level enumeration and adjudication |

## Evidence and limitations

1. **Artifact reconciliation is now explicit:** retrieved artifact 12638313059 contains dev-error-analysis.json reporting 602/1,000 exact (60.2%), 107 length-mark-only mismatches, and 291 other mismatches. Later handoff text reports 596/1,000 (59.6%) from a purported later artifact, but that artifact was not available in the observed workflow artifact listing. Until the later artifact is retrieved and its manifest/revision verified, use 602/1,000 only when citing artifact 12638313059 and keep the reported 596/1,000 as a conflicting, not-yet-reconciled result. The teacher was selected on that same dev split, so neither figure is an independent generalization evaluation.
2. SIGMORPHON and UGTPHON describe different annotation pipelines. Their target strings are not automatically interchangeable with each other or with ClippyFirst broad IPA. Source whitespace, stress, syllable boundaries, length and diacritics must not be normalized away without a reviewed mapping decision.
3. Of 1,084 shared train forms, 366 target strings differ after serialization-only whitespace removal. Diagnostics split these into 151 length-mark-only cases and 215 other symbol/feature cases; zero were classified as dot-only. These are review categories, not normalization instructions.
4. The Charsiu multilingual checkpoint's explicit weights license and exact original training overlap remain unresolved. The scratch teacher trained from random initialization on pinned SIGMORPHON train is a separate research artifact; neither result authorizes redistributing Charsiu weights or treating its outputs as gold.
5. No independent IPA-to-Ukrainian gold set is available. Better surface-form matching does not prove IPA or Ukrainian adaptation is correct.

Primary project records:
- [Teacher-guided Strict rule-mining protocol](TEACHER-GUIDED-STRICT-RULE-MINING-2026-10-26.md)
- [IPA source-convention review](KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md)
- [Typed IPA annotation boundary](TYPED-IPA-ANNOTATION-BOUNDARY-2026-10-26.md)
- [Benchmark suite register](KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md)
- [Master execution plan and handoff](MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md)
- Candidate miner: scripts/mine_deterministic_rule_candidates.py
- Candidate acceptance gate: scripts/evaluate_deterministic_rule_candidate.py
- Teacher dev error analyzer: scripts/analyze_korean_g2p_teacher_errors.py
- Same-input teacher/Strict pairing: scripts/compare_korean_teacher_strict_dev.py


### Descriptive source-shape signal from artifact 12638313059

The same artifact's development report groups teacher exact-match rate by Hangul character count and whether any coda is present:

| Source shape | Exact / total | Exact rate |
|---|---:|---:|
| 2 Hangul characters, coda present | 195/295 | 66.1% |
| 2 Hangul characters, no coda | 137/220 | 62.3% |
| 3 Hangul characters, coda present | 59/118 | 50.0% |
| 3 Hangul characters, no coda | 109/175 | 62.3% |
| 4 Hangul characters, coda present | 17/41 | 41.5% |
| 4 Hangul characters, no coda | 73/116 | 62.9% |

This is a useful prioritization signal for manual stratification: within this dev artifact, teacher exact match is lower for three- and four-character forms containing a coda than for same-length forms without one. It is **not** evidence that coda phonology causes the errors or that Strict is missing a coda rule. Bucket sizes above four characters are very small and must not support generalizations. The next useful analysis is to cross-tabulate these forms with reviewed IPA error types and current Strict traces, then separate model errors, convention differences, unresolved morphology and genuine Strict omissions.

## Candidate register

**Important:** The families below are review queues inferred from documented disagreement types and existing rule boundaries. They are not seven rules extracted from the teacher and must not be counted as seven confirmed missing rules. Candidate-level case IDs, environments, sources and independent outcomes must be attached when artifacts are available.

| ID | Candidate family / question | Why investigate | Existing coverage / confound | Status | Acceptance criterion |
|---|---|---|---|---|---|
| CAND-001 | Coda neutralization and following-onset interaction | The candidate miner groups associations around coda/onset contexts | Existing R002/R004/R007/R009/R011–R016; source conventions and boundaries can mimic errors | PARTIAL — family queued, no adjudicated candidate list | Enumerate eligible cases; verify exact NIKL environment and morphology; add same-context positive and negative controls |
| CAND-002 | Nasal assimilation | A potentially explainable contextual mismatch class | Existing assimilation rules; mismatch may instead be tokenization or teacher error | PARTIAL — no new rule established | Show residual pattern after reviewed IPA mapping and match it to primary-source clauses |
| CAND-003 | Liquid assimilation | Potential contextual mismatch family | Existing coverage; lexical exceptions and phrase boundaries may confound | PARTIAL — no new rule established | Define exact environment, blockers and counterexamples; demonstrate independent dev improvement |
| CAND-004 | Palatalization | Surface adjacency may conceal a grammatical morpheme boundary | Existing R007 and morphology guards; Hangul alone does not establish a boundary | BLOCKED for productive promotion | Use independently verified stem/ending boundaries and negative controls; preserve fail-closed behavior |
| CAND-005 | ㅎ deletion and ㅎ-driven aspiration | Residual errors may intersect existing R003 pathways | Exact-form source-backed licenses exist; morphology and convention are confounds | PARTIAL — existing rule extended by six source-backed forms, not neural discovery | Add only independently sourced cases/environments; test lookalikes and Python/browser parity |
| CAND-006 | Fortition/tensification and morphology | Coda+onset contexts may be associated with teacher disagreements | Existing R010 closed stem+ending inventory; noun/verb homographs and excluded -기- environments are risky | PARTIAL — source-backed closed inventory expanded, not teacher-derived | Require source-supported grammatical boundary, lexical negative controls and dev no-regression |
| CAND-007 | Length marks and other IPA features | 107 teacher errors and 151 cross-corpus conflicts were length-only diagnostics | May be annotation convention rather than pronunciation error | BLOCKED pending convention review; never auto-strip | Establish source convention per item and map to ClippyFirst broad IPA with explicit loss accounting |
| CAND-008 | Syllable boundaries, tokenization, diacritics and unfamiliar symbols | 215 cross-corpus conflicts differ beyond length | SIGMORPHON token spaces and UGTPHON detailed notation are not directly comparable; ç is documented in UGTPHON notation | BLOCKED pending typed adapter | Map features with explicit mapped/unmapped and loss states; test feature preservation |
| CAND-009 | Lexical exceptions and unresolved morphology | Strict abstention may be safer than a guessed output | Existing lexical overrides and morphology licenses; teacher may guess where Strict abstains | PARTIAL — requires classification | Distinguish true omission from ambiguity; do not reduce abstention without independent justification |
| CAND-010 | Ukrainian target adaptation after IPA | Needed for end-to-end output quality | Independent Ukrainian target gold and expert review are unavailable | BLOCKED | Build reviewed IPA-to-Ukrainian cases and preserve the IPA adapter boundary |

## Source-backed production changes — not neural discoveries

- **R003 / NIKL §12(4):** six exact-form licenses: 낳은, 놓아, 쌓이다, 않은, 닳아, 싫어도. These extend an existing rule inventory; they are not six generalized rules.
- **R010 / NIKL §24:** eleven exact stem+ending examples documented in the master handoff. The inventory remains closed and context-gated; noun-like lookalikes and ambiguous homographs are not licensed.
- **R016 / NIKL §11:** exact 읽거든 coverage alongside documented 읽고, with negative controls.
- **R002 / NIKL §§13–15:** source-backed liaison additions exist in separate PR #341 and must be reconciled against main before a merge/port decision. They are not silently counted as teacher-discovered rules.

These additions remain unverified until exact-head CI passes; commits and test files alone are not verification.

## How to calculate a real remaining-rule count

1. Retrieve exact current CI artifacts for pinned train/dev; verify hashes, split metadata, teacher revision and row counts.
2. Generate the per-case teacher-error report and same-input teacher/Strict pair artifact. Label model-selected dev results as discovery evidence, not independent final evaluation.
3. Run scripts/mine_deterministic_rule_candidates.py only on provenance-valid train/dev. Preserve raw strings and all IPA features; exclude test/holdout.
4. Reconcile each candidate against the source-convention adapter. Until independently reviewed, report symbol conflicts as unadjudicated, not missing Korean rules.
5. Group independently supported cases into candidate rules with exact environment, source clause, positive and negative controls, morphology requirements and counterexamples. Deduplicate rule families; individual forms are not separate rules.
6. Evaluate using scripts/evaluate_deterministic_rule_candidate.py against reviewed ClippyFirst broad-IPA gold on an eligible dev set. The gate requires two distinct reviewer IDs and permits human review only, not automatic promotion.
7. Count each candidate in one state: implemented-and-verified, implemented-but-unverified, source-confirmed-not-implemented, hypothesis-only, or blocked. Only source-confirmed-not-implemented candidates count as confirmed remaining rules; report hypothesis-only candidates separately.

## Task ledger

| Task | Status | Evidence / blocker |
|---|---|---|
| Scratch teacher train/dev error analyzer | DONE_VERIFIED for artifact 12638313059; newer reported result needs reconciliation | Retrieved report: 602/1,000 exact; handoff also mentions 596/1,000 but matching artifact not yet retrieved |
| Candidate miner and train/dev/holdout guardrails | DONE_VERIFIED on previously documented CI; current exact-head rerun pending | Script and tests preserve raw outputs and forbid sealed splits |
| Typed lossless IPA packets | DONE_VERIFIED on exact head 9fadae60373f3feac79098be7a37bdd49e2d7085 per master handoff | Does not map corpus conventions to ClippyFirst IPA |
| Independent SIGMORPHON/UGTPHON-to-ClippyFirst IPA adapter | BLOCKED | Symbol mapping and independent adjudication incomplete |
| Enumerated case-level residual rule list from current artifacts | TODO | Artifacts need retrieval and audit; reliable count unavailable |
| Promote generalized rule based on teacher output | BLOCKED by evidence gate | No source-adjudicated candidate with reviewed IPA gold and eligible held-out gain |
| Source-backed exact-form inventory extensions | PARTIAL until current exact-head CI passes | Code/tests exist; current PR workflow backlog was queued |
| Independent IPA-to-Ukrainian target evaluation | BLOCKED | No independent reviewed target gold set |
| Current PR #339 exact-head CI | BLOCKED / pending external execution | Latest observed run set was queued; earlier commit checks do not verify current head |

## Stop/go criteria

**Go:** propose a source-backed rule when an exact environment repeats across eligible examples and primary evidence supports it; include exceptions and negative controls.

**No-go:** do not add a rule solely because the neural model differs; do not normalize away length, aspiration, fortisness, diacritics or syllable boundaries to improve apparent agreement; do not use test/holdout examples for selection; do not treat abstention as error without resolving pronunciation.

**Current conclusion:** the project has useful leads and a growing research pipeline, but the number of genuinely missing rules remains **not yet measurable**. The next milestone is a complete, source-convention-aware case ledger, not an arbitrary count.
