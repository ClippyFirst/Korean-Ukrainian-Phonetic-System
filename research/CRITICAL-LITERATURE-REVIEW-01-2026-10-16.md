# Critical Literature Review — Evidence Memo 01

Date: 2026-10-16  
Scope: first evidence-backed review pass for Korean G2P, rule formalization, pronunciation variation, and Ukrainian target-language transcription.

## Evidence policy

This memo distinguishes (A) claims supported by accessible full text, (B) claims supported only by an abstract/metadata page, and (C) proposed project actions. It is not honest to describe an article as fully reviewed when only its abstract or bibliographic record was available. Page-specific findings below are included only where the accessible source provides page-level text.

## 1. Mun, Kim & Ko (2022): evaluate each rule, not just overall accuracy

**Source:** Seongmin Mun, Su-Han Kim, Eon-Suk Ko, “A proposal to improve on existing Grapheme-to-Phoneme conversion models informed by linguistics,” *Language and Information* 26(2), 27–46. DOI 10.29403/LI.26.2.2.  
**Accessible evidence:** KCI article record and abstract; full article text was not available through the accessible page in this pass.  
**Links:** https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002922160 ; https://kiss.kstudy.com/Detail/Ar?key=3995348

### Evidence in the abstract
- The authors compare g2pk and KoG2P against a manually phonetically transcribed gold corpus.
- They evaluate model performance for individual phonological rules, not only an aggregate score.
- Their modifications include h-deletion, variation of ㅢ, place assimilation, and rule ordering involving h/th-neutralization.
- They identify binary rule application and lack of prosodic-boundary information as limitations of existing rule-based approaches.
- They propose modeling the stochastic nature of phonological processes and effects such as lexical frequency and speech register.

### Implications for this project
1. Build a human-adjudicated gold corpus with source provenance; do not use one candidate engine's output as ground truth.
2. Report per-rule precision/recall or exact success rate, as well as overall phoneme error rate.
3. Keep standard pronunciation and spoken variation as separate tracks.
4. Make rule order a testable property.
5. Do not add probabilistic variation to the standard-pronunciation path without an explicit product decision and separate evidence.

### Still required
Obtain the full text and record page/section locations, exact corpus size/composition, annotation protocol, examples, split methodology, and evaluation definitions before treating this as a full paper review.

## 2. Yoon & Brew (2006): interpretable morphophonological rules can scale, but need error analysis

**Source:** Kyuchul Yoon and Chris Brew, “A linguistically motivated approach to grapheme-to-phoneme conversion for Korean,” *Computer Speech & Language* 20(4), 357–381. DOI 10.1016/j.csl.2005.03.002.  
**Accessible evidence:** full-text preprint indexed by CiteSeerX.  
**Link:** https://citeseerx.ist.psu.edu/document?doi=53f2a19c17908da4639a4c9094597f0be93db0d1&repid=rep1&type=pdf

### Findings from accessible full-text extract
- The system is built in Festival's rewrite formalism and uses nine hand-written morphophonological rules.
- It was applied to 1.3 million distinct space-delimited eojeols from a Korean Newswire corpus.
- Three native Korean speakers assessed a stratified sample. The paper reports 91.17% acceptable word types and 99.63% grapheme-token correctness in its own setup.
- The authors argue that abstracting linguistic knowledge into explicit rules makes error analysis straightforward and can help identify features for a hybrid model's exception-handling component.

### Implications
- Explicit rules and readable error traces remain defensible for this project; scale alone does not force a neural architecture.
- The reported 99.63% is not comparable directly to another paper's PER or to our future benchmark unless corpus, unit, normalization, and annotation conventions match.
- Our tests should preserve both rule-local and word/sentence-level error views; token accuracy can conceal a small number of severe lexical failures.

### Still required
The web index exposed the paper text, but a page-by-page extraction and formal comparison with our current rule table has not yet been completed. Exact page references for individual rule definitions must be added after PDF review.

## 3. Lee, Kim & Lee (2009): hybrid rule + statistical model, and morphology can help or hurt

