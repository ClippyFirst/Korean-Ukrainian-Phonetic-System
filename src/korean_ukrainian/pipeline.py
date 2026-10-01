from __future__ import annotations
from .hangul import decompose_hangul
from .phonology import parse_syllables
from .rules import apply_ordered_rules
from .ipa import realize_syllables
from .ukrainian_adapter import UkrainianTargetAdapter
from .orthography import render_sequence

DEFAULT_WEIGHTS={"consonantal":2.0,"sonorant":1.5,"syllabic":1.0,"voice":1.0,"continuant":1.5,"nasal":1.5,"lateral":1.0,"rhotic":1.0,"labial":1.5,"coronal":1.5,"dorsal":1.5,"palatal":2.0,"palatalized":1.5,"affricate":1.5,"aspirated":0.5,"long":0.5}

def analyze_korean(text):
    return [{"orthography":c,"decomposition":decompose_hangul(c)} for c in text if "가"<=c<="힣"]

def phonologize_korean(text):
    items=parse_syllables(text)
    return {"input":text,"syllables":[x.to_dict() for x in items],"analysis_status":"canonical_structural_representation"}

def phoneticize_korean(text,*,rule_ids=None,boundary_mode="same_word",ipa_level="broad"):
    items=parse_syllables(text); items,traces=apply_ordered_rules(items,rule_ids,boundary_mode=boundary_mode)
    return {"input":text,"surface_syllables":[x.to_dict() for x in items],"rules":[x.to_dict() for x in traces],"ipa":realize_syllables(items,level=ipa_level)}

def _feature_vector_for_ipa(ipa:str)->dict:
    consonants={
    "p":("0","0","1","0","0","0","0","0"),"p͈":("0","0","1","0","0","0","0","0"),"pʰ":("0","0","1","0","0","0","0","1"),
    "t":("0","1","0","0","0","0","0","0"),"t͈":("0","1","0","0","0","0","0","0"),"tʰ":("0","1","0","0","0","0","0","1"),
    "k":("0","0","0","1","0","0","0","0"),"k͈":("0","0","0","1","0","0","0","0"),"kʰ":("0","0","0","1","0","0","0","1"),
    "tɕ":("0","1","0","0","0","1","0","0"),"tɕ͈":("0","1","0","0","0","1","0","0"),"tɕʰ":("0","1","0","0","0","1","0","1"),
    "s":("0","1","0","0","1","0","0","0"),"s͈":("0","1","0","0","1","0","0","0"),
    "m":("1","0","1","0","0","1","0","0"),"n":("1","1","0","0","0","1","0","0"),"ŋ":("1","0","0","1","0","1","0","0"),
    "ɾ":("1","1","0","0","1","0","1","0"),"l":("1","1","0","0","1","0","0","0"),"h":("0","0","0","0","1","0","0","0")}
    if ipa in consonants:
        son,cor,lab,dor,cont,nas,rho,asp=consonants[ipa]
        return {"consonantal":"1","sonorant":son,"syllabic":"0","voice":"1" if ipa in {"m","n","ŋ","ɾ","l"} else "0","continuant":cont,"nasal":nas,"lateral":"1" if ipa=="l" else "0","rhotic":rho,"labial":lab,"coronal":cor,"dorsal":dor,"palatal":"1" if ipa.startswith("tɕ") else "0","palatalized":"0","affricate":"1" if ipa.startswith("tɕ") else "0","aspirated":asp}
    vowels={"i":("close","front","0"),"ɛ":("open-mid","front","0"),"a":("open","central","0"),"ʌ":("open-mid","back","0"),"o":("close-mid","back","1"),"u":("close","back","1"),"ɯ":("close","back","0"),"e":("close-mid","front","0"),"ø":("close-mid","front","1"),"y":("close","front","1")}
    if ipa in vowels:
        h,b,r=vowels[ipa]
        return {"consonantal":"0","sonorant":"0","syllabic":"1","voice":"na","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0","height":h,"backness":b,"rounded":r}
    if ipa=="j": return {"consonantal":"1","sonorant":"1","syllabic":"0","voice":"1","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"1","palatalized":"0","affricate":"0","aspirated":"0"}
    if ipa=="w": return {"consonantal":"1","sonorant":"1","syllabic":"0","voice":"1","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"1","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"}
    if ipa=="ɰ": return {"consonantal":"1","sonorant":"1","syllabic":"0","voice":"1","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"1","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"}
    return {}

def source_features_for_ipa(ipa:str)->dict: return _feature_vector_for_ipa(ipa)

def tokenize_ipa(ipa:str)->list[str]:
    tokens=[]; i=0
    inventory=("tɕ͈","tɕʰ","tɕ","pʰ","tʰ","kʰ","p͈","t͈","k͈","ɡ","ɾ","ŋ","ɯ","ʌ","ɛ","ø","ɰ","j","w","p","t","k","b","d","m","n","s","h","a","e","o","u","i","l","y")
    while i<len(ipa):
        if ipa[i] in ".#": i+=1; continue
        match=next((x for x in inventory if ipa.startswith(x,i)),None)
        if match is None: raise ValueError(f"unsupported IPA segment at index {i}: {ipa[i]!r}")
        tokens.append(match); i+=len(match)
    return tokens

def map_ipa_to_ukrainian(ipa,target_adapter=None,source_features=None,weights=None):
    adapter=target_adapter if isinstance(target_adapter,UkrainianTargetAdapter) else UkrainianTargetAdapter()
    weights=weights or DEFAULT_WEIGHTS
    segments=tokenize_ipa(ipa)
    grouped=[]
    for segment in segments:
        features=source_features if source_features and len(segments)==1 else source_features_for_ipa(segment)
        grouped.append({"source_ipa":segment,"source_features":features,"target":adapter.candidates(features,weights)})
    return {"ipa":ipa,"segments":grouped,"status":"segmentwise-candidate-analysis"}

def rank_ukrainian_candidates(candidates):
    return sorted(candidates,key=lambda x:(x.get("score",float("inf")),x.get("candidate_id","")))

def _select_target(target):
    selected=[]
    for segment in target["segments"]:
        candidates=segment["target"].get("candidates",[])
        if not candidates: return None
        selected.append(candidates[0])
    return {"segments":selected,"score_type":"heuristic_cost","status":"top_ranked_segmentwise"}

def transliterate_korean(text,*,rule_ids=None,boundary_mode="same_word",ipa_level="broad",target_adapter=None):
    surface=phoneticize_korean(text,rule_ids=rule_ids,boundary_mode=boundary_mode,ipa_level=ipa_level)
    target=map_ipa_to_ukrainian(surface["ipa"]["ipa"],target_adapter)
    selected=_select_target(target)
    orthographic=render_sequence([x.get("grapheme","") for x in selected["segments"]]) if selected else None
    return {"input":text,"orthography":analyze_korean(text),"phonology":phonologize_korean(text),"phonetics":surface,"ipa":surface["ipa"],"target_analysis":target,"candidates":[g["target"]["candidates"] for g in target["segments"]],"selected_candidate":selected,"ukrainian_orthography":orthographic,"score_type":"heuristic_cost","confidence":None,"selection_status":"top-ranked heuristic candidate; not probability" if selected else "unavailable_without_target_inventory","sources":["S001","S003","S004","S005"],"analysis_status":"research-prototype"}
