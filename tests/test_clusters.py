from korean_ukrainian.phonology import parse_syllables
from korean_ukrainian.rules import apply_ordered_rules
from korean_ukrainian.ipa import realize_syllables
def test_complex_coda_is_structurally_preserved(): assert parse_syllables("넋")[0].coda=="ㄳ"
def test_complex_coda_neutralizes():
    s=parse_syllables("넋"); apply_ordered_rules(s,["R001"]); assert s[0].coda=="ㄱ"
def test_complex_coda_ipa_is_supported(): assert realize_syllables(parse_syllables("값"))["ipa"]=="kap̚"
