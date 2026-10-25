import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const workflow = readFileSync(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8');
const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const system = readFileSync(new URL('../system.html', import.meta.url), 'utf8');
const browserSmoke = readFileSync(new URL('../scripts/smoke-live-pages-browser.mjs', import.meta.url), 'utf8');

function firstIndexSmokeAssertion(source) {
  const match = source.match(/grep -Fq '([^']+)' "\$index_file"/u);
  assert.ok(match, 'Pages workflow must retain an index HTML smoke assertion');
  return match[1];
}

test('Pages smoke assertion stays synchronized with the practical-mode UI contract', () => {
  const expected = firstIndexSmokeAssertion(workflow);
  assert.ok(index.includes(expected), 'workflow smoke phrase must occur in source index.html');
  assert.ok(!index.includes('Практичний режим точно відтворює вихід JavaScript-порту g2pK без словникових виправлень'), 'obsolete smoke phrase must not be reintroduced');
});

test('Pages smoke contracts cover the mode selector and system-page title', () => {
  assert.match(workflow, /grep -Fq 'id="mode-practical"' "\$index_file"/u);
  assert.ok(index.includes('id="mode-practical"'), 'practical mode selector must exist in index.html');
  assert.match(workflow, /grep -Fq '<title>Система \/ 한국어 → УКРАЇНСЬКА<\/title>' "\$system_file"/u);
  assert.ok(system.includes('<title>Система / 한국어 → УКРАЇНСЬКА</title>'), 'system-page title must match smoke assertion');
});

test('live browser smoke accepts only a visible, explicitly labelled provisional candidate', () => {
  assert.match(browserSmoke, /#candidate-panel/u);
  assert.match(browserSmoke, /#candidate-value/u);
  assert.match(browserSmoke, /Попередній український кандидат/u);
  assert.match(browserSmoke, /попередній кандидат, не підтверджений результат/u);
  assert.match(browserSmoke, /provisional output must not leave the Ukrainian\/candidate panel empty/u);
  assert.match(browserSmoke, /ukrainian\.length > 20 \|\| candidateVisible/u);
});

