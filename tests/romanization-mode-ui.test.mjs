import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const browserSmoke = readFileSync(new URL('../scripts/smoke-live-pages-browser.mjs', import.meta.url), 'utf8');
const deployWorkflow = readFileSync(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8');

test('RR mode is an explicit third user-selectable output mode', () => {
  assert.match(html, /id="mode-romanization"[^>]*value="romanization"/u);
  assert.match(html, /Транслітерація за романізацією RR/u);
});

test('RR output uses its own adapter and typed RR trace rather than the IPA target trace', () => {
  assert.match(app, /createRomanizationTarget\(rrUkrainianCsv,rrUkrainianContextRulesCsv\)/u);
  assert.match(app, /transcribeRevisedToUkrainian\(r\.surfaceHangul,value\)/u);
  assert.match(app, /ipaTracePanel\.hidden=false/u);
  assert.match(app, /rrTracePanel\.hidden=false/u);
  assert.match(html, /id="rr-trace-panel"/u);
  assert.match(html, /id="ipa-trace-panel"/u);
});

test('RR output remains explicitly provisional and does not relabel the IPA-first path', () => {
  assert.match(app, /Revised Romanization → українська · окрема попередня таблиця/u);
  assert.match(app, /currentOutputMethod=romanizationMode\?'rr':'ipa'/u);
  assert.match(app, /currentOutputMethod==='rr'\?'Транслітерація за RR · попередня'/u);
  assert.match(html, /Це не фонетичний IPA-режим/u);
});

test('RR trace displays the syllable context and selected phonetic rule', () => {
  assert.match(app, /entry\.sentenceIndex\+1/u);
  assert.match(app, /entry\.sentenceWordIndex/u);
  assert.match(app, /entry\.syllableIndex\+1/u);
  assert.match(app, /entry\.wordPosition/u);
  assert.match(app, /entry\.rightContext/u);
  assert.match(app, /entry\.collisionGroup/u);
  assert.match(app, /entry\.onsetOrigin/u);
  assert.match(app, /entry\.alignmentStatus/u);
  assert.match(app, /entry\.sentencePosition/u);
  assert.match(app, /entry\.phonologicalFeature/u);
  assert.match(app, /entry\.mapping_id/u);
  assert.match(app, /entry\.notes/u);
  assert.match(app, /правило /u);
  assert.match(app, /Одиниця RR і контекст/u);
});

test('RR trace exposes an alternate target where lenis voicing is variable', () => {
  assert.match(app, /entry\.alternativeUkrainian\?/u);
  assert.match(app, /альт\./u);
});


test('both IPA-mediated and RR-mediated Ukrainian transliterations are visible for every input', () => {
  assert.match(html, /id="alternate-ukrainian-panel"/u);
  assert.match(html, /id="alternate-ukrainian-output"/u);
  assert.match(html, /id="alternate-ukrainian-label"/u);
  assert.match(app, /const alternateOutput=document\.querySelector\('#alternate-ukrainian-output'\)/u);
  assert.match(app, /const rrTarget=r\.surfaceHangul\?transcribeRevisedToUkrainian\(r\.surfaceHangul,value\):null/u);
  assert.match(app, /alternateOutput\.textContent=alternateText/u);
  assert.match(app, /ipaTracePanel\.hidden=false/u);
  assert.match(app, /rrTracePanel\.hidden=false/u);
});

test('both route traces remain independently inspectable regardless of the selected primary route', () => {
  assert.match(html, /id="ipa-trace-panel"/u);
  assert.match(html, /id="rr-trace-panel"/u);
  assert.match(app, /for\(const entry of \(rrTarget\?\.trace\|\|\[\]\)\)/u);
  assert.match(app, /for\(const t of r\.trace\)/u);
  assert.match(app, /alternateLabel\.textContent=alternateUsesIpa\?/u);
});


test('deployed browser smoke and Pages gate verify both Ukrainian routes', () => {
  assert.match(browserSmoke, /#alternate-ukrainian-output/u);
  assert.match(browserSmoke, /#mode-romanization/u);
  assert.match(browserSmoke, /Транслітерація за RR · попередня/u);
  assert.match(browserSmoke, /\.hanja-reverse-details summary/u);
  assert.match(browserSmoke, /#hanja-input/u);
  assert.match(browserSmoke, /#hanja-use-reading/u);
  assert.match(browserSmoke, /IPA-mediated Ukrainian output must remain populated/u);
  assert.match(browserSmoke, /RR-mediated Ukrainian transliteration must be visible/u);
  assert.match(deployWorkflow, /українську транслітерацію двома окремими маршрутами/u);
});
