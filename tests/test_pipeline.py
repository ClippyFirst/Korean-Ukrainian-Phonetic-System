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
    q=phoneticize_korean("각여름",n_insertion_licensed=True,rule_licenses={"R009:word:각여름:각>여"})
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
    from korean_ukrainian.pipeline import transliterate_korean, render_sequence
    for word, expected_reference, expected_reference_status in (
        ("값없다", "кабопта", "model-selected"),
        ("의견란", "ийґйоннан", "provisional"),
    ):
        value = transliterate_korean(word)
        assert value["lexical_target_reference"] == expected_reference
        assert value["lexical_target_reference_status"] == expected_reference_status
        if value["ipa_is_diagnostic_only"]:
            # Diagnostic-only IPA is not promoted to an orthographic result.
            assert value["ukrainian_orthography"] is None
            assert value["target_status"] == "unresolved"
            assert value["target_unavailable_reason"] == "unresolved_korean_phonology"
            assert value["lexical_target_comparison"] == "unavailable_without_ipa_target"
        elif expected_reference_status == "provisional":
            # Provisional target mappings are candidate-only, not accepted output.
            assert value["ukrainian_orthography"] is None
            assert value["target_status"] == "unavailable"
            assert value["target_unavailable_reason"] == "provisional_mapping_requires_review"
            assert value["candidate_orthography"] == expected_reference
            assert value["candidate_status"] == "provisional"
            assert value["lexical_target_comparison"] == "unavailable_without_ipa_target"
        else:
            assert value["ukrainian_orthography"] is not None
            assert value["target_status"] == expected_reference_status
            assert value["lexical_target_comparison"] in {"matches_reference", "differs_from_reference"}
            assert "source IPA" in value["selection_status"]
        assert "author-designed" not in value["selection_status"]

def test_target_selection_skips_unmapped_feature_nearest_candidates():
    from korean_ukrainian.pipeline import _select_target
    target = {"segments": [
        {"target": {"candidates": [
            {"candidate_id": "unmapped-nearest", "grapheme": "?", "mapping_id": None, "score": 0.0},
            {"candidate_id": "mapped-next", "grapheme": "а", "mapping_id": "MAP-1", "score": 1.0},
        ]}},
    ]}
    selected = _select_target(target)
    assert selected is not None
    assert selected["segments"][0]["candidate_id"] == "mapped-next"


def test_target_selection_fails_closed_when_no_explicit_ipa_mapping_exists():
    from korean_ukrainian.pipeline import _select_target
    target = {"segments": [
        {"target": {"candidates": [
            {"candidate_id": "feature-nearest-but-unmapped", "grapheme": "а", "mapping_id": None, "score": 0.0},
        ]}},
    ]}
    assert _select_target(target) is None



