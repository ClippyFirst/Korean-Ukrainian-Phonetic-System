/**
 * Main G2p class - Korean grapheme-to-phoneme converter.
 * Ported from g2pk/g2pk.py
 */

import { h2j } from './jamo.ts';
import { parseTable, getRuleId2Text, compose, group, gloss } from './utils.ts';
import { annotate } from './annotator.ts';
import {
  jyeo, ye, consonantUi, josaUi, vowelUi,
  jamo, rieulgiyeok, rieulbieub, verbNieun,
  balb, palatalize, modifyingRieul
} from './special.ts';
import { link1, link2, link3, link4 } from './regular.ts';
import { IDIOMS_TXT } from './idiomsData.ts';

export interface G2pOptions {
  /** Return colloquial pronunciation when true */
  descriptive?: boolean;
  /** Show conversion process and rule citations */
  verbose?: boolean;
  /** Normalize vowels (ㅐ→ㅔ, ㅒ→ㅖ, etc.) */
  groupVowels?: boolean;
  /** If true, assemble jamo into syllables; if false return decomposed jamo */
  toSyl?: boolean;
}

export class G2pBrowser {
  private table: [string, string, string[]][];
  private rule2text: Record<string, string>;
  private idiomPairs: [string, string][];

  constructor() {
    this.table = parseTable();
    this.rule2text = getRuleId2Text();

    // Parse idioms at construction time
    this.idiomPairs = [];
    for (const rawLine of IDIOMS_TXT.split(/\r?\n/)) {
      const line = rawLine.split('#')[0].trim();
      if (line.includes('===')) {
        const [str1, str2] = line.split('===');
        this.idiomPairs.push([str1, str2]);
      }
    }
  }

  /**
   * Process idiom replacements
   */
  private idioms(str: string, descriptive: boolean, verbose: boolean): string {
    const rule = 'from idioms.txt';
    const out_original = str;
    let out = str;

    for (const [str1, str2] of this.idiomPairs) {
      out = out.replace(new RegExp(str1, 'g'), str2);
    }

    gloss(verbose, out, out_original, rule);
    return out;
  }

  /**
   * Convert Korean text to its pronunciation.
   */
  convert(
    str: string,
    options: G2pOptions = {}
  ): string {
    const {
      descriptive = false,
      verbose = false,
      groupVowels = false,
      toSyl = true
    } = options;

    // 1. idioms
    str = this.idioms(str, descriptive, verbose);

    // Annotate common particles/endings with the upstream heuristic POS rules.
    str = annotate(str);

    // 5. decompose
    let inp = h2j(str);

    // 6. special rules
    const specialFuncs = [
      jyeo, ye, consonantUi, josaUi, vowelUi,
      jamo, rieulgiyeok, rieulbieub, verbNieun,
      balb, palatalize, modifyingRieul
    ];
    for (const func of specialFuncs) {
      inp = func(inp, descriptive, verbose);
    }
    inp = inp.replace(/\/[PJEB]/g, '');

    // 7. regular table: batchim + onset
    for (const [str1, str2, ruleIds] of this.table) {
      const _inp = inp;
      inp = inp.replace(new RegExp(str1, 'g'), str2);

      if (ruleIds.length > 0) {
        const rule = ruleIds.map(id => this.rule2text[id] || '').join('\n');
        gloss(verbose, inp, _inp, rule);
      }
    }

    // 8. link
    for (const func of [link1, link2, link3, link4]) {
      inp = func(inp, descriptive, verbose);
    }

    // 9. postprocessing
    if (groupVowels) {
      inp = group(inp);
    }

    if (toSyl) {
      inp = compose(inp);
    }

    return inp;
  }
}
