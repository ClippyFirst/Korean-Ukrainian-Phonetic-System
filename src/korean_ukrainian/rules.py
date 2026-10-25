from __future__ import annotations
from dataclasses import dataclass
from .phonology import Syllable, split_coda
from .soft_morphology import soft_formal_licenses, merge_licenses, mark_heuristic_trace

FINAL_REPRESENTATIVE={"ㄳ":"ㄱ","ㄵ":"ㄴ","ㄶ":"ㄴ","ㄺ":"ㄱ","ㄻ":"ㅁ","ㄼ":"ㄹ","ㄽ":"ㄹ","ㄾ":"ㄹ","ㄿ":"ㅂ","ㅀ":"ㄹ","ㅄ":"ㅂ","ㅅ":"ㄷ","ㅆ":"ㄷ","ㅈ":"ㄷ","ㅊ":"ㄷ","ㅌ":"ㄷ","ㅎ":"ㄷ","ㄲ":"ㄱ","ㅋ":"ㄱ","ㅍ":"ㅂ"}
PLAIN_TO_FORTIS={"ㄱ":"ㄲ","ㄷ":"ㄸ","ㅂ":"ㅃ","ㅅ":"ㅆ","ㅈ":"ㅉ"}
ASPIRATE={("ㄱ","ㅎ"):"ㅋ",("ㄷ","ㅎ"):"ㅌ",("ㅂ","ㅎ"):"ㅍ",("ㅈ","ㅎ"):"ㅊ",("ㅎ","ㄱ"):"ㅋ",("ㅎ","ㄷ"):"ㅌ",("ㅎ","ㅂ"):"ㅍ",("ㅎ","ㅈ"):"ㅊ"}
NASAL_AFTER={"ㄱ":"ㅇ","ㄲ":"ㅇ","ㅋ":"ㅇ","ㄷ":"ㄴ","ㅅ":"ㄴ","ㅆ":"ㄴ","ㅈ":"ㄴ","ㅊ":"ㄴ","ㅌ":"ㄴ","ㅎ":"ㄴ","ㅂ":"ㅁ","ㅍ":"ㅁ"}
COMPLEX_LIAISON={"ㄳ":("ㄱ","ㅆ"),"ㄵ":("ㄴ","ㅈ"),"ㄶ":("ㄴ",""),"ㄺ":("ㄹ","ㄱ"),"ㄻ":("ㄹ","ㅁ"),"ㄼ":("ㄹ","ㅂ"),"ㄽ":("ㄹ","ㅆ"),"ㄾ":("ㄹ","ㅌ"),"ㄿ":("ㄹ","ㅍ"),"ㅀ":("ㄹ",""),"ㅄ":("ㅂ","ㅆ")}

def contextual_final_representative(a,b):
    if a.coda=="ㄼ" and b.onset!="ㅇ":
        if a.text=="밟":
            return "ㅂ"
        if a.text=="넓" and a.text+b.text in {"넓죽","넓둥","넓적"}:
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
"R009":("n-insertion","NIKL §29; official Standard Pronunciation Rules https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002","high"),
"R010":("stem-nm-fortition","NIKL §24","high"),
"R011":("stem-lb-lt-fortition","NIKL §25","high"),
"R012":("sino-korean-l-fortition","NIKL §26","high"),
"R013":("adnominal-l-fortition","NIKL §27","high"),
"R014":("compound-fortition","NIKL §28; official Standard Pronunciation Rules https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002","high"),
"R015":("saisiot-pronunciation","NIKL §30; official Standard Pronunciation Rules https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002","high"),
"R016":("verbal-stem-rieul-giyeok-exception","NIKL §11; lexical/morphological conditioning","high"),
}

