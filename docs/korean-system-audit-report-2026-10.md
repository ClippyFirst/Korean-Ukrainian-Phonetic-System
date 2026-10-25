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


## 9. Normative evidence boundary: ㄷ + ㄹ (몇 리)

This follow-up checked a specific rule claim against the current official source rather than treating the existing regression test as proof of a normative rule.

- NIKL *표준 발음법* §19 explicitly names coda ㅁ/ㅇ and, in its supplement, ㄱ/ㅂ before ㄹ: [official rules and commentary](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002).
- NIKL's Online Q&A response dated 2025-04-22 says there is **no explicit clause in the Standard Pronunciation Rules explaining 몇 리**, and notes that the §19 commentary's restriction reflects the fact that Sino-Korean syllables do not end in ㄷ: [NIKL Q&A: ㄹ의 비음화 2](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=313411).
- A separate NIKL response dated 2025-06-04 says views may differ on the explanation for 몇 리: [NIKL Q&A: 몇 리](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=315809).

### Implementation change

The engine continues to return the project's selected reading for `몇 리` (`mjʌn ni`; Ukrainian `мйон ні`), but its trace labels the ㄷ + ㄹ step as `project-inferred-d-liquid-nasalization`, not as the general NIKL §19 rule `liquid-to-nasal-before-obstruent`. The first implementation of this distinction covered the local pass but missed the phrase-boundary pass used when lexical overrides split the input into words. This follow-up closes that gap: both paths now use the inference-specific label, and the regression checks `몇 리 문법` as well as the isolated phrase.

This is a **provenance/claim-calibration correction**, not a claim that the output [면니] is wrong. It prevents the UI trace from overstating what the cited normative rule explicitly says. The rule remains a project inference until a stronger authoritative or academic source supports a more specific analysis.

## 10. Other rule-coverage cautions confirmed during source review

- NIKL §18 explicitly includes a supplement for two words pronounced as one phrase. Plain whitespace is still only a proxy for that prosodic condition, not proof that a speaker links every adjacent word.
- §19's explicit environments must not be generalized solely from orthographic adjacency. The engine's morphology safeguards for complex-coda liaison, ㅎ deletion, palatalization and complex-coda + ㅎ aspiration should be retained unless a lexical/morphological analysis licenses the change.
- A regression test's expected output is project evidence, not independent evidence for a Korean normative claim. For each test, the project should record whether the expected surface is directly normative, lexically sourced, supported by a dictionary, or a documented project inference.


## 11. Directional asymmetry in §12 aspiration

The official wording of §12(1) specifies `ㅎ(ㄶ, ㅀ)` followed by `ㄱ, ㄷ, ㅈ`, producing `ㅋ, ㅌ, ㅊ`. The supplement separately specifies the reverse direction, including coda `ㅂ(ㄼ)` before onset `ㅎ`, producing `ㅍ`. These are not symmetric sets.

The engine previously reused a general aspiration map containing `ㅂ → ㅍ` for both directions. That incorrectly made an `ㅎ` coda aspirate a following `ㅂ`, although §12(1) does not license that transformation. The engine now uses a direction-specific map for `ㅎ/ㄶ/ㅀ + onset`, while retaining the broader map for coda + `ㅎ` under §12's supplement. A negative regression checks `놓바` so this implementation detail cannot silently return.

Source: [National Institute of Korean Language, Standard Pronunciation Rules §12](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002).

This synthetic syllable-sequence test checks the rule boundary; it is not presented as a lexical Korean word or a claim about a word's standard pronunciation.


## 12. Coverage status for NIKL §§23–30

A fresh pass over the official *표준 발음법* confirms that the engine's productive fortition implementation is principally §23. Articles §§24–28 have additional morphology- or lexicon-conditioned environments: verb-stem codas, Sino-Korean words with dictionary exceptions, adnominal -(으)ㄹ, and compounds whose functional 사이시옷 is not written. The new lexical rows cover selected official examples from §§24–26 and §28 without pretending these are productive rules. §27 remains a gap for sentence-level inference because this engine has no syntactic parser. §§29–30 (ㄴ insertion and written 사이시옷) remain primarily exact-entry coverage, not general morphological analysis.

