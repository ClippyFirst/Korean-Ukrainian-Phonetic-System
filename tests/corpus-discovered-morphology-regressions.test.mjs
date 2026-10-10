import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('corpus-discovered high-frequency morphology has sourced and regression-locked readings', () => {
  const expected = {
    읽기: ['일끼','іл|кі','il|k͈i'],
    읽어요: ['일거요','іл|ґо|йо','il|ɡʌ|jo'],
    많이: ['마니','ма|ні','maː|ni'],
    밝게: ['발께','пал|ке','pal|k͈e'],
    늙게: ['늘께','нил|ке','nɯl|k͈e'],
    늙고: ['늘꼬','нил|ко','nɯl|k͈o'],
    밝아: ['발가','пал|ґа','pal|ɡa'],
    좋아: ['조아','чо|а','tɕo|a'],
    좋은: ['조은','чо|ин','tɕo|ɯn'],
    놓으면: ['노으면','но|и|мйон','no|ɯ|mjʌn'],
    밟아: ['발바','пал|ба','pal|ba'],
    밟아서: ['발바서','пал|ба|со','pal|ba|sʌ'],
    없어요: ['업써요','оп|со|йо','ʌp̚|s͈ʌ|jo'],
    넓어져: ['널버져','нол|бо|джйо','nʌl|bʌ|dʑjʌ'],
    붙이다: ['부치다','пу|чі|да','pu|tɕʰi|da'],
    낱낱이: ['난나치','нан|на|чі','nanː|na|tɕʰi']
  };
  const rows = parseCsv(lexical);
  for (const [word, [surface, target, ipa]] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word + ': lexical entry exists');
    assert.match(entry.source_url, /^https:\/\/(?:(?:www\.|m\.)?korean\.go\.kr)\//u, word + ': official NIKL source');
    assert.equal(entry.target_status, 'provisional', word + ': Ukrainian target remains provisional');
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word + ': standard surface form');
    assert.equal(result.ukrainian, target, word + ': Ukrainian approximation');
    assert.equal(result.ipa, ipa, word + ': IPA');
    assert.equal(result.status, 'lexical-review', word + ': target review status');
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word + ': lexical evidence used');
    assert.ok(!result.ukrainian.includes('⟦'), word + ': no unresolved placeholder');
  }
});
