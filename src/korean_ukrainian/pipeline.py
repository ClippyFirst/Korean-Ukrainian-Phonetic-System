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
from .ipa_target_renderer import render_ipa_sequence_to_ukrainian

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

def _validate_korean_input(text):
    """Reject empty and non-Hangul input consistently at every public stage."""
    if not isinstance(text, str):
        raise TypeError("Korean input must be a string")
    for i, char in enumerate(text):
        if char.isspace():
            continue
        if not ("가" <= char <= "힣"):
            raise ValueError(f"unsupported non-Hangul character at index {i}: {char!r}")
    if not any("가" <= char <= "힣" for char in text):
        raise ValueError("input must contain at least one precomposed Hangul syllable")

def analyze_korean(text):
    _validate_korean_input(text)
    return [{"orthography":c,"decomposition":decompose_hangul(c)} for c in text if "가"<=c<="힣"]

def phonologize_korean(text):
    _validate_korean_input(text)
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
    # Preserve explicitly licensed lexical alternatives as separate typed
    # candidates. They are not silently selected as the Ukrainian target.
    lexical_alternatives=[]
    i=0
    while i<len(items):
        j=i+1
        while j<len(items) and items[j-1].boundary_after!="word":
            j+=1
        word="".join(s.text for s in items[i:j])
        entry=LEXICAL_PRONUNCIATIONS.get(word)
        if entry:
            alternate=entry.get("alternate_ipa_syllables","").split("|")
            if len(alternate)==j-i and all(alternate):
                alternate_ipa=alternate[0]
                for k in range(1,len(alternate)):
                    alternate_ipa+=(" " if items[i+k-1].boundary_after=="word" else ".")+alternate[k]
                lexical_alternatives.append({
                    "input":word,
                    "surface_hangul":entry.get("alternate_surface_hangul",""),
                    "ipa":alternate_ipa,
                    "status":entry.get("ipa_adjudication_status") or "provisional",
                    "source":entry.get("source_url",""),
                })
        i=j
    # The target adapter must not consume these as approved alternatives until the case gate clears.
    ipa_result["lexical_alternatives"]=lexical_alternatives
    # Recompute §4 alternatives after lexical IPA has restored sourced length
    # and segment detail, so variants inherit the exact primary syllables.
    ipa_result["variants"]=generate_vowel_variants(items,syllable_ipa,level=ipa_result.get("level","broad"))
    return ipa_result

