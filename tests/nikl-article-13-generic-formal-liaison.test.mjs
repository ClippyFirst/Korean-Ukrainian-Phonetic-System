import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = new Map(parseCsv(lexical).map(row => [row.input, row]));
const genericEngine = createEngine(canonical, '');

test('§13: unambiguous single-coda liaison works without lexical overrides', () => {
  const cases = [
    ['책을', 'tɕʰɛ ɡɯl', 'чеґил'],
    ['옷이', 'o ɕi', 'оші'],
    ['밭을', 'pa tʰɯl', 'патил'],
  ];

  for (const [input, ipa, ukrainian] of cases) {
    const result = genericEngine.convert(input);
    assert.equal(result.ipa, ipa, input + ': IPA must reflect the resyllabified onset');
    assert.equal(result.ukrainian, ukrainian, input + ': Ukrainian output must be rendered from IPA');
    assert.deepEqual(result.issues, [], input + ': simple-coda liaison should not need lexical morphology');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no placeholder for a regular §13 pattern');
    assert.ok(result.trace.some(item => item.rules.includes('liaison')), input + ': liaison rule must be traceable');
  }
});

test('§§13–15: complex-coda liaison stays unresolved without morphological evidence', () => {
  const result = genericEngine.convert('읽어');
  assert.equal(result.status, 'unresolved');
  assert.ok(result.issues.some(issue => /complex-coda liaison differs between formal and substantive morphemes/u.test(issue)));
  assert.ok(result.trace.some(item => item.rules.includes('complex-coda-liaison-requires-morphology')));
  assert.ok(result.issues.length > 0, 'the missing morphological license must be surfaced to the caller');
  assert.ok(!result.trace.every(item => item.status === 'canonical'), 'the trace must not label a guessed reading as canonical');
});

test('§13 formal endings and §15 substantive morphemes remain distinct in evidence notes', () => {
  for (const input of ['같아', '같았던']) {
    const row = rows.get(input);
    assert.ok(row, input + ': missing reviewed evidence row');
    assert.match(row.rule_notes, /§13/u, input + ': vowel-initial formal ending must map to §13');
    assert.doesNotMatch(row.rule_notes, /§15/u, input + ': must not be misclassified as substantive-morpheme liaison');
  }
  const phrase = rows.get('밭 아래');
  assert.ok(phrase, 'missing official §15 phrase example');
  assert.match(phrase.rule_notes, /§15/u, 'substantive-morpheme example must retain §15');
});
