# Korean-system audit report — 2026-10-10

**Scope of this pass:** inspect the current engine, web-engine regression suite, canonical correspondence table and complete lexical pronunciation CSV; correct a trace-consistency defect; add an adversarial regression; record coverage and remaining evidence gaps.

**Important limit:** this is a source/data audit, not a completed independent linguistic validation. GitHub Actions on the current PR branch ran `npm test` (122 passed, 0 failed), `npm run build` (passed), the Python regression/data-integrity job (passed), and the corpus/master-table artifact job (passed). These are CI results, not a local execution in this session. The first CI attempt caught a malformed synthetic test fixture; the fixture was corrected and the subsequent CI run passed. [Web tests and build](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/38055001424) · [Korean system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/38055001653) · [Corpus/master-table artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/38055001532). The official normative baseline is the National Institute of Korean Language (NIKL), *표준 발음법*: https://korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002

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

1. `npm test` and `npm run build` passed in GitHub Actions on this branch (122 tests passed; production build succeeded). Re-run `npm run check:release` in a local checkout when available to reproduce the combined release gate.
2. Add property tests over all 11,172 modern Hangul syllable blocks and test parser behavior for decomposed/conjoining jamo, archaic forms, whitespace and punctuation.
3. Build a machine-readable NIKL article inventory: exact rule text and exceptions → engine implementation → sourced examples → positive and negative tests. Verify the current official source rather than relying on summaries.
4. Audit all lexical URLs for reachability and exact claim support; flag source pages that are mutable, generic or unavailable.
5. Define separate confidence/evidence fields for source quality, Korean surface-form certainty, IPA analysis and Ukrainian target quality; do not mark all as `high` by default.
6. Review every Ukrainian target independently. Keep `provisional` visible until Korean phonetic review and Ukrainian-reader evaluation provide evidence.
7. Add aggregate-vs-trace invariants for every conversion and rule interaction, including lexical overrides, multiple consecutive phrase boundaries and punctuation boundaries.
8. Browser-check the live GitHub Pages build for console errors, keyboard navigation, screen-reader labels and long/mixed-script input.

## 6. Evidence and reproducibility

The counts above are from a complete parse of the two CSV files on the audit branch, not a sampled subset. The mismatch/duplicate checks are deterministic structural checks. No external source-page crawl, native Korean-speaker review, Ukrainian-reader study, browser automation, or local test/build execution is represented as completed.


## 7. Rule-interaction matrix (source-code review; not yet expert-validated)

The classifications below describe intended behavior and implementation safeguards visible in the current source. They are a practical audit matrix, not a substitute for checking each article and example against the live NIKL text.

