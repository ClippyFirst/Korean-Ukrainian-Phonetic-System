/**
 * Korean Revised Romanization (RR) for an already-resolved Hangul surface form.
 *
 * RR follows standard Korean pronunciation. This adapter encodes the resolved
 * surface syllables; it does not run Korean phonological rules or feed the
 * IPA-first Ukrainian renderer. It also records word/sentence position and
 * the immediately preceding coda class for the separate RR→Ukrainian adapter.
 */
const INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const VOWEL_JAMO = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const CODA_JAMO = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const ONSETS = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const VOWELS = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const CODAS = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];
const SENTENCE_END = new Set(['.', '!', '?', '。', '！', '？', '\n']);
const SONORANT_CODAS = new Set(['n', 'm', 'ng', 'l']);

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

function leftContextFor(previousCoda, firstInWord) {
  if (firstInWord) return 'word-boundary';
  if (!previousCoda) return 'vowel';
  return SONORANT_CODAS.has(previousCoda) ? 'sonorant' : 'obstruent';
}

/**
 * Romanize a Hangul surface string using RR values and expose contextual
 * metadata for every syllable. Non-Hangul text is preserved literally.
 */
export function romanizeRevisedDetailed(surface) {
  const chars = Array.from(String(surface ?? ''));
  const segments = [];
  let output = '';
  let wordIndex = 0;
  let sentenceIndex = 0;
  let sentenceInitial = true;
  let i = 0;

  while (i < chars.length) {
    if (!isHangulSyllable(chars[i].codePointAt(0))) {
      const literal = chars[i];
      output += literal;
      segments.push({ type: 'literal', text: literal });
      if (SENTENCE_END.has(literal)) {
        sentenceIndex += 1;
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
    let previousCoda = '';

    word.forEach((char, syllableIndex) => {
      const parts = decomposeSyllable(char);
      let onset = parts.onset;
      // NIKL: ㄹㄹ is romanized ll. The resolved surface form already contains
      // any phonological assimilation; this step only applies RR's r/l choice.
      if (parts.onsetHangul === 'ㄹ' && previousCoda === 'l') onset = 'l';
      const text = onset + parts.vowel + parts.coda;
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
        text,
        onset,
        vowel: parts.vowel,
        coda: parts.coda,
        onsetHangul: parts.onsetHangul,
        vowelHangul: parts.vowelHangul,
        codaHangul: parts.codaHangul,
        onsetClass,
        wordIndex,
        sentenceIndex,
        syllableIndex,
        wordLength: word.length,
        wordPosition,
        sentencePosition,
        leftContext,
        rightContext: 'vowel'
      });
      previousCoda = parts.coda;
    });
  }

  return { text: output, segments };
}

export function romanizeRevised(surface) {
  return romanizeRevisedDetailed(surface).text;
}
