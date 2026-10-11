import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const entries = new Map(parseCsv(lexical).map(row => [row.input, row]));

// These are direct reproductions of unresolved forms reported in the
// adversarial corpus. The Korean surface form is kept separate from the
// provisional Ukrainian rendering so a target-policy review cannot silently
// change the Korean phonology.
const regressions = [
  ['값의', '갑씨'],
  ['얇은', '얄븐'],
  ['굵은', '굴근'],
  ['젊음', '절믐'],
  ['곬으로', '골쓰로'],
  ['좋아도', '조아도'],
  ['맑을', '말글'],
];

test('reported complex-coda and ㅎ-deletion cases have explicit lexical evidence', () => {
  for (const [input, surface] of regressions) {
    const row = entries.get(input);
    assert.ok(row, `${input}: missing source-linked lexical row`);
    assert.equal(row.surface_hangul, surface, `${input}: declared standard surface form`);
    assert.ok(row.source_url, `${input}: missing source URL`);
    assert.ok(row.rule_notes, `${input}: missing rule rationale`);
  }
});

test('reported cases resolve to their declared Korean surface form without placeholders', () => {
  for (const [input, surface] of regressions) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, `${input}: surface pronunciation`);
    assert.ok(!result.ukrainian.includes('⟦'), `${input}: unresolved placeholder in ${result.ukrainian}`);
    assert.ok(!result.ukrainian.includes('⟧'), `${input}: unresolved placeholder in ${result.ukrainian}`);
    assert.deepEqual(result.issues, [], `${input}: unresolved pronunciation issue`);
  }
});
