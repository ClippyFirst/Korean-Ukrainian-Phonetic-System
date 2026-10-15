# Literature and Methodology Review: Korean–Ukrainian Phonetic System

Last updated: 2026-10-15

Status: discovery review; not yet a full-text, page-by-page critical review. Inclusion means "must assess", not "adopted" or "validated". The research programme must consider multiple methodological families, not only a linguistically motivated rule-based G2P approach.

## 1. Scope and evidence labels

This review separates four questions that must not be conflated:

1. **Korean pronunciation inference**: what standard or contextual Korean surface pronunciation is supported?
2. **Representation**: how is the inferred pronunciation encoded in IPA or another explicit phonetic representation?
3. **Ukrainian practical rendering**: how should that pronunciation be represented for Ukrainian readers?
4. **Software engineering and evaluation**: how are rules, alternatives, uncertainty, provenance, and regressions represented and tested?

For every source, record the exact bibliographic identity, accessible full text, page/section, claim used, source authority, license/access conditions, and project decision. Abstract-only discovery is not enough to claim that a method has been fully reviewed.

## 2. Priority literature

### P0 — Directly relevant to Korean G2P architecture and rule evaluation

1. **Mun, Seongmin; Kim, Su-Han; Ko, Eon-Suk (2022). “A proposal to improve on existing Grapheme-to-Phoneme conversion models informed by linguistics.” _Language and Information_ 26(2), 27–46.**  
   https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002922160  
   Contribution: manually transcribed gold corpus; compares g2pk and KoG2P by individual phonological rule; discusses ㅎ deletion, ㅢ variation, place assimilation, rule ordering, categorical/binary assumptions, prosodic boundaries, lexical frequency and speech register.  
   Project use: highest-priority blueprint for per-rule scorecards and independent gold data. Do not assume its corpus or exact rule decisions can be reused without inspecting the full text and terms.

2. **Yoon, Kyuchul; Brew, Chris (2006). “A linguistically motivated approach to grapheme-to-phoneme conversion for Korean.” _Computer Speech & Language_ 20(4), 357–381.**  
   https://doi.org/10.1016/j.csl.2005.03.002  
   Contribution: hand-written, linguistically motivated morphophonological rules implemented in Festival; applied to 1.3 million distinct orthographic eojeols and evaluated with native-speaker judgments. The paper emphasizes contextual structure, syllable position, morpheme boundaries, and inspectable error analysis.  
   Project use: compare explicit rule coverage and error taxonomy; treat reported scores as study-specific, not directly comparable to this project's metrics.

3. **Lee, Jinsik; Lee, Gary Geunbae (2009). “A data-driven grapheme-to-phoneme conversion method using dynamic contextual converting rules for Korean TTS systems.” _Computer Speech & Language_ 23(4), 423–434.**  
   https://doi.org/10.1016/j.csl.2009.01.001  
   Contribution: alignment, contextual rule extraction, and pruning; uses pronunciation symbols from a speech database and handles exceptional pronunciations. It explicitly discusses limitations of morpho-syntactic analysis and mismatch between rules and the actual speech database.  
   Project use: assess a hybrid policy: productive, source-grounded rules for regular patterns; exact lexicon entries for justified exceptions; learned suggestions only when evidence and evaluation are available.

4. **Kim, Byeongchang; Lee, WonIl; Lee, Geunbae; Lee, Jong-Hyeok (1998). “Unlimited Vocabulary Grapheme to Phoneme Conversion for Korean TTS.”**  
   https://arxiv.org/abs/cmp-lg/9806008  
   Contribution: modular pipeline including morpheme normalization, phrase-break detection, morpheme-to-phoneme conversion, and phoneme-connectivity checking.  
   Project use: inspect its explicit separation of stages and treatment of morpheme/phrase boundaries. Historical methods and reported results require context before comparison with modern systems.

