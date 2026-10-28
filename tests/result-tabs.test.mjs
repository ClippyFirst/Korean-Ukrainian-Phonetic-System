import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');

test('result views expose one accessible tab per output type', () => {
  const tabs = [...html.matchAll(/data-result-tab="([^"]+)"/g)].map((match) => match[1]);
  const panels = [...html.matchAll(/data-result-panel="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(tabs, ['ukrainian', 'ipa', 'romanization', 'analysis']);
  assert.deepEqual(panels, tabs);
  assert.match(html, /role="tablist" aria-label="Тип результату"/);
  assert.match(html, /role="tabpanel" aria-labelledby="tab-ukrainian"/);
  assert.match(html, /aria-selected="true" aria-controls="panel-ukrainian" tabindex="0"/);
  assert.match(html, /data-result-panel="ipa" hidden/);
  assert.match(html, /data-result-panel="romanization" hidden/);
  assert.match(html, /data-result-panel="analysis" hidden/);
});

test('result tabs support selection, roving focus and arrow/home/end keyboard navigation', () => {
  assert.match(script, /function activateResultTab\(name,moveFocus=false\)/);
  assert.match(script, /tab\.setAttribute\('aria-selected',String\(active\)\)/);
  assert.match(script, /panel\.hidden=panel\.dataset\.resultPanel!==name/);
  assert.match(script, /event\.key==='ArrowRight'/);
  assert.match(script, /event\.key==='ArrowLeft'/);
  assert.match(script, /event\.key==='Home'/);
  assert.match(script, /event\.key==='End'/);
  assert.match(script, /activateResultTab\('ukrainian'\)/);
});

test('compact result panels expand to the available width and remain visible on mobile', () => {
  assert.match(css, /\.result-grid\[data-active-result\] \{ grid-template-columns:minmax\(0,1fr\); \}/);
  assert.match(css, /\.result-grid>\.result-card\[hidden\] \{ display:none; \}/);
  assert.match(css, /@media \(max-width:520px\)[\s\S]*\.result-tabs \{ display:grid; grid-template-columns:1fr 1fr; \}/);
  assert.match(css, /\.result-tab:focus-visible/);
});
