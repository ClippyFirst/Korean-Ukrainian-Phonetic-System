import csv
from pathlib import Path

from korean_ukrainian.phonology import parse_syllables
from korean_ukrainian.rules import apply_ordered_rules

ROOT=Path(__file__).parents[1]

def _run(text, rule_id, license_id):
    items=parse_syllables(text)
    apply_ordered_rules(items, rule_ids=[rule_id], rule_licenses={license_id})
    return items

def test_rule_scope_covers_sections_9_to_30():
    rows=list(csv.DictReader((ROOT/"data/korean/rule_scope.csv").open(encoding="utf-8")))
    sections={int(r["section"]) for r in rows}
    assert sections==set(range(9,31))

def test_stem_lb_lt_fortition_requires_license():
    items=parse_syllables("넓게")
    apply_ordered_rules(items, rule_ids=["R011"])
    assert items[1].onset=="ㄱ"
    items=_run("넓게","R011","R011:stem_lb_lt+suffix:넓게:넓>게")
    assert items[1].onset=="ㄲ"

def test_sino_korean_l_fortition_requires_license():
    items=_run("갈등","R012","R012:sino_ryeon:갈등:갈>등")
    assert items[1].onset=="ㄸ"

def test_adnominal_l_fortition_requires_license():
    items=parse_syllables("할 것")
    apply_ordered_rules(items,rule_ids=["R013"],boundary_mode="phrase",rule_licenses={"R013:adnominal_l:할 것:할>것"})
    assert items[1].onset=="ㄲ"

def test_compound_fortition_requires_license():
    items=parse_syllables("문고리")
    apply_ordered_rules(items, rule_ids=["R014"])
    assert items[1].onset=="ㄱ"
    items=_run("문고리","R014","R014:compound:문고리:문>고")
    assert items[1].onset=="ㄲ"

def test_saisiot_requires_explicit_license():
    items=parse_syllables("냇가")
    apply_ordered_rules(items, rule_ids=["R015"])
    assert items[1].onset=="ㄱ"
    items=_run("냇가","R015","R015:saisiot:냇가:냇>가")
    assert items[1].onset=="ㄲ"
    assert items[0].coda==""

def test_saisiot_license_is_exact_to_form_and_pair():
    items,traces=apply_ordered_rules(
        parse_syllables("냇가"),rule_ids=["R015"],
        rule_licenses={"R015:saisiot"},
    )
    assert items[1].onset=="ㄱ"
    assert traces[0].status=="conditional-disabled"

    items,traces=apply_ordered_rules(
        parse_syllables("뱃사공"),rule_ids=["R015"],
        rule_licenses={"R015:saisiot:냇가:냇>가"},
    )
    assert items[1].onset=="ㅅ"
    assert traces[0].status=="conditional-disabled"

def test_nikl_article_28_full_positive_compound_matrix_requires_exact_license():
    # Source: NIKL 표준 발음법 §28 and its commentary:
    # https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
    # Each pair below is an explicitly listed compound boundary; do not infer
    # fortition from arbitrary coda+plain-obstruent adjacency.
    cases = [
        ("문고리", "문", "고", "ㄲ"),
        ("눈동자", "눈", "동", "ㄸ"),
        ("신바람", "신", "바", "ㅃ"),
        ("산새", "산", "새", "ㅆ"),
        ("손재주", "손", "재", "ㅉ"),
        ("길가", "길", "가", "ㄲ"),
        ("물동이", "물", "동", "ㄸ"),
        ("발바닥", "발", "바", "ㅃ"),
        ("굴속", "굴", "속", "ㅆ"),
        ("술잔", "술", "잔", "ㅉ"),
        ("바람결", "바람", "결", "ㄲ"),
        ("그믐달", "그믐", "달", "ㄸ"),
        ("아침밥", "아침", "밥", "ㅃ"),
        ("잠자리", "잠", "자", "ㅉ"),
        ("강가", "강", "가", "ㄲ"),
        ("초승달", "초승", "달", "ㄸ"),
        ("등불", "등", "불", "ㅃ"),
        ("창살", "창", "살", "ㅆ"),
        ("강줄기", "강", "줄", "ㅉ"),
    ]
    for word, left, right, expected_fortis in cases:
        items = parse_syllables(word)
        apply_ordered_rules(items, rule_ids=["R014"])
        boundary = len(left)
        assert items[boundary].onset != expected_fortis, f"{word}: unlicensed R014 must not fire"
        items = parse_syllables(word)
        apply_ordered_rules(
            items,
            rule_ids=["R014"],
            rule_licenses={f"R014:compound:{word}:{left}>{right}"},
        )
        assert items[boundary].onset == expected_fortis, f"{word}: licensed §28 fortition"
        

def test_nikl_article_28_commentary_negative_compounds_do_not_get_automatic_fortition():
    # NIKL §28 commentary explicitly cautions that semantic compound patterns
    # do not predict fortition in every lexical item. These are negative
    # controls, not a claim that a generic phonological rule can derive every
    # dictionary pronunciation.
    cases = [
        ("가을고치", "가을", "고치", "ㄱ"),
        ("민물송어", "민물", "송어", "ㅅ"),
        ("운동자금", "운동", "자금", "ㅈ"),
        ("콩기름", "콩", "기름", "ㄱ"),
        ("물불", "물", "불", "ㅂ"),
        ("손발", "손", "발", "ㅂ"),
        ("돌부처", "돌", "부처", "ㅂ"),
        ("콩밥", "콩", "밥", "ㅂ"),
        ("물장난", "물", "장난", "ㅈ"),
        ("불고기", "불", "고기", "ㄱ"),
    ]
    for word, left, right, expected_plain in cases:
        items = parse_syllables(word)
        boundary = len(left)
        assert items[boundary].onset == expected_plain, f"{word}: source commentary negative control"
        items, traces = apply_ordered_rules(items, rule_ids=["R014"])
        assert items[boundary].onset == expected_plain, f"{word}: no implicit lexical compound license"
        assert not any(t.changed for t in traces), f"{word}: negative control must not transform"

