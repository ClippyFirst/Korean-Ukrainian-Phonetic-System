import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const rows = parseCsv(lexical);
const entries = new Map(rows.map((row) => [row.input, row]));

test('practical targets do not duplicate Korean fortisness as doubled Ukrainian onset letters', () => {
  const expected = {
    '밝다': 'пак|та',
    '넓고': 'нол|ко',
    '넓습니다': 'нол|сим|ни|да',
    '읊다': 'ип|та',
    '읊고': 'ип|ко',
    '앉고': 'ан|ко',
    '많습니다': 'ман|сим|ні|да',
    '좋습니다': 'чо|сим|ні|да',
    '낫다': 'нат|та',
    '낫고': 'нат|ко',
    '낫지': 'нат|чі',
    '낯설다': 'нат|сол|да',
    '낮잠': 'нат|чам',
  };
  for (const [word, target] of Object.entries(expected)) {
    assert.equal(entries.get(word)?.target_syllables, target, word + ': target segmentation');
    assert.ok(!target.split('|').some((syllable) => /^(?:кк|тт|пп|сс|чч|ґґ|дд|бб)/u.test(syllable)),
      word + ': doubled onset should not encode fortisness');
    if (entries.get(word)?.target_status !== 'surface-only') {
      assert.equal(engine.convert(word).ukrainian, target.replaceAll('|', ''), word + ': runtime target');
    }
  }
});

test('word-initial lenis and affricate targets follow the declared Ukrainian mapping', () => {
  const expected = {
    '벼훑이': 'пйо|гул|чі',
    '닫히다': 'та|чі|да',
    '겉옷': 'ко|дот',
    '젖어미': 'чо|до|мі',
    '젊어': 'чол|мо',
    '디귿이': 'ті|ґи|ші',
    '디귿을': 'ті|ґи|сил',
    '디귿에': 'ті|ґи|се',
    '젖먹이': 'чон|мо|ґі',
    '벌어': 'по|ро',
    '젖멍울': 'чон|мон|ул',
    '지식의': 'чі|ші|ґий',
    '집안일': 'чі|бан|ніл',
    '잡는': 'чам|нин',
    '닿소': 'та|со',
    '빗었어요': 'пі|со|со|йо',
    '젊은': 'чол|мин',
    '좋아질': 'чо|а|джіл',
    '실제': 'шіл|че',
    '한국어': 'ган|ґу|ґо',
  };
  for (const [word, target] of Object.entries(expected)) {
    assert.equal(entries.get(word)?.target_syllables, target, word + ': target segmentation');
    const result = engine.convert(word);
    assert.equal(result.ukrainian, target.replaceAll('|', ''), word + ': runtime target');
    assert.deepEqual(result.issues, [], word + ': unexpected unresolved issue');
  }
});

test('target syllable alignment and contextual IPA are consistent for high-risk connected forms', () => {
  const expected = {
    '덥고': ['топ|ко', 'tʌp̚|k͈o'],
    '춥습니다': ['чуп|сим|ні|да', 'tɕʰup̚|s͈ɯm|ni|da'],
    '나갔습니다': ['на|ґат|сим|ні|да', 'na|ɡat̚|s͈ɯm|ni|da'],
    '미닫이': ['мі|да|джі', 'miː|da|dʑi'],
    '땀받이': ['там|ба|джі', 't͈am|ba|dʑi'],
    '국립국어원': ['кун|нім|ку|ґо|вон', 'kuŋ|nim|k͈u|ɡʌ|wʌn'],
    '넓어졌다는': ['нол|бо|джот|та|нин', 'nʌl|bʌ|dʑʌt̚|t͈a|nɯn'],
    '곧이듣다': ['ко|джі|дит|та', 'ko|dʑi|dɯt̚|t͈a'],
    '좋아질': ['чо|а|джіл', 'tɕo|a|dʑil'],
  };
  for (const [word, [target, ipa]] of Object.entries(expected)) {
    assert.equal(entries.get(word)?.target_syllables, target, word + ': target segmentation');
    assert.equal(entries.get(word)?.ipa_syllables, ipa, word + ': IPA segmentation');
  }
});

