def validate_generated_syllables(rows):
    assert len(rows)==11172
    assert rows[0]["syllable"]=="가" and rows[-1]["syllable"]=="힣"
    assert len({r["codepoint"] for r in rows})==11172
    return True
