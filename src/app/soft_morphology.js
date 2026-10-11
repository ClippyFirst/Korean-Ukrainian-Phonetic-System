/**
 * Soft-heuristic morphology layer (browser).
 * Contract: docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md
 *
 * Opt-in only. Default path remains strict (exact evidence).
 * Soft unlocks R002 formal liaison, R003 ㅎ-deletion, R007 palatalization
 * for a closed same-eojeol formal-ending inventory. Never §15 substantive,
 * never R009/R010–R016, never cross-whitespace.
 */

export const SOFT_FORMAL_ENDINGS = new Map([
  ['이', 'formal_i'],
  ['을', 'formal_ul_lul'],
  ['를', 'formal_ul_lul'],
  ['에', 'formal_e'],
  ['어', 'vowel_ending'],
  ['아', 'vowel_ending'],
  ['았', 'past_extension'],
  ['었', 'past_extension'],
  ['였', 'past_extension'],
  ['고', 'go'],
  ['다', 'da'],
  ['은', 'topic'],
  ['는', 'topic'],
  ['인', 'in'],
  ['히', 'hi_suffix'],
]);

/**
 * True when the right-hand Hangul unit is a soft formal ending and the pair
 * is inside the same eojeol (no intervening literal whitespace/punctuation).
 */
export function isSoftFormalPair(a, b) {
  if (!a || !b || a.type !== 'hangul' || b.type !== 'hangul') return false;
  if (!a.coda) return false;
  if (!SOFT_FORMAL_ENDINGS.has(b.char)) return false;
  // Same-eojeol only: caller must ensure no literal unit between a and b.
  return true;
}

/**
 * Apply soft formal paths in place of unresolved morphology guards.
 * Mutates units (surface) and ruleSets traces.
 * Returns true if any soft application occurred.
 *
 * Call this from applyContextualRules when morphologyMode === 'soft',
 * in the branches that currently set:
 *   __palatalizationUnlicensed
 *   __hDeletionUnlicensed
 *   __complexLiaisonUnlicensed
 *   __substantiveLiaisonUnlicensed  (soft never resolves substantive)
 *
 * Soft NEVER clears __substantiveLiaisonUnlicensed by choosing §15.
 * Soft NEVER fires across whitespace (phrase pass stays exact-only).
 */
