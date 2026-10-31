/**
 * Korean Revised Romanization (RR) for an already-resolved Hangul surface form.
 *
 * This is a display/verification adapter, not a pronunciation engine. The caller
 * must supply the Korean surface form produced by the Korean G2P stage. It does
 * not infer pronunciation from original spelling and must not be used as an
 * intermediate source for IPA or Ukrainian transcription.
 */
const ONSETS = [
  'g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss',
  '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'
];
const VOWELS = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa',
  'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'
];
const CODAS = [
  '', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l',
  'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't',
  'k', 't', 'p', 't'
];

function isHangulSyllable(code) {
  return code >= 0xac00 && code <= 0xd7a3;
}

function romanizeSyllable(char, previousCoda) {
  const offset = char.codePointAt(0) - 0xac00;
  const onsetIndex = Math.floor(offset / 588);
  const vowelIndex = Math.floor((offset % 588) / 28);
  const codaIndex = offset % 28;
  let onset = ONSETS[onsetIndex];
  if (onsetIndex === 5 && previousCoda === 'l') onset = 'l';
  return { text: onset + VOWELS[vowelIndex] + CODAS[codaIndex], onset, vowel: VOWELS[vowelIndex], coda: CODAS[codaIndex] };
}

/**
 * Romanize a Hangul surface string using RR letter values.
 * Returns lowercase text; preserves whitespace, punctuation, Latin text and digits.
 */
export function romanizeRevisedDetailed(surface) {
  const chars = Array.from(String(surface ?? ''));
  let output = '';
  let previousCoda = '';
  let previousWasHangul = false;
  const segments = [];
  for (const char of chars) {
    const code = char.codePointAt(0);
    if (!isHangulSyllable(code)) {
      output += char;
      segments.push({ type: 'literal', text: char });
      previousCoda = '';
      previousWasHangul = false;
      continue;
    }
    const result = romanizeSyllable(char, previousWasHangul ? previousCoda : '');
    output += result.text;
    segments.push({ type: 'syllable', source: char, text: result.text,
      onset: result.onset, vowel: result.vowel, coda: result.coda });
    previousCoda = result.coda;
    previousWasHangul = true;
  }
  return { text: output, segments };
}

export function romanizeRevised(surface) {
  return romanizeRevisedDetailed(surface).text;
}
