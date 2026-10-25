#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const MANIFEST_URL = new URL('../data/korean/ipa_holdout_2026-10-24.json', import.meta.url);
const OFFICIAL_HOSTS = new Set(['korean.go.kr', 'www.korean.go.kr']);
const sha256 = text => createHash('sha256').update(text, 'utf8').digest('hex');
export function buildHoldoutReviewQueue(manifestText) {
  if (typeof manifestText !== 'string' || !manifestText.trim()) throw new Error('Holdout manifest must be non-empty JSON text.');
  let manifest; try { manifest = JSON.parse(manifestText); } catch { throw new Error('Holdout manifest is not valid JSON.'); }
  if (!manifest || manifest.schemaVersion !== '1.0.0' || manifest.split !== 'HOLDOUT' || !Array.isArray(manifest.cases) || !manifest.cases.length) throw new Error('Expected the versioned frozen IPA HOLDOUT manifest.');
  if (manifest.caseCount !== manifest.cases.length) throw new Error('Manifest caseCount does not match cases.length.');
  if (!String(manifest.status || '').includes('FROZEN')) throw new Error('Refusing to generate a review queue from a non-frozen manifest.');
  const seen = new Set();
  const cases = manifest.cases.map(item => {
    if (!item || typeof item !== 'object') throw new Error('Every holdout item must be an object.');
    for (const key of ['caseId','input','sourceRule','sourceAuthority','sourceLocator','sourceExcerpt']) if (typeof item[key] !== 'string' || !item[key].trim()) throw new Error(String(item.caseId || 'unknown case') + ': required evidence field ' + key + ' is missing.');
    if (seen.has(item.caseId)) throw new Error('Duplicate holdout case ID: ' + item.caseId); seen.add(item.caseId);
    if (item.tuningUseProhibited !== true) throw new Error(item.caseId + ': holdout tuning prohibition must remain true.');
    if (item.engineOutputsStored !== false) throw new Error(item.caseId + ': holdout must not contain stored engine outputs.');
    if (item.ipaGold !== null || item.ipaGoldStatus !== 'PENDING_TWO_INDEPENDENT_REVIEWERS') throw new Error(item.caseId + ': refuses to project a case that already has IPA labels or a changed annotation state.');
    if (!Array.isArray(item.allowedSurfaceReadings) || !item.allowedSurfaceReadings.length || item.allowedSurfaceReadings.some(value => typeof value !== 'string' || !value.trim())) throw new Error(item.caseId + ': source-backed Hangul surface comparator is required.');
    let url; try { url = new URL(item.sourceLocator); } catch { throw new Error(item.caseId + ': sourceLocator must be a URL.'); }
    if (url.protocol !== 'https:' || !OFFICIAL_HOSTS.has(url.hostname.toLowerCase())) throw new Error(item.caseId + ': source URL must use an official NIKL HTTPS host.');
    return { caseId:item.caseId, input:item.input, surfaceEvidenceStatus:item.surfaceEvidenceStatus, surfaceEvidenceUrl:url.toString(), sourceLocator:item.sourceAuthority + '; ' + item.sourceRule + '; source excerpt: ' + item.sourceExcerpt, normativeSurfaceComparator:item.allowedSurfaceReadings.join(' | ') };
  });
  return { schemaVersion:2, title:'Blinded-review projection of frozen ClippyFirst Korean IPA holdout', sourceManifest:'data/korean/ipa_holdout_2026-10-24.json', sourceManifestSha256:sha256(manifestText), split:'HOLDOUT', tuningUseProhibited:true, cases };
}
async function main(argv = process.argv.slice(2)) {
  if (argv.some(arg => arg !== '--help' && arg !== '-h')) throw new Error('Unknown argument.');
  if (argv.length) { console.log('Usage: node scripts/build-korean-holdout-ipa-queue.mjs'); return 0; }
  const text = await readFile(MANIFEST_URL, 'utf8'); process.stdout.write(JSON.stringify(buildHoldoutReviewQueue(text), null, 2) + '\n'); return 0;
}
const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) { try { process.exitCode = await main(); } catch (error) { console.error('Holdout IPA queue generation failed closed: ' + (error instanceof Error ? error.message : String(error))); process.exitCode = 2; } }