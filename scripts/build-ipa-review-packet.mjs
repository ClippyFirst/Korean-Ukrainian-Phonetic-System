#!/usr/bin/env node
/**
 * Build a blinded, independent broad-IPA review packet from the canonical queue.
 *
 * This is a one-way projection: no candidate IPA, target-layer output, other
 * reviewer submission, or reconciliation decision is copied into the packet.
 * It performs no network access and never edits the source queue.
 */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUEUE_URL = new URL('../research/ipa-adjudication-queue.json', import.meta.url);
const OFFICIAL_HOSTS = new Set(['korean.go.kr', 'www.korean.go.kr']);

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function parseReviewerSlot(value) {
  const slot = String(value ?? '').trim().toUpperCase();
  if (slot !== 'A' && slot !== 'B') throw new Error('--reviewer must be A or B.');
  return slot;
}

export function buildReviewerPacket(queueText, reviewerSlot) {
  const slot = parseReviewerSlot(reviewerSlot);
  if (typeof queueText !== 'string' || !queueText.trim()) throw new Error('IPA queue must be non-empty JSON text.');
  let queue;
  try {
    queue = JSON.parse(queueText);
  } catch {
    throw new Error('IPA queue is not valid JSON.');
  }
  if (!queue || queue.schemaVersion !== 2 || !Array.isArray(queue.cases) || queue.cases.length === 0) {
    throw new Error('Expected IPA adjudication queue schemaVersion 2 with at least one case.');
  }

  const seen = new Set();
  const cases = queue.cases.map((item) => {
    if (!item || typeof item !== 'object') throw new Error('Each queue case must be an object.');
    for (const field of ['caseId', 'input', 'surfaceEvidenceStatus', 'surfaceEvidenceUrl', 'sourceLocator', 'normativeSurfaceComparator']) {
      if (typeof item[field] !== 'string' || !item[field].trim()) {
        throw new Error((item.caseId || 'unknown case') + ': required source-backed field ' + field + ' is missing.');
      }
    }
    if (seen.has(item.caseId)) throw new Error('Duplicate IPA case ID: ' + item.caseId);
    seen.add(item.caseId);

    let sourceUrl;
    try {
      sourceUrl = new URL(item.surfaceEvidenceUrl);
    } catch {
      throw new Error(item.caseId + ': invalid source evidence URL.');
    }
    if (sourceUrl.protocol !== 'https:' || !OFFICIAL_HOSTS.has(sourceUrl.hostname.toLowerCase())) {
      throw new Error(item.caseId + ': evidence URL must use an official NIKL HTTPS host.');
    }

    return {
      caseId: item.caseId,
      input: item.input,
      surfaceEvidenceStatus: item.surfaceEvidenceStatus,
      surfaceEvidenceUrl: sourceUrl.toString(),
      sourceLocator: item.sourceLocator,
      normativeSurfaceComparator: item.normativeSurfaceComparator,
      reviewForm: {
        reviewerSlot: slot,
        reviewerId: null,
        qualification: null,
        reviewedAt: null,
        methodReference: null,
        broadIpa: null,
        syllableBoundaries: null,
        vowelLengthAssessment: null,
        notes: null,
      },
    };
  });

  return {
    schemaVersion: 1,
    packetType: 'independent-broad-IPA-review',
    reviewerSlot: slot,
    queueSha256: sha256(queueText),
    instructions: [
      'Transcribe each Korean form independently into broad IPA under the agreed project convention.',
      'Do not infer IPA by copying the Korean Hangul surface comparator; it is evidence for the Korean surface form, not IPA.',
      'Do not consult or disclose another reviewer’s packet before submitting this packet.',
      'Record the exact method/reference, syllable boundaries, and whether vowel length is present, absent, or not applicable.',
      'Preserve uncertainty in notes; do not silently normalize disputed or context-dependent readings.',
      'This packet intentionally contains no candidate IPA, Ukrainian target, other reviewer fields, or reconciliation decision.',
    ],
    cases,
  };
}

async function main(argv = process.argv.slice(2)) {
  let reviewer = null;
  let queuePath = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/build-ipa-review-packet.mjs --reviewer A|B [--queue <queue.json>]');
      console.log('Writes a blinded reviewer packet as JSON to stdout; no files or network requests are made.');
      return 0;
    }
    if (arg === '--queue') {
      if (queuePath !== null) throw new Error('--queue may be supplied only once.');
      queuePath = argv[++i];
      if (!queuePath || queuePath.startsWith('--')) throw new Error('--queue requires a JSON file path.');
      continue;
    }
    if (arg === '--reviewer') {
      if (reviewer !== null) throw new Error('--reviewer may be supplied only once.');
      reviewer = argv[++i];
      if (!reviewer || reviewer.startsWith('--')) throw new Error('--reviewer requires A or B.');
      continue;
    }
    throw new Error('Unknown argument: ' + arg);
  }
  if (reviewer === null) throw new Error('--reviewer A or --reviewer B is required.');
  const queueText = await readFile(queuePath ? resolve(queuePath) : QUEUE_URL, 'utf8');
  const packet = buildReviewerPacket(queueText, reviewer);
  process.stdout.write(JSON.stringify(packet, null, 2) + '\n');
  return 0;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  try {
    process.exitCode = await main();
  } catch (error) {
    console.error('IPA review packet failed closed: ' + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 2;
  }
}
