import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = parseCsv(lexical);
const entries = new Map(rows.map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);

const officialGroups = {
  '§24': {
    '안다':'안따', '안고':'안꼬', '안지':'안찌',
    '감다':'감따', '감고':'감꼬', '감지':'감찌',
    '앉고':'안꼬', '앉지':'안찌', '삼고':'삼꼬', '삼지':'삼찌',
    '젊고':'점꼬', '젊지':'점찌',
    '안기다':'안기다', '감기다':'감기다', '굶기다':'굼기다', '옮기다':'옴기다',
  },
  '§25': {
    '넓게':'널께', '핥다':'할따', '훑소':'훌쏘', '떫지':'떨찌',
  },
  '§26': {
    '갈등':'갈뜽', '발동':'발똥', '절도':'절또', '말살':'말쌀',
    '불소':'불쏘', '일시':'일씨', '갈증':'갈쯩', '물질':'물찔',
    '발전':'발쩐', '몰상식':'몰쌍식', '불세출':'불쎄출',
    '허허실실':'허허실실', '절절하다':'절절하다',
  },
  '§27': {
    '할걸':'할껄', '할밖에':'할빠께', '할세라':'할쎄라',
    '할수록':'할쑤록', '할진대':'할찐대', '할지라도':'할찌라도',
  },
  '§28': {
    '문고리':'문꼬리', '눈동자':'눈똥자', '신바람':'신빠람',
    '산새':'산쌔', '손재주':'손째주', '길가':'길까',
    '물동이':'물똥이', '발바닥':'발빠닥', '굴속':'굴쏙',
    '술잔':'술짠', '바람결':'바람껼', '그믐달':'그믐딸',
    '아침밥':'아침빱', '잠자리':'잠짜리', '강가':'강까',
    '초승달':'초승딸', '등불':'등뿔', '창살':'창쌀', '강줄기':'강쭐기',
  },
  '§29': {
    '솜이불':'솜니불', '맨입':'맨닙', '내복약':'내봉냑',
    '한여름':'한녀름', '담요':'담뇨', '식용유':'시굥뉴',
    '색연필':'생년필', '서울역':'서울력', '물약':'물략',
    '불여우':'불려우', '들일':'들릴', '솔잎':'솔립',
    '설익다':'설릭따', '물엿':'물렫', '휘발유':'휘발류',
    '유들유들':'유들류들', '6·25':'유기오', '3·1절':'사밀쩔',
    '송별연':'송벼련', '등용문':'등용문',
  },
  '§30': {
    '냇가':'내까', '샛길':'새낄', '빨랫돌':'빨래똘',
    '콧등':'코뜽', '깃발':'기빨', '대팻밥':'대패빱',
    '햇살':'해쌀', '뱃속':'배쏙', '뱃전':'배쩐',
    '고갯짓':'고개찓', '콧날':'콘날', '아랫니':'아랜니',
    '툇마루':'퇸마루', '뱃머리':'밴머리', '베갯잇':'베갠닏',
    '깻잎':'깬닙', '나뭇잎':'나문닙', '도리깻열':'도리깬녈',
    '뒷윷':'뒨뉻',
  },
};

test('every registered NIKL article 24–30 exemplar is present and stable in the browser engine', () => {
  for (const [article, examples] of Object.entries(officialGroups)) {
    for (const [word, surface] of Object.entries(examples)) {
      const row = entries.get(word);
      assert.ok(row, `${article}: missing sourced regression entry for ${word}`);
      assert.equal(row.surface_hangul, surface, `${article}: data surface for ${word}`);
      assert.match(row.source_url, /^https:\/\/(www\.|m\.)?korean\.go\.kr\//u, `${article}: source URL for ${word}`);
      const result = engine.convert(word);
      assert.equal(result.surfaceHangul, surface, `${article}: engine surface for ${word}`);
      assert.equal(result.ukrainian, row.target_syllables.split('|').join(''), `${article}: Ukrainian target for ${word}`);
      assert.equal(result.ipa, row.ipa_syllables.split('|').join(' '), `${article}: IPA for ${word}`);
      assert.ok(['lexical-review', 'lexical', 'surface-only'].includes(result.status), `${article}: target status for ${word}`);
    }
  }
});

test('§26 negative controls prevent blanket fortition after every Sino-Korean ㄹ', () => {
  for (const word of ['허허실실', '절절하다']) {
    const row = entries.get(word);
    assert.ok(row, 'negative control must be source-backed: ' + word);
    assert.equal(engine.convert(word).surfaceHangul, word);
  }
});

test('§29 negative controls do not receive automatic ㄴ insertion', () => {
  assert.equal(engine.convert('송별연').surfaceHangul, '송벼련');
  assert.equal(engine.convert('등용문').surfaceHangul, '등용문');
});

test('§30 permitted saisiot variants remain visible as variants, not silently discarded', () => {
  for (const word of ['냇가', '뱃속', '샛길', '빨랫돌', '콧등', '깃발', '대팻밥', '햇살', '뱃전', '고갯짓']) {
    const row = entries.get(word);
    assert.ok(row, word);
    assert.ok(row.alternate_surface_hangul, word + ': official alternate surface must be retained');
    const result = engine.convert(word);
    assert.equal(result.variants.length, 1, word);
    assert.equal(result.variants[0].surface, row.alternate_surface_hangul, word);
    assert.equal(result.variants[0].ipa, row.alternate_ipa_syllables.split('|').join(' '), word);
  }
});

test('every lexical row round-trips to its stored Korean surface, Ukrainian target, and IPA', () => {
  for (const row of rows) {
    const result = engine.convert(row.input);
    assert.equal(result.surfaceHangul, row.surface_hangul, 'surface: ' + row.input);
    if (row.target_status !== 'surface-only') {
      assert.equal(result.ukrainian, row.target_syllables.split('|').join(''), 'Ukrainian: ' + row.input);
      assert.equal(result.ipa, row.ipa_syllables.split('|').join(' '), 'IPA: ' + row.input);
    }
    if (row.alternate_surface_hangul) {
      assert.ok(result.variants.length > 0, 'alternate pronunciation must be surfaced: ' + row.input);
      assert.equal(result.variants[0].surface, row.alternate_surface_hangul, 'alternate: ' + row.input);
    }
  }
});
