from __future__ import annotations
from dataclasses import dataclass
from .phonology import Syllable, split_coda

FINAL_REPRESENTATIVE={"ㄳ":"ㄱ","ㄵ":"ㄴ","ㄶ":"ㄴ","ㄺ":"ㄱ","ㄻ":"ㅁ","ㄼ":"ㄹ","ㄽ":"ㄹ","ㄾ":"ㄹ","ㄿ":"ㅂ","ㅀ":"ㄹ","ㅄ":"ㅂ","ㅅ":"ㄷ","ㅆ":"ㄷ","ㅈ":"ㄷ","ㅊ":"ㄷ","ㅌ":"ㄷ","ㅎ":"ㄷ","ㄲ":"ㄱ","ㅋ":"ㄱ","ㅍ":"ㅂ"}
PLAIN_TO_FORTIS={"ㄱ":"ㄲ","ㄷ":"ㄸ","ㅂ":"ㅃ","ㅅ":"ㅆ","ㅈ":"ㅉ"}
ASPIRATE={("ㄱ","ㅎ"):"ㅋ",("ㄷ","ㅎ"):"ㅌ",("ㅂ","ㅎ"):"ㅍ",("ㅈ","ㅎ"):"ㅊ",("ㅎ","ㄱ"):"ㅋ",("ㅎ","ㄷ"):"ㅌ",("ㅎ","ㅂ"):"ㅍ",("ㅎ","ㅈ"):"ㅊ"}
NASAL_AFTER={"ㄱ":"ㅇ","ㄲ":"ㅇ","ㅋ":"ㅇ","ㄷ":"ㄴ","ㅅ":"ㄴ","ㅆ":"ㄴ","ㅈ":"ㄴ","ㅊ":"ㄴ","ㅌ":"ㄴ","ㅎ":"ㄴ","ㅂ":"ㅁ","ㅍ":"ㅁ"}
COMPLEX_LIAISON={"ㄳ":("ㄱ","ㅆ"),"ㄵ":("ㄴ","ㅈ"),"ㄶ":("ㄴ",""),"ㄺ":("ㄹ","ㄱ"),"ㄻ":("ㄹ","ㅁ"),"ㄼ":("ㄹ","ㅂ"),"ㄽ":("ㄹ","ㅆ"),"ㄾ":("ㄹ","ㅌ"),"ㄿ":("ㄹ","ㅍ"),"ㅀ":("ㄹ",""),"ㅄ":("ㅂ","ㅆ")}

def contextual_final_representative(a,b):
    if a.coda=="ㄼ" and b.onset!="ㅇ":
        if a.text=="밟":
            return "ㅂ"
        if a.text=="넓" and a.text+b.text in {"넓죽","넓둥글","넓적"}:
            return "ㅂ"
    return FINAL_REPRESENTATIVE.get(a.coda,a.coda)
RULE_META={
"R001":("final-neutralization","NIKL §9","high"),
"R002":("liaison-resyllabification","NIKL §§13–15","high"),
"R003":("h-deletion-before-vowel","NIKL §12(4)","high"),
"R004":("h-aspiration","NIKL §12(1)","high"),
"R005":("nasal-assimilation","NIKL §18","high"),
"R006":("liquid-assimilation","NIKL §§19–20","high"),
"R007":("palatalization","NIKL §17","high"),
"R008":("tensification","NIKL §§23–27","high"),
"R009":("n-insertion","NIKL §29","high"),
"R010":("stem-nm-fortition","NIKL §24","high"),
"R011":("stem-lb-lt-fortition","NIKL §25","high"),
"R012":("sino-korean-l-fortition","NIKL §26","high"),
"R013":("adnominal-l-fortition","NIKL §27","high"),
"R014":("compound-fortition","NIKL §28","high"),
"R015":("saisiot-pronunciation","NIKL §30","high"),
}

@dataclass
class RuleTrace:
    rule_id:str; name:str; changed:bool; before:list[dict]; after:list[dict]; status:str; confidence:str; source:str
    license_context:str|None=None
    def to_dict(self): return self.__dict__.copy()

