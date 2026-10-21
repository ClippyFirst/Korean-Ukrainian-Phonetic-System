import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const surface = JSON.parse(readFileSync(new URL('./fixtures/g2pk-surface-regression.json', import.meta.url), 'utf8'));
const queue = JSON.parse(readFileSync(new URL('../research/ipa-adjudication-queue.json', import.meta.url), 'utf8'));

test('IPA adjudication queue mirrors every surface case without inventing IPA gold', () => {
  assert.equal(queue.schemaVersion, 1);
  assert.equal(queue.cases.length, surface.cases.length);
  assert.equal(queue.cases.length, 20);
  assert.match(queue.purpose, /do not independently determine broad IPA/u);
  const byInput = new Map(surface.cases.map(item => [item.input, item]));
  const seen = new Set();
  for (const item of queue.cases) {
    assert.ok(!seen.has(item.input), item.input + ': duplicate adjudication case');
    seen.add(item.input);
    const source = byInput.get(item.input);
    assert.ok(source, item.input + ': missing surface-fixture source');
    assert.equal(item.normativeSurfaceComparator, source.normativeSurface, item.input);
    assert.equal(item.surfaceEvidenceStatus, source.normativeEvidenceStatus, item.input);
    assert.equal(item.surfaceEvidenceUrl, source.normativeSourceUrl, item.input);
    assert.equal(item.sourceLocator, source.normativeSourceLocator, item.input);
    assert.equal(item.candidateBroadIpa, null, item.input + ': do not fabricate IPA');
    assert.equal(item.syllableBoundaries, null, item.input + ': syllabification needs review');
    assert.equal(item.vowelLengthAssessment, null, item.input + ': length assessment needs review');
    assert.deepEqual(item.reviewerA, { id: null, ipa: null, notes: null }, item.input);
    assert.deepEqual(item.reviewerB, { id: null, ipa: null, notes: null }, item.input);
    assert.equal(item.reconciliation.status, 'BLOCKED_SPECIALIST_ADJUDICATION', item.input);
    assert.equal(item.reconciliation.finalIpa, null, item.input + ': unresolved cannot have final IPA');
    assert.equal(item.ukrainianTargetReview, 'SEPARATE_UNREVIEWED_TASK', item.input);
    assert.match(item.surfaceEvidenceUrl, /^https:\/\//u, item.input + ': exact source URL required');
  }
  assert.equal(seen.size, surface.cases.length);
});

test('the queue keeps rule-derived lexical evidence visibly separate from direct attestations', () => {
  const item = queue.cases.find(candidate => candidate.input === '숲이');
  assert.equal(item.surfaceEvidenceStatus, 'derived-from-NIKL-rule');
  assert.match(item.notes, /not a direct lexical attestation/u);
  assert.equal(item.reconciliation.status, 'BLOCKED_SPECIALIST_ADJUDICATION');
});

test('vowel length is explicitly queued for independent review rather than lost in Hangul surface notation', () => {
  const item = queue.cases.find(candidate => candidate.input === '밟는');
  assert.match(item.notes, /\[밤ː는\]/u);
  assert.equal(item.vowelLengthAssessment, null);
});
