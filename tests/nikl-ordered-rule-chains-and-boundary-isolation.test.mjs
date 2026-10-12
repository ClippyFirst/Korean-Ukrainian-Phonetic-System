import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = new Map(parseCsv(lexical).map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);

function rulesFor(result, source) {
  return result.trace.filter((item) => item.source === source).flatMap((item) => item.rules || []);
}

test('ordered-rule chains remain visible in surface-only source controls', () => {
  const cases = [
    { input: '독립문', surface: '동님문', ipa: 'toŋ nim mun',
      requiredRules: ['liquid-to-nasal-before-obstruent', 'nasal-assimilation'] },
    { input: '밟는', surface: '밤는', ipa: 'paːm nɯn',
      requiredRules: ['lexical-coda-balm', 'nasal-assimilation'] },
    { input: '앞문', surface: '암문', ipa: 'am mun',
      requiredRules: ['nasal-assimilation'] },
    { input: '신라', surface: '실라', ipa: 'ɕil la',
      requiredRules: ['liquid-assimilation'] },
  ];

  for (const item of cases) {
    const row = rows.get(item.input);
    assert.ok(row, item.input + ': expected sourced control record');
    assert.equal(row.target_status, 'surface-only', item.input + ': algorithmic trace must remain active');
    const result = engine.convert(item.input);
    assert.equal(result.surfaceHangul, item.surface, item.input + ': official surface');
    assert.equal(result.ipa, item.ipa, item.input + ': standard IPA');
    assert.equal(result.issues.length, 0, item.input + ': no unresolved issues');
    const allRules = result.trace.flatMap((entry) => entry.rules || []);
    for (const rule of item.requiredRules) {
      assert.ok(allRules.includes(rule), item.input + ': missing rule trace ' + rule);
    }
    assert.ok(result.trace.every((entry) => entry.status !== 'unresolved'),
      item.input + ': no unresolved syllables');
  }
});

test('contextual rules never assimilate across punctuation', () => {
  const comma = engine.convert('국,물');
  assert.equal(comma.issues.length, 0);
  assert.equal(comma.ipa, 'kuk̚,mul');
  assert.ok(!comma.trace.flatMap((entry) => entry.rules || []).includes('nasal-assimilation'));

  const fullStop = engine.convert('국.물');
  assert.equal(fullStop.issues.length, 0);
  assert.equal(fullStop.ipa, 'kuk̚.mul');
  assert.ok(!fullStop.trace.flatMap((entry) => entry.rules || []).includes('nasal-assimilation'));
});

test('source records used for rule-order controls remain linked to the official standard', () => {
  for (const input of ['독립문', '밟는', '앞문', '신라']) {
    const row = rows.get(input);
    assert.match(row.source_url, /^https:\/\/(www\.|m\.)?korean\.go\.kr\//u);
    assert.match(row.rule_notes, /§|제\d+항/u);
  }
});
