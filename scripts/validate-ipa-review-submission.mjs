#!/usr/bin/env node
/**
 * Validate a completed blinded IPA reviewer packet without adjudicating it.
 *
 * Reads a reviewer-edited packet and the canonical queue, checks revision
 * identity and completeness, and emits a compact validation report to stdout.
 * It never edits the packet, queue, or adjudication records.
 */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUEUE_URL = new URL('../research/ipa-adjudication-queue.json', import.meta.url);
const ROOT_KEYS = new Set(['schemaVersion', 'packetType', 'reviewerSlot', 'queueSha256', 'instructions', 'cases']);
const CASE_KEYS = new Set([
  'caseId', 'input', 'surfaceEvidenceStatus', 'surfaceEvidenceUrl',
  'sourceLocator', 'normativeSurfaceComparator', 'reviewForm',
]);
const FORM_KEYS = new Set([
  'reviewerSlot', 'reviewerId', 'qualification', 'reviewedAt', 'methodReference',
  'broadIpa', 'syllableBoundaries', 'vowelLengthAssessment', 'notes',
]);
const LENGTH_VALUES = new Set(['present', 'absent', 'not_applicable', 'uncertain']);

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function onlyKeys(value, allowed, label, errors) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) errors.push(label + ' contains unexpected field "' + key + '".');
  }
}

function nonBlank(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateReviewedAt(value) {
  if (!nonBlank(value)) return false;
  // Require a complete ISO-like timestamp with an explicit UTC/offset zone.
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/u.test(value)) return false;
  return Number.isFinite(Date.parse(value));
}

export function validateReviewerSubmission(packetText, queueText, expectedSlot = null) {
  const errors = [];
  let packet;
  let queue;
  try { packet = JSON.parse(packetText); } catch { return { valid: false, errors: ['Submission is not valid JSON.'] }; }
  try { queue = JSON.parse(queueText); } catch { return { valid: false, errors: ['Canonical queue is not valid JSON.'] }; }

  if (!packet || typeof packet !== 'object' || Array.isArray(packet)) {
    return { valid: false, errors: ['Submission root must be a JSON object.'] };
  }
  onlyKeys(packet, ROOT_KEYS, 'Submission', errors);
  if (packet.schemaVersion !== 1) errors.push('schemaVersion must be 1.');
  if (packet.packetType !== 'independent-broad-IPA-review') errors.push('packetType must be independent-broad-IPA-review.');
  if (!['A', 'B'].includes(packet.reviewerSlot)) errors.push('reviewerSlot must be A or B.');
  if (expectedSlot && packet.reviewerSlot !== expectedSlot) errors.push('reviewerSlot does not match the requested slot.');
  if (!/^[a-f0-9]{64}$/u.test(packet.queueSha256 || '')) errors.push('queueSha256 must be a lowercase SHA-256 digest.');
  else if (packet.queueSha256 !== sha256(queueText)) errors.push('Submission was prepared from a different queue revision; regenerate and review the current packet.');
  if (!Array.isArray(packet.instructions)) errors.push('instructions must remain an array.');
  if (!Array.isArray(packet.cases)) errors.push('cases must be an array.');

  if (!queue || queue.schemaVersion !== 2 || !Array.isArray(queue.cases)) {
    errors.push('Canonical queue must use schemaVersion 2 and contain cases.');
  }
  if (errors.some(error => error.startsWith('cases must') || error.startsWith('Canonical queue'))) {
    return { valid: false, errors };
  }

  const expectedIds = queue.cases.map(item => item?.caseId);
  if (expectedIds.some(id => !nonBlank(id)) || new Set(expectedIds).size !== expectedIds.length) {
    errors.push('Canonical queue contains missing or duplicate case IDs.');
  }
  const cases = packet.cases;
  if (cases.length !== expectedIds.length) errors.push('Submission must contain exactly ' + expectedIds.length + ' cases.');
  const byId = new Map();
  let packetReviewerId = null;
  let packetQualification = null;
  for (const item of cases) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      errors.push('Every submission case must be an object.');
      continue;
    }
    onlyKeys(item, CASE_KEYS, 'Case ' + (item.caseId || '(missing ID)'), errors);
    if (!nonBlank(item.caseId)) {
      errors.push('Every case must have a non-empty caseId.');
      continue;
    }
    if (byId.has(item.caseId)) errors.push('Duplicate caseId "' + item.caseId + '".');
    byId.set(item.caseId, item);
    const original = queue.cases.find(sourceCase => sourceCase.caseId === item.caseId);
    if (!original) {
      errors.push('Unknown caseId "' + item.caseId + '".');
      continue;
    }
    for (const field of ['input', 'surfaceEvidenceStatus', 'surfaceEvidenceUrl', 'sourceLocator', 'normativeSurfaceComparator']) {
      if (item[field] !== original[field]) errors.push(item.caseId + ': source field "' + field + '" was changed.');
    }
    if (!item.reviewForm || typeof item.reviewForm !== 'object' || Array.isArray(item.reviewForm)) {
      errors.push(item.caseId + ': reviewForm is missing.');
      continue;
    }
    const form = item.reviewForm;
    onlyKeys(form, FORM_KEYS, item.caseId + '.reviewForm', errors);
    if (form.reviewerSlot !== packet.reviewerSlot) errors.push(item.caseId + ': reviewer slot mismatch.');
    if (!nonBlank(form.reviewerId)) errors.push(item.caseId + ': reviewerId is required.');
    else if (packetReviewerId === null) packetReviewerId = form.reviewerId.trim();
    else if (packetReviewerId !== form.reviewerId.trim()) errors.push(item.caseId + ': reviewerId must be consistent across the packet.');
    if (!nonBlank(form.qualification)) errors.push(item.caseId + ': qualification is required.');
    else if (packetQualification === null) packetQualification = form.qualification.trim();
    else if (packetQualification !== form.qualification.trim()) errors.push(item.caseId + ': qualification must be consistent across the packet.');
    if (!validateReviewedAt(form.reviewedAt)) errors.push(item.caseId + ': reviewedAt must be a valid ISO timestamp with timezone.');
    if (!nonBlank(form.methodReference)) errors.push(item.caseId + ': methodReference is required.');
    if (!nonBlank(form.broadIpa)) errors.push(item.caseId + ': broadIpa is required.');
    if (!nonBlank(form.syllableBoundaries)) errors.push(item.caseId + ': syllableBoundaries must be recorded (use the project convention or explain uncertainty in notes).');
    if (!LENGTH_VALUES.has(form.vowelLengthAssessment)) {
      errors.push(item.caseId + ': vowelLengthAssessment must be present, absent, not_applicable, or uncertain.');
    }
    if (form.notes !== null && form.notes !== undefined && typeof form.notes !== 'string') {
      errors.push(item.caseId + ': notes must be a string or null.');
    }
  }
  for (const id of expectedIds) if (!byId.has(id)) errors.push('Missing caseId "' + id + '".');

  return {
    valid: errors.length === 0,
    reviewerSlot: packet.reviewerSlot,
    queueSha256: packet.queueSha256,
    expectedCaseCount: expectedIds.length,
    submittedCaseCount: cases.length,
    errors,
    notice: 'Structural completeness only. This tool does not judge IPA correctness, reviewer qualifications, independence, source interpretation, or Ukrainian adaptation.',
  };
}

