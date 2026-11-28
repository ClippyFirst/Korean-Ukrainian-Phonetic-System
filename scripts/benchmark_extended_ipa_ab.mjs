#!/usr/bin/env node
/**
 * Paired standard-IPA vs Extended-IPA layer diagnostic.\n * Run on pinned UGTPHON and SIGMORPHON test splits in CI.
 *
 * All modes run on the same ordered corpus occurrences and the same strict
 * browser engine. Extended broad is expected to equal standard broad because
 * the Extended IPA contract wraps the same broad renderer. Phonemic and narrow
 * scores are cross-layer agreement diagnostics unless the reference layer is
 * independently documented as matching that layer.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBrowserKozakKimEngine, evaluateRows, normalizeIpa } from './benchmark_kozak_kim_browser.mjs';
import { buildExtendedIpaResult } from '../src/app/extended_ipa.js';
import { phonemicIpaFromHangul } from '../src/app/phonemic_ipa.js';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const HANGUL_TOKEN = /^[\uac00-\ud7a3]+$/u;

function loadRows(path) {
  const rows = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(rows)) throw new TypeError('corpus root must be an array');
  for (const [index, row] of rows.entries()) {
    if (!row || typeof row !== 'object' || !Array.isArray(row.tokens)) {
      throw new TypeError('row ' + index + ' must contain a tokens array');
    }
  }
  return rows;
}

export function summarize(report) {
  return {
    eligible_tokens: report.eligible_tokens,
    scored_tokens: report.scored_tokens,
    coverage_rate: report.coverage_rate,
    exact_matches: report.exact_matches,
    exact_match_rate: report.exact_match_rate,
    coverage_adjusted_exact_match_rate: report.coverage_adjusted_exact_match_rate,
    character_error_rate: report.character_error_rate,
    unresolved_tokens: report.unresolved_tokens,
    partial_tokens: report.partial_tokens,
    heuristic_tokens: report.heuristic_tokens,
    engine_errors: report.engine_errors
  };
}

export function scoreLayer(rows, engine, layer, datasetName) {
  const wrapped = {
    convert(source, options) {
      const base = engine.convert(source, options);
      const extended = buildExtendedIpaResult(
        source, base, phonemicIpaFromHangul(source)
      );
      const value = extended.layers[layer].ipa;
      return {
        ...base,
        ipa: typeof value === 'string' ? value : '',
        ipa_profile: extended.layers[layer].profile_id,
        ipa_profile_version: extended.layers[layer].profile_version,
        ipa_profile_level: layer,
        ipa_profile_status: extended.layers[layer].status,
        pronunciation_status: value ? base.pronunciation_status : 'unresolved'
      };
    }
  };
  return evaluateRows(rows, wrapped, 'strict',
    datasetName + ' / ' + layer + ' IPA layer diagnostic',
    'Pinned corpus input; identical occurrences for all IPA layers');
}


export function summarizeNarrowVariants(rows, engine) {
  let eligibleTokens = 0;
  let tokensWithVariants = 0;
  let totalVariants = 0;
  let selectedVariants = 0;
  let primaryIpaChangedTokens = 0;
  let scoredGoldTokens = 0;
  let primaryExactMatches = 0;
  let candidateOracleExactMatches = 0;
  let candidateOracleRescuedTokens = 0;
  const oracleRescuedByEnvironment = {};
  const oracleRescuedByInteraction = new Map();
  const byEnvironment = {};
  const byEvidenceStatus = {};
  const examples = [];
  for (const row of rows) {
    for (const token of row.tokens ?? []) {
      const canonical = token.canonical;
      if (typeof canonical !== 'string' || !HANGUL_TOKEN.test(canonical) ||
          typeof token.phoneme !== 'string' || !token.phoneme.trim()) continue;
      eligibleTokens += 1;
      const base = engine.convert(canonical, {
        morphologyMode: 'strict',
        ipaProfile: 'clippyfirst-korean-broad-v1'
      });
      const extended = buildExtendedIpaResult(
        canonical, base, phonemicIpaFromHangul(canonical)
      );
      const primaryNarrow = extended.layers.narrow.ipa;
      if (primaryNarrow && primaryNarrow !== base.ipa) primaryIpaChangedTokens += 1;
      const goldVariants = String(token.phoneme).split(',').map(normalizeIpa).filter(Boolean);
      const primaryNormalized = normalizeIpa(primaryNarrow);
      const primaryExact = goldVariants.includes(primaryNormalized);
      if (goldVariants.length && primaryNormalized) {
        scoredGoldTokens += 1;
        if (primaryExact) primaryExactMatches += 1;
      }
      const variants = (Array.isArray(extended.variants) ? extended.variants : [])
        .filter(variant => variant.layer === 'narrow');
      const oracleMatch = variants.find(variant => goldVariants.includes(normalizeIpa(variant.ipa)));
      if (primaryNormalized && goldVariants.length && (primaryExact || oracleMatch)) {
        candidateOracleExactMatches += 1;
        if (!primaryExact && oracleMatch) {
          candidateOracleRescuedTokens += 1;
          const environment = oracleMatch.environment || 'unspecified';
          oracleRescuedByEnvironment[environment] = (oracleRescuedByEnvironment[environment] ?? 0) + 1;
          const closestGold = goldVariants.map(gold => ({
            gold,
            errors: alignCodepoints(primaryNormalized, gold).filter(item => item.type !== 'equal')
          })).sort((a, b) => a.errors.length - b.errors.length || a.gold.localeCompare(b.gold))[0];
          const errorSignature = closestGold?.errors.length
            ? [...new Set(closestGold.errors.map(item => item.type === 'substitution'
              ? item.predicted + ' → ' + item.reference
              : item.type === 'insertion' ? '∅ → ' + item.reference : item.predicted + ' → ∅'))]
              .sort((a, b) => a.localeCompare(b)).join(' + ')
            : 'no-primary-error';
          const interactionKey = environment + '\\u0000' + errorSignature;
          if (!oracleRescuedByInteraction.has(interactionKey)) {
            oracleRescuedByInteraction.set(interactionKey, {
              environment,
              primary_error_signature: errorSignature,
              occurrence_count: 0,
              token_types: new Set()
            });
          }
          const interaction = oracleRescuedByInteraction.get(interactionKey);
          interaction.occurrence_count += 1;
          interaction.token_types.add(canonical);
        }
      }
      if (!variants.length) continue;
      tokensWithVariants += 1;
      totalVariants += variants.length;
      for (const variant of variants) {
        if (variant.selected) selectedVariants += 1;
        const environment = variant.environment || 'unspecified';
        const evidence = variant.evidence_status || 'unspecified';
        byEnvironment[environment] = (byEnvironment[environment] ?? 0) + 1;
        byEvidenceStatus[evidence] = (byEvidenceStatus[evidence] ?? 0) + 1;
        if (examples.length < 30) examples.push({
          token: canonical, primary_ipa: primaryNarrow,
          variant_ipa: variant.ipa, environment,
          evidence_status: evidence, selected: variant.selected === true,
          evidence_refs: variant.evidence_refs || []
        });
      }
    }
  }
  return {
    interpretation: 'Candidate coverage is reported separately from primary IPA scores; unselected variants are not production predictions. The separately labeled oracle upper bound compares them to corpus IPA labels, which are not layer-matched narrow gold.',
    eligible_tokens: eligibleTokens,
    tokens_with_variants: tokensWithVariants,
    variant_token_coverage_rate: eligibleTokens ? Number((tokensWithVariants / eligibleTokens).toFixed(6)) : null,
    total_variant_candidates: totalVariants,
    mean_variants_per_eligible_token: eligibleTokens ? Number((totalVariants / eligibleTokens).toFixed(6)) : null,
    selected_variant_candidates: selectedVariants,
    primary_ipa_changed_tokens: primaryIpaChangedTokens,
    candidate_oracle_interpretation: 'Offline upper-bound diagnostic only: an unselected candidate exactly matches at least one corpus IPA variant. It is not accuracy, not independent narrow gold, and must never select runtime output.',
    candidate_oracle_scored_tokens: scoredGoldTokens,
    primary_exact_matches: primaryExactMatches,
    candidate_oracle_exact_matches: candidateOracleExactMatches,
    candidate_oracle_exact_rate: scoredGoldTokens ? Number((candidateOracleExactMatches / scoredGoldTokens).toFixed(6)) : null,
    candidate_oracle_rescued_tokens: candidateOracleRescuedTokens,
    candidate_oracle_rescued_by_environment: Object.fromEntries(Object.entries(oracleRescuedByEnvironment).sort(([a],[b]) => a.localeCompare(b))),
    candidate_oracle_rescue_interactions: [...oracleRescuedByInteraction.values()]
      .map(item => ({
        environment: item.environment,
        primary_error_signature: item.primary_error_signature,
        occurrence_count: item.occurrence_count,
        unique_token_types: item.token_types.size
      }))
      .sort((a, b) => b.occurrence_count - a.occurrence_count
        || a.environment.localeCompare(b.environment)
        || a.primary_error_signature.localeCompare(b.primary_error_signature)),
    by_environment: Object.fromEntries(Object.entries(byEnvironment).sort(([a],[b]) => a.localeCompare(b))),
    by_evidence_status: Object.fromEntries(Object.entries(byEvidenceStatus).sort(([a],[b]) => a.localeCompare(b))),
    examples
  };
}

function alignCodepoints(predicted, reference) {
  const a = [...predicted], b = [...reference];
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = Math.min(
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1
      );
    }
  }
  const operations = [];
  let i = a.length, j = b.length;
  while (i || j) {
    if (i && j && a[i - 1] === b[j - 1] && dp[i][j] === dp[i - 1][j - 1]) {
      operations.push({ type: 'equal', predicted: a[i - 1], reference: b[j - 1] });
      i -= 1; j -= 1;
    } else if (i && j && dp[i][j] === dp[i - 1][j - 1] + 1) {
      operations.push({ type: 'substitution', predicted: a[i - 1], reference: b[j - 1] });
      i -= 1; j -= 1;
    } else if (i && dp[i][j] === dp[i - 1][j] + 1) {
      operations.push({ type: 'deletion', predicted: a[i - 1], reference: null });
      i -= 1;
    } else {
      operations.push({ type: 'insertion', predicted: null, reference: b[j - 1] });
      j -= 1;
    }
  }
  return operations.reverse();
}

export function summarizeNarrowErrorPatterns(records) {
  const counts = { substitutions: {}, insertions: {}, deletions: {} };
  const tokenTypesByEdit = { substitutions: {}, insertions: {}, deletions: {} };
  const examples = { substitutions: {}, insertions: {}, deletions: {} };
  const cooccurringPairs = new Map();
  const errorSignatures = new Map();
  const scoredTokenTypes = new Set();
  const tokensWithErrorsSet = new Set();
  let scoredTokens = 0, tokensWithErrors = 0;
  const editKey = item => item.type === 'substitution'
    ? item.predicted + ' → ' + item.reference
    : item.type === 'insertion' ? '∅ → ' + item.reference : item.predicted + ' → ∅';
  for (const record of records ?? []) {
    if (typeof record.normalized_predicted !== 'string' ||
        typeof record.closest_normalized_gold !== 'string') continue;
    scoredTokens += 1;
    const tokenType = typeof record.token === 'string' && record.token ? record.token : null;
    if (tokenType) scoredTokenTypes.add(tokenType);
    const operations = alignCodepoints(record.normalized_predicted, record.closest_normalized_gold);
    const errors = operations.filter(item => item.type !== 'equal');
    if (errors.length) {
      tokensWithErrors += 1;
      if (tokenType) tokensWithErrorsSet.add(tokenType);
    }
    const distinctEdits = [...new Set(errors.map(editKey))].sort((a, b) => a.localeCompare(b));
    for (const pair of distinctEdits.flatMap((left, index) =>
      distinctEdits.slice(index + 1).map(right => [left, right]))) {
      const key = pair.join('\\u0000');
      if (!cooccurringPairs.has(key)) cooccurringPairs.set(key, { edits: pair, occurrence_count: 0, token_types: new Set() });
      const item = cooccurringPairs.get(key);
      item.occurrence_count += 1;
      if (tokenType) item.token_types.add(tokenType);
    }
    if (distinctEdits.length) {
      const signature = distinctEdits.join(' + ');
      if (!errorSignatures.has(signature)) errorSignatures.set(signature, { signature, occurrence_count: 0, token_types: new Set() });
      const item = errorSignatures.get(signature);
      item.occurrence_count += 1;
      if (tokenType) item.token_types.add(tokenType);
    }
    for (const item of errors) {
      const group = item.type === 'substitution' ? 'substitutions'
        : item.type === 'insertion' ? 'insertions' : 'deletions';
      const key = editKey(item);
      counts[group][key] = (counts[group][key] ?? 0) + 1;
      if (!tokenTypesByEdit[group][key]) tokenTypesByEdit[group][key] = new Set();
      if (tokenType) tokenTypesByEdit[group][key].add(tokenType);
      if (!examples[group][key]) examples[group][key] = [];
      if (examples[group][key].length < 4) examples[group][key].push({
        token: record.token,
        predicted: record.predicted,
        reference: record.gold
      });
    }
  }
  const top = group => Object.entries(counts[group])
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 25)
    .map(([edit, count]) => ({
      edit, count,
      unique_token_types: tokenTypesByEdit[group][edit]?.size ?? 0,
      examples: examples[group][edit]
    }));
  const ranked = values => [...values.values()]
    .map(item => ({
      ...(item.edits ? { edits: item.edits } : { signature: item.signature }),
      occurrence_count: item.occurrence_count,
      unique_token_types: item.token_types.size
    }))
    .sort((a, b) => b.occurrence_count - a.occurrence_count
      || b.unique_token_types - a.unique_token_types
      || (a.signature || a.edits.join(' + ')).localeCompare(b.signature || b.edits.join(' + ')))
    .slice(0, 25);
  return {
    interpretation: 'Unicode-codepoint Levenshtein diagnostics over normalized strings. Counts are occurrence-weighted; unique token-type counts expose repeated lexical items. Co-occurrences are within one token occurrence and are diagnostic symbol patterns, not phonological-feature judgments or narrow-IPA accuracy.',
    scored_tokens: scoredTokens,
    unique_scored_token_types: scoredTokenTypes.size,
    tokens_with_errors: tokensWithErrors,
    unique_tokens_with_errors: tokensWithErrorsSet.size,
    substitution_count: Object.values(counts.substitutions).reduce((sum, n) => sum + n, 0),
    insertion_count: Object.values(counts.insertions).reduce((sum, n) => sum + n, 0),
    deletion_count: Object.values(counts.deletions).reduce((sum, n) => sum + n, 0),
    top_substitutions: top('substitutions'),
    top_insertions: top('insertions'),
    top_deletions: top('deletions'),
    top_cooccurring_error_pairs: ranked(cooccurringPairs),
    top_error_signatures: ranked(errorSignatures)
  };
}

export function compareRows(standard, extendedBroad) {
  const left = standard.records ?? [];
  const right = extendedBroad.records ?? [];
  const sameLength = left.length === right.length;
  let predictionDifferences = 0;
  let statusDifferences = 0;
  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    if (left[index].token !== right[index].token ||
        left[index].occurrence_id !== right[index].occurrence_id) {
      throw new Error('paired occurrence order differs at index ' + index);
    }
    if ((left[index].predicted ?? null) !== (right[index].predicted ?? null)) predictionDifferences += 1;
    if ((left[index].status ?? null) !== (right[index].status ?? null)) statusDifferences += 1;
  }
  if (!sameLength || predictionDifferences || statusDifferences) {
    throw new Error('standard IPA and Extended broad IPA diverged unexpectedly');
  }
  return { paired_occurrences: left.length, prediction_differences: 0, status_differences: 0, identical_by_contract: true };
}

function main() {
  const args = process.argv.slice(2);
  const value = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : null; };
  const inputs = [
    ['UGTPHON', value('--ugtphon')],
    ['SIGMORPHON', value('--sigmorphon')]
  ].filter(([, path]) => Boolean(path));
  const output = value('--output');
  if (!inputs.length || !output) {
    process.stderr.write('Usage: node scripts/benchmark_extended_ipa_ab.mjs --ugtphon ko-test.json [--sigmorphon sigmorphon-kor-test.json] --output report.json\n');
    process.exitCode = 2;
    return;
  }
  try {
    const engine = createBrowserKozakKimEngine();
    const datasets = {};
    for (const [name, path] of inputs) {
      const rows = loadRows(resolve(ROOT, path));
      const standard = evaluateRows(rows, engine, 'strict', name + ' / standard IPA', 'Pinned corpus');
      const broad = scoreLayer(rows, engine, 'broad', name);
      const phonemic = scoreLayer(rows, engine, 'phonemic', name);
      const narrow = scoreLayer(rows, engine, 'narrow', name);
      const narrowVariants = summarizeNarrowVariants(rows, engine);
      const narrowErrors = summarizeNarrowErrorPatterns(narrow.records);
      datasets[name] = {
        occurrence_policy: 'same source rows, token order, eligibility and gold strings across all four passes',
        reference_layer_status: name === 'Seoul Corpus' ? 'phonemic-word-level-reference' : 'reference-layer-not-independently-adjudicated-here',
        standard_ipa: summarize(standard),
        extended_ipa: {
          broad: summarize(broad),
          phonemic: summarize(phonemic),
          narrow: summarize(narrow)
        },
        standard_vs_extended_broad: compareRows(standard, broad),
        narrow_variant_diagnostics: narrowVariants,
        narrow_error_patterns: narrowErrors,
        records: {
          standard_ipa: standard.records,
          extended_broad: broad.records,
          extended_phonemic: phonemic.records,
          extended_narrow: narrow.records
        }
      };
    }
    const report = {
      schema_version: 1,
      benchmark: 'standard-vs-extended-ipa-paired-layer-diagnostic',
      engine: 'Kozak Kim deterministic browser engine',
      morphology_mode: 'strict',
      code_scope: 'Kozak Kim repository only; no second Korean engine',
      created_by: 'scripts/benchmark_extended_ipa_ab.mjs',
      datasets,
      interpretation: [
        'Standard IPA is the current strict broad profile output.',
        'Extended broad wraps that same broad output; equality is expected and asserted, not an independent model gain.',
        'Extended phonemic is a deterministic underlying Hangul inventory. Its agreement with a corpus reference is meaningful only if that reference is phonemic and uses a compatible inventory/segmentation convention.',
        'Extended narrow is a partial research allophone profile. No independently adjudicated narrow-IPA gold is supplied by these corpora; its score is cross-layer string agreement only and must not be described as narrow IPA accuracy.',
        'Exact match, CER and coverage are reported separately; no permissive normalization is used for headline metrics.',
        'Unselected Narrow variant candidates are summarized separately by environment/evidence; candidate coverage is not accuracy and does not change the primary IPA score.',
        'Narrow error patterns are Unicode-codepoint Levenshtein diagnostics; symbol confusions are not phonological-feature judgments and remain cross-layer when no layer-matched gold exists.',
        'This report does not measure Ukrainian target transcription accuracy.'
      ]
    };
    writeFileSync(resolve(ROOT, output), JSON.stringify(report, null, 2) + '\n', 'utf8');
    for (const [name, data] of Object.entries(datasets)) {
      process.stdout.write(JSON.stringify({
        dataset: name,
        standard_ipa: data.standard_ipa,
        extended_broad: data.extended_ipa.broad,
        extended_phonemic: data.extended_ipa.phonemic,
        extended_narrow: data.extended_ipa.narrow,
        narrow_variant_diagnostics: data.narrow_variant_diagnostics,
        narrow_error_patterns: data.narrow_error_patterns,
        standard_vs_extended_broad: data.standard_vs_extended_broad
      }, null, 2) + '\n');
    }
  } catch (error) {
    process.stderr.write('Extended IPA A/B benchmark failed: ' +
      (error instanceof Error ? error.stack : String(error)) + '\n');
    process.exitCode = 2;
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