The official source also explicitly rejects several place-assimilation pronunciations under §21. Keep these as negative controls; do not add general place assimilation. Optional vowel variants and vowel length under §§4–7 and §22 remain lexically/positionally conditioned and should not be inferred from Hangul spelling alone.

Source: [NIKL Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002). The inventory records engineering coverage only. It is not a claim of complete linguistic coverage or native-speaker validation.


## 13. Coverage status for NIKL §§1–22

| Articles | Current implementation | Remaining limitation |
|---|---|---|
| §§1–3 | Methodology and canonical onset/vowel/coda correspondence | Project Ukrainian choices are approximations; the Korean inventory itself is not the same thing as a Ukrainian output table. |
| §§4–5 | Canonical monophthong/diphthong mappings; contextual ㅢ handling and selected alternatives | Not all permitted ㅚ/ㅟ/ㅖ/ㅢ variants are represented productively. |
| §§6–7 | Lexical length and length-change examples | Length and conjugation cannot be reconstructed reliably from orthography without lexical/morphological evidence. |
| §§8–10 | Coda correspondence, representative neutralization and complex-coda map | Contextual ordering and lexical exceptions still require exact tests. |
| §11 | Scoped ㄺ exception guard and sourced entries | Unknown stem/noun ambiguities are withheld rather than guessed. |
| §12 | ㅎ deletion/aspiration, with direction-specific coda aspiration | Morphological boundaries and complex-coda + ㅎ cases remain lexically guarded. |
| §§13–16 | Simple liaison path; complex liaison and consonant names use exact entries | No full morpheme parser; adjacency alone cannot distinguish formal from substantive morphemes. |
| §17 | Palatalization guard and exact sourced forms | Requires licensed particle/suffix morphology. |
| §18 | Nasal assimilation locally and across plain whitespace | Whitespace approximates connected speech; it does not prove prosodic linking. |
| §19 | Listed liquid-to-nasal environments; separate label for ㄷ + ㄹ | 몇 리 remains a project inference, not a direct statement of §19. |
| §20 | Liquid assimilation with regression coverage | Lexical exceptions and the full range of contexts need additional evidence. |
| §21 | Negative controls reject non-standard place assimilation | Exact examples are covered; no general productive place-assimilation model is intended. |
| §22 | Exact entries for permitted vowel-glide variants | No productive verb-stem class inference. |

Taken together with §12 above, this is an implementation-coverage map, not a claim of full rule coverage. Each rule family must be validated independently at three layers: Korean surface pronunciation, IPA representation, and Ukrainian reader-facing target.


## 14. NIKL §27: exact attached-ending examples

Added exact lexical entries and regressions for the official attached-ending examples 할걸[할껄], 할밖에[할빠께], 할세라[할쎄라], 할수록[할쑤록], 할지라도[할찌라도], 할지언정[할찌언정], and 할진대[할찐대]. These entries are deliberately lexical: the browser engine does not parse the morphology of arbitrary -(으)ㄹ endings and must not generalize fortition from surface adjacency alone.

The separated phrase examples in §27 (할 것을, 갈 데가, 할 바를, 할 수는, 할 적에, 갈 곳, 할 도리, 만날 사람) remain a separate phrase/syntax gap. The standard explicitly notes that fortition may not apply when a phrase is spoken with a pause; treating every whitespace boundary as a fortition trigger would be incorrect. Source: [NIKL Standard Pronunciation Rules, §27](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002).

All seven Ukrainian targets are marked provisional. The Korean surface forms and their IPA representations are separate from the Ukrainian reader-facing approximation and need independent review.


## 15. Lexicon integrity guard

The lexical CSV now has an automated regression checking unique input keys, required evidence/metadata fields, allowed confidence and target-status values, source URL schemes, and one-to-one segmentation counts across input, Korean surface, Ukrainian target and IPA. A fresh static pass over the current 348 records found no duplicate input keys, missing required fields, unsupported status labels, malformed source URL schemes, or segment-count mismatches. This check is structural only: it cannot determine whether a Korean pronunciation is linguistically correct or whether a Ukrainian target is optimal.


