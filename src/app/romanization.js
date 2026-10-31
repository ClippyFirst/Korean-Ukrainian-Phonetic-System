/**
 * NIKL-based Revised Romanization (RR) from source orthography + resolved
 * Hangul surface form. Surface syllables drive the pronunciation-sensitive RR
 * rules; source spelling is retained for NIKL's explicit orthographic
 * exceptions (e.g. compound fortis and selected noun + ㅎ cases).
 *
 * This is a conservative subset, not a complete name/administrative-unit
 * romanizer. It does not run Korean phonological rules or feed the IPA-first
 * Ukrainian renderer. It records word/sentence position and coda context for
 * the separate RR→Ukrainian adapter.
 */
const INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const VOWEL_JAMO = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const CODA_JAMO = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const ONSETS = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const VOWELS = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const CODAS = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];
const SENTENCE_END = new Set(['.', '!', '?', '。', '！', '？', '\n']);
const SONORANT_CODAS = new Set(['n', 'm', 'ng', 'l']);
const SONORANT_ONSETS = new Set(['ㄴ', 'ㄹ', 'ㅁ']);

// NIKL, Romanization of Korean, §3(1): these source forms retain the written
// lenis consonant instead of romanizing the compound's fortis surface onset.
// The two noun + ㅎ examples retain written h rather than a surface aspirate.
// Match only the attested source prefixes; do not generalize to unseen words.
const NIKL_RR_ORTHOGRAPHIC_EXCEPTIONS = [
  {orthography: '압구정', rule: 'NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED'},
  {orthography: '낙동강', rule: 'NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED'},
  {orthography: '죽변', rule: 'NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED'},
  {orthography: '낙성대', rule: 'NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED'},
  {orthography: '합정', rule: 'NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED'},
  {orthography: '팔당', rule: 'NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED'},
  {orthography: '샛별', rule: 'NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED'},
  {orthography: '울산', rule: 'NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED'},
  {orthography: '묵호', rule: 'NIKL-RR-3-1-NOUN-H-NOT-ASPIRATED'},
  {orthography: '집현전', rule: 'NIKL-RR-3-1-NOUN-H-NOT-ASPIRATED'}
].sort((a, b) => b.orthography.length - a.orthography.length);

function isHangulSyllable(code) {
  return code >= 0xac00 && code <= 0xd7a3;
}

function decomposeSyllable(char) {
  const offset = char.codePointAt(0) - 0xac00;
  const onsetIndex = Math.floor(offset / 588);
  const vowelIndex = Math.floor((offset % 588) / 28);
  const codaIndex = offset % 28;
  return {
    onsetIndex,
    vowelIndex,
    codaIndex,
    onsetHangul: INITIALS[onsetIndex],
    vowelHangul: VOWEL_JAMO[vowelIndex],
    codaHangul: CODA_JAMO[codaIndex],
    onset: ONSETS[onsetIndex],
    vowel: VOWELS[vowelIndex],
    coda: CODAS[codaIndex]
  };
}

const CODA_TO_RESYLLABIFIED_ONSET = {
  // Only simple codas with an unambiguous one-to-one surface transfer are
  // classified automatically. Complex codas and ㅎ-conditioned changes stay
  // explicitly ambiguous until the surface rule can be verified.
  'ㄱ': 'ㄱ', 'ㄲ': 'ㄲ', 'ㄴ': 'ㄴ', 'ㄷ': 'ㄷ', 'ㄹ': 'ㄹ',
  'ㅁ': 'ㅁ', 'ㅂ': 'ㅂ', 'ㅅ': 'ㅅ', 'ㅆ': 'ㅆ', 'ㅈ': 'ㅈ',
  'ㅊ': 'ㅊ', 'ㅋ': 'ㅋ', 'ㅌ': 'ㅌ', 'ㅍ': 'ㅍ'
};

function extractHangulSyllables(value) {
  const chars = Array.from(String(value ?? ''));
  const syllables = [];
  let wordIndex = 0;
  let i = 0;
  while (i < chars.length) {
    if (!isHangulSyllable(chars[i].codePointAt(0))) {
      i += 1;
      continue;
    }
    wordIndex += 1;
    while (i < chars.length && isHangulSyllable(chars[i].codePointAt(0))) {
      syllables.push({ char: chars[i], wordIndex, parts: decomposeSyllable(chars[i]) });
      i += 1;
    }
  }
  return syllables;
}

function leftContextFor(previousCoda, firstInWord) {
  if (firstInWord) return 'word-boundary';
  if (!previousCoda) return 'vowel';
  return SONORANT_CODAS.has(previousCoda) ? 'sonorant' : 'obstruent';
}

/**
 * Romanize a Hangul surface string using RR values and expose contextual
 * metadata for every syllable. Non-Hangul text is preserved literally.
 */
