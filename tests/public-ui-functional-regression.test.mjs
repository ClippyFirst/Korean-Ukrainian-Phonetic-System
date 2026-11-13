import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripUncertaintyBrackets } from '../src/app/super_soft_annotation.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('every DOM id queried during app startup exists in the shipped HTML', () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1]));
  const queried = new Set([...main.matchAll(/document\.querySelector\(['"]#([^'"]+)['"]\)/gu)].map((match) => match[1]));
  assert.ok(queried.size > 0, 'expected app startup to query DOM controls');
  const missing = [...queried].filter((id) => !ids.has(id));
  assert.deepEqual(missing, [], 'missing DOM elements would abort app startup');
});

test('public app has the conversion input, output cards, and working action controls', () => {
  for (const id of ['source-input', 'result-ukrainian', 'result-ipa', 'result-analysis', 'clear-button', 'example-button', 'live-region']) {
    assert.ok(html.includes(`id="${id}"`), 'missing required app element: ' + id);
  }
  assert.match(main, /input\.addEventListener\('input',render\)/u);
  assert.match(main, /document\.querySelector\('#clear-button'\)\.addEventListener/u);
  assert.match(main, /document\.querySelector\('#example-button'\)\.addEventListener/u);
});

test('quick examples and clipboard actions have matching public controls', () => {
  assert.match(html, /data-example="현대 한국어의 표준 발음"/u);
  assert.match(html, /data-example="값이"/u);
  assert.match(html, /data-copy="ukrainian"/u);
  assert.match(html, /data-copy="ipa"/u);
  assert.match(html, /data-copy="analysis"/u);
});

test('uncertainty cleanup removes only square-bracket markers and keeps their text', () => {
  assert.equal(stripUncertaintyBrackets('га[н]уль'), 'гануль');
  assert.equal(stripUncertaintyBrackets('[а][б] в [г]'), 'аб в г');
  assert.equal(stripUncertaintyBrackets('а (б) {в}'), 'а (б) {в}');
  assert.equal(stripUncertaintyBrackets('без сумнівів'), 'без сумнівів');
});

test('uncertain candidate offers a separate copy-without-brackets action', () => {
  assert.match(html, /id="ukrainian-clean-copy-button"[^>]*data-copy="ukrainian-clean"/u);
  assert.match(html, /Копіювати без дужок/u);
  assert.match(main, /stripUncertaintyBrackets/);
  assert.match(main, /ukrainianCleanCopyButton\.hidden=/u);
});
