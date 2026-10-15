# Source-by-source assessment and integration decisions

**Assessment date:** 2026-10-15  
**Scope:** sources already recorded in this repository, sources listed in the research programme, and high-value source families discovered during the initial sweep.  
**Status:** first-pass evidence-based triage; not yet a complete article-level, license-level, or full-text systematic review.

## Executive decision

The project does not need the largest possible bibliography. It needs a reliable evidence chain for every consequential output:

**Korean orthography and context → source-backed Korean surface pronunciation → IPA representation → explicitly documented Ukrainian target decision → tested output.**

Sources have different jobs. Official Korean norms define the normative surface-pronunciation baseline; dictionaries and official Q&A resolve lexical and morphological exceptions; peer-reviewed phonetics informs IPA and variation policy; Unicode defines encoding and decomposition; G2P repositories provide implementation candidates and differential oracles; Ukrainian transcription scholarship informs the receiving-language target; Slavic comparators provide design alternatives but do not override Ukrainian evidence.

**Use does not mean copy into production.** A source should be integrated only to the extent that its authority, scope, license, reproducibility, and actual contribution have been established. No external engine should become an unreviewed oracle, and no external rule set should be bulk-imported merely to increase rule count.

## Decision vocabulary

- **A — core authority:** directly required for correctness or project identity.
- **B — high-value support:** should be reviewed and integrated where the specific claim is applicable.
- **C — bounded comparator/tool:** useful for differential analysis or a narrow question, not a production authority.
- **D — optional/conditional:** useful only if access, license, and evaluation value justify its cost.
- **Not yet verified:** a source being listed in an existing CSV or report is not itself proof that its exact content, metadata, license, or derived claims have been rechecked in this pass.

## 1. Official Korean normative and lexical sources

### 1.1 National Institute of Korean Language (NIKL), 표준 발음법 — A / highest priority
**URL:** https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002  
**Role:** normative authority for standard Korean pronunciation. The official overview states that the standard follows actual standard-language pronunciation while considering tradition and rationality. It covers inventories and pronunciation rules including codas, assimilation, fortition, and sound insertion.

**Use in this project**
- Create a stable record for every article, subparagraph, enumerated example, exception, and relevant official explanation.
- Keep article-level claims separate from individual lexical licenses.
- Build rule IDs and test cases from source passages; record exact Korean text and source locator.
- Treat the current coverage gate as a finite index/consistency check, not proof of complete productive coverage.
- Verify source content and citations whenever an official page changes or a new audit is claimed.

**Limitations:** the standard defines Korean pronunciation, not Ukrainian spelling, and it does not provide a full productive morphological analyzer or a lexical pronunciation database for every Korean word.

**Decision:** indispensable; all in-scope normative behavior must be traceable to it or to an explicit, more specific official lexical clarification.

### 1.2 NIKL official online Q&A and FAQ — A / lexical exception authority
**Examples already cited by the project:** 값없다; 의견란 and ㄹ→ㄴ exceptions; ㄺ verbal-stem behavior versus 닭- nouns; 닭이/닭고기; 밝기. See data/korean/sources.csv S007–S011.

**Use**
- Resolve exact cases where the general article is insufficient, especially morphology-conditioned coda realization, ㄺ exceptions, ㄴ-insertion, and lexicalized compounds.
- Record the exact question, official answer, publication/update date, stable URL, applicable rule, and the narrowest claim supported.
- Turn each adopted answer into positive and negative regression controls.

**Limitations:** a Q&A answer is not a license to generalize to all superficially similar forms. Answers may be scoped to a specific word or analysis.

**Decision:** integrate claim-by-claim, with scope restrictions; never generalize beyond the source's stated conditions.

### 1.3 한국어기초사전 / Korean Basic Dictionary Open API — A/B
**URL:** https://krdict.korean.go.kr/kor/openApi/openApiInfo  
**Evidence:** the official API documentation describes search/content endpoints, requires an API key, and includes pronunciation fields where available, along with headwords, parts of speech, senses, conjugations, and pronunciation information.

