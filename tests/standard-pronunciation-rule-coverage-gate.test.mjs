import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const matrix = JSON.parse(readFileSync(new URL('./fixtures/standard-pronunciation-rule-coverage.json', import.meta.url), 'utf8'));
const officialSource = 'https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002';

function articleNumbersInTitle(title) {
  const found = new Set();
  for (const match of title.matchAll(/§{1,2}\s*(\d+)(?:\s*[–-]\s*§{0,2}\s*(\d+))?/gu)) {
    const first = Number(match[1]);
    const last = Number(match[2] || match[1]);
    for (let n = first; n <= last; n++) found.add(n);
  }
  // Grouped test names sometimes spell out "article 24–30" rather than use §.
  for (const match of title.matchAll(/articles?\s+(\d+)\s*[–-]\s*(\d+)/giu)) {
    for (let n = Number(match[1]); n <= Number(match[2]); n++) found.add(n);
  }
  return found;
}

function declaredTestTitles(content) {
  return [...content.matchAll(/test\(\s*(['"])(.*?)\1\s*,/gs)].map(match => match[2]);
}

test('coverage ledger inventories all 30 numbered articles in order', () => {
  assert.deepEqual(matrix.articles.map(x => x.article), Array.from({ length: 30 }, (_, i) => i + 1));
});

test('every evidence reference resolves to an exact, article-relevant test or audit anchor', () => {
  for (const article of matrix.articles) {
    assert.equal(article.source, officialSource, `§${article.article}: link the primary NIKL standard`);
    assert.ok(Array.isArray(article.caseIds) && article.caseIds.length > 0, `§${article.article}: evidence mapping is required`);
    for (const id of article.caseIds) {
      const separator = id.indexOf(':');
      const anchorSeparator = id.indexOf('#', separator + 1);
      assert.ok(separator > 0 && anchorSeparator > separator + 1, `§${article.article}: evidence must use ID:path#exact-title-or-anchor: ${id}`);
      assert.equal(Number(id.slice(1, 3)), article.article, `§${article.article}: evidence ID article number mismatch`);
      const relativePath = id.slice(separator + 1, anchorSeparator);
      const anchor = id.slice(anchorSeparator + 1);
      const absolutePath = fileURLToPath(new URL('../' + relativePath, import.meta.url));
      assert.ok(existsSync(absolutePath), `§${article.article}: missing evidence file ${relativePath}`);
      const content = readFileSync(absolutePath, 'utf8');
      if (relativePath.endsWith('.mjs')) {
        const titles = declaredTestTitles(content);
        assert.ok(titles.includes(anchor), `§${article.article}: exact test title not found in ${relativePath}: ${anchor}`);
        assert.ok(articleNumbersInTitle(anchor).has(article.article), `§${article.article}: test title must explicitly name this article or a containing range: ${anchor}`);
      } else {
        assert.equal(article.article, 1, `§${article.article}: audit-only evidence is reserved for the governing Article 1`);
        assert.equal(anchor, 'article-1', 'Article 1 must use the canonical audit anchor');
        assert.match(content, /^\| §1 \|/mu, 'Article 1 must exist in the article-by-article audit table');
      }
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
