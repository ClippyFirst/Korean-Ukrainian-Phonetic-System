import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

const rootGuide = read('AGENTS.md');
const workflowGuide = read('docs/AGENT-WORKFLOWS.md');
const docsIndex = read('docs/README.md');
const structureGuide = read('docs/REPOSITORY-STRUCTURE.md');
const researchIndex = read('research/README.md');

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
    ['docs/REPOSITORY-STRUCTURE.md', structureGuide],
    ['research/README.md', researchIndex],
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


test('current documentation navigation exposes the four-source audit and 236-case decision record', () => {
  const rootReadme = read('README.md');
  const audit = read('docs/ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md');
  const repositoryAudit = read('docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md');
  const integration = read('docs/KOZAK-KIM-236-ENGINE-INTEGRATION-2026-11-06.md');
  for (const phrase of [
    'ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md',
    'KOZAK-KIM-236-ENGINE-INTEGRATION-2026-11-06.md',
    'REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md',
  ]) {
    assert.ok(rootReadme.includes(phrase), 'README missing current document: ' + phrase);
    assert.ok(docsIndex.includes(phrase), 'docs index missing current document: ' + phrase);
  }
  assert.ok(audit.includes('16671491f6679ad9378f52604d3bc2415b4120c7'));
  assert.ok(audit.includes('22f0b463e7a5e579904dd6211a520321035526f7'));
  assert.ok(audit.includes('4ae2317ddb22b046e26455e4f9c9b3aaaf62212d'));
  assert.ok(audit.includes('96608e078b2d5ea607c5c3b8b5a54d1c1fba6846'));
  assert.ok(repositoryAudit.includes('236 occurrence rows'));
  assert.ok(integration.includes('15 occurrences integrated or already implemented'));
});

test('current repository documentation records exact benchmark, rights and research boundaries', () => {
  const rootReadme = read('README.md');
  const repositoryAudit = read('docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md');
  const acceptance = read('research/ACCEPTANCE-GATES.md');
  for (const phrase of [
    'research prototype, not independently research-certified or release-ready',
    '42226435101',
    '42226435403',
  ]) assert.ok(rootReadme.includes(phrase), 'README missing current status evidence: ' + phrase);
  assert.ok(repositoryAudit.includes('bb972871a207b1f703503ade980a36cf3b976085'), 'repository audit missing the merge commit');
  for (const phrase of [
    '15 exact standard-form runtime dispositions',
    '181 profile-convention cases',
    '12 abstentions + 28 unadjudicated',
    'independent Ukrainian target review',
  ]) assert.ok(repositoryAudit.toLowerCase().includes(phrase.toLowerCase()), 'repository audit missing current disposition: ' + phrase);
  assert.ok(acceptance.includes('42226435101'), 'acceptance gates missing the mandatory multi-engine result');
  assert.ok(acceptance.includes('SKIPPED'), 'acceptance gates must distinguish skipped optional jobs');
});


test('owner-selected mainline policy and third-party rights documents remain discoverable', () => {
  for (const phrase of [
    'owner designates `main`',
    'do not create task-specific branches',
    'Preserve historical branches',
  ]) assert.ok(rootGuide.includes(phrase), 'root guide missing owner-selected mainline policy: ' + phrase);
  assert.ok(workflowGuide.includes('owner has designated `main`'));
  assert.ok(docsIndex.includes('KOZAK-236-SOURCE-RIGHTS-AUDIT-2026-11-06.md'));
  assert.ok(docsIndex.includes('../licenses/README.md'));
  assert.ok(structureGuide.includes('`licenses/`'));
  assert.ok(read('README.md').includes('licenses/README.md'));
  assert.ok(existsSync(new URL('../licenses/Apache-2.0.txt', import.meta.url)));
  assert.ok(existsSync(new URL('../licenses/UGTPHON-KO-SOURCE-NOTICE.md', import.meta.url)));
  assert.ok(existsSync(new URL('../docs/KOZAK-236-INDEPENDENT-REVIEW.md', import.meta.url)));
});


test('2026-11-09 documentation checkpoint records current main, PR divergence and exact benchmark blockers', () => {
  const rootReadme = read('README.md');
  const docsIndex = read('docs/README.md');
  const structureGuide = read('docs/REPOSITORY-STRUCTURE.md');
  const audit = read('docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md');
  const handoff = read('docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md');
  for (const [label, content] of [
    ['README', rootReadme],
    ['docs index', docsIndex],
    ['structure guide', structureGuide],
    ['audit', audit],
    ['handoff', handoff],
  ]) {
    assert.ok(content.includes('45a02a62ce955c3db10eb0faaaa1ce8d9f2c9cdb'), label + ' missing audited main SHA');
    assert.ok(content.includes('42665749678'), label + ' missing failed exact-head matrix evidence');
    assert.ok(content.includes('167c12a7e9945dc757a57ea734e9745aa69032f3'), label + ' missing benchmark PR head');
  }
  assert.ok(audit.includes('91 commits ahead and 24 behind'));
  assert.ok(audit.includes('kijɐk'));
  assert.ok(audit.includes('two-character delimiter'));
  assert.ok(docsIndex.includes('REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md#current-continuation--2026-11-09-documentation-and-pr-reconciliation'));
});


test('post-merge documentation closeout records the merged mainline commit and verified PR evidence', () => {
  const rootReadme = read('README.md');
  const docsIndex = read('docs/README.md');
  const structureGuide = read('docs/REPOSITORY-STRUCTURE.md');
  const audit = read('docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md');
  const handoff = read('docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md');
  for (const [label, content] of [
    ['README', rootReadme], ['docs index', docsIndex], ['structure guide', structureGuide],
    ['audit', audit], ['handoff', handoff],
  ]) {
    assert.ok(content.includes('d2699911dbc70ef9978e5af06643b1281725a71a'), label + ' missing merged main SHA');
    
  }
  assert.ok(audit.includes('42678483929'), 'audit missing exact PR-head test evidence');
  assert.ok(audit.includes('Documentation navigation and status reconciliation | DONE_VERIFIED'));
  assert.ok(handoff.includes('Documentation/navigation update | DONE_VERIFIED'));
});


test('post-merge mainline verification is recorded separately from PR-head verification', () => {
  const audit = read('docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md');
  const handoff = read('docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md');
  for (const [label, content] of [['audit', audit], ['handoff', handoff]]) {
    assert.ok(content.includes('5c12f92c36ecae455dc4281dd7a8c0217f5dc4dc'), label + ' missing post-merge main SHA');
    assert.ok(content.includes('42679091977'), label + ' missing Pages live-smoke result');
    assert.ok(content.includes('42679091769'), label + ' missing main test matrix result');
  }
});
