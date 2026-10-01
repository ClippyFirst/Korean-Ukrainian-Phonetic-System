from __future__ import annotations
from dataclasses import dataclass, asdict
from .hangul import decompose_hangul

L_JAMO = tuple("ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ")
V_JAMO = tuple("ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ")
T_JAMO = ("","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ")
CONSONANT_PHONEMES = {"ㄱ":"/k/","ㄲ":"/k͈/","ㄴ":"/n/","ㄷ":"/t/","ㄸ":"/t͈/","ㄹ":"/ɾ/","ㅁ":"/m/","ㅂ":"/p/","ㅃ":"/p͈/","ㅅ":"/s/","ㅆ":"/s͈/","ㅇ":"/ŋ/","ㅈ":"/tɕ/","ㅉ":"/tɕ͈/","ㅊ":"/tɕʰ/","ㅋ":"/kʰ/","ㅌ":"/tʰ/","ㅍ":"/pʰ/","ㅎ":"/h/"}
VOWEL_IPA = {"ㅏ":["a"],"ㅐ":["ɛ"],"ㅑ":["ja"],"ㅒ":["jɛ"],"ㅓ":["ʌ"],"ㅔ":["e"],"ㅕ":["jʌ"],"ㅖ":["je"],"ㅗ":["o"],"ㅘ":["wa"],"ㅙ":["wɛ"],"ㅚ":["ø","we"],"ㅛ":["jo"],"ㅜ":["u"],"ㅝ":["wʌ"],"ㅞ":["we"],"ㅟ":["y","wi"],"ㅠ":["ju"],"ㅡ":["ɯ"],"ㅢ":["ɰi","ɯi"],"ㅣ":["i"]}

@dataclass
class Syllable:
    text:str; index:int; L:int; V:int; T:int; onset:str; nucleus:str; coda:str; boundary_after:str="unknown"
    def to_dict(self): return asdict(self)

def parse_syllables(text:str)->list[Syllable]:
    result=[]
    for i,ch in enumerate(text):
        if not ("가"<=ch<="힣"): raise ValueError(f"unsupported non-Hangul character at index {i}: {ch!r}")
        d=decompose_hangul(ch)
        result.append(Syllable(ch,i,d["L"],d["V"],d["T"],L_JAMO[d["L"]],V_JAMO[d["V"]],T_JAMO[d["T"]]))
    return result

def split_coda(coda:str)->tuple[str,...]:
    return tuple(coda) if coda else ()

def phonemic_segments(s:Syllable)->dict:
    onset=None if s.onset=="ㅇ" else CONSONANT_PHONEMES[s.onset]
    nucleus=VOWEL_IPA[s.nucleus][0]
    coda=[CONSONANT_PHONEMES[c] for c in split_coda(s.coda)]
    return {"onset":onset,"nucleus":nucleus,"coda":coda}
