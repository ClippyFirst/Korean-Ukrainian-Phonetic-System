#!/usr/bin/env node
/** Compare two completed source-blind IPA reviews without treating agreement as gold. */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateReviewerSubmission } from './validate-ipa-review-submission.mjs';

const QUEUE_URL = new URL('../research/ipa-adjudication-queue.json', import.meta.url);

function parse(text, label, errors) {
  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('root must be an object');
    return value;
  } catch (error) {
    errors.push(label + ' is invalid JSON: ' + (error instanceof Error ? error.message : String(error)));
    return null;
  }
}

function reviewerId(packet) {
  const ids = new Set((packet?.cases || []).map(item => String(item?.reviewForm?.reviewerId ?? '').trim().toLocaleLowerCase('en-US')).filter(Boolean));
  return ids.size === 1 ? [...ids][0] : null;
}

function normalized(value) {
  return typeof value === 'string' ? value.normalize('NFC').trim() : '';
}

/**
 * Structural pair validation and literal field comparison only.
 * Agreement is not proof of correctness, qualification, or actual independence.
 */
export function compareReviewerPair(packetAText, packetBText, queueText) {
  const errors = [];
  const a = parse(packetAText, 'Reviewer A submission', errors);
  const b = parse(packetBText, 'Reviewer B submission', errors);
  let queue;
  try {
    queue = JSON.parse(queueText);
    if (!queue || typeof queue !== 'object' || Array.isArray(queue)) throw new Error('root must be an object');
  } catch (error) {
    errors.push('Canonical queue is invalid JSON: ' + (error instanceof Error ? error.message : String(error)));
  }
  if (!a || !b || !queue) return { valid: false, errors, cases: [], notice: 'No linguistic adjudication was performed.' };

  const checkA = validateReviewerSubmission(packetAText, queueText, 'A');
  const checkB = validateReviewerSubmission(packetBText, queueText, 'B');
  if (!checkA.valid) errors.push(...checkA.errors.map(error => 'A: ' + error));
  if (!checkB.valid) errors.push(...checkB.errors.map(error => 'B: ' + error));

  const idA = reviewerId(a);
  const idB = reviewerId(b);
  if (!idA) errors.push('Reviewer A identity must be consistent and non-empty across the packet.');
  if (!idB) errors.push('Reviewer B identity must be consistent and non-empty across the packet.');
  if (idA && idB && idA === idB) errors.push('Reviewer A and Reviewer B must have different declared reviewer IDs.');

  if (a.queueSha256 !== b.queueSha256) errors.push('Reviewer packets are bound to different queue revisions.');
  if (a.blindnessMode !== b.blindnessMode) errors.push('Reviewer packets use different blindness modes.');
  if (!Array.isArray(a.cases) || !Array.isArray(b.cases) || a.cases.length !== b.cases.length) {
    errors.push('Reviewer packets must contain the same number of cases.');
  }

  const count = Math.min(Array.isArray(a.cases) ? a.cases.length : 0, Array.isArray(b.cases) ? b.cases.length : 0);
  const cases = [];
  for (let index = 0; index < count; index++) {
    const left = a.cases[index];
    const right = b.cases[index];
    if (!left || !right || left.caseId !== right.caseId || left.input !== right.input) {
      errors.push('Case ' + (index + 1) + ' does not align across the two submissions.');
      continue;
    }
    const fa = left.reviewForm || {};
    const fb = right.reviewForm || {};
    const ipaA = normalized(fa.broadIpa);
    const ipaB = normalized(fb.broadIpa);
    const boundariesA = normalized(fa.syllableBoundaries);
    const boundariesB = normalized(fb.syllableBoundaries);
    const lengthA = normalized(fa.vowelLengthAssessment);
    const lengthB = normalized(fb.vowelLengthAssessment);
    const exactAgreement = ipaA === ipaB && boundariesA === boundariesB && lengthA === lengthB;
    cases.push({
      caseId: left.caseId,
      input: left.input,
      ipaAgreement: ipaA === ipaB,
      syllableBoundaryAgreement: boundariesA === boundariesB,
      vowelLengthAgreement: lengthA === lengthB,
      status: exactAgreement ? 'AGREEMENT_PENDING_COORDINATOR_REVIEW' : 'DISAGREEMENT_REQUIRES_ADJUDICATION',
    });
  }
  const disagreementCount = cases.filter(item => item.status === 'DISAGREEMENT_REQUIRES_ADJUDICATION').length;
  return {
    valid: errors.length === 0,
    reviewerA: idA,
    reviewerB: idB,
    queueSha256: a.queueSha256 === b.queueSha256 ? a.queueSha256 : null,
    expectedCaseCount: checkA.expectedCaseCount ?? null,
    comparedCaseCount: cases.length,
    exactAgreementCount: cases.filter(item => item.status === 'AGREEMENT_PENDING_COORDINATOR_REVIEW').length,
    disagreementCount,
    adjudicationStatus: errors.length ? 'PAIR_INVALID' : disagreementCount ? 'DISAGREEMENT_REQUIRES_ADJUDICATION' : 'AGREEMENT_PENDING_COORDINATOR_REVIEW',
    cases,
    errors,
    notice: 'Comparison is mechanical only. Agreement is not IPA gold and does not verify reviewer qualifications or independence; a coordinator must review provenance and adjudicate disagreements. Ukrainian-target review is separate.',
  };
}

async function main(argv = process.argv.slice(2)) {
  let aPath = null;
  let bPath = null;
  let queuePath = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/compare-ipa-review-pair.mjs <reviewer-A.json> <reviewer-B.json> [--queue <queue.json>]');
      console.log('Compares completed reviews structurally; it does not adjudicate IPA correctness.');
      return 0;
    }
    if (arg === '--queue') {
      if (queuePath !== null) throw new Error('--queue may be supplied only once.');
      queuePath = argv[++i];
      if (!queuePath || queuePath.startsWith('--')) throw new Error('--queue requires a JSON file path.');
      continue;
    }
    if (arg.startsWith('--')) throw new Error('Unknown argument: ' + arg);
    if (aPath === null) aPath = arg;
    else if (bPath === null) bPath = arg;
    else throw new Error('Exactly two submission paths are accepted.');
  }
  if (!aPath || !bPath) throw new Error('Both reviewer submission paths are required.');
  const [aText, bText, queueText] = await Promise.all([
    readFile(resolve(aPath), 'utf8'),
    readFile(resolve(bPath), 'utf8'),
    readFile(queuePath ? resolve(queuePath) : fileURLToPath(QUEUE_URL), 'utf8'),
  ]);
  const report = compareReviewerPair(aText, bText, queueText);
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  return report.valid ? 0 : 1;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  try {
    process.exitCode = await main();
  } catch (error) {
    console.error('IPA pair comparison failed closed: ' + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 2;
  }
}
