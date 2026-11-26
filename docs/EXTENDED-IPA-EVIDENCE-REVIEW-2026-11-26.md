# Extended IPA evidence review — 2026-11-26

**Status:** first evidence synthesis completed; not linguistic certification and not a release-gate pass.

**Scope:** Korean segmental phonetics, prosodic conditioning, contextual allophony, speaker/dialect variation, and speech-corpus rights relevant to Kozak Kim Extended IPA. Full text was read for Schweizer et al. (2026), Choi et al. (2020), Sung (2014), and Jang et al. (2024). Other entries below are based on publisher/abstract metadata unless explicitly stated. Source records are in research/SOURCE-REGISTER.csv and data/korean/sources.csv.

## 1. Core finding

Extended IPA must not be defined as a larger fixed list of symbols. The strongest current evidence supports a layered, context-aware analysis:

1. A phonemic layer for lexical contrasts and underlying categories.
2. A broad surface layer for well-supported rule-derived realizations.
3. A narrow layer for context-specific phonetic detail, only when the evidence identifies the relevant environment.
4. Separate optional variants for speaker-, dialect-, prosody-, morphology- or style-conditioned outcomes.
5. Acoustic/prosodic annotation for cues that are not adequately represented by a segmental IPA string (e.g. F0, VOT, closure voicing, H1*-H2*, CPP).
6. An independent Ukrainian target adapter. A valid IPA layer does not imply that a Ukrainian rendering exists or has been approved.

The data do not support treating every phonetic tendency as a categorical rule. In several domains, the same phonological contrast is implemented with different acoustic cue weightings depending on prosodic position, focus, age, vowel context, dialect or speaker.

## 2. Evidence synthesis

### 2.1 Korean laryngeal contrast and prosody

**Schweizer, Ahn & Kwon (2026), [S028].** The full 2026 JIPA article compares IP-initial, AP-initial inter-sonorant and word-medial inter-sonorant stops. Study 1 used nine native Seoul–Gyeonggi speakers (four men, five women; mean age 30.8) in a controlled production experiment: 27 target items repeated ten times (270 tokens per speaker). Study 2 sampled 15 young female speakers from the NIKL Seoul reading corpus and analyzed 3,390 tokens. Measures included burst duration, closure duration, closure voicing and proportion voiced, post-stop F0, F1 and H1*-H2*.

- IP-/AP-initial positions rely strongly on post-stop F0 and burst duration; H1*-H2* adds information for tense versus non-tense stops.
- Word-medial stops show a different cue balance: closure duration, voicing during closure/proportion voiced and burst duration become more important. Some F0 differences appear in non-high-vowel contexts but not uniformly in high-vowel contexts.
- The authors emphasize prosodic position and vowel context; word-medial corpus cells are unbalanced and the corpus sample is young women only.

**Implementation consequence:** preserve the three-way phonological contrast in broad IPA. Do not automatically turn medial closure voicing into a phonological voiced stop, and do not assign one invariant narrow IPA realization to every lax/tense/aspirated token. F0, closure voicing and burst duration belong in optional acoustic/prosodic annotations where measured.

### 2.2 Apparent-time and focus-conditioned cue reweighting

**Choi, Kim & Cho (2020), [S029].** Full text was read. The study recorded 32 Seoul speakers in four age/gender groups (eight per group; young speakers born 1992–1998, older speakers 1954–1961), with 4,096 intended tokens and 409 exclusions. It crossed IP-initial/IP-medial position with focused/unfocused production and measured VOT, closure voicing and F0.

- The lenis–aspirated VOT distinction was not significant for young speakers in IP-initial position; older speakers retained it.
- Focus enlarged the F0 separation (reported 84.8 Hz focused versus 37.9 Hz unfocused IP-initially).
- In IP-medial position, lenis closure voicing occurred in 93% of unfocused tokens but only 7% of focused tokens.
- Cue use differs by age, gender, position and prominence.

**Implementation consequence:** the Extended IPA mode must not infer a segmental tone or a universal voiced/voiceless allophone from F0/VOT alone. Store focus, prosodic position and acoustic measures as metadata when known. Do not synthesize speaker characteristics when the input is text-only.

### 2.3 Voice quality

**Jang, Kim & Cho (2024), [S031].** Full text was read. Twelve young native Seoul/Gyeonggi speakers (seven women, five men; ages 21–28) produced 2,037 analyzed tokens in a 2×2 focus-by-IP-boundary design. Measures included H1*-H2*, H1*-A1* and CPP.

- H1*-A1* showed the clearest lenis > aspirated > fortis breathiness ordering.
- H1*-H2* and CPP produced different category groupings; the measures are not interchangeable.
- Focus and boundary strengthening affected categories differently and interacted.

**Implementation consequence:** do not encode a single “breathy” diacritic as a universal property of a stop series. Voice-quality labels require the measure, time window, context and adjudication method to be recorded. This paper contains production evidence, not a validated IPA symbol inventory or listener-perception proof.

### 2.4 Sibilant coarticulation and palatalization

