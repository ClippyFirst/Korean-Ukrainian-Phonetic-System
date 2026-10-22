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
                        rule_licenses={"R010:stem_n_m+suffix:신고:신>고"})
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
    result = phoneticize_korean("무슨 일", boundary_mode="phrase", n_insertion_licensed=True,
                                 rule_licenses={"R009:phrase:무슨 일:슨>일"})
    assert result["surface_syllables"][2]["onset"] == "ㄴ"



def test_ipa_tokenizer_accepts_length_marks_in_lexical_pronunciations():
    from korean_ukrainian.pipeline import tokenize_ipa
    assert tokenize_ipa("ɰiː.ɡjʌn.nan") == ["ɰ", "i", "ɡ", "j", "ʌ", "n", "n", "a", "n"]



def test_python_transliteration_uses_ipa_derived_target_and_keeps_lexical_target_as_reference():
    from korean_ukrainian.pipeline import transliterate_korean
    value = transliterate_korean("값없다")
    assert value["ukrainian_orthography"] == "кабопта"
    assert value["target_status"] == "model-selected"
    assert value["lexical_target_reference"] == "кабопта"
    assert value["lexical_target_reference_status"] == "model-selected"
    assert value["lexical_target_comparison"] == "matches_reference"
    assert "IPA-derived" in value["selection_status"]
    opinion = transliterate_korean("의견란")
    assert opinion["ukrainian_orthography"] == "ийґйоннан"
    assert opinion["target_status"] == "model-selected"
    assert opinion["lexical_target_reference"] == "ийґйоннан"
    assert opinion["lexical_target_reference_status"] == "provisional"
    assert opinion["lexical_target_comparison"] == "matches_reference"
    assert "author-designed" not in opinion["selection_status"]


def test_python_lexical_target_reference_cannot_override_ipa_adapter_output(monkeypatch):
    import korean_ukrainian.pipeline as pipeline
    monkeypatch.setattr(
        pipeline,
        "_select_target",
        lambda target: {
            "segments": [{"grapheme": "тест"}],
            "score_type": "heuristic_cost",
            "status": "top_ranked_segmentwise",
        },
    )
    result = pipeline.transliterate_korean("값없다")
    assert result["ukrainian_orthography"] == "тест"
    assert result["lexical_target_reference"] == "кабопта"
    assert result["lexical_target_comparison"] == "differs_from_reference"
    assert result["target_status"] == "model-selected"

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
        "넓네": "нолле",
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
    assert target["ukrainian_orthography"] == "соулльок"
    assert target["target_status"] == "model-selected"


def test_python_surface_ipa_matches_nikl_19_and_18_for_dongnimmun():
    result=phoneticize_korean("독립문")
    assert [x["onset"] for x in result["surface_syllables"]]==["ㄷ","ㄴ","ㅁ"]
    assert [x["coda"] for x in result["surface_syllables"]]==["ㅇ","ㅁ","ㄴ"]
    assert result["ipa"]["ipa"]=="toŋ.nim.mun"


def test_g2pk_differential_script_has_valid_python_syntax():
    import ast
    from pathlib import Path
    script = Path(__file__).resolve().parents[1] / "scripts" / "compare-g2pk-engines.py"
    ast.parse(script.read_text(encoding="utf-8"), filename=str(script))


def test_python_g2pk_surface_differential_against_browser_fixture():
    import json
    import sys
    import warnings
    from pathlib import Path
    import pytest

    if sys.version_info >= (3, 13):
        pytest.skip("the optional g2pK extra is declared only for Python <3.13")
    try:
        from g2pk import G2p
    except ImportError as exc:
        pytest.fail(f"g2pK should be installed by the dev extra on Python {sys.version_info.major}.{sys.version_info.minor}: {exc}")

    root = Path(__file__).resolve().parents[1]
    fixture = json.loads((root / "tests/fixtures/g2pk-surface-regression.json").read_text(encoding="utf-8"))
    g2p = G2p()
    rows = []
    for case in fixture["cases"]:
        python_surface = str(g2p(case["input"]))
        assert python_surface == case["pythonG2pkSurface"], case["input"] + ": recorded Python g2pK result changed"
        rows.append({
            "input": case["input"],
            "phenomenon": case["phenomenon"],
            "browser_expected_surface": case["expectedSurface"],
            "recorded_python_surface": case["pythonG2pkSurface"],
            "python_g2pk_surface": python_surface,
            "equal": python_surface == case["expectedSurface"],
            "ipa_gold_status": case["ipaGoldStatus"],
            "differential_status": case["differentialStatus"],
        })
    mismatches = [row for row in rows if not row["equal"]]
    # These are known, evidence-backed JS-port divergences, not interchangeable
    # IPA gold. Keep the practical port contract visible while guarding against
    # silent additions/removals from this diagnostic.
    expected_mismatches = {
        "넓죽하다": {"browser": "널쭈카다", "python": "넙쭈카다"},
        "읽고": {"browser": "익꼬", "python": "일꼬"},
    }
    assert {row["input"] for row in mismatches} == set(expected_mismatches)
    by_input = {case["input"]: case for case in fixture["cases"]}
    for row in mismatches:
        expected = expected_mismatches[row["input"]]
        case = by_input[row["input"]]
        assert row["browser_expected_surface"] == expected["browser"]
        assert row["python_g2pk_surface"] == expected["python"]
        assert case["normativeSurface"] == expected["python"], row["input"]
        assert case["expectedSurface"] != case["normativeSurface"], row["input"]
        assert case["normativeEvidenceStatus"] in {"direct-NIKL-example", "direct-NIKL-QA"}
    report = {
        "kind": "diagnostic-only",
        "rows_compared": len(rows),
        "equal": len(rows) - len(mismatches),
        "different": len(mismatches),
        "ipa_comparison": "not_performed",
        "mismatches": mismatches,
    }
    warnings.warn("PYTHON_G2PK_DIFFERENTIAL_REPORT=" + json.dumps(report, ensure_ascii=False), UserWarning)
    assert len(rows) == len(fixture["cases"]) == 20


def test_python_ipa_inventory_matches_browser_surface_segments():
    from korean_ukrainian.pipeline import tokenize_ipa, source_features_for_ipa
    tokens = ("ɡ", "dʑ", "s͈", "ɕ͈", "tɕ͈", "tɕʰ", "k͈")
    for token in tokens:
        assert tokenize_ipa(token) == [token]
        assert source_features_for_ipa(token), token
    assert "".join(tokenize_ipa("s͈ɕ͈dʑɡ")) == "s͈ɕ͈dʑɡ"
    assert source_features_for_ipa("ɡ")["voice"] == "1"
    assert source_features_for_ipa("dʑ")["voice"] == "1"
    assert source_features_for_ipa("ɕ͈")["palatalized"] == "1"
