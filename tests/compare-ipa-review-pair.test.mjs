import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildReviewerPacket } from '../scripts/build-ipa-review-packet.mjs';
import { compareReviewerPair } from '../scripts/compare-ipa-review-pair.mjs';

const queueText = readFileSync(new URL('../research/ipa-adjudication-queue.json', import.meta.url), 'utf8');

function packet(slot, reviewer, ipaFor) {
  const value = buildReviewerPacket(queueText, slot);
  value.cases = value.cases.map((item, index) => ({
    ...item,
    reviewForm: {
      ...item.reviewForm,
      reviewerId: reviewer,
      qualification: 'Declared Korean phonetics qualification; verify independently',
      reviewedAt: '2026-10-27T12:00:00Z',
      methodReference: 'Test fixture only; broad IPA protocol v1',
      broadIpa: ipaFor(index),
      syllableBoundaries: 'syllable.boundaries.' + index,
      vowelLengthAssessment: 'uncertain',
      notes: 'Synthetic test data, not linguistic evidence.',
    },
  }));
  return JSON.stringify(value);
}

test('pair comparison flags literal disagreements without choosing a winner', () => {
  const a = packet('A', 'reviewer-a', i => 'ipa-' + i);
  const b = packet('B', 'reviewer-b', i => i === 3 ? 'different-ipa' : 'ipa-' + i);
  const report = compareReviewerPair(a, b, queueText);
  assert.equal(report.valid, true, report.errors.join('\n'));
  assert.equal(report.adjudicationStatus, 'DISAGREEMENT_REQUIRES_ADJUDICATION');
  assert.equal(report.disagreementCount, 1);
  assert.equal(report.cases[3].status, 'DISAGREEMENT_REQUIRES_ADJUDICATION');
  assert.equal(report.cases[3].ipaAgreement, false);
  assert.match(report.notice, /does not adjudicate IPA correctness/u);
});

test('pair comparison never treats full agreement as IPA gold', () => {
  const a = packet('A', 'reviewer-a', i => 'ipa-' + i);
  const b = packet('B', 'reviewer-b', i => 'ipa-' + i);
  const report = compareReviewerPair(a, b, queueText);
  assert.equal(report.valid, true, report.errors.join('\n'));
  assert.equal(report.adjudicationStatus, 'AGREEMENT_PENDING_COORDINATOR_REVIEW');
  assert.equal(report.exactAgreementCount, report.expectedCaseCount);
  assert.equal(report.disagreementCount, 0);
  assert.match(report.notice, /Agreement is not IPA gold/u);
});

test('pair comparison rejects identical reviewer IDs and mismatched queue revisions', () => {
  const a = packet('A', 'same-person', i => 'ipa-' + i);
  const b = packet('B', 'same-person', i => 'ipa-' + i);
  const report = compareReviewerPair(a, b, queueText);
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(error => error.includes('must have different declared reviewer IDs')));
});
