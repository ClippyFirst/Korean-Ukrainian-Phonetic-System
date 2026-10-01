from korean_ukrainian.pipeline import transliterate_korean, tokenize_ipa

def test_end_to_end_preserves_layers():
    out=transliterate_korean("국밥")
    assert out["phonology"]["syllables"] and out["ipa"]["ipa"] and out["score_type"]=="heuristic_cost"

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
    assert items[1].index==1 and items[0].boundary_after=="word"
