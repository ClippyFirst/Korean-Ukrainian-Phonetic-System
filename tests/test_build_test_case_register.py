import csv
import tempfile
import unittest
from pathlib import Path

from scripts.build_test_case_register import build


class TestBuildTestCaseRegister(unittest.TestCase):
    def test_exports_exact_lexical_cases_and_preserves_test_line_provenance(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "data/korean").mkdir(parents=True)
            (root / "tests/fixtures").mkdir(parents=True)
            with (root / "data/korean/lexical_pronunciations.csv").open("w", encoding="utf-8", newline="") as stream:
                writer = csv.DictWriter(stream, fieldnames=[
                    "input", "surface_hangul", "target_syllables", "ipa_syllables",
                    "source_url", "rule_notes", "confidence", "target_status",
                    "alternate_surface_hangul", "alternate_target_syllables",
                    "alternate_ipa_syllables", "variant_note", "input_kind",
                ])
                writer.writeheader()
                writer.writerow({
                    "input": "안지", "surface_hangul": "안찌",
                    "target_syllables": "ан|чі", "ipa_syllables": "an|tɕ͈i",
                    "source_url": "https://example.invalid/source", "rule_notes": "fixture",
                    "confidence": "high", "target_status": "provisional", "input_kind": "Hangul",
                })
                writer.writerow({
                    "input": "안", "surface_hangul": "안",
                    "target_syllables": "ан", "ipa_syllables": "an",
                    "source_url": "", "rule_notes": "", "confidence": "",
                    "target_status": "unresolved", "input_kind": "Hangul",
                })
            (root / "tests/example.test.mjs").write_text(
                "const a = '안지'; // expected surface 안찌 and IPA an.tɕ͈i\n"
                "const b = '안다'; // must not count as exact input 안\n",
                encoding="utf-8",
            )
            (root / "tests/fixtures/passage.txt").write_text("안지와 안다\n", encoding="utf-8")
            output = root / "research"
            stats = build(root, output)

            self.assertEqual(stats["lexical_records"], 2)
            self.assertEqual(stats["test_files_scanned"], 2)
            with (output / "TEST-CASE-REGISTER-LEXICAL-BASE-2026-10-26.csv").open(encoding="utf-8", newline="") as stream:
                lexical = list(csv.DictReader(stream))
            self.assertEqual([row["case_id"] for row in lexical], ["LEX-00001", "LEX-00002"])
            self.assertEqual(lexical[0]["test_provenance_status"], "TEXT_OCCURRENCE_FOUND_REQUIRES_ASSERTION_CLASSIFICATION")
            self.assertEqual(lexical[1]["test_provenance_status"], "NO_EXACT_TEST_TEXT_MATCH_FOUND")
            with (output / "TEST-CASE-REGISTER-LEXICAL-TEST-LINKS-2026-10-26.csv").open(encoding="utf-8", newline="") as stream:
                links = list(csv.DictReader(stream))
            self.assertTrue(any(row["input"] == "안지" and row["test_path"] == "tests/example.test.mjs" for row in links))
            self.assertFalse(any(row["input"] == "안" and row["test_path"] == "tests/example.test.mjs" for row in links))
            with (output / "TEST-CASE-REGISTER-HANGUL-LITERAL-CANDIDATES-2026-10-26.csv").open(encoding="utf-8", newline="") as stream:
                candidates = list(csv.DictReader(stream))
            self.assertTrue(any(row["hangul_span"] == "안찌" for row in candidates))
            self.assertTrue(any(row["source_path"] == "tests/fixtures/passage.txt" for row in candidates))
            with (output / "TEST-CASE-REGISTER-SOURCE-LINES-2026-10-26.csv").open(encoding="utf-8", newline="") as stream:
                source_lines = list(csv.DictReader(stream))
            self.assertEqual(stats["source_lines_preserved"], 3)
            self.assertTrue(any(row["raw_line"] == "const a = '안지'; // expected surface 안찌 and IPA an.tɕ͈i" for row in source_lines))
            self.assertTrue(any(row["source_category"] == "fixture" and row["raw_line"] == "안지와 안다" for row in source_lines))


if __name__ == "__main__":
    unittest.main()
