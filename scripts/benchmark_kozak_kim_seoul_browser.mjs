#!/usr/bin/env node
/**
 * Seoul Corpus word-level Hangul pronunciation diagnostic.
 * Reads ephemeral pWord.ortho. -> pWord.prono. pairs and emits aggregate
 * metrics only. It does not write corpus labels into benchmark artifacts.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBrowserKozakKimEngine } from './benchmark_kozak_kim_browser.mjs';
import { editDistance } from './benchmark_kozak_kim_browser.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const HANGUL = /^[\uac00-\ud7a3]+$/u;
const MODES = ['strict', 'soft', 'super-soft'];

function surfaceFor(result, source) {
  const sourceChars = [...source];
  const surface = result?.surfaceHangul ?? result?.surface_hangul;
  if (typeof surface === 'string' && surface && [...surface].length === sourceChars.length) return surface;
  const trace = Array.isArray(result?.trace) ? result.trace.filter(item =>
    typeof item?.source === 'string' && /^[\uac00-\ud7a3]$/u.test(item.source)
  ) : [];
  if (trace.length === sourceChars.length &&
      trace.every(item => typeof item.surface === 'string' && /^[\uac00-\ud7a3]$/u.test(item.surface))) {
    return trace.map(item => item.surface).join('');
  }
  if (surface === '' && trace.length === sourceChars.length &&
      trace.every(item => !Object.hasOwn(item, 'surface'))) return source;
  return null;
}

function loadPairs(path) {
  const rows = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(rows)) throw new TypeError('Seoul pair corpus must be a JSON array');
  const counts = new Map();
  for (const [index, row] of rows.entries()) {
    if (!row || typeof row.source !== 'string' || !HANGUL.test(row.source) ||
        typeof row.gold !== 'string' || !HANGUL.test(row.gold)) {
      throw new TypeError('invalid Seoul word pair at index ' + index);
    }
    const key = JSON.stringify([row.source, row.gold]);
    const current = counts.get(key);
    if (current) current.weight += 1;
    else counts.set(key, { source: row.source, gold: row.gold, weight: 1 });
  }
  return [...counts.values()];
}

export function evaluateMode(pairs, engine, mode, totalOccurrences) {
  let scored = 0, exact = 0, distanceTotal = 0, referenceChars = 0, outputAvailable = 0;
  let unresolved = 0, partial = 0, heuristic = 0, typedFallback = 0;
  let targetUnavailable = 0, targetProvisional = 0, errors = 0;
  let abstentionPenaltyDistance = 0;
  const outputs = new Map();
  let profile = null;
  for (const pair of pairs) {
    const options = mode === 'strict'
      ? { morphologyMode: mode, ipaProfile: 'clippyfirst-korean-broad-v1' }
      : { morphologyMode: mode };
    try {
      const result = engine.convert(pair.source, options);
      if (profile === null) profile = {
        ipa_profile: result.ipa_profile ?? null,
        ipa_profile_version: result.ipa_profile_version ?? null,
        ipa_profile_status: result.ipa_profile_status ?? null
      };
      if (result.target_status === 'unavailable') targetUnavailable += pair.weight;
      if (result.target_status === 'provisional' || result.candidate_status === 'provisional') targetProvisional += pair.weight;
      const trace = Array.isArray(result.trace) ? result.trace : [];
      const candidateSurface = surfaceFor(result, pair.source);
      if (candidateSurface !== null) outputAvailable += pair.weight;
      const fallback = result.phonetic_result_type === 'mixed-surface-ipa-and-orthographic-fallback' ||
        trace.some(item => item?.status === 'super-soft-orthographic-fallback' ||
          item?.phoneticResultType === 'orthographic-phonemic-fallback');
      if (fallback) {
        typedFallback += pair.weight;
        // An orthographic-phonemic fallback is a typed coverage outcome, not
        // source-resolved pronunciation. Keep it out of Exact/CER and paired wins.
        abstentionPenaltyDistance += [...pair.gold].length * pair.weight;
        outputs.set(JSON.stringify([pair.source, pair.gold]), {
          status: 'typed_fallback', predicted: null, exact: false, distance: null, weight: pair.weight
        });
        continue;
      }
      const status = result.pronunciation_status ?? (result.ipa ? 'resolved' : 'unresolved');
      if (status === 'heuristic') {
        heuristic += pair.weight;
        abstentionPenaltyDistance += [...pair.gold].length * pair.weight;
        outputs.set(JSON.stringify([pair.source, pair.gold]), { status, predicted: null, exact: false, distance: null, weight: pair.weight });
        continue;
      }
      if (status === 'partial') {
        partial += pair.weight;
        abstentionPenaltyDistance += [...pair.gold].length * pair.weight;
        outputs.set(JSON.stringify([pair.source, pair.gold]), { status, predicted: null, exact: false, distance: null, weight: pair.weight });
        continue;
      }
      if (status === 'unresolved' || !result.ipa) {
        unresolved += pair.weight;
        abstentionPenaltyDistance += [...pair.gold].length * pair.weight;
        outputs.set(JSON.stringify([pair.source, pair.gold]), { status: 'unresolved', predicted: null, exact: false, distance: null, weight: pair.weight });
        continue;
      }
      const predicted = candidateSurface;
      if (predicted === null) {
        unresolved += pair.weight;
        abstentionPenaltyDistance += [...pair.gold].length * pair.weight;
        outputs.set(JSON.stringify([pair.source, pair.gold]), { status: 'unresolved_surface', predicted: null, exact: false, distance: null, weight: pair.weight });
        continue;
      }
      const distance = editDistance(predicted, pair.gold);
      const isExact = distance === 0;
      scored += pair.weight;
      if (isExact) exact += pair.weight;
      distanceTotal += distance * pair.weight;
      referenceChars += [...pair.gold].length * pair.weight;
      abstentionPenaltyDistance += distance * pair.weight;
      outputs.set(JSON.stringify([pair.source, pair.gold]), { status: 'resolved', predicted, exact: isExact, distance, weight: pair.weight });
    } catch {
      errors += pair.weight;
      abstentionPenaltyDistance += [...pair.gold].length * pair.weight;
      outputs.set(JSON.stringify([pair.source, pair.gold]), { status: 'engine_error', predicted: null, exact: false, distance: null, weight: pair.weight });
    }
  }
  return {
    summary: {
      mode,
      ...profile,
      eligible_occurrences: totalOccurrences,
      unique_source_gold_pairs: pairs.length,
      scored_occurrences: scored,
      coverage: totalOccurrences ? scored / totalOccurrences : null,
      output_available_occurrences: outputAvailable,
      output_availability_rate: totalOccurrences ? outputAvailable / totalOccurrences : null,
      exact_matches: exact,
      exact_match_rate_scored_only: scored ? exact / scored : null,
      exact_match_rate_coverage_adjusted: totalOccurrences ? exact / totalOccurrences : null,
      cer_scored_only: referenceChars ? distanceTotal / referenceChars : null,
      cer_with_abstentions_as_deletions: totalOccurrences ? abstentionPenaltyDistance / pairs.reduce((n,p)=>n + [...p.gold].length*p.weight,0) : null,
      unresolved_occurrences: unresolved,
      partial_occurrences: partial,
      heuristic_occurrences: heuristic,
      typed_fallback_occurrences: typedFallback,
      target_unavailable_occurrences: targetUnavailable,
      target_provisional_occurrences: targetProvisional,
      engine_errors: errors
    },
    outputs
  };
}

function compareModes(left, right) {
  let common = 0, changed = 0, leftWins = 0, rightWins = 0, ties = 0;
  for (const [key, a] of left.outputs) {
    const b = right.outputs.get(key);
    if (!b || a.status !== 'resolved' || b.status !== 'resolved') continue;
    const weight = Math.min(a.weight, b.weight);
    common += weight;
    if (a.predicted !== b.predicted) changed += weight;
    if (a.exact && !b.exact) leftWins += weight;
    else if (b.exact && !a.exact) rightWins += weight;
    else ties += weight;
  }
  return { common_scored_occurrences: common, output_changed_occurrences: changed, left_exact_wins: leftWins, right_exact_wins: rightWins, exact_ties: ties };
}

function main() {
  const args = process.argv.slice(2);
  const value = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : null; };
  const corpusPath = value('--corpus');
  const outputPath = value('--output');
  if (!corpusPath || !outputPath) {
    process.stderr.write('Usage: node scripts/benchmark_kozak_kim_seoul_browser.mjs --corpus pairs.json --output report.json\n');
    process.exitCode = 2;
    return;
  }
  try {
    const pairs = loadPairs(corpusPath);
    const totalOccurrences = pairs.reduce((sum, pair) => sum + pair.weight, 0);
    const engine = createBrowserKozakKimEngine();
    const results = MODES.map(mode => evaluateMode(pairs, engine, mode, totalOccurrences));
    const report = {
      schema_version: 1,
      benchmark: 'Seoul Corpus word-level Hangul pronunciation diagnostic',
      source: 'OpenSLR SLR113 label-TextGrid archive',
      source_archive_sha256: '63c3f8ffa6976307a732689d6c5be7b2db4ec20f14bf276faf98c886add0d24b',
      source_license: 'CC BY-NC 2.0',
      reference_tiers: 'pWord.ortho. → pWord.prono.',
      unit: 'word-level Hangul surface pronunciation; not IPA and not Ukrainian target accuracy',
      audio_used: false,
      corpus_pairs: totalOccurrences,
      unique_source_gold_pairs: pairs.length,
      unique_source_forms: new Set(pairs.map(pair => pair.source)).size,
      modes: results.map(result => result.summary),
      paired_mode_deltas: {
        strict_vs_soft: compareModes(results[0], results[1]),
        strict_vs_super_soft: compareModes(results[0], results[2]),
        soft_vs_super_soft: compareModes(results[1], results[2])
      },
      notes: [
        'Only aligned word-tier intervals with Hangul-only orthographic and pronunciation labels are included.',
        'The 12 interval-boundary mismatches observed in the archive are excluded from paired word scoring.',
        'Each distinct source/reference pair is evaluated once and weighted by its corpus occurrence count.',
        'Heuristic, partial, unresolved, typed fallback, and engine-error outputs are excluded from source-resolved Exact/CER.',
        'Strict, Soft, and Super-soft remain separate runtime policies; their IPA profile IDs differ and this benchmark scores Hangul surface spelling, not IPA.',
        'The Seoul Corpus is licensed CC BY-NC 2.0. The corpus and pair file are downloaded/generated only in the CI runner and are not committed or uploaded.',
        'This corpus is an external diagnostic, not independently adjudicated normative gold; it must not be used to tune the rules and then be reported as a sealed holdout.'
      ]
    };
    writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
    process.stdout.write(JSON.stringify(report.modes, null, 2) + '\n');
  } catch (error) {
    process.stderr.write('Seoul surface benchmark failed: ' + (error instanceof Error ? error.stack : String(error)) + '\n');
    process.exitCode = 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