| Interaction | Classification | Current handling | Required regression / evidence gate |
|---|---|---|---|
| Coda representative → nasal assimilation before ㄴ/ㅁ | Required when the standard environment is licensed | `representative` + `NASAL_AFTER`; local and phrase-boundary passes | Exhaustive contrast for each coda class; verify surface IPA and trace |
| Obstruent coda + ㄹ → ㄹ realised as ㄴ, then coda nasalizes | Required in the supported environment | `liquid-to-nasal-before-obstruent`, then nasal assimilation | Cover underlying ㄱ/ㄷ/ㅂ representatives including written ㅅ/ㅈ/ㅊ, plus boundary and punctuation contrasts |
| ㄴ + ㄹ → ㄹㄹ | Required in the licensed environment | `liquid-assimilation` in local and phrase-boundary passes | Minimal pairs; ensure both aggregate channels and trace change together |
| ㄹ + ㄴ → ㄹㄹ | Required in the licensed environment | `liquid-assimilation` | Verify coda and onset outputs, especially lexical overrides |
| ㅁ/ㅇ coda + ㄹ → ㄴ onset | Context-dependent by the standard sequence | Local and phrase-boundary liquid handling | Contrast with ㄴ+ㄹ and obstruent+ㄹ; verify ordering and trace |
| ㅎ coda + lenis onset → aspiration | Required only in licensed patterns | `ASPIRATION` branch and sourced lexical examples | Test every eligible onset and coda; distinguish simple from complex codas |
| ㄷ + ㅎ before ㅣ → aspiration plus palatalization | Required for licensed morphology | Explicit `h-aspiration-plus-palatalization` path | Official examples and contrastive non-licensed forms |
| Complex coda + vowel-initial ending/suffix | Context-dependent on morphology | Unknown cases marked unresolved; exact sourced forms use lexical entries | Formal vs substantive morpheme contrasts; never generalize from adjacency |
| ㅎ deletion before vowel-initial ending/suffix | Context-dependent on morphology | Unknown cases marked unresolved; exact sourced forms use lexical entries | Positive and negative morphology contrasts, including ㄶ/ㅀ |
| Complex coda + ㅎ aspiration | Context-dependent on licensed morphophonology | Unknown cases marked unresolved; exact sourced forms use lexical entries | All official examples, with separate Ukrainian-target review |
| ㄺ + ㄱ | Context-dependent / lexical-morphological exception | Unknown cases withheld; known verb-stem and noun forms have scoped entries | Expand stem/noun minimal contrasts; verify no exception leakage |
| Coda + lenis onset fortition | Required only in applicable environments | `PLAIN_TO_FORTIS` pass; practical UA output deliberately neutralizes fortisness | Enumerate all applicable coda/onset pairs and exceptions; distinguish Korean IPA from UA grapheme policy |
| ㄴ insertion in compounds/derived words | Context-dependent, often lexical/morphological | Current inspected coverage relies substantially on exact sourced entries | Build full normative inventory and contrastive tests; do not claim a general parser |
| ㅢ realization | Context-dependent by position/morphology | Default [ɰi], consonant-onset [i], with exact context limits | Add particle 의, non-initial 의, and word-initial/non-initial contrasts |
| Whitespace-separated phrase assimilation | Heuristic approximation | Plain whitespace is treated as a phrase link; punctuation blocks the pass | Add connected-phrase vs isolated-word behavior or an explicit UI disclosure/mode |
| Lexical override + boundary rule | Required only when the boundary rule itself is licensed and both rendered edge segments match | Guarded edge rewrites; rules propagated only after successful rewrite | Keep the adversarial regression and add positive cases for each rewrite branch |
| Korean surface change → Ukrainian target | Not a Korean normative interaction; project mapping policy | Canonical map and lexical targets render the selected surface analysis | Review Korean surface, IPA and UA target separately; target tests do not certify reader quality |

### Known gaps after this pass

- This matrix has not been exhaustively cross-checked article-by-article against the current NIKL source.
- The engine's phrase pass still uses whitespace as a proxy for connected speech. The previous PR documents this limitation; a user-selectable phrase mode would be clearer.
- The full 11,172-syllable property suite, a live-source reachability crawl, UI/accessibility checks and independent Korean/ Ukrainian review remain outstanding.
- A green test suite would establish code/test conformance, not prove the linguistic or reader-facing quality of every output.


## 8. Unicode and exhaustive Hangul property pass (2026-10-10 follow-up)

The follow-up test now iterates over every modern precomposed Hangul syllable code point from U+AC00 through U+D7A3 (11,172 syllables). For each syllable it verifies the onset, vowel, coda, coda-presence flag and exact reconstruction from the decomposed indices.

### Confirmed edge-case defect and fix

The first CI run exposed a real input-validation defect in `decompose('')`: `codePointAt(0)` returns `undefined`, and comparisons against the Hangul range did not reject it. The function could therefore return an object with undefined components for an empty string. The implementation now first requires a string containing exactly one Unicode code point. The regression test includes empty and multi-code-point inputs.

### Unicode behavior clarified

- Precomposed modern Hangul syllables are decomposed.
- Compatibility jamo, conjoining jamo, non-Hangul characters, and multi-code-point strings are not treated as a single precomposed Hangul syllable by `decompose`.
- In full conversion, decomposed jamo are currently preserved as literal characters rather than normalized to precomposed Hangul. This is now explicitly tested and should be considered a known input-format limitation, not a claim that normalization is impossible or undesirable.
- Mixed-script conversion transliterates Hangul while preserving non-Hangul text, punctuation and emoji.

### Validation result

The corrected branch passed the GitHub Actions verification run: 126 web tests passed with zero failures; production build and Python regression/data-integrity checks passed. This establishes implementation/test conformance for the tested cases, not independent phonetic correctness.
