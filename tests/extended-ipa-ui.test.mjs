import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');

test('Extended IPA is opt-in inside Kozak Kim research mode and has separate output layers', () => {
  assert.match(html, /id="extended-ipa-enabled"/);
  assert.match(html, /id="panel-extended-ipa"[^>]*hidden/);
  assert.match(html, /id="extended-ipa-phonemic"/);
  assert.match(html, /id="extended-ipa-broad"/);
  assert.match(html, /id="extended-ipa-narrow"/);
  assert.match(html, /id="extended-ipa-context"/);
  assert.match(main, /extendedIpaToggle\.addEventListener\('change',render\)/);
  assert.match(main, /renderExtendedIpa\(value,r,useG2p\)/);
});

test('Extended IPA responsive layout stacks layers on narrow screens', () => {
  assert.match(css, /\.extended-ipa-layers\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css, /@media\(max-width:760px\)\{\.extended-ipa-layers\{grid-template-columns:1fr\}\}/);
});
