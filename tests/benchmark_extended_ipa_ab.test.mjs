import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserKozakKimEngine } from '../scripts/benchmark_kozak_kim_browser.mjs';
import { summarizeNarrowVariants, summarizeNarrowErrorPatterns } from '../scripts/benchmark_extended_ipa_ab.mjs';

test('Narrow variant diagnostics count candidate coverage without scoring candidates as accuracy', () => {
  const rows = [{
    id: 'narrow-variant-contexts',
    tokens: [
      { canonical: '빨리', phoneme: 'p͈al.li' },
      { canonical: '물론', phoneme: 'mul.lon' },
      { canonical: '팔', phoneme: 'pʰaɭ' },
      { canonical: '말하', phoneme: 'mal.ha' },
      { canonical: '군주', phoneme: 'kuɲd͡ʑu' },
      { canonical: '낫', phoneme: 'nat' }
    ]
  }];
  const report = summarizeNarrowVariants(rows, createBrowserKozakKimEngine());
  assert.equal(report.eligible_tokens, 6);
  assert.ok(report.tokens_with_variants >= 5);
  assert.ok(report.total_variant_candidates >= 5);
  assert.equal(report.selected_variant_candidates, 0);
  assert.equal(report.candidate_oracle_scored_tokens, 6);
  assert.ok(report.candidate_oracle_exact_matches >= report.primary_exact_matches);
  assert.equal(report.candidate_oracle_rescued_tokens, 3);
  assert.equal(report.candidate_oracle_rescued_by_environment['word-final coda ㄹ'], 1);
  const codaLateralRescue = report.candidate_oracle_rescue_interactions.find(item =>
    item.environment === 'word-final coda ㄹ');
  assert.deepEqual(
    { signature: codaLateralRescue.primary_error_signature, occurrences: codaLateralRescue.occurrence_count },
    { signature: 'l → ɭ', occurrences: 1 }
  );
  assert.equal(report.candidate_oracle_rescued_by_environment['same-word coda ㄴ before alveopalatal affricate ㅈ/ㅉ/ㅊ'], 1);
  assert.equal(report.by_environment['geminate lateral before high-front vocoid /i,j/'], 1);
  assert.ok(report.by_environment['coda ㄹ before same-word consonant'] >= 1);
  assert.equal(report.by_environment['word-final coda ㄹ'], 1);
  assert.equal(report.by_environment['word-final coda ㅅ; optional released [t] candidate'], 1);
  assert.equal(report.candidate_oracle_rescued_by_environment['word-final coda ㅅ; optional released [t] candidate'], 1);
  assert.equal(report.by_environment['coda ㄹ before same-word onset ㅎ'], 1);
  assert.match(report.interpretation, /not production predictions/);
  assert.match(report.candidate_oracle_interpretation, /must never select runtime output/);
  assert.ok(report.examples.every(item => item.selected === false));
});

test('Narrow error attribution exposes recurrent symbol substitutions and length edits', () => {
  const report = summarizeNarrowErrorPatterns([
    { token: '팔', predicted: 'pal', gold: 'paɭ', normalized_predicted: 'pal', closest_normalized_gold: 'paɭ' },
    { token: '아하', predicted: 'aɸa', gold: 'aɦa', normalized_predicted: 'aɸa', closest_normalized_gold: 'aɦa' },
    { token: '말', predicted: 'mal', gold: 'malː', normalized_predicted: 'mal', closest_normalized_gold: 'malː' }
  ]);
  assert.equal(report.scored_tokens, 3);
  assert.equal(report.tokens_with_errors, 3);
  assert.equal(report.substitution_count, 2);
  assert.equal(report.insertion_count, 1);
  assert.equal(report.top_substitutions[0].edit, 'l → ɭ');
  assert.equal(report.top_substitutions[1].edit, 'ɸ → ɦ');
  assert.equal(report.top_insertions[0].edit, '∅ → ː');
  assert.match(report.interpretation, /not phonological-feature judgments/);
});

test('Narrow error diagnostics expose interacting edits and separate occurrence from type counts', () => {
  const report = summarizeNarrowErrorPatterns([
    { token: '귀엽냐', normalized_predicted: 'kyj', closest_normalized_gold: 'kɥij' },
    { token: '귀엽냐', normalized_predicted: 'kyj', closest_normalized_gold: 'kɥij' },
    { token: '올린', normalized_predicted: 'ollin', closest_normalized_gold: 'oɭʎin' },
    { token: '창렬하다', normalized_predicted: 'tɕʰaŋɲjʌlhada', closest_normalized_gold: 'tɕʰaŋɲjʌɾɦada' }
  ]);
  assert.equal(report.scored_tokens, 4);
  assert.equal(report.unique_scored_token_types, 3);
  assert.equal(report.tokens_with_errors, 4);
  assert.equal(report.unique_tokens_with_errors, 3);
  const glidePair = report.top_cooccurring_error_pairs.find(item =>
    item.edits.join('|') === ['y → i', '∅ → ɥ'].sort((a, b) => a.localeCompare(b)).join('|'));
  assert.deepEqual(
    { occurrences: glidePair.occurrence_count, types: glidePair.unique_token_types },
    { occurrences: 2, types: 1 }
  );
  assert.ok(report.top_cooccurring_error_pairs.some(item =>
    item.edits.join('|') === ['l → ɭ', 'l → ʎ'].sort().join('|')));
  assert.ok(report.top_cooccurring_error_pairs.some(item =>
    item.edits.join('|') === ['h → ɦ', 'l → ɾ'].sort().join('|')));
  assert.ok(report.top_error_signatures.some(item =>
    item.signature === ['h → ɦ', 'l → ɾ'].sort().join(' + ')));
});
