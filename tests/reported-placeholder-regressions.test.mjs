import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const genericEngine = createEngine(canonical, '');
const entries = new Map(parseCsv(lexical).map(row => [row.input, row]));

const regressions = [
  ['얇은', '얄븐', 'https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=89859&nation=eng&nationCode=6'],
  ['굵은', '굴근', 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=330743'],
  ['젊음', '절믐', 'https://korean.go.kr/common/download.do?c_file_name=fc727985-eb6b-493e-9467-221465b7c0a4_0.pdf&file_path=etcData&o_file_name=바른+국어+생활'],
  ['곬으로', '골쓰로', 'https://korean.go.kr/common/download.do?c_file_name=fc727985-eb6b-493e-9467-221465b7c0a4_0.pdf&file_path=etcData&o_file_name=바른+국어+생활'],
];

const derivedRegressions = [
  ['잊었다', '이젇따', '§13', '§23'],
  ['쌓였다', '싸엳따', '§12(4)', '§23'],
  ['붙었다', '부텯따', '§13', '§23'],
  ['찾아가다', '차자가다', 'directly lists 찾아가다 pronunciation', null],
  ['넣었다', '너얻따', '§12(4)', '§23'],
  ['놓았다', '노앋따', '§12(4)', '§23'],
  ['좋아도', '조아도', '§12(4)', null],
  ['맑을', '말글', '§14', null],
  ['없었다', '업썯따', '§14', '§23'],
];

test('reported complex-coda forms have exact official source attestations', () => {
  for (const [input, surface, source] of regressions) {
    const row = entries.get(input);
    assert.ok(row, `${input}: missing lexical evidence row`);
    assert.equal(row.surface_hangul, surface, `${input}: standard surface form`);
    assert.equal(row.source_url, source, `${input}: source must directly attest this form`);
    assert.equal(row.confidence, 'high', `${input}: source confidence`);
    assert.equal(row.target_status, 'provisional', `${input}: Ukrainian target is still provisional`);
  }
});

test('reported forms resolve without placeholders and match their sourced or rule-derived surface forms', () => {
  for (const [input, surface] of regressions) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, `${input}: surface pronunciation`);
    assert.ok(!result.ukrainian.includes('⟦'), `${input}: unresolved placeholder in ${result.ukrainian}`);
    assert.ok(!result.ukrainian.includes('⟧'), `${input}: unresolved placeholder in ${result.ukrainian}`);
    assert.deepEqual(result.issues, [], `${input}: unresolved pronunciation issue`);
  }
});

test('reported inflections have explicit NIKL rule derivations rather than unsupported direct-attestation claims', () => {
  for (const [input, surface, ruleA, ruleB] of derivedRegressions) {
    const row = entries.get(input);
    assert.ok(row, `${input}: missing regression row`);
    assert.equal(row.surface_hangul, surface, `${input}: surface form`);
    assert.equal(row.confidence, 'high', `${input}: evidence confidence`);
    assert.equal(row.target_status, 'provisional', `${input}: Ukrainian target is provisional`);
    assert.match(row.source_url, /^https:\/\/(?:(?:www\.|m\.)?korean\.go\.kr|krdict\.korean\.go\.kr)\//u, `${input}: official NIKL source`);
    assert.ok(row.rule_notes.includes(ruleA), `${input}: missing first rule/evidence note`);
    if (ruleB) assert.ok(row.rule_notes.includes(ruleB), `${input}: missing second rule/evidence note`);
    assert.equal(engine.convert(input).surfaceHangul, surface, `${input}: engine result`);
    assert.ok(!engine.convert(input).ukrainian.includes('⟦'), `${input}: placeholder remains`);
    assert.deepEqual(engine.convert(input).issues, [], `${input}: engine issues remain`);
  }
});

test('값의 remains explicitly unresolved until its morphosyntactic and 의-realization alternatives are evidenced', () => {
  assert.ok(!entries.has('값의'), 'do not force a single surface where the available evidence does not settle the reading');
  const result = genericEngine.convert('값의');
  assert.ok(
    result.ukrainian.includes('⟦') || result.issues.length > 0 || result.status === 'unresolved',
    'complex-coda liaison and the realization of particle 의 must not be guessed',
  );
});
