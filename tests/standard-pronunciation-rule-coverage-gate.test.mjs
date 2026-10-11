import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const matrix = JSON.parse(readFileSync(new URL('./fixtures/standard-pronunciation-rule-coverage.json', import.meta.url), 'utf8'));
const officialSource = 'https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002';

test('coverage ledger inventories all 30 numbered articles in order', () => {
  assert.deepEqual(matrix.articles.map(x => x.article), Array.from({ length: 30 }, (_, i) => i + 1));
});

test('each article has an official source and resolvable executable or audit evidence', () => {
  for (const article of matrix.articles) {
    assert.equal(article.source, officialSource, `§${article.article}: link the primary NIKL standard`);
    assert.ok(Array.isArray(article.caseIds) && article.caseIds.length > 0, `§${article.article}: evidence mapping is required`);
    for (const id of article.caseIds) {
      const separator = id.indexOf(':');
      assert.ok(separator > 0, `§${article.article}: malformed evidence ID ${id}`);
      const relativePath = id.slice(separator + 1);
      const absolutePath = fileURLToPath(new URL('../' + relativePath, import.meta.url));
      assert.ok(existsSync(absolutePath), `§${article.article}: missing evidence file ${relativePath}`);
    }
  }
});

test('coverage ledger uses explicit, reviewable statuses', () => {
  const allowed = new Set(['unverified', 'in-progress', 'verified', 'not-applicable']);
  for (const article of matrix.articles) {
    assert.ok(allowed.has(article.status), `§${article.article}: unknown status ${article.status}`);
    if (article.status === 'verified') {
      assert.ok(article.source, `§${article.article}: verified article needs a source`);
      assert.ok(article.caseIds.length > 0, `§${article.article}: verified article needs executable regression case IDs`);
      assert.match(article.notes, /finite normative-example coverage only/u, `§${article.article}: state the scope of verification`);
    }
    if (article.status === 'not-applicable') {
      assert.match(article.notes, /not a standalone phonological rewrite/u, `§${article.article}: explain why it is not applicable to runtime rules`);
    }
  }
});

test('case IDs in the coverage ledger are unique', () => {
  const ids = matrix.articles.flatMap(x => x.caseIds ?? []);
  assert.equal(new Set(ids).size, ids.length, 'give each evidence reference one canonical ID');
});

test('no numbered article is left silently unverified in the current finite-example audit', () => {
  const unresolved = matrix.articles.filter(x => x.status === 'unverified' || x.status === 'in-progress');
  assert.deepEqual(unresolved.map(x => x.article), []);
  assert.equal(matrix.articles.filter(x => x.status === 'verified').length, 29);
  assert.equal(matrix.articles.filter(x => x.status === 'not-applicable').length, 1);
});
