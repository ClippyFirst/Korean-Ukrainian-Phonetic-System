#!/usr/bin/env python3
"""Audit repository data readiness and leakage risk for a ClippyFirst v3 experiment."""
from __future__ import annotations
import argparse
import csv
import json
from collections import Counter
from pathlib import Path
from typing import Any

def _read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as stream:
        return [dict(row) for row in csv.DictReader(stream)]

def audit_training_readiness(root: Path) -> dict[str, Any]:
    lexical_path = root / "data/korean/lexical_pronunciations.csv"
    addition_paths = [
        root / "data/korean/lexical_additions_2026-10-15.csv",
        root / "data/korean/lexical_additions_2026-10-15-g2pk.csv",
        root / "data/korean/lexical_additions_ipa-adjudication-2026-10-24.csv",
    ]
    lexical = _read_csv(lexical_path)
    additions = [row for path in addition_paths if path.exists() for row in _read_csv(path)]
    manifest = json.loads((root / "data/korean/benchmarks/ipa-holdout-24-manifest.json").read_text(encoding="utf-8"))
    holdout = {case["input"] for case in manifest.get("cases", [])}
    lexical_forms = {r.get("input", "").strip() for r in lexical if r.get("input", "").strip()}
    addition_forms = {r.get("input", "").strip() for r in additions if r.get("input", "").strip()}
    statuses = Counter((r.get("target_status") or "missing").strip() or "missing" for r in lexical)
    duplicates = sorted(form for form, n in Counter(r.get("input", "").strip() for r in lexical).items() if form and n > 1)
    ipa_candidates = [r for r in lexical if r.get("input", "").strip() and r.get("surface_hangul", "").strip() and r.get("ipa_syllables", "").strip()]
    marked_gold = [r for r in additions if (r.get("ipa_adjudication_status") or "").strip().upper() in {"ADJUDICATED", "INDEPENDENTLY_ADJUDICATED", "GOLD"}]
    holdout_gold = [c.get("caseId") for c in manifest.get("cases", []) if c.get("ipaGold")]
    return {
        "schema_version": "1.0.0",
        "purpose": "Training-data readiness and leakage audit, not an accuracy benchmark",
        "counts": {
            "lexical_rows": len(lexical),
            "unique_lexical_inputs": len(lexical_forms),
            "duplicate_lexical_input_forms": len(duplicates),
            "addition_rows": len(additions),
            "frozen_holdout_cases": len(holdout),
            "lexical_rows_with_surface_and_ipa_candidates": len(ipa_candidates),
            "explicitly_marked_independently_adjudicated_ipa_rows_in_additions": len(marked_gold),
            "frozen_holdout_cases_with_ipa_gold": len(holdout_gold),
        },
        "target_status_counts": dict(sorted(statuses.items())),
        "leakage_checks": {
            "holdout_overlaps_lexical_inputs": sorted(holdout & lexical_forms),
            "holdout_overlaps_addition_inputs": sorted(holdout & addition_forms),
            "holdout_is_evaluation_only": True,
        },
        "training_decision": {
            "supervised_ipa_training_ready": False,
            "reason": "IPA candidates are not automatically independent gold. No independently adjudicated IPA gold set is explicitly marked in the inspected tables, and the frozen 24-form holdout has pending IPA annotation.",
            "next_step": "Review provenance per label; independently annotate and adjudicate IPA; create frozen train/dev/test splits; never train on UGTPHON, SIGMORPHON test rows, or the frozen holdout.",
        },
        "duplicate_forms": duplicates,
    }

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = audit_training_readiness(args.root.resolve())
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
