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


const adversarialPassages = [
  {
    name: 'complex codas, liaison, and morphology boundaries',
    text: `값이 싼 물건과 값있는 물건은 다르다. 값어치, 곧 가치가 있는 물건을 무료로 주었다고 해서 값없다. 읽고 읽다 읽어 읽는 책의 문장을 비교하고, 읽은 내용을 읽었다. 맑고 맑게 개인 날에도 밝은 하늘이 늘 맑은 것은 아니다. 넓게 펼친 종이와 넓네 하고 감탄한 들판, ‘넓히다’라는 동사의 활용도 함께 살폈다. 핥다, 훑소, 떫지처럼 겹받침 뒤에 오는 자음과 어미가 달라지면 표준 발음도 달라진다.`,
    anchors: ['값이','값있는','값어치','값없다','읽고','읽다','읽어','읽는','읽은','읽었다','맑고','맑게','밝은','넓게','넓네','넓히다','핥다','훑소','떫지'],
  },
  {
    name: 'nasalization, liquid assimilation, and n-insertion',
    text: `국립국어원은 한국 표준 발음법을 설명했다. 국물과 밥물, 독립문과 종로, 신라와 난로, 서울역의 발음을 나란히 놓고 비교했다. 꽃잎과 깻잎, 밭일과 밭일을 마친 농부의 말을 다시 들었다. 한국어의 음운 규칙은 한 글자씩 기계적으로 옮기는 방식으로 설명할 수 없다. 앞 음절의 받침, 뒤 음절의 초성, 합성어의 경계와 형태소 구조가 함께 작용한다.`,
    anchors: ['국립국어원','국물','밥물','종로','신라','난로','서울역','꽃잎','깻잎','밭일'],
  },
  {
    name: 'palatalization, aspiration, and ㅎ-related interactions',
    text: `같이 읽고 굳이 다시 읽어 보자. 밭이 넓게 펼쳐져 있지만 밭을 갈 때의 발음은 같지 않다. 해돋이는 일찍 시작되고, 해돋이는 산 너머에서 보인다. ‘발견했어요’라는 표현과 ‘않았다’라는 표현을 비교하면 ㅎ과 뒤따르는 자음의 상호 작용을 확인할 수 있다. 굳이, 같이, 밭이, 밭을 한데 모아 읽되, 실제 표준 발음과 철자를 혼동하지 않는다.`,
    anchors: ['같이','굳이','밭이','밭을','해돋이는','발견했어요','않았다'],
  },
  {
    name: 'substantive-morpheme liaison and tensification',
    text: `맛없다, 겉옷, 헛웃음, 젖어미, 끝없이, 없다, 없는 책을 차례로 읽었다. ‘값없다’와 ‘값있는’의 경계에서는 받침의 대표음과 뒤 형태소의 첫소리가 중요하다. 떡볶이 한 접시를 먹고, 옷 안에 놓인 책과 숲 속의 작은 집을 살폈다. 냇가 근처에서 잠시 쉬고, 표준 발음법을 다시 읽었다.`,
    anchors: ['맛없다','겉옷','헛웃음','젖어미','끝없이','없다','없는','값없다','값있는','떡볶이','냇가'],
  },
  {
    name: 'punctuation, quotation, and whitespace invariance',
    text: `“꽃잎, 깻잎, 밭일!” 발표자가 외쳤다. (국물)—밥물; ‘독립문…서울역?’ 그리고 종로·신라·난로. 그는 다시 말했다: “같이! 굳이? 밭이, 밭을; 읽고—읽어—읽는.” 마지막으로 적었다. [값이] {값어치} / 값없다; 끝없이…`,
    anchors: ['꽃잎','깻잎','밭일','국물','밥물','독립문','서울역','종로','신라','난로','같이','굳이','밭이','밭을','읽고','읽어','읽는','값이','값어치','값없다','끝없이'],
  },
];

for (const passageCase of adversarialPassages) {
  test('adversarial prose remains fully resolved: ' + passageCase.name, () => {
    const result = engine.convert(passageCase.text);
    assert.equal(result.issues.length, 0, passageCase.name + ': no engine issues');
    assert.equal(
      result.trace.filter((item) => item.status === 'unresolved').length,
      0,
      passageCase.name + ': no unresolved trace records',
    );
    assert.ok(!result.ukrainian.includes('⟦'), passageCase.name + ': no placeholder may leak into output');
    assert.equal(result.status, 'lexical-review', passageCase.name + ': provisional Ukrainian targets remain reviewable');

    for (const input of passageCase.anchors) {
      const expectedRow = lexicon.get(input);
      assert.ok(expectedRow, passageCase.name + ': anchor must have an exact evidence row: ' + input);
      const standalone = engine.convert(input);
      assert.equal(standalone.surfaceHangul, expectedRow.surface_hangul, input + ': evidence surface');
      assert.equal(standalone.ukrainian, expectedRow.target_syllables.replaceAll('|', ''), input + ': evidence target');
      assert.equal(standalone.ipa, expectedRow.ipa_syllables.split('|').join(' '), input + ': evidence IPA');
      assert.ok(!standalone.ukrainian.includes('⟦'), input + ': no unresolved placeholder');
    }
  });
}

test('adversarial corpus exercises a broad range of independent high-risk lexical anchors', () => {
  const allAnchors = new Set(adversarialPassages.flatMap((item) => item.anchors));
  assert.ok(allAnchors.size >= 35, 'expected at least 35 distinct tricky lexical anchors; got ' + allAnchors.size);
  assert.equal(adversarialPassages.length, 5, 'keep each adversarial text as a separate regression case');
});


const uniqueAdversarialAnchors = [...new Set(adversarialPassages.flatMap((item) => item.anchors))];
for (const input of uniqueAdversarialAnchors) {
  test('adversarial anchor is stable in isolation and in prose: ' + input, () => {
    const row = lexicon.get(input);
    assert.ok(row, input + ': evidence row must exist');
    const standalone = engine.convert(input);
    assert.equal(standalone.surfaceHangul, row.surface_hangul, input + ': expected standard surface');
    assert.equal(standalone.ukrainian, row.target_syllables.replaceAll('|', ''), input + ': expected Ukrainian target');
    assert.equal(standalone.ipa, row.ipa_syllables.split('|').join(' '), input + ': expected IPA');
    assert.ok(!standalone.ukrainian.includes('⟦'), input + ': no unresolved marker in isolation');
    assert.equal(standalone.issues.length, 0, input + ': no issue for a sourced exact form');
    if (row.target_status !== 'surface-only') {
      assert.ok(
        standalone.trace.some((item) => item.rules.includes('lexical-pronunciation')),
        input + ': exact adversarial anchor should be traceable to the lexical evidence layer',
      );
    } else {
      assert.ok(
        !standalone.trace.some((item) => item.rules.includes('lexical-pronunciation')),
        input + ': surface-only row must retain the general rule-engine trace',
      );
    }
  });
}
