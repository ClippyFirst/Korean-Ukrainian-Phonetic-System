import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { createEngine } from '../src/app/engine.js';

const fixture = JSON.parse(readFileSync(resolve('tests/fixtures/soft-morphology-parity.json'), 'utf8'));
const canonical = readFileSync(resolve('data/korean/canonical_correspondence.csv'), 'utf8');
const lexical = readFileSync(resolve('data/korean/lexical_pronunciations.csv'), 'utf8');
const engine = createEngine(canonical, lexical);

function softTrace(result) {
  return result.trace.filter((trace) => (trace.rules || []).includes('soft-heuristic-morphology'));
}

describe('shared Python/browser soft-morphology parity contract', () => {
  it('keeps the fixture explicit that heuristic cases are not normative gold', () => {
    assert.match(fixture.description, /do not assert that heuristic outputs are normative gold/u);
  });

  for (const item of fixture.cases) {
    it(`matches soft-rule eligibility for ${item.input}`, () => {
      const result = engine.convert(item.input, { morphologyMode: 'soft' });
      const applied = softTrace(result);
      assert.equal(applied.length > 0, item.expectedSoftTrace, item.input);
      if (item.expectedSurface !== null) {
        assert.equal(result.surfaceHangul, item.expectedSurface, item.input);
      }
      if (item.expectedSoftTrace) {
        assert.ok(applied.every((trace) => trace.status === 'heuristic-low-confidence'), item.input);
        const traceText = applied.flatMap((trace) => trace.rules || []).join(' ');
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
