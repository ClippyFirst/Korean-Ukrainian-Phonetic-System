from korean_ukrainian.phonology import parse_syllables
from korean_ukrainian.rules import apply_ordered_rules
from korean_ukrainian.ipa import realize_syllables

def test_complex_coda_is_structurally_preserved():
    assert parse_syllables("넋")[0].coda=="ㄳ"

def test_complex_coda_neutralizes():
    s=parse_syllables("넋"); apply_ordered_rules(s,["R001"]); assert s[0].coda=="ㄱ"

def test_complex_coda_ipa_is_supported():
    assert realize_syllables(parse_syllables("값"))["ipa"]=="kap̚"

def test_complex_coda_liaison_examples_require_formal_morpheme_evidence():
    expected={
        "넋이":("nʌk̚.s͈i","넋>이"),
        "값이":("kap̚.s͈i","값>이"),
        "앉아":("an.dʑa","앉>아"),
        "닭을":("tal.ɡɯl","닭>을"),
        "젊어":("tɕʌl.mʌ","젊>어"),
    }
    for word,(ipa,pair) in expected.items():
        items,traces=apply_ordered_rules(parse_syllables(word),["R002"])
        assert traces[0].status=="conditional-disabled"
        items,traces=apply_ordered_rules(
            parse_syllables(word),["R002"],
            rule_licenses={f"R002:formal:{word}:{pair}"},
        )
        assert realize_syllables(items)["ipa"]==ipa
        assert traces[0].changed

def test_complex_coda_assimilation_after_neutralization():
    for word,expected in {"긁는":("ㅇ","ㄴ"),"뚫네":("ㄹ","ㄹ"),"핥네":("ㄹ","ㄹ")}.items():
        items,_=apply_ordered_rules(parse_syllables(word),["R005","R006","R001"])
        assert (items[0].coda,items[1].onset)==expected

def test_coda_exception_does_not_cross_a_written_word_boundary():
    # The §10 밟-/넓- exception is contextual within the lexical form;
    # a consonant onset in the next whitespace-delimited word is not enough.
    across_boundary = parse_syllables("밟 사람")
    apply_ordered_rules(across_boundary, ["R001"], boundary_mode="phrase")
    assert across_boundary[0].coda == "ㄹ"

    within_word = parse_syllables("밟고")
    apply_ordered_rules(within_word, ["R001"], boundary_mode="phrase")
    assert within_word[0].coda == "ㅂ"
