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
 * Utility functions for g2p conversion.
 */

import { j2h } from './jamo.ts';
import { TABLE_CSV } from './tableData.ts';
import { RULES_TXT } from './rulesData.ts';

// ============== English ==============

export function adjust(arpabets: string[]): string[] {
  let str = ' ' + arpabets.join(' ') + ' $';
  str = str.replace(/\d/g, '');
  str = str.replace(/ T S /g, ' TS ');
  str = str.replace(/ D Z /g, ' DZ ');
  str = str.replace(/ AW ER /g, ' AWER ');
  str = str.replace(/ IH R \$/g, ' IH ER ');
  str = str.replace(/ EH R \$/g, ' EH ER ');
  str = str.replace(/ \$/g, '');
  return str.trim().replace(/^\$ ?/, '').split(/\s+/);
}

export function toChoseong(arpabet: string): string {
  const d: Record<string, string> = {
    'B': '\u1107', 'CH': '\u110E', 'D': '\u1103', 'DH': '\u1103',
    'DZ': '\u110C', 'F': '\u1111', 'G': '\u1100', 'HH': '\u1112',
    'JH': '\u110C', 'K': '\u110F', 'L': '\u1105', 'M': '\u1106',
    'N': '\u1102', 'NG': '\u110B', 'P': '\u1111', 'R': '\u1105',
    'S': '\u1109', 'SH': '\u1109', 'T': '\u1110', 'TH': '\u1109',
    'TS': '\u110E', 'V': '\u1107', 'W': 'W', 'Y': 'Y',
    'Z': '\u110C', 'ZH': '\u110C'
  };
  return d[arpabet] ?? arpabet;
}

export function toJungseong(arpabet: string): string {
  // Note: diphthongs like AY, EY, OY use composed Hangul syllables (우, 이, 워)
  // matching the Python version exactly. This means jongseong after these
  // may be orphaned and stripped by the final jamo cleanup.
  const d: Record<string, string> = {
    'AA': '\u1161', 'AE': '\u1162', 'AH': '\u1165', 'AO': '\u1169',
    'AW': '\u1161\uC6B0', 'AWER': '\u1161\uC6CC', 'AY': '\u1161\uC774',
    'EH': '\u1166', 'ER': '\u1165', 'EY': '\u1166\uC774',
    'IH': '\u1175', 'IY': '\u1175', 'OW': '\u1169',
    'OY': '\u1169\uC774', 'UH': '\u116E', 'UW': '\u116E'
  };
  return d[arpabet] ?? arpabet;
}

export function toJongseong(arpabet: string): string {
  const d: Record<string, string> = {
    'B': '\u11B8', 'CH': '\u11BE', 'D': '\u11AE', 'DH': '\u11AE',
    'F': '\u11C1', 'G': '\u11A8', 'HH': '\u11C2', 'JH': '\u11BD',
    'K': '\u11A8', 'L': '\u11AF', 'M': '\u11B7', 'N': '\u11AB',
    'NG': '\u11BC', 'P': '\u11B8', 'R': '\u11AF', 'S': '\u11BA',
    'SH': '\u11BA', 'T': '\u11BA', 'TH': '\u11BA', 'V': '\u11B8',
    'W': '\u11BC', 'Y': '\u11BC', 'Z': '\u11BD', 'ZH': '\u11BD'
  };
  return d[arpabet] ?? arpabet;
}

export function reconstruct(str: string): string {
  const pairs: [string, string][] = [
    ['\uADF8W', '\u1100W'],
    ['\uD750W', '\u1112W'],
    ['\uD06CW', '\u110FW'],
    ['\u1102Y\u1165', '\uB2C8\uC5B4'],
    ['\u1103Y\u1165', '\uB514\uC5B4'],
    ['\u1105Y\u1165', '\uB9AC\uC5B4'],
    ['Y\u1175', '\u1175'],
    ['Y\u1161', '\u1163'],
    ['Y\u1162', '\u1164'],
    ['Y\u1165', '\u1167'],
    ['Y\u1166', '\u1168'],
    ['Y\u1169', '\u116D'],
    ['Y\u116E', '\u1172'],
    ['W\u1161', '\u116A'],
    ['W\u1162', '\u116B'],
    ['W\u1165', '\u116F'],
    ['W\u1169', '\u116F'],
    ['W\u116E', '\u116E'],
    ['W\u1166', '\u1170'],
    ['W\u1175', '\u1171'],
    ['\u1173\u1175', '\u1174'],
    ['Y', '\u1175'],
    ['W', '\u116E']
  ];
  for (const [s1, s2] of pairs) {
    str = str.replaceAll(s1, s2);
  }
  return str;
}

