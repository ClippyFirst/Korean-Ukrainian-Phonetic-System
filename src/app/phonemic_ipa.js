/**
 * Browser-side underlying Korean phonemic adapter.
 * Inventory mapping only: no surface rules, lexical overrides or acoustic inference.
 */
import { decompose } from './engine_shared.js';

const PHONEME_BY_JAMO = Object.freeze({
  'ㄱ':'k','ㄲ':'k͈','ㄴ':'n','ㄷ':'t','ㄸ':'t͈','ㄹ':'ɾ','ㅁ':'m',
  'ㅂ':'p','ㅃ':'p͈','ㅅ':'s','ㅆ':'s͈','ㅇ':'ŋ','ㅈ':'tɕ','ㅉ':'tɕ͈',
  'ㅊ':'tɕʰ','ㅋ':'kʰ','ㅌ':'tʰ','ㅍ':'pʰ','ㅎ':'h'
});
const VOWEL_IPA = Object.freeze({
  'ㅏ':'a','ㅐ':'ɛ','ㅑ':'ja','ㅒ':'jɛ','ㅓ':'ʌ','ㅔ':'e','ㅕ':'jʌ',
  'ㅖ':'je','ㅗ':'o','ㅘ':'wa','ㅙ':'wɛ','ㅚ':'ø','ㅛ':'jo','ㅜ':'u',
  'ㅝ':'wʌ','ㅞ':'we','ㅟ':'y','ㅠ':'ju','ㅡ':'ɯ','ㅢ':'ɰi','ㅣ':'i'
});
const COMPLEX_CODA = Object.freeze({
  'ㄳ':['ㄱ','ㅅ'],'ㄵ':['ㄴ','ㅈ'],'ㄶ':['ㄴ','ㅎ'],
  'ㄺ':['ㄹ','ㄱ'],'ㄻ':['ㄹ','ㅁ'],'ㄼ':['ㄹ','ㅂ'],
  'ㄽ':['ㄹ','ㅅ'],'ㄾ':['ㄹ','ㅌ'],'ㄿ':['ㄹ','ㅍ'],
  'ㅀ':['ㄹ','ㅎ'],'ㅄ':['ㅂ','ㅅ']
});
const isHangul = ch => ch >= '가' && ch <= '힣';
const isPunctuation = ch => /^\p{P}$/u.test(ch);
const isWhitespace = ch => /^\s$/u.test(ch);

export function phonemicIpaFromHangul(source) {
  if (typeof source !== 'string') throw new TypeError('source must be a string');
  const chars = [...source];
  const trace = [];
  const boundaries = [];
  const rendered = [];
  let previousSyllable = false;
  let unsupported = false;

  for (let index = 0; index < chars.length; index++) {
    const char = chars[index];
    if (isWhitespace(char)) {
      if (rendered.length && rendered.at(-1) !== ' ') rendered.push(' ');
      if (previousSyllable) boundaries.push({ offset: index, kind: 'word' });
      previousSyllable = false;
      continue;
    }
    if (isPunctuation(char)) {
      rendered.push(char);
      if (previousSyllable) boundaries.push({ offset: index, kind: 'phrase' });
      previousSyllable = false;
      continue;
    }
    if (!isHangul(char)) {
      unsupported = true;
      trace.push({
        source: char, source_span: { start: index, end: index + 1 },
        onset: null, vowel: null, coda: [], ipa: null,
        status: 'unsupported-source-character'
      });
      previousSyllable = false;
      continue;
    }

    const parts = decompose(char);
    const onset = parts ? (parts.onset === 'ㅇ' ? '' : (PHONEME_BY_JAMO[parts.onset] ?? null)) : null;
    const vowel = parts ? (VOWEL_IPA[parts.vowel] ?? null) : null;
    const codaJamo = parts?.coda
      ? (COMPLEX_CODA[parts.coda] || [parts.coda])
      : [];
    const coda = codaJamo.map(jamo => PHONEME_BY_JAMO[jamo] ?? null);
    if (onset === null || vowel === null || coda.some(value => value === null)) {
      unsupported = true;
      trace.push({
        source: char, source_span: { start: index, end: index + 1 },
        onset: null, vowel: null, coda, ipa: null,
        status: 'unsupported-jamo-mapping'
      });
      previousSyllable = false;
      continue;
    }

    const ipa = onset + vowel + coda.join('');
    if (previousSyllable) rendered.push('.');
    rendered.push(ipa);
    trace.push({
      source: char, source_span: { start: index, end: index + 1 },
      onset, vowel, coda, ipa,
      status: 'underlying-phonemic-grapheme-derived'
    });
    boundaries.push({ offset: index + 1, kind: 'syllable' });
    previousSyllable = true;
  }

  return {
    ipa: unsupported ? null : rendered.join(''),
    profile_id: 'clippyfirst-korean-phonemic-v1',
    profile_version: 1,
    level: 'phonemic',
    status: unsupported ? 'partial-underlying-phonemic-analysis' : 'underlying-phonemic-grapheme-derived',
    evidence_status: 'deterministic-underlying-Hangul-onset-nucleus-coda-inventory; no surface phonological or acoustic inference',
    target_compatible: false,
    trace,
    boundaries
  };
}
