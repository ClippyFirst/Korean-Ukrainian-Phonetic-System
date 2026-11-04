from __future__ import annotations

import re
from pathlib import Path

from korean_ukrainian.rules import (
    _NIKL_R002_FORMAL_LICENSES,
    _NIKL_R002_SUBSTANTIVE_LICENSES,
    _NIKL_R003_FORMAL_LICENSES,
    _NIKL_R004_COMPLEX_H_SUFFIX_LICENSES,
    _NIKL_R007_FORMAL_I_LICENSES,
    _NIKL_R009_PHRASE_LICENSES,
    _NIKL_R009_WORD_LICENSES,
    _NIKL_R010_FORM_LICENSES,
    _NIKL_R011_FORM_LICENSES,
    _NIKL_R012_WORD_LICENSES,
    _NIKL_R013_PHRASE_LICENSES,
    _NIKL_R013_WORD_LICENSES,
    _NIKL_R014_WORD_LICENSES,
    _NIKL_R015_WORD_LICENSES,
    _NIKL_R016_VERBAL_STEM_LICENSES,
)

ROOT = Path(__file__).resolve().parents[1]
JS_SOURCE = (ROOT / "src" / "app" / "engine_shared.js").read_text(encoding="utf-8")


def js_string_map(name: str) -> dict[str, str]:
    match = re.search(
        rf"const {re.escape(name)}\s*=\s*new Map\(\[([\s\S]*?)\]\);",
        JS_SOURCE,
    )
    assert match, f"missing browser map {name}"
    return dict(re.findall(r"\['([^']+)'\s*,\s*'([^']+)'\]", match.group(1)))


def js_map_keys(name: str) -> set[str]:
    match = re.search(
        rf"const {re.escape(name)}\s*=\s*new Map\(\[([\s\S]*?)\]\);",
        JS_SOURCE,
    )
    assert match, f"missing browser map {name}"
    return set(re.findall(r"\['([^']+)'\s*,", match.group(1)))


def test_python_browser_exact_rule_licenses_match():
    pairs = [
        (_NIKL_R002_FORMAL_LICENSES, "NIKL_13_14_FORMAL_LIAISON_FORMS"),
        (_NIKL_R002_SUBSTANTIVE_LICENSES, "NIKL_15_SUBSTANTIVE_LIAISON_FORMS"),
        (_NIKL_R003_FORMAL_LICENSES, "NIKL_12_H_DELETION_FORMS"),
        (_NIKL_R004_COMPLEX_H_SUFFIX_LICENSES, "NIKL_COMPLEX_H_SUFFIX_FORMS"),
        (_NIKL_R007_FORMAL_I_LICENSES, "NIKL_17_FORMAL_I_FORMS"),
        (_NIKL_R009_WORD_LICENSES, "NIKL_29_WORD_INSERTION"),
        (_NIKL_R010_FORM_LICENSES, "NIKL_24_STEM_NM_ENDING_FORMS"),
        (_NIKL_R011_FORM_LICENSES, "NIKL_25_STEM_LB_LT_ENDING_FORMS"),
        (_NIKL_R012_WORD_LICENSES, "NIKL_26_SINO_KOREAN_RIEUL_FORTITION_FORMS"),
        (_NIKL_R013_WORD_LICENSES, "NIKL_27_ADNOMINAL_FORMS"),
        (_NIKL_R014_WORD_LICENSES, "NIKL_28_COMPOUND_FORTITION_FORMS"),
        (_NIKL_R015_WORD_LICENSES, "NIKL_30_SAISIOT_PRONUNCIATION_FORMS"),
        (_NIKL_R016_VERBAL_STEM_LICENSES, "NIKL_11_VERBAL_STEM_RIEUL_GIYEOK_FORMS"),
    ]
    for python_map, js_name in pairs:
        assert js_string_map(js_name) == python_map, js_name


def test_python_browser_phrase_license_sets_match():
    assert js_map_keys("NIKL_27_ADNOMINAL_PHRASES") == set(_NIKL_R013_PHRASE_LICENSES)
    assert js_map_keys("NIKL_29_PHRASE_INSERTION") == set(_NIKL_R009_PHRASE_LICENSES)
