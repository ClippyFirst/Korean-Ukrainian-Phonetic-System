L_BASE=0x1100
V_BASE=0x1161
T_BASE=0x11A7
S_BASE=0xAC00
N_V=21
N_T=28
N_S=11172

def decompose_hangul(syllable):
    if len(syllable)!=1 or not S_BASE<=ord(syllable)<S_BASE+N_S: raise ValueError("not a modern precomposed Hangul syllable")
    i=ord(syllable)-S_BASE; l=i//(N_V*N_T); v=(i%(N_V*N_T))//N_T; t=i%N_T
    return {"syllable":syllable,"L":l,"V":v,"T":t,"has_coda":t!=0}

def compose_hangul(parts):
    l,v,t=parts["L"],parts["V"],parts.get("T",0)
    if not(0<=l<19 and 0<=v<21 and 0<=t<28): raise ValueError("invalid Hangul indices")
    return chr(S_BASE+(l*21+v)*28+t)

def generate_syllables():
    return [{"syllable":compose_hangul({"L":l,"V":v,"T":t}),"codepoint":f"U+{ord(compose_hangul({'L':l,'V':v,'T':t})):04X}","L":l,"V":v,"T":t} for l in range(19) for v in range(21) for t in range(28)]