import csv
import hashlib
import json
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

from scripts.run_open_korean_benchmark_ci import (
    KSPAN_EXPECTED_MD5,
    KSPAN_FILE_URLS,
    _download_kspan_sources,
    _extract_kspan_dataset_bundle,
)
from scripts.prepare_korean_open_benchmarks import (
    _load_kspan,
    _read_nikl_word_index,
    key_to_ipa,
    key_to_worldbet,
    prepare,
    worldbet_to_ipa,
)


class KoreanOpenBenchmarkPreparationTests(unittest.TestCase):
    def test_kspan_v2_1_md5_pins_match_published_dataverse_metadata(self):
        self.assertEqual(
            KSPAN_EXPECTED_MD5,
            {
                "kspan_base.csv": "a0753c4f2421eb071d76b730eb87cbeb",
                "kspan_doc.pdf": "2bf63cc0704a2fe3b4c40445192af77f",
            },
        )

    def test_versioned_kspan_bundle_extracts_exact_named_sources(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            bundle = root / "kspan-v2.1.zip"
            output = root / "sources"
            with zipfile.ZipFile(bundle, "w", compression=zipfile.ZIP_DEFLATED) as archive:
                archive.writestr("K-SPAN/kspan_base.csv", b"WordNum,ModernKey\\n1,rlur\\n")
                archive.writestr("K-SPAN/kspan_doc.pdf", b"%PDF-1.4\nfixture")
                archive.writestr("MANIFEST.TXT", "K-SPAN v2.1")
            csv_path, pdf_path = _extract_kspan_dataset_bundle(bundle, output)
            self.assertEqual(csv_path.read_bytes(), b"WordNum,ModernKey\\n1,rlur\\n")
            self.assertEqual(pdf_path.read_bytes(), b"%PDF-1.4\nfixture")

    def test_kspan_individual_file_fallback_is_used_after_bundle_403_and_hash_pinned(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            csv_bytes = b"WordNum\tModernKey\n1\trk\n"
            pdf_bytes = b"%PDF-1.4\nK-SPAN v2.1 fixture"
            expected = {
                "kspan_base.csv": hashlib.md5(csv_bytes).hexdigest(),
                "kspan_doc.pdf": hashlib.md5(pdf_bytes).hexdigest(),
            }

            def fake_download(url, destination):
                if url.endswith("versions/2.1?persistentId=doi:10.18710/TWM79F&format=original"):
                    raise RuntimeError("HTTP Error 403: Forbidden")
                filename = Path(destination).name
                if filename == "kspan_base.csv":
                    self.assertEqual(url, KSPAN_FILE_URLS[filename])
                    Path(destination).write_bytes(csv_bytes)
                elif filename == "kspan_doc.pdf":
                    self.assertEqual(url, KSPAN_FILE_URLS[filename])
                    Path(destination).write_bytes(pdf_bytes)
                else:
                    raise AssertionError(f"unexpected K-SPAN destination: {destination}")

            with patch("scripts.run_open_korean_benchmark_ci._download", side_effect=fake_download):
                with patch.dict(KSPAN_EXPECTED_MD5, expected, clear=True):
                    csv_path, pdf_path = _download_kspan_sources(root)

            self.assertEqual(csv_path.read_bytes(), csv_bytes)
            self.assertEqual(pdf_path.read_bytes(), pdf_bytes)

    def test_versioned_kspan_bundle_rejects_ambiguous_source_names(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            bundle = root / "kspan-v2.1.zip"
            with zipfile.ZipFile(bundle, "w") as archive:
                archive.writestr("a/kspan_base.csv", b"one")
                archive.writestr("b/kspan_base.csv", b"two")
                archive.writestr("kspan_doc.pdf", b"%PDF")
            with self.assertRaisesRegex(ValueError, "exactly one kspan_base.csv"):
                _extract_kspan_dataset_bundle(bundle, root / "sources")

    def test_kspan_key_and_worldbet_mapping_examples(self):
        # Dubeolsik O/P keys are ㅐ/ㅔ respectively; WorldBet E/e represent
        # /ɛ/ and /e/ in the K-SPAN encoding.
        self.assertEqual(key_to_worldbet("o"), "E")
        self.assertEqual(key_to_worldbet("p"), "e")
        self.assertEqual(key_to_ipa("o"), "ɛ")
        self.assertEqual(key_to_ipa("p"), "e")
        self.assertEqual(key_to_worldbet("rlur"), "kij^k")
        self.assertEqual(key_to_ipa("rlur"), "kijɐk")
        self.assertEqual(key_to_worldbet("rk"), "ka")
        self.assertEqual(key_to_ipa("rk"), "ka")
        # K-SPAN 2.1 kspan_doc.pdf, Table 1: key m -> WorldBet ix -> IPA ɯ;
        # key 7 -> WorldBet ixi -> IPA ɯi. Longest-match preserves ixi as one segment.
        self.assertEqual(worldbet_to_ipa("p*thtc}hNixwE"), "p͈tʰtɕʰŋɯwɛ")
        self.assertEqual(worldbet_to_ipa("ix"), "ɯ")
        self.assertEqual(worldbet_to_ipa("ixi"), "ɯi")
        self.assertEqual(worldbet_to_ipa("j^w^"), "jɐwɐ")
        self.assertEqual(key_to_ipa("m"), "ɯ")
        self.assertEqual(key_to_ipa("7"), "ɯi")
        # Standalone WorldBet x is a consonant symbol, not the K-SPAN ix vowel.
        self.assertEqual(worldbet_to_ipa("xki"), "xki")

    def test_kspan_full_join_enforces_key_worldbet_integrity(self):
        # Exercise CSV -> NIKL WordNum join -> paired key/WorldBet encodings -> IPA.
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            nikl = root / "nikl.zip"
            kspan = root / "kspan.csv"
            self._write_nikl_zip(nikl)
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
            with kspan.open("w", encoding="utf-8", newline="") as stream:
                writer = csv.writer(stream, delimiter="\t")
                writer.writerow(fields)
                writer.writerow(["3", "o", "p", "o", "E", "e", "1"] + ["0"] * 12)

            modern, conservative, metadata = _load_kspan(kspan, nikl, expected_rows=1)
            self.assertEqual(modern[0]["canonical"], "나")
            self.assertEqual(modern[0]["phonemes"], "ɛ")
            self.assertEqual(conservative[0]["phonemes"], "e")
            self.assertEqual(metadata["key_worldbet_integrity_mismatches"], 0)
            self.assertEqual(
                metadata["key_worldbet_integrity_mismatches_by_track"],
                {"modern": 0, "conservative": 0},
            )


    def test_kspan_key_worldbet_mismatch_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            nikl = root / "nikl.zip"
            kspan = root / "kspan.csv"
            self._write_nikl_zip(nikl)
            self._write_kspan(kspan)
            with kspan.open("r", encoding="utf-8", newline="") as stream:
                rows = list(csv.reader(stream, delimiter="\t"))
            rows[1][4] = "kij^t"
            with kspan.open("w", encoding="utf-8", newline="") as stream:
                csv.writer(stream, delimiter="\t").writerows(rows)
            with self.assertRaisesRegex(ValueError, "keystroke/WorldBet integrity check failed"):
                _load_kspan(kspan, nikl, expected_rows=None)

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
            writer = csv.writer(stream, delimiter="\t")
            writer.writerow(fields)
            writer.writerows(rows)

    def test_nikl_word_index_supports_utf16_little_and_big_endian_exports(self):
        text = "순위 빈도 표제어 동형어 품사\n1 500 기역 - 명사\n2 400 가 - 명사\n"
        fixtures = (
            ("utf-16-le", text.encode("utf-16-le")),
            ("utf-16-be", text.encode("utf-16-be")),
            ("utf-16-bom", b"\xff\xfe" + text.encode("utf-16-le")),
        )
        for encoding, encoded in fixtures:
            with self.subTest(encoding=encoding), tempfile.TemporaryDirectory() as directory:
                archive_path = Path(directory) / "nikl.zip"
                with zipfile.ZipFile(archive_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
                    archive.writestr("MKUFS2/일반어휘통계.txt", encoded)
                index = _read_nikl_word_index(archive_path)
                self.assertEqual(index, {1: "기역", 2: "가"})

    def test_nikl_word_index_rejects_unrecognized_encoding_with_actionable_error(self):
        with tempfile.TemporaryDirectory() as directory:
            archive_path = Path(directory) / "nikl.zip"
            with zipfile.ZipFile(archive_path, "w") as archive:
                archive.writestr("MKUFS2/일반어휘통계.txt", bytes(range(256)) * 8)
            with self.assertRaisesRegex(ValueError, "numbered word records"):
                _read_nikl_word_index(archive_path)

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
            self.assertEqual([row["tokens"][0]["phoneme"] for row in modern], ["kijɐk", "ka"])
            self.assertEqual([row["tokens"][0]["phoneme"] for row in conservative], ["kijɐk", "ka"])
            self.assertEqual(metadata["key_worldbet_integrity_mismatches"], 0)
            self.assertEqual(metadata["source_delimiter"], "\t")

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
            self.assertEqual(manifest["ipa_dict"]["overlap_excluded_word_types"], 2)
            self.assertTrue((output / "manifest.json").exists())


if __name__ == "__main__":
    unittest.main()
