from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def test_browser_target_mapping_artifact_matches_canonical_csv_sources():
    script = ROOT / "scripts" / "generate_ipa_target_data.py"
    result = subprocess.run(
        [sys.executable, str(script), "--check"],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stdout + result.stderr
    assert "generated IPA target data is current" in result.stdout
