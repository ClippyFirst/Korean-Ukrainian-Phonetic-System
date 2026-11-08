import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateMode as evaluateSurface } from '../scripts/benchmark_kozak_kim_seoul_browser.mjs';
import { evaluateMode as evaluateIpa } from '../scripts/benchmark_kozak_kim_seoul_ipa.mjs';

const typedFallbackEngine = {
  convert() {
    return {
      ipa: 'p',
      surfaceHangul: '학교',
      pronunciation_status: 'resolved',
      phonetic_result_type: 'mixed-surface-ipa-and-orthographic-fallback',
      trace: [{ status: 'super-soft-orthographic-fallback' }],
      ipa_profile: 'browser-super-soft-maximum-coverage-v1',
      ipa_profile_version: 1,
      ipa_profile_status: 'unadjudicated-cross-runtime',
      target_status: 'provisional',
    };
  },
};

test('Seoul Hangul surface scorer excludes typed orthographic fallback from accuracy', () => {
  const pairs = [{ source: '학교', gold: '학꾜', weight: 2 }];
  const result = evaluateSurface(pairs, typedFallbackEngine, 'super-soft', 2);
  assert.equal(result.summary.scored_occurrences, 0);
  assert.equal(result.summary.exact_matches, 0);
  assert.equal(result.summary.typed_fallback_occurrences, 2);
  assert.equal(result.summary.cer_scored_only, null);
  assert.equal(result.summary.cer_with_abstentions_as_deletions, 1);
  assert.equal(result.outputs.get(JSON.stringify(['학교', '학꾜'])).status, 'typed_fallback');
});

test('Seoul phonemic IPA scorer excludes typed orthographic fallback from accuracy', () => {
  const pairs = [{ source: '학교', gold: 'hak̚k͈jo', weight: 2 }];
  const result = evaluateIpa(pairs, typedFallbackEngine, 'super-soft', 2);
  assert.equal(result.summary.scored_occurrences, 0);
  assert.equal(result.summary.exact_matches, 0);
  assert.equal(result.summary.typed_fallback_occurrences, 2);
  assert.equal(result.summary.cer_scored_only, null);
  assert.equal(result.summary.cer_with_abstentions_as_deletions, 1);
  assert.equal(result.outputs.get(JSON.stringify(['학교', 'hak̚k͈jo'])).status, 'typed_fallback');
});