def _unlicensed_ambiguous_pronunciation_contexts(traces, final_items):
    """Find withheld morphophonological contexts before they become definitive IPA.

    Exact source-backed lexical entries resolve their own full-word pronunciation.
    For unlicensed contexts, keep diagnostic IPA inspectable but prevent target
    rendering from treating that guessed path as a validated pronunciation.
    """
    complex_codas = {"ㄳ", "ㄵ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅄ"}
    representative = {"ㄳ": "ㄱ", "ㄵ": "ㄴ", "ㄶ": "ㄴ", "ㄺ": "ㄱ", "ㄻ": "ㅁ",
                      "ㄼ": "ㄹ", "ㄽ": "ㄹ", "ㄾ": "ㄹ", "ㄿ": "ㅂ", "ㅀ": "ㄹ",
                      "ㅄ": "ㅂ", "ㅅ": "ㄷ", "ㅆ": "ㄷ", "ㅈ": "ㄷ", "ㅊ": "ㄷ",
                      "ㅌ": "ㄷ", "ㅎ": "ㄷ", "ㄲ": "ㄱ", "ㅋ": "ㄱ", "ㅍ": "ㅂ"}
    findings = []
    seen = set()
    for trace in traces:
        if trace.get("status") not in {"conditional-disabled", "partially-conditional"}:
            continue
        rule_id = trace.get("rule_id")
        if rule_id not in {"R002", "R003", "R004", "R007", "R008", "R013"}:
            continue
        before = trace.get("before") or []
        for i in range(len(before) - 1):
            a, b = before[i], before[i + 1]
            if a.get("boundary_after") == "word":
                continue
            coda, onset, nucleus = a.get("coda", ""), b.get("onset", ""), b.get("nucleus", "")
            candidate = False
            reason = ""
            if rule_id == "R002" and onset == "ㅇ":
                candidate = coda in complex_codas or (
                    coda in representative and representative[coda] != coda
                    and nucleus in {"ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅟ"}
                )
                reason = "liaison/neutralization requires exact morpheme evidence"
            elif rule_id == "R003" and coda in {"ㅎ", "ㄶ", "ㅀ"} and onset == "ㅇ":
                candidate = True
                reason = "ㅎ-coda deletion requires an ending/suffix license"
            elif rule_id == "R004" and coda in complex_codas and onset == "ㅎ":
                candidate = True
                reason = "complex-coda + ㅎ aspiration requires exact morphophonemic evidence"
            elif rule_id == "R007" and coda in {"ㄷ", "ㅌ", "ㄾ"} and onset == "ㅇ" and nucleus == "ㅣ":
                candidate = True
                reason = "palatalization requires exact formal-morpheme evidence"
            elif rule_id == "R008" and coda == "ㄺ" and onset == "ㄱ":
                candidate = True
                reason = "ㄺ-before-ㄱ fortition depends on lexical/morphological class"
            elif rule_id == "R013" and coda == "ㄹ" and onset == "ㄱ" and b.get("text") == "게":
                # NIKL Standard Pronunciation Rule 27's attached ending -ㄹ게
                # is explicitly documented as [ㄹ께]. Keep this narrow so
                # unrelated lexical sequences such as 일본/실수 are not
                # falsely treated as unresolved adnominal constructions.
                candidate = True
                reason = "the -ㄹ게 ending requires fortition evidence or a licensed morphology mode"
            if not candidate:
                continue
            # A later rule may have resolved this exact pair. Do not mark it
            # unresolved when the final onset differs from the withheld trace.
            if i + 1 < len(final_items) and final_items[i + 1].onset != onset:
                continue

            start = i
            while start > 0 and before[start - 1].get("boundary_after") != "word":
                start -= 1
            end = i + 1
            while end < len(before) and before[end - 1].get("boundary_after") != "word":
                end += 1
            word = "".join(item.get("text", "") for item in before[start:end])
            entry = LEXICAL_PRONUNCIATIONS.get(word)
            if entry:
                values = entry.get("ipa_syllables", "").split("|")
                if len(values) == end - start and all(values):
                    continue
            key = (rule_id, word, f"{a.get('text', '')}>{b.get('text', '')}")
            if key in seen:
                continue
            seen.add(key)
            findings.append({
                "rule_id": rule_id,
                "input_span": word,
                "pair": key[2],
                "reason": reason,
                "source": trace.get("source"),
                "status": "unresolved-no-exact-license",
            })
    return findings


