import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const directory = new URL('./fixtures/adversarial-corpora/', import.meta.url);
const files = readdirSync(directory).filter((name) => name.endsWith('.txt') && (/^(?:0[1-9]|1[0-5])-/.test(name) || /^rule-\d{2}-\d{2}-/.test(name))).sort();
const originalCorpora = files.filter((name) => /^(?:0[1-9]|1[0-5])-/.test(name));
const ruleCorpora = files.filter((name) => /^rule-\d{2}-\d{2}-/.test(name));
const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('corpus suite has 15 broad corpora plus five corpora for each of 30 rule families', () => {
  assert.equal(originalCorpora.length, 15, 'preserve the original 15 broad adversarial corpora');
  assert.equal(ruleCorpora.length, 150, '30 rule families × 5 independent corpora');
  assert.equal(files.length, 165, 'all corpus inputs are discoverable');
  const seen = new Set();
  for (const file of files) {
    const source = readFileSync(new URL('./fixtures/adversarial-corpora/' + file, import.meta.url), 'utf8');
    assert.ok(source.includes('\n'), file + ': must contain multiple lines');
    assert.ok((source.match(/[가-힣]/gu) || []).length >= 100, file + ': Korean text must be substantial');
    assert.ok(source.trim().length >= 500, file + ': corpus must not be a tiny sample');
    assert.ok(!seen.has(source), file + ': corpus content must be unique');
    seen.add(source);
  }
  for (let rule = 1; rule <= 30; rule++) {
    const prefix = 'rule-' + String(rule).padStart(2, '0') + '-';
    assert.equal(ruleCorpora.filter((name) => name.startsWith(prefix)).length, 5, prefix + ': exactly five corpus files');
  }
});

test('every adversarial corpus can be submitted to the engine without a runtime crash', () => {
  for (const file of files) {
    const source = readFileSync(new URL('./fixtures/adversarial-corpora/' + file, import.meta.url), 'utf8');
    const result = engine.convert(source);
    assert.ok(result && typeof result === 'object', file + ': conversion returns a result object');
    assert.equal(typeof result.ukrainian, 'string', file + ': conversion has a Ukrainian-output field');
    assert.equal(typeof result.surfaceHangul, 'string', file + ': conversion has a surface-Hangul field');
    assert.equal(typeof result.ipa, 'string', file + ': conversion has an IPA field');
    assert.ok(Array.isArray(result.issues), file + ': issues are exposed for triage');
    assert.ok(Array.isArray(result.trace), file + ': trace is exposed for triage');
  }
});

test('diagnostic: summarize actual engine outcomes across all 165 adversarial corpora', () => {
  const report = [];
  for (const file of files) {
    const source = readFileSync(new URL('./fixtures/adversarial-corpora/' + file, import.meta.url), 'utf8');
    const result = engine.convert(source);
    const placeholders = [...result.ukrainian.matchAll(/⟦([^⟦⟧]+)⟧/gu)].map((m) => m[1]);
    const issueText = result.issues.map(String);
    if (result.status === 'unresolved' || placeholders.length || issueText.length) {
      report.push({
        file,
        status: result.status,
        placeholders: placeholders.slice(0, 8),
        placeholderCount: placeholders.length,
        issues: issueText.slice(0, 4),
        issueCount: issueText.length,
        outputLength: result.ukrainian.length
      });
    }
  }
  const counts = report.reduce((acc, row) => {
    acc.filesWithIssues++;
    acc.placeholders += row.placeholderCount;
    acc.issues += row.issueCount;
    acc.byStatus[row.status || 'no-status'] = (acc.byStatus[row.status || 'no-status'] || 0) + 1;
    return acc;
  }, {filesWithIssues:0, placeholders:0, issues:0, byStatus:{}});
  console.log('ADVERSARIAL_CORPUS_DIAGNOSTIC ' + JSON.stringify({totalFiles:files.length, ...counts, firstFindings:report.slice(0,60)}));
});
