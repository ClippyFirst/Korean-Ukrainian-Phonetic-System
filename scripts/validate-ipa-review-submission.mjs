#!/usr/bin/env node
/**
 * Validate a completed source-blind reviewer packet without adjudicating it.
 * The validator binds it to the exact source queue, but source metadata remains
 * outside the packet and is available only to the coordinator.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BLINDNESS_MODE,
  PACKET_TYPE,
  REVIEW_INSTRUCTIONS,
  blindCaseId,
  selectReviewableCases,
  sha256,
} from './ipa-review-packet-shared.mjs';

const QUEUE_URL = new URL('../research/ipa-adjudication-queue.json', import.meta.url);
const ROOT_KEYS = new Set(['schemaVersion', 'packetType', 'blindnessMode', 'reviewerSlot', 'queueSha256', 'instructions', 'cases']);
const CASE_KEYS = new Set(['caseId', 'input', 'reviewForm']);
const FORM_KEYS = new Set([
  'reviewerSlot', 'reviewerId', 'qualification', 'reviewedAt', 'methodReference',
  'broadIpa', 'syllableBoundaries', 'vowelLengthAssessment', 'notes',
]);
const LENGTH_VALUES = new Set(['present', 'absent', 'not_applicable', 'uncertain']);

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
  if (packet.schemaVersion !== 2) errors.push('schemaVersion must be 2.');
  if (packet.packetType !== PACKET_TYPE) errors.push('packetType must be ' + PACKET_TYPE + '.');
  if (packet.blindnessMode !== BLINDNESS_MODE) errors.push('blindnessMode must be ' + BLINDNESS_MODE + '.');
  if (!['A', 'B'].includes(packet.reviewerSlot)) errors.push('reviewerSlot must be A or B.');
  if (expectedSlot && packet.reviewerSlot !== expectedSlot) errors.push('reviewerSlot does not match the requested slot.');
  if (!/^[a-f0-9]{64}$/u.test(packet.queueSha256 || '')) errors.push('queueSha256 must be a lowercase SHA-256 digest.');
  else if (packet.queueSha256 !== sha256(queueText)) errors.push('Submission was prepared from a different queue revision; regenerate and review the current packet.');
  if (!Array.isArray(packet.instructions)) errors.push('instructions must be an array.');
  else if (JSON.stringify(packet.instructions) !== JSON.stringify(REVIEW_INSTRUCTIONS)) {
    errors.push('instructions do not match the required source-blind protocol.');
  }
  if (!Array.isArray(packet.cases)) errors.push('cases must be an array.');

  let sourceCases;
  try {
    sourceCases = selectReviewableCases(queue);
  } catch (error) {
    errors.push('Canonical queue is invalid: ' + (error instanceof Error ? error.message : String(error)));
    return { valid: false, errors };
  }
  if (!Array.isArray(packet.cases)) return { valid: false, errors };

  const cases = packet.cases;
  if (cases.length !== sourceCases.length) errors.push('Submission must contain exactly ' + sourceCases.length + ' cases.');
  const byId = new Map();
  let packetReviewerId = null;
  let packetQualification = null;
  for (let index = 0; index < cases.length; index++) {
    const item = cases[index];
    const expectedId = blindCaseId(index);
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
    if (item.caseId !== expectedId) errors.push('Case order/ID must remain ' + expectedId + ' for the exact queue revision.');
    const original = sourceCases[index];
    if (original && item.input !== original.input) errors.push(expectedId + ': input was changed.');
    if (!item.reviewForm || typeof item.reviewForm !== 'object' || Array.isArray(item.reviewForm)) {
      errors.push(expectedId + ': reviewForm is missing.');
      continue;
    }
    const form = item.reviewForm;
    onlyKeys(form, FORM_KEYS, expectedId + '.reviewForm', errors);
    if (form.reviewerSlot !== packet.reviewerSlot) errors.push(expectedId + ': reviewer slot mismatch.');
    if (!nonBlank(form.reviewerId)) errors.push(expectedId + ': reviewerId is required.');
    else if (packetReviewerId === null) packetReviewerId = form.reviewerId.trim();
    else if (packetReviewerId !== form.reviewerId.trim()) errors.push(expectedId + ': reviewerId must be consistent across the packet.');
    if (!nonBlank(form.qualification)) errors.push(expectedId + ': qualification is required.');
    else if (packetQualification === null) packetQualification = form.qualification.trim();
    else if (packetQualification !== form.qualification.trim()) errors.push(expectedId + ': qualification must be consistent across the packet.');
    if (!validateReviewedAt(form.reviewedAt)) errors.push(expectedId + ': reviewedAt must be a valid ISO timestamp with timezone.');
    if (!nonBlank(form.methodReference)) errors.push(expectedId + ': methodReference is required.');
    if (!nonBlank(form.broadIpa)) errors.push(expectedId + ': broadIpa is required.');
    if (!nonBlank(form.syllableBoundaries)) errors.push(expectedId + ': syllableBoundaries must be recorded (use the project convention or explain uncertainty in notes).');
    if (!LENGTH_VALUES.has(form.vowelLengthAssessment)) {
      errors.push(expectedId + ': vowelLengthAssessment must be present, absent, not_applicable, or uncertain.');
    }
    if (form.notes !== null && form.notes !== undefined && typeof form.notes !== 'string') {
      errors.push(expectedId + ': notes must be a string or null.');
    }
  }
  for (let index = 0; index < sourceCases.length; index++) {
    const id = blindCaseId(index);
    if (!byId.has(id)) errors.push('Missing caseId "' + id + '".');
  }

  return {
    valid: errors.length === 0,
    reviewerSlot: packet.reviewerSlot,
    blindnessMode: packet.blindnessMode,
    queueSha256: packet.queueSha256,
    expectedCaseCount: sourceCases.length,
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
      console.log('Validates a completed packet against the exact queue revision; report is JSON on stdout.');
      return 0;
    }
    if (arg === '--reviewer') {
      if (expectedSlot !== null) throw new Error('--reviewer may be supplied only once.');
      expectedSlot = argv[++i];
      if (!['A', 'B'].includes(expectedSlot)) throw new Error('--reviewer requires A or B.');
      continue;
    }
    if (arg === '--queue') {
      if (queuePath !== null) throw new Error('--queue may be supplied only once.');
      queuePath = argv[++i];
      if (!queuePath || queuePath.startsWith('--')) throw new Error('--queue requires a JSON file path.');
      continue;
    }
    if (arg.startsWith('--')) throw new Error('Unknown argument: ' + arg);
    if (file !== null) throw new Error('Only one submission file may be supplied.');
    file = arg;
  }
  if (!file) throw new Error('A reviewer submission JSON path is required.');
  const [packetText, queueText] = await Promise.all([
    readFile(resolve(file), 'utf8'),
    readFile(queuePath ? resolve(queuePath) : fileURLToPath(QUEUE_URL), 'utf8'),
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