def phoneticize_korean(text,*,rule_ids=None,boundary_mode="same_word",ipa_level="broad",n_insertion_licensed=False,rule_licenses=None,morphology_mode="strict"):
    _validate_korean_input(text)
    items=parse_syllables(text)
    items,traces=apply_ordered_rules(items,rule_ids,boundary_mode=boundary_mode,n_insertion_licensed=n_insertion_licensed,rule_licenses=rule_licenses,morphology_mode=morphology_mode)
    lexical_traces=_apply_lexical_pronunciations(items)
    surface_hangul=_render_surface_hangul(items)
    ipa=_apply_lexical_ipa(items,realize_syllables(items,level=ipa_level))
    all_traces=[x.to_dict() for x in traces]+lexical_traces
    unresolved_contexts=_unlicensed_ambiguous_pronunciation_contexts(all_traces, items)
    # A lexicon entry may have directly attested Korean surface Hangul while
    # its IPA rendering remains unreviewed. Do not let a lexical override
    # silently promote project-generated IPA to an accepted pronunciation.
    i=0
    while i<len(items):
        j=i+1
        while j<len(items) and items[j-1].boundary_after!="word":
            j+=1
        word="".join(s.text for s in items[i:j])
        entry=LEXICAL_PRONUNCIATIONS.get(word)
        if entry and entry.get("ipa_adjudication_status")=="diagnostic_only_unresolved_pronunciation":
            unresolved_contexts.append({
                "rule_id":"IPA_ADJUDICATION",
                "input_span":word,
                "reason":"source-backed Korean surface spelling exists, but project IPA lacks independent adjudication",
                "source":entry.get("source_url",""),
                "status":"unresolved-ipa-adjudication",
            })
        i=j
    ipa_status="diagnostic_only_unresolved_pronunciation" if unresolved_contexts else "provisional"
    ipa_is_diagnostic_only=bool(unresolved_contexts)
    ipa_status_reason=(
        "independent_ipa_adjudication_required"
        if any(x.get("rule_id")=="IPA_ADJUDICATION" for x in unresolved_contexts)
        else "unresolved_morphophonological_context" if unresolved_contexts else None
    )
    # Mirror acceptance metadata inside the IPA payload as well as at the
    # analysis root. This protects clients that pass the IPA object around
    # without carrying the enclosing pronunciation analysis.
    ipa.update({
        "status":ipa_status,
        "is_diagnostic_only":ipa_is_diagnostic_only,
        "status_reason":ipa_status_reason,
    })
    return {
        "input":text,
        "surface_hangul":surface_hangul,
        "surface_syllables":[x.to_dict() for x in items],
        "rules":all_traces,
        "ipa":ipa,
        "morphology_mode":morphology_mode,
        "surface_status":"rule-and-lexicon-derived-research-analysis",
        "pronunciation_status":"unresolved" if unresolved_contexts else "provisional",
        # Keep diagnostic IPA inspectable for research, but make its acceptance
        # status explicit at the same API level as the IPA value. Downstream
        # callers must not infer that a syntactically valid IPA string is
        # approved when a morphophonological context remains unresolved.
        "ipa_status":ipa_status,
        "ipa_is_diagnostic_only":ipa_is_diagnostic_only,
        "ipa_status_reason":ipa_status_reason,
        "unresolved_contexts":unresolved_contexts,
    }

