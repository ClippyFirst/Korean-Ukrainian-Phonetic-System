import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { auditSourceRegister, parseCsv } from '../scripts/audit-source-register.mjs';

test('CSV parser preserves commas, doubled quotes, CRLF and embedded newlines', () => {
  assert.deepEqual(parseCsv('id,description\r\nA,"a, b and ""quoted"" text"\r\nB,"line one\nline two"\r\n'), [
    ['id', 'description'],
    ['A', 'a, b and "quoted" text'],
    ['B', 'line one\nline two'],
  ]);
});

test('CSV parser rejects unterminated quotes and junk after a closing quote', () => {
  assert.throws(() => parseCsv('id,value\nA,"unfinished'), /ends inside a quoted field/u);
  assert.throws(() => parseCsv('id,value\nA,"closed"x'), /Unexpected character after closing quote/u);
});

test('source register rejects malformed and non-HTTPS URLs', () => {
  const csv = [
    'source_id,source_type,title_or_project,url,version_or_date,authority_or_role,license_status,coverage,contribution_expected,review_status,integration_status,limitations_or_next_action',
    'SRC-BAD,normative,Bad URL,https://,2026,authority,not_assessed,rule,rule,unreviewed,not integrated,fix URL',
    'SRC-HTTP,normative,HTTP URL,http://example.org/source,2026,authority,not_assessed,rule,rule,unreviewed,not integrated,upgrade URL',
  ].join('\n');
  const report = auditSourceRegister(csv);
  assert.equal(report.structuralErrorCount, 2);
  assert.deepEqual(report.structuralErrors.map(item => item.sourceId), ['SRC-BAD', 'SRC-HTTP']);
});

test('source rights triage never promotes vague source descriptions to a license decision', () => {
  const csv = [
    'source_id,source_type,title_or_project,url,version_or_date,authority_or_role,license_status,coverage,contribution_expected,review_status,integration_status,limitations_or_next_action',
    'SRC-A,normative,Official source,https://example.org/a,2026,authority,not_assessed,rule,rule,unreviewed,not integrated,review terms',
    'SRC-B,normative,Policy page,https://example.org/b,2026,authority,"site-wide policy found; item-level KOGL type not checked",rule,rule,reviewed,registered,check item',
    'SRC-C,software,Package,https://example.org/c,1.0,upstream,Apache-2.0 verified on upstream LICENSE,package,adapter,reviewed,integrated,check retained files',
    'SRC-D,other,Not applicable,https://example.org/d,2026,authority,not_applicable,none,none,reviewed,not used,out of scope',
    'SRC-E,other,Unclear,https://example.org/e,2026,authority,Official case-specific pronunciation clarification,pronunciation,context,reviewed,fixture,rights still unclear',
    'SRC-F,other,Unverified,https://example.org/f,2026,authority,not_verified,unknown,unknown,unreviewed,not integrated,review rights',
    'SRC-G,other,PDF,https://example.org/g,2026,authority,verify PDF terms,unknown,unknown,unreviewed,not integrated,review terms',
    'SRC-H,normative,Policy,https://example.org/h,2026,authority,site-wide policy permits use unless item-specific KOGL is marked,unknown,unknown,unreviewed,not integrated,inspect exact item',
    'SRC-I,software,Retained artifact,https://example.org/i,1.0,upstream,not_assessed,artifact,source,unreviewed,copied into runtime,review item-level terms',
    'SRC-J,source data,No-copy reference,https://example.org/j,1.0,upstream,not_assessed,citation,reference,unreviewed,no source file copied into repository,confirm no reuse',
    'SRC-K,other,Citation-only reference,https://example.org/k,2026,authority,citation-only; no source file redistributed,bibliography,citation,reviewed,citation-only reference; no source material copied,not a redistribution blocker',
  ].join('\n');
  const report = auditSourceRegister(csv);
  assert.equal(report.structuralErrorCount, 0);
  assert.deepEqual(report.rightsClassificationCounts, {
    ITEM_LEVEL_LICENSE_RECORDED: 1,
    NOT_APPLICABLE_RECORDED: 1,
    CITATION_ONLY_NO_REUSE: 1,
    REVIEW_REQUIRED: 7,
    MANUAL_CLASSIFICATION_REQUIRED: 1,
  });
  assert.deepEqual(report.itemLevelRightsNotClosed.map(item => item.sourceId), ['SRC-A', 'SRC-B', 'SRC-E', 'SRC-F', 'SRC-G', 'SRC-H', 'SRC-I', 'SRC-J', 'SRC-K']);
  assert.deepEqual(report.redistributionRightsNotClosed.map(item => item.sourceId), ['SRC-I']);
  assert.ok(!report.redistributionRightsNotClosed.some(item => item.sourceId === 'SRC-J'), 'negated no-copy statements must not be treated as redistribution');
  assert.ok(!report.redistributionRightsNotClosed.some(item => item.sourceId === 'SRC-K'), 'citation-only references must not be treated as redistribution');
});

