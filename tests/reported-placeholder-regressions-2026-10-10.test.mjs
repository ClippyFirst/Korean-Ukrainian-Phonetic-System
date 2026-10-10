import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);
const lexicon = new Map(rows.map((row) => [row.input, row]));
const engine = createEngine(canonical, lexicalText);
const generic = createEngine(canonical, '');

const exactOracles = [
  {
    input: '해돋이처럼',
    surface: '해도지처럼',
    ukrainian: 'гедоджічором',
    ipa: 'hɛ do dʑi tɕʰʌ ɾʌm',
    source: 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=327364',
    articles: ['§17'],
  },
  {
    input: '없으며',
    surface: '업쓰며',
    ukrainian: 'опсимйо',
    ipa: 'ʌːp̚ s͈ɯ mjʌ',
    source: 'https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002',
    articles: ['§7', '§14'],
  },
];

test('exact user-reported placeholder triggers now have narrow, source-backed regression oracles', () => {
  for (const fixture of exactOracles) {
    const row = lexicon.get(fixture.input);
    assert.ok(row, fixture.input + ': exact orthographic token needs its own lexical evidence row');
    assert.equal(row.surface_hangul, fixture.surface, fixture.input + ': CSV surface');
    assert.equal(row.target_syllables.replaceAll('|', ''), fixture.ukrainian, fixture.input + ': CSV Ukrainian target');
    assert.equal(row.ipa_syllables.split('|').join(' '), fixture.ipa, fixture.input + ': CSV IPA');
    assert.equal(row.source_url, fixture.source, fixture.input + ': expected official source');
    assert.equal(row.target_status, 'provisional', fixture.input + ': Ukrainian rendering remains reviewable');

    const result = engine.convert(fixture.input);
    assert.equal(result.surfaceHangul, fixture.surface, fixture.input + ': standard Korean surface');
    assert.equal(result.ukrainian, fixture.ukrainian, fixture.input + ': project Ukrainian rendering');
    assert.equal(result.ipa, fixture.ipa, fixture.input + ': broad IPA');
    assert.equal(result.issues.length, 0, fixture.input + ': sourced exact token must not produce engine issues');
    assert.ok(!result.ukrainian.includes('⟦'), fixture.input + ': unresolved placeholders are forbidden for this verified token');
    assert.equal(result.status, 'lexical-review', fixture.input + ': provisional target remains reviewable');
  }
});

test('the new exact-token licenses do not leak into generic morphology inference', () => {
  for (const input of ['해돋이처럼', '없으며']) {
    const result = generic.convert(input);
    assert.ok(
      result.ukrainian.includes('⟦') || result.issues.length > 0 || result.status === 'unresolved',
      input + ': without an exact lexical or morphological license, generic mode must fail closed',
    );
    assert.ok(
      !result.trace.some((item) => item.rules.includes('lexical-pronunciation')),
      input + ': generic engine must not secretly use lexical evidence',
    );
  }
});

test('the original high-risk sentence remains resolved in context and stable in isolation', () => {
  const passage = '외국어의 철자만으로 한국어 발음을 확정할 수 없으며, 해돋이처럼 서로 다른 음운 현상을 보여 주는 단어들을 비교했다.';
  const result = engine.convert(passage);
  assert.equal(result.issues.length, 0, 'the source passage must not report engine issues');
  assert.equal(result.trace.filter((item) => item.status === 'unresolved').length, 0, 'the source passage must not contain unresolved trace records');
  assert.ok(!result.ukrainian.includes('⟦'), 'no unresolved marker may leak into the original source sentence');

  for (const fixture of exactOracles) {
    const standalone = engine.convert(fixture.input);
    assert.equal(standalone.ukrainian, fixture.ukrainian, fixture.input + ': context must not alter the exact lexical target');
    assert.equal(standalone.ipa, fixture.ipa, fixture.input + ': context must not alter the exact IPA');
  }
});

test('nearby negative controls retain distinct standard analyses', () => {
  const cases = [
    ['해돋이', '해도지'],
    ['곧이어', '고디어'],
    ['없다', '업따'],
    ['없는', '엄는'],
    ['없어', '업써'],
    ['없으니', '업쓰니'],
  ];
  for (const [input, surface] of cases) {
    const row = lexicon.get(input);
    assert.ok(row, input + ': independently reviewed neighboring control is required');
    assert.equal(engine.convert(input).surfaceHangul, surface, input + ': do not collapse neighboring forms into one template');
  }
});