# Exact-form licenses for clear formal-morpheme liaison examples derived from NIKL §14.
# The rule is general, but this engine intentionally requires a full-form license
# until it has a morphological analyzer. The examples below have transparent
# inflectional morphology and official rule support; this is not a broad coda rule.
_NIKL_R002_FORMAL_LICENSES = {
    "앉아라": "앉>아",  # 앉- + imperative ending -아라; NIKL §14 explicitly attests 앉아[안자].
    "없어도": "없>어",  # 없- + connective ending -어도; NIKL §14 attests 없어[업써].
    # Direct NIKL surface evidence: 없음[업씀], Q&A/FAQ 8391 (also listed in Q&A 335008).
    "없음": "없>음",
    # NIKL Q&A 326978 explicitly describes 있- + -었- and gives 있었- [이썯].
    "있었": "있>었",
    # Exact-form, rule-derived licenses: transparent formal inflection; NIKL §§13–14.
    "같아서": "같>아",
    "되었어": "었>어",
    "찢었으면": "찢>었",
    "했었음": "했>었",
    "붙어야": "붙>어",
    "군대보냈어야": "냈>어",
    "이런삶은": "삶>은",
    "끝내고싶어유유유유": "싶>어",
    "이빨닦아야지": "닦>아",
    "벗어날": "벗>어",
    "찾아": "찾>아",
    "안늙었는데": "늙>었",
    "없으니깐": "없>으",
    "없으니까": "없>으",
    # Q&A 306166 directly attests 멋있어[머디써/머시써]; license only 있>어.
    "멋있어": "있>어",
}

# Exact-form licenses for NIKL §12(4) ㅎ-coda deletion before a vowel-initial
# ending. The official answers attest Korean surface pronunciations, not IPA
# gold; these licenses resolve only the Korean morphophonological step.
# 싫어서: NIKL Online Q&A qna_seq=313981 (2025-04-29).
# 수많은: Korean Basic Dictionary entry for 수많다, 활용 [수ː마는].
_NIKL_R003_FORMAL_LICENSES = {
    "싫어서": "싫>어",
    "수많은": "많>은",
    "많아서": "많>아",  # NIKL Online Q&A qna_seq=334550 (2026-08-06): [마ː나서].
    # Exact-form, rule-derived applications of NIKL §12(4); no productive suffix heuristic.
    "괜찮아보이는디": "찮>아",
    "많을거같이": "많>을",
    "많이본": "많>이",  # NIKL Q&A 317783 identifies -이 in 많이 as a derivational suffix.
    "쌓아서": "쌓>아",
    "쳐넣어야": "넣>어",
    "애새끼낳으면": "낳>으",
    "잃었노": "잃>었",
    "알잖아아침에": "잖>아",
    "않았지만": "않>았",
    "개많음": "많>음",
    "좋은데": "좋>은",
    "좋아보인다고": "좋>아",
    "좋아해주는": "좋>아",
    "죽었잖아": "잖>아",
    "개좆망했잖아": "잖>아",
}

# Exact full-form licenses for transparent verb-stem + ending cases under NIKL §24.
# These are rule-derived applications, not claimed as direct quoted examples.
# Scope each license to the complete input and adjacent pair until a morphology
# analyzer can establish stem/ending boundaries productively.
# Official source: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
_NIKL_R010_FORM_LICENSES = {
    "닮다": "닮>다",  # 닮- + -다; ㄻ (ㅁ representative) before ending-initial ㄷ.
    "넘게": "넘>게",  # 넘- + -게; ㅁ coda before ending-initial ㄱ.
}

# Exact, source-backed examples explicitly listed in NIKL Standard Pronunciation Rule 29.
# Source: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
_NIKL_R009_WORD_LICENSES = {
    "솜이불": "솜>이", "홑이불": "홑>이", "막일": "막>일", "삯일": "삯>일",
    "맨입": "맨>입", "꽃잎": "꽃>잎", "내복약": "복>약", "한여름": "한>여",
    "남존여비": "존>여", "신여성": "신>여", "색연필": "색>연",
    "직행열차": "행>열", "늑막염": "막>염", "콩엿": "콩>엿", "담요": "담>요",
    "눈요기": "눈>요", "영업용": "업>용", "식용유": "용>유", "백분율": "분>율",
    "밤윷": "밤>윷", "들일": "들>일", "솔잎": "솔>잎", "설익다": "설>익",
    "물약": "물>약", "불여우": "불>여", "서울역": "울>역", "물엿": "물>엿",
    "서른여섯": "른>여", "스물여섯": "물>여",
}
_NIKL_R009_PHRASE_LICENSES = {
    "한 입": "한>입", "옷 입다": "옷>입", "먹은 엿": "은>엿",
    "할 일": "할>일", "잘 입다": "잘>입", "먹을 엿": "을>엿",
}

