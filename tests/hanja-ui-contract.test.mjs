import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('../index.html');
const main = read('../src/main.js');
const hanja = read('../src/app/hanja.js');
const packageJson = JSON.parse(read('../package.json'));

test('Hanja is an additional output in the requested order with an accessible copy control', () => {
  assert.match(html, /id="panel-hanja"[^>]*data-result-panel="hanja"/u);
  assert.match(html, /id="result-hanja"[^>]*lang="ko"/u);
  assert.match(html, /id="hanja-engine-status"[^>]*role="status"/u);
  assert.match(html, /data-copy="hanja"/u);
  assert.match(html, /Не всі корейські слова мають ханча; невідомі слова та граматичні частки залишаються хангилем/u);
  const outputOrder = ['panel-ukrainian', 'panel-romanization', 'panel-hanja', 'panel-ipa'];
  const outputPositions = outputOrder.map((id) => html.indexOf(`id="${id}"`));
  assert.ok(outputPositions.every((position) => position >= 0), 'all primary outputs exist');
  assert.deepEqual(outputPositions, [...outputPositions].sort((a, b) => a - b), 'outputs remain Ukrainian → Romanization → Hanja → IPA');
  assert.match(main, /import \{convertHangulToHanja, createHanjaConverter\} from '\.\/app\/hanja\.js'/u);
  assert.match(main, /renderHanja\(value\)/u);
  assert.match(main, /import\.meta\.glob\('\.\/app\/hanja-dictionary\/hanja-dictionary-\*\.js'\)/u);
  assert.match(main, /hanjaOutput\.textContent=\(fullHanjaConverter\|\|convertHangulToHanja\)\(value\)/u);
  assert.match(main, /createHanjaConverter\(loadedHanjaWordMap\)/u);
  assert.match(main, /hanjaDictionaryChunks\[filename\]/u);
  assert.match(main, /key==='hanja'\?hanjaOutput/u);
  assert.equal(packageJson.scripts.prebuild, 'node scripts/prepare-hanja-dictionary.mjs');
  assert.equal(packageJson.scripts.predev, 'node scripts/prepare-hanja-dictionary.mjs');
});

test('Hanja conversion is deterministic and has no external runtime network path', () => {
  assert.doesNotMatch(hanja, /fetch\(|XMLHttpRequest|WebSocket|onnxruntime|transformers/u);
  assert.doesNotMatch(main, /fetch\(|XMLHttpRequest|WebSocket/u);
  assert.match(html, /connect-src 'none'/u);
  assert.match(main, /const ipa=document\.querySelector\('#result-ipa'\)/u);
  assert.match(main, /const romanization=document\.querySelector\('#result-romanization'\)/u);
  assert.match(main, /createHanjaConverter\(loadedHanjaWordMap\)/u);
});
