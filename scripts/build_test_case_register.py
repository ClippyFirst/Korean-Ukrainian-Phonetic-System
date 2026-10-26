#!/usr/bin/env python3
"""Build loss-preserving candidate inventories for the Korean test-case register.

This tool does not decide which Korean strings are inputs vs expected outputs and
does not infer test pass/fail. It exports lexical dictionary records with exact
test-file/line references plus every Hangul-containing test/fixture line for
manual classification. Standard-library only; deterministic output.
"""
from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path

HANGUL = re.compile(r"[가-힣]+")
ASSERTION_LINE = re.compile(
    r"^\s*(?P<kind>(?:async\s+)?(?:test|it|describe)\s*\(|"
    r"def\s+test_[A-Za-z0-9_]+\s*\(|assert(?:\.[A-Za-z_][A-Za-z0-9_]*)?\b|"
    r"expect\s*\(|\.\s*to(?:Be|Equal|Contain|Throw|Match|HaveLength)\s*\(|"
    r"strictEqual\s*\(|deepEqual\s*\(|pytest\.raises|self\.assert[A-Za-z0-9_]*\b)"
)
LEXICAL_COLUMNS = [
    "case_id", "source_record", "input", "expected_surface_hangul",
    "expected_ukrainian_syllables", "expected_ipa_syllables", "source_url",
    "rule_notes", "confidence", "target_status", "alternate_surface_hangul",
    "alternate_ukrainian_syllables", "alternate_ipa_syllables", "variant_note",
    "input_kind", "test_provenance_status", "observed_run_status",
]
LINK_COLUMNS = [
    "link_id", "case_id", "input", "test_path", "line_number", "raw_test_line",
    "expected_surface_hangul", "expected_ukrainian_syllables",
    "expected_ipa_syllables", "source_url", "rule_notes", "target_status",
    "provenance_kind", "observed_run_status",
]
CANDIDATE_COLUMNS = [
    "candidate_id", "source_path", "source_category", "line_number",
    "hangul_span", "raw_line", "classification_status", "observed_run_status",
]
SOURCE_LINE_COLUMNS = [
    "line_id", "source_path", "source_category", "line_number",
    "raw_line", "line_sha256", "classification_status",
    "observed_run_status",
]
ASSERTION_COLUMNS = [
    "assertion_candidate_id", "source_path", "source_category",
    "line_number", "assertion_kind", "raw_line",
    "classification_status", "observed_run_status",
]
TEXT_SUFFIXES = {".mjs", ".js", ".cjs", ".py", ".json", ".jsonl", ".csv", ".tsv", ".txt", ".md", ".yaml", ".yml"}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))


