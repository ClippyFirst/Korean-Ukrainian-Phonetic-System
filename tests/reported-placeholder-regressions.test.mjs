import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const entries = new Map(parseCsv(lexical).map(row => [row.input, row]));

const regressions = [
  ['얇은', '얄븐', 'https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=89859&nation=eng&nationCode=6'],
  ['굵은', '굴근', 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=330743'],
  ['젊음', '절믐', 'https://korean.go.kr/common/download.do?c_file_name=fc727985-eb6b-493e-9467-221465b7c0a4_0.pdf&file_path=etcData&o_file_name=바른+국어+생활'],
  ['곬으로', '골쓰로', 'https://korean.go.kr/common/download.do?c_file_name=fc727985-eb6b-493e-9467-221465b7c0a4_0.pdf&file_path=etcData&o_file_name=바른+국어+생활'],
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

test('reported forms resolve without placeholders and match the source-attested surface form', () => {
  for (const [input, surface] of regressions) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, `${input}: surface pronunciation`);
    assert.ok(!result.ukrainian.includes('⟦'), `${input}: unresolved placeholder in ${result.ukrainian}`);
    assert.ok(!result.ukrainian.includes('⟧'), `${input}: unresolved placeholder in ${result.ukrainian}`);
    assert.deepEqual(result.issues, [], `${input}: unresolved pronunciation issue`);
  }
});
