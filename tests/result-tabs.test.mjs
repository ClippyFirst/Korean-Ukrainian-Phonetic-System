import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');

test('only Ukrainian status/candidate are selectable; IPA, romanization and analysis stay visible', () => {
  assert.match(html, /id="ua-unconfirmed-button"[^>]*>Не підтверджено</);
  assert.match(html, /id="ua-candidate-button"[^>]*>Дослідницький кандидат</);
  assert.doesNotMatch(html, /role="tablist"|data-result-tab=/);
  for (const panel of ['ipa','romanization','analysis']) {
    assert.match(html, new RegExp('id="panel-' + panel + '"[^>]*data-result-panel="' + panel + '"(?![^>]*hidden)'));
  }
  assert.match(html, /id="panel-ukrainian"[^>]*data-result-panel="ukrainian"/);
});

test('Ukrainian option buttons expose pressed state and candidate is unavailable when no candidate exists', () => {
  assert.match(html, /id="ua-unconfirmed-button"[^>]*aria-pressed="true"/);
  assert.match(html, /id="ua-candidate-button"[^>]*aria-pressed="false" disabled/);
  assert.match(script, /function selectUaView\(view\)/);
  assert.match(script, /uaUnconfirmedButton\.addEventListener\('click'/);
  assert.match(script, /uaCandidateButton\.addEventListener\('click'/);
  assert.match(script, /uaCandidateButton\.disabled=!hasCandidate/);
  assert.match(script, /candidatePanel\.hidden=\!\(hasCandidate&&selectedUaView==='candidate'\)/);
});

test('Ukrainian selector is keyboard-focusable and responsive without hiding other result cards', () => {
  assert.match(css, /\.ua-output-option:focus-visible/);
  assert.match(css, /\.result-grid > \.result-card\[hidden\] \{ display:none !important; \}/);
});
