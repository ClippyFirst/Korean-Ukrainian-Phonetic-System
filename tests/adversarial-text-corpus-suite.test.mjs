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

test('diagnostic: summarize per-eojeol outcomes across all 165 adversarial corpora', () => {
  const stats = new Map();
  const filesByIssue = new Map();
  for (const file of files) {
    const source = readFileSync(new URL('./fixtures/adversarial-corpora/' + file, import.meta.url), 'utf8');
    const eojeols = source.match(/[가-힣]+/gu) || [];
    for (const word of eojeols) {
      const result = engine.convert(word);
      const placeholders = [...result.ukrainian.matchAll(/⟦([^⟦⟧]+)⟧/gu)].map((m) => m[1]);
      const row = stats.get(word) || {word, count:0, statuses:{}, placeholders:0, issues:[], sampleTarget:'', sampleIpa:'', sampleSurface:''};
      row.count++;
      row.statuses[result.status || 'no-status'] = (row.statuses[result.status || 'no-status'] || 0) + 1;
      row.placeholders += placeholders.length;
      row.issues.push(...result.issues.map(String));
      if (!row.sampleTarget) {
        row.sampleTarget = result.ukrainian;
        row.sampleIpa = result.ipa;
        row.sampleSurface = result.surfaceHangul;
      }
      stats.set(word,row);
      if (result.status === 'unresolved' || placeholders.length || result.issues.length) {
        if (!filesByIssue.has(file)) filesByIssue.set(file, new Set());
        filesByIssue.get(file).add(word);
      }
    }
  }
  const rows = [...stats.values()].sort((a,b) => b.count-a.count || a.word.localeCompare(b.word));
  const problematic = rows.filter(r => Object.keys(r.statuses).some(s => s === 'unresolved') || r.placeholders || r.issues.length);
  const summary = {
    corpusFiles: files.length,
    uniqueEojeols: stats.size,
    eojeolOccurrences: rows.reduce((n,r)=>n+r.count,0),
    uniqueWithUnresolved: problematic.length,
    occurrencesWithUnresolved: rows.filter(r=>r.statuses.unresolved).reduce((n,r)=>n+r.statuses.unresolved,0),
    topProblematic: problematic.sort((a,b)=>b.count-a.count).slice(0,100).map(r=>({...r,issues:[...new Set(r.issues)].slice(0,3)})),
    filesWithMostProblemWords:[...filesByIssue.entries()].map(([file,words])=>({file,count:words.size,words:[...words].slice(0,20)})).sort((a,b)=>b.count-a.count).slice(0,30)
  };
  console.log('ADVERSARIAL_EOJEOL_DIAGNOSTIC ' + JSON.stringify(summary));
});