5. **Lee, Gye-Young; Yim, Jae-Geol (2003). “Computerization and Application of the Korean Standard Pronunciation Rules.” _Language and Information_ 7(2), 81–102.**  
   https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART000986701  
   Contribution: models individual Standard Pronunciation Rules as Petri nets, integrates them into sound-conversion tables, and tests coverage against datasets reflecting the rules.  
   Project use: evaluate whether rule metadata and dependencies should be formalized as a graph/state-transition model, and whether machine-checkable coverage can be generated from the standard.

6. **Yoon, Wonhee (2015). “Grapheme to Phoneme Conversion for Tracing Pronunciation Deviation.” _Language Science Studies_ 73, 137–154.**  
   https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002023942  
   Contribution: proposes generating both expected pronunciation and the phonological rules applied, so deviations in actual speech can be traced.  
   Project use: highly relevant to provenance/traces. Each output should explain which source-backed rules, lexical overrides, external backend, or project inference contributed to it.

7. **Kim, Okyoung (2009). “Phonological constraints in Standard Korean Pronunciation.” _Language and Information Society_ 11, 29–67.**  
   https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001537870  
   Contribution: discusses obligatory versus optional phenomena and analyzes standard pronunciation through interacting phonological constraints.  
   Project use: challenge a naive deterministic rule list; mark optional/variable outcomes explicitly where the standard and evidence warrant it. Full text must be reviewed before encoding individual claims.

### P1 — Newer hybrid/neural alternatives and model comparison

8. **Choi, Jae-Hoon et al. (2023). “Deep Learning-based Korean Grapheme-to-Phoneme Conversion Using Phonological Knowledge Base.”** _Proceedings of the Korean Computer Congress_, 280–282.  
   https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11488011  
   Contribution: hybrid neural G2P informed by a phonological knowledge base.  
   Project use: investigate how a knowledge base can constrain or correct learned outputs without allowing the model to overwrite verified normative rules. Full text and exact method need review.

9. **Choi, Sung-Ki; Kwon, Hyuk-Chul; Kim, Minho (2025). “Combining Autoregressive Models and Phonological Knowledge Bases for Improved Accuracy in Korean Grapheme-to-Phoneme Conversion.” _IEEE Access_ 13, 107678–107693.**  
   DOI: https://doi.org/10.1109/ACCESS.2025.3581981  
   ResearchGate discovery record: https://www.researchgate.net/publication/392871970_Combining_Autoregressive_Models_and_Phonological_Knowledge_Bases_for_Improved_Accuracy_in_Korean_Grapheme-to-Phoneme_Conversion  
   Contribution: combines autoregressive models with standard-pronunciation knowledge and a pre-analyzed dictionary; compares model variants.  
   Project use: current hybrid alternative worth a full-text review. Do not adopt a neural model solely because of aggregate PER: evaluate rule-level errors, determinism, reproducibility, training data, licensing, and traceability.

10. **NN-KoG2P (ICASSP 2021). “NN-KOG2P: A Novel Grapheme-to-Phoneme Model for Korean Language.”**  
    https://doi.org/10.1109/ICASSP39728.2021.9414653  
    Contribution: neural G2P architecture designed for Korean pronunciation patterns.  
    Project use: comparator for a future benchmark; assess data requirements and whether outputs can be explained and constrained by normative evidence.

11. **Yoon, Hyangsil (2008). “A Study on the Presenting Order for Phonological Rules of Korean for Foreign Learners.” _Journal of Korean Language Education_ 19(3), 427–446.**  
    https://doi.org/10.18209/iakle.2008.19.3.427  
    Contribution: discusses ordering rules by difficulty, frequency, and generalizability for teaching.  
    Project use: not a direct runtime architecture authority, but may inform user-facing explanations, tutorials, and prioritization of common versus difficult rules.

### P1 — Korean phonetic variation, lexical evidence, and corpus design