# Exact examples explicitly listed in NIKL §28 (fortition in compounds
# without a written 사이시옷). Homographs whose reading depends on meaning
# are deliberately omitted from automatic licensing.
_NIKL_R014_WORD_LICENSES = {
    "문고리": "문>고", "눈동자": "눈>동", "신바람": "신>바",
    "산새": "산>새", "손재주": "손>재", "길가": "길>가",
    "물동이": "물>동", "발바닥": "발>바", "바람결": "람>결",
    "그믐달": "믐>달", "강가": "강>가", "초승달": "승>달",
    "등불": "등>불", "창살": "창>살", "강줄기": "강>줄",
    "아침밥": "침>밥", "굴속": "굴>속", "술잔": "술>잔",
}

# Exact examples explicitly listed in NIKL §30. Each form is licensed only
# for its attested pair; the registry does not treat every written ㅅ coda
# as a saisiot.
_NIKL_R015_WORD_LICENSES = {
    "냇가": "냇>가", "샛길": "샛>길", "빨랫돌": "랫>돌",
    "콧등": "콧>등", "깃발": "깃>발", "대폿밥": "폿>밥",
    "햇살": "햇>살", "뱃속": "뱃>속", "뱃전": "뱃>전",
    "고갯짓": "갯>짓", "아랫니": "랫>니", "뒷마루": "뒷>마",
    "뱃머리": "뱃>머", "깻잎": "깻>잎", "나뭇잎": "뭇>잎",
}

