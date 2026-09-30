from korean_ukrainian.hangul import compose_hangul,decompose_hangul
def test_compose_decompose_roundtrip():
    for s in ("가","각","한","힣"): assert compose_hangul(decompose_hangul(s))==s
def test_invalid_hangul_rejected():
    import pytest
    with pytest.raises(ValueError): decompose_hangul("A")