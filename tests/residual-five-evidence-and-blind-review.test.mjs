import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildReviewerPacket } from '../scripts/build-ipa-review-packet.mjs';

const root = new URL('../research/', import.meta.url);

test('the 칡칡이 search-snippet/PDF-text discrepancy remains a candidate, not a lexical parse', async () => {
  const data = JSON.parse(await readFile(new URL('residual-five-candidate-resolution-2026-10-25.json', root), 'utf8'));
  const item = data.cases.find(entry => entry.input === '칡칡이');
  assert.equal(item.status, 'CANDIDATE_ONLY');
  assert.deepEqual(item.candidateForms.map(candidate => candidate.text), ['칭칭이']);
  assert.equal(item.candidateForms[0].pronunciationMayBeAttributedToOriginal, false);
  assert.equal(item.candidateIPA.length, 0);
  assert.ok(item.evidence.some(source => source.url.includes('EB_culture_song02.pdf')));
  assert.match(item.evidence[0].scope, /PDF text layer/i);
  assert.match(item.why, /No lexical meaning/i);
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

test('the existing 삶의 lexical-table row stays provisional and cannot bypass the independent IPA/target gate', async () => {
  const csv = await readFile(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
  const row = csv.split(/\r?\n/).find(line => line.startsWith('삶의,살믜,'));
  assert.ok(row, 'the repository lexical table must retain the source-backed surface entry');
  assert.match(row, /,high,provisional,살메,сал\|ме,sal\|me,/,
    'both IPA-like and Ukrainian fields in the table remain provisional candidates, not accepted gold');
  assert.match(row, /сал\|мі,sal\|mi,/,
    'preserve the existing candidate as a repository fingerprint; do not silently rewrite it during review setup');
  const coordinator = JSON.parse(await readFile(new URL('../research/salmui-ipa-adjudication-coordinator.json', import.meta.url), 'utf8'));
  assert.equal(coordinator.reconciliation.finalIpa, null);
  assert.equal(coordinator.ukrainianTargetReview.acceptedTarget, null);
});


test('reviewer recruitment is tracked without fabricating submissions or accepting a target', async () => {
  const coordinator = JSON.parse(await readFile(new URL('salmui-ipa-adjudication-coordinator.json', root), 'utf8'));
  assert.equal(coordinator.reviewerRecruitment.status, 'OPEN_REQUEST_FOR_TWO_INDEPENDENT_QUALIFIED_REVIEWERS');
  assert.equal(coordinator.reviewerRecruitment.issue, 'https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/issues/337');
  assert.equal(coordinator.reviewerRecruitment.submissionsReceived, 0);
  assert.equal(coordinator.reconciliation.finalIpa, null);
  assert.equal(coordinator.ukrainianTargetReview.acceptedTarget, null);
});
