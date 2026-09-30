from __future__ import annotations
from .phonology import Syllable, CONSONANT_PHONEMES, VOWEL_IPA
FORTIS={"ㄲ":"k͈","ㄸ":"t͈","ㅃ":"p͈","ㅆ":"s͈","ㅉ":"tɕ͈"}
ASPIRATED={"ㅋ":"kʰ","ㅌ":"tʰ","ㅍ":"pʰ","ㅊ":"tɕʰ"}
LENIS={"ㄱ":"k","ㄷ":"t","ㅂ":"p","ㅅ":"s","ㅈ":"tɕ"}

def onset_ipa(s:Syllable,index:int,items:list[Syllable])->list[str]:
    c=s.onset
    if c=="ㅇ": return []
    if c in FORTIS: return [FORTIS[c]]
    if c in ASPIRATED: return [ASPIRATED[c]]
    if c=="ㄹ": return ["ɾ"]
    if c=="ㅎ": return ["h"]
    if c in LENIS:
        if c in {"ㄱ","ㄷ","ㅂ"} and index>0 and items[index-1].coda=="":
            return [{"ㄱ":"ɡ","ㄷ":"d","ㅂ":"b"}[c]]
        return [LENIS[c]]
    return [CONSONANT_PHONEMES[c].strip("/")]
def nucleus_ipa(s:Syllable)->list[str]: return VOWEL_IPA[s.nucleus]
def coda_ipa(coda:str)->list[str]:
    if not coda:return []
    m={"ㄱ":"k̚","ㄲ":"k̚","ㄴ":"n","ㄷ":"t̚","ㄹ":"l","ㅁ":"m","ㅂ":"p̚","ㅅ":"t̚","ㅆ":"t̚","ㅇ":"ŋ","ㅈ":"t̚","ㅊ":"t̚","ㅋ":"k̚","ㅌ":"t̚","ㅍ":"p̚","ㅎ":"t̚"}
    return [m.get(x,x) for x in coda]
def realize_syllables(items:list[Syllable],*,level="broad")->dict:
    if level not in {"phonemic","broad","narrow"}: raise ValueError("level must be phonemic, broad, or narrow")
    syllables=[onset_ipa(s,i,items)+nucleus_ipa(s)+coda_ipa(s.coda) for i,s in enumerate(items)]
    rendered=["".join(x) for x in syllables]
    return {"level":level,"ipa":".".join(rendered),"syllables":rendered,"status":"rule-supported segmental realization"}