**Source:** Jinsik Lee, Byeongchang Kim, Gary Geunbae Lee, “Hybrid Approach to Grapheme to Phoneme Conversion for Korean,” INTERSPEECH 2009, 1291–1294. DOI 10.21437/Interspeech.2009-404.  
**Accessible evidence:** full conference paper.  
**Link:** https://www.isca-archive.org/interspeech_2009/lee09c_interspeech.pdf

### Findings from accessible full text
- The paper explicitly contrasts knowledge-based hand-written rules and data-driven methods: the former struggle with some changes and exceptions; the latter are vulnerable to data sparsity.
- Its hybrid system combines a linguistically motivated rule-based converter with a Maximum Entropy statistical converter.
- Korean syllable blocks are decomposed into onset, nucleus and coda (choseong, jungseong, jongseong), yielding a useful canonical representation for alignment.
- The paper explains that Korean orthography is morphographic: written stems may preserve a stable form despite morphophonological changes.
- Example contrast in the paper: /geot-e/ ‘on the outside’ versus /geot-os/ ‘an outer garment’, where the final consonant outcome depends on whether the following sequence is a bound morpheme or a free morpheme.
- It notes that correct morphological information can help, but erroneous morphological analysis can reduce G2P accuracy.
- The proposed hybrid puts morphologically sensitive boundary cases through hand-written patterns/connectivity constraints and uses a statistical model for other cases.

### Implications
- This is a direct precedent for comparing rule-only, morphology-aware, and hybrid approaches on one benchmark.
- A morphology analyzer must be evaluated as a dependency, not treated as an infallible oracle.
- Keep strict standard rules deterministic. Any statistical fallback should be visibly marked, reproducible, and unable to silently overwrite source-confirmed normative cases.
- The project can adopt the *evaluation question* without adopting the paper's model: which residual cases are genuinely unsolved by the rule engine, and can a learned component improve them without harming verified cases?

### Still required
Extract exact experimental corpus, splits, baseline comparisons, feature representation, and quantitative results into the method-comparison matrix.

## 4. Lee & Lee (2009): contextual rule induction and pruning

**Source:** Jinsik Lee and Gary Geunbae Lee, “A data-driven grapheme-to-phoneme conversion method using dynamic contextual converting rules for Korean TTS systems,” *Computer Speech & Language* 23(4), 423–434. DOI 10.1016/j.csl.2009.01.001.  
**Accessible evidence:** publisher abstract and indexed excerpts; full article not yet reviewed page by page.  
**Link:** https://www.sciencedirect.com/science/article/abs/pii/S0885230809000023

### Evidence available
- The method includes grapheme–phoneme alignment, rule extraction, and rule pruning.
- It explicitly addresses exceptional pronunciations present in speech databases.
- The abstract reports phoneme-level accuracies of 99.22% with the full rule set and 99.11% with reduced rules, under the authors' experimental setup.

### Implications
- Rule count is not a quality metric by itself. Pruning should be evaluated for coverage, conflicts, explainability, and generalization.
- A project rule register could track redundant, conflicting, and untested rules; automatically induced rules should remain proposals until linguistically reviewed.
- Its results cannot be ranked against Yoon & Brew's reported numbers without normalizing evaluation units and datasets.

### Still required
Full text, exact alignment algorithm, corpus, split, pruning criterion, exception handling, and detailed error analysis.

## 5. Lee & Yim (2003): formalizing the standard as Petri nets and testing completeness

**Source:** Gye-Young Lee and Jae-Geol Yim, “Computerization and Application of the Korean Standard Pronunciation Rules,” *Language and Information* 7(2), 81–102 (KCI metadata; some secondary records list 81–101).  
**Accessible evidence:** KCI abstract and bibliographic record; full text not yet obtained.  
**Link:** https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART000986701

### Evidence in abstract
- The authors model individual items of the Korean Standard Pronunciation Rules as Petri nets and integrate them into a sound-conversion table.
- They also reverse the mapping to produce a character-conversion table.
- They test datasets intended to reflect all standard-rule items and claim to evaluate soundness and completeness, alongside processing speed.

### Implications
- This is a strong candidate for a rule-coverage model: every normative article should map to formal conditions, expected transformations, and tests.
- However, "completeness" is relative to their selected dataset and formal scope; it is not proof that every possible word or morphosyntactic context is covered.
- A lightweight dependency graph or declarative rule registry may be sufficient. Implementing Petri nets should be justified by a concrete verification benefit.

