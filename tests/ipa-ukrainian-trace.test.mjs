import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';
import { ipaSyllableToUkrainian, traceIpaMapping } from '../src/app/engine_ipa.js';

const canonicalCsv = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalCsv = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');

test('IPA trace exposes exact longest-match token to Ukrainian grapheme mappings', () => {
  assert.deepEqual(traceIpaMapping('dʑi'), {
    tokens: [
      { ipa: 'dʑ', ukrainian: 'дж' },
      { ipa: 'i', ukrainian: 'і' }
    ],
    unknown: ''
  });
  assert.deepEqual(traceIpaMapping('ɕi'), {
    tokens: [
      { ipa: 'ɕ', ukrainian: 'ш' },
      { ipa: 'i', ukrainian: 'і' }
    ],
    unknown: ''
  });
});

test('IPA target output is composed from the same tokens displayed in the trace', () => {
  for (const sample of ['dʑi', 'ɕi', 'k͈a', 'tɕʰu', 'ɡʌ']) {
    const mapping = traceIpaMapping(sample);
    assert.equal(mapping.unknown, '', sample);
    assert.equal(
      ipaSyllableToUkrainian(sample).text,
      mapping.tokens.map(token => token.ukrainian).join(''),
      sample
    );
  }
});

test('every resolved Korean syllable trace retains its realized surface, IPA and Ukrainian result', () => {
  const engine = createEngine(canonicalCsv, lexicalCsv);
  const result = engine.convert('시', { morphologyMode: 'strict' });
  assert.equal(result.trace.length, 1);
  assert.equal(result.trace[0].source, '시');
  assert.equal(result.trace[0].surface, '시');
  assert.equal(result.trace[0].ipa, 'ɕi');
  assert.equal(result.trace[0].output, 'ші');
  assert.equal(
    ipaSyllableToUkrainian(result.trace[0].ipa).text,
    result.trace[0].output
  );
});

test('service markup exposes all explanatory trace stages', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  for (const heading of ['Корейський сегмент · вхід', 'Корейська вимова', 'IPA', 'IPA-токен → графема', 'Український запис', 'Нюанс / правило', 'Статус']) {
    assert.ok(html.includes(heading), 'missing trace heading: ' + heading);
  }
  assert.ok(app.includes('traceIpaMapping'));
  assert.ok(app.includes('t.surface||t.source'));
});
