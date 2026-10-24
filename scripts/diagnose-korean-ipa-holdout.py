#!/usr/bin/env python3
"""Read-only diagnostic of the frozen 24-form Korean IPA holdout.

IMPORTANT: this is a quarantined diagnostic, not a tuning/evaluation split.
Do not add its cases to lexical rules, normalization tables, or regression gold.
The NIKL Hangul surface spelling is not IPA gold; surface agreement is only a
phonological clue. No accuracy claim is made for IPA or Ukrainian output.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
MANIFEST = ROOT / 'data/korean/ipa_holdout_2026-10-24.json'

def read_manifest(path: Path) -> tuple[dict, str]:
    raw = path.read_text(encoding='utf-8')
    data = json.loads(raw)
    if data.get('split') != 'HOLDOUT' or 'FROZEN' not in data.get('status', ''):
        raise ValueError('Refusing to run: input manifest is not frozen HOLDOUT.')
    cases = data.get('cases')
    if not isinstance(cases, list) or len(cases) != data.get('caseCount') or len(cases) != 24:
        raise ValueError('Refusing to run: expected the frozen 24-case manifest and matching caseCount.')
    ids = [case.get('caseId') for case in cases]
    if len(set(ids)) != len(ids):
        raise ValueError('Refusing to run: duplicate case IDs.')
    for case in cases:
        if case.get('tuningUseProhibited') is not True or case.get('engineOutputsStored') is not False:
            raise ValueError(f'Refusing to run: quarantine invariant changed for {case.get("caseId")}.')
        if case.get('ipaGold') is not None:
            raise ValueError(f'Refusing to run: IPA gold is present for {case.get("caseId")}; this tool is only for pre-adjudication diagnostics.')
    return data, hashlib.sha256(raw.encode('utf-8')).hexdigest()

def normalize_surface(value: str) -> str:
    return re.sub(r'[^가-힣]', '', value.replace('ː', ''))

def levenshtein(a: str, b: str) -> int:
    previous = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        current = [i]
        for j, cb in enumerate(b, 1):
            current.append(min(current[-1] + 1, previous[j] + 1, previous[j - 1] + (ca != cb)))
        previous = current
    return previous[-1]

def attempt(fn, *args, **kwargs):
    try:
        return {'available': True, 'value': fn(*args, **kwargs), 'error': None}
    except Exception as exc:  # record optional adapter/dependency failures; never fake an output
        return {'available': False, 'value': None, 'error': f'{type(exc).__name__}: {exc}'}

def run(output: Path | None = None) -> dict:
    manifest, manifest_sha = read_manifest(MANIFEST)
    from src.korean_ukrainian.pipeline import phoneticize_korean, transliterate_korean
    from src.korean_ukrainian.g2pk_engine import phoneticize_with_g2pk, transliterate_with_g2pk
    from src.korean_ukrainian.ukrainian_adapter import UkrainianTargetAdapter
    target_inventory_status = UkrainianTargetAdapter().status()
    records = []
    family_summary = defaultdict(lambda: {'cases': 0, 'native_surface_exact': 0, 'g2pk_surface_exact': 0, 'native_surface_edit_distance': 0, 'g2pk_surface_edit_distance': 0, 'native_unresolved': 0, 'g2pk_unavailable': 0, 'ukrainian_native_available': 0, 'ukrainian_g2pk_available': 0})
    rule_summary = Counter()
    for case in manifest['cases']:
        word = case['input']
        native_strict = attempt(phoneticize_korean, word, morphology_mode='strict')
        native_soft = attempt(phoneticize_korean, word, morphology_mode='soft')
        g2pk = attempt(phoneticize_with_g2pk, word)
        native_target = attempt(transliterate_korean, word, morphology_mode='strict')
        g2pk_target = attempt(transliterate_with_g2pk, word)
        readings = case.get('allowedSurfaceReadings') or [case.get('surfaceReading', '')]
        normalized_readings = sorted({normalize_surface(value) for value in readings if value})
        row = {'caseId': case['caseId'], 'input': word, 'sourceRule': case['sourceRule'], 'sourceAuthority': case['sourceAuthority'], 'sourceLocator': case['sourceLocator'], 'sourceExcerpt': case['sourceExcerpt'], 'allowedSurfaceReadings': readings, 'normalizedSurfaceComparators': normalized_readings, 'comparatorType': 'NIKL Hangul surface notation, stripped of length marker; not IPA gold'}
        engines = {}
        for name, result in [('native_strict', native_strict), ('native_soft', native_soft), ('g2pk', g2pk)]:
            if not result['available']:
                engines[name] = {'available': False, 'error': result['error']}
                continue
            value = result['value']
            if name == 'g2pk':
                surface = value.get('surface_hangul')
                ipa = value.get('ipa', {}).get('ipa')
                rules = value.get('rules', [])
                ipa_status = value.get('ipa', {}).get('status', value.get('ipa', {}).get('level'))
            else:
                surface = value.get('surface_hangul')
                ipa = value.get('ipa', {}).get('ipa')
                rules = value.get('rules', [])
                ipa_status = value.get('ipa_status')
            norm_surface = normalize_surface(surface or '')
            exact = norm_surface in normalized_readings if normalized_readings else None
            distance = min((levenshtein(norm_surface, candidate) for candidate in normalized_readings), default=None)
            rule_counts = Counter(item.get('rule_id', 'UNKNOWN') for item in rules)
            for rule_id, count in rule_counts.items(): rule_summary[f'{name}:{rule_id}'] += count
            engines[name] = {'available': True, 'morphology_mode': value.get('morphology_mode'), 'surface_hangul': surface, 'normalized_surface_hangul': norm_surface, 'surface_syllables': value.get('surface_syllables', value.get('surface_syllables', [])), 'surface_comparator_exact': exact, 'surface_comparator_min_edit_distance': distance, 'ipa': ipa, 'ipa_variants': value.get('ipa', {}).get('variants', []), 'ipa_status': ipa_status, 'pronunciation_status': value.get('pronunciation_status'), 'unresolved_contexts': value.get('unresolved_contexts', []), 'rule_trace': rules, 'rule_ids': sorted(rule_counts)}
            if name == 'native_strict':
                row['_native_strict_surface_exact'] = exact
                row['_native_strict_distance'] = distance
                row['_native_strict_unresolved'] = value.get('pronunciation_status') == 'unresolved'
            elif name == 'g2pk':
                row['_g2pk_surface_exact'] = exact
                row['_g2pk_distance'] = distance
        for name, result in [('native_strict', native_target), ('g2pk', g2pk_target)]:
            if result['available']:
                value = result['value']
                target_analysis = value.get('target_analysis', [])
                # Native IPA mapping has {status, segments:[{target:{status,adapter,...}}]};
                # the external G2P target renderer has a list of word-level
                # {status, reason} records. Read the status at the actual level
                # instead of silently collecting null segment-level fields.
                target_adapter_status = None
                if isinstance(target_analysis, dict):
                    target_records = target_analysis.get('segments', [])
                    target_analysis_status = target_analysis.get('status')
                    target_analysis_statuses = [
                        item.get('target', {}).get('status')
                        if isinstance(item.get('target'), dict)
                        else item.get('status')
                        for item in target_records if isinstance(item, dict)
                    ]
                    target_adapter_status = next((
                        item.get('target', {}).get('adapter')
                        for item in target_records
                        if isinstance(item.get('target'), dict)
                        and isinstance(item['target'].get('adapter'), dict)
                    ), None)
                elif isinstance(target_analysis, list):
                    target_records = target_analysis
                    target_analysis_status = None
                    target_analysis_statuses = [
                        item.get('status') for item in target_records if isinstance(item, dict)
                    ]
                else:
                    target_records = []
                    target_analysis_status = 'unexpected-target-analysis-shape'
                    target_analysis_statuses = []
                engines[name + '_ukrainian_target'] = {
                    'available': True,
                    'ukrainian_orthography': value.get('ukrainian_orthography'),
                    'target_status': value.get('target_status'),
                    'selection_status': value.get('selection_status'),
                    'target_analysis_status': target_analysis_status,
                    'target_analysis_statuses': target_analysis_statuses,
                    'target_adapter_status': target_adapter_status,
                    'target_analysis_uninspectable_items': sum(not isinstance(item, dict) for item in target_records),
                }
                row['_target_' + name] = bool(value.get('ukrainian_orthography'))
            else:
                engines[name + '_ukrainian_target'] = {'available': False, 'error': result['error']}
                row['_target_' + name] = False
        row['engines'] = engines
        family = case['sourceRule']
        agg = family_summary[family]
        agg['cases'] += 1
        agg['native_surface_exact'] += int(bool(row.get('_native_strict_surface_exact')))
        agg['g2pk_surface_exact'] += int(bool(row.get('_g2pk_surface_exact')))
        agg['native_surface_edit_distance'] += row.get('_native_strict_distance') or 0
        agg['g2pk_surface_edit_distance'] += row.get('_g2pk_distance') or 0
        agg['native_unresolved'] += int(bool(row.get('_native_strict_unresolved')))
        agg['g2pk_unavailable'] += int(not g2pk['available'])
        agg['ukrainian_native_available'] += int(row['_target_native_strict'])
        agg['ukrainian_g2pk_available'] += int(row['_target_g2pk'])
        for key in list(row):
            if key.startswith('_'): del row[key]
        records.append(row)
    for value in family_summary.values():
        n = value['cases']
        value['native_surface_exact_rate'] = round(value['native_surface_exact'] / n, 6) if n else None
        value['g2pk_surface_exact_rate'] = round(value['g2pk_surface_exact'] / n, 6) if n else None
    report = {'schemaVersion': 1, 'title': 'ClippyFirst frozen Korean 24-form pre-adjudication diagnostics', 'status': 'DIAGNOSTIC_ONLY_NOT_GOLD_NOT_FOR_TUNING', 'generatedBy': 'scripts/diagnose-korean-ipa-holdout.py', 'manifestPath': 'data/korean/ipa_holdout_2026-10-24.json', 'manifestSha256': manifest_sha, 'caseCount': len(records), 'split': 'HOLDOUT', 'tuningUseProhibited': True, 'goldStatus': '0/24 independently adjudicated IPA labels; no IPA or Ukrainian accuracy claims', 'comparisonPolicy': 'NIKL Hangul surface spelling is used only as a coarse diagnostic comparator; no output is promoted to IPA gold; no rule is automatically changed.', 'ukrainianTargetInventory': target_inventory_status, 'ruleTraceCounts': dict(sorted(rule_summary.items())), 'sourceRuleSummary': dict(sorted(family_summary.items())), 'cases': records}
    serialized = json.dumps(report, ensure_ascii=False, indent=2) + '\n'
    if output:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(serialized, encoding='utf-8')
    else:
        print(serialized, end='')
    return report

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, help='Write the diagnostic JSON report to this path; default stdout.')
    args = parser.parse_args()
    report = run(args.output)
    print(f"Diagnostic completed: {report['caseCount']} frozen cases; no gold labels written; tuning prohibited.", file=sys.stderr)
    return 0

if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f'Holdout diagnostic failed closed: {type(exc).__name__}: {exc}', file=sys.stderr)
        raise SystemExit(2)