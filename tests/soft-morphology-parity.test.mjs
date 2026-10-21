import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { COMPLEX, FINAL_REPRESENTATIVE, compose, decompose } from '../src/app/engine_shared.js';
import { trySoftFormal } from '../src/app/soft_morphology.js';

const fixture = JSON.parse(readFileSync(resolve('tests/fixtures/soft-morphology-parity.json'), 'utf8'));

function runSoftPair(input) {
  const units = [...input].map((char) => {
    const syllable = decompose(char);
    return syllable ? { type: 'hangul', ...syllable } : { type: 'literal', char };
  });
  const rules = units.map(() => []);
  let applied = false;
  for (let i = 0; i < units.length - 1; i += 1) {
    if (units[i].type !== 'hangul' || units[i + 1].type !== 'hangul') continue;
    if (trySoftFormal(units[i], units[i + 1], rules[i], rules[i + 1], {
      COMPLEX, FINAL_REPRESENTATIVE
    })) applied = true;
  }
  const surface = units.map((unit) => unit.type === 'hangul'
    ? compose(unit.onset, unit.vowel, unit.coda || '')
    : unit.char).join('');
  return { units, rules, applied, surface };
}

describe('shared Python/browser soft-morphology parity contract', () => {
  it('keeps the fixture explicit that heuristic cases are not normative gold', () => {
    assert.match(fixture.description, /do not assert that heuristic outputs are normative gold/u);
  });

  for (const item of fixture.cases) {
    it(`matches soft-rule eligibility for ${item.input}`, () => {
      const result = runSoftPair(item.input);
      assert.equal(result.applied, item.expectedSoftTrace, item.input);
      if (item.expectedSurface !== null) {
        assert.equal(result.surface, item.expectedSurface, item.input);
      }
      if (item.expectedSoftTrace) {
        assert.ok(result.units.some((unit) => unit.__softHeuristic), item.input);
        const traceText = result.rules.flat().join(' ');
        for (const family of item.expectedSoftRuleFamily) {
          const familyRule = family === 'R002'
            ? /complex-coda-liaison-§13-14-soft-formal|liaison-soft-formal/u
            : family === 'R003'
              ? /h-deletion-§12\(4\)-soft-formal/u
              : /palatalization-§17-soft-formal/u;
          assert.match(traceText, familyRule, item.input + ': missing ' + family);
        }
      }
    });
  }
});