## 16. §28 official compound example inventory completed

The lexicon now covers all 19 examples listed under NIKL §28: 문고리, 눈동자, 신바람, 산새, 손재주, 길가, 물동이, 발바닥, 굴속, 술잔, 바람결, 그믐달, 아침밥, 잠자리, 강가, 초승달, 등불, 창살 and 강줄기. The nine previously missing forms were added as exact lexical entries with provisional Ukrainian targets. Regression coverage preserves [굴ː쏙] vowel length as IPA `kuːl` (length belongs to the vowel, not the coda) and represents the lenis onset in 강줄기 contextually as [g] in the chosen broad IPA layer. These readings are tied to the listed official examples only; they do not license a general rule for every compound.


## 17. Regression caught and fixed: 바람결 segmentation

The new structural test caught that the first version of the 바람결 entry grouped its first two Korean syllables into one Ukrainian target/IPA segment. The renderer indexes lexical target and IPA segments against individual Hangul syllables, so that grouping would have left the trace misaligned even though the concatenated output looked plausible. The entry is now segmented per syllable (`па|рам|кйол`, `pa|ɾam|k͈jʌl`). A fresh static check of all 348 lexical entries now finds no input/surface/target/IPA segment-count mismatches. This is precisely why the data-integrity test is useful in addition to output-level spot checks.


## 18. NIKL §29 example coverage

Added the previously missing Hangul-only examples for §29: 솜이불, 홑이불, 막일, 삯일, 맨입, 내복약, 한여름, 남존여비, 신여성, 색연필, 직행열차, 늑막염, 콩엿, 담요, 눈요기, 영업용, 식용유, 백분율 and 밤윷. Added explicit alternative readings for 이죽이죽, 야금야금, 검열, 욜랑욜랑 and 금융. Added negative controls 송별연 and 등용문 where §29 says ㄴ insertion does not occur. The numeric/punctuated controls 6·25 and 3·1절 are now represented through an explicit `input_kind=mixed-script` path; their target/IPA alignment is checked against the Korean surface reading rather than the orthographic input length.

All new Ukrainian targets are provisional. The official rule page provides Korean standard pronunciations, not Ukrainian-transcription validation. The structural audit now checks alternate variants as well as primary entries: alternate surface, Ukrainian target and IPA must all be present together, each segment-aligned to the input syllables, with a non-empty variant note.


## 19. NIKL §30 example coverage

Added exact entries for all 19 official §30 examples: ten §30(1) fortition examples with both permitted readings (냇가, 샛길, 빨랫돌, 콧등, 깃발, 대팻밥, 햇살, 뱃속, 뱃전, 고갯짓); four §30(2) nasalization examples (콧날, 아랫니, 툇마루, 뱃머리); and five §30(3) double-nasal-insertion examples (베갯잇, 깻잎, 나뭇잎, 도리깻열, 뒷윷). Alternate readings are represented as explicit variants rather than hidden in notes. Long vowels are marked on the vowel in IPA (e.g. 퇸ː마루 → `tʰøːn`), while the Ukrainian target remains provisional.

The inventory now contains 393 lexical records. Structural review checks primary and alternate segment counts independently; passing these checks establishes data alignment only, not the optimality of each Ukrainian target.


## 20. Target-script integrity correction

The first §30 regression run caught two Ukrainian-target cells that accidentally contained Hangul characters: the target for 깃발 contained 팔 instead of пал, and the target for 뱃머리 contained 모 instead of мо. Both cells were corrected. The lexical CSV integrity test now also rejects Hangul characters in Ukrainian target fields, including alternate targets, to prevent this class of copy/paste error from recurring.


## 21. Ukrainian target-script inventory

A full character scan of all 395 primary and alternate Ukrainian targets found only the declared Ukrainian Cyrillic letters and the allowed syllable delimiter. No Latin characters, IPA symbols, digits, or Hangul remained in the target fields. The automated CSV integrity test now checks this alphabet boundary in addition to rejecting Hangul explicitly. This is a script-integrity check only; it does not establish that every target is idiomatic or phonetically optimal Ukrainian.


## 22. Mixed-script numeric readings (§29)