**Use**
- Candidate discovery for lexical pronunciation coverage, conjugated forms, and ambiguity.
- Cross-check exact dictionary pronunciations against NIKL rules.
- Build an offline, versioned review queue or an optional lookup adapter if API terms and deployment constraints permit.

**Limitations:** coverage is not equivalent to a complete general dictionary; API access requires a key; returned fields and usage rights must be checked; dictionary pronunciation should not automatically override a more specific normative rule or context.

**Decision:** high priority for a controlled lexical audit and gap discovery. Do not make live API access a critical runtime dependency. First verify terms, rate limits, coverage, and whether bulk/offline reuse is permitted.

### 1.4 표준국어대사전 and 우리말샘 Open APIs — B
**Official API entry point:** https://kdict.korean.go.kr/info/openapi  
**Role:** lexical discovery, definitions, headword/part-of-speech evidence, and potentially additional pronunciation/conjugation data.

**Use:** investigate exact lexical exceptions and morphology candidates not covered by the learner dictionary; use 우리말샘 for broader lexical and usage evidence, while preserving source provenance and editorial status.

**Limitations:** dictionary-specific API policies differ; access may require a key; an API does not imply bulk download or redistribution rights. Definitions and usage examples are not automatically pronunciation gold labels.

**Decision:** investigate after the Korean Basic Dictionary API. Integrate only fields and records with clear relevance and permissible use.

## 2. Encoding, phonetics, and variation

### 2.1 Unicode Core Specification, Chapter 18 — A for text handling
**URL:** https://unicode.org/versions/Unicode18.0.0/core-spec/chapter-18/  
**Role:** authoritative Hangul encoding, modern syllable-block structure, and decomposition/composition behavior.

**Use:** validate algorithmic Hangul decomposition/composition, code-point ranges, and the 11,172 modern precomposed syllable space; keep Unicode facts separate from phonological facts; add conformance tests for normalization, compatibility jamo, modern jamo, malformed sequences, and round trips.

**Limitations:** Unicode defines character encoding and text representation, not standard pronunciation or an IPA-to-Ukrainian mapping.

**Decision:** indispensable for the orthographic/input layer; never use it as evidence for pronunciation rules.

### 2.2 Cho, Jun & Ladefoged (2002), “Acoustic and aerodynamic correlates of Korean stops and fricatives” — B
**URL:** https://doi.org/10.1006/jpho.2001.0153  
**Role:** phonetic evidence for Korean laryngeal contrasts and acoustic/aerodynamic cues.

**Use:** support the phonetic-feature inventory and explain why lenis, fortis, and aspirated categories cannot be reduced to one orthographic substitution; inform feature-weight design and explanatory documentation.

**Limitations:** not a normative pronunciation rule; study scope, dialect, speaker population, and experimental conditions must be preserved. Do not infer modern universal cue weights without further evidence.

**Decision:** retain as foundational phonetic literature; map individual claims to exact passages and use it to justify features, not dictionary outputs.

### 2.3 Kang & Han (2013), “Tonogenesis in early Contemporary Seoul Korean” — B
**URL:** https://doi.org/10.1016/j.lingua.2013.06.002  
**Role:** evidence about change in Seoul Korean laryngeal contrast and cue weighting.

**Use:** document contemporary variation and the distinction between normative categories and acoustic realization; inform a future optional phonetic/variation mode if explicitly approved.

**Limitations:** not a replacement for the official standard; study-specific findings should not be encoded as universal deterministic rules.

**Decision:** preserve and cite; do not alter the default normative path based on it alone.

### 2.4 Bang et al. (2018), “The emergence, progress and impact of sound change in progress in Seoul Korean” — B
**URL:** https://doi.org/10.1016/j.wocn.2017.10.004  
**Role:** corpus-based evidence on ongoing Seoul Korean sound change and acoustic cues.

**Use:** corroborate variation documentation and avoid presenting one phonetic realization as the only possible contemporary realization.

