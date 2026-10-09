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
    q=phoneticize_korean("한여름",n_insertion_licensed=True,rule_licenses={"R009:word:한여름:한>여"})
    assert any(x["rule_id"]=="R009" and x["changed"] for x in q["rules"])
    assert q["surface_syllables"][1]["onset"]=="ㄴ"

def test_phrase_n_insertion_requires_phrase_and_license():
    q=phoneticize_korean("무슨 일",boundary_mode="phrase",n_insertion_licensed=True,rule_licenses={"R009:phrase:무슨 일:슨>일"})
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



def test_sourced_lexical_pronunciation_overrides_cover_known_exceptions():
    from korean_ukrainian.pipeline import phoneticize_korean
    expected = {
        "값없다": "ka.bʌp̚.t͈a",
        "의견란": "ɰiː.ɡjʌn.nan",
        "읽고": "il.k͈o",
        "읽다": "ik̚.t͈a",
        "읽어": "il.ɡʌ",
        "읽는": "iŋ.nɯn",
        "읽지": "ik̚.tɕ͈i",
        "맑게": "mal.k͈e",
        "맑고": "mal.k͈o",
        "맑다": "mak̚.t͈a",
        "밝기": "pal.k͈i",
        "닭고기": "tak̚.k͈o.ɡi",
    }
    for word, ipa in expected.items():
        result = phoneticize_korean(word)
        assert result["ipa"]["ipa"] == ipa, word
        assert any(rule["rule_id"] == "LEXICON" and rule["status"] == "lexical-override"
                   for rule in result["rules"]), word


def test_lexical_ㄺ_rules_do_not_overgeneralize_to_noun_forms():
    from korean_ukrainian.pipeline import phoneticize_korean
    assert phoneticize_korean("닭고기")["ipa"]["ipa"] == "tak̚.k͈o.ɡi"
    assert phoneticize_korean("읽고")["ipa"]["ipa"] == "il.k͈o"
    assert phoneticize_korean("닭이")["ipa"]["ipa"] == "tal.ɡi"


def test_lexical_pronunciation_keeps_phrase_level_n_insertion_working():
    from korean_ukrainian.pipeline import phoneticize_korean
    result = phoneticize_korean("무슨 일", boundary_mode="phrase", n_insertion_licensed=True,\n                                 rule_licenses={"R009:phrase:무슨 일:슨>일"})
    assert result["surface_syllables"][2]["onset"] == "ㄴ"



def test_ipa_tokenizer_accepts_length_marks_in_lexical_pronunciations():
    from korean_ukrainian.pipeline import tokenize_ipa
    assert tokenize_ipa("ɰiː.ɡjʌn.nan") == ["ɰ", "i", "ɡ", "j", "ʌ", "n", "n", "a", "n"]



def test_python_transliteration_uses_exact_lexical_target_and_marks_provisional_mapping():
    from korean_ukrainian.pipeline import transliterate_korean
    value = transliterate_korean("값없다")
    assert value["ukrainian_orthography"] == "кабопта"
    assert value["target_status"] == "model-selected"
    assert "lexical target override" in value["selection_status"]
    opinion = transliterate_korean("의견란")
    assert opinion["ukrainian_orthography"] == "ийґйоннан"
    assert opinion["target_status"] == "provisional"
    assert "author-designed" in opinion["selection_status"]

def test_second_pass_sourced_lexical_pronunciations_match_shared_ipa_data():
    from korean_ukrainian.pipeline import phoneticize_korean
    expected = {
        "꽃잎": "k͈on.nip̚",
        "밭이": "pa.tɕʰi",
        "밭을": "pa.tʰɯl",
        "넓네": "nʌl.le",
        "없다": "ʌːp̚.t͈a",
        "없는": "ʌːm.nɯn",
        "국물": "kuŋ.mul",
        "떡볶이": "t͈ʌk̚.p͈o.k͈i",
        "옷이": "o.ɕi",
    }
    for word, ipa in expected.items():
        result = phoneticize_korean(word)
        assert result["ipa"]["ipa"] == ipa, word
        assert any(rule["rule_id"] == "LEXICON" and rule["status"] == "lexical-override"
                   for rule in result["rules"]), word


def test_second_pass_lexical_targets_are_shared_with_python_transliteration():
    from korean_ukrainian.pipeline import transliterate_korean
    expected = {
        "꽃잎": "конніп",
        "밭이": "пачі",
        "밭을": "патил",
        "넓네": "нольле",
        "없다": "опта",
        "없는": "омнин",
        "국물": "кунмул",
        "떡볶이": "токпокі",
        "옷이": "оші",
    }
    for word, ukrainian in expected.items():
        result = transliterate_korean(word)
        assert result["ukrainian_orthography"] == ukrainian, word
        assert result["target_status"] == "model-selected", word



def test_seoul_station_uses_sourced_surface_form_and_shared_target():
    from korean_ukrainian.pipeline import transliterate_korean
    result = phoneticize_korean("서울역")
    assert result["ipa"]["ipa"] == "sʌ.ul.ljʌk̚"
    target = transliterate_korean("서울역")
    assert target["ukrainian_orthography"] == "соуллйок"
    assert target["target_status"] == "model-selected"
