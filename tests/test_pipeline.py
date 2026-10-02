from korean_ukrainian.pipeline import phonologize_korean,phoneticize_korean

def test_pipeline_layers_are_separate():
    p=phonologize_korean("가"); q=phoneticize_korean("가")
    assert p["syllables"][0]["onset"]=="ㄱ" and q["ipa"]["level"]=="broad" and q["rules"]

def test_rule_trace_is_structured():
    q=phoneticize_korean("국밥")
    assert any(x["rule_id"]=="R008" and x["changed"] for x in q["rules"])
    assert next(x for x in q["rules"] if x["rule_id"]=="R008")["source"]=="NIKL §§23–27"

def test_unknown_boundary_does_not_apply_contextual_rules():
    q=phoneticize_korean("국밥",boundary_mode="unknown")
    assert not any(x["changed"] for x in q["rules"] if x["rule_id"] in {"R002","R003","R004","R005","R006","R007","R008","R009"})

def test_n_insertion_requires_explicit_licensing():
    assert not any(x["changed"] for x in phoneticize_korean("먹이")["rules"] if x["rule_id"]=="R009")
    q=phoneticize_korean("한여름",n_insertion_licensed=True)
    assert any(x["rule_id"]=="R009" and x["changed"] for x in q["rules"])
    assert q["surface_syllables"][1]["onset"]=="ㄴ"

def test_phrase_n_insertion_requires_phrase_and_license():
    q=phoneticize_korean("무슨 일",boundary_mode="phrase",n_insertion_licensed=True)
    assert q["surface_syllables"][2]["onset"]=="ㄴ"

import pytest
from korean_ukrainian.pipeline import analyze_korean
from korean_ukrainian.correspondence import rank_candidates
from korean_ukrainian.rules import apply_ordered_rules

def test_analyze_korean_rejects_mixed_script_instead_of_filtering():
    with pytest.raises(ValueError, match="unsupported non-Hangul"):
        analyze_korean("가A")

def test_candidate_ranking_exposes_mapping_penalty_components():
    ranked = rank_candidates(
        {"consonantal":"1","sonorant":"0"},
        [
            {"candidate_id":"A","features":{"consonantal":"1","sonorant":"0"},
             "context_penalty":2.0,"phonotactic_penalty":1.0,"orthographic_penalty":0.0},
            {"candidate_id":"B","features":{"consonantal":"1","sonorant":"1"},
             "context_penalty":0.0,"phonotactic_penalty":0.0,"orthographic_penalty":0.0},
        ],
        {"consonantal":1.0,"sonorant":1.0},
    )
    assert ranked[0]["candidate_id"] == "B"
    assert ranked[0]["score_type"] == "heuristic_cost"
    assert "feature_cost" in ranked[0] and "total_cost" in ranked[0]

def test_morphological_fortition_requires_explicit_license():
    from korean_ukrainian.phonology import parse_syllables
    items = parse_syllables("신고")
    apply_ordered_rules(items, rule_ids=["R010"], boundary_mode="same_word")
    assert items[1].onset == "ㄱ"
    items = parse_syllables("신고")
    apply_ordered_rules(items, rule_ids=["R010"], boundary_mode="same_word",
                        rule_licenses={"R010:stem_n_m+suffix"})
    assert items[1].onset == "ㄲ"