**Limitations:** descriptive/corpus evidence; population and methodology must be reviewed. It cannot independently define the Ukrainian spelling policy.

**Decision:** keep in the evidence bibliography; use only claims verified from the paper's full text.

### 2.5 NIKL vowel inventory / Standard Korean Language Development report (2014) — B, needs citation repair
**Existing locator:** a generic download endpoint with pages 92–99.  
**Problem:** the citation is not stable enough for reliable future auditing.

**Use:** document age/cohort and realization variation for vowels such as ㅚ, ㅟ, and ㅢ, where the standard allows variants or contemporary realization differs.

**Decision:** retain the research topic but replace the generic URL with exact report title, stable document URL, publication metadata, page numbers, and the claim supported. Until repaired, mark the locator insufficiently precise.

## 3. Open-source G2P implementations

### 3.1 kyubyong/g2pK — B / leading Python differential baseline
**URL:** https://github.com/kyubyong/g2pK  
**Role:** context-sensitive Korean grapheme-to-phoneme conversion; upstream README explicitly notes that the implementation is not perfect and describes morphological context via MeCab.

**Use:** differential oracle for source-backed surface-pronunciation fixtures; compare prescriptive and descriptive modes; discover missing morphology and lexical edge cases; preserve the pinned version, optional dependency boundary, and explicit error when unavailable.

**Limitations:** not an infallible authority; depends on a morphological analyzer; output is Hangul surface spelling, not project IPA or Ukrainian target; behavior may vary by version and environment.

**Decision:** keep as optional, pinned differential engine. It must not silently replace the native engine; disagreements must be triaged against sources.

### 3.2 ntdgo/korean-pronunciation — B/C / browser differential baseline
**URL:** https://github.com/ntdgo/korean-pronunciation  
**Role:** zero-runtime-dependency JavaScript port of g2pK, with standard-rule, idiom, English-transliteration, numeral, and descriptive-mode features according to its README.

**Use:** browser-compatible baseline and source of test ideas; compare the vendored subset with upstream; verify attribution, license files, removed features, and divergence.

**Limitations:** a port, not independent linguistic evidence; porting may omit morphology or differ from Python. A feature list does not prove exhaustive or exact conformance.

**Decision:** retain as a browser differential implementation, not normative truth. Audit the exact vendored diff and upstream license/version before substantial updates.

### 3.3 scarletcho/KoG2P — C / additional differential comparator
**URL:** https://github.com/scarletcho/KoG2P  
**Role:** alternative Python Korean G2P implementation with a rulebook and test set.

**Use:** search for rule formulations and counterexamples not covered by g2pK; compare outputs against independently sourced gold cases; determine whether it provides distinct value rather than duplicate rule coverage.

**Limitations:** rulebook and implementation may be dated or have different scope; not a normative authority; license and compatibility must be inspected before use.

**Decision:** include in source discovery and evaluate offline. Do not add as a runtime dependency unless it improves measured performance and can be maintained.

## 4. Korean corpora and speech datasets

### 4.1 Korpora — C for corpus discovery, not a pronunciation oracle
**URL:** https://github.com/ko-nlp/Korpora  
**Role:** catalog/tooling for access to many Korean corpora. Its repository license is CC-BY, but individual datasets have separate licenses and restrictions.

**Use:** discover contemporary text, lexical diversity, compounds, names, and realistic contexts for adversarial/holdout corpus construction; identify frequent forms missed by hand-curated cases.

**Limitations:** most text corpora do not provide gold standard surface pronunciation or IPA; text frequency cannot establish pronunciation. Each underlying dataset has its own license.

**Decision:** use as a discovery index only. Add a corpus to evaluation only after checking dataset-specific terms, provenance, deduplication, and label relevance.

### 4.2 Open-korean-corpora survey — B for discovery and licensing triage
**URL:** https://github.com/ko-nlp/Open-korean-corpora  
**Role:** survey of open Korean NLP datasets that records license/access/redistribution distinctions.

