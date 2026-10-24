#!/usr/bin/env python3
"""Validate the frozen Korean IPA holdout without evaluating engine outputs."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def load_manifest(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("split") != "HOLDOUT":
        raise ValueError("manifest split must be HOLDOUT")
    cases = data.get("cases")
    if not isinstance(cases, list) or len(cases) < 20:
        raise ValueError("holdout must contain at least 20 cases")
    ids = [case.get("caseId") for case in cases]
    inputs = [case.get("input") for case in cases]
    if len(set(ids)) != len(ids) or len(set(inputs)) != len(inputs):
        raise ValueError("holdout IDs and input forms must be unique")
    for case in cases:
        if not case.get("sourceLocator", "").startswith("https://www.korean.go.kr/"):
            raise ValueError(f"{case.get('caseId')}: source must be an official NIKL URL")
        if case.get("surfaceEvidenceStatus") != "SOURCE_ATTESTED":
            raise ValueError(f"{case.get('caseId')}: Korean surface evidence is not attested")
        if case.get("sourceRepresentation") != "official Hangul surface-pronunciation notation; not IPA":
            raise ValueError(f"{case.get('caseId')}: source representation must not be mislabelled as IPA")
        if case.get("ipaGold") is not None or case.get("ipaGoldStatus") != "PENDING_TWO_INDEPENDENT_REVIEWERS":
            raise ValueError(f"{case.get('caseId')}: IPA gold must remain unfilled")
        if case.get("engineOutputsStored") is not False or case.get("tuningUseProhibited") is not True:
            raise ValueError(f"{case.get('caseId')}: holdout must not store outputs and must prohibit tuning")
        for reviewer in ("reviewerA", "reviewerB", "adjudicator"):
            if case.get(reviewer, {}).get("ipa") is not None:
                raise ValueError(f"{case.get('caseId')}: {reviewer} IPA must remain blank")
    return data


def collect_local_forms(root: Path) -> dict[str, list[str]]:
    inputs: dict[str, list[str]] = {}
    for relative in ("data/korean", "tests/fixtures"):
        folder = root / relative
        if not folder.exists():
            continue
        for path in folder.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in {".csv", ".json", ".txt", ".tsv"}:
                continue
            if path.name == "ipa_holdout_2026-10-24.json":
                continue
            try:
                content = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            inputs[str(path.relative_to(root))] = [content]
    return inputs


def benchmark_tokens(path: Path) -> set[str]:
    data = json.loads(path.read_text(encoding="utf-8"))
    tokens: set[str] = set()
    if isinstance(data, dict):
        occurrences = data.get("native_g2pk_pairwise_audit", {}).get("occurrences")
        if isinstance(occurrences, list):
            for row in occurrences:
                if isinstance(row, dict) and isinstance(row.get("token"), str):
                    tokens.add(row["token"])
            return tokens
        data = data.get("rows", data.get("data", []))
    if isinstance(data, list):
        for row in data:
            if not isinstance(row, dict):
                continue
            for field in ("text", "canonical", "token"):
                value = row.get(field)
                if isinstance(value, str):
                    tokens.add(value)
            for token in row.get("tokens", []) if isinstance(row.get("tokens"), list) else []:
                if isinstance(token, dict):
                    for field in ("text", "canonical"):
                        value = token.get(field)
                        if isinstance(value, str):
                            tokens.add(value)
    return tokens


def validate(root: Path, manifest_path: Path, benchmark_path: Path | None) -> dict[str, Any]:
    manifest = load_manifest(manifest_path)
    local = collect_local_forms(root)
    cases = manifest["cases"]
    local_overlaps = []
    for case in cases:
        needle = case["input"]
        for filename, contents in local.items():
            if any(needle in content for content in contents):
                local_overlaps.append({"caseId": case["caseId"], "input": needle, "file": filename})
    benchmark_overlaps = []
    if benchmark_path is not None:
        tokens = benchmark_tokens(benchmark_path)
        benchmark_overlaps = [
            {"caseId": case["caseId"], "input": case["input"]}
            for case in cases if case["input"] in tokens
        ]
    return {
        "manifest": str(manifest_path),
        "case_count": len(cases),
        "source_backed_surface_forms": sum(case["surfaceEvidenceStatus"] == "SOURCE_ATTESTED" for case in cases),
        "ipa_gold_count": sum(case["ipaGold"] is not None for case in cases),
        "local_runtime_or_fixture_overlap_count": len(local_overlaps),
        "local_runtime_or_fixture_overlaps": local_overlaps,
        "external_benchmark_overlap_check": "CHECKED" if benchmark_path is not None else "NOT_CHECKED",
        "external_benchmark_path": str(benchmark_path) if benchmark_path is not None else None,
        "external_benchmark_overlap_count": len(benchmark_overlaps),
        "external_benchmark_overlaps": benchmark_overlaps,
        "holdout_certification": (
            "BLOCKED_OVERLAP_FOUND"
            if local_overlaps or benchmark_overlaps
            else "FROZEN_INPUTS_EXTERNAL_OVERLAP_CHECK_PENDING"
            if benchmark_path is None
            else "OVERLAP_CHECKED_NO_EXACT_INPUT_OVERLAP"
        ),
        "note": "No engine was run. Surface-form evidence is not IPA gold; independent IPA annotation is still required.",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--benchmark-artifact", type=Path, help="pinned multi-engine report JSON or original corpus JSON")
    parser.add_argument("--require-overlap-check", action="store_true")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    manifest = args.manifest or args.root / "data/korean/ipa_holdout_2026-10-24.json"
    if args.require_overlap_check and args.benchmark_artifact is None:
        parser.error("--require-overlap-check requires --benchmark-artifact")
    result = validate(args.root, manifest, args.benchmark_artifact)
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")
    if result["local_runtime_or_fixture_overlap_count"] or result["external_benchmark_overlap_count"]:
        return 1
    if args.require_overlap_check and result["external_benchmark_overlap_check"] != "CHECKED":
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