Added exact, source-linked lexical entries for the official mixed-script examples `6·25` → [유기오] and `3·1절` → [사밀쩔]. The CSV now has an explicit optional `input_kind` field; ordinary entries remain Hangul-only, while `mixed-script` entries align target and IPA units to the sourced Korean surface reading, not to the number of input code points. This avoids pretending that digits or punctuation are Hangul syllables.

The engine recognizes these exact entries both as standalone inputs and inside surrounding Korean phrases. The result retains the original input, provides the Korean surface reading, Ukrainian target and IPA, and labels the Ukrainian output provisional. The test suite covers standalone conversion, phrase tokenization and the distinct CSV alignment contract. The inventory now contains 395 records. GitHub Actions run [38057973331](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/38057973331) passed browser regression tests, production build/generated-page verification and Python regression/data-integrity checks. The numeric examples’ Ukrainian targets are project proposals, not NIKL-validated transcriptions.


## 23. Independent Ukrainian target-layer review

Added [`docs/ukrainian-target-review-2026-10-10.md`](./ukrainian-target-review-2026-10-10.md), a first-pass internal-consistency review of the Ukrainian target layer against the canonical correspondence table. It identifies policy questions around vowel-length omission, neutralization of aspiration/fortisness, approximations for `/ʌ ɯ ø y/`, coda `/ŋ/`, liquid sequences, and the role of segmentation bars.

The review deliberately does not bulk-rewrite target strings. These are model choices that need a stated objective and empirical evaluation; without a native Korean source-audio check and Ukrainian-reader comparison, declaring a particular approximation definitively wrong would overstate the evidence. The report includes a ten-item review queue and a reproducible validation protocol. Korean-source confidence, IPA-analysis confidence, and Ukrainian-target confidence must remain separate dimensions.




## 24. Native IPA target renderer follow-up: CI-driven corrections (2026-10-24)

The first exact-head run for the browser target adapter and provenance trace failed two suites. The browser failures were assertions still pinned to the old feature schema and a deep-equality result shape that predated the added status/mapping trace. The Python failure was a case-sensitive `ROOT`/ `root` variable typo in the newly added browser/Python parity test. These were fixed in test contracts and the subprocess path; no linguistic mapping was altered to make CI green.

The browser regression suite passed on intermediate head `428f8e1dae2bf2c86e80bd203ee8939cf538d8f3`, but Python still failed on that same head due to the root-variable typo. Correction commit `317f0f106d230b10bbc42219ca1f9c3e5a369aa2` is the first head intended to contain the complete fixes. Its own CI must finish before marking the renderer verified.

**Status:** `PARTIAL`, not release-ready. A code-level parity suite is not an independent linguistic gold set. The original 24-form source manifest remains missing, official NIKL live retrieval is still blocked by documented HTTP 403 responses, and the Korean phonology / Ukrainian target gold sets require separate evidence-gated adjudication.




## 25. Verification closeout after IPA target regression fixes (2026-10-24)

System verification run [40132735568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132735568) passed Python regression/data integrity and browser regression/build on head `e462d15d9d31d4889ad562095ecb93f39247e8fe`. The focused tests workflow [40132671600](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40132671600) passed on `317f0f106d230b10bbc42219ca1f9c3e5a369aa2`; subsequent commits through `e462d15` updated the handoff/register/audit documentation only. Generated master table/corpus, paired native-vs-g2pK diagnostic, external UGTPHON diagnostic and browser G2P integration also passed on `e462d15` (runs 40132738836, 40132738928, 40132738858, 40132738885).

The official NIKL live inventory was skipped. Optional g2pK integration, morphology adapter smoke and multi-engine IPA diagnostic were still running at the last poll. Two known Korean surface differential cases, `넓죽하다` and `읽고`, remain explicit review items because the IPA reference is not independently adjudicated. The 24-form candidate fixture remains reconstructed/unverified.

**Updated status:** implementation regressions fixed and core system tests verified on the recorded heads; full task status remains `PARTIAL`, not release-ready, pending final-head checks, original holdout provenance, independent Korean IPA adjudication, independent Ukrainian target review, and permitted NIKL inventory retrieval.