export function trySoftFormal(
  a,
  b,
  rules,
  nextRules,
  {
    COMPLEX,
    FINAL_REPRESENTATIVE,
  }
) {
  if (!isSoftFormalPair(a, b)) return false;

  const ending = b.char;
  const pattern = SOFT_FORMAL_ENDINGS.get(ending);
  let applied = false;

  // R007: ㄷ/ㅌ/ㄾ + 이 → palatalization (formal)
  if (['ㄷ', 'ㅌ', 'ㄾ'].includes(a.coda) && ending === '이' && b.onset === 'ㅇ') {
    if (a.coda === 'ㄾ') {
      a.coda = 'ㄹ';
      b.onset = 'ㅊ';
    } else if (a.coda === 'ㄷ') {
      a.coda = '';
      b.onset = 'ㅈ';
    } else {
      a.coda = '';
      b.onset = 'ㅊ';
    }
    b.__liaison = true;
    delete a.__palatalizationUnlicensed;
    delete b.__palatalizationUnlicensed;
    rules.push('soft-heuristic-morphology');
    rules.push('palatalization-§17-soft-formal');
    nextRules.push('soft-heuristic-morphology');
    nextRules.push('palatalization-§17-soft-formal');
    a.__softHeuristic = true;
    b.__softHeuristic = true;
    return true;
  }

  // R007: ㄷ + 히 (after aspiration intermediate would create ㅌ+ㅣ)
  // Soft only when written pair is still ㄷ + 히 (pre-aspiration path).
  if (a.coda === 'ㄷ' && ending === '히') {
    // Leave segmental change to the existing h-aspiration + palatalization
    // chain if the engine reaches it; mark soft so status can be downgraded.
    a.__softHeuristic = true;
    b.__softHeuristic = true;
    rules.push('soft-heuristic-morphology');
    nextRules.push('soft-heuristic-morphology');
    // Do not return true yet — allow normal ㅎ-aspiration path to run.
    // The soft mark is enough for status.
  }

  // R003: ㅎ/ㄶ/ㅀ deletion before vowel-initial formal ending
  if (['ㅎ', 'ㄶ', 'ㅀ'].includes(a.coda) && b.onset === 'ㅇ') {
    if (a.coda === 'ㅎ') a.coda = '';
    else if (a.coda === 'ㄶ') a.coda = 'ㄴ';
    else a.coda = 'ㄹ';
    delete a.__hDeletionUnlicensed;
    delete b.__hDeletionUnlicensed;
    rules.push('soft-heuristic-morphology');
    rules.push('h-deletion-§12(4)-soft-formal');
    nextRules.push('soft-heuristic-morphology');
    nextRules.push('h-deletion-§12(4)-soft-formal');
    a.__softHeuristic = true;
    b.__softHeuristic = true;
    applied = true;
  }

  // R002 formal liaison: complex coda → retain first, move second (§§13–14)
  // Never apply §15 substantive neutralization via soft.
  if (b.onset === 'ㅇ' && a.coda && !['ㅎ', 'ㄶ', 'ㅀ'].includes(a.coda)) {
    const pair = COMPLEX[a.coda];
    if (pair) {
      a.coda = pair[0];
      if (pair[1]) {
        b.onset = pair[1];
        b.__liaison = true;
      }
      delete a.__complexLiaisonUnlicensed;
      delete b.__complexLiaisonUnlicensed;
      rules.push('soft-heuristic-morphology');
      rules.push('complex-coda-liaison-§13-14-soft-formal');
      nextRules.push('soft-heuristic-morphology');
      nextRules.push('complex-coda-liaison-§13-14-soft-formal');
      a.__softHeuristic = true;
      b.__softHeuristic = true;
      applied = true;
    } else if (a.coda !== 'ㅇ') {
      // Simple coda formal liaison (§13): transfer written coda.
      // Soft does NOT neutralize to representative (§15).
      // If representative differs and vowel is ㅏ/ㅓ/ㅗ/ㅜ/ㅟ, strict mode
      // would withhold; soft formal path transfers the written coda only
      // when the ending is in the formal inventory (already checked).
      const rep = FINAL_REPRESENTATIVE[a.coda] ?? a.coda;
      const substantiveRisk =
        rep !== a.coda && ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅟ'].includes(b.vowel);
      if (substantiveRisk) {
        // Still prefer formal transfer for soft formal endings, but mark it.
        b.onset = a.coda;
        b.__liaison = true;
        a.coda = '';
        delete a.__substantiveLiaisonUnlicensed;
        delete b.__substantiveLiaisonUnlicensed;
        rules.push('soft-heuristic-morphology');
        rules.push('simple-coda-liaison-§13-soft-formal');
        nextRules.push('soft-heuristic-morphology');
        nextRules.push('simple-coda-liaison-§13-soft-formal');
        a.__softHeuristic = true;
        b.__softHeuristic = true;
        applied = true;
      } else if (!pair) {
        b.onset = a.coda;
        b.__liaison = true;
        a.coda = '';
        rules.push('soft-heuristic-morphology');
        rules.push('liaison-soft-formal');
        nextRules.push('soft-heuristic-morphology');
        a.__softHeuristic = true;
        b.__softHeuristic = true;
        applied = true;
      }
    }
  }

  return applied;
}

/**
 * Status label for UI / trace when soft fired on a unit.
 */
export function softStatusForUnit(unit, fallback = 'contextual') {
  if (unit && unit.__softHeuristic) return 'heuristic-low-confidence';
  return fallback;
}
