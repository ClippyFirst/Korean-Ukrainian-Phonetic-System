import json
from pathlib import Path


def test_pinned_profile_sensitivity_snapshot_is_reproducibly_identified():
    root = Path(__file__).resolve().parents[1]
    report = json.loads(
        (root / "research/broad-ipa-profile-sensitivity-2026-10-24.json").read_text(encoding="utf-8")
    )
    assert report["sourceArtifact"]["reportSha256"] == "448c23993032e7a30a7f2cff716a9b048bf856481e1cc839c734c3de9b5f082f"
    assert report["sourceArtifact"]["pairedScoredOccurrences"] == 2655
    assert report["profileResults"]["legacy-broad-diagnostic-v0"]["native"]["exactMatches"] == 1412
    assert report["profileResults"]["clippyfirst-broad-v1"]["native"]["exactMatches"] == 2417
    assert report["profileResults"]["clippyfirst-broad-v1"]["engineDelta"]["typeClusterBootstrap"]["ci95"] == [-0.473934, 0.366972]
    assert report["interpretation"]["validatedAccuracyClaim"] is False
