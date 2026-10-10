import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);
const lexicon = new Map(rows.map((row) => [row.input, row]));
const engine = createEngine(canonical, lexicalText);

const expected = {
  '밭일': ['반닐', 'панніл', 'pan nil'],
  '밭일과': ['반닐과', 'паннілґва', 'pan nil ɡwa'],
  '밭일을': ['반니를', 'паннірил', 'pan ni ɾɯl'],
  '굳이': ['구지', 'куджі', 'ku dʑi'],
  '않았다': ['아낟따', 'анатта', 'a nat̚ t͈a'],
  '밝은': ['발근', 'палґин', 'pal ɡɯn'],
  '끝없이': ['끄덥씨', 'китопші', 'k͈ɯ tʌp̚ s͈i'],
  '발견했어요': ['발견해써요', 'палґйонгесойо', 'pal ɡjʌn hɛ s͈ʌ jo'],
  '읽은': ['일근', 'ілґин', 'il ɡɯn'],
  '읽었다': ['일걷따', 'ілґотта', 'il ɡʌt̚ t͈a'],
  '없이': ['업씨', 'опші', 'ʌp̚ s͈i'],
  '해돋이는': ['해도지는', 'гедоджінин', 'hɛ do dʑi nɯn'],
};

const passage = `오늘 국립국어원에서는 한국 표준 발음법 제5항부터 제30항까지를 검토하기 위해 특별한 공개 토론회를 열었다. 발표자는 “꽃잎이 떨어지고, 깻잎만 남았으며, 밭일과 논일은 아직 끝나지 않았다”라고 설명했다. 이어서 옷 안에 있던 값있는 물건, 젖은 옷감, 낯익은 얼굴, 부엌문 앞의 밥물과 국물, 그리고 맑고 밝은 하늘에 관해 이야기했다.
“같이 읽어 봅시다. 굳이 그렇게 할 필요는 없지만, 해돋이는 분명하고 끝없이 펼쳐진 들녘은 아름답습니다. 밭이랑 논이랑 함께 걷다가 꽃 한 송이를 발견했어요. 옆집 할머니는 ‘신라의 역사와 난로 옆의 약속을 잊지 마라’라고 말씀하셨죠.”
그런데 문제가 생겼다. 십육 년 전부터 읽어 온 책, 독립문 앞에서 찍은 사진, 종로 삼가에서 만난 사람, 서울역 근처의 식당, 그리고 같이 먹던 맑은 국밥의 발음을 서로 다르게 읽은 것이다. 발표자는 “국립국어원과 한국어문 규범을 참고하되, 철자만 기계적으로 옮기지 말고 실제 표준 발음을 먼저 분석해야 합니다”라고 강조했다.
그는 곧바로 다음 문장을 칠판에 썼다. “국밥 한 그릇, 옷 한 벌, 꽃 한 송이, 값이 싼 물건, 넋이 나간 사람, 흙 위에 놓인 책, 닭 앞에 선 아이, 숲 속의 작은 집, 여덟 명의 학생, 스물여섯 번째 문제.” 학생들은 각 표현을 천천히 읽고, 음절 경계와 형태소 경계가 발음에 미치는 영향을 비교했다.
토론은 외래어와 인명으로 이어졌다. “브라질의 상파울루, 아르헨티나의 부에노스아이레스, 우크라이나의 키이우, 프랑스의 샹젤리제, 영어의 streaming과 data science는 어떻게 다뤄야 할까요?” 한 학생이 물었다. 다른 학생은 “표준 발음의 규칙과 외국어 고유의 발음을 구별해야 합니다. 한글 표기만 보고 원어 발음을 완벽하게 복원할 수는 없습니다”라고 답했다.
마지막으로 사회자는 다음 문장을 읽었다. “값도 없이 빌려준 옷을 입고 꽃밭을 걷던 학생이 국립도서관 앞에서 읽던 책을 놓쳤다. 맑은 날인데도 숲길은 어두웠고, 밭일을 마친 농부는 ‘이것만큼은 꼭 기억해 두세요’라고 말했다. 그 순간 옆방에서 ‘같이 가요!’라는 목소리가 들렸고, 모두가 잠시 멈춰 섰다.”
참석자들은 한 가지 결론에 도달했다. 정확한 한국어 발음을 우크라이나어로 옮기려면 음운 규칙의 적용 순서, 형태소 구조, 표준 발음과 허용 발음의 차이, 그리고 우크라이나어의 음운 체계를 함께 고려해야 한다.`;

test('adversarial long-passage forms have exact source-backed lexical entries', () => {
  for (const [input, [surface, ukrainian, ipa]] of Object.entries(expected)) {
    const row = lexicon.get(input);
    assert.ok(row, input + ': exact lexical entry exists');
    assert.match(row.source_url, /^https:\/\/(?:www\.)?korean\.go\.kr\//u, input + ': official NIKL provenance');
    assert.equal(row.target_status, 'provisional', input + ': Ukrainian target remains marked provisional');
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, input + ': standard pronunciation');
    assert.equal(result.ukrainian, ukrainian, input + ': Ukrainian output');
    assert.equal(result.ipa, ipa, input + ': IPA output');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved placeholder');
  }
});

test('the full adversarial passage has no unresolved phonological placeholders', () => {
  const result = engine.convert(passage);
  assert.equal(result.issues.length, 0);
  assert.equal(result.trace.filter((item) => item.status === 'unresolved').length, 0);
  assert.ok(!result.ukrainian.includes('⟦'), 'the output must not leak unresolved Hangul placeholders');
  assert.equal(result.status, 'lexical-review', 'provisional Ukrainian targets remain visibly reviewable');
});
