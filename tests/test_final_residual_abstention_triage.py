"""Evidence-gated regression for the five residual strict-mode abstentions.

This test intentionally does not force a pronunciation. It prevents spelling
repair, lexical guesses, or Hangul-to-IPA assumptions from being treated as
accepted output until the named evidence gates are met.
"""
import json
from pathlib import Path

from korean_ukrainian.pipeline import phoneticize_korean, transliterate_korean


QUEUE = Path(__file__).parents[1] / "research" / "final-residual-abstention-triage-2026-10-25.json"


def test_residual_abstention_register_is_complete_and_evidence_scoped():
    queue = json.loads(QUEUE.read_text(encoding="utf-8"))
    assert queue["schemaVersion"] == 1
    assert queue["basis"]["latestRecordedUnresolvedCount"] == 5
    cases = queue["cases"]
    assert [case["input"] for case in cases] == [
        "칡칡이",
        "쫒아내면",
        "많앗구나유유유",
        "삶의",
        "무서웟어",
    ]
    assert len({case["input"] for case in cases}) == 5
    assert all(case["acceptanceCriterion"] for case in cases)
    # Candidate-only UI improvements are allowed; the production phonetic/target pipeline must still abstain.
    assert all(case["productionChange"].strip() not in ("", "none") for case in cases)
    assert "no silent rewrite" in cases[0]["productionChange"]
    assert "Original input" in cases[1]["productionChange"]
    assert "No candidate is automatically applied" in cases[2]["productionChange"]
    assert "No accepted Ukrainian output" in cases[3]["productionChange"]
    assert "Original input" in cases[4]["productionChange"]
    assert all("IPA" in " ".join(queue["policy"]) or "IPA" in case["status"] for case in cases)


def test_residual_cases_preserve_abstention_and_literal_ipa_contract():
    queue = json.loads(QUEUE.read_text(encoding="utf-8"))
    for case in queue["cases"]:
        form = case["input"]
        phonetics = phoneticize_korean(form)
        result = transliterate_korean(form)
        assert phonetics["input"] == form, (form, phonetics)
        assert result["target_status"] == "unresolved", (form, result)
        assert result["ukrainian_orthography"] is None, (form, result)
        assert result["candidate_orthography"] is None, (form, result)
        if form == "많앗구나유유유":
            # The literal written form receives an inspectable IPA diagnostic;
            # the engine must not silently substitute a corrected spelling.
            assert phonetics["ipa"]["ipa"], (form, phonetics)
            assert phonetics["ipa"]["is_diagnostic_only"] is True, (form, phonetics)
            assert phonetics["pronunciation_status"] == "unresolved", (form, phonetics)
            assert phonetics["input"] == "많앗구나유유유"
        else:
            assert phonetics["pronunciation_status"] == "unresolved", (form, phonetics)


def test_spelling_sources_are_not_misrepresented_as_authorizing_normalization():
    queue = json.loads(QUEUE.read_text(encoding="utf-8"))
    by_input = {case["input"]: case for case in queue["cases"]}
    assert "not automatic normalization" in by_input["쫒아내면"]["evidenceReviewed"][0]["scope"]
    assert "not authorization to normalize" in by_input["무서웟어"]["evidenceReviewed"][0]["scope"]
    assert "not IPA" in by_input["삶의"]["evidenceReviewed"][0]["scope"]
    assert by_input["삶의"]["status"] == "BLOCKED_SPECIALIST_IPA_ADJUDICATION"