## 26. Final verification status — 2026-10-24

All nine workflow families passed on implementation head `a80cacf0f2c36c40a172ea24aad5a67bb9ba5756`: system verification (40132976136), focused tests (40132976087), generated artifacts (40132976175), optional g2pK integration (40132976258), browser G2P (40132976122), paired native/g2pK diagnostic (40132976161), external UGTPHON diagnostic (40132976197), multi-engine IPA benchmark (40132976215), and research morphology adapter smoke (40132976263). The official NIKL metadata-only job was skipped and is not a pass. The 24-form source manifest remains missing from inspected tracked refs; the current 24-row CSV is explicitly unverified and has no independent IPA/Ukrainian gold. PRs #307 and #310 remain open/mergeable with overlapping Python renderer files; no blind merge/closure was performed. **Classification remains partial research prototype, not release-ready**, until original holdout provenance, independent Korean IPA adjudication, independent Ukrainian target review, and authorized NIKL inventory retrieval are resolved.

## 27. Exact-head verification after strict/candidate target-mode split — 2026-10-25

Code/test head `4f65943b514992b89ce31df5db2d4e971dc0b6a9` passed all nine relevant workflow families: system verification [40135565733](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565733), tests and clean wheel [40135565670](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565670), browser G2P [40135565682](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565682), optional g2pK [40135565680](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565680), generated master table/corpus [40135565706](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565706), paired native/g2pK [40135565751](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565751), UGTPHON [40135565684](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565684), morphology adapter smoke [40135565675](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565675), and multi-engine IPA/SIGMORPHON comparison [40135565671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40135565671).

A correctness regression was caught and fixed during this pass: strict target APIs now withhold provisional mappings by default, while the interactive research path opts in to display the best declared candidate with a visible provisional status. Lexical surface-only IPA mapping and vowel variants now use the same explicit candidate mode, retain target status in traces, and pass runtime IPA parity checks. The clean wheel check exercises both strict abstention and research-candidate output.

NIKL live inventory remains skipped because access is blocked; no claim of complete inventory validation. The 24-form source manifest remains unrecovered; independent Korean IPA and Ukrainian target gold are still unavailable. Two surface differential cases remain evidence-backed correction paths, not independent IPA/target gold. **Status: partial research prototype, not release-ready.**


### Benchmark outcome and interpretation — exact code head `4f65943` (verified 2026-10-25)

The multi-engine workflow passed and produced these **Korean IPA** diagnostic results; they are not Ukrainian-target accuracy scores:

| Dataset | ClippyFirst native | g2pK 0.9.4 | Interpretation |
|---|---|---|---|
| UGTPHON Korean test, 275 rows / 2,703 token occurrences | 2,655 scored; 98.22% coverage; 1,412 exact; exact rate 53.18% (bootstrap 95% CI 48.49–58.20%); CER 9.19%; 48 abstentions; 0 runtime errors | 2,703 scored; 100% coverage; 1,435 exact; exact rate 53.09%; CER 9.23%; 0 runtime errors | Near parity on paired examples; native is more conservative. |
| SIGMORPHON 2021 Korean lexical test, 1,000 rows / 999 token occurrences | 997 scored; 99.80% coverage; 357 exact; exact rate 35.81%; CER 14.70%; 2 abstentions; 0 runtime errors | 999 scored; 100% coverage; 353 exact; exact rate 35.34%; CER 14.82%; 0 runtime errors | Small paired advantage to native on this pinned lexical split. |

These exact-match rates are **not 90–95%**. The reference sets use IPA conventions that are not identical to the project's broad IPA (including phonetic diacritics and segment/annotation differences); normalization removes only selected convention differences. The corpora also have scope/annotation limitations. The 9.19% and 14.70% character error rates show substantially closer sequences than exact-match rates alone suggest, but neither metric proves normative correctness. Some differences may be real phonological errors; do not attribute all to notation. The next benchmark improvement must come from categorized mismatch review against independently adjudicated IPA, not from relaxing normalization until the score rises.

