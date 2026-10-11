import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const matrix = JSON.parse(readFileSync(new URL('./fixtures/standard-pronunciation-rule-coverage.json', import.meta.url), 'utf8'));

// This file validates the audit ledger only. Incomplete inventory is reported,
// not treated as a generic release blocker. Actual pronunciation regressions
// must fail through executable input -> expected surface-form assertions.
test('coverage ledger inventories all 30 numbered articles', () => {
  assert.deepEqual(matrix.articles.map(x => x.article), Array.from({ length: 30 }, (_, i) => i + 1));
});

test('coverage ledger uses explicit, reviewable statuses', () => {
  const allowed = new Set(['unverified', 'in-progress', 'verified', 'not-applicable']);
  for (const article of matrix.articles) {
    assert.ok(allowed.has(article.status), `§${article.article}: unknown status ${article.status}`);
    if (article.status === 'verified') {
      assert.ok(article.source, `§${article.article}: verified article needs a source`);
      assert.ok(article.caseIds.length > 0, `§${article.article}: verified article needs executable regression case IDs`);
    }
  }
});

test('case IDs in the coverage ledger are unique', () => {
  const ids = matrix.articles.flatMap(x => x.caseIds ?? []);
  assert.equal(new Set(ids).size, ids.length, 'give each executable regression one canonical ID');
});
