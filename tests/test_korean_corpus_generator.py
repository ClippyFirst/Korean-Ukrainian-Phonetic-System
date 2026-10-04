from __future__ import annotations

import importlib.util
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "generate_korean_corpus.py"


def load_generator():
    spec = importlib.util.spec_from_file_location("korean_corpus_generator", SCRIPT)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_modern_hangul_inventory_is_exactly_11172():
    generator = load_generator()
    rows = generator.generate_syllable_inventory()

    assert len(rows) == 11172
    assert len({row["syllable"] for row in rows}) == 11172
    assert rows[0]["syllable"] == "가"
    assert rows[-1]["syllable"] == "힣"


def test_every_generated_syllable_round_trips():
    generator = load_generator()
    rows = generator.generate_syllable_inventory()

    for row in rows:
        l_index, v_index, t_index = generator.decompose_hangul(row["syllable"])
        assert generator.compose_hangul(l_index, v_index, t_index) == row["syllable"]


def test_canonical_correspondence_covers_modern_inventory():
    generator = load_generator()
    path = ROOT / "data" / "korean" / "canonical_correspondence.csv"

    rows, _ = generator.load_canonical_mapping(path)
    mapping, errors = generator.index_canonical_mapping(rows)

    assert not errors
    results = generator.validate_canonical_coverage(mapping)
    assert all(item.status == "PASS" for item in results)


def test_generated_syllable_csv_schema(tmp_path):
    generator = load_generator()
    rows = generator.generate_syllable_inventory()

    output = tmp_path / "syllables.csv"
    count = generator.write_csv(output, generator.SYLLABLE_FIELDS, rows)

    assert count == 11172
    assert output.read_text(encoding="utf-8-sig").splitlines()[0].split(",") == generator.SYLLABLE_FIELDS
