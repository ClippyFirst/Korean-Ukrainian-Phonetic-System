import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserKozakKimEngine } from '../scripts/benchmark_kozak_kim_browser.mjs';

// Contract: the Ukrainian output is a function of the final IPA. The phrase pass
// (NIKL §18/§20/§27/§29 across a word boundary) rewrites a lexical word's IPA and
// per-syllable target but used to leave the word's `ukrainian` string untouched,
// so `밥 꽃잎 나무` showed IPA [pap̚ k͈on.nim na.mu] with Ukrainian `…кконніп…`.
const engine = createBrowserKozakKimEngine();
const strict = { morphologyMode: 'strict' };

function joinedTrace(result) {
  return result.trace
    .filter((t) => t.status !== 'literal' && t.output != null)
    .map((t) => t.output).join('');
}

test('Ukrainian text follows a phrase-pass coda rewrite of a lexical word', () => {
  const r = engine.convert('밥 꽃잎 나무', strict);
  assert.equal(r.ipa, 'pap̚ k͈on.nim na.mu');
  assert.equal(r.ukrainian, 'пап кконнім наму');
});

test('Ukrainian text follows a phrase-pass onset rewrite of a lexical word', () => {
  const r = engine.convert('발 내복약', strict);
  assert.equal(r.ipa, 'pal lɛː.boŋ.ɲak̚');
  assert.equal(r.ukrainian, 'пал лебонняк');
});

test('left lexical word coda assimilation reaches the Ukrainian text', () => {
  const r = engine.convert('밥 맑게', strict);
  assert.equal(r.ipa, 'pam mal.k͈e');
  assert.equal(r.ukrainian, 'пам малкке');
});

test('invariant: resolved phrase results keep Ukrainian equal to the joined IPA-derived trace', () => {
  const lefts = ['밥', '발', '책', '한'];
  const rights = ['맑게', '넓네', '나무', '내복약', '꽃잎', '문법', '읽는', '리본'];
  const inconsistent = [];
  for (const l of lefts) for (const r of rights) {
    const result = engine.convert(`${l} ${r}`, strict);
    if (result.pronunciation_status !== 'resolved' || !result.ukrainian) continue;
    if (joinedTrace(result).replace(/\s/g, '') !== result.ukrainian.replace(/\s/g, '')) {
      inconsistent.push([`${l} ${r}`, result.ukrainian, joinedTrace(result)]);
    }
  }
  assert.deepEqual(inconsistent, []);
});

test('negative controls: no rewrite means no change; single words are unaffected', () => {
  assert.equal(engine.convert('아이 꽃잎', strict).ukrainian, 'аі кконніп');
  assert.equal(engine.convert('꽃잎', strict).ukrainian, 'кконніп');
  assert.equal(engine.convert('발 가다', strict).ukrainian.includes('ґа'), false);
});
