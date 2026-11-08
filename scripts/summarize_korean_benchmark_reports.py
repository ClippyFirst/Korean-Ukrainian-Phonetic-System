#!/usr/bin/env python3
"""Create aggregate-only benchmark artifacts without source token records."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


ENGINE_METRICS = (
    "scored_tokens", "exact_matches", "exact_match_rate", "character_error_rate",
    "phoneme_error_rate", "phonological_feature_error_rate_proxy",
    "coverage", "coverage_adjusted_exact_match_rate",
    "abstentions_or_unresolved", "engine_errors_on_token_loop",
    "bootstrap_95pct_ci",
)


def _named_path(value: str) -> tuple[str, Path]:
    name, separator, raw_path = value.partition("=")
    if not separator or not name.strip() or not raw_path.strip():
        raise ValueError(f"expected NAME=PATH, got {value!r}")
    return name.strip(), Path(raw_path)


def _multi_engine(path: Path, track: str) -> dict[str, Any]:
    report = json.loads(path.read_text(encoding="utf-8"))
    engines: dict[str, Any] = {}
    for name in report["engine_order"]:
        source = report["engines"][name]
        result = {key: source.get(key) for key in ENGINE_METRICS}
        broad = source.get("broad_candidate", {})
        result["broad_candidate"] = {
            key: broad.get(key) for key in (
                "scored_tokens", "exact_matches", "exact_match_rate",
                "character_error_rate", "coverage_adjusted_exact_match_rate",
                "bootstrap_95pct_ci",
            )
        }
        engines[name] = result
    return {
        "track": track,
        "type": "10-engine-strict-and-broad-ipa",
        "benchmark": report.get("benchmark"),
        "dataset_source": report.get("dataset_source"),
        "dataset_rows": report.get("dataset_rows"),
        "eligible_token_occurrences": report.get("eligible_token_occurrences"),
        "unique_hangul_words": report.get("unique_hangul_words"),
        "engine_order": report.get("engine_order"),
        "native_ipa_profile": report.get("native_ipa_profile"),
        "engines": engines,
        "limitations": report.get("limitations", []),
    }


def _browser(path: Path, track: str) -> dict[str, Any]:
    report = json.loads(path.read_text(encoding="utf-8"))
    keys = (
        "benchmark", "dataset_source", "split", "morphology_mode",
        "ipa_profile", "ipa_profile_version", "ipa_profile_status",
        "eligible_tokens", "scored_tokens", "coverage_rate",
        "source_resolved_coverage_rate", "output_available_tokens",
        "output_availability_rate", "candidate_output_availability_rate",
        "exact_matches", "exact_match_rate",
        "coverage_adjusted_exact_match_rate", "character_error_rate",
        "unresolved_tokens", "partial_tokens", "heuristic_tokens",
        "typed_fallback_tokens", "source_resolved_scored_tokens",
        "target_unavailable_tokens", "target_provisional_tokens", "engine_errors",
        "notes",
    )
    return {
        "track": track,
        "type": "clippyfirst-browser-runtime-mode",
        **{key: report.get(key) for key in keys},
    }


def summarize(
    multi_engine: list[str],
    browser: list[str],
    manifest_path: Path,
) -> dict[str, Any]:
    multi = [_named_path(item) for item in multi_engine]
    modes = [_named_path(item) for item in browser]
    return {
        "schema_version": 1,
        "report_scope": "aggregate-only; token-level source text, IPA labels, mismatch examples and occurrence ledgers are omitted",
        "manifest": json.loads(manifest_path.read_text(encoding="utf-8")),
        "multi_engine_tracks": [_multi_engine(path, name) for name, path in multi],
        "browser_mode_tracks": [_browser(path, name) for name, path in modes],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--multi-engine", action="append", default=[], metavar="NAME=PATH")
    parser.add_argument("--browser", action="append", default=[], metavar="NAME=PATH")
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    report = summarize(args.multi_engine, args.browser, args.manifest)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "multi_engine_tracks": len(report["multi_engine_tracks"]),
        "browser_mode_reports": len(report["browser_mode_tracks"]),
        "output": str(args.output),
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
