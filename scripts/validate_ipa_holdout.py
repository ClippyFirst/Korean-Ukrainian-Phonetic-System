#!/usr/bin/env python3
"""Validate the frozen Korean IPA holdout without evaluating engine outputs."""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
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


def collect_local_forms(root: Path) -> dict[str, set[str]]:
    """Collect exact forms from runtime data and expected-output fixtures.

    The official NIKL article-review fixture is source text, not engine output;
    source citation is allowed for a source-backed holdout and is excluded.
    """
    inputs: dict[str, set[str]] = {}
    for relative in ("data/korean", "tests"):
        folder = root / relative
        if not folder.exists():
            continue
        for path in folder.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in {".csv", ".json", ".txt", ".tsv", ".py", ".mjs", ".js", ".ts"}:
                continue
            if path.name in {"ipa_holdout_2026-10-24.json", "nikl-article-review-1-30.json", "nikl-all-articles-master-passage-2026-10-22.txt"}:
                continue
            try:
                content = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            relative_path = str(path.relative_to(root))
            if path.suffix.lower() == ".csv":
                # CSV notes and source excerpts may mention examples without
                # making them runtime inputs; only the input column is evidence
                # of possible runtime-data leakage.
                try:
                    rows = csv.DictReader(content.splitlines())
                    if rows.fieldnames and "input" in rows.fieldnames:
                        forms = set()
                        for row in rows:
                            forms.update(re.findall(r"[\uac00-\ud7a3]+", row.get("input", "") or ""))
                        inputs[relative_path] = forms
                        continue
                except csv.Error:
                    pass
            inputs[relative_path] = set(re.findall(r"[\uac00-\ud7a3]+", content))
    return inputs



def suggest_source_candidates(root: Path, local_forms: dict[str, set[str]], excluded_inputs: set[str] | None = None) -> list[dict[str, str]]:
    """Find unused, explicitly bracketed Hangul surface examples in saved NIKL HTML."""
    source_path = root / "한국어 어문 규범.htm"
    if not source_path.exists():
        return []
    html = source_path.read_text(encoding="utf-8")
    used = set().union(*local_forms.values()) if local_forms else set()
    used.update(excluded_inputs or set())
    headings: list[tuple[int, str]] = []
    for heading in re.finditer(r"<h6[^>]*>(.*?)</h6>", html, re.DOTALL):
        heading_text = re.sub(r"<[^>]+>", "", heading.group(1))
        article = re.search(r"제[^0-9]{0,4}([0-9]{1,2})항", heading_text)
        if article:
            headings.append((heading.end(), f"§{article.group(1)}"))
    candidates: list[dict[str, str]] = []
    seen: set[str] = set()
    # Scan individual HTML text nodes, not flattened HTML: flattening can
    # accidentally pair a prose word with the next example's bracketed reading.
    pair_pattern = re.compile(r"([가-힣]{2,10})\[([가-힣ː]+)\]")
    for node in re.finditer(r">([^<>]+)<", html):
        for match in pair_pattern.finditer(node.group(1)):
            word, reading = match.group(1), match.group(2)
            if word in used or word in seen:
                continue
            prior_headings = [rule for end, rule in headings if end <= node.start()]
            if not prior_headings:
                continue
            seen.add(word)
            candidates.append({
                "input": word,
                "surfaceReading": reading,
                "sourceRule": prior_headings[-1],
                "sourceExcerpt": f"{word}[{reading}]",
            })
    return candidates

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
            row_tokens = row.get("tokens", [])
            if isinstance(row_tokens, list):
                for token in row_tokens:
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
        for filename, local_forms in local.items():
            if needle in local_forms:
                local_overlaps.append({"caseId": case["caseId"], "input": needle, "file": filename})
    benchmark_overlaps = []
    recorded_overlap_count = None
    external_check = "NOT_CHECKED"
    if benchmark_path is not None:
        tokens = benchmark_tokens(benchmark_path)
        benchmark_overlaps = [
            {"caseId": case["caseId"], "input": case["input"]}
            for case in cases if case["input"] in tokens
        ]
        recorded_overlap_count = len(benchmark_overlaps)
        external_check = "CHECKED"
    else:
        record_path = root / "research/ipa-holdout-overlap-validation-2026-10-24.json"
        if record_path.exists():
            record = json.loads(record_path.read_text(encoding="utf-8"))
            raw_manifest = manifest_path.read_bytes()
            actual_blob_sha = hashlib.sha1(
                b"blob " + str(len(raw_manifest)).encode("ascii") + b"\0" + raw_manifest
            ).hexdigest()
            if record.get("holdout", {}).get("manifestGitBlobSha") == actual_blob_sha:
                recorded = record.get("externalExactTokenOverlap", {})
                recorded_overlap_count = int(recorded.get("overlapCount", -1))
                benchmark_overlaps = recorded.get("overlappingInputs", [])
                external_check = "RECORDED_PINNED_ARTIFACT_CHECK"
            else:
                external_check = "STALE_RECORDED_CHECK"
    effective_overlap_count = recorded_overlap_count if recorded_overlap_count is not None else len(benchmark_overlaps)
    return {
        "manifest": str(manifest_path),
        "case_count": len(cases),
        "source_backed_surface_forms": sum(case["surfaceEvidenceStatus"] == "SOURCE_ATTESTED" for case in cases),
        "candidate_suggestions": suggest_source_candidates(root, local, {case["input"] for case in cases})[:80],
        "ipa_gold_count": sum(case["ipaGold"] is not None for case in cases),
        "local_runtime_or_fixture_overlap_count": len(local_overlaps),
        "local_runtime_or_fixture_overlaps": local_overlaps,
        "excluded_source_only_fixtures": ["tests/fixtures/nikl-article-review-1-30.json", "tests/fixtures/nikl-all-articles-master-passage-2026-10-22.txt"],
        "external_benchmark_overlap_check": external_check,
        "external_benchmark_path": str(benchmark_path) if benchmark_path is not None else None,
        "external_benchmark_overlap_count": effective_overlap_count,
        "external_benchmark_overlaps": benchmark_overlaps,
        "holdout_certification": (
            "BLOCKED_OVERLAP_FOUND"
            if local_overlaps or effective_overlap_count > 0 or benchmark_overlaps
            else "FROZEN_INPUTS_EXTERNAL_OVERLAP_CHECK_PENDING"
            if external_check not in {"CHECKED", "RECORDED_PINNED_ARTIFACT_CHECK"}
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
