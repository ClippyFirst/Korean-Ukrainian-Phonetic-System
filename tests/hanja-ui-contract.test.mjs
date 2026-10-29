import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('../index.html');
const main = read('../src/main.js');
const hanja = read('../src/app/hanja.js');

test('Hanja is an additional output and has an accessible copy control', () => {
  assert.match(html, /id="panel-hanja"[^>]*data-result-panel="hanja"/u);
  assert.match(html, /id="result-hanja"[^>]*lang="ko"/u);
  assert.match(html, /data-copy="hanja"/u);
  const outputOrder = ['panel-romanization', 'panel-ipa', 'panel-ukrainian', 'panel-hanja'];
  const outputPositions = outputOrder.map((id) => html.indexOf(`id="${id}"`));
  assert.ok(outputPositions.every((position) => position >= 0), 'all primary outputs exist');
  assert.deepEqual(outputPositions, [...outputPositions].sort((a, b) => a - b), 'outputs remain Romanization → IPA → Ukrainian → Hanja');
  assert.match(main, /import \{convertHangulToHanja\} from '\.\/app\/hanja\.js'/u);
  assert.match(main, /hanjaOutput\.textContent=convertHangulToHanja\(value\)/u);
  assert.match(main, /key==='hanja'\?hanjaOutput/u);
});

test('Hanja annotator is deterministic, local-only, and separate from phonetic conversion', () => {
  assert.doesNotMatch(hanja, /fetch\(|XMLHttpRequest|WebSocket|onnxruntime|transformers/u);
  assert.match(html, /connect-src 'none'/u);
  assert.match(main, /const ipa=document\.querySelector\('#result-ipa'\)/u);
  assert.match(main, /const romanization=document\.querySelector\('#result-romanization'\)/u);
  assert.match(main, /convertHangulToHanja\(value\)/u);
});
