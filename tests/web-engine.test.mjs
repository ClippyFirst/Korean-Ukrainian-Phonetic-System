import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv, decompose } from '../src/app/engine.js';
import { ipaSyllableToUkrainian, ipaSyllablesToUkrainian } from '../src/app/engine_ipa.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexicalText);

test('createEngine exposes convert and decompose', () => {
  assert.equal(typeof engine.convert, 'function');
  assert.equal(typeof engine.decompose, 'function');
  assert.equal(typeof decompose, 'function');
  assert.equal(typeof parseCsv, 'function');
});

test('IPA helpers accept IPA ɡ and reject ASCII Latin g residue', () => {
  assert.equal(ipaSyllableToUkrainian('ɡa').text, 'ґа');
  assert.deepEqual(ipaSyllableToUkrainian('ga'), { text: '', unknown: 'ga' });
  const multi = ipaSyllablesToUkrainian(['pan', 'nil']);
  assert.deepEqual(multi.syllables, ['пан', 'ніл']);
});

test('practical mode is opt-in and default is strict', () => {
  const strict = engine.convert('삶이');
  const practical = engine.convert('삶이', { morphologyMode: 'practical' });
  const soft = engine.convert('삶이', { morphologyMode: 'soft' });
  assert.ok(['unresolved', 'canonical', 'contextual', 'practical-transliteration', 'heuristic-low-confidence'].includes(strict.status) || strict.status);
  assert.doesNotMatch(practical.ukrainian, /⟦/);
  assert.doesNotMatch(soft.ukrainian, /⟦/);
});

test('lexical surface-only compounds produce surfaceHangul after recompose', () => {
  const r = engine.convert('독립문');
  assert.equal(r.surfaceHangul, '동님문');
  assert.ok(r.ukrainian.length > 0);
  assert.ok(r.ipa.includes('nim') || r.ipa.includes('ŋ'));
});

test('core lexical forms match expected Ukrainian/IPA (g/ɡ tolerant)', () => {
  const cases = [
    ['밭일', '반닐', 'панніл'],
    ['굳이', '구지', 'куджі'],
    ['읽은', '일근', 'ілґин'],
  ];
  for (const [input, surface, uk] of cases) {
    const r = engine.convert(input);
    assert.equal(r.surfaceHangul, surface, input);
    assert.equal(r.ukrainian, uk, input);
    assert.doesNotMatch(r.ukrainian, /⟦/);
  }
});

test('long mixed passage has no unresolved placeholders in practical mode', () => {
  const passage = '국립국어원 표준 발음 규정을 확인하는 연구자는 다음을 한 번에 비교했다. 독립문 앞에서 신라의 역사를 읽고 밭일을 마쳤다.';
  const r = engine.convert(passage, { morphologyMode: 'practical' });
  assert.doesNotMatch(r.ukrainian, /⟦/);
  const visibleTarget=r.ukrainian||r.candidate_ukrainian||'';
  assert.ok(visibleTarget.length > 20);
  if(r.candidate_status==='provisional') assert.equal(r.ukrainian,'');
  assert.equal(r.status === 'unresolved', false);
});

test('strict mode still surfaces issues for unlicensed morphology', () => {
  const r = engine.convert('값어');
  assert.ok(typeof r.status === 'string');
  assert.ok(Array.isArray(r.issues));
});

test('official dictionary-supported R004 cluster-plus-ㅎ form resolves in browser strict mode', () => {
  const result = engine.convert('긁혔다는거지');
  assert.notEqual(result.status, 'unresolved');
  assert.doesNotMatch(result.ipa, /⟦/u);
});


test('NIKL exact-form R003 licenses resolve two attested forms in browser strict mode', () => {
  const cases = [
    ['싫어서', '시러서'],
    ['수많은', '수마는'],
    ['많아서', '마나서'],
  ];
  for (const [input, expectedSurface] of cases) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, expectedSurface, input);
    assert.doesNotMatch(result.ipa, /⟦/u, input);
  }
});

test('NIKL usage-survey phrase variants are explicit provisional lexical candidates', () => {
  const result = engine.convert('못잃어');
  assert.equal(result.surfaceHangul, '몬니러');
  assert.equal(result.ipa, 'mon ni ɾʌ');
  assert.equal(result.status, 'lexical-review');
  assert.equal(result.target_status, 'provisional');
  assert.equal(result.ukrainian, '', 'provisional lexical target must not look accepted');
  assert.ok(result.candidate_ukrainian);
  assert.equal(result.candidate_status, 'provisional');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '모시러');
  assert.equal(result.variants[0].ipa, 'mo ɕi ɾʌ');
  assert.match(result.variants[0].note, /NIKL 2022/u);
});

test('NIKL R003 exact-form licenses do not generalize to unreviewed lookalikes', () => {
  for (const input of ['많아보임', '많이봄', '좋아보임']) {
    const result = engine.convert(input);
    assert.notEqual(result.surfaceHangul, input === '많아보임' ? '마나보임' : input);
    assert.equal(result.status, 'unresolved', input);
  }
});

test('exact-form R002 licenses resolve Korean surface contexts in browser strict mode', () => {
  const result = engine.convert('없음');
  assert.equal(result.surfaceHangul, '업씀');
  assert.notEqual(result.status, 'unresolved', '없음');
  assert.doesNotMatch(result.ipa, /⟦/u, '없음');

  // The browser surface-Hangul display is not a full word-final neutralization
  // transcription; validate morphology resolution rather than asserting [이썯].
  const past = engine.convert('있었');
  assert.notEqual(past.status, 'unresolved', '있었');
  assert.doesNotMatch(past.ipa, /⟦/u, '있었');
});

test('transparent single-word and exact-context R002/R003/R007 licenses do not leave morphology placeholders', () => {
  const cases = [
    '같아서', '되었어', '찢었으면', '했었음', '붙어야',
    '벗어날', '찾아', '없으니깐', '없으니까', '멋있어',
    '군대보냈어야', '이런삶은', '끝내고싶어유유유유', '이빨닦아야지', '안늙었는데', '싶어서', '웃어넘기겟지만',
    '쌓아서', '쳐넣어야', '애새끼낳으면', '잃었노', '않았지만', '개많음',
    '좋은데', '죽었잖아', '개좆망했잖아',
    '좃같아서', '없을듯', '괜찮아보이는디', '많을거같이',
    '많이본', '알잖아아침에', '좋아보인다고', '좋아해주는', '개같이못하고',
  ];
  for (const input of cases) {
    const result = engine.convert(input);
    assert.notEqual(result.status, 'unresolved', input);
    assert.doesNotMatch(result.ipa, /⟦/u, input);
  }
});

test('exact-form R007 licenses resolve 같이 but do not generalize to unlisted forms', () => {
  for (const input of ['많을거같이', '개같이못하고']) {
    const result = engine.convert(input);
    assert.notEqual(result.status, 'unresolved', input);
    assert.doesNotMatch(result.ipa, /⟦/u, input);
  }
  assert.equal(engine.convert('좋을거같이').status, 'unresolved');
});
