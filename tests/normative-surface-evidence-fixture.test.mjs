import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const fixture = JSON.parse(readFileSync(resolve('tests/fixtures/g2pk-surface-regression.json'), 'utf8'));
const byInput = new Map(fixture.cases.map((item) => [item.input, item]));

test('surface fixture separates JS-port regression values from normative evidence', () => {
  assert.equal(fixture.cases.length, 20);
  assert.match(fixture.description, /must never replace port output with normativeSurface/u);
  for (const item of fixture.cases) {
    assert.ok(item.expectedSurface, item.input + ': missing pinned-port expected surface');
    assert.ok(item.normativeSurface, item.input + ': missing normative comparator');
    assert.ok(item.normativeEvidenceStatus, item.input + ': missing evidence status');
    assert.ok(item.normativeSourceLocator, item.input + ': missing rule/article locator');
    assert.match(item.normativeSourceUrl, /^https:\/\//u, item.input + ': missing source URL');
    assert.equal(item.ipaGoldStatus, 'not_independently_adjudicated', item.input);
    if (item.normativeEvidenceStatus.startsWith('derived')) {
      assert.match(item.normativeNotes, /not independently adjudicated/u, item.input);
    }
  }
});

test('official rule citations use the canonical desktop full-text URL', () => {
  const canonical = 'https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002';
  const ruleCited = fixture.cases.filter((item) => item.normativeSourceUrl.includes('/kornorms/'));
  assert.ok(ruleCited.length > 0);
  for (const item of ruleCited) {
    assert.equal(item.normativeSourceUrl, canonical, item.input + ': stale or non-canonical NIKL rule citation');
  }
  assert.ok(!JSON.stringify(fixture).includes('/kornorms/m/m_regltn.do'), 'legacy mobile URL must not remain in the surface fixture');
});

test('directly matching NIKL surface evidence is reflected in provenance notes without claiming IPA gold', () => {
  for (const item of fixture.cases) {
    const direct = item.normativeEvidenceStatus === 'direct-NIKL-QA' || item.normativeEvidenceStatus === 'direct-NIKL-example';
    if (direct && item.expectedSurface === item.normativeSurface) {
      assert.match(item.expectedSurfaceProvenance, /surface string matches the separately cited direct NIKL comparator/u, item.input);
      assert.match(item.expectedSurfaceProvenance, /not IPA/u, item.input);
      assert.equal(item.ipaGoldStatus, 'not_independently_adjudicated', item.input);
    }
  }
});

test('known normative divergences stay explicit and never rewrite the port fixture', () => {
  assert.equal(byInput.get('값어치').expectedSurface, '갑써치');
  assert.equal(byInput.get('값어치').normativeSurface, '가버치');
  assert.equal(byInput.get('넓죽하다').expectedSurface, '널쭈카다');
  assert.equal(byInput.get('넓죽하다').normativeSurface, '넙쭈카다');
  assert.equal(byInput.get('읽고').expectedSurface, '익꼬');
  assert.equal(byInput.get('읽고').normativeSurface, '일꼬');
});


test('six formerly rule-derived surface comparators now have exact NIKL Q&A citations', () => {
  const evidence = {
    '넋이': ['넉씨', 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=73&pageIndex=1&qna_seq=323740'],
    '몫이': ['목씨', 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=335008'],
    '값이': ['갑씨', 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=73&pageIndex=1&qna_seq=330274'],
    '국립': ['궁닙', 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=328893'],
    '협력': ['혐녁', 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=330091'],
    '독립문': ['동님문', 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=314644'],
  };
  const pinnedPortSurface = { '넋이': '넉씨', '몫이': '목씨', '값이': '갑씨', '국립': '궁닙', '협력': '혐녁', '독립문': '동님문' };
  for (const [input, [surface, url]] of Object.entries(evidence)) {
    const item = byInput.get(input);
    assert.equal(item.expectedSurface, pinnedPortSurface[input], input + ': practical port output must remain unchanged');
    assert.equal(item.normativeSurface, surface, input);
    assert.equal(item.normativeEvidenceStatus, 'direct-NIKL-QA', input);
    assert.equal(item.normativeSourceUrl, url, input);
  }
  assert.equal(fixture.cases.filter((item) => item.normativeEvidenceStatus === 'direct-NIKL-QA' || item.normativeEvidenceStatus === 'direct-NIKL-example').length, 19);
  assert.equal(fixture.cases.filter((item) => item.normativeEvidenceStatus.startsWith('derived')).length, 1);
  assert.equal(byInput.get('숲이').normativeEvidenceStatus, 'derived-from-NIKL-rule');
  for (const [input, surface, url] of [
    ['숲을', '수플', 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=332248'],
    ['숲에', '수페', 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=331304'],
  ]) {
    const item = byInput.get(input);
    assert.equal(item.normativeSurface, surface, input);
    assert.equal(item.normativeEvidenceStatus, 'direct-NIKL-QA', input);
    assert.equal(item.normativeSourceUrl, url, input);
    assert.equal(item.ipaGoldStatus, 'not_independently_adjudicated', input);
  }
  assert.match(byInput.get('숲이').normativeNotes, /not independently adjudicated/u);
});
