import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildHoldoutReviewQueue } from '../scripts/build-korean-holdout-ipa-queue.mjs';
import { buildReviewerPacket } from '../scripts/build-ipa-review-packet.mjs';
import { validateReviewerSubmission } from '../scripts/validate-ipa-review-submission.mjs';
const manifestText = await readFile(new URL('../data/korean/ipa_holdout_2026-10-24.json', import.meta.url), 'utf8');
test('frozen holdout becomes a blinded 24-case queue without IPA gold or engine outputs', () => {
  const queue = buildHoldoutReviewQueue(manifestText); assert.equal(queue.split, 'HOLDOUT'); assert.equal(queue.tuningUseProhibited, true); assert.equal(queue.cases.length, 24);
  assert.equal(new Set(queue.cases.map(item => item.caseId)).size, 24);
  for (const item of queue.cases) { assert.ok(item.input); assert.ok(item.surfaceEvidenceUrl.startsWith('https://www.korean.go.kr/')); assert.ok(item.normativeSurfaceComparator); assert.equal('ipaGold' in item, false); assert.equal('candidateBroadIpa' in item, false); assert.equal('engineOutputsStored' in item, false); assert.equal('ukrainianTarget' in item, false); }
  assert.match(queue.cases.find(item => item.input === '계산').normativeSurfaceComparator, /\|/u);
});
test('rejects count drift, duplicate IDs, non-frozen input, untrusted sources and premature gold', () => {
  const wrong = JSON.parse(manifestText); wrong.caseCount++; assert.throws(() => buildHoldoutReviewQueue(JSON.stringify(wrong)), /caseCount/u);
  const dup = JSON.parse(manifestText); dup.cases[1].caseId = dup.cases[0].caseId; assert.throws(() => buildHoldoutReviewQueue(JSON.stringify(dup)), /Duplicate holdout case ID/u);
  const draft = JSON.parse(manifestText); draft.status = 'DRAFT'; assert.throws(() => buildHoldoutReviewQueue(JSON.stringify(draft)), /non-frozen/u);
  const bad = JSON.parse(manifestText); bad.cases[0].sourceLocator = 'https://example.com/not-nikl'; assert.throws(() => buildHoldoutReviewQueue(JSON.stringify(bad)), /official NIKL/u);
  const gold = JSON.parse(manifestText); gold.cases[0].ipaGold = 'test'; assert.throws(() => buildHoldoutReviewQueue(JSON.stringify(gold)), /already has IPA labels/u);
});
test('existing blinded packet and validator accept the generated holdout queue without fabricating labels', () => {
  const queueText = JSON.stringify(buildHoldoutReviewQueue(manifestText), null, 2) + '\n';
  const packet = buildReviewerPacket(queueText, 'A');
  assert.equal(packet.cases.length, 24);
  assert.equal(packet.queueSha256.length, 64);
  assert.ok(packet.cases.every(item => item.reviewForm.broadIpa === null));
  const report = validateReviewerSubmission(JSON.stringify(packet), queueText, 'A');
  assert.equal(report.valid, false);
  assert.equal(report.expectedCaseCount, 24);
  assert.ok(report.errors.some(error => error.includes('broadIpa is required')));
});
