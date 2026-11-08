import csv
import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from scripts.prepare_korean_open_benchmarks import (
    _load_kspan,
    _read_nikl_word_index,
    key_to_ipa,
    key_to_worldbet,
    prepare,
    worldbet_to_ipa,
)


class KoreanOpenBenchmarkPreparationTests(unittest.TestCase):
    def test_kspan_key_and_worldbet_mapping_examples(self):
        self.assertEqual(key_to_worldbet("rlur"), "kij^k")
        self.assertEqual(key_to_ipa("rlur"), "kijʌk")
        self.assertEqual(key_to_worldbet("rk"), "ka")
        self.assertEqual(key_to_ipa("rk"), "ka")
        self.assertEqual(worldbet_to_ipa("p*thtc}hNixwE"), "p͈tʰtɕʰŋɨwɛ")

    def test_unknown_kspan_key_is_not_silently_guessed(self):
        with self.assertRaisesRegex(ValueError, "unknown K-SPAN"):
            key_to_worldbet("rlur?")

    def _write_nikl_zip(self, path: Path):
        content = "순위 빈도 표제어 동형어 품사\n1 500 기역 - 명사\n2 400 가 - 명사\n3 300 나 - 명사\n4 200 다 - 명사\n".encode("cp949")
        with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            archive.writestr("MKUFS2/일반어휘통계.txt", content)

    def _write_kspan(self, path: Path):
        fields = [
            "WordNum", "ModernKey", "ConservativeKey", "OrthographyKey",
            "ModernPhon", "ConservativePhon", "SyllableCount",
            "OrthographyNumNeighbors", "OrthographyMeanNeighborFreq",
            "ModernNumNeighbors", "ModernMeanNeighborFreq",
            "ConservativeNumNeighbors", "ConservativeMeanNeighborFreq",
            "OrthographyNumNeighborsSyll", "OrthographyMeanNeighborFreqSyll",
            "ModernNumNeighborsSyll", "ModernMeanNeighborFreqSyll",
            "ConservativeNumNeighborsSyll", "ConservativeMeanNeighborFreqSyll",
        ]
        rows = [
            ["1", "rlur", "rlur", "rlur", "kij^k", "kij^k", "2"] + ["0"] * 12,
            ["2", "rk", "rk", "rk", "ka", "ka", "1"] + ["0"] * 12,
        ]
        with path.open("w", encoding="utf-8", newline="") as stream:
            writer = csv.writer(stream)
            writer.writerow(fields)
            writer.writerows(rows)

    def test_nikl_word_index_and_kspan_worldbet_integrity(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            nikl = root / "nikl.zip"
            kspan = root / "kspan.csv"
            self._write_nikl_zip(nikl)
            self._write_kspan(kspan)
            index = _read_nikl_word_index(nikl)
            self.assertEqual(index[1], "기역")
            self.assertEqual(index[2], "가")
            modern, conservative, metadata = _load_kspan(kspan, nikl, expected_rows=None)
            self.assertEqual([row["canonical"] for row in modern], ["기역", "가"])
            self.assertEqual([row["tokens"][0]["phoneme"] for row in modern], ["kijʌk", "ka"])
            self.assertEqual([row["tokens"][0]["phoneme"] for row in conservative], ["kijʌk", "ka"])
            self.assertEqual(metadata["key_worldbet_integrity_mismatches"], 0)

    def test_kspan_row_count_gate_detects_dataset_drift(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            nikl = root / "nikl.zip"
            kspan = root / "kspan.csv"
            self._write_nikl_zip(nikl)
            self._write_kspan(kspan)
            with self.assertRaisesRegex(ValueError, "row-count drift"):
                _load_kspan(kspan, nikl)

    def test_prepare_builds_overlap_filtered_reproducible_tracks(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            nikl = root / "nikl.zip"
            kspan = root / "kspan.csv"
            ipa_dict = root / "ko.txt"
            ugt = root / "ugt.json"
            sig = root / "sig.json"
            seoul = root / "seoul.json"
            output = root / "out"
            self._write_nikl_zip(nikl)
            self._write_kspan(kspan)
            ipa_dict.write_text("가\tka\n나\tna\n다\tta\n", encoding="utf-8")
            ugt.write_text(json.dumps([{
                "id": "u1", "lang": "ko", "split": "test", "text": "가",
                "canonical": "가", "phonemes": "ka",
                "tokens": [{"canonical": "가", "phoneme": "ka"}],
            }], ensure_ascii=False), encoding="utf-8")
            sig.write_text(json.dumps([{
                "id": "s1", "lang": "ko", "split": "test", "text": "나",
                "canonical": "나", "phonemes": "na",
                "tokens": [{"canonical": "나", "phoneme": "na"}],
            }], ensure_ascii=False), encoding="utf-8")
            seoul.write_text(json.dumps([
                {"source": "다", "gold": "ta", "weight": 2},
                {"source": "라", "gold": "ɾa", "weight": 1},
            ], ensure_ascii=False), encoding="utf-8")

            manifest = prepare(
                kspan, nikl, ipa_dict, ugt, sig, seoul, output,
                sample_size=1, seed=123, expected_kspan_rows=None,
            )
            modern = json.loads((output / "kspan-modern.json").read_text(encoding="utf-8"))
            ipa = json.loads((output / "ipa-dict-ko.json").read_text(encoding="utf-8"))
            seoul_rows = json.loads((output / "seoul-ipa.json").read_text(encoding="utf-8"))
            self.assertEqual(len(modern), 1)
            self.assertEqual(modern[0]["canonical"], "기역")
            self.assertEqual(len(ipa), 1)
            self.assertEqual(ipa[0]["canonical"], "다")
            self.assertEqual(len(seoul_rows), 1)
            self.assertEqual(seoul_rows[0]["lang"], "ko")
            self.assertEqual(manifest["kspan"]["overlap_excluded_word_types"], 1)
            self.assertEqual(manifest["ipa_dict"]["overlap_excluded_word_types"], 3)
            self.assertTrue((output / "manifest.json").exists())


if __name__ == "__main__":
    unittest.main()
