import json
from pathlib import Path

from korean_ukrainian.pipeline import transliterate_korean, tokenize_ipa

C08_CONTEXTS = json.loads(
    (Path(__file__).parent / "fixtures" / "kozak-kim-c08-source-contexts.json").read_text(encoding="utf-8")
)

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
        ("했을시", "same_word", "을>시", "͈i"),
        ("보일거라", "same_word", "일>거", "k͈ʌ"),
        ("없을듯", "same_word", "을>듯", "t͈ɯ"),
        ("안할듯", "same_word", "할>듯", "t͈ɯ"),
        ("무고일 수도", "phrase", "일>수", "s͈u"),
        ("했을 시", "phrase", "을>시", "͈i"),
        ("해줄것", "same_word", "줄>것", "k͈ʌ"),
        ("많을거같이", "same_word", "을>거", "k͈ʌ"),
        ("내릴수있는", "same_word", "릴>수", "s͈u"),
        ("존중시킬수도있지만", "same_word", "킬>수", "s͈u"),
    ]
    # Python broad IPA renders the palatalized fricative as /s/ before /i/;
    # assert the fortis diacritic rather than imposing the browser narrow profile.
    for text, boundary_mode, pair, expected_ipa in cases:
        result = transliterate_korean(text, boundary_mode=boundary_mode)
        assert expected_ipa in result["ipa"]["ipa"]
        assert any(
            trace["rule_id"] == "R013"
            and trace["changed"]
            and trace["license_context"] == (f"R013:phrase:{text}:{pair}" if boundary_mode == "phrase" else f"R013:adnominal_l:{text}:{pair}")
            for trace in result["phonetics"]["rules"]
        )

    # Exact morphology only: this does not authorize a suffix-wide -성 rule,
    # the unrelated connective ending -ㄹ지, or reconstructed C08 contexts whose
    # segmentation/prosody has only conditional evidence.
    for text in ["유사성", "했을지", "없을거같이"]:
        result = transliterate_korean(text)
        assert not any(
            trace["rule_id"] == "R013" and trace["changed"]
            for trace in result["phonetics"]["rules"]
        )


def test_nikl_27_c08_exact_word_licenses_apply_inside_full_sentences():
    cases = [
        ("multilexnorm2026_1953", "무고일수도있다는", "일>수", "s͈u"),
        ("multilexnorm2026_1979", "했을시", "을>시", "s͈i"),
        ("dc_inside_2186", "보일거라", "일>거", "k͈ʌ"),
        ("dc_inside_2557", "안할듯", "할>듯", "t͈ɯ"),
    ]
    for source_row_id, input_word, pair, expected_ipa in cases:
        source_case = next(item for item in C08_CONTEXTS["cases"] if item["source_row_id"] == source_row_id)
        assert input_word in source_case["source_sentence"]
        safe_sentence = "".join(char for char in source_case["source_sentence"] if char.isspace() or "가" <= char <= "힣")
        result = transliterate_korean(safe_sentence)
        assert expected_ipa in result["ipa"]["ipa"]
        assert any(
            trace["rule_id"] == "R013"
            and trace["changed"]
            and trace["license_context"] == f"R013:adnominal_l:{input_word}:{pair}"
            for trace in result["phonetics"]["rules"]
        ), f"{source_row_id}: exact eojeol license must apply inside the full sentence"

    unresolved = next(item for item in C08_CONTEXTS["cases"] if item["source_row_id"] == "dc_inside_2024")
    assert "유사성" in unresolved["source_sentence"]
    source_sentence = unresolved["source_sentence"]
    # Python currently accepts precomposed Hangul syllables and whitespace only;
    # strip compatibility jamo/other UGC noise while preserving the target context.
    safe_sentence = "".join(char for char in source_sentence if char.isspace() or "가" <= char <= "힣")
    assert "유사성" in safe_sentence
    assert "없을듯" in safe_sentence
    result = transliterate_korean(safe_sentence)
    assert "업쓸뜯" in result["phonetics"]["surface_hangul"]
    assert any(
        trace["rule_id"] == "R002"
        and trace["changed"]
        and "R002:formal:없을듯:없>을" in trace["license_context"]
        for trace in result["phonetics"]["rules"]
    )
    assert any(
        trace["rule_id"] == "R013"
        and trace["changed"]
        and "R013:adnominal_l:없을듯:을>듯" in trace["license_context"]
        for trace in result["phonetics"]["rules"]
    )
    # This sentence also contains the independently licensed exact form 없을듯.
    # Its R013 trace must not be mistaken for evidence about 유사성.
    assert "유사성" in result["phonetics"]["surface_hangul"]
    assert "유사썽" not in result["phonetics"]["surface_hangul"]
    assert not any(
        trace["rule_id"] == "R013"
        and trace["changed"]
        and "유사성" in trace.get("license_context", "")
        for trace in result["phonetics"]["rules"]
    ), "the unresolved 유사성 context must not inherit a suffix-wide rule"