test('all corrected non-surface-only rows remain provisional and traceable', () => {
  const words = [
    '밝다','넓고','앉고','많습니다','좋습니다','넓습니다','넓습니다','낫다','낫고','낫지','낯설다','낮잠',
    '벼훑이','닫히다','겉옷','젖어미','젊어','디귿이','디귿을','디귿에','젖먹이',
    '벌어','젖멍울','잡는','닿소','빗었어요','젊은','좋아질','실제','한국어',
    '덥고','춥습니다','나갔습니다','값있다','할지라도','넓어졌다는','지식의','집안일','들일','불여우','휘발유','알다','벌다','썰다'
  ];
  for (const word of words) {
    const row = entries.get(word);
    assert.ok(row, 'missing lexical row: ' + word);
    assert.equal(row.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
    assert.deepEqual(result.issues, [], word);
  }
});


test('coda ㄹ uses the declared Ukrainian л target without an added soft sign', () => {
  const expected = {
    '넓네': 'нол|ле',
    '여덟': 'йо|дол',
    '넓다': 'нол|та',
    '들일': 'тил|ліл',
    '얇실하다': 'ял|сіл|га|да',
    '짧다': 'чал|та',
    '읽거든': 'іл|ко|ден',
    '넓습니다': 'нол|сим|ни|да',
    '젖멍울': 'чон|мон|ул',
    '꽃망울': 'кон|ман|ул',
    '밥물': 'пам|мул',
    '결단력': 'кйол|тан|ньок',
    '줄넘기': 'чул|лом|кі',
    '뚫네': 'тул|ле',
    '설날': 'сол|лал',
    '넓고': 'нол|ко',
    '콧물': 'кон|мул',
    '박물관': 'пан|мул|ґван',
    '한국말': 'ган|кун|мал',
    '얇아도': 'ял|ба|до',
    '얇아서': 'ял|ба|со',
    '넓지만': 'нол|чі|ман',
    '짧아도': 'чал|ба|до',
    '일찍': 'іл|чік',
    '설명했어요': 'сол|мйон|ге|со|йо',
    '흙을': 'гил|ґил',
    '밟으며': 'пал|би|мйо',
    '낡은': 'нал|ґин',
    '밟았습니다': 'пал|ба|сим|ні|да',
    '맑은': 'мал|ґин',
  };
  for (const [word, target] of Object.entries(expected)) {
    assert.equal(entries.get(word)?.target_syllables, target, word + ': coda-lateral target');
    assert.ok(!target.split('|').some((segment) => /ль/u.test(segment)), word + ': coda ㄹ must not be softened');
    assert.equal(engine.convert(word).ukrainian, target.replaceAll('|', ''), word + ': runtime target');
  }
});

test('context-sensitive vowel and voicing decisions remain explicit in the lexical layer', () => {
  const expected = {
    '맛없다': ['ма|доп|та', 'ma|dʌp̚|t͈a'],
    '맛없고': ['ма|доп|ко', 'ma|dʌp̚|k͈o'],
    '협의': ['гьо|бі', 'hjʌ|bi'],
    '말씨': ['мал|ші', 'maːl|s͈i'],
    '반신반의': ['пан|шін|ба|ні', 'paːn|ɕin|baː|ni'],
    '임진란': ['ім|джін|нан', 'imː|dʑin|nan'],
    '결단력': ['кйол|тан|ньок', 'kjʌl|t͈an|njʌk̚'],
    '공권력': ['кон|квон|ньок', 'koŋ|k͈wʌn|njʌk̚'],
    '동원령': ['тон|вон|ньон', 'toŋː|wʌn|njʌŋ'],
    '많습니다': ['ман|сим|ні|да', 'man|s͈ɯm|ni|da'],
    '좋습니다': ['чо|сим|ні|да', 'tɕo|s͈ɯm|ni|da'],
    '읽었습니다': ['іл|ґо|сим|ні|да', 'il|ɡʌ|s͈ɯm|ni|da'],
    '춥습니다': ['чуп|сим|ні|да', 'tɕʰup̚|s͈ɯm|ni|da'],
    '나갔습니다': ['на|ґат|сим|ні|да', 'na|ɡat̚|s͈ɯm|ni|da'],
    '밟았습니다': ['пал|ба|сим|ні|да', 'pal|ba|s͈ɯm|ni|da'],
    '값있다': ['ка|біт|та', 'ka|bit̚|t͈a'],
    '할지라도': ['гал|чі|ра|до', 'hal|tɕ͈i|ɾa|do'],
    '불여우': ['пул|льо|у', 'pul|lju|u'],
    '휘발유': ['гві|пал|льу', 'hwi|pal|lju'],
  };
  for (const [word, [target, ipa]] of Object.entries(expected)) {
    const row = entries.get(word);
    assert.ok(row, 'missing lexical row: ' + word);
    assert.equal(row.target_syllables, target, word + ': target');
    assert.equal(row.ipa_syllables, ipa, word + ': IPA');
    assert.equal(engine.convert(word).ukrainian, target.replaceAll('|', ''), word + ': runtime target');
  }
});


test('velar nasal coda targets follow the canonical Ukrainian н convention across lexical overrides', () => {
  const affected = ['국민', '박물관', '한국말', '국립국어원', '국립국어원에서'];
  for (const word of affected) {
    const row = entries.get(word);
    assert.ok(row, 'missing lexical row: ' + word);
    const target = row.target_syllables.split('|');
    const ipa = row.ipa_syllables.split('|');
    assert.equal(target.length, ipa.length, word + ': target/IPA syllable alignment');
    for (let i = 0; i < ipa.length; i++) {
      if (ipa[i].endsWith('ŋ')) {
        assert.ok(target[i].endsWith('н'), word + ': velar nasal coda must use the declared Ukrainian н target');
        assert.ok(!target[i].endsWith('нг'), word + ': do not mix a separate г into the declared coda target');
      }
    }
    assert.equal(engine.convert(word).ukrainian, target.join(''), word + ': runtime target');
  }
  for (const row of rows) {
    const target = (row.target_syllables || '').split('|');
    const ipa = (row.ipa_syllables || '').split('|');
    if (target.length !== ipa.length) continue;
    for (let i = 0; i < ipa.length; i++) {
      if (ipa[i].endsWith('ŋ')) {
        assert.ok(!target[i].endsWith('нг'), row.input + ': inconsistent velar nasal target ' + target[i]);
      }
    }
  }
});


test('lexical target codas match the final consonants of their aligned surface IPA syllables', () => {
  const codaTargets = [
    [/k̚$/u, 'к'],
    [/t̚$/u, 'т'],
    [/p̚$/u, 'п'],
    [/ŋ$/u, 'н'],
    [/n(?:ː)?$/u, 'н'],
    [/m(?:ː)?$/u, 'м'],
    [/l(?:ː)?$/u, 'л'],
  ];
  for (const row of rows) {
    const target = (row.target_syllables || '').split('|');
    const ipa = (row.ipa_syllables || '').split('|');
    assert.equal(target.length, ipa.length, row.input + ': target/IPA syllable alignment');
    for (let i = 0; i < ipa.length; i++) {
      const mapping = codaTargets.find(([pattern]) => pattern.test(ipa[i]));
      if (!mapping) continue;
      assert.ok(target[i].endsWith(mapping[1]),
        row.input + ': IPA coda ' + ipa[i] + ' must align with Ukrainian target ' + mapping[1] + ' in ' + target[i]);
    }
  }
  const batIlang = entries.get('밭이랑');
  assert.equal(batIlang?.target_syllables, 'пан|ні|ран');
  assert.equal(engine.convert('밭이랑').ukrainian, 'панніран');
});
