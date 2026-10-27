import csv
import tempfile
import unittest
from pathlib import Path

from scripts.classify_test_case_candidates import (
    OUTPUT_COLUMNS,
    classify_rows,
    read_candidates,
    write_queue,
)


def row(candidate_id, path, line, kind, raw):
    return {
        "assertion_candidate_id": candidate_id,
        "source_path": path,
        "source_category": "test_source",
        "line_number": str(line),
        "assertion_kind": kind,
        "raw_line": raw,
        "classification_status": "UNCLASSIFIED_ASSERTION_OR_TEST_DECLARATION",
        "observed_run_status": "NOT_TIED_TO_EXACT_HEAD_RUN",
    }


class TestClassifyTestCaseCandidates(unittest.TestCase):
    def test_classifies_only_triage_hints_and_never_claims_gold_or_observed_results(self):
        rows = [
            row("ASSERT-1", "tests/example.test.mjs", 3, "assert.equal", "assert.equal(result.ipa, 'an.tɕ͈i');"),
            row("ASSERT-2", "tests/example.test.mjs", 4, "assert.ok", "assert.ok(!result.ukrainian.includes('⟦'));"),
            row("ASSERT-3", "tests/example.test.mjs", 1, "test(", "test('example case', () => {"),
            row("ASSERT-4", "tests/example.test.mjs", 5, "assert.ok", "assert.ok(result.trace.some((item) => item.rules.includes('nasal-assimilation')));"),
        ]
        classified = classify_rows(rows)
        self.assertEqual(len(classified), 4)
        self.assertEqual(classified[0]["candidate_role"], "ASSERTION")
        self.assertIn("IPA", classified[0]["dimension_hints"])
        self.assertIn("UKRAINIAN_TARGET", classified[1]["dimension_hints"])
        self.assertIn("STATUS_ABSTENTION", classified[1]["dimension_hints"])
        self.assertEqual(classified[1]["polarity_hint"], "HEURISTIC_NEGATIVE")
        self.assertEqual(classified[2]["candidate_role"], "TEST_DECLARATION")
        self.assertIn("RULE_TRACE", classified[3]["dimension_hints"])
        for item in classified:
            self.assertEqual(item["review_status"], "UNCLASSIFIED_REQUIRES_CASE_LEVEL_REVIEW")
            self.assertEqual(item["expected_value_status"], "NOT_PARSED_FROM_SOURCE_LINE")
            self.assertEqual(item["observed_run_status"], "NOT_TIED_TO_EXACT_HEAD_RUN")
            self.assertEqual(item["classification_method"], "REGEX_HINTS_V1_NOT_SEMANTIC")
        self.assertEqual(list(classified[0]), OUTPUT_COLUMNS)

    def test_queue_ids_are_stable_and_source_identity_duplicates_fail_closed(self):
        source = row("ASSERT-1", "tests/example.test.mjs", 3, "assert.equal", "assert.equal(result.ipa, 'an');")
        first = classify_rows([source])[0]["queue_id"]
        reordered = classify_rows([
            row("ASSERT-2", "tests/other.test.mjs", 1, "test(", "test('other', () => {"),
            source,
        ])[1]["queue_id"]
        self.assertEqual(first, reordered)
        with self.assertRaisesRegex(ValueError, "Duplicate source identity"):
            classify_rows([source, dict(source, assertion_candidate_id="ASSERT-OTHER")])

    def test_indexes_nearest_test_and_suite_without_promoting_the_assertion(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            test_path = root / "tests/example.test.mjs"
            test_path.parent.mkdir(parents=True)
            test_path.write_text(
                "describe('NIKL phonology', () => {\n"
                "  test('keeps IPA boundaries', () => {\n"
                "    assert.equal(result.ipa, 'an.tɕ͈i');\n"
                "  });\n"
                "});\n",
                encoding="utf-8",
            )
            candidate = row(
                "ASSERT-1", "tests/example.test.mjs", 3, "assert.equal",
                "    assert.equal(result.ipa, 'an.tɕ͈i');",
            )
            classified = classify_rows([candidate], repo_root=root)
            self.assertEqual(classified[0]["nearest_suite_title"], "NIKL phonology")
            self.assertEqual(classified[0]["nearest_suite_line"], "1")
            self.assertEqual(classified[0]["nearest_test_title"], "keeps IPA boundaries")
            self.assertEqual(classified[0]["nearest_test_line"], "2")
            self.assertEqual(classified[0]["context_resolution_status"], "NEAREST_TEST_DECLARATION_FOUND")
            self.assertEqual(classified[0]["review_status"], "UNCLASSIFIED_REQUIRES_CASE_LEVEL_REVIEW")
            self.assertEqual(classified[0]["expected_value_status"], "NOT_PARSED_FROM_SOURCE_LINE")
            self.assertEqual(classified[0]["observed_run_status"], "NOT_TIED_TO_EXACT_HEAD_RUN")

    def test_reads_inventory_and_writes_reproducible_csv(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "assertions.csv"
            output = root / "queue.csv"
            fields = list(row("ASSERT-1", "tests/example.test.mjs", 3, "assert.equal", "assert.equal(result.ipa, 'an');"))
            with source.open("w", encoding="utf-8", newline="") as stream:
                writer = csv.DictWriter(stream, fieldnames=fields, lineterminator="\n")
                writer.writeheader()
                writer.writerow(row("ASSERT-1", "tests/example.test.mjs", 3, "assert.equal", "assert.equal(result.ipa, 'an');"))
            rows = classify_rows(read_candidates(source))
            write_queue(output, rows)
            with output.open(encoding="utf-8", newline="") as stream:
                written = list(csv.DictReader(stream))
            self.assertEqual(written, rows)
            self.assertEqual(len(written), 1)

    def test_rejects_incomplete_schema(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "bad.csv"
            source.write_text("source_path,line_number,raw_line\ntests/x.mjs,1,assert.ok(true)\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "missing required columns"):
                read_candidates(source)


if __name__ == "__main__":
    unittest.main()
