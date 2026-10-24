from pathlib import Path
from scripts.diagnose_korean_ipa_holdout import read_manifest, run
from scripts.validate_ipa_holdout import collect_local_forms
ROOT = Path(__file__).resolve().parents[1]
def test_holdout_diagnostic_covers_frozen_manifest():
    manifest, digest = read_manifest(ROOT / 'data/korean/ipa_holdout_2026-10-24.json')
    report = run()
    assert manifest['caseCount'] == 24 and len(digest) == 64
    assert report['status'] == 'DIAGNOSTIC_ONLY_NOT_GOLD_NOT_FOR_TUNING'
    assert report['tuningUseProhibited'] is True and len(report['cases']) == 24
    assert len({row['caseId'] for row in report['cases']}) == 24
    assert all(row['engines']['native_strict']['available'] for row in report['cases'])
    assert all('ipaGold' not in row and 'ukrainianGold' not in row for row in report['cases'])
    assert all(row['comparatorType'].endswith('not IPA gold') for row in report['cases'])

def test_holdout_tokens_remain_disjoint_from_runtime_data_and_test_fixtures():
    manifest, _ = read_manifest(ROOT / 'data/korean/ipa_holdout_2026-10-24.json')
    holdout = {case['input'] for case in manifest['cases']}
    local = collect_local_forms(ROOT)
    overlaps = {name: sorted(holdout & forms) for name, forms in local.items() if holdout & forms}
    assert overlaps == {}
