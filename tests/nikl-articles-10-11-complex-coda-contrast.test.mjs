import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const entries = new Map(parseCsv(lexical).map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);
const officialSource = /^https:\/\/(www\.|m\.)?korean\.go\.kr\//u;

test('§10–11 official complex-coda examples preserve the standard distinction between coda simplification and ㄺ-before-ㄱ', () => {
  const expected = {
    // §11: ordinary consonant environment; ㄺ is simplified to [ㄱ].
    '맑다': ['막따', 'mak̚ t͈a'],
    '흙과': ['흑꽈', 'hɯk̚ k͈wa'],
    // §11 exception for verb stems: ㄺ before ㄱ retains [ㄹ].
    '맑게': ['말께', 'mal k͈e'],
    '묽고': ['물꼬', 'mul k͈o'],
    // NIKL §11 explicitly lists 늙고[늘꼬] as the ㄺ-before-ㄱ stem exception.
    '늙고': ['늘꼬', 'nɯl k͈o'],
    // Rule-derived stem forms: the same ㄺ exception applies before vowel-initial endings.
    '늙게': ['늘께', 'nɯl k͈e'],
    '맑으면': ['말그면', 'mal ɡɯ mjʌn'],
    '맑았지만': ['말가찌만', 'mal ɡa tɕ͈i man'],
    '얽거나': ['얼꺼나', 'ʌl k͈ʌ na'],
    // §10 ㄼ exception for 밟- before consonants: [ㅂ], not [ㄹ].
    '밟다': ['밥따', 'paːp̚ t͈a'],
    '밟지': ['밥찌', 'paːp̚ tɕ͈i'],
    '밟고': ['밥꼬', 'paːp̚ k͈o'],
    // §11 ㄻ and ㄿ examples: simplification plus the following fortis.
    '삶': ['삼', 'saːm'],
    '젊다': ['점따', 'tɕʌːm t͈a'],
    '읊고': ['읍꼬', 'ɯp̚ k͈o'],
  };

  for (const [word, [surface, ipa]] of Object.entries(expected)) {
    const row = entries.get(word);
    assert.ok(row, 'missing official complex-coda lexical record: ' + word);
    assert.match(row.source_url, officialSource, word + ': source must be on the NIKL domain');
    assert.equal(row.surface_hangul, surface, word + ': recorded standard surface');
    assert.equal(row.ipa_syllables.split('|').join(' '), ipa, word + ': recorded broad IPA');

    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word + ': engine standard surface');
    assert.ok(!result.ukrainian.includes('⟦') && !result.ukrainian.includes('⟧'), word + ': no unresolved placeholder');
    assert.equal(result.issues.length, 0, word + ': no engine issue');
    if (row.target_status !== 'surface-only') {
      assert.equal(result.ipa, ipa, word + ': engine broad IPA');
      assert.equal(result.ukrainian, row.target_syllables.split('|').join(''), word + ': engine target follows reviewed row');
    } else {
      // Surface-only rows intentionally do not claim a lexical override;
      // the generic path must still process the standard form without an issue.
      assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
    }
  }
});
