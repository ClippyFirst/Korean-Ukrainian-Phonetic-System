import test from 'node:test';
import assert from 'node:assert/strict';
import { sourceAdjudicationsForInput, attachSourceAdjudications } from '../src/app/engine_adjudications.js';

test('all runtime-matchable source adjudications are exposed with their evidence and limits', () => {
  const expected = {
    '오조오억배': 'NUMERAL_VOWEL_TRANSITION',
    '문화체험공간': 'CHE험_NO_GLIDE',
    '쇼': 'SHOW_ROUNDED_SIBILANT',
    '홍콩영화들': 'HONGKONG_MOVIE_N_INSERTION',
    '사전체험': 'CHE험_NO_GLIDE',
    '모션어디서': 'JEO_LOANWORD_SIBILANT',
    '만듬사전체험때': 'CHE험_NO_GLIDE',
    '자기이입하네': 'SELF_INSERTION_VOWEL_HIATUS',
    '뿌셔우우': 'STYLIZED_UGC_SIBILANT',
    '뿌셔우우우': 'STYLIZED_UGC_SIBILANT',
    '아끼셔': 'HONORIFIC_SI_EO_CONTRACTION',
    '한국여자로': 'KOREAN_WOMAN_N_INSERTION',
    '대한민국': 'DAEHANMINGUK_MID_FRONT_VOWEL',
    '첫연애실패후': 'FIRST_LOVE_PROSODIC_N_INSERTION',
    '포지션을': 'JEO_LOANWORD_SIBILANT'
  };
  for (const [token, family] of Object.entries(expected)) {
    assert.ok(sourceAdjudicationsForInput(token).some(item => item.case_family === family), token);
  }
  const honorific = sourceAdjudicationsForInput('아끼셔').find(item => item.case_family === 'HONORIFIC_SI_EO_CONTRACTION');
  assert.equal(honorific.occurrence_ids.length, 22);
  assert.equal(sourceAdjudicationsForInput('홍콩영화들')[0].runtime_action,
    'conditional-rule29-explicit-connected-phrase-only');
  assert.equal(sourceAdjudicationsForInput('홍콩 영화들')[0].matched_form, '홍콩 영화들');
  assert.deepEqual(sourceAdjudicationsForInput('유유유유유유유유유유유유유유유유유유유유'), []);
});

test('adjudication metadata never rewrites engine phonetic or target fields', () => {
  const result = { ipa: 's.jo', ukrainian: 'сйо', status: 'resolved' };
  const attached = attachSourceAdjudications('쇼', result);
  assert.equal(attached.ipa, result.ipa);
  assert.equal(attached.ukrainian, result.ukrainian);
  assert.equal(attached.status, result.status);
  assert.equal(attached.source_adjudications.length, 1);
  assert.deepEqual(attached.source_adjudication_registry, { version: 1, accepted_occurrence_count: 40, adjudication_count: 17 });
});
