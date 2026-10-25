"""Guard the candidate-only analysis of five residual Korean forms.

These checks validate provenance and status boundaries, not linguistic gold.
"""
import json
from pathlib import Path

DATA = Path(__file__).parents[1] / "research" / "residual-five-candidate-resolution-2026-10-25.json"


def test_all_five_residual_forms_have_explicit_problem_classes():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    cases = {case["input"]: case for case in data["cases"]}
    assert set(cases) == {"칡칡이", "쫒아내면", "많앗구나유유유", "삶의", "무서웟어"}
    assert cases["칡칡이"]["class"] == "LEXICAL_IDENTITY_AND_MORPHOLOGY"
    assert cases["쫒아내면"]["class"] == "NONSTANDARD_ORTHOGRAPHY"
    assert cases["많앗구나유유유"]["class"] == "ORTHOGRAPHY_PLUS_EXPRESSIVE_TOKENIZATION"
    assert cases["삶의"]["class"] == "IPA_VARIANT_ADJUDICATION"
    assert cases["무서웟어"]["class"] == "NONSTANDARD_ORTHOGRAPHY"


def test_spelling_and_tokenization_candidates_never_claim_to_pronounce_original():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    for case in data["cases"]:
        for candidate in case.get("candidateForms", []):
            if candidate.get("kind") != "original_orthography":
                assert candidate["pronunciationMayBeAttributedToOriginal"] is False
    assert data["policy"]["originalInputIsImmutable"] is True
    assert data["policy"]["spellingCandidatesArePronunciationInputs"] is False
    assert data["policy"]["ukrainianTargetAllowedBeforeIndependentReview"] is False


def test_salmui_keeps_both_nikl_variants_as_non_gold_ipa_candidates():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    case = next(case for case in data["cases"] if case["input"] == "삶의")
    assert {item["sourceSurface"] for item in case["candidateIPA"]} == {"[살믜]", "[살메]"}
    assert {item["value"] for item in case["candidateIPA"]} == {"sal.mɰi", "sal.me"}
    assert all(item["status"] == "provisional_candidate_not_gold" for item in case["candidateIPA"])
    assert all(item["reviewRequired"] for item in case["candidateIPA"])


def test_probable_typos_are_candidates_not_silent_runtime_repairs():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    cases = {case["input"]: case for case in data["cases"]}
    expected = {
        "쫒아내면": "쫓아내면",
        "무서웟어": "무서웠어",
    }
    for source, correction in expected.items():
        case = cases[source]
        assert correction in {item["text"] for item in case["candidateForms"]}
        assert case["status"] == "CANDIDATE_ONLY"
        assert "Do not alter the input" in case["productionAction"]


def test_manyatgu_narrowly_separates_spelling_from_expressive_tail():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    case = next(case for case in data["cases"] if case["input"] == "많앗구나유유유")
    candidates = {item["text"]: item for item in case["candidateForms"]}
    assert "많았구나유유유" in candidates
    assert "많았구나 ㅠㅠㅠ" in candidates
    assert "많앗구나 유유유" in candidates
    assert all(item["pronunciationMayBeAttributedToOriginal"] is False for item in candidates.values())


def test_unresolved_lexical_morphology_has_no_invented_candidates():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    case = next(case for case in data["cases"] if case["input"] == "칡칡이")
    assert case["status"] == "BLOCKED"
    assert case["candidateForms"] == []
    assert case["candidateIPA"] == []
    assert case["productionAction"] == "none"
