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

test('150 rule-family corpora keep each target form quoted and isolated', () => {
  for (const file of ruleCorpora) {
    const source = readFileSync(new URL('./fixtures/adversarial-corpora/' + file, import.meta.url), 'utf8');
    const examples = [...source.matchAll(/「([^」]+)」/gu)].map((match) => match[1]);
    assert.ok(examples.length >= 20, file + ': expected a substantial set of quoted target forms');
    assert.doesNotMatch(source, /(?:같이와|밭이가|값이와|읽게가)/u, file + ': known accidental target-plus-particle forms must not recur');
  }
});

test('diagnostic: summarize per-eojeol outcomes across all 165 adversarial corpora', () => {
  const stats = new Map();
  for (const file of files) {
    const source = readFileSync(new URL('./fixtures/adversarial-corpora/' + file, import.meta.url), 'utf8');
    const eojeols = source.match(/[가-힣]+/gu) || [];
    for (const word of eojeols) {
      const result = engine.convert(word);
      const placeholders = [...result.ukrainian.matchAll(/⟦([^⟦⟧]+)⟧/gu)].map((match) => match[1]);
      const row = stats.get(word) || {word, count:0, unresolved:0, placeholders:0, issues:new Set(), sampleTarget:'', sampleIpa:''};
      row.count++;
      if (result.status === 'unresolved' || placeholders.length || result.issues.length) row.unresolved++;
      row.placeholders += placeholders.length;
      for (const issue of result.issues) row.issues.add(String(issue));
      if (!row.sampleTarget) { row.sampleTarget=result.ukrainian; row.sampleIpa=result.ipa; }
      stats.set(word,row);
    }
  }
  const rows=[...stats.values()];
  const problematic=rows.filter(row=>row.unresolved>0).sort((a,b)=>b.count-a.count || a.word.localeCompare(b.word));
  console.log('ADVERSARIAL_EOJEOL_SUMMARY ' + JSON.stringify({
    corpusFiles:files.length,
    uniqueEojeols:rows.length,
    eojeolOccurrences:rows.reduce((sum,row)=>sum+row.count,0),
    uniqueWordsWithUnresolved:problematic.length,
    unresolvedOccurrences:problematic.reduce((sum,row)=>sum+row.unresolved,0),
    topUnresolved:problematic.slice(0,25).map(row=>({...row,issues:[...row.issues].slice(0,2)}))
  }));
});
