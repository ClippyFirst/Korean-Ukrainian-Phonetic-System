# External Korean pronunciation test assets and dictionary controls — audit (2026-10-15)

## Executive decision

Do **not** replace this project's gold corpus with another G2P project's output. Use the National Institute of Korean Language (NIKL, 국립국어원) *표준 발음법* and licensed dictionary entries as the normative evidence layer; use external engines and their test suites as **differential / adversarial sources only**. Keep three distinct targets in every test record:

1. **Orthographic input** — what the user typed.
2. **Korean standard surface pronunciation** — the linguistically licensed target, with all permitted variants and context requirements recorded.
3. **Project output** — IPA first, then Ukrainian practical transcription derived from that IPA.

An external engine's Hangul pronunciation spelling is not itself IPA, and agreement between two engines is not independent proof.

## Source hierarchy

### Tier 1 — normative source

- NIKL, *표준 발음법*: <https://korean.go.kr/front/page/pageView.do?mn_id=97&page_id=P000097>
- Mobile mirror of the same rules: <https://m.korean.go.kr/front/page/pageView.do?mn_id=97&page_id=P000097>

The official document is organized by rules for consonants/vowels, codas, assimilation, fortition, and sound insertion. It must be the source of truth for rule-based tests. In particular, do not implement broad rules from a few examples: the regulation includes exceptions, lexical restrictions, and rule interactions.

- NIKL's official Q&A is useful as **supplementary interpretation**, not a replacement for the regulation. Example: the 2026 answer about ㄴ insertion across a phrase distinguishes saying two words as one prosodic unit from inserting a pause: <https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=333041>
- NIKL's 2026 answer explicitly warns that ㄴ insertion is not automatic in every apparently eligible word: <https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=328642>

**Rule for this repository:** each gold item must cite the exact rule number / dictionary entry / official Q&A that licenses its expected pronunciation. If the source does not determine the answer for the given context, the expected state must be `context_required` or `unresolved`, not a guessed pronunciation.

### Tier 2 — dictionary controls

- NIKL dictionaries landing page: <https://krdict.korean.go.kr/> (한국어기초사전), <https://stdict.korean.go.kr/> (표준국어대사전), <https://opendict.korean.go.kr/> (우리말샘).
- Community-maintained XML mirror and download/update notes: <https://github.com/spellcheck-ko/korean-dict-nikl>
- Separate XML mirrors: <https://github.com/spellcheck-ko/korean-dict-nikl-krdict> and <https://github.com/spellcheck-ko/korean-dict-nikl-stdict>

The mirror README states that the dictionary data are distributed under **CC BY-SA 2.0 KR**. Attribution and ShareAlike obligations therefore need to be respected if data are redistributed or adapted. It also warns that dictionary example sentences quoted from publications/news and linked audio/image/video/pronunciation media are not freely redistributable. Do not bulk-copy example sentences or audio into this repository. Prefer a compact control file containing only the minimum lexical fields needed, a source-entry identifier/URL, the source/version/date, and the expected pronunciation field.

**Important limitation:** the repository is a third-party mirror, not the Institute itself, and updates are irregular. For a release gate, record the dictionary dump/version date and cross-check contested cases against the official entry.

## External repositories audited

### 1. KoG2P — best first source for a broad rule-oriented adversarial list

Repository: <https://github.com/scarletcho/KoG2P>

Files inspected: `testset.txt`, `rulebook.txt`, `g2p.py`.

