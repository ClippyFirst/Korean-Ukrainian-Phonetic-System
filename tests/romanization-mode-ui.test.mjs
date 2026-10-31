import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('RR mode is an explicit third user-selectable output mode', () => {
  assert.match(html, /id="mode-romanization"[^>]*value="romanization"/u);
  assert.match(html, /Транслітерація за романізацією RR/u);
});

test('RR output uses its own adapter and typed RR trace rather than the IPA target trace', () => {
  assert.match(app, /createRomanizationTarget\(rrUkrainianCsv,rrUkrainianContextRulesCsv\)/u);
  assert.match(app, /transcribeRevisedToUkrainian\(r\.surfaceHangul\)/u);
  assert.match(app, /ipaTracePanel\.hidden=romanizationMode/u);
  assert.match(app, /rrTracePanel\.hidden=!romanizationMode/u);
  assert.match(html, /id="rr-trace-panel"/u);
  assert.match(html, /id="ipa-trace-panel"/u);
});

test('RR output remains explicitly provisional and does not relabel the IPA-first path', () => {
  assert.match(app, /Revised Romanization → українська · окрема попередня таблиця/u);
  assert.match(app, /currentOutputMethod=romanizationMode\?'rr':'ipa'/u);
  assert.match(html, /Це не фонетичний IPA-режим/u);
});

test('RR trace displays the syllable context and selected phonetic rule', () => {
  assert.match(app, /entry\.wordPosition\+' · '\+entry\.leftContext\+' · '\+entry\.onsetContext\+' · '\+entry\.sentencePosition/u);
  assert.match(app, /entry\.phonologicalFeature/u);
  assert.match(app, /Одиниця RR і контекст/u);
});

test('RR trace exposes an alternate target where lenis voicing is variable', () => {
  assert.match(app, /entry\.alternativeUkrainian\?entry\.ukrainian\+' \(альт\. '\+entry\.alternativeUkrainian\)/u);
});
