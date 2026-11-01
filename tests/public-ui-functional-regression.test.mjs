import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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


test('a generated adversarial Korean quick example is available in the public input controls', () => {
  assert.match(html, /data-example="값이 바뀌었다고 해서 넋이 나간 사람처럼 굴면 안 된다\./u);
  assert.match(html, /Каверзний текст · 받침 \/ ㅢ/u);
});


test('primary Ukrainian output uses the owner-approved transliteration terminology', () => {
  assert.match(html, /Українська транслітерація/u);
  assert.doesNotMatch(html, /Українська транскрипція/u);
});


test('surface IPA identifies the selected pronunciation engine and research mode', () => {
  assert.match(html, /id="ipa-engine-status"/u);
  assert.match(main, /Джерело поверхневої IPA: g2pK JavaScript port/u);
  assert.match(main, /детермінований рушій Козака Кіма/u);
});