**Kang (2010), [S019].** Acoustic measurements show that Korean /s/ before /i, ye, ya/ has different spectral characteristics from /s/ before open vowels; the paper also reports that /yo/ and /yu/ show distinct spectral patterns. This supports context-sensitive coarticulation, not an unrestricted categorical conversion of /s/ to [ɕ] before every glide or front vowel.

**Sung (2014), [S030].** Full text was read. An ultrasound study of four women (two Busan, one Seoul, one Ulsan; ages 28–31) compared lexical and post-lexical palatalization, with 38 words and three repetitions. The tongue-contour results varied by speaker and consonant:
- lexical and post-lexical /t/ gestures were not distinct for every speaker;
- for post-lexical /s/, within- versus across-morpheme contours did not show a significant distinction;
- for post-lexical /n/, three of four speakers showed a boundary-related difference, while one did not.

**Implementation consequence:** preserve morpheme boundaries and palatalization rule IDs, but do not impose one categorical articulatory outcome across all speakers and coronal consonants. The browser's [ɕʰ] selection is still a partial research convention; it is not independently adjudicated token-level narrow IPA.

### 2.5 Nasal palatalization and /n/-deletion

The existing Python profile uses [ɲ] before selected /j/-initial nuclei and deliberately excludes /i/. The UCL thesis by Young Shin Kim (2011), [S020], summarizes prior descriptions of [nj]/[ɲ] before /i,j/ and related palatal contexts. Ahn (2009), [S035], is specifically a study of Korean initial /n/-deletion/denasalization; it is related evidence but does not independently justify a general [ɲ] mapping across all glide nuclei.

**Implementation consequence:** retain the current restricted [ɲ] behavior as a source-scoped research hypothesis, not a universal categorical rule. Primary-source verification and speaker-level evidence are still required. The exact mapping must not be generalized to /i/ merely because it is a high-front vowel.

### 2.6 /h/ weakening, voicing and deletion

**Kang & Lee (2019), [S032].** The study analyzed five read stories from three Seoul and three Gwangju speakers in their 50s. /h/ was weakened or deleted more often in Gwangju than Seoul; after sonorants it may be voiced or deleted in Seoul. The authors interpret the dialect difference as a difference in optionality, not a categorical invariant.

**Um (2014), [S033].** The abstract reports that underlying /h/ can affect the duration of a preceding sonorant even when /h/ is not acoustically manifested. This is evidence against treating deletion as always leaving no phonetic trace; it does not license a deterministic [ɦ] realization for every post-sonorant token.

**Lee (1993), [S018].** The Illustrations of the IPA description documents [ç] before /i,j/, [x] before /u/, and descriptions of Seoul Korean [ɸ] and [ɭ] contexts. These are useful descriptive references, but do not establish speaker-independent probabilities.

**Implementation correction:** narrow profile v6 no longer forces [ɦ] after every same-word sonorant coda. The browser and Python outputs retain /h/ in that context and expose the reported weakening/deletion as an unresolved, speaker-/dialect-conditioned alternative. This is a deliberate evidence-gated correction, not a regression in coverage.

### 2.7 Vowel and glide variation: ㅢ

**Park, Cho & Han (2016), [Unk16l].** The existing literature review reports 2,370 Seoul Corpus tokens: monophthongization in 93.04% overall, but only 31.82% of word-initial tokens; 94.40% of monophthongized tokens were [i], while genitive particle tokens were mostly [e]. Word-initial and grammatical contexts therefore differ.

**Implementation consequence:** keep morphological role, word position and boundary context attached to ㅢ variants. Do not collapse lexical /ɨi/, genitive particle 의, and consonant-initial syllable behavior into one global rule. Speaker- and token-specific variants need source-aligned evidence.

### 2.8 Liquid and nasal connected-speech processes

The current source review includes a 2021 spontaneous-speech study of ㄴ+ㄹ and ㄹ+ㄴ sequences [Jan21]. It reports differences by word/morpheme boundary and age, with non-uniform realization in natural speech. This reinforces the need to retain boundary type and variation rather than converting all apparent sequences to a single liquid assimilation output.

## 3. Speech-corpus rights and data availability

- **Seoul Corpus / OpenSLR SLR113 [SRC-SEOUL-CORPUS-OPENSLR]:** OpenSLR declares CC BY-NC 2.0 and lists TextGrid labels plus FLAC audio. This is a non-commercial licence; the original upstream terms and permissions for derived annotation redistribution still require verification. No corpus files were downloaded or committed in this work.
- **NIKL Modu Spoken [SRC-NIKL-MODU-SPOKEN]:** the official NIKL FAQ says corpus data may only be used for the approved purpose and period and may not be transferred, rented, licensed or secured to third parties outside that agreement. No access or agreement is evidenced here; treat as blocked until an authorized agreement is supplied.
- **KsponSpeech / AI Hub:** registration/permission and dataset-specific terms apply. A public mirror or re-upload is not proof of redistribution rights. No audio or labels are imported.
- **Zeroth-Korean / OpenSLR SLR40:** catalogue declares CC BY 4.0 and provides a potentially more permissive corpus path. It remains a candidate pending package/version, speaker metadata, transcript convention and phone-inventory audit.

