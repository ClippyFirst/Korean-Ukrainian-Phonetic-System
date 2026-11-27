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
import { createBrowserKozakKimEngine, evaluateRows } from './benchmark_kozak_kim_browser.mjs';
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
      const variants = (Array.isArray(extended.variants) ? extended.variants : [])
        .filter(variant => variant.layer === 'narrow');
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
    interpretation: 'Candidate coverage only; variants are unselected and are not scored as correct/incorrect without layer-matched narrow gold.',
    eligible_tokens: eligibleTokens,
    tokens_with_variants: tokensWithVariants,
    variant_token_coverage_rate: eligibleTokens ? Number((tokensWithVariants / eligibleTokens).toFixed(6)) : null,
    total_variant_candidates: totalVariants,
    mean_variants_per_eligible_token: eligibleTokens ? Number((totalVariants / eligibleTokens).toFixed(6)) : null,
    selected_variant_candidates: selectedVariants,
    primary_ipa_changed_tokens: primaryIpaChangedTokens,
    by_environment: Object.fromEntries(Object.entries(byEnvironment).sort(([a],[b]) => a.localeCompare(b))),
    by_evidence_status: Object.fromEntries(Object.entries(byEvidenceStatus).sort(([a],[b]) => a.localeCompare(b))),
    examples
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
