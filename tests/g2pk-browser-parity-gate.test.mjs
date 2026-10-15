import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';
import { createG2pWebAdapter } from '../src/app/g2pk_web.js';
import { ipaSyllableToUkrainian } from '../src/app/engine_ipa.js';

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
const webEngine = createG2pWebAdapter(createEngine(canonical, lexical), lexical);

test('practical browser mode is wired to the vendored JavaScript g2pK adapter', () => {
  const main = read('src/main.js');
  const adapter = read('src/app/g2pk_web.js');
  const port = read('src/vendor/g2pk/g2p-browser.ts');

  assert.match(main, /createG2pWebAdapter/u);
  assert.match(main, /const useG2p = !\(modeResearch && modeResearch\.checked\)/u);
  assert.match(main, /useG2p \? webEngine\.convert\(value\) : engine\.convert/u);
  assert.match(adapter, /new G2pBrowser\(\)/u);
  assert.match(adapter, /descriptive: false/u);
  assert.match(adapter, /toSyl: true/u);
  assert.match(port, /Ported from g2pk\/g2pk\.py/u);
});

test('browser g2pK keeps difficult standard surface forms under exact regression control', () => {
  const cases = [
    ['넋이', '넉씨'],
    ['몫이', '목씨'],
    ['값이', '갑씨'],
    ['값어치', '가버치'],
    ['숲이', '수피'],
    ['같이', '가치'],
    ['굳이', '구지'],
    ['닭이', '달기'],
    ['밟는', '밤는'],
    ['넓죽하다', '넙쭈카다'],
    ['읽고', '일꼬'],
    ['읽는', '잉는'],
    ['국립', '궁닙'],
    ['협력', '혐녁'],
    ['독립문', '동님문'],
    ['칼날', '칼랄'],
    ['물난리', '물랄리'],
    ['서울역', '서울력']
  ];

  for (const [input, expectedSurface] of cases) {
    const result = webEngine.convert(input);
    assert.equal(result.surfaceHangul, expectedSurface, input);
    assert.ok(result.ipa.length > 0, input + ': missing IPA');
    assert.ok(result.ukrainian.length > 0, input + ': missing Ukrainian target');
    assert.deepEqual(result.issues, [], input + ': unexpected unresolved issues');
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
