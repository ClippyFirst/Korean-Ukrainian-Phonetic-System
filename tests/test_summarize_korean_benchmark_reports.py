import json
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_korean_benchmark_reports import summarize


class AggregateBenchmarkSummaryTests(unittest.TestCase):
    def test_summary_keeps_metrics_and_omits_token_level_records(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            manifest = root / "manifest.json"
            multi = root / "multi.json"
            browser = root / "browser.json"
            manifest.write_text(json.dumps({"schema_version": 1, "kspan": {"key_worldbet_integrity_status": "WARN", "key_worldbet_integrity_mismatches": 2, "key_worldbet_integrity_mismatches_by_track": {"modern": 1, "conservative": 1}, "key_worldbet_integrity_examples": ["1:modern:key=o:e!=E"]}}), encoding="utf-8")
            multi.write_text(json.dumps({
                "benchmark": "K-SPAN Modern",
                "dataset_source": "CC0",
                "dataset_rows": 10,
                "eligible_token_occurrences": 10,
                "unique_hangul_words": 10,
                "engine_order": ["clippyfirst_native"],
                "engines": {
                    "clippyfirst_native": {
                        "scored_tokens": 9,
                        "exact_matches": 4,
                        "exact_match_rate": 4 / 9,
                        "character_error_rate": 0.2,
                        "phoneme_error_rate": 0.3,
                        "phonological_feature_error_rate_proxy": 0.1,
                        "coverage": 0.9,
                        "coverage_adjusted_exact_match_rate": 0.4,
                        "abstentions_or_unresolved": 1,
                        "engine_errors_on_token_loop": 0,
                        "bootstrap_95pct_ci": [0.2, 0.7],
                        "broad_candidate": {
                            "scored_tokens": 9,
                            "exact_matches": 5,
                            "exact_match_rate": 5 / 9,
                            "character_error_rate": 0.1,
                            "coverage_adjusted_exact_match_rate": 0.5,
                            "bootstrap_95pct_ci": [0.3, 0.8],
                        },
                    }
                },
                "per_engine_occurrences": [{"token": "가", "gold": "ka"}],
                "diagnostic_mismatch_sample": [{"token": "나", "gold": "na"}],
            }), encoding="utf-8")
            browser.write_text(json.dumps({
                "benchmark": "K-SPAN Browser",
                "dataset_source": "CC0",
                "split": "test",
                "morphology_mode": "strict",
                "ipa_profile": "test-profile",
                "ipa_profile_version": 1,
                "eligible_tokens": 10,
                "scored_tokens": 9,
                "coverage_rate": 0.9,
                "source_resolved_coverage_rate": 0.9,
                "output_available_tokens": 10,
                "output_availability_rate": 1.0,
                "exact_matches": 4,
                "exact_match_rate": 4 / 9,
                "coverage_adjusted_exact_match_rate": 0.4,
                "character_error_rate": 0.2,
                "records": [{"token": "가", "gold": "ka"}],
            }), encoding="utf-8")

            result = summarize(
                ["kspan-modern=" + str(multi)],
                ["kspan-modern-strict=" + str(browser)],
                manifest,
            )
            rendered = json.dumps(result, ensure_ascii=False)
            self.assertIn("exact_match_rate", rendered)
            self.assertIn("kspan-modern", rendered)
            self.assertNotIn("per_engine_occurrences", rendered)
            self.assertNotIn("diagnostic_mismatch_sample", rendered)
            self.assertNotIn('"token": "가"', rendered)
            self.assertNotIn('"gold": "ka"', rendered)
            self.assertEqual(result["multi_engine_tracks"][0]["engines"]["clippyfirst_native"]["scored_tokens"], 9)
            self.assertEqual(result["browser_mode_tracks"][0]["morphology_mode"], "strict")
            self.assertEqual(result["browser_mode_tracks"][0]["ipa_profile_version"], "1")
            self.assertEqual(result["manifest"]["kspan"]["key_worldbet_integrity_status"], "WARN")
            self.assertEqual(result["manifest"]["kspan"]["key_worldbet_integrity_mismatches"], 2)
            self.assertNotIn("key_worldbet_integrity_examples", result["manifest"]["kspan"])
            self.assertNotIn("1:modern:key=o:e!=E", rendered)


    def test_workflow_artifact_excludes_row_level_kspan_manifest_examples(self):
        workflow = (
            Path(__file__).resolve().parents[1]
            / ".github/workflows/multi-engine-ipa-benchmark.yml"
        ).read_text(encoding="utf-8")
        # The raw preparation manifest carries per-WordNum key/WorldBet
        # examples. Only the redacted aggregate summary and source hashes
        # may be uploaded from the open supplemental benchmark workdir.
        self.assertNotIn(
            "open-korean-benchmarks-work/prepared/manifest.json",
            workflow,
        )
        self.assertIn("open-korean-benchmark-summary.json", workflow)
        self.assertIn("open-korean-benchmarks-work/prepared/source-sha256.txt", workflow)


if __name__ == "__main__":
    unittest.main()
