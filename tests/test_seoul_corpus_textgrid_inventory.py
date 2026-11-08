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
'''

class SeoulTextGridInventoryTests(unittest.TestCase):
    def test_reads_tier_names_and_counts_without_exporting_labels(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "sample.TextGrid"
            path.write_text(LONG_TEXTGRID, encoding="utf-8")
            result = inspect_textgrid(path)
            self.assertEqual(result["tiers"], [
                {"class": "IntervalTier", "name": "word", "interval_count": 2, "point_count": 0},
                {"class": "IntervalTier", "name": "phone", "interval_count": 3, "point_count": 0},
            ])
            self.assertNotIn("REDACTED-TEST-WORD", str(result))

    def test_reads_utf16_textgrid(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "utf16.TextGrid"
            path.write_text(LONG_TEXTGRID, encoding="utf-16")
            result = inspect_textgrid(path)
            self.assertEqual(result["tiers"][0]["name"], "word")

    def test_inventory_counts_unparsed_files(self):
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

if __name__ == "__main__":
    unittest.main()