### Still required
Retrieve full text and inspect the Petri-net representation, sound/character table schemas, test-set construction, and exact definition of soundness/completeness.

## 6. Yoon (2015): output the rule trace so variation can be explained

**Source:** Weonhee Yoon, “Grapheme to Phoneme Conversion for Tracing Pronunciation Deviation,” *Language Science Studies* 73, 137–154.  
**Accessible evidence:** KCI abstract and reference list.  
**Link:** https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002023942

### Evidence in abstract
The paper distinguishes expected pronunciation from real pronunciations that deviate from expectation, and proposes a G2P system that outputs both the expected pronunciation and the phonological rules applied, allowing the source of variation to be traced.

### Implications
- Add a structured trace to test fixtures: input span, normalized representation, rule IDs and order, lexical overrides, resulting IPA segments, and evidence provenance.
- Keep rule trace separate from user-facing explanatory prose.
- This source supports traceability as a design goal; exact internal data structures must wait for full-text review.

### Still required
Read the full paper and extract rule ordering, pronunciation-dictionary architecture, and how deviation was represented and evaluated.

## 7. Yun et al. (2015): real speech needs a distinct corpus and annotation protocol

**Source:** Weonhee Yun et al., “The Korean Corpus of Spontaneous Speech,” *Phonetics and Speech Sciences* 7(2), 103–109. DOI 10.13064/KSSS.2015.7.2.103.  
**Accessible evidence:** full abstract and dataset documentation.  
**Links:** https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002007633 ; https://openslr.org/113/

### Findings
- The Seoul Corpus records interview-style spontaneous speech from 40 native Seoul Korean speakers, balanced by four age groups and sex.
- It contains around 220,000 phrasal words with phonemic labels and boundaries for phrasal words and utterances.
- The paper reports 98.1% inter-labeler agreement for phoneme identification and a mean boundary-placement deviation of 9.04 ms.
- OpenSLR lists the resource as CC BY-NC 2.0, with separate readme/manual, labels, and audio archives.

### Implications
- Suitable for a separate exploratory variation/prosody track, not as the gold corpus for standard NIKL pronunciation.
- The non-commercial license is a material constraint: do not bundle, redistribute, or use for a commercial training pipeline without a reviewed legal basis.
- Speech annotation and phonemic transcription conventions must be checked before comparing labels with our IPA convention.

## 8. Kozmin (2025): Ukrainian receiving-language practice is a separate research problem

**Source:** Mykhailo Kozmin, “Korean Names in Screen Translation: Transliteration Issues in Ukrainian Adaptations,” *Bulletin of Taras Shevchenko National University of Kyiv. Oriental Languages and Literatures* 1(31), 59–63. DOI 10.17721/1728-242X.2025.31.59-63. CC BY 4.0.  
**Accessible evidence:** full article HTML abstract, references, methods, conclusions, and a downloadable PDF link (PDF extraction still pending).  
**Link:** https://oriental.bulletin.knu.ua/en/article/view/4049

### Findings from article page
- Methods: descriptive, comparative, and linguacultural analysis.
- Scope: Korean personal names in Ukrainian audiovisual adaptations, particularly Netflix series.
- It compares Latin- and Cyrillic-based systems, including McCune–Reischauer, Revised Romanization, Yale, and Holodovich–Kontsevich.
- It reports inconsistency in Ukrainian localization, including mixed use of systems and phonetic/cultural distortions.
- Its references directly identify two important Ukrainian studies for follow-up: Kovalchuk (2011), on a unified practical transcription system for Korean proper names, and Shchegel (2009), “Practical transcription of Korean names into Ukrainian: Comparison, problems and proposals.”

### Implications
- Treat the target-language layer as a separate normative/usage research track, not a mechanical final step after Korean G2P.
- Create a comparison matrix for proposed Ukrainian mappings: phonetic rationale, examples, exceptions, Ukrainian phonotactics, consistency, and intended scope (names vs all words).
- Do not treat findings about audiovisual names as proof of a universal system for all Korean vocabulary.

### Still required
Read PDF pages 59–63, extract the article's actual case-study examples and recommendations, then retrieve and compare Kovalchuk (2011) and Shchegel (2009) in full.