def _feature_vector_for_ipa(ipa:str)->dict:
    if ipa=="g": ipa="ɡ"
    consonants={"p":("0","0","1","0","0","0","0","0"),"p͈":("0","0","1","0","0","0","0","0"),"pʰ":("0","0","1","0","0","0","0","1"),"t":("0","1","0","0","0","0","0","0"),"t͈":("0","1","0","0","0","0","0","0"),"tʰ":("0","1","0","0","0","0","0","1"),"k":("0","0","0","1","0","0","0","0"),"k͈":("0","0","0","1","0","0","0","0"),"kʰ":("0","0","0","1","0","0","0","1"),"tɕ":("0","1","0","0","0","1","0","0"),"tɕ͈":("0","1","0","0","0","1","0","0"),"tɕʰ":("0","1","0","0","0","1","0","1"),"dʑ":("0","1","0","0","0","0","0","0"),"s":("0","1","0","0","1","0","0","0"),"ɕ":("0","1","0","0","1","0","0","0"),"s͈":("0","1","0","0","1","0","0","0"),"ɕ͈":("0","1","0","0","1","0","0","0"),"m":("1","0","1","0","0","1","0","0"),"n":("1","1","0","0","0","1","0","0"),"ŋ":("1","0","0","1","0","1","0","0"),"ɾ":("1","1","0","0","1","0","1","0"),"l":("1","1","0","0","1","0","0","0"),"h":("0","0","0","0","1","0","0","0"),"ɡ":("0","0","0","1","0","0","0","0"),"b":("0","0","1","0","0","0","0","0"),"d":("0","1","0","0","0","0","0","0"),"ɲ":("1","1","0","0","0","1","0","0")}
    if ipa in consonants:
        son,cor,lab,dor,cont,nas,rho,asp=consonants[ipa]
        return {"consonantal":"1","fortis":"1" if "͈" in ipa else "0","sonorant":son,"syllabic":"0","voice":"1" if ipa in {"m","n","ŋ","ɲ","ɾ","l","dʑ","ɡ","b","d"} else "0","continuant":cont,"nasal":nas,"lateral":"1" if ipa=="l" else "0","rhotic":rho,"labial":lab,"coronal":cor,"dorsal":dor,"palatal":"1" if ipa.startswith("tɕ") or ipa.startswith("ɕ") or ipa in {"dʑ","ɲ"} else "0","palatalized":"1" if ipa.startswith("ɕ") else "0","affricate":"1" if ipa.startswith("tɕ") or ipa=="dʑ" else "0","aspirated":asp}
    vowels={"i":("close","front","0"),"ɛ":("open-mid","front","0"),"a":("open","central","0"),"ʌ":("open-mid","back","0"),"o":("close-mid","back","1"),"u":("close","back","1"),"ɯ":("close","back","0"),"e":("close-mid","front","0"),"ø":("close-mid","front","1"),"y":("close","front","1")}
    if ipa in vowels:
        h,b,r=vowels[ipa]
        return {"consonantal":"0","fortis":"0","sonorant":"0","syllabic":"1","voice":"na","continuant":"0","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0","height":h,"backness":b,"rounded":r}
    if ipa=="j": return {"consonantal":"1","fortis":"0","sonorant":"1","syllabic":"0","voice":"1","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"0","palatal":"1","palatalized":"0","affricate":"0","aspirated":"0"}
    if ipa=="w": return {"consonantal":"1","fortis":"0","sonorant":"1","syllabic":"0","voice":"1","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"1","coronal":"0","dorsal":"0","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"}
    if ipa=="ɰ": return {"consonantal":"1","fortis":"0","sonorant":"1","syllabic":"0","voice":"1","continuant":"1","nasal":"0","lateral":"0","rhotic":"0","labial":"0","coronal":"0","dorsal":"1","palatal":"0","palatalized":"0","affricate":"0","aspirated":"0"}
    return {}

def source_features_for_ipa(ipa:str)->dict: return _feature_vector_for_ipa(ipa)

_IPA_SEGMENT_INVENTORY=("tɕ͈","tɕʰ","tɕ","dʑ","ɕ͈","ɕ","s͈","pʰ","tʰ","kʰ","p͈","t͈","k͈","ɡ","g","ɾ","ŋ","ɲ","ɯ","ʌ","ɛ","ø","ɰ","j","w","p","t","k","b","d","m","n","s","h","a","e","o","u","i","l","y")
_IPA_VOWEL_TOKENS={"a","e","i","o","u","y","ɯ","ʌ","ɛ","ø"}

def tokenize_ipa_with_modifiers(ipa:str)->list[dict]:
    """Tokenize IPA while preserving boundaries and modifier metadata.

    The compatibility tokenizer exposes only segment strings, but the research
    adapter retains source syllable/word indices and the boundary before each
    segment. Length is analysis metadata, not a Ukrainian grapheme. Unsupported
    modifiers and invalid modifier placement fail closed.
    """
    tokens=[]; i=0; syllable_start=0
    syllable_index=0; word_index=0; pending_boundary="start"
    last_boundary_token_count=-1
    while i<len(ipa):
        char=ipa[i]
        if char==".":
            if tokens and last_boundary_token_count!=len(tokens):
                syllable_index+=1
                last_boundary_token_count=len(tokens)
            if pending_boundary!="word":
                pending_boundary="syllable"
            syllable_start=len(tokens)
            i+=1
            continue
        if char=="#" or char.isspace():
            if tokens:
                if last_boundary_token_count!=len(tokens):
                    syllable_index+=1
                    word_index+=1
                    last_boundary_token_count=len(tokens)
                elif pending_boundary!="word":
                    word_index+=1
            pending_boundary="word"
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
        tokens.append({
            "segment":"ɡ" if match=="g" else match,
            "long":False,
            "unreleased":False,
            "syllable_index":syllable_index,
            "word_index":word_index,
            "boundary_before":pending_boundary,
        })
        pending_boundary="within"
        i+=len(match)
    return tokens

def tokenize_ipa(ipa:str)->list[str]:
    """Return segment tokens for compatibility; use the metadata API for audits."""
    return [item["segment"] for item in tokenize_ipa_with_modifiers(ipa)]

def map_ipa_to_ukrainian(ipa,target_adapter=None,source_features=None,weights=None):
    # This public boundary can be called without Korean orthographic input.
    # Validate before loading the optional target inventory so invalid/empty
    # IPA cannot look like a successful zero-segment analysis.
    if not isinstance(ipa,str):
        raise TypeError("IPA input must be a string")
    tokens=tokenize_ipa_with_modifiers(ipa)
    if not tokens:
        raise ValueError("IPA input must contain at least one supported segment")
    adapter=target_adapter if isinstance(target_adapter,UkrainianTargetAdapter) else UkrainianTargetAdapter()
    weights=weights or DEFAULT_WEIGHTS
    grouped=[]
    for index,item in enumerate(tokens):
        segment=item["segment"]
        features=source_features if source_features and len(tokens)==1 else source_features_for_ipa(segment)
        grouped.append({
            "source_ipa":segment,
            "source_features":features,
            "source_length":"long" if item["long"] else "unspecified",
            "source_diacritics":{"unreleased":item["unreleased"]},
            "source_syllable_index":item["syllable_index"],
            "source_word_index":item["word_index"],
            "source_boundary_before":item["boundary_before"],
            "length_adaptation_status":"preserved-in-analysis-not-rendered" if item["long"] else "not-marked",
            "target":adapter.candidates(features,weights,source_ipa=segment)
        })
    return {"ipa":ipa,"segments":grouped,"status":"segmentwise-candidate-analysis"}

def rank_ukrainian_candidates(candidates):
    return sorted(candidates,key=lambda x:(x.get("score",float("inf")),x.get("candidate_id","")))

def _select_target(target):
    # Empty IPA is not a successful zero-segment transcription. Fail closed so
    # blank input cannot be reported as a selected Ukrainian target.
    if not target.get("segments"):
        return None
    selected=[]
    for segment in target["segments"]:
        candidates=segment["target"].get("candidates",[])
        # A feature-near target phoneme is not a licensed correspondence by itself.
        # Require an explicit IPA-to-target mapping and a renderable Ukrainian
        # grapheme; otherwise this segment remains unresolved instead of guessing.
        licensed=[candidate for candidate in candidates
                  if candidate.get("mapping_id") and candidate.get("grapheme")]
        if not licensed: return None
        chosen=dict(licensed[0])
        # Carry source provenance through candidate selection so the final
        # orthographic renderer can preserve word boundaries without inventing
        # a Ukrainian grapheme for a Korean syllable boundary.
        for key in ("source_ipa","source_features","source_length","source_diacritics",
                    "source_syllable_index","source_word_index","source_boundary_before"):
            chosen[key]=segment.get(key)
        selected.append(chosen)
    return {"segments":selected,"score_type":"heuristic_cost","status":"top_ranked_segmentwise"}


def _target_unavailable_reason(target):
    """Explain target abstention at the smallest inspectable IPA-segment boundary."""
    segments = target.get("segments", [])
    if not segments:
        return "no_target_segments", None, []

    first_target = segments[0].get("target", {})
    adapter_status = first_target.get("adapter", {}) if isinstance(first_target, dict) else {}
    if not adapter_status.get("available", False):
        return "target_inventory_unavailable", adapter_status or None, []
    error = str(adapter_status.get("error") or "")
    if error.startswith("mapping export unavailable:"):
        return "target_mapping_export_unavailable", adapter_status, []

    segment_reasons = []
    for segment in segments:
        target_result = segment.get("target", {})
        candidates = target_result.get("candidates", []) if isinstance(target_result, dict) else []
        licensed = [
            candidate for candidate in candidates
            if candidate.get("mapping_id") and candidate.get("grapheme")
        ]
        if licensed:
            continue
        if not candidates:
            reason = "no_target_candidates"
        elif any(candidate.get("mapping_id") and not candidate.get("grapheme")
                 for candidate in candidates):
            reason = "licensed_mapping_missing_grapheme"
        elif any(candidate.get("grapheme") and not candidate.get("mapping_id")
                 for candidate in candidates):
            reason = "grapheme_without_licensed_mapping"
        else:
            reason = "no_licensed_ipa_to_ukrainian_mapping"
        segment_reasons.append({
            "source_ipa": segment.get("source_ipa"),
            "reason": reason,
        })

    if not segment_reasons:
        # Defensive fallback: _select_target() and this diagnostic helper should
        # agree. Keep abstaining rather than inventing a target if they diverge.
        return "target_selection_inconsistent", adapter_status, []
    reasons = sorted({item["reason"] for item in segment_reasons})
    reason = reasons[0] if len(reasons) == 1 else "multiple_target_blockers"
    return reason, adapter_status, segment_reasons


def _target_inventory_diagnostic(ipa, target_adapter=None):
    """Keep UPI candidate analysis inspectable, but never use it as output authority."""
    try:
        target = map_ipa_to_ukrainian(ipa, target_adapter)
        selected = _select_target(target)
        if selected:
            reason, adapter_status, segment_reasons = None, None, []
            status = "selected"
        else:
            reason, adapter_status, segment_reasons = _target_unavailable_reason(target)
            status = "unavailable"
        return target, selected, {
            "status": status,
            "reason": reason,
            "adapter_status": adapter_status,
            "segment_reasons": segment_reasons,
        }
    except (TypeError, ValueError, OSError) as exc:
        return {
            "ipa": ipa,
            "segments": [],
            "status": "unavailable",
            "error": str(exc),
        }, None, {
            "status": "unavailable",
            "reason": "target_inventory_analysis_failed",
            "error": str(exc),
            "adapter_status": None,
            "segment_reasons": [],
        }


def render_ipa_analysis_to_ukrainian(
    text, word_analyses, *, pronunciation_surface, phonetics, ipa,
    pronunciation_engine, target_adapter=None, morphology_mode="unspecified",
):
    """Render Ukrainian practical orthography from IPA using local licensed correspondences.

    UPI remains the external source for Ukrainian phoneme/features/grapheme
    candidate analysis. Korean-specific source-to-target correspondence policy
    is owned downstream in canonical_correspondence.csv and explicit IPA
    sequence overrides. UPI availability is reported separately and cannot
    silently suppress or fabricate the actual IPA-derived output.
    """
    import re

    surface_tokens = re.findall(r"[가-힣]+|[^가-힣]+", pronunciation_surface)
    output_parts = []
    targets = []
    inventory_analyses = []
    unavailable_reasons = set()
    all_mapped = True
    word_index = 0
    output_statuses = []
    adapter = target_adapter if isinstance(target_adapter, UkrainianTargetAdapter) else UkrainianTargetAdapter()
    inventory_status = adapter.status()
    ipa_diagnostic_only = bool(
        (isinstance(ipa, dict) and ipa.get("is_diagnostic_only"))
        or (isinstance(phonetics, dict) and phonetics.get("ipa_is_diagnostic_only"))
    )

    for token in surface_tokens:
        if not re.fullmatch(r"[가-힣]+", token):
            output_parts.append(token)
            continue

        if word_index >= len(word_analyses):
            all_mapped = False
            unavailable_reasons.add("missing_word_ipa_analysis")
            targets.append({
                "surface_hangul": token,
                "ipa": None,
                "status": "unavailable",
                "reason": "missing_word_ipa_analysis",
                "renderer": "korean_ipa_correspondence",
                "mapping_trace": [],
            })
            word_index += 1
            continue

        word_ipa = word_analyses[word_index].get("ipa")
        word_index += 1
        if not word_ipa:
            all_mapped = False
            unavailable_reasons.add("empty_word_ipa_analysis")
            targets.append({
                "surface_hangul": token,
                "ipa": word_ipa,
                "status": "unavailable",
                "reason": "empty_word_ipa_analysis",
                "renderer": "korean_ipa_correspondence",
                "mapping_trace": [],
            })
            continue

        inventory_analysis, inventory_selected, inventory_diagnostic = _target_inventory_diagnostic(
            word_ipa, adapter
        )
        inventory_analyses.append({
            "surface_hangul": token,
            "ipa": word_ipa,
            "analysis": inventory_analysis,
            "summary": inventory_diagnostic,
        })

        if ipa_diagnostic_only:
            local = {
                "ipa": word_ipa,
                "status": "unavailable",
                "reason": "diagnostic_ipa_not_accepted",
                "ukrainian_orthography": None,
                "segments": [],
                "ignored_source_markers": [],
            }
        else:
            local = render_ipa_sequence_to_ukrainian(word_ipa)

        if local.get("ukrainian_orthography") is None:
            all_mapped = False
            reason = local.get("reason") or "target_mapping_unavailable"
            unavailable_reasons.add(reason)
            targets.append({
                "surface_hangul": token,
                "ipa": word_ipa,
                "status": "unavailable",
                "reason": reason,
                "renderer": "korean_ipa_correspondence",
                "mapping_trace": local.get("segments", []),
                "unmapped_fragment": local.get("unmapped_fragment"),
                "unmapped_offset": local.get("unmapped_offset"),
                "ignored_source_markers": local.get("ignored_source_markers", []),
                "target_inventory_analysis_status": inventory_diagnostic["status"],
                "target_inventory_unavailable_reason": inventory_diagnostic["reason"],
                "target_inventory_segment_reasons": inventory_diagnostic["segment_reasons"],
                "target_inventory_adapter_status": inventory_diagnostic["adapter_status"],
            })
            continue

        output_parts.append(local["ukrainian_orthography"])
        output_statuses.append(local["status"])
        targets.append({
            "surface_hangul": token,
            "ipa": word_ipa,
            "status": local["status"],
            "renderer": local["renderer"],
            "ukrainian_orthography": local["ukrainian_orthography"],
            "mapping_trace": local["segments"],
            "ignored_source_markers": local.get("ignored_source_markers", []),
            "length_adaptation_status": local.get("length_adaptation_status"),
            "target_inventory_analysis_status": inventory_diagnostic["status"],
            "target_inventory_unavailable_reason": inventory_diagnostic["reason"],
            "target_inventory_segment_reasons": inventory_diagnostic["segment_reasons"],
            "target_inventory_adapter_status": inventory_diagnostic["adapter_status"],
            "target_inventory_selected": bool(inventory_selected),
        })

    if word_index != len(word_analyses):
        all_mapped = False
        unavailable_reasons.add("word_ipa_analysis_alignment_mismatch")

    overall_status = (
        "unavailable" if not all_mapped
        else "provisional" if "provisional" in output_statuses
        else "model-selected"
    )
    return {
        "input": text,
        "pronunciation_engine": pronunciation_engine,
        "pronunciation_surface": pronunciation_surface,
        "phonetics": phonetics,
        "ipa": ipa,
        "target_analysis": targets,
        "target_inventory_analysis": inventory_analyses,
        "target_inventory_status": inventory_status,
        "unavailable_reasons": sorted(unavailable_reasons),
        "ukrainian_orthography": "".join(output_parts) if all_mapped else None,
        "target_status": overall_status,
        "score_type": "explicit_correspondence_not_probability",
        "confidence": None,
        "selection_status": (
            "source IPA → Korean-specific licensed correspondence → Ukrainian practical orthography"
            if all_mapped else
            "Ukrainian output withheld because IPA is diagnostic-only, a correspondence is missing, or word alignment failed"
        ),
        "analysis_status": "research-prototype",
        "morphology_mode": morphology_mode,
    }


def transliterate_korean(text,*,rule_ids=None,boundary_mode="same_word",ipa_level="broad",target_adapter=None,n_insertion_licensed=False,rule_licenses=None,morphology_mode="strict"):
    surface=phoneticize_korean(text,rule_ids=rule_ids,boundary_mode=boundary_mode,ipa_level=ipa_level,n_insertion_licensed=n_insertion_licensed,rule_licenses=rule_licenses,morphology_mode=morphology_mode)
    source_ipa=surface["ipa"]["ipa"]
    target_inventory_analysis,selected,inventory_diagnostic=_target_inventory_diagnostic(source_ipa,target_adapter)

    if surface["pronunciation_status"] == "unresolved":
        target_mapping={
            "ipa":source_ipa,"status":"unavailable",
            "reason":"unresolved_korean_phonology","ukrainian_orthography":None,
            "segments":[],"ignored_source_markers":[],
        }
    elif surface["ipa_is_diagnostic_only"]:
        target_mapping={
            "ipa":source_ipa,"status":"unavailable",
            "reason":"diagnostic_ipa_not_accepted","ukrainian_orthography":None,
            "segments":[],"ignored_source_markers":[],
        }
    else:
        target_mapping=render_ipa_sequence_to_ukrainian(source_ipa)

    orthographic=target_mapping.get("ukrainian_orthography")
    lexical=LEXICAL_PRONUNCIATIONS.get(text)
    lexical_reference="".join(lexical["target_syllables"].split("|")) if lexical and lexical.get("target_syllables") else None
    lexical_reference_status=lexical.get("target_status","model-selected") if lexical_reference is not None else None
    if lexical_reference is None:
        lexical_comparison="no_lexical_reference"
    elif orthographic is None:
        lexical_comparison="unavailable_without_ipa_target"
    else:
        lexical_comparison="matches_reference" if orthographic==lexical_reference else "differs_from_reference"

    target_status=target_mapping.get("status","unavailable")
    target_unavailable_reason=target_mapping.get("reason") if orthographic is None else None
    target_unavailable_segments=[]
    if target_unavailable_reason=="unmapped_ipa_sequence":
        target_unavailable_segments=[{
            "source_ipa":target_mapping.get("unmapped_fragment"),
            "reason":"unmapped_ipa_sequence",
            "offset":target_mapping.get("unmapped_offset"),
        }]
    selection_status=(
        "unresolved_due_to_ambiguous_korean_phonology"
        if surface["pronunciation_status"]=="unresolved"
        else "diagnostic_ipa_not_accepted"
        if target_unavailable_reason=="diagnostic_ipa_not_accepted"
        else "source IPA → Korean-specific licensed correspondence → Ukrainian practical orthography"
        if orthographic is not None
        else f"Ukrainian target unavailable: {target_unavailable_reason}"
    )
    return {
        "input":text,
        "orthography":analyze_korean(text),
        "phonology":phonologize_korean(text),
        "phonetics":surface,
        "ipa":surface["ipa"],
        "ipa_status":surface["ipa_status"],
        "ipa_is_diagnostic_only":surface["ipa_is_diagnostic_only"],
        "ipa_status_reason":surface["ipa_status_reason"],
        "target_analysis":target_mapping,
        "target_inventory_analysis":target_inventory_analysis,
        "target_inventory_diagnostic":inventory_diagnostic,
        "target_inventory_status":(
            inventory_diagnostic.get("adapter_status")
            or target_inventory_analysis.get("segments", [{}])[0].get("target", {}).get("adapter")
            if target_inventory_analysis.get("segments") else inventory_diagnostic.get("adapter_status")
        ),
        "candidates":[g["target"]["candidates"] for g in target_inventory_analysis.get("segments", [])],
        "selected_candidate":selected,
        "selected_candidate_is_output_source":False,
        "ukrainian_orthography":orthographic,
        "target_status":target_status,
        "target_unavailable_reason":target_unavailable_reason,
        "target_unavailable_segments":target_unavailable_segments,
        "lexical_target_reference":lexical_reference,
        "lexical_target_reference_status":lexical_reference_status,
        "lexical_target_comparison":lexical_comparison,
        "score_type":"explicit_correspondence_not_probability",
        "target_inventory_score_type":"heuristic_cost",
        "confidence":None,
        "selection_status":selection_status,
        "sources":["S001","S003","S004","S005"],
        "analysis_status":"research-prototype",
        "morphology_mode":morphology_mode,
    }
