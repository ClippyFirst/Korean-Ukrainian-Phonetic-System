import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { buildReviewerPacket } from '../scripts/build-ipa-review-packet.mjs';

const queueText = readFileSync(new URL('../research/ipa-adjudication-queue.json', import.meta.url), 'utf8');
const queue = JSON.parse(queueText);

test('packet contains all 20 source-backed cases and a reproducible queue hash', () => {
  const packetA = buildReviewerPacket(queueText, 'A');
  const packetB = buildReviewerPacket(queueText, 'B');
  assert.equal(packetA.cases.length, 20);
  assert.equal(packetA.queueSha256, packetB.queueSha256);
  assert.match(packetA.queueSha256, /^[a-f0-9]{64}$/u);
  assert.equal(packetA.reviewerSlot, 'A');
  assert.equal(packetB.reviewerSlot, 'B');
  assert.deepEqual(packetA.cases.map(item => item.caseId), queue.cases.map(item => item.caseId));
  assert.ok(packetA.cases.every(item => item.reviewForm.reviewerSlot === 'A'));
  assert.ok(packetB.cases.every(item => item.reviewForm.reviewerSlot === 'B'));
});

test('packet is blinded even when the canonical queue contains other reviewer data or candidate IPA', () => {
  const contaminated = structuredClone(queue);
  contaminated.cases[0].candidateBroadIpa = 'SECRET_CANDIDATE_IPA';
  contaminated.cases[0].reviewerA = { id: 'SECRET_REVIEWER_A', ipa: 'SECRET_REVIEWER_A_IPA' };
  contaminated.cases[0].reviewerB = { id: 'SECRET_REVIEWER_B', ipa: 'SECRET_REVIEWER_B_IPA' };
  contaminated.cases[0].reconciliation = { status: 'ADJUDICATED', finalIpa: 'SECRET_FINAL_IPA', decisionNotes: 'SECRET_DECISION' };
  contaminated.cases[0].ukrainianTargetReview = 'SECRET_TARGET_REVIEW';
  contaminated.cases[0].notes = 'SECRET_SOURCE_NOTE';

  const packet = buildReviewerPacket(JSON.stringify(contaminated), 'A');
  const serialized = JSON.stringify(packet);
  for (const secret of [
    'SECRET_CANDIDATE_IPA',
    'SECRET_REVIEWER_A',
    'SECRET_REVIEWER_A_IPA',
    'SECRET_REVIEWER_B',
    'SECRET_REVIEWER_B_IPA',
    'SECRET_FINAL_IPA',
    'SECRET_DECISION',
    'SECRET_TARGET_REVIEW',
    'SECRET_SOURCE_NOTE',
  ]) assert.ok(!serialized.includes(secret), 'blinded packet must not leak ' + secret);

  for (const forbiddenKey of ['candidateBroadIpa', 'reviewerA', 'reviewerB', 'reconciliation', 'ukrainianTargetReview']) {
    assert.ok(!Object.hasOwn(packet.cases[0], forbiddenKey), 'packet must omit ' + forbiddenKey);
  }
  assert.equal(packet.cases[0].reviewForm.broadIpa, null);
  assert.equal(packet.cases[0].reviewForm.syllableBoundaries, null);
  assert.equal(packet.cases[0].reviewForm.vowelLengthAssessment, null);
});

test('packet builder rejects invalid slots, duplicate IDs and non-official evidence URLs', () => {
  assert.throws(() => buildReviewerPacket(queueText, 'C'), /must be A or B/u);
  const duplicate = structuredClone(queue);
  duplicate.cases[1].caseId = duplicate.cases[0].caseId;
  assert.throws(() => buildReviewerPacket(JSON.stringify(duplicate), 'A'), /Duplicate IPA case ID/u);
  const external = structuredClone(queue);
  external.cases[0].surfaceEvidenceUrl = 'https://example.org/not-nikl';
  assert.throws(() => buildReviewerPacket(JSON.stringify(external), 'A'), /official NIKL HTTPS host/u);
});

test('CLI writes valid blinded JSON to stdout without modifying the canonical queue', () => {
  const script = fileURLToPath(new URL('../scripts/build-ipa-review-packet.mjs', import.meta.url));
  const before = readFileSync(new URL('../research/ipa-adjudication-queue.json', import.meta.url), 'utf8');
  const run = spawnSync(process.execPath, [script, '--reviewer', 'B'], { cwd: process.cwd(), encoding: 'utf8' });
  const after = readFileSync(new URL('../research/ipa-adjudication-queue.json', import.meta.url), 'utf8');
  assert.equal(run.status, 0, run.stderr);
  assert.equal(before, after, 'packet generation must not modify the canonical queue');
  const packet = JSON.parse(run.stdout);
  assert.equal(packet.reviewerSlot, 'B');
  assert.equal(packet.cases.length, 20);
  assert.ok(!run.stdout.includes('candidateBroadIpa'));
  assert.ok(!run.stdout.includes('reviewerA'));
  assert.ok(!run.stdout.includes('reviewerB'));
});

test('CLI requires an explicit reviewer slot and fails closed for missing arguments', () => {
  const script = fileURLToPath(new URL('../scripts/build-ipa-review-packet.mjs', import.meta.url));
  const run = spawnSync(process.execPath, [script], { cwd: process.cwd(), encoding: 'utf8' });
  assert.equal(run.status, 2);
  assert.match(run.stderr, /--reviewer A or --reviewer B is required/u);
});
