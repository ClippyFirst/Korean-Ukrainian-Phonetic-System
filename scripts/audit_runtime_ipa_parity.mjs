#!/usr/bin/env node
/**
 * Browser half of the Python/browser IPA parity audit.
 * Usage: node --experimental-strip-types scripts/audit_runtime_ipa_parity.mjs inputs.json out.json
 * inputs.json is an array of strings; out.json maps each string to the browser
 * runtime's strict-mode result (surface, IPA, status, issues).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createBrowserKozakKimEngine } from './benchmark_kozak_kim_browser.mjs';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  process.stderr.write('Usage: audit_runtime_ipa_parity.mjs inputs.json out.json\n');
  process.exit(2);
}
const engine = createBrowserKozakKimEngine();
const out = {};
for (const text of JSON.parse(readFileSync(inputPath, 'utf8'))) {
  try {
    const r = engine.convert(text, { morphologyMode: 'strict', ipaProfile: 'clippyfirst-korean-broad-v1' });
    out[text] = {
      // surfaceHangul is empty when nothing changed (documented browser convention).
      surface: r.surfaceHangul || null, ipa: r.ipa ?? '', status: r.pronunciation_status ?? null,
      issues: (r.issues || []).length,
    };
  } catch (error) {
    out[text] = { error: String(error && error.message || error) };
  }
}
writeFileSync(outputPath, JSON.stringify(out));
