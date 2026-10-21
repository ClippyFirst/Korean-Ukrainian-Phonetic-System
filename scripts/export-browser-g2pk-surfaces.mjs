import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';
import { createG2pWebAdapter } from '../src/app/g2pk_web.js';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const corpus = JSON.parse(read('tests/fixtures/g2pk-surface-regression.json'));
const canonical = read('data/korean/canonical_correspondence.csv');
const baseLexical = read('data/korean/lexical_pronunciations.csv');
const additions = read('data/korean/lexical_additions_2026-10-15.csv');
const header = baseLexical.split(/\r?\n/u).find((line) => line.trim());
const merge = (base, extra) => [
  header,
  ...base.split(/\r?\n/u).filter((line) => line.trim() && !line.startsWith('input,')),
  ...extra.split(/\r?\n/u).filter((line) => line.trim() && !line.startsWith('input,'))
].join('\n');
const lexical = merge(baseLexical, additions);
const webEngine = createG2pWebAdapter(createEngine(canonical, lexical));

const rows = corpus.cases.map((item) => {
  const result = webEngine.convert(item.input);
  return {
    input: item.input,
    expected_surface: item.expectedSurface,
    browser_surface: result.surfaceHangul,
    browser_status: result.status,
    browser_issues: result.issues
  };
});
process.stdout.write(JSON.stringify({ schemaVersion: 1, rows }, null, 2) + '\n');
