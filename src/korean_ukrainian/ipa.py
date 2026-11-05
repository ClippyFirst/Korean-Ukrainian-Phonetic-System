from __future__ import annotations
from .phonology import Syllable, CONSONANT_PHONEMES, VOWEL_IPA, split_coda
FORTIS={"ㄲ":"k͈","ㄸ":"t͈","ㅃ":"p͈","ㅆ":"s͈","ㅉ":"tɕ͈"}
ASPIRATED={"ㅋ":"kʰ","ㅌ":"tʰ","ㅍ":"pʰ","ㅊ":"tɕʰ"}
LENIS={"ㄱ":"k","ㄷ":"t","ㅂ":"p","ㅅ":"s","ㅈ":"tɕ"}
# Partial narrow profile: lenis /s/ is modeled as aspirated [sʰ], with a
# conservative [ɕʰ] candidate only before /i, ye, ya/ (ㅣ, ㅖ, ㅑ).
# Kang (2010) reports acoustic palatalization/coarticulation in those contexts;
# /yu, yo/ have a distinct spectral pattern. This is not a categorical rule.
# https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001444770
_NARROW_HIGH_FRONT_SIBILANT_NUCLEI={"ㅣ","ㅖ","ㅑ"}
# The research-only narrow profile models onset /n/ palatalization before
# glide-initial nuclei. Keep /i/ out: the dev counterfactual regressed when /i/
# was included, so the observed /j/ correspondence must not be generalized.
# Sources: Ahn (2009) on palatalized /n/ before [j]; Lee (1996), summarized in
# the UCL Korean phonetics thesis, describes [nʲ]/[ɲ] before /j/.
_NARROW_PALATALIZED_NASAL_GLIDE_NUCLEI={"ㅑ","ㅒ","ㅕ","ㅖ","ㅛ","ㅠ"}
CODA={"ㄱ":"k̚","ㄲ":"k̚","ㄳ":"k̚","ㄴ":"n","ㄵ":"n","ㄶ":"n","ㄷ":"t̚","ㄹ":"l","ㄺ":"k̚","ㄻ":"m","ㄼ":"l","ㄽ":"l","ㄾ":"l","ㄿ":"p̚","ㅀ":"l","ㅁ":"m","ㅂ":"p̚","ㅄ":"p̚","ㅅ":"t̚","ㅆ":"t̚","ㅇ":"ŋ","ㅈ":"t̚","ㅊ":"t̚","ㅋ":"k̚","ㅌ":"t̚","ㅍ":"p̚","ㅎ":"t̚"}

