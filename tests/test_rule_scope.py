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
    items=_run("넓게","R011","R011:stem_lb_lt+suffix")
    assert items[1].onset=="ㄲ"

def test_sino_korean_l_fortition_requires_license():
    items=_run("갈등","R012","R012:sino_ryeon")
    assert items[1].onset=="ㄸ"

def test_adnominal_l_fortition_requires_license():
    items=_run("할것","R013","R013:adnominal_l")
    assert items[1].onset=="ㄲ"

def test_compound_fortition_requires_license():
    items=parse_syllables("국밥")
    apply_ordered_rules(items, rule_ids=["R014"])
    assert items[1].onset=="ㅂ"
    items=_run("국밥","R014","R014:compound")
    assert items[1].onset=="ㅃ"

def test_saisiot_requires_explicit_license():
    items=parse_syllables("냇가")
    apply_ordered_rules(items, rule_ids=["R015"])
    assert items[1].onset=="ㄱ"
    items=_run("냇가","R015","R015:saisiot")
    assert items[1].onset=="ㄲ"
    assert items[0].coda==""
