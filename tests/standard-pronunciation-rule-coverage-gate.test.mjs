import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const matrix = JSON.parse(readFileSync(new URL('./fixtures/standard-pronunciation-rule-coverage.json', import.meta.url), 'utf8'));

/**
 * Release gate: every numbered article in the official Standard Pronunciation
 * Rules must have independently reviewed, source-backed regression cases.
 *
 * This is deliberately fail-closed. A corpus being large or crash-free is not
 * evidence that it covers the normative rule inventory. Do not weaken this
 * test by changing missing/unverified rows to "covered" without case IDs,
 * source references, and verified expected surface forms.
 */
test('all official Standard Pronunciation Rules articles are represented', () => {
  assert.deepEqual(matrix.articles.map(x => x.article), Array.from({length: 30}, (_, i) => i + 1));
});

test('every article has source-backed cases and is independently reviewed', () => {
  const blockers = matrix.articles.filter(x =>
    x.status !== 'verified' ||
    !x.source ||
    !Array.isArray(x.caseIds) ||
    x.caseIds.length < matrix.minimumCasesPerArticle
  ).map(x => `§${x.article}: status=${x.status}; source=${Boolean(x.source)}; cases=${x.caseIds?.length ?? 0}`);

  assert.deepEqual(blockers, [], 'release blocked: incomplete normative coverage:\n' + blockers.join('\n'));
});

test('every listed case ID is unique across the rule matrix', () => {
  const ids = matrix.articles.flatMap(x => x.caseIds ?? []);
  assert.equal(new Set(ids).size, ids.length, 'a regression case must have one canonical ID; use explicit multi-rule tags instead of duplicate IDs');
});
