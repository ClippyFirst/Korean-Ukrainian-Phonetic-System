import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';
import { createG2pWebAdapter } from '../src/app/g2pk_web.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const adapter = createG2pWebAdapter(createEngine(canonical, ''));

test('retains the NIKL-attested long vowel in the exact dictionary form 수많은', () => {
  const result = adapter.convert('수많은');

  assert.equal(result.surfaceHangul, '수마는');
  assert.match(result.ipa, /(?:^|\s)suː(?:\s|$)/u);
  assert.equal(result.trace[0].ipa, 'suː');
  assert.match(result.analysis, /word 71144/u);
  // Length is represented at the IPA boundary; the Ukrainian target remains
  // generated from the segment mapping and is not assigned an invented mark.
  assert.ok(result.ukrainian);
  assert.ok(!result.issues.length);
});

test('exposes the second NIKL-accepted pronunciation of 멋있어 without calling its IPA gold', () => {
  const result = adapter.convert('멋있어');
  const primarySurface = result.surfaceHangul || '멋있어';

  assert.ok(['머디써', '머시써'].includes(primarySurface), 'primary output must match an attested NIKL surface');
  const expectedAlternative = primarySurface === '머디써' ? '머시써' : '머디써';
  const alternative = result.variants.find(variant => variant.surface === expectedAlternative);

  assert.ok(alternative, 'the other NIKL-accepted surface should be offered as a variant');
  assert.match(alternative.note, /qna_seq=306166/u);
  assert.equal(alternative.sourceLocator, 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=306166');
  assert.match(alternative.note, /потребують окремої перевірки/u);
  assert.equal(alternative.status, 'lexical-review');
  assert.ok(alternative.ipa);
  assert.ok(alternative.ukrainian);
  assert.ok(!alternative.ipa.includes('⟦'));
});

test('does not generalize the exact-form 수많은 lexical-length overlay to a larger phrase', () => {
  const result = adapter.convert('수많은 사람');

  assert.ok(!result.ipa.includes('suː'), 'phrase context is not covered by the exact-form lexical length record');
});
