import json
import tempfile
import unittest
from pathlib import Path
from scripts.build_full_korean_benchmark_summary import BROWSER_REPORTS, MULTI_ENGINE_REPORTS, build_summary

def multi_report():
    return {"benchmark":"fixture","dataset_source":"fixture source","dataset_rows":2,
      "eligible_token_occurrences":2,"unique_hangul_words":2,"engine_order":["engine"],
      "engines":{"engine":{"scored_tokens":2,"exact_matches":1,"exact_match_rate":0.5,
      "character_error_rate":0.1,"coverage":1.0,"coverage_adjusted_exact_match_rate":0.5,
      "per_engine_occurrences":[{"token":"비공개","gold":"secret"}]}},
      "per_engine_occurrences":[{"token":"비공개","gold":"secret"}]}

def browser_report(mode):
    return {"benchmark":"fixture","dataset_source":"fixture source","split":"test",
      "morphology_mode":mode,"ipa_profile":"fixture","ipa_profile_version":1,
      "eligible_tokens":2,"scored_tokens":2,"coverage_rate":1.0,
      "source_resolved_coverage_rate":1.0,"output_available_tokens":2,
      "output_availability_rate":1.0,"exact_matches":1,"exact_match_rate":0.5,
      "coverage_adjusted_exact_match_rate":0.5,"character_error_rate":0.1,
      "records":[{"token":"приватний","gold":"secret"}]}

class FullAggregateArtifactTests(unittest.TestCase):
    def test_combines_all_tracks_and_excludes_occurrence_data(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory); prepared=root/"open-korean-benchmarks-work"/"prepared"
            prepared.mkdir(parents=True)
            (prepared/"manifest.json").write_text(json.dumps({"schema_version":1,"kspan":{
              "key_worldbet_integrity_status":"WARN","key_worldbet_integrity_mismatches":22843,
              "key_worldbet_integrity_mismatches_by_track":{"modern":13078,"conservative":9765},
              "key_worldbet_integrity_examples":["private-row-example"]}}),encoding="utf-8")
            for _,relative in MULTI_ENGINE_REPORTS:
                path=root/relative; path.parent.mkdir(parents=True,exist_ok=True)
                path.write_text(json.dumps(multi_report()),encoding="utf-8")
            for track,relative in BROWSER_REPORTS:
                path=root/relative; path.parent.mkdir(parents=True,exist_ok=True)
                path.write_text(json.dumps(browser_report("super-soft" if track.endswith("-super-soft") else track.rsplit("-",1)[-1])),encoding="utf-8")
            result=build_summary(root); rendered=json.dumps(result,ensure_ascii=False)
            self.assertEqual(len(result["multi_engine_tracks"]),6)
            self.assertEqual(len(result["browser_mode_tracks"]),15)
            self.assertEqual(result["manifest"]["kspan"]["key_worldbet_integrity_status"],"WARN")
            self.assertNotIn("per_engine_occurrences",rendered)
            self.assertNotIn('"token"',rendered); self.assertNotIn('"gold"',rendered)
            self.assertNotIn("private-row-example",rendered)

    def test_workflow_uploads_only_aggregate_summary_and_source_hashes(self):
        workflow=(Path(__file__).resolve().parents[1]/".github/workflows/multi-engine-ipa-benchmark.yml").read_text(encoding="utf-8")
        upload=workflow.split("name: multi-engine-korean-ipa-diagnostic",1)[1].split("retention-days: 30",1)[0]
        self.assertIn("korean-benchmark-aggregate-summary.json",upload)
        self.assertIn("source-sha256.txt",upload)
        for forbidden in ("multi-engine-ipa-report.json","sigmorphon-kor-test.tsv",
          "phonemize-predictions.json","mismatch-fragments.csv","reviewer-a.csv",
          "ipa-holdout-review-packets/"):
            self.assertNotIn(forbidden,upload)

if __name__=="__main__": unittest.main()
