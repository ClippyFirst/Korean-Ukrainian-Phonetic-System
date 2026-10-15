import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const entries = new Map(parseCsv(lexical).map((row) => [row.input, row]));
const officialRulesUrl = 'https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002';

test('§30(2): saisiot before ㄴ/ㅁ has independently pinned nasalized surface readings', () => {
  const cases = [
    ['콧날', '콘날', 'kʰon nal'],
    ['아랫니', '아랜니', 'a ɾɛn ni'],
    ['뱃머리', '밴머리', 'pɛn mʌ ɾi'],
  ];
  for (const [input, surface, ipa] of cases) {
    const row = entries.get(input);
    assert.ok(row, input + ': missing exact lexical evidence');
    assert.equal(row.surface_hangul, surface, input + ': standard surface');
    assert.equal(row.source_url, officialRulesUrl, input + ': official NIKL standard');
    assert.equal(row.confidence, 'high', input + ': Korean pronunciation evidence');
    assert.equal(row.target_status, 'provisional', input + ': Ukrainian rendering is not an official standard');
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, input + ': engine surface');
    assert.equal(result.ipa, ipa, input + ': IPA');
    assert.equal(result.status, 'lexical-review', input + ': provisional target remains reviewable');
    assert.deepEqual(result.issues, [], input + ': no unresolved pronunciation issue');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no placeholder in target');
  }
});

test('§30(3): saisiot before 이 yields the documented ㄴㄴ insertion sequence', () => {
  const cases = [
    ['깻잎', '깬닙', 'kɛn nip̚'],
    ['나뭇잎', '나문닙', 'na mun nip̚'],
    ['베갯잇', '베갠닏', 'pe ɡɛn nit̚'],
    ['도리깻열', '도리깬녈', 'to ɾi gɛn ɲʌl'],
  ];
  for (const [input, surface, ipa] of cases) {
    const row = entries.get(input);
    assert.ok(row, input + ': missing exact lexical evidence');
    assert.equal(row.surface_hangul, surface, input + ': standard surface');
    assert.equal(row.source_url, officialRulesUrl, input + ': official NIKL standard');
    assert.match(row.rule_notes, /§30\(3\)/u, input + ': notes identify the exact subrule');
    assert.equal(row.confidence, 'high', input + ': Korean pronunciation evidence');
    assert.equal(row.target_status, 'provisional', input + ': Ukrainian rendering remains provisional');
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, input + ': engine surface');
    assert.equal(result.ipa, ipa, input + ': IPA');
    assert.equal(result.status, 'lexical-review', input + ': provisional target remains reviewable');
    assert.deepEqual(result.issues, [], input + ': no unresolved pronunciation issue');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no placeholder in target');
  }
});

test('§30(1): 냇가 retains both NIKL-listed coda realizations rather than collapsing the variant', () => {
  const row = entries.get('냇가');
  assert.ok(row, '냇가: missing source-backed variant entry');
  assert.equal(row.surface_hangul, '내까');
  assert.equal(row.alternate_surface_hangul, '낻까');
  assert.equal(row.source_url, officialRulesUrl);
  assert.equal(row.target_status, 'provisional');
  const result = engine.convert('냇가');
  assert.equal(result.surfaceHangul, '내까');
  assert.equal(result.ipa, 'nɛː k͈a');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '낻까');
  assert.equal(result.variants[0].ipa, 'nɛːt̚ k͈a');
  assert.equal(result.status, 'lexical-review');
  assert.equal(result.variants[0].status, 'lexical-review');
});

test('§30 test corpus never presents provisional Ukrainian targets as official norms', () => {
  const cases = ['냇가', '콧날', '아랫니', '뱃머리', '깻잎', '나뭇잎', '베갯잇', '도리깻열'];
  for (const input of cases) {
    const row = entries.get(input);
    assert.ok(row, input);
    assert.equal(row.target_status, 'provisional', input);
    assert.match(row.rule_notes, /NIKL §30/u, input + ': source note names the rule');
    const result = engine.convert(input);
    assert.equal(result.status, 'lexical-review', input);
    assert.ok(result.trace.some((entry) => entry.rules.includes('ukrainian-target-provisional')),
      input + ': output trace should preserve the review status');
  }
});
