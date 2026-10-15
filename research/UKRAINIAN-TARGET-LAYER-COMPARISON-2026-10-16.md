# Ukrainian Target-Layer Comparison: Shchegel (2009) vs Kovalchuk (2011)

Date: 2026-10-16  
Status: evidence-based comparison memo; not a decision to adopt either system.

## Purpose

The two sources are directly relevant but disagree on several target-language choices. They concern mainly **proper names**, not a validated universal converter for all Korean words. The Korean pronunciation analysis and the Ukrainian spelling policy must remain separate: one IPA result may be rendered by different documented Ukrainian output policies.

## Source records

1. **Shchegel, O. M. (2009).** “Практична транскрипція корейських імен українською мовою: порівняння, проблеми і пропозиції.” *Мовознавство*, № 1, 76–87. Full PDF: https://nasplib.isofts.kiev.ua/bitstreams/10921b8d-8ffa-45b4-8315-ffc28aa24831/download
2. **Kovalchuk, Yu. A. (2011).** “Проблеми та перспективи створення уніфікованої системи української практичної транскрипції корейських власних назв.” *Мовні і концептуальні картини світу*, 36, 468–473. Accessible copy reviewed on Scribd: https://www.scribd.com/document/869072249/Ковальчук-Ю-А-ПРАКТИЧНА-ТРАНСКРИПЦІЯ-КОРЕЙСЬКИХ-ВЛАСНИХ-НАЗВ-2011. The copy is third-party and marked All Rights Reserved; find an institutional copy before relying on it for redistribution or reproducing tables.

## Comparison matrix

| Question | Shchegel (2009) | Kovalchuk (2011) | Project implication |
|---|---|---|---|
| Main scope | Practical transcription of Korean personal names; notes common-noun proposals are incomplete (pp. 76, 87) | Problems and prospective unification of Korean proper names and other realia; frames questions for further work (pp. 468–472) | Neither source alone justifies a universal all-vocabulary mapping |
| Primary objective | Practical sound approximation for general readers; distinguishes it from transliteration for specialists (pp. 77–78) | Practical transcription should preserve the Korean sound shape as closely as Ukrainian ordinary orthography allows (pp. 469–470) | Both support a receiving-language policy layer, not direct Hangul character substitution |
| Input path | Criticizes orthography-driven/partly transliterating systems when they obscure pronunciation (pp. 77–78) | Warns that Korean→English/Russian→Ukrainian relay causes additional errors; favors access to Korean source and pronunciation (pp. 468–470) | IPA-first is compatible with the underlying rationale; no need to route through Romanization |
| Initial lenis stops | Discusses the difficulty of representing Korean sound contrasts in Ukrainian and challenges Russian-derived conventions (pp. 78–81) | Recommends writing initial weak consonants as voiced in practical transcription, while reviewing the dispute between Kontsevich and Revised Romanization (pp. 470–471) | Must be tested against current phonetic evidence and Ukrainian reader interpretation; do not decide by romanization alone |
| ㅓ vs ㅗ and related vowels | Notes that target-language transcription necessarily loses some source distinctions; argues for sound approximation and Ukrainian readability (pp. 78–81) | Proposes merging several vowel distinctions in practical orthography, while retaining distinctions in phonetic transcription (p. 471) | Preserve contrasts in IPA; any merger belongs only to an explicit practical-output policy |
| Coda ㅇ | Discusses Korean phonetic detail and the limits of target-language equivalence; questions spellings that over-represent the source orthography (pp. 78–81) | Argues against writing Korean coda ㅇ as “нг/нґ” in Ukrainian and proposes “н” in practical transcription (p. 471) | Keep IPA distinction intact; benchmark target spellings with Korean and Ukrainian reviewers |
| ㅈ | Proposes specific Ukrainian sound-based conventions, including “ш” for ㅅ before ㅣ/yodized vowels; other consonant mappings require individual audit (pp. 78–80) | Discusses competing “чж” and “дж” conventions for ㅈ and says the issue needs further study (p. 471) | Explicit unresolved policy decision; compare actual Korean realization, Ukrainian phonology, and established name usage |
| Initial ㅡ / ㅢ | Not identified as a central separate decision in the reviewed sections | Proposes initial Ukrainian “и” for forms such as Ийчжонбу and Инбонсан (p. 472) | Test orthographic permissibility, reader interpretation, and whether each output is phonetic or conventional |
| Given-name syllables | Proposes family name separate and given-name syllables hyphenated, e.g. “Кім Іль-Нам”; argues this preserves name structure and avoids segmentation errors (pp. 82–84) | Proposes family name and given name as two words without a hyphen, while preserving entrenched three-part conventional forms such as Кім Ір Сен and Кім Чен Ір (p. 472) | Must be a selectable documented style policy, not a phonological rule |
| Legacy names | Recommends preserving entrenched forms where replacing them would reduce recognition, while applying current rules to other names (p. 82) | Also preserves established forms, notably names with entrenched three-part spelling (p. 472) | A curated legacy-name dictionary is justified, but must mark conventional form vs generated form |
| Name order and segmentation | Emphasizes Korean surname-before-given-name order and the confusion caused by mis-segmentation (pp. 79–84) | Uses examples of media inconsistency and argues for stable, unified rendering (pp. 468–469, 472) | Model surname, given name, compound surname, pen name, and honorific separately from raw G2P |
| Empirical validation | Proposes a system and examples; no contemporary controlled reader experiment is reported in the reviewed article | Explicitly frames the paper as identifying questions for a future systematic study | Treat both as historical scholarly proposals, not experimentally validated gold standards |

