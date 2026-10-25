import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../research/', import.meta.url);

test('the exact 칡칡이 attestation is scoped to a folk-song title, not a lexical parse', async () => {
  const data = JSON.parse(await readFile(new URL('residual-five-candidate-resolution-2026-10-25.json', root), 'utf8'));
  const item = data.cases.find(entry => entry.input === '칡칡이');
  assert.equal(item.status, 'BLOCKED');
  assert.equal(item.candidateForms.length, 0);
  assert.ok(item.evidence.some(source => source.url.includes('EB_culture_song02.pdf')));
  assert.match(item.evidence[0].scope, /title/i);
  assert.match(item.why, /does not establish/i);
});

test('삶의 packets are separate, source-blind, and contain no prefilled IPA', async () => {
  const [a, b] = await Promise.all([
    readFile(new URL('ipa-review-packets/salmui-reviewer-A.json', root), 'utf8').then(JSON.parse),
    readFile(new URL('ipa-review-packets/salmui-reviewer-B.json', root), 'utf8').then(JSON.parse)
  ]);
  assert.equal(a.reviewerSlot, 'A');
  assert.equal(b.reviewerSlot, 'B');
  for (const packet of [a, b]) {
    assert.equal(packet.input, '삶의');
    assert.equal(packet.reviewForm.broadIpa, null);
    assert.equal(packet.reviewForm.reviewerId, null);
    assert.equal(packet.reviewForm.methodReference, null);
    assert.ok(!JSON.stringify(packet).includes('살믜'));
    assert.ok(!JSON.stringify(packet).includes('sal.mɰi'));
    assert.ok(!JSON.stringify(packet).includes('korean.go.kr'));
    assert.ok(packet.instructions.some(line => line.includes('independently')));
  }
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
