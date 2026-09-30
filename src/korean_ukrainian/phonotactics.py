VALID_ONSETS=set("ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ")
VALID_CODAS=set("ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ")
INVALID_INDEPENDENT_CODA=set("ㄸㅃㅉㅎ")
def is_valid_onset(c): return c in VALID_ONSETS
def is_valid_coda(c): return c in VALID_CODAS and c not in INVALID_INDEPENDENT_CODA