import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexicalText);

// Diagnostic snapshot only: outputs are stored per runtime and are not
// independently adjudicated pronunciation gold or an approved crosswalk.
const pairedFixture = JSON.parse(readFileSync(
  new URL('./fixtures/korean-ipa-profile-pairs-2026-10-27.json', import.meta.url), 'utf8'
));
test('browser legacy sibilant IPA baseline remains inspectable pending profile adjudication', () => {
  assert.equal(pairedFixture.adjudication_status, 'UNADJUDICATED');
  assert.equal(pairedFixture.target_adapter_eligibility, 'UNVERIFIED');
  for (const item of pairedFixture.cases) {
    const source = item.source;
    const expectedIpa = item.browser_legacy_contextual_ipa;
    const result = engine.convert(source);
    assert.equal(result.ipa, expectedIpa, source);
    assert.equal(result.ipa_profile, 'browser-legacy-contextual-v1', source);
    assert.equal(result.ipa_profile_version, 1, source);
    assert.equal(result.ipa_profile_level, 'surface-contextual', source);
    assert.equal(result.ipa_profile_status, 'unadjudicated-cross-runtime', source);
  }
});
