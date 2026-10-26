#!/usr/bin/env python3
"""Fail-closed evaluator for a proposed deterministic Korean phonology rule.

This tool does not generate or promote rules. It checks whether a candidate rule
has a convention-reviewed IPA gold set, source evidence, positive/negative
controls, and a separately selected development evaluation with no regressions.
Metrics are Unicode-codepoint diagnostics, not phoneme-error rates.
"""
from __future__ import annotations

import argparse
import json
import re
import unicodedata
from pathlib import Path
from typing import Any

SEALED_TOKEN = re.compile(r"(^|[-/])(test|holdout|sealed|24-form|24form)([-/]|$)", re.I)
REQUIRED_EVIDENCE = (
    "rule_id",
    "primary_source_url",
    "primary_source_clause",
    "source_evidence_summary",
    "ipa_gold_convention",
    "ipa_mapping_review_status",
    "reviewer_ids",
    "dataset_id",
    "dataset_revision",
    "dataset_license_status",
    "split",
    "rule_selected_using_split",
    "test_data_used_for_tuning",
)


def normalize(value: str) -> str:
    """Only NFC and surrounding/repeated whitespace normalization; preserve IPA features."""
    return " ".join(unicodedata.normalize("NFC", value).split())


def edit_distance(left: str, right: str) -> int:
    if len(left) < len(right):
        left, right = right, left
    previous = list(range(len(right) + 1))
    for i, a in enumerate(left, 1):
        current = [i]
        for j, b in enumerate(right, 1):
            current.append(min(current[-1] + 1, previous[j] + 1, previous[j - 1] + (a != b)))
        previous = current
    return previous[-1]


def _sealed(value: str) -> bool:
    normalized = re.sub(r"[\s_]+", "-", unicodedata.normalize("NFC", value).strip().lower())
    return bool(SEALED_TOKEN.search(normalized))


def load_manifest(path: Path) -> dict[str, Any]:
    manifest = json.loads(path.read_text(encoding="utf-8"))
    for field in REQUIRED_EVIDENCE:
        if field not in manifest or manifest[field] in (None, "", []):
            raise ValueError(f"manifest missing required field: {field}")
    if manifest["split"] != "dev":
        raise ValueError("candidate acceptance requires a separately held-out dev split")
    if manifest["rule_selected_using_split"] != "train":
        raise ValueError("rule selection must use train; dev is evaluation-only")
    if manifest["test_data_used_for_tuning"] is not False:
        raise ValueError("test/holdout data must not be used for tuning")
    if _sealed(str(manifest["dataset_id"])) or _sealed(str(manifest["dataset_revision"])):
        raise ValueError("sealed test/holdout dataset is forbidden")
    if manifest["ipa_gold_convention"] != "clippyfirst-broad-v1":
        raise ValueError("gold IPA must use the declared ClippyFirst broad-v1 convention")
    if manifest["ipa_mapping_review_status"] != "independently-reviewed":
        raise ValueError("IPA mapping/convention must be independently reviewed")
    reviewers = manifest["reviewer_ids"]
    if not isinstance(reviewers, list) or len(set(reviewers)) < 2 or any(not str(x).strip() for x in reviewers):
        raise ValueError("at least two distinct reviewer IDs are required")
    if not str(manifest["primary_source_url"]).startswith("https://"):
        raise ValueError("primary_source_url must be HTTPS")
    if not str(manifest["source_evidence_summary"]).strip():
        raise ValueError("source evidence summary must be non-empty")
    return manifest


