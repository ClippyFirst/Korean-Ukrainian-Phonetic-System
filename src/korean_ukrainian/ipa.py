from __future__ import annotations
from .phonology import Syllable, CONSONANT_PHONEMES, VOWEL_IPA, split_coda
FORTIS={"ㄲ":"k͈","ㄸ":"t͈","ㅃ":"p͈","ㅆ":"s͈","ㅉ":"tɕ͈"}
ASPIRATED={"ㅋ":"kʰ","ㅌ":"tʰ","ㅍ":"pʰ","ㅊ":"tɕʰ"}
LENIS={"ㄱ":"k","ㄷ":"t","ㅂ":"p","ㅅ":"s","ㅈ":"tɕ"}
CODA={"ㄱ":"k̚","ㄲ":"k̚","ㄳ":"k̚","ㄴ":"n","ㄵ":"n","ㄶ":"n","ㄷ":"t̚","ㄹ":"l","ㄺ":"k̚","ㄻ":"m","ㄼ":"l","ㄽ":"l","ㄾ":"l","ㄿ":"p̚","ㅀ":"l","ㅁ":"m","ㅂ":"p̚","ㅄ":"p̚","ㅅ":"t̚","ㅆ":"t̚","ㅇ":"ŋ","ㅈ":"t̚","ㅊ":"t̚","ㅋ":"k̚","ㅌ":"t̚","ㅍ":"p̚","ㅎ":"t̚"}

def onset_ipa(s:Syllable,index:int,items:list[Syllable],*,phonemic=False)->list[str]:
    c=s.onset
    if c=="ㅇ": return []
    if c in FORTIS: return [FORTIS[c] if not phonemic else CONSONANT_PHONEMES[c].strip("/")]
    if c in ASPIRATED: return [ASPIRATED[c] if not phonemic else CONSONANT_PHONEMES[c].strip("/")]
    if c=="ㄹ":
        # Surface ㄹ is [l] after a realized liquid coda (e.g. 신라, 칼날).
        if index>0 and items[index-1].coda=="ㄹ": return ["l"]
        return ["ɾ"]
    if c=="ㅎ": return ["h"]
    if c in LENIS:
        if phonemic: return [CONSONANT_PHONEMES[c].strip("/")]
        if c in {"ㄱ","ㄷ","ㅂ","ㅈ"} and index>0:
            previous=items[index-1]
            # Broad surface voicing of lenis stops after a vowel or sonorant.
            # ㅈ is represented as [dʑ] in the same environment.
            if previous.coda=="" or previous.coda in {"ㄴ","ㄹ","ㅁ","ㅇ"}:
                voiced={"ㄱ":"ɡ","ㄷ":"d","ㅂ":"b","ㅈ":"dʑ"}
                return [voiced[c]]
        return [LENIS[c]]
    return [CONSONANT_PHONEMES[c].strip("/")]

def nucleus_ipa(s:Syllable,*,phonemic=False)->list[str]:
    # Korean standard pronunciation: ㅢ in a syllable with a consonant
    # onset is realized as [i]. Keep the underlying /ɰi/ at the phonemic
    # level; ㅇ+ㅢ remains lexically/morphologically ambiguous.
    if s.nucleus=="ㅢ" and s.onset!="ㅇ" and not phonemic:
        return ["i"]
    return [VOWEL_IPA[s.nucleus][0]]

def coda_ipa(coda:str,*,phonemic=False)->list[str]:
    if not coda:return []
    if phonemic:return [CONSONANT_PHONEMES[c].strip("/") for c in split_coda(coda)]
    return [CODA[coda]] if coda in CODA else [CODA[c] for c in split_coda(coda)]

def render_syllable_sequence(items:list[Syllable],rendered:list[str])->str:
    ipa=rendered[0] if rendered else ""
    for i in range(1,len(rendered)):
        separator=" " if items[i-1].boundary_after=="word" else "."
        ipa+=separator+rendered[i]
    return ipa

def generate_vowel_variants(items:list[Syllable],rendered:list[str],*,level="broad")->list[dict]:
    if level!="broad":
        return []
    sites=[]
    for i,syllable in enumerate(items):
        options=VOWEL_IPA.get(syllable.nucleus,[])
        if syllable.nucleus not in {"ㅚ","ㅟ"} or len(options)<2:
            continue
        primary,alternate=options[0],options[1]
        if primary in rendered[i]:
            sites.append((i,syllable.nucleus,primary,alternate))
    if not sites:
        return []
    # Enumerate all readings for up to three optional vowels. Longer input
    # receives each local alternative independently to prevent exponential growth.
    masks=range(1,(1<<len(sites))) if len(sites)<=3 else (1<<i for i in range(len(sites)))
    variants=[]
    for mask in masks:
        changed=[site for i,site in enumerate(sites) if mask&(1<<i)]
        alternate=list(rendered)
        for index,vowel,primary,form in changed:
            alternate[index]=alternate[index].replace(primary,form,1)
        labels=[f"{vowel} [{form}]" for _,vowel,_,form in changed]
        note=("NIKL §4 permits this diphthongal reading; Korean spelling is unchanged."
              if len(sites)<=3 else
              "NIKL §4 permits this local alternate; other optional vowels keep the primary reading.")
        variants.append({
            "syllable_indices":[index for index,_,_,_ in changed],
            "ipa":render_syllable_sequence(items,alternate),
            "note":note,
            "vowels":labels,
        })
    return variants

def realize_syllables(items:list[Syllable],*,level="broad")->dict:
    if level not in {"phonemic","broad","narrow"}: raise ValueError("level must be phonemic, broad, or narrow")
    if level=="narrow":
        raise ValueError("narrow IPA is unavailable: repository has no acoustic/allophonic model supporting a defensible narrow transcription")
    phonemic=level=="phonemic"
    rendered=["".join(onset_ipa(s,i,items,phonemic=phonemic)+nucleus_ipa(s,phonemic=phonemic)+coda_ipa(s.coda,phonemic=phonemic)) for i,s in enumerate(items)]
    ipa=render_syllable_sequence(items,rendered)
    return {
        "level":level,
        "ipa":ipa,
        "syllables":rendered,
        "variants":generate_vowel_variants(items,rendered,level=level),
        "status":"phonemic" if phonemic else "rule-supported-broad"
    }
