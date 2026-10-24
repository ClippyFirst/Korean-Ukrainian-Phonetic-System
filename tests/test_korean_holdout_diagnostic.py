import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

# The executable uses a hyphenated filename, which cannot be imported with a
# normal Python import statement. Load that exact file by path so the test
# exercises the same script that CI invokes.
_DIAGNOSTIC_PATH = SCRIPTS / "diagnose-korean-ipa-holdout.py"
_SPEC = importlib.util.spec_from_file_location("diagnose_korean_ipa_holdout", _DIAGNOSTIC_PATH)
if _SPEC is None or _SPEC.loader is None:
    raise ImportError(f"Cannot load holdout diagnostic script: {_DIAGNOSTIC_PATH}")
_DIAGNOSTIC = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(_DIAGNOSTIC)
read_manifest = _DIAGNOSTIC.read_manifest
run = _DIAGNOSTIC.run

from validate_ipa_holdout import collect_local_forms


def test_holdout_diagnostic_covers_frozen_manifest():
    manifest, digest = read_manifest(ROOT / "data/korean/ipa_holdout_2026-10-24.json")
    report = run()
    assert manifest["caseCount"] == 24 and len(digest) == 64
    assert report["manifestSha256"] == digest
    assert report["status"] == "DIAGNOSTIC_ONLY_NOT_GOLD_NOT_FOR_TUNING"
    assert report["tuningUseProhibited"] is True and len(report["cases"]) == 24
    assert len({row["caseId"] for row in report["cases"]}) == 24
    assert all(row["engines"]["native_strict"]["available"] for row in report["cases"])
    assert all("ipaGold" not in row and "ukrainianGold" not in row for row in report["cases"])
    assert all(row["comparatorType"].endswith("not IPA gold") for row in report["cases"])
    assert all(isinstance(row["engines"]["native_strict"]["ipa_variants"], list) for row in report["cases"])
    assert all(isinstance(row["engines"]["native_strict"]["surface_syllables"], list) for row in report["cases"])

    # Both target adapters have different analysis shapes (native object vs
    # shared-G2P list). Assert the diagnostic preserves a typed, inspectable
    # record instead of silently iterating dict keys or dropping the status.
    for row in report["cases"]:
        engines = row["engines"]
        native_target = engines["native_strict_ukrainian_target"]
        g2pk_target = engines["g2pk_ukrainian_target"]
        assert native_target["available"] is True
        for target in (native_target, g2pk_target):
            if target["available"]:
                assert isinstance(target["target_analysis_statuses"], list)
                assert isinstance(target["target_analysis_uninspectable_items"], int)
                assert target["target_analysis_uninspectable_items"] == 0
            else:
                # g2pK is intentionally optional and is not installed on Python
                # 3.13+; the diagnostic must preserve the explicit blocker.
                assert isinstance(target.get("error"), str) and target["error"]
        assert isinstance(native_target["target_analysis_status"], (str, type(None)))
        if g2pk_target["available"]:
            assert isinstance(g2pk_target["target_analysis_status"], (str, type(None)))


def test_holdout_tokens_remain_disjoint_from_runtime_data_and_test_fixtures():
    manifest, _ = read_manifest(ROOT / "data/korean/ipa_holdout_2026-10-24.json")
    holdout = {case["input"] for case in manifest["cases"]}
    local = collect_local_forms(ROOT)
    overlaps = {name: sorted(holdout & forms) for name, forms in local.items() if holdout & forms}
    assert overlaps == {}