async function main(argv = process.argv.slice(2)) {
  let file = null;
  let expectedSlot = null;
  let queuePath = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/validate-ipa-review-submission.mjs <submission.json> [--reviewer A|B] [--queue <queue.json>]');
      console.log('Validates a completed packet against the current canonical queue; report is JSON on stdout.');
      return 0;
    }
    if (arg === '--queue') {
      if (queuePath !== null) throw new Error('--queue may be supplied only once.');
      queuePath = argv[++i];
      if (!queuePath || queuePath.startsWith('--')) throw new Error('--queue requires a JSON file path.');
      continue;
    }
    if (arg === '--reviewer') {
      if (expectedSlot !== null) throw new Error('--reviewer may be supplied only once.');
      expectedSlot = argv[++i];
      if (!['A', 'B'].includes(expectedSlot)) throw new Error('--reviewer requires A or B.');
      continue;
    }
    if (arg.startsWith('--')) throw new Error('Unknown argument: ' + arg);
    if (file !== null) throw new Error('Only one submission file may be supplied.');
    file = arg;
  }
  if (!file) throw new Error('A reviewer submission JSON path is required.');
  const [packetText, queueText] = await Promise.all([
    readFile(resolve(file), 'utf8'),
    readFile(queuePath ? resolve(queuePath) : QUEUE_URL, 'utf8'),
  ]);
  const report = validateReviewerSubmission(packetText, queueText, expectedSlot);
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  return report.valid ? 0 : 1;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  try {
    process.exitCode = await main();
  } catch (error) {
    console.error('IPA submission validation failed closed: ' + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 2;
  }
}
