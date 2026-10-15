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
 * Regular linking rules for Korean pronunciation.
 * Ported from g2pk/regular.py
 */

import { gloss, getRuleId2Text } from './utils.ts';

const ruleId2Text = getRuleId2Text();

/** Rule 13: simple coda + void onset linking */
export function link1(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['13'];
  let out = inp;

  const pairs: [string, string][] = [
    ['\u11A8\u110B', '\u1100'],   // ᆨᄋ → ᄀ
    ['\u11A9\u110B', '\u1101'],   // ᆩᄋ → ᄁ
    ['\u11AB\u110B', '\u1102'],   // ᆫᄋ → ᄂ
    ['\u11AE\u110B', '\u1103'],   // ᆮᄋ → ᄃ
    ['\u11AF\u110B', '\u1105'],   // ᆯᄋ → ᄅ
    ['\u11B7\u110B', '\u1106'],   // ᆷᄋ → ᄆ
    ['\u11B8\u110B', '\u1107'],   // ᆸᄋ → ᄇ
    ['\u11BA\u110B', '\u1109'],   // ᆺᄋ → ᄉ
    ['\u11BB\u110B', '\u110A'],   // ᆻᄋ → ᄊ
    ['\u11BD\u110B', '\u110C'],   // ᆽᄋ → ᄌ
    ['\u11BE\u110B', '\u110E'],   // ᆾᄋ → ᄎ
    ['\u11BF\u110B', '\u110F'],   // ᆿᄋ → ᄏ
    ['\u11C0\u110B', '\u1110'],   // ᇀᄋ → ᄐ
    ['\u11C1\u110B', '\u1111'],   // ᇁᄋ → ᄑ
  ];

  for (const [s1, s2] of pairs) {
    out = out.replaceAll(s1, s2);
  }

  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 14: complex coda + void onset linking */
export function link2(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['14'];
  let out = inp;

  const pairs: [string, string][] = [
    ['\u11AA\u110B', '\u11A8\u110A'],   // ᆪᄋ → ᆨᄊ
    ['\u11AC\u110B', '\u11AB\u110C'],   // ᆬᄋ → ᆫᄌ
    ['\u11B0\u110B', '\u11AF\u1100'],   // ᆰᄋ → ᆯᄀ
    ['\u11B1\u110B', '\u11AF\u1106'],   // ᆱᄋ → ᆯᄆ
    ['\u11B2\u110B', '\u11AF\u1107'],   // ᆲᄋ → ᆯᄇ
    ['\u11B3\u110B', '\u11AF\u110A'],   // ᆳᄋ → ᆯᄊ
    ['\u11B4\u110B', '\u11AF\u1110'],   // ᆴᄋ → ᆯᄐ
    ['\u11B5\u110B', '\u11AF\u1111'],   // ᆵᄋ → ᆯᄑ
    ['\u11B9\u110B', '\u11B8\u110A'],   // ᆹᄋ → ᆸᄊ
  ];

  for (const [s1, s2] of pairs) {
    out = out.replaceAll(s1, s2);
  }

  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 15: cross-word boundary linking */
export function link3(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['15'];
  let out = inp;

  const pairs: [string, string][] = [
    ['\u11A8 \u110B', ' \u1100'],   // ᆨ ᄋ → ᄀ
    ['\u11A9 \u110B', ' \u1101'],   // ᆩ ᄋ → ᄁ
    ['\u11AB \u110B', ' \u1102'],
    ['\u11AE \u110B', ' \u1103'],
    ['\u11AF \u110B', ' \u1105'],
    ['\u11B7 \u110B', ' \u1106'],
    ['\u11B8 \u110B', ' \u1107'],
    ['\u11BA \u110B', ' \u1109'],
    ['\u11BB \u110B', ' \u110A'],
    ['\u11BD \u110B', ' \u110C'],
    ['\u11BE \u110B', ' \u110E'],
    ['\u11BF \u110B', ' \u110F'],
    ['\u11C0 \u110B', ' \u1110'],
    ['\u11C1 \u110B', ' \u1111'],

    ['\u11AA \u110B', '\u11A8 \u110A'],  // ᆪ ᄋ → ᆨ ᄊ
    ['\u11AC \u110B', '\u11AB \u110C'],
    ['\u11B0 \u110B', '\u11AF \u1100'],
    ['\u11B1 \u110B', '\u11AF \u1106'],
    ['\u11B2 \u110B', '\u11AF \u1107'],
    ['\u11B3 \u110B', '\u11AF \u110A'],
    ['\u11B4 \u110B', '\u11AF \u1110'],
    ['\u11B5 \u110B', '\u11AF \u1111'],
    ['\u11B9 \u110B', '\u11B8 \u110A'],
  ];

  for (const [s1, s2] of pairs) {
    out = out.replaceAll(s1, s2);
  }

  gloss(verbose, out, inp, rule);
  return out;
}

/** Rule 12.4: ㅎ coda before vowel */
export function link4(inp: string, descriptive = false, verbose = false): string {
  const rule = ruleId2Text['12.4'];
  let out = inp;

  const pairs: [string, string][] = [
    ['\u11C2\u110B', '\u110B'],     // ᇂᄋ → ᄋ
    ['\u11AD\u110B', '\u1102'],     // ᆭᄋ → ᄂ
    ['\u11B6\u110B', '\u1105'],     // ᆶᄋ → ᄅ
  ];

  for (const [s1, s2] of pairs) {
    out = out.replaceAll(s1, s2);
  }

  gloss(verbose, out, inp, rule);
  return out;
}
