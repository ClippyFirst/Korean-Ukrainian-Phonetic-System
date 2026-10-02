# Korean phonology model

## Normative baseline

The National Institute of Korean Language states that Standard Pronunciation Rules follow actual pronunciation of Standard Korean and grounds the standard in contemporary Seoul speech. The current rule set is organized around consonants/vowels, final consonants, assimilation, fortition and insertion.

Source: https://www.korean.go.kr/front/page/pageView.do?page_id=P000097

## Segmental representation

The machine-readable consonant layer preserves the 19 standard consonants and their lenis/fortis/aspirated distinctions where relevant. The vowel layer preserves the 21 standard vowel symbols, while /ø, y/ and contemporary merger/diphthongization patterns remain explicitly analysis-dependent.

The computational layer therefore distinguishes:
1. orthographic Jamo;
2. underlying/phonological segment;
3. ordered contextual rules;
4. surface segmental IPA.

## Rule engine

The implemented rule IDs are:

| ID | Process | Normative anchor | Status |
|---|---|---|---|
| R001 | final neutralization | §9 | established |
| R002 | liaison/resyllabification | §§13–15 | established |
| R003 | ㅎ deletion before vowel-initial morphology | §12(4) | established |
| R004 | ㅎ aspiration | §12(1) | established |
| R005 | nasal assimilation | §18 | established |
| R006 | liquid assimilation | §§19–20 | established |
| R007 | palatalization | §17 | established |
| R008 | post-coda fortition | §23 | established |
| R009 | ㄴ-insertion | §29 | conditional |
| R010 | stem ㄴ/ㅁ fortition | §24 | conditional |
| R011 | stem ㄼ/ㄾ fortition | §25 | conditional |
| R012 | Sino-Korean ㄹ fortition | §26 | conditional |
| R013 | adnominal -(으)ㄹ fortition | §27 | conditional |
| R014 | compound fortition | §28 | conditional |
| R015 | saisiot pronunciation | §30 | conditional |

The implementation stores a rule trace for every stage. This is deliberate: NIKL documentation itself notes that some derivational questions can be analyzed differently, so the project does not encode one derivational narrative as a universal fact.

## Surface IPA

The IPA engine is segmental and rule-supported. It does not fabricate acoustic detail. Lenis stops have contextual intervocalic voicing representations such as [ɡ d b], while phrase-initial realizations retain [k t p] in the broad layer.

Contemporary Seoul research shows that VOT and F0 cues are undergoing reweighting over time. Therefore the repository stores this as variation/evidence rather than treating one cue profile as timeless.

Sources:
- https://doi.org/10.1006/jpho.2001.0153
- https://doi.org/10.1016/j.lingua.2013.06.002
- https://doi.org/10.1016/j.wocn.2017.10.004


## Standard Pronunciation coverage

The repository now classifies §§9–30 explicitly in `data/korean/rule_scope.csv`. Rules requiring lexical, morphological or compound structure are **conditional** and cannot be inferred safely from Hangul adjacency alone. Section 16 (consonant-letter names) is outside the ordinary lexical-word pipeline and is therefore scoped separately rather than falsely generalized. Section 21 is represented as an explicit negative constraint; §22 is retained as variation-only because deterministic vowel assimilation would require additional lexical/acoustic conditioning.
