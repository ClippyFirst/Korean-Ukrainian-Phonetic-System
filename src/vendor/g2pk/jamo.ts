/**
 * Hangul Jamo decomposition and composition utilities.
 * Pure Unicode math - no external dependencies.
 */

// Hangul syllable block range
const HANGUL_BASE = 0xAC00;
const HANGUL_END = 0xD7A3;

// Choseong (initial consonants): ᄀ-ᄒ (U+1100-U+1112)
const CHO_BASE = 0x1100;
const CHO_COUNT = 19;

// Jungseong (vowels): ᅡ-ᅵ (U+1161-U+1175)
const JUNG_BASE = 0x1161;
const JUNG_COUNT = 21;

// Jongseong (final consonants): ᆨ-ᇂ (U+11A8-U+11C2), 0 = no coda
const JONG_BASE = 0x11A7; // offset so index 1 = ᆨ
const JONG_COUNT = 28; // 0 = no jongseong, 1-27 = actual codas

/**
 * Decompose a Hangul syllable string into jamo.
 * Non-Hangul characters pass through unchanged.
 */
export function h2j(text: string): string {
  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= HANGUL_BASE && code <= HANGUL_END) {
      const index = code - HANGUL_BASE;
      const cho = Math.floor(index / (JUNG_COUNT * JONG_COUNT));
      const jung = Math.floor((index % (JUNG_COUNT * JONG_COUNT)) / JONG_COUNT);
      const jong = index % JONG_COUNT;

      result += String.fromCharCode(CHO_BASE + cho);
      result += String.fromCharCode(JUNG_BASE + jung);
      if (jong > 0) {
        result += String.fromCharCode(JONG_BASE + jong);
      }
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * Compose jamo characters into a Hangul syllable.
 * Takes 2 or 3 jamo characters (cho, jung, optional jong).
 */
export function j2h(cho: string, jung: string, jong?: string): string {
  const choIndex = cho.charCodeAt(0) - CHO_BASE;
  const jungIndex = jung.charCodeAt(0) - JUNG_BASE;
  const jongIndex = jong ? jong.charCodeAt(0) - JONG_BASE : 0;

  if (choIndex < 0 || choIndex >= CHO_COUNT) return cho + jung + (jong || '');
  if (jungIndex < 0 || jungIndex >= JUNG_COUNT) return cho + jung + (jong || '');
  if (jongIndex < 0 || jongIndex >= JONG_COUNT) return cho + jung + (jong || '');

  const code = HANGUL_BASE + choIndex * JUNG_COUNT * JONG_COUNT + jungIndex * JONG_COUNT + jongIndex;
  return String.fromCharCode(code);
}

/**
 * Check if a character is a Hangul syllable block.
 */
export function isHangulSyllable(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= HANGUL_BASE && code <= HANGUL_END;
}
