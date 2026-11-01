from korean_ukrainian.pipeline import transliterate_korean, tokenize_ipa

def test_end_to_end_preserves_layers():
    out=transliterate_korean("국밥")
    assert out["phonology"]["syllables"] and out["ipa"]["ipa"]
    assert out["score_type"] == "explicit_correspondence_not_probability"
    assert out["target_inventory_score_type"] == "heuristic_cost"

def test_unsupported_ipa_is_rejected():
    try:
        tokenize_ipa("ka!")
    except ValueError:
        pass
    else:
        raise AssertionError("unsupported IPA must fail explicitly")

def test_phrase_boundary_is_distinct():
    from korean_ukrainian.phonology import parse_syllables
    items=parse_syllables("무슨 일")
    assert items[1].index==1 and items[1].boundary_after=="word"


def test_nikl_27_c08_exact_same_word_and_phrase_licenses():
    cases = [
        ("무고일수도있다는", "same_word", "일>수", "s͈u"),
        ("했을시", "same_word", "을>시", "ɕ͈i"),
        ("무고일 수도", "phrase", "일>수", "s͈u"),
        ("했을 시", "phrase", "을>시", "ɕ͈i"),
    ]
    for text, boundary_mode, pair, expected_ipa in cases:
        result = transliterate_korean(text, boundary_mode=boundary_mode)
        assert expected_ipa in result["ipa"]["ipa"]
        assert any(
            trace["rule_id"] == "R013"
            and trace["changed"]
            and trace["license_context"] == f"R013:adnominal_l:{text}:{pair}"
            for trace in result["phonetics"]["rules"]
        )

    # Exact morphology only: this does not authorize a suffix-wide -성 rule
    # or the unrelated connective ending -ㄹ지.
    for text in ["유사성", "했을지"]:
        result = transliterate_korean(text)
        assert not any(
            trace["rule_id"] == "R013" and trace["changed"]
            for trace in result["phonetics"]["rules"]
        )
