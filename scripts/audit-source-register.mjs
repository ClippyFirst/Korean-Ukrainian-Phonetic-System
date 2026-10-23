#!/usr/bin/env node
/**
 * Conservative, read-only audit of research/SOURCE-REGISTER.csv.
 *
 * This tool validates CSV structure and creates an ephemeral rights-review queue.
 * It never infers permission from a citation, source authority, or site-wide policy.
 * "verified" is emitted only for an explicit item-level license assertion in the
 * register; ambiguous free-text states remain assigned for human review.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUIRED_COLUMNS = Object.freeze([
  'source_id',
  'source_type',
  'title_or_project',
  'url',
  'version_or_date',
  'authority_or_role',
  'license_status',
  'coverage',
  'contribution_expected',
  'review_status',
  'integration_status',
  'limitations_or_next_action',
]);

/** Parse RFC 4180-style CSV, including quoted commas, CRLF, embedded newlines and doubled quotes. */
export function parseCsv(input) {
  if (typeof input !== 'string') throw new TypeError('CSV input must be a string.');
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let quoteClosed = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
          quoteClosed = true;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (quoteClosed && char !== ',' && char !== '\r' && char !== '\n') {
      throw new Error(`Unexpected character after closing quote at offset ${i}.`);
    }
    if (char === '"' && field.length === 0 && !quoteClosed) {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
      quoteClosed = false;
    } else if (char === '\r' || char === '\n') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      if (!(row.length === 1 && row[0] === '')) rows.push(row);
      row = [];
      field = '';
      quoteClosed = false;
    } else {
      field += char;
    }
  }

  if (inQuotes) throw new Error('CSV ends inside a quoted field.');
  if (field.length || row.length || quoteClosed) {
    row.push(field);
    if (!(row.length === 1 && row[0] === '')) rows.push(row);
  }
  return rows;
}

const UNASSESSED_PATTERNS = [
  /\bnot[_ -]?(?:yet[_ -]?)?(?:assessed|checked|verified|reviewed|confirmed)\b/iu,
  /\bverify\b.{0,120}\b(?:original\s+publication|terms|notices|article\s+terms|document\s+terms|reuse\s+terms|license|licence|pdf)\b/iu,
  /\bitem[- ]level\b.{0,100}\bnot[_ -]?(?:yet[_ -]?)?(?:checked|verified|assessed)\b/iu,
  /\bsite[- ]wide\b.{0,180}\b(?:item[- ]level|per[- ]item|page[- ]level|unless\b.{0,80}\bKOGL)\b/iu,
  /\bper[- ]dataset\b/iu,
  /\beach\s+(?:corpus|dataset|item)\s+has\s+its\s+own\b/iu,
  /\baccess\s+and\s+terms\s+vary\b/iu,
  /\bupstream\b.{0,120}\b(?:verify|notices|not[_ -]?verified|reported)\b/iu,
];

function classifyRights(value) {
  const text = String(value ?? '').trim();
  if (!text) return { status: 'REVIEW_REQUIRED', reason: 'license_status is empty' };
  if (/^not[_ -]?applicable$/iu.test(text)) {
    return { status: 'NOT_APPLICABLE_RECORDED', reason: 'register explicitly says not_applicable; verify the scope remains correct' };
  }
  if (UNASSESSED_PATTERNS.some(pattern => pattern.test(text))) {
    return { status: 'REVIEW_REQUIRED', reason: 'register text explicitly records unassessed, unverified, item-level, or dataset-specific rights' };
  }
  // Keep this intentionally narrow: a general license name or a citation alone is not proof.
  if (/^(?:Apache-2\.0|MIT|BSD-\d-Clause|CC-BY(?:-\d\.\d)?|CC0)\s+verified\b/iu.test(text)) {
    return { status: 'ITEM_LEVEL_LICENSE_RECORDED', reason: 'register explicitly records a verified license; human review must still confirm the actual retained artifact and obligations' };
  }
  return { status: 'MANUAL_CLASSIFICATION_REQUIRED', reason: 'free-text value does not unambiguously establish an item-level rights decision' };
}