12. **Korean Standard Pronunciation Rules (표준 발음법), National Institute of Korean Language (NIKL).**  
    https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002  
    Role: primary normative authority for standard pronunciation; not an authority for Ukrainian rendering, and not a complete model of all spontaneous speech.

13. **Korean Basic Dictionary Open API, NIKL.**  
    https://krdict.korean.go.kr/eng/openApi/openApiInfo  
    Role: dictionary entries include pronunciation and conjugation-related pronunciation fields. Requires an API key. Evaluate coverage, update behavior, terms, and whether a response is a normative pronunciation or a particular lexical entry.

14. **Korean Word–IPA Dictionary, uniglot.**  
    https://github.com/uniglot/korean-word-ipa-dictionary  
    Role: a Wiktionary-derived Korean word/IPA resource, with scripts under MIT and data reported under CC BY-SA. Candidate for discovery and differential checks only; audit each data field, provenance, coverage, and license obligations before redistribution. Not a normative gold corpus.

15. **Korean spontaneous speech / spoken-variation corpora.**  
    A 2015 G2P study's bibliography points to “The Korean Corpus of Spontaneous Speech” (2015). Start with the original corpus publication and official data provider rather than using third-party copies.  
    Project use: optional later workstream for spoken variation, prosodic boundaries, and register. Do not mix spontaneous speech labels with the standard-pronunciation test set.

### P1 — Ukrainian receiving-language system and comparative transcription

16. **Kozmin, Mykhailo (2025). “Korean Names in Screen Translation: Transcription Issues in Ukrainian Adaptations.”**  
    https://doi.org/10.17721/1728-242X.2025.31.59-63  
    Contribution: Ukrainian audiovisual translation and Korean personal-name rendering; reviews romanization/transliteration systems, recurring errors, and linguistic/cultural constraints.  
    Project use: recent Ukrainian receiving-language evidence; extract actual recommendations and examples from the full article, compare them to the project's IPA-first goal, and document agreements/disagreements rather than treating the abstract as a full rule source.

17. **Shchehel (2009), practical transcription of Korean names into Ukrainian.**  
    Existing project lead: https://nasplib.isofts.kiev.ua/bitstreams/10921b8d-8ffa-45b4-8315-ffc28aa24831/download  
    Project use: primary target-language precedent. Verify bibliographic metadata, full text, exact pages, and the nature of the proposed system; do not assume that a published practical system is IPA-derived or normatively binding.

18. **Kim Gwangseok; Pietrow, Jarosław A. (2023). “Korean toponyms in the Polish language: sources of transposition, transcription systems, and phonic assimilation strategies.” _Poradnik Językowy_ 800(1).**  
    https://www.journals.polon.uw.edu.pl/index.php/pj/article/view/1631  
    Contribution: examines how Korean toponyms enter Polish through different transcription/romanization conventions and how they are assimilated in the receiving language.  
    Project use: comparative evidence about receiving-language conventions, source mediation, and inconsistent real-world usage. Polish choices are not automatically valid Ukrainian choices.

19. **Comparative Cyrillic/Slavic systems already in the project source register:** Czech (Stanjurová, 2023), Slovak (Procházka, 2020), Bulgarian (Beneva et al., 2018), Serbian (Galjević, 2023), and historical Russian Holodovich–Kontsevich.  
    Project use: compare design criteria, phonetic distinctions preserved/lost, reader expectations, and status of each proposal. Cite exact pages. Never import mappings solely because the target script is Cyrillic.

## Evidence follow-up

The first evidence memo is [CRITICAL-LITERATURE-REVIEW-01-2026-10-16.md](CRITICAL-LITERATURE-REVIEW-01-2026-10-16.md). It records which findings are based on accessible full text, which remain abstract-only, and which specific tasks must be completed before any method is considered adopted. The target-language comparison is detailed in [UKRAINIAN-TARGET-LAYER-COMPARISON-2026-10-16.md](UKRAINIAN-TARGET-LAYER-COMPARISON-2026-10-16.md).