def write_csv(path: Path, columns: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=columns, extrasaction="ignore", lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def exact_occurrences(line: str, value: str) -> list[re.Match[str]]:
    # Avoid treating a short form as a match inside a longer Hangul token.
    pattern = re.compile(r"(?<![가-힣])" + re.escape(value) + r"(?![가-힣])")
    return list(pattern.finditer(line))


def build(repo_root: Path, output_dir: Path) -> dict[str, int]:
    lexical_path = repo_root / "data/korean/lexical_pronunciations.csv"
    lexical_rows = read_csv(lexical_path)
    lexical_records: list[dict[str, str]] = []
    for index, source in enumerate(lexical_rows, start=1):
        lexical_records.append({
            "case_id": f"LEX-{index:05d}",
            "source_record": "data/korean/lexical_pronunciations.csv",
            "input": source.get("input", ""),
            "expected_surface_hangul": source.get("surface_hangul", ""),
            "expected_ukrainian_syllables": source.get("target_syllables", ""),
            "expected_ipa_syllables": source.get("ipa_syllables", ""),
            "source_url": source.get("source_url", ""),
            "rule_notes": source.get("rule_notes", ""),
            "confidence": source.get("confidence", ""),
            "target_status": source.get("target_status", ""),
            "alternate_surface_hangul": source.get("alternate_surface_hangul", ""),
            "alternate_ukrainian_syllables": source.get("alternate_target_syllables", ""),
            "alternate_ipa_syllables": source.get("alternate_ipa_syllables", ""),
            "variant_note": source.get("variant_note", ""),
            "input_kind": source.get("input_kind", ""),
            "test_provenance_status": "NOT_CROSS_REFERENCED_TO_TESTS",
            "observed_run_status": "NOT_TIED_TO_EXACT_HEAD_RUN",
        })

    # Include executable tests plus checked-in Korean data/examples that tests
    # consume. Do not scan research/ because this generator writes its own CSVs
    # there and would recursively ingest generated output on subsequent runs.
    roots = [repo_root / "tests", repo_root / "data/korean", repo_root / "examples"]
    files = sorted(
        p for root in roots if root.exists() for p in root.rglob("*")
        if p.is_file() and p.suffix.lower() in TEXT_SUFFIXES
    )
    file_lines: dict[Path, list[str]] = {}
    for path in files:
        try:
            file_lines[path] = path.read_text(encoding="utf-8-sig").splitlines()
        except (UnicodeDecodeError, OSError):
            continue

    links: list[dict[str, str]] = []
    candidates: list[dict[str, str]] = []
    source_lines: list[dict[str, str]] = []
    assertion_candidates: list[dict[str, str]] = []
    candidate_index = 0
    line_index = 0
    assertion_index = 0
    link_index = 0
    for path, lines in file_lines.items():
        rel = path.relative_to(repo_root).as_posix()
        if rel.startswith("tests/") and "/fixtures/" in rel:
            category = "fixture"
        elif rel.startswith("tests/") and "/corpora/" in rel:
            category = "test_corpus"
        elif rel.startswith("tests/"):
            category = "test_source"
        elif rel.startswith("data/korean/benchmarks/"):
            category = "benchmark_corpus"
        elif rel.startswith("data/korean/"):
            category = "source_data"
        else:
            category = "example_source"
        for line_number, line in enumerate(lines, start=1):
            line_index += 1
            source_lines.append({
                "line_id": f"LINE-{line_index:08d}",
                "source_path": rel,
                "source_category": category,
                "line_number": str(line_number),
                "raw_line": line,
                "line_sha256": __import__("hashlib").sha256(line.encode("utf-8")).hexdigest(),
                "classification_status": "UNCLASSIFIED_SOURCE_LINE",
                "observed_run_status": "NOT_TIED_TO_EXACT_HEAD_RUN",
            })
            assertion_match = ASSERTION_LINE.search(line)
            if assertion_match:
                assertion_index += 1
                assertion_candidates.append({
                    "assertion_candidate_id": f"ASSERT-{assertion_index:07d}",
                    "source_path": rel,
                    "source_category": category,
                    "line_number": str(line_number),
                    "assertion_kind": assertion_match.group("kind").strip(),
                    "raw_line": line,
                    "classification_status": "UNCLASSIFIED_ASSERTION_OR_TEST_DECLARATION",
                    "observed_run_status": "NOT_TIED_TO_EXACT_HEAD_RUN",
                })
            for match in HANGUL.finditer(line):
                candidate_index += 1
                candidates.append({
                    "candidate_id": f"LIT-{candidate_index:07d}",
                    "source_path": rel,
                    "source_category": category,
                    "line_number": str(line_number),
                    "hangul_span": match.group(0),
                    "raw_line": line,
                    "classification_status": "UNCLASSIFIED_HANGUL_LITERAL",
                    "observed_run_status": "NOT_TIED_TO_EXACT_HEAD_RUN",
                })

    test_file_lines = {
        path: lines for path, lines in file_lines.items()
        if path.relative_to(repo_root).as_posix().startswith("tests/")
    }
    for record in lexical_records:
        value = record["input"]
        found = 0
        if not value:
            continue
        for path, lines in test_file_lines.items():
            rel = path.relative_to(repo_root).as_posix()
            for line_number, line in enumerate(lines, start=1):
                if exact_occurrences(line, value):
                    found += 1
                    link_index += 1
                    links.append({
                        "link_id": f"LINK-{link_index:08d}",
                        "case_id": record["case_id"],
                        "input": value,
                        "test_path": rel,
                        "line_number": str(line_number),
                        "raw_test_line": line,
                        "expected_surface_hangul": record["expected_surface_hangul"],
                        "expected_ukrainian_syllables": record["expected_ukrainian_syllables"],
                        "expected_ipa_syllables": record["expected_ipa_syllables"],
                        "source_url": record["source_url"],
                        "rule_notes": record["rule_notes"],
                        "target_status": record["target_status"],
                        "provenance_kind": "TEXT_OCCURRENCE_REQUIRES_ASSERTION_CLASSIFICATION",
                        "observed_run_status": "NOT_TIED_TO_EXACT_HEAD_RUN",
                    })
        if found:
            record["test_provenance_status"] = "TEXT_OCCURRENCE_FOUND_REQUIRES_ASSERTION_CLASSIFICATION"
        else:
            record["test_provenance_status"] = "NO_EXACT_TEST_TEXT_MATCH_FOUND"

    write_csv(output_dir / "TEST-CASE-REGISTER-LEXICAL-BASE-2026-10-26.csv", LEXICAL_COLUMNS, lexical_records)
    write_csv(output_dir / "TEST-CASE-REGISTER-LEXICAL-TEST-LINKS-2026-10-26.csv", LINK_COLUMNS, links)
    write_csv(output_dir / "TEST-CASE-REGISTER-HANGUL-LITERAL-CANDIDATES-2026-10-26.csv", CANDIDATE_COLUMNS, candidates)
    write_csv(output_dir / "TEST-CASE-REGISTER-SOURCE-LINES-2026-10-26.csv", SOURCE_LINE_COLUMNS, source_lines)
    write_csv(output_dir / "TEST-CASE-REGISTER-ASSERTION-CANDIDATES-2026-10-26.csv", ASSERTION_COLUMNS, assertion_candidates)
    return {
        "lexical_records": len(lexical_records),
        "test_files_scanned": len(test_file_lines),
        "source_files_scanned": len(file_lines),
        "lexical_test_links": len(links),
        "hangul_literal_candidates": len(candidates),
        "source_lines_preserved": len(source_lines),
        "assertion_candidates": len(assertion_candidates),
        "lexical_inputs_with_text_matches": sum(
            row["test_provenance_status"] == "TEXT_OCCURRENCE_FOUND_REQUIRES_ASSERTION_CLASSIFICATION"
            for row in lexical_records
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--output-dir", type=Path, default=None)
    args = parser.parse_args()
    output_dir = args.output_dir or args.repo_root / "research"
    result = build(args.repo_root.resolve(), output_dir.resolve())
    for key, value in result.items():
        print(f"{key}={value}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
