from __future__ import annotations

import importlib.util
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"


def _load_converter():
    spec = importlib.util.spec_from_file_location("convert_sigmorphon_ko", SCRIPTS / "convert_sigmorphon_ko.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_converter_preserves_ipa_and_marks_official_test_split(tmp_path):
    source = tmp_path / "kor_test.tsv"
    source.write_text("가다\tk a d a̠\n학교\th a k̚ k͈ j o̞\n", encoding="utf-8")
    rows = _load_converter().convert(source, expected_rows=2)
    assert len(rows) == 2
    assert rows[0]["split"] == "test"
    assert rows[0]["tokens"][0]["phoneme"] == "kada̠"
    assert rows[1]["tokens"][0]["phoneme"] == "hak̚k͈jo̞"


def test_converter_rejects_duplicate_words_and_bad_tsv(tmp_path):
    source = tmp_path / "kor_test.tsv"
    source.write_text("가다\tk a d a̠\n가다\tk a d a̠\n", encoding="utf-8")
    try:
        _load_converter().convert(source, expected_rows=2)
    except ValueError as exc:
        assert "duplicate word" in str(exc)
    else:
        raise AssertionError("duplicate lexical gold entries must fail closed")
    source.write_text("가다 only-one-column\n", encoding="utf-8")
    try:
        _load_converter().convert(source, expected_rows=1)
    except ValueError as exc:
        assert "exactly 2 TSV fields" in str(exc)
    else:
        raise AssertionError("malformed TSV must fail closed")
