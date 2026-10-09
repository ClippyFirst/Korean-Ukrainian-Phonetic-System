import pytest
from korean_ukrainian.pipeline import phoneticize_korean

def test_basic_broad_ipa(): assert phoneticize_korean("가")["ipa"]["ipa"]=="ka"
def test_intervocalic_lenis_voicing(): assert "ɡ" in phoneticize_korean("아가")["ipa"]["ipa"]
def test_ipa_level_is_explicit(): assert phoneticize_korean("가",ipa_level="phonemic")["ipa"]["level"]=="phonemic"
def test_narrow_ipa_is_explicitly_unavailable():
    with pytest.raises(ValueError,match="narrow IPA is unavailable"):
        phoneticize_korean("가",ipa_level="narrow")


def test_broad_ipa_voicing_after_sonorant():
    result = phoneticize_korean("현대")["ipa"]["ipa"]
    assert "d" in result

def test_broad_ipa_voicing_of_jieut_after_vowel():
    result = phoneticize_korean("표준")["ipa"]["ipa"]
    assert "dʑ" in result


def test_complex_coda_components_are_explicit_in_phonemic_ipa():
    from korean_ukrainian.phonology import split_coda
    assert split_coda("ㄳ") == ("ㄱ", "ㅅ")
    assert split_coda("ㄶ") == ("ㄴ", "ㅎ")
    result = phoneticize_korean("넋", ipa_level="phonemic")["ipa"]["ipa"]
    assert "k" in result and "s" in result