**Use:** discover candidate corpora and eliminate those that cannot be legally or practically reused.

**Limitations:** dataset availability and metadata change; this is a directory, not a pronunciation standard. Verify each original provider's current policy.

**Decision:** add to source discovery; do not copy datasets before per-dataset license review.

### 4.3 AI-Hub Korean speech data — D / conditional
**Examples:** https://www.aihub.or.kr/aihubdata/data/view.do?dataSetSn=109 and https://aihub.or.kr/aihubdata/data/view.do?dataSetSn=505  
**Role:** large-scale speech/transcription resources potentially useful for real speech, spontaneous language, and non-native speech research.

**Use:** future evaluation of how written Korean relates to actual speech, if the product expands beyond standard orthographic pronunciation; optional phonetic variability or ASR-oriented research.

**Limitations:** access may be restricted; licensing and redistribution can be complex; speech transcripts are not automatically phonetic gold labels; this may exceed the project's current standard-pronunciation scope.

**Decision:** not a Phase 1 blocker. Revisit only if a concrete evaluation question requires audio-level evidence and access/rights are confirmed.

## 5. Ukrainian target-layer evidence

### 5.1 Shchehel (2009), practical transcription of Korean names into Ukrainian — A/B / core target precedent
**URL:** https://nasplib.isofts.kiev.ua/bitstreams/10921b8d-8ffa-45b4-8315-ffc28aa24831/download  
**Role:** Ukrainian-language scholarly precedent for Korean-name transcription and receiving-language choices.

**Use:** extract the published table/rules and map each supported decision to a target-policy record; compare the project's mappings for ㅅ before ㅣ/j, fortis consonants, vowels without Ukrainian equivalents, and syllable boundaries; separate documented practice from new project proposals.

**Limitations:** concerns practical transcription of names, not necessarily all modern Korean phonetics, every morphology-conditioned surface form, or a computational IPA-to-Ukrainian ranking system.

**Decision:** high priority. Review the full text and exact pages; it must be the main Ukrainian precedent, but not the sole authority for every design decision.

### 5.2 Ukrainian Phonetic Inventory (UPI), pinned package 0.8.0 — A / target-engine dependency
**Role:** canonical Ukrainian phoneme/features, target grapheme realizations, IPA-to-target mappings, context/phonotactic/orthographic penalties, and sequence-level Ukrainian orthography.

**Use:** keep target-language phoneme inventory and orthographic rules centralized; use version pinning and explicit compatibility failure rather than maintaining a duplicate target inventory; validate ranking against Ukrainian reader judgments.

**Limitations:** numeric cost is a heuristic ranking, not a probability or proof of optimal similarity. Segment-level candidates are not publication-final orthography until the target package's sequence layer resolves them.

**Decision:** preserve the single-source-of-truth contract. Inspect UPI source, tests, license, version history, and target mapping decisions before declaring output professionally validated.

### 5.3 Russian Holodovich–Kontsevich practical transcription — C / historical Cyrillic comparator
**URL:** https://bp-razvitie.ru/prilozhenie-9-sistemy-transkripcii-  
**Role:** historical Cyrillic row-by-row comparison for Korean Jamo.

**Use:** compare how a Cyrillic target system handles contrasts, syllable structure, and conventions; identify questions the Ukrainian layer should answer explicitly.

**Limitations:** Russian phonetics/orthography is not Ukrainian; copying it would import Russian conventions by default.

**Decision:** comparator only. No automatic inheritance of target mappings.

### 5.4 Czech Stanjurová (2023) — C
**URL:** https://theses.cz/id/oaet4o/  
**Role:** academic discussion of Korean-to-Czech transcription history and phonetic compatibility.

**Use:** comparative design rationale and receiving-language trade-offs.

**Limitations:** system-level thesis evidence is not a Ukrainian target table; exact page-level claims must be verified before assigning a cell.

**Decision:** retain for comparative research; do not import row mappings without exact source support.

