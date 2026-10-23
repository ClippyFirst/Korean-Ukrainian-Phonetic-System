from __future__ import annotations
import csv
import sysconfig
from pathlib import Path
from .hangul import decompose_hangul, compose_hangul
from .phonology import parse_syllables, L_JAMO, V_JAMO, T_JAMO
from .rules import apply_ordered_rules
from .ipa import generate_vowel_variants, realize_syllables
from .ukrainian_adapter import UkrainianTargetAdapter
from .orthography import render_sequence

_LEXICON_PATH=Path(__file__).resolve().parents[2]/"data"/"korean"/"lexical_pronunciations.csv"
_INSTALLED_LEXICON_PATH=Path(sysconfig.get_path("data"))/"share"/"korean-ukrainian-phonetic-system"/"lexical_pronunciations.csv"

def _load_lexicon():
    # Prefer the single source file in a checkout; use the packaged data-file
    # path for wheel installs where the repository-level data directory is absent.
    # Dated addition batches (lexical_additions_*.csv) overlay the base lexicon.
    base = {}
    for path in (_LEXICON_PATH,_INSTALLED_LEXICON_PATH):
        try:
            with path.open(encoding="utf-8-sig",newline="") as stream:
                base = {row["input"]:row for row in csv.DictReader(stream) if row.get("input")}
                break
        except FileNotFoundError:
            continue
    additions_dirs = {_LEXICON_PATH.parent, _INSTALLED_LEXICON_PATH.parent}
    for additions_dir in sorted(additions_dirs, key=str):
        if additions_dir.is_dir():
            for add_path in sorted(additions_dir.glob("lexical_additions_*.csv")):
                try:
                    with add_path.open(encoding="utf-8-sig",newline="") as stream:
                        for row in csv.DictReader(stream):
                            if row.get("input"):
                                base[row["input"]] = row
                except FileNotFoundError:
                    continue
    return base

LEXICAL_PRONUNCIATIONS=_load_lexicon()

def _apply_lexical_pronunciations(items):
    """Apply exact, sourced lexical forms after general rules; never generalize by spelling alone."""
    from .phonology import parse_syllables
    traces=[]
    i=0
    while i<len(items):
        j=i+1
        while j<len(items) and items[j-1].boundary_after!="word":
            j+=1
        group=items[i:j]
        word="".join(s.text for s in group)
        entry=LEXICAL_PRONUNCIATIONS.get(word)
        if entry:
            surface=parse_syllables(entry["surface_hangul"])
            if len(surface)!=len(group):
                traces.append({
                    "rule_id":"LEXICON","name":"lexical-pronunciation","changed":False,
                    "status":"invalid-entry","confidence":entry.get("confidence","unknown"),
                    "source":entry.get("source_url",""),
                    "notes":f"syllable count mismatch for {word}: {len(group)} != {len(surface)}"
                })
            else:
                before=[s.to_dict() for s in group]
                for target,source in zip(group,surface):
                    target.onset,target.nucleus,target.coda=source.onset,source.nucleus,source.coda
                traces.append({
                    "rule_id":"LEXICON","name":"lexical-pronunciation","changed":before != [s.to_dict() for s in group],
                    "before":before,"after":[s.to_dict() for s in group],
                    "status":"lexical-override","confidence":entry.get("confidence","unknown"),
                    "source":entry.get("source_url",""),"license_context":entry.get("rule_notes","")
                })
        i=j
    return traces

DEFAULT_WEIGHTS={"consonantal":2.0,"sonorant":1.5,"syllabic":1.0,"voice":1.0,"continuant":1.5,"nasal":1.5,"lateral":1.0,"rhotic":1.0,"labial":1.5,"coronal":1.5,"dorsal":1.5,"palatal":2.0,"palatalized":1.5,"affricate":1.5,"aspirated":0.5,"long":0.5}

def analyze_korean(text):
    for i, c in enumerate(text):
        if c.isspace():
            continue
        if not ("가" <= c <= "힣"):
            raise ValueError(f"unsupported non-Hangul character at index {i}: {c!r}")
    return [{"orthography":c,"decomposition":decompose_hangul(c)} for c in text if "가"<=c<="힣"]

def phonologize_korean(text):
    items=parse_syllables(text)
    return {"input":text,"syllables":[x.to_dict() for x in items],"analysis_status":"canonical_structural_representation"}

