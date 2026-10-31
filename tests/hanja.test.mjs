import test from 'node:test';
import assert from 'node:assert/strict';
import { convertHangulToHanja, createHanjaConverter, createHanjaToHangulConverter, getHanjaLexiconSize } from '../src/app/hanja.js';

test('deterministic Hanja annotation converts known Sino-Korean terms', () => {
  assert.equal(convertHangulToHanja('정부는 경제 발전을 연구한다.'), '政府는 經濟 發展을 硏究한다.');
  assert.equal(convertHangulToHanja('대한민국의 문화와 역사'), '大韓民國의 文化와 歷史');
});

test('particles, endings, punctuation, whitespace, and unknown Hangul survive', () => {
  assert.equal(convertHangulToHanja('학생이 학교에서 공부해요!\n모르는말  서울'), '學生이 學校에서 工夫해요!\n모르는말  서울');
});

test('loanwords and unsupported spans are not guessed', () => {
  assert.equal(convertHangulToHanja('컴퓨터와 서울'), '컴퓨터와 서울');
  assert.equal(convertHangulToHanja('한국말'), '한국말');
});

test('known compounds and grammatical suffixes convert without partial unknown-word substitutions', () => {
  assert.equal(convertHangulToHanja('한국어교육은 중요하다.'), '韓國語敎育은 重要하다.');
  assert.equal(convertHangulToHanja('학생이 학교에서 공부해요!'), '學生이 學校에서 工夫해요!');
});


test('mixed Sino-Korean phrase annotates known words and preserves native Korean words', () => {
  const convert = createHanjaConverter({
    '현대': '現代',
    '한국어': '韓國語',
    '표준': '表準',
    '발음': '發音',
  });
  assert.equal(convert('현대 한국어의 표준 발음 값이'), '現代 韓國語의 表準 發音 값이');
});

test('conversion is deterministic and leaves non-Hangul spans unchanged', () => {
  const input = '한국어 / Korean → українська 123';
  assert.equal(convertHangulToHanja(input), '韓國語 / Korean → українська 123');
  assert.equal(convertHangulToHanja(input), convertHangulToHanja(input));
  assert.ok(getHanjaLexiconSize() >= 50);
});

test('dictionary-backed converter remains deterministic and preserves unknown runs', () => {
  const convert = createHanjaConverter({
    '한국어': '韓國語',
    '교육': '敎育',
    '중요': '重要',
  });
  assert.equal(convert('한국어교육은 중요하다.'), '韓國語敎育은 重要하다.');
  assert.equal(convert('한국말'), '한국말');
  assert.equal(convert('한국어교육은 중요하다.'), convert('한국어교육은 중요하다.'));
});


test('reverse Hanja lookup converts unique dictionary readings and preserves mixed text', () => {
  const convert = createHanjaToHangulConverter({ '정부': '政府', '경제': '經濟' });
  const result = convert('政府는 經濟 발전을 연구한다.');
  assert.equal(result.text, '정부는 경제 발전을 연구한다.');
  assert.equal(result.status, 'resolved');
  assert.deepEqual(result.ambiguities, []);
});

test('reverse Hanja lookup exposes homophone ambiguity instead of guessing', () => {
  const convert = createHanjaToHangulConverter({ '정부': '政府', '정무': '政府' });
  const result = convert('政府는 중요하다.');
  assert.equal(result.text, '政府는 중요하다.');
  assert.equal(result.status, 'ambiguous');
  assert.deepEqual(result.ambiguities[0].readings, ['정무', '정부']);
});

test('reverse Hanja lookup preserves unknown characters and reports partial coverage', () => {
  const convert = createHanjaToHangulConverter({ '경제': '經濟' });
  const result = convert('經濟와 未知');
  assert.equal(result.text, '경제와 未知');
  assert.equal(result.status, 'partial');
  assert.ok(result.unmapped.some((entry) => entry.source === '未'));
});
