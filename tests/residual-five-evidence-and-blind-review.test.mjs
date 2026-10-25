import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildReviewerPacket } from '../scripts/build-ipa-review-packet.mjs';

const root = new URL('../research/', import.meta.url);

test('the exact 칡칡이 attestation is scoped to a folk-song heading, not a lexical parse', async () => {
  const data = JSON.parse(await readFile(new URL('residual-five-candidate-resolution-2026-10-25.json', root), 'utf8'));
  const item = data.cases.find(entry => entry.input === '칡칡이');
  assert.equal(item.status, 'BLOCKED');
  assert.equal(item.candidateForms.length, 0);
  assert.ok(item.evidence.some(source => source.url.includes('EB_culture_song02.pdf')));
  assert.match(item.evidence[0].scope, /heading/i);
  assert.match(item.why, /does not establish/i);
});

test('삶의 packets are canonical source-and-candidate-blind packets bound to exact queue bytes', async () => {
  const queueText = await readFile(new URL('salmui-ipa-review-queue.json', root), 'utf8');
  const queue = JSON.parse(queueText);
  const [aText, bText] = await Promise.all([
    readFile(new URL('ipa-review-packets/salmui-reviewer-A.json', root), 'utf8'),
    readFile(new URL('ipa-review-packets/salmui-reviewer-B.json', root), 'utf8')
  ]);
  const [a, b] = [JSON.parse(aText), JSON.parse(bText)];
  for (const [packet, slot] of [[a, 'A'], [b, 'B']]) {
    assert.equal(packet.schemaVersion, 2);
    assert.equal(packet.packetType, 'independent-broad-IPA-review');
    assert.equal(packet.blindnessMode, 'source-and-candidate-blind');
    assert.equal(packet.reviewerSlot, slot);
    assert.equal(packet.queueSha256, 'c13b50fa336a81d94b82ad689195655cd2e2ca3b11843874c9d46ca2178cdfe3');
    assert.deepEqual(packet, buildReviewerPacket(queueText, slot));
    assert.deepEqual(packet.cases.map(item => item.input), ['삶의']);
    assert.equal(packet.cases[0].caseId, 'BLIND-001');
    assert.equal(packet.cases[0].reviewForm.broadIpa, null);
    assert.equal(packet.cases[0].reviewForm.reviewerId, null);
    assert.ok(!JSON.stringify(packet).includes('살믜'));
    assert.ok(!JSON.stringify(packet).includes('sal.mɰi'));
    assert.ok(!JSON.stringify(packet).includes('korean.go.kr'));
    assert.ok(!JSON.stringify(packet).includes('candidateBroadIpa'));
    assert.ok(!JSON.stringify(packet).includes('ukrainianTargetReview'));
  }
  assert.notEqual(a.reviewerSlot, b.reviewerSlot);
  assert.equal(queue.cases[0].input, '삶의');
});

test('the IPA coordinator withholds target acceptance until review is complete', async () => {
  const data = JSON.parse(await readFile(new URL('salmui-ipa-adjudication-coordinator.json', root), 'utf8'));
  assert.equal(data.reconciliation.status, 'BLOCKED_SPECIALIST_ADJUDICATION');
  assert.equal(data.reconciliation.finalIpa, null);
  assert.equal(data.ukrainianTargetReview.status, 'BLOCKED_PENDING_FROZEN_IPA');
  assert.equal(data.ukrainianTargetReview.acceptedTarget, null);
  assert.deepEqual(data.ukrainianTargetReview.candidateTargets, []);
});

test('the context evidence for the expressive tail does not force one interpretation', async () => {
  const data = JSON.parse(await readFile(new URL('residual-five-candidate-resolution-2026-10-25.json', root), 'utf8'));
  const item = data.cases.find(entry => entry.input === '많앗구나유유유');
  assert.equal(item.status, 'MULTIPLE_CANDIDATES_ONLY');
  assert.equal(item.candidateForms.length, 3);
  assert.ok(item.evidence.some(source => source.scope.includes('different interpretations')));
  assert.ok(item.candidateForms.every(candidate => candidate.pronunciationMayBeAttributedToOriginal === false));
});
