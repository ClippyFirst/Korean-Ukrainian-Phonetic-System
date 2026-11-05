import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';
import { createG2pWebAdapter } from '../src/app/g2pk_web.js';
import { G2pBrowser } from '../src/vendor/g2pk/g2p-browser.ts';

const root = new URL('../', import.meta.url);
const canonical = readFileSync(new URL('data/korean/canonical_correspondence.csv', root), 'utf8');
const lexical = readFileSync(new URL('data/korean/lexical_pronunciations.csv', root), 'utf8');
const sourceRegister = parseCsv(readFileSync(new URL('research/SOURCE-REGISTER.csv', root), 'utf8'));
const engine = createEngine(canonical, lexical);
const adapter = createG2pWebAdapter(engine);
const rawPort = new G2pBrowser();
const options = { descriptive: false, verbose: false, groupVowels: false, toSyl: true };

const sourceBackedCases = ['값어치', '넓죽하다', '넓둥글다', '넓적하다', '읽고', '싫어서', '수많은'];

test('ordinary g2pK preserves raw port surfaces and never applies Kozak Kim NIKL overlays', () => {
  for (const input of sourceBackedCases) {
    const rawSurface = rawPort.convert(input, options);
    const result = adapter.convert(input);
    assert.equal(result.surfaceHangul || input, rawSurface, input + ': preserve raw g2pK surface');
    assert.equal(result.normativeCorrections, undefined, input + ': no NIKL correction metadata');
    assert.doesNotMatch(result.analysis, /NIKL|normative correction|lexical vowel length/iu, input);
    assert.ok(result.ipa, input + ': IPA must still be derived from the raw surface');
  }
});

test('the same NIKL-backed exception is available in Kozak Kim but not in raw g2pK', () => {
  const kozak = engine.convert('읽고', { morphologyMode: 'strict' });
  const raw = rawPort.convert('읽고', options);
  const practical = adapter.convert('읽고');

  assert.equal(kozak.surfaceHangul, '일꼬');
  assert.notEqual(raw, '일꼬');
  assert.equal(practical.surfaceHangul || '읽고', raw);
});

test('official NIKL evidence remains registered for the Kozak Kim rule inventory', () => {
  const byId = new Map(sourceRegister.map(row => [row.source_id, row]));
  for (const id of [
    'SRC-NIKL-MCFAQ-5949', 'SRC-NIKL-QNA-307508', 'SRC-NIKL-QNA-322805',
    'SRC-NIKL-QNA-315279', 'SRC-NIKL-QNA-307219', 'SRC-NIKL-QNA-329463',
    'SRC-NIKL-QNA-306166', 'SRC-NIKL-QNA-313981', 'SRC-NIKL-KRDICT-71144'
  ]) {
    assert.ok(byId.has(id), id + ': evidence source must be registered');
    assert.match(byId.get(id).url, /korean\.go\.kr/u);
    assert.match(byId.get(id).license_status, /KOGL|reuse|marking|not checked/i,
      id + ': source-rights uncertainty must remain explicit');
  }
  const readgo = parseCsv(lexical).find(row => row.input === '읽고');
  assert.ok(readgo);
  assert.match(readgo.source_url, /qna_seq=329463/u);
  assert.match(readgo.rule_notes, /directly attests 읽고\[일꼬\]/u);
});