export function auditSourceRegister(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length < 2) throw new Error('Source register must include a header and at least one data row.');
  const header = rows[0].map(value => value.trim());
  const duplicateHeaders = header.filter((value, index) => header.indexOf(value) !== index);
  if (duplicateHeaders.length) throw new Error('Duplicate CSV header(s): ' + [...new Set(duplicateHeaders)].join(', '));
  const missingColumns = REQUIRED_COLUMNS.filter(column => !header.includes(column));
  if (missingColumns.length) throw new Error('Missing required source-register column(s): ' + missingColumns.join(', '));

  const records = [];
  const errors = [];
  const seenIds = new Set();
  for (let index = 1; index < rows.length; index++) {
    const values = rows[index];
    if (values.length !== header.length) {
      errors.push({ row: index + 1, sourceId: values[0] ?? null, error: `expected ${header.length} columns, found ${values.length}` });
      continue;
    }
    const record = Object.fromEntries(header.map((name, column) => [name, values[column].trim()]));
    if (!record.source_id) errors.push({ row: index + 1, sourceId: null, error: 'source_id is blank' });
    else if (seenIds.has(record.source_id)) errors.push({ row: index + 1, sourceId: record.source_id, error: 'duplicate source_id' });
    else seenIds.add(record.source_id);
    if (record.url) {
      try {
        const parsedUrl = new URL(record.url);
        if (parsedUrl.protocol !== 'https:' || !parsedUrl.hostname) throw new Error('invalid HTTPS URL');
      } catch {
        errors.push({ row: index + 1, sourceId: record.source_id || null, error: 'non-empty source URL must be a valid HTTPS URL' });
      }
    }
    const rights = classifyRights(record.license_status);
    records.push({
      row: index + 1,
      sourceId: record.source_id || null,
      sourceType: record.source_type,
      title: record.title_or_project,
      url: record.url || null,
      currentLicenseStatus: record.license_status || null,
      rightsReviewStatus: rights.status,
      reason: rights.reason,
      reviewStatus: record.review_status,
      integrationStatus: record.integration_status,
    });
  }

  const counts = Object.fromEntries([
    'ITEM_LEVEL_LICENSE_RECORDED',
    'NOT_APPLICABLE_RECORDED',
    'REVIEW_REQUIRED',
    'MANUAL_CLASSIFICATION_REQUIRED',
  ].map(status => [status, records.filter(record => record.rightsReviewStatus === status).length]));

  return {
    schemaVersion: 1,
    audit: 'read-only source-register structure and rights-review queue',
    sourceRegisterRows: records.length,
    structuralErrorCount: errors.length,
    structuralErrors: errors,
    rightsClassificationCounts: counts,
    itemLevelRightsNotClosed: records.filter(record =>
      ['REVIEW_REQUIRED', 'MANUAL_CLASSIFICATION_REQUIRED'].includes(record.rightsReviewStatus)),
    records,
    limitations: [
      'Classification is a triage aid, not a legal opinion or permission grant.',
      'A source citation, site-wide policy, or package metadata does not by itself clear the exact retained artifact.',
      'The audit does not access external websites, inspect page-level KOGL labels, or modify source-register statuses.',
    ],
  };
}

async function main(argv = process.argv.slice(2)) {
  const strictRights = argv.includes('--require-reviewed-rights');
  const jsonOnly = argv.includes('--json');
  const unknown = argv.filter(arg => !['--require-reviewed-rights', '--json', '--help', '-h'].includes(arg));
  if (unknown.length) throw new Error('Unknown argument(s): ' + unknown.join(', '));
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log('Usage: node scripts/audit-source-register.mjs [--json] [--require-reviewed-rights]');
    console.log('--require-reviewed-rights exits 3 while any item-level rights classification remains open.');
    return 0;
  }
  const sourcePath = resolve('research/SOURCE-REGISTER.csv');
  const result = auditSourceRegister(await readFile(sourcePath, 'utf8'));
  if (!jsonOnly) {
    console.log('Source register structural audit');
    console.log(JSON.stringify({
      sourceRegisterRows: result.sourceRegisterRows,
      structuralErrorCount: result.structuralErrorCount,
      rightsClassificationCounts: result.rightsClassificationCounts,
      itemLevelRightsNotClosed: result.itemLevelRightsNotClosed.length,
    }, null, 2));
    if (result.structuralErrors.length) console.error(JSON.stringify(result.structuralErrors, null, 2));
    console.log('Rights review queue (first 30 rows):');
    console.log(JSON.stringify(result.itemLevelRightsNotClosed.slice(0, 30), null, 2));
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
  if (result.structuralErrorCount) return 2;
  if (strictRights && result.itemLevelRightsNotClosed.length) return 3;
  return 0;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  try {
    process.exitCode = await main();
  } catch (error) {
    console.error('Source register audit failed closed: ' + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 2;
  }
}
