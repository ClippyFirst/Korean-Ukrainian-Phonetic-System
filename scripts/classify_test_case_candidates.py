#!/usr/bin/env python3
"""Create a conservative triage queue from assertion-candidate inventory rows.

The labels are lexical hints only. This tool deliberately does not parse expected
values, infer test outcomes, decide phonological correctness, or mark cases verified.
Every row remains subject to case-level review and exact-head run reconciliation.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import re
from pathlib import Path

REQUIRED_COLUMNS = {
    "assertion_candidate_id", "source_path", "source_category", "line_number",
    "assertion_kind", "raw_line", "classification_status", "observed_run_status",
}
OUTPUT_NAME = "TEST-CASE-REGISTER-ASSERTION-CLASSIFICATION-QUEUE-2026-10-27.csv"
OUTPUT_COLUMNS = [
    "queue_id", "assertion_candidate_id", "source_path", "source_category",
    "line_number", "assertion_kind", "candidate_role", "dimension_hints",
    "polarity_hint", "raw_line", "classification_method", "review_status",
    "expected_value_status", "observed_run_status",
]

DIMENSION_RULES = (
    ("IPA", re.compile(r"\bipa\b|renderExpectedIpa|broad IPA|narrow IPA", re.I)),
    ("UKRAINIAN_TARGET", re.compile(r"ukrainian|candidate_ukrainian|target_syllables|target_status", re.I)),
    ("KOREAN_SURFACE", re.compile(r"surfaceHangul|surface_hangul|surface pronunciation|surface drift", re.I)),
    ("RULE_TRACE", re.compile(r"trace|rules?\\.includes|traceRules|rule order|forbidden rule", re.I)),
    ("STATUS_ABSTENTION", re.compile(r"issues?|unresolved|placeholder|abstain|fail.closed|⟦|⟧|status", re.I)),
    ("VARIANT", re.compile(r"variant|alternate|alternant|permitted reading", re.I)),
    ("SOURCE_PROVENANCE", re.compile(r"source_url|NIKL|license|provenance|source-backed", re.I)),
    ("BOUNDARY_SERIALIZATION", re.compile(r"punctuation|context|boundary|separator|whitespace|syllable|eojeol|deterministic|repeat", re.I)),
)
NEGATIVE_HINT = re.compile(
    r"\b(?:not|never|without|forbid(?:den)?|unresolved|abstain|reject|"
    r"doesNot|assertFalse|False|notDeepEqual|fail.closed)\b|⟦|⟧",
    re.I,
)


def _queue_id(source_path: str, line_number: str, raw_line: str) -> str:
    identity = "\0".join((source_path, line_number, raw_line)).encode("utf-8")
    return "QUEUE-" + hashlib.sha256(identity).hexdigest()[:16]


def _candidate_role(assertion_kind: str) -> str:
    kind = assertion_kind.strip()
    if re.match(r"^(?:async\s+)?(?:test|it|describe)\s*\(", kind) or re.match(r"^def\s+test_", kind):
        return "TEST_DECLARATION"
    if kind and (kind.startswith("assert") or kind.startswith("expect") or kind.startswith("self.assert") or kind.startswith("strictEqual") or kind.startswith("deepEqual") or kind.startswith("pytest.raises")):
        return "ASSERTION"
    return "CANDIDATE_REQUIRES_REVIEW"


def _dimension_hints(assertion_kind: str, raw_line: str) -> str:
    text = assertion_kind + " " + raw_line
    found = [label for label, pattern in DIMENSION_RULES if pattern.search(text)]
    if not found and _candidate_role(assertion_kind) == "ASSERTION":
        found.append("GENERAL_ASSERTION")
    if not found and _candidate_role(assertion_kind) != "ASSERTION":
        found.append("UNCLASSIFIED")
    return ";".join(found)


def classify_rows(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    """Return deterministic, explicitly unverified triage rows."""
    output: list[dict[str, str]] = []
    seen: set[str] = set()
    for row in rows:
        missing = REQUIRED_COLUMNS.difference(row)
        if missing:
            raise ValueError("Input inventory is missing required columns: " + ", ".join(sorted(missing)))
        source_path = row["source_path"]
        line_number = row["line_number"]
        raw_line = row["raw_line"]
        if not source_path or not line_number:
            raise ValueError("Each candidate must retain a non-empty source_path and line_number")
        queue_id = _queue_id(source_path, line_number, raw_line)
        if queue_id in seen:
            raise ValueError(f"Duplicate source identity in assertion inventory: {source_path}:{line_number}")
        seen.add(queue_id)
        kind = row["assertion_kind"]
        output.append({
            "queue_id": queue_id,
            "assertion_candidate_id": row["assertion_candidate_id"],
            "source_path": source_path,
            "source_category": row["source_category"],
            "line_number": line_number,
            "assertion_kind": kind,
            "candidate_role": _candidate_role(kind),
            "dimension_hints": _dimension_hints(kind, raw_line),
            "polarity_hint": "HEURISTIC_NEGATIVE" if NEGATIVE_HINT.search(raw_line) else "NOT_IDENTIFIED_AS_NEGATIVE",
            "raw_line": raw_line,
            "classification_method": "REGEX_HINTS_V1_NOT_SEMANTIC",
            "review_status": "UNCLASSIFIED_REQUIRES_CASE_LEVEL_REVIEW",
            "expected_value_status": "NOT_PARSED_FROM_SOURCE_LINE",
            "observed_run_status": "NOT_TIED_TO_EXACT_HEAD_RUN",
        })
    return output


def read_candidates(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        if reader.fieldnames is None:
            raise ValueError("Input assertion inventory has no CSV header")
        missing = REQUIRED_COLUMNS.difference(reader.fieldnames)
        if missing:
            raise ValueError("Input inventory is missing required columns: " + ", ".join(sorted(missing)))
        return list(reader)


def write_queue(path: Path, rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=OUTPUT_COLUMNS, lineterminator="\n", extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--input",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "research" / "TEST-CASE-REGISTER-ASSERTION-CANDIDATES-2026-10-26.csv",
        help="existing assertion-candidate inventory CSV",
    )
    parser.add_argument("--output", type=Path, default=None, help="output CSV path (defaults beside input)")
    args = parser.parse_args()
    rows = classify_rows(read_candidates(args.input))
    output = args.output or args.input.with_name(OUTPUT_NAME)
    write_queue(output, rows)
    print(f"input_candidates={len(rows)}")
    print(f"queue_rows={len(rows)}")
    print(f"unclassified_for_review={sum(row['review_status'] == 'UNCLASSIFIED_REQUIRES_CASE_LEVEL_REVIEW' for row in rows)}")
    print(f"output={output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
