# Korean-system audit report — 2026-10-10

**Scope of this pass:** inspect the current engine, web-engine regression suite, canonical correspondence table and complete lexical pronunciation CSV; correct a trace-consistency defect; add an adversarial regression; record coverage and remaining evidence gaps.

**Important limit:** this is a source/data audit, not a completed independent linguistic validation. I did not execute `npm test`, `npm run build`, or `npm run check:release` in this pass. No claim of passing runtime tests or build is made here. The official normative baseline is the National Institute of Korean Language (NIKL), *표준 발음법*: https://korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002

## 1. Confirmed code defect fixed in this branch

### Phrase-boundary rewrite helpers could report changes that had not happened

In `src/app/engine.js`, `applyPhraseBoundaryAssimilation()` used `rewriteCoda()` and `rewriteOnset()` helpers that conditionally changed the aggregate Ukrainian output and IPA only when an expected old segment was present. Regardless of whether those conditions matched, the helper could still add a successful rule label to the trace and return `true`. Some call sites also annotated the neighbouring trace even if the rewrite helper had failed.

This violated the trace invariant: a trace must not describe a completed transformation unless the relevant rendered representation was actually changed. It could also leave aggregate output and per-unit trace inconsistent when an unexpected lexical target or future mapping is encountered.

### Changes made

- Both helpers now require the expected old segment to match in the aggregate Ukrainian output, aggregate IPA, and the relevant trace unit before changing anything.
- Each helper performs the aggregate and trace updates atomically; otherwise it returns `false` without adding the rule.
- Call sites propagate a rule to the neighbouring trace only when the corresponding rewrite succeeds.
- Added a regression using deliberately adversarial synthetic lexical entries whose target strings do not match the expected edge segments. This is a defensive failure-path test, **not** a claim that a current production lexicon entry is malformed.

Relevant test: `phrase-boundary trace stays silent when a lexical target does not match the expected coda or onset`.

## 2. Complete lexical CSV structural scan

File: `data/korean/lexical_pronunciations.csv`.

| Check | Result |
|---|---:|
| Data records | 305 |
| Header fields | 12 |
| Rows with 12 fields | 263 |
| Rows with 11 fields | 42 |
| Duplicate `input` keys | 0 |
| Missing input, surface, target, IPA, source URL or rule note | 0 |
| Target/IPA syllable-unit count mismatch against surface Hangul count | 0 |
| Records marked `high` confidence | 305 |

The 42 eleven-field rows omit only the final empty optional field (`variant_note`). The runtime CSV parser fills missing trailing values with empty strings. This is structurally acceptable under the current parser, but the data contract should continue to document it.

### Target-status distribution

| `target_status` | Records | Interpretation |
|---|---:|---|
| `provisional` | 279 | Ukrainian target remains provisional; Korean evidence does not certify the Ukrainian rendering |
| `model-selected` | 21 | Project-selected target |
| `surface-only` | 5 | Entry records a surface form while retaining general-engine conversion |

**Data-quality concern, not a confirmed pronunciation error:** every record currently says `confidence=high`, while 279 Ukrainian targets are explicitly provisional. The project should define the confidence dimension before interpreting that column. Source reliability, certainty of Korean surface pronunciation, confidence in the IPA analysis and confidence in the Ukrainian target are different things and should not be compressed into one unexplained label. The comprehensive audit requirements now call this out.

### What this structural scan does not prove

- It does not establish that every source URL is live or supports the exact record.
- It does not independently validate the Korean surface form or IPA.
- It does not validate Ukrainian targets with Korean-speaker review or Ukrainian-reader production/perception testing.
- Syllable-count alignment is a structural check, not a phonetic accuracy score.
- No duplicate keys were found, but this does not rule out conflicting or near-duplicate entries with different keys.

## 3. Canonical correspondence table

File: `data/korean/canonical_correspondence.csv`.

