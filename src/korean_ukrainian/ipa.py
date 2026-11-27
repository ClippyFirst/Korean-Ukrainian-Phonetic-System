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
# Evidence status: the UCL thesis summarizes earlier descriptions of [nʲ]/[ɲ]
# before /j/; Ahn (2009) is an initial /n/-deletion study, not direct evidence
# for a generalized [ɲ] allophone. Primary-source adjudication is still pending.
_NARROW_PALATALIZED_NASAL_GLIDE_NUCLEI={"ㅑ","ㅒ","ㅕ","ㅖ","ㅛ","ㅠ"}
# High-front vocoids for a research-only lateral coarticulation candidate.
_NARROW_HIGH_FRONT_VOCOID_NUCLEI={"ㅣ","ㅑ","ㅒ","ㅕ","ㅖ","ㅛ","ㅠ"}
_NARROW_H_GLIDE_NUCLEI={"ㅑ","ㅒ","ㅕ","ㅖ","ㅛ","ㅠ"}
_NARROW_H_ROUNDED_NUCLEI={"ㅗ","ㅜ"}
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
        return ["ɾ"]
    if c=="ㅎ":
        if not phonemic and level=="narrow":
            # Narrow profile v11: Table 4.6 lists [ʝ]/[ɣ]/[β]/[ɦ] as voiced counterparts
            # in word-medial position. Their vowel mapping below pairs these with
            # the word-initial [ç]/[x]/[ɸʷ]/[h] contexts (Shin, Kiaer & Cha 2012, p.77).
            # This branch precedes the word-initial [ç]/[x] realizations.
            if index>0:
                previous=items[index-1]
                if previous.boundary_after!="word" and previous.coda=="":
                    if s.nucleus=="ㅣ" or s.nucleus in _NARROW_H_GLIDE_NUCLEI:
                        return ["ʝ"]
                    if s.nucleus=="ㅡ":
                        return ["ɣ"]
                    if s.nucleus in _NARROW_H_ROUNDED_NUCLEI:
                        return ["β"]
                    return ["ɦ"]
            # Word-initial Seoul allophones remain distinct from medial voiced
            # allophones. Post-sonorant weakening/deletion remains variable.
            word_initial=index==0 or items[index-1].boundary_after=="word"
            if word_initial:
                if s.nucleus=="ㅣ" or s.nucleus in _NARROW_H_GLIDE_NUCLEI:
                    return ["ç"]
                if s.nucleus=="ㅡ":
                    return ["x"]
                if s.nucleus in _NARROW_H_ROUNDED_NUCLEI:
                    return ["ɸʷ"]
            elif index>0 and items[index-1].coda in {"ㄴ","ㄹ","ㅁ","ㅇ","ㄵ","ㄶ","ㄻ","ㄼ","ㄽ","ㄾ","ㅀ"}:
                # Preserve place coarticulation before /i,j/ after a sonorant,
                # but do not choose a voiced phone: /h/-lenition is variable.
                if s.nucleus=="ㅣ" or s.nucleus in _NARROW_H_GLIDE_NUCLEI:
                    return ["ç"]
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

def nucleus_ipa(s:Syllable,*,phonemic=False,genitive_particle=False)->list[str]:
    # NIKL Standard Pronunciation Rule 5, exception 1:
    # https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
    # verbal forms with 져/쪄/쳐 are [저/쩌/처]. The official explanation
    # attributes this to the restriction against [j] immediately after the
    # palatal affricates ㅈ/ㅉ/ㅊ. Keep the glide in phonemic mode; absorb it
    # only in the broad surface-IPA representation.
    if not phonemic and s.nucleus=="ㅕ" and s.onset in {"ㅈ","ㅉ","ㅊ"}:
        return ["ʌ"]
    # Exact genitive-particle forms retain the principal project /ɰi/ form; Rule 5's [e]
    # alternative is emitted separately. Non-initial lexical ㅢ keeps [i].
    if not phonemic and genitive_particle and s.nucleus=="ㅢ":
        return ["ɰi"]
    # NIKL Rule 5(다만 3): ㅢ in a consonant-onset syllable is [i],
    # except when that onset is a preceding coda resyllabified by liaison.
    # Rule 5 commentary explicitly gives 협의[혀븨] as this exception.
    if s.nucleus=="ㅢ" and s.onset!="ㅇ" and not s.onset_from_coda and not phonemic:
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