### 5.5 Polish Kim & Pietrow (2023) — C
**URL:** https://www.journals.polon.uw.edu.pl/index.php/pj/article/view/1631  
**Role:** Korean toponyms in Polish and phonetic assimilation.

**Use:** examine how real names are adapted and which contrasts/assimilation patterns matter in a Slavic receiving language.

**Limitations:** not a full Korean-Jamo mapping table and not Ukrainian evidence.

**Decision:** comparator for name adaptation only.

### 5.6 Slovak Procházka (2020) — C
**URL:** https://fphil.uniba.sk/fileadmin/fif/katedry_pracoviska/kvas/SOS_subory_19_1/SOS_19_1__2020_.pdf  
**Role:** published proposed Slovak correspondence table.

**Use:** compare practical solutions for preserving or approximating Korean contrasts in a Slavic script.

**Limitations:** a proposal is not automatically a codified national standard; Slovak spelling constraints differ from Ukrainian.

**Decision:** retain only as a labelled comparative table, with page-level evidence.

### 5.7 Bulgarian Beneva et al. (2018) — C
**URL:** https://manas.fcml.uni-sofia.bg/storage/app/uploads/public/Man/as_/4_1/Manas_4_1_Transcription_of_Korean.pdf  
**Role:** practical Korean-to-Bulgarian transcription system with a published table and principles.

**Use:** useful for how a Cyrillic system avoids awkward consonant sequences and balances readability against contrast.

**Limitations:** Bulgarian grapheme/phoneme inventory and conventions differ from Ukrainian.

**Decision:** high-value comparator; never import mappings without a Ukrainian-specific justification.

### 5.8 Serbian Galjević (2023) — C/D
**URL:** https://serbia-korea.rs/wp-content/uploads/2026/01/A-need-for-transcription-between-Korean-Hangul-and-Serbian-Cyrillic.pdf  
**Role:** proposal for Korean-to-Serbian Cyrillic transcription.

**Use:** design alternative and comparison point.

**Limitations:** source itself presents a proposal, not an established official standard.

**Decision:** retain as proposal-level comparator, never label it normative.

### 5.9 Slovenian Chang & Shigemori Bučar (2019) — C
**URL:** https://doi.org/10.4312/ala.9.2.117-144  
**Role:** Slovenian adaptation of loanwords and Korean orthography of proper names in the reverse direction.

**Use:** understand receiving-language constraints and bidirectional adaptation issues.

**Limitations:** reverse adaptation (Slovene → Korean) does not establish a Korean → Ukrainian mapping table.

**Decision:** keep for system-level comparison only.

### 5.10 lang-uk/ipa-uk — C / Ukrainian phonemization comparator
**URL:** https://github.com/lang-uk/ipa-uk  
**Role:** open-source Python package for converting Ukrainian text into IPA, described by its README as an implementation of the Ukrainian Wiktionary phonemization module.

**Use**
- A secondary check for how Ukrainian written candidates are phonemized, especially when evaluating whether a proposed Ukrainian spelling produces an unintended sequence.
- Generate consistency tests for the target layer's Ukrainian outputs, where the tool's scope and conventions match.
- Help expose target candidates that are orthographically valid but phonetically misleading.

**Limitations:** this tool maps Ukrainian orthography to IPA, not Korean IPA to practical Ukrainian transcription. It is a small independent implementation and must not be treated as the official Ukrainian pronunciation authority or as a target-mapping oracle.

**Decision:** add as a low-cost comparative QA tool, after checking its license, version, and behavior. Use it only to flag candidates for review; do not automatically rewrite project output.

## 6. Official Korean romanization — C / contrastive baseline, not target authority
**URL:** https://www.korean.go.kr/front_eng/roman/roman_01.do  
**Role:** official Korean-to-Latin romanization based on standard pronunciation.

**Use:** clarify the difference between pronunciation-based transcription and orthography-based transliteration; compare how a standard system handles Korean phonology.

**Limitations:** Latin script target, different audience and goals. It cannot be converted into Ukrainian by replacing Latin letters with Cyrillic.

