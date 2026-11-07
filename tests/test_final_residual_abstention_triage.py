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
    assert "no silent rewrite" in cases[0]["productionChange"].lower()
    assert "Original input" in cases[1]["productionChange"]
    assert "No candidate is automatically applied" in cases[2]["productionChange"]
    assert "strict target rendering withholds final Ukrainian output" in cases[3]["productionChange"]
    assert "Original input" in cases[4]["productionChange"]
    assert all("IPA" in " ".join(queue["policy"]) or "IPA" in case["status"] for case in cases)
    current = queue["currentSnapshot"]
    assert current["recoveredExactForms"] == ["쫒아내면", "많앗구나유유유", "무서웟어"]
    by_input = {case["input"]: case for case in cases}
    assert by_input["칡칡이"]["currentDisposition"]["status"] == "SOURCE_ATTESTED_TITLE_PRESERVE_RAW_PRONUNCIATION_UNASSIGNED"
    assert by_input["삶의"]["currentDisposition"]["status"] == "SOURCE_ADJUDICATED_VARIANT_SET_SPEAKER_CHOICE_UNRESOLVED"


def test_residual_cases_preserve_exact_spelling_and_ipa_acceptance_boundary():
    queue = json.loads(QUEUE.read_text(encoding="utf-8"))
    recovered = {"쫒아내면", "많앗구나유유유", "무서웟어"}
    for case in queue["cases"]:
        form = case["input"]
        phonetics = phoneticize_korean(form)
        result = transliterate_korean(form)
        assert phonetics["input"] == form, (form, phonetics)
        if form in recovered:
            # Exact source spelling is now rule-analyzable. IPA is provisional,
            # and any target is research-prototype output, not independent gold.
            assert phonetics["pronunciation_status"] == "provisional", (form, phonetics)
            assert phonetics["ipa_is_diagnostic_only"] is False, (form, phonetics)
            assert phonetics["ipa"]["ipa"], (form, phonetics)
            assert result["target_status"] in {"model-selected", "provisional", "unavailable"}, (form, result)
            assert result["analysis_status"] == "research-prototype", (form, result)
        elif form == "삶의":
            # NIKL resolves the standard variant set; speaker selection and
            # the /ɰi/→Ukrainian mapping remain provisional without audio.
            assert phonetics["pronunciation_status"] == "provisional", (form, phonetics)
            assert phonetics["ipa_is_diagnostic_only"] is False, (form, phonetics)
            assert phonetics["ipa"]["ipa"] == "sal.mɰi", (form, phonetics)
            assert result["target_status"] == "unavailable", (form, result)
            assert result["ukrainian_orthography"] is None, (form, result)
            assert result["candidate_status"] == "provisional", (form, result)
        else:
            # 칡칡이 is source-attested as a title, but morphology and IPA remain unassigned.
            assert result["target_status"] == "unresolved", (form, result)
            assert result["ukrainian_orthography"] is None, (form, result)
            assert result["candidate_orthography"] is None, (form, result)
            assert phonetics["pronunciation_status"] == "unresolved", (form, phonetics)
            assert phonetics["ipa_is_diagnostic_only"] is True, (form, phonetics)

def test_spelling_sources_are_not_misrepresented_as_authorizing_normalization():
    queue = json.loads(QUEUE.read_text(encoding="utf-8"))
    by_input = {case["input"]: case for case in queue["cases"]}
    assert "not automatic normalization" in by_input["쫒아내면"]["evidenceReviewed"][0]["scope"]
    assert "not authorization to normalize" in by_input["무서웟어"]["evidenceReviewed"][0]["scope"]
    assert "not IPA" in by_input["삶의"]["evidenceReviewed"][0]["scope"]
    assert by_input["삶의"]["status"] == "SOURCE_ADJUDICATED_STANDARD_VARIANTS; SPEAKER_SELECTION_UNRESOLVED"