def _render_surface_hangul(items):
    """Compose the current phonological state back into inspectable Hangul.

    Syllable.text intentionally remains the source orthography for tracing.
    This renderer uses the mutable onset/nucleus/coda fields, making the
    research engine's surface-form boundary explicit instead of forcing
    callers to infer it from source text mixed with changed jamo fields.
    """
    rendered=[]
    for item in items:
        try:
            indices={
                "L":L_JAMO.index(item.onset),
                "V":V_JAMO.index(item.nucleus),
                "T":T_JAMO.index(item.coda),
            }
        except ValueError as exc:
            raise ValueError(
                f"cannot compose research surface for syllable {item.text!r}: "
                f"{item.onset!r}/{item.nucleus!r}/{item.coda!r}"
            ) from exc
        rendered.append(compose_hangul(indices))
        if item.boundary_after=="word":
            rendered.append(" ")
    return "".join(rendered).strip()

def _apply_lexical_ipa(items,ipa_result):
    """Use sourced surface IPA for matched forms without overriding phonemic mode."""
    if ipa_result.get("level")!="broad":
        return ipa_result
    syllable_ipa=list(ipa_result["syllables"])
    i=0
    while i<len(items):
        j=i+1
        while j<len(items) and items[j-1].boundary_after!="word":
            j+=1
        word="".join(s.text for s in items[i:j])
        entry=LEXICAL_PRONUNCIATIONS.get(word)
        if entry:
            values=entry.get("ipa_syllables","").split("|")
            if len(values)==j-i and all(values):
                syllable_ipa[i:j]=values
        i=j
    rendered=syllable_ipa[0] if syllable_ipa else ""
    for i in range(1,len(syllable_ipa)):
        separator=" " if items[i-1].boundary_after=="word" else "."
        rendered+=separator+syllable_ipa[i]
    ipa_result["syllables"]=syllable_ipa
    ipa_result["ipa"]=rendered
    # Recompute §4 alternatives after lexical IPA has restored sourced length
    # and segment detail, so variants inherit the exact primary syllables.
    ipa_result["variants"]=generate_vowel_variants(items,syllable_ipa,level=ipa_result.get("level","broad"))
    return ipa_result

def phoneticize_korean(text,*,rule_ids=None,boundary_mode="same_word",ipa_level="broad",n_insertion_licensed=False,rule_licenses=None,morphology_mode="strict"):
    items=parse_syllables(text)
    items,traces=apply_ordered_rules(items,rule_ids,boundary_mode=boundary_mode,n_insertion_licensed=n_insertion_licensed,rule_licenses=rule_licenses,morphology_mode=morphology_mode)
    lexical_traces=_apply_lexical_pronunciations(items)
    surface_hangul=_render_surface_hangul(items)
    ipa=_apply_lexical_ipa(items,realize_syllables(items,level=ipa_level))
    return {
        "input":text,
        "surface_hangul":surface_hangul,
        "surface_syllables":[x.to_dict() for x in items],
        "rules":[x.to_dict() for x in traces]+lexical_traces,
        "ipa":ipa,
        "morphology_mode":morphology_mode,
        "surface_status":"rule-and-lexicon-derived-research-analysis",
    }