def _snap(items): return [x.to_dict() for x in items]

def _eligible(a:Syllable,b:Syllable,*,boundary_mode:str,allow_word_boundary:bool=False)->bool:
    if b.index != a.index+1: return False
    boundary=a.boundary_after
    if boundary=="word":
        return allow_word_boundary and boundary_mode=="phrase"
    return boundary_mode in {"same_word","morpheme","word","phrase"}

def _licensed(rule_id:str,rule_licenses:set[str]|None)->str|None:
    if not rule_licenses: return None
    prefix=rule_id+":"
    return next((x for x in rule_licenses if x.startswith(prefix)),None)

def apply_rule(items:list[Syllable],rule_id:str,*,boundary_mode="same_word",n_insertion_licensed=False,rule_licenses=None)->RuleTrace:
    if rule_id not in RULE_META: raise ValueError(f"unknown rule_id: {rule_id}")
    if boundary_mode not in {"unknown","same_word","morpheme","word","phrase"}: raise ValueError("invalid boundary_mode")
    licenses=set(rule_licenses or ())
    before=_snap(items); changed=False
    license_context=_licensed(rule_id,licenses)
    if rule_id=="R001":
        for i,s in enumerate(items):
            if s.coda=="ㄼ" and i+1<len(items) and items[i+1].onset!="ㅇ":
                # NIKL exception: 밟- is [ㅂ] before consonants; 넓- has
                # the narrower [ㅂ] realization in 넓죽-/넓둥글-.
                if s.text=="밟":
                    s.coda="ㅂ"; changed=True; continue
                if s.text=="넓" and s.text+items[i+1].text in {"넓죽","넓둥글","넓적"}:
                    s.coda="ㅂ"; changed=True; continue
            if s.coda in FINAL_REPRESENTATIVE:
                new=FINAL_REPRESENTATIVE[s.coda]
                if new!=s.coda: s.coda=new; changed=True
    elif rule_id=="R002":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode) or b.onset!="ㅇ" or not a.coda: continue
            if a.coda in COMPLEX_LIAISON:
                retained,moved=COMPLEX_LIAISON[a.coda]; a.coda=retained; b.onset=moved or "ㅇ"; changed=True
            elif a.coda!="ㅎ":
                b.onset=a.coda; a.coda=""; changed=True
    elif rule_id=="R003":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if _eligible(a,b,boundary_mode=boundary_mode) and a.coda in {"ㅎ","ㄶ","ㅀ"} and b.onset=="ㅇ":
                a.coda={"ㅎ":"","ㄶ":"ㄴ","ㅀ":"ㄹ"}[a.coda]; changed=True
    elif rule_id=="R004":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if _eligible(a,b,boundary_mode=boundary_mode) and (a.coda,b.onset) in ASPIRATE:
                b.onset=ASPIRATE[(a.coda,b.onset)]; a.coda=""; changed=True
    elif rule_id=="R005":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            representative=contextual_final_representative(a,b)
            if _eligible(a,b,boundary_mode=boundary_mode) and representative in NASAL_AFTER and b.onset in {"ㄴ","ㅁ"}:
                a.coda=NASAL_AFTER[representative]; changed=True
    elif rule_id=="R006":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode): continue
            representative=contextual_final_representative(a,b)
            if representative=="ㄴ" and b.onset=="ㄹ": a.coda="ㄹ"; changed=True
            elif representative=="ㄹ" and b.onset=="ㄴ": a.coda="ㄹ"; b.onset="ㄹ"; changed=True
            elif representative in {"ㅁ","ㅇ"} and b.onset=="ㄹ": b.onset="ㄴ"; changed=True
    elif rule_id=="R007":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if _eligible(a,b,boundary_mode=boundary_mode) and a.coda in {"ㄷ","ㅌ"} and b.onset=="ㅇ" and b.nucleus in {"ㅣ","ㅑ","ㅕ","ㅛ","ㅠ","ㅖ","ㅒ"}:
                b.onset={"ㄷ":"ㅈ","ㅌ":"ㅊ"}[a.coda]; a.coda=""; changed=True
    elif rule_id=="R008":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            representative=FINAL_REPRESENTATIVE.get(a.coda,a.coda)
            if _eligible(a,b,boundary_mode=boundary_mode) and representative in {"ㄱ","ㄷ","ㅂ"} and b.onset in PLAIN_TO_FORTIS:
                b.onset=PLAIN_TO_FORTIS[b.onset]; changed=True
    elif rule_id=="R009":
        if not n_insertion_licensed:
            name,source,confidence=RULE_META[rule_id]
            return RuleTrace(rule_id,name,False,before,before,"conditional-disabled",confidence,source,license_context)
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode,allow_word_boundary=True) or b.onset!="ㅇ": continue
            if b.nucleus not in {"ㅣ","ㅑ","ㅕ","ㅛ","ㅠ","ㅖ","ㅒ"}: continue
            b.onset="ㄹ" if FINAL_REPRESENTATIVE.get(a.coda,a.coda)=="ㄹ" else "ㄴ"; changed=True
    elif rule_id in {"R010","R011","R012","R013","R014"}:
        required={
            "R010":"R010:stem_n_m+suffix",
            "R011":"R011:stem_lb_lt+suffix",
            "R012":"R012:sino_ryeon",
            "R013":"R013:adnominal_l",
            "R014":"R014:compound",
        }[rule_id]
        if required not in licenses:
            name,source,confidence=RULE_META[rule_id]
            return RuleTrace(rule_id,name,False,before,before,"conditional-disabled",confidence,source,None)
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode): continue
            if b.onset not in PLAIN_TO_FORTIS: continue
            applies = (
                (rule_id=="R010" and FINAL_REPRESENTATIVE.get(a.coda,a.coda) in {"ㄴ","ㅁ"}) or
                (rule_id=="R011" and a.coda in {"ㄼ","ㄾ"}) or
                (rule_id=="R012" and a.coda=="ㄹ" and b.onset in {"ㄷ","ㅅ","ㅈ"}) or
                (rule_id=="R013" and a.coda=="ㄹ") or
                (rule_id=="R014" and bool(a.coda))
            )
            if applies:
                b.onset=PLAIN_TO_FORTIS[b.onset]; changed=True
    elif rule_id=="R015":
        if license_context!="R015:saisiot":
            name,source,confidence=RULE_META[rule_id]
            return RuleTrace(rule_id,name,False,before,before,"conditional-disabled",confidence,source,None)
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode): continue
            if a.coda!="ㅅ": continue
            if b.onset in PLAIN_TO_FORTIS:
                b.onset=PLAIN_TO_FORTIS[b.onset]; a.coda=""; changed=True
            elif b.onset in {"ㄴ","ㅁ"}:
                a.coda="ㄴ"; changed=True
            elif b.onset=="ㅇ" and b.nucleus=="ㅣ":
                a.coda="ㄴ"; b.onset="ㄴ"; changed=True
    name,source,confidence=RULE_META[rule_id]
    status="established" if changed or rule_id not in {"R009","R010","R011","R012","R013","R014","R015"} else "conditional-nochange"
    return RuleTrace(rule_id,name,changed,before,_snap(items),status,confidence,source,license_context)

def apply_ordered_rules(items:list[Syllable],rule_ids=None,*,boundary_mode="same_word",n_insertion_licensed=False,rule_licenses=None):
    ids=rule_ids or ["R009","R002","R003","R004","R005","R006","R007","R010","R011","R012","R013","R014","R015","R008","R001"]
    if boundary_mode not in {"unknown","same_word","morpheme","word","phrase"}: raise ValueError("invalid boundary_mode")
    return items,[apply_rule(items,r,boundary_mode=boundary_mode,n_insertion_licensed=n_insertion_licensed,rule_licenses=rule_licenses) for r in ids]
