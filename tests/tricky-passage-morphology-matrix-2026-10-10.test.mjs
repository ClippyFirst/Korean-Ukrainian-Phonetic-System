import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = new Map(parseCsv(lexicalText).map((row) => [row.input, row]));
const engine = createEngine(canonical, lexicalText);
const generic = createEngine(canonical, '');

const cases = [
  {
    input: '같아지는',
    surface: '가타지는',
    target: 'катаджінин',
    ipa: 'ka tʰa tɕi nɯn',
    source: 'https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002',
    article: '§13: formal-morpheme liaison, not §15 representative-coda neutralization',
  },
  {
    input: '같았다',
    surface: '가탇따',
    target: 'кататта',
    ipa: 'ka tʰat̚ t͈a',
    source: 'https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002',
    article: '§13 liaison followed by §9 coda neutralization and §23 fortition',
  },
  {
    input: '밝히는',
    surface: '발키는',
    target: 'палкінин',
    ipa: 'pal kʰi nɯn',
    source: 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=326660',
    article: '§12 attached rule: the licensed verb-stem + suffix pattern does not simplify ㄺ first',
  },
  {
    input: '닭고기와',
    surface: '닥꼬기와',
    target: 'таккоґіва',
    ipa: 'tak̚ k͈o ɡi wa',
    source: 'https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=327808',
    article: '§11 noun coda simplification plus §23 fortition; particle 와 follows vowel-final 기',
  },
  {
    input: '같이',
    surface: '가치',
    target: 'качі',
    ipa: 'ka tɕʰi',
    source: 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=313399',
    article: '§17 palatalization at a licensed formal-morpheme boundary',
  },
];

test('tricky-passage morphology matrix: rule interactions are distinct, sourced, and regression-locked', () => {
  for (const item of cases) {
    const row = rows.get(item.input);
    assert.ok(row, item.input + ': exact regression row exists');
    assert.equal(row.surface_hangul, item.surface, item.input + ': CSV surface form');
    assert.equal(row.source_url, item.source, item.input + ': evidence URL is preserved');
    assert.equal(row.target_status, 'provisional', item.input + ': Ukrainian approximation is not falsely certified');

    const result = engine.convert(item.input);
    assert.equal(result.surfaceHangul, item.surface, item.input + ': standard Korean surface form');
    assert.equal(result.ukrainian, item.target, item.input + ': project target');
    assert.equal(result.ipa, item.ipa, item.input + ': broad IPA');
    assert.equal(result.issues.length, 0, item.input + ': no engine issue for reviewed fixture');
    assert.ok(!result.ukrainian.includes('⟦'), item.input + ': no unresolved marker');
    assert.ok(result.trace.some((step) => step.rules.includes('lexical-pronunciation')), item.input + ': trace exposes the licensed evidence path');
  }
});

test('the paragraph containing the exact tricky forms has no leaked placeholders', () => {
  const paragraph = '같아지는 현상을 기록했다. 조건이 같았다. 그는 자료를 밝히는 동안 닭고기와 같이 자주 드는 예를 들었다.';
  const result = engine.convert(paragraph);
  assert.equal(result.issues.length, 0);
  assert.equal(result.trace.filter((step) => step.status === 'unresolved').length, 0);
  assert.ok(!result.ukrainian.includes('⟦'), 'no unresolved marker may leak from the mixed-rule paragraph');

  for (const item of cases) {
    assert.equal(engine.convert(item.input).surfaceHangul, item.surface, item.input + ': context must not change its surface form');
  }
});

test('generic mode does not pretend spelling alone proves morphology', () => {
  for (const item of cases) {
    const result = generic.convert(item.input);
    assert.ok(
      result.ukrainian.includes('⟦') || result.issues.length > 0 || result.status === 'unresolved',
      item.input + ': without the evidence-bearing lexical layer, unresolved morphology must remain visible',
    );
    assert.ok(
      !result.trace.some((step) => step.rules.includes('lexical-pronunciation')),
      item.input + ': generic engine cannot silently use the lexical layer',
    );
  }
});

test('§13 formal liaison and §15 substantive liaison are deliberately not collapsed', () => {
  const formal = engine.convert('같아지는');
  const substantive = engine.convert('헛웃음');
  assert.equal(formal.surfaceHangul, '가타지는');
  assert.equal(substantive.surfaceHangul, '허두슴');
  assert.notEqual(formal.surfaceHangul.slice(0, 2), substantive.surfaceHangul.slice(0, 2));
  assert.ok(rows.get('같아지는').rule_notes.includes('not §15'));
  assert.ok(rows.get('헛웃음').rule_notes.includes('제15항') || rows.get('헛웃음').rule_notes.includes('§15'));
});
