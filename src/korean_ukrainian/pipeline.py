from __future__ import annotations
from .hangul import decompose_hangul
from .phonology import parse_syllables
from .rules import apply_ordered_rules
from .ipa import realize_syllables
from .ukrainian_adapter import UkrainianTargetAdapter
DEFAULT_WEIGHTS={"consonantal":2.0,"sonorant":1.5,"syllabic":1.0,"voice":1.0,"continuant":1.5,"nasal":1.5,"lateral":1.0,"rhotic":1.0,"labial":1.5,"coronal":1.5,"dorsal":1.5,"palatal":2.0,"palatalized":1.5,"affricate":1.5,"aspirated":0.5,"long":0.5}

def analyze_korean(text):
    return [{"orthography":c,"decomposition":decompose_hangul(c)} for c in text if "가"<=c<="힣"]

def phonologize_korean(text):
    items=parse_syllables(text)
    return {"input":text,"syllables":[x.to_dict() for x in items],"analysis_status":"canonical_structural_representation"}

def phoneticize_korean(text,*,rule_ids=None,boundary_mode="unknown",ipa_level="broad"):
    items=parse_syllables(text); items,traces=apply_ordered_rules(items,rule_ids,boundary_mode=boundary_mode)
    return {"input":text,"surface_syllables":[x.to_dict() for x in items],"rules":[x.to_dict() for x in traces],"ipa":realize_syllables(items,level=ipa_level)}

def _feature_vector_for_ipa(ipa:str)->dict:
    table={
    "p":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"1","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "p͈":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"1","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "pʰ":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"1","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"1"},
    "t":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"1","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "t͈":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"1","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "tʰ":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"1","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"1"},
    "k":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"1","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "k͈":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"1","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "kʰ":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"1","palatal":"0","palatalized":"0","affricate":"0","aspirated":"1"},
    "tɕ":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"1","dorsal":"0","palatal":"1","palatalized":"0","affricate":"1","aspirated":"0"},
    "tɕ͈":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"1","dorsal":"0","palatal":"1","palatalized":"0","affricate":"1","aspirated":"0"},
    "tɕʰ":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"1","dorsal":"0","palatal":"1","palatalized":"0","affricate":"1","aspirated":"1"},
    "s":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"1","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "s͈":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"1","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "m":{"consonantal":"1","sonorant":"1","syllabic":"0","voice":"1","continuant":"0","nasal":"1","lateral":"0","rhotic":"0","labial":"1","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "n":{"consonantal":"1","sonorant":"1","syllabic":"0","voice":"1","continuant":"0","nasal":"1","lateral":"0","rhotic":"0","labial":"0","coronal":"1","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "ŋ":{"consonantal":"1","sonorant":"1","syllabic":"0","voice":"1","continuant":"0","nasal":"1","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"1","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "ɾ":{"consonantal":"1","sonorant":"1","syllabic":"0","voice":"1","continuant":"1","nasal":"0","lateral":"0","rhotic":"1","labial":"0","coronal":"1","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "l":{"consonantal":"1","sonorant":"1","syllabic":"0","voice":"1","continuant":"1","nasal":"0","lateral":"1","rhotic":"0","labial":"0","coronal":"1","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"},
    "h":{"consonantal":"1","sonorant":"0","syllabic":"0","voice":"0","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"}}
    vowels={"i":{"consonantal":"0","sonorant":"0","syllabic":"1","voice":"na","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0","height":"close","backness":"front","rounded":"0"},
    "ɛ":{"consonantal":"0","sonorant":"0","syllabic":"1","voice":"na","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0","height":"open-mid","backness":"front","rounded":"0"},
    "a":{"consonantal":"0","sonorant":"0","syllabic":"1","voice":"na","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0","height":"open","backness":"central","rounded":"0"},
    "ʌ":{"consonantal":"0","sonorant":"0","syllabic":"1","voice":"na","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0","height":"open-mid","backness":"back","rounded":"0"},
    "o":{"consonantal":"0","sonorant":"0","syllabic":"1","voice":"na","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0","height":"close-mid","backness":"back","rounded":"1"},
    "u":{"consonantal":"0","sonorant":"0","syllabic":"1","voice":"na","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0","height":"close","backness":"back","rounded":"1"},
    "ɯ":{"consonantal":"0","sonorant":"0","syllabic":"1","voice":"na","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0","height":"close","backness":"back","rounded":"0"}}
    if ipa in table:return table[ipa]
    if ipa in vowels:return vowels[ipa]
    return {}

def source_features_for_ipa(ipa):
    base=ipa.replace("ɡ","g")
    return _feature_vector_for_ipa(base)

def map_ipa_to_ukrainian(ipa,target_adapter=None,source_features=None,weights=None):
    adapter=target_adapter if isinstance(target_adapter,UkrainianTargetAdapter) else UkrainianTargetAdapter()
    source_features=source_features or source_features_for_ipa(ipa)
    return {"ipa":ipa,"source_features":source_features,"target":adapter.candidates(source_features,weights or DEFAULT_WEIGHTS)}

def rank_ukrainian_candidates(candidates):
    return sorted(candidates,key=lambda x:(x.get("score",float("inf")),x.get("candidate_id","")))

def transliterate_korean(text,*,rule_ids=None,boundary_mode="unknown",ipa_level="broad",target_adapter=None):
    surface=phoneticize_korean(text,rule_ids=rule_ids,boundary_mode=boundary_mode,ipa_level=ipa_level)
    target=map_ipa_to_ukrainian(surface["ipa"]["ipa"],target_adapter)
    candidates=target["target"]["candidates"]
    return {"input":text,"orthography":analyze_korean(text),"phonology":phonologize_korean(text),"phonetics":surface,"ipa":surface["ipa"],"candidates":candidates,"selected_candidate":candidates[0] if candidates else None,"score_type":"heuristic_cost","confidence":None,"sources":["S001","S003","S004","S005"],"analysis_status":"research-prototype"}