**Data policy:** keep raw audio and restricted transcripts out of the repository. For any corpus-derived labels, record source version, licence, allowed purpose, speaker and utterance identity handling, derivation procedure, and redistribution permission. Access is not equivalent to permission to publish derived annotations.

## 4. Consequences for the Extended IPA implementation

1. Keep phonemic, broad and narrow layers distinct and versioned.
2. Retain the source span, syllable/word/phrase boundaries, morphology, prosodic position, rule ordering, and evidence links.
3. Make speaker/dialect/style/speech-rate fields optional and nullable; never infer them from text.
4. Treat acoustic cue values (F0, VOT/burst duration, closure duration, proportion voiced, H1*-H2*, H1*-A1*, CPP, formants, spectral centre of gravity) as separate typed annotations, not automatic IPA substitutions.
5. Allow a set of alternative readings with distinct environments, evidence class and uncertainty; do not pick one as universal if the data do not identify a single outcome.
6. If the source or profile does not support a realization, preserve unresolved/abstained status rather than generating a plausible-looking IPA string.
7. Do not promote an extended IPA layer to Ukrainian target input until independent phonetic adjudication and a separate Ukrainian target review are complete.
8. Benchmarks are diagnostic evaluation after the linguistic contract exists. Split by speaker and source lineage; use independently adjudicated gold; report coverage, abstention, per-condition errors, CER/PER and paired comparisons. Engine agreement is not gold.

## 5. Research workflow and next acceptance gates

- **DONE for first-pass literature synthesis:** four full-text papers reviewed; relevant metadata and DOI references registered; key limitations recorded.
- **PARTIAL:** primary evidence for /s/ coarticulation, /h/ variation, stop cue reweighting, voice quality and ultrasound palatalization has been assembled, but not all full texts or source-specific raw data are available.
- **TODO:** acquire independent Korean phonetic reviewers for the IPA convention table and narrow-profile alternatives.
- **TODO:** define a speaker-/prosody-aware annotation schema and annotation guide; pilot it on a rights-cleared corpus subset.
- **TODO:** source-aligned, independently adjudicated IPA labels with two annotators and adjudication; report agreement separately by process and dialect.
- **BLOCKED:** NIKL/AI Hub corpus integration until the project has an approved use agreement and a clear permission record.
- **BLOCKED:** redistribution of Seoul Corpus audio/labels or derived corpus annotations until upstream licence scope and derivative redistribution rights are reviewed.
- **BLOCKED:** enabling narrow IPA as Ukrainian target input until independent IPA and target-layer review.

## 6. Bibliography and DOI links

- Schweizer, D., Ahn, S., & Kwon, H. (2026). *Acoustic properties of Seoul Korean stops in phrase-initial and word-medial positions*. Journal of the International Phonetic Association 56, e6. https://doi.org/10.1017/S002510032510087X
- Choi, J., Kim, S., & Cho, T. (2020). *An apparent-time study of an ongoing sound change in Seoul Korean: A prosodic account*. PLoS ONE. https://doi.org/10.1371/journal.pone.0240682
- Kang, H. (2010). *Coarticulation effects of Korean sibilant /s/ before a high front segment*. Studies in Phonetics, Phonology, and Morphology 16(1), 3–18. https://doi.org/10.17959/sppm.2010.16.1.3
- Sung, J.-H. (2014). *The articulation of lexical and post-lexical palatalization in Korean*. Interspeech. https://doi.org/10.21437/Interspeech.2014-27
- Jang, J., Kim, S., & Cho, T. (2024). *Voice quality distinctions of the three-way stop contrast under prosodic strengthening in Korean*. Phonetics and Speech Sciences 16(1). https://doi.org/10.13064/ksss.2024.16.1.017
- Kang, H., & Lee, H.-Y. (2019). *The Realizations of /h/ in Seoul and Gwangju Koreans*. The Linguistic Association of Korea Journal 84, 175–198. https://doi.org/10.17290/jlsk.2019..84.175
- Um, H.-Y. (2014). *Phonetic realizations of /h/ after a sonorant in Korean*. Studies in Phonetics, Phonology, and Morphology 20(3), 357–377. https://doi.org/10.17959/sppm.2014.20.3.357
- Ahn, M.-J. (2009). *Korean /n/-deletion: phonetic initial strengthening to denasalization*. Studies in Phonetics, Phonology, and Morphology 15(1), 53–72. https://doi.org/10.17959/sppm.2009.15.1.53
- Kim, Y. S. (2011). *An acoustic, aerodynamic and perceptual investigation of word-initial denasalization in Korean*. University College London thesis. https://discovery.ucl.ac.uk/id/eprint/1324541/1/1324541.pdf
undefined

**AI Hub platform policy [S036]:** the official FAQ states that downloading AI data requires applicant verification, purpose disclosure and an application; where NIA is not the rights holder, the individual dataset provider's policy applies. The FAQ also says derivative AI models/services/research results may be used commercially with attribution, but original dataset files and simple modified copies may not be externally shared or redistributed. This is platform-level guidance, not a KsponSpeech-specific licence grant. KsponSpeech remains blocked until its own dataset page and user agreement are reviewed and an authorized access record exists.
