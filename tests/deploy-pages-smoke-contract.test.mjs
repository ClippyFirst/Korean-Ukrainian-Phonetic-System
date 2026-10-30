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

test('live browser smoke selects the ordinary-mode disclosure without ambiguous matches', () => {\n  assert.match(browserSmoke, /\\.mode-disclosure'\\)\\.filter\\(\\{ hasText: 'Як працює звичайний режим' \\}\\)/u);\n  assert.match(browserSmoke, /ordinary-mode disclosure must be selected unambiguously/u);\n  assert.doesNotMatch(browserSmoke, /page\\.locator\\('\\.mode-disclosure'\\);/u);\n});\n\ntest('live browser smoke verifies inline research candidate and neutral confirmed-result option', () => {
  assert.match(browserSmoke, /#ua-unconfirmed-button/u);
  assert.match(browserSmoke, /g2pK ·/u, 'live smoke must check the current ordinary-mode engine label');
  assert.match(browserSmoke, /#ua-candidate-button/u);
  assert.match(browserSmoke, /#candidate-value/u);
  assert.match(browserSmoke, /#candidate-note/u);
  assert.match(browserSmoke, /Немає підтвердженого запису/u);
  assert.match(browserSmoke, /Достовірний варіант недоступний/u);
  assert.match(browserSmoke, /Дослідницький результат/u);
  assert.match(browserSmoke, /#ukrainian-copy-button/u);
  assert.match(browserSmoke, /Показано попередній кандидат, не підтверджений результат/u);
  assert.match(browserSmoke, /research option must show the candidate in the main Ukrainian field/u);
  assert.match(browserSmoke, /obsolete standalone candidate panel must not exist/u);
  assert.doesNotMatch(browserSmoke, /#candidate-copy-button|Запис не підтверджено|outputLabel === 'Український запис'/u);
});


test('technical engine provenance is kept on the researcher-facing methodology page', () => {
  assert.doesNotMatch(index, /JavaScript-порту g2pK/u);
  assert.match(index, /href="\.\/system\.html">«Методологія»/u);
  assert.match(system, /JavaScript-порту g2pK/u);
  assert.match(browserSmoke, /technical engine provenance must remain available on the researcher-facing methodology page/u);
});