**Decision:** use for conceptual comparison and test vocabulary only, not as the target system.

## 7. Overall integration order

### P0 — required before claiming scientific completeness
1. Exact article/subarticle-level NIKL source ledger and claim-to-test traceability.
2. Official Q&A/FAQ exception review for every rule with lexical or morphological conditions.
3. Audit and version-pin Unicode conformance behavior.
4. Review Shchehel (2009) against current Ukrainian target mapping and record explicit decisions.
5. Inspect UPI dependency source, tests, license, and version contract.
6. Audit exact vendored JavaScript G2P diff against upstream; run differential tests against NIKL-backed gold cases.
7. Repair unstable citations such as the generic 2014 report download URL.

### P1 — high-value expansion
1. Review Korean Basic Dictionary API fields, terms, rate limits, and lexical coverage.
2. Review Standard Korean Dictionary / 우리말샘 APIs for incremental exception discovery.
3. Compare g2pK, ntdgo's JS port, and KoG2P against the same independently sourced corpus.
4. Inspect all source rows in the Slavic comparative table and confirm evidence classifications/page locators.
5. Add Korean corpus discovery via Korpora/Open-korean-corpora, but only use individual datasets after license and relevance checks.
6. Design a Ukrainian reader evaluation for target mappings and output readability.

### P2 — conditional research
- AI-Hub and speech/audio corpora for an explicitly scoped spoken-variation project.
- A separate descriptive/colloquial mode, only after product scope and validation data are agreed.
- More external G2P engines only when they add a distinct capability or independent evidence.

## 8. What “implement everything valuable” means operationally

For each source-derived finding:
1. Create a claim with exact locator and scope statement.
2. Assign a rule/decision ID and classify it as normative fact, lexical fact, phonetic evidence, target-language precedent, comparator, or heuristic.
3. Decide whether it belongs in canonical structured data, source documentation, a differential harness, a regression fixture, or only the bibliography.
4. Check licensing before copying content or code.
5. Add positive, negative, boundary, interaction, and regression cases as appropriate.
6. Run tests in each affected runtime.
7. Record the result and remaining uncertainty.

Do not bulk-copy third-party rules, datasets, or target tables. The professional outcome is maximum validated usefulness, not maximum imported volume.

## 9. Open audit items
- [ ] Verify every source above against the actual source text and current terms.
- [ ] Add page/article-level locators to all adopted claims.
- [ ] Confirm license and attribution for every imported code/data artifact.
- [ ] Compare engine outputs on a common gold corpus.
- [ ] Complete Ukrainian target-layer source review and reader evaluation design.
- [ ] Update source and rule registers with final dispositions.


## 10. Row-by-row disposition of sources already registered in the repository

This appendix ensures that the existing source ledgers are assessed individually rather than hidden inside general source categories. The dispositions below are provisional triage; exact page/claim verification remains open.

### 10.1 Existing Korean source register: data/korean/sources.csv

