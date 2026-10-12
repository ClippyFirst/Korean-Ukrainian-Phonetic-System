import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(resolve('data/korean/canonical_correspondence.csv'), 'utf8');
const lexical = readFileSync(resolve('data/korean/lexical_pronunciations.csv'), 'utf8');
const engine = createEngine(canonical, lexical);
const STRICT = { morphologyMode: 'strict' };
const SOFT = { morphologyMode: 'soft' };

function softTrace(result) {
  return result.trace.filter(t => (t.rules || []).includes('soft-heuristic-morphology'));
}

describe('soft-heuristic morphology — integrated browser engine', () => {
  it('strict remains the default and matches explicit strict mode', () => {
    for (const text of ['굳이', '값어치', '숲이', '넋이', '읽고', '값 이']) {
      assert.deepEqual(engine.convert(text), engine.convert(text, STRICT), text);
    }
  });

  it('soft mode really fires on an unlisted same-eojeol formal candidate', () => {
    // 숲이 is deliberately absent from the exact lexical CSV: this checks the
    // opt-in heuristic path rather than a lexical shortcut such as 굳이.
    const result = engine.convert('숲이', SOFT);
    const applied = softTrace(result);
    assert.ok(applied.length > 0, 'expected at least one soft trace for 숲이');
    assert.ok(applied.every(t => t.status === 'heuristic-low-confidence'));
    assert.equal(result.status, 'heuristic-low-confidence');
  });

  it('does not create a soft license across whitespace', () => {
    const result = engine.convert('숲 이', SOFT);
    assert.equal(softTrace(result).length, 0);
  });

  it('fails closed on an adversarial complex-coda + 어 sequence', () => {
    // 값어 is intentionally adversarial, not an asserted standard lexical item.
    // It guards against accidentally treating every adjacent vowel as §13 liaison.
    const result = engine.convert('값어', SOFT);
    assert.equal(softTrace(result).length, 0);
  });

  it('does not guess §15-sensitive substantive liaison from 값어치', () => {
    const result = engine.convert('값어치', SOFT);
    assert.equal(softTrace(result).length, 0);
  });

  it('never uses the soft layer for ㄺ-before-ㄱ exception handling', () => {
    const result = engine.convert('읽고', SOFT);
    assert.equal(softTrace(result).length, 0);
  });

  it('keeps exact-lexical readings authoritative in both modes', () => {
    const strict = engine.convert('넋이', STRICT);
    const soft = engine.convert('넋이', SOFT);
    assert.equal(strict.ukrainian, soft.ukrainian);
    assert.equal(strict.ipa, soft.ipa);
    assert.equal(softTrace(soft).length, 0);
  });
});
