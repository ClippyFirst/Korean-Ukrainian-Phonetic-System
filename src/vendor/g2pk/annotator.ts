/*
 * Browser-only adaptation of ntdgo/korean-pronunciation 1.0.1, a JavaScript
 * port of g2pK by Kyubyong Park. Licensed under the Apache License, Version 2.0.
 * Modified for this project: ESM-relative imports and a browser-only pipeline;
 * the CMU English dictionary, English transliteration, and numeral conversion
 * are intentionally excluded because mixed-script literals are preserved by
 * the surrounding adapter. See public/LICENSES/Apache-2.0.txt and
 * public/THIRD_PARTY_NOTICES.txt.
 */
/**
 * Heuristic-based POS annotation for Korean text.
 * Pure JS implementation - no MeCab dependency.
 *
 * The Python version uses MeCab for morphological analysis to tag:
 * - /J: josa (particle) 의
 * - /E: verb endings with ㄹ coda
 * - /P: verb stems with specific codas (ㄴ,ㄵ,ㅁ,ㄻ,ㄺ,ㄼ,ㄾ)
 * - /B: bound nouns (counters)
 *
 * This heuristic handles the most common cases.
 */

import { h2j } from './jamo.ts';

const BOUND_NOUNS = '군데 권 개 그루 닢 대 두 마리 모 모금 뭇 발 발짝 방 번 벌 보루 살 수 술 시 쌈 움큼 정 짝 채 척 첩 축 켤레 톨 통'.split(' ');

// Common Korean particles (josa)
const JOSA_LIST = [
  '은', '는', '이', '가', '을', '를', '에', '에서', '으로', '로', '와', '과',
  '의', '도', '만', '까지', '부터', '에게', '한테', '께', '처럼', '같이',
  '보다', '마다', '조차', '밖에', '뿐', '대로', '든지', '든가', '이나', '나',
  '이라도', '라도', '이야', '야', '이란', '란', '이라', '라',
];

/**
 * Check if a character is a Hangul syllable (AC00-D7A3)
 */
function isHangul(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return code >= 0xAC00 && code <= 0xD7A3;
}

/**
 * Annotate a Korean string with POS tags for g2p processing.
 * This is a heuristic approach that handles the most common patterns.
 */
export function annotate(str: string): string {
  let result = str;

  // 1. Mark bound nouns: number + counter word
  // Look for patterns like "3개", "10시", "5권" etc.
  // Sort by length descending to match longer bound nouns first (e.g., "발짝" before "발")
  const sortedBN = [...BOUND_NOUNS].sort((a, b) => b.length - a.length);
  for (const bn of sortedBN) {
    const escaped = bn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(\\d[\\d,]*)(${escaped})`, 'g');
    result = result.replace(regex, `$1$2/B`);
  }

  // 2. Mark josa 의 as /J
  // Heuristic: 의 after a Hangul word is likely the possessive particle
  // unless it's the first character or preceded by a space at the start
  result = result.replace(/([\uAC00-\uD7A3])의(?=\s|$|[^\/])/g, (match, prev) => {
    return prev + '의/J';
  });

  // 3. Mark verb endings with ㄹ as /E (modifying form)
  // Heuristic: a syllable ending in ᆯ followed by a space and content word
  // Common modifying endings: 할, 갈, 볼, 만날, etc.
  // Only mark when followed by space + Hangul (adnominal modifier pattern)
  // This is a rough heuristic - MeCab would be more accurate
  result = result.replace(/([\uAC00-\uD7A3]) ([\uAC00-\uD7A3])/g, (match, syllable, next) => {
    const decomposed = h2j(syllable);
    if (decomposed.endsWith('\u11AF')) { // ends with ᆯ
      return syllable + '/E ' + next;
    }
    return match;
  });

  // 4. Mark verb stems with specific codas as /P
  // This requires knowing which words are verbs - very hard without MeCab.
  // We use a minimal heuristic: common verb conjugation patterns.
  // When a syllable with specific coda (ㄴ,ㄵ,ㅁ,ㄻ,ㄺ,ㄼ,ㄾ) is followed
  // by a verb ending (ᄀ,ᄃ,ᄉ,ᄌ), mark it as /P.
  const pCodas = '\u11AB\u11AC\u11B7\u11B1\u11B0\u11B2\u11B4'; // ᆫᆬᆷᆱᆰᆲᆴ
  const verbOnsets = '\u1100\u1103\u1109\u110C'; // ᄀᄃᄉᄌ
  // We apply this at the jamo level in the pipeline, so this heuristic
  // is less critical. Skip for now.

  return result;
}
