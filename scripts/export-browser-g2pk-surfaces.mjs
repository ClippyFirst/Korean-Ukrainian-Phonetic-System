import { readFileSync } from 'node:fs';
import { G2pBrowser } from '../src/vendor/g2pk/g2p-browser.ts';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const corpus = JSON.parse(read('tests/fixtures/g2pk-surface-regression.json'));
const port = new G2pBrowser();

const rows = corpus.cases.map((item) => {
  const surface = port.convert(item.input, { descriptive: false, verbose: false, groupVowels: false, toSyl: true });
  return {
    input: item.input,
    expected_surface: item.expectedSurface,
    browser_surface: surface,
    browser_status: 'raw-vendored-port',
    browser_issues: []
  };
});
process.stdout.write(JSON.stringify({ schemaVersion: 1, rows }, null, 2) + '\n');
