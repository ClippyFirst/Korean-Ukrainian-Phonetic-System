import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { buildReviewerPacket } from '../scripts/build-ipa-review-packet.mjs';
import { validateReviewerSubmission } from '../scripts/validate-ipa-review-submission.mjs';

const queueText = readFileSync(new URL('../research/ipa-adjudication-queue.json', import.meta.url), 'utf8');
const queue = JSON.parse(queueText);

function completePacket(slot = 'A') {
  const packet = buildReviewerPacket(queueText, slot);
  packet.cases = packet.cases.map((item, index) => ({
    ...item,
    reviewForm: {
      ...item.reviewForm,
      reviewerId: 'reviewer-' + slot,
      qualification: 'Qualified Korean phonetics reviewer; qualification to be independently checked',
      reviewedAt: '2026-10-23T20:00:00Z',
      methodReference: 'Documented broad IPA transcription protocol v1, section 3',
      broadIpa: 'tɛst' + index,
      syllableBoundaries: 'test.boundaries.' + index,
      vowelLengthAssessment: 'uncertain',
      notes: 'Fixture only; not linguistic evidence.',
    },
  }));
  return packet;
}

test('accepts a structurally complete 20-case submission tied to the exact queue revision', () => {
  const report = validateReviewerSubmission(JSON.stringify(completePacket('A')), queueText, 'A');
  assert.equal(report.valid, true, report.errors.join('\\n'));
  assert.equal(report.expectedCaseCount, 20);
  assert.equal(report.submittedCaseCount, 20);
  assert.equal(report.reviewerSlot, 'A');
  assert.match(report.notice, /does not judge IPA correctness/u);
});

test('rejects an incomplete reviewer form without accepting empty IPA or missing provenance', () => {
  const packet = completePacket('A');
  packet.cases[0].reviewForm.broadIpa = '  ';
  packet.cases[1].reviewForm.methodReference = '';
  packet.cases[2].reviewForm.reviewerId = null;
  packet.cases[3].reviewForm.syllableBoundaries = null;
  packet.cases[4].reviewForm.vowelLengthAssessment = 'maybe';
  packet.cases[5].reviewForm.reviewedAt = '2026-10-23T20:00:00';
  const report = validateReviewerSubmission(JSON.stringify(packet), queueText, 'A');
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(error => error.includes('IPA-001: broadIpa is required')));
  assert.ok(report.errors.some(error => error.includes('IPA-002: methodReference is required')));
  assert.ok(report.errors.some(error => error.includes('IPA-003: reviewerId is required')));
  assert.ok(report.errors.some(error => error.includes('IPA-004: syllableBoundaries')));
  assert.ok(report.errors.some(error => error.includes('IPA-005: vowelLengthAssessment')));
  assert.ok(report.errors.some(error => error.includes('IPA-006: reviewedAt')));
});

test('rejects stale queue hashes, changed source fields, duplicate/missing cases and wrong reviewer slot', () => {
  const stale = completePacket('A');
  stale.queueSha256 = '0'.repeat(64);
  assert.ok(validateReviewerSubmission(JSON.stringify(stale), queueText, 'A').errors.some(error => error.includes('different queue revision')));

  const changed = completePacket('A');
  changed.cases[0].normativeSurfaceComparator = 'changed';
  assert.ok(validateReviewerSubmission(JSON.stringify(changed), queueText, 'A').errors.some(error => error.includes('source field "normativeSurfaceComparator" was changed')));

  const duplicate = completePacket('A');
  duplicate.cases[1].caseId = duplicate.cases[0].caseId;
  const duplicateReport = validateReviewerSubmission(JSON.stringify(duplicate), queueText, 'A');
  assert.ok(duplicateReport.errors.some(error => error.includes('Duplicate caseId')));
  assert.ok(duplicateReport.errors.some(error => error.includes('Missing caseId')));

  const wrongSlot = completePacket('B');
  assert.ok(validateReviewerSubmission(JSON.stringify(wrongSlot), queueText, 'A').errors.some(error => error.includes('does not match the requested slot')));
});

test('requires one consistent reviewer identity and qualification across the packet', () => {
  const packet = completePacket('A');
  packet.cases[7].reviewForm.reviewerId = 'a-different-reviewer';
  packet.cases[8].reviewForm.qualification = 'A different qualification statement';
  const report = validateReviewerSubmission(JSON.stringify(packet), queueText, 'A');
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(error => error.includes('IPA-008: reviewerId must be consistent across the packet')));
  assert.ok(report.errors.some(error => error.includes('IPA-009: qualification must be consistent across the packet')));
});

test('rejects fields that could leak candidate IPA or another reviewer’s decision', () => {
  const packet = completePacket('A');
  packet.cases[0].candidateBroadIpa = 'LEAKED_CANDIDATE';
  packet.cases[1].reviewerB = { ipa: 'LEAKED_REVIEWER_B' };
  packet.cases[2].reconciliation = { finalIpa: 'LEAKED_FINAL' };
  const report = validateReviewerSubmission(JSON.stringify(packet), queueText, 'A');
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(error => error.includes('unexpected field "candidateBroadIpa"')));
  assert.ok(report.errors.some(error => error.includes('unexpected field "reviewerB"')));
  assert.ok(report.errors.some(error => error.includes('unexpected field "reconciliation"')));
});

test('CLI emits a machine-readable report and returns nonzero for an invalid submission', () => {
  const directory = mkdtempSync(join(tmpdir(), 'ipa-review-submission-'));
  try {
    const path = join(directory, 'submission.json');
    const script = fileURLToPath(new URL('../scripts/validate-ipa-review-submission.mjs', import.meta.url));
    writeFileSync(path, JSON.stringify(completePacket('B')), 'utf8');
    const valid = spawnSync(process.execPath, [script, path, '--reviewer', 'B'], { encoding: 'utf8' });
    assert.equal(valid.status, 0, valid.stderr);
    assert.equal(JSON.parse(valid.stdout).valid, true);

    const packet = completePacket('B');
    packet.cases[0].reviewForm.broadIpa = null;
    writeFileSync(path, JSON.stringify(packet), 'utf8');
    const invalid = spawnSync(process.execPath, [script, path, '--reviewer', 'B'], { encoding: 'utf8' });
    assert.equal(invalid.status, 1);
    assert.equal(JSON.parse(invalid.stdout).valid, false);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
