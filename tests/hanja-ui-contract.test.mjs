import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('../index.html');
const main = read('../src/main.js');
const hanja = read('../src/app/hanja.js');
const phonemic = read('../src/app/ipa_phonemic.js');
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
  assert.match(main, /import \{convertHangulToHanja, createHanjaConverter, createHanjaToHangulConverter\} from '\.\/app\/hanja\.js'/u);
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


test('service exposes separate surface-phonetic and orthography-derived phonemic IPA', () => {
  assert.match(html, /id="result-ipa"/u);
  assert.match(html, /id="result-ipa-phonemic"/u);
  assert.match(html, /data-copy="ipa-phonemic"/u);
  assert.match(main, /import \{renderPhonemicIpa\} from '\.\/app\/ipa_phonemic\.js'/u);
  assert.match(main, /renderPhonemicIpa\(value\)/u);
  assert.match(main, /key==='ipa-phonemic'\?ipaPhonemic/u);
  assert.match(phonemic, /clippyfirst-korean-phonemic-v1/u);
  assert.match(phonemic, /orthographic-baseline-not-morphology-resolved/u);
});


test('Hanja panel supports reverse reading with explicit ambiguity review and main-input handoff', () => {
  assert.match(html, /id="hanja-input"/u);
  assert.ok(html.indexOf('id="hanja-input"') < html.indexOf('id="results"'), 'Hanja input must remain available before any main result is generated');
  assert.match(html, /id="hanja-reading-output"/u);
  assert.match(html, /id="hanja-reading-status"/u);
  assert.match(html, /id="hanja-use-reading"/u);
  assert.match(main, /createHanjaToHangulConverter\(loadedHanjaWordMap\)/u);
  assert.match(main, /hanjaReverseNeedsManualResolution/u);
  assert.match(main, /stillContainsHanja/u);
  assert.match(main, /hanjaReadingOutput\.value!==hanjaReverseSuggestedText/u);
  assert.match(main, /input\.dispatchEvent\(new Event\('input'/u);
  assert.match(main, /key==='hanja-reading'\?hanjaReadingOutput/u);
  assert.match(main, /typeof source\.value==='string'\?source\.value:source\.textContent/u);
});
