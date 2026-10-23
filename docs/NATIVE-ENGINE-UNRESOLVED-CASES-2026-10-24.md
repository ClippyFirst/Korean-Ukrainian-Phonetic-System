# Native-engine unresolved pronunciation cases — 2026-10-24

## Scope and decision rule

This continuation modifies only the repository's native Python research engine, its source-backed lexical data, and its regression tests. No third-party G2P implementation or rule inventory is imported. The purpose is to resolve forms only where the evidence identifies the relevant morphology or provides a direct standard-pronunciation attestation. An exact-form license is not generalized to orthographically similar strings.

The engine's intended pipeline remains source Hangul → structural/phonological analysis → inspectable Korean IPA → Ukrainian target adaptation. A surface-Hangul spelling from NIKL is not itself IPA, and a project-rendered IPA string is not an independently reviewed Ukrainian target.

## Evidence-informed design

The literature supports explicitly modeling morphological categories and boundaries before applying context-sensitive rules. Lee & Chung's morpheme-based pronunciation-variation work reports that identical phonemic sequences can be pronounced differently across morphological boundaries, so morphology must inform variant generation [Lee07]. Jeon et al. describe a staged process with obligatory phonemic rules, optional variants, and later allophonic realization; their error analysis also identifies morphological-boundary analysis as a major failure source [Jeo98]. This supports the engine's conservative exact-form licensing and traceable rule ordering, not copying another implementation.

N-insertion must not be treated as universally categorical. Jun's empirical study finds gradient effects of morphological category, etymology, segmental context, and dialect; its novel-word results do not reproduce every tendency in existing-word data [Jun15]. A later study likewise reports interacting gradient factors [Jun21]. Accordingly, this change does not add a blanket insertion rule or use a competing engine's output as gold.

The lexical surface-form resource K-SPAN is useful as a reference but its paper describes dictionary-derived and normalized transcriptions rather than a recording-based gold standard, and its paper does not establish unrestricted redistribution rights [Hol17]. It is therefore not silently added as project data.

## Case ledger

| Input | Decision | Evidence and implementation |
|---|---|---|
| 앉아라 | **Rule-derived, resolved at Korean-surface level** | NIKL Standard Pronunciation Rule §14 explicitly gives 앉아[안자]. The transparent inflection 앉- + -아라 licenses the exact 앉>아 pair in the full form 앉아라; the native engine records R002:formal:앉아라:앉>아 in the trace. The extension to the whole inflected form is a project rule derivation, not a claim that NIKL directly lists the full form. |
| 없어도 | **Rule-derived, resolved at Korean-surface level** | NIKL §14 gives 없어[업써]; NIKL's grammar FAQ identifies -어도 as a connective ending in 없어도. The engine licenses only 없>어 in the exact form 없어도, yielding the expected surface sequence 업써도. The full inflected pronunciation is derived from the rule, not falsely labeled a direct dictionary transcription. |
| 삶의 | **Direct surface-Hangul alternatives; IPA remains project-rendered and unadjudicated** | NIKL's official MCFAQ explicitly states 삶의[살믜] and permits [살메] under Standard Pronunciation Rule §5. These are direct Korean surface-Hangul evidence. They are not IPA strings. The project candidates `sal.mɰi` and `sal.me` are not quoted by NIKL and must not be represented as independently validated broad IPA. The choice between underlying/phonological and broad surface notation, especially whether [ɰ] is justified in this exact construction, remains open. Ukrainian target remains provisional. See [the separate IPA and target-layer adjudication blocker report](IPA-TARGET-ADJUDICATION-BLOCKERS-2026-10-24.md). |
| 많이본 | **Intentionally unresolved without spacing/morphological analysis** | This compact sequence may represent 많이 본, but the engine must not invent a word boundary from character adjacency. The spaced form can use the existing sourced entry for 많이; the compact form remains diagnostic-only until a text-normalization or morphological-analysis layer supplies the boundary. |
| 좋아보인다고 | **Intentionally unresolved without spacing/morphological analysis** | The likely sequence 좋아 보인다고 crosses a lexical/eojeol boundary that is absent from the compact input. The existing 좋아 entry does not license an unspaced larger string. Do not infer the segmentation solely from a plausible phrase. |

