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
  const passage = `오늘 국립국어원에서 열린 공개 토론회에서는 한국어 표준 발음법의 적용 범위와 예외적인 발음 현상을 둘러싸고 열띤 논쟁이 벌어졌다. 발표를 맡은 연구원은 “표준 발음은 글자를 기계적으로 하나씩 읽는 방식이 아니라, 형태소의 경계와 음운 환경, 단어의 구조를 함께 고려해야 하는 규범 체계입니다”라고 설명했다.

그는 특히 독립문 앞에서 만난 학생이 읽어 온 발표문을 예로 들었다. 학생은 “꽃잎과 밭일, 맨입으로 하는 말과 같이 겉보기에는 단순해 보이는 표현도 실제 발음에서는 예상하지 못한 변화가 일어날 수 있습니다”라고 말했다. 그러나 토론에 참석한 다른 전문가는 몇몇 사례가 서로 다른 규칙의 적용을 필요로 한다는 점을 지적하면서, 모든 변화를 하나의 일반적인 공식으로 처리하려는 태도는 위험하다고 덧붙였다.

토론이 이어지는 동안 참석자들은 국물과 맏며느리, 값만, 닭만, 젊고, 읽다, 신라, 십리, 같이, 굳이, 해돋이처럼 서로 다른 음운 현상을 보여 주는 단어들을 비교했다. 어떤 경우에는 받침이 뒤 음절의 첫소리에 영향을 주었고, 어떤 경우에는 비음화나 유음화가 나타났으며, 또 다른 경우에는 형태소의 결합 방식이나 뒤따르는 모음의 성격을 따져야 했다. 특히 표기상으로는 비슷해 보이는 두 단어가 실제 발음에서는 서로 다른 과정을 거칠 수 있다는 사실이 여러 차례 확인되었다.

한편 외래어와 외국 인명에 관한 질문도 제기되었다. “브뤼셀에서 온 연구자가 제주도와 서울을 오가며 조사한 자료를 영어와 프랑스어로 옮긴 뒤, 다시 한국어로 번역하면 원래의 발음 정보가 얼마나 남을까요?”라는 질문에 사회자는 외국어의 철자만으로 한국어 발음을 확정할 수 없으며, 원어의 발음과 공식 표기, 한국어의 외래어 표기 원칙을 구분해야 한다고 답했다.

회의가 끝나기 직전, 한 학생이 다음과 같이 질문했다. “읽는 법을 알고 있다고 해서 언제나 정확하게 발음할 수 있는 것은 아니고, 발음 규칙을 외웠다고 해서 모든 실제 발음이 자동으로 설명되는 것도 아닌가요?” 연구원은 잠시 생각한 뒤 고개를 끄덕였다. “맞습니다. 규칙을 적용할 수 있는 환경과 적용할 수 없는 환경을 구별하고, 근거가 부족한 경우에는 확실하지 않다고 표시하는 것 역시 정확한 언어 분석의 일부입니다.”

그날 배포된 보고서에는 마지막으로 다음 문장이 실렸다. “표준 발음의 원칙을 엄격하게 지키려면 예외처럼 보이는 사례를 무조건 예외로 분류해서도 안 되고, 반대로 익숙한 발음이라는 이유만으로 규범에 없는 변화를 허용해서도 안 된다. 실제 발음과 표준 발음, 형태소 분석과 음운 규칙, 외래어 표기와 외국어 원음 사이의 차이를 세밀하게 검토해야 한다.”`;
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
