#!/usr/bin/env node
'use strict';

// External baseline adapter only. Install phonemize@2.0.1 into a temporary
// prefix; this script does not add it to the production package dependencies.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const corpusPath = argValue('--corpus');
const outputPath = argValue('--output');
const prefix = process.env.PHONEMIZE_BASELINE_DIR;
if (!corpusPath || !outputPath || !prefix) {
  console.error('Usage: PHONEMIZE_BASELINE_DIR=<npm-prefix> node benchmark_phonemize_adapter.cjs --corpus FILE --output FILE');
  process.exit(2);
}

const requireFromPrefix = createRequire(path.join(prefix, 'benchmark-require-anchor.cjs'));
const { phonemize } = requireFromPrefix('phonemize/all');
if (typeof phonemize !== 'function') {
  throw new TypeError('phonemize/all does not export a callable phonemize function');
}
const smoke = phonemize('안녕', { language: 'ko', anyAscii: true, stripStress: true, separator: '' });
if (typeof smoke !== 'string' || !smoke.trim() || /[\uAC00-\uD7A3]/u.test(smoke)) {
  throw new Error('phonemize Korean adapter smoke test failed; expected non-Hangul IPA, got ' + JSON.stringify(smoke));
}

const rows = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
if (!Array.isArray(rows)) throw new TypeError('UGTPHON root must be an array');
const hangulOnly = /^[\uAC00-\uD7A3]+$/u;
const words = new Set();
for (const row of rows) {
  if (!row || row.lang !== 'ko' || row.split !== 'test' || !Array.isArray(row.tokens)) {
    throw new Error('Corpus row failed the pinned Korean-test schema check');
  }
  for (const token of row.tokens) {
    if (token && typeof token.canonical === 'string' && hangulOnly.test(token.canonical)) {
      words.add(token.canonical);
    }
  }
}

const predictions = {};
for (const word of words) {
  try {
    const result = phonemize(word, {
      language: 'ko',
      anyAscii: true,
      stripStress: true,
      separator: '',
    });
    if (typeof result !== 'string' || !result.trim()) {
      throw new TypeError('empty or non-string IPA result: ' + JSON.stringify(result));
    }
    predictions[word] = { ipa: result };
  } catch (error) {
    predictions[word] = { error: String(error && error.name || 'Error') + ': ' + String(error && error.message || error) };
  }
}

const report = {
  engine: 'hans00/phonemize',
  version: '2.0.1',
  language: 'ko',
  output_contract: 'direct package IPA output; anyAscii=true and stripStress=true',
  unique_words: words.size,
  outputs: Object.values(predictions).filter((x) => typeof x.ipa === 'string').length,
  errors: Object.values(predictions).filter((x) => x.error).length,
  predictions,
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({
  engine: report.engine,
  version: report.version,
  unique_words: report.unique_words,
  outputs: report.outputs,
  errors: report.errors,
}, null, 2));
