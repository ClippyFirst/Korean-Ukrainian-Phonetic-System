#!/usr/bin/env node
/**
 * Build a source- and candidate-blind independent broad-IPA review packet.
 *
 * Source evidence is validated internally but never projected into the packet.
 * The packet contains opaque case IDs and Korean input only. No network access
 * occurs and the canonical queue is never modified.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BLINDNESS_MODE,
  PACKET_TYPE,
  REVIEW_INSTRUCTIONS,
  blindCaseId,
  parseReviewerSlot,
  selectReviewableCases,
  sha256,
} from './ipa-review-packet-shared.mjs';

const QUEUE_URL = new URL('../research/ipa-adjudication-queue.json', import.meta.url);

export function buildReviewerPacket(queueText, reviewerSlot) {
  const slot = parseReviewerSlot(reviewerSlot);
  if (typeof queueText !== 'string' || !queueText.trim()) throw new Error('IPA queue must be non-empty JSON text.');
  let queue;
  try {
    queue = JSON.parse(queueText);
  } catch {
    throw new Error('IPA queue is not valid JSON.');
  }
  const sourceCases = selectReviewableCases(queue);

  return {
    schemaVersion: 2,
    packetType: PACKET_TYPE,
    blindnessMode: BLINDNESS_MODE,
    reviewerSlot: slot,
    queueSha256: sha256(queueText),
    instructions: [...REVIEW_INSTRUCTIONS],
    cases: sourceCases.map((item, index) => ({
      caseId: blindCaseId(index),
      input: item.input,
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
    })),
  };
}

async function main(argv = process.argv.slice(2)) {
  let reviewer = null;
  let queuePath = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/build-ipa-review-packet.mjs --reviewer A|B [--queue <queue.json>]');
      console.log('Writes a source- and candidate-blind JSON packet to stdout; no files or network requests are made.');
      return 0;
    }
    if (arg === '--reviewer') {
      if (reviewer !== null) throw new Error('--reviewer may be supplied only once.');
      reviewer = argv[++i];
      if (!reviewer || reviewer.startsWith('--')) throw new Error('--reviewer requires A or B.');
      continue;
    }
    if (arg === '--queue') {
      if (queuePath !== null) throw new Error('--queue may be supplied only once.');
      queuePath = argv[++i];
      if (!queuePath || queuePath.startsWith('--')) throw new Error('--queue requires a JSON file path.');
      continue;
    }
    throw new Error('Unknown argument: ' + arg);
  }
  if (reviewer === null) throw new Error('--reviewer A or --reviewer B is required.');
  const queueText = await readFile(queuePath ? resolve(queuePath) : fileURLToPath(QUEUE_URL), 'utf8');
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