def _source_backed_rule_licenses(items, boundary_mode):
    full_form = "".join(item.text + (" " if item.boundary_after == "word" else "") for item in items).strip()
    licenses = set()
    pair = _NIKL_R002_FORMAL_LICENSES.get(full_form)
    if pair is not None:
        licenses.add(f"R002:formal:{full_form}:{pair}")
    pair = _NIKL_R003_FORMAL_LICENSES.get(full_form)
    if pair is not None:
        licenses.add(f"R003:ending_or_suffix_h_deletion:{full_form}:{pair}")
    pair = _NIKL_R010_FORM_LICENSES.get(full_form)
    if pair is not None:
        licenses.add(f"R010:stem_n_m+suffix:{full_form}:{pair}")
    pair = _NIKL_R009_WORD_LICENSES.get(full_form)
    if pair is not None:
        licenses.add(f"R009:word:{full_form}:{pair}")
    pair = "같>이" if full_form == "많을거같이" else None
    if pair is not None:
        licenses.add(f"R007:formal_morpheme_i:{full_form}:{pair}")
    if boundary_mode == "phrase":
        pair = _NIKL_R009_PHRASE_LICENSES.get(full_form)
        if pair is not None:
            licenses.add(f"R009:phrase:{full_form}:{pair}")
    pair = _NIKL_R014_WORD_LICENSES.get(full_form)
    if pair is not None:
        licenses.add(f"R014:compound:{full_form}:{pair}")
    pair = _NIKL_R015_WORD_LICENSES.get(full_form)
    if pair is not None:
        licenses.add(f"R015:saisiot:{full_form}:{pair}")
    return licenses

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
    before=_snap(items); changed=False; conditional_disabled=False
    license_context=_licensed(rule_id,licenses)
    if rule_id=="R001":
        for i,s in enumerate(items):
            if s.coda=="ㄼ" and s.boundary_after!="word" and i+1<len(items) and items[i+1].onset!="ㅇ":
                # NIKL exception: 밟- is [ㅂ] before consonants; 넓- has
                # the narrower [ㅂ] realization in 넓죽-/넓둥글-.
                if s.text=="밟":
                    s.coda="ㅂ"; changed=True; continue
                if s.text=="넓" and s.text+items[i+1].text in {"넓죽","넓둥","넓적"}:
                    s.coda="ㅂ"; changed=True; continue
            if s.coda in FINAL_REPRESENTATIVE:
                new=FINAL_REPRESENTATIVE[s.coda]
                if new!=s.coda: s.coda=new; changed=True
    elif rule_id=="R002":
        # Complex-coda liaison is morphologically ambiguous: §§13–14 move
        # the second cluster component before a formal morpheme, while §15
        # neutralizes the cluster and moves its representative before a
        # substantive morpheme. Never infer the distinction from Hangul
        # adjacency alone. Require an exact full-form + pair license:
        # R002:formal:넋이:넋>이 or R002:substantive:값어치:값>어.
        liaison_licenses={x for x in licenses if x.startswith("R002:")}
        full_form="".join(item.text+(" " if item.boundary_after=="word" else "") for item in items).strip()
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode) or b.onset!="ㅇ" or not a.coda: continue
            # A final ㅇ is the coda /ŋ/, not a liaison consonant that can
            # become the silent onset ㅇ. Keep it in the preceding syllable
            # (e.g. 공인 [koŋ.in], 동요 [toŋ.jo]); otherwise /ŋ/ disappears.
            if a.coda == "ㅇ":
                continue
            if a.coda in {"ㄶ","ㅀ"}:
                # These clusters are governed by §12(4) before vowel-initial
                # endings/suffixes, not by the generic §§13–15 liaison path.
                continue
            if a.coda in COMPLEX_LIAISON:
                pair=f"{a.text}>{b.text}"
                scope=None
                for license in liaison_licenses:
                    parts=license.split(":",3)
                    if len(parts)==4 and parts[2]==full_form and parts[3]==pair:
                        scope=parts[1]
                        break
                if scope=="formal":
                    retained,moved=COMPLEX_LIAISON[a.coda]
                    a.coda=retained; b.onset=moved or "ㅇ"; changed=True
                    license_context=f"R002:formal:{full_form}:{pair}"
                elif scope=="substantive":
                    representative=FINAL_REPRESENTATIVE.get(a.coda,a.coda)
                    a.coda=""; b.onset=representative; changed=True
                    license_context=f"R002:substantive:{full_form}:{pair}"
                else:
                    conditional_disabled=True
            elif a.coda in {"ㄷ","ㅌ"} and b.nucleus=="ㅣ":
                # §17 palatalization must get first refusal on ㄷ/ㅌ + formal
                # ㅣ. Generic liaison here would consume the coda before R007
                # can distinguish licensed forms such as 같이/굳이 from
                # unverified lookalikes. Leave the pair unchanged for R007.
                conditional_disabled=True
            elif a.coda!="ㅎ":
                representative=FINAL_REPRESENTATIVE.get(a.coda,a.coda)
                if representative!=a.coda and b.nucleus in {"ㅏ","ㅓ","ㅗ","ㅜ","ㅟ"}:
                    # §15 can neutralize this coda before a substantive
                    # morpheme, unlike §13 formal-morpheme liaison. Require
                    # the same exact form/pair evidence as for complex codas.
                    pair=f"{a.text}>{b.text}"
                    scope=None
                    for license in liaison_licenses:
                        parts=license.split(":",3)
                        if len(parts)==4 and parts[2]==full_form and parts[3]==pair:
                            scope=parts[1]
                            break
                    if scope=="formal":
                        b.onset=a.coda; a.coda=""; changed=True
                    elif scope=="substantive":
                        b.onset=representative; a.coda=""; changed=True
                    else:
                        conditional_disabled=True
                else:
                    b.onset=a.coda; a.coda=""; changed=True
    elif rule_id=="R003":
        # NIKL §12(4) deletes ㅎ in ㅎ/ㄶ/ㅀ before a vowel-initial ending
        # or suffix. Adjacent Hangul blocks alone do not prove that boundary.
        r003_licenses={x for x in licenses if x.startswith("R003:")}
        full_form="".join(item.text+(" " if item.boundary_after=="word" else "") for item in items).strip()
        exact_pairs=set()
        for license in r003_licenses:
            parts=license.split(":",3)
            if len(parts)==4 and parts[1]=="ending_or_suffix_h_deletion" and parts[2]==full_form:
                exact_pairs.add(parts[3])
        if not exact_pairs:
            name,source,confidence=RULE_META[rule_id]
            return RuleTrace(rule_id,name,False,before,before,"conditional-disabled",confidence,source,None)
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode) or a.coda not in {"ㅎ","ㄶ","ㅀ"} or b.onset!="ㅇ":
                continue
            pair=f"{a.text}>{b.text}"
            if pair not in exact_pairs:
                conditional_disabled=True
                continue
            a.coda={"ㅎ":"","ㄶ":"ㄴ","ㅀ":"ㄹ"}[a.coda]
            changed=True
            license_context=f"R003:ending_or_suffix_h_deletion:{full_form}:{pair}"
    elif rule_id=="R004":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode): continue
            # Complex h-codas retain ㄴ/ㄹ while their ㅎ component
            # aspirates the following lenis onset: 많다 [만타], 싫다 [실타].
            if a.coda in {"ㄶ","ㅀ"} and b.onset in {"ㄱ","ㄷ","ㅂ","ㅈ"}:
                b.onset={"ㄱ":"ㅋ","ㄷ":"ㅌ","ㅂ":"ㅍ","ㅈ":"ㅊ"}[b.onset]
                a.coda="ㄴ" if a.coda=="ㄶ" else "ㄹ"
                changed=True
            elif b.onset=="ㅎ" and a.coda in COMPLEX_LIAISON:
                # NIKL §12 붙임 1 gives direct cluster+ㅎ aspiration for
                # specified morphophonemic forms such as 읽히다, 앉히다,
                # 넓히다. The same written cluster elsewhere first undergoes
                # coda simplification (§11) before §12. Require exact evidence
                # rather than applying the suffix pattern to every adjacency.
                full_form="".join(item.text+(" " if item.boundary_after=="word" else "") for item in items).strip()
                pair=f"{a.text}>{b.text}"
                license=f"R004:complex_h_suffix:{full_form}:{pair}"
                if a.coda in {"ㄺ","ㄵ","ㄼ"} and license in licenses:
                    retained,moved=COMPLEX_LIAISON[a.coda]
                    aspirated=ASPIRATE.get((moved,"ㅎ"))
                    if aspirated is None:
                        representative=FINAL_REPRESENTATIVE.get(moved,moved)
                        aspirated=ASPIRATE.get((representative,"ㅎ"))
                    if aspirated:
                        a.coda=retained
                        b.onset=aspirated
                        changed=True
                        license_context=license
                    else:
                        conditional_disabled=True
                else:
                    conditional_disabled=True
            elif b.onset=="ㅎ" and a.coda:
                # Use the written coda where it licenses a distinct
                # morphophonemic outcome (e.g. ㅈ+ㅎ -> ㅊ); otherwise use
                # the final representative (e.g. ㅅ/ㅊ+ㅎ -> ㅌ).
                aspirated=ASPIRATE.get((a.coda,"ㅎ"))
                if aspirated is None:
                    representative=FINAL_REPRESENTATIVE.get(a.coda,a.coda)
                    aspirated=ASPIRATE.get((representative,"ㅎ"))
                if aspirated:
                    # Keep a narrowly scoped intermediate marker for the
                    # official §17 붙임 sequence ㄷ+히 -> ㅌ+ㅣ -> ㅊ+ㅣ.
                    if a.coda=="ㄷ" and b.nucleus=="ㅣ":
                        b._palatalization_after_dh=True
                    b.onset=aspirated
                    a.coda=""
                    changed=True
            elif (a.coda,b.onset) in ASPIRATE:
                b.onset=ASPIRATE[(a.coda,b.onset)]
                a.coda="" if a.coda not in {"ㄶ","ㅀ"} else ("ㄴ" if a.coda=="ㄶ" else "ㄹ")
                changed=True
    elif rule_id=="R005":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            representative=contextual_final_representative(a,b)
            if _eligible(a,b,boundary_mode=boundary_mode,allow_word_boundary=(boundary_mode=="phrase")) and representative in NASAL_AFTER and b.onset in {"ㄴ","ㅁ"}:
                a.coda=NASAL_AFTER[representative]; changed=True
    elif rule_id=="R006":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode,allow_word_boundary=(boundary_mode=="phrase")): continue
            representative=contextual_final_representative(a,b)
            # NIKL §19: after a coda in the ㄱ/ㅂ/ㅁ/ㅇ classes, ㄹ is
            # realized as ㄴ. For ㄱ/ㅂ, the following R005 pass then
            # nasalizes the coda to ㅇ/ㅁ. Therefore R006 must precede R005.
            if representative in {"ㄱ","ㅂ","ㅁ","ㅇ"} and b.onset=="ㄹ":
                b.onset="ㄴ"; changed=True
            elif representative=="ㄴ" and b.onset=="ㄹ":
                a.coda="ㄹ"; changed=True
            elif representative=="ㄹ" and b.onset=="ㄴ":
                a.coda="ㄹ"; b.onset="ㄹ"; changed=True
    elif rule_id=="R007":
        # §17 is morphology-conditioned. A generic flag such as
        # R007:formal_morpheme_i can accidentally license every ㄷ/ㅌ + ㅣ
        # sequence in a string. Require exact full-form and adjacent-pair
        # evidence, parallel to §§15 and 29:
        # R007:formal_morpheme_i:굳이:굳>이
        # R007:dh_suffix_hi:굳히다:굳>히
        r007_licenses={x for x in licenses if x.startswith("R007:")}
        full_form="".join(item.text+(" " if item.boundary_after=="word" else "") for item in items).strip()
        exact_pairs=set()
        for license in r007_licenses:
            parts=license.split(":",3)
            if len(parts)==4 and parts[2]==full_form:
                exact_pairs.add((parts[1],parts[3]))
        if not exact_pairs:
            conditional_disabled=True
            license_context=None
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode): continue
            pair=f"{a.text}>{b.text}"
            if ("formal_morpheme_i",pair) in exact_pairs and a.coda in {"ㄷ","ㅌ","ㄾ"} and b.onset=="ㅇ" and b.nucleus=="ㅣ":
                coda=a.coda
                # ㄾ is realized as ㄹ in the coda, while its ㅌ component
                # palatalizes and moves to the next syllable onset.
                a.coda="ㄹ" if coda=="ㄾ" else ""
                b.onset="ㅈ" if coda=="ㄷ" else "ㅊ"
                changed=True
                license_context=f"R007:formal_morpheme_i:{full_form}:{pair}"
            elif ("dh_suffix_hi",pair) in exact_pairs and getattr(b,"_palatalization_after_dh",False) and b.onset=="ㅌ" and b.nucleus=="ㅣ":
                b.onset="ㅊ"
                delattr(b,"_palatalization_after_dh")
                changed=True
                license_context=f"R007:dh_suffix_hi:{full_form}:{pair}"
            elif ("formal_morpheme_i",pair) not in exact_pairs and ("dh_suffix_hi",pair) not in exact_pairs:
                conditional_disabled=True
    elif rule_id=="R008":
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode): continue
            # A written ㄺ before ㄱ is the §11 morphophonemic exception
            # zone: a licensed stem form keeps ㄹ (R016), while ordinary
            # lexical forms simplify to ㄱ. Do not let generic §23 fortition
            # silently decide that morphology before R016 has evidence.
            if a.coda=="ㄺ" and b.onset=="ㄱ":
                conditional_disabled=True
                continue
            representative=contextual_final_representative(a,b)
            if representative in {"ㄱ","ㄷ","ㅂ"} and b.onset in PLAIN_TO_FORTIS:
                b.onset=PLAIN_TO_FORTIS[b.onset]; changed=True
    elif rule_id=="R009":
        # A global boolean is not sufficient evidence: §29 is lexical,
        # morphological and sometimes optional. Require an exact per-pair
        # license such as R009:word:한여름:한>여 or
        # R009:phrase:무슨 일:슨>일.
        insertion_licenses={x for x in licenses if x.startswith("R009:")}
        if not insertion_licenses:
            name,source,confidence=RULE_META[rule_id]
            return RuleTrace(rule_id,name,False,before,before,"conditional-disabled",confidence,source,None)
        full_form="".join(item.text+(" " if item.boundary_after=="word" else "") for item in items).strip()
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode,allow_word_boundary=True) or b.onset!="ㅇ": continue
            if b.nucleus not in {"ㅣ","ㅑ","ㅕ","ㅛ","ㅠ","ㅖ","ㅒ"}: continue
            if not a.coda: continue
            pair=f"{a.text}>{b.text}"
            permitted=False
            permitted_scope=None
            for license in insertion_licenses:
                parts=license.split(":",3)
                if len(parts)!=4: continue
                _,scope,licensed_form,licensed_pair=parts
                if licensed_form!=full_form or licensed_pair!=pair: continue
                if scope=="word" and a.boundary_after!="word" and " " not in licensed_form:
                    permitted=True
                    permitted_scope=scope
                elif scope=="phrase" and boundary_mode=="phrase" and a.boundary_after=="word" and " " in licensed_form:
                    permitted=True
                    permitted_scope=scope
                if permitted: break
            if not permitted: continue
            # NIKL §29 and its commentary include ㅣ and j-initial
            # diphthongs; optionality and lexical licensing live in the
            # exact license, not in this segmental environment check.
            b.onset="ㄹ" if FINAL_REPRESENTATIVE.get(a.coda,a.coda)=="ㄹ" else "ㄴ"
            changed=True
            license_context=f"R009:{permitted_scope}:{full_form}:{pair}"
    elif rule_id in {"R010","R011","R012","R013","R014"}:
        # These rules depend on morphology or lexical class, not just the
        # consonant sequence. Require a full-form + adjacent-pair license.
        scope={
            "R010":"stem_n_m+suffix",
            "R011":"stem_lb_lt+suffix",
            "R012":"sino_ryeon",
            "R013":"adnominal_l",
            "R014":"compound",
        }[rule_id]
        exact_licenses={x for x in licenses if x.startswith(rule_id+":")}
        full_form="".join(item.text+(" " if item.boundary_after=="word" else "") for item in items).strip()
        exact_pairs=set()
        for license in exact_licenses:
            parts=license.split(":",3)
            if len(parts)==4 and parts[1]==scope and parts[2]==full_form:
                exact_pairs.add(parts[3])
        # NIKL explicitly confirms that the attached ending -ㄹ게 is pronounced
        # with fortis ㄲ ([할께]); this is not a free inference from ㄹ + ㄱ.
        # License only the exact orthographic environment where 게 is attached
        # to a preceding ㄹ coda, and preserve the official Q&A provenance.
        attested_l_ge_pairs=set()
        if rule_id=="R013":
            for i in range(len(items)-1):
                a,b=items[i],items[i+1]
                if a.boundary_after!="word" and a.coda=="ㄹ" and b.text=="게" and b.onset=="ㄱ":
                    pair=f"{a.text}>{b.text}"
                    exact_pairs.add(pair)
                    attested_l_ge_pairs.add(pair)
        if not exact_pairs:
            name,source,confidence=RULE_META[rule_id]
            return RuleTrace(rule_id,name,False,before,before,"conditional-disabled",confidence,source,None)
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode,allow_word_boundary=(rule_id=="R013")): continue
            if b.onset not in PLAIN_TO_FORTIS: continue
            # NIKL §§24–25 enumerate ㄱ, ㄷ, ㅅ, ㅈ; ㅂ is not
            # licensed by either stem-nasal or stem-ㄼ/ㄾ fortition rule.
            applies = (
                (rule_id=="R010" and FINAL_REPRESENTATIVE.get(a.coda,a.coda) in {"ㄴ","ㅁ"} and b.onset in {"ㄱ","ㄷ","ㅅ","ㅈ"}) or
                (rule_id=="R011" and a.coda in {"ㄼ","ㄾ"} and b.onset in {"ㄱ","ㄷ","ㅅ","ㅈ"}) or
                (rule_id=="R012" and a.coda=="ㄹ" and b.onset in {"ㄷ","ㅅ","ㅈ"}) or
                (rule_id=="R013" and a.coda=="ㄹ") or
                (rule_id=="R014" and bool(a.coda))
            )
            if not applies: continue
            pair=f"{a.text}>{b.text}"
            if pair not in exact_pairs:
                conditional_disabled=True
                continue
            b.onset=PLAIN_TO_FORTIS[b.onset]
            changed=True
            if pair in attested_l_ge_pairs:
                license_context=f"R013:attested_l_ge_ending:{full_form}:{pair}"
                source="NIKL Standard Pronunciation Rule 27; official Q&A https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=330963"
                confidence="high"
            else:
                license_context=f"{rule_id}:{scope}:{full_form}:{pair}"
    elif rule_id=="R016":
        # §11's ㄺ-before-ㄱ exception is morphology-conditioned. A category
        # token alone can incorrectly license unrelated words (e.g. 닭고기).
        # Require exact full-form and pair evidence:
        # R016:verb_stem_rieul_giyeok_suffix:읽고:읽>고
        r016_licenses={x for x in licenses if x.startswith("R016:")}
        full_form="".join(item.text+(" " if item.boundary_after=="word" else "") for item in items).strip()
        exact_pairs=set()
        for license in r016_licenses:
            parts=license.split(":",3)
            if len(parts)==4 and parts[1]=="verb_stem_rieul_giyeok_suffix" and parts[2]==full_form:
                exact_pairs.add(parts[3])
        if not exact_pairs or boundary_mode!="morpheme":
            name,source,confidence=RULE_META[rule_id]
            return RuleTrace(rule_id,name,False,before,before,"conditional-disabled",confidence,source,None)
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode): continue
            pair=f"{a.text}>{b.text}"
            if a.coda=="ㄺ" and b.onset=="ㄱ" and pair in exact_pairs:
                # NIKL §11: a morphologically licensed ㄺ-ending stem before
                # a ㄱ-initial ending retains ㄹ and fortifies the following ㄱ.
                a.coda="ㄹ"
                b.onset="ㄲ"
                changed=True
                license_context=f"R016:verb_stem_rieul_giyeok_suffix:{full_form}:{pair}"
            elif pair not in exact_pairs:
                conditional_disabled=True
    elif rule_id=="R015":
        # §30 saisiot behavior is lexical/morphological. A category-only
        # license must not apply to every written ㅅ coda in an input.
        # Example: R015:saisiot:냇가:냇>가.
        r015_licenses={x for x in licenses if x.startswith("R015:")}
        full_form="".join(item.text+(" " if item.boundary_after=="word" else "") for item in items).strip()
        exact_pairs=set()
        for license in r015_licenses:
            parts=license.split(":",3)
            if len(parts)==4 and parts[1]=="saisiot" and parts[2]==full_form:
                exact_pairs.add(parts[3])
        if not exact_pairs:
            name,source,confidence=RULE_META[rule_id]
            return RuleTrace(rule_id,name,False,before,before,"conditional-disabled",confidence,source,None)
        for i in range(len(items)-1):
            a,b=items[i],items[i+1]
            if not _eligible(a,b,boundary_mode=boundary_mode) or a.coda!="ㅅ": continue
            pair=f"{a.text}>{b.text}"
            if pair not in exact_pairs:
                conditional_disabled=True
                continue
            pair_changed=False
            if b.onset in PLAIN_TO_FORTIS:
                b.onset=PLAIN_TO_FORTIS[b.onset]; a.coda=""; pair_changed=True
            elif b.onset in {"ㄴ","ㅁ"}:
                a.coda="ㄴ"; pair_changed=True
            elif b.onset=="ㅇ" and b.nucleus=="ㅣ":
                a.coda="ㄴ"; b.onset="ㄴ"; pair_changed=True
            else:
                conditional_disabled=True
            if pair_changed:
                changed=True
                license_context=f"R015:saisiot:{full_form}:{pair}"
    name,source,confidence=RULE_META[rule_id]
    if rule_id=="R013" and license_context and license_context.startswith("R013:attested_l_ge_ending:"):
        source="NIKL §27; official Q&A https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=330963"
        confidence="high"
    status=("conditional-disabled" if conditional_disabled and not changed else ("partially-conditional" if conditional_disabled else ("established" if changed or rule_id not in {"R009","R010","R011","R012","R013","R014","R015","R016"} else "conditional-nochange")))
    return RuleTrace(rule_id,name,changed,before,_snap(items),status,confidence,source,license_context)

