from korean_ukrainian.pipeline import phoneticize_korean

def test_basic_broad_ipa(): assert phoneticize_korean("가")["ipa"]["ipa"]=="ka"

def test_intervocalic_lenis_voicing(): assert "ɡ" in phoneticize_korean("아가")["ipa"]["ipa"]

def test_ipa_level_is_explicit():
    result=phoneticize_korean("가",ipa_level="narrow")
    assert result["ipa"]["level"]=="narrow"

def test_narrow_label_is_not_acoustic_claim():
    assert phoneticize_korean("가",ipa_level="narrow")["ipa"]["status"]=="narrow"