// ============== Hangul ==============

export function parseTable(): [string, string, string[]][] {
  const lines = TABLE_CSV.split(/\r?\n/).filter(l => l.trim());

  // The first column in each row is tab-separated (row_number\tcoda,onset1,onset2...)
  // Split header: remove the leading "1\t" prefix
  const headerLine = lines[0].replace(/^\d+\t/, '');
  const onsets = headerLine.split(',');
  const table: [string, string, string[]][] = [];

  for (let row = 1; row < lines.length; row++) {
    // Remove leading row number + tab
    const rowLine = lines[row].replace(/^\d+\t/, '');
    const cols = rowLine.split(',');
    const coda = cols[0];
    for (let i = 1; i < onsets.length; i++) {
      const cell = cols[i];
      if (!cell || cell.length === 0) continue;

      const str1 = coda + onsets[i];
      let str2: string;
      let ruleIds: string[];

      if (cell.includes('(')) {
        str2 = cell.split('(')[0];
        ruleIds = cell.split('(')[1].replace(')', '').split('/');
      } else {
        str2 = cell;
        ruleIds = [];
      }

      // Convert Python-style \1 backreferences to JS-style $1
      str2 = str2.replace(/\\1/g, '$1');

      // Fix \W to be Unicode-aware: in Python \W excludes Unicode letters (Hangul Jamo),
      // but in JS \W is just [^A-Za-z0-9_]. Replace \W with a pattern that excludes
      // Hangul Jamo (U+1100-U+11FF) and Hangul syllables (U+AC00-U+D7A3).
      const fixedStr1 = str1.replace(/\\W/g, '[^\\w\\u1100-\\u11FF\\uAC00-\\uD7A3]');

      table.push([fixedStr1, str2, ruleIds]);
    }
  }
  return table;
}

export function getRuleId2Text(): Record<string, string> {
  const rules = RULES_TXT.trim().split('\n\n');
  const result: Record<string, string> = {};

  for (const rule of rules) {
    const ruleLines = rule.split(/\r?\n/);
    const ruleId = ruleLines[0].trim();
    const texts = ruleLines.slice(1);
    result[ruleId] = texts.join('\n');
  }
  return result;
}

// ============== Postprocessing ==============

export function compose(letters: string): string {
  // Insert placeholder ᄋ before lone vowels
  letters = letters.replace(/(^|[^\u1100-\u1112])([\u1161-\u1175])/g, '$1\u110B$2');

  let str = letters;

  // c+v+c
  const cvcMatches = new Set(str.match(/[\u1100-\u1112][\u1161-\u1175][\u11A8-\u11C2]/g) || []);
  for (const syl of cvcMatches) {
    str = str.replaceAll(syl, j2h(syl[0], syl[1], syl[2]));
  }

  // c+v
  const cvMatches = new Set(str.match(/[\u1100-\u1112][\u1161-\u1175]/g) || []);
  for (const syl of cvMatches) {
    str = str.replaceAll(syl, j2h(syl[0], syl[1]));
  }

  // Handle orphaned jongseong after composed syllables without coda:
  // A Hangul syllable (AC00-D7A3) with no jongseong followed by a jongseong jamo
  // should have the jongseong attached.
  str = str.replace(/([\uAC00-\uD7A3])([\u11A8-\u11C2])/g, (match, syl, jong) => {
    const code = syl.charCodeAt(0) - 0xAC00;
    const jongIdx = code % 28;
    if (jongIdx === 0) {
      // No existing jongseong - attach it
      return String.fromCharCode(syl.charCodeAt(0) + (jong.charCodeAt(0) - 0x11A7));
    }
    return match; // Already has jongseong, leave as is
  });

  return str;
}

export function group(inp: string): string {
  inp = inp.replaceAll('\u1162', '\u1166'); // ㅐ -> ㅔ
  inp = inp.replaceAll('\u1164', '\u1168'); // ㅒ -> ㅖ
  inp = inp.replaceAll('\u116B', '\u116C'); // ㅘㅣ -> ㅚ
  inp = inp.replaceAll('\u1170', '\u116C'); // ㅝㅣ -> ㅚ
  return inp;
}

export function gloss(verbose: boolean, out: string, inp: string, rule: string): void {
  if (verbose && out !== inp && out !== inp.replace(/\/[EJPB]/g, '')) {
    console.log(compose(inp), '->', compose(out));
    console.log('\x1b[1;31m', rule, '\x1b[0m');
  }
}