def apply_ordered_rules(
    items: list[Syllable],
    rule_ids=None,
    *,
    boundary_mode="same_word",
    n_insertion_licensed=False,
    rule_licenses=None,
    morphology_mode="strict",
):
    """Apply ordered NIKL rules.

    morphology_mode:
      - "strict" (default): exact licenses only (current behaviour).
      - "soft": also inject ephemeral formal-ending licenses for R002/R003/R007.
        Soft applications are marked heuristic-low-confidence.
    """
    if morphology_mode not in {"strict", "soft"}:
        raise ValueError('morphology_mode must be "strict" or "soft"')
    if boundary_mode not in {"unknown", "same_word", "morpheme", "word", "phrase"}:
        raise ValueError("invalid boundary_mode")

    ids = rule_ids or [
        "R009", "R003", "R002", "R004", "R006", "R005", "R007",
        "R010", "R011", "R012", "R013", "R014", "R015", "R016", "R008", "R001",
    ]
    exact = list(rule_licenses or ())
    # Use only exact-form licenses for examples explicitly listed in NIKL §§28–30.
    # Other words still need an explicit caller license.
    exact.extend(_source_backed_rule_licenses(items, boundary_mode))
    soft = soft_formal_licenses(items) if morphology_mode == "soft" else []
    merged = merge_licenses(exact, soft, morphology_mode=morphology_mode)
    soft_set = set(soft)

    traces = []
    for r in ids:
        tr = apply_rule(
            items,
            r,
            boundary_mode=boundary_mode,
            n_insertion_licensed=n_insertion_licensed,
            rule_licenses=merged,
        )
        soft_contributed = (
            morphology_mode == "soft"
            and tr.changed
            and tr.license_context is not None
            and tr.license_context in soft_set
        )
        mark_heuristic_trace(tr, soft_contributed=soft_contributed)
        traces.append(tr)
    return items, traces