## What we should take from both sources

### Retain as robust design principles
- Do not romanize through English or Russian if Korean source text and pronunciation can be obtained.
- Define the intended user and purpose before choosing a practical rendering.
- Separate a phonetic representation from target-language orthography.
- Keep established spellings distinct from mechanically generated spellings.
- Keep proper-name structure and Korean name order explicit.
- Treat loss of Korean contrasts as a documented tradeoff rather than an invisible side effect.

### Do not adopt without further validation
- Either author's complete consonant/vowel mapping table.
- Any assumption that a proper-name rule applies to ordinary vocabulary.
- The name-syllable hyphenation policy as a universal default.
- Any target mapping based solely on Russian transcription, Revised Romanization, or the appearance of a Hangul letter.
- Historical frequency figures or media examples as current corpus statistics.

## Proposed architecture consequence

Keep one Korean analysis result and permit policy-specific output renderers:

1. 'ipa_surface' — the reviewed Korean surface pronunciation, in a documented IPA convention.
2. 'uk_practical_phonetic' — Ukrainian practical phonetic output based on explicit mappings from IPA.
3. 'uk_proper_name_conventional' — optional name-aware policy with curated legacy forms and structure-aware formatting.
4. 'uk_reversible_reference' — optional scholarly/reversible representation, if separately designed and justified.

Do not expose multiple renderers as if they were equally validated. Each policy needs its own version, evidence notes, tests, and stated scope. The proper-name renderer should not bypass Korean phonological analysis.

## Required disputed-mapping benchmark

Build an adjudicated test set with:
- initial ㄱ/ㄷ/ㅂ/ㅈ and their relevant contexts;
- ㅓ/ㅗ, ㅕ/ㅛ, ㅐ/ㅔ, ㅒ/ㅖ, and ㅚ/ㅞ/ㅙ;
- coda ㅇ versus ㄴ;
- ㅈ and ㅅ before front/yodized vowels;
- initial ㅡ/ㅢ;
- surname/given-name segmentation, two-syllable given names, compound surnames, pen names, and honorifics;
- conventional forms versus source-derived forms;
- North/South pronunciation variants when the named person’s context supports that distinction.

For every item, record the Korean source form, context, source-backed IPA, Ukrainian output under Shchegel, Ukrainian output under Kovalchuk, project proposal, policy rationale, and adjudication status.

## Next actions

1. Obtain an institutional copy of Kovalchuk (2011) and verify its pagination and tables.
2. Extract Kozmin (2025) case examples from the publisher PDF, with exact page references.
3. Compare each proposed sound mapping against current NIKL rules and contemporary Korean phonetics.
4. Test the Ukrainian mappings with at least two independent reviewers and a small reader study before describing a policy as validated.
5. Keep all target-layer decisions separate from Korean rule-engine acceptance gates.
