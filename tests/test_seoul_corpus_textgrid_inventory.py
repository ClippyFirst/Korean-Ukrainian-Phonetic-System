from __future__ import annotations
import tempfile
import unittest
from pathlib import Path
from scripts.inspect_seoul_corpus_textgrids import build_inventory, inspect_textgrid

LONG_TEXTGRID = '''File type = "ooTextFile"
Object class = "TextGrid"
xmin = 0
xmax = 1
tiers? <exists>
size = 2
item [1]:
    class = "IntervalTier"
    name = "word"
    xmin = 0
    xmax = 1
    intervals: size = 2
    intervals [1]:
        xmin = 0
        xmax = 0.5
        text = "REDACTED-TEST-WORD"
    intervals [2]:
        xmin = 0.5
        xmax = 1
        text = "REDACTED-TEST-WORD-2"
item [2]:
    class = "IntervalTier"
    name = "phone"
    xmin = 0
    xmax = 1
    intervals: size = 3
    intervals [1]:
        xmin = 0
        xmax = 0.25
        text = "p"
    intervals [2]:
        xmin = 0.25
        xmax = 0.5
        text = "h"
    intervals [3]:
        xmin = 0.5
        xmax = 1
        text = "o"
'''

PAIR_TEXTGRID = '''File type = "ooTextFile"
Object class = "TextGrid"
xmin = 0
xmax = 1
tiers? <exists>
size = 2
item [1]:
    class = "IntervalTier"
    name = "pWord.ortho."
    xmin = 0
    xmax = 1
    intervals: size = 1
    intervals [1]:
        xmin = 0
        xmax = 1
        text = "학교"
item [2]:
    class = "IntervalTier"
    name = "pWord.prono."
    xmin = 0
    xmax = 1
    intervals: size = 1
    intervals [1]:
        xmin = 0
        xmax = 1
        text = "학꾜"
'''

class SeoulTextGridInventoryTests(unittest.TestCase):
    def test_reads_tier_names_and_counts(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "sample.TextGrid"
            path.write_text(LONG_TEXTGRID, encoding="utf-8")
            result = inspect_textgrid(path)
            self.assertEqual([tier["name"] for tier in result["tiers"]], ["word", "phone"])
            self.assertEqual([tier["interval_count"] for tier in result["tiers"]], [2, 3])
            self.assertEqual(result["tiers"][0]["intervals"][0]["label"], "REDACTED-TEST-WORD")

    def test_reads_utf16_textgrid(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "utf16.TextGrid"
            path.write_text(LONG_TEXTGRID, encoding="utf-16")
            result = inspect_textgrid(path)
            self.assertEqual(result["tiers"][0]["name"], "word")

    def test_inventory_counts_unparsed_files_and_ignores_appledouble(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "good.TextGrid").write_text(LONG_TEXTGRID, encoding="utf-8")
            (root / "bad.TextGrid").write_text("not a TextGrid", encoding="utf-8")
            (root / "._good.TextGrid").write_bytes(b"AppleDouble metadata")
            result = build_inventory(root)
            self.assertEqual(result["files_found"], 2)
            self.assertEqual(result["files_parsed"], 1)
            self.assertEqual(result["files_failed"], 1)
            self.assertEqual(result["interval_annotations_total"], 5)
            self.assertEqual(result["tier_name_counts"]["IntervalTier:word"], 1)

    def test_reports_aligned_word_pronunciation_tiers_without_exporting_text(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "paired.TextGrid").write_text(PAIR_TEXTGRID, encoding="utf-8")
            result = build_inventory(root)
            alignment = result["word_tier_alignment"]
            self.assertEqual(alignment["paired_tier_pairs"], 1)
            self.assertEqual(alignment["paired_interval_slots"], 1)
            self.assertEqual(alignment["same_time_boundaries"], 1)
            self.assertEqual(alignment["both_hangul_word_pairs"], 1)
            self.assertNotIn("학교", str(result))
            self.assertNotIn("학꾜", str(result))
            pairs_path = root / "ephemeral-pairs.json"
            build_inventory(root, pairs_path)
            pairs = pairs_path.read_text(encoding="utf-8")
            self.assertIn('"source":"학교"', pairs)
            self.assertIn('"gold":"학꾜"', pairs)

if __name__ == "__main__":
    unittest.main()
