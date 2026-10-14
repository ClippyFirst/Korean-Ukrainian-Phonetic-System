"""Regression: tokenize_ipa must accept all segments that realize_syllables / lexicon can emit."""
from korean_ukrainian.pipeline import tokenize_ipa, source_features_for_ipa, phoneticize_korean, transliterate_korean

def test_tokenize_fortis_and_voiced():
    cases = [
        ("s͈ʌ", ["s͈", "ʌ"]),
        ("ɕ͈i", ["ɕ͈", "i"]),
        ("dʑi", ["dʑ", "i"]),
        ("p͈i", ["p͈", "i"]),
        ("tɕ͈a", ["tɕ͈", "a"]),
        ("hɛt̚.p͈i.tɕʰi", ["h", "ɛ", "t", "p͈", "i", "tɕʰ", "i"]),
        ("na.dʑi", ["n", "a", "dʑ", "i"]),
        ("sʌl.mjʌŋ.he.s͈ʌ.jo", ["s", "ʌ", "l", "m", "j", "ʌ", "ŋ", "h", "e", "s͈", "ʌ", "j", "o"]),
        ("kap̚.ɕ͈i", ["k", "a", "p", "ɕ͈", "i"]),
        ("tɛː.toŋ.ɲʌŋ", ["t", "ɛ", "t", "o", "ŋ", "ɲ", "ʌ", "ŋ"]),
        ("pe.gɛn.nit̚", ["p", "e", "ɡ", "ɛ", "n", "n", "i", "t"]),  # ASCII g normalized
        ("pe.ɡɛn.nit̚", ["p", "e", "ɡ", "ɛ", "n", "n", "i", "t"]),
    ]
    for ipa, expected in cases:
        assert tokenize_ipa(ipa) == expected, (ipa, tokenize_ipa(ipa))

def test_features_voiced_and_fortis():
    assert source_features_for_ipa("dʑ")["voice"] == "1"
    assert source_features_for_ipa("dʑ")["affricate"] == "1"
    assert source_features_for_ipa("dʑ")["palatal"] == "1"
    assert source_features_for_ipa("ɡ")["voice"] == "1"
    assert source_features_for_ipa("g")["voice"] == "1"  # ASCII alias
    assert source_features_for_ipa("s͈")["continuant"] == "1"
    assert source_features_for_ipa("ɕ͈")["palatalized"] == "1"
    assert source_features_for_ipa("ɲ")["nasal"] == "1"
    assert source_features_for_ipa("ɲ")["palatal"] == "1"

def test_end_to_end_no_crash():
    for text in ["낮이", "설명했어요", "값이", "넋이", "햇빛이", "있어", "신라",
                 "대통령", "베갯잇", "숲이", "의사", "의의", "국밥만"]:
        r = phoneticize_korean(text)
        assert "ipa" in r
        transliterate_korean(text)

if __name__ == "__main__":
    test_tokenize_fortis_and_voiced()
    test_features_voiced_and_fortis()
    test_end_to_end_no_crash()
    print("all ok")
