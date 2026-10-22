import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/g2pk-surface-regression.json', import.meta.url), 'utf8'));
const sourceRegister = readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8');
const qnaUrl = 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=321743';

function csvRows(text) {
  // This focused source-register check only needs to locate the exact quoted source row.
  return text.split(/\r?\n/u).filter(Boolean);
}

test('NIKL §10 넓죽하다 and §1 읽고 divergences remain explicit rather than silently normalized', () => {
  const expected = new Map([
    ['넓죽하다', { port: '널쭈카다', normative: '넙쭈카다', locator: '§10 explicitly gives 넓-죽하다[넙쭈카다]' }],
    ['읽고', { port: '익꼬', normative: '일꼬', locator: '§1 해설 explicitly states the verbal-stem ㄺ + ㄱ environment and gives 읽고[일꼬].' }],
  ]);
  for (const [input, values] of expected) {
    const item = fixture.cases.find(candidate => candidate.input === input);
    assert.ok(item, input + ': missing fixed browser-port fixture');
    assert.equal(item.expectedSurface, values.port, input + ': practical-mode contract must stay pinned');
    assert.equal(item.normativeSurface, values.normative, input + ': preserve the separate official comparator');
    assert.equal(item.normativeSourceUrl, 'https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002');
    assert.equal(item.normativeSourceLocator, values.locator);
    assert.equal(item.differentialStatus, 'js-port-diverges-from-nikl-normative-output');
    assert.match(item.differentialNote, /do not silently rewrite|Keep both values visible|Keep the practical-port comparator unchanged/u);
    assert.match(item.differentialNote, /IPA\/Ukrainian gold/u);
  }
});

test('the official Q&A source register records the lexical contrast 칡과[칙꽈] versus 읽고[일꼬]', () => {
  const rows = csvRows(sourceRegister);
  const row = rows.find(line => line.startsWith('SRC-NIKL-QNA-321743,'));
  assert.ok(row, 'exact NIKL Q&A source row must be registered');
  assert.ok(row.includes(qnaUrl), 'source row must contain the stable official Q&A URL');
  assert.ok(row.includes('칡과[칙꽈] versus 읽고[일꼬]'), 'source row must preserve both contrasting surface forms');
  assert.match(row, /item-level KOGL type not checked/u, 'do not imply page-level reuse clearance');
  assert.match(row, /does not adjudicate broad IPA or Ukrainian target/u, 'surface evidence must not be promoted to IPA/target gold');
});
