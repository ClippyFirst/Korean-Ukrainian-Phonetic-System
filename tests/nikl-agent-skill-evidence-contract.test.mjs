import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const evidence = readFileSync(new URL('../.agents/skills/nikl-evidence-audit/SKILL.md', import.meta.url), 'utf8');
const coverage = readFileSync(new URL('../.agents/skills/nikl-rule-coverage/SKILL.md', import.meta.url), 'utf8');
const catalog = readFileSync(new URL('../docs/AGENT-SKILLS-NIKL.md', import.meta.url), 'utf8');

test('NIKL evidence skill distinguishes direct, partial, contextual, and rule-derived claims', () => {
  for (const label of [
    'DIRECT_OFFICIAL_ATTESTATION',
    'DIRECT_OFFICIAL_RULE_EXAMPLE',
    'OFFICIAL_RULE_DERIVATION',
    'PARTIAL_LEMMA_APPLICATION_SUPPORT',
    'CONTEXTUAL_EXAMPLE_ONLY',
    'HYPOTHESIS_UNRESOLVED',
  ]) assert.ok(evidence.includes(label), 'missing evidence class ' + label);
  assert.match(evidence, /page can contain more than one evidence class/u);
  assert.match(evidence, /ordinary example spelling/u);
});

test('NIKL coverage skill prevents rule-instrument and quoted-example conflation', () => {
  assert.match(coverage, /case-specific official answer/u);
  assert.match(coverage, /quoted official-rule example/u);
  assert.match(coverage, /ordinary example spelling/u);
  assert.match(coverage, /same article numbers do not mean the source cited the same rule set/iu);
  assert.match(evidence, /한글맞춤법/u);
  assert.match(evidence, /표준 발음법/u);
});

test('skill catalog records the current verified inventory without stale test counts', () => {
  assert.match(catalog, /18\/60/u);
  assert.match(catalog, /42 remain citation-only\/unreviewed/u);
  assert.match(catalog, /1,123\/1,123 Node tests/u);
  assert.doesNotMatch(catalog, /1,099\/1,099/);
  assert.doesNotMatch(catalog, /154284febf08ef33c7483511fc65934441f7cfb2/);
});
