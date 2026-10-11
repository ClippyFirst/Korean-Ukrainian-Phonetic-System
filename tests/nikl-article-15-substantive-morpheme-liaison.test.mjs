import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = new Map(parseCsv(lexical).map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);
const officialSource = /^https:\/\/(www\.|m\.)?korean\.go\.kr\//u;

test('§15 substantive-morpheme liaison uses representative codas, not the §13 written-coda pattern', () => {
  const expected = {
    '맛없다': { surface: '마덥따', ipa: 'ma dʌp̚ t͈a' },
    '겉옷': { surface: '거돋', ipa: 'kʌ dot̚' },
    '값어치': { surface: '가버치', ipa: 'ka bʌ tɕʰi' },
    '밭 아래': { surface: '바다래', ipa: 'pa ta ɾɛ' },
  };

  for (const [input, want] of Object.entries(expected)) {
    const row = rows.get(input);
    assert.ok(row, input + ': missing official §15 record');
    assert.match(row.source_url, officialSource, input + ': source must be on the NIKL domain');
    assert.match(row.rule_notes, /제15항|§15/u, input + ': evidence must identify §15');
    assert.equal(row.surface_hangul, want.surface, input + ': standard surface');
    assert.equal(row.ipa_syllables.split('|').join(' '), want.ipa, input + ': source-attested IPA');

    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, want.surface, input + ': engine surface');
    assert.equal(result.ipa, want.ipa, input + ': engine IPA');
    assert.equal(result.ukrainian, row.target_syllables.split('|').join(input.includes(' ')?' ':''),
      input + ': engine output agrees with reviewed target and preserves phrase spacing');
    assert.equal(result.issues.length, 0, input + ': sourced form must be resolved');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved placeholder');
  }
});

test('§15 맛있다 keeps the normative primary reading and the explicitly permitted alternative', () => {
  const row = rows.get('맛있다');
  assert.ok(row, 'missing official 맛있다 record');
  assert.match(row.source_url, officialSource);
  assert.equal(row.surface_hangul, '마딛따');
  assert.equal(row.alternate_surface_hangul, '마싣따');

  const result = engine.convert('맛있다');
  assert.equal(result.surfaceHangul, '마딛따');
  assert.equal(result.ipa, 'ma dit̚ t͈a');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '마싣따');
  assert.equal(result.variants[0].ipa, 'ma ɕit̚ t͈a');
});
