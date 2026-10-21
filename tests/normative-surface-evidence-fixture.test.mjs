import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const fixture = JSON.parse(readFileSync(resolve('tests/fixtures/g2pk-surface-regression.json'), 'utf8'));
const byInput = new Map(fixture.cases.map((item) => [item.input, item]));

test('surface fixture separates JS-port regression values from normative evidence', () => {
  assert.equal(fixture.cases.length, 18);
  assert.match(fixture.description, /must never replace port output with normativeSurface/u);
  for (const item of fixture.cases) {
    assert.ok(item.expectedSurface, item.input + ': missing pinned-port expected surface');
    assert.ok(item.normativeSurface, item.input + ': missing normative comparator');
    assert.ok(item.normativeEvidenceStatus, item.input + ': missing evidence status');
    assert.ok(item.normativeSourceLocator, item.input + ': missing rule/article locator');
    assert.match(item.normativeSourceUrl, /^https:\/\//u, item.input + ': missing source URL');
    assert.equal(item.ipaGoldStatus, 'not_independently_adjudicated', item.input);
    if (item.normativeEvidenceStatus.startsWith('derived')) {
      assert.match(item.normativeNotes, /not independently adjudicated/u, item.input);
    }
  }
});

test('known normative divergences stay explicit and never rewrite the port fixture', () => {
  assert.equal(byInput.get('값어치').expectedSurface, '갑써치');
  assert.equal(byInput.get('값어치').normativeSurface, '가버치');
  assert.equal(byInput.get('넓죽하다').expectedSurface, '널쭈카다');
  assert.equal(byInput.get('넓죽하다').normativeSurface, '넙쭈카다');
  assert.equal(byInput.get('읽고').expectedSurface, '익꼬');
  assert.equal(byInput.get('읽고').normativeSurface, '일꼬');
});