def _feature_vector_for_ipa(ipa:str)->dict:
    if ipa=="g": ipa="ɡ"
    consonants={"p":("0","0","1","0","0","0","0","0"),"p͈":("0","0","1","0","0","0","0","0"),"pʰ":("0","0","1","0","0","0","0","1"),"t":("0","1","0","0","0","0","0","0"),"t͈":("0","1","0","0","0","0","0","0"),"tʰ":("0","1","0","0","0","0","0","1"),"k":("0","0","0","1","0","0","0","0"),"k͈":("0","0","0","1","0","0","0","0"),"kʰ":("0","0","0","1","0","0","0","1"),"tɕ":("0","1","0","0","0","1","0","0"),"tɕ͈":("0","1","0","0","0","1","0","0"),"tɕʰ":("0","1","0","0","0","1","0","1"),"dʑ":("0","1","0","0","0","0","0","0"),"s":("0","1","0","0","1","0","0","0"),"ɕ":("0","1","0","0","1","0","0","0"),"s͈":("0","1","0","0","1","0","0","0"),"ɕ͈":("0","1","0","0","1","0","0","0"),"m":("1","0","1","0","0","1","0","0"),"n":("1","1","0","0","0","1","0","0"),"ŋ":("1","0","0","1","0","1","0","0"),"ɾ":("1","1","0","0","1","0","1","0"),"l":("1","1","0","0","1","0","0","0"),"h":("0","0","0","0","1","0","0","0"),"ɡ":("0","0","0","1","0","0","0","0"),"b":("0","0","1","0","0","0","0","0"),"d":("0","1","0","0","0","0","0","0"),"ɲ":("1","1","0","0","0","1","0","0")}
    if ipa in consonants:
        son,cor,lab,dor,cont,nas,rho,asp=consonants[ipa]
        return {"consonantal":"1","sonorant":son,"syllabic":"0","voice":"1" if ipa in {"m","n","ŋ","ɲ","ɾ","l","dʑ","ɡ","b","d"} else "0","continuant":cont,"nasal":nas,"lateral":"1" if ipa=="l" else "0","rhotic":rho,"labial":lab,"coronal":cor,"dorsal":dor,"palatal":"1" if ipa.startswith("tɕ") or ipa.startswith("ɕ") or ipa in {"dʑ","ɲ"} else "0","palatalized":"1" if ipa.startswith("ɕ") else "0","affricate":"1" if ipa.startswith("tɕ") or ipa=="dʑ" else "0","aspirated":asp}
    vowels={"i":("close","front","0"),"ɛ":("open-mid","front","0"),"a":("open","central","0"),"ʌ":("open-mid","back","0"),"o":("close-mid","back","1"),"u":("close","back","1"),"ɯ":("close","back","0"),"e":("close-mid","front","0"),"ø":("close-mid","front","1"),"y":("close","front","1")}
    if ipa in vowels:
        h,b,r=vowels[ipa]
        return {"consonantal":"0","sonorant":"0","syllabic":"1","voice":"na","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0","height":h,"backness":b,"rounded":r}
    if ipa=="j": return {"consonantal":"1","sonorant":"1","syllabic":"0","voice":"1","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"1","palatalized":"0","affricate":"0","aspirated":"0"}
    if ipa=="w": return {"consonantal":"1","sonorant":"1","syllabic":"0","voice":"1","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"1","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"}
    if ipa=="ɰ": return {"consonantal":"1","sonorant":"1","syllabic":"0","voice":"1","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"1","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"}
    return {}

def source_features_for_ipa(ipa:str)->dict: return _feature_vector_for_ipa(ipa)

_IPA_SEGMENT_INVENTORY=("tɕ͈","tɕʰ","tɕ","dʑ","ɕ͈","ɕ","s͈","pʰ","tʰ","kʰ","p͈","t͈","k͈","ɡ","g","ɾ","ŋ","ɲ","ɯ","ʌ","ɛ","ø","ɰ","j","w","p","t","k","b","d","m","n","s","h","a","e","o","u","i","l","y")
_IPA_VOWEL_TOKENS={"a","e","i","o","u","y","ɯ","ʌ","ɛ","ø"}

def tokenize_ipa_with_modifiers(ipa:str)->list[dict]:
    """Tokenize IPA while retaining length as metadata on its preceding vowel.

    Length is not a standalone segment and is not currently rendered as a
    separate Ukrainian grapheme. It must nevertheless survive the IPA adapter
    boundary for auditability. Unsupported modifiers fail closed instead of
    being silently discarded.
    """
    tokens=[]; i=0; syllable_start=0
    while i<len(ipa):
        char=ipa[i]
        if char in ".# " or char.isspace():
            syllable_start=len(tokens)
            i+=1
            continue
        if char=="ː":
            # Some lexical rows place the length mark after the coda (e.g.
            # anː), although length belongs to the vowel nucleus. Associate
            # it with the last supported vowel in this syllable, not blindly
            # with the immediately preceding segment.
            vowel=next((token for token in reversed(tokens[syllable_start:])
                        if token["segment"] in _IPA_VOWEL_TOKENS),None)
            if vowel is None:
                raise ValueError(f"IPA length mark at index {i} has no supported vowel in its syllable")
            if vowel["long"]:
                raise ValueError(f"duplicate IPA length mark at index {i} in the same syllable")
            vowel["long"]=True
            i+=1
            continue
        if char=="̚":
            # A combining diacritic belongs to the immediately preceding stop
            # in the same syllable; never attach it across a syllable boundary
            # or to a vowel/sonorant just because a token exists globally.
            if len(tokens)<=syllable_start:
                raise ValueError(f"IPA unreleased-stop diacritic at index {i} has no preceding segment in its syllable")
            previous=tokens[-1]
            stop_segments={"p","p͈","pʰ","b","t","t͈","tʰ","d","k","k͈","kʰ","ɡ"}
            if previous["segment"] not in stop_segments:
                raise ValueError(f"IPA unreleased-stop diacritic at index {i} follows non-stop segment {previous['segment']!r}")
            if previous["unreleased"]:
                raise ValueError(f"duplicate IPA unreleased-stop diacritic at index {i}")
            previous["unreleased"]=True
            i+=1
            continue
        match=next((x for x in _IPA_SEGMENT_INVENTORY if ipa.startswith(x,i)),None)
        if match is None:
            raise ValueError(f"unsupported IPA segment or modifier at index {i}: {ipa[i]!r}")
        tokens.append({"segment":"ɡ" if match=="g" else match,"long":False,"unreleased":False})
        i+=len(match)
    return tokens

def tokenize_ipa(ipa:str)->list[str]:
    """Return segment tokens for compatibility; use the metadata API for audits."""
    return [item["segment"] for item in tokenize_ipa_with_modifiers(ipa)]

def map_ipa_to_ukrainian(ipa,target_adapter=None,source_features=None,weights=None):
    adapter=target_adapter if isinstance(target_adapter,UkrainianTargetAdapter) else UkrainianTargetAdapter()
    weights=weights or DEFAULT_WEIGHTS
    tokens=tokenize_ipa_with_modifiers(ipa)
    grouped=[]
    for index,item in enumerate(tokens):
        segment=item["segment"]
        features=source_features if source_features and len(tokens)==1 else source_features_for_ipa(segment)
        grouped.append({
            "source_ipa":segment,
            "source_features":features,
            "source_length":"long" if item["long"] else "unspecified",
            "source_diacritics":{"unreleased":item["unreleased"]},
            "length_adaptation_status":"preserved-in-analysis-not-rendered" if item["long"] else "not-marked",
            "target":adapter.candidates(features,weights,source_ipa=segment)
        })
    return {"ipa":ipa,"segments":grouped,"status":"segmentwise-candidate-analysis"}

def rank_ukrainian_candidates(candidates):
    return sorted(candidates,key=lambda x:(x.get("score",float("inf")),x.get("candidate_id","")))

def _select_target(target):
    selected=[]
    for segment in target["segments"]:
        candidates=segment["target"].get("candidates",[])
        # A feature-near target phoneme is not a licensed correspondence by itself.
        # Require an explicit IPA-to-target mapping and a renderable Ukrainian
        # grapheme; otherwise this segment remains unresolved instead of guessing.
        licensed=[candidate for candidate in candidates
                  if candidate.get("mapping_id") and candidate.get("grapheme")]
        if not licensed: return None
        selected.append(licensed[0])
    return {"segments":selected,"score_type":"heuristic_cost","status":"top_ranked_segmentwise"}

def transliterate_korean(text,*,rule_ids=None,boundary_mode="same_word",ipa_level="broad",target_adapter=None,n_insertion_licensed=False,rule_licenses=None,morphology_mode="strict"):
    surface=phoneticize_korean(text,rule_ids=rule_ids,boundary_mode=boundary_mode,ipa_level=ipa_level,n_insertion_licensed=n_insertion_licensed,rule_licenses=rule_licenses,morphology_mode=morphology_mode)
    target=map_ipa_to_ukrainian(surface["ipa"]["ipa"],target_adapter)
    selected=_select_target(target)
    orthographic=render_sequence(selected["segments"]) if selected else None
    lexical=LEXICAL_PRONUNCIATIONS.get(text)
    lexical_reference="".join(lexical["target_syllables"].split("|")) if lexical and lexical.get("target_syllables") else None
    lexical_reference_status=lexical.get("target_status","model-selected") if lexical_reference is not None else None
    if lexical_reference is None:
        lexical_comparison="no_lexical_reference"
    elif orthographic is None:
        lexical_comparison="unavailable_without_ipa_target"
    else:
        lexical_comparison="matches_reference" if orthographic==lexical_reference else "differs_from_reference"
    # The lexical target is an audit reference only. Never use a stored Ukrainian
    # target to bypass the required IPA -> Ukrainian inventory adapter boundary.
    target_status="model-selected" if selected else "unresolved"
    selection_status=("top-ranked segmentwise IPA-derived heuristic candidate; not probability"
                      if selected else "unavailable_without_target_inventory")
    return {"input":text,"orthography":analyze_korean(text),"phonology":phonologize_korean(text),"phonetics":surface,"ipa":surface["ipa"],"target_analysis":target,"candidates":[g["target"]["candidates"] for g in target["segments"]],"selected_candidate":selected,"ukrainian_orthography":orthographic,"target_status":target_status,"lexical_target_reference":lexical_reference,"lexical_target_reference_status":lexical_reference_status,"lexical_target_comparison":lexical_comparison,"score_type":"heuristic_cost","confidence":None,"selection_status":selection_status,"sources":["S001","S003","S004","S005"],"analysis_status":"research-prototype","morphology_mode":morphology_mode}
