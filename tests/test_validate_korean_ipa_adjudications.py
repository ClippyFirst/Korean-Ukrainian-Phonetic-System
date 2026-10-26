import importlib.util
import json
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "validate_korean_ipa_adjudications.py"
SPEC = importlib.util.spec_from_file_location("validate_korean_ipa_adjudications", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MODULE)

PINS = {
    "sigmorphon": {"dataset_id": "sigmorphon-2021-task1-medium-korean", "dataset_revision": "821bcdece5a47820872215969f275004b0abe80c", "target_representation": "tokenized_ipa_from_sigmorphon_tsv"},
    "ugtphon": {"dataset_id": "ugtphon-korean", "dataset_revision": "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54", "target_representation": "ugtphon_token_phoneme_ipa"},
}


def clone(value):
    return json.loads(json.dumps(value))


def queue():
    return {"source_pins": clone(PINS), "items": [{
        "queue_id": "KIPA-TRAIN-0001", "source_text": "삶의",
        "sigmorphon_candidates": [{"target_raw": "sal mɰi"}],
        "ugtphon_candidates": [{"target_raw": "sal.mɰi"}],
    }]}


def review(decision="UNRESOLVED", evidence=None):
    entry = {"reviewer_id": "reviewer-a", "decision": decision, "rationale": "Reviewed but source convention remains uncertain"}
    if evidence is not None:
        entry["evidence_reference"] = evidence
    return {"schema_version": "1.0", "source_pins": clone(PINS), "decisions": [{
        "queue_id": "KIPA-TRAIN-0001", "source_text": "삶의",
        "reviewers": {
            "reviewer_1": dict(entry),
            "reviewer_2": {**entry, "reviewer_id": "reviewer-b"},
        },
    }]}


class AdjudicationValidationTests(unittest.TestCase):
    def test_unresolved_independent_reviews_are_preserved(self):
        result = MODULE.validate_and_merge(queue(), review())
        self.assertEqual(result["status"], "HUMAN_DECISIONS_VALIDATED")
        self.assertEqual(result["decision_record_count"], 1)
        self.assertTrue(result["decisions"][0]["reviewer_agreement"])
        self.assertFalse(result["guardrails"]["ipa_mapping_applied"])

    def test_non_unresolved_decision_requires_evidence(self):
        with self.assertRaisesRegex(ValueError, "evidence_reference required"):
            MODULE.validate_and_merge(queue(), review("LIKELY_ERROR"))

    def test_non_unresolved_decision_with_evidence_passes(self):
        result = MODULE.validate_and_merge(queue(), review("LIKELY_ERROR", "https://example.org/source"))
        self.assertEqual(result["decisions"][0]["reviewers"]["reviewer_1"]["evidence_reference"], "https://example.org/source")

    def test_source_pins_must_match(self):
        bad = review()
        bad["source_pins"]["ugtphon"]["dataset_revision"] = "mutable"
        with self.assertRaisesRegex(ValueError, "source_pins"):
            MODULE.validate_and_merge(queue(), bad)

    def test_unknown_or_duplicate_queue_ids_rejected(self):
        bad = review()
        bad["decisions"][0]["queue_id"] = "unknown"
        with self.assertRaisesRegex(ValueError, "unknown queue_id"):
            MODULE.validate_and_merge(queue(), bad)
        bad = review()
        bad["decisions"].append(clone(bad["decisions"][0]))
        with self.assertRaisesRegex(ValueError, "duplicate decision"):
            MODULE.validate_and_merge(queue(), bad)

    def test_source_form_tampering_rejected(self):
        bad = review()
        bad["decisions"][0]["source_text"] = "진짜"
        with self.assertRaisesRegex(ValueError, "source_text does not match"):
            MODULE.validate_and_merge(queue(), bad)

    def test_final_decision_requires_named_adjudicator_and_rationale(self):
        bad = review()
        bad["decisions"][0].update({
            "final_decision": "CONVENTION_ONLY",
            "final_rationale": "A reasoned decision",
        })
        with self.assertRaisesRegex(ValueError, "adjudicator and final_rationale"):
            MODULE.validate_and_merge(queue(), bad)

        bad["decisions"][0]["adjudicator"] = "adjudicator-x"
        del bad["decisions"][0]["final_rationale"]
        with self.assertRaisesRegex(ValueError, "final_rationale must be a non-empty string"):
            MODULE.validate_and_merge(queue(), bad)

    def test_two_review_slots_must_represent_distinct_people(self):
        bad = review()
        bad["decisions"][0]["reviewers"]["reviewer_2"]["reviewer_id"] = "reviewer-a"
        with self.assertRaisesRegex(ValueError, "two distinct reviewers"):
            MODULE.validate_and_merge(queue(), bad)

    def test_final_non_unresolved_decision_requires_evidence(self):
        bad = review()
        record = bad["decisions"][0]
        record.update({
            "adjudicator": "adjudicator-x",
            "final_decision": "CONVENTION_ONLY",
            "final_rationale": "A reviewed primary source supports this interpretation",
        })
        with self.assertRaisesRegex(ValueError, "final_evidence_reference"):
            MODULE.validate_and_merge(queue(), bad)
        record["final_evidence_reference"] = "official-rule-section-2.1"
        result = MODULE.validate_and_merge(queue(), bad)
        self.assertEqual(result["decisions"][0]["review_status"], "ADJUDICATED")

    def test_non_string_final_rationale_is_rejected_cleanly(self):
        bad = review()
        bad["decisions"][0].update({
            "adjudicator": "adjudicator-x",
            "final_decision": "UNRESOLVED",
            "final_rationale": [],
        })
        with self.assertRaisesRegex(ValueError, "final_rationale must be a non-empty string"):
            MODULE.validate_and_merge(queue(), bad)

    def test_partial_review_explicitly_lists_unreviewed_items(self):
        q = queue()
        q["items"].append({"queue_id": "KIPA-TRAIN-0002", "source_text": "진짜"})
        result = MODULE.validate_and_merge(q, review())
        self.assertEqual(result["unreviewed_queue_ids"], ["KIPA-TRAIN-0002"])


if __name__ == "__main__":
    unittest.main()
