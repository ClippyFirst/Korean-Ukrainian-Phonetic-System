from pathlib import Path
from scripts.diagnose_korean_ipa_holdout import read_manifest, run
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
