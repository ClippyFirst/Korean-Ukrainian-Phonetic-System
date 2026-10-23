#!/usr/bin/env node
/**
 * Inventory explicit NIKL article references in test filenames and source text.
 *
 * This is a navigation/coverage-audit aid only. A reference is not proof that
 * every paragraph, exception, variant, or interaction in an article is tested.
 * No network access and no source corpus mutation.
 */
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TESTS_URL = new URL('../tests/', import.meta.url);
const ARTICLE_MIN = 1;
const ARTICLE_MAX = 30;

function addRefs(target, numbers) {
  for (const number of numbers) {
    const article = Number(number);
    if (Number.isInteger(article) && article >= ARTICLE_MIN && article <= ARTICLE_MAX) target.add(article);
  }
}

function numbersInList(value) {
  return (String(value).match(/\d{1,2}/gu) || []).map(Number);
}

export function extractNiklArticleReferences(fileName, sourceText = '') {
  const filenameRefs = new Set();
  const textRefs = new Set();

  // Treat each number literally named in a test filename as an explicit
  // reference. Never expand "24-30" into an assumed range.
  const filenamePattern = /nikl[-_]articles?[-_](\d{1,2}(?:[-_]\d{1,2})*)/giu;
  for (const match of String(fileName).matchAll(filenamePattern)) addRefs(filenameRefs, numbersInList(match[1]));

  // Capture explicit article-number lists and explicit section-sign citations.
  // For a range such as "24–30", only the printed endpoints are indexed.
  const articlePattern = /\barticles?\s+((?:\d{1,2})(?:\s*(?:,|and|&|\/|–|—|-)\s*\d{1,2})*)/giu;
  for (const match of String(sourceText).matchAll(articlePattern)) addRefs(textRefs, numbersInList(match[1]));

  const sectionPattern = /§{1,2}\s*(\d{1,2}(?:\s*(?:,|and|&|\/|–|—|-)\s*\d{1,2})*)/giu;
  for (const match of String(sourceText).matchAll(sectionPattern)) addRefs(textRefs, numbersInList(match[1]));

  return {
    filenameArticles: [...filenameRefs].sort((a, b) => a - b),
    textArticles: [...textRefs].sort((a, b) => a - b),
  };
}

export function buildNiklArticleTestIndex(fileRecords) {
  const records = Array.from({ length: ARTICLE_MAX }, (_, index) => ({
    article: index + ARTICLE_MIN,
    filenameTestFiles: [],
    textReferencedTestFiles: [],
  }));
  const byArticle = new Map(records.map(record => [record.article, record]));
  const seenPaths = new Set();

  for (const record of fileRecords) {
    if (!record || typeof record.path !== 'string' || typeof record.content !== 'string') {
      throw new TypeError('Each test record must include string path and content fields.');
    }
    if (seenPaths.has(record.path)) throw new Error('Duplicate test path: ' + record.path);
    seenPaths.add(record.path);
    const refs = extractNiklArticleReferences(record.path, record.content);
    for (const article of refs.filenameArticles) byArticle.get(article).filenameTestFiles.push(record.path);
    for (const article of refs.textArticles) byArticle.get(article).textReferencedTestFiles.push(record.path);
  }

  for (const record of records) {
    record.filenameTestFiles.sort();
    record.textReferencedTestFiles.sort();
    record.uniqueTestFiles = [...new Set([...record.filenameTestFiles, ...record.textReferencedTestFiles])].sort();
    record.filenameReferenceCount = record.filenameTestFiles.length;
    record.textReferenceCount = record.textReferencedTestFiles.length;
    record.status = record.uniqueTestFiles.length ? 'EXPLICIT_TEST_REFERENCE_FOUND' : 'NO_EXPLICIT_TEST_REFERENCE_FOUND';
  }
  return {
    schemaVersion: 1,
    reportType: 'nikl-article-test-reference-index',
    articleCount: ARTICLE_MAX,
    testFileCount: seenPaths.size,
    referencedArticleCount: records.filter(record => record.uniqueTestFiles.length).length,
    unreferencedArticles: records.filter(record => !record.uniqueTestFiles.length).map(record => record.article),
    limitation: 'A filename/text reference is not evidence of exhaustive paragraph, exception, variant, or interaction coverage and does not establish linguistic correctness.',
    articles: records,
  };
}

async function main(argv = process.argv.slice(2)) {
  let format = 'json';
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--help' || argv[i] === '-h') {
      console.log('Usage: node scripts/audit-nikl-article-test-index.mjs [--format json|csv]');
      console.log('Indexes explicit NIKL article references in tests/; no references are treated as proof of coverage.');
      return 0;
    }
    if (argv[i] === '--format') {
      format = argv[++i];
      if (!['json', 'csv'].includes(format)) throw new Error('--format must be json or csv.');
      continue;
    }
    throw new Error('Unknown argument: ' + argv[i]);
  }

  const root = new URL(TESTS_URL);
  const entries = (await readdir(root, { withFileTypes: true }))
    .filter(entry => entry.isFile() && entry.name.endsWith('.test.mjs'))
    .map(entry => entry.name)
    .sort();
  const records = await Promise.all(entries.map(async name => ({
    path: 'tests/' + name,
    content: await readFile(new URL(name, root), 'utf8'),
  })));
  const report = buildNiklArticleTestIndex(records);

  if (format === 'csv') {
    const quote = value => '"' + String(value).replace(/"/gu, '""') + '"';
    console.log(['article', 'status', 'filename_reference_count', 'text_reference_count', 'test_files'].join(','));
    for (const article of report.articles) {
      console.log([
        article.article,
        article.status,
        article.filenameReferenceCount,
        article.textReferenceCount,
        quote(article.uniqueTestFiles.join('; ')),
      ].join(','));
    }
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
  return 0;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  try {
    process.exitCode = await main();
  } catch (error) {
    console.error('NIKL article test index failed: ' + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 2;
  }
}
