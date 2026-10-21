import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createEngine } from '../src/app/engine.js';
import { createG2pWebAdapter } from '../src/app/g2pk_web.js';
import { ipaSyllableToUkrainian } from '../src/app/engine_ipa.js';
import { G2pBrowser } from '../src/vendor/g2pk/g2p-browser.ts';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
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

test('practical browser mode is wired to the vendored JavaScript g2pK adapter', () => {
  const main = read('src/main.js');
  const adapter = read('src/app/g2pk_web.js');
  const port = read('src/vendor/g2pk/g2p-browser.ts');

  assert.match(main, /createG2pWebAdapter/u);
  assert.match(main, /const useG2p=!\(modeResearch&&modeResearch\.checked\)/u);
  assert.match(main, /useG2p\?webEngine\.convert\(value\):engine\.convert/u);
  assert.match(adapter, /new G2pBrowser\(\)/u);
  assert.match(adapter, /descriptive: false/u);
  assert.match(adapter, /toSyl: true/u);
  assert.match(adapter, /NO project lexical surface\/IPA/u);
  assert.doesNotMatch(adapter, /applyLexical(?:Surface|Ipa)Controls/u);
  assert.match(port, /Ported from g2pk\/g2pk\.py/u);
});

test('practical browser surface exactly matches the vendored JavaScript port', () => {
  const cases = JSON.parse(read('tests/fixtures/g2pk-surface-regression.json')).cases;
  const port = new G2pBrowser();
  assert.equal(cases.length, 20);
  for (const item of cases) {
    assert.equal(item.ipaGoldStatus, 'not_independently_adjudicated', item.input);
    assert.equal(item.pythonComparisonStatus, 'compared-g2pk-0.9.4-python-3.11-and-3.12-2026-10-20', item.input);
    assert.ok(item.pythonG2pkSurface, item.input + ': missing recorded Python g2pK surface');
    const expectedPortSurface = port.convert(item.input, {
      descriptive: false, verbose: false, groupVowels: false, toSyl: true
    });
    const result = webEngine.convert(item.input);
    assert.equal(result.surfaceHangul, expectedPortSurface, item.input + ': practical adapter changed port output');
    assert.equal(result.surfaceHangul, item.expectedSurface, item.input + ': port regression changed');
    assert.ok(result.ipa.length > 0, item.input + ': missing IPA');
    assert.ok(result.ukrainian.length > 0, item.input + ': missing Ukrainian target');
    assert.deepEqual(result.issues, [], item.input + ': unexpected unresolved issues');
  }
});

test('browser surface export is deterministic and covers the fixed fixture', () => {
  const fixture = JSON.parse(read('tests/fixtures/g2pk-surface-regression.json'));
  const output = execFileSync(
    process.execPath,
    ['--experimental-strip-types', 'scripts/export-browser-g2pk-surfaces.mjs'],
    { encoding: 'utf8' }
  );
  const exported = JSON.parse(output);
  assert.equal(exported.rows.length, fixture.cases.length);
  for (const item of fixture.cases) {
    const row = exported.rows.find(candidate => candidate.input === item.input);
    assert.ok(row, item.input + ': missing browser export row');
    assert.equal(row.browser_surface, item.expectedSurface, item.input);
  }
});

test('browser output remains IPA-first for the adversarial long passage', () => {
  const passage = read('tests/fixtures/g2pk-web-adversarial.txt');
  const result = webEngine.convert(passage);

  assert.ok(result.surfaceHangul.length > 0, 'missing realized Korean surface');
  assert.ok(result.ipa.length > 0, 'missing IPA output');
  assert.ok(result.ukrainian.length > 0, 'missing Ukrainian output');
  assert.doesNotMatch(result.ukrainian, /⟦|undefined/u);
  assert.equal(result.issues.length, 0, result.issues.join('\n'));

  for (const item of result.trace) {
    if (item.status === 'literal' || !item.ipa || !item.output) continue;
    const mapped = ipaSyllableToUkrainian(item.ipa);
    assert.equal(mapped.unknown, '', item.source + ': unmapped IPA ' + item.ipa);
    assert.equal(item.output, mapped.text, item.source + ': target is not reproducible from IPA');
  }
});