def test_python_lexical_target_reference_cannot_override_ipa_adapter_output(monkeypatch):
    import korean_ukrainian.pipeline as pipeline
    monkeypatch.setattr(
        pipeline,
        "render_ipa_sequence_to_ukrainian",
        lambda ipa, *, allow_provisional=False: {
            "ipa": ipa,
            "status": "model-selected",
            "reason": None,
            "ukrainian_orthography": "тест",
            "segments": [],
            "ignored_source_markers": [],
            "renderer": "korean_ipa_correspondence",
            "score_type": "explicit_correspondence_not_probability",
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



def test_second_pass_lexical_targets_are_references_not_ukrainian_overrides():
    from korean_ukrainian.pipeline import transliterate_korean, render_sequence
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
    for word, reference in expected.items():
        result = transliterate_korean(word)
        assert result["lexical_target_reference"] == reference, word
        assert result["ukrainian_orthography"] is not None, word
        assert result["target_status"] in {"model-selected", "provisional"}, word
        assert result["lexical_target_comparison"] in {"matches_reference", "differs_from_reference"}, word


def test_seoul_station_uses_sourced_surface_ipa_without_requiring_upi_selection():
    from korean_ukrainian.pipeline import transliterate_korean
    result = phoneticize_korean("서울역")
    assert result["ipa"]["ipa"] == "sʌ.ul.ljʌk̚"
    target = transliterate_korean("서울역")
    assert target["ukrainian_orthography"] == "соулльок"
    assert target["target_status"] == "model-selected"
    assert target["selected_candidate_is_output_source"] is False

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
            "practical_adapter_surface": case.get("normativeSurface"),
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
        assert row["practical_adapter_surface"] == expected["python"]
        assert row["differential_status"] == "raw-js-port-diverges-python-matches-nikl-practical-adapter-corrects"
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


@pytest.mark.parametrize("ipa", ["", " " + chr(9) + chr(10), "...", " . # "])
def test_ipa_adapter_rejects_empty_or_boundary_only_input(ipa):
    from korean_ukrainian.pipeline import map_ipa_to_ukrainian

    with pytest.raises(ValueError, match="at least one supported segment"):
        map_ipa_to_ukrainian(ipa)


@pytest.mark.parametrize("ipa", [None, 7, [], {}])
def test_ipa_adapter_rejects_non_string_input(ipa):
    from korean_ukrainian.pipeline import map_ipa_to_ukrainian

    with pytest.raises(TypeError, match="IPA input must be a string"):
        map_ipa_to_ukrainian(ipa)


def test_ipa_adapter_still_accepts_a_supported_segment():
    from korean_ukrainian.pipeline import map_ipa_to_ukrainian

    result = map_ipa_to_ukrainian("a")
    assert len(result["segments"]) == 1
    assert result["segments"][0]["source_ipa"] == "a"


def test_unlicensed_complex_coda_lookalike_is_explicitly_unresolved_and_fails_closed():
    from korean_ukrainian.pipeline import phoneticize_korean, transliterate_korean

    word = "앉어라"
    analysis = phoneticize_korean(word)
    assert analysis["pronunciation_status"] == "unresolved"
    assert any(
        item["rule_id"] == "R002"
        and item["input_span"] == word
        and item["status"] == "unresolved-no-exact-license"
        for item in analysis["unresolved_contexts"]
    )
    result = transliterate_korean(word)
    assert result["ukrainian_orthography"] is None
    assert result["target_status"] == "unresolved"
    assert result["selection_status"] == "unresolved_due_to_ambiguous_korean_phonology"
    assert result["target_analysis"]["status"] == "unresolved_due_to_ambiguous_korean_phonology"


def test_source_backed_complex_coda_lexicon_entry_resolves_its_own_pronunciation():
    from korean_ukrainian.pipeline import phoneticize_korean

    analysis = phoneticize_korean("값어치")
    assert analysis["pronunciation_status"] == "provisional"
    assert analysis["unresolved_contexts"] == []


def test_nikl_attested_l_ge_ending_has_sourced_fortition():
    from korean_ukrainian.pipeline import phoneticize_korean, transliterate_korean

    analysis = phoneticize_korean("할게")
    assert analysis["pronunciation_status"] == "provisional"
    assert analysis["ipa"]["ipa"] == "hal.k͈e"
    trace = next(item for item in analysis["rules"] if item["rule_id"] == "R013" and item["changed"])
    assert "attested_l_ge_ending" in trace["license_context"]
    assert "qna_seq=330963" in trace["source"]
    result = transliterate_korean("할게")
    assert result["phonetics"]["ipa"]["ipa"] == "hal.k͈e"


def test_unambiguous_productive_tensification_remains_available():
    from korean_ukrainian.pipeline import phoneticize_korean

    analysis = phoneticize_korean("국밥")
    assert analysis["pronunciation_status"] == "provisional"
    assert analysis["ipa"]["ipa"] == "kuk̚.p͈ap̚"


@pytest.mark.parametrize(
    ("word", "rule_id"),
    [
        ("쌓아", "R003"),
        ("넋하고", "R004"),
        ("갇이", "R007"),
        ("긁고", "R008"),
    ],
)
def test_native_engine_marks_unlicensed_ambiguous_ipa_as_diagnostic_only(word, rule_id):
    from korean_ukrainian.pipeline import phoneticize_korean, transliterate_korean

    analysis = phoneticize_korean(word)
    assert analysis["pronunciation_status"] == "unresolved", word
    assert analysis["ipa_status"] == "diagnostic_only_unresolved_pronunciation", word
    assert analysis["ipa_is_diagnostic_only"] is True, word
    assert analysis["ipa_status_reason"] == "unresolved_morphophonological_context", word
    assert analysis["ipa"]["status"] == "diagnostic_only_unresolved_pronunciation", word
    assert analysis["ipa"]["is_diagnostic_only"] is True, word
    assert analysis["ipa"]["status_reason"] == "unresolved_morphophonological_context", word
    assert any(item["rule_id"] == rule_id for item in analysis["unresolved_contexts"]), word

    result = transliterate_korean(word)
    assert result["ipa_status"] == "diagnostic_only_unresolved_pronunciation", word
    assert result["ipa_is_diagnostic_only"] is True, word
    assert result["ukrainian_orthography"] is None, word
    assert result["target_status"] == "unresolved", word
    assert result["selected_candidate"] is None, word


@pytest.mark.parametrize("word", ["먹이", "일본", "실수", "밭에", "국밥"])
def test_native_engine_does_not_mark_unrelated_or_resolved_contexts_unresolved(word):
    from korean_ukrainian.pipeline import phoneticize_korean, transliterate_korean

    analysis = phoneticize_korean(word)
    assert analysis["pronunciation_status"] == "provisional", word
    assert analysis["ipa_status"] == "provisional", word
    assert analysis["ipa_is_diagnostic_only"] is False, word
    assert analysis["unresolved_contexts"] == [], word

    result = transliterate_korean(word)
    assert result["ipa_status"] == "provisional", word
    assert result["ipa_is_diagnostic_only"] is False, word


def test_sourced_lexical_override_marks_ipa_provisional_not_diagnostic_only():
    from korean_ukrainian.pipeline import phoneticize_korean

    analysis = phoneticize_korean("값어치")
    assert analysis["pronunciation_status"] == "provisional"
    assert analysis["ipa_status"] == "provisional"
    assert analysis["ipa_is_diagnostic_only"] is False
    assert analysis["ipa_status_reason"] is None
    assert analysis["ipa"]["status"] == "provisional"
    assert analysis["ipa"]["is_diagnostic_only"] is False
    assert analysis["ipa"]["status_reason"] is None


def test_native_engine_applies_direct_nikl_n_insertion_example_without_caller_license():
    from korean_ukrainian.pipeline import phoneticize_korean

    result = phoneticize_korean("한여름")
    assert result["surface_hangul"] == "한녀름"
    assert result["surface_syllables"][1]["onset"] == "ㄴ"
    trace = next(item for item in result["rules"] if item["rule_id"] == "R009")
    assert trace["changed"] is True
    assert trace["license_context"] == "R009:word:한여름:한>여"
    assert trace["source"].startswith("NIKL §29")
    assert result["pronunciation_status"] == "provisional"
    assert result["ipa_is_diagnostic_only"] is False


def test_native_engine_keeps_unlisted_n_insertion_candidate_conservative():
    from korean_ukrainian.pipeline import phoneticize_korean

    result = phoneticize_korean("각여름")
    assert not any(item["rule_id"] == "R009" and item["changed"] for item in result["rules"])
    assert not any(item.get("license_context") == "R009:word:각여름:각>여" for item in result["rules"])



def test_shared_ipa_target_renderer_is_owned_by_clippyfirst_core(monkeypatch):
    from korean_ukrainian import pipeline

    def fake_renderer(ipa, *, allow_provisional=False):
        target = {"a": "а", "b": "б"}[ipa]
        return {
            "ipa": ipa,
            "status": "model-selected",
            "reason": None,
            "ukrainian_orthography": target,
            "segments": [{
                "source_ipa": ipa,
                "target_grapheme": target,
                "mapping_id": "TEST-MAP",
                "mapping_status": "model-selected",
                "source_syllable_index": 0,
                "source_word_index": 0,
            }],
            "ignored_source_markers": [],
            "renderer": "korean_ipa_correspondence",
            "score_type": "explicit_correspondence_not_probability",
        }

    monkeypatch.setattr(pipeline, "render_ipa_sequence_to_ukrainian", fake_renderer)

    result = pipeline.render_ipa_analysis_to_ukrainian(
        "안녕, 세계!",
        [{"ipa": "a"}, {"ipa": "b"}],
        pronunciation_surface="안녕, 세계!",
        phonetics={"status": "test"},
        ipa={"ipa": "a b"},
        pronunciation_engine="test-engine",
    )

    assert result["ukrainian_orthography"] == "а, б!"
    assert result["target_status"] == "model-selected"
    assert result["selection_status"].startswith(
        "source IPA → Korean-specific licensed correspondence"
    )
    assert [item["ipa"] for item in result["target_analysis"]] == ["a", "b"]

def test_shared_ipa_target_renderer_fails_closed_on_word_analysis_misalignment(monkeypatch):
    from korean_ukrainian import pipeline

    monkeypatch.setattr(
        pipeline, "map_ipa_to_ukrainian",
        lambda ipa, adapter=None: {"ipa": ipa},
    )
    monkeypatch.setattr(
        pipeline, "_select_target",
        lambda target: {"segments": [{
            "grapheme": "а",
            "source_boundary_before": None,
            "candidate_id": "test",
        }]},
    )

    result = pipeline.render_ipa_analysis_to_ukrainian(
        "안녕 세계",
        [{"ipa": "a"}],
        pronunciation_surface="안녕 세계",
        phonetics={},
        ipa={"ipa": "a"},
        pronunciation_engine="test-engine",
    )

    assert result["ukrainian_orthography"] is None
    assert result["target_status"] == "unavailable"
    assert any(
        item.get("reason") == "missing_word_ipa_analysis"
        for item in result["target_analysis"]
    )



def test_nikl_section_24_exact_form_licenses_render_correct_surface_ipa():
    expected = {
        "닮다": ("tam.t͈a", "닮>다"),
        "넘게": ("nʌm.k͈e", "넘>게"),
    }
    for word, (ipa, pair) in expected.items():
        result = phoneticize_korean(word)
        assert result["ipa"]["ipa"] == ipa, word
        trace = next(item for item in result["rules"] if item["rule_id"] == "R010")
        assert trace["changed"], word
        assert trace["license_context"] == f"R010:stem_n_m+suffix:{word}:{pair}", word
        assert not any(item["rule_id"] == "R010" for item in result["unresolved_contexts"]), word
def test_soft_morphology_is_explicit_and_keeps_heuristic_provenance():
    from korean_ukrainian.pipeline import phoneticize_korean, transliterate_korean

    strict = phoneticize_korean("수많은")
    soft = phoneticize_korean("수많은", morphology_mode="soft")
    assert strict["pronunciation_status"] == "unresolved"
    assert soft["pronunciation_status"] == "provisional"
    trace = next(rule for rule in soft["rules"] if rule["rule_id"] == "R003")
    assert trace["status"] == "heuristic-low-confidence"
    assert trace["source"] == "soft-heuristic-morphology"
    assert soft["ipa_is_diagnostic_only"] is False

    target = transliterate_korean("수많은", morphology_mode="soft")
    assert target["morphology_mode"] == "soft"
    assert target["ipa_status"] == "provisional"


def test_cli_exposes_soft_morphology_without_changing_default():
    from korean_ukrainian.cli import build_parser

    strict = build_parser().parse_args(["analyze", "좋아"])
    soft = build_parser().parse_args(["analyze", "좋아", "--morphology-mode", "soft"])
    assert strict.morphology_mode == "strict"
    assert soft.morphology_mode == "soft"


def test_cli_does_not_silently_ignore_soft_mode_for_decomposition():
    import pytest
    from korean_ukrainian.cli import _result

    with pytest.raises(ValueError, match="only with mode='transliterate'"):
        _result("좋아", "decompose", morphology_mode="soft")
