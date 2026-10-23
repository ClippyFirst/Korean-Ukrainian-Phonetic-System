import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { buildNiklArticleTestIndex, extractNiklArticleReferences } from '../scripts/audit-nikl-article-test-index.mjs';

test('extracts filename and text references without guessing missing range members', () => {
  const refs = extractNiklArticleReferences(
    'tests/nikl-articles-24-30-complete-corpus.test.mjs',
    'The test discusses articles 10, 11 and §14; see also §§ 18–20.',
  );
  assert.deepEqual(refs.filenameArticles, [24, 30]);
  assert.deepEqual(refs.textArticles, [10, 11, 14, 18, 20]);
  assert.ok(!refs.filenameArticles.includes(25), '24–30 in a filename must not imply an unverified full range');
});

test('builds all 30 article rows, preserves source paths, and labels reference gaps honestly', () => {
  const report = buildNiklArticleTestIndex([
    { path: 'tests/nikl-article-1.test.mjs', content: 'NIKL §1 is cited.' },
    { path: 'tests/nikl-articles-10-11.test.mjs', content: 'The test cites articles 10 and 11.' },
    { path: 'tests/unrelated.test.mjs', content: 'No explicit normative article citation.' },
  ]);
  assert.equal(report.articleCount, 30);
  assert.equal(report.testFileCount, 3);
  assert.equal(report.articles.length, 30);
  assert.deepEqual(report.articles[0].uniqueTestFiles, ['tests/nikl-article-1.test.mjs']);
  assert.deepEqual(report.articles[9].uniqueTestFiles, ['tests/nikl-articles-10-11.test.mjs']);
  assert.deepEqual(report.articles[10].uniqueTestFiles, ['tests/nikl-articles-10-11.test.mjs']);
  assert.equal(report.articles[1].status, 'NO_EXPLICIT_TEST_REFERENCE_FOUND');
  assert.ok(report.limitation.includes('not evidence of exhaustive'));
});

test('rejects malformed input records and duplicate test paths', () => {
  assert.throws(() => buildNiklArticleTestIndex([{ path: 'tests/a.test.mjs' }]), /string path and content/u);
  assert.throws(() => buildNiklArticleTestIndex([
    { path: 'tests/a.test.mjs', content: '§1' },
    { path: 'tests/a.test.mjs', content: '§2' },
  ]), /Duplicate test path/u);
});

test('CLI emits the index in JSON and CSV forms', () => {
  const script = fileURLToPath(new URL('../scripts/audit-nikl-article-test-index.mjs', import.meta.url));
  const jsonRun = spawnSync(process.execPath, [script, '--format', 'json'], { encoding: 'utf8' });
  assert.equal(jsonRun.status, 0, jsonRun.stderr);
  const report = JSON.parse(jsonRun.stdout);
  assert.equal(report.articleCount, 30);
  assert.ok(report.testFileCount > 0);
  assert.equal(report.articles.length, 30);

  const csvRun = spawnSync(process.execPath, [script, '--format', 'csv'], { encoding: 'utf8' });
  assert.equal(csvRun.status, 0, csvRun.stderr);
  const lines = csvRun.stdout.trim().split(/\r?\n/u);
  assert.match(lines[0], /^article,status,filename_reference_count,text_reference_count,test_files$/u);
  assert.equal(lines.length, 31);
});