- 68 data records.
- 19 onset, 21 vowel and 28 coda records.
- The table explicitly documents several project decisions that should remain labelled as approximations, not Korean facts: Korean fortisness and aspiration are not fully represented in Ukrainian graphemes; onset ㅎ is mapped to Ukrainian `г` as a project choice despite the voicing mismatch; coda ㅇ is represented with Ukrainian `н` despite Korean [ŋ]; and ㅢ is context-dependent.
- These are not automatically implementation bugs. They require transparent policy and, where possible, controlled reader testing.

## 4. Rule/implementation/test coverage snapshot

This is a mapping of the current implementation and tests inspected, not a claim that the complete NIKL rulebook has been independently checked article by article.

| Area | Current implementation / evidence | Audit status |
|---|---|---|
| Hangul decomposition and canonical mappings | `decompose`, `createMap`; canonical correspondence CSV; unit tests | Structurally covered; exhaustive runtime test not run in this pass |
| Coda neutralization / representative codas | `FINAL_REPRESENTATIVE`, `representative`, `mapCoda` | Implementation identified; needs exhaustive generated-input assertions |
| Simple liaison and complex codas | `applyContextualRules`; sourced lexical entries and regression cases | Morphology-sensitive cases deliberately unresolved unless sourced; broaden contrastive corpus |
| Nasal assimilation | `NASAL_AFTER`, `applyContextualRules`, phrase-boundary pass | Unit and sentence examples exist; phrase-boundary trace guard fixed here |
| Liquid assimilation / ㄹ→ㄴ | contextual and phrase-boundary passes | Several examples exist; interaction matrix still needed |
| Fortition | `PLAIN_TO_FORTIS`; contextual pass | Project deliberately does not double Ukrainian graphemes; validate every environment and ordering |
| ㅎ deletion and aspiration | contextual pass plus exact lexical entries | Morphology-dependent cases are withheld when unknown; requires complete normative example matrix |
| Palatalization | guarded for unknown morphology; sourced exact-form entries | Do not generalize from Hangul adjacency; expand licensed/unlicensed contrast pairs |
| ㄴ insertion | primarily sourced lexical entries in inspected fixtures | No claim of comprehensive productive implementation; needs dedicated coverage inventory |
| ㅢ and vowel variants | contextual default/realization logic and tests | Some cases covered; particle/non-initial variants need morphology-aware treatment or explicit unresolved policy |
| Phrase boundaries and punctuation | whitespace-linked pass; punctuation excluded by the parser pattern | Whitespace is only a heuristic for a single utterance; connected vs isolated mode remains a product-level limitation |
| Trace/output agreement | `rewriteCoda`, `rewriteOnset`, per-unit trace | A false-positive trace path was fixed and adversarial regression added; runtime suite still needs to run |
| UI/accessibility/release | `system.html`, `package.json` and release script inspected in project context | Not browser-tested or built in this pass |

## 5. Next mandatory checks before calling the audit complete

1. Run `npm run check:release` (which invokes `npm test` and `npm run build`) in a real checkout and inspect the full output.
2. Add property tests over all 11,172 modern Hangul syllable blocks and test parser behavior for decomposed/conjoining jamo, archaic forms, whitespace and punctuation.
3. Build a machine-readable NIKL article inventory: exact rule text and exceptions → engine implementation → sourced examples → positive and negative tests. Verify the current official source rather than relying on summaries.
4. Audit all lexical URLs for reachability and exact claim support; flag source pages that are mutable, generic or unavailable.
5. Define separate confidence/evidence fields for source quality, Korean surface-form certainty, IPA analysis and Ukrainian target quality; do not mark all as `high` by default.
6. Review every Ukrainian target independently. Keep `provisional` visible until Korean phonetic review and Ukrainian-reader evaluation provide evidence.
7. Add aggregate-vs-trace invariants for every conversion and rule interaction, including lexical overrides, multiple consecutive phrase boundaries and punctuation boundaries.
8. Browser-check the live GitHub Pages build for console errors, keyboard navigation, screen-reader labels and long/mixed-script input.

## 6. Evidence and reproducibility

The counts above are from a complete parse of the two CSV files on the audit branch, not a sampled subset. The mismatch/duplicate checks are deterministic structural checks. No external source-page crawl, native Korean-speaker review, Ukrainian-reader study, browser automation, or local test/build execution is represented as completed.
