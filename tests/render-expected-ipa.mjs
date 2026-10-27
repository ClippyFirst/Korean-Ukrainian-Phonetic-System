/**
 * Test-only renderer for IPA syllable arrays, using source eojeol boundaries.
 * This checks output serialization; it does not generate or validate phonology.
 */
export function parseIpaSyllables(ipaValue) {
  const raw = Array.isArray(ipaValue) ? ipaValue.join('|') : String(ipaValue ?? '');
  return raw.split(/[|.\s]+/u).filter(Boolean);
}

export function renderExpectedIpa(input, ipaValue) {
  const syllables = parseIpaSyllables(ipaValue);
  const tokens = String(input ?? '').match(/\s+|[^\s]+/gu) || [];
  let index = 0;
  return tokens.map((token, tokenIndex) => {
    if (/^\s+$/u.test(token)) return token;
    const minimumForToken = Math.max(1, [...token].filter(ch => /[가-힣]/u.test(ch)).length);
    const requiredAfter = tokens.slice(tokenIndex + 1)
      .filter(next => !(/^\s+$/u.test(next)))
      .reduce((sum, next) => sum + Math.max(1, [...next].filter(ch => /[가-힣]/u.test(ch)).length), 0);
    const count = Math.max(minimumForToken, syllables.length - index - requiredAfter);
    const current = syllables.slice(index, index + count);
    index += count;
    return current.join('.');
  }).join('');
}
