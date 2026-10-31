# Terminology

**Transliteration**: representation across writing systems; does not necessarily encode pronunciation.

**Transcription**: representation of speech sounds; may be phonemic/broad or phonetic/narrow.

**Phonemic representation**: abstract contrastive units.

**Phonetic representation**: contextually realized speech sounds.

**Hangul syllable block**: Unicode graphic unit built from modern L/V/T slots. It is not identical to a phoneme or lexical syllable.

**Grapheme-to-grapheme** and **phoneme-to-grapheme** mappings are kept distinct from phoneme-to-phoneme correspondence.

## Project output terminology

The public Ukrainian result is labelled **Ukrainian transliteration** by an explicit project convention. It is a practical Ukrainian-letter rendering informed by Korean pronunciation analysis and the project's author-developed correspondence rules. It is not literal one-to-one Hangul character substitution, and it is not the IPA string itself. Do not label this user-facing result as Ukrainian transcription.

Two distinct routes produce this project transliteration:

- **IPA-mediated route:** resolved Korean surface form → surface phonetic IPA → the existing IPA→Ukrainian target adapter.
- **RR-mediated route:** resolved Korean surface form → Revised Romanization → the existing RR→Ukrainian target adapter.

The two Ukrainian outputs should be visible together and retain separate provenance, uncertainty and trace. IPA remains an analytical representation, not a third Ukrainian output.

**Surface phonetic IPA** is the pronunciation engine's broad surface output. **Phonemic IPA baseline** is currently an orthography-derived inventory rendering; it does not independently infer morphology or prosody and must not be described as a complete phonemic G2P analysis.
