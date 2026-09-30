from korean_ukrainian.hangul import generate_syllables
def test_modern_hangul_has_11172_blocks():
    rows=generate_syllables(); assert len(rows)==11172; assert rows[0]["syllable"]=="가"; assert rows[-1]["syllable"]=="힣"; assert len({r["codepoint"] for r in rows})==11172