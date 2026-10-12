import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = new Map(parseCsv(lexical).map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);
const officialSource = /^https:\/\/(www\.|m\.)?korean\.go\.kr\//u;

function assertOfficialReading(input, surface, ipa) {
  const row = rows.get(input);
  assert.ok(row, input + ': missing sourced lexical record');
  assert.match(row.source_url, officialSource, input + ': source must be on the NIKL domain');
  assert.equal(row.surface_hangul, surface, input + ': source-attested surface form');
  assert.equal(row.ipa_syllables.split('|').join(' '), ipa, input + ': source-attested IPA');

  const result = engine.convert(input);
  assert.equal(result.surfaceHangul, surface, input + ': engine surface form');
  assert.equal(result.ipa, ipa, input + ': engine IPA');
  assert.equal(result.ukrainian, row.target_syllables.split('|').join(''), input + ': engine target agrees with reviewed record');
  assert.equal(result.issues.length, 0, input + ': sourced form must not be unresolved');
  assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved placeholder');
}

test('§12 aspiration: official ㅎ + ㄱ/ㄷ/ㅈ examples and the complex-coda + ㅎ provision stay distinct', () => {
  const expected = {
    // Simple ㅎ coda + following plain consonant: aspiration.
    '놓고': ['노코', 'no kʰo'],
    '좋고': ['조코', 'tɕo kʰo'],
    '좋다': ['조타', 'tɕo tʰa'],
    '많고': ['만코', 'man kʰo'],
    '많다': ['만타', 'maːn tʰa'],
    // §12 붙임 1: only the second member of the complex coda combines with ㅎ.
    '읽히다': ['일키다', 'il kʰi da'],
    '앉히다': ['안치다', 'an tɕʰi da'],
    '넓히다': ['널피다', 'nʌl pʰi da'],
    // These are vowel-initial ending cases, not the same process as aspiration.
    '놓아': ['노아', 'no a'],
    '싫어': ['시러', 'ɕi ɾʌ'],
  };

  for (const [input, [surface, ipa]] of Object.entries(expected)) {
    assertOfficialReading(input, surface, ipa);
  }
});

test('§12 source records explicitly distinguish aspiration from ㅎ deletion before vowel-initial endings', () => {
  const aspiration = rows.get('놓고');
  const deletion = rows.get('놓아');
  assert.ok(aspiration && deletion, 'both comparison records must exist');
  assert.match(aspiration.rule_notes, /§12/u);
  assert.match(deletion.rule_notes, /ㅎ 탈락|탈락/u);
  assert.notEqual(aspiration.surface_hangul, deletion.surface_hangul);
  assertOfficialReading('놓고', '노코', 'no kʰo');
  assertOfficialReading('놓아', '노아', 'no a');
});
