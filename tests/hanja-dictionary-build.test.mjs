import test from 'node:test';
import assert from 'node:assert/strict';
import {
  UPSTREAM_COMMIT,
  SOURCES,
  gitBlobSha1,
  parseSingleCharacterRanks,
  buildPreferredWordMap,
  renderDictionaryModule,
} from '../scripts/prepare-hanja-dictionary.mjs';

test('dictionary inputs are pinned to immutable upstream files with Git blob hashes', () => {
  assert.match(UPSTREAM_COMMIT, /^[0-9a-f]{40}$/u);
  assert.equal(SOURCES.length, 2);
  assert.ok(SOURCES.every(source => source.url.includes(UPSTREAM_COMMIT)));
  assert.ok(SOURCES.every(source => /^[0-9a-f]{40}$/u.test(source.gitBlobSha1)));
  assert.equal(gitBlobSha1(Buffer.from('test\n','utf8')), '9daeafb9864cf43055ae93beb0afd6c7d144bfa4');
});

test('dictionary builder ranks candidates deterministically without neural inference', () => {
  const single = [
    '# fixture',
    '한:韓:나라 이름 한',
    '한:漢:한수 한',
    '국:國:나라 국',
    '국:菊:국화 국',
  ].join('\n');
  const ranks = parseSingleCharacterRanks(single);
  const words = [
    '# reading:hanja:gloss',
    '한국:漢國:glossed first candidate',
    '한국:韓菊:glossed second candidate',
    '한국:韓國:',
    '교육:敎育:교육',
    '한국어:韓國語:한국어',
  ].join('\n');
  const result = buildPreferredWordMap(words, ranks);
  assert.equal(result.get('한국'), '漢國', 'gloss-bearing candidates rank before glossless candidates; source order breaks score ties');
  assert.equal(result.get('교육'), '敎育');
  assert.equal(result.get('한국어'), '韓國語');
  assert.equal(buildPreferredWordMap(words, ranks).get('한국'), result.get('한국'));
});

test('generated browser module contains only a compact deterministic word map and source metadata', () => {
  const module = renderDictionaryModule(new Map([['경제','經濟'],['한국어','韓國語']]));
  assert.match(module, /export const HANJA_WORD_MAP/u);
  assert.match(module, /"경제":"經濟"/u);
  assert.match(module, /sourceCommit/u);
  assert.match(module, /wordReadingCount: 2/u);
  assert.doesNotMatch(module, /transformers|onnxruntime|fetch\(/iu);
});