## 9. Newly discovered primary Ukrainian source: Shchegel (2009)

**Source:** О. М. Щегель, “Практична транскрипція корейських імен українською мовою: порівняння, проблеми, пропозиції,” *Мовознавство*, 2009, № 1, с. 76–87.  
**Accessible evidence:** indexed PDF text.  
**Link:** https://nasplib.isofts.kiev.ua/bitstreams/10921b8d-8ffa-45b4-8315-ffc28aa24831/download

### Findings from accessible text
- The proposal focuses on Korean proper names and uses South Korean writing/orthography as the basis.
- The author discusses existing systems, problems in rendering Korean names and surnames, and proposes recommendations for practical use.
- The paper explicitly notes that its proposals for common nouns are incomplete and need further study.

### Implications
- This is a primary Ukrainian target-language source, but its declared scope is chiefly proper names; it must not be generalized uncritically to a universal Korean-to-Ukrainian converter.
- Compare it against the project's IPA-first principle, identifying which mappings reflect phonetic reasoning and which depend on orthography or convention.
- Preserve disagreements in a decision table rather than silently selecting one system.

### Still required
Read all 12 pages and extract each proposal with page numbers and example forms; validate the bibliographic details against the journal issue.

## 10. New direction: Kovalchuk (2011)

Kozmin (2025) cites: Yu. A. Kovalchuk (2011), “Problemy ta perspektyvy stvorennia unifikovanoi systemy ukrainskoi praktychnoi transkryptsii koreiskykh vlasnykh nazv,” *Movni i kontseptualni kartyny svitu*, 36, 468–473.

This is now a priority source-discovery task. The bibliographic record was verified via Kozmin's references, but the article's full text and exact recommendations have not yet been located. Do not summarize its conclusions until the paper itself is obtained.

## 11. Architecture comparison: current hypotheses, not a premature decision

| Family | Strongest reason to consider | Principal risk | Current disposition |
|---|---|---|---|
| Deterministic normative rules | Traceable, testable, aligned to NIKL standard | Context/morphology gaps and exception burden | Retain as standard-path backbone |
| Morphology-aware rules | Can distinguish morphologically conditioned alternations | Analyzer errors propagate into output | Benchmark as dependency |
| Lexicon-first + rules | Handles lexicalized/irregular pronunciations | Coverage, staleness, license, conflicting entries | Prototype after data terms review |
| Induced contextual rules | May discover missing conditions and reduce redundancy | Learns dataset artifacts; rule provenance weak unless preserved | Offline research tool only initially |
| Rule + statistical/MaxEnt fallback | Addresses rule gaps and sparse exceptions in a hybrid | Nondeterminism/opaque fallback, train data dependence | Benchmark on residual cases only |
| Neural G2P + knowledge base | Can generalize from data while using phonological features | Requires data, model provenance, explainability and robust evaluation | Research comparator, not replacement |
| Petri-net / finite-state / declarative formal model | Makes rule dependencies and coverage mechanically inspectable | Formalization overhead; possible mismatch with morphology/context | Prototype only if coverage audit benefits |
| Human-curated gold corpus | Independent correctness reference and adjudication | Expensive; coverage remains finite | Highest-priority infrastructure |

## 12. Required next actions

1. Obtain full text of Mun et al. (2022) and extract page-level examples, rule definitions, corpus details, and evaluation protocol.
2. Page-review Yoon & Brew (2006) and map the nine rules to our rule IDs and test coverage.
3. Extract all quantitative methodology from Lee et al. (2009) hybrid paper and Lee & Lee (2009) data-driven paper; do not compare their scores without compatible conditions.
4. Obtain Lee & Yim (2003) full text and evaluate Petri-net formalization against a simpler declarative rule schema.
5. Review all pages of Shchegel (2009) and Kozmin (2025); locate Kovalchuk (2011).
6. Create a shared benchmark schema and independent gold corpus before any architecture replacement.
7. Record source licensing before corpus ingestion; specifically, Seoul Corpus CC BY-NC 2.0 blocks assuming unrestricted commercial reuse.
8. Correct the source queue so the Seoul Corpus points to DOI 10.13064/KSSS.2015.7.2.103 and OpenSLR SLR113, not to the unrelated 2015 rule-tracing article.
