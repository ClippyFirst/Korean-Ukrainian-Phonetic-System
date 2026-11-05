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

test('workflow guide points to the canonical research and execution records', () => {
  for (const path of [
    '../research/MASTER-DIRECTIVE.md',
    '../research/ACCEPTANCE-GATES.md',
    '../research/DECISION-LOG.md',
    'MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md',
  ]) assert.ok(workflowGuide.includes(path), 'missing canonical pointer: ' + path);
});
