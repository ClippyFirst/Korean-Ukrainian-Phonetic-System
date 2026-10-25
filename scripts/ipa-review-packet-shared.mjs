/** Shared contract for source-blind independent IPA review packets. */
import { createHash } from 'node:crypto';

export const PACKET_TYPE = 'independent-broad-IPA-review';
export const BLINDNESS_MODE = 'source-and-candidate-blind';
export const OFFICIAL_HOSTS = new Set([
  'korean.go.kr',
  'www.korean.go.kr',
  'm.korean.go.kr',
  'krdict.korean.go.kr',
]);

export const REVIEW_INSTRUCTIONS = Object.freeze([
  'Transcribe each Korean form independently into broad IPA under the agreed project convention.',
  'This is a source-blind first pass: do not look up the exact form or consult official pronunciation evidence before submitting.',
  'Do not consult engine outputs, candidate IPA, Ukrainian targets, another reviewer’s packet, or reconciliation notes.',
  'Record the exact method/reference, syllable boundaries, and whether vowel length is present, absent, not applicable, or uncertain.',
  'Preserve uncertainty in notes; do not silently normalize disputed, nonstandard, or context-dependent readings.',
  'The packet contains only an opaque case ID and Korean input; source evidence is withheld until independent annotations are complete.',
]);

export function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

export function parseReviewerSlot(value) {
  const slot = String(value ?? '').trim().toUpperCase();
  if (slot !== 'A' && slot !== 'B') throw new Error('--reviewer must be A or B.');
  return slot;
}

export function blindCaseId(index) {
  return 'BLIND-' + String(index + 1).padStart(3, '0');
}

/**
 * Return source evidence internally for validation, never for the reviewer packet.
 * Schema 2 is the canonical IPA queue. Schema 1 is the R002/R003 source queue,
 * which may contain candidate engine output but is projected to verified sources only.
 */
export function selectReviewableCases(queue) {
  if (!queue || typeof queue !== 'object' || !Array.isArray(queue.cases) || queue.cases.length === 0) {
    throw new Error('Expected a non-empty IPA adjudication queue.');
  }

  let sourceCases;
  if (queue.schemaVersion === 2) {
    sourceCases = queue.cases;
  } else if (queue.schemaVersion === 1) {
    sourceCases = queue.cases
      .filter(item => item?.sourceStatus === 'SOURCE_FOUND_PENDING_IPA')
      .map(item => ({
        caseId: item.caseId,
        input: item.input,
        surfaceEvidenceStatus: item.sourceStatus,
        surfaceEvidenceUrl: item.sourceLocator,
        sourceLocator: item.sourceLocator,
        normativeSurfaceComparator: item.sourceExcerpt,
      }));
    if (sourceCases.length === 0) {
      throw new Error('R002/R003 queue has no SOURCE_FOUND_PENDING_IPA cases; resolve exact-form sources before preparing IPA review.');
    }
  } else {
    throw new Error('Expected IPA adjudication queue schemaVersion 2 or R002/R003 source queue schemaVersion 1.');
  }

  const seen = new Set();
  return sourceCases.map(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error('Each queue case must be an object.');
    }
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
      sourceCaseId: item.caseId,
      input: item.input,
      surfaceEvidenceStatus: item.surfaceEvidenceStatus,
      surfaceEvidenceUrl: sourceUrl.toString(),
      sourceLocator: item.sourceLocator,
      normativeSurfaceComparator: item.normativeSurfaceComparator,
    };
  });
}
