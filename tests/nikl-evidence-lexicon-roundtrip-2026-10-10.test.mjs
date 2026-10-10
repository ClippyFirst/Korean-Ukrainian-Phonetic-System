import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);
const engine = createEngine(canonical, lexicalText);

// The CSV is the reviewed evidence layer; this suite independently checks that
// every single-Hangul lexical record is actually honored by the browser engine.
// It is a runtime/data-integrity regression, not independent proof that every
// recorded Korean reading or Ukrainian approximation is normatively correct.
const singleScriptRows = rows.filter((row) =>
  /^[가-힣]+$/u.test(row.input) &&
  /^[가-힣]+$/u.test(row.surface_hangul) &&
  row.target_syllables &&
  row.ipa_syllables
);

for (const row of singleScriptRows) {
  test('sourced lexical row round-trips through engine: ' + row.input, () => {
    assert.match(
      row.source_url,
      /^https:\/\/(?:www\.|m\.)?korean\.go\.kr\//u,
      row.input + ': source must be on an official NIKL domain',
    );
    const result = engine.convert(row.input);
    assert.equal(result.surfaceHangul, row.surface_hangul, row.input + ': standard surface form');
    assert.equal(
      result.ukrainian,
      row.target_syllables.replaceAll('|', ''),
      row.input + ': reviewed Ukrainian target',
    );
    assert.equal(
      result.ipa,
      row.ipa_syllables.split('|').join(' '),
      row.input + ': broad IPA representation',
    );
    assert.ok(!result.ukrainian.includes('⟦'), row.input + ': known sourced entry must not leak unresolved markers');
    if (row.target_status === 'provisional') {
      assert.equal(result.status, 'lexical-review', row.input + ': provisional Ukrainian target must remain reviewable');
    }
  });
}

test('the exhaustive lexicon round-trip suite is not accidentally empty or silently narrowed', () => {
  assert.ok(singleScriptRows.length >= 200, 'expected at least 200 single-Hangul evidence rows; got ' + singleScriptRows.length);
});

test('high-risk spelling-only morphology remains unresolved when exact evidence is absent', () => {
  const generic = createEngine(canonical, '');
  for (const input of ['얇은', '긁고', '늙고', '굵고', '놓아라', '갇이']) {
    const result = generic.convert(input);
    assert.ok(
      result.ukrainian.includes('⟦') || result.issues.length > 0 || result.status === 'unresolved',
      input + ': generic mode must not turn spelling resemblance into a morphology claim',
    );
  }
});

test('morphology-specific readings are not generalized to unlicensed spellings', () => {
  const generic = createEngine(canonical, '');
  const cases = [
    ['읽고', '읽어'],
    ['맑게', '맑어'],
    ['굳이', '갇이'],
    ['넓히다', '넓아다'],
  ];
  for (const [licensed, unlicensed] of cases) {
    assert.ok(rows.some((row) => row.input === licensed), licensed + ': exact licensed form must remain in the evidence data');
    const genericLicensed = generic.convert(licensed);
    assert.ok(
      !genericLicensed.trace.some((item) => item.rules.includes('lexical-pronunciation')),
      licensed + ': generic-only engine must not secretly use lexical overrides',
    );
    if (unlicensed === '갇이' || unlicensed === '넓아다') {
      const result = generic.convert(unlicensed);
      assert.ok(
        result.ukrainian.includes('⟦') || result.issues.length > 0 || result.status === 'unresolved',
        unlicensed + ': unlicensed morphology must remain unresolved',
      );
    }
  }
});
