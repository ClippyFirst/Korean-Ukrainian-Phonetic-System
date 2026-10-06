from korean_ukrainian.phonology import parse_syllables
from korean_ukrainian.rules import apply_ordered_rules

def test_final_neutralization():
    items,traces=apply_ordered_rules(parse_syllables("낫"),["R001"]); assert items[0].coda=="ㄷ" and traces[0].changed

def test_nasal_assimilation():
    items,_=apply_ordered_rules(parse_syllables("국민"),["R005"]); assert items[0].coda=="ㅇ"

def test_liquidization():
    items,_=apply_ordered_rules(parse_syllables("신라"),["R006"]); assert items[0].coda=="ㄹ" and items[1].onset=="ㄹ"

def test_palatalization():
    items,_=apply_ordered_rules(parse_syllables("굳이"),["R007"]); assert items[0].coda=="" and items[1].onset=="ㅈ"

def test_tensification():
    items,_=apply_ordered_rules(parse_syllables("국밥"),["R008"]); assert items[1].onset=="ㅃ"

def test_aspiration():
    items,_=apply_ordered_rules(parse_syllables("각하"),["R004"]); assert items[1].onset=="ㅋ"

def test_n_insertion_requires_license():
    items,_=apply_ordered_rules(parse_syllables("한여름"),["R009"],n_insertion_licensed=True); assert items[1].onset=="ㄴ"

def test_n_insertion_disabled_by_default():
    items,_=apply_ordered_rules(parse_syllables("한여름"),["R009"]); assert items[1].onset=="ㅇ"

def test_complex_coda_liaison():
    expected={"넋이":("ㄱ","ㅆ"),"값이":("ㅂ","ㅆ"),"앉아":("ㄴ","ㅈ"),"닭을":("ㄹ","ㄱ"),"젊어":("ㄹ","ㅁ")}
    for word,(coda,onset) in expected.items():
        items,_=apply_ordered_rules(parse_syllables(word),["R002"])
        assert items[0].coda==coda and items[1].onset==onset

def test_h_complex_coda_before_vowel():
    for word,expected in {"많아":"ㄴ","싫어":"ㄹ"}.items():
        items,_=apply_ordered_rules(parse_syllables(word),["R002","R003"])
        assert items[0].coda==expected


def test_liquid_assimilation_requires_surface_lateral_context():
    items,_=apply_ordered_rules(parse_syllables("신라"),["R006"])
    assert items[0].coda=="ㄹ" and items[1].onset=="ㄹ"

def test_balm_lexical_exception_before_consonant():
    items,_=apply_ordered_rules(parse_syllables("밟는"),["R009","R002","R003","R004","R005","R006","R007","R008","R001"])
    assert items[0].coda=="ㅁ"

def test_neolp_compound_lexical_exception():
    items,_=apply_ordered_rules(parse_syllables("넓죽하다"),["R009","R002","R003","R004","R005","R006","R007","R010","R011","R012","R013","R014","R015","R008","R001"])
    assert items[0].coda=="ㅂ" and items[1].onset=="ㅉ"
