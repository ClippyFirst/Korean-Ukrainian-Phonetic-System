#!/usr/bin/env python3
"""Build a schema-validated aggregate-only summary across all Korean benchmark tracks."""
from __future__ import annotations
import argparse
import json
from pathlib import Path
from scripts.summarize_korean_benchmark_reports import summarize

MULTI_ENGINE_REPORTS = (
    ("ugtphon", "multi-engine-ipa-report.json"),
    ("sigmorphon", "sigmorphon-multi-engine-ipa-report.json"),
    ("seoul-ipa", "open-korean-benchmarks-work/prepared/seoul-ipa-multi-engine-report.json"),
    ("kspan-modern", "open-korean-benchmarks-work/prepared/kspan-modern-multi-engine-report.json"),
    ("kspan-conservative", "open-korean-benchmarks-work/prepared/kspan-conservative-multi-engine-report.json"),
    ("ipa-dict-ko", "open-korean-benchmarks-work/prepared/ipa-dict-ko-multi-engine-report.json"),
)
BROWSER_REPORTS = (
    ("ugtphon-strict", "kozak-kim-browser-ugtphon-report.json"),
    ("ugtphon-soft", "kozak-kim-browser-ugtphon-soft-report.json"),
    ("ugtphon-super-soft", "kozak-kim-browser-ugtphon-super-soft-report.json"),
    *tuple((f"sigmorphon-{mode}", f"kozak-kim-browser-sigmorphon-{mode}-report.json")
           for mode in ("strict", "soft", "super-soft")),
    *tuple((f"{dataset}-{mode}", f"open-korean-benchmarks-work/prepared/{dataset}-browser-{mode}-report.json")
           for dataset in ("kspan-modern", "kspan-conservative", "ipa-dict-ko")
           for mode in ("strict", "soft", "super-soft")),
)

def build_summary(runner_temp: Path) -> dict:
    multi = [f"{name}={runner_temp / path}" for name, path in MULTI_ENGINE_REPORTS]
    browser = [f"{name}={runner_temp / path}" for name, path in BROWSER_REPORTS]
    manifest = runner_temp / "open-korean-benchmarks-work/prepared/manifest.json"
    result = summarize(multi, browser, manifest)
    if len(result["multi_engine_tracks"]) != 6 or len(result["browser_mode_tracks"]) != 15:
        raise AssertionError("Expected six multi-engine tracks and fifteen Browser mode reports")
    kspan = result["manifest"].get("kspan", {})
    if kspan.get("key_worldbet_integrity_status") != "WARN":
        raise AssertionError("K-SPAN key/WorldBet discrepancy warning must remain visible")
    if kspan.get("key_worldbet_integrity_mismatches") != 22843:
        raise AssertionError("K-SPAN aggregate mismatch count changed; review source evidence")
    if "key_worldbet_integrity_examples" in kspan:
        raise AssertionError("Row-level K-SPAN examples must not enter aggregate artifacts")
    for dataset in ("ugtphon", "sigmorphon", "kspan-modern", "kspan-conservative", "ipa-dict-ko"):
        modes = {row["morphology_mode"]: row for row in result["browser_mode_tracks"]
                 if row["track"].startswith(dataset + "-")}
        if set(modes) != {"strict", "soft", "super-soft"}:
            raise AssertionError(f"{dataset}: missing one or more Browser modes")
        rates = [modes[mode].get("output_availability_rate") for mode in ("strict", "soft", "super-soft")]
        if any(rate is None for rate in rates) or rates != sorted(rates) or rates[-1] != 1.0:
            raise AssertionError(f"{dataset}: Browser candidate availability contract failed: {rates}")
    return result

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--runner-temp", type=Path, required=True)
    args = parser.parse_args()
    result = build_summary(args.runner_temp)
    output = args.runner_temp / "korean-benchmark-aggregate-summary.json"
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(output), "multi_engine_tracks": 6,
                      "browser_mode_reports": 15, "artifact_scope": "aggregate-only"}))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