## 3. Method families the project must compare

The project must not presuppose that one method wins before benchmarking. Maintain at least these explicit alternatives:

- **A. Normative rule engine**: deterministic, inspectable, source-linked NIKL rules; exact lexical overrides; fail-closed on unresolved morphology.
- **B. Morphology-aware rule engine**: rule system supplied with POS/morpheme boundaries from an analyzer; test analyzer errors and POS-sensitive homographs.
- **C. Lexicon-first hybrid**: dictionary pronunciations for covered entries plus transparent rules for productive patterns; record lexicon coverage and update cadence.
- **D. Data-driven contextual rules**: align written forms and pronunciation labels, induce/prune contextual rules, and validate on held-out words and sentences.
- **E. Neural G2P / neural-plus-knowledge-base hybrid**: evaluate as a comparator, not as an automatic replacement for transparent normative rules.
- **F. Phonological constraint/formal-state model**: represent rule preconditions, dependencies, optionality, and conflicts explicitly; evaluate Petri-net/WFST or a simpler declarative representation only if it improves correctness and auditability.
- **G. Human-curated IPA lexicon and gold corpus**: small, high-quality reference set for rule evaluation and disputed cases; keep provenance and annotation agreement.
- **H. Empirical target-language evaluation**: evaluate IPA→Ukrainian mapping separately with Ukrainian readers and/or expert-reviewed phonetic criteria.

## 4. Required comparison protocol

1. Freeze a shared, versioned test set and a separately held-out evaluation set.
2. Label every reference with orthography, context, expected standard pronunciation, IPA convention, Ukrainian target, source, rule IDs, confidence, and allowed variants.
3. Compare exact surface-form accuracy, phoneme error rate, per-rule precision/recall, exception coverage, unresolved/abstention rate, and sentence-level error propagation.
4. Report results separately for isolated words, connected phrases, morphology-sensitive forms, lexical exceptions, loanwords/proper names, mixed-script input, and optional/variable pronunciations.
5. Do not compare aggregate scores across studies unless corpus, unit of scoring, pronunciation target, and annotation conventions are compatible.
6. Keep model predictions, source-confirmed references, and human adjudications in separate fields. Model consensus is not gold truth.
7. Review data and code licenses independently; an open repository does not imply that every included corpus can be redistributed.
8. Preserve reproducibility: pinned versions/commits, commands, environment, raw outputs, scoring script, and dated decision record.

## 5. Decisions for the current project

- Retain IPA-first as the invariant for the Korean→Ukrainian pathway.
- Retain NIKL as the normative standard source; dictionary APIs and third-party engines are supporting evidence, not replacements.
- Add per-rule gold-corpus evaluation and traceability as high-priority methodology work.
- Compare rule-based, morphology-aware, lexicon-first, data-driven, and neural/hybrid approaches on the same benchmark before changing the runtime architecture.
- Keep Korean standard pronunciation and real-world pronunciation variation as distinct evaluation tracks.
- Treat Ukrainian practical transcription as a separate research question. The target mapping is not empirically validated merely because the Korean IPA is correct.
- Treat the sources in this document as discovery-stage candidates until full text, exact evidence locations, and licensing have been reviewed.

## 6. Immediate follow-up tasks

1. Obtain and read the full texts of Mun et al. (2022), Yoon & Brew (2006), Lee & Lee (2009), Yoon (2015), and Lee & Yim (2003); add page/section-level evidence notes.
2. Review Kozmin (2025) and Shchehel (2009) in full and build a Ukrainian target-layer comparison table.
3. Find original bibliographic and full-text records for the spontaneous-speech corpus and the 2025/2021 neural-hybrid papers.
4. Create a method-comparison matrix with criteria, risks, evidence status, and a no-premature-adoption rule.
5. Extend the rule-coverage ledger so every NIKL article maps to tests, gold references, known variants, and unresolved cases.
6. Only then decide whether the current engine needs an architectural change.