export function romanizeRevisedDetailed(surface, original = surface) {
  const chars = Array.from(String(surface ?? ''));
  const sourceSyllables = extractHangulSyllables(original);
  const surfaceSyllables = extractHangulSyllables(surface);
  const alignmentKnown = sourceSyllables.length === surfaceSyllables.length
    && sourceSyllables.every((unit, index) => unit.wordIndex === surfaceSyllables[index].wordIndex);
  const sourceWords = new Map();
  for (const unit of sourceSyllables) {
    if (!sourceWords.has(unit.wordIndex)) sourceWords.set(unit.wordIndex, []);
    sourceWords.get(unit.wordIndex).push(unit);
  }
  const segments = [];
  let output = '';
  let wordIndex = 0;
  let sentenceIndex = 0;
  let sentenceWordIndex = 0;
  let sentenceInitial = true;
  let i = 0;
  let syllableOrdinal = 0;

  while (i < chars.length) {
    if (!isHangulSyllable(chars[i].codePointAt(0))) {
      const literal = chars[i];
      output += literal;
      segments.push({ type: 'literal', text: literal });
      if (SENTENCE_END.has(literal)) {
        sentenceIndex += 1;
        sentenceWordIndex = 0;
        sentenceInitial = true;
      }
      i += 1;
      continue;
    }

    const start = i;
    while (i < chars.length && isHangulSyllable(chars[i].codePointAt(0))) i += 1;
    const word = chars.slice(start, i);
    const sentencePosition = sentenceInitial ? 'sentence-initial' : 'sentence-medial';
    sentenceInitial = false;
    wordIndex += 1;
    sentenceWordIndex += 1;
    let previousCoda = '';
    const alignedSourceWord = alignmentKnown
      ? sourceWords.get(surfaceSyllables[syllableOrdinal]?.wordIndex) || []
      : [];
    const sourceWordText = alignedSourceWord.map((unit) => unit.char).join('');
    const rrException = NIKL_RR_ORTHOGRAPHIC_EXCEPTIONS.find((item) => sourceWordText.startsWith(item.orthography)) || null;
    const rrExceptionSyllables = rrException ? Array.from(rrException.orthography).length : 0;

    word.forEach((char, syllableIndex) => {
      const surfaceParts = decomposeSyllable(char);
      const surfaceUnit = surfaceSyllables[syllableOrdinal];
      const sourceUnit = alignmentKnown ? sourceSyllables[syllableOrdinal] : null;
      const useOrthographicException = Boolean(rrException && syllableIndex < rrExceptionSyllables && sourceUnit);
      const parts = useOrthographicException ? sourceUnit.parts : surfaceParts;
      const rrRule = useOrthographicException ? rrException.rule : 'NIKL-RR-SURFACE-BASED';
      const previousSource = alignmentKnown ? sourceSyllables[syllableOrdinal - 1] : null;
      const previousSurface = alignmentKnown ? surfaceSyllables[syllableOrdinal - 1] : null;
      const transferredOnset = previousSource
        ? CODA_TO_RESYLLABIFIED_ONSET[previousSource.parts.codaHangul]
        : null;
      const resyllabified = Boolean(
        sourceUnit
        && previousSource
        && sourceUnit.wordIndex === previousSource.wordIndex
        && sourceUnit.parts.onsetHangul === 'ㅇ'
        && transferredOnset
        && transferredOnset !== 'ㅇ'
        && surfaceUnit.parts.onsetHangul === transferredOnset
        && previousSurface.parts.codaHangul === ''
      );
      let onset = parts.onset;
      // NIKL: ㄹㄹ is romanized ll. The resolved surface form already contains
      // any phonological assimilation; this step only applies RR's r/l choice.
      if (parts.onsetHangul === 'ㄹ' && previousCoda === 'l') onset = 'l';
      const text = onset + parts.vowel + parts.coda;
      const nextParts = syllableIndex + 1 < word.length ? decomposeSyllable(word[syllableIndex + 1]) : null;
      const rightContext = !nextParts
        ? 'word-boundary'
        : nextParts.onsetHangul === 'ㅇ'
          ? 'vowel'
          : SONORANT_ONSETS.has(nextParts.onsetHangul)
            ? 'sonorant'
            : 'obstruent';
      const wordPosition = word.length === 1
        ? 'single'
        : syllableIndex === 0
          ? 'initial'
          : syllableIndex === word.length - 1
            ? 'final'
            : 'medial';
      const leftContext = leftContextFor(previousCoda, syllableIndex === 0);
      const onsetClass = ['ㅋ', 'ㅌ', 'ㅍ', 'ㅊ'].includes(parts.onsetHangul)
        ? 'aspirated'
        : ['ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ'].includes(parts.onsetHangul)
          ? 'fortis'
          : ['ㄱ', 'ㄷ', 'ㅂ', 'ㅈ'].includes(parts.onsetHangul)
            ? 'lenis'
            : 'other';
      output += text;
      segments.push({
        type: 'syllable',
        source: char,
        sourceOrthography: sourceUnit?.char ?? char,
        rrRule,
        text,
        onset,
        vowel: parts.vowel,
        coda: parts.coda,
        onsetHangul: parts.onsetHangul,
        vowelHangul: parts.vowelHangul,
        codaHangul: parts.codaHangul,
        onsetClass,
        onsetContext: resyllabified ? 'resyllabified' : parts.onsetHangul === 'ㅇ' ? 'silent' : sourceUnit?.parts.onsetHangul === 'ㅇ' ? 'ambiguous-consonantal' : alignmentKnown ? 'consonantal' : 'ambiguous-consonantal',
        onsetOrigin: resyllabified ? 'previous-coda' : parts.onsetHangul === 'ㅇ' && sourceUnit?.parts.onsetHangul === 'ㅇ' ? 'silent-onset' : alignmentKnown && sourceUnit?.parts.onsetHangul !== 'ㅇ' ? 'source-onset' : 'unknown',
        alignmentStatus: alignmentKnown ? 'aligned' : 'unknown',
        wordIndex,
        sentenceWordIndex,
        sentenceIndex,
        syllableIndex,
        wordLength: word.length,
        wordPosition,
        sentencePosition,
        leftContext,
        rightContext
      });
      previousCoda = parts.coda;
      syllableOrdinal += 1;
    });
  }

  return { text: output, segments };
}

export function romanizeRevised(surface, original = surface) {
  return romanizeRevisedDetailed(surface, original).text;
}
