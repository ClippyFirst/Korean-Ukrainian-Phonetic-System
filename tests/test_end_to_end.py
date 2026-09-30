from korean_ukrainian.pipeline import transliterate_korean
def test_end_to_end_preserves_layers():
    out=transliterate_korean("국밥"); assert out["phonology"]["syllables"] and out["ipa"]["ipa"] and out["score_type"]=="heuristic_cost"
