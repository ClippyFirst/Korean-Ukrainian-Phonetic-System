import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const surface = JSON.parse(readFileSync(new URL('./fixtures/g2pk-surface-regression.json', import.meta.url), 'utf8'));
const queue = JSON.parse(readFileSync(new URL('../research/ipa-adjudication-queue.json', import.meta.url), 'utf8'));

const REVIEWER_FIELDS = ['id', 'qualification', 'reviewedAt', 'methodReference', 'ipa', 'notes'];
const LENGTH_DECISIONS = new Set(['PRESENT', 'ABSENT', 'NOT_APPLICABLE']);

function nonblank(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateReviewer(reviewer, caseId) {
  assert.ok(reviewer && typeof reviewer === 'object', caseId + ': reviewer record required');
  for (const field of REVIEWER_FIELDS) {
    assert.ok(nonblank(reviewer[field]), caseId + ': reviewer field ' + field + ' is required for adjudication');
  }
  assert.ok(Number.isFinite(Date.parse(reviewer.reviewedAt)), caseId + ': reviewedAt must be a parseable timestamp');
}

function validateAdjudicationCase(item) {
  assert.ok(nonblank(item.caseId), 'caseId is required');
  assert.ok(nonblank(item.input), item.caseId + ': input is required');
  assert.ok(nonblank(item.sourceLocator), item.caseId + ': exact source locator is required');
  assert.ok(typeof item.surfaceEvidenceUrl === 'string' && item.surfaceEvidenceUrl.startsWith('https://'), item.caseId + ': HTTPS evidence URL required');
  assert.ok(item.reviewerA && item.reviewerB, item.caseId + ': both reviewer records are required');

  if (item.reconciliation.status === 'BLOCKED_SPECIALIST_ADJUDICATION') {
    assert.equal(item.candidateBroadIpa, null, item.caseId + ': blocked cases cannot carry candidate IPA');
    assert.equal(item.syllableBoundaries, null, item.caseId + ': blocked cases cannot claim reviewed syllabification');
    assert.equal(item.vowelLengthAssessment, null, item.caseId + ': blocked cases cannot claim a length decision');
    for (const reviewerKey of ['reviewerA', 'reviewerB']) {
      for (const field of REVIEWER_FIELDS) {
        assert.equal(item[reviewerKey][field], null, item.caseId + ': blocked cases cannot contain partial reviewer records');
      }
    }
    assert.equal(item.reconciliation.finalIpa, null, item.caseId + ': blocked cases cannot carry final IPA');
    assert.equal(item.reconciliation.decisionNotes, null, item.caseId + ': blocked cases cannot claim reconciliation');
    return;
  }

  assert.equal(item.reconciliation.status, 'ADJUDICATED', item.caseId + ': unknown adjudication status');
  assert.ok(nonblank(item.candidateBroadIpa), item.caseId + ': adjudicated cases require a reviewed candidate');
  assert.ok(nonblank(item.syllableBoundaries), item.caseId + ': adjudicated cases require syllable boundaries');
  assert.ok(LENGTH_DECISIONS.has(item.vowelLengthAssessment), item.caseId + ': adjudicated cases require an explicit vowel-length decision');
  validateReviewer(item.reviewerA, item.caseId + ' reviewerA');
  validateReviewer(item.reviewerB, item.caseId + ' reviewerB');
  assert.notEqual(item.reviewerA.id, item.reviewerB.id, item.caseId + ': independent reviewers must be distinct');
  assert.ok(nonblank(item.reconciliation.finalIpa), item.caseId + ': final IPA required');
  assert.ok(nonblank(item.reconciliation.decisionNotes), item.caseId + ': reconciliation rationale required');
}

test('IPA adjudication queue covers every surface case and allows separately sourced high-risk forms', () => {
  assert.equal(queue.schemaVersion, 2);
  assert.ok(queue.cases.length >= surface.cases.length);
  assert.ok(queue.cases.length >= surface.cases.length);
  assert.match(queue.purpose, /do not independently determine broad IPA/u);
  const byInput = new Map(surface.cases.map(item => [item.input, item]));
  const seenInputs = new Set();
  const seenIds = new Set();
  for (const item of queue.cases) {
    assert.ok(!seenInputs.has(item.input), item.input + ': duplicate adjudication case');
    assert.ok(!seenIds.has(item.caseId), item.caseId + ': duplicate case ID');
    seenInputs.add(item.input);
    seenIds.add(item.caseId);
    const source = byInput.get(item.input);
    if (source) {
      assert.equal(item.normativeSurfaceComparator, source.normativeSurface, item.input);
      assert.equal(item.surfaceEvidenceStatus, source.normativeEvidenceStatus, item.input);
      assert.equal(item.surfaceEvidenceUrl, source.normativeSourceUrl, item.input);
      assert.equal(item.sourceLocator, source.normativeSourceLocator, item.input);
    } else {
      // The queue may contain a separately sourced high-risk case not present
      // in the pinned G2P regression fixture. Such cases still need official
      // source provenance and must remain independently adjudicated.
      assert.equal(item.input, '삶의', item.input + ': unexpected non-fixture case');
      assert.equal(item.surfaceEvidenceStatus, 'direct-NIKL-MCFAQ', item.input);
      assert.match(item.surfaceEvidenceUrl, /mcfaq_seq=5716/u);
      assert.equal(item.normativeSurfaceComparator, '살믜 / 살메');
    }
    assert.equal(item.ukrainianTargetReview, 'SEPARATE_UNREVIEWED_TASK', item.input);
    validateAdjudicationCase(item);
  }
  assert.ok(surface.cases.every(item => seenInputs.has(item.input)), 'every pinned surface case must be represented');
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

test('a completed adjudication requires two distinct traceable reviewers and an explicit length decision', () => {
  // Synthetic validator-only record. These sentinels are not Korean IPA data and must never enter the real queue.
  const synthetic = {
    caseId: 'TEST-ONLY', input: 'TEST-ONLY-NOT-KOREAN',
    surfaceEvidenceUrl: 'https://example.invalid/test-only',
    sourceLocator: 'TEST-ONLY-NOT-EVIDENCE',
    candidateBroadIpa: 'TEST-ONLY-NOT-IPA',
    syllableBoundaries: 'TEST-ONLY',
    vowelLengthAssessment: 'NOT_APPLICABLE',
    reviewerA: { id: 'reviewer-A', qualification: 'TEST-ONLY', reviewedAt: '2026-10-22T00:00:00Z', methodReference: 'TEST-ONLY', ipa: 'TEST-ONLY-NOT-IPA', notes: 'TEST-ONLY' },
    reviewerB: { id: 'reviewer-B', qualification: 'TEST-ONLY', reviewedAt: '2026-10-22T00:00:00Z', methodReference: 'TEST-ONLY', ipa: 'TEST-ONLY-NOT-IPA', notes: 'TEST-ONLY' },
    reconciliation: { status: 'ADJUDICATED', finalIpa: 'TEST-ONLY-NOT-IPA', decisionNotes: 'TEST-ONLY; not a linguistic adjudication.' },
  };
  assert.doesNotThrow(() => validateAdjudicationCase(synthetic));

  const sameReviewer = structuredClone(synthetic);
  sameReviewer.reviewerB.id = sameReviewer.reviewerA.id;
  assert.throws(() => validateAdjudicationCase(sameReviewer), /independent reviewers must be distinct/u);

  const missingLengthDecision = structuredClone(synthetic);
  missingLengthDecision.vowelLengthAssessment = null;
  assert.throws(() => validateAdjudicationCase(missingLengthDecision), /explicit vowel-length decision/u);

  const incompleteReviewer = structuredClone(synthetic);
  incompleteReviewer.reviewerB.methodReference = null;
  assert.throws(() => validateAdjudicationCase(incompleteReviewer), /methodReference is required/u);

  const unresolvedWithCandidate = structuredClone(queue.cases[0]);
  unresolvedWithCandidate.candidateBroadIpa = 'TEST-ONLY-NOT-IPA';
  assert.throws(() => validateAdjudicationCase(unresolvedWithCandidate), /blocked cases cannot carry candidate IPA/u);
});
