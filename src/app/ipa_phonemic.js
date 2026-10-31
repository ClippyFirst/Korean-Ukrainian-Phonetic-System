/**
 * Orthography-derived Korean phonemic baseline.
 *
 * This mirrors the project's Python phonology.phonemic_segments inventory.
 * It is intentionally separate from surface G2P IPA: it exposes underlying
 * Hangul segment values without claiming morphological/prosodic analysis.
 */
const ONSETS = [...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
const VOWELS = [...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'];
const CODAS = ['', ...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];
const CONSONANTS = {
  'ㄱ':'k','ㄲ':'k͈','ㄴ':'n','ㄷ':'t','ㄸ':'t͈','ㄹ':'ɾ','ㅁ':'m','ㅂ':'p','ㅃ':'p͈',
  'ㅅ':'s','ㅆ':'s͈','ㅇ':'ŋ','ㅈ':'tɕ','ㅉ':'tɕ͈','ㅊ':'tɕʰ','ㅋ':'kʰ','ㅌ':'tʰ','ㅍ':'pʰ','ㅎ':'h'
};
const NUCLEI = {
  'ㅏ':'a','ㅐ':'ɛ','ㅑ':'ja','ㅒ':'jɛ','ㅓ':'ʌ','ㅔ':'e','ㅕ':'jʌ','ㅖ':'je','ㅗ':'o',
  'ㅘ':'wa','ㅙ':'wɛ','ㅚ':'ø','ㅛ':'jo','ㅜ':'u','ㅝ':'wʌ','ㅞ':'we','ㅟ':'y','ㅠ':'ju',
  'ㅡ':'ɯ','ㅢ':'ɰi','ㅣ':'i'
};
const COMPLEX_CODA = {
  'ㄳ':['ㄱ','ㅅ'],'ㄵ':['ㄴ','ㅈ'],'ㄶ':['ㄴ','ㅎ'],'ㄺ':['ㄹ','ㄱ'],'ㄻ':['ㄹ','ㅁ'],
  'ㄼ':['ㄹ','ㅂ'],'ㄽ':['ㄹ','ㅅ'],'ㄾ':['ㄹ','ㅌ'],'ㄿ':['ㄹ','ㅍ'],'ㅀ':['ㄹ','ㅎ'],'ㅄ':['ㅂ','ㅅ']
};

function renderSyllable(char) {
  const offset = char.codePointAt(0) - 0xAC00;
  const onset = ONSETS[Math.floor(offset / 588)];
  const vowel = VOWELS[Math.floor((offset % 588) / 28)];
  const coda = CODAS[offset % 28];
  const parts = [];
  if (onset !== 'ㅇ') parts.push(CONSONANTS[onset]);
  parts.push(NUCLEI[vowel]);
  for (const component of (COMPLEX_CODA[coda] || (coda ? [coda] : []))) {
    parts.push(CONSONANTS[component]);
  }
  return parts.join('');
}

/**
 * Render phonemic IPA from underlying Hangul spelling.
 * Non-Hangul material is preserved as a literal with an explicit issue.
 */
export function renderPhonemicIpa(source) {
  const text = String(source ?? '');
  let ipa = '';
  let previousWasHangul = false;
  const issues = [];
  const syllables = [];
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      if (previousWasHangul) ipa += '.';
      const value = renderSyllable(char);
      ipa += value;
      syllables.push({ source: char, ipa: value });
      previousWasHangul = true;
      continue;
    }
    ipa += char;
    if (!/\s/u.test(char) && !/[\p{P}\p{S}]/u.test(char)) {
      issues.push({ source: char, reason: 'non-hangul-input-preserved-outside-phonemic-analysis' });
    }
    previousWasHangul = false;
  }
  return {
    ipa,
    syllables,
    issues,
    profile: 'clippyfirst-korean-phonemic-v1',
    level: 'phonemic',
    status: issues.length ? 'partial-orthographic-baseline' : 'orthographic-baseline-not-morphology-resolved'
  };
}
