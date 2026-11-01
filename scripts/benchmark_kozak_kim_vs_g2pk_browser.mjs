#!/usr/bin/env node
/**
 * Paired browser-side comparison of Kozak Kim against the untouched vendored
 * g2pK JavaScript port on identical UGTPHON Korean token occurrences.
 *
 * Kozak Kim's own IPA is compared with raw g2pK surface Hangul passed through
 * the shared segment-to-IPA adapter only. Native phonological rules are never
 * rerun on g2pK output. The g2pK source and options remain unchanged.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { G2pBrowser } from '../src/vendor/g2pk/g2p-browser.ts';
import {
  createBrowserKozakKimEngine,
  editDistance,
  normalizeIpa
} from './benchmark_kozak_kim_browser.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const HANGUL_TOKEN = /^[\uac00-\ud7a3]+$/u;
const G2PK_OPTIONS = Object.freeze({
  descriptive: false,
  verbose: false,
  groupVowels: false,
  toSyl: true
});

function scorePrediction(predictedRaw, variants) {
  const predicted = normalizeIpa(predictedRaw);
  const distances = variants.map((gold, index) => ({
    index,
    gold,
    distance: editDistance(predicted, gold)
  }));
  const minimum = Math.min(...distances.map(item => item.distance));
  const best = distances.filter(item => item.distance === minimum);
  return {
    predicted_raw: predictedRaw,
    predicted,
    distance: minimum,
    exact: minimum === 0,
    best_gold_indices: best.map(item => item.index),
    closest_gold: best[0].gold
  };
}

function commonBestReference(left, right, variants) {
  const common = left.best_gold_indices.filter(index => right.best_gold_indices.includes(index));
  if (!common.length) return null;
  const index = common[0];
  return {
    index,
    gold: variants[index],
    kozak_kim_distance: editDistance(left.predicted, variants[index]),
    g2pk_distance: editDistance(right.predicted, variants[index])
  };
}

function metrics(items, field, referenceField = null) {
  const exactMatches = items.filter(item => item[field].exact).length;
  const result = {
    scored_tokens: items.length,
    exact_matches: exactMatches,
    exact_match_rate: items.length ? exactMatches / items.length : null
  };
  if (referenceField) {
    const comparable = items.filter(item => item[referenceField] !== null);
    const totalDistance = comparable.reduce(
      (sum, item) => sum + item[referenceField][field === 'kozak_kim' ? 'kozak_kim_distance' : 'g2pk_distance'],
      0
    );
    const totalGoldCharacters = comparable.reduce(
      (sum, item) => sum + [...item[referenceField].gold].length,
      0
    );
    result.cer_scored_tokens = comparable.length;
    result.character_error_rate = totalGoldCharacters ? totalDistance / totalGoldCharacters : null;
  }
  return result;
}

function exactBinomialMcNemarP(wins, losses) {
  const n = wins + losses;
  if (!n) return null;
  const tail = Math.min(wins, losses);
  const logFactorial = [0];
  for (let i = 1; i <= n; i++) logFactorial[i] = logFactorial[i - 1] + Math.log(i);
  let probability = 0;
  for (let k = 0; k <= tail; k++) {
    const logProbability = logFactorial[n] - logFactorial[k] -
      logFactorial[n - k] - n * Math.log(2);
    probability += Math.exp(logProbability);
  }
  return Math.min(1, 2 * probability);
}

export function evaluateRows(rows, kozakKimEngine, rawG2pK) {
  if (!Array.isArray(rows)) throw new TypeError('corpus rows must be an array');
  if (!kozakKimEngine || typeof kozakKimEngine.convert !== 'function' ||
      typeof kozakKimEngine.convertSurface !== 'function') {
    throw new TypeError('Kozak Kim engine must expose convert and convertSurface');
  }
  if (!rawG2pK || typeof rawG2pK.convert !== 'function') {
    throw new TypeError('raw g2pK engine must expose convert');
  }

  const records = [];
  let eligibleTokens = 0;
  let skippedNonHangul = 0;
  let skippedMissingGold = 0;
  let kozakKimUnresolved = 0;
  let kozakKimErrors = 0;
  let g2pkUnresolved = 0;
  let g2pkErrors = 0;
  let g2pkAdapterErrors = 0;

  for (const row of rows) {
    for (const token of row.tokens ?? []) {
      const source = token.canonical;
      const goldRaw = token.phoneme;
      if (typeof source !== 'string' || !HANGUL_TOKEN.test(source)) {
        skippedNonHangul += 1;
        continue;
      }
      if (typeof goldRaw !== 'string' || !goldRaw.trim()) {
        skippedMissingGold += 1;
        continue;
      }
      const variants = goldRaw.split(',').map(normalizeIpa).filter(Boolean);
      if (!variants.length) {
        skippedMissingGold += 1;
        continue;
      }
      eligibleTokens += 1;

      let kozak = null;
      let g2pk = null;
      let g2pkSurface = null;
      let kozakError = null;
      let g2pkError = null;
      let g2pkAdapterError = null;

      try {
        const result = kozakKimEngine.convert(source, { morphologyMode: 'strict' });
        const status = result.pronunciation_status ?? (result.ipa ? 'resolved' : 'unresolved');
        if (status === 'resolved' && typeof result.ipa === 'string' && result.ipa.trim()) {
          kozak = scorePrediction(result.ipa, variants);
          kozak.surface = result.surfaceHangul || source;
          kozak.pronunciation_status = status;
        } else {
          kozakKimUnresolved += 1;
        }
      } catch (error) {
        kozakKimErrors += 1;
        kozakError = error instanceof Error ? error.name + ': ' + error.message : String(error);
      }

      try {
        g2pkSurface = rawG2pK.convert(source, G2PK_OPTIONS);
        if (typeof g2pkSurface !== 'string' || !HANGUL_TOKEN.test(g2pkSurface)) {
          throw new TypeError('g2pK output is not a single Hangul token');
        }
      } catch (error) {
        g2pkErrors += 1;
        g2pkError = error instanceof Error ? error.message : String(error);
      }

      if (g2pkSurface !== null) {
        try {
          // Surface-only adapter: this maps g2pK's output to IPA without
          // rerunning Kozak Kim's coda, liaison, assimilation or fortition.
          const result = kozakKimEngine.convertSurface(g2pkSurface, { morphologyMode: 'strict' });
          const status = result.pronunciation_status ?? (result.ipa ? 'resolved' : 'unresolved');
          if (status === 'resolved' && typeof result.ipa === 'string' && result.ipa.trim()) {
            g2pk = scorePrediction(result.ipa, variants);
            g2pk.surface = g2pkSurface;
            g2pk.pronunciation_status = status;
          } else {
            g2pkUnresolved += 1;
          }
        } catch (error) {
          g2pkAdapterErrors += 1;
          g2pkAdapterError = error instanceof Error ? error.name + ': ' + error.message : String(error);
        }
      }

      const commonReference = kozak && g2pk
        ? commonBestReference(kozak, g2pk, variants)
        : null;
      records.push({
        id: row.id ?? null,
        token: source,
        gold: goldRaw,
        kozak_kim: kozak,
        g2pk: g2pk,
        g2pk_surface: g2pkSurface,
        surface_equal: kozak && g2pkSurface !== null
          ? kozak.surface === g2pkSurface
          : null,
        common_best_gold: commonReference,
        kozak_kim_error: kozakError,
        g2pk_error: g2pkError,
        g2pk_adapter_error: g2pkAdapterError
      });
    }
  }

  const paired = records.filter(item => item.kozak_kim && item.g2pk);
  const bothExact = paired.filter(item => item.kozak_kim.exact && item.g2pk.exact).length;
  const kozakOnlyExact = paired.filter(item => item.kozak_kim.exact && !item.g2pk.exact).length;
  const g2pkOnlyExact = paired.filter(item => !item.kozak_kim.exact && item.g2pk.exact).length;
  const bothWrong = paired.filter(item => !item.kozak_kim.exact && !item.g2pk.exact).length;
  const sharedReference = paired.filter(item => item.common_best_gold !== null);
  const kozakMetrics = metrics(paired, 'kozak_kim', 'common_best_gold');
  const g2pkMetrics = metrics(paired, 'g2pk', 'common_best_gold');
  const kozakAll = metrics(records.filter(item => item.kozak_kim), 'kozak_kim');
  const g2pkAll = metrics(records.filter(item => item.g2pk), 'g2pk');

  return {
    benchmark: 'UGTPHON Korean test split — browser Kozak Kim vs original g2pK',
    purpose: 'paired diagnostic; not normative Korean accuracy, expert adjudication, or Ukrainian-target evaluation',
    kozak_kim_engine: 'ClippyFirst deterministic browser Kozak Kim',
    g2pk_engine: 'untouched vendored g2pK JavaScript port',
    g2pk_source: 'src/vendor/g2pk/g2p-browser.ts',
    g2pk_options: G2PK_OPTIONS,
    g2pk_ipa_adapter: 'shared Kozak Kim convertSurface; native phonological rules are not reapplied to g2pK output',
    split: rows[0]?.split ?? null,
    rows: rows.length,
    eligible_tokens: eligibleTokens,
    skipped_non_hangul: skippedNonHangul,
    skipped_missing_gold: skippedMissingGold,
    kozak_kim: {
      ...kozakAll,
      unresolved_tokens: kozakKimUnresolved,
      engine_errors: kozakKimErrors
    },
    g2pk: {
      ...g2pkAll,
      unresolved_tokens: g2pkUnresolved,
      engine_errors: g2pkErrors,
      ipa_adapter_errors: g2pkAdapterErrors
    },
    paired_subset: {
      tokens_scored_by_both: paired.length,
      coverage_against_eligible: eligibleTokens ? paired.length / eligibleTokens : null,
      kozak_kim: kozakMetrics,
      g2pk: g2pkMetrics,
      both_exact: bothExact,
      kozak_kim_only_exact: kozakOnlyExact,
      g2pk_only_exact: g2pkOnlyExact,
      both_wrong: bothWrong,
      tokens_with_shared_best_gold: sharedReference.length,
      tokens_without_shared_best_gold: paired.length - sharedReference.length,
      exact_match_delta_kozak_minus_g2pk: paired.length
        ? (paired.filter(item => item.kozak_kim.exact).length -
          paired.filter(item => item.g2pk.exact).length) / paired.length
        : null,
      cer_delta_kozak_minus_g2pk: kozakMetrics.character_error_rate !== null &&
        g2pkMetrics.character_error_rate !== null
        ? kozakMetrics.character_error_rate - g2pkMetrics.character_error_rate
        : null,
      mcnemar_exact_p_value: exactBinomialMcNemarP(kozakOnlyExact, g2pkOnlyExact)
    },
    surface_comparison: {
      tokens_with_both_surfaces: records.filter(item => item.kozak_kim && item.g2pkSurface !== null).length,
      equal_surfaces: records.filter(item => item.surface_equal === true).length,
      different_surfaces: records.filter(item => item.surface_equal === false).length
    },
    records,
    notes: [
      'The g2pK JavaScript source and implementation are not modified; this benchmark instantiates the vendored class directly.',
      'Both engines receive the same canonical Hangul token occurrence and are scored against the same gold IPA variants.',
      'The raw g2pK surface is passed only through convertSurface to share the IPA inventory; Kozak Kim phonological rules are not run over that surface.',
      'A paired CER occurrence is included only when both systems share at least one best gold variant; exact-match classification accepts any listed gold variant.',
      'UGTPHON is noisy user-generated text, not an independently adjudicated standard-pronunciation gold corpus.',
      'This benchmark measures Korean IPA only; it does not validate Ukrainian orthographic adaptation.'
    ]
  };
}

export function createOriginalG2pKBrowserEngine() {
  return new G2pBrowser();
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--corpus') args.corpus = argv[++index];
    else if (argv[index] === '--output') args.output = argv[++index];
    else throw new Error('unknown argument: ' + argv[index]);
  }
  if (!args.corpus) throw new Error('provide --corpus');
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rows = JSON.parse(readFileSync(resolve(args.corpus), 'utf8'));
  const report = evaluateRows(rows, createBrowserKozakKimEngine(), createOriginalG2pKBrowserEngine());
  const rendered = JSON.stringify(report, null, 2) + '\n';
  if (args.output) writeFileSync(resolve(args.output), rendered, 'utf8');
  process.stdout.write(rendered);
}

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    process.stderr.write((error instanceof Error ? error.stack : String(error)) + '\n');
    process.exitCode = 2;
  }
}
