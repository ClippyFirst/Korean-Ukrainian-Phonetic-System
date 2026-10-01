from __future__ import annotations
from dataclasses import dataclass
from .phonology import Syllable, split_coda

FINAL_REPRESENTATIVE={"ㄳ":"ㄱ","ㄵ":"ㄴ","ㄶ":"ㄴ","ㄺ":"ㄱ","ㄻ":"ㅁ","ㄼ":"ㄹ","ㄽ":"ㄹ","ㄾ":"ㄹ","ㄿ":"ㅂ","ㅀ":"ㄹ","ㅄ":"ㅂ","ㅅ":"ㄷ","ㅆ":"ㄷ","ㅈ":"ㄷ","ㅊ":"ㄷ","ㅌ":"ㄷ","ㅎ":"ㄷ","ㄲ":"ㄱ","ㅋ":"ㄱ","ㅍ":"ㅂ"}
PLAIN_TO_FORTIS={"ㄱ":"ㄲ","ㄷ":"ㄸ","ㅂ":"ㅃ","ㅅ":"ㅆ","ㅈ":"ㅉ"}
ASPIRATE={("ㄱ","ㅎ"):"ㅋ",("ㄷ","ㅎ"):"ㅌ",("ㅂ","ㅎ"):"ㅍ",("ㅈ","ㅎ"):"ㅊ",("ㅎ","ㄱ"):"ㅋ",("ㅎ","ㄷ"):"ㅌ",("ㅎ","ㅂ"):"ㅍ",("ㅎ","ㅈ"):"ㅊ"}
NASAL_AFTER={"ㄱ":"ㅇ","ㄲ":"ㅇ","ㅋ":"ㅇ","ㄷ":"ㄴ","ㅅ":"ㄴ","ㅆ":"ㄴ","ㅈ":"ㄴ","ㅊ":"ㄴ","ㅌ":"ㄴ","ㅎ":"ㄴ","ㅂ":"ㅁ","ㅍ":"ㅁ"}
COMPLEX_LIAISON={
    "ㄳ":("ㄱ","ㅆ"), "ㄵ":("ㄴ","ㅈ"), "ㄶ":("ㄴ",""),
    "ㄺ":("ㄹ","ㄱ"), "ㄻ":("ㄹ","ㅁ"), "ㄼ":("ㄹ","ㅂ"),
    "ㄽ":("ㄹ","ㅆ"), "ㄾ":("ㄹ","ㅌ"), "ㄿ":("ㄹ","ㅍ"),
    "ㅀ":("ㄹ",""), "ㅄ":("ㅂ","ㅆ"),
}
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
}

@dataclass
class RuleTrace:
    rule_id:str; name:str; changed:bool; before:list[dict]; after:list[dict]; status:str; confidence:str; source:str
    def to_dict(self): return self.__dict__.copy()

def _snap(items): return [x.to_dict() for x in items]

def _eligible(a:Syllable,b:Syllable,*,boundary_mode:str,allow_word_boundary:bool=False)->bool:
    if b.index != a.index+1:
        return False
    boundary=a.boundary_after
    if boundary=="word":
        return allow_word_boundary and boundary_mode=="phrase"
    return boundary_mode in {"same_word","morpheme","word","phrase"}

def apply_rule(items:list[Syllable],rule_id:str,*,boundary_mode="same_word")->RuleTrace:
    if rule_id not in RULE_META: raise ValueError(f"unknown rule_id: {rule_id}")
    if boundary_mode not in {"unknown","same_word","morpheme","word","phrase"}: raise ValueError("invalid boundary_mode")
    before=_snap(items); changed=False
    if rule_id=="R001":
        for s in items:
            if s.coda in FINAL_REPRESENTATIVE:
                new=FINAL_REPRESENTATIVE[s.coda]
                if new!=s.coda: s.coda=new; changed=True
    elif rule_id=="R002":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode) or b.onset!="ㅇ" or not a.coda:
                continue
            if a.coda in COMPLEX_LIAISON:
                retained,moved=COMPLEX_LIAISON[a.coda]
                a.coda=retained; b.onset=moved or "ㅇ"; changed=True
            elif a.coda!="ㅎ":
                b.onset=a.coda; a.coda=""; changed=True
    elif rule_id=="R003":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if _eligible(a,b,boundary_mode=boundary_mode) and a.coda in {"ㅎ","ㄶ","ㅀ"} and b.onset=="ㅇ":
                if a.coda=="ㅎ": a.coda=""
                elif a.coda=="ㄶ": a.coda="ㄴ"
                else: a.coda="ㄹ"
                changed=True
    elif rule_id=="R004":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if _eligible(a,b,boundary_mode=boundary_mode) and (a.coda,b.onset) in ASPIRATE:
                b.onset=ASPIRATE[(a.coda,b.onset)]; a.coda=""; changed=True
    elif rule_id=="R005":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if _eligible(a,b,boundary_mode=boundary_mode) and a.coda in NASAL_AFTER and b.onset in {"ㄴ","ㅁ"}:
                a.coda=NASAL_AFTER[a.coda]; changed=True
    elif rule_id=="R006":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode): continue
            if a.coda=="ㄴ" and b.onset=="ㄹ": a.coda="ㄹ"; changed=True
            elif a.coda=="ㄹ" and b.onset=="ㄴ": b.onset="ㄹ"; changed=True
            elif a.coda in {"ㅁ","ㅇ"} and b.onset=="ㄹ": b.onset="ㄴ"; changed=True
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
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode,allow_word_boundary=True) or b.onset!="ㅇ":
                continue
            if b.nucleus not in {"ㅣ","ㅑ","ㅕ","ㅛ","ㅠ","ㅖ","ㅒ"}:
                continue
            b.onset="ㄹ" if a.coda=="ㄹ" else "ㄴ"; changed=True
    name,source,confidence=RULE_META[rule_id]
    return RuleTrace(rule_id,name,changed,before,_snap(items),"established",confidence,source)

def apply_ordered_rules(items:list[Syllable],rule_ids=None,*,boundary_mode="same_word"):
    ids=rule_ids or ["R002","R003","R004","R005","R006","R007","R009","R008","R001"]
    if boundary_mode not in {"unknown","same_word","morpheme","word","phrase"}: raise ValueError("invalid boundary_mode")
    return items,[apply_rule(items,r,boundary_mode=boundary_mode) for r in ids]
