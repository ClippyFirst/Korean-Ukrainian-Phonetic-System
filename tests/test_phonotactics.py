from korean_ukrainian.phonotactics import is_valid_onset,is_valid_coda
def test_basic_phonotactics():
    assert is_valid_onset("ㄱ"); assert is_valid_coda("ㄱ"); assert not is_valid_coda("ㄸ")