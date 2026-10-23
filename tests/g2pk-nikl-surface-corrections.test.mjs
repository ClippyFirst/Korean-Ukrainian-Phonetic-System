import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';
import { createG2pWebAdapter } from '../src/app/g2pk_web.js';
import { traceIpaMapping } from '../src/app/engine_ipa.js';

const root = new URL('../', import.meta.url);
const canonical = readFileSync(new URL('data/korean/canonical_correspondence.csv', root), 'utf8');
const lexical = readFileSync(new URL('data/korean/lexical_pronunciations.csv', root), 'utf8');
const adapter = createG2pWebAdapter(createEngine(canonical, lexical));

const cases = [
  {
    input: '값어치',
    surface: '가버치',
    source: '값어치',
    evidence: /mcfaq_seq=5949/u
  },
  {
    input: '넓죽하다',
    surface: '넙쭈카다',
    source: '넓죽하다',
    evidence: /NIKL §§10, 23/u
  },
  {
    input: '넓둥글다',
    surface: '넙뚱글다',
    source: '넓둥글다',
    evidence: /NIKL §10 exception/u
  },
  {
    input: '넓적하다',
    surface: '넙쩌카다',
    source: '넓적하다',
    evidence: /qna_seq=322805/u
  },
  {
    input: '읽고',
    surface: '일꼬',
    source: '읽고',
    evidence: /qna_seq=315279/u
  }
];

test('exact NIKL-attested surface divergences are corrected before IPA adaptation', () => {
  for (const item of cases) {
    const result = adapter.convert(item.input);
    assert.equal(result.surfaceHangul, item.surface, item.input + ': normative Korean surface');
    assert.equal(result.normativeCorrections.length, 1, item.input + ': explicit correction trace');
    assert.equal(result.normativeCorrections[0].source, item.source);
    assert.equal(result.normativeCorrections[0].surface, item.surface);
    assert.match(result.normativeCorrections[0].evidence, item.evidence);
    assert.match(result.analysis, /correction before IPA/u);
    assert.ok(result.ipa, item.input + ': IPA must be emitted from the corrected surface');
    assert.equal(result.issues.length, 0, item.input + ': corrected surface must remain IPA-mappable');
    const mapped = traceIpaMapping(result.ipa);
    assert.equal(mapped.unknown, '', item.input + ': all IPA segments must map');
    assert.equal(result.ukrainian, mapped.tokens.map(token => token.ukrainian).join(''),
      item.input + ': Ukrainian output must be derived from IPA');
  }
});

test('source-backed exceptions are exact-form allowlist entries, not generalized grapheme rules', () => {
  for (const input of ['넓다', '읽는', '같이']) {
    const result = adapter.convert(input);
    assert.deepEqual(result.normativeCorrections, [], input + ': no unsupported correction');
  }
});

test('a correction preserves source offsets and punctuation in running text', () => {
  const result = adapter.convert('읽고, 넓죽하다!');
  assert.equal(result.surfaceHangul, '일꼬, 넙쭈카다!');
  assert.deepEqual(result.normativeCorrections.map(item => item.source), ['읽고', '넓죽하다']);
  assert.equal(result.issues.length, 0);
  const mapped = traceIpaMapping(result.ipa);
  assert.equal(mapped.unknown, '');
  assert.equal(result.ukrainian, mapped.tokens.map(token => token.ukrainian).join(''));
});