Most native abstentions on UGTPHON are deliberate unresolved morphophonological contexts: 25 R002 liaison/neutralization cases, 20 R003 ㅎ deletion cases, 2 R007 palatalization cases, and 1 each for R004 aspiration and IPA adjudication. These are coverage limitations, not runtime exceptions. This benchmark does not measure IPA→Ukrainian mapping accuracy.


### Correctness / UI candidate contract audit — 2026-10-25

Audited the full route from IPA adapter to Python pipeline and browser UI. The strict IPA renderer withholds final orthography for provisional target mappings and returns a candidate field. The Python pipeline now preserves that strict contract. The browser research UI intentionally keeps a useful candidate visible but explicitly labels the primary result, copy action and trace as provisional; no candidate is described as independent gold.

CI evidence at code head `5ccb880d0c0611efa1f7ef8ffd00a0d303778410`: system verification success (40177877602), browser G2P integration success with 1,220/1,220 tests (40177877624), dedicated test workflow success (40177877599), optional g2pK success (40177877654), native/g2pK differential success as diagnostic (40177877600), UGTPHON diagnostic success (40177877596). Python surface differential remains 18/20 with disagreements `넓죽하다` and `읽고`; IPA gold remains unadjudicated. NIKL live inventory skipped. Original holdout provenance, independent IPA gold, and independent Ukrainian target gold remain blockers. Classification: partial research prototype, not release-ready.


### PR convergence status correction — 2026-10-25

Earlier audit text recorded identical Python renderer/pipeline blobs for PR #307 and #310. That is stale after the latest correctness-gate changes: current blobs diverge. PR #310 has strict Python target abstention and browser UI candidate labeling; PR #307 retains the candidate 24-form fixture/provenance audit. Keep the fixture quarantined and reconcile only after reviewing the current diff. Both PRs remain open; no blind merge or closure.


### Exact-head evidence — 2026-10-25

All relevant workflows passed on implementation head `b41da53614f660d7f4b71fc9613730661715262b`: system verification, 1,220/1,220 browser tests, Python 3.11/3.12/3.13, wheel installation, generated artifacts, optional g2pK, paired native/g2pK diagnostic, UGTPHON, multi-engine benchmark, and Kiwi/MeCab-Ko morphology smoke. NIKL live inventory was skipped, not passed. The G2P differential still has two surface disagreements (`넓죽하다`, `읽고`) and no independent IPA gold. Provisional target spellings are labelled candidates in the browser UI and withheld from the strict Python renderer/pipeline. The original 24-form source, independent IPA adjudication, and Ukrainian target gold remain blockers. Not release-ready.


### Correctness hardening and holdout report restored — 2026-10-25

On branch `fix/clippyfirst-core-ipa-target-2026-10-24`, code/evidence head `aca93752c5d059300baf33bd576a5a0fea8fa4fa`, the public browser IPA helper API was hardened against false empty success and partial multi-syllable output. Provisional correspondences remain candidate-only by default; explicit research opt-in is type-checked and does not erase provisional status. Diagnostic traces remain available for failed inputs while target strings are withheld.

The PR #307 24-form candidate fixture, provenance audit, regression test and report runner were ported to the active branch. Exact-head g2pK workflow succeeded on Python 3.11/3.12, with 20 focused tests passing per runtime and a JSON report artifact uploaded. The current report shows 18 accepted native outputs + 1 candidate, and 23 accepted g2pK outputs + 1 candidate out of 24. This is not an accuracy score: the fixture remains `reconstructed_unverified` and has no independent IPA/Ukrainian gold.

Exact-head CI: system verification [40191515073](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515073), browser tests/build [40191515088](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515088), g2pK + fixture report [40191515065](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515065), browser G2P [40191515045](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515045), UGTPHON [40191515110](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515110), paired native/g2pK [40191515125](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515125), multi-engine [40191515023](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515023), morphology [40191515056](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515056), and master artifacts [40191515019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40191515019) all passed. The official live NIKL inventory step was skipped.

Still blocked: original holdout manifest, independent IPA adjudication, independent Ukrainian target gold/scoring, primary-evidence resolution of `넓죽하다` and `읽고`, and authorized live NIKL inventory. Status remains partial research prototype, not release-ready.
