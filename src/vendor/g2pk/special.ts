/**
 * Special phonological rules for Korean.
 * Ported from g2pk/special.py
 */

import { gloss, getRuleId2Text } from './utils.ts';

const ruleId2Text = getRuleId2Text();

// ======================== Vowels ========================

/** Rule 5.1: ㅖ after ㅈ,ㅉ,ㅊ → ㅓ */
export function jyeo(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['5.1'];
  const out = inp.replace(/([\u110C\u110D\u110E])\u1167/g, '$1\u1165');
  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 5.2: ㅖ → ㅔ (descriptive mode) */
export function ye(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['5.2'];
  let out: string;
  if (descriptive) {
    out = inp.replace(/([\u1100\u1101\u1103\u1104\u1105\u1106\u1107\u1108\u110C\u110D\u110E\u110F\u1110\u1111\u1112])\u1168/g, '$1\u1166');
  } else {
    out = inp;
  }
  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 5.3: ㅢ after consonant → ㅣ */
export function consonantUi(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['5.3'];
  const out = inp.replace(/([\u1100\u1101\u1102\u1103\u1104\u1105\u1106\u1107\u1108\u1109\u110A\u110C\u110D\u110E\u110F\u1110\u1111\u1112])\u1174/g, '$1\u1175');
  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 5.4.2: josa ㅢ → ㅔ (descriptive) */
export function josaUi(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['5.4.2'];
  let out: string;
  if (descriptive) {
    out = inp.replace(/\uC758\/J/g, '\uC5D0');
  } else {
    out = inp.replaceAll('/J', '');
  }
  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 5.4.1: non-initial ㅢ → ㅣ (descriptive) */
export function vowelUi(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['5.4.1'];
  let out: string;
  if (descriptive) {
    out = inp.replace(/(\S\u110B)\u1174/g, '$1\u1175');
  } else {
    out = inp;
  }
  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 16: Hangul letter name phonemes */
export function jamo(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['16'];
  let out = inp;

  out = out.replace(/(\uADF8)\u11AE\u110B/g, '$1\u1109');        // 그 + ㄷ + ᄋ → 그ᄉ
  out = out.replace(/(\uC73C)[\u11BD\u11BE\u11C0\u11C2]\u110B/g, '$1\u1109');  // 으 + ㅈ/ㅊ/ㅌ/ㅎ + ᄋ → 으ᄉ
  out = out.replace(/(\uC73C)[\u11BF]\u110B/g, '$1\u1100');       // 으 + ㅋ + ᄋ → 으ᄀ
  out = out.replace(/(\uC73C)[\u11C1]\u110B/g, '$1\u1107');       // 으 + ㅍ + ᄋ → 으ᄇ

  gloss(verbose, out, inp, rule);
  return out;
}

// ======================== 어간 받침 ========================

/** Rule 11.1: verb stem ㄺ before ㄱ/ㄲ → ㄹ */
export function rieulgiyeok(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['11.1'];
  let out = inp;
  out = out.replace(/\u11B0\/P([\u1100\u1101])/g, '\u11AF\u1101');
  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 25: ㄼ,ㄾ coda + consonants → hardening */
export function rieulbieub(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['25'];
  let out = inp;

  out = out.replace(/([\u11B2\u11B4])\/P\u1100/g, '$1\u1101');
  out = out.replace(/([\u11B2\u11B4])\/P\u1103/g, '$1\u1104');
  out = out.replace(/([\u11B2\u11B4])\/P\u1109/g, '$1\u110A');
  out = out.replace(/([\u11B2\u11B4])\/P\u110C/g, '$1\u110D');

  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 24: verb stem ㄴ/ㅁ codas + onset → hardening */
export function verbNieun(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['24'];
  let out = inp;

  const pairs: [string, string][] = [
    ['([\u11AB\u11B7])/P\u1100', '$1\u1101'],
    ['([\u11AB\u11B7])/P\u1103', '$1\u1104'],
    ['([\u11AB\u11B7])/P\u1109', '$1\u110A'],
    ['([\u11AB\u11B7])/P\u110C', '$1\u110D'],

    ['\u11AC/P\u1100', '\u11AB\u1101'],
    ['\u11AC/P\u1103', '\u11AB\u1104'],
    ['\u11AC/P\u1109', '\u11AB\u110A'],
    ['\u11AC/P\u110C', '\u11AB\u110D'],

    ['\u11B1/P\u1100', '\u11B7\u1101'],
    ['\u11B1/P\u1103', '\u11B7\u1104'],
    ['\u11B1/P\u1109', '\u11B7\u110A'],
    ['\u11B1/P\u110C', '\u11B7\u110D'],
  ];

  for (const [s1, s2] of pairs) {
    out = out.replace(new RegExp(s1, 'g'), s2);
  }

  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 10.1: 밟 and 넓 exceptions */
export function balb(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['10.1'];
  let out = inp;
  const syllableFinalOrConsonants = '($|[^\u110B\u1112])';

  out = out.replace(new RegExp('(\uBC14)\u11B2(' + syllableFinalOrConsonants + ')', 'g'), '$1\u11B8$2');
  out = out.replace(new RegExp('(\uB108)\u11B2([\u110C\u110D]\u116E|[\u1103\u1104]\u116E)', 'g'), '$1\u11B8$2');

  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 17: palatalization ㄷ,ㅌ + ㅣ → ㅈ,ㅊ */
export function palatalize(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['17'];
  let out = inp;

  out = out.replace(/\u11AE\u110B([\u1175\u1167])/g, '\u110C$1');
  out = out.replace(/\u11C0\u110B([\u1175\u1167])/g, '\u110E$1');
  out = out.replace(/\u11B4\u110B([\u1175\u1167])/g, '\u11AF\u110E$1');
  out = out.replace(/\u11AE\u1112([\u1175])/g, '\u110E$1');

  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 27: modifying rieul + consonants → hardening */
export function modifyingRieul(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['27'];
  let out = inp;

  const pairs: [string, string][] = [
    ['\u11AF/E \u1100', '\u11AF \u1101'],
    ['\u11AF/E \u1103', '\u11AF \u1104'],
    ['\u11AF/E \u1107', '\u11AF \u1108'],
    ['\u11AF/E \u1109', '\u11AF \u110A'],
    ['\u11AF/E \u110C', '\u11AF \u110D'],

    ['\u11AF\uAC78', '\u11AF\uAF04'],      // ᆯ걸 → ᆯ껄
    ['\u11AF\uBC16\uC5D0', '\u11AF\uBE60\uAED8'],  // ᆯ밖에 → ᆯ빠께
    ['\u11AF\uC138\uB77C', '\u11AF\uC40E\uB77C'],  // ᆯ세라 → ᆯ쎄라
    ['\u11AF\uC218\uB85D', '\u11AF\uC410\uB85D'],  // ᆯ수록 → ᆯ쑤록
    ['\u11AF\uC9C0\uB77C\uB3C4', '\u11AF\uCC0C\uB77C\uB3C4'],  // ᆯ지라도 → ᆯ찌라도
    ['\u11AF\uC9C0\uC5B8\uC815', '\u11AF\uCC0C\uC5B8\uC815'],  // ᆯ지언정 → ᆯ찌언정
    ['\u11AF\uC9C4\uB300', '\u11AF\uCC10\uB300'],  // ᆯ진대 → ᆯ찐대
  ];

  for (const [s1, s2] of pairs) {
    out = out.replace(new RegExp(s1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), s2);
  }

  gloss(verbose, out, inp, rule);
  return out;
}
