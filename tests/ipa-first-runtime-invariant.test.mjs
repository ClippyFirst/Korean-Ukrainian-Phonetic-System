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

test('unresolved whole Hangul tokens withhold partial IPA and Ukrainian targets', () => {
  for (const token of expectedMorphologyGaps) {
    const result = engine.convert(token);
    assert.equal(result.status, 'unresolved', token + ': must remain explicitly unresolved');
    assert.equal(result.ipa, '', token + ': partial IPA must not be presented as a complete pronunciation');
    assert.equal(result.ukrainian, '', token + ': partial Ukrainian output must be withheld');
    assert.deepEqual(result.variants, [], token + ': unresolved input must not expose derived target variants');
  }
});

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

test('every unique Hangul token in the integrated NIKL passage has an accepted output or a traceable IPA-derived candidate', () => {
  const tokens = [...new Set(corpus.match(/[가-힣]+/gu) || [])];
  const failures = [];
  const unresolved = [];

  for (const token of tokens) {
    const result = engine.convert(token);
    if (result.status === 'unresolved' || !result.ipa || /[⟦⟧]/u.test(result.ukrainian)) {
      unresolved.push({ token, status: result.status, ipa: result.ipa, ukrainian: result.ukrainian, issues: result.issues });
      if (!expectedMorphologyGaps.has(token)) failures.push({ token, kind: 'unexpected-unresolved', status: result.status, ipa: result.ipa, ukrainian: result.ukrainian, issues: result.issues });
      if (result.ipa !== '' || result.ukrainian !== '') failures.push({ token, kind: 'unresolved-output-not-withheld', status: result.status, ipa: result.ipa, ukrainian: result.ukrainian });
      continue;
    }

    const adapted = ipaTargetForSource(token, result.ipa, {allowProvisional:true});
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
      const variantAdapted = ipaTargetForSource(token, variant.ipa, {allowProvisional:true});
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
    const adapted = ipaTargetForSource(row.input, result.ipa, {allowProvisional:true});
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
      const variantAdapted = ipaTargetForSource(row.input, variant.ipa, {allowProvisional:true});
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

test('standalone compatibility Jamo inventories are preserved as literal notation while IPA is withheld', () => {
  const inventory = 'ㄱ, ㄲ, ㄴ, ㄷ, ㄸ, ㄹ, ㅁ, ㅂ, ㅃ, ㅅ, ㅆ, ㅇ, ㅈ, ㅉ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎ';
  const result = engine.convert(inventory);
  assert.equal(result.ukrainian, inventory, 'research target must not silently delete a consonant inventory');
  assert.equal(result.status, 'non-korean-input', 'an inventory is notation, not a pronounceable Korean word');
  assert.ok(!/[ㄱ-ㅎㅏ-ㅣ]/u.test(result.ipa), 'standalone Jamo must not be emitted as IPA');
  const jamoTrace = result.trace.filter((item) => /^[ㄱ-ㅎㅏ-ㅣ]+$/u.test(item.source));
  assert.equal(jamoTrace.length, 19, 'every inventory member must have a trace entry');
  assert.ok(jamoTrace.every((item) => item.status === 'literal' && item.ipa === '' && item.output === item.source), 'each inventory member is preserved as notation without fabricated IPA');

  const contextual = engine.convert('자음은 ' + inventory + '의 19개이며, 모음은 ㅏ, ㅐ, ㅑ, ㅒ의 21개이다.');
  assert.ok(contextual.ukrainian.includes(inventory), 'the inventory must survive when embedded in explanatory Korean prose');
  assert.ok(contextual.ukrainian.includes('ㅏ, ㅐ, ㅑ, ㅒ'), 'the vowel inventory must survive in explanatory prose too');
  assert.ok(!/[ㄱ-ㅎㅏ-ㅣ]/u.test(contextual.ipa), 'preserved notation must not leak into the IPA result');
});

test('unresolved source segments remain visible in mixed text while their IPA is withheld', () => {
  const tokenOnly = engine.convert('짧은소리의');
  assert.equal(tokenOnly.ukrainian, '', 'single-token research behavior remains fail-closed');
  assert.equal(tokenOnly.ipa, '', 'single-token unresolved IPA remains withheld');

  const passage = engine.convert('앞말 짧은소리의 뒷말.');
  const unresolved = (passage.trace || []).filter((item) => item.status === 'unresolved' || item.status === 'unsupported-jamo');
  assert.ok(unresolved.length > 0, 'the mixed passage should expose unresolved trace entries');
  assert.ok(passage.ukrainian.includes('⟦') && passage.ukrainian.includes('⟧'), 'unresolved source characters must be visibly marked rather than silently dropped');
  assert.ok(unresolved.every((item) => item.output === '' || item.output === '⟦' + item.source + '⟧'), 'unresolved trace output must be empty only in single-token fail-closed mode or visibly marked');
  assert.ok(!/[가-힣ㄱ-ㅎㅏ-ㅣ]/u.test(passage.ipa), 'unresolved source characters must not be fabricated as IPA');
});

test('whitespace-separated Jamo inventories are preserved literally without being treated as pronunciation', () => {
  const consonants = 'ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ';
  const vowels = 'ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ';
  const result = engine.convert('자음 목록: ' + consonants + '. 모음 목록: ' + vowels + '.');
  assert.ok(result.ukrainian.includes(consonants), 'all consonants and the original spacing must survive');
  assert.ok(result.ukrainian.includes(vowels), 'all vowels and the original spacing must survive');
  assert.ok(!/[ㄱ-ㅎㅏ-ㅣ]/u.test(result.ipa), 'standalone inventory notation must not be assigned invented IPA');
  const inventoryTrace = (result.trace || []).filter((item) => /^[ㄱ-ㅎㅏ-ㅣ]$/u.test(item.source));
  assert.ok(inventoryTrace.length >= 40, 'inventory members must remain individually traceable');
  assert.ok(inventoryTrace.every((item) => item.status === 'literal' && item.ipa === ''), 'inventory members must be literal, not phonetic units');
});

test('single Jamo inside square-bracket pronunciation notation is preserved in the target text', () => {
  const result = engine.convert('허용되는 [ㅔ] 발음과 ㅢ를 [ㅣ]로 발음하시오.');
  assert.ok(result.ukrainian.includes('[ㅔ]'), 'the bracketed [ㅔ] notation must not collapse to []');
  assert.ok(result.ukrainian.includes('[ㅣ]'), 'the bracketed [ㅣ] notation must not collapse to []');
  assert.ok(!/[ㄱ-ㅎㅏ-ㅣ]/u.test(result.ipa), 'literal bracket notation must not be fabricated into IPA');
});

test('IPA-derived targets preserve whitespace and align multiword inputs without guessing missing IPA', () => {
  const multiword = ipaTargetForSource('국립 국어원', 'kuŋ nim k͈u ɡʌ wʌn');
  assert.equal(multiword.text, 'куннім куґовон');
  assert.deepEqual(multiword.syllables, ['кун', 'нім', 'ку', 'ґо', 'вон']);
  assert.equal(multiword.unknown, '');
  assert.equal(multiword.status, 'model-selected');

  const unknown = ipaTargetForSource('가', '💥');
  assert.equal(unknown.text, '');
  assert.deepEqual(unknown.syllables, ['']);
  assert.equal(unknown.unknown, '💥');
  assert.equal(unknown.status, 'unavailable');
});
