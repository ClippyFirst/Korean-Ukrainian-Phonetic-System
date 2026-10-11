import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = new Map(parseCsv(lexicalText).map((row) => [row.input, row]));
const engine = createEngine(canonical, lexicalText);
const officialSource = /^https:\/\/(www\.|m\.)?korean\.go\.kr\//u;

test('§10–11 morphology contrasts distinguish ㄺ stems, 밟- exception, and 넓- compounds', () => {
  // Korean surface readings are attested by NIKL Q&A 315279 (2025-05-23)
  // and NIKL Q&A 307508 (2024-12-12); IPA is the project's broad rendering.
  const expected = {
    '읽다': { surface: '익따', ipa: 'ik̚ t͈a', target: 'ікта' },
    '읽고': { surface: '일꼬', ipa: 'il k͈o', target: 'ілко' },
    '붉다': { surface: '북따', ipa: 'puk̚ t͈a', target: 'пукта' },
    '붉지': { surface: '북찌', ipa: 'puk̚ tɕ͈i', target: 'пукчі' },
    '붉고': { surface: '불꼬', ipa: 'pul k͈o', target: 'пулко' },
    '맑다': { surface: '막따', ipa: 'mak̚ t͈a', target: 'макта' },
    '맑고': { surface: '말꼬', ipa: 'mal k͈o', target: 'малко' },
    '밟다': { surface: '밥따', ipa: 'paːp̚ t͈a', target: 'папта' },
    '밟고': { surface: '밥꼬', ipa: 'paːp̚ k͈o', target: 'папко' },
    '밟으니': { surface: '발브니', ipa: 'pal bɯ ni', target: 'палбині' },
    '넓다': { surface: '널따', ipa: 'nʌl t͈a', target: 'нолта' },
    '넓죽하다': { surface: '넙쭈카다', ipa: 'nʌp̚ tɕ͈u kʰa da', target: 'нопчукада' },
    '넓둥글다': { surface: '넙뚱글다', ipa: 'nʌp̚ t͈uŋ ɡɯl da', target: 'ноптунґилда' },
  };

  for (const [word, want] of Object.entries(expected)) {
    const row = rows.get(word);
    assert.ok(row, word + ': exact source-backed lexical row is required');
    assert.match(row.source_url, officialSource, word + ': source must be on the NIKL domain');
    assert.equal(row.confidence, 'high', word + ': source confidence');
    assert.ok(['provisional', 'model-selected'].includes(row.target_status), word + ': Ukrainian target status must remain explicit and non-normative');
    assert.equal(row.surface_hangul, want.surface, word + ': recorded normative surface');
    assert.equal(row.ipa_syllables.split('|').join(' '), want.ipa, word + ': broad IPA');
    assert.equal(row.target_syllables.split('|').join(''), want.target, word + ': reviewed IPA-derived target');

    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, want.surface, word + ': runtime surface');
    assert.equal(result.ipa, want.ipa, word + ': runtime IPA');
    assert.equal(result.ukrainian, want.target, word + ': runtime IPA-first target');
    assert.equal(result.issues.length, 0, word + ': sourced reading must resolve');
    assert.ok(!result.ukrainian.includes('⟦') && !result.ukrainian.includes('⟧'), word + ': no placeholder');
  }
});

test('§10–11 negative contrasts prevent spelling-only generalization of coda exceptions', () => {
  const contrasts = [
    ['읽다', '익따', '읽고', '일꼬'],
    ['붉다', '북따', '붉고', '불꼬'],
    ['맑다', '막따', '맑고', '말꼬'],
    ['밟다', '밥따', '밟으니', '발브니'],
    ['넓다', '널따', '넓죽하다', '넙쭈카다'],
  ];

  for (const [left, leftSurface, right, rightSurface] of contrasts) {
    assert.equal(rows.get(left)?.surface_hangul, leftSurface, left + ': contrast anchor');
    assert.equal(rows.get(right)?.surface_hangul, rightSurface, right + ': contrast anchor');
    assert.notEqual(leftSurface, rightSurface, left + '/' + right + ': the morphological/lexical distinction must remain visible');
  }
});

test('§10–11 exact morphology evidence identifies its official rule and source', () => {
  for (const word of ['읽다', '읽고', '붉다', '붉지', '붉고', '맑다', '맑고', '밟다', '밟고', '밟으니', '넓다', '넓죽하다', '넓둥글다']) {
    const row = rows.get(word);
    assert.match(row.source_url, officialSource, word);
    assert.match(row.rule_notes, /제10항|제11항|§10|§11/u, word + ': notes must name the relevant article');
  }
});