| Existing ID | Source | Project value | Decision / required action |
|---|---|---|---|
| S001 | NIKL Standard Pronunciation Rules | Highest: normative authority for the Korean surface layer | Keep as core authority. Add exact article/subarticle locators, source snapshots or stable excerpts where permitted, and rule-to-test links. |
| S002 | Unicode Core Specification, Chapter 18.6.5 | Highest for Hangul encoding and decomposition; not phonology | Keep as core technical standard. Verify current version and add conformance tests. |
| S003 | Cho, Jun & Ladefoged (2002) | High for phonetic feature interpretation of Korean stops/fricatives | Keep. Extract only claims directly supported by the paper; do not treat it as normative rules. |
| S004 | Kang & Han (2013) | High for documented Seoul Korean sound change and cue reweighting | Keep as variation evidence. Preserve population/time scope and keep separate from standard mode. |
| S005 | Bang et al. (2018) | High for corroborating contemporary variation | Keep. Verify exact title/authors and page-level claims against full text; do not turn descriptive results into universal deterministic rules. |
| S006 | NIKL vowel inventory / development report (2014) | Potentially high for age/cohort vowel variation | Keep topic, but repair the generic download URL and identify exact report, publication data, pages, and claims before using it as evidence. |
| S007 | NIKL online Q&A: 값없다 | High for a specific lexical pronunciation control | Keep only the exact claim the official answer supports; add paired controls if a similar form should not generalize. Verify the URL and answer text. |
| S008 | NIKL FAQ: 의견란 and ㄹ→ㄴ exceptions | High for a narrowly scoped exception to a productive-looking pattern | Keep as an exception-specific source; verify exact FAQ wording and article relationship. Use negative controls to prevent overgeneralization. |
| S009 | NIKL online Q&A: ㄺ verbal-stem exceptions versus 닭- nouns | High for morphology/lexical-class contrast | Keep. Encode narrow lexical/morphological conditions; do not infer verb class from spelling alone. |
| S010 | NIKL online Q&A: 닭이 and 닭고기 | High for a coda/liaison versus compound-context contrast | Keep. Add a minimal-pair/contrast test with explicit word boundaries and source locator. |
| S011 | NIKL online Q&A: 밝기 and ㄺ+ㄱ | High for a conditional ㄺ realization and exception boundary | Keep. Test the exact licensed form and at least one superficially similar negative control. |

### 10.2 Existing Slavic-comparative source register: data/korean/slavic_comparative_sources.csv

| Existing ID | Source | Project value | Decision / required action |
|---|---|---|---|
| RUS-HK | Holodovich–Kontsevich Russian practical transcription | High as a historical Cyrillic table and comparator | Retain as comparator only. Verify original bibliographic provenance and the exact table; never inherit Russian mappings as Ukrainian defaults. |
| CZE-ST | Stanjurová (2023), Czech transcription thesis | Medium for history, phonetic compatibility, and design rationale | Retain for system-level comparison. Add page-level evidence before using any individual mapping. |
| POL-KP | Kim & Pietrow (2023), Korean toponyms in Polish | Medium for real-name adaptation and assimilation | Retain for name-adaptation context, not as a complete grapheme table. Extract claims with page locators. |
| SVK-PRO | Procházka (2020), proposed Slovak romanization | Medium for an explicit Slavic-language table and design trade-offs | Retain as a proposal/comparator. Verify status, page, and bibliographic metadata. |
| BUL-BEN | Beneva et al. (2018), Korean transcription in Bulgarian texts | High comparative value because it offers a practical Cyrillic system | Retain. Compare principles and examples, but justify every Ukrainian choice independently. |
| SRB-GAL | Galjević (2023), Korean–Serbian Cyrillic proposal | Medium/low until status and source provenance are fully verified | Retain as a proposal only; never label an official Serbian standard. Verify PDF metadata and table page. |
| SLO-CB | Chang & Shigemori Bučar (2019), Slovene loanword adaptation into Korean | Low/medium for reverse-direction adaptation constraints | Retain only as reverse-adaptation context; do not use it as direct Korean-to-Ukrainian correspondence evidence. |
| UKR-SH | Shchehel (2009), Korean names into Ukrainian | Highest target-language precedent in the existing comparative register | Prioritize full-text review. Map each claim to a target-layer decision and identify where the project intentionally differs. |
| KOR-NIKL | NIKL Standard Pronunciation Rules | Highest for Korean source pronunciation, not the target language | Link to S001 rather than maintaining conflicting duplicate metadata; retain the explicit boundary between Korean evidence and Ukrainian rendering. |

### 10.3 Additional sources added by the discovery queue

The separate file SOURCE-DISCOVERY-QUEUE.csv contains the current candidates for Korean dictionaries/APIs, three G2P implementations, corpus indexes, AI-Hub, the phonetic literature, UPI, and official romanization. It records priority, expected value, access/license risk, provisional decision, and the next concrete action. Candidate status means “needs review”, not “approved for copying or production use”.

