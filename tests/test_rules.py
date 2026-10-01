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


def test_n_insertion():
    items,_=apply_ordered_rules(parse_syllables("한여름"),["R009"]); assert items[1].onset=="ㄴ"