def load_cases(path: Path) -> list[dict[str, Any]]:
    cases: list[dict[str, Any]] = []
    seen: set[str] = set()
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        row = json.loads(line)
        for field in ("case_id", "source_text", "gold_ipa", "baseline_ipa", "candidate_ipa", "role", "split"):
            if field not in row:
                raise ValueError(f"line {line_no}: missing {field}")
        case_id = str(row["case_id"])
        if not case_id or case_id in seen:
            raise ValueError(f"line {line_no}: empty or duplicate case_id")
        seen.add(case_id)
        if _sealed(case_id) or _sealed(str(row["split"])):
            raise ValueError(f"line {line_no}: sealed test/holdout row is forbidden")
        if row["split"] != "dev":
            raise ValueError(f"line {line_no}: only dev evaluation rows are accepted")
        if row["role"] not in {"positive_control", "negative_control", "evaluation"}:
            raise ValueError(f"line {line_no}: invalid role")
        for field in ("source_text", "gold_ipa", "baseline_ipa", "candidate_ipa"):
            if not isinstance(row[field], str) or not row[field].strip():
                raise ValueError(f"line {line_no}: {field} must be non-empty")
        cases.append(row)
    if not cases:
        raise ValueError("case file is empty")
    return cases


def _score(rows: list[dict[str, Any]], output_field: str) -> dict[str, Any]:
    exact = 0
    edits = 0
    reference_chars = 0
    for row in rows:
        gold = normalize(row["gold_ipa"])
        output = normalize(row[output_field])
        exact += gold == output
        edits += edit_distance(output, gold)
        reference_chars += len(gold)
    count = len(rows)
    return {
        "n": count,
        "exact": exact,
        "exact_rate": exact / count if count else None,
        "codepoint_edits": edits,
        "reference_codepoints": reference_chars,
        "codepoint_cer": edits / reference_chars if reference_chars else None,
    }


def evaluate(manifest: dict[str, Any], cases: list[dict[str, Any]]) -> dict[str, Any]:
    positives = [row for row in cases if row["role"] == "positive_control"]
    negatives = [row for row in cases if row["role"] == "negative_control"]
    evaluation = [row for row in cases if row["role"] == "evaluation"]
    if len(positives) < 1 or len(negatives) < 1 or len(evaluation) < 1:
        raise ValueError("need at least one positive control, negative control, and evaluation case")

    positive_pass = all(
        normalize(row["candidate_ipa"]) == normalize(row["gold_ipa"])
        and normalize(row["baseline_ipa"]) != normalize(row["gold_ipa"])
        for row in positives
    )
    negative_pass = all(
        normalize(row["candidate_ipa"]) == normalize(row["baseline_ipa"])
        for row in negatives
    )
    baseline = _score(evaluation, "baseline_ipa")
    candidate = _score(evaluation, "candidate_ipa")
    improves = (
        candidate["exact_rate"] > baseline["exact_rate"]
        or (
            candidate["exact_rate"] == baseline["exact_rate"]
            and candidate["codepoint_cer"] < baseline["codepoint_cer"]
        )
    )
    passed = positive_pass and negative_pass and improves
    return {
        "schema_version": "1.0",
        "rule_id": manifest["rule_id"],
        "status": "PASS_CANDIDATE_FOR_HUMAN_REVIEW" if passed else "REJECT_OR_MORE_EVIDENCE_REQUIRED",
        "production_promotion": False,
        "interpretation": (
            "Codepoint CER is a diagnostic string metric, not phoneme error rate. "
            "Passing this gate permits review only; it does not authorize production changes."
        ),
        "checks": {
            "primary_source_and_two_reviewers_declared": True,
            "ipa_convention_reviewed": True,
            "positive_controls_corrected": positive_pass,
            "negative_controls_unchanged": negative_pass,
            "held_out_dev_improves": improves,
        },
        "evaluation": {
            "baseline": baseline,
            "candidate": candidate,
            "exact_rate_delta": candidate["exact_rate"] - baseline["exact_rate"],
            "codepoint_cer_delta": candidate["codepoint_cer"] - baseline["codepoint_cer"],
        },
        "controls": {
            "positive_count": len(positives),
            "negative_count": len(negatives),
        },
        "provenance": manifest,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--cases", type=Path, required=True, help="JSONL with gold, baseline, candidate and control role")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        manifest = load_manifest(args.manifest)
        cases = load_cases(args.cases)
        report = evaluate(manifest, cases)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": report["status"], "output": str(args.output)}, ensure_ascii=False))
    return 0 if report["status"] == "PASS_CANDIDATE_FOR_HUMAN_REVIEW" else 2


if __name__ == "__main__":
    raise SystemExit(main())