def onset_ipa(s:Syllable,index:int,items:list[Syllable],*,phonemic=False,level="broad")->list[str]:
    c=s.onset
    if c=="ㅇ": return []
    if not phonemic and level=="narrow" and c=="ㄴ" and s.nucleus in _NARROW_PALATALIZED_NASAL_GLIDE_NUCLEI:
        return ["ɲ"]
    if not phonemic and level=="narrow" and c=="ㅅ":
        return ["ɕʰ" if s.nucleus in _NARROW_HIGH_FRONT_SIBILANT_NUCLEI else "sʰ"]
    if c in FORTIS: return [FORTIS[c] if not phonemic else CONSONANT_PHONEMES[c].strip("/")]
    if c in ASPIRATED: return [ASPIRATED[c] if not phonemic else CONSONANT_PHONEMES[c].strip("/")]
    if c=="ㄹ":
        # Surface ㄹ is [l] after a realized liquid coda (e.g. 신라, 칼날).
        if index>0 and items[index-1].coda=="ㄹ": return ["l"]
        if not phonemic and level=="narrow" and index>0:
            previous=items[index-1]
            same_word=previous.boundary_after!="word"
            if same_word and (previous.coda=="" or s.nucleus in {"ㅣ","ㅑ","ㅒ","ㅕ","ㅖ","ㅛ","ㅠ"}):
                return ["ɭ"]
        return ["ɾ"]
    if c=="ㅎ":
        if not phonemic and level=="narrow":
            # Source-scoped Seoul allophones from S018: [ç] before /i,j/ and [x] before /u/.
            # The optional post-sonorant [ɦ] candidate has priority in that
            # environment; none of these narrow details enter broad/phonemic IPA.
            if index>0:
                previous=items[index-1]
                if previous.boundary_after!="word" and previous.coda in {"ㄴ","ㄹ","ㅁ","ㅇ"}:
                    return ["ɦ"]
            if s.nucleus in {"ㅣ","ㅑ","ㅒ","ㅕ","ㅖ","ㅛ","ㅠ"}:
                return ["ç"]
            if s.nucleus=="ㅜ":
                return ["x"]
            # S018 describes /h/ as [ɸ] between voiced sounds. In this
            # syllabic representation that is the same-word intervocalic case.
            if index>0:
                previous=items[index-1]
                if previous.boundary_after!="word" and previous.coda=="":
                    return ["ɸ"]
        return ["h"]
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
    # NIKL Standard Pronunciation Rule 5, exception 1:
    # https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
    # verbal forms with 져/쪄/쳐 are [저/쩌/처]. The official explanation
    # attributes this to the restriction against [j] immediately after the
    # palatal affricates ㅈ/ㅉ/ㅊ. Keep the glide in phonemic mode; absorb it
    # only in the broad surface-IPA representation.
    if not phonemic and s.nucleus=="ㅕ" and s.onset in {"ㅈ","ㅉ","ㅊ"}:
        return ["ʌ"]
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
        if syllable.nucleus in {"ㅚ","ㅟ"}:
            options=VOWEL_IPA.get(syllable.nucleus,[])
            if len(options)<2:
                continue
            primary,alternate=options[0],options[1]
            section="§4"
        elif syllable.nucleus=="ㅖ" and syllable.onset not in {"ㅇ","ㄹ"}:
            primary,alternate="je","e"
            section="§5"
        elif (syllable.nucleus=="ㅢ" and syllable.onset=="ㅇ" and i>0
              and items[i-1].boundary_after!="word"):
            primary,alternate="ɰi","i"
            section="§5"
        else:
            continue
        if primary in rendered[i]:
            sites.append((i,syllable.nucleus,primary,alternate,section))
    variants=[]
    if sites:
        # Enumerate all readings for up to three optional vowels. Longer input
        # receives each local alternative independently to prevent exponential growth.
        masks=range(1,(1<<len(sites))) if len(sites)<=3 else (1<<i for i in range(len(sites)))
        for mask in masks:
            changed=[site for i,site in enumerate(sites) if mask&(1<<i)]
            alternate=list(rendered)
            for index,vowel,primary,form,_ in changed:
                alternate[index]=alternate[index].replace(primary,form,1)
            labels=[f"{vowel} [{form}]" for _,vowel,_,form,_ in changed]
            sections="/".join(dict.fromkeys(section for *_,section in changed))
            note=(f"NIKL {sections} permits this alternate; Korean spelling is unchanged."
                  if len(sites)<=3 else
                  f"NIKL {sections} permits this local alternate; other optional vowels keep the primary reading.")
            variants.append({
                "syllable_indices":[index for index,_,_,_,_ in changed],
                "ipa":render_syllable_sequence(items,alternate),
                "note":note,
                "vowels":labels,
            })

    # S020 documents /ɥi/ alongside /wi/ and monophthongized [y] for
    # Korean ㅟ. Keep [y] canonical and expose [ɥi] as an additional reading.
    for i,syllable in enumerate(items):
        if syllable.nucleus=="ㅟ" and "y" in rendered[i]:
            alternate=list(rendered)
            alternate[i]=alternate[i].replace("y","ɥi",1)
            variants.append({
                "syllable_indices":[i],
                "ipa":render_syllable_sequence(items,alternate),
                "note":"Korean ㅟ may be realized as [ɥi] in phonetic descriptions; canonical [y] and the existing [wi] variant are retained.",
                "vowels":["ㅟ [ɥi]"],
            })

    # Seoul /h/ has optional [ç] before /i,j/ and [x] before /u/ (S018).
    # Keep broad /h/ canonical; expose these as source-scoped variants only.
    for i,syllable in enumerate(items):
        alternate_initial = (
            "ç" if syllable.nucleus in {"ㅣ","ㅑ","ㅒ","ㅕ","ㅖ","ㅛ","ㅠ"}
            else "x" if syllable.nucleus=="ㅜ" else ""
        )
        if syllable.onset=="ㅎ" and alternate_initial and rendered[i].startswith("h"):
            alternate=list(rendered)
            alternate[i]=alternate_initial+alternate[i][1:]
            variants.append({
                "syllable_indices":[i],
                "ipa":render_syllable_sequence(items,alternate),
                "note":f"Optional Seoul Korean /h/ allophone [{alternate_initial}] in this vowel context; broad canonical [h] is preserved.",
                "vowels":[f"ㅎ [{alternate_initial}]"],
            })

    # Research-only lenis /s/ [ɕ] candidate: Kang (2010) reports acoustic
    # palatalization/coarticulation before /i, ye, ya/ (ㅣ, ㅖ, ㅑ).
    # /yu, yo/ show a distinct spectral pattern; no other /j/ context is
    # inferred. Lee (1993, p.31) classifies its /s/ as fortis, so it is not
    # evidence for lenis /s/; retain Lee only for the separately scoped
    # Seoul /h/ and /l/ allophones. Broad canonical [s] remains unchanged.
    palatal_sibilant_nuclei={"ㅣ","ㅑ","ㅖ"}
    for i,syllable in enumerate(items):
        if syllable.onset=="ㅅ" and syllable.nucleus in palatal_sibilant_nuclei and rendered[i].startswith("s"):
            alternate=list(rendered)
            alternate[i]="ɕ"+alternate[i][1:]
            variants.append({
                "syllable_indices":[i],
                "ipa":render_syllable_sequence(items,alternate),
                "note":"Research-only optional [ɕ] candidate for lenis /s/ before /i, ye, ya/ (S019, Kang 2010); acoustic coarticulation evidence, not a categorical rule. Broad canonical [s] is preserved.",
                "vowels":["ㅅ [ɕ]"],
            })
    # S018: /h/ may be [ɸ] between voiced sounds. Here this is a
    # same-word intervocalic ㅎ onset; canonical broad [h] is preserved.
    for i,syllable in enumerate(items):
        if i>0 and syllable.onset=="ㅎ" and rendered[i].startswith("h"):
            previous=items[i-1]
            if previous.boundary_after!="word" and previous.coda=="":
                alternate=list(rendered)
                alternate[i]="ɸ"+alternate[i][1:]
                variants.append({
                    "syllable_indices":[i-1,i],
                    "ipa":render_syllable_sequence(items,alternate),
                    "note":"Optional Seoul Korean [ɸ] for /h/ between voiced sounds (S018); canonical broad [h] is preserved.",
                    "vowels":["ㅎ [ɸ] intervocalic"],
                })

    # S018 describes Seoul /l/ as [ɭ] intervocalically and before /i,j/.
    # Keep the broad /ɾ/ or /l/ realization canonical; expose a local variant.
    palatal_liquid_nuclei={"ㅣ","ㅑ","ㅒ","ㅕ","ㅖ","ㅛ","ㅠ"}
    for i,syllable in enumerate(items):
        if syllable.onset!="ㄹ" or not rendered[i].startswith(("ɾ","l")):
            continue
        same_word_predecessor=i>0 and items[i-1].boundary_after!="word"
        after_liquid_coda=same_word_predecessor and items[i-1].coda=="ㄹ"
        intervocalic=same_word_predecessor and items[i-1].coda==""
        before_front_glide=same_word_predecessor and syllable.nucleus in palatal_liquid_nuclei
        if after_liquid_coda or not (intervocalic or before_front_glide):
            continue
        alternate=list(rendered)
        alternate[i]="ɭ"+alternate[i][1:]
        variants.append({
            "syllable_indices":[i],
            "ipa":render_syllable_sequence(items,alternate),
            "note":"Optional Seoul Korean [ɭ] for /l/ intervocalically or before /i,j/ (S018); broad canonical liquid is preserved.",
            "vowels":["ㄹ [ɭ]"],
        })

    return variants

