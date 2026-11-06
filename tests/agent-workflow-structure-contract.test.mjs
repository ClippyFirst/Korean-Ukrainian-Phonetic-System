import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

const rootGuide = read('AGENTS.md');
const workflowGuide = read('docs/AGENT-WORKFLOWS.md');
const docsIndex = read('docs/README.md');

const skills = [
  '.agents/skills/engineering-change/SKILL.md',
  '.agents/skills/repository-audit/SKILL.md',
  '.agents/skills/change-review/SKILL.md',
];

test('root agent guide routes all general and domain-specific work to maintained skills', () => {
  for (const path of skills) {
    assert.ok(existsSync(new URL('../' + path, import.meta.url)), 'missing skill: ' + path);
    assert.ok(rootGuide.includes(path), 'root AGENTS.md does not route to ' + path);
  }
  for (const path of [
    '.agents/skills/phonetic-engineering/SKILL.md',
    '.agents/skills/nikl-evidence-audit/SKILL.md',
    '.agents/skills/nikl-rule-coverage/SKILL.md',
    '.agents/skills/nikl-norm-crawler/SKILL.md',
  ]) assert.ok(rootGuide.includes(path), 'missing specialized skill route: ' + path);
});

test('agent workflow guide preserves canonical records and project transformation boundaries', () => {
  for (const phrase of [
    'DONE_VERIFIED',
    'PARTIAL',
    'TODO',
    'BLOCKED',
    'DEFERRED',
    'Korean source orthography',
    'IPA',
    'Ukrainian target adaptation',
    'one canonical register',
    'No wholesale copy of upstream skills',
    'No Ponytail benchmark savings',
  ]) assert.ok(workflowGuide.includes(phrase), 'missing workflow safeguard: ' + phrase);
});

test('documentation navigation exposes the workflow guide and root agent instructions', () => {
  assert.match(docsIndex, /AGENT-WORKFLOWS\.md/u);
  assert.match(docsIndex, /\.\.\/AGENTS\.md/u);
  assert.match(read('README.md'), /AGENT-WORKFLOWS\.md/u);
  assert.match(read('README.md'), /AGENTS\.md/u);
});

test('new agent documentation uses valid local Markdown links', () => {
  const pages = [
    ['AGENTS.md', rootGuide],
    ['docs/AGENT-WORKFLOWS.md', workflowGuide],
    ['docs/README.md', docsIndex],
  ];
  for (const [source, content] of pages) {
    for (const [, href] of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/gu)) {
      if (/^(?:https?:|mailto:|#)/u.test(href)) continue;
      const local = decodeURIComponent(href.split('#', 1)[0]);
      if (!local) continue;
      const sourceDir = source.includes('/') ? source.slice(0, source.lastIndexOf('/') + 1) : '';
      assert.ok(
        existsSync(new URL('../' + sourceDir + local, import.meta.url)),
        source + ' has a broken local link: ' + href,
      );
    }
  }
});

test('Unlazy is adopted as a gate/evidence discipline without importing its execution machinery', () => {
  for (const phrase of [
    '16671491f6679ad9378f52604d3bc2415b4120c7',
    'definition-bound evidence',
    'stale/cancelled/skipped evidence as non-passing',
    'Do not import',
    'not sandboxing',
    'No unlazy code, skill text, hook or dependency is copied',
  ]) assert.ok(workflowGuide.includes(phrase), 'missing Unlazy boundary: ' + phrase);
});

test('workflow guide points to the canonical research and execution records', () => {
  for (const path of [
    '../research/MASTER-DIRECTIVE.md',
    '../research/ACCEPTANCE-GATES.md',
    '../research/DECISION-LOG.md',
    'MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md',
  ]) assert.ok(workflowGuide.includes(path), 'missing canonical pointer: ' + path);
});
