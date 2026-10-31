import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const skill = readFileSync(new URL('../.agents/skills/phonetic-engineering/SKILL.md', import.meta.url), 'utf8');
const integration = readFileSync(new URL('../docs/AGENT-SKILL-INTEGRATION-2026-11-01.md', import.meta.url), 'utf8');

test('phonetic engineering skill preserves the IPA-first architecture and side-layer boundaries', () => {
  for (const phrase of [
    'structural and (where supported) morphological analysis',
    'Korean surface phonology',
    'IPA or a typed unresolved/partial result',
    'Ukrainian target adaptation',
    'RR-to-Ukrainian rendering',
    'Hanja annotation',
  ]) assert.ok(skill.includes(phrase), 'missing architecture safeguard: ' + phrase);
});

test('adversarial test guidance requires balanced controls and whole-sentence coverage', () => {
  for (const phrase of [
    'canonical positive',
    'minimal or near-minimal contrast',
    'negative control',
    'interacting rules where order matters',
    'morphology-sensitive contrast',
    'phrase-boundary contrast',
    'long natural sentence',
    'mixed-input case',
    'uncertainty case',
    'Generated or hand-authored stress passages',
    'complete input consumption and output-span alignment',
    'no dropped, duplicated, or reordered source characters',
  ]) assert.ok(skill.includes(phrase), 'missing adversarial acceptance criterion: ' + phrase);
  assert.match(skill, /not official examples, corpus gold, or expert adjudication/u);
  assert.match(skill, /Never invent an expected output/u);
});

test('engine selection is multi-metric, paired, reproducible, and legally gated', () => {
  for (const phrase of [
    'exact-match rate and denominator',
    'character error rate',
    'phoneme error rate',
    'coverage, abstentions, and failures separately',
    'per-case paired wins/losses',
    'p50/p95 latency',
    'training-data overlap',
    'lawfully or reproducibly ship',
  ]) assert.ok(skill.includes(phrase), 'missing benchmark safeguard: ' + phrase);
});

test('upstream skills are pinned and selectively integrated without copying', () => {
  for (const phrase of [
    '2ce8aa15d05bd57213e6f746f953aafb7ded7a8b',
    '4ae2317ddb22b046e26455e4f9c9b3aaaf62212d',
    '96608e078b2d5ea607c5c3b8b5a54d1c1fba6846',
    'No upstream skill text or code is copied',
    'Ponytail\'s gain/scoreboard skill is excluded',
  ]) assert.ok(integration.includes(phrase), 'missing upstream provenance/selection detail: ' + phrase);
});
