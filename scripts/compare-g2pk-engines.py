#!/usr/bin/env python3
"""Diagnostic surface comparison: browser JS g2pK port vs Python g2pK.

This report compares Korean surface spellings only. It does not adjudicate IPA,
and mismatches are diagnostic rather than automatically treated as defects:
the browser port uses heuristic POS annotation while Python g2pK uses MeCab.
"""
from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "tests" / "fixtures" / "g2pk-surface-regression.json"
NODE_EXPORT = ROOT / "scripts" / "export-browser-g2pk-surfaces.mjs"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=ROOT / "g2pk-differential-report.json")
    args = parser.parse_args()

    fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))
    browser_process = subprocess.run(
        ["node", "--experimental-strip-types", str(NODE_EXPORT)],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    browser_data = json.loads(browser_process.stdout)
    browser_rows = {row["input"]: row for row in browser_data["rows"]}

    try:
        from g2pk import G2p
    except ImportError as exc:
        raise SystemExit(
            "Python g2pK is unavailable. Install the optional extra with "
            "python -m pip install -e '.[g2pk]' in Python 3.11/3.12."
        ) from exc

    python_g2p = G2p()
    rows = []
    for case in fixture["cases"]:
        browser = browser_rows[case["input"]]
        python_surface = str(python_g2p(case["input"]))
        expected = case["expectedSurface"]
        rows.append({
            "input": case["input"],
            "phenomenon": case["phenomenon"],
            "expected_surface": expected,
            "browser_surface": browser["browser_surface"],
            "python_g2pk_surface": python_surface,
            "browser_matches_existing_fixture": browser["browser_surface"] == expected,
            "python_matches_existing_fixture": python_surface == expected,
            "browser_equals_python": browser["browser_surface"] == python_surface,
            "browser_status": browser["browser_status"],
            "browser_issues": browser["browser_issues"],
            "ipa_gold_status": case["ipaGoldStatus"],
            "ipa_comparison": "not_performed",
        })

    compared = len(rows)
    report = {
        "schemaVersion": 1,
        "comparison": "browser JavaScript g2pK port vs Python g2pK",
        "scope": "surface spelling only; not IPA verification or normative gold",
        "fixture": str(FIXTURE.relative_to(ROOT)),
        "python_version_note": "g2pK extra is declared for Python <3.13; use 3.11/3.12",
        "rows_compared": compared,
        "browser_python_equal": sum(row["browser_equals_python"] for row in rows),
        "browser_python_different": sum(not row["browser_equals_python"] for row in rows),
        "fixture_expectations_different_from_python": sum(not row["python_matches_existing_fixture"] for row in rows),
        "rows": rows,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"Compared {compared} surface forms: "
        f"{report['browser_python_equal']} equal, "
        f"{report['browser_python_different']} different. "
        f"IPA was not compared. Report: {args.output}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
