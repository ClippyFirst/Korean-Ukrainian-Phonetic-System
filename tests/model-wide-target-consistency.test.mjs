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
    '넓고': 'ноль|ко',
    '읊다': 'ип|та',
    '읊고': 'ип|ко',
    '앉고': 'ан|ко',
    '많습니다': 'ман|сим|ни|да',
    '좋습니다': 'чо|сим|ни|да',
    '낫다': 'нат|та',
    '낫고': 'нат|ко',
    '낫지': 'нат|чі',
    '낯설다': 'нат|соль|да',
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
    '젊어': 'чоль|мо',
    '디귿이': 'ті|ґи|ші',
    '디귿을': 'ті|ґи|сил',
    '디귿에': 'ті|ґи|се',
    '젖먹이': 'чон|мо|ґі',
    '벌어': 'по|ро',
    '젖멍울': 'чон|мон|уль',
    '잡는': 'чам|нин',
    '닿소': 'та|со',
    '빗었어요': 'пі|со|со|йо',
    '젊은': 'чоль|мин',
    '좋아질': 'чо|а|джіль',
    '실제': 'шіль|че',
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
    '춥습니다': ['чуп|сим|ни|да', 'tɕʰup̚|s͈ɯm|ni|da'],
    '나갔습니다': ['на|ґат|сим|ни|да', 'na|ɡat̚|s͈ɯm|ni|da'],
    '미닫이': ['мі|да|джі', 'miː|da|dʑi'],
    '땀받이': ['там|ба|джі', 't͈am|ba|dʑi'],
    '국립국어원': ['кунг|нім|ку|ґо|вон', 'kuŋ|nim|k͈u|ɡʌ|wʌn'],
    '곧이듣다': ['ко|джі|дит|та', 'ko|tɕi|dɯt̚|t͈a'],
    '좋아질': ['чо|а|джіль', 'tɕo|a|dʑil'],
  };
  for (const [word, [target, ipa]] of Object.entries(expected)) {
    assert.equal(entries.get(word)?.target_syllables, target, word + ': target segmentation');
    assert.equal(entries.get(word)?.ipa_syllables, ipa, word + ': IPA segmentation');
  }
});

test('all corrected non-surface-only rows remain provisional and traceable', () => {
  const words = [
    '밝다','넓고','앉고','많습니다','좋습니다','낫다','낫고','낫지','낯설다','낮잠',
    '벼훑이','닫히다','겉옷','젖어미','젊어','디귿이','디귿을','디귿에','젖먹이',
    '벌어','젖멍울','잡는','닿소','빗었어요','젊은','좋아질','실제','한국어',
    '덥고','춥습니다','나갔습니다','알다','벌다','썰다'
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
