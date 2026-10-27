import test from 'node:test';
import assert from 'node:assert/strict';
import { getSpellingSuggestions } from '../src/spelling-suggestions.js';

test('offers the probable standard spelling without silently rewriting the input', () => {
  const input = '쫒아내면';
  const suggestions = getSpellingSuggestions(input);
  assert.equal(suggestions.length, 1);
  assert.equal(suggestions[0].text, '쫓아내면');
  assert.equal(suggestions[0].sourceInput, input);
  assert.equal(suggestions[0].kind, 'candidate-only');
  assert.equal(suggestions[0].autoApplied, false);
});

test('offers 무서웠어 only as an explicit correction candidate', () => {
  const suggestions = getSpellingSuggestions('무서웟어');
  assert.deepEqual(suggestions.map(item => item.text), ['무서웠어']);
  assert.equal(suggestions[0].autoApplied, false);
});

test('keeps spelling and expressive-tail interpretations of 많앗구나유유유 separate', () => {
  const suggestions = getSpellingSuggestions('많앗구나유유유');
  assert.deepEqual(suggestions.map(item => item.text), [
    '많았구나유유유',
    '많았구나 ㅠㅠㅠ',
    '많앗구나 유유유'
  ]);
  assert.ok(suggestions.every(item => item.autoApplied === false));
  assert.ok(suggestions.every(item => item.kind === 'candidate-only'));
});

test('does not normalize unrecognized or contextually different input', () => {
  assert.equal(getSpellingSuggestions('칡칡이')[0].text, '칭칭이');
  assert.equal(getSpellingSuggestions('칡칡이')[0].autoApplied, false);
  assert.deepEqual(getSpellingSuggestions('삶의'), []);
  assert.deepEqual(getSpellingSuggestions('무서웟어!'), []);
  assert.deepEqual(getSpellingSuggestions(''), []);
});

test('normalizes Unicode canonically but preserves candidate-only behavior', () => {
  const suggestions = getSpellingSuggestions('쫒아내면'.normalize('NFD'));
  assert.equal(suggestions[0].text, '쫓아내면');
  assert.equal(suggestions[0].autoApplied, false);
});

test('treats inherited object-property names as unknown input instead of crashing', () => {
  assert.deepEqual(getSpellingSuggestions('constructor'), []);
  assert.deepEqual(getSpellingSuggestions('toString'), []);
});