_NIKL_GENITIVE_UI_PARTICLE_FORMS={"그놈의","자신의"}
# Exact source records below provide their complete ㅢ variant sets; do not
# add a generic non-initial [i] alternative on top of those lexical decisions.
_NIKL_EXACT_UI_VARIANT_FORMS={"삶의"}
# NIKL Korean Basic Dictionary entry 70710: 유사성[유ː사썽].
_NIKL_LEXICAL_LONG_VOWEL_FORMS={"유사성":"유"}

def _word_form_at(items:list[Syllable],index:int)->str:
    start=end=index
    while start>0 and items[start-1].boundary_after!="word":
        start-=1
    while end+1<len(items) and items[end].boundary_after!="word":
        end+=1
    return "".join(item.text for item in items[start:end+1])

def generate_vowel_variants(items:list[Syllable],rendered:list[str],*,level="broad")->list[dict]:
    if level=="narrow":
        variants=[]
        lee_ref="https://doi.org/10.1017/S0025100300004758"
        crosby_ref="https://doi.org/10.3765/plsa.v6i1.5002"
        socioling_ref="https://doi.org/10.20405/kl.2024.02.102.63"
        nasal_ref="https://discovery.ucl.ac.uk/id/eprint/1324541/1/1324541.pdf"
        for i,syllable in enumerate(items):
            if i>0 and syllable.onset=="ㄹ" and rendered[i].startswith("ɾ"):
                previous=items[i-1]
                if previous.boundary_after!="word" and previous.coda=="":
                    alternate=list(rendered)
                    alternate[i]="ɭ"+alternate[i][1:]
                    variants.append({
                        "layer":"narrow", "syllable_indices":[i],
                        "ipa":render_syllable_sequence(items,alternate),
                        "note":("Conflicting descriptions for intervocalic onset /l/: Lee (1993, p.31) describes [ɭ], while Crosby & Dalola (2021) found 422/425 intervocalic liquids as [ɾ]. "
                                "Optional unselected variant; [ɾ] remains primary. " + lee_ref + " " + crosby_ref),
                        "vowels":["ㄹ [ɭ]"], "evidence_status":"conflicting-source-descriptions-variant-only",
                        "evidence_refs":[lee_ref,crosby_ref], "environment":"same-word intervocalic onset ㄹ",
                        "uncertainty":"Conflicting descriptions; speaker and dialect are unknown.", "selected":False,
                    })
            # A geminate lateral before /i,j/ may show coarticulatory palatalization.
            # Crosby & Dalola (2021) measured mean F2 about 254.49 Hz higher
            # before high-front vocoids; this is gradient acoustic evidence,
            # not proof of categorical [ʎ]. Expose [lʲ] only as an unselected
            # candidate and keep the primary [l] unchanged.
            if (i>0 and syllable.onset=="ㄹ" and items[i-1].coda=="ㄹ"
                    and items[i-1].boundary_after!="word"
                    and syllable.nucleus in _NARROW_HIGH_FRONT_VOCOID_NUCLEI
                    and rendered[i].startswith("l")):
                alternate=list(rendered)
                alternate[i]="lʲ"+alternate[i][1:]
                variants.append({
                    "layer":"narrow", "syllable_indices":[i],
                    "ipa":render_syllable_sequence(items,alternate),
                    "note":("Gradient coarticulatory palatalization candidate [lʲ]. Crosby & Dalola (2021) measured F2 about 254.49 Hz higher for laterals before high-front vocoids and discuss prior [ʎ] descriptions; the study does not establish categorical [ʎ]. " + crosby_ref),
                    "vowels":["geminate ㄹ [lʲ]"], "evidence_status":"gradient-coarticulation-candidate-variant-only",
                    "evidence_refs":[crosby_ref], "environment":"geminate lateral before high-front vocoid /i,j/",
                    "uncertainty":"F2 is a gradient acoustic correlate; [lʲ] is a conservative project candidate, not an independently adjudicated phone or selected output.",
                    "selected":False,
                })
            # Lee (1996), summarized in Kim (2011, p.23), describes
            # /n/ as [nʲ]/[ɲ] before alveopalatal affricates. Expose the
            # coda-before-affricate context as optional candidates only:
            # the thesis is a secondary description, not direct evidence
            # that every speaker categorically realizes [ɲ] here.
            if (syllable.coda=="ㄴ" and rendered[i].endswith("n")
                    and i+1<len(items) and syllable.boundary_after!="word"
                    and items[i+1].onset in {"ㅈ","ㅉ","ㅊ"}):
                for alternate_nasal in ("ɲ", "nʲ"):
                    alternate=list(rendered)
                    alternate[i]=alternate[i][:-1]+alternate_nasal
                    variants.append({
                        "layer":"narrow", "syllable_indices":[i],
                        "ipa":render_syllable_sequence(items,alternate),
                        "note":("Secondary description in Lee (1996), summarized by Kim (2011, p.23), lists [nʲ]/[ɲ] before /tɕ, tɕ͈, tɕʰ/. This project exposes optional coda-before-affricate candidates only; no categorical primary output is inferred. " + nasal_ref),
                        "vowels":["coda ㄴ ["+alternate_nasal+"] before affricate"],
                        "evidence_status":"secondary-description-candidate-only",
                        "evidence_refs":[nasal_ref],
                        "environment":"same-word coda ㄴ before alveopalatal affricate ㅈ/ㅉ/ㅊ",
                        "uncertainty":"Secondary literature-review description, not direct acoustic evidence for this specific coda context; speaker/dialect and actual place realization remain unverified.",
                        "selected":False,
                    })
            # Coda /l/ has a separate, sociophonetic retroflex variant. The
            # 2024 study finds higher rates word-finally and before /h/, with
            # strong dialect/gender/style effects; do not select [ɭ] without
            # speaker or audio evidence. Keep the canonical [l] untouched.
            if syllable.coda=="ㄹ" and rendered[i].endswith("l"):
                next_same_word = i+1<len(items) and syllable.boundary_after!="word"
                next_onset = items[i+1].onset if next_same_word else None
                pre_h = next_same_word and next_onset=="ㅎ"
                pre_consonantal = next_same_word and next_onset not in {None,"","ㅇ"}
                word_final = i+1==len(items) or syllable.boundary_after=="word"
                if pre_h or pre_consonantal or word_final:
                    alternate=list(rendered)
                    alternate[i]=alternate[i][:-1]+"ɭ"
                    if pre_h:
                        environment="coda ㄹ before same-word ㅎ"
                    elif pre_consonantal:
                        environment="coda ㄹ before same-word consonant"
                    else:
                        environment="word-final coda ㄹ (orthographic word boundary or end of input)"
                    variants.append({
                        "layer":"narrow", "syllable_indices":[i],
                        "ipa":render_syllable_sequence(items,alternate),
                        "note":("Optional sociophonetic [ɭ] coda variant. Crosby & Dalola (2021) found retroflex laterals 3.204 times more likely preconsonantally and 6.972 times more likely before /h/ than in the word-initial reference; Crosby (2024) found higher odds word-finally (OR 2.516). Strong speaker/dialect/style effects; both studies classify lateral tokens, not taps. " + crosby_ref + " " + socioling_ref),
                        "vowels":["coda ㄹ [ɭ]"], "evidence_status":"speaker-conditioned-sociophonetic-variant-only",
                        "evidence_refs":[crosby_ref,socioling_ref], "environment":environment,
                        "uncertainty":"Variant frequency depends on dialect, speaker, style, preceding vowel and whether /l/ is realized as a lateral; text-only input cannot select it.",
                        "selected":False,
                    })
        return variants
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
        elif syllable.nucleus=="ㅐ":
            # Research-only optional merger/weak-distinction candidate; keep
            # the current broad-profile vowel as canonical in either direction.
            if "ɛ" in rendered[i]:
                primary,alternate="ɛ","e"
            elif "e" in rendered[i]:
                primary,alternate="e","ɛ"
            else:
                continue
            section="research /ɛ–e/ merger"
        elif (syllable.nucleus=="ㅢ" and i>0
              and items[i-1].boundary_after!="word"
              and _word_form_at(items,i) not in _NIKL_EXACT_UI_VARIANT_FORMS):
            genitive_particle=_word_form_at(items,i) in _NIKL_GENITIVE_UI_PARTICLE_FORMS
            primary,alternate="ɰi","e" if genitive_particle else "i"
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
            if any(site[4]=="research /ɛ–e/ merger" for site in changed):
                note=("Research-only optional [ɛ]~[e] realization of ㅐ; group-level Korean mid-front-vowel merger/weak-distinction evidence (Lee & Cho 2021; Eychenne & Jang 2015; Lee 2023, SRC-LEE-2023-SEOUL-MID-FRONT-VOWEL-POSITION). Lee (2023) finds the merger incomplete and position-sensitive. Speaker-specific quality is unknown; canonical broad output is unchanged."
                      if len(sites)<=3 else
                      "Research-only local [ɛ]~[e] candidate for ㅐ, supported at group level (Lee & Cho 2021; Eychenne & Jang 2015; Lee 2023, SRC-LEE-2023-SEOUL-MID-FRONT-VOWEL-POSITION); Lee (2023) finds the merger incomplete and position-sensitive; other optional vowels retain their primary readings.")
            else:
                note=(f"NIKL {sections} permits this alternate; Korean spelling is unchanged."
                      if len(sites)<=3 else
                      f"NIKL {sections} permits this local alternate; other optional vowels keep the primary reading.")
            variants.append({
                "syllable_indices":[index for index,_,_,_,_ in changed],
                "ipa":render_syllable_sequence(items,alternate),
                "note":note,
                "vowels":labels,
            })

    # Exact loanword variant: NIKL's 2005 usage column records both 게임[게임]
    # and the fortis-onset variant 게임[께임]. Keep broad /k/ canonical; the
    # source is qualitative and does not identify this token's speaker.
    for i,syllable in enumerate(items):
        if (_word_form_at(items,i)=="게임" and syllable.text=="게"
                and syllable.onset=="ㄱ" and rendered[i].startswith("k")):
            alternate=list(rendered)
            alternate[i]="k͈"+alternate[i][1:]
            variants.append({
                "syllable_indices":[i],
                "ipa":render_syllable_sequence(items,alternate),
                "note":"Research-only optional [k͈] onset in the exact loanword 게임, recorded alongside [k] by NIKL's 2005 usage column (SRC-NIKL-LOANWORD-GAME-2005); canonical broad /k/ is preserved and speaker realization is unknown.",
                "vowels":["게임 [k͈]"],
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


    return variants

def realize_syllables(items:list[Syllable],*,level="broad")->dict:
    if level not in {"phonemic","broad","narrow"}: raise ValueError("level must be phonemic, broad, or narrow")
    phonemic=level=="phonemic"
    rendered=[]
    for i,s in enumerate(items):
        genitive_particle=(s.nucleus=="ㅢ" and
                           _word_form_at(items,i) in _NIKL_GENITIVE_UI_PARTICLE_FORMS)
        nucleus=nucleus_ipa(s,phonemic=phonemic,genitive_particle=genitive_particle)
        if _NIKL_LEXICAL_LONG_VOWEL_FORMS.get(_word_form_at(items,i))==s.text:
            nucleus=[nucleus[0]+"ː"]
        rendered.append("".join(onset_ipa(s,i,items,phonemic=phonemic,level=level)+
                                 nucleus+coda_ipa(s.coda,phonemic=phonemic)))
    ipa=render_syllable_sequence(items,rendered)
    profile_ids={
        "phonemic":"clippyfirst-korean-phonemic-v1",
        "broad":"clippyfirst-korean-broad-v1",
        "narrow":"clippyfirst-korean-narrow-contextual-allophones-v12",
    }
    result={
        "level":level,
        "ipa_profile":profile_ids[level],
        "ipa_profile_version":12 if level=="narrow" else 1,
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
            "name":"korean-narrow-contextual-allophones-v12",
            "scope":["aspiration of lenis ㅅ as [sʰ]","palatalized [ɕʰ] candidate before ㅣ, ㅖ, ㅑ (Kang 2010; partial narrow profile)","palatalized [ɲ] for onset ㄴ before glide nuclei ㅑ, ㅒ, ㅕ, ㅖ, ㅛ, ㅠ; not generalized to ㅣ","ㅎ is [ç] before selected high-front/glide nuclei and [x] before ㅜ, following the cited Seoul description","after a same-word sonorant coda, /h/ may weaken or delete variably; no categorical [ɦ] is assigned without token-specific evidence","same-word intervocalic ㅎ is vowel-conditioned: [ʝ] before /i,j/, [ɣ] before /ɯ/, [β] before /o,u/, and [ɦ] elsewhere (Shin, Kiaer & Cha 2012); word-initial [ç]/[x] remain separate","tense ㅆ remains [s͈]; its palatalization is not assumed because evidence is mixed","coda ㄹ exposes optional [ɭ] variants word-finally, before same-word consonants and before ㅎ; never selected without speaker/dialect/audio evidence (Crosby & Dalola 2021; Crosby 2024)","geminate ㄹ before high-front vocoids exposes optional [lʲ] coarticulation candidate; primary [l] remains unchanged and categorical [ʎ] is not inferred (Crosby & Dalola 2021)"],
            "sources":[
                "Lee, Hyun Bok (1993), Korean, Illustrations of the IPA: /h/ [ç] before /i,j/ and [x] before /u/; /s/ is classified as fortis in this description: https://doi.org/10.1017/S0025100300004758",
                "Kang, Hyunsook (2010), Coarticulation effects of Korean sibilant /s/ before a high front segment: https://doi.org/10.17959/sppm.2010.16.1.3",
                "Kim, Young Shin (2011), UCL PhD thesis, diphthong /ɥi/ and its [ɥi], [ø], [y] realizations: https://discovery.ucl.ac.uk/id/eprint/1324541/1/1324541.pdf",
                "Cho, Jun & Ladefoged (2002), via High-toned [il] in Korean: https://www.sciencedirect.com/science/article/pii/S0095447015000339",
                "Kang (2010), Coarticulation effects of Korean sibilant /s/ before a high front segment: https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001444770",
                "Ahn (2009), Korean /n/-deletion: phonetic initial strengthening to denasalization; related initial-deletion evidence, not direct support for generalized [ɲ]: https://doi.org/10.17959/sppm.2009.15.1.53",
                "Lee (1996), Korean Phonetics, summarized in the UCL thesis: https://discovery.ucl.ac.uk/1324541/1/1324541.pdf",
                "Kang & Lee (2019), The Realizations of /h/ in Seoul and Gwangju Koreans: speaker- and dialect-conditioned weakening/deletion; https://doi.org/10.17290/jlsk.2019..84.175",
                "Eom (2014), Phonetic realizations of /h/ after a sonorant in Korean: residual effects and non-categorical realization; https://doi.org/10.17959/sppm.2014.20.3.357",
                "Crosby, Drew & Dalola, Amanda (2021), Phonetic variation in the Korean liquid phoneme; intervocalic [ɾ] is near-categorical and retroflex laterals are position-/pause-conditioned; https://doi.org/10.3765/plsa.v6i1.5002",
                "Crosby, Drew (2024), A Sociolinguistic Study of the Retroflex Variant of the Korean Liquid Phoneme; coda [ɭ] is more frequent word-finally and before /h/ and varies by dialect, gender, age and style; https://doi.org/10.20405/kl.2024.02.102.63",
            ],
            "limitations":["partial profile, not a complete narrow transcription","models word-initial [ç]/[x] and word-medial [ʝ]/[ɣ]/[β]/[ɦ] in cited Seoul contexts; onset [ɭ] remains an unselected conflict variant, coda [ɭ] is exposed only as a speaker-conditioned sociophonetic variant word-finally/preconsonantally/pre-/h/, and geminate [lʲ] only as a gradient high-front coarticulation candidate; post-sonorant /h/ weakening/deletion remains unresolved and is not collapsed into [ɦ]","the [ɲ] choice before /j/-initial nuclei is a research-profile generalization; do not treat it as universal speaker-independent output","does not force palatalization of tense /s͈/ because the available literature reports variation and disagreement","research-only profile; do not treat as approved Ukrainian target input without target-inventory review"],
            "target_compatible":False,
        }
    return result