Primary Korean normative source: NIKL Standard Pronunciation Rules, §§5 and 14: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002

Case-specific sources:
- NIKL, “조사 '의'의 표준 발음”: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5716&mn_id=217&pageIndex=225
- NIKL, “‘없어도’, ‘없이도’의 표현” (confirms grammatical segmentation of -어도, not an exact pronunciation transcription): https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=9225&mn_id=233&pageIndex=2
- NIKL §14 examples include 앉아[안자] and 없어[업써]; use these as rule evidence, not as direct IPA.

## Code and regression changes

- Added exact full-form §14 formal-morpheme licenses for 앉아라 and 없어도 to the native engine's existing source-backed license registry.
- Updated R002 trace provenance to include the applied scope, full form, and exact adjacent pair.
- Added a source-backed 삶의 lexical entry with primary [살믜] and alternate [살메]; broad IPA and Ukrainian target are explicitly project-derived/provisional.
- Added regression coverage for expected surface forms, IPA representation, exact trace provenance, and conservative negative controls.
- Added tests asserting that compact 많이본 and 좋아보인다고 remain unresolved, while their explicitly spaced counterparts do not trigger the same unresolved gate.
- No broad rule was added for complex-coda liaison, H-deletion, n-insertion, or word-boundary inference.

## Acceptance ledger

- **DONE_VERIFIED:** source-backed exact-form licensing, lexical entry, trace provenance, regression tests, and cross-runtime checks passed on PR head `24dac25d625dc648ae421412aeb6ccb430a60034`.
  - [Python/browser tests, Python 3.11–3.13](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40026472569) — all jobs passed.
  - [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40026472504) — Python regression/data integrity and browser regression/build passed; official NIKL inventory skipped, not claimed passed.
  - [Master table and research corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40026472604) — passed.
  - [External UGTPHON IPA diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40026472528) — passed. This is a regression/diagnostic gate, not proof of normative accuracy.
- **PARTIAL:** 삶의 Korean surface-Hangul alternatives are directly attested, but neither project IPA candidate has been independently adjudicated by a Korean phonetician.
- **PARTIAL:** 앉아라 and 없어도 are derived from transparent morphology plus NIKL rules; full-form surface pronunciation is not claimed to be directly listed by the cited NIKL source.
- **BLOCKED / input normalization:** compact 많이본 and 좋아보인다고 require an explicit spacing/morphological-analysis stage or caller-supplied segmentation; do not force a guessed result in the current API.
- **BLOCKED_SPECIALIST_ADJUDICATION:** independent Korean IPA review and separate Ukrainian target-layer review remain outstanding.
- **DEFERRED:** probabilistic modeling of optional variation is outside this deterministic patch. The cited n-insertion studies motivate future explicit variant/confidence handling, not a hidden guess.

## Research references

- [Lee07] Kyong-Nim Lee & M. Chung. 2007. “Morpheme-Based Modeling of Pronunciation Variation for Large Vocabulary Continuous Speech Recognition in Korean.” DOI: https://doi.org/10.1093/ietisy/e90-d.7.1063.
- [Jeo98] J. Jeon et al. 1998. “Automatic generation of Korean pronunciation variants by multistage applications of phonological rules.” DOI: https://doi.org/10.21437/ICSLP.1998-21.
- [Jun15] Jongho Jun. 2015. “Korean n-insertion: a mismatch between data and learning.” DOI: https://doi.org/10.1017/S0952675715000275.
- [Jun21] Jongho Jun. 2021. “Morphophonological gradience in Korean n-insertion.” DOI: https://doi.org/10.5334/GJGL.1401.
- [Hol17] J. Holliday, Rory Turnbull & J. Eychenne. 2017. “K-SPAN: A lexical database of Korean surface phonetic forms and phonological neighborhood density statistics.” DOI: https://doi.org/10.3758/s13428-016-0836-8.

## Follow-up action

The exact IPA/target-layer concern is now tracked in [IPA-TARGET-ADJUDICATION-BLOCKERS-2026-10-24.md](IPA-TARGET-ADJUDICATION-BLOCKERS-2026-10-24.md). A focused Undermind search has been launched to find primary evidence for ㅢ in 삶의 and methods for independent Ukrainian target evaluation. Do not mark this literature task complete until the returned papers have been inspected and their case-specific claims verified.
