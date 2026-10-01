from korean_ukrainian.hangul import compose_hangul,decompose_hangul
def test_compose_decompose_roundtrip():
    for s in ("가","각","한","힣"): assert compose_hangul(decompose_hangul(s))==s
def test_canonical_decomposition_is_exposed():
    d=decompose_hangul("각")
    assert d["canonical_jamo"]==["ᄀ","ᅡ","ᆨ"]
    assert d["canonical_decomposition"]==["U+1100","U+1161","U+11A8"]
def test_invalid_hangul_rejected():
    import pytest
    with pytest.raises(ValueError): decompose_hangul("A")
