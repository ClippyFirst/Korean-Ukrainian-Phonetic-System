import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';
import { renderExpectedIpa } from './render-expected-ipa.mjs';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const lexicalAdditionsText = readFileSync(new URL('../data/korean/lexical_additions_2026-10-15.csv', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);
const additions = parseCsv(lexicalAdditionsText);
const engine = createEngine(canonical, lexicalText);
function mergeLexicalCsv(base, extra) {
  const header = base.split(/\r?\n/u).find(line => line.trim()) || '';
  const body = (value) => value.split(/\r?\n/u).filter(line => line.trim() && !line.startsWith('input,'));
  return [header, ...body(base), ...body(extra)].join('\n');
}
const researchEngine = createEngine(canonical, mergeLexicalCsv(lexicalText, lexicalAdditionsText));

const allowedStatuses = new Set(['model-selected', 'provisional', 'surface-only']);

test('lexical CSV stays structurally valid and every row has an explicit target status', () => {
  assert.ok(rows.length >= 600, 'unexpectedly small lexical inventory; CSV parsing may have stopped early');
  for (const row of rows) {
    assert.ok(row.input, 'empty lexical input');
    assert.ok(row.surface_hangul, row.input + ': missing Korean surface form');
    assert.ok(row.ipa_syllables, row.input + ': missing IPA');
    assert.ok(allowedStatuses.has(row.target_status), row.input + ': invalid target_status "' + row.target_status + '"');
    assert.ok(row.source_url, row.input + ': missing pronunciation source');
  }
});

test('all mixed-script and phrase lexical entries preserve their source spacing and IPA-first target', () => {
  const candidates = rows.filter(row => row.input_kind === 'mixed-script' && row.target_status !== 'surface-only');
  assert.equal(candidates.length, 12, 'keep the current mixed-script/phrase audit inventory explicit');

  for (const row of candidates) {
    const result = engine.convert(row.input);
    assert.equal(result.ipa, renderExpectedIpa(row.input,row.ipa_syllables.split('|')), row.input + ': phrase IPA');
    assert.equal(result.issues.length, 0, row.input + ': sourced phrase should map without unresolved IPA');
    const targets = row.target_syllables.split('|');
    let expected = '';
    let targetIndex = 0;
    for (const token of (row.input.match(/\s+|[^\s]+/gu) || [])) {
      if (/^\s+$/u.test(token)) {
        expected += token;
        continue;
      }
      const count = /^[가-힣]+$/u.test(token) ? [...token].length : 1;
      expected += targets.slice(targetIndex, targetIndex + count).join('');
      targetIndex += count;
    }
    expected += targets.slice(targetIndex).join('');
    assert.equal(result.ukrainian, expected, row.input + ': preserve source spacing while rendering targets from IPA');
  }
});

test('every Hangul-only lexical target is rendered from its stored IPA, not independently from spelling', () => {
  const candidates = rows.filter(row =>
    /^[가-힣]+$/u.test(row.input) &&
    row.target_status !== 'surface-only'
  );
  assert.ok(candidates.length >= 600, 'expected broad coverage of exact Hangul lexical entries');

  for (const row of candidates) {
    const result = engine.convert(row.input);
    assert.equal(result.ipa, renderExpectedIpa(row.input,row.ipa_syllables.split('|')), row.input + ': runtime IPA');
    const expectedTarget = row.target_syllables.split('|').join('');
    if (['variant-aware-research', 'kozak-research-only'].includes(row.input_kind) && row.target_status === 'provisional') {
      assert.equal(result.ukrainian, '', row.input + ': provisional target must not be accepted');
      assert.equal(result.candidate_ukrainian, expectedTarget, row.input + ': IPA-derived candidate');
      assert.equal(result.candidate_status, 'provisional', row.input + ': candidate status');
    } else {
      assert.equal(result.ukrainian, expectedTarget, row.input + ': Ukrainian target must equal the IPA-derived mapping');
    }
    assert.equal(result.issues.length, 0, row.input + ': exact sourced entry should not have an unresolved issue');
  }
});


test('all surface-only lexical overrides still cross the IPA-to-Ukrainian boundary', () => {
  const candidates = rows.filter(row => row.target_status === 'surface-only');
  assert.equal(candidates.length, 7, 'surface-only inventory must remain explicitly reviewed');

  for (const row of candidates) {
    assert.match(row.input, /^[가-힣]+$/u, row.input + ': surface-only case should be a Korean lexical form');
    const sourceSyllables = [...row.input].length;
    const surfaceSyllables = [...row.surface_hangul].length;
    const ipaSyllables = row.ipa_syllables.split('|');
    const targetSyllables = row.target_syllables.split('|');
    assert.equal(surfaceSyllables, sourceSyllables, row.input + ': source surface syllable alignment');
    assert.equal(ipaSyllables.length, sourceSyllables, row.input + ': IPA syllable alignment');
    assert.equal(targetSyllables.length, sourceSyllables, row.input + ': target syllable alignment');
    assert.ok(ipaSyllables.every(Boolean), row.input + ': empty IPA syllable');

    const result = engine.convert(row.input);
    assert.equal(result.surfaceHangul, row.surface_hangul, row.input + ': source-attested surface override');
    assert.equal(result.ipa, renderExpectedIpa(row.input,ipaSyllables), row.input + ': runtime IPA must preserve the curated surface IPA');
    assert.equal(result.ukrainian, targetSyllables.join(''), row.input + ': Ukrainian output must be rendered from IPA');
    assert.equal(result.issues.length, 0, row.input + ': surface-only IPA should map without unresolved issues');
  }
});



test('NIKL §7 끌다 keeps its long vowel and plain ㄷ while retaining provisional target status', () => {
  const row = rows.find(item => item.input === '끌다');
  assert.ok(row, 'the exact NIKL §7 lexical entry must remain present');
  assert.equal(row.surface_hangul, '끌다');
  assert.equal(row.ipa_syllables, 'k͈ɯːl|da');
  assert.equal(row.target_syllables, 'ккил|да');
  assert.equal(row.target_status, 'provisional');
  assert.equal(row.input_kind, 'kozak-research-only');

  const result = engine.convert('끌다');
  assert.equal(result.surfaceHangul, '끌다');
  assert.equal(result.ipa, renderExpectedIpa('끌다', ['k͈ɯːl', 'da']));
  assert.equal(result.ukrainian, '', 'unreviewed target must remain unavailable');
  assert.equal(result.candidate_ukrainian, 'ккилда');
  assert.equal(result.candidate_status, 'provisional');
  assert.equal(row.target_status, 'provisional', 'do not promote the Ukrainian target to reviewed');
});

test('NIKL Basic Dictionary exact 이중성 reading preserves long vowel and fortisness through IPA-first provisional target', () => {
  const row = additions.find(item => item.input === '이중성');
  assert.ok(row, 'dated lexical additions must include the exact NIKL 이중성 reading');
  assert.equal(row.surface_hangul, '이중썽');
  assert.equal(row.ipa_syllables, 'iː|dʑuŋ|s͈ʌŋ');
  assert.equal(row.target_status, 'provisional');
  assert.equal(row.input_kind, 'variant-aware-research');

  const result = researchEngine.convert('이중성');
  assert.equal(result.surfaceHangul, '이중썽');
  assert.equal(result.ipa, renderExpectedIpa('이중성', row.ipa_syllables.split('|')));
  assert.match(result.ipa, /iː/u, 'dictionary long vowel must remain in IPA');
  assert.match(result.ipa, /s͈/u, 'dictionary fortis onset must remain in IPA');
  assert.equal(result.ukrainian, '', 'unreviewed Ukrainian target must not become accepted output');
  assert.equal(result.candidate_status, 'provisional');
  assert.equal(result.candidate_ukrainian, row.target_syllables.split('|').join(''));
});




test('NIKL 물가 compound fortition persists in exact attached-particle form 물가로', () => {
  const result = engine.convert('물가로', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.equal(result.surfaceHangul, '물까로');
  assert.equal(result.ipa, renderExpectedIpa('물가로', ['mul', 'k͈a', 'ɾo']));

  // 결과[결과] is a source-internal negative control; Python regression
  // asserts it remains plain. Browser exact-form gates below must not widen.
});

test('source-attested UGTPHON fortition mismatches are corrected by exact NIKL licenses only', () => {
  const expected = [
    ['팔자걸음', '팔짜거름', 'tɕ͈'],
    ['정신병자네', '정신뼝자네', 'p͈'],
    ['보일거라', '보일꺼라', 'k͈'],
    ['없을듯', '업쓸뜯', 't͈'],
    ['안할듯', '안할뜯', 't͈'],
  ];
  for (const [word, surface, fortis] of expected) {
    const result = engine.convert(word, { ipaProfile: 'clippyfirst-korean-broad-v1' });
    assert.equal(result.surfaceHangul, surface, word);
    assert.ok(result.ipa.includes(fortis), word + ': IPA must preserve the licensed fortis segment');
    if (word === '없을듯') {
      assert.ok(result.trace.some(item => item.rules.includes('complex-coda-liaison-exact-form-formal')));
      assert.ok(result.trace.some(item => item.rules.includes('adnominal-r-fortition-§27-exact-form')));
    }
  }

  for (const word of ['많을거같이', '해줄것', '결과로']) {
    const control = engine.convert(word, { ipaProfile: 'clippyfirst-korean-broad-v1' });
    assert.ok(control.ipa, word + ': broad IPA must be available');
    assert.doesNotMatch(control.ipa, /k͈/u, word + ': no unlicensed R013/R014 fortition');
  }
});

test('NIKL Basic Dictionary 혐오증 reading enters Kozak Kim as a provisional IPA-first lexical candidate', () => {
  const row = additions.find(item => item.input === '혐오증');
  assert.ok(row, 'the exact NIKL Basic Dictionary reading must be present');
  assert.equal(row.surface_hangul, '혀모쯩');
  assert.equal(row.ipa_syllables, 'hjʌ|mo|tɕ͈ɯŋ');
  assert.equal(row.target_syllables, 'гьо|мо|ччин');
  assert.equal(row.target_status, 'provisional');
  assert.equal(row.input_kind, 'kozak-research-only');
  assert.ok(row.source_url.includes('mainSearchWord='));

  const result = researchEngine.convert('혐오증', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.equal(result.surfaceHangul, '혀모쯩');
  assert.equal(result.ipa, renderExpectedIpa('혐오증', ['hjʌ', 'mo', 'tɕ͈ɯŋ']));
  assert.equal(result.ukrainian, '', 'unreviewed target must remain unavailable');
  assert.equal(result.candidate_ukrainian, 'гьомоччин');
  assert.equal(result.candidate_status, 'provisional');
});

test('C09 NIKL dictionary length attestations enter the Kozak Kim IPA-first lexical adapter', () => {
  const expected = {
    '사람': { ipa: 'saː|ɾam', target: 'са|рам', source: 'ParaWordNo=58161' },
    '모르다': { ipa: 'moː|ɾɯ|da', target: 'мо|ри|да', source: 'ParaWordNo=29712' },
    '괴성': { ipa: 'køː|sʌŋ', target: 'кве|сон', source: 'krdict.korean.go.kr', alternate: 'kweː|sʌŋ' },
    '대한민국': { ipa: 'teː|han|min|ɡuk̚', target: 'те|ган|мін|ґук', source: 'ParaWordNo=70041' },
  };
  for (const [word, item] of Object.entries(expected)) {
    const row = additions.find(entry => entry.input === word);
    assert.ok(row, word + ': dated C09 lexical addition is required');
    assert.equal(row.surface_hangul, word);
    assert.equal(row.ipa_syllables, item.ipa);
    assert.equal(row.target_syllables, item.target);
    assert.equal(row.target_status, 'provisional');
    assert.equal(row.input_kind, 'variant-aware-research');
    assert.ok(row.source_url.includes(item.source), word + ': exact NIKL dictionary locator');
    assert.match(row.rule_notes, /Hangul pronunciation.*(?:not IPA|rather than IPA)/u);
    const result = researchEngine.convert(word);
    assert.equal(result.surfaceHangul, word);
    assert.equal(result.ipa, renderExpectedIpa(word, item.ipa.split('|')));
    assert.match(result.ipa, /ː/u, word + ': preserve dictionary-attested length');
    assert.equal(result.ukrainian, '', word + ': do not accept provisional Ukrainian target');
    assert.equal(result.target_status, 'provisional');
    assert.equal(result.candidate_status, 'provisional');
    assert.equal(result.candidate_ukrainian, item.target.split('|').join(''));
    if (item.alternate) {
      assert.equal(row.alternate_ipa_syllables, item.alternate);
      assert.equal(row.alternate_surface_hangul, word);
      assert.equal(result.variants.length, 1);
      assert.equal(result.variants[0].ipa, renderExpectedIpa(word, item.alternate.split('|')));
    }
  }
});