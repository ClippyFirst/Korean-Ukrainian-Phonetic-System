"""Regression: tokenize_ipa must accept all segments that realize_syllables can emit."""
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
    ]
    for ipa, expected in cases:
        assert tokenize_ipa(ipa) == expected, (ipa, tokenize_ipa(ipa))

def test_features_voiced_and_fortis():
    assert source_features_for_ipa("dʑ")["voice"] == "1"
    assert source_features_for_ipa("dʑ")["affricate"] == "1"
    assert source_features_for_ipa("dʑ")["palatal"] == "1"
    assert source_features_for_ipa("ɡ")["voice"] == "1"
    assert source_features_for_ipa("s͈")["continuant"] == "1"
    assert source_features_for_ipa("ɕ͈")["palatalized"] == "1"

def test_end_to_end_no_crash():
    for text in ["낮이", "설명했어요", "값이", "넋이", "햇빛이", "있어", "신라"]:
        r = phoneticize_korean(text)
        assert "ipa" in r
        # transliterate may return None orthography without UPI, but must not raise
        transliterate_korean(text)

if __name__ == "__main__":
    test_tokenize_fortis_and_voiced()
    test_features_voiced_and_fortis()
    test_end_to_end_no_crash()
    print("all ok")