test('real source register is structurally valid and unresolved rights remain visible', () => {
  const csv = readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8');
  const report = auditSourceRegister(csv);
  assert.equal(report.structuralErrorCount, 0, JSON.stringify(report.structuralErrors));
  assert.equal(report.sourceRegisterRows, 214);
  assert.equal(report.rightsClassificationCounts.ITEM_LEVEL_LICENSE_RECORDED, 4);
  assert.equal(report.rightsClassificationCounts.NOT_APPLICABLE_RECORDED, 1);
  assert.ok(report.rightsClassificationCounts.CITATION_ONLY_NO_REUSE > 0);
  assert.ok(report.rightsClassificationCounts.REVIEW_REQUIRED > 0);
  assert.ok(report.rightsClassificationCounts.MANUAL_CLASSIFICATION_REQUIRED > 0);
  assert.equal(
    report.itemLevelRightsNotClosed.length,
    report.rightsClassificationCounts.CITATION_ONLY_NO_REUSE + report.rightsClassificationCounts.REVIEW_REQUIRED + report.rightsClassificationCounts.MANUAL_CLASSIFICATION_REQUIRED,
  );
  assert.ok(report.itemLevelRightsNotClosed.every(item => item.sourceId && item.currentLicenseStatus !== null));
  const ug = report.records.find(record => record.sourceId === 'SRC-UGTPHON-EMNLP-2026');
  assert.equal(ug.rightsReviewStatus, 'ITEM_LEVEL_LICENSE_RECORDED', 'the explicit UGTPHON Korean-subset Apache-2.0 declaration covers the retained excerpts');
  assert.ok(!report.redistributionRightsNotClosed.some(item => item.sourceId === 'SRC-IPA-DICT-KO'), 'the source register explicitly says no IPA-Dict file is copied');
  const c12AcousticSource = report.records.find(record => record.sourceId === 'SRC-JIPA-SCHWEIZER-AHN-KWON-2026-SEOUL-STOPS');
  assert.ok(c12AcousticSource, 'the newly registered C12 primary acoustic source must be present');
  assert.equal(c12AcousticSource.rightsReviewStatus, 'ITEM_LEVEL_LICENSE_RECORDED');
  assert.match(c12AcousticSource.currentLicenseStatus, /^CC-BY-4\.0 verified/u);
  const unresolvedIds = new Set(report.itemLevelRightsNotClosed.map(item => item.sourceId));
  assert.ok(unresolvedIds.has('SRC-NIKL-QNA-327466'));
  assert.ok(unresolvedIds.has('SRC-NIKL-QNA-313481'));
  assert.ok(unresolvedIds.has('SRC-NIKL-QNA-333044'));
  assert.ok(unresolvedIds.has('SRC-NIKL-QNA-307960'));
  assert.ok(unresolvedIds.has('SRC-NIKL-QNA-317798'));
  assert.ok(unresolvedIds.has('SRC-NIKL-QNA-310899'));
  assert.ok(unresolvedIds.has('SRC-NIKL-QNA-331601'));
  assert.ok(unresolvedIds.has('SRC-NIKL-EDU-2021-DEPENDENT-SI'));
  assert.ok(unresolvedIds.has('SRC-KCI-ITO-2007-MORPHEME-STRUCTURE'));
  assert.ok(unresolvedIds.has('SRC-NIKL-QNA-319525'));
  assert.ok(unresolvedIds.has('SRC-NIKL-QNA-334585'));
  assert.ok(unresolvedIds.has('SRC-JUN15'));
  assert.ok(unresolvedIds.has('SRC-NIKL-KRDICT-62281'));
  assert.ok(unresolvedIds.has('SRC-NIKL-EDU-MOSKVA'));
  assert.ok(unresolvedIds.has('SRC-NIKL-KRDICT-82835'));
  assert.ok(unresolvedIds.has('SRC-NIKL-KRDICT-75022'));
  assert.ok(unresolvedIds.has('SRC-NIKL-KRDICT-HYEMO'));
  assert.ok(unresolvedIds.has('SRC-NIKL-KRDICT-89917'));
  assert.ok(unresolvedIds.has('SRC-WIKTIONARY-JUNGSIMDALMEUM'));
  assert.ok(unresolvedIds.has('SRC-NIKL-LOANWORD-GAME-2005'));
  assert.ok(unresolvedIds.has('SRC-KANG-2009-PALATAL-GLIDE'));
  assert.ok(unresolvedIds.has('SRC-KANG-2015-VOWEL-LENGTH-MERGER'));
  assert.ok(unresolvedIds.has('SRC-CHUNG-2022-MID-FRONT-PHONEMIC-STATUS'));
  assert.ok(unresolvedIds.has('SRC-LEE-2023-REVISITING-MID-FRONT-MERGER'));
  assert.ok(unresolvedIds.has('SRC-NIKL-KRDICT-YUSASEONG'));
});

test('CLI reports structure by default and strict rights gate checks redistribution, not citations', () => {
  const script = fileURLToPath(new URL('../scripts/audit-source-register.mjs', import.meta.url));
  const normal = spawnSync(process.execPath, [script, '--json'], { cwd: process.cwd(), encoding: 'utf8' });
  assert.equal(normal.status, 0, normal.stderr);
  const report = JSON.parse(normal.stdout);
  assert.equal(report.sourceRegisterRows, 212);
  assert.equal(report.structuralErrorCount, 0);
  assert.ok(report.itemLevelRightsNotClosed.length > 0);
  assert.equal(report.redistributionRightsNotClosed.length, 0);

  const strict = spawnSync(process.execPath, [script, '--require-reviewed-rights'], { cwd: process.cwd(), encoding: 'utf8' });
  assert.equal(strict.status, 0, 'citation-only and unknown-use references must not block runtime work when no redistribution is recorded');
});