import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createEngine,
  ipaTargetForSource,
  ipaSyllableToUkrainian,
  parseCsv,
} from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const corpus = readFileSync(new URL('./fixtures/nikl-all-articles-master-passage-2026-10-22.txt', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const lexicalRows = parseCsv(lexical);
const expectedMorphologyGaps = new Set([
  '짧은소리의',
  '수많이는',
  '없으니를',
  '없애다에서는',
  '값에서는',
  '밟으니와',
  '싫어도에서는',
  '외곬에를',
  '값있는에서는',
  '히읗을의',
  '벼훑이를',
  '밭이와',
  '붙임',
]);

test('IPA adapter is the only source of Ukrainian targets for representative IPA contrasts', () => {
  // Same source slot, different IPA input: target must follow the IPA, not
  // reconstruct a Ukrainian result from the Korean spelling.
  assert.equal(ipaSyllableToUkrainian('ka').text, 'ка');
  assert.equal(ipaSyllableToUkrainian('ɡa').text, 'ґа');
  assert.equal(ipaSyllableToUkrainian('tɕʰi').text, 'чі');
  assert.equal(ipaSyllableToUkrainian('t͈a').text, 'та');
  assert.equal(ipaSyllableToUkrainian('ɕi').text, 'ші');
  assert.equal(ipaSyllableToUkrainian('💥').unknown, '💥');
});

test('every unique Hangul token in the integrated NIKL passage has Ukrainian output reproducible from its runtime IPA', () => {
  const tokens = [...new Set(corpus.match(/[가-힣]+/gu) || [])];
  const failures = [];
  const unresolved = [];

  for (const token of tokens) {
    const result = engine.convert(token);
    if (result.status === 'unresolved' || !result.ipa || /[⟦⟧]/u.test(result.ukrainian)) {
      unresolved.push({ token, status: result.status, ipa: result.ipa, issues: result.issues });
      if (!expectedMorphologyGaps.has(token)) failures.push({ token, kind: 'unexpected-unresolved', status: result.status, ipa: result.ipa, ukrainian: result.ukrainian, issues: result.issues });
      continue;
    }

    const adapted = ipaTargetForSource(token, result.ipa);
    if (adapted.unknown || adapted.text !== result.ukrainian) {
      failures.push({
        token,
        kind: 'ipa-target-divergence',
        status: result.status,
        ipa: result.ipa,
        runtimeUkrainian: result.ukrainian,
        adapterUkrainian: adapted.text,
        unknownIpa: adapted.unknown,
        issues: result.issues,
      });
    }

    for (const variant of result.variants || []) {
      const variantAdapted = ipaTargetForSource(token, variant.ipa);
      if (variantAdapted.unknown || variantAdapted.text !== variant.ukrainian) {
        failures.push({
          token,
          kind: 'variant-ipa-target-divergence',
          ipa: variant.ipa,
          runtimeUkrainian: variant.ukrainian,
          adapterUkrainian: variantAdapted.text,
          unknownIpa: variantAdapted.unknown,
        });
      }
    }
  }

  console.log('NIKL_IPA_FIRST_INVARIANT_REPORT=' + JSON.stringify({
    uniqueTokens: tokens.length,
    lexicalRowsInInventory: lexicalRows.length,
    failureCount: failures.length,
    knownUnresolvedCount: unresolved.length,
    knownUnresolved: unresolved,
    failureSamples: failures.slice(0, 100),
    failuresTruncated: failures.length > 100,
  }));

  assert.ok(tokens.length >= 800, 'the integrated passage should exercise at least 800 unique Hangul tokens');
  assert.deepEqual(unresolved.map(({ token }) => token).sort(), [...expectedMorphologyGaps].sort(), 'the unresolved list must match the explicit known-gap register exactly');
  assert.equal(failures.length, 0, 'every resolved passage token and licensed variant must be reproducible from the actual runtime IPA; new gaps or divergences fail');
});

test('every Hangul-only lexical entry and licensed alternate is reproducible from the runtime IPA', () => {
  const rows = lexicalRows.filter((row) => /^[가-힣]+$/u.test(row.input));
  const failures = [];

  for (const row of rows) {
    const result = engine.convert(row.input);
    const adapted = ipaTargetForSource(row.input, result.ipa);
    if (result.status === 'unresolved' || adapted.unknown || adapted.text !== result.ukrainian) {
      failures.push({
        input: row.input,
        kind: 'primary',
        status: result.status,
        ipa: result.ipa,
        runtimeUkrainian: result.ukrainian,
        adapterUkrainian: adapted.text,
        unknownIpa: adapted.unknown,
        issues: result.issues,
      });
    }
    for (const variant of result.variants || []) {
      const variantAdapted = ipaTargetForSource(row.input, variant.ipa);
      if (variantAdapted.unknown || variantAdapted.text !== variant.ukrainian) {
        failures.push({
          input: row.input,
          kind: 'variant',
          ipa: variant.ipa,
          runtimeUkrainian: variant.ukrainian,
          adapterUkrainian: variantAdapted.text,
          unknownIpa: variantAdapted.unknown,
        });
      }
    }
  }

  console.log('ALL_LEXICAL_IPA_FIRST_REPORT=' + JSON.stringify({
    hangulOnlyLexicalRows: rows.length,
    failureCount: failures.length,
    failureSamples: failures.slice(0, 100),
    failuresTruncated: failures.length > 100,
  }));

  assert.ok(rows.length >= 600, 'the test should cover the curated Hangul-only lexical inventory');
  assert.equal(failures.length, 0, 'every runtime lexical target and licensed variant must derive from its runtime IPA');
});

test('IPA-derived targets preserve whitespace and align multiword inputs without guessing missing IPA', () => {
  assert.deepEqual(ipaTargetForSource('국립 국어원', 'kuŋ nim k͈u ɡʌ wʌn'), {
    text: 'куннім куґовон',
    syllables: ['кун', 'нім', 'ку', 'ґо', 'вон'],
    unknown: '',
  });
  assert.deepEqual(ipaTargetForSource('가', '💥'), {
    text: '',
    syllables: [''],
    unknown: '💥',
  });
});