def realize_syllables(items:list[Syllable],*,level="broad")->dict:
    if level not in {"phonemic","broad","narrow"}: raise ValueError("level must be phonemic, broad, or narrow")
    phonemic=level=="phonemic"
    rendered=["".join(onset_ipa(s,i,items,phonemic=phonemic,level=level)+nucleus_ipa(s,phonemic=phonemic)+coda_ipa(s.coda,phonemic=phonemic)) for i,s in enumerate(items)]
    ipa=render_syllable_sequence(items,rendered)
    profile_ids={
        "phonemic":"clippyfirst-korean-phonemic-v1",
        "broad":"clippyfirst-korean-broad-v1",
        "narrow":"clippyfirst-korean-narrow-contextual-allophones-v5",
    }
    result={
        "level":level,
        "ipa_profile":profile_ids[level],
        "ipa_profile_version":5 if level=="narrow" else 1,
        "ipa_profile_level":level,
        "ipa_profile_status":(
            "partial-research-only" if level=="narrow"
            else "unadjudicated-cross-runtime"
        ),
        "ipa":ipa,
        "syllables":rendered,
        "variants":generate_vowel_variants(items,rendered,level=level),
        "status":"phonemic" if phonemic else ("rule-supported-broad" if level=="broad" else "partial-narrow-research-profile"),
        "realization_status":"phonemic" if phonemic else ("rule-supported-broad" if level=="broad" else "partial-narrow-research-profile"),
    }
    if level=="narrow":
        result["transcription_profile"]={
            "name":"korean-narrow-contextual-allophones-v5",
            "scope":["aspiration of lenis ㅅ as [sʰ]","palatalized [ɕʰ] candidate before ㅣ, ㅖ, ㅑ (Kang 2010; partial narrow profile)","palatalized [ɲ] for onset ㄴ before glide nuclei ㅑ, ㅒ, ㅕ, ㅖ, ㅛ, ㅠ; not generalized to ㅣ","ㅎ is [ç] before selected high-front/glide nuclei and [x] before ㅜ, following the cited Seoul description","after a same-word sonorant coda, /h/ is rendered [ɦ] as one narrow-profile variant; no deletion is inferred","same-word intervocalic ㅎ may be [ɸ] and ㄹ may be [ɭ] intervocalically or before /i,j/ (S018)","tense ㅆ remains [s͈]; its palatalization is not assumed because evidence is mixed"],
            "sources":[
                "Lee, Hyun Bok (1993), Korean, Illustrations of the IPA: /h/ [ç] before /i,j/ and [x] before /u/; /s/ is classified as fortis in this description: https://doi.org/10.1017/S0025100300004758",
                "Kang, Hyunsook (2010), Coarticulation effects of Korean sibilant /s/ before a high front segment: https://doi.org/10.17959/sppm.2010.16.1.3",
                "Kim, Young Shin (2011), UCL PhD thesis, diphthong /ɥi/ and its [ɥi], [ø], [y] realizations: https://discovery.ucl.ac.uk/id/eprint/1324541/1/1324541.pdf",
                "Cho, Jun & Ladefoged (2002), via High-toned [il] in Korean: https://www.sciencedirect.com/science/article/pii/S0095447015000339",
                "Kang (2010), Coarticulation effects of Korean sibilant /s/ before a high front segment: https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001444770",
                "Ahn (2009), Korean /n/-deletion: phonetic initial strengthening to denasalization: https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001340886",
                "Lee (1996), Korean Phonetics, summarized in the UCL thesis: https://discovery.ucl.ac.uk/1324541/1/1324541.pdf",
                "Kang & Lee (2019), The Realizations of /h/ in Seoul and Gwangju Koreans: https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002495941",
                "Eom (2014), Phonetic realizations of /h/ after a sonorant in Korean: https://doi.org/10.17959/sppm.2014.20.3.357",
            ],
            "limitations":["partial profile, not a complete narrow transcription","models [ç], [x], [ɸ], and [ɭ] in the cited Seoul contexts, plus one optional [ɦ] variant after a same-word sonorant coda; does not model /h/ deletion, dialectal probabilities, the full lateral allophone inventory, or prosody","the [ɲ] choice before /j/-initial nuclei is a research-profile generalization; do not treat it as universal speaker-independent output","does not force palatalization of tense /s͈/ because the available literature reports variation and disagreement","research-only profile; do not treat as approved Ukrainian target input without target-inventory review"],
            "target_compatible":False,
        }
    return result