- The test set is a large tab-separated list of Korean input strings and Hangul pronunciation targets. It spans coda neutralization, complex codas, liaison, aspiration, palatalization, nasalization, liquidization, fortition, ㄴ insertion, and phrase examples.
- `rulebook.txt` makes rule ordering explicit, which is useful when designing interaction tests.
- The test harness compares predicted Hangul pronunciation against its own target list. It is **not an IPA corpus**, and the inspected files do not provide per-row citations to the NIKL rule/dictionary entry.
- The list contains duplicates and mixed granularity (single words, inflected forms, and phrases). It should be imported only after deduplication, provenance review, and normalization of the project's target conventions.
- License file is GPL-family (inspect the repository's exact license terms before copying code or test data). The safest immediate use is to create independently authored test items inspired by rule coverage, with fresh official citations, rather than copying its test file wholesale.

Use: **rule-coverage checklist and differential regression candidate**, not gold truth.

### 2. g2pK — valuable contextual comparator

Repository: <https://github.com/kyubyong/g2pK>

README and license inspected.

- Uses morphological context for ambiguous cases and supports separate prescriptive (default) and descriptive modes.
- The README demonstrates that `신고` can differ depending on context and that the particle `의` and syllable `계` have colloquial/descriptive variants.
- This is useful for testing the project's key policy: context-sensitive cases must not be forced through a context-free spelling rule.
- It depends on a morphological analyzer stack, so outputs may differ by dependency/version. Record the exact version and mode when using it for comparisons.
- Its code is Apache-2.0 licensed in the inspected repository; still keep attribution and check bundled dependencies/data separately.

Use: **context and mode differential tests**, especially ambiguous homographs, morphology, and prescriptive-vs-descriptive distinctions. Never treat its output as the normative reference.

### 3. SBV2-KR — most directly useful existing gold-set test design

Repository: <https://github.com/loverspath/SBV2-KR>

Files inspected: `tests/test_korean_goldset.py`, `tests/test_korean.py`, `style_bert_vits2/nlp/korean/pronounce.py`, `README.md`.

- The gold-set test groups cases by rule category and supports multiple allowed pronunciation strings.
- It includes complex-coda liaison, coda neutralization, lexical exceptions, ㄺ before ㄱ endings, ㅎ aspiration/deletion, palatalization, nasalization, liquidization, fortition, word-boundary cases, and an explicitly unresolved context-free `신고` case.
- It has a useful category report and fuzzing-oriented testing; the README documents running the gold-set suite without model weights.
- The implementation itself documents limitations such as ㄴ insertion and lexical exceptions that require morphology. This transparency is a positive sign.
- However, it is still a project-authored gold set. Each row must be independently checked against the current official regulation/dictionary before being promoted into this repository's gold data. The existence of a “goldset” filename is not proof of independent validation.
- The repository declares **AGPL-3.0**. Do not copy its code into this project without an explicit license decision. Reimplement the testing idea and author/cite your own fixture rows instead.

Use: **best template for category-based gold-set architecture**, plus a useful differential baseline once its dependencies are pinned.

### 4. IPA_G2P-Testing — benchmark framework, not normative gold

Repository: <https://github.com/kr-MATAGI/IPA_G2P-Testing>

- The README describes a comparative G2P-testing project with model runners and supporting datasets.
- It may help evaluate alternative systems and identify difficult examples, but it is model/benchmark-oriented rather than a substitute for rule-by-rule NIKL evidence.
- Before using any included data, inspect the exact dataset provenance, target IPA convention, license, and whether labels are human/lexicon verified or generated by another model.

Use: **optional secondary benchmark**, only after dataset provenance and licensing are verified.

### 5. korean-dict-nikl — primary practical route to lexical controls

Repository: <https://github.com/spellcheck-ko/korean-dict-nikl>

- Provides XML dictionary data downloaded from the NIKL dictionary services and documents the data's license/caveats.
- This is the strongest candidate in the audited set for creating lexical controls for exceptional words and listed pronunciations.
- Do not bundle the entire dictionary by default. Build a small, reproducible extraction pipeline that selects only relevant entries and records provenance.
- Pronunciation audio/media must not be mirrored merely because its URL appears in a dictionary dump.

Use: **lexical exception lookup / regression fixtures**, not a blanket dictionary shipped to the browser.

### 6. Other leads worth keeping on the watchlist

- <https://github.com/seongmin-mun/KoG2Padvanced> — referenced by the IPA_G2P-Testing project as a research-oriented G2P improvement effort. Inspect code, test assets, and license before use.
- <https://github.com/lifefeel/Grapheme-to-Phoneme> — resource collection referenced by IPA_G2P-Testing; use for discovery rather than as a gold source.
- <https://github.com/sungjin-ahn-dev/korean-reading-assessment> — includes G2P alignment and reading-assessment tests; its primary objective is pronunciation assessment, not an authoritative normative pronunciation corpus. Potential source of adversarial reading cases only.

## Key findings that affect our architecture

### A. A test suite needs more than input → one output

A robust record should support:
- multiple allowed standard pronunciations, when the authoritative source licenses them;
- `context_required` for homographs or morphology-sensitive cases;
- `phrase_mode_required` when word boundaries/prosodic grouping change the result;
- `unresolved` when the available input/source is insufficient;
- rule IDs and lexical source URLs;
- a confidence/provenance class separate from the predicted output.

Do not collapse “not yet implemented”, “ambiguous without context”, and “incorrect” into one status.

### B. Do not turn Hangul pronunciation spellings directly into IPA

External test sets commonly use a Hangul surface spelling such as `값이 → 갑씨`. That is a useful Korean control, but it is not an IPA gold label. For this project, preserve a staged test:
`orthography → licensed Korean surface form → IPA → Ukrainian output`.

For every case, test the stages separately. A correct Hangul surface form does not prove that the IPA inventory, phonetic distinctions, or Ukrainian mapping are correct.

### C. Rule interactions and lexical controls matter more than raw test count

Prioritize minimal contrasts and interaction pairs:
- complex codas + vowel-initial particles/endings: `넋이`, `몫이`, `값이`, `값어치`, `읽어`;
- ㄺ before different following consonants/endings: `읽고`, `읽는`, `읽어`, `맑게`, `늙고`;
- ㅎ combinations: `좋다`, `놓고`, `많다`, `싫어`;
- nasalization vs liquidization: `국물`, `독립문`, `신라`, `칼날`, `물난리`;
- palatalization: `굳이`, `같이`, `밭이`, `닫히다`;
- ㄴ insertion with known compounds, lexical exceptions, and phrase-boundary variants;
- `의` in initial, medial, final, particle, and consonant-onset contexts;
- word boundaries, punctuation, pause-vs-one-phrase readings;
- mixed input: Hangul + Latin, punctuation, compatibility jamo, decomposed jamo, IPA, and empty/non-Hangul input.

These are **candidate cases**, not gold answers until individually sourced.

### D. Keep strict and heuristic results separate

- **Strict/normative mode:** emit a licensed result only when the available orthography, lexical controls, and context support it; otherwise report the precise unresolved reason.
- **Soft/heuristic mode:** may offer a low-confidence proposal, but must label the heuristic, preserve a trace, and never silently promote the proposal to a standard pronunciation.
- Browser and Python implementations must share the same fixture schema and be tested against the same corpus. Differential agreement between them is an implementation consistency check, not linguistic validation.

## Recommended implementation sequence

1. **Freeze a machine-readable schema** for test cases (JSONL or TSV): `id`, `input`, `context`, `phrase_mode`, `expected_korean_surface_forms[]`, `rule_ids[]`, `source_type`, `source_url`, `source_version/date`, `validation_status`, `notes`.
2. **Build the source register** for all 30 standard-pronunciation rule articles and relevant official dictionary entries. Record every explicit exception and “다만” separately.
3. **Create an independently sourced seed corpus** from official examples and hand-checked dictionary controls. Keep external-repository-derived candidates in a separate, non-gold file until validated.
4. **Add interaction and negative tests** (where a superficially similar environment must not trigger the rule). Negative tests are essential for preventing overgeneralization.
5. **Add differential runners** for KoG2P, g2pK, and SBV2-KR where practical, pinning versions and treating disagreements as audit queues.
6. **Validate IPA independently** from the Korean surface target; then test Ukrainian rendering exclusively from IPA. Do not generate IPA gold labels by running the engine under test.
7. **Gate release on both implementations**: normative fixture pass, no silent fallback for unsupported inputs, no Hangul/Latin residue in IPA, and reproducible build/test output.
8. **Publish a provenance report** with per-rule coverage, unresolved cases, known limitations, and a clear distinction between normative accuracy and Ukrainian approximation quality.

## Licensing and data-handling decision

| Asset | Appropriate use | Do not do |
|---|---|---|
| NIKL *표준 발음법* / official Q&A | Cite rules and interpretations; author original fixtures | Treat a rule example as proof for unrelated words |
| NIKL dictionary XML mirror (CC BY-SA 2.0 KR) | Extract minimal lexical controls with attribution and license tracking | Repackage the whole dump without meeting license obligations |
| KoG2P testset/rulebook | Coverage checklist and differential test ideas | Copy code/data without checking GPL terms and row provenance |
| g2pK | Contextual comparison; record mode/version | Treat output as normative gold |
| SBV2-KR goldset/code (AGPL-3.0) | Study category design and test strategy | Copy implementation into the project without a license decision |
| IPA_G2P-Testing datasets | Optional benchmark after audit | Assume “IPA” means a compatible or authoritative IPA convention |

## Implementation follow-up — shared seed and CI (2026-10-15)

The first implementation step has now landed on the working branch:

- `tests/fixtures/normative-gold-seed-2026-10-15.json`: 100 source-linked controls spanning complex-coda liaison, lexical ㄼ behavior, palatalization, nasal assimilation, liquid assimilation, coda neutralization, and fortition.
- `tests/normative-gold-seed-2026-10-15.test.mjs`: validates required provenance fields, unique IDs, exact regression references, and browser surface/IPA outputs.
- `tests/test_normative_gold_seed.py`: runs the same fixture through the Python research engine and reconstructs Hangul from the post-rule onset/nucleus/coda fields before comparing the result. This avoids using the original spelling as a false proxy for the phonological surface.
- README now links the shared fixture and the external-source audit.

The fixture distinguishes `official-standard-example-checked`, `official-dictionary-entry-checked`, and `rule-derived-control-not-explicitly-listed`. The explicit examples and the `넓다` dictionary conjugation were checked against the official NIKL standard/dictionary pages; `값이` and `몫이` remain clearly labelled derived controls because they are not enumerated examples in §14. All 100 cases are also cross-linked to existing regression tests, and CI verifies the exact test-title references. This seed is not a claim that all rule subparagraphs have been independently re-audited.

**CI result:** the GitHub Actions run for commit `a8fd3874656c82f7b5c145e038924525a7eb876f` completed successfully. Both **Browser regression tests and build** and **Python regression and data integrity** passed. Run: <https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/38749729171>.

This is a validated first cross-runtime gate, not proof of complete linguistic correctness. The next pass should promote cases to `independently-verified` only after a row-by-row check against the official rule text or an official dictionary/Q&A entry, and should add explicit negative controls for every productive rule family.

## Audit limitations

This is a source/repository inspection, not a claim that every row in an external test suite has been validated. The files and READMEs listed above were inspected on 2026-10-15. The next quality step is a row-by-row source audit and the addition of independently validated fixtures—not bulk importing third-party outputs.


### Seed expansion follow-up (2026-10-15)

The shared cross-runtime seed was expanded from 11 to 16 cases. The five new controls are exact examples from NIKL §§17, 18, and 20: 굳이[구지], 국물[궁물], 먹는[멍는], 신라[실라], and 난로[날로]. Each points to the official standard and an exact existing regression-test title. This improves rule-family diversity but does not establish exhaustive coverage of any article; CI is the arbiter for whether the project engines reproduce the declared project IPA and surface forms.

## Expanded source pass (2026-10-15)

### External engines and test resources reviewed

- [KoG2P](https://github.com/scarletcho/KoG2P): inspected the repository README, `rulebook.txt`, and `testset.txt`. Its rulebook is useful for rule ordering and stress-case discovery; its testset contains written Hangul surface outputs, not official IPA labels. It is GPL-3.0, so this project records it as an external reference and does not copy its implementation or bulk-import its testset.
- [g2pK](https://github.com/kyubyong/g2pK): inspected its README and implementation. It explicitly distinguishes prescriptive from descriptive output and uses morphological context for homographs such as 신고. These are architectural requirements, not labels to import as normative truth. License: Apache-2.0.
- [g2pk2](https://github.com/tenebo/g2pk2): inspected its README, which specifically notes fixes to the §15 substantive-morpheme liaison issue and a §13 issue. This is an independent review signal, not proof of every form. License: Apache-2.0.
- [IPA_G2P-Testing](https://github.com/kr-MATAGI/IPA_G2P-Testing): inspected the README and benchmark summary. Its metrics and dataset inventory are useful for planning independent evaluation, but its repository license was not verified in this pass, so no data/code is copied.

### Bulk normative fixture expansion

The shared cross-runtime normative seed now contains **98 cases**. In this pass, 73 additional source-linked controls were added across NIKL §§13, 14, 15, 17, 18, 21, 23, and 30, on top of the earlier §9–20 coverage. The controls cover liaison, complex-coda liaison, substantive-morpheme liaison, palatalization, nasal assimilation, negative controls against non-standard place assimilation, coda-triggered fortition, and the three main saisiot realization patterns. The added examples use the official NIKL article text as their evidence source and are cross-linked to an executable browser regression gate.

The 9 §19–20 forms that exercise the *general algorithm* (침략, 강릉, 막론, 석류, 협력, 법리, 천리, 닳는, 핥네) are now present as `surface-only` reference rows in `lexical_pronunciations.csv`. This status is important: the browser still runs the generic rule engine and retains its rule trace; the row only supplies the independently sourced surface form and, when all segments match apart from length, the attested vowel-length mark. Tests explicitly reject any `lexical-pronunciation` bypass for these forms. Exact lexical readings must not conceal a broken productive rule.

### Known limitation made explicit

The official §19 example is written with a long-vowel mark, 침략[침ː냑]. The new `surface-only` row restores `tɕʰiːm` only after confirming that the computed IPA matches the sourced form when the length mark is removed. This closes the known gap for that attested word without converting the whole row into a lexical override. General vowel length remains lexically conditioned and is not inferred for unseen words.

The expanded corpus remains finite example coverage. The rule engine should stay conservative for unknown morphology and should not treat every adjacency as a licensed morphological boundary.


The lexical inventory also gained two exact source-backed entries for the NIKL §30 commentary examples 훗일[훈ː닐] and 뒷일[뒨ː닐]. These are recorded as provisional Ukrainian targets derived from IPA; their Korean standard surface forms and source-attested vowel length are explicit. The lexical inventory snapshot is now 658 data rows, with the nine surface-only references plus these two entries added to the prior 642-row inventory.


## Follow-up mass pass — official §28–§30 examples and source inventory (2026-10-15)

### Additional primary-source controls

The NIKL page was re-read at the rule text and commentary level, not only at the heading level:

- **§28:** the complete listed compound-fortition family was cross-checked, including the lexical/semantic caveat in the commentary. The rule is not generalized from coda adjacency alone: the standard explicitly notes compounds such as 가을고치, 민물송어, 운동자금, 콩기름, 물불, 손발, 돌부처, 콩밥, 물장난, 불고기 where the same broad semantic tendency does not guarantee fortition. These are important negative/lexical-lookup controls.
- **§29:** the complete listed examples, the alternation paragraph (이죽이죽, 야금야금, 검열, 욜랑욜랑, 금융), the ㄹ-coda attachment paragraph, phrase-boundary examples, and explicit non-insertion examples (6·25, 3·1절, 송별연, 등용문) were reviewed. The commentary also names cases where insertion may occur and cases where it does not; a generic rule must not silently force insertion into every eligible spelling.
- **§30:** all three subparagraph families were reviewed, including the explicitly permitted pair of readings for §30(1), the mandatory nasal outcomes for §30(2), and the chained nasal-insertion examples for §30(3). Length marks in NIKL examples are source evidence and should be preserved in IPA when the project has a supported lexical-length decision.

Official rule text and commentary: <https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002>

### What changed in this follow-up

- Expanded `tests/fixtures/normative-gold-seed-2026-10-15.json` from **100 to 151 controls**.
- Added **51 source-linked controls** from the existing lexical table: §28 compound fortition, §29 insertion and nasal/liquid interactions, variant pronunciations, and explicit negative controls.
- Added explicit minimum-count assertions for the 151-case set, the §28 family, and the §29 family in `tests/normative-gold-seed-2026-10-15.test.mjs`.
- One inflected form, `삯일을`, is marked as a **derived control**, not misrepresented as a word explicitly enumerated by NIKL. The underlying `삯일` is official evidence; the inflection tests compositional interaction and remains project-derived.
- Registered additional source leads S016–S019 in `data/korean/sources.csv`: SBV2-KR's category-based gold-set test design, the NIKL dictionary XML mirror and its license caveats, and two NIKL official Q&A items clarifying phrase-boundary insertion and formal/substantive morpheme liaison.

### Source and licensing decisions

- SBV2-KR is a **test-design/differential reference**, not an independent normative authority. Its repository declares AGPL-3.0; do not copy its code or test rows into this project without a separate license review and source-by-source validation.
- The NIKL dictionary XML mirror states CC BY-SA 2.0 KR for dictionary data, but warns that quoted literary/news examples and linked audio/media are not freely redistributable. Do not bulk-vendor the XML or media into the browser bundle. Prefer minimal lexical controls with attribution, entry URL/version, and the least data necessary.
- Official NIKL Q&A is supplementary interpretation, not a substitute for the rule text or a dictionary entry. It can establish a context requirement or clarify a boundary but does not authorize a blanket rule beyond the answer's scope.

### Remaining coverage gaps (do not call the project complete)

1. The 151-case set is still finite; it is not an exhaustive lexicon and cannot prove all productive morphology.
2. The current lexical table contains project IPA and Ukrainian approximations. NIKL publishes Hangul surface forms, not the project's IPA transcription; those IPA targets need independent phonetic-convention review and must not be presented as NIKL IPA.
3. A few standard examples have licensed alternatives. They must remain a set of accepted outputs, not be collapsed into a single supposedly universal surface form.
4. §28 fortition and §29 ㄴ insertion are lexically/morphologically conditioned. The browser engine must keep fail-closed behavior for unknown compounds and phrase boundaries instead of inferring a license from spelling adjacency.
5. External G2P agreement is a disagreement detector only. KoG2P, g2pK/g2pk2, and SBV2-KR do not replace NIKL/dictionary evidence; benchmark licenses and target conventions must be checked independently.
6. A full final audit still needs a live test run after this fixture expansion, followed by a rule-by-rule failure review. Passing CI means the declared tests pass, not that every Korean word is resolved.


### Additional external-source pass

The external inventory was extended beyond the first four comparators:

- **KoG2Padvanced** (<https://github.com/seongmin-mun/KoG2Padvanced>): inspected its README, rulebook/test-set inventory, and linked 2022 peer-reviewed comparison paper. It documents useful edge cases for ㅎ deletion, ㅢ/ㅖ variation, and non-standard place assimilation. The inspected repository tree has no `LICENSE` file; treat it as **reference-only** and do not copy its implementation or test set. Some described place-assimilation outputs are descriptive/colloquial rather than normative; they must not be added as standard pronunciation rules without an NIKL/dictionary basis.
- **g2pk3** (<https://github.com/kdrkdrkdr/g2pk3>): README identifies a §20 fix and Japanese transcription; its repository has an MIT license. It remains a differential comparator, not a gold source. Validate the exact revision, runtime dependencies, and test-data provenance before using its outputs.
- **Korean reading assessment** (<https://github.com/sungjin-ahn-dev/korean-reading-assessment>): inspected the README and test inventory. Its goal is reading assessment/alignment rather than open-ended normative G2P. No repository license file was found in the inspected tree, so it is reference-only; do not copy code, task data, audio, or model artifacts.
- **Peer-reviewed comparison:** Mun, Kim & Ko (2022), “A proposal to improve on existing Grapheme-to-Phoneme conversion models informed by linguistics,” *Language and Information* 26(2), 27–46. This provides research context for rule additions and comparative testing, but the official NIKL standard and dictionary evidence still decide normative labels.

These entries are registered as S020–S023 in `data/korean/sources.csv`. Together with S012–S019, the source register now distinguishes normative sources, supplementary official Q&A, peer-reviewed research, reference engines, benchmark projects, and dictionary mirrors. A repository being public or a package being MIT/Apache licensed does not automatically make its data, examples, models, or dependencies reusable.


### Newly exposed implementation gap — NIKL §12(2)–(3)

The article-by-article pass exposed a real mismatch between the browser engine and the Python research rule engine. The browser already had explicit traces for ㅎ-coda + ㅅ and ㅎ-coda + ㄴ, but the Python rule R004 did not implement those two NIKL patterns. The rule was therefore only partially equivalent across runtimes.

Fixed on this branch:

- R004 now handles **ㅎ/ㄶ/ㅀ + ㅅ** by dropping the ㅎ component, retaining ㄴ/ㄹ where present, and fortisizing ㅅ, as in 닿소[다ː쏘], 많소[만ː쏘], 싫소[실쏘].
- R004 now handles **ㅎ + ㄴ** as a nasal realization and preserves the ㄴ/ㄹ component in ㄶ/ㅀ before later assimilation, as in 놓는[논는], 쌓네[싼네], 않네[안네], 않는[안는], 뚫네[뚤네→뚤레], 뚫는[뚤는→뚤른].
- Added source-linked Python regressions for both subrules. The final CI run for these changes passed both the Python regression/data-integrity job and the browser regression/build job.

This is an example of why the audit cannot stop at “all 30 articles are listed in a coverage ledger”: the same normative rule must be checked in every runtime implementation, including intermediate rule ordering and retained consonants.


### Bibliographic and canonical-link correction pass

The source-register audit also found metadata defects unrelated to the phonology rules themselves:

- S001 previously linked to a general NIKL page and described “Chapters 1–7,” which did not identify the actual pronunciation standard. It now links directly to the canonical NIKL Standard Pronunciation Rules page and explicitly covers Articles 1–30 plus commentary.
- S003–S005 author fields were normalized to identifiable author names and the article titles/volume/page metadata were corrected against the DOI-linked records.
- S006 previously used a generic NIKL download endpoint and a page range that was not well-supported. It now points to the exact 2014 Standard Korean Grammar Development PDF and identifies the vowel-system section; its PDF page numbering is explicitly marked for final manual verification rather than being asserted as certain.

These changes make the source ledger auditable: an entry should point to the actual standard/article/document, distinguish normative evidence from acoustic or model-comparison evidence, and avoid presenting uncertain bibliographic details as settled facts.


### Official Q&A pass: positive and negative §29 controls

A further pass through the official NIKL Q&A records added seven exact Q&A-backed controls to the normative seed plus two clearly labelled derived inflection controls. This extends the fixture to **160 cases**. The additions include:

- Positive insertion/assimilation chains: 꽃잎[꼰닙], 밭이랑[반니랑], 집안일[지반닐], 공업용[공엄뇽].
- Negative controls against automatic insertion: 값있다[가빋따], 곧이어[고디어], 음용[으묭].
- Derived controls: 홑이불을, composed from the officially listed base form 홑이불[혼니불], and 삯일과, composed from the official 삯일[상닐] example. Neither inflected form is mislabelled as an explicitly enumerated standard example.

The relevant Q&A records are now registered as S024–S028 in the source ledger. The distinction between **source-confirmed surface form** and **our derived IPA / Ukrainian rendering** remains explicit. In particular, the Q&A about 밭이랑 confirms the standard surface [반니랑] but notes that scholars differ on the exact ordering analysis; the engine must test the final form without asserting an unsettled derivational ordering as normative fact.

