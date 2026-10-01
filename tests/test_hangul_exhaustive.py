from korean_ukrainian.hangul import generate_syllables,compose_hangul,decompose_hangul
def test_exact_modern_hangul_count():
    rows=generate_syllables(); assert len(rows)==11172; assert rows[0]["syllable"]=="가"; assert rows[-1]["syllable"]=="힣"
def test_round_trip_all_modern_syllables():
    for row in generate_syllables(): assert compose_hangul(decompose_hangul(row["syllable"]))==row["syllable"]
